-- =============================================================================
-- VIBHA Practice Layer — Idioms of Distress (v5 Part 1, §1.2)
-- =============================================================================
-- The 60+ idiom bank. Each row: the phrase, register tags, every plausible
-- meaning (with likelihood + the distinguishing clue), the disambiguating
-- questions that resolve it, the trap (the default misread), and sources.
-- Nichter's idioms-of-distress concept, Kirmayer & Young's seven readings
-- applied per entry. Students are taught one reading; this teaches all.
--
-- Approved entries are student-visible. New entries land approved=false and
-- become visible in the admin queue for review (the standard VIBHA workflow).
-- =============================================================================

create table if not exists public.idioms (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  phrase text not null,
  transliteration text,
  script text,
  register text[] not null default '{}',
  possible_meanings jsonb not null default '[]'::jsonb,
  disambiguators jsonb not null default '[]'::jsonb,
  trap text not null,
  sources text[] not null default '{}',
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_idioms_approved on public.idioms (approved);
create index if not exists idx_idioms_register on public.idioms using gin (register);

-- RLS
alter table public.idioms enable row level security;

-- Approved idioms are student-visible (the practice tools consume them).
-- Faculty sees all (approved or not) so the admin queue is meaningful.
create policy "idioms_select_approved_or_admin" on public.idioms
  for select using (approved = true or public.is_admin());

-- Admin manages the bank.
create policy "idioms_admin_manage" on public.idioms
  for all using (public.is_admin()) with check (public.is_admin());
