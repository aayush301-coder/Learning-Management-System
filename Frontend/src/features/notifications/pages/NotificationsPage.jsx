import { useEffect } from "react";
import { toast } from "sonner";
import { CheckCheck } from "lucide-react";

import { useNotifications } from "../hooks/useNotifications";
import NotificationItem from "../components/NotificationItem";
import Button from "../../../components/ui/Button";
import Loader from "../../../components/common/Loader";
import ErrorState from "../../../components/common/ErrorState";
import EmptyState from "../../../components/common/EmptyState";

function NotificationsPage() {
  const { notifications, unreadCount, loading, error, fetchNotifications, markAsRead, markAllAsRead } =
    useNotifications();

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      await fetchNotifications();
    } catch {
      toast.error("Failed to mark notification as read.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read.");
      await fetchNotifications();
    } catch {
      toast.error("Failed to mark all as read.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Notifications</h1>
          <p className="mt-1 text-sm text-ink-soft">{unreadCount} unread</p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCheck size={14} className="mr-1.5 inline" />
            Mark all read
          </Button>
        )}
      </div>

      {loading ? (
        <Loader text="Loading notifications..." />
      ) : error ? (
        <ErrorState description={error} />
      ) : notifications.length === 0 ? (
        <EmptyState title="No notifications" description="You're all caught up." />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationItem key={notification._id} notification={notification} onMarkAsRead={handleMarkAsRead} />
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
