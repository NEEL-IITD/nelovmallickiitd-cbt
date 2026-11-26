-- ==============================================================================
-- Migration: Fix Student & Public Visitor Leaderboard Visibility Across PTM 01-20 & PTA 01-10
-- Root causes fixed:
--   1. public.test_attempts missed `status` column -> all 3 RPCs crashed with HTTP 400
--      ("column a.status does not exist"), causing silent RLS fallback empty for students/anon.
--   2. Key aliases ('marks'/'score'/'obtained_marks', 'max_marks'/'total_marks',
--      'average_marks'/'avg_marks', 'student_name'/'display_name') unified across callers.
--   3. test_configs.lock_leaderboard_until_end unlocked + PTM 01-03 & PTA 04-06 marked live.
--   4. SECURITY DEFINER STABLE search_path='' RPCs with explicit GRANT EXECUTE to anon, authenticated.
-- ==============================================================================

-- 1. Ensure test_attempts has status column so completed-attempt filters never fail with 42703
ALTER TABLE public.test_attempts
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'completed';

-- 2. Unlock all leaderboards in test_configs and ensure PTM 01-03 + PTA 04-06 are live
ALTER TABLE public.test_configs
  ALTER COLUMN lock_leaderboard_until_end SET DEFAULT false;

UPDATE public.test_configs
SET lock_leaderboard_until_end = false,
    updated_at = NOW()
WHERE lock_leaderboard_until_end = true;

UPDATE public.test_configs
SET status = 'live',
    allow_practice_after_end = true,
    lock_leaderboard_until_end = false,
    updated_at = NOW()
WHERE test_id IN (
  'jee-mains-ptm-01',
  'jee-mains-ptm-02',
  'jee-mains-ptm-03',
  'jee-advanced-pta-04',
  'jee-advanced-pta-05',
  'jee-advanced-pta-06'
);

