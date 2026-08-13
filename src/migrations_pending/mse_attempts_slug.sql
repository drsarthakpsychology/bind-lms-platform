-- =============================================================================
-- MSE attempts — slug on mse_stimuli + richer mse_attempts columns
-- (Part 6.4 follow-through; mirrors the osce_attempts pattern).
-- =============================================================================
-- mse_attempts (practice_layer_tools.sql) references mse_stimuli by uuid, but
-- the MSE trainer runs on static TS stimuli (SEED_MSE_STIMULI, FULL_MSE_STIMULI,
-- OBSERVE_STIMULI) with no DB rows behind them — so mse_attempts could never
-- actually be inserted into (FK violation every time). This adds a stable
-- slug on mse_stimuli so the upsert script has something idempotent to key on
-- and /api/practice/mse/attempt can resolve a real FK — exactly the
-- osce_stations_slug precedent.
--
-- Also widens mse_attempts to carry the attempt metadata the client already
-- shapes: level, domain, the attempt window, and (Level 5) the source sim
-- session. stimulus_id becomes nullable because Level 5 rows are session-
-- based — there is no mse_stimulus behind a live-interview MSE.
-- Additive + idempotent.

alter table if exists public.mse_stimuli
  add column if not exists slug text;

-- Backfill any existing rows with their uuid so the new unique constraint
-- holds, then lock it in.
update public.mse_stimuli set slug = id::text where slug is null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'mse_stimuli_slug_key') then
    alter table public.mse_stimuli add constraint mse_stimuli_slug_key unique (slug);
  end if;
end $$;

alter table public.mse_stimuli alter column slug set not null;
create index if not exists idx_mse_stimuli_slug on public.mse_stimuli (slug);

-- --- mse_attempts metadata ---
alter table if exists public.mse_attempts
  add column if not exists level text;
alter table if exists public.mse_attempts
  add column if not exists domain text;
alter table if exists public.mse_attempts
  add column if not exists started_at timestamptz;
alter table if exists public.mse_attempts
  add column if not exists completed_at timestamptz;
alter table if exists public.mse_attempts
  add column if not exists source_session_id uuid;

-- Level 5 attempts reference a sim session, not an mse_stimulus.
alter table if exists public.mse_attempts
  alter column stimulus_id drop not null;
