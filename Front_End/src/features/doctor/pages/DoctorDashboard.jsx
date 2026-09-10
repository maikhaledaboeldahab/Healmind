import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import DoctorNavbar from "../components/Layout/DoctorNavbar/DoctorNavbar";
import DoctorSidebar from "../components/Layout/DoctorSidebar/DoctorSidebar";
import DoctorFooter from "../components/Layout/DoctorFooter/DoctorFooter";
import DoctorHome from "./DoctorHome";
import Patients from "./Patients";
import Availability from "./Availability";
import Session from "./Sessions";
import Profile from "./Profile";
import PatientDetails from "./PatientDetails";
import LiveChat from "./LiveChat";
import ChatBot from "./ChatBot";
import { useAuth } from "../../../shared/context/AuthContext";
import { useDoctor } from "../context/DoctorContext";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { profile } = useDoctor();
  const location = useLocation();
  const doctorName = profile?.name || user?.name || user?.fullName || "Doctor";
  const isFixedHeightPage = location.pathname.includes("/livechat") || location.pathname.includes("/chatbot");

  return (
    <div className="dashboard-wrapper">
      <DoctorNavbar doctorName={doctorName} />

      <div className="d-flex flex-grow-1 doctor-body">
        <DoctorSidebar />

        <main className={`flex-grow-1 p-4 doctor-main ${isFixedHeightPage ? "doctor-main-fixed" : ""}`}>
          <Routes>
            <Route index element={<Navigate to="/doctor/dashboard" replace />} />
            <Route path="dashboard" element={<DoctorHome />} />
            <Route path="patients" element={<Patients />} />
            <Route path="availability" element={<Availability />} />
            <Route path="sessions" element={<Session />} />
            <Route path="profile" element={<Profile />} />
            <Route path="patients/:id" element={<PatientDetails />} />
            <Route path="livechat" element={<LiveChat />} />
            <Route path="chatbot" element={<ChatBot />} />
            <Route path="*" element={<Navigate to="/doctor/dashboard" replace />} />
          </Routes>
        </main>
      </div>
      <DoctorFooter />
    </div>
  );
};

export default DoctorDashboard;