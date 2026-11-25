import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { PRICE_UNIT_LABELS, formatCurrency } from '../config/regionConfig';

export default function ListingCard({ listing }) {
  const coverImage = listing.images?.[0] || '/images/hampi-heritage.jpg';
  const unitLabel = PRICE_UNIT_LABELS[listing.priceUnit] || 'unit';
  const reviewCount = listing._count?.reviews ?? listing.reviews?.length ?? 0;

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-200">
        <img
          src={coverImage}
          alt={listing.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/images/hampi-heritage.jpg';
          }}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-stone-800 shadow-sm">
          {listing.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
          <span className="inline-flex items-center gap-1 font-medium text-stone-600">
            <MapPin className="h-3.5 w-3.5 text-brand-600" />
            {listing.location}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-stone-800">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {listing.avgRating > 0 ? listing.avgRating.toFixed(1) : 'New'}
            {reviewCount > 0 && (
              <span className="font-normal text-stone-500">({reviewCount})</span>
            )}
          </span>
        </div>

        <h3 className="mt-2 line-clamp-1 text-base font-bold text-stone-900 group-hover:text-brand-600 transition">
          {listing.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-stone-600 flex-1">
          {listing.description}
        </p>

        <div className="mt-4 flex items-baseline justify-between border-t border-stone-100 pt-3">
          <div>
            <span className="text-base font-bold text-stone-900">
              {formatCurrency(listing.price)}
            </span>
            <span className="text-xs text-stone-500"> / {unitLabel}</span>
          </div>
          {listing.provider?.name && (
            <span className="text-xs text-stone-500 truncate max-w-[130px]">
              by {listing.provider.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
