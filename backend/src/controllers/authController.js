import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AppError, UnauthorizedError, ValidationError, ForbiddenError } from '../utils/errors.js';
import { sendWelcomeEmail } from '../services/emailService.js';
import { transformUser } from '../utils/transformers.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Login
const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Check if user is banned
      if (user.isBanned) {
        throw new ForbiddenError(`Your account has been banned. Reason: ${user.banReason || 'Violation of terms'}`);
      }

      // User exists - check if googleId is set
      if (!user.googleId) {
        user.googleId = googleId;
        // Update avatar if missing
        if (!user.avatar) user.avatar = picture;
        await user.save();
      }
    } else {
      // Create new user with random password
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password: randomPassword,
        googleId,
        avatar: picture,
        verified: true, // Google emails are verified
      });
      // Send welcome email
      sendWelcomeEmail(user).catch(console.error);
    }

    const authToken = user.generateAuthToken();
    
    sendSuccess(res, 'Google login successful', {
      user: transformUser(user),
      token: authToken,
    });
  } catch (error) {
    console.error('Google login error:', error);
    next(new UnauthorizedError('Invalid Google Token'));
  }
};

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
      role: 'user', // Force role to user, blocking API admin creation
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

    // Check if user is banned
    if (user.isBanned) {
      throw new ForbiddenError(`Your account has been banned. Reason: ${user.banReason || 'Violation of terms'}`);
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
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../services/emailService.js';

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      // Don't reveal if user exists for security
      return sendSuccess(res, 'If user exists, password reset email has been sent');
    }

    // Generate a reset token and store its hash + expiry on the user
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // Send email with the plain resetToken
    try {
      await sendPasswordResetEmail(user, resetToken);
    } catch (err) {
      console.error('Failed to send reset email:', err);
      // don't reveal, but clear token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return sendSuccess(res, 'If user exists, password reset email has been sent');
    }

    sendSuccess(res, 'If user exists, password reset email has been sent');
  } catch (error) {
    next(error);
  }
};

// Reset password (placeholder)
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      throw new ValidationError('Token and new password are required');
    }

    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+password +resetPasswordToken +resetPasswordExpires');

    if (!user) {
      throw new ValidationError('Invalid or expired token');
    }

    // Update password and clear reset fields
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    sendSuccess(res, 'Password has been reset successfully');
  } catch (error) {
    next(error);
  }
};

export {
  register,
  login,
  getMe,

  changePassword,
  forgotPassword,
  resetPassword,
  googleLogin,
};

