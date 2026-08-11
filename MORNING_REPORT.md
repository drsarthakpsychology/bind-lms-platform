# Morning Report — 2026-08-11 (overnight completion run)

## Ship it — live, tested, demoable

All routes below work with `AI_ENABLED=false` (fixtures) and upgrade instantly when keys land.

| What | URL | Notes |
|---|---|---|
| Consulting Room (Director/Actor patient engine) | `/practice/consulting-room` | 63 cases, 16 traps, debrief with quotes + missed-disclosures reveal + **retry-from-turn-N with side-by-side comparison strip** |
| Presenting Complaint Decoder | `/practice/decode` | 4 modes (Decode/Funnel/Seven Readings/CFI), 95-idiom bank, physical-miss 1.5× |
| MSE ladder | `/practice/mse` | 5 levels gated, 6 pairs + 5 set drills, 20 small-things, L5 from own transcript |
| Out of Depth | `/practice/out-of-depth` | 50 scenarios, over- AND under-referral tracked |
| Ethics & Law | `/practice/ethics` | 40 consequence-first dilemmas (incl. technology boundaries), statute + section cited |
| OSCE | `/practice/osce` | 12 timed stations |
| Landmark cases | `/practice/landmark` | 22 cases incl. Indian psychiatric history, contestation taught |
| Weak Spots | `/practice/weak-spots` | analysis + **10-item drill generated on the spot** |
| Practice page | `/practice` | unique icons, reason-stated recommendation, server-side flag gates, honest "not yet available" |
| Journal | `/reflect` | owner-only, **per-entry sharing now live (revocable, logged)** |
| Wall | `/wall` | threaded replies + **reactions on posts AND replies**, report-to-faculty, anonymity views |
| Modules | `/practice/modules` | locked modules visible with honest reasons |
| Calibration | `/admin/calibration` | **kappa dashboard + provisional-dimension hiding** + 20 seeded self-play transcripts |
| Infra | `/admin/infra` | live headroom (RPC now reproducible in migrations) |

## Try this first (3 things)

1. **Run a Consulting Room session → finish → "Try this again" on a flagged quote.** Same patient, same moment, two futures — the comparison strip is the product's heart. Watch the Director's affect change the patient's delivery in voice mode (fatigue 8 + flat = slow, flat, quiet — live, zero keys).
2. **/admin/calibration** — 20 AI-vs-AI transcripts are seeded. Blind-score a few, reveal, and watch provisional dimensions (currently hiding their numbers from students) edge toward the kappa gate.
3. **/practice** — the redesigned browse: unique icons, the recommendation always states *why* (try it after a risk-missed session).

## Needs you

See `NEEDS_KAVYA.md` (single-sitting checklist). Free first: **NVIDIA_API_KEY** (CosyVoice 2 + Whisper + live patient engine + scoring), **GROQ_API_KEY**, **GEMINI_API_KEY**, **CEREBRAS_API_KEY**, R2 creds, CRON_SECRET. Manual: mhGAP/NMHS/POCSO/RCI PDFs. Content: dictate 20 cases, score calibration, review 7 drafted flashcards, flip flags.

## What is on fixtures waiting for a key

- **Server TTS/STT** (CosyVoice 2, Whisper) — fully built (`/api/practice/voice/{synthesis,stt}`, R2 sha256 cache, pregen-voice dry-run verified); browser speech + affect mapping works today.
- **Live patient engine + debrief scoring** — fixture mode demoable; NVIDIA key flips to real models. **Data-policy guard is on**: student-data workloads refuse free tiers that train on data until a no-train key (ANTHROPIC) exists.

## Content numbers (updated after the content-volume rounds)

- Cases **63** (all 16 traps; **9 no-disorder** per A8, restraint now praised in debriefs)
- Idioms **95** (65 seeded + 30 regional in the bank; 18 compulsory approved in the DB)
- Confusable pairs **6 pairs + 5 set drills** · small-things **20**
- Out-of-depth **50** · ethics **40** (incl. technology boundaries) · OSCE **12** · landmark **22** (incl. Indian psychiatric history) · SCT items **154**
- Quiz bank **51** sourced items (decode + MSE documentation + risk/report) wired into MSE, OSCE, decode, ethics, landmark
- Two-Minute Clinic **101** prompts · calibration transcripts **20** · drafted flashcards **7**

## Friction (tap count from /today)

All core flows ≤2 taps (audited last week). `not-available` gate adds 0 taps to enabled tools.

## Infra headroom (live)

- DB: **~small** (63 cases + seeds + 20 calibration sessions; nothing near the 500 MB free tier)
- Vercel: Hobby — `INFRA_SETUP.md` flags **Pro needed for a paid program** (commercial use clause)
- R2: ~0 used (bucket + keys pending; video migration scripts exist)
- AI providers: 0 calls made this session (fixtures only) — usage logs stay honest
- **Red-flag watch:** none. The `infra_metrics` RPC + snapshots cron are live in code.

## Bugs

Fixed this session: `/practice/wall` dead link; Rounds/Layers icon dupes; "ONE TAP"/"WATCH" verbs; duplicate `MULTI_TERM_DRILLS` declaration; `scoreMultiTerm` missing prompt type; ethics 2-option dilemmas failing the 3-option test; non-async pages gated with await; duplicate `server-only` import; infeasible `ADD CONSTRAINT IF NOT EXISTS` (Postgres) → DO-block; hand-rolled SigV4 → SDK; `server-only` import in pregen script → shared keys module.
Open: **0** in BUGS.md (all 9 logged are fixed; no new opens). See BUGS.md.

## Ideas (top 3)

1. **Two-Minute Clinic expansion** — the retention feature deserves 60+ prompts with idiom variants (currently ~a handful).
2. **Peer role-play skill-matching** — pair students on complementary weak spots (IDEAS_NEXT: medium effort, high impact).
3. **Persist other-tool attempts to competency_events** — judgment/MSE/OSCE currently in-memory; wiring them feeds the passport fully.

## Numbers

- **75+ commits** this session (6b4ee8d → HEAD on `feat/v5-depth`) — rounds 1-6 of the completion run
- Tests: **268** (+57 from the original 211) · lint clean (3 pre-existing warnings) · tsc clean · build ~7s
- Migration files: practice_layer_infra.sql added (infra RPC reproducible); rubric_dimensions + calibration_pairs + wall_reactions + 2 anonymity views applied live
- e2e: 34 specs (browser-dependent; run `npm run test:e2e` locally with the app up)