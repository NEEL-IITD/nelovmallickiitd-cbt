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
