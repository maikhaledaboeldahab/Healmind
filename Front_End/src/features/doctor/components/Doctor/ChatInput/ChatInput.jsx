import styles from "./Chatinput.module.css";

// Props:
// value    -> current text in the input (controlled by parent)
// onChange -> called as the user types
// onSend   -> called when Enter is pressed or the send button is clicked
const ChatInput = ({ value, onChange, onSend }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`${styles.inputBar} d-flex align-items-center gap-2 p-3`}>
      <button
        className={styles.iconBtn}
        onClick={() => console.log("Emoji picker clicked")}
        aria-label="Add emoji"
      >
        <i className="fa-regular fa-face-smile"></i>
      </button>

      <button
        className={styles.iconBtn}
        onClick={() => console.log("Attachment picker clicked")}
        aria-label="Attach file"
      >
        <i className="fa-solid fa-paperclip"></i>
      </button>

      <input
        type="text"
        className={styles.textInput}
        placeholder="Type a clinical note or message..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        className={styles.sendBtn}
        onClick={onSend}
        disabled={!value.trim()}
        aria-label="Send message"
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    </div>
  );
};

export default ChatInput;