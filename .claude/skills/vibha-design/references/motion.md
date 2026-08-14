# VIBHA motion — reduced-motion-first, transform/opacity only

## The language (tokens in `src/app/globals.css`)

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 120ms | press, micro-interaction |
| `--duration-base` | 200ms | hover, default transition |
| `--duration-slow` | 400ms | reveal, modal |
| `--duration-slower` | 600ms | hero cascade reserve |
| `--ease-snappy` | cubic-bezier(0.2,0,0,1) | touches + hovers |
| `--ease-out-expo` | cubic-bezier(0.16,1,0.3,1) | entrances |
| `--ease-springy` | cubic-bezier(0.34,1.56,0.64,1) | playful lift (stamp) |

One language, always. Never mix unrelated easings or durations in one surface.

## Reduced-motion-first (2026 best practice)

Design the no-motion state first, then add motion as enhancement:

- Every entrance gates behind `useReducedMotion() === false`. Reduced-motion
  users get the final state, no flash.
- **SSR safety:** `useReducedMotion()` is `null` on the server. Use the
  established pattern — `initial={reduce === false ? {hidden} : false}` — so
  server-rendered HTML and no-JS visitors see content from first paint.
  (Known trade-off: the client hydrates with `reduce === false` and applies the
  hidden initial, producing a React hydration warning + a brief hide-then-animate
  on above-the-fold elements. This is a deliberate SSR-visible choice; do not
  "fix" it by making SSR hidden — that breaks no-JS. If it ever needs a real
  fix, it is a motion-system decision, not a per-component patch.)
- The global `@media (prefers-reduced-motion: reduce)` rule in globals.css
  flattens all CSS transitions/animations to 0.01ms as a second guard.
- Scroll-linked effects (Parallax, ScrollScale, whileInView) are disabled for
  reduced-motion users.

## What motion to use

- **Tactile controls:** hover `-translate-y-0.5` + bigger hard shadow; active
  `translate-x/y-px` + flattened shadow. 120–200ms, snappy.
- **Entrances:** Reveal (fade + 12px rise, 400ms out-expo), KineticHeadline
  (word-by-word mask, 600ms out-expo), ScrollScale (decorative accent).
- **State transitions:** fade+rise (~350ms out-expo) on meaningful state
  changes like a form success.
- **The stamp-in** (signature): one-shot scale 1.35→1 with the springy ease,
  450ms, when the stamp enters the viewport. A rubber stamp landing on the
  document. No repeat.

## What never to add

- No loops unless they communicate status/progress.
- No particles, no custom cursors, no scroll-jacking.
- No layout-property animation (top/left/width/height) — transform/opacity
  only.
- No long staggered lists (stagger only small groups of ≤ ~5).
- No library components with hidden motion defaults — port + audit at
  integration time (PFD learning #29: libraries ship embedded motion postures
  that ignore `prefers-reduced-motion`).
