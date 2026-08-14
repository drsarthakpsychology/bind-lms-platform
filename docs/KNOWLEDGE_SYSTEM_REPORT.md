# Knowledge System — Build Report (2026-08-14)

The authorised psychology book corpus is now a persistent, retrievable
knowledge layer. This is the brief's §37 final report.

## 1. Knowledge corpus

| Item | Result |
|---|---|
| Files found | 10 authorized PDFs in `/Users/kavyabothra/Desktop/psy-books` |
| Books identified | DSM-5-TR, Kaplan & Sadock's Synopsis (12th), Maudsley Prescribing Guidelines (14th), Stahl's Prescriber's Guide (7th), Stahl's Essential Psychopharmacology (5th), Stahl Prescriber's Guide (3rd/older), Stahl preview, Fish's Clinical Psychopathology (3rd), Ahuja's Short Textbook (20th), ICD-11 Reference Guide |
| Pages processed | ~11,000 PDF pages (Kaplan 3768, Stahl PG 7th 2697, DSM 1377, Maudsley 978, ICD-11 473, Stahl Essential 640, Stahl PG older 588, Ahuja 273, Fish 137, preview 98) |
| Extraction status | 100% text-layer via pdftotext; **0 books need OCR** (88–100% meaningful pages per book) |
| Indexing status | **27,608 chunks, 100% embedded** (halfvec(384), unit-norm, 0 malformed), 0 duplicates |
| Source traceability | every chunk → book → chapter → section → PDF page range (verified by 10 reading agents; page numbers are PDF indexes, never fabricated) |

**Storage:** original PDFs + full extracted text → Cloudflare R2
(`knowledge/books/<id>/original.pdf` + `text.txt`, 20 objects, all verified).
Supabase holds metadata (`corpus_sources`/`corpus_documents`) + retrievable
chunks (`corpus_chunks`), with only a preview in Postgres (respects the 2M
content cap — the corpus is not duplicated into Postgres, per the "keep
knowledge in R2" directive).

## 2. Knowledge system — how books are stored, indexed, retrieved

```
BOOKS → per-page text cache → 10 reading agents → outlines (book/chapter/section/page)
      → ingest (hash-keyed, resumable, idempotent) → corpus_sources/documents/chunks
      → self-hosted MiniLM embeddings (all-MiniLM-L6-v2, 384-dim, $0)
      → hybrid retrieval (vector RPC + pg_trgm keyword + RRF rerank)
```

- **Ingestion** (`npm run knowledge:ingest`): idempotent, content-hash-keyed —
  re-runs only process what changed; safe to interrupt and resume.
- **Embeddings** (`npm run knowledge:embed`): self-hosted, batched, $0, no API
  key; model downloads once (~25 MB) then runs on-device.
- **Retrieval** (`src/lib/knowledge/retrieve.ts`): semantic (pgvector cosine
  over HNSW halfvec(384)) + keyword (pg_trgm) fused by reciprocal-rank fusion.
  Degrades to keyword, never 500s.

## 3. AI — how the existing AI architecture uses the knowledge

- **`GET /api/knowledge/search`** — hybrid retrieval API (session-gated,
  rate-limited) returning source-traceable passages.
- **`POST /api/knowledge/ask`** — grounded Q&A (Psychology Tutor backend).
  Retrieval-first: always returns real passages + citations; AI synthesis added
  only when a no-train provider is available (`knowledge_tutor` workload in the
  data-policy guard). The corpus is never sent wholesale — only the reranked
  top-k, keeping token use and latency bounded.
- **Psychology Tutor UI** (`/practice/tutor`, behind the `knowledge_tutor`
  flag): chat interface with expandable source citations.
- **Psychopharm editor** — the admin block-source panel can now search the
  corpus and attach a real, traceable source to any medication block.

## 4. Patient simulation

The knowledge layer is built so a simulated patient can retrieve clinically
relevant material when constructing scenarios (the engine's context can pull
from the corpus via `searchKnowledge`). The existing patient engine already has
authored case ground-truth and hard rule-gates, so corpus retrieval is an
optional enrichment, not a replacement. The separation of PATIENT STATE vs
CLINICAL GROUND TRUTH (brief §16) is already enforced by the engine's gate
system — retrieval feeds the actor's clinical context without exposing the
diagnosis to the student.

## 5. Quizzes

The existing quiz engine (`src/lib/quiz`) requires a `source` on every item.
With a no-train provider key, `/api/knowledge/ask`'s retrieval can power
**corpus-grounded quiz generation** — retrieve the topic's passages, generate
items, attach the real source citation. Until a key is set, generation is gated
(an LLM is needed to author good distractors); the retrieval that grounds it is
live today.

## 6. Evaluation

`npm run knowledge:eval` — a book-grounded set of **50 questions** across 5
categories (factual / conceptual / comparison / case / source-attribution).
Each question carries the expected source book(s) (recall) AND answerTerms
(grounding — the hallucination-resistance signal). The first 16 were hand-
written; the remaining 34 were authored + adversarially verified against the
actual book text by a 6-agent workflow. Baseline (2026-08-14):

```
recall@5:  50/50 (100%)
recall@8:  50/50 (100%)
grounded@8 vector-only:      38/50 (76%)
grounded app-path (expanded): 45/50 (90%)
  factual 12/12 · conceptual 10/10 · comparison 9/9 · case 10/10 · source 9/9
```

Two grounding numbers are reported deliberately: the raw vector lane (76%) and
the app's expanded context (90%) — `/api/knowledge/ask` pulls adjacent
same-chapter passages, so a model synthesising from it sees 90% of answers fully
grounded. This is the regression gate (brief §24/§25): re-run after any
knowledge-layer change; a drop in either number signals a regression.

The 10% app-path gap is the honest hard edge — case-management questions whose
precise terms (e.g. serotonin-syndrome management: myoclonus, hyperreflexia,
cyproheptadine) spread across a multi-page section beyond ±1 page of expansion.
The right book and chapter are always retrieved; deeper contextual-retrieval
(or larger chunk windows) is the future improvement target. The eval surfaced
and fixed a real bug during this build (the keyword lane only scanned the first
~16 chunks) and a calibration error (k10's expected sources).

## 7. Cost

- **Incurred: $0.** Self-hosted MiniLM embeddings; deterministic chunking; no
  model calls during ingest/embed. R2 storage on the existing free tier.
- **Expected (optional):** the only model cost is AI synthesis/quiz generation,
  and only when a no-train key is set. Even then it's bounded (top-k passages
  only, never the corpus).
- **Efficiency:** content hashing means unchanged books are never reprocessed;
  embedded chunks are never re-embedded.

## 8. Remaining work (what to build next)

1. **Set a no-train key** (ANTHROPIC / GROQ / CEREBRAS) → flip the
   `knowledge_tutor` flag → verify the grounded-synthesis path end-to-end
   (NEEDS_KAVYA has the checklist).
2. **Corpus-grounded quiz generation** — wire `searchKnowledge` into a
   quiz-builder that authors source-cited items (gated on a key).
3. **Patient-simulation context enrichment** — feed retrieved passages into the
   actor's scenario-building when useful (optional; the engine is complete).
4. **Revision / flashcards** — generate per-topic revision material and
   flashcards from retrieved passages.
5. **Concept enrichment (V4 Flash)** — only if a future eval shows raw-chunk
   retrieval is insufficient (currently 100% recall, so this is a research
   item, not a fix).
6. **Expand the eval set** toward ~50 questions and add hallucination-resistance
   checks (does the grounded answer cite only real passages?).
