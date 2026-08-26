import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComments,
  faCalendarDay,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import api from '../../../../shared/services/api';
import { useAuth } from '../../../../shared/context/AuthContext';
import { formatShortDate } from '../../../../shared/utils/formatDate';
import Button from '../../../../shared/components/Button/Button';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import VideoCall from '../../../../shared/components/VideoCall/VideoCall';
import styles from './VideoSession.module.css';

export default function VideoSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadSession() {
      try {
        const res = await api.get(`/session/${sessionId}`);
        if (mounted) setSession(res.data?.data || res.data);
      } catch {
        // Fallback gracefully
      }
    }
    if (sessionId) loadSession();
    return () => {
      mounted = false;
    };
  }, [sessionId]);

  const doctorName = session?.doctorId?.name || session?.doctorName || 'Specialist Doctor';
  const doctorSpecialization = session?.doctorId?.specialization || 'Psychology Specialist';
  const doctorAvatar =
    session?.doctorId?.profileImage ||
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=faces';

  if (!sessionId) {
    return (
      <div className={styles.page}>
        <EmptyState
          title="Session Not Found"
          description="The requested video session could not be found or has expired."
          action={<Button onClick={() => navigate('/sessions/upcoming')}>Back to Upcoming Sessions</Button>}
        />
      </div>
    );
  }

  const handleEndCall = () => {
    navigate('/sessions/upcoming');
  };

  return (
    <div className={styles.page}>
      {/* Header with Doctor and Session Info */}
      <div className={styles.header}>
        <div className={styles.doctorMeta}>
          <img
            src={doctorAvatar}
            alt={doctorName}
            className={styles.doctorAvatar}
          />
          <div>
            <h1 className={styles.title}>Live Video Session</h1>
            <p className={styles.subtitle}>
              <span>{doctorName}</span>
              {doctorSpecialization && <span> &bull; {doctorSpecialization}</span>}
            </p>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<FontAwesomeIcon icon={faComments} />}
            onClick={() => navigate(`/live-chat/${sessionId}`)}
          >
            Live Chat
          </Button>
          <div className={styles.statusLive}>
            <span className={styles.liveDot} />
            <span>Live Call</span>
          </div>
        </div>
      </div>

      {/* Main Jitsi Video Call Component */}
      <VideoCall
        sessionId={sessionId}
        onLeave={handleEndCall}
        fallbackDisplayName={user?.fullName || user?.name || 'Patient'}
      />

      {/* Session Metadata Card */}
      <div className={styles.sessionDetailsCard}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Session ID</span>
          <span className={styles.detailValue}>#{sessionId}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Scheduled Date</span>
          <span className={styles.detailValue}>
            <FontAwesomeIcon icon={faCalendarDay} /> {session?.scheduledTime ? formatShortDate(session.scheduledTime) : 'Upcoming'}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Time Slot</span>
          <span className={styles.detailValue}>
            <FontAwesomeIcon icon={faClock} /> {session?.scheduledTime ? new Date(session.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Session Status</span>
          <span className={styles.detailValue}>{session?.status || 'In-progress'}</span>
        </div>
      </div>
    </div>
  );
}
