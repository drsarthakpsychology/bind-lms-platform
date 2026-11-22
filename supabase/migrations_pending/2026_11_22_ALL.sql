-- =============================================================================
-- 2026_11_22_ALL.sql : everything from the 22 Nov 2026 round, in one paste.
--
-- How to use: open Supabase, SQL Editor, New query, paste this whole file,
-- press Run. It only ADDS things (new columns, indexes, functions, tables,
-- rules). It deletes no data. It is safe to run again if it stops half way.
--
-- Not included: 2026_11_21_attendance_confirm.sql. Its columns and rules are
-- already on the live database (checked read-only, 22 Nov 2026).
--
-- Sections, in order:
--   1. Faster question bank: three new indexes (look-ups only, nothing changed).
--   2. Correct totals past 1,000 rows: five read-only adding-up functions for the server, plus one index.
--   3. Certificates can never be given twice: one live certificate per title per person, one per person per batch.
--   4. Paused, ended and lectures-only students: the database itself refuses their wall, doubt and hand-in writes; scores, passport events and streaks are written by the server only.
--   5. Remove people: dates for removed and deleted accounts, a small index, and a guard so a student cannot undo their own removal.
--   6. Website requests: a private, anonymous count of where visitors stop on the way to asking to join (no names, no emails).
--   7. Smart reminders: each person's reminder switches, a sent list so nothing goes twice, and push delivery receipts.
-- =============================================================================


-- #############################################################################
-- 1. Faster question bank: three new indexes (look-ups only, nothing changed).
-- (from 2026_11_22_speed.sql)
-- #############################################################################

-- Speed for the question bank (r2speed, 22 Nov 2026).
-- Additive only: new indexes, nothing dropped or changed. Safe to run more than once.
-- The code works the same before and after this runs; it only makes reads faster.
-- Row rules (RLS) on these tables are unchanged (already on).

-- "Pick up where you left off" before prep_answers existed reads a student's
-- most recently seen question: prep_seen by user, newest first.
create index if not exists prep_seen_user_last_idx on public.prep_seen (user_id, last_at desc);

-- Spaced-review cards for the bank are read by user and an item prefix ('prep:%').
-- text_pattern_ops lets the prefix match use the index whatever the database collation.
create index if not exists review_cards_user_item_pattern_idx on public.review_cards (user_id, item text_pattern_ops);

-- Prep skills are read by user and a skill prefix ('prep-%').
create index if not exists skill_state_user_skill_pattern_idx on public.skill_state (user_id, skill text_pattern_ops);

-- #############################################################################
-- 2. Correct totals past 1,000 rows: five read-only adding-up functions for the server, plus one index.
-- (from 2026_11_22_counts.sql)
-- #############################################################################

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

-- #############################################################################
-- 3. Certificates can never be given twice: one live certificate per title per person, one per person per batch.
-- (from 2026_11_22_certificates.sql)
-- #############################################################################

-- 2026_11_22_certificates.sql
-- A certificate can never be issued twice. Additive only: two unique indexes.
-- The website already checks both rules before saving; these make the
-- database refuse a double even if two clicks arrive at the same moment.
--
-- Checked before writing (read only, 22 Nov 2026): 129 records, no person
-- holds two live certificates with the same title, no batch holds a person
-- twice. If either index fails to build, a duplicate exists: revoke one of
-- the pair in Certificates, Issued, then run this again.

-- One person, one live certificate per title and kind. A revoked one does not
-- count, so a correction (old revoked first, then the new one) still works.
create unique index if not exists one_live_certificate
  on public.credentials (user_id, kind, lower(btrim(title)))
  where type = 'certificate' and status = 'issued' and revoked_at is null and title is not null and user_id is not null;

-- The batch id is the form's once-only key: one record per person per batch.
create unique index if not exists one_certificate_per_batch
  on public.credentials (batch_id, user_id)
  where batch_id is not null and user_id is not null;

-- #############################################################################
-- 4. Paused, ended and lectures-only students: the database itself refuses their wall, doubt and hand-in writes; scores, passport events and streaks are written by the server only.
-- (from 2026_11_22_status.sql)
-- #############################################################################

-- 2026_11_22_status.sql
-- The database itself now refuses writes from a paused student, a student
-- whose access has ended, and (for the class wall) a lectures-only student.
-- It also stops students writing their own practice scores, passport events
-- and streaks straight into the database: only the website's server does.
--
-- Additive only: two new functions and new RESTRICTIVE rules. Existing rules
-- are not changed or dropped. A restrictive rule only ever takes rights away,
-- and the website's server key is not affected by any of them, so the site
-- works the same before and after this runs.
--
-- Test after running: sign in as the test student, post on the wall, ask a
-- doubt, hand in work. Then pause the test student and try again (refused).

