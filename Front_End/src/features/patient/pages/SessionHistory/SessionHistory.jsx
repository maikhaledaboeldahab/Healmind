import { useEffect, useState } from 'react';
import api from '../../../../shared/services/api';
import SessionCard from '../../../../shared/components/SessionCard/SessionCard';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import Loader from '../../../../shared/components/Loader/Loader';
import styles from './SessionHistory.module.css';

function normalizeSession(s) {
  if (!s) return null;
  return {
    id: s._id || s.id,
    doctorId: s.doctorId?._id || s.doctorId || 'doc-1',
    doctorName: s.doctorId?.name || s.doctorname || 'Doctor',
    doctorImage: s.doctorId?.profileImage || null,
    date: s.scheduledTime ? new Date(s.scheduledTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Past Session',
    time: s.scheduledTime ? new Date(s.scheduledTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Completed',
    status: s.status ? (s.status.charAt(0).toUpperCase() + s.status.slice(1)) : 'Completed',
    depositPaid: s.depositPaid || true,
    depositAmount: s.depositAmount || 70,
    remainingBalance: s.balance || 0,
    sessionPrice: s.sessionPrice || 350,
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
