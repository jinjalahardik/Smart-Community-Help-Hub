import { api } from '../../services/api';

export const notificationService = {
  async list(userId) {
    const { data } = await api.get('/notifications', { params: { userId } });
    return data;
  },

  async markAsRead(id) {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  },

  async markAllAsRead(userId) {
    const { data } = await api.patch('/notifications/read-all', { userId });
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/notifications/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/notifications', payload);
    return data;
  },

  async broadcast({ role, title, message, category = 'system' }) {
    const { data } = await api.post('/notifications/broadcast', { role, title, message, category });
    return data;
  },
};
