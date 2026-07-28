import { useState, useEffect } from 'react';
import { Building, Loader2, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../utils/supabase';

export default function CompanyInfoPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Profile Data
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('recruiter_profiles')
          .select('*, companies(name)')
          .eq('user_id', user.id)
          .single();
          
        if (data) {
          setDesignation(data.designation || '');
          if (data.companies?.name) {
            setCompanyName(data.companies.name);
          }
        }
      } catch (err) {
        console.warn('Error fetching company info:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanyInfo();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      // In a real app we'd update the company name in the companies table too, 
      // but for now we just update the recruiter profile designation.
      const { error } = await supabase
        .from('recruiter_profiles')
        .update({ designation })
        .eq('user_id', user.id);
        
      if (!error) {
        setToastMessage('Company info updated successfully!');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.warn('Error saving company info:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-500">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {toastMessage && (
        <div className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg animate-slide-down fixed top-20 right-8 z-50">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-2xl">
            <Building className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Company Info</h2>
            <p className="text-sm text-slate-500">Manage your recruiter details and company information.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Company Name</label>
            <input 
              disabled
              value={companyName}
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 cursor-not-allowed"
              title="Company name cannot be changed directly."
            />
            <p className="text-xs text-slate-500 mt-1">Contact support to change your registered company name.</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Your Designation / Title</label>
            <input 
              required
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              type="text" 
              placeholder="e.g. Talent Acquisition Lead"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
          
          <div className="pt-6 flex justify-end">
            <button 
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
            >
              {isSaving ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Saving...</>
              ) : (
                <><Save className="h-5 w-5" /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
