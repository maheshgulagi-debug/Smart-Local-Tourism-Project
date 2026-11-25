import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../services/api';

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'tourist',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.name.trim().length < 2) {
      setError('Full name must be at least 2 characters.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await register(form);
      showToast(`Account created! Welcome, ${user.name}.`, 'success');
      navigate(user.role === 'provider' ? '/provider' : '/listings', {
        replace: true,
      });
    } catch (err) {
      const msg = getErrorMessage(err, 'Could not complete registration.');
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 text-brand-600">
          <UserPlus className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Join the Portal
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-stone-900">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Register as a traveler or list your local homestay, guide service, or craft studio.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="reg-name" className="block text-sm font-medium text-stone-700">
              Full Name
            </label>
            <input
              id="reg-name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Priya Hegde"
              className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-stone-700">
              Email Address
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="reg-phone" className="block text-sm font-medium text-stone-700">
              Phone Number (optional)
            </label>
            <input
              id="reg-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98450 00000"
              className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="reg-role" className="block text-sm font-medium text-stone-700">
              I am joining as
            </label>
            <select
              id="reg-role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            >
              <option value="tourist">Tourist (Discover & Book)</option>
              <option value="provider">
                Local Provider (Homestay / Guide / Cultural Business)
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              id="reg-password"
              name="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 transition"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-stone-600">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
