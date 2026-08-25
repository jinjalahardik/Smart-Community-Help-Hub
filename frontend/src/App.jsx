import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PageSpinner } from './components/ui/Skeleton';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AuthGuard from './routes/AuthGuard';
import RoleGuard from './routes/RoleGuard';
import GuestGuard from './routes/GuestGuard';
import { ROLES } from './constants/roles';
import { PATHS } from './routes/paths';

const ChatWidget = lazy(() => import('./components/chatbot/ChatWidget'));

// Public pages
const Landing = lazy(() => import('./pages/public/Landing'));
const About = lazy(() => import('./pages/public/About'));
const HowItWorks = lazy(() => import('./pages/public/HowItWorks'));
const Categories = lazy(() => import('./pages/public/Categories'));
const EmergencyInfo = lazy(() => import('./pages/public/EmergencyInfo'));
const NgoDirectory = lazy(() => import('./pages/public/NgoDirectory'));
const VolunteerInfo = lazy(() => import('./pages/public/VolunteerInfo'));
const Contact = lazy(() => import('./pages/public/Contact'));
const FAQ = lazy(() => import('./pages/public/FAQ'));
const Privacy = lazy(() => import('./pages/public/Privacy'));
const Terms = lazy(() => import('./pages/public/Terms'));

// Auth pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const VerifyOtp = lazy(() => import('./pages/auth/VerifyOtp'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const EmailVerified = lazy(() => import('./pages/auth/EmailVerified'));
const PendingNgoVerification = lazy(() => import('./pages/auth/PendingVerification').then((m) => ({ default: m.PendingNgoVerification })));
const PendingHospitalVerification = lazy(() => import('./pages/auth/PendingVerification').then((m) => ({ default: m.PendingHospitalVerification })));
const AccessDenied = lazy(() => import('./pages/auth/AccessDenied'));

// Common pages
const DashboardRedirect = lazy(() => import('./pages/common/DashboardRedirect'));
const Profile = lazy(() => import('./pages/common/Profile'));
const Settings = lazy(() => import('./pages/common/Settings'));
const Notifications = lazy(() => import('./pages/common/Notifications'));
const Chat = lazy(() => import('./pages/common/Chat'));
const NotFound = lazy(() => import('./pages/common/NotFound'));

// Donor pages
const DonorDashboard = lazy(() => import('./pages/donor/DonorDashboard'));
const CreateDonation = lazy(() => import('./pages/donor/CreateDonation'));
const MyDonations = lazy(() => import('./pages/donor/MyDonations'));
const DonationDetails = lazy(() => import('./pages/donor/DonationDetails'));
const EditDonation = lazy(() => import('./pages/donor/EditDonation'));
const NearbyRequests = lazy(() => import('./pages/donor/NearbyRequests'));
const DonorImpact = lazy(() => import('./pages/donor/DonorImpact'));
const DonorFeedback = lazy(() => import('./pages/donor/DonorFeedback'));

// Volunteer pages
const VolunteerDashboard = lazy(() => import('./pages/volunteer/VolunteerDashboard'));
const NearbyTasks = lazy(() => import('./pages/volunteer/NearbyTasks'));
const TaskDetails = lazy(() => import('./pages/volunteer/TaskDetails'));
const ActiveTasks = lazy(() => import('./pages/volunteer/ActiveTasks'));
const CompletedTasks = lazy(() => import('./pages/volunteer/CompletedTasks'));
const Availability = lazy(() => import('./pages/volunteer/Availability'));
const VolunteerImpact = lazy(() => import('./pages/volunteer/VolunteerImpact'));
const VolunteerFeedback = lazy(() => import('./pages/volunteer/VolunteerFeedback'));

// Requester pages
const RequesterDashboard = lazy(() => import('./pages/requester/RequesterDashboard'));
const CreateRequest = lazy(() => import('./pages/requester/CreateRequest'));
const MyRequests = lazy(() => import('./pages/requester/MyRequests'));
const RequestDetails = lazy(() => import('./pages/requester/RequestDetails'));
const EditRequest = lazy(() => import('./pages/requester/EditRequest'));
const RequestTracking = lazy(() => import('./pages/requester/RequestTracking'));
const RequesterFeedback = lazy(() => import('./pages/requester/RequesterFeedback'));

