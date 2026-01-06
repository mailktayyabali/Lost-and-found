import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useMessaging } from "../context/MessagingContext";
import { useSearchAlerts } from "../context/SearchAlertsContext";
import { Plus, Search, Settings, LogOut, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getFavoriteCount } = useFavorites();
  const { getUnreadCount: getMessageUnreadCount } = useMessaging();
  const { getUnreadCount: getAlertUnreadCount } = useSearchAlerts();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const favoriteCount = getFavoriteCount();
  const messageUnreadCount = getMessageUnreadCount();
  const alertUnreadCount = getAlertUnreadCount();

  const handleReportClick = () => {
    navigate("/report?type=lost");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mb-6 md:mb-8">
      {/* Top Bar with User Menu */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src="/assets/images/icon.jpg"
            className="w-10 h-10 rounded-lg shadow-md"
            alt="Logo"
          />
          <span className="text-lg font-bold text-gray-800">Dashboard</span>
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
              alt="Avatar"
              className="w-8 h-8 rounded-full ring-2 ring-teal/20"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'User'}</p>
            </div>
            <i className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {/* Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-scale-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || ''}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    navigate(user ? `/profile/${user.id || user._id}` : "/dashboard");
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={18} className="text-gray-500" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={18} className="text-gray-500" />
                  Settings
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {getGreeting()}, {user?.name || 'User'}! <span className="inline-block">👋</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Here's what's happening with your items today.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate("/feed")}
            className="px-4 py-2 bg-white border border-gray-200 text-navy font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Search size={18} />
            Browse Items
          </button>
          {user?.role !== 'admin' && (
            <button
              onClick={handleReportClick}
              className="px-6 py-2 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl
                        bg-teal hover:bg-teal-dark transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Report Item
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
          <i className="fa-solid fa-heart text-red-500"></i>
          <span className="font-medium text-navy">{favoriteCount}</span>
          <span className="text-slate">Favorites</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
          <i className="fa-solid fa-comment text-blue-500"></i>
          <span className="font-medium text-navy">{messageUnreadCount}</span>
          <span className="text-slate">Unread Messages</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
          <i className="fa-solid fa-bell text-amber-500"></i>
          <span className="font-medium text-navy">{alertUnreadCount}</span>
          <span className="text-slate">Alert Notifications</span>
        </div>
      </div>
    </div>
  );
}
