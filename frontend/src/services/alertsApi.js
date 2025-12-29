import api from './api';

export const alertsApi = {
  // Get all alerts for current user
  getAlerts: async () => {
    const response = await api.get('/alerts');
    return response.data;
  },

  // Create alert
  createAlert: async (alertData) => {
    const response = await api.post('/alerts', alertData);
    return response.data;
  },

  // Update alert
  updateAlert: async (id, alertData) => {
    const response = await api.put(`/alerts/${id}`, alertData);
    return response.data;
  },

  // Delete alert
  deleteAlert: async (id) => {
    const response = await api.delete(`/alerts/${id}`);
    return response.data;
  },

  // Check for matches
  checkMatches: async (id) => {
    const response = await api.get(`/alerts/${id}/check-matches`);
    return response.data;
  },
};

