# Backend

There is no separate backend service. The backend is the server side of the Next.js app on Vercel (Node.js runtime, region `bom1`). Checked against commit `e4cb5ef0` on 2026-11-14.

## Three kinds of server code

| Kind | Count | Used for | Auth helper |
|---|---|---|---|
| Server Components | most pages | Reading data for a page | `getSession()` in the layout, then the user's Supabase client (row level security applies) |
| Server Actions (`"use server"`) | 54 files | Forms and buttons inside the app: admin writes, games, study, prep, doubts | `requireSession()`, `requireAdmin()` (read), `requireSuperAdmin()` (write) from `src/lib/auth/guards.ts` |
| Route handlers (`route.ts`) | 85 files | Things that need a stable URL: video, saves, uploads from the browser, crons, webhooks, PDFs and CSV downloads | `requireStudentApi()` (`src/lib/auth/api-guard.ts`), `requireSession()`, cron bearer token, webhook signature |

Every API route and Server Action is listed in `docs/API.md`.

## Supabase clients

`src/lib/supabase/server.ts`:

- `createClient()`: the signed-in user's client. Reads the auth cookie. Row level security applies. Use this by default.
- `createAdminClient()`: the service-role client. Skips row level security. Server only (`import "server-only"`). Use only after a role check, and only for writes the user may not make directly.

`src/lib/supabase/client.ts` is the browser client (anon key). It is used for a few direct reads and the login form.

## Student API gate

`requireStudentApi(gates)` in `src/lib/auth/api-guard.ts` does, in order:

1. Rejects cross-site calls (`Sec-Fetch-Site`).
2. Runs `getSession()`. Not ok: 401. Blocked: 403.
3. Checks scope (lectures-only accounts cannot call practice APIs), admin access blocks and feature flags (`src/lib/auth/api-gate.ts`, `decideApiAccess`).

## The save outbox (`POST /api/save`)

File: `src/app/api/save/route.ts`. Client: `src/lib/save/client.ts`, `src/lib/save/outbox.ts`.

- The browser writes every save to `localStorage` first, then sends batches (up to 25 items, 256 KB).
- Kinds: `progress` (lecture watch time), `complete` (lecture done), `learn` (study state), `history` (answer history), `events` (learning events).
- Each item answers `ok`, `retry` or `drop`. The request answers 401 when signed out (the browser keeps the items), 403 when paused, 409 when the items belong to another account (owner tag from `src/lib/save/owner.ts`), 429 above 240 requests a minute per user.
- Items are applied one at a time in order. The route calls the same functions the old Server Actions used (`pingProgress`, `markLessonComplete`, `saveLearnState`, `recordMyAnswers`, `storeLearnEvents`).
- Why a route and not a Server Action: Server Action ids change on every deploy. Tabs opened before a deploy lost saves ("Failed to find Server Action").

## Rate limiting

Two limiters:

| Limiter | File | Store | Used for |
|---|---|---|---|
| `rateLimit`, `rateLimitResult`, `rateLimitWrite` | `src/lib/rate-limit.ts` | Postgres table `rate_limits` through the `rate_limit_incr` function (atomic, one minute window by default) | Login (10 a minute per email), setup links, waitlist, public forms, AI routes, admin bulk email |
| `rateLimitFast` | `src/lib/rate-limit-fast.ts` | Memory of one server instance | Hot paths: video chunks, `/api/save` (240 a minute), login per IP (60 a minute) |

The memory limiter is per instance, so under load each Vercel instance has its own count. It is an abuse brake, not a hard limit.

The `rate_limits` table had 969 rows on 2026-11-14 and nothing deletes old windows. It is small. See the scalability doc.

## Feature flags

`src/lib/flags.ts`. Table `feature_flags`, three states per key: `off` (hidden), `live` (shown as coming soon), `unlocked` (open). Cached in memory for 30 seconds per instance. Admins change them at `/admin/flags` (`POST /api/admin/flags`). Pages call `requireFeature(key)`; APIs pass `{ flag }` to `requireStudentApi`.

