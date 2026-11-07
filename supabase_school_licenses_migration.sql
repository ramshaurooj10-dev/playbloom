-- ==============================================================================
-- PLAYROOM SUPABASE SQL MIGRATION: School Inquiries & School Licenses
-- File: supabase_school_licenses_migration.sql
-- ==============================================================================
-- Provisions school licenses, inquiries, and user license access control.
-- RUN THIS SCRIPT IN SUPABASE SQL EDITOR (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. SCHOOLS TABLE
CREATE TABLE IF NOT EXISTS public.schools (
  id TEXT PRIMARY KEY,
  school_name TEXT NOT NULL,
  school_admin_name TEXT NOT NULL,
  contact_email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING')),
  account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'pending', 'inactive')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('paid', 'pending', 'unpaid')),
  device_limit INTEGER NOT NULL DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_schools_contact_email ON public.schools(contact_email);
CREATE INDEX IF NOT EXISTS idx_schools_status ON public.schools(status);

-- 2. SCHOOL LICENSES TABLE (30-day validity, auto-expiry, license key lookup)
CREATE TABLE IF NOT EXISTS public.school_licenses (
  id TEXT PRIMARY KEY,
  license_key TEXT UNIQUE,
  school_id TEXT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  allowed_devices INTEGER DEFAULT 15 NOT NULL,
  page1_access BOOLEAN DEFAULT true NOT NULL,
  page2_access BOOLEAN DEFAULT true NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'PKR' CHECK (currency IN ('PKR', 'USD')),
  start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  expiry_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'REVOKED')),
  duration_days INTEGER DEFAULT 30 NOT NULL,
  payment_id TEXT,
  verified_by TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_school_licenses_key ON public.school_licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_school_licenses_school_id ON public.school_licenses(school_id);
CREATE INDEX IF NOT EXISTS idx_school_licenses_email ON public.school_licenses(contact_email);
CREATE INDEX IF NOT EXISTS idx_school_licenses_status ON public.school_licenses(status);

-- 3. SCHOOL INQUIRIES TABLE (Submit Inquiry Flow)
CREATE TABLE IF NOT EXISTS public.school_inquiries (
  id TEXT PRIMARY KEY,
  school_name TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  estimated_devices INTEGER DEFAULT 15,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONTACTED', 'APPROVED', 'REJECTED')),
  admin_notes TEXT,
  generated_license_key TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  reviewed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_school_inquiries_email ON public.school_inquiries(contact_email);
CREATE INDEX IF NOT EXISTS idx_school_inquiries_status ON public.school_inquiries(status);

-- 4. USER LICENSES (Individual: Level 1 free, 3-Activities 7-day, Full App 30-day)
CREATE TABLE IF NOT EXISTS public.user_licenses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  license_type TEXT NOT NULL CHECK (license_type IN ('three_activities', 'all_activities', 'one_level')),
  unlocked_levels INTEGER[],
  unlocked_activity_ids TEXT[],
  all_activities_unlocked BOOLEAN DEFAULT false NOT NULL,
  start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  expiry_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'REVOKED')),
  payment_id TEXT,
  price_paid NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'PKR' CHECK (currency IN ('PKR', 'USD')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_user_licenses_email ON public.user_licenses(user_email);
CREATE INDEX IF NOT EXISTS idx_user_licenses_status ON public.user_licenses(status);

-- 5. Row Level Security & Access Policies
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_licenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can validate school license" ON public.school_licenses;
CREATE POLICY "Public can validate school license" ON public.school_licenses FOR SELECT TO public, anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can submit school inquiries" ON public.school_inquiries;
CREATE POLICY "Public can submit school inquiries" ON public.school_inquiries FOR INSERT TO public, anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view school inquiries" ON public.school_inquiries;
CREATE POLICY "Public can view school inquiries" ON public.school_inquiries FOR SELECT TO public, anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can view user licenses" ON public.user_licenses;
CREATE POLICY "Public can view user licenses" ON public.user_licenses FOR SELECT TO public, anon, authenticated USING (true);

-- 6. Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.school_licenses TO anon, authenticated;
GRANT SELECT, INSERT ON public.school_inquiries TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_licenses TO anon, authenticated;
