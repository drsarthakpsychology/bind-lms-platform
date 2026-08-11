# AUDIT — Gap report vs briefs (2026-08-11, night session)

Verified on disk + live Supabase DB this turn. Build state: **lint clean, tsc clean, 211 unit tests pass, 34 e2e specs, `npm run build` green.**

Status key:
- **BUILT** — exists, wired, tested, DONE MEANS passes
- **PARTIAL** — started; named gaps
- **HOLLOW** — exists but does nothing real
- **MISSING** — not on disk

| Feature | Status | Files that exist | What is missing | Needs key? | Brief ref |
|---|---|---|---|---|---|
| Decoder — idiom bank | BUILT | `src/lib/decode/idioms.ts` (66 entries), `src/migrations_pending/practice_layer_idioms.sql`, live DB 65 rows / 18 approved | "not feeling fresh" has 6 readings incl. constipation + non-restorative sleep ✓; Dhat/Koro/possession/BP high/nazar/vaat-pitta all present ✓ | no | V5 §1.3 |
| Decoder — 4 modes | BUILT | `decode-arena.tsx`, `funnel-drill.tsx`, `seven-readings.tsx`, `cfi-drill.tsx` + `src/lib/decode/*` (tests) | All playable; Funnel card taught in-app (open→specify→instantiate→quantify→contextualise→attribute) ✓; physical-miss 1.5× in `scoreDecode` ✓ tested | no | V5 §1.4 |
| Decoder wiring | BUILT | sim openings (`opening_idiom` on all 8 seed cases + 61 depth cases), debrief `idiom_decoding` line, MSE L1 stimuli, rounds idiom cards, clinic variant | ✓ | no | V5 §1.5 |
| Patient engine — Director/Actor | BUILT | `src/lib/sim/{director,actor,engine,gates,moves,types,variation}.ts` + `engine.test.ts` | Director JSON-only, Actor dialogue-only, gates-as-code, never-silent, seeded variation, hollow_compliance on 3× premature advice — all tested ✓ | no | V5 §2 |
| Patient engine — 24 moves | BUILT | `src/lib/sim/moves.ts` | All 24 with fallback lines; register-specific exemplars = identity-driven prompt (language_mix/register per case) | no | V5 §2.3 |
| Patient engine — gates | BUILT | `src/lib/sim/gates.ts` + 3 gate-leak tests | `evaluateGate` covers move_used/topic_opened/trust_at_least/turn_after/explicit_phrase/all_of/any_of ✓; **gate `idiom_clarified` is typed but not evaluated** | no | V5 §2.5 |
| Patient engine — turn route | BUILT | `src/app/api/practice/sim/{session,turn,debrief,rewind}/route.ts` | Turn persists PatientState per turn (rewind point) ✓; token ceiling 120 turns ✓; student input never in system prompt ✓ | no | V5 §2.9 |
| Retry from turn N | PARTIAL | `rewind/route.ts`, debrief "Try this again" buttons, `sim_branches` table (in `practice_layer_pair.sql`), 3-branch cap ✓ | **A1 DONE MEANS gaps: (1) no determinism test** (identical rewind+input → identical move), **(2) no side-by-side comparison strip** (attempt 1 vs 2 with trust delta) | no | A1 |
| Scorer calibration | PARTIAL | `/admin/calibration` page + list, blind-then-reveal, corrections → `scoring_corrections` → debrief few-shot ✓ | **`rubric_dimensions` table MISSING from DB + migrations** — provisional-dimension number-hiding can't work; **no weighted kappa/agreement dashboard; no 20 AI-vs-AI self-play transcripts** | no | A3 |
| MSE 5-level ladder | BUILT | `src/lib/mse/ladder.ts` + `level-{observe,domain,full-mse,live-mse}.tsx`, `mse-ladder.tsx` gating | All 5 levels gated in order, L1 flags diagnostic terms (tested), L2 11 domains controlled vocab, L4 10-min green/amber/red, L5 own-transcript via `/api/practice/mse/transcripts` ✓ | no | V5 §3 |
| MSE confusable pairs | PARTIAL | `src/lib/mse/confusable.ts` (6 pairs) | Brief lists 10: **missing poverty-of-speech-vs-content, blunted/flat/restricted/labile, insight-as-graded, psychomotor-retardation-vs-sedation-vs-low-motivation, and the full flight/tangential/circumstantial/loosening set** (only flight-vs-tangential exists) | no | V5 §3 |
| MSE small-things drill | PARTIAL | `src/lib/mse/small-things.ts` (14 items), `small-things-drill.tsx` | **≥20 required — 14 exist**; the "how long was the pause before 'no' to risk" and "leg stop moving" items exist but need 6+ more | no | V5 §3.1 |
| Voice — CosyVoice/Kokoro/Whisper | PARTIAL | `src/lib/voice/{tts,stt,use-voice,use-voice-metrics}.ts`, `VoiceInput`, `useVoiceSession` | Browser speechSynthesis + Web Speech only. CosyVoice 2 / Kokoro / Chatterbox / Whisper-NIM **not implemented** (needs NVIDIA key + R2 cache); affect→rate/pitch mapping ✓ exists via `affect_rules`; voice metrics in debrief ✓ | **yes (NVIDIA)** | V5 §6 |
| Practice redesign | BUILT | `/today` front door (primary card + chips + streak), `/practice` browse (verb labels, state chips, time badges, weak-spots banner) | ✓ mostly. **Icon duplicates**: Layers×2 (Rounds+Formulation), FlaskConical×2 (Ethics+Out of Depth), BookOpen×2 (Library+Landmark), CircleCheck×2 (Two-Minute Clinic+Check-in). **`/practice/wall` is a dead link** (Wall lives at `/wall`). Eyebrow "ONE TAP" and "WATCH" are not single verbs. Recommended card on /practice **doesn't state a reason** (only /today has reason text) | no | B |
| Mobile | BUILT | Bottom tab bar (commit 921d799), one-tap cards | 380px not re-verified this turn; tap-count from /today = ≤2 (logged) | no | V5 §7 |
| Modules + flags | BUILT | `modules`/`module_items`/`module_access` (migration + live), `/admin/modules` bulk UI, `feature_flags` (live 17 rows, 6 enabled), `/admin/flags` | Preview-as-student button just selects (doesn't navigate). **Flags only checked in `/practice/page.tsx` — NOT in route-group layout** (direct URL to flagged-off tool still loads). No "not yet available" page for flagged-off routes | no | V5 §8, A2 |
| Out of Depth | PARTIAL | `src/lib/out-of-depth/scenarios.ts` (11 scenarios), drill UI, over/under referral tracked + tested | **30 scenarios required — 11 exist**; statute citations only in reasoning text (MHA/POCSO cited in some) | no | A4 |
| 60 cases / 16 traps | BUILT | `src/lib/sim/cases/*.ts` — 61 authored cases (56 counted by id pattern + module aggregates), all 16 traps ≥2 (provenance_contradiction is lowest at 2, ≤6 cap ✓) | **No-disorder count**: presentation-text grep finds ~5-6 clear no-disorder cases (normal grief, adolescent withdrawal, exam anxiety, non-recurrent panic, possession) — brief wants **9**; **debrief does not explicitly praise correct restraint** (no such language in debrief prompt) | no | V5 §5.1, A8 |
| Lonazep case | BUILT | `src/lib/sim/cases/volume-1.ts` (polypharmacy/provenance/treatment-mismatch multi-trap case) | ✓ present | no | V5 §5.1 |
| Corpus + style bank | BUILT | `scripts/corpus/` PMC fetcher (139 reports → 129 docs), Gutenberg (21 books), `style-bank.json` (450 patterns), firewall enforced + tested | ICD-11/mhGAP/NMHS/MHA fetchers **not in repo** (noted in IDEAS_NEXT as "scaffolds written" but absent) | no | V5 §5.2 |
| Dictate-as-conversation | BUILT | `/admin/corpus/dictate` conversation UI, `/api/practice/corpus/dictate/{turn,complete}` with fixture interviewer | ✓ works on fixtures | no | A7 |
| Judgment Calls (SCT) | BUILT | `src/lib/practice/sct.ts` — 10 seed + 54 generated = 64 items, modal=1.0 scoring, panel distribution shown, `sct_expert_responses` admin-only RLS + test | ✓ exceeds 60 | no | V5 §4 |
| Formulation Forge | BUILT | `forge.tsx` with distractors, tap-to-select-then-tap-to-place fallback | Stage 4 on own transcript + peer-critique wall **not built** (forge uses seed cases only) | no | V5 §4 |
| OSCE | PARTIAL | `src/lib/practice/osce.ts` (3 stations), `osce-station.tsx` | **12 stations required — 3 exist** (risk, SSRI explanation, breaking news). Voice-first not implemented (voice only in Consulting Room) | no | V5 §4 |
| Rounds | PARTIAL | `rounds.ts` ts-fsrs v5 wrapper, 25/day cap, "you're done", 9 seed cards (3 idiom) | **Lesson-transcript → admin queue auto-draft pipeline missing**; weak-spots heatmap → teaching lesson link missing | no | V5 §4 |
| Ethics & Law | PARTIAL | `src/lib/practice/ethics.ts` (7 scenarios, consequence-first + statute with section cited) | **30 required — 7 exist**; consequence "unfolds two steps later" is single-step reveal | no | V5 §4 |
| Weekly check-in | BUILT | non-clinical workload/energy/preparedness/free-line, aggregate view only, no PHQ/GAD ✓ | ✓ | no | V5 §4 |
| Journal | PARTIAL | owner-only RLS + test ✓, "help me think" no-train-only ✓ | **Per-entry sharing has table (`journal_shares`) but no UI/route** — page says "unless you share one" but there's no share button | no | V5 §4 |
| Wall | PARTIAL | anonymous toggle ✓, author_id never leaves server (policy + test) ✓ | **No reactions (reactions-not-upvotes) and no replies rendering** (wall_replies table exists, view renders posts only); no pinned Case of the Week UI | no | V5 §4 |
| Case Library | PARTIAL | browse + search of 129 PMC docs ✓ | **Annotate/highlight + unlock-peers feature missing** (read-only browse only) | no | V5 §4 |
| Skills Passport | BUILT | 11 competencies + evidence drill-down + **PDF download** (`/api/practice/passport/pdf`, pdf-lib) ✓ | Radar chart not present (list view instead); certificate appendix = the PDF ✓ | no | V5 §4 |
| Two-Minute Clinic | BUILT | 120s one-liner drill with expert comparison + idiom variant | ✓ (retention feature present) | no | V5 §4 |
| Peer Role-Play | BUILT | pair by email, roles, persistent messages, polling, zero AI ✓ | Observer checklist + timer not in room (room has polling only) | no | V5 §4 |
| Weak Spots | PARTIAL | banner + analysis + remedy links ✓ | **"Generate a 10-item drill on the spot" NOT built** — banner links to /practice/weak-spots which lists remedies, no drill generation | no | V5 §4 |
| Landmark cases | PARTIAL | 8 cases (Gage, HM, Little Albert, Genie, Rosenhan w/ contestation, Stanford w/ reassessment, Erwadi/MHA) + inline quizzes | Brief lists 17 incl. Clive Wearing, Dora, Rat Man, Schreber, Chris Sizemore, Elyn Saks, Milgram, Genovese, David Reimer, Anna O — **8 exist**; quizzes are inline not the shared QuizCheck | no | V5 §4 |
| Quizzes everywhere | PARTIAL | `src/lib/quiz/quiz.ts` engine + `QuizCheck` component | **QuizCheck imported nowhere**; only landmark uses inline quizzes; no quizzes after lessons/ethics/decode sessions | no | V5 §4.1 |
| Modules student-side | PARTIAL | tables + admin bulk ✓ | Locked-modules greyed-with-reason UI + server-side progression gate **not built** (no student module page) | no | V5 §8 |
| Infra — halfvec(384) | BUILT | `embed.ts` + tests (384 length, unit norm, no vector(1536)) ✓ | TODO(provider): real provider call not implemented (fixture hashing only — fine offline) | no | V5 §9.1 |
| Infra — data policy | BUILT | `guards.ts` `assertProviderAllowed` + 4 tests, `docs/DATA_POLICY.md` ✓ | ✓ | no | V5 §9.5 |
| Infra — /admin/infra | BUILT | page + metrics + 70% red banner, `infra_metrics` RPC live in DB, `infra_snapshots` table live | **`infra_metrics` RPC + `infra_snapshots` + size-caps SQL are NOT in any repo migration** — applied directly to live DB only; a fresh Supabase project loses them | no | V5 §9.6 |
| Infra — crons | BUILT | `.github/workflows/{db-keepalive,infra-check,reminders,alumni-transition}.yml` → `/api/internal/cron` ✓ | ✓ | no | V5 §9.3 |
| Alumni mode | BUILT | role model, cohort_ended_at (live), cron transition, read-only layout ✓ | ✓ | no | A10 |
| Transfer loop | BUILT | supervision `transfer_note` + consent ✓ | ✓ | no | A9 |
| Review triage | BUILT | `priorityScore`/`needsReview`/`queueSummary` + `/admin/triage` ✓ | ✓ (queue ≤10 logic present) | no | A5 |
| Cohort Pulse | BUILT | `/admin/pulse` drifting/stuck/flying/curve ✓ | One-tap nudge via Resend = TODO(provider) stub | no | A6 |
| Env vars read | PARTIAL | 27/29 read in code | **`AI_STUDENT_TIER` and `R2_PUBLIC_URL` never read** (documented-only) | no | — |
| Voice metrics | BUILT | `use-voice-metrics.ts` + debrief Delivery panel, compared vs own prior sessions ✓ | ✓ | no | V5 §6 |
| BUGS.md discipline | BUILT | 9 entries logged incl. fixed | ✓ | no | V5 §10 |
| Safety rails | BUILT | SIMULATION badge, crisis ack, rate limits, ai_usage_log, prompt-injection tests ✓ | ✓ | no | V5 §2.9 |

## Wiring audit — connections (broken = NOT BUILT)

| Connection | Status |
|---|---|
| sim transcript → Formulation Forge stage 4 | **BROKEN** — forge uses seed cases, no sim-transcript source |
| sim transcript → MSE level 5 | **WORKS** — `/api/practice/mse/transcripts` reads own completed sessions |
| idiom bank → every sim case's opening line | **WORKS** — all 8 seed cases + 61 depth cases have `opening_idiom` |
| idiom decoding → scored line in sim debrief | **WORKS** — `idiom_decoding` in debrief schema + UI stat |
| weak spots → real 10-item drill | **BROKEN** — analysis + remedy links only, no drill generation |
| competency events → Skills Passport radar → PDF | **WORKS** — sim+supervision feed events, passport lists, PDF downloads |
| lesson transcripts → auto-drafted flashcards → admin queue | **BROKEN** — `lesson_transcripts` table + cards table exist, no pipeline |
| faculty corrections → scoring_corrections → few-shot | **WORKS** — `/api/admin/sim-corrections` + `shouldInjectCorrection` filter + debrief injection |
| every nav-config route exists | **WORKS** — all 22 nav routes on disk |
| every briefed table in a migration | **BROKEN** — `feature_flags`, `rubric_dimensions`, `infra_metrics`/`infra_snapshots` SQL not in repo migrations (live-DB-only) |
| required RLS policies written | **WORKS** — privacy.test.ts asserts 5 invariants; get_advisors not re-run this session |
| every .env.example var read | **2 UNREAD** — AI_STUDENT_TIER, R2_PUBLIC_URL |
| Director deterministic given identical state+input | **NO TEST** — A1 DONE MEANS item |

## Summary of gaps (honest)

- **Content volume shortfalls**: confusable pairs 6/10, small-things 14/20, out-of-depth 11/30, ethics 7/30, OSCE 3/12, landmark 8/17, no-disorder ~5/9, quiz items ~8/∞
- **A1 incomplete**: determinism test + comparison strip (the "screen that makes it land")
- **A3 incomplete**: rubric_dimensions (missing table + hiding logic), kappa dashboard, self-play transcripts
- **Weak Spots**: no on-the-spot drill generation
- **Wall**: no reactions, no replies UI, no pinned case
- **Journal**: no per-entry sharing UI
- **Flags**: not enforced in route-group layout; no "not yet available" page
- **Practice page**: icon duplicates, dead /practice/wall link, recommended card lacks reason, "ONE TAP"/"WATCH" not single verbs
- **Voice**: CosyVoice/Kokoro/Whisper pending NVIDIA key (fixture path fine)
- **Infra SQL**: infra_metrics/infra_snapshots/feature_flags/rubric_dimensions not in repo migrations — live-DB-only
- **Env**: 2 vars documented but never read
