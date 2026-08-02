# Knowledge Base Guide — psychopharm

Written for someone who wasn't here when this was built. Explains the schema,
the field keys, the tag vocabulary, and how to query it.

## What this is

The knowledge base is Output A of the two-output extraction. It is a
clinical-register store of psychiatric medication facts extracted from the
source textbooks (Stahl PG 7th, Maudsley, Kaplan & Sadock, Ahuja, DSM-5-TR,
ICD-11), reviewed field-by-field by Dr. Sarthak, and from which the student
layer (Output B) is derived. It is a database, not a document.

## Where the data lives

- `docs/psychopharm/KNOWLEDGE_BASE.json` — generated field rows (Output A)
- `docs/psychopharm/STUDENT_LAYER.json` — student-facing rows (Output B)
- `src/lib/psychopharm/draft-seed.ts` — curated draft records (band-level)
- `src/lib/psychopharm/` — types, sources registry, store read-model

## Field keys (drug_fields.field_key)

| key | meaning |
|---|---|
| mechanism | how the drug acts in the brain (clinical register) |
| common_uses | what it is commonly used in |
| dose_range | the range(s) described by the source |
| side_effects_common | common side effects with time course |
| side_effects_serious | serious-but-rare side effects |
| onset_time / half_life / dose_form / interactions / monitoring / discontinuation | where the monograph covers them |

## Lifecycle + verification

`draft → in_review → verified → published`. Only `published` is
student-visible. A `published` field must carry source_id + page_ref +
verified_by + verified_at (DB-enforced, see migration). `snippet` (verbatim
source) is reviewer-only — students never see it.

## Querying (intended, once DB-backed)

```sql
-- All published mechanisms
select d.generic_name, f.value
from psych_drugs d join psych_drug_fields f on f.drug_id = d.id
where f.field_key = 'mechanism' and d.status = 'published';

-- A drug's dose bands
select * from psych_dose_bands where drug_id = ... and status = 'published'
order by band_order;
```

## Tag vocabulary

Drugs tag to `psych_mechanism_tags` (receptor/transporter with direction:
agonist/antagonist/partial/reuptake_inhibition). A future assignment builder
can ask "every drug on serotonin reuptake inhibition with a pregnancy caution"
from tags alone.

## Relationships as data, not prose

Drug–mechanism, drug–condition, drug–drug similarity and equivalence are
stored as rows/links, never sentences. `psych_drug_links` carries
same_job/same_mechanism/same_class/published_equivalence with match_tier.

## Safe changes

Editing a published field flips it back to in_review and unverifies (trigger).
Changes flow DOWN only: knowledge base → student layer. The student layer is
never the source of truth.

## Current state (honest)

152 drugs have mechanism/uses/dose-range/side-effects extracted from Stahl
PG 7th (single-source). 1 drug (clonazepam) has curated dose bands. Cross-source
reconciliation, comorbidity notes, observation prompts, and the adversarial
re-check have NOT run yet. See COVERAGE_REPORT.md and CONFLICT_REPORT.md.