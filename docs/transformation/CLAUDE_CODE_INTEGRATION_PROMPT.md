# Claude Code integration prompt — VIBHA LMS transformation

Paste everything below the line into a new Claude Code session that has the
VIBHA LMS repository (`drsarthakpsychology/bind-lms-platform`) checked out and
the release ZIP (`vibha-lms-transformation.zip`) available on disk.

---

You are integrating a **proposed** set of changes into the VIBHA School of
Psychology LMS. The ZIP is a review package, **not** something to copy over
the repository. Treat every file in it as a suggestion that must be checked
against the current code before it is applied.

## Hard rules (do not break any of these)

1. **Never merge to `main`, never deploy to production, never run a
   migration against the production Supabase project** until the owner types
   exactly: `APPROVED — MERGE TO MAIN`. Anything else, including "looks good",
   is not approval.
2. Work on a new branch: `integration/vibha-lms-transformation-<YYYYMMDD>`,
   created from the current `main`. Do not force-push any existing branch.
3. Never commit `.env*` files, keys, tokens or student data. Do not print
   secrets. Follow AGENTS.md (it contains repository rules, including the
   Next.js 16 note and the design-system skill to load before UI work).
4. Do not delete or rewrite existing features to make the new code fit.
   If something conflicts, stop and report it with both versions.

## Step 1 — Understand the current repository

- Read `AGENTS.md`, `docs/SYSTEM_MAP.md`, `docs/STUDY.md`.
- Note the current `main` commit hash. The package was built on top of
  `main` @ `2b42099`. Run `git log --oneline 2b42099..main` to see what has
  changed on `main` since then; those are the places conflicts are likely.

## Step 2 — Inspect the ZIP

- Unzip into a scratch folder **outside** the repository.
- Read, in order: `IMPLEMENTATION_SUMMARY.md`, `FILE_MANIFEST.md`,
  `TESTING_REPORT.md`, `docs/transformation/DISCOVERY_AUDIT.md`,
  `docs/transformation/CURRICULUM_MAP.md`, `CHANGES.patch`.
- The manifest lists each file as **new** or **modified** with its SHA-256.
  Verify the hashes (`sha256sum -c checksums.sha256`).

## Step 3 — Compare against the repository

- Preferred path: the package includes `CHANGES.patch` (a `git format-patch`
  series from `2b42099`). Try `git am --3way` on the integration branch.
  If it applies cleanly, still review every hunk.
- If it does not apply, use the full copies in `files/` and merge by hand,
  file by file. For every **modified** file, diff the package copy against
  the current repository file and keep any changes made on `main` since
  `2b42099`.
- List every overlap: same route, same component, same migration name, same
  feature-flag key, same `LearnState` field name.

## Step 4 — Architecture and database dependencies to confirm

- **Learn state JSON** (`src/lib/learn/engine.ts`, `store.ts`): the package
  adds a `lab` field to `LearnState` (with `normalise`, `mergeCopies` and
  tests). Confirm nothing else on `main` added a field with the same name.
- **Feature flag** `lab`: added to `FeatureKey` in `src/lib/flags.ts` and the
  label in `admin/flags/page.tsx`. Migration
  `supabase/migrations_pending/2026_11_lab_flag.sql` only inserts the flag row
  (status `off`). It changes no table. Confirm the `feature_flags` table has
  `status` and `enabled` columns in the target database.
- **Routes**: `/games/lab`, `/games/lab/[id]`, `/games/lab/cases`,
  `/games/lab/cases/[id]`, `/games/revise`, `/admin/learning`,
  `/api/admin/learning/csv`. Confirm none collide with routes on `main`.
- **Security changes touch many existing files** (28 admin pages, 37 API
  routes, learn save action, lecture progress, master login, submissions,
  doubts, instrumentation). These are the most likely merge conflicts with
  `main`; resolve hunk by hunk and keep both the new guard and any new
  behaviour from `main`.
