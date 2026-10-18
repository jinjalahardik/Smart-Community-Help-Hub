import { Router } from 'express';
import { Donation } from '../models/index.js';
import { makeResource } from '../controllers/crud.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadImages } from '../middleware/upload.js';
import { validateCreateDonation } from '../middleware/validate.js';
import { sendToUser } from '../services/sse.js';

const router = Router();
const resource = makeResource(Donation, {
  filters: ['donorId', 'category', 'status', 'city'],
  searchFields: ['title', 'description'],
  name: 'Donation',
  idPrefix: 'DON',
  ownerField: 'donorId',
  beforeCreate: (data, req) => {
    // Strip all monetary / gateway fields from goods donations
    delete data.paymentStatus;
    delete data.paymentIntentId;
    delete data.paymentRef;
    delete data.idempotencyKey;
    delete data.publicDonationReference;
    return {
      ...data,
      donationType: 'goods',
      donorId: req.user?.id || data.donorId,
      status: 'pending',
      acceptedBy: null,
    };
  },
});

router.get('/', requireAuth, resource.list);
router.get('/:id', requireAuth, resource.getById);
router.post('/', requireAuth, uploadImages('images', 5), validateCreateDonation, (req, res, next) => {
  if (req.uploadedImages) req.body.images = req.uploadedImages;
  next();
}, resource.create);
router.put('/:id', requireAuth, (req, res, next) => {
  if (req.body) {
    delete req.body.status;
    delete req.body.acceptedBy;
    delete req.body.donationType;
  }
  return resource.update(req, res, next);
});
router.delete('/:id', requireAuth, resource.remove);

// Only authorized NGOs or Admins can accept goods donations
router.patch('/:id/accept', requireAuth, async (req, res) => {
  if (req.user.role !== 'ngo' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only NGOs or administrators can accept donations' });
  }

  const existing = await Donation.findOne({ id: req.params.id });
  if (!existing) return res.status(404).json({ message: 'Donation not found' });
  if (existing.donationType === 'money') {
    return res.status(400).json({ message: 'Monetary donations cannot be accepted via this endpoint' });
  }

  if (existing.status !== 'pending') {
    return res.status(409).json({ message: `Cannot accept donation: current status is '${existing.status}'` });
  }

  const ngoId = req.user.role === 'admin'
    ? (req.body?.ngoId || req.user.orgId || req.user.id)
    : (req.user.orgId || req.user.id);

  const item = await Donation.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status: 'accepted', acceptedBy: ngoId, updatedAt: new Date().toISOString() } },
    { new: true }
  );
  if (item.donorId) sendToUser(item.donorId, 'donation', { type: 'accepted', donation: item });
  res.json(item);
});

// Only the donor, the accepting NGO, or an admin can update goods donation status
router.patch('/:id/status', requireAuth, async (req, res) => {
  const existing = await Donation.findOne({ id: req.params.id });
  if (!existing) return res.status(404).json({ message: 'Donation not found' });

  if (existing.donationType === 'money') {
    return res.status(400).json({ message: 'Monetary donation status is managed strictly by payment verification' });
  }

  const isDonor = existing.donorId === req.user.id;
  const isAcceptingNgo = req.user.orgId && existing.acceptedBy === req.user.orgId;
  const isAdmin = req.user.role === 'admin';

  if (!isDonor && !isAcceptingNgo && !isAdmin) {
    return res.status(403).json({ message: 'You do not have permission to change this donation\'s status' });
  }

  const { status } = req.body || {};
  const ALLOWED_GOODS_STATUS = ['pending', 'accepted', 'in_transit', 'completed', 'cancelled'];
  if (!ALLOWED_GOODS_STATUS.includes(status)) {
    return res.status(400).json({ message: 'Invalid donation status' });
  }

  // Strict state machine transitions
  const VALID_TRANSITIONS = {
    pending: ['accepted', 'cancelled'],
    accepted: ['in_transit', 'completed', 'cancelled'],
    in_transit: ['completed', 'cancelled'],
    completed: [], // terminal
    cancelled: [], // terminal
  };

  const allowedNext = VALID_TRANSITIONS[existing.status] || [];
  if (!allowedNext.includes(status)) {
    return res.status(400).json({
      message: `Invalid status transition: cannot move donation from '${existing.status}' to '${status}'`,
    });
  }

  const patch = { status, updatedAt: new Date().toISOString() };
  if (status === 'completed') {
    patch.completedAt = new Date().toISOString();
  }

  const item = await Donation.findOneAndUpdate(
    { id: req.params.id },
    { $set: patch },
    { new: true }
  );
  if (item.donorId) sendToUser(item.donorId, 'donation', { type: 'status', status, donation: item });
  res.json(item);
});

export default router;
