import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

// ─── CREATE LISTING ───
export const createListing = async (req, res, next) => {
  try {
    const { title, description, price, type, location, photos, amenities } = req.body;

    // Validation
    if (!title || !description || !price || !type || !location?.address || !location?.city) {
      return next(errorHandler(400, 'Please fill all required fields'));
    }

    const newListing = new Listing({
      title,
      description,
      price,
      type,
      location,
      photos: photos || [],
      amenities: amenities || [],
      isAvailable: true,
      owner: req.user.id,
    });

    await newListing.save();

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing: newListing,
    });

  } catch (error) {
    next(error);
  }
};

// ─── GET ALL LISTINGS ───
export const getAllListings = async (req, res, next) => {
  try {
    const {
      search,
      city,
      type,
      minPrice,
      maxPrice,
      isAvailable,
      limit = 12,
      page = 1,
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (city)        filter['location.city'] = { $regex: city, $options: 'i' };
    if (type)        filter.type             = type;
    if (isAvailable) filter.isAvailable      = isAvailable === 'true';

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Listing.countDocuments(filter);

    const listings = await Listing.find(filter)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      listings,
    });

  } catch (error) {
    next(error);
  }
};

// ─── GET SINGLE LISTING ───
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }

    res.status(200).json({
      success: true,
      listing,
    });

  } catch (error) {
    next(error);
  }
};

// ─── UPDATE LISTING ───
export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }

    // Only owner can update
    if (listing.owner.toString() !== req.user.id) {
      return next(errorHandler(403, 'You can only update your own listings'));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      listing: updatedListing,
    });

  } catch (error) {
    next(error);
  }
};

// ─── DELETE LISTING ───
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }

    // Only owner can delete
    if (listing.owner.toString() !== req.user.id) {
      return next(errorHandler(403, 'You can only delete your own listings'));
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully',
    });

  } catch (error) {
    next(error);
  }
};

// ─── TOGGLE AVAILABILITY ───
export const toggleAvailability = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }

    if (listing.owner.toString() !== req.user.id) {
      return next(errorHandler(403, 'You can only update your own listings'));
    }

    listing.isAvailable = !listing.isAvailable;
    await listing.save();

    res.status(200).json({
      success: true,
      message: `Listing marked as ${listing.isAvailable ? 'Available' : 'Unavailable'}`,
      listing,
    });

  } catch (error) {
    next(error);
  }
};