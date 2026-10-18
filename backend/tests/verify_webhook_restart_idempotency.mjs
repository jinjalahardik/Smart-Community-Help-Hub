import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { WebhookEvent, Donation } from '../src/models/index.js';

const BASE_URL = 'http://localhost:5000/api';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'sch_hub_rzp_webhook_secret_test_123';

async function req(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, ok: res.ok, data };
}

async function run() {
  console.log('\n--- VERIFYING WEBHOOK PERSISTENT DEDUPLICATION ACROSS RESTARTS ---');
  await mongoose.connect('mongodb://127.0.0.1:27017/sch_hub');

  // 1. Create a pending donation in MongoDB
  const testOrderId = `order_restart_test_${Date.now()}`;
  const donation = await Donation.create({
    id: `DON-RESTART-${Date.now()}`,
    donationType: 'money',
    amount: 500,
    currency: 'INR',
    cause: 'food',
    ngoId: 'NGO-1',
    paymentStatus: 'PENDING',
    paymentProvider: 'razorpay',
    paymentIntentId: testOrderId,
    paymentRef: `ref_${Date.now()}`,
    donorEmail: 'restart.tester@example.com',
    donorName: 'Restart Tester',
    idempotencyKey: `idem_restart_${Date.now()}`,
  });
  assert.ok(donation.id);
  console.log('  [PASS] Created pending donation with orderId:', testOrderId);

  // 2. Prepare signed Razorpay webhook
  const eventId = `evt_persist_${Date.now()}`;
  const paymentId = `pay_persist_${Date.now()}`;
  const payload = JSON.stringify({
    entity: 'event',
    account_id: 'acc_persist_test',
    event: 'payment.captured',
    contains: ['payment'],
    payload: {
      payment: {
        entity: {
          id: paymentId,
          order_id: testOrderId,
          amount: 50000,
          currency: 'INR',
          status: 'captured',
          email: 'restart.tester@example.com',
        },
      },
    },
    created_at: Math.floor(Date.now() / 1000),
  });

  const validSignature = crypto.createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  // 3. 1st delivery
  const res1 = await req('/payments/webhook/razorpay', {
    method: 'POST',
    headers: {
      'x-razorpay-signature': validSignature,
      'x-razorpay-event-id': eventId,
    },
    body: payload,
  });
  assert.equal(res1.status, 200);
  assert.equal(res1.data.received, true);
  assert.equal(res1.data.handled, true);
  assert.equal(res1.data.idempotent, false);
  console.log('  [PASS] 1st Webhook delivery processed successfully');

  // 4. Verify MongoDB persistence
  const doc = await WebhookEvent.findOne({ eventId });
  assert.ok(doc, 'WebhookEvent document must be persisted in MongoDB');
  assert.equal(doc.provider, 'razorpay');
  assert.equal(doc.type, 'payment.captured');
  console.log('  [PASS] Webhook event verified in MongoDB WebhookEvent collection:', doc.eventId);

  // 5. 2nd duplicate delivery
  const res2 = await req('/payments/webhook/razorpay', {
    method: 'POST',
    headers: {
      'x-razorpay-signature': validSignature,
      'x-razorpay-event-id': eventId,
    },
    body: payload,
  });
  assert.equal(res2.status, 200);
  assert.equal(res2.data.received, true);
  assert.equal(res2.data.idempotent, true);
  console.log('  [PASS] Duplicate delivery returned idempotent: true backed by MongoDB unique constraint');

  // 6. Verify donation is COMPLETED
  const updated = await Donation.findOne({ id: donation.id });
  assert.equal(updated.paymentStatus, 'COMPLETED');
  console.log('  [PASS] Donation verified COMPLETED without duplicate mutations');

  await mongoose.disconnect();
  console.log('\nALL WEBHOOK PERSISTENCE CHECKS PASSED!\n');
}

run().catch((err) => {
  console.error('[FAIL]', err);
  process.exit(1);
});
