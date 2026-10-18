import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { Donation } from '../models/index.js';
import {
  processPaymentEvent,
  sandboxSettle,
  sandboxCancel,
  verifyRazorpayCheckout,
  processRazorpayWebhook,
} from '../services/moneyService.js';
import { isRazorpay } from '../services/payment.js';
import { validateRazorpayVerify } from '../middleware/validate.js';

const router = Router();

const CLIENT_URL_ROOT = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')[0].trim().replace(/\/$/, '');

function successUrl(donation) {
  const ref = donation.publicDonationReference || '';
  const id = donation.id || '';
  if (!ref && !id) return `${CLIENT_URL_ROOT}/celebrate`;
  return `${CLIENT_URL_ROOT}/celebrate/complete?ref=${encodeURIComponent(ref)}&id=${encodeURIComponent(id)}`;
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// Helmet's default CSP (`form-action 'self'`, `script-src 'self'`) would block
// the sandbox approval form twice in a real browser: the redirect to the
// frontend success page (cross-origin: backend :5000 -> frontend :5173) gets
// aborted as net::ERR_ABORTED, and the inline "busy guard" script never runs.
// The sandbox page is a mock hosted-payment page, so we relax the CSP ONLY for
// these routes (all other API responses keep helmet's defaults).
const SANDBOX_CSP_ALLOW = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const SANDBOX_CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "font-src 'self' https: data:",
  `form-action 'self' ${SANDBOX_CSP_ALLOW.join(' ')}`,
  "frame-ancestors 'self'",
  "img-src 'self' data:",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "script-src-attr 'none'",
  "style-src 'self' https: 'unsafe-inline'",
].join(';');

// POST /api/payments/webhook — sandbox webhook ONLY. The body must carry a
// signature in x-schub-signature. Duplicate webhooks are idempotent and never
// double-count. Razorpay uses /webhook/razorpay below.
router.post('/webhook', async (req, res, next) => {
  try {
    const signature = req.headers['x-schub-signature'] || '';
    const body = typeof req.rawBody === 'string' ? req.rawBody : JSON.stringify(req.body);
    const result = await processPaymentEvent({ body, signature });
    res.json({ received: true, handled: result.handled, idempotent: !!result.idempotent });
  } catch (err) { next(err); }
});

// POST /api/payments/verify — Razorpay Checkout success verification.
// The SPA sends the Checkout callback (order/payment/signature) plus our
// donationId; the server re-verifies against the STORED order id, fetches
// the payment from Razorpay, and only then allows COMPLETED. A valid-looking
// client callback alone never completes a donation.
const verifyLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/verify', verifyLimiter, validateRazorpayVerify, async (req, res, next) => {
  try {
    if (!isRazorpay()) {
      return res.status(400).json({ message: 'Razorpay verification is not enabled on this server.' });
    }
    const { donationId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    const result = await verifyRazorpayCheckout({
      donationId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });
    res.json({ verified: true, donation: result.donation });
  } catch (err) { next(err); }
});

// POST /api/payments/webhook/razorpay — real Razorpay webhook.
// Verified with HMAC-SHA256(rawBody, RAZORPAY_WEBHOOK_SECRET); fails closed
// when the secret is missing. Deduplicated by x-razorpay-event-id.
// NOTE: Razorpay delivers webhooks from its servers, so this endpoint needs
// a publicly reachable URL — localhost alone cannot receive them.
const razorpayWebhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/webhook/razorpay', razorpayWebhookLimiter, async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'] || '';
    const eventId = req.headers['x-razorpay-event-id'] || '';
    const rawBody = typeof req.rawBody === 'string' ? req.rawBody : null;
    if (!rawBody) return res.status(400).json({ message: 'Invalid webhook payload' });
    const result = await processRazorpayWebhook({ rawBody, signature, eventId });
    res.json({ received: true, handled: result.handled, idempotent: !!result.idempotent });
  } catch (err) { next(err); }
});

// --- Sandbox "hosted payment page" (PAYMENT_GATEWAY=sandbox only) ---
// In Razorpay mode these routes refuse to settle: sandbox must never be able
// to complete a Razorpay donation, and vice versa.

function getPendingBySession(sessionId) {
  return Donation.findOne({ donationType: 'money', paymentIntentId: sessionId });
}

function sandboxBlocked(res, donation) {
  // A Razorpay donation must only complete via Razorpay verification/webhook.
  if (donation && donation.paymentProvider === 'razorpay') {
    return res.status(400).send('<h3>This donation uses Razorpay checkout and cannot be approved here.</h3>');
  }
  if (isRazorpay()) {
    return res.status(400).send('<h3>Sandbox payments are disabled (PAYMENT_GATEWAY=razorpay).</h3>');
  }
  return null;
}

