-- =============================================================================
-- OSCE stations — slug column so the static SEED_OSCE_STATIONS content can
-- be upserted with a stable identity (Part 6.12 follow-through).
-- =============================================================================
-- osce_stations has been live since practice_layer_tools.sql with zero rows:
-- the /practice/osce tool runs entirely on SEED_OSCE_STATIONS in
-- src/lib/practice/osce.ts, so osce_attempts (station_id uuid references
-- osce_stations) could never actually be inserted into. This adds a slug
-- (the station's stable "osce-1".."osce-12" id) so the upsert script has
-- something idempotent to key on, and osce_attempts can resolve a real FK.
-- Additive + idempotent.

alter table if exists public.osce_stations
  add column if not exists slug text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'osce_stations_slug_key') then
    alter table public.osce_stations add constraint osce_stations_slug_key unique (slug);
  end if;
end $$;

create index if not exists idx_osce_stations_slug on public.osce_stations (slug);
