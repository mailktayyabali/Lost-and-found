import { Link } from "react-router-dom";
import { useMessaging } from "../context/MessagingContext";

function ConversationList({ conversations }) {
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
      <div className="text-center py-12 text-slate">
        <i className="fa-regular fa-comment text-4xl text-gray-300 mb-3"></i>
        <p>No conversations yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => {
        const post = conv.item;
        const otherUserName = conv.otherUserId.includes("@") ? conv.otherUserId.split("@")[0] : conv.otherUserId;

        return (
          <Link
            key={`${conv.itemId}-${conv.otherUserId}`}
            to={`/chat/${conv.itemId}/${conv.otherUserId}`}
            className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-teal transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {post?.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-navy truncate">
                    {post?.title || `Item #${conv.itemId}`}
                  </h4>
                  {conv.unreadCount > 0 && (
                    <span className="bg-teal text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate truncate mb-1">
                  {conv.lastMessage.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate">
                    {otherUserName}
                  </span>
                  <span className="text-xs text-slate">
                    {formatTime(conv.lastMessage.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default ConversationList;

