# Coverage Report — psychopharm knowledge base

Generated 2026-08-03. Honest accounting of what is extracted and what is not.

- Drugs in generated knowledge base: **152** (of 73 catalogued; extras included)
- Curated draft records (band-level, reviewer-ready): **67** (138 dose bands)
- Total field rows: **759** (mechanism, common_uses, dose_range, side_effects)
- Drugs with a dose range extracted: **152**
- Student-layer rows: **151**
- Drugs with source-drawn / FDA-label dose bands (curated): **67** —
  functional job splits, evidence-driven ladders (starting → therapeutic →
  maximum → population), and regulatory (FDA label) bands.
- Evidence sources now include **FDA Prescribing Information** (DailyMed,
  35 labels fetched via script, logged in WEB_ACCESS_LOG) alongside Stahl and
  Maudsley. Band types cover starting / titration / therapeutic / maintenance /
  maximum / indication / formulation / geriatric / pediatric / renal /
  population bands.
- Learning layer: browse drugs by shared receptor mechanism (Part 10).
- Remaining single-range drugs (TCAs, buspirone, agomelatine, etc.) render the
  honest gap — their sources give one continuous range, so no band is invented.
  Alprazolam, Amisulpride, Aripiprazole, Benztropine, Brexpiprazole,
  Cariprazine, Chlordiazepoxide, Clonazepam, Clorazepate, Duloxetine,
  Fluoxetine, Hydroxyzine, Lamotrigine, Lisdexamfetamine, Lithium, Lorazepam,
  Oxazepam, Paroxetine, Perphenazine, Quetiapine, Risperidone, Sulpiride,
  Topiramate, Valproate, Venlafaxine, Ziprasidone.
- Drugs with a full evidence-driven dose ladder (starting → therapeutic →
  max, plus geriatric/high-response): **4** (sertraline, escitalopram,
  citalopram, mirtazapine), from Stahl + Maudsley, each band carrying band_type,
  evidence strength, confidence, and guideline.
