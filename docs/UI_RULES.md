# UI RULES — VIBHA School of Psychology

Every new screen is checked against this before it ships. This is the authority
for the UI engineering standard. (Full engineering standard with scenario
library: see `docs/UI_UX_GUIDELINES.md` and the §22 checklist below.)

## The six bug classes and their systemic fixes

| Class | Root cause | Systemic fix |
|---|---|---|
| Text overlaps / spills out | Flex/grid children default to `min-width: auto` | `min-w-0` on the text child |
| Horizontal scroll | Unshrinkable child or fixed width | local `overflow-x-auto`, never body-level `overflow-x: hidden` |
| Buttons oddly placed | No placement model | fixed action model (below) |
| Cramped / inconsistent spacing | Arbitrary values | 8px scale only |
| Screen "feels off" | Proximity violated | related things closer than unrelated |
| Broken on first load | Empty/loading/error state never designed | all nine states |

Most UI bugs are missing constraints, not design failures. Write the
constraint once, enforce it in CI, and the class disappears permanently.

## 1. Layout

- **`min-w-0` rule:** every flex/grid child containing text gets `min-w-0`.
  Fixed-size things get `shrink-0`; the flexible text region gets `min-w-0
  flex-1`. Grid text tracks use `minmax(0, 1fr)`, never bare `1fr`. Nested
  flex needs `min-w-0` at every level. `overflow:hidden`/`ellipsis` do nothing
  without it.
- **Long unbroken strings** (emails, Hindi words, titles): `break-words`
  (`overflow-wrap: anywhere`). Never `break-all`.
- **Truncation:** single line needs `nowrap + overflow:hidden + ellipsis` on a
  bounded box; multi-line uses `line-clamp-2/3`. Never truncate critical
  information (names, due dates, risk flags, errors). Always pair with a
  `title` attribute.
- **No horizontal overflow, ever.** Local scroll containers for tables/code.
  Never `overflow-x: hidden` on body — it hides the bug and breaks `sticky`.
- **Safe areas:** fixed/sticky elements use
  `padding-bottom: max(1rem, env(safe-area-inset-bottom))`.
- **Mobile height:** `100dvh` (or `svh`), never `100vh`.
- **No layout shift:** images have explicit dimensions; skeletons match the
  final shape.

## 2. Touch targets

- Absolute floor 24×24px; mobile primary 48×48px; desktop buttons ≥40px;
  icon-only 44×44px hit area (icon 16–20px); ≥8px between adjacent targets
  (≥24px if either is under 24px).
- Focus rings outline the full clickable region, not the glyph.

## 3. Spacing — the 8px scale

- Every margin/padding/gap is a multiple of 8; the only sub-8 value is 4 (icon
  + label). No `p-3.5`, no `mt-[13px]`, no arbitrary brackets.
- Standard gaps: icon↔label 8 · within a group 8–12 · between groups 16–24 ·
  sections 32–48 · screen edge ≥16 mobile · card padding 16 mobile / 24 desktop.
- **Proximity:** related things sit closer than unrelated things. Squint test.

## 4. Buttons

- **One primary action per screen** (filled peach). Everything else outline or
  ghost. Two primaries means one is wrong.
- Placement: page action top-right of header or bottom of content flow (pick
  one per screen type); form submit bottom-right desktop / full-width bottom
  mobile; destructive separated ≥24px; card action bottom of card or whole
  card tappable — never both; modal cancel-left confirm-right (stacked mobile,
  confirm on top); mobile sticky full-width safe-area bar.
- Labels say what happens ("Submit your write-up", not "Submit").
- Never: floating mid-content buttons, nested tap targets, >3 buttons in a row
  on mobile, disabled without a reason, width-changing labels, icon-only
  destructive without a label.

## 5. Typography

- Body ≥16px (never smaller for reading); caption ≥12px metadata only; line
  heights 1.5 body / 1.1–1.25 headings; line length ≤75 chars (`max-w-prose`);
  one `h1`, no skipped levels; `clamp()` for display type only; Devanagari ≥1.6
  line height. Only the scale in globals.css. Test headings at longest
  realistic content.

