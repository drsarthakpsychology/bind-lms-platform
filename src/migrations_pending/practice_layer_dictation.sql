-- A7 — Dictation as a conversation (v5.1 A7)
-- Dr. Sarthak talks; the interviewer state-machine advances; each dictation
-- becomes a sim_cases draft (source='faculty_dictated', approved=false).
-- The transcript + state persist here so he can resume a case.

create table if not exists public.corpus_dictations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  user_id uuid not null references public.profiles (id) on delete cascade,
  transcript jsonb not null default '[]'::jsonb,
  state jsonb not null default '{}'::jsonb,
  completed boolean not null default false,
  final_title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.corpus_dictations enable row level security;

-- Owner can read and manage their own dictations; admin can read/manage all.
create policy "corpus_dictations_select_own_or_admin"
  on public.corpus_dictations for select
  using (user_id = auth.uid() or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "corpus_dictations_insert_own"
  on public.corpus_dictations for insert
  with check (user_id = auth.uid());

create policy "corpus_dictations_update_own_or_admin"
  on public.corpus_dictations for update
  using (user_id = auth.uid() or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create index if not exists idx_corpus_dictations_user
  on public.corpus_dictations (user_id, created_at desc);