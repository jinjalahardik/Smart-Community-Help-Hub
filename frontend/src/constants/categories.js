export const DONATION_CATEGORIES = {
  FOOD: 'food',
  CLOTHES: 'clothes',
  MEDICINE: 'medicine',
  BLOOD: 'blood',
};

export const DONATION_CATEGORY_LABELS = {
  [DONATION_CATEGORIES.FOOD]: 'Food',
  [DONATION_CATEGORIES.CLOTHES]: 'Clothes',
  [DONATION_CATEGORIES.MEDICINE]: 'Medicine',
  [DONATION_CATEGORIES.BLOOD]: 'Blood',
};

export const REQUEST_CATEGORIES = {
  FOOD: 'food',
  CLOTHES: 'clothes',
  MEDICINE: 'medicine',
  BLOOD: 'blood',
  SHELTER: 'shelter',
  OTHER: 'other',
};

export const REQUEST_CATEGORY_LABELS = {
  [REQUEST_CATEGORIES.FOOD]: 'Food',
  [REQUEST_CATEGORIES.CLOTHES]: 'Clothes',
  [REQUEST_CATEGORIES.MEDICINE]: 'Medicine',
  [REQUEST_CATEGORIES.BLOOD]: 'Blood',
  [REQUEST_CATEGORIES.SHELTER]: 'Shelter',
  [REQUEST_CATEGORIES.OTHER]: 'Other',
};

export const URGENCY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const URGENCY_WEIGHT = {
  [URGENCY_LEVELS.LOW]: 1,
  [URGENCY_LEVELS.MEDIUM]: 2,
  [URGENCY_LEVELS.HIGH]: 3,
  [URGENCY_LEVELS.CRITICAL]: 4,
};

export const DONATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  ASSIGNED: 'assigned',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  REVIEWING: 'reviewing',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  FULFILLED: 'fulfilled',
  CLOSED: 'closed',
  REJECTED: 'rejected',
};

export const TASK_STATUS = {
  AVAILABLE: 'available',
  ACCEPTED: 'accepted',
  PICKUP_STARTED: 'pickup_started',
  PICKED_UP: 'picked_up',
  DELIVERY_STARTED: 'delivery_started',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
};

export const TASK_STATUS_ORDER = [
  TASK_STATUS.AVAILABLE,
  TASK_STATUS.ACCEPTED,
  TASK_STATUS.PICKUP_STARTED,
  TASK_STATUS.PICKED_UP,
  TASK_STATUS.DELIVERY_STARTED,
  TASK_STATUS.DELIVERED,
  TASK_STATUS.COMPLETED,
];

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.AVAILABLE]: 'Available',
  [TASK_STATUS.ACCEPTED]: 'Accepted',
  [TASK_STATUS.PICKUP_STARTED]: 'Pickup Started',
  [TASK_STATUS.PICKED_UP]: 'Picked Up',
  [TASK_STATUS.DELIVERY_STARTED]: 'Delivery Started',
  [TASK_STATUS.DELIVERED]: 'Delivered',
  [TASK_STATUS.COMPLETED]: 'Completed',
};

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const USER_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
};

export const NOTIFICATION_CATEGORIES = {
  DONATION: 'donation',
  REQUEST: 'request',
  TASK: 'task',
  SYSTEM: 'system',
  CHAT: 'chat',
  APPROVAL: 'approval',
};

export const INDIAN_CITIES = ['Surat', 'Ahmedabad', 'Vadodara', 'Rajkot', 'Mumbai', 'Pune'];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
