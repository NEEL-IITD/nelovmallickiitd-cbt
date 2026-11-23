-- ==============================================================================
-- Migration: Setup PTM 03 Full Paper, Schedule Window, and Go-Live Configuration
-- Platform: NelovMallickIITD CBT Platform (100% Free Forever)
-- Mentor: Nelov Mallick (IIT Delhi)
-- Admin: mallicknelov@gmail.com
-- ==============================================================================

-- 1. Ensure jee-mains-ptm-03 is configured with live scheduled window:
-- Starts: 2026-11-29 09:00:00+05:30 (Sun, Nov 29, 2026 at 9:00 AM IST)
-- Ends: 2026-11-29 18:00:00+05:30 (Sun, Nov 29, 2026 at 6:00 PM IST)
-- Window label: 'All-India Live Mock'
-- Status: 'live' (allows preview by admin, countdown by students until start time)
-- allow_practice_after_end: true (students can practice anytime after live window)
-- lock_leaderboard_until_end: false (top 5 highest marks leaderboard accessible)

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
  'jee-mains-ptm-03',
  'JEE Mains',
  'PTM 03',
  'JEE Mains 2027 Test Series — PTM 03',
  'live',
  true,
  '2026-11-29T09:00:00+05:30'::timestamptz,
  '2026-11-29T18:00:00+05:30'::timestamptz,
  'All-India Live Mock',
  false,
  true,
  NOW()
)
ON CONFLICT (test_id) DO UPDATE SET
  exam_type = 'JEE Mains',
  code = 'PTM 03',
  title = 'JEE Mains 2027 Test Series — PTM 03',
  status = 'live',
  is_scheduled_window = true,
  starts_at = '2026-11-29T09:00:00+05:30'::timestamptz,
  ends_at = '2026-11-29T18:00:00+05:30'::timestamptz,
  window_label = 'All-India Live Mock',
  lock_leaderboard_until_end = false,
  allow_practice_after_end = true,
  updated_at = NOW();
