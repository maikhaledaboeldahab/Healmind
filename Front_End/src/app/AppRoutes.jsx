import { Routes, Route } from 'react-router-dom';
import PatientRoutes from '../features/patient/routes/PatientRoutes';
import DoctorRoutes from '../features/doctor/routes/DoctorRoutes';
import AdminRoutes from '../features/admin/routes/AdminRoutes';
import DoctorHomeLanding from '../features/doctor/components/Home/Home.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Admin Route Subtree */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Doctor Route Subtree */}
      <Route path="/doctor/*" element={<DoctorRoutes />} />
      <Route path="/home" element={<DoctorHomeLanding />} />

      {/* Patient / Root Routes */}
      <Route path="/*" element={<PatientRoutes />} />
    </Routes>
  );
}
