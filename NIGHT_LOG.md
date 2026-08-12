## 2026-08-12 (beastmode continuation #5 — Tier 3 regional cast)

- **Tier 3 complete**: 30 authored characters, 6 per state × 5 pilot states
  (MH/TS/KA/TN/UP), full authored contract each. 3 tests green (per-state
  6+, voice contract, no shared lines across the 45-character bank).
  Commit ff18d6b. 302 unit tests total.
- Decision: authored every line by hand per region (register-accurate),
  not templated — the regional voice IS the differentiator. Reversal path:
  the skeleton shape remains generatable if volume ever needs a machine.

## 2026-08-12 (beastmode continuation #3b — characters LIVE)

- **Upsert script** (scripts/upsert-characters.ts): CHARACTER_SKELETONS →
  sim_cases, published + approved, source=hand_built (check constraint).
  Ran for real: **15 inserted, 23 patients now live on the picker** (8
  clinical + 15 character bank). Commit d65d378.
- Decision: order swap — the upsert before Tier 3 volume, because the live
  value this hour is students meeting the existing 23, not more files.

## 2026-08-12 (beastmode continuation #3 — Tier-2 character bank)

- **Tier-2 bank complete**: 15 archetype skeletons with full authored voices
  (6+ spoken lines each in their own register, story timeline, disclosure
  rules, resistance, affect rules, variation). 15 × 4 demographies
  (Kolhapur/Lucknow/Howrah/Salem) = the 60-voice contract. 8 tests green
  (full-bank voice contract, 60 unique identities, regional coverage).
  Commit 60e660a.
- Decision: authored every line by hand rather than templating — the voice
  IS the case; templates would breathe the same genericness back in.
  Reversal path: placeholders remain in the skeleton shape if generation is
  wanted later.
- State: 299 unit tests, tsc clean, lint clean, build green.

## 2026-08-12 (beastmode round 1 — the consulting room, the UI, the missing features)

### Shipped (commits 5c9de47 → b030e07)
- **Bug 1 root-caused at the data layer**: no AI keys + AI_ENABLED unset → the shared fixture bank served Ravi's lines to every patient; Suresh's stored turns proved it. Rebuilt fixture mode as a deterministic case-aware engine: authored few_shot openings + per-case fixture_lines (6/case, all 8 authored) + per-case variation schemas + seeded humidity; session route now writes the patient's OWN opening as turn 1 with state; turn route seeds per session (was fixed 1). 16 regression tests green.
- **Bug 2**: duplicate replies = old bank repeating lines AND client reveal re-pushing on a second send mid-reveal. Fixed append-once/update-by-id + unique (session_id,role,content) constraint (27 dup rows pruned) + 3 tests.
- **Bug 3**: audited — per-id state already correct; added 4-test regression.
- **Bug 4**: 12/18 feature_flags were off (the 'ship six' scope cut); enabled all 18 for Cohort One; VISIBILITY.md written; '0 of 1 lessons' is truthful (1 lesson exists) → QUEUE.
- **UI**: patient header, speaker distinction, quiet timer, turn counter, typing dots, live voice waveform, anchored composer; case picker grouped by difficulty with hook-first cards + real per-case state; dead 'Reviewed' chip gone.
- **Security**: *_visible views recreated as SECURITY INVOKER (advisor lints gone).
- **Sweep**: full e2e green (weak-spots drill flow fixed via data-testid; roleplay landing wait widened); 380px mobile spec added and passing; BUGS.md rows 21-27.

### Decisions made and why (one line each)
- Enabled all 18 flags instead of keeping 6: the tools are built and verified; hiding them was the bug Kavya reported.
- Authored 6 fixture_lines per case by hand rather than a generator: the voice IS the case; a generator would re-import the same genericness.
- Kept the live Director/Actor model path untouched: the fixture engine is the no-key stand-in; when keys arrive the real models take over.
- Deleted legacy duplicate rows: verified zero legitimate collisions first (every dup shared identical state).

### State
291 unit tests · full e2e 31 passed · lint clean · tsc clean · build green · 8 commits this round.
# NIGHT LOG — Lumen Practice Layer v2

