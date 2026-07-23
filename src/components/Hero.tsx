import { Search, MapPin, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Abstract Background Gradients */}
      <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-primary-400/20 blur-3xl dark:bg-primary-600/10"></div>
      <div className="absolute top-1/3 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-600/10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text and Search Area */}
          <div className="lg:col-span-7 text-left space-y-6 animate-slide-up">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs font-semibold border border-primary-100/50 dark:border-primary-900/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Over 15,000+ new positions listed today!</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Find Your Dream <br />
              <span className="bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Internship & Job
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-600 dark:text-slate-350 max-w-xl">
              Discover thousands of internships and jobs from top companies. Accelerate your career with tools built for the modern workforce.
            </p>

            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-2 rounded-2xl sm:rounded-full shadow-xl shadow-slate-100/80 dark:shadow-none flex flex-col sm:flex-row gap-2 max-w-2xl">
              {/* Job Title Input */}
              <div className="flex-1 flex items-center gap-2 px-3 py-2">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Job Title, Skills, or Company..."
                  className="w-full bg-transparent text-slate-800 dark:text-slate-150 placeholder-slate-400 focus:outline-none text-sm font-medium"
                />
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-800 self-center"></div>

              {/* Location Input */}
              <div className="flex-1 flex items-center gap-2 px-3 py-2">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Location (e.g. Remote, City)..."
                  className="w-full bg-transparent text-slate-800 dark:text-slate-150 placeholder-slate-400 focus:outline-none text-sm font-medium"
                />
              </div>

              {/* Search Button */}
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-6 py-3 rounded-xl sm:rounded-full shadow-lg shadow-primary-600/10 hover:shadow-primary-600/25 transition-all duration-200 shrink-0">
                Search Jobs
              </button>
            </div>

            {/* Micro details */}
            <div className="flex items-center gap-6 pt-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
              <div>Popular: <span className="underline cursor-pointer hover:text-primary-500">React</span>, <span className="underline cursor-pointer hover:text-primary-500">Data Science</span>, <span className="underline cursor-pointer hover:text-primary-500">Figma</span></div>
            </div>

          </div>

          {/* Right Vector Illustration */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Decorative background shape */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/10 to-indigo-600/5 rounded-3xl -rotate-3 scale-95 -z-10 blur-sm"></div>

            {/* Premium Interactive SVG Illustration */}
            <svg
              className="w-full max-w-[450px] drop-shadow-2xl animate-float"
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Glow */}
              <circle cx="250" cy="250" r="180" fill="url(#paint0_linear_hero)" opacity="0.15" />
              
              {/* Grid Layout Representing Career Boards */}
              <rect x="80" y="100" width="340" height="280" rx="16" fill="white" stroke="#E2E8F0" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-800" strokeWidth="2" />
              
              {/* Card 1: Job Match Badge */}
              <g filter="url(#shadow-card)">
                <rect x="50" y="300" width="160" height="70" rx="12" fill="white" className="fill-white dark:fill-slate-800" />
                <circle cx="85" cy="335" r="18" fill="#E0F2FE" />
                <path d="M78 335L83 340L92 331" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="115" y="323" width="80" height="8" rx="4" fill="#38BDF8" />
                <rect x="115" y="339" width="50" height="6" rx="3" fill="#E2E8F0" className="fill-slate-200 dark:fill-slate-700" />
              </g>

              {/* Card 2: Candidate Stat Widget */}
              <g filter="url(#shadow-card)">
                <rect x="290" y="60" width="160" height="90" rx="12" fill="white" className="fill-white dark:fill-slate-800" />
                <circle cx="330" cy="105" r="20" fill="#EEF2F6" className="fill-slate-100 dark:fill-slate-700" />
                <path d="M322 113C322 108.582 325.582 105 330 105C334.418 105 338 108.582 338 113H322ZM330 101C326.686 101 324 98.3137 324 95C324 91.6863 326.686 89 330 89C333.314 89 336 91.6863 336 95C336 98.3137 333.314 101 330 101Z" fill="#64748B" className="fill-slate-400" />
                <text x="362" y="102" fill="#0F172A" className="fill-slate-800 dark:fill-white" fontSize="14" fontWeight="bold">50k+</text>
                <text x="362" y="117" fill="#64748B" className="fill-slate-400" fontSize="10">Candidates</text>
              </g>

              {/* Core Illustration Elements */}
              {/* Laptop & Workspace graphic */}
              <rect x="140" y="240" width="220" height="120" rx="8" fill="#F1F5F9" className="fill-slate-100 dark:fill-slate-800" />
              <line x1="140" y1="350" x2="360" y2="350" stroke="#CBD5E1" className="stroke-slate-350 dark:stroke-slate-750" strokeWidth="4" />
              
              {/* Floating Icons */}
              {/* Globe representing remote work */}
              <circle cx="250" cy="180" r="30" fill="url(#paint1_linear_hero)" />
              <circle cx="250" cy="180" r="20" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
              
              {/* Search bar inside SVG */}
              <rect x="110" y="130" width="280" height="30" rx="15" fill="#F8FAFC" stroke="#E2E8F0" className="fill-slate-50 dark:fill-slate-950 stroke-slate-200 dark:stroke-slate-800" />
              <circle cx="130" cy="145" r="6" stroke="#94A3B8" strokeWidth="2" />
              <line x1="134.5" y1="149.5" x2="140" y2="155" stroke="#94A3B8" strokeWidth="2" />
              <rect x="155" y="142" width="120" height="6" rx="3" fill="#E2E8F0" className="fill-slate-200 dark:fill-slate-800" />

              {/* Decorative Lines and Data Nodes */}
              <circle cx="160" cy="270" r="6" fill="#3B82F6" />
              <rect x="180" y="267" width="140" height="6" rx="3" fill="#3B82F6" opacity="0.3" />
              <circle cx="160" cy="295" r="6" fill="#10B981" />
              <rect x="180" y="292" width="100" height="6" rx="3" fill="#10B981" opacity="0.3" />
              <circle cx="160" cy="320" r="6" fill="#8B5CF6" />
              <rect x="180" y="317" width="120" height="6" rx="3" fill="#8B5CF6" opacity="0.3" />

              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="paint0_linear_hero" x1="70" y1="70" x2="430" y2="430" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient id="paint1_linear_hero" x1="220" y1="150" x2="280" y2="210" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563EB" />
                  <stop offset="1" stopColor="#4F46E5" />
                </linearGradient>
                <filter id="shadow-card" x="30" y="40" width="440" height="380" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0F172A" floodOpacity="0.08" />
                </filter>
              </defs>
            </svg>

          </div>

        </div>
      </div>
    </section>
  );
}
