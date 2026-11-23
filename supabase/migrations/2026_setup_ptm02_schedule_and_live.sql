-- ==============================================================================
-- Migration: Setup PTM 02 Full Paper, Schedule Window, and Go-Live Configuration
-- Platform: NelovMallickIITD CBT Platform (100% Free Forever)
-- Mentor: Nelov Mallick (IIT Delhi)
-- Admin: mallicknelov@gmail.com
-- ==============================================================================

-- 1. Ensure jee-mains-ptm-02 is configured with live scheduled window:
-- Starts: 2026-11-25 09:00:00+05:30 (Nov 25, 2026 at 9:00 AM IST)
-- Ends: 2026-11-25 21:00:00+05:30 (Nov 25, 2026 at 9:00 PM IST)
-- Window label: '9:00 AM – 9:00 PM IST'
-- Status: 'live' (allows preview by admin, countdown by students until start time)
-- allow_practice_after_end: true (students can practice anytime after live window)
-- lock_leaderboard_until_end: false (accessible leaderboard)

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
  'jee-mains-ptm-02',
  'JEE Mains',
  'PTM 02',
  'JEE Mains 2027 Test Series — PTM 02',
  'live',
  true,
  '2026-11-25T09:00:00+05:30'::timestamptz,
  '2026-11-25T21:00:00+05:30'::timestamptz,
  '9:00 AM – 9:00 PM IST',
  false,
  true,
  NOW()
)
ON CONFLICT (test_id) DO UPDATE SET
  exam_type = 'JEE Mains',
  code = 'PTM 02',
  title = 'JEE Mains 2027 Test Series — PTM 02',
  status = 'live',
  is_scheduled_window = true,
  starts_at = '2026-11-25T09:00:00+05:30'::timestamptz,
  ends_at = '2026-11-25T21:00:00+05:30'::timestamptz,
  window_label = '9:00 AM – 9:00 PM IST',
  lock_leaderboard_until_end = false,
  allow_practice_after_end = true,
  updated_at = NOW();
