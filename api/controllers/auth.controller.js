import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

// ─── REGISTER ───
export const register = async (req, res, next) => {
  const { name, email, password, phone, role } = req.body;

  // Validation
  if (!name || !email || !password) {
    return next(errorHandler(400, 'Name, email and password are required'));
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(409, 'Email already registered'));
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      role: role || 'renter',
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: pass, ...userInfo } = newUser._doc;

    res
      .cookie('access_token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      .json({
        success: true,
        message: 'Registration successful',
        user: userInfo,
        token,
      });

  } catch (error) {
    next(error);
  }
};

// ─── LOGIN ───
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return next(errorHandler(400, 'Email and password are required'));
  }

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // Check password
    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, 'Invalid credentials'));
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: pass, ...userInfo } = user._doc;

    res
      .cookie('access_token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: 'Login successful',
        user: userInfo,
        token,
      });

  } catch (error) {
    next(error);
  }
};

// ─── LOGOUT ───
export const logout = (req, res) => {
  res
    .clearCookie('access_token')
    .status(200)
    .json({
      success: true,
      message: 'Logged out successfully',
    });
};