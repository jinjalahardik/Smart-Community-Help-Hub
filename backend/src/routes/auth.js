import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRegisterBasic, validateRegisterOrg, validateLogin } from '../middleware/validate.js';

const router = Router();

router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);
router.post('/register/basic', validateRegisterBasic, authController.registerBasic);
router.post('/register/org', validateRegisterOrg, authController.registerOrg);
router.post('/request-otp', authController.requestOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);

export default router;
