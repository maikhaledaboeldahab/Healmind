import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// User Layouts & Route Guards
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import UserProtectedRoute from './ProtectedRoute';

// Admin Layouts & Route Guards
import AdminLayout from '../admin/layouts/AdminLayout/AdminLayout.jsx';
import AdminProtectedRoute from '../admin/routes/ProtectedRoute.jsx';
import LoadingSpinner from '../admin/components/LoadingSpinner/LoadingSpinner.jsx';
import { ROUTE_PATHS } from '../admin/constants/routePaths.js';

// Doctor Layouts, Route Guards & Pages
import DoctorProtectedRoute from '../doctor/routes/ProtectedRoute.jsx';
import DoctorDashboard from '../doctor/pages/DoctorDashboard.jsx';
import DoctorMasterLayout from '../doctor/components/Layout/MasterLayout.jsx';
import DoctorHomeLanding from '../doctor/components/Home/Home.jsx';
import DoctorLogin from '../doctor/components/Layout/Login/Login.jsx';
import DoctorRegister from '../doctor/components/Layout/Register/Register.jsx';

// Shared Pages
import SharedLogin from '../shared/pages/Login/Login.jsx';

// User Pages
import Register from '../pages/Register/Register';
import UserDashboard from '../pages/Dashboard/Dashboard';
import UserDoctors from '../pages/Doctors/Doctors';
import UserDoctorDetails from '../pages/DoctorDetails/DoctorDetails';
import CreateTicket from '../pages/CreateTicket/CreateTicket';
import BookAppointment from '../pages/BookAppointment/BookAppointment';
import Payment from '../pages/Payment/Payment';
import UpcomingSessions from '../pages/UpcomingSessions/UpcomingSessions';
import VideoSession from '../pages/VideoSession/VideoSession';
import LiveChat from '../pages/LiveChat/LiveChat';
import Messages from '../pages/Messages/Messages';
import SessionReport from '../pages/SessionReport/SessionReport';
import RateDoctor from '../pages/RateDoctor/RateDoctor';
import UserCommunity from '../pages/Community/Community';
import AIAssistant from '../pages/AIAssistant/AIAssistant';
import ContactUs from '../pages/ContactUs/ContactUs';
import UserNotifications from '../pages/Notifications/Notifications';
import TicketHistory from '../pages/TicketHistory/TicketHistory';
import SessionHistory from '../pages/SessionHistory/SessionHistory';
import PaymentHistory from '../pages/PaymentHistory/PaymentHistory';
import UserProfile from '../pages/Profile/Profile';
import NotFound from '../pages/NotFound/NotFound';

// Admin Pages (Lazy loaded as in original Admin AppRoutes)
const AdminDashboard = lazy(() => import('../admin/pages/Dashboard/Dashboard.jsx'));
const DoctorVerification = lazy(() => import('../admin/pages/DoctorVerification/DoctorVerification.jsx'));
const AdminDoctors = lazy(() => import('../admin/pages/Doctors/Doctors.jsx'));
const AdminDoctorDetails = lazy(() => import('../admin/pages/DoctorDetails/DoctorDetails.jsx'));
const DoctorForm = lazy(() => import('../admin/pages/DoctorForm/DoctorForm.jsx'));
const Patients = lazy(() => import('../admin/pages/Patients/Patients.jsx'));
const PatientDetails = lazy(() => import('../admin/pages/PatientDetails/PatientDetails.jsx'));
const PatientForm = lazy(() => import('../admin/pages/PatientForm/PatientForm.jsx'));
const Tickets = lazy(() => import('../admin/pages/Tickets/Tickets.jsx'));
const TicketDetails = lazy(() => import('../admin/pages/TicketDetails/TicketDetails.jsx'));
const Sessions = lazy(() => import('../admin/pages/Sessions/Sessions.jsx'));
const SessionsCalendar = lazy(() => import('../admin/pages/SessionsCalendar/SessionsCalendar.jsx'));
const SessionDetails = lazy(() => import('../admin/pages/SessionDetails/SessionDetails.jsx'));
const Payments = lazy(() => import('../admin/pages/Payments/Payments.jsx'));
const PaymentDetails = lazy(() => import('../admin/pages/PaymentDetails/PaymentDetails.jsx'));
const CommunityPosts = lazy(() => import('../admin/pages/Community/CommunityPosts.jsx'));
const CommunityComments = lazy(() => import('../admin/pages/Community/CommunityComments.jsx'));
const AdminContacts = lazy(() => import('../admin/pages/Contacts/Contacts.jsx'));
const AdminNotifications = lazy(() => import('../admin/pages/Notifications/Notifications.jsx'));
const Reports = lazy(() => import('../admin/pages/Reports/Reports.jsx'));
const Settings = lazy(() => import('../admin/pages/Settings/Settings.jsx'));
const AdminProfile = lazy(() => import('../admin/pages/Profile/Profile.jsx'));

