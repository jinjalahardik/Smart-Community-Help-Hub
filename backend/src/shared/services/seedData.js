import { ROLES } from '../constants/roles.js';
import {
  DONATION_CATEGORIES,
  REQUEST_CATEGORIES,
  URGENCY_LEVELS,
  DONATION_STATUS,
  REQUEST_STATUS,
  TASK_STATUS,
  VERIFICATION_STATUS,
  USER_STATUS,
  NOTIFICATION_CATEGORIES,
} from '../constants/categories.js';

let idCounter = 1000;
export const nextId = (prefix = 'ID') => `${prefix}-${idCounter++}`;

const now = Date.now();
const daysAgo = (n) => new Date(now - n * 86400000).toISOString();
const daysFromNow = (n) => new Date(now + n * 86400000).toISOString();

export function buildSeedUsers() {
  return [
    {
      id: 'USR-ADMIN-1', name: 'Kavita Mehta', email: 'admin@helpconnect.demo', password: 'Admin@123',
      role: ROLES.ADMIN, phone: '9820011223', city: 'Surat', status: USER_STATUS.ACTIVE,
      createdAt: daysAgo(400), avatarColor: '#0F766E',
    },
    {
      id: 'USR-DONOR-1', name: 'Rohan Shah', email: 'donor@helpconnect.demo', password: 'Donor@123',
      role: ROLES.DONOR, phone: '9876543210', city: 'Surat', status: USER_STATUS.ACTIVE,
      createdAt: daysAgo(210), avatarColor: '#F59E0B',
    },
    {
      id: 'USR-NGO-1', name: 'Priya Desai', email: 'ngo@helpconnect.demo', password: 'Ngo@123',
      role: ROLES.NGO, phone: '9898989898', city: 'Ahmedabad', status: USER_STATUS.ACTIVE,
      createdAt: daysAgo(300), avatarColor: '#0F766E', orgId: 'NGO-1',
    },
    {
      id: 'USR-VOL-1', name: 'Aman Trivedi', email: 'volunteer@helpconnect.demo', password: 'Volunteer@123',
      role: ROLES.VOLUNTEER, phone: '9723456781', city: 'Surat', status: USER_STATUS.ACTIVE,
      createdAt: daysAgo(150), avatarColor: '#FB7185',
    },
    {
      id: 'USR-REQ-1', name: 'Meena Patel', email: 'requester@helpconnect.demo', password: 'Requester@123',
      role: ROLES.REQUESTER, phone: '9345678123', city: 'Vadodara', status: USER_STATUS.ACTIVE,
      createdAt: daysAgo(80), avatarColor: '#F59E0B',
    },
    {
      id: 'USR-HOSP-1', name: 'Dr. Sanjay Rao', email: 'hospital@helpconnect.demo', password: 'Hospital@123',
      role: ROLES.HOSPITAL, phone: '9911223344', city: 'Rajkot', status: USER_STATUS.ACTIVE,
      createdAt: daysAgo(320), avatarColor: '#0F766E', orgId: 'HOSP-1',
    },
    // extra realistic users for admin management screens
    { id: nextId('USR'), name: 'Nisha Kapadia', email: 'nisha.kapadia@example.com', role: ROLES.DONOR, phone: '9812345671', city: 'Mumbai', status: USER_STATUS.ACTIVE, createdAt: daysAgo(60), avatarColor: '#F59E0B' },
    { id: nextId('USR'), name: 'Devansh Joshi', email: 'devansh.joshi@example.com', role: ROLES.VOLUNTEER, phone: '9812345672', city: 'Pune', status: USER_STATUS.ACTIVE, createdAt: daysAgo(45), avatarColor: '#FB7185' },
    { id: nextId('USR'), name: 'Ritu Solanki', email: 'ritu.solanki@example.com', role: ROLES.REQUESTER, phone: '9812345673', city: 'Surat', status: USER_STATUS.PENDING, createdAt: daysAgo(10), avatarColor: '#F59E0B' },
    { id: nextId('USR'), name: 'Karan Vora', email: 'karan.vora@example.com', role: ROLES.DONOR, phone: '9812345674', city: 'Rajkot', status: USER_STATUS.SUSPENDED, createdAt: daysAgo(190), avatarColor: '#F59E0B' },
    { id: nextId('USR'), name: 'Foram Shukla', email: 'foram.shukla@example.com', role: ROLES.VOLUNTEER, phone: '9812345675', city: 'Ahmedabad', status: USER_STATUS.ACTIVE, createdAt: daysAgo(120), avatarColor: '#FB7185' },
  ];
}

