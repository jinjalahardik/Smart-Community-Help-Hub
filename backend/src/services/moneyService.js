// Shared money-donation logic used by both the new /api/donations money
// endpoints and the legacy Celebrate & Give routes (/celebrations/give,
// /celebrations/:id/donate). Every monetary contribution is a `Donation`
// record with donationType 'money' and a server-verified payment lifecycle:
//   createMoneyDonation -> Donation(paymentStatus PENDING) + sandbox session
//   donor approves on the hosted page                        (client, no trust)
//   signed webhook -> processPaymentEvent -> COMPLETED       (server, verified)
//
// The client never sets payment state; completion is idempotent so duplicate
// webhooks can never double-count.

import {
  User,
  Ngo,
  Donation,
  Notification,
  CelebrationCampaign,
  WebhookEvent,
} from '../models/index.js';
import { createWithRetry } from '../utils/id.js';
import {
  createPaymentSession,
  signedWebhook,
  verifyWebhookSignature,
  API_BASE_URL,
  isRazorpay,
  createRazorpayOrder,
  verifyCheckoutSignature,
  verifyRazorpayWebhookSignature,
  fetchRazorpayPayment,
  getRazorpayConfig,
} from './payment.js';
import { sendToUser } from './sse.js';
import { sendMoneyReceiptEmail } from './email.js';
import {
  CELEBRATION_OCCASIONS,
  CELEBRATION_CAUSES,
} from '../../../frontend/src/constants/celebrations.js';

export const ALLOWED_CAUSES = ['food', 'clothes', 'medicine', 'blood'];
export const MIN_AMOUNT = 10;
export const MAX_AMOUNT = 1_000_000;

const PUBLIC_REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

function notFound(message = 'Donation not found') {
  const err = new Error(message);
  err.status = 404;
  return err;
}

function forbidden(message = 'You do not have permission to do that') {
  const err = new Error(message);
  err.status = 403;
  return err;
}

function nowIso() {
  return new Date().toISOString();
}

export function occasionLabel(value) {
  return CELEBRATION_OCCASIONS.find((o) => o.value === value)?.label || value || '';
}

export function causeLabel(value) {
  return CELEBRATION_CAUSES.find((c) => c.value === value)?.label || value || '';
}

export function parseAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || !Number.isInteger(amount)) return null;
  if (amount < MIN_AMOUNT || amount > MAX_AMOUNT) return null;
  return amount;
}

export async function verifyNgo(ngoId) {
  const ngo = await Ngo.findOne({ id: ngoId });
  if (!ngo) return null;
  if (ngo.verificationStatus && ngo.verificationStatus !== 'approved') return null;
  return ngo;
}

export function makePublicReference() {
  let s = '';
  for (let i = 0; i < 8; i += 1) {
    s += PUBLIC_REF_ALPHABET[Math.floor(Math.random() * PUBLIC_REF_ALPHABET.length)];
  }
  return `SCHH-${s}`;
}

async function uniquePublicReference() {
  for (let i = 0; i < 20; i += 1) {
    const ref = makePublicReference();
    const exists = await Donation.findOne({ publicDonationReference: ref });
    if (!exists) return ref;
  }
  return `SCHH-${Date.now().toString(36).toUpperCase()}`;
}

export function safeMoneyDonation(d) {
  return {
    id: d.id,
    publicDonationReference: d.publicDonationReference,
    donationType: d.donationType,
    donorName: d.anonymous ? 'Anonymous Donor' : (d.donorName || 'Anonymous Donor'),
    anonymous: !!d.anonymous,
    amount: d.amount,
    currency: d.currency || 'INR',
    occasion: d.occasion,
    occasionLabel: occasionLabel(d.occasion),
    cause: d.cause,
    causeLabel: causeLabel(d.cause),
    ngoId: d.ngoId,
    ngoName: d.ngoName,
    campaignId: d.campaignId || null,
    paymentStatus: d.paymentStatus,
    paymentProvider: d.paymentProvider || 'sandbox',
    paymentRef: d.paymentRef,
    createdAt: d.createdAt,
    completedAt: d.completedAt,
  };
}

