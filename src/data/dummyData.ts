import type { Category, Job, Internship, Company } from '../types/portal.types';

export const categories: Category[] = [
  { id: '1', name: 'Software Development', slug: 'software-development', iconName: 'Code2', count: 1420 },
  { id: '2', name: 'Data Science', slug: 'data-science', iconName: 'Database', count: 850 },
  { id: '3', name: 'UI/UX Design', slug: 'ui-ux-design', iconName: 'Palette', count: 620 },
  { id: '4', name: 'Marketing', slug: 'marketing', iconName: 'Megaphone', count: 480 },
  { id: '5', name: 'Finance', slug: 'finance', iconName: 'DollarSign', count: 350 },
  { id: '6', name: 'HR', slug: 'hr', iconName: 'Users', count: 210 },
  { id: '7', name: 'Artificial Intelligence', slug: 'artificial-intelligence', iconName: 'Brain', count: 980 },
  { id: '8', name: 'Cyber Security', slug: 'cyber-security', iconName: 'Shield', count: 180 },
];

export const featuredJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer (React)',
    companyName: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    salary: '$135,000 - $165,000 / year',
    workMode: 'Hybrid',
    companyLogoBg: 'bg-blue-600',
    companyLogoText: 'TC',
    tags: ['React', 'TypeScript', 'Tailwind'],
    postedTime: '2 hours ago',
    featured: true
  },
  {
    id: 'job-2',
    title: 'Lead Data Scientist',
    companyName: 'DataDynamics',
    location: 'New York, NY',
    salary: '$150,000 - $180,000 / year',
    workMode: 'Remote',
    companyLogoBg: 'bg-emerald-600',
    companyLogoText: 'DD',
    tags: ['Python', 'PyTorch', 'SQL'],
    postedTime: '1 day ago',
    featured: true
  },
  {
    id: 'job-3',
    title: 'Product (UI/UX) Designer',
    companyName: 'CreativeStudio',
    location: 'London, UK',
    salary: '£70,000 - £85,000 / year',
    workMode: 'Hybrid',
    companyLogoBg: 'bg-purple-600',
    companyLogoText: 'CS',
    tags: ['Figma', 'UI Design', 'Prototyping'],
    postedTime: '3 days ago'
  },
  {
    id: 'job-4',
    title: 'Growth Marketing Manager',
    companyName: 'MarketReach Inc.',
    location: 'Austin, TX',
    salary: '$95,000 - $115,000 / year',
    workMode: 'Remote',
    companyLogoBg: 'bg-amber-600',
    companyLogoText: 'MR',
    tags: ['SEO', 'Google Ads', 'Analytics'],
    postedTime: '5 days ago'
  },
  {
    id: 'job-5',
    title: 'Quantitative Finance Analyst',
    companyName: 'WealthCapital Partners',
    location: 'Chicago, IL',
    salary: '$140,000 - $170,000 / year',
    workMode: 'On-site',
    companyLogoBg: 'bg-rose-600',
    companyLogoText: 'WC',
    tags: ['Quantitative', 'Python', 'C++'],
    postedTime: '1 week ago'
  },
  {
    id: 'job-6',
    title: 'Information Security Engineer',
    companyName: 'CyberGuard Labs',
    location: 'Washington, DC',
    salary: '$120,000 - $150,000 / year',
    workMode: 'Hybrid',
    companyLogoBg: 'bg-indigo-600',
    companyLogoText: 'CG',
    tags: ['Network Security', 'Pentest', 'IAM'],
    postedTime: '1 week ago'
  }
];

export const featuredInternships: Internship[] = [
  {
    id: 'intern-1',
    title: 'Software Engineer Intern',
    companyName: 'Google Cloud Platform',
    location: 'Sunnyvale, CA',
    stipend: '$6,500 / month',
    duration: '3 Months',
    workMode: 'Hybrid',
    companyLogoBg: 'bg-sky-500',
    companyLogoText: 'GP',
    tags: ['Go', 'Kubernetes', 'Docker'],
    postedTime: '4 hours ago',
    featured: true
  },
  {
    id: 'intern-2',
    title: 'AI Research Intern',
    companyName: 'Anthropic Labs',
    location: 'San Francisco, CA',
    stipend: '$7,000 / month',
    duration: '6 Months',
    workMode: 'On-site',
    companyLogoBg: 'bg-orange-600',
    companyLogoText: 'AL',
    tags: ['LLMs', 'Transformer', 'Python'],
    postedTime: '12 hours ago',
    featured: true
  },
  {
    id: 'intern-3',
    title: 'UI/UX Design Intern',
    companyName: 'Canva Design',
    location: 'Remote',
    stipend: '$4,000 / month',
    duration: '3 Months',
    workMode: 'Remote',
    companyLogoBg: 'bg-pink-500',
    companyLogoText: 'CD',
    tags: ['Design System', 'User Research'],
    postedTime: '2 days ago'
  },
  {
    id: 'intern-4',
    title: 'Data Analyst Intern',
    companyName: 'Snowflake Corp',
    location: 'San Mateo, CA',
    stipend: '$5,000 / month',
    duration: '4 Months',
    workMode: 'Hybrid',
    companyLogoBg: 'bg-cyan-500',
    companyLogoText: 'SF',
    tags: ['SQL', 'Tableau', 'Snowflake'],
    postedTime: '3 days ago'
  },
  {
    id: 'intern-5',
    title: 'Product Management Intern',
    companyName: 'Salesforce',
    location: 'Seattle, WA',
    stipend: '$5,500 / month',
    duration: '6 Months',
    workMode: 'Hybrid',
    companyLogoBg: 'bg-indigo-500',
    companyLogoText: 'SF',
    tags: ['Agile', 'Jira', 'Analytics'],
    postedTime: '5 days ago'
  },
  {
    id: 'intern-6',
    title: 'Cybersecurity Analyst Intern',
    companyName: 'CrowdStrike',
    location: 'Remote',
    stipend: '$4,500 / month',
    duration: '6 Months',
    workMode: 'Remote',
    companyLogoBg: 'bg-red-600',
    companyLogoText: 'CS',
    tags: ['Incident Response', 'Threat Intel'],
    postedTime: '1 week ago'
  }
];

export const hiringCompanies: Company[] = [
  { id: 'c-1', name: 'Google', logoBg: 'bg-red-500', logoText: 'G', industry: 'Technology', activeJobs: 42, featured: true },
  { id: 'c-2', name: 'Microsoft', logoBg: 'bg-blue-500', logoText: 'M', industry: 'Enterprise Tech', activeJobs: 35, featured: true },
  { id: 'c-3', name: 'Amazon', logoBg: 'bg-orange-500', logoText: 'A', industry: 'E-Commerce', activeJobs: 50, featured: true },
  { id: 'c-4', name: 'Netflix', logoBg: 'bg-red-700', logoText: 'N', industry: 'Entertainment', activeJobs: 12 },
  { id: 'c-5', name: 'Meta', logoBg: 'bg-blue-600', logoText: '∞', industry: 'Social Media', activeJobs: 28, featured: true },
  { id: 'c-6', name: 'Adobe', logoBg: 'bg-red-600', logoText: 'A', industry: 'Creativity Software', activeJobs: 18 },
  { id: 'c-7', name: 'Spotify', logoBg: 'bg-green-500', logoText: 'S', industry: 'Audio Streaming', activeJobs: 15 },
  { id: 'c-8', name: 'Airbnb', logoBg: 'bg-rose-500', logoText: 'A', industry: 'Hospitality', activeJobs: 22 }
];
