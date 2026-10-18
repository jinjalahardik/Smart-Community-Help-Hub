// OTP service — MongoDB-backed, bcrypt-hashed, production-ready.
//
// Every OTP is:
//   1. Generated with crypto.randomInt (cryptographically secure)
//   2. Hashed with bcrypt before storage (never stored plaintext)
//   3. Stored in MongoDB with a TTL index (auto-expired after 10 min)
//   4. Single-use: deleted immediately on successful verification
//   5. Rate-limited: 60-second resend cooldown per email+purpose
//   6. Attempt-limited: max 5 failed attempts before invalidation
//
// The plaintext code exists in memory ONLY during the request that
// generates it and is passed directly to the email sender. It is
// NEVER returned in any API response or stored in any database.

import { randomInt } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { Otp } from '../models/index.js';

const OTP_TTL_MS = 10 * 60 * 1000;            // 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000;          // 60 seconds
const MAX_ATTEMPTS = 5;
const BCRYPT_ROUNDS = 10;

function normalizeEmail(email) {
  return String(email || '').toLowerCase().trim();
}

// ─── Issue OTP ────────────────────────────────────────────────────────
// Returns { code, expires } on success (code is plaintext, for email only).
// Returns { cooldown: true, retryAfter } if resend cooldown is active.
// Returns null if email is empty.
export async function issueOtp(email, purpose = 'verify_email') {
  const address = normalizeEmail(email);
  if (!address) return null;

  // Check resend cooldown — look for any existing OTP for this email+purpose
  const existing = await Otp.findOne({ email: address, purpose });
  if (existing && existing.resendCooldownUntil && existing.resendCooldownUntil > new Date()) {
    const retryAfter = Math.ceil((existing.resendCooldownUntil.getTime() - Date.now()) / 1000);
    return { cooldown: true, retryAfter };
  }

  // Generate cryptographically secure 6-digit OTP
  const code = String(randomInt(100000, 1000000));

  // Hash with bcrypt before storage
  const otpHash = await bcrypt.hash(code, BCRYPT_ROUNDS);

  // Replace any existing OTP for this email+purpose so only one stays
  // active. The unique { email, purpose } index guarantees a single active
  // record; on a duplicate-key race (two concurrent issues) we clear and
  // retry once so the latest code always wins.
  await Otp.deleteMany({ email: address, purpose });

  const doc = {
    email: address,
    otpHash,
    purpose,
    attempts: 0,
    resendCooldownUntil: new Date(Date.now() + RESEND_COOLDOWN_MS),
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
    createdAt: new Date(),
  };
  try {
    await Otp.create(doc);
  } catch (err) {
    if (err?.code === 11000) {
      await Otp.deleteMany({ email: address, purpose });
      await Otp.create(doc);
    } else {
      throw err;
    }
  }

  return { code, expires: OTP_TTL_MS };
}

// ─── Verify OTP ───────────────────────────────────────────────────────
// Returns true if the OTP is valid and consumed (single-use).
// Returns false with a descriptive reason on failure.
export async function verifyOtp(email, purpose = 'verify_email', code) {
  const address = normalizeEmail(email);
  if (!address || !code) return { valid: false, reason: 'invalid' };

  const record = await Otp.findOne({ email: address, purpose });
  if (!record) return { valid: false, reason: 'expired' };

  // Check expiration (belt-and-suspenders; TTL index also handles this)
  if (record.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: record._id });
    return { valid: false, reason: 'expired' };
  }

  // Check attempt limit
  if (record.attempts >= MAX_ATTEMPTS) {
    await Otp.deleteOne({ _id: record._id });
    return { valid: false, reason: 'max_attempts' };
  }

  // Compare submitted code against stored hash
  const matches = await bcrypt.compare(String(code).trim(), record.otpHash);

  if (!matches) {
    // Atomically increment attempts
    const updated = await Otp.findOneAndUpdate(
      { _id: record._id },
      { $inc: { attempts: 1 } },
      { new: true },
    );
    // If this was the last allowed attempt, invalidate
    if (updated && updated.attempts >= MAX_ATTEMPTS) {
      await Otp.deleteOne({ _id: record._id });
    }
    return { valid: false, reason: 'invalid' };
  }

  // Success — delete immediately (single-use)
  await Otp.deleteOne({ _id: record._id });
  return { valid: true };
}

// ─── Clear OTP ────────────────────────────────────────────────────────
export async function clearOtp(email, purpose) {
  const address = normalizeEmail(email);
  if (purpose) {
    await Otp.deleteMany({ email: address, purpose });
  } else {
    await Otp.deleteMany({ email: address });
  }
}

// ─── Password Reset Grant ─────────────────────────────────────────────
// After successful OTP verification for password reset, a single-use
// grant is issued. It is stored as a special OTP record with purpose
// 'reset_password' and no hash (verified by existence + TTL).

const RESET_GRANT_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESET_GRANT_MARKER = '__GRANT__';

export async function createResetGrant(email) {
  const address = normalizeEmail(email);
  if (!address) return;

  // Remove any previous grant
  await Otp.deleteMany({ email: address, purpose: 'reset_password' });

  // The grant record uses a dummy hash — it's consumed by existence check,
  // not by OTP comparison.
  await Otp.create({
    email: address,
    otpHash: RESET_GRANT_MARKER,
    purpose: 'reset_password',
    attempts: 0,
    expiresAt: new Date(Date.now() + RESET_GRANT_TTL_MS),
    createdAt: new Date(),
  });
}

export async function consumeResetGrant(email) {
  const address = normalizeEmail(email);
  const grant = await Otp.findOneAndDelete({
    email: address,
    purpose: 'reset_password',
    otpHash: RESET_GRANT_MARKER,
    expiresAt: { $gt: new Date() },
  });
  return !!grant;
}