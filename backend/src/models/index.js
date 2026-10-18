import mongoose from 'mongoose';

const { Schema } = mongoose;

// Every record keeps the frontend's string `id` as the application key.
// `_id`/`__v` are hidden from JSON responses and `id` is always present,
// matching the shape the mock API returned to the frontend.
const baseOptions = {
  strict: false,
  versionKey: false,
  toJSON: {
    transform(_doc, ret) {
      if (ret.id == null) ret.id = String(ret._id);
      delete ret._id;
      delete ret.password;
      return ret;
    },
  },
};

export const User = mongoose.model('User', new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  phone: String,
  city: String,
  status: { type: String, default: 'active' },
  emailVerified: { type: Boolean, default: false },
  orgId: String,
  avatarColor: { type: String, default: '#0F766E' },
}, baseOptions));
User.schema.index({ role: 1 });
User.schema.index({ status: 1 });
User.schema.index({ orgId: 1 });

export const Ngo = mongoose.model('Ngo', new Schema({
  id: { type: String, required: true, unique: true },
  userId: String,
  name: { type: String, required: true },
  registrationNumber: String,
  contactPerson: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  serviceCategories: [String],
  serviceRadiusKm: Number,
  verificationStatus: { type: String, default: 'pending' },
  documents: [String],
  statusHistory: [],
  rejectionReason: String,
}, baseOptions));

export const Hospital = mongoose.model('Hospital', new Schema({
  id: { type: String, required: true, unique: true },
  userId: String,
  name: { type: String, required: true },
  licenseNumber: String,
  contactPerson: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  bloodBankAvailable: Boolean,
  medicineSupportAvailable: Boolean,
  verificationStatus: { type: String, default: 'pending' },
  documents: [String],
  statusHistory: [],
  rejectionReason: String,
}, baseOptions));

// Single unified donation record:
// - goods donations use the lifecycle fields (category/title/quantity/pickup…)
//   and `status` (pending -> accepted -> completed) with donationType 'goods';
// - monetary donations (Celebrate & Give / Quick Give / campaigns) use
//   amount/currency + paymentStatus (PENDING -> webhook-verified COMPLETED),
//   donationType 'money', and may target a CelebrationCampaign via campaignId.
export const Donation = mongoose.model('Donation', new Schema({
  id: { type: String, required: true, unique: true },
  donationType: { type: String, default: 'goods' }, // goods | money
  donorType: { type: String, default: 'authenticated' }, // authenticated | guest
  // Shared / goods fields
  donorId: String,
  donorName: String,
  category: String,
  title: String,
  description: String,
  quantity: Number,
  unit: String,
  pickupAddress: String,
  city: String,
  pinCode: String,
  preferredPickupDate: String,
  contactNumber: String,
  status: { type: String, default: 'pending' },
  availability: String,
  notes: String,
  images: { type: Array, default: [] },
  acceptedBy: String,
  assignedVolunteerId: String,
  completedAt: String,
  // Monetary fields (donationType 'money'). Never set from the client; the
  // payment lifecycle is driven only by the signed gateway webhook.
  donorEmail: String,
  donorPhone: String,
  anonymous: { type: Boolean, default: false },
  occasion: String,
  cause: String,
  ngoId: String,
  ngoName: String,
  campaignId: String,
  amount: Number,
  currency: { type: String, default: 'INR' },
  // PENDING -> COMPLETED | FAILED | CANCELLED | REFUNDED (server-verified for monetary)
  paymentStatus: String,
  paymentProvider: String,
  paymentIntentId: String,
  paymentRef: String,
  idempotencyKey: String,
  publicDonationReference: String,
}, baseOptions));
Donation.schema.index({ donorId: 1 });
Donation.schema.index({ donorEmail: 1 });
Donation.schema.index({ campaignId: 1 });
Donation.schema.index({ donationType: 1 });
Donation.schema.index({ paymentStatus: 1 });
Donation.schema.index({ status: 1 });
Donation.schema.index({ category: 1 });
Donation.schema.index({ city: 1 });
Donation.schema.index({ publicDonationReference: 1 }, { unique: true, sparse: true });
Donation.schema.index({ paymentIntentId: 1 }, { unique: true, sparse: true });
Donation.schema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });

export const Request = mongoose.model('Request', new Schema({
  id: { type: String, required: true, unique: true },
  requesterId: String,
  requesterName: String,
  category: String,
  urgency: String,
  title: String,
  description: String,
  requiredQuantity: Number,
  unit: String,
  address: String,
  city: String,
  pinCode: String,
  contactNumber: String,
  affectedPeople: Number,
  vulnerablePersonInfo: String,
  neededBefore: String,
  consentGiven: Boolean,
  status: { type: String, default: 'pending' },
  priorityScore: Number,
  assignedNgoId: String,
  fulfilledAt: String,
}, baseOptions));
Request.schema.index({ requesterId: 1 });
Request.schema.index({ status: 1 });
Request.schema.index({ urgency: 1 });
Request.schema.index({ priorityScore: -1 });

