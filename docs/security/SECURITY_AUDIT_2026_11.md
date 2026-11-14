# Security audit, November 2026

Branch `agent/sec`, 14 Nov 2026. Method: the `auditing-app-security` skill. Code reading of every route handler (84) and server action file (53), read-only catalog queries and the Supabase security advisors on the live project, a secret scan of the working tree and all 1,019 commits, `npm audit --omit=dev`, and unit tests for every fix. The migration was checked by running it twice on a throwaway local Postgres with a stub schema and replaying the attacks as a student role. Nothing was written to the live database. No secret values appear in this file.

## For the owner (things only you can do)

1. **Deploy this branch first, then run the database fix.** Open the Supabase SQL editor and paste `supabase/migrations_pending/2026_11_14_security.sql`. Do it in that order: the code now saves lecture progress, Learn XP and judgment-arena answers on the server. If the database fix goes in before the code, those stop saving until the code is live.
2. **Supabase, Authentication, Passwords: turn on "leaked password protection".** It stops people choosing passwords that are already on public breach lists. The advisor flags it as off.
3. **If you ever pressed "Reset password" on a real student** (not the test account), that student's password became the test password written in the repo. Send that student a new login link. From now on the reset only works on test accounts.
4. **Vercel: add the two Turnstile keys** (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`). The human check on the login page is built but switched off until the keys exist.
5. **Vercel: check that preview links are protected** (Project, Settings, Deployment Protection, "Vercel Authentication" on previews). Previews point at the live database.
6. **No keys need rotating.** No secret key was found in the code, the docs or anywhere in the git history.

## Summary

| # | Finding | Severity | Status |
|---|---|---|---|
| 1 | Any signed-in account could edit its own Learn XP and league history through the database API | High (CVSS 4.0 7.1) | Fixed (migration) |
| 2 | Certificate counted module test scores the browser reported | High (7.1) | Fixed (code) |
| 3 | Students could sign off their own supervision hours | High (6.9) | Fixed (migration) |
| 4 | View Admin could upload, replace or delete videos, materials and submissions | Medium (6.0) | Fixed (migration) |
| 5 | Unlimited game XP by replaying a solved run under new run ids | Medium (5.3) | Fixed (code) |
| 6 | Judgment arena stored the browser's score and published student-written items; Forge created cases from browser text | Medium (5.3) | Fixed (code + migration) |
| 7 | `device_setup_codes` had row level security off (anon read/write) | Medium (5.5) | Fixed (migration) |
| 8 | Lecture progress clamp skippable through the database API | Medium (4.6) | Fixed (code + migration) |
| 9 | Students could write their own score, feedback and late flag on a pending submission | Medium (4.6) | Fixed (migration) |
| 10 | Stream URL copied to another browser fetched video chunks without a session for 5 minutes | Medium (4.8) | Fixed (code) |
| 11 | "Reset password" set the published test password on any account | Medium (6.3) | Fixed (code) |
| 12 | Anyone (anon key) could list every certificate (student name, user id, file path) | Medium (5.3) | Fixed (migration) |
| 13 | Anyone (anon key) could list every course enrolment | Low (3.7) | Fixed (migration) |
| 14 | Formulation wall: base table readable by anyone with author ids, undoing anonymity | Medium (4.3) | Fixed (migration) |
| 15 | Students could call `rate_limit_incr` (lock another person out of login) and the corpus search functions (whole licensed library, past feature/scope gates) | Medium (4.3) | Fixed (migration) |
| 16 | Every signed-in account could read every lecture's media row including the key columns | Low (3.1) | Fixed (migration) |
| 17 | Students could rewrite title, body and link of their own notifications | Low (2.0) | Fixed (migration) |
| 18 | Small items: `/\host` links in rich text, hidden doubt reopenable by the asker, setup-link guessing not throttled, open redirect target in Complete and Continue, lectures-only accounts could play games through actions, no cross-site guard on student APIs, email header hygiene, anon insert into `ai_usage_log`, trigger functions and `is_super_admin` exposed as RPC, mutable `search_path` | Low | Fixed |
| 19 | Three high npm advisories (fast-uri, js-yaml, brace-expansion) | Medium | Fixed (lockfile) |
| R | Residual items, not fixed here (see the end) | Varies | Open |

CVSS here is CVSS 4.0 base, scored for this app (small cohort, student PII and a paid credential). EPSS/KEV apply only to the npm advisories; none of them is in CISA KEV.

## Findings

### 1. Learn XP and league points writable by the student (High)
- **CWE:** CWE-639 / CWE-602 (client-side enforcement of server-side security)
- **Affected:** RLS policies `learn_progress_own_insert`, `learn_progress_own_update` (live DB); consumers `src/lib/leagues/data.ts:98`, `src/lib/leagues/xp.ts` (balance), shop.
- **Weakness:** `saveLearnState` clamps every save and writes with the service role, but the policies still let the student PATCH their own row with their JWT, which skips the clamp.
- **Evidence:** `pg_policies`: `learn_progress_own_update UPDATE (auth.uid() = user_id)`. League points read `learn_progress.state.history` and the shop spends `state.xp`.
- **Reproduction:** signed in, `PATCH /rest/v1/learn_progress?user_id=eq.<me>` with `{"state":{"xp":999999,"history":{"2026-11-14":99999}}}` and the anon key plus the student's access token from the `sb-` cookie.
- **Fix:** migration section 7 drops both policies (same as the older optional file). **Commit:** 2129c76.

### 2. Certificate based on browser-reported module test scores (High)
- **CWE:** CWE-602
- **Affected:** `src/components/study/interactive.tsx:182` (pre-fix) recorded the score in the browser; `src/app/(dashboard)/study/actions.ts:68` (pre-fix) kept whatever best score the browser sent; `src/lib/achievements/certificate.ts` reads those scores for eligibility.
- **Reproduction:** call the `saveLearnState` action with `study.tests[<module>] = {best: 10, total: 10}` for every module; the certificate page shows the student as eligible.
- **Fix:** new server action `submitModuleTest` grades the picks against the server copy of the module and stores the best result (`src/lib/study/test-grade.ts`). `saveLearnState` now ignores browser-sent results for certificate modules (`keepServerTests`). The module test sends its picks to the action (`TestRunner` `grade` prop, passed from the section page). Results stored before this change are kept. **Tests:** `src/lib/study/test-grade.test.ts`. **Commit:** 284be54.

### 3. Self sign-off of supervision hours (High)
- **CWE:** CWE-285
- **Affected:** policy `supervision_update_own` (any column, any time); no trigger on `supervision_entries`.
- **Reproduction:** `PATCH /rest/v1/supervision_entries?id=eq.<mine>` `{"signoff_status":"approved","hours":40}`.
- **Fix:** migration section 10 adds trigger `protect_supervision_signoff`: for students, new entries are always `pending`, the only status change allowed is pending to requested, and an entry cannot change once requested or signed. Verified on the local stub: "approved" is refused, editing after the request is refused. **Commit:** 2129c76.

### 4. View Admin could write to storage buckets (Medium)
- **CWE:** CWE-269
- **Affected:** storage policies `materials_bucket_admin_all`, `submissions_bucket_admin_all`, `videos_admin_all`, `videos_bucket_admin_all` used `is_admin()` (admin or view_admin) for ALL commands.
- **Fix:** migration section 13: one read policy for any admin, one write policy for the Super Admin only. **Commit:** 2129c76.

### 5. Game XP farming (Medium)
- **CWE:** CWE-799 (improper control of interaction frequency)
- **Affected:** `src/lib/games-sims/server/results.ts:55` (pre-fix). Runs are re-graded on the server, but the idempotency ref includes a run id or seed chosen by the browser (`escape/actions.ts:155`, `rx/actions.ts:55`, `ward/actions.ts:47`, `comorbid/actions.ts:56`).
- **Reproduction:** call `finishEscapePractice` in a loop with the right answers and a new `run` each time; each call pays up to 40 XP into `xp_ledger`, which counts for the league.
- **Fix:** `payXp` stops at 400 XP per game per IST day (`src/lib/games-sims/xp-cap.ts`). **Tests:** `xp-cap.test.ts` (1,000 replays earn exactly the ceiling). **Commit:** e85d098.

### 6. Judgment arena and Forge trusted the browser (Medium)
- **CWE:** CWE-602, CWE-20
- **Affected:** `src/app/api/practice/sct/attempt/route.ts:78` stored `scored` from the body; lines 56-64 created `sct_items` rows with browser text, `status: "published", approved: true`. `src/app/api/practice/formulation/attempt/route.ts:71` created published cases titled by the browser.
- **Impact:** any student could publish clinical "items" other students see, and set their own judgment scores.
- **Fix:** only seed items are accepted; text and panel come from the server copy; the score is computed on the server; writes use the service role, and the migration removes student writes to `sct_attempts`. The Forge only creates cases it has, under its own title. **Tests:** `sct/attempt/route.test.ts`, `formulation/attempt/route.test.ts` (new cases for unknown items, server score, server client). **Commits:** ac0a675, 2129c76.

### 7. `device_setup_codes` without RLS (Medium)
- **Evidence:** advisor `rls_disabled_in_public` (ERROR); `has_table_privilege('anon', ...)` true for SELECT/INSERT/UPDATE/DELETE. The table is empty and no app code uses it.
- **Fix:** migration section 1 enables RLS and revokes anon/authenticated. **Commit:** 2129c76.

### 8. Lecture progress clamp skippable (Medium)
- **Affected:** `src/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/actions.ts:84` and `:147` (pre-fix) wrote `progress` with the student's client; policies `progress_own_upsert`, `progress_own_update`. `standing_totals` and completion read `watched_seconds` and `is_completed`.
- **Fix:** both writes use the service role after the clamp; `completeAndAdvance` now checks the lesson is visible and only redirects to a same-site path (`src/lib/safe-path.ts`, it used to `redirect(redirectTo)` with any value, line 151). Migration section 8 drops the student write policies. **Tests:** `src/lib/safe-path.test.ts`. **Commits:** 544a6a4, 2129c76.

### 9. Student-written grading fields on submissions (Medium)
- **Affected:** policy `submissions_update_own_while_pending` (any column while pending) and the insert policy (any column).
- **Fix:** migration section 11, trigger `protect_submission_grading`: for students the database sets `score`, `feedback`, `returned_at` (kept or null), `submitted_at` (now) and `is_late` (from the due date). Verified on the local stub. **Commit:** 2129c76.

### 10. Stream token replay across browsers (Medium)
- **Affected:** `src/app/api/media/stream/[...lessonId]/route.ts:62-68` (pre-fix). For chunk requests the route skipped the session check when this server had a cached verdict for (user, lesson). The token is in the URL, so a copied URL worked from any browser, signed out or as another user, for up to 5 minutes.
- **What was confirmed:** playlists and the `__key__` endpoint always run the full session check and require `profile.id === token.uid`, so another user cannot get the key. Token signature, expiry and lesson binding are checked on every request.
- **Fix:** the chunk fast path now also requires the `plms_session` cookie that passed the full check (`warmChunkAllowed`), and paths after the lesson id must be plain media files inside the lecture folder (`safeStreamRest`, no `..`). **Tests:** `src/lib/media/stream-guard.test.ts`. **Commit:** 4be84d5.

### 11. Published test password on any account (Medium)
- **Affected:** `src/app/(dashboard)/admin/students/actions.ts:134` set the test password that is written in `docs/TEST_ACCOUNT.md` on whatever account was chosen; the menu offered it on every student.
- **Fix:** refused unless the account is a marked test student (`src/lib/auth/test-account.ts`); the menu shows it only on test rows. **Tests:** `test-account.test.ts`. **Commit:** 7fe34ad.

### 12-17. Over-broad reads and writes (Low to Medium)
- **12 certificates:** `certificates_public_verify` (anon, `true`). Dropped; owners can read their own. No page reads `certificates` with the public key.
- **13 course_enrollments:** `enrollments_select_all` (`true`, role public). Replaced by own-rows only; every student read in the code filters by the student's own id.
- **14 formulation wall:** `formulation_wall_select_visible` (`true`, role public) exposed `author_id`. Now signed-in only, and `author_id` is not readable; the anonymous view keeps working.
- **15 RPC:** `rate_limit_incr`, `match_corpus_chunks`, `search_corpus_keyword` were executable by `authenticated`; the app calls them only with the service role. Revoked. Trigger functions and `is_super_admin` were executable by `anon` (advisor WARN); revoked.
- **16 media_assets:** `media_assets_authenticated_read` (`true`) with every column, including `encryption_key` (currently empty in all 17 rows). Column grants now leave out the key columns.
- **17 notifications:** update limited to `read_at` and `opened_at`.
- **Commit:** 2129c76.

### 18. Small items (Low)
- `sanitizeRich` allowed `href="/\host"`, which browsers open as another site (`src/lib/email/rich-html.ts:35`). Fixed, test added. No XSS path was found: every tag is rebuilt without attributes and all text is escaped.
- A student could reopen a doubt the admin hid by calling `markSolved` (`src/app/(dashboard)/doubts/actions.ts:102-106`). Fixed with `canMarkSolved`, test added.
- Setup-link submissions had no throttle (`src/app/setup/actions.ts:17`). Now 20 per minute per network.
- Lectures-only accounts could play games and earn XP through the actions and the duel route (`currentPlayer`, `currentUser`). Now refused (`gamesAllowed`), test added.
- Student API routes now refuse requests made by another site's page (`Sec-Fetch-Site: cross-site`), on top of SameSite=Lax cookies (`isCrossSiteRequest`, test added). Server actions already check the origin.
- Every email send folds the subject to one line and needs exactly one plain recipient (`src/lib/email/headers.ts`, test added). Sends go through Resend's JSON API, so this is defence in depth.
- `ai_usage_log` accepted inserts from anyone; `sync_lesson_video_path_on_hls` had a mutable `search_path`. Both fixed in the migration.
- **Commits:** 8fa09ab, e85d098, 5516997, 2129c76.

### 19. Dependencies
`npm audit --omit=dev` before: 11 (3 high, 8 moderate). The highs were fixed with targeted overrides in the lockfile only: fast-uri 3.1.9 (host confusion / SSRF in URI parsing), js-yaml 3.15.2 under gray-matter, brace-expansion 5.0.13, plus fast-copy 4.3.1 under rtc-node. After: 8 moderate, all `glob`/`minimatch` inside `@livekit/agents` and the Sentry build plugins; fixing them needs major upgrades (the automatic fix moved `@livekit/rtc-node` across a major, so it was not taken). None is in KEV. **Commit:** cdb074f. The shared `node_modules` was not touched; Vercel installs from the lockfile.

## Checked and clean

- **Access control:** every admin write action and route calls `requireSuperAdmin`; reads use `requireAdmin`. View Admin cannot write through the app (only through the storage policies, now fixed). Student routes use `requireStudentApi` (session, block, scope, per-student blocks, feature flags). Doubts, notes, journal shares, matches (duel), sim sessions, submissions and notifications all check ownership on the server before using the service role. Forms (`/f/[slug]`) and the waitlist have rate limits and a honeypot.
- **Sessions:** `plms_session` is httpOnly, Secure in production, SameSite=Lax, and rotated on every login (no session fixation). Logout clears the database token and signs out of Supabase (all refresh tokens). Blocked, expired and replaced sessions are rejected on every request, not only at login. Next 16 is not affected by CVE-2025-29927, and authorisation does not rely on the proxy.
- **Master password:** scrypt hash, constant-time compare, works only on student and alumni accounts, rate limited in Postgres per email, per network and globally, and every use is logged.
- **Video:** the token is HMAC-signed with `SESSION_SECRET` (no fallback to any public value), bound to user, lesson and course, 5 minutes; no storage URL reaches the browser; the key endpoint needs the full session of the same viewer.
- **Secrets:** no service key, token or password in the tree or in any of the 1,019 commits (pattern scan, values never printed; the one hit is a local development placeholder in a doc). All `NEXT_PUBLIC_*` variables are public by design. `.env*` files are ignored.
- **Headers:** CSP with `object-src 'none'`, `frame-ancestors 'self'`, `base-uri 'self'`, `form-action 'self'`; HSTS with preload; X-Frame-Options SAMEORIGIN; nosniff; COOP and CORP same-origin.
- **SSRF:** every server `fetch` goes to a fixed or environment-configured host; none takes a URL from a user.
- **Uploads:** students upload only through signed upload URLs for their own `assignment/user/` folder, with an extension allow-list and a 50 MB bucket limit; the server checks the path prefix before recording or signing a file.

## Residual items (not fixed here)

- **Answers are in the browser for several games and study checks.** Escape room (answers and unopened hints), Ward week, Rx detective, Comorbid and the MSE lab bundle their content, and Study MCQs ship with `answer`. The server re-grades every run before paying XP, and now caps XP per day, so this only helps a student who reads the code. A full fix moves each game to the server-dealt pattern Blitz, Sort, the duel and the daily case already use. Large, game by game.
- **Practice tools are self-scored.** OSCE, MSE, Formulation and quiz attempts, and the competency events behind the Skills Passport, store scores the browser computed. Treat passport evidence from these tools as self-practice, or move scoring to the server per tool.
- **The video key is stable per viewer and lesson.** It changed from per-token to per (viewer, lesson) to fix mid-lecture failures. A viewer who extracts it could decrypt their own chunks later, but only with a fresh token and their own browser session. Without DRM a viewer can always screen-record, so this was accepted.
- **Supabase auth cookies are readable by page scripts** (how `@supabase/ssr` works) and the CSP keeps `'unsafe-inline'` for scripts. An XSS would expose the access token. No XSS path was found; a nonce-based CSP would remove `'unsafe-inline'`.
- **Students can edit some of their own profile fields** (`name`, `email` in `profiles`, `active_session_token`). Role, scope, status, expiry, test flag, rewards and roll number are protected by triggers. Login writes the session token with the student's client, so that column was left open.
- **Small race on module tests:** if a Learn save and a test grade land within the same few milliseconds, the save can overwrite the graded result. The student then retakes the test; no false pass is possible.
- **Moderate npm advisories** listed above, pending a planned `@livekit/agents` and Sentry upgrade.
- **Extensions `vector` and `pg_trgm` live in `public`** (advisor WARN). Moving them is disruptive and low value.
- **Not security, noticed on the way:** `Permissions-Policy: microphone=()` blocks the voice features in the browser; the CSP `connect-src` does not list the PostHog host; the `submissions` bucket allows only audio MIME types while attachments allow documents.
