import { Chat, Message, User } from '../models/index.js';
import { createWithRetry } from '../utils/id.js';

function safeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user.toJSON();
  return safe;
}

export const chatController = {
  async listChats(req, res) {
    // Normal users can only list their own chats.
    const myUserId = (req.user.role === 'admin' && req.query.userId)
      ? String(req.query.userId).trim()
      : req.user.id;

    const chats = await Chat.find({ participantIds: myUserId }).sort({ lastMessageAt: -1 });
    const enriched = await Promise.all(chats.map(async (chat) => {
      const json = chat.toJSON();
      const otherId = (json.participantIds || []).find((id) => id !== myUserId);
      const other = otherId ? await User.findOne({ id: otherId }) : null;
      return {
        ...json,
        otherParticipant: other ? { id: other.id, name: other.name, role: other.role } : { id: otherId, name: 'Unknown User' },
      };
    }));
    res.json(enriched);
  },

  async getMessages(req, res) {
    const { chatId } = req.params;
    const chat = await Chat.findOne({ id: chatId });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Enforce participant membership
    if (req.user.role !== 'admin' && (!chat.participantIds || !chat.participantIds.includes(req.user.id))) {
      return res.status(403).json({ message: 'You do not have permission to view messages in this chat' });
    }

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.json(messages);
  },

  async sendMessage(req, res) {
    const { chatId } = req.params;
    const chat = await Chat.findOne({ id: chatId });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Enforce participant membership
    if (req.user.role !== 'admin' && (!chat.participantIds || !chat.participantIds.includes(req.user.id))) {
      return res.status(403).json({ message: 'You do not have permission to send messages in this chat' });
    }

    const text = String(req.body?.text || '').trim();
    if (!text) return res.status(400).json({ message: 'Message text is required' });

    // Never trust senderId from client: force authenticated user's ID
    const senderId = req.user.id;
    const now = new Date().toISOString();
    const msg = await createWithRetry(Message, 'MSG', { chatId, senderId, text, createdAt: now });

    const unread = {};
    for (const pid of chat.participantIds || []) {
      if (pid !== senderId) unread[pid] = (chat.unreadCount?.get?.(pid) ?? 0) + 1;
    }
    chat.lastMessage = text;
    chat.lastMessageAt = now;
    Object.entries(unread).forEach(([pid, count]) => chat.unreadCount.set(pid, count));
    await chat.save();

    res.status(201).json(msg);
  },

  async markChatRead(req, res) {
    const { chatId } = req.params;
    const chat = await Chat.findOne({ id: chatId });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Enforce participant membership
    if (req.user.role !== 'admin' && (!chat.participantIds || !chat.participantIds.includes(req.user.id))) {
      return res.status(403).json({ message: 'You do not have permission to access this chat' });
    }

    const targetUserId = req.user.id;
    chat.unreadCount.set(targetUserId, 0);
    await chat.save();

    res.json({ success: true });
  },
};
