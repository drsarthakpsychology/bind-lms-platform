-- supabase-rls.sql — RLS + SECURITY DEFINER enumeration.
-- Run with the service-role key or as a postgres superuser (NOT via the
-- SQL Editor alone for policy testing — that bypasses RLS).
--
-- 1. Public tables WITHOUT row-level security → full CRUD to anyone with the
--    anon key. P0 if any row returns here that should be protected.
SELECT schemaname, relname
FROM pg_tables
WHERE schemaname = 'public' AND NOT relrowsecurity
ORDER BY relname;

-- 2. RLS-enabled tables that have NO policies (deny-all — safe, but confirm
--    it's intentional).
SELECT c.relname AS table_name
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relrowsecurity
  AND NOT EXISTS (SELECT 1 FROM pg_policies p WHERE p.schemaname = 'public' AND p.tablename = c.relname)
ORDER BY c.relname;

-- 3. SECURITY DEFINER functions/views (bypass RLS — flag for review).
SELECT p.proname AS function_name,
       p.prosrc AS source
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.prosecdef
ORDER BY p.proname;

-- 4. Public storage buckets.
SELECT id, name, public
FROM storage.buckets
ORDER BY name;
