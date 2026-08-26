# Plain Language — approved vocabularies (T161 / T162)

The one rule, everywhere in the app: **say what it is in ordinary words.** If a
label needs a glossary to be understood, it is wrong. These are the approved
terms for student- and admin-facing UI. When a page shows something not on the
list, prefer the plainer word.

Grounding: the T91 product-simplification audit (`PRODUCT_SIMPLIFICATION_AUDIT.md`)
found jargon and internal architecture leaking into ~165 surfaces. The fixes
shipped in the T91 slices; this document keeps the language from drifting back.

## Student-facing vocabulary

| Don't say | Say | Why |
|---|---|---|
| corpus | the authorised books / the library | engineering term |
| stimulus | case / prompt | lab term |
| controlled vocabulary | the listed options | data-science term |
| diff (as a noun) | comparison | developer shorthand |
| cohort (in student copy) | your class / other students | institutional |
| Being calibrated | Not marked yet | the number isn't ready, say that |
| no-train AI provider / paid key | a service that isn't switched on | internal config |
| Published / Draft (on student surfaces) | — (never shown to students) | internal workflow |
| source (enum) | AI-drafted / Faculty / Manual | raw DB enum |
| domain keys (thought_process) | Thought process | snake_case leak |
| modal panel weight | the expert panel | statistics |
| ground truth / expert coding | the marked reference | ML terms |
| composite / norm / 60-40 | Overall | scoring machinery |
| Idiom (to students without context) | the phrase the patient uses | plain first |

## Admin-facing vocabulary

| Don't say | Say | Why |
|---|---|---|
| Calibration | Marking check | what you actually do |
| Rights | Book licences | it's a licensing tracker, not permissions |
| Feature flags | What's live | the mechanism, not the job |
| Cohort pulse | Cohort progress | product codename |
| Infrastructure | Usage & limits | what it shows |
| Dictate case | Record a case | the human action |
| Cards | Study cards | the content, not the table |
| Sim sessions | Practice sessions | no abbreviations |
| Corpus | Practice cases / the books | internal pipeline |
| aggregate | totals | engineering word |
| idempotent | (re-uploading skips existing) | say what it does |
| Supabase / provider names | Database / storage | vendor internals |
| kappa / weighted kappa | agreement | statistics |
| CLI commands (npm run …) | a plain message | admins aren't engineers |
| Provisional / Validated | Not final yet / Final | plain states |

## The rules behind the list

1. **Never expose a route, table, column, enum, provider, or CLI command** to a
   user who can't act on it. That is internal architecture, not a feature.
2. **One concept, one name** — across screens and across student/admin. If two
   screens call the same thing different names, merge them (the audit's
   duplication finding).
3. **No product codenames** for real human jobs. Name the job.
4. **Legitimate clinical terms stay** (MSE, OSCE, differential, formulation,
   intake) — this audience is studying them. Give them a plain subtitle where
   a first-timer needs it; never dumb them down to something wrong.
5. **If you are about to add helper text explaining a label, rename the label
   instead.** Helper text is a smell that the word is wrong.

## Keeping it honest

The audit is the record of what was found; this doc is the standard going
forward. Any new screen that needs a term not on this list should prefer the
plainest word that names the job, and the mismatch gets logged here.
