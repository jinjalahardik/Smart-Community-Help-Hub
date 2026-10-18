import { api } from '../../services/api';

export const celebrationService = {
  listVerifiedNgos() {
    return api.get('/ngos/public').then((r) => r.data);
  },

  createCampaign(payload) {
    return api.post('/celebrations', payload).then((r) => r.data);
  },
  listMine() {
    return api.get('/celebrations').then((r) => r.data);
  },
  getById(id) {
    return api.get(`/celebrations/${id}`).then((r) => r.data);
  },
  getBySlug(slug) {
    return api.get(`/celebrations/public/${slug}`).then((r) => r.data);
  },
  updateCampaign(id, patch) {
    return api.put(`/celebrations/${id}`, patch).then((r) => r.data);
  },
  pauseCampaign(id, paused) {
    return api.patch(`/celebrations/${id}/pause`, { paused }).then((r) => r.data);
  },
  deleteCampaign(id) {
    return api.delete(`/celebrations/${id}`).then((r) => r.data);
  },

  campaignDonations(id) {
    return api.get(`/celebrations/${id}/donations`).then((r) => r.data);
  },
  campaignImpact(id) {
    return api.get(`/celebrations/${id}/impact`).then((r) => r.data);
  },
  addImpact(id, payload) {
    return api.post(`/celebrations/${id}/impact`, payload).then((r) => r.data);
  },

  donateToCampaign(id, payload) {
    return api.post(`/celebrations/${id}/donate`, payload).then((r) => r.data);
  },
  quickGive(payload) {
    return api.post('/celebrations/give', payload).then((r) => r.data);
  },

  myDonations() {
    return api.get('/celebrations/mine/donations').then((r) => r.data);
  },

  // Unified monetary flow (/api/donations/*)
  createGuestPayment(payload) {
    return api.post('/donations/guest', payload).then((r) => r.data);
  },
  createAuthenticatedPayment(payload) {
    return api.post('/donations/create-payment', payload).then((r) => r.data);
  },
  requestReceiptOtp(email) {
    return api.post('/donations/receipt/request-otp', { email }).then((r) => r.data);
  },
  verifyReceiptOtp(email, otp) {
    return api.post('/donations/receipt/verify', { email, otp }).then((r) => r.data);
  },
  claimDonation(reference) {
    return api.post('/donations/claim', { reference }).then((r) => r.data);
  },
  verifyRazorpayPayment({ donationId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    return api.post('/payments/verify', {
      donationId, razorpay_order_id, razorpay_payment_id, razorpay_signature,
    }).then((r) => r.data);
  },
  myMoneyDonations() {
    return api.get('/donations/mine').then((r) => r.data);
  },
  getMoneyDonation(id) {
    return api.get(`/donations/${id}`).then((r) => r.data);
  },
};

export function newIdempotencyKey(prefix = 'fe') {
  const uuid = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${uuid}`;
}