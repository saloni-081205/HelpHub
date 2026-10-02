import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAllAsRead = async () => {
    await api.patch('/notifications/read-all');
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const deleteOne = async (id) => {
    const target = notifications.find((n) => n._id === id);
    await api.delete(`/notifications/${id}`);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    if (target && !target.isRead) setUnreadCount((c) => Math.max(0, c - 1));
  };

  const clearAll = async () => {
    await api.delete('/notifications/clear-all');
    setNotifications([]);
    setUnreadCount(0);
  };

  // Initial fetch + periodic polling (every 25s) — no Socket.io required
  useEffect(() => {
    fetchNotifications();
    if (!user) return;
    const t = setInterval(fetchNotifications, 25000);
    return () => clearInterval(t);
  }, [fetchNotifications, user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteOne,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);