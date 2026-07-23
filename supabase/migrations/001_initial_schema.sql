-- ============================================================
-- InternHub Portal - Complete Database Schema Migration
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('candidate', 'recruiter', 'company', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'internship', 'contract', 'remote', 'hybrid');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('application_update', 'new_job', 'message', 'interview', 'offer', 'system');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- USERS TABLE (public profile synced from auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT NOT NULL UNIQUE,
  full_name         TEXT NOT NULL DEFAULT '',
  role              user_role NOT NULL DEFAULT 'candidate',
  avatar_url        TEXT,
  phone             TEXT,
  bio               TEXT,
  location          TEXT,
  website           TEXT,
  linkedin_url      TEXT,
  github_url        TEXT,
  resume_url        TEXT,
  skills            TEXT[] DEFAULT '{}',
  experience        JSONB DEFAULT '[]',
  education         JSONB DEFAULT '[]',
  profile_completed BOOLEAN DEFAULT FALSE,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- COMPANIES TABLE
CREATE TABLE IF NOT EXISTS public.companies (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  slug         TEXT UNIQUE,
  description  TEXT,
  logo_url     TEXT,
  cover_url    TEXT,
  website      TEXT,
  industry     TEXT,
  size         TEXT,
  founded_year INTEGER,
  location     TEXT,
  linkedin_url TEXT,
  twitter_url  TEXT,
  is_verified  BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- JOBS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id       UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  recruiter_id     UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title            TEXT NOT NULL,
  slug             TEXT,
  description      TEXT NOT NULL,
  requirements     TEXT,
  responsibilities TEXT,
  job_type         job_type DEFAULT 'full-time',
  location         TEXT,
  remote           BOOLEAN DEFAULT FALSE,
  salary_min       INTEGER,
  salary_max       INTEGER,
  salary_currency  TEXT DEFAULT 'USD',
  skills           TEXT[] DEFAULT '{}',
  experience_min   INTEGER DEFAULT 0,
  experience_max   INTEGER,
  education_level  TEXT,
  deadline         DATE,
  openings         INTEGER DEFAULT 1,
  is_active        BOOLEAN DEFAULT TRUE,
  views            INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id          UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status          application_status DEFAULT 'applied',
  cover_letter    TEXT,
  resume_url      TEXT,
  expected_salary INTEGER,
  notes           TEXT,
  interview_at    TIMESTAMPTZ,
  applied_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type       notification_type DEFAULT 'system',
  title      TEXT NOT NULL,
  message    TEXT,
  link       TEXT,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SAVED JOBS TABLE
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id  UUID REFERENCES public.users(id) ON DELETE CASCADE,
  job_id   UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id   UUID REFERENCES public.users(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  subject     TEXT,
  body        TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  sent_at     TIMESTAMPTZ DEFAULT NOW()
);

-- SKILL TAGS MASTER LIST
CREATE TABLE IF NOT EXISTS public.skill_tags (
  id       SERIAL PRIMARY KEY,
  name     TEXT NOT NULL UNIQUE,
  category TEXT
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_jobs_company      ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_active       ON public.jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_created      ON public.jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_job  ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_cand ON public.applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_notif_user        ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id, is_read);

-- AUTO-UPDATE updated_at FUNCTION
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated ON public.users;
CREATE TRIGGER trg_users_updated
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trg_jobs_updated ON public.jobs;
CREATE TRIGGER trg_jobs_updated
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trg_applications_updated ON public.applications;
CREATE TRIGGER trg_applications_updated
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ==================================================
-- CRITICAL: handle_new_user trigger
-- This runs when someone signs up via Supabase Auth.
-- It creates the matching public.users profile row.
-- Without this trigger, signup returns error 500.
-- ==================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'candidate'::user_role
    ),
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ROW LEVEL SECURITY
ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages      ENABLE ROW LEVEL SECURITY;

-- USERS POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Public profiles viewable" ON public.users;
CREATE POLICY "Public profiles viewable"
  ON public.users FOR SELECT USING (is_active = TRUE);

-- COMPANIES POLICIES
DROP POLICY IF EXISTS "Anyone can view active companies" ON public.companies;
CREATE POLICY "Anyone can view active companies"
  ON public.companies FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Owners can manage their company" ON public.companies;
CREATE POLICY "Owners can manage their company"
  ON public.companies FOR ALL
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- JOBS POLICIES
DROP POLICY IF EXISTS "Anyone can view active jobs" ON public.jobs;
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Recruiters can manage own jobs" ON public.jobs;
CREATE POLICY "Recruiters can manage own jobs"
  ON public.jobs FOR ALL
  USING (auth.uid() = recruiter_id) WITH CHECK (auth.uid() = recruiter_id);

-- APPLICATIONS POLICIES
DROP POLICY IF EXISTS "Candidates see own applications" ON public.applications;
CREATE POLICY "Candidates see own applications"
  ON public.applications FOR SELECT USING (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "Candidates can apply" ON public.applications;
CREATE POLICY "Candidates can apply"
  ON public.applications FOR INSERT WITH CHECK (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "Candidates can withdraw" ON public.applications;
CREATE POLICY "Candidates can withdraw"
  ON public.applications FOR UPDATE
  USING (auth.uid() = candidate_id) WITH CHECK (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "Recruiters see applications for their jobs" ON public.applications;
CREATE POLICY "Recruiters see applications for their jobs"
  ON public.applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id AND jobs.recruiter_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Recruiters can update application status" ON public.applications;
CREATE POLICY "Recruiters can update application status"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id AND jobs.recruiter_id = auth.uid()
    )
  );

-- NOTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Users see own notifications" ON public.notifications;
CREATE POLICY "Users see own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- SAVED JOBS POLICIES
DROP POLICY IF EXISTS "Users manage own saved jobs" ON public.saved_jobs;
CREATE POLICY "Users manage own saved jobs"
  ON public.saved_jobs FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- MESSAGES POLICIES
DROP POLICY IF EXISTS "Users see sent or received messages" ON public.messages;
CREATE POLICY "Users see sent or received messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Receivers can mark as read" ON public.messages;
CREATE POLICY "Receivers can mark as read"
  ON public.messages FOR UPDATE USING (auth.uid() = receiver_id);

-- SEED SKILL TAGS
INSERT INTO public.skill_tags (name, category) VALUES
  ('JavaScript', 'Programming'), ('TypeScript', 'Programming'),
  ('Python', 'Programming'), ('Java', 'Programming'), ('C++', 'Programming'),
  ('React', 'Frontend'), ('Vue.js', 'Frontend'), ('Angular', 'Frontend'),
  ('Node.js', 'Backend'), ('Express', 'Backend'), ('Django', 'Backend'),
  ('FastAPI', 'Backend'), ('Spring Boot', 'Backend'),
  ('PostgreSQL', 'Database'), ('MySQL', 'Database'), ('MongoDB', 'Database'),
  ('Redis', 'Database'), ('Elasticsearch', 'Database'),
  ('AWS', 'Cloud'), ('Google Cloud', 'Cloud'), ('Azure', 'Cloud'),
  ('Docker', 'DevOps'), ('Kubernetes', 'DevOps'), ('CI/CD', 'DevOps'),
  ('Git', 'Tools'), ('Figma', 'Design'), ('Tailwind CSS', 'Frontend'),
  ('GraphQL', 'API'), ('REST API', 'API'),
  ('Machine Learning', 'AI/ML'), ('TensorFlow', 'AI/ML'), ('PyTorch', 'AI/ML'),
  ('Data Analysis', 'Data'), ('Tableau', 'Data'), ('Power BI', 'Data'),
  ('SEO', 'Marketing'), ('Content Writing', 'Marketing'),
  ('Project Management', 'Management'), ('Agile', 'Management'), ('Scrum', 'Management'),
  ('Communication', 'Soft Skills'), ('Leadership', 'Soft Skills'), ('Problem Solving', 'Soft Skills')
ON CONFLICT (name) DO NOTHING;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

SELECT 'InternHub schema created successfully!' AS status;