-- Signed in, not paused, access not ended (alumni never end). Staff always pass.
create or replace function public.is_active_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and (
        p.role in ('admin', 'view_admin')
        or (
          coalesce(p.status, 'active') <> 'blocked'
          and (p.expires_at is null or p.expires_at > now() or p.role = 'alumni')
        )
      )
  );
$$;

-- Active, and Full access (not lectures-only).
create or replace function public.is_full_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_active_member() and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and (p.role in ('admin', 'view_admin') or coalesce(p.scope, 'full') <> 'lectures_only')
  );
$$;

revoke all on function public.is_active_member() from public, anon;
revoke all on function public.is_full_member() from public, anon;
grant execute on function public.is_active_member() to authenticated, service_role;
grant execute on function public.is_full_member() to authenticated, service_role;

-- Helper: one restrictive rule per table and write kind, made safe to run twice.
do $$
declare
  t record;
begin
  for t in
    select * from (values
      -- Class wall: Full access only.
      ('wall_posts', 'full'), ('wall_replies', 'full'), ('wall_reactions', 'full'), ('wall_reports', 'full'),
      -- Doubts and hand-ins: lectures-only students may use them.
      ('doubts', 'active'), ('doubt_replies', 'active'), ('doubt_votes', 'active'),
      ('submissions', 'active'), ('submission_files', 'active')
    ) as v(tbl, need)
  loop
    if to_regclass('public.' || t.tbl) is null then continue; end if;
    execute format('drop policy if exists %I on public.%I', t.tbl || '_active_ins', t.tbl);
    execute format('drop policy if exists %I on public.%I', t.tbl || '_active_upd', t.tbl);
    execute format('drop policy if exists %I on public.%I', t.tbl || '_active_del', t.tbl);
    execute format('create policy %I on public.%I as restrictive for insert to authenticated with check (public.%s())',
      t.tbl || '_active_ins', t.tbl, case t.need when 'full' then 'is_full_member' else 'is_active_member' end);
    execute format('create policy %I on public.%I as restrictive for update to authenticated using (public.%s())',
      t.tbl || '_active_upd', t.tbl, case t.need when 'full' then 'is_full_member' else 'is_active_member' end);
    execute format('create policy %I on public.%I as restrictive for delete to authenticated using (public.%s())',
      t.tbl || '_active_del', t.tbl, case t.need when 'full' then 'is_full_member' else 'is_active_member' end);
  end loop;
end $$;

-- Scores, passport events and streaks: written by the server only. A student's
-- own key can still read their rows, but no longer insert or change them.
-- (The Super Admin keeps direct rights for corrections.)
do $$
declare
  t text;
begin
  foreach t in array array['quiz_attempts', 'mse_attempts', 'osce_attempts', 'formulation_attempts', 'competency_events', 'streaks', 'card_reviews']
  loop
    if to_regclass('public.' || t) is null then continue; end if;
    execute format('drop policy if exists %I on public.%I', t || '_server_only_ins', t);
    execute format('drop policy if exists %I on public.%I', t || '_server_only_upd', t);
    execute format('create policy %I on public.%I as restrictive for insert to authenticated, anon with check (public.is_super_admin())', t || '_server_only_ins', t);
    execute format('create policy %I on public.%I as restrictive for update to authenticated, anon using (public.is_super_admin())', t || '_server_only_upd', t);
  end loop;
end $$;

-- #############################################################################
-- 5. Remove people: dates for removed and deleted accounts, a small index, and a guard so a student cannot undo their own removal.
-- (from 2026_11_22_remove.sql)
-- #############################################################################

-- =============================================================================
-- 2026_11_22_remove.sql
--
-- Removing people from VIBHA (admin: "Remove access" and "Delete account").
--
-- The code works without this file: it marks a removal in
-- profiles.block_reason ("[removed] ..." or "[deleted]"), a column every
-- database already has. This file adds clean dates and a quick index so the
-- lists and checks read faster and the history is clearer.
--
--   profiles.removed_at   when access was removed (null = has access)
--   profiles.removed_by   which admin removed it
--   profiles.deleted_at   when the account was deleted for good
--
-- Additive and idempotent: safe to run any time, any number of times. It
-- drops nothing and changes no existing rule. Row level security on profiles
-- stays as it is; the new columns are only written by the server (service
-- role), and protect_profile_columns below stops a student changing them.
-- =============================================================================

alter table public.profiles add column if not exists removed_at timestamptz;
alter table public.profiles add column if not exists removed_by uuid references auth.users (id) on delete set null;
alter table public.profiles add column if not exists deleted_at timestamptz;

-- Fill the dates for removals made before this ran (marked in block_reason).
update public.profiles
   set removed_at = coalesce(removed_at, now())
 where status = 'blocked'
   and (block_reason like '[removed]%' or block_reason like '[deleted]%')
   and removed_at is null;
update public.profiles
   set deleted_at = coalesce(deleted_at, removed_at, now())
 where block_reason like '[deleted]%'
   and deleted_at is null;

