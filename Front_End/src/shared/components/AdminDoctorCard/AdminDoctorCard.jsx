import Avatar from '../Avatar/Avatar'
import StatusBadge from '../StatusBadge/StatusBadge'
import Button from '../AdminButton/AdminButton'
import Card from '../Card/Card'
import { formatDate } from '../../../features/admin/utils/formatDate'
import { DOCTOR_STATUS_LABEL } from '../../../features/admin/constants/statusEnums'
import styles from './AdminDoctorCard.module.css'

function AdminDoctorCard({ doctor, onApprove, onReject, onViewDetails }) {
  return (
    <Card className={styles.card} hoverable>
      <div className={styles.header}>
        <Avatar name={doctor.name} size="lg" />
        <div>
          <h3 className={styles.name}>{doctor.name}</h3>
          <p className={styles.specialization}>{doctor.specialization}</p>
        </div>
        <StatusBadge status={doctor.status} label={DOCTOR_STATUS_LABEL[doctor.status]} />
      </div>

      <div className={styles.meta}>
        <span>
          <i className="fa-solid fa-briefcase-medical" aria-hidden="true" /> {doctor.yearsOfExperience} yrs experience
        </span>
        <span>
          <i className="fa-regular fa-calendar" aria-hidden="true" /> Submitted {formatDate(doctor.submittedDate)}
        </span>
        <a
          href={doctor.certificateUrl !== '#' ? doctor.certificateUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.certLink}
          onClick={(e) => {
            if (!doctor.certificateUrl || doctor.certificateUrl === '#') {
              e.preventDefault()
              alert('No certificate document uploaded for this doctor.')
            }
          }}
        >
          <i className="fa-regular fa-file-lines" aria-hidden="true" /> View certificate
        </a>
      </div>

      <div className={styles.actions}>
        <Button variant="ghost" onClick={() => onViewDetails(doctor)}>
          View Details
        </Button>
        {onReject && (
          <Button variant="danger" onClick={() => onReject(doctor)}>
            Reject
          </Button>
        )}
        {onApprove && (
          <Button variant="primary" icon="fa-solid fa-check" onClick={() => onApprove(doctor)}>
            Approve
          </Button>
        )}
      </div>
    </Card>
  )
}

export default AdminDoctorCard
