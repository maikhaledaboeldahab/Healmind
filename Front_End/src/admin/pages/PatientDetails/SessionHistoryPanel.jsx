import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card/Card'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import EmptyState from '../../components/EmptyState/EmptyState'
import { SESSION_STATUS_LABEL, SESSION_TYPE_LABEL } from '../../constants/statusEnums'
import { formatDateTime } from '../../utils/formatDate'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import styles from './SessionHistoryPanel.module.css'

function SessionHistoryPanel({ sessions, findDoctorName }) {
  const navigate = useNavigate()

  return (
    <Card>
      <h3 className={styles.title}>Session History</h3>
      {sessions.length === 0 ? (
        <EmptyState icon="fa-regular fa-calendar" title="No sessions yet" description="This patient has no recorded sessions." />
      ) : (
        <ul className={styles.list}>
          {sessions.map((session) => (
            <li
              key={session.id}
              className={styles.item}
              onClick={() => navigate(buildPath(ROUTE_PATHS.SESSION_DETAILS, { sessionId: session.id }))}
            >
              <div>
                <span className={styles.type}>{SESSION_TYPE_LABEL[session.type]}</span>
                <span className={styles.meta}>
                  {formatDateTime(session.startTime)} · Dr. {findDoctorName(session.doctorId).replace('Dr. ', '')}
                </span>
              </div>
              <StatusBadge status={session.status} label={SESSION_STATUS_LABEL[session.status]} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default SessionHistoryPanel
