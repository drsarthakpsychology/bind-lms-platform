-- =============================================================================
-- Formulation attempts — slug on formulation_cases + richer attempts columns
-- (Part 6.2 follow-through; mirrors the osce/mse attempt pattern).
-- =============================================================================
-- formulation_attempts (practice_layer_tools.sql) references formulation_cases
-- by uuid, but the Forge runs on static SEED_FORMULATION with no DB row behind
-- it — so attempts could never be inserted (FK violation). Add a stable slug
-- so the route can resolve/upsert the case row. Own-transcript attempts
-- (Stage 4) reference a sim session, not a formulation case, so case_id
-- becomes nullable and source_sim_session_id is added.
-- Additive + idempotent.

alter table if exists public.formulation_cases
  add column if not exists slug text;

update public.formulation_cases set slug = id::text where slug is null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'formulation_cases_slug_key') then
    alter table public.formulation_cases add constraint formulation_cases_slug_key unique (slug);
  end if;
end $$;

alter table public.formulation_cases alter column slug set not null;
create index if not exists idx_formulation_cases_slug on public.formulation_cases (slug);

-- --- formulation_attempts metadata ---
alter table if exists public.formulation_attempts
  add column if not exists source_sim_session_id uuid;
alter table if exists public.formulation_attempts
  add column if not exists score numeric;
alter table if exists public.formulation_attempts
  add column if not exists started_at timestamptz;
alter table if exists public.formulation_attempts
  add column if not exists completed_at timestamptz;

-- Own-transcript attempts reference a sim session, not a formulation case.
alter table if exists public.formulation_attempts
  alter column case_id drop not null;