Some switches are code constants, not table rows: `EXAM_TRACKS_ENABLED` and `PREP_ONBOARDING_ENABLED` in `src/lib/prep/catalog.ts` (both `false`).

Live flag values are in `docs/FEATURES_STATUS.md`.

## Scheduled jobs

| Job | Caller and schedule (UTC) | Endpoint | Does |
|---|---|---|---|
| Standing | Vercel Cron, Mon and Thu 13:30 | `GET /api/cron/standing` | Closes last week's leagues on Monday, saves points, sends each student a standing note, awards milestones |
| Monthly | Vercel Cron, 1st of month 00:30 | `GET /api/cron/monthly` | Monthly merit certificates (top 3 per cohort) and champion titles |
| Doubt follow-up | Vercel Cron, daily 03:30 | `GET /api/cron/doubt-followup` | In-app notice for new doubt answers, one email after 48 hours unopened |
| Keepalive | GitHub Actions `db-keepalive.yml`, Mon 03:22 | `GET /api/internal/cron?task=keepalive` | Stops the Free plan database from pausing |
| Infra snapshot | `infra-check.yml`, daily 00:12 | `?task=infra-snapshot` | Writes `infra_snapshots` for `/admin/infra` and prunes old snapshots (`?task=prune-logs` prunes `ai_usage_log`) |
| Alumni | `alumni-transition.yml`, daily 05:07 | `?task=alumni-transition` | Students of ended cohorts become alumni |
| Reminders and releases | `reminders.yml`, daily 16:37 | `?task=send-reminders`, `?task=release-scheduled` | Reminders returns `not_configured` (not built). Release publishes scheduled modules |
| Nightly backup | `backup.yml`, daily 03:17 | none (runs `pg_dump`) | Database dump to R2 `plms-backups`, prunes old dumps, emails on failure |
| Backup check | `verify-backup.yml`, Sun 04:17 | none | Restores the latest dump into a scratch Postgres and checks it |
| Uptime | `uptime.yml`, 4 times a day | `GET /api/health` | Emails after two failures in a row |
| CI | `ci.yml`, every push and pull request | none | `tsc`, lint, `vitest`, `next build` |

All cron endpoints require `Authorization: Bearer $CRON_SECRET` and answer 401 when `CRON_SECRET` is unset.

**Known issue:** `CRON_SECRET` is not set in the Vercel project (checked 2026-11-14), so all endpoint crons above answer 401 and do nothing. The GitHub secret may exist, but the app side cannot match it. Fix: set `CRON_SECRET` in Vercel production (same value as the GitHub secret).

There is no job queue. Long work runs inside the request (bulk email is chunked and paced in `src/lib/email/pace.ts`).

## Caching

- `getSession()` is wrapped in React `cache()`: one database read per request even if called many times.
- Feature flags: 30 seconds in memory.
- Video: the stream verdict (enrolment check) is cached per token in memory (`src/lib/media/stream-cache.ts`), so chunk requests skip the database. Playlists and chunks are sent with private cache headers.
- AI answers: `ai_response_cache` table (`src/lib/ai/cache.ts`).
- Static assets: `/_next/static/*` cached for one year (`next.config.ts`).
- No Redis, no CDN cache for signed-in pages.

## Security headers

Set for every route in `next.config.ts`: Content-Security-Policy (no `unsafe-eval` in production), HSTS, `X-Frame-Options: SAMEORIGIN`, `nosniff`, `Referrer-Policy`, COOP, CORP, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. Note the microphone rule blocks the voice features in the browser (see `docs/security/SECURITY_AUDIT_2026_11.md`).

## Error reporting

`src/instrumentation.ts`, `src/instrumentation-client.ts`, `sentry.*.config.ts`. Sentry starts only when `SENTRY_DSN` or `NEXT_PUBLIC_SENTRY_DSN` is set. Neither is set in Vercel today, so errors go to Vercel logs only.
