import { classNames } from '../../utils/classNames'
import styles from './MonthView.module.css'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function MonthView({ activeDate, sessions, selectedDate, onSelectDate }) {
  const year = activeDate.getFullYear()
  const month = activeDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = new Date(year, month, 1).getDay()

  const sessionsByDay = {}
  sessions.forEach((session) => {
    const date = new Date(session.startTime)
    if (date.getFullYear() === year && date.getMonth() === month) {
      const day = date.getDate()
      sessionsByDay[day] = (sessionsByDay[day] || 0) + 1
    }
  })

  const cells = [
    ...Array.from({ length: firstWeekday }).map(() => null),
    ...Array.from({ length: daysInMonth }).map((_, i) => i + 1),
  ]

  const isSelected = (day) =>
    day &&
    selectedDate.getFullYear() === year &&
    selectedDate.getMonth() === month &&
    selectedDate.getDate() === day

  const isToday = (day) => day && new Date().toDateString() === new Date(year, month, day).toDateString()

  return (
    <div className={styles.wrapper}>
      <div className={styles.weekdays}>
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className={styles.grid}>
        {cells.map((day, index) => (
          <button
            type="button"
            key={index}
            className={classNames(styles.cell, !day && styles.emptyCell, isSelected(day) && styles.selected, isToday(day) && styles.today)}
            disabled={!day}
            onClick={() => day && onSelectDate(new Date(year, month, day))}
          >
            {day && <span className={styles.dayNumber}>{day}</span>}
            {day && sessionsByDay[day] > 0 && <span className={styles.dot}>{sessionsByDay[day]}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MonthView
