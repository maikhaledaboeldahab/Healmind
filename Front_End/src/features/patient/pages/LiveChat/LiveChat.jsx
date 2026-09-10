import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faPaperPlane, faCircle } from '@fortawesome/free-solid-svg-icons';
import api from '../../../../shared/services/api';
import styles from './LiveChat.module.css';

const INITIAL_MESSAGES = [
  { id: 1, from: 'doctor', text: "Hi! I'm glad you're here. How have you been feeling this week?", time: '09:00 AM' },
  { id: 2, from: 'patient', text: "Hi doctor, honestly it's been a bit better than last week.", time: '09:01 AM' },
];

export default function LiveChat() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadSession() {
      try {
        const res = await api.get(`/session/${sessionId}`);
        if (mounted) setSession(res.data?.data || res.data);
      } catch {
        // Ignore error
      }
    }
    if (sessionId) loadSession();
    return () => {
      mounted = false;
    };
  }, [sessionId]);

  const doctor = session?.doctorId || {
    name: session?.doctorName || 'Your Specialist',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop&crop=faces',
  };

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const threadRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTo({
        top: threadRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const newMessage = {
      id: Date.now(),
      from: 'patient',
      text: draft.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setDraft('');

    // Simulated doctor reply for UI demo purposes.
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'doctor',
          text: "Thanks for sharing that. Let's explore it a bit more.",
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <img
          src={doctor?.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop&crop=faces'}
          alt={doctor?.name}
          className={styles.avatar}
        />
        <div>
          <h2>{doctor?.name || 'Your Specialist'}</h2>
          <p className={styles.status}>
            <FontAwesomeIcon icon={faCircle} className={styles.onlineDot} /> Online
          </p>
        </div>
      </header>

      <div className={styles.thread} ref={threadRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={message.from === 'patient' ? styles.bubblePatient : styles.bubbleDoctor}
          >
            <p>{message.text}</p>
            <span className={styles.time}>{message.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className={styles.composer} onSubmit={sendMessage}>
        <button type="button" className={styles.attachBtn} aria-label="Attach file">
          <FontAwesomeIcon icon={faPaperclip} />
        </button>
        <input
          type="text"
          placeholder="Type your message..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className={styles.sendBtn} aria-label="Send message">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
}
