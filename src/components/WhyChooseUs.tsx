import { CheckCircle2, Zap, Brain, FileText } from 'lucide-react';

export default function WhyChooseUs() {
  const benefits = [
    {
      icon: CheckCircle2,
      title: 'Verified Companies',
      description: 'Every job post and company profile is rigorously vetted by our security team to prevent scams and ensure legitimacy.',
      colorClass: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/30'
    },
    {
      icon: Zap,
      title: 'Easy Apply',
      description: 'Submit your resume and cover letter to multiple listings with a single click. Keep track of application statuses instantly.',
      colorClass: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-100/50 dark:border-blue-900/30'
    },
    {
      icon: Brain,
      title: 'AI Job Recommendations',
      description: 'Our proprietary machine learning algorithm matches your unique profile, skills, and preferences to high-compatibility roles.',
      colorClass: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100/50 dark:border-purple-900/30'
    },
    {
      icon: FileText,
      title: 'Resume Builder',
      description: 'Generate ATS-friendly resumes using professional templates tailored for internships and software roles in minutes.',
      colorClass: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/30'
    }
  ];

  return (
    <section className="py-16 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Why Choose InternHub
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            We provide a modern matching experience for candidates and recruiters. Discover features designed to land you the perfect position.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon */}
                  <div className={`h-12 w-12 rounded-xl border flex items-center justify-center mb-4 ${item.colorClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