// NGO pages
const NgoDashboard = lazy(() => import('./pages/ngo/NgoDashboard'));
const IncomingDonations = lazy(() => import('./pages/ngo/IncomingDonations'));
const NgoDonationDetails = lazy(() => import('./pages/ngo/NgoDonationDetails'));
const NgoRequests = lazy(() => import('./pages/ngo/NgoRequests'));
const NgoInventory = lazy(() => import('./pages/ngo/NgoInventory'));
const AddInventory = lazy(() => import('./pages/ngo/AddInventory'));
const EditInventory = lazy(() => import('./pages/ngo/EditInventory'));
const NgoVolunteers = lazy(() => import('./pages/ngo/NgoVolunteers'));
const NgoTasks = lazy(() => import('./pages/ngo/NgoTasks'));
const NgoDistributions = lazy(() => import('./pages/ngo/NgoDistributions'));
const NgoReports = lazy(() => import('./pages/ngo/NgoReports'));
const NgoProfile = lazy(() => import('./pages/ngo/NgoProfile'));
const NgoVerification = lazy(() => import('./pages/ngo/NgoVerification'));
const NgoSettings = lazy(() => import('./pages/ngo/NgoSettings'));

// Hospital pages
const HospitalDashboard = lazy(() => import('./pages/hospital/HospitalDashboard'));
const BloodInventory = lazy(() => import('./pages/hospital/BloodInventory'));
const MedicineInventory = lazy(() => import('./pages/hospital/MedicineInventory'));
const CreateRequirement = lazy(() => import('./pages/hospital/CreateRequirement'));
const ActiveRequirements = lazy(() => import('./pages/hospital/ActiveRequirements'));
const RequirementDetails = lazy(() => import('./pages/hospital/RequirementDetails'));
const ReceivedDonations = lazy(() => import('./pages/hospital/ReceivedDonations'));
const HospitalReports = lazy(() => import('./pages/hospital/HospitalReports'));
const HospitalProfile = lazy(() => import('./pages/hospital/HospitalProfile'));
const HospitalVerification = lazy(() => import('./pages/hospital/HospitalVerification'));
const HospitalSettings = lazy(() => import('./pages/hospital/HospitalSettings'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminNgos = lazy(() => import('./pages/admin/AdminNgos'));
const AdminHospitals = lazy(() => import('./pages/admin/AdminHospitals'));
const AdminDonations = lazy(() => import('./pages/admin/AdminDonations'));
const AdminRequests = lazy(() => import('./pages/admin/AdminRequests'));
const AdminVolunteers = lazy(() => import('./pages/admin/AdminVolunteers'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminAuditLogs = lazy(() => import('./pages/admin/AdminAuditLogs'));
const AdminFeedback = lazy(() => import('./pages/admin/AdminFeedback'));
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

function SuspenseWrap({ children }) {
  return <Suspense fallback={<PageSpinner />}>{children}</Suspense>;
}

export default function App() {
  return (
    <>
      <SuspenseWrap>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
          <Route path={PATHS.HOME} element={<Landing />} />
          <Route path={PATHS.ABOUT} element={<About />} />
          <Route path={PATHS.HOW_IT_WORKS} element={<HowItWorks />} />
          <Route path={PATHS.CATEGORIES} element={<Categories />} />
          <Route path={PATHS.EMERGENCY_INFO} element={<EmergencyInfo />} />
          <Route path={PATHS.NGOS} element={<NgoDirectory />} />
          <Route path={PATHS.VOLUNTEER_INFO} element={<VolunteerInfo />} />
          <Route path={PATHS.CONTACT} element={<Contact />} />
          <Route path={PATHS.FAQ} element={<FAQ />} />
          <Route path={PATHS.PRIVACY} element={<Privacy />} />
          <Route path={PATHS.TERMS} element={<Terms />} />
        </Route>

        {/* Guest-only auth pages */}
        <Route element={<GuestGuard />}>
          <Route element={<AuthLayout />}>
            <Route path={PATHS.LOGIN} element={<Login />} />
            <Route path={PATHS.REGISTER} element={<Register />} />
            <Route path={PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path={PATHS.VERIFY_EMAIL} element={<VerifyOtp />} />
            <Route path={PATHS.RESET_PASSWORD} element={<ResetPassword />} />
            <Route path={PATHS.EMAIL_VERIFIED} element={<EmailVerified />} />
            <Route path={PATHS.PENDING_NGO} element={<PendingNgoVerification />} />
            <Route path={PATHS.PENDING_HOSPITAL} element={<PendingHospitalVerification />} />
          </Route>
        </Route>

        <Route path={PATHS.ACCESS_DENIED} element={<AccessDenied />} />

        {/* Protected common + role dashboards */}
        <Route element={<AuthGuard />}>
          <Route element={<DashboardLayout />}>
            <Route path={PATHS.DASHBOARD} element={<DashboardRedirect />} />
            <Route path={PATHS.PROFILE} element={<Profile />} />
            <Route path={PATHS.SETTINGS} element={<Settings />} />
            <Route path={PATHS.NOTIFICATIONS} element={<Notifications />} />
            <Route path={PATHS.CHAT} element={<Chat />} />

            {/* Donor */}
            <Route element={<RoleGuard allowedRoles={[ROLES.DONOR]} />}>
              <Route path={PATHS.DONOR.DASHBOARD} element={<DonorDashboard />} />
              <Route path={PATHS.DONOR.CREATE} element={<CreateDonation />} />
              <Route path={PATHS.DONOR.DONATIONS} element={<MyDonations />} />
              <Route path={PATHS.DONOR.DETAILS()} element={<DonationDetails />} />
              <Route path={PATHS.DONOR.EDIT()} element={<EditDonation />} />
              <Route path={PATHS.DONOR.NEARBY} element={<NearbyRequests />} />
              <Route path={PATHS.DONOR.IMPACT} element={<DonorImpact />} />
              <Route path={PATHS.DONOR.FEEDBACK} element={<DonorFeedback />} />
            </Route>

            {/* Volunteer */}
            <Route element={<RoleGuard allowedRoles={[ROLES.VOLUNTEER]} />}>
              <Route path={PATHS.VOLUNTEER.DASHBOARD} element={<VolunteerDashboard />} />
              <Route path={PATHS.VOLUNTEER.TASKS} element={<NearbyTasks />} />
              <Route path={PATHS.VOLUNTEER.TASK_DETAILS()} element={<TaskDetails />} />
              <Route path={PATHS.VOLUNTEER.ACTIVE} element={<ActiveTasks />} />
              <Route path={PATHS.VOLUNTEER.COMPLETED} element={<CompletedTasks />} />
              <Route path={PATHS.VOLUNTEER.AVAILABILITY} element={<Availability />} />
              <Route path={PATHS.VOLUNTEER.IMPACT} element={<VolunteerImpact />} />
              <Route path={PATHS.VOLUNTEER.FEEDBACK} element={<VolunteerFeedback />} />
            </Route>

            {/* Requester */}
            <Route element={<RoleGuard allowedRoles={[ROLES.REQUESTER]} />}>
              <Route path={PATHS.REQUESTER.DASHBOARD} element={<RequesterDashboard />} />
              <Route path={PATHS.REQUESTER.CREATE} element={<CreateRequest />} />
              <Route path={PATHS.REQUESTER.REQUESTS} element={<MyRequests />} />
              <Route path={PATHS.REQUESTER.DETAILS()} element={<RequestDetails />} />
              <Route path={PATHS.REQUESTER.EDIT()} element={<EditRequest />} />
              <Route path={PATHS.REQUESTER.TRACKING()} element={<RequestTracking />} />
              <Route path={PATHS.REQUESTER.FEEDBACK} element={<RequesterFeedback />} />
            </Route>

            {/* NGO */}
            <Route element={<RoleGuard allowedRoles={[ROLES.NGO]} />}>
              <Route path={PATHS.NGO.DASHBOARD} element={<NgoDashboard />} />
              <Route path={PATHS.NGO.DONATIONS} element={<IncomingDonations />} />
              <Route path={PATHS.NGO.DONATION_DETAILS()} element={<NgoDonationDetails />} />
              <Route path={PATHS.NGO.REQUESTS} element={<NgoRequests />} />
              <Route path={PATHS.NGO.INVENTORY} element={<NgoInventory />} />
              <Route path={PATHS.NGO.INVENTORY_CREATE} element={<AddInventory />} />
              <Route path={PATHS.NGO.INVENTORY_EDIT()} element={<EditInventory />} />
              <Route path={PATHS.NGO.VOLUNTEERS} element={<NgoVolunteers />} />
              <Route path={PATHS.NGO.TASKS} element={<NgoTasks />} />
              <Route path={PATHS.NGO.DISTRIBUTIONS} element={<NgoDistributions />} />
              <Route path={PATHS.NGO.REPORTS} element={<NgoReports />} />
              <Route path={PATHS.NGO.PROFILE} element={<NgoProfile />} />
              <Route path={PATHS.NGO.VERIFICATION} element={<NgoVerification />} />
              <Route path={PATHS.NGO.SETTINGS} element={<NgoSettings />} />
            </Route>

            {/* Hospital */}
            <Route element={<RoleGuard allowedRoles={[ROLES.HOSPITAL]} />}>
              <Route path={PATHS.HOSPITAL.DASHBOARD} element={<HospitalDashboard />} />
              <Route path={PATHS.HOSPITAL.BLOOD_INVENTORY} element={<BloodInventory />} />
              <Route path={PATHS.HOSPITAL.MEDICINE_INVENTORY} element={<MedicineInventory />} />
              <Route path={PATHS.HOSPITAL.REQUIREMENT_CREATE} element={<CreateRequirement />} />
              <Route path={PATHS.HOSPITAL.REQUIREMENTS} element={<ActiveRequirements />} />
              <Route path={PATHS.HOSPITAL.REQUIREMENT_DETAILS()} element={<RequirementDetails />} />
              <Route path={PATHS.HOSPITAL.DONATIONS} element={<ReceivedDonations />} />
              <Route path={PATHS.HOSPITAL.REPORTS} element={<HospitalReports />} />
              <Route path={PATHS.HOSPITAL.PROFILE} element={<HospitalProfile />} />
              <Route path={PATHS.HOSPITAL.VERIFICATION} element={<HospitalVerification />} />
              <Route path={PATHS.HOSPITAL.SETTINGS} element={<HospitalSettings />} />
            </Route>

            {/* Admin */}
            <Route element={<RoleGuard allowedRoles={[ROLES.ADMIN]} />}>
              <Route path={PATHS.ADMIN.DASHBOARD} element={<AdminDashboard />} />
              <Route path={PATHS.ADMIN.USERS} element={<AdminUsers />} />
              <Route path={PATHS.ADMIN.NGOS} element={<AdminNgos />} />
              <Route path={PATHS.ADMIN.HOSPITALS} element={<AdminHospitals />} />
              <Route path={PATHS.ADMIN.DONATIONS} element={<AdminDonations />} />
              <Route path={PATHS.ADMIN.REQUESTS} element={<AdminRequests />} />
              <Route path={PATHS.ADMIN.VOLUNTEERS} element={<AdminVolunteers />} />
              <Route path={PATHS.ADMIN.INVENTORY} element={<AdminInventory />} />
              <Route path={PATHS.ADMIN.REPORTS} element={<AdminReports />} />
              <Route path={PATHS.ADMIN.AUDIT_LOGS} element={<AdminAuditLogs />} />
              <Route path={PATHS.ADMIN.FEEDBACK} element={<AdminFeedback />} />
              <Route path={PATHS.ADMIN.NOTIFICATIONS} element={<AdminNotifications />} />
              <Route path={PATHS.ADMIN.SETTINGS} element={<AdminSettings />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </SuspenseWrap>
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </>
  );
}
