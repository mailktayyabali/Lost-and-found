const Item = require('../models/Item');
const { sendSuccess, sendError } = require('../utils/response');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');
const { searchItems } = require('../services/searchService');
const { uploadMultipleImageFiles, deleteMultipleImages } = require('../services/imageService');
const { transformItem, transformItems } = require('../utils/transformers');

// Get all items with filters and pagination
const getAllItems = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filters = {
      status: req.query.status,
      category: req.query.category,
      location: req.query.location,
      keywords: req.query.keywords,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      isResolved: req.query.isResolved,
      sortBy: req.query.sortBy || 'newest',
    };

    const result = await searchItems(filters, { page, limit, skip });

    sendSuccess(res, 'Items retrieved successfully', {
      items: transformItems(result.items),
      pagination: getPaginationMeta(page, limit, result.total),
    });
  } catch (error) {
    next(error);
  }
};

// Get single item by ID
const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'postedBy',
      'name username avatar rating verified'
    );

    if (!item) {
      throw new NotFoundError('Item');
    }

    sendSuccess(res, 'Item retrieved successfully', { item: transformItem(item) });
  } catch (error) {
    next(error);
  }
};

// Create new item
const createItem = async (req, res, next) => {
  try {
    console.log('createItem called', {
      user: req.user ? req.user.id : null,
      bodyKeys: Object.keys(req.body || {}),
      fileCount: req.files ? req.files.length : 0,
    });
    const itemData = {
      ...req.body,
      postedBy: req.user.id,
      contactName: req.body.contactName || req.user.name,
      contactEmail: req.body.contactEmail || req.user.email,
    };

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const imageUrls = await uploadMultipleImageFiles(req.files);
      itemData.images = imageUrls;
    } else if (req.body.images && Array.isArray(req.body.images)) {
      itemData.images = req.body.images;
    }

    const item = await Item.create(itemData);
    await item.populate('postedBy', 'name username avatar rating verified');

    sendSuccess(res, 'Item created successfully', { item: transformItem(item) }, 201);
  } catch (error) {
    console.error('createItem error', error);
    next(error);
  }
};

// Update item
const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      throw new NotFoundError('Item');
    }

    // Check if user is owner or admin
    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new ForbiddenError('Not authorized to update this item');
    }

    const itemData = { ...req.body };

    // Handle image updates
    if (req.files && req.files.length > 0) {
      const newImageUrls = await uploadMultipleImageFiles(req.files);
      const oldImages = item.images || [];
      itemData.images = [...oldImages, ...newImageUrls];
    } else if (req.body.images && Array.isArray(req.body.images)) {
      itemData.images = req.body.images;
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, itemData, {
      new: true,
      runValidators: true,
    }).populate('postedBy', 'name username avatar rating verified');

    sendSuccess(res, 'Item updated successfully', { item: transformItem(updatedItem) });
  } catch (error) {
    next(error);
  }
};

// Delete item
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      throw new NotFoundError('Item');
    }

    // Check if user is owner or admin
    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new ForbiddenError('Not authorized to delete this item');
    }

    // Delete images from Cloudinary
    if (item.images && item.images.length > 0) {
      await deleteMultipleImages(item.images);
    }

    await Item.findByIdAndDelete(req.params.id);

    sendSuccess(res, 'Item deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Mark item as resolved
const markAsResolved = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      throw new NotFoundError('Item');
    }

    // Check if user is owner or admin
    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new ForbiddenError('Not authorized to resolve this item');
    }

    item.isResolved = true;
    item.resolvedAt = new Date();
    item.resolvedBy = req.user.id;
    await item.save();
    await item.populate('postedBy', 'name username avatar rating verified');

    sendSuccess(res, 'Item marked as resolved', { item: transformItem(item) });
  } catch (error) {
    next(error);
  }
};

// Get user's items
const getUserItems = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const userId = req.params.userId || req.user.id;

    const items = await Item.find({ postedBy: userId })
      .populate('postedBy', 'name username avatar rating verified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Item.countDocuments({ postedBy: userId });

    sendSuccess(res, 'User items retrieved successfully', {
      items: transformItems(items),
      pagination: getPaginationMeta(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
};

// Search items
const searchItemsController = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filters = {
      ...req.query,
      sortBy: req.query.sortBy || 'newest',
    };

    const result = await searchItems(filters, { page, limit, skip });

    sendSuccess(res, 'Search completed successfully', {
      items: transformItems(result.items),
      pagination: getPaginationMeta(page, limit, result.total),
    });
  } catch (error) {
    next(error);
  }
};

// Increment view count
const incrementViews = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!item) {
      throw new NotFoundError('Item');
    }

    sendSuccess(res, 'View count updated', { views: item.views });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  markAsResolved,
  getUserItems,
  searchItems: searchItemsController,
  incrementViews,
};

