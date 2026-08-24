import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../../../shared/components/PageHeader/PageHeader'
import Card from '../../../../shared/components/Card/Card'
import Button from '../../../../shared/components/AdminButton/AdminButton'
import StatusBadge from '../../../../shared/components/StatusBadge/StatusBadge'
import LoadingSpinner from '../../../../shared/components/LoadingSpinner/LoadingSpinner'
import AssignDoctorModal from './AssignDoctorModal'
import { ticketService } from '../../services/ticketService'
import { patientService } from '../../services/patientService'
import { doctorService } from '../../services/doctorService'
import { TICKET_DECISION_LABEL } from '../../constants/statusEnums'
import { formatDate } from '../../utils/formatDate'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import styles from './TicketDetails.module.css'

function TicketDetails() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [patient, setPatient] = useState(null)
  const [doctor, setDoctor] = useState(null)
  const [allDoctors, setAllDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAssignModal, setShowAssignModal] = useState(false)

  useEffect(() => {
    ticketService.getById(ticketId).then(async (ticketResult) => {
      if (!ticketResult) {
        setIsLoading(false)
        return
      }
      const [patientResult, doctorResult, allDoctorsResult] = await Promise.all([
        patientService.getById(ticketResult.patientId),
        ticketResult.doctorId ? doctorService.getById(ticketResult.doctorId) : Promise.resolve(null),
        doctorService.getAll(),
      ])
      setTicket(ticketResult)
      setPatient(patientResult)
      setDoctor(doctorResult)
      setAllDoctors(allDoctorsResult)
      setIsLoading(false)
    })
  }, [ticketId])

  const handleAssigned = (updatedTicket) => {
    setTicket(updatedTicket)
    // Fetch the newly assigned doctor's details to display
    doctorService.getById(updatedTicket.doctorId).then(setDoctor)
    setShowAssignModal(false)
  }

  if (isLoading) return <LoadingSpinner fullHeight label="Loading ticket…" />

  if (!ticket) {
    return (
      <Card>
        <p>Ticket not found.</p>
        <Button variant="ghost" onClick={() => navigate(ROUTE_PATHS.TICKETS)}>
          Back to Tickets
        </Button>
      </Card>
    )
  }

  const isAssigned = Boolean(ticket.doctorId)

  return (
    <div>
      <PageHeader
        title={`Community Access Ticket ${ticket.id}`}
        description="Full details of this community access request, doctor assignment, and evaluation status."
      />

      <div className={styles.grid}>
        {/* ── Request Overview ──────────────────────────────────────── */}
        <Card>
          <h3 className={styles.sectionTitle}>Request Overview</h3>
          <dl className={styles.infoList}>
            <div>
              <dt>Subject</dt>
              <dd><strong>{ticket.subject || 'Community Access Request'}</strong></dd>
            </div>
            <div>
              <dt>Patient</dt>
              <dd
                className={styles.link}
                onClick={() => navigate(buildPath(ROUTE_PATHS.PATIENT_DETAILS, { patientId: ticket.patientId }))}
              >
                {patient?.name || ticket.patientId}
              </dd>
            </div>

            {/* Preferred Date & Time — visually highlighted so admin can use them for assignment */}
            <div className={styles.highlightRow}>
              <dt>Preferred Date</dt>
              <dd>{ticket.preferredDate ? formatDate(ticket.preferredDate) : 'Not provided'}</dd>
            </div>
            <div className={styles.highlightRow}>
              <dt>Preferred Time</dt>
              <dd>{ticket.preferredTime || 'Not provided'}</dd>
            </div>

            <div>
              <dt>Created Date</dt>
              <dd>{formatDate(ticket.createdAt || ticket.bookingDate)}</dd>
            </div>
            {ticket.updatedAt && (
              <div>
                <dt>Updated Date</dt>
                <dd>{formatDate(ticket.updatedAt)}</dd>
              </div>
            )}
          </dl>
        </Card>

        {/* ── Assignment & Decision ─────────────────────────────────── */}
        <Card>
          <h3 className={styles.sectionTitle}>Status &amp; Decision</h3>
          <div className={styles.statusRow}>
            {/* Assigned Doctor */}
            <div>
              <span className={styles.statusLabel}>Assigned Doctor</span>
              {isAssigned ? (
                <span
                  className={styles.link}
                  onClick={() => navigate(buildPath(ROUTE_PATHS.DOCTOR_DETAILS, { doctorId: ticket.doctorId }))}
                >
                  {doctor?.name || ticket.doctorId}
                </span>
              ) : (
                <StatusBadge status="unassigned" label="Not Assigned" tone="neutral" />
              )}
            </div>

            {/* Assignment Status */}
            <div>
              <span className={styles.statusLabel}>Assignment Status</span>
              {isAssigned ? (
                <StatusBadge status="assigned" label="Assigned" tone="success" />
              ) : (
                <StatusBadge status="unassigned" label="Awaiting Assignment" tone="warning" />
              )}
            </div>

            {/* Doctor Decision — read-only; admin cannot modify */}
            <div>
              <span className={styles.statusLabel}>Doctor Decision</span>
              <StatusBadge status={ticket.decision} label={TICKET_DECISION_LABEL[ticket.decision]} />
            </div>
          </div>

          {/* Assign Doctor button — only visible when no doctor is assigned yet */}
          {!isAssigned && (
            <Button
              variant="primary"
              icon="fa-solid fa-user-doctor"
              fullWidth
              onClick={() => setShowAssignModal(true)}
              style={{ marginBottom: '12px' }}
            >
              Assign Doctor
            </Button>
          )}

          <p className={styles.decisionNote}>
            <i className="fa-solid fa-circle-info" aria-hidden="true" />
            Only the assigned doctor can make the clinical decision regarding community access. Admins may monitor but not override it.
          </p>
        </Card>

        {/* ── Patient Description & Notes ───────────────────────────── */}
        <Card className={styles.notesCard}>
          <h3 className={styles.sectionTitle}>Request Description &amp; Notes</h3>
          {ticket.description && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>Patient Description:</strong>
              <p className={styles.notes} style={{ marginTop: '0.25rem' }}>{ticket.description}</p>
            </div>
          )}
          {ticket.notes && (
            <div>
              <strong>Evaluation Notes:</strong>
              <p className={styles.notes} style={{ marginTop: '0.25rem' }}>{ticket.notes}</p>
            </div>
          )}
        </Card>
      </div>

      {showAssignModal && (
        <AssignDoctorModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          ticket={ticket}
          patient={patient}
          doctors={allDoctors}
          onAssigned={handleAssigned}
        />
      )}
    </div>
  )
}

export default TicketDetails
