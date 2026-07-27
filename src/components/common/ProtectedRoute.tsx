import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types/portal.types';

interface ProtectedRouteProps {
  /** If specified, only these roles may access the route */
  allowedRoles?: UserRole[];
}

/** Spinner shown while auth state is loading */
function AuthLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Checking session…</p>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role, user, isLoading } = useAuth();
  const location = useLocation();

  // Wait for Supabase session to be resolved
  if (isLoading) return <AuthLoader />;

  // Not logged in → send to login, preserving intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If they are logged in but profile is not complete, and they are NOT on the wizard page, force them to the wizard.
  if (user && !user.profileCompleted && !location.pathname.startsWith('/wizard')) {
    return <Navigate to={`/wizard/${role}`} replace />;
  }

  // Role-restricted route: redirect to their own dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
