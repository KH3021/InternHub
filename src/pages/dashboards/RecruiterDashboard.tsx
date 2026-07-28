import { Routes, Route } from 'react-router-dom';
import RecruiterOverview from './recruiter/RecruiterOverview';
import PostJobPage from './recruiter/PostJobPage';
import ApplicantPoolPage from './recruiter/ApplicantPoolPage';
import CompanyInfoPage from './recruiter/CompanyInfoPage';

export default function RecruiterDashboard() {
  return (
    <Routes>
      <Route path="/" element={<RecruiterOverview />} />
      <Route path="/post-job" element={<PostJobPage />} />
      <Route path="/applicants" element={<ApplicantPoolPage />} />
      <Route path="/company" element={<CompanyInfoPage />} />
    </Routes>
  );
}
