import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Briefcase, Sun, Moon, ArrowLeft } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function AuthLayout() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 transition-colors duration-300 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-96 w-96 rounded-full bg-primary-400/15 blur-3xl dark:bg-primary-600/10"></div>

      {/* Top Header */}
      <header className="flex justify-between items-center max-w-6xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold text-sm transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-primary-600 to-indigo-600 text-white p-1.5 rounded-lg flex items-center justify-center shadow-md">
            <Briefcase className="h-4 w-4" />
          </div>
          <span className="text-lg font-black bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
            InternHub
          </span>
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
        </button>
      </header>

      {/* Auth Content */}
      <main className="my-auto py-8">
        <Outlet />
      </main>

      {/* Footer copyright */}
      <footer className="text-center text-xs text-slate-400 py-2">
        &copy; {new Date().getFullYear()} InternHub Inc. All rights reserved.
      </footer>
    </div>
  );
}
