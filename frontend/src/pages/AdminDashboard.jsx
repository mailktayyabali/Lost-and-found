import { useState, useEffect } from "react";
import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import { adminApi } from "../services/adminApi";
import { getErrorMessage } from "../utils/errorHandler";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsResponse, activityResponse] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getActivityLog(),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data?.stats || statsResponse.data);
      }

      if (activityResponse.success) {
        const activities = activityResponse.data?.activities || activityResponse.data || [];
        setActivity(activities);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? "min" : "mins"} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
        <DashboardHeader />

        <div className="mb-8">
            <h1 className="text-2xl font-bold text-navy">Admin Overview</h1>
            <p className="text-slate text-sm">Welcome back, Admin</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Admin Stats */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard 
              title="Total Users" 
              value={stats.totalUsers?.toString() || "0"} 
              subtitle={`${stats.newUsersThisMonth || 0} this month`}
              icon={<i className="fa-solid fa-users text-2xl"></i>}
              type="info"
            />
            <StatCard 
              title="Active Reports" 
              value={stats.activeItems?.toString() || "0"} 
              subtitle="Needs review"
              icon={<i className="fa-solid fa-clipboard-list text-2xl"></i>}
              type="lost"
            />
            <StatCard 
              title="Resolved Cases" 
              value={stats.resolvedItems?.toString() || "0"} 
              subtitle="All time"
              icon={<i className="fa-solid fa-check-double text-2xl"></i>}
              type="found"
            />
            <StatCard 
              title="Total Items" 
              value={stats.totalItems?.toString() || "0"} 
              subtitle="All reports"
              icon={<i className="fa-solid fa-server text-2xl"></i>}
              type="claim"
            />
          </div>
        ) : null}

        {/* Admin Actions / Recent Logins Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-navy">Recent System Activity</h2>
                <button 
                  onClick={loadDashboardData}
                  className="text-sm text-teal font-medium hover:underline"
                >
                  Refresh
                </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <i className="fa-solid fa-spinner fa-spin text-2xl text-teal mb-2"></i>
                <p className="text-slate text-sm">Loading activity...</p>
              </div>
            ) : activity.length > 0 ? (
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                              <th className="py-3 font-medium pl-2">User</th>
                              <th className="py-3 font-medium">Action</th>
                              <th className="py-3 font-medium">Time</th>
                              <th className="py-3 font-medium text-right pr-2">Status</th>
                          </tr>
                      </thead>
                      <tbody className="text-sm">
                          {activity.slice(0, 10).map((item, index) => (
                            <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group">
                                <td className="py-3 font-medium text-navy pl-2 group-hover:text-teal transition-colors">
                                  {item.user?.email || item.userEmail || "Unknown"}
                                </td>
                                <td className="py-3 text-slate">{item.action || "Activity"}</td>
                                <td className="py-3 text-slate">
                                  {formatTimeAgo(item.createdAt || item.timestamp)}
                                </td>
                                <td className="py-3 text-right pr-2">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                    item.status === "success" || item.status === "approved"
                                      ? "bg-green-100 text-green-700"
                                      : item.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}>
                                    {item.status || "Active"}
                                  </span>
                                </td>
                            </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate">
                <p>No recent activity</p>
              </div>
            )}
        </div>
    </div>
  );
}
