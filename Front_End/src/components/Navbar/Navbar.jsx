import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faBell,
  faBars,
  faRightFromBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useClickOutside } from '../../hooks/useClickOutside';
import styles from './Navbar.module.css';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => setMenuOpen(false));

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
          <button className={styles.avatarBtn} onClick={() => setMenuOpen((o) => !o)}>
            <img src={user?.avatar} alt={user?.fullName} className={styles.avatar} />
          </button>

          {menuOpen && (
            <div className={styles.dropdown}>
              <p className={styles.dropdownName}>{user?.fullName}</p>
              <p className={styles.dropdownEmail}>{user?.email}</p>
              <button onClick={() => { setMenuOpen(false); navigate('/profile'); }}>
                <FontAwesomeIcon icon={faUser} /> Profile
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
              >
                <FontAwesomeIcon icon={faRightFromBracket} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
