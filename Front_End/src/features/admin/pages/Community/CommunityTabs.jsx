import { NavLink } from 'react-router-dom'
import { classNames } from '../../utils/classNames'
import { ROUTE_PATHS } from '../../constants/routePaths'
import styles from './CommunityTabs.module.css'

const TABS = [
  { to: ROUTE_PATHS.COMMUNITY_POSTS, label: 'Posts', icon: 'fa-regular fa-note-sticky' },
  { to: ROUTE_PATHS.COMMUNITY_COMMENTS, label: 'Comments', icon: 'fa-regular fa-comment' },
]

function CommunityTabs() {
  return (
    <div className={styles.tabs}>
      {TABS.map((tab) => (
        <NavLink key={tab.to} to={tab.to} className={({ isActive }) => classNames(styles.tab, isActive && styles.active)}>
          <i className={tab.icon} aria-hidden="true" />
          {tab.label}
        </NavLink>
      ))}
    </div>
  )
}

export default CommunityTabs
