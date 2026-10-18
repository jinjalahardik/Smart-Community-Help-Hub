import { createWithRetry } from '../utils/id.js';

function escapeRegExp(str) {
  return String(str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const GLOBAL_PROTECTED_FIELDS = new Set([
  'id',
  '_id',
  'createdAt',
  'role',
  'paymentStatus',
  'paymentIntentId',
  'paymentRef',
  'verificationStatus',
  'rejectionReason',
  'statusHistory',
]);

export function makeResource(Model, {
  filters = [],
  searchFields = [],
  beforeCreate,
  sort,
  name = 'record',
  idPrefix,
  ownerField,
  allowedRoles,
  canModify,
  canDelete,
} = {}) {
  function isOwner(existing, user) {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (!ownerField) return true;

    const ownerVal = existing[ownerField];
    if (!ownerVal) return false;

    // Check user.id or user.orgId
    return ownerVal === user.id || (user.orgId && ownerVal === user.orgId);
  }

  return {
    async list(req, res) {
      const query = {};
      for (const f of filters) {
        const val = req.query[f];
        if (val !== undefined && val !== '') {
          // Disallow object values with MongoDB operators
          if (typeof val === 'object' && val !== null) continue;
          query[f] = val;
        }
      }

      let q = Model.find(query);
      if (req.query.search && searchFields.length && typeof req.query.search === 'string') {
        const rx = new RegExp(escapeRegExp(req.query.search), 'i');
        q = q.or(searchFields.map((f) => ({ [f]: rx })));
      }
      if (sort) q = q.sort(sort);
      res.json(await q.exec());
    },

    async getById(req, res) {
      const item = await Model.findOne({ id: req.params.id });
      if (!item) return res.status(404).json({ message: `${name} not found` });
      res.json(item);
    },

    async create(req, res) {
      if (allowedRoles && (!req.user || !allowedRoles.includes(req.user.role))) {
        return res.status(403).json({ message: 'You do not have permission to create this resource' });
      }

      const now = new Date().toISOString();
      const body = { ...(req.body || {}) };

      // Strip protected system keys
      for (const f of GLOBAL_PROTECTED_FIELDS) {
        delete body[f];
      }

      // Enforce owner field from authenticated user
      if (ownerField && req.user) {
        if (req.user.role !== 'admin' || !body[ownerField]) {
          body[ownerField] = (ownerField === 'hospitalId' || ownerField === 'ngoId')
            ? (req.user.orgId || req.user.id)
            : req.user.id;
        }
      }

      const data = { createdAt: now, ...body, updatedAt: now };
      const prepared = beforeCreate ? beforeCreate(data, req) : data;
      const item = await createWithRetry(Model, idPrefix || 'ID', prepared);
      res.status(201).json(item);
    },

    async update(req, res) {
      const existing = await Model.findOne({ id: req.params.id });
      if (!existing) return res.status(404).json({ message: `${name} not found` });

      const allowed = canModify ? canModify(existing, req) : isOwner(existing, req.user);
      if (!allowed) {
        return res.status(403).json({ message: 'You do not have permission to modify this record' });
      }

      const patch = { ...(req.body || {}) };

      // Disallow modifying protected fields and ownership
      for (const f of GLOBAL_PROTECTED_FIELDS) {
        delete patch[f];
      }
      if (ownerField && req.user?.role !== 'admin') {
        delete patch[ownerField];
      }
      delete patch.userId;
      delete patch.id;

      patch.updatedAt = new Date().toISOString();

      const item = await Model.findOneAndUpdate({ id: req.params.id }, { $set: patch }, { new: true });
      res.json(item);
    },

    async remove(req, res) {
      const existing = await Model.findOne({ id: req.params.id });
      if (!existing) return res.status(404).json({ message: `${name} not found` });

      const allowed = canDelete ? canDelete(existing, req) : isOwner(existing, req.user);
      if (!allowed) {
        return res.status(403).json({ message: 'You do not have permission to delete this record' });
      }

      await Model.deleteOne({ id: req.params.id });
      res.json({ success: true });
    },
  };
}
