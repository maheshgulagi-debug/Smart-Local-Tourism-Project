import { Router } from 'express';
import {
  getAllUsers,
  updateUserRole,
  getAdminListings,
  approveOrRejectListing,
  getAdminBookings,
  getAdminStats,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.get('/listings', getAdminListings);
router.patch('/listings/:id/approve', approveOrRejectListing);
router.get('/bookings', getAdminBookings);
router.get('/stats', getAdminStats);

export default router;
