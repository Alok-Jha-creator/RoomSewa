import express from 'express';
import {
  createBooking,
  getMyBookings,
  getPropertyBookings,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/booking.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// POST /api/booking - Create booking
router.post('/', verifyToken, createBooking);

// GET /api/booking/my - Get my bookings (as renter)
router.get('/my', verifyToken, getMyBookings);

// GET /api/booking/property - Get bookings for my properties (as owner)
router.get('/property', verifyToken, getPropertyBookings);

// PATCH /api/booking/:id/status - Update booking status
router.patch('/:id/status', verifyToken, updateBookingStatus);

// DELETE /api/booking/:id - Delete booking
router.delete('/:id', verifyToken, deleteBooking);

export default router;