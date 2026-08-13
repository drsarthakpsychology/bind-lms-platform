# MORNING REPORT — 2026-08-13

## What's LIVE right now
Deployed to production (Vercel, auto-deploy from main): **bind-lms-platform**
— https://bind-lms-platform-2k7skr2nd-drsarthakpsychologys-projects.vercel.app
Round 8 is fully merged to main, verified green (340 unit tests, tsc, lint,
build), and the production deployment tracks main.

## Round 8 — what shipped overnight (2026-08-12 → 2026-08-13)
- **Course rebuilt as a linear week-by-week path** (Finding 1): one vertical
  path, current week expanded, future weeks locked with a stated reason,
  one highlighted next-action row. Materials/Assignments no longer show
  twice.
- **Haptics audit**: all 23 practice activities now fire on tap, state
  change, and correct/incorrect answer — verified surface by surface.
- **A5**: "AI-generated — not yet faculty reviewed" label on student debrief
  + the admin review queue, so nothing scored by the model reads as final
  faculty judgement.
- **A7 Dictate-as-conversation scaffold**: voice recorder → server STT →
  the 21-field interviewer state machine → a sim_case draft
  (`source='faculty_dictated'`, `approved=false`). Classic typed form kept
  as a fallback tab. **The table for this (`corpus_dictations`) was only
  applied to the live DB just now** — see infra item below.
- **Focus management**: MSE drill + long forms now keyboard-navigable
  end to end (a real gap for keyboard-only users, not cosmetic).
- **Content volume**: idioms → 110, quiz bank +15, Two-Minute Clinic +20
  (138 total), scoring-logic test coverage +10 (21 total on that path).
- **Infra text-column audit** [Master §9.3]: 3 migrations that were
  code-complete but never applied live (course weeks, practice_chains,
  corpus_dictations) are now live. Audited every text/jsonb column against
  the existing size-cap pattern and found 3 already-live tables that had
  slipped through (formulation_wall_posts, pair_messages, library_notes) —
  8 new caps added total, verified via a live pg_constraint query
  (5 → 14 `*_cap` constraints).

## Incomplete (honest)
- Lessons: still a handful of authored readings; video content is the
  next authoring effort (no fabricated assets shipped in its place).
- 200+ characters: 70 authored, 62 live on the picker (Tier 2 upserted
  fully; Tier 3/4 upsert is one script run away — `scripts/
  upsert-characters.ts`).
- Paid-book corpus: the drop-folder ingest (`/mnt/acquire/`) is still the
  one item that needs your files, not more code — see NEEDS_KAVYA.md.
- The A7 dictate table just went live tonight; nobody has dictated a case
  through it yet — worth a real run to catch anything the scaffold missed.

## Infra
Postgres healthy · advisors: security clean except one pre-existing
SECURITY DEFINER trigger-function pattern (matches touch_material/
touch_assignment already flagged before tonight, not a new regression) ·
text-column size caps now cover every table that accepts free-text or
jsonb from a student or faculty member, including tonight's newest ones.

## Top 3 worth your attention
1. Drop the purchased books into `/mnt/acquire/` — the ingester is ready;
   that single action turns your purchases into the patient-voice corpus.
2. Paste any no-train API key (NVIDIA free tier works) — the real
   Director/Actor + scoring light up instantly; NEEDS_KAVYA.md has the
   exact verification command per key.
3. Try `/admin/corpus/dictate` for real — talk through one composite case
   and see whether the interviewer's follow-up questions actually feel
   right before more volume gets built on top of it.
