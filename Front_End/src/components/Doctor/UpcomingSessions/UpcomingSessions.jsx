import SessionListItem from "../SessionListItem/SessionListItem";
import Skeleton from "../../UI/Skeleton/Skeleton";
import styles from "./UpcomingSessions.module.css";

// Props:
// sessions -> array of { id, patientName, sessionType, time, duration, status, date }
const UpcomingSessions = ({ sessions = [] }) => {
  return (
    <div className={`${styles.card} p-3 p-md-4`}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className={styles.title}>Upcoming Sessions</h4>
      </div>

      {/* Empty State */}
      {sessions.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="fa-regular fa-clock fa-2x mb-2"></i>
          <p>No upcoming sessions scheduled.</p>
        </div>
      ) : (
        sessions.map((session) => (
          <SessionListItem key={session.id} {...session} />
        ))
      )}
    </div>
  );
};

export default UpcomingSessions;