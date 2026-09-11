import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', form);
      login(res.data.data);
      toast.success(`Welcome back, ${res.data.data.name}!`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed.';
      setError(msg);
      toast.error(msg);
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

      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">

        {/* 🔴 Backend Disclaimer */}
        <div className="mb-4 p-3 rounded-xl border border-amber-300 bg-amber-100 text-amber-900 text-sm text-center">
          ⚠️ Backend is on free hosting, so it may be slow or temporarily unavailable.

          <div className="mt-2 flex justify-center gap-2 flex-wrap">
            <a
              href="https://github.com/AmaanAhmad221/taskmind-frontend"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold hover:text-amber-700"
            >
              Frontend Code
            </a>

            <span>|</span>

            <a
              href="https://github.com/AmaanAhmad221/taskmind-backend"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold hover:text-amber-700"
            >
              Backend Code
            </a>
          </div>
        </div>

        {/* Logo + Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14
                          bg-indigo-600 rounded-2xl shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
            Sign in to your TaskMind account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl
                        border border-gray-200 dark:border-gray-700 p-8">

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Username or Email"
              value={form.identifier}
              onChange={(e) =>
                setForm({ ...form, identifier: e.target.value })}
              className={inputClass}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })}
              className={inputClass}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700
                         text-white rounded-xl font-semibold"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;