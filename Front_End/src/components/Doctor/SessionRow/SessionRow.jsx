import { useNavigate } from "react-router-dom";
import styles from "./SessionRow.module.css";

// Props:
// patientName -> e.g. "Julian Vance"
// date, time  -> e.g. "Oct 24, 2023", "09:00 AM"
// sessionType -> e.g. "Cognitive Behavioral Therapy (CBT)"
// status      -> "Completed" | "In-progress" | "Cancelled"
// decision    -> "Approved" | "Pending" | "Rejected"
// onVideoCall -> optional callback
const SessionRow = ({ patientName, date, time, sessionType, status, decision, onVideoCall }) => {
  const navigate = useNavigate();
  const statusKey = status.toLowerCase().replace(/[\s-]/g, "");
  const decisionKey = decision.toLowerCase();

  const handleVideoCall = () => {
    if (onVideoCall) {
      onVideoCall({ patientName, date, time });
    } else {
      alert(`Starting video session with ${patientName}...`);
    }
  };

  const handleLiveChat = () => {
    navigate("/doctor/livechat", { state: { patientName } });
  };

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div className={styles.avatar}>{patientName.charAt(0)}</div>
          <span className={styles.patientName}>{patientName}</span>
        </div>
      </td>
      <td className={styles.cellText}>{date}</td>
      <td className={styles.cellText}>{time}</td>
      <td className={styles.cellText}>{sessionType}</td>
      <td>
        <span className={`${styles.statusPill} ${styles[statusKey] || ""}`}>{status}</span>
      </td>
      <td>
        <span className={`${styles.decisionDot} ${styles[decisionKey] || ""}`}></span>
        <span className={styles.decisionText}>{decision}</span>
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <button
            className={styles.actionIconBtn}
            onClick={handleVideoCall}
            title="Start Video Call"
            aria-label="Start Video Call"
          >
            <i className="fa-solid fa-video"></i>
          </button>
          <button
            className={styles.actionIconBtn}
            onClick={handleLiveChat}
            title="Open Live Chat"
            aria-label="Open Live Chat"
          >
            <i className="fa-solid fa-comment-dots"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SessionRow;