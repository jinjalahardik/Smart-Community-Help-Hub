import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import {
  validateRegisterBasic,
  validateRegisterOrg,
  validateLogin,
  validateRequestOtp,
  validateVerifyOtp,
  validateResetPassword,
} from '../middleware/validate.js';

const router = Router();

// Targeted rate limiters for authentication security
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpRequestLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 20,
  message: { message: 'Too many OTP requests. Please wait 5 minutes before requesting another code.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpVerifyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 20,
  message: { message: 'Too many verification attempts. Please wait 5 minutes before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  message: { message: 'Too many password reset attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  message: { message: 'Too many registration attempts from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, validateLogin, authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);
router.post('/register/basic', registerLimiter, validateRegisterBasic, authController.registerBasic);
router.post('/register/org', registerLimiter, validateRegisterOrg, authController.registerOrg);
router.post('/request-otp', otpRequestLimiter, validateRequestOtp, authController.requestOtp);
router.post('/verify-otp', otpVerifyLimiter, validateVerifyOtp, authController.verifyOtp);
router.post('/reset-password', resetPasswordLimiter, validateResetPassword, authController.resetPassword);

export default router;
