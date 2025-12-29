import api from './api';

export const usersApi = {
  // Get user profile
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Get user stats
  getUserStats: async (userId) => {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
  },

  // Get user items
  getUserItems: async (userId) => {
    const response = await api.get(`/users/${userId}/items`);
    return response.data;
  },
};

