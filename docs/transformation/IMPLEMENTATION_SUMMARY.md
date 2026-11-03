# Implementation summary — VIBHA LMS transformation

Branch `feature/vibha-lms-transformation`, based on `main` @ `2b42099`.
Nothing here has been merged, deployed to production or applied to the
production database.

## What the platform was

A mature, invite-only clinical psychology LMS (Next.js 16, Supabase, R2,
Vercel): 23 deep clinical modules with checkpoints and spaced re-tests,
quiz/coach games, a simulated-patient Consulting Room, ten practice tools,
lectures with an encrypted HLS pipeline, and a large admin surface.
See `DISCOVERY_AUDIT.md` for the full audit.

## The main gap this work closes

The curriculum taught psychology mostly by **reading about it**. General
psychology (memory, attention, perception, learning, thinking, research
methods, development, social) was thin or absent, and the psychiatry
textbooks' richest material (phenomenology, differential diagnosis,
medicine safety) had no "do it yourself" format. This work adds experiences
where the method fits the concept: run the memory experiment, name the
symptom from the patient's words, decide how urgent a side effect is.

## New for students

| Feature | Where | What it does |
|---|---|---|
| Psychology Lab | `/games/lab` | 12 classic experiments run on yourself (memory, attention, perception, learning, thinking, research methods, development, social): do it → your own data → why (theory, clinic, evidence strength, original studies) → 3 checks → reflection. Spaced re-checks at 3/10/30 days. |
| Casebook | `/games/lab/cases` | 36 textbook-based clinical games in 8 formats (name it, diagnose, how urgent, sort, match, best response, case path, in order), including a 64-item symptom spotter (Fish) and a 27-item medicine red-flag triage (Maudsley/Stahl). Searchable and filterable; rounds of 12 sampled from big banks. Original wording; chapter/page refs. |
| Revise | `/games/revise` | One personalised list for today (≤6 items, ~20 min): due reviews, re-tests, mixed-up concepts, Lab re-checks, weak scores, stale modules; interleaved across topics. |
| Notes: bookmarks and personal notes | `/study/...` | Bookmark a section, keep a private note per section (autosaved, device-local for now), bookmarks list on `/study`, Lab links on module pages. |

## New for admins

| Feature | Where | What it does |
|---|---|---|
| Learning insights | `/admin/learning` | Module completion and test averages, where the class struggles, most-confused concept pairs, Lab class results, quiet students, review backlog; CSV download (admin-only). |
| Lab switch | Admin → What's live → "lab" | Lab + Casebook start Hidden for students; admins always see them, with educator-review notes. |

## Academic work

- Books analysed (owner-supplied, `books` branch): Kaplan & Sadock's Synopsis
  12th ed; Fish's Clinical Psychopathology 3rd ed; Ahuja, A Short Textbook of
  Psychiatry (Jaypee 2010); Maudsley Prescribing Guidelines 2021; Stahl's
  Essential Psychopharmacology 5th ed. Per-book maps with chapter/page
  references: `docs/transformation/books/`.
- `CURRICULUM_MAP.md`: coverage, gaps, opportunity map, progressive
  pathways, collaborative-learning plan, retention design, educator checklist.
- Integrity rules applied: original wording only, no invented citations,
  evidence status on every experiment, sensitive or debated content flagged
  for educator review, psychologist-appropriate framing of medicines (spot,
  explain, refer — never dose).

## Engineering

- No new npm dependencies.
- Lab/Casebook/Revise progress is stored inside the existing
  `learn_progress.state` JSON (new `lab` key, validated by `normalise`), so
  no table changes were needed.
- One optional migration: `supabase/migrations_pending/2026_11_lab_flag.sql`
  (inserts the `lab` flag row as `off`). Not applied anywhere.
- Security fixes from the audit (all code-only; work on today's schema):
  every data-reading admin page checks admin itself (4 pages called the check
  and ignored it); 37 student API routes honour blocks, lectures-only scope,
  per-student switches and feature flags; server-side XP clamp; per-student
  local storage key; lecture progress bounded by real duration; master-login
  exact-match lookup + Postgres rate limits; submission paths must belong to
  the caller; doubts visibility checks; Sentry request errors.
- Two optional migrations (not applied): `2026_11_learn_progress_server_writes.sql`
  (apply only after deploy, once `SUPABASE_SERVICE_ROLE_KEY` is confirmed) and
  `2026_11_progress_updated_at.sql` (turns on the wall-time bound for lectures).

## Not built (specified, ready for a next pass)

- Three "synapse" simulations from Stahl (reuptake/agonist dial, occupancy
  window, why antidepressants take weeks): specs are in
  `books/maudsley-stahl-activities.json`; they need a bespoke animated view.
- Server sync for bookmarks/notes (device-local today).
- Book references for the 12 Lab experiments: the supplied books are
  psychiatry texts and do not cover general-psychology experiments; a general
  psychology text is needed (see CURRICULUM_MAP.md, "GP" rows).

## Content corrections found during analysis (for the educator)

- `stabilisers.ts` says lithium levels are taken about 5 days after a change;
  Maudsley Table 2.1 (p. 252) says 7 days.
- Existing medicine modules drift into prescribing detail (titration, tapers,
  dose equivalents) which does not fit training non-prescribers.
- Ahuja (2010) predates the Mental Healthcare Act 2017 and BNS 2023; the
  "Then and now" game turns this into a lesson, with items marked to verify.

## Owner actions (cannot be done from code)

1. **Backups have failed every night since 2026-08-02.** Set the GitHub
   secrets used by `.github/workflows/backup.yml` (`SUPABASE_DB_URL`, `R2_*`,
   `SITE_URL`), fix the alert sender/`RESEND_API_KEY`, re-run the workflow.
2. Educator review of Lab and Casebook content before switching "lab" on.
3. Sentry browser errors are likely blocked by the CSP `connect-src`; allow
   the ingest host or set `tunnelRoute`.
4. Check the live status of the retired flags `knowledge_tutor`, `rounds`,
   `decoder`: their APIs now return 403 unless the flag is unlocked.
5. Decide on a separate Supabase project/branch for Vercel Preview env vars
   (previews otherwise share production data).
