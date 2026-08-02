-- =============================================================================
-- psychopharm_tools — the psychopharmacology reference ("Tools")
--
-- Safety-first data model. Everything here exists to make one thing
-- structurally impossible: unverified content reaching a student.
--
-- Lifecycle: draft -> in_review -> verified -> published. Only `published`
-- rows are student-visible. A `published` row MUST carry source_id, page_ref,
-- verified_by, verified_at — enforced by DB CHECK, not application logic.
-- Editing a published field flips it back to in_review (no silent edits).
-- `snippet` (verbatim source excerpt) is reviewer-only; student RLS can't see it.
--
-- Idempotent. Run in the Supabase SQL Editor or via npm run apply-migrations.
-- =============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- sources
-- ---------------------------------------------------------------------------
create table if not exists psych_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authors text,
  edition text,
  year integer,
  publisher text,
  type text not null check (type in ('pharmacology', 'clinical_psychology', 'icd')),
  local_path text,
  authority_scope text[] not null default '{}',
  is_preview boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- drugs
-- ---------------------------------------------------------------------------
create table if not exists psych_drugs (
  id uuid primary key default gen_random_uuid(),
  generic_name text not null,
  brand_names text[] not null default '{}',
  drug_class text,
  subclass text,
  aliases text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  created_at timestamptz not null default now(),
  unique (generic_name)
);

-- ---------------------------------------------------------------------------
-- drug_fields — the core table, one row per fact
-- ---------------------------------------------------------------------------
create table if not exists psych_drug_fields (
  id uuid primary key default gen_random_uuid(),
  drug_id uuid not null references psych_drugs (id) on delete cascade,
  field_key text not null, -- mechanism | receptor_targets | ... | plain_language | ...
  value jsonb not null,
  display_order integer not null default 0,
  source_id uuid references psych_sources (id),
  page_ref text,
  snippet text, -- reviewer-only verbatim source excerpt
  agreement text check (agreement in ('full','partial','single','conflict')),
  conflict_group_id uuid,
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  verified_by uuid references profiles (id) on delete set null,
  verified_at timestamptz,
  reviewer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (drug_id, field_key, source_id)
);

-- A published fact must be fully sourced + verified. The safety core.
alter table psych_drug_fields
  drop constraint if exists psych_drug_fields_published_requires_source;
alter table psych_drug_fields
  add constraint psych_drug_fields_published_requires_source check (
    status <> 'published'
    or (source_id is not null and page_ref is not null
        and verified_by is not null and verified_at is not null)
  );

