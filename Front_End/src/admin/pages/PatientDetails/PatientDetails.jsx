import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import Card from '../../components/Card/Card.jsx'
import Avatar from '../../components/Avatar/Avatar.jsx'
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx'
import Button from '../../components/Button/Button.jsx'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.jsx'
import { useModal } from '../../hooks/useModal'
import { useToast } from '../../hooks/useToast'
import { patientService } from '../../services/patientService'
import { usePatientDetails } from './usePatientDetails.js'
import CommunityStatusPanel from './CommunityStatusPanel.jsx'
import TicketHistoryPanel from './TicketHistoryPanel.jsx'
import SessionHistoryPanel from './SessionHistoryPanel.jsx'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import { PAYMENT_STATUS_LABEL } from '../../constants/statusEnums'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import styles from './PatientDetails.module.css'

function PatientDetails() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { isLoading, patient, tickets, sessions, payments, findDoctorName, reload } = usePatientDetails(patientId)
  const suspendModal = useModal()

  if (isLoading) return <LoadingSpinner fullHeight label="Loading patient profile…" />

  if (!patient) {
    return (
      <Card>
        <p>Patient not found.</p>
        <Button variant="ghost" onClick={() => navigate(ROUTE_PATHS.PATIENTS)}>
          Back to Patients
        </Button>
      </Card>
    )
  }

  const isSuspended = patient.status === 'suspended'

  const handleToggleSuspend = async () => {
    await (isSuspended ? patientService.activate(patient.id) : patientService.suspend(patient.id))
    showToast(`${patient.name} has been ${isSuspended ? 'reactivated' : 'suspended'}.`, 'info')
    suspendModal.close()
    reload()
  }

  return (
    <div>
      <PageHeader
        title="Patient Profile"
        description="Community access, medical notes, and full session/payment history for this patient."
        actions={
          <>
            <Button variant="secondary" icon="fa-solid fa-pen" onClick={() => navigate(buildPath(ROUTE_PATHS.PATIENT_EDIT, { patientId }))}>
              Edit
            </Button>
            <Button variant="danger" icon="fa-solid fa-user-lock" onClick={() => suspendModal.open()}>
              {isSuspended ? 'Reactivate' : 'Suspend'}
            </Button>
          </>
        }
      />

      <div className={styles.grid}>
        <Card className={styles.profileCard}>
          <Avatar name={patient.name} size="lg" />
          <h2 className={styles.name}>{patient.name}</h2>
          <p className={styles.email}>{patient.email}</p>
          <StatusBadge status={patient.status} label={isSuspended ? 'Suspended' : 'Active'} />

          <dl className={styles.infoList}>
            <div>
              <dt>Age</dt>
              <dd>{patient.age}</dd>
            </div>
            <div>
              <dt>Registered</dt>
              <dd>{formatDate(patient.registeredDate)}</dd>
            </div>
            <div>
              <dt>Assigned Doctor</dt>
              <dd>{findDoctorName(patient.assignedDoctorId)}</dd>
            </div>
          </dl>

          <div className={styles.notesBox}>
            <h4 className={styles.notesTitle}>Medical Notes</h4>
            <p className={styles.notesText}>{patient.medicalNotes}</p>
          </div>
        </Card>

        <div className={styles.detailsColumn}>
          <CommunityStatusPanel patient={patient} findDoctorName={findDoctorName} />
          <TicketHistoryPanel tickets={tickets} />
          <SessionHistoryPanel sessions={sessions} findDoctorName={findDoctorName} />

          <Card>
            <h3 className={styles.sectionTitle}>Payment History</h3>
            {payments.length === 0 ? (
              <p className={styles.emptyHint}>No payments recorded for this patient.</p>
            ) : (
              <ul className={styles.paymentList}>
                {payments.map((payment) => (
                  <li key={payment.id} className={styles.paymentItem}>
                    <div>
                      <span className={styles.paymentId}>{payment.id}</span>
                      <span className={styles.paymentDate}>{formatDate(payment.paymentDate)}</span>
                    </div>
                    <span className={styles.amount}>{formatCurrency(payment.amount)}</span>
                    <StatusBadge status={payment.status} label={PAYMENT_STATUS_LABEL[payment.status]} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={suspendModal.isOpen}
        onClose={suspendModal.close}
        onConfirm={handleToggleSuspend}
        title={isSuspended ? 'Reactivate Patient' : 'Suspend Patient'}
        message={`${isSuspended ? 'Reactivate' : 'Suspend'} ${patient.name}'s account?`}
        confirmLabel={isSuspended ? 'Reactivate' : 'Suspend'}
      />
    </div>
  )
}

export default PatientDetails
