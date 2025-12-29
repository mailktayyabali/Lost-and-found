import api from './api';

export const adminApi = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get all users
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Get all items
  getAllItems: async () => {
    const response = await api.get('/admin/items');
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Delete item
  deleteItem: async (id) => {
    const response = await api.delete(`/admin/items/${id}`);
    return response.data;
  },

  // Get activity log
  getActivityLog: async () => {
    const response = await api.get('/admin/activity');
    return response.data;
  },
};

