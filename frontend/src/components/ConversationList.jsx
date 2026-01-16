import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMessaging } from "../context/MessagingContext";


function ConversationList({ conversations }) {
  const { deleteConversation } = useMessaging();

  const handleDelete = async (e, conversationId) => {
    e.preventDefault(); // Prevent navigation
    if (!window.confirm("Are you sure you want to delete this conversation?")) return;

    const success = await deleteConversation(conversationId);
    if (success) {
      toast.success("Conversation deleted");
    } else {
      toast.error("Failed to delete conversation");
    }
  };

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
        const otherUserId = conv.otherUserId || "Unknown User";
        const otherUserName = otherUserId.toString().includes("@") ? otherUserId.split("@")[0] : otherUserId;

        const isUnread = conv.unreadCount > 0;

        return (
          <Link
            key={`${conv.itemId}-${conv.otherUserId}`}
            to={`/chat/${conv.itemId}/${conv.otherUserId}`}
            className={`block p-4 rounded-xl border transition-colors ${post?.isResolved
              ? "bg-gray-50 border-gray-200"
              : isUnread
                ? "bg-white border-teal shadow-sm"
                : "bg-white border-gray-100 hover:border-teal"
              }`}
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
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <h4 className={`font-semibold truncate ${isUnread ? "text-black" : "text-navy"}`}>
                      {post?.title || `Item #${conv.itemId}`}
                    </h4>
                    {post?.isResolved && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap">
                        Claimed
                      </span>
                    )}
                  </div>
                  {isUnread && (
                    <span className="bg-teal text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                  <button
                    onClick={(e) => handleDelete(e, conv.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete conversation"
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </div>
                <p className={`text-sm truncate mb-1 ${isUnread ? "font-bold text-gray-900" : "text-slate"}`}>
                  {conv.lastMessage?.content || "No messages"}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isUnread ? "font-bold text-gray-800" : "text-slate"}`}>
                    {otherUserName}
                  </span>
                  <span className={`text-xs ${isUnread ? "font-bold text-teal" : "text-slate"}`}>
                    {conv.lastMessage?.timestamp ? formatTime(conv.lastMessage.timestamp) : "N/A"}
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

