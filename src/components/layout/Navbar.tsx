import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Menu,
  X,
  User,
  GraduationCap,
  Sparkles,
  FileText,
  Compass,
  PlusCircle,
  CreditCard,
  Building,
  LogOut,
  LayoutDashboard,
  Bookmark,
  CheckCheck,
  Loader2,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { user, role, isAuthenticated, signOut } = useAuth();
  const { notifications, unreadCount, isLoading: notifLoading, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'candidate' | 'recruiter' | 'notifications' | 'profile' | 'register' | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (menu: 'candidate' | 'recruiter' | 'notifications' | 'profile' | 'register') => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const handleLogout = async () => {
    setActiveDropdown(null);
    await signOut();
    navigate('/');
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  // Avatar fallback
  const avatarUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=3b82f6&color=fff`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/80 glass shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center" ref={dropdownRef}>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-tr from-primary-600 to-indigo-600 text-white p-2 rounded-xl flex items-center justify-center shadow-md shadow-primary-600/20 group-hover:scale-105 transition-transform duration-200">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 dark:from-primary-400 dark:via-indigo-400 dark:to-primary-300 bg-clip-text text-transparent tracking-tight">
              InternHub
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
            <Link to="/jobs" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Jobs</Link>
            <Link to="/internships" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Internships</Link>
            <Link to="/companies" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Companies</Link>

            {/* Candidate Dropdown */}
            <div className="relative">
              <button onClick={() => toggleDropdown('candidate')} className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none">
                <span>For Candidates</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'candidate' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'candidate' && (
                <div className="absolute top-full left-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl py-2 z-50 animate-slide-up">
                  <Link to="/jobs?type=fresher" onClick={() => setActiveDropdown(null)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <GraduationCap className="h-4 w-4 text-primary-500" />
                    <div><div className="font-semibold">Freshers & Students</div><div className="text-xs text-slate-400">Entry level jobs & stipends</div></div>
                  </Link>
                  <Link to="/jobs?type=experienced" onClick={() => setActiveDropdown(null)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <div><div className="font-semibold">Experienced Roles</div><div className="text-xs text-slate-400">Mid to senior positions</div></div>
                  </Link>
                  <Link to="/resources" onClick={() => setActiveDropdown(null)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    <div><div className="font-semibold">Resume Builder</div><div className="text-xs text-slate-400">ATS optimized templates</div></div>
                  </Link>
                  <Link to="/resources" onClick={() => setActiveDropdown(null)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <Compass className="h-4 w-4 text-amber-500" />
                    <div><div className="font-semibold">Career Guidance</div><div className="text-xs text-slate-400">Interview tips & guides</div></div>
                  </Link>
                </div>
              )}
            </div>

            {/* Recruiter Dropdown */}
            <div className="relative">
              <button onClick={() => toggleDropdown('recruiter')} className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none">
                <span>For Employers</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'recruiter' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'recruiter' && (
                <div className="absolute top-full left-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl py-2 z-50 animate-slide-up">
                  <Link to="/register/recruiter" onClick={() => setActiveDropdown(null)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <PlusCircle className="h-4 w-4 text-primary-500" />
                    <div><div className="font-semibold">Post a Job</div><div className="text-xs text-slate-400">Reach 50,000+ candidates</div></div>
                  </Link>
                  <Link to="/pricing" onClick={() => setActiveDropdown(null)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <CreditCard className="h-4 w-4 text-indigo-500" />
                    <div><div className="font-semibold">Pricing & Plans</div><div className="text-xs text-slate-400">Flexible hiring packages</div></div>
                  </Link>
                  <Link to="/login" onClick={() => setActiveDropdown(null)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <Building className="h-4 w-4 text-emerald-500" />
                    <div><div className="font-semibold">Employer Login</div><div className="text-xs text-slate-400">Access recruiter dashboard</div></div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Icons & User Controls */}
          <div className="hidden lg:flex items-center gap-3">

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
              title="Toggle Light / Dark Theme"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
            </button>

            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('notifications')}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 text-[9px] font-black text-white flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {activeDropdown === 'notifications' && (
                  <div className="absolute top-full right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl py-3 z-50 animate-slide-up">
                    <div className="px-4 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Notifications
                        {unreadCount > 0 && (
                          <span className="ml-2 px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[9px] font-black">{unreadCount}</span>
                        )}
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800/50 max-h-72 overflow-y-auto">
                      {notifLoading ? (
                        <div className="py-8 flex justify-center">
                          <Loader2 className="h-5 w-5 text-primary-500 animate-spin" />
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="py-10 text-center text-sm text-slate-400 dark:text-slate-500">
                          <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          No notifications
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!n.read ? 'border-l-2 border-primary-500' : ''}`}
                          >
                            <div className={`text-xs font-semibold ${n.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>{n.title}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile or Guest Login/Register */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('profile')}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <img
                    src={avatarUrl}
                    alt={user.fullName}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {activeDropdown === 'profile' && (
                  <div className="absolute top-full right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl py-2 z-50 animate-slide-up">
                    {/* Profile Header */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                      <img src={avatarUrl} alt={user.fullName} className="h-10 w-10 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white text-sm truncate">{user.fullName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
                          {role}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link to="/dashboard" onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        <LayoutDashboard className="h-4 w-4 text-primary-500" /><span>Dashboard</span>
                      </Link>
                      <Link to="/dashboard/profile" onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        <User className="h-4 w-4 text-indigo-500" /><span>My Profile</span>
                      </Link>
                      {role === 'candidate' && (
                        <Link to="/dashboard/saved" onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                          <Bookmark className="h-4 w-4 text-emerald-500" /><span>Saved Jobs</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /><span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-semibold px-3 py-2 transition-colors"
                >
                  Login
                </Link>

                {/* Register Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('register')}
                    className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md shadow-primary-600/20 hover:shadow-primary-600/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1.5"
                  >
                    <span>Register</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  {activeDropdown === 'register' && (
                    <div className="absolute top-full right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl py-2 z-50 animate-slide-up">
                      <Link to="/register/candidate" onClick={() => setActiveDropdown(null)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        <User className="h-4 w-4 text-primary-500" /><span>Candidate Sign Up</span>
                      </Link>
                      <Link to="/register/recruiter" onClick={() => setActiveDropdown(null)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        <Briefcase className="h-4 w-4 text-indigo-500" /><span>Recruiter Sign Up</span>
                      </Link>
                      <Link to="/register/company" onClick={() => setActiveDropdown(null)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        <Building className="h-4 w-4 text-emerald-500" /><span>Company Sign Up</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle Theme">
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
            {isAuthenticated && (
              <button onClick={() => toggleDropdown('notifications')} className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 text-[8px] font-black text-white flex items-center justify-center">{unreadCount}</span>}
              </button>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle Mobile Menu">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass border-t border-slate-200/50 dark:border-slate-800/50 animate-slide-up px-4 pt-3 pb-6 space-y-4">
          <div className="space-y-1 font-medium text-slate-700 dark:text-slate-200">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-primary-50 dark:hover:bg-slate-800 hover:text-primary-600 transition-colors">Home</Link>
            <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-primary-50 dark:hover:bg-slate-800 hover:text-primary-600 transition-colors">Jobs</Link>
            <Link to="/internships" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-primary-50 dark:hover:bg-slate-800 hover:text-primary-600 transition-colors">Internships</Link>
            <Link to="/companies" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-primary-50 dark:hover:bg-slate-800 hover:text-primary-600 transition-colors">Companies</Link>
            <Link to="/resources" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-primary-50 dark:hover:bg-slate-800 hover:text-primary-600 transition-colors">Career Resources</Link>
          </div>

          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full block text-center py-2.5 rounded-xl bg-primary-600 text-white font-semibold">Go to Dashboard</Link>
                <button onClick={handleLogout} className="w-full block text-center py-2.5 rounded-xl border border-rose-200 dark:border-rose-800 font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full block text-center py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Login</Link>
                <Link to="/register/candidate" onClick={() => setMobileMenuOpen(false)} className="w-full block text-center py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold shadow-md shadow-primary-600/20 transition-all">Register Candidate</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
