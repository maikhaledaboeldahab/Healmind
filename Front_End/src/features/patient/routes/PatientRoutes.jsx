import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../../../shared/components/MainLayout/MainLayout';
import AuthLayout from '../../../shared/components/AuthLayout/AuthLayout';
import UserProtectedRoute from './ProtectedRoute';

// Pages
import SharedLogin from '../pages/Login/SharedLogin.jsx';
import Register from '../pages/Register/Register';
import UserDashboard from '../pages/Dashboard/Dashboard';
import UserDoctors from '../pages/Doctors/Doctors';
import UserDoctorDetails from '../pages/DoctorDetails/DoctorDetails';
import BookAppointment from '../pages/BookAppointment/BookAppointment';
import Payment from '../pages/Payment/Payment';
import UpcomingSessions from '../pages/UpcomingSessions/UpcomingSessions';
import SessionHistory from '../pages/SessionHistory/SessionHistory';
import SessionReport from '../pages/SessionReport/SessionReport';
import RateDoctor from '../pages/RateDoctor/RateDoctor';
import VideoSession from '../pages/VideoSession/VideoSession';
import LiveChat from '../pages/LiveChat/LiveChat';
import Messages from '../pages/Messages/Messages';
import TicketHistory from '../pages/TicketHistory/TicketHistory';
import CreateTicket from '../pages/CreateTicket/CreateTicket';
import UserCommunity from '../pages/Community/Community';
import AIAssistant from '../pages/AIAssistant/AIAssistant';
import ContactUs from '../pages/ContactUs/ContactUs';
import UserNotifications from '../pages/Notifications/Notifications';
import PaymentHistory from '../pages/PaymentHistory/PaymentHistory';
import UserProfile from '../pages/Profile/Profile';
import PaymentSuccess from '../pages/PaymentSuccess/PaymentSuccess';
import PaymentCancelled from '../pages/PaymentCancelled/PaymentCancelled';

export default function PatientRoutes() {
  return (
    <Routes>
      {/* Public / Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<SharedLogin />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="" element={<Navigate to="/login" replace />} />

      {/* User Protected Routes */}
      <Route element={<UserProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="doctors" element={<UserDoctors />} />
          <Route path="doctors/:doctorId" element={<UserDoctorDetails />} />
          <Route path="doctors/:doctorId/book" element={<BookAppointment />} />
          <Route path="payment/:bookingId" element={<Payment />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-cancelled" element={<PaymentCancelled />} />
          <Route path="sessions/upcoming" element={<UpcomingSessions />} />
          <Route path="sessions/history" element={<SessionHistory />} />
          <Route path="sessions/:sessionId" element={<SessionReport />} />
          <Route path="sessions/:sessionId/rate" element={<RateDoctor />} />
          <Route path="sessions/:sessionId/video" element={<VideoSession />} />
          <Route path="live-chat/:sessionId" element={<LiveChat />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:doctorId" element={<Messages />} />
          <Route path="tickets" element={<TicketHistory />} />
          <Route path="tickets/new" element={<CreateTicket />} />
          <Route path="community" element={<UserCommunity />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="notifications" element={<UserNotifications />} />
          <Route path="payments/history" element={<PaymentHistory />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
      </Route>
    </Routes>
  );
}
