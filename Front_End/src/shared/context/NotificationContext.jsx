import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { getSocket } from '../services/socket';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    const token = window.localStorage.getItem('healmind_token');
    if (!token) {
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/notifications');
      const raw = res.data?.data || res.data?.notifications || res.data;
      if (Array.isArray(raw)) {
        setNotifications(
          raw.map((n) => ({
            ...n,
            id: n._id || n.id,
            title: n.title || 'Notification',
            message: n.message || '',
            read: Boolean(n.isRead ?? n.read),
            createdAt: n.createdAt || new Date().toISOString(),
          }))
        );
      }
    } catch {
      // If unauthenticated or offline, keep notifications as empty array
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    const socket = getSocket();
    const handleNewNotification = (notification) => {
      if (notification) {
        setNotifications((prev) => [
          {
            ...notification,
            id: notification._id || notification.id || Date.now(),
            read: false,
            createdAt: notification.createdAt || new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    };

    socket.on('notification', handleNewNotification);
    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('notification', handleNewNotification);
      socket.off('new_notification', handleNewNotification);
    };
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {
      // Keep optimistic update
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.patch('/notifications/read-all');
    } catch {
      // Keep optimistic update
    }
  };

  const value = useMemo(
    () => ({ notifications, unreadCount, loading, markAsRead, markAllAsRead, refreshNotifications: fetchNotifications }),
    [notifications, unreadCount, loading, fetchNotifications]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider');
  return ctx;
}
