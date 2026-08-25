import { Ngo, Hospital, User, Donation, Request } from '../models/index.js';

export const orgController = {
  async getProfile(req, res) {
    const { id } = req.params;
    const org = await Ngo.findOne({ id }) || await Hospital.findOne({ id });
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    res.json(org);
  },

  async updateProfile(req, res) {
    const { id } = req.params;
    const patch = { ...req.body, updatedAt: new Date().toISOString() };
    let org = await Ngo.findOneAndUpdate({ id }, { $set: patch }, { new: true });
    if (!org) org = await Hospital.findOneAndUpdate({ id }, { $set: patch }, { new: true });
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    res.json(org);
  },

  async distributions(req, res) {
    const { ngoId } = req.params;
    const [donations, requests] = await Promise.all([
      Donation.find({ acceptedBy: ngoId, status: 'completed' }),
      Request.find({ assignedNgoId: ngoId, status: { $in: ['fulfilled', 'closed'] } }),
    ]);
    res.json({ donations, requests });
  },

  async volunteers(_req, res) {
    const users = await User.find({ role: 'volunteer' });
    res.json(users.map((u) => {
      const { password, ...safe } = u.toJSON();
      return safe;
    }));
  },

  async receivedDonations(_req, res) {
    const donations = await Donation.find({ category: 'blood', status: 'completed' });
    res.json(donations);
  },
};
