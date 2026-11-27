-- ==============================================================================
-- Migration: Fix Admin Panel Test Submission Counts, RLS & Exact Aggregation RPC
-- Ensures Admin Dashboard displays exact completed submissions across all students,
-- excludes 'in_progress' / abandoned drafts, normalizes test_id / test_type slugs,
-- blocks non-admin / anon reads on test_attempts, and prevents double-submits.
-- Safe & Idempotent (Preserves all student attempts).
-- ==============================================================================

-- 1. Ensure test_attempts has normalized status, test_type, and updated_at columns
ALTER TABLE public.test_attempts
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'completed',
  ADD COLUMN IF NOT EXISTS test_type TEXT NOT NULL DEFAULT 'mock',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_test_attempts_status') THEN
    ALTER TABLE public.test_attempts
      ADD CONSTRAINT chk_test_attempts_status CHECK (status IN ('in_progress', 'completed'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_test_attempts_type') THEN
    ALTER TABLE public.test_attempts
      ADD CONSTRAINT chk_test_attempts_type CHECK (test_type IN ('mock', 'chapter_exercise'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_test_attempts_status_submitted
  ON public.test_attempts(status, submitted_at DESC)
  WHERE status = 'completed';

CREATE INDEX IF NOT EXISTS idx_test_attempts_test_type
  ON public.test_attempts(test_type, test_id, status);

-- 2. Normalize existing test_id, code, test_type, and submitted_at cleanly
UPDATE public.test_attempts
SET
  test_id = 'jee-mains-ptm-' || LPAD((SUBSTRING(LOWER(TRIM(test_id)) FROM '([0-9]+)$'))::INTEGER::TEXT, 2, '0'),
  code = 'PTM ' || LPAD((SUBSTRING(LOWER(TRIM(test_id)) FROM '([0-9]+)$'))::INTEGER::TEXT, 2, '0'),
  exam_type = 'JEE Mains',
  test_type = 'mock'
WHERE LOWER(TRIM(COALESCE(test_id, ''))) ~ '^(jee-mains-)?ptm[-_ ]*0*[0-9]+$';

UPDATE public.test_attempts
SET
  test_id = 'jee-advanced-pta-' || LPAD((SUBSTRING(LOWER(TRIM(test_id)) FROM '([0-9]+)$'))::INTEGER::TEXT, 2, '0'),
  code = 'PTA ' || LPAD((SUBSTRING(LOWER(TRIM(test_id)) FROM '([0-9]+)$'))::INTEGER::TEXT, 2, '0'),
  exam_type = 'JEE Advanced',
  test_type = 'mock'
WHERE LOWER(TRIM(COALESCE(test_id, ''))) ~ '^(jee-advanced-)?pta[-_ ]*0*[0-9]+$';

UPDATE public.test_attempts
SET test_type = 'chapter_exercise'
WHERE (
  LOWER(COALESCE(test_id, '')) LIKE 'chapter%'
  OR LOWER(COALESCE(test_id, '')) LIKE '%exercise%'
  OR LOWER(COALESCE(test_id, '')) ~ '^(physics|chemistry|mathematics|maths)[-_]'
  OR LOWER(COALESCE(code, '')) LIKE 'ex%'
)
AND test_type <> 'chapter_exercise';

UPDATE public.test_attempts
SET submitted_at = COALESCE(submitted_at, updated_at, NOW())
WHERE COALESCE(status, 'completed') = 'completed'
  AND submitted_at IS NULL;

-- 3. Harden Admin helper & test_attempts RLS policies (zero recursion, strict auth)
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

ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.test_attempts FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.test_attempts TO authenticated;
GRANT ALL ON TABLE public.test_attempts TO service_role;

DROP POLICY IF EXISTS "test_attempts_select_policy" ON public.test_attempts;
DROP POLICY IF EXISTS "test_attempts_select_own_or_admin" ON public.test_attempts;
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

-- 4. Guard against accidental simultaneous double-submit (manual click + timeout race within 10s)
CREATE OR REPLACE FUNCTION public.prevent_accidental_double_submit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF COALESCE(NEW.status, 'completed') = 'completed' THEN
    IF EXISTS (
      SELECT 1
      FROM public.test_attempts existing
      WHERE existing.user_id = NEW.user_id
        AND LOWER(TRIM(existing.test_id)) = LOWER(TRIM(NEW.test_id))
        AND COALESCE(existing.status, 'completed') = 'completed'
        AND existing.id <> NEW.id
        AND existing.obtained_marks = NEW.obtained_marks
        AND existing.submitted_at >= NOW() - INTERVAL '10 seconds'
    ) THEN
      RETURN NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_accidental_double_submit ON public.test_attempts;
CREATE TRIGGER trg_prevent_accidental_double_submit
  BEFORE INSERT ON public.test_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_accidental_double_submit();

-- 5. Exact Admin Submission Aggregation RPC (bypasses PostgREST 1000-row limit, Admin only)
CREATE OR REPLACE FUNCTION public.get_admin_submission_stats()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_completed_total INTEGER := 0;
  v_unique_students_total INTEGER := 0;
  v_completed_including_admin INTEGER := 0;
  v_admin_preview_count INTEGER := 0;
  v_in_progress_count INTEGER := 0;
  v_mock_completed_count INTEGER := 0;
  v_chapter_completed_count INTEGER := 0;
  v_by_test JSONB := '[]'::jsonb;
BEGIN
  IF NOT COALESCE(public.is_admin(), FALSE) THEN
    RAISE EXCEPTION 'Forbidden: Admin privileges required' USING ERRCODE = '42501';
  END IF;

  WITH classified AS (
    SELECT
      a.id,
      a.user_id,
      CASE
        WHEN LOWER(TRIM(COALESCE(a.test_id, ''))) ~ '^(jee-mains-)?ptm[-_ ]*0*[0-9]+$' THEN
          'jee-mains-ptm-' || LPAD((SUBSTRING(LOWER(TRIM(a.test_id)) FROM '([0-9]+)$'))::INTEGER::TEXT, 2, '0')
        WHEN LOWER(TRIM(COALESCE(a.test_id, ''))) ~ '^(jee-advanced-)?pta[-_ ]*0*[0-9]+$' THEN
          'jee-advanced-pta-' || LPAD((SUBSTRING(LOWER(TRIM(a.test_id)) FROM '([0-9]+)$'))::INTEGER::TEXT, 2, '0')
        ELSE LOWER(TRIM(COALESCE(a.test_id, 'unknown')))
      END AS canon_test_id,
      CASE
        WHEN LOWER(TRIM(COALESCE(a.test_id, ''))) ~ '^(jee-mains-)?ptm[-_ ]*0*[0-9]+$' THEN
          'PTM ' || LPAD((SUBSTRING(LOWER(TRIM(a.test_id)) FROM '([0-9]+)$'))::INTEGER::TEXT, 2, '0')
        WHEN LOWER(TRIM(COALESCE(a.test_id, ''))) ~ '^(jee-advanced-)?pta[-_ ]*0*[0-9]+$' THEN
          'PTA ' || LPAD((SUBSTRING(LOWER(TRIM(a.test_id)) FROM '([0-9]+)$'))::INTEGER::TEXT, 2, '0')
        ELSE COALESCE(NULLIF(TRIM(a.code), ''), a.test_id, 'Exercise')
      END AS canon_code,
      CASE
        WHEN COALESCE(a.test_type, '') = 'chapter_exercise'
          OR LOWER(COALESCE(a.test_id, '')) LIKE 'chapter%'
          OR LOWER(COALESCE(a.test_id, '')) LIKE '%exercise%'
          OR LOWER(COALESCE(a.test_id, '')) ~ '^(physics|chemistry|mathematics|maths)[-_]'
        THEN 'chapter_exercise'
        ELSE 'mock'
      END AS norm_test_type,
      (COALESCE(a.status, 'completed') = 'completed' AND a.submitted_at IS NOT NULL) AS is_completed,
      (COALESCE(a.status, 'completed') = 'in_progress') AS is_in_progress,
      (
        COALESCE(p.role, '') = 'admin'
        OR LOWER(COALESCE(p.email, u.email, '')) = 'mallicknelov@gmail.com'
      ) AS is_admin_row,
      a.submitted_at
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
  )
  SELECT
    COUNT(*) FILTER (WHERE is_completed AND NOT is_admin_row)::INTEGER,
    COUNT(DISTINCT user_id) FILTER (WHERE is_completed AND NOT is_admin_row)::INTEGER,
    COUNT(*) FILTER (WHERE is_completed)::INTEGER,
    COUNT(*) FILTER (WHERE is_completed AND is_admin_row)::INTEGER,
    COUNT(*) FILTER (WHERE is_in_progress)::INTEGER,
    COUNT(*) FILTER (WHERE is_completed AND NOT is_admin_row AND norm_test_type = 'mock')::INTEGER,
    COUNT(*) FILTER (WHERE is_completed AND NOT is_admin_row AND norm_test_type = 'chapter_exercise')::INTEGER
  INTO
    v_completed_total,
    v_unique_students_total,
    v_completed_including_admin,
    v_admin_preview_count,
    v_in_progress_count,
    v_mock_completed_count,
    v_chapter_completed_count
  FROM classified;

  WITH classified AS (
    SELECT
      a.user_id,
      CASE
        WHEN LOWER(TRIM(COALESCE(a.test_id, ''))) ~ '^(jee-mains-)?ptm[-_ ]*0*[0-9]+$' THEN
          'jee-mains-ptm-' || LPAD((SUBSTRING(LOWER(TRIM(a.test_id)) FROM '([0-9]+)$'))::INTEGER::TEXT, 2, '0')
        WHEN LOWER(TRIM(COALESCE(a.test_id, ''))) ~ '^(jee-advanced-)?pta[-_ ]*0*[0-9]+$' THEN
          'jee-advanced-pta-' || LPAD((SUBSTRING(LOWER(TRIM(a.test_id)) FROM '([0-9]+)$'))::INTEGER::TEXT, 2, '0')
        ELSE LOWER(TRIM(COALESCE(a.test_id, 'unknown')))
      END AS canon_test_id,
      CASE
        WHEN LOWER(TRIM(COALESCE(a.test_id, ''))) ~ '^(jee-mains-)?ptm[-_ ]*0*[0-9]+$' THEN
          'PTM ' || LPAD((SUBSTRING(LOWER(TRIM(a.test_id)) FROM '([0-9]+)$'))::INTEGER::TEXT, 2, '0')
        WHEN LOWER(TRIM(COALESCE(a.test_id, ''))) ~ '^(jee-advanced-)?pta[-_ ]*0*[0-9]+$' THEN
          'PTA ' || LPAD((SUBSTRING(LOWER(TRIM(a.test_id)) FROM '([0-9]+)$'))::INTEGER::TEXT, 2, '0')
        ELSE COALESCE(NULLIF(TRIM(a.code), ''), a.test_id, 'Exercise')
      END AS canon_code,
      CASE
        WHEN COALESCE(a.test_type, '') = 'chapter_exercise'
          OR LOWER(COALESCE(a.test_id, '')) LIKE 'chapter%'
          OR LOWER(COALESCE(a.test_id, '')) LIKE '%exercise%'
          OR LOWER(COALESCE(a.test_id, '')) ~ '^(physics|chemistry|mathematics|maths)[-_]'
        THEN 'chapter_exercise'
        ELSE 'mock'
      END AS norm_test_type,
      (COALESCE(a.status, 'completed') = 'completed' AND a.submitted_at IS NOT NULL) AS is_completed,
      (COALESCE(a.status, 'completed') = 'in_progress') AS is_in_progress,
      (
        COALESCE(p.role, '') = 'admin'
        OR LOWER(COALESCE(p.email, u.email, '')) = 'mallicknelov@gmail.com'
      ) AS is_admin_row,
      a.submitted_at
    FROM public.test_attempts a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
  ),
  grouped AS (
    SELECT
      canon_test_id AS test_id,
      MAX(canon_code) AS code,
      MAX(norm_test_type) AS test_type,
      COUNT(*) FILTER (WHERE is_completed AND NOT is_admin_row)::INTEGER AS completed_count,
      COUNT(DISTINCT user_id) FILTER (WHERE is_completed AND NOT is_admin_row)::INTEGER AS unique_students,
      COUNT(*) FILTER (WHERE is_in_progress)::INTEGER AS in_progress_count,
      COUNT(*) FILTER (WHERE is_completed AND is_admin_row)::INTEGER AS admin_preview_count,
      MAX(submitted_at) FILTER (WHERE is_completed AND NOT is_admin_row) AS last_submitted_at
    FROM classified
    GROUP BY canon_test_id
  )
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'test_id', g.test_id,
        'code', g.code,
        'test_type', g.test_type,
        'completed_count', g.completed_count,
        'unique_students', g.unique_students,
        'in_progress_count', g.in_progress_count,
        'admin_preview_count', g.admin_preview_count,
        'last_submitted_at', g.last_submitted_at
      )
      ORDER BY g.completed_count DESC, g.test_id ASC
    ),
    '[]'::jsonb
  )
  INTO v_by_test
  FROM grouped g;

  RETURN jsonb_build_object(
    'completed_total', COALESCE(v_completed_total, 0),
    'unique_students_total', COALESCE(v_unique_students_total, 0),
    'completed_including_admin', COALESCE(v_completed_including_admin, 0),
    'admin_preview_count', COALESCE(v_admin_preview_count, 0),
    'in_progress_count', COALESCE(v_in_progress_count, 0),
    'mock_completed_count', COALESCE(v_mock_completed_count, 0),
    'chapter_completed_count', COALESCE(v_chapter_completed_count, 0),
    'by_test', v_by_test
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_submission_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_submission_stats() TO authenticated, service_role;
