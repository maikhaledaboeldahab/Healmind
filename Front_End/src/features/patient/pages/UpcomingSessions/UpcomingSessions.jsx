import { useLocation } from 'react-router-dom';
import { upcomingSessions } from '../../../../data/sessions';
import SessionCard from '../../../../shared/components/SessionCard/SessionCard';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import Button from '../../../../shared/components/Button/Button';
import { useNavigate } from 'react-router-dom';
import styles from './UpcomingSessions.module.css';

export default function UpcomingSessions() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Upcoming Sessions</h1>
          <p className={styles.subtext}>Your scheduled sessions with your specialists.</p>
        </div>
        <Button onClick={() => navigate('/doctors')}>Book New Session</Button>
      </div>

      {state?.paid && (
        <div className={styles.confirmation}>Payment successful — your session is confirmed.</div>
      )}

      {upcomingSessions.length ? (
        <div className={styles.list}>
          {upcomingSessions.map((session) => (
            <SessionCard key={session.id} session={session} showJoin />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No upcoming sessions"
          description="Browse our specialists and book your next session."
          action={<Button onClick={() => navigate('/doctors')}>Browse Doctors</Button>}
        />
      )}
    </div>
  );
}
