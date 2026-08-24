import { NavLink } from 'react-router-dom'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { classNames } from '../../utils/classNames'
import { useAuth } from '../../hooks/useAuth'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'fa-solid fa-gauge-high', to: ROUTE_PATHS.DASHBOARD, end: true },
  { label: 'Doctor Verification', icon: 'fa-solid fa-user-check', to: ROUTE_PATHS.DOCTOR_VERIFICATION },
  { label: 'Doctors', icon: 'fa-solid fa-user-doctor', to: ROUTE_PATHS.DOCTORS },
  { label: 'Patients', icon: 'fa-solid fa-hospital-user', to: ROUTE_PATHS.PATIENTS },
  { label: 'Tickets', icon: 'fa-solid fa-ticket', to: ROUTE_PATHS.TICKETS },
  { label: 'Sessions', icon: 'fa-solid fa-calendar-days', to: ROUTE_PATHS.SESSIONS },
  { label: 'Payments', icon: 'fa-solid fa-sack-dollar', to: ROUTE_PATHS.PAYMENTS },
  { label: 'Community', icon: 'fa-solid fa-people-group', to: ROUTE_PATHS.COMMUNITY_POSTS },
  { label: 'Contact Us', icon: 'fa-solid fa-envelope', to: ROUTE_PATHS.CONTACTS },
  { label: 'Reports', icon: 'fa-solid fa-chart-line', to: ROUTE_PATHS.REPORTS },
  { label: 'Notifications', icon: 'fa-solid fa-bell', to: ROUTE_PATHS.NOTIFICATIONS },
  { label: 'Settings', icon: 'fa-solid fa-gear', to: ROUTE_PATHS.SETTINGS },
  { label: 'My Profile', icon: 'fa-solid fa-id-badge', to: ROUTE_PATHS.PROFILE },
]

function Sidebar({ isCollapsed, onToggle }) {
  const { logout } = useAuth()

  return (
    <aside className={classNames(styles.sidebar, isCollapsed && styles.collapsed)}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>
          <i className="fa-solid fa-leaf" aria-hidden="true" />
        </span>
        {!isCollapsed && <span className={styles.brandName}>HealMind</span>}
        <button type="button" className={styles.collapseButton} onClick={onToggle} aria-label="Toggle sidebar">
          <i className={isCollapsed ? 'fa-solid fa-angles-right' : 'fa-solid fa-angles-left'} aria-hidden="true" />
        </button>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => classNames(styles.navItem, isActive && styles.active)}
            title={item.label}
          >
            <i className={item.icon} aria-hidden="true" />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button type="button" className={styles.logout} onClick={logout} title="Logout">
        <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
        {!isCollapsed && <span>Logout</span>}
      </button>
    </aside>
  )
}

export default Sidebar
