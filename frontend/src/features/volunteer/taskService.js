import { api } from '../../services/api';

export const taskService = {
  async list(filters = {}) {
    const { data } = await api.get('/tasks', { params: filters });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/tasks/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/tasks', payload);
    return data;
  },

  async accept(id, volunteerId) {
    const { data } = await api.patch(`/tasks/${id}/accept`, { volunteerId });
    return data;
  },

  async advanceStatus(id) {
    const { data } = await api.patch(`/tasks/${id}/advance`);
    return data;
  },

  async decline(id) {
    const { data } = await api.patch(`/tasks/${id}/decline`);
    return data;
  },
};
