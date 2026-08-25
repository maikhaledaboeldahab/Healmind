import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ChatHeader from "../../components/Doctor/ChatHeader/ChatHeader";
import MessageBubble from "../../components/Doctor/MessageBubble/MessageBubble";
import ChatInput from "../../components/Doctor/ChatInput/ChatInput";
import ConfirmModal from "../../components/UI/ConfirmModal/ConfirmModal";
import styles from "./LiveChat.module.css";

const formatTime = (totalSeconds) => {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
};

const formatClockTime = () => {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const patientsList = [
  { id: 1, name: "Arlo Sterling", isOnline: true, lastMsg: "Good morning, Dr. Rivers...", lastTime: "10:32 AM" },
  { id: 2, name: "Sarah Jenkins", isOnline: false, lastMsg: "Session notes received, thank you!", lastTime: "Yesterday" },
  { id: 3, name: "Omar Khalil", isOnline: true, lastMsg: "Can we review the stress management plan?", lastTime: "09:15 AM" },
  { id: 4, name: "David Chen", isOnline: false, lastMsg: "Thank you doctor.", lastTime: "Oct 20" },
];

const initialConversations = {
  "Arlo Sterling": [
    { id: 1, sender: "patient", text: "Good morning, Dr. Rivers. I've been feeling a bit more anxious this week, especially in the evenings.", timestamp: "10:32 AM" },
    { id: 2, sender: "doctor", text: "Thank you for sharing that, Arlo. Can you tell me a bit more about what was happening when you noticed the anxiety?", timestamp: "10:35 AM" },
  ],
  "Sarah Jenkins": [
    { id: 1, sender: "doctor", text: "Hi Sarah, how have the grounding exercises been going this week?", timestamp: "Yesterday" },
    { id: 2, sender: "patient", text: "Session notes received, thank you! They've been very helpful.", timestamp: "Yesterday" },
  ],
  "Omar Khalil": [
    { id: 1, sender: "patient", text: "Can we review the stress management plan during our next call?", timestamp: "09:15 AM" },
  ],
  "David Chen": [
    { id: 1, sender: "doctor", text: "David, please let me know if the medication adjustment helped.", timestamp: "Oct 20" },
    { id: 2, sender: "patient", text: "Thank you doctor. Feeling much more stable.", timestamp: "Oct 20" },
  ],
};

const LiveChat = () => {
  const location = useLocation();
  const [selectedPatient, setSelectedPatient] = useState(() => {
    const passedName = location.state?.patientName;
    if (passedName) {
      return patientsList.find((p) => p.name === passedName) || null;
    }
    return null; // Start with no patient selected
  });

  const [isLoading, setIsLoading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPatientTyping, setIsPatientTyping] = useState(false);
  const [conversations, setConversations] = useState(initialConversations);
  const [inputValue, setInputValue] = useState("");
  const [showEndModal, setShowEndModal] = useState(false);
  const [recordedSummary, setRecordedSummary] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([
    { id: 101, patientName: "Arlo Sterling", date: "Oct 24, 2023", duration: "45 mins", type: "Live Chat Session" },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (location.state?.patientName) {
      const found = patientsList.find((p) => p.name === location.state.patientName);
      if (found) {
        setSelectedPatient(found);
        setElapsedSeconds(0);
        setIsTimerRunning(true);
      }
    }
  }, [location.state]);

  // Timer: counts only when a patient is selected and timer is running
  useEffect(() => {
    if (!isTimerRunning || !selectedPatient) return;
    const interval = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, selectedPatient]);

  // Auto Scroll
  const currentMessages = selectedPatient ? conversations[selectedPatient.name] || [] : [];
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    setIsLoading(true);
    setRecordedSummary(null);
    setTimeout(() => setIsLoading(false), 400);
  };

  const handleSend = () => {
    if (!inputValue.trim() || !selectedPatient) return;

    const newMessage = {
      id: Date.now(),
      sender: "doctor",
      text: inputValue,
      timestamp: formatClockTime(),
    };

    setConversations((prev) => ({
      ...prev,
      [selectedPatient.name]: [...(prev[selectedPatient.name] || []), newMessage],
    }));
    setInputValue("");
  };

  const handleEndChatClick = () => {
    setIsTimerRunning(false);
    setShowEndModal(true);
  };

  const handleConfirmEndSession = () => {
    const finalDuration = formatTime(elapsedSeconds);
    const pName = selectedPatient.name;

    const newRecord = {
      id: Date.now(),
      patientName: pName,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      duration: `${finalDuration}`,
      type: "Live Chat Session",
    };

    setHistoryRecords((prev) => [newRecord, ...prev]);
    setRecordedSummary(`✓ Session with ${pName} concluded. Duration (${finalDuration}) was successfully logged to the patient clinical record.`);
    setShowEndModal(false);
    setSelectedPatient(null);
    setElapsedSeconds(0);
    setIsTimerRunning(false);
  };

  const handleCancelEndSession = () => {
    setShowEndModal(false);
    setIsTimerRunning(true);
  };

  return (
    <div className="row g-3" style={{ height: "calc(100vh - 160px)", minHeight: "580px" }}>
      {/* Left Column: Patients List */}
      <div className="col-12 col-md-4 col-lg-3 h-100">
        <div className="bg-white rounded-4 shadow-sm p-3 h-100 d-flex flex-column">
          <div className="mb-3">
            <h5 className="fw-bold mb-1" style={{ fontSize: "1rem" }}>
              Active Patients
            </h5>
            <p className="text-muted small mb-0">Select a patient to start chat</p>
          </div>

          <div className={`${styles.patientList} flex-grow-1 overflow-auto`}>
            {patientsList.map((patient) => {
              const isSelected = selectedPatient && patient.name === selectedPatient.name;
              return (
                <div
                  key={patient.id}
                  className={`${styles.patientItem} ${isSelected ? styles.patientSelected : ""} p-2 mb-2 rounded-3 d-flex align-items-center gap-2`}
                  onClick={() => handleSelectPatient(patient)}
                >
                  <div className="position-relative">
                    <div className={styles.patientAvatar}>{patient.name.charAt(0)}</div>
                    {patient.isOnline && <span className={styles.onlineBadge}></span>}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold small text-truncate">{patient.name}</span>
                      <span className="text-muted" style={{ fontSize: "0.65rem" }}>
                        {patient.lastTime}
                      </span>
                    </div>
                    <p className="text-muted text-truncate mb-0" style={{ fontSize: "0.75rem" }}>
                      {patient.lastMsg}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Logged Session History */}
          <div className="border-top pt-2 mt-2">
            <span className="text-muted fw-bold text-uppercase" style={{ fontSize: "0.65rem" }}>
              Recently Logged Sessions
            </span>
            <div className="overflow-auto mt-1" style={{ maxHeight: "100px" }}>
              {historyRecords.map((rec) => (
                <div key={rec.id} className="d-flex justify-content-between align-items-center py-1" style={{ fontSize: "0.75rem" }}>
                  <span className="text-truncate fw-semibold">{rec.patientName}</span>
                  <span className="badge bg-light text-dark">{rec.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Chat Window or Placeholder */}
      <div className="col-12 col-md-8 col-lg-9 h-100">
        <div className="bg-white rounded-4 shadow-sm overflow-hidden d-flex flex-column h-100">
          {recordedSummary && (
            <div className="alert alert-success alert-dismissible m-3 mb-0 py-2 px-3 small d-flex align-items-center justify-content-between" role="alert">
              <span><i className="fa-solid fa-circle-check me-2"></i>{recordedSummary}</span>
              <button type="button" className="btn-close p-2" onClick={() => setRecordedSummary(null)}></button>
            </div>
          )}

          {selectedPatient ? (
            <>
              <ChatHeader
                patientName={selectedPatient.name}
                isOnline={selectedPatient.isOnline}
                sessionTime={formatTime(elapsedSeconds)}
                onEndChat={handleEndChatClick}
              />

              <div className="flex-grow-1 p-3 p-md-4" style={{ overflowY: "auto" }}>
                {isLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border" style={{ color: "var(--color-primary)" }} role="status"></div>
                  </div>
                ) : currentMessages.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <i className="fa-regular fa-comments fa-2x mb-2"></i>
                    <p>No messages yet. Say hello to start the session.</p>
                  </div>
                ) : (
                  <>
                    {currentMessages.map((msg) => (
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
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center p-4">
              <div
                className="mb-3"
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-surface-container-high, #e8ede8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="fa-regular fa-comments fa-2x" style={{ color: "var(--color-primary, #1e4d2b)" }}></i>
              </div>
              <h5 className="fw-bold mb-1">No Active Chat Selected</h5>
              <p className="text-muted small mb-0" style={{ maxWidth: "360px" }}>
                Please select a patient from the list on the left to start a real-time clinical conversation and track session time.
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedPatient && (
        <ConfirmModal
          show={showEndModal}
          title="End Live Chat Session"
          message={`Are you sure you want to end the session with ${selectedPatient.name}? Total time elapsed: ${formatTime(elapsedSeconds)}. This duration will be recorded in the patient history.`}
          confirmText="End & Record Time"
          confirmColor="error"
          onConfirm={handleConfirmEndSession}
          onCancel={handleCancelEndSession}
        />
      )}
    </div>
  );
};

export default LiveChat;