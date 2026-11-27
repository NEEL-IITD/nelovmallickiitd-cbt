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

  -- JEE Mains (PTM 01, PTM 02, and PTM 03 are Live; PTM 04 through PTM 20 Coming Soon)
  ('jee-mains-ptm-01', 'JEE Mains', 'PTM 01', 'JEE Mains – PTM 01 Full Syllabus Mock Test', 'live', NOW()),
  ('jee-mains-ptm-02', 'JEE Mains', 'PTM 02', 'JEE Mains – PTM 02 Full Syllabus Mock Test', 'live', NOW()),
  ('jee-mains-ptm-03', 'JEE Mains', 'PTM 03', 'JEE Mains – PTM 03 Full Syllabus Mock Test', 'live', NOW()),
  ('jee-mains-ptm-04', 'JEE Mains', 'PTM 04', 'JEE Mains – PTM 04 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-05', 'JEE Mains', 'PTM 05', 'JEE Mains – PTM 05 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-06', 'JEE Mains', 'PTM 06', 'JEE Mains – PTM 06 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-07', 'JEE Mains', 'PTM 07', 'JEE Mains – PTM 07 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-08', 'JEE Mains', 'PTM 08', 'JEE Mains – PTM 08 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-09', 'JEE Mains', 'PTM 09', 'JEE Mains – PTM 09 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-10', 'JEE Mains', 'PTM 10', 'JEE Mains – PTM 10 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-11', 'JEE Mains', 'PTM 11', 'JEE Mains – PTM 11 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-12', 'JEE Mains', 'PTM 12', 'JEE Mains – PTM 12 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-13', 'JEE Mains', 'PTM 13', 'JEE Mains – PTM 13 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-14', 'JEE Mains', 'PTM 14', 'JEE Mains – PTM 14 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-15', 'JEE Mains', 'PTM 15', 'JEE Mains – PTM 15 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-16', 'JEE Mains', 'PTM 16', 'JEE Mains – PTM 16 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-17', 'JEE Mains', 'PTM 17', 'JEE Mains – PTM 17 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-18', 'JEE Mains', 'PTM 18', 'JEE Mains – PTM 18 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-19', 'JEE Mains', 'PTM 19', 'JEE Mains – PTM 19 Full Syllabus Mock Test', 'coming_soon', NOW()),
  ('jee-mains-ptm-20', 'JEE Mains', 'PTM 20', 'JEE Mains – PTM 20 Full Syllabus Mock Test', 'coming_soon', NOW())
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
  question_timings JSONB NOT NULL DEFAULT '{}'::jsonb,
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
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT (
    LOWER(COALESCE(auth.jwt()->>'email', '')) = 'mallicknelov@gmail.com'
  );
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

-- Trigger: Prevent unauthorized role escalation to 'admin'
CREATE OR REPLACE FUNCTION public.trg_protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    IF LOWER(COALESCE(NEW.email, '')) <> 'mallicknelov@gmail.com' THEN
      NEW.role := 'student';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_role_before_write ON public.profiles;
CREATE TRIGGER trg_protect_profile_role_before_write
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_protect_profile_role();

-- Users can insert their own profile on signup/self-healing sync; Admins can insert any profile
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    (auth.uid() = id AND (role IS NULL OR role = 'student' OR LOWER(COALESCE(email, '')) = 'mallicknelov@gmail.com'))
    OR (SELECT public.is_admin())
  );

