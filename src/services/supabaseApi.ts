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
      .insert({ candidate_id: userId, job_id: jobId });
    return !error;
  },

  async unsaveJob(userId: string, jobId: string): Promise<boolean> {
    if (!isValidUUID(userId)) return true;
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('candidate_id', userId)
      .eq('job_id', jobId);
    return !error;
  },

  async getSavedJobIds(userId: string): Promise<string[]> {
    if (!isValidUUID(userId)) return [];
    const { data } = await supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('candidate_id', userId);
    return data ? data.map((row: any) => row.job_id) : [];
  },

  async getSavedJobs(userId: string) {
    if (!isValidUUID(userId)) return [];
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('*, jobs(*, companies(name))')
      .eq('candidate_id', userId)
      .order('saved_at', { ascending: false });
    
    if (error) {
      console.warn('Error fetching saved jobs:', error.message);
    }
    return data || [];
  },

  async createJob(jobData: any): Promise<{ success: boolean; data?: any; error?: string }> {
    let companyId = '00000000-0000-0000-0002-000000000001'; // Default
    if (jobData.recruiterId) {
      const { data: recruiter } = await supabase.from('users').select('company_id').eq('id', jobData.recruiterId).maybeSingle();
      if (recruiter?.company_id) {
        companyId = recruiter.company_id;
      }
    }

    const payload = {
      title: jobData.title || 'New Position',
      location: jobData.location || 'Remote',
      salary: jobData.salary || 'Negotiable',
      job_type: jobData.jobType || 'full-time',
      work_mode: jobData.workMode || 'Remote',
      description: jobData.description || 'Job description goes here',
      posted_by: jobData.recruiterId || null,
      company_id: companyId
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert(payload)
      .select()
      .maybeSingle();

    if (error) {
      console.warn('[JobService] Error creating job:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },

  async getRecruiterJobs(recruiterId: string): Promise<Job[]> {
    if (!isValidUUID(recruiterId)) return [];
    
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('posted_by', recruiterId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((j: any) => jobRowToJob(j));
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
export const applicationService = {
  async applyForJob(candidateId: string, jobId: string, jobTitle?: string, companyName?: string, coverLetter?: string, resumeUrl?: string) {
    if (!isValidUUID(candidateId)) {
      return { success: false, error: 'Invalid candidate ID' };
    }

    let finalJobId = jobId;

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
      .select('*, jobs(*, companies(name))')
      .eq('candidate_id', candidateId)
      .order('applied_at', { ascending: false });

    if (error || !data) {
      console.warn('[ApplicationService] Error fetching apps:', error?.message);
      return [];
    }
    
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

    // We only have public.users table for profiles now
    const userPayload: any = { id: userId };
    
    if (profileData.fullName) userPayload.full_name = profileData.fullName;
    if (profileData.email) userPayload.email = profileData.email;
    if (profileData.role) userPayload.role = profileData.role;
    if (profileData.phone) userPayload.phone = profileData.phone;
    if (profileData.companyId) userPayload.company_id = profileData.companyId;
    
    if (profileData.bio !== undefined) userPayload.bio = profileData.bio;
    if (profileData.preferredLocation || profileData.location) userPayload.location = profileData.preferredLocation || profileData.location;
    if (profileData.resumeUrl !== undefined) {
      userPayload.resume_url = profileData.resumeUrl;
      await supabase.auth.updateUser({ data: { resumeUrl: profileData.resumeUrl } });
    }
    
    if (Array.isArray(profileData.skills)) userPayload.skills = profileData.skills;
    
    // Convert string inputs to JSON arrays if necessary for the schema
    if (profileData.education) {
      userPayload.education = Array.isArray(profileData.education) 
        ? profileData.education 
        : [{ institution: profileData.education }];
    }
    
    if (profileData.experienceYears) {
      userPayload.experience = Array.isArray(profileData.experienceYears)
        ? profileData.experienceYears
        : [{ title: `${profileData.experienceYears} Years Experience` }];
    }

    const { error: userErr } = await supabase
      .from('users')
      .upsert(userPayload, { onConflict: 'id' });

    if (userErr) {
      console.warn('[ProfileService] Error upserting users:', userErr.message);
      return false;
    }

    // Insert into dedicated profile tables
    if (profileData.role === 'recruiter' || profileData.companyId) {
      const recPayload: any = {
        user_id: userId,
        company_id: profileData.companyId || null,
        designation: profileData.designation || 'Recruiter'
      };
      const { error: recErr } = await supabase
        .from('recruiter_profiles')
        .upsert(recPayload, { onConflict: 'user_id' });
      if (recErr) console.warn('[ProfileService] Error upserting recruiter_profiles:', recErr.message);
    } 
    
    if (profileData.role === 'candidate' || (!profileData.role && !profileData.companyId)) {
      const candPayload: any = {
        user_id: userId,
        skills: Array.isArray(profileData.skills) ? profileData.skills : [],
        resume_url: profileData.resumeUrl || null
      };
      
      if (profileData.education) {
        candPayload.education = Array.isArray(profileData.education) 
          ? profileData.education[0]?.institution || '' 
          : String(profileData.education);
      }
      
      if (profileData.experienceYears) {
        candPayload.experience = Array.isArray(profileData.experienceYears)
          ? profileData.experienceYears[0]?.title || ''
          : String(profileData.experienceYears);
      }
      
      const { error: candErr } = await supabase
        .from('candidate_profiles')
        .upsert(candPayload, { onConflict: 'user_id' });
      if (candErr) console.warn('[ProfileService] Error upserting candidate_profiles:', candErr.message);
    }

    return true;
  },

  async saveUserSkills(userId: string, skillNames: string[]) {
    if (!isValidUUID(userId) || !skillNames.length) return;
    try {
      const { error } = await supabase
        .from('users')
        .update({ skills: skillNames })
        .eq('id', userId);
        
      if (error) {
        console.warn('[ProfileService] Error saving skills:', error.message);
      }
    } catch {
      // Ignore
    }
  },

  async getCandidateProfile(userId: string) {
    if (!isValidUUID(userId)) return null;

    const { data: userRow } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    const { data: authData } = await supabase.auth.getUser();
    const resumeUrlFromAuth = authData?.user?.user_metadata?.resumeUrl || '';

    if (!userRow) return null;

    let educationString = 'B.Tech Computer Science';
    if (userRow.education && Array.isArray(userRow.education) && userRow.education.length > 0) {
      educationString = userRow.education[0]?.institution || 'B.Tech Computer Science';
    }

    let experienceString = '0';
    if (userRow.experience && Array.isArray(userRow.experience) && userRow.experience.length > 0) {
      experienceString = userRow.experience[0]?.title?.replace(' Years Experience', '') || '0';
    }

    return {
      userId,
      fullName: userRow.full_name || 'Candidate',
      email: userRow.email || '',
      phone: userRow.phone || '',
      education: educationString,
      experienceYears: experienceString,
      location: userRow.location || 'Remote',
      bio: userRow.bio || '',
      resumeUrl: resumeUrlFromAuth || userRow.resume_url || '',
      skills: Array.isArray(userRow.skills) && userRow.skills.length > 0 
        ? userRow.skills 
        : ['React', 'TypeScript', 'Tailwind CSS'],
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
      return { url: null, error: e.message };
    }
  },

  async deleteResume(userId: string, resumeUrl: string) {
    if (!isValidUUID(userId) || !resumeUrl) return;
    try {
      // Remove from storage if possible
      const urlParts = resumeUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      if (fileName) {
        await supabase.storage.from('resumes').remove([fileName]);
      }
      // Remove from profile
      await supabase.from('users').update({ resume_url: '' }).eq('id', userId);
    } catch (e: any) {
      console.warn('Error deleting resume:', e.message);
    }
  }
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

