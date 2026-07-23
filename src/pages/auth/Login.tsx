import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  Phone,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    signIn,
    signInWithPhone,
    sendOtp,
    verifyOtp,
    signInWithOAuthProvider,
    verifyMfa,
  } = useAuth();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  // Login Mode: 'password' | 'otp'
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  // Login Method: 'email' | 'phone'
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  // Fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  // States
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Password Login Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');

    if (!captchaVerified) {
      setError('Please complete the CAPTCHA security check.');
      return;
    }

    setIsSubmitting(true);
    let res: { error: string | null };

    if (loginMethod === 'email') {
      res = await signIn(email, password);
    } else {
      res = await signInWithPhone(phone, password);
    }

    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    // Optional 2FA check step demonstration
    setShowMfaModal(true);
  };

  // Send OTP
  const handleSendOtp = async () => {
    setError('');
    const target = loginMethod === 'email' ? email : phone;
    if (!target) {
      setError(`Please enter your ${loginMethod === 'email' ? 'email address' : 'mobile number'}.`);
      return;
    }

    setIsSubmitting(true);
    const { error: err } = await sendOtp(target, loginMethod === 'phone');
    setIsSubmitting(false);

    if (err) {
      setError(err);
      return;
    }

    setOtpSent(true);
    setInfoMsg(`OTP code sent to ${target}. (Demo OTP code: 123456)`);
  };

  // Verify OTP Submit
  const handleOtpVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');

    const target = loginMethod === 'email' ? email : phone;
    setIsSubmitting(true);
    const { error: err } = await verifyOtp(target, otpCode, loginMethod === 'phone');
    setIsSubmitting(false);

    if (err) {
      setError(err);
      return;
    }

    navigate(from, { replace: true });
  };

  // Handle Social Login (Google, LinkedIn, GitHub, Microsoft)
  const handleOAuthLogin = async (provider: 'google' | 'github' | 'linkedin_oidc' | 'azure') => {
    setError('');
    const { error: err } = await signInWithOAuthProvider(provider);
    if (err) setError(err);
  };

  // Complete MFA
  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error: err } = await verifyMfa(mfaCode);
    if (err) {
      setError(err);
      return;
    }
    setShowMfaModal(false);
    navigate(from, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl shadow-xl transition-colors duration-300 relative">

      {/* Header Title */}
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome Back to InternHub
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sign in to access your portal, applications, and recommendations.
        </p>
      </div>

      {/* Login Mode Toggle: Password vs OTP */}
      <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4 text-xs font-bold">
        <button
          type="button"
          onClick={() => { setLoginMode('password'); setError(''); }}
          className={`py-2 rounded-lg transition-all ${loginMode === 'password' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Password Login
        </button>
        <button
          type="button"
          onClick={() => { setLoginMode('otp'); setError(''); }}
          className={`py-2 rounded-lg transition-all ${loginMode === 'otp' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Mobile / Email OTP
        </button>
      </div>

      {/* Login Method Toggle: Email vs Mobile Phone */}
      <div className="flex justify-center gap-4 mb-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="radio"
            name="method"
            checked={loginMethod === 'email'}
            onChange={() => setLoginMethod('email')}
            className="text-primary-600 focus:ring-primary-500"
          />
          <span>Email Address</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="radio"
            name="method"
            checked={loginMethod === 'phone'}
            onChange={() => setLoginMethod('phone')}
            className="text-primary-600 focus:ring-primary-500"
          />
          <span>Mobile Phone</span>
        </label>
      </div>

      {/* Error & Info Alerts */}
      {error && (
        <div className="flex items-start gap-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium px-4 py-3 rounded-xl mb-4">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {infoMsg && (
        <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-medium px-4 py-3 rounded-xl mb-4">
          <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{infoMsg}</span>
        </div>
      )}

      {/* ── PASSWORD LOGIN FORM ───────────────────────────────────────────── */}
      {loginMode === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {loginMethod === 'email' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
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
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 000 0000"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-11 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & CAPTCHA */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span>Remember Me</span>
              </label>
            </div>

            {/* CAPTCHA Widget */}
            <div
              onClick={() => setCaptchaVerified((prev) => !prev)}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                captchaVerified
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-primary-500'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-semibold">
                <div className={`h-5 w-5 rounded border flex items-center justify-center ${captchaVerified ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-400'}`}>
                  {captchaVerified && <CheckCircle2 className="h-4 w-4" />}
                </div>
                <span>I'm not a robot (CAPTCHA)</span>
              </div>
              <ShieldCheck className="h-5 w-5 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-primary-600/20 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            <span>{isSubmitting ? 'Signing in…' : 'Sign In'}</span>
          </button>
        </form>
      )}

      {/* ── OTP LOGIN FORM ────────────────────────────────────────────────── */}
      {loginMode === 'otp' && (
        <div className="space-y-4">
          {loginMethod === 'email' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Mobile Number</label>
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
          )}

          {!otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? <div className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : <KeyRound className="h-4 w-4" />}
              <span>Send OTP Code</span>
            </button>
          ) : (
            <form onSubmit={handleOtpVerifySubmit} className="space-y-4 animate-slide-up">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-center tracking-widest text-lg font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <div className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : <LogIn className="h-4 w-4" />}
                <span>Verify OTP & Sign In</span>
              </button>

              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full text-xs font-bold text-slate-500 hover:text-primary-600 text-center"
              >
                Resend OTP Code
              </button>
            </form>
          )}
        </div>
      )}

      {/* ── SOCIAL LOGINS (Google, LinkedIn, GitHub, Microsoft with Brand SVG Icons) ───────────── */}
      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center space-y-3">
        <div className="text-xs text-slate-400 font-medium">Or continue with</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Google Button */}
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm"
            title="Sign in with Google"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google</span>
          </button>

          {/* LinkedIn Button */}
          <button
            type="button"
            onClick={() => handleOAuthLogin('linkedin_oidc')}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm"
            title="Sign in with LinkedIn"
          >
            <svg className="h-4 w-4 shrink-0 fill-[#0A66C2]" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            <span>LinkedIn</span>
          </button>

          {/* GitHub Button */}
          <button
            type="button"
            onClick={() => handleOAuthLogin('github')}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm"
            title="Sign in with GitHub"
          >
            <svg className="h-4 w-4 shrink-0 fill-slate-900 dark:fill-white" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span>GitHub</span>
          </button>

          {/* Microsoft Button */}
          <button
            type="button"
            onClick={() => handleOAuthLogin('azure')}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm"
            title="Sign in with Microsoft"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H12z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H12z"/>
            </svg>
            <span>Microsoft</span>
          </button>
        </div>
      </div>

      {/* Sign Up Redirect */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <div>Don't have an account?</div>
        <div className="flex items-center justify-center gap-3 pt-1">
          <Link to="/register/candidate" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
            Join Candidate
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link to="/register/recruiter" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            Join Recruiter
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link to="/register/company" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            Company
          </Link>
        </div>
      </div>

      {/* ── MFA MODAL (OPTIONAL 2FA CHECK STEP) ─────────────────────────── */}
      {showMfaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Multi-Factor Authentication</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter the 6-digit code from your authenticator app (Demo code: 123456).
            </p>
            <form onSubmit={handleMfaSubmit} className="space-y-3">
              <input
                type="text"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-center text-lg tracking-widest font-extrabold text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md"
              >
                Verify & Continue
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
