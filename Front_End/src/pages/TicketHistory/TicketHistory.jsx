import { useNavigate } from 'react-router-dom';
import { tickets } from '../../data/tickets';
import TicketCard from '../../components/TicketCard/TicketCard';
import Button from '../../components/Button/Button';
import EmptyState from '../../components/EmptyState/EmptyState';
import styles from './TicketHistory.module.css';

export default function TicketHistory() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Community Access Tickets</h1>
          <p className={styles.subtext}>Track the evaluation and approval status of your community requests.</p>
        </div>
        <Button onClick={() => navigate('/tickets/new')}>Request Access</Button>
      </div>

      {tickets.length ? (
        <div className={styles.list}>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No community access tickets yet"
          description="Submit a request to get evaluated for HealMind community access."
          action={<Button onClick={() => navigate('/tickets/new')}>Request Access</Button>}
        />
      )}
    </div>
  );
}
