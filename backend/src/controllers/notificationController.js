import { Notification, User } from '../models/index.js';
import { createWithRetry } from '../utils/id.js';
import { sendToUser } from '../services/sse.js';

export const notificationController = {
  async list(req, res) {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const items = await Notification.find(query).sort({ createdAt: -1 });
    res.json(items);
  },

  async markAsRead(req, res) {
    const item = await Notification.findOneAndUpdate(
      { id: req.params.id },
      { $set: { read: true, updatedAt: new Date().toISOString() } },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Notification not found' });
    res.json(item);
  },

  async markAllAsRead(req, res) {
    const { userId } = req.body || {};
    if (userId) {
      await Notification.updateMany({ userId }, { $set: { read: true } });
    }
    res.json({ success: true });
  },

  async remove(req, res) {
    await Notification.deleteOne({ id: req.params.id });
    res.json({ success: true });
  },

  async create(req, res) {
    const payload = req.body || {};
    const item = await createWithRetry(Notification, 'NTF', {
      read: false,
      createdAt: new Date().toISOString(),
      ...payload,
    });
    if (item.userId) sendToUser(item.userId, 'notification', item);
    res.status(201).json(item);
  },

  async broadcast(req, res) {
    const { role, title, message, category = 'system' } = req.body || {};
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
