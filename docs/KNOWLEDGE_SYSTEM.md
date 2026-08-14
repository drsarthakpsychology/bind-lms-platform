# VIBHA Psychology Knowledge System

A persistent, retrievable knowledge layer over the authorized psychology book
corpus. The books are **not** fed to a model for memorisation; they are
ingested once, chunked into source-traceable passages, embedded, and retrieved
on demand by every AI surface. The underlying model stays a general reasoning
engine; the corpus is the knowledge it reliably accesses.

```
BOOKS (psy-books, 10 PDFs)
   │  pdftotext → per-page text cache  (scripts/psychopharm/text/<id>.txt)
   ▼
READING AGENTS  (10 parallel)  →  structural outlines  (scripts/knowledge/outlines/<id>.json)
   │                            book → chapter → section → PDF page
   ▼
INGEST (scripts/knowledge/ingest.ts)   [resumable, idempotent]
   │  · corpus_sources   (book metadata, sha256 of PDF)
   │  · corpus_documents (per-book, preview text; full text in R2)
   │  · corpus_chunks    (hierarchical passages, halfvec(384) embeddings)
   │  · R2               (original PDFs + full text, knowledge/books/<id>/…)
   ▼
RETRIEVAL (src/lib/knowledge/retrieve.ts)
   │  hybrid: MiniLM vector (RPC match_corpus_chunks) + pg_trgm keyword + RRF rerank
   ▼
AI SURFACES (tutor, psychopharm, quizzes, patient sim, revision…)
```

## Architecture decisions

### 1. The books are data, not model weights
No fine-tuning. The corpus is chunked and embedded; retrieval builds focused
context per question. This gives source attribution, cheaper inference, easier
updates, and zero risk of degrading the general model. (Per the build brief.)

### 2. Storage split
- **R2** (large, unstructured): original PDFs + full extracted text →
  `knowledge/books/<id>/original.pdf`, `knowledge/books/<id>/text.txt`.
- **Supabase** (structured, queryable): `corpus_sources` (books),
  `corpus_documents` (per-book records), `corpus_chunks` (passages +
  halfvec(384) embeddings). `content` holds only a preview — the corpus is
  *not* duplicated into Postgres (`corpus_docs_content_cap` is respected).

### 3. Source traceability
Every chunk carries `book → chapter → section → page_start → page_end`.
Page numbers are **PDF page indexes** from the `<<<PAGE n>>>` extraction
markers — never fabricated printed page numbers. The reading agents verified
each boundary against the actual page text.

### 4. Self-hosted embeddings (zero cost)
`all-MiniLM-L6-v2` (Apache-2.0, 384-dim) runs on-device via transformers.js
(`src/lib/knowledge/embed-local.ts`). Matches the `halfvec(384)` schema
exactly. Model downloads once (~25 MB), then runs locally — no API key, no
per-embedding cost, works offline after first load.

### 5. Hybrid retrieval
`searchKnowledge()` (src/lib/knowledge/retrieve.ts):
- **Vector lane** — query embedded with the same MiniLM model → `match_corpus_chunks`
  RPC (pgvector cosine over HNSW halfvec(384) index).
- **Keyword lane** — pg_trgm word-similarity on `chunk_text` (catches exact
  drug/condition names that embeddings miss; works even before embeddings are
  populated).
- **Rerank** — reciprocal-rank fusion of both lanes.
- Graceful degradation: any lane error → the other lane, never a 500.

## Schema (migration `src/migrations_pending/knowledge_layer.sql`)

| Table | Role |
|---|---|
| `corpus_sources` | one row per book: title, authors, edition, year, publisher, book_type, local_path, page_count, PDF hash |
| `corpus_documents` | one per book: content hash, R2 raw_path, preview content, classification |
| `corpus_chunks` | hierarchical passages: chapter, section, page_start/end, chunk_hash, `embedding halfvec(384)` |
| `match_corpus_chunks()` | SECURITY DEFINER RPC — vector similarity, bounded, name-filterable |

RLS: corpus tables stay admin-only; retrieval is a deliberate server-side
surface via the service-role admin client.

## Commands

```bash
npm run knowledge:ingest            # register + documents + chunks (resumable)
npm run knowledge:ingest -- --embed # + embed unembedded chunks (MiniLM)
```

The pipeline is idempotent: unchanged content hashes are skipped, so re-runs
only process what changed. If it stops mid-corpus, the next run continues.

## Retrieval API

`GET /api/knowledge/search?q=<question>` (requireSession, rate-limited):

```jsonc
{
  "query": "explain the difference between bipolar I and II",
  "count": 8,
  "hits": [{
    "text": "…the manic episode in bipolar I…",
    "sourceName": "kaplan_sadock",
    "sourceTitle": "Kaplan and Sadock's Synopsis of Psychiatry",
    "chapter": "Chapter 15: Mood Disorders",
    "section": "Bipolar Disorders",
    "pageStart": 203, "pageEnd": 204,
    "citation": "Kaplan and Sadock's Synopsis of Psychiatry, Chapter 15: Mood Disorders, pp. 203–204"
  }]
}
```

Consumers: Psychology Tutor, psychopharmacology answers, quiz/case generation,
patient-simulation context, revision assistant, clinical-reasoning sims.

## Source hierarchy

Books are the primary knowledge source. Where they conflict, the system
preserves attribution (each hit names its book/chapter/page) rather than
flattening disagreement into one "truth". External material, when used, is kept
distinct from book-derived knowledge.

## Cost

- Embeddings: **$0** (self-hosted MiniLM).
- Ingestion processing: **$0** (deterministic; no model calls during chunking).
- Optional future enrichment (V4 Flash for concept extraction) is the only
  model cost, and only if evaluation shows it helps.
