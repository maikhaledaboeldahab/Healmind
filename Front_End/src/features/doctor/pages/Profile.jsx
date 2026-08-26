import { useState } from "react";
import ProfileCard from "../components/Doctor/ProfileCard/ProfileCard";
import PersonalInfo from "../components/Doctor/PersonalInfo/PersonalInfo";
import CertificationsList from "../components/Doctor/CertificationsList/CertificationsList";
import ChangePasswordModal from "../components/Doctor/ChangePasswordModal/ChangePasswordModal";
import WalletCard from "../components/Doctor/WalletCard/WalletCard";
import Toast from "../../../shared/components/DoctorToast/DoctorToast";
import { useDoctor } from "../context/DoctorContext";

const initialInfo = {
  email: "farah@healmind.com",
  phone: "+20 100 123 4567",
  specialization: "Clinical Psychology",
  yearsExperience: "8",
};

const recentEarnings = [
  { id: 1, patientName: "Arlo Sterling", sessionType: "Live Session", date: "Oct 24, 2023", amount: 45 },
  { id: 2, patientName: "Maya Rossi", sessionType: "Ticket", date: "Oct 22, 2023", amount: 30 },
  { id: 3, patientName: "David Chen", sessionType: "Live Session", date: "Oct 20, 2023", amount: 45 },
];

const Profile = () => {
  const { profile, updateProfile, certifications } = useDoctor();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const doctorInfo = {
    email: profile?.email || "doctor@healmind.com",
    phone: profile?.phone || "+20 100 123 4567",
    specialization: profile?.specialization || "Clinical Psychology",
    yearsExperience: String(profile?.yearsOfExperience || 5),
  };

  const handleSaveInfo = async (data) => {
    await updateProfile({
      email: data.email,
      phone: data.phone,
      specialization: data.specialization,
      yearsOfExperience: Number(data.yearsExperience),
    });
    setToast({ show: true, message: "Profile updated successfully!" });
  };

  const handlePasswordSave = () => {
    setShowPasswordModal(false);
    setToast({ show: true, message: "Password updated successfully." });
  };

  const handleViewDocument = (cert) => {
    setViewingDoc(cert);
  };

  return (
    <div>
      <h3 className="fw-bold mb-4">My Professional Profile</h3>

      <ProfileCard
        doctorName={profile?.name || profile?.fullName || "Doctor"}
        title={profile?.specialization || "Clinical Specialist"}
        verificationStatus={profile?.isApproved ? "approved" : "pending"}
      />

      <div className="row g-4">
        <div className="col-lg-8">
          <PersonalInfo initialData={doctorInfo} onSave={handleSaveInfo} />
          <CertificationsList
            certifications={certifications}
            onViewDocument={handleViewDocument}
          />

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

      {/* Interactive Document Viewer Modal */}
      {viewingDoc && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1060,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setViewingDoc(null)}
        >
          <div
            className="bg-white rounded-4 shadow-lg overflow-hidden d-flex flex-column"
            style={{ maxWidth: "680px", width: "100%", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
              <div className="d-flex align-items-center gap-2">
                <i className="fa-solid fa-certificate text-success fa-lg"></i>
                <div>
                  <h6 className="fw-bold mb-0">{viewingDoc.name}</h6>
                  <span className="text-muted small">
                    Registration ID: {viewingDoc.docId} • Issued: {viewingDoc.issueDate}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setViewingDoc(null)}
                aria-label="Close"
              ></button>
            </div>

            <div className="p-4 flex-grow-1 overflow-auto text-center bg-light d-flex flex-column align-items-center justify-content-center">
              <div
                className="bg-white p-4 rounded-3 shadow-sm border w-100"
                style={{ minHeight: "260px" }}
              >
                <div className="mb-3 text-success">
                  <i className="fa-solid fa-file-shield fa-3x"></i>
                </div>
                <h5 className="fw-bold">{viewingDoc.name}</h5>
                <p className="text-muted small mb-2">
                  Official Verification Document issued by <strong>{viewingDoc.issuer || "Accredited Health Authority"}</strong>
                </p>
                <div className="badge bg-success bg-opacity-10 text-success py-2 px-3 mb-3">
                  <i className="fa-solid fa-check-circle me-1"></i> Verified & Stored on HealMind Portal
                </div>
                {viewingDoc.fileUrl && (
                  <div className="mt-2">
                    <img
                      src={viewingDoc.fileUrl}
                      alt={viewingDoc.name}
                      className="img-fluid rounded-3 border"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 border-top d-flex justify-content-between align-items-center bg-white">
              <span className="text-muted small">
                File: {viewingDoc.fileName || `${viewingDoc.docId}.pdf`}
              </span>
              <div className="d-flex gap-2">
                <a
                  href={viewingDoc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-secondary btn-sm"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square me-1"></i> Open Full View
                </a>
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={() => setViewingDoc(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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