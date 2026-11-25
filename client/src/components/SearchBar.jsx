import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Tag, Calendar } from 'lucide-react';
import { REGION_CONFIG } from '../config/regionConfig';

export default function SearchBar({ initialValues = {}, onSearch, compact = false }) {
  const navigate = useNavigate();
  const [location, setLocation] = useState(initialValues.location || '');
  const [category, setCategory] = useState(initialValues.category || '');
  const [q, setQ] = useState(initialValues.q || '');
  const [date, setDate] = useState(initialValues.date || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ q, location, category, date });
      return;
    }
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (location) params.set('location', location);
    if (category) params.set('category', category);
    if (date) params.set('date', date);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid grid-cols-1 gap-3 rounded-2xl bg-white p-3 shadow-lg border border-stone-200 ${
        compact ? 'md:grid-cols-4' : 'md:grid-cols-12'
      }`}
    >
      <div className={compact ? '' : 'md:col-span-3'}>
        <label htmlFor="search-location" className="sr-only">
          Location
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5">
          <MapPin className="h-4 w-4 text-brand-600 shrink-0" />
          <select
            id="search-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-stone-800 focus:outline-none"
          >
            <option value="">All Destinations</option>
            {REGION_CONFIG.destinations.map((dest) => (
              <option key={dest.name} value={dest.name}>
                {dest.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={compact ? '' : 'md:col-span-3'}>
        <label htmlFor="search-category" className="sr-only">
          Category
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5">
          <Tag className="h-4 w-4 text-brand-600 shrink-0" />
          <select
            id="search-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-stone-800 focus:outline-none"
          >
            <option value="">All Categories</option>
            {REGION_CONFIG.categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={compact ? '' : 'md:col-span-2'}>
        <label htmlFor="search-date" className="sr-only">
          Preferred Date
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5">
          <Calendar className="h-4 w-4 text-brand-600 shrink-0" />
          <input
            id="search-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-stone-800 focus:outline-none"
          />
        </div>
      </div>

      <div className={`${compact ? 'flex gap-2' : 'md:col-span-4 flex gap-2'}`}>
        <label htmlFor="search-keyword" className="sr-only">
          Keyword search
        </label>
        <input
          id="search-keyword"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Coffee, temple walk, khadi..."
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition shrink-0"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}
