import { sessionHistory } from '../../../../data/sessions';
import SessionCard from '../../../../shared/components/SessionCard/SessionCard';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import styles from './SessionHistory.module.css';

export default function SessionHistory() {
  return (
    <div className={styles.page}>
      <h1>Session History</h1>
      <p className={styles.subtext}>A record of your completed sessions and reports.</p>

      {sessionHistory.length ? (
        <div className={styles.list}>
          {sessionHistory.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <EmptyState title="No past sessions" description="Your completed sessions will appear here." />
      )}
    </div>
  );
}
