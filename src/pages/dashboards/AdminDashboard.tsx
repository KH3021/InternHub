import React from 'react';
import { ShieldAlert, Users, Briefcase, Building } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-rose-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <h2 className="text-2xl font-black">Superadmin System Portal 🛡️</h2>
        <p className="text-xs sm:text-sm text-rose-100 mt-1">
          Global system overview, user role management, job posting audits, and platform metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Total Registered Users</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">54,320</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Total Companies</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">2,150</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Pending Job Audits</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">14</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">System Health</div>
          <div className="text-2xl font-black text-emerald-500 mt-1">99.99%</div>
        </div>
      </div>
    </div>
  );
}
