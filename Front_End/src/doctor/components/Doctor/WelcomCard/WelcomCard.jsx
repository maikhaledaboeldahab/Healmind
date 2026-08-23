import styles from "./WelcomCard.module.css";

const WelcomeCard = ({ doctorName = "Doctor", sessionsToday = 0 }) => {
  // Layer 3 => (Handlers)
  const onStartNextSession = () => {
    // TODO: navigate to the next session's Live Chat once sessions are wired up
    console.log("Start Next Session clicked");
  };

  const onViewDailyBriefing = () => {
    // TODO: open a daily summary modal/page
    console.log("View Daily Briefing clicked");
  };

  // Layer 4 => JSX (Re-render)
  return (
    <div className={`${styles.card} p-4 p-md-5 mb-4`}>
      <h3 className={styles.greeting}>Good morning, Dr. {doctorName}</h3>
      <p className={styles.subtext}>
        You have {sessionsToday} session{sessionsToday !== 1 ? "s" : ""}{" "}
        scheduled for today.
      </p>

      <div className="d-flex flex-wrap gap-3 mt-4">
        <button className={styles.primaryBtn} onClick={onStartNextSession}>
          Start Next Session
        </button>
        <button className={styles.ghostBtn} onClick={onViewDailyBriefing}>
          View Daily Briefing
        </button>
      </div>
    </div>
  );
};

export default WelcomeCard;