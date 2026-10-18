import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/auth.js';
import {
  validateGuestGive,
  validateCreatePayment,
  validateReceiptRequest,
  validateReceiptVerify,
  validateClaim,
} from '../middleware/validate.js';
import { Donation } from '../models/index.js';
import { issueOtp, verifyOtp as verifyOtpCode } from '../services/otp.js';
import { sendOtpEmail } from '../services/email.js';
import {
  createMoneyDonation,
  receiptsForEmail,
  claimDonation,
  myMoneyDonations,
  publicMoneyView,
} from '../services/moneyService.js';

const router = Router();

// Public guest endpoints get a tighter budget than the global 300/min.
const publicGiveLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/donations/guest — Quick Give as a guest (no login, no campaign).
router.post('/guest', publicGiveLimiter, validateGuestGive, async (req, res, next) => {
  try {
    const result = await createMoneyDonation({ user: null, body: req.body, campaign: null });
    res.status(201).json(result);
  } catch (err) { next(err); }
});

// POST /api/donations/create-payment — Quick Give while logged in.
router.post('/create-payment', requireAuth, validateCreatePayment, async (req, res, next) => {
  try {
    const result = await createMoneyDonation({ user: req.user, body: req.body, campaign: null });
    res.status(201).json(result);
  } catch (err) { next(err); }
});

// POST /api/donations/receipt/request-otp — start OTP-gated receipt lookup.
router.post('/receipt/request-otp', otpLimiter, validateReceiptRequest, async (req, res, next) => {
  try {
    const { email } = req.body;
    const issued = await issueOtp(email, 'receipt_lookup');
    if (!issued) return res.status(400).json({ message: 'Email is required' });

    if (issued.cooldown) {
      return res.status(429).json({
        cooldown: true,
        retryAfter: issued.retryAfter,
        message: `Please wait ${issued.retryAfter} seconds before requesting another code.`,
      });
    }

    if (issued.code) {
      const result = await sendOtpEmail(email, issued.code);
      if (!result || !result.sent) {
        return res.status(502).json({ message: 'Unable to send verification email right now. Please try again later.' });
      }
    }

    res.json({ sent: true });
  } catch (err) { next(err); }
});

// POST /api/donations/receipt/verify — OTP unlocks this email's receipts.
router.post('/receipt/verify', otpLimiter, validateReceiptVerify, async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyOtpCode(email, 'receipt_lookup', otp);
    if (!result || !result.valid) {
      if (result?.reason === 'max_attempts') {
        return res.status(429).json({ message: 'Too many verification attempts. Please request a new code.' });
      }
      if (result?.reason === 'expired') {
        return res.status(400).json({ message: 'This verification code has expired. Please request a new code.' });
      }
      return res.status(400).json({ message: 'Invalid verification code.' });
    }
    const receipts = await receiptsForEmail(email);
    res.json({ receipts });
  } catch (err) { next(err); }
});

// POST /api/donations/claim — link a completed guest receipt to this account.
router.post('/claim', requireAuth, validateClaim, async (req, res, next) => {
  try {
    const donation = await claimDonation({ userId: req.userId, reference: req.body.reference });
    res.json(donation);
  } catch (err) { next(err); }
});

// GET /api/donations/mine — logged-in contributor's money receipts.
router.get('/mine', requireAuth, async (req, res, next) => {
  try {
    const donations = await myMoneyDonations(req.userId);
    res.json(donations);
  } catch (err) { next(err); }
});

// GET /api/donations/:id — public safe view for money donations. Goods
// donations fall through (next) to the authenticated goods router below.
router.get('/:id', async (req, res, next) => {
  try {
    const item = await Donation.findOne({ id: req.params.id });
    if (!item) return next();
    if (item.donationType !== 'money') return next();
    if (item.paymentStatus !== 'COMPLETED') return res.status(404).json({ message: 'Donation not found' });
    res.json(publicMoneyView(item));
  } catch (err) { next(err); }
});

export default router;