import styles from "./SessionTimeline.module.css";

// Props:
// nextSession -> { date, title, goal, isLive } or null if none scheduled
// pastSessions -> array of { id, date, title, duration, summary }
// onJoinCall -> callback function when Join Video Call is clicked
const SessionTimeline = ({ nextSession, pastSessions = [], onJoinCall }) => {
  const handleJoinClick = () => {
    onJoinCall?.(nextSession);
  };

  return (
    <div className={`${styles.card} p-3 p-md-4 mb-4`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className={styles.title}>Session Timeline</h4>
      </div>

      {nextSession && (
        <div className={styles.nextSession}>
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
            <div>
              <span className={styles.nextLabel}>Next Session • {nextSession.date}</span>
              <p className={styles.nextTitle}>{nextSession.title}</p>
            </div>
            <button
              className={`${styles.joinBtn} ${nextSession.isLive ? styles.joinBtnActive : ""}`}
              onClick={handleJoinClick}
            >
              <i className="fa-solid fa-video me-2"></i>
              Join Video Call
            </button>
          </div>
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