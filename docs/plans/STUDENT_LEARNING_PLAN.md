# Student learning experience: plan and decisions

> Status: **IN PROGRESS** on branch `admin-redesign` (one test link). Started 2026-11-06.
> Evidence: the research report (2026-11-06) summarised in §3, plus
> [design/DESIGN_INTELLIGENCE.md](../design/DESIGN_INTELLIGENCE.md). Every UI change passes the
> [Decision Framework](../design/DECISION_FRAMEWORK.md).
> No week-based timelines (owner decision): work ships in the order of §5, each step on the test link.

## 1. Owner decisions (60 questions, 2026-11-06)

| # | Topic | Decision |
|---|---|---|
| 1 | Students | All levels: BA/BSc, MA/MSc, MPhil/RCI trainees, working clinicians, so every module needs a real "Starting" level |
| 2 | Language | Plain English; hard words explained on tap |
| 3 | Pilot module | **Depression & bipolar** first |
| 4 | Module length | As long as the content honestly needs (target: deeper than 3.5 h of real work) |
| 5 | Levels | Starting → Beginner → Advanced; **unlock by passing**; test-out to skip |
| 6 | Two views | Student / Clinician **toggle on every page**, remembered |
| 7 | Sitting | 20–30 minutes per session |
| 8 | Access | Modules open to all students (not tied to lecture schedule) |
| 9 | Books | Kept in a **private Cloudflare R2 bucket**, never served to students; never committed to GitHub |
| 10 | Citations | Book + page stored, **admin-only** |
| 11 | Review | **Publish, review after** (flag "new" content) |
| 12 | ICD-11 | Short "ICD-11 says" notes where it differs |
| 13 | Psychokinesis | A **claims-vs-evidence** research-methods lesson |
| 14 | Psychodynamics | Full module (defences, attachment, object relations, transference, formulation) |
| 15 | "Status of examinations" | All of: psychedelic therapies, esketamine and new drugs, student exam prep, MSE in depth |
| 16 | Frontiers (advanced levels) | GLP-1 & mental health; HiTOP/RDoC vs DSM; computational psychiatry & AI; neuroinflammation & genetics |
| 17 | No weeks | No week timelines in plans, **and no stated week numbers in content**: students discover timings through interactions (guess, then reveal), with the fact kept in the deep view |
| 18 | Doses | Student view: typical ranges, marked educational. Clinician view: full dosing incl. titration |
| 19 | Brands | Common Indian brand names shown |
| 20 | Rx depth | **Both**: receptor-level (Stahl-style) and clinical use |
| 21–22 | Games | All eight: Daily Case, Differential Duel, MSE Lab, Ward Week, Rx Detective, Criteria Sort, Team Escape Room, Comorbid card game |
| 23 | Fun styles | All: quick arcade rounds, story campaign, puzzles, live party games |
| 24 | Timers | Only in fast-fact rounds |
| 25 | Duels | **Competitive esport style, no forgiveness**: live ranked matches, forfeits = losses, rating moves |
| 26 | Daily case | Same daily case for everyone + adaptive personal practice |
| 27 | Hints | A few free per day (then cost XP) |
| 28 | Sharing | Spoiler-free result card for WhatsApp/Instagram |
| 29 | Losing points | Claude decides → see §4.3 |
| 30 | Standing updates | Twice a week on fixed days (Mon and Thu evening IST), not after every loss |
| 31 | Streaks | Streak + one repair per week |
| 32 | Spending XP | Hints/streak repair, profile looks, bonus cases/challenges |
| 33 | Tier names | Brain-themed: **Neuron → Synapse → Circuit → Cortex → Mind** |
| 34 | Leagues | Owner unsure; two batches → Claude's design in §4.4 |
| 35 | Top % | **Everyone sees their exact percentile** (privately, on their own screen) |
| 36 | Names | Real names in cohort; alias option platform-wide |
| 37 | Batch war | Monthly, scored per active student |
| 38 | Rewards | Monthly merit certificate + special profile title |
| 39 | Badges | About 30–40 total, each hard-earned |
| 40 | Matchmaking | Similar skill |
| 41 | Placement | 15–20 question placement; ratings hidden until ~30 answers |
| 42 | Weak topics | All: fix-it lesson + quiz added, shown on map, mixed into games; **keeps adapting** |
| 43 | Today plan | Optional suggestion |
| 44 | Difficulty mix | ~70 % success target with easy and stretch items mixed in |
| 45 | AI cases | AI-made, labelled "AI case", live now; flag/remove |
| 46 | AI patient | Expand: interview, MSE, risk, scored with feedback |
| 47 | AI doubts | AI drafts, admin approves and sends |
| 48 | Case setting | Mix of Indian and global |
| 49 | Colour-blind | Settings toggle; same look (safe palette + icons/patterns) |
| 50 | Student devices | Equal mix: phone, tablet and laptop all first-class |
| 51 | Offline | No |
| 52 | Animation | Lively, Duolingo-like; respects reduce-motion |
| 53 | Helplines | One small footer line + note inside suicide/risk lessons only |
| 54 | Quick view | Opens from search, a Quick Reference A–Z page, and after a game answer |
| 55 | Cloudflare | Via a Cloudflare connector |
| 56 | Release | Test link → owner checks → "merge" |
| 57 | Custom certificate signature | Kavya Bothra, COO |
| 58 | Paragraph on verify page | Yes |
| 59 | Exam prep | UGC NET Psychology, MPhil/PsyD entrances, MA entrance (CUET PG), university semester exams |
| 60 | Branch | Same test link as the admin redesign |

