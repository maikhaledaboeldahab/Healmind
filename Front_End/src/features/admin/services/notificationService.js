import { apiClient } from './apiClient';

export function normalizeNotification(n) {
  if (!n) return null;
  return {
    ...n,
    id: n._id || n.id,
    title: n.title || 'Notification',
    message: n.message || '',
    type: n.type || 'system',
    isRead: Boolean(n.isRead),
    createdAt: n.createdAt || new Date().toISOString(),
    link: n.link || null,
  };
}

export const notificationService = {
  async getAll() {
    const res = await apiClient.get('/notifications');
    const raw = res.data?.data || res.data?.notifications || res.data;
    return Array.isArray(raw) ? raw.map(normalizeNotification) : [];
  },

  async markAsRead(notificationId) {
    const res = await apiClient.patch(`/notifications/${notificationId}/read`);
    const raw = res.data?.data || res.data;
    return normalizeNotification(raw);
  },

  async markAllAsRead() {
    const res = await apiClient.patch('/notifications/read-all');
    const raw = res.data?.data || res.data;
    return Array.isArray(raw) ? raw.map(normalizeNotification) : [];
  },
};

export default notificationService;
