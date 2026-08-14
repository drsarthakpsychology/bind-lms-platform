# VIBHA tokens — exact values (source: `src/app/globals.css`)

The single source of truth is `src/app/globals.css`. This file is the
reference copy for design decisions; if the two ever disagree, the CSS wins.

## Color — light (`:root`)

| Role | Hex | Use |
|---|---|---|
| `--background` | `#fff6ef` | soft cream page |
| `--foreground` | `#1e1e14` | warm ink text/rules |
| `--card` | `#fffdf9` | elevated paper |
| `--primary` | `#f4a261` | peach — **fills only** (buttons, active, stamps) |
| `--primary-foreground` | `#1e1e14` | ink on peach (8.98:1) |
| `--secondary` | `#ffe6d5` | soft peach surface (WhoBuilds band) |
| `--muted-foreground` | `#5c554a` | body text on cream (4.5:1) |
| `--accent` | `#ffe6d5` | peach wash (featured step) |
| `--link` | `#b83a00` | terracotta — **accent text** (5.4:1 on cream) |
| `--border` / `--input` | `#1e1e14` | 2px ink rules |
| `--ring` | `#f4a261` | focus ring |
| `--hard-shadow-color` | `#1e1e14` | offset shadow ink |

## Color — dark (`.dark`)

`--background #1a1610`, `--foreground #f5f0e8`, `--card #241f17`,
`--primary #f4a261` (peach is bright on dark, ~8.7:1), `--link #f4a261`
(peach **is** the accent text on dark — the polarity flips), `--border
#4a4234`, `--hard-shadow-color #000000`.

**The polarity rule:** on cream, peach-as-text is banned (1.9:1) — use
terracotta. On dark, peach reads fine as text — keep it. `--link` handles the
flip automatically; never hardcode a single accent color across themes.

## Perceptual color (latest practice)

Hex values are authored directly; **do not interpolate hex linearly** for
gradients, scales, or hover tints. Color perception is non-additive (Bujack et
al. 2022; PFD learning #16): a small deviation in perceptual space costs more
than a large departure. When adding new colors:

- Define them in perceptual space (OKLCH) and convert to the hex token.
- Keep the count tight — 4 core roles max plus the semantic status set.
- Reserve meaning: a single card must not carry more than ~3 reserved-meaning
  colors or the System-1 read collapses to "loud".

## Type

- **Geist** sans — body, display, UI.
- **Source Serif 4** — italic accents only, one phrase per section max.
- **Geist Mono** — index numerals, eyebrow tags, stamp text, `text-numeric`.

Scale utilities: `text-display` / `text-h1..h3` / `text-body` /
`text-small` (0.875rem) / `text-caption` (0.75rem) / `text-eyebrow`
(0.75rem, 600, 0.08em tracking, uppercase).

**Fluid type:** use `clamp()` for headline scale instead of fixed breakpoint
steps where the type needs to breathe (the type-scale utilities already do
this). Headlines use tight leading (1.06–1.15) and `tracking-tight`.

## Radii

`--radius` 10px cards · `--radius-input` 6px controls · `--radius-pill` 999px.
Tokens: `rounded-sm 4px`, `rounded-md 6px`, `rounded-lg 10px`, `rounded-xl 14px`.

## Shadows (zero blur — the signature)

`hard-shadow-xs` 2px · `sm` 3px · `md` 4px · `lg` 6px offset.
`hard-shadow-flat` 1px 1px (pressed state). All use `--hard-shadow-color`.

## Interaction sizing (WCAG 2.2)

Interactive targets ≥ 24px; primary actions ≥ 44px (`size-9`=36px buttons are
the floor, `size-lg` for primary CTAs). Visible focus ring on every focusable
(`--ring` peach, 3px ring at 60% + 2px outline), never `outline: none` alone.
