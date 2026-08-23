import { classNames } from '../../utils/classNames'
import SessionCard from '../../components/SessionCard/SessionCard'
import styles from './WeekView.module.css'

function getWeekDates(date) {
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay())
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

function WeekView({ activeDate, sessions, selectedDate, onSelectDate, findPatientName, findDoctorName, onSessionClick }) {
  const weekDates = getWeekDates(activeDate)

  const sessionsForDate = (date) =>
    sessions.filter((session) => new Date(session.startTime).toDateString() === date.toDateString())

  const selectedDaySessions = sessionsForDate(selectedDate)

  return (
    <div className={styles.wrapper}>
      <div className={styles.days}>
        {weekDates.map((date) => (
          <button
            key={date.toISOString()}
            type="button"
            className={classNames(
              styles.dayButton,
              date.toDateString() === selectedDate.toDateString() && styles.selected,
              date.toDateString() === new Date().toDateString() && styles.today,
            )}
            onClick={() => onSelectDate(date)}
          >
            <span className={styles.weekday}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
            <span className={styles.dayNumber}>{date.getDate()}</span>
            {sessionsForDate(date).length > 0 && <span className={styles.count}>{sessionsForDate(date).length}</span>}
          </button>
        ))}
      </div>

      <div className={styles.sessionList}>
        {selectedDaySessions.length === 0 && <p className={styles.emptyHint}>No sessions on this day.</p>}
        {selectedDaySessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            patientName={findPatientName(session.patientId)}
            doctorName={findDoctorName(session.doctorId)}
            onClick={onSessionClick}
          />
        ))}
      </div>
    </div>
  )
}

export default WeekView
