const mongoose = require('mongoose');

const searchAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide an alert name'],
      trim: true,
      maxlength: [100, 'Alert name cannot exceed 100 characters'],
    },
    filters: {
      keywords: {
        type: String,
        trim: true,
      },
      category: {
        type: String,
        enum: ['Electronics', 'Accessories', 'Clothing', 'Documents', 'Bags', 'Pets', 'Keys', 'Other'],
      },
      location: {
        type: String,
        trim: true,
      },
      type: {
        type: String,
        enum: ['lost', 'found'],
      },
      dateFrom: {
        type: Date,
      },
      dateTo: {
        type: Date,
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
searchAlertSchema.index({ user: 1 });
searchAlertSchema.index({ active: 1 });
searchAlertSchema.index({ user: 1, active: 1 });

module.exports = mongoose.model('SearchAlert', searchAlertSchema);

