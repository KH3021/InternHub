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
      return [];
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
      return [];
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
      return [];
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
      return [];
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
// Helper to map dummy 'job-1' or 'intern-1' to valid UUIDs
function getDummyUuid(dummyId: string): string {
  if (dummyId.startsWith('job-')) {
    const num = dummyId.split('-')[1];
    return `00000000-0000-0000-0000-${num.padStart(12, '0')}`;
  }
  if (dummyId.startsWith('intern-')) {
    const num = dummyId.split('-')[1];
    return `11111111-0000-0000-0000-${num.padStart(12, '0')}`;
  }
  return dummyId;
}

export const applicationService = {
  async applyForJob(candidateId: string, jobId: string, jobTitle?: string, companyName?: string, coverLetter?: string, resumeUrl?: string) {
    if (!isValidUUID(candidateId)) {
      return { success: false, error: 'Invalid candidate ID' };
    }

    let finalJobId = jobId;

    // If using dummy data, we do not want to hit Supabase because Candidates don't have permission to create jobs
    if (!isValidUUID(jobId)) {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 600));
      return { success: true, data: { id: 'dummy-app', job_id: jobId, status: 'applied' } };
    }

    const payload: any = {
      job_id: finalJobId,
      candidate_id: candidateId,
      status: 'applied',
      cover_letter: coverLetter || `Application submitted for ${jobTitle || 'Position'} at ${companyName || 'Company'}.`,
      resume_url: resumeUrl || '',
    };

    const { data, error } = await supabase
      .from('applications')
      .insert(payload)
      .select()
      .maybeSingle();

    if (error) {
      console.warn('[ApplicationService] Error inserting application into Supabase:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },

  async getCandidateApplications(candidateId: string) {
    if (!isValidUUID(candidateId)) return [];

    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(*)')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    
    return data;
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
        return { url: null, error: error.message || 'Failed to upload to Supabase bucket.' };
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
    if (!isValidUUID(userId)) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return [];

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

