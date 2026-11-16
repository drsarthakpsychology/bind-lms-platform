-- =============================================================================
-- Clinic: schedule, QR attendance, leave, OPD case quota and the generated OPD
-- timetable (owner spec, 16 Nov 2026).
--
-- Additive and idempotent: safe to run any time, any number of times. Nothing
-- existing is changed. Every table has row level security on:
--   * students read only their own rows (and sessions of their own cohorts);
--   * any admin (Super Admin or View Admin) reads everything;
--   * only the Super Admin writes through RLS.
-- The server writes with the service role after its own checks
-- (src/lib/clinic/**), so students never write these tables directly.
-- clinic_session_secrets is service role only (no policy for anyone).
--
-- Times: `date` and `start_time`/`end_time` are clinic local time (India,
-- UTC+05:30, no daylight saving). The server works out instants from them.
-- =============================================================================

-- 1. Weekly timetable: one row per repeating slot ("Mon OPD morning 8 to 10").
create table if not exists public.clinic_timetable_slots (
  id uuid primary key default gen_random_uuid(),
  cohort_ids uuid[] not null check (cardinality(cohort_ids) between 1 and 20),
  weekday smallint not null check (weekday between 0 and 6), -- 0 Sunday .. 6 Saturday
  start_time time not null,
  end_time time not null,
  kind text not null check (kind in ('opd_morning', 'opd_evening', 'class', 'online_class', 'early_class', 'other')),
  title text not null check (char_length(title) between 1 and 120),
  place text check (place is null or char_length(place) <= 200),
  online_link text check (online_link is null or char_length(online_link) <= 500),
  compulsory boolean not null default true,
  valid_from date,
  valid_to date,
  active boolean not null default true,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time > start_time),
  check (valid_to is null or valid_from is null or valid_to >= valid_from)
);

-- 2. Sessions: one dated occurrence (from the timetable or a one-off).
create table if not exists public.clinic_sessions (
  id uuid primary key default gen_random_uuid(),
  cohort_ids uuid[] not null check (cardinality(cohort_ids) between 1 and 20),
  slot_id uuid references public.clinic_timetable_slots (id) on delete set null,
  date date not null,
  start_time time not null,
  end_time time not null,
  kind text not null check (kind in ('opd_morning', 'opd_evening', 'class', 'online_class', 'early_class', 'other')),
  title text not null check (char_length(title) between 1 and 120),
  place text check (place is null or char_length(place) <= 200),
  online_link text check (online_link is null or char_length(online_link) <= 500),
  compulsory boolean not null default true,
  status text not null default 'scheduled' check (status in ('scheduled', 'cancelled')),
  origin text not null default 'timetable' check (origin in ('timetable', 'one_off')),
  note text check (note is null or char_length(note) <= 500),
  -- Set when the admin moves a session (the old date and times, for the notice).
  moved_from text check (moved_from is null or char_length(moved_from) <= 60),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time > start_time)
);
-- One session per timetable slot per day (expanding the timetable twice adds nothing).
-- One-offs have no slot; NULLs never clash.
create unique index if not exists clinic_sessions_slot_date on public.clinic_sessions (slot_id, date);
create index if not exists clinic_sessions_date on public.clinic_sessions (date);
create index if not exists clinic_sessions_cohorts on public.clinic_sessions using gin (cohort_ids);

-- 3. A short note on a day's schedule ("bring your case sheets").
create table if not exists public.clinic_day_notes (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  date date not null,
  note text not null check (char_length(note) between 1 and 500),
  created_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (cohort_id, date)
);

-- 4. Per-session QR secret, made by the server when the admin taps Show code.
create table if not exists public.clinic_session_secrets (
  session_id uuid primary key references public.clinic_sessions (id) on delete cascade,
  secret text not null check (char_length(secret) between 32 and 128),
  opened_by uuid references auth.users (id) on delete set null,
  opened_at timestamptz not null default now()
);

-- 5. Attendance: in and out times per student per session.
create table if not exists public.clinic_attendance (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.clinic_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  in_at timestamptz,
  out_at timestamptz,
  in_method text check (in_method is null or in_method in ('qr', 'code', 'manual')),
  out_method text check (out_method is null or out_method in ('qr', 'code', 'manual')),
  note text check (note is null or char_length(note) <= 300),
  marked_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (session_id, user_id),
  check (out_at is null or in_at is null or out_at >= in_at)
);
create index if not exists clinic_attendance_user on public.clinic_attendance (user_id);

-- 6. Leave allowance per student per cohort, and every change to it.
create table if not exists public.clinic_leave_allowances (
  user_id uuid not null references auth.users (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  allowance integer not null default 0 check (allowance between 0 and 1000),
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (user_id, cohort_id)
);

create table if not exists public.clinic_leave_allowance_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  old_allowance integer,
  new_allowance integer not null,
  note text check (note is null or char_length(note) <= 300),
  changed_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists clinic_leave_allowance_log_user on public.clinic_leave_allowance_log (user_id, cohort_id, created_at desc);

-- 7. Leave requests. kind: 'leave' (uses one leave per session), 'early'
-- (leave early on one session, free), 'missed' (made by the server for a
-- missed assigned OPD day: approved, counts as one leave).
create table if not exists public.clinic_leave_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  kind text not null check (kind in ('leave', 'early', 'missed')),
  session_ids uuid[] not null default '{}' check (cardinality(session_ids) <= 60),
  leave_at time,
  reason text check (reason is null or char_length(reason) <= 500),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  over_limit boolean not null default false,
  -- 'missed' rows: the OPD assignment that was missed (one row per assignment).
  assignment_id uuid,
  decided_by uuid references auth.users (id) on delete set null,
  decided_at timestamptz,
  decision_note text check (decision_note is null or char_length(decision_note) <= 300),
  created_at timestamptz not null default now(),
  check (kind <> 'early' or (leave_at is not null and cardinality(session_ids) = 1))
);
create index if not exists clinic_leave_requests_user on public.clinic_leave_requests (user_id, cohort_id);
create index if not exists clinic_leave_requests_status on public.clinic_leave_requests (status, created_at);
-- One missed-day row per assignment (NULLs never clash, so leave and early rows are free).
create unique index if not exists clinic_leave_requests_missed on public.clinic_leave_requests (assignment_id);

-- 8. OPD settings per cohort. seats: {"1": {"morning": 3, "evening": 3}, "6": {}}
-- keyed by weekday (0 Sunday .. 6 Saturday).
create table if not exists public.clinic_opd_settings (
  cohort_id uuid primary key references public.cohorts (id) on delete cascade,
  seats jsonb not null default '{}'::jsonb check (jsonb_typeof(seats) = 'object'),
  cases_per_visit integer not null default 2 check (cases_per_visit between 1 and 20),
  start_date date,
  end_date date,
  late_minutes integer not null default 10 check (late_minutes between 0 and 180),
  holidays date[] not null default '{}' check (cardinality(holidays) <= 400),
  -- Published days closer than this many days are never moved by "Generate again".
  freeze_days integer not null default 7 check (freeze_days between 0 and 60),
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);

-- 9. Each student's OPD batch (morning or evening).
create table if not exists public.clinic_opd_prefs (
  user_id uuid not null references auth.users (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  batch text not null check (batch in ('morning', 'evening')),
  set_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (user_id, cohort_id)
);

-- 10. Case quota: the base number of cases per student, and paid extras.
create table if not exists public.clinic_case_quotas (
  user_id uuid not null references auth.users (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  base integer not null default 0 check (base between 0 and 500),
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (user_id, cohort_id)
);

create table if not exists public.clinic_case_extras (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  count integer not null check (count between -100 and 100 and count <> 0),
  note text check (note is null or char_length(note) <= 300),
  added_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists clinic_case_extras_user on public.clinic_case_extras (user_id, cohort_id);

-- 11. OPD assignments: a student's visit day. 'draft' rows are the plan the
-- admin is looking at; Publish turns them into 'published'.
create table if not exists public.clinic_opd_assignments (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  batch text not null check (batch in ('morning', 'evening')),
  state text not null check (state in ('draft', 'published')),
  source text not null default 'new' check (source in ('kept', 'new', 'moved')),
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (cohort_id, user_id, date, state)
);
create index if not exists clinic_opd_assignments_day on public.clinic_opd_assignments (cohort_id, state, date);
create index if not exists clinic_opd_assignments_user on public.clinic_opd_assignments (user_id, state, date);

-- 12. Case log: what the student did on an assigned OPD day.
create table if not exists public.clinic_case_logs (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null unique references public.clinic_opd_assignments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  date date not null,
  cases integer not null default 0 check (cases between 0 and 50),
  absent boolean not null default false,
  note text check (note is null or char_length(note) <= 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (not absent or cases = 0)
);
create index if not exists clinic_case_logs_user on public.clinic_case_logs (user_id, cohort_id);

-- -----------------------------------------------------------------------------
-- Row level security
-- -----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'clinic_timetable_slots', 'clinic_sessions', 'clinic_day_notes', 'clinic_session_secrets',
    'clinic_attendance', 'clinic_leave_allowances', 'clinic_leave_allowance_log', 'clinic_leave_requests',
    'clinic_opd_settings', 'clinic_opd_prefs', 'clinic_case_quotas', 'clinic_case_extras',
    'clinic_opd_assignments', 'clinic_case_logs'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon', t);
  end loop;

  -- Admin read and Super Admin write on every table except the secrets.
  foreach t in array array[
    'clinic_timetable_slots', 'clinic_sessions', 'clinic_day_notes',
    'clinic_attendance', 'clinic_leave_allowances', 'clinic_leave_allowance_log', 'clinic_leave_requests',
    'clinic_opd_settings', 'clinic_opd_prefs', 'clinic_case_quotas', 'clinic_case_extras',
    'clinic_opd_assignments', 'clinic_case_logs'
  ] loop
    execute format('drop policy if exists %I on public.%I', t || '_admin_select', t);
    execute format('create policy %I on public.%I for select to authenticated using (public.is_admin())', t || '_admin_select', t);
    execute format('drop policy if exists %I on public.%I', t || '_super_write', t);
    execute format('create policy %I on public.%I for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin())', t || '_super_write', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;

  -- Students read their own rows.
  foreach t in array array[
    'clinic_attendance', 'clinic_leave_allowances', 'clinic_leave_allowance_log', 'clinic_leave_requests',
    'clinic_opd_prefs', 'clinic_case_quotas', 'clinic_case_extras', 'clinic_case_logs'
  ] loop
    execute format('drop policy if exists %I on public.%I', t || '_own_select', t);
    execute format('create policy %I on public.%I for select to authenticated using ((select auth.uid()) = user_id)', t || '_own_select', t);
  end loop;
end $$;

-- Students see published OPD days of their own.
drop policy if exists "clinic_opd_assignments_own_select" on public.clinic_opd_assignments;
create policy "clinic_opd_assignments_own_select" on public.clinic_opd_assignments
  for select to authenticated using ((select auth.uid()) = user_id and state = 'published');

-- Students see sessions, timetable, notes and OPD settings of their own cohorts.
drop policy if exists "clinic_sessions_member_select" on public.clinic_sessions;
create policy "clinic_sessions_member_select" on public.clinic_sessions
  for select to authenticated using (exists (
    select 1 from public.cohort_members m where m.user_id = (select auth.uid()) and m.cohort_id = any (cohort_ids)
  ));

drop policy if exists "clinic_timetable_slots_member_select" on public.clinic_timetable_slots;
create policy "clinic_timetable_slots_member_select" on public.clinic_timetable_slots
  for select to authenticated using (exists (
    select 1 from public.cohort_members m where m.user_id = (select auth.uid()) and m.cohort_id = any (cohort_ids)
  ));

drop policy if exists "clinic_day_notes_member_select" on public.clinic_day_notes;
create policy "clinic_day_notes_member_select" on public.clinic_day_notes
  for select to authenticated using (exists (
    select 1 from public.cohort_members m where m.user_id = (select auth.uid()) and m.cohort_id = clinic_day_notes.cohort_id
  ));

drop policy if exists "clinic_opd_settings_member_select" on public.clinic_opd_settings;
create policy "clinic_opd_settings_member_select" on public.clinic_opd_settings
  for select to authenticated using (exists (
    select 1 from public.cohort_members m where m.user_id = (select auth.uid()) and m.cohort_id = clinic_opd_settings.cohort_id
  ));

-- The QR secrets: service role only. No policy, no grant.
revoke all on public.clinic_session_secrets from authenticated;
