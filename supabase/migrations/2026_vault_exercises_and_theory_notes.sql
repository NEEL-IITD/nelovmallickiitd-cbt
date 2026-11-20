-- ==============================================================================
-- NelovMallickIITD CBT Platform - Migration: Vault Exercises & Theory Notes System
-- File: supabase/migrations/2026_vault_exercises_and_theory_notes.sql
-- Target: Supabase (PostgreSQL 15+)
-- Idempotent & Non-Destructive: Safe to run multiple times without data loss
-- Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
-- ==============================================================================

-- 1. Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. Vault Chapterwise Exercises Table
-- Stores standardized JEE exercise tests uploaded as JSON
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.vault_exercises (
  id TEXT PRIMARY KEY, -- e.g. 'physics_c8_ex1'
  subject TEXT NOT NULL CHECK (subject IN ('physics', 'chemistry', 'mathematics')),
  chapter_id TEXT NOT NULL, -- e.g. 'C08', 'C8', 'Ch 3', etc.
  chapter_name TEXT,
  exercise_id TEXT NOT NULL, -- e.g. 'ex-1', 'c8-ex1'
  title TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60,
  default_marking JSONB NOT NULL DEFAULT '{"correct": 4, "incorrect": -1, "unattempted": 0}'::jsonb,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_questions INT NOT NULL DEFAULT 0,
  total_marks NUMERIC NOT NULL DEFAULT 0,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_vault_exercises_subject ON public.vault_exercises(subject);
CREATE INDEX IF NOT EXISTS idx_vault_exercises_chapter ON public.vault_exercises(chapter_id);
CREATE INDEX IF NOT EXISTS idx_vault_exercises_lookup ON public.vault_exercises(subject, chapter_id, exercise_id);
CREATE INDEX IF NOT EXISTS idx_vault_exercises_updated ON public.vault_exercises(updated_at DESC);

-- ==============================================================================
-- 3. Vault Theory Notes Table
-- Stores chapterwise theory documents uploaded as PDF
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.vault_theory_notes (
  id TEXT PRIMARY KEY, -- e.g. 'physics_c8_theory'
  subject TEXT NOT NULL CHECK (subject IN ('physics', 'chemistry', 'mathematics')),
  chapter_id TEXT NOT NULL, -- e.g. 'C08', 'Ch 3'
  chapter_name TEXT,
  title TEXT NOT NULL,
  pdf_url TEXT NOT NULL, -- Public Supabase storage URL or Base64 Data URI
  file_name TEXT,
  file_size_bytes BIGINT DEFAULT 0,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_vault_theory_subject ON public.vault_theory_notes(subject);
CREATE INDEX IF NOT EXISTS idx_vault_theory_chapter ON public.vault_theory_notes(chapter_id);
CREATE INDEX IF NOT EXISTS idx_vault_theory_lookup ON public.vault_theory_notes(subject, chapter_id);

-- ==============================================================================
-- 4. Row Level Security (RLS)
-- ==============================================================================
ALTER TABLE public.vault_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_theory_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to allow safe idempotent re-runs
DROP POLICY IF EXISTS "Public read access for vault exercises" ON public.vault_exercises;
DROP POLICY IF EXISTS "Admins can insert vault exercises" ON public.vault_exercises;
DROP POLICY IF EXISTS "Admins can update vault exercises" ON public.vault_exercises;
DROP POLICY IF EXISTS "Admins can delete vault exercises" ON public.vault_exercises;

DROP POLICY IF EXISTS "Public read access for vault theory notes" ON public.vault_theory_notes;
DROP POLICY IF EXISTS "Admins can insert vault theory notes" ON public.vault_theory_notes;
DROP POLICY IF EXISTS "Admins can update vault theory notes" ON public.vault_theory_notes;
DROP POLICY IF EXISTS "Admins can delete vault theory notes" ON public.vault_theory_notes;

-- Public Read Policies (All students and guests can take tests and view theory):
CREATE POLICY "Public read access for vault exercises"
  ON public.vault_exercises
  FOR SELECT
  USING (true);

CREATE POLICY "Public read access for vault theory notes"
  ON public.vault_theory_notes
  FOR SELECT
  USING (true);

-- Admin Write Policies (Only Admin Gmail or admin role can upload/modify):
CREATE POLICY "Admins can insert vault exercises"
  ON public.vault_exercises
  FOR INSERT
  WITH CHECK (public.is_admin() OR auth.jwt() ->> 'email' ILIKE '%admin%');

CREATE POLICY "Admins can update vault exercises"
  ON public.vault_exercises
  FOR UPDATE
  USING (public.is_admin() OR auth.jwt() ->> 'email' ILIKE '%admin%')
  WITH CHECK (public.is_admin() OR auth.jwt() ->> 'email' ILIKE '%admin%');

CREATE POLICY "Admins can delete vault exercises"
  ON public.vault_exercises
  FOR DELETE
  USING (public.is_admin() OR auth.jwt() ->> 'email' ILIKE '%admin%');

CREATE POLICY "Admins can insert vault theory notes"
  ON public.vault_theory_notes
  FOR INSERT
  WITH CHECK (public.is_admin() OR auth.jwt() ->> 'email' ILIKE '%admin%');

CREATE POLICY "Admins can update vault theory notes"
  ON public.vault_theory_notes
  FOR UPDATE
  USING (public.is_admin() OR auth.jwt() ->> 'email' ILIKE '%admin%')
  WITH CHECK (public.is_admin() OR auth.jwt() ->> 'email' ILIKE '%admin%');

CREATE POLICY "Admins can delete vault theory notes"
  ON public.vault_theory_notes
  FOR DELETE
  USING (public.is_admin() OR auth.jwt() ->> 'email' ILIKE '%admin%');
