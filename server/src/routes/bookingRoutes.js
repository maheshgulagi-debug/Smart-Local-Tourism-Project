import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/bookingController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createBooking);
router.get('/mine', getMyBookings);
router.get('/:id', getBookingById);
router.patch(
  '/:id/status',
  authorize('provider', 'admin'),
  updateBookingStatus
);
router.patch('/:id/cancel', cancelBooking);
router.post('/:id/cancel', cancelBooking);

export default router;
