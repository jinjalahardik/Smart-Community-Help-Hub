import { createWithRetry } from '../utils/id.js';

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Generic resource controller that mirrors the mock API semantics:
// list with whitelisted query filters + optional text search,
// getById/create/update/remove keyed on the string `id` field.
export function makeResource(Model, { filters = [], searchFields = [], beforeCreate, sort, name = 'record', idPrefix } = {}) {
  return {
    async list(req, res) {
      const query = {};
      for (const f of filters) {
        if (req.query[f] !== undefined) query[f] = req.query[f];
      }
      let q = Model.find(query);
      if (req.query.search && searchFields.length) {
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
      const now = new Date().toISOString();
      const data = { createdAt: now, ...req.body, updatedAt: now };
      const prepared = beforeCreate ? beforeCreate(data, req) : data;
      const item = await createWithRetry(Model, idPrefix || 'ID', prepared);
      res.status(201).json(item);
    },

    async update(req, res) {
      const patch = { ...req.body, updatedAt: new Date().toISOString() };
      const item = await Model.findOneAndUpdate({ id: req.params.id }, { $set: patch }, { new: true });
      if (!item) return res.status(404).json({ message: `${name} not found` });
      res.json(item);
    },

    async remove(req, res) {
      await Model.deleteOne({ id: req.params.id });
      res.json({ success: true });
    },
  };
}
