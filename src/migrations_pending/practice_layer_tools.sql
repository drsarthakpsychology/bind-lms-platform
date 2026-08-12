-- =============================================================================
-- Lumen Practice Layer — SCT Arena, Formulation Forge, MSE Trainer, OSCE
-- =============================================================================

-- ---------------------------------------------------------------------------
-- SCT (Script Concordance Test) — Part 6.3
-- Scoring is against an expert PANEL, not a key. sct_expert_responses is
-- admin-only RLS — if a student can read panel answers the instrument is
-- worthless. Tested explicitly.
-- ---------------------------------------------------------------------------
create table if not exists public.sct_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  vignette text not null,
  hypothesis text not null,
  new_information text not null,
  response_scale text not null default '5' check (response_scale in ('5','7')),
  difficulty text not null default 'medium',
  topic text,
  status text not null default 'draft'
    check (status in ('draft','in_review','published')),
  approved boolean not null default false,
  approved_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.sct_panel_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  user_id uuid not null references public.profiles (id) on delete cascade,
  invite_token text unique,
  name text,
  status text not null default 'invited' check (status in ('invited','active')),
  created_at timestamptz not null default now()
);

-- ADMIN-ONLY. Students must never read this.
create table if not exists public.sct_expert_responses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  item_id uuid not null references public.sct_items (id) on delete cascade,
  panel_member_id uuid references public.sct_panel_members (id) on delete cascade,
  response integer not null check (response between -2 and 2),
  created_at timestamptz not null default now(),
  unique (item_id, panel_member_id)
);

create table if not exists public.sct_attempts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  item_id uuid not null references public.sct_items (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  response integer not null check (response between -2 and 2),
  seconds_spent integer,
  scored numeric, -- panel-based score 0..1
  created_at timestamptz not null default now(),
  unique (item_id, user_id)
);

-- ---------------------------------------------------------------------------
-- Formulation Forge — Part 6.2
-- ---------------------------------------------------------------------------
create table if not exists public.formulation_cases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  title text not null,
  prompt text not null,
  factors jsonb not null default '[]'::jsonb,
  distractors jsonb not null default '[]'::jsonb,
  model_answer jsonb not null default '{}'::jsonb, -- Dr. Sarthak's model
  source_sim_session_id uuid references public.sim_sessions (id) on delete set null,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now()
);

create table if not exists public.formulation_attempts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  case_id uuid not null references public.formulation_cases (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  sorted_factors jsonb not null default '[]'::jsonb,
  narrative text,
  diff jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- MSE Trainer — Part 6.4
-- ---------------------------------------------------------------------------
create table if not exists public.mse_stimuli (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  content text not null,
  medium text not null default 'text' check (medium in ('text','audio','video','image')),
  storage_path text,
  domain text not null,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now()
);

create table if not exists public.mse_expert_codings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  stimulus_id uuid not null references public.mse_stimuli (id) on delete cascade,
  tag text not null,
  confidence text not null default 'expert' check (confidence in ('expert','disputed')),
  created_at timestamptz not null default now()
);

create table if not exists public.mse_attempts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  stimulus_id uuid not null references public.mse_stimuli (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  tags jsonb not null default '[]'::jsonb,
  score numeric,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- OSCE Stations — Part 6.12
-- ---------------------------------------------------------------------------
create table if not exists public.osce_stations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  title text not null,
  task text not null,
  duration_seconds integer not null default 420, -- 7 minutes
  checklist jsonb not null default '[]'::jsonb,
  global_rating jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now()
);

