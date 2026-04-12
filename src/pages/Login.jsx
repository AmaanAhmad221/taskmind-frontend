import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]       = useState({ identifier: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', form);
      login(res.data.data);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    w-full px-4 py-3 text-sm rounded-xl border
    border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-700/50
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-indigo-500
    focus:border-transparent transition-colors
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50
                    to-indigo-50 dark:from-gray-950 dark:via-gray-900
                    dark:to-gray-900 flex items-center justify-center p-4">

      {/* Theme toggle — top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">

        {/* Logo + heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14
                          bg-indigo-600 rounded-2xl shadow-lg
                          shadow-indigo-200 dark:shadow-none mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white
                         tracking-tight">
            Welcome back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
            Sign in to your TaskMind account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl
                        shadow-gray-200/50 dark:shadow-none
                        border border-gray-200 dark:border-gray-700 p-8">

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-900/20
                            border border-red-200 dark:border-red-800
                            rounded-xl flex items-start gap-2.5">
              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                   fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707
                     7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293
                     1.293a1 1 0 101.414 1.414L10 11.414l1.293
                     1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1
                     1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700
                                 dark:text-gray-300 mb-1.5">
                Username or Email
              </label>
              <input
                type="text"
                required
                placeholder="Enter your username or email"
                value={form.identifier}
                onChange={(e) =>
                  setForm({ ...form, identifier: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700
                                 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 mt-2 bg-indigo-600
                         hover:bg-indigo-700 text-white font-semibold
                         text-sm rounded-xl transition-colors
                         disabled:opacity-60 flex items-center
                         justify-center gap-2 shadow-md
                         shadow-indigo-200 dark:shadow-none"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white
                                border-t-transparent rounded-full
                                animate-spin" />
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500
                        dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register"
              className="text-indigo-600 dark:text-indigo-400
                         font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;