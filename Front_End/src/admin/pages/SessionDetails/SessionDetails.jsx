import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import Card from '../../components/Card/Card.jsx'
import Button from '../../components/Button/Button.jsx'
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.jsx'
import { sessionService } from '../../services/sessionService'
import { patientService } from '../../services/patientService'
import { doctorService } from '../../services/doctorService'
import { useModal } from '../../hooks/useModal'
import { useToast } from '../../hooks/useToast'
import RescheduleModal from './RescheduleModal.jsx'
import {
  SESSION_STATUS_LABEL,
  SESSION_TYPE_LABEL,
  PAYMENT_STATUS_LABEL,
  TICKET_DECISION_LABEL,
} from '../../constants/statusEnums'
import { formatDateTime } from '../../utils/formatDate'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import styles from './SessionDetails.module.css'

function SessionDetails() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [session, setSession] = useState(null)
  const [patient, setPatient] = useState(null)
  const [doctor, setDoctor] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  const cancelModal = useModal()
  const completeModal = useModal()
  const rescheduleModal = useModal()

  const loadSession = () => {
    setIsLoading(true)
    sessionService.getById(sessionId).then(async (sessionResult) => {
      if (!sessionResult) {
        setIsLoading(false)
        return
      }
      const [patientResult, doctorResult] = await Promise.all([
        patientService.getById(sessionResult.patientId),
        doctorService.getById(sessionResult.doctorId),
      ])
      setSession(sessionResult)
      setPatient(patientResult)
      setDoctor(doctorResult)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    loadSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  if (isLoading) return <LoadingSpinner fullHeight label="Loading session…" />

  if (!session) {
    return (
      <Card>
        <p>Session not found.</p>
        <Button variant="ghost" onClick={() => navigate(ROUTE_PATHS.SESSIONS)}>
          Back to Sessions
        </Button>
      </Card>
    )
  }

  const handleCancel = async () => {
    setIsProcessing(true)
    await sessionService.cancel(session.id)
    showToast('Session has been cancelled.', 'info')
    cancelModal.close()
    setIsProcessing(false)
    loadSession()
  }

  const handleComplete = async () => {
    setIsProcessing(true)
    await sessionService.markCompleted(session.id)
    showToast('Session marked as completed.', 'success')
    completeModal.close()
    setIsProcessing(false)
    loadSession()
  }

  const handleReschedule = async (payload) => {
    setIsProcessing(true)
    await sessionService.reschedule(session.id, payload)
    showToast('Session rescheduled successfully.', 'success')
    rescheduleModal.close()
    setIsProcessing(false)
    loadSession()
  }

  return (
    <div>
      <PageHeader
        title={`Session ${session.id}`}
        description="Full session details, decision outcome, and admin scheduling actions."
        actions={
          <>
            <Button variant="secondary" icon="fa-solid fa-calendar-days" onClick={rescheduleModal.open}>
              Reschedule
            </Button>
            <Button variant="danger" icon="fa-solid fa-ban" onClick={cancelModal.open}>
              Cancel
            </Button>
            <Button icon="fa-solid fa-check" onClick={completeModal.open}>
              Mark Completed
            </Button>
          </>
        }
      />

      <div className={styles.grid}>
        <Card>
          <h3 className={styles.sectionTitle}>Participants</h3>
          <dl className={styles.infoList}>
            <div>
              <dt>Patient</dt>
              <dd className={styles.link} onClick={() => navigate(buildPath(ROUTE_PATHS.PATIENT_DETAILS, { patientId: session.patientId }))}>
                {patient?.name || session.patientId}
              </dd>
            </div>
            <div>
              <dt>Doctor</dt>
              <dd className={styles.link} onClick={() => navigate(buildPath(ROUTE_PATHS.DOCTOR_DETAILS, { doctorId: session.doctorId }))}>
                {doctor?.name || session.doctorId}
              </dd>
            </div>
            <div>
              <dt>Start Time</dt>
              <dd>{formatDateTime(session.startTime)}</dd>
            </div>
            <div>
              <dt>End Time</dt>
              <dd>{formatDateTime(session.endTime)}</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{session.durationMinutes} minutes</dd>
            </div>
            <div>
              <dt>Session Type</dt>
              <dd>{SESSION_TYPE_LABEL[session.type]}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h3 className={styles.sectionTitle}>Status & Decision</h3>
          <div className={styles.statusRow}>
            <div>
              <span className={styles.statusLabel}>Session Status</span>
              <StatusBadge status={session.status} label={SESSION_STATUS_LABEL[session.status]} />
            </div>
            <div>
              <span className={styles.statusLabel}>Payment Status</span>
              <StatusBadge status={session.paymentStatus} label={PAYMENT_STATUS_LABEL[session.paymentStatus]} />
            </div>
            <div>
              <span className={styles.statusLabel}>Community Decision</span>
              <StatusBadge status={session.doctorDecision} label={TICKET_DECISION_LABEL[session.doctorDecision]} />
            </div>
            <div>
              <span className={styles.statusLabel}>Follow-up Required</span>
              <StatusBadge
                status={session.followUpRequired ? 'warning' : 'success'}
                tone={session.followUpRequired ? 'warning' : 'success'}
                label={session.followUpRequired ? 'Yes' : 'No'}
              />
            </div>
          </div>
        </Card>

        <Card className={styles.notesCard}>
          <h3 className={styles.sectionTitle}>Session Notes</h3>
          <p className={styles.notes}>{session.notes}</p>
        </Card>

        <Card className={styles.notesCard}>
          <h3 className={styles.sectionTitle}>Chat Logs</h3>
          <div className={styles.chatPlaceholder}>
            <i className="fa-regular fa-comments" aria-hidden="true" />
            <span>Chat log viewer will be available once the messaging service is connected.</span>
          </div>
        </Card>
      </div>

      <RescheduleModal
        isOpen={rescheduleModal.isOpen}
        onClose={rescheduleModal.close}
        session={session}
        onConfirm={handleReschedule}
        isLoading={isProcessing}
      />

      <ConfirmDialog
        isOpen={cancelModal.isOpen}
        onClose={cancelModal.close}
        onConfirm={handleCancel}
        title="Cancel Session"
        message="Cancel this session? The patient and doctor will be notified."
        confirmLabel="Cancel Session"
        isLoading={isProcessing}
      />

      <ConfirmDialog
        isOpen={completeModal.isOpen}
        onClose={completeModal.close}
        onConfirm={handleComplete}
        title="Mark as Completed"
        message="Mark this session as completed?"
        confirmLabel="Mark Completed"
        variant="primary"
        isLoading={isProcessing}
      />
    </div>
  )
}

export default SessionDetails
