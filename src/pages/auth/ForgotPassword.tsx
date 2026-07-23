import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const { error: err } = await resetPassword(email);
    setIsSubmitting(false);

    if (err) {
      setError(err);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="max-w-md mx-auto w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl shadow-xl text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8 text-primary-500" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Reset link sent!</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Check your inbox at <span className="font-bold text-slate-700 dark:text-slate-200">{email}</span>{' '}
          and click the link to reset your password.
        </p>
        <p className="text-xs text-slate-400">Didn't receive it? Check your spam folder.</p>
        <Link to="/login" className="inline-block mt-2 text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl shadow-xl transition-colors duration-300">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Forgot Password?
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter your email and we'll send you a password reset link.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium px-4 py-3 rounded-xl mb-4">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? <div className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : null}
          <span>{isSubmitting ? 'Sending…' : 'Send Reset Link'}</span>
        </button>
      </form>

      <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
        Remembered your password?{' '}
        <Link to="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">Sign in</Link>
      </div>
    </div>
  );
}
