-- =============================================================================
-- Cohorts, lecture access by cohort, one-off lecture access, the first-login
-- details form, and the totals behind the level board.
--
-- Additive and safe to run on the live site:
--   * Only new tables, one function and one view. Nothing is dropped or renamed.
--   * Until a student is in a cohort, the app keeps the old rules, so running
--     this file never hides a lecture from anyone.
--   * The last block creates "Cohort 1", puts every current student in it and
--     shares every existing lecture with it, so today's students see exactly
--     what they see now.
-- =============================================================================

-- ---------------------------------------------------------------- cohorts ---
create table if not exists public.cohorts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  course_id uuid references public.courses (id) on delete set null,
  starts_on date,
  ends_on date,
  status text not null default 'active' check (status in ('upcoming', 'active', 'ended')),
  created_at timestamptz not null default now()
);
alter table public.cohorts enable row level security;
drop policy if exists "cohorts_read" on public.cohorts;
create policy "cohorts_read" on public.cohorts for select to authenticated using (true);
drop policy if exists "cohorts_admin" on public.cohorts;
create policy "cohorts_admin" on public.cohorts for all using (public.is_admin()) with check (public.is_admin());

-- Who is in which cohort (a person can be in more than one).
create table if not exists public.cohort_members (
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  added_at timestamptz not null default now(),
  added_by uuid,
  primary key (cohort_id, user_id)
);
create index if not exists cohort_members_user_idx on public.cohort_members (user_id);
alter table public.cohort_members enable row level security;
drop policy if exists "cohort_members_own" on public.cohort_members;
create policy "cohort_members_own" on public.cohort_members for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "cohort_members_admin" on public.cohort_members;
create policy "cohort_members_admin" on public.cohort_members for all using (public.is_admin()) with check (public.is_admin());

-- Which cohorts can watch which lecture.
create table if not exists public.lesson_cohorts (
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  primary key (lesson_id, cohort_id)
);
create index if not exists lesson_cohorts_cohort_idx on public.lesson_cohorts (cohort_id);
alter table public.lesson_cohorts enable row level security;
drop policy if exists "lesson_cohorts_read" on public.lesson_cohorts;
create policy "lesson_cohorts_read" on public.lesson_cohorts for select to authenticated using (true);
drop policy if exists "lesson_cohorts_admin" on public.lesson_cohorts;
create policy "lesson_cohorts_admin" on public.lesson_cohorts for all using (public.is_admin()) with check (public.is_admin());

-- One person given one extra lecture, outside their cohort.
create table if not exists public.lesson_grants (
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  granted_by uuid,
  granted_at timestamptz not null default now(),
  primary key (lesson_id, user_id)
);
create index if not exists lesson_grants_user_idx on public.lesson_grants (user_id);
alter table public.lesson_grants enable row level security;
drop policy if exists "lesson_grants_own" on public.lesson_grants;
create policy "lesson_grants_own" on public.lesson_grants for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "lesson_grants_admin" on public.lesson_grants;
create policy "lesson_grants_admin" on public.lesson_grants for all using (public.is_admin()) with check (public.is_admin());

-- --------------------------------------------------- first-login details ---
-- Filled once by the student; confirmed_at is set when they review and submit.
create table if not exists public.student_details (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  full_name text not null,
  phone text not null,
  city text not null,
  state text not null,
  country text not null default 'India',
  qualification text not null,
  institution text not null,
  occupation text not null,
  confirmed_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.student_details enable row level security;
drop policy if exists "student_details_own_select" on public.student_details;
create policy "student_details_own_select" on public.student_details for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "student_details_own_insert" on public.student_details;
create policy "student_details_own_insert" on public.student_details for insert with check (auth.uid() = user_id);
drop policy if exists "student_details_own_update" on public.student_details;
create policy "student_details_own_update" on public.student_details for update using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());

-- ------------------------------------------------------- level board totals ---
-- Per-student time on the platform and lecture watching, summed in the
-- database so the board never pages through thousands of visit rows.
-- Only the server (service role) can call it.
create or replace function public.standing_totals()
returns table (user_id uuid, platform_seconds bigint, watched_seconds bigint, lessons_done bigint)
language sql
stable
security definer
set search_path = public
as $$
  with v as (
    select user_id, coalesce(sum(duration_seconds), 0)::bigint as s from public.page_visits group by user_id
  ), p as (
    select user_id, coalesce(sum(watched_seconds), 0)::bigint as w, count(*) filter (where is_completed)::bigint as d
    from public.progress group by user_id
  )
  select coalesce(v.user_id, p.user_id), coalesce(v.s, 0), coalesce(p.w, 0), coalesce(p.d, 0)
  from v full outer join p on p.user_id = v.user_id;
$$;
revoke all on function public.standing_totals() from public, anon, authenticated;
grant execute on function public.standing_totals() to service_role;

-- ------------------------------------------------------------ Cohort 1 -----
-- Everyone here today goes into Cohort 1 and keeps every lecture they have now.
insert into public.cohorts (name, course_id, status)
select 'Cohort 1', (select id from public.courses order by title limit 1), 'active'
where not exists (select 1 from public.cohorts where name = 'Cohort 1');

insert into public.cohort_members (cohort_id, user_id)
select c.id, p.id
from public.cohorts c cross join public.profiles p
where c.name = 'Cohort 1' and p.role = 'student'
on conflict do nothing;

insert into public.lesson_cohorts (lesson_id, cohort_id)
select l.id, c.id
from public.lessons l cross join public.cohorts c
where c.name = 'Cohort 1'
on conflict do nothing;

