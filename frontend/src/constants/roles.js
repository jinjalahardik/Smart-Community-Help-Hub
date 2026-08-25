export const ROLES = {
  ADMIN: 'admin',
  DONOR: 'donor',
  NGO: 'ngo',
  VOLUNTEER: 'volunteer',
  REQUESTER: 'requester',
  HOSPITAL: 'hospital',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.DONOR]: 'Donor',
  [ROLES.NGO]: 'NGO',
  [ROLES.VOLUNTEER]: 'Volunteer',
  [ROLES.REQUESTER]: 'Requester',
  [ROLES.HOSPITAL]: 'Hospital',
};

export const ROLE_DASHBOARD_PATH = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.DONOR]: '/donor/dashboard',
  [ROLES.NGO]: '/ngo/dashboard',
  [ROLES.VOLUNTEER]: '/volunteer/dashboard',
  [ROLES.REQUESTER]: '/requester/dashboard',
  [ROLES.HOSPITAL]: '/hospital/dashboard',
};

export const BASIC_ROLES = [ROLES.DONOR, ROLES.VOLUNTEER, ROLES.REQUESTER];
export const ORG_ROLES = [ROLES.NGO, ROLES.HOSPITAL];

export const ALL_ROLES = Object.values(ROLES);
