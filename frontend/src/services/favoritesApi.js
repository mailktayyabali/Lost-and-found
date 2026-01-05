import api from './api';

export const favoritesApi = {
  // Get all favorites for current user
  getFavorites: async () => {
    const response = await api.get('/favorites');
    return response;
  },

  // Add favorite
  addFavorite: async (itemId) => {
    const response = await api.post(`/favorites/${itemId}`);
    return response;
  },

  // Remove favorite
  removeFavorite: async (itemId) => {
    const response = await api.delete(`/favorites/${itemId}`);
    return response;
  },

  // Check if item is favorited
  checkFavorite: async (itemId) => {
    const response = await api.get(`/favorites/check/${itemId}`);
    return response;
  },
};

