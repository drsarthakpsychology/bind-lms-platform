-- =============================================================================
-- Games dealt on the server (Escape Room practice, Rx Detective, MSE Lab,
-- Ward Week solo): one row per answer sent in a run. The first answer to a
-- step is kept, so sending an old run token again gets the first result back
-- instead of a second try. Written and read by the server with the service
-- role only (src/lib/games-sims/server/run-steps.ts); no user policies.
-- Additive and idempotent. The app works without it (answers are still
-- checked on the server; only the replay guard is off).
-- Rows are only needed while a run is open: anything older than a few days
-- can be deleted at any time.
-- =============================================================================
create table if not exists public.games2_run_steps (
  user_id uuid not null references auth.users (id) on delete cascade,
  game text not null,
  run text not null,
  step text not null,
  result jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, game, run, step)
);
create index if not exists games2_run_steps_created_idx on public.games2_run_steps (created_at);
alter table public.games2_run_steps enable row level security;
revoke all on public.games2_run_steps from anon, authenticated;
