import { useEffect, useState } from 'react';
import api from '../../../../shared/services/api';
import SessionCard from '../../../../shared/components/SessionCard/SessionCard';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import Loader from '../../../../shared/components/Loader/Loader';
import styles from './SessionHistory.module.css';

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

  return {
    id: s._id || s.id,
    doctorId: s.doctorId?._id || s.doctorId || 'doc-1',
    doctorName: s.doctorId?.name || s.doctorname || 'Doctor',
    doctorImage: s.doctorId?.profileImage || null,
    date: s.scheduledTime ? new Date(s.scheduledTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Past Session',
    time: s.scheduledTime ? new Date(s.scheduledTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Completed',
    status: s.status ? (s.status.charAt(0).toUpperCase() + s.status.slice(1)) : 'Completed',
    depositPaid: Boolean(s.depositPaid),
    balancePaid: Boolean(s.balancePaid),
    depositAmount: depositAmt,
    remainingBalance: remainingBal,
    sessionPrice: docPrice,
    rawSession: s,
  };
}

export default function SessionHistory() {
  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      setIsLoading(true);
      try {
        const res = await api.get('/session/my-sessions');
        const raw = res.data?.sessions || res.data?.data || res.data;
        if (Array.isArray(raw)) {
          setHistoryList(raw.map(normalizeSession));
        } else {
          setHistoryList([]);
        }
      } catch {
        setHistoryList([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <div className={styles.page}>
      <h1>Session History</h1>
      <p className={styles.subtext}>A record of your completed sessions and reports.</p>

      {isLoading ? (
        <Loader label="Loading session history..." />
      ) : historyList.length ? (
        <div className={styles.list}>
          {historyList.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <EmptyState title="No past sessions" description="Your completed sessions will appear here." />
      )}
    </div>
  );
}
