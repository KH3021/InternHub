import React from 'react';
import { CheckCircle2, Zap, Brain, FileText } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: CheckCircle2,
      title: 'Verified Companies',
      description: 'Strict security vetting for all employer postings to eliminate spam, scam, or fake job listings.',
      color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/40'
    },
    {
      icon: Zap,
      title: 'Easy 1-Click Apply',
      description: 'Store your profile, resume, and portfolios to apply for hundreds of roles in seconds.',
      color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/40'
    },
    {
      icon: Brain,
      title: 'AI Recommendations',
      description: 'Machine learning algorithms match your skills, education, and preferred locations to compatible positions.',
      color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/40'
    },
    {
      icon: FileText,
      title: 'ATS Resume Builder',
      description: 'Create professional, ATS-optimized resumes designed for software engineers and corporate positions.',
      color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/40'
    }
  ];

  return (
    <section className="py-16 bg-slate-50/60 dark:bg-slate-900/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Choose InternHub
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Built specifically for job seekers and hiring managers seeking a frictionless, transparent recruitment process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className={`h-12 w-12 rounded-xl border flex items-center justify-center mb-4 ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
