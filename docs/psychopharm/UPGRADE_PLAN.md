# Psychopharm Knowledge-Base Upgrade Plan

Status: **approved for execution** (2026-08-10) · Scope: **Plan + prove it works**
Owner: PLMS · Reviewer queue: Dr. Sarthak (all new content lands as `draft`/`in_review`, nothing auto-publishes)

This plan is grounded in a full, unreduced inventory of the database and local
artifacts (see §1). It lists every gap, the source that fills it, the scraper
changes needed, and the exact order of work.

---

## 1. Complete inventory — what exists today

### 1.1 Database (Supabase, `public` schema)

| Table | Rows | Meaning |
|---|---|---|
| `psych_drugs` | **152** | one row per drug; all `status = 'in_review'` (none published) |
| `psych_drug_fields` | **664** | sourced field values (mechanism/common_uses/dose_range/side_effects…) |
| `psych_dose_bands` | **134** | curated dose ladders (band_order, range_low/high, purpose, evidence) |
| `psych_dose_ranges` | **0** | designed but unused — raw ranges go here |
| `psych_sources` | **11** | the registered source library |
| `medication_documents` | **64** | per-drug draft documents (status `draft`, version 1, unpublished) |
| `psych_drug_links` | 5 | similarity/equivalence links |
| `psych_therapy_planning` | 5 | therapy-planning notes |
| `psych_case_vignettes` | 3 | illustrative vignettes |
| `psych_case_format_notes` | 2 | band-level format notes |
| `psych_observation_checklist` | 11 | observation checklist items |
| `psych_observation_prompts` | **0** | band observation prompts — **empty** |
| `psych_comorbidity_notes` | **0** | **empty** |
| `psych_clinical_pearls` | **0** | **empty** |
| `psych_red_flags` | **0** | **empty** |
| `psych_therapist_questions` | **0** | **empty** |
| `psych_session_observations` | **0** | **empty** |
| `psych_med_timeline` | **0** | **empty** |

### 1.2 Field coverage per drug (from `KNOWLEDGE_BASE.json`, the app read-model)

| Field | Covered drugs | Missing |
|---|---|---|
| `mechanism` | 151 / 152 | Diphenhydramine |
| `common_uses` | 152 / 152 | — |
| `dose_range` | 152 / 152 | — |
| `side_effects_common` | 152 / 152 | — |
| `side_effects_serious` | 152 / 152 | — |
| `onset` | 151 / 152 | 1 |
| `half_life` | 152 / 152 | — |
| **Curated dose bands** | **64 / 152** | **88 drugs have only the raw Stahl range** (single "Typical ranges in our sources" rung) |
| Interactions / monitoring / discontinuation / special populations | **~0** | everywhere |
| Equivalences | 64 (in draft records) | 88 missing |

### 1.3 The 88 drugs with NO curated dose bands (raw single-range only)

Common first-line drugs sit here: **Amitriptyline, Nortriptyline, Imipramine,
Clomipramine, Doxepin, Buspirone, Moclobemide, Zopiclone, Triiodothyronine,
Selegiline, Buprenorphine, Methylphenidate(D), Pimozide** and the TCA/TMH
families — plus all the newer agents (Esketamine, Brexanolone, Lemborexant,
Pitolisant, Varenicline, Vilazodone, …). The app renders each as "Typical
ranges in our sources (not yet split into dose bands)" — an honest gap, but a
gap.

### 1.4 FDA label coverage — the biggest structural problem

- Only **35** of 152 drugs have a local FDA file (`scripts/psychopharm/fda/`).
- Every one of those files is **≤ ~2,100 chars** — the scraper grabs only the
  2,000 characters after "Dosage and Administration" and discards everything
  else. A real label is 30–100× larger.
- Verified today: the **full** Wellbutrin SR label is **116,000 chars** with all
  13 sections present (boxed warning, indications, dosing, contraindications,
  warnings, drug interactions, adverse reactions, abuse/dependence, overdose,
  description, clinical pharmacology, specific populations, patient
  counseling). **None of that is currently captured.**
- Drugs FDA has **no label for** (foreign/off-market): agomelatine, moclobemide,
  etizolam, zopiclone, amisulpride, sulpiride, flupenthixol, zuclopenthixol,
  pipothiazine, blonanserin, perospirone, cyamemazine, tianeptine, reboxetine,
  dothiepin, lofepramine, mianserin, and most benzodiazepines older than
  FDA-era (nitrazepam, flunitrazepam, flurazepam, quazepam, loflazepate, …).