// Create a PENDING monetary donation and its (sandbox) payment session.
// `campaign` is the CelebrationCampaign doc when giving to a campaign; null for
// Quick Give. Authenticated donors pass `user`; guests pass guestName/guestEmail.
export async function createMoneyDonation({ user, body, campaign }) {
  const {
    amount: rawAmount,
    ngoId,
    occasion,
    cause,
    anonymous = false,
    idempotencyKey,
    donorName: guestName,
    donorEmail: guestEmail,
    donorPhone,
    campaignId,
  } = body || {};

  if (!idempotencyKey || !String(idempotencyKey).trim()) {
    throw badRequest('idempotencyKey is required to prevent duplicate payments');
  }
  const amount = parseAmount(rawAmount);
  if (amount == null) throw badRequest(`Amount must be between ₹${MIN_AMOUNT} and ₹${MAX_AMOUNT}`);
  if (!ALLOWED_CAUSES.includes(cause)) throw badRequest('Invalid cause');

  const targetNgoId = campaign ? campaign.ngoId : ngoId;
  if (!targetNgoId) throw badRequest('Choose a verified NGO to receive the funds');
  const ngo = await verifyNgo(targetNgoId);
  if (!ngo) throw badRequest('Choose a verified NGO to receive the funds');

  if (campaign) {
    if (!campaign.isPublic) throw notFound('Campaign not found');
    if (campaign.status !== 'active') throw badRequest('This campaign is no longer accepting donations');
  }

  // Idempotent creates: reusing an idempotencyKey returns the existing session
  // instead of creating a new charge. Both money surfaces (/api/donations/*
  // and /api/celebrations/*) funnel through here, so both gateways stay in
  // sync by construction.
  const existing = await Donation.findOne({ donationType: 'money', idempotencyKey });
  if (existing) {
    return {
      donation: safeMoneyDonation(existing),
      payment: existing.paymentProvider === 'razorpay'
        ? razorpayCheckoutPayload(existing)
        : {
            sessionId: existing.paymentIntentId,
            paymentRef: existing.paymentRef,
            gateway: existing.paymentProvider || 'sandbox',
            approveUrl: existing.paymentIntentId
              ? `${API_BASE_URL}/api/payments/approve/${existing.paymentIntentId}`
              : null,
          },
      reused: true,
    };
  }

  const isAnonymous = anonymous === true || anonymous === 'true';
  const isAuth = Boolean(user);
  const donorName = isAnonymous
    ? 'Anonymous Donor'
    : (user?.name || String(guestName || '').trim() || 'Anonymous Donor');
  const donorEmail = user?.email || String(guestEmail || '').trim();

  if (!isAuth && !donorEmail) {
    throw badRequest('Email is required so we can send your receipt and let you retrieve it later');
  }

  // Gateway branch: sandbox keeps the hosted approval page; Razorpay
  // creates a real order server-side (amount from validated `amount` only).
  let paymentIntentId;
  let paymentRef;
  let paymentProvider;
  let razorpayOrder = null;
  if (isRazorpay()) {
    // Fail closed when Razorpay credentials are missing (503, safe message).
    razorpayOrder = await createRazorpayOrder({
      amountRupees: amount,
      receipt: String(idempotencyKey).slice(0, 40),
      notes: { ngoId: ngo.id, cause, donorEmail },
    });
    paymentProvider = 'razorpay';
    paymentIntentId = razorpayOrder.id; // order_id is the source of truth
    paymentRef = razorpayOrder.receipt || `RZPREC-${Date.now().toString(36)}`;
  } else {
    const payment = await createPaymentSession({ amount, currency: 'INR', idempotencyKey });
    paymentProvider = payment.gateway;
    paymentIntentId = payment.sessionId;
    paymentRef = payment.paymentRef;
  }

  const publicDonationReference = await uniquePublicReference();

  const donation = await createWithRetry(Donation, 'DON', {
    donationType: 'money',
    donorType: isAuth ? 'authenticated' : 'guest',
    donorId: isAuth ? user.id : null,
    donorName,
    donorEmail,
    donorPhone,
    anonymous: isAnonymous,
    occasion: campaign ? (occasion || campaign.eventType) : occasion,
    cause,
    ngoId: ngo.id,
    ngoName: ngo.name,
    campaignId: campaign ? campaign.id : (campaignId || null),
    amount,
    currency: 'INR',
    paymentStatus: 'PENDING',
    paymentProvider,
    paymentIntentId,
    paymentRef,
    idempotencyKey,
    publicDonationReference,
    status: 'pending',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });

  if (paymentProvider === 'razorpay') {
    return { donation: safeMoneyDonation(donation), payment: razorpayCheckoutPayload(donation) };
  }
  return {
    donation: safeMoneyDonation(donation),
    payment: {
      sessionId: paymentIntentId,
      paymentRef,
      gateway: paymentProvider,
      approveUrl: `${API_BASE_URL}/api/payments/approve/${paymentIntentId}`,
    },
  };
}

