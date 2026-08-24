import styles from "./MessageBubble.module.css";

// Props:
// text      -> the message content
// timestamp -> e.g. "10:32 AM"
// sender    -> "doctor" | "patient" — controls alignment + color
const MessageBubble = ({ text, timestamp, sender }) => {
  const isDoctor = sender === "doctor";

  return (
    <div className={`d-flex ${isDoctor ? "justify-content-end" : "justify-content-start"} mb-3`}>
      <div className={styles.wrap}>
        <div className={`${styles.bubble} ${isDoctor ? styles.doctor : styles.patient}`}>
          {text}
        </div>
        <div className={`${styles.timestamp} ${isDoctor ? "text-end" : "text-start"}`}>
          {isDoctor && <i className="fa-solid fa-check-double me-1"></i>}
          {timestamp}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;