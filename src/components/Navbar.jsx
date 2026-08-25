import React from 'react';
import { Menu, Sun, Moon, Radio, Receipt, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import { Link } from 'react-router-dom';

export const Navbar = ({ setMobileOpen }) => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { connected } = useSocket();

  return (
    <header className="h-16 bg-white dark:bg-charcoal-900 border-b border-gray-200 dark:border-charcoal-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors shadow-sm">
      {/* Left: Mobile Toggle & Welcome */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-charcoal-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Welcome, <span className="text-gold-600 dark:text-gold-400">{user?.fullName || 'User'}</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Real-time Socket Indicator */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            connected
              ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30'
              : 'bg-red-500/10 text-red-500 border-red-500/30'
          }`}
          title={connected ? 'Live real-time sync active' : 'Disconnected from live updates'}
        >
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="hidden md:inline">{connected ? 'Live Sync' : 'Offline'}</span>
        </div>

        {/* Quick New Bill Button */}
        <Link
          to="/billing"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black text-white dark:bg-gold-500 dark:text-black hover:bg-charcoal-800 dark:hover:bg-gold-400 font-semibold text-xs transition-all shadow-sm"
        >
          <Receipt className="w-4 h-4" />
          <span className="hidden sm:inline">New Bill (POS)</span>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-gray-200 dark:border-charcoal-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-charcoal-800 transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-gold-400" /> : <Moon className="w-4 h-4 text-charcoal-700" />}
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-charcoal-800">
          <div className="w-8 h-8 rounded-full bg-charcoal-800 text-gold-400 flex items-center justify-center font-bold text-xs border border-gold-500/40">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="hidden xl:block text-left">
            <span className="block text-xs font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[120px]">
              {user?.fullName}
            </span>
            <span className="block text-[10px] text-gray-500 dark:text-gray-400 capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