export function buildSeedNgos() {
  return [
    {
      id: 'NGO-1', userId: 'USR-NGO-1', name: 'Asha Seva Foundation', registrationNumber: 'GJ/NGO/2014/00231',
      contactPerson: 'Priya Desai', email: 'ngo@helpconnect.demo', phone: '9898989898',
      address: '14 Ellisbridge, Ahmedabad, Gujarat', city: 'Ahmedabad',
      serviceCategories: [DONATION_CATEGORIES.FOOD, DONATION_CATEGORIES.CLOTHES, DONATION_CATEGORIES.MEDICINE],
      serviceRadiusKm: 25, verificationStatus: VERIFICATION_STATUS.APPROVED,
      documents: ['registration_certificate.pdf', 'identity_proof.pdf'],
      createdAt: daysAgo(300), statusHistory: [
        { status: VERIFICATION_STATUS.PENDING, at: daysAgo(300) },
        { status: VERIFICATION_STATUS.APPROVED, at: daysAgo(295), note: 'Documents verified successfully' },
      ],
    },
    {
      id: nextId('NGO'), userId: null, name: 'Karuna Relief Trust', registrationNumber: 'GJ/NGO/2018/00987',
      contactPerson: 'Vishal Nair', email: 'contact@karunarelief.demo', phone: '9877001122',
      address: 'Adajan, Surat, Gujarat', city: 'Surat',
      serviceCategories: [DONATION_CATEGORIES.FOOD, DONATION_CATEGORIES.BLOOD],
      serviceRadiusKm: 15, verificationStatus: VERIFICATION_STATUS.PENDING,
      documents: ['registration_certificate.pdf', 'identity_proof.pdf'],
      createdAt: daysAgo(4), statusHistory: [{ status: VERIFICATION_STATUS.PENDING, at: daysAgo(4) }],
    },
    {
      id: nextId('NGO'), userId: null, name: 'Manav Seva Sangh', registrationNumber: 'GJ/NGO/2011/00120',
      contactPerson: 'Alok Mishra', email: 'contact@manavseva.demo', phone: '9877001133',
      address: 'Kothrud, Pune, Maharashtra', city: 'Pune',
      serviceCategories: [DONATION_CATEGORIES.CLOTHES, DONATION_CATEGORIES.MEDICINE],
      serviceRadiusKm: 20, verificationStatus: VERIFICATION_STATUS.APPROVED,
      documents: ['registration_certificate.pdf'], createdAt: daysAgo(500),
      statusHistory: [{ status: VERIFICATION_STATUS.APPROVED, at: daysAgo(495) }],
    },
    {
      id: nextId('NGO'), userId: null, name: 'Jeevan Jyoti Foundation', registrationNumber: 'GJ/NGO/2020/00456',
      contactPerson: 'Sneha Iyer', email: 'contact@jeevanjyoti.demo', phone: '9877001144',
      address: 'Vastrapur, Ahmedabad, Gujarat', city: 'Ahmedabad',
      serviceCategories: [DONATION_CATEGORIES.FOOD], serviceRadiusKm: 10,
      verificationStatus: VERIFICATION_STATUS.REJECTED, rejectionReason: 'Registration certificate unreadable, please re-upload.',
      documents: ['registration_certificate.pdf'], createdAt: daysAgo(20),
      statusHistory: [
        { status: VERIFICATION_STATUS.PENDING, at: daysAgo(20) },
        { status: VERIFICATION_STATUS.REJECTED, at: daysAgo(18), note: 'Registration certificate unreadable' },
      ],
    },
  ];
}

