import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireRole('admin'));

router.get('/users', adminController.listUsers);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

router.get('/ngos', adminController.listNgos);
router.get('/hospitals', adminController.listHospitals);

router.post('/orgs/:type/:id/approve', adminController.approveOrg);
router.post('/orgs/:type/:id/reject', adminController.rejectOrg);

router.get('/audit-logs', adminController.auditLogs);
router.get('/analytics', adminController.analytics);

export default router;
