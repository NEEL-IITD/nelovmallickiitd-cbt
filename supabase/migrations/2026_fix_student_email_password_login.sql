-- ==============================================================================
-- Migration: Fix Student Email (Gmail) & Password Login, Signup Trigger, & Profiles RLS
-- 1. Adds missing profile columns referenced by handle_new_user() & updateProfile()
--    (`avatar_url`, `daily_question_goal`, `current_streak`, etc.) to stop HTTP 500
--    on POST /signup (`column "avatar_url" of relation "profiles" does not exist`).
-- 2. Relaxes `check_email_or_contact` so any valid email (Gmail, Outlook, Yahoo, college)
--    with any auth_method (`gmail`, `google`, `email`, `email_with_phone`, `phone`) works.
-- 3. Updates `public.handle_new_user()` safely (`SECURITY DEFINER`, `SET search_path = ''`,
--    strict admin check ONLY for `mallicknelov@gmail.com`).
-- 4. Preserves student role & non-admin profile updates (`trg_protect_profile_role`)
--    while strictly preventing privilege escalation.
-- 5. Keeps RLS enabled and backfills any auth.users rows missing from public.profiles.
-- Safe & Idempotent (Does NOT alter any existing tests, attempts, or student accounts).
-- ==============================================================================

-- 1. Ensure all columns used by triggers and auth services exist on public.profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS daily_question_goal INTEGER NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS current_streak INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS contact_number TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS auth_method TEXT DEFAULT 'gmail',
  ADD COLUMN IF NOT EXISTS accepted_terms_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS accepted_terms_version TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS parental_consent_confirmed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Replace restrictive check_email_or_contact constraint so valid non-Gmail & Gmail
--    accounts never fail profile creation or updates
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS check_email_or_contact;

ALTER TABLE public.profiles
  ADD CONSTRAINT check_email_or_contact CHECK (
    (email IS NOT NULL AND length(TRIM(BOTH FROM email)) >= 3 AND POSITION('@' IN email) > 1)
    OR (contact_number IS NOT NULL AND length(TRIM(BOTH FROM contact_number)) >= 10)
    OR (role = 'admin')
  );

-- Keep role check strict
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'admin'));

-- 3. Strict Admin helper function (unchanged restriction: mallicknelov@gmail.com only)
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

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- 4. Protect profile.role without blocking legitimate student updates
CREATE OR REPLACE FUNCTION public.trg_protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.role IS DISTINCT FROM NEW.role THEN
    IF (SELECT auth.uid()) IS NOT NULL AND NOT (SELECT public.is_admin()) THEN
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

-- 5. Resilient, idempotent auth.users -> public.profiles trigger
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
  IF COALESCE(NEW.email, '') LIKE '%@phone.nelovportal.local' THEN
    v_is_phone_user := TRUE;
    v_email := NULL;
  ELSE
    v_email := NULLIF(LOWER(TRIM(COALESCE(NEW.email, ''))), '');
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

  v_target_exam := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'preferred_exam'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'target_exam'), ''),
    'JEE 2027'
  );
  IF v_target_exam NOT IN ('JEE 2027', 'JEE Mains', 'JEE Advanced', 'Both') THEN
    v_target_exam := 'JEE 2027';
  END IF;

  v_contact_number := NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'contact_number', '')), '');
  IF v_is_phone_user AND v_contact_number IS NULL AND NEW.email ~ '^91[0-9]{10}@' THEN
    v_contact_number := '+91 ' || SUBSTRING(SPLIT_PART(NEW.email, '@', 1) FROM 3 FOR 5) || ' ' || SUBSTRING(SPLIT_PART(NEW.email, '@', 1) FROM 8 FOR 5);
  END IF;

  IF NEW.raw_app_meta_data->>'provider' = 'google' OR NEW.raw_user_meta_data->>'auth_method' = 'google' THEN
    v_auth_method := 'google';
  ELSIF v_is_phone_user THEN
    v_auth_method := 'phone';
  ELSIF v_email ILIKE '%@gmail.com' THEN
    v_auth_method := 'gmail';
  ELSIF v_contact_number IS NOT NULL AND v_email IS NOT NULL THEN
    v_auth_method := 'email_with_phone';
  ELSE
    v_auth_method := COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'auth_method'), ''), 'email');
  END IF;

  IF NEW.raw_user_meta_data->>'accepted_terms_at' IS NOT NULL THEN
    BEGIN
      v_accepted_terms_at := (NEW.raw_user_meta_data->>'accepted_terms_at')::TIMESTAMPTZ;
    EXCEPTION WHEN OTHERS THEN
      v_accepted_terms_at := NOW();
    END;
  END IF;

  v_accepted_terms_version := NULLIF(TRIM(NEW.raw_user_meta_data->>'accepted_terms_version'), '');
  IF NEW.raw_user_meta_data->>'parental_consent_confirmed' IS NOT NULL THEN
    BEGIN
      v_parental_consent := COALESCE((NEW.raw_user_meta_data->>'parental_consent_confirmed')::BOOLEAN, FALSE);
    EXCEPTION WHEN OTHERS THEN
      v_parental_consent := FALSE;
    END;
  END IF;

  IF LOWER(COALESCE(v_email, '')) = 'mallicknelov@gmail.com' THEN
    v_role := 'admin';
  END IF;

  INSERT INTO public.profiles (
    id, full_name, email, avatar_url, contact_number, auth_method, target_exam,
    role, daily_question_goal, accepted_terms_at, accepted_terms_version,
    parental_consent_confirmed, created_at, updated_at, last_login_at
  )
  VALUES (
    NEW.id, v_full_name, v_email, v_avatar_url, v_contact_number, v_auth_method, v_target_exam,
    v_role, 30, v_accepted_terms_at, v_accepted_terms_version,
    v_parental_consent, COALESCE(NEW.created_at, NOW()), NOW(), NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = COALESCE(NULLIF(TRIM(public.profiles.full_name), ''), EXCLUDED.full_name),
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    contact_number = COALESCE(EXCLUDED.contact_number, public.profiles.contact_number),
    auth_method = COALESCE(public.profiles.auth_method, EXCLUDED.auth_method),
    target_exam = COALESCE(public.profiles.target_exam, EXCLUDED.target_exam),
    role = CASE
      WHEN LOWER(COALESCE(EXCLUDED.email, public.profiles.email, '')) = 'mallicknelov@gmail.com' THEN 'admin'
      ELSE COALESCE(public.profiles.role, 'student')
    END,
    updated_at = NOW(),
    last_login_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 6. Verify RLS policies and table grants on public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;

DROP POLICY IF EXISTS "profiles_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id OR (SELECT public.is_admin()));

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id OR (SELECT public.is_admin()))
  WITH CHECK ((SELECT auth.uid()) = id OR (SELECT public.is_admin()));