export function buildSeedHospitals() {
  return [
    {
      id: 'HOSP-1', userId: 'USR-HOSP-1', name: 'Rajkot City Care Hospital', licenseNumber: 'GJ/HOSP/2009/00341',
      contactPerson: 'Dr. Sanjay Rao', email: 'hospital@helpconnect.demo', phone: '9911223344',
      address: 'Kalawad Road, Rajkot, Gujarat', city: 'Rajkot',
      bloodBankAvailable: true, medicineSupportAvailable: true,
      verificationStatus: VERIFICATION_STATUS.APPROVED, documents: ['license.pdf'],
      createdAt: daysAgo(320), statusHistory: [{ status: VERIFICATION_STATUS.APPROVED, at: daysAgo(315) }],
    },
    {
      id: nextId('HOSP'), userId: null, name: 'Sunrise Multispeciality Hospital', licenseNumber: 'GJ/HOSP/2015/00812',
      contactPerson: 'Dr. Neha Bhatt', email: 'contact@sunrisehosp.demo', phone: '9911223355',
      address: 'Vesu, Surat, Gujarat', city: 'Surat',
      bloodBankAvailable: true, medicineSupportAvailable: false,
      verificationStatus: VERIFICATION_STATUS.PENDING, documents: ['license.pdf'],
      createdAt: daysAgo(6), statusHistory: [{ status: VERIFICATION_STATUS.PENDING, at: daysAgo(6) }],
    },
    {
      id: nextId('HOSP'), userId: null, name: 'LifeLine Hospital & Trauma Center', licenseNumber: 'MH/HOSP/2012/00567',
      contactPerson: 'Dr. Farhan Sheikh', email: 'contact@lifelinehosp.demo', phone: '9911223366',
      address: 'Andheri East, Mumbai, Maharashtra', city: 'Mumbai',
      bloodBankAvailable: true, medicineSupportAvailable: true,
      verificationStatus: VERIFICATION_STATUS.APPROVED, documents: ['license.pdf'],
      createdAt: daysAgo(600), statusHistory: [{ status: VERIFICATION_STATUS.APPROVED, at: daysAgo(590) }],
    },
  ];
}

export function buildSeedDonations() {
  return [
    {
      id: nextId('DON'), donorId: 'USR-DONOR-1', donorName: 'Rohan Shah', category: DONATION_CATEGORIES.FOOD,
      title: 'Cooked meals for 40 people', description: 'Freshly prepared vegetarian thali meals from a wedding function, packed hygienically.',
      quantity: 40, unit: 'plates', pickupAddress: 'Piplod, Surat', city: 'Surat', pinCode: '395007',
      preferredPickupDate: daysFromNow(1), contactNumber: '9876543210', status: DONATION_STATUS.PENDING,
      availability: 'Evening 6 PM - 9 PM', notes: 'Please pick up before 9 PM to keep food fresh.',
      foodType: 'Cooked meal', vegNonVeg: 'Vegetarian', peopleServed: 40,
      preparedAt: daysAgo(0), expiryAt: daysFromNow(0.2), packaging: 'Sealed containers',
      createdAt: daysAgo(0), images: [],
    },
    {
      id: nextId('DON'), donorId: 'USR-DONOR-1', donorName: 'Rohan Shah', category: DONATION_CATEGORIES.CLOTHES,
      title: 'Winter clothes bundle', description: 'Gently used sweaters, jackets and blankets for adults and children.',
      quantity: 25, unit: 'pieces', pickupAddress: 'Piplod, Surat', city: 'Surat', pinCode: '395007',
      preferredPickupDate: daysFromNow(3), contactNumber: '9876543210', status: DONATION_STATUS.ACCEPTED,
      availability: 'Weekends', notes: '', clothingType: 'Winter wear', genderCategory: 'Unisex',
      ageGroup: 'Adult & Kids', size: 'Mixed', condition: 'Gently used', season: 'Winter',
      createdAt: daysAgo(5), acceptedBy: 'NGO-1', images: [],
    },
    {
      id: nextId('DON'), donorId: 'USR-DONOR-1', donorName: 'Rohan Shah', category: DONATION_CATEGORIES.MEDICINE,
      title: 'Unused paracetamol & antibiotics', description: 'Sealed, unexpired medicines from home first-aid stock clearance.',
      quantity: 60, unit: 'strips', pickupAddress: 'Piplod, Surat', city: 'Surat', pinCode: '395007',
      preferredPickupDate: daysFromNow(2), contactNumber: '9876543210', status: DONATION_STATUS.IN_TRANSIT,
      medicineName: 'Paracetamol 500mg / Amoxicillin 250mg', batchNumber: 'BN-22841', manufacturer: 'Cipla Ltd',
      expiryDate: daysFromNow(200), prescriptionRequired: false, sealedCondition: true,
      createdAt: daysAgo(8), assignedVolunteerId: 'USR-VOL-1', images: [],
    },
    {
      id: nextId('DON'), donorId: 'USR-DONOR-1', donorName: 'Rohan Shah', category: DONATION_CATEGORIES.BLOOD,
      title: 'O+ blood donation pledge', description: 'Willing to donate blood at nearest hospital blood bank.',
      quantity: 1, unit: 'unit', pickupAddress: 'Piplod, Surat', city: 'Surat', pinCode: '395007',
      preferredPickupDate: daysFromNow(4), contactNumber: '9876543210', status: DONATION_STATUS.COMPLETED,
      bloodGroup: 'O+', unitsAvailable: 1, donationDate: daysFromNow(4), lastDonationDate: daysAgo(120),
      medicalEligibility: true, preferredHospital: 'Rajkot City Care Hospital',
      createdAt: daysAgo(15), completedAt: daysAgo(1), images: [],
    },
    {
      id: nextId('DON'), donorId: 'USR-DONOR-1', donorName: 'Rohan Shah', category: DONATION_CATEGORIES.FOOD,
      title: 'Grocery ration kits', description: 'Rice, dal, oil and flour kits for 10 families.',
      quantity: 10, unit: 'kits', pickupAddress: 'Piplod, Surat', city: 'Surat', pinCode: '395007',
      preferredPickupDate: daysAgo(-10), contactNumber: '9876543210', status: DONATION_STATUS.COMPLETED,
      foodType: 'Dry ration', vegNonVeg: 'N/A', peopleServed: 40, packaging: 'Sealed kits',
      createdAt: daysAgo(40), completedAt: daysAgo(35), images: [],
    },
  ];
}

