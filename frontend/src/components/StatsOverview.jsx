import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useMessaging } from "../context/MessagingContext";
import { useSearchAlerts } from "../context/SearchAlertsContext";
import { useUserProfiles } from "../context/UserProfileContext";
import { useAuth } from "../context/AuthContext";
import { Heart, MessageSquare, Bell, Star } from "lucide-react";
import { useState, useEffect } from "react";

function StatsOverview() {
  const { user } = useAuth();
  const { getFavoriteCount } = useFavorites();
  const { getUnreadCount: getMessageUnreadCount } = useMessaging();
  const { getUnreadCount: getAlertUnreadCount } = useSearchAlerts();
  const { getUserStats } = useUserProfiles();
  const [userRating, setUserRating] = useState(null);

  const favoriteCount = getFavoriteCount();
  const messageUnreadCount = getMessageUnreadCount();
  const alertUnreadCount = getAlertUnreadCount();

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      if (user?.id) {
        const stats = await getUserStats(user.id);
        if (stats) {
          setUserRating(stats.rating);
        }
      }
    };
    fetchStats();
  }, [user, getUserStats]);

  const stats = [
    {
      icon: <Heart size={20} />,
      label: "Favorites",
      value: favoriteCount,
      color: "text-red-500 bg-red-50",
      link: "/favorites",
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Messages",
      value: messageUnreadCount,
      color: "text-blue-500 bg-blue-50",
      link: "/messages",
      badge: messageUnreadCount > 0,
    },
    {
      icon: <Bell size={20} />,
      label: "Alerts",
      value: alertUnreadCount,
      color: "text-amber-500 bg-amber-50",
      link: "/search-alerts",
      badge: alertUnreadCount > 0,
    },
    {
      icon: <Star size={20} />,
      label: "My Rating",
      value: userRating ? `${userRating.toFixed(1)}/5` : "N/A",
      color: "text-yellow-500 bg-yellow-50",
      link: user ? `/profile/${user.id}` : "#",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Link
          key={index}
          to={stat.link}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
        >
          <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
            {stat.icon}
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-navy">{stat.value}</p>
            {stat.badge && (
              <span className="w-2 h-2 bg-teal rounded-full"></span>
            )}
          </div>
          <p className="text-xs text-slate mt-1 uppercase tracking-wide">
            {stat.label}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default StatsOverview;

