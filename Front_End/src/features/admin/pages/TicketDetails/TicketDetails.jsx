import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../../../shared/components/PageHeader/PageHeader'
import Card from '../../../../shared/components/Card/Card'
import Button from '../../../../shared/components/AdminButton/AdminButton'
import StatusBadge from '../../../../shared/components/StatusBadge/StatusBadge'
import LoadingSpinner from '../../../../shared/components/LoadingSpinner/LoadingSpinner'
import { ticketService } from '../../services/ticketService'
import { patientService } from '../../services/patientService'
import { doctorService } from '../../services/doctorService'
import { TICKET_STATUS_LABEL, TICKET_DECISION_LABEL, PAYMENT_STATUS_LABEL } from '../../constants/statusEnums'
import { formatDate } from '../../utils/formatDate'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import styles from './TicketDetails.module.css'

function TicketDetails() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [patient, setPatient] = useState(null)
  const [doctor, setDoctor] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ticketService.getById(ticketId).then(async (ticketResult) => {
      if (!ticketResult) {
        setIsLoading(false)
        return
      }
      const [patientResult, doctorResult] = await Promise.all([
        patientService.getById(ticketResult.patientId),
        doctorService.getById(ticketResult.doctorId),
      ])
      setTicket(ticketResult)
      setPatient(patientResult)
      setDoctor(doctorResult)
      setIsLoading(false)
    })
  }, [ticketId])

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

  return (
    <div>
      <PageHeader title={`Community Access Ticket ${ticket.id}`} description="Full details of this community access request, doctor decision, and evaluation status." />

      <div className={styles.grid}>
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
            <div>
              <dt>Assigned Doctor</dt>
              <dd
                className={styles.link}
                onClick={() => navigate(buildPath(ROUTE_PATHS.DOCTOR_DETAILS, { doctorId: ticket.doctorId }))}
              >
                {doctor?.name || ticket.doctorId}
              </dd>
            </div>
            <div>
              <dt>Created Date</dt>
              <dd>{formatDate(ticket.createdAt || ticket.bookingDate)}</dd>
            </div>
            <div>
              <dt>Session Date</dt>
              <dd>{formatDate(ticket.sessionDate)}</dd>
            </div>
            {ticket.updatedAt && (
              <div>
                <dt>Updated Date</dt>
                <dd>{formatDate(ticket.updatedAt)}</dd>
              </div>
            )}
          </dl>
        </Card>

        <Card>
          <h3 className={styles.sectionTitle}>Status & Decision</h3>
          <div className={styles.statusRow}>
            <div>
              <span className={styles.statusLabel}>Payment Status</span>
              <StatusBadge status={ticket.paymentStatus} label={PAYMENT_STATUS_LABEL[ticket.paymentStatus]} />
            </div>
            <div>
              <span className={styles.statusLabel}>Session Status</span>
              <StatusBadge status={ticket.status} label={TICKET_STATUS_LABEL[ticket.status]} />
            </div>
            <div>
              <span className={styles.statusLabel}>Doctor Decision</span>
              <StatusBadge status={ticket.decision} label={TICKET_DECISION_LABEL[ticket.decision]} />
            </div>
          </div>
          <p className={styles.decisionNote}>
            <i className="fa-solid fa-circle-info" aria-hidden="true" /> Only the assigned doctor can make the clinical decision regarding community access. Admins may monitor but not override it.
          </p>
        </Card>

        <Card className={styles.notesCard}>
          <h3 className={styles.sectionTitle}>Request Description & Notes</h3>
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
    </div>
  )
}

export default TicketDetails
