import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import InternshipCard from '../common/InternshipCard';
import { jobService } from '../../services/supabaseApi';
import type { Internship } from '../../types/portal.types';

export default function FeaturedInternships() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobService.getFeaturedInternships().then((data) => {
      setInternships(data);
      setLoading(false);
    });
  }, []);

  return (
    <section id="internships" className="py-16 bg-slate-50/60 dark:bg-slate-900/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div className="space-y-2 text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Internships
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
              Paid internships offering hands-on experience and PPO opportunities. Live from Supabase jobs table.
            </p>
          </div>

          <button
            onClick={() => navigate('/internships')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline shrink-0 group"
          >
            <span>Explore All Internships</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Internships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))
          ) : (
            internships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} onApply={() => navigate(`/internships?id=${internship.id}`)} />
            ))
          )}
        </div>

      </div>
    </section>
  );
}
