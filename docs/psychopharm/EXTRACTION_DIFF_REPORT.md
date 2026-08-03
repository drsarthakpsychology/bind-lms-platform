# Extraction Re-run Diff Report

Result of re-running `npm run psych:monographs` after the section-boundary fix
(adding "If It Works", "If It Doesn't Work", "Best Augmenting Combos…", "Tests",
and "Pharmacokinetics" to `SECTIONS`).

## Knowledge base (KNOWLEDGE_BASE.json)

- **Rows: 759 → 1062.** The +303 are the new `onset` (151) and `half_life`
  (152) field keys.
- **38 existing values changed.** Of these, **37 are apostrophe-only** (curly
  `’` → straight `'`, a byproduct of `straightenApostrophes()`).
- **1 material change:** `Triiodothyronine/mechanism` shrank 1949 → 1574 chars.
  The old value incorrectly swallowed the "If It Works / If It Doesn't Work"
  sections (including prescriber-directed "continuation and switch to a mood
  stabilizer"); the new value stops at the correct mechanism boundary. This is
  the intended fix, not a regression — prescriber-directed content is no longer
  captured inside a student-visible mechanism field.

## Monograph extract (extracted_mono_stahl7.json)

- **`How Long Until It Works`** now ends at the correct boundary. Paroxetine
  shrank 3477 → 535 chars; Acamprosate 950 → 67; Clonazepam 2596 → 123;
  Risperidone 5489 → 373.
- New sections (`If It Works`, `If It Doesn't Work`,
  `Best Augmenting Combos…`, `Tests`, `Pharmacokinetics`) now present for all
  152 monographs.

## Not silently overwritten

No reviewed content was changed other than the boundary fix above. The
apostrophe normalisation is cosmetic and consistent.
