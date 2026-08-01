# Master Test Plan

## Purpose
Comprehensive test plan for the Lumen LMS production-readiness pass. Covers
functional, security, UI/UX, accessibility, performance, and regression
testing of the current application scope.

## Scope
- Auth (login, session, expiry, concurrent-session blocking)
- Student flows (dashboard, course listing, lesson playback, watermark,
  assignment submission, progression gate)
- Admin flows (dashboard, students, courses, lesson builder, submissions
  review)
- Design system (Neo-Brutalist pastel tokens, segmented control, spacing)
- Media (signed URL playback, fullscreen watermark, uploads)

## Out of scope (documented)
- Payments, certificates, AI tutor, quizzes, multi-tenant orgs (not built)

## Test environment
- Local dev server (`npm run dev`) against hosted Supabase project
- Production: Vercel deployment (`bind-lms-platform.vercel.app`)

## Test data
- Real admin account (kavyabothrasocial@gmail.com) and temporary test
  accounts created/removed via the Admin API during verification.

## Strategy
1. Static checks: lint, typecheck, production build.
2. Manual/scripted flow tests per role.
3. Security: OWASP-style review of server actions, RLS, headers, secrets.
4. Accessibility: WCAG AA contrast audit + semantic/ARIA review.
5. Regression: re-run all after each fix.
