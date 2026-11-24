-- ==============================================================================
-- Migration: 2026_add_question_time_analytics.sql
-- Description: Add question_timings column to public.test_attempts for
--              Time-Per-Question and Time-Sink analytics.
-- Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
-- ==============================================================================

ALTER TABLE public.test_attempts
  ADD COLUMN IF NOT EXISTS question_timings jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Optional GIN index for faster analytical json queries if needed
CREATE INDEX IF NOT EXISTS idx_test_attempts_question_timings ON public.test_attempts USING gin (question_timings);

COMMENT ON COLUMN public.test_attempts.question_timings IS 'Stores exact per-question time spent in seconds: Record<string, number> keyed by question id.';
