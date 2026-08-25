import { useState, useRef, useEffect } from "react";
import styles from "./Chatinput.module.css";

const commonEmojis = [
  "😊", "😃", "😌", "🙏", "👍", "❤️",
  "💡", "🧠", "🌿", "✨", "💪", "🤝",
  "🩺", "📝", "⭐", "☀️", "👏", "🌱",
  "🧘", "💬", "🌻", "🕊️", "☕", "📖"
];

// Props:
// value        -> current text in the input
// onChange     -> called as user types
// onSend       -> called with (text, attachment)
// attachedDoc  -> current attached document object
// onAttachDoc  -> setter for attached document
const ChatInput = ({ value, onChange, onSend, attachedDoc, onAttachDoc }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendClick();
    }
  };

  const handleEmojiSelect = (emoji) => {
    onChange(value + emoji);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const docData = {
        name: file.name,
        size: file.size,
        type: file.type || "application/pdf",
        url: URL.createObjectURL(file),
      };
      if (onAttachDoc) {
        onAttachDoc(docData);
      }
    }
    // reset input so same file can be chosen again if needed
    e.target.value = "";
  };

  const handleSendClick = () => {
    if (!value.trim() && !attachedDoc) return;
    onSend(value, attachedDoc);
    if (onAttachDoc) {
      onAttachDoc(null);
    }
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
    <div className="d-flex flex-column" ref={pickerRef}>
      {/* Document attachment preview chip */}
      {attachedDoc && (
        <div
          className="d-flex align-items-center justify-content-between px-3 py-2 bg-light border-top"
          style={{ fontSize: "0.8rem" }}
        >
          <div className="d-flex align-items-center gap-2 text-truncate">
            <i className="fa-solid fa-file-pdf text-danger"></i>
            <span className="fw-semibold text-truncate">{attachedDoc.name}</span>
            <span className="text-muted">({(attachedDoc.size / 1024).toFixed(1)} KB)</span>
          </div>
          <button
            type="button"
            className="btn btn-sm text-danger p-0 ms-2"
            onClick={() => onAttachDoc && onAttachDoc(null)}
            title="Remove attachment"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      <div className={`${styles.inputBar} position-relative d-flex align-items-center gap-2 p-3`}>
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

        {/* Hidden Document-only File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <button
          type="button"
          className={`${styles.iconBtn} ${attachedDoc ? styles.iconActive : ""}`}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach document"
          title="Upload Document (.pdf, .doc, .docx, .txt)"
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
          onClick={handleSendClick}
          disabled={!value.trim() && !attachedDoc}
          aria-label="Send message"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;