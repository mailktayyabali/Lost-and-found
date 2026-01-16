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
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const currentConversationIdRef = useRef(null);
  const loadConversations = useCallback(async () => {
    if (!user) return;
    try {
      const response = await messagesApi.getConversations();
      if (response.success) {
        const fetchedConversations = response.data?.conversations || response.data || [];
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
    }
  }, [user?.id]);

  const loadUnreadCount = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await messagesApi.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data?.count || 0);
      }
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  }, [user?.id]);

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

        // Join the conversation room immediately so we receive updates
        const msgConversationId = newMessage.conversationId || conversationId;
        if (socketRef.current && msgConversationId && currentConversationIdRef.current !== msgConversationId) {
          socketRef.current.emit("join_conversation", msgConversationId);
          currentConversationIdRef.current = msgConversationId;
          console.log('MessagingContext: joined conversation room after sending', msgConversationId);
        }

        // Manually update messages state to ensure it shows immediately
        setMessages((prev) => {
          if (prev.some(m => m.id === newMessage.id)) return prev;
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
  }, [user, loadConversations]);

  const getConversation = useCallback(async (conversationId) => {
    if (!user?.id) return [];

    // Track previous conversation ID to handle room switching
    const prevConversationId = currentConversationIdRef.current;

    // Always update the ref so that if socket connects LATER, it knows what room to join
    currentConversationIdRef.current = conversationId;

    // Socket: Join Room (if socket is already connected)
    if (socketRef.current) {
      if (prevConversationId && prevConversationId !== conversationId) {
        socketRef.current.emit("leave_conversation", prevConversationId);
      }
      socketRef.current.emit("join_conversation", conversationId);
    }


    try {
      const response = await messagesApi.getConversation(conversationId);
      console.log('MessagingContext: getConversation response', response);

      if (response.success) {
        const fetchedMessages = response.data?.conversation?.messages || response.data?.messages || response.data || [];

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
  }, [user?.id]);

  const leaveConversation = useCallback(() => {
    if (socketRef.current && currentConversationIdRef.current) {
      socketRef.current.emit("leave_conversation", currentConversationIdRef.current);
      currentConversationIdRef.current = null;
    }
    setMessages([]);
  }, []);

  const deleteConversation = useCallback(async (conversationId) => {
    try {
      await messagesApi.deleteConversation(conversationId);
      setConversations((prev) => prev.filter((c) => c._id !== conversationId && c.id !== conversationId));
      return true;
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      return false;
    }
  }, []);

  const markAsRead = useCallback(async (messageId) => {
    if (!user?.id) return;

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
  }, [user?.id, loadUnreadCount]);

  const getUnreadCount = useCallback(() => {
    return unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    if (user?.id && !socketRef.current) {
      // Clean up the URL to ensure we connect to the root, not /api namespace
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const socketUrl = apiUrl.replace(/\/api\/?$/, "");

      console.log("DEBUG: Connecting to socket at:", socketUrl);
      socketRef.current = io(socketUrl);

      socketRef.current.on("connect", () => {
        console.log("DEBUG: Socket Connected!", socketRef.current.id);
        setIsConnected(true);
        if (user && socketRef.current) {
          try {
            socketRef.current.emit('register', user.id || user._id);
            console.log('DEBUG: Socket registered for user', user.id || user._id);

            // Fix: Re-join conversation room if we are already viewing one
            if (currentConversationIdRef.current) {
              socketRef.current.emit("join_conversation", currentConversationIdRef.current);
              console.log('DEBUG: Socket re-joined conversation room', currentConversationIdRef.current);
            }
          } catch (err) {
            console.error('Socket register failed', err);
          }
        }
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("DEBUG: Socket Connection Error", err);
      });

      const handleReceiveMessage = (newMessage) => {
        console.log("DEBUG: handleReceiveMessage called", {
          msgId: newMessage.id,
          msgConvId: newMessage.conversationId,
          currentRefConvId: currentConversationIdRef.current,
          match: currentConversationIdRef.current === newMessage.conversationId
        });

        // 1. Update messages list if viewing this conversation
        if (currentConversationIdRef.current === newMessage.conversationId) {
          setMessages((prev) => {
            if (prev.some(m => m.id === newMessage.id)) return prev;

            const transformedMsg = {
              ...newMessage,
              senderId: newMessage.senderId || newMessage.sender?._id || newMessage.sender?.id,
              receiverId: newMessage.receiverId || newMessage.receiver?._id || newMessage.receiver?.id,
              timestamp: newMessage.createdAt || newMessage.timestamp,
            };
            return [...prev, transformedMsg];
          });
        } else {
          // Increment unread count if not viewing
          if (newMessage.receiverId === user?.email) {
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
            // If new conversation, we need to reload to get full details
            loadConversations();
            return prev;
          }
        });
      };

      socketRef.current.on("receive_message", (newMessage) => {
        console.log('DEBUG: MessagingContext: socket receive_message', newMessage);
        handleReceiveMessage(newMessage);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from socket server");
        setIsConnected(false);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?.id]); // Effectively re-subscribes when user changes

  // Load Initial Data
  useEffect(() => {
    if (user?.id) {
      loadConversations();
      loadUnreadCount();
    } else {
      setConversations([]);
      setMessages([]);
      setUnreadCount(0);
    }
  }, [user?.id, loadConversations, loadUnreadCount]);

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
        socket: socketRef.current,
        isConnected,
        deleteConversation
      }}
    >
      {children}
    </MessagingContext.Provider >
  );
};
