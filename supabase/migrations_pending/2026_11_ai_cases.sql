-- =============================================================================
-- AI practice cases ("AI case") and the graded AI patient interview.
-- Additive and idempotent: safe to run any time, any number of times.
-- NOT APPLIED. Every read and write goes through the server with the service
-- role (src/lib/ai-cases/store.ts, src/lib/interview-grade/store.ts); the app
-- copes with these tables being absent (reads come back empty, AI cases fall
-- back to the shared ai_response_cache, grades are shown but not kept).
-- Students may read their own grades; admins read everything. No insert or
-- update policies for signed-in users.
-- =============================================================================

-- 1. AI-made Daily Case style cases. `case_data` is the checked AiCase JSON
--    (src/lib/ai-cases/types.ts). Status: live (served), flagged (a student
--    reported it; out of practice until reviewed), removed (never served).
create table if not exists public.ai_cases (
  id text primary key,
  dx text not null,
  topic text not null,
  difficulty smallint not null check (difficulty between 1 and 3),
  setting text not null check (setting in ('indian', 'global')),
  status text not null default 'live' check (status in ('live', 'flagged', 'removed')),
  flags int not null default 0,
  case_data jsonb not null,
  provider text,
  checked_by text,
  created_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz
);
create index if not exists ai_cases_pick_idx on public.ai_cases (status, dx, difficulty, setting);
create index if not exists ai_cases_topic_idx on public.ai_cases (status, topic);
create index if not exists ai_cases_review_idx on public.ai_cases (flags desc, created_at desc);
alter table public.ai_cases enable row level security;
drop policy if exists "ai_cases_admin_select" on public.ai_cases;
create policy "ai_cases_admin_select" on public.ai_cases for select using (public.is_admin());

-- 2. Student reports. One per student per case.
create table if not exists public.ai_case_flags (
  id uuid primary key default gen_random_uuid(),
  case_id text not null references public.ai_cases (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  reason text,
  created_at timestamptz not null default now(),
  unique (case_id, user_id)
);
create index if not exists ai_case_flags_case_idx on public.ai_case_flags (case_id, created_at desc);
alter table public.ai_case_flags enable row level security;
drop policy if exists "ai_case_flags_select" on public.ai_case_flags;
create policy "ai_case_flags_select" on public.ai_case_flags for select using (auth.uid() = user_id or public.is_admin());

-- 3. Graded AI patient interviews: one grade per sim session. `submission`
--    is the student's MSE, risk and formulation write-up; `grade` is the
--    rubric (src/lib/interview-grade/types.ts).
create table if not exists public.sim_interview_grades (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.sim_sessions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  case_id uuid,
  topic text not null,
  submission jsonb not null,
  grade jsonb not null,
  overall real not null,
  provider text,
  created_at timestamptz not null default now()
);
create index if not exists sim_interview_grades_user_idx on public.sim_interview_grades (user_id, created_at desc);
alter table public.sim_interview_grades enable row level security;
drop policy if exists "sim_interview_grades_own" on public.sim_interview_grades;
create policy "sim_interview_grades_own" on public.sim_interview_grades for select using (auth.uid() = user_id or public.is_admin());
