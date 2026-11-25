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
DROP POLICY IF EXISTS "bookmarks_select_policy" ON public.bookmarks;
CREATE POLICY "bookmarks_select_policy" ON public.bookmarks
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR public.is_admin());

DROP POLICY IF EXISTS "bookmarks_insert_policy" ON public.bookmarks;
CREATE POLICY "bookmarks_insert_policy" ON public.bookmarks
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "bookmarks_update_policy" ON public.bookmarks;
CREATE POLICY "bookmarks_update_policy" ON public.bookmarks
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "bookmarks_delete_policy" ON public.bookmarks;
CREATE POLICY "bookmarks_delete_policy" ON public.bookmarks
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "lecture_progress_select_policy" ON public.lecture_progress;
CREATE POLICY "lecture_progress_select_policy" ON public.lecture_progress
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR public.is_admin());

DROP POLICY IF EXISTS "lecture_progress_insert_policy" ON public.lecture_progress;
CREATE POLICY "lecture_progress_insert_policy" ON public.lecture_progress
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "lecture_progress_update_policy" ON public.lecture_progress;
CREATE POLICY "lecture_progress_update_policy" ON public.lecture_progress
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "lecture_progress_delete_policy" ON public.lecture_progress;
CREATE POLICY "lecture_progress_delete_policy" ON public.lecture_progress
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view own physics progress" ON public.physics_progress;
CREATE POLICY "Users can view own physics progress" ON public.physics_progress
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own physics progress" ON public.physics_progress;
CREATE POLICY "Users can insert own physics progress" ON public.physics_progress
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own physics progress" ON public.physics_progress;
CREATE POLICY "Users can update own physics progress" ON public.physics_progress
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view own physics exercise attempts" ON public.physics_exercise_attempts;
CREATE POLICY "Users can view own physics exercise attempts" ON public.physics_exercise_attempts
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own physics exercise attempts" ON public.physics_exercise_attempts;
CREATE POLICY "Users can insert own physics exercise attempts" ON public.physics_exercise_attempts
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Error Reports: Enforce user_id ownership, bounds, and DB-level spam rate limiting
ALTER TABLE public.error_reports DROP CONSTRAINT IF EXISTS error_reports_issue_type_check;
ALTER TABLE public.error_reports ADD CONSTRAINT error_reports_issue_type_check
  CHECK (char_length(issue_type) BETWEEN 1 AND 120);

ALTER TABLE public.error_reports DROP CONSTRAINT IF EXISTS error_reports_description_len_check;
ALTER TABLE public.error_reports ADD CONSTRAINT error_reports_description_len_check
  CHECK (char_length(description) BETWEEN 1 AND 2000);

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
