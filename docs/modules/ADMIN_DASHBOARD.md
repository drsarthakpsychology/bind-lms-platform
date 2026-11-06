# Module: Admin dashboard
> **VERIFIED against branch `admin-redesign`** (built on `testing` @ `036327f` + `main` @ `b2a9698`), 2026-11-06. Plan and decision log: [ADMIN_REDESIGN_PLAN](../plans/ADMIN_REDESIGN_PLAN.md). Menu from `ADMIN_SECTIONS` in `src/components/navigation/nav-config.ts`.

## Menu (one place per job)
| Sidebar group | Place | Tabs / pages (`src/app/(dashboard)/admin/…`) |
|---|---|---|
| – | Home | `page.tsx` — only what needs you (concerns, inbox replies, logins to fix, follow-ups, failed emails, grading, flagged sessions, quiet, not started), 4 numbers (students, on now, active this week, never signed in), cohort cards, quick links |
| People | Students | `students` (list, no sideways scroll), `students/[id]` (profile: Overview · Access & login · Activity · Credentials · Messages), `students/add` (THE add-students page: type/paste or upload a file), `students/logins` (login links in bulk), `access` (sections on/off for many) |
| People | Cohorts | `cohorts`, `cohorts/[id]` (Overview · Members · Lectures · Progress · Messages · Settings incl. session calendar) |
| People | Activity | `activity` (Live now · Cohorts · Falling behind · Everyone), `pulse` (who needs a nudge), `learning`, `checkins` (anonymous wellbeing trends) |
| People | Pipeline | `people` (CRM pipeline), `enquiries` (form leads as action cards, Make a student) |
| Communicate | Messages | `emails` folders: Inbox · Compose (Formatted / Plain text / HTML) · Notifications (new) · Sent · Failed (retry one / ticked / all) |
| Teach | Content | `courses`, `flags` (What's live, grouped, with descriptions), `psychopharm-review`; hidden: `cards` (Rounds review queue — Rounds is retired), `idioms`, `corpus`, `modules` |
| Teach | Review | `triage`, `submissions`, `doubts` (reply-only: private concerns, unanswered, all), `supervision`; hidden: `sim-review`, `wall-reports`, `calibration` |
| Teach | Credentials | `credentials` (find by roll number, revoke, PDF, custom certificate designer), `achievements` (badge & certificate types) |
| Settings | System | `infra` (usage + per-AI-provider detail), `management` (admins), `tools` (Support key only) |

## Redirects kept (old links never break)
`/admin/cohorts/student/[id]` → `/admin/students/[id]?tab=access` · `/admin/activity/[id]` → `?tab=activity` · `/admin/emails?folder=logins` and `/admin/roster` → `/admin/students/logins`.

## Shared data (one source, same facts everywhere)
- `src/lib/people/roster-data.ts` `loadRoster()` — every real student with roll number, cohorts, **one account status** (`lib/people/account-status.ts`: Locked · Access ended · Active · Password set, not signed in · Invited · Link expired · Login email failed · Not invited yet), presence, minutes, lectures done/available, attention flags (`lib/people/attention.ts`).
- Used by Students, profile, Home, Activity, Cohort workspace, Credentials, quick search.

## Permissions
Pages read with `requireAdmin()` (Super Admin + View Admin); every write uses `requireSuperAdmin()`. View Admins see the pages without the write buttons.

## Quick search
⌘K / `/` palette includes every student for admins (name, roll number, email, mobile) → profile (`src/components/search/palette-host.tsx`).

## Regression set when editing
Unit: `lib/people/*.test.ts`, `lib/email/pace.test.ts`, `lib/email/rich-html.test.ts`, `lib/analytics/timeline.test.ts`, `lib/attention/schedule.test.ts`, `lib/auth/preview-gate.test.ts`, cohort rules, failed-pick, roster. E2E: `admin-access.spec.ts`. Screens checked at 390 / 1366 widths (no sideways scroll).
