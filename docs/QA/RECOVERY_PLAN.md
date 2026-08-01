# Recovery Plan

Procedures for recovering from common production incidents.

## Incident: Deployment fails to build
1. Read the build log (vercel.com → Deployments → the failed build).
2. Fix the code locally (lint/tsc/build must pass).
3. Push — Vercel retries automatically.
4. If blocked, `git revert` the offending commit.

## Incident: App 500s on a route after deploy
1. Check Vercel function logs: `vercel logs --level error --since 1h`.
2. Match the error digest to a known BUG-xxx (see BUG_REPORT.md).
3. If a regression: **Rollback** (see ROLLBACK_PLAN.md) while fixing.
4. Re-run the full test matrix after the fix.

## Incident: Supabase connection fails / DB unreachable
1. Confirm Supabase status: `status.supabase.com` (check incidents).
2. Verify `.env.local` / Vercel env vars are correct.
3. On this Mac: the known DNS quirk can cause a hang — retry or switch network.
4. Verify connectivity with the REST health check (see docs/SETUP.md).

## Incident: Security header / CSP breaks a page
1. CSP is served globally; a too-strict CSP can block scripts/styles.
2. Loosen the specific directive in `next.config.ts` (e.g., add a host to
   `connect-src` / `img-src`), rebuild, redeploy.
3. Verify the page + headers together.

## Incident: Pending Supabase migration not applied
1. Run the SQL in the Supabase dashboard SQL Editor.
2. If it fails, it's idempotent — safe to re-run after fixing any error.
3. Verify with a query (e.g., assignment with a comma-separated type).

## Data loss / corruption (worst case)
1. Supabase **Database → Backups** → restore a point-in-time snapshot.
2. Re-run any pending migrations after restore.
3. Audit-log nothing yet — note in TECH_DEBT that immutable audit logs are future work.

## Always after recovery
- Update `docs/QA/REGRESSION_REPORT.md` and `BUG_REPORT.md`.
- Add a regression test for the failure mode.
