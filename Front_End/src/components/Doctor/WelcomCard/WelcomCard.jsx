import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../UI/ConfirmModal/ConfirmModal";
import styles from "./WelcomCard.module.css";

const WelcomeCard = ({ doctorName = "Doctor", sessionsToday = 0 }) => {
  const navigate = useNavigate();
  const [showBriefing, setShowBriefing] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const onStartNextSession = () => {
    navigate("/doctor/livechat");
  };

  const onViewDailyBriefing = () => {
    setShowBriefing(true);
  };

  return (
    <div className={`${styles.card} p-4 p-md-5 mb-4`}>
      <h3 className={styles.greeting}>
        {getGreeting()}, Dr. {doctorName}
      </h3>
      <p className={styles.subtext}>
        You have {sessionsToday} session{sessionsToday !== 1 ? "s" : ""}{" "}
        scheduled for today.
      </p>

      <div className="d-flex flex-wrap gap-3 mt-4">
        <button className={styles.primaryBtn} onClick={onStartNextSession}>
          <i className="fa-solid fa-play me-2"></i>
          Start Next Session
        </button>
        <button className={styles.ghostBtn} onClick={onViewDailyBriefing}>
          <i className="fa-solid fa-clipboard-list me-2"></i>
          View Daily Briefing
        </button>
      </div>

      <ConfirmModal
        show={showBriefing}
        title="📋 Daily Clinical Briefing"
        message={`Hello Dr. ${doctorName}, you have ${sessionsToday} session${sessionsToday !== 1 ? "s" : ""} scheduled for today. Make sure to review any pending session requests before your afternoon appointments.`}
        confirmText="Got it"
        confirmColor="primary"
        onConfirm={() => setShowBriefing(false)}
        onCancel={() => setShowBriefing(false)}
      />
    </div>
  );
};

export default WelcomeCard;