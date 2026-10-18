# Smart Community Help Hub — Backend

Express 5 + MongoDB REST API. Run from this directory.

## Prerequisites

- Node >= 20, MongoDB (Atlas URI in `.env`)
- `cp .env.example .env` and fill in values (never commit `.env`)

## Sandbox mode (default, no keys needed)

```bash
# .env
PAYMENT_GATEWAY=sandbox
npm install
npm run dev   # http://localhost:5000, health: /api/health
```

Donations redirect to the built-in sandbox approval page; no real money moves.

## Razorpay TEST MODE ONLY (no live keys — live mode is not implemented)

1. Create test keys: https://dashboard.razorpay.com/app/keys (Test Mode).
2. Configure webhook (test mode): Dashboard → Settings → Webhooks →
   `https://<your-public-url>/api/payments/webhook/razorpay`, secret → `.env`.
   Razorpay delivers webhooks from its servers, so **localhost alone cannot
   receive them** — use a tunnel (e.g. `ngrok http 5000`) or a deployed URL.
3. `.env`:

```bash
PAYMENT_GATEWAY=razorpay
API_BASE_URL=https://<your-public-url>
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

4. Restart: `npm run dev`. Missing keys fail closed (503/400, safe messages).

## Payment security model

- Orders are created server-side from the validated donation amount (paise, INR).
- `Donation.paymentIntentId` = Razorpay `order_id`; `paymentRef` = `payment_id`.
- Checkout callbacks are re-verified server-side (HMAC + live fetch of the
  payment: order match, exact amount, INR, captured) before COMPLETED.
- Webhooks verify `X-Razorpay-Signature` over the raw body and deduplicate by
  `x-razorpay-event-id` (unique index) — campaign totals/receipts fire once.
- Phase 1 Email OTP and receipt-claim flows are untouched.
