-- ==============================================================================
-- PLAYROOM PRODUCTION SUPABASE DATABASE SCHEMA
-- Matches Final Application Architecture: Individual & School Licensing
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'parent' CHECK (role IN ('parent', 'educator', 'school_admin', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 2. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'one_level' CHECK (type IN ('one_level', 'all_activities', 'school_license')),
  level_number INTEGER,
  price_pkr NUMERIC(10,2) NOT NULL,
  price_usd NUMERIC(10,2) NOT NULL,
  duration_months INTEGER DEFAULT 1 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_products_type ON public.products(type);
CREATE INDEX IF NOT EXISTS idx_products_level ON public.products(level_number);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);

-- Seed Products: Individual (Page 1) & School Licensure (1/3/6/12 Months for Page 2 & Admin Scope)
INSERT INTO public.products (id, name, description, type, level_number, price_pkr, price_usd, duration_months, is_active)
VALUES
  ('level_1', 'Level 1: Nursery Explorers (Free Starter)', 'Playful foundation with letter shapes, first sounds, and colors. Page 1 only.', 'one_level', 1, 0, 0, 1, true),
  ('level_2', 'Level 2: Phonics & Math Beginners', 'Beginning letter sounds, counting up to 10, pattern recognition. Page 1 only.', 'one_level', 2, 800, 5, 1, true),
  ('level_3', 'Level 3: Early Word Builders & Addition', 'Word blends, simple addition, rhyming words, and classification. Page 1 only.', 'one_level', 3, 800, 5, 1, true),
  ('level_4', 'Level 4: Reading Sentences & Math Explorer', 'Sentence construction, subtraction, 2D/3D shapes, and logic. Page 1 only.', 'one_level', 4, 800, 5, 1, true),
  ('level_5', 'Level 5: Advanced Kindergarten Phonics & Logic', 'Complex phonics, reading comprehension, skip counting, time & money. Page 1 only.', 'one_level', 5, 800, 5, 1, true),
  ('level_6', 'Level 6: Grade 1 Readiness & Mastery', 'Fluent reading, critical thinking puzzles, multi-step math challenges. Page 1 only.', 'one_level', 6, 800, 5, 1, true),
  ('all_activities', 'All Activities (Full Access - 1 Month)', 'Unlock 100% full access to all preschool learning activities, levels 1–6, phonics, math, and games for 1 month. Page 1 only.', 'all_activities', NULL, 5000, 20, 1, true),
  ('school_1month', 'School Educator Hub License (1 Month)', 'Preschool classroom institutional license for up to 30 student devices for 1 month. Page 2 Educator Hub and administration access.', 'school_license', NULL, 15000, 60, 1, true),
  ('school_3months', 'School Educator Hub License (3 Months - Term)', 'Preschool classroom institutional license for up to 30 student devices for 3 months (academic term). Page 2 Educator Hub.', 'school_license', NULL, 40000, 160, 3, true),
  ('school_6months', 'School Educator Hub License (6 Months - Semester)', 'Preschool classroom institutional license for up to 30 student devices for 6 months (semester). Page 2 Educator Hub.', 'school_license', NULL, 75000, 300, 6, true),
  ('school_12months', 'School Educator Hub License (12 Months - Annual)', 'Comprehensive preschool institutional license for up to 50 student devices for 12 months (full annual year). Page 2 Educator Hub.', 'school_license', NULL, 120000, 500, 12, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  type = EXCLUDED.type,
  price_pkr = EXCLUDED.price_pkr,
  price_usd = EXCLUDED.price_usd,
  duration_months = EXCLUDED.duration_months,
  is_active = EXCLUDED.is_active;

-- 3. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES public.products(id),
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('PKR', 'USD')),
  region TEXT NOT NULL DEFAULT 'pakistan' CHECK (region IN ('pakistan', 'international')),
  payment_method TEXT NOT NULL,
  transaction_reference TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'VERIFIED', 'REJECTED', 'FAILED', 'REFUNDED', 'EXPIRED')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON public.orders(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 4. PAYMENTS (Supports SadaPay, Bank Transfer, Payoneer with Manual Audit & PENDING default)
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  product_id TEXT REFERENCES public.products(id),
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('PKR', 'USD')),
  payment_method TEXT NOT NULL,
  provider_transaction_id TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PROCESSING', 'VERIFIED', 'REJECTED', 'FAILED', 'REFUNDED', 'EXPIRED')),
  payment_proof_name TEXT,
  payment_proof_url TEXT,
  verified_by TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  verified_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_email ON public.payments(user_email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(payment_status);

-- 5. USER LICENSES (Individual Parent Licenses - Page 1 ONLY, never unlocks Page 2)
CREATE TABLE IF NOT EXISTS public.user_licenses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT,
  product_id TEXT REFERENCES public.products(id),
  level INTEGER,
  all_activities_unlocked BOOLEAN DEFAULT false NOT NULL,
  start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  expiry_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'REVOKED')),
  payment_id TEXT REFERENCES public.payments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_user_licenses_user_id ON public.user_licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_licenses_user_email ON public.user_licenses(user_email);
CREATE INDEX IF NOT EXISTS idx_user_licenses_status ON public.user_licenses(status);

