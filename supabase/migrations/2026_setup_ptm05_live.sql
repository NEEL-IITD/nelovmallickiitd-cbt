-- ==============================================================================
-- Migration: Setup PTM 05 Full Paper, Schedule Window, and Go-Live Configuration
-- Platform: NelovMallickIITD CBT Platform (100% Free Forever)
-- Mentor: Nelov Mallick (IIT Delhi)
-- Admin: mallicknelov@gmail.com
-- Safe & Idempotent (Does NOT disturb PTM 01-04, PTA 04-06, or student attempts)
-- ==============================================================================

-- 1. Upsert jee-mains-ptm-05 in public.test_configs with PTM 05 IST schedule window:
-- Date: Sun, Dec 6, 2026 (All-India)
-- Starts: 2026-12-06 09:00:00+05:30 (9:00 AM IST = 03:30:00 UTC)
-- Ends:   2026-12-06 18:00:00+05:30 (6:00 PM IST = 12:30:00 UTC)
-- Status: 'live' (Admin Preview for mallicknelov@gmail.com before start; auto-unlocks at 00:00:00 countdown)
-- allow_practice_after_end: true (students can always attempt PTM 05 after the live window)
-- lock_leaderboard_until_end: false (Top-5 Highest-Marks Leaderboard open to students & visitors)

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
VALUES (
  'jee-mains-ptm-05',
  'JEE Mains',
  'PTM 05',
  'JEE Mains 2027 Test Series — PTM 05',
  'live',
  true,
  '2026-12-06T09:00:00+05:30'::timestamptz,
  '2026-12-06T18:00:00+05:30'::timestamptz,
  '9:00 AM – 6:00 PM IST',
  false,
  true,
  NOW()
)
ON CONFLICT (test_id) DO UPDATE SET
  exam_type = 'JEE Mains',
  code = 'PTM 05',
  title = 'JEE Mains 2027 Test Series — PTM 05',
  status = 'live',
  is_scheduled_window = true,
  starts_at = '2026-12-06T09:00:00+05:30'::timestamptz,
  ends_at = '2026-12-06T18:00:00+05:30'::timestamptz,
  window_label = '9:00 AM – 6:00 PM IST',
  lock_leaderboard_until_end = false,
  allow_practice_after_end = true,
  updated_at = NOW();

-- 2. Verify test_attempts RLS policies allow authenticated student submissions for jee-mains-ptm-05
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;

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

-- 3. Ensure public/student visibility of test_configs schedule metadata remains enabled
ALTER TABLE public.test_configs ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public.test_configs TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "test_configs_public_read" ON public.test_configs;
CREATE POLICY "test_configs_public_read"
  ON public.test_configs FOR SELECT
  TO anon, authenticated
  USING (true);
