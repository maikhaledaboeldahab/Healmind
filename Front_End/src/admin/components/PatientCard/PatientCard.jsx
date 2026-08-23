import Avatar from '../Avatar/Avatar'
import StatusBadge from '../StatusBadge/StatusBadge'
import { COMMUNITY_STATUS_LABEL } from '../../constants/statusEnums'
import { formatDate } from '../../utils/formatDate'
import styles from './PatientCard.module.css'

function PatientCard({ patient, onClick }) {
  return (
    <button type="button" className={styles.card} onClick={() => onClick?.(patient)}>
      <Avatar name={patient.name} size="md" />
      <div className={styles.body}>
        <span className={styles.name}>{patient.name}</span>
        <span className={styles.meta}>Registered {formatDate(patient.registeredDate)}</span>
      </div>
      <StatusBadge status={patient.communityStatus} label={COMMUNITY_STATUS_LABEL[patient.communityStatus]} />
    </button>
  )
}

export default PatientCard
