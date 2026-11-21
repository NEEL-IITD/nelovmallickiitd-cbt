-- ==============================================================================
-- Migration: Legal Consent Tracking & Self-Service Account Deletion (DPDP Act 2023)
-- Portal: Nelov Mallick Free JEE Mains & Advanced CBT Platform (100% Free Forever)
-- Mentored by Nelov Mallick (IIT Delhi)
-- ==============================================================================

-- 1. Add Legal Consent & Parental Approval Columns to public.profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS accepted_terms_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS accepted_terms_version TEXT,
  ADD COLUMN IF NOT EXISTS parental_consent_confirmed BOOLEAN DEFAULT FALSE;

-- Index for compliance auditing and queries
CREATE INDEX IF NOT EXISTS idx_profiles_accepted_terms 
  ON public.profiles(accepted_terms_at);

-- 2. Update handle_new_user() Trigger to Record Legal Consent & Under-18 Parental Consent
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
    accepted_terms_at = COALESCE(profiles.accepted_terms_at, EXCLUDED.accepted_terms_at),
    accepted_terms_version = COALESCE(profiles.accepted_terms_version, EXCLUDED.accepted_terms_version),
    parental_consent_confirmed = COALESCE(profiles.parental_consent_confirmed, EXCLUDED.parental_consent_confirmed),
    last_login_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Self-Service Account Deletion Function (public.delete_my_account)
-- Permanently deletes student profile, test attempts, bookmarks, and auth record
-- Admin safety check prevents self-lockout
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

  -- Scrub PII from past error reports submitted by this user (preserve report content for academic QA)
  UPDATE public.error_reports
  SET reporter_name = 'Deleted User',
      reporter_email = NULL
  WHERE user_id = v_user_id;

  -- Scrub any additional student-specific tracking
  -- ON DELETE CASCADE on profiles, test_attempts, test_bookmarks, lecture_progress, vault_bookmarks
  -- will automatically wipe all associated records when auth.users row is deleted.
  DELETE FROM auth.users WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', TRUE,
    'message', 'Your account and all associated test records, bookmarks, and data have been permanently erased.'
  );
END;
$$;

-- Secure Permissions
REVOKE ALL ON FUNCTION public.delete_my_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;
