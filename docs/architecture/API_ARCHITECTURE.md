> **SUPERSEDED on 2026-11-14.** Use docs/API.md instead. This file is kept for history and may be out of date. Index of current docs: docs/README.md.

# API Architecture
> Verified against `main` @ `b2a9698`. Per-route table: [API_INVENTORY](../inventory/API_INVENTORY.md).

## Two kinds of server entry points
1. **Server Actions** (`"use server"`, ~22 `*actions*.ts` files + `src/lib/auth/actions.ts`): most admin and student mutations. Each must re-check auth (`requireAdmin()`/`requireSession()`), because actions are directly invokable endpoints.
2. **Route handlers** (`src/app/**/route.ts`, 77): streaming/AI/media/webhook/cron/public-agent endpoints.

## Route families
| Prefix | Purpose | Guard |
|---|---|---|
| `/api/media/*` | playback token, HLS proxy (`stream/[...lessonId]`), materials, submissions | session + same-origin + HMAC token + rate limit |
| `/api/practice/*` | all Practice tools: sim, mse, osce, sct, formulation, wall, journal, rounds, voice, passport PDF | user session; ownership checks in code |
| `/api/admin/*` | calibration, cards, flags, idioms, modules, nudge, sim-corrections, wall-reports, learning CSV | admin |
| `/api/knowledge/*` | RAG search/ask/concepts | session |
| `/api/psychopharm/*` | bands, document history/publish/rollback, review, search | session / admin for edits |
| `/api/emails/*` | `resend` (webhook), `seed` | webhook signature (Svix HMAC, 5-min window) / admin |
| `/api/internal/cron` | scheduled tasks | `Authorization: Bearer CRON_SECRET`, fail-closed |
| `/api/health`, `/api/sim/health` | health | public/limited |
| `/api/livekit/token` | voice session token | session |
| `/api/visit` | presence/time-on-site beacon | session |
| `/api/cohort-calendar` | calendar generation | admin |
| `/.well-known/*`, `/openapi.json`, `/auth.md`, `/go/home` | agent discovery & redirect | public |

## Conventions
JSON in/out, zod validation on inputs, rate limiting via `src/lib/rate-limit.ts` (durable, Postgres `rate_limits`, **fails closed**) and `rate-limit-fast.ts` (in-process, per-IP), same-origin gate for media (`src/lib/media/same-origin.ts`). `/openapi.json` is a **static** document and may lag the real route set (`UNVERIFIED` completeness — see TECHNICAL_DEBT).
