import { useState } from 'react'
import Modal from '../../../../shared/components/Modal/Modal'
import Button from '../../../../shared/components/AdminButton/AdminButton'
import { ticketService } from '../../services/ticketService'
import { DOCTOR_STATUS } from '../../constants/statusEnums'
import { formatDate } from '../../utils/formatDate'
import styles from './AssignDoctorModal.module.css'

/**
 * AssignDoctorModal
 *
 * Renders inside the existing Modal shared component.
 *
 * Props:
 *   isOpen    — boolean
 *   onClose   — () => void
 *   ticket    — the ticket object (must have preferredDate, preferredTime, patientId)
 *   patient   — patient object (may be null)
 *   doctors   — full doctors array from doctorService.getAll()
 *   onAssigned — (updatedTicket) => void   called after successful assignment
 *
 * Internal state:
 *   selectedDoctor — null | doctor object   (selection step)
 *   isConfirming   — boolean                (shows confirmation view)
 *   isSaving       — boolean
 */
function AssignDoctorModal({ isOpen, onClose, ticket, patient, doctors, onAssigned }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleClose = () => {
    setSelectedDoctor(null)
    setIsConfirming(false)
    onClose()
  }

  const handleSelect = (doctor) => {
    setSelectedDoctor(doctor)
    setIsConfirming(true)
  }

  const handleBack = () => {
    setIsConfirming(false)
  }

  const handleConfirm = async () => {
    if (!selectedDoctor) return
    setIsSaving(true)
    try {
      const updatedTicket = await ticketService.assignDoctor(ticket.id, selectedDoctor.id)
      onAssigned(updatedTicket)
    } finally {
      setIsSaving(false)
    }
  }

  // ── Doctor list ───────────────────────────────────────────────────────────
  // TODO: Replace this filter with a real backend availability query when the
  //       endpoint is ready, e.g.:
  //         doctorService.getAvailableForSlot(ticket.preferredDate, ticket.preferredTime)
  //       For now we show all VERIFIED doctors. The doctor's availability field
  //       is displayed as an informational string so the admin can make a judgment call.
  const availableDoctors = doctors.filter((d) => d.status === DOCTOR_STATUS.VERIFIED)

  const preferredDateLabel = ticket.preferredDate ? formatDate(ticket.preferredDate) : 'Not specified'
  const preferredTimeLabel = ticket.preferredTime || 'Not specified'

  // ── Confirmation step ─────────────────────────────────────────────────────
  if (isConfirming && selectedDoctor) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Confirm Doctor Assignment" size="sm">
        <div className={styles.confirmBody}>
          <div className={styles.confirmCard}>
            <p className={styles.confirmDoctorName}>{selectedDoctor.name}</p>
            {selectedDoctor.specialization && (
              <p className={styles.confirmSpecialization}>{selectedDoctor.specialization}</p>
            )}
          </div>

          <dl className={styles.confirmList}>
            <div>
              <dt>Patient</dt>
              <dd>{patient?.name || ticket.patientId}</dd>
            </div>
            <div>
              <dt>Preferred Date</dt>
              <dd>{preferredDateLabel}</dd>
            </div>
            <div>
              <dt>Preferred Time</dt>
              <dd>{preferredTimeLabel}</dd>
            </div>
          </dl>

          <p className={styles.confirmNote}>
            Once confirmed, the doctor will be assigned to this request and will proceed with the evaluation.
          </p>

          <div className={styles.confirmActions}>
            <Button variant="ghost" onClick={handleBack} disabled={isSaving}>
              Back
            </Button>
            <Button
              variant="primary"
              icon="fa-solid fa-check"
              isLoading={isSaving}
              onClick={handleConfirm}
            >
              Confirm Assignment
            </Button>
          </div>
        </div>
      </Modal>
    )
  }

  // ── Selection step ────────────────────────────────────────────────────────
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Assign Doctor" size="md">
      <div className={styles.selectionBody}>
        {/* Patient context */}
        <div className={styles.requestSummary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Patient</span>
            <span className={styles.summaryValue}>{patient?.name || ticket.patientId}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Preferred Date</span>
            <span className={styles.summaryValue}>{preferredDateLabel}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Preferred Time</span>
            <span className={styles.summaryValue}>{preferredTimeLabel}</span>
          </div>
        </div>

        <div className={styles.divider} />

        <p className={styles.listHeading}>
          <i className="fa-solid fa-user-doctor" aria-hidden="true" />
          Verified Doctor Candidates
        </p>
        {/* TODO: Replace with doctorService.getAvailableForSlot(ticket.preferredDate, ticket.preferredTime)
             once the backend availability endpoint is ready. Currently shows all verified doctors. */}
        <p className={styles.availabilityNote}>
          <i className="fa-solid fa-circle-info" aria-hidden="true" />
          Availability shown is each doctor&apos;s general schedule. Exact availability for the patient&apos;s requested date and time will be confirmed when real availability data is connected.
        </p>

        {availableDoctors.length === 0 ? (
          <p className={styles.empty}>No verified doctors found. Please ensure doctors are approved before assigning.</p>
        ) : (
          <ul className={styles.doctorList}>
            {availableDoctors.map((doctor) => (
              <li key={doctor.id} className={styles.doctorRow}>
                <div className={styles.doctorInfo}>
                  <span className={styles.doctorName}>{doctor.name}</span>
                  {doctor.specialization && (
                    <span className={styles.doctorSpec}>{doctor.specialization}</span>
                  )}
                  {doctor.availability && (
                    <span className={styles.doctorAvail}>
                      <i className="fa-regular fa-clock" aria-hidden="true" />
                      {doctor.availability}
                    </span>
                  )}
                </div>
                <Button variant="secondary" onClick={() => handleSelect(doctor)}>
                  Select
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  )
}

export default AssignDoctorModal
