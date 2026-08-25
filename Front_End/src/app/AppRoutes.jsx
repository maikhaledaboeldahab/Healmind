import { Routes, Route } from 'react-router-dom';
import PatientRoutes from '../features/patient/routes/PatientRoutes';
import DoctorRoutes from '../features/doctor/routes/DoctorRoutes';
import AdminRoutes from '../features/admin/routes/AdminRoutes';
import Home from '../shared/pages/Home/Home.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public landing page — first page visitors see */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />

      {/* Admin Route Subtree */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Doctor Route Subtree */}
      <Route path="/doctor/*" element={<DoctorRoutes />} />

      {/* Patient / Root Routes */}
      <Route path="/*" element={<PatientRoutes />} />
    </Routes>
  );
}