-- 3. Recreate public.get_test_leaderboard(p_test_id text)
CREATE OR REPLACE FUNCTION public.get_test_leaderboard(p_test_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_is_admin BOOLEAN := FALSE;
  v_total_participants INTEGER := 0;
  v_avg_marks NUMERIC := 0;
  v_high_marks NUMERIC := 0;
  v_top_5 JSONB := '[]'::jsonb;
  v_all_entries JSONB := '[]'::jsonb;
  v_topper JSONB := NULL;
  v_my_standing JSONB := NULL;
  v_current_uid UUID;
  v_canonical_id TEXT;
  v_alias_id TEXT;
  v_compact_id TEXT;
BEGIN
  v_current_uid := auth.uid();
  v_is_admin := public.is_admin();

  v_canonical_id := LOWER(TRIM(COALESCE(p_test_id, '')));
  IF v_canonical_id ~ '^(jee-mains-)?ptm[-_ ]?0*([0-9]+)$' THEN
    v_canonical_id := 'jee-mains-ptm-' || LPAD(SUBSTRING(v_canonical_id FROM '[0-9]+$'), 2, '0');
  ELSIF v_canonical_id ~ '^(jee-advanced-)?pta[-_ ]?0*([0-9]+)$' THEN
    v_canonical_id := 'jee-advanced-pta-' || LPAD(SUBSTRING(v_canonical_id FROM '[0-9]+$'), 2, '0');
  END IF;
  v_alias_id := REPLACE(REPLACE(v_canonical_id, 'jee-mains-', ''), 'jee-advanced-', '');
  v_compact_id := REGEXP_REPLACE(v_canonical_id, '[^a-z0-9]', '', 'g');

  WITH matched_attempts AS (
    SELECT
      a.id,
      a.user_id,
      COALESCE(a.obtained_marks, 0) AS score_val,
      COALESCE(a.total_marks, 300) AS max_marks_val,
      COALESCE(a.percentage, 0) AS pct_val,
      COALESCE(a.accuracy, 0) AS acc_val,
      COALESCE(a.time_taken_seconds, 0) AS time_val,
      a.submitted_at,
      COALESCE(a.attempted_in_live_window, FALSE) AS live_win,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS student_name_val
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE COALESCE(a.status, 'completed') = 'completed'
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) <> 'mallicknelov@gmail.com')
      AND (
        LOWER(TRIM(a.test_id)) = v_canonical_id
        OR LOWER(TRIM(a.test_id)) = v_alias_id
        OR LOWER(TRIM(a.test_id)) = LOWER(TRIM(COALESCE(p_test_id, '')))
        OR REGEXP_REPLACE(LOWER(a.test_id), '[^a-z0-9]', '', 'g') = v_compact_id
        OR REGEXP_REPLACE(LOWER(COALESCE(a.code, '')), '[^a-z0-9]', '', 'g') = REGEXP_REPLACE(v_alias_id, '[^a-z0-9]', '', 'g')
      )
  ),
  best_attempts AS (
    SELECT
      m.*,
      ROW_NUMBER() OVER (
        PARTITION BY m.user_id
        ORDER BY m.score_val DESC, m.acc_val DESC, m.time_val ASC, m.submitted_at ASC
      ) AS rn
    FROM matched_attempts m
  ),
  deduped AS (
    SELECT
      b.user_id,
      b.score_val,
      b.max_marks_val,
      b.pct_val,
      b.acc_val,
      b.time_val,
      b.submitted_at,
      b.live_win,
      b.student_name_val,
      (v_current_uid IS NOT NULL AND NOT v_is_admin AND b.user_id = v_current_uid) AS is_me
    FROM best_attempts b
    WHERE b.rn = 1
  ),
  ranked AS (
    SELECT
      d.*,
      COUNT(*) OVER () AS total_students,
      RANK() OVER (ORDER BY d.score_val DESC, d.acc_val DESC, d.time_val ASC, d.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (ORDER BY d.score_val ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC /
         NULLIF(COUNT(*) OVER (), 0)::NUMERIC) * 100,
        2
      ) AS computed_percentile
    FROM deduped d
  )
  SELECT
    COALESCE(MAX(total_students), 0),
    ROUND(COALESCE(AVG(score_val), 0), 1),
    COALESCE(MAX(score_val), 0),
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'rank', t.computed_rank,
            'student_name', t.student_name_val,
            'display_name', t.student_name_val,
            'score', t.score_val,
            'marks', t.score_val,
            'obtained_marks', t.score_val,
            'max_marks', t.max_marks_val,
            'total_marks', t.max_marks_val,
            'percentage', ROUND(t.pct_val, 2),
            'accuracy', ROUND(t.acc_val, 1),
            'time_taken_seconds', t.time_val,
            'percentile', t.computed_percentile,
            'submitted_at', t.submitted_at,
            'attempted_in_live_window', t.live_win,
            'is_current_user', t.is_me
          )
          ORDER BY t.computed_rank ASC, t.time_val ASC
        )
        FROM (SELECT * FROM ranked ORDER BY computed_rank ASC, time_val ASC LIMIT 5) t
      ),
      '[]'::jsonb
    ),
    CASE WHEN v_is_admin THEN
      COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'rank', a.computed_rank,
              'student_name', a.student_name_val,
              'display_name', a.student_name_val,
              'score', a.score_val,
              'marks', a.score_val,
              'obtained_marks', a.score_val,
              'max_marks', a.max_marks_val,
              'total_marks', a.max_marks_val,
              'percentage', ROUND(a.pct_val, 2),
              'accuracy', ROUND(a.acc_val, 1),
              'time_taken_seconds', a.time_val,
              'percentile', a.computed_percentile,
              'submitted_at', a.submitted_at,
              'attempted_in_live_window', a.live_win,
              'is_current_user', a.is_me
            )
            ORDER BY a.computed_rank ASC, a.time_val ASC
          )
          FROM (SELECT * FROM ranked ORDER BY computed_rank ASC, time_val ASC LIMIT 100) a
        ),
        '[]'::jsonb
      )
    ELSE '[]'::jsonb END,
    CASE WHEN v_current_uid IS NOT NULL AND NOT v_is_admin THEN
      (
        SELECT jsonb_build_object(
          'rank', m.computed_rank,
          'student_name', m.student_name_val,
          'display_name', m.student_name_val,
          'score', m.score_val,
          'marks', m.score_val,
          'obtained_marks', m.score_val,
          'max_marks', m.max_marks_val,
          'total_marks', m.max_marks_val,
          'percentage', ROUND(m.pct_val, 2),
          'accuracy', ROUND(m.acc_val, 1),
          'time_taken_seconds', m.time_val,
          'percentile', m.computed_percentile,
          'submitted_at', m.submitted_at,
          'attempted_in_live_window', m.live_win,
          'is_current_user', TRUE
        )
        FROM ranked m
        WHERE m.user_id = v_current_uid
        LIMIT 1
      )
    ELSE NULL END
  INTO
    v_total_participants,
    v_avg_marks,
    v_high_marks,
    v_top_5,
    v_all_entries,
    v_my_standing
  FROM ranked;

  IF jsonb_array_length(v_top_5) > 0 THEN
    v_topper := v_top_5->0;
  END IF;

  RETURN jsonb_build_object(
    'locked', FALSE,
    'unlocks_at', NULL,
    'total_participants', v_total_participants,
    'highest_marks', v_high_marks,
    'average_marks', v_avg_marks,
    'avg_marks', v_avg_marks,
    'top_5', v_top_5,
    'entries', CASE WHEN v_is_admin THEN v_all_entries ELSE v_top_5 END,
    'all_entries', v_all_entries,
    'topper', v_topper,
    'my_standing', v_my_standing,
    'my_attempt_submitted', (v_my_standing IS NOT NULL)
  );
