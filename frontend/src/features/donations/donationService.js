import { api } from '../../services/api';

export const donationService = {
  async list(filters = {}) {
    const { data } = await api.get('/donations', { params: filters });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/donations/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/donations', payload);
    return data;
  },

  async update(id, patch) {
    const { data } = await api.put(`/donations/${id}`, patch);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/donations/${id}`);
    return data;
  },

  async accept(id, ngoId) {
    const { data } = await api.patch(`/donations/${id}/accept`, { ngoId });
    return data;
  },

  async updateStatus(id, status) {
    const { data } = await api.patch(`/donations/${id}/status`, { status });
    return data;
  },
};
