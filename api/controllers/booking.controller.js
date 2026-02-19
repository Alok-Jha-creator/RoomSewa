import Booking from '../models/booking.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

// ─── CREATE BOOKING ───
export const createBooking = async (req, res, next) => {
  try {
    const { property, message } = req.body;

    if (!property) {
      return next(errorHandler(400, 'Property ID is required'));
    }

    // Check if property exists
    const listing = await Listing.findById(property);
    if (!listing) {
      return next(errorHandler(404, 'Property not found'));
    }

    // Check if available
    if (!listing.isAvailable) {
      return next(errorHandler(400, 'This property is not available'));
    }

    // Can't book own property
    if (listing.owner.toString() === req.user.id) {
      return next(errorHandler(400, 'You cannot book your own property'));
    }

    // Check if already booked by this user
    const existingBooking = await Booking.findOne({
      property: property,
      renter: req.user.id,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingBooking) {
      return next(errorHandler(400, 'You already have a booking request for this property'));
    }

    // Create booking
    const newBooking = new Booking({
      property: property,
      renter: req.user.id,
      owner: listing.owner,
      message: message || '',
      status: 'pending'
    });

    await newBooking.save();

    const populatedBooking = await Booking.findById(newBooking._id)
      .populate('property', 'title price location photos')
      .populate('renter', 'name email phone')
      .populate('owner', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking request sent successfully',
      booking: populatedBooking,
    });

  } catch (error) {
    next(error);
  }
};

// ─── GET MY BOOKINGS ───
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ renter: req.user.id })
      .populate('property', 'title price location photos isAvailable')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });

  } catch (error) {
    next(error);
  }
};

// ─── GET BOOKINGS FOR MY PROPERTIES ───
export const getPropertyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ owner: req.user.id })
      .populate('property', 'title price location photos')
      .populate('renter', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });

  } catch (error) {
    next(error);
  }
};

// ─── UPDATE BOOKING STATUS ───
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    if (!['approved', 'rejected', 'cancelled'].includes(status)) {
      return next(errorHandler(400, 'Invalid status'));
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return next(errorHandler(404, 'Booking not found'));
    }

    // Only owner can approve/reject
    if (status === 'approved' || status === 'rejected') {
      if (booking.owner.toString() !== req.user.id) {
        return next(errorHandler(403, 'Only property owner can approve/reject bookings'));
      }
    }

    // Only renter can cancel
    if (status === 'cancelled') {
      if (booking.renter.toString() !== req.user.id) {
        return next(errorHandler(403, 'Only the renter can cancel this booking'));
      }
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(bookingId)
      .populate('property', 'title price location')
      .populate('renter', 'name email')
      .populate('owner', 'name email');

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking: updatedBooking,
    });

  } catch (error) {
    next(error);
  }
};

// ─── DELETE BOOKING ───
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(errorHandler(404, 'Booking not found'));
    }

    // Only renter or owner can delete
    if (booking.renter.toString() !== req.user.id && booking.owner.toString() !== req.user.id) {
      return next(errorHandler(403, 'Not authorized to delete this booking'));
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });

  } catch (error) {
    next(error);
  }
};