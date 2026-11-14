# Deployment

Checked against the Vercel project `bind-lms-platform` (team "drsarthakpsychology's projects") and GitHub `drsarthakpsychology/bind-lms-platform` on 2026-11-14.

## Where things run

| Branch | Vercel environment | Address | Database |
|---|---|---|---|
| `main` | Production | `vibhapsychology.com` (also `bind-lms-platform.vercel.app`) | Live Supabase project |
| `admin-redesign` | Preview (the test link) | The branch link Vercel shows for `admin-redesign` (Deployments, filter by branch) | **The same live Supabase project** (owner choice, 2026-11-06) |
| Any other branch or pull request | Preview | A one-off Vercel preview URL | Whatever preview variables apply (no R2, no service key except on `admin-redesign`) |

Region: `bom1` (Mumbai), set in `vercel.json`. Supabase is in ap-south-1 (Mumbai) too.

State on 2026-11-14: `origin/admin-redesign` is 26 commits ahead of `origin/main`, and `origin/main` has 1 commit that is not on `admin-redesign` (the phone tab bar fix, `a95eff32`). Merge `main` into `admin-redesign` before the next release so nothing is lost.

## How a change goes live

1. Work on a branch. Agents work in their own worktree and branch (`agent/*`) and never push.
2. Merge into `admin-redesign`. Pushing it builds the test link.
3. CI runs on every push and pull request (`.github/workflows/ci.yml`): `npm ci`, `tsc --noEmit`, `npm run lint`, `vitest run`, `next build`, on Node 22.
4. The owner checks the test link. Remember it writes to the live database.
5. When the owner says "merge", merge `admin-redesign` into `main` and push. Vercel builds and promotes production automatically.
6. Check `/api/health` and the main student path (login, dashboard, play a lecture).

`next.config.ts` sets `deploymentId`, so a tab opened before a deploy reloads on its next page change instead of calling Server Actions that no longer exist. Saves go through `/api/save`, which does not depend on the deployment.

## Database changes (migrations_pending procedure)

Code deploys never touch the database. Schema changes are SQL files the owner runs by hand.

1. Put an idempotent SQL file in `supabase/migrations_pending/<yyyy_mm_dd>_<name>.sql` (`if not exists`, guarded `do` blocks, no drops of data). Say at the top what it does, why, and the deploy order.
2. Order:
   - Additive change that new code needs (new table or column): run the SQL first, then deploy.
   - Change that old code would break on (tighter policy, trigger that rejects old writes): deploy first, then run the SQL. The file header says so (example: `2026_11_14_security.sql`).
3. Run it: Supabase dashboard, SQL editor, project `hojhzwvuccojqkvkkslw`, paste, Run. Or `npx tsx scripts/apply-pending.ts <name>` for files in `src/migrations_pending` (needs `SUPABASE_DB_PASSWORD`, records the name in `_migrations_applied`).
4. Check the objects exist (a table, index or trigger the file creates). The two migration logs are incomplete, see `docs/architecture/DATABASE.md`.
5. Waiting for the owner now: `supabase/migrations_pending/2026_11_14_scaling_indexes.sql` (indexes only, safe at any time).

## Rollback

- Code: Vercel dashboard, Deployments, pick the last good production deployment, "Instant Rollback" (or "Promote to Production"). Every production deployment is a rollback candidate. This takes seconds and does not rebuild. Then revert the bad commit on `main` so the next push does not bring it back.
- Database: there is no automatic down migration. Write a new forward SQL file that undoes the change. For data loss, restore from the nightly dump (`docs/RESTORE_RUNBOOK.md`, dumps in R2 `plms-backups`). The Free plan has no point-in-time recovery.
- Feature: switch the flag off at `/admin/flags`. This needs no deploy and takes effect within 30 seconds (flag cache).

## Feature flags

- Table `feature_flags`, three states: `off`, `live` (shown as coming soon), `unlocked`. Admin page `/admin/flags`. Code: `src/lib/flags.ts`.
- Code constants (need a deploy to change): `EXAM_TRACKS_ENABLED`, `PREP_ONBOARDING_ENABLED` in `src/lib/prep/catalog.ts`.
- Env switches: `AI_ENABLED`, `NEXT_PUBLIC_PSYCH_MODE`.
- Current values: `docs/FEATURES_STATUS.md`.

## Scheduled jobs

Vercel Cron jobs are declared in `vercel.json` and only run on production. GitHub Actions jobs call the production URL in the `APP_URL` or `SITE_URL` secret. Both need `CRON_SECRET` set in Vercel, which is missing today (see `docs/ENVIRONMENT_VARIABLES.md`). Full list: `docs/architecture/BACKEND.md`.

## Environment variables

Change them in Vercel, Settings, Environment Variables, then redeploy (variables are read at build and start). Names and where each is set: `docs/ENVIRONMENT_VARIABLES.md`.

## Before every production release

- CI green on the commit.
- Any SQL the release needs has been run (or the order in its header is followed).
- Test link checked on a phone and a desktop.
- `docs/QA/DEPLOYMENT_CHECKLIST.md` for the longer list.
