-- ==============================================================================
-- Migration: Fix Admin PTM 01 Leaderboard Visibility, Top 5 Display & Student Test Counts
-- Platform: NelovMallickIITD CBT Platform (100% Free Forever)
-- Mentor: Nelov Mallick (IIT Delhi)
-- ==============================================================================

-- 1. Ensure jee-mains-ptm-01 through ptm-20 exist in public.test_configs
INSERT INTO public.test_configs (
  test_id,
  exam_type,
  code,
  title,
  status,
  is_scheduled_window,
  starts_at,
  ends_at,
  window_label,
  lock_leaderboard_until_end,
  allow_practice_after_end,
  updated_at
)
VALUES
  ('jee-mains-ptm-01', 'JEE Mains', 'PTM 01', 'JEE Mains 2027 Test Series — PTM 01', 'live', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-02', 'JEE Mains', 'PTM 02', 'JEE Mains 2027 Test Series — PTM 02', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-03', 'JEE Mains', 'PTM 03', 'JEE Mains 2027 Test Series — PTM 03', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-04', 'JEE Mains', 'PTM 04', 'JEE Mains 2027 Test Series — PTM 04', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-05', 'JEE Mains', 'PTM 05', 'JEE Mains 2027 Test Series — PTM 05', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-06', 'JEE Mains', 'PTM 06', 'JEE Mains 2027 Test Series — PTM 06', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-07', 'JEE Mains', 'PTM 07', 'JEE Mains 2027 Test Series — PTM 07', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-08', 'JEE Mains', 'PTM 08', 'JEE Mains 2027 Test Series — PTM 08', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-09', 'JEE Mains', 'PTM 09', 'JEE Mains 2027 Test Series — PTM 09', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-10', 'JEE Mains', 'PTM 10', 'JEE Mains 2027 Test Series — PTM 10', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-11', 'JEE Mains', 'PTM 11', 'JEE Mains 2027 Test Series — PTM 11', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-12', 'JEE Mains', 'PTM 12', 'JEE Mains 2027 Test Series — PTM 12', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-13', 'JEE Mains', 'PTM 13', 'JEE Mains 2027 Test Series — PTM 13', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-14', 'JEE Mains', 'PTM 14', 'JEE Mains 2027 Test Series — PTM 14', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-15', 'JEE Mains', 'PTM 15', 'JEE Mains 2027 Test Series — PTM 15', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-16', 'JEE Mains', 'PTM 16', 'JEE Mains 2027 Test Series — PTM 16', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-17', 'JEE Mains', 'PTM 17', 'JEE Mains 2027 Test Series — PTM 17', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-18', 'JEE Mains', 'PTM 18', 'JEE Mains 2027 Test Series — PTM 18', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-19', 'JEE Mains', 'PTM 19', 'JEE Mains 2027 Test Series — PTM 19', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW()),
  ('jee-mains-ptm-20', 'JEE Mains', 'PTM 20', 'JEE Mains 2027 Test Series — PTM 20', 'coming_soon', false, NULL, NULL, '10:00 AM – 8:00 PM IST', false, true, NOW())
ON CONFLICT (test_id) DO UPDATE SET
  status = CASE WHEN test_configs.test_id = 'jee-mains-ptm-01' THEN 'live' ELSE test_configs.status END,
  is_scheduled_window = CASE WHEN test_configs.test_id = 'jee-mains-ptm-01' THEN false ELSE test_configs.is_scheduled_window END,
  allow_practice_after_end = true,
  updated_at = NOW();

-- Ensure PTA 04, 05, 06 are live
UPDATE public.test_configs
SET status = 'live', allow_practice_after_end = true, updated_at = NOW()
WHERE test_id IN ('jee-advanced-pta-04', 'jee-advanced-pta-05', 'jee-advanced-pta-06');

