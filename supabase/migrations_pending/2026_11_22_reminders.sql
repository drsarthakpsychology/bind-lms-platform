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
