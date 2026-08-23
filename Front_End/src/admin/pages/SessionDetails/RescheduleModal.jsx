import { useState } from 'react'
import Modal from '../../components/Modal/Modal'
import Button from '../../components/Button/Button'
import styles from './RescheduleModal.module.css'

function toDateTimeLocal(iso) {
  const date = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function RescheduleModal({ isOpen, onClose, session, onConfirm, isLoading }) {
  const [startTime, setStartTime] = useState(session ? toDateTimeLocal(session.startTime) : '')

  if (!session) return null

  const handleConfirm = () => {
    const newStart = new Date(startTime)
    const newEnd = new Date(newStart.getTime() + session.durationMinutes * 60000)
    onConfirm({ startTime: newStart.toISOString(), endTime: newEnd.toISOString() })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reschedule Session" size="sm">
      <label className={styles.field}>
        <span className={styles.label}>New Date & Time</span>
        <input
          type="datetime-local"
          className={styles.input}
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
        />
      </label>
      <div className={styles.actions}>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} isLoading={isLoading}>
          Confirm Reschedule
        </Button>
      </div>
    </Modal>
  )
}

export default RescheduleModal
