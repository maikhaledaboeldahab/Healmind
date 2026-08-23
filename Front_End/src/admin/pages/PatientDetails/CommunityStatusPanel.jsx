import Card from '../../components/Card/Card'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import { COMMUNITY_STATUS_LABEL } from '../../constants/statusEnums'
import { formatDate } from '../../utils/formatDate'
import styles from './CommunityStatusPanel.module.css'

/**
 * Displays community access status and full approval history.
 * IMPORTANT (business rule): Admin can only MONITOR this status.
 * Only the assigned doctor can approve, reject, or request another
 * session — there is no admin action to change communityStatus here.
 */
function CommunityStatusPanel({ patient, findDoctorName }) {
  return (
    <Card>
      <div className={styles.header}>
        <h3 className={styles.title}>Community Access</h3>
        <StatusBadge status={patient.communityStatus} label={COMMUNITY_STATUS_LABEL[patient.communityStatus]} />
      </div>

      <p className={styles.notice}>
        <i className="fa-solid fa-circle-info" aria-hidden="true" /> Community access is granted only by the assigned
        doctor after a completed evaluation session. Admins can monitor this status but cannot change it manually.
      </p>

      <h4 className={styles.subheading}>Approval History</h4>
      {patient.approvalHistory.length === 0 ? (
        <p className={styles.emptyHint}>No community decisions recorded yet.</p>
      ) : (
        <ul className={styles.historyList}>
          {patient.approvalHistory.map((entry, index) => (
            <li key={index} className={styles.historyItem}>
              <StatusBadge status={entry.decision} label={COMMUNITY_STATUS_LABEL[entry.decision]} />
              <div className={styles.historyMeta}>
                <span>{formatDate(entry.date)}</span>
                <span>Doctor: {findDoctorName(entry.doctorId)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default CommunityStatusPanel
