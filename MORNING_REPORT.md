# Morning Report — 2026-08-11

## Ship it
The v5 depth build is complete on `feat/v5-depth` — 35 commits, 180 tests, lint clean, typecheck clean, build green. Demo after `npm run dev`:

- **`/today`** — the new front door (recommended card, quick/deep chips, streak)
- **`/practice/decode`** — the flagship: Presenting Complaint Decoder (33 idioms, Decode + Funnel + Seven Readings modes)
- **`/practice/consulting-room`** — the rebuilt patient engine (Director/Actor, gates-as-code, 24 moves, seeded variation) with **retry from any debrief moment**
- **`/practice`** — the redesigned browse view (verb labels, state chips, unique icons)
- **`/admin/calibration`**, **`/admin/flags`**, **`/admin/modules`**, **`/admin/pulse`**, **`/admin/triage`** — the five admin tools

## Try this first
1. `/practice/decode` — "I'm not feeling fresh." Six things could be true. This is the most defensible thing Lumen owns.
2. `/practice/consulting-room` — run a session, finish, then hit "Try this again" on a debrief quote. Same patient, same moment, two futures.
3. `/today` — the two-tap front door that replaced the fourteen-card wall.

## Needs you (from NEEDS_KAVYA.md)
- Paste `NVIDIA_API_KEY` (free, no card) → the strongest free tier for Director/Actor/TTS
- Flip feature flags at `/admin/flags` to reveal the 9 built-but-off tools when the cohort is ready
- Score transcripts at `/admin/calibration` → trains the AI scorer + gives the MOU line
- Record 20 composite cases at `/admin/corpus/dictate` (still the #1 source)

## Decoder
Idioms seeded: 33/60 (compulsory set covered) · modes live: 3/4 (Decode, Funnel, Seven Readings; CFI Practice next) · wired into: sim opening_idiom, MSE, Rounds

## Patient engine
Moves: 24/24 · never-silent fallback · gates-as-code (leak tests pass)
Gate-leak tests: 3 passed / 0 failed · seeded variation (determinism tested)

## MSE
Confusable-pairs drill live (mood vs affect, thought form vs content, akathisia vs anxiety, etc.)

## Voice
Browser TTS/STT live · CosyVoice mapping planned (needs NVIDIA key)

## Content
Cases: 60/60 · trap coverage: 16/16 · style patterns: 450 (Gutenberg, firewall-tested) · landmark cases: 7 · quiz items: sourced rationale engine

## Friction
Flows at ≤2 taps: 5/6 · over: only "All practice → browse → tool" (3 taps — the deliberate browse view, by design)

## Admin
Flags (scope cut to 6) · Calibration (blind scoring) · Modules (bulk publish/grant) · Pulse (drifting/flying) · Triage (≤10 queue)

## Bugs
Fixed: 0 this session · Open: 0 → BUGS.md

## Numbers
Commits: 35 · tests: 159 → 180 (+21) · build ~6.5s · branch `feat/v5-depth`