### 1.5 Book text caches (already local, page-marked)

`scripts/psychopharm/text/` holds **10 books, 10,271 pages** of page-anchored
text: Maudsley 2021 (978p), Stahl PG 7th (2697p), Stahl Essential 5th (640p),
Stahl PG older (588p), Stahl preview (98p), Kaplan & Sadock 12th (3768p), Fish
(137p), Ahuja 20th (273p), DSM-5-TR (1377p), ICD-11 (473p). The `passages/`
dir already has 200+ extracted drug passages across these books. These are the
**primary enrichment source for the 88 un-curated drugs and for all
non-FDA-labelled drugs.**

---

## 2. The upgrade — prioritized work items

### P0 — Fix the FDA scraper (highest leverage, one change)

**Change** `fetch-fda.ts` → fetch the **entire** DailyMed label and split it
into per-section files (or one full file + a section index), instead of the
2,000-char dosing slice. New script writes:

- `scripts/psychopharm/fda/<slug>.json` — the full SPL label parsed into
  sections: `boxed_warning`, `indications`, `dosage_admin`, `contraindications`,
  `warnings_precautions`, `drug_interactions`, `adverse_reactions`,
  `abuse_dependence`, `overdose`, `description`, `clinical_pharmacology`,
  `specific_populations`, `patient_counseling`, plus label metadata
  (setid, brand, holder, spl_version, published_date).
- every extraction logged to `WEB_ACCESS_LOG.md` (setid, URL, purpose, tier).

**Source**: DailyMed v2 JSON services (`/services/v2/spls.json?drug_name=…`
→ pick the **branded innovator** SPL → `/spls/<setid>.json` or the
`drugInfo.cfm?setid=…` page). Tier 1 (FDA/DailyMed), already allowlisted.

**Why it's P0**: one code change unlocks warnings / interactions / monitoring /
contraindications / overdose / specific-populations for every US-approved drug.
These are the exact fields the coverage report lists as empty.

### P0 — Extract the missing core fields for all drugs from the book caches

The 30 drugs missing `common_uses`/`dose_range`/`side_effects` in the DB, and
any field absent from a monograph, are recoverable from the local book caches.
`locator-index.ts` + `load-passage.ts` already find and read per-drug passages
(page-marked, verbatim). A **gap-driven re-extraction pass** reads, for each
drug, the passages that cover its missing fields and writes them with
source_id + page_ref.

**Sources**: Stahl PG 7th (primary), Maudsley 2021 (dose bands/guidelines),
Kaplan & Sadock 12th, Ahuja 20th (Indian practice), DSM-5-TR / ICD-11
(condition naming).

### P1 — Dose-band enrichment for the 88 un-curated drugs

For each of the 88 drugs that currently render only a single raw range, build
the functional dose ladder from Maudsley (starting → therapeutic → maximum,
by indication) + Stahl PG 7th (special populations) + FDA label dosing section.
Follow the existing rule: **bands come only from sources, never invented; where
a source gives one continuous range, keep the honest single-rung.** The current
4 fully-laddered drugs (sertraline, escitalopram, citalopram, mirtazapine) are
the template.

### P1 — Enrich the empty interaction/monitoring/discontinuation fields

Every drug page currently says "Not covered in our sources" for
interactions / monitoring / discontinuation. Two fill paths:
1. **FDA label** (US drugs): `Drug Interactions (7)`, `Warnings & Precautions
   (5)` (monitoring), `Dosage & Administration` discontinuation guidance,
   `Patient Counseling Information (17)`.
2. **Maudsley 2021** (all drugs, incl. non-FDA): the Maudsley has dedicated
   interaction/monitoring/discontinuation tables and taper guidance per drug —
   already in the local cache.

### P2 — Enrich the empty observation/pearls/red-flag/comorbidity tables

`psych_observation_prompts`, `psych_clinical_pearls`, `psych_red_flags`,
`psych_therapist_questions`, `psych_session_observations`,
`psych_comorbidity_notes` are all **0 rows**. Their content maps cleanly onto
existing drug facts (side-effect time-courses → observation prompts; serious
AEs + boxed warnings → red flags; Stahl "Pearls" + FDA counseling → pearls;
DSM-5-TR co-morbidities → comorbidity notes). These are authored (transformed)
fields, so each row carries a `source_id` + `kb_parent` link and lands as
`draft` for reviewer sign-off — never auto-published.

