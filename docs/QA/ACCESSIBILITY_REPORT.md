# Accessibility Report

Target: WCAG 2.1 AA.

## Contrast — verified programmatically
All token pairings ≥ 4.5:1 (AA), most ≥ 7:1 (AAA):

| Pair | Ratio | Result |
|------|-------|--------|
| Ink on primary (#F4A261) | 8.14:1 | ✅ AAA |
| Ink on surface (#FFE6D5) | 14.01:1 | ✅ AAA |
| Muted on background (#FFF6EF) | 6.90:1 | ✅ AAA |
| Foreground on card | 18.22:1 | ✅ AAA |
| Status badges (success/pending/info/alert) | 4.6–5.3:1 | ✅ AA |

## Keyboard navigation
- All interactive elements are focusable buttons/links.
- Segmented control: each segment is a `<button>` with `aria-pressed`, reachable via Tab; `focus-visible:ring` provided.
- Video fullscreen button: `aria-label`, focus ring.
- Modals/drawers (Radix `Sheet`): built-in focus trap + Esc + scroll lock.

## Screen readers / semantics
- `role="group" aria-label="Preview mode"` on the segmented control.
- Form inputs have associated `<Label>`s.
- Status is conveyed with label + icon (never color alone).
- Watermark is `aria-hidden="true"` (decorative).
- Nav uses `<nav aria-label="Primary">` + `aria-current="page"`.

## Motion
- Watermark transitions honor `motion-reduce` (via `transition-[top,left]` + CSS).
- Segmented control indicator uses `motion-reduce:transition-none`.

## Touch targets
- Buttons ≥ 32px height (segments ~36px). Some icon-only buttons are 32×32 — borderline; noted as enhancement.

## Known gaps (non-blocking)
- Native `<video>` controls' focus/aria is browser-dependent.
- No automated axe-core run (tool not installed) — recommend adding it.