// Payload the SPA needs to open Razorpay Standard Checkout — public data
// only. Secrets (KEY_SECRET, WEBHOOK_SECRET) never leave the server.
function razorpayCheckoutPayload(donation) {
  const { keyId } = getRazorpayConfig();
  return {
    gateway: 'razorpay',
    keyId,
    orderId: donation.paymentIntentId,
    amount: Math.round(Number(donation.amount) * 100), // paise
    currency: 'INR',
    donationId: donation.id,
    publicReference: donation.publicDonationReference,
    donorEmail: donation.donorEmail || undefined,
    donorName: donation.anonymous ? undefined : (donation.donorName || undefined),
  };
}

// Process a verified gateway webhook event. Idempotent: duplicate or late
// webhooks for an already-handled intent return the current state without
// double-counting campaign totals or re-sending notifications/emails.
export async function processPaymentEvent({ body, signature }) {
  if (!verifyWebhookSignature(body, signature)) {
    const err = new Error('Invalid webhook signature');
    err.status = 401;
    throw err;
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch {
    throw badRequest('Malformed webhook payload');
  }

  const { type, data, id: eventId } = event;
  if (!type || !data?.intentId) throw badRequest('Missing event type or intentId');

  // Deduplicate via persistent MongoDB WebhookEvent collection
  const dedupId = eventId || (data.paymentRef ? `evt_${data.paymentRef}` : null);
  if (dedupId) {
    try {
      await WebhookEvent.create({ eventId: dedupId, provider: 'sandbox', type });
    } catch (err) {
      if (err?.code === 11000) {
        const donation = await Donation.findOne({ donationType: 'money', paymentIntentId: data.intentId });
        return { handled: true, idempotent: true, donation: donation ? safeMoneyDonation(donation) : null };
      }
      throw err;
    }
  }

  const statusByType = {
    'payment.completed': 'COMPLETED',
    'payment.cancelled': 'CANCELLED',
    'payment.failed': 'FAILED',
  };
  const nextPaymentStatus = statusByType[type];
  if (!nextPaymentStatus) return { handled: false };

  const donation = await Donation.findOne({ donationType: 'money', paymentIntentId: data.intentId });
  if (!donation) throw notFound('Donation not found for this payment');

  if (donation.paymentStatus === 'COMPLETED') {
    return { handled: true, idempotent: true, donation: safeMoneyDonation(donation) };
  }

  const patch = { paymentStatus: nextPaymentStatus, updatedAt: nowIso() };
  if (type === 'payment.completed') {
    patch.status = 'completed';
    patch.completedAt = nowIso();
  }

  // Only a non-completed row can transition, so a raced duplicate webhook can
  // never flip an already-completed donation.
  const updated = await Donation.findOneAndUpdate(
    { id: donation.id, paymentStatus: { $ne: 'COMPLETED' } },
    { $set: patch },
    { new: true }
  );
  if (!updated) {
    const current = await Donation.findOne({ id: donation.id });
    return { handled: true, idempotent: true, donation: safeMoneyDonation(current || donation) };
  }

  if (type === 'payment.completed') {
    await onCompleted(updated);
  }

  return { handled: true, donation: safeMoneyDonation(updated) };
}

// Atomically mark a money donation COMPLETED (single-flight). Returns the
// current safe view plus whether this call was a duplicate. onCompleted()
// side effects (campaign totals, notifications, receipt email) run exactly
// once — only for the caller that wins the PENDING -> COMPLETED transition.
async function completeMoneyDonation(donation, { paymentRef } = {}) {
  if (donation.paymentStatus === 'COMPLETED') {
    return { donation: safeMoneyDonation(donation), idempotent: true };
  }
  const patch = {
    paymentStatus: 'COMPLETED',
    status: 'completed',
    completedAt: nowIso(),
    updatedAt: nowIso(),
  };
  if (paymentRef) patch.paymentRef = paymentRef;
  const updated = await Donation.findOneAndUpdate(
    { id: donation.id, paymentStatus: { $ne: 'COMPLETED' } },
    { $set: patch },
    { new: true },
  );
  if (!updated) {
    const current = await Donation.findOne({ id: donation.id });
    return { donation: safeMoneyDonation(current || donation), idempotent: true };
  }
  await onCompleted(updated);
  return { donation: safeMoneyDonation(updated), idempotent: false };
}

// Verify a Razorpay Checkout success callback server-side.
// The stored Donation.paymentIntentId (order_id) is the source of truth —
// the client-supplied orderId must match it but is never trusted alone.
// Steps: signature check -> fetch payment from Razorpay -> order/amount/
// currency/captured checks -> atomic COMPLETED. Throws with safe messages.
export async function verifyRazorpayCheckout({ donationId, orderId, paymentId, signature }) {
  if (!donationId || !paymentId || !signature) {
    throw badRequest('Payment verification needs donationId, paymentId and signature');
  }
  const donation = await Donation.findOne({ donationType: 'money', id: donationId });
  if (!donation) throw notFound('Donation not found for this payment');
  if (donation.paymentProvider !== 'razorpay') {
    throw badRequest('This donation does not use Razorpay');
  }
  const storedOrderId = donation.paymentIntentId;
  if (!storedOrderId) throw badRequest('No Razorpay order is attached to this donation');
  if (orderId && orderId !== storedOrderId) {
    throw badRequest('Payment verification failed. Please try again.');
  }

  // 1. HMAC-SHA256(storedOrderId + "|" + paymentId, KEY_SECRET), constant-time.
  verifyCheckoutSignature({ storedOrderId, paymentId, signature });

  // 2. Server-side fetch: the payment must belong to our order, match the
  //    donation amount exactly (paise), be INR, and be captured.
  let payment;
  try {
    payment = await fetchRazorpayPayment(paymentId);
  } catch {
    throw badRequest('Could not confirm the payment with Razorpay. Please try again.');
  }
  const paymentOrderId = payment?.order_id;
  const paymentAmountPaise = Number(payment?.amount);
  const paymentCurrency = payment?.currency;
  const paymentStatus = payment?.status;
  if (paymentOrderId !== storedOrderId) {
    throw badRequest('Payment verification failed. Please try again.');
  }
  if (paymentAmountPaise !== Math.round(Number(donation.amount) * 100)) {
    throw badRequest('Payment verification failed. Please try again.');
  }
  if (paymentCurrency !== 'INR' && paymentCurrency !== donation.currency) {
    throw badRequest('Payment verification failed. Please try again.');
  }
  if (paymentStatus !== 'captured' && paymentStatus !== 'authorized') {
    throw badRequest('Payment is not confirmed yet. Please try again in a moment.');
  }

  // 3. Atomic completion (idempotent on refresh/double-callback).
  const { donation: safe } = await completeMoneyDonation(donation, { paymentRef: paymentId });
  return { donation: safe, paymentId };
}

// Process a real Razorpay webhook (raw body + X-Razorpay-Signature +
// x-razorpay-event-id). Handles payment.captured / payment.failed.
// Unknown event types return { handled: false }. Duplicates (same event id)
// are ignored via the unique WebhookEvent constraint.
export async function processRazorpayWebhook({ rawBody, signature, eventId }) {
  if (!(process.env.RAZORPAY_WEBHOOK_SECRET || '').trim()) {
    const err = new Error('Payment webhook is not configured. Please try again later.');
    err.status = 500;
    throw err;
  }
  if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
    const err = new Error('Invalid webhook signature');
    err.status = 401;
    throw err;
  }
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    throw badRequest('Malformed webhook payload');
  }

  // Deduplicate by provider event id (atomic insert; duplicate -> ignore).
  const dedupId = eventId || event?.id || null;
  if (dedupId) {
    try {
      await WebhookEvent.create({ eventId: dedupId, provider: 'razorpay', type: event?.event });
    } catch (err) {
      if (err?.code === 11000) {
        return { handled: true, idempotent: true };
      }
      throw err;
    }
  }

  const type = event?.event;
  const entity = event?.payload?.payment?.entity;
  if (!type || !entity) return { handled: false };

  if (type === 'payment.captured') {
    const orderId = entity.order_id;
    const donation = orderId
      ? await Donation.findOne({ donationType: 'money', paymentIntentId: orderId })
      : null;
    if (!donation) return { handled: false };
    // Amount/currency guard against misrouted events.
    if (Number(entity.amount) !== Math.round(Number(donation.amount) * 100)) {
      return { handled: false };
    }
    if (entity.currency && entity.currency !== 'INR' && entity.currency !== donation.currency) {
      return { handled: false };
    }
    const { donation: safe, idempotent } = await completeMoneyDonation(donation, {
      paymentRef: entity.id || undefined,
    });
    return { handled: true, idempotent, donation: safe };
  }

  if (type === 'payment.failed') {
    const orderId = entity.order_id;
    const donation = orderId
      ? await Donation.findOne({ donationType: 'money', paymentIntentId: orderId })
      : null;
    if (!donation) return { handled: false };
    if (donation.paymentStatus === 'COMPLETED') {
      return { handled: true, idempotent: true, donation: safeMoneyDonation(donation) };
    }
    const updated = await Donation.findOneAndUpdate(
      { id: donation.id, paymentStatus: 'PENDING' },
      { $set: { paymentStatus: 'FAILED', updatedAt: nowIso() } },
      { new: true },
    );
    return { handled: true, donation: safeMoneyDonation(updated || donation) };
  }

  return { handled: false };
}