Earlier the same day: doubts answered → in-app notice, then **email only if it's unopened after 48 h**;
milestones "challenging but earnable, never thousands"; admin and student sides done together; students like
the current look, so improve it rather than replace it.

### Not adopted, and why
- **"Humiliating" leaderboards / induced performance anxiety.** Controlled studies show public ranking lowers
  scores and motivation for the bottom half (Hanus & Fox 2015; Do et al. 2024; Bai & Hew). VIBHA uses hard,
  esport-style competition instead: ranked rating, relegation, "X passed you", exact private percentile,
  forfeits count. There are no public "bottom" lists.

## 2. What already exists (reuse, don't rebuild)
- `src/content/study/*`: 23 deep modules in a Markdown dialect (`src/lib/study/parse.ts`) with boxes,
  recall cards, MCQs and viva. Depression is about 7.9k words and bipolar about 5.7k.
- `src/lib/learn/*`: XP/levels engine, adaptive picker, leaderboard, scenarios, detective, concepts.
- Routes: `/study`, `/games/*` (coach, detective, lab, play, quizzes, revise, scenarios, terms), `/leaderboard`, `/today`, `/achievements`.

## 3. Research summary (report 2026-11-06)
- **What makes learning games work:** retrieval practice, spacing, interleaving of look-alikes, and immediate *explained* feedback. Narrative plus competition-with-collaboration help most. Points and badges alone add little.
- **Adaptive engine:** an Elo/IRT-style rating per skill per student and per item, a 70–85 % success target, FSRS-style spaced review, and mastery = P ≥ 0.85 with ≥ 3 correct first tries over ≥ 2 days.
- **Leaderboards:** small leagues with promotion and relegation, near-peer comparison, and an XP that rewards effort.
- **Modules:** segmenting, pre-training (glossary first), worked example → faded practice, an expertise-reversal-aware toggle, and an exit ticket.
- **Where DSMdle is weak:** AI cases with no clinical validation, no teaching, diagnosis only, no "why you're wrong", no cohorts, US-only, no adaptivity.

## 4. Designs

### 4.1 Interactive module format (extends the dialect)
New blocks:
- `:::level starting|beginner|advanced`
- `:::clinician` (shown only in the clinician view)
- `:::guess` (a slider or estimate, then reveal; replaces stated timings)
- `:::decide` (branching choice → outcome → why)
- `:::sort` (tap-to-place buckets)
- `:::build` (tick symptoms; a live criteria counter)
- `:::timeline` (place episodes on a mood line)
- `:::worked` (step reveal, then faded)
- inline `[[term]]` glossary with *what it means / why clinicians use this word / common mix-up*

