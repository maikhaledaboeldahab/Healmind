import { useState } from "react";
import styles from "./SessionRequestRow.module.css";

// Props:
// patientName, requestedDate, requestedTime, message -> request details
// status   -> "pending" | "accepted"
// onAccept, onReject, onVideoCall -> callbacks
const SessionRequestRow = ({ patientName, requestedDate, requestedTime, message, status, onAccept, onReject, onVideoCall }) => {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className={styles.row}>
      <div className="d-flex align-items-center gap-3">
        <div className={styles.avatar}>{patientName.charAt(0)}</div>

        <div className="flex-grow-1">
          <p className={styles.name}>{patientName}</p>
          <p className={styles.meta}>
            Requested {requestedDate} • {requestedTime}
          </p>
        </div>

        <button className={styles.viewMessageBtn} onClick={() => setShowMessage((prev) => !prev)}>
          <i className="fa-regular fa-message me-1"></i>
          View Message
        </button>
      </div>

      {showMessage && <p className={styles.message}>{message}</p>}

      <div className="d-flex gap-2 mt-3">
        {status === "accepted" ? (
          <button className={styles.videoBtn} onClick={onVideoCall}>
            <i className="fa-solid fa-video me-2"></i>
            Join Video Call
          </button>
        ) : (
          <>
            <button className={styles.acceptBtn} onClick={onAccept}>
              <i className="fa-solid fa-check me-2"></i>
              Accept
            </button>
            <button className={styles.rejectBtn} onClick={onReject}>
              <i className="fa-solid fa-xmark me-2"></i>
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SessionRequestRow;