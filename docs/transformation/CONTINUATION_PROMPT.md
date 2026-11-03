# Continuation prompt — VIBHA LMS transformation (paste into a new Claude Code session)

You are continuing work on the VIBHA School of Psychology LMS. Repository:
`drsarthakpsychology/bind-lms-platform`. Work ONLY on branch
`feature/vibha-lms-transformation` (draft PR #42 → `main`). Everything listed
under "Done" is committed, pushed and green. Your job is the "To do" list, in
order. Stop and ask the owner only where a step says so.

## Hard rules

1. Never push to `main`, never merge PR #42, never deploy, never run SQL on the
   production Supabase project. The owner merges only after typing
   `APPROVED — MERGE TO MAIN`.
2. Read `AGENTS.md` first (Next.js 16: read `node_modules/next/dist/docs/`
   before writing framework code). Load the `vibha-design` skill
   (`.claude/skills/vibha-design/SKILL.md`) before any UI change.
3. Student-visible text: plain short English. NO book names, page numbers,
   citations or "educator review" wording anywhere a student can see it.
   Sources live only in metadata (`bookRef`, `refs`, `reviewFlags`) shown to
   admins. Tests enforce this (`src/lib/casebook/casebook.test.ts`,
   `src/lib/lab/lab.test.ts`) — keep them green.
4. No database migration unless the owner approves in chat. Prefer code-only.
5. Gate before every commit (all must pass):
   ```
   npx tsc --noEmit && npm run lint && npx vitest run
   ```
   and before pushing a feature, also:
   ```
   rm -rf .next && NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy SESSION_SECRET=devdevdevdevdevdevdevdevdevdevdev NEXT_PUBLIC_APP_URL=http://localhost:3100 npx next build
   ```
   (If a scratch folder `src/app/zz-lab-harness` exists, move it out first;
   it is git-excluded via `.git/info/exclude` and is only for visual checks.)
6. Commit in small logical groups with clear messages; push after each.
7. Supabase is not reachable from the sandbox. Visual checks use a scratch
   route under `src/app/zz-lab-harness/` that renders the client component with
   fixture data (`serverState={null}`, `save={async () => ({ ok: true })}`),
   driven by Playwright at 390×844, 820×1180, 1440×900, light and dark. Never
   commit that folder.

## Done (do not redo)

Read `docs/transformation/IMPLEMENTATION_SUMMARY.md` and `TESTING_REPORT.md`.
In short: Psychology Lab (12 experiments, `/games/lab`), Casebook engine +
36 textbook-based games (`/games/lab/cases`), Revise (`/games/revise`), notes
bookmarks + personal notes, admin Learning insights (`/admin/learning`),
one-button email to quiet students (`/admin/pulse`), cohort-only recordings
(cohort chosen at upload; students see only their cohort), separate Quiz vs
Overall leaderboards, references removed from student screens, security fixes,
adaptive-round logic (`src/lib/casebook/rounds.ts`, tested but NOT yet wired
in). All behind the existing flags; Lab + Casebook behind the `lab` flag.

## To do, in order

### 1. Wire the easy→hard adaptive rounds into the Casebook player (code-only)
- File: `src/components/casebook/case-player.tsx`, component `ItemRound`. Today
  it does `shuffle(items).slice(0, ROUND)`.
- Change it to: compute `tier = nextTier(last)` where `last` is the student's
  previous result for this activity (`st.lab["cb-" + id].result` has `right`,
  `total`; also store `tier` in that result), then
  `buildRound(items, tier, ROUND, Math.random)` from `src/lib/casebook/rounds.ts`.
  Pass `tier` down from `src/components/casebook/case-view.tsx` (it already
  reads the learn state) and save `{ right, total, tier }` via `recordLabRun`.
- Show the tier as a small chip before Start: "Warm-up" / "Standard" / "Hard"
  (`TIER_LABEL`). After the score: "Next round: Hard" etc.
- Items need `difficulty` (1|2|3). Add `difficulty?: 1 | 2 | 3` to item types
  in `src/lib/casebook/types.ts` (SpotterItem, McqItem, TriageItem, Sort items,
  SkillItem) and accept it in `validate.ts` (must be 1, 2 or 3 if present).
- Library order: in `src/components/casebook/casebook-index.tsx` and
  `casebook-shelf.tsx`, sort Foundation → Intermediate → Advanced and show a
  short "Start here" hint on the first unplayed Foundation game.
- Tests: extend `src/lib/casebook/rounds.test.ts` if logic changes; add a test
  that every `difficulty` present is 1–3.

### 2. Add difficulty to the existing 36 activities, and write many more games
- Source books are on the `books` branch (folder `BOOKS/`, ~86 MB PDFs). Do
  NOT merge that branch. Extract once:
  ```
  mkdir -p /tmp/books && git fetch origin books && git archive origin/books BOOKS | tar -x -C /tmp/books
  for f in /tmp/books/BOOKS/*.pdf; do pdftotext -layout "$f" "/tmp/books/$(basename "$f" .pdf).txt"; done
  ```
  Pages are separated by form-feed characters.
- Per-book maps with chapter/page indexes and opportunity tables already exist:
  `docs/transformation/books/{kaplan-part1,kaplan-part2,fish-ahuja,maudsley-stahl}.md`.
  Use them to find material fast; do not re-analyse whole books.
- Existing content sources: `docs/transformation/books/*-activities.json`
  → converted by `scripts/casebook/convert-activities.py` into
  `src/content/casebook/*.ts` (generated; never hand-edit). The converter also
  accepts files ALREADY in Casebook shape and sanitises student text.
- Write new files directly in the Casebook shape of `src/lib/casebook/types.ts`:
  `docs/transformation/books/kaplan-casebook-2.json` (id prefix `k3-`),
  `fish-ahuja-casebook-2.json` (`fa2-`), `maudsley-stahl-casebook-2.json`
  (`ms2-`). Target 25–35 activities each, 6–12 items per activity, every item
  with `difficulty` (≈30% 1, 40% 2, 30% 3; items ordered easy→hard). Hard =
  look-alike presentations, subtle discriminating clue, atypical age/culture,
  or the obvious answer is wrong; the explanation must name the clue.
  Medicines: psychologist framing only (recognise, explain, monitor, refer) —
  never doses. Indian context welcome; current Indian law (MHA 2017, BNS 2023).
  Original wording only; never copy more than a short phrase; no invented
  statistics. Topics already covered: see `src/content/casebook/*.ts` titles.
- Convert each new file:
  ```
  python3 scripts/casebook/convert-activities.py docs/transformation/books/kaplan-casebook-2.json KAPLAN_3 src/content/casebook/kaplan-3.ts --prefix k3
  ```
  (same pattern for `FISH_AHUJA_2`/`fish-ahuja-2.ts`, `MAUDSLEY_STAHL_2`/
  `maudsley-stahl-2.ts`), then add the exports to `src/content/casebook/index.ts`.
- Also add `difficulty` to items in the four existing JSON sources and
  re-run the converter commands listed at the top of
  `scripts/casebook/convert-activities.py`'s docs (or the PR history).
- Gate must stay green (the validator checks answers, categories, branches).

### 3. Admin simplification (UI only; no DB)
- Follow `docs/transformation/ADMIN_SIMPLIFICATION_AUDIT.md`. First make the
  four menus agree from ONE config: desktop sidebar (`ADMIN_SECTIONS` in
  `src/components/navigation/nav-config.ts`), phone drawer (`ADMIN_ITEMS`),
  phone bottom tabs (`ADMIN_TABS` in `bottom-tab-bar.tsx`), search palette
  (`src/lib/search/palette.ts`).
- Add a global cohort switcher for admin pages: `?cohort=<id>` in the URL, a
  visible chip "Managing: <cohort>" / "All cohorts" in the admin header, read
  by pages that can filter (People/students, Progress `/admin/pulse` (already
  reads `?cohort=`), Learning insights `/admin/learning`, Mail).
- Do NOT delete pages; merge only where the audit marks "merge", keep old
  URLs working with redirects in `next.config.ts`.
- Before removing or renaming any menu item, list the change in the PR body.

### 4. Waiting for the owner (ask, don't build)
Database-backed cohort work in `docs/transformation/COHORT_PROPOSAL.md`
(§3, §9, §10): enrolment history, per-cohort schedules and due dates, live
sessions, attendance, announcements, "Completed → read-only alumni". Owner
answers so far: several cohorts at once = yes; same curriculum, own dates;
transfers keep progress with history split by date; completed = read-only
alumni; email pre-select = no activity 7+ days. Still to ask: programmes (one
or many), certificate tied to cohort completion, cohort-scoped admin roles,
in-browser content editor, which reports/attendance, and Q10–12 in §10. Write
the migration only after explicit approval; test it on a local or branch
database, never production.

### 5. Nice-to-have (only if credits remain)
- Three "synapse" simulations specified in
  `docs/transformation/books/maudsley-stahl-activities.json` (ids ms-act-02/03/04).
- Server sync for notes/bookmarks (`src/lib/study/marks.ts` TODO).
- Fix `src/migrations_pending/course_weeks.sql` syntax (`alter table if not exists`).

## Finish
1. Update `docs/transformation/IMPLEMENTATION_SUMMARY.md`, `TESTING_REPORT.md`
   and `PROGRESS_LOG.md` with what you did and what you tested.
2. Rebuild the review package:
   `scripts/release/build-transformation-zip.sh 2b42099 release` and copy
   `docs/transformation/CLAUDE_CODE_INTEGRATION_PROMPT.md` next to it.
3. Update the PR #42 description (keep it a draft). Do not merge.

## Owner actions (tell them; you cannot do these)
- Nightly DB backups have failed since 2026-08-02: set GitHub secrets
  `SUPABASE_DB_URL`, `R2_*`, `SITE_URL`; fix `RESEND_API_KEY`/sender; re-run.
- Set `RESEND_API_KEY` so the quiet-student email can send.
- Confirm `2026_11_cohorts.sql` is applied in production.
- Educator review of Lab/Casebook before setting the `lab` flag to Unlock.
