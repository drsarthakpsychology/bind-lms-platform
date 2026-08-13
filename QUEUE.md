# QUEUE
# Format is STRICT. Unchecked: "- [ ]" with exactly one space. Done: "- [x]".
# The Stop hook only blocks while unchecked items exist. This is the fuel.

## AUTH CONSISTENCY — post-sweep open items (2026-08-14, hook-driven)

- [ ] **Harden sim routes to `requireSession()`**: sim/debrief, sim/rewind,
  sim/turn, sim/session still authenticate with bare `auth.getUser()` (JWT-only,
  no expiry/concurrent-session checks). Excluded from the round-10 sweep by task
  rule — decide scope and convert.
- [ ] **Drop redundant admin-role query in dictate routes**: corpus/dictate,
  dictate/complete, dictate/turn re-fetch `profiles.role` after
  `requireSession()` already returns `role` on the Profile — can check
  `profile.role` directly (untangle the local `profile` collision first).

## BEASTMODE ROUND 10 CONT. — post-close continuation slices (2026-08-14, hook-driven)

- [x] **Dashboard motion-polish pass (654139d)**: VibhaMark replaces the
  peach-square brand mark in the sidebar (28) + mobile top bar (24); Reveal
  entrances added to /reflect, /record, /passport, /admin (stat cards staggered
  0.15 + i*0.05); passport PDF button lift + case-library row hover
  micro-interactions. Loading skeletons, animated progress, Radix dialog/sheet/
  popover transitions, and layoutId tab indicators verified already in place.
  Gate green (lint, tsc, 392 tests, build).
- [x] **Loading-state sweep (§12)**: added page-shaped loading.tsx skeletons for
  every dynamic route group missing one — reflect/wall/passport/record/admin
  (be8a03e) + courses/[courseId] + materials/[materialId] (b8472db). practice/
  today/(dashboard)/verify/lessons already had theirs. Audited the full scan:
  remaining "MISS" entries are covered by a parent group skeleton or are fast
  auth-redirect pages (/ and /login) where a skeleton would flash.
- [x] **Follow-up chain surfacing**: sim_cases.follow_up was read by nobody.
  Chain POST now selects it and extends steps with a trailing
  {surface: follow_up, status: pending} when content exists (946aeb1) — inert
  for all current data (no seeded follow_up), idempotent on existing chains,
  /today's consumer already renders it ("Continue with {patient} · Follow-up
  visit" → /practice/consulting-room). Content itself stays the Kavya-side
  clinical spec (NEEDS_KAVYA / IDEAS_NEXT). Follow-up session-creation mode
  deferred until the content shape exists.
- [x] **Verified complete**: modal/dropdown/popover transitions already ship
  via Radix data-state + Tailwind animate-in/out (no work needed). Full gate
  green on every commit (lint 0/0, tsc clean, 379 tests, build exit 0).

## BEASTMODE ROUND 10 — PRODUCTION SAFETY + FREE AI + UI POLISH (2026-08-14)

- [x] **Premium neobrutalism UI pass**: motion-system tokens in globals.css,
  tactile buttons, homepage hero cascade + Parallax, uppercase brand on landing
  nav/footer, dashboard course-card cascade, nav micro-interactions — committed
  615499b. Remaining: subagent dashboard polish on practice/today/wall must
  land + gate. Landed bd168e3 (Reveal cascades on /practice /today /wall
  /enquire /login + equal-height cards) — gate green. [brief §7-13]
- [x] **Free-first voice**: MiMo (MIT) added as tier 1, chain reordered with
  ElevenLabs LAST (paid, not recommended) — committed 615499b. R2 cache prune
  helper landed bd168e3 (scripts/prune-voice-cache.ts); pregen verified —
  dry-run reports 74 scripted fallback lines + no-key honest path, both exit 0.
  Gate green. [brief §15-27]
- [x] **§24 AI free-tier doc**: docs/AI_FREE_TIERS.md — per-provider table
  (provider/model/purpose/cost/free-limits/env-var/setup/fallback) + chain
  order + privacy note. Committed 006d412. [brief §24]
- [x] **Performance/efficiency tech-stack pass**: safe wins only — pregen
  --dry-run verified, R2 prune helper (prune-voice-cache.ts), /verify loading
  skeleton, client-bloat fixes (ui/table + simulation-badge → server
  components) — landed bd168e3; no production infra, no new deps. Conservative
  data caching (unstable_cache) skipped: every dashboard query is per-user.
  Gate green. [brief §29-30]
- [x] **Key-leak audit**: server secrets stay server-side — verified clean
  across client files; NEXT_PUBLIC_* only public-by-design vars. [brief §28]
- [x] **Final report §35 A-F**: changed / AI decisions OLD→NEW→WHY→COST→FREE
  LIMIT / API-key table / infra-safety confirmation / new deps / limitations —
  written to NIGHT_LOG.md at session end after subagents landed.

