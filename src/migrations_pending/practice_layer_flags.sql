-- =============================================================================
-- Lumen Practice Layer — feature flags (v5.1 A2), made reproducible
-- =============================================================================
-- The feature_flags table + the 17 seed rows existed only in the live DB.
-- This migration reproduces them on a fresh Supabase project. The A2 scope
-- cut: build everything, ship six (Consulting Room, Decoder, MSE, Judgment,
-- Rounds, Journal) — the rest stay off until the admin reveals them at
-- /admin/flags. Additive + idempotent.

create table if not exists public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  key text not null unique,
  enabled boolean not null default false,
  enabled_for_cohort boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.feature_flags enable row level security;

-- Students read the flags that matter to them (their cohort's live tools);
-- admins manage everything. Drop-if-exists keeps re-runs idempotent on
-- deployments where the policies were created out-of-band.
drop policy if exists "feature_flags_select_enabled" on public.feature_flags;
drop policy if exists "feature_flags_admin_manage" on public.feature_flags;
create policy "feature_flags_select_enabled" on public.feature_flags
  for select using (enabled = true or public.is_admin());
create policy "feature_flags_admin_manage" on public.feature_flags
  for all using (public.is_admin()) with check (public.is_admin());

-- The six live for Cohort One (A2); the rest built-but-off, revealed by the
-- admin at /admin/flags (one click each, staged reveal as an engagement tool).
-- All 18 tools are fully built (verified on disk + data) and shipped for
-- Cohort One. Every flag enabled — see VISIBILITY.md (Bug 4 fix).
insert into public.feature_flags (key, enabled, enabled_for_cohort) values
  ('consulting_room',  true, true),
  ('decoder',          true, true),
  ('mse',              true, true),
  ('judgment',         true, true),
  ('rounds',           true, true),
  ('journal',          true, true),
  ('formulation',      true, true),
  ('osce',             true, true),
  ('ethics',           true, true),
  ('case_library',     true, true),
  ('landmark',         true, true),
  ('peer_roleplay',    true, true),
  ('two_minute_clinic', true, true),
  ('supervision',      true, true),
  ('skills_passport',  true, true),
  ('weak_spots',       true, true),
  ('checkin',          true, true),
  ('modules',          true, true)
on conflict (key) do update set
  enabled = excluded.enabled,
  enabled_for_cohort = excluded.enabled_for_cohort;
