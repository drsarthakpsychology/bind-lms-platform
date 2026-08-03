# Coverage Report — psychopharm knowledge base

Generated 2026-08-03. Honest accounting of what is extracted and what is not.

- Drugs in generated knowledge base: **152** (of 73 catalogued; extras included)
- Curated draft records (band-level, reviewer-ready): **30** (26 functional-band + 4 rich SSRI ladders)
- Total field rows: **759** (mechanism, common_uses, dose_range, side_effects)
- Drugs with a dose range extracted: **152**
- Student-layer rows: **151**
- Drugs with source-drawn functional dose bands (curated): **26** —
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
