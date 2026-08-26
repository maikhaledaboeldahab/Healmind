import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUserDoctor, faVideo, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import Badge from '../Badge/Badge';
import { formatDate } from '../../utils/formatDate';
import styles from './TicketCard.module.css';

export default function TicketCard({ ticket }) {
  const subject = ticket.subject || `Evaluation Consultation (${(ticket.mode || 'video').toUpperCase()})`;
  const doctorName = ticket.assignedDoctor?.name || ticket.doctorName;
  const description =
    ticket.description ||
    `Requested session for ${ticket.scheduledTime ? new Date(ticket.scheduledTime).toLocaleString() : 'Upcoming'}.${doctorName ? ` Assigned to Dr. ${doctorName}.` : ' Awaiting doctor assignment.'}`;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.subject}>{subject}</h4>
        <Badge variant={ticket.status === 'approved' || ticket.status === 'assigned' ? 'success' : ticket.status === 'rejected' ? 'danger' : 'warning'}>
          {ticket.status}
        </Badge>
      </div>
      <p className={styles.description}>{description}</p>
      <div className={styles.meta}>
        <span>
          <FontAwesomeIcon icon={faCalendar} /> {formatDate(ticket.createdAt || ticket.scheduledTime)}
        </span>
        {doctorName && (
          <span style={{ marginLeft: '1rem', color: '#0284c7' }}>
            <FontAwesomeIcon icon={faUserDoctor} /> Dr. {doctorName}
          </span>
        )}
        <span className={styles.id}>#{ticket._id || ticket.id}</span>
      </div>
    </div>
  );
}
