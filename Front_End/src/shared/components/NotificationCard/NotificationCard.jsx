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
  return (
    <button
      className={cx(styles.card, !notification.read && styles.unread)}
      onClick={() => onRead?.(notification.id)}
    >
      <span className={styles.iconWrap}>
        <FontAwesomeIcon icon={CATEGORY_ICON[notification.category] || faCalendarCheck} />
      </span>
      <span className={styles.content}>
        <span className={styles.title}>{notification.title}</span>
        <span className={styles.message}>{notification.message}</span>
      </span>
      <span className={styles.time}>{notification.time}</span>
    </button>
  );
}
