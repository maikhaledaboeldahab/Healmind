import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import EmptyState from '../../components/EmptyState/EmptyState'
import NotificationItem from '../../components/NotificationItem/NotificationItem'
import { notificationService } from '../../services/notificationService'
import styles from './Notifications.module.css'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadNotifications = () => {
    setIsLoading(true)
    notificationService.getAll().then((result) => {
      setNotifications(result)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const handleMarkAsRead = async (id) => {
    await notificationService.markAsRead(id)
    loadNotifications()
  }

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead()
    loadNotifications()
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={`You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.`}
        actions={
          unreadCount > 0 && (
            <Button variant="secondary" icon="fa-solid fa-check-double" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )
        }
      />

      <Card>
        {isLoading ? (
          <LoadingSpinner label="Loading notifications…" />
        ) : notifications.length === 0 ? (
          <EmptyState icon="fa-regular fa-bell" title="No notifications" description="You're all caught up." />
        ) : (
          <div className={styles.list}>
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default Notifications
