# Content inventory, November 2026

Counted on 7 Nov 2026 from the code on `admin-redesign` (b9322ad) by importing each content file and counting the exported lists, plus read-only row counts from the live database. The owner's target is **at least 2,500 items per section**.

Method: `content/prep/index.ts` (ALL_QUESTIONS, ALL_INTERVIEWS), `lib/study` (MODULES, walking every `mcq` and `qa` block), and the exported arrays named in each row below. Database counts come from the tables named. "Code" means the item ships in the app; "DB" means rows in the live database.

Legend for the last column: **Hand** = needs hand-written items (narrative, judgment, safety). **Generate** = can be built from rule data already in the code (diagnosis criteria, time rules, medicine mechanisms, side effects, MSE vocabulary), with clinician spot checks. **Mix** = hand-written seeds plus generated variants.

## Summary against the 2,500 minimum

| Section | Items now | Source | vs 2,500 | Best way to grow |
|---|---|---|---|---|
| Exam Prep question bank | **5,047** questions (+259 interview questions) | `src/content/prep/*` | Meets (202%) | Mix: per-subject gaps below |
| Study module MCQs | **3,730** | `src/content/study/*` `mcq` blocks | Meets (149%) | Hand (already written per section) |
| Study module Q&As | **1,578** | `src/content/study/*` `qa` blocks | 63% | Hand |
| Daily case | 55 cases (19 easy, 24 medium, 12 hard) | `src/lib/games/daily/cases*.ts` | 2% | Generate from the 84 diagnoses in `lib/games/diagnoses.ts` (criteria, onset, duration, exclusions) plus Mix for realism; AI case path adds more once keys are set (`ai_cases`: 0 rows) |
| Practice case library | 188 case reports | `scripts/corpus/normalised/pmc.json` (switch `case_library` off) | 8% | Real literature only; grow by importing more open case reports |
| Casebook (Lab) | 36 case activities | `src/content/casebook` | 1% | Hand, from textbooks |
| Rx Detective | 21 drugs, 11 side-effect cards, 12 mysteries, 14 mixes (58) | `src/lib/games-sims/rx/content.ts` | 2% | Generate from Medicines (`lib/meds`, 52 entries; DB `psych_drugs` 152): mechanism, receptor, side effect, monitoring and interaction questions per drug. Easiest section to reach 2,500 |
| Ward Week | 3 campaigns, 15 sessions | `src/lib/games-sims/ward/campaigns.ts` | under 1% | Hand. Branching stories; 2,500 is not a sensible unit. Count decisions instead; target 20 to 30 campaigns |
| Escape rooms | 3 rooms, 21 puzzles | `src/lib/games-sims/escape/rooms.ts` | 1% | Mix: hand-written rooms, puzzle doors generated from diagnosis and medicine data |
| Comorbid decks | 39 symptom cards, 7 diagnoses, 11 rule-outs | `src/lib/games-sims/comorbid/cards.ts` | n/a (card game) | Generate: build decks from diagnosis criteria; the count that matters is diagnoses covered (7 of 84) |
| MSE Lab passages | 34 (11, 11, 12 by level) | `src/lib/games-sims/mse/excerpts.ts` | 1% | Mix: hand-written interviews, tagging items generated from the MSE vocabulary (`lib/practice/mse.ts`) |
| Practice MSE | 30 DB stimuli; in code 12 seed, 10 full MSE, 20 mood/affect, 20 small things, 6 confusable pairs, 5 drills, 6 expert codes | `mse_stimuli`; `src/lib/practice/mse.ts`, `src/lib/mse/*` | 4% | Mix |
| Clinic detective | 32 clue ladders | `src/lib/learn/detective.ts` | 1% | Generate: four-clue ladders from each diagnosis's criteria and each medicine's profile (84 + 52 sources) |
| What would you do | 10 scenarios, 13 decision points, 10 wording pairs | `src/lib/learn/scenarios.ts` | under 1% | Hand (consequences need clinical judgment); AI-drafted then reviewed is acceptable |
| Say it clinically | 47 note terms + 10 wording pairs; idioms 140 in code, 65 in DB | `src/lib/learn/notes`, `src/lib/decode/idioms.ts`, `idioms` | 8% if idioms are fed in | Generate from the idiom and glossary data |
| OSCE stations | 12 | `src/lib/practice/osce.ts` (DB `osce_stations` 12) | under 1% | Hand. 2,500 not sensible; target 60 to 100 stations |
| Consulting room AI patients | 71 DB cases (70 hand-built, 1 admin); in code 63 case builds, 8 story cases, 15 character skeletons, 17 rare cases | `sim_cases`; `src/lib/sim/*` | 3% | Mix: hand-written skeletons times the existing variation engine (`lib/sim/variation.ts`, `regional-cast.ts`) |
| Differential duel pool | 32 items | `src/lib/games/duel/items.ts` | 1% | Generate look-alike pairs from the 84 diagnoses (discriminating feature per pair) |
| Blitz pool | 176 | `src/lib/games/blitz/questions.ts` (from quiz path items and diagnoses) | 7% | Generate: feed straight from the Exam Prep bank and Study MCQs (8,777 items already written) |
| Formulation cases | 6 in code, 1 in DB | `src/lib/practice/formulation-cases.ts`, `formulation_cases` | under 1% | Mix: reuse Daily case and Casebook vignettes as formulation cases |
| Landmark cases | 25 | `src/lib/landmark/cases.ts` | 1% | Hand. Real history is finite; 2,500 not sensible (50 to 80 is the real ceiling) |
| Ethics, law and referral | 50 dilemmas | `src/lib/practice/ethics.ts` | 2% | Hand |
| Judgment (script concordance) | 197 in code (8 seed + generated), 67 in DB | `src/lib/practice/sct.ts`, `sct_items` | 8% | Generate (already partly parametric) |
| Two-minute clinic | 139 | `src/lib/practice/clinic.ts` | 6% | Mix |
| Criteria sort | 11 boards (16 cards each) | `src/lib/games/sort/boards.ts` | n/a | Generate from diagnosis criteria |
| Quiz path | 12 units, 26 lessons, 138 items | `src/lib/learn/content` | 6% | Retire into Exam Prep (overlap) |
| One-page summaries | 41 notes | `src/lib/learn/notes` | n/a | Hand |
| Quick Reference | 53 disorders (+ medicines and terms) | `src/lib/reference/disorders.ts` | n/a | Hand |
| Medicines | 52 entries (DB `psych_drugs` 152) | `src/lib/meds` | n/a | Hand (reference) |
| Rounds cards | 9 seeds in code, 11 in DB | `src/lib/practice/rounds-seeds.ts`, `cards` | n/a | Switch off; fine |
| Lectures | 1 course, 17 lessons | `courses`, `lessons` | n/a | Faculty recorded |

