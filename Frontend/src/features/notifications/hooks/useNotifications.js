import { useState, useCallback } from "react";
import {
  getMyNotificationsRequest,
  markNotificationAsReadRequest,
  markAllNotificationsAsReadRequest,
} from "../api/notificationApi";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getMyNotificationsRequest(params);
      setNotifications(data?.data?.notifications || []);
      setUnreadCount(data?.data?.unreadCount || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    const { data } = await markNotificationAsReadRequest(notificationId);
    return data?.data;
  }, []);

  const markAllAsRead = useCallback(async () => {
    await markAllNotificationsAsReadRequest();
  }, []);

  return { notifications, unreadCount, loading, error, fetchNotifications, markAsRead, markAllAsRead };
}

export default useNotifications;
