import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Ngo, Hospital } from '../models/index.js';
import { createWithRetry } from '../utils/id.js';
import { sendOtpEmail, sendWelcomeEmail } from '../services/email.js';
import { ORG_ROLES } from '../../../frontend/src/constants/roles.js';
import { USER_STATUS, VERIFICATION_STATUS } from '../../../frontend/src/constants/categories.js';

// Store OTPs in memory (demo). In production, use Redis or a DB with TTL.
const otpStore = new Map();

const JWT_SECRET = process.env.JWT_SECRET || 'sch_hub_local_dev_secret_change_in_production';
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
      avatarColor: '#0F766E',
      createdAt: new Date().toISOString(),
    });
    sendWelcomeEmail(email, payload.name).catch(() => {});
    res.status(201).json({ user: sanitize(user) });
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

    res.status(201).json({ user: sanitize(user), orgId });
  },

  async requestOtp(req, res) {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const otp = '123456'; // Demo OTP. In production: generate random 6-digit code.
    otpStore.set(String(email).toLowerCase().trim(), { otp, expires: Date.now() + 10 * 60 * 1000 });
    const result = await sendOtpEmail(email, otp);
    res.json({ sent: true, demoOtp: result.mode === 'dev' ? otp : undefined });
  },

  async verifyOtp(req, res) {
    const { email, otp } = req.body || {};
    const stored = otpStore.get(String(email || '').toLowerCase().trim());
    const code = otp || stored?.otp;
    if (code !== '123456') {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }
    if (email) otpStore.delete(String(email).toLowerCase().trim());
    res.json({ verified: true });
  },

  async resetPassword(req, res) {
    const { email, newPassword } = req.body || {};
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'No account found with this email' });
    const hash = await bcrypt.hash(String(newPassword), SALT_ROUNDS);
    await User.updateOne({ id: user.id }, { $set: { password: hash, updatedAt: new Date().toISOString() } });
    res.json({ success: true });
  },
};

export { ORG_ROLES as isOrgRoleRoles, findOrgRecord };
