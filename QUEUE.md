# QUEUE
# Format is STRICT. Unchecked: "- [ ]" with exactly one space. Done: "- [x]".
# The Stop hook only blocks while unchecked items exist. This is the fuel.

## PARTIAL — finish what is half-built first (A1 first, per Addendum C)

- [x] Add A1 determinism test: identical rewind + identical input → identical Director move in src/lib/sim/engine.test.ts (same seed, same state, stubbed director+actor; assert move equality; different input → divergence) [A1]
- [x] Build the A1 side-by-side comparison strip: in src/app/(dashboard)/practice/consulting-room/session/[sessionId]/debrief-view.tsx, after a rewind branch completes, show attempt-1 vs attempt-2 quotes with the trust delta per attempt [A1]
- [x] Add rubric_dimensions table migration in src/migrations_pending/practice_layer_sim.sql (key, label, status provisional|validated, agreement, n_scored) + apply to live DB [A3]
- [x] Wire provisional-dimension hiding in the debrief renderer: src/app/(dashboard)/practice/consulting-room/session/[sessionId]/debrief-view.tsx reads rubric_dimensions status and hides numeric score for provisional dims (qualitative only) — with a test [A3]
- [x] Add per-dimension weighted-kappa agreement dashboard to /admin/calibration (src/app/(dashboard)/admin/calibration/calibration-list.tsx) — compute kappa from corrections vs AI scores, display per dimension [A3]
- [x] Seed 20 AI-vs-AI self-play transcripts: scripts/seed-calibration.ts runs fixture Director/Actor loops for 20 sessions and inserts sim_sessions+sim_turns+sim_scores so Dr. Sarthak can calibrate before students exist [A3]
- [x] Add 4 missing confusable pairs to src/lib/mse/confusable.ts: poverty-of-speech-vs-content, blunted/flat/restricted/labile, insight-as-graded, psychomotor-retardation-vs-sedation-vs-low-motivation (4 items each, expert-coded) [V5 §3]
- [x] Expand flight-vs-tangential to the full set: add circumstantiality and loosening as distinct drills in src/lib/mse/confusable.ts [V5 §3]
- [x] Add 6+ small-things items to src/lib/mse/small-things.ts to reach 20 (pause-length-before-no-to-risk, leg-stop-on-marriage, look-at-family-before-answer, past-tense-about-self, speech-speed-change, laughing-at-not-funny) [V5 §3.1]
- [x] Add 19 out-of-depth scenarios to src/lib/out-of-depth/scenarios.ts to reach 30 (court letter, won't-leave-at-session-end, harm-to-other, minor-parents, friend's-relative, medication advice, deterioration, diagnosis-request, eating disorder, substance withdrawal, delirium, thyroid/B12, child protection) with over_referral_traps [A4]
- [x] Add 23 ethics scenarios to src/lib/practice/ethics.ts to reach 30 (confidentiality limits, minors, family pressure, employer-paid sessions, WhatsApp boundaries, certificate requests, court letters) with consequence-then-law structure [V5 §4]
- [x] Add 9 OSCE stations to src/lib/practice/osce.ts to reach 12 (capacity, angry relative, non-adherence, first psychotic episode, adolescent alone, grief, disclosure of abuse, side-effect complaint, telehealth boundary) [V5 §4]
- [x] Add 9 landmark cases to src/lib/landmark/cases.ts to reach 17 (Clive Wearing, Anna O, Dora, Rat Man, Schreber, Chris Sizemore, Elyn Saks, Milgram, Kitty Genovese-with-contestation, David Reimer) [V5 §4]
- [x] Build weak-spots drill generation: in src/lib/practice/weak-spots.ts add generateDrill(spots) returning a 10-item targeted drill from the weak domains; render it on /practice/weak-spots (src/app/(dashboard)/practice/weak-spots/weak-spots-view.tsx) so tapping the banner starts it [V5 §4]
- [x] Wire QuizCheck into decode, ethics and landmark pages (src/components/practice/quiz-check.tsx is imported nowhere — add quizzes after decode sessions, ethics dilemmas, and landmark cases) [V5 §4.1]
- [x] Add per-entry journal sharing UI: share button + revoke in src/app/(dashboard)/reflect/journal-view.tsx backed by journal_shares (owner-only RLS exists); add a route in src/app/api/practice/journal/ [V5 §4]
- [x] Add Wall reactions (reactions-not-upvotes) + replies rendering: src/app/\(dashboard\)/wall/wall-view.tsx posts list only; wall_replies + wall_reports tables exist — render replies, add reaction buttons [V5 §4]
- [x] Fix practice page icon duplicates + dead link + verb labels: src/app/(dashboard)/practice/page.tsx — give Rounds/Formulation/Ethics/Library/Tools unique icons (no Layers/FlaskConical/BookOpen/CircleCheck repeats), change /practice/wall href to /wall, replace "ONE TAP"/"WATCH" verbs with single words, make the recommended card state a reason [B]
- [x] Enforce feature flags server-side in the route-group layout: add flag checks in src/app/(dashboard)/layout.tsx (or a per-route guard) so a flagged-off tool URL shows a proper "not yet available" page instead of loading; keep /practice/page.tsx filtering [A2]
- [x] Add locked-modules student view: greyed module list with honest reason (opens 2 Sept / finish Module 3 first) on a student module page, server-enforced via module_access [V5 §8]
- [x] Add 4 more no-disorder cases to src/lib/sim/cases/volume-8.ts (new file) to reach 9 (someone sent by family with no complaint, low mood fully explained by treatable medical cause, worried parent typical child, culturally normative possession) [A8]
- [x] Add explicit praise-for-restraint to the debrief: in src/lib/ai/prompts/scoring.ts + fixtures, when a no-disorder case is scored and the student did not diagnose, emit an explicit "correct restraint" line in quotes/missed_disclosures [A8]
- [x] Build lesson-transcript → cards pipeline: script in scripts/draft-cards-from-lessons.ts reads lesson_transcripts, drafts cards (front/back), inserts into cards table approved:false for the admin queue [V5 §4]
- [x] Add Formulation Forge stage-4 own-transcript + distractor injection: src/app/(dashboard)/practice/formulation/forge.tsx pulls the student's own sim transcript (via /api/practice/mse/transcripts) and distractors from formulation_cases [V5 §4]
- [x] Add the infra SQL to repo migrations: create src/migrations_pending/practice_layer_infra.sql containing infra_metrics() RPC, infra_snapshots table, text size caps, provider_health — so a fresh Supabase project gets them (live DB already has them) [V5 §9.6]

