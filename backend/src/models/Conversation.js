import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: true,
      validate: {
        validator: function (v) {
          return v.length === 2;
        },
        message: 'Conversation must have exactly 2 participants',
      },
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    lastMessageAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
conversationSchema.index({ participants: 1 });
conversationSchema.index({ item: 1 });
conversationSchema.index({ lastMessageAt: -1 });

// Compound index to find conversation between two users for an item
conversationSchema.index({ item: 1, participants: 1 });

export default mongoose.model('Conversation', conversationSchema);

