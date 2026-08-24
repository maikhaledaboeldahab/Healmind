import { useNavigate } from "react-router-dom";
import styles from "./SessionListItem.module.css";

// Props:
// id           -> e.g. 1
// patientName  -> e.g. "Eleanor Vance"
// sessionType  -> e.g. "Anxiety Treatment • Follow-up"
// time         -> single combined string, e.g. "09:00 AM"
// duration     -> e.g. "50 mins"
// status       -> e.g. "Confirmed" | "In-Session" | "Waiting"
const SessionListItem = ({ id, patientName, sessionType, time, duration, status }) => {
  const navigate = useNavigate();
  const statusKey = status.toLowerCase().replace(/[\s-]/g, "");

  return (
    <div className={`${styles.row} d-flex align-items-center py-3`}>
      <div className={styles.avatar}>{patientName.charAt(0)}</div>

      <div className="flex-grow-1">
        <p className={styles.patientName}>{patientName}</p>
        <p className={styles.sessionType}>{sessionType}</p>
      </div>

      <div className={styles.time}>
        <span className={styles.timeValue}>{time}</span>
        <span className={styles.duration}>{duration}</span>
      </div>

      <div className="d-flex align-items-center gap-2">
        <span className={`${styles.status} ${styles[statusKey] || ""}`}>
          {status}
        </span>
        {id && (
          <button
            type="button"
            className="btn btn-sm btn-outline-primary p-1 d-inline-flex align-items-center justify-content-center"
            style={{ borderRadius: '50%', width: '32px', height: '32px' }}
            onClick={() => navigate(`/doctor/sessions/${id}/video`)}
            title="Join Video Session"
          >
            <i className="fa-solid fa-video" style={{ fontSize: '0.75rem' }}></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default SessionListItem;