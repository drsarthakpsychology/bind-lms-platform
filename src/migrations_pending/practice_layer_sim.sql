-- =============================================================================
-- Lumen Practice Layer — simulated patient (Consulting Room)
-- =============================================================================
-- Additive DDL + RLS. Every table gets a nullable organization_id so tenancy
-- is POSSIBLE later without a migration (Cohort One is a single org).
-- Nothing auto-publishes: sim_cases have status draft/in_review/published,
-- and only published cases are student-visible.
-- =============================================================================

create extension if not exists vector;

-- ---------------------------------------------------------------------------
-- sim_cases — the structured clinical spec per patient (Part 6.1)
-- JSONB model, NOT prompt text. All content authored or approved, never
-- auto-published to students.
-- ---------------------------------------------------------------------------
create table if not exists public.sim_cases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  title text not null,
  slug text unique,
  difficulty text not null default 'cooperative'
    check (difficulty in ('cooperative','guarded','resistant','crisis')),
  case_data jsonb not null default '{}'::jsonb,
  status text not null default 'draft'
    check (status in ('draft','in_review','published','archived')),
  approved boolean not null default false,
  approved_by uuid references public.profiles (id),
  approved_at timestamptz,
  source text not null default 'hand_built'
    check (source in ('hand_built','ai_generated','faculty_dictated','corpus')),
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- sim_sessions — one student's run of a case
-- ---------------------------------------------------------------------------
create table if not exists public.sim_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  case_id uuid not null references public.sim_cases (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'active'
    check (status in ('active','complete','abandoned')),
  difficulty text not null default 'cooperative',
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  token_estimate integer not null default 0
);

-- ---------------------------------------------------------------------------
-- sim_turns — each exchange, persisted as it completes (drop-safe)
-- ---------------------------------------------------------------------------
create table if not exists public.sim_turns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  session_id uuid not null references public.sim_sessions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('student','patient')),
  content text not null,
  content_type text not null default 'text'
    check (content_type in ('text','voice')),
  created_at timestamptz not null default now()
);

-- Bug 2 regression: a session must never store the same message text twice.
-- (The old shared fixture bank repeated lines across turns AND a client
-- double-send pushed the same reply twice. This makes both impossible.)
alter table public.sim_turns
  add constraint if not exists sim_turns_session_role_content_unique
  unique (session_id, role, content);

-- ---------------------------------------------------------------------------
-- sim_scores — the debrief result, stored once (scored once, never re-run)
-- ---------------------------------------------------------------------------
create table if not exists public.sim_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  session_id uuid not null references public.sim_sessions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  case_id uuid references public.sim_cases (id),
  rubric jsonb not null default '{}'::jsonb,
  overall numeric,
  quotes jsonb not null default '[]'::jsonb,
  missed_disclosures jsonb not null default '[]'::jsonb,
  voice jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- scoring_corrections — every faculty correction is stored and injected as
-- few-shot examples into future scoring calls (the feedback loop, Part 3.4).
-- ---------------------------------------------------------------------------
create table if not exists public.scoring_corrections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  session_id uuid references public.sim_sessions (id) on delete set null,
  corrected_by uuid not null references public.profiles (id),
  original jsonb not null default '{}'::jsonb,
  corrected jsonb not null default '{}'::jsonb,
  note text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- voice_sessions + voice_metrics — voice mode delivery data (Part 5.4)
-- ---------------------------------------------------------------------------
create table if not exists public.voice_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  session_id uuid references public.sim_sessions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  stt_provider text,
  tts_provider text,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists public.voice_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  voice_session_id uuid references public.voice_sessions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  mean_silence_tolerance_s numeric,
  interruption_count integer not null default 0,
  questions_per_minute numeric,
  filler_word_rate numeric,
  longest_patient_stretch_s numeric,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- RLS
-- =============================================================================
alter table public.sim_cases enable row level security;
alter table public.sim_sessions enable row level security;
alter table public.sim_turns enable row level security;
alter table public.sim_scores enable row level security;
alter table public.scoring_corrections enable row level security;
alter table public.voice_sessions enable row level security;
alter table public.voice_metrics enable row level security;

-- sim_cases: published + approved are student-visible; admins see all.
create policy "sim_cases_select_published" on public.sim_cases
  for select using (status = 'published' and approved = true or public.is_admin());

