import { api } from '../../services/api';

export const chatService = {
  async listChats(userId) {
    const { data } = await api.get('/chat', { params: { userId } });
    return data;
  },

  async getMessages(chatId) {
    const { data } = await api.get(`/chat/${chatId}/messages`);
    return data;
  },

  async sendMessage(chatId, senderId, text) {
    const { data } = await api.post(`/chat/${chatId}/messages`, { senderId, text });
    return data;
  },

  async markChatRead(chatId, userId) {
    const { data } = await api.post(`/chat/${chatId}/read`, { userId });
    return data;
  },
};
