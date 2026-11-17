-- =============================================================================
-- Test mode for admins (owner decision, 17 Nov 2026).
--
-- Each admin gets one hidden "Test student" and one hidden test cohort that
-- holds only that student. With test mode on, the admin can sign in as the
-- test student (app and website) and use the student side like a real student.
-- Anything the admin does in test mode lands in the test cohort or on the test
-- student only; the server refuses every other admin change while test mode is
-- on (src/lib/test-mode/**, src/lib/auth/guards.ts, src/lib/app-api/route.ts).
--
-- The test student is hidden everywhere real people look: it is flagged
-- profiles.is_test (already left out of every leaderboard, list, report and
-- send) and its email ends in ".invalid" (the robot-email rule).
--
-- Additive and idempotent: safe to run any time, any number of times. Nothing
-- existing is changed or dropped. Row level security is on for the new table:
-- an admin reads their own row, the test student reads its own row, any admin
-- reads all; only the server (service role) writes.
-- Order: run before or after the code. Until it runs, the Test mode switch
-- says the database step is missing and nothing else changes.
-- =============================================================================

-- 1. The flag on accounts (also in test_account_flag.sql; repeated so this
--    file works alone).
alter table public.profiles add column if not exists is_test boolean not null default false;

-- 2. Test cohorts: flagged, owned by one admin, and showing the lectures of a
--    real cohort (mirror) so the test student sees what that cohort sees.
alter table public.cohorts add column if not exists is_test boolean not null default false;
alter table public.cohorts add column if not exists test_owner uuid references public.profiles (id) on delete cascade;
alter table public.cohorts add column if not exists mirror_cohort_id uuid references public.cohorts (id) on delete set null;
create index if not exists cohorts_is_test_idx on public.cohorts (is_test) where is_test;

-- 3. One row per admin: their test student, their test cohort, and whether
--    test mode is on right now.
create table if not exists public.test_mode (
  admin_id uuid primary key references public.profiles (id) on delete cascade,
  test_user_id uuid not null unique references public.profiles (id) on delete cascade,
  test_cohort_id uuid references public.cohorts (id) on delete set null,
  mirror_cohort_id uuid references public.cohorts (id) on delete set null,
  active boolean not null default false,
  last_reset_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (test_user_id <> admin_id)
);
create index if not exists test_mode_active_idx on public.test_mode (admin_id) where active;

alter table public.test_mode enable row level security;
revoke all on public.test_mode from anon;

drop policy if exists "test_mode_own_select" on public.test_mode;
create policy "test_mode_own_select" on public.test_mode
  for select to authenticated using ((select auth.uid()) = admin_id or (select auth.uid()) = test_user_id);

drop policy if exists "test_mode_admin_select" on public.test_mode;
create policy "test_mode_admin_select" on public.test_mode
  for select to authenticated using (public.is_admin());
-- No insert, update or delete policy: only the service role writes.

-- 4. A database-side check other code and policies can use.
create or replace function public.is_test_account(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select is_test from public.profiles where id = uid), false);
$$;
revoke all on function public.is_test_account(uuid) from public, anon;
grant execute on function public.is_test_account(uuid) to authenticated, service_role;

-- 5. Test accounts are never students of a real cohort, and real people are
--    never in a test cohort. Such a row is skipped quietly (not an error), so
--    a bulk "add everyone to Cohort 2" still works and simply leaves the test
--    student out.
create or replace function public.test_member_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.profiles p where p.id = new.user_id and p.is_test)
     and not exists (select 1 from public.cohorts c where c.id = new.cohort_id and c.is_test) then
    return null;
  end if;
  if exists (select 1 from public.cohorts c where c.id = new.cohort_id and c.is_test)
     and not exists (select 1 from public.profiles p where p.id = new.user_id and p.is_test) then
    return null;
  end if;
  return new;
end;
$$;

drop trigger if exists cohort_members_test_guard on public.cohort_members;
create trigger cohort_members_test_guard
  before insert or update on public.cohort_members
  for each row execute function public.test_member_guard();
