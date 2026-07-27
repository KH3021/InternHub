import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import JobsPage from './pages/public/JobsPage';
import InternshipsPage from './pages/public/InternshipsPage';
import CompaniesPage from './pages/public/CompaniesPage';
import ResourcesPage from './pages/public/ResourcesPage';
import PricingPage from './pages/public/PricingPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Auth Pages
import Login from './pages/auth/Login';
import RegisterCandidate from './pages/auth/RegisterCandidate';
import RegisterRecruiter from './pages/auth/RegisterRecruiter';
import RegisterCompany from './pages/auth/RegisterCompany';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Wizards
import CandidateWizard from './pages/wizard/CandidateWizard';
import RecruiterWizard from './pages/wizard/RecruiterWizard';

// Dashboards
import CandidateDashboard from './pages/dashboards/CandidateDashboard';
import RecruiterDashboard from './pages/dashboards/RecruiterDashboard';
import CompanyDashboard from './pages/dashboards/CompanyDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

// Dashboard Router
function DashboardRouter() {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  switch (role) {
    case 'candidate':
      return <CandidateDashboard />;

    case 'recruiter':
      return <RecruiterDashboard />;

    case 'company':
      return <CompanyDashboard />;

    case 'admin':
      return <AdminDashboard />;

    default:
      return <Navigate to="/login" replace />;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* Global Theme Wrapper */}
        <div
          className="
            min-h-screen
            bg-white
            text-slate-900
            dark:bg-[#050816]
            dark:text-white
            transition-colors
            duration-500
          "
        >
          <BrowserRouter>
            <Routes>

              {/* Public */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/internships" element={<InternshipsPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
              </Route>

              {/* Authentication */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register/candidate" element={<RegisterCandidate />} />
                <Route path="/register/recruiter" element={<RegisterRecruiter />} />
                <Route path="/register/company" element={<RegisterCompany />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/wizard/candidate" element={<CandidateWizard />} />
                <Route path="/wizard/recruiter" element={<RecruiterWizard />} />
              </Route>

              {/* Dashboard */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardRouter />} />
                  <Route path="/dashboard/*" element={<DashboardRouter />} />
                </Route>
              </Route>

              {/* 404 */}
              <Route element={<PublicLayout />}>
                <Route path="*" element={<NotFoundPage />} />
              </Route>

            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}