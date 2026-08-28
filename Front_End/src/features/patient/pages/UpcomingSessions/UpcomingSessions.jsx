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
  const docPrice = s.sessionPrice > 0
    ? s.sessionPrice
    : (s.doctorId?.sessionPrice > 0 ? s.doctorId?.sessionPrice : 500);

  const depositAmt = s.depositAmount > 0
    ? s.depositAmount
    : Math.round(docPrice * 0.20 * 100) / 100;

  const remainingBal = s.balance > 0
    ? s.balance
    : Math.round((docPrice - depositAmt) * 100) / 100;

  const isPaid = Boolean(s.balancePaid);
  const rawStatus = (s.status || '').toLowerCase();
  let status = isPaid ? 'Confirmed' : 'Pending';
  if (rawStatus === 'cancelled') status = 'Cancelled';
  if (rawStatus === 'rejected') status = 'Rejected';
  if (rawStatus === 'completed') status = 'Completed';

  return {
    id: s._id || s.id,
    doctorId: s.doctorId?._id || s.doctorId || 'doc-1',
    doctorName: s.doctorId?.name || s.doctorname || 'Doctor',
    doctorImage: s.doctorId?.profileImage || null,
    date: s.scheduledTime ? new Date(s.scheduledTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Upcoming',
    time: s.scheduledTime ? new Date(s.scheduledTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Scheduled',
    status,
    depositPaid: Boolean(s.depositPaid),
    balancePaid: isPaid,
    depositAmount: depositAmt,
    remainingBalance: remainingBal,
    sessionPrice: docPrice,
    rawSession: s,
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
          <strong>Payment Successful!</strong>{' '}
          {state?.isBalancePayment ? (
            <>
              Remaining balance of{' '}
              <strong>{state?.remainingBalance ? `${state.remainingBalance.toFixed(2)} EGP` : 'balance'}</strong> is paid
              and your session is confirmed!
            </>
          ) : (
            <>
              Your deposit of{' '}
              <strong>{state?.depositAmount ? `${state.depositAmount.toFixed(2)} EGP` : 'required amount'}</strong> is
              confirmed. Remaining balance of{' '}
              <strong>{state?.remainingBalance ? `${state.remainingBalance.toFixed(2)} EGP` : 'balance'}</strong> is due directly at
              your session.
            </>
          )}
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
