import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarX,
  Check,
  MapPin,
  Phone,
  Star,
  UserCheck,
} from 'lucide-react';
import { api, getErrorMessage } from '../services/api';
import {
  PRICE_UNIT_LABELS,
  formatCurrency,
  formatDateDisplay,
} from '../config/regionConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import StarRating from '../components/StarRating';
import EmptyState from '../components/EmptyState';

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadListing = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/listings/${id}`);
      setListing(res.data.data.listing);
      setActiveImage(0);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load listing details.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadListing();
  }, [loadListing]);

  if (loading) return <LoadingSpinner label="Loading listing details..." />;

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <ErrorBanner message={error} onRetry={loadListing} />
        <Link
          to="/listings"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>
      </div>
    );
  }

  if (!listing) return null;

  const images = listing.images?.length
    ? listing.images
    : ['/images/hampi-heritage.jpg'];
  const unitLabel = PRICE_UNIT_LABELS[listing.priceUnit] || 'unit';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/listings"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </Link>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            {listing.category}
          </span>
          <h1 className="mt-2 text-2xl font-bold text-stone-900 sm:text-3xl">
            {listing.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-stone-600">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4 text-brand-600" />
              {listing.location}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-stone-800">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {listing.avgRating > 0 ? listing.avgRating.toFixed(1) : 'New'}
              <span className="font-normal text-stone-500">
                ({listing.reviews?.length || 0} reviews)
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-stone-200 bg-stone-200">
              <img
                src={images[activeImage]}
                alt={`${listing.title} view ${activeImage + 1}`}
                onError={(e) => {
                  e.currentTarget.src = '/images/hampi-heritage.jpg';
                }}
                className="h-full w-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      idx === activeImage
                        ? 'border-brand-600'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      onError={(e) => {
                        e.currentTarget.src = '/images/hampi-heritage.jpg';
                      }}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-bold text-stone-900">
              About This {listing.category}
            </h2>
            <p className="mt-3 text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>

            {listing.amenities?.length > 0 && (
              <div className="mt-6 border-t border-stone-100 pt-5">
                <h3 className="text-sm font-bold text-stone-900">
                  Amenities & Languages
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {listing.amenities.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-800"
                    >
                      <Check className="h-3.5 w-3.5 text-forest-600" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Provider Info */}
          {listing.provider && (
            <section className="rounded-2xl border border-stone-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 text-forest-700">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Hosted by Local Provider
                  </p>
                  <p className="text-base font-bold text-stone-900">
                    {listing.provider.name}
                  </p>
                  {listing.provider.phone && (
                    <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-stone-600">
                      <Phone className="h-3.5 w-3.5" />
                      {listing.provider.phone}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Booked / Unavailable Dates */}
          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="inline-flex items-center gap-2 text-lg font-bold text-stone-900">
              <CalendarX className="h-5 w-5 text-brand-600" />
              Current Availability & Booked Dates
            </h2>
            {listing.bookedDates?.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {listing.bookedDates.map((b) => (
                  <span
                    key={b.id}
                    className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900"
                  >
                    Reserved: {formatDateDisplay(b.startDate)} →{' '}
                    {formatDateDisplay(b.endDate)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-forest-700 font-medium">
                All upcoming dates are currently open for booking.
              </p>
            )}
          </section>

          {/* Reviews */}
          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-bold text-stone-900">
              Guest Reviews ({listing.reviews?.length || 0})
            </h2>
            {listing.reviews?.length > 0 ? (
              <div className="mt-4 space-y-4">
                {listing.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-stone-100 bg-stone-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-stone-900">
                        {rev.tourist?.name || 'Verified Traveler'}
                      </span>
                      <span className="text-xs text-stone-500">
                        {formatDateDisplay(rev.createdAt)}
                      </span>
                    </div>
                    <div className="mt-1">
                      <StarRating rating={rev.rating} />
                    </div>
                    <p className="mt-2 text-sm text-stone-700">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState
                  title="No reviews yet"
                  description="Be the first traveler to complete a booking and share your experience."
                />
              </div>
            )}
          </section>
        </div>

        {/* Booking Sidebar (full form connected in Phase 6) */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-baseline justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-2xl font-bold text-stone-900">
                  {formatCurrency(listing.price)}
                </span>
                <span className="text-sm text-stone-500"> / {unitLabel}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {listing.avgRating > 0 ? listing.avgRating.toFixed(1) : 'New'}
              </span>
            </div>
            <p className="mt-4 text-sm text-stone-600">
              Instant server-verified availability and transparent pricing.
            </p>
            <Link
              to="/login"
              className="mt-5 block w-full rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-700 transition"
            >
              Sign In to Reserve
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
