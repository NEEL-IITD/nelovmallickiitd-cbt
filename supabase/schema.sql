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
  email TEXT,
  contact_number TEXT,
  auth_method TEXT DEFAULT 'gmail' CHECK (auth_method IN ('google', 'gmail', 'phone', 'email_with_phone')),
  target_exam TEXT CHECK (target_exam IN ('JEE Mains', 'JEE Advanced', 'Both')) DEFAULT 'JEE Advanced',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_email_or_contact CHECK (
    (email ILIKE '%@gmail.com') OR 
    (contact_number IS NOT NULL AND length(trim(contact_number)) >= 10) OR 
    (role = 'admin')
  )
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_contact_number ON public.profiles(contact_number) WHERE contact_number IS NOT NULL;

-- ==============================================================================
-- 3. Trigger: Automatically Create Profile on User Signup (Email, Google & Phone)
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
  v_contact_number TEXT;
  v_auth_method TEXT;
  v_email TEXT;
  v_role TEXT := 'student';
  v_is_phone_user BOOLEAN := FALSE;
BEGIN
  -- Determine if phone-based synthetic user
  IF NEW.email LIKE '%@phone.nelovportal.local' THEN
    v_is_phone_user := TRUE;
    v_email := NULL;
  ELSE
    v_email := NEW.email;
  END IF;

  -- Extract full name from user metadata or fallback
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    CASE WHEN v_is_phone_user THEN 'Student Aspirant' ELSE SPLIT_PART(NEW.email, '@', 1) END,
    'Student Aspirant'
  );

  v_target_exam := COALESCE(
    NEW.raw_user_meta_data->>'target_exam',
    'JEE Advanced'
  );
  IF v_target_exam NOT IN ('JEE Mains', 'JEE Advanced', 'Both') THEN
    v_target_exam := 'JEE Advanced';
  END IF;

  v_contact_number := NEW.raw_user_meta_data->>'contact_number';
  IF v_contact_number IS NOT NULL AND TRIM(v_contact_number) = '' THEN
    v_contact_number := NULL;
  END IF;

  v_auth_method := COALESCE(
    NEW.raw_user_meta_data->>'auth_method',
    CASE 
      WHEN v_is_phone_user THEN 'phone'
      WHEN NEW.raw_app_meta_data->>'provider' = 'google' THEN 'google'
      WHEN v_email ILIKE '%@gmail.com' THEN 'gmail'
      ELSE 'email_with_phone'
    END
  );

  -- Auto Admin Recognition:
  IF LOWER(COALESCE(NEW.email, '')) = LOWER('YOUR_ADMIN_EMAIL@gmail.com')
     OR LOWER(COALESCE(NEW.email, '')) IN ('nelovmallick@gmail.com', 'mallicknelov@gmail.com', 'nelovmallick@iitd.ac.in')
     OR LOWER(COALESCE(v_email, '')) = LOWER('YOUR_ADMIN_EMAIL@gmail.com')
     OR LOWER(COALESCE(v_email, '')) IN ('nelovmallick@gmail.com', 'mallicknelov@gmail.com', 'nelovmallick@iitd.ac.in') THEN
    v_role := 'admin';
  END IF;

  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    contact_number,
    auth_method,
    target_exam,
    role,
    created_at,
    last_login_at
  )
  VALUES (
    NEW.id,
    v_full_name,
    v_email,
    v_contact_number,
    v_auth_method,
    v_target_exam,
    v_role,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    email = COALESCE(EXCLUDED.email, profiles.email),
    contact_number = COALESCE(EXCLUDED.contact_number, profiles.contact_number),
    auth_method = COALESCE(EXCLUDED.auth_method, profiles.auth_method),
    role = CASE WHEN v_role = 'admin' THEN 'admin' ELSE profiles.role END,
    last_login_at = NOW();

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

  -- JEE Mains (PTM 01 through PTM 10 initially Coming Soon)
  ('jee-mains-ptm-01', 'JEE Mains', 'PTM 01', 'JEE Mains – PTM 01 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-02', 'JEE Mains', 'PTM 02', 'JEE Mains – PTM 02 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-03', 'JEE Mains', 'PTM 03', 'JEE Mains – PTM 03 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-04', 'JEE Mains', 'PTM 04', 'JEE Mains – PTM 04 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-05', 'JEE Mains', 'PTM 05', 'JEE Mains – PTM 05 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-06', 'JEE Mains', 'PTM 06', 'JEE Mains – PTM 06 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-07', 'JEE Mains', 'PTM 07', 'JEE Mains – PTM 07 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-08', 'JEE Mains', 'PTM 08', 'JEE Mains – PTM 08 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-09', 'JEE Mains', 'PTM 09', 'JEE Mains – PTM 09 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-10', 'JEE Mains', 'PTM 10', 'JEE Mains – PTM 10 Full Syllabus Mock Test', 'coming_soon', NOW())
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
  reporter_contact_number TEXT,
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
-- Students have full CRUD access strictly to their own bookmarks; Admins can view all bookmarks
CREATE POLICY "bookmarks_select_policy"
  ON public.bookmarks
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_admin()
  );

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
-- 9. Lecture Progress Table (Video Lectures Hub)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.lecture_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_slug TEXT NOT NULL,
  video_id TEXT NOT NULL,
  lecture_number TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  personal_note TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_video UNIQUE (user_id, video_id)
);

