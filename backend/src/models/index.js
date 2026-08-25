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

export const Donation = mongoose.model('Donation', new Schema({
  id: { type: String, required: true, unique: true },
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
}, baseOptions));
Donation.schema.index({ donorId: 1 });
Donation.schema.index({ status: 1 });
Donation.schema.index({ category: 1 });
Donation.schema.index({ city: 1 });

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
