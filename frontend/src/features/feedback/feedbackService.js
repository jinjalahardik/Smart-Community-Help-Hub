import { api } from '../../services/api';

export const feedbackService = {
  async list(filters = {}) {
    const { data } = await api.get('/feedback', { params: filters });
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/feedback', payload);
    return data;
  },

  async updateStatus(id, status) {
    const { data } = await api.patch(`/feedback/${id}/status`, { status });
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/feedback/${id}`);
    return data;
  },
};
