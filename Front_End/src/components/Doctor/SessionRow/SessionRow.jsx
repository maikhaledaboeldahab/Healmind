import styles from "./SessionRow.module.css";

// Props:
// patientName -> e.g. "Julian Vance"
// date, time  -> e.g. "Oct 24, 2023", "09:00 AM"
// sessionType -> e.g. "Cognitive Behavioral Therapy (CBT)"
// status      -> "Completed" | "In-progress" | "Cancelled"
// decision    -> "Approved" | "Pending" | "Rejected"
const SessionRow = ({ patientName, date, time, sessionType, status, decision }) => {
  const statusKey = status.toLowerCase().replace(/[\s-]/g, "");
  const decisionKey = decision.toLowerCase();

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
        <button className={styles.actionsBtn} aria-label="Row actions">
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>
      </td>
    </tr>
  );
};

export default SessionRow;