export function buildSeedRequests() {
  return [
    {
      id: nextId('REQ'), requesterId: 'USR-REQ-1', requesterName: 'Meena Patel', category: REQUEST_CATEGORIES.MEDICINE,
      urgency: URGENCY_LEVELS.CRITICAL, title: 'Insulin needed urgently for elderly patient',
      description: 'My father is diabetic and we ran out of insulin. Nearest pharmacy has no stock.',
      requiredQuantity: 5, unit: 'vials', address: 'Alkapuri, Vadodara', city: 'Vadodara', pinCode: '390007',
      contactNumber: '9345678123', affectedPeople: 1, vulnerablePersonInfo: 'Elderly, 72 years, diabetic',
      neededBefore: daysFromNow(1), consentGiven: true, status: REQUEST_STATUS.ASSIGNED,
      priorityScore: 92, createdAt: daysAgo(1), assignedNgoId: 'NGO-1',
    },
    {
      id: nextId('REQ'), requesterId: 'USR-REQ-1', requesterName: 'Meena Patel', category: REQUEST_CATEGORIES.FOOD,
      urgency: URGENCY_LEVELS.HIGH, title: 'Food support for flood-affected family',
      description: 'Our home was flooded and we lost our food stock. Need meals for 5 days.',
      requiredQuantity: 15, unit: 'meals', address: 'Alkapuri, Vadodara', city: 'Vadodara', pinCode: '390007',
      contactNumber: '9345678123', affectedPeople: 5, vulnerablePersonInfo: '2 children under 10',
      neededBefore: daysFromNow(2), consentGiven: true, status: REQUEST_STATUS.IN_PROGRESS,
      priorityScore: 78, createdAt: daysAgo(3), assignedNgoId: 'NGO-1',
    },
    {
      id: nextId('REQ'), requesterId: 'USR-REQ-1', requesterName: 'Meena Patel', category: REQUEST_CATEGORIES.SHELTER,
      urgency: URGENCY_LEVELS.MEDIUM, title: 'Temporary shelter for displaced family',
      description: 'Need temporary shelter for a week while house repairs are completed.',
      requiredQuantity: 1, unit: 'shelter', address: 'Alkapuri, Vadodara', city: 'Vadodara', pinCode: '390007',
      contactNumber: '9345678123', affectedPeople: 4, vulnerablePersonInfo: '',
      neededBefore: daysFromNow(5), consentGiven: true, status: REQUEST_STATUS.PENDING,
      priorityScore: 55, createdAt: daysAgo(0),
    },
    {
      id: nextId('REQ'), requesterId: 'USR-REQ-1', requesterName: 'Meena Patel', category: REQUEST_CATEGORIES.BLOOD,
      urgency: URGENCY_LEVELS.CRITICAL, title: 'O- blood units needed for surgery',
      description: 'Scheduled surgery tomorrow morning, need 2 units of O- blood.',
      requiredQuantity: 2, unit: 'units', address: 'Race Course, Vadodara', city: 'Vadodara', pinCode: '390015',
      contactNumber: '9345678123', affectedPeople: 1, vulnerablePersonInfo: 'Pre-surgery patient',
      neededBefore: daysFromNow(0.5), consentGiven: true, status: REQUEST_STATUS.FULFILLED,
      priorityScore: 96, createdAt: daysAgo(6), fulfilledAt: daysAgo(5),
    },
    {
      id: nextId('REQ'), requesterId: 'USR-REQ-1', requesterName: 'Meena Patel', category: REQUEST_CATEGORIES.CLOTHES,
      urgency: URGENCY_LEVELS.LOW, title: 'School uniforms for 3 children',
      description: 'Need school uniforms as the new academic term is starting.',
      requiredQuantity: 3, unit: 'sets', address: 'Alkapuri, Vadodara', city: 'Vadodara', pinCode: '390007',
      contactNumber: '9345678123', affectedPeople: 3, vulnerablePersonInfo: 'School-going children',
      neededBefore: daysFromNow(10), consentGiven: true, status: REQUEST_STATUS.CLOSED,
      priorityScore: 32, createdAt: daysAgo(20),
    },
  ];
}

