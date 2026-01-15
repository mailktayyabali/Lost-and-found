// Reusable validation schemas and custom validators
import { body, param, query, validationResult } from 'express-validator';

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

const validateUserLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// Item validation rules
const validateItemCreation = [
  body('status').isIn(['LOST', 'FOUND']).withMessage('Status must be LOST or FOUND'),
  body('title').trim().notEmpty().isLength({ max: 100 }).withMessage('Title is required (max 100 chars)'),
  body('description').trim().notEmpty().isLength({ max: 500 }).withMessage('Description is required (max 500 chars)'),
  body('category').isIn(['Electronics', 'Accessories', 'Clothing', 'Documents', 'Bags', 'Pets', 'Keys', 'Other']).withMessage('Invalid category'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('contactName').trim().notEmpty().withMessage('Contact name is required'),
  body('contactEmail').isEmail().normalizeEmail().withMessage('Valid contact email is required'),
  handleValidationErrors,
];

// Review validation rules
const validateReviewCreation = [
  body('reviewee').isMongoId().withMessage('Valid user ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters'),
  handleValidationErrors,
];

// Search Alert validation rules
const validateSearchAlert = [
  body('name').trim().notEmpty().isLength({ max: 100 }).withMessage('Alert name is required (max 100 chars)'),
  body('filters.type').optional().isIn(['lost', 'found']).withMessage('Type must be lost or found'),
  body('filters.category').optional().isIn(['Electronics', 'Accessories', 'Clothing', 'Documents', 'Bags', 'Pets', 'Keys', 'Other']).withMessage('Invalid category'),
  handleValidationErrors,
];

// Message validation rules
const validateMessage = [
  body('itemId').optional().isMongoId().withMessage('Valid item ID is required'),
  body('conversationId').optional().isMongoId().withMessage('Valid conversation ID is required'),
  body('receiverId').isMongoId().withMessage('Valid receiver ID is required'),
  body('content').trim().notEmpty().isLength({ max: 1000 }).withMessage('Message content is required (max 1000 chars)'),
  handleValidationErrors,
];

// ID parameter validation - validate any route param that looks like an ID
const validateMongoId = (req, res, next) => {
  const isValidObjectId = (val) => typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val);

  const params = req.params || {};
  // If there are no params, continue
  const keys = Object.keys(params);
  if (keys.length === 0) return next();

  for (const key of keys) {
    const val = params[key];
    if (!isValidObjectId(val)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ msg: `Invalid ID format for param ${key}`, param: key }],
      });
    }
  }

  next();
};

export {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateItemCreation,
  validateReviewCreation,
  validateSearchAlert,
  validateMessage,
  validateMongoId,
};

