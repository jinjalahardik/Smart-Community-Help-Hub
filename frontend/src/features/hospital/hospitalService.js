import { api } from '../../services/api';

export const hospitalService = {
  async getProfile(orgId) {
    const { data } = await api.get(`/hospitals/${orgId}`);
    return data;
  },

  async updateProfile(orgId, patch) {
    const { data } = await api.put(`/hospitals/${orgId}`, patch);
    return data;
  },

  async getRequirement(id) {
    const { data } = await api.get(`/hospitals/requirements/${id}`);
    return data;
  },

  async listRequirements(hospitalId, filters = {}) {
    const { data } = await api.get('/hospitals/requirements', { params: { hospitalId, ...filters } });
    return data;
  },

  async createRequirement(payload) {
    const { data } = await api.post('/hospitals/requirements', payload);
    return data;
  },

  async updateRequirement(id, patch) {
    const { data } = await api.put(`/hospitals/requirements/${id}`, patch);
    return data;
  },

  async receivedDonations(hospitalId) {
    const { data } = await api.get('/hospitals/received-donations', { params: { hospitalId } });
    return data;
  },
};
