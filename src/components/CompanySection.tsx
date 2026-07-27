import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { companyService } from '../services/supabaseApi';
import type { Company } from '../types/portal.types';

export default function CompanySection() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    companyService.getTopCompanies().then((data) => {
      setCompanies(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Top Hiring Companies
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Get hired by industry leaders. We partner with top tier enterprises and rapid growth startups to bring you verified career opportunities.
          </p>
        </div>

        {/* Companies Grid */}
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-8 w-8 rounded-full border-4 border-primary-500/30 border-t-primary-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {companies.map((company) => (
              <div
                key={company.id}
                className="group bg-slate-50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
              >
                {/* Company Logo Avatar */}
                <div className={`h-16 w-16 rounded-2xl ${company.logoBg} text-white text-2xl font-extrabold flex items-center justify-center shadow-md shadow-slate-200/50 dark:shadow-none mb-4 group-hover:scale-105 transition-transform duration-300`}>
                  {company.logoText}
                </div>

                {/* Company Details */}
                <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">
                  {company.name}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
                  {company.industry}
                </p>

                {/* Active Jobs Link */}
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:underline">
                  <span>{company.activeJobs} Active Openings</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
