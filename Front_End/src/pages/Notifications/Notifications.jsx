import { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationCard from '../../components/NotificationCard/NotificationCard';
import Button from '../../components/Button/Button';
import EmptyState from '../../components/EmptyState/EmptyState';
import { cx } from '../../utils/classNames';
import styles from './Notifications.module.css';

const CATEGORIES = ['All', 'Sessions', 'Payments', 'Community', 'Messages'];

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = notifications.filter(
    (n) => activeCategory === 'All' || n.category === activeCategory.toLowerCase()
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Notifications</h1>
          <p className={styles.subtext}>Stay up to date on sessions, payments, and messages.</p>
        </div>
        <Button variant="ghost" onClick={markAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      <div className={styles.tabs}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={cx(styles.tab, activeCategory === cat && styles.tabActive)}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className={styles.list}>
          {filtered.map((n) => (
            <NotificationCard key={n.id} notification={n} onRead={markAsRead} />
          ))}
        </div>
      ) : (
        <EmptyState title="No notifications" description="You're all caught up!" />
      )}
    </div>
  );
}
