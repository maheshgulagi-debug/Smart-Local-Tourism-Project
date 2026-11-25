export const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  createdAt: true,
};

function safeJsonParse(raw, fallback = []) {
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function serializeListing(listing) {
  if (!listing) return null;
  return {
    ...listing,
    images: safeJsonParse(listing.images, []),
    amenities: safeJsonParse(listing.amenities, []),
  };
}
