import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyAdmin = (req, res, next) => {
  // First verify token
  const token =
    req.cookies?.access_token ||
    req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(errorHandler(401, 'Unauthorized — No token provided'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(errorHandler(403, 'Forbidden — Invalid or expired token'));
    }

    req.user = decoded;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(errorHandler(403, 'Forbidden — Admin access only'));
    }

    next();
  });
};