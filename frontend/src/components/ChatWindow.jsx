import { useState, useEffect, useRef } from "react";
import { useMessaging } from "../context/MessagingContext";
import { useAuth } from "../context/AuthContext";
import MessageBubble from "./MessageBubble";
import { Send } from "lucide-react";

function ChatWindow({ itemId, otherUserId, itemTitle, isItemResolved }) {
  const { messages, conversations, loading, getConversation, sendMessage, markAsRead, socket } = useMessaging();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Wait for conversations to load
    if (loading) return;

    if (itemId && otherUserId) {
      // Find existing conversation
      const existingConv = conversations.find(c =>
        (String(c.itemId) === String(itemId)) &&
        (String(c.otherUserId) === String(otherUserId))
      );

      console.log("ChatWindow: Lookup existing conversation", {
        found: !!existingConv,
        itemId,
        otherUserId,
        convCount: conversations.length,
        conversationId: existingConv?.id
      });

      if (existingConv) {
        if (getConversation) {
          getConversation(existingConv.id); 
        }

        const lastMsg = existingConv.lastMessage;
        if (markAsRead && lastMsg?.id && !lastMsg.read && lastMsg.receiverId === user?.id) {
          markAsRead(lastMsg.id);
        }
      } else {
        setConversation([]);
      }
    }
  }, [itemId, otherUserId, conversations, loading, getConversation, markAsRead]);

  // Sync local conversation with context messages
  useEffect(() => {
    console.log("ChatWindow: messages updated from context", messages);
    // Update local state with context messages (from getConversation)
    setConversation(messages);
  }, [messages]);

  useEffect(() => {
    console.log("ChatWindow: conversation state updated", conversation);
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isTyping]);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ userId }) => {
      if (userId !== user.id) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ userId }) => {
      if (userId !== user.id) {
        setIsTyping(false);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [socket, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !user) return;

    const existingConv = conversations.find(c =>
      (String(c.itemId) === String(itemId)) &&
      (String(c.otherUserId) === String(otherUserId))
    );

    const sentMsg = await sendMessage(itemId, otherUserId, messageText, existingConv?.id);
    setMessageText("");

    console.log('ChatWindow: sendMessage returned', sentMsg);
    if (sentMsg && sentMsg.conversationId && socket) {
      // Stop typing
      socket.emit("stop_typing", { conversationId: sentMsg.conversationId, userId: user.id });
    }
  };

  // Improved Input Change for Typing
  const onMessageChange = (e) => {
    setMessageText(e.target.value);

    if (!socket || conversation.length === 0) return;
    const conversationId = conversation[0].conversationId;
    if (!conversationId) return;

    socket.emit("typing", { conversationId, userId: user.id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { conversationId, userId: user.id });
    }, 2000);
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
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 text-slate text-xs px-3 py-1.5 rounded-full rounded-bl-none">
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      {isItemResolved ? (
        <div className="bg-amber-50 border-t border-amber-200 p-4 rounded-b-xl">
          <div className="flex items-center gap-2 text-amber-800 text-sm">
            <i className="fa-solid fa-circle-info"></i>
            <span>This item has been claimed. Chat is no longer available.</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSend} className="bg-white border-t border-gray-200 p-4 rounded-b-xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={onMessageChange}
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
      )}
    </div>
  );
}

export default ChatWindow;