### 4.2 Student model
- **Tables:** `skills`, `item_stats`, `student_skill_state`, `attempts` (append-only), `review_cards`, `confusions`, `xp_ledger`, `league_*`.
- **Ratings and calibration:** Elo with shrinking K. Ratings are computed in a Postgres function on submit. A placement set calibrates each student, and new items are marked provisional until they have about 30 responses.

### 4.3 Points (Q29, Claude's call)
- **XP** (earned, spendable) never drops for wrong answers. Practice must feel safe.
- **Rating** (ranked) drops on lost ranked matches and on **forfeits/quits (counted as losses)**.
- Rating also decays slowly after 7 days without ranked play.
- **League points** reset weekly.
- **Bad news is batched** into the twice-weekly standing update. Students never get a ping per loss.

### 4.4 Leagues (Q34, Claude's design)
- **Cohort board:** one per batch (real names), ranked on this week's League XP.
- **Weekly platform leagues:** both batches mixed; groups of ~20 by tier (Neuron → Mind). Top 5 move up, bottom 5 move down, and nobody drops out of Neuron. With few students, groups merge.
- **Platform percentile:** every student sees their exact rating percentile, privately.
- **Monthly batch war:** average League XP per active student.

## 5. Build order (each step lands on the test link)
1. Colour-blind mode; remove "Weeks …" labels; honest module time from real use.
2. Interactive dialect + glossary + Depression & bipolar pilot rebuilt (Starting/Beginner/Advanced, decisions, guesses, sorts, visuals).
3. Student model DB + Elo/FSRS engine + placement + strengths map.
4. Daily Case (beats DSMdle) + Criteria Sort + Differential Duel (ranked live).
5. Leagues, percentile, standing updates, batch war, 30–40 milestones, merit certificate.
6. MSE Lab, Ward Week, Rx Detective, Escape Room, Comorbid; Quick Reference A–Z.
7. Psychopharmacology depth (receptor + clinical, Indian brands); frontier and psychodynamics modules; exam prep.
8. AI cases (labelled), AI patient grading, AI-drafted doubt answers; books → private R2.

## 6. Owner additions (2026-11-06, 17:01)
- **Convert all remaining modules** to the interactive three-level format (not only the pilot). In progress in three batches:
  1. interview-mse, anxiety, ocd, trauma, psychosis, suicide
  2. brain, defences, assessment, case-sheet, ethics-law, therapies
  3. child, personality, substance, neurocognitive, more-disorders, medicine-profiles
- **Postgraduate prep section:** CUET-PG, UGC NET, MCP/M.Phil entrances (NIMHANS, CIP, AIIMS …), PsyD and Master's-level practice. Research first (`PG_PREP_RESEARCH.md`, `PG_PREP_BLUEPRINT.md`), then build. It includes:
  - topic notes inside existing modules
  - large, technically hard question banks
  - topic quizzes and full-length mocks that mirror each exam pattern
  - mock interviews with model answers and rubrics
  - advanced clinical, counselling, research-methods and assessment practice
- **Don't overwhelm students:** one pathway (goal → diagnostic → plan → learn in modules → practise → mocks → interview → review), showing at most 1–3 next actions at a time. Everything lives inside existing modules and one Prep section.

## 7. Owner direction (2026-11-06, 18:01): academic depth and unified prep
- **Depth:** every syllabus topic is covered in substantial depth, up to postgraduate, RCI and PhD conceptual level. The textbooks are used extensively; Atkinson & Hilgard and Bear/Connors/Paradiso were added.
- **Progression:** the three levels build on each other. Depth, technical complexity and academic language grow, and nothing is repeated in new words.
- **Q&A banks** in every module (`:::qa`), with fully developed answers: headings, bullet points, tables, examples and step-by-step reasoning. Questions are varied, with no filler.
- **Visual teaching first:** flowcharts and cycles, interactive curves, layered models, a brain map, the synapse, and guess/decide/sort widgets (see `docs/design/CONTENT_WIDGETS.md`).
- **No formal references** in student content: no book titles, citations, journals, et al., links or page numbers. Enforced by `src/content/study/no-references.test.ts`. Sources stay internal (admin-only `ref`).
- **Prep is unified:** "Psychology Entrance & Competitive Exam Preparation — CUET-PG · UGC-NET · Clinical Psychology Entrances".
  - One curriculum. Students don't choose an exam.
  - Unified diagnostic, plan, progressive practice, mock tests and interviews.
  - Exam-specific tracks are kept behind `EXAM_TRACKS_ENABLED = false` for later.
