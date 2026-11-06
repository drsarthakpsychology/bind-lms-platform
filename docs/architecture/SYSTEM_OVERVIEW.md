# System Overview
> Verified against `main` @ `b2a9698`. Entry point: [MASTER_ARCHITECTURE](../MASTER_ARCHITECTURE.md).

## Product
Invitation-only clinical-psychology training programme (brand constants in `src/lib/brand.ts`). Cohorts of students get recorded lectures, notes/games, and "Practice" tools (simulated patients, MSE trainer, OSCE, formulation, etc.). Admins run content, people, mail and review.

## Actors
| Actor | How created | Capabilities (VERIFIED: `src/lib/auth/session.ts`, `guards.ts`, `scope.ts`) |
|---|---|---|
| Admin | seeded / role `admin` | Everything under `/admin/*`; sees all lectures |
| Student | roster import (admin) | `scope` = `full` or `lectures_only`; `status` = `active`/`blocked`; per-feature blocks (`access_blocks`) |
| Alumni | automatic transition (cron `alumni-transition`) | Permanent, no expiry (`isExpired` returns false for alumni) |
| Anonymous | – | Landing, waitlist, policies, `/verify/[id]`, `/free/*` |
| Agents/bots | – | `/.well-known/*`, `/openapi.json`, `/auth.md`, markdown landing via `Accept` header (`src/proxy.ts`) |

## Surface map (route groups in `src/app`)
- Public: `/`, `/login`, `/set-password`, `/waitlist`, `/policies/*`, `/verify/[certificateId]`, `/free/*` (calm, tests, help), `/paused`, `/expired`, `/sitemap.ts`.
- App `(dashboard)`: `dashboard, courses, study, games, practice, doubts, journey, passport, today, wall, reflect, record, notifications, settings, tools, admin/*`.
- API: 77 route handlers under `src/app/api` + `.well-known`, `openapi.json`, `auth.md`, `go/home` ([API_INVENTORY](../inventory/API_INVENTORY.md)).

## Maturity note
Large, rapidly evolving codebase (77 commits on `main`, Aug–Nov 2026, many merged PRs). Treat feature flags (`feature_flags` table, 21 keys in `src/lib/flags.ts`) as the source of truth for what students actually see — their production values are `UNVERIFIED`.
