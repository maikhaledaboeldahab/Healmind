import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatHeader from "../components/Doctor/ChatHeader/ChatHeader";
import MessageBubble from "../components/Doctor/MessageBubble/MessageBubble";
import ChatInput from "../components/Doctor/ChatInput/ChatInput";
import { useAuth } from "../../../shared/context/AuthContext";
import styles from "./LiveChat.module.css";

const formatTime = (totalSeconds) => {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
};

const formatClockTime = () => {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

// Dynamic patient directory for doctor conversations
const DOCTOR_PATIENTS = [
  {
    id: "pat-01",
    patientName: "Sarah Jenkins",
    therapyType: "Cognitive Behavioral Therapy",
    avatarImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    isOnline: true,
  },
  {
    id: "pat-02",
    patientName: "Ali Hassan",
    therapyType: "Stress Management",
    avatarImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    isOnline: true,
  },
  {
    id: "pat-03",
    patientName: "Omar Khalil",
    therapyType: "Mindfulness Training",
    avatarImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    isOnline: false,
  },
  {
    id: "pat-04",
    patientName: "Arlo Sterling",
    therapyType: "Cognitive Behavioral Therapy",
    avatarImg: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces",
    isOnline: true,
  },
  {
    id: "pat-05",
    patientName: "Evelyn Thorne",
    therapyType: "Grief Counseling",
    avatarImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces",
    isOnline: false,
  },
  {
    id: "pat-06",
    patientName: "David Chen",
    therapyType: "Anxiety Management",
    avatarImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces",
    isOnline: true,
  },
];

// Initial conversation message history per patient
const INITIAL_CONVERSATIONS = {
  "pat-01": [
    { id: 1, sender: "patient", text: "Hello Doctor, I wanted to follow up on the anxiety coping strategies we discussed.", timestamp: "2:30 PM" },
    { id: 2, sender: "doctor", text: "Hello Sarah. How did the breathing exercises feel during moments of stress?", timestamp: "2:32 PM" },
    { id: 3, sender: "patient", text: "They helped reduce the panic spikes, especially before team meetings.", timestamp: "2:35 PM" },
  ],
  "pat-02": [
    { id: 1, sender: "patient", text: "Good afternoon Doctor. I've been feeling overwhelmed with work deadlines lately.", timestamp: "Yesterday" },
    { id: 2, sender: "doctor", text: "Hi Ali. Let's review your boundary setting and task prioritization in our next session.", timestamp: "Yesterday" },
  ],
  "pat-03": [
    { id: 1, sender: "patient", text: "Good morning! The mindfulness routine in the morning has been really centering.", timestamp: "10:15 AM" },
    { id: 2, sender: "doctor", text: "That is wonderful to hear, Omar. Consistency is key with mindfulness exercises.", timestamp: "10:20 AM" },
  ],
  "pat-04": [
    { id: 1, sender: "patient", text: "Good morning, Doctor. I've been feeling a bit more anxious this week, especially in the evenings.", timestamp: "10:32 AM" },
    { id: 2, sender: "doctor", text: "Thank you for sharing that, Arlo. Can you tell me a bit more about what was happening when you noticed the anxiety?", timestamp: "10:35 AM" },
  ],
  "pat-05": [
    { id: 1, sender: "patient", text: "Hi Doctor, thank you for checking in on me after our grief counseling session.", timestamp: "Oct 21" },
    { id: 2, sender: "doctor", text: "Of course, Evelyn. Be gentle with yourself and take each day step by step.", timestamp: "Oct 21" },
  ],
  "pat-06": [
    { id: 1, sender: "patient", text: "Hello Doctor, I had a quick question regarding my daily exercise schedule.", timestamp: "Oct 20" },
    { id: 2, sender: "doctor", text: "Please continue with moderate 20-minute daily walks as discussed, David.", timestamp: "Oct 20" },
  ],
};

const LiveChat = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [threads, setThreads] = useState(INITIAL_CONVERSATIONS);
  const [inputValue, setInputValue] = useState("");
  const [isPatientTyping, setIsPatientTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Match patient by id, numeric index, or name slug
  const matchedPatient = useMemo(() => {
    if (!patientId) return DOCTOR_PATIENTS[0];
    return (
      DOCTOR_PATIENTS.find(
        (p) =>
          p.id === patientId ||
          String(p.id).toLowerCase() === String(patientId).toLowerCase() ||
          p.patientName.toLowerCase().replace(/\s+/g, "-") === patientId.toLowerCase() ||
          p.patientName.toLowerCase().startsWith(patientId.toLowerCase())
      ) || DOCTOR_PATIENTS[0]
    );
  }, [patientId]);

  const selectedPatientId = matchedPatient?.id || "pat-01";
  const activePatient = matchedPatient;

  // Simulate fetching conversation history on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Session duration timer
  useEffect(() => {
    const interval = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto Scroll to bottom when active conversation messages change
  const activeMessages = useMemo(() => {
    return (
      threads[selectedPatientId] || [
        {
          id: 1,
          sender: "patient",
          text: `Hello Doctor, this is ${activePatient?.patientName}. How are you today?`,
          timestamp: "Just now",
        },
      ]
    );
  }, [threads, selectedPatientId, activePatient?.patientName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, isPatientTyping]);

  // Filtered patients for search list
  const filteredPatients = useMemo(() => {
    return DOCTOR_PATIENTS.filter(
      (p) =>
        p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.therapyType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectPatient = (id) => {
    navigate(`/doctor/livechat/${id}`);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const currentText = inputValue.trim();
    const newMessage = {
      id: Date.now(),
      sender: "doctor",
      text: currentText,
      timestamp: formatClockTime(),
    };

    setThreads((prev) => ({
      ...prev,
      [selectedPatientId]: [...(prev[selectedPatientId] || []), newMessage],
    }));
    setInputValue("");

    // Simulated patient reply for demonstration purposes
    setIsPatientTyping(true);
    setTimeout(() => {
      setIsPatientTyping(false);
      setThreads((prev) => ({
        ...prev,
        [selectedPatientId]: [
          ...(prev[selectedPatientId] || []),
          {
            id: Date.now() + 1,
            sender: "patient",
            text: "Thank you for the guidance, Doctor. I will keep you updated on my progress.",
            timestamp: formatClockTime(),
          },
        ],
      }));
    }, 1800);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Conversations List Panel */}
      <div className={styles.conversationsPanel}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>Patient Conversations</h3>
          <div className={styles.searchWrapper}>
            <i className={`fa-solid fa-search ${styles.searchIcon}`}></i>
            <input
              type="text"
              placeholder="Search patients or therapy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.conversationList}>
          {filteredPatients.map((patient) => {
            const patientThread = threads[patient.id] || [];
            const lastMessage = patientThread[patientThread.length - 1];
            const isSelected = patient.id === selectedPatientId;

            return (
              <button
                key={patient.id}
                type="button"
                className={`${styles.conversationItem} ${isSelected ? styles.activeItem : ""}`}
                onClick={() => handleSelectPatient(patient.id)}
              >
                <div className={styles.avatarWrapper}>
                  {patient.avatarImg ? (
                    <img src={patient.avatarImg} alt={patient.patientName} className={styles.avatar} />
                  ) : (
                    <div className={styles.avatar}>{patient.patientName.charAt(0)}</div>
                  )}
                  {patient.isOnline && <span className={styles.onlineDot} />}
                </div>

                <div className={styles.itemContent}>
                  <div className={styles.itemTop}>
                    <h4 className={styles.patientName}>{patient.patientName}</h4>
                    <span className={styles.time}>{lastMessage?.timestamp || "Recent"}</span>
                  </div>
                  <div className={styles.therapyType}>{patient.therapyType}</div>
                  <p className={styles.preview}>
                    {lastMessage
                      ? `${lastMessage.sender === "doctor" ? "You: " : ""}${lastMessage.text}`
                      : "Start conversation..."}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Conversation Thread */}
      <div className={styles.chatArea}>
        {activePatient ? (
          <>
            <ChatHeader
              patientName={activePatient.patientName}
              avatarImg={activePatient.avatarImg}
              isOnline={activePatient.isOnline}
              sessionTime={formatTime(elapsedSeconds)}
            />

            <div className={styles.messagesBody}>
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" style={{ color: "var(--color-primary)" }} role="status"></div>
                </div>
              ) : activeMessages.length === 0 ? (
                <div className={styles.emptyState}>
                  <i className="fa-regular fa-comments fa-2x mb-2"></i>
                  <p>No messages yet. Say hello to start the session.</p>
                </div>
              ) : (
                <>
                  {activeMessages.map((msg) => (
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
          </>
        ) : (
          <div className={styles.emptyState}>
            <i className="fa-regular fa-comments fa-2x mb-2"></i>
            <p>Select a patient from the list to view their conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChat;