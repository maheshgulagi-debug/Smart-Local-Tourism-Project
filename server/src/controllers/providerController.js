import { prisma } from '../utils/prisma.js';
import {
  safeUserSelect,
  serializeListing,
} from '../utils/listingSerializer.js';

export async function getProviderListings(req, res, next) {
  try {
    const listings = await prisma.listing.findMany({
      where: { providerId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { bookings: true, reviews: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        listings: listings.map(serializeListing),
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function getProviderBookings(req, res, next) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        listing: {
          providerId: req.user.id,
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        listing: true,
        tourist: { select: safeUserSelect },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        bookings: bookings.map((b) => ({
          ...b,
          listing: serializeListing(b.listing),
        })),
      },
    });
  } catch (err) {
    return next(err);
  }
}
