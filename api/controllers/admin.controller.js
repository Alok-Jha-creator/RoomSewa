import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import Booking from '../models/booking.model.js';
import { errorHandler } from '../utils/error.js';

// ─── GET DASHBOARD STATS ───
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Listing.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    const totalRenters = await User.countDocuments({ role: 'renter' });
    const totalOwners = await User.countDocuments({ role: 'owner' });
    
    const availableProperties = await Listing.countDocuments({ isAvailable: true });
    const rentedProperties = await Listing.countDocuments({ isAvailable: false });
    
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const approvedBookings = await Booking.countDocuments({ status: 'approved' });
    const rejectedBookings = await Booking.countDocuments({ status: 'rejected' });

    // Recent activities
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentProperties = await Listing.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentBookings = await Booking.find()
      .populate('property', 'title')
      .populate('renter', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          renters: totalRenters,
          owners: totalOwners,
        },
        properties: {
          total: totalProperties,
          available: availableProperties,
          rented: rentedProperties,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          approved: approvedBookings,
          rejected: rejectedBookings,
        },
      },
      recentActivities: {
        users: recentUsers,
        properties: recentProperties,
        bookings: recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL USERS ───
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE USER ───
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    if (user.role === 'admin') {
      return next(errorHandler(403, 'Cannot delete admin user'));
    }

    await User.findByIdAndDelete(id);
    await Listing.deleteMany({ owner: id });
    await Booking.deleteMany({ renter: id });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL PROPERTIES (Admin) ───
export const getAllPropertiesAdmin = async (req, res, next) => {
  try {
    const properties = await Listing.find()
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: properties.length,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE PROPERTY (Admin) ───
export const deletePropertyAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await Listing.findById(id);
    if (!property) {
      return next(errorHandler(404, 'Property not found'));
    }

    await Listing.findByIdAndDelete(id);
    await Booking.deleteMany({ property: id });

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL BOOKINGS (Admin) ───
export const getAllBookingsAdmin = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('property', 'title price location')
      .populate('renter', 'name email phone')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE USER ROLE ───
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['renter', 'owner', 'admin'].includes(role)) {
      return next(errorHandler(400, 'Invalid role'));
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};