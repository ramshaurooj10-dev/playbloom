-- ==============================================================================
-- PLAYROOM SUPABASE SQL MIGRATION: School Renewal Requests
-- File: supabase_renewal_requests_migration.sql
-- ==============================================================================
-- Run this in your Supabase SQL Editor to create the dedicated renewal requests table.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.school_renewal_requests (
  id TEXT PRIMARY KEY,
  license_key TEXT NOT NULL,
  school_id TEXT,
  school_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  phone_number TEXT,
  city TEXT,
  previous_expiry_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  requested_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  admin_notes TEXT,
  approved_at TIMESTAMPTZ,
  approved_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_school_renewal_requests_key ON public.school_renewal_requests(license_key);
CREATE INDEX IF NOT EXISTS idx_school_renewal_requests_status ON public.school_renewal_requests(status);
CREATE INDEX IF NOT EXISTS idx_school_renewal_requests_requested_at ON public.school_renewal_requests(requested_at DESC);

-- Enable RLS
ALTER TABLE public.school_renewal_requests ENABLE ROW LEVEL SECURITY;

-- Allow Public and Anon to submit renewal requests
DROP POLICY IF EXISTS "Public can insert school renewal requests" ON public.school_renewal_requests;
CREATE POLICY "Public can insert school renewal requests"
  ON public.school_renewal_requests
  FOR INSERT
  TO public, anon, authenticated
  WITH CHECK (true);

-- Allow Public and Admin to select renewal requests
DROP POLICY IF EXISTS "Anyone can select school renewal requests" ON public.school_renewal_requests;
CREATE POLICY "Anyone can select school renewal requests"
  ON public.school_renewal_requests
  FOR SELECT
  TO public, anon, authenticated
  USING (true);

-- Allow Admin / API to update renewal requests
DROP POLICY IF EXISTS "Anyone can update school renewal requests" ON public.school_renewal_requests;
CREATE POLICY "Anyone can update school renewal requests"
  ON public.school_renewal_requests
  FOR UPDATE
  TO public, anon, authenticated
  USING (true);
