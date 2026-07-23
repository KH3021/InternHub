import { ArrowRight, UploadCloud } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-16 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Card */}
        <div className="bg-gradient-to-tr from-primary-600 via-primary-700 to-indigo-700 rounded-3xl p-8 sm:p-16 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 border border-primary-500/30">
          
          {/* Background shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          {/* Content */}
          <div className="relative max-w-xl space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Start Your Career Today
            </h2>
            <p className="text-primary-100 text-sm sm:text-base leading-relaxed">
              Create an account to unlock AI-based job recommendations, resume matching, and direct communication with verified recruiters.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="relative flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
            {/* Find Jobs Button */}
            <button className="w-full sm:w-auto bg-white hover:bg-slate-50 text-primary-700 font-bold px-6 py-3.5 rounded-full shadow-lg shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
              <span>Find Jobs</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Post a Job Button */}
            <button className="w-full sm:w-auto bg-primary-500/20 hover:bg-primary-500/35 text-white font-bold px-6 py-3.5 rounded-full border border-white/20 hover:border-white/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
              <UploadCloud className="h-4 w-4" />
              <span>Post a Job</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
