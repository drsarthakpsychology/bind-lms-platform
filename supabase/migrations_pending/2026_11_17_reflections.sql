-- Case reflections (owner choice, 17 Nov 2026).
--
-- After an OPD visit, with the day's case log, a student can write a short
-- reflection: what I saw, what I learned, what I want to ask. The Super Admin
-- (supervisor) replies; any admin reads. Needs 2026_11_16_clinic.sql first.
--
-- Additive and safe to run twice. Writes come only from the server (service
-- role), which checks who is asking; the policies below are the second lock.

create table if not exists public.clinic_reflections (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null unique references public.clinic_opd_assignments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  date date not null,
  batch text not null check (batch in ('morning', 'evening')),
  saw text check (saw is null or char_length(saw) <= 600),
  learned text check (learned is null or char_length(learned) <= 600),
  ask text check (ask is null or char_length(ask) <= 600),
  reply text check (reply is null or char_length(reply) <= 1000),
  replied_by uuid references auth.users (id) on delete set null,
  replied_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (coalesce(saw, learned, ask) is not null)
);
create index if not exists clinic_reflections_user on public.clinic_reflections (user_id, date desc);
create index if not exists clinic_reflections_cohort_date on public.clinic_reflections (cohort_id, date desc);

alter table public.clinic_reflections enable row level security;
revoke all on public.clinic_reflections from anon;
grant select, insert, update, delete on public.clinic_reflections to authenticated;

-- Any admin reads; only the Super Admin writes (the reply).
drop policy if exists "clinic_reflections_admin_select" on public.clinic_reflections;
create policy "clinic_reflections_admin_select" on public.clinic_reflections
  for select to authenticated using (public.is_admin());

drop policy if exists "clinic_reflections_super_write" on public.clinic_reflections;
create policy "clinic_reflections_super_write" on public.clinic_reflections
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- A student reads only their own.
drop policy if exists "clinic_reflections_own_select" on public.clinic_reflections;
create policy "clinic_reflections_own_select" on public.clinic_reflections
  for select to authenticated using ((select auth.uid()) = user_id);
