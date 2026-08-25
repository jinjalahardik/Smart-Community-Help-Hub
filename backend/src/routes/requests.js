import { Router } from 'express';
import { Request } from '../models/index.js';
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

  const patch = { ...req.body };
  if (patch.urgency || patch.affectedPeople || patch.neededBefore) {
    patch.priorityScore = calculatePriorityScore({ ...existing.toJSON(), ...patch });
  }
  patch.updatedAt = new Date().toISOString();

  const item = await Request.findOneAndUpdate({ id: req.params.id }, { $set: patch }, { new: true });
  res.json(item);
});
router.delete('/:id', requireAuth, resource.remove);

router.patch('/:id/assign', requireAuth, async (req, res) => {
  const { ngoId } = req.body || {};
  const item = await Request.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status: 'assigned', assignedNgoId: ngoId, updatedAt: new Date().toISOString() } },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Request not found' });
  if (item.requesterId) sendToUser(item.requesterId, 'request', { type: 'assigned', request: item });
  res.json(item);
});

router.patch('/:id/confirm-delivery', requireAuth, async (req, res) => {
  const item = await Request.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status: 'fulfilled', fulfilledAt: new Date().toISOString(), updatedAt: new Date().toISOString() } },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Request not found' });
  if (item.requesterId) sendToUser(item.requesterId, 'request', { type: 'fulfilled', request: item });
  res.json(item);
});

export default router;
