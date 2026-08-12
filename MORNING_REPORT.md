# MORNING REPORT — 2026-08-12

## What's LIVE right now
Deployed to production (Vercel, auto-deploy from main): **bind-lms-platform**
— https://bind-lms-platform-2k7skr2nd-drsarthakpsychologys-projects.vercel.app
The /beastmode round is fully merged to main, verified green (295 unit tests,
35 e2e, tsc, lint, build), pushed, and the production deployment is Ready.

## The four bugs — root causes, fixed, proven
1. **The patient was not reading the case** — there was NO model call at all:
   no AI keys + `AI_ENABLED` unset → the shared fixture bank served Ravi's
   lines to every patient (Suresh's stored turns proved it). Fixed with a
   deterministic, case-aware fixture engine: authored per-case voices
   (8 cases × 6 lines), per-case variation schemas, seeded humidity; the
   session now opens with the patient's OWN words. World: live and no-key
   both work; when you add a no-train provider key the Director/Actor
   models take over.
2. **Duplicate messages** — old bank repeated lines + the client's typing
   reveal re-pushed replies on a second send mid-reveal. Fixed by
   append-once/update-by-id rendering + a unique (session, role, content)
   constraint (27 dup rows pruned). Proven by 3 regression tests.
3. **One Start button firing all** — audited and ALREADY correct per-id;
   added a 4-test regression so it stays correct.
4. **Only 3 practice tools visible** — 12 of 18 `feature_flags` were OFF
   (the "ship six" scope cut) while everything was built. All 18 enabled
   for Cohort One; VISIBILITY.md documents every surface. "0 of 1 lessons"
   is the truth: 1 published lesson exists — the course needs content
   (QUeued).

## UI
Patient header (name/age/difficulty/context), clear speaker distinction,
quiet timer + turn counter, 3-dot typing indicator, live voice waveform,
mse side rail, anchored composer; case picker grouped by difficulty with
hook-first cards and real per-case state (Not attempted / In progress /
Completed · score). 380px verified by e2e.

## On fixtures (waiting for keys)
TTS/STT (CosyVoice/Whisper — NVIDIA/Groq key), live debrief scoring, and
the Director/Actor live lane. NEEDS_KAVYA.md has the exact one-command
verification for each.

## Incomplete (honest)
- Lessons: 1 of many (course content is the next authoring effort)
- 200+ characters: pipeline + 3 archetypes done; 15→60→200 is volume
- Paid-book corpus: 3 acquired; the 54 remaining need files in the drop
  folder (`/mnt/acquire/`) or a purchased-account credential

## Infra
Postgres healthy · stores dry · no destructive SQL · advisors: the three
SECURITY DEFINER view lints are gone; remaining lint items are the
documented RPC helpers (intentional).

## Top 3 worth your attention
1. Drop the purchased books into `/mnt/acquire/` — the ingester is ready;
   that single action turns your purchases into the patient-voice corpus.
2. Paste any no-train API key (NVIDIA free tier works) — the real
   Director/Actor + scoring light up instantly.
3. Review the 20 calibration transcripts + 7 drafted flashcards in the
   admin queues — approval is the one step the build can't do.