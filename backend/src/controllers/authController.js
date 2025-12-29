const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');
const { AppError, UnauthorizedError, ValidationError } = require('../utils/errors');
const { sendWelcomeEmail } = require('../services/emailService');
const { transformUser } = require('../utils/transformers');

// Register new user
const register = async (req, res, next) => {
  console.log("AuthController: register request received", { 
    body: { ...req.body, password: '***' } // Log safe body
  });
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log("AuthController: register failed - user already exists", email);
      throw new ValidationError('User with this email already exists');
    }

    // Create user
    console.log("AuthController: creating new user...");
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });
    console.log("AuthController: user created", user._id);

    // Generate token
    const token = user.generateAuthToken();

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user).catch((err) => console.error('Welcome email failed:', err));

    sendSuccess(res, 'User registered successfully', {
      user: transformUser(user),
      token,
    }, 201);
  } catch (error) {
    console.error("AuthController: register error", error);
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  console.log("AuthController: login request received", { email: req.body.email });
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      console.log("AuthController: login failed - user not found", email);
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("AuthController: login failed - password mismatch", email);
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate token
    const token = user.generateAuthToken();
    console.log("AuthController: login success", user._id);

    sendSuccess(res, 'Login successful', {
      user: transformUser(user),
      token,
    });
  } catch (error) {
    console.error("AuthController: login error", error);
    next(error);
  }
};

// Get current user profile
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    sendSuccess(res, 'User profile retrieved successfully', { user: transformUser(user) });
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, username, phone, location, bio, avatar } = req.body;
    const userId = req.user.id;

    // Check if username is taken by another user
    if (username) {
      const existingUser = await User.findOne({
        username: username.toLowerCase(),
        _id: { $ne: userId },
      });
      if (existingUser) {
        throw new ValidationError('Username already taken');
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(username && { username: username.toLowerCase() }),
        ...(phone && { phone }),
        ...(location && { location }),
        ...(bio !== undefined && { bio }),
        ...(avatar && { avatar }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    sendSuccess(res, 'Profile updated successfully', { user: transformUser(user) });
  } catch (error) {
    next(error);
  }
};

// Change password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendSuccess(res, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

// Forgot password (placeholder - would need token generation and storage)
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists for security
      return sendSuccess(res, 'If user exists, password reset email has been sent');
    }

    // TODO: Generate reset token and send email
    // For now, just return success
    sendSuccess(res, 'Password reset email sent (if user exists)');
  } catch (error) {
    next(error);
  }
};

// Reset password (placeholder)
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    // TODO: Verify token and reset password
    // For now, return error
    throw new AppError('Password reset not implemented yet', 501);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};

