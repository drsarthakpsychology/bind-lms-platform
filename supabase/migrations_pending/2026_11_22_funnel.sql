-- Private request-path counts for the public website (22 Nov 2026).
--
-- What it stores: one row per step a visitor takes on the way to asking to
-- join (page seen, a Request or Register button pressed, the form opened,
-- started, sent or failed). No name, email, phone, IP address, browser
-- details or cookie. "visit" is a random id made fresh in each browser tab
-- session so steps can be joined into one path; it cannot identify a person.
-- Visitors with Do Not Track or Global Privacy Control on send nothing.
-- Rows older than 180 days can be deleted at any time.
--
-- The website works before this runs: the counter silently skips the save,
-- and the admin page says the counts are not switched on yet.
--
-- Additive and idempotent. Run in the Supabase SQL Editor.
-- =============================================================================

create table if not exists public.funnel_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  visit text not null check (visit ~ '^[a-z0-9]{8,32}$'),
  event text not null check (event in ('view', 'cta', 'form_open', 'form_start', 'form_sent', 'form_failed')),
  path text not null check (char_length(path) between 1 and 80),
  detail text check (detail is null or detail ~ '^[a-z0-9_-]{1,40}$'),
  ref_host text check (ref_host is null or char_length(ref_host) <= 80)
);

create index if not exists funnel_events_created_at_idx on public.funnel_events (created_at desc);

alter table public.funnel_events enable row level security;

-- Server only: the website writes and the admin page reads through the
-- service-role key. Nobody signed in or out can read or write rows directly.
drop policy if exists "funnel_events_server_only" on public.funnel_events;
create policy "funnel_events_server_only" on public.funnel_events
  for all
  to authenticated, anon
  using (false)
  with check (false);

-- Counts for the admin page, done in the database so the answer is right no
-- matter how many rows there are (the API returns at most 1,000 rows).
create or replace function public.funnel_summary(p_days integer default 30)
returns table (event text, path text, detail text, events bigint, visits bigint)
language sql
stable
security definer
set search_path = public
as $$
  select e.event, e.path, coalesce(e.detail, '') as detail,
         count(*)::bigint as events,
         count(distinct e.visit)::bigint as visits
  from public.funnel_events e
  where e.created_at >= now() - make_interval(days => greatest(1, least(p_days, 365)))
  group by e.event, e.path, coalesce(e.detail, '');
$$;

create or replace function public.funnel_referrers(p_days integer default 30)
returns table (ref_host text, visits bigint)
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(e.ref_host, '') as ref_host, count(distinct e.visit)::bigint as visits
  from public.funnel_events e
  where e.event = 'view'
    and e.created_at >= now() - make_interval(days => greatest(1, least(p_days, 365)))
  group by coalesce(e.ref_host, '')
  order by 2 desc
  limit 20;
$$;

-- Distinct visits per step (a visit that saw two pages counts once).
create or replace function public.funnel_steps(p_days integer default 30)
returns table (event text, visits bigint)
language sql
stable
security definer
set search_path = public
as $$
  select e.event, count(distinct e.visit)::bigint as visits
  from public.funnel_events e
  where e.created_at >= now() - make_interval(days => greatest(1, least(p_days, 365)))
    and (e.event <> 'cta' or coalesce(e.detail, '') not in ('call', 'whatsapp', 'login'))
  group by e.event;
$$;

revoke all on function public.funnel_steps(integer) from public, anon, authenticated;
grant execute on function public.funnel_steps(integer) to service_role;
revoke all on function public.funnel_summary(integer) from public, anon, authenticated;
revoke all on function public.funnel_referrers(integer) from public, anon, authenticated;
grant execute on function public.funnel_summary(integer) to service_role;
grant execute on function public.funnel_referrers(integer) to service_role;
