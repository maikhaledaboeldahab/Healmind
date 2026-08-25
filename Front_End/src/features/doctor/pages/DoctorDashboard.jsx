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


const DoctorDashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <DoctorNavbar doctorName="Farah" />

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
            <Route path="livechat" element={<LiveChat/>} />
            <Route path="chatbot" element={<ChatBot />} />
          </Routes>
        </main>
      </div>
      <DoctorFooter/>
    </div>
  );
};

export default DoctorDashboard;