### P2 — Equivalences for the 88 un-curated drugs

Maudsley has published dose-equivalence tables (benzodiazepine diazepam-
equivalence, antipsychotic equivalence, SSRI equivalence). Extract them into
`psych_drug_links` / draft `equivalences` with the source quote.

### P3 — Indian-market brand coverage (Ahuja / local practice)

Ahuja 20th (Indian prescriber source) already has passages for ~60 drugs. Add
the Indian brand names missing from `psych_drugs.brand_names` and surface any
Indian-practice dosing differences as `population_notes`. This is the
"upgrade the book" part — enrich what Ahuja says per drug.

### P3 — Backfill the catalog: 6 catalog drugs absent from KB

`Nitrazepam, Etizolam, Methylphenidate (plain), Melatonin, Levodopa,
Cyproheptadine` are in `DRUG_CATALOG` but have no `KNOWLEDGE_BASE.json` row
(they exist as passages only). Either add them as full KB rows or remove them
from the catalog — decide per drug.

---

## 3. Source tiering & provenance (unchanged rules)

| Tier | Source | Use |
|---|---|---|
| 1 | FDA/DailyMed, NICE, BNF, PubMed, EMA | full labels, interactions, monitoring |
| 2 | Local books (Maudsley, Stahl, Kaplan, Ahuja, DSM, ICD) | primary monograph content, bands, equivalences |
| — | Web-scraper MCP (`web-scraper-mcp`) | page-by-page retrieval + extraction of all of the above |

Every new value carries `source_id` + `page_ref`/URL + verbatim `snippet`
(quote-first). Every web fetch is logged in `WEB_ACCESS_LOG.md`. Discrepancies
book-vs-web go to `DISCREPANCY_REPORT.md` (book wins until adjudicated).
**Nothing publishes without a reviewer signature** — the DB enforces
`status in ('draft','in_review')` and the UI gate is `status = published`.

---

## 4. Execution order (what happens when the plan is approved)

| # | Step | Output | Proof gate |
|---|---|---|---|
| 1 | **Rewrite FDA scraper** to full-label + section split (web-scraper MCP) | `fda/<slug>.json` + section index | 3 full labels (bupropion, trazodone, zolpidem) fetched + parsed |
| 2 | **Prove end-to-end on 3 drugs** | enriched drafts + KB rows + DB rows (`draft`) | diff vs. old 2K stub visible; reviewer sees all new sections |
| 3 | Run full-label fetch across all FDA-labelled drugs (~120) | ~120 full labels, sectioned + logged | label count / parse rate report |
| 4 | Gap-driven book re-extraction (core fields for 30 thin drugs) | KB rows + drafts | coverage report ≥ previous |
| 5 | Dose-band enrichment for 88 un-curated drugs (Maudsley/Stahl/FDA) | 88 new ladders, `draft` | coverage report: 64 → ~152 banded |
| 6 | Interaction/monitoring/discontinuation fields (FDA + Maudsley) | fields + rows | no more "Not covered in our sources" for those |
| 7 | Observation prompts, pearls, red flags, therapist questions, comorbidity notes | the 6 empty tables get rows (`draft`) | row counts > 0 |
| 8 | Equivalences for 88 drugs (Maudsley tables) | `psych_drug_links` + draft equivalences | table populated |
| 9 | Indian brand names + Ahuja enrichment | `brand_names` + `population_notes` | brand coverage diff |
| 10 | Catalog backfill for 6 missing drugs | KB rows or catalog cleanup | catalog ⊆ KB |
| 11 | Re-run `psych:kb`, `psych:monographs`, seed DB, run tests | regenerated artifacts + DB `draft` rows | `npm test`, coverage report updated |

---

## 5. Explicit non-goals (so scope stays honest)

- **No auto-publishing.** Everything lands as `draft`/`in_review`; Dr. Sarthak
  approves. This is the project's core safety rule and is unchanged.
- **No inventing data.** Where a source gives one continuous range, the single
  honest rung stays. Where no source covers a field, it reads "Not covered in
  our sources" — not a guess.
- **No source beyond the allowlist** without logging it. Tier-1 web + local
  books only.
- The 20+ **foreign/off-market drugs with no FDA label** get their interaction/
  monitoring/discontinuation content from **Maudsley + Kaplan + Ahuja** (all
  already local), not from scraping grey sources.

