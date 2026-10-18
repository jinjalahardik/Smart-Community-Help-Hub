import { Router } from 'express';
import { Request, Ngo } from '../models/index.js';
import { makeResource } from '../controllers/crud.js';
import { requireAuth } from '../middleware/auth.js';
import { calculatePriorityScore } from '../utils/priorityScore.js';
import { sendToUser } from '../services/sse.js';
import { validateCreateRequest } from '../middleware/validate.js';

const router = Router();

const resource = makeResource(Request, {
  filters: ['requesterId', 'ngoId', 'category', 'urgency', 'status'],
  searchFields: ['title', 'description'],
  sort: { priorityScore: -1 },
  name: 'Request',
  idPrefix: 'REQ',
  ownerField: 'requesterId',
  beforeCreate: (data) => ({
    ...data,
    status: data.status || 'pending',
    priorityScore: calculatePriorityScore(data),
  }),
});

router.get('/', requireAuth, resource.list);
router.get('/:id', requireAuth, resource.getById);
router.post('/', requireAuth, validateCreateRequest, resource.create);
router.put('/:id', requireAuth, async (req, res) => {
  const existing = await Request.findOne({ id: req.params.id });
  if (!existing) return res.status(404).json({ message: 'Request not found' });

  // Only the creator or an admin can update the request details
  if (req.user.role !== 'admin' && existing.requesterId !== req.user.id) {
    return res.status(403).json({ message: 'You do not have permission to modify this request' });
  }

  const patch = { ...req.body };
  delete patch.id;
  delete patch._id;
  delete patch.requesterId;
  delete patch.status;
  delete patch.assignedNgoId;

  if (patch.urgency || patch.affectedPeople || patch.neededBefore) {
    patch.priorityScore = calculatePriorityScore({ ...existing.toJSON(), ...patch });
  }
  patch.updatedAt = new Date().toISOString();

  const item = await Request.findOneAndUpdate({ id: req.params.id }, { $set: patch }, { new: true });
  res.json(item);
});
router.delete('/:id', requireAuth, resource.remove);

// Only verified NGOs or Admins can assign requests
router.patch('/:id/assign', requireAuth, async (req, res) => {
  if (req.user.role !== 'ngo' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only NGOs or administrators can assign requests' });
  }

  // Verify the NGO is approved before allowing assignment
  if (req.user.role === 'ngo') {
    const ngoRecord = await Ngo.findOne({ id: req.user.orgId });
    if (!ngoRecord || ngoRecord.verificationStatus !== 'approved') {
      return res.status(403).json({ message: 'Your organization must be verified before accepting requests' });
    }
  }

  const existing = await Request.findOne({ id: req.params.id });
  if (!existing) return res.status(404).json({ message: 'Request not found' });

  // Only allow assignment from states where the request is still open
  const assignableStatuses = ['pending', 'reviewing'];
  if (!assignableStatuses.includes(existing.status)) {
    return res.status(409).json({ message: `Cannot assign a request that is already '${existing.status}'` });
  }

  const ngoId = req.user.role === 'admin'
    ? (req.body?.ngoId || req.user.orgId || req.user.id)
    : (req.user.orgId || req.user.id);

  const item = await Request.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status: 'assigned', assignedNgoId: ngoId, updatedAt: new Date().toISOString() } },
    { new: true }
  );
  if (item.requesterId) sendToUser(item.requesterId, 'request', { type: 'assigned', request: item });
  res.json(item);
});

// Only the requester, assigned NGO, or Admin can confirm delivery
router.patch('/:id/confirm-delivery', requireAuth, async (req, res) => {
  const existing = await Request.findOne({ id: req.params.id });
  if (!existing) return res.status(404).json({ message: 'Request not found' });

  const isRequester = existing.requesterId === req.user.id;
  const isAssignedNgo = req.user.orgId && existing.assignedNgoId === req.user.orgId;
  const isAdmin = req.user.role === 'admin';

  if (!isRequester && !isAssignedNgo && !isAdmin) {
    return res.status(403).json({ message: 'You do not have permission to confirm fulfillment for this request' });
  }

  // Delivery can only be confirmed when the request is active (assigned or in_progress)
  if (existing.status !== 'in_progress' && existing.status !== 'assigned') {
    return res.status(409).json({ message: `Cannot confirm delivery: request is currently '${existing.status}', must be 'in_progress' or 'assigned'` });
  }

  const item = await Request.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status: 'fulfilled', fulfilledAt: new Date().toISOString(), updatedAt: new Date().toISOString() } },
    { new: true }
  );
  if (item.requesterId) sendToUser(item.requesterId, 'request', { type: 'fulfilled', request: item });
  res.json(item);
});

// Explicit status transition endpoint for requests
router.patch('/:id/status', requireAuth, async (req, res) => {
  const existing = await Request.findOne({ id: req.params.id });
  if (!existing) return res.status(404).json({ message: 'Request not found' });

  const isRequester = existing.requesterId === req.user.id;
  const isAssignedNgo = req.user.orgId && existing.assignedNgoId === req.user.orgId;
  const isAdmin = req.user.role === 'admin';

  if (!isRequester && !isAssignedNgo && !isAdmin) {
    return res.status(403).json({ message: 'You do not have permission to change this request\'s status' });
  }

  const { status } = req.body || {};
  const ALLOWED_REQUEST_STATUSES = ['pending', 'reviewing', 'assigned', 'in_progress', 'fulfilled', 'closed', 'rejected'];
  if (!status || !ALLOWED_REQUEST_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid request status' });
  }

  // Define allowed transitions
  const VALID_REQUEST_TRANSITIONS = {
    pending: ['reviewing', 'assigned', 'closed', 'rejected'],
    reviewing: ['assigned', 'closed', 'rejected'],
    assigned: ['in_progress', 'fulfilled', 'closed'],
    in_progress: ['fulfilled', 'closed'],
    fulfilled: [], // terminal
    closed: [],    // terminal
    rejected: [],  // terminal
  };

  const allowedNext = VALID_REQUEST_TRANSITIONS[existing.status] || [];
  if (!allowedNext.includes(status)) {
    return res.status(400).json({
      message: `Invalid status transition: cannot move request from '${existing.status}' to '${status}'`,
    });
  }

  const patch = { status, updatedAt: new Date().toISOString() };
  if (status === 'fulfilled') {
    patch.fulfilledAt = new Date().toISOString();
  }

  const item = await Request.findOneAndUpdate(
    { id: req.params.id },
    { $set: patch },
    { new: true }
  );

  if (item.requesterId) sendToUser(item.requesterId, 'request', { type: status, request: item });
  res.json(item);
});

export default router;
