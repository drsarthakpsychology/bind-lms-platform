-- Check-ins: idempotency + aggregate security.
--
-- 1. A student double-submitting a weekly check-in (the form's submit button
--    stayed enabled after save) inserted multiple rows per (user_id, week_label),
--    silently inflating n_responses and skewing every average the admin sees.
--    Dedupe existing rows (keep the earliest per user+week) then enforce a
--    unique index so it can't happen again; the insert route now upserts.
-- 2. checkins_aggregate ran as the view owner (superuser) by default, bypassing
--    RLS/grants — inconsistent with the codebase's own wall_posts_visible
--    pattern. Recreate it security_invoker + revoke from anon/authenticated,
--    grant SELECT to authenticated, so the aggregate's access is intentional.
--
-- Additive + idempotent.
delete from public.checkins a
using public.checkins b
where a.user_id = b.user_id and a.week_label = b.week_label and a.id < b.id;

create unique index if not exists checkins_user_week_unique
  on public.checkins (user_id, week_label);

drop view if exists public.checkins_aggregate;
create view public.checkins_aggregate
with (security_invoker = true) as
  select week_label,
         count(*) as n_responses,
         round(avg(workload), 2) as avg_workload,
         round(avg(energy), 2) as avg_energy,
         round(avg(preparedness), 2) as avg_preparedness
  from public.checkins
  group by week_label;

revoke all on public.checkins_aggregate from anon, authenticated;
grant select on public.checkins_aggregate to authenticated;
