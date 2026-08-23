import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../../components/Avatar/Avatar'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { useAuth } from '../../hooks/useAuth'
import { notificationService } from '../../services/notificationService'
import styles from './Navbar.module.css'

function Navbar({ onToggleSidebar }) {
  const { admin } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    let isMounted = true
    notificationService.getAll().then((notifications) => {
      if (isMounted) setUnreadCount(notifications.filter((n) => !n.isRead).length)
    })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <header className={styles.navbar}>
      <button type="button" className={styles.menuButton} onClick={onToggleSidebar} aria-label="Toggle navigation">
        <i className="fa-solid fa-bars" aria-hidden="true" />
      </button>

      <div className={styles.searchWrapper}>
        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
        <input type="search" placeholder="Search doctors, patients, tickets…" className={styles.search} />
      </div>

      <div className={styles.rightSection}>
        <Link to={ROUTE_PATHS.NOTIFICATIONS} className={styles.iconButton} aria-label="Notifications">
          <i className="fa-solid fa-bell" aria-hidden="true" />
          {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
        </Link>
        <Link to={ROUTE_PATHS.PROFILE} className={styles.profileLink}>
          <Avatar name={admin?.name} size="sm" />
          <span className={styles.adminName}>{admin?.name}</span>
        </Link>
      </div>
    </header>
  )
}

export default Navbar
