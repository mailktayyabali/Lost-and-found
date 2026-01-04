import api from './api';

export const notificationsApi = {
  // Get all notifications
  getNotifications: async (params = {}) => {
    // params: page, limit, unreadOnly
    const response = await api.get('/notifications', { params });
    return response;
  },

  // Mark single notification as read
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response;
  },
};