- **Review before merge:** automated gates (types, tests, the references guard, valid widget JSON), plus a level-progression review pass on each module.

## 8. Owner direction, 7 Nov 2026: one cohesive platform, fewer and clearer places

Source: the owner's 12-point review after using the platform in admin mode. These decisions override earlier ones where they differ (for example, module levels no longer lock).

Student menu (approved):
- **Home:** one Continue card, today's goal, three strongest and three weakest topics. Nothing else competing.
- **Study:** every module open to everyone; jump to any topic and back. Notes live inside each topic. Progress shown as a percentage, never estimated hours.
- **Lectures:** unchanged.
- **Medicines:** moved up, next to Exam Prep.
- **Exam Prep:** a question bank by subject, then topic. 10 questions at a time, with the answer and a full explanation; save and revisit; mock tests and interviews. No locks. Content aimed at CUET PG Psychology, UGC NET Psychology, clinical psychology entrances and MD Psychiatry level. General UGC NET Paper 1 material (higher education, NEP and so on) is optional and never leads.
- **Practice:** clinical skills on real cases: Daily case, AI patient interview, MSE, formulation.
- **Games:** only real games: timed, competitive, animated (Duel, Blitz, Ward Week, Rx Detective, Escape Room, Comorbid).
- **More:** Progress (strengths, weak spots, certificate status), Doubts, Achievements, Leaderboard, Journal.

Overlaps (approved: fold into one place each, delete nothing, old links still open):
- Coach, Quiz path and Today's practice become one "Smart practice" entry in Exam Prep.
- Clinic detective, What would you do and Say it clinically, plus the smaller practice tools, go inside Practice.

Certificate (approved): a student earns the certificate by passing every module test at 80 percent, in any order, retakes allowed. Access to content and certificate eligibility are separate.

Also required:
- Far less on screen: each page has one obvious next step; instructions cut to a line or none.
- No text overflowing boxes, on any screen size.
- Visuals that feel like a game: animated, explorable scenes (for example a nervous system students can explore and watch working), not diagrams with clickable labels.
- Brain and biology content at academic and exam depth, up to MD Psychiatry level.
- Daily case: AI case must work; drop the long how-to text; no admin-only labels or source names shown to students.
- Differential duel: clearer bot play, scoring and disorder choice.
- Admin: quick access to send login details to students, from the inbox and student list, as before.

## 9. Owner decisions, 7 Nov 2026 (after the research and audit)

Based on docs/research/PLATFORM_RESEARCH_2026_11.md and docs/research/UX_AUDIT_2026_11.md.
- **Hints and clues:** 3 free hints a day, plus spare hints earned from streaks, daily goals and quests (start 5, cap 10); once a day a student may buy 3 hints for 30 XP. Help after a wrong answer is always free. A hint lowers that question's reward, never the XP balance. From the 4th clue the student must guess before the next one. All counted on the server, limits on even if a table is missing. No hints in Duel or Blitz. One XP wallet.
- **3D:** only where seeing it in space teaches: brain explorer with guided views, a brain-scan slicer showing TMS and ECT placement, depth illusions such as the Ames room, synapses and drug journeys. Patients are illustrated characters plus short clips, not 3D bodies. Free anatomy models allowed with a credits page.
- **Libraries:** highest craft, hand-written (AI may draft, every item checked and fully explained). Minimum 500 per section now (questions, cases, scenarios, stations, passages), then expand later. No filler repetition; tag every item by topic, difficulty, learning goal and exam.
- **Review:** keep "publish first, review after" for everything, including safety items.
- **Practice tools that are switched off:** fit and merge into the current structure first; switch on only those that meet the platform standard.
