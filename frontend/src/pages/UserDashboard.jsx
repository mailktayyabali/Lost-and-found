import { useState, useEffect } from "react";
import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import ActivityTable from "../components/ActivityTable";
import QuickActions from "../components/QuickActions";
import RecentMessagesWidget from "../components/RecentMessagesWidget";
import FavoritesWidget from "../components/FavoritesWidget";
import SearchAlertsWidget from "../components/SearchAlertsWidget";
import ActivityTimeline from "../components/ActivityTimeline";
import StatsOverview from "../components/StatsOverview";
import PerformanceChart from "../components/PerformanceChart";
import NotificationsSummary from "../components/NotificationsSummary";
import RecentItemsWidget from "../components/RecentItemsWidget";
import { useFavorites } from "../context/FavoritesContext";
import { useMessaging } from "../context/MessagingContext";
import { useSearchAlerts } from "../context/SearchAlertsContext";
import { useAuth } from "../context/AuthContext";
import { usersApi } from "../services/usersApi";

export default function UserDashboard() {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { alerts } = useSearchAlerts();

  const [stats, setStats] = useState({
    lostItems: 0,
    foundItems: 0,
    resolvedItems: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const response = await usersApi.getUserStats(user.id);
        if (response.success) {
          const fetchedStats = response.data.stats || response.data || {};
          setStats({
            lostItems: fetchedStats.lostItems || 0,
            foundItems: fetchedStats.foundItems || 0,
            resolvedItems: fetchedStats.resolvedItems || 0,
            totalItems: fetchedStats.totalItems || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const activeAlerts = alerts?.filter((a) => a.active)?.length || 0;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <DashboardHeader />

      {/* Quick Stats Overview */}
      <StatsOverview />

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 mt-6">
        <StatCard
          title="Total Lost Items"
          value={stats.lostItems}
          subtitle={stats.lostItems > 0 ? `${stats.lostItems} active report${stats.lostItems !== 1 ? 's' : ''}` : "No lost items reported"}
          icon={<i className="fa-solid fa-magnifying-glass text-2xl"></i>}
          type="lost"
        />
        <StatCard
          title="Total Found Items"
          value={stats.foundItems}
          subtitle={stats.foundItems > 0 ? `${stats.foundItems} active report${stats.foundItems !== 1 ? 's' : ''}` : "No found items reported"}
          icon={<i className="fa-solid fa-check-circle text-2xl"></i>}
          type="found"
        />
        <StatCard
          title="Claimed Items"
          value={stats.resolvedItems}
          subtitle={stats.resolvedItems > 0 ? "Successfully resolved" : "No resolved items yet"}
          icon={<i className="fa-solid fa-box text-2xl"></i>}
          type="claim"
        />
        <StatCard
          title="Active Alerts"
          value={activeAlerts}
          subtitle={activeAlerts > 0 ? "Monitoring for matches" : "No active alerts"}
          icon={<i className="fa-solid fa-bell text-2xl"></i>}
          type="info"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Quick Actions & Notifications */}
        <div className="lg:col-span-1 space-y-6">
          <QuickActions />
          <NotificationsSummary />
        </div>

        {/* Middle Column - Widgets */}
        <div className="lg:col-span-1 space-y-6">
          <RecentMessagesWidget />
          <FavoritesWidget />
          <RecentItemsWidget />
        </div>

        {/* Right Column - Alerts & Timeline */}
        <div className="lg:col-span-1 space-y-6">
          <SearchAlertsWidget />
          <ActivityTimeline />
        </div>
      </div>

      {/* Performance Chart & Activity Table Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Performance Chart */}
        <div className="lg:col-span-1">
          <PerformanceChart
            data={[
              {
                label: "Lost Items",
                value: stats.lostItems,
                color: "bg-red-500",
              },
              {
                label: "Found Items",
                value: stats.foundItems,
                color: "bg-green-500",
              },
              {
                label: "Resolved",
                value: stats.resolvedItems,
                color: "bg-blue-500",
              },
              {
                label: "Favorites",
                value: favorites?.length || 0,
                color: "bg-pink-500",
              },
            ]}
          />
        </div>

        {/* Activity Table - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ActivityTable />
        </div>
      </div>
    </div>
  );
}
