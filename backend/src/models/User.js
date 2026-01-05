const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      select: false,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    memberSince: {
      type: Date,
      default: Date.now,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      trim: true,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
// Hash password and enforce single admin limit before saving
userSchema.pre('save', async function (next) {
  // Enforce Single Admin Policy
  if (this.role === 'admin') {
    const adminCount = await mongoose.models.User.countDocuments({ role: 'admin' });
    // If this is a new admin (no _id) OR an existing user changing role to admin
    // AND we already have an admin that isn't this user
    if (adminCount > 0) {
      // Logic: if we are updating, we need to check if we are THE admin.
      // If we are new, failure.
      // If we are updating, we only fail if we aren't the existing admin.
      const existingAdmin = await mongoose.models.User.findOne({ role: 'admin' });
      if (existingAdmin && existingAdmin._id.toString() !== this._id.toString()) {
        const err = new Error('Security Violation: Only one administrator is allowed.');
        return next(err);
      }
    }
  }

  // Skip password hashing if not modified
  if (!this.isModified('password')) {
    if (typeof next === 'function') {
      return next();
    }
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    if (typeof next === 'function') {
      return next();
    }
  } catch (error) {
    if (typeof next === 'function') {
      return next(error);
    }
    throw error;
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);


