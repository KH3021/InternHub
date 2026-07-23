import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { jobService } from '../../services/supabaseApi';
import type { Job } from '../../types/portal.types';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);

  useEffect(() => {
    jobService.getFeaturedJobs().then(setActiveJobs);
  }, []);

  return (
    <div className="space-y-6">
      
      <div className="bg-gradient-to-r from-indigo-600 via-primary-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Recruiter Dashboard 👋</h2>
          <p className="text-xs sm:text-sm text-indigo-100">
            Welcome {user?.fullName || 'Recruiter'}. Connected to your Supabase Recruiter Portal.
          </p>
        </div>
        <button className="hidden sm:flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-full font-bold text-xs shadow-md hover:bg-slate-50 transition-all">
          <PlusCircle className="h-4 w-4" />
          <span>Post New Role</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Active Postings</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activeJobs.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Total Applicants</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">128</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Shortlisted Candidates</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">24</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Interviews Scheduled</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">8</div>
        </div>
      </div>

      {/* Active Jobs List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Your Active Postings</h3>
        <div className="space-y-3">
          {activeJobs.map((job) => (
            <div key={job.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">{job.title}</div>
                <div className="text-xs text-slate-500">{job.location} &bull; {job.salary}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-bold">
                  12 Applicants
                </span>
                <button className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:underline">
                  Manage &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
