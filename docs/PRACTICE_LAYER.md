# Practice Layer — How It Works

Plain-English map of the practice layer: what exists, where it lives, and how the pieces connect. For new developers and for Kavya when she wants to know why something behaves the way it does.

## The spine: a patient says "I'm not feeling fresh"

Six things could be true. Every practice tool exists to make a student better at finding out which — the programme's one question.

## The tools (all under `/practice`)

| Tool | Route | Core files | Interaction |
|---|---|---|---|
| Consulting Room | `/practice/consulting-room` | `src/lib/sim/*` | TALK — Director/Actor patient engine |
| Presenting Complaint Decoder | `/practice/decode` | `src/lib/decode/*` | DECODE — 4 modes over the idiom bank |
| MSE Trainer | `/practice/mse` | `src/lib/mse/*` | TAG — 5-level ladder |
| 5 Judgment Calls | `/practice/judgment` | `src/lib/practice/sct.ts` | SLIDE — panel-scored SCT |
| Rounds | `/practice/rounds` | `src/lib/practice/rounds.ts` | RATE — ts-fsrs, 25/day cap |
| Out of Depth | `/practice/out-of-depth` | `src/lib/out-of-depth/scenarios.ts` | REFER — 60 scenarios, over+under referral |
| Ethics & Law | `/practice/ethics` | `src/lib/practice/ethics.ts` | CHOOSE — 50 consequence-first dilemmas |
| OSCE | `/practice/osce` | `src/lib/practice/osce.ts` | PERFORM — 12 timed stations |
| Formulation Forge | `/practice/formulation` | `src/lib/practice/formulation.ts` + `forge.tsx` | SORT — 5P grid, 4 stages, peer wall |
| Landmark cases | `/practice/landmark` | `src/lib/landmark/cases.ts` | READ — 25 cases with contestation |
| Two-Minute Clinic | `/practice/two-minute-clinic` | `src/lib/practice/clinic.ts` | TYPE — 139 one-liners, 120s, streak |
| Weak Spots | `/practice/weak-spots` | `src/lib/practice/weak-spots.ts` | DRILL — analysis + on-the-spot 10-item drill |
| Peer Role-Play | `/practice/role-play` | `src/app/.../role-play/*` | PAIR — zero AI, skill-matched partner |
| Case Library | `/practice/library` | `src/lib/corpus/library.ts` | ANNOTATE — 129 normalised PMC docs |
| Journal | `/reflect` | `src/app/(dashboard)/reflect/*` | REFLECT — owner-only, shareable per entry |
| Wall | `/wall` | `src/app/(dashboard)/wall/*` | ASK — reactions, anonymity views |
| Modules | `/practice/modules` | `src/app/.../modules/page.tsx` | BROWSE — locked-with-reason list |
| Skills Passport | `/practice/passport` | `src/app/.../passport/*` | VIEW — competencies + PDF |
| Supervision Log | `/practice/supervision` | `src/app/.../supervision/*` | RECORD — contact hours + transfer note |
| Weekly Check-in | `/practice/check-in` | `src/app/.../check-in/*` | TAP — non-clinical, aggregate-only |
| Not-yet-available | `/practice/not-available` | `src/app/.../not-available/*` | the honest flag-off page |

## The patient engine (the heart)

- **Director/Actor split** (`src/lib/sim/director.ts`, `actor.ts`): the Director decides (JSON, never dialogue), the Actor writes 1–3 sentences. Logic is code; the model supplies language.
- **Gates as code** (`gates.ts`): `evaluateGate` + `permittedFacts` are deterministic; the model is told which facts it may use, never asked whether a gate is met. Trust < 3 blocks sensitive facts in code.
- **24-move library** (`moves.ts`) with scripted fallbacks — the never-silent guarantee. `pregen-voice.ts` synthesises them at approval time.
- **PatientState** mutates every turn and persists per turn (`sim_turns.state`) — the rewind point for retry.
- **Anti-repetition**: no move twice in 3 turns; similarity > 0.85 against the last 8 regenerates.
- **Hollow compliance**: 3 consecutive premature-advice turns → the patient agrees with everything and discloses nothing for the rest of the session. Deliberate. The debrief names it.
- **Seeded variation** (`variation.ts`): same seed ⇒ same variant; variation touches surface only, never clinical facts.

## The debrief (the actual product)

- Scores: open:closed ratio, leading questions, reflections, **premature reassurance (flagged hard)**, coverage, risk timing, cultural attunement, **idiom decoded**, disclosure unlock rate.
- Quotes 3 verbatim moments with better alternatives.
- Missed-disclosures reveal.
- **A1 retry**: "Try this again" on flagged moments → rewinds to that turn (same seed/state) → branch session → side-by-side comparison strip in the branch's debrief.
- **A3 calibration**: rubric dimensions are provisional until ≥10 paired scores with kappa ≥0.6 — provisional dimensions hide their NUMBER from students (qualitative only). `/admin/calibration` computes and displays this.