-- Students' lists skip removed people: a small partial index keeps that cheap.
create index if not exists profiles_removed_idx on public.profiles (id) where removed_at is not null;

-- A signed-in student can never set or clear these on their own row.
create or replace function public.protect_profile_removal()
returns trigger
language plpgsql
set search_path to 'public'
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.removed_at is distinct from old.removed_at
      or new.removed_by is distinct from old.removed_by
      or new.deleted_at is distinct from old.deleted_at
      or new.block_reason is distinct from old.block_reason then
      raise exception 'Cannot change protected profile fields.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_removal_trigger on public.profiles;
create trigger protect_profile_removal_trigger
  before update on public.profiles
  for each row execute function public.protect_profile_removal();

-- The app's deletion requests: keep who answered and when (columns exist since
-- 2026_11_15_app_deletion_requests.sql); RLS stays on, no new policy needed.
alter table public.app_deletion_requests enable row level security;

-- #############################################################################
-- 6. Website requests: a private, anonymous count of where visitors stop on the way to asking to join (no names, no emails).
-- (from 2026_11_22_funnel.sql)
-- #############################################################################

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

-- #############################################################################
-- 7. Smart reminders: each person's reminder switches, a sent list so nothing goes twice, and push delivery receipts.
-- (from 2026_11_22_reminders.sql)
-- #############################################################################

-- =============================================================================
-- Smart reminders (22 Nov 2026): push and bell reminders for the clinic
--   opd_day       morning of an OPD day ("OPD today, evening 5 to 8")
--   session_soon  30 minutes before a session the student must attend
--   scan_out      shortly after a session ends, scanned in but not out
--   case_log      the evening after an OPD visit with no case log yet
--   leave_low     when the leaves left drop to 1
--
-- Additive and idempotent: safe to run any time, any number of times. Nothing
-- existing is changed. Run after 2026_11_15_app_devices.sql and
-- 2026_11_16_clinic.sql. Until this runs, reminders are simply not sent and
-- the reminder switches are kept on the phone only.
-- =============================================================================

-- 1. Which reminders each person wants (one row per person; no row = all on).
--    Written by the server only (the app and the website call the server).
create table if not exists public.app_reminder_prefs (
  user_id uuid primary key references auth.users (id) on delete cascade,
  opd_day boolean not null default true,
  session_soon boolean not null default true,
  scan_out boolean not null default true,
  case_log boolean not null default true,
  leave_low boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.app_reminder_prefs enable row level security;

drop policy if exists "app_reminder_prefs_own_select" on public.app_reminder_prefs;
create policy "app_reminder_prefs_own_select" on public.app_reminder_prefs
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "app_reminder_prefs_admin_select" on public.app_reminder_prefs;
create policy "app_reminder_prefs_admin_select" on public.app_reminder_prefs
  for select to authenticated using ((select public.is_admin()));

revoke all on public.app_reminder_prefs from anon;
revoke all on public.app_reminder_prefs from authenticated;
grant select on public.app_reminder_prefs to authenticated;

-- 2. Every reminder sent, so each one goes out once. The server claims a row
--    (insert, ignore if it is already there) before it sends; a second run of
--    the clock, or two at the same time, sends nothing twice.
--    ref is what the reminder is about: a session id, an OPD assignment id,
--    or "<cohort id>:<allowance>" for leave_low.
create table if not exists public.app_reminder_log (
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('opd_day', 'session_soon', 'scan_out', 'case_log', 'leave_low')),
  ref text not null check (char_length(ref) between 1 and 120),
  notification_id uuid,
  sent_at timestamptz not null default now(),
  primary key (user_id, kind, ref)
);
create index if not exists app_reminder_log_sent_at on public.app_reminder_log (sent_at);

alter table public.app_reminder_log enable row level security;

drop policy if exists "app_reminder_log_admin_select" on public.app_reminder_log;
create policy "app_reminder_log_admin_select" on public.app_reminder_log
  for select to authenticated using ((select public.is_admin()));

revoke all on public.app_reminder_log from anon;
revoke all on public.app_reminder_log from authenticated;
grant select on public.app_reminder_log to authenticated;

-- 3. Push delivery receipts. Each push Expo takes gives a ticket; about 15
--    minutes later its receipt says whether Google or Apple delivered it. The
--    server keeps the tickets here, the cron checks them, clears phones that
--    are gone (the app was removed) and deletes tickets older than a day.
--    Server only: nobody signed in can read or write it.
create table if not exists public.app_push_tickets (
  ticket_id text primary key check (char_length(ticket_id) between 1 and 200),
  token text not null check (char_length(token) between 1 and 300),
  user_id uuid references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists app_push_tickets_created_at on public.app_push_tickets (created_at);

alter table public.app_push_tickets enable row level security;
revoke all on public.app_push_tickets from anon;
revoke all on public.app_push_tickets from authenticated;

-- Tell the website's data layer about the new columns and functions.
notify pgrst, 'reload schema';
