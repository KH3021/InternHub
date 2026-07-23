import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Briefcase,
  Sun,
  Moon,
  Bell,
  LayoutDashboard,
  FileText,
  Bookmark,
  User,
  PlusCircle,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Building,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/portal.types';
import WelcomeTour from '../components/common/WelcomeTour';

export default function DashboardLayout() {
  const { isDark, toggleTheme } = useTheme();
  const { user, role, signOut, triggerWelcomeTour } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getSidebarNavItems = (userRole: UserRole) => {
    switch (userRole) {
      case 'candidate':
        return [
          { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
          { label: 'My Applications', href: '/dashboard/applications', icon: FileText },
          { label: 'Saved Jobs', href: '/dashboard/saved', icon: Bookmark },
          { label: 'Profile & Resume', href: '/dashboard/profile', icon: User },
        ];
      case 'recruiter':
        return [
          { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Post New Role', href: '/dashboard/post-job', icon: PlusCircle },
          { label: 'Applicant Pool', href: '/dashboard/applicants', icon: Users },
          { label: 'Company Info', href: '/dashboard/company', icon: Building },
        ];
      case 'company':
        return [
          { label: 'Company Overview', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Active Postings', href: '/dashboard/jobs', icon: Briefcase },
          { label: 'Team Members', href: '/dashboard/team', icon: Users },
          { label: 'Billing & Plans', href: '/pricing', icon: Settings },
        ];
      case 'admin':
        return [
          { label: 'Admin Portal', href: '/dashboard', icon: ShieldAlert },
          { label: 'User Management', href: '/dashboard/users', icon: Users },
          { label: 'Job Moderation', href: '/dashboard/jobs-admin', icon: Briefcase },
          { label: 'System Analytics', href: '/dashboard/analytics', icon: LayoutDashboard },
        ];
      default:
        return [
          { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        ];
    }
  };

  const navItems = getSidebarNavItems(role);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-300">
      
      {/* Interactive Welcome Tour Popup */}
      <WelcomeTour />

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 p-4 space-y-6 fixed inset-y-0 z-30">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 px-2">
          <div className="bg-gradient-to-tr from-primary-600 to-indigo-600 text-white p-2 rounded-xl flex items-center justify-center shadow-md">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
            InternHub
          </span>
        </Link>

        {/* User Role Card */}
        <div className="px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
          <img
            src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=3b82f6&color=fff`}
            alt={user?.fullName || 'User'}
            className="h-10 w-10 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold truncate text-slate-900 dark:text-white">{user?.fullName || 'Guest User'}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">{role}</div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Sidebar Actions */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
          <button
            onClick={triggerWelcomeTour}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <HelpCircle className="h-4 w-4 text-primary-500" />
            <span>Welcome Tour</span>
          </button>

          <Link
            to="/"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span>&larr; Back to Portal</span>
          </Link>

          <button
            onClick={async () => { await signOut(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64">
        
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white capitalize">
              {role} Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 flex-1">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
