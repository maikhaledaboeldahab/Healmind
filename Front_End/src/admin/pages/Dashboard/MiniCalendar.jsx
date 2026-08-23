import { useMemo } from 'react'
import Card from '../../components/Card/Card'
import styles from './MiniCalendar.module.css'

function MiniCalendar({ sessions }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = new Date(year, month, 1).getDay()

  const sessionDays = useMemo(() => {
    const set = new Set()
    sessions.forEach((session) => {
      const date = new Date(session.startTime)
      if (date.getFullYear() === year && date.getMonth() === month) {
        set.add(date.getDate())
      }
    })
    return set
  }, [sessions, year, month])

  const cells = [
    ...Array.from({ length: firstWeekday }).map(() => null),
    ...Array.from({ length: daysInMonth }).map((_, i) => i + 1),
  ]

  return (
    <Card>
      <div className={styles.header}>
        <h2 className={styles.title}>{today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
        <i className="fa-regular fa-calendar" aria-hidden="true" />
      </div>
      <div className={styles.grid}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <span key={`${day}-${i}`} className={styles.weekday}>
            {day}
          </span>
        ))}
        {cells.map((day, index) => (
          <span
            key={index}
            className={[
              styles.cell,
              day === today.getDate() ? styles.today : '',
              day && sessionDays.has(day) ? styles.hasSession : '',
            ].join(' ')}
          >
            {day || ''}
          </span>
        ))}
      </div>
    </Card>
  )
}

export default MiniCalendar