-- 6. PAYMENT ISSUES
CREATE TABLE IF NOT EXISTS public.payment_issues (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
  payment_id TEXT REFERENCES public.payments(id) ON DELETE SET NULL,
  payment_method TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('PKR', 'USD')),
  transaction_reference TEXT NOT NULL,
  payment_date DATE NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'UNDER_REVIEW', 'RESOLVED_APPROVED', 'RESOLVED_REJECTED')),
  admin_note TEXT,
  resolved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_payment_issues_user_id ON public.payment_issues(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_issues_user_email ON public.payment_issues(user_email);
CREATE INDEX IF NOT EXISTS idx_payment_issues_status ON public.payment_issues(status);

-- 7. SCHOOLS
CREATE TABLE IF NOT EXISTS public.schools (
  id TEXT PRIMARY KEY,
  school_name TEXT NOT NULL,
  school_admin_name TEXT NOT NULL,
  contact_email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_schools_contact_email ON public.schools(contact_email);
CREATE INDEX IF NOT EXISTS idx_schools_status ON public.schools(status);

-- 8. SCHOOL LICENSES (1, 3, 6, 12 Month Term Support, Device Limits, Page 1 / Page 2 Access Scope)
CREATE TABLE IF NOT EXISTS public.school_licenses (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  allowed_devices INTEGER DEFAULT 30 NOT NULL,
  page1_access BOOLEAN DEFAULT true NOT NULL,
  page2_access BOOLEAN DEFAULT true NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('PKR', 'USD')),
  start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  expiry_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'REVOKED')),
  duration_months INTEGER DEFAULT 1 NOT NULL CHECK (duration_months IN (1, 3, 6, 12)),
  payment_id TEXT REFERENCES public.payments(id) ON DELETE SET NULL,
  verified_by TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_school_licenses_school_id ON public.school_licenses(school_id);
CREATE INDEX IF NOT EXISTS idx_school_licenses_status ON public.school_licenses(status);

-- 9. SCHOOL DEVICES (Device tracking per school without data deletion on expiration)
CREATE TABLE IF NOT EXISTS public.school_devices (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_identifier TEXT NOT NULL,
  device_identifier TEXT NOT NULL,
  device_name TEXT,
  registered_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_login TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVOKED')),
  revoked_at TIMESTAMPTZ,
  CONSTRAINT unique_school_device UNIQUE (school_id, device_identifier)
);
CREATE INDEX IF NOT EXISTS idx_school_devices_school_id ON public.school_devices(school_id);
CREATE INDEX IF NOT EXISTS idx_school_devices_status ON public.school_devices(status);

-- 10. FEEDBACK
CREATE TABLE IF NOT EXISTS public.feedback (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'ARCHIVED')),
  admin_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON public.feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);

-- 11. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT,
  type TEXT NOT NULL CHECK (type IN ('PAYMENT_PENDING', 'PAYMENT_APPROVED', 'PAYMENT_REJECTED', 'LICENSE_EXPIRING', 'LICENSE_EXPIRED', 'GENERAL')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid()::text = id OR auth.jwt()->>'email' = email);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid()::text = id OR auth.jwt()->>'email' = email);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid()::text = id OR auth.jwt()->>'email' = email);
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_email);
CREATE POLICY "Users can insert own orders with PENDING status" ON public.orders FOR INSERT WITH CHECK ((auth.uid()::text = user_id OR auth.jwt()->>'email' = user_email) AND status = 'PENDING');
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_email);
CREATE POLICY "Users can insert own unverified payments with PENDING status" ON public.payments FOR INSERT WITH CHECK ((auth.uid()::text = user_id OR auth.jwt()->>'email' = user_email) AND payment_status = 'PENDING');
CREATE POLICY "Users can view own licenses" ON public.user_licenses FOR SELECT USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_email);
CREATE POLICY "Users can view own payment issues" ON public.payment_issues FOR SELECT USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_email);
CREATE POLICY "Users can submit own payment issues" ON public.payment_issues FOR INSERT WITH CHECK ((auth.uid()::text = user_id OR auth.jwt()->>'email' = user_email) AND status = 'OPEN');
CREATE POLICY "School admin can view own school" ON public.schools FOR SELECT USING (auth.jwt()->>'email' = contact_email);
CREATE POLICY "School admin can view own school licenses" ON public.school_licenses FOR SELECT USING (EXISTS (SELECT 1 FROM public.schools s WHERE s.id = school_licenses.school_id AND s.contact_email = auth.jwt()->>'email'));
CREATE POLICY "School admin can view own school devices" ON public.school_devices FOR SELECT USING (EXISTS (SELECT 1 FROM public.schools s WHERE s.id = school_devices.school_id AND s.contact_email = auth.jwt()->>'email'));
CREATE POLICY "Public can insert feedback" ON public.feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own feedback" ON public.feedback FOR SELECT USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_email);
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_email);
CREATE POLICY "Users can update own notifications read status" ON public.notifications FOR UPDATE USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_email);

-- GRANTS
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT, INSERT ON public.feedback TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT SELECT, INSERT ON public.payments TO authenticated;
GRANT SELECT ON public.user_licenses TO authenticated;
GRANT SELECT, INSERT ON public.payment_issues TO authenticated;
GRANT SELECT ON public.schools TO authenticated;
GRANT SELECT ON public.school_licenses TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.school_devices TO authenticated;
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
