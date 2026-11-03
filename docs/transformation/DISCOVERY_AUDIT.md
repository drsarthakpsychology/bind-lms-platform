# VIBHA LMS: Discovery Audit (2026-11-03)

Branch `feature/vibha-lms-transformation` @ `6130335`. Method: I read the code directly
(file:line citations below), ran `npm audit --omit=dev --json`, ran `npx knip`, and read
GitHub Actions run history with `gh run list/view`. I did **not** run `next build`
(another agent is using the machine), and I made **no live Supabase queries** (the
Supabase MCP failed to connect with a proxy 403). Wherever a finding needs the live DB or a
deployed app to confirm, I mark it **not verified**.

This audit builds on the earlier audits and does not repeat them:
`docs/SECURITY_AUDIT.md` (2026-08-14), `AUDIT.md` (2026-08-11), `ADMIN_AUDIT.md` (2026-08-26),
`PERFORMANCE_FIXES.md` (2026-08-27), `BUGS.md` (shows 0 open), `FIXED.md`, `docs/DEAD_CODE.md`.
Those audits came before the November "platform rebuild / Learn / cohorts / doubts / master key"
work (PRs #37 to #41, merged 2026-11-02 and 2026-11-03), and **most of the new findings below
are in that new code**.

---

## 0. Corrections to earlier docs (stale claims)

| Doc claim | Reality now | Evidence |
|---|---|---|
| SECURITY_AUDIT: "Next 16.2.12 pinned" | `next@^16.4.3` installed 16.4.3 | `package.json:106` |
| SYSTEM_MAP §7: roster page reveals plaintext passwords | `/admin/roster` now only redirects. New accounts get a throwaway random password and a one-time setup link | `src/app/(dashboard)/admin/roster/page.tsx:8`, `src/lib/auth/roster.ts:10-12,254-260` |
| SYSTEM_MAP §5: `credential_invites.password` plaintext | Code no longer writes it. The column is still dropped only by `2026_11_drop_stored_passwords.sql`, which is **not** in the APPROVED list, so legacy plaintext rows may still exist (**not verified**, needs live DB) | `supabase/migrations_pending/2026_11_drop_stored_passwords.sql:7`, `scripts/apply-migrations.ts:74-86` |
| SECURITY_AUDIT: "3 high, postcss/sharp/nanoid" | Now 3 high + 8 moderate, a different set (see §3.12) | `npm audit` run today |
| SECURITY_AUDIT: "strong posture" | It does not cover the master password backdoor, Learn/XP, doubts, cohorts or page_visits, which were all added later | §3 |
| BUGS.md: "Open: 0" | See §3 and §4. Nightly backups have **never succeeded** | `gh run list --workflow backup.yml` |

---

## 1. Architecture summary

**Stack**: Next.js 16.4.3 App Router (Turbopack), React 19.2.4, Supabase (Postgres + Auth +
Storage), Cloudflare R2 for HLS video, Resend for email, Vercel `bom1` (`vercel.json`),
Sentry, PostHog, and an AI router with no-train lanes (`src/lib/ai/router.ts`).

**Routes**: 113 `page.tsx` and 76 `route.ts` under `src/app`.
- Public: `/`, `/waitlist`, `/login`, `/setup` (one-time password setup), `/policies/*`,
  `/verify/[certificateId]`, `.well-known/*`, `/openapi.json`, `/api/health`.
- Student `(dashboard)`: `/dashboard` (lectures), `/courses/*`, `/study` (Notes),
  `/games/*` (Learn: coach, lab, progress), `/practice/*` (about 20 tools plus `leaderboard`,
  `medicines`), `/doubts`, `/journey`, `/wall`, `/reflect`, `/passport`, `/notifications`.
- Admin `(dashboard)/admin/*`: 33 pages (people, cohorts, access, activity, emails, courses,
  flags, submissions, triage, psychopharm, ...).
- API: `api/practice/*` (AI tools), `api/media/*` (playback, stream, materials,
  submissions), `api/admin/*`, `api/internal/cron`, `api/emails/resend` (Svix webhook),
  `api/visit` (time tracking).

**Auth layers** (unchanged design, still sound in principle):
1. `src/proxy.ts:117-128` refreshes the Supabase token and bounces anonymous users away from
   `/dashboard`, `/admin`, `/courses`. It also sets `x-pathname` (`:72`).
2. `getSession()` (`src/lib/auth/session.ts:53-111`, React `cache`) checks, in order: no user,
   no profile, `blocked`, expired, then the single-session cookie mismatch.
3. Layouts: `(dashboard)/layout.tsx:20-66` handles verdict redirects, `lectures_only` scope
   (`:52-56`) and per-student `access_blocks` (`:61-65`). `admin/layout.tsx:14-22` checks the
   role.
4. `requireSession()` and `requireAdmin()` (`src/lib/auth/guards.ts:14-22`) protect server
   actions and API routes.
5. DB: RLS with `is_admin()`. `protect_profile_columns` trigger
   (`supabase/migrations_pending/rate_limit_anon_revoke.sql:10-28`).
6. **New**: a master password lets the admin sign in as any student
   (`src/lib/auth/master-login.ts`, `src/lib/auth/actions.ts:74`).

**Learn state**: `src/lib/learn/engine.ts` (575 lines, pure) defines `LearnState` (XP, streak,
SRS, coach mastery, history, study, lab). `src/lib/learn/store.ts` is a client singleton
that mirrors to `localStorage["vibha-learn-v1"]` (`:38`). When local and server copies
disagree, the copy with more XP wins (`:58`), and saves go to the server through a 600 ms
debounce (`:73-77`). `src/app/(dashboard)/study/actions.ts` loads and upserts **one JSON row
per student** in `learn_progress` (`:36-38`), with `xp` copied from the client state. The
leaderboards (`src/lib/learn/leaderboard.ts:128-160` and `src/lib/standing/board.ts:31-45`)
read every row with the service role.

**Media**: player calls `POST /api/media/playback`, which checks same-origin,
`requireSession`, rate limit, and `canAccessLesson`, then mints a 5-minute HMAC token. Then
`GET /api/media/stream/...` serves HLS from R2 with per-session AES-128 re-encryption
(SYSTEM_MAP §6, unchanged). Materials and submissions use short-lived signed URLs.

**Flags**: `feature_flags.status` is `off`, `live` or `unlocked`. `requireFeature()` is called in
**pages** (for example `study/page.tsx:12`, `games/progress/page.tsx:12`). There are also
per-student `access_blocks` (`src/lib/access/features.ts:10-26`) and `lessons.status`.

**Data model additions since SYSTEM_MAP**: `learn_progress`, `cohorts`, `cohort_members`,
`lesson_cohorts`, `lesson_grants`, `student_details`, `page_visits`, `standing_totals()`
(SECURITY DEFINER, service-role only, `2026_11_cohorts.sql:100-117`), `access_blocks`,
`doubts*`, `admin_settings`, `master_login_events` (`2026_11_access_doubts.sql`),
`account_setup_tokens`, `crm_contacts`, `email_inbound` (`2026_11_platform_rebuild.sql`).

---

## 2. Strengths to preserve

- **The authoritative session check is not in the proxy.** It fails closed, checks blocked
  before expiry, and enforces a single active session
  (`session.ts:70-108`, `proxy.ts:4-23`).
- **API routes are consistently guarded.** I checked all 76 `route.ts` files. Every
  non-public route calls `requireSession`, `requireAdmin` or `getSession`, or a
  bearer/Svix check (`api/internal/cron/route.ts:13-18`, `api/emails/resend/route.ts:11-24`).
  Most use zod and the Postgres rate limiter.
- **The rate limiter is durable and fails closed.** It is a Postgres atomic RPC that returns
  false on error (`src/lib/rate-limit.ts:25-42`).
- **Account setup is well designed.** It uses a 32-byte token stored only as a hash, is
  single use with an atomic spend, rolls back on failure, and cannot be consumed by a GET from
  an email scanner (`src/app/setup/actions.ts:17-63`, `roster.ts:126-160`).
- **The master password is hashed** with scrypt and compared with `timingSafeEqual`
  (`master-hash.ts:15-26`). Each use is logged (`master-login.ts:47`) and it is refused for
  admin accounts (`:26`). The weaknesses in the concept itself are in §3.
- **Profile privilege-escalation trigger.** It protects role, scope, status, is_test,
  cohort_ended_at and expires_at (`rate_limit_anon_revoke.sql:15-24`).
- **New SECURITY DEFINER functions are locked down** (`2026_11_cohorts.sql:116-117`).
- **Leaderboards strip identity before data leaves the server.** Only a first name, an
  initial and numbers are sent; no ids or emails (`games/progress/page.tsx:21-24`).
- **The media pipeline** uses token-bound, per-session AES, a same-origin gate, and resolves
  from recorded columns only. Heavy client libraries are already code-split: hls.js through
  `lazy-video-player.tsx:14`, pdfjs through `viewer.tsx:239`, LiveKit through dynamic import
  (PERFORMANCE_FIXES Part 5), and `@huggingface/transformers` is server-only
  (`src/lib/knowledge/embed-local.ts:27`).
- **The migration runner uses an explicit APPROVED list** and a ledger (`apply-migrations.ts:74-123`).
- **Strong test base**: 118 unit test files and 24 e2e specs, including a privacy regression
  suite.
- **The design system is in place** (`.claude/skills/vibha-design`), as are the honest-copy
  rules.

---

## 3. Security findings (prioritised)

Severity reflects impact and exploitability for an invitation-only cohort of about 64 students.

### CRITICAL

None in the application code itself. The backup failure (§4.1) is the Critical item, but it
is operational, not a security vulnerability.

### HIGH

**H1. Students can write their own Learn XP and history, so leaderboards and standing can be faked.**
- `learn_progress` RLS lets the owner INSERT and UPDATE the whole row, including `xp` and
  `state` (`supabase/migrations_pending/2026_11_learn.sql:19-24`). A student holding their
  own JWT can `PATCH /rest/v1/learn_progress?user_id=eq.<me>` with any values.
- The server action is no better. `saveLearnState` trusts the client state completely
  (`study/actions.ts:26-43`). `normalise()` spreads the raw object (`engine.ts:123-125`, `...r`)
  and never type-checks or bounds `xp`, `correct`, `answered` or `history`
  (`engine.ts:136`). Arbitrary extra keys are kept, limited only by a 200 KB cap (`actions.ts:35`).
- What reads this data: the weekly board ranks by `history` (`leaderboard.ts:142,159`). Standing
  points add `learnXp` (`src/lib/standing/score.ts:14-24`). These appear on `/dashboard`,
  `/practice/leaderboard`, `/journey`, and the admin student page
  (`admin/cohorts/student/[userId]/page.tsx:27`). Admin insights also read the same data
  (`src/lib/insights/load.ts:28`).
- The same pattern affects lecture progress. `pingProgress` takes client-supplied
  `watchedSeconds` and `durationSeconds`, sets `is_completed` from them, and never checks
  access to the lesson (`courses/.../lessons/[lessonId]/actions.ts:21-43`). The `progress`
  UPDATE policy has no `WITH CHECK` (`supabase/schema.sql:166-167`). `standing_totals()` sums
  both values into points (`2026_11_cohorts.sql:107-114`).
- **Remediation**: make XP server-authoritative.
  1. Change RLS to SELECT only for students. Revoke INSERT and UPDATE, and write through the
     service role inside a validated server action, or through a SECURITY DEFINER RPC.
  2. The server should record **events** (quiz answered, section finished) and compute XP
     itself, with per-day caps. At minimum, clamp: `xp` may only increase by at most N per
     save, `history` values must be ≤ the daily cap, and dates must be ≤ today.
  3. Use the `xp` column, not `state.xp`, for ranking, and set that column only on the server.
  4. Clamp `watched_seconds` to the lesson duration from `media_assets.duration_seconds`, and
     have the server compute `is_completed`.

**H2. The master password opens every student account from the public login form.**
- Any failed password login falls through to `tryMasterLogin` (`src/lib/auth/actions.ts:72-75`).
  One shared secret opens any student or alumni account (`master-login.ts:15-49`).
  There is no second factor, no restriction to an admin session, and no IP allow-list. The
  only master-specific throttle is `rateLimitFast` (`:16`), which is **in-memory per
  serverless instance**, so it does not hold across Vercel instances. The per-email Postgres
  limit (10 per minute, `actions.ts:28`) does not stop guessing across many emails.
- The profile lookup uses `.ilike("email", email.trim())` (`master-login.ts:24`). That means
  `%` and `_` act as wildcards. It is low impact (`maybeSingle` errors when more than one row
  matches), but the input should be escaped or matched with `.eq` on a lower-cased email.
- It also reuses the student's own session token (`:35-46`), so the student cannot tell an
  impersonation happened. Whether students are told about this access, and whether it is
  consented to, is a policy question.
- **Remediation**: remove the master fallback from the public login. Replace it with
  "impersonate" in the admin UI, gated by `requireAdmin()` and recent re-authentication,
  short-lived (for example 30 minutes), with a visible banner and an audit row. If it must
  stay: use the Postgres `rateLimit` on a global `master` key (for example 5 per hour), alert
  the admin by email on every use, and switch to an exact email match.

**H3. Admin pages rely on the layout alone for authorization, while 17 of them use the service role.**
- 31 of 33 admin pages do not call `requireAdmin` and rely only on `admin/layout.tsx:14-22`.
  Of those, 17 use `createAdminClient()`, which bypasses RLS: `admin/page.tsx`,
  `people/page.tsx`, `people/[id]/page.tsx`, `cohorts/*`, `enquiries`, `checkins`,
  `supervision`, `sim-review`, `tools`, `flags`, `infra`, `pulse`, `triage`, `modules`,
  `wall-reports` and `cards`. The full list comes from grepping `admin/**/page.tsx`.
- The Next.js 16 docs warn about exactly this:
  `node_modules/next/dist/docs/01-app/02-guides/authentication.md:1358`, "*be cautious when
  doing checks in Layouts as these don't re-render on navigation*". The RSC renderer starts
  from the segment where the router-state tree diverges, so the layout is not guaranteed to
  run for a page request. The same weakness applies to the `lectures_only` and
  `access_blocks` path checks in `(dashboard)/layout.tsx:52-65`, which read `x-pathname` and
  would go stale on soft navigation.
- **Not verified by a live exploit.** Test it on a preview deployment with a student cookie
  and a forged `Next-Router-State-Tree` header.
- **Remediation**: call `await requireAdminPage()` (a helper that redirects) at the top of
  every admin `page.tsx`, and add a lint or test that enforces it. For student pages, put
  scope and block checks in a `requireStudentPage(path)` helper called from each page, or
  from `requireFeature`.

### MEDIUM

**M1. Students can attach any storage path to a submission, then get a signed URL for it (IDOR).**
`submitWithFiles` stores client-supplied `filePaths[].path` without checking that it starts
with `${assignmentId}/${profile.id}/` (`lessons/[lessonId]/actions.ts:279-290`).
`/api/media/submissions/[...fileId]` then signs `file.storage_path` with the service role
after checking ownership of the *submission row*, not the *path*
(`api/media/submissions/[...fileId]/route.ts:53-72`). `audioPath` has the same gap
(`actions.ts:363,368`), and `getSubmissionAudioUrl` signs it (`:383-412`). To exploit it, a
student needs to know another student's path (`assignmentId/userId/timestamp-name`), so the
practical risk is low. It is still a broken object-level authorization pattern.
**Fix**: on the server, enforce `path.startsWith(\`${assignmentId}/${profile.id}/\`)` and
reject `..`.

**M2. Student API routes do not enforce scope, access blocks or feature flags.**
None of `src/app/api/**` calls `lectureOnlyAllowed`, `isLecturesOnly`, `requireFeature`,
`isFeatureEnabled` or `access_blocks` (grep returned no matches). A `lectures_only` or blocked
student, or any student using a tool that is switched `off`, can still call
`/api/practice/sim/turn`, `/api/knowledge/ask` and the other paid-AI endpoints directly.
`saveLearnState` likewise ignores the `learn` flag and the `learn` access block. **Fix**: add
`requireStudentApi({ feature })`, which returns 403, and use it in every `api/practice/*`
route and Learn action.

**M3. Learn's local copy is not tied to a user, so state crosses accounts and admin resets get undone.**
The `localStorage` key is the fixed string `"vibha-learn-v1"` (`store.ts:38`), and the copy
with more XP wins (`:58`). This causes two problems:
- On a shared device, or during admin impersonation through H2, student A's state is
  merged into student B's row and saved there.
- The admin "Reset Notes and Games progress" (`src/lib/access/features.ts:45`) is silently
  undone the next time the student opens Learn, because the larger local XP wins and is saved
  back.

**Fix**: key the storage by user id (`vibha-learn-v1:<uid>`). Prefer the server copy when it
has a `resetAt` marker or a newer `updated_at`. Clear the key on logout.

**M4. Server actions mostly skip schema validation.**
Only 1 of 24 `"use server"` files uses zod (`src/app/waitlist/actions.ts`). The others
hand-trim inputs (for example `doubts/actions.ts:11`), and some take arbitrary objects
(`saveLearnState`). By contrast, the API routes use zod consistently. **Fix**: add zod schemas
at every action boundary, starting with Learn, submissions and doubts.

**M5. Doubts actions skip visibility checks.**
- `replyToDoubt` inserts a reply into any `doubtId` with the service role. It does not check
  that the doubt is in the caller's cohort, is not a private `complaint`, and is not hidden
  (`doubts/actions.ts:46-56`).
- `reclassifyMine` accepts any `cohortId` without checking membership (`:83-93`).
- `markSolved` does not check that `replyId` belongs to `doubtId` (`:70-81`).
- `voteReply` does not validate the ids (`:59-68`).

**Fix**: load the doubt, then assert the caller can see it (owner, admin, or same cohort
and `kind = 'doubt'` and not hidden) before writing.

**M6. Inflatable "hours on VIBHA".**
`/api/visit` accepts up to 1800 s per POST with no rate limit and no de-duplication across
overlapping slices (`api/visit/route.ts:8-12,33-47`). Hours feed standing points
(`score.ts:21`) and admin activity. **Fix**: add a rate limit (for example 1 per 60 s per
user), clamp `seconds` to the wall-clock time since the last slice, and use a unique key on
`(user_id, entered_at)`.

**M7. Pending migrations hold security fixes, and the live state is unknown.**
The 31 files in `supabase/migrations_pending` that are **not** in the APPROVED list (§4.5)
include `rls_hardening.sql`, `rate_limit_anon_revoke.sql` (the profile-protection trigger
hardening), `submissions_insert_published_course.sql`, `2026_11_drop_stored_passwords.sql`
and `infra_metrics_revoke_public.sql`. `src/migrations_pending/rls_migrations_applied.sql`
(the earlier audit's only finding) is applied only by hand through `apply-pending.ts`. Which
of these are live is **not verified**, because there is no DB access this session. **Fix**:
query `_migrations_applied`, reconcile it with the files, and adopt the Supabase CLI
migrations directory (see §4.5).

### LOW

- **L1. Submissions are only checked against "published", not enrollment or cohort.**
  `assertCanSubmit` checks `course.is_published`, not enrollment or cohort
  (`actions.ts:109-130`), and the RLS insert policy has the same gap
  (`submissions_insert_published_course.sql:17-27`). A student can submit to a published
  course they are not enrolled in.
- **L2. Students can edit unprotected profile columns.** `email`, `name` and `block_reason`
  are not covered by `protect_profile_columns` (`rate_limit_anon_revoke.sql:17-22`), so a
  student can rewrite their own `profiles.email`. That field is used for admin display, the
  master lookup (`master-login.ts:24`) and leaderboard names (`leaderboard.ts:146`). Add
  `email` and `block_reason` to the trigger.
- **L3. Migration scripts disable TLS verification.** `rejectUnauthorized: false` appears in
  `scripts/apply-migrations.ts:60` and `scripts/apply-pending.ts:51`. A man-in-the-middle on
  the operator's network could capture the DB password. Use Supabase's CA bundle.
- **L4. The CSP still allows `'unsafe-inline'` for `script-src`** (`next.config.ts:65,96`). The
  fix is nonce-based CSP. The current `dangerouslySetInnerHTML` uses only static SVG or JSON-LD
  (`components/home/*.tsx`, `app/page.tsx:36`).
- **L5. The admin Supabase client module has no `server-only` guard.**
  `src/lib/supabase/server.ts:1` exports `createAdminClient` without `import "server-only"`.
  The service key is not `NEXT_PUBLIC_`, so it cannot leak, but a client import would fail
  late instead of at build.
- **L6. Debris at the repo root.** `r2diag.mjs` hard-codes a developer's local path
  (`r2diag.mjs:5`, `/Users/kavyabothra/...`), and `scripts/tmp-token-test.ts` is a scratch
  file. Neither contains secrets; both should be deleted.
- **L7. Turnstile is still dormant.** It needs `TURNSTILE_SECRET_KEY`
  (`src/lib/auth/actions.ts:40-62`), as noted in SECURITY_AUDIT. Whether it is set in
  production is **not verified**.

### 3.12 Dependencies (`npm audit --omit=dev --json`, ran successfully today)

11 total: **3 high**, 8 moderate, 0 critical.

| Severity | Package | Path | Fix |
|---|---|---|---|
| high | `fast-uri` 3.1.5 (SSRF / host confusion) | `@hookform/resolvers > ajv` | `npm audit fix` (non-breaking). `@hookform/resolvers` is unused per knip, so removing it is better |
| high | `js-yaml` 3.15.1 (CPU DoS on merge keys) | `gray-matter` (policies MD, trusted repo content) | fix available. Low real risk because the input is trusted |
| high | `brace-expansion` 5.0.9 (ReDoS) | `@livekit/agents > throws-transformer > glob > minimatch` | fix available. Server-side build/tooling path |
| moderate ×5 | `@sentry/nextjs` 10.78.0 → bundler-plugins → glob/minimatch | build-time | npm suggests downgrading to 10.76.1. Wait for an upstream patch instead |
| moderate ×3 | `@livekit/agents`, `throws-transformer`, `fast-copy` | | |

None are KEV-listed as far as I know (**not verified** against the live KEV feed). Do the
non-breaking `npm audit fix` and remove the unused dependencies (§6).

### 3.13 Secrets

- Nothing secret is committed. Only `.env.example` is tracked (`git ls-files`).
- **The GitHub Actions secrets are empty or invalid.** `R2_*`, `SUPABASE_DB_URL` and
  `SITE_URL` are empty, and `RESEND_API_KEY` returns 401 "API key is invalid" (see §4.1).
- The server code reads secrets only through `process.env`. That matches SECURITY_AUDIT and I
  did not re-derive it.

---

## 4. Reliability and operations

### 4.1 CRITICAL: no database backup has ever succeeded, and the failure alerts do not send

- `gh run list --workflow backup.yml -L 100` shows **100 runs and 0 successes**, going back to
  2026-08-02. The latest, run 41189205190 on 2026-10-31, failed with
  `pg_dump: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432"`. The
  `SUPABASE_DB_URL` secret is empty, so the host parsed from it is blank
  (`.github/workflows/backup.yml:22,33-41`).
- The failure alert runs `curl` to Resend, which returns `{"message":"API key is invalid"}`
  (`backup.yml:89`). It also sends from `backups@plms.local`, a domain that cannot be verified.
  **So nobody was told.**
- The weekly `verify-backup.yml` also fails on every run (2026-10-18, 10-25, 11-01).
- `uptime.yml` fails on every run because `R2_*` is empty (`Missing R2_ACCOUNT_ID ...`) and
  `CODE: 000000`, which means `SITE_URL` is empty too. **There is no uptime alerting.**
- Apart from Supabase's own daily backups (plan-dependent, **not verified**), the only
  recovery path is the vendor's.
- **Even after the fix, the backup has gaps:**
  - The `.dump` is uploaded unencrypted (`backup.yml:41-45`). It contains `auth.users` and
    whatever plaintext remains in `credential_invites.password`. Encrypt it with `age` or GPG
    before upload.
  - Student **submission files** in Supabase Storage are not backed up. RESTORE_RUNBOOK §4
    covers videos only.
- **Fix today**:
  1. Set the GitHub secrets: `SUPABASE_DB_URL`, `R2_*`, `R2_BACKUP_BUCKET`, a valid
     `RESEND_API_KEY`, `ALERT_EMAIL` and `SITE_URL`.
  2. Change the alert sender to the verified domain.
  3. Run `workflow_dispatch` once and confirm the dump lands in R2.
  4. Run `verify-backup` once and confirm the restore works.

The other crons are healthy: `db-keepalive`, `reminders`, `infra-check` and `ci` all show
5 out of 5 recent successes.

### 4.2 Error handling and Sentry

- There are 252 silent or swallowed `catch` sites in `src`
  (`catch {`, `.catch(() => null|[]|{})`). Examples:
  - `saveLearnState` returns `{ok:false}` with no log (`study/actions.ts:40-42`).
  - `store.ts:74-76` swallows save failures.
  - `loadBoard().catch(() => [])` (`games/progress/page.tsx:17`).
  - A failing `learn_progress` table produces no signal anywhere.
- **Server-side capture is incomplete.** `src/instrumentation.ts` initialises Sentry for
  `nodejs` only and **does not export `onRequestError`**, so errors in Server Components,
  route handlers and server actions are not reported unless they reach an `error.tsx`
  boundary. Only 3 files call `Sentry.captureException`. `sentry.server.config.ts` and
  `sentry.edge.config.ts` are not imported by `instrumentation.ts`.
- **Client-side capture is likely broken (not verified at runtime).**
  `sentry.client.config.ts` is not loaded under Turbopack. The Sentry SDK itself prints:
  "When using Turbopack `sentry.client.config.ts` will no longer work"
  (`node_modules/@sentry/nextjs/build/cjs/config/webpack.js:215`). Turbopack injection
  targets `**/instrumentation-client.*`, and **that file does not exist**.
- **Fix**: add `instrumentation-client.ts`; add
  `export const onRequestError = Sentry.captureRequestError`; and log, rather than swallow,
  failures in Learn and progress writes.

### 4.3 Cron

GitHub Actions call `/api/internal/cron?task=…` with a bearer token, fail closed
(`api/internal/cron/route.ts:13-18`). Tasks: keepalive, prune-logs, infra-snapshot,
alumni-transition, release-scheduled, send-reminders. These are working (see §4.1).

### 4.4 Email

There is one Resend path (`src/lib/auth/roster.ts`). The setup email carries a link, never a
password (`roster.ts:167-202`). Resend webhooks are Svix-verified. The GitHub Actions
`RESEND_API_KEY` is invalid. Whether the production Vercel key is valid is **not verified**.

### 4.5 Migrations process

- `scripts/apply-migrations.ts:74-86` APPROVES only 11 files from `supabase/migrations_pending`:
  profiles_access_scope, credential_invites, credential_invites_password,
  profiles_status_blocked, calibration_auto_signals, videos_bucket, flags_lesson_status,
  perf_indexes, ai_circuit_latency, videos_unlimited_size and profiles_mobile_number.
- **Not in the APPROVED list (31 of 42 in `supabase/migrations_pending`):**
  - The November work: `2026_11_access_doubts`, `2026_11_all_full_access`,
    `2026_11_cohorts`, `2026_11_drop_stored_passwords`, `2026_11_lab_flag`,
    `2026_11_learn`, `2026_11_mail_clear` and `2026_11_platform_rebuild`.
  - Earlier files: `ai_usage_prompt_version`, `ai_usage_quality_signals`,
    `assignment_multi_submission_types`, `cards_sort_order`, `certificates`,
    `checkins_idempotent`, `email_sends`, `infra_metrics_revoke_public`,
    `materials_assignments_submissions`, `media_assets`, `media_location_status`,
    `module_access_idempotent`, `policy_acceptance`, `psychopharm_kms`,
    `psychopharm_kms_fix`, `psychopharm_tools`, `rate_limit_anon_revoke`,
    `rate_limits_table`, `rls_hardening`, `student_last_activity`, `submissions_bucket`,
    `submissions_insert_published_course` and `test_account_flag`.
- **`src/migrations_pending` (29 files) has no APPROVED list at all.** Files there are applied
  by name through `scripts/apply-pending.ts`, which has the same ledger. These include
  `rate_limit_atomic.sql`, which the limiter depends on, `rls_migrations_applied.sql` and
  `harden_security_definer_functions.sql`.
- Many of these were evidently applied by hand in the SQL editor ("Run in the Supabase SQL
  Editor", for example `submissions_insert_published_course.sql:12`). As a result the
  ledger, the APPROVED list and the live schema have drifted apart. A fresh project rebuilt
  from the repo would be missing tables or policies.
- **Fix**: move to `supabase/migrations/<timestamp>_*.sql` with the Supabase CLI
  (`supabase db push`). Generate a baseline with `supabase db dump` from production, and add
  a CI check that runs `supabase db diff` against a shadow DB.

---

## 5. Performance

I did not run a build (by instruction), so there are no bundle numbers. Findings come from
static inspection.

- **P1. Leaderboard and standing load every student's full Learn JSON on hot pages.**
  `loadStanding()` selects `user_id, xp, state` for up to 5000 rows plus
  `cohort_members` up to 20000 (`src/lib/standing/board.ts:35-37`). It is only
  `cache()`d per request (`:31`). It runs on **`/dashboard`** (`StandingCard`,
  `dashboard/page.tsx:16`), `/practice`, `/practice/leaderboard` and `/journey`.
  `loadBoard()` does the same on `/games/progress` (`leaderboard.ts:131`). Each `state` can be
  up to 200 KB (`study/actions.ts:35`), so this is O(N × state size) per page view.
  **Fix**: store the derived numbers (`xp`, `week_xp`, `streak`, `mastery`) as columns
  computed on save (or in a materialized view), select only those, and wrap the board in
  `unstable_cache` or `'use cache'` with a 60 s revalidate.
- **P2. Two separate ranking engines.** `src/lib/learn/leaderboard.ts` ranks by weekly XP.
  `src/lib/standing/board.ts` combines XP, lecture minutes and hours. They duplicate work
  and show students two different rankings. Consolidate them (see also §6).
- **P3. Heavy client libraries.**
  - `pdfjs-dist`, `hls.js` and `livekit-client` are already lazy-loaded (§2).
  - `@huggingface/transformers` is server-only.
  - `motion/react` is imported statically in 23 files, including shell-level ones:
    `components/navigation/bottom-tab-bar.tsx`, `components/ui/progress.tsx` and
    `components/ui/segmented-control.tsx`. That puts motion (roughly 30 to 40 KB gz, **not
    measured**) on every dashboard route. Consider `LazyMotion` with `m.` components, or
    CSS transitions for the tab bar and progress bar.
- **P4. N+1 patterns.** None found in server pages (`.map(async` gives 0 hits in
  `src/app`/`src/lib`). There is one sequential loop of awaited inserts per uploaded file in
  `submitWithFiles` (`actions.ts:279-292`), which should be a single batched insert, and one
  in `roster.ts:342`. Both are low volume.
- **P5. Fixed caps instead of pagination.** `.limit(5000)` / `.limit(10000)` appear in
  `src/lib/crm/people.ts:65-70`, `cohorts/admin-data.ts:59-81`,
  `people-actions.ts:19` and `analytics/activity.ts:155`. These are fine at about 64 students.
  Revisit at around 500 (PERFORMANCE_FIXES Part 3 already deferred this).
- **P6. Learn saves.** Each save upserts the whole JSON state, debounced at 600 ms
  (`store.ts:73-77`). With events-based XP (H1) this becomes small event inserts.

---

## 6. UX, admin inconsistencies and tech debt

- **Two leaderboards with different rules**: `/games/progress` (weekly XP) and
  `/practice/leaderboard` (standing points). Students will see different ranks.
- **Docs have drifted.** SYSTEM_MAP §3 and §7 describe `/admin/roster` password reveal and
  `/admin/tools` bulk import. These are now `/admin/emails?tab=credentials` and
  `/admin/people` / `/admin/cohorts`. SYSTEM_MAP says Next `^16.3.1`. Neither SYSTEM_MAP nor
  SECURITY_AUDIT mentions cohorts, access blocks, doubts, Learn, the master key or
  page_visits. **Update SYSTEM_MAP §3, §4, §5 and §7.**
- **Admin "reset Learn" does not stick** (M3). This is a support issue that will look like a
  bug.
- **Flags are enforced in some places and not others.** Pages call `requireFeature`, but API
  routes and actions do not (M2). Per-student blocks are enforced only in the layout (H3).
- **knip (run today; parallel agents may shift these numbers):** 68 unused files, 108 unused
  exports, 44 unused types, and the unused dependencies `@hookform/resolvers`, `qrcode` and
  `react-hook-form`, plus dev dependencies `@tailwindcss/forms`, `@types/adm-zip` and
  `@types/qrcode`. `livekit-agent/agent.ts` imports `dotenv`, which is not listed.
  Notable dead UI:
  - `components/landing/*` (landing-page, marquee, parallax, kinetic-headline,
    scroll-scale, reveal)
  - `practice/decode/*` drills
  - `practice/mse/mse-trainer.tsx`
  - `admin/calibration/agreement-dashboard.tsx` and `calibration-list.tsx`. Compare
    ADMIN_AUDIT, which says these are kept as optional tools.
  - `components/mobile/*`
  - `lib/lab/scoring2.ts`
  - `lib/reminders.ts`
  - shadcn `dialog`, `tabs`, `tooltip`, `popover`, `accordion` and `form`

  `docs/DEAD_CODE.md` (2026-08-14) is stale. Re-baseline it, and confirm each file has no
  dynamic import before deleting.
- **Root clutter**: `BRIEF_*`, `NIGHT_LOG`, `QUEUE`, `RESUME`, `MORNING_REPORT`, the
  `*.sh` night-run scripts, `r2diag.mjs` and `tsconfig.tsbuildinfo`. Move the docs to
  `docs/archive/` and delete the scripts.
- **No zod at action boundaries** (M4). There are also 252 silent catches (§4.2).
- **`engine.ts` is 575 lines** that mix types, normalisation, XP rules, SRS and levels. Split
  it into `state.ts`, `xp.ts` and `srs.ts` when doing H1.

---

## 7. Recommended next fixes

| # | Fix | Severity | Effort | Impact | Evidence |
|---|---|---|---|---|---|
| 1 | Set the GitHub secrets (`SUPABASE_DB_URL`, `R2_*`, `RESEND_API_KEY`, `SITE_URL`, `ALERT_EMAIL`). Fix the alert sender. Manually run `backup` and `verify-backup` | Critical (ops) | S | Very high: there is currently no backup and no uptime alert | §4.1 |
| 2 | Encrypt backup dumps and add a backup of the Supabase `submissions` bucket | High | S to M | High | `backup.yml:41-45` |
| 3 | Make Learn XP and lecture progress server-authoritative: SELECT-only RLS for students, server-computed XP, clamping, `watched_seconds` ≤ duration | High | M | High: leaderboard and standing integrity | H1 |
| 4 | Remove master-password login from the public form, or gate it with a global DB rate limit, an alert on every use and exact email match. Long term, move impersonation into the admin UI | High | S (gate) / M (impersonate UI) | High | H2 |
| 5 | Add `requireAdmin()` to every admin `page.tsx`, add a test enforcing it, and move scope and block checks out of the layout | High | S | High | H3 |
| 6 | Validate submission `filePaths` and `audioPath` prefixes on the server | Medium | S | Medium | M1 |
| 7 | Add `requireStudentApi({feature})` for scope, blocks and flags in `api/practice/*` and Learn actions | Medium | M | Medium (also AI cost) | M2 |
| 8 | Key Learn `localStorage` by user id, clear it on logout, and honour server resets | Medium | S | Medium | M3 |
| 9 | Reconcile migrations with the live DB, adopt the Supabase CLI migrations directory, apply `2026_11_drop_stored_passwords` once verified | Medium | M | High (rebuildability) | §4.5, M7 |
| 10 | Add `instrumentation-client.ts` and `onRequestError`; log Learn and progress write failures | Medium | S | Medium | §4.2 |
| 11 | Add visibility checks to doubts actions and rate-limit plus clamp `/api/visit` | Medium | S | Medium | M5, M6 |
| 12 | Store denormalised board columns plus cached board (no full JSON scans on `/dashboard`) | Medium | M | Medium (perf at scale) | P1 |
| 13 | Add `email` and `block_reason` to `protect_profile_columns`; add an enrollment check to submissions RLS | Low | S | Low to medium | L1, L2 |
| 14 | Run `npm audit fix` (non-breaking), remove unused dependencies, add `server-only` to `supabase/server.ts`, use a TLS CA in the migration scripts | Low | S | Low | §3.12, L3, L5 |
| 15 | Unify the two leaderboards; refresh SYSTEM_MAP, DEAD_CODE and SECURITY_AUDIT; tidy the repo root | Low | S to M | Medium (clarity) | §6 |

### Not verified in this audit (needs follow-up)
- The live DB state: which pending migrations are applied, whether `credential_invites.password`
  still holds data, and whether `learn_progress` exists in production.
- Whether H3 (layout-skip on a forged router-state tree) can actually be exploited on
  16.4.3. It needs a preview-deployment test.
- Whether the Vercel production `RESEND_API_KEY`, the Turnstile keys and the Sentry DSN are
  set and valid.
- Bundle sizes, because no build was run.
- KEV/EPSS status for the npm advisories.
