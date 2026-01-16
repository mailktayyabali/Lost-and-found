import api from './api';

export const messagesApi = {
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response;
  },

  getConversation: async (conversationId, limit = 100) => {
    const response = await api.get(`/messages/conversations/${conversationId}?limit=${limit}`);
    return response;
  },

  sendMessage: async (messageData) => {
    const response = await api.post('/messages', {
      receiverId: messageData.receiverId,
      itemId: messageData.itemId,
      conversationId: messageData.conversationId,
      content: messageData.content,
    });
    return response;
  },

  markAsRead: async (messageId) => {
    const response = await api.put(`/messages/${messageId}/read`);
    return response;
  },
  getUnreadCount: async () => {
    const response = await api.get('/messages/unread-count');
    return response;
  },
};

