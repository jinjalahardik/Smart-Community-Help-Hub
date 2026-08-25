import { Router } from 'express';
import { Task } from '../models/index.js';
import { makeResource } from '../controllers/crud.js';
import { requireAuth } from '../middleware/auth.js';
import { TASK_STATUS, TASK_STATUS_ORDER } from '../../../frontend/src/constants/categories.js';

const router = Router();

const resource = makeResource(Task, {
  filters: ['volunteerId', 'ngoId', 'status'],
  name: 'Task',
  idPrefix: 'TSK',
  beforeCreate: (data) => ({
    ...data,
    status: TASK_STATUS.AVAILABLE,
    statusHistory: [{ status: TASK_STATUS.AVAILABLE, at: new Date().toISOString() }],
  }),
});

router.get('/', requireAuth, async (req, res) => {
  const query = {};
  if (req.query.volunteerId) query.assignedVolunteerId = req.query.volunteerId;
  if (req.query.ngoId) query.ngoId = req.query.ngoId;
  if (req.query.status) query.status = req.query.status;
  if (req.query.available === 'true') query.status = TASK_STATUS.AVAILABLE;
  res.json(await Task.find(query));
});
router.get('/:id', requireAuth, resource.getById);
router.post('/', requireAuth, resource.create);
router.put('/:id', requireAuth, resource.update);
router.delete('/:id', requireAuth, resource.remove);

router.patch('/:id/accept', requireAuth, async (req, res) => {
  const { volunteerId } = req.body || {};
  const task = await Task.findOne({ id: req.params.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  const statusHistory = [...(task.statusHistory || []), { status: TASK_STATUS.ACCEPTED, at: new Date().toISOString() }];
  const updated = await Task.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status: TASK_STATUS.ACCEPTED, assignedVolunteerId: volunteerId, statusHistory, updatedAt: new Date().toISOString() } },
    { new: true }
  );
  res.json(updated);
});

router.patch('/:id/advance', requireAuth, async (req, res) => {
  const task = await Task.findOne({ id: req.params.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  const currentIdx = TASK_STATUS_ORDER.indexOf(task.status);
  const nextStatus = TASK_STATUS_ORDER[Math.min(currentIdx + 1, TASK_STATUS_ORDER.length - 1)];
  const statusHistory = [...(task.statusHistory || []), { status: nextStatus, at: new Date().toISOString() }];
  const updated = await Task.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status: nextStatus, statusHistory, updatedAt: new Date().toISOString() } },
    { new: true }
  );
  res.json(updated);
});

router.patch('/:id/decline', requireAuth, async (req, res) => {
  const updated = await Task.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status: TASK_STATUS.AVAILABLE, assignedVolunteerId: null, updatedAt: new Date().toISOString() } },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Task not found' });
  res.json(updated);
});

export default router;
