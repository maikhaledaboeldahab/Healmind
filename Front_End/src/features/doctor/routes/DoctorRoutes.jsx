import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DoctorHomeLanding from '../components/Home/Home.jsx';
import DoctorLogin from '../components/Layout/Login/Login.jsx';
import DoctorRegister from '../components/Layout/Register/Register.jsx';
import DoctorDashboard from '../pages/DoctorDashboard.jsx';
import DoctorMasterLayout from '../components/Layout/MasterLayout.jsx';

// Current no-op guard relocated from ProtectedRoute.jsx
export function DoctorProtectedRoute() {
  return <Outlet />;
}

export default function DoctorRoutes() {
  return (
    <Routes>
      {/* Public / Landing routes */}
      <Route element={<DoctorMasterLayout />}>
        <Route path="home" element={<DoctorHomeLanding />} />
      </Route>
      <Route path="login" element={<DoctorLogin />} />
      <Route path="register" element={<DoctorRegister />} />

      {/* Protected routes */}
      <Route element={<DoctorProtectedRoute />}>
        <Route path="*" element={<DoctorDashboard />} />
      </Route>
    </Routes>
  );
}