-- Users can update their own profile; Admins can update any profile
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy"
  ON public.profiles
  FOR UPDATE
  USING (
    auth.uid() = id
    OR (SELECT public.is_admin())
  )
  WITH CHECK (
    (SELECT public.is_admin())
    OR (auth.uid() = id AND (role = 'student' OR LOWER(COALESCE(email, '')) = 'mallicknelov@gmail.com'))
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
DROP FUNCTION IF EXISTS public.check_test_attempt_window_start();
DROP FUNCTION IF EXISTS public.check_test_attempt_window();

-- 4. RPC 1 — public.get_test_leaderboard(p_test_id text)
-- Features: Top 5 focus, LEFT JOIN profiles, alias matching, 1st official attempt only, admin override
CREATE OR REPLACE FUNCTION public.get_test_leaderboard(p_test_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_cfg RECORD;
  v_is_admin BOOLEAN;
  v_total_participants INT := 0;
  v_avg_marks NUMERIC := 0;
  v_high_marks NUMERIC := 0;
  v_top_5 JSONB := '[]'::jsonb;
  v_entries JSONB := '[]'::jsonb;
  v_topper JSONB := NULL;
  v_my_standing JSONB := NULL;
  v_my_attempt_submitted BOOLEAN := FALSE;
  v_current_uid UUID;
  v_canonical_id TEXT;
  v_alias_id TEXT;
  v_norm_target TEXT;
BEGIN
  v_current_uid := auth.uid();
  v_is_admin := public.is_admin();

  -- Normalize test ID (e.g., ptm-01 -> jee-mains-ptm-01, pta-04 -> jee-advanced-pta-04)
  v_canonical_id := LOWER(TRIM(p_test_id));
  IF v_canonical_id ~ '^(jee-mains-)?ptm[-_ ]?0*([0-9]+)' THEN
    v_canonical_id := 'jee-mains-ptm-' || LPAD(SUBSTRING(v_canonical_id FROM '[0-9]+'), 2, '0');
  ELSIF v_canonical_id ~ '^(jee-advanced-)?pta[-_ ]?0*([0-9]+)' THEN
    v_canonical_id := 'jee-advanced-pta-' || LPAD(SUBSTRING(v_canonical_id FROM '[0-9]+'), 2, '0');
  END IF;
  v_alias_id := REPLACE(REPLACE(v_canonical_id, 'jee-mains-', ''), 'jee-advanced-', '');
  v_norm_target := LOWER(REGEXP_REPLACE(v_canonical_id, '[^a-z0-9]', '', 'g'));

  -- Get test schedule configuration
  SELECT test_id, is_scheduled_window, starts_at, ends_at, lock_leaderboard_until_end
  INTO v_cfg
  FROM public.test_configs
  WHERE test_id = v_canonical_id 
     OR test_id = p_test_id
     OR LOWER(REGEXP_REPLACE(test_id, '[^a-z0-9]', '', 'g')) = v_norm_target;

  -- Check if current user has submitted an attempt
  IF v_current_uid IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.test_attempts
      WHERE (
        test_id = v_canonical_id 
        OR test_id = v_alias_id 
        OR test_id = p_test_id
        OR LOWER(REGEXP_REPLACE(test_id, '[^a-z0-9]', '', 'g')) = v_norm_target
      )
      AND user_id = v_current_uid
    ) INTO v_my_attempt_submitted;
  END IF;

  -- Check if leaderboard should be locked (scheduled window open & locked, non-admin)
  IF FOUND 
     AND v_cfg.is_scheduled_window = TRUE 
     AND v_cfg.lock_leaderboard_until_end = TRUE 
     AND v_cfg.ends_at IS NOT NULL 
     AND NOW() < v_cfg.ends_at 
     AND NOT v_is_admin THEN

    SELECT COUNT(DISTINCT a.user_id)
    INTO v_total_participants
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    WHERE (
      a.test_id = v_canonical_id 
      OR a.test_id = v_alias_id 
      OR a.test_id = p_test_id
      OR LOWER(REGEXP_REPLACE(a.test_id, '[^a-z0-9]', '', 'g')) = v_norm_target
    )
    AND (p.role IS NULL OR p.role <> 'admin')
    AND (p.email IS NULL OR LOWER(p.email) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'));

    RETURN jsonb_build_object(
      'locked', TRUE,
      'unlocks_at', v_cfg.ends_at,
      'total_participants', COALESCE(v_total_participants, 0),
      'my_attempt_submitted', v_my_attempt_submitted,
      'top_5', '[]'::jsonb,
      'entries', '[]'::jsonb,
      'all_entries', '[]'::jsonb,
      'my_standing', NULL,
      'topper', NULL
    );
  END IF;

  -- 1st official attempt rankings
  -- LEFT JOIN ensures student attempts are never dropped even if profiles sync is delayed
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
    LEFT JOIN public.profiles p ON p.id = a.user_id
    WHERE (
      a.test_id = v_canonical_id 
      OR a.test_id = v_alias_id 
      OR a.test_id = p_test_id
      OR LOWER(REGEXP_REPLACE(a.test_id, '[^a-z0-9]', '', 'g')) = v_norm_target
    )
    AND (p.role IS NULL OR p.role <> 'admin')
    AND (p.email IS NULL OR LOWER(p.email) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
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

  -- Build Top 5 Entries JSON (Strictly LIMIT 5)
  WITH top5_source AS (
    SELECT
      f.*,
      RANK() OVER (ORDER BY f.obtained_marks DESC, f.accuracy DESC, f.time_taken_seconds ASC, f.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (ORDER BY f.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
         NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100, 
        2
      ) AS computed_percentile
    FROM (
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
      LEFT JOIN public.profiles p ON p.id = a.user_id
      WHERE (
        a.test_id = v_canonical_id 
        OR a.test_id = v_alias_id 
        OR a.test_id = p_test_id
        OR LOWER(REGEXP_REPLACE(a.test_id, '[^a-z0-9]', '', 'g')) = v_norm_target
      )
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (p.email IS NULL OR LOWER(p.email) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
      ORDER BY a.user_id, a.submitted_at ASC, a.id ASC
    ) f
  ),
  top5_limited AS (
    SELECT * FROM top5_source
    WHERE computed_rank <= 5
    ORDER BY computed_rank ASC, time_taken_seconds ASC
    LIMIT 5
  )
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'rank', r.computed_rank,
        'display_name', r.display_name,
        'marks', r.obtained_marks,
        'max_marks', r.total_marks,
        'percentage', r.percentage,
        'percentile', r.computed_percentile,
        'accuracy', r.accuracy,
        'time_taken_seconds', r.time_taken_seconds,
        'submitted_at', r.submitted_at,
        'attempted_in_live_window', r.attempted_in_live_window,
        'is_current_user', r.is_current_user
      )
      ORDER BY r.computed_rank ASC, r.time_taken_seconds ASC
    ),
    '[]'::jsonb
  ) INTO v_top_5
  FROM top5_limited r;

  -- Build All Entries JSON (for Admin tab and full scrollable list)
  WITH all_source AS (
    SELECT
      f.*,
      RANK() OVER (ORDER BY f.obtained_marks DESC, f.accuracy DESC, f.time_taken_seconds ASC, f.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (ORDER BY f.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
         NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100, 
        2
      ) AS computed_percentile
    FROM (
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
      LEFT JOIN public.profiles p ON p.id = a.user_id
      WHERE (
        a.test_id = v_canonical_id 
        OR a.test_id = v_alias_id 
        OR a.test_id = p_test_id
        OR LOWER(REGEXP_REPLACE(a.test_id, '[^a-z0-9]', '', 'g')) = v_norm_target
      )
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (p.email IS NULL OR LOWER(p.email) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
      ORDER BY a.user_id, a.submitted_at ASC, a.id ASC
    ) f
  )
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'rank', r.computed_rank,
        'display_name', r.display_name,
        'marks', r.obtained_marks,
        'max_marks', r.total_marks,
        'percentage', r.percentage,
        'percentile', r.computed_percentile,
        'accuracy', r.accuracy,
        'time_taken_seconds', r.time_taken_seconds,
        'submitted_at', r.submitted_at,
        'attempted_in_live_window', r.attempted_in_live_window,
        'is_current_user', r.is_current_user
      )
      ORDER BY r.computed_rank ASC, r.time_taken_seconds ASC
    ),
    '[]'::jsonb
  ) INTO v_entries
  FROM all_source r;

  -- Extract topper (Rank 1)
  IF jsonb_array_length(v_top_5) > 0 THEN
    v_topper := v_top_5->0;
  END IF;

  -- Find current user standing
  IF v_current_uid IS NOT NULL THEN
    SELECT jsonb_build_object(
      'rank', r.computed_rank,
      'display_name', r.display_name,
      'marks', r.obtained_marks,
      'max_marks', r.total_marks,
      'percentage', r.percentage,
      'percentile', r.computed_percentile,
      'accuracy', r.accuracy,
      'time_taken_seconds', r.time_taken_seconds,
      'submitted_at', r.submitted_at,
      'attempted_in_live_window', r.attempted_in_live_window,
      'is_current_user', TRUE
    ) INTO v_my_standing
    FROM (
      SELECT
        f.*,
        RANK() OVER (ORDER BY f.obtained_marks DESC, f.accuracy DESC, f.time_taken_seconds ASC, f.submitted_at ASC) AS computed_rank,
        ROUND(
          (COUNT(*) OVER (ORDER BY f.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
           NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100, 
          2
        ) AS computed_percentile
      FROM (
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
          COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name
        FROM public.test_attempts a
        LEFT JOIN public.profiles p ON p.id = a.user_id
        WHERE (
          a.test_id = v_canonical_id 
          OR a.test_id = v_alias_id 
          OR a.test_id = p_test_id
          OR LOWER(REGEXP_REPLACE(a.test_id, '[^a-z0-9]', '', 'g')) = v_norm_target
        )
        AND (p.role IS NULL OR p.role <> 'admin')
        AND (p.email IS NULL OR LOWER(p.email) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
        ORDER BY a.user_id, a.submitted_at ASC, a.id ASC
      ) f
    ) r
    WHERE r.user_id = v_current_uid;
  END IF;

  RETURN jsonb_build_object(
    'locked', FALSE,
    'unlocks_at', NULL,
    'total_participants', v_total_participants,
    'average_marks', v_avg_marks,
    'highest_marks', v_high_marks,
    'topper', v_topper,
    'top_5', v_top_5,
    'my_standing', v_my_standing,
    'entries', v_entries,
    'all_entries', v_entries,
    'my_attempt_submitted', v_my_attempt_submitted
  );
END;
$$;


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
-- 14. Vault Chapterwise Exercises & Theory Notes Tables
-- Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.vault_exercises (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL CHECK (subject IN ('physics', 'chemistry', 'mathematics')),
  chapter_id TEXT NOT NULL,
  chapter_name TEXT,
  exercise_id TEXT NOT NULL,
  title TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60,
  default_marking JSONB NOT NULL DEFAULT '{"correct": 4, "incorrect": -1, "unattempted": 0}'::jsonb,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_questions INT NOT NULL DEFAULT 0,
  total_marks NUMERIC NOT NULL DEFAULT 0,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vault_exercises_subject ON public.vault_exercises(subject);
CREATE INDEX IF NOT EXISTS idx_vault_exercises_chapter ON public.vault_exercises(chapter_id);
CREATE INDEX IF NOT EXISTS idx_vault_exercises_lookup ON public.vault_exercises(subject, chapter_id, exercise_id);
CREATE INDEX IF NOT EXISTS idx_vault_exercises_updated ON public.vault_exercises(updated_at DESC);

CREATE TABLE IF NOT EXISTS public.vault_theory_notes (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL CHECK (subject IN ('physics', 'chemistry', 'mathematics')),
  chapter_id TEXT NOT NULL,
  chapter_name TEXT,
  title TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  file_name TEXT,
  file_size_bytes BIGINT DEFAULT 0,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vault_theory_subject ON public.vault_theory_notes(subject);
CREATE INDEX IF NOT EXISTS idx_vault_theory_chapter ON public.vault_theory_notes(chapter_id);
CREATE INDEX IF NOT EXISTS idx_vault_theory_lookup ON public.vault_theory_notes(subject, chapter_id);

ALTER TABLE public.vault_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_theory_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vault_exercises_select_public"
  ON public.vault_exercises FOR SELECT USING (true);

CREATE POLICY "vault_exercises_admin_insert"
  ON public.vault_exercises FOR INSERT WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "vault_exercises_admin_update"
  ON public.vault_exercises FOR UPDATE USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "vault_exercises_admin_delete"
  ON public.vault_exercises FOR DELETE USING ((SELECT public.is_admin()));

CREATE POLICY "vault_theory_notes_select_public"
  ON public.vault_theory_notes FOR SELECT USING (true);

CREATE POLICY "vault_theory_notes_admin_insert"
  ON public.vault_theory_notes FOR INSERT WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "vault_theory_notes_admin_update"
  ON public.vault_theory_notes FOR UPDATE USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "vault_theory_notes_admin_delete"
  ON public.vault_theory_notes FOR DELETE USING ((SELECT public.is_admin()));

GRANT SELECT ON public.vault_exercises TO anon, authenticated;
GRANT SELECT ON public.vault_theory_notes TO anon, authenticated;

-- ==============================================================================
-- 15. Supabase Storage (storage.objects) RLS Policies
-- Public read access; Write operations restricted to Director mallicknelov@gmail.com
-- ==============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects') THEN
    BEGIN
      DROP POLICY IF EXISTS "Public Select Storage Objects" ON storage.objects;
      DROP POLICY IF EXISTS "Admin Insert Storage Objects" ON storage.objects;
      DROP POLICY IF EXISTS "Admin Update Storage Objects" ON storage.objects;
      DROP POLICY IF EXISTS "Admin Delete Storage Objects" ON storage.objects;

      CREATE POLICY "Public Select Storage Objects"
        ON storage.objects FOR SELECT USING (true);

      CREATE POLICY "Admin Insert Storage Objects"
        ON storage.objects FOR INSERT WITH CHECK ((SELECT public.is_admin()));

      CREATE POLICY "Admin Update Storage Objects"
        ON storage.objects FOR UPDATE USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

      CREATE POLICY "Admin Delete Storage Objects"
        ON storage.objects FOR DELETE USING ((SELECT public.is_admin()));
    EXCEPTION
      WHEN insufficient_privilege THEN
        RAISE NOTICE 'Notice: storage.objects policy update skipped due to role privileges.';
      WHEN OTHERS THEN
        RAISE NOTICE 'Notice on storage.objects: %', SQLERRM;
    END;
  END IF;
END $$;


-- ==============================================================================
-- Table: public.chapter_progress (Chapterwise 4-Milestone Mastery Tracking)
-- Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.chapter_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR(32) NOT NULL,
  chapter_slug VARCHAR(64) NOT NULL,
  checklist JSONB NOT NULL DEFAULT '{"notes":false,"formula":false,"pyqs":false,"tests":false}'::jsonb,
  progress_percent INT NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_chapter_progress_user_subject_slug UNIQUE (user_id, subject, chapter_slug)
);

CREATE INDEX IF NOT EXISTS idx_chapter_progress_user_subject ON public.chapter_progress(user_id, subject);
CREATE INDEX IF NOT EXISTS idx_chapter_progress_user_slug ON public.chapter_progress(user_id, chapter_slug);
CREATE INDEX IF NOT EXISTS idx_chapter_progress_subject_slug ON public.chapter_progress(subject, chapter_slug);

ALTER TABLE public.chapter_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chapter_progress_select_policy" ON public.chapter_progress;
CREATE POLICY "chapter_progress_select_policy"
  ON public.chapter_progress
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR (SELECT public.is_admin())
  );

DROP POLICY IF EXISTS "chapter_progress_insert_policy" ON public.chapter_progress;
CREATE POLICY "chapter_progress_insert_policy"
  ON public.chapter_progress
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR (SELECT public.is_admin())
  );

DROP POLICY IF EXISTS "chapter_progress_update_policy" ON public.chapter_progress;
CREATE POLICY "chapter_progress_update_policy"
  ON public.chapter_progress
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR (SELECT public.is_admin())
  )
  WITH CHECK (
    auth.uid() = user_id
    OR (SELECT public.is_admin())
  );

DROP POLICY IF EXISTS "chapter_progress_delete_policy" ON public.chapter_progress;
CREATE POLICY "chapter_progress_delete_policy"
  ON public.chapter_progress
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR (SELECT public.is_admin())
  );

GRANT ALL ON TABLE public.chapter_progress TO authenticated;
GRANT ALL ON TABLE public.chapter_progress TO service_role;
GRANT SELECT ON TABLE public.chapter_progress TO anon;


-- ==============================================================================
-- Migration: Best Score Leaderboard (Highest Marks) & Strict Admin Exclusion
-- Platform: NelovMallickIITD CBT Platform (100% Free Forever)
-- Mentor: Nelov Mallick (IIT Delhi)
--
-- Key Enhancements:
-- 1. Switch Leaderboard Ranking from "1st Attempt" to "Highest Marks Attempt":
--    - Uses DISTINCT ON (a.user_id) ORDER BY a.user_id, a.obtained_marks DESC,
--      a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC.
--    - Benchmarks each student by their single best performance across attempts.
-- 2. Strictly Exclude Admin (mallicknelov@gmail.com / role = 'admin'):
--    - Excludes admin attempts from participant counts, toppers, percentiles,
--      averages, and leaderboard entries.
--    - Prevents admin test preview attempts from distorting student rankings.
-- 3. Top 5 Showcase & Public Transparency:
--    - Returns top_5 array with rank, displayName, marks, percentile, accuracy.
--    - Strictly exposes ZERO student emails or contact numbers.
-- ==============================================================================

-- 1. Overhaul public.get_test_leaderboard(p_test_id TEXT)
CREATE OR REPLACE FUNCTION public.get_test_leaderboard(p_test_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_cfg RECORD;
  v_is_admin BOOLEAN := FALSE;
  v_total_participants INT := 0;
  v_avg_marks NUMERIC := 0;
  v_high_marks NUMERIC := 0;
  v_top_5 JSONB := '[]'::jsonb;
  v_entries JSONB := '[]'::jsonb;
  v_topper JSONB := NULL;
  v_my_standing JSONB := NULL;
  v_my_attempt_submitted BOOLEAN := FALSE;
  v_current_uid UUID;
  v_canonical_id TEXT;
  v_alias_id TEXT;
BEGIN
  v_current_uid := auth.uid();
  v_is_admin := public.is_admin();

  -- Normalize test ID (e.g., ptm-01 -> jee-mains-ptm-01, pta-04 -> jee-advanced-pta-04)
  v_canonical_id := LOWER(TRIM(p_test_id));
  IF v_canonical_id ~ '^(jee-mains-)?ptm[-_ ]?0*([0-9]+)' THEN
    v_canonical_id := 'jee-mains-ptm-' || LPAD(SUBSTRING(v_canonical_id FROM '[0-9]+'), 2, '0');
  ELSIF v_canonical_id ~ '^(jee-advanced-)?pta[-_ ]?0*([0-9]+)' THEN
    v_canonical_id := 'jee-advanced-pta-' || LPAD(SUBSTRING(v_canonical_id FROM '[0-9]+'), 2, '0');
  END IF;
  v_alias_id := REPLACE(REPLACE(v_canonical_id, 'jee-mains-', ''), 'jee-advanced-', '');

  -- Get test schedule configuration
  SELECT test_id, is_scheduled_window, starts_at, ends_at, lock_leaderboard_until_end
  INTO v_cfg
  FROM public.test_configs
  WHERE test_id = v_canonical_id OR test_id = p_test_id;

  -- Check if non-admin current user has submitted an attempt
  IF v_current_uid IS NOT NULL AND NOT v_is_admin THEN
    SELECT EXISTS (
      SELECT 1 FROM public.test_attempts
      WHERE (test_id = v_canonical_id OR test_id = v_alias_id OR test_id = p_test_id)
        AND user_id = v_current_uid
    ) INTO v_my_attempt_submitted;
  END IF;

  -- Check if leaderboard should be locked (scheduled window open & locked, non-admin)
  IF FOUND 
     AND v_cfg.is_scheduled_window = TRUE 
     AND v_cfg.lock_leaderboard_until_end = TRUE 
     AND v_cfg.ends_at IS NOT NULL 
     AND NOW() < v_cfg.ends_at 
     AND NOT v_is_admin THEN

    SELECT COUNT(DISTINCT a.user_id)
    INTO v_total_participants
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'));

    RETURN jsonb_build_object(
      'locked', TRUE,
      'unlocks_at', v_cfg.ends_at,
      'total_participants', COALESCE(v_total_participants, 0),
      'my_attempt_submitted', v_my_attempt_submitted,
      'top_5', '[]'::jsonb,
      'entries', '[]'::jsonb,
      'all_entries', '[]'::jsonb,
      'my_standing', NULL,
      'topper', NULL
    );
  END IF;

  -- Best score attempt rankings (Highest Marks)
  -- Exclude all Admin attempts strictly from rankings and statistics
  WITH best_attempts AS (
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
      (v_current_uid IS NOT NULL AND NOT v_is_admin AND a.user_id = v_current_uid) AS is_current_user
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
    ORDER BY a.user_id, a.obtained_marks DESC, a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC
  ),
  ranked AS (
    SELECT
      b.*,
      COUNT(*) OVER () AS total_students,
      RANK() OVER (ORDER BY b.obtained_marks DESC, b.accuracy DESC, b.time_taken_seconds ASC, b.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (ORDER BY b.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
         NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100, 
        2
      ) AS computed_percentile
    FROM best_attempts b
  )
  SELECT
    COALESCE(MAX(total_students), 0),
    ROUND(COALESCE(AVG(obtained_marks), 0), 1),
    COALESCE(MAX(obtained_marks), 0)
  INTO v_total_participants, v_avg_marks, v_high_marks
  FROM ranked;

  -- Build Top 5 Entries JSON (Strictly LIMIT 5)
  WITH top5_source AS (
    SELECT
      b.*,
      RANK() OVER (ORDER BY b.obtained_marks DESC, b.accuracy DESC, b.time_taken_seconds ASC, b.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (ORDER BY b.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
         NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100, 
        2
      ) AS computed_percentile
    FROM (
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
        (v_current_uid IS NOT NULL AND NOT v_is_admin AND a.user_id = v_current_uid) AS is_current_user
      FROM public.test_attempts a
      LEFT JOIN public.profiles p ON p.id = a.user_id
      LEFT JOIN auth.users u ON u.id = a.user_id
      WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
        AND (p.role IS NULL OR p.role <> 'admin')
        AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
      ORDER BY a.user_id, a.obtained_marks DESC, a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC
    ) b
  ),
  top5_limited AS (
    SELECT * FROM top5_source
    ORDER BY computed_rank ASC, time_taken_seconds ASC
    LIMIT 5
  )
  SELECT COALESCE(
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
  INTO v_top_5
  FROM top5_limited r;

  -- Build All Entries JSON (Up to 100)
  WITH all_source AS (
    SELECT
      b.*,
      RANK() OVER (ORDER BY b.obtained_marks DESC, b.accuracy DESC, b.time_taken_seconds ASC, b.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (ORDER BY b.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
         NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100, 
        2
      ) AS computed_percentile
    FROM (
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
        (v_current_uid IS NOT NULL AND NOT v_is_admin AND a.user_id = v_current_uid) AS is_current_user
      FROM public.test_attempts a
      LEFT JOIN public.profiles p ON p.id = a.user_id
      LEFT JOIN auth.users u ON u.id = a.user_id
      WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
        AND (p.role IS NULL OR p.role <> 'admin')
        AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
      ORDER BY a.user_id, a.obtained_marks DESC, a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC
    ) b
  ),
  all_limited AS (
    SELECT * FROM all_source
    ORDER BY computed_rank ASC, time_taken_seconds ASC
    LIMIT 100
  )
  SELECT COALESCE(
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
  FROM all_limited r;

  -- Topper
  IF jsonb_array_length(v_top_5) > 0 THEN
    v_topper := v_top_5->0;
  END IF;

  -- Current User Standing (non-admin only)
  IF v_current_uid IS NOT NULL AND NOT v_is_admin THEN
    WITH my_rank_source AS (
      SELECT
        b.*,
        RANK() OVER (ORDER BY b.obtained_marks DESC, b.accuracy DESC, b.time_taken_seconds ASC, b.submitted_at ASC) AS computed_rank,
        ROUND(
          (COUNT(*) OVER (ORDER BY b.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
           NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100, 
          2
        ) AS computed_percentile
      FROM (
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
          TRUE AS is_current_user
        FROM public.test_attempts a
        LEFT JOIN public.profiles p ON p.id = a.user_id
        LEFT JOIN auth.users u ON u.id = a.user_id
        WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
          AND (p.role IS NULL OR p.role <> 'admin')
          AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
        ORDER BY a.user_id, a.obtained_marks DESC, a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC
      ) b
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
    FROM my_rank_source r
    WHERE r.user_id = v_current_uid
    LIMIT 1;
  END IF;

  RETURN jsonb_build_object(
    'locked', FALSE,
    'unlocks_at', NULL,
    'total_participants', COALESCE(v_total_participants, 0),
    'average_marks', COALESCE(v_avg_marks, 0),
    'highest_marks', COALESCE(v_high_marks, 0),
    'top_5', v_top_5,
    'entries', v_entries,
    'all_entries', v_entries,
    'topper', v_topper,
    'my_standing', v_my_standing,
    'my_attempt_submitted', (v_my_standing IS NOT NULL)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_test_leaderboard(TEXT) TO anon, authenticated, service_role;


-- 2. Overhaul public.get_test_toppers_summary()
-- Ranked by Highest Marks, Excludes Admin attempts, LEFT JOIN profiles & auth.users
CREATE OR REPLACE FUNCTION public.get_test_toppers_summary()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $toppers_summary$
DECLARE
  v_is_admin BOOLEAN := FALSE;
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
  best_attempts AS (
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
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
    ORDER BY a.test_id, a.user_id, a.obtained_marks DESC, a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC
  ),
  ranked AS (
    SELECT
      ba.*,
      COUNT(*) OVER (PARTITION BY ba.test_id) AS total_participants,
      RANK() OVER (PARTITION BY ba.test_id ORDER BY ba.obtained_marks DESC, ba.accuracy DESC, ba.time_taken_seconds ASC, ba.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (PARTITION BY ba.test_id ORDER BY ba.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
         NULLIF(COUNT(*) OVER (PARTITION BY ba.test_id), 0)::NUMERIC) * 100,
        2
      ) AS computed_percentile
    FROM best_attempts ba
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

GRANT EXECUTE ON FUNCTION public.get_test_toppers_summary() TO anon, authenticated, service_role;


-- 3. Overhaul public.get_overall_leaderboard()
-- Ranked across student's best attempts, strictly excludes Admin
CREATE OR REPLACE FUNCTION public.get_overall_leaderboard()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $overall_leaderboard$
DECLARE
  v_current_uid UUID;
  v_is_admin BOOLEAN := FALSE;
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
  best_attempts AS (
    SELECT DISTINCT ON (a.test_id, a.user_id)
      a.test_id,
      a.user_id,
      a.obtained_marks,
      a.total_marks,
      a.percentage,
      a.accuracy,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name,
      (v_current_uid IS NOT NULL AND NOT v_is_admin AND a.user_id = v_current_uid) AS is_current_user
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    JOIN unlocked_tests ut ON (ut.test_id = a.test_id OR ut.test_id = REPLACE(REPLACE(a.test_id, 'jee-mains-', ''), 'jee-advanced-', ''))
    WHERE (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
    ORDER BY a.test_id, a.user_id, a.obtained_marks DESC, a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC
  ),
  per_test_percentiles AS (
    SELECT
      ba.*,
      ROUND(
        (COUNT(*) OVER (PARTITION BY ba.test_id ORDER BY ba.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
         NULLIF(COUNT(*) OVER (PARTITION BY ba.test_id), 0)::NUMERIC) * 100,
        2
      ) AS test_percentile
    FROM best_attempts ba
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
  overall_ranked AS (
    SELECT
      sa.*,
      RANK() OVER (ORDER BY sa.avg_percentile DESC, sa.tests_attempted DESC, sa.total_marks_scored DESC) AS computed_rank
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
  FROM overall_ranked r;

  RETURN v_result;
END;
$overall_leaderboard$;

GRANT EXECUTE ON FUNCTION public.get_overall_leaderboard() TO anon, authenticated, service_role;


-- ==============================================================================
-- Migration: Supabase Auth (Google + Email/Password), Role Security & Cloud Sync
-- Tables: profiles, daily_plans, test_attempts, question_notes_and_mistakes,
--         chapter_progress
-- Security: Strict RLS with TO authenticated + (SELECT auth.uid()) = user_id
-- Non-Destructive: Preserves all existing data, PTM/PTA configs & leaderboards
-- ==============================================================================

-- 1. Upgrade public.profiles cleanly
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS daily_question_goal INTEGER NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS current_streak INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_active_date DATE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_profiles_daily_goal'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT chk_profiles_daily_goal CHECK (daily_question_goal >= 1 AND daily_question_goal <= 500);
  END IF;
END $$;

-- Allow standard email signups ('email') alongside 'google', 'gmail', 'phone', 'email_with_phone'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_auth_method_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_auth_method_check
  CHECK (auth_method IN ('google', 'gmail', 'email', 'phone', 'email_with_phone'));

-- Support 'JEE 2027' alongside existing target_exam values
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_target_exam_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_target_exam_check
  CHECK (target_exam IN ('JEE 2027', 'JEE Mains', 'JEE Advanced', 'Both'));

-- Allow any valid email or contact_number
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS check_email_or_contact;
ALTER TABLE public.profiles
  ADD CONSTRAINT check_email_or_contact CHECK (
    (email IS NOT NULL AND length(trim(email)) >= 3) OR
    (contact_number IS NOT NULL AND length(trim(contact_number)) >= 10) OR
    (role = 'admin')
  );

-- Harden public.is_admin() using profiles.role = 'admin' (preventing forged local role tampering)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'admin'
  );
$$;

-- Protect profile role column against client self-escalation on INSERT/UPDATE
CREATE OR REPLACE FUNCTION public.trg_protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.role IS DISTINCT FROM NEW.role THEN
    -- Disallow authenticated end-users from altering their own role
    IF (SELECT auth.uid()) IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'
    ) THEN
      NEW.role := OLD.role;
    END IF;
  END IF;

  IF NEW.role = 'admin' THEN
    IF LOWER(COALESCE(NEW.email, '')) NOT IN (
      'mallicknelov@gmail.com',
      'nelovmallick@gmail.com',
      'nelovmallick@iitd.ac.in'
    ) AND (TG_OP = 'INSERT' OR OLD.role <> 'admin') THEN
      NEW.role := 'student';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_role_before_write ON public.profiles;
CREATE TRIGGER trg_protect_profile_role_before_write
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_protect_profile_role();

-- Refresh handle_new_user() to capture avatar_url, JEE 2027 default & Google/Email metadata
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
  v_avatar_url TEXT;
  v_role TEXT := 'student';
  v_is_phone_user BOOLEAN := FALSE;
  v_accepted_terms_at TIMESTAMPTZ := NULL;
  v_accepted_terms_version TEXT := NULL;
  v_parental_consent BOOLEAN := FALSE;
BEGIN
  IF NEW.email LIKE '%@phone.nelovportal.local' THEN
    v_is_phone_user := TRUE;
    v_email := NULL;
  ELSE
    v_email := NEW.email;
  END IF;

  v_full_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    CASE
      WHEN v_is_phone_user THEN 'Student Aspirant'
      WHEN v_email IS NOT NULL AND POSITION('@' IN v_email) > 1 THEN SPLIT_PART(v_email, '@', 1)
      ELSE 'Student Aspirant'
    END
  );

  v_avatar_url := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'avatar_url'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'picture'), '')
  );

  v_target_exam := COALESCE(NEW.raw_user_meta_data->>'target_exam', 'JEE 2027');
  IF v_target_exam NOT IN ('JEE 2027', 'JEE Mains', 'JEE Advanced', 'Both') THEN
    v_target_exam := 'JEE 2027';
  END IF;

  v_contact_number := NULLIF(TRIM(NEW.raw_user_meta_data->>'contact_number'), '');

  IF NEW.raw_app_meta_data->>'provider' = 'google' OR NEW.raw_user_meta_data->>'auth_method' = 'google' THEN
    v_auth_method := 'google';
  ELSIF v_is_phone_user THEN
    v_auth_method := 'phone';
  ELSIF v_email ILIKE '%@gmail.com' THEN
    v_auth_method := 'gmail';
  ELSE
    v_auth_method := COALESCE(NEW.raw_user_meta_data->>'auth_method', 'email');
  END IF;

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
    id, full_name, email, avatar_url, contact_number, auth_method, target_exam,
    role, daily_question_goal, accepted_terms_at, accepted_terms_version,
    parental_consent_confirmed, created_at, last_login_at
  )
  VALUES (
    NEW.id, v_full_name, v_email, v_avatar_url, v_contact_number, v_auth_method, v_target_exam,
    v_role, 30, v_accepted_terms_at, v_accepted_terms_version,
    v_parental_consent, COALESCE(NEW.created_at, NOW()), NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    contact_number = COALESCE(EXCLUDED.contact_number, public.profiles.contact_number),
    auth_method = COALESCE(EXCLUDED.auth_method, public.profiles.auth_method),
    target_exam = COALESCE(public.profiles.target_exam, EXCLUDED.target_exam),
    role = CASE WHEN v_role = 'admin' THEN 'admin' ELSE public.profiles.role END,
    last_login_at = NOW();

  RETURN NEW;
END;
$$;

-- Tighten profiles RLS to TO authenticated
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = id
    OR (SELECT public.is_admin())
  );

DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = id AND role = 'student'
    OR (SELECT public.is_admin())
  );

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id OR (SELECT public.is_admin()))
  WITH CHECK ((SELECT auth.uid()) = id OR (SELECT public.is_admin()));

-- ==============================================================================
-- 2. Daily Plans & 24-Hour Timetable Table (public.daily_plans)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.daily_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  timetable_blocks JSONB NOT NULL DEFAULT '{}'::jsonb,
  custom_activities JSONB NOT NULL DEFAULT '[]'::jsonb,
  questions_solved_today INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_daily_plans_user_date UNIQUE (user_id, plan_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_plans_user_date ON public.daily_plans(user_id, plan_date DESC);

ALTER TABLE public.daily_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "daily_plans_select_own" ON public.daily_plans;
CREATE POLICY "daily_plans_select_own"
  ON public.daily_plans FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "daily_plans_insert_own" ON public.daily_plans;
CREATE POLICY "daily_plans_insert_own"
  ON public.daily_plans FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "daily_plans_update_own" ON public.daily_plans;
CREATE POLICY "daily_plans_update_own"
  ON public.daily_plans FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "daily_plans_delete_own" ON public.daily_plans;
CREATE POLICY "daily_plans_delete_own"
  ON public.daily_plans FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.daily_plans TO authenticated;
GRANT ALL ON TABLE public.daily_plans TO service_role;

-- ==============================================================================
-- 3. Upgrade public.test_attempts for Cross-Device Resume ('in_progress') + Analytics
-- ==============================================================================
ALTER TABLE public.test_attempts
  ADD COLUMN IF NOT EXISTS test_type TEXT NOT NULL DEFAULT 'mock',
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'completed',
  ADD COLUMN IF NOT EXISTS marked_for_review JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS time_remaining_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS score NUMERIC,
  ADD COLUMN IF NOT EXISTS max_score NUMERIC,
  ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_test_attempts_type') THEN
    ALTER TABLE public.test_attempts
      ADD CONSTRAINT chk_test_attempts_type CHECK (test_type IN ('mock', 'chapter_exercise'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_test_attempts_status') THEN
    ALTER TABLE public.test_attempts
      ADD CONSTRAINT chk_test_attempts_status CHECK (status IN ('in_progress', 'completed'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_test_attempts_user_status ON public.test_attempts(user_id, status, updated_at DESC);

-- Harden test_attempts RLS policies cleanly (students manage own rows; completed attempts read/taggable)
DROP POLICY IF EXISTS "test_attempts_select_policy" ON public.test_attempts;
CREATE POLICY "test_attempts_select_policy"
  ON public.test_attempts FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));

DROP POLICY IF EXISTS "test_attempts_insert_policy" ON public.test_attempts;
CREATE POLICY "test_attempts_insert_policy"
  ON public.test_attempts FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "test_attempts_update_policy" ON public.test_attempts;
CREATE POLICY "test_attempts_update_policy"
  ON public.test_attempts FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "test_attempts_delete_in_progress" ON public.test_attempts;
CREATE POLICY "test_attempts_delete_in_progress"
  ON public.test_attempts FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id AND status = 'in_progress');

-- ==============================================================================
-- 4. Question Notes & Mistakes Table (public.question_notes_and_mistakes)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.question_notes_and_mistakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  test_id TEXT,
  subject TEXT,
  chapter_id TEXT,
  question_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_mistake BOOLEAN NOT NULL DEFAULT FALSE,
  is_revised BOOLEAN NOT NULL DEFAULT FALSE,
  is_bookmarked BOOLEAN NOT NULL DEFAULT FALSE,
  personal_note TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_qnm_user_question UNIQUE (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_qnm_user_mistake ON public.question_notes_and_mistakes(user_id, is_mistake);
CREATE INDEX IF NOT EXISTS idx_qnm_user_bookmark ON public.question_notes_and_mistakes(user_id, is_bookmarked);

ALTER TABLE public.question_notes_and_mistakes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qnm_select_own" ON public.question_notes_and_mistakes;
CREATE POLICY "qnm_select_own"
  ON public.question_notes_and_mistakes FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "qnm_insert_own" ON public.question_notes_and_mistakes;
CREATE POLICY "qnm_insert_own"
  ON public.question_notes_and_mistakes FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "qnm_update_own" ON public.question_notes_and_mistakes;
CREATE POLICY "qnm_update_own"
  ON public.question_notes_and_mistakes FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "qnm_delete_own" ON public.question_notes_and_mistakes;
CREATE POLICY "qnm_delete_own"
  ON public.question_notes_and_mistakes FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.question_notes_and_mistakes TO authenticated;
GRANT ALL ON TABLE public.question_notes_and_mistakes TO service_role;

-- ==============================================================================
-- 5. Upgrade public.chapter_progress & Harden RLS
-- ==============================================================================
ALTER TABLE public.chapter_progress
  ADD COLUMN IF NOT EXISTS chapter_id TEXT,
  ADD COLUMN IF NOT EXISTS theory_completed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS exercises_completed JSONB NOT NULL DEFAULT '[]'::jsonb;

REVOKE SELECT ON TABLE public.chapter_progress FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.chapter_progress TO authenticated;

DROP POLICY IF EXISTS "chapter_progress_select_policy" ON public.chapter_progress;
CREATE POLICY "chapter_progress_select_policy"
  ON public.chapter_progress FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));

DROP POLICY IF EXISTS "chapter_progress_insert_policy" ON public.chapter_progress;
CREATE POLICY "chapter_progress_insert_policy"
  ON public.chapter_progress FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));

DROP POLICY IF EXISTS "chapter_progress_update_policy" ON public.chapter_progress;
CREATE POLICY "chapter_progress_update_policy"
  ON public.chapter_progress FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()))
  WITH CHECK ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));

DROP POLICY IF EXISTS "chapter_progress_delete_policy" ON public.chapter_progress;
CREATE POLICY "chapter_progress_delete_policy"
  ON public.chapter_progress FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));

