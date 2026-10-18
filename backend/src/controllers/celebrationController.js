import {
  Ngo,
  CelebrationCampaign,
  Donation,
  Notification,
} from '../models/index.js';
import { createWithRetry } from '../utils/id.js';
import { sendToUser } from '../services/sse.js';
import {
  createMoneyDonation,
  safeMoneyDonation,
  verifyNgo,
  parseAmount,
  MIN_AMOUNT,
  MAX_AMOUNT,
  badRequest,
  notFound,
  forbidden,
  causeLabel,
  occasionLabel,
} from '../services/moneyService.js';

// ---- Helpers for notifications ----
async function notifyOwner(ownerId, title, message, relatedEntity) {
  const notification = await createWithRetry(Notification, 'NTF', {
    userId: ownerId,
    category: 'celebration',
    title,
    message,
    read: false,
    createdAt: new Date().toISOString(),
    relatedEntity: relatedEntity || {},
  });
  sendToUser(ownerId, 'notification', notification);
}

// ---- Public helpers used by the NGO route ----
export async function publicVerifiedNgos(query = {}) {
  return Ngo.find({ verificationStatus: 'approved', ...query })
    .select({ id: 1, name: 1, city: 1, serviceCategories: 1, verificationStatus: 1 })
    .sort({ name: 1 });
}

const MONEY_COMPLETED = { donationType: 'money', paymentStatus: 'COMPLETED' };

