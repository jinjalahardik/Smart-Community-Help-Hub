import {
  LayoutDashboard, HeartHandshake, ListChecks, MapPin, TrendingUp, MessageSquareHeart,
  Boxes, Users, ClipboardList, Truck, BarChart3, Building2, ShieldCheck, Settings,
  PackagePlus, Siren, Radar, CheckCircle2, Award, CalendarClock, Droplet, Pill,
  FileWarning, HandCoins, FileClock, Megaphone, ScrollText, PartyPopper,
} from 'lucide-react';
import { ROLES } from '../constants/roles';
import { PATHS } from './paths';

export const NAV_CONFIG = {
  [ROLES.DONOR]: [
    { label: 'Dashboard', to: PATHS.DONOR.DASHBOARD, icon: LayoutDashboard },
    { label: 'My Donations', to: PATHS.DONOR.DONATIONS, icon: HeartHandshake },
    { label: 'Create Donation', to: PATHS.DONOR.CREATE, icon: PackagePlus },
    { label: 'Celebrate & Give', to: PATHS.CELEBRATE.GIVE, icon: PartyPopper },
    { label: 'My Campaigns', to: PATHS.CELEBRATE.MINE, icon: Award },
    { label: 'Nearby Requests', to: PATHS.DONOR.NEARBY, icon: MapPin },
    { label: 'Impact History', to: PATHS.DONOR.IMPACT, icon: TrendingUp },
    { label: 'Feedback', to: PATHS.DONOR.FEEDBACK, icon: MessageSquareHeart },
  ],
  [ROLES.NGO]: [
    { label: 'Dashboard', to: PATHS.NGO.DASHBOARD, icon: LayoutDashboard },
    { label: 'Incoming Donations', to: PATHS.NGO.DONATIONS, icon: HeartHandshake },
    { label: 'Emergency Requests', to: PATHS.NGO.REQUESTS, icon: Siren },
    { label: 'Inventory', to: PATHS.NGO.INVENTORY, icon: Boxes },
    { label: 'Volunteers', to: PATHS.NGO.VOLUNTEERS, icon: Users },
    { label: 'Task Assignment', to: PATHS.NGO.TASKS, icon: ClipboardList },
    { label: 'Distribution History', to: PATHS.NGO.DISTRIBUTIONS, icon: Truck },
    { label: 'Reports', to: PATHS.NGO.REPORTS, icon: BarChart3 },
    { label: 'Organization Profile', to: PATHS.NGO.PROFILE, icon: Building2 },
    { label: 'Verification Status', to: PATHS.NGO.VERIFICATION, icon: ShieldCheck },
    { label: 'Settings', to: PATHS.NGO.SETTINGS, icon: Settings },
  ],
  [ROLES.VOLUNTEER]: [
    { label: 'Dashboard', to: PATHS.VOLUNTEER.DASHBOARD, icon: LayoutDashboard },
    { label: 'Nearby Tasks', to: PATHS.VOLUNTEER.TASKS, icon: Radar },
    { label: 'My Active Tasks', to: PATHS.VOLUNTEER.ACTIVE, icon: ListChecks },
    { label: 'Completed Tasks', to: PATHS.VOLUNTEER.COMPLETED, icon: CheckCircle2 },
    { label: 'Availability', to: PATHS.VOLUNTEER.AVAILABILITY, icon: CalendarClock },
    { label: 'Impact & Badges', to: PATHS.VOLUNTEER.IMPACT, icon: Award },
    { label: 'Feedback', to: PATHS.VOLUNTEER.FEEDBACK, icon: MessageSquareHeart },
  ],
  [ROLES.REQUESTER]: [
    { label: 'Dashboard', to: PATHS.REQUESTER.DASHBOARD, icon: LayoutDashboard },
    { label: 'Raise Emergency Request', to: PATHS.REQUESTER.CREATE, icon: Siren },
    { label: 'My Requests', to: PATHS.REQUESTER.REQUESTS, icon: ClipboardList },
    { label: 'Feedback', to: PATHS.REQUESTER.FEEDBACK, icon: MessageSquareHeart },
  ],
  [ROLES.HOSPITAL]: [
    { label: 'Dashboard', to: PATHS.HOSPITAL.DASHBOARD, icon: LayoutDashboard },
    { label: 'Blood Inventory', to: PATHS.HOSPITAL.BLOOD_INVENTORY, icon: Droplet },
    { label: 'Medicine Inventory', to: PATHS.HOSPITAL.MEDICINE_INVENTORY, icon: Pill },
    { label: 'Active Requirements', to: PATHS.HOSPITAL.REQUIREMENTS, icon: FileWarning },
    { label: 'Received Donations', to: PATHS.HOSPITAL.DONATIONS, icon: HandCoins },
    { label: 'Reports', to: PATHS.HOSPITAL.REPORTS, icon: BarChart3 },
    { label: 'Hospital Profile', to: PATHS.HOSPITAL.PROFILE, icon: Building2 },
    { label: 'Verification Status', to: PATHS.HOSPITAL.VERIFICATION, icon: ShieldCheck },
    { label: 'Settings', to: PATHS.HOSPITAL.SETTINGS, icon: Settings },
  ],
  [ROLES.ADMIN]: [
    { label: 'Dashboard', to: PATHS.ADMIN.DASHBOARD, icon: LayoutDashboard },
    { label: 'User Management', to: PATHS.ADMIN.USERS, icon: Users },
    { label: 'NGO Approvals', to: PATHS.ADMIN.NGOS, icon: ShieldCheck },
    { label: 'Hospital Approvals', to: PATHS.ADMIN.HOSPITALS, icon: Building2 },
    { label: 'Donation Management', to: PATHS.ADMIN.DONATIONS, icon: HeartHandshake },
    { label: 'Emergency Requests', to: PATHS.ADMIN.REQUESTS, icon: Siren },
    { label: 'Volunteer Management', to: PATHS.ADMIN.VOLUNTEERS, icon: Users },
    { label: 'Inventory Overview', to: PATHS.ADMIN.INVENTORY, icon: Boxes },
    { label: 'Reports & Analytics', to: PATHS.ADMIN.REPORTS, icon: BarChart3 },
    { label: 'Audit Logs', to: PATHS.ADMIN.AUDIT_LOGS, icon: FileClock },
    { label: 'Feedback Management', to: PATHS.ADMIN.FEEDBACK, icon: MessageSquareHeart },
    { label: 'Notification Broadcast', to: PATHS.ADMIN.NOTIFICATIONS, icon: Megaphone },
    { label: 'Platform Settings', to: PATHS.ADMIN.SETTINGS, icon: Settings },
  ],
};

export const MOBILE_NAV_LIMIT = 5;
export { ScrollText };
