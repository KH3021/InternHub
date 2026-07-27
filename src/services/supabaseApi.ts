import { supabase } from '../utils/supabase';
import type { Category, Job, Internship, Company, NotificationItem, UserRole } from '../types/portal.types';

// ============================================================================
// HELPERS
// ============================================================================

function getRelativeTime(dateStr?: string): string {
  if (!dateStr) return 'Recently';
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const LOGO_COLORS = [
  'bg-indigo-600', 'bg-blue-600', 'bg-emerald-600',
  'bg-rose-500', 'bg-amber-500', 'bg-purple-600',
];
const pickColor = (str: string) => LOGO_COLORS[str.charCodeAt(0) % LOGO_COLORS.length];

// ============================================================================
// 1. CATEGORIES (Table: categories)
// ============================================================================
export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(12);

    if (error || !data || data.length === 0) {
      return fallbackCategories;
    }

    return data.map((c: any) => ({
      id: String(c.id),
      name: c.name || 'Category',
      slug: c.slug || c.name?.toLowerCase().replace(/\s+/g, '-') || 'category',
      iconName: c.icon_name || c.iconName || 'Briefcase',
      count: c.count ?? c.job_count ?? 0,
    }));
  },
};

// ============================================================================
// 2. JOBS & INTERNSHIPS (Table: jobs)
// ============================================================================
export const jobService = {
  async getFeaturedJobs(): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .limit(6);

    if (error || !data || data.length === 0) {
      return fallbackJobs;
    }

    // Filter to non-internship rows (any column may indicate type)
    const jobs = data.filter((j: any) =>
      (j.job_type !== 'internship') && (j.type !== 'internship')
    );
    const source = jobs.length > 0 ? jobs : data;

    return source.slice(0, 6).map((j: any) => jobRowToJob(j));
  },

  async getFeaturedInternships(): Promise<Internship[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .limit(6);

    if (error || !data || data.length === 0) {
      return fallbackInternships;
    }

    const internships = data.filter((j: any) =>
      j.job_type === 'internship' || j.type === 'internship'
    );
    const source = internships.length > 0 ? internships : data;

    return source.slice(0, 6).map((j: any) => jobRowToInternship(j));
  },

  async saveJob(userId: string, jobId: string): Promise<boolean> {
    if (!isValidUUID(userId)) return true;
    const { error } = await supabase
      .from('saved_jobs')
      .insert({ user_id: userId, job_id: jobId });
    return !error;
  },

  async unsaveJob(userId: string, jobId: string): Promise<boolean> {
    if (!isValidUUID(userId)) return true;
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('user_id', userId)
      .eq('job_id', jobId);
    return !error;
  },

  async getSavedJobIds(userId: string): Promise<string[]> {
    if (!isValidUUID(userId)) return [];
    const { data } = await supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('user_id', userId);
    return data ? data.map((row: any) => row.job_id) : [];
  },
};

// ============================================================================
// 3. COMPANIES (Table: companies)
// ============================================================================
export const companyService = {
  async getTopCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .limit(8);

    if (error || !data || data.length === 0) {
      return fallbackCompanies;
    }

    return data.map((c: any) => ({
      id: String(c.id),
      name: c.name || 'Company',
      logoBg: pickColor(c.name || 'A'),
      logoText: (c.name || 'CO').substring(0, 2).toUpperCase(),
      industry: c.industry || 'Technology',
      activeJobs: c.active_jobs ?? c.activeJobs ?? Math.floor(Math.random() * 12) + 3,
      featured: c.featured ?? c.is_featured ?? true,
    }));
  },
};

// ============================================================================
// 4. APPLICATIONS (Table: applications)
// ============================================================================
export const applicationService = {
  async applyForJob(candidateId: string, jobId: string, jobTitle?: string, companyName?: string, coverLetter?: string, resumeUrl?: string) {
    const newApp = { 
      id: Date.now().toString(), 
      job_id: jobId, 
      candidate_id: candidateId, 
      status: 'applied', 
      created_at: new Date().toISOString(),
      cover_letter: coverLetter || `Application submitted for ${jobTitle || 'Position'} at ${companyName || 'Company'}.`,
      resume_url: resumeUrl || ''
    };

    if (!isValidUUID(candidateId)) {
      return { success: true, data: newApp };
    }

    const payload: any = {
      job_id: isValidUUID(jobId) ? jobId : '00000000-0000-0000-0000-000000000001',
      candidate_id: candidateId,
      status: 'applied',
      cover_letter: newApp.cover_letter,
      resume_url: newApp.resume_url,
    };

    const { data, error } = await supabase
      .from('applications')
      .insert(payload)
      .select()
      .maybeSingle();

    if (error) {
      console.warn('[ApplicationService] Error inserting application into Supabase:', error.message);
      // Save to localStorage as fallback for dummy data
      const fallbackApps = JSON.parse(localStorage.getItem(`fallback_apps_${candidateId}`) || '[]');
      // Avoid duplicate applications in fallback
      if (!fallbackApps.find((a: any) => a.job_id === jobId)) {
        fallbackApps.push(newApp);
        localStorage.setItem(`fallback_apps_${candidateId}`, JSON.stringify(fallbackApps));
      }
      return { success: true, data: newApp };
    }

    return { success: true, data };
  },

  async getCandidateApplications(candidateId: string) {
    if (!isValidUUID(candidateId)) return [];

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });

    const fallbackApps = JSON.parse(localStorage.getItem(`fallback_apps_${candidateId}`) || '[]');

    if (error || !data) return fallbackApps;
    
    return [...data, ...fallbackApps].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
};