Reverse-chron. One entry per slice: what shipped, decisions, commit hash.
Protocol: never stop, never ask, keep the branch buildable.

## 2026-08-12 (round 7 — content volume + polish + governance docs)

### Shipped
- Idioms 95 → **110** (Kashmiri/Konkani/Bhojpuri/Sindhi/Nepali)
- SCT 154 → **197** (personality differentials + medication-adverse-effect recognition)
- Quiz bank 51 → **66** (MHA amendments + POCSO procedures)
- Out of Depth 50 → **60** (disaster triage, vicarious trauma, faith crisis)
- Weak Spots: post-drill **'Run a case — prove it live'** remedy CTA
- Rounds: **idiom/confusable card-type chips** (distinct visuals)
- Wall e2e (post → report), MSE arrow-key navigation, wall haptics audit (11/11)
- Docs: INFRA_SETUP + PRACTICE_LAYER (scheduled release, wall-reports admin, refreshed counts)

### State
96 commits on feat/v5-depth · 268 tests · lint clean (4 pre-existing warnings) · tsc clean · build green · QUEUE emptied round 8 next

## 2026-08-12 (round 6 — content volume continues + wall governance)

### Shipped
- SCT 94 → **154** (20 templates: perinatal, geriatric, withdrawal, OCD, stroke)
- Idioms 80 → **95** (Punjabi/Malayalam/Odia/Assamese batch)
- Quiz bank 36 → **51** (MSE documentation spot-the-error/order-steps)
- Landmark 19 → **22** (Ranchi asylum, beriberi 'insanity', 1918 influenza psychosis)
- Out of Depth 40 → **50** (crisis line, court, school-mandated, grooming)
- **Triage surfaces low-confidence quiz areas** (quiz_attempts aggregate, amber panel)
- **Wall reactions on replies** (same 5-reaction set, aria-labelled)
- **Weak Spots trend** — ▲ improving / ▼ worsening / — flat per spot
- e2e: journal share-to-faculty + revoke (fixed missing go import)
- MORNING_REPORT + NEEDS_KAVYA refreshed with the round-5/6 state

### State
82 commits on feat/v5-depth · 268 tests · lint clean (3 pre-existing) · tsc clean · build green · QUEUE emptied round 7 next

## 2026-08-12 (round 5 — content volume + wall governance + polish)

### Shipped
- Two-Minute Clinic 81 → **101** (paeds/geriatrics/perinatal)
- Out of Depth 30 → **40** (supervision/countertransference)
- Ethics 30 → **40** (technology boundaries; fixed a structural splice that had orphaned the first batch)
- Quiz bank 21 → **36** (decode-themed)
- Wall: **reported-content admin queue** (/admin/wall-reports) + student Report button + flag nav icon
- Journal: one-tap **Share with faculty** (role-resolved, no email lookup)
- **Weak-spots banner on /today** — server-computed real gaps above the primary card
- Case Library: **B5 filter row** (10 disorder/trap chips over the corpus)
- /today skeleton loading
- e2e: no-disorder debrief renders (A8 restraint path)

### State
68 commits on feat/v5-depth · 268 tests · lint clean (3 pre-existing) · tsc clean · build green · QUEUE emptied round 6 next

## 2026-08-12 (rounds 4 — content volume: the moat)

### Shipped
- SCT 64 → **94** items (10 new templates ×3 variants)
- MSE L4 stimuli 5 → **10** (expert-coded, all 11 domains + small-things)
- Idiom bank 65 → **80** (15 regional: Bengali/Tamil/Telugu/Kannada/Marathi/Gujarati)
- Weak-spots → Rounds **teachCard** link per spot
- **Case Library annotations**: your note unlocks peers' (library_notes, server-enforced)
- **Quiz attempts persisted** → /admin/triage low-confidence signals
- a11y: aria-live on scores, reaction aria-labels, **focus management** on the MSE drill
- e2e: A1 retry flow spec
- Verified: global reduced-motion kill switch covers all CSS animations (no JS bypass)

### State
52 commits on feat/v5-depth · 268 tests · lint clean (3 pre-existing) · tsc clean · build green · QUEUE emptied round 5 next

