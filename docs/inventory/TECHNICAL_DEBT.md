# Technical Debt & Health Audit
> Verified against `main` @ `b2a9698`. Severity: H/M/L is a judgement; each item cites evidence. "UNVERIFIED" = could not be proven from the repo.

## Database & migrations
| # | Finding | Evidence | Sev |
|---|---|---|---|
| D1 | No applied-migration ledger; 73 SQL files in two `*migrations_pending` folders; ordering across them is implicit | `supabase/`, `src/migrations_pending/` | H |
| D2 | `page_visits` queried but never created in repo SQL | `/api/visit`, `lib/people/presence.ts` | M |
| D3 | `profiles.cohort_ended_at` referenced (index, triggers, cron) but no `ADD COLUMN` in repo SQL | `perf_indexes.sql`, `profiles_mobile_number.sql`, cron | M |
| D4 | Leaderboards read up to 2,000 `learn_progress` / 5,000 `profiles` rows in-process | `lib/learn/leaderboard.ts` | L now, M at scale |
| D5 | Dual visibility paths (cohort vs legacy enrolment) | `lib/cohorts/rules.ts` | M |
## Security
| # | Finding | Evidence | Sev |
|---|---|---|---|
| S1 | CSP retains `'unsafe-inline'` for scripts/styles | `next.config.ts` | M |
| S2 | Service-role client used broadly; ownership checks load-bearing | `docs/SECURITY_AUDIT.md` (62 files, 2026-08-14 — stale count) | M |
| S3 | Support key = intentional admin bypass for student accounts (logged, hashed) | `lib/auth/master*.ts` | policy |
| S4 | `/openapi.json` static, completeness UNVERIFIED | route | L |
## Reliability / correctness
| # | Finding | Evidence | Sev |
|---|---|---|---|
| R1 | Reminders cron is a stub but scheduled nightly | cron route, `reminders.yml` | M |
| R2 | Certificate prints e-mail instead of name; PDF stored in `videos` bucket | `certificate-action.ts` | M |
| R3 | `prune-logs` not scheduled | workflows | L |
| R4 | Error handling in cron `alumni-transition`/`release-scheduled` returns 500 on failure but no alerting beyond workflow failure | cron route | L |
## Code health
| # | Finding | Evidence | Sev |
|---|---|---|---|
| C1 | Very large files: `video-player.tsx` 1,407 lines; data files up to 2,626 lines | wc -l | L |
| C2 | Dead-code candidates | `docs/DEAD_CODE.md` | L |
| C3 | Several `TODO` stubs (reminders cron, embeddings, notes sync, legal address) | `grep -rn TODO src` | L |
| C4 | 22 server-action files each hand-roll guards (shared helpers exist) | `requireAdmin` usage | L |
## Documentation drift (pre-existing docs vs code)
- `docs/SYSTEM_MAP.md` lists Next `^16.3.1`, Sentry `^10.69`, zod `^4.4.3`, `cmdk`; `package.json` has Next `^16.4.3`, Sentry `^10.78`, zod `^4.6.7`, **no `cmdk`**. Its route map predates cohorts/games/doubts/journey/leaderboard sections.
- `docs/SECURITY_AUDIT.md` dated 2026-08-14 — pre-dates support key, access blocks, cohort rules.
- Repo-root `*_AUDIT.md`, `NIGHT_LOG.md`, `RESUME.md` are historical session notes.
## Missing documentation
No per-table data dictionary beyond [DATABASE_INVENTORY](DATABASE_INVENTORY.md); no incident/ops runbook for LiveKit worker deploy; Vercel/Supabase dashboard configuration not captured.
