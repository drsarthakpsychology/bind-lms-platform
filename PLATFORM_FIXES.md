# PLATFORM FIXES — 2026-08-26 (roster / email / blocked pass)

All work verified against source and the real files, not a prior summary. On the
worktree branch `worktree-night-rights-roster-video` (off
`feat/mobile-design-system`); nothing pushed to `main`.

---

## Part 0 — the empty-name parsing bug: root cause + fix

The real roster is `/Users/kavyabothra/Downloads/roster.csv` — two columns
`name,email`, 64 rows, verified clean (0 empty names, 0 empty emails, 0
malformed, 0 duplicates).

The earlier "50 of 64 empty-name" report was false. Root cause: the source
spreadsheet `COPY SHEET (1).xlsx` has a **column shift** — for rows 2–15 the
name is in column B ("Full Name"), but for rows 16–65 the name is in column A
(the "Timestamp" position) stored as a *formatted cell* (the shared-string
index in `<v>` with no `t="s"` type marker — e.g. shared[102] "Khushi Nirav
Master" sits in `r=A32`). A positional reader read a fixed column, so it
correctly read 14 and reported the other 50 as empty. The names were always
there, one column over.

**Fix:** `parseRosterCsv` is now header-driven, not positional — a
case-insensitive `headerField(row, aliases)` finds name ("name"/"full name")
and email ("email"/"email address") wherever they live and ignores every other
column. Also added `bom: true` (a UTF-8 BOM would otherwise turn `name` into
`﻿name` and drop every name). **Four regression tests** pin it (extra columns
ignored, case-insensitive header, BOM strip, name in a non-first column), in
`src/lib/auth/roster.test.ts`.

Final dry-run of `scripts/roster/roster.csv`: **rows 64, created 64,
duplicates 0, invalid 0, empty names 0.**

---

## Part 1 — import and send are two separate steps

- **Import** creates the auth account (role `student`, `profiles.scope =
  'lectures_only'`), and records a `credential_invites` row in **Pending**.
  It never emails.
- **Review** — `/admin/roster` lists the batch: name, email, status
  (Pending / Sent / Failed), created date.
- **Send** — explicit "Send all pending" / "Retry failed" / "Send selected"
  (checkbox), each row flips to Sent/Failed with the reason. Retries are
  per-row. The set-your-password link is minted **fresh at send time** (never
  stored), so it can't expire between import and send.

New table `credential_invites` (additive migration, admin-only RLS). Nav entry
"Roster & emails" under System.

## Part 2 — test email

`/admin/roster` has a "Send test email" control: it sends the **real**
credential template (same `sendResendEmail` path as the real send — not a
separate mock) to any address, marked `[TEST]` in the subject, and shows the
actual Resend API result (id on success, error message on failure). A bad key
or bad template surfaces here first. Zero risk of reaching a student.

## Part 3 — BLOCKED status (unconditional every-request override)

No password-viewing was built — auth hashes at rest, so that screen can't and
shouldn't exist. What Kavya needs is a hard cut-off.

- Added `profiles.status` (`active` | `blocked`) + `profiles.block_reason`
  (additive migration).
- `getSession` returns a `blocked` result **before** the expiry/token check —
  a blocked account is rejected even with a correct password and a valid
  session token. It does **not** sign out, so unblocking restores access on the
  very next request with no re-login.
- The dashboard layout redirects `blocked` → `/paused` (plain, non-alarming:
  "Your access is currently paused. Contact the programme to resolve this.").
  `requireSession` returns null for blocked, so every server action and API
  route rejects it too. The profile is re-read per request (`React.cache()` is
  request-scoped only) — **no TTL cache to serve a stale status**.
- Admin: `setAccountStatus` action + a Block/Unblock control in the student
  actions sheet, with an internal-only note. The student never sees the reason.
- **Test:** `isBlocked` unit test (`src/lib/auth/guards.test.ts`) asserts the
  override is on `status` alone, independent of credentials. The full
  live-session-rejection test (log in → reach a route → block → same session
  rejected on its very next request → unblock → restored) needs a browser + a
  real session; it's the human E2E step in NEEDS_KAVYA.

## Part 4 — Resend key is environment-only

Confirmed `sendResendEmail` (the single Resend client) reads `RESEND_API_KEY`
from the environment with **no fallback default key** anywhere in source
(grep-verified: zero hardcoded `re_…` keys). The key value is Kavya's to set
in `.env.local` / Vercel — see NEEDS_KAVYA.

## Part 6 — admin cleanup confirmed

- `/admin/rights` genuinely gone (route + nav + API deleted last pass).
- `/admin/calibration` runs automatic signals (multi-model + variance) without
  requiring manual scoring.
- `/admin/corpus/dictate` is record → editable transcript → save.
- New roster/send/block controls are reachable from the admin nav
  ("Roster & emails") and the Students list (block/unblock in the ⋯ sheet).

## Still open — NEEDS_KAVYA.md

- **`RESEND_API_KEY`** — the one hard blocker for actually emailing.
- **Apply four additive migrations** (`profiles_access_scope`,
  `credential_invites`, `profiles_status_blocked`, `calibration_auto_signals`).
- **Human E2E**: send a test email, import the roster, log in as a real
  account, block it mid-session and confirm the very-next-request rejection.

---

## Merge & deploy (this session)

- **Migration mess resolved.** The real `_migrations_applied` ledger had 7
  entries (none of the 5 "wrong" migrations). The 5 wrong migrations' tables
  already existed in production (media_assets, certificates, materials,
  submission_files, psych_* with data) — they were applied earlier and are
  harmless/idempotent, so they were left untouched. The crash was in
  `apply-migrations.ts`: `const { data: already } = await client.query(...)`
  — node-postgres returns `rows`, not `data`, so `already` was `undefined` and
  `already.length` threw with no context. Fixed to `rows` + a guard that names
  the failing migration. Then applied + **verified in the production schema**:
  `profiles.scope/status/block_reason`, `credential_invites`, and
  `rubric_dimensions.inter_model_agreement/variance/last_auto_at` (ledger now 11).
- **Merge.** Fast-forwarded into `main` via PR #2 (merge commit `97dfdd9`).
- **Deploy.** Vercel auto-deployed on the main push; production deployment
  `bind-lms-platform-9jva1ctim…` is `Ready`.
- **Production smoke test** (against `https://vibhapsychology.com`, not
  localhost): `/` 200, `/login` 200, `/paused` 200 — the new code, including
  the blocked-status `/paused` screen, is live.

Not verified live (needs a real browser + a real session, and/or the Resend
key — see NEEDS_KAVYA): the blocked-status live-session rejection E2E, the
lecture-only direct-URL rejection E2E, and the email send (RESEND_API_KEY was
never present in the environment).
