import { useState, useEffect } from "react";
import ChatHeader from "../../components/Doctor/ChatHeader/ChatHeader";

const formatTime = (totalSeconds) => {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
};

const LiveChat = () => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-4 shadow-sm overflow-hidden">
      <ChatHeader patientName="Arlo Sterling" isOnline={true} sessionTime={formatTime(elapsedSeconds)} />
      <div className="p-4 text-muted">Chat messages will go here next.</div>
    </div>
  );
};

export default LiveChat;