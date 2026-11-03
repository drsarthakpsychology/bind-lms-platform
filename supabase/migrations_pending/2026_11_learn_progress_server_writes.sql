-- =============================================================================
-- OPTIONAL. Learn XP integrity (DISCOVERY_AUDIT H1). Safe to apply any time
-- AFTER the code that writes learn_progress with the service role is deployed
-- (saveLearnState in src/app/(dashboard)/study/actions.ts, which also clamps
-- every save). Requires SUPABASE_SERVICE_ROLE_KEY in the deployment; without
-- it saveLearnState falls back to the student's own client, which this
-- migration blocks.
--
-- Students keep SELECT on their own row; they can no longer INSERT or UPDATE it
-- directly through PostgREST with their own JWT (that bypassed the clamp).
-- The code works with or without this file.
-- =============================================================================
drop policy if exists "learn_progress_own_insert" on public.learn_progress;
drop policy if exists "learn_progress_own_update" on public.learn_progress;
