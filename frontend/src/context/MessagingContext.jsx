import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const MessagingContext = createContext();

export const useMessaging = () => useContext(MessagingContext);

export const MessagingProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    loadMessages();
  }, [user]);

  useEffect(() => {
    if (user) {
      updateConversations();
    } else {
      setConversations([]);
    }
  }, [messages, user]);

  const loadMessages = () => {
    const stored = localStorage.getItem("findit_messages");
    if (stored) {
      const allMessages = JSON.parse(stored);
      setMessages(allMessages);
    }
  };

  const saveMessages = (newMessages) => {
    localStorage.setItem("findit_messages", JSON.stringify(newMessages));
    setMessages(newMessages);
  };

  const updateConversations = () => {
    if (!user) return;

    const userConversations = {};
    
    messages.forEach((message) => {
      if (message.senderId === user.email || message.receiverId === user.email) {
        const otherUserId =
          message.senderId === user.email
            ? message.receiverId
            : message.senderId;
        
        const conversationKey = `${message.itemId}-${otherUserId}`;
        
        if (!userConversations[conversationKey]) {
          userConversations[conversationKey] = {
            itemId: message.itemId,
            otherUserId,
            lastMessage: message,
            unreadCount: 0,
          };
        }

        // Update last message if this is newer
        if (
          new Date(message.timestamp) >
          new Date(userConversations[conversationKey].lastMessage.timestamp)
        ) {
          userConversations[conversationKey].lastMessage = message;
        }
      }
    });

    // Count unread messages for each conversation
    Object.keys(userConversations).forEach((key) => {
      const conv = userConversations[key];
      conv.unreadCount = messages.filter(
        (msg) =>
          msg.itemId === conv.itemId &&
          msg.senderId === conv.otherUserId &&
          msg.receiverId === user.email &&
          !msg.read
      ).length;
    });

    setConversations(Object.values(userConversations));
  };

  const sendMessage = (itemId, receiverId, content) => {
    if (!user) return null;

    const newMessage = {
      id: Date.now().toString(),
      itemId: parseInt(itemId),
      senderId: user.email,
      receiverId,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updated = [...messages, newMessage];
    saveMessages(updated);
    return newMessage;
  };

  const getConversation = (itemId, otherUserId) => {
    if (!user) return [];

    return messages
      .filter(
        (msg) =>
          msg.itemId === parseInt(itemId) &&
          ((msg.senderId === user.email && msg.receiverId === otherUserId) ||
            (msg.receiverId === user.email && msg.senderId === otherUserId))
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const markAsRead = (itemId, otherUserId) => {
    if (!user) return;

    const updated = messages.map((msg) => {
      if (
        msg.itemId === parseInt(itemId) &&
        msg.senderId === otherUserId &&
        msg.receiverId === user.email &&
        !msg.read
      ) {
        return { ...msg, read: true };
      }
      return msg;
    });

    saveMessages(updated);
  };

  const getUnreadCount = () => {
    if (!user) return 0;
    return messages.filter(
      (msg) => msg.receiverId === user.email && !msg.read
    ).length;
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
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