-- ==============================================================================
-- 6. Ensure Leaderboard RPCs exclude 'in_progress' drafts AND admin accounts
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.get_test_leaderboard(p_test_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_cfg RECORD;
  v_is_admin BOOLEAN := FALSE;
  v_total_participants INTEGER := 0;
  v_avg_marks NUMERIC := 0;
  v_high_marks NUMERIC := 0;
  v_entries JSONB := '[]'::jsonb;
  v_topper JSONB := NULL;
  v_my_standing JSONB := NULL;
  v_my_attempt_submitted BOOLEAN := FALSE;
  v_current_uid UUID;
  v_canonical_id TEXT;
  v_alias_id TEXT;
BEGIN
  v_current_uid := auth.uid();
  v_is_admin := public.is_admin();

  v_canonical_id := LOWER(TRIM(p_test_id));
  IF v_canonical_id ~ '^(jee-mains-)?ptm[-_ ]?0*([0-9]+)' THEN
    v_canonical_id := 'jee-mains-ptm-' || LPAD(SUBSTRING(v_canonical_id FROM '[0-9]+'), 2, '0');
  ELSIF v_canonical_id ~ '^(jee-advanced-)?pta[-_ ]?0*([0-9]+)' THEN
    v_canonical_id := 'jee-advanced-pta-' || LPAD(SUBSTRING(v_canonical_id FROM '[0-9]+'), 2, '0');
  END IF;
  v_alias_id := REPLACE(REPLACE(v_canonical_id, 'jee-mains-', ''), 'jee-advanced-', '');

  SELECT test_id, is_scheduled_window, starts_at, ends_at, lock_leaderboard_until_end
  INTO v_cfg
  FROM public.test_configs
  WHERE test_id = v_canonical_id OR test_id = p_test_id;

  IF v_current_uid IS NOT NULL AND NOT v_is_admin THEN
    SELECT EXISTS (
      SELECT 1 FROM public.test_attempts
      WHERE (test_id = v_canonical_id OR test_id = v_alias_id OR test_id = p_test_id)
        AND user_id = v_current_uid
        AND COALESCE(status, 'completed') = 'completed'
    ) INTO v_my_attempt_submitted;
  END IF;

  IF FOUND
     AND v_cfg.is_scheduled_window = TRUE
     AND v_cfg.lock_leaderboard_until_end = TRUE
     AND v_cfg.ends_at IS NOT NULL
     AND NOW() < v_cfg.ends_at
     AND NOT v_is_admin THEN

    SELECT COUNT(DISTINCT a.user_id)
    INTO v_total_participants
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
      AND COALESCE(a.status, 'completed') = 'completed'
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'));

    RETURN jsonb_build_object(
      'locked', TRUE,
      'unlocks_at', v_cfg.ends_at,
      'total_participants', COALESCE(v_total_participants, 0),
      'my_attempt_submitted', v_my_attempt_submitted,
      'top_5', '[]'::jsonb,
      'entries', '[]'::jsonb,
      'all_entries', '[]'::jsonb,
      'my_standing', NULL,
      'topper', NULL
    );
  END IF;

  WITH best_attempts AS (
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
      (v_current_uid IS NOT NULL AND NOT v_is_admin AND a.user_id = v_current_uid) AS is_current_user
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
      AND COALESCE(a.status, 'completed') = 'completed'
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
    ORDER BY a.user_id, a.obtained_marks DESC, a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC
  ),
  ranked AS (
    SELECT
      b.*,
      COUNT(*) OVER () AS total_students,
      RANK() OVER (ORDER BY b.obtained_marks DESC, b.accuracy DESC, b.time_taken_seconds ASC, b.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (ORDER BY b.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC /
         NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100,
        2
      ) AS computed_percentile
    FROM best_attempts b
  )
  SELECT
    COALESCE(MAX(total_students), 0),
    ROUND(COALESCE(AVG(obtained_marks), 0), 1),
    COALESCE(MAX(obtained_marks), 0)
  INTO v_total_participants, v_avg_marks, v_high_marks
  FROM ranked;

  WITH best_attempts AS (
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
      (v_current_uid IS NOT NULL AND NOT v_is_admin AND a.user_id = v_current_uid) AS is_current_user
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
      AND COALESCE(a.status, 'completed') = 'completed'
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
    ORDER BY a.user_id, a.obtained_marks DESC, a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC
  ),
  ranked AS (
    SELECT
      b.*,
      RANK() OVER (ORDER BY b.obtained_marks DESC, b.accuracy DESC, b.time_taken_seconds ASC, b.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (ORDER BY b.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC /
         NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100,
        2
      ) AS computed_percentile
    FROM best_attempts b
  )
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'rank', r.computed_rank,
        'display_name', r.display_name,
        'obtained_marks', r.obtained_marks,
        'total_marks', r.total_marks,
        'percentage', r.percentage,
        'accuracy', r.accuracy,
        'percentile', r.computed_percentile,
        'time_taken_seconds', r.time_taken_seconds,
        'submitted_at', r.submitted_at,
        'is_current_user', r.is_current_user
      ) ORDER BY r.computed_rank ASC, r.time_taken_seconds ASC
    ),
    '[]'::jsonb
  )
  INTO v_entries
  FROM (SELECT * FROM ranked LIMIT 5) r;

  IF jsonb_array_length(v_entries) > 0 THEN
    v_topper := v_entries->0;
  END IF;

  IF v_current_uid IS NOT NULL AND NOT v_is_admin THEN
    WITH best_attempts AS (
      SELECT DISTINCT ON (a.user_id)
        a.user_id,
        a.obtained_marks,
        a.total_marks,
        a.percentage,
        a.accuracy,
        COALESCE(a.time_taken_seconds, 0) AS time_taken_seconds,
        a.submitted_at,
        COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name
      FROM public.test_attempts a
      LEFT JOIN public.profiles p ON p.id = a.user_id
      LEFT JOIN auth.users u ON u.id = a.user_id
      WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
        AND COALESCE(a.status, 'completed') = 'completed'
        AND (p.role IS NULL OR p.role <> 'admin')
        AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
      ORDER BY a.user_id, a.obtained_marks DESC, a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC
    ),
    ranked AS (
      SELECT
        b.*,
        RANK() OVER (ORDER BY b.obtained_marks DESC, b.accuracy DESC, b.time_taken_seconds ASC, b.submitted_at ASC) AS computed_rank,
        ROUND(
          (COUNT(*) OVER (ORDER BY b.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC /
           NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100,
          2
        ) AS computed_percentile
      FROM best_attempts b
    )
    SELECT jsonb_build_object(
      'rank', r.computed_rank,
      'display_name', r.display_name,
      'obtained_marks', r.obtained_marks,
      'total_marks', r.total_marks,
      'percentage', r.percentage,
      'accuracy', r.accuracy,
      'percentile', r.computed_percentile,
      'time_taken_seconds', r.time_taken_seconds,
      'submitted_at', r.submitted_at,
      'is_current_user', TRUE
    )
    INTO v_my_standing
    FROM ranked r
    WHERE r.user_id = v_current_uid
    LIMIT 1;
  END IF;

  RETURN jsonb_build_object(
    'locked', FALSE,
    'unlocks_at', COALESCE(v_cfg.ends_at, NULL),
    'total_participants', v_total_participants,
    'avg_marks', v_avg_marks,
    'highest_marks', v_high_marks,
    'my_attempt_submitted', v_my_attempt_submitted,
    'top_5', v_entries,
    'entries', v_entries,
    'all_entries', v_entries,
    'my_standing', v_my_standing,
    'topper', v_topper
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_test_toppers_summary()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $toppers_summary$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_result JSONB := '[]'::jsonb;
BEGIN
  v_is_admin := public.is_admin();

  WITH test_summary AS (
    SELECT
      c.test_id, c.code, c.title, c.exam_type,
      c.is_scheduled_window, c.starts_at, c.ends_at, c.window_label,
      (c.is_scheduled_window = TRUE AND c.lock_leaderboard_until_end = TRUE AND c.ends_at IS NOT NULL AND NOW() < c.ends_at AND NOT v_is_admin) AS is_locked
    FROM public.test_configs c
  ),
  best_attempts AS (
    SELECT DISTINCT ON (a.test_id, a.user_id)
      a.test_id, a.user_id, a.obtained_marks, a.total_marks, a.accuracy,
      COALESCE(a.time_taken_seconds, 0) AS time_taken_seconds,
      a.submitted_at,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE COALESCE(a.status, 'completed') = 'completed'
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
    ORDER BY a.test_id, a.user_id, a.obtained_marks DESC, a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC
  ),
  ranked AS (
    SELECT
      ba.*,
      COUNT(*) OVER (PARTITION BY ba.test_id) AS total_participants,
      RANK() OVER (PARTITION BY ba.test_id ORDER BY ba.obtained_marks DESC, ba.accuracy DESC, ba.time_taken_seconds ASC, ba.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (PARTITION BY ba.test_id ORDER BY ba.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC /
         NULLIF(COUNT(*) OVER (PARTITION BY ba.test_id), 0)::NUMERIC) * 100,
        2
      ) AS computed_percentile
    FROM best_attempts ba
  ),
  toppers AS (
    SELECT * FROM ranked WHERE computed_rank = 1
  )
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'test_id', ts.test_id, 'code', ts.code, 'title', ts.title, 'exam_type', ts.exam_type,
        'is_scheduled_window', ts.is_scheduled_window, 'starts_at', ts.starts_at, 'ends_at', ts.ends_at,
        'window_label', ts.window_label, 'is_locked', ts.is_locked,
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

CREATE OR REPLACE FUNCTION public.get_overall_leaderboard()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $overall_leaderboard$
DECLARE
  v_current_uid UUID;
  v_is_admin BOOLEAN := FALSE;
  v_result JSONB := '[]'::jsonb;
BEGIN
  v_current_uid := auth.uid();
  v_is_admin := public.is_admin();

  WITH unlocked_tests AS (
    SELECT test_id
    FROM public.test_configs
    WHERE NOT (
      is_scheduled_window = TRUE AND lock_leaderboard_until_end = TRUE
      AND ends_at IS NOT NULL AND NOW() < ends_at AND NOT v_is_admin
    )
  ),
  best_attempts AS (
    SELECT DISTINCT ON (a.test_id, a.user_id)
      a.test_id, a.user_id, a.obtained_marks, a.total_marks, a.percentage, a.accuracy,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name,
      (v_current_uid IS NOT NULL AND NOT v_is_admin AND a.user_id = v_current_uid) AS is_current_user
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    JOIN unlocked_tests ut ON (ut.test_id = a.test_id OR ut.test_id = REPLACE(REPLACE(a.test_id, 'jee-mains-', ''), 'jee-advanced-', ''))
    WHERE COALESCE(a.status, 'completed') = 'completed'
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
    ORDER BY a.test_id, a.user_id, a.obtained_marks DESC, a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC
  ),
  per_test_percentiles AS (
    SELECT ba.*,
      ROUND(
        (COUNT(*) OVER (PARTITION BY ba.test_id ORDER BY ba.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC /
         NULLIF(COUNT(*) OVER (PARTITION BY ba.test_id), 0)::NUMERIC) * 100, 2
      ) AS test_percentile
    FROM best_attempts ba
  ),
  student_aggregates AS (
    SELECT user_id, MAX(display_name) AS display_name, BOOL_OR(is_current_user) AS is_current_user,
      COUNT(DISTINCT test_id) AS tests_attempted,
      ROUND(AVG(test_percentile), 2) AS avg_percentile,
      ROUND(AVG(percentage), 2) AS avg_marks_percent,
      SUM(obtained_marks) AS total_marks_scored,
      SUM(total_marks) AS total_max_marks
    FROM per_test_percentiles
    GROUP BY user_id
  ),
  overall_ranked AS (
    SELECT sa.*, RANK() OVER (ORDER BY sa.avg_percentile DESC, sa.tests_attempted DESC, sa.total_marks_scored DESC) AS computed_rank
    FROM student_aggregates sa
  )
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'rank', r.computed_rank, 'display_name', r.display_name, 'tests_attempted', r.tests_attempted,
        'avg_percentile', r.avg_percentile, 'avg_marks_percent', r.avg_marks_percent,
        'total_marks_scored', r.total_marks_scored, 'total_max_marks', r.total_max_marks,
        'is_current_user', r.is_current_user
      ) ORDER BY r.computed_rank ASC
    ),
    '[]'::jsonb
  ) INTO v_result FROM overall_ranked r;

  RETURN v_result;
END;
$overall_leaderboard$;

GRANT EXECUTE ON FUNCTION public.get_test_leaderboard(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_test_toppers_summary() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_overall_leaderboard() TO anon, authenticated, service_role;


-- ==============================================================================
-- Migration: 27-Point Comprehensive Security Audit & Database Hardening
-- Restricts admin role strictly to mallicknelov@gmail.com, locks private views,
-- tightens RLS policies to TO authenticated with (SELECT auth.uid()), adds DB
-- rate-limit triggers, safe search_path='', and server-side mock window guard.
-- Safe to run multiple times (Idempotent).
-- ==============================================================================

-- 1. Enforce Single Admin Account Strictly ('mallicknelov@gmail.com')
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT (
    LOWER(COALESCE(auth.jwt()->>'email', '')) = 'mallicknelov@gmail.com'
    OR EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = (SELECT auth.uid())
        AND role = 'admin'
        AND LOWER(COALESCE(email, '')) = 'mallicknelov@gmail.com'
    )
  );
$$;

CREATE OR REPLACE FUNCTION public.trg_protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.role IS DISTINCT FROM NEW.role THEN
    IF (SELECT auth.uid()) IS NOT NULL AND NOT public.is_admin() THEN
      NEW.role := OLD.role;
    END IF;
  END IF;

  IF NEW.role = 'admin' THEN
    IF LOWER(COALESCE(NEW.email, '')) <> 'mallicknelov@gmail.com' THEN
      NEW.role := 'student';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_role_before_write ON public.profiles;
CREATE TRIGGER trg_protect_profile_role_before_write
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_protect_profile_role();

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
  v_avatar_url TEXT;
  v_role TEXT := 'student';
  v_is_phone_user BOOLEAN := FALSE;
  v_accepted_terms_at TIMESTAMPTZ := NULL;
  v_accepted_terms_version TEXT := NULL;
  v_parental_consent BOOLEAN := FALSE;
BEGIN
  IF NEW.email LIKE '%@phone.nelovportal.local' THEN
    v_is_phone_user := TRUE;
    v_email := NULL;
  ELSE
    v_email := NEW.email;
  END IF;

  v_full_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    CASE
      WHEN v_is_phone_user THEN 'Student Aspirant'
      WHEN v_email IS NOT NULL AND POSITION('@' IN v_email) > 1 THEN SPLIT_PART(v_email, '@', 1)
      ELSE 'Student Aspirant'
    END
  );

  v_avatar_url := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'avatar_url'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'picture'), '')
  );

  v_target_exam := COALESCE(NEW.raw_user_meta_data->>'target_exam', 'JEE 2027');
  IF v_target_exam NOT IN ('JEE 2027', 'JEE Mains', 'JEE Advanced', 'Both') THEN
    v_target_exam := 'JEE 2027';
  END IF;

  v_contact_number := NULLIF(TRIM(NEW.raw_user_meta_data->>'contact_number'), '');

  IF NEW.raw_app_meta_data->>'provider' = 'google' OR NEW.raw_user_meta_data->>'auth_method' = 'google' THEN
    v_auth_method := 'google';
  ELSIF v_is_phone_user THEN
    v_auth_method := 'phone';
  ELSIF v_email ILIKE '%@gmail.com' THEN
    v_auth_method := 'gmail';
  ELSE
    v_auth_method := COALESCE(NEW.raw_user_meta_data->>'auth_method', 'email');
  END IF;

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

  -- Strictly restrict admin role provisioning to mallicknelov@gmail.com
  IF LOWER(COALESCE(v_email, '')) = 'mallicknelov@gmail.com' THEN
    v_role := 'admin';
  END IF;

  INSERT INTO public.profiles (
    id, full_name, email, avatar_url, contact_number, auth_method, target_exam,
    role, daily_question_goal, accepted_terms_at, accepted_terms_version,
    parental_consent_confirmed, created_at, last_login_at
  )
  VALUES (
    NEW.id, v_full_name, v_email, v_avatar_url, v_contact_number, v_auth_method, v_target_exam,
    v_role, 30, v_accepted_terms_at, v_accepted_terms_version,
    v_parental_consent, COALESCE(NEW.created_at, NOW()), NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    contact_number = COALESCE(EXCLUDED.contact_number, public.profiles.contact_number),
    auth_method = COALESCE(EXCLUDED.auth_method, public.profiles.auth_method),
    target_exam = COALESCE(public.profiles.target_exam, EXCLUDED.target_exam),
    role = CASE
      WHEN LOWER(COALESCE(EXCLUDED.email, public.profiles.email, '')) = 'mallicknelov@gmail.com' THEN 'admin'
      ELSE 'student'
    END,
    last_login_at = NOW();

  RETURN NEW;
END;
$$;

-- Ensure no legacy secondary emails hold admin role
UPDATE public.profiles
SET role = CASE WHEN LOWER(COALESCE(email, '')) = 'mallicknelov@gmail.com' THEN 'admin' ELSE 'student' END
WHERE role = 'admin' AND LOWER(COALESCE(email, '')) <> 'mallicknelov@gmail.com';

-- 2. Lock down Admin Physics Summary View (prevent unauthorized read / RLS bypass)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'admin_physics_summary'
  ) THEN
    EXECUTE 'ALTER VIEW public.admin_physics_summary SET (security_invoker = true)';
    REVOKE ALL ON public.admin_physics_summary FROM PUBLIC, anon, authenticated;
    GRANT SELECT ON public.admin_physics_summary TO service_role;
  END IF;
END $$;

-- 3. Harden delete_my_account() with SET search_path = ''
CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_role TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to delete an account.';
  END IF;

  SELECT role INTO v_role FROM public.profiles WHERE id = v_user_id;
  IF v_role = 'admin' THEN
    RAISE EXCEPTION 'Admin accounts cannot be self-deleted to prevent accidental management lockouts.';
  END IF;

  UPDATE public.error_reports
  SET reporter_name = 'Deleted User',
      reporter_email = 'deleted@nelovmallick.local'
  WHERE user_id = v_user_id;

  DELETE FROM auth.users WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', TRUE,
    'message', 'Your account and all associated test records, bookmarks, and data have been permanently erased.'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.delete_my_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;

-- 4. Tighten RLS policies on Bookmarks, Lecture Progress, Physics Progress & Error Reports
DO $$
BEGIN
  IF to_regclass('public.bookmarks') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "bookmarks_select_policy" ON public.bookmarks';
    EXECUTE 'CREATE POLICY "bookmarks_select_policy" ON public.bookmarks FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id OR public.is_admin())';
    EXECUTE 'DROP POLICY IF EXISTS "bookmarks_insert_policy" ON public.bookmarks';
    EXECUTE 'CREATE POLICY "bookmarks_insert_policy" ON public.bookmarks FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id)';
    EXECUTE 'DROP POLICY IF EXISTS "bookmarks_update_policy" ON public.bookmarks';
    EXECUTE 'CREATE POLICY "bookmarks_update_policy" ON public.bookmarks FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id)';
    EXECUTE 'DROP POLICY IF EXISTS "bookmarks_delete_policy" ON public.bookmarks';
    EXECUTE 'CREATE POLICY "bookmarks_delete_policy" ON public.bookmarks FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id)';
  END IF;

  IF to_regclass('public.lecture_progress') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "lecture_progress_select_policy" ON public.lecture_progress';
    EXECUTE 'CREATE POLICY "lecture_progress_select_policy" ON public.lecture_progress FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id OR public.is_admin())';
    EXECUTE 'DROP POLICY IF EXISTS "lecture_progress_insert_policy" ON public.lecture_progress';
    EXECUTE 'CREATE POLICY "lecture_progress_insert_policy" ON public.lecture_progress FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id)';
    EXECUTE 'DROP POLICY IF EXISTS "lecture_progress_update_policy" ON public.lecture_progress';
    EXECUTE 'CREATE POLICY "lecture_progress_update_policy" ON public.lecture_progress FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id)';
    EXECUTE 'DROP POLICY IF EXISTS "lecture_progress_delete_policy" ON public.lecture_progress';
    EXECUTE 'CREATE POLICY "lecture_progress_delete_policy" ON public.lecture_progress FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id)';
  END IF;

  IF to_regclass('public.physics_progress') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own physics progress" ON public.physics_progress';
    EXECUTE 'CREATE POLICY "Users can view own physics progress" ON public.physics_progress FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id OR public.is_admin())';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert own physics progress" ON public.physics_progress';
    EXECUTE 'CREATE POLICY "Users can insert own physics progress" ON public.physics_progress FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id)';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own physics progress" ON public.physics_progress';
    EXECUTE 'CREATE POLICY "Users can update own physics progress" ON public.physics_progress FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id)';
  END IF;

  IF to_regclass('public.physics_exercise_attempts') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own physics exercise attempts" ON public.physics_exercise_attempts';
    EXECUTE 'CREATE POLICY "Users can view own physics exercise attempts" ON public.physics_exercise_attempts FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id OR public.is_admin())';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert own physics exercise attempts" ON public.physics_exercise_attempts';
    EXECUTE 'CREATE POLICY "Users can insert own physics exercise attempts" ON public.physics_exercise_attempts FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id)';
  END IF;
