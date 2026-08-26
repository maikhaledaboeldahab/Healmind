import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTickets } from '../../../../shared/services/tickets.service';
import TicketCard from '../../../../shared/components/TicketCard/TicketCard';
import Button from '../../../../shared/components/Button/Button';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import styles from './TicketHistory.module.css';

export default function TicketHistory() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadTickets() {
      try {
        setLoading(true);
        const res = await fetchTickets();
        const raw = res.data?.data || res.data?.tickets || res.data;
        if (mounted && Array.isArray(raw)) {
          setTickets(raw);
        }
      } catch {
        if (mounted) setTickets([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadTickets();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Community Access & Evaluation Tickets</h1>
          <p className={styles.subtext}>Track the evaluation and assignment status of your specialist consultation requests.</p>
        </div>
        <Button onClick={() => navigate('/tickets/new')}>Request Access</Button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading tickets...</p>
      ) : tickets.length ? (
        <div className={styles.list}>
          {tickets.map((ticket) => (
            <TicketCard key={ticket._id || ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No evaluation tickets yet"
          description="Submit a request to get evaluated for HealMind specialist care and community access."
          action={<Button onClick={() => navigate('/tickets/new')}>Request Access</Button>}
        />
      )}
    </div>
  );
}
