-- ==============================================================================
-- FEEDBACK TABLE MIGRATION FOR PLAYROOM
-- Creates the public.feedback table matching feedbackService.ts
-- Columns: id, rating, message, status, created_at, user_email
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.feedback (
  id TEXT PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'ARCHIVED')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_email TEXT
);

-- Indexes for efficient querying and admin reviews
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON public.feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_user_email ON public.feedback(user_email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow any user (authenticated or anonymous) to insert feedback
CREATE POLICY "Allow public feedback submissions" 
  ON public.feedback 
  FOR INSERT 
  WITH CHECK (true);

-- Allow users and admins to view feedback
CREATE POLICY "Allow feedback read access" 
  ON public.feedback 
  FOR SELECT 
  USING (true);

-- Grant schema and table access to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.feedback TO anon, authenticated;
GRANT ALL ON public.feedback TO postgres, service_role;
