import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { REGION_CONFIG } from '../config/regionConfig';

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <Compass className="h-6 w-6 text-brand-500" />
              <span className="text-lg font-bold">{REGION_CONFIG.brandName}</span>
            </div>
            <p className="mt-3 text-sm text-stone-400 leading-relaxed">
              Connecting travelers directly with verified local homestays, heritage guides, and cultural artisans across {REGION_CONFIG.regionName}.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Destinations
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {REGION_CONFIG.destinations.map((dest) => (
                <li key={dest.name}>
                  <Link
                    to={`/listings?location=${encodeURIComponent(dest.name)}`}
                    className="hover:text-white transition"
                  >
                    {dest.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Categories
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {REGION_CONFIG.categories.map((cat) => (
                <li key={cat.value}>
                  <Link
                    to={`/listings?category=${encodeURIComponent(cat.value)}`}
                    className="hover:text-white transition"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Portal
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/culture" className="hover:text-white transition">
                  Local Culture & Events
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact & Partner
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">
                  List Your Business
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} {REGION_CONFIG.portalTitle}. All rights reserved.</p>
          <p>Empowering community-led tourism in {REGION_CONFIG.regionName}</p>
        </div>
      </div>
    </footer>
  );
}
