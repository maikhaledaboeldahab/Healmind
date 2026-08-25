import { useState } from "react";
import ProfileCard from "../../components/Doctor/ProfileCard/ProfileCard";
import PersonalInfo from "../../components/Doctor/PersonalInfo/PersonalInfo";
import CertificationsList from "../../components/Doctor/CertificationsList/CertificationsList";
import ChangePasswordModal from "../../components/Doctor/ChangePasswordModal/ChangePasswordModal";
import WalletCard from "../../components/Doctor/WalletCard/WalletCard";
import Toast from "../../components/UI/Toast/Toast";

const initialInfo = {
  email: "farah@healmind.com",
  phone: "+20 100 123 4567",
  specialization: "Clinical Psychology",
  yearsExperience: "8",
};

const certifications = [
  { id: 1, name: "Board Certified Psychologist", issueDate: "March 2012", docId: "BCP-9920", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  { id: 2, name: "CBT Specialist Certification", issueDate: "June 2015", docId: "CBT-4412", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
];

const recentEarnings = [
  { id: 1, patientName: "Arlo Sterling", sessionType: "Live Session", date: "Oct 24, 2023", amount: 45 },
  { id: 2, patientName: "Maya Rossi", sessionType: "Ticket", date: "Oct 22, 2023", amount: 30 },
  { id: 3, patientName: "David Chen", sessionType: "Live Session", date: "Oct 20, 2023", amount: 45 },
];

const Profile = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const handlePasswordSave = () => {
    setShowPasswordModal(false);
    setToast({ show: true, message: "Password updated successfully." });
  };

  return (
    <div>
      <h3 className="fw-bold mb-4">My Professional Profile</h3>

      <ProfileCard
        doctorName="Farah"
        title="Clinical Psychologist"
        verificationStatus="approved"
      />

      <div className="row g-4">
        <div className="col-lg-8">
          <PersonalInfo initialData={initialInfo} onSave={(data) => console.log("Saved:", data)} />
          <CertificationsList certifications={certifications} />

          <div className="bg-white rounded-4 shadow-sm p-3 p-md-4">
            <h4 className="fw-bold mb-3" style={{ fontSize: "1rem" }}>
              Security
            </h4>
            <button
              className="btn"
              style={{
                backgroundColor: "var(--color-surface-container-high)",
                color: "var(--color-on-surface)",
                borderRadius: "var(--radius-full)",
                fontWeight: 700,
                fontSize: "0.85rem",
                padding: "8px 18px",
              }}
              onClick={() => setShowPasswordModal(true)}
            >
              <i className="fa-solid fa-lock me-2"></i>
              Change Password
            </button>
          </div>
        </div>

        <div className="col-lg-4">
          <div style={{ position: "sticky", top: "20px" }}>
            <WalletCard balance={4280} recentEarnings={recentEarnings} />
          </div>
        </div>
      </div>

      <ChangePasswordModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSave={handlePasswordSave}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
};

export default Profile;