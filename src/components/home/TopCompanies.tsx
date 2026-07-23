import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { companyService } from '../../services/supabaseApi';
import type { Company } from '../../types/portal.types';

export default function TopCompanies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyService.getTopCompanies().then((data) => {
      setCompanies(data);
      setLoading(false);
    });
  }, []);

  return (
    <section id="companies" className="py-16 bg-white dark:bg-slate-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Top Hiring Companies
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Directly connect with engineering leads and talent acquisition specialists. Live from Supabase companies table.
          </p>
        </div>

        {/* Company Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-44 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))
          ) : (
            companies.map((company) => (
              <div
                key={company.id}
                onClick={() => navigate(`/companies?name=${encodeURIComponent(company.name)}`)}
                className="group bg-slate-50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-3 right-3 text-emerald-500" title="Verified Partner">
                  <CheckCircle2 className="h-4 w-4" />
                </div>

                {/* Logo Avatar */}
                <div className={`h-16 w-16 rounded-2xl ${company.logoBg} text-white text-2xl font-black flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform duration-300`}>
                  {company.logoText}
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {company.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  {company.industry}
                </p>

                <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:underline">
                  <span>{company.activeJobs} Open Roles</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