## RESEARCH ROUND — free LLM tier follow-ups (2026-08-14)

- [x] **Wire Groq as Primary Director/Actor provider**: registry now routes
  `json`/`chat`/`stream` to groq first (no-train → serves student data);
  engine uses capability "json" (Director) + stream (Actor) with workload
  `sim_patient_turn`; json_object + Zod-repair + failover path; 4 router tests.
  Only blocker: `GROQ_API_KEY` (in NEEDS_KAVYA). json_schema left as json_object
  — Groq's strict mode is "in flux" and Cerebras 422s without additionalProperties:false
  on all objects; the provider-agnostic Zod-repair path is the reliable choice. [research 2026-08-14]
- [x] **Wire Cerebras as Fallback Director/Actor provider**: already the
  no-train JSON fallback in the registry (second after groq). Needs
  `CEREBRAS_API_KEY` (in NEEDS_KAVYA). [research 2026-08-14]
- [x] **OpenRouter free-tier decision surfaced**: stays an overflow lane at 50
  RPD; the one-time $10 → 1,000 RPD choice is Kavya's call — surfaced in
  NEEDS_KAVYA. [research 2026-08-14]
- [x] **Quota re-verify at integration time**: surfaced in NEEDS_KAVYA as a
  go-live reminder — limits are account-dependent and moved through 2026. [research 2026-08-14]

## BEASTMODE ROUND 9 — attempt tables + content wiring + polish (2026-08-13)

- [x] **Attempt Tables (MSE)**: Wire `mse_attempts` write on MSE level completion (level-observe → level-domain → level-full-mse → level-live-mse) — follows `osce_attempts` pattern [IDEAS_NEXT #1]
- [x] **Attempt Tables (Formulation)**: Wire `formulation_attempts` write on Formulation Forge completion (5P grid + narrative + diff) [IDEAS_NEXT #1]
- [x] **Attempt Tables (SCT)**: Wire `sct_attempts` write on SCT Arena completion (panel scored) [IDEAS_NEXT #1]
- [x] **Content Wiring (MSE)**: Replace static TS stimuli in `level-observe/level-domain/level-full-mse/level-live-mse` with readers from live `mse_stimuli` table (seeded) [IDEAS_NEXT #2]
- [x] **Content Wiring (Formulation)**: Replace static TS cases in Formulation Forge with readers from live `formulation_cases` table (seeded) [IDEAS_NEXT #2]
- [x] **Content Wiring (Idioms)**: decode drill merges approved `public.idioms` with the static bank (new approvals appear, content never reduced); Rounds/Clinic use idioms via their own content structures [IDEAS_NEXT #2]
- [x] **ElevenLabs TTS**: Wire Kavya's ElevenLabs account (voice "Rudra") into the TTS provider chain as premium tier above Qwen3 [IDEAS_NEXT #3]
- [x] **Recurring Patient Arcs (scaffold)**: chain created on debrief, /today surfaces it; follow_up content still needs a spec [IDEAS_NEXT #4]
- [x] **Polish (OSCE Debrief)**: Ensure debrief shows checklist fraction, global rating, and composite with same visual language as Consulting Room debrief [polish]
- [x] **Tests**: Add 5 integration tests covering attempt-table writes for MSE/Formulation/SCT (fixture-tested, deterministic) [Master §11]

## BEASTMODE ROUND 9 cont. — briefs-verified gaps (2026-08-13)

- [x] **Content Wiring (Idioms)**: decode drill merges approved `public.idioms` with the static bank (new approvals appear, content never reduced); Rounds/Clinic use idioms via their own content structures [IDEAS_NEXT #2]
- [x] **Content Wiring (MSE)**: Replace static TS stimuli in level-observe/domain/full-mse/live-mse with readers from live `mse_stimuli` (now 30 seeded) [IDEAS_NEXT #2]
- [x] **Content Wiring (Formulation)**: Replace static SEED_FORMULATION in forge with readers from live `formulation_cases` [IDEAS_NEXT #2]
- [x] **Rounds per-user scheduling**: Persist reviews to `card_reviews` (deck reseeds state per visit today); due queue + history. Seeds have no DB id — scope to published cards [verified gap]
- [x] **Quiz after lesson completion**: QuizCheck is wired in decode/ethics/mse/osce but lessons have no quiz surface [briefs scan]
- [x] **OSCE voice mode**: voice delivery only in Consulting Room today; OSCE is "voice strongly preferred" but text-only [briefs scan]
- [x] **Cohort pulse nudge**: /admin/pulse nudge records intent but doesn't call the real nudge API [briefs scan]
- [x] **ElevenLabs TTS**: premium tier voice "Rudra" — needs Kavya's account keys [IDEAS_NEXT #3]
- [x] **Recurring Patient Arcs (scaffold)**: chain created on debrief, /today surfaces it; follow_up content still needs a spec [IDEAS_NEXT #4]