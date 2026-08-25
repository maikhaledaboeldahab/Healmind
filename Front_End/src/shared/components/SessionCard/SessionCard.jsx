import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faClock, faVideo } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Badge from '../Badge/Badge';
import Button from '../Button/Button';
import { formatShortDate } from '../../utils/formatDate';
import styles from './SessionCard.module.css';

export default function SessionCard({ session, showJoin = false }) {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      {session.doctorImage && (
        <img src={session.doctorImage} alt={session.doctorName} className={styles.avatar} />
      )}
      <div className={styles.info}>
        <h4 className={styles.name}>{session.doctorName}</h4>
        <div className={styles.meta}>
          <span>
            <FontAwesomeIcon icon={faCalendarDay} /> {formatShortDate(session.date)}
          </span>
          <span>
            <FontAwesomeIcon icon={faClock} /> {session.time}
          </span>
        </div>
      </div>
      <div className={styles.actions}>
        <Badge>{session.status}</Badge>
        <div className={styles.buttons}>
          <Button size="sm" variant="outline" onClick={() => navigate(`/sessions/${session.id}`)}>
            View Details
          </Button>
          {showJoin && (
            <Button size="sm" icon={<FontAwesomeIcon icon={faVideo} />} onClick={() => navigate(`/sessions/${session.id}/video`)}>
              Join
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
