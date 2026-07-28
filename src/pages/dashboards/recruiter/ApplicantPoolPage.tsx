import { useState, useEffect } from 'react';
import { Users, FileText, Loader2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { jobService, applicationService } from '../../../services/supabaseApi';
import type { Job } from '../../../types/portal.types';

export default function ApplicantPoolPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        // Fetch all jobs first
        const jobs = await jobService.getRecruiterJobs(user.id);
        
        // Fetch applications for each job
        let allApps: any[] = [];
        for (const job of jobs) {
          const apps = await applicationService.getJobApplications(job.id);
          // Add job info to each application for context
          const appsWithJob = apps.map((app: any) => ({ ...app, job_title: job.title }));
          allApps = [...allApps, ...appsWithJob];
        }
        
        // Sort by applied_at desc
        allApps.sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime());
        setApplications(allApps);
      } catch (err) {
        console.warn('Error fetching applicant pool:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllApplicants();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-500">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-indigo-500" />
        <p className="font-bold">Loading applicant pool...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-2xl">
            <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Applicant Pool</h2>
            <p className="text-sm text-slate-500">All candidates who have applied to your postings</p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <div className="text-base font-bold text-slate-700 dark:text-slate-300">No applicants yet</div>
            <p className="text-sm text-slate-500 mt-1">When candidates apply to your jobs, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const candidate = app.candidate || {};
              const candidateProfile = Array.isArray(candidate.candidate_profiles) ? candidate.candidate_profiles[0] : (candidate.candidate_profiles || {});
              
              return (
                <div key={app.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center hover:border-indigo-300 transition-colors">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-xl shadow-md">
                    {(candidate.full_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">{candidate.full_name || 'Anonymous User'}</h4>
                      <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-full">
                        Applied for: {app.job_title}
                      </span>
                    </div>
                    
                    <div className="text-sm text-slate-500 font-medium">
                      {candidate.email}
                    </div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400 pt-1">
                      {candidateProfile?.education && (
                        <span className="flex items-center gap-1.5"><span className="font-bold text-slate-400">Edu:</span> {candidateProfile.education}</span>
                      )}
                      {candidateProfile?.experience && (
                        <span className="flex items-center gap-1.5"><span className="font-bold text-slate-400">Exp:</span> {candidateProfile.experience}</span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-400">Date:</span> {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                    {app.resume_url && (
                      <a 
                        href={app.resume_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <FileText className="h-4 w-4" /> View Resume
                      </a>
                    )}
                    <a 
                      href={`mailto:${candidate.email}`}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors text-center shadow-md shadow-indigo-500/20"
                    >
                      Contact Candidate
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
