import { Link } from "react-router-dom";
import { useSearchAlerts } from "../context/SearchAlertsContext";
import { Bell, Plus } from "lucide-react";

function SearchAlertsWidget() {
  const { alerts, notifications, getUnreadCount } = useSearchAlerts();
  const unreadCount = getUnreadCount();
  const activeAlerts = alerts.filter((alert) => alert.active).slice(0, 3);

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-navy">Search Alerts</h2>
          <Link
            to="/search-alerts"
            className="text-sm text-teal hover:underline font-medium"
          >
            Manage
          </Link>
        </div>
        <div className="text-center py-8 text-slate">
          <Bell size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm mb-3">No alerts set up</p>
          <Link
            to="/search-alerts"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Create Alert
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-navy">Search Alerts</h2>
          {unreadCount > 0 && (
            <span className="bg-teal text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <Link
          to="/search-alerts"
          className="text-sm text-teal hover:underline font-medium"
        >
          Manage
        </Link>
      </div>
      <div className="space-y-3">
        {activeAlerts.map((alert) => (
          <div
            key={alert.id}
            className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-navy text-sm">{alert.name}</p>
                <p className="text-xs text-slate mt-1">
                  {alert.filters.type && `${alert.filters.type} • `}
                  {alert.filters.category || "All categories"}
                </p>
              </div>
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                  alert.active ? "bg-teal" : "bg-gray-300"
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>
      {alerts.length > 3 && (
        <Link
          to="/search-alerts"
          className="block text-center text-sm text-teal hover:underline font-medium mt-3 pt-3 border-t border-gray-100"
        >
          View all {alerts.length} alerts
        </Link>
      )}
    </div>
  );
}

export default SearchAlertsWidget;

