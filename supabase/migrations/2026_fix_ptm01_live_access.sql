-- ==============================================================================
-- Migration: Ensure PTM 01 Live Access and Flexible Display-Only Schedule
-- Platform: NelovMallickIITD CBT Platform (100% Free Forever)
-- Mentor: Nelov Mallick (IIT Delhi)
-- ==============================================================================

-- 1. Ensure jee-mains-ptm-01 exists and is marked 'live' with flexible open access
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
  'jee-mains-ptm-01',
  'JEE Mains',
  'PTM 01',
  'JEE Mains 2027 Test Series — PTM 01',
  'live',
  false,
  NULL,
  NULL,
  '10:00 AM – 8:00 PM IST',
  false,
  true,
  NOW()
)
ON CONFLICT (test_id) DO UPDATE SET
  status = 'live',
  is_scheduled_window = false,
  starts_at = NULL,
  ends_at = NULL,
  allow_practice_after_end = true,
  updated_at = NOW();

-- 2. Verify and guarantee that PTA 04, 05, and 06 are also active and live
UPDATE public.test_configs
SET 
  status = 'live',
  allow_practice_after_end = true,
  updated_at = NOW()
WHERE test_id IN ('jee-advanced-pta-04', 'jee-advanced-pta-05', 'jee-advanced-pta-06');
