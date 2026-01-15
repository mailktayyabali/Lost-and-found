import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload single image from buffer or file path
const uploadImage = async (filePathOrBuffer, options = {}) => {
  try {
    const uploadOptions = {
      folder: 'findit',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto' },
      ],
      ...options,
    };

    const result = await cloudinary.uploader.upload(filePathOrBuffer, uploadOptions);
    return result.secure_url;
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

// Upload multiple images
const uploadMultipleImages = async (files) => {
  try {
    const uploadPromises = files.map((file) => {
      if (file.path) {
        return uploadImage(file.path);
      } else if (file.buffer) {
        // Convert buffer to data URI
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        return uploadImage(dataUri, { resource_type: 'image' });
      }
      throw new Error('Invalid file format');
    });
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error(`Multiple image upload failed: ${error.message}`);
  }
};

// Delete image from Cloudinary
const deleteImage = async (imageUrl) => {
  try {
    // Extract public_id from URL
    const urlParts = imageUrl.split('/');
    const publicIdWithExt = urlParts.slice(-2).join('/');
    const publicId = publicIdWithExt.split('.')[0];
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};

export {
  cloudinary,
  uploadImage,
  uploadMultipleImages,
  deleteImage,
};

