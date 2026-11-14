# Scalability: from 30 to 300 students

Can the current design carry 300 students without the architecture itself becoming the bottleneck? Short answer: **yes for the code and the database design; no for the current plans and one delivery path.** The limits that bite first are plan limits (Supabase Free, Vercel bandwidth, Resend) and the way video bytes flow through Vercel. None needs a rewrite.

Evidence was gathered on 2026-11-14 with read-only SQL (`pg_stat_statements`, table sizes, `pg_indexes`, foreign keys), the Supabase performance advisor, the Vercel project settings and deployments, the R2 bucket list, and the code at commit `e4cb5ef0`. Nothing was changed in any live service.

## Where we are today

| Measure | Value |
|---|---|
| Accounts | 126 students, 2 admins |
| Active students last 7 days | 44 (4,885 page-time records) |
| Peak distinct students in one hour (all time) | 14 |
| Lecture watch time recorded since 2026-08-27 | about 304 hours by 66 students |
| Lectures | 17, about 29 hours, all HLS on R2 |
| Database | 210 MB of 500 MB (Free plan). `corpus_chunks` is 147 MB of it |
| Database connections | 23 in use of 60 |
| Emails, last 30 days | 525. Busiest day 272 (206 sent, 66 failed, 2026-10-28) |
| AI calls, last 30 days | 0 (every AI feature flag is off) |

At 300 students expect about 7 times today's load, with peaks of perhaps 50 to 100 students at once around a live session or a deadline.

## Ranked bottlenecks

Each item: what, evidence, smallest fix, and what kind of fix it is.

Fix types: **Config** (a setting, no code), **SQL** (a migration file, no app code), **Code** (owner decides), **Plan** (paid upgrade, cost flagged), **Fine** (no action needed for 300).

### 1. Video bytes flow through Vercel functions (Code or Plan, cost)

- Evidence: `src/app/api/media/stream/[...lessonId]/route.ts` fetches every playlist, key and 6 second chunk from R2 and re-encrypts it inside a Vercel function. Ladder bitrates in `scripts/publish-lecture.ts`: 1080p 5,000k, 720p 2,800k, 480p 1,400k, 240p 600k, so one viewing hour is about 0.7 to 2.3 GB and about 600 function calls.
- Today's rate (about 0.4 viewing hours per student per week) at 300 students: about 520 hours a month, roughly 0.7 to 1.2 TB of Vercel bandwidth and about 300,000 function calls.
- A busy cohort (3 hours per student per week) at 300 students: about 3,900 hours a month, roughly 5 to 9 TB and 2.3 million calls. R2 egress is free; Vercel bandwidth and function time are not.
- The Vercel plan was not visible to this audit. Hobby includes about 100 GB of bandwidth a month and is meant for non-commercial use, so it will not carry this. Pro includes about 1 TB a month and bills more by the GB. **Check the plan and current Vercel prices before Cohort 2 grows.**
- Smallest fixes, in order:
  1. Config: cap the top rung for phones in hls.js (`capLevelToPlayerSize: true`) and encode new lectures without 1080p (talking head and slides look fine at 720p). Cuts bytes by roughly 40 percent. Needs a small player code change.
  2. Code: move chunk delivery to a Cloudflare Worker in front of R2 that does the same token check and re-encryption (`SESSION_SECRET` shared). Bandwidth then stays inside Cloudflare (no egress fee) and Vercel only mints tokens. Workers paid plan is about 5 USD a month for 10 million requests. Medium work; the logic in `src/lib/media/crypto.ts` and `stream-token.ts` ports directly.
  3. Code and policy: store chunks already encrypted (standard HLS AES-128, key in `media_assets.encryption_key`, which already exists) and serve them from R2 with short signed URLs; keep only the key endpoint in the app. Cheapest by far, but the key becomes per lesson, not per viewer. Owner decision on the protection model.

### 2. All cron endpoints are failing: `CRON_SECRET` is not set in Vercel (Config)

