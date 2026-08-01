# Test Coverage

## Automated tests
**None currently.** No unit, integration, or E2E framework is installed
(no `test` script in package.json, no test deps). This is the biggest
coverage gap and the top recommendation before further scaling.

## Manual / scripted coverage (this QA pass)
| Area | Coverage |
|------|----------|
| Auth flow (login → session → redirect) | ✅ scripted (temp user) |
| Protected route gating (unauth redirect) | ✅ scripted |
| Dashboard render (auth) | ✅ scripted |
| Admin render (auth) | ✅ scripted |
| RSC serialization boundary | ✅ fixed + verified |
| Security headers | ✅ curl-verified |
| Design token contrast | ✅ programmatic (WCAG) |
| Assignment multi-select (UI + action) | ✅ typecheck/build + review |
| Video fullscreen watermark | ✅ code review (browser verify recommended) |

## Not yet covered
- E2E flows in a real browser (Playwright) — **recommended**
- Unit tests for server actions / RLS helpers — **recommended**
- Load/perf testing — **recommended before scale**
- Cross-browser matrix (Safari/Chrome/Firefox) — manual spot-check only

## How to add automated coverage
1. Install Vitest (unit) and Playwright (E2E) — free, needs approval.
2. Add `test` script; write tests for server actions and key flows.
3. Wire into CI (GitHub Actions) to run lint + tsc + tests on every push.
