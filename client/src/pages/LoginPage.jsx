import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../services/api';

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login({ email: email.trim(), password });
      showToast(`Welcome back, ${user.name}!`, 'success');
      if (user.role === 'admin' && redirectTo === '/') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'provider' && redirectTo === '/') {
        navigate('/provider', { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Invalid credentials.');
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
          <LogIn className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Welcome Back
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-stone-900">
          Sign in to your account
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Book local stays, manage listings, or track your reservations.
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
            <label htmlFor="login-email" className="block text-sm font-medium text-stone-700">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 transition"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 rounded-xl bg-stone-50 p-3.5 text-xs text-stone-600 space-y-1">
          <p className="font-semibold text-stone-800">Demo Accounts:</p>
          <p>Tourist: aarav@traveler.in / Tourist@123</p>
          <p>Provider: kaveri@malnadstays.in / Provider@123</p>
          <p>Admin: admin@karnatakatourism.in / Admin@123</p>
        </div>

        <p className="mt-5 text-center text-sm text-stone-600">
          New here?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
