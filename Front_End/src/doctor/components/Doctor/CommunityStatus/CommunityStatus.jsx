import { useState } from "react";
import ConfirmModal from "../../UI/ConfirmModal/ConfirmModal";
import styles from "./CommunityStatus.module.css";

// Config for each of the 3 possible decisions — text, resulting status,
// and which color the confirm button should use. Having this as one object
// avoids repeating near-identical JSX 3 times for Approve/Reject/Request.
const DECISIONS = {
  approve: {
    title: "Approve Community Access",
    message: "This will grant the patient full posting and commenting access in the Community.",
    confirmText: "Approve",
    confirmColor: "primary",
    resultingStatus: "Approved",
    toastMessage: "Community access approved.",
  },
  reject: {
    title: "Reject Community Access",
    message: "The patient will remain view-only in the Community.",
    confirmText: "Reject",
    confirmColor: "error",
    resultingStatus: "Rejected",
    toastMessage: "Community access rejected.",
  },
  request: {
    title: "Request Another Session",
    message: "The patient will need one more session before a final decision is made.",
    confirmText: "Request Session",
    confirmColor: "neutral",
    resultingStatus: "Needs Another Session",
    toastMessage: "Another session has been requested.",
  },
};

// Props:
// status     -> "Approved" | "Pending" | "Rejected" | "Needs Another Session"
// onDecision -> called with the new status string once the doctor confirms a decision
const CommunityStatus = ({ status, onDecision }) => {
  const [activeDecision, setActiveDecision] = useState(null); // "approve" | "reject" | "request" | null

  const hasFullAccess = status === "Approved";
  const statusKey = status.toLowerCase().replace(/\s/g, "");

  const handleConfirm = () => {
    const decision = DECISIONS[activeDecision];

    // TODO: replace with a real API call once the backend exists, e.g.
    // await axios.patch(`/api/tickets/${ticketId}/decision`, { decision: activeDecision });
    onDecision?.(decision.resultingStatus, decision.toastMessage);

    setActiveDecision(null);
  };

  return (
    <div className={`${styles.card} p-3 p-md-4 mb-4`}>
      <h4 className={styles.title}>Community Status</h4>

      <div className={styles.iconRow}>
        <div className={`${styles.iconCircle} ${hasFullAccess ? styles.unlocked : styles.locked}`}>
          <i className={`fa-solid ${hasFullAccess ? "fa-unlock" : "fa-lock"}`}></i>
        </div>
        <span className={`${styles.badge} ${styles[statusKey] || ""}`}>
          {status}
        </span>
      </div>

      <p className={styles.description}>
        {hasFullAccess
          ? "This patient can post and comment in the Community."
          : "This patient can only view posts and comments until their doctor approves full access."}
      </p>

      <div className="d-flex flex-column gap-2 mt-3">
        <button
          className={`${styles.decisionBtn} ${styles.approveBtn}`}
          onClick={() => setActiveDecision("approve")}
        >
          <i className="fa-solid fa-check me-2"></i>
          Approve
        </button>
        <button
          className={`${styles.decisionBtn} ${styles.requestBtn}`}
          onClick={() => setActiveDecision("request")}
        >
          <i className="fa-solid fa-rotate-right me-2"></i>
          Request Another Session
        </button>
        <button
          className={`${styles.decisionBtn} ${styles.rejectBtn}`}
          onClick={() => setActiveDecision("reject")}
        >
          <i className="fa-solid fa-xmark me-2"></i>
          Reject
        </button>
      </div>

      {activeDecision && (
        <ConfirmModal
          show={!!activeDecision}
          title={DECISIONS[activeDecision].title}
          message={DECISIONS[activeDecision].message}
          confirmText={DECISIONS[activeDecision].confirmText}
          confirmColor={DECISIONS[activeDecision].confirmColor}
          onConfirm={handleConfirm}
          onCancel={() => setActiveDecision(null)}
        />
      )}
    </div>
  );
};

export default CommunityStatus;