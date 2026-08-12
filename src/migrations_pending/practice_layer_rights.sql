-- =============================================================================
-- Casebook — rights_registry (the acquisition tracker)
-- =============================================================================
-- Every corpus title Kavya is acquiring. One screen shows where everything
-- stands; flipping rights_status to 'licensed' makes the ingester pick the
-- title up on its next pass (no rebuild). The licence gate is enforced in
-- code: nothing with rights_status in ('pending_licence','not_started',
-- 'unlicensed','acquisition_failed') can reach a student surface.
-- Additive + idempotent.
create table if not exists public.rights_registry (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authors text[],
  publisher text,
  isbn text,
  category text not null default 'narrative'
    check (category in ('interviewing','psychopathology','formulation','culture','india','sleep','anomalous','trauma','addiction','narrative','fiction','transcripts','guideline','reasoning','conversation')),
  layer text not null default 'clinical'
    check (layer in ('clinical','phenomenological','style','cultural','reasoning')),
  priority int not null default 3,  -- 1 = get this first
  rights_status text not null default 'not_started'
    check (rights_status in ('public_domain','open_access','licensed','pending_licence','not_started','unlicensed','acquisition_failed')),
  rights_contact text,
  contact_email text,
  contact_url text,
  ask text,
  cost_quoted numeric,
  cost_paid numeric,
  currency text default 'INR',
  licence_start date,
  licence_end date,
  licence_terms text,
  author_consent boolean default false,
  unlocks text,
  notes text,
  acquired_file text,          -- path/hash of the fetched source if any
  sha256 text,
  retrieved_at timestamptz,
  updated_at timestamptz default now()
);

alter table public.rights_registry enable row level security;
create policy "rights_registry_admin_all" on public.rights_registry
  for all using (public.is_admin()) with check (public.is_admin());
create index if not exists idx_rights_registry_status on public.rights_registry (rights_status);

-- The seed upserts on title — enforce uniqueness (DO-block: Postgres has no
-- ADD CONSTRAINT IF NOT EXISTS).
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'rights_registry_title_key') then
    alter table public.rights_registry add constraint rights_registry_title_key unique (title);
  end if;
end $$;
