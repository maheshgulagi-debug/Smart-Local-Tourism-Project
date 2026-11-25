import { prisma } from '../utils/prisma.js';
import { AppError } from '../utils/errors.js';
import { createReviewSchema } from '../utils/validation.js';

export async function createReview(req, res, next) {
  try {
    const data = createReviewSchema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: data.bookingId },
        include: { review: true },
      });

      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      if (booking.touristId !== req.user.id) {
        throw new AppError('You can only review your own completed bookings', 403);
      }

      if (booking.status !== 'completed') {
        throw new AppError(
          'Only completed bookings can be reviewed',
          400
        );
      }

      if (booking.review) {
        throw new AppError('You have already reviewed this booking', 409);
      }

      const review = await tx.review.create({
        data: {
          listingId: booking.listingId,
          touristId: req.user.id,
          bookingId: booking.id,
          rating: data.rating,
          comment: data.comment,
        },
        include: {
          tourist: { select: { id: true, name: true } },
        },
      });

      const aggregate = await tx.review.aggregate({
        where: { listingId: booking.listingId },
        _avg: { rating: true },
      });

      const avgRating = Number((aggregate._avg.rating || 0).toFixed(2));

      await tx.listing.update({
        where: { id: booking.listingId },
        data: { avgRating },
      });

      return { review, avgRating };
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for your review!',
      data: result,
    });
  } catch (err) {
    return next(err);
  }
}

export async function getListingReviews(req, res, next) {
  try {
    const listingId = parseInt(req.params.id, 10);
    if (Number.isNaN(listingId)) {
      throw new AppError('Invalid listing ID', 400);
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, avgRating: true },
    });

    if (!listing) {
      throw new AppError('Listing not found', 404);
    }

    const reviews = await prisma.review.findMany({
      where: { listingId },
      orderBy: { createdAt: 'desc' },
      include: {
        tourist: { select: { id: true, name: true } },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        avgRating: listing.avgRating,
        reviews,
      },
    });
  } catch (err) {
    return next(err);
  }
}
