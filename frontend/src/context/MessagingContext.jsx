import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
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

  // Keep a ref to the handler to avoid stale closures in socket listener
  const handleReceiveMessageRef = useRef(null);

  const handleReceiveMessage = (newMessage) => {
    console.log('MessagingContext: handleReceiveMessage triggered via Ref', {
      newMessageId: newMessage.id || newMessage._id,
      msgConversationId: newMessage.conversationId,
      currentConversationId: currentConversationIdRef.current,
      match: String(currentConversationIdRef.current) === String(newMessage.conversationId)
    });

    // 1. Update messages list if viewing this conversation
    if (currentConversationIdRef.current &&
      String(currentConversationIdRef.current) === String(newMessage.conversationId)) {
      setMessages((prev) => {
        if (prev.some(m => (m.id || m._id) === (newMessage.id || newMessage._id))) {
          console.log('MessagingContext: Duplicate message filtered.');
          return prev;
        }

        console.log('MessagingContext: Adding incoming message to state.');
        // Ensure senderId and receiverId are strings for consistent comparison
        const senderId = newMessage.senderId?.toString() || newMessage.sender?._id?.toString() || newMessage.sender?.id?.toString() || newMessage.senderId;
        const receiverId = newMessage.receiverId?.toString() || newMessage.receiver?._id?.toString() || newMessage.receiver?.id?.toString() || newMessage.receiverId;
        
        const transformedMsg = {
          ...newMessage,
          id: newMessage.id || newMessage._id,
          senderId: senderId,
          receiverId: receiverId,
          timestamp: newMessage.createdAt || newMessage.timestamp,
        };
        return [...prev, transformedMsg];
      });
    } else {
      console.log('MessagingContext: Message not for current conversation, incrementing unread.');
      if (newMessage.receiverId === user?.email || newMessage.receiverId === user.id) {
        setUnreadCount((prev) => prev + 1);
      }
    }

    // 2. Update conversations list (last message)
    setConversations((prev) => {
      const existingConvIndex = prev.findIndex(c => (c.id || c._id) === (newMessage.conversationId || newMessage.conversation?._id));
      if (existingConvIndex !== -1) {
        const updatedConv = {
          ...prev[existingConvIndex],
          lastMessage: newMessage,
          updatedAt: newMessage.createdAt
        };
        const newConvs = [...prev];
        newConvs[existingConvIndex] = updatedConv;
        newConvs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        return newConvs;
      } else {
        loadConversations();
        return prev;
      }
    });
  };

  // Update ref whenever handler would change (though it's constant, this pattern is safe)
  handleReceiveMessageRef.current = handleReceiveMessage;

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
            // Re-join current conversation if any
            if (currentConversationIdRef.current) {
              console.log("MessagingContext: Re-joining conversation on reconnect", currentConversationIdRef.current);
              socketRef.current.emit("join_conversation", currentConversationIdRef.current);
            }
          } catch (err) {
            console.error('Socket register failed', err);
          }
        }
      });

      socketRef.current.on("receive_message", (newMessage) => {
        console.log('MessagingContext: socket receive_message', newMessage);
        if (handleReceiveMessageRef.current) {
          handleReceiveMessageRef.current(newMessage);
        }
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

  const loadConversations = useCallback(async () => {
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
  }, [user]);

  const loadUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      const response = await messagesApi.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data?.count || 0);
      }
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  }, [user]);

  const sendMessage = useCallback(async (itemId, receiverId, content, conversationId = null) => {
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

        // Manually update messages state to ensure it shows immediately
        // (Essential for new conversations where we aren't in the socket room yet)
        setMessages((prev) => {
          if (prev.some(m => m.id === newMessage.id)) return prev;
          // Transform if needed
          // Ensure senderId and receiverId are strings for consistent comparison
          const senderId = newMessage.senderId?.toString() || newMessage.sender?._id?.toString() || newMessage.sender?.id?.toString() || user.id?.toString() || user.id;
          const receiverId = newMessage.receiverId?.toString() || newMessage.receiver?._id?.toString() || newMessage.receiver?.id?.toString() || newMessage.receiverId;
          
          const transformedMsg = {
            ...newMessage,
            senderId: senderId,
            receiverId: receiverId,
            timestamp: newMessage.createdAt || newMessage.timestamp || new Date().toISOString(),
          };
          return [...prev, transformedMsg];
        });

        // Also reload conversations list to update last message
        // Note: This is async and will trigger useEffect in ChatWindow
        loadConversations();

        return newMessage;
      }
      return null;
    } catch (error) {
      console.error("Failed to send message:", error);
      return null;
    }
  }, [user, loadConversations]);

  const getConversation = useCallback(async (conversationId) => {
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
      // Request a high limit to get all messages (or at least 100)
      const response = await messagesApi.getConversation(conversationId, 100);
      if (response.success) {
        console.log('MessagingContext: getConversation FULL response', JSON.stringify(response, null, 2));

        // Use safe extraction
        const conversationData = response.data?.conversation || response.data;
        let fetchedMessages = conversationData?.messages;

        // Fallback for flat structure if needed, or empty
        if (!fetchedMessages && Array.isArray(conversationData)) {
          fetchedMessages = conversationData;
        }
        if (!fetchedMessages) fetchedMessages = [];

        console.log('MessagingContext: extracted fetchedMessages', fetchedMessages);

        if (!Array.isArray(fetchedMessages)) {
          console.error("CRITICAL: fetchedMessages is NOT an array.", typeof fetchedMessages, fetchedMessages);
          setMessages([]);
          return [];
        }

        const transformedMessages = fetchedMessages.map((msg) => {
          // Ensure senderId and receiverId are strings for consistent comparison
          const senderId = msg.sender?._id?.toString() || msg.sender?.id?.toString() || msg.senderId?.toString() || msg.senderId;
          const receiverId = msg.receiver?._id?.toString() || msg.receiver?.id?.toString() || msg.receiverId?.toString() || msg.receiverId;
          
          return {
            ...msg,
            id: msg.id || msg._id,
            itemId: msg.item?.id || msg.item?._id || msg.itemId,
            senderId: senderId,
            receiverId: receiverId,
            timestamp: msg.createdAt || msg.timestamp,
            read: msg.read || false,
          };
        });
        
        // Merge with any pending messages that might not be in the response yet
        // This ensures newly sent messages aren't lost
        setMessages((prev) => {
          const merged = [...transformedMessages];
          // Add any messages from prev that aren't in the fetched messages
          prev.forEach((prevMsg) => {
            if (!merged.some(m => String(m.id || m._id) === String(prevMsg.id || prevMsg._id))) {
              merged.push(prevMsg);
            }
          });
          // Sort by timestamp to maintain order
          return merged.sort((a, b) => {
            const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
            const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
            return timeA - timeB;
          });
        });
        return transformedMessages;
      }
      return [];
    } catch (error) {
      console.error("Failed to load conversation:", error);
      return [];
    }
  }, [user]);

  // Cleanup when leaving component that uses getConversation? 
  // We can add a leaveConversation method
  const leaveConversation = useCallback(() => {
    if (socketRef.current && currentConversationIdRef.current) {
      socketRef.current.emit("leave_conversation", currentConversationIdRef.current);
      currentConversationIdRef.current = null;
    }
    setMessages([]); // Clear messages when leaving
  }, []);

  const markAsRead = useCallback(async (messageId) => {
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
  }, [user, loadUnreadCount]);

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

