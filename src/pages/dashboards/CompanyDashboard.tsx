import React from 'react';
import { Building, Users, Briefcase, CheckCircle2 } from 'lucide-react';

export default function CompanyDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <h2 className="text-2xl font-black">TechCorp Organization Portal 👋</h2>
        <p className="text-xs sm:text-sm text-emerald-100 mt-1">
          Manage company information, brand profile, recruiter team members, and billing plans.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Active Company Jobs</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">18</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Recruiter Team Seats</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">5 / 10</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Verification Status</div>
          <div className="text-2xl font-black text-emerald-500 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="h-6 w-6" />
            <span className="text-base font-bold text-slate-900 dark:text-white">Verified Enterprise</span>
          </div>
        </div>
      </div>
    </div>
  );
}