-- 2. Drop the blocking schedule window trigger on public.test_attempts
DROP TRIGGER IF EXISTS trg_check_test_attempt_window ON public.test_attempts;
DROP FUNCTION IF EXISTS public.check_test_attempt_window();

-- 3. Normalize any mismatched test_id slugs sitting in public.test_attempts
UPDATE public.test_attempts
SET test_id = 'jee-mains-ptm-01'
WHERE test_id IN ('ptm-01', 'PTM-01', 'PTM 01', 'ptm01', 'jee-mains-ptm-1')
   OR test_id ILIKE '%ptm%01%';

UPDATE public.test_attempts
SET test_id = 'jee-advanced-pta-04'
WHERE test_id IN ('pta-04', 'PTA-04', 'PTA 04', 'pta04', 'jee-advanced-pta-4');

UPDATE public.test_attempts
SET test_id = 'jee-advanced-pta-05'
WHERE test_id IN ('pta-05', 'PTA-05', 'PTA 05', 'pta05', 'jee-advanced-pta-5');

UPDATE public.test_attempts
SET test_id = 'jee-advanced-pta-06'
WHERE test_id IN ('pta-06', 'PTA-06', 'PTA 06', 'pta06', 'jee-advanced-pta-6');

-- 4. Backfill any auth.users missing from public.profiles and set Admin role
INSERT INTO public.profiles (id, full_name, email, role, created_at, updated_at)
SELECT 
  u.id, 
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', 'JEE Aspirant'),
  u.email,
  CASE WHEN LOWER(u.email) IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in') THEN 'admin' ELSE 'student' END,
  COALESCE(u.created_at, NOW()),
  NOW()
FROM auth.users u
ON CONFLICT (id) DO UPDATE SET
  role = CASE WHEN LOWER(EXCLUDED.email) IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in') THEN 'admin' ELSE profiles.role END,
  email = COALESCE(profiles.email, EXCLUDED.email);

-- Ensure admin role for Nelov Mallick
UPDATE public.profiles
SET role = 'admin', updated_at = NOW()
WHERE LOWER(email) IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in');

-- 5. Recreate public.is_admin() with SECURITY DEFINER and non-recursive checks
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

  -- Check role in profiles
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RETURN TRUE;
  END IF;

  -- Fallback check against verified email in Supabase JWT claim
  v_jwt_email := LOWER(COALESCE(
    auth.jwt()->>'email',
    current_setting('request.jwt.claim.email', true)
  ));

  IF v_jwt_email IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in') THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- 6. Table Grants & Non-recursive RLS Policies
GRANT ALL ON TABLE public.profiles TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.profiles TO anon;

GRANT ALL ON TABLE public.test_attempts TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE public.test_attempts TO authenticated;
GRANT SELECT ON TABLE public.test_attempts TO anon;

GRANT ALL ON TABLE public.test_configs TO postgres, service_role, authenticated, anon;
GRANT ALL ON TABLE public.bookmarks TO postgres, service_role, authenticated, anon;
GRANT ALL ON TABLE public.error_reports TO postgres, service_role, authenticated, anon;
GRANT ALL ON TABLE public.lecture_progress TO postgres, service_role, authenticated, anon;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_configs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin());

-- Test Attempts Policies
DROP POLICY IF EXISTS "test_attempts_select_policy" ON public.test_attempts;
DROP POLICY IF EXISTS "test_attempts_insert_policy" ON public.test_attempts;
DROP POLICY IF EXISTS "test_attempts_update_policy" ON public.test_attempts;

CREATE POLICY "test_attempts_select_policy" ON public.test_attempts
  FOR SELECT TO authenticated, anon
  USING (
    user_id = auth.uid() 
    OR public.is_admin() 
    OR auth.role() = 'service_role'
  );

CREATE POLICY "test_attempts_insert_policy" ON public.test_attempts
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() 
    OR public.is_admin()
  );

CREATE POLICY "test_attempts_update_policy" ON public.test_attempts
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid() 
    OR public.is_admin()
  );

