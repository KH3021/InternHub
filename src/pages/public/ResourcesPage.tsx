import React from 'react';
import { FileText, Compass, BookOpen, Sparkles } from 'lucide-react';

export default function ResourcesPage() {
  const guides = [
    { title: 'ATS-Friendly Resume Template Guide', category: 'Resume', icon: FileText },
    { title: 'Acing Technical System Design Interviews', category: 'Interview', icon: Compass },
    { title: 'How to Negotiate Internship Stipends', category: 'Career', icon: BookOpen },
    { title: 'Top 50 Frontend & Full Stack Interview Questions', category: 'Prep', icon: Sparkles }
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Career Resources & Resume Builder</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Expert guides, ATS resume tools, and interview preparation blueprints.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((g, idx) => {
          const Icon = g.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-600 dark:text-primary-400">{g.category}</span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{g.title}</h3>
                <p className="text-xs text-slate-500">Read our comprehensive guide to boost your response rate from recruiters by 3x.</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
