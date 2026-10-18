import { Router } from 'express';
import { orgController } from '../controllers/orgController.js';
import { celebrationController } from '../controllers/celebrationController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// NOTE: /volunteers must be registered before /:id so "volunteers" is not
// captured as an org id.
router.get('/volunteers', requireAuth, orgController.volunteers);
// Public list of verified NGOs (Celebrate & Give "choose NGO" step).
router.get('/public', celebrationController.publicNgos);
router.get('/:id/distributions', requireAuth, orgController.distributions);
router.get('/:id', requireAuth, orgController.getProfile);
router.put('/:id', requireAuth, orgController.updateProfile);

export default router;
