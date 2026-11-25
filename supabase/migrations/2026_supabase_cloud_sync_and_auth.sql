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
