import { Link } from "react-router-dom";
import { useMessaging } from "../context/MessagingContext";
import { MessageSquare } from "lucide-react";

function RecentMessagesWidget() {
  const { conversations, getUnreadCount } = useMessaging();
  const unreadCount = getUnreadCount();
  const recentConversations = conversations.slice(0, 3);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-navy">Recent Messages</h2>
          <Link
            to="/messages"
            className="text-sm text-teal hover:underline font-medium"
          >
            View All
          </Link>
        </div>
        <div className="text-center py-8 text-slate">
          <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm">No messages yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-navy">Recent Messages</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <Link
          to="/messages"
          className="text-sm text-teal hover:underline font-medium"
        >
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {recentConversations.map((conv, index) => (
          <Link
            key={index}
            to={`/chat/${conv.itemId}/${conv.otherUserId}`}
            className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-navy text-sm truncate">
                  Item #{conv.itemId}
                </p>
                <p className="text-xs text-slate truncate mt-1">
                  {conv.lastMessage.content}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-slate">
                  {formatTime(conv.lastMessage.timestamp)}
                </span>
                {conv.unreadCount > 0 && (
                  <span className="bg-teal text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RecentMessagesWidget;

