import { Notification, User } from '../models/index.js';
import { createWithRetry } from '../utils/id.js';
import { sendToUser } from '../services/sse.js';

export const notificationController = {
  async list(req, res) {
    // Normal users can ONLY see their own notifications.
    // Admins may optionally filter by userId.
    const targetUserId = (req.user.role === 'admin' && req.query.userId)
      ? String(req.query.userId).trim()
      : req.user.id;

    const items = await Notification.find({ userId: targetUserId }).sort({ createdAt: -1 });
    res.json(items);
  },

  async markAsRead(req, res) {
    const filter = req.user.role === 'admin'
      ? { id: req.params.id }
      : { id: req.params.id, userId: req.user.id };

    const item = await Notification.findOneAndUpdate(
      filter,
      { $set: { read: true, updatedAt: new Date().toISOString() } },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Notification not found' });
    res.json(item);
  },

  async markAllAsRead(req, res) {
    const targetUserId = (req.user.role === 'admin' && req.body?.userId)
      ? String(req.body.userId).trim()
      : req.user.id;

    await Notification.updateMany({ userId: targetUserId }, { $set: { read: true } });
    res.json({ success: true });
  },

  async remove(req, res) {
    const filter = req.user.role === 'admin'
      ? { id: req.params.id }
      : { id: req.params.id, userId: req.user.id };

    const result = await Notification.deleteOne(filter);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ success: true });
  },

  async create(req, res) {
    const payload = req.body || {};
    // Non-admins can only create notifications targeted to themselves
    const targetUserId = req.user.role === 'admin'
      ? (payload.userId || req.user.id)
      : req.user.id;

    const item = await createWithRetry(Notification, 'NTF', {
      read: false,
      createdAt: new Date().toISOString(),
      ...payload,
      userId: targetUserId,
    });
    if (item.userId) sendToUser(item.userId, 'notification', item);
    res.status(201).json(item);
  },

  async broadcast(req, res) {
    // Only administrators are allowed to broadcast notifications
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can broadcast notifications' });
    }

    const { role, title, message, category = 'system' } = req.body || {};
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required for broadcast' });
    }

    const query = role ? { role } : {};
    const users = await User.find(query).select({ id: 1, role: 1 });
    const now = new Date().toISOString();

    for (const u of users) {
      const item = await createWithRetry(Notification, 'NTF', {
        userId: u.id,
        category,
        title,
        message,
        read: false,
        createdAt: now,
      });
      sendToUser(u.id, 'notification', item);
    }

    res.json({ role, title, message, category, sentCount: users.length });
  },
};