export function buildSeedTasks() {
  return [
    {
      id: nextId('TSK'), title: 'Pickup cooked meals from Piplod', category: DONATION_CATEGORIES.FOOD,
      priority: URGENCY_LEVELS.HIGH, pickupLocation: 'Piplod, Surat', deliveryLocation: 'Asha Seva Foundation, Ahmedabad',
      contactInfo: '9876543210', instructions: 'Use insulated bags, food is time-sensitive.',
      status: TASK_STATUS.AVAILABLE, assignedVolunteerId: null, ngoId: 'NGO-1',
      createdAt: daysAgo(0), statusHistory: [{ status: TASK_STATUS.AVAILABLE, at: daysAgo(0) }],
    },
    {
      id: nextId('TSK'), title: 'Deliver medicine strips to requester', category: DONATION_CATEGORIES.MEDICINE,
      priority: URGENCY_LEVELS.CRITICAL, pickupLocation: 'Piplod, Surat', deliveryLocation: 'Alkapuri, Vadodara',
      contactInfo: '9345678123', instructions: 'Confirm cold-chain not required; verify prescription at drop-off.',
      status: TASK_STATUS.PICKED_UP, assignedVolunteerId: 'USR-VOL-1', ngoId: 'NGO-1',
      createdAt: daysAgo(1), statusHistory: [
        { status: TASK_STATUS.AVAILABLE, at: daysAgo(1) },
        { status: TASK_STATUS.ACCEPTED, at: daysAgo(1) },
        { status: TASK_STATUS.PICKUP_STARTED, at: daysAgo(0.5) },
        { status: TASK_STATUS.PICKED_UP, at: daysAgo(0.3) },
      ],
    },
    {
      id: nextId('TSK'), title: 'Winter clothes distribution run', category: DONATION_CATEGORIES.CLOTHES,
      priority: URGENCY_LEVELS.MEDIUM, pickupLocation: 'Piplod, Surat', deliveryLocation: 'Asha Seva Foundation, Ahmedabad',
      contactInfo: '9876543210', instructions: 'Load carefully, bundle is large.',
      status: TASK_STATUS.COMPLETED, assignedVolunteerId: 'USR-VOL-1', ngoId: 'NGO-1',
      createdAt: daysAgo(6), statusHistory: [
        { status: TASK_STATUS.AVAILABLE, at: daysAgo(6) },
        { status: TASK_STATUS.ACCEPTED, at: daysAgo(6) },
        { status: TASK_STATUS.COMPLETED, at: daysAgo(4) },
      ],
    },
    {
      id: nextId('TSK'), title: 'Emergency shelter setup assistance', category: 'shelter',
      priority: URGENCY_LEVELS.MEDIUM, pickupLocation: 'NGO Warehouse, Ahmedabad', deliveryLocation: 'Alkapuri, Vadodara',
      contactInfo: '9345678123', instructions: 'Coordinate with local volunteer team on arrival.',
      status: TASK_STATUS.ACCEPTED, assignedVolunteerId: 'USR-VOL-1', ngoId: 'NGO-1',
      createdAt: daysAgo(0.2), statusHistory: [
        { status: TASK_STATUS.AVAILABLE, at: daysAgo(0.2) },
        { status: TASK_STATUS.ACCEPTED, at: daysAgo(0.1) },
      ],
    },
  ];
}

