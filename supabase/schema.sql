-- =============================================================================
-- PLMS — Database Schema
-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query).
-- =============================================================================
-- This file has two parts:
--   PART A — the core tables, exactly as defined in Part 4/5 of the blueprint.
--   PART B — recommended additions (RLS policies, an is_admin() helper, a
--            new-user trigger, indexes). Not literally in the blueprint's
--            table list, but they're what make the "Maximum Security" /
--            strict-RLS requirement in Parts 3 and 1 actually true at the
--            database level. Clearly separated so you can run Part A alone
--            if you'd rather add security policies by hand later.
--
-- One naming decision made in Part A: the two source docs disagree on
-- submission status values ('pending_review'/'approved' vs 'pending'/
-- 'approved'). Went with 'pending_review' since it reads clearer next to
-- 'approved' — rename below if you'd rather match the other doc.
-- =============================================================================

create extension if not exists pgcrypto;

-- =============================================================================
-- PART A — Core Schema
-- =============================================================================

-- Extends auth.users. One row per user, created via the Admin API (Part 2.2:
-- no public sign-up), so there is no public INSERT path onto auth.users.
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'student' check (role in ('admin', 'student')),
  active_session_token uuid,
  expires_at timestamptz
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  is_published boolean not null default false
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  title text not null,
  video_storage_path text,
  order_index integer not null default 0,
  requires_assignment boolean not null default false
);

create table if not exists progress (
  user_id uuid not null references profiles (id) on delete cascade,
  lesson_id uuid not null references lessons (id) on delete cascade,
  watched_seconds integer not null default 0,
  is_completed boolean not null default false,
  primary key (user_id, lesson_id)
);

create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons (id) on delete cascade,
  prompt_text text,
  submission_type text not null default 'text' check (submission_type in ('text', 'audio'))
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  text_content text,
  audio_storage_path text,
  status text not null default 'pending_review' check (status in ('pending_review', 'approved'))
);

-- =============================================================================
-- ⚠ ARCHITECTURE FLAG — read before Phase 3
-- =============================================================================
-- Neither source doc has a table linking specific students to specific
-- courses. As written, "is_published = true" is the only gate — every
-- authenticated student can see every published course. That's fine if the
-- cohort really is "all students, all courses," but doesn't match manual,
-- per-student enrollment. If you want that, uncomment this before Phase 3:
--
-- create table if not exists course_enrollments (
--   user_id uuid not null references profiles (id) on delete cascade,
--   course_id uuid not null references courses (id) on delete cascade,
--   enrolled_at timestamptz not null default now(),
--   primary key (user_id, course_id)
-- );
--
-- and swap the "published = visible to all" policies below for
-- "published AND enrolled = visible."

-- =============================================================================
-- PART B — Row Level Security (recommended, matches "Maximum Security" goal)
-- =============================================================================

alter table profiles enable row level security;
alter table courses enable row level security;
alter table lessons enable row level security;
alter table progress enable row level security;
alter table assignments enable row level security;
alter table submissions enable row level security;

-- SECURITY DEFINER so this can check `profiles` from inside a `profiles`
-- policy without recursing into RLS on itself.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles: everyone can read their own row; admins can read/write all.
create policy "profiles_select_own_or_admin" on profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "profiles_insert_admin_only" on profiles
  for insert with check (public.is_admin());

create policy "profiles_update_own_or_admin" on profiles
  for update using (auth.uid() = id or public.is_admin());

create policy "profiles_delete_admin_only" on profiles
  for delete using (public.is_admin());

-- courses: published courses are visible to any authenticated user;
-- admins see and manage everything. (See the enrollment flag above.)
create policy "courses_select_published_or_admin" on courses
  for select using (is_published = true or public.is_admin());

create policy "courses_admin_manage" on courses
  for all using (public.is_admin()) with check (public.is_admin());

-- lessons: visible if the parent course is visible.
create policy "lessons_select_via_course" on lessons
  for select using (
    public.is_admin()
    or exists (
      select 1 from courses c
      where c.id = lessons.course_id and c.is_published = true
    )
  );

create policy "lessons_admin_manage" on lessons
  for all using (public.is_admin()) with check (public.is_admin());

-- progress: users only ever touch their own row.
create policy "progress_own_or_admin_select" on progress
  for select using (auth.uid() = user_id or public.is_admin());

create policy "progress_own_upsert" on progress
  for insert with check (auth.uid() = user_id);

create policy "progress_own_update" on progress
  for update using (auth.uid() = user_id or public.is_admin());

-- assignments: visible if the parent lesson is visible.
create policy "assignments_select_via_lesson" on assignments
  for select using (
    public.is_admin()
    or exists (
      select 1 from lessons l
      join courses c on c.id = l.course_id
      where l.id = assignments.lesson_id and c.is_published = true
    )
  );

create policy "assignments_admin_manage" on assignments
  for all using (public.is_admin()) with check (public.is_admin());

-- submissions: students can create and view their own; only admins update
-- (that's the grading/approval action).
create policy "submissions_select_own_or_admin" on submissions
  for select using (auth.uid() = user_id or public.is_admin());

create policy "submissions_insert_own" on submissions
  for insert with check (auth.uid() = user_id);

create policy "submissions_update_admin_only" on submissions
  for update using (public.is_admin());

-- Auto-create a profile row the moment the Admin API creates an auth user,
-- so "generate a student" (Phase 3) never has to remember a second insert.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'student')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helpful indexes on the foreign keys used in lookups above.
create index if not exists idx_lessons_course_id on lessons (course_id);
create index if not exists idx_progress_lesson_id on progress (lesson_id);
create index if not exists idx_assignments_lesson_id on assignments (lesson_id);
create index if not exists idx_submissions_assignment_id on submissions (assignment_id);
create index if not exists idx_submissions_user_id on submissions (user_id);
