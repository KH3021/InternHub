import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/jobs?q=${encodeURIComponent(query)}&loc=${encodeURIComponent(location)}`);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl dark:bg-primary-600/10"></div>
      <div className="absolute top-1/3 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-600/10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text and Search Form */}
          <div className="lg:col-span-7 text-left space-y-6 animate-slide-up">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 text-xs font-bold border border-primary-200/60 dark:border-primary-900/50 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary-500" />
              <span>Over 15,000+ new opportunities added today!</span>
            </div>

            {/* Hero Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Find Your Dream <br />
              <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 dark:from-primary-400 dark:via-indigo-400 dark:to-primary-300 bg-clip-text text-transparent">
                Internship & Job
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Discover verified internships and full-time positions from top global companies. Accelerated with AI recommendations and automated ATS resume tools.
            </p>

            {/* Multi-Input Search Box */}
            <form onSubmit={handleSearch} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-2.5 rounded-2xl sm:rounded-full shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col sm:flex-row gap-2 max-w-2xl">
              {/* Job Input */}
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2">
                <Search className="h-5 w-5 text-primary-500 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Job title, skills, or company..."
                  className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
                />
              </div>

              <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-800 self-center"></div>

              {/* Location Input */}
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2">
                <MapPin className="h-5 w-5 text-indigo-500 shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location or 'Remote'..."
                  className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold text-sm px-7 py-3.5 rounded-xl sm:rounded-full shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 hover:-translate-y-0.5 transition-all duration-200 shrink-0 flex items-center justify-center gap-2"
              >
                <span>Search</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Popular Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Popular:</span>
              {['React Engineer', 'Data Science', 'UI/UX Design', 'Full Stack', 'Remote Internship'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/jobs?q=${encodeURIComponent(tag)}`)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Micro Highlights */}
            <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Verified Employers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>1-Click Apply</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-primary-500" />
                <span>Direct HR Contact</span>
              </div>
            </div>

          </div>

          {/* Right Vector Graphics */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/10 to-indigo-600/10 rounded-3xl -rotate-3 scale-95 -z-10 blur-md"></div>

            <svg
              className="w-full max-w-[460px] drop-shadow-2xl animate-float"
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="250" cy="250" r="190" fill="url(#paint0_linear_hero)" opacity="0.15" />
              
              <rect x="70" y="90" width="360" height="300" rx="20" fill="#FFFFFF" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-800" strokeWidth="2" />
              
              {/* Job Card Widget Overlay */}
              <g filter="url(#shadow-card)">
                <rect x="40" y="310" width="180" height="75" rx="14" fill="#FFFFFF" className="fill-white dark:fill-slate-800" />
                <circle cx="75" cy="348" r="20" fill="#E0F2FE" />
                <path d="M67 348L73 354L84 343" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="105" y="335" width="90" height="9" rx="4" fill="#38BDF8" />
                <rect x="105" y="352" width="60" height="7" rx="3" fill="#CBD5E1" className="fill-slate-300 dark:fill-slate-600" />
              </g>

              {/* Stats Card Overlay */}
              <g filter="url(#shadow-card)">
                <rect x="280" y="50" width="180" height="95" rx="14" fill="#FFFFFF" className="fill-white dark:fill-slate-800" />
                <circle cx="320" cy="98" r="22" fill="#EEF2F6" className="fill-slate-100 dark:fill-slate-700" />
                <path d="M312 106C312 101.582 315.582 98 320 98C324.418 98 328 101.582 328 106H312ZM320 94C316.686 94 314 91.3137 314 88C314 84.6863 316.686 82 320 82C323.314 82 326 84.6863 326 88C326 91.3137 323.314 94 320 94Z" fill="#3B82F6" />
                <text x="355" y="95" fill="#0F172A" className="fill-slate-900 dark:fill-white" fontSize="16" fontWeight="bold">50,000+</text>
                <text x="355" y="112" fill="#64748B" className="fill-slate-400" fontSize="11">Candidates Hired</text>
              </g>

              {/* Core Graphics */}
              <rect x="130" y="230" width="240" height="130" rx="10" fill="#F1F5F9" className="fill-slate-100 dark:fill-slate-800" />
              <line x1="130" y1="350" x2="370" y2="350" stroke="#94A3B8" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="4" />
              
              <circle cx="250" cy="170" r="32" fill="url(#paint1_linear_hero)" />
              <circle cx="250" cy="170" r="22" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
              
              <rect x="100" y="120" width="300" height="32" rx="16" fill="#F8FAFC" className="fill-slate-50 dark:fill-slate-950 stroke-slate-200 dark:stroke-slate-800" />
              <circle cx="122" cy="136" r="7" stroke="#3B82F6" strokeWidth="2" />
              <line x1="127" y1="141" x2="133" y2="147" stroke="#3B82F6" strokeWidth="2" />
              <rect x="145" y="133" width="140" height="7" rx="3" fill="#E2E8F0" className="fill-slate-300 dark:fill-slate-700" />

              <defs>
                <linearGradient id="paint0_linear_hero" x1="60" y1="60" x2="440" y2="440" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563EB" />
                  <stop offset="1" stopColor="#4F46E5" />
                </linearGradient>
                <linearGradient id="paint1_linear_hero" x1="218" y1="138" x2="282" y2="202" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
                <filter id="shadow-card" x="20" y="30" width="460" height="400" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#0F172A" floodOpacity="0.1" />
                </filter>
              </defs>
            </svg>

          </div>

        </div>
      </div>
    </section>
  );
}
