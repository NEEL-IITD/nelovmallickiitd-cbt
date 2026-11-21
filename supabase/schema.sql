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
  accepted_terms_at TIMESTAMPTZ,
  accepted_terms_version TEXT,
  parental_consent_confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_email_or_contact CHECK (
    (auth_method IN ('google', 'gmail') AND email IS NOT NULL) OR
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
SET search_path = ''
AS $$
DECLARE
  v_full_name TEXT;
  v_target_exam TEXT;
  v_contact_number TEXT;
  v_auth_method TEXT;
  v_email TEXT;
  v_role TEXT := 'student';
  v_is_phone_user BOOLEAN := FALSE;
  v_accepted_terms_at TIMESTAMPTZ := NULL;
  v_accepted_terms_version TEXT := NULL;
  v_parental_consent BOOLEAN := FALSE;
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
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    CASE
      WHEN v_is_phone_user THEN 'Student Aspirant'
      WHEN v_email IS NOT NULL AND POSITION('@' IN v_email) > 1 THEN SPLIT_PART(v_email, '@', 1)
      ELSE 'Student Aspirant'
    END
  );

  v_target_exam := COALESCE(
    NEW.raw_user_meta_data->>'target_exam',
    'JEE Advanced'
  );
  IF v_target_exam NOT IN ('JEE Mains', 'JEE Advanced', 'Both') THEN
    v_target_exam := 'JEE Advanced';
  END IF;

  v_contact_number := NULLIF(TRIM(NEW.raw_user_meta_data->>'contact_number'), '');

  -- Determine Auth Method (Google OAuth vs Gmail vs Phone)
  IF NEW.raw_app_meta_data->>'provider' = 'google' OR NEW.raw_user_meta_data->>'auth_method' = 'google' THEN
    v_auth_method := 'google';
  ELSIF v_is_phone_user THEN
    v_auth_method := 'phone';
  ELSIF v_email ILIKE '%@gmail.com' THEN
    v_auth_method := 'gmail';
  ELSE
    v_auth_method := COALESCE(NEW.raw_user_meta_data->>'auth_method', 'google');
  END IF;

  -- Extract legal consent and parental approval metadata
  IF NEW.raw_user_meta_data->>'accepted_terms_at' IS NOT NULL THEN
    BEGIN
      v_accepted_terms_at := (NEW.raw_user_meta_data->>'accepted_terms_at')::TIMESTAMPTZ;
    EXCEPTION WHEN OTHERS THEN
      v_accepted_terms_at := NOW();
    END;
  END IF;

  v_accepted_terms_version := NEW.raw_user_meta_data->>'accepted_terms_version';

  IF NEW.raw_user_meta_data->>'parental_consent_confirmed' IS NOT NULL THEN
    v_parental_consent := COALESCE((NEW.raw_user_meta_data->>'parental_consent_confirmed')::BOOLEAN, FALSE);
  END IF;

  -- Auto Admin Recognition:
  IF LOWER(COALESCE(NEW.email, '')) IN (
    'mallicknelov@gmail.com',
    'nelovmallick@gmail.com',
    'nelovmallick@iitd.ac.in'
  ) OR LOWER(COALESCE(v_email, '')) IN (
    'mallicknelov@gmail.com',
    'nelovmallick@gmail.com',
    'nelovmallick@iitd.ac.in'
  ) THEN
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
    accepted_terms_at,
    accepted_terms_version,
    parental_consent_confirmed,
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
    v_accepted_terms_at,
    v_accepted_terms_version,
    v_parental_consent,
    COALESCE(NEW.created_at, NOW()),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    contact_number = COALESCE(EXCLUDED.contact_number, public.profiles.contact_number),
    auth_method = COALESCE(EXCLUDED.auth_method, public.profiles.auth_method),
    target_exam = COALESCE(EXCLUDED.target_exam, public.profiles.target_exam),
    role = CASE WHEN v_role = 'admin' THEN 'admin' ELSE public.profiles.role END,
    accepted_terms_at = COALESCE(public.profiles.accepted_terms_at, EXCLUDED.accepted_terms_at),
    accepted_terms_version = COALESCE(public.profiles.accepted_terms_version, EXCLUDED.accepted_terms_version),
    parental_consent_confirmed = COALESCE(public.profiles.parental_consent_confirmed, EXCLUDED.parental_consent_confirmed),
    last_login_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Self-Service Account Deletion Function
CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID;
  v_role TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to delete an account.';
  END IF;

  -- Safety Guard: Ensure admin cannot accidentally delete their account via self-service
  SELECT role INTO v_role FROM public.profiles WHERE id = v_user_id;
  IF v_role = 'admin' THEN
    RAISE EXCEPTION 'Admin accounts cannot be self-deleted to prevent accidental management lockouts.';
  END IF;

  -- Scrub PII from past error reports submitted by this user
  UPDATE public.error_reports
  SET reporter_name = 'Deleted User',
      reporter_email = NULL
  WHERE user_id = v_user_id;

  -- Delete from auth.users (cascades to all user records)
  DELETE FROM auth.users WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', TRUE,
    'message', 'Your account and all associated test records, bookmarks, and data have been permanently erased.'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.delete_my_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;

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
  is_scheduled_window BOOLEAN NOT NULL DEFAULT FALSE,
  starts_at TIMESTAMPTZ NULL,
  ends_at TIMESTAMPTZ NULL,
  window_label TEXT NULL,
  lock_leaderboard_until_end BOOLEAN NOT NULL DEFAULT TRUE,
  allow_practice_after_end BOOLEAN NOT NULL DEFAULT TRUE,
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
  time_taken_seconds INTEGER DEFAULT 0,
  attempted_in_live_window BOOLEAN NOT NULL DEFAULT FALSE,
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
-- SECURITY DEFINER prevents infinite RLS recursion loops; searches path securely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_jwt_email TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Step A: Check role directly in public.profiles
  IF EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  ) THEN
    RETURN TRUE;
  END IF;

  -- Step B: Fallback check against verified email in Supabase JWT claim
  v_jwt_email := LOWER(COALESCE(
    auth.jwt()->>'email',
    current_setting('request.jwt.claim.email', true)
  ));

  IF v_jwt_email IN (
    'mallicknelov@gmail.com',
    'nelovmallick@gmail.com',
    'nelovmallick@iitd.ac.in'
  ) THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
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
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id
    OR public.is_admin()
  );

-- Users can insert their own profile on signup/self-healing sync; Admins can insert any profile
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = id
    OR public.is_admin()
  );