CREATE INDEX IF NOT EXISTS idx_lecture_progress_user ON public.lecture_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lecture_progress_chapter ON public.lecture_progress(chapter_slug);

ALTER TABLE public.lecture_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lecture_progress_select_policy"
  ON public.lecture_progress
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_admin()
  );

CREATE POLICY "lecture_progress_insert_policy"
  ON public.lecture_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lecture_progress_update_policy"
  ON public.lecture_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lecture_progress_delete_policy"
  ON public.lecture_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- ==============================================================================
-- 10. Physics Chapter Progress Table
-- Tracks student chapter theory completion, bookmarks, and overall exercise progress
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.physics_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  chapter_code TEXT NOT NULL, -- 'C1' to 'C28'
  chapter_name TEXT NOT NULL,
  unit_category TEXT NOT NULL,
  theory_completed BOOLEAN NOT NULL DEFAULT FALSE,
  exercises_attempted JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_exercises_count INT NOT NULL DEFAULT 1,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT physics_progress_user_chapter_key UNIQUE (user_id, chapter_code)
);

CREATE INDEX IF NOT EXISTS idx_physics_progress_user ON public.physics_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_physics_progress_chapter ON public.physics_progress(chapter_code);
CREATE INDEX IF NOT EXISTS idx_physics_progress_activity ON public.physics_progress(last_activity_at DESC);

-- ==============================================================================
-- 11. Physics Exercise Attempts Table
-- Stores student online CBT test submissions for individual chapter exercises
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.physics_exercise_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  chapter_code TEXT NOT NULL, -- e.g. 'C8'
  chapter_name TEXT NOT NULL, -- e.g. 'Rotational Motion'
  exercise_id TEXT NOT NULL, -- e.g. 'c8-ex1', 'c1-ex-comb'
  exercise_title TEXT NOT NULL, -- e.g. 'Exercise 1'
  target_exam TEXT DEFAULT 'Both', -- 'JEE Mains', 'JEE Advanced', 'Both'
  total_questions INT NOT NULL DEFAULT 25,
  answered_count INT NOT NULL DEFAULT 0,
  marked_for_review_count INT NOT NULL DEFAULT 0,
  obtained_marks NUMERIC NOT NULL DEFAULT 0,
  total_marks NUMERIC NOT NULL DEFAULT 100,
  percentage NUMERIC NOT NULL DEFAULT 0,
  accuracy NUMERIC NOT NULL DEFAULT 0,
  time_spent_seconds INT NOT NULL DEFAULT 0,
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_physics_attempts_user ON public.physics_exercise_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_physics_attempts_chapter ON public.physics_exercise_attempts(chapter_code);
CREATE INDEX IF NOT EXISTS idx_physics_attempts_exercise ON public.physics_exercise_attempts(exercise_id);
CREATE INDEX IF NOT EXISTS idx_physics_attempts_submitted ON public.physics_exercise_attempts(submitted_at DESC);

-- RLS for Physics Tables
ALTER TABLE public.physics_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physics_exercise_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own physics progress"
  ON public.physics_progress
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own physics progress"
  ON public.physics_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own physics progress"
  ON public.physics_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own physics exercise attempts"
  ON public.physics_exercise_attempts
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own physics exercise attempts"
  ON public.physics_exercise_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Summary view for Admin Dashboard
CREATE OR REPLACE VIEW public.admin_physics_summary AS
SELECT
  p.chapter_code,
  p.chapter_name,
  COUNT(DISTINCT p.user_id) AS total_students_studying,
  COUNT(DISTINCT CASE WHEN p.theory_completed THEN p.user_id END) AS total_theory_completions,
  COUNT(a.id) AS total_exercise_attempts,
  ROUND(AVG(a.percentage), 2) AS avg_score_pct
FROM public.physics_progress p
LEFT JOIN public.physics_exercise_attempts a ON p.user_id = a.user_id AND p.chapter_code = a.chapter_code
GROUP BY p.chapter_code, p.chapter_name
ORDER BY p.chapter_code;

GRANT SELECT ON public.admin_physics_summary TO authenticated;

-- ==============================================================================
-- 12. How to elevate your account to Admin
-- Run the following command in Supabase SQL Editor with your email:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
-- ==============================================================================
