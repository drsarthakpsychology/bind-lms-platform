-- /admin/pulse + /admin overview "last activity" — a correct, bounded aggregate.
--
-- The old pages fetched `.limit(500)` unordered samples of sim_sessions +
-- checkins and folded them in JS. Two defects:
--   1. sim_sessions has NO created_at column (it's started_at/ended_at), so the
--      sessions query errored silently and "last activity" only ever counted
--      check-ins.
--   2. A 500-row cap with no ORDER BY truncated arbitrarily, so an active
--      student with many rows could look silent, or vice-versa.
--
-- This view computes the TRUE per-student max activity timestamp across sim
-- sessions (ended_at, else started_at), check-ins, and journal entries, plus a
-- `started` flag (any lesson progress). One bounded row per student.
-- PII-bearing → service-role only (the pulse + overview pages read via the
-- admin client). RLS-on-views isn't supported here, so the grant is explicit.
--
-- Idempotent (drop + recreate — columns changed when `started` was added).
drop view if exists public.student_last_activity;

create view public.student_last_activity
with (security_invoker = true) as
  with activity as (
    select user_id, coalesce(ended_at, started_at) as ts from public.sim_sessions
    union all
    select user_id, created_at from public.checkins
    union all
    select user_id, created_at from public.journal_entries
  )
  select p.id as user_id,
         p.email,
         max(a.ts) as last_active_at,
         exists (
           select 1 from public.progress pr
           where pr.user_id = p.id and (pr.watched_seconds > 0 or pr.is_completed)
         ) as started
  from public.profiles p
  left join activity a on a.user_id = p.id
  where p.role = 'student'
  group by p.id, p.email;

revoke all on public.student_last_activity from anon, authenticated;
grant select on public.student_last_activity to service_role;
