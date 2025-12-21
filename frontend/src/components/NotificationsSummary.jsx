import { Link } from "react-router-dom";
import { useMessaging } from "../context/MessagingContext";
import { useSearchAlerts } from "../context/SearchAlertsContext";
import { Bell, MessageSquare } from "lucide-react";

function NotificationsSummary() {
  const { getUnreadCount: getMessageUnreadCount } = useMessaging();
  const { notifications, getUnreadCount: getAlertUnreadCount } = useSearchAlerts();
  
  const messageUnreadCount = getMessageUnreadCount();
  const alertUnreadCount = getAlertUnreadCount();
  const recentNotifications = notifications
    .filter((n) => !n.read)
    .slice(0, 3);

  const totalUnread = messageUnreadCount + alertUnreadCount;

  if (totalUnread === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-navy">Notifications</h2>
          <Bell size={20} className="text-gray-300" />
        </div>
        <div className="text-center py-6 text-slate">
          <p className="text-sm">All caught up! No new notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-navy">Notifications</h2>
          <span className="bg-teal text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {totalUnread}
          </span>
        </div>
        <Link
          to="/messages"
          className="text-sm text-teal hover:underline font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {messageUnreadCount > 0 && (
          <Link
            to="/messages"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <MessageSquare size={18} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-navy text-sm">
                {messageUnreadCount} unread message{messageUnreadCount !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-slate">New conversations waiting</p>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-400"></i>
          </Link>
        )}

        {alertUnreadCount > 0 && (
          <Link
            to="/search-alerts"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
              <Bell size={18} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-navy text-sm">
                {alertUnreadCount} alert notification{alertUnreadCount !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-slate">New items match your alerts</p>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-400"></i>
          </Link>
        )}

        {recentNotifications.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-slate font-medium mb-2">Recent Matches:</p>
            {recentNotifications.map((notif) => (
              <Link
                key={notif.id}
                to={`/item/${notif.itemId}`}
                className="block p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <p className="text-navy font-medium truncate">{notif.itemTitle}</p>
                <p className="text-xs text-slate">Matches "{notif.alertName}"</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsSummary;

