# Module: Admin dashboard
> Verified against `main` @ `b2a9698`. Menu from `ADMIN_ITEMS` in `src/components/navigation/nav-config.ts`.

| Group | Pages (`src/app/(dashboard)/admin/…`) |
|---|---|
| Launch | `courses` (builder + cohorts panel), `emails` (Mail: compose, recipient picker incl. "message one cohort", failed/retry/clear, logins search), `people` (pipeline + presence "Active now"), `cohorts`, `students` (directory, bulk import/lock, certificate), `flags` (What's live) |
| Review | `triage`, `submissions`, `sim-review`, `supervision`, `wall-reports`, `enquiries`, `checkins` |
| Content/System | `modules`, `cards`, `idioms`, `corpus`, `psychopharm` + `psychopharm-review`, `calibration`, `access`, `activity`, `pulse`, `roster`, `infra`, `tools` (bulk import, cohort calendar, **Support key**) |
All mutations are Server Actions guarded by `requireAdmin()`; hidden/test/robot accounts are excluded from people lists (`src/lib/people/hidden.ts`). Mail uses Resend; webhook updates `email_sends`. `/admin/infra` reads `infra_metrics()` and daily `infra_snapshots`.
Regression set when editing: e2e `admin-access.spec.ts`; unit tests for cohorts rules, failed-pick, roster, hidden accounts.
