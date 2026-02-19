import express from 'express';
import {
  getProfile,
  updateProfile,
  deleteAccount,
  getUserListings,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// GET  /api/user/profile
router.get('/profile', verifyToken, getProfile);

// PUT  /api/user/update/:id
router.put('/update/:id', verifyToken, updateProfile);

// DELETE /api/user/delete/:id
router.delete('/delete/:id', verifyToken, deleteAccount);

// GET /api/user/listings/:id
router.get('/listings/:id', verifyToken, getUserListings);

export default router;