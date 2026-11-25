import { prisma } from '../utils/prisma.js';
import { AppError } from '../utils/errors.js';
import {
  createBookingSchema,
  bookingStatusSchema,
} from '../utils/validation.js';
import {
  safeUserSelect,
  serializeListing,
} from '../utils/listingSerializer.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseUtcDateOnly(value) {
  const str = String(value).trim();
  const datePart = str.includes('T') ? str.split('T')[0] : str;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    throw new AppError('Dates must be in YYYY-MM-DD format', 400);
  }
  const date = new Date(`${datePart}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new AppError('Invalid date provided', 400);
  }
  return date;
}

function getTodayUtc() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
}

function computeServerTotalPrice(listing, startDate, endDate, guests) {
  const diffDays = Math.round((endDate - startDate) / MS_PER_DAY);

  if (listing.priceUnit === 'per_night') {
    if (diffDays < 1) {
      throw new AppError(
        'Check-out date must be at least 1 night after check-in date',
        400
      );
    }
    return Number((listing.price * diffDays).toFixed(2));
  }

  if (diffDays < 0) {
    throw new AppError('End date cannot be earlier than start date', 400);
  }
  const inclusiveDays = diffDays + 1;

  if (listing.priceUnit === 'per_person') {
    return Number((listing.price * guests * inclusiveDays).toFixed(2));
  }

  return Number((listing.price * inclusiveDays).toFixed(2));
}

export async function createBooking(req, res, next) {
  try {
    const data = createBookingSchema.parse(req.body);
    const startDate = parseUtcDateOnly(data.startDate);
    const endDate = parseUtcDateOnly(data.endDate);

    if (startDate < getTodayUtc()) {
      throw new AppError('Booking start date cannot be in the past', 400);
    }

    const booking = await prisma.$transaction(async (tx) => {
      const listing = await tx.listing.findUnique({
        where: { id: data.listingId },
      });

      if (!listing || listing.status !== 'approved') {
        throw new AppError(
          'Listing not found or not available for booking',
          404
        );
      }

      if (listing.providerId === req.user.id) {
        throw new AppError('You cannot book your own listing', 400);
      }

      const totalPrice = computeServerTotalPrice(
        listing,
        startDate,
        endDate,
        data.guests
      );

      // Overlap check against active (pending/confirmed) bookings
      const overlapWhere =
        listing.priceUnit === 'per_night'
          ? {
              listingId: listing.id,
              status: { in: ['pending', 'confirmed'] },
              startDate: { lt: endDate },
              endDate: { gt: startDate },
            }
          : {
              listingId: listing.id,
              status: { in: ['pending', 'confirmed'] },
              startDate: { lte: endDate },
              endDate: { gte: startDate },
            };

      const conflicting = await tx.booking.findFirst({ where: overlapWhere });
      if (conflicting) {
        throw new AppError(
          'Selected dates overlap with an existing booking. Please choose different dates.',
          409
        );
      }

      return tx.booking.create({
        data: {
          listingId: listing.id,
          touristId: req.user.id,
          startDate,
          endDate,
          guests: data.guests,
          totalPrice,
          status: 'pending',
        },
        include: {
          listing: {
            include: {
              provider: { select: safeUserSelect },
            },
          },
          tourist: { select: safeUserSelect },
        },
      });
    });

    return res.status(201).json({
      success: true,
      message: 'Booking created and sent to the provider for confirmation',
      data: {
        booking: {
          ...booking,
          listing: serializeListing(booking.listing),
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function getMyBookings(req, res, next) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { touristId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        listing: {
          include: {
            provider: { select: safeUserSelect },
          },
        },
        review: true,
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

export async function getBookingById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new AppError('Invalid booking ID', 400);
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        listing: {
          include: {
            provider: { select: safeUserSelect },
          },
        },
        tourist: { select: safeUserSelect },
        review: true,
      },
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    const isAllowed =
      req.user.role === 'admin' ||
      booking.touristId === req.user.id ||
      booking.listing.providerId === req.user.id;

    if (!isAllowed) {
      throw new AppError('You do not have access to this booking', 403);
    }

    return res.status(200).json({
      success: true,
      data: {
        booking: {
          ...booking,
          listing: serializeListing(booking.listing),
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}

const VALID_PROVIDER_TRANSITIONS = {
  pending: ['confirmed', 'rejected'],
  confirmed: ['completed'],
};

export async function updateBookingStatus(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new AppError('Invalid booking ID', 400);
    }

    const { status } = bookingStatusSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { listing: true },
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (
      req.user.role !== 'admin' &&
      booking.listing.providerId !== req.user.id
    ) {
      throw new AppError(
        'Only the listing provider or admin can update booking status',
        403
      );
    }

    const allowedNext = VALID_PROVIDER_TRANSITIONS[booking.status] || [];
    if (!allowedNext.includes(status)) {
      throw new AppError(
        `Cannot transition booking from "${booking.status}" to "${status}"`,
        400
      );
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        listing: {
          include: { provider: { select: safeUserSelect } },
        },
        tourist: { select: safeUserSelect },
      },
    });

    return res.status(200).json({
      success: true,
      message: `Booking marked as ${status}`,
      data: {
        booking: {
          ...updated,
          listing: serializeListing(updated.listing),
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function cancelBooking(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new AppError('Invalid booking ID', 400);
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (req.user.role !== 'admin' && booking.touristId !== req.user.id) {
      throw new AppError('You can only cancel your own bookings', 403);
    }

    if (!['pending', 'confirmed'].includes(booking.status)) {
      throw new AppError(
        `Cannot cancel a booking that is already "${booking.status}"`,
        400
      );
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: 'cancelled' },
      include: {
        listing: {
          include: { provider: { select: safeUserSelect } },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        booking: {
          ...updated,
          listing: serializeListing(updated.listing),
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}
