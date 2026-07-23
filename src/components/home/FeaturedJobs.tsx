import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import JobCard from '../common/JobCard';
import { jobService } from '../../services/supabaseApi';
import type { Job } from '../../types/portal.types';

export default function FeaturedJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobService.getFeaturedJobs().then((data) => {
      setJobs(data);
      setLoading(false);
    });
  }, []);

  return (
    <section id="jobs" className="py-16 bg-white dark:bg-slate-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div className="space-y-2 text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Jobs
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
              Hand-picked full-time roles from top hiring companies. Live from Supabase jobs table.
            </p>
          </div>

          <button
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:underline shrink-0 group"
          >
            <span>Explore All Jobs</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))
          ) : (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} onApply={() => navigate(`/jobs?id=${job.id}`)} />
            ))
          )}
        </div>

      </div>
    </section>
  );
}