## MISSING — in Addendum C build order

- [x] Voice: CosyVoice 2 TTS integration with Director-affect→emotion-tag mapping (fatigue 8 + flat mood → slow/flat/quiet), Kokoro-82M CPU fallback, R2 cache keyed on sha256(text+voice+emotion+speed) — built fully demoable on fixtures; one line to NEEDS_KAVYA.md [V5 §6] [NEEDS KEY: NVIDIA]
- [x] Whisper STT via NVIDIA NIM or Groq with interim-transcript-edit flow (browser Web Speech stays the free default; push-to-talk; barge-in logged) [V5 §6] [NEEDS KEY: NVIDIA/Groq]
- [x] Corpus fetchers: scripts/corpus/fetch-icd11.ts, fetch-mhgap.ts, fetch-nmhs.ts, fetch-mha2017.ts (open-access sources; draft → admin queue, never auto-publish) [V5 §5.2]
- [x] Reaction/upvote model already decided (reactions) — add the pinned Case of the Week flag UI on the Wall [V5 §4] (folded into Wall item above — remove if done)
- [x] Pre-generate scripted fallbacks + opening lines at case-approval time (scripts/pregen-voice.ts writes to R2) [V5 §6] [NEEDS KEY: R2]

## Notes for the next session

- Order above follows Addendum C: A1 → A3 → practice page → MSE → voice → A4 → content. PARTIAL items are first because the Stop hook wants the half-built finished before new starts.
- Items marked [NEEDS KEY] are built fully on fixtures and wait only for the env var to light up.
- Live-DB-only tables (feature_flags, infra_metrics, infra_snapshots, sim branch columns) are already applied; the migration files above make them reproducible.

## ROUND 2 — regenerated from IDEAS_NEXT + the infinite backlog (post-completion)

