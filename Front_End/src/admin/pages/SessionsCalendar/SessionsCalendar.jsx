import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import Card from '../../components/Card/Card.jsx'
import Button from '../../components/Button/Button.jsx'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx'
import { classNames } from '../../utils/classNames'
import { useCalendarData } from './useCalendarData.js'
import MonthView from './MonthView.jsx'
import WeekView from './WeekView.jsx'
import DayView from './DayView.jsx'
import { buildPath, ROUTE_PATHS } from '../../constants/routePaths'
import styles from './SessionsCalendar.module.css'

const VIEW_MODES = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
]

function SessionsCalendar() {
  const { isLoading, sessions, findPatientName, findDoctorName } = useCalendarData()
  const [viewMode, setViewMode] = useState('monthly')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const navigate = useNavigate()

  const handleSessionClick = (session) => navigate(buildPath(ROUTE_PATHS.SESSION_DETAILS, { sessionId: session.id }))

  const shiftDate = (direction) => {
    const next = new Date(selectedDate)
    if (viewMode === 'monthly') next.setMonth(next.getMonth() + direction)
    else if (viewMode === 'weekly') next.setDate(next.getDate() + direction * 7)
    else next.setDate(next.getDate() + direction)
    setSelectedDate(next)
  }

  return (
    <div>
      <PageHeader
        title="Sessions Calendar"
        description="Visualize sessions by day, week, or month across all doctors and patients."
        actions={
          <Button variant="secondary" icon="fa-solid fa-list" onClick={() => navigate(ROUTE_PATHS.SESSIONS)}>
            List View
          </Button>
        }
      />

      <Card>
        <div className={styles.toolbar}>
          <div className={styles.viewSwitch}>
            {VIEW_MODES.map((mode) => (
              <button
                key={mode.key}
                type="button"
                className={classNames(styles.viewButton, viewMode === mode.key && styles.activeView)}
                onClick={() => setViewMode(mode.key)}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div className={styles.dateNav}>
            <button type="button" className={styles.navButton} onClick={() => shiftDate(-1)} aria-label="Previous">
              <i className="fa-solid fa-chevron-left" aria-hidden="true" />
            </button>
            <span className={styles.currentLabel}>
              {viewMode === 'monthly'
                ? selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button type="button" className={styles.navButton} onClick={() => shiftDate(1)} aria-label="Next">
              <i className="fa-solid fa-chevron-right" aria-hidden="true" />
            </button>
            <Button variant="ghost" onClick={() => setSelectedDate(new Date())}>
              Today
            </Button>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner label="Loading sessions…" />
        ) : (
          <>
            {viewMode === 'monthly' && (
              <MonthView
                activeDate={selectedDate}
                sessions={sessions}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            )}
            {viewMode === 'weekly' && (
              <WeekView
                activeDate={selectedDate}
                sessions={sessions}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                findPatientName={findPatientName}
                findDoctorName={findDoctorName}
                onSessionClick={handleSessionClick}
              />
            )}
            {viewMode === 'daily' && (
              <DayView
                selectedDate={selectedDate}
                sessions={sessions}
                findPatientName={findPatientName}
                findDoctorName={findDoctorName}
                onSessionClick={handleSessionClick}
              />
            )}

            {viewMode === 'monthly' && (
              <div className={styles.dayDetails}>
                <DayView
                  selectedDate={selectedDate}
                  sessions={sessions}
                  findPatientName={findPatientName}
                  findDoctorName={findDoctorName}
                  onSessionClick={handleSessionClick}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}

export default SessionsCalendar
