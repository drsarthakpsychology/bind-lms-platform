-- /admin/pulse "last activity" — a correct, bounded aggregate.
--
-- The old page fetched `.limit(500)` unordered samples of sim_sessions +
-- checkins and folded them in JS. Two defects:
--   1. sim_sessions has NO created_at column (it's started_at/ended_at), so the
--      sessions query errored silently and "last activity" only ever counted
--      check-ins.
--   2. A 500-row cap with no ORDER BY truncated arbitrarily, so an active
--      student with many rows could look silent, or vice-versa.
--
-- This view computes the TRUE per-student max activity timestamp across sim
-- sessions (ended_at, else started_at), check-ins, and journal entries. One
-- bounded row per student. PII-bearing → admin-only via view RLS.
--
-- Additive + idempotent.
create or replace view public.student_last_activity
with (security_invoker = true) as
  with activity as (
    select user_id, coalesce(ended_at, started_at) as ts from public.sim_sessions
    union all
    select user_id, created_at from public.checkins
    union all
    select user_id, created_at from public.journal_entries
  )
  select p.id as user_id,
         max(a.ts) as last_active_at
  from public.profiles p
  left join activity a on a.user_id = p.id
  where p.role = 'student'
  group by p.id;

-- Admin-only: students must never read who-was-active-when.
revoke all on public.student_last_activity from anon, authenticated;
grant select on public.student_last_activity to authenticated;

alter view public.student_last_activity enable row level security;
drop policy if exists "student_last_activity_admin_only" on public.student_last_activity;
create policy "student_last_activity_admin_only" on public.student_last_activity
  for select using (public.is_admin());
