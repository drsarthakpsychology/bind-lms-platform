# Integration report — VIBHA LMS transformation

Branch `integration/vibha-lms-transformation-20261103`, based on `main` @
`26aaa11` (which is `2b42099` + the `fix-student-nav` merge). **Nothing merged
to `main`.** Waiting for `APPROVED — MERGE TO MAIN`.

## What was applied

The review package `vibha-lms-transformation.zip` was treated as a set of
suggestions, not copied verbatim. All 175 SHA-256 checksums verified.

- `CHANGES.patch` / `patches/0001–0019.patch` applied with `git am --3way`:
  all 19 commits applied **cleanly** (no conflicts). 19 commits on top of
  `main`.
- New features: Psychology Lab (`/games/lab`, 12 experiments), Casebook
  (`/games/lab/cases`, 36 games), Revise (`/games/revise`), Notes bookmarks +
  personal notes, admin Learning insights (`/admin/learning`) + CSV
  (`/api/admin/learning/csv`), the `lab` feature flag, and the security fixes.
- Routes confirmed in the build: `/games/lab`, `/games/lab/[id]`,
  `/games/lab/cases`, `/games/lab/cases/[id]`, `/games/revise`,
  `/admin/learning`, `/api/admin/learning/csv`.

## Conflicts and how they were resolved

The package was built on `main @ 2b42099`; `main` had since gained one change
(`fix-student-nav`, `26aaa11`), which touches only `src/app/(dashboard)/layout.tsx`.
The transformation does not touch that file, so `git am --3way` needed no
manual resolution.

One environment issue surfaced during validation, fixed in a small commit
(`aedb59a`):

- **`src/lib/learn/store.test.ts` — 5 tests failed** on Node 26 (`Cannot read
  properties of undefined (reading 'clear')` at `window.localStorage.clear()`).
  Cause: Node ≥22 ships an experimental webstorage global that leaves jsdom's
  `window.localStorage` undefined under Node 26.5.1. The package author's
  770-test run was on an older Node where this doesn't happen.
  **Fix:** added a guarded in-memory `localStorage` shim to `vitest.setup.ts`
  (only fills in a *missing* storage; never overrides a real implementation).
  No production code changed.

## Validation (all pass)

| Check | Result |
|---|---|
| `npm ci` | — (no new dependencies; `package.json`/`package-lock.json` unchanged) |
| `npm run lint` | 0 errors, 0 warnings |
| `npx tsc --noEmit` | 0 errors |
| `npm run test` | **127 files, 770 tests, all pass** |
| `npm run build` | passes; new Lab/Revise/admin routes compile |

## Security review

Confirmed in the applied code:

- **Lab gate** (`src/app/(dashboard)/games/lab/gate.ts`): admins bypass;
  students go through `requireFeature("lab")`. The Lab stays **Hidden** until
  an educator reviews it.
- **CSV route** (`src/app/api/admin/learning/csv/route.ts`): `requireAdmin()`
  before any data read; returns 401 otherwise.
- **CSV injection** (`csvCell` in `src/lib/insights/learning.ts`): cells
  starting `= + - @ \t \r` are prefixed with `'`, then properly quoted.
- **Lab normalise**: rejects junk ids / non-numeric results (covered by
  `src/lib/lab/lab.test.ts`).

Against the audit's HIGH findings (`docs/transformation/DISCOVERY_AUDIT.md`):

| Finding | Fixed by this package | Remaining |
|---|---|---|
| H1 — client can write XP/state | Partly: server-side XP clamp, per-student local-storage key, lecture progress bounded by real duration | Full server-authoritative XP (event-based, `xp` column only) is a larger change not in this package |
| H2 — master password on public login | Partly: exact email match (no `ilike` wildcards) + Postgres rate limits | Still on the public sign-in form; the audit's preferred fix (admin-only impersonation with re-auth + audit banner) is not done |
| H3 — admin pages rely on layout alone | Mostly: data-reading admin pages now call the admin check themselves | 17 service-role pages remain; the audit's "not verified by live exploit" test (forged `Next-Router-State-Tree`) is still outstanding |

The API-gate fixes (37 routes honour blocks/scope/switches/flags), submission
path ownership, and doubts visibility checks are applied and unit-tested.

## Still needs the owner / an educator

1. **Educator review** of Lab + Casebook content before switching `lab` on —
   see the checklist in `docs/transformation/CURRICULUM_MAP.md` (§7). The Lab
   must stay **Hidden** until then.
2. **Owner-only DB/ops items** (from `IMPLEMENTATION_SUMMARY.md`): nightly
   backups have failed since 2026-08-02 (set `SUPABASE_DB_URL`, `R2_*`,
   `SITE_URL`, alert sender); decide on the retired flags `knowledge_tutor` /
   `rounds` / `decoder` (their APIs now 403 unless unlocked); decide on a
   separate non-production Supabase project for preview env vars.
3. **Two optional migrations** (not applied anywhere): `2026_11_lab_flag.sql`
   (inserts the `lab` flag row, `off`) must be run before the Lab is unlocked;
   `2026_11_learn_progress_server_writes.sql` only after deploy with
   `SUPABASE_SERVICE_ROLE_KEY` confirmed; `2026_11_progress_updated_at.sql`
   safe any time.
4. **Three branching Casebook cases** (`k1-15-asking-about-suicide`,
   `k2-ed-five-questions`, `k2-elder-branching`) need a manual play-through —
   the generic player loops by design; their structure is unit-tested.

## Preview

(PR preview URL goes here once the pull request is opened.)
