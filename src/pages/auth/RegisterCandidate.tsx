import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/supabaseApi';

export default function RegisterCandidate() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);

    // Explicit database check for duplicates as requested
    const dupCheck = await userService.checkDuplicateUser(email, phone);
    if (dupCheck.isDuplicate) {
      setIsSubmitting(false);
      setError(dupCheck.message || 'An account with this email or mobile number already exists.');
      return;
    }

    const { error: err, emailSent: sent } = await signUp({
      email,
      password,
      fullName,
      role: 'candidate',
      phone,
    });
    setIsSubmitting(false);

    if (err) {
      setError(typeof err === 'string' ? err : (err as any)?.message || 'An error occurred during registration.');
      return;
    }

    if (sent) {
      setEmailSent(true);
    } else {
      navigate('/wizard/candidate');
    }
  };

  if (emailSent) {
    return (
      <div className="max-w-md mx-auto w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl shadow-xl text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Check your inbox!</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          We sent a verification email to <span className="font-bold text-slate-700 dark:text-slate-200">{email}</span>.
          Click the link to activate your candidate account.
        </p>
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
          Create Candidate Account
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Join 50,000+ candidates finding their dream roles.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium px-4 py-3 rounded-xl mb-4">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{typeof error === 'string' ? error : String(error)}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alex Johnson"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

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

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Mobile Phone (optional)</label>
          <div className="relative">
            <Phone className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 000 0000"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-11 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-primary-600/20 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isSubmitting ? <div className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : null}
          <span>{isSubmitting ? 'Creating account…' : 'Create Account'}</span>
        </button>
      </form>

      <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
