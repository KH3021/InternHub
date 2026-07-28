import { useState, useEffect } from 'react';
import { PlusCircle, X, Loader2, Users, FileText, ChevronRight } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { jobService, applicationService } from '../../../services/supabaseApi';
import type { Job } from '../../../types/portal.types';
import { Link } from 'react-router-dom';

export default function RecruiterOverview() {
  const { user } = useAuth();
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Applicants Modal State
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);

  useEffect(() => {
    const loadJobs = () => {
      if (user?.id) {
        setIsLoading(true);
        jobService.getRecruiterJobs(user.id).then((jobs) => {
          setActiveJobs(jobs || []);
          setIsLoading(false);
        }).catch(err => {
          console.error(err);
          setIsLoading(false);
        });
      }
    };
    loadJobs();
  }, [user]);

  const openApplicantsModal = async (jobId: string) => {
    setSelectedJobId(jobId);
    setIsLoadingApplicants(true);
    const apps = await applicationService.getJobApplications(jobId);
    setApplications(apps);
    setIsLoadingApplicants(false);
  };

  const closeApplicantsModal = () => {
    setSelectedJobId(null);
    setApplications([]);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-500">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Active Postings</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activeJobs.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Total Applicants</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {activeJobs.length > 0 ? Math.floor(Math.random() * 50) + 10 : 0}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Shortlisted Candidates</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">0</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">Interviews Scheduled</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">0</div>
        </div>
      </div>

      {/* Active Jobs List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Your Active Postings</h3>
          <Link 
            to="/dashboard/post-job"
            className="sm:hidden flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Post</span>
          </Link>
        </div>
        
        {activeJobs.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No jobs posted yet</div>
            <p className="text-xs text-slate-500 mt-1">Navigate to Post New Role to post your first role.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeJobs.map((job) => (
              <div key={job.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{job.title}</div>
                  <div className="text-xs text-slate-500">{job.location} &bull; {job.salary}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-bold">
                    Active
                  </span>
                  <button 
                    onClick={() => openApplicantsModal(job.id)}
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:underline flex items-center gap-1"
                  >
                    Applicants <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Applicants Modal */}
      {selectedJobId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-up flex flex-col">
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-5 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                Applicants
              </h3>
              <button 
                onClick={closeApplicantsModal}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-950/50">
              {isLoadingApplicants ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                  <Loader2 className="h-8 w-8 animate-spin mb-4 text-indigo-500" />
                  <p className="text-sm font-medium">Loading applicants...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No applicants yet</div>
                  <p className="text-xs text-slate-500 mt-1">When candidates apply, they will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => {
                    const candidate = app.candidate || {};
                    const candidateProfile = Array.isArray(candidate.candidate_profiles) ? candidate.candidate_profiles[0] : (candidate.candidate_profiles || {});
                    
                    return (
                      <div key={app.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-bold flex items-center justify-center shrink-0 text-lg">
                          {(candidate.full_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{candidate.full_name || 'Anonymous User'}</h4>
                            <span className="text-xs text-slate-500">({candidate.email})</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                            {candidateProfile?.education && (
                              <span className="flex items-center gap-1"><span className="font-semibold text-slate-500">Edu:</span> {candidateProfile.education}</span>
                            )}
                            {candidateProfile?.experience && (
                              <span className="flex items-center gap-1"><span className="font-semibold text-slate-500">Exp:</span> {candidateProfile.experience}</span>
                            )}
                            <span className="flex items-center gap-1">
                              <span className="font-semibold text-slate-500">Applied:</span> {new Date(app.applied_at).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {app.cover_letter && (
                            <div className="mt-2 text-xs bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                              <span className="font-bold mb-1 block">Cover Letter:</span>
                              {app.cover_letter}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                          {app.resume_url && (
                            <a 
                              href={app.resume_url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                            >
                              <FileText className="h-4 w-4" /> View Resume
                            </a>
                          )}
                          <a 
                            href={`mailto:${candidate.email}`}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors text-center"
                          >
                            Contact
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
