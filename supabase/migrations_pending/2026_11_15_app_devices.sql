-- =============================================================================
-- Mobile app: phones, phone changes and notification preferences.
--
-- app_devices             one row per phone a person has signed in on. Holds
--                         the phone's name, its push token, when it was last
--                         seen, and whether it is the active phone.
-- app_device_changes      a log of phone changes ("switch") and of the admin
--                         allowing another change ("admin_reset"). The rule
--                         "2 phone changes in 30 days" is counted from here.
-- app_notification_prefs  one row per person: which push notifications they
--                         want.
--
-- Additive and idempotent: safe to run any time, any number of times. It
-- changes no existing table.
--
-- Row level security: a signed-in person can READ their own rows, admins can
-- read all rows. Nobody can write from the app or the browser: every write is
-- made by the server (service role) after its own checks
-- (src/lib/app-api/devices.ts, src/lib/app-api/prefs.ts).
--
-- Before this is run the app works fully, except: the one-phone rule and the
-- phone-change limit are not enforced, push notifications are not sent, and
-- notification preferences stay on the phone.
-- Order: this file can be run before or after the code is deployed.
-- =============================================================================

create table if not exists public.app_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- The id the app made for its install (letters, digits, dot, dash, underscore).
  device_id text not null check (char_length(device_id) between 16 and 80),
  name text check (name is null or char_length(name) <= 80),
  platform text check (platform is null or platform in ('android', 'ios')),
  app_version text check (app_version is null or char_length(app_version) <= 20),
  os_version text check (os_version is null or char_length(os_version) <= 40),
  -- Expo push token of this phone, or null when push is off or it signed out.
  push_token text check (push_token is null or char_length(push_token) <= 200),
  push_token_at timestamptz,
  -- The signed-in phone. For students at most one row per person is active
  -- (kept so by the server); admins may have several.
  active boolean not null default true,
  activated_at timestamptz not null default now(),
  last_seen_at timestamptz,
  -- Set when another phone took over, or when this phone signed out.
  replaced_at timestamptz,
  signed_out_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, device_id)
);

create index if not exists app_devices_user_active_idx on public.app_devices (user_id) where active;
create index if not exists app_devices_push_token_idx on public.app_devices (push_token) where push_token is not null;

alter table public.app_devices enable row level security;

drop policy if exists "app_devices_own_select" on public.app_devices;
create policy "app_devices_own_select" on public.app_devices
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "app_devices_admin_select" on public.app_devices;
create policy "app_devices_admin_select" on public.app_devices
  for select to authenticated using ((select public.is_admin()));

revoke all on public.app_devices from anon;
revoke all on public.app_devices from authenticated;
grant select on public.app_devices to authenticated;

-- -----------------------------------------------------------------------------

create table if not exists public.app_device_changes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('switch', 'admin_reset')),
  from_device_id text,
  to_device_id text,
  -- The admin who allowed another change (kind = 'admin_reset').
  by_user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_device_changes_user_time_idx on public.app_device_changes (user_id, created_at desc);

alter table public.app_device_changes enable row level security;

drop policy if exists "app_device_changes_own_select" on public.app_device_changes;
create policy "app_device_changes_own_select" on public.app_device_changes
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "app_device_changes_admin_select" on public.app_device_changes;
create policy "app_device_changes_admin_select" on public.app_device_changes
  for select to authenticated using ((select public.is_admin()));

revoke all on public.app_device_changes from anon;
revoke all on public.app_device_changes from authenticated;
grant select on public.app_device_changes to authenticated;

-- -----------------------------------------------------------------------------

create table if not exists public.app_notification_prefs (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- Master switch for push on this account.
  push boolean not null default true,
  messages boolean not null default true,
  doubt_replies boolean not null default true,
  achievements boolean not null default true,
  -- A daily reminder the phone schedules itself; stored so a new phone gets it.
  study_reminder boolean not null default false,
  study_reminder_time text not null default '19:00' check (study_reminder_time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  updated_at timestamptz not null default now()
);

alter table public.app_notification_prefs enable row level security;

drop policy if exists "app_notification_prefs_own_select" on public.app_notification_prefs;
create policy "app_notification_prefs_own_select" on public.app_notification_prefs
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "app_notification_prefs_admin_select" on public.app_notification_prefs;
create policy "app_notification_prefs_admin_select" on public.app_notification_prefs
  for select to authenticated using ((select public.is_admin()));

revoke all on public.app_notification_prefs from anon;
revoke all on public.app_notification_prefs from authenticated;
grant select on public.app_notification_prefs to authenticated;
