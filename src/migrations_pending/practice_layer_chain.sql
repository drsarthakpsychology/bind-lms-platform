-- =============================================================================
-- Practice Chains + Recurring Patients (v5.2 Casebook)
-- =============================================================================
-- Add follow_up field to sim_cases for multi-session patient arcs.
-- Create practice_chains table for chaining surfaces around one patient.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) Add follow_up to sim_cases (nullable JSONB for follow-up session specs)
-- ---------------------------------------------------------------------------
alter table if exists public.sim_cases
  add column if not exists follow_up jsonb;

-- ---------------------------------------------------------------------------
-- 2) practice_chains — a student's linked journey through surfaces with one patient
-- ---------------------------------------------------------------------------
create table if not exists public.practice_chains (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  user_id uuid not null references public.profiles (id) on delete cascade,
  case_id uuid not null references public.sim_cases (id) on delete cascade,
  session_id uuid references public.sim_sessions (id) on delete set null,
  steps jsonb not null default '[]'::jsonb,  -- [{surface, status, artefact_id, completed_at}]
  current_step int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.practice_chains enable row level security;

create policy "practice_chains_select_own_or_admin" on public.practice_chains
  for select using (auth.uid() = user_id or public.is_admin());

create policy "practice_chains_insert_own" on public.practice_chains
  for insert with check (auth.uid() = user_id);

create policy "practice_chains_update_own_or_admin" on public.practice_chains
  for update using (auth.uid() = user_id or public.is_admin());

-- ---------------------------------------------------------------------------
-- indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_practice_chains_user on public.practice_chains (user_id);
create index if not exists idx_practice_chains_case on public.practice_chains (case_id);
create index if not exists idx_practice_chains_session on public.practice_chains (session_id);

-- ---------------------------------------------------------------------------
-- 3) Add updated_at trigger for practice_chains
-- ---------------------------------------------------------------------------
create or replace function public.update_practice_chains_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_practice_chains_updated_at on public.practice_chains;
create trigger update_practice_chains_updated_at
  before update on public.practice_chains
  for each row execute function public.update_practice_chains_updated_at();