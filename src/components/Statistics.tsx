import { Briefcase, Building2, Users, GraduationCap } from 'lucide-react';

export default function Statistics() {
  const stats = [
    {
      icon: Briefcase,
      value: '10,000+',
      label: 'Active Jobs',
      description: 'Full-time roles across major sectors.',
      colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20'
    },
    {
      icon: Building2,
      value: '2,000+',
      label: 'Verified Companies',
      description: 'Top companies recruiting actively.',
      colorClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20'
    },
    {
      icon: Users,
      value: '50,000+',
      label: 'Active Candidates',
      description: 'Skilled developers and professionals.',
      colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20'
    },
    {
      icon: GraduationCap,
      value: '5,000+',
      label: 'Paid Internships',
      description: 'Hands-on training opportunities.',
      colorClass: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20'
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Statistics Grid */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
          {/* Abstract Glow Effects */}
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary-500/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"></div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4 first:pt-0 sm:first:p-4 sm:pl-0 lg:pl-4 border-slate-800"
                >
                  {/* Icon Badge */}
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 ${stat.colorClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Value */}
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {stat.value}
                  </span>

                  {/* Label */}
                  <span className="text-slate-200 text-sm font-bold mt-2">
                    {stat.label}
                  </span>

                  {/* Description */}
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
