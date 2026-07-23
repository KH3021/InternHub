import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Upload, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CandidateWizard() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [education, setEducation] = useState('B.Tech Computer Science');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Tailwind CSS']);
  const [experienceYears, setExperienceYears] = useState('0');
  const [preferredLocation, setPreferredLocation] = useState('Remote / San Francisco');
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl shadow-xl transition-colors duration-300">
      
      {/* Wizard Header Progress */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Profile Completion Wizard</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Step {step} of 2 - Let recruiters discover your talents</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-bold">
          Candidate Profile
        </span>
      </div>

      <form onSubmit={handleComplete} className="space-y-6">
        {step === 1 ? (
          <div className="space-y-4 animate-slide-up">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Highest Education
              </label>
              <input
                type="text"
                required
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Years of Experience
              </label>
              <select
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="0">0 years (Fresher / Student)</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Preferred Job Location
              </label>
              <input
                type="text"
                required
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="e.g. Remote, San Francisco, New York"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Next: Skills & Resume</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Technical Skills
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                {skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-lg bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center gap-1">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Upload Placeholder */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Upload Resume (PDF, DOCX)
              </label>
              <div
                onClick={() => setResumeUploaded(true)}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${resumeUploaded ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-slate-300 dark:border-slate-700 hover:border-primary-500 bg-slate-50/50 dark:bg-slate-800/40'}`}
              >
                {resumeUploaded ? (
                  <div className="space-y-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-8 w-8 mx-auto" />
                    <div className="text-sm font-bold">resume_johndoe.pdf uploaded!</div>
                    <div className="text-xs text-slate-400">Ready for Supabase Storage sync</div>
                  </div>
                ) : (
                  <div className="space-y-1 text-slate-500 dark:text-slate-400">
                    <Upload className="h-8 w-8 mx-auto text-primary-500" />
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Click to upload your resume</div>
                    <div className="text-xs">Supports PDF, DOCX up to 5MB</div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all"
              >
                Save & Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </form>

    </div>
  );
}