async function onCompleted(donation) {
  if (donation.campaignId) {
    await CelebrationCampaign.findOneAndUpdate(
      { id: donation.campaignId },
      { $inc: { raisedAmount: donation.amount, donationCount: 1 }, $set: { updatedAt: nowIso() } }
    );
    const campaign = await CelebrationCampaign.findOne({ id: donation.campaignId });
    if (campaign) {
      const notification = await createWithRetry(Notification, 'NTF', {
        userId: campaign.ownerId,
        category: 'celebration',
        title: `New donation: ₹${donation.amount.toLocaleString('en-IN')}`,
        message: `${donation.donorName} contributed to "${campaign.eventTitle}".`,
        read: false,
        createdAt: nowIso(),
        relatedEntity: { campaignId: campaign.id, donationId: donation.id },
      });
      sendToUser(campaign.ownerId, 'notification', notification);
    }
  }

  if (donation.donorId) {
    sendToUser(donation.donorId, 'donation', { type: 'completed', donation: safeMoneyDonation(donation) });
  }

  if (donation.donorEmail) {
    sendMoneyReceiptEmail({
      to: donation.donorEmail,
      name: donation.donorName,
      ref: donation.publicDonationReference,
      amount: donation.amount,
      occasionLabel: occasionLabel(donation.occasion),
      causeLabel: causeLabel(donation.cause),
      ngoName: donation.ngoName,
    }).catch(() => {});
  }
}

