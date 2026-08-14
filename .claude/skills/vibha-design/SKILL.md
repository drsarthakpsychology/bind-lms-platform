---
name: vibha-design
description: The VIBHA School of Psychology design system — "Neo-Brutalist Pastel". Use for any UI work in this repo: designing, polishing, reviewing, or extending surfaces (public front door, dashboard, tools). Encodes the token discipline, the shared primitives, the motion language, and the process (refinement preserves the world; PFD 5-layer; bounded screenshot verification; honest copy). Load before editing UI so the work lands in-system instead of re-deriving the world.
---

# VIBHA Design — Neo-Brutalist Pastel

Warm peach and terracotta on soft cream, 2px ink borders, hard zero-blur offset
shadows, tight radii. The world is deliberate and loved — a redesign request
means elevate the execution **within** it, never replace it unless the user
explicitly asks for a new world.

## The world in one line

Peach is a **fill**; terracotta is **accent text**; ink rules everything; every
surprising thing earns a hard shadow.

## Non-negotiable rules (from hard-won sessions)

1. **Peach = fill, never text-on-cream.** `--primary` (#f4a261) is a fill color:
   buttons, active states, stamps, dots. As text on cream it is only ~1.9:1 —
   **banned**. Accent text (links, eyebrows, numerals) always uses `--link`
   (terracotta #b83a00 in light / peach #f4a261 in dark), which holds ≥5.4:1.
2. **The load-bearing color is never reassigned.** Peach always signals
   *action/primary*. Do not put peach on a quiet or extractive surface — it
   reads as "greedy" (near-miss color asymmetry, PFD learning #16).
3. **2px ink borders + hard offset shadows (zero blur).** Cards, buttons,
   certificates, chips. `hard-shadow-sm/md/lg` from the token scale. Hover
   lifts `-translate-y-0.5` + a bigger hard shadow; active presses
   `translate-x/y-px` + flattened shadow.
4. **Radii:** 10px cards / 6px inputs / 999px pills. Never round a card to a
   pill, never square an input.
5. **Three type voices, each reserved.** Geist sans (body + display), Source
   Serif 4 italic (exactly one accent phrase per section — never paragraphs),
   Geist Mono (index numerals, eyebrow tags, stamp text). The discipline is
   load-bearing: loosen any one and fluency goes first.
6. **Editorial wayfinding.** Section eyebrows carry a mono index numeral
   (`01 · The method`) in `--link`, plus a small peach dot. The Landing uses
   01/02/03 across sections. Don't run two competing number sequences on one
   screen (the enquire form groups use dot-markers, not numerals, because the
   pitch already numbers its steps).
7. **Honest copy.** Never fabricate claims. Every claim on the public surfaces
   is sourced from product truth (the cases, the curriculum, the real cohort
   date). Surface the real, don't dress it up.
8. **Motion is minimal and reduced-motion-safe.** transform/opacity only.
   Controls 120–220ms (snappy); entrances 400–600ms (out-expo); the rubber
   stamp lands with the springy ease (one-shot scale 1.35→1). Gate every
   entrance behind `useReducedMotion() === false` and keep SSR visible
   (`initial={false}` when reduce is null). No loops, no particles, no custom
   cursors.
9. **WCAG AA or better, always.** Text-on-fill pairings are token-verified;
   when in doubt check the pairing (peach-on-ink 8.98:1, terracotta-on-cream
   5.4:1, muted-foreground #5c554a on cream 4.5:1).

## Tokens — where they live

- `src/app/globals.css` — the single source of truth: `:root` + `.dark`,
  Tailwind `@theme inline` mappings, `hard-shadow-*` utilities, motion tokens,
  type scale utilities (`text-eyebrow`, `text-small`, `text-caption`,
  `text-numeric`), global focus ring + reduced-motion flatten.
- `src/lib/brand.ts` — `BRAND` (name, lead, builder, cohortStart) + the
  `COHORT` deadline helpers (`cohortDeadlineText`, `hasCohortStarted`) that
  keep public date copy honest after the cohort start date passes.

## Shared primitives — reuse, don't re-invent

`src/components/landing/landing-primitives.tsx` (client):
- **`Rule`** — the closed measure: a 2px ink line ending in a peach square.
  Use to close sections and certificates.
- **`Stamp`** — the rotated rubber stamp: peach fill, ink text, double-ring
  outline, lands once via the springy stamp-in. Marks invitation and thesis.
- **`SectionEyebrow`** — `index + dot + label`. The editorial wayfinding mark.

Consume these everywhere public surfaces need them. New primitives belong in
this file (or a sibling), not copy-pasted per page.

## Reference surfaces

- Landing: `src/components/landing/landing-page.tsx` — poster hero (two-line
  headline broken at the comma, mobile-space `<span>` + responsive `<br>`),
  intake-file right column (pad sheet, tape, fragments, PRACTISE stamp),
  Problem/Method/Who/CTA sections with indexed eyebrows, certificate CTA.
- /enquire: `src/app/enquire/` — two-column (sticky pitch + application
  sheet), grouped fields with dot-markers + sr-only legends, honest success
  state.
- Nav: `src/components/landing/landing-nav.tsx` — full-screen mobile sheet
  (focus-trapped, scroll-locked, Escape-close).

## Process

1. **Brief wins.** Honor the pinned world even when your taste leans elsewhere.
   Redesign keeps product truth but treats the old look as evidence; a narrow
   refinement keeps everything and elevates the execution.
2. **Audit first.** Read the incumbent tokens + at least one representative
   surface before editing. If a design decision could go two ways, pick the
   cheaper-to-reverse, log it in NIGHT_LOG.md, continue — do not stall.
3. **PFD 5-layer discipline** (see the `perception-first-design` skill):
   walk Cognitive Load → First Impression → Fluency → Bias → Decision. Peach
   must never be reassigned; no iso-styled competing CTAs; the honest copy and
   the visual quality must agree (a gap is the trust killer).
4. **Verify in bounded screenshot rounds, not a loop.** Build fully, then one
   batched Playwright round (desktop + mobile × light + dark at 2x), fix
   everything it shows in one batch, confirm with at most one more round, stop.
   Measure line-breaks and alignment programmatically instead of trusting a
   screenshot. Reduced-motion users must render in place.
5. **Gate before commit:** `npm run lint && npx tsc --noEmit && npm run test &&
   npm run build` green.

## Grounding in current design practice (2026)

This world is not a throwback — it sits inside live movements. Keep it there:

- **Editorial neo-brutalism / craft-forward** is a current trend, not a retro
  nod: big display type, hard borders, tactile states, deliberate imperfection,
  and honesty over polish. The 2px ink + hard-shadow + stamp language is exactly
  this. Lean into the editorial gestures (indexed sections, poster headlines,
  certificate CTAs) rather than flattening toward generic SaaS.
- **Perceptual color discipline** — color structure is hardware, meaning is
  software (Bujack 2022; Brainard 2022). New tokens are defined in perceptual
  space (OKLCH), never interpolated in hex. Keep ≤4 core roles; a single card
  carries ≤3 reserved-meaning colors.
- **Reduced-motion-first** — motion is an enhancement layered on a
  fully-readable no-motion state, gated per-component behind
  `useReducedMotion() === false`. The no-JS/server render is always visible.
- **Accessibility is design, not a check** — WCAG 2.2 target sizes (≥24px,
  ≥44px for primary), visible focus everywhere, contrast baked into tokens,
  semantic structure (`<fieldset><legend>`, real labels, `aria-hidden` on
  decoration). Screen-reader group names and states are part of the craft.
- **Calm, honest, AI-era-authentic** — restraint in options, real deadlines
  surfaced not manufactured, no fake imagery or inflated claims. The visual
  quality and the copy must agree; the gap is the trust killer (Seckler 2015).
- **Performance is brand** — CSS-first (Tailwind v4 tokens), self-hosted
  fonts, zero heavy runtime, bounded motion. A fast, 82/82-buildable page is
  part of the first impression (Lighthouse ≈ felt fluency, but not identical).

## Reference

- Token reference (exact values, dark mode, motion): see
  `references/tokens.md` in this skill.
- Motion posture (reduced-motion-first, the language, the stamp-in): see
  `references/motion.md` in this skill.
