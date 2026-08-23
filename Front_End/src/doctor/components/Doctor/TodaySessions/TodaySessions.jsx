import SessionListItem from "../SessionListItem/SessionListItem";
import styles from "./TodaySessions.module.css";

// Props:
// sessions -> array of { id, time, ampm, patientName, sessionType, status }
const TodaysSessions = ({ sessions = [] }) => {
  return (
    <div className={`${styles.card} p-3 p-md-4`}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className={styles.title}>Today's Sessions</h4>
      </div>

      {/* Empty State: no sessions today */}
      {sessions.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="fa-regular fa-calendar fa-2x mb-2"></i>
          <p>No sessions scheduled for today.</p>
        </div>
      ) : (
        sessions.map((session) => (
          <SessionListItem key={session.id} {...session} />
        ))
      )}
    </div>
  );
};

export default TodaysSessions;