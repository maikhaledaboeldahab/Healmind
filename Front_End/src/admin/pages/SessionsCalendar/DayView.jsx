import SessionCard from '../../components/SessionCard/SessionCard'
import styles from './DayView.module.css'

function DayView({ selectedDate, sessions, findPatientName, findDoctorName, onSessionClick }) {
  const daySessions = sessions
    .filter((session) => new Date(session.startTime).toDateString() === selectedDate.toDateString())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>
        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </h3>
      {daySessions.length === 0 ? (
        <p className={styles.emptyHint}>No sessions scheduled for this day.</p>
      ) : (
        <div className={styles.list}>
          {daySessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              patientName={findPatientName(session.patientId)}
              doctorName={findDoctorName(session.doctorId)}
              onClick={onSessionClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default DayView
