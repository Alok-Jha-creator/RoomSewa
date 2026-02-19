import express from 'express';
import {
  createListing,
  getAllListings,
  getListing,
  updateListing,
  deleteListing,
  toggleAvailability,
} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// GET    /api/listing/         ← get all listings (public)
router.get('/', getAllListings);

// GET    /api/listing/:id      ← get single listing (public)
router.get('/:id', getListing);

// POST   /api/listing/create   ← create listing (protected)
router.post('/create', verifyToken, createListing);

// PUT    /api/listing/update/:id  ← update listing (protected)
router.put('/update/:id', verifyToken, updateListing);

// DELETE /api/listing/delete/:id  ← delete listing (protected)
router.delete('/delete/:id', verifyToken, deleteListing);

// PUT    /api/listing/toggle/:id  ← toggle availability (protected)
router.put('/toggle/:id', verifyToken, toggleAvailability);

export default router;