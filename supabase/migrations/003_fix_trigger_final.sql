-- =============================================================
-- InternHub: DEFINITIVE AUTH FIX
-- Run this ENTIRE script in: Supabase Dashboard → SQL Editor
-- =============================================================

-- STEP 1: Drop the failing trigger completely
-- (The frontend will handle inserting into public.users instead)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- STEP 2: Check your actual users table columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;
