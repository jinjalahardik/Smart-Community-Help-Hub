import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { signedWebhook, buildWebhookEvent, verifyWebhookSignature } from '../src/services/payment.js';
import { Donation, WebhookEvent } from '../src/models/index.js';

const BASE_URL = 'http://localhost:5000/api';

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
  console.log('\n--- VERIFYING SANDBOX PAYMENT & PERSISTENT DEDUPLICATION ---');
  await mongoose.connect('mongodb://127.0.0.1:27017/sch_hub');

  // 1. Create a Sandbox Pending Donation record directly in DB to simulate sandbox session
  const testSessionId = `CID-test-${Date.now().toString(36)}`;
  const testRef = `TXN-test-${Date.now().toString(36)}`;
  const donation = await Donation.create({
    id: `DON-TEST-${Date.now()}`,
    donationType: 'money',
    amount: 150,
    currency: 'INR',
    cause: 'food',
    ngoId: 'NGO-1',
    paymentStatus: 'PENDING',
    paymentProvider: 'sandbox',
    paymentIntentId: testSessionId,
    paymentRef: testRef,
    donorEmail: 'sandbox.tester@example.com',
    donorName: 'Sandbox Tester',
    idempotencyKey: `idem_sandbox_${Date.now()}`,
  });

  assert.ok(donation.id);
  console.log('  [PASS] Created Sandbox PENDING donation:', donation.id);

  // 2. Generate signed sandbox webhook
  const { body, signature } = signedWebhook(donation, 'payment.completed');
  assert.ok(verifyWebhookSignature(body, signature), 'Sandbox HMAC signature must be valid');

  const parsedBody = JSON.parse(body);
  const eventId = parsedBody.id;
  console.log('  [PASS] Generated signed sandbox webhook payload with eventId:', eventId);

  // 3. Deliver to /api/payments/webhook
  const delivery1 = await req('/payments/webhook', {
    method: 'POST',
    headers: { 'x-schub-signature': signature },
    body,
  });
  assert.equal(delivery1.status, 200);
  assert.equal(delivery1.data.received, true);
  assert.equal(delivery1.data.handled, true);
  assert.equal(delivery1.data.idempotent, false);
  console.log('  [PASS] 1st Sandbox webhook delivered and handled successfully');

  // 4. Verify MongoDB WebhookEvent persistence
  const persistedEvent = await WebhookEvent.findOne({ eventId });
  assert.ok(persistedEvent, 'WebhookEvent record must exist in MongoDB');
  assert.equal(persistedEvent.provider, 'sandbox');
  console.log('  [PASS] Webhook event found in MongoDB WebhookEvent collection:', persistedEvent.eventId);

  // 5. Deliver duplicate webhook (replayed delivery)
  const delivery2 = await req('/payments/webhook', {
    method: 'POST',
    headers: { 'x-schub-signature': signature },
    body,
  });
  assert.equal(delivery2.status, 200);
  assert.equal(delivery2.data.idempotent, true, 'Duplicate webhook must be idempotent');
  console.log('  [PASS] 2nd duplicate Sandbox webhook returned idempotent: true via MongoDB unique constraint');

  // 6. Verify tampered signature is rejected
  const tampered = await req('/payments/webhook', {
    method: 'POST',
    headers: { 'x-schub-signature': 'invalid_tampered_signature_hex' },
    body,
  });
  assert.equal(tampered.status, 401, 'Tampered sandbox signature must return 401');
  console.log('  [PASS] Tampered sandbox webhook signature rejected with 401');

  // 7. Verify donation is now COMPLETED
  const updatedDonation = await Donation.findOne({ id: donation.id });
  assert.equal(updatedDonation.paymentStatus, 'COMPLETED');
  assert.equal(updatedDonation.status, 'completed');
  console.log('  [PASS] Sandbox donation status atomically updated to COMPLETED');

  await mongoose.disconnect();
  console.log('\nALL SANDBOX & PERSISTENT DEDUPLICATION CHECKS PASSED!\n');
}

run().catch((err) => {
  console.error('[FAIL]', err);
  process.exit(1);
});
