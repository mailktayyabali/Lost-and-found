import { uploadImage, uploadMultipleImages, deleteImage } from '../config/cloudinary.js';

// Upload single image to Cloudinary
const uploadSingleImage = async (file) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // If file has buffer (from multer memory storage)
    if (file.buffer) {
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const imageUrl = await uploadImage(dataUri);
      return imageUrl;
    }

    // If file has path (from disk storage)
    if (file.path) {
      const imageUrl = await uploadImage(file.path);
      return imageUrl;
    }

    throw new Error('Invalid file format');
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

// Upload multiple images to Cloudinary
const uploadMultipleImageFiles = async (files) => {
  try {
    if (!files || files.length === 0) {
      return [];
    }

    const imageUrls = await uploadMultipleImages(files);
    return imageUrls;
  } catch (error) {
    throw new Error(`Multiple image upload failed: ${error.message}`);
  }
};

// Delete image from Cloudinary
const deleteImageFromCloud = async (imageUrl) => {
  try {
    if (!imageUrl) {
      return;
    }

    await deleteImage(imageUrl);
  } catch (error) {
    // Log error but don't throw - image might already be deleted
    console.error(`Image deletion failed: ${error.message}`);
  }
};

// Delete multiple images
const deleteMultipleImages = async (imageUrls) => {
  try {
    if (!imageUrls || imageUrls.length === 0) {
      return;
    }

    const deletePromises = imageUrls.map((url) => deleteImageFromCloud(url));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error(`Multiple image deletion failed: ${error.message}`);
  }
};

export {
  uploadSingleImage,
  uploadMultipleImageFiles,
  deleteImageFromCloud,
  deleteMultipleImages,
};

