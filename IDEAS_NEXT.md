# IDEAS NEXT — things thought of but not built

Swept 2026-08-13: almost everything below this file used to list as "not
built" was, in fact, already shipped in a later round without this file
being updated. Verified each claim against the actual code/DB before
writing this version — see NIGHT_LOG.md 2026-08-13 for the audit method.

## Confirmed built (this file previously had these as open — it was wrong)
- CFI Practice mode (Decoder Mode 4) — `src/lib/decode/cfi.ts` + `cfi-drill.tsx`
- Formulation Wall (peer critique) — `formulation_wall_posts` + `peer-wall.tsx`
- Deepgram streaming STT — `src/lib/voice/stt.ts`, first in the provider chain
- Peer role-play skill-matching — `/practice/role-play/page.tsx` (complement-gap matcher over `sim_scores`)
- Persist tool completions to competency_events — MSE/OSCE/Judgment/Rounds/Formulation all call `/api/practice/competency` on completion (competency credit works; see the real gap noted below — it's the dedicated attempt tables, not competency credit)
- Scheduled module release cron — `release-scheduled` GitHub Action
- `AI_STUDENT_TIER` + `R2_PUBLIC_URL` — both read (`src/lib/voice/synthesize.ts`, AI tier gating)
- `feature_flags` migration file — `practice_layer_flags.sql`, reproducible
- Wall pinned Case of the Week — faculty pin/unpin, live
- Weekly check-in → pulse cross-reference — `/admin/pulse` flags activity-drop + load-spike together
- MSE five-level ladder — `level-observe/level-domain/level-full-mse/level-live-mse` all exist

## Real, verified-still-open

- **OSCE/MSE/Formulation/SCT attempt tables are unused.** `osce_attempts`,
  `mse_attempts`, `formulation_attempts`, `sct_attempts` exist live with
  full RLS; zero application code writes to them. Those 4 tools DO credit
  `competency_events` (via the shared `/api/practice/competency` route),
  so students aren't uncredited — but there's no durable per-attempt
  record (transcript, checklist, global rating) the way `sim_turns`/
  `sim_scores` give the Consulting Room. Effort: medium (4 small
  write-paths, one per tool, following the sim_scores pattern). Impact:
  medium — unlocks OSCE-history review, per-station weak-spots, and a
  faculty audit view symmetrical to `/admin/sim-review`.
- **`osce_stations` / `mse_stimuli` / `formulation_cases` / `public.idioms`
  tables have zero readers.** All 4 tools ship real content as static TS
  instead. See `docs/PRACTICE_LAYER.md` § "Content: code vs DB" and
  NEEDS_KAVYA.md for the product-decision framing (wire a real
  admin-authoring flow, or drop the tables).
- **`practice_chains` / `sim_cases.follow_up`** ("recurring patient"
  multi-session arcs) — table went live 2026-08-13, zero content, zero
  consumers. Parked in NEEDS_KAVYA.md pending a real spec.
- **ElevenLabs pre-generated patient lines cached in R2** — Kavya has an
  account (voice "Rudra"); not wired. Low priority while CosyVoice/Kokoro
  cover the free-tier TTS chain.
- **mhGAP/NMHS/POCSO/RCI manual downloads** — the fetchers point at these;
  NIMHANS/India-Code links need a browser download (TLS/redirect issues
  in Node). Tracked in NEEDS_KAVYA.md, not code-fixable.

## Deferred (v5 build era, still true)
- Corpus fetchers for ICD-11 / mhGAP / NMHS / MHA 2017 as scripted,
  re-runnable fetchers — MHA 2017 itself is fetched; the others are
  manual-download-blocked (see above), not missing code.
