-- =============================================================================
-- Second wave of games: MSE Lab, Ward Week, Rx Detective, Team Escape Room,
-- Comorbid. Additive and idempotent: safe to run any number of times.
-- Every write goes through the server with the service role
-- (src/lib/games-sims/server/*), so signed-in users get SELECT policies only,
-- on their own rows. The app copes with these tables being absent.
-- =============================================================================

-- 1. One finished round / excerpt / case per row (cohort boards read these
--    server-side with the service role).
create table if not exists public.games2_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  game text not null,
  item text,
  score real not null check (score >= 0 and score <= 1),
  right_count real,
  total integer,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists games2_results_game_created_idx on public.games2_results (game, created_at);
create index if not exists games2_results_user_game_idx on public.games2_results (user_id, game, created_at);
alter table public.games2_results enable row level security;
drop policy if exists "games2_results_own_select" on public.games2_results;
create policy "games2_results_own_select" on public.games2_results
  for select using (auth.uid() = user_id or public.is_admin());

-- 2. Teams (Escape Room races, Ward Week team campaigns). `state` is the
--    shared game state; `version` guards concurrent writes (compare-and-set).
create table if not exists public.games2_teams (
  id uuid primary key default gen_random_uuid(),
  game text not null check (game in ('escape', 'ward')),
  scenario text not null,
  code text not null,
  name text not null,
  created_by uuid not null references auth.users (id) on delete cascade,
  status text not null default 'lobby' check (status in ('lobby', 'playing', 'done')),
  state jsonb not null default '{}'::jsonb,
  version integer not null default 0,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists games2_teams_code_idx on public.games2_teams (code);
create index if not exists games2_teams_game_scenario_idx on public.games2_teams (game, scenario, created_at);
alter table public.games2_teams enable row level security;

-- 3. Who is in which team.
create table if not exists public.games2_team_members (
  team_id uuid not null references public.games2_teams (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default '',
  joined_at timestamptz not null default now(),
  primary key (team_id, user_id)
);
create index if not exists games2_team_members_user_idx on public.games2_team_members (user_id);
alter table public.games2_team_members enable row level security;
drop policy if exists "games2_team_members_own_select" on public.games2_team_members;
create policy "games2_team_members_own_select" on public.games2_team_members
  for select using (auth.uid() = user_id or public.is_admin());

-- Team rows are visible to their members (and admins).
drop policy if exists "games2_teams_member_select" on public.games2_teams;
create policy "games2_teams_member_select" on public.games2_teams
  for select using (
    public.is_admin()
    or exists (select 1 from public.games2_team_members m where m.team_id = games2_teams.id and m.user_id = auth.uid())
  );

-- 4. Ward Week team votes: one vote per member per decision step.
create table if not exists public.games2_votes (
  team_id uuid not null references public.games2_teams (id) on delete cascade,
  step integer not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  choice text not null,
  created_at timestamptz not null default now(),
  primary key (team_id, step, user_id)
);
alter table public.games2_votes enable row level security;
drop policy if exists "games2_votes_own_select" on public.games2_votes;
create policy "games2_votes_own_select" on public.games2_votes
  for select using (auth.uid() = user_id or public.is_admin());

-- No insert/update/delete policies: the server (service role) writes.
revoke insert, update, delete on public.games2_results, public.games2_teams, public.games2_team_members, public.games2_votes from anon, authenticated;
