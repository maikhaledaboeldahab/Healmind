import StatusBadge from '../StatusBadge/StatusBadge'
import { SESSION_STATUS_LABEL, SESSION_TYPE_LABEL } from '../../constants/statusEnums'
import { formatTime } from '../../utils/formatDate'
import styles from './SessionCard.module.css'

function SessionCard({ session, patientName, doctorName, onClick }) {
  return (
    <button type="button" className={styles.card} onClick={() => onClick?.(session)}>
      <div className={styles.time}>
        <span className={styles.timeValue}>{formatTime(session.startTime)}</span>
        <span className={styles.duration}>{session.durationMinutes} min</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.body}>
        <span className={styles.type}>{SESSION_TYPE_LABEL[session.type]}</span>
        <span className={styles.names}>
          {patientName} · {doctorName}
        </span>
      </div>
      <StatusBadge status={session.status} label={SESSION_STATUS_LABEL[session.status]} />
    </button>
  )
}

export default SessionCard
