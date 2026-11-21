-- ==============================================================================
-- Migration: 2026_fix_gmail_students_admin_visibility.sql
-- Target: Supabase (PostgreSQL 15+)
-- Platform: NelovMallickIITD CBT Platform (Mentored by Nelov Mallick, IIT Delhi)
--
-- PURPOSE:
-- 1. Relax/fix check constraint on public.profiles to accept Google OAuth signups.
-- 2. Upgrade public.is_admin() with safe search_path and direct JWT claim check
--    so admin access works even if profile role lookup experiences a sync delay.
-- 3. Overhaul public.handle_new_user() trigger with search_path = '' and robust
--    provider detection for Google OAuth and Gmail signups.
-- 4. Add missing profiles_insert_policy so frontend self-healing upserts succeed.
-- 5. Backfill all existing auth.users into public.profiles immediately.
-- 6. Guarantee Nelov Mallick's admin role across profiles.
-- ==============================================================================

-- 1. Drop restrictive check constraint and add flexible constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS check_email_or_contact;
ALTER TABLE public.profiles ADD CONSTRAINT check_email_or_contact CHECK (
  (auth_method IN ('google', 'gmail') AND email IS NOT NULL) OR
  (email ILIKE '%@gmail.com') OR
  (contact_number IS NOT NULL AND length(trim(contact_number)) >= 10) OR
  (role = 'admin')
);

-- 2. Upgrade public.is_admin() function
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
    'nelovmallick@iitd.ac.in',
    'your_admin_email@gmail.com'
  ) THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;

-- 3. Overhaul public.handle_new_user() Trigger Function
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
  -- Determine if synthetic phone account or regular email/OAuth account
  IF NEW.email LIKE '%@phone.nelovportal.local' THEN
    v_is_phone_user := TRUE;
    v_email := NULL;
  ELSE
    v_email := NEW.email;
  END IF;

  -- Extract full name with fallbacks
  v_full_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    CASE
      WHEN v_is_phone_user THEN 'Student Aspirant'
      WHEN v_email IS NOT NULL AND POSITION('@' IN v_email) > 1 THEN SPLIT_PART(v_email, '@', 1)
      ELSE 'Student Aspirant'
    END
  );

  -- Target Exam
  v_target_exam := COALESCE(NEW.raw_user_meta_data->>'target_exam', 'JEE Advanced');
  IF v_target_exam NOT IN ('JEE Mains', 'JEE Advanced', 'Both') THEN
    v_target_exam := 'JEE Advanced';
  END IF;

  -- Contact number
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

  -- Terms Acceptance metadata
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

  -- Auto Admin Assignment for Nelov Mallick
  IF LOWER(COALESCE(NEW.email, '')) IN (
    'mallicknelov@gmail.com',
    'nelovmallick@gmail.com',
    'nelovmallick@iitd.ac.in',
    'your_admin_email@gmail.com'
  ) OR LOWER(COALESCE(v_email, '')) IN (
    'mallicknelov@gmail.com',
    'nelovmallick@gmail.com',
    'nelovmallick@iitd.ac.in',
    'your_admin_email@gmail.com'
  ) THEN
    v_role := 'admin';
  END IF;

  -- Insert or Update profile row idempotently
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

-- Ensure trigger is active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Ensure RLS Policies on public.profiles allow Self-Healing Inserts & Admin Access
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = id
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
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

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.profiles TO anon;

-- 5. Backfill: Synchronize all existing auth.users into public.profiles immediately
-- This instantly restores visibility of the 2 students who logged in via Google OAuth
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
SELECT
  u.id,
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(u.raw_user_meta_data->>'name'), ''),
    CASE
      WHEN u.email LIKE '%@phone.nelovportal.local' THEN 'Student Aspirant'
      WHEN u.email IS NOT NULL AND POSITION('@' IN u.email) > 1 THEN SPLIT_PART(u.email, '@', 1)
      ELSE 'Student Aspirant'
    END
  ) AS full_name,
  CASE
    WHEN u.email LIKE '%@phone.nelovportal.local' THEN NULL
    ELSE u.email
  END AS email,
  NULLIF(TRIM(u.raw_user_meta_data->>'contact_number'), '') AS contact_number,
  CASE
    WHEN u.raw_app_meta_data->>'provider' = 'google' THEN 'google'
    WHEN u.raw_user_meta_data->>'auth_method' = 'google' THEN 'google'
    WHEN u.email LIKE '%@phone.nelovportal.local' THEN 'phone'
    WHEN u.email ILIKE '%@gmail.com' THEN 'gmail'
    ELSE 'google'
  END AS auth_method,
  COALESCE(NULLIF(u.raw_user_meta_data->>'target_exam', ''), 'JEE Advanced') AS target_exam,
  CASE
    WHEN LOWER(COALESCE(u.email, '')) IN (
      'mallicknelov@gmail.com',
      'nelovmallick@gmail.com',
      'nelovmallick@iitd.ac.in',
      'your_admin_email@gmail.com'
    ) THEN 'admin'
    ELSE 'student'
  END AS role,
  COALESCE(u.created_at, NOW()) AS created_at,
  COALESCE(u.last_sign_in_at, u.created_at, NOW()) AS last_login_at
FROM auth.users u
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = COALESCE(EXCLUDED.email, public.profiles.email),
  contact_number = COALESCE(EXCLUDED.contact_number, public.profiles.contact_number),
  auth_method = COALESCE(EXCLUDED.auth_method, public.profiles.auth_method),
  role = CASE
    WHEN LOWER(COALESCE(EXCLUDED.email, '')) IN (
      'mallicknelov@gmail.com',
      'nelovmallick@gmail.com',
      'nelovmallick@iitd.ac.in',
      'your_admin_email@gmail.com'
    ) THEN 'admin'
    ELSE public.profiles.role
  END,
  last_login_at = COALESCE(EXCLUDED.last_login_at, public.profiles.last_login_at);

-- 6. Guarantee Admin status for Nelov Mallick
UPDATE public.profiles
SET role = 'admin'
WHERE LOWER(COALESCE(email, '')) IN (
  'mallicknelov@gmail.com',
  'nelovmallick@gmail.com',
  'nelovmallick@iitd.ac.in',
  'your_admin_email@gmail.com'
);