export const celebrationController = {
  // GET /api/ngos/public (verified NGOs only — for the "choose NGO" step)
  async publicNgos(_req, res) {
    res.json(await publicVerifiedNgos());
  },

  // POST /api/celebrations (create a campaign)
  async create(req, res) {
    const {
      eventType, eventTitle, eventDate, description, cause, ngoId,
      goalAmount, theme, coverImage, isPublic = true, previousCampaignId,
    } = req.body || {};

    if (!eventType) throw badRequest('Choose an occasion type');
    if (!eventTitle || !String(eventTitle).trim()) throw badRequest('Event title is required');
    if (!['food', 'clothes', 'medicine', 'blood'].includes(cause)) throw badRequest('Invalid cause');
    const amount = parseAmount(goalAmount);
    if (amount == null) throw badRequest(`Goal amount must be between ₹${MIN_AMOUNT} and ₹${MAX_AMOUNT}`);
    const ngo = await verifyNgo(ngoId);
    if (!ngo) throw badRequest('Choose a verified NGO to receive the funds');

    const campaign = await createWithRetry(CelebrationCampaign, 'CMP', {
      ownerId: req.userId,
      ownerName: req.user.name,
      eventType,
      eventTitle: String(eventTitle).trim(),
      eventDate: eventDate || null,
      description: String(description || '').trim(),
      cause,
      causeLabel: causeLabel(cause),
      ngoId: ngo.id,
      ngoName: ngo.name,
      goalAmount: amount,
      raisedAmount: 0,
      currency: 'INR',
      slug: makeSlug(eventTitle),
      isPublic: isPublic === true || isPublic === 'true',
      status: 'active',
      theme: theme || 'celebrate',
      coverImage: coverImage || '',
      donationCount: 0,
      impactUpdates: [],
      previousCampaignId: previousCampaignId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    notifyOwner(req.userId, 'Campaign created 🎉', `"${campaign.eventTitle}" is live. Share it to start collecting.`, { campaignId: campaign.id });
    res.status(201).json(campaign);
  },

  // GET /api/celebrations (my campaigns)
  async listMine(req, res) {
    const campaigns = await CelebrationCampaign.find({ ownerId: req.userId }).sort({ createdAt: -1 });
    res.json(campaigns);
  },

  // GET /api/celebrations/:id (owner)
  async getById(req, res) {
    const campaign = await CelebrationCampaign.findOne({ id: req.params.id });
    if (!campaign) throw notFound('Campaign not found');
    if (campaign.ownerId !== req.userId) throw forbidden();
    res.json(campaign);
  },

  // PUT /api/celebrations/:id (owner)
  async update(req, res) {
    const campaign = await CelebrationCampaign.findOne({ id: req.params.id });
    if (!campaign) throw notFound('Campaign not found');
    if (campaign.ownerId !== req.userId) throw forbidden();

    const allowed = ['eventTitle', 'eventDate', 'description', 'theme', 'coverImage', 'isPublic'];
    const patch = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) patch[key] = req.body[key];
    }
    if (req.body.goalAmount !== undefined) {
      const amount = parseAmount(req.body.goalAmount);
      if (amount == null) throw badRequest('Goal amount must be a valid number');
      if (amount < campaign.raisedAmount) throw badRequest('Goal cannot be lower than the amount already raised');
      patch.goalAmount = amount;
    }

    const updated = await CelebrationCampaign.findOneAndUpdate(
      { id: campaign.id },
      { $set: { ...patch, updatedAt: new Date().toISOString() } },
      { new: true }
    );
    res.json(updated);
  },

  // PATCH /api/celebrations/:id/pause (owner)
  async pause(req, res) {
    const campaign = await CelebrationCampaign.findOne({ id: req.params.id });
    if (!campaign) throw notFound('Campaign not found');
    if (campaign.ownerId !== req.userId) throw forbidden();
    const paused = req.body.paused === true || req.body.paused === 'true';
    const nextStatus = paused ? 'paused' : 'active';
    const updated = await CelebrationCampaign.findOneAndUpdate(
      { id: campaign.id },
      { $set: { status: nextStatus, updatedAt: new Date().toISOString() } },
      { new: true }
    );
    res.json(updated);
  },

  // DELETE /api/celebrations/:id (owner)
  async remove(req, res) {
    const campaign = await CelebrationCampaign.findOne({ id: req.params.id });
    if (!campaign) throw notFound('Campaign not found');
    if (campaign.ownerId !== req.userId) throw forbidden();
    await CelebrationCampaign.deleteOne({ id: campaign.id });
    res.json({ success: true });
  },

  // GET /api/celebrations/public/:slug (everyone)
  async publicBySlug(req, res) {
    const campaign = await CelebrationCampaign.findOne({ slug: req.params.slug });
    if (!campaign || campaign.isPublic === false) throw notFound('Campaign not found');
    res.json(campaign);
  },

  // GET /api/celebrations/:id/donations (recent contributors, safe fields)
  async donationsForCampaign(req, res) {
    const donations = await Donation.find({ ...MONEY_COMPLETED, campaignId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(100);
    const safe = donations.map((d) => ({
      id: d.id,
      donorName: d.anonymous ? 'Anonymous Donor' : (d.donorName || 'Anonymous Donor'),
      amount: d.amount,
      cause: d.cause,
      ngoId: d.ngoId,
      createdAt: d.createdAt,
    }));
    res.json(safe);
  },

  // GET /api/celebrations/:id/impact (real, aggregated numbers only)
  async impactList(req, res) {
    const campaign = await CelebrationCampaign.findOne({ id: req.params.id });
    if (!campaign) throw notFound('Campaign not found');
    const donations = await Donation.find({ ...MONEY_COMPLETED, campaignId: campaign.id }).sort({ createdAt: -1 });
    const totalDonors = donations.length;
    res.json({
      campaignId: campaign.id,
      totalRaised: campaign.raisedAmount,
      goalAmount: campaign.goalAmount,
      donationCount: campaign.donationCount,
      totalDonors,
      averageDonation: totalDonors ? Math.round(campaign.raisedAmount / totalDonors) : 0,
      recentDonations: donations.slice(0, 5).map((d) => ({
        donorName: d.anonymous ? 'Anonymous Donor' : d.donorName,
        amount: d.amount,
        createdAt: d.createdAt,
      })),
      updates: campaign.impactUpdates || [],
    });
  },

  // POST /api/celebrations/:id/impact (owner adds an impact update)
  async addImpact(req, res) {
    const campaign = await CelebrationCampaign.findOne({ id: req.params.id });
    if (!campaign) throw notFound('Campaign not found');
    if (campaign.ownerId !== req.userId) throw forbidden();
    if (!req.body.message || !String(req.body.message).trim()) throw badRequest('Impact update message is required');

    const update = {
      id: `IMP-${Date.now()}`,
      title: req.body.title || 'Impact update',
      message: String(req.body.message).trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = await CelebrationCampaign.findOneAndUpdate(
      { id: campaign.id },
      { $push: { impactUpdates: update }, $set: { updatedAt: new Date().toISOString() } },
      { new: true }
    );
    res.status(201).json(updated);
  },

  // POST /api/celebrations/:id/donate (public — logged-in optional)
  async donateToCampaign(req, res) {
    const campaign = await CelebrationCampaign.findOne({ id: req.params.id });
    if (!campaign) throw notFound('Campaign not found');

    const result = await createMoneyDonation({ user: req.user || null, body: req.body, campaign });
    const fresh = await CelebrationCampaign.findOne({ id: campaign.id });
    res.status(201).json({ ...result, campaign: fresh });
  },

  // POST /api/celebrations/give (Quick Give — public, no campaign required)
  async quickGive(req, res) {
    const result = await createMoneyDonation({ user: req.user || null, body: req.body, campaign: null });
    res.status(201).json(result);
  },

  // GET /api/celebrations/mine/donations (receipts for the logged-in user)
  async myDonations(req, res) {
    const donations = await Donation.find({ donationType: 'money', donorId: req.userId })
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(donations.map(safeMoneyDonation));
  },
};

function makeSlug(title) {
  const base = String(title || 'celebration')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'celebration';
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}