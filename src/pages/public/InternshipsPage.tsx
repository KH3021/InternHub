import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, CheckCircle2 } from 'lucide-react';
import InternshipCard from '../../components/common/InternshipCard';
import { featuredInternships } from '../../data/dummyData';
import { useAuth } from '../../hooks/useAuth';
import { applicationService, jobService } from '../../services/supabaseApi';

export default function InternshipsPage() {
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

  const handleApply = async (internshipId: string) => {
    if (!user) {
      navigate('/login', { state: { info: 'Please sign in or create an account to apply.' } });
      return;
    }

    const internship = featuredInternships.find((i) => i.id === internshipId);
    const { success, error } = await applicationService.applyForJob(
      user.id,
      internshipId,
      internship?.title,
      internship?.companyName
    );

    if (success) {
      setAppliedJobIds((prev) => [...prev, internshipId]);
      setToastMessage(`🎉 Application submitted for ${internship?.title || 'Internship'} at ${internship?.companyName || 'Company'}! Saved to Supabase.`);
      setTimeout(() => setToastMessage(''), 5000);
    } else {
      alert(`Failed to apply: ${error}`);
    }
  };

  const handleSave = async (internshipId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    await jobService.saveJob(user.id, internshipId);
    setToastMessage('Internship saved to your dashboard!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filtered = featuredInternships.filter((intern) => {
    const matchesQuery = intern.title.toLowerCase().includes(query.toLowerCase()) || intern.companyName.toLowerCase().includes(query.toLowerCase());
    const matchesWorkMode = workMode === 'All' || intern.workMode === workMode;
    return matchesQuery && matchesWorkMode;
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Explore Paid Internships</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Summer, winter, and semester internships with high stipend opportunities.</p>
      </div>

      {toastMessage && (
        <div className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-lg animate-slide-down">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl w-full">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search internships by role or company..."
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
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${workMode === mode ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((internship) => {
          const isApplied = appliedJobIds.includes(internship.id);
          return (
            <div key={internship.id} className="relative">
              <InternshipCard
                internship={internship}
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