- Evidence: Vercel production variables listed on 2026-11-14 contain no `CRON_SECRET`. Every cron route answers 401 when it is unset (`src/app/api/cron/*/route.ts`, `src/app/api/internal/cron/route.ts`).
- Effect: weekly leagues do not close, standing notes and monthly certificates are not sent, doubt follow-ups are not sent, scheduled modules are not released, alumni are not moved, `/admin/infra` gets no history, and the database keepalive does not reach the database. This is a correctness problem now and grows with every student.
- Fix: add `CRON_SECRET` to Vercel production with the same value as the GitHub secret, redeploy, then call `/api/internal/cron?task=keepalive` once with the header to confirm 200.

### 3. Supabase Free plan limits (Plan, cost about 25 USD a month)

- Evidence: organisation plan `free`. 500 MB database (210 MB used), 1 GB storage, 5 GB egress a month, 60 connections, shared CPU, no Supabase-managed backups, pauses when idle.
- Growth: `page_visits` is the fastest growing table: about 320 bytes a row, about 110 rows per active student per week. At 300 active students that is about 33,000 rows a week, roughly 550 MB a year. On its own it would fill the Free database in under a year. `learn_events`, `progress` and `answer_history` add more.
- Egress: every page and API read goes out of Supabase. At 300 students 5 GB a month is likely to run out.
- Smallest fixes:
  1. SQL or Code: keep `page_visits` raw rows for 90 days and roll older rows into a daily summary table. Removes the main growth driver. (Owner decision: it deletes raw rows after summarising.)
  2. Plan: move to Supabase Pro before about 200 active students. 8 GB database, 250 GB egress, daily backups, no pausing, optional point-in-time recovery, bigger compute on demand.
  3. Fine: `corpus_chunks` (147 MB) only serves the knowledge tutor, which is off. Leave it.

### 4. Email volume and the Resend plan (Plan, cost about 20 USD a month)