END;
$$;

-- 4. Recreate public.get_test_toppers_summary()
CREATE OR REPLACE FUNCTION public.get_test_toppers_summary()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $toppers_summary$
DECLARE
  v_result JSONB := '[]'::jsonb;
BEGIN
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
      FALSE AS is_locked
    FROM public.test_configs c
  ),
  normalized_attempts AS (
    SELECT
      CASE
        WHEN LOWER(TRIM(a.test_id)) ~ '^(jee-mains-)?ptm[-_ ]?0*([0-9]+)$' THEN
          'jee-mains-ptm-' || LPAD(SUBSTRING(LOWER(TRIM(a.test_id)) FROM '[0-9]+$'), 2, '0')
        WHEN LOWER(TRIM(a.test_id)) ~ '^(jee-advanced-)?pta[-_ ]?0*([0-9]+)$' THEN
          'jee-advanced-pta-' || LPAD(SUBSTRING(LOWER(TRIM(a.test_id)) FROM '[0-9]+$'), 2, '0')
        ELSE LOWER(TRIM(a.test_id))
      END AS norm_test_id,
      a.user_id,
      COALESCE(a.obtained_marks, 0) AS score_val,
      COALESCE(a.total_marks, 300) AS max_marks_val,
      COALESCE(a.accuracy, 0) AS acc_val,
      COALESCE(a.time_taken_seconds, 0) AS time_val,
      a.submitted_at,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE COALESCE(a.status, 'completed') = 'completed'
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) <> 'mallicknelov@gmail.com')
  ),
  best_attempts AS (
    SELECT DISTINCT ON (na.norm_test_id, na.user_id)
      na.norm_test_id,
      na.user_id,
      na.score_val,
      na.max_marks_val,
      na.acc_val,
      na.time_val,
      na.submitted_at,
      na.display_name
    FROM normalized_attempts na
    ORDER BY na.norm_test_id, na.user_id, na.score_val DESC, na.acc_val DESC, na.time_val ASC, na.submitted_at ASC
  ),
  ranked AS (
    SELECT
      ba.*,
      COUNT(*) OVER (PARTITION BY ba.norm_test_id) AS total_participants,
      RANK() OVER (PARTITION BY ba.norm_test_id ORDER BY ba.score_val DESC, ba.acc_val DESC, ba.time_val ASC, ba.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (PARTITION BY ba.norm_test_id ORDER BY ba.score_val ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC /
         NULLIF(COUNT(*) OVER (PARTITION BY ba.norm_test_id), 0)::NUMERIC) * 100,
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
        'test_id', ts.test_id,
        'code', ts.code,
        'title', ts.title,
        'exam_type', ts.exam_type,
        'is_scheduled_window', ts.is_scheduled_window,
        'starts_at', ts.starts_at,
        'ends_at', ts.ends_at,
        'window_label', ts.window_label,
        'is_locked', FALSE,
        'total_participants', COALESCE(top.total_participants, 0),
        'topper_name', top.display_name,
        'topper_marks', top.score_val,
        'max_marks', top.max_marks_val,
        'topper_percentile', top.computed_percentile
      )
      ORDER BY ts.test_id ASC
    ),
    '[]'::jsonb
  )
  INTO v_result
  FROM test_summary ts
  LEFT JOIN toppers top ON top.norm_test_id = ts.test_id;

  RETURN v_result;
