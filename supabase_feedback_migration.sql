-- ==============================================================================
-- PLAYROOM SUPABASE SQL MIGRATION: public.feedback
-- File: supabase_feedback_migration.sql
-- ==============================================================================
-- Creates the public.feedback table with the exact columns required by feedbackService.ts:
-- id, rating, message, status, created_at, user_email
--
-- RUN THIS SCRIPT IN SUPABASE SQL EDITOR (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.feedback (
  id TEXT PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'ARCHIVED')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_email TEXT
);

-- 2. Create performance & lookup indexes
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON public.feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_user_email ON public.feedback(user_email);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing conflicting policies if re-running
DROP POLICY IF EXISTS "Allow public feedback submissions" ON public.feedback;
DROP POLICY IF EXISTS "Allow feedback read access" ON public.feedback;
DROP POLICY IF EXISTS "Public can insert feedback" ON public.feedback;
DROP POLICY IF EXISTS "Users can view own feedback" ON public.feedback;

-- 5. Create permissive policies for insertion and retrieval
-- Allows both unauthenticated (anon) and logged-in users to submit feedback
CREATE POLICY "Allow public feedback submissions" 
  ON public.feedback 
  FOR INSERT 
  TO public, anon, authenticated 
  WITH CHECK (true);

-- Allows reading feedback for user feedback admin tool and user view
CREATE POLICY "Allow feedback read access" 
  ON public.feedback 
  FOR SELECT 
  TO public, anon, authenticated 
  USING (true);

-- 6. Grant schema and table permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.feedback TO anon, authenticated;
GRANT ALL ON public.feedback TO postgres, service_role;

-- Verification notification
COMMENT ON TABLE public.feedback IS 'User feedback submissions collected via feedbackService.ts';
