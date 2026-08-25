import { MOCK_NOTIFICATIONS } from '../constants/mockData'
import { simulateLatency } from './apiClient'

let notifications = [...MOCK_NOTIFICATIONS]

export const notificationService = {
  async getAll() {
    return simulateLatency([...notifications])
  },

  async markAsRead(notificationId) {
    notifications = notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    return simulateLatency(notifications.find((n) => n.id === notificationId))
  },

  async markAllAsRead() {
    notifications = notifications.map((n) => ({ ...n, isRead: true }))
    return simulateLatency([...notifications])
  },
}
