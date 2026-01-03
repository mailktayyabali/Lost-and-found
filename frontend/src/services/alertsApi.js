import api from './api';

export const alertsApi = {
  // Get all alerts for current user
  getAlerts: async () => {
    const response = await api.get('/alerts');
    return response;
  },

  // Create alert
  createAlert: async (alertData) => {
    const response = await api.post('/alerts', alertData);
    return response;
  },

  // Update alert
  updateAlert: async (id, alertData) => {
    const response = await api.put(`/alerts/${id}`, alertData);
    return response;
  },

  // Delete alert
  deleteAlert: async (id) => {
    const response = await api.delete(`/alerts/${id}`);
    return response;
  },

  // Check for matches
  checkMatches: async (id) => {
    const response = await api.get(`/alerts/${id}/check-matches`);
    return response;
  },
};

