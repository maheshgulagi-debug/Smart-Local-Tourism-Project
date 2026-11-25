import { Router } from 'express';
import {
  getProviderListings,
  getProviderBookings,
} from '../controllers/providerController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, authorize('provider', 'admin'));

router.get('/listings', getProviderListings);
router.get('/bookings', getProviderBookings);

export default router;
