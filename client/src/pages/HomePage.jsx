import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Quote, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { api } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { REGION_CONFIG } from '../config/regionConfig';
import SearchBar from '../components/SearchBar';
import ListingCard from '../components/ListingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';

export default function HomePage() {
  const fetchFeatured = useCallback(async () => {
    const res = await api.get('/listings?sort=rating_desc&limit=6');
    return res.data.data.listings;
  }, []);

  const { data: featured, loading, error, execute } = useAsync(fetchFeatured, true);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: "url('/images/hampi-heritage.jpg')" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600/90 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              <Sparkles className="h-3.5 w-3.5" />
              {REGION_CONFIG.heroEyebrow}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
              {REGION_CONFIG.heroTitle}
            </h1>
            <p className="mt-4 text-base text-stone-200 sm:text-lg leading-relaxed">
              {REGION_CONFIG.heroSubtitle}
            </p>
          </div>

          <div className="mt-8">
            <SearchBar />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-stone-200">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-500" />
              Admin-Verified Local Providers
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-500" />
              100% Direct Community Revenue
            </span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">
              Explore by Category
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Handpicked stays, guides, artisan workshops, and immersive trails
            </p>
          </div>
          <Link
            to="/listings"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            View all listings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REGION_CONFIG.categories.map((cat) => (
            <Link
              key={cat.value}
              to={`/listings?category=${encodeURIComponent(cat.value)}`}
              className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-[16/10] overflow-hidden bg-stone-200">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-stone-900 group-hover:text-brand-600 transition">
                  {cat.label}
                </h3>
                <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-stone-100/80 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">
                Featured Local Experiences
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                Top-rated hosts and cultural experiences across {REGION_CONFIG.regionName}
              </p>
            </div>
            <Link
              to="/listings"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Browse all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6">
            {loading && <LoadingSpinner label="Loading featured listings..." />}
            <ErrorBanner message={error} onRetry={execute} />
            {!loading && !error && featured && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-stone-900">
          Popular Destinations in {REGION_CONFIG.regionName}
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Four distinct cultural landscapes ready to explore
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REGION_CONFIG.destinations.map((dest) => (
            <Link
              key={dest.name}
              to={`/listings?location=${encodeURIComponent(dest.name)}`}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-stone-900 p-5 text-white shadow-sm"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/30 to-transparent" />
              <div className="relative">
                <h3 className="text-xl font-bold">{dest.name}</h3>
                <p className="mt-1 text-xs text-stone-200">{dest.subtitle}</p>
                <p className="mt-2 text-[11px] font-medium text-brand-200">
                  {dest.highlights}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-stone-200 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-900">
              Stories From Fellow Travelers
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Verified reviews from guests who booked directly with local hosts
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {REGION_CONFIG.testimonials.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-6 flex flex-col justify-between"
              >
                <div>
                  <Quote className="h-6 w-6 text-brand-500" />
                  <p className="mt-3 text-sm text-stone-700 leading-relaxed">
                    “{item.quote}”
                  </p>
                </div>
                <div className="mt-5 border-t border-stone-200 pt-3 flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900">
                    {item.name} · {item.origin}
                  </span>
                  <span className="font-medium text-brand-700">{item.trip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
