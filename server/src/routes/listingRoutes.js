import { Router } from 'express';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/listingController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', getListings);
router.get('/:id', optionalAuth, getListingById);
router.post('/', authenticate, authorize('provider', 'admin'), createListing);
router.put('/:id', authenticate, authorize('provider', 'admin'), updateListing);
router.delete('/:id', authenticate, authorize('provider', 'admin'), deleteListing);

export default router;
