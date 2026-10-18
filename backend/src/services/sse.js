// Server-Sent Events (SSE) manager for real-time notifications.
// Replaces Socket.io with zero external dependencies.

const clients = new Map(); // userId -> Set<res>

export function registerSSE(userId, res) {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId).add(res);

  res.on('close', () => {
    const set = clients.get(userId);
    if (set) {
      set.delete(res);
      if (set.size === 0) clients.delete(userId);
    }
  });
}

export function sendToUser(userId, event, data) {
  const set = clients.get(userId);
  if (!set) return;
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of set) {
    try { res.write(payload); } catch { set.delete(res); }
  }
}

export function sendToRole(role, event, data, users) {
  if (!users) return;
  for (const u of users) {
    if (u.role === role) sendToUser(u.id, event, data);
  }
}

import jwt from 'jsonwebtoken';
import { extractToken } from '../middleware/auth.js';
import { User } from '../models/index.js';

const DEV_SECRET = 'sch_hub_local_dev_secret_change_in_production';
const JWT_SECRET = process.env.JWT_SECRET || DEV_SECRET;

export async function sseHandler(req, res) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Authentication required to subscribe to live events' });
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }

  const user = await User.findOne({ id: payload.userId });
  if (!user || user.status === 'suspended') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Target userId must match authenticated user, unless user is admin
  const requestedUserId = req.query.userId || user.id;
  if (user.role !== 'admin' && requestedUserId !== user.id) {
    return res.status(403).json({ message: 'You do not have permission to subscribe to another user\'s events' });
  }

  const userId = requestedUserId;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.write(`event: connected\ndata: ${JSON.stringify({ userId })}\n\n`);

  const keepAlive = setInterval(() => {
    try { res.write(': keepalive\n\n'); } catch { clearInterval(keepAlive); }
  }, 30000);

  res.on('close', () => clearInterval(keepAlive));
  registerSSE(userId, res);
}
