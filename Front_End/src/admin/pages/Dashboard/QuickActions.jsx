import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card/Card'
import { ROUTE_PATHS } from '../../constants/routePaths'
import styles from './QuickActions.module.css'

const ACTIONS = [
  { label: 'Verify Doctors', icon: 'fa-solid fa-user-check', to: ROUTE_PATHS.DOCTOR_VERIFICATION },
  { label: 'Add Doctor', icon: 'fa-solid fa-user-plus', to: ROUTE_PATHS.DOCTOR_NEW },
  { label: 'Add Patient', icon: 'fa-solid fa-hospital-user', to: ROUTE_PATHS.PATIENT_NEW },
  { label: 'View Sessions', icon: 'fa-regular fa-calendar-check', to: ROUTE_PATHS.SESSIONS_CALENDAR },
  { label: 'Generate Report', icon: 'fa-solid fa-chart-line', to: ROUTE_PATHS.REPORTS },
]

function QuickActions() {
  const navigate = useNavigate()

  return (
    <Card>
      <h2 className={styles.title}>Quick Actions</h2>
      <div className={styles.grid}>
        {ACTIONS.map((action) => (
          <button key={action.label} type="button" className={styles.action} onClick={() => navigate(action.to)}>
            <span className={styles.icon}>
              <i className={action.icon} aria-hidden="true" />
            </span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </Card>
  )
}

export default QuickActions
