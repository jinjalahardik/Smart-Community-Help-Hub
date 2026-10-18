import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Ngo, Hospital } from '../models/index.js';
import { createWithRetry } from '../utils/id.js';
import { sendOtpEmail, sendWelcomeEmail } from '../services/email.js';
import { issueOtp, verifyOtp as verifyOtpCode, createResetGrant, consumeResetGrant } from '../services/otp.js';
import { ORG_ROLES } from '../shared/constants/roles.js';
import { USER_STATUS, VERIFICATION_STATUS } from '../shared/constants/categories.js';

const DEV_SECRET = 'sch_hub_local_dev_secret_change_in_production';
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === DEV_SECRET) {
    throw new Error('FATAL: In production, a secure JWT_SECRET environment variable must be set and cannot use the development fallback.');
  }
}
const JWT_SECRET = process.env.JWT_SECRET || DEV_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const SALT_ROUNDS = 10;

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function setAuthCookie(res, token) {
  res.cookie('sch_token', token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

function clearAuthCookie(res) {
  res.clearCookie('sch_token', {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? 'strict' : 'lax',
    path: '/',
  });
}

function sanitize(user) {
  const { password, ...safe } = user.toJSON ? user.toJSON() : user;
  return safe;
}

async function orgStatusFor(user) {
  if (user.role === 'ngo') {
    const org = await Ngo.findOne({ id: user.orgId });
    return org?.verificationStatus ?? null;
  }
  if (user.role === 'hospital') {
    const org = await Hospital.findOne({ id: user.orgId });
    return org?.verificationStatus ?? null;
  }
  return null;
}

async function findOrgRecord(role, orgId) {
  if (role === 'ngo') return Ngo.findOne({ id: orgId });
  if (role === 'hospital') return Hospital.findOne({ id: orgId });
  return null;
}

async function findUserByEmail(email) {
  return User.findOne({ email: String(email).toLowerCase().trim() });
}

export const authController = {
  async login(req, res) {
    const { email, password } = req.body || {};
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(String(password), user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    if (user.status === USER_STATUS.SUSPENDED) {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact support.' });
    }

    const orgStatus = await orgStatusFor(user);
    const token = signToken(user.id);
    setAuthCookie(res, token);
    res.json({ token, user: sanitize(user), orgStatus });
  },

  async me(req, res) {
    const user = await User.findOne({ id: req.userId });
    if (!user) return res.status(401).json({ message: 'User not found' });
    const orgStatus = await orgStatusFor(user);
    res.json({ user: sanitize(user), orgStatus });
  },

  async logout(_req, res) {
    clearAuthCookie(res);
    res.json({ success: true });
  },

  async registerBasic(req, res) {
    const payload = req.body || {};
    const email = String(payload.email).toLowerCase().trim();
    if (await findUserByEmail(email)) {
      return res.status(409).json({ message: 'An account already exists with this email' });
    }
    const hash = await bcrypt.hash(String(payload.password), SALT_ROUNDS);
    const user = await createWithRetry(User, 'USR', {
      name: payload.name,
      email,
      password: hash,
      role: payload.role,
      phone: payload.phone,
      city: payload.city,
      status: USER_STATUS.ACTIVE,
      emailVerified: false,
      avatarColor: '#0F766E',
      createdAt: new Date().toISOString(),
    });
    sendWelcomeEmail(email, payload.name).catch(() => {});

    // Issue email verification OTP at signup (purpose: verify_email).
    // Report actual delivery status so clients never assume an email
    // arrived when SMTP is unconfigured or the send failed.
    let otpSent = false;
    const issued = await issueOtp(email, 'verify_email');
    if (issued && !issued.cooldown && issued.code) {
      const emailResult = await sendOtpEmail(email, issued.code);
      otpSent = emailResult && emailResult.sent === true;
    }

    res.status(201).json({ user: sanitize(user), otpSent });
  },

  async registerOrg(req, res) {
    const payload = req.body || {};
    const email = String(payload.email).toLowerCase().trim();
    if (await findUserByEmail(email)) {
      return res.status(409).json({ message: 'An account already exists with this email' });
    }

    const isNgo = payload.role === 'ngo';
    const now = new Date().toISOString();

    const orgRecord = isNgo
      ? {
          userId: null,
          name: payload.orgName,
          registrationNumber: payload.registrationNumber,
          contactPerson: payload.contactPerson,
          email,
          phone: payload.phone,
          address: payload.address,
          city: payload.city,
          serviceCategories: payload.serviceCategories || [],
          serviceRadiusKm: payload.serviceRadius || 10,
          verificationStatus: VERIFICATION_STATUS.PENDING,
          documents: ['registration_certificate.pdf', 'identity_proof.pdf'],
          statusHistory: [{ status: VERIFICATION_STATUS.PENDING, at: now }],
          createdAt: now,
        }
      : {
          userId: null,
          name: payload.orgName,
          licenseNumber: payload.licenseNumber,
          contactPerson: payload.contactPerson,
          email,
          phone: payload.phone,
          address: payload.address,
          city: payload.city,
          bloodBankAvailable: !!payload.bloodBankAvailable,
          medicineSupportAvailable: !!payload.medicineSupportAvailable,
          verificationStatus: VERIFICATION_STATUS.PENDING,
          documents: ['license.pdf'],
          statusHistory: [{ status: VERIFICATION_STATUS.PENDING, at: now }],
          createdAt: now,
        };

    const Model = isNgo ? Ngo : Hospital;
    const org = await createWithRetry(Model, isNgo ? 'NGO' : 'HOSP', orgRecord);
    const orgId = org.id;

    const hash = await bcrypt.hash(String(payload.password), SALT_ROUNDS);
    const user = await createWithRetry(User, 'USR', {
      name: payload.contactPerson,
      email,
      password: hash,
      role: payload.role,
      phone: payload.phone,
      city: payload.city,
      status: USER_STATUS.PENDING,
      orgId,
      avatarColor: '#0F766E',
      createdAt: now,
    });

    await Model.updateOne({ id: orgId }, { $set: { userId: user.id } });

    res.status(201).json({ user: sanitize(user), orgId });
  },

  async requestOtp(req, res) {
    const { email, purpose = 'verify_email' } = req.body || {};
    const normalized = String(email || '').toLowerCase().trim();
    if (!normalized) return res.status(400).json({ message: 'Email is required' });

    const validPurposes = ['verify_email', 'login', 'reset_password', 'receipt_lookup'];
    const safePurpose = validPurposes.includes(purpose) ? purpose : 'verify_email';

    // If requesting password reset, don't expose user existence
    const issued = await issueOtp(normalized, safePurpose);
    if (!issued) return res.status(400).json({ message: 'Email is required' });

    if (issued.cooldown) {
      return res.status(429).json({
        cooldown: true,
        retryAfter: issued.retryAfter,
        message: `Please wait ${issued.retryAfter} seconds before requesting another code.`,
      });
    }

    if (issued.code) {
      const emailResult = await sendOtpEmail(normalized, issued.code);
      if (!emailResult || !emailResult.sent) {
        return res.status(502).json({ message: 'Unable to deliver verification email. Please try again later.' });
      }
    }

    res.json({ sent: true });
  },

  async verifyOtp(req, res) {
    const { email, otp, purpose = 'verify_email' } = req.body || {};
    const normalized = String(email || '').toLowerCase().trim();
    if (!normalized || !otp) {
      return res.status(400).json({ message: 'Email and verification code are required.' });
    }

    const validPurposes = ['verify_email', 'login', 'reset_password', 'receipt_lookup'];
    const safePurpose = validPurposes.includes(purpose) ? purpose : 'verify_email';

    const result = await verifyOtpCode(normalized, safePurpose, otp);
    if (!result || !result.valid) {
      if (result?.reason === 'max_attempts') {
        return res.status(429).json({ message: 'Too many verification attempts. Please request a new code.' });
      }
      if (result?.reason === 'expired') {
        return res.status(400).json({ message: 'This verification code has expired. Please request a new code.' });
      }
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    // If purpose was password reset, issue single-use grant
    if (safePurpose === 'reset_password') {
      await createResetGrant(normalized);
    }

    // Successful OTP proves control of mailbox; mark matching account verified
    const existing = await User.findOne({ email: normalized });
    if (existing) {
      await User.updateOne(
        { id: existing.id },
        { $set: { emailVerified: true, updatedAt: new Date().toISOString() } },
      );
    }

    res.json({ verified: true });
  },

  async resetPassword(req, res) {
    const { email, newPassword } = req.body || {};
    const normalized = String(email || '').toLowerCase().trim();

    if (!normalized || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Require an active, verified OTP reset grant
    const grantValid = await consumeResetGrant(normalized);
    if (!grantValid) {
      return res.status(403).json({ message: 'OTP verification is required before resetting password. Please verify your OTP code first.' });
    }

    const user = await findUserByEmail(normalized);
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    const hash = await bcrypt.hash(String(newPassword), SALT_ROUNDS);
    await User.updateOne({ id: user.id }, { $set: { password: hash, updatedAt: new Date().toISOString() } });
    res.json({ success: true });
  },
};

export { ORG_ROLES as isOrgRoleRoles, findOrgRecord };