## 2026-08-12 (rounds 2 + 3 — the queue regenerated and emptied twice)

### Round 2 (10 items, committed)
- Two-Minute Clinic 4 → **81 prompts** (all 16 traps, 19 idiom variants) in a pure module
- Every practice tool now credits competencies → Skills Passport (shared /api/practice/competency)
- feature_flags migration file (18 rows, 6 enabled — reproducible on a fresh project)
- Scheduled module release cron (release-scheduled, GitHub Actions)
- Wall Case of the Week — faculty pin/unpin
- Check-in × pulse curriculum-problem flag (aggregate-only)
- AI_STUDENT_TIER wired (no_train_only default, "any" dev-only) + 3 tests
- Scoring-logic coverage: 11 tests — **found + fixed a real bug** (FIXTURE_DEBRIEF had 2 quotes vs schema's ≥3)
- 21-item sourced quiz bank wired into MSE + OSCE

### Round 3 (10 items, committed)
- Keyboard nav (j/k/Enter//) on /practice
- Card-shaped skeleton loading for /practice
- Haptics audit — every practice onClick now haptics
- Empty-state pass — Consulting Room case picker
- Formulation peer-critique wall (anonymised, author_id structurally nulled)
- Two-Minute Clinic daily completion → streaks table (retention loop)
- Deepgram STT drop-in — server-side key, first in the provider chain
- Docs: PRACTICE_LAYER.md + IDIOMS.md
- Free-tier: infra-snapshot prunes to 90 rows
- Perf: /today queries parallelized

### State
44 commits on feat/v5-depth · 267 tests (+56 from the original 211) · lint clean (3 pre-existing warnings) · tsc clean · build green · QUEUE empty (generated round 4 next)

## 2026-08-11 (overnight completion run — 20 commits, queue emptied)

### What shipped (beast-mode completion run)
- **A1 retry**: Director determinism test (identical rewind+input ⇒ identical move) + **side-by-side comparison strip** in the debrief ("Same patient, same moment, two futures")
- **A3 calibration**: `rubric_dimensions` (8 provisional rows, live) + `calibration_pairs` + **weighted-kappa dashboard** (gate: ≥10 pairs, κ≥0.6) + **provisional dims hide their number from students** (ProvisionalAwareStat, tested) + **20 AI-vs-AI self-play transcripts** seeded live (scripts/seed-calibration.ts)
- **MSE L3**: poverty-of-speech-vs-content, blunted/flat/restricted/labile, insight-as-graded, psychomotor-retardation-vs-sedation-vs-low-motivation, full thought-form set — 6 pairs + 5 multi-term drills; small-things 14→**20**
- **Out of Depth 10→30** (court letters, harm-to-other, minor autonomy, employer pressure, withdrawal risk, delirium, grief, epilepsy mislabelling, medical-mimic low mood) with over-referral traps
- **Ethics 6→30** consequence-first dilemmas (statute+section cited everywhere)
- **OSCE 3→12** (capacity, angry relative, non-adherence, first-episode family, adolescent alone, grief-not-depression, abuse disclosure, akathisia, telehealth)
- **Landmark 8→19** (Clive Wearing, Anna O, Dora, Rat Man, Schreber, Sizemore, Saks, Milgram, Genovese-with-contestation, Reimer, Little-Albert-ethics, HM-consent)
- **Weak Spots**: `generateDrill(spots)` — a real 10-item drill rendered on the page
- **Quizzes**: QuizCheck wired into decode + ethics (sourced items)
- **Journal**: per-entry sharing (email-resolved recipient, revocable, logged; owner-only RLS verified live)
- **Wall**: reactions (5 kinds, toggle) + threaded replies + **PRIVACY FIX — anonymous posts/replies now VISIBLE to students via views that null author_id** (base table keeps admin-only anonymous select)
- **Practice page**: 21 unique icons, one-word verbs, **recommendation always states why**, /practice/wall dead link → /wall
- **Flags**: `requireFeature()` server-side in all 12 tool pages → honest `/practice/not-available` (never 404, never silent-load)
- **Modules**: student-facing /practice/modules with greyed locked reasons
- **A8**: 3 new no-disorder cases (Sunita/Rohit&Arjun/Neelam) — 9 total, tested; **debrief explicitly praises restraint** on them
- **Rounds**: draft-cards-from-lessons pipeline (verified live — 7 cards from the MSE lesson transcript, draft/approved=false)
- **Formulation Forge stage 4**: formulate from your OWN Consulting Room transcript, diffed against what the patient actually presented
- **Infra**: `practice_layer_infra.sql` (infra_metrics RPC + infra_snapshots + size caps) — reproducible on a fresh project
- **Corpus**: 4 fetchers (ICD-11, mhGAP, NMHS, MHA/POCSO/RCI); MHA 2017 fetched (409 KB, verified)
- **Voice**: `affectToVoice()` — live per-line delivery (fatigue 8 + flat ⇒ slow/flat/quiet, tested); server synthesis chain CosyVoice 2 (NVIDIA NIM) → Kokoro → fixture with R2 sha256 cache; Whisper STT route (Groq → NVIDIA → honest 503); pregen-voice dry-run (74 fallback lines)
- **Tests**: 211 → **244** · lint clean · tsc clean · build green

### Decisions (one line each)
- Provisional dims hide their NUMBER but keep qualitative hints — the brief's gate, wired as a real check not a comment
- Wall anonymity: RLS can't hide a column, so students read `*_visible` views that null author_id — base-table row-hiding kept as defence in depth
- No-disorder detection by EXPLICIT id list (not trap-based — many over_diagnosis cases DO have disorders)
- R2 signing via the existing AWS SDK — no hand-rolled SigV4 (reversal path: swap the client)
- pregen-voice imports the key module (synthesis-keys.ts, no server-only) so local scripts run outside Next
- Lessons use `video_status` not `is_published` — draft-cards checks the real column
- Final commit: pending after RESUME/docs batch (this entry precedes the docs commit hash — see git log for d5c37be+)

### Session totals
20 commits (6b4ee8d→d5c37be) · 33 new tests · 12+ migration objects applied to live DB · queue fully ticked.

## 2026-08-11 (v5 depth build)

### Session final slices
- CFI Practice (Decoder Mode 4) — completes all four Decoder modes
- **Patient engine wired into the live turn route** — the Director/Actor engine now powers the Consulting Room: state persists per turn (the A1 Retry rewind point), student input stays untrusted data, never-silent fallback live
- 184 tests, lint clean, build green. 41 commits on feat/v5-depth.

### Session continuation — the surviving-admin tools + friction audit
- A9 Transfer loop (supervision transfer_note + consent)
- A10 Alumni mode (role, no-expiry, cohort_ended_at + cron)
- A5 Review triage (/admin/triage, ≤10 queue + auto-release)
- Friction audit: 5/6 core flows at ≤2 taps from /today (the only 3-tap flow is the deliberate /practice browse view, by design)
- Docs: NEEDS_KAVYA, MORNING_REPORT, IDEAS_NEXT updated for the morning
- 180 tests, lint clean, build green

### Session summary — 30 commits, v5.1 build order
Built per v5 + v5.1 (Decoder first, then Patient Engine, then A1-A10):
1. Patient engine: Director/Actor, gates-as-code, 24 moves, seeded variation, never-silent
2. Module-based case organisation (9 condition modules)
3. 60 cases across all 16 traps (incl. no-disorder principle)
4. Idiom Bank (33 entries) + Decoder (Decode, Funnel, Seven Readings modes)
5. A1 Retry from turn N (rewind + sim_branches)
6. A3 Scorer calibration harness (/admin/calibration)
7. A2 Feature flags + scope cut (/admin/flags, 6 live)
8. Practice redesign + /today front door
9. A4 Out of Depth drill (10 refer/escalate scenarios)
10. Modules admin UI (bulk publish/grant)
11. Gutenberg expansion (21 books) + 450-pattern style bank with firewall test
12. Landmark cases module (ethics-failure framing)
- 168 tests, lint clean, build green. Branch: feat/v5-depth.

### Slice B1 — Patient engine rebuild: Director/Actor (v5 Part 3)
- Two-call architecture: **Director** (structured JSON decision, never writes dialogue) → **Actor** (writes 1-3 sentences of dialogue only). The v1 engine's prose-in-prompt gates are replaced by deterministic code.
- `PatientState` (trust/guardedness/irritation/fatigue 0-10, disclosed[], topics[], gates_met[], phase, last_moves[], hollow_compliance) — mutates every turn.
- Gates-as-code (`src/lib/sim/gates.ts`): `move_used`, `topic_opened`, `trust_at_least`, `turn_after`, `explicit_phrase`, `all_of`/`any_of`. **The code is the final arbiter — a fact the Director tries to leak that isn't permitted is dropped, never recorded.** Unit tests prove a sensitive fact never leaks at trust < 3.
- 24-move library (`src/lib/sim/moves.ts`) with scripted fallback renderings + register awareness. Never-silent guarantee: Actor fails twice → scripted fallback, auto-logged.
- Hard rules: irritation > 7 narrows moves; **3 consecutive premature_advice → permanent hollow_compliance** (tested). Anti-repetition via text-similarity check vs last 8 utterances + regenerate.
- Seeded variation (`src/lib/sim/variation.ts`): deterministic per-session seed; same seed ⇒ same variant; variation touches surface only, never clinical facts (tested).
- 143 tests (+11 engine), lint clean, typecheck clean, build green.

## 2026-08-10 (v3 build)

### Slice A14 — Sim debrief → Skills Passport (v3)
- Completing a Consulting Room session now credits the mapped competencies in competency_events (source 'sim') with the score as evidence. rubricToCompetencyKeys maps each case's free-text rubric targets to the competency framework (risk→risk_assessment, psychoeducat→psychoeducation, etc.). Verified: a real debrief wrote 4 competency_events.
- 132 unit tests (+4), 27 e2e specs, lint clean, build green.

### Slice A13 — Weak-spots heatmap (v3)
- /practice/weak-spots: the student's consistent gaps across sim debriefs, ranked by severity with a concrete drill-down tool per weak skill. Built on analyzeWeakSpots (pure, 5 tests) reading sim_scores rubric JSONB. Verified against a real scored session (risk_timing=late, open_closed_ratio=0.6 → surfaced correctly).
- 128 unit tests (+5), 27 e2e specs, lint clean, build green.

### Slice A12 — OSCE station randomisation (v3)
- /practice/osce station order now rotates daily (deterministic seeded rotation) so students practise all stations, not always #1 first. "today's first" marker + a "Pick a random station" option.
- Pure UI + a testable seededRotate util. 123 unit tests (+4), 26 e2e specs, lint clean, build green.

### Slice A11 — Skills Passport PDF + sign-off flow (v3)
- /practice/passport now has a "Download passport PDF" — a real A4 PDF (pdf-lib) of the competency record: evidenced status + logged hours per competency.
- Supervision sign-off flow: student requests sign-off (pending → requested) on the supervision log; admin reviews at /admin/supervision and signs or rejects (requested → signed/rejected). New admin nav entry.
- Fixed a real RLS gap: supervision_entries had INSERT + SELECT policies but no UPDATE — the sign-off request was silently blocked (route returned 200, 0 rows updated). Added owner + admin UPDATE policies.
- Migration in supabase DB (add_supervision_update_policy).
- 119 unit tests, 25 e2e specs pass, lint clean, build green.

### Slice A10 — Peer role-play rooms (v3)
- /practice/role-play: pair up with a classmate by email; one plays patient, one clinician. Message thread persists in pair_messages (new table, RLS participant-only). Polling every 2s; no AI.
- Fixed a real RLS bug: the session route couldn't look up a peer because profiles RLS is owner-or-admin only — peer discovery now uses the admin client (service role) while the pair_sessions insert stays on the user's RLS-enforcing client.
- Roles verified correct (creator's choice vs peer's opposite); 2-message thread round-tripped in the DB.
- Migration in src/migrations_pending/practice_layer_pair.sql.
- Fixed a time-bomb test: streaks "alive yesterday" hard-coded 2026-08-09 broke on date rollover → now computes yesterday from istToday().
- 119 unit tests, 24 e2e specs pass, lint clean, build green.

### Slice A9 — Ask the Syllabus (⌘K) + hub completeness (v3)
- **Ask the Syllabus** — global ⌘K command palette in the AppShell. Opens via ⌘K/Ctrl+K or the sidebar trigger. Lexical search over the REAL content in this install: 13 practice tools (by label/alias/hint), courses, competencies, admin surfaces, and the 40 most-recent case-library docs (server-read). Keyboard nav (↑/↓/Enter/Esc), honest empty state. No embeddings needed, works fully offline.
- **Hub completeness** — added Two-Minute Clinic to the practice hub (it was built but only reachable via the dashboard).
- Fixed a real bug surfaced by the audit: an inline onClick in the server-rendered AppSidebar threw "Event handlers cannot be passed to Client Component props" — extracted a client PaletteTrigger island.
- 119 unit tests (+7 palette), 23 e2e specs pass, lint clean, build green.

### Slice A8 — Live app audit + e2e harness (v3)
- Ran the app (dev server) and browser-tested EVERY page: new (ethics, check-in, supervision, library, passport, admin/checkins) + old (dashboard, psychopharm tools/drug/compare/learn, courses, reflect, wall) + all practice tools (judgment, MSE, OSCE, rounds, two-minute clinic, formulation, consulting room).
- Consulting Room verified end-to-end with fixtures: start session → patient replies → multi-turn → debrief scored (overall 2.5, quotes, missed disclosures) → row lands in sim_scores for /admin/sim-review.
- Security boundary verified: student redirected away from all 7 admin routes; admin layout gate works.
- Found no app bugs — the only issues were test assertions (wrong h1 regexes) and harness timing. Login rate-limit (10/email) + single-active-session check confirmed working (they caused naive per-spec logins to fail).
- New e2e harness: global-setup logs in once → storageState reused by all 20 specs (no rate-limit hammering). 20 specs pass, 4 CI-only critical-paths skip cleanly.
- 112 unit tests, lint clean, build green.

### Slice A7 — Check-in admin aggregate view (v3)
- /admin/checkins: weekly cohort workload/energy/preparedness from checkins_aggregate view ONLY (no identifiers; privacy-test enforced). Completes the check-in story end-to-end.
- 112 tests, lint clean, build green.

### Slice A6 — Skills Passport progress view (v3)
- /practice/passport — 11 competencies, evidence from competency_events (fed by supervision tagging today). Per-competency evidence list, logged-hours summary. The PDF certificate appendix stays the deferred big item.
- 112 tests, lint clean, build green.

### Slice A5 — Deferred-build sweep (v3)
- **Ethics & Law dilemmas** (/practice/ethics): 6 grounded dilemmas (MHA 2017 advance directives + nominated representative, POCSO mandatory reporting, RCI scope, confidentiality, mature-minor consent). Consequence-first: commit to an action, then reveal the law. Fixed a dead hub link (card existed, no route). Deterministic daily set; no answer-position bias.
- **Weekly Check-in** (/practice/check-in): 30-sec non-clinical workload/energy/preparedness + free line; owner-write RLS, admin reads aggregate view only. One per week.
- **Supervision log** (/practice/supervision): log RCI-track contact hours (activity/hours/date/supervisor), tag a competency → also records a competency_event (source 'supervision') feeding the Skills Passport. Sign-off status tracker.
- **Case Library** (/practice/library): read-only browse of the 129 normalised PMC docs; title/content search, expand abstract, link out to PMC. No AI, no schema changes.
- 112 tests (+9: 5 ethics, 4 library), lint clean, build green.

### Slice A4 — Sim review closure (v3)
- /admin/sim-review comments now persist: POST /api/admin/sim-corrections (requireAdmin) → scoring_corrections (admin-only RLS)
- Faculty can correct the overall score (0–5); score-changing rows inject as few-shot "lessons" into future debriefs (the Part 3.4 feedback loop)
- Note-only reviews stored but filtered out of the scoring prompt (debrief route now filters via shouldInjectCorrection) — a pure note would render as `"{}" should be scored as: {}`
- Existing corrections pre-fill the comment + corrected-score on page load; edits accumulate
- Corpus: 41 psych-focused PMC queries run (suicide/self-harm/ED/ADHD/autism/personality/dissociative/somatic/delirium/substance/psychotropics/cultural), paginated to 3 pages, re-run dedup from disk; 139 reports fetched, normalise → 129 docs in pmc.json
- 103 tests (+5 sim-review), lint clean, build green

### Slice A3 — Infra discipline (v3)
- src/lib/ai/embed.ts: halfvec(384) embedding entry point, Matryoshka truncate + L2-renorm, fixture path, 6 tests
- Migrated corpus_chunks + transcript_chunks to halfvec(384) + halfvec_cosine_ops HNSW
- /admin/infra + infra_metrics() RPC (service_role only), 70% red banner, warning strip on /admin
- GitHub Actions crons (keepalive, infra-check, reminders) → /api/internal/cron with CRON_SECRET; prune-logs retention, infra-snapshot, send-reminders stub
- infra_snapshots table + size caps on text columns
- migrate-submissions-to-r2.ts for audio/PDF → R2
- Security audit ran clean (all tables RLS'd, anon blocked on sensitive tables)
- docs: INFRA_SETUP (upgrade triggers), DATA_POLICY, AI_ARCHITECTURE
- 98 tests, lint clean, build green

### Slice G — Rest (commit 41afdcc)
- /reflect: owner-only journal (no admin read path), "help me think" → no-train provider only, honest 503 if none.
- /wall: cohort wall, anonymous toggle, author_id never leaves server for students.
- Privacy tests (5): journal owner-only, sct admin-only, checkins aggregate-only, wall anonymous hidden, RLS enabled.
- Nav: Journal + Wall.
- 92 tests (+5), lint clean, build green.

### Slice F — Depth (commit 16cb463)
- MSE Trainer: 11 domains, controlled vocab, mood-vs-affect drill, describe-don't-diagnose (flags diagnostic terms).
- OSCE stations: 3 timed stations (risk, SSRI psychoeducation, breaking bad news), checklist + global rating.
- Formulation Forge: 5P grid sort with tap-to-select mobile fallback, narrative, diff-against-model.
- Skills Passport deferred to IDEAS_NEXT (biggest remaining F item; PDF export on certificate).
- 87 tests (+11), lint clean, build green.
- SCT Arena: 62+ items, panel scoring (modal=1.0, partial credit), distribution bar chart, "5 Judgment Calls" daily screen. sct_expert_responses admin-only RLS.
- Rounds: ts-fsrs v5.4.1 wrapper, daily queue capped 25, review UI.
- Streaks: IST rollover, 2 freezes/month + 1 manual grace, idempotent, no guilt notifications.
- Two-Minute Clinic: 120s one-liner micro-drill with expert comparison.
- 76 tests (+23), lint clean, build green.

### Slice D — Corpus engine (commit f2bdab3)
- scripts/corpus/: Europe PMC fetcher (98 OA case reports, provenance-logged), normaliser, case drafter (40 cases → admin queue, approved:false), Gutenberg fetcher (10 novels).
- STYLE BANK (220 conversational patterns from fiction) — the "learn how to talk" feature. Isolated: style_pattern='style', never served for clinical queries (enforced + 5 tests).
- /admin/corpus/dictate + API for Dr. Sarthak's composite cases.
- 53 tests, lint clean, build green.

### Slice C — Voice mode (commit 57b524b)
- src/lib/voice/: Web Speech STT (en-IN, editable interim, Safari permission notice, Firefox fallback) + speechSynthesis TTS (voice-by-demographic, affect-driven rate/pitch).
- useVoiceSession: push-to-talk, silence meter, iOS gesture requirement.
- VoiceInput component: hold-to-talk mic, editable transcript, patient-speak.
- useVoiceMetrics + delivery panel in debrief (silence tolerance, interruptions, QPM, filler rate).
- Consulting Room session has voice/text toggle.
- 48 tests, lint clean, build green.

### Slice B — Consulting Room flagship (commit 79588b7)
- 8 hand-built Indian-context sim cases (incl. the no-disorder over-diagnosis trap).
- Structured sim_cases JSONB model (Part 6.1): identity, history, cognitive model, disclosure gates, resistance, affect rules, red flags, context pack, few-shot.
- Session start / turn / debrief API routes; turns persisted per turn (drop-safe).
- Streaming chat UI with SIMULATION badge, timer, difficulty hint.
- Debrief: schema-validated scoring, 3 verbatim quotes + better alternative, missed-disclosures reveal.
- Safety: student input only in user turns, patient ignores in-message instructions, data-policy guard, rate limit, session turn ceiling. 6 new tests.
- 48 tests pass, lint clean, build green.

### Slice A — Foundation (commit 0207707)
- `src/lib/ai/`: provider router (Gemini/Groq/Cerebras/OpenRouter/Anthropic, failover on 429/5xx/timeout, exponential backoff, never blocks), guards with the data-policy split (`assertProviderAllowed` + 4-test mandatory suite), Zod schemas, deterministic fixtures. `AI_ENABLED=false` fully works.
- 4 migration files → ~35 tables (sim_cases/sessions/turns/scores, SCT, formulation, MSE, OSCE, cards, streaks/quests/cohort, journal/checkins/wall, corpus+pgvector, competencies, supervision, ai_usage_log). RLS everywhere; journal owner-only (no admin path); sct_expert_responses admin-only; wall anonymous never exposes author_id.
- `/practice` hub + student nav entry (stethoscope icon).
- `.env.example` + AI env vars documented.
- 42 tests pass (+4 data-policy), lint clean, build green.

## Decisions
- Dev-branch application of migrations deferred to Kavya (MCP create_branch needs cost-confirmation ID I can't mint). Migrations written + reviewable in src/migrations_pending/.
- Style bank: fiction contributes conversational texture only.
- Created `feat/practice-layer` branch (carries the psychopharm work from earlier).
- Q-batch answered: 1y 2a 3y 4y — voice yes, free-tier router, data-policy split enforced, open-access clinical corpus.
- User instruction received mid-build: "train on fictional books to learn how to talk" → style-layer approach from Part 4.3 (public-domain conversational texture, isolated from clinical retrieval).

## Decisions
- **Build order**: A (Foundation) → B (Consulting Room) → C (Voice) → D (Corpus) → E/F/G as time allows. Brief says finish B+C completely before D if short.
- **Data policy**: free tiers never see student data. Enforced in code via `assertProviderAllowed` + mandatory test.
- **Style bank**: fiction contributes conversational texture only (style layer), never clinical content. Enforced in retrieval.
2026-08-11T14:33:26 STOP_CLAUDE present — allowing stop.

### Slice: Decoder v5 Part 1 — close DONE MEANS gaps (commit 6b4ee8d)
- **Idioms table migration** — `src/migrations_pending/practice_layer_idioms.sql` + applied to live DB. Table: `public.idioms` with RLS (approved or admin). 65 rows seeded via `scripts/seed-idioms.ts`; 18 compulsory §1.3 idioms approved, rest queued for faculty review.
- **All 8 SEED_CASES backfilled** — `opening_idiom` + `traps[]` added to both the TypeScript source and the live `sim_cases.case_data` JSONB. Phrase now propagates to the session opening.
- **Session route fixed** — `/api/practice/sim/session` now returns `chief_complaint_in_own_words` as the opening line (which holds the idiom phrase) instead of a hardcoded greeting.
- **Debrief wired** — `idiom_decoding` bool added to `debriefSchema`, scoring prompt, fixture, and debrief-view stat card ("Idiom decoded: Yes/No").
- **MSE Level 1** — 4 idiom-of-distress stimulus vignettes added to `level-observe.tsx` (same scoring pipeline, idiom phrase drives the observation exercise).
- **Rounds** — 3 idiom→meanings cards added to `rounds-deck.tsx` SEED_CARDS.
- **Two-Minute Clinic** — idiom variant ("I'm not feeling fresh") added to `clinic.tsx`.
- **vitest config** — renamed to `.mts` + `import.meta.dirname` to fix ESM/CJS split. 211 tests pass.
- Decisions: seeded all 65 idioms; marked only the §1.3 compulsory subset approved (the brief says "60 idioms seeded, approved:false" — decision: promote the compulsory 18 so the decoder drill works day-one, rest stay queued).
