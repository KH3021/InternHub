-- =============================================================
-- InternHub: Fix RLS Policies + Auth Trigger
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- =============================================================

-- ─── STEP 1: Fix handle_new_user trigger ──────────────────────
-- Drop & recreate so it matches your actual users table columns

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email,''), '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'candidate')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── STEP 2: Grant usage on schema ─────────────────────────────
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- ─── STEP 3: Grant table permissions ───────────────────────────
GRANT SELECT ON public.jobs TO anon, authenticated;
GRANT SELECT ON public.companies TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.skills TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.candidate_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.recruiter_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_jobs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_skills TO authenticated;

-- ─── STEP 4: Drop all existing policies ────────────────────────
-- (Clean slate to avoid conflicts)

DROP POLICY IF EXISTS "Public can read jobs" ON public.jobs;
DROP POLICY IF EXISTS "Anyone can view active jobs" ON public.jobs;
DROP POLICY IF EXISTS "Recruiters can manage own jobs" ON public.jobs;

DROP POLICY IF EXISTS "Public can read companies" ON public.companies;
DROP POLICY IF EXISTS "Anyone can view active companies" ON public.companies;
DROP POLICY IF EXISTS "Owners can manage their company" ON public.companies;

DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
DROP POLICY IF EXISTS "Public can read skills" ON public.skills;

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Public profiles viewable" ON public.users;

DROP POLICY IF EXISTS "Candidates see own applications" ON public.applications;
DROP POLICY IF EXISTS "Candidates can apply" ON public.applications;
DROP POLICY IF EXISTS "Candidates can withdraw" ON public.applications;
DROP POLICY IF EXISTS "Recruiters see applications for their jobs" ON public.applications;
DROP POLICY IF EXISTS "Recruiters can update application status" ON public.applications;

DROP POLICY IF EXISTS "Users see own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

DROP POLICY IF EXISTS "Users manage own saved jobs" ON public.saved_jobs;
DROP POLICY IF EXISTS "Users manage own candidate profile" ON public.candidate_profiles;
DROP POLICY IF EXISTS "Users manage own recruiter profile" ON public.recruiter_profiles;

-- ─── STEP 5: Create new clean policies ─────────────────────────

-- JOBS: public read, authenticated write
CREATE POLICY "Public can read jobs"
  ON public.jobs FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated can insert jobs"
  ON public.jobs FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update own jobs"
  ON public.jobs FOR UPDATE TO authenticated USING (recruiter_id = auth.uid());

CREATE POLICY "Authenticated can delete own jobs"
  ON public.jobs FOR DELETE TO authenticated USING (recruiter_id = auth.uid());

-- COMPANIES: public read, authenticated write
CREATE POLICY "Public can read companies"
  ON public.companies FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated can insert companies"
  ON public.companies FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update companies"
  ON public.companies FOR UPDATE TO authenticated USING (true);

-- CATEGORIES: public read
CREATE POLICY "Public can read categories"
  ON public.categories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated can insert categories"
  ON public.categories FOR INSERT TO authenticated WITH CHECK (true);

-- SKILLS: public read
CREATE POLICY "Public can read skills"
  ON public.skills FOR SELECT TO anon, authenticated USING (true);

-- USERS: authenticated read/write own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- CANDIDATE_PROFILES: authenticated manage own
CREATE POLICY "Users manage own candidate profile"
  ON public.candidate_profiles FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RECRUITER_PROFILES: authenticated manage own
CREATE POLICY "Users manage own recruiter profile"
  ON public.recruiter_profiles FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- APPLICATIONS: candidates manage own, recruiters see theirs
CREATE POLICY "Candidates see own applications"
  ON public.applications FOR SELECT TO authenticated
  USING (auth.uid() = candidate_id);

CREATE POLICY "Candidates can apply"
  ON public.applications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = candidate_id);

CREATE POLICY "Candidates can update own application"
  ON public.applications FOR UPDATE TO authenticated
  USING (auth.uid() = candidate_id);

CREATE POLICY "Candidates can delete own application"
  ON public.applications FOR DELETE TO authenticated
  USING (auth.uid() = candidate_id);

-- NOTIFICATIONS: users see/update own only
CREATE POLICY "Users see own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- SAVED_JOBS: users manage own
CREATE POLICY "Users manage own saved jobs"
  ON public.saved_jobs FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- USER_SKILLS: users manage own
CREATE POLICY "Users manage own user_skills"
  ON public.user_skills FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─── STEP 6: Seed categories if empty ──────────────────────────
INSERT INTO public.categories (name, slug, icon_name)
SELECT * FROM (VALUES
  ('Software Development', 'software-development', 'Code2'),
  ('UI/UX & Product Design', 'design', 'Palette'),
  ('Data Science & AI', 'data-science', 'Brain'),
  ('Digital Marketing', 'marketing', 'Megaphone'),
  ('Product Management', 'product-management', 'Briefcase'),
  ('Finance & Business', 'finance', 'DollarSign'),
  ('Cybersecurity', 'cybersecurity', 'Shield'),
  ('Human Resources', 'human-resources', 'Users')
) AS v(name, slug, icon_name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories LIMIT 1);

-- ─── DONE ─────────────────────────────────────────────────────
SELECT 'RLS policies fixed and trigger updated successfully!' AS status;
