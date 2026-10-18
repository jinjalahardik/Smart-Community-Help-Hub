import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {
  buildSeedUsers, buildSeedNgos, buildSeedHospitals, buildSeedDonations,
  buildSeedRequests, buildSeedTasks, buildSeedInventory, buildSeedNotifications,
  buildSeedFeedback, buildSeedChats, buildSeedAuditLogs,
} from '../../frontend/src/services/seedData.js';
import {
  User, Ngo, Hospital, Donation, Request, Task, InventoryItem,
  Notification, Feedback, Chat, Message, AuditLog, Requirement,
  CelebrationCampaign,
} from './models/index.js';
import { connectDB } from './config/db.js';

const ALL_MODELS = [
  User, Ngo, Hospital, Donation, Request, Task, InventoryItem,
  Notification, Feedback, Chat, Message, AuditLog, Requirement,
  CelebrationCampaign,
];

// Seeds the same demo data the frontend mock used (from frontend/src/services/seedData.js),
// so the real backend behaves identically to the demo. Passwords are bcrypt-hashed.
export async function seedDatabase({ force = false } = {}) {
  const existing = await User.estimatedDocumentCount();
  if (existing > 0 && !force) {
    console.log(`[seed] database already has ${existing} users; skipping (set force=true to reseed)`);
    return false;
  }

  for (const Model of ALL_MODELS) {
    await Model.deleteMany({});
  }

  // Some seeded "extra" users have no password (never used for login in the
  // mock). Give them a harmless default so bcrypt never receives undefined.
  const users = buildSeedUsers().map((u) => ({
    ...u,
    email: String(u.email).toLowerCase().trim(),
    password: bcrypt.hashSync(u.password || 'Demo@123', 10),
  }));
  await User.insertMany(users);

  await Ngo.insertMany(buildSeedNgos());
  await Hospital.insertMany(buildSeedHospitals());
  await Donation.insertMany(buildSeedDonations());
  await Request.insertMany(buildSeedRequests());
  await Task.insertMany(buildSeedTasks());
  await InventoryItem.insertMany(buildSeedInventory());
  await Notification.insertMany(buildSeedNotifications());
  await Feedback.insertMany(buildSeedFeedback());

  const { chats, messages } = buildSeedChats();
  const flatMessages = Object.values(messages).flat();
  await Chat.insertMany(chats);
  await Message.insertMany(flatMessages);
  await AuditLog.insertMany(buildSeedAuditLogs());

  // Seed hospital requirements
  const requirements = [
    { id: 'HREQ-1', hospitalId: 'HOSP-1', type: 'blood', title: 'Urgent O- blood requirement', itemName: 'O- Blood', quantity: 10, unit: 'units', status: 'active', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'HREQ-2', hospitalId: 'HOSP-1', type: 'medicine', title: 'IV Fluids restocking needed', itemName: 'Normal Saline IV', quantity: 50, unit: 'bottles', status: 'active', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: 'HREQ-3', hospitalId: 'HOSP-1', type: 'blood', title: 'AB+ blood stock refill', itemName: 'AB+ Blood', quantity: 8, unit: 'units', status: 'fulfilled', createdAt: new Date(Date.now() - 10 * 86400000).toISOString() },
  ];
  await Requirement.insertMany(requirements);

  // Seed Celebrate & Give (monetary) campaigns + contributions.
  // Monetary contributions live in the unified Donation collection (money docs)
  // with a server-verified COMPLETED payment state, matching the real flow.
  const campaigns = [
    {
      id: 'CMP-1', ownerId: 'USR-DONOR-1', ownerName: 'Rohan Shah',
      eventType: 'birthday', eventTitle: "Aarav's 5th Birthday",
      eventDate: new Date(Date.now() - 7 * 86400000).toISOString(),
      description: 'Instead of gifts, we are feeding 100 children for Aarav\'s 5th birthday. Every contribution goes directly to Asha Seva Foundation\'s kitchen programme.',
      cause: 'food', causeLabel: 'Food', ngoId: 'NGO-1', ngoName: 'Asha Seva Foundation',
      goalAmount: 25000, raisedAmount: 12900, currency: 'INR',
      slug: 'aaravs-5th-birthday-7k2p9', isPublic: true, status: 'active',
      theme: 'sky', coverImage: '',
      donationCount: 12,
      impactUpdates: [
        { id: 'IMP-1710000000000', avatarColor: '#0D9488', authorRole: 'user', authorName: 'Rohan Shah', text: 'We crossed ₹10,000 — enough for 40 meal kits. Thank you everyone!' },
      ],
      previousCampaignId: '', createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
    {
      id: 'CMP-2', ownerId: 'USR-DONOR-1', ownerName: 'Rohan Shah',
      eventType: 'newjob', eventTitle: 'New job — medicine drive',
      eventDate: new Date(Date.now() - 2 * 86400000).toISOString(),
      description: 'Celebrating my new role by stocking medicine cabinets at Asha Seva Foundation. Proud to give back.',
      cause: 'medicine', causeLabel: 'Medicine', ngoId: 'NGO-1', ngoName: 'Asha Seva Foundation',
      goalAmount: 30000, raisedAmount: 0, currency: 'INR',
      slug: 'new-job-medicine-drive-x4cf1', isPublic: true, status: 'active',
      theme: 'coral', coverImage: '',
      donationCount: 0, impactUpdates: [], previousCampaignId: '',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ];
  const moneyDonations = [
    {
      id: 'DON-MONEY-1', donationType: 'money', donorType: 'authenticated',
      donorId: 'USR-DONOR-1', donorName: 'Rohan Shah', donorEmail: 'rohan.shah@example.com',
      anonymous: false, occasion: 'birthday', cause: 'food', ngoId: 'NGO-1',
      ngoName: 'Asha Seva Foundation', campaignId: 'CMP-1',
      amount: 2500, currency: 'INR', paymentStatus: 'COMPLETED',
      paymentProvider: 'sandbox', paymentRef: 'TXN-SEED-110011',
      paymentIntentId: 'CID-SEED-110011', idempotencyKey: 'seed-mn-1',
      publicDonationReference: 'SCHH-8F42K9A1',
      status: 'completed',
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      completedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
    {
      id: 'DON-MONEY-2', donationType: 'money', donorType: 'authenticated',
      donorId: 'USR-VOL-1', donorName: 'Aman Trivedi', donorEmail: 'aman.trivedi@example.com',
      anonymous: false, occasion: 'birthday', cause: 'food', ngoId: 'NGO-1',
      ngoName: 'Asha Seva Foundation', campaignId: 'CMP-1',
      amount: 1000, currency: 'INR', paymentStatus: 'COMPLETED',
      paymentProvider: 'sandbox', paymentRef: 'TXN-SEED-110012',
      paymentIntentId: 'CID-SEED-110012', idempotencyKey: 'seed-mn-2',
      publicDonationReference: 'SCHH-8F42K9B2',
      status: 'completed',
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      completedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      id: 'DON-MONEY-3', donationType: 'money', donorType: 'authenticated',
      donorId: 'USR-DONOR-1', donorName: 'Anonymous Donor', donorEmail: 'rohan.shah@example.com',
      anonymous: true, occasion: 'graduation', cause: 'clothes', ngoId: 'NGO-1',
      ngoName: 'Asha Seva Foundation', campaignId: null,
      amount: 500, currency: 'INR', paymentStatus: 'COMPLETED',
      paymentProvider: 'sandbox', paymentRef: 'TXN-SEED-110013',
      paymentIntentId: 'CID-SEED-110013', idempotencyKey: 'seed-mn-3',
      publicDonationReference: 'SCHH-8F42K9C3',
      status: 'completed',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      completedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ];
  await CelebrationCampaign.insertMany(campaigns);
  await Donation.insertMany(moneyDonations);

  console.log('[seed] inserted demo data: '
    + `${users.length} users, ${buildSeedNgos().length} NGOs, ${buildSeedHospitals().length} hospitals, `
    + `${buildSeedDonations().length} donations, ${buildSeedRequests().length} requests, `
    + `${buildSeedTasks().length} tasks, ${buildSeedInventory().length} inventory items, `
    + `${buildSeedNotifications().length} notifications, ${buildSeedFeedback().length} feedback, `
    + `${chats.length} chats, ${flatMessages.length} messages, ${buildSeedAuditLogs().length} audit logs, `
    + `${requirements.length} requirements, ${campaigns.length} celebration campaigns, ${moneyDonations.length} money donations`);
  return true;
}

// CLI entry point: `npm run seed`
const isCli = process.argv[1]
  && process.argv[1].replace(/\\/g, '/').split('/').pop() === 'seed.js';

if (isCli) {
  try {
    await connectDB();
    await seedDatabase({ force: true });
    console.log('[seed] done');
    process.exit(0);
  } catch (err) {
    console.error('[seed] failed:', err.message);
    process.exit(1);
  }
}
