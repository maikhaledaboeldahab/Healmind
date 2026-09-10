import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ChatHeader from "../components/Doctor/ChatHeader/ChatHeader";
import MessageBubble from "../components/Doctor/MessageBubble/MessageBubble";
import ChatInput from "../components/Doctor/ChatInput/ChatInput";
import { useDoctor } from "../context/DoctorContext";
import api from "../../../shared/services/api";
import { getSocket, connectSocket } from "../../../shared/services/socket";
import styles from "./LiveChat.module.css";

const formatTime = (totalSeconds) => {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
};

const formatClockTime = () => {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const initialConversations = {
  "Arlo Sterling": [
    { id: 1, sender: "patient", text: "Good morning, Dr. Farah. I've been feeling a bit more anxious this week, especially in the evenings.", timestamp: "10:32 AM" },
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
  const { patients, addPatientSessionHistory } = useDoctor();
  const [extraPatients, setExtraPatients] = useState([]);

  // Load real backend conversations on mount
  useEffect(() => {
    let isMounted = true;
    api.get("/conversations").then((res) => {
      if (!isMounted) return;
      const raw = res.data?.data || res.data || [];
      if (Array.isArray(raw)) {
        const fetchedPatients = raw
          .filter((conv) => conv.otherUser)
          .map((conv, idx) => ({
            id: conv.otherUser._id || conv.otherUser.id,
            name: conv.otherUser.name || "Patient",
            isOnline: idx % 2 === 0,
            lastMsg: conv.lastMessageText || "Active conversation",
            lastTime: conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "Today",
            lastMessageAt: new Date(conv.lastMessageAt || 0).getTime(),
          }));
        setExtraPatients(fetchedPatients);
      }
    }).catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Merge patients from DoctorContext and fetched/incoming patients
  const basePatientList = patients.map((p, index) => ({
    id: p.id,
    name: p.patientName,
    isOnline: index % 2 === 0,
    lastMsg: p.notes?.[0]?.text || "Ready for consultation...",
    lastTime: p.lastSession || "Today",
    lastMessageAt: p.lastMessageAt ? new Date(p.lastMessageAt).getTime() : 0,
  }));

  const dynamicPatientList = [...basePatientList];
  extraPatients.forEach((ep) => {
    const existingIndex = dynamicPatientList.findIndex((p) => p.id === ep.id || p.name === ep.name);
    if (existingIndex === -1) {
      dynamicPatientList.push(ep);
    } else if (ep.lastMessageAt > dynamicPatientList[existingIndex].lastMessageAt) {
      dynamicPatientList[existingIndex] = {
        ...dynamicPatientList[existingIndex],
        ...ep,
      };
    }
  });
  dynamicPatientList.sort((patientA, patientB) => patientB.lastMessageAt - patientA.lastMessageAt);

  const [selectedPatient, setSelectedPatient] = useState(() => {
    const passedName = location.state?.patientName;
    if (passedName) {
      return dynamicPatientList.find((p) => p.name === passedName) || null;
    }
    return null; // Start with no active chat selected
  });

  const [isLoading, setIsLoading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(() => Boolean(location.state?.patientName));
  const [isPatientTyping, setIsPatientTyping] = useState(false);
  const [conversations, setConversations] = useState(initialConversations);
  const [inputValue, setInputValue] = useState("");
  const [attachedDoc, setAttachedDoc] = useState(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [sessionNote, setSessionNote] = useState("");
  const [recordedSummary, setRecordedSummary] = useState(null);

  const messagesEndRef = useRef(null);
  const messageThreadRef = useRef(null);

  // Socket listener for incoming patient messages
  useEffect(() => {
    const token = window.localStorage.getItem("healmind_token");
    if (token) connectSocket(token);

    const socket = getSocket();
    const handleReceiveMessage = (msgData) => {
      if (!msgData) return;

      const newMsg = {
        id: msgData.messageId || Date.now(),
        sender: msgData.senderRole || "patient",
        text: msgData.message,
        timestampValue: new Date(msgData.timestamp || Date.now()).getTime(),
        timestamp: formatClockTime(),
      };

      const pId = msgData.senderId;
      const pName = msgData.senderName || "Patient";

      // Add to patient list if missing
      setExtraPatients((prev) => {
        const incomingPatient = {
          id: pId,
          name: pName,
          isOnline: true,
          lastMsg: msgData.message,
          lastTime: "Just now",
          lastMessageAt: newMsg.timestampValue,
        };
        const existingIndex = prev.findIndex((p) => p.id === pId || p.name === pName);
        if (existingIndex === -1) {
          return [...prev, incomingPatient];
        }
        return prev.map((patient, index) => (
          index === existingIndex ? { ...patient, ...incomingPatient } : patient
        ));
      });

      setConversations((prev) => {
        const existingIdMsgs = prev[pId] || [];
        const existingNameMsgs = prev[pName] || [];
        const mergedMsgs = existingIdMsgs.length ? existingIdMsgs : existingNameMsgs;

        return {
          ...prev,
          [pId]: [...mergedMsgs, newMsg],
          [pName]: [...mergedMsgs, newMsg],
        };
      });

      // Auto select incoming patient if none selected
      setSelectedPatient((curr) => {
        if (!curr) {
          return { id: pId, name: pName, isOnline: true, lastMsg: msgData.message, lastTime: "Just now" };
        }
        return curr;
      });
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  // Sync selected patient from location state (e.g. from notification click)
  useEffect(() => {
    const pName = location.state?.patientName;
    const pId = location.state?.patientId;
    if (pName || pId) {
      const found = dynamicPatientList.find((p) => (pId && p.id === pId) || (pName && p.name === pName));
      if (found) {
        setSelectedPatient(found);
        setElapsedSeconds(0);
        setIsTimerRunning(true);
      } else {
        const newP = { id: pId || Date.now(), name: pName || "Patient", isOnline: true, lastMsg: "Active chat", lastTime: "Just now" };
        setSelectedPatient(newP);
        setExtraPatients((prev) => [...prev, newP]);
      }
    }
  }, [location.state]);

  // Load message history from backend whenever selected patient changes
  useEffect(() => {
    if (!selectedPatient) return;
    let isMounted = true;
    api.get("/conversations").then((res) => {
      if (!isMounted) return;
      const raw = res.data?.data || res.data || [];
      const conv = raw.find((c) => c.otherUser && (c.otherUser._id === selectedPatient.id || c.otherUser.name === selectedPatient.name));
      if (conv?.conversationId) {
        api.get(`/conversations/${conv.conversationId}/messages`).then((mRes) => {
          if (!isMounted) return;
          const rawMsgs = mRes.data?.data || mRes.data || [];
          if (Array.isArray(rawMsgs) && rawMsgs.length > 0) {
            const formatted = rawMsgs.map((m) => ({
              id: m._id || m.id,
              sender: (m.senderModel === "doctor" || m.sender?.role === "doctor" || m.sender?._id === selectedPatient.id) ? (m.senderModel === "doctor" ? "doctor" : "patient") : "patient",
              text: m.message,
              timestamp: new Date(m.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            }));
            setConversations((prev) => ({
              ...prev,
              [selectedPatient.id]: formatted,
              [selectedPatient.name]: formatted,
            }));
          }
        }).catch(() => {});
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [selectedPatient?.id, selectedPatient?.name]);

  // Timer
  useEffect(() => {
    if (!isTimerRunning || !selectedPatient) return;
    const interval = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, selectedPatient]);

  // Auto Scroll
  const currentMessages = selectedPatient
    ? conversations[selectedPatient.id] || conversations[selectedPatient.name] || []
    : [];

  useEffect(() => {
    if (messageThreadRef.current) {
      messageThreadRef.current.scrollTo({
        top: messageThreadRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [currentMessages]);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    setIsLoading(true);
    setRecordedSummary(null);
    setAttachedDoc(null);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleSend = (text, doc) => {
    if ((!text || !text.trim()) && !doc) return;
    if (!selectedPatient) return;

    const messageText = text?.trim() || "";
    const newMessage = {
      id: Date.now(),
      sender: "doctor",
      text: messageText,
      timestampValue: Date.now(),
      attachment: doc || null,
      timestamp: formatClockTime(),
    };

    setExtraPatients((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === selectedPatient.id || p.name === selectedPatient.name);
      const updatedPatient = {
        ...selectedPatient,
        lastMsg: messageText || "Attachment sent",
        lastTime: "Just now",
        lastMessageAt: newMessage.timestampValue,
      };
      if (existingIndex === -1) return [...prev, updatedPatient];
      return prev.map((patient, index) => (
        index === existingIndex ? { ...patient, ...updatedPatient } : patient
      ));
    });

    setConversations((prev) => {
      const existingIdMsgs = prev[selectedPatient.id] || [];
      const existingNameMsgs = prev[selectedPatient.name] || [];
      const merged = existingIdMsgs.length ? existingIdMsgs : existingNameMsgs;

      return {
        ...prev,
        [selectedPatient.id]: [...merged, newMessage],
        [selectedPatient.name]: [...merged, newMessage],
      };
    });
    setInputValue("");
    setAttachedDoc(null);

    // Send via socket to patient
    const token = window.localStorage.getItem("healmind_token");
    if (token) connectSocket(token);
    const socket = getSocket();
    socket.emit("send_message", {
      receiverId: selectedPatient.id,
      receiverModel: "patient",
      message: messageText,
    });
  };

  const handleEndChatClick = () => {
    setIsTimerRunning(false);
    setSessionNote(`Live consultation session completed. Patient responded well to discussed coping strategies.`);
    setShowEndModal(true);
  };

  const handleConfirmEndSession = () => {
    const finalDuration = formatTime(elapsedSeconds);
    const pName = selectedPatient.name;

    // Automatically record session log into patient history
    addPatientSessionHistory(pName, {
      duration: finalDuration,
      note: sessionNote.trim() || "Live chat consultation completed.",
      title: "Live Chat Consultation",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    });

    setRecordedSummary(`✓ Session with ${pName} concluded. Duration (${finalDuration}) and clinical notes were saved to ${pName}'s history.`);
    setShowEndModal(false);
    setElapsedSeconds(0);
    setIsTimerRunning(false);
  };

  const handleCancelEndSession = () => {
    setShowEndModal(false);
    setIsTimerRunning(true);
  };

  return (
    <div className={`row g-3 ${styles.chatPage}`}>
      {/* Left Column: Patients List */}
      <div className="col-12 col-md-4 col-lg-3 h-100">
        <div className="bg-white rounded-4 shadow-sm p-3 h-100 d-flex flex-column">
          <div className="mb-3">
            <h5 className="fw-bold mb-1" style={{ fontSize: "1rem" }}>
              Active Patients ({dynamicPatientList.length})
            </h5>
            <p className="text-muted small mb-0">Select a patient to start consultation</p>
          </div>

          <div className={`${styles.patientList} flex-grow-1 overflow-auto`}>
            {dynamicPatientList.map((patient) => {
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

              <div ref={messageThreadRef} className={`flex-grow-1 p-3 p-md-4 ${styles.messageThread}`}>
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

              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSend}
                attachedDoc={attachedDoc}
                onAttachDoc={setAttachedDoc}
              />
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

      {/* End Chat Modal with Clinical Notes Logging */}
      {showEndModal && selectedPatient && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1070,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            className="bg-white rounded-4 shadow-lg p-4"
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <div className="d-flex align-items-center gap-2 mb-3 text-danger">
              <i className="fa-solid fa-clipboard-check fa-lg"></i>
              <h5 className="fw-bold mb-0">End Consultation & Save History</h5>
            </div>

            <p className="small text-muted mb-3">
              Ending chat session with <strong>{selectedPatient.name}</strong>. Total session duration:{" "}
              <span className="badge bg-light text-dark">{formatTime(elapsedSeconds)}</span>.
            </p>

            <div className="mb-3">
              <label className="form-label small fw-bold">Clinical Session Note / Summary:</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Enter summary or notes for this patient's medical history..."
                value={sessionNote}
                onChange={(e) => setSessionNote(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleCancelEndSession}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={handleConfirmEndSession}
              >
                <i className="fa-solid fa-save me-1"></i> Save to Patient History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChat;