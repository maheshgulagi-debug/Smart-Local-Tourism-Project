import { prisma } from '../utils/prisma.js';
import { AppError } from '../utils/errors.js';
import {
  adminApprovalSchema,
  adminUserRoleSchema,
} from '../utils/validation.js';
import {
  safeUserSelect,
  serializeListing,
} from '../utils/listingSerializer.js';

export async function getAllUsers(_req, res, next) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        ...safeUserSelect,
        _count: {
          select: { listings: true, bookings: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: { users },
    });
  } catch (err) {
    return next(err);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new AppError('Invalid user ID', 400);
    }

    if (req.user.id === id) {
      throw new AppError('You cannot change your own admin role', 400);
    }

    const { role } = adminUserRoleSchema.parse(req.body);
    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: safeUserSelect,
    });

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: { user: updated },
    });
  } catch (err) {
    return next(err);
  }
}

export async function getAdminListings(req, res, next) {
  try {
    const { status } = req.query;
    const where = {};
    if (status && ['pending', 'approved', 'rejected'].includes(String(status))) {
      where.status = String(status);
    }

    const listings = await prisma.listing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        provider: { select: safeUserSelect },
        _count: { select: { bookings: true, reviews: true } },
      },
    });

    return res.status(200).json({
      success: true,
      data: { listings: listings.map(serializeListing) },
    });
  } catch (err) {
    return next(err);
  }
}

export async function approveOrRejectListing(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new AppError('Invalid listing ID', 400);
    }

    const { status } = adminApprovalSchema.parse(req.body || {});

    const updated = await prisma.listing.update({
      where: { id },
      data: { status },
      include: {
        provider: { select: safeUserSelect },
      },
    });

    return res.status(200).json({
      success: true,
      message: `Listing ${status}`,
      data: { listing: serializeListing(updated) },
    });
  } catch (err) {
    return next(err);
  }
}

export async function getAdminBookings(_req, res, next) {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        listing: {
          include: { provider: { select: safeUserSelect } },
        },
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

export async function getAdminStats(_req, res, next) {
  try {
    const [
      totalUsers,
      totalListings,
      pendingListings,
      approvedListings,
      totalBookings,
      confirmedOrCompletedRevenue,
      totalReviews,
      totalMessages,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: 'pending' } }),
      prisma.listing.count({ where: { status: 'approved' } }),
      prisma.booking.count(),
      prisma.booking.aggregate({
        where: { status: { in: ['confirmed', 'completed'] } },
        _sum: { totalPrice: true },
      }),
      prisma.review.count(),
      prisma.contactMessage.count(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalListings,
          pendingListings,
          approvedListings,
          totalBookings,
          totalRevenue: Number(
            (confirmedOrCompletedRevenue._sum.totalPrice || 0).toFixed(2)
          ),
          totalReviews,
          totalMessages,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}