## 6. States — all nine

Default · hover (desktop only, never carries info) · focus (`focus-visible`)
· active (with `haptics.ts`) · disabled (distinct + reason) · loading (skeleton
matching shape, no spinner/jump) · empty (says what to do next) · error (what
went wrong + what to do) · first-visit.

## 7. Motion

Respect `prefers-reduced-motion`. 150ms micro, 200–300ms transitions, nothing
over 400ms. Animate only `transform` and `opacity`. Looks genuinely good with
motion off.

## 8. Forms

Labels always visible above fields (never placeholder-as-label). Errors below
field, naming what to do, on blur. Correct `autocomplete`. Disable submit only
while submitting. Never clear a form on error.

## 9. Navigation

Current location marked (`aria-current`). Back always works. Bottom tab bar
mobile (max 5), sidebar desktop. Mobile menu is a full-screen sheet that traps
focus, closes on Escape and route change, restores scroll.

## 10. Cards / lists / tables / modals

- Whole card tappable on mobile or nothing in it — never both. Equal-height
  cards via grid `items-stretch`. Content slots `min-w-0` by default.
- Tables: mobile → cards or horizontal scroll with sticky first column; never
  squash; numeric right-aligned `tabular-nums`; >7 columns → hide behind detail.
- Modals: focus in on open / returns on close, focus trapped, Escape closes,
  backdrop click closes unless unsaved input, body scroll locked without shift.

## 11. Colour / icons

Only tokens in globals.css. Contrast ≥4.5:1 (3:1 large/UI). Never colour alone.
One icon library (lucide-react), every icon unique to its meaning, decorative
icons `aria-hidden`.

## 12. Mobile

Test at 320px first. Primary actions in the thumb zone. Inputs ≥16px (iOS
zooms below). No hover-only info. `-webkit-tap-highlight-color` set.

## 13. Performance

Server components by default; `next/font`, `next/image` with sizes; no video
backgrounds; CSS over JS motion; LCP < 2.5s on mid-range Android; CLS < 0.1;
JS < 200KB per student route.

## 14. Anti-patterns (never)

`div` with `onClick` · placeholder-as-label · `100vh` · body `overflow-x:hidden`
· hover-only actions · colour-only status · two primaries · nested tap targets
· fabricated data · spinner where skeleton belongs · "No data" empty state ·
auto-dismissed errors · modal-in-modal · text <16px in inputs · arbitrary
spacing · new colours · reused icons · `1fr` text track · flex text child
without `min-w-0` · truncated critical info · disabled without reason · form
clears on error · fixed element over last list item · motion without
reduced-motion fallback · focus ring smaller than target · >5 bottom tabs ·
skipped heading level.

## 15. Pre-ship checklist

- [ ] No horizontal scroll at 320px; every text flex/grid child has `min-w-0`;
      long strings wrap; tested at 320/375/390/430/768/1024/1440 + 200% zoom;
      safe areas; no layout shift
- [ ] Targets ≥24px, mobile primary ≥48px, ≥8px gaps, icon buttons 44px, no
      nested targets
- [ ] 8px scale everywhere; proximity correct; ≥16px edge padding
- [ ] One primary button; placement per the model; labels say what happens;
      destructive separated
- [ ] Body ≥16px / lh ≥1.5 / ≤75 chars; one `h1`; headings at longest content
- [ ] All nine states; focus ring on full target; skeleton matches shape
- [ ] Keyboard end-to-end; no duplicate aria-labels; contrast passes; works
      with motion off
- [ ] Perf: LCP <2.5s, CLS <0.1, JS <200KB

Enforcement: `eslint-plugin-tailwindcss` + custom rules (arbitrary spacing,
missing min-w-0, min-height on interactives), and a Playwright suite across all
breakpoints asserting no horizontal overflow, no overlapping interactive boxes,
target sizes, one `h1`, no duplicate aria-labels, contrast, with screenshots.
