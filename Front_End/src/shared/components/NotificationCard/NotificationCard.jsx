import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faCreditCard,
  faUsers,
  faComments,
} from '@fortawesome/free-solid-svg-icons';
import { cx } from '../../utils/classNames';
import styles from './NotificationCard.module.css';

const CATEGORY_ICON = {
  sessions: faCalendarCheck,
  payments: faCreditCard,
  community: faUsers,
  messages: faComments,
};

export default function NotificationCard({ notification, onRead }) {
  const navigate = useNavigate();

  const handleClick = () => {
    onRead?.(notification.id);
    if (notification.type === 'new_message' || notification.category === 'messages') {
      const targetPath = notification.senderId ? `/messages/${notification.senderId}` : '/messages';
      navigate(targetPath);
    }
  };

  const displayTime = notification.createdAt
    ? new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : (notification.time || '');

  return (
    <button
      className={cx(styles.card, !notification.read && styles.unread)}
      onClick={handleClick}
    >
      <span className={styles.iconWrap}>
        <FontAwesomeIcon icon={CATEGORY_ICON[notification.category] || faCalendarCheck} />
      </span>
      <span className={styles.content}>
        <span className={styles.title}>{notification.title}</span>
        <span className={styles.message}>{notification.message}</span>
      </span>
      <span className={styles.time}>{displayTime}</span>
    </button>
  );
}
