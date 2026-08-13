# UI / UX Guidelines — Neo-Brutalist Pastel Design System

Single source of truth for visual consistency across VIBHA.

## Philosophy
Neo-brutalist structure (bold 2px ink borders, hard offset shadows, clear
edges) softened with a **pastel** palette for a premium, warm, modern SaaS
feel — not a harsh neon look.

## Color tokens
Defined in `src/app/globals.css` (`:root` and `.dark`). Use tokens, never
hardcoded hex.

| Token | Light | Purpose |
|-------|-------|---------|
| `--primary` | `#F4A261` | Warm peach/terracotta — primary actions, active states |
| `--primary-foreground` | `#1E1E14` | Ink text on peach (8.14:1) |
| `--background` | `#FFF6EF` | Soft cream — app background |
| `--card` | `#FFFDF9` | Elevated paper — cards/modals |
| `--secondary` | `#FFE6D5` | Surface fill — accents, callouts |
| `--muted` | `#FFF6EF` | Quiet surfaces |
| `--muted-foreground` | `#5C554A` | Secondary text (6.90:1 on cream) |
| `--border` | `#1E1E14` | Ink rules (2px) |
| `--ring` | `#F4A261` | Focus ring |
| `--hard-shadow-color` | `#1E1E14` | Shadow offset ink |

Dark mode: warm near-black surfaces, peach primary.

**Contrast rule:** every text/icon-on-fill pairing ≥ 4.5:1 (WCAG AA); primary
and surfaces aim for 7:1 (AAA). Verified in ACCESSIBILITY_REPORT.md.

## Spacing — 8px grid
- Base unit: 8px. Use `space-y-4` / `p-4` / `gap-3` etc. consistently.
- Cards: `p-4`–`p-6`. Sections: `space-y-8`. Page gutters: `px-4 sm:px-6 lg:px-10`.

## Typography
- **Display/headings:** `text-h1`/`text-h2`/`text-h3` utilities (defined in
  globals.css). Strong weights, tight tracking.
- **Body:** `text-small` (14px) / `text-body` (16px).
- **Micro/eyebrow:** `text-caption` (12px), `text-eyebrow` (uppercase tracked).
- **Numeric:** `text-numeric` (tabular, mono) for stats.

## Components
- **Buttons:** 2px border, `hard-shadow-*` on interactive, translate on press.
- **Cards:** 2px ink border, `hard-shadow-sm`/`md`, `rounded-md` (10px).
- **Inputs/labels:** `Label` + `Input`/`Textarea` primitives; focus ring via `--ring`.
- **Segmented control** (view mode): pill shape, sliding active indicator,
  `aria-pressed`, disabled while pending.
- **Badges:** semantic status tones, label + icon (never color alone).
- **Alerts:** `Alert` with icon + title + description, variant colors.
- **Empty states:** `EmptyState` with icon + title + description.

## Motion
- Hard shadow "lift" on hover; `active:translate-y-px` press feedback.
- Watermark: slow random drift (15–30s), `transition-[top,left]`.
- **Reduced motion:** `motion-reduce` disables transitions.

## Responsive
- App Shell: desktop sidebar (`lg:flex`) → mobile top bar + drawer (`Sheet`).
- Grids collapse 3-col → 1-col on mobile.

## Accessibility (always)
- Semantic HTML, `aria-label` on icon-only buttons, `aria-pressed`/`aria-current`
  where appropriate, visible focus rings, label+icon status.
