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

## Swept 2026-08-14 (round 9 + VIBHA): previously-"open" items now BUILT
- OSCE/MSE/Formulation/SCT attempt tables — all four wired with write
  routes + live migrations + fixture-tested route tests (commits bb5bc10,
  711366e, 0ad8e9d). Durable per-attempt records now exist.
- `mse_stimuli` / `formulation_cases` / `public.idioms` content — levels,
  forge and the decode drill read live DB content with static fallback
  (content wiring, commits bb5bc10, 1bee117, ad6d5df). `osce_stations`
  already read by the OSCE attempt route.
- `practice_chains` — chain scaffold built (9ed2b36): created on debrief,
  surfaced on /today. `sim_cases.follow_up` content spec still pending
  (needs authored follow-up session specs — Kavya decision).
- ElevenLabs — wired as the premium top tier of the TTS chain (81bbf5f),
  one `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID` away.

## Real, verified-still-open
- ~~mhGAP/NMHS/POCSO/RCI manual downloads~~ **DONE 2026-08-14** — all five
  statutes/reference reports are now fetched and normalised: mhGAP-IG 2.0
  (Wayback), NMHS main report (Wayback 2018), RCI 1992 (Samagra Shiksha
  mirror), MHA 2017 (live India Code), and POCSO 2012 (WBCPCR mirror +
  tesseract OCR — the last holdout, scanned Gazette, committed fe6bd5c).
  All five land in `scripts/corpus/normalised/*.json` via
  `npm run corpus:normalise`.
- **`sim_cases.follow_up` recurring-patient content** — the chain
  consumer is built; the follow-up session specs (second/third visit,
  changed state) are authored content that needs a clinical spec.
- **Provider research** — docs/MODEL_RESEARCH.md tracks the current best
  free TTS/STT/LLM/embedding options; the registry in src/lib/ai/router.ts
  is the single place to add/swap providers.

## Deferred (v5 build era, still true)
- Corpus fetchers for ICD-11 / mhGAP / NMHS / MHA 2017 as scripted,
  re-runnable fetchers — all the statute/reference PDFs are now fetched
  and normalised (see above); the remaining deferred piece is a fully
  scripted, re-runnable ICD-11 fetcher (the public browser tier 401s
  intermittently; a WHO API key would make it reliable).
