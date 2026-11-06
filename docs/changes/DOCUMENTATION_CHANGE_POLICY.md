# Documentation Change Policy (Single Source of Truth protocol)

**Rule of precedence:** running code > this knowledge base (`docs/MASTER_ARCHITECTURE.md` and subfolders) > older flat docs in `docs/` > repo-root session notes (`*_AUDIT.md`, `NIGHT_LOG.md`, …). If documentation and code disagree, fix the documentation (or flag a bug) in the same change.

## Status vocabulary (use exactly)
`VERIFIED` read in source · `INFERRED` deduced, not run · `UNVERIFIED` cannot be established from repo · `PROPOSED` not built · `HISTORICAL` no longer current. **Never** write a proposal as implemented.

## Required workflow for every change (human or AI agent)
1. Read `docs/MASTER_ARCHITECTURE.md`.
2. Read the relevant file in `modules/` and `workflows/`.
3. Identify affected dependencies (module "regression set" lines; `inventory/`).
4. Analyse regressions (auth, cohorts, media, flags are the highest-risk shared layers).
5. Write the proposed change down (issue/PR description; mark PROPOSED in docs if long-lived).
6. **Implement only after the owner (Kavya) approves.** Never merge to `main` without the explicit word "merge".
7. Verify the actual implementation (tsc, eslint, `npx vitest run`, build, and a manual/e2e check of touched flows).
8. Update the affected docs (matrix below).
9. Add an entry to `changes/CHANGELOG.md` with the commit it was verified against.
10. Re-verify docs vs code: every path, table, route and env-var name you cited must exist.

## What to update when…
| Code change | Update |
|---|---|
| New/changed route handler | `inventory/API_INVENTORY.md`, `architecture/API_ARCHITECTURE.md` |
| New migration / table / RLS | `inventory/DATABASE_INVENTORY.md`, `architecture/DATABASE_ARCHITECTURE.md` |
| Auth, scope, blocks, cohorts, flags | `modules/AUTHENTICATION.md` or `LMS.md`, `architecture/SECURITY_ARCHITECTURE.md` |
| Video/media | `modules/VIDEO_SYSTEM.md`, `workflows/VIDEO_PROCESSING.md` |
| New feature / removed feature | `inventory/FEATURE_INVENTORY.md` (+ class), `UNUSED_FEATURES.md` |
| New env var / vendor | `inventory/INTEGRATION_INVENTORY.md` (names only, never values) |
| Workflow/cron | `architecture/INFRASTRUCTURE.md` |
| Design decision | `history/ARCHITECTURAL_DECISIONS.md` |

## Never document
Secrets, keys, tokens, passwords, user data, or production URLs of private dashboards.

## Quick verification commands (read-only)
```
find src/app -name page.tsx | wc -l          # pages
find src/app -name route.ts | wc -l          # route handlers
grep -rhoiE "create table( if not exists)? +(public\.)?[a-z_]+" supabase src/migrations_pending | sort -u | wc -l
git log --oneline -1 origin/main              # commit to cite in "Verified against"
```
