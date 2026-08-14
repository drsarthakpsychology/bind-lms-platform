# Mobile Route-by-Route Review (T76)

Status: **draft** · Author: unattended build session (2026-08-14) · Reviewer: Kavya / design QA
Scope: every student-facing mobile route, checked against the six mobile-first
principles below. This is the static review pass; live device QA (keyboard
overlap, gestures, real-screen density) is tracked separately in NEEDS_KAVYA.

## The six principles (from the mobile-progressive-disclosure brief)

1. **Focused task** — one primary action per viewport; nothing competes.
2. **Progressive disclosure** — show → act → reveal next; secondary content
   hides until needed.
3. **Clear hierarchy** — primary / secondary / tertiary visible at a glance.
4. **Obvious next action** — the user can name what to do next within seconds.
5. **Contextual secondary actions** — notes/hints/metadata in sheets, not pinned.
6. **State preserved** — back nav, orientation change, sheet open, and
   mid-task interruption never lose progress.

## Route review

| Route | Focused task | Progressive disclosure | Hierarchy | Next action | Contextual secondary | State | Notes |
|---|---|---|---|---|---|---|---|
| `/today` | ✅ one primary card | ✅ | ✅ | ✅ | ✅ | ✅ | Front door; primary-resume demotes the chain card when both present |
| `/dashboard` | ✅ course list | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `/courses/[id]` | ✅ current lesson | ✅ week `<details>` | ✅ | ✅ Next lesson | ✅ | ✅ | T58/T59 line-clamp + flattened borders landed in slice 1 |
| `/courses/[id]/lessons/[id]` | ✅ video | ✅ sections | ✅ | ✅ sticky next | ✅ | ✅ | T57 sticky forward action added |
| `/courses/[id]/materials/[id]` | ✅ document | ✅ sections | ✅ | ✅ | ✅ | ✅ | |
| `/practice` | ✅ grouped tools | ✅ | ✅ | ✅ | ✅ | ✅ | PracticeGroups + weak-spots collapsible |
| `/practice/decode` | ✅ one drill | ✅ SegmentedControl | ✅ | ✅ | ✅ | ✅ | T86 decode-modes: 5 drills gated, per-mode state preserved |
| `/practice/mse` | ✅ one level | ✅ ladder | ✅ | ✅ | ✅ | ✅ | T65 humanised labels |
| `/practice/osce` | ✅ one station | ✅ | ✅ | ✅ | ✅ | ✅ | T59 stacked summary |
| `/practice/judgment` | ✅ one call | ✅ | ✅ | ✅ | ✅ | ✅ | T53 stacked scale; T87 done-state |
| `/practice/ethics` | ✅ one dilemma | ✅ | ✅ | ✅ | ✅ | ✅ | T77 done-button fixed |
| `/practice/formulation` | ✅ 5P grid | ✅ | ✅ | ✅ | ✅ | ✅ | T58 full factor text |
| `/practice/rounds` | ✅ one card | ✅ | ✅ | ✅ | ✅ | ✅ | T61 EmptyState; T29 completion state |
| `/practice/weak-spots` | ✅ drill | ✅ collapsible | ✅ | ✅ | ✅ | ✅ | T61 EmptyState |
| `/practice/two-minute-clinic` | ✅ 120s | ✅ sequential | ✅ | ✅ | ✅ | ✅ | T19 sequential prompts |
| `/practice/consulting-room` | ✅ case picker | ✅ | ✅ | ✅ | ✅ | ✅ | T60 single disclaimer |
| `/practice/consulting-room/session/[id]` | ✅ patient convo | ✅ notes→sheet | ✅ | ✅ | ✅ | ✅ | T59 notes sheet at <lg; T54 composer pinned |
| `/practice/consulting-room/session/[id]` (debrief) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | T59 flattened cards |
| `/practice/tutor` | ✅ chat | ✅ | ✅ | ✅ | ✅ | ✅ | T58 header wraps |
| `/practice/role-play` | ✅ chat | ✅ | ✅ | ✅ | ✅ | ✅ | empty state added |
| `/practice/supervision` | ✅ log | ✅ | ✅ | ✅ | ✅ | ✅ | T61 EmptyState/StatCard |
| `/practice/library` | ✅ browse | ✅ | ✅ | ✅ | ✅ | ✅ | T50 note errors surfaced; T51 EmptyState |
| `/practice/modules` | ✅ list | ✅ | ✅ | ✅ | ✅ | ✅ | T51 EmptyState |
| `/practice/check-in` | ✅ one tap | ✅ | ✅ | ✅ | ✅ | ✅ | non-clinical, no surveillance |
| `/reflect` | ✅ journal | ✅ | ✅ | ✅ | ✅ | ✅ | T61 EmptyState; owner-only |
| `/wall` | ✅ feed | ✅ | ✅ | ✅ | ✅ | ✅ | T51 EmptyState; T63 reactions always tappable; T50 errors surfaced |
| `/passport` | ✅ competencies | ✅ | ✅ | ✅ | ✅ | ✅ | T61 StatCard |
| `/tools/psychopharm` | ✅ browse | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `/tools/psychopharm/[drug]` | ✅ one drug | ✅ | ✅ | ✅ | ✅ | ✅ | T86 observer notes accordion; T87 compare entry fixed; T88 loading |
| `/tools/psychopharm/compare` | ✅ compare | ✅ | ✅ | ✅ | ✅ | ✅ | T67 stacked records; T51 EmptyState |
| `/tools/psychopharm/learn` | ✅ one concept | ✅ | ✅ | ✅ | ✅ | ✅ | T64 touch targets |
| `/login` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | T66 min-h-dvh |
| `/waitlist` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | T65/T53/T66 sheet label + phone type |

## Verdict

Every student-facing mobile route meets the six principles in its static
composition. The concrete T-item fixes (T50–T88) that underpinned this review
are committed in slice 1 (`a5b24b3`) and the main sweep. What remains is
**device-level verification only** — real-phone keyboard overlap, gesture
ergonomics, and 320px density under actual touch — which needs a browser/device
and is tracked in NEEDS_KAVYA (T54/T55/T56/T81/T82/T89/T90 live QA).

Gaps found in this pass that are still worth a human look before live QA:
- `/practice/osce` and `/practice/mse` per-domain reveal rows use fixed-width
  labels; verified wrapping at 380px but worth a real-phone glance.
- `/tools/psychopharm/compare` stacked records render well statically; a
  real-device scroll test is recommended for very long comparison sets.
- The wall reaction controls are always tappable now (T63) — confirm the 0-count
  chip doesn't read as a bug on first visit.
