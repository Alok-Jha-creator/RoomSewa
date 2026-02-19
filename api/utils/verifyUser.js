import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  // Check token from cookie or Authorization header
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
    next();
  });
};

export const verifyOwner = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'owner') {
      return next(errorHandler(403, 'Forbidden — Only owners can perform this action'));
    }
    next();
  });
};