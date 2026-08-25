import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sch_hub_local_dev_secret_change_in_production';

function extractToken(req) {
  // 1. Check Authorization header (Bearer token) — primary method
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);

  // 2. Check HTTP-only cookie — secondary method (more secure)
  if (req.cookies?.sch_token) return req.cookies.sch_token;

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
