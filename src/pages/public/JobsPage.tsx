import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, CheckCircle2, AlertCircle } from 'lucide-react';
import JobCard from '../../components/common/JobCard';
import { featuredJobs } from '../../data/dummyData';
import { useAuth } from '../../hooks/useAuth';
import { applicationService, jobService } from '../../services/supabaseApi';

export default function JobsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [query, setQuery] = useState('');
  const [workMode, setWorkMode] = useState<string>('All');
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string>('');

  useEffect(() => {
    if (user?.id) {
      applicationService.getCandidateApplications(user.id).then((apps) => {
        const ids = apps.map((a: any) => a.job_id);
        setAppliedJobIds(ids);
      });
    }
  }, [user]);

  const handleApply = async (jobId: string) => {
    if (!user) {
      navigate('/login', { state: { info: 'Please sign in or create an account to apply.' } });
      return;
    }

    const job = featuredJobs.find((j) => j.id === jobId);
    const { success } = await applicationService.applyForJob(
      user.id,
      jobId,
      job?.title,
      job?.companyName
    );

    if (success) {
      setAppliedJobIds((prev) => [...prev, jobId]);
      setToastMessage(`🎉 Application submitted for ${job?.title || 'Position'} at ${job?.companyName || 'Company'}! Saved to Supabase.`);
      setTimeout(() => setToastMessage(''), 5000);
    }
  };

  const handleSave = async (jobId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    await jobService.saveJob(user.id, jobId);
    setToastMessage('Job saved to your dashboard!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filtered = featuredJobs.filter((job) => {
    const matchesQuery = job.title.toLowerCase().includes(query.toLowerCase()) || job.companyName.toLowerCase().includes(query.toLowerCase());
    const matchesWorkMode = workMode === 'All' || job.workMode === workMode;
    return matchesQuery && matchesWorkMode;
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Explore Full-Time Jobs</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Discover verified positions from top hiring enterprises and startups.</p>
      </div>

      {/* Success Toast */}
      {toastMessage && (
        <div className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-lg animate-slide-down">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl w-full">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by job title or company..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Mode:</span>
          {['All', 'Remote', 'Hybrid', 'On-site'].map((mode) => (
            <button
              key={mode}
              onClick={() => setWorkMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${workMode === mode ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((job) => {
          const isApplied = appliedJobIds.includes(job.id);
          return (
            <div key={job.id} className="relative">
              <JobCard
                job={job}
                onApply={handleApply}
                onSave={handleSave}
              />
              {isApplied && (
                <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Applied</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
