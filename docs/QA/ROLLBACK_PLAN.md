# Rollback Plan

How to undo a bad production deployment quickly and safely.

## Fastest path: Vercel Promote
1. Go to **vercel.com** → project `bind-lms-platform` → **Deployments**.
2. Find the last known-good deployment (the one before the bad push).
3. Click the **⋮** menu → **"Promote to Production"**.
4. Vercel instantly swaps the alias `bind-lms-platform.vercel.app` to that
   build. No code changes, no rebuild.

## Code rollback (permanent revert)
1. `git log --oneline` to find the bad commit.
2. `git revert <bad-commit>` (creates an inverse commit — keeps history).
3. `git push` → Vercel auto-deploys the reverted state.
   (Alternative: `git reset --hard <good-commit>` + `git push --force` — only if
   the bad commit was never shared with collaborators.)

## Database / data rollback
- Supabase is a separate service; Vercel rollback does **not** revert DB state.
- If a migration caused data issues:
  1. Use Supabase dashboard → **SQL Editor** to reverse the migration manually,
     or restore a point-in-time backup (**Database → Backups**).
  2. Document the migration ID and its inverse in `supabase/migrations_pending/`.

## During rollback
- Do **not** create new data (no student/test submissions) until the app is
  verified back on the good build.
- Update `docs/QA/REGRESSION_REPORT.md` with the rollback event.

## Recovery plan (after rollback)
1. Confirm production URL serves the good build (`curl -I` + smoke test).
2. Re-run the full deployment checklist.
3. Root-cause the failure, add a regression test, document in BUG_REPORT.md.
