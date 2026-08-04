import { Bell, GraduationCap, Star, CheckCircle2 } from "lucide-react";
import { formatDate } from "../../../utils/formatters";
import { cn } from "../../../utils/cn";

const TYPE_ICONS = {
  enrollment: GraduationCap,
  course_status: CheckCircle2,
  review: Star,
  system: Bell,
};

function NotificationItem({ notification, onMarkAsRead }) {
  const Icon = TYPE_ICONS[notification.type] || Bell;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border border-ink/10 p-4 transition-colors",
        !notification.isRead && "bg-inkblue-light/40"
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-inkblue-light text-inkblue">
        <Icon size={16} />
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-ink">{notification.title}</p>
          {!notification.isRead && (
            <button
              onClick={() => onMarkAsRead?.(notification._id)}
              className="shrink-0 text-xs font-medium text-inkblue hover:underline"
            >
              Mark read
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-ink-soft">{notification.message}</p>
        <p className="mt-1 text-xs text-ink-soft/70">{formatDate(notification.createdAt)}</p>
      </div>
    </div>
  );
}

export default NotificationItem;
