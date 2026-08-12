# PHASE2_READY — the book-ingestion pipeline, standing by

## What the pipeline can ALREADY do (built, tested, no keys needed)

| Capability | Where | Status |
|---|---|---|
| **Rights gate** | `rights_registry` table + `/admin/rights` | LIVE — 101 rows, `rights_status` controls everything |
| **Licensed ingester** | `scripts/corpus/fetch-licensed.ts` | RUN — 3 acquired via archive.org ladder; the rest marked `acquisition_failed` with reasons (never blocks) |
| **Drop folder** | `scripts/corpus/lib/acquire.ts` step 6 | READY — `ACQUIRE_DROP_FOLDER` env → `/mnt/acquire/` → local fallback; 4 tests prove the finder (slug/token match, decoy rejection, graceful missing) |
| **Extraction ladder** | `scripts/corpus/lib/extract.ts` | READY — ePub/HTML → PDF text → OCR last (per quality order) |
| **Layer firewall** | `src/lib/corpus/layers.ts` + tests | PASSING — a STYLE chunk can never answer a clinical query; a CLINICAL chunk can never voice a patient |
| **Provenance** | every row: source, licence, retrieved_at, sha256 | ENFORCED in the ingester |
| **Free corpus fetchers** | SAMHSA (new), Gutenberg, PMC, mhGAP, NMHS, ICD-11, MHA 2017 | BUILDING — see `scripts/corpus/` |
| **halfvec(384)** | embeddings + hnsw | STANDARD — `halfvec_cosine_ops`, never vector(1536) |

## What each licensed title would unlock

**Priority 1 — Indian + counselling dialogue:**
- *Ahuja (Jaypee)* — the Indian textbook spine for CLIN
- *Vyas & Ahuja* — postgraduate depth for CLIN
- *Bhugra & Malhotra workbook* — case-vignette bank → case scaffolds
- *NIMHANS CPGs* — CLIN + Out of Depth referral thresholds
- *IJP archive* — Indian presentations + idioms (CULT)

**Priority 1 — transcript corpora (the highest-value asset):**
- *Alexander Street / ProQuest transcript volumes* — ~4,000 real sessions →
  the counsellor-move transition table becomes EMPIRICAL (which move precedes
  disclosure, by condition) → the scoring rubric is no longer opinion.
  Also: register-matched exemplars for the Actor's few-shot slots, real
  turn-length distributions, hesitation markers by age/register.

**Priority 2 — interviewing + psychopathology:**
- *Shea (Elsevier)* — the CASE Approach → a scored OSCE suicide-assessment
  station (the single most important station)
- *Sims' (Oyebode)* — confusable-pair drills become authoritative
- *Kryger* — the sleep-medicine mimic band (narcolepsy misread as psychiatric)
- *Kleinman / Obeyesekere / Luhrmann* — CULT: explanatory models, idioms,
  help-seeking paths — the Decoder's grounding

**Priority 3 — narrative/trauma:**
- *van der Kolk, Herman, Maté* — CLIN layer for the trauma curriculum
- *Saks, Jamison, Styron* — PHEN layer: how psychosis/manic-depression feel
  from inside — the patient's self-description becomes real

## The gate

Flip `rights_status` to `licensed` in `/admin/rights` (or Kavya drops the
file in the drop folder) → `npm run corpus:licensed` picks it up on the next
pass → extracted, layered, provenanced, embedded. No rebuild, no deploy.