- Evidence: `RESEND_DAILY_LIMIT` defaults to 100 (the free plan's daily cap). 206 emails were sent on 2026-10-28 and 66 failed, so either the plan is already paid or the cap was hit. Pacing is 4 a second (`createPacer(250)` in `src/lib/auth/roster.ts`).
- At 300 students: standing notes twice a week (about 2,400 a month) plus follow-ups, nudges and campaigns, well above the free 3,000 a month.
- Fix: Resend Pro (50,000 a month) once crons are running, and set `RESEND_DAILY_LIMIT` to the plan's real number so bulk sends pace correctly. The standing job sends 300 notes in about 75 seconds, inside its 300 second limit.

### 5. Missing foreign key indexes (SQL, ready)

- Evidence: the advisor lists 113 foreign keys with no covering index. All tables are small today (largest touched under 1,200 rows), so this costs nothing yet. At 300 students the per-student tables (doubts, replies, quiz attempts, sim turns, wall, voice) grow about 10 times, and deleting a student checks every one of these keys with a full scan.
- Fix: `supabase/migrations_pending/2026_11_14_scaling_indexes.sql`, 56 indexes on read paths, idempotent, all column names checked against the live schema. Not applied. Run it in the SQL editor any time.
- The hot tables are already well indexed: `progress` (primary key user and lesson), `page_visits` (user, time), `answer_history`, `prep_answers`, `notifications`, `xp_ledger`, `course_enrollments`, `cohort_members`, `lesson_cohorts`, `lesson_grants`.

### 6. AI free tiers when practice features are switched on (Plan, cost)

- Evidence: 0 AI calls in 30 days; every AI feature is flag off. `docs/CAPACITY_MODEL.md` already found Groq's free daily request cap to be the limit at about 45 daily users of the Consulting Room. Production has Groq, SambaNova (paid, needs a card), OpenRouter and OpenCode keys.
- At 300 students with the Consulting Room on, free tiers will run out daily; the router fails over and then returns an honest "not available".
- Fix: before switching `consulting_room` or `knowledge_tutor` on for a full cohort, budget a paid tier (Groq paid or another no-train provider). Keep `AI_ENABLED` as the kill switch. No code change needed.

### 7. Per-request session checks (Fine; optional Code)

- Evidence: `getSession()` calls `supabase.auth.getUser()` (a network call to Supabase Auth) and reads `profiles` on every page and API call. The dashboard layout adds about 4 more small queries (blocks, details, unread count, flags). `pg_stat_statements`: the `profiles` session select ran 122,159 times at 0.12 ms average. Video chunks skip it through the per-token cache.
- At 300 students this is well within limits: the database work is tiny, and Supabase talks over HTTP (PostgREST), so serverless functions do not use up the 60 Postgres connections.
- Optional code change: verify the JWT locally (`auth.getClaims()`) instead of `getUser()` to save one network round trip per request. Only worth it if page speed needs it.

### 8. Row level security policy cost (Fine; optional SQL)

- Evidence: 123 policies call `auth.uid()` once per row (`auth_rls_initplan`), and 78 tables have overlapping permissive policies. The cost scales with rows scanned per query, which stays in the hundreds per student.
- Fine at 300. If a page gets slow, rewrite the policies on that table with `(select auth.uid())`. SQL only, no app code.

### 9. Rate limit table and logs never pruned (Code, small)

- Evidence: `rate_limits` has 969 rows and nothing deletes old windows. `ai_usage_log` pruning exists (`?task=prune-logs`) but no workflow calls it. The rate limit function ran 13,566 times at 6 ms average.
- Fix: delete `rate_limits` rows older than a day inside the existing infra-snapshot task, and add `prune-logs` to `infra-check.yml`. Both are tiny. Needs `CRON_SECRET` (item 2) to run at all.

### 10. Per-instance memory caches and limits (Fine)

- `rateLimitFast`, the feature flag cache (30 s) and the stream verdict cache are per Vercel instance. More instances under load mean looser per-IP limits and up to 30 s of flag lag. Acceptable for an abuse brake and an admin toggle.

### 11. Live duel polling (Fine)

- `/games/duel/live` is polled about once a second by each player. 20 duels at once is about 40 small requests a second. Fine. Past that, move to Supabase Realtime.

### 12. Frontend bundle (Fine; measure)

- Not measured here (a full build is not allowed on this machine). By reading the code: the 23 MB of study and exam content in `src/content` is imported by server components, not by client components; three.js loads only on the study scenes that use it; PostHog loads lazily; `optimizePackageImports` is on for `lucide-react`, `motion` and `radix-ui`; static assets are cached for a year.
- Watch Vercel Speed Insights (already on) for real-user numbers on phones.

### 13. Backups and recovery at scale (Fine; Plan helps)

- Nightly `pg_dump` to R2 and a weekly restore test already exist. A 210 MB database dumps in minutes. On Supabase Pro add daily managed backups as a second copy.

## Summary table

| # | Bottleneck | Fix type | When |
|---|---|---|---|
| 1 | Video through Vercel functions | Code (Worker or pre-encrypted chunks) or Plan | Before about 100 active viewers a week; check the Vercel plan now |
| 2 | `CRON_SECRET` missing, crons fail | Config | Now |
| 3 | Supabase Free limits, `page_visits` growth | Plan (about 25 USD a month) plus SQL retention | Before about 200 active students |
| 4 | Resend volume | Plan (about 20 USD a month) | When crons run and the cohort passes about 100 |
| 5 | Missing FK indexes | SQL (file ready) | Any time |
| 6 | AI free tiers | Plan | Before switching AI practice on for a cohort |
| 7 | Session check per request | Fine (optional code) | Only if pages feel slow |
| 8 | RLS per-row `auth.uid()` | Fine (optional SQL) | Only if a query gets slow |
| 9 | Unpruned rate limits and AI logs | Code (small) | With item 2 |
| 10 to 13 | Caches, duel polling, bundle, backups | Fine | Watch |

Prices are approximate and change; confirm on each provider's pricing page before deciding. No paid service has been added.

## What is fine as is

- One Next.js app on Vercel, Supabase for data and auth, R2 for files: the right size for 300 and well beyond. No microservices needed.
- Data access through PostgREST (HTTP), so connections are not a serverless problem.
- The save outbox makes writes safe against deploys and bad networks.
- The database schema and indexes on hot tables.
- Region choice: app (`bom1`) and database (ap-south-1) are both in Mumbai, near the students.
