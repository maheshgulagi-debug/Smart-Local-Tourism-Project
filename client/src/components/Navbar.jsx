import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, Menu, X, LogOut, User, LayoutDashboard, CalendarCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { REGION_CONFIG } from '../config/regionConfig';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully', 'info');
    setMobileOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? 'text-brand-600' : 'text-stone-700 hover:text-brand-600'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Compass className="h-5 w-5" />
          </span>
          <div>
            <span className="block text-base font-bold leading-none">
              {REGION_CONFIG.brandName}
            </span>
            <span className="block text-[11px] font-medium text-stone-500">
              {REGION_CONFIG.regionName}
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/listings" className={navLinkClass}>
            Explore
          </NavLink>
          <NavLink to="/culture" className={navLinkClass}>
            Culture & Events
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/my-bookings"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 transition"
              >
                <CalendarCheck className="h-4 w-4 text-brand-600" />
                My Bookings
              </Link>
              {(user.role === 'provider' || user.role === 'admin') && (
                <Link
                  to="/provider"
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 transition"
                >
                  <LayoutDashboard className="h-4 w-4 text-forest-600" />
                  Provider Hub
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800 transition"
                >
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-2 border-l border-stone-200 pl-3">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-700">
                  <User className="h-4 w-4 text-stone-500" />
                  {user.name.split(' ')[0]}
                  <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] uppercase tracking-wide text-stone-600">
                    {user.role}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3.5 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
              >
                Join Portal
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          className="md:hidden rounded-lg p-2 text-stone-700 hover:bg-stone-100"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2">
            <NavLink to="/" end onClick={() => setMobileOpen(false)} className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/listings" onClick={() => setMobileOpen(false)} className={navLinkClass}>
              Explore Listings
            </NavLink>
            <NavLink to="/culture" onClick={() => setMobileOpen(false)} className={navLinkClass}>
              Culture & Events
            </NavLink>
            <NavLink to="/about" onClick={() => setMobileOpen(false)} className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" onClick={() => setMobileOpen(false)} className={navLinkClass}>
              Contact
            </NavLink>
          </div>
          <div className="border-t border-stone-200 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-stone-100 px-3 py-2 text-sm font-medium text-stone-800"
                >
                  My Bookings
                </Link>
                {(user.role === 'provider' || user.role === 'admin') && (
                  <Link
                    to="/provider"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg bg-forest-50 px-3 py-2 text-sm font-medium text-forest-800"
                  >
                    Provider Hub
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg bg-stone-900 px-3 py-2 text-sm font-medium text-white"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-stone-300 px-3 py-2 text-left text-sm font-medium text-red-700"
                >
                  Sign Out ({user.name})
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-center text-sm font-semibold text-stone-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  Join Portal
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
