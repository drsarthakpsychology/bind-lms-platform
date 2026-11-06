# Unused, Uncertain & Stubbed Features
> Verified against `main` @ `b2a9698`. **Nothing here is recommended for deletion.** "Apparently unused" is based on source references only; no production usage telemetry was available.

## Confirmed stubs / partial
| Item | Evidence | Impact |
|---|---|---|
| Daily reminders e-mail | `api/internal/cron/route.ts` `send-reminders` logs `not_configured`, returns ok; workflow `reminders.yml` still runs nightly | students get no digest; log row written to `ai_usage_log` each day (status `error`) |
| Embedding provider call | `lib/ai/embed.ts` has `TODO(provider)`; falls back to deterministic hash vector | `ai/embed()` is not semantic; RAG retrieval uses `lib/knowledge/embed-local.ts` instead (INFERRED) |
| Alumni transition | cron updates `profiles.role` where `cohort_ended_at <= now`; no app code sets `cohort_ended_at`; no `ADD COLUMN` in repo SQL | transition only occurs if someone sets the column in the DB (UNVERIFIED) |
| Notes marks sync | `lib/study/marks.ts`, `marks-store.ts` TODO(server sync) | highlights saved per device only |
| Policy business address | `lib/legal-constants.ts` TODO token | legal page shows token |
| Cron `prune-logs` | implemented, no workflow calls it | `ai_usage_log`/`provider_health` grow unless called elsewhere (UNVERIFIED) |

## Candidates needing usage evidence (class D/H)
- Peer role-play (`/practice/role-play`, `pair_*`).
- `ADMIN_*` audit/plan markdown at repo root (`AUDIT.md`, `LANDING_PLAN.md`, `NIGHT_LOG.md`, `RESUME.md`, `BRIEF_V5_MASTER.md` …) — historical working notes, not code.
- `psych_*` observation tables with no `.from()` callers (see [DATABASE_INVENTORY](DATABASE_INVENTORY.md)).
- Unused exports listed by knip: `docs/DEAD_CODE.md` (partly removed; list dated 2026-08-14).
- Overlapping routes for "my progress": `/journey`, `/passport`, `/record`, `/today`.
