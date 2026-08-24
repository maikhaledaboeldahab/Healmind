import styles from "./ChatHeader.module.css";

// Props:
// patientName -> e.g. "Arlo Sterling"
// avatarImg   -> optional photo URL
// isOnline    -> boolean, shows/hides the green status dot
// sessionTime -> formatted string, e.g. "13:36" (mm:ss elapsed)
const ChatHeader = ({ patientName, avatarImg, isOnline, sessionTime }) => {
  return (
    <div className={`${styles.header} d-flex justify-content-between align-items-center px-3 px-md-4 py-3`}>
      <div className="d-flex align-items-center gap-3">
        <div className={styles.avatarWrap}>
          {avatarImg ? (
            <img src={avatarImg} alt={patientName} className={styles.avatar} />
          ) : (
            <div className={styles.avatar}>{patientName.charAt(0)}</div>
          )}
          {isOnline && <span className={styles.onlineDot}></span>}
        </div>

        <div>
          <p className={styles.name}>{patientName}</p>
          <p className={styles.status}>
            <i className="fa-solid fa-shield-halved me-1"></i>
            Secure Connection
          </p>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className={styles.timerBox}>
          <span className={styles.timerLabel}>SESSION TIME</span>
          <span className={styles.timerValue}>{sessionTime}</span>
        </div>

        <button className={styles.iconBtn} aria-label="More options">
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;