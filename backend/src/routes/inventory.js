import { Router } from 'express';
import { InventoryItem } from '../models/index.js';
import { makeResource } from '../controllers/crud.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const resource = makeResource(InventoryItem, {
  filters: ['ownerId', 'ownerType', 'category'],
  searchFields: ['itemName'],
  name: 'Inventory item',
  idPrefix: 'INV',
  ownerField: 'ownerId',
  allowedRoles: ['ngo', 'hospital', 'admin'],
  beforeCreate: (data, req) => ({
    ...data,
    ownerId: req.user?.role === 'admin' ? (data.ownerId || req.user.orgId || req.user.id) : (req.user?.orgId || req.user?.id),
    ownerType: req.user?.role === 'admin' ? (data.ownerType || 'admin') : req.user?.role,
  }),
});

router.get('/', requireAuth, resource.list);
router.get('/:id', requireAuth, resource.getById);
router.post('/', requireAuth, resource.create);
router.put('/:id', requireAuth, resource.update);
router.delete('/:id', requireAuth, resource.remove);

export default router;
