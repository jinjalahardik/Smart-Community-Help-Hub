import { api } from '../../services/api';

export const ngoService = {
  async getProfile(orgId) {
    const { data } = await api.get(`/ngos/${orgId}`);
    return data;
  },

  async updateProfile(orgId, patch) {
    const { data } = await api.put(`/ngos/${orgId}`, patch);
    return data;
  },

  async distributions(ngoId) {
    const { data } = await api.get(`/ngos/${ngoId}/distributions`);
    return data;
  },

  async volunteers() {
    const { data } = await api.get('/ngos/volunteers');
    return data;
  },
};