## Exam Prep questions by subject and difficulty

Difficulty 1 is easiest, 4 is hardest. Total 5,047 (1: 749, 2: 1,728, 3: 1,827, 4: 743). Every question id is unique.

| Subject | 1 | 2 | 3 | 4 | Total |
|---|---|---|---|---|---|
| Psychopathology | 68 | 159 | 161 | 66 | 454 |
| Statistics | 62 | 131 | 158 | 54 | 405 |
| Research methods | 46 | 129 | 133 | 54 | 362 |
| Psychometrics and assessment | 54 | 122 | 130 | 54 | 360 |
| Clinical therapies | 53 | 122 | 128 | 53 | 356 |
| UGC NET Paper 1 (optional) | 47 | 110 | 110 | 47 | 314 |
| Biological | 49 | 107 | 113 | 44 | 313 |
| Personality theories | 42 | 92 | 97 | 37 | 268 |
| Developmental | 41 | 88 | 96 | 37 | 262 |
| Social | 40 | 91 | 96 | 34 | 261 |
| Cognitive | 38 | 89 | 88 | 40 | 255 |
| Ethics and law | 32 | 87 | 89 | 42 | 250 |
| Learning, motivation, emotion | 31 | 71 | 71 | 31 | 204 |
| Indian psychology | 23 | 62 | 68 | 25 | 178 |
| History and systems | 24 | 50 | 58 | 26 | 158 |
| Counselling | 24 | 50 | 58 | 23 | 155 |
| Perception and attention | 23 | 54 | 53 | 23 | 153 |
| Health | 21 | 44 | 45 | 20 | 130 |
| Organisational | 18 | 40 | 45 | 21 | 124 |
| Positive | 13 | 30 | 30 | 12 | 85 |

