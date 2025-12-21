import { useState, useEffect, useRef } from "react";
import { useMessaging } from "../context/MessagingContext";
import { useAuth } from "../context/AuthContext";
import MessageBubble from "./MessageBubble";
import { Send } from "lucide-react";

function ChatWindow({ itemId, otherUserId, itemTitle }) {
  const { messages, getConversation, sendMessage, markAsRead } = useMessaging();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState("");
  const [conversation, setConversation] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (itemId && otherUserId) {
      const conv = getConversation(itemId, otherUserId);
      setConversation(conv);
      markAsRead(itemId, otherUserId);
    }
  }, [itemId, otherUserId, messages, getConversation, markAsRead]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !user) return;

    sendMessage(itemId, otherUserId, messageText);
    setMessageText("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 rounded-t-xl">
        <h3 className="font-semibold text-navy">{itemTitle}</h3>
        <p className="text-xs text-slate">Conversation about this item</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 custom-scrollbar">
        {conversation.length === 0 ? (
          <div className="text-center py-8 text-slate text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          conversation.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="bg-white border-t border-gray-200 p-4 rounded-b-xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal text-sm"
          />
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;

