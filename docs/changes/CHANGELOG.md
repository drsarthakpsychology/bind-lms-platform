# Documentation & Architecture Changelog
Format: newest first. Each entry lists what changed in **docs** and, when relevant, the code commit it was verified against. Application changes are summarised in [DEVELOPMENT_HISTORY](../history/DEVELOPMENT_HISTORY.md); git is authoritative for code.

## 2026-11-06 — Admin dashboard redesign (branch `admin-redesign`, not merged)
- Built on `testing` (Achievements, roll numbers, Super/View Admin) + `main`. Plan + decisions: `docs/plans/ADMIN_REDESIGN_PLAN.md`.
- New admin menu (10 places in 4 groups); one home per job; redirects for moved pages.
- Students list + one profile; one Add students page; login links under Students.
- Messages: Formatted / Plain text / HTML compose; Failed with safe retry; Notifications to students; nudges also notify; paced sender; preview sites never email real students.
- Activity: live now, cohorts, falling behind, student timeline; "Still watching?" check in the player (owner decision D1).
- Cohort workspace tabs; reply-only Doubts & concerns; Credentials find-by-roll + custom certificate designer; centred certificate PDF; What's live grouped; AI provider detail; Home command centre; quick student search.
- DB step: `2026_11_admin_redesign.sql`. Docs updated: ADMIN_DASHBOARD, NOTIFICATIONS, DATABASE_INVENTORY, FEATURE_INVENTORY, plan.
- Checks: tsc, eslint, 870 unit tests, production build, screens at 390 and 1366 px with no sideways scroll.

## 2026-11-06 — Knowledge base established
- Added `docs/MASTER_ARCHITECTURE.md` and `docs/{architecture,modules,workflows,inventory,history,changes}/` (30+ files).
- Verified against `main` @ `b2a9698` (PR #45). Read-only audit; **no application code, schema or configuration changed**.
- Pre-existing flat docs (`docs/SYSTEM_MAP.md` etc.) left unchanged; drift recorded in `inventory/TECHNICAL_DEBT.md`.
- Findings recorded: D1–D5, S1–S4, R1–R4, C1–C4 (see TECHNICAL_DEBT).
