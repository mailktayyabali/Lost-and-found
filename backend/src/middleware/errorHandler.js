import { formatErrorResponse } from '../utils/errors.js';
import { sendError } from '../utils/response.js';

const errorHandler = (err, req, res, next) => {
  let error = formatErrorResponse(err, req);

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Send error response
  return sendError(
    res,
    error.message || 'Internal server error',
    error.statusCode || 500,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : undefined
  );
};

// 404 handler
const notFound = (req, res, next) => {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
};

export {
  errorHandler,
  notFound,
};

