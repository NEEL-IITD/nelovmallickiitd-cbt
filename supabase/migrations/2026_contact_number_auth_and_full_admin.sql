-- ==============================================================================
-- NelovMallickIITD CBT Platform - Migration: Contact Number Auth & Full Admin
-- File: supabase/migrations/2026_contact_number_auth_and_full_admin.sql
-- Idempotent & Non-Destructive: Safe to run multiple times without data loss
-- Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
-- ==============================================================================

-- 1. Add new columns to public.profiles safely
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contact_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS auth_method TEXT DEFAULT 'gmail';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Allow email to be NULL for phone-only registered students
ALTER TABLE public.profiles ALTER COLUMN email DROP NOT NULL;

-- 3. Create unique index on contact_number (ignoring NULLs)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_contact_number 
  ON public.profiles(contact_number) 
  WHERE contact_number IS NOT NULL;

-- 4. Safe Database-Level Contact Number Enforcement:
-- Every row must either have an @gmail.com email, OR a valid contact number (>=10 chars), OR role = 'admin'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_email_or_contact'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT check_email_or_contact
      CHECK (
        (email ILIKE '%@gmail.com') OR 
        (contact_number IS NOT NULL AND length(trim(contact_number)) >= 10) OR 
        (role = 'admin')
      );
  END IF;
END $$;

-- 5. Add reporter_contact_number to error_reports safely
ALTER TABLE public.error_reports ADD COLUMN IF NOT EXISTS reporter_contact_number TEXT;

-- 6. Helper function: Safely check if current authenticated user has 'admin' role
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

-- 7. Upgrade handle_new_user() trigger function
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
  -- Determine if this user signed up via contact number (internal synthetic domain)
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

  -- Extract target examination
  v_target_exam := COALESCE(
    NEW.raw_user_meta_data->>'target_exam',
    'JEE Advanced'
  );
  IF v_target_exam NOT IN ('JEE Mains', 'JEE Advanced', 'Both') THEN
    v_target_exam := 'JEE Advanced';
  END IF;

  -- Extract clean contact number
  v_contact_number := NEW.raw_user_meta_data->>'contact_number';
  IF v_contact_number IS NOT NULL AND TRIM(v_contact_number) = '' THEN
    v_contact_number := NULL;
  END IF;

  -- Extract or derive auth method
  v_auth_method := COALESCE(
    NEW.raw_user_meta_data->>'auth_method',
    CASE 
      WHEN v_is_phone_user THEN 'phone'
      WHEN NEW.raw_app_meta_data->>'provider' = 'google' THEN 'google'
      WHEN v_email ILIKE '%@gmail.com' THEN 'gmail'
      ELSE 'email_with_phone'
    END
  );

  -- Automatic Admin Gmail Recognition:
  -- Automatically grants 'admin' role if email matches the designated Admin Gmail
  IF LOWER(COALESCE(NEW.email, '')) = LOWER('YOUR_ADMIN_EMAIL@gmail.com')
     OR LOWER(COALESCE(NEW.email, '')) IN ('nelovmallick@gmail.com', 'mallicknelov@gmail.com', 'nelovmallick@iitd.ac.in')
     OR LOWER(COALESCE(v_email, '')) = LOWER('YOUR_ADMIN_EMAIL@gmail.com')
     OR LOWER(COALESCE(v_email, '')) IN ('nelovmallick@gmail.com', 'mallicknelov@gmail.com', 'nelovmallick@iitd.ac.in') THEN
    v_role := 'admin';
  END IF;

  -- Upsert profile row cleanly
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

-- Ensure trigger is active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 8. Immediate Elevation for Admin Gmail
UPDATE public.profiles
SET role = 'admin'
WHERE LOWER(COALESCE(email, '')) = LOWER('YOUR_ADMIN_EMAIL@gmail.com')
   OR LOWER(COALESCE(email, '')) IN ('nelovmallick@gmail.com', 'mallicknelov@gmail.com', 'nelovmallick@iitd.ac.in');

-- 9. Comprehensive Admin Row Level Security (RLS) Policies
-- Ensure public.is_admin() has full SELECT across all platform tables

-- 9.1 Bookmarks (Revision Notebook)
DROP POLICY IF EXISTS "bookmarks_select_policy" ON public.bookmarks;
CREATE POLICY "bookmarks_select_policy"
  ON public.bookmarks
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- 9.2 Lecture Progress
DROP POLICY IF EXISTS "lecture_progress_select_policy" ON public.lecture_progress;
CREATE POLICY "lecture_progress_select_policy"
  ON public.lecture_progress
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- 9.3 Profiles
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- 9.4 Test Attempts
DROP POLICY IF EXISTS "test_attempts_select_policy" ON public.test_attempts;
CREATE POLICY "test_attempts_select_policy"
  ON public.test_attempts
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- 9.5 Error Reports
DROP POLICY IF EXISTS "error_reports_select_policy" ON public.error_reports;
CREATE POLICY "error_reports_select_policy"
  ON public.error_reports
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "error_reports_update_admin" ON public.error_reports;
CREATE POLICY "error_reports_update_admin"
  ON public.error_reports
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "error_reports_delete_admin" ON public.error_reports;
CREATE POLICY "error_reports_delete_admin"
  ON public.error_reports
  FOR DELETE
  USING (public.is_admin());

-- 10. Test Catalog: Seed & Synchronize PTM 01–10 (JEE Mains) and PTA 01–10 (JEE Advanced)
INSERT INTO public.test_configs (test_id, exam_type, code, title, status, updated_at)
VALUES
  -- JEE Advanced (PTA 01 - PTA 10)
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

  -- JEE Mains (PTM 01 - PTM 10)
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
  updated_at = NOW();