-- Users can update their own profile; Admins can update any profile
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy"
  ON public.profiles
  FOR UPDATE
  USING (
    auth.uid() = id
    OR public.is_admin()
  )
  WITH CHECK (
    auth.uid() = id
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
-- 13. Scheduled All-India Mock Windows & 1st-Attempt-Only Live Leaderboards
-- ==============================================================================

-- ==============================================================================
-- Migration: 2026_leaderboard_and_mock_windows.sql
-- Description:
--   1. Add Scheduled All-India Mock Window columns to public.test_configs
--   2. Add time_taken_seconds & attempted_in_live_window to public.test_attempts
--   3. Server-side start-time check trigger on public.test_attempts
--   4. Privacy-safe, 1st-Attempt-Only Leaderboard RPCs:
--      - public.get_test_leaderboard(p_test_id text)
--      - public.get_test_toppers_summary()
--      - public.get_overall_leaderboard()
-- Non-destructive & Idempotent. Preserves all student records, PTM/PTA tests, and attempts.
-- ==============================================================================

-- 1. Schedule Columns on public.test_configs
ALTER TABLE public.test_configs
  ADD COLUMN IF NOT EXISTS is_scheduled_window BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS starts_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS window_label TEXT NULL,
  ADD COLUMN IF NOT EXISTS lock_leaderboard_until_end BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS allow_practice_after_end BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. Performance & Attempt Columns on public.test_attempts
ALTER TABLE public.test_attempts
  ADD COLUMN IF NOT EXISTS time_taken_seconds INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS attempted_in_live_window BOOLEAN NOT NULL DEFAULT FALSE;

-- High-performance indexes
CREATE INDEX IF NOT EXISTS idx_test_attempts_test_user_sub 
  ON public.test_attempts(test_id, user_id, submitted_at ASC);

CREATE INDEX IF NOT EXISTS idx_test_attempts_leaderboard_rank 
  ON public.test_attempts(test_id, obtained_marks DESC, accuracy DESC);

CREATE INDEX IF NOT EXISTS idx_test_configs_schedule_active 
  ON public.test_configs(is_scheduled_window, starts_at, ends_at);

-- 3. Server-Side Start-Time Protection Trigger
CREATE OR REPLACE FUNCTION public.check_test_attempt_window_start()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $window_trigger$
DECLARE
  v_cfg RECORD;
  v_is_admin BOOLEAN;
BEGIN
  -- Admin bypass for previews and verification
  v_is_admin := public.is_admin();
  IF v_is_admin THEN
    RETURN NEW;
  END IF;

  -- Look up test schedule config
  SELECT is_scheduled_window, starts_at, ends_at
  INTO v_cfg
  FROM public.test_configs
  WHERE test_id = NEW.test_id;

  IF FOUND AND v_cfg.is_scheduled_window = TRUE AND v_cfg.starts_at IS NOT NULL THEN
    -- Block attempts if window has not started yet
    IF NOW() < v_cfg.starts_at THEN
      RAISE EXCEPTION 'This scheduled test window has not started yet. Starts at %', v_cfg.starts_at;
    END IF;

    -- Tag attempts completed inside the official live window
    IF v_cfg.ends_at IS NOT NULL AND NOW() <= v_cfg.ends_at THEN
      NEW.attempted_in_live_window := TRUE;
    END IF;
  END IF;

  RETURN NEW;
END;
$window_trigger$;

DROP TRIGGER IF EXISTS trg_check_test_attempt_window ON public.test_attempts;
CREATE TRIGGER trg_check_test_attempt_window
  BEFORE INSERT ON public.test_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.check_test_attempt_window_start();


-- 4. RPC 1 — public.get_test_leaderboard(p_test_id text)
CREATE OR REPLACE FUNCTION public.get_test_leaderboard(p_test_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $leaderboard$
DECLARE
  v_cfg RECORD;
  v_is_admin BOOLEAN;
  v_total_participants INT;
  v_avg_marks NUMERIC;
  v_high_marks NUMERIC;
  v_entries JSONB := '[]'::jsonb;
  v_topper JSONB := NULL;
  v_my_standing JSONB := NULL;
  v_my_attempt_submitted BOOLEAN := FALSE;
  v_current_uid UUID;
BEGIN
  v_current_uid := auth.uid();
  v_is_admin := public.is_admin();

  -- Get test schedule configuration
  SELECT test_id, is_scheduled_window, starts_at, ends_at, lock_leaderboard_until_end
  INTO v_cfg
  FROM public.test_configs
  WHERE test_id = p_test_id;

  -- Check if current user has submitted an attempt
  IF v_current_uid IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.test_attempts
      WHERE test_id = p_test_id AND user_id = v_current_uid
    ) INTO v_my_attempt_submitted;
  END IF;

  -- Check if leaderboard should be locked (scheduled window open & locked, non-admin)
  IF FOUND 
     AND v_cfg.is_scheduled_window = TRUE 
     AND v_cfg.lock_leaderboard_until_end = TRUE 
     AND v_cfg.ends_at IS NOT NULL 
     AND NOW() < v_cfg.ends_at 
     AND NOT v_is_admin THEN

    -- Count total unique participants who submitted their 1st attempt so far
    SELECT COUNT(DISTINCT a.user_id)
    INTO v_total_participants
    FROM public.test_attempts a
    JOIN public.profiles p ON p.id = a.user_id
    WHERE a.test_id = p_test_id
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (p.email IS NULL OR LOWER(p.email) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com'));

    RETURN jsonb_build_object(
      'locked', TRUE,
      'unlocks_at', v_cfg.ends_at,
      'total_participants', COALESCE(v_total_participants, 0),
      'my_attempt_submitted', v_my_attempt_submitted,
      'entries', '[]'::jsonb,
      'my_standing', NULL,
      'topper', NULL
    );
  END IF;

  -- Compute official 1st-attempt summary stats
  WITH first_attempts AS (
    SELECT DISTINCT ON (a.user_id)
      a.id,
      a.user_id,
      a.obtained_marks,
      a.total_marks,
      a.percentage,
      a.accuracy,
      COALESCE(a.time_taken_seconds, 0) AS time_taken_seconds,
      a.submitted_at,
      a.attempted_in_live_window,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name,
      (v_current_uid IS NOT NULL AND a.user_id = v_current_uid) AS is_current_user
    FROM public.test_attempts a
    JOIN public.profiles p ON p.id = a.user_id
    WHERE a.test_id = p_test_id
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (p.email IS NULL OR LOWER(p.email) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com'))
    ORDER BY a.user_id, a.submitted_at ASC, a.id ASC
  ),
  ranked AS (
    SELECT
      f.*,
      COUNT(*) OVER () AS total_students,
      RANK() OVER (ORDER BY f.obtained_marks DESC, f.accuracy DESC, f.time_taken_seconds ASC, f.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (ORDER BY f.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
         NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100, 
        2
      ) AS computed_percentile
    FROM first_attempts f
  )
  SELECT
    COALESCE(MAX(total_students), 0),
    ROUND(COALESCE(AVG(obtained_marks), 0), 1),
    COALESCE(MAX(obtained_marks), 0)
  INTO v_total_participants, v_avg_marks, v_high_marks
  FROM ranked;

  -- Build Top 100 Entries JSON
  WITH first_attempts AS (
    SELECT DISTINCT ON (a.user_id)
      a.id,
      a.user_id,
      a.obtained_marks,
      a.total_marks,
      a.percentage,
      a.accuracy,
      COALESCE(a.time_taken_seconds, 0) AS time_taken_seconds,
      a.submitted_at,
      a.attempted_in_live_window,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name,
      (v_current_uid IS NOT NULL AND a.user_id = v_current_uid) AS is_current_user
    FROM public.test_attempts a
    JOIN public.profiles p ON p.id = a.user_id
    WHERE a.test_id = p_test_id
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (p.email IS NULL OR LOWER(p.email) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com'))
    ORDER BY a.user_id, a.submitted_at ASC, a.id ASC
  ),
  ranked AS (
    SELECT
      f.*,
      COUNT(*) OVER () AS total_students,
      RANK() OVER (ORDER BY f.obtained_marks DESC, f.accuracy DESC, f.time_taken_seconds ASC, f.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (ORDER BY f.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
         NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100, 
        2
      ) AS computed_percentile
    FROM first_attempts f
  )
  SELECT 
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'rank', r.computed_rank,
          'display_name', r.display_name,
          'marks', r.obtained_marks,
          'max_marks', r.total_marks,
          'percentage', ROUND(r.percentage, 2),
          'percentile', r.computed_percentile,
          'accuracy', ROUND(r.accuracy, 1),
          'time_taken_seconds', r.time_taken_seconds,
          'submitted_at', r.submitted_at,
          'attempted_in_live_window', r.attempted_in_live_window,
          'is_current_user', r.is_current_user
        ) ORDER BY r.computed_rank ASC, r.time_taken_seconds ASC
      ), 
      '[]'::jsonb
    )
  INTO v_entries
  FROM (
    SELECT * FROM ranked ORDER BY computed_rank ASC, time_taken_seconds ASC LIMIT 100
  ) r;

  -- Extract Topper (Rank #1)
  IF jsonb_array_length(v_entries) > 0 THEN
    v_topper := v_entries->0;
  END IF;

  -- Extract Current User Standing
  IF v_current_uid IS NOT NULL THEN
    WITH first_attempts AS (
      SELECT DISTINCT ON (a.user_id)
        a.id,
        a.user_id,
        a.obtained_marks,
        a.total_marks,
        a.percentage,
        a.accuracy,
        COALESCE(a.time_taken_seconds, 0) AS time_taken_seconds,
        a.submitted_at,
        a.attempted_in_live_window,
        COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name,
        (a.user_id = v_current_uid) AS is_current_user
      FROM public.test_attempts a
      JOIN public.profiles p ON p.id = a.user_id
      WHERE a.test_id = p_test_id
        AND (p.role IS NULL OR p.role <> 'admin')
        AND (p.email IS NULL OR LOWER(p.email) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com'))
      ORDER BY a.user_id, a.submitted_at ASC, a.id ASC
    ),
    ranked AS (
      SELECT
        f.*,
        COUNT(*) OVER () AS total_students,
        RANK() OVER (ORDER BY f.obtained_marks DESC, f.accuracy DESC, f.time_taken_seconds ASC, f.submitted_at ASC) AS computed_rank,
        ROUND(
          (COUNT(*) OVER (ORDER BY f.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
           NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100, 
          2
        ) AS computed_percentile
      FROM first_attempts f
    )
    SELECT jsonb_build_object(
      'rank', r.computed_rank,
      'display_name', r.display_name,
      'marks', r.obtained_marks,
      'max_marks', r.total_marks,
      'percentage', ROUND(r.percentage, 2),
      'percentile', r.computed_percentile,
      'accuracy', ROUND(r.accuracy, 1),
      'time_taken_seconds', r.time_taken_seconds,
      'submitted_at', r.submitted_at,
      'attempted_in_live_window', r.attempted_in_live_window,
      'is_current_user', TRUE
    )
    INTO v_my_standing
    FROM ranked r
    WHERE r.user_id = v_current_uid;
  END IF;

  RETURN jsonb_build_object(
    'locked', FALSE,
    'unlocks_at', v_cfg.ends_at,
    'total_participants', COALESCE(v_total_participants, 0),
    'average_marks', COALESCE(v_avg_marks, 0),
    'highest_marks', COALESCE(v_high_marks, 0),
    'topper', v_topper,
    'my_standing', v_my_standing,
    'entries', v_entries
  );
END;
$leaderboard$;


-- 5. RPC 2 — public.get_test_toppers_summary()
CREATE OR REPLACE FUNCTION public.get_test_toppers_summary()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $toppers_summary$
DECLARE
  v_is_admin BOOLEAN;
  v_result JSONB := '[]'::jsonb;
BEGIN
  v_is_admin := public.is_admin();

  WITH test_summary AS (
    SELECT
      c.test_id,
      c.code,
      c.title,
      c.exam_type,
      c.is_scheduled_window,
      c.starts_at,
      c.ends_at,
      c.window_label,
      (c.is_scheduled_window = TRUE 
       AND c.lock_leaderboard_until_end = TRUE 
       AND c.ends_at IS NOT NULL 
       AND NOW() < c.ends_at 
       AND NOT v_is_admin) AS is_locked
    FROM public.test_configs c
  ),
  first_attempts AS (
    SELECT DISTINCT ON (a.test_id, a.user_id)
      a.test_id,
      a.user_id,
      a.obtained_marks,
      a.total_marks,
      a.accuracy,
      COALESCE(a.time_taken_seconds, 0) AS time_taken_seconds,
      a.submitted_at,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name
    FROM public.test_attempts a
    JOIN public.profiles p ON p.id = a.user_id
    WHERE (p.role IS NULL OR p.role <> 'admin')
      AND (p.email IS NULL OR LOWER(p.email) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com'))
    ORDER BY a.test_id, a.user_id, a.submitted_at ASC, a.id ASC
  ),
  ranked AS (
    SELECT
      fa.*,
      COUNT(*) OVER (PARTITION BY fa.test_id) AS total_participants,
      RANK() OVER (PARTITION BY fa.test_id ORDER BY fa.obtained_marks DESC, fa.accuracy DESC, fa.time_taken_seconds ASC, fa.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (PARTITION BY fa.test_id ORDER BY fa.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
         NULLIF(COUNT(*) OVER (PARTITION BY fa.test_id), 0)::NUMERIC) * 100,
        2
      ) AS computed_percentile
    FROM first_attempts fa
  ),
  toppers AS (
    SELECT *
    FROM ranked
    WHERE computed_rank = 1
  )
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'test_id', ts.test_id,
        'code', ts.code,
        'title', ts.title,
        'exam_type', ts.exam_type,
        'is_scheduled_window', ts.is_scheduled_window,
        'starts_at', ts.starts_at,
        'ends_at', ts.ends_at,
        'window_label', ts.window_label,
        'is_locked', ts.is_locked,
        'total_participants', COALESCE(top.total_participants, 0),
        'topper_name', CASE WHEN ts.is_locked THEN NULL ELSE top.display_name END,
        'topper_marks', CASE WHEN ts.is_locked THEN NULL ELSE top.obtained_marks END,
        'max_marks', CASE WHEN ts.is_locked THEN NULL ELSE top.total_marks END,
        'topper_percentile', CASE WHEN ts.is_locked THEN NULL ELSE top.computed_percentile END
      ) ORDER BY ts.test_id ASC
    ),
    '[]'::jsonb
  )
  INTO v_result
  FROM test_summary ts
  LEFT JOIN toppers top ON top.test_id = ts.test_id;

  RETURN v_result;
END;
$toppers_summary$;


-- 6. RPC 3 — public.get_overall_leaderboard()
CREATE OR REPLACE FUNCTION public.get_overall_leaderboard()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $overall_leaderboard$
DECLARE
  v_current_uid UUID;
  v_is_admin BOOLEAN;
  v_result JSONB := '[]'::jsonb;
BEGIN
  v_current_uid := auth.uid();
  v_is_admin := public.is_admin();

  WITH unlocked_tests AS (
    SELECT test_id
    FROM public.test_configs
    WHERE NOT (
      is_scheduled_window = TRUE 
      AND lock_leaderboard_until_end = TRUE 
      AND ends_at IS NOT NULL 
      AND NOW() < ends_at
      AND NOT v_is_admin
    )
  ),
  first_attempts AS (
    SELECT DISTINCT ON (a.test_id, a.user_id)
      a.test_id,
      a.user_id,
      a.obtained_marks,
      a.total_marks,
      a.percentage,
      a.accuracy,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name,
      (v_current_uid IS NOT NULL AND a.user_id = v_current_uid) AS is_current_user
    FROM public.test_attempts a
    JOIN public.profiles p ON p.id = a.user_id
    JOIN unlocked_tests ut ON ut.test_id = a.test_id
    WHERE (p.role IS NULL OR p.role <> 'admin')
      AND (p.email IS NULL OR LOWER(p.email) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com'))
    ORDER BY a.test_id, a.user_id, a.submitted_at ASC, a.id ASC
  ),
  per_test_percentiles AS (
    SELECT
      fa.*,
      ROUND(
        (COUNT(*) OVER (PARTITION BY fa.test_id ORDER BY fa.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
         NULLIF(COUNT(*) OVER (PARTITION BY fa.test_id), 0)::NUMERIC) * 100,
        2
      ) AS test_percentile
    FROM first_attempts fa
  ),
  student_aggregates AS (
    SELECT
      user_id,
      MAX(display_name) AS display_name,
      BOOL_OR(is_current_user) AS is_current_user,
      COUNT(DISTINCT test_id) AS tests_attempted,
      ROUND(AVG(test_percentile), 2) AS avg_percentile,
      ROUND(AVG(percentage), 2) AS avg_marks_percent,
      SUM(obtained_marks) AS total_marks_scored,
      SUM(total_marks) AS total_max_marks
    FROM per_test_percentiles
    GROUP BY user_id
  ),
  ranked AS (
    SELECT
      sa.*,
      RANK() OVER (ORDER BY sa.avg_percentile DESC, sa.tests_attempted DESC, sa.avg_marks_percent DESC) AS computed_rank
    FROM student_aggregates sa
  )
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'rank', r.computed_rank,
        'display_name', r.display_name,
        'tests_attempted', r.tests_attempted,
        'avg_percentile', r.avg_percentile,
        'avg_marks_percent', r.avg_marks_percent,
        'total_marks_scored', r.total_marks_scored,
        'total_max_marks', r.total_max_marks,
        'is_current_user', r.is_current_user
      ) ORDER BY r.computed_rank ASC
    ),
    '[]'::jsonb
  )
  INTO v_result
  FROM (
    SELECT * FROM ranked ORDER BY computed_rank ASC LIMIT 100
  ) r;

  RETURN v_result;
END;
$overall_leaderboard$;

-- 7. Grant Permissions to authenticated and anon
GRANT SELECT ON public.test_configs TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_test_leaderboard(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_test_toppers_summary() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_overall_leaderboard() TO anon, authenticated;


-- ==============================================================================
-- 14. How to elevate your account to Admin
-- Run the following command in Supabase SQL Editor with your email:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
-- ==============================================================================
