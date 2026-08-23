import { classNames } from '../../utils/classNames'
import { timeAgo } from '../../utils/formatDate'
import { NOTIFICATION_TYPE } from '../../constants/statusEnums'
import styles from './NotificationItem.module.css'

const ICON_MAP = {
  [NOTIFICATION_TYPE.DOCTOR_APPROVED]: 'fa-solid fa-user-doctor',
  [NOTIFICATION_TYPE.DOCTOR_REJECTED]: 'fa-solid fa-user-slash',
  [NOTIFICATION_TYPE.TICKET_CREATED]: 'fa-solid fa-ticket',
  [NOTIFICATION_TYPE.PAYMENT_COMPLETED]: 'fa-solid fa-sack-dollar',
  [NOTIFICATION_TYPE.SESSION_CANCELLED]: 'fa-solid fa-calendar-xmark',
  [NOTIFICATION_TYPE.COMMUNITY_APPROVED]: 'fa-solid fa-people-group',
}

function NotificationItem({ notification, onMarkAsRead }) {
  return (
    <div className={classNames(styles.item, !notification.isRead && styles.unread)}>
      <span className={styles.iconCircle}>
        <i className={ICON_MAP[notification.type] || 'fa-solid fa-bell'} aria-hidden="true" />
      </span>
      <div className={styles.body}>
        <p className={styles.message}>{notification.message}</p>
        <span className={styles.time}>{timeAgo(notification.createdAt)}</span>
      </div>
      {!notification.isRead && (
        <button type="button" className={styles.markRead} onClick={() => onMarkAsRead(notification.id)}>
          Mark as read
        </button>
      )}
    </div>
  )
}

export default NotificationItem
