import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Heart, Bell, MessageSquare, FileText } from "lucide-react";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: <Plus size={20} />,
      label: "Report Item",
      description: "Report lost or found item",
      color: "bg-teal hover:bg-teal-dark",
      onClick: () => navigate("/report"),
    },
    {
      icon: <Search size={20} />,
      label: "Browse Feed",
      description: "View all items",
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => navigate("/feed"),
    },
    {
      icon: <Heart size={20} />,
      label: "My Favorites",
      description: "View saved items",
      color: "bg-red-500 hover:bg-red-600",
      onClick: () => navigate("/favorites"),
    },
    {
      icon: <Bell size={20} />,
      label: "Search Alerts",
      description: "Manage alerts",
      color: "bg-amber-500 hover:bg-amber-600",
      onClick: () => navigate("/search-alerts"),
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Messages",
      description: "View conversations",
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => navigate("/messages"),
    },
    {
      icon: <FileText size={20} />,
      label: "My Reports",
      description: "Manage reports",
      color: "bg-indigo-500 hover:bg-indigo-600",
      onClick: () => navigate("/my-reports"),
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-navy mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} text-white p-4 rounded-lg transition-all hover:scale-105 hover:shadow-lg flex flex-col items-center gap-2 text-center`}
          >
            {action.icon}
            <div>
              <p className="font-semibold text-sm">{action.label}</p>
              <p className="text-xs opacity-90">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;

