import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['LOST', 'FOUND'],
      required: [true, 'Please specify if item is LOST or FOUND'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      match: [/^[a-zA-Z\s]*$/, 'Title can only contain letters and spaces'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    fullDescription: {
      type: String,
      trim: true,
      maxlength: [2000, 'Full description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      enum: ['Electronics', 'Accessories', 'Clothing', 'Documents', 'Bags', 'Pets', 'Keys', 'Other'],
      required: [true, 'Please select a category'],
    },
    color: {
      type: String,
      trim: true,
      match: [/^[a-zA-Z\s]*$/, 'Color can only contain letters and spaces'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
      trim: true,
    },
    mapLocation: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide the date when item was lost/found'],
    },
    time: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'Please upload at least one image',
      },
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contactName: {
      type: String,
      required: [true, 'Please provide contact name'],
      trim: true,
      match: [/^[a-zA-Z\s]*$/, 'Contact name can only contain letters and spaces'],
    },
    contactEmail: {
      type: String,
      required: [true, 'Please provide contact email'],
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    contactPhone: {
      type: String,
      required: [true, 'Please provide contact phone number'],
      trim: true,
      match: [/^\d+$/, 'Phone number must contain only numbers'],
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    views: {
      type: Number,
      default: 0,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for filtering and searching
itemSchema.index({ status: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ location: 1 });
itemSchema.index({ postedBy: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ isResolved: 1 });

// Text index for search
itemSchema.index({
  title: 'text',
  description: 'text',
  fullDescription: 'text',
  location: 'text',
});

export default mongoose.model('Item', itemSchema);

