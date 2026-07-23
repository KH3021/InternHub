import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, PlusCircle } from 'lucide-react';

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-slate-50/60 dark:bg-slate-900/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 rounded-3xl p-8 sm:p-16 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 border border-primary-500/40">
          
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          <div className="relative max-w-xl space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Start Your Career Today
            </h2>
            <p className="text-primary-100 text-sm sm:text-base leading-relaxed">
              Join 50,000+ candidates landing internships and tech roles. Create your candidate or recruiter account in under 2 minutes.
            </p>
          </div>

          <div className="relative flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => navigate('/jobs')}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-primary-700 font-extrabold text-sm px-7 py-3.5 rounded-full shadow-lg shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Find Jobs</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => navigate('/register/recruiter')}
              className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white font-extrabold text-sm px-7 py-3.5 rounded-full border border-white/30 hover:border-white/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Post a Job</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
