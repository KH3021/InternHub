import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Bookmark, FileText, CheckCircle2, Clock, Download, ExternalLink, MapPin, GraduationCap, Code2, PlusCircle, Upload, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { applicationService, jobService, profileService } from '../../services/supabaseApi';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;
  const [applications, setApplications] = useState<any[]>([]);
  const [candidateProfile, setCandidateProfile] = useState<any>(null);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Resume State
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState('');

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      Promise.all([
        applicationService.getCandidateApplications(user.id),
        jobService.getSavedJobs(user.id),
        profileService.getCandidateProfile(user.id),
      ]).then(([appsData, savedJobsData, profileData]) => {
        setApplications(appsData);
        setSavedJobs(savedJobsData);
        setCandidateProfile(profileData);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length;
  const savedCount = savedJobs.length;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    
    if (file.size > 500 * 1024) {
      setResumeError(`File exceeds 500 KB limit.`);
      return;
    }
    
    setResumeError('');
    setIsUploadingResume(true);
    
    const { url, error } = await profileService.uploadResume(user.id, file);
    if (error) {
      setResumeError(error);
    } else if (url) {
      await profileService.saveProfile(user.id, { resumeUrl: url });
      setCandidateProfile({ ...candidateProfile, resumeUrl: url });
    }
    setIsUploadingResume(false);
  };

  const handleDeleteResume = async () => {
    if (!user?.id || !candidateProfile?.resumeUrl) return;
    
    if (window.confirm('Are you sure you want to delete your resume?')) {
      setIsUploadingResume(true);
      await profileService.deleteResume(user.id, candidateProfile.resumeUrl);
      setCandidateProfile({ ...candidateProfile, resumeUrl: '' });
      setIsUploadingResume(false);
    }
  };

  // Helper to resolve job title & company for application
  const getJobDetailsForApp = (app: any) => {
    // If populated via Supabase JOIN
    if (app.jobs?.title) {
      return {
        title: app.jobs.title,
        company: app.jobs.companies?.name || app.jobs.company_name || 'Company',
      };
    }

    return {
      title: 'Full-Time Software Engineer',
      company: 'Enterprise Partner',
    };
  };

  return (
    <div className="space-y-6">
      
      {(path === '/dashboard' || path === '/dashboard/profile') && (
        <>
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="max-w-xl space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black">
            Welcome back, {candidateProfile?.fullName || user?.fullName || 'Candidate'}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-primary-100 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {candidateProfile?.education || 'B.Tech Computer Science'}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {candidateProfile?.location || 'Remote'}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/wizard/candidate"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Update Profile</span>
          </Link>
          {candidateProfile?.resumeUrl && (
            <a
              href={candidateProfile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-white text-primary-700 hover:bg-primary-50 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 shadow-md"
            >
              <Download className="h-4 w-4" />
              <span>Resume PDF</span>
            </a>
          )}
        </div>
      </div>

      {/* Primary Technical Skills Card */}
      {candidateProfile?.skills && candidateProfile.skills.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
            <Code2 className="h-4 w-4 text-primary-500" />
            <span>Your Technical Skills:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidateProfile.skills.map((skill: string) => (
              <span key={skill} className="px-3 py-1 bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-bold rounded-lg">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

        </>
      )}

      {path === '/dashboard/profile' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Resume Management</h3>
          
          {candidateProfile?.resumeUrl ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl gap-4">
               <div className="flex items-center gap-3">
                 <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center rounded-xl shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                 </div>
                 <div>
                   <div className="text-sm font-bold text-emerald-800 dark:text-emerald-200">Resume Uploaded Successfully</div>
                   <a href={candidateProfile.resumeUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 mt-0.5">
                     <span>View Current Resume</span>
                     <ExternalLink className="h-3 w-3" />
                   </a>
                 </div>
               </div>
               <button onClick={handleDeleteResume} disabled={isUploadingResume} className="px-4 py-2 bg-white dark:bg-slate-800 text-rose-600 border border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50">
                 {isUploadingResume ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                 <span>Delete Resume</span>
               </button>
            </div>
          ) : (
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-center border-dashed">
               <Upload className="h-10 w-10 mx-auto text-primary-400 mb-3" />
               <div className="text-sm font-bold text-slate-700 dark:text-slate-300">You haven't uploaded a resume yet!</div>
               <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto mb-5 mt-1">Upload your CV to increase your chances of being shortlisted by recruiters.</p>
               
               <input type="file" id="dashboardResume" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
               <label htmlFor="dashboardResume" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl cursor-pointer shadow-md transition-colors">
                 {isUploadingResume ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                 <span>{isUploadingResume ? 'Uploading...' : 'Browse File to Upload'}</span>
               </label>
               {resumeError && (
                 <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-rose-500">
                   <AlertCircle className="h-4 w-4" />
                   <span>{resumeError}</span>
                 </div>
               )}
            </div>
          )}
        </div>
      )}

      {path === '/dashboard' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{applications.length}</div>
            <div className="text-xs text-slate-500 font-semibold">Applied Jobs</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{shortlistedCount}</div>
            <div className="text-xs text-slate-500 font-semibold">Shortlisted</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Bookmark className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{savedCount}</div>
            <div className="text-xs text-slate-500 font-semibold">Saved Roles</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">95%</div>
            <div className="text-xs text-slate-500 font-semibold">Match Score</div>
          </div>
        </div>
      </div>

        </>
      )}

      {(path === '/dashboard' || path === '/dashboard/applications') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          {/* Applications List Table */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">My Submitted Applications</h3>
          <Link to="/jobs" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
            <span>Browse More Jobs</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No applications submitted yet</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse our full-time jobs and internships pages to submit your application directly to employers.
            </p>
            <Link
              to="/jobs"
              className="inline-block px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Explore Jobs Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="pb-3 px-2">Job / Internship</th>
                  <th className="pb-3 px-2">Company</th>
                  <th className="pb-3 px-2">Date Applied</th>
                  <th className="pb-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {applications.map((app) => {
                  const details = getJobDetailsForApp(app);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-2 font-bold text-slate-900 dark:text-white">{details.title}</td>
                      <td className="py-3.5 px-2">{details.company}</td>
                      <td className="py-3.5 px-2 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {new Date(app.created_at || app.applied_at || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          app.status === 'shortlisted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300' :
                          app.status === 'reviewing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300' :
                          'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200'
                        }`}>
                          {app.status || 'Applied'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {path === '/dashboard/saved' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">My Saved Jobs</h3>
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-bold rounded-full">{savedCount} Total</span>
          </div>
          
          {savedJobs.length === 0 ? (
             <div className="text-center py-10 space-y-3">
               <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                 <Bookmark className="h-6 w-6" />
               </div>
               <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No saved jobs yet</div>
               <p className="text-xs text-slate-500 max-w-sm mx-auto">
                 Browse our jobs and internships and click the bookmark icon to save them for later.
               </p>
               <Link to="/jobs" className="mt-2 inline-block px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition-all">
                 Browse More Jobs
               </Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedJobs.map((saved: any) => {
                const job = saved.jobs;
                if (!job) return null;
                const companyName = job.companies?.name || job.company_name || 'Company';
                return (
                  <Link key={saved.id} to={`/jobs/${job.id}`} className="block p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary-500 transition-colors shadow-sm relative group">
                    <div className="absolute top-4 right-4 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                    <div className="flex justify-between items-start mb-2 pr-6">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{job.title}</h4>
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mb-3">{companyName}</div>
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                       <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md truncate max-w-[120px]">{job.location || 'Remote'}</span>
                       <span className="text-emerald-600 dark:text-emerald-400 truncate">{job.salary || 'Competitive'}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
