import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout }    = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900
                    border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <Link to="/dashboard"
            className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg
                            flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs sm:text-sm">T</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900
                             dark:text-white tracking-tight">
              TaskMind
            </span>
          </Link>

          {/* Desktop right side */}
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />
            {user && (
              <>
                <div className="flex items-center gap-2.5 px-3 py-1.5
                                bg-gray-50 dark:bg-gray-800 rounded-xl
                                border border-gray-200 dark:border-gray-700">
                  <div className="w-7 h-7 bg-indigo-100 dark:bg-indigo-900/50
                                  rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 dark:text-indigo-400
                                     font-bold text-xs">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="leading-none">
                    <p className="text-sm font-semibold text-gray-900
                                  dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400
                                  mt-0.5">
                      @{user.username}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm
                             font-medium text-red-600 dark:text-red-400
                             hover:bg-red-50 dark:hover:bg-red-900/20
                             rounded-lg transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor"
                       viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0
                         01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3
                         3 0 013 3v1" />
                  </svg>
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex sm:hidden items-center gap-1.5">
            <ThemeToggle />

            {user && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50
                           rounded-full flex items-center justify-center"
              >
                <span className="text-indigo-600 dark:text-indigo-400
                                 font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && user && (
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-700
                        bg-white dark:bg-gray-900 px-4 py-3 space-y-3">
          {/* User info */}
          <div className="flex items-center gap-3 pb-3 border-b
                          border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50
                            rounded-full flex items-center justify-center">
              <span className="text-indigo-600 dark:text-indigo-400
                               font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white
                            text-sm">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                @{user.username}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {user.email}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-2 px-3 py-2.5
                       text-sm font-medium text-red-600 dark:text-red-400
                       hover:bg-red-50 dark:hover:bg-red-900/20
                       rounded-xl transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3
                   3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;