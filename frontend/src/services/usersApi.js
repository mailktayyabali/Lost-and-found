import api from './api';

export const usersApi = {
  // Get user profile
  getUserProfile: async (userId) => {
    const encoded = encodeURIComponent(userId);
    const response = await api.get(`/users/${encoded}`);
    return response;
  },

  // Get user stats
  getUserStats: async (userId) => {
    const encoded = encodeURIComponent(userId);
    const response = await api.get(`/users/${encoded}/stats`);
    return response;
  },

  // Get user items
  getUserItems: async (userId) => {
    const encoded = encodeURIComponent(userId);
    const response = await api.get(`/users/${encoded}/items`);
    return response;
  },
};