END $$;

-- Error Reports: Enforce user_id ownership, bounds, and DB-level spam rate limiting
ALTER TABLE public.error_reports DROP CONSTRAINT IF EXISTS error_reports_issue_type_check;
ALTER TABLE public.error_reports ADD CONSTRAINT error_reports_issue_type_check
  CHECK (char_length(issue_type) BETWEEN 1 AND 120) NOT VALID;

ALTER TABLE public.error_reports DROP CONSTRAINT IF EXISTS error_reports_description_len_check;
ALTER TABLE public.error_reports ADD CONSTRAINT error_reports_description_len_check
  CHECK (char_length(description) BETWEEN 1 AND 2000) NOT VALID;

DROP POLICY IF EXISTS "error_reports_insert_policy" ON public.error_reports;
CREATE POLICY "error_reports_insert_policy" ON public.error_reports
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "error_reports_select_policy" ON public.error_reports;
CREATE POLICY "error_reports_select_policy" ON public.error_reports
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR public.is_admin());

DROP POLICY IF EXISTS "error_reports_update_admin" ON public.error_reports;
CREATE POLICY "error_reports_update_admin" ON public.error_reports
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.enforce_error_report_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_recent_count INT := 0;
BEGIN
  IF public.is_admin() OR NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO v_recent_count
  FROM public.error_reports
  WHERE user_id = NEW.user_id
    AND created_at > NOW() - INTERVAL '15 minutes';

  IF v_recent_count >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Please wait 15 minutes before submitting more reports.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_error_reports_rate_limit ON public.error_reports;
CREATE TRIGGER trg_error_reports_rate_limit
  BEFORE INSERT ON public.error_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_error_report_rate_limit();

-- 5. Safe Server-Side Scheduled Test Start Guard (only enforces scheduled mocks before starts_at)
CREATE OR REPLACE FUNCTION public.check_test_attempt_window_start()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $window_trigger$
DECLARE
  v_cfg RECORD;
  v_canonical TEXT;
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  v_canonical := LOWER(TRIM(COALESCE(NEW.test_id, '')));
  IF v_canonical ~ '^(jee-mains-)?ptm[-_ ]?0*([0-9]+)' THEN
    v_canonical := 'jee-mains-ptm-' || LPAD(SUBSTRING(v_canonical FROM '[0-9]+'), 2, '0');
  ELSIF v_canonical ~ '^(jee-advanced-)?pta[-_ ]?0*([0-9]+)' THEN
    v_canonical := 'jee-advanced-pta-' || LPAD(SUBSTRING(v_canonical FROM '[0-9]+'), 2, '0');
  END IF;

  SELECT is_scheduled_window, starts_at, ends_at
  INTO v_cfg
  FROM public.test_configs
  WHERE test_id = v_canonical OR test_id = NEW.test_id
  LIMIT 1;

  IF FOUND AND v_cfg.is_scheduled_window = TRUE AND v_cfg.starts_at IS NOT NULL THEN
    IF NOW() < v_cfg.starts_at THEN
      RAISE EXCEPTION 'Scheduled test window has not started yet. Unlocks at %', v_cfg.starts_at;
    END IF;
    IF v_cfg.ends_at IS NOT NULL AND NOW() <= v_cfg.ends_at THEN
      NEW.attempted_in_live_window := TRUE;
    END IF;
  END IF;

  RETURN NEW;