router.get('/approve/:sessionId', async (req, res, next) => {
  let donation;
  try { donation = await getPendingBySession(req.params.sessionId); }
  catch (err) { return next(err); }
  if (!donation) return res.status(404).send('<h3>Payment session not found</h3>');
  if (sandboxBlocked(res, donation)) return;
  // If already completed, redirect straight to the success page
  if (donation.paymentStatus === 'COMPLETED') {
    res.setHeader('Content-Security-Policy', SANDBOX_CSP);
    return res.redirect(302, successUrl(donation));
  }

  const amount = (donation.amount || 0).toLocaleString('en-IN');
  const ngo = escapeHtml(donation.ngoName || 'the NGO');
  const donor = escapeHtml(donation.anonymous ? 'Anonymous Donor' : donation.donorName || 'Donor');
  const action = `/api/payments/approve/${req.params.sessionId}`;
  const cancel = `/api/payments/cancel/${req.params.sessionId}`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Security-Policy', SANDBOX_CSP);
  res.send(`<!doctype html>
  <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Sandbox payment</title>
  <style>body{font-family:system-ui,sans-serif;background:#f0fdfa;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0}
  .card{background:#fff;border-radius:16px;box-shadow:0 10px 40px rgba(13,148,136,.15);padding:32px;max-width:360px;width:100%;text-align:center}
  .brand{color:#0F766E;font-weight:700;letter-spacing:.5px}
  h1{font-size:20px;margin:16px 0 4px} .amt{font-size:32px;font-weight:800;color:#0F766E;margin:8px 0 4px}
  .note{color:#64748b;font-size:14px;margin-bottom:24px}
  form{display:flex;flex-direction:column;gap:10px}
  button{padding:12px;border-radius:10px;border:none;font-size:15px;font-weight:600;cursor:pointer}
  .pay{background:#0F766E;color:#fff}
  .cancel{background:#f1f5f9;color:#475569}
  .foot{color:#94a3b8;font-size:12px;margin-top:16px}
  /* Processing overlay — shown while the approval request is in flight */
  .processing{position:fixed;inset:0;background:rgba(240,253,250,.94);display:none;place-items:center;z-index:50}
  .processing .box{text-align:center;color:#0F766E}
  .processing .label{font-weight:700;font-size:16px;margin-top:12px}
  .dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:#0a9a8d;margin:0 3px;animation:blink 1.1s infinite}
  .dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
  @keyframes blink{0%,80%,100%{opacity:.2}40%{opacity:1}}</style></head><body>
  <div class="card">
    <div class="brand">Smart Community Help Hub · sandbox gateway</div>
    <h1>Complete your donation</h1>
    <div class="amt">₹${amount}</div>
    <div class="note">${donor} donating to ${ngo} (INR)</div>
    <form method="post" action="${action}">
      <button class="pay" type="submit">Approve payment</button>
    </form>
    <form method="post" action="${cancel}">
      <button class="cancel" type="submit">Cancel</button>
    </form>
    <div class="foot">Demo gateway — no real money moves.</div>
  </div>
  <div class="processing" id="processing"><div class="box"><div><span class="dot"></span><span class="dot"></span><span class="dot"></span></div><div class="label" id="processingLabel">Processing payment…</div></div></div>
  <script>
  (function () {
    var busy = false;
    var forms = document.querySelectorAll('form');
    for (var i = 0; i < forms.length; i += 1) {
      forms[i].addEventListener('submit', function (event) {
        // Never allow a second submit while the first is in flight (no
        // duplicate API requests from double clicks or Enter presses).
        if (busy) { event.preventDefault(); event.stopPropagation(); return; }
        busy = true;
        var label = this.querySelector('.pay') ? 'Processing payment…' : 'Cancelling…';
        var buttons = document.querySelectorAll('button');
        for (var b = 0; b < buttons.length; b += 1) { buttons[b].disabled = true; buttons[b].style.cursor = 'wait'; }
        document.getElementById('processingLabel').textContent = label;
        document.getElementById('processing').style.display = 'grid';
      });
    }
  })();
  </script>
  </body></html>`);
});

// The donor approved. The sandbox "provider" settles the intent and POSTs the
// signed webhook through the same verified path used in production.
router.post('/approve/:sessionId', async (req, res, next) => {
  try {
    const donation = await getPendingBySession(req.params.sessionId);
    if (!donation) return res.status(404).json({ message: 'Payment session not found' });
    if (sandboxBlocked(res, donation)) return;
    if (donation.paymentStatus !== 'PENDING') {
      res.setHeader('Content-Security-Policy', SANDBOX_CSP);
      return res.redirect(302, successUrl(donation)); // already handled → just go back
    }
    const { body, signature } = sandboxSettle(donation);
    await processPaymentEvent({ body, signature });
    res.setHeader('Content-Security-Policy', SANDBOX_CSP);
    res.redirect(302, successUrl(donation));
  } catch (err) { next(err); }
});

// Donor cancelled — the sandbox provider fires payment.cancelled.
router.post('/cancel/:sessionId', async (req, res, next) => {
  try {
    const donation = await getPendingBySession(req.params.sessionId);
    if (donation && donation.paymentStatus === 'PENDING') {
      if (sandboxBlocked(res, donation)) return;
      const { body, signature } = sandboxCancel(donation);
      await processPaymentEvent({ body, signature });
    }
    res.setHeader('Content-Security-Policy', SANDBOX_CSP);
    res.redirect(302, `${CLIENT_URL_ROOT}/celebrate`);
  } catch (err) { next(err); }
});

export default router;
