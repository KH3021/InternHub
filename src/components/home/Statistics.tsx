import React from 'react';
import { Briefcase, Building2, Users, GraduationCap } from 'lucide-react';

export default function Statistics() {
  const stats = [
    {
      icon: Briefcase,
      value: '10,000+',
      label: 'Active Jobs',
      description: 'Full-time engineering & business roles.',
      color: 'text-blue-500 bg-blue-500/10'
    },
    {
      icon: Building2,
      value: '2,000+',
      label: 'Top Employers',
      description: 'Verified enterprises & tech startups.',
      color: 'text-indigo-500 bg-indigo-500/10'
    },
    {
      icon: Users,
      value: '50,000+',
      label: 'Job Seekers',
      description: 'Active candidates & skilled freshers.',
      color: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      icon: GraduationCap,
      value: '5,000+',
      label: 'Paid Internships',
      description: 'Stipend opportunities with PPO path.',
      color: 'text-rose-500 bg-rose-500/10'
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-tr from-slate-900 via-slate-850 to-slate-950 rounded-3xl p-8 sm:p-14 shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary-600/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl"></div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center p-4 first:pt-0 sm:first:p-4 border-slate-800">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-slate-200 text-sm font-bold mt-2">
                    {stat.label}
                  </span>
                  <p className="text-slate-400 text-xs mt-1 max-w-[180px]">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
