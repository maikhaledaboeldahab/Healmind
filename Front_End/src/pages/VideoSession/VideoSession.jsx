import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComments,
  faCalendarDay,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { upcomingSessions, sessionHistory } from '../../data/sessions';
import { getDoctorById } from '../../data/doctors';
import { useAuth } from '../../context/AuthContext';
import { formatShortDate } from '../../utils/formatDate';
import Button from '../../components/Button/Button';
import EmptyState from '../../components/EmptyState/EmptyState';
import VideoCall from '../../components/VideoCall/VideoCall';
import styles from './VideoSession.module.css';

export default function VideoSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Look up session from upcoming or past sessions (if available in local state)
  const allSessions = [...upcomingSessions, ...sessionHistory];
  const session = allSessions.find((s) => String(s.id) === String(sessionId)) || {
    id: sessionId,
    doctorName: 'Doctor',
    date: new Date().toISOString(),
    time: 'Scheduled Time',
    status: 'In-progress',
  };

  const doctor = session.doctorId
    ? getDoctorById(session.doctorId)
    : {
        name: session.doctorName || 'Doctor',
        image: session.doctorImage || 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=faces',
        specialization: 'Specialist',
      };

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
            src={doctor?.image || session.doctorImage || 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=faces'}
            alt={doctor?.name || session.doctorName}
            className={styles.doctorAvatar}
          />
          <div>
            <h1 className={styles.title}>Live Video Session</h1>
            <p className={styles.subtitle}>
              <span>{doctor?.name || session.doctorName}</span>
              {doctor?.specialization && <span>&bull; {doctor.specialization}</span>}
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
        fallbackDisplayName={user?.fullName || 'Patient'}
      />

      {/* Session Metadata Card */}
      <div className={styles.sessionDetailsCard}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Session ID</span>
          <span className={styles.detailValue}>#{session.id}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Scheduled Date</span>
          <span className={styles.detailValue}>
            <FontAwesomeIcon icon={faCalendarDay} /> {formatShortDate(session.date)}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Time Slot</span>
          <span className={styles.detailValue}>
            <FontAwesomeIcon icon={faClock} /> {session.time}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Session Status</span>
          <span className={styles.detailValue}>{session.status}</span>
        </div>
      </div>
    </div>
  );
}
