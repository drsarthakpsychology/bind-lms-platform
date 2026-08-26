# Mobile audit — findings status tracker (snapshot 2026-08-14 20:40)

Purpose: prevent the three writers from double-working the same audited surface.
Status key: **DONE** = fix committed on `feat/mobile-design-system` (main-branch
writer's commits + my mine-only commits) · **IN-FLIGHT** = in the parallel
writer's uncommitted 24-file set · **OPEN** = not yet covered · **WT** = covered
on the worktree branch (not yet merged).

Source of truth for the findings: `docs/mobile-audit-t18-t50.json` (audit
workflow output).

## progressive-disclosure-global (T18/T19/T87)
| Route | Status |
|---|---|
| /practice/decode | DONE — segmented one-task flow (DecodeFlow) |
| /courses/[id]/lessons/[id] | DONE — quiz collapsed, sticky action (WT too) |
| /practice/mse | DONE — ladder + opt-in secondary drills |
| /wall | DONE — feed-first, compose in sheet |
| /reflect (journal) | DONE — history-first, compose in sheet |
| /record | DONE — supervision/check-in segmented |
| consulting-room case-picker | DONE — in-progress-first, one dominant target |
| /today | DONE — primary-first |
| consulting-room page | DONE — condensed header, safety-first sheet |
| /dashboard | IN-FLIGHT (worker) |

## composition-consistency (T20/T61)
| Route | Status |
|---|---|
| /dashboard | IN-FLIGHT (worker) |
| /today, /practice, /courses/[id], /wall, /record, /reflect, /decode | DONE |
| /passport | IN-FLIGHT (worker) |
| /tools/psychopharm | DONE — search focus, learn details, drug collapse |
| /admin | IN-FLIGHT (worker) |
| (shell) ShellContent | DONE — immersive session bare |

## lesson-course (T24/T27/T28/T29)
| Route | Status |
|---|---|
| courses/[id] | DONE — flat rows + hero continue (WT too) |
| lessons/[id] | DONE — tabs + progressive check + sticky action (WT too) |
| materials/[id] | IN-FLIGHT (worker — inner PDF error) |
| /today, /dashboard | DONE / IN-FLIGHT |

## Progressive assessments (T22/T23)
| Route | Status |
|---|---|
| lessons "Check what stuck" | DONE — QuizCheck one-question |
| /practice/landmark | DONE — QuizCheck |
| /practice/decode | DONE — segmented |
| /practice/mse | DONE — ladder + opt-in |
| /practice/ethics, weak-spots, out-of-depth, rounds, two-minute-clinic, check-in | WT — worktree writer (two-minute-clinic sequential committed) |
| /practice/osce | DONE — persistence + flow |
| Assessment flow engine | DONE — MobileAssessmentFlow/MobileChoiceList |

## reading-resources (T25/T26/T68)
| Route | Status |
|---|---|
| material viewer | IN-FLIGHT (worker) |
| practice/library | DONE — full abstract + one-line filters |
| practice/tutor | IN-FLIGHT (worker — source expand) |
| sim session long messages | DONE — edge-to-edge |
| psychopharm [drug] | DONE — FDA sections collapsed |

## forms (T21/T53/T54)
| Route | Status |
|---|---|
| /record, /reflect, /wall | DONE |
| /login, /waitlist | IN-FLIGHT (worker) / WT |
| /practice/check-in | WT |
| admin/corpus/dictate | IN-FLIGHT (worker) |

## state-offline (T46/T47/T48)
| Route | Status |
|---|---|
| sim session (draft + notes + timer) | DONE — useDraft + startedAt |
| /reflect, /wall drafts | DONE — useDraft |
| /practice/osce | DONE |
| /practice/formulation | DONE |
| /practice/mse trainer | DONE |
| /practice/decode-arena, judgment | OPEN (decode-arena inside worker-owned decode-flow) |

## Other high-value, committed
- Touch targets 44px: shared Input/Select/SegmentedControl, journal mood chips,
  psychopharm /learn pills, library filters, review-filter input.
- §3.6 Finish-confirm; T50 network rollback (no ghost message).
- `docs/mobile-strategy.md` — the design spec (brief §65).
- Keyboard/safe-area: viewport-fit=cover + interactive-widget=resizes-content.

## Merge risk (must resolve before worktree → main)
Worktree `worktree-psychopharm-book-enrichment` is 50 commits behind main and is
editing overlapping surfaces (courses/[id], lessons/[id], consulting-room,
debrief, passport, today). Rebase it onto `feat/mobile-design-system` before
merging; treat those files as conflict hotspots.

## Worker-slice update (2026-08-14 20:45)
- **T41 /settings — DONE** (committed). Grouped Account/Preferences/Support
  sections, real session identity (email+role; no invented name), sidebar +
  mobile-drawer entry points.
- **T42 /notifications — DONE** (committed). Schema-free derived feed under
  existing RLS: student = replies to their non-anonymous wall posts;
  admin = open wall-reports queue. Bell entry in both nav footers.
- **Still OPEN in T18-T50 range**: T29 (decode-arena/judgment completion —
  needs owned surfaces), T40 (dashboard progress architecture), T48 (offline
  wiring — useOffline hook exists, needs sim/wall/today wiring). These need
  surface ownership or a product decision, not a fix.

## Worker-slice update (2026-08-14 20:50)
- **T48 offline — DONE** (committed). useOffline pill in sim header + wall +
  journal. T40 remains OPEN (dashboard progress — coordinator-owned surface).
- **T29 — DONE (judgment)** (committed). MobileCompletionState + "Back to
  practice" next action. Decode-arena completion left to coordinator (file
  owned by worker-owned decode-flow).
## Worker-slice update (2026-08-14 20:55)
- **T40 — DONE** (committed 6357de6). Dashboard grid cards show progress once
  (single "N of M lessons" count); the Step 1 continue card keeps the bar.
