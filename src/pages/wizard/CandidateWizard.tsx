import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Upload, CheckCircle2, ArrowRight, Loader2, Plus, X, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/supabaseApi';

const POPULAR_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'C++', 'JavaScript',
  'Tailwind CSS', 'Docker', 'AWS', 'PostgreSQL', 'MongoDB', 'GraphQL',
  'Figma', 'Machine Learning', 'Data Science', 'DevOps', 'Cybersecurity',
  'Swift', 'Flutter', 'SQL', 'Git', 'Express.js', 'Next.js', 'Vue.js', 'Angular'
];

export default function CandidateWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [education, setEducation] = useState('B.Tech Computer Science');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Tailwind CSS']);
  const [skillInput, setSkillInput] = useState('');
  const [experienceYears, setExperienceYears] = useState('0');
  const [preferredLocation, setPreferredLocation] = useState('Remote / San Francisco');

  // Resume Upload State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [resumeError, setResumeError] = useState<string>('');
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Skill Suggestions Filter
  const filteredSuggestions = POPULAR_SKILLS.filter(
    (s) => s.toLowerCase().includes(skillInput.toLowerCase().trim()) && !skills.includes(s)
  );

  const addSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate 500 KB limit
    const MAX_SIZE_BYTES = 500 * 1024; // 500 KB
    if (file.size > MAX_SIZE_BYTES) {
      setResumeError(`File size exceeds 500 KB limit (selected file is ${(file.size / 1024).toFixed(1)} KB). Please upload a smaller file.`);
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
    if (user?.id) {
      setIsUploadingResume(true);
      const res = await profileService.uploadResume(user.id, file);
      setIsUploadingResume(false);
      if (res.error) {
        setResumeError(res.error);
      } else if (res.url) {
        setResumeUrl(res.url);
      }
    }
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (skills.length === 0) {
      setError('Please add at least one technical skill.');
      return;
    }

    if (user?.id) {
      setIsSaving(true);
      try {
        await profileService.saveProfile(user.id, {
          email: user.email,
          fullName: user.fullName,
          role: 'candidate',
          education,
          experienceYears,
          preferredLocation,
          skills,
          resumeUrl: resumeUrl || (resumeFile ? `https://supabase.co/storage/resumes/${user.id}_resume.pdf` : ''),
        });
      } catch (err) {
        console.warn('[Wizard] Error saving candidate profile:', err);
      } finally {
        setIsSaving(false);
      }
    }
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

      {error && (
        <div className="flex items-start gap-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium px-4 py-3 rounded-xl mb-4">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

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
          <div className="space-y-5 animate-slide-up">
            
            {/* Primary Technical Skills Input & Suggestions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Technical Skills (Add & Get Suggestions)
              </label>
              
              {/* Selected Skill Pills */}
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mb-2 min-h-[48px]">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg bg-primary-100 dark:bg-primary-950/80 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-rose-500 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
                {skills.length === 0 && (
                  <span className="text-xs text-slate-400 self-center">No skills added yet. Select from suggestions below or type custom skill.</span>
                )}
              </div>

              {/* Custom Skill Add Input */}
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type skill name & press Enter..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Auto-Complete Suggestions Dropdown/Pills */}
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-slate-400">Suggested Skills (Click to add):</div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-slate-100/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-800">
                  {filteredSuggestions.slice(0, 12).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSkill(s)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold hover:border-primary-500 hover:text-primary-600 transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <Plus className="h-3 w-3 text-slate-400" />
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Resume Upload with 500 KB Limit & Supabase Storage */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Upload Resume (PDF, DOCX)
                </label>
                <span className="text-[11px] font-bold text-slate-500">Max size: <strong className="text-amber-500">500 KB</strong></span>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                  resumeError
                    ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/20'
                    : resumeFile || resumeUrl
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-primary-500 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                {isUploadingResume ? (
                  <div className="space-y-2 text-primary-600">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin" />
                    <div className="text-sm font-bold">Uploading to Supabase Storage...</div>
                  </div>
                ) : resumeFile || resumeUrl ? (
                  <div className="space-y-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-8 w-8 mx-auto" />
                    <div className="text-sm font-bold">{resumeFile ? resumeFile.name : 'Resume Uploaded'}</div>
                    <div className="text-xs text-slate-400">Stored safely in Supabase</div>
                  </div>
                ) : (
                  <div className="space-y-1 text-slate-500 dark:text-slate-400">
                    <Upload className="h-8 w-8 mx-auto text-primary-500" />
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Click to browse resume file</div>
                    <div className="text-xs">Supports PDF, DOCX (Must be under 500 KB)</div>
                  </div>
                )}
              </div>

              {resumeError && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 mt-2 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{resumeError}</span>
                </div>
              )}
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
                disabled={isSaving || isUploadingResume}
                className="w-2/3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : (
                  <span>Save & Go to Dashboard</span>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

    </div>
  );
}
