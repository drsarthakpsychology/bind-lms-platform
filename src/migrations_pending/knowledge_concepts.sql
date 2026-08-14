-- =============================================================================
-- knowledge_concepts.sql — concept layer for the knowledge system
-- -----------------------------------------------------------------------------
-- Additive + idempotent. Turns the flat chunk corpus into a concept-tagged
-- knowledge graph foundation:
--
--   knowledge_concepts        — one row per concept (drug, disorder, term)
--   knowledge_chunk_concepts  — many-to-many: which concepts each chunk carries
--
-- Extraction is deterministic (lexicon-based, $0, offline) — see
-- scripts/knowledge/extract-concepts.ts. An optional V4-Flash lane can deepen
-- extraction when a no-train provider key is set (documented, not required).
-- =============================================================================

create table if not exists public.knowledge_concepts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  name text not null,               -- canonical display name, e.g. "Clozapine"
  concept_type text not null
    check (concept_type in ('drug', 'disorder', 'term')),
  aliases jsonb not null default '[]'::jsonb,  -- brand names / synonyms
  source_id uuid references public.corpus_sources (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (name, concept_type)
);

create table if not exists public.knowledge_chunk_concepts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  chunk_id uuid not null references public.corpus_chunks (id) on delete cascade,
  concept_id uuid not null references public.knowledge_concepts (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (chunk_id, concept_id)
);

alter table public.knowledge_concepts enable row level security;
alter table public.knowledge_chunk_concepts enable row level security;

create policy "knowledge_concepts_admin_manage" on public.knowledge_concepts
  for all to public using (is_admin()) with check (is_admin());
create policy "knowledge_chunk_concepts_admin_manage" on public.knowledge_chunk_concepts
  for all to public using (is_admin()) with check (is_admin());

create index if not exists idx_chunk_concepts_concept on public.knowledge_chunk_concepts (concept_id);
create index if not exists idx_chunk_concepts_chunk on public.knowledge_chunk_concepts (chunk_id);
create index if not exists idx_concepts_type on public.knowledge_concepts (concept_type);
