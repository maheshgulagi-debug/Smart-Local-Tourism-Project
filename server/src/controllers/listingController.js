import { prisma } from '../utils/prisma.js';
import { AppError } from '../utils/errors.js';
import {
  listingCreateSchema,
  listingUpdateSchema,
} from '../utils/validation.js';
import {
  safeUserSelect,
  serializeListing,
} from '../utils/listingSerializer.js';

const SORT_MAP = {
  newest: { createdAt: 'desc' },
  price_asc: { price: 'asc' },
  price_desc: { price: 'desc' },
  rating_desc: { avgRating: 'desc' },
};

export async function getListings(req, res, next) {
  try {
    const {
      q,
      location,
      category,
      minPrice,
      maxPrice,
      minRating,
      sort = 'newest',
      page = '1',
      limit = '9',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 9));
    const skip = (pageNum - 1) * limitNum;

    const where = {
      status: 'approved',
    };

    if (q && String(q).trim()) {
      const keyword = String(q).trim();
      where.OR = [
        { title: { contains: keyword } },
        { description: { contains: keyword } },
        { location: { contains: keyword } },
        { category: { contains: keyword } },
      ];
    }

    if (location && String(location).trim() && location !== 'all') {
      where.location = { contains: String(location).trim() };
    }

    if (category && String(category).trim() && category !== 'all') {
      where.category = String(category).trim();
    }

    const parsedMinPrice = minPrice !== undefined && minPrice !== '' ? Number(minPrice) : null;
    const parsedMaxPrice = maxPrice !== undefined && maxPrice !== '' ? Number(maxPrice) : null;
    if (
      (parsedMinPrice !== null && !Number.isNaN(parsedMinPrice)) ||
      (parsedMaxPrice !== null && !Number.isNaN(parsedMaxPrice))
    ) {
      where.price = {};
      if (parsedMinPrice !== null && !Number.isNaN(parsedMinPrice)) {
        where.price.gte = parsedMinPrice;
      }
      if (parsedMaxPrice !== null && !Number.isNaN(parsedMaxPrice)) {
        where.price.lte = parsedMaxPrice;
      }
    }

    const parsedMinRating =
      minRating !== undefined && minRating !== '' ? Number(minRating) : null;
    if (parsedMinRating !== null && !Number.isNaN(parsedMinRating) && parsedMinRating > 0) {
      where.avgRating = { gte: parsedMinRating };
    }

    const orderBy = SORT_MAP[sort] || SORT_MAP.newest;

    const [total, rawListings] = await Promise.all([
      prisma.listing.count({ where }),
      prisma.listing.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          provider: { select: safeUserSelect },
          _count: { select: { reviews: true } },
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        listings: rawListings.map(serializeListing),
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.max(1, Math.ceil(total / limitNum)),
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function getListingById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new AppError('Invalid listing ID', 400);
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        provider: { select: safeUserSelect },
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            tourist: { select: { id: true, name: true } },
          },
        },
        bookings: {
          where: {
            status: { in: ['pending', 'confirmed'] },
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
          },
          orderBy: { startDate: 'asc' },
        },
      },
    });

    if (!listing) {
      throw new AppError('Listing not found', 404);
    }

    const isOwnerOrAdmin =
      req.user &&
      (req.user.role === 'admin' || req.user.id === listing.providerId);

    if (listing.status !== 'approved' && !isOwnerOrAdmin) {
      throw new AppError('Listing not found', 404);
    }

    const { bookings, ...listingRest } = listing;
    return res.status(200).json({
      success: true,
      data: {
        listing: {
          ...serializeListing(listingRest),
          bookedDates: bookings,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function createListing(req, res, next) {
  try {
    const data = listingCreateSchema.parse(req.body);

    const listing = await prisma.listing.create({
      data: {
        providerId: req.user.id,
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        price: data.price,
        priceUnit: data.priceUnit,
        images: JSON.stringify(data.images),
        amenities: JSON.stringify(data.amenities),
        status: req.user.role === 'admin' ? 'approved' : 'pending',
      },
      include: {
        provider: { select: safeUserSelect },
      },
    });

    return res.status(201).json({
      success: true,
      message:
        req.user.role === 'admin'
          ? 'Listing created and published'
          : 'Listing submitted and awaiting admin approval',
      data: { listing: serializeListing(listing) },
    });
  } catch (err) {
    return next(err);
  }
}

export async function updateListing(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new AppError('Invalid listing ID', 400);
    }

    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Listing not found', 404);
    }

    if (req.user.role !== 'admin' && existing.providerId !== req.user.id) {
      throw new AppError('You can only edit your own listings', 403);
    }

    const data = listingUpdateSchema.parse(req.body);
    const updatePayload = {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.priceUnit !== undefined && { priceUnit: data.priceUnit }),
      ...(data.images !== undefined && { images: JSON.stringify(data.images) }),
      ...(data.amenities !== undefined && {
        amenities: JSON.stringify(data.amenities),
      }),
    };

    if (req.user.role !== 'admin' && existing.status === 'rejected') {
      updatePayload.status = 'pending';
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: updatePayload,
      include: {
        provider: { select: safeUserSelect },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      data: { listing: serializeListing(updated) },
    });
  } catch (err) {
    return next(err);
  }
}

export async function deleteListing(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new AppError('Invalid listing ID', 400);
    }

    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Listing not found', 404);
    }

    if (req.user.role !== 'admin' && existing.providerId !== req.user.id) {
      throw new AppError('You can only delete your own listings', 403);
    }

    await prisma.listing.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Listing deleted successfully',
    });
  } catch (err) {
    return next(err);
  }
}
