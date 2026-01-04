import api from './api';

export const messagesApi = {
  // Get all conversations
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response;
  },

  // Get conversation by ID
  getConversation: async (conversationId, limit = 100) => {
    const response = await api.get(`/messages/conversations/${conversationId}?limit=${limit}`);
    return response;
  },

  // Send message
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', {
      receiverId: messageData.receiverId,
      itemId: messageData.itemId,
      conversationId: messageData.conversationId,
      content: messageData.content,
    });
    return response;
  },

  // Mark message as read
  markAsRead: async (messageId) => {
    const response = await api.put(`/messages/${messageId}/read`);
    return response;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get('/messages/unread-count');
    return response;
  },
};