export function buildSeedInventory() {
  return [
    { id: nextId('INV'), ownerType: 'ngo', ownerId: 'NGO-1', category: DONATION_CATEGORIES.FOOD, itemName: 'Rice (25kg bags)', quantity: 42, unit: 'bags', expiryDate: daysFromNow(90), lowStockThreshold: 10, updatedAt: daysAgo(1) },
    { id: nextId('INV'), ownerType: 'ngo', ownerId: 'NGO-1', category: DONATION_CATEGORIES.FOOD, itemName: 'Cooking Oil (1L)', quantity: 8, unit: 'bottles', expiryDate: daysFromNow(150), lowStockThreshold: 10, updatedAt: daysAgo(2) },
    { id: nextId('INV'), ownerType: 'ngo', ownerId: 'NGO-1', category: DONATION_CATEGORIES.CLOTHES, itemName: 'Winter Jackets', quantity: 30, unit: 'pieces', expiryDate: null, lowStockThreshold: 5, updatedAt: daysAgo(3) },
    { id: nextId('INV'), ownerType: 'ngo', ownerId: 'NGO-1', category: DONATION_CATEGORIES.MEDICINE, itemName: 'Paracetamol 500mg', quantity: 15, unit: 'strips', expiryDate: daysFromNow(5), lowStockThreshold: 20, updatedAt: daysAgo(0) },
    { id: nextId('INV'), ownerType: 'ngo', ownerId: 'NGO-1', category: DONATION_CATEGORIES.MEDICINE, itemName: 'ORS Packets', quantity: 60, unit: 'packets', expiryDate: daysFromNow(180), lowStockThreshold: 15, updatedAt: daysAgo(1) },
    { id: nextId('INV'), ownerType: 'hospital', ownerId: 'HOSP-1', category: 'blood', itemName: 'O+ Blood', quantity: 12, unit: 'units', expiryDate: daysFromNow(30), lowStockThreshold: 8, updatedAt: daysAgo(0) },
    { id: nextId('INV'), ownerType: 'hospital', ownerId: 'HOSP-1', category: 'blood', itemName: 'O- Blood', quantity: 3, unit: 'units', expiryDate: daysFromNow(30), lowStockThreshold: 8, updatedAt: daysAgo(0) },
    { id: nextId('INV'), ownerType: 'hospital', ownerId: 'HOSP-1', category: 'blood', itemName: 'AB+ Blood', quantity: 5, unit: 'units', expiryDate: daysFromNow(28), lowStockThreshold: 8, updatedAt: daysAgo(1) },
    { id: nextId('INV'), ownerType: 'hospital', ownerId: 'HOSP-1', category: 'medicine', itemName: 'IV Fluids (Normal Saline)', quantity: 40, unit: 'bottles', expiryDate: daysFromNow(200), lowStockThreshold: 20, updatedAt: daysAgo(2) },
  ];
}

export function buildSeedNotifications() {
  return [
    { id: nextId('NTF'), userId: 'USR-DONOR-1', category: NOTIFICATION_CATEGORIES.DONATION, title: 'Donation accepted', message: 'Asha Seva Foundation accepted your winter clothes donation.', read: false, createdAt: daysAgo(4), relatedEntity: { type: 'donation' } },
    { id: nextId('NTF'), userId: 'USR-DONOR-1', category: NOTIFICATION_CATEGORIES.SYSTEM, title: 'Welcome to Smart Community Help Hub', message: 'Thanks for joining as a donor. Start your first donation today.', read: true, createdAt: daysAgo(210) },
    { id: nextId('NTF'), userId: 'USR-VOL-1', category: NOTIFICATION_CATEGORIES.TASK, title: 'New task available nearby', message: 'A high priority medicine delivery task is available near you.', read: false, createdAt: daysAgo(1) },
    { id: nextId('NTF'), userId: 'USR-VOL-1', category: NOTIFICATION_CATEGORIES.TASK, title: 'Task marked completed', message: 'Your winter clothes distribution run was marked completed.', read: true, createdAt: daysAgo(4) },
    { id: nextId('NTF'), userId: 'USR-REQ-1', category: NOTIFICATION_CATEGORIES.REQUEST, title: 'Request assigned', message: 'Your insulin request has been assigned to Asha Seva Foundation.', read: false, createdAt: daysAgo(1) },
    { id: nextId('NTF'), userId: 'USR-NGO-1', category: NOTIFICATION_CATEGORIES.APPROVAL, title: 'Verification approved', message: 'Your NGO verification has been approved by the admin team.', read: true, createdAt: daysAgo(295) },
    { id: nextId('NTF'), userId: 'USR-HOSP-1', category: NOTIFICATION_CATEGORIES.SYSTEM, title: 'Low stock alert', message: 'O- blood stock is running low (3 units remaining).', read: false, createdAt: daysAgo(0) },
    { id: nextId('NTF'), userId: 'USR-ADMIN-1', category: NOTIFICATION_CATEGORIES.APPROVAL, title: 'New NGO pending approval', message: 'Karuna Relief Trust has submitted documents for verification.', read: false, createdAt: daysAgo(4) },
  ];
}

