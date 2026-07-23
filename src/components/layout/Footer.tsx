import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="bg-gradient-to-tr from-primary-600 to-indigo-600 text-white p-2 rounded-xl flex items-center justify-center shadow-md">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                InternHub
              </span>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              InternHub is a next-generation career portal bridging students, fresh graduates, and experienced engineers with verified employers globally using AI job matching and ATS resume tools.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-primary-600 text-slate-300 hover:text-white flex items-center justify-center transition-all" aria-label="LinkedIn">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="#" className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-primary-600 text-slate-300 hover:text-white flex items-center justify-center transition-all" aria-label="Twitter">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-primary-600 text-slate-300 hover:text-white flex items-center justify-center transition-all" aria-label="GitHub">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
              <a href="#" className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-primary-600 text-slate-300 hover:text-white flex items-center justify-center transition-all" aria-label="YouTube">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 1: Candidates */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">For Job Seekers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Browse All Jobs</Link></li>
              <li><Link to="/internships" className="hover:text-white transition-colors">Explore Paid Internships</Link></li>
              <li><Link to="/jobs?type=fresher" className="hover:text-white transition-colors">Fresher Roles</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Resume Builder</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Career Guidance</Link></li>
            </ul>
          </div>

          {/* Column 2: Employers */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">For Recruiters</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register/recruiter" className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link to="/companies" className="hover:text-white transition-colors">Company Directory</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Hiring Pricing Plans</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Recruiter Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">Contact & Office</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                <span>100 Tech Plaza, San Francisco, CA</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-500 shrink-0" />
                <a href="mailto:support@internhub.com" className="hover:text-white transition-colors">support@internhub.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>+1 (800) 456-7890</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <span>&copy; {currentYear} InternHub Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Preferences</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
