import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

// ─── GET PROFILE ───
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    next(error);
  }
};

// ─── UPDATE PROFILE ───
export const updateProfile = async (req, res, next) => {
  // Only allow user to update their own profile
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, 'You can only update your own profile'));
  }

  try {
    const { name, phone, role, avatar, password } = req.body;

    // Build update object
    const updateData = {};
    if (name)   updateData.name   = name;
    if (phone)  updateData.phone  = phone;
    if (role)   updateData.role   = role;
    if (avatar) updateData.avatar = avatar;

    // If password is being updated, hash it
    if (password) {
      if (password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'));
      }
      updateData.password = bcryptjs.hashSync(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });

  } catch (error) {
    next(error);
  }
};

// ─── DELETE ACCOUNT ───
export const deleteAccount = async (req, res, next) => {
  // Only allow user to delete their own account
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, 'You can only delete your own account'));
  }

  try {
    await User.findByIdAndDelete(req.params.id);

    res
      .clearCookie('access_token')
      .status(200)
      .json({
        success: true,
        message: 'Account deleted successfully',
      });

  } catch (error) {
    next(error);
  }
};

// ─── GET USER LISTINGS ───
export const getUserListings = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(403, 'You can only view your own listings'));
  }

  try {
    const listings = await (await import('../models/listing.model.js'))
      .default.find({ owner: req.params.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      listings,
    });

  } catch (error) {
    next(error);
  }
};