// Verified receipts for the email that owns them (OTP-gated; never keyed by
// sequential id). Only COMPLETED donations are returned. Does not expose the
// donor's email in the payload.
export async function receiptsForEmail(email) {
  const address = String(email || '').toLowerCase().trim();
  const donations = await Donation.find({
    donationType: 'money',
    donorEmail: address,
    paymentStatus: 'COMPLETED',
  }).sort({ createdAt: -1 }).limit(100);
  return donations.map(safeMoneyDonation);
}

// Claim a COMPLETED guest donation into the logged-in account. Only matches
// when the donation's donorEmail belongs to the authenticated user, so we
// never leak/move someone else's receipt.
export async function claimDonation({ userId, reference }) {
  const ref = String(reference || '').trim();
  if (!ref) throw badRequest('publicDonationReference is required');
  const donation = await Donation.findOne({
    donationType: 'money',
    publicDonationReference: ref,
    donorType: 'guest',
    paymentStatus: 'COMPLETED',
  });
  if (!donation) throw notFound('No completed guest donation found for that reference');
  const user = await User.findOne({ id: userId });
  if (!user) throw notFound('User not found');
  if (String(donation.donorEmail || '').toLowerCase() !== String(user.email).toLowerCase()) {
    throw badRequest('This receipt belongs to a different email on this account');
  }
  const updated = await Donation.findOneAndUpdate(
    { id: donation.id },
    {
      $set: {
        donorId: user.id,
        donorType: 'authenticated',
        updatedAt: nowIso(),
      },
    },
    { new: true }
  );
  return safeMoneyDonation(updated);
}

export async function myMoneyDonations(userId) {
  const donations = await Donation.find({ donationType: 'money', donorId: userId })
    .sort({ createdAt: -1 })
    .limit(200);
  return donations.map(safeMoneyDonation);
}

// Public safe view used by GET /api/donations/:id for money donations.
export function publicMoneyView(d) {
  return {
    ...safeMoneyDonation(d),
    donorEmail: undefined,
  };
}

// Sandbox approval flow: the "provider" settles the intent and fires its
// signed webhook. Returns the signed event so the webhook processor (not the
// client) marks the donation completed.
export function sandboxSettle(donation) {
  return signedWebhook(donation, 'payment.completed');
}

export function sandboxCancel(donation) {
  return signedWebhook(donation, 'payment.cancelled');
}

export { badRequest, notFound, forbidden };