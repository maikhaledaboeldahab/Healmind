import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader'
import Card from '../../components/Card/Card'
import Avatar from '../../components/Avatar/Avatar'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import Button from '../../components/Button/Button'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { doctorService } from '../../services/doctorService'
import { useModal } from '../../hooks/useModal'
import { useToast } from '../../hooks/useToast'
import { DOCTOR_STATUS_LABEL } from '../../constants/statusEnums'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import styles from './DoctorDetails.module.css'

function DoctorDetails() {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [doctor, setDoctor] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const disableModal = useModal()
  const deleteModal = useModal()

  useEffect(() => {
    setIsLoading(true)
    doctorService.getById(doctorId).then((result) => {
      setDoctor(result)
      setIsLoading(false)
    })
  }, [doctorId])

  if (isLoading) return <LoadingSpinner fullHeight label="Loading doctor profile…" />
  if (!doctor) {
    return (
      <Card>
        <p>Doctor not found.</p>
        <Button variant="ghost" onClick={() => navigate(ROUTE_PATHS.DOCTORS)}>
          Back to Doctors
        </Button>
      </Card>
    )
  }

  const handleDisable = async () => {
    await doctorService.disable(doctor.id)
    setDoctor((prev) => ({ ...prev, status: 'disabled' }))
    showToast(`${doctor.name} has been disabled.`, 'info')
    disableModal.close()
  }

  const handleDelete = async () => {
    await doctorService.remove(doctor.id)
    showToast(`${doctor.name} has been deleted.`, 'success')
    deleteModal.close()
    navigate(ROUTE_PATHS.DOCTORS)
  }

  return (
    <div>
      <PageHeader
        title="Doctor Profile"
        description="Full profile, verification status, and platform performance for this doctor."
        actions={
          <>
            <Button variant="secondary" icon="fa-solid fa-pen" onClick={() => navigate(buildPath(ROUTE_PATHS.DOCTOR_EDIT, { doctorId }))}>
              Edit
            </Button>
            <Button variant="danger" icon="fa-solid fa-ban" onClick={() => disableModal.open()}>
              Disable
            </Button>
            <Button variant="danger" icon="fa-solid fa-trash" onClick={() => deleteModal.open()}>
              Delete
            </Button>
          </>
        }
      />

      <div className={styles.grid}>
        <Card className={styles.profileCard}>
          <Avatar name={doctor.name} size="lg" />
          <h2 className={styles.name}>{doctor.name}</h2>
          <p className={styles.specialization}>{doctor.specialization}</p>
          <StatusBadge status={doctor.status} label={DOCTOR_STATUS_LABEL[doctor.status]} />

          <dl className={styles.infoList}>
            <div>
              <dt>Email</dt>
              <dd>{doctor.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{doctor.phone}</dd>
            </div>
            <div>
              <dt>Experience</dt>
              <dd>{doctor.yearsOfExperience} years</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>{doctor.availability}</dd>
            </div>
            <div>
              <dt>Submitted</dt>
              <dd>{formatDate(doctor.submittedDate)}</dd>
            </div>
          </dl>

          <a href={doctor.certificateUrl} className={styles.certLink} onClick={(e) => e.preventDefault()}>
            <i className="fa-regular fa-file-lines" aria-hidden="true" /> View Certificate
          </a>
        </Card>

        <div className={styles.detailsColumn}>
          <Card>
            <h3 className={styles.sectionTitle}>Bio</h3>
            <p className={styles.bio}>{doctor.bio}</p>
          </Card>

          <div className={styles.statRow}>
            <Card className={styles.statCard}>
              <span className={styles.statValue}>{doctor.patientsCount}</span>
              <span className={styles.statLabel}>Patients</span>
            </Card>
            <Card className={styles.statCard}>
              <span className={styles.statValue}>{doctor.sessionsCount}</span>
              <span className={styles.statLabel}>Sessions</span>
            </Card>
            <Card className={styles.statCard}>
              <span className={styles.statValue}>{formatCurrency(doctor.revenue)}</span>
              <span className={styles.statLabel}>Revenue Generated</span>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={disableModal.isOpen}
        onClose={disableModal.close}
        onConfirm={handleDisable}
        title="Disable Doctor"
        message={`Disable ${doctor.name}? They will lose access until re-enabled.`}
        confirmLabel="Disable"
      />

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDelete}
        title="Delete Doctor"
        message={`Permanently delete ${doctor.name}? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  )
}

export default DoctorDetails
