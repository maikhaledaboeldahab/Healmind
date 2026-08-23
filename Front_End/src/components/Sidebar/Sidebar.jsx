import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge,
  faUserDoctor,
  faCalendarCheck,
  faComments,
  faTicket,
  faUsers,
  faRobot,
  faEnvelope,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { cx } from '../../utils/classNames';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: faGauge },
  { to: '/doctors', label: 'Doctors', icon: faUserDoctor },
  { to: '/sessions/upcoming', label: 'Appointments', icon: faCalendarCheck },
  { to: '/messages', label: 'Messages', icon: faComments },
  { to: '/tickets', label: 'Tickets', icon: faTicket },
  { to: '/community', label: 'Community', icon: faUsers },
  { to: '/ai-assistant', label: 'AI Assistant', icon: faRobot },
  { to: '/contact', label: 'Contact Us', icon: faEnvelope },
];

export default function Sidebar({ mobileOpen = false, onClose }) {
  return (
    <>
      {mobileOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={cx(styles.sidebar, mobileOpen && styles.open)}>
        <div className={styles.brand}>
          <span className={styles.brandName}>HealMind</span>
          <span className={styles.brandTag}>Mental Wellness</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => cx(styles.navItem, isActive && styles.active)}
            >
              <FontAwesomeIcon icon={item.icon} className={styles.navIcon} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <NavLink
            to="/profile"
            className={({ isActive }) => cx(styles.navItem, isActive && styles.active)}
          >
            <FontAwesomeIcon icon={faGear} className={styles.navIcon} />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  );
}
