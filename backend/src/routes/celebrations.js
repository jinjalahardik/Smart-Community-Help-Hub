import { Router } from 'express';
import { celebrationController } from '../controllers/celebrationController.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { validateCelebrationCreate, validateGive, validateDonate } from '../middleware/validate.js';

const router = Router();

// Order matters: static/mine paths first so they are not captured by :id.
router.get('/mine/donations', requireAuth, celebrationController.myDonations);

router.get('/', requireAuth, celebrationController.listMine);
router.post('/', requireAuth, validateCelebrationCreate, celebrationController.create);
router.get('/public/:slug', celebrationController.publicBySlug);
router.get('/:id/donations', celebrationController.donationsForCampaign);
router.get('/:id/impact', celebrationController.impactList);
router.post('/:id/impact', requireAuth, celebrationController.addImpact);
router.post('/:id/donate', optionalAuth, validateDonate, celebrationController.donateToCampaign);
router.patch('/:id/pause', requireAuth, celebrationController.pause);
router.get('/:id', requireAuth, celebrationController.getById);
router.put('/:id', requireAuth, celebrationController.update);
router.delete('/:id', requireAuth, celebrationController.remove);

// Quick Give — standalone donation, campaign fully optional.
router.post('/give', optionalAuth, validateGive, celebrationController.quickGive);

export default router;