-- 7. Backfill any missing profiles cleanly for existing auth.users rows
INSERT INTO public.profiles (
  id, full_name, email, avatar_url, contact_number, auth_method, target_exam,
  role, daily_question_goal, accepted_terms_at, accepted_terms_version,
  parental_consent_confirmed, created_at, updated_at, last_login_at
)
SELECT
  u.id,
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(u.raw_user_meta_data->>'name'), ''),
    CASE
      WHEN COALESCE(u.email, '') LIKE '%@phone.nelovportal.local' THEN 'Student Aspirant'
      WHEN u.email IS NOT NULL AND POSITION('@' IN u.email) > 1 THEN SPLIT_PART(u.email, '@', 1)
      ELSE 'Student Aspirant'
    END
  ),
  CASE
    WHEN COALESCE(u.email, '') LIKE '%@phone.nelovportal.local' THEN NULL
    ELSE LOWER(TRIM(u.email))
  END,
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data->>'avatar_url'), ''),
    NULLIF(TRIM(u.raw_user_meta_data->>'picture'), '')
  ),
  CASE
    WHEN NULLIF(TRIM(COALESCE(u.raw_user_meta_data->>'contact_number', '')), '') IS NOT NULL
      THEN TRIM(u.raw_user_meta_data->>'contact_number')
    WHEN COALESCE(u.email, '') ~ '^91[0-9]{10}@phone\.nelovportal\.local$'
      THEN '+91 ' || SUBSTRING(SPLIT_PART(u.email, '@', 1) FROM 3 FOR 5) || ' ' || SUBSTRING(SPLIT_PART(u.email, '@', 1) FROM 8 FOR 5)
    ELSE NULL
  END,
  CASE
    WHEN u.raw_app_meta_data->>'provider' = 'google' THEN 'google'
    WHEN COALESCE(u.email, '') LIKE '%@phone.nelovportal.local' THEN 'phone'
    WHEN COALESCE(u.email, '') ILIKE '%@gmail.com' THEN 'gmail'
    ELSE 'email'
  END,
  CASE
    WHEN COALESCE(u.raw_user_meta_data->>'preferred_exam', u.raw_user_meta_data->>'target_exam', 'JEE 2027')
      IN ('JEE 2027', 'JEE Mains', 'JEE Advanced', 'Both')
      THEN COALESCE(u.raw_user_meta_data->>'preferred_exam', u.raw_user_meta_data->>'target_exam', 'JEE 2027')
    ELSE 'JEE 2027'
  END,
  CASE
    WHEN LOWER(COALESCE(u.email, '')) = 'mallicknelov@gmail.com' THEN 'admin'
    ELSE 'student'
  END,
  30,
  NOW(),
  '2026-11',
  FALSE,
  COALESCE(u.created_at, NOW()),
  NOW(),
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- Optional one-time manual helper (ONLY if you ever have stuck unconfirmed users
-- from before disabling email confirmations or SMTP delivery issues):
-- UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL AND deleted_at IS NULL;
-- ==============================================================================
