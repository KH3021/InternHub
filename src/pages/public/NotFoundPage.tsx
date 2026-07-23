import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="py-20 max-w-md mx-auto text-center space-y-6 px-4">
      <div className="h-20 w-20 rounded-3xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto">
        <Compass className="h-10 w-10 animate-spin" style={{ animationDuration: '10s' }} />
      </div>

      <div className="space-y-2">
        <span className="text-6xl font-black bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">404</span>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Page Not Found</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The page you are looking for might have been removed, renamed, or is temporarily unavailable.
        </p>
      </div>

      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow-lg shadow-primary-600/20 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
