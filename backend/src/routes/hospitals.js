import { Router } from 'express';
import { orgController } from '../controllers/orgController.js';
import { makeResource } from '../controllers/crud.js';
import { Requirement } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const requirements = makeResource(Requirement, {
  filters: ['hospitalId', 'status', 'type'],
  name: 'Requirement',
  idPrefix: 'HREQ',
  ownerField: 'hospitalId',
  allowedRoles: ['hospital', 'admin'],
  beforeCreate: (data, req) => ({
    ...data,
    hospitalId: req.user?.role === 'admin' ? (data.hospitalId || req.user.orgId || req.user.id) : (req.user?.orgId || req.user.id),
    status: data.status || 'active',
  }),
});

// Specific paths before /:id
router.get('/requirements', requireAuth, requirements.list);
router.get('/requirements/:id', requireAuth, requirements.getById);
router.post('/requirements', requireAuth, requirements.create);
router.put('/requirements/:id', requireAuth, requirements.update);

router.get('/received-donations', requireAuth, orgController.receivedDonations);

router.get('/:id', requireAuth, orgController.getProfile);
router.put('/:id', requireAuth, orgController.updateProfile);

export default router;
