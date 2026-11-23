-- ==============================================================================
-- Migration: Add Chapter Progress and Mastery Tracking Table
-- Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
--
-- Features:
-- 1. Create public.chapter_progress table for storing student per-chapter
--    mastery checklist (Theory, Formula, PYQs, Mock Practiced) & progress percent.
-- 2. Unique constraint on (user_id, subject, chapter_slug) for idempotent upserts.
-- 3. Row-Level Security (RLS) policies:
--    - Students can select, insert, update, and delete their own chapter progress rows.
--    - Admin (mallicknelov@gmail.com) can read all student progress for analytics.
-- 4. Fast query indexes on (user_id, subject) and (user_id, chapter_slug).
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.chapter_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR(32) NOT NULL,
  chapter_slug VARCHAR(64) NOT NULL,
  checklist JSONB NOT NULL DEFAULT '{"notes":false,"formula":false,"pyqs":false,"tests":false}'::jsonb,
  progress_percent INT NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_chapter_progress_user_subject_slug UNIQUE (user_id, subject, chapter_slug)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_chapter_progress_user_subject ON public.chapter_progress(user_id, subject);
CREATE INDEX IF NOT EXISTS idx_chapter_progress_user_slug ON public.chapter_progress(user_id, chapter_slug);
CREATE INDEX IF NOT EXISTS idx_chapter_progress_subject_slug ON public.chapter_progress(subject, chapter_slug);

-- Enable RLS
ALTER TABLE public.chapter_progress ENABLE ROW LEVEL SECURITY;

-- Policy 1: Students can view their own progress; Admin can view all
DROP POLICY IF EXISTS "chapter_progress_select_policy" ON public.chapter_progress;
CREATE POLICY "chapter_progress_select_policy"
  ON public.chapter_progress
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR (SELECT public.is_admin())
  );

-- Policy 2: Students can insert their own progress
DROP POLICY IF EXISTS "chapter_progress_insert_policy" ON public.chapter_progress;
CREATE POLICY "chapter_progress_insert_policy"
  ON public.chapter_progress
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR (SELECT public.is_admin())
  );

-- Policy 3: Students can update their own progress
DROP POLICY IF EXISTS "chapter_progress_update_policy" ON public.chapter_progress;
CREATE POLICY "chapter_progress_update_policy"
  ON public.chapter_progress
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR (SELECT public.is_admin())
  )
  WITH CHECK (
    auth.uid() = user_id
    OR (SELECT public.is_admin())
  );

-- Policy 4: Students can delete their own progress if needed
DROP POLICY IF EXISTS "chapter_progress_delete_policy" ON public.chapter_progress;
CREATE POLICY "chapter_progress_delete_policy"
  ON public.chapter_progress
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR (SELECT public.is_admin())
  );

-- Grant privileges
GRANT ALL ON TABLE public.chapter_progress TO authenticated;
GRANT ALL ON TABLE public.chapter_progress TO service_role;
GRANT SELECT ON TABLE public.chapter_progress TO anon;
