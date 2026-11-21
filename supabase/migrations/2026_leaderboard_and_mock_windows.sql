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
