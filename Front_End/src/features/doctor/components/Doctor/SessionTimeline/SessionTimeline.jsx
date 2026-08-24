import { useNavigate } from "react-router-dom";
import styles from "./SessionTimeline.module.css";

// Props:
// nextSession -> { id, date, title, goal } or null if none scheduled
// pastSessions -> array of { id, date, title, duration, summary }
const SessionTimeline = ({ nextSession, pastSessions = [] }) => {
  const navigate = useNavigate();

  return (
    <div className={`${styles.card} p-3 p-md-4 mb-4`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className={styles.title}>Session Timeline</h4>
      </div>

      {nextSession && (
        <div className={styles.nextSession}>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className={styles.nextLabel}>Next Session • {nextSession.date}</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 px-2 py-1"
              style={{ fontSize: '0.75rem', borderRadius: '20px' }}
              onClick={() => navigate(`/doctor/sessions/${nextSession.id || 1}/video`)}
              title="Join Next Session"
            >
              <i className="fa-solid fa-video"></i>
              <span>Join Call</span>
            </button>
          </div>
          <p className={styles.nextTitle}>{nextSession.title}</p>
          <p className={styles.nextGoal}>{nextSession.goal}</p>
        </div>
      )}

      {pastSessions.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="fa-regular fa-clock fa-2x mb-2"></i>
          <p>No past sessions recorded yet.</p>
        </div>
      ) : (
        pastSessions.map((session) => (
          <div key={session.id} className={styles.pastRow}>
            <i className={`fa-solid fa-circle-check ${styles.checkIcon}`}></i>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between">
                <span className={styles.pastDate}>{session.date}</span>
                <span className={styles.pastDuration}>{session.duration}</span>
              </div>
              <p className={styles.pastTitle}>{session.title}</p>
              <p className={styles.pastSummary}>{session.summary}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SessionTimeline;