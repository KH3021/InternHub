import { useState, useEffect } from 'react';
import { Briefcase, Bookmark, FileText, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { applicationService, jobService } from '../../services/supabaseApi';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      applicationService.getCandidateApplications(user.id).then(setApplications);
      jobService.getSavedJobIds(user.id).then((ids) => setSavedCount(ids.length));
    }
  }, [user]);

  const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-xl space-y-2">
          <h2 className="text-2xl font-black">Welcome back, {user?.fullName || 'Candidate'}! 👋</h2>
          <p className="text-xs sm:text-sm text-primary-100">
            Connected to your Supabase Candidate Profile. Track applications and saved roles in real-time.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{applications.length}</div>
            <div className="text-xs text-slate-500 font-semibold">Applied Jobs</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{shortlistedCount}</div>
            <div className="text-xs text-slate-500 font-semibold">Shortlisted</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Bookmark className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{savedCount}</div>
            <div className="text-xs text-slate-500 font-semibold">Saved Roles</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">95%</div>
            <div className="text-xs text-slate-500 font-semibold">Match Score</div>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Recent Applications</h3>
        {applications.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
            No applications submitted yet. Explore featured jobs and apply!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="pb-3 px-2">Job Title</th>
                  <th className="pb-3 px-2">Company</th>
                  <th className="pb-3 px-2">Date Applied</th>
                  <th className="pb-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-slate-900 dark:text-white">{app.jobs?.title || 'Position'}</td>
                    <td className="py-3.5 px-2">{app.jobs?.companies?.name || 'Company'}</td>
                    <td className="py-3.5 px-2 flex items-center gap-1"><Clock className="h-3 w-3 text-slate-400" /> {new Date(app.applied_at || Date.now()).toLocaleDateString()}</td>
                    <td className="py-3.5 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        app.status === 'shortlisted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        app.status === 'reviewing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {app.status || 'Applied'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
