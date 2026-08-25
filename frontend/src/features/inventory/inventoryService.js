import { api } from '../../services/api';

export const inventoryService = {
  async list(filters = {}) {
    const { data } = await api.get('/inventory', { params: filters });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/inventory/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/inventory', payload);
    return data;
  },

  async update(id, patch) {
    const { data } = await api.put(`/inventory/${id}`, patch);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/inventory/${id}`);
    return data;
  },
};
