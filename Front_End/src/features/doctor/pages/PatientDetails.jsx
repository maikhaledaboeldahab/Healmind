import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PatientHeader from "../components/Doctor/PatientHeader/PatientHeader";
import PatientOverview from "../components/Doctor/PatientOverview/PatientOverview";
import CommunityStatus from "../components/Doctor/CommunityStatus/CommunityStatus";
import SessionTimeline from "../components/Doctor/SessionTimeline/SessionTimeline";
import VideoCall from "../../../shared/components/VideoCall/VideoCall";
import Toast from "../../../shared/components/DoctorToast/DoctorToast";
import { useDoctor } from "../context/DoctorContext";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, updatePatientCommunityStatus } = useDoctor();

  // Find patient from dynamic context or fallback
  const patient = patients.find((p) => String(p.id) === String(id)) || patients[0] || {
    id: 1,
    patientName: "Arlo Sterling",
    age: 29,
    gender: "Male",
    phone: "+20 100 123 4567",
    email: "arlo.sterling@email.com",
    therapyType: "Cognitive Behavioral Therapy",
    status: "Approved",
    communityStatus: "Approved",
    patientSince: "Jan 2023",
    diagnosis: "Generalized Anxiety Disorder with mild depressive episodes.",
    notes: [],
    pastSessions: [],
    nextSession: null,
  };

  const [toast, setToast] = useState({ show: false, message: "" });
  const [showVideoCall, setShowVideoCall] = useState(false);

  const handleDecision = (newStatus, toastMessage) => {
    updatePatientCommunityStatus(patient.id, newStatus);
    setToast({ show: true, message: toastMessage });
  };

  const handleJoinCall = (session) => {
    const activeSession = session || patient.nextSession;
    if (activeSession && !activeSession.isLive) {
      setToast({
        show: true,
        message: `Session is scheduled for (${activeSession.date}). Video call will become active at the scheduled session time.`,
      });
      return;
    }
    setShowVideoCall(true);
  };

  return (
    <div>
      <PatientHeader {...patient} status={patient.communityStatus || patient.status} />

      <div className="row g-4">
        <div className="col-lg-8">
          <PatientOverview diagnosis={patient.diagnosis} notes={patient.notes || []} />
          <SessionTimeline
            nextSession={patient.nextSession}
            pastSessions={patient.pastSessions || []}
            onJoinCall={handleJoinCall}
          />
        </div>

        <div className="col-lg-4">
          <div style={{ position: "sticky", top: "20px" }}>
            <CommunityStatus
              patientId={patient._id || patient.id}
              status={patient.communityStatus || patient.status}
              onDecision={handleDecision}
            />
          </div>
        </div>
      </div>

      {/* Unified Video Call Overlay matching Patient Portal */}
      {showVideoCall && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            zIndex: 1060,
            display: "flex",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2 px-3">
            <span className="text-white fw-bold">
              <i className="fa-solid fa-video me-2 text-success"></i>
              Clinical Video Call with {patient.patientName}
            </span>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setShowVideoCall(false)}
            >
              <i className="fa-solid fa-xmark me-1"></i> Close
            </button>
          </div>
          <div className="flex-grow-1 rounded-4 overflow-hidden bg-dark">
            <VideoCall
              sessionId={`healmind-session-${patient.id}`}
              onLeave={() => setShowVideoCall(false)}
              fallbackDisplayName="Dr. Farah"
            />
          </div>
        </div>
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
};

export default PatientDetails;