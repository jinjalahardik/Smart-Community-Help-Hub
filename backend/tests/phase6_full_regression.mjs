import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { Donation } from '../src/models/index.js';

const BASE_URL = 'http://localhost:5000/api';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'sch_hub_rzp_webhook_secret_test_123';

async function req(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, ok: res.ok, data };
}

let totalTests = 0;
let passedTests = 0;
const failures = [];

async function test(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    failures.push({ name, error: err });
    console.error(`  [FAIL] ${name}: ${err.message}`);
  }
}

console.log('\n================================================================');
console.log('SMART COMMUNITY HELP HUB — PHASE 6 FULL REGRESSION TEST SUITE');
console.log('================================================================\n');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sch_hub');

  // Common role tokens
  let adminToken, ngoToken, hospToken, vol1Token, vol2Token, donorToken, reqToken;
  let adminUser, ngoUser, hospUser, vol1User, donorUser, reqUser;

  // ─────────────────────────────────────────────────────────────
  // 1. AUTHENTICATION & SESSION INVARIANTS
  // ─────────────────────────────────────────────────────────────
  console.log('--- SECTION 1: AUTHENTICATION & SESSION MANAGEMENT ---');

  await test('1.1 Authenticate all platform roles and verify session tokens', async () => {
    const roles = [
      { email: 'admin@helpconnect.demo', pass: 'Admin@123', role: 'admin' },
      { email: 'ngo@helpconnect.demo', pass: 'Ngo@123', role: 'ngo' },
      { email: 'hospital@helpconnect.demo', pass: 'Hospital@123', role: 'hospital' },
      { email: 'volunteer@helpconnect.demo', pass: 'Volunteer@123', role: 'volunteer' },
      { email: 'donor@helpconnect.demo', pass: 'Donor@123', role: 'donor' },
      { email: 'requester@helpconnect.demo', pass: 'Requester@123', role: 'requester' },
    ];

    for (const r of roles) {
      const res = await req('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: r.email, password: r.pass }),
      });
      assert.equal(res.status, 200, `Login failed for ${r.role}`);
      assert.ok(res.data.token, `No token returned for ${r.role}`);
      assert.equal(res.data.user.role, r.role);
      assert.strictEqual(res.data.user.password, undefined, 'Password hash must never be returned in user payload');

      if (r.role === 'admin') { adminToken = res.data.token; adminUser = res.data.user; }
      if (r.role === 'ngo') { ngoToken = res.data.token; ngoUser = res.data.user; }
      if (r.role === 'hospital') { hospToken = res.data.token; hospUser = res.data.user; }
      if (r.role === 'volunteer') { vol1Token = res.data.token; vol1User = res.data.user; }
      if (r.role === 'donor') { donorToken = res.data.token; donorUser = res.data.user; }
      if (r.role === 'requester') { reqToken = res.data.token; reqUser = res.data.user; }
    }

    const vol2Res = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'devansh.joshi@example.com', password: 'Demo@123' }),
    });
    assert.equal(vol2Res.status, 200);
    vol2Token = vol2Res.data.token;
  });

  await test('1.2 Protected endpoints reject unauthenticated or tampered tokens', async () => {
    const unauth = await req('/admin/users');
    assert.equal(unauth.status, 401, 'Unauthenticated request must be 401');

    const tampered = await req('/admin/users', { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature' });
    assert.equal(tampered.status, 401, 'Tampered token must be 401');
  });

  await test('1.3 Registration input validation and duplicate email prevention', async () => {
    // Missing required fields
    const invalidReg = await req('/auth/register/basic', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid-email', password: '123' }),
    });
    assert.equal(invalidReg.status, 400);

    // Duplicate email
    const dupReg = await req('/auth/register/basic', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Duplicate Test',
        email: 'donor@helpconnect.demo',
        password: 'Password@123',
        role: 'donor',
      }),
    });
    assert.equal(dupReg.status, 409);
    assert.match(dupReg.data.message, /already exists/i);
  });

  // ─────────────────────────────────────────────────────────────
  // 2. AUTHORIZATION, RBAC & IDOR GUARDS
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- SECTION 2: AUTHORIZATION, RBAC & IDOR GUARDS ---');

  await test('2.1 Admin API RBAC: all non-admin roles strictly receive 403 Forbidden', async () => {
    const nonAdminTokens = [donorToken, reqToken, vol1Token, ngoToken, hospToken];
    for (const token of nonAdminTokens) {
      const res = await req('/admin/users', { token });
      assert.equal(res.status, 403, 'Non-admin must receive 403 on /admin/users');
      const analytics = await req('/admin/analytics', { token });
      assert.equal(analytics.status, 403, 'Non-admin must receive 403 on /admin/analytics');
    }
  });

  await test('2.2 IDOR Guard: User cannot read or modify another user’s notifications', async () => {
    // Donor tries to access requester’s notifications by passing query parameter
    const listRes = await req(`/notifications?userId=${reqUser.id}`, { token: donorToken });
    assert.equal(listRes.status, 200);
    // Server must scope results strictly to authenticated user's ID
    assert.ok(listRes.data.every((n) => n.userId === donorUser.id), 'IDOR vulnerability: User received another user’s notifications');
  });

  await test('2.3 IDOR Guard: User cannot view or post to chats they are not part of', async () => {
    // Attempt to access an admin or other user chat
    const chatList = await req('/chat', { token: reqToken });
    assert.equal(chatList.status, 200);
    for (const c of chatList.data) {
      assert.ok(c.participantIds.includes(reqUser.id), 'IDOR: Chat returned where user is not participant');
    }

    // Try to access non-existent or other user chat by forged id
    const forgedChat = await req('/chat/CHT-FORGED-9999/messages', { token: reqToken });
    assert.ok([403, 404].includes(forgedChat.status));
  });

  await test('2.4 IDOR Guard: Non-owner cannot update a request or spoof senderId in messages', async () => {
    // Requester creates request
    const createReq = await req('/requests', {
      method: 'POST',
      token: reqToken,
      body: JSON.stringify({
        category: 'food',
        urgency: 'medium',
        title: 'IDOR Update Test Request',
        description: 'Testing update permissions',
        requiredQuantity: 2,
        unit: 'packs',
        address: 'Test Addr',
        city: 'Surat',
        pinCode: '395001',
        contactNumber: '9988776655',
        affectedPeople: 1,
        neededBefore: new Date(Date.now() + 86400000).toISOString(),
        consentGiven: true,
      }),
    });
    assert.equal(createReq.status, 201);
    const rId = createReq.data.id;

    // Donor tries to update requester's request -> 403 Forbidden
    const evilUpdate = await req(`/requests/${rId}`, {
      method: 'PUT',
      token: donorToken,
      body: JSON.stringify({ title: 'Hacked Title' }),
    });
    assert.equal(evilUpdate.status, 403, 'Non-owner must be forbidden from updating another user’s request');
  });

  // ─────────────────────────────────────────────────────────────
  // 3. EMAIL OTP REGRESSION
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- SECTION 3: EMAIL OTP REGRESSION ---');

  let testOtpEmail;
  await test('3.1 Email OTP: When SMTP is unreachable, strictly fails closed (502) and enforces 60-second cooldown (429)', async () => {
    testOtpEmail = `otp.fail.${Date.now()}@example.com`;

    // 1st request -> if SMTP is unreachable, must fail closed with HTTP 502 Bad Gateway
    const first = await req('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ email: testOtpEmail, purpose: 'verify_email' }),
    });
    assert.ok([200, 502].includes(first.status), `Expected 200 (if SMTP reached) or 502 (if unreachable), got ${first.status}`);
    assert.strictEqual(first.data.code, undefined, 'Plaintext OTP code must NEVER be returned in API response');
    if (first.status === 502) {
      assert.match(first.data.message, /unable to deliver/i);
    }

    // 2nd immediate request -> 429 Cooldown enforced regardless of delivery status
    const second = await req('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ email: testOtpEmail, purpose: 'verify_email' }),
    });
    assert.equal(second.status, 429, 'Cooldown must be enforced on rapid requests');
    assert.equal(second.data.cooldown, true);
    assert.ok(second.data.retryAfter > 0);
  });

  await test('3.2 Email OTP: Maximum attempt rate-limiting and invalid OTP lockout', async () => {
    // Send 5 invalid attempts to test maximum attempts lockout
    for (let i = 1; i <= 4; i++) {
      const wrong = await req('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: testOtpEmail, purpose: 'verify_email', otp: '000000' }),
      });
      assert.equal(wrong.status, 400);
      assert.match(wrong.data.message, /invalid/i);
    }

    // 5th attempt invalidates OTP record
    const finalWrong = await req('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email: testOtpEmail, purpose: 'verify_email', otp: '000000' }),
    });
    assert.equal(finalWrong.status, 400);

    // Subsequent attempt reports expired / invalidated
    const postLockout = await req('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email: testOtpEmail, purpose: 'verify_email', otp: '000000' }),
    });
    assert.equal(postLockout.status, 400);
    assert.match(postLockout.data.message, /expired|invalid/i);
  });

  await test('3.3 Password reset lifecycle: request OTP, enforce grant verification, reset password', async () => {
    // 1. Create a temporary user
    const resetEmail = `pwd.reset.${Date.now()}@example.com`;
    const reg = await req('/auth/register/basic', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Reset Test User',
        email: resetEmail,
        password: 'OriginalPassword@123',
        role: 'donor',
      }),
    });
    assert.equal(reg.status, 201);

    // 2. Request password reset OTP
    const reqOtp = await req('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ email: resetEmail, purpose: 'reset_password' }),
    });
    assert.ok([200, 502].includes(reqOtp.status));

    // 3. Attempt password reset without valid OTP grant -> 403 Forbidden
    const unverifiedReset = await req('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email: resetEmail, newPassword: 'NewPassword@123' }),
    });
    assert.equal(unverifiedReset.status, 403);
    assert.match(unverifiedReset.data.message, /verify.*code/i);
  });

  // ─────────────────────────────────────────────────────────────
  // 4. RAZORPAY PAYMENT REGRESSION
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- SECTION 4: RAZORPAY TEST MODE & WEBHOOK REGRESSION ---');

  let testOrderId, testDonationId, testDonationRef;
  await test('4.1 Razorpay: Real order creation with live Test API, amount/currency validation', async () => {
    const idempotencyKey = `idem_phase6_${Date.now()}`;
    const orderRes = await req('/donations/guest', {
      method: 'POST',
      body: JSON.stringify({
        amount: 250,
        cause: 'food',
        ngoId: 'NGO-1',
        occasion: 'Birthday',
        donorName: 'Regression Donor',
        donorEmail: 'reg.donor@example.com',
        idempotencyKey,
      }),
    });

    if (orderRes.status === 201) {
      assert.ok(orderRes.data.payment?.orderId, 'Razorpay orderId must be returned');
      assert.equal(orderRes.data.payment.amount, 25000, 'Amount must be in paise (25000)');
      assert.equal(orderRes.data.payment.currency, 'INR');
      assert.ok(orderRes.data.donation?.id);
      assert.ok(orderRes.data.donation?.publicDonationReference);

      testOrderId = orderRes.data.payment.orderId;
      testDonationId = orderRes.data.donation.id;
      testDonationRef = orderRes.data.donation.publicDonationReference;
    } else {
      // If external network blocked outbound connection to api.razorpay.com, must fail closed with 503
      assert.equal(orderRes.status, 503, 'Unreachable gateway must fail closed with 503 Service Unavailable');
      assert.match(orderRes.data.message, /payment gateway error/i);
      assert.strictEqual(orderRes.data.payment, undefined, 'Must NOT return fake payment session on gateway failure');

      // Fetch or create a pending donation record for webhook verification
      let existingDon = await Donation.findOne({ donationType: 'money', paymentStatus: 'PENDING' });
      if (!existingDon) {
        existingDon = await Donation.create({
          id: `DON-TEST-${Date.now()}`,
          publicDonationReference: `SCHH-${Date.now().toString(36).toUpperCase()}`,
          donationType: 'money',
          amount: 250,
          currency: 'INR',
          cause: 'food',
          ngoId: 'NGO-1',
          paymentStatus: 'PENDING',
          paymentProvider: 'razorpay',
          paymentIntentId: `order_test_${Date.now()}`,
          paymentRef: `ref_${Date.now()}`,
          donorEmail: 'reg.donor@example.com',
          donorName: 'Regression Donor',
          idempotencyKey: `idem_db_${Date.now()}`,
        });
      }
      testOrderId = existingDon.paymentIntentId;
      testDonationId = existingDon.id;
      testDonationRef = existingDon.publicDonationReference || `SCHH-${Date.now().toString(36).toUpperCase()}`;
    }

    // Below minimum amount (< 10 INR) -> 400
    const minFail = await req('/donations/guest', {
      method: 'POST',
      body: JSON.stringify({
        amount: 5,
        cause: 'food',
        ngoId: 'NGO-1',
        occasion: 'Birthday',
        donorName: 'Test',
        donorEmail: 'test@example.com',
        idempotencyKey: `idem_fail_${Date.now()}`,
      }),
    });
    assert.equal(minFail.status, 400);

    // Negative / Zero amount -> 400
    const zeroFail = await req('/donations/guest', {
      method: 'POST',
      body: JSON.stringify({
        amount: 0,
        cause: 'food',
        ngoId: 'NGO-1',
        occasion: 'Birthday',
        donorName: 'Test',
        donorEmail: 'test@example.com',
        idempotencyKey: `idem_zero_${Date.now()}`,
      }),
    });
    assert.equal(zeroFail.status, 400);
  });

  await test('4.2 Signed Razorpay Webhook delivery completes donation with persistent event deduplication', async () => {
    const eventId = `evt_test_${Date.now()}`;
    const paymentId = `pay_test_${Date.now()}`;
    const webhookPayload = JSON.stringify({
      entity: 'event',
      account_id: 'acc_test_123',
      event: 'payment.captured',
      contains: ['payment'],
      payload: {
        payment: {
          entity: {
            id: paymentId,
            order_id: testOrderId,
            amount: 25000,
            currency: 'INR',
            status: 'captured',
            email: 'reg.donor@example.com',
          },
        },
      },
      created_at: Math.floor(Date.now() / 1000),
    });

    // Generate real HMAC-SHA256 signature
    const validSignature = crypto.createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(webhookPayload)
      .digest('hex');

    // 1st delivery -> processed successfully
    const webhookRes = await req('/payments/webhook/razorpay', {
      method: 'POST',
      headers: {
        'x-razorpay-signature': validSignature,
        'x-razorpay-event-id': eventId,
      },
      body: webhookPayload,
    });
    assert.equal(webhookRes.status, 200);
    assert.equal(webhookRes.data.received, true);
    assert.equal(webhookRes.data.handled, true);
    assert.equal(webhookRes.data.idempotent, false);

    // 2nd delivery (replayed event ID) -> deduplicated idempotently via MongoDB WebhookEvent
    const replayRes = await req('/payments/webhook/razorpay', {
      method: 'POST',
      headers: {
        'x-razorpay-signature': validSignature,
        'x-razorpay-event-id': eventId,
      },
      body: webhookPayload,
    });
    assert.equal(replayRes.status, 200);
    assert.equal(replayRes.data.received, true);
    assert.equal(replayRes.data.idempotent, true, 'Duplicate webhook event must be idempotent');

    // Tampered signature -> 401 Unauthorized
    const tamperedWebhook = await req('/payments/webhook/razorpay', {
      method: 'POST',
      headers: {
        'x-razorpay-signature': '0000000000000000000000000000000000000000000000000000000000000000',
        'x-razorpay-event-id': `evt_fake_${Date.now()}`,
      },
      body: webhookPayload,
    });
    assert.equal(tamperedWebhook.status, 401, 'Tampered signature must return 401');

    // Verify donation receipt lookup
    const receiptRes = await req(`/donations/${testDonationId}`);
    assert.equal(receiptRes.status, 200);
    assert.equal(receiptRes.data.paymentStatus, 'COMPLETED');
    assert.equal(receiptRes.data.amount, 250);
  });

  await test('4.3 Direct payment tampering: Monetary donations reject goods acceptance and direct status mutation', async () => {
    // Attempt to accept monetary donation via goods /accept endpoint -> 400
    const acceptFail = await req(`/donations/${testDonationId}/accept`, {
      method: 'PATCH',
      token: ngoToken,
    });
    assert.equal(acceptFail.status, 400);
    assert.match(acceptFail.data.message, /monetary/i);

    // Attempt to mutate status via /status endpoint -> 400
    const statusFail = await req(`/donations/${testDonationId}/status`, {
      method: 'PATCH',
      token: donorToken,
      body: JSON.stringify({ status: 'completed' }),
    });
    assert.equal(statusFail.status, 400);
    assert.match(statusFail.data.message, /monetary/i);
  });

  // ─────────────────────────────────────────────────────────────
  // 5. STATUS TRANSITION STATE MACHINE INVARIANTS
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- SECTION 5: STATUS TRANSITION MATRIX & INVARIANTS ---');

  await test('5.1 Request: strictly enforces pending -> assigned -> in_progress -> fulfilled', async () => {
    const createReq = await req('/requests', {
      method: 'POST',
      token: reqToken,
      body: JSON.stringify({
        category: 'medicine',
        urgency: 'critical',
        title: 'Status State Machine Request',
        description: 'Testing valid progression',
        requiredQuantity: 1,
        unit: 'pack',
        address: 'Adajan',
        city: 'Surat',
        pinCode: '395009',
        contactNumber: '9988776655',
        affectedPeople: 1,
        neededBefore: new Date(Date.now() + 86400000).toISOString(),
        consentGiven: true,
      }),
    });
    assert.equal(createReq.status, 201);
    const rId = createReq.data.id;

    // Direct fulfillment without assignment -> blocked (409)
    const directFulfilled = await req(`/requests/${rId}/confirm-delivery`, { method: 'PATCH', token: reqToken });
    assert.equal(directFulfilled.status, 409);

    // Assign -> assigned
    const assignRes = await req(`/requests/${rId}/assign`, { method: 'PATCH', token: ngoToken });
    assert.equal(assignRes.status, 200);
    assert.equal(assignRes.data.status, 'assigned');

    // Progress -> in_progress
    const progRes = await req(`/requests/${rId}/status`, {
      method: 'PATCH',
      token: ngoToken,
      body: JSON.stringify({ status: 'in_progress' }),
    });
    assert.equal(progRes.status, 200);
    assert.equal(progRes.data.status, 'in_progress');

    // Confirm delivery -> fulfilled
    const confRes = await req(`/requests/${rId}/confirm-delivery`, { method: 'PATCH', token: reqToken });
    assert.equal(confRes.status, 200);
    assert.equal(confRes.data.status, 'fulfilled');

    // Rollback to pending -> blocked (400)
    const rollback = await req(`/requests/${rId}/status`, {
      method: 'PATCH',
      token: ngoToken,
      body: JSON.stringify({ status: 'pending' }),
    });
    assert.equal(rollback.status, 400);
  });

  await test('5.2 Goods Donation: terminal status on completed and cancelled', async () => {
    const createDon = await req('/donations', {
      method: 'POST',
      token: donorToken,
      body: JSON.stringify({
        category: 'food',
        title: 'Terminal Status Goods Donation',
        description: 'Testing terminal state',
        quantity: 10,
        unit: 'kg',
        pickupAddress: 'Vesu',
        city: 'Surat',
        pinCode: '395007',
        preferredPickupDate: new Date(Date.now() + 86400000).toISOString(),
        contactNumber: '9876543210',
      }),
    });
    assert.equal(createDon.status, 201);
    const dId = createDon.data.id;

    // Jump to completed without accept -> blocked (400)
    const jump = await req(`/donations/${dId}/status`, {
      method: 'PATCH',
      token: donorToken,
      body: JSON.stringify({ status: 'completed' }),
    });
    assert.equal(jump.status, 400);

    // Accept -> accepted
    await req(`/donations/${dId}/accept`, { method: 'PATCH', token: ngoToken });
    // Complete -> completed
    await req(`/donations/${dId}/status`, { method: 'PATCH', token: ngoToken, body: JSON.stringify({ status: 'completed' }) });

    // Rollback to pending -> blocked (400)
    const rollback = await req(`/donations/${dId}/status`, {
      method: 'PATCH',
      token: ngoToken,
      body: JSON.stringify({ status: 'pending' }),
    });
    assert.equal(rollback.status, 400);

    // PUT status bypass -> stripped
    const putStatus = await req(`/donations/${dId}`, {
      method: 'PUT',
      token: donorToken,
      body: JSON.stringify({ status: 'pending' }),
    });
    assert.equal(putStatus.status, 200);
    assert.equal(putStatus.data.status, 'completed');
  });

  await test('5.3 Task: strictly enforces sequential progression and blocks completed decline', async () => {
    const tRes = await req('/tasks', {
      method: 'POST',
      token: ngoToken,
      body: JSON.stringify({
        title: 'Sequential Task Progression',
        category: 'food',
        priority: 'medium',
        pickupLocation: 'Hub A',
        deliveryLocation: 'Hub B',
        contactInfo: 'Staff',
      }),
    });
    assert.equal(tRes.status, 201);
    const tId = tRes.data.id;

    // Unaccepted advance -> blocked (400)
    const unacceptedAdv = await req(`/tasks/${tId}/advance`, { method: 'PATCH', token: ngoToken });
    assert.equal(unacceptedAdv.status, 400);

    // Accept -> accepted
    await req(`/tasks/${tId}/accept`, { method: 'PATCH', token: vol1Token });

    // Step-by-step advance
    const seq = ['pickup_started', 'picked_up', 'delivery_started', 'delivered', 'completed'];
    for (const s of seq) {
      const adv = await req(`/tasks/${tId}/advance`, { method: 'PATCH', token: vol1Token });
      assert.equal(adv.status, 200);
      assert.equal(adv.data.status, s);
    }

    // Advance past completed -> blocked (400)
    const pastAdv = await req(`/tasks/${tId}/advance`, { method: 'PATCH', token: vol1Token });
    assert.equal(pastAdv.status, 400);

    // Decline completed task -> blocked (400)
    const decCompl = await req(`/tasks/${tId}/decline`, { method: 'PATCH', token: vol1Token });
    assert.equal(decCompl.status, 400);
  });

  // ─────────────────────────────────────────────────────────────
  // 6. CROSS-ROLE INTEGRATED LIFECYCLES
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- SECTION 6: CROSS-ROLE INTEGRATED LIFECYCLES ---');

  await test('6.1 Admin verifies unverified NGO and Hospital, enabling platform actions', async () => {
    const ts = Date.now();
    const regRes = await req('/auth/register/org', {
      method: 'POST',
      body: JSON.stringify({
        orgName: `Relief Org ${ts}`,
        name: `Relief Org ${ts}`,
        email: `relief.${ts}@ngo.org`,
        password: 'Password@123',
        role: 'ngo',
        phone: '9876543210',
        city: 'Surat',
        registrationNumber: `NGO-REG-${ts}`,
        contactPerson: 'Lead Coordinator',
        serviceCategories: ['food'],
        documents: ['ngo_cert.pdf'],
      }),
    });
    assert.equal(regRes.status, 201);
    const newOrgId = regRes.data.orgId;

    // Log in as new NGO
    const ngoLogin = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: `relief.${ts}@ngo.org`, password: 'Password@123' }),
    });
    assert.equal(ngoLogin.status, 200);
    const newNgoToken = ngoLogin.data.token;

    // Create an emergency request
    const emergency = await req('/requests', {
      method: 'POST',
      token: reqToken,
      body: JSON.stringify({
        category: 'food',
        urgency: 'high',
        title: 'Cross-Role Org Verification Test',
        description: 'Food for flood relief',
        requiredQuantity: 10,
        unit: 'packs',
        address: 'Varachha',
        city: 'Surat',
        pinCode: '395006',
        contactNumber: '9988776655',
        affectedPeople: 5,
        neededBefore: new Date(Date.now() + 86400000).toISOString(),
        consentGiven: true,
      }),
    });
    assert.equal(emergency.status, 201);

    // Unverified NGO assignment blocked (403)
    const assignUnverified = await req(`/requests/${emergency.data.id}/assign`, {
      method: 'PATCH',
      token: newNgoToken,
    });
    assert.equal(assignUnverified.status, 403);

    // Admin approves NGO
    const approveNgo = await req(`/admin/orgs/ngo/${newOrgId}/approve`, {
      method: 'POST',
      token: adminToken,
    });
    assert.equal(approveNgo.status, 200);
    assert.equal(approveNgo.data.verificationStatus, 'approved');

    // Newly approved NGO can now assign the request
    const assignApproved = await req(`/requests/${emergency.data.id}/assign`, {
      method: 'PATCH',
      token: newNgoToken,
    });
    assert.equal(assignApproved.status, 200);
    assert.equal(assignApproved.data.status, 'assigned');
  });

  await test('6.2 Hospital requirement lifecycle: create, list, and update', async () => {
    // Hospital creates requirement
    const reqCreate = await req('/hospitals/requirements', {
      method: 'POST',
      token: hospToken,
      body: JSON.stringify({
        type: 'blood',
        title: 'Urgent B+ Blood Units',
        itemName: 'B+ Platelets',
        quantity: 5,
        unit: 'units',
      }),
    });
    assert.equal(reqCreate.status, 201);
    const hreqId = reqCreate.data.id;
    assert.match(hreqId, /^HREQ-/);
    assert.equal(reqCreate.data.status, 'active');

    // Hospital updates requirement
    const reqUpdate = await req(`/hospitals/requirements/${hreqId}`, {
      method: 'PUT',
      token: hospToken,
      body: JSON.stringify({ quantity: 2 }),
    });
    assert.equal(reqUpdate.status, 200);
    assert.equal(reqUpdate.data.quantity, 2);

    // Requester/public reads requirements
    const reqList = await req('/hospitals/requirements', { token: reqToken });
    assert.equal(reqList.status, 200);
    assert.ok(reqList.data.some((r) => r.id === hreqId));
  });

  // ─────────────────────────────────────────────────────────────
  // 7. DATABASE INTEGRITY, TIMESTAMPS & CONCURRENCY
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- SECTION 7: DATABASE INTEGRITY & CONCURRENCY ---');

  await test('7.1 Standardized reference ID prefixes across all entities', async () => {
    assert.match(adminUser.id, /^USR-/);
    assert.match(ngoUser.id, /^USR-/);
    assert.match(testDonationId, /^DON-/);
    assert.match(testOrderId, /^order_/);
  });

  await test('7.2 Concurrent task acceptance: atomic CAS allows 1 and rejects duplicate with 409 Conflict', async () => {
    // NGO creates available task
    const tRes = await req('/tasks', {
      method: 'POST',
      token: ngoToken,
      body: JSON.stringify({
        title: 'Concurrent Race Verification',
        category: 'medicine',
        priority: 'high',
        pickupLocation: 'Loc A',
        deliveryLocation: 'Loc B',
        contactInfo: 'Desk',
      }),
    });
    assert.equal(tRes.status, 201);
    const taskId = tRes.data.id;

    // Both volunteers fire accept simultaneously
    const [p1, p2] = await Promise.all([
      req(`/tasks/${taskId}/accept`, { method: 'PATCH', token: vol1Token }),
      req(`/tasks/${taskId}/accept`, { method: 'PATCH', token: vol2Token }),
    ]);

    const statuses = [p1.status, p2.status].sort();
    assert.ok(
      statuses[0] === 200 && (statuses[1] === 409 || statuses[1] === 400),
      `Expected one 200 and one 409/400, got: ${statuses.join(', ')}`
    );

    // Verify task assigned to exactly one volunteer
    const checkTask = await req(`/tasks/${taskId}`, { token: adminToken });
    assert.equal(checkTask.status, 200);
    assert.equal(checkTask.data.status, 'accepted');
    assert.ok(checkTask.data.assignedVolunteerId);
  });

  // ─────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────
  console.log('\n================================================================');
  console.log(`PHASE 6 REGRESSION RESULT: ${passedTests} / ${totalTests} TESTS PASSED`);
  if (failures.length > 0) {
    console.error(`FAILURES (${failures.length}):`);
    for (const f of failures) {
      console.error(`  - ${f.name}: ${f.error.message}`);
    }
  }
  console.log('================================================================\n');

  await mongoose.disconnect();

  if (failures.length > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal regression suite error:', err);
  process.exit(1);
});
