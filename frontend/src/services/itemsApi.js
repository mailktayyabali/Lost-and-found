import api from './api';

export const itemsApi = {
  // Get all items with filters and pagination
  getAllItems: async (params = {}) => {
    const response = await api.get('/items', { params });
    return response;
  },

  // Search items
  searchItems: async (query, params = {}) => {
    const response = await api.get('/items/search', {
      params: { q: query, ...params },
    });
    return response;
  },

  // Get item by ID
  getItemById: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response;
  },

  // Report an item
  reportItem: async (data) => {
    const response = await api.post('/flags', data);
    return response;
  },

  // Increment item views
  incrementViews: async (id) => {
    const response = await api.post(`/items/${id}/view`);
    return response;
  },

  // Get user items
  getUserItems: async (userId) => {
    const encoded = encodeURIComponent(userId);
    const response = await api.get(`/items/user/${encoded}`);
    return response;
  },

  // Create item (multipart/form-data)
  createItem: async (formData) => {
    console.log('itemsApi: createItem called', formData);
    const response = await api.post('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Update item (multipart/form-data)
  updateItem: async (id, formData) => {
    const response = await api.put(`/items/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Delete item
  deleteItem: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response;
  },

  // Mark item as resolved
  markAsResolved: async (id) => {
    const response = await api.patch(`/items/${id}/resolve`);
    return response;
  },
};

