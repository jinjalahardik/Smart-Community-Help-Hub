import { Router } from 'express';
import { Donation } from '../models/index.js';
import { makeResource } from '../controllers/crud.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadImages } from '../middleware/upload.js';
import { validateCreateDonation } from '../middleware/validate.js';
import { sendToUser } from '../services/sse.js';

const router = Router();
const resource = makeResource(Donation, {
  filters: ['donorId', 'category', 'status', 'city'],
  searchFields: ['title', 'description'],
  name: 'Donation',
  idPrefix: 'DON',
});

router.get('/', requireAuth, resource.list);
router.get('/:id', requireAuth, resource.getById);
router.post('/', requireAuth, uploadImages('images', 5), validateCreateDonation, (req, res, next) => {
  if (req.uploadedImages) req.body.images = req.uploadedImages;
  next();
}, resource.create);
router.put('/:id', requireAuth, resource.update);
router.delete('/:id', requireAuth, resource.remove);

router.patch('/:id/accept', requireAuth, async (req, res) => {
  const { ngoId } = req.body || {};
  const item = await Donation.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status: 'accepted', acceptedBy: ngoId, updatedAt: new Date().toISOString() } },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Donation not found' });
  if (item.donorId) sendToUser(item.donorId, 'donation', { type: 'accepted', donation: item });
  res.json(item);
});

router.patch('/:id/status', requireAuth, async (req, res) => {
  const { status } = req.body || {};
  const item = await Donation.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status, updatedAt: new Date().toISOString() } },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Donation not found' });
  if (item.donorId) sendToUser(item.donorId, 'donation', { type: 'status', status, donation: item });
  res.json(item);
});

export default router;