- **Optional migrations**: `2026_11_learn_progress_server_writes.sql` must
  only be applied AFTER the new code is deployed and
  `SUPABASE_SERVICE_ROLE_KEY` is confirmed set (otherwise student saves
  fail). `2026_11_progress_updated_at.sql` is safe any time.
- **Behaviour changes to confirm with the owner**: blocked accounts now get
  403 (was 401) from practice APIs; the retired flags `knowledge_tutor`,
  `rounds`, `decoder` now gate their APIs.
- **Casebook content is generated** from `docs/transformation/books/*-activities.json`
  by `scripts/casebook/convert-activities.py`; edit the JSON and re-run
  rather than editing `src/content/casebook/*.ts` by hand.
- **No new npm dependencies** are expected; confirm `package.json` and
  `package-lock.json` are unchanged (the manifest says so if true).

## Step 5 — Validate

Run, and paste the results into your report:

```
npm ci
npm run lint
npx tsc --noEmit
npm run test
npm run build
```

All must pass. If something fails, fix it on the integration branch with a
small commit and explain why.

## Step 6 — Security review

- Every new server page and route handler must check access: admin pages sit
  under `src/app/(dashboard)/admin/` (gated by its layout) **and** route
  handlers call `requireAdmin()` themselves.
- The Lab gate (`src/app/(dashboard)/games/lab/gate.ts`) lets admins in and
  sends students through `requireFeature("lab")`.
- Student-written state goes through `normalise()` before saving; check the
  new `lab` normaliser rejects junk ids and non-numeric results.
- CSV export must escape cells and neutralise formula injection.
- Re-read the audit's "Security findings" and say which are fixed by this
  package and which remain.

## Step 7 — Apply safely

- Commit in logical groups (Lab, revision, notes, admin, docs). Use clear
  messages.
- Push the integration branch and open a pull request against `main`.
  **Do not merge it.**

## Step 8 — Verify the whole application

- Start the app with a **non-production** Supabase project (local
  `supabase start` or a Supabase branch). Apply only the pending migrations
  needed for the Learn and Lab features to that database:
  `supabase/migrations_pending/2026_11_learn.sql` (if not already present)
  and `2026_11_lab_flag.sql`.
- Student journey: login → dashboard → Notes → a module → a section →
  bookmark + note → checkpoint → Games → Lab → run an experiment → result →
  check → reflect → Lab home shows it done → Casebook library → play a game
  → Revise shows re-checks when due (set the clock or seed state to test).
- Manually play the three branching cases with "try again" loops:
  `k1-15-asking-about-suicide`, `k2-ed-five-questions`, `k2-elder-branching`.
- Security: as a lectures-only student, a blocked student, and a student with
  a switched-off tool, call a practice API and confirm 403; as a student,
  open an admin URL and confirm redirect.
- Admin journey: login → admin → What's live → set **Psychology Lab** to
  Unlock → preview it as a student → Learning insights → download CSV.
- Check phone (390×844), tablet (820×1180) and desktop (1440×900), light and
  dark, with Playwright. No horizontal scroll, no console errors.

## Step 9 — Preview build

- Vercel builds a preview for every pull request through the GitHub
  integration. Confirm the preview's environment variables point at a
  **non-production** Supabase project before testing writes. If the preview
  uses production variables, say so in the report and test read-only.

## Step 10 — Report

Write `INTEGRATION_REPORT.md` on the integration branch with: what was
applied, what conflicted and how you resolved it, test output, security
notes, the preview URL, and anything still needing the owner or an educator
(including the educator-review checklist in `CURRICULUM_MAP.md`; the Lab must
stay **Hidden** until an educator has reviewed it).

Then stop and wait. Only after the owner types `APPROVED — MERGE TO MAIN`:
re-run the checks, merge the PR with a merge commit, and leave production
migrations for the owner to run unless they explicitly ask you to.
