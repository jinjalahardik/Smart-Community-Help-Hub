import { api } from '../../services/api';

export const requestService = {
  async list(filters = {}) {
    const { data } = await api.get('/requests', { params: filters });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/requests/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/requests', payload);
    return data;
  },

  async update(id, patch) {
    const { data } = await api.put(`/requests/${id}`, patch);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/requests/${id}`);
    return data;
  },

  async assign(id, ngoId) {
    const { data } = await api.patch(`/requests/${id}/assign`, { ngoId });
    return data;
  },

  async confirmDelivery(id) {
    const { data } = await api.patch(`/requests/${id}/confirm-delivery`);
    return data;
  },
};