function SuspenseFallback() {
  return <LoadingSpinner fullHeight label="Loading page..." />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        {/* Public / Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<SharedLogin />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* User Protected Routes */}
        <Route element={<UserProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/doctors" element={<UserDoctors />} />
            <Route path="/doctors/:doctorId" element={<UserDoctorDetails />} />
            <Route path="/doctors/:doctorId/book" element={<BookAppointment />} />
            <Route path="/payment/:bookingId" element={<Payment />} />
            <Route path="/sessions/upcoming" element={<UpcomingSessions />} />
            <Route path="/sessions/history" element={<SessionHistory />} />
            <Route path="/sessions/:sessionId" element={<SessionReport />} />
            <Route path="/sessions/:sessionId/rate" element={<RateDoctor />} />
            <Route path="/sessions/:sessionId/video" element={<VideoSession />} />
            <Route path="/live-chat/:sessionId" element={<LiveChat />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:doctorId" element={<Messages />} />
            <Route path="/tickets" element={<TicketHistory />} />
            <Route path="/tickets/new" element={<CreateTicket />} />
            <Route path="/community" element={<UserCommunity />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/notifications" element={<UserNotifications />} />
            <Route path="/payments/history" element={<PaymentHistory />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTE_PATHS.DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTE_PATHS.DOCTOR_VERIFICATION} element={<DoctorVerification />} />
            <Route path={ROUTE_PATHS.DOCTORS} element={<AdminDoctors />} />
            <Route path={ROUTE_PATHS.DOCTOR_NEW} element={<DoctorForm />} />
            <Route path={ROUTE_PATHS.DOCTOR_DETAILS} element={<AdminDoctorDetails />} />
            <Route path={ROUTE_PATHS.DOCTOR_EDIT} element={<DoctorForm />} />
            <Route path={ROUTE_PATHS.PATIENTS} element={<Patients />} />
            <Route path={ROUTE_PATHS.PATIENT_NEW} element={<PatientForm />} />
            <Route path={ROUTE_PATHS.PATIENT_DETAILS} element={<PatientDetails />} />
            <Route path={ROUTE_PATHS.PATIENT_EDIT} element={<PatientForm />} />
            <Route path={ROUTE_PATHS.TICKETS} element={<Tickets />} />
            <Route path={ROUTE_PATHS.TICKET_DETAILS} element={<TicketDetails />} />
            <Route path={ROUTE_PATHS.SESSIONS} element={<Sessions />} />
            <Route path={ROUTE_PATHS.SESSIONS_CALENDAR} element={<SessionsCalendar />} />
            <Route path={ROUTE_PATHS.SESSION_DETAILS} element={<SessionDetails />} />
            <Route path={ROUTE_PATHS.PAYMENTS} element={<Payments />} />
            <Route path={ROUTE_PATHS.PAYMENT_DETAILS} element={<PaymentDetails />} />
            <Route path={ROUTE_PATHS.COMMUNITY_POSTS} element={<CommunityPosts />} />
            <Route path={ROUTE_PATHS.COMMUNITY_COMMENTS} element={<CommunityComments />} />
            <Route path={ROUTE_PATHS.CONTACTS} element={<AdminContacts />} />
            <Route path={ROUTE_PATHS.NOTIFICATIONS} element={<AdminNotifications />} />
            <Route path={ROUTE_PATHS.REPORTS} element={<Reports />} />
            <Route path={ROUTE_PATHS.SETTINGS} element={<Settings />} />
            <Route path={ROUTE_PATHS.PROFILE} element={<AdminProfile />} />
          </Route>
        </Route>

        {/* Doctor Landing & Public Routes */}
        <Route element={<DoctorMasterLayout />}>
          <Route path="/doctor/home" element={<DoctorHomeLanding />} />
          <Route path="/home" element={<DoctorHomeLanding />} />
        </Route>
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />

        {/* Doctor Protected Routes */}
        <Route element={<DoctorProtectedRoute />}>
          <Route path="/doctor/*" element={<DoctorDashboard />} />
          <Route path="/doctor" element={<Navigate to="/doctor/dashboard" replace />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
