import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import Badge from '../Badge/Badge';
import { formatDate } from '../../utils/formatDate';
import styles from './TicketCard.module.css';

export default function TicketCard({ ticket }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.subject}>{ticket.subject}</h4>
        <Badge>{ticket.status}</Badge>
      </div>
      <p className={styles.description}>{ticket.description}</p>
      <div className={styles.meta}>
        <span>
          <FontAwesomeIcon icon={faCalendar} /> {formatDate(ticket.createdAt)}
        </span>
        <span className={styles.id}>#{ticket.id}</span>
      </div>
    </div>
  );
}
