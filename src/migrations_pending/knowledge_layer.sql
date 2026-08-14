-- =============================================================================
-- knowledge_layer.sql — persistent psychology knowledge system (book corpus)
-- -----------------------------------------------------------------------------
-- Additive + idempotent. Extends the existing corpus_* tables (built in
-- practice_layer_rest.sql, live but empty) into a hierarchical, source-
-- traceable knowledge store:
--
--   corpus_sources    — one row per book (10 authorized PDFs in psy-books)
--   corpus_documents  — one row per book: full extracted text + content hash
--   corpus_chunks     — hierarchical passages (book→chapter→section→page)
--                       with halfvec(384) embeddings for semantic retrieval
--
-- Also adds pg_trgm (keyword lane for hybrid search) and a vector-match RPC
-- used by the server-side retrieval layer. No existing data is touched.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. corpus_sources — book metadata (title/authors/edition/year/publisher)
-- ---------------------------------------------------------------------------
alter table public.corpus_sources
  add column if not exists title text,
  add column if not exists authors text,
  add column if not exists edition text,
  add column if not exists year integer,
  add column if not exists publisher text,
  add column if not exists book_type text,          -- pharmacology | clinical_psychology | reference
  add column if not exists local_path text,          -- source PDF path on disk
  add column if not exists page_count integer,
  add column if not exists hash text;                -- sha256 of the source PDF

create unique index if not exists corpus_sources_name_key on public.corpus_sources (name);

-- ---------------------------------------------------------------------------
-- 2. corpus_chunks — hierarchical traceability columns
--    (book→chapter→section→page_start→page_end→chunk index)
-- ---------------------------------------------------------------------------
alter table public.corpus_chunks
  add column if not exists chapter text,
  add column if not exists section text,
  add column if not exists page_start integer,
  add column if not exists page_end integer,
  add column if not exists chunk_index integer,
  add column if not exists chunk_hash text;          -- sha256 of chunk_text (idempotent re-ingest)

create index if not exists idx_corpus_chunks_doc on public.corpus_chunks (document_id);
create index if not exists idx_corpus_chunks_chapter on public.corpus_chunks (chapter);

-- ---------------------------------------------------------------------------
-- 3. pg_trgm — trigram keyword lane for hybrid search
-- ---------------------------------------------------------------------------
create extension if not exists pg_trgm;

create index if not exists idx_corpus_chunks_trgm on public.corpus_chunks
  using gin (chunk_text gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- 4. match_corpus_chunks — vector similarity RPC (pgvector standard pattern)
--    Server-side retrieval only. Returns vetted chunk text + source metadata,
--    bounded by match_count. Base tables stay RLS admin-only; this is the
--    deliberate, bounded retrieval surface for the knowledge layer.
-- ---------------------------------------------------------------------------
create or replace function public.match_corpus_chunks(
  query_embedding halfvec(384),
  match_count int default 8,
  filter_source_name text default null,
  filter_concept text default null
)
returns table (
  id uuid,
  document_id uuid,
  chunk_text text,
  chapter text,
  section text,
  page_start int,
  page_end int,
  similarity float,
  source_id uuid,
  source_name text,
  source_title text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    c.id,
    c.document_id,
    c.chunk_text,
    c.chapter,
    c.section,
    c.page_start,
    c.page_end,
    1 - (c.embedding <=> query_embedding) as similarity,
    d.source_id,
    s.name as source_name,
    s.title as source_title
  from public.corpus_chunks c
  join public.corpus_documents d on d.id = c.document_id
  join public.corpus_sources s on s.id = d.source_id
  where c.embedding is not null
    and (filter_source_name is null or s.name = filter_source_name)
    and (filter_concept is null or exists (
      select 1 from public.knowledge_chunk_concepts kcc
      join public.knowledge_concepts kc on kc.id = kcc.concept_id
      where kcc.chunk_id = c.id and kc.name = filter_concept
    ))
  order by c.embedding <=> query_embedding
  limit match_count;
end;
$$;

revoke all on function public.match_corpus_chunks from public, anon;
grant execute on function public.match_corpus_chunks to authenticated;