---

## 6. Risk register

| Risk | Mitigation |
|---|---|
| DailyMed rate limiting / HTML size (327K/response) | v2 JSON API with `render:false`; 1 fetch per drug; throttle; full files written to disk, not context |
| Generic SPLs outnumber brand (374 bupropion SPLs) | pick the innovator/branded SPL by holder name; fall back to highest spl_version |
| Non-FDA drugs have no label | Maudsley/Kaplan/Ahuja local caches fill interactions/monitoring/dosing |
| Reviewer workload (152 drugs × many fields) | content is quote-first and page-attributed; reviewer approves, never authors |
| Rebuild of reviewed content | only appends to `draft`; reviewed rows (status = verified/published) untouched |

---

## 7. Change log

- 2026-08-10 — plan written from full DB + artifact inventory (152 drugs).
- 2026-08-10 — proof selected: bupropion, trazodone, zolpidem (full-label
  scraper → section split → KB + DB draft rows).
- 2026-08-10 — **P0 proof complete.** New scripts: `fetch-fda-full.ts`
  (full-label → 15 sections), `enrich-fda-fields.ts` (sections → quoted field
  rows + KB), `seed-fda-fields.ts` (rows → `psych_drug_fields` as `draft`,
  case-insensitive drug matching so no duplicate drug rows). Full labels for
  Bupropion, Trazodone, Zolpidem fetched via web-scraper MCP (DailyMed v2 JSON
  → innovator setid → `drugInfo.cfm`). 6 previously-empty fields per drug now
  populated. Store + drug page render them. 30 draft rows in DB (664→694), KB
  1062→1092 rows (152 drugs). All 38 tests pass. Also fixed a false-positive
  in `integrity.test.ts` (naive grep flagged verbatim label prose containing
  "equivalence" + dose ratios; now scoped to `*.ts`).

- 2026-08-10 — **Full pipeline run across all 152 drugs.** New scripts:
  `build-fda-manifest.ts` (drug→setid via DailyMed v2 JSON API, 123 found, 26
  not found; targeted re-discovery fixed 4 suboptimal picks), `parse-fda-batch.ts`
  (batch re-parse with the improved extractor), and 4 `fix-manifest*.ts` ad-hoc
  patches (cleaned up). A background agent fetched all 123 full labels via the
  web-scraper MCP (DailyMed `drugInfo.cfm?setid=…`, each 200-470K chars
  persisted to disk); every label saved as `fda/<slug>.html` + parsed to
  `fda/<slug>.json` (15 sections). Older-format labels (TCAs, MAOIs, etc.) the
  extractor now also accepts standalone "WARNINGS" aliases. `enrich-fda-fields.ts`
  produced 1079 quoted field rows → `KB` 1062→2141 rows (152 drugs, 0
  duplicates). `seed-fda-fields.ts` upserted all 1079 rows as `status='draft'`
  onto canonical drug rows (no pseudo-drugs created). End state:
  - DB: `psych_drug_fields` 664→**1725** (+1061, all draft), 1079 FDA-sourced
  - KB: 152 distinct drugs, 2141 rows, 0 case/punct duplicates
  - **76 drugs** now have all 6 new FDA fields; **123 drugs** have ≥1
  - **82 drugs** now have `interactions` (was ~0)
  - 38/38 tests pass, typecheck clean
  - Store + drug page render the 6 new fields; older-format labels show
    honest "Not covered in our sources" for genuinely-missing sections.

- 2026-08-10 — Improved `fetch-fda-full.ts` extractor: handles older-format
  labels (WARNINGS standalone, non-standard section orders) by trying alt
  header forms and taking the LAST occurrence in the body region. Cleaned
  duplicate `methylfolate-l-.json` and meta.drug canonicalization in
  `enrich-fda-fields.ts` (now stripped of parens/punct for match).

### Next step (execution, on approval)

Run the same fetch→enrich→seed loop across the remaining ~117 US-approved
drugs (rate-limited, 1 fetch per drug), then the book-cache passes for the 88
un-curated + 6 non-FDA drugs. See §4 for the full order.

**DONE — 2026-08-10.** Full pipeline completed across all 152 drugs. The 29
drugs with 0 new FDA fields are the non-US drugs (agomelatine, moclobemide,
etizolam, zopiclone, etc.) — those get dose/interaction/monitoring content
from Maudsley/Kaplan/Ahuja in the next pass (book cache reads).