END;
$window_trigger$;

DROP TRIGGER IF EXISTS trg_check_test_attempt_window ON public.test_attempts;
CREATE TRIGGER trg_check_test_attempt_window
  BEFORE INSERT OR UPDATE ON public.test_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.check_test_attempt_window_start();

-- 6. Refresh Leaderboard RPCs with strict single admin email filter
CREATE OR REPLACE FUNCTION public.get_test_leaderboard(p_test_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_cfg RECORD;
  v_is_admin BOOLEAN := FALSE;
  v_total_participants INTEGER := 0;
  v_avg_marks NUMERIC := 0;
  v_high_marks NUMERIC := 0;
  v_entries JSONB := '[]'::jsonb;
  v_topper JSONB := NULL;
  v_my_standing JSONB := NULL;
  v_my_attempt_submitted BOOLEAN := FALSE;
  v_current_uid UUID;
  v_canonical_id TEXT;
  v_alias_id TEXT;
BEGIN
  v_current_uid := auth.uid();
  v_is_admin := public.is_admin();

  v_canonical_id := LOWER(TRIM(p_test_id));
  IF v_canonical_id ~ '^(jee-mains-)?ptm[-_ ]?0*([0-9]+)' THEN
    v_canonical_id := 'jee-mains-ptm-' || LPAD(SUBSTRING(v_canonical_id FROM '[0-9]+'), 2, '0');
  ELSIF v_canonical_id ~ '^(jee-advanced-)?pta[-_ ]?0*([0-9]+)' THEN
    v_canonical_id := 'jee-advanced-pta-' || LPAD(SUBSTRING(v_canonical_id FROM '[0-9]+'), 2, '0');
  END IF;
  v_alias_id := REPLACE(REPLACE(v_canonical_id, 'jee-mains-', ''), 'jee-advanced-', '');

  SELECT test_id, is_scheduled_window, starts_at, ends_at, lock_leaderboard_until_end
  INTO v_cfg
  FROM public.test_configs
  WHERE test_id = v_canonical_id OR test_id = p_test_id;

  IF v_current_uid IS NOT NULL AND NOT v_is_admin THEN
    SELECT EXISTS (
      SELECT 1 FROM public.test_attempts
      WHERE (test_id = v_canonical_id OR test_id = v_alias_id OR test_id = p_test_id)
        AND user_id = v_current_uid
        AND COALESCE(status, 'completed') = 'completed'
    ) INTO v_my_attempt_submitted;
  END IF;

  IF FOUND
     AND v_cfg.is_scheduled_window = TRUE
     AND v_cfg.lock_leaderboard_until_end = TRUE
     AND v_cfg.ends_at IS NOT NULL
     AND NOW() < v_cfg.ends_at
     AND NOT v_is_admin THEN

    SELECT COUNT(DISTINCT a.user_id)
    INTO v_total_participants
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
      AND COALESCE(a.status, 'completed') = 'completed'
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) <> 'mallicknelov@gmail.com');

    RETURN jsonb_build_object(
      'locked', TRUE,
      'unlocks_at', v_cfg.ends_at,
      'total_participants', COALESCE(v_total_participants, 0),
      'my_attempt_submitted', v_my_attempt_submitted,
      'top_5', '[]'::jsonb,
      'entries', '[]'::jsonb,
      'all_entries', '[]'::jsonb,
      'my_standing', NULL,
      'topper', NULL
    );
  END IF;

  WITH best_attempts AS (
    SELECT DISTINCT ON (a.user_id)
      a.id, a.user_id, a.obtained_marks, a.total_marks, a.percentage, a.accuracy,
      COALESCE(a.time_taken_seconds, 0) AS time_taken_seconds, a.submitted_at, a.attempted_in_live_window,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name,
      (v_current_uid IS NOT NULL AND NOT v_is_admin AND a.user_id = v_current_uid) AS is_current_user
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
      AND COALESCE(a.status, 'completed') = 'completed'
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) <> 'mallicknelov@gmail.com')
    ORDER BY a.user_id, a.obtained_marks DESC, a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC
  ),
  ranked AS (
    SELECT b.*,
      COUNT(*) OVER () AS total_students,
      RANK() OVER (ORDER BY b.obtained_marks DESC, b.accuracy DESC, b.time_taken_seconds ASC, b.submitted_at ASC) AS computed_rank,
      ROUND((COUNT(*) OVER (ORDER BY b.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100, 2) AS computed_percentile
    FROM best_attempts b
  )
  SELECT COALESCE(MAX(total_students), 0), ROUND(COALESCE(AVG(obtained_marks), 0), 1), COALESCE(MAX(obtained_marks), 0)
  INTO v_total_participants, v_avg_marks, v_high_marks
  FROM ranked;

  WITH best_attempts AS (
    SELECT DISTINCT ON (a.user_id)
      a.id, a.user_id, a.obtained_marks, a.total_marks, a.percentage, a.accuracy,
      COALESCE(a.time_taken_seconds, 0) AS time_taken_seconds, a.submitted_at,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name,
      (v_current_uid IS NOT NULL AND NOT v_is_admin AND a.user_id = v_current_uid) AS is_current_user
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
      AND COALESCE(a.status, 'completed') = 'completed'
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) <> 'mallicknelov@gmail.com')
    ORDER BY a.user_id, a.obtained_marks DESC, a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC
  ),
  ranked AS (
    SELECT b.*,
      RANK() OVER (ORDER BY b.obtained_marks DESC, b.accuracy DESC, b.time_taken_seconds ASC, b.submitted_at ASC) AS computed_rank,
      ROUND((COUNT(*) OVER (ORDER BY b.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100, 2) AS computed_percentile
    FROM best_attempts b
  )
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'rank', r.computed_rank, 'display_name', r.display_name, 'obtained_marks', r.obtained_marks,
        'total_marks', r.total_marks, 'percentage', r.percentage, 'accuracy', r.accuracy,
        'percentile', r.computed_percentile, 'time_taken_seconds', r.time_taken_seconds,
        'submitted_at', r.submitted_at, 'is_current_user', r.is_current_user
      ) ORDER BY r.computed_rank ASC, r.time_taken_seconds ASC
    ), '[]'::jsonb
  ) INTO v_entries FROM (SELECT * FROM ranked LIMIT 5) r;

  IF jsonb_array_length(v_entries) > 0 THEN v_topper := v_entries->0; END IF;

  IF v_current_uid IS NOT NULL AND NOT v_is_admin THEN
    WITH best_attempts AS (
      SELECT DISTINCT ON (a.user_id)
        a.user_id, a.obtained_marks, a.total_marks, a.percentage, a.accuracy,
        COALESCE(a.time_taken_seconds, 0) AS time_taken_seconds, a.submitted_at,
        COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name
      FROM public.test_attempts a
      LEFT JOIN public.profiles p ON p.id = a.user_id
      LEFT JOIN auth.users u ON u.id = a.user_id
      WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
        AND COALESCE(a.status, 'completed') = 'completed'
        AND (p.role IS NULL OR p.role <> 'admin')
        AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) <> 'mallicknelov@gmail.com')
      ORDER BY a.user_id, a.obtained_marks DESC, a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC
    ),
    ranked AS (
      SELECT b.*,
        RANK() OVER (ORDER BY b.obtained_marks DESC, b.accuracy DESC, b.time_taken_seconds ASC, b.submitted_at ASC) AS computed_rank,
        ROUND((COUNT(*) OVER (ORDER BY b.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100, 2) AS computed_percentile
      FROM best_attempts b
    )
    SELECT jsonb_build_object(
      'rank', r.computed_rank, 'display_name', r.display_name, 'obtained_marks', r.obtained_marks,
      'total_marks', r.total_marks, 'percentage', r.percentage, 'accuracy', r.accuracy,
      'percentile', r.computed_percentile, 'time_taken_seconds', r.time_taken_seconds,
      'submitted_at', r.submitted_at, 'is_current_user', TRUE
    ) INTO v_my_standing FROM ranked r WHERE r.user_id = v_current_uid LIMIT 1;
  END IF;

  RETURN jsonb_build_object(
    'locked', FALSE, 'unlocks_at', COALESCE(v_cfg.ends_at, NULL),
    'total_participants', v_total_participants, 'avg_marks', v_avg_marks, 'highest_marks', v_high_marks,
    'my_attempt_submitted', v_my_attempt_submitted, 'top_5', v_entries, 'entries', v_entries,
    'all_entries', v_entries, 'my_standing', v_my_standing, 'topper', v_topper
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_test_toppers_summary()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $toppers_summary$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_result JSONB := '[]'::jsonb;
BEGIN
  v_is_admin := public.is_admin();

  WITH test_summary AS (
    SELECT c.test_id, c.code, c.title, c.exam_type,
      c.is_scheduled_window, c.starts_at, c.ends_at, c.window_label,
      (c.is_scheduled_window = TRUE AND c.lock_leaderboard_until_end = TRUE AND c.ends_at IS NOT NULL AND NOW() < c.ends_at AND NOT v_is_admin) AS is_locked
    FROM public.test_configs c
  ),
  best_attempts AS (
    SELECT DISTINCT ON (a.test_id, a.user_id)
      a.test_id, a.user_id, a.obtained_marks, a.total_marks, a.accuracy,
      COALESCE(a.time_taken_seconds, 0) AS time_taken_seconds, a.submitted_at,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE COALESCE(a.status, 'completed') = 'completed'
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) <> 'mallicknelov@gmail.com')
    ORDER BY a.test_id, a.user_id, a.obtained_marks DESC, a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC
  ),
  ranked AS (
    SELECT ba.*,
      COUNT(*) OVER (PARTITION BY ba.test_id) AS total_participants,
      RANK() OVER (PARTITION BY ba.test_id ORDER BY ba.obtained_marks DESC, ba.accuracy DESC, ba.time_taken_seconds ASC, ba.submitted_at ASC) AS computed_rank,
      ROUND((COUNT(*) OVER (PARTITION BY ba.test_id ORDER BY ba.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / NULLIF(COUNT(*) OVER (PARTITION BY ba.test_id), 0)::NUMERIC) * 100, 2) AS computed_percentile
    FROM best_attempts ba
  ),
  toppers AS (
    SELECT * FROM ranked WHERE computed_rank = 1
  )
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'test_id', ts.test_id, 'code', ts.code, 'title', ts.title, 'exam_type', ts.exam_type,
        'is_scheduled_window', ts.is_scheduled_window, 'starts_at', ts.starts_at, 'ends_at', ts.ends_at,
        'window_label', ts.window_label, 'is_locked', ts.is_locked,
        'total_participants', COALESCE(top.total_participants, 0),
        'topper_name', CASE WHEN ts.is_locked THEN NULL ELSE top.display_name END,
        'topper_marks', CASE WHEN ts.is_locked THEN NULL ELSE top.obtained_marks END,
        'max_marks', CASE WHEN ts.is_locked THEN NULL ELSE top.total_marks END,
        'topper_percentile', CASE WHEN ts.is_locked THEN NULL ELSE top.computed_percentile END
      ) ORDER BY ts.test_id ASC
    ), '[]'::jsonb
  ) INTO v_result FROM test_summary ts LEFT JOIN toppers top ON top.test_id = ts.test_id;

  RETURN v_result;
END;
$toppers_summary$;

CREATE OR REPLACE FUNCTION public.get_overall_leaderboard()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $overall_leaderboard$
DECLARE
  v_current_uid UUID;
  v_is_admin BOOLEAN := FALSE;
  v_result JSONB := '[]'::jsonb;