create policy "sim_cases_admin_manage" on public.sim_cases
  for all using (public.is_admin()) with check (public.is_admin());

-- sim_sessions: owner + admin (coursework, students told up front).
create policy "sim_sessions_select_own_or_admin" on public.sim_sessions
  for select using (auth.uid() = user_id or public.is_admin());

create policy "sim_sessions_insert_own" on public.sim_sessions
  for insert with check (auth.uid() = user_id);

create policy "sim_sessions_update_own_or_admin" on public.sim_sessions
  for update using (auth.uid() = user_id or public.is_admin());

-- sim_turns: owner + admin.
create policy "sim_turns_select_own_or_admin" on public.sim_turns
  for select using (auth.uid() = user_id or public.is_admin());

create policy "sim_turns_insert_own" on public.sim_turns
  for insert with check (auth.uid() = user_id);

-- sim_scores: owner + admin.
create policy "sim_scores_select_own_or_admin" on public.sim_scores
  for select using (auth.uid() = user_id or public.is_admin());

create policy "sim_scores_insert_own" on public.sim_scores
  for insert with check (auth.uid() = user_id);

-- scoring_corrections: faculty/admin only — never a student read path.
create policy "scoring_corrections_admin_all" on public.scoring_corrections
  for all using (public.is_admin()) with check (public.is_admin());

-- voice_sessions + metrics: owner + admin.
create policy "voice_sessions_select_own_or_admin" on public.voice_sessions
  for select using (auth.uid() = user_id or public.is_admin());
create policy "voice_sessions_insert_own" on public.voice_sessions
  for insert with check (auth.uid() = user_id);

create policy "voice_metrics_select_own_or_admin" on public.voice_metrics
  for select using (auth.uid() = user_id or public.is_admin());
create policy "voice_metrics_insert_own" on public.voice_metrics
  for insert with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_sim_sessions_user on public.sim_sessions (user_id);
create index if not exists idx_sim_sessions_case on public.sim_sessions (case_id);
create index if not exists idx_sim_turns_session on public.sim_turns (session_id);
create index if not exists idx_sim_scores_session on public.sim_scores (session_id);

-- ---------------------------------------------------------------------------
-- A3 — rubric_dimensions: provisional dims hide their NUMBER from students
-- (qualitative feedback only until a dimension is validated against Dr.
-- Sarthak's calibration scores). Admin-managed.
-- ---------------------------------------------------------------------------
create table if not exists public.rubric_dimensions (
  key text primary key,
  label text not null,
  status text not null default 'provisional'
    check (status in ('provisional','validated')),
  agreement numeric,
  n_scored integer not null default 0
);

alter table public.rubric_dimensions enable row level security;
create policy "rubric_dimensions_admin_all" on public.rubric_dimensions
  for all using (public.is_admin()) with check (public.is_admin());

-- Seed the eight scoring dimensions, all provisional until calibrated.
insert into public.rubric_dimensions (key, label, status) values
  ('open_closed_ratio', 'Question quality (open vs closed)', 'provisional'),
  ('leading_questions', 'Leading questions', 'provisional'),
  ('double_barrelled', 'Double-barrelled questions', 'provisional'),
  ('reflective_statements', 'Reflective statements', 'provisional'),
  ('premature_reassurance', 'Premature reassurance', 'provisional'),
  ('domain_coverage', 'Domain coverage', 'provisional'),
  ('risk_timing', 'Risk assessment timing', 'provisional'),
  ('disclosure_unlock_rate', 'Disclosure unlock rate', 'provisional')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- A3 — calibration_pairs: one row per paired AI-vs-faculty blind score, per
-- dimension. Drives the weighted-kappa agreement dashboard; the running
-- kappa + count live on rubric_dimensions.
-- ---------------------------------------------------------------------------
create table if not exists public.calibration_pairs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  dimension_key text not null references public.rubric_dimensions (key) on delete cascade,
  ai numeric not null,
  human numeric not null,
  created_at timestamptz not null default now()
);

alter table public.calibration_pairs enable row level security;
create policy "calibration_pairs_admin_all" on public.calibration_pairs
  for all using (public.is_admin()) with check (public.is_admin());
create index if not exists idx_calibration_pairs_dim on public.calibration_pairs (dimension_key);
