import styles from "./MessageBubble.module.css";

// Props:
// text        -> the message content
// timestamp   -> e.g. "10:32 AM"
// sender      -> "doctor" | "patient" — controls alignment + color
// attachment  -> optional { name, size, type, url }
const MessageBubble = ({ text, timestamp, sender, attachment }) => {
  const isDoctor = sender === "doctor";

  return (
    <div className={`d-flex ${isDoctor ? "justify-content-end" : "justify-content-start"} mb-3`}>
      <div className={styles.wrap} style={{ maxWidth: "80%" }}>
        <div className={`${styles.bubble} ${isDoctor ? styles.doctor : styles.patient}`}>
          {attachment && (
            <div
              className="d-flex align-items-center gap-2 p-2 mb-2 rounded-3"
              style={{
                backgroundColor: isDoctor ? "rgba(255, 255, 255, 0.18)" : "rgba(0, 0, 0, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <i className="fa-solid fa-file-pdf fa-lg text-danger"></i>
              <div className="flex-grow-1 overflow-hidden" style={{ minWidth: "120px" }}>
                <div className="small fw-bold text-truncate" style={{ fontSize: "0.8rem" }}>
                  {attachment.name}
                </div>
                {attachment.size && (
                  <div style={{ fontSize: "0.65rem", opacity: 0.8 }}>
                    {(attachment.size / 1024).toFixed(1)} KB • Document
                  </div>
                )}
              </div>
              {attachment.url && (
                <a
                  href={attachment.url}
                  download={attachment.name}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm p-1 text-white"
                  title="Download / View document"
                >
                  <i className="fa-solid fa-download"></i>
                </a>
              )}
            </div>
          )}
          {text && <div>{text}</div>}
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