-- ---------------------------------------------------------------------------
-- dose_ranges — structured, filterable, never free-text
-- ---------------------------------------------------------------------------
create table if not exists psych_dose_ranges (
  id uuid primary key default gen_random_uuid(),
  drug_id uuid not null references psych_drugs (id) on delete cascade,
  context text,
  low numeric,
  high numeric,
  unit text,
  frequency text,
  population_note text,
  source_id uuid references psych_sources (id),
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  verified_by uuid references profiles (id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

alter table psych_dose_ranges
  drop constraint if exists psych_dose_ranges_published_requires_source;
alter table psych_dose_ranges
  add constraint psych_dose_ranges_published_requires_source check (
    status <> 'published'
    or (source_id is not null and verified_by is not null and verified_at is not null)
  );

-- ---------------------------------------------------------------------------
-- dose_bands — the drug-at-a-dose model. Side effects + prompts per band.
-- ---------------------------------------------------------------------------
create table if not exists psych_dose_bands (
  id uuid primary key default gen_random_uuid(),
  drug_id uuid not null references psych_drugs (id) on delete cascade,
  band_order integer not null default 0,
  range_low numeric,
  range_high numeric,
  unit text,
  frequency text,
  band_label text,
  primary_purpose text,
  secondary_purposes text[] not null default '{}',
  plain_explanation text,
  technical_explanation text,
  why_this_dose text,
  is_typical_starting boolean not null default false,
  is_standard_maintenance boolean not null default false,
  what_changes_going_up text,
  what_changes_going_down text,
  onset text,
  side_effects_at_this_band jsonb not null default '[]',
  observation_prompts_at_this_band jsonb not null default '[]',
  population_notes text[] not null default '{}',
  source_refs jsonb not null default '[]',
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  verified_by uuid references profiles (id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (drug_id, band_order)
);

alter table psych_dose_bands
  drop constraint if exists psych_dose_bands_published_requires_source;
alter table psych_dose_bands
  add constraint psych_dose_bands_published_requires_source check (
    status <> 'published'
    or (verified_by is not null and verified_at is not null)
  );

-- ---------------------------------------------------------------------------
-- conditions + comorbidity_notes
-- ---------------------------------------------------------------------------
create table if not exists psych_conditions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plain_name text,
  icd_code text,
  category text,
  unique (name)
);

create table if not exists psych_comorbidity_notes (
  id uuid primary key default gen_random_uuid(),
  drug_id uuid not null references psych_drugs (id) on delete cascade,
  condition_id uuid not null references psych_conditions (id) on delete cascade,
  note text not null,
  severity_flag text not null default 'routine' check (severity_flag in ('routine','mention_to_prescriber','refer_promptly')),
  source_id uuid references psych_sources (id),
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  verified_by uuid references profiles (id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (drug_id, condition_id)
);

-- ---------------------------------------------------------------------------
-- observation_prompts
-- ---------------------------------------------------------------------------
create table if not exists psych_observation_prompts (
  id uuid primary key default gen_random_uuid(),
  drug_id uuid references psych_drugs (id) on delete cascade,
  class_id text,
  prompt_text text not null,
  rationale text not null,
  urgency text not null check (urgency in ('routine','mention_to_prescriber','refer_promptly')),
  source_id uuid references psych_sources (id),
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  verified_by uuid references profiles (id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- mechanism_tags
-- ---------------------------------------------------------------------------
create table if not exists psych_mechanism_tags (
  id uuid primary key default gen_random_uuid(),
  drug_id uuid not null references psych_drugs (id) on delete cascade,
  tag text not null,
  direction text check (direction in ('agonist','antagonist','partial','reuptake_inhibition')),
  strength text,
  created_at timestamptz not null default now(),
  unique (drug_id, tag)
);

-- ---------------------------------------------------------------------------
-- drug_links — similarity: same job / mechanism / class / published equivalence
-- ---------------------------------------------------------------------------
create table if not exists psych_drug_links (
  id uuid primary key default gen_random_uuid(),
  drug_a uuid not null references psych_drugs (id) on delete cascade,
  drug_b uuid not null references psych_drugs (id) on delete cascade,
  link_type text not null check (link_type in ('same_job','same_mechanism','same_class','published_equivalence')),
  match_tier text not null check (match_tier in ('strong','moderate','related')),
  match_reason text,
  differences text[] not null default '{}',
  equivalence_note text,
  source_id uuid references psych_sources (id),
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  created_at timestamptz not null default now(),
  unique (drug_a, drug_b, link_type)
);

-- ---------------------------------------------------------------------------
-- review_audit — immutable
-- ---------------------------------------------------------------------------
create table if not exists psych_review_audit (
  id uuid primary key default gen_random_uuid(),
  target_table text not null,
  target_id uuid not null,
  action text not null,
  reviewer_id uuid references profiles (id) on delete set null,
  before jsonb,
  after jsonb,
  note text,
  created_at timestamptz not null default now()
);
-- immutable: no update/delete allowed by anyone.
alter table psych_review_audit enable row level security;
create policy "psych_review_audit_no_update" on psych_review_audit
  for update using (false) with check (false);
create policy "psych_review_audit_no_delete" on psych_review_audit
  for delete using (false);

-- ---------------------------------------------------------------------------
-- user_acknowledgements
-- ---------------------------------------------------------------------------
create table if not exists psych_user_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  version text not null,
  accepted_at timestamptz not null default now(),
  unique (user_id, version)
);

-- ---------------------------------------------------------------------------
-- published-edit -> in_review trigger (no silent edits)
-- ---------------------------------------------------------------------------
create or replace function psych_demote_on_published_edit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if TG_OP = 'UPDATE' and OLD.status = 'published'
     and new.status is distinct from 'in_review'
     and (new.value is distinct from old.value
          or new.verified_by is distinct from old.verified_by
          or new.verified_at is distinct from old.verified_at) then
    new.status := 'in_review';
    new.verified_by := null;
    new.verified_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists psych_drug_fields_demote on psych_drug_fields;
create trigger psych_drug_fields_demote
  before update on psych_drug_fields
  for each row execute function psych_demote_on_published_edit();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table psych_sources enable row level security;
alter table psych_drugs enable row level security;
alter table psych_drug_fields enable row level security;
alter table psych_dose_ranges enable row level security;
alter table psych_dose_bands enable row level security;
alter table psych_conditions enable row level security;
alter table psych_comorbidity_notes enable row level security;
alter table psych_observation_prompts enable row level security;
alter table psych_mechanism_tags enable row level security;
alter table psych_drug_links enable row level security;
alter table psych_user_acknowledgements enable row level security;

-- Sources: reference content, read-only for all authenticated; admins manage.
create policy "psych_sources_select_all" on psych_sources
  for select to anon, authenticated using (true);
create policy "psych_sources_admin_all" on psych_sources
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Drugs: only published status visible to students; admins manage all.
create policy "psych_drugs_select_published_or_admin" on psych_drugs
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "psych_drugs_admin_all" on psych_drugs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- drug_fields: students read PUBLISHED rows only, and never the snippet column.
-- Column-level grant: revoke snippet from anon/authenticated entirely.
-- NOTE: use the combined-privilege form — a per-privilege REVOKE does NOT stick
-- in Supabase once a table-level grant exists (verified 2026-08-03).
revoke select, insert, update, references (snippet) on psych_drug_fields from anon, authenticated;
create policy "psych_drug_fields_select_published_or_admin" on psych_drug_fields
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "psych_drug_fields_admin_all" on psych_drug_fields
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- dose_ranges: published only for students.
create policy "psych_dose_ranges_select_published_or_admin" on psych_dose_ranges
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "psych_dose_ranges_admin_all" on psych_dose_ranges
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- dose_bands: published only for students.
create policy "psych_dose_bands_select_published_or_admin" on psych_dose_bands
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "psych_dose_bands_admin_all" on psych_dose_bands
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- conditions: reference content, read-only.
create policy "psych_conditions_select_all" on psych_conditions
  for select to anon, authenticated using (true);
create policy "psych_conditions_admin_all" on psych_conditions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- comorbidity_notes: published only for students.
create policy "psych_comorbidity_notes_select_pub_or_admin" on psych_comorbidity_notes
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "psych_comorbidity_notes_admin_all" on psych_comorbidity_notes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- observation_prompts: published only for students.
create policy "psych_observation_prompts_select_pub_or_admin" on psych_observation_prompts
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "psych_observation_prompts_admin_all" on psych_observation_prompts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- mechanism_tags: read-only reference.
create policy "psych_mechanism_tags_select_all" on psych_mechanism_tags
  for select to authenticated using (true);
create policy "psych_mechanism_tags_admin_all" on psych_mechanism_tags
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- drug_links: published only for students.
create policy "psych_drug_links_select_published_or_admin" on psych_drug_links
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "psych_drug_links_admin_all" on psych_drug_links
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- acknowledgements: users read/write their own row.
create policy "psych_ack_select_own" on psych_user_acknowledgements
  for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "psych_ack_insert_own" on psych_user_acknowledgements
  for insert to authenticated with check (auth.uid() = user_id);

-- Indexes for the search + lookups.
create index if not exists idx_psych_drugs_generic on psych_drugs (generic_name);
create index if not exists idx_psych_drug_fields_drug on psych_drug_fields (drug_id, status);
create index if not exists idx_psych_dose_bands_drug on psych_dose_bands (drug_id, band_order);
create index if not exists idx_psych_drug_links_a on psych_drug_links (drug_a);
create index if not exists idx_psych_comorbidity_drug on psych_comorbidity_notes (drug_id, status);

-- =============================================================================
-- Phase 2 — Clinical Observation & Psychology Intelligence Layer
--
-- An ADDITION to the safety architecture, never a weakening. Same lifecycle,
-- same verification model (draft -> in_review -> verified -> published), same
-- RLS (students read published only), same provenance rules.
--
-- Content rules enforced here and in the app:
--   - Observation language is "may contribute to…", NEVER "causes".
--   - No prescribing / dosage / no diagnosis. Educational observation only.
--   - Every row carries source + page + reviewer signature before publishing.
-- =============================================================================

-- Observational language is held to "may contribute" phrasing. Rows cannot be
-- published if they assert causation. Enforced by CHECK on publish + by the
-- forbidden-phrase lint over student-visible text.
create table if not exists psych_session_observations (
  id uuid primary key default gen_random_uuid(),
  drug_id uuid not null references psych_drugs (id) on delete cascade,
  dose_band_id uuid references psych_dose_bands (id) on delete cascade, -- nullable = drug-level
  observation text not null,          -- e.g. "Client may appear emotionally flatter."
  confidence text not null default 'possible' check (confidence in ('possible','probable','reported','anecdotal')),
  dose_dependence text,               -- 'increases_with_dose','present_at_low_dose', or a plain note
  rationale text not null,            -- why this observation matters to a therapist/observer
  source_id uuid references psych_sources (id),
  page_ref text,
  snippet text,                       -- reviewer-only verbatim
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  verified_by uuid references profiles (id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
alter table psych_session_observations enable row level security;
create policy "psych_session_obs_select_pub_or_admin" on psych_session_observations
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "psych_session_obs_admin_all" on psych_session_observations
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Observer question catalog (therapist question assistant) ----------
create table if not exists psych_therapist_questions (
  id uuid primary key default gen_random_uuid(),
  drug_id uuid references psych_drugs (id) on delete cascade,        -- null = generic
  dose_band_id uuid references psych_dose_bands (id) on delete cascade,
  category text not null check (category in (
    'mood','sleep','energy','movement','memory','appetite','sexual_functioning',
    'attention','motivation','anxiety','social_functioning'
  )),
  question text not null,             -- open, non-assuming, client-facing
  explores text not null,             -- what the question is designed to explore
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  verified_by uuid references profiles (id) on delete set null,
  verified_at timestamptz,
  source_id uuid references psych_sources (id),
  created_at timestamptz not null default now()
);
alter table psych_therapist_questions enable row level security;
create policy "psych_tq_select_pub_or_admin" on psych_therapist_questions
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "psych_tq_admin_all" on psych_therapist_questions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Medication timeline (Part 3) — education-only, no instructions ----------
create table if not exists psych_med_timeline (
  id uuid primary key default gen_random_uuid(),
  drug_id uuid not null references psych_drugs (id) on delete cascade,
  band_order integer not null default 0,          -- "started" -> early changes -> adaptation -> long-term
  stage_label text not null,
  stage_desc text not null,  -- educational, observational
  stage_type text not null check (stage_type in ('start','early','adaptation','long_term','common_observations')),
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  verified_by uuid references profiles (id) on delete set null,
  verified_at timestamptz,
  source_id uuid references psych_sources (id),
  created_at timestamptz not null default now()
);
alter table psych_med_timeline enable row level security;
create policy "psych_timeline_select_pub_or_admin" on psych_med_timeline
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "psych_timeline_admin_all" on psych_med_timeline
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Observation checklist (Part 4) ----------
create table if not exists psych_observation_checklist (
  id uuid primary key default gen_random_uuid(),
  drug_id uuid not null references psych_drugs (id) on delete cascade,
  band_id uuid references psych_dose_bands (id) on delete cascade,
  item text not null,               -- "Eye contact", "Speech speed", ...
  item_category text,               -- behavioural grouping
  explanation text not null,        -- opens on tap: what to look for / what it may mean
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  verified_by uuid references profiles (id) on delete set null,
  verified_at timestamptz,
  source_id uuid references psych_sources (id)
);
create table if not exists psych_case_format_notes -- Part 6
(
  id uuid primary key default gen_random_uuid(),
  drug_id uuid not null references psych_drugs (id) on delete cascade,
  band_id uuid references psych_dose_bands (id) on delete cascade,
  note text not null,            -- "When building a case formulation, consider whether this observation could also be influenced by medication."
  example text,
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  verified_by uuid references profiles (id) on delete set null,
  verified_at timestamptz,
  source_id uuid references psych_sources (id),
  created_at timestamptz not null default now()
);
-- ---------- Part 8 therapy planning ----------
create table if not exists psych_therapy_planning (
  id uuid primary key default gen_random_uuid(),
  therapy_type text not null check (therapy_type in ('exposure','cbt','dbt','trauma','counselling')),
  drug_id uuid not null references psych_drugs (id) on delete cascade,
  consideration text not null,      -- exists only from "may" language
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  verified_by uuid references profiles (id) on delete set null,
  verified_at timestamptz,
  source_id uuid references psych_sources (id),
  created_at timestamptz not null default now()
);
-- ---------- Part 9 red flag recognition -------------------

create table if not exists psych_red_flags (
  id uuid primary key default gen_random_uuid(),
  drug_id uuid not null references psych_drugs (id) on delete cascade,
  signal text not null,            -- "Sudden severe restlessness"
  guidance text not null,          -- "If these changes are reported, encourage the client to discuss with their prescribing clinician."
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  verified_by uuid references profiles (id) on delete set null,
  verified_at timestamptz,
  source_id uuid references psych_sources (id),
  created_at timestamptz not null default now()
);
-- ---------- learning mode (part10) ---------------------------
create table if not exists psych_case_vignettes (
  id uuid primary key default gen_random_uuid(),
  drug_id uuid not null references psych_drugs (id) on delete cascade,
  dose_band_id uuid references psych_dose_bands (id) on delete cascade,
  scenario text not null,           -- clinical presentation (illustrative)
  expected_observations jsonb not null default '[]',  -- evidence-backed
  explanation text not null,
  is_illustrative boolean not null default true,
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  verified_by uuid references profiles (id) on delete set null,
  verified_at timestamptz,
  source_id uuid references psych_sources (id),
  created_at timestamptz not null default now()
);
-- ---------- clinical pearls (Part 11) ----------
create table if not exists psych_clinical_pearls (
  id uuid primary key default gen_random_uuid(),
  drug_id uuid not null references psych_drugs (id) on delete cascade,
  pearl text not null,
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  verified_by uuid references profiles (id) on delete set null,
  verified_at timestamptz,
  source_id uuid references psych_sources (id),
  created_at timestamptz not null default now()
);

-- --- Phase 2 tables MUST obey the same publish-requires-source+verifier rule ---
alter table psych_session_observations
  drop constraint if exists psych_session_obs_pub_requires_source;
alter table psych_session_observations
  add constraint psych_session_obs_pub_requires_source check (
    status <> 'published' or (source_id is not null and page_ref is not null and verified_by is not null and verified_at is not null)
  );
alter table psych_therapist_questions
  add constraint psych_tq_pub_requires_source check (
    status <> 'published' or (source_id is not null and verified_by is not null and verified_at is not null)
  );
alter table psych_med_timeline
  add constraint psych_timeline_pub_requires_source check (
    status <> 'published' or (source_id is not null and verified_by is not null and verified_at is not null)
  );
alter table psych_observation_checklist
  add constraint psych_checklist_pub_requires_source check (
    status <> 'published' or (source_id is not null and verified_by is not null and verified_at is not null)
  );
alter table psych_case_format_notes
  add constraint psych_cf_pub_requires_source check (
    status <> 'published' or (source_id is not null and verified_by is not null and verified_at is not null)
  );
alter table psych_therapy_planning
  add constraint psych_tp_pub_requires_source check (
    status <> 'published' or (source_id is not null and verified_by is not null and verified_at is not null)
  );
alter table psych_red_flags
  add constraint psych_rf_pub_requires_source check (
    status <> 'published' or (source_id is not null and verified_by is not null and verified_at is not null)
  );
alter table psych_case_vignettes
  add constraint psych_cv_pub_requires_source check (
    status <> 'published' or (source_id is not null and verified_by is not null and verified_at is not null)
  );
alter table psych_clinical_pearls
  add constraint psych_pearls_pub_requires_source check (
    status <> 'published' or (source_id is not null and verified_by is not null and verified_at is not null)
  );

-- Enable RLS on every Phase 2 table.
alter table psych_session_observations enable row level security;
alter table psych_therapist_questions enable row level security;
alter table psych_med_timeline enable row level security;
alter table psych_observation_checklist enable row level security;
alter table psych_case_format_notes enable row level security;
alter table psych_therapy_planning enable row level security;
alter table psych_red_flags enable row level security;
alter table psych_case_vignettes enable row level security;
alter table psych_clinical_pearls enable row level security;

-- Phase 2 RLS policies (published-only for students; admins manage all).
create policy "psych_checklist_select_pub_or_admin" on psych_observation_checklist
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "psych_checklist_admin_all" on psych_observation_checklist
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "psych_cf_select_pub_or_admin" on psych_case_format_notes
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "psych_cf_admin_all" on psych_case_format_notes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "psych_tp_select_pub_or_admin" on psych_therapy_planning
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "psych_tp_admin_all" on psych_therapy_planning
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "psych_rf_select_pub_or_admin" on psych_red_flags
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "psych_rf_admin_all" on psych_red_flags
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "psych_cv_select_pub_or_admin" on psych_case_vignettes
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "psych_cv_admin_all" on psych_case_vignettes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "psych_pearls_select_pub_or_admin" on psych_clinical_pearls
  for select to authenticated using (status = 'published' or public.is_admin());
create policy "psych_pearls_admin_all" on psych_clinical_pearls
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Phase 2 indexes.
create index if not exists idx_psych_obs_drug on psych_session_observations (drug_id, status);

-- Phase 2 tables that carry a reviewer-only `snippet` column: students never
-- read it. Combined-privilege revoke (per-privilege form does not stick once a
-- table-level grant exists in Supabase).
revoke select, insert, update, references (snippet) on psych_session_observations from anon, authenticated;
create index if not exists idx_psych_tq_cat on psych_therapist_questions (category, status);
create index if not exists idx_psych_timeline_drug on psych_med_timeline (drug_id, band_order);
create index if not exists idx_psych_checklist_drug on psych_observation_checklist (drug_id, status);
create index if not exists idx_psych_rf_drug on psych_red_flags (drug_id, status);
create index if not exists idx_psych_vignettes_drug on psych_case_vignettes (drug_id, status);
