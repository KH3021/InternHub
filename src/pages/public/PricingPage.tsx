import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter Hiring',
      price: '$99',
      period: 'per job post',
      description: 'Perfect for startups looking to fill specific technical internships or entry positions.',
      features: ['1 Active Job Listing', '30 Days Duration', 'Basic Resume Screening', 'Email Support'],
      buttonText: 'Post a Job',
      highlighted: false
    },
    {
      name: 'Growth Enterprise',
      price: '$299',
      period: 'per month',
      description: 'Designed for scaling tech companies needing steady candidate pipelines.',
      features: ['5 Active Job Listings', '60 Days Duration', 'AI Candidate Recommendations', 'Direct Applicant Messaging', 'Featured Badge on Board'],
      buttonText: 'Get Started',
      highlighted: true
    },
    {
      name: 'Unlimited Hiring',
      price: '$699',
      period: 'per month',
      description: 'Complete recruitment solution with dedicated account manager.',
      features: ['Unlimited Job Listings', 'Full Database Resume Search', 'Custom Employer Branding Page', 'Dedicated HR Support', 'ATS Integration'],
      buttonText: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Employer Hiring Packages</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Flexible plans tailored for startups, growth agencies, and global enterprises.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-3xl p-8 border relative flex flex-col justify-between transition-all ${plan.highlighted ? 'bg-white dark:bg-slate-900 border-primary-500 shadow-2xl ring-2 ring-primary-500' : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm'}`}
          >
            {plan.highlighted && (
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase px-4 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>Most Popular</span>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                <span className="text-xs text-slate-500">{plan.period}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{plan.description}</p>
              
              <div className="pt-4 space-y-2.5">
                {plan.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <Link
                to="/register/recruiter"
                className={`w-full block text-center py-3 rounded-xl font-bold text-sm transition-all ${plan.highlighted ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/20' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white'}`}
              >
                {plan.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