export function buildSeedFeedback() {
  return [
    { id: nextId('FBK'), userId: 'USR-DONOR-1', userName: 'Rohan Shah', role: ROLES.DONOR, subject: 'Great experience donating', message: 'The pickup volunteer was punctual and courteous. Very smooth process.', rating: 5, createdAt: daysAgo(3), status: 'reviewed' },
    { id: nextId('FBK'), userId: 'USR-VOL-1', userName: 'Aman Trivedi', role: ROLES.VOLUNTEER, subject: 'Task instructions could be clearer', message: 'Delivery address was slightly incorrect, please add landmark fields.', rating: 4, createdAt: daysAgo(2), status: 'pending' },
    { id: nextId('FBK'), userId: 'USR-REQ-1', userName: 'Meena Patel', role: ROLES.REQUESTER, subject: 'Fast response for emergency', message: 'Got insulin within hours of raising the request. Thank you team!', rating: 5, createdAt: daysAgo(1), status: 'pending' },
  ];
}

export function buildSeedChats() {
  const chatId = 'CHT-1001';
  return {
    chats: [
      { id: chatId, participantIds: ['USR-DONOR-1', 'USR-VOL-1'], relatedEntity: { type: 'donation' }, lastMessage: 'I will reach by 6:30 PM', lastMessageAt: daysAgo(0), unreadCount: { 'USR-DONOR-1': 1, 'USR-VOL-1': 0 } },
      { id: 'CHT-1002', participantIds: ['USR-REQ-1', 'USR-NGO-1'], relatedEntity: { type: 'request' }, lastMessage: 'Volunteer is on the way with insulin', lastMessageAt: daysAgo(0.2), unreadCount: { 'USR-REQ-1': 0, 'USR-NGO-1': 0 } },
    ],
    messages: {
      [chatId]: [
        { id: nextId('MSG'), chatId, senderId: 'USR-DONOR-1', text: 'Hi, is the pickup confirmed for today evening?', createdAt: daysAgo(0.4) },
        { id: nextId('MSG'), chatId, senderId: 'USR-VOL-1', text: 'Yes, confirmed. I will reach by 6:30 PM', createdAt: daysAgo(0) },
      ],
      'CHT-1002': [
        { id: nextId('MSG'), chatId: 'CHT-1002', senderId: 'USR-NGO-1', text: 'Volunteer is on the way with insulin', createdAt: daysAgo(0.2) },
      ],
    },
  };
}

export function buildSeedAuditLogs() {
  return [
    { id: nextId('LOG'), actorId: 'USR-ADMIN-1', actorName: 'Kavita Mehta', action: 'Approved NGO verification', target: 'Asha Seva Foundation', createdAt: daysAgo(295) },
    { id: nextId('LOG'), actorId: 'USR-ADMIN-1', actorName: 'Kavita Mehta', action: 'Suspended user account', target: 'Karan Vora', createdAt: daysAgo(190) },
    { id: nextId('LOG'), actorId: 'USR-ADMIN-1', actorName: 'Kavita Mehta', action: 'Rejected NGO verification', target: 'Jeevan Jyoti Foundation', createdAt: daysAgo(18) },
    { id: nextId('LOG'), actorId: 'USR-ADMIN-1', actorName: 'Kavita Mehta', action: 'Broadcast notification sent', target: 'All Volunteers', createdAt: daysAgo(10) },
  ];
}
