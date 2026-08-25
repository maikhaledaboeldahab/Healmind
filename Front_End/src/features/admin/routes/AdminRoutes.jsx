import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout/AdminLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import LoadingSpinner from '../../../shared/components/LoadingSpinner/LoadingSpinner.jsx';

// Pages
const AdminDashboard = lazy(() => import('../pages/Dashboard/Dashboard.jsx'));
const DoctorVerification = lazy(() => import('../pages/DoctorVerification/DoctorVerification.jsx'));
const AdminDoctors = lazy(() => import('../pages/Doctors/Doctors.jsx'));
const AdminDoctorDetails = lazy(() => import('../pages/DoctorDetails/DoctorDetails.jsx'));
const DoctorForm = lazy(() => import('../pages/DoctorForm/DoctorForm.jsx'));
const Patients = lazy(() => import('../pages/Patients/Patients.jsx'));
const PatientDetails = lazy(() => import('../pages/PatientDetails/PatientDetails.jsx'));
const PatientForm = lazy(() => import('../pages/PatientForm/PatientForm.jsx'));
const Tickets = lazy(() => import('../pages/Tickets/Tickets.jsx'));
const TicketDetails = lazy(() => import('../pages/TicketDetails/TicketDetails.jsx'));
const Sessions = lazy(() => import('../pages/Sessions/Sessions.jsx'));
const SessionsCalendar = lazy(() => import('../pages/SessionsCalendar/SessionsCalendar.jsx'));
const SessionDetails = lazy(() => import('../pages/SessionDetails/SessionDetails.jsx'));
const Payments = lazy(() => import('../pages/Payments/Payments.jsx'));
const PaymentDetails = lazy(() => import('../pages/PaymentDetails/PaymentDetails.jsx'));
const CommunityPosts = lazy(() => import('../pages/Community/CommunityPosts.jsx'));
const CommunityComments = lazy(() => import('../pages/Community/CommunityComments.jsx'));
const Contacts = lazy(() => import('../pages/Contacts/Contacts.jsx'));
const Notifications = lazy(() => import('../pages/Notifications/Notifications.jsx'));
const Reports = lazy(() => import('../pages/Reports/Reports.jsx'));
const Settings = lazy(() => import('../pages/Settings/Settings.jsx'));
const Profile = lazy(() => import('../pages/Profile/Profile.jsx'));

function SuspenseFallback() {
  return <LoadingSpinner fullHeight label="Loading page..." />;
}

export default function AdminRoutes() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="" element={<AdminDashboard />} />
            <Route path="doctor-verification" element={<DoctorVerification />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="doctors/new" element={<DoctorForm />} />
            <Route path="doctors/:doctorId" element={<AdminDoctorDetails />} />
            <Route path="doctors/:doctorId/edit" element={<DoctorForm />} />
            <Route path="patients" element={<Patients />} />
            <Route path="patients/new" element={<PatientForm />} />
            <Route path="patients/:patientId" element={<PatientDetails />} />
            <Route path="patients/:patientId/edit" element={<PatientForm />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="tickets/:ticketId" element={<TicketDetails />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="sessions/calendar" element={<SessionsCalendar />} />
            <Route path="sessions/:sessionId" element={<SessionDetails />} />
            <Route path="payments" element={<Payments />} />
            <Route path="payments/:paymentId" element={<PaymentDetails />} />
            <Route path="community/posts" element={<CommunityPosts />} />
            <Route path="community/comments" element={<CommunityComments />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
