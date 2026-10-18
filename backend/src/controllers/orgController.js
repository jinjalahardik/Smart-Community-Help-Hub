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

    // Only the organization owner or an admin can update
    const isOwner = req.user && (req.user.role === 'admin' || req.user.orgId === id);
    if (!isOwner) {
      return res.status(403).json({ message: 'You do not have permission to modify this organization profile' });
    }

    // Explicit field allowlist: prevent self-approval and internal status tampering
    const ALLOWED_ORG_FIELDS = [
      'name',
      'contactPerson',
      'phone',
      'address',
      'city',
      'serviceCategories',
      'serviceRadiusKm',
      'bloodBankAvailable',
      'medicineSupportAvailable',
      'licenseNumber',
      'registrationNumber',
    ];

    const patch = {};
    for (const field of ALLOWED_ORG_FIELDS) {
      if (req.body[field] !== undefined) {
        patch[field] = req.body[field];
      }
    }
    patch.updatedAt = new Date().toISOString();

    let org = await Ngo.findOneAndUpdate({ id }, { $set: patch }, { new: true });
    if (!org) org = await Hospital.findOneAndUpdate({ id }, { $set: patch }, { new: true });
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    res.json(org);
  },

  async distributions(req, res) {
    const ngoId = req.params.id || req.params.ngoId;

    // Authorization: only the owning NGO, a volunteer (task context), or admin
    // may view distribution history. Plain donors/requesters/hospitals have
    // no legitimate reason to enumerate another org's deliveries.
    const isAdmin = req.user.role === 'admin';
    const isOwningNgo = req.user.role === 'ngo' && (req.user.orgId === ngoId || req.user.id === ngoId);
    const isVolunteer = req.user.role === 'volunteer';

    if (!isAdmin && !isOwningNgo && !isVolunteer) {
      return res.status(403).json({ message: 'You do not have permission to view this organization\'s distribution history' });
    }

    const [donations, requests] = await Promise.all([
      Donation.find({ acceptedBy: ngoId, status: 'completed' }),
      Request.find({ assignedNgoId: ngoId, status: { $in: ['fulfilled', 'closed'] } }),
    ]);
    res.json({ donations, requests });
  },

  async volunteers(req, res) {
    // Only NGOs (to manage task assignments), volunteers (to see peers), and
    // admins have a legitimate reason to list all volunteers.
    if (!['ngo', 'volunteer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to list volunteers' });
    }
    const users = await User.find({ role: 'volunteer' });
    res.json(users.map((u) => {
      const { password, ...safe } = u.toJSON();
      return safe;
    }));
  },

  async receivedDonations(req, res) {
    // A hospital user should only see blood donations accepted by/to their
    // own organisation. Admins may optionally filter by any hospitalId.
    const query = { category: 'blood', status: 'completed' };
    if (req.user.role !== 'admin') {
      const hospitalOrgId = req.user.orgId || req.user.id;
      query.acceptedBy = hospitalOrgId;
    }
    const donations = await Donation.find(query);
    res.json(donations);
  },
};