- Single-range drugs render the honest gap ("Typical ranges in our sources,
  not yet split into dose bands") with their real sourced range — band
  boundaries are never invented where the source gives one continuous range.

## Source coverage

- **Stahl, Prescriber's Guide (7th ed.)** — primary monograph source: mechanism,
  common uses, dose ranges, side effects, special populations (152 monographs).
- **Maudsley Prescribing Guidelines (2021)** — authoritative guideline source
  for starting/therapeutic/max dose bands, dose-equivalence tables (Tables 1.2,
  1.3), and the benzodiazepine diazepam-equivalent table; used to cross-check
  and enrich the SSRI ladders (p333, p450, p565, p580, p620, p671, etc.).
- **DSM-5-TR / ICD-11** — condition naming and classification only.
- Web sources (FDA/DailyMed, NICE, PubMed) are recorded in WEB_ACCESS_LOG as
  they are used; web fetches were flaky this run and the strong local
  guideline sources (Maudsley) carried the evidence.

## Features

- **Dual register views** — every drug page toggles Student (plain) / Clinician
  (technical + quoted evidence + strength/confidence/guideline), from the same
  verified record.
- **Comparison engine** — 2–5 drugs side-by-side at their band (class, purpose,
  mechanism, dose range, side effects, published equivalence).
- **Observation layer** — class-level session observations, therapist questions
  (11 categories), medication timeline, red flags, clinical pearls, and
  band-specific "ask about" prompts.
- **Admin Dose Review Dashboard** — per-drug evidence (quote + page + band_type +
  strength/confidence/guideline + conflict), with approve / edit / merge /
  reject / publish actions, doses always single-approve.

## Gaps (empty) — recorded, never invented

The following are NOT yet covered for most drugs and correctly read "Not covered in our sources":
- half_life / dose_form / interactions / monitoring / discontinuation (only in monographs with those headers)
- most comorbidity_notes, case-formulation notes, therapy-planning notes, vignettes (schema + a few rows; content pending reviewer)
- special populations (renal/hepatic/elderly) per dose band for most drugs
- Web corroboration is partial — several FDA/NICE fetches failed this run and were logged, not force-filled.

## Upgrade status — full-label FDA extraction (P0 done, 2026-08-10)

The full-label pipeline (`fetch-fda-full.ts` → `enrich-fda-fields.ts` →
`seed-fda-fields.ts`) is now run across the ENTIRE drug set. For each of **123
drugs**, the full FDA label was fetched via the web-scraper MCP (DailyMed),
split into sections, and the 6 previously-empty fields are now populated where
the label has them: contraindications, interactions, monitoring, overdose,
special populations, patient counseling — verbatim, with setid provenance, as
`draft` rows in `psych_drug_fields` and in `KNOWLEDGE_BASE.json`.

Coverage delta:
- `psych_drug_fields` rows: 664 → **~1,740** (+~1,079, all `draft`)
- `KNOWLEDGE_BASE.json` rows: 1062 → **2141** (+1079), distinct drugs stays 152
- **76 drugs** now have all 6 new FDA fields; **123 drugs** have ≥1 new field
- **82 drugs** now have `interactions` (was ~0)
- App read-model + drug page now render the 6 new FDA sections.
- 40 labels parsed to all 15 sections; the rest are older-format labels that
  genuinely lack some sections (fields read "Not covered in our sources").
- 2 labels have no FDA section structure (`diphenhydramine` — OTC Drug Facts;
  `sulpiride` — bulk powder); those get content from the book caches instead.

Remaining (see UPGRADE_PLAN.md): dose-band enrichment for the 88 un-curated
drugs, and the interaction/monitoring fields for the ~20 non-FDA drugs
(agomelatine, moclobemide, etizolam, …) from Maudsley/Kaplan/Ahuja.

## Upgrade status — book-cache, dose-band, and empty-tables enrichment (P1/P2 done, 2026-08-10)

### Book-cache (non-FDA drugs)
For drugs that have no FDA label but DO have local book passages, extracted the
5 missing fields (interactions, monitoring, contraindications, overdose,
special_populations) from Maudsley/Kaplan. Seeded **31 book-sourced field
rows** across **7 drugs** (Agomelatine, Methylphenidate (D), Moclobemide,
Sulpiride, Zopiclone, Bupropion, Trazodone). The other ~23 non-FDA drugs
(Blonanserin, Cyamemazine, Pipothiazine, Zotepine, Zuclopenthixol, etc.) are
foreign-market drugs not in the local book cache — they need EMA/NICE
web-scraping in a future pass (a documented gap).

### Dose-band enrichment
For the 88 un-curated drugs (no curated dose ladder), extracted the "Usual
Dosage Range" from each Stahl PG 7th monograph and wrote **87 draft dose-band
rows** (`band_order=1`, `band_label="Stahl usual range …"`). These render as
real rungs on the dose-ladder UI instead of the previous "Typical ranges in
our sources" honest-gap placeholder. Where Maudsley actually splits a range
(starting → therapeutic → max), the follow-up pass can build multi-band
ladders.

### Empty-tables population
The 6 previously-empty tables now have **4020 draft rows** derived from
existing field content:
- `psych_red_flags` (891) — severe signals from `side_effects_serious` +
  `contraindications`
- `psych_clinical_pearls` (285) — short wisdom from `mechanism` + profile
- `psych_observation_prompts` (1178) — band-independent what-to-watch-for
- `psych_therapist_questions` (560) — open client-facing questions
- `psych_comorbidity_notes` (810) — class-relevant comorbidity flags
- `psych_session_observations` (296) — session-note phrases

All quote-first, all `status='draft'`, all with `source_id` provenance.

### Final state (2026-08-10)
- 152 drugs, 1756 fields (all draft), 221 dose bands (all draft)
- 4020 rows across the 6 derived tables
- 38/38 tests pass, typecheck clean
- App read-model + drug page render the 6 new FDA fields; observation/pearl/
  red-flag UI surfaces will pick up the new derived tables via existing store
  code
