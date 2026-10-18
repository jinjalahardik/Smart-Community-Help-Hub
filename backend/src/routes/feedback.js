import { Router } from 'express';
import { Feedback } from '../models/index.js';
import { makeResource } from '../controllers/crud.js';
import { requireAuth } from '../middleware/auth.js';
import { validateCreateFeedback } from '../middleware/validate.js';

const router = Router();
const resource = makeResource(Feedback, {
  filters: ['userId', 'status'],
  name: 'Feedback',
  idPrefix: 'FBK',
  ownerField: 'userId',
  beforeCreate: (data, req) => ({
    ...data,
    userId: req.user.id,
    userName: req.user.name,
    role: req.user.role,
    status: 'pending',
  }),
});

router.get('/', requireAuth, (req, res, next) => {
  // Non-admins can only see their own feedback submissions
  if (req.user.role !== 'admin') {
    req.query.userId = req.user.id;
  }
  resource.list(req, res, next);
});

router.post('/', requireAuth, validateCreateFeedback, resource.create);

// Only administrators can change feedback status (e.g. reviewed, resolved)
router.patch('/:id/status', requireAuth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only administrators can update feedback status' });
  }

  const { status } = req.body || {};
  const ALLOWED_FEEDBACK_STATUS = ['pending', 'reviewed', 'resolved', 'archived'];
  if (!ALLOWED_FEEDBACK_STATUS.includes(status)) {
    return res.status(400).json({ message: 'Invalid feedback status' });
  }

  const item = await Feedback.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status, updatedAt: new Date().toISOString() } },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Feedback not found' });
  res.json(item);
});

router.delete('/:id', requireAuth, resource.remove);

export default router;
