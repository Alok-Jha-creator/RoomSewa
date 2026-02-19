import express from 'express';
import { uploadImage, uploadImages } from '../controllers/upload.controller.js';
import { upload } from '../config/cloudinary.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// POST /api/upload/single  ← single image
router.post('/single', verifyToken, upload.single('image'), uploadImage);

// POST /api/upload/multiple ← multiple images (max 5)
router.post('/multiple', verifyToken, upload.array('images', 5), uploadImages);

export default router;