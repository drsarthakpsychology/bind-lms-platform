-- =============================================================================
-- Games: Daily Case, Criteria Sort, Differential Duel (ranked), Blitz.
--
-- Additive and idempotent: only new tables, indexes and policies. Safe to run
-- more than once. Until this runs, the games still work (results are kept in
-- the browser, Duel offers unranked practice against a bot only).
--
-- Security model: students may only READ their own rows (and duel rows they
-- are in). Every write goes through the server with the service role, which
-- scores the game itself, so a student can't write their own score or rating.
-- =============================================================================

-- ------------------------------------------------------- daily_case_results ---
-- One row per student per case attempt. `log` is the move list; the server
-- replays it against the case to get the clues, score and status, so the
-- stored log is the source of truth (a reload can't reset a case).
create table if not exists public.daily_case_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  mode text not null check (mode in ('daily', 'practice')),
  day date not null,
  case_id text not null,
  log jsonb not null default '[]'::jsonb,
  status text not null default 'playing' check (status in ('playing', 'solved', 'lost')),
  clues int not null default 1,
  points int not null default 0,
  score int not null default 0,
  hints int not null default 0,
  xp_spent int not null default 0,
  xp_earned int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  finished_at timestamptz,
  unique (user_id, mode, day, case_id)
);
create index if not exists daily_case_results_day_idx on public.daily_case_results (day, mode);
create index if not exists daily_case_results_user_idx on public.daily_case_results (user_id, mode, day desc);
alter table public.daily_case_results enable row level security;
drop policy if exists "daily_case_results_own" on public.daily_case_results;
create policy "daily_case_results_own" on public.daily_case_results for select using (auth.uid() = user_id or public.is_admin());

-- ------------------------------------------------------------- sort_results ---
create table if not exists public.sort_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  mode text not null check (mode in ('daily', 'practice')),
  day date not null,
  board_id text not null,
  tier text not null default 'basic' check (tier in ('basic', 'advanced')),
  tries int not null default 0,
  solved boolean not null default false,
  score int not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, mode, day, board_id, tier)
);
create index if not exists sort_results_day_idx on public.sort_results (day, mode);
alter table public.sort_results enable row level security;
drop policy if exists "sort_results_own" on public.sort_results;
create policy "sort_results_own" on public.sort_results for select using (auth.uid() = user_id or public.is_admin());

-- ------------------------------------------------------------------ ratings ---
-- Glicko-style rating for ranked duels: rating + rating deviation (rd, how
-- sure we are). Starts at 1500 / 350.
create table if not exists public.ratings (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  rating double precision not null default 1500,
  rd double precision not null default 350,
  games int not null default 0,
  wins int not null default 0,
  losses int not null default 0,
  draws int not null default 0,
  forfeits int not null default 0,
  peak double precision not null default 1500,
  last_played timestamptz,
  updated_at timestamptz not null default now()
);
create index if not exists ratings_rating_idx on public.ratings (rating desc);
alter table public.ratings enable row level security;
drop policy if exists "ratings_read" on public.ratings;
-- Ratings are visible to signed-in students (for "X passed you" and opponent cards).
create policy "ratings_read" on public.ratings for select to authenticated using (true);

-- ------------------------------------------------------------------ matches ---
-- A duel. status: waiting (in the queue) → active → done; or cancelled (left
-- the queue). Round timing is derived from started_at and the answers, so no
-- background job is needed.
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  p1 uuid not null references public.profiles (id) on delete cascade,
  p2 uuid references public.profiles (id) on delete cascade,
  bot boolean not null default false,
  ranked boolean not null default true,
  status text not null default 'waiting' check (status in ('waiting', 'active', 'done', 'cancelled')),
  items text[] not null default '{}',
  seed int not null default 0,
  p1_rating double precision,
  p2_rating double precision,
  p1_seen timestamptz,
  p2_seen timestamptz,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  ended_at timestamptz,
  result text check (result in ('p1', 'p2', 'draw')),
  forfeit_by uuid,
  p1_score int,
  p2_score int,
  p1_delta double precision,
  p2_delta double precision
);
create index if not exists matches_queue_idx on public.matches (status, created_at) where status = 'waiting';
create index if not exists matches_p1_idx on public.matches (p1, created_at desc);
create index if not exists matches_p2_idx on public.matches (p2, created_at desc);
alter table public.matches enable row level security;
drop policy if exists "matches_players" on public.matches;
create policy "matches_players" on public.matches for select using (auth.uid() = p1 or auth.uid() = p2 or public.is_admin());

-- ------------------------------------------------------------ match_answers ---
-- One answer per player per round. answered_at is the SERVER time the answer
-- arrived; speed (ms) is measured from the server's round start.
create table if not exists public.match_answers (
  match_id uuid not null references public.matches (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  round int not null check (round between 0 and 9),
  dx int not null,
  feature int not null,
  correct_dx boolean not null,
  correct_feature boolean not null,
  points int not null,
  ms int not null,
  answered_at timestamptz not null default now(),
  primary key (match_id, user_id, round)
);
alter table public.match_answers enable row level security;
drop policy if exists "match_answers_own" on public.match_answers;
create policy "match_answers_own" on public.match_answers for select using (auth.uid() = user_id or public.is_admin());

-- ------------------------------------------------------------ blitz_results ---
-- One row per 60-second round, written as the round is played. The server
-- updates it on every answer only where `answered` still matches the last
-- count it saw, so an old run token can't be replayed to retry a question.
create table if not exists public.blitz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  day date not null,
  score int not null default 0,
  correct int not null default 0,
  answered int not null default 0,
  best_combo int not null default 0,
  run_id text not null unique,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  created_at timestamptz not null default now()
);
-- For databases where an earlier copy of this file already made the table.
alter table public.blitz_results add column if not exists started_at timestamptz not null default now();
alter table public.blitz_results add column if not exists finished_at timestamptz;
create index if not exists blitz_results_user_idx on public.blitz_results (user_id, score desc);
create index if not exists blitz_results_score_idx on public.blitz_results (score desc);
alter table public.blitz_results enable row level security;
drop policy if exists "blitz_results_own" on public.blitz_results;
create policy "blitz_results_own" on public.blitz_results for select using (auth.uid() = user_id or public.is_admin());
