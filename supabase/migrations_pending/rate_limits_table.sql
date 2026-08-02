-- Durable rate limiting (free tier): a Postgres-backed fixed-window limiter.
-- The in-memory Map in src/lib/rate-limit-fast.ts is per-process, so across
-- serverless instances the quota multiplies. This table makes the limit
-- global to the project. The DB-backed limiter (src/lib/rate-limit.ts) reads
-- and writes it; a fresh environment MUST have this table or the first media
-- request fails closed (429 on everything).
--
-- Run in the Supabase SQL Editor. Idempotent.
-- =============================================================================

create table if not exists public.rate_limits (
  key text primary key,
  count integer not null default 1,
  reset_at timestamptz not null
);

alter table public.rate_limits enable row level security;

-- Server-only table; the app writes through the service-role client.
create policy "rate_limits_server_only" on public.rate_limits
  for all
  to authenticated, anon
  using (false)
  with check (false);
