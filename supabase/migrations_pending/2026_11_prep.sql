-- =============================================================================
-- Postgraduate prep (/prep): goal, diagnostic, mock attempts, seen questions
-- and mock-interview sessions.
-- Additive and idempotent: safe to run any time, any number of times.
-- Students can READ their own rows (admins read all). Every write goes through
-- the server with the service role (src/lib/prep/server.ts), so there are no
-- insert/update policies for signed-in users.
-- Abilities, question difficulty and spaced review reuse the learning engine
-- tables (skill_state "prep-<subject>:apply", item_stats / review_cards
-- "prep:<question id>"); see 2026_11_learning_engine.sql.
-- The app copes with these tables being absent (reads come back empty).
-- =============================================================================

-- 1. One row per student: their goal and the diagnostic's topic profile.
create table if not exists public.prep_profile (
  user_id uuid primary key references auth.users (id) on delete cascade,
  goal text not null check (goal in ('cuet-pg', 'ugc-net', 'mcp-entrance', 'ma-semester')),
  diagnostic jsonb,
  diagnostic_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.prep_profile enable row level security;
drop policy if exists "prep_profile_own_select" on public.prep_profile;
create policy "prep_profile_own_select" on public.prep_profile
  for select using (auth.uid() = user_id or public.is_admin());

-- 2. Timed mock attempts. `paper` is the question ids per section, fixed when
--    the mock starts; the score is computed on the server at submit.
create table if not exists public.prep_mock_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  spec_id text not null,
  started_at timestamptz not null default now(),
  deadline_at timestamptz not null,
  submitted_at timestamptz,
  paper jsonb not null,
  answers jsonb,
  marked jsonb,
  times jsonb,
  score real,
  max_score real,
  result jsonb,
  late boolean not null default false
);
create index if not exists prep_mock_attempts_user_idx on public.prep_mock_attempts (user_id, started_at desc);
create index if not exists prep_mock_attempts_spec_idx on public.prep_mock_attempts (spec_id, score) where submitted_at is not null;
alter table public.prep_mock_attempts enable row level security;
drop policy if exists "prep_mock_attempts_own_select" on public.prep_mock_attempts;
create policy "prep_mock_attempts_own_select" on public.prep_mock_attempts
  for select using (auth.uid() = user_id or public.is_admin());

-- 3. Which prep questions a student has already seen (so mocks rarely repeat).
create table if not exists public.prep_seen (
  user_id uuid not null references auth.users (id) on delete cascade,
  item text not null,
  n integer not null default 1,
  last_at timestamptz not null default now(),
  primary key (user_id, item)
);
alter table public.prep_seen enable row level security;
drop policy if exists "prep_seen_own_select" on public.prep_seen;
create policy "prep_seen_own_select" on public.prep_seen
  for select using (auth.uid() = user_id or public.is_admin());

-- 4. Mock-interview sessions: each answer, the self-assessment and any AI feedback.
create table if not exists public.prep_interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  goal text,
  created_at timestamptz not null default now(),
  items jsonb not null default '[]'::jsonb,
  score real
);
create index if not exists prep_interview_sessions_user_idx on public.prep_interview_sessions (user_id, created_at desc);
alter table public.prep_interview_sessions enable row level security;
drop policy if exists "prep_interview_sessions_own_select" on public.prep_interview_sessions;
create policy "prep_interview_sessions_own_select" on public.prep_interview_sessions
  for select using (auth.uid() = user_id or public.is_admin());

-- Signed-in users never write directly.
revoke insert, update, delete on public.prep_profile, public.prep_mock_attempts, public.prep_seen, public.prep_interview_sessions from anon, authenticated;
