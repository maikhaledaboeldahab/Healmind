import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../../../shared/services/api';
import SessionCard from '../../../../shared/components/SessionCard/SessionCard';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import Button from '../../../../shared/components/Button/Button';
import Loader from '../../../../shared/components/Loader/Loader';
import styles from './UpcomingSessions.module.css';

function normalizeSession(s) {
  if (!s) return null;
  return {
    id: s._id || s.id,
    doctorId: s.doctorId?._id || s.doctorId || 'doc-1',
    doctorName: s.doctorId?.name || s.doctorname || 'Doctor',
    doctorImage: s.doctorId?.profileImage || null,
    date: s.scheduledTime ? new Date(s.scheduledTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Upcoming',
    time: s.scheduledTime ? new Date(s.scheduledTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Scheduled',
    status: s.status ? (s.status.charAt(0).toUpperCase() + s.status.slice(1)) : 'Confirmed',
    depositPaid: s.depositPaid || false,
    depositAmount: s.depositAmount || 70,
    remainingBalance: s.balance || 280,
    sessionPrice: s.sessionPrice || 350,
  };
}

export default function UpcomingSessions() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [sessionsList, setSessionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      setIsLoading(true);
      try {
        const res = await api.get('/session/my-sessions');
        const raw = res.data?.sessions || res.data?.data || res.data;
        if (Array.isArray(raw) && raw.length > 0) {
          setSessionsList(raw.map(normalizeSession));
        } else {
          setSessionsList([]);
        }
      } catch {
        setSessionsList([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadSessions();
  }, []);

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
        <div className={styles.confirmation}>
          <strong>Payment Successful!</strong> Your deposit of{' '}
          <strong>{state?.depositAmount ? `${state.depositAmount.toFixed(2)} EGP` : 'required amount'}</strong> is
          confirmed. Remaining balance of{' '}
          <strong>{state?.remainingBalance ? `${state.remainingBalance.toFixed(2)} EGP` : 'balance'}</strong> is due directly at
          your session.
        </div>
      )}

      {isLoading ? (
        <Loader label="Loading upcoming sessions..." />
      ) : sessionsList.length ? (
        <div className={styles.list}>
          {sessionsList.map((session) => (
            <SessionCard key={session.id} session={session} />
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
