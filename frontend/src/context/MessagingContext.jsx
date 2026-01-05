import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { messagesApi } from "../services/messagesApi";
import { io } from "socket.io-client";

const MessagingContext = createContext();

export const useMessaging = () => useContext(MessagingContext);

export const MessagingProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const currentConversationIdRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (user && !socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL || "http://localhost:5000");

      socketRef.current.on("connect", () => {
        console.log("Connected to socket server");
        // Register this socket to a user-specific room so server can emit directly
        if (user && socketRef.current) {
          try {
            socketRef.current.emit('register', user.id || user._id);
            console.log('Socket registered for user', user.id || user._id);
          } catch (err) {
            console.error('Socket register failed', err);
          }
        }
      });

      socketRef.current.on("receive_message", (newMessage) => {
        console.log('MessagingContext: socket receive_message', newMessage);
        handleReceiveMessage(newMessage);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  const handleReceiveMessage = (newMessage) => {
    // 1. Update messages list if viewing this conversation
    if (currentConversationIdRef.current === newMessage.conversationId) {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some(m => m.id === newMessage.id)) return prev;

        // Transform if needed (backend mostly returns correct format, but ensure compatibility)
        const transformedMsg = {
          ...newMessage,
          senderId: newMessage.senderId || newMessage.sender?._id || newMessage.sender?.id,
          receiverId: newMessage.receiverId || newMessage.receiver?._id || newMessage.receiver?.id,
          timestamp: newMessage.createdAt || newMessage.timestamp,
        };
        return [...prev, transformedMsg];
      });

      // Mark as read immediately if window is open (optional, or rely on manual effect)
      // Here we rely on ChatWindow to mark as read
    } else {
      // Increment unread count if not viewing
      if (newMessage.receiverId === user?.email) { // Verify it's for us
        setUnreadCount((prev) => prev + 1);
      }
    }

    // 2. Update conversations list (last message)
    setConversations((prev) => {
      const existingConvIndex = prev.findIndex(c => c.id === newMessage.conversationId);
      if (existingConvIndex !== -1) {
        const updatedConv = {
          ...prev[existingConvIndex],
          lastMessage: newMessage,
          updatedAt: newMessage.createdAt
        };
        const newConvs = [...prev];
        newConvs[existingConvIndex] = updatedConv;
        // Move to top
        newConvs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        return newConvs;
      } else {
        // If new conversation, might need to reload or manually construct
        loadConversations(); // Simplest way to get full conservation object
        return prev;
      }
    });
  };

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
        // Transform conversation data
        const transformedConversations = fetchedConversations.map((conv) => ({
          ...conv,
          id: conv.id || conv._id,
          conversationId: conv.id || conv._id,
          itemId: conv.item?.id || conv.item?._id || conv.itemId,
          otherUserId: conv.otherUser?._id || conv.otherUser?.id || conv.otherUserId,
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
      const payload = {
        receiverId,
        content: content.trim(),
      };

      if (itemId) payload.itemId = itemId;
      if (conversationId) payload.conversationId = conversationId;

      const response = await messagesApi.sendMessage(payload);

      if (response.success) {
        const newMessage = response.data?.message || response.data;
        console.log('MessagingContext: sendMessage API response newMessage', newMessage);

        // Join the conversation room immediately so we receive updates
        const msgConversationId = newMessage.conversationId || conversationId;
        if (socketRef.current && msgConversationId && currentConversationIdRef.current !== msgConversationId) {
          socketRef.current.emit("join_conversation", msgConversationId);
          currentConversationIdRef.current = msgConversationId;
          console.log('MessagingContext: joined conversation room after sending', msgConversationId);
        }

        // Manually update messages state to ensure it shows immediately
        // (Essential for new conversations where we aren't in the socket room yet)
        setMessages((prev) => {
          if (prev.some(m => m.id === newMessage.id)) return prev;
          // Transform if needed
          const transformedMsg = {
            ...newMessage,
            senderId: newMessage.senderId || newMessage.sender?._id || newMessage.sender?.id || user.id,
            receiverId: newMessage.receiverId || newMessage.receiver?._id || newMessage.receiver?.id,
            timestamp: newMessage.createdAt || newMessage.timestamp || new Date().toISOString(),
          };
          return [...prev, transformedMsg];
        });

        // Update the conversation as well to include the new message
        setConversations(prev => {
          const convIndex = prev.findIndex(c => c.id === msgConversationId);
          if (convIndex !== -1) {
            const updated = [...prev];
            updated[convIndex] = {
              ...updated[convIndex],
              lastMessage: newMessage,
              updatedAt: newMessage.timestamp || new Date().toISOString()
            };
            return updated;
          }
          return prev;
        });

        // Also reload conversations list to update last message
        loadConversations();

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

    // Socket: Join Room
    if (socketRef.current) {
      // Leave previous if any (though usually handled by switching pages)
      if (currentConversationIdRef.current && currentConversationIdRef.current !== conversationId) {
        socketRef.current.emit("leave_conversation", currentConversationIdRef.current);
      }
      socketRef.current.emit("join_conversation", conversationId);
      currentConversationIdRef.current = conversationId;
    }

    try {
      const response = await messagesApi.getConversation(conversationId);
      console.log('MessagingContext: getConversation response', response);
      
      if (response.success) {
        // Backend returns: response.data.conversation.messages
        const fetchedMessages = response.data?.conversation?.messages || response.data?.messages || response.data || [];
        console.log('MessagingContext: fetched messages count:', fetchedMessages.length);
        
        const transformedMessages = fetchedMessages.map((msg) => ({
          ...msg,
          id: msg.id || msg._id,
          itemId: msg.item?.id || msg.item?._id || msg.itemId,
          senderId: msg.sender?._id || msg.sender?.id || msg.senderId,
          receiverId: msg.receiver?._id || msg.receiver?.id || msg.receiverId,
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

  // Cleanup when leaving component that uses getConversation? 
  // We can add a leaveConversation method
  const leaveConversation = () => {
    if (socketRef.current && currentConversationIdRef.current) {
      socketRef.current.emit("leave_conversation", currentConversationIdRef.current);
      currentConversationIdRef.current = null;
    }
    setMessages([]); // Clear messages when leaving
  };

  const markAsRead = async (messageId) => {
    if (!user) return;

    try {
      const response = await messagesApi.markAsRead(messageId);
      if (response.success) {
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
        leaveConversation,
        markAsRead,
        getUnreadCount,
        loadConversations,
        loading,
        socket: socketRef.current // Expose socket for Typing indicators
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

