import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const DEV_SECRET = 'sch_hub_local_dev_secret_change_in_production';
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === DEV_SECRET) {
    throw new Error('FATAL: In production, a secure JWT_SECRET environment variable must be set and cannot use the development fallback.');
  }
}
const JWT_SECRET = process.env.JWT_SECRET || DEV_SECRET;

export function extractToken(req) {
  // 1. Check Authorization header (Bearer token) — primary method
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);

  // 2. Check HTTP-only cookie — secondary method (more secure)
  if (req.cookies?.sch_token) return req.cookies.sch_token;

  // 3. Check query param for SSE / EventSource support
  if (req.query?.token) return req.query.token;

  return null;
}

export async function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }

  const user = await User.findOne({ id: payload.userId });
  if (!user) return res.status(401).json({ message: 'User not found' });
  if (user.status === 'suspended') {
    return res.status(403).json({ message: 'Your account has been suspended. Please contact support.' });
  }

  const { password, ...safeUser } = user.toJSON();
  req.user = safeUser;
  req.userId = safeUser.id;
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    next();
  };
}

export async function optionalAuth(req, _res, next) {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ id: payload.userId });
    if (user && user.status !== 'suspended') {
      const { password, ...safeUser } = user.toJSON();
      req.user = safeUser;
      req.userId = safeUser.id;
    }
  } catch {
    // Optional auth ignores invalid token and continues as unauthenticated
  }
  next();
}