## Scoring pipeline

`/api/practice/sim/debrief` → `scoreTranscript` (schema-validated) → stored once in `sim_scores` → competency_events credited via `rubricToCompetencyKeys`. Faculty corrections write to `scoring_corrections` and inject as few-shot lessons into future scoring (only score-changing rows). No-disorder cases get an explicit restraint-praise instruction.

## Feature flags

- `feature_flags` table (migration: `practice_layer_flags.sql`), 6 live for Cohort One.
- `requireFeature()` gates every tool page server-side → `/practice/not-available` for flagged-off tools. Admin flips at `/admin/flags`.

## The passport loop

Every tool completion credits competencies: MSE levels, OSCE stations, Judgment sets, Formulation diffs, Rounds sessions, sim debriefs, supervision hours. All land in `competency_events` → `/practice/passport` + the PDF.

## Data policy (non-negotiable)

- `assertProviderAllowed(workload, provider)` throws before any request leaves the server.
- Student-data workloads (`sim_patient_turn`, `debrief_scoring`, `journal_support`) only reach `trainsOnData === false` providers. `AI_STUDENT_TIER=any` is a dev-only override; production keeps the strict default.
- `AI_ENABLED=false` (the current default) runs everything on deterministic fixtures — the whole app is demoable with zero keys.

## Voice

- Browser speech + affect mapping is the always-on layer: the Director's affect + fatigue drive rate/pitch line by line (`affect-to-voice.ts`).
- Server TTS: CosyVoice 2 (NVIDIA NIM) → Kokoro → fixture, cached in R2 on sha256(text+voice+emotion+speed) (`synthesize.ts`).
- STT: Deepgram (key) → Groq Whisper → NVIDIA NIM → browser Web Speech. Interim transcript always editable before send.
- `scripts/pregen-voice.ts` pre-synthesises the 74 scripted fallbacks.

## Modules & scheduled releases

- `/admin/modules` bulk publish/schedule/grant; scheduled modules flip to published via the GitHub Actions cron (`release-scheduled`), never Vercel cron.
- Students see locked modules greyed with the honest reason.

## Wall governance

- Students can **report** any post (5-second flag, no abuse surface).
- Faculty resolve reports at **`/admin/wall-reports`** (open → resolved);
  the queue shows the content + reason. Resolving keeps the content unless
  faculty removes it separately.
- Reactions (heart/insight/question/applause/worry) on posts AND replies —
  signal without ranking; author_id is structurally nulled for anonymous
  content on the `*_visible` views.

## Admin surfaces

`/admin` · students · courses · submissions · tools · psychopharm-review · corpus/dictate · sim-review · triage · checkins · supervision · flags · calibration · modules · pulse · infra.

## Content: code vs DB (read this before "fixing" a table)

Two different content-storage patterns coexist and it's easy to assume the
wrong one:

- **Code-authored, always live, no approval gate**: sim_cases' character
  bank (via `scripts/upsert-characters.ts`), and everything in the table
  below marked with a `src/lib/**.ts` source — OSCE stations, ethics
  dilemmas, SCT items, MSE stimuli, landmark cases, quiz banks, Two-Minute
  Clinic, the Decoder's idiom bank, Out of Depth scenarios. These ship the
  moment the file merges; there is no faculty review step.
- **DB-authored, RLS-gated, meant for admin review**: `sct_expert_responses`
  works this way (admin-only, panel-scored). `public.idioms` was scaffolded
  the same way (65 seeded, 18 approved, the rest queued) but **the Decoder
  gameplay does not read this table** — it reads the 140-entry
  `src/lib/decode/idioms.ts` bank directly, unconditionally. `osce_stations`,
  `mse_stimuli`, and `formulation_cases` (from `practice_layer_tools.sql`)
  are live tables with full RLS and zero application code reading or
  writing them — the tools that share their names run entirely on static
  TS content instead. Not a bug in the running app (nothing depends on
  these tables), but real schema debt: either wire them into a real
  admin-authoring flow for those three tools, or drop them. Flagged, not
  decided — see NEEDS_KAVYA.md.

## The queue / build discipline

`QUEUE.md` is the fuel; the Stop hook blocks while unchecked items exist. Work it top to bottom; tick only committed-and-green. `AUDIT.md` is the gap report; `RESUME.md` the checkpoint; `NIGHT_LOG.md` the decisions.
