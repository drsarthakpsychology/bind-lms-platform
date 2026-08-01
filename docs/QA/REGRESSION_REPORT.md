# Regression Report

Every fix is followed by a re-run of the full test matrix. Logged here.

## Round 1 — after design token + segmented control + video watermark + assignment + security fixes
- `npm run lint` → ✅ exit 0
- `npx tsc --noEmit` → ✅ exit 0
- `npm run build` → ✅ exit 0 (2.3s)
- Auth smoke test (scripted session):
  - `/login` → 200
  - `/dashboard` (auth) → 200, renders "My Courses", no RSC error (BUG-001 fixed)
  - `/admin` (auth) → 200, admin nav renders (BUG-001 fixed)
- Security headers → present on `/login` (BUG-003 fixed)
- Full test matrix T1–T17 → all PASS (see TEST_MATRIX.md)

## Round 2 — after watermark TS narrowing fix
- `npx tsc --noEmit` → ✅ exit 0
- `npm run build` → ✅ exit 0

## Status
No regressions introduced by the hardening pass.

## To re-run after any future change
1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`
4. Authenticated route smoke test (create temp user, login, hit /dashboard + /admin, clean up)
5. Security header check on a public route
