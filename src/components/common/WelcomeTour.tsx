import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, X, ShieldCheck, Rocket, Briefcase } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function WelcomeTour() {
  const { showWelcomeTour, dismissWelcomeTour, user, role } = useAuth();
  const [step, setStep] = useState(1);

  if (!showWelcomeTour) return null;

  const tourSteps = [
    {
      title: `Welcome to InternHub, ${user?.fullName || 'there'}! 🎉`,
      description: 'Your account has been successfully created. Let us give you a quick 30-second tour of your new career portal.',
      icon: Rocket,
      badge: 'Step 1 of 3 - Welcome',
    },
    {
      title: 'Complete Your Professional Profile',
      description: role === 'candidate'
        ? 'Upload your resume and add your technical skills. Candidates with complete profiles receive 3x more recruiter messages.'
        : 'Set up your company profile and recruiter designation to start posting verified jobs and reaching top talent.',
      icon: Briefcase,
      badge: 'Step 2 of 3 - Setup Profile',
    },
    {
      title: 'AI Match & 1-Click Applications',
      description: 'Explore curated job listings, set real-time email alerts, and track your application status live from your dashboard.',
      icon: ShieldCheck,
      badge: 'Step 3 of 3 - Get Started',
    },
  ];

  const currentStep = tourSteps[step - 1];
  const StepIcon = currentStep.icon;

  const handleNext = () => {
    if (step < tourSteps.length) {
      setStep(step + 1);
    } else {
      dismissWelcomeTour();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Top Glow */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary-500/20 blur-2xl"></div>

        {/* Close Button */}
        <button
          onClick={dismissWelcomeTour}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Step Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-300 text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5 text-primary-500" />
          <span>{currentStep.badge}</span>
        </div>

        {/* Step Visual */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-primary-600/30 shrink-0">
            <StepIcon className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {currentStep.title}
            </h3>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {currentStep.description}
        </p>

        {/* Progress dots & buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            {tourSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx + 1 === step ? 'w-6 bg-primary-600' : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={dismissWelcomeTour}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Skip Tour
            </button>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <span>{step === tourSteps.length ? 'Get Started' : 'Next Step'}</span>
              {step === tourSteps.length ? <CheckCircle2 className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
