import axios from 'axios';

// Base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('findit_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors and transform responses
api.interceptors.response.use(
  (response) => {
    // Backend returns { success, data, message }
    // Return data directly for easier consumption
    return response.data;
  },
  (error) => {
    // Handle errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // Handle 401 Unauthorized - token expired or invalid
      if (status === 401) {
        localStorage.removeItem('findit_token');
        localStorage.removeItem('findit_user');
        // Redirect to login if not already there
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
      }

      // Handle 403 Forbidden - User Banned
      if (status === 403) {
        // Check if it's a ban error
        const isBanned = data?.message?.toLowerCase().includes('banned');
        
        if (isBanned) {
          localStorage.removeItem('findit_token');
          localStorage.removeItem('findit_user');
          
          // Use SweetAlert2 if available
          import('sweetalert2').then((Swal) => {
            Swal.default.fire({
              icon: 'error',
              title: 'Account Banned',
              text: data.message || 'Your account has been restricted.',
              confirmButtonColor: '#d33',
              confirmButtonText: 'I Understand',
              allowOutsideClick: false
            }).then(() => {
              window.location.href = '/auth';
            });
          }).catch(() => {
             // Fallback
             alert(data.message || 'Your account has been banned.');
             window.location.href = '/auth';
          });
          
          // Return pending promise to prevent other catch blocks from firing immediately
          return new Promise(() => {}); 
        }
      }
      
      // Return error in consistent format
      return Promise.reject({
        message: data?.message || 'An error occurred',
        errors: data?.errors || [],
        status: status,
        data: data,
      });
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        errors: [],
        status: 0,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        errors: [],
        status: 0,
      });
    }
  }
);

export default api;

