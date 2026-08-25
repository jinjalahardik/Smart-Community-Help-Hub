import { api } from '../../services/api';

export const adminService = {
  async listUsers(filters = {}) {
    const { data } = await api.get('/admin/users', { params: filters });
    return data;
  },

  async updateUserStatus(id, status) {
    const { data } = await api.patch(`/admin/users/${id}/status`, { status });
    return data;
  },

  async deleteUser(id) {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },

  async listNgos(filters = {}) {
    const { data } = await api.get('/admin/ngos', { params: filters });
    return data;
  },

  async listHospitals(filters = {}) {
    const { data } = await api.get('/admin/hospitals', { params: filters });
    return data;
  },

  async approveOrg(type, id) {
    const { data } = await api.post(`/admin/orgs/${type}/${id}/approve`);
    return data;
  },

  async rejectOrg(type, id, reason) {
    const { data } = await api.post(`/admin/orgs/${type}/${id}/reject`, { reason });
    return data;
  },

  async auditLogs() {
    const { data } = await api.get('/admin/audit-logs');
    return data;
  },

  async analytics() {
    const { data } = await api.get('/admin/analytics');
    return data;
  },
};
