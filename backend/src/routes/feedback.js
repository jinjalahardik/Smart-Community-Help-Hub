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
});

router.get('/', requireAuth, resource.list);
router.post('/', requireAuth, validateCreateFeedback, resource.create);

router.patch('/:id/status', requireAuth, async (req, res) => {
  const { status } = req.body || {};
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
