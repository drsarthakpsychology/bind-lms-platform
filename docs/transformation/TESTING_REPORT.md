# Testing report — VIBHA LMS transformation

Date: 2026-11-03. Branch `feature/vibha-lms-transformation`.

## Gate (whole repository, final state)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm run lint` (eslint) | 0 errors, 0 warnings |
| `npm run test` (vitest) | **127 files, 770 tests, all pass** (baseline before this work: 114 files, 628 tests) |
| `next build` | Passes; new routes compile: `/games/lab`, `/games/lab/[id]`, `/games/lab/cases`, `/games/lab/cases/[id]`, `/games/revise`, `/admin/learning`, `/api/admin/learning/csv` |

Build was run with placeholder public env values (no secrets).

## New unit tests (142)

| Area | File | What is covered |
|---|---|---|
| Lab maths | `src/lib/lab/lab.test.ts`, `lab2.test.ts` | Digit span scoring and stop rule; serial-position curve and typo tolerance; Stroop effect (medians, anticipations dropped); Cowan's K; illusion bias; reinforcement-schedule simulation shapes; Rescorla-Wagner conditioning incl. spontaneous recovery; design-threat scoring; seeded data + Pearson/partial r; attribution summary; catalogue integrity (numbering, real module links, valid answers) |
| Lab progress | same | First-run XP, same-day re-run gives none, re-check scheduling 3/10/30/90 days, weak score resets, reflection pays once, `normalise` rejects junk, copies merge |
| Casebook | `src/lib/casebook/casebook.test.ts` | Every one of 36 activities validated (answers in range, categories exist, branches reachable with an ending, unique ids, real modules), quote/vignette length guard, validator negative cases, order scoring |
| Revise | `src/lib/revise/plan.test.ts` | Empty / caught-up states, review cap, re-tests 3/7/21 with weak-score boost, Lab re-checks, Coach confusions, stale modules, interleaving and caps |
| Notes marks | `src/lib/study/marks.test.ts` | Bookmarks/notes normalise, toggle, timestamped merge with tombstones |
| Admin insights | `src/lib/insights/learning.test.ts` | Aggregation on malformed rows, min-takers rule, CSV escaping and formula neutralising |
| Security | `src/lib/auth/api-gate.test.ts`, `src/lib/learn/integrity.test.ts`, `store.test.ts`, `master-login.test.ts`, `progress-clamp.test.ts`, `submission-paths.test.ts`, `doubts/visibility.test.ts` | API gate decisions (401/403 branches), XP clamp, per-user storage key, lecture progress bounds, master-login lookup and rate limits, submission path ownership, doubt visibility |

## Browser tests (Playwright, real components in the Next dev server)

Supabase is not available in this sandbox, so pages that need a session were
exercised through an unauthenticated **harness route** that renders the same
client components with an empty state (saved to localStorage). The harness
was never committed. Real-page auth gates are covered by unit tests and the
build, not by a live login.

| Surface | Viewports | Result |
|---|---|---|
| Lab experiments 1-7 | phone 390×844, tablet 820×1180, desktop 1440×900 × light/dark (42 runs) | All complete; correct saved results and XP; no console or hydration errors; no horizontal overflow; keyboard paths (Stroop R/B/G/P, change detection S/D, slider arrows, Enter); reduced-motion draws charts instantly; touch targets ≥44px |
| Lab experiments 8-12 | phone + desktop (62 screenshots) | All stages complete; no errors; no overflow (after the container fix) |
| Casebook, 36 activities | phone + desktop (72 runs) | 33 played to a score with progress saved and no errors/overflow. 3 branching cases with "try again" loops (`k1-15-asking-about-suicide`, `k2-ed-five-questions`, `k2-elder-branching`) were not auto-completed by the generic player (it always picks the same option, which loops by design); their structure is validated by unit tests (reachable, has an ending). **Manual play-through recommended.** |
| Casebook library | 3 viewports | Search, topic/type/status filters, paging; no overflow |
| Lab home | 3 viewports × light/dark | No overflow; re-check "Due now" card links correctly |
| Revise | phone + desktop, light/dark | Ready / all caught up / new-student states; no overflow |
| Notes bookmarks + notes | phone + desktop, light/dark, reduced motion | Note autosaves, survives reload, bottom bar never covers it |
| Admin insights | 390 and 1440 wide, light/dark, fixture data | No overflow |

Measured results that confirm the experiments behave as described: digit span
stop rule (5 forward / 3 backward with a scripted observer), serial-position
U-shape (100/0/100 with first-and-last recall), Stroop effect +150 ms with
slower clashes, K = 2 and 4 for a 4-item observer, Müller-Lyer +20 / −10 set
exactly, "every time" reward history extinguishes fastest (27 vs 79 presses).

## Not tested here (needs a non-production Supabase and a real login)

- Full student journey with a real account: login → dashboard → module →
  Lab → Casebook → Revise, and server persistence of `learn_progress`.
- Admin journey with a real admin: What's live → unlock Lab → preview,
  Learning insights with live data, CSV download.
- The two optional migrations and the flag migration against a database.
- The 28 admin-page guards and 37 API-route gates against live sessions
  (decision logic is unit-tested; wiring compiled in the build).
- Bundle size per route (Next 16 build output does not print sizes; not measured).

The integration prompt asks the next session to run these against a
Supabase branch or local stack before any merge.
