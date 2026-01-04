import { useState, useEffect, useRef } from "react";
import { useMessaging } from "../context/MessagingContext";
import { useAuth } from "../context/AuthContext";
import MessageBubble from "./MessageBubble";
import { Send } from "lucide-react";

function ChatWindow({ itemId, otherUserId, itemTitle }) {
  const { messages, conversations, loading, getConversation, sendMessage, markAsRead, leaveConversation, socket } = useMessaging();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const currentConversationIdRef = useRef(null);

  useEffect(() => {
    console.log("ChatWindow Mount/Update:", {
      itemId,
      otherUserId,
      currentUserId: user?.id,
      itemTitle
    });
  }, [itemId, otherUserId, user, itemTitle]);

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
        convCount: conversations.length
      });

      if (existingConv) {
        // Only load conversation if we're not already viewing it (prevent unnecessary reloads)
        // But always reload if conversation ID changes to ensure we have latest messages
        const conversationIdToLoad = existingConv.id || existingConv.conversationId;
        if (getConversation && currentConversationIdRef.current !== conversationIdToLoad) {
          currentConversationIdRef.current = conversationIdToLoad;
          getConversation(conversationIdToLoad);
        }
        if (markAsRead && existingConv.lastMessage?.id && existingConv.lastMessage.senderId !== user.id) {
          markAsRead(existingConv.lastMessage.id);
        }
      } else {
        // Reset current conversation ID if conversation not found
        currentConversationIdRef.current = null;
        // New conversation - Clear messages
        // Only clear if we really don't have messages for this context?
        // But setConversation(messages) handles the view.
        // We set local conversation to empty only if messages is empty?
        // No, keep logic - but logging will tell us if this path is taken.
        console.log("ChatWindow: Conversation not found in list, clearing local view if currently empty.");
        // setConversation([]); // relying on 'messages' sync effect is safer?
        // If we setConversation([]) here, we override the 'setConversation(messages)' effect?
        // Actually this useEffect runs when 'conversations' changes.
        // The other useEffect runs when 'messages' changes.
        // If 'conversations' changes -> setConversation([]) -> clears view.
        // If 'messages' hasn't changed, the other effect won't run.
        // So yes, this line clears the view.

        // FIX: Don't clear if we have messages in context that seem correct?
        // But context messages might be from previous nav.
        setConversation([]);
      }
    }
  }, [itemId, otherUserId, conversations, loading, getConversation, markAsRead]);

  // Sync local conversation with context messages
  useEffect(() => {
    console.log("ChatWindow: messages updated", messages);
    setConversation(messages);
  }, [messages]);

  useEffect(() => {
    console.log("ChatWindow: conversation state updated", conversation);
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isTyping]);

  // Typing indicators
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

  const handleInputChange = (e) => {
    setMessageText(e.target.value);

    if (socket && itemId && otherUserId) {
      // We need conversationId to emit typing. 
      // Current implementation of MessagingContext tracks currentConversationIdRef.
      // But here we don't have conversationId easily accessbile unless we find it.
      // However, getConversation joins the room named by conversationId.
      // Wait, messagesApi.getConversation uses conversationId?
      // No, getConversation(itemId, otherUserId) calls helper?
      // In MessagingContext: getConversation takes conversationId.
      // But ChatWindow passes (itemId, otherUserId).
      // Ah, useMessaging.getConversation signature: `const getConversation = async (conversationId) => { ... }`
      // But in ChatWindow line 16: `const conv = getConversation(itemId, otherUserId);`
      // This is a mismatch!
      // Let's check MessagingContext again. 
    }
  };

  // FIX: Inspect MessagingContext getConversation signature vs Usage
  // MessagingContext: getConversation = async (conversationId)
  // ChatWindow calls: getConversation(itemId, otherUserId)
  // This implies ChatWindow logic was flawed or I missed a helper "getConversationByItem"?
  // Let's assume I need to fix ChatWindow to first GET connection or conversation ID.

  // Actually, MessagingContext has `getConversation` taking `conversationId`.
  // But `ChatWindow` is being passed `itemId` and `otherUserId`.
  // It needs to FIND the conversation ID first.

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !user) return;

    const sentMsg = await sendMessage(itemId, otherUserId, messageText);
    setMessageText("");

    console.log('ChatWindow: sendMessage returned', sentMsg);
    if (sentMsg) {
      console.log("ChatWindow: Message sent.", sentMsg);

      if (sentMsg.conversationId) {
        // Update current conversation ID and reload conversation to ensure all messages are displayed
        currentConversationIdRef.current = sentMsg.conversationId;
        if (getConversation) {
          // Small delay to ensure message is saved to database before reloading
          // Increased delay to ensure message is definitely in the database
          await new Promise(resolve => setTimeout(resolve, 300));
          await getConversation(sentMsg.conversationId);
        }
      }

      // Stop typing
      if (socket && sentMsg.conversationId) {
        socket.emit("stop_typing", { conversationId: sentMsg.conversationId, userId: user.id });
      }
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
    </div>
  );
}

export default ChatWindow;

