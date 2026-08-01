# Test Matrix

Covers roles × flows × outcomes. Updated as tests run.

## Roles
- **Admin** — full access; can preview student view.
- **Student** — enrolled learner; published courses only.

## Matrix

| # | Role | Flow | Test | Result |
|---|------|------|------|--------|
| T1 | Guest | /login | Renders, no session leak | ✅ PASS |
| T2 | Guest | /dashboard /admin /courses | Redirect to /login | ✅ PASS |
| T3 | Student | Login | Session cookie set, redirect /dashboard | ✅ PASS |
| T4 | Student | /dashboard | Renders "My Courses", no RSC error | ✅ PASS |
| T5 | Student | Lesson playback | Signed URL video, watermark, fullscreen wrapper | ✅ PASS |
| T6 | Student | Assignment text submit | Creates pending_review submission | ✅ PASS |
| T7 | Student | Assignment audio upload | Signed upload → submission row | ✅ PASS |
| T8 | Student | Progression gate | No submission → complete blocked | ✅ PASS |
| T9 | Admin | /admin overview | Stats render | ✅ PASS |
| T10 | Admin | Students create | Admin API creates user + profile | ✅ PASS |
| T11 | Admin | Course create/edit | CRUD + publish toggle | ✅ PASS |
| T12 | Admin | Lesson builder | Video upload → lesson row | ✅ PASS |
| T13 | Admin | Multi-select assignment types | Checkboxes → comma-separated type | ✅ PASS |
| T14 | Admin | Submission approve | Status → approved | ✅ PASS |
| T15 | Admin | View mode toggle | Segmented control persists (cookie) | ✅ PASS |
| T16 | All | Security headers | CSP, X-Frame, nosniff present | ✅ PASS |
| T17 | All | Design tokens | Pastel palette, WCAG AA contrast | ✅ PASS |

## Regression re-runs
- Re-run T1–T17 after every fix. Log results in REGRESSION_REPORT.md.
