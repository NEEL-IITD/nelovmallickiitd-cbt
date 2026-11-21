-- ==============================================================================
-- Migration: 2026_fix_consent_modal_rls.sql
-- Target: Supabase (lyzmismtmtsvlqpzdruy)
-- Platform: NelovMallickIITD CBT Platform (Mentored by Nelov Mallick)
--
-- PURPOSE:
-- 1. Ensure accepted_terms_at, accepted_terms_version, parental_consent_confirmed
--    and all core profile columns exist on public.profiles.
-- 2. Drop restrictive/recursive RLS policies on public.profiles and replace with
--    clean, non-blocking policies for authenticated users and admins.
-- 3. Explicitly grant SELECT, INSERT, UPDATE permissions to authenticated users.
-- ==============================================================================

-- 1. Ensure all columns exist on public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS accepted_terms_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS accepted_terms_version TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS parental_consent_confirmed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contact_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS auth_method TEXT DEFAULT 'gmail';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_exam TEXT DEFAULT 'JEE Advanced';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure email can be NULL (supporting phone-only registered students)
ALTER TABLE public.profiles ALTER COLUMN email DROP NOT NULL;

-- Safe indexes
CREATE INDEX IF NOT EXISTS idx_profiles_accepted_terms ON public.profiles(accepted_terms_at);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 2. Grant table permissions explicitly
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.profiles TO anon;

-- 3. Re-create clean, non-recursive RLS policies on public.profiles
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
    auth.uid() = id
    OR public.is_admin()
  );
