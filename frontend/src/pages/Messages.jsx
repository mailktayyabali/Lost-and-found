import { useMessaging } from "../context/MessagingContext";
import { useAuth } from "../context/AuthContext";
import ConversationList from "../components/ConversationList";
import { Link } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";

function Messages() {
  const { conversations, getUnreadCount } = useMessaging();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-hidden">
        <div className="max-w-4xl mx-auto text-center py-20">
          <i className="fa-regular fa-comment text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-bold text-navy mb-2">Sign in required</h2>
          <p className="text-slate mb-6">Please sign in to view your messages.</p>
          <Link
            to="/auth"
            className="inline-block px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal-dark transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const unreadCount = getUnreadCount();

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-gray-800">Messages</h1>
            {unreadCount > 0 && (
              <span className="bg-teal text-white text-sm font-bold px-3 py-1 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-gray-600">
            {conversations.length === 0
              ? "You have no conversations yet."
              : `You have ${conversations.length} conversation${conversations.length !== 1 ? "s" : ""}.`}
          </p>
        </div>

        {/* Conversations List */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <ErrorBoundary>
            <ConversationList conversations={conversations} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default Messages;

