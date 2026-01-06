import api from './api';

export const adminApi = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response;
  },



  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response;
  },

  // Delete item
  deleteItem: async (id) => {
    const response = await api.delete(`/admin/items/${id}`);
    return response;
  },

  // Get activity log
  getActivityLog: async (params) => {
    const response = await api.get('/admin/activity', { params });
    return response;
  },

  // Ban User
  banUser: async (id, reason) => {
    const response = await api.patch(`/admin/users/${id}/ban`, { reason });
    return response;
  },

  // Unban User
  unbanUser: async (id) => {
    const response = await api.patch(`/admin/users/${id}/unban`);
    return response;
  },

  // Get Flags (Moderation Queue)
  getFlags: async (params) => {
      // Convert params object to query string? Axios does this automatically usually if passed as params
      const response = await api.get('/admin/flags', { params }); 
      return response; // Corrected: interceptor already returns data
  },

  // Update Flag Status
  updateFlagStatus: async (id, status, resolutionNote) => {
      const response = await api.patch(`/admin/flags/${id}`, { status, resolutionNote });
      return response;
  },
  
  // Overload getAllUsers to accept params
  getAllUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response;
  },

  getAllItems: async (params) => {
    const response = await api.get('/admin/items', { params });
    return response;
  }
};

