// Payment gateway seam.
//
// Two modes, selected by PAYMENT_GATEWAY:
//
//   'sandbox' (default) — provider-shaped demo that mirrors the real flow:
//     1. createPaymentSession() -> PENDING donation + a "hosted" approval page
//     2. the donor approves on that hosted page (never on our SPA)
//     3. the (sandbox) payment backend settles and POSTs a webhook to
//        /api/payments/webhook signed with an HMAC header
//     4. the webhook handler verifies the signature and marks the donation
//        COMPLETED — the client is never trusted for payment state.
//
//   'razorpay' (TEST MODE ONLY) — real Razorpay Standard Checkout:
//     1. createRazorpayOrder() runs SERVER-SIDE from the validated donation
//        amount (paise, INR) -> order.id stored in Donation.paymentIntentId
//     2. the SPA opens Razorpay Checkout with key_id + order_id only
//        (never the secret) and collects razorpay_payment_id/signature
//     3. POST /api/payments/verify re-computes
//        HMAC-SHA256(storedOrderId + "|" + payment_id, KEY_SECRET) with a
//        constant-time compare, then fetches the payment/order from Razorpay
//        server-side and checks amount/currency/captured status before the
//        donation may become COMPLETED — a valid-looking client callback
//        alone NEVER completes a donation.
//     4. POST /api/payments/webhook/razorpay handles payment.captured /
//        payment.failed, verified with HMAC-SHA256(rawBody, WEBHOOK_SECRET).
//        Requires a publicly reachable URL; localhost cannot receive
//        Razorpay webhooks (see README / .env.example).
//
// To go live with another provider, implement the same three exports behind
// `PAYMENT_GATEWAY` and swap the internals here.

import crypto from 'crypto';

export const GATEWAY = process.env.PAYMENT_GATEWAY || 'sandbox';

export function activeGateway() {
  return (process.env.PAYMENT_GATEWAY || 'sandbox').toLowerCase().trim();
}

export function isRazorpay() {
  return activeGateway() === 'razorpay';
}

// Shared secret that signs sandbox webhooks. In production this must be set
// via environment. Never commit real secrets; set via environment.
const SANDBOX_WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || 'sch_hub_demo_webhook_secret_change_me';

// Base URL of this API used to build approval URLs (sandbox "hosted" page).
export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