BEGIN
  v_current_uid := auth.uid();
  v_is_admin := public.is_admin();

  WITH unlocked_tests AS (
    SELECT test_id FROM public.test_configs
    WHERE NOT (is_scheduled_window = TRUE AND lock_leaderboard_until_end = TRUE AND ends_at IS NOT NULL AND NOW() < ends_at AND NOT v_is_admin)
  ),
  best_attempts AS (
    SELECT DISTINCT ON (a.test_id, a.user_id)
      a.test_id, a.user_id, a.obtained_marks, a.total_marks, a.percentage, a.accuracy,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name,
      (v_current_uid IS NOT NULL AND NOT v_is_admin AND a.user_id = v_current_uid) AS is_current_user
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    JOIN unlocked_tests ut ON (ut.test_id = a.test_id OR ut.test_id = REPLACE(REPLACE(a.test_id, 'jee-mains-', ''), 'jee-advanced-', ''))
    WHERE COALESCE(a.status, 'completed') = 'completed'
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) <> 'mallicknelov@gmail.com')
    ORDER BY a.test_id, a.user_id, a.obtained_marks DESC, a.accuracy DESC, a.time_taken_seconds ASC, a.submitted_at ASC
  ),
  per_test_percentiles AS (
    SELECT ba.*,
      ROUND((COUNT(*) OVER (PARTITION BY ba.test_id ORDER BY ba.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / NULLIF(COUNT(*) OVER (PARTITION BY ba.test_id), 0)::NUMERIC) * 100, 2) AS test_percentile
    FROM best_attempts ba
  ),
  student_aggregates AS (
    SELECT user_id, MAX(display_name) AS display_name, BOOL_OR(is_current_user) AS is_current_user,
      COUNT(DISTINCT test_id) AS tests_attempted,
      ROUND(AVG(test_percentile), 2) AS avg_percentile,
      ROUND(AVG(percentage), 2) AS avg_marks_percent,
      SUM(obtained_marks) AS total_marks_scored,
      SUM(total_marks) AS total_max_marks
    FROM per_test_percentiles GROUP BY user_id
  ),
  overall_ranked AS (
    SELECT sa.*, RANK() OVER (ORDER BY sa.avg_percentile DESC, sa.tests_attempted DESC, sa.total_marks_scored DESC) AS computed_rank
    FROM student_aggregates sa
  )
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'rank', r.computed_rank, 'display_name', r.display_name, 'tests_attempted', r.tests_attempted,
        'avg_percentile', r.avg_percentile, 'avg_marks_percent', r.avg_marks_percent,
        'total_marks_scored', r.total_marks_scored, 'total_max_marks', r.total_max_marks,
        'is_current_user', r.is_current_user
      ) ORDER BY r.computed_rank ASC
    ), '[]'::jsonb
  ) INTO v_result FROM overall_ranked r;

  RETURN v_result;
END;
$overall_leaderboard$;



-- ==============================================================================
-- Migration: Fix Student & Public Visitor Leaderboard Visibility Across PTM 01-20 & PTA 01-10
-- Root causes fixed:
--   1. public.test_attempts missed `status` column -> all 3 RPCs crashed with HTTP 400
--      ("column a.status does not exist"), causing silent RLS fallback empty for students/anon.
--   2. Key aliases ('marks'/'score'/'obtained_marks', 'max_marks'/'total_marks',
--      'average_marks'/'avg_marks', 'student_name'/'display_name') unified across callers.
--   3. test_configs.lock_leaderboard_until_end unlocked + PTM 01-03 & PTA 04-06 marked live.
--   4. SECURITY DEFINER STABLE search_path='' RPCs with explicit GRANT EXECUTE to anon, authenticated.
-- ==============================================================================

-- 1. Ensure test_attempts has status column so completed-attempt filters never fail with 42703
ALTER TABLE public.test_attempts
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'completed';

-- 2. Unlock all leaderboards in test_configs and ensure PTM 01-03 + PTA 04-06 are live
ALTER TABLE public.test_configs
  ALTER COLUMN lock_leaderboard_until_end SET DEFAULT false;

UPDATE public.test_configs
SET lock_leaderboard_until_end = false,
    updated_at = NOW()
WHERE lock_leaderboard_until_end = true;

UPDATE public.test_configs
SET status = 'live',
    allow_practice_after_end = true,
    lock_leaderboard_until_end = false,
    updated_at = NOW()
WHERE test_id IN (
  'jee-mains-ptm-01',
  'jee-mains-ptm-02',
  'jee-mains-ptm-03',
  'jee-advanced-pta-04',
  'jee-advanced-pta-05',
  'jee-advanced-pta-06'
);

-- 3. Recreate public.get_test_leaderboard(p_test_id text)
CREATE OR REPLACE FUNCTION public.get_test_leaderboard(p_test_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_total_participants INTEGER := 0;
  v_avg_marks NUMERIC := 0;
  v_high_marks NUMERIC := 0;
  v_top_5 JSONB := '[]'::jsonb;
  v_all_entries JSONB := '[]'::jsonb;
  v_topper JSONB := NULL;
  v_my_standing JSONB := NULL;
  v_current_uid UUID;
  v_canonical_id TEXT;
  v_alias_id TEXT;
  v_compact_id TEXT;
BEGIN
  v_current_uid := auth.uid();
  v_is_admin := public.is_admin();

  v_canonical_id := LOWER(TRIM(COALESCE(p_test_id, '')));
  IF v_canonical_id ~ '^(jee-mains-)?ptm[-_ ]?0*([0-9]+)$' THEN
    v_canonical_id := 'jee-mains-ptm-' || LPAD(SUBSTRING(v_canonical_id FROM '[0-9]+$'), 2, '0');
  ELSIF v_canonical_id ~ '^(jee-advanced-)?pta[-_ ]?0*([0-9]+)$' THEN
    v_canonical_id := 'jee-advanced-pta-' || LPAD(SUBSTRING(v_canonical_id FROM '[0-9]+$'), 2, '0');
  END IF;
  v_alias_id := REPLACE(REPLACE(v_canonical_id, 'jee-mains-', ''), 'jee-advanced-', '');
  v_compact_id := REGEXP_REPLACE(v_canonical_id, '[^a-z0-9]', '', 'g');

  WITH matched_attempts AS (
    SELECT
      a.id,
      a.user_id,
      COALESCE(a.obtained_marks, 0) AS score_val,
      COALESCE(a.total_marks, 300) AS max_marks_val,
      COALESCE(a.percentage, 0) AS pct_val,
      COALESCE(a.accuracy, 0) AS acc_val,
      COALESCE(a.time_taken_seconds, 0) AS time_val,
      a.submitted_at,
      COALESCE(a.attempted_in_live_window, FALSE) AS live_win,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS student_name_val
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE COALESCE(a.status, 'completed') = 'completed'
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) <> 'mallicknelov@gmail.com')
      AND (
        LOWER(TRIM(a.test_id)) = v_canonical_id
        OR LOWER(TRIM(a.test_id)) = v_alias_id
        OR LOWER(TRIM(a.test_id)) = LOWER(TRIM(COALESCE(p_test_id, '')))
        OR REGEXP_REPLACE(LOWER(a.test_id), '[^a-z0-9]', '', 'g') = v_compact_id
        OR REGEXP_REPLACE(LOWER(COALESCE(a.code, '')), '[^a-z0-9]', '', 'g') = REGEXP_REPLACE(v_alias_id, '[^a-z0-9]', '', 'g')
      )
  ),
  best_attempts AS (
    SELECT
      m.*,
      ROW_NUMBER() OVER (
        PARTITION BY m.user_id
        ORDER BY m.score_val DESC, m.acc_val DESC, m.time_val ASC, m.submitted_at ASC
      ) AS rn
    FROM matched_attempts m
  ),
  deduped AS (
    SELECT
      b.user_id,
      b.score_val,
      b.max_marks_val,
      b.pct_val,
      b.acc_val,
      b.time_val,
      b.submitted_at,
      b.live_win,
      b.student_name_val,
      (v_current_uid IS NOT NULL AND NOT v_is_admin AND b.user_id = v_current_uid) AS is_me
    FROM best_attempts b
    WHERE b.rn = 1
  ),
  ranked AS (
    SELECT
      d.*,
      COUNT(*) OVER () AS total_students,
      RANK() OVER (ORDER BY d.score_val DESC, d.acc_val DESC, d.time_val ASC, d.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (ORDER BY d.score_val ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC /
         NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100,
        2
      ) AS computed_percentile
    FROM deduped d
  )
  SELECT
    COALESCE(MAX(total_students), 0),
    ROUND(COALESCE(AVG(score_val), 0), 1),
    COALESCE(MAX(score_val), 0),
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'rank', t.computed_rank,
            'student_name', t.student_name_val,
            'display_name', t.student_name_val,
            'score', t.score_val,
            'marks', t.score_val,
            'obtained_marks', t.score_val,
            'max_marks', t.max_marks_val,
            'total_marks', t.max_marks_val,
            'percentage', ROUND(t.pct_val, 2),
            'accuracy', ROUND(t.acc_val, 1),
            'time_taken_seconds', t.time_val,
            'percentile', t.computed_percentile,
            'submitted_at', t.submitted_at,
            'attempted_in_live_window', t.live_win,
            'is_current_user', t.is_me
          )
          ORDER BY t.computed_rank ASC, t.time_val ASC
        )
        FROM (SELECT * FROM ranked ORDER BY computed_rank ASC, time_val ASC LIMIT 5) t
      ),
      '[]'::jsonb
    ),
    CASE WHEN v_is_admin THEN
      COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'rank', a.computed_rank,
              'student_name', a.student_name_val,
              'display_name', a.student_name_val,
              'score', a.score_val,
              'marks', a.score_val,
              'obtained_marks', a.score_val,
              'max_marks', a.max_marks_val,
              'total_marks', a.max_marks_val,
              'percentage', ROUND(a.pct_val, 2),
              'accuracy', ROUND(a.acc_val, 1),
              'time_taken_seconds', a.time_val,
              'percentile', a.computed_percentile,
              'submitted_at', a.submitted_at,
              'attempted_in_live_window', a.live_win,
              'is_current_user', a.is_me
            )
            ORDER BY a.computed_rank ASC, a.time_val ASC
          )
          FROM (SELECT * FROM ranked ORDER BY computed_rank ASC, time_val ASC LIMIT 100) a
        ),
        '[]'::jsonb
      )
    ELSE '[]'::jsonb END,
    CASE WHEN v_current_uid IS NOT NULL AND NOT v_is_admin THEN
      (
        SELECT jsonb_build_object(
          'rank', m.computed_rank,
          'student_name', m.student_name_val,
          'display_name', m.student_name_val,
          'score', m.score_val,
          'marks', m.score_val,
          'obtained_marks', m.score_val,
          'max_marks', m.max_marks_val,
          'total_marks', m.max_marks_val,
          'percentage', ROUND(m.pct_val, 2),
          'accuracy', ROUND(m.acc_val, 1),
          'time_taken_seconds', m.time_val,
          'percentile', m.computed_percentile,
          'submitted_at', m.submitted_at,
          'attempted_in_live_window', m.live_win,
          'is_current_user', TRUE
        )
        FROM ranked m
        WHERE m.user_id = v_current_uid
        LIMIT 1
      )
    ELSE NULL END
  INTO
    v_total_participants,
    v_avg_marks,
    v_high_marks,
    v_top_5,
    v_all_entries,
    v_my_standing
  FROM ranked;

  IF jsonb_array_length(v_top_5) > 0 THEN
    v_topper := v_top_5->0;
  END IF;

  RETURN jsonb_build_object(
    'locked', FALSE,
    'unlocks_at', NULL,
    'total_participants', v_total_participants,
    'highest_marks', v_high_marks,
    'average_marks', v_avg_marks,
    'avg_marks', v_avg_marks,
    'top_5', v_top_5,
    'entries', CASE WHEN v_is_admin THEN v_all_entries ELSE v_top_5 END,
    'all_entries', v_all_entries,
    'topper', v_topper,
    'my_standing', v_my_standing,
    'my_attempt_submitted', (v_my_standing IS NOT NULL)
  );
END;
$$;

-- 4. Recreate public.get_test_toppers_summary()
CREATE OR REPLACE FUNCTION public.get_test_toppers_summary()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $toppers_summary$
DECLARE
  v_result JSONB := '[]'::jsonb;
BEGIN
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
      FALSE AS is_locked
    FROM public.test_configs c
  ),
  normalized_attempts AS (
    SELECT
      CASE
        WHEN LOWER(TRIM(a.test_id)) ~ '^(jee-mains-)?ptm[-_ ]?0*([0-9]+)$' THEN
          'jee-mains-ptm-' || LPAD(SUBSTRING(LOWER(TRIM(a.test_id)) FROM '[0-9]+$'), 2, '0')
        WHEN LOWER(TRIM(a.test_id)) ~ '^(jee-advanced-)?pta[-_ ]?0*([0-9]+)$' THEN
          'jee-advanced-pta-' || LPAD(SUBSTRING(LOWER(TRIM(a.test_id)) FROM '[0-9]+$'), 2, '0')
        ELSE LOWER(TRIM(a.test_id))
      END AS norm_test_id,
      a.user_id,
      COALESCE(a.obtained_marks, 0) AS score_val,
      COALESCE(a.total_marks, 300) AS max_marks_val,
      COALESCE(a.accuracy, 0) AS acc_val,
      COALESCE(a.time_taken_seconds, 0) AS time_val,
      a.submitted_at,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE COALESCE(a.status, 'completed') = 'completed'
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) <> 'mallicknelov@gmail.com')
  ),
  best_attempts AS (
    SELECT DISTINCT ON (na.norm_test_id, na.user_id)
      na.norm_test_id,
      na.user_id,
      na.score_val,
      na.max_marks_val,
      na.acc_val,
      na.time_val,
      na.submitted_at,
      na.display_name
    FROM normalized_attempts na
    ORDER BY na.norm_test_id, na.user_id, na.score_val DESC, na.acc_val DESC, na.time_val ASC, na.submitted_at ASC
  ),
  ranked AS (
    SELECT
      ba.*,
      COUNT(*) OVER (PARTITION BY ba.norm_test_id) AS total_participants,
      RANK() OVER (PARTITION BY ba.norm_test_id ORDER BY ba.score_val DESC, ba.acc_val DESC, ba.time_val ASC, ba.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (PARTITION BY ba.norm_test_id ORDER BY ba.score_val ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC /
         NULLIF(COUNT(*) OVER (PARTITION BY ba.norm_test_id), 0)::NUMERIC) * 100,
        2
      ) AS computed_percentile
    FROM best_attempts ba
  ),
  toppers AS (
    SELECT * FROM ranked WHERE computed_rank = 1
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
        'is_locked', FALSE,
        'total_participants', COALESCE(top.total_participants, 0),
        'topper_name', top.display_name,
        'topper_marks', top.score_val,
        'max_marks', top.max_marks_val,
        'topper_percentile', top.computed_percentile
      )
      ORDER BY ts.test_id ASC
    ),
    '[]'::jsonb
  )
  INTO v_result
  FROM test_summary ts
  LEFT JOIN toppers top ON top.norm_test_id = ts.test_id;

  RETURN v_result;
