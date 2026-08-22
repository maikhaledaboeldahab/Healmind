import { useState, useEffect, useRef } from "react";
import ChatHeader from "../../components/Doctor/ChatHeader/ChatHeader";
import MessageBubble from "../../components/Doctor/MessageBubble/MessageBubble";
import ChatInput from "../../components/Doctor/ChatInput/ChatInput";
import styles from "./LiveChat.module.css";

const formatTime = (totalSeconds) => {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
};

const formatClockTime = () => {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const initialMessages = [
  { id: 1, sender: "patient", text: "Good morning, Dr. Rivers. I've been feeling a bit more anxious this week, especially in the evenings.", timestamp: "10:32 AM" },
  { id: 2, sender: "doctor", text: "Thank you for sharing that, Arlo. Can you tell me a bit more about what was happening when you noticed the anxiety?", timestamp: "10:35 AM" },
];

const LiveChat = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPatientTyping, setIsPatientTyping] = useState(true);
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");

  const messagesEndRef = useRef(null);

  // Simulates fetching the conversation history on mount.
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Demo only — hides the typing indicator after a few seconds.
  // Task 8 (Socket.IO) will replace this with a real "typing" event from the patient.
  useEffect(() => {
    const timer = setTimeout(() => setIsPatientTyping(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Auto Scroll: every time the messages list changes, scroll the newest one into view.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "doctor",
      text: inputValue,
      timestamp: formatClockTime(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
  };

  return (
    <div className="bg-white rounded-4 shadow-sm overflow-hidden d-flex flex-column" style={{ height: "75vh" }}>
      <ChatHeader patientName="Arlo Sterling" isOnline={true} sessionTime={formatTime(elapsedSeconds)} />

      <div className="flex-grow-1 p-3 p-md-4" style={{ overflowY: "auto" }}>
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: "var(--color-primary)" }} role="status"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted py-5">
            <i className="fa-regular fa-comments fa-2x mb-2"></i>
            <p>No messages yet. Say hello to start the session.</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} {...msg} />
            ))}

            {isPatientTyping && (
              <div className="d-flex justify-content-start mb-3">
                <div className={styles.typingBubble}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSend} />
    </div>
  );
};

export default LiveChat;