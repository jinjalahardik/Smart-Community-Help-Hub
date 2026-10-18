import {
  User, Ngo, Hospital, Donation, Request, AuditLog, Notification,
} from '../models/index.js';
import { VERIFICATION_STATUS, USER_STATUS } from '../../../frontend/src/constants/categories.js';
import { createWithRetry } from '../utils/id.js';
import { sendToUser } from '../services/sse.js';

export const adminController = {
  async listUsers(req, res) {
    const { role, status, search } = req.query;
    const query = {};
    if (role && typeof role === 'string') query.role = role;
    if (status && typeof status === 'string') query.status = status;
    if (search && typeof search === 'string') {
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
    const ALLOWED_USER_STATUSES = [USER_STATUS.ACTIVE, USER_STATUS.PENDING, USER_STATUS.SUSPENDED];
    if (!status || !ALLOWED_USER_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid user status' });
    }

    if (req.params.id === req.user.id && status === USER_STATUS.SUSPENDED) {
      return res.status(400).json({ message: 'You cannot suspend your own admin account' });
    }

    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { $set: { status, updatedAt: new Date().toISOString() } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    await createWithRetry(AuditLog, 'AUD', {
      actorId: req.user.id,
      actorName: req.user.name,
      action: `UPDATE_USER_STATUS_${status.toUpperCase()}`,
      target: user.email || user.id,
      createdAt: new Date().toISOString(),
    }).catch(() => {});

    const { password, ...safe } = user.toJSON();
    res.json(safe);
  },

  async deleteUser(req, res) {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }
    await User.deleteOne({ id: req.params.id });

    await createWithRetry(AuditLog, 'AUD', {
      actorId: req.user.id,
      actorName: req.user.name,
      action: 'DELETE_USER',
      target: req.params.id,
      createdAt: new Date().toISOString(),
    }).catch(() => {});

    res.json({ success: true });
  },

  async listNgos(req, res) {
    const query = {};
    if (req.query.status && typeof req.query.status === 'string') {
      query.verificationStatus = req.query.status;
    }
    res.json(await Ngo.find(query));
  },

  async listHospitals(req, res) {
    const query = {};
    if (req.query.status && typeof req.query.status === 'string') {
      query.verificationStatus = req.query.status;
    }
    res.json(await Hospital.find(query));
  },

  async approveOrg(req, res) {
    const { type, id } = req.params;
    if (type !== 'ngo' && type !== 'hospital') {
      return res.status(400).json({ message: 'Invalid organization type. Allowed: ngo, hospital' });
    }

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
    await User.updateMany({ orgId: org.id }, { $set: { status: USER_STATUS.ACTIVE } });

    await createWithRetry(AuditLog, 'AUD', {
      actorId: req.user.id,
      actorName: req.user.name,
      action: `APPROVE_${type.toUpperCase()}`,
      target: org.name || org.id,
      createdAt: new Date().toISOString(),
    }).catch(() => {});

    if (org.userId) {
      await createWithRetry(Notification, 'NTF', {
        userId: org.userId,
        category: 'approval',
        title: 'Organization Approved',
        message: `Your ${type.toUpperCase()} organization has been verified and approved by administrators. You can now access full platform capabilities.`,
        read: false,
        createdAt: new Date().toISOString(),
      }).catch(() => {});
      sendToUser(org.userId, 'notification', { type: 'approval', status: 'approved' });
    }

    res.json(org);
  },

  async rejectOrg(req, res) {
    const { type, id } = req.params;
    if (type !== 'ngo' && type !== 'hospital') {
      return res.status(400).json({ message: 'Invalid organization type. Allowed: ngo, hospital' });
    }

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

    if (org.userId) {
      await User.updateOne({ id: org.userId }, { $set: { status: USER_STATUS.SUSPENDED } });
    }
    await User.updateMany({ orgId: org.id }, { $set: { status: USER_STATUS.SUSPENDED } });

    await createWithRetry(AuditLog, 'AUD', {
      actorId: req.user.id,
      actorName: req.user.name,
      action: `REJECT_${type.toUpperCase()}`,
      target: org.name || org.id,
      createdAt: new Date().toISOString(),
    }).catch(() => {});

    if (org.userId) {
      await createWithRetry(Notification, 'NTF', {
        userId: org.userId,
        category: 'approval',
        title: 'Organization Verification Update',
        message: `Your ${type.toUpperCase()} organization verification could not be approved. Reason: ${reason || 'Requirements not met'}.`,
        read: false,
        createdAt: new Date().toISOString(),
      }).catch(() => {});
      sendToUser(org.userId, 'notification', { type: 'approval', status: 'rejected', reason });
    }

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
