import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { messagesApi } from "../services/messagesApi";

const MessagingContext = createContext();

export const useMessaging = () => useContext(MessagingContext);

export const MessagingProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadConversations();
      loadUnreadCount();
    } else {
      setConversations([]);
      setMessages([]);
      setUnreadCount(0);
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await messagesApi.getConversations();
      if (response.success) {
        const fetchedConversations = response.data?.conversations || response.data || [];
        // Transform conversations to match frontend format
        const transformedConversations = fetchedConversations.map((conv) => ({
          ...conv,
          id: conv.id || conv._id,
          conversationId: conv.id || conv._id,
          itemId: conv.item?.id || conv.item?._id || conv.itemId,
          otherUserId: conv.otherUser?.email || conv.otherUserId,
          lastMessage: conv.lastMessage || conv.messages?.[conv.messages.length - 1],
        }));
        setConversations(transformedConversations);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    if (!user) return;
    
    try {
      const response = await messagesApi.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data?.count || 0);
      }
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const sendMessage = async (itemId, receiverId, content, conversationId = null) => {
    if (!user) return null;

    try {
      const response = await messagesApi.sendMessage({
        receiverId,
        itemId,
        conversationId,
        content: content.trim(),
      });

      if (response.success) {
        const newMessage = response.data?.message || response.data;
        // Reload conversations to get updated list
        await loadConversations();
        await loadUnreadCount();
        return newMessage;
      }
      return null;
    } catch (error) {
      console.error("Failed to send message:", error);
      return null;
    }
  };

  const getConversation = async (conversationId) => {
    if (!user) return [];

    try {
      const response = await messagesApi.getConversation(conversationId);
      if (response.success) {
        const fetchedMessages = response.data?.messages || response.data || [];
        // Transform messages to match frontend format
        const transformedMessages = fetchedMessages.map((msg) => ({
          ...msg,
          id: msg.id || msg._id,
          itemId: msg.item?.id || msg.item?._id || msg.itemId,
          senderId: msg.sender?.email || msg.senderId,
          receiverId: msg.receiver?.email || msg.receiverId,
          timestamp: msg.createdAt || msg.timestamp,
          read: msg.read || false,
        }));
        setMessages(transformedMessages);
        return transformedMessages;
      }
      return [];
    } catch (error) {
      console.error("Failed to load conversation:", error);
      return [];
    }
  };

  const markAsRead = async (messageId) => {
    if (!user) return;

    try {
      const response = await messagesApi.markAsRead(messageId);
      if (response.success) {
        // Update local state
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        );
        await loadUnreadCount();
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const getUnreadCount = () => {
    return unreadCount;
  };

  return (
    <MessagingContext.Provider
      value={{
        messages,
        conversations,
        sendMessage,
        getConversation,
        markAsRead,
        getUnreadCount,
        loadConversations,
        loading,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

