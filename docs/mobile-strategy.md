# VIBHA — Mobile strategy & design spec

_Status: live decision, 2026-08-14. Re-read before re-litigating mobile layout._

## The decision (brief §65 / audit Task 1.1)

**Mobile-first responsive, one component tree, with named exceptions.**
Option C from the strategy question. Base styles are the phone layout; `md:`
and up are progressive enhancement. We do **not** fork `/app/(mobile)/` and
`/app/(desktop)/` — that doubles every future fix and drifts within weeks.

**The one current exception: the patient simulation** (`SimSessionView`). A
full-height chat surface with a pinned composer, keyboard-aware layout and a
single scroll region is a different layout with different behaviour — it gets
its own component. Any future exception needs a written justification here.

## The principle (the directive that supersedes "make it responsive")

Mobile is a **separate product**, not a CSS-shrunk desktop:

- **Shared:** data, APIs, state, validation, business logic, permissions,
  backend, design language.
- **Different:** information hierarchy, interaction model, content density,
  navigation, composition.

Every screen answers **"what is the one thing I should do right now?"** — not
"here are 17 things you can do." Use **progressive disclosure** (show → act →
reveal next), **focused single-task flows**, and **bottom sheets** for
contextual tools (notes, hints, compose, filters). One cognitive unit at a
time; keep context visible ("Question 3 of 10"); never remove functionality —
reveal it.

## Reusable primitives (the mobile design system)

`src/components/mobile/` — build on these, don't hand-roll:

| Primitive | Use for |
|---|---|
| `MobilePage` | full-viewport scroll surface, safe-area insets |
| `MobileHeader` | compact sticky back header (contextual) |
| `MobileSection` | vertical content group with optional header |
| `MobileCard` / `MobileListItem` | surfaces / the tappable-row workhorse |
| `MobileBottomSheet` | contextual tools (notes, hints, compose, filters) |
| `MobileModeSwitcher` | one-task-at-a-time segmented view |
| `MobileStickyAction` | the always-visible forward action |
| `MobileContinueAction` / `MobileCompletionState` | journey + completion moments |
| `MobileInput` / `MobileTextarea` / `MobileErrorLine` | form controls + human errors |
| `StatusPill` | quiet status (scripted/AI) instead of alarm banners |

Plus hooks `useDraft` (localStorage autosave), `useOffline`, `useAsyncAction`.

## Interaction rules

- **One scroll container per screen.** Never nested scroll regions.
- **Touch targets ≥44px** (48 preferred) for anything interactive.
- **Safe areas everywhere:** `viewport-fit=cover` is set; bottom nav, composer
  and sheets pad `env(safe-area-inset-bottom)`.
- **Keyboard:** `interactive-widget=resizes-content` in the viewport meta means
  the layout viewport resizes when the Android keyboard opens — the composer
  stays visible with no JS.
- **Reduced motion:** every animation renders a readable static state.
- **No bare numeric dates** — `formatRelativeTime()` (lib/format.ts).
- **No keyboard-hint copy on touch devices** (Enter/Shift/Cmd).
- **Disabled ≠ enabled:** disabled = no fill, muted border/text, no shadow;
  pending = fill + spinner + `aria-busy`.

## Density

- Prefer fewer, stronger spacing values; screens should breathe.
- No more than two levels of nested bordered container.
- Two shadow tokens only (`--shadow-card`, `--shadow-raised`); no blurred
  shadows.
- Long titles clamp to 2 lines with `overflow-wrap:anywhere` — never a
  mid-word truncation that hides the distinguishing content.

## Concurrency note

During the 2026-08-14 rebuild two writers worked the same branch. Rule that
came out of it: one writer owns the shared mobile primitives + surface
conversions; the other covers audit findings and keeps the branch green.
Repair JSX races promptly; never leave the branch un-buildable.
