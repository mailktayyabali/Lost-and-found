import { useAuth } from "../context/AuthContext";

function MessageBubble({ message }) {
  const { user } = useAuth();
  // Convert all to strings for consistent comparison
  const messageSenderId = String(message.senderId || '');
  const userId = String(user?.id || user?._id || user?.email || '');
  const isOwn = messageSenderId === userId;
  

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${isOwn
            ? "bg-teal text-white rounded-br-sm"
            : "bg-white text-navy border border-gray-200 rounded-bl-sm"
          }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p
          className={`text-xs mt-1 ${isOwn ? "text-white/70" : "text-slate"
            }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

export default MessageBubble;

