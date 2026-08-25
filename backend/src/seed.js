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
} from './models/index.js';
import { connectDB } from './config/db.js';

const ALL_MODELS = [
  User, Ngo, Hospital, Donation, Request, Task, InventoryItem,
  Notification, Feedback, Chat, Message, AuditLog, Requirement,
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

  console.log('[seed] inserted demo data: '
    + `${users.length} users, ${buildSeedNgos().length} NGOs, ${buildSeedHospitals().length} hospitals, `
    + `${buildSeedDonations().length} donations, ${buildSeedRequests().length} requests, `
    + `${buildSeedTasks().length} tasks, ${buildSeedInventory().length} inventory items, `
    + `${buildSeedNotifications().length} notifications, ${buildSeedFeedback().length} feedback, `
    + `${chats.length} chats, ${flatMessages.length} messages, ${buildSeedAuditLogs().length} audit logs, `
    + `${requirements.length} requirements`);
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
