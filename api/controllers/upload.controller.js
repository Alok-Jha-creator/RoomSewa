import { errorHandler } from '../utils/error.js';

// ─── UPLOAD SINGLE IMAGE ───
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, 'No image uploaded'));
    }

    res.status(200).json({
      success: true,
      url: req.file.path,         // Cloudinary URL
      public_id: req.file.filename,
    });

  } catch (error) {
    next(error);
  }
};

// ─── UPLOAD MULTIPLE IMAGES ───
export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(errorHandler(400, 'No images uploaded'));
    }

    const urls = req.files.map(file => file.path);

    res.status(200).json({
      success: true,
      urls,
    });

  } catch (error) {
    next(error);
  }
};