export function makeTransactionRef(prefix = 'TXN') {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(4).toString('hex')}`;
}

function signSandbox(body) {
  return crypto.createHmac('sha256', SANDBOX_WEBHOOK_SECRET).update(body).digest('hex');
}

// Constant-time signature comparison (Stripe-style header verification).
export function verifyWebhookSignature(body, signature) {
  if (typeof body !== 'string' || !signature) return false;
  const provided = Buffer.from(String(signature));
  const computed = Buffer.from(signSandbox(body));
  if (provided.length !== computed.length) return false;
  return crypto.timingSafeEqual(provided, computed);
}

// The sandbox "provider" emits one webhook event shaped like a real provider's
// `payment_intent.succeeded`. The same verification/processing path is used no
// matter which gateway emits it.
export function buildWebhookEvent(donation, type) {
  return {
    id: `evt_${donation.paymentRef}`,
    type, // payment.completed | payment.cancelled | payment.failed
    createdAt: new Date().toISOString(),
    data: {
      intentId: donation.paymentIntentId,
      paymentRef: donation.paymentRef,
      amount: donation.amount,
      currency: donation.currency,
      donationId: donation.id,
    },
  };
}

export function signedWebhook(donation, type) {
  const body = JSON.stringify(buildWebhookEvent(donation, type));
  return { body, signature: signSandbox(body) };
}

// ----- Sandbox-specific session helpers -----

let sessionCounter = 0;

export async function createPaymentSession({ amount, currency = 'INR', idempotencyKey, donationId }) {
  const sessionId = `CID-${Date.now().toString(36)}-${(sessionCounter += 1).toString(36)}${crypto.randomBytes(2).toString('hex')}`;
  return {
    sessionId,
    paymentRef: makeTransactionRef('TXN'),
    gateway: GATEWAY,
    approveUrl: `${API_BASE_URL}/api/payments/approve/${sessionId}`,
    amount,
    currency,
  };
}

// ----- Razorpay (TEST MODE ONLY) -----

// Fail closed: Razorpay mode refuses to operate without explicit credentials.
// Env is read lazily (not at import time) so tests can set process.env first.
export function getRazorpayConfig() {
  const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  const webhookSecret = (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim();
  if (!keyId || !keySecret) {
    const err = new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to use PAYMENT_GATEWAY=razorpay.');
    err.status = 503;
    throw err;
  }
  return { keyId, keySecret, webhookSecret };
}

let razorpayClient = null;

export async function getRazorpayClient() {
  const { keyId, keySecret } = getRazorpayConfig();
  if (razorpayClient) return razorpayClient;
  const { default: Razorpay } = await import('razorpay');
  razorpayClient = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return razorpayClient;
}

// For tests: reset the cached client when credentials change.
export function resetRazorpayClient() {
  razorpayClient = null;
}

// Create a Razorpay Order server-side. Amount is rupees (integer) from the
// already-validated donation; Razorpay requires paise.
export async function createRazorpayOrder({ amountRupees, receipt, notes }) {
  const client = await getRazorpayClient();
  const amountPaise = Math.round(Number(amountRupees) * 100);
  if (!Number.isInteger(amountPaise) || amountPaise <= 0) {
    const err = new Error('Invalid amount for Razorpay order');
    err.status = 400;
    throw err;
  }
  let order;
  try {
    order = await client.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: String(receipt || `rcpt_${Date.now()}`).slice(0, 40),
      notes: notes || {},
    });
  } catch (err) {
    // Safe diagnostic logging: error name, message, code, statusCode, response?.data
    // Never log secrets (RAZORPAY_KEY_SECRET, SMTP credentials, JWT secrets, OTPs, passwords)
    console.error('[payment] Razorpay orders.create failed:', {
      name: err?.name,
      message: err?.message,
      code: err?.code || err?.error?.code,
      statusCode: err?.statusCode || err?.status,
      responseData: err?.response?.data || (err?.error ? { description: err.error.description } : undefined),
    });

    const isNetworkOrSdkTypeError =
      err instanceof TypeError &&
      (err?.message?.includes("reading 'status'") || err?.message?.includes("reading 'data'"));

    if (isNetworkOrSdkTypeError) {
      const error = new Error('Payment gateway error: Payment gateway temporarily unavailable');
      error.status = 503;
      throw error;
    }

    const description = err?.error?.description || err?.message;
    const isGenericOrInternal =
      !description ||
      description.includes('Cannot read properties of undefined') ||
      description.includes('undefined (reading');

    const safeMsg = isGenericOrInternal
      ? 'Payment gateway error: Payment gateway temporarily unavailable'
      : (description.startsWith('Payment gateway') ? description : `Payment gateway error: ${description}`);

    const error = new Error(safeMsg);
    error.status = err?.statusCode || err?.status || 503;
    throw error;
  }

  // Validate the returned order before using it:
  if (!order?.id || order.amount !== amountPaise || order.currency !== 'INR') {
    throw new Error('Invalid Razorpay order response');
  }

  return order; // { id, amount, currency, status, ... }
}

// Verify the Checkout success callback:
//   HMAC-SHA256(storedOrderId + "|" + razorpay_payment_id, KEY_SECRET)
// The order id MUST come from our Donation record, never from the client.
// Throws (status 400) on mismatch; returns true on success.
export function verifyCheckoutSignature({ storedOrderId, paymentId, signature }) {
  const { keySecret } = getRazorpayConfig();
  if (!storedOrderId || !paymentId || !signature) {
    const err = new Error('Payment verification failed. Please try again.');
    err.status = 400;
    throw err;
  }
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${storedOrderId}|${paymentId}`)
    .digest('hex');
  const a = Buffer.from(String(signature));
  const b = Buffer.from(expected);
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!valid) {
    const err = new Error('Payment verification failed. Please try again.');
    err.status = 400;
    throw err;
  }
  return true;
}

// Verify a Razorpay webhook: HMAC-SHA256(rawBody, WEBHOOK_SECRET) vs the
// X-Razorpay-Signature header. rawBody must be the exact bytes received —
// never re-stringify parsed JSON. Fail closed when the webhook secret is
// missing (returns false; callers map to 401/500 without leaking details).
export function verifyRazorpayWebhookSignature(rawBody, signature) {
  const webhookSecret = (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim();
  if (!webhookSecret) return false;
  if (typeof rawBody !== 'string' || !signature) return false;
  let expected;
  try {
    expected = crypto.createHmac('sha256', webhookSecret).update(rawBody, 'utf8').digest('hex');
  } catch {
    return false;
  }
  const a = Buffer.from(String(signature));
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function fetchRazorpayPayment(paymentId) {
  const client = await getRazorpayClient();
  try {
    return await client.payments.fetch(paymentId);
  } catch (err) {
    console.error('[payment] Razorpay payments.fetch failed:', {
      name: err?.name,
      message: err?.message,
      code: err?.code || err?.error?.code,
      statusCode: err?.statusCode || err?.status,
      responseData: err?.response?.data || (err?.error ? { description: err.error.description } : undefined),
    });
    const error = new Error(err?.error?.description || 'Payment gateway temporarily unavailable');
    error.status = err?.statusCode || err?.status || 503;
    throw error;
  }
}

export async function fetchRazorpayOrder(orderId) {
  const client = await getRazorpayClient();
  try {
    return await client.orders.fetch(orderId);
  } catch (err) {
    console.error('[payment] Razorpay orders.fetch failed:', {
      name: err?.name,
      message: err?.message,
      code: err?.code || err?.error?.code,
      statusCode: err?.statusCode || err?.status,
      responseData: err?.response?.data || (err?.error ? { description: err.error.description } : undefined),
    });
    const error = new Error(err?.error?.description || 'Payment gateway temporarily unavailable');
    error.status = err?.statusCode || err?.status || 503;
    throw error;
  }
}