END;
$toppers_summary$;

-- 5. Recreate public.get_overall_leaderboard()
CREATE OR REPLACE FUNCTION public.get_overall_leaderboard()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $overall_leaderboard$
DECLARE
  v_current_uid UUID;
  v_is_admin BOOLEAN := FALSE;
  v_result JSONB := '[]'::jsonb;
BEGIN
  v_current_uid := auth.uid();
  v_is_admin := public.is_admin();

  WITH normalized_attempts AS (
    SELECT
      CASE
        WHEN LOWER(TRIM(a.test_id)) ~ '^(jee-mains-)?ptm[-_ ]?0*([0-9]+)$' THEN
          'jee-mains-ptm-' || LPAD(SUBSTRING(LOWER(TRIM(a.test_id)) FROM '[0-9]+$'), 2, '0')
        WHEN LOWER(TRIM(a.test_id)) ~ '^(jee-advanced-)?pta[-_ ]?0*([0-9]+)$' THEN
          'jee-advanced-pta-' || LPAD(SUBSTRING(LOWER(TRIM(a.test_id)) FROM '[0-9]+$'), 2, '0')
        ELSE LOWER(TRIM(a.test_id))
      END AS norm_test_id,
      a.user_id,
      COALESCE(a.obtained_marks, 0) AS score_val,
      COALESCE(a.total_marks, 300) AS max_marks_val,
      COALESCE(a.percentage, 0) AS pct_val,
      COALESCE(a.accuracy, 0) AS acc_val,
      COALESCE(a.time_taken_seconds, 0) AS time_val,
      a.submitted_at,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name,
      (v_current_uid IS NOT NULL AND NOT v_is_admin AND a.user_id = v_current_uid) AS is_current_user
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE COALESCE(a.status, 'completed') = 'completed'
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) <> 'mallicknelov@gmail.com')
  ),
  best_attempts AS (
    SELECT DISTINCT ON (na.norm_test_id, na.user_id)
      na.norm_test_id,
      na.user_id,
      na.score_val,
      na.max_marks_val,
      na.pct_val,
      na.acc_val,
      na.display_name,
      na.is_current_user
    FROM normalized_attempts na
    ORDER BY na.norm_test_id, na.user_id, na.score_val DESC, na.acc_val DESC, na.time_val ASC, na.submitted_at ASC
  ),
  per_test_percentiles AS (
    SELECT
      ba.*,
      ROUND(
        (COUNT(*) OVER (PARTITION BY ba.norm_test_id ORDER BY ba.score_val ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC /
         NULLIF(COUNT(*) OVER (PARTITION BY ba.norm_test_id), 0)::NUMERIC) * 100,
        2
      ) AS test_percentile
    FROM best_attempts ba
  ),
  student_aggregates AS (
    SELECT
      user_id,
      MAX(display_name) AS display_name,
      BOOL_OR(is_current_user) AS is_current_user,
      COUNT(DISTINCT norm_test_id) AS tests_attempted,
      ROUND(AVG(test_percentile), 2) AS avg_percentile,
      ROUND(AVG(pct_val), 2) AS avg_marks_percent,
      SUM(score_val) AS total_marks_scored,
      SUM(max_marks_val) AS total_max_marks
    FROM per_test_percentiles
    GROUP BY user_id
  ),
  overall_ranked AS (
    SELECT
      sa.*,
      RANK() OVER (ORDER BY sa.avg_percentile DESC, sa.tests_attempted DESC, sa.total_marks_scored DESC) AS computed_rank
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
      )
      ORDER BY r.computed_rank ASC
    ),
    '[]'::jsonb
  )
  INTO v_result
  FROM overall_ranked r;

  RETURN v_result;
END;
$overall_leaderboard$;

-- 6. Grant EXECUTE explicitly to anon & authenticated visitors + service_role
GRANT EXECUTE ON FUNCTION public.get_test_leaderboard(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_test_toppers_summary() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_overall_leaderboard() TO anon, authenticated, service_role;

-- ==============================================================================
-- APPENDED MIGRATION: Fix Admin Panel Test Submission Counts & Exact Aggregation
-- ==============================================================================
ALTER TABLE public.test_attempts
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'completed',
  ADD COLUMN IF NOT EXISTS test_type TEXT NOT NULL DEFAULT 'mock',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_test_attempts_status_submitted
  ON public.test_attempts(status, submitted_at DESC)
  WHERE status = 'completed';

CREATE INDEX IF NOT EXISTS idx_test_attempts_test_type
  ON public.test_attempts(test_type, test_id, status);

ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.test_attempts FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.test_attempts TO authenticated;
GRANT ALL ON TABLE public.test_attempts TO service_role;

DROP POLICY IF EXISTS "test_attempts_select_policy" ON public.test_attempts;
DROP POLICY IF EXISTS "test_attempts_select_own_or_admin" ON public.test_attempts;
CREATE POLICY "test_attempts_select_policy"
  ON public.test_attempts FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));

DROP POLICY IF EXISTS "test_attempts_insert_policy" ON public.test_attempts;
CREATE POLICY "test_attempts_insert_policy"
  ON public.test_attempts FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "test_attempts_update_policy" ON public.test_attempts;
CREATE POLICY "test_attempts_update_policy"
  ON public.test_attempts FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "test_attempts_delete_in_progress" ON public.test_attempts;
CREATE POLICY "test_attempts_delete_in_progress"
  ON public.test_attempts FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id AND status = 'in_progress');

CREATE OR REPLACE FUNCTION public.prevent_accidental_double_submit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF COALESCE(NEW.status, 'completed') = 'completed' THEN
    IF EXISTS (
      SELECT 1
      FROM public.test_attempts existing
      WHERE existing.user_id = NEW.user_id
        AND LOWER(TRIM(existing.test_id)) = LOWER(TRIM(NEW.test_id))
        AND COALESCE(existing.status, 'completed') = 'completed'
        AND existing.id <> NEW.id
        AND existing.obtained_marks = NEW.obtained_marks
        AND existing.submitted_at >= NOW() - INTERVAL '10 seconds'
    ) THEN
      RETURN NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_accidental_double_submit ON public.test_attempts;
CREATE TRIGGER trg_prevent_accidental_double_submit
  BEFORE INSERT ON public.test_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_accidental_double_submit();

CREATE OR REPLACE FUNCTION public.get_admin_submission_stats()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_result JSONB := NULL;
BEGIN
  IF NOT COALESCE(public.is_admin(), FALSE) THEN
    RAISE EXCEPTION 'Forbidden: Admin privileges required' USING ERRCODE = '42501';
  END IF;

  WITH classified AS (
    SELECT
      a.id,
      a.user_id,
      CASE
        WHEN LOWER(TRIM(COALESCE(a.test_id, ''))) ~ '^(jee-mains-)?ptm[-_ ]*0*[0-9]+$' THEN
          'jee-mains-ptm-' || LPAD((SUBSTRING(LOWER(TRIM(a.test_id)) FROM '([0-9]+)$'))::INTEGER::TEXT, 2, '0')
        WHEN LOWER(TRIM(COALESCE(a.test_id, ''))) ~ '^(jee-advanced-)?pta[-_ ]*0*[0-9]+$' THEN
          'jee-advanced-pta-' || LPAD((SUBSTRING(LOWER(TRIM(a.test_id)) FROM '([0-9]+)$'))::INTEGER::TEXT, 2, '0')
        ELSE LOWER(TRIM(COALESCE(a.test_id, 'unknown')))
      END AS canon_test_id,
      CASE
        WHEN LOWER(TRIM(COALESCE(a.test_id, ''))) ~ '^(jee-mains-)?ptm[-_ ]*0*[0-9]+$' THEN
          'PTM ' || LPAD((SUBSTRING(LOWER(TRIM(a.test_id)) FROM '([0-9]+)$'))::INTEGER::TEXT, 2, '0')
        WHEN LOWER(TRIM(COALESCE(a.test_id, ''))) ~ '^(jee-advanced-)?pta[-_ ]*0*[0-9]+$' THEN
          'PTA ' || LPAD((SUBSTRING(LOWER(TRIM(a.test_id)) FROM '([0-9]+)$'))::INTEGER::TEXT, 2, '0')
        ELSE COALESCE(NULLIF(TRIM(a.code), ''), a.test_id, 'Exercise')
      END AS canon_code,
      CASE
        WHEN COALESCE(a.test_type, '') = 'chapter_exercise'
          OR LOWER(COALESCE(a.test_id, '')) LIKE 'chapter%'
          OR LOWER(COALESCE(a.test_id, '')) LIKE '%exercise%'
          OR LOWER(COALESCE(a.test_id, '')) ~ '^(physics|chemistry|mathematics|maths)[-_]'
        THEN 'chapter_exercise'
        ELSE 'mock'
      END AS norm_test_type,
      (COALESCE(a.status, 'completed') = 'completed' AND a.submitted_at IS NOT NULL) AS is_completed,
      (COALESCE(a.status, 'completed') = 'in_progress') AS is_in_progress,
      (
        COALESCE(p.role, '') = 'admin'
        OR LOWER(COALESCE(p.email, u.email, '')) = 'mallicknelov@gmail.com'
      ) AS is_admin_row,
      a.submitted_at
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
  ),
  overall_counts AS (
    SELECT
      COUNT(DISTINCT (COALESCE(user_id::TEXT, '') || '::' || canon_test_id)) FILTER (WHERE is_completed AND NOT is_admin_row)::INTEGER AS unique_submissions_total,
      COUNT(DISTINCT user_id) FILTER (WHERE is_completed AND NOT is_admin_row)::INTEGER AS unique_students_total,
      COUNT(*) FILTER (WHERE is_completed AND NOT is_admin_row)::INTEGER AS completed_total,
      COUNT(*) FILTER (WHERE is_completed)::INTEGER AS completed_including_admin,
      COUNT(*) FILTER (WHERE is_completed AND is_admin_row)::INTEGER AS admin_preview_count,
      COUNT(*) FILTER (WHERE is_in_progress)::INTEGER AS in_progress_count,
      COUNT(DISTINCT (COALESCE(user_id::TEXT, '') || '::' || canon_test_id)) FILTER (WHERE is_completed AND NOT is_admin_row AND norm_test_type = 'mock')::INTEGER AS mock_unique_submissions,
      COUNT(DISTINCT (COALESCE(user_id::TEXT, '') || '::' || canon_test_id)) FILTER (WHERE is_completed AND NOT is_admin_row AND norm_test_type = 'chapter_exercise')::INTEGER AS chapter_unique_submissions,
      COUNT(*) FILTER (WHERE is_completed AND NOT is_admin_row AND norm_test_type = 'mock')::INTEGER AS mock_completed_count,
      COUNT(*) FILTER (WHERE is_completed AND NOT is_admin_row AND norm_test_type = 'chapter_exercise')::INTEGER AS chapter_completed_count
    FROM classified
  ),
  grouped AS (
    SELECT
      canon_test_id AS test_id,
      MAX(canon_code) AS code,
      MAX(norm_test_type) AS test_type,
      COUNT(DISTINCT user_id) FILTER (WHERE is_completed AND NOT is_admin_row)::INTEGER AS unique_students,
      COUNT(*) FILTER (WHERE is_completed AND NOT is_admin_row)::INTEGER AS completed_count,
      COUNT(*) FILTER (WHERE is_in_progress)::INTEGER AS in_progress_count,
      COUNT(*) FILTER (WHERE is_completed AND is_admin_row)::INTEGER AS admin_preview_count,
      MAX(submitted_at) FILTER (WHERE is_completed AND NOT is_admin_row) AS last_submitted_at
    FROM classified
    GROUP BY canon_test_id
  ),
  grouped_json AS (
    SELECT COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'test_id', g.test_id,
          'code', g.code,
          'test_type', g.test_type,
          'unique_students', g.unique_students,
          'completed_count', g.completed_count,
          'in_progress_count', g.in_progress_count,
          'admin_preview_count', g.admin_preview_count,
          'last_submitted_at', g.last_submitted_at
        )
        ORDER BY g.unique_students DESC, g.test_id ASC
      ),
      '[]'::jsonb
    ) AS by_test
    FROM grouped g
  )
  SELECT jsonb_build_object(
    'unique_submissions_total', COALESCE(o.unique_submissions_total, 0),
    'unique_students_total', COALESCE(o.unique_students_total, 0),
    'completed_total', COALESCE(o.completed_total, 0),
    'completed_including_admin', COALESCE(o.completed_including_admin, 0),
    'admin_preview_count', COALESCE(o.admin_preview_count, 0),
    'in_progress_count', COALESCE(o.in_progress_count, 0),
    'mock_unique_submissions', COALESCE(o.mock_unique_submissions, 0),
    'chapter_unique_submissions', COALESCE(o.chapter_unique_submissions, 0),
    'mock_completed_count', COALESCE(o.mock_completed_count, 0),
    'chapter_completed_count', COALESCE(o.chapter_completed_count, 0),
    'by_test', COALESCE(gj.by_test, '[]'::jsonb)
  )
  INTO v_result
  FROM overall_counts o
  CROSS JOIN grouped_json gj;

  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_submission_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_submission_stats() TO authenticated, service_role;

