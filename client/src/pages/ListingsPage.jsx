import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { api, getErrorMessage } from '../services/api';
import { REGION_CONFIG } from '../config/regionConfig';
import ListingCard from '../components/ListingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (location) params.set('location', location);
      if (category) params.set('category', category);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (minRating) params.set('minRating', minRating);
      if (sort) params.set('sort', sort);
      params.set('page', String(page));
      params.set('limit', '9');

      const res = await api.get(`/listings?${params.toString()}`);
      setListings(res.data.data.listings);
      setPagination(res.data.data.pagination);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load listings.'));
    } finally {
      setLoading(false);
    }
  }, [q, location, category, minPrice, maxPrice, minRating, sort, page]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const applyFilterResetPage = (updater) => {
    updater();
    setPage(1);
  };

  const handleReset = () => {
    setQ('');
    setLocation('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">
            Explore Local Tourism
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Showing {pagination.total} verified listings across {REGION_CONFIG.regionName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="sort-select" className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Sort by
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => applyFilterResetPage(() => setSort(e.target.value))}
            className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-800 focus:border-brand-500 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="rating_desc">Highest Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-stone-900">
                <SlidersHorizontal className="h-4 w-4 text-brand-600" />
                Filters
              </h2>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>

            <div>
              <label htmlFor="filter-q" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Keyword
              </label>
              <input
                id="filter-q"
                type="text"
                value={q}
                onChange={(e) => applyFilterResetPage(() => setQ(e.target.value))}
                placeholder="Search title, craft, trail..."
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="filter-location" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Destination
              </label>
              <select
                id="filter-location"
                value={location}
                onChange={(e) => applyFilterResetPage(() => setLocation(e.target.value))}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              >
                <option value="">All Destinations</option>
                {REGION_CONFIG.destinations.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-category" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Category
              </label>
              <select
                id="filter-category"
                value={category}
                onChange={(e) => applyFilterResetPage(() => setCategory(e.target.value))}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                {REGION_CONFIG.categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-xs font-semibold text-stone-700 mb-1.5">
                Price Range (INR)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min ₹"
                  aria-label="Minimum price"
                  value={minPrice}
                  onChange={(e) => applyFilterResetPage(() => setMinPrice(e.target.value))}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Max ₹"
                  aria-label="Maximum price"
                  value={maxPrice}
                  onChange={(e) => applyFilterResetPage(() => setMaxPrice(e.target.value))}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="filter-rating" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Minimum Rating
              </label>
              <select
                id="filter-rating"
                value={minRating}
                onChange={(e) => applyFilterResetPage(() => setMinRating(e.target.value))}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5★ & above</option>
                <option value="4">4.0★ & above</option>
                <option value="3">3.0★ & above</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="lg:col-span-3">
          {loading && <LoadingSpinner label="Fetching local listings..." />}
          <ErrorBanner message={error} onRetry={fetchListings} />

          {!loading && !error && listings.length === 0 && (
            <EmptyState
              title="No matching listings"
              description="Try clearing a filter or searching another Karnataka destination."
              action={
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
                >
                  Clear All Filters
                </button>
              }
            />
          )}

          {!loading && !error && listings.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {listings.map((item) => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-medium text-stone-600">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() =>
                      setPage((p) => Math.min(pagination.totalPages, p + 1))
                    }
                    className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
