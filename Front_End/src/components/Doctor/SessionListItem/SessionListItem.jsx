import styles from "./SessionListItem.module.css";

// Props:
// patientName  -> e.g. "Eleanor Vance"
// sessionType  -> e.g. "Anxiety Treatment • Follow-up"
// time         -> single combined string, e.g. "09:00 AM"
// duration     -> e.g. "50 mins"
// status       -> e.g. "Confirmed" | "In-Session" | "Waiting"
const SessionListItem = ({ patientName, sessionType, time, duration, status }) => {
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

      <span className={`${styles.status} ${styles[statusKey] || ""}`}>
        {status}
      </span>
    </div>
  );
};

export default SessionListItem;