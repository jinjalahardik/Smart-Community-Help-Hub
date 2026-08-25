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
  body('senderId').trim().notEmpty().withMessage('senderId is required'),
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

// ---------- Common ----------

export const validateIdParam = [
  param('id').trim().notEmpty().withMessage('ID is required'),
  validate,
];
