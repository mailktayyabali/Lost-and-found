import { useState } from "react";
import { useSearchAlerts } from "../context/SearchAlertsContext";
import { useAuth } from "../context/AuthContext";
import AlertCard from "../components/AlertCard";
import CreateAlertModal from "../components/CreateAlertModal";
import { Link } from "react-router-dom";
import { Bell, Plus } from "lucide-react";

function SearchAlerts() {
  const { alerts, createAlert, notifications, markNotificationAsRead, markAllAsRead, getUnreadCount } = useSearchAlerts();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const unreadCount = getUnreadCount();

  if (!user) {
    return (
      <div className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-hidden">
        <div className="max-w-4xl mx-auto text-center py-20">
          <Bell size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-navy mb-2">Sign in required</h2>
          <p className="text-slate mb-6">Please sign in to manage your search alerts.</p>
          <Link
            to="/auth"
            className="inline-block px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal-dark transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleCreateAlert = (alertData) => {
    createAlert(alertData);
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Search Alerts</h1>
            <p className="text-gray-600">
              Get notified when items matching your criteria are posted.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors font-medium"
          >
            <Plus size={18} />
            Create Alert
          </button>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-navy">
                Notifications ({unreadCount} unread)
              </h2>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-teal hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="space-y-2">
              {notifications.slice(0, 5).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg border ${
                    notif.read ? "bg-gray-50 border-gray-100" : "bg-teal/5 border-teal/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/item/${notif.itemId}`}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className="flex-1"
                    >
                      <p className="text-sm font-medium text-navy">
                        New match for "{notif.alertName}": {notif.itemTitle}
                      </p>
                      <p className="text-xs text-slate mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </Link>
                    {!notif.read && (
                      <span className="w-2 h-2 bg-teal rounded-full ml-2"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts List */}
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-navy mb-2">No alerts yet</h3>
            <p className="text-slate mb-6">
              Create search alerts to get notified when matching items are posted.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors font-medium"
            >
              Create Your First Alert
            </button>
          </div>
        )}

        {/* Create Alert Modal */}
        <CreateAlertModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateAlert}
        />
      </div>
    </div>
  );
}

export default SearchAlerts;

