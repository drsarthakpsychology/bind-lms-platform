-- =============================================================================
-- psychopharm KMS — medication documents + versioning + roles
--
-- Phase A of the enterprise drug-review CMS. Adds the single-source-of-truth
-- page document, immutable version history, and an app-role model that augments
-- the core profiles.role (admin|student) without altering it.
--
-- Existing psych_* tables remain as the audit/trace layer; the document JSONB is
-- the source of truth for render and publish.
-- =============================================================================

-- App roles: a per-user override over profiles.role, allowing reviewer/editor
-- without touching the core profiles schema.
create table if not exists app_roles (
  user_id uuid primary key references profiles (id) on delete cascade,
  role text not null check (role in ('admin','reviewer','editor','student')),
  updated_at timestamptz not null default now()
);

-- Effective role: profiles.role for admin/student; app_roles override if set.
create or replace function public.app_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select ar.role from app_roles ar where ar.user_id = auth.uid()),
    (select p.role from profiles p where p.id = auth.uid()),
    'student'
  );
$$;

-- The medication page document — one row per drug, the whole page as typed blocks.
create table if not exists medication_documents (
  id uuid primary key default gen_random_uuid(),
  drug_id uuid not null unique references psych_drugs (id) on delete cascade,
  document jsonb not null default '{}',  -- typed blocks: { sections: [...] }
  status text not null default 'draft' check (status in ('draft','in_review','verified','published')),
  version integer not null default 1,
  published_version integer,
  reviewer uuid references profiles (id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Immutable version history — one row per save/publish.
create table if not exists medication_document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references medication_documents (id) on delete cascade,
  version integer not null,
  content jsonb not null,
  delta jsonb not null default '{}',
  editor uuid references profiles (id) on delete set null,
  reason text,
  changed_fields text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (document_id, version)
);

-- A published document must have a reviewer + verified_at + a published version.
alter table medication_documents
  drop constraint if exists medication_documents_published_requires_reviewer;
alter table medication_documents
  add constraint medication_documents_published_requires_reviewer check (
    status <> 'published' or (reviewer is not null and verified_at is not null and published_version is not null)
  );

-- Bump updated_at on any change.
create or replace function medication_documents_touch()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists medication_documents_touch on medication_documents;
create trigger medication_documents_touch
  before update on medication_documents
  for each row execute function medication_documents_touch();

-- Editing a published document pulls it back to in_review (no silent edits).
create or replace function medication_documents_demote()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if TG_OP = 'UPDATE' and OLD.status = 'published'
     and new.status is distinct from 'in_review'
     and new.document is distinct from old.document then
    new.status := 'in_review';
    new.reviewer := null;
    new.verified_at := null;
  end if;
  return new;
end;
$$;
drop trigger if exists medication_documents_demote on medication_documents;
create trigger medication_documents_demote
  before update on medication_documents
  for each row execute function medication_documents_demote();

-- RLS: students read published only; editors/reviewers/admins manage.
alter table medication_documents enable row level security;
alter table medication_document_versions enable row level security;
alter table app_roles enable row level security;

create policy "med_docs_select_published_or_editor" on medication_documents
  for select to authenticated using (
    status = 'published' or public.app_role() in ('admin','reviewer','editor')
  );
create policy "med_docs_write_editor_reviewer_admin" on medication_documents
  for all to authenticated using (public.app_role() in ('admin','reviewer','editor'))
  with check (public.app_role() in ('admin','reviewer','editor'));

create policy "med_versions_select_editor_reviewer_admin" on medication_document_versions
  for select to authenticated using (public.app_role() in ('admin','reviewer','editor'));
create policy "med_versions_write_editor_reviewer_admin" on medication_document_versions
  for insert to authenticated with check (public.app_role() in ('admin','reviewer','editor'));

create policy "app_roles_select_own_or_admin" on app_roles
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "app_roles_admin_all" on app_roles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