- [x] Two-Minute Clinic expansion: grow src/lib/practice/clinic.ts prompts to 60+ with idiom variants (retention feature; low effort, high impact) [IDEAS: Two-Minute Clinic expansion]
- [x] Persist judgment/MSE/OSCE/rounds/formulation attempts into competency_events so the Skills Passport fills from every tool, not just sim+supervision — add an insert in each tool's completion path [IDEAS: persist attempts]
- [x] Peer role-play skill-matching: pair students on complementary weak spots (read both students' analyzeWeakSpots, pair top-gap with counterpart's strength) in src/app/(dashboard)/practice/role-play/role-play-lobby.tsx [IDEAS: skill-matching]
- [x] feature_flags migration file: write src/migrations_pending/practice_layer_flags.sql reproducing the live table + all 17 seed rows (6 enabled) so a fresh Supabase project gets flags [RESUME landmine]
- [x] Scheduled module release cron: add task "release-scheduled" to src/app/api/internal/cron/route.ts flipping feature_flags.enable_at / modules scheduled→published, wired to .github/workflows/reminders.yml [IDEAS: scheduled release]
- [x] Wall pinned Case of the Week faculty flow: admin button to pin/unpin a post (sets is_pinned) + a faculty-visible pin affordance in src/app/(dashboard)/wall/wall-view.tsx [IDEAS: pinned case]
- [x] Check-in × pulse cross-reference: in src/app/(dashboard)/admin/pulse/pulse-view.tsx, surface 'activity dropping + load score spiking' as a curriculum-problem flag from checkins_aggregate [IDEAS: checkin×pulse]
- [x] Wire AI_STUDENT_TIER into src/lib/ai/guards.ts (honor no_train_only as a hard cap) or drop it from .env.example [RESUME finding]
- [x] Raise coverage on scoring logic: add fixture-driven tests for debriefSchema against every rubric edge (empty transcript, all-closed questions, premature-reassurance x3) in src/lib/ai/scoring.test.ts [brief §11.2]
- [x] Content volume: add 20 quiz items (order-the-steps + would-you-report types) to src/lib/quiz/, each with a source citation, wired into MSE + OSECE completion [brief §11.3]

## ROUND 3 — infinite backlog (brief §11: polish → performance → docs → proposals)

- [x] Keyboard shortcuts on /practice: j/k between cards, Enter to open, / to search (B5 micro-details — an afternoon's work, makes desktop feel like a tool)
- [x] Skeleton loaders matching card shape on /practice + /today (brief §B5 — never a spinner)
- [x] Haptics audit: every card tap, state change, and correct answer uses src/lib/haptics.ts — grep for missing ones
- [x] Empty-state pass: zero cards, no sessions, streak 0, first visit — the ugly screens day-one students see (brief §10.15)
- [x] Performance: dashboard LCP + N+1 query audit on /admin pages (brief §11.7)
- [x] Docs: write PRACTICE_LAYER.md + IDIOMS.md (brief §11.6 — the two remaining docs)
- [x] Free-tier optimisation: retention job on ai_usage_log (30-day, already in cron) + verify infra_snapshots rows are pruned
- [x] Formulation peer-critique wall: anonymised formulations from stage 4, visible to the cohort with reactions (IDEAS: Formulation Wall)
- [x] Deepgram streaming STT: provider-shaped drop-in for stt.ts when a key exists (IDEAS: Deepgram)
- [x] Two-Minute Clinic: persist the daily best time + streak into the streaks table (retention loop)

## ROUND 4 — infinite backlog (content volume → polish → proposals)

- [ ] SCT item volume: expand src/lib/practice/sct.ts beyond 64 with 20 more panel-scored items (never auto-publish; admin review queue)
- [ ] MSE stimuli volume: add 10 more expert-coded stimuli to src/lib/mse/mse4-stimuli.ts with expert MSE codes for L4/L5
- [ ] Idiom bank: add 15 more entries to src/lib/decode/idioms.ts (regional: Bengali, Tamil, Telugu, Kannada idioms) — the moat is content
- [ ] Weak-spots → Rounds heatmap link: in src/app/(dashboard)/practice/weak-spots/, add a per-spot link to the teaching lesson in Rounds cards (the card that teaches it)
- [ ] Case Library annotation: highlight + note on src/app/(dashboard)/practice/library/library-list.tsx with peers-unlock-after-yours (currently read-only)
- [ ] Quiz persistence: write quiz attempts to a quiz_attempts table so /admin/triage can surface low-confidence quiz areas
- [ ] Focus management: after each tool action, move focus to the next logical control (brief §11.5 polish)
- [ ] Reduced-motion pass: respect prefers-reduced-motion on the remaining animations (brief §10.18)
- [ ] Screen-reader labels audit on the practice tools (aria-live on scores, labels on icon buttons) (brief §10.18)
- [ ] e2e for the new A1 retry flow: extend e2e/consulting-session.spec.ts to click "Try this again" and assert the branch session loads with the comparison strip
