import React, { useState, useEffect, useRef } from "react";
import styles from "./VideoCallModal.module.css";

const VideoCallModal = ({
  show,
  onClose,
  sessionId: initialSessionId = "6a8965eda6ce8b3fb9a9a1e8",
  patientName = "Patient",
  doctorName = "Farah",
}) => {
  const [apiBaseUrl, setApiBaseUrl] = useState("http://localhost:3000");
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [status, setStatus] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [roomName, setRoomName] = useState("");

  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  // Update initial sessionId if prop changes
  useEffect(() => {
    if (initialSessionId) {
      setSessionId(initialSessionId);
    }
  }, [initialSessionId]);

  // Load Jitsi External API Script dynamically
  useEffect(() => {
    if (!document.getElementById("jitsi-external-api-script")) {
      const script = document.createElement("script");
      script.id = "jitsi-external-api-script";
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!show) return null;

  const handleJoinCall = async () => {
    const trimmedUrl = apiBaseUrl.trim();
    const trimmedToken = token.trim();
    const trimmedSessionId = sessionId.trim();

    if (!trimmedUrl || !trimmedSessionId) {
      setStatus({ message: "من فضلك املأ كل الحقول المطلوبة.", type: "error" });
      return;
    }

    setIsLoading(true);
    setStatus({ message: "بنتأكد من صلاحية الدخول للمكالمة...", type: "loading" });

    try {
      // Try backend endpoint
      const response = await fetch(`${trimmedUrl}/api/session/${trimmedSessionId}/video-call`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${trimmedToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // Fallback for frontend demo if backend isn't running
        console.warn("Backend error, falling back to direct Jitsi room:", result.message);
        startCall(
          `healmind-session-${trimmedSessionId.slice(-6)}`,
          "meet.jit.si",
          `Dr. ${doctorName}`
        );
        return;
      }

      const { roomName: serverRoom, jitsiDomain: serverDomain, displayName: serverDisplayName } = result.data;
      startCall(serverRoom, serverDomain, serverDisplayName || `Dr. ${doctorName}`);
    } catch (err) {
      console.warn("Network error reaching backend, launching direct room for testing:", err);
      // Seamless direct launch fallback
      startCall(
        `healmind-session-${trimmedSessionId.slice(-6)}`,
        "meet.jit.si",
        `Dr. ${doctorName}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const startCall = (room, domain, displayName) => {
    setStatus({ message: "", type: "" });
    setRoomName(room);
    setIsInCall(true);

    setTimeout(() => {
      if (window.JitsiMeetExternalAPI && jitsiContainerRef.current) {
        if (jitsiApiRef.current) {
          jitsiApiRef.current.dispose();
        }

        const domainToUse = domain || "meet.jit.si";
        const api = new window.JitsiMeetExternalAPI(domainToUse, {
          roomName: room,
          parentNode: jitsiContainerRef.current,
          width: "100%",
          height: "100%",
          userInfo: {
            displayName: displayName || `Dr. ${doctorName}`,
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: true,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
          },
        });

        api.addEventListener("videoConferenceLeft", () => {
          handleLeaveCall();
        });

        jitsiApiRef.current = api;
      }
    }, 100);
  };

  const handleLeaveCall = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
    }
    setIsInCall(false);
    setIsLoading(false);
    onClose?.();
  };

  return (
    <>
      {!isInCall ? (
        <div className={styles.overlay} onClick={onClose}>
          <div className={styles.setupCard} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeSetupBtn} onClick={onClose} aria-label="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h1 className={styles.title}>Join Video Session</h1>
            <p className={styles.subtitle}>
              Session with <strong>{patientName}</strong>
            </p>

            <label className={styles.label} htmlFor="apiBaseUrl">API Base URL</label>
            <input
              id="apiBaseUrl"
              type="text"
              className={styles.input}
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
            />
            <div className={styles.hint}>مكان السيرفر بتاعك، غيّرها لو مختلفة</div>

            <label className={styles.label} htmlFor="token">Access Token</label>
            <input
              id="token"
              type="password"
              className={styles.input}
              placeholder="الـ accessToken من تسجيل الدخول"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <div className={styles.hint}>تلاقيه في رد /api/auth/login أو localStorage</div>

            <label className={styles.label} htmlFor="sessionId">Session ID</label>
            <input
              id="sessionId"
              type="text"
              className={styles.input}
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
            />
            <div className={styles.hint}>الـ _id بتاع السيشن اللي عايز تدخل الفيديو كول بتاعتها</div>

            <button
              className={styles.primaryBtn}
              onClick={handleJoinCall}
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Join Video Call"}
            </button>

            {status.message && (
              <div
                className={`${styles.statusBox} ${
                  status.type === "error" ? styles.statusBoxError : styles.statusBoxLoading
                }`}
              >
                {status.message}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.callScreen}>
          <div className={styles.topBar}>
            <span>
              <i className="fa-solid fa-circle text-danger me-2" style={{ fontSize: "0.6rem" }}></i>
              Room: <strong>{roomName}</strong> • Patient: <strong>{patientName}</strong>
            </span>
            <button className={styles.leaveBtn} onClick={handleLeaveCall}>
              Leave Call
            </button>
          </div>
          <div ref={jitsiContainerRef} className={styles.jitsiContainer}></div>
        </div>
      )}
    </>
  );
};

export default VideoCallModal;
