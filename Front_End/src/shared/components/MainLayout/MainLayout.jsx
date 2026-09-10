import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={styles.shell}>
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className={styles.content}>
        <Navbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
      <button
        type="button"
        className={styles.floatingChat}
        onClick={() => navigate('/messages')}
        aria-label="Open chat"
        title="Open chat"
      >
        <FontAwesomeIcon icon={faComments} />
      </button>
    </div>
  );
}
