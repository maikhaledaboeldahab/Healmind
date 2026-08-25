import { useState, useRef, useEffect } from "react";
import styles from "./Chatinput.module.css";

const commonEmojis = [
  "😊", "😃", "😌", "🙏", "👍", "❤️",
  "💡", "🧠", "🌿", "✨", "💪", "🤝",
  "🩺", "📝", "⭐", "☀️", "👏", "🌱",
  "🧘", "💬", "🌻", "🕊️", "☕", "📖"
];

// Props:
// value    -> current text in the input (controlled by parent)
// onChange -> called as the user types
// onSend   -> called when Enter is pressed or the send button is clicked
const ChatInput = ({ value, onChange, onSend }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSend();
    }
  };

  const handleEmojiSelect = (emoji) => {
    onChange(value + emoji);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  return (
    <div className={`${styles.inputBar} position-relative d-flex align-items-center gap-2 p-3`} ref={pickerRef}>
      {showEmojiPicker && (
        <div className={styles.emojiPopover}>
          <div className={styles.emojiHeader}>Choose an Emoji</div>
          <div className={styles.emojiGrid}>
            {commonEmojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                className={styles.emojiBtn}
                onClick={() => handleEmojiSelect(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        className={`${styles.iconBtn} ${showEmojiPicker ? styles.iconActive : ""}`}
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        aria-label="Add emoji"
        title="Insert Emoji"
      >
        <i className="fa-regular fa-face-smile"></i>
      </button>

      <button
        type="button"
        className={styles.iconBtn}
        onClick={() => alert("Attachment upload dialog")}
        aria-label="Attach file"
        title="Attach File"
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
        type="button"
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