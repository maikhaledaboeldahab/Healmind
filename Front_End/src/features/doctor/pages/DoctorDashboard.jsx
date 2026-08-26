import { Route, Routes, Navigate } from "react-router-dom";
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
  const doctorName = profile?.name || user?.name || user?.fullName || "Doctor";

  return (
    <div className="dashboard-wrapper">
      <DoctorNavbar doctorName={doctorName} />

      <div className="d-flex flex-grow-1">
        <DoctorSidebar />

        <main className="flex-grow-1 p-4">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DoctorHome />} />
            <Route path="patients" element={<Patients />} />
            <Route path="availability" element={<Availability />} />
            <Route path="sessions" element={<Session />} />
            <Route path="profile" element={<Profile />} />
            <Route path="patients/:id" element={<PatientDetails />} />
            <Route path="livechat" element={<LiveChat />} />
            <Route path="chatbot" element={<ChatBot />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
      <DoctorFooter />
    </div>
  );
};

export default DoctorDashboard;