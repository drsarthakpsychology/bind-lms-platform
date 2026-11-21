---
paths:
  - "src/app/**/*.{tsx,css}"
  - "src/components/**/*.{tsx,css}"
  - "apps/mobile/src/**/*.tsx"
---

# Design precedence

1. The VIBHA identity and the `vibha-design` skill decide the look (palette,
   fonts, tokens, primitives). New screens follow
   `docs/design/DESIGN_SYSTEM_2026_11.md`. App motion: `apps/mobile/docs/MOTION.md`.
2. `emil-design-eng`, `fable-forge` and `fable-design-system` are references,
   used together for craft (states, polish, honest copy, render evidence).
   `animate-expo` is the reference for app motion. When they disagree with
   step 1, step 1 wins.
3. Light and dark, accessible (contrast, focus, Reduce Motion), 320 to 1440px.
   Web layout check: `node e2e/layout-defects.mjs`.
