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
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import api from '../../../../shared/services/api';
import { getEligibleDoctorSession } from '../../../../shared/utils/videoWindow';
import Button from '../../../../shared/components/Button/Button';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import styles from './Messages.module.css';

export default function Messages() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [conversationDoctors, setConversationDoctors] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [threads, setThreads] = useState({});
  const [draft, setDraft] = useState('');
  const bottomRef = useRef(null);

  // Real-time interval to smoothly update video call window eligibility
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [docsRes, sessRes] = await Promise.all([
          api.get('/doctor/list').catch(() => api.get('/admin/doctors')),
          api.get('/session/my-sessions').catch(() => ({ data: [] })),
        ]);

        const rawDocs = docsRes.data?.data || docsRes.data || [];
        const rawSess = sessRes.data?.data || sessRes.data?.sessions || sessRes.data || [];

        if (mounted) {
          const docs = Array.isArray(rawDocs)
            ? rawDocs.map((d) => ({
                id: d._id || d.id,
                name: d.name || d.fullName || 'Doctor',
                specialization: d.specialization || 'Mental Health Specialist',
                image: d.profileImage || 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=faces',
              }))
            : [];
          setConversationDoctors(docs);
          setAllSessions(Array.isArray(rawSess) ? rawSess : []);
          if (!selectedDoctorId && docs.length > 0) {
            setSelectedDoctorId(docs[0].id);
          }
        }
      } catch {
        if (mounted) {
          setConversationDoctors([]);
          setAllSessions([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (doctorId && doctorId !== selectedDoctorId) {
      setSelectedDoctorId(doctorId);
    }
  }, [doctorId, selectedDoctorId]);

  const activeDoctor = conversationDoctors.find((d) => d.id === selectedDoctorId) || conversationDoctors[0];
  const activeMessages = threads[selectedDoctorId] || [
    { id: 1, from: 'doctor', text: `Hi, I am ${activeDoctor?.name || 'Doctor'}. How can I assist you with your mental wellness today?`, time: 'Just now' },
  ];

  // Video call eligibility with active doctor
  const videoEligibility = useMemo(() => {
    if (!activeDoctor?.id) return { isAvailable: false, status: 'inactive', session: null };
    return getEligibleDoctorSession(allSessions, activeDoctor.id, currentTime);
  }, [allSessions, activeDoctor?.id, currentTime]);

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
                {videoEligibility.isAvailable && videoEligibility.session && (
                  <Button
                    size="sm"
                    className={styles.videoJoinBtn}
                    icon={<FontAwesomeIcon icon={faVideo} />}
                    onClick={() => navigate(`/sessions/${videoEligibility.session.id}/video`)}
                  >
                    Join Video Call
                  </Button>
                )}

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
