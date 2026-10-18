import { Router } from 'express';
import { Task } from '../models/index.js';
import { makeResource } from '../controllers/crud.js';
import { requireAuth } from '../middleware/auth.js';
import { TASK_STATUS, TASK_STATUS_ORDER } from '../shared/constants/categories.js';
import { sendToUser } from '../services/sse.js';

const router = Router();

const resource = makeResource(Task, {
  filters: ['volunteerId', 'ngoId', 'status'],
  name: 'Task',
  idPrefix: 'TSK',
  ownerField: 'ngoId',
  allowedRoles: ['ngo', 'admin'],
  beforeCreate: (data, req) => ({
    ...data,
    ngoId: req.user?.role === 'admin' ? (data.ngoId || req.user.orgId || req.user.id) : (req.user?.orgId || req.user?.id),
    status: TASK_STATUS.AVAILABLE,
    statusHistory: [{ status: TASK_STATUS.AVAILABLE, at: new Date().toISOString() }],
  }),
});

router.get('/', requireAuth, async (req, res) => {
  const query = {};
  if (req.query.volunteerId && typeof req.query.volunteerId === 'string') query.assignedVolunteerId = req.query.volunteerId;
  if (req.query.ngoId && typeof req.query.ngoId === 'string') query.ngoId = req.query.ngoId;
  if (req.query.status && typeof req.query.status === 'string') query.status = req.query.status;
  if (req.query.available === 'true') query.status = TASK_STATUS.AVAILABLE;
  res.json(await Task.find(query));
});

router.get('/:id', requireAuth, resource.getById);
router.post('/', requireAuth, resource.create);
router.put('/:id', requireAuth, (req, res, next) => {
  if (req.body) {
    delete req.body.status;
    delete req.body.assignedVolunteerId;
    delete req.body.statusHistory;
  }
  return resource.update(req, res, next);
});
router.delete('/:id', requireAuth, resource.remove);

// Only volunteers can accept tasks, and assignedVolunteerId must be the authenticated user's ID
router.patch('/:id/accept', requireAuth, async (req, res) => {
  if (req.user.role !== 'volunteer' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only registered volunteers can accept tasks' });
  }

  const task = await Task.findOne({ id: req.params.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  if (task.status !== TASK_STATUS.AVAILABLE || task.assignedVolunteerId) {
    return res.status(400).json({ message: 'Task has already been assigned to another volunteer or is not available' });
  }

  const volunteerId = req.user.id;
  const statusHistory = [...(task.statusHistory || []), { status: TASK_STATUS.ACCEPTED, at: new Date().toISOString() }];

  // Atomic compare-and-swap prevents race conditions where two volunteers accept simultaneously
  const updated = await Task.findOneAndUpdate(
    {
      id: req.params.id,
      status: TASK_STATUS.AVAILABLE,
      $or: [{ assignedVolunteerId: null }, { assignedVolunteerId: { $exists: false } }],
    },
    { $set: { status: TASK_STATUS.ACCEPTED, assignedVolunteerId: volunteerId, statusHistory, updatedAt: new Date().toISOString() } },
    { new: true }
  );

  if (!updated) {
    return res.status(409).json({ message: 'Task has already been assigned to another volunteer' });
  }

  if (updated.ngoId) sendToUser(updated.ngoId, 'task', { type: 'accepted', task: updated });

  res.json(updated);
});

// Only the assigned volunteer, the owning NGO, or an admin can advance a task
router.patch('/:id/advance', requireAuth, async (req, res) => {
  const task = await Task.findOne({ id: req.params.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const isAssignedVolunteer = task.assignedVolunteerId === req.user.id;
  const isOwningNgo = req.user.orgId && task.ngoId === req.user.orgId;
  const isAdmin = req.user.role === 'admin';

  if (!isAssignedVolunteer && !isOwningNgo && !isAdmin) {
    return res.status(403).json({ message: 'You do not have permission to advance this task' });
  }

  if (task.status === TASK_STATUS.AVAILABLE) {
    return res.status(400).json({ message: 'Task must be accepted by a volunteer before it can be advanced' });
  }

  if (task.status === TASK_STATUS.COMPLETED) {
    return res.status(400).json({ message: 'Task is already completed' });
  }

  const currentIdx = TASK_STATUS_ORDER.indexOf(task.status);
  const nextStatus = TASK_STATUS_ORDER[Math.min(currentIdx + 1, TASK_STATUS_ORDER.length - 1)];
  const statusHistory = [...(task.statusHistory || []), { status: nextStatus, at: new Date().toISOString() }];
  const updated = await Task.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status: nextStatus, statusHistory, updatedAt: new Date().toISOString() } },
    { new: true }
  );

  if (updated.ngoId) sendToUser(updated.ngoId, 'task', { type: 'status', status: nextStatus, task: updated });
  if (updated.assignedVolunteerId) sendToUser(updated.assignedVolunteerId, 'task', { type: 'status', status: nextStatus, task: updated });

  res.json(updated);
});

// Only the assigned volunteer, the owning NGO, or an admin can decline/release a task
router.patch('/:id/decline', requireAuth, async (req, res) => {
  const task = await Task.findOne({ id: req.params.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const isAssignedVolunteer = task.assignedVolunteerId === req.user.id;
  const isOwningNgo = req.user.orgId && task.ngoId === req.user.orgId;
  const isAdmin = req.user.role === 'admin';

  if (!isAssignedVolunteer && !isOwningNgo && !isAdmin) {
    return res.status(403).json({ message: 'You do not have permission to decline or release this task' });
  }

  if (task.status === TASK_STATUS.COMPLETED) {
    return res.status(400).json({ message: 'Completed tasks cannot be declined or reopened' });
  }

  if (task.status === TASK_STATUS.AVAILABLE && !task.assignedVolunteerId) {
    return res.status(400).json({ message: 'Task is already available and not assigned' });
  }

  const statusHistory = [...(task.statusHistory || []), { status: TASK_STATUS.AVAILABLE, at: new Date().toISOString(), note: 'Released' }];
  const updated = await Task.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status: TASK_STATUS.AVAILABLE, assignedVolunteerId: null, statusHistory, updatedAt: new Date().toISOString() } },
    { new: true }
  );

  if (updated.ngoId) sendToUser(updated.ngoId, 'task', { type: 'declined', task: updated });

  res.json(updated);
});

export default router;
