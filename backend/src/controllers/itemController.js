import Item from '../models/Item.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import { searchItems, findMatchingAlerts } from '../services/searchService.js';
import { uploadMultipleImageFiles, deleteMultipleImages } from '../services/imageService.js';
import { transformItem, transformItems } from '../utils/transformers.js';
import { createNotification, sendEmailNotification } from '../services/notificationService.js';

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
      // Default to hiding resolved items unless explicitly requested (e.g. 'true' or 'all')
      isResolved: req.query.isResolved,
      sortBy: req.query.sortBy || 'newest',
    };

    // If isResolved is not specified, default to false (show only unresolved items)
    if (filters.isResolved === undefined) {
      filters.isResolved = 'false'; // searchService expects string 'false' for boolean false if parsing query params logic applies, checking searchService next
    }

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
    // Trigger Search Alerts (Async - don't block response)
    findMatchingAlerts(item).then(async (matches) => {
      console.log(`[Alerts] Found ${matches.length} matching alerts for item ${item._id}`);
      
      for (const alert of matches) {
        // Create in-app notification
        await createNotification(
          alert.user._id,
          'match',
          'New Search Alert Match',
          `A new item matching your alert "${alert.name}" has been posted: ${item.title}`,
          {
            itemId: item._id,
            alertId: alert._id,
            item: item, // Passing item data for potential use
          }
        );

        // Send email notification
        await sendEmailNotification(alert.user, 'match', { item });
      }
    }).catch(err => console.error('[Alerts] Error processing alerts:', err));

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

    // Check if item is already resolved
    if (item.isResolved) {

      throw new BadRequestError('Cannot edit an item that has been claimed/resolved');
    }

    const itemData = { ...req.body };

    // Handle image updates
    // Handle image updates
    // Logic:
    // 1. Identify kept images (from req.body.keptImages)
    // 2. Identify new images (from req.files)
    // 3. Calculate images to delete (item.images - keptImages)
    // 4. Delete removed images from cloud
    // 5. Update item.images with [...keptImages, ...newImages]

    let keptImages = [];
    if (req.body.keptImages) {
        if (Array.isArray(req.body.keptImages)) {
            keptImages = req.body.keptImages;
        } else {
            keptImages = [req.body.keptImages];
        }
    } else {
        // If keptImages is explicitly not sent (or empty), it might mean delete all? 
        // But validation requires at least one.
        // If the frontend sends nothing for 'keptImages', we assume user kept none of the old ones.
        // HOWEVER, to be safe against older clients, if keptImages is undefined, maybe we shouldn't wipe?
        // But for this feature, the frontend WILL send keptImages.
        // If keptImages is undefined, we assume empty array (user removed all old images).
        keptImages = [];
    }

    // Determine images to delete
    const oldImages = item.images || [];
    const imagesToDelete = oldImages.filter(img => !keptImages.includes(img));

    // Handle new uploads
    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      newImageUrls = await uploadMultipleImageFiles(req.files);
    } else if (req.body.images && Array.isArray(req.body.images)) {
        // Fallback or specific testing scenario where images are sent as URLs directly
        newImageUrls = req.body.images;
    }

    const finalImages = [...keptImages, ...newImageUrls];

    // Validate: At least one image must exist
    if (finalImages.length === 0) {

         throw new BadRequestError('At least one image is required');
    }

    // Delete removed images
    if (imagesToDelete.length > 0) {
        await deleteMultipleImages(imagesToDelete);
    }

    itemData.images = finalImages;

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

export {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  markAsResolved,
  getUserItems,
  searchItemsController as searchItems, // alias export
  incrementViews,
};

