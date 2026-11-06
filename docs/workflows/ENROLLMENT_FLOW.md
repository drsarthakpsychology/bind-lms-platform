# Workflow: Enrolment & cohort placement
> Verified against `main` @ `b2a9698`. There is **no payment step**; access is granted by admins.
```mermaid
flowchart TD
  W["Public /waitlist form -> enquiries (honeypot, 5/h IP limit, stripMarkup)"] --> A["Admin reviews /admin/enquiries"]
  A --> I["Admin: bulk import (CSV name,email) or paste emails in Cohort 'Add people'"]
  I --> C["importRoster -> auth user + profiles row (trigger handle_new_user)"]
  C --> T["issueSetupLink: hashed token in account_setup_tokens / credential_invites"]
  T --> M["Email via Resend (if key set) or admin copies link"]
  M --> S["set-password -> student sets own password"]
  C --> E["course_enrollments row and/or cohort_members row (+ scope full | lectures_only)"]
  E --> V["Lecture visibility by cohort rules (lesson_cohorts / lesson_grants)"]
```
Sources: `src/app/waitlist/actions.ts`, `src/lib/auth/roster.ts`, `admin/students/bulk-import.ts`, `admin/cohorts/actions.ts`, `admin/courses/[courseId]/people-actions.ts`, `src/lib/enrollment.ts`, `src/lib/cohorts/rules.ts`. Students in no cohort fall back to enrolment/scope rules.
