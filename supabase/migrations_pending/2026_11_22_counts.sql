-- 2026_11_22_counts.sql
-- Totals added up inside the database, so admin numbers are never cut off at
-- the API's 1000-row limit. Additive only: new functions, nothing dropped.
-- The website works before this runs (it pages through the raw rows instead)
-- and after (one small call per screen).
--
-- Every function is server-only: callable by the service role, never by the
-- public or signed-in keys.

-- Time on VIBHA per student since a moment. A single slice counts at most 30
-- minutes (a tab left open is not study). Days are India days.
create or replace function public.activity_user_totals(p_since timestamptz, p_week timestamptz)
returns table (user_id uuid, seconds_all bigint, seconds_week bigint, active_days integer, last_visit timestamptz)
language sql
stable
set search_path = public
as $$
  select v.user_id,
         coalesce(sum(least(1800, greatest(0, coalesce(v.duration_seconds, 0)))), 0)::bigint,
         coalesce(sum(least(1800, greatest(0, coalesce(v.duration_seconds, 0)))) filter (where v.entered_at >= p_week), 0)::bigint,
         count(distinct (v.entered_at at time zone 'Asia/Kolkata')::date)::integer,
         max(coalesce(v.left_at, v.entered_at + make_interval(secs => greatest(0, coalesce(v.duration_seconds, 0)))))
  from public.page_visits v
  where v.entered_at >= p_since
  group by v.user_id
  order by v.user_id;
$$;

-- Minutes per India weekday (Monday = 0) and hour, for the cohort heatmap.
create or replace function public.activity_heat(p_since timestamptz)
returns table (dow integer, hour integer, seconds bigint)
language sql
stable
set search_path = public
as $$
  select ((extract(isodow from v.entered_at at time zone 'Asia/Kolkata'))::integer - 1),
         (extract(hour from v.entered_at at time zone 'Asia/Kolkata'))::integer,
         coalesce(sum(least(1800, greatest(0, coalesce(v.duration_seconds, 0)))), 0)::bigint
  from public.page_visits v
  where v.entered_at >= p_since
  group by 1, 2
  order by 1, 2;
$$;

-- Seconds per page path (without the query string), for "most used pages".
create or replace function public.activity_paths(p_since timestamptz)
returns table (path text, seconds bigint)
language sql
stable
set search_path = public
as $$
  select split_part(v.path, '?', 1),
         coalesce(sum(least(1800, greatest(0, coalesce(v.duration_seconds, 0)))), 0)::bigint
  from public.page_visits v
  where v.entered_at >= p_since
  group by 1
  order by 1;
$$;

-- Lectures per student: finished, started, position seconds, last save.
create or replace function public.progress_user_totals()
returns table (user_id uuid, lessons_done integer, lessons_started integer, watched_seconds bigint, last_update timestamptz)
language sql
stable
set search_path = public
as $$
  select p.user_id,
         (count(*) filter (where p.is_completed))::integer,
         (count(*) filter (where coalesce(p.watched_seconds, 0) > 0))::integer,
         coalesce(sum(greatest(0, coalesce(p.watched_seconds, 0))), 0)::bigint,
         max(p.updated_at)
  from public.progress p
  group by p.user_id
  order by p.user_id;
$$;

-- Sent emails per recipient (lower case): how many, the last one, any opened.
create or replace function public.email_send_totals()
returns table (recipient text, sent integer, last_sent timestamptz, opened boolean)
language sql
stable
set search_path = public
as $$
  select lower(e.recipient), count(*)::integer, max(e.sent_at), bool_or(e.opened_at is not null)
  from public.email_sends e
  where e.status = 'sent'
  group by 1
  order by 1;
$$;

revoke all on function public.activity_user_totals(timestamptz, timestamptz) from public, anon, authenticated;
revoke all on function public.activity_heat(timestamptz) from public, anon, authenticated;
revoke all on function public.activity_paths(timestamptz) from public, anon, authenticated;
revoke all on function public.progress_user_totals() from public, anon, authenticated;
revoke all on function public.email_send_totals() from public, anon, authenticated;
grant execute on function public.activity_user_totals(timestamptz, timestamptz) to service_role;
grant execute on function public.activity_heat(timestamptz) to service_role;
grant execute on function public.activity_paths(timestamptz) to service_role;
grant execute on function public.progress_user_totals() to service_role;
grant execute on function public.email_send_totals() to service_role;

-- Speeds the range reads above and the fallback paging.
create index if not exists page_visits_entered_at_idx on public.page_visits (entered_at);
