# Workflow: Student & admin lifecycle
> Verified against `main` @ `b2a9698`.
```mermaid
stateDiagram-v2
  [*] --> Invited: admin imports email / adds to cohort
  Invited --> Active: sets password via one-time link
  Active --> FirstDetails: first login -> details form (student_details)
  FirstDetails --> Learning: lectures (cohort) + notes/games/practice (scope & blocks)
  Learning --> Blocked: admin sets status=blocked
  Blocked --> Learning: unblock (no re-login needed)
  Learning --> Expired: expires_at passes
  Learning --> Certified: admin issues certificate
  Learning --> Alumni: cron alumni-transition (daily 05:07 UTC)
  Alumni --> Alumni: permanent read-only access
```
Admin lifecycle: log in → `/admin` home → import/add people → build course & upload lectures (cohort choice) → send credentials/mail → switch features in "What's live" → review submissions/sessions/sign-offs → issue certificates → monitor Activity/Pulse/Infra. Pages: [ADMIN_DASHBOARD](../modules/ADMIN_DASHBOARD.md). `UNVERIFIED`: exact `alumni-transition` criteria — read `api/internal/cron/route.ts`.
