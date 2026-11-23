-- ==============================================================================
-- Migration: Lock Admin Uploader and Content Write Capabilities to mallicknelov@gmail.com
-- Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
--
-- Security Measures:
-- 1. Strictly redefine public.is_admin() to check ONLY mallicknelov@gmail.com.
-- 2. Demote any non-mallicknelov@gmail.com accounts in public.profiles to 'student'.
-- 3. Ensure mallicknelov@gmail.com profile is set to role = 'admin'.
-- 4. Add BEFORE INSERT OR UPDATE trigger on public.profiles to prevent role escalation.
-- 5. Tighten RLS on public.profiles to prevent self-elevation to admin.
-- 6. Enforce strict public.is_admin() write policies on public.test_configs.
-- 7. Ensure public.vault_exercises & public.vault_theory_notes tables exist and lock write access.
-- 8. Secure Supabase Storage (storage.objects) so SELECT is public, but write is strictly admin.
-- ==============================================================================

-- 1. Lock public.is_admin() strictly to mallicknelov@gmail.com
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

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- 2. Demote any rogue or non-director admin accounts to 'student'
UPDATE public.profiles
SET role = 'student'
WHERE role = 'admin'
  AND LOWER(COALESCE(email, '')) <> 'mallicknelov@gmail.com';

-- 3. Ensure director account has role = 'admin'
UPDATE public.profiles
SET role = 'admin'
WHERE LOWER(COALESCE(email, '')) = 'mallicknelov@gmail.com';

-- 4. Create trigger to prevent role escalation to 'admin' by non-directors
CREATE OR REPLACE FUNCTION public.trg_protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- If role is set to 'admin', strictly verify email is mallicknelov@gmail.com
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

-- 5. Update RLS policies on public.profiles
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    (auth.uid() = id AND (role IS NULL OR role = 'student' OR LOWER(COALESCE(email, '')) = 'mallicknelov@gmail.com'))
    OR (SELECT public.is_admin())
  );

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

-- 6. Lock Write Access on public.test_configs
DROP POLICY IF EXISTS "test_configs_admin_write" ON public.test_configs;
DROP POLICY IF EXISTS "test_configs_admin_insert" ON public.test_configs;
DROP POLICY IF EXISTS "test_configs_admin_update" ON public.test_configs;
DROP POLICY IF EXISTS "test_configs_admin_delete" ON public.test_configs;

CREATE POLICY "test_configs_admin_write"
  ON public.test_configs
  FOR ALL
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

-- ==============================================================================
-- 7. Ensure Vault Tables Exist & Enforce Strict RLS
-- ==============================================================================

-- 7A. public.vault_exercises
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

ALTER TABLE public.vault_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for vault exercises" ON public.vault_exercises;
DROP POLICY IF EXISTS "Admins can insert vault exercises" ON public.vault_exercises;
DROP POLICY IF EXISTS "Admins can update vault exercises" ON public.vault_exercises;
DROP POLICY IF EXISTS "Admins can delete vault exercises" ON public.vault_exercises;
DROP POLICY IF EXISTS "vault_exercises_select_public" ON public.vault_exercises;
DROP POLICY IF EXISTS "vault_exercises_admin_insert" ON public.vault_exercises;
DROP POLICY IF EXISTS "vault_exercises_admin_update" ON public.vault_exercises;
DROP POLICY IF EXISTS "vault_exercises_admin_delete" ON public.vault_exercises;

CREATE POLICY "vault_exercises_select_public"
  ON public.vault_exercises FOR SELECT
  USING (true);

CREATE POLICY "vault_exercises_admin_insert"
  ON public.vault_exercises FOR INSERT
  WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "vault_exercises_admin_update"
  ON public.vault_exercises FOR UPDATE
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "vault_exercises_admin_delete"
  ON public.vault_exercises FOR DELETE
  USING ((SELECT public.is_admin()));

GRANT SELECT ON public.vault_exercises TO anon, authenticated;

-- 7B. public.vault_theory_notes
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

ALTER TABLE public.vault_theory_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for vault theory notes" ON public.vault_theory_notes;
DROP POLICY IF EXISTS "Admins can insert vault theory notes" ON public.vault_theory_notes;
DROP POLICY IF EXISTS "Admins can update vault theory notes" ON public.vault_theory_notes;
DROP POLICY IF EXISTS "Admins can delete vault theory notes" ON public.vault_theory_notes;
DROP POLICY IF EXISTS "vault_theory_notes_select_public" ON public.vault_theory_notes;
DROP POLICY IF EXISTS "vault_theory_notes_admin_insert" ON public.vault_theory_notes;
DROP POLICY IF EXISTS "vault_theory_notes_admin_update" ON public.vault_theory_notes;
DROP POLICY IF EXISTS "vault_theory_notes_admin_delete" ON public.vault_theory_notes;

CREATE POLICY "vault_theory_notes_select_public"
  ON public.vault_theory_notes FOR SELECT
  USING (true);

CREATE POLICY "vault_theory_notes_admin_insert"
  ON public.vault_theory_notes FOR INSERT
  WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "vault_theory_notes_admin_update"
  ON public.vault_theory_notes FOR UPDATE
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "vault_theory_notes_admin_delete"
  ON public.vault_theory_notes FOR DELETE
  USING ((SELECT public.is_admin()));

GRANT SELECT ON public.vault_theory_notes TO anon, authenticated;

-- ==============================================================================
-- 8. Supabase Storage (storage.objects) RLS Policies
-- ==============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects') THEN
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Public Select Storage Objects" ON storage.objects;
    DROP POLICY IF EXISTS "Admin Insert Storage Objects" ON storage.objects;
    DROP POLICY IF EXISTS "Admin Update Storage Objects" ON storage.objects;
    DROP POLICY IF EXISTS "Admin Delete Storage Objects" ON storage.objects;

    CREATE POLICY "Public Select Storage Objects"
      ON storage.objects
      FOR SELECT
      USING (true);

    CREATE POLICY "Admin Insert Storage Objects"
      ON storage.objects
      FOR INSERT
      WITH CHECK ((SELECT public.is_admin()));

    CREATE POLICY "Admin Update Storage Objects"
      ON storage.objects
      FOR UPDATE
      USING ((SELECT public.is_admin()))
      WITH CHECK ((SELECT public.is_admin()));

    CREATE POLICY "Admin Delete Storage Objects"
      ON storage.objects
      FOR DELETE
      USING ((SELECT public.is_admin()));
  END IF;
END $$;
