import { z } from 'zod';

export const LISTING_CATEGORIES = [
  'Homestay',
  'Guide',
  'Cultural Business',
  'Experience',
];

export const PRICE_UNITS = ['per_night', 'per_day', 'per_person', 'per_session'];

const imageUrlSchema = z
  .string()
  .trim()
  .min(1, 'Image URL cannot be empty')
  .refine(
    (val) => /^(\/images\/[\w.-]+|https?:\/\/.+)$/i.test(val),
    'Image must be a valid http(s) URL or local /images/ path'
  );

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().trim().email('Please provide a valid email address').toLowerCase(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100),
  role: z.enum(['tourist', 'provider']).optional().default('tourist'),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal(''))
    .transform((val) => (val ? val : null)),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Please provide a valid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const listingCreateSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(120),
  description: z
    .string()
    .trim()
    .min(15, 'Description must be at least 15 characters')
    .max(3000),
  category: z.enum(['Homestay', 'Guide', 'Cultural Business', 'Experience']),
  location: z.string().trim().min(2, 'Location is required').max(80),
  price: z.coerce.number().positive('Price must be greater than 0').max(1000000),
  priceUnit: z.enum(['per_night', 'per_day', 'per_person', 'per_session']),
  images: z
    .array(imageUrlSchema)
    .min(1, 'At least one image URL is required')
    .max(8, 'Maximum 8 images allowed'),
  amenities: z
    .array(z.string().trim().min(1).max(60))
    .max(20, 'Maximum 20 amenities/languages allowed')
    .optional()
    .default([]),
});

export const listingUpdateSchema = listingCreateSchema.partial();
