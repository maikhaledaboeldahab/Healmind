import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card/Card'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import EmptyState from '../../components/EmptyState/EmptyState'
import { TICKET_STATUS_LABEL, TICKET_DECISION_LABEL } from '../../constants/statusEnums'
import { formatDate } from '../../utils/formatDate'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import styles from './TicketHistoryPanel.module.css'

function TicketHistoryPanel({ tickets }) {
  const navigate = useNavigate()

  return (
    <Card>
      <h3 className={styles.title}>Ticket History</h3>
      {tickets.length === 0 ? (
        <EmptyState icon="fa-solid fa-ticket" title="No tickets yet" description="This patient has not booked any ticket sessions." />
      ) : (
        <ul className={styles.list}>
          {tickets.map((ticket) => (
            <li key={ticket.id} className={styles.item} onClick={() => navigate(buildPath(ROUTE_PATHS.TICKET_DETAILS, { ticketId: ticket.id }))}>
              <div>
                <span className={styles.ticketId}>{ticket.id}</span>
                <span className={styles.date}>Booked {formatDate(ticket.bookingDate)}</span>
              </div>
              <div className={styles.badges}>
                <StatusBadge status={ticket.status} label={TICKET_STATUS_LABEL[ticket.status]} />
                <StatusBadge status={ticket.decision} label={TICKET_DECISION_LABEL[ticket.decision]} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default TicketHistoryPanel
