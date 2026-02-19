import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllPropertiesAdmin,
  deletePropertyAdmin,
  getAllBookingsAdmin,
  updateUserRole,
} from '../controllers/admin.controller.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';

const router = express.Router();

// All routes are admin-protected
router.get('/stats', verifyAdmin, getDashboardStats);
router.get('/users', verifyAdmin, getAllUsers);
router.delete('/users/:id', verifyAdmin, deleteUser);
router.put('/users/:id/role', verifyAdmin, updateUserRole);

router.get('/properties', verifyAdmin, getAllPropertiesAdmin);
router.delete('/properties/:id', verifyAdmin, deletePropertyAdmin);

router.get('/bookings', verifyAdmin, getAllBookingsAdmin);

export default router;