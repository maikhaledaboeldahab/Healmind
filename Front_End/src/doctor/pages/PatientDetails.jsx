import { useState } from "react";
import { useParams } from "react-router-dom";
import PatientHeader from "../components/Doctor/PatientHeader/PatientHeader";
import PatientOverview from "../components/Doctor/PatientOverview/PatientOverview";
import CommunityStatus from "../components/Doctor/CommunityStatus/CommunityStatus";
import SessionTimeline from "../components/Doctor/SessionTimeline/SessionTimeline";
import Toast from "../components/UI/Toast/Toast";

const basePatient = {
  patientName: "Arlo Sterling",
  age: 29,
  gender: "Male",
  phone: "+20 100 123 4567",
  email: "arlo.sterling@email.com",
  therapyType: "Cognitive Behavioral Therapy",
  patientSince: "Jan 2023",
};

const diagnosis =
  "Generalized Anxiety Disorder with mild depressive episodes. Responding well to weekly CBT sessions.";

const notes = [
  { id: 1, date: "Oct 24, 2023", text: "Patient reports improved sleep patterns. Continuing current treatment plan." },
  { id: 2, date: "Oct 10, 2023", text: "Discussed coping strategies for work-related stress triggers." },
];

const nextSession = {
  date: "In 3 days",
  title: "Reviewing Anxiety Triggers",
  goal: "Goal: Finalize the list of environmental stressors and practice Level 2 grounding.",
};

const pastSessions = [
  { id: 1, date: "Oct 12, 2023", duration: "45 minutes", title: "Introduction to Breathwork", summary: "Successful identification of physiological precursors to panic episodes. Arlo responded well to box breathing." },
  { id: 2, date: "Sep 28, 2023", duration: "50 minutes", title: "Initial Assessment", summary: "First session — established baseline anxiety triggers and treatment goals." },
];

const PatientDetails = () => {
  const { id } = useParams();
  console.log("Viewing patient ID:", id);

  // Status now lives in state, not a static constant — so a doctor's
  // decision (Approve/Reject/Request Another Session) actually updates
  // what's shown here, on the header badge and the Community Status card.
  const [status, setStatus] = useState("Approved");
  const [toast, setToast] = useState({ show: false, message: "" });

  const handleDecision = (newStatus, toastMessage) => {
    setStatus(newStatus);
    setToast({ show: true, message: toastMessage });
  };

  return (
    <div>
      <PatientHeader {...basePatient} status={status} />

      <div className="row g-4">
        <div className="col-lg-8">
          <PatientOverview diagnosis={diagnosis} notes={notes} />
          <SessionTimeline nextSession={nextSession} pastSessions={pastSessions} />
        </div>

        <div className="col-lg-4">
          <div style={{ position: "sticky", top: "20px" }}>
            <CommunityStatus status={status} onDecision={handleDecision} />
          </div>
        </div>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
};

export default PatientDetails;