export const Task = mongoose.model('Task', new Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  category: String,
  priority: String,
  pickupLocation: String,
  deliveryLocation: String,
  contactInfo: String,
  instructions: String,
  status: { type: String, default: 'available' },
  assignedVolunteerId: String,
  ngoId: String,
  statusHistory: { type: Array, default: [] },
}, baseOptions));

export const InventoryItem = mongoose.model('InventoryItem', new Schema({
  id: { type: String, required: true, unique: true },
  ownerType: String,
  ownerId: String,
  category: String,
  itemName: String,
  quantity: Number,
  unit: String,
  expiryDate: String,
  lowStockThreshold: Number,
}, baseOptions));

export const Notification = mongoose.model('Notification', new Schema({
  id: { type: String, required: true, unique: true },
  userId: String,
  category: { type: String, default: 'system' },
  title: String,
  message: String,
  read: { type: Boolean, default: false },
  relatedEntity: {},
}, baseOptions));
Notification.schema.index({ userId: 1 });
Notification.schema.index({ userId: 1, read: 1 });

export const Feedback = mongoose.model('Feedback', new Schema({
  id: { type: String, required: true, unique: true },
  userId: String,
  userName: String,
  role: String,
  subject: String,
  message: String,
  rating: Number,
  status: { type: String, default: 'pending' },
}, baseOptions));

export const Chat = mongoose.model('Chat', new Schema({
  id: { type: String, required: true, unique: true },
  participantIds: [String],
  relatedEntity: {},
  lastMessage: String,
  lastMessageAt: String,
  unreadCount: { type: Map, of: Number, default: {} },
}, baseOptions));
Chat.schema.index({ participantIds: 1 });

export const Message = mongoose.model('Message', new Schema({
  id: { type: String, required: true, unique: true },
  chatId: { type: String, required: true },
  senderId: String,
  text: String,
}, baseOptions));
Message.schema.index({ chatId: 1 });

export const AuditLog = mongoose.model('AuditLog', new Schema({
  id: { type: String, required: true, unique: true },
  actorId: String,
  actorName: String,
  action: String,
  target: String,
}, baseOptions));

export const Requirement = mongoose.model('Requirement', new Schema({
  id: { type: String, required: true, unique: true },
  hospitalId: String,
  type: String,
  title: String,
  itemName: String,
  quantity: Number,
  unit: String,
  status: { type: String, default: 'active' },
}, baseOptions));

// "Celebrate & Give" — optional celebration campaigns created by users to
// collect monetary donations from friends, family and the community.
export const CelebrationCampaign = mongoose.model('CelebrationCampaign', new Schema({
  id: { type: String, required: true, unique: true },
  ownerId: String,
  ownerName: String,
  eventType: String,
  eventTitle: String,
  eventDate: String,
  description: String,
  cause: String,
  causeLabel: String,
  ngoId: String,
  ngoName: String,
  goalAmount: Number,
  raisedAmount: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  slug: { type: String, required: true, unique: true },
  isPublic: { type: Boolean, default: true },
  // active | paused | completed | closed
  status: { type: String, default: 'active' },
  theme: String,
  coverImage: String,
  donationCount: { type: Number, default: 0 },
  impactUpdates: {
    type: Array,
    default: [],
  },
  previousCampaignId: String,
}, baseOptions));
CelebrationCampaign.schema.index({ ownerId: 1 });
CelebrationCampaign.schema.index({ status: 1 });

// NOTE: Monetary contributions no longer have a dedicated model. Since the
// unification, every donation (goods AND money) lives in `Donation` above.
// Money donations use donationType 'money' + the paymentStatus lifecycle;
// `CelebrationCampaign` remains the optional "celebrate & give" grouping.

// OTP records: persistent, MongoDB-backed, TTL-expired.
// One active OTP per (email, purpose). The plaintext code is NEVER stored;
// only a bcrypt hash is persisted. The TTL index auto-deletes expired docs.
const otpSchema = new Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  otpHash: { type: String, required: true },
  purpose: {
    type: String,
    required: true,
    enum: ['verify_email', 'login', 'reset_password', 'receipt_lookup'],
  },
  attempts: { type: Number, default: 0 },
  resendCooldownUntil: { type: Date },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });

otpSchema.index({ email: 1, purpose: 1 }, { unique: true });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = mongoose.model('Otp', otpSchema);

// Razorpay webhook event deduplication (Phase 2).
// Stores the provider's x-razorpay-event-id so duplicate deliveries are
// ignored atomically via the unique index — campaign totals, receipts and
// notifications can never double-fire.
const webhookEventSchema = new Schema({
  eventId: { type: String, required: true, unique: true },
  provider: { type: String, default: 'razorpay' },
  type: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });

webhookEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const WebhookEvent = mongoose.model('WebhookEvent', webhookEventSchema);
