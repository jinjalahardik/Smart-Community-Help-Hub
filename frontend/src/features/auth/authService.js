import { api } from '../../services/api';
import { storageService, STORE_KEYS } from '../../services/storageService';
import { ORG_ROLES } from '../../constants/roles';

export const authService = {
  async login({ email, password, rememberMe }) {
    const { data } = await api.post('/auth/login', { email, password, rememberMe });
    const session = {
      token: data.token,
      userId: data.user.id,
      rememberMe: !!rememberMe,
      loggedInAt: new Date().toISOString(),
    };
    storageService.set(STORE_KEYS.SESSION, session);
    return { user: data.user, orgStatus: data.orgStatus };
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Best-effort; local session is cleared regardless.
    }
    storageService.remove(STORE_KEYS.SESSION);
    return true;
  },

  async getSession() {
    const session = storageService.get(STORE_KEYS.SESSION, null);
    if (!session?.token) return null;
    try {
      const { data } = await api.get('/auth/me');
      return data.user;
    } catch {
      storageService.remove(STORE_KEYS.SESSION);
      return null;
    }
  },

  async registerBasic(payload) {
    const { data } = await api.post('/auth/register/basic', payload);
    return data;
  },

  async registerOrg(payload) {
    const { data } = await api.post('/auth/register/org', payload);
    return data;
  },

  async requestOtp(email, purpose = 'verify_email') {
    const { data } = await api.post('/auth/request-otp', { email, purpose });
    return data;
  },

  async verifyOtp(email, otp, purpose = 'verify_email') {
    const { data } = await api.post('/auth/verify-otp', { email, otp, purpose });
    return data;
  },

  async resetPassword(email, newPassword) {
    const { data } = await api.post('/auth/reset-password', { email, newPassword });
    return data;
  },

  isOrgRole(role) {
    return ORG_ROLES.includes(role);
  },
};
