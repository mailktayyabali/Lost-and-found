import api from './api';

export const authApi = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });
    return response;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/password', {
      currentPassword,
      newPassword,
    });
    return response;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword: password,
    });
    return response;
  },
  // Google Login
  googleLogin: async (token) => {
    const response = await api.post('/auth/google', { token });
    return response;
  },
};