-- Test Configs Policies
DROP POLICY IF EXISTS "test_configs_select_policy" ON public.test_configs;
DROP POLICY IF EXISTS "test_configs_modify_policy" ON public.test_configs;

CREATE POLICY "test_configs_select_policy" ON public.test_configs
  FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "test_configs_modify_policy" ON public.test_configs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 7. Overhaul public.get_test_leaderboard(p_test_id TEXT)
-- Features: Top 5 focus, LEFT JOIN profiles, alias matching, 1st official attempt only, admin override
CREATE OR REPLACE FUNCTION public.get_test_leaderboard(p_test_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_cfg RECORD;
  v_is_admin BOOLEAN;
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

  -- Check if current user has submitted an attempt
  IF v_current_uid IS NOT NULL THEN
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
    WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (p.email IS NULL OR LOWER(p.email) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'));

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

  -- 1st official attempt rankings
  -- LEFT JOIN ensures student attempts are never dropped even if profiles sync is delayed
  -- row_number() ensures each candidate is benchmarked strictly by their 1st official test attempt
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
    LEFT JOIN public.profiles p ON p.id = a.user_id
    WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
      AND (p.role IS NULL OR p.role <> 'admin')
      AND (p.email IS NULL OR LOWER(p.email) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
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

  -- Build Top 5 Entries JSON (Strictly LIMIT 5)
  WITH top5_source AS (
    SELECT
      f.*,
      RANK() OVER (ORDER BY f.obtained_marks DESC, f.accuracy DESC, f.time_taken_seconds ASC, f.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (ORDER BY f.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
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
        (v_current_uid IS NOT NULL AND a.user_id = v_current_uid) AS is_current_user
      FROM public.test_attempts a
      LEFT JOIN public.profiles p ON p.id = a.user_id
      WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
        AND (p.role IS NULL OR p.role <> 'admin')
        AND (p.email IS NULL OR LOWER(p.email) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
      ORDER BY a.user_id, a.submitted_at ASC, a.id ASC
    ) f
  ),
  top5_limited AS (
    SELECT * FROM top5_source
    WHERE computed_rank <= 5
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

  -- Build All Ranked Entries (Up to 100 for audit / CSV export)
  WITH all_source AS (
    SELECT
      f.*,
      RANK() OVER (ORDER BY f.obtained_marks DESC, f.accuracy DESC, f.time_taken_seconds ASC, f.submitted_at ASC) AS computed_rank,
      ROUND(
        (COUNT(*) OVER (ORDER BY f.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
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
        (v_current_uid IS NOT NULL AND a.user_id = v_current_uid) AS is_current_user
      FROM public.test_attempts a
      LEFT JOIN public.profiles p ON p.id = a.user_id
      WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
        AND (p.role IS NULL OR p.role <> 'admin')
        AND (p.email IS NULL OR LOWER(p.email) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
      ORDER BY a.user_id, a.submitted_at ASC, a.id ASC
    ) f
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

  -- Current User Standing (if logged in, computed from full rank list)
  IF v_current_uid IS NOT NULL THEN
    WITH my_rank_source AS (
      SELECT
        f.*,
        RANK() OVER (ORDER BY f.obtained_marks DESC, f.accuracy DESC, f.time_taken_seconds ASC, f.submitted_at ASC) AS computed_rank,
        ROUND(
          (COUNT(*) OVER (ORDER BY f.obtained_marks ASC RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)::NUMERIC / 
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
        WHERE (a.test_id = v_canonical_id OR a.test_id = v_alias_id OR a.test_id = p_test_id)
          AND (p.role IS NULL OR p.role <> 'admin')
          AND (p.email IS NULL OR LOWER(p.email) NOT IN ('mallicknelov@gmail.com', 'nelovmallick@gmail.com', 'nelovmallick@iitd.ac.in'))
        ORDER BY a.user_id, a.submitted_at ASC, a.id ASC
      ) f
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
