/**
 * Error handling utilities
 */

/**
 * Extract error message from API error
 * @param {Error|Object} error - Error object from API
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred';

  // If error has a message property
  if (error.message) {
    return error.message;
  }

  // If error has errors array (validation errors)
  if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors.map((err) => err.message || err.msg || err).join(', ');
  }

  // If error is a string
  if (typeof error === 'string') {
    return error;
  }

  // Default message
  return 'An unexpected error occurred';
};

/**
 * Check if error is a network error
 * @param {Error|Object} error - Error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return error?.status === 0 || !error?.status;
};

/**
 * Check if error is authentication error
 * @param {Error|Object} error - Error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  return error?.status === 401 || error?.status === 403;
};

/**
 * Check if error is validation error
 * @param {Error|Object} error - Error object
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  return error?.status === 400;
};

/**
 * Format validation errors for display
 * @param {Error|Object} error - Error object with errors array
 * @returns {Array} Array of formatted error messages
 */
export const formatValidationErrors = (error) => {
  if (!error?.errors || !Array.isArray(error.errors)) {
    return [];
  }

  return error.errors.map((err) => ({
    field: err.field || err.param || 'general',
    message: err.message || err.msg || 'Invalid value',
  }));
};

