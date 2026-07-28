import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building, Upload, CheckCircle2, ArrowRight, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { profileService, supabase } from '../../services/supabaseApi';

export default function RecruiterWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [designation, setDesignation] = useState('');
  const [companyName, setCompanyName] = useState(location.state?.companyName || '');
  const [companyBio, setCompanyBio] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [logoError, setLogoError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image file size (max 2 MB)
    const MAX_SIZE_BYTES = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      setLogoError(`Logo image must be under 2 MB (selected file is ${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      setLogoFile(null);
      setLogoUploaded(false);
      return;
    }

    setLogoFile(file);
    setLogoUploaded(true);
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id) {
      setIsSaving(true);
      try {
        // Create company in companies table if not exists
        let companyId = '00000000-0000-0000-0002-000000000001'; // Fallback
        if (companyName) {
          const { data: existingCompany } = await supabase
            .from('companies')
            .select('id')
            .eq('name', companyName)
            .maybeSingle();
            
          if (existingCompany) {
            companyId = existingCompany.id;
          } else {
            // Insert new company
            const { data: newCompany, error: companyErr } = await supabase
              .from('companies')
              .insert({ name: companyName, industry: 'Technology', active_jobs: 0, owner_id: user.id })
              .select('id')
              .single();
            if (companyErr) console.warn('[RecruiterWizard] Error inserting company:', companyErr.message);
            if (newCompany) companyId = newCompany.id;
          }
        }

        await profileService.saveProfile(user.id, {
          email: user.email,
          fullName: user.fullName,
          role: 'recruiter',
          companyName: companyName || designation, // Keep backward compatible
          companyId: companyId,
          designation: designation,
          bio: companyBio,
        });
      } catch (err) {
        console.warn('[RecruiterWizard] Error saving profile:', err);
      } finally {
        setIsSaving(false);
      }
    }
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

      <form onSubmit={handleComplete} className="space-y-4" autoComplete="off">
        {/* Dummy inputs to absorb aggressive browser autofill */}
        <input type="email" name="fake_email" className="hidden" autoComplete="email" />
        <input type="password" name="fake_password" className="hidden" autoComplete="current-password" />
        
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Company Name
          </label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. TechCorp Inc."
            autoComplete="new-password"
            name={`company_${Math.random()}`}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

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
            autoComplete="new-password"
            name={`designation_${Math.random()}`}
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

        {/* Real File Input for Company Logo */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Company Logo (PNG, SVG, JPG)
          </label>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,.svg"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
              logoError
                ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/20'
                : logoUploaded
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/40'
            }`}
          >
            {logoUploaded && logoFile ? (
              <div className="space-y-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-8 w-8 mx-auto" />
                <div className="text-sm font-bold">{logoFile.name} uploaded!</div>
                <div className="text-xs text-slate-400">{(logoFile.size / 1024).toFixed(1)} KB</div>
              </div>
            ) : (
              <div className="space-y-1 text-slate-500 dark:text-slate-400">
                <Upload className="h-8 w-8 mx-auto text-indigo-500" />
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Click to select company logo file</div>
                <div className="text-xs">Supports PNG, SVG, JPG (Max 2MB)</div>
              </div>
            )}
          </div>

          {logoError && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 mt-2 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{logoError}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Complete Setup & Post Jobs</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

    </div>
  );
}
