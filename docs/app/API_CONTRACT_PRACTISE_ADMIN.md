# VIBHA app API contract (v1): Practise, Library and Admin

Part two of the contract. Part one (`docs/app/API_CONTRACT.md`) has the basics that hold here too: base address, headers, the answer shape `{ ok, data }` and the error codes, paging (`?limit=&cursor=`, `Page<T>`), `AppTarget` links, and the security rules. The types for this part are in `src/lib/app-api/contract-practise-admin.ts` (a plain types file that imports only from `contract.ts`; the app copies it next to `contract.ts`). If this page and that file disagree, the file wins.

Status words: **built** (the route exists and has tests) or **planned** (agreed shape, not written yet).

Last updated: 2026-11-15.

## 1. Rules for this part

- Every route runs through `appRoute` (`src/lib/app-api/route.ts`): the bearer guard, the one-phone rule, lectures-only scope, sections switched off per student, and feature flags, decided by the website's own `decideApiAccess`.
- No logic is copied. Each route calls the website's own function. Where a website page or Server Action mixed its logic with page code, the logic was moved to `src/lib` and the page now calls it too (listed under "Moved out" in each section). The website behaves exactly as before.
- Scores are never taken from the app. Games, Exam Prep questions and Judgment calls are graded on the server, with the website's signed run tokens, server-held answer keys and XP caps. The few self-check records (OSCE checklist, MSE and formulation compare) are stored exactly as the website stores them and never pay XP.
- Writes are rate limited per person. Lists page with `?limit=&cursor=`.
- Structured JSON only, never HTML.

## 2. Library

Gate: Medicines (`/practice/medicines`), and the reference (`/tools/psychopharm`); both close for lectures-only accounts and when Medicines is switched off for the student.

| Status | Method and path | Request | Response | Calls |
|---|---|---|---|---|
| built | `GET /library/medicines` | `?q=&group=` (`class` also accepted) | `MedicineList` | `medIndex`, `GROUPS`, `searchMeds` (`src/lib/meds`) |
| built | `GET /library/medicines/:medId` | none | `MedicinePage` | `medicinePage` (`src/lib/app-api/library.ts`): `medById`, `shownSections`, `splitTell`, `SECTION_NAMES`, `mechanismOf`, `medVisuals`, `halfLifeOf`, `medicineDiagrams`, `medicineStudyLink` |
| built | `GET /library/reference` | none | `ReferenceHome` | `drugList`, `mechanismIndex` (`src/lib/psychopharm/store.ts`) |
| built | `GET /library/reference/search` | `?q=` (120 a minute) | `ReferenceSearch` | `searchDrugs` |
| built | `GET /library/reference/:slug` | none | `ReferenceDrug` | `drugDetail`, `getPublishedMedicationDocument` |
| built | `GET /library/reference/compare` | `?drugs=a,b[,c,d,e]` | `ReferenceCompare` | `compareDrugs`, `COMPARE_FIELDS` |

The medicine page:

- `sections` is in the website's order and only has the sections the website shows for that medicine: Used for, Doses, Side effects, What to check, Interactions (when any), Serious: act the same day, Special groups, Switching and stopping (when any), How it works (always last, when there is anything to show). Every section has `points` (plain lines); the typed parts carry the rest (dose chips with the student and clinician words, the special-group facts, the targets table).
- `How it works` has `diagrams`: the exact list of hand-drawn pictures the website draws, in order, with everything each picture needs (`MedDiagram`: receptor, journey through the body, synapse, half-life or dose curve, dopamine pathways, compare, neuron, nervous system, brain map, a night of sleep). The website now draws from the same plan (`src/lib/meds/diagrams.ts`), so the two cannot drift. Interactive parts (the buttons under each picture) are the app's to rebuild natively, as on the website's sketches in `src/components/meds/sketch`.
- `summary.student` and `summary.clinician` are the two reading views. `raw` carries the website's own objects for anything else.

The reference:

- The reviewed document is sent when one is published; the website shows it instead of the curated view. Hidden blocks are left out. Sources, page numbers and review fields are never sent (students never see citations; the website shows them only in the editor).
- `notice` is the standing line the website shows under every reference page.

Moved out (website unchanged): the medicine page's section list and names (`shownSections`, `SECTION_NAMES`, `DOSE_NOTE`, `washoutLine` in `src/lib/meds/sections.ts`), the "How it works" picture plan (`src/lib/meds/diagrams.ts`, drawn by `MedicineSketches`), the compare page's fields (`src/lib/psychopharm/compare-fields.ts`).

Changes from the app's mock (`apps/mobile/src/api/extra.ts`): the paths are `/library/medicines` (not `/medicines`); the list's array is `rows` (not `items`); each row also has the mock's names (`className`, `keyDose`) and the list has `classes`. The page is the mock's `MedicineRow & { summary, sections }` with `summary` as `{ student, clinician }` (the website's two views) instead of one string; every section still has `points`.
