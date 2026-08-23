import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout/AdminLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner.jsx'
import { ROUTE_PATHS } from '../constants/routePaths'

const Login = lazy(() => import('../pages/Login/Login.jsx'))
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard.jsx'))
const DoctorVerification = lazy(() => import('../pages/DoctorVerification/DoctorVerification.jsx'))
const Doctors = lazy(() => import('../pages/Doctors/Doctors.jsx'))
const DoctorDetails = lazy(() => import('../pages/DoctorDetails/DoctorDetails.jsx'))
const DoctorForm = lazy(() => import('../pages/DoctorForm/DoctorForm.jsx'))
const Patients = lazy(() => import('../pages/Patients/Patients.jsx'))
const PatientDetails = lazy(() => import('../pages/PatientDetails/PatientDetails.jsx'))
const PatientForm = lazy(() => import('../pages/PatientForm/PatientForm.jsx'))
const Tickets = lazy(() => import('../pages/Tickets/Tickets.jsx'))
const TicketDetails = lazy(() => import('../pages/TicketDetails/TicketDetails.jsx'))
const Sessions = lazy(() => import('../pages/Sessions/Sessions.jsx'))
const SessionsCalendar = lazy(() => import('../pages/SessionsCalendar/SessionsCalendar.jsx'))
const SessionDetails = lazy(() => import('../pages/SessionDetails/SessionDetails.jsx'))
const Payments = lazy(() => import('../pages/Payments/Payments.jsx'))
const PaymentDetails = lazy(() => import('../pages/PaymentDetails/PaymentDetails.jsx'))
const CommunityPosts = lazy(() => import('../pages/Community/CommunityPosts.jsx'))
const CommunityComments = lazy(() => import('../pages/Community/CommunityComments.jsx'))
const Contacts = lazy(() => import('../pages/Contacts/Contacts.jsx'))
const Notifications = lazy(() => import('../pages/Notifications/Notifications.jsx'))
const Reports = lazy(() => import('../pages/Reports/Reports.jsx'))
const Settings = lazy(() => import('../pages/Settings/Settings.jsx'))
const Profile = lazy(() => import('../pages/Profile/Profile.jsx'))
const NotFound = lazy(() => import('../pages/NotFound/NotFound.jsx'))

function SuspenseFallback() {
  return <LoadingSpinner fullHeight label="Loading page…" />
}

function AppRoutes() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        <Route path={ROUTE_PATHS.LOGIN} element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTE_PATHS.DASHBOARD} element={<Dashboard />} />

            <Route path={ROUTE_PATHS.DOCTOR_VERIFICATION} element={<DoctorVerification />} />

            <Route path={ROUTE_PATHS.DOCTORS} element={<Doctors />} />
            <Route path={ROUTE_PATHS.DOCTOR_NEW} element={<DoctorForm />} />
            <Route path={ROUTE_PATHS.DOCTOR_DETAILS} element={<DoctorDetails />} />
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

            <Route path={ROUTE_PATHS.CONTACTS} element={<Contacts />} />

            <Route path={ROUTE_PATHS.NOTIFICATIONS} element={<Notifications />} />
            <Route path={ROUTE_PATHS.REPORTS} element={<Reports />} />
            <Route path={ROUTE_PATHS.SETTINGS} element={<Settings />} />
            <Route path={ROUTE_PATHS.PROFILE} element={<Profile />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Navigate to={ROUTE_PATHS.LOGIN} replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes