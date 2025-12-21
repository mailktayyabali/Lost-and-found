import { Clock, CheckCircle, XCircle, MessageSquare, Heart, Bell } from "lucide-react";

function ActivityTimeline() {
  const activities = [
    {
      type: "message",
      icon: <MessageSquare size={16} />,
      title: "New message received",
      description: "From Sarah about Item #88219",
      time: "2 hours ago",
      color: "bg-blue-100 text-blue-600",
    },
    {
      type: "favorite",
      icon: <Heart size={16} />,
      title: "Item favorited",
      description: "Blue Leather Wallet added to favorites",
      time: "5 hours ago",
      color: "bg-red-100 text-red-600",
    },
    {
      type: "alert",
      icon: <Bell size={16} />,
      title: "Search alert matched",
      description: "3 new items match your alert",
      time: "1 day ago",
      color: "bg-amber-100 text-amber-600",
    },
    {
      type: "resolved",
      icon: <CheckCircle size={16} />,
      title: "Item claimed",
      description: "Golden Retriever Puppy successfully claimed",
      time: "2 days ago",
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-navy mb-4">Recent Activity</h2>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="relative flex items-start gap-4">
              {/* Icon */}
              <div
                className={`relative z-10 ${activity.color} p-2 rounded-full flex-shrink-0`}
              >
                {activity.icon}
              </div>

              {/* Content */}
              <div className="flex-1 pt-0.5">
                <p className="font-semibold text-navy text-sm">
                  {activity.title}
                </p>
                <p className="text-xs text-slate mt-1">{activity.description}</p>
                <p className="text-xs text-slate mt-2 flex items-center gap-1">
                  <Clock size={12} />
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityTimeline;

