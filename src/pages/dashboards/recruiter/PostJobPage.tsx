import { useState } from 'react';
import { PlusCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { jobService } from '../../../services/supabaseApi';
import { useNavigate } from 'react-router-dom';

export default function PostJobPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('full-time');
  const [workMode, setWorkMode] = useState('Remote');
  const [description, setDescription] = useState('');

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setIsSubmitting(true);
    const { success, error } = await jobService.createJob({
      title,
      location,
      salary,
      jobType,
      workMode,
      description,
      recruiterId: user.id
    });
    
    setIsSubmitting(false);

    if (success) {
      setToastMessage('Job posted successfully!');
      
      // Reset form
      setTitle('');
      setLocation('');
      setSalary('');
      setDescription('');
      
      setTimeout(() => {
        setToastMessage('');
        navigate('/dashboard'); // Go back to overview
      }, 2000);
    } else {
      alert(`Failed to post job: ${error}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {toastMessage && (
        <div className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg animate-slide-down fixed top-20 right-8 z-50">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 mb-6">
          <PlusCircle className="h-6 w-6 text-indigo-600" />
          Post a New Role
        </h2>
        
        <form onSubmit={handlePostJob} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Job Title</label>
              <input 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text" 
                placeholder="e.g. Senior Product Designer"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Location</label>
              <input 
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                type="text" 
                placeholder="e.g. San Francisco, CA"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Salary Range</label>
              <input 
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                type="text" 
                placeholder="e.g. $120k - $150k"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Work Mode</label>
              <select 
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Job Type</label>
              <select 
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Job Description</label>
              <textarea 
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Describe the role, responsibilities, and requirements..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
              ></textarea>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Posting...</>
              ) : (
                <><PlusCircle className="h-5 w-5" /> Post Role</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
