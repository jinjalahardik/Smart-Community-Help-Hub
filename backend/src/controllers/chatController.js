import { Chat, Message, User } from '../models/index.js';
import { createWithRetry } from '../utils/id.js';

function safeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user.toJSON();
  return safe;
}

export const chatController = {
  async listChats(req, res) {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId query parameter is required' });

    const chats = await Chat.find({ participantIds: userId }).sort({ lastMessageAt: -1 });
    const enriched = await Promise.all(chats.map(async (chat) => {
      const json = chat.toJSON();
      const otherId = (json.participantIds || []).find((id) => id !== userId);
      const other = otherId ? await User.findOne({ id: otherId }) : null;
      return {
        ...json,
        otherParticipant: other ? { id: other.id, name: other.name, role: other.role } : { id: otherId, name: 'Unknown User' },
      };
    }));
    res.json(enriched);
  },

  async getMessages(req, res) {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({ createdAt: 1 });
    res.json(messages);
  },

  async sendMessage(req, res) {
    const { chatId } = req.params;
    const { senderId, text } = req.body || {};
    if (!senderId || !text) return res.status(400).json({ message: 'senderId and text are required' });

    const now = new Date().toISOString();
    const msg = await createWithRetry(Message, 'MSG', { chatId, senderId, text, createdAt: now });

    const chat = await Chat.findOne({ id: chatId });
    if (chat) {
      const unread = {};
      for (const pid of chat.participantIds || []) {
        if (pid !== senderId) unread[pid] = (chat.unreadCount?.get?.(pid) ?? 0) + 1;
      }
      chat.lastMessage = text;
      chat.lastMessageAt = now;
      Object.entries(unread).forEach(([pid, count]) => chat.unreadCount.set(pid, count));
      await chat.save();
    }

    res.status(201).json(msg);
  },

  async markChatRead(req, res) {
    const { chatId } = req.params;
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const chat = await Chat.findOne({ id: chatId });
    if (chat) {
      chat.unreadCount.set(userId, 0);
      await chat.save();
    }
    res.json({ success: true });
  },
};
