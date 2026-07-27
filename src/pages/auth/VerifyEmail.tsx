import React from 'react';
import { Link } from 'react-router-dom';
import { MailOpen } from 'lucide-react';

export default function VerifyEmail() {
  return (
    <div className="max-w-md mx-auto w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl shadow-xl text-center space-y-6">
      <div className="h-20 w-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-2">
        <MailOpen className="h-10 w-10 text-emerald-500" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Profile Saved Locally!</h2>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Just one more step...</h3>
      </div>
      
      <p className="text-sm text-slate-500 dark:text-slate-400">
        We've saved your candidate profile, but we need to verify your email before we can publish it to InternHub.
      </p>
      
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-left">
        <ol className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-bold text-xs mt-0.5">1</span>
            <span>Check your email inbox (and spam folder) for a message from InternHub.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-bold text-xs mt-0.5">2</span>
            <span>Click the verification link in the email.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-bold text-xs mt-0.5">3</span>
            <span>Your profile will be automatically synced and you'll be taken to your dashboard!</span>
          </li>
        </ol>
      </div>

      <Link 
        to="/login" 
        className="inline-block mt-4 text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline"
      >
        Back to Login
      </Link>
    </div>
  );
}
