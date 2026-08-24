import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPaperclip,
  faPaperPlane,
  faCircle,
  faCalendarCheck,
  faArrowLeft,
  faUserDoctor,
} from '@fortawesome/free-solid-svg-icons';
import { upcomingSessions, sessionHistory } from '../../../../data/sessions';
import { doctors, getDoctorById } from '../../../../data/doctors';
import Button from '../../../../shared/components/Button/Button';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import styles from './Messages.module.css';

// Default initial message templates per doctor
const DEFAULT_CONVERSATIONS = {
  'doc-01': [
    { id: 1, from: 'doctor', text: "Hello! Looking forward to our consultation. How have your anxiety levels been this week?", time: '09:00 AM' },
    { id: 2, from: 'patient', text: "Hi Dr. Jenkins, thanks for asking. It's been manageable, though work was a bit stressful on Wednesday.", time: '09:05 AM' },
    { id: 3, from: 'doctor', text: "Noted. We will focus on some practical boundary-setting techniques during our upcoming session.", time: '09:12 AM' },
  ],
  'doc-03': [
    { id: 1, from: 'doctor', text: "Hi! Just checking in — were you able to try the CBT daily reframing exercises we discussed?", time: 'Yesterday' },
    { id: 2, from: 'patient', text: "Yes! Writing them down in the morning helped me catch negative thought loops before they spiraled.", time: 'Yesterday' },
  ],
  'doc-02': [
    { id: 1, from: 'doctor', text: "Thank you for attending our previous session. Your session report and action items have been updated.", time: '3d ago' },
  ],
};

export default function Messages() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  // Find unique doctors associated with patient from upcoming and past sessions
  const associatedDoctorIds = useMemo(() => {
    const ids = new Set();
    upcomingSessions.forEach((s) => s.doctorId && ids.add(s.doctorId));
    sessionHistory.forEach((s) => s.doctorId && ids.add(s.doctorId));
    return Array.from(ids);
  }, []);

  const conversationDoctors = useMemo(() => {
    if (associatedDoctorIds.length > 0) {
      return associatedDoctorIds.map((id) => getDoctorById(id)).filter(Boolean);
    }
    // Fallback to top doctors if no prior bookings exist
    return doctors.slice(0, 3);
  }, [associatedDoctorIds]);

  // Selected doctor state (from URL parameter or first associated doctor)
  const initialDoctorId = doctorId || conversationDoctors[0]?.id || 'doc-01';
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctorId);
  const [searchQuery, setSearchQuery] = useState('');
  const [threads, setThreads] = useState(DEFAULT_CONVERSATIONS);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (doctorId && doctorId !== selectedDoctorId) {
      setSelectedDoctorId(doctorId);
    }
  }, [doctorId, selectedDoctorId]);

  const activeDoctor = getDoctorById(selectedDoctorId) || conversationDoctors[0];
  const activeMessages = threads[selectedDoctorId] || [
    { id: 1, from: 'doctor', text: `Hi, I am ${activeDoctor?.name}. How can I assist you with your mental wellness today?`, time: 'Just now' },
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const filteredDoctors = conversationDoctors.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectDoctor = (docId) => {
    setSelectedDoctorId(docId);
    navigate(`/messages/${docId}`);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;

    const newMsg = {
      id: Date.now(),
      from: 'patient',
      text: draft.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setThreads((prev) => ({
      ...prev,
      [selectedDoctorId]: [...(prev[selectedDoctorId] || []), newMsg],
    }));
    setDraft('');

    // Simulated doctor reply after a short delay
    setTimeout(() => {
      setThreads((prev) => ({
        ...prev,
        [selectedDoctorId]: [
          ...(prev[selectedDoctorId] || []),
          {
            id: Date.now() + 1,
            from: 'doctor',
            text: 'Thank you for reaching out. I have received your message and will review it.',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));
    }, 1200);
  };

  if (!conversationDoctors.length) {
    return (
      <EmptyState
        title="No conversations yet"
        description="Connect with a licensed specialist to start a conversation."
        action={<Button onClick={() => navigate('/doctors')}>Browse Doctors</Button>}
      />
    );
  }

  return (
    <div className={styles.page}>
      {/* Conversations List Panel */}
      <div className={styles.conversationsPanel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Messages</h2>
          <div className={styles.searchWrapper}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.conversationList}>
          {filteredDoctors.map((doc) => {
            const docThread = threads[doc.id] || [];
            const lastMessage = docThread[docThread.length - 1];
            const isSelected = doc.id === selectedDoctorId;

            return (
              <button
                key={doc.id}
                type="button"
                className={`${styles.conversationItem} ${isSelected ? styles.activeItem : ''}`}
                onClick={() => handleSelectDoctor(doc.id)}
              >
                <div className={styles.avatarWrapper}>
                  <img src={doc.image} alt={doc.name} className={styles.avatar} />
                  <span className={styles.onlineIndicator} />
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemTop}>
                    <h4 className={styles.doctorName}>{doc.name}</h4>
                    <span className={styles.time}>{lastMessage?.time || 'Recent'}</span>
                  </div>
                  <div className={styles.specialization}>{doc.specialization}</div>
                  <p className={styles.preview}>
                    {lastMessage ? `${lastMessage.from === 'patient' ? 'You: ' : ''}${lastMessage.text}` : 'Start conversation...'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Conversation Thread */}
      <div className={styles.chatArea}>
        {activeDoctor ? (
          <>
            <header className={styles.chatHeader}>
              <div className={styles.headerDoctorInfo}>
                <img src={activeDoctor.image} alt={activeDoctor.name} className={styles.headerAvatar} />
                <div>
                  <h3 className={styles.headerTitle}>{activeDoctor.name}</h3>
                  <div className={styles.headerStatus}>
                    <FontAwesomeIcon icon={faCircle} className={styles.statusDot} />
                    <span>{activeDoctor.specialization} &bull; Online</span>
                  </div>
                </div>
              </div>

              <div className={styles.headerActions}>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<FontAwesomeIcon icon={faUserDoctor} />}
                  onClick={() => navigate(`/doctors/${activeDoctor.id}`)}
                >
                  View Profile
                </Button>
                <Button
                  size="sm"
                  icon={<FontAwesomeIcon icon={faCalendarCheck} />}
                  onClick={() => navigate(`/doctors/${activeDoctor.id}/book`)}
                >
                  Book Session
                </Button>
              </div>
            </header>

            <div className={styles.thread}>
              {activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={msg.from === 'patient' ? styles.bubblePatient : styles.bubbleDoctor}
                >
                  <p>{msg.text}</p>
                  <span className={styles.bubbleTime}>{msg.time}</span>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <form className={styles.composer} onSubmit={handleSendMessage}>
              <button type="button" className={styles.attachBtn} aria-label="Attach file">
                <FontAwesomeIcon icon={faPaperclip} />
              </button>
              <input
                type="text"
                placeholder={`Message ${activeDoctor.name}...`}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className={styles.input}
              />
              <button type="submit" className={styles.sendBtn} disabled={!draft.trim()} aria-label="Send message">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </>
        ) : (
          <EmptyState title="Select a conversation" description="Choose a doctor from the list to start messaging." />
        )}
      </div>
    </div>
  );
}
