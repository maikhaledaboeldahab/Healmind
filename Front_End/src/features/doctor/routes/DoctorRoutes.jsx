import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DoctorDashboard from '../pages/DoctorDashboard.jsx';
import { DoctorProvider } from '../context/DoctorContext.jsx';

// Current no-op guard relocated from ProtectedRoute.jsx
export function DoctorProtectedRoute() {
  return <Outlet />;
}

export default function DoctorRoutes() {
  return (
    <DoctorProvider>
      <Routes>
        {/* Protected routes */}
        <Route element={<DoctorProtectedRoute />}>
          <Route path="*" element={<DoctorDashboard />} />
        </Route>
      </Routes>
    </DoctorProvider>
  );
}