// ============================================================================
// 5. PROFILE SERVICE (Tables: users, candidate_profiles, recruiter_profiles)
// ============================================================================
export const userService = {
  async checkDuplicateUser(email: string, phone?: string): Promise<{ isDuplicate: boolean; field?: 'email' | 'phone'; message?: string }> {
    if (!email) return { isDuplicate: false };

    // Check email in users table
    const { data: emailData } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email.trim().toLowerCase())
      .limit(1);

    if (emailData && emailData.length > 0) {
      return { isDuplicate: true, field: 'email', message: 'An account with this email address already exists. Please sign in.' };
    }

    // Check phone if provided
    if (phone && phone.trim()) {
      const cleanPhone = phone.trim();
      const { data: phoneData } = await supabase
        .from('users')
        .select('id')
        .eq('phone', cleanPhone)
        .limit(1);

      if (phoneData && phoneData.length > 0) {
        return { isDuplicate: true, field: 'phone', message: 'An account with this mobile number is already registered.' };
      }
    }

    return { isDuplicate: false };
  },
};

export const profileService = {
  async saveProfile(userId: string, profileData: any) {
    if (!isValidUUID(userId)) return true;

    // 1. Ensure user row exists in public.users
    const userPayload: any = { id: userId };
    if (profileData.fullName) userPayload.full_name = profileData.fullName;
    if (profileData.email) userPayload.email = profileData.email;
    if (profileData.role) userPayload.role = profileData.role;
    if (profileData.phone) userPayload.phone = profileData.phone;

    const { error: userErr } = await supabase
      .from('users')
      .upsert(userPayload, { onConflict: 'id' });

    if (userErr) {
      console.warn('[ProfileService] Error upserting users:', userErr.message);
    }

    // 2. Save to candidate_profiles if candidate
    if (profileData.role === 'candidate' || !profileData.role) {
      const candidatePayload: any = {
        user_id: userId,
        bio: profileData.bio || '',
        headline: profileData.headline || profileData.education || '',
        location: profileData.preferredLocation || profileData.location || '',
        resume_url: profileData.resumeUrl || '',
      };

      if (profileData.education) candidatePayload.education = profileData.education;
      if (profileData.experienceYears) candidatePayload.experience_years = profileData.experienceYears;
      if (Array.isArray(profileData.skills)) candidatePayload.skills = profileData.skills;

      const { error: candidateErr } = await supabase
        .from('candidate_profiles')
        .upsert(candidatePayload, { onConflict: 'user_id' });

      if (candidateErr) {
        console.warn('[ProfileService] Error upserting candidate_profiles:', candidateErr.message);
      }

      // 3. Save skills to user_skills table if provided
      if (Array.isArray(profileData.skills) && profileData.skills.length > 0) {
        await profileService.saveUserSkills(userId, profileData.skills);
      }
    }
    return true;
  },

  async saveUserSkills(userId: string, skillNames: string[]) {
    if (!isValidUUID(userId) || !skillNames.length) return;
    try {
      // First delete existing user_skills
      await supabase.from('user_skills').delete().eq('user_id', userId);

      // Insert skill names
      const skillRows = skillNames.map(name => ({
        user_id: userId,
        skill_name: name,
      }));

      const { error } = await supabase.from('user_skills').insert(skillRows);
      if (error) {
        console.warn('[ProfileService] user_skills insert error:', error.message);
      }
    } catch {
      // Ignore schema variations
    }
  },

  async getCandidateProfile(userId: string) {
    if (!isValidUUID(userId)) return null;

    const { data: profile } = await supabase
      .from('candidate_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const { data: userRow } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    const { data: skillsData } = await supabase
      .from('user_skills')
      .select('skill_name')
      .eq('user_id', userId);

    const skillsList = skillsData ? skillsData.map((s: any) => s.skill_name) : (profile?.skills || []);

    return {
      userId,
      fullName: userRow?.full_name || 'Candidate',
      email: userRow?.email || '',
      phone: userRow?.phone || '',
      education: profile?.education || profile?.headline || 'B.Tech Computer Science',
      experienceYears: profile?.experience_years || '0',
      location: profile?.location || 'Remote',
      bio: profile?.bio || '',
      resumeUrl: profile?.resume_url || '',
      skills: skillsList.length > 0 ? skillsList : ['React', 'TypeScript', 'Tailwind CSS'],
    };
  },

  async uploadResume(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    // 500 KB size validation
    const MAX_SIZE_BYTES = 500 * 1024; // 500 KB
    if (file.size > MAX_SIZE_BYTES) {
      return { url: null, error: `File size exceeds 500 KB limit (current size: ${(file.size / 1024).toFixed(1)} KB). Please upload a smaller file.` };
    }

    try {
      const fileExt = file.name.split('.').pop() || 'pdf';
      const fileName = `${userId}_resume_${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      // Upload to Supabase Storage bucket "resumes"
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.warn('[Storage] Upload to Supabase bucket error, using DataURL fallback:', error.message);
        // Fallback to Base64 Data URL if bucket isn't created in Supabase Dashboard
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({ url: reader.result as string, error: null });
          };
          reader.onerror = () => {
            resolve({ url: null, error: 'Failed to read resume file.' });
          };
          reader.readAsDataURL(file);
        });
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(filePath);
      return { url: publicUrlData.publicUrl, error: null };
    } catch (e: any) {
      return { url: null, error: e.message || 'Error uploading file.' };
    }
  },
};

// ============================================================================
// 6. NOTIFICATIONS (Table: notifications)
// ============================================================================
export const notificationService = {
  async getUserNotifications(userId: string): Promise<NotificationItem[]> {
    if (!isValidUUID(userId)) return fallbackNotifications;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return fallbackNotifications;

    return data.map((n: any) => ({
      id: n.id,
      title: n.title,
      message: n.message || '',
      time: getRelativeTime(n.created_at),
      read: n.read ?? n.is_read ?? false,
      type: n.type || 'system',
    }));
  },

  async markAsRead(notificationId: string) {
    await supabase
      .from('notifications')
      .update({ read: true, is_read: true })
      .eq('id', notificationId);
  },
};

// ============================================================================
// UUID VALIDATOR — prevents invalid uuid syntax errors in PostgreSQL
// ============================================================================
function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// ============================================================================
// ROW MAPPERS
// ============================================================================
function jobRowToJob(j: any): Job {
  const companyName = j.company_name || j.companies?.name || j.company || 'Top Company';
  return {
    id: String(j.id),
    title: j.title || 'Software Engineer',
    companyName,
    companyLogoBg: pickColor(companyName),
    companyLogoText: companyName.substring(0, 2).toUpperCase(),
    location: j.location || 'Remote',
    salary: j.salary || j.salary_range || '$80,000 - $120,000 / yr',
    workMode: j.work_mode || j.workMode || (j.is_remote ? 'Remote' : 'Hybrid'),
    tags: Array.isArray(j.tags) ? j.tags : Array.isArray(j.skills) ? j.skills : ['TypeScript', 'React'],
    postedTime: getRelativeTime(j.created_at || j.posted_at),
    featured: j.is_featured ?? j.featured ?? true,
  };
}

function jobRowToInternship(j: any): Internship {
  const companyName = j.company_name || j.companies?.name || j.company || 'Top Company';
  return {
    id: String(j.id),
    title: j.title || 'Engineering Intern',
    companyName,
    companyLogoBg: pickColor(companyName),
    companyLogoText: companyName.substring(0, 2).toUpperCase(),
    location: j.location || 'Remote',
    stipend: j.stipend || j.salary || '$3,000 / month',
    duration: j.duration || '3 Months',
    workMode: j.work_mode || j.workMode || 'Hybrid',
    tags: Array.isArray(j.tags) ? j.tags : Array.isArray(j.skills) ? j.skills : ['Python', 'JavaScript'],
    postedTime: getRelativeTime(j.created_at || j.posted_at),
    featured: j.is_featured ?? j.featured ?? true,
  };
}

// ============================================================================
// FALLBACK DATA (shown when tables are empty)
// ============================================================================
const fallbackCategories: Category[] = [
  { id: '1', name: 'Software Development', slug: 'software-development', iconName: 'Code2', count: 1240 },
  { id: '2', name: 'UI/UX & Product Design', slug: 'design', iconName: 'Palette', count: 850 },
  { id: '3', name: 'Data Science & AI', slug: 'data-science', iconName: 'Brain', count: 620 },
  { id: '4', name: 'Digital Marketing', slug: 'marketing', iconName: 'Megaphone', count: 430 },
  { id: '5', name: 'Product Management', slug: 'product-management', iconName: 'Briefcase', count: 390 },
  { id: '6', name: 'Finance & Business', slug: 'finance', iconName: 'DollarSign', count: 280 },
  { id: '7', name: 'Cybersecurity', slug: 'cybersecurity', iconName: 'Shield', count: 210 },
  { id: '8', name: 'Human Resources', slug: 'human-resources', iconName: 'Users', count: 175 },
];

const fallbackJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Full Stack Engineer',
    companyName: 'Stripe Global',
    companyLogoBg: 'bg-indigo-600',
    companyLogoText: 'ST',
    location: 'San Francisco, CA (Remote)',
    salary: '$140,000 - $185,000 / yr',
    workMode: 'Remote',
    tags: ['React', 'Node.js', 'TypeScript', 'AWS'],
    postedTime: '2 hours ago',
    featured: true,
  },
  {
    id: 'job-2',
    title: 'Lead Product Designer',
    companyName: 'Figma Cloud',
    companyLogoBg: 'bg-rose-500',
    companyLogoText: 'FG',
    location: 'New York, NY (Hybrid)',
    salary: '$130,000 - $165,000 / yr',
    workMode: 'Hybrid',
    tags: ['Figma', 'UI/UX', 'Design Systems'],
    postedTime: '5 hours ago',
    featured: true,
  },
  {
    id: 'job-3',
    title: 'AI / ML Infrastructure Engineer',
    companyName: 'OpenTech Labs',
    companyLogoBg: 'bg-emerald-600',
    companyLogoText: 'OT',
    location: 'Austin, TX (Remote)',
    salary: '$160,000 - $210,000 / yr',
    workMode: 'Remote',
    tags: ['Python', 'PyTorch', 'Kubernetes'],
    postedTime: '1 day ago',
    featured: true,
  },
];

const fallbackInternships: Internship[] = [
  {
    id: 'intern-1',
    title: 'Frontend Engineering Intern',
    companyName: 'Metaverse Labs',
    companyLogoBg: 'bg-blue-600',
    companyLogoText: 'ML',
    location: 'Menlo Park, CA',
    stipend: '$8,500 / month',
    duration: '3 Months',
    workMode: 'On-site',
    tags: ['React', 'JavaScript', 'Tailwind'],
    postedTime: '3 hours ago',
    featured: true,
  },
  {
    id: 'intern-2',
    title: 'Data Science Intern',
    companyName: 'Databricks',
    companyLogoBg: 'bg-amber-500',
    companyLogoText: 'DB',
    location: 'San Francisco, CA',
    stipend: '$7,800 / month',
    duration: '6 Months',
    workMode: 'Hybrid',
    tags: ['Python', 'SQL', 'Spark'],
    postedTime: '6 hours ago',
    featured: true,
  },
  {
    id: 'intern-3',
    title: 'Cybersecurity Operations Intern',
    companyName: 'CrowdStrike',
    companyLogoBg: 'bg-purple-600',
    companyLogoText: 'CS',
    location: 'Remote',
    stipend: '$6,500 / month',
    duration: '4 Months',
    workMode: 'Remote',
    tags: ['Python', 'Linux', 'Network Security'],
    postedTime: '1 day ago',
    featured: true,
  },
];

const fallbackCompanies: Company[] = [
  { id: 'comp-1', name: 'Google', logoBg: 'bg-blue-500', logoText: 'GO', industry: 'Cloud & Search', activeJobs: 42, featured: true },
  { id: 'comp-2', name: 'Microsoft', logoBg: 'bg-indigo-600', logoText: 'MS', industry: 'Enterprise Software', activeJobs: 38, featured: true },
  { id: 'comp-3', name: 'Apple', logoBg: 'bg-slate-900', logoText: 'AP', industry: 'Hardware & OS', activeJobs: 29, featured: true },
  { id: 'comp-4', name: 'Amazon', logoBg: 'bg-amber-600', logoText: 'AM', industry: 'E-Commerce & AWS', activeJobs: 54, featured: true },
];

const fallbackNotifications: NotificationItem[] = [
  { id: 'n1', title: 'Welcome to InternHub!', message: 'Your account is ready. Complete your profile to get started.', time: 'Just now', read: false, type: 'system' },
  { id: 'n2', title: 'New Internship Alert', message: 'Metaverse Labs posted a new Frontend Engineering Internship.', time: '2h ago', read: false, type: 'system' },
];
