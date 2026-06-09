-- Supabase Database Schema Setup for HirePinnacle50
-- Copy and paste this script into the Supabase SQL Editor (found in your Supabase Dashboard).

-- =========================================================================
-- 1. Create public.users Table (Syncs with auth.users)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.users (
  uid UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  "displayName" TEXT,
  role TEXT DEFAULT 'recruiter',
  status TEXT DEFAULT 'active',
  "lastActive" TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 2. Create public.candidates Table
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "fullName" TEXT NOT NULL,
  "fatherName" TEXT,
  phone TEXT,
  "alternativeNumber" TEXT DEFAULT 'N/A',
  email TEXT,
  dob TEXT,
  gender TEXT,
  "maritalStatus" TEXT,
  "aadharNumber" TEXT,
  qualification TEXT,
  address TEXT,
  languages TEXT,
  experience TEXT,
  "joiningTimeline" TEXT,
  "resumeFileName" TEXT,
  "resumeURL" TEXT,
  status TEXT DEFAULT 'New',
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 3. Create public.contact_messages Table
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 4. Create public."auditLogs" Table
-- =========================================================================
CREATE TABLE IF NOT EXISTS public."auditLogs" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "recruiterUID" UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  "recruiterEmail" TEXT,
  "candidateId" UUID,
  "candidateName" TEXT,
  "oldStatus" TEXT,
  "newStatus" TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 5. Create Auth Trigger for Automatic User Synchronization
-- =========================================================================
-- This trigger automatically creates a row in public.users whenever a user registers,
-- and assigns the 'admin' role if the email matches kranthiaws113@gmail.com.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (uid, email, "displayName", role, status)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'displayName', 'New Recruiter'),
    CASE 
      WHEN new.email = 'kranthiaws113@gmail.com' THEN 'admin'
      ELSE 'recruiter'
    END,
    'active'
  )
  ON CONFLICT (uid) DO UPDATE 
  SET 
    email = EXCLUDED.email,
    "displayName" = COALESCE(EXCLUDED."displayName", public.users."displayName");
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- 6. Row Level Security (RLS) Configuration (Optional)
-- =========================================================================
-- By default, you can keep RLS disabled if you want quick setup and testing.
-- To secure your app in production, run the commands below to enable RLS and set up policies.

/*
-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."auditLogs" ENABLE ROW LEVEL SECURITY;

-- users policies:
-- 1. Allow authenticated users to view profiles
CREATE POLICY "Allow authenticated users to select profiles" 
  ON public.users FOR SELECT TO authenticated USING (true);

-- 2. Allow users to update their own profile
CREATE POLICY "Allow users to update own profile" 
  ON public.users FOR UPDATE TO authenticated USING (auth.uid() = uid);

-- candidates policies:
-- 1. Allow anyone to search for duplicates (select) and insert applications
CREATE POLICY "Allow public inserts" 
  ON public.candidates FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public SELECT for checking duplicates" 
  ON public.candidates FOR SELECT TO anon, authenticated USING (true);

-- 2. Allow authenticated users (recruiters & admins) to update and delete candidates
CREATE POLICY "Allow authenticated update/delete" 
  ON public.candidates FOR ALL TO authenticated USING (true);

-- contact_messages policies:
-- 1. Allow anyone to submit a contact message
CREATE POLICY "Allow public contact message submission" 
  ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 2. Only authenticated users can view/retrieve contact messages
CREATE POLICY "Allow authenticated read contact messages" 
  ON public.contact_messages FOR SELECT TO authenticated USING (true);

-- auditLogs policies:
-- 1. Only authenticated users can write and read audit logs
CREATE POLICY "Allow authenticated audit logs" 
  ON public."auditLogs" FOR ALL TO authenticated USING (true);
*/