create table if not exists public.osce_attempts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  station_id uuid not null references public.osce_stations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  transcript jsonb not null default '[]'::jsonb,
  scores jsonb not null default '{}'::jsonb,
  global_rating numeric,
  mode text not null default 'text' check (mode in ('text','voice')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- RLS
-- =============================================================================
alter table public.sct_items enable row level security;
alter table public.sct_panel_members enable row level security;
alter table public.sct_expert_responses enable row level security;
alter table public.sct_attempts enable row level security;
alter table public.formulation_cases enable row level security;
alter table public.formulation_attempts enable row level security;
alter table public.mse_stimuli enable row level security;
alter table public.mse_expert_codings enable row level security;
alter table public.mse_attempts enable row level security;
alter table public.osce_stations enable row level security;
alter table public.osce_attempts enable row level security;

-- Published SCT items visible to all; admin manages.
create policy "sct_items_select_published" on public.sct_items
  for select using (status = 'published' and approved = true or public.is_admin());
create policy "sct_items_admin_manage" on public.sct_items
  for all using (public.is_admin()) with check (public.is_admin());

-- Panel members self-visible; admin manages.
create policy "sct_panel_select_own_or_admin" on public.sct_panel_members
  for select using (auth.uid() = user_id or public.is_admin());
create policy "sct_panel_admin_manage" on public.sct_panel_members
  for all using (public.is_admin()) with check (public.is_admin());

-- EXPERT RESPONSES — admin-only, always. No student read path.
create policy "sct_expert_admin_all" on public.sct_expert_responses
  for all using (public.is_admin()) with check (public.is_admin());

-- Attempts: owner + admin.
create policy "sct_attempts_select_own_or_admin" on public.sct_attempts
  for select using (auth.uid() = user_id or public.is_admin());
create policy "sct_attempts_insert_own" on public.sct_attempts
  for insert with check (auth.uid() = user_id);

-- Formulation cases published-visible; attempts owner + admin.
create policy "formulation_cases_select_published" on public.formulation_cases
  for select using (status = 'published' or public.is_admin());
create policy "formulation_cases_admin_manage" on public.formulation_cases
  for all using (public.is_admin()) with check (public.is_admin());
create policy "formulation_attempts_select_own_or_admin" on public.formulation_attempts
  for select using (auth.uid() = user_id or public.is_admin());
create policy "formulation_attempts_insert_own" on public.formulation_attempts
  for insert with check (auth.uid() = user_id);

-- MSE published stimuli visible; attempts owner + admin.
create policy "mse_stimuli_select_published" on public.mse_stimuli
  for select using (status = 'published' or public.is_admin());
create policy "mse_stimuli_admin_manage" on public.mse_stimuli
  for all using (public.is_admin()) with check (public.is_admin());
create policy "mse_codings_admin_all" on public.mse_expert_codings
  for all using (public.is_admin()) with check (public.is_admin());
create policy "mse_attempts_select_own_or_admin" on public.mse_attempts
  for select using (auth.uid() = user_id or public.is_admin());
create policy "mse_attempts_insert_own" on public.mse_attempts
  for insert with check (auth.uid() = user_id);

-- OSCE stations published-visible; attempts owner + admin.
create policy "osce_stations_select_published" on public.osce_stations
  for select using (status = 'published' or public.is_admin());
create policy "osce_stations_admin_manage" on public.osce_stations
  for all using (public.is_admin()) with check (public.is_admin());
create policy "osce_attempts_select_own_or_admin" on public.osce_attempts
  for select using (auth.uid() = user_id or public.is_admin());
create policy "osce_attempts_insert_own" on public.osce_attempts
  for insert with check (auth.uid() = user_id);

-- indexes
create index if not exists idx_sct_attempts_user on public.sct_attempts (user_id);
create index if not exists idx_formulation_attempts_user on public.formulation_attempts (user_id);
create index if not exists idx_mse_attempts_user on public.mse_attempts (user_id);
create index if not exists idx_osce_attempts_user on public.osce_attempts (user_id);

-- ---------------------------------------------------------------------------
-- Formulation peer-critique wall (IDEAS: Formulation Wall) — anonymised
-- narratives from Formulation Forge stage 4, visible to the cohort with
-- reactions. author_id is stored but the SELECT policy nulls it for
-- non-admins (same pattern as the wall's anonymity views).
-- ---------------------------------------------------------------------------
create table if not exists public.formulation_wall_posts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  author_id uuid not null references public.profiles (id) on delete cascade,
  narrative text not null,
  case_title text not null default 'Sim session',
  created_at timestamptz not null default now()
);

alter table public.formulation_wall_posts enable row level security;
create policy "formulation_wall_select_visible" on public.formulation_wall_posts
  for select using (true);
create policy "formulation_wall_insert_own" on public.formulation_wall_posts
  for insert with check (auth.uid() = author_id);
create policy "formulation_wall_admin_manage" on public.formulation_wall_posts
  for all using (public.is_admin()) with check (public.is_admin());

-- Anonymous view: author_id nulled for everyone (the wall is anonymous by
-- design — the critique, not the author, is the content).
create or replace view public.formulation_wall_visible
with (security_invoker = true) as
select
  id, organization_id, narrative, case_title, created_at,
  null::uuid as author_id
from public.formulation_wall_posts;
