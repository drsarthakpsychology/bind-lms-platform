# Authentication and authorisation

Login is Supabase Auth (email and password). On top of it the app adds its own checks in `src/lib/auth`. Checked against commit `e4cb5ef0` on 2026-11-14.

## Accounts are made by admins

There is no sign-up page.

1. An admin adds people: `/admin/students` (one at a time or CSV import, `src/app/(dashboard)/admin/students/bulk-import.ts`, parser `src/lib/auth/roster.ts`) or `/admin/cohorts` (`addPeopleToCohort`, `addPeopleFromPaste`).
2. The server creates the `auth.users` row. Trigger `handle_new_user` creates the `profiles` row.
3. `issueSetupLink` (`src/lib/auth/roster.ts`) stores a hashed one-time token in `account_setup_tokens` and emails the link through Resend. Sends are logged in `email_sends` and `credential_invites`.
4. The student opens `/setup?token=...`. `completeSetup` (`src/app/setup/actions.ts`) checks the token (hash, not used, not revoked, not expired), spends it, sets the password (at least 12 characters, `src/lib/auth/password-policy.ts`) and sends them to `/login`.

Stored passwords were removed in `2026_11_drop_stored_passwords.sql`. Admins cannot see student passwords.

## Login

`login` in `src/lib/auth/actions.ts` (Server Action used by `/login`):

1. Rate limits: 10 tries a minute per email (Postgres, shared by all servers) and 60 a minute per IP (per server).
2. Cloudflare Turnstile check, only when `TURNSTILE_SECRET_KEY` is set (not set in production today).
3. `supabase.auth.signInWithPassword`.
4. If that fails, `tryMasterLogin` (`src/lib/auth/master-login.ts`): the super admin's master password opens any **student** account, never an admin account. Every use is written to `master_login_events`. The hash lives in `admin_settings` (scrypt, `src/lib/auth/master-hash.ts`). Set at `/admin/tools`.
5. Expiry check: `profiles.expires_at` in the past blocks a student (alumni never expire).
6. One device at a time: a new random token goes into `profiles.active_session_token` and into the `plms_session` cookie (http-only, 60 days). Any other browser holding the old token is signed out on its next request.

## Sessions

- Supabase keeps its own auth cookies (`@supabase/ssr`). `src/proxy.ts` refreshes them on every request.
- `getSession()` (`src/lib/auth/session.ts`) is the real check, run by the dashboard layout, every guard and every student API:

| Result | Meaning | What the user sees |
|---|---|---|
| `ok` | Signed in, active, not expired, cookie token matches | The app |
| `blocked` | `profiles.status = 'blocked'` | `/paused`. Not signed out, so unblocking works on the next request |
| `expired` | `expires_at` passed (not alumni) | `/expired`, signed out |
| `session_replaced` | Signed in on another device | `/login`, signed out |
| `unauthenticated` | No Supabase user | `/login` |

## Roles

`profiles.role`:

| Role | Who | Can |
|---|---|---|
| `admin` | Super admin. Only one allowed (unique index `one_super_admin`) | Everything, including all writes, admins, master password |
| `view_admin` | Read-only admin | Read every admin page. Every write is rejected (`requireSuperAdmin`, `is_super_admin()` in policies) |
| `student` | Enrolled learner | Student app, within scope and cohort access |
| `alumni` | Former student (set by the alumni cron when a cohort ends) | Permanent read-only access to their own record. No expiry |

Admins are managed at `/admin/management` (`src/app/(dashboard)/admin/management/actions.ts`). Content editors and reviewers for the medicines pages are a separate list in `app_roles` (checked by `app_role()`).

Helpers (`src/lib/auth/guards.ts`):

- `requireSession()`: any signed-in, ok account.
- `requireAdmin()`: `admin` or `view_admin`. For reads only.
- `requireSuperAdmin()`: `admin`. For every write.
- `requireStudentApi()` (`src/lib/auth/api-guard.ts`): for student API routes. Adds the cross-site check, scope, access blocks and feature flags.

## Scope and access blocks

- `profiles.scope = 'lectures_only'`: the account may reach only `/dashboard`, `/courses/*`, `/doubts/*`, `/journey`, `/notifications` (`lectureOnlyAllowed` in `src/lib/auth/scope.ts`). The layout redirects other paths. Game actions check `gamesAllowed`. A single-lesson variant uses `profiles.scope_lesson_id`.
- `access_blocks`: the admin can switch off single features for one student (People, Access). Read by `loadMyBlocks` (`src/lib/access/blocks.ts`), applied by the layout and `requireStudentApi`.
- Cohort access to lectures: `src/lib/cohorts/access.ts` and `rules.ts`. A lecture is visible when it is shared with one of the student's cohorts (`lesson_cohorts`) or granted to them (`lesson_grants`), and the course is published.

## Other auth surfaces

- Certificate check `/verify/[certificateId]`: public, read-only.
- Public forms `/f/[slug]`: no login, rate limited, stored through the service-role client.
- Admin "view as student": cookie only, does not change the session.
- Test account flag on `profiles` (`test_account_flag.sql`) and `ALLOWED_TEST_RECIPIENT`: preview deployments may email only allowed test addresses (`previewBlocks` in `src/lib/auth/roster.ts`).

## Known limits (from `docs/security/SECURITY_AUDIT_2026_11.md`)

- Supabase auth cookies are readable by page scripts. CSP still has `'unsafe-inline'` for scripts.
- A student can edit their own `name`, `email` and `active_session_token` columns. Everything that matters is guarded by triggers.
- `GAMES_SECRET` is not set, so game tokens are signed with the service-role key as a fallback (`src/lib/games/token.ts`). Set `GAMES_SECRET` to separate them.
