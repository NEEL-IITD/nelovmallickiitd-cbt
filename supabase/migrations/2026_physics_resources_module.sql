-- ==============================================================================
-- NelovMallickIITD CBT Platform - Migration: Physics Resources Chapterwise Module
-- File: supabase/migrations/2026_physics_resources_module.sql
-- Target: Supabase (PostgreSQL 15+)
-- Idempotent & Non-Destructive: Safe to run multiple times without data loss
-- Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
-- ==============================================================================

-- 1. Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. Physics Chapter Progress Table
-- Tracks student chapter theory completion, bookmarks, and overall exercise progress
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.physics_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  chapter_code TEXT NOT NULL, -- 'C1' to 'C28'
  chapter_name TEXT NOT NULL,
  unit_category TEXT NOT NULL,
  theory_completed BOOLEAN NOT NULL DEFAULT FALSE,
  exercises_attempted JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_exercises_count INT NOT NULL DEFAULT 1,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT physics_progress_user_chapter_key UNIQUE (user_id, chapter_code)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_physics_progress_user ON public.physics_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_physics_progress_chapter ON public.physics_progress(chapter_code);
CREATE INDEX IF NOT EXISTS idx_physics_progress_activity ON public.physics_progress(last_activity_at DESC);

-- ==============================================================================
-- 3. Physics Exercise Attempts Table
-- Stores student online CBT test submissions for individual chapter exercises
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.physics_exercise_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  chapter_code TEXT NOT NULL, -- e.g. 'C8'
  chapter_name TEXT NOT NULL, -- e.g. 'Rotational Motion'
  exercise_id TEXT NOT NULL, -- e.g. 'c8-ex1', 'c1-ex-comb'
  exercise_title TEXT NOT NULL, -- e.g. 'Exercise 1'
  target_exam TEXT DEFAULT 'Both', -- 'JEE Mains', 'JEE Advanced', 'Both'
  total_questions INT NOT NULL DEFAULT 25,
  answered_count INT NOT NULL DEFAULT 0,
  marked_for_review_count INT NOT NULL DEFAULT 0,
  obtained_marks NUMERIC NOT NULL DEFAULT 0,
  total_marks NUMERIC NOT NULL DEFAULT 100,
  percentage NUMERIC NOT NULL DEFAULT 0,
  accuracy NUMERIC NOT NULL DEFAULT 0,
  time_spent_seconds INT NOT NULL DEFAULT 0,
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_physics_attempts_user ON public.physics_exercise_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_physics_attempts_chapter ON public.physics_exercise_attempts(chapter_code);
CREATE INDEX IF NOT EXISTS idx_physics_attempts_exercise ON public.physics_exercise_attempts(exercise_id);
CREATE INDEX IF NOT EXISTS idx_physics_attempts_submitted ON public.physics_exercise_attempts(submitted_at DESC);

-- ==============================================================================
-- 4. Row Level Security (RLS) Policies
-- Ensures student data privacy while giving Admin Gmail full visibility
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.physics_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physics_exercise_attempts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to allow safe idempotent re-runs
DROP POLICY IF EXISTS "Users can view own physics progress" ON public.physics_progress;
DROP POLICY IF EXISTS "Users can insert own physics progress" ON public.physics_progress;
DROP POLICY IF EXISTS "Users can update own physics progress" ON public.physics_progress;
DROP POLICY IF EXISTS "Admins have full visibility on physics progress" ON public.physics_progress;

DROP POLICY IF EXISTS "Users can view own physics exercise attempts" ON public.physics_exercise_attempts;
DROP POLICY IF EXISTS "Users can insert own physics exercise attempts" ON public.physics_exercise_attempts;
DROP POLICY IF EXISTS "Admins have full visibility on physics exercise attempts" ON public.physics_exercise_attempts;

-- Physics Progress Policies:
CREATE POLICY "Users can view own physics progress"
  ON public.physics_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own physics progress"
  ON public.physics_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own physics progress"
  ON public.physics_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins have full visibility on physics progress"
  ON public.physics_progress
  FOR SELECT
  USING (public.is_admin());

-- Physics Exercise Attempts Policies:
CREATE POLICY "Users can view own physics exercise attempts"
  ON public.physics_exercise_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own physics exercise attempts"
  ON public.physics_exercise_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins have full visibility on physics exercise attempts"
  ON public.physics_exercise_attempts
  FOR SELECT
  USING (public.is_admin());

-- ==============================================================================
-- 5. Helper View for Admin Dashboard
-- Aggregates physics engagement metrics across chapters
-- ==============================================================================
CREATE OR REPLACE VIEW public.admin_physics_summary AS
SELECT
  p.chapter_code,
  p.chapter_name,
  COUNT(DISTINCT p.user_id) AS total_students_studying,
  COUNT(DISTINCT CASE WHEN p.theory_completed THEN p.user_id END) AS total_theory_completions,
  COUNT(a.id) AS total_exercise_attempts,
  ROUND(AVG(a.percentage), 2) AS avg_score_pct
FROM public.physics_progress p
LEFT JOIN public.physics_exercise_attempts a ON p.user_id = a.user_id AND p.chapter_code = a.chapter_code
GROUP BY p.chapter_code, p.chapter_name
ORDER BY p.chapter_code;

-- Grant access on the summary view to authenticated admins
GRANT SELECT ON public.admin_physics_summary TO authenticated;
