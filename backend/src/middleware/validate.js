// Input validation using express-validator.
// Provides reusable validation chains and a middleware that runs them.

import { body, query, param, validationResult } from 'express-validator';

// Middleware that checks for validation errors and returns 400 with details.
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const messages = errors.array().map((e) => e.msg);
  return res.status(400).json({ message: messages.join('; '), errors: errors.array() });
}

// ---------- Auth ----------

export const validateRegisterBasic = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['donor', 'volunteer', 'requester']).withMessage('Invalid role for basic registration'),
  body('phone').optional().matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
  body('city').optional().trim().notEmpty(),
  validate,
];

export const validateRegisterOrg = [
  body('orgName').trim().notEmpty().withMessage('Organization name is required'),
  body('contactPerson').trim().notEmpty().withMessage('Contact person is required'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['ngo', 'hospital']).withMessage('Role must be ngo or hospital'),
  body('phone').optional().matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
  body('city').optional().trim().notEmpty(),
  validate,
];

export const validateLogin = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

export const validateRequestOtp = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  validate,
];

export const validateVerifyOtp = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('otp').trim().matches(/^\d{6}$/).withMessage('OTP must be 6 digits'),
  validate,
];

export const validateResetPassword = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
];

// ---------- Donations ----------

export const validateCreateDonation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').isIn(['food', 'clothes', 'medicine', 'blood']).withMessage('Invalid category'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('contactNumber').optional().matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
  validate,
];

// ---------- Requests ----------

export const validateCreateRequest = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').isIn(['food', 'clothes', 'medicine', 'blood', 'shelter', 'other']).withMessage('Invalid category'),
  body('urgency').isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid urgency'),
  body('requiredQuantity').isInt({ min: 1 }).withMessage('Required quantity must be at least 1'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('contactNumber').optional().matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
  body('affectedPeople').optional().isInt({ min: 1 }).withMessage('Affected people must be at least 1'),
  body('consentGiven').custom((val) => val === true || val === 'true').withMessage('Consent is required'),
  validate,
];

// ---------- Chat ----------

export const validateSendMessage = [
  // NOTE: senderId is intentionally NOT accepted from the client.
  // The controller always uses req.user.id to prevent sender spoofing.
  body('text').trim().notEmpty().withMessage('Message text is required'),
  validate,
];

// ---------- Chatbot ----------

export const validateChatbot = [
  body('message').trim().notEmpty().withMessage('Message is required'),
  validate,
];

// ---------- Feedback ----------

export const validateCreateFeedback = [
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  validate,
];

// ---------- Celebrations (Celebrate & Give) ----------

export const validateCelebrationCreate = [
  body('eventType').trim().notEmpty().withMessage('Occasion type is required'),
  body('eventTitle').trim().notEmpty().withMessage('Event title is required'),
  body('cause').isIn(['food', 'clothes', 'medicine', 'blood']).withMessage('Invalid cause'),
  body('ngoId').trim().notEmpty().withMessage('NGO is required'),
  body('goalAmount').isInt({ min: 10 }).withMessage('Goal amount must be at least ₹10'),
  validate,
];

// Server never trusts the client for identity or payment status; it only
// accepts the user's chosen amount + ngo + occasion, then performs its own
// (sandbox) charge and verification.
export const validateGive = [
  body('amount').isInt({ min: 10 }).withMessage('Amount must be at least ₹10'),
  body('cause').isIn(['food', 'clothes', 'medicine', 'blood']).withMessage('Invalid cause'),
  body('ngoId').trim().notEmpty().withMessage('NGO is required'),
  body('occasion').trim().notEmpty().withMessage('Occasion is required'),
  body('idempotencyKey').trim().notEmpty().withMessage('idempotencyKey is required'),
  validate,
];

export const validateDonate = [
  body('amount').isInt({ min: 10 }).withMessage('Amount must be at least ₹10'),
  body('cause').isIn(['food', 'clothes', 'medicine', 'blood']).withMessage('Invalid cause'),
  body('idempotencyKey').trim().notEmpty().withMessage('idempotencyKey is required'),
  validate,
];

// ---------- Monetary donations (unified flow) ----------

const moneyAmount = body('amount').isInt({ min: 10, max: 1000000 }).withMessage('Amount must be between ₹10 and ₹10,00,000');
const moneyCause = body('cause').isIn(['food', 'clothes', 'medicine', 'blood']).withMessage('Invalid cause');
const moneyIdempotency = body('idempotencyKey').trim().notEmpty().withMessage('idempotencyKey is required');

export const validateGuestGive = [
  moneyAmount,
  moneyCause,
  body('ngoId').trim().notEmpty().withMessage('NGO is required'),
  body('occasion').trim().notEmpty().withMessage('Occasion is required'),
  body('donorName').optional().trim().notEmpty(),
  body('donorEmail').optional().trim().isEmail().withMessage('Valid email is required for your receipt').normalizeEmail(),
  body('donorPhone').optional().matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
  body('campaignId').optional().trim().notEmpty(),
  moneyIdempotency,
  validate,
];

export const validateCreatePayment = [
  moneyAmount,
  moneyCause,
  body('ngoId').trim().notEmpty().withMessage('NGO is required'),
  body('occasion').trim().notEmpty().withMessage('Occasion is required'),
  body('campaignId').optional().trim().notEmpty(),
  moneyIdempotency,
  validate,
];

export const validateReceiptRequest = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  validate,
];

export const validateReceiptVerify = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('otp').trim().matches(/^\d{6}$/).withMessage('OTP must be 6 digits'),
  validate,
];

export const validateClaim = [
  body('reference').trim().matches(/^SCHH-[A-Z0-9]+$/).withMessage('Valid receipt reference is required'),
  validate,
];

// ---------- Razorpay (TEST MODE ONLY) ----------

export const validateRazorpayVerify = [
  body('donationId').trim().notEmpty().withMessage('donationId is required'),
  body('razorpay_order_id').optional().trim().matches(/^order_[A-Za-z0-9]+$/).withMessage('Invalid Razorpay order id'),
  body('razorpay_payment_id').trim().matches(/^pay_[A-Za-z0-9]+$/).withMessage('Invalid Razorpay payment id'),
  body('razorpay_signature').trim().matches(/^[a-fA-F0-9]+$/).withMessage('Invalid Razorpay signature'),
  validate,
];

// ---------- Common ----------

export const validateIdParam = [
  param('id').trim().notEmpty().withMessage('ID is required'),
  validate,
];
