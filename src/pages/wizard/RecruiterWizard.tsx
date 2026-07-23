import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Upload, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RecruiterWizard() {
  const navigate = useNavigate();

  const [designation, setDesignation] = useState('Senior Technical Recruiter');
  const [companyBio, setCompanyBio] = useState('Leading provider of enterprise software solutions.');
  const [logoUploaded, setLogoUploaded] = useState(false);

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl shadow-xl transition-colors duration-300">
      
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Employer Verification Wizard</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Complete organization setup to start posting jobs</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
          Recruiter Profile
        </span>
      </div>

      <form onSubmit={handleComplete} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Your Designation
          </label>
          <input
            type="text"
            required
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="e.g. Lead Talent Partner"
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Company Overview
          </label>
          <textarea
            rows={3}
            value={companyBio}
            onChange={(e) => setCompanyBio(e.target.value)}
            placeholder="Briefly describe your company's mission and team culture..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Company Logo (PNG, SVG)
          </label>
          <div
            onClick={() => setLogoUploaded(true)}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${logoUploaded ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/40'}`}
          >
            {logoUploaded ? (
              <div className="space-y-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-8 w-8 mx-auto" />
                <div className="text-sm font-bold">company_logo.svg uploaded!</div>
              </div>
            ) : (
              <div className="space-y-1 text-slate-500 dark:text-slate-400">
                <Upload className="h-8 w-8 mx-auto text-indigo-500" />
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Click to upload company logo</div>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>Complete Setup & Post Jobs</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

    </div>
  );
}
