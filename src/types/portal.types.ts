export type UserRole = 'guest' | 'candidate' | 'recruiter' | 'company' | 'admin';

export type CandidateType = 'student' | 'fresher' | 'experienced';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export type JobType = 'job' | 'internship';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  candidateType?: CandidateType;
  companyId?: string;
  profileCompleted: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  count: number;
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyLogoBg: string;
  companyLogoText: string;
  location: string;
  salary: string;
  workMode: WorkMode;
  tags: string[];
  postedTime: string;
  featured?: boolean;
}

export interface Internship {
  id: string;
  title: string;
  companyName: string;
  companyLogoBg: string;
  companyLogoText: string;
  location: string;
  stipend: string;
  duration: string;
  workMode: WorkMode;
  tags: string[];
  postedTime: string;
  featured?: boolean;
}

export interface Company {
  id: string;
  name: string;
  logoBg: string;
  logoText: string;
  industry: string;
  activeJobs: number;
  featured?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'application' | 'system' | 'message';
}