END;
$toppers_summary$;

-- 5. Recreate public.get_overall_leaderboard()
CREATE OR REPLACE FUNCTION public.get_overall_leaderboard()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
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

  WITH normalized_attempts AS (
    SELECT
      CASE
        WHEN LOWER(TRIM(a.test_id)) ~ '^(jee-mains-)?ptm[-_ ]?0*([0-9]+)$' THEN
          'jee-mains-ptm-' || LPAD(SUBSTRING(LOWER(TRIM(a.test_id)) FROM '[0-9]+$'), 2, '0')
        WHEN LOWER(TRIM(a.test_id)) ~ '^(jee-advanced-)?pta[-_ ]?0*([0-9]+)$' THEN
          'jee-advanced-pta-' || LPAD(SUBSTRING(LOWER(TRIM(a.test_id)) FROM '[0-9]+$'), 2, '0')
        ELSE LOWER(TRIM(a.test_id))
      END AS norm_test_id,
      a.user_id,
      COALESCE(a.obtained_marks, 0) AS score_val,
      COALESCE(a.total_marks, 300) AS max_marks_val,
      COALESCE(a.percentage, 0) AS pct_val,
      COALESCE(a.accuracy, 0) AS acc_val,
      COALESCE(a.time_taken_seconds, 0) AS time_val,
      a.submitted_at,
      COALESCE(NULLIF(TRIM(p.full_name), ''), 'JEE Aspirant') AS display_name,
      (v_current_uid IS NOT NULL AND NOT v_is_admin AND a.user_id = v_current_uid) AS is_current_user
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE COALESCE(a.status, 'completed') = 'completed'
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (COALESCE(p.email, u.email) IS NULL OR LOWER(COALESCE(p.email, u.email)) <> 'mallicknelov@gmail.com')
  ),
  best_attempts AS (
    SELECT DISTINCT ON (na.norm_test_id, na.user_id)
      na.norm_test_id,
      na.user_id,
      na.score_val,
      na.max_marks_val,
      na.pct_val,
      na.acc_val,
      na.display_name,
      na.is_current_user
    FROM normalized_attempts na
    ORDER BY na.norm_test_id, na.user_id, na.score_val DESC, na.acc_val DESC, na.time_val ASC, na.submitted_at ASC
  ),
  per_test_percentiles AS (
    SELECT
      ba.*,
      ROUND(
        (COUNT(*) OVER (PARTITION BY ba.norm_test_id ORDER BY ba.score_val ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC /
         NULLIF(COUNT(*) OVER (PARTITION BY ba.norm_test_id), 0)::NUMERIC) * 100,
        2
      ) AS test_percentile
    FROM best_attempts ba
  ),
  student_aggregates AS (
    SELECT
      user_id,
      MAX(display_name) AS display_name,
      BOOL_OR(is_current_user) AS is_current_user,
      COUNT(DISTINCT norm_test_id) AS tests_attempted,
      ROUND(AVG(test_percentile), 2) AS avg_percentile,
      ROUND(AVG(pct_val), 2) AS avg_marks_percent,
      SUM(score_val) AS total_marks_scored,
      SUM(max_marks_val) AS total_max_marks
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
      )
      ORDER BY r.computed_rank ASC
    ),
    '[]'::jsonb
  )
  INTO v_result
  FROM overall_ranked r;

  RETURN v_result;
END;
$overall_leaderboard$;

-- 6. Grant EXECUTE explicitly to anon & authenticated visitors + service_role
GRANT EXECUTE ON FUNCTION public.get_test_leaderboard(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_test_toppers_summary() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_overall_leaderboard() TO anon, authenticated, service_role;
