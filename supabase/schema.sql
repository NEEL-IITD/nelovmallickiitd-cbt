-- ==============================================================================
-- NelovMallickIITD CBT Platform - Complete Production Database Schema
-- Target: Supabase (PostgreSQL 15+)
-- 100% Free Forever Platform · Single Attribution to Nelov Mallick (IIT Delhi)
-- ==============================================================================

-- 1. Enable UUID Extension if not already active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. Profiles Table
-- Holds public profile details for registered students and administrators.
-- Synchronized with auth.users via triggers.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  target_exam TEXT CHECK (target_exam IN ('JEE Mains', 'JEE Advanced', 'Both')) DEFAULT 'JEE Advanced',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ==============================================================================
-- 3. Trigger: Automatically Create Profile on User Signup (Email & Google OAuth)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name TEXT;
  v_target_exam TEXT;
BEGIN
  -- Extract name from user metadata or Google OAuth raw metadata
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    SPLIT_PART(NEW.email, '@', 1),
    'Student Aspirant'
  );

  v_target_exam := COALESCE(
    NEW.raw_user_meta_data->>'target_exam',
    'JEE Advanced'
  );

  IF v_target_exam NOT IN ('JEE Mains', 'JEE Advanced', 'Both') THEN
    v_target_exam := 'JEE Advanced';
  END IF;

  INSERT INTO public.profiles (id, full_name, email, target_exam, role, created_at)
  VALUES (
    NEW.id,
    v_full_name,
    NEW.email,
    v_target_exam,
    'student',
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 4. Test Configurations Table
-- Dynamic registry for PTA 01 to PTA 10 for both JEE Mains and JEE Advanced.
-- Can be toggled Live / Coming Soon by Admins in real time.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.test_configs (
  test_id TEXT PRIMARY KEY,
  exam_type TEXT NOT NULL,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('live', 'coming_soon')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pre-seed all 20 tests (PTA 01 through PTA 10 for both categories)
INSERT INTO public.test_configs (test_id, exam_type, code, title, status, updated_at)
VALUES
  -- JEE Advanced (PTA 04 and PTA 05 are Live, remainder Coming Soon)
  ('jee-advanced-pta-01', 'JEE Advanced', 'PTA 01', 'JEE Advanced – PTA 01 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-advanced-pta-02', 'JEE Advanced', 'PTA 02', 'JEE Advanced – PTA 02 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-advanced-pta-03', 'JEE Advanced', 'PTA 03', 'JEE Advanced – PTA 03 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-advanced-pta-04', 'JEE Advanced', 'PTA 04', 'JEE Advanced – PTA 04 Full Syllabus Mock Test (Paper 1)', 'live', NOW()),
  ('jee-advanced-pta-05', 'JEE Advanced', 'PTA 05', 'JEE Advanced – PTA 05 Full Syllabus Mock Test (Paper 2)', 'live', NOW()),
  ('jee-advanced-pta-06', 'JEE Advanced', 'PTA 06', 'JEE Advanced – PTA 06 Full Syllabus Mock Test', 'live', NOW()),
  ('jee-advanced-pta-07', 'JEE Advanced', 'PTA 07', 'JEE Advanced – PTA 07 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-advanced-pta-08', 'JEE Advanced', 'PTA 08', 'JEE Advanced – PTA 08 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-advanced-pta-09', 'JEE Advanced', 'PTA 09', 'JEE Advanced – PTA 09 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-advanced-pta-10', 'JEE Advanced', 'PTA 10', 'JEE Advanced – PTA 10 Full Syllabus Mock Test', 'coming_soon', NOW()),

  -- JEE Mains (All PTA 01 through PTA 10 initially Coming Soon)
  ('jee-mains-pta-01', 'JEE Mains', 'PTA 01', 'JEE Mains – PTA 01 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-pta-02', 'JEE Mains', 'PTA 02', 'JEE Mains – PTA 02 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-pta-03', 'JEE Mains', 'PTA 03', 'JEE Mains – PTA 03 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-pta-04', 'JEE Mains', 'PTA 04', 'JEE Mains – PTA 04 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-pta-05', 'JEE Mains', 'PTA 05', 'JEE Mains – PTA 05 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-pta-06', 'JEE Mains', 'PTA 06', 'JEE Mains – PTA 06 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-pta-07', 'JEE Mains', 'PTA 07', 'JEE Mains – PTA 07 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-pta-08', 'JEE Mains', 'PTA 08', 'JEE Mains – PTA 08 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-pta-09', 'JEE Mains', 'PTA 09', 'JEE Mains – PTA 09 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-pta-10', 'JEE Mains', 'PTA 10', 'JEE Mains – PTA 10 Full Syllabus Mock Test', 'coming_soon', NOW())
ON CONFLICT (test_id) DO UPDATE
SET
  exam_type = EXCLUDED.exam_type,
  code = EXCLUDED.code,
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  updated_at = NOW();

-- ==============================================================================
-- 5. Test Attempts Table
-- Stores completed exam submissions, granular scores, and analysis data.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  test_id TEXT NOT NULL,
  exam_type TEXT NOT NULL,
  code TEXT NOT NULL,
  obtained_marks NUMERIC NOT NULL,
  total_marks NUMERIC NOT NULL,
  percentage NUMERIC NOT NULL,
  accuracy NUMERIC NOT NULL,
  estimated_rank_label TEXT,
  subject_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  time_per_question JSONB NOT NULL DEFAULT '{}'::jsonb,
  mistake_tags JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_test_attempts_user ON public.test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test ON public.test_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_submitted ON public.test_attempts(submitted_at DESC);

-- ==============================================================================
-- 6. Bookmarks Table
-- Stores student bookmarked questions for personal Revision Notebook.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  test_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  exam_type TEXT,
  subject TEXT,
  question_type TEXT,
  mistake_tag TEXT,
  personal_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT bookmarks_user_test_q_key UNIQUE (user_id, test_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);

-- ==============================================================================
-- 7. Error Reports Table
-- Handles student "Report an Error" workflow across Answer Review and Notebook.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.error_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reporter_name TEXT NOT NULL,
  reporter_email TEXT NOT NULL,
  test_id TEXT NOT NULL,
  exam_type TEXT NOT NULL,
  test_code TEXT NOT NULL,
  question_id TEXT NOT NULL,
  question_number INTEGER NOT NULL,
  issue_type TEXT NOT NULL CHECK (issue_type IN ('typo', 'broken_equation', 'wrong_answer_key', 'missing_diagram', 'other')),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved', 'dismissed')),
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_error_reports_status ON public.error_reports(status);
CREATE INDEX IF NOT EXISTS idx_error_reports_test ON public.error_reports(test_id);

-- ==============================================================================
-- 8. Row Level Security (RLS) & Helper Functions
-- ==============================================================================

-- Helper function: Safely check if current authenticated user has 'admin' role
-- SECURITY DEFINER prevents infinite RLS recursion loops
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
END;
$$;

-- Enable RLS on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_reports ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- RLS Policies: Profiles
-- ------------------------------------------------------------------------------
-- Users can view their own profile; Admins can view all profiles
CREATE POLICY "profiles_select_policy"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id
    OR public.is_admin()
  );

-- Users can update their own profile name and target exam, but cannot change their role
CREATE POLICY "profiles_update_policy"
  ON public.profiles
  FOR UPDATE
  USING (
    auth.uid() = id
    OR public.is_admin()
  )
  WITH CHECK (
    (
      auth.uid() = id
      AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    )
    OR public.is_admin()
  );

-- ------------------------------------------------------------------------------
-- RLS Policies: Test Configs
-- ------------------------------------------------------------------------------
-- Anyone (including unauthenticated visitors) can read test configs
CREATE POLICY "test_configs_select_public"
  ON public.test_configs
  FOR SELECT
  USING (true);

-- Only admins can insert or update test configurations
CREATE POLICY "test_configs_admin_write"
  ON public.test_configs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- RLS Policies: Test Attempts
-- ------------------------------------------------------------------------------
-- Students read their own test attempts; Admins read all attempts
CREATE POLICY "test_attempts_select_policy"
  ON public.test_attempts
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_admin()
  );

-- Authenticated students insert their own test attempts
CREATE POLICY "test_attempts_insert_policy"
  ON public.test_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Students can update mistake tags on their own test attempts
CREATE POLICY "test_attempts_update_policy"
  ON public.test_attempts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- RLS Policies: Bookmarks (Revision Notebook)
-- ------------------------------------------------------------------------------
-- Students have full CRUD access strictly to their own bookmarks
CREATE POLICY "bookmarks_select_policy"
  ON public.bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "bookmarks_insert_policy"
  ON public.bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookmarks_update_policy"
  ON public.bookmarks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookmarks_delete_policy"
  ON public.bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- RLS Policies: Error Reports
-- ------------------------------------------------------------------------------
-- Authenticated users can insert error reports
CREATE POLICY "error_reports_insert_policy"
  ON public.error_reports
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Students can view error reports they filed; Admins can view all reports
CREATE POLICY "error_reports_select_policy"
  ON public.error_reports
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_admin()
  );

-- Only admins can update error reports (status, admin notes)
CREATE POLICY "error_reports_update_admin"
  ON public.error_reports
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 9. How to elevate your account to Admin
-- Run the following command in Supabase SQL Editor with your email:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
-- ==============================================================================
