import React from 'react';
import { MapPin, DollarSign, Clock, Bookmark, Sparkles } from 'lucide-react';
import type { Job } from '../../types/portal.types';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
}

export default function JobCard({ job, onApply, onSave }: JobCardProps) {
  return (
    <div className="group bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
      
      {job.featured && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
          <Sparkles className="h-3 w-3" />
          <span>Featured</span>
        </div>
      )}

      <div>
        {/* Company Logo & Work Mode */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-xl ${job.companyLogoBg} text-white font-black text-lg flex items-center justify-center shadow-md shrink-0`}>
              {job.companyLogoText}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {job.companyName}
              </p>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
            job.workMode === 'Remote' 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/40'
              : job.workMode === 'Hybrid'
              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/40'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40'
          }`}>
            {job.workMode}
          </span>
        </div>

        {/* Location & Salary */}
        <div className="space-y-2 mb-4 text-slate-600 dark:text-slate-300 text-xs font-medium">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500 shrink-0" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{job.salary}</span>
          </div>
        </div>

        {/* Skill Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs">
          <Clock className="h-3.5 w-3.5" />
          <span>{job.postedTime}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSave && onSave(job.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Save Job"
          >
            <Bookmark className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onApply && onApply(job.id)}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:shadow-md hover:shadow-primary-600/20 transition-all"
          >
            Apply Now
          </button>
        </div>
      </div>

    </div>
  );
}
