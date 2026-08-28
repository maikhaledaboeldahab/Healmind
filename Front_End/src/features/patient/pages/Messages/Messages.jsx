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
import { getSocket, connectSocket } from '../../../../shared/services/socket';
import { getEligibleDoctorSession } from '../../../../shared/utils/videoWindow';
import Button from '../../../../shared/components/Button/Button';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import styles from './Messages.module.css';

function getInitials(name) {
  if (!name) return 'DR';
  const clean = name.replace(/^dr\.?\s+/i, '').trim();
  const parts = clean.split(' ').filter(Boolean);
  if (parts.length === 0) return 'DR';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getDoctorAvatar(doc) {
  const img = doc?.profileImage || doc?.image;
  if (img && typeof img === 'string' && !img.includes('unsplash.com') && img.trim() !== '') {
    return img;
  }
  return null;
}

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

  // Socket listener for incoming real-time doctor messages
  useEffect(() => {
    const token = window.localStorage.getItem('healmind_token');
    if (token) connectSocket(token);

    const socket = getSocket();
    const handleReceiveMessage = (msgData) => {
      if (!msgData) return;
      const senderDocId = msgData.senderId;
      const senderDocName = msgData.senderName || 'Doctor';
      const newMsg = {
        id: msgData.messageId || Date.now(),
        from: msgData.senderRole || 'doctor',
        text: msgData.message,
        time: new Date(msgData.timestamp || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      setConversationDoctors((prev) => {
        const exists = prev.some((d) => d.id === senderDocId || d.name === senderDocName);
        if (!exists && senderDocId) {
          return [
            ...prev,
            {
              id: senderDocId,
              name: senderDocName,
              specialization: 'Mental Health Specialist',
              image: null,
            },
          ];
        }
        return prev;
      });

      setThreads((prev) => {
        const existingIdMsgs = prev[senderDocId] || [];
        const existingNameMsgs = prev[senderDocName] || [];
        const merged = existingIdMsgs.length ? existingIdMsgs : existingNameMsgs;

        return {
          ...prev,
          [senderDocId]: [...merged, newMsg],
          [senderDocName]: [...merged, newMsg],
        };
      });

      setSelectedDoctorId((curr) => curr || senderDocId);
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [docsRes, sessRes, convsRes] = await Promise.all([
          api.get('/doctor/list').catch(() => api.get('/admin/doctors')),
          api.get('/session/my-sessions').catch(() => ({ data: [] })),
          api.get('/conversations').catch(() => ({ data: [] })),
        ]);

        const rawDocs = docsRes.data?.data || docsRes.data || [];
        const rawSess = sessRes.data?.data || sessRes.data?.sessions || sessRes.data || [];
        const rawConvs = convsRes.data?.data || convsRes.data || [];

        if (mounted) {
          const docsMap = new Map();
          if (Array.isArray(rawDocs)) {
            rawDocs.forEach((d) => {
              const id = d._id || d.id;
              docsMap.set(id, {
                id,
                name: d.name || d.fullName || 'Doctor',
                specialization: d.specialization || 'Mental Health Specialist',
                image: (d.profileImage && !d.profileImage.includes('unsplash.com')) ? d.profileImage : null,
              });
            });
          }

          if (Array.isArray(rawConvs)) {
            rawConvs.forEach((conv) => {
              if (conv.otherUser) {
                const id = conv.otherUser._id || conv.otherUser.id;
                if (!docsMap.has(id)) {
                  docsMap.set(id, {
                    id,
                    name: conv.otherUser.name || 'Doctor',
                    specialization: 'Mental Health Specialist',
                    image: (conv.otherUser.profileImage && !conv.otherUser.profileImage.includes('unsplash.com')) ? conv.otherUser.profileImage : null,
                  });
                }
              }
            });
          }

          const docs = Array.from(docsMap.values());
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

  // Load message history from backend whenever selected doctor changes
  useEffect(() => {
    if (!selectedDoctorId) return;
    let mounted = true;
    api.get('/conversations').then((res) => {
      if (!mounted) return;
      const raw = res.data?.data || res.data || [];
      const conv = raw.find((c) => c.otherUser && (c.otherUser._id === selectedDoctorId || c.otherUser.id === selectedDoctorId || c.otherUser.name === activeDoctor?.name));
      if (conv?.conversationId) {
        api.get(`/conversations/${conv.conversationId}/messages`).then((mRes) => {
          if (!mounted) return;
          const rawMsgs = mRes.data?.data || mRes.data || [];
          if (Array.isArray(rawMsgs) && rawMsgs.length > 0) {
            const formatted = rawMsgs.map((m) => ({
              id: m._id || m.id,
              from: m.senderModel === 'doctor' || m.sender?.role === 'doctor' ? 'doctor' : 'patient',
              text: m.message,
              time: new Date(m.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            }));
            setThreads((prev) => ({
              ...prev,
              [selectedDoctorId]: formatted,
            }));
          }
        }).catch(() => {});
      }
    }).catch(() => {});

    return () => {
      mounted = false;
    };
  }, [selectedDoctorId]);

  const activeDoctor = conversationDoctors.find((d) => d.id === selectedDoctorId) || conversationDoctors[0];
  const activeMessages = (threads[selectedDoctorId] && threads[selectedDoctorId].length > 0)
    ? threads[selectedDoctorId]
    : (activeDoctor ? (threads[activeDoctor.name] || threads[activeDoctor.id] || []) : []);

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
    if (!draft.trim() || !selectedDoctorId) return;

    const messageText = draft.trim();
    const newMsg = {
      id: Date.now(),
      from: 'patient',
      text: messageText,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setThreads((prev) => ({
      ...prev,
      [selectedDoctorId]: [...(prev[selectedDoctorId] || []), newMsg],
    }));
    setDraft('');

    // Emit real-time message to doctor via socket
    const token = window.localStorage.getItem('healmind_token');
    if (token) connectSocket(token);
    const socket = getSocket();
    socket.emit('send_message', {
      receiverId: selectedDoctorId,
      receiverModel: 'doctor',
      message: messageText,
    });
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
            const avatarUrl = getDoctorAvatar(doc);

            return (
              <button
                key={doc.id}
                type="button"
                className={`${styles.conversationItem} ${isSelected ? styles.activeItem : ''}`}
                onClick={() => handleSelectDoctor(doc.id)}
              >
                <div className={styles.avatarWrapper}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={doc.name} className={styles.avatar} />
                  ) : (
                    <div className={styles.initialsAvatar}>
                      {getInitials(doc.name)}
                    </div>
                  )}
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
                {getDoctorAvatar(activeDoctor) ? (
                  <img src={getDoctorAvatar(activeDoctor)} alt={activeDoctor.name} className={styles.headerAvatar} />
                ) : (
                  <div className={styles.headerInitialsAvatar}>
                    {getInitials(activeDoctor.name)}
                  </div>
                )}
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
