import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faBell,
  faBars,
  faRightFromBracket,
  faUser,
  faChevronDown,
  faCalendarCheck,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useClickOutside } from '../../hooks/useClickOutside';
import Avatar from '../Avatar/Avatar';
import styles from './Navbar.module.css';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => setMenuOpen(false));

  const userName = user?.fullName || user?.name || 'Patient';
  const userEmail = user?.email || '';
  const userAvatar = user?.avatar || user?.profileImage || user?.image || '';

  return (
    <header className={styles.navbar}>
      <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Open menu">
        <FontAwesomeIcon icon={faBars} />
      </button>

      <div className={styles.search}>
        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
        <input
          type="search"
          placeholder="Search specialists, therapies..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') navigate(`/doctors?q=${encodeURIComponent(e.target.value)}`);
          }}
        />
      </div>

      <div className={styles.actions}>
        <button
          className={styles.iconBtn}
          onClick={() => navigate('/notifications')}
          aria-label="Notifications"
        >
          <FontAwesomeIcon icon={faBell} />
          {unreadCount > 0 && <span className={styles.dot}>{unreadCount}</span>}
        </button>

        <div className={styles.menuWrap} ref={menuRef}>
          <button
            type="button"
            className={`${styles.profileBtn} ${menuOpen ? styles.profileBtnActive : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <Avatar
              src={userAvatar}
              name={userName}
              size="sm"
              status="online"
              className={styles.avatarImg}
            />
            <div className={styles.userMeta}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userRole}>Patient</span>
            </div>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`${styles.chevron} ${menuOpen ? styles.chevronOpen : ''}`}
            />
          </button>

          {menuOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <Avatar src={userAvatar} name={userName} size="md" />
                <div className={styles.dropdownHeaderInfo}>
                  <p className={styles.dropdownName}>{userName}</p>
                  {userEmail && <p className={styles.dropdownEmail}>{userEmail}</p>}
                  <span className={styles.roleBadge}>Patient Account</span>
                </div>
              </div>

              <div className={styles.dropdownDivider} />

              <div className={styles.dropdownMenu}>
                <button
                  type="button"
                  className={styles.dropdownItem}
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/profile');
                  }}
                >
                  <FontAwesomeIcon icon={faUser} className={styles.menuIcon} />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  className={styles.dropdownItem}
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/sessions/upcoming');
                  }}
                >
                  <FontAwesomeIcon icon={faCalendarCheck} className={styles.menuIcon} />
                  <span>Appointments</span>
                </button>

                <button
                  type="button"
                  className={styles.dropdownItem}
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/notifications');
                  }}
                >
                  <FontAwesomeIcon icon={faBell} className={styles.menuIcon} />
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className={styles.itemBadge}>{unreadCount}</span>
                  )}
                </button>

                <button
                  type="button"
                  className={styles.dropdownItem}
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/tickets');
                  }}
                >
                  <FontAwesomeIcon icon={faTicket} className={styles.menuIcon} />
                  <span>Support Tickets</span>
                </button>
              </div>

              <div className={styles.dropdownDivider} />

              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.logoutItem}`}
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
              >
                <FontAwesomeIcon icon={faRightFromBracket} className={styles.menuIcon} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

