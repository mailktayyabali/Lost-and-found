const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['match', 'message', 'system'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
      },
      alertId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SearchAlert',
      },
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      // Store other flexible data if needed
      link: String,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
