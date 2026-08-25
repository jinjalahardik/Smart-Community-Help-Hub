import {
  User, Ngo, Hospital, Donation, Request, AuditLog,
} from '../models/index.js';
import { VERIFICATION_STATUS, USER_STATUS } from '../../../frontend/src/constants/categories.js';

export const adminController = {
  async listUsers(req, res) {
    const { role, status, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ name: rx }, { email: rx }];
    }
    const users = await User.find(query);
    res.json(users.map((u) => {
      const { password, ...safe } = u.toJSON();
      return safe;
    }));
  },

  async updateUserStatus(req, res) {
    const { status } = req.body || {};
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { $set: { status, updatedAt: new Date().toISOString() } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  },

  async deleteUser(req, res) {
    await User.deleteOne({ id: req.params.id });
    res.json({ success: true });
  },

  async listNgos(req, res) {
    const query = {};
    if (req.query.status) query.verificationStatus = req.query.status;
    res.json(await Ngo.find(query));
  },

  async listHospitals(req, res) {
    const query = {};
    if (req.query.status) query.verificationStatus = req.query.status;
    res.json(await Hospital.find(query));
  },

  async approveOrg(req, res) {
    const { type, id } = req.params;
    const Model = type === 'ngo' ? Ngo : Hospital;
    const label = type === 'ngo' ? 'Organization' : 'Hospital';

    const org = await Model.findOne({ id });
    if (!org) return res.status(404).json({ message: `${label} not found` });

    const statusHistory = [...(org.statusHistory || []), { status: VERIFICATION_STATUS.APPROVED, at: new Date().toISOString() }];
    org.verificationStatus = VERIFICATION_STATUS.APPROVED;
    org.statusHistory = statusHistory;
    org.rejectionReason = null;
    await org.save();

    if (org.userId) {
      await User.updateOne({ id: org.userId }, { $set: { status: USER_STATUS.ACTIVE } });
    }
    res.json(org);
  },

  async rejectOrg(req, res) {
    const { type, id } = req.params;
    const { reason } = req.body || {};
    const Model = type === 'ngo' ? Ngo : Hospital;
    const label = type === 'ngo' ? 'Organization' : 'Hospital';

    const org = await Model.findOne({ id });
    if (!org) return res.status(404).json({ message: `${label} not found` });

    const statusHistory = [...(org.statusHistory || []), { status: VERIFICATION_STATUS.REJECTED, at: new Date().toISOString(), note: reason }];
    org.verificationStatus = VERIFICATION_STATUS.REJECTED;
    org.rejectionReason = reason;
    org.statusHistory = statusHistory;
    await org.save();
    res.json(org);
  },

  async auditLogs(_req, res) {
    const logs = await AuditLog.find().sort({ createdAt: -1 });
    res.json(logs);
  },

  async analytics(_req, res) {
    const [totalUsers, totalDonations, activeRequests, completedDeliveries, ngos, hospitals] = await Promise.all([
      User.countDocuments(),
      Donation.countDocuments(),
      Request.countDocuments({ status: { $nin: ['fulfilled', 'closed', 'rejected'] } }),
      Donation.countDocuments({ status: 'completed' }),
      Ngo.find(),
      Hospital.find(),
    ]);
    res.json({
      totalUsers,
      totalDonations,
      activeRequests,
      completedDeliveries,
      pendingNgoApprovals: ngos.filter((n) => n.verificationStatus === 'pending').length,
      pendingHospitalApprovals: hospitals.filter((h) => h.verificationStatus === 'pending').length,
    });
  },
};