Notes:
- The bank meets 2,500 as a whole, but the general paper (UGC NET Paper 1, 314) is larger than 15 of the 19 psychology subjects. The plan says it should never lead.
- Thinnest for the target exams (CUET PG, UGC NET Psychology, clinical entrances, MD Psychiatry): Positive (85), Organisational (124), Health (130), Perception (153), Counselling (155), History and systems (158). Biological (313) is light for MD Psychiatry depth.
- Generation is a good fit for Statistics (calculations with changing numbers), Research methods (identify the design, the variable, the threat to validity), Biological (region, transmitter, receptor facts from rule data), Psychopathology (criteria and time rules from diagnosis data) and psychopharmacology inside Clinical therapies (from `lib/meds`). Theory-heavy subjects (History and systems, Indian psychology, Personality theories, Counselling, Positive) need hand-written items.

## Study module MCQs and Q&As per module

40 modules, 1,051 sections, 2,649 interactive widgets.

| Module | MCQs | Q&As | Module | MCQs | Q&As |
|---|---|---|---|---|---|
| Brain | 267 | 70 | Exam prep | 124 | 42 |
| Statistics | 114 | 43 | Research methods | 111 | 45 |
| NET Paper 1 | 108 | 43 | Interview and MSE | 105 | 40 |
| Depression | 100 | 51 | Assessment | 97 | 42 |
| Foundations | 96 | 45 | Motivation and emotion | 95 | 45 |
| Child | 94 | 15 | Ethics and law | 94 | 42 |
| Therapies | 93 | 42 | Applied | 93 | 45 |
| More disorders | 91 | 15 | Learning and memory | 89 | 43 |
| Antidepressants | 88 | 44 | Case sheet | 88 | 42 |
| Sensation and perception | 88 | 43 | Defences | 87 | 42 |
| Substance | 87 | 15 | Neurocognitive | 87 | 15 |
| Thinking and language | 87 | 43 | Bipolar | 86 | 46 |
| Personality | 86 | 15 | Medicine profiles | 86 | 15 |
| Antipsychotics | 85 | 42 | Social | 83 | 43 |
| Anxiety | 82 | 41 | Psychodynamics | 81 | 43 |
| Personality theories | 81 | 45 | Stabilisers | 79 | 40 |
| Trauma | 78 | 39 | Lifespan | 78 | 50 |
| Psychosis | 77 | 39 | Suicide | 77 | 39 |
| OCD | 76 | 40 | Frontiers | 74 | 42 |
| Pharmacokinetics | 72 | 41 | MSE deep | 66 | 46 |

Six modules have only 15 Q&As (Child, More disorders, Substance, Neurocognitive, Personality, Medicine profiles) against about 40 elsewhere.

## Recommendation in one line per kind of content

- **Generate first (fast, rule data exists):** Rx Detective, Blitz, Duel, Clinic detective, Criteria sort, Comorbid decks, Say it clinically, Daily case variants, and the calculation and fact subjects of the Exam Prep bank. One shared generator over `lib/games/diagnoses.ts` and `lib/meds` would feed all of them.
- **Mix:** Daily case, MSE Lab and Practice MSE, Consulting room patients, Escape rooms, Formulation, Two-minute clinic.
- **Hand only, and 2,500 is the wrong target:** Ward Week, OSCE, Landmark cases, What would you do, Ethics, Casebook. Set a realistic number per section instead (for example 25 campaigns, 80 OSCE stations, 60 landmark cases).
