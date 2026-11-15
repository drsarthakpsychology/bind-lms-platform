# Design system v2 (November 2026)

Branch `agent/dsys`. Phase 1 of the approved redesign plan: the foundation, the
`ui_v2` switch, the five-place navigation, and the new Home. For every design
agent that follows (Learn screens, Practise and Library, Admin).

Owner's rule: **one screen, one primary purpose, one clear focus.** Premium
native-app feel on phones. Desktop stays good. Nothing that works may break.

## 1. Principles, made concrete

1. **Plain by default.** A screen is type on the page. Group with whitespace, a
   heading, and hairlines. A border or a fill needs a reason (see section 4).
2. **One focal point.** At most one `Hero` per screen, and it is the only lime
   on the screen apart from progress. Everything else is quieter than it.
3. **Type is a system.** Eight sizes, fixed line heights and weights (section
   2). No size under 12px. No reading line over 75 characters.
4. **Eight spacing steps.** 4, 8, 12, 16, 24, 32, 48, 64. Nothing in between.
5. **Lime means do or done.** Lime is for the primary button and progress.
   Blue is the brand and the current place (active tab, links). Ink is text.
6. **Hard shadows are rare.** Only the hero button and primary buttons.
   Borders are 1 to 1.5px everywhere else.
7. **Rows before cards.** A list of things to open is a `RowList`. A `Card` is
   for one object tapped as a whole (a game, a case, a certificate).
8. **Detail goes in a sheet.** Secondary detail (today's quests) opens in a
   bottom sheet from one line, so the screen keeps its focus.
9. **Never cut text.** Titles wrap. If something must be shortened, it needs a
   `title` so the rest can be read.
10. **Touch first.** Targets 44px or more (48 to 52 for the primary action),
    8px apart, primary action low on phones.

## 2. Type scale

Archivo for everything. The pixel font is only for scores and timers in games.
Utilities live in `src/app/globals.css` (section "DESIGN SYSTEM V2").

| class | phone | from 768px | weight | notes |
|---|---|---|---|---|
| `type-display` | 34/38 | 48/52 | 800 | tracking -2%. The hero title. |
| `type-h1` | 28/34 | 36/42 | 750 | One per screen. |
| `type-h2` | 22/28 | 26/32 | 700 | tracking -1% |
| `type-h3` | 18/24 | 20/26 | 650 | Section headings. |
| `type-body` | 16/25 | 17/27 | 420 | |
| `type-reading` | 17/28, 65ch | 18/30, 68ch | 420 | Long reading text. |
| `type-small` | 14/20 | same | 500 | Quiet lines, meta. |
| `type-caption` | 12/16 | same | 600 | tracking +2%. Never smaller. |
| `type-num` | | | | Tabular numbers for counts and times. |

The old utilities (`text-display`, `text-h1` ... `text-eyebrow`) still exist for
screens that have not moved. Do not use them in v2 screens. `text-eyebrow` is
10.6px and is the largest single source of "tiny text" defects.

## 3. Spacing, surfaces and motion tokens

| token | value | use |
|---|---|---|
| `--ds-1` ... `--ds-8` | 4, 8, 12, 16, 24, 32, 48, 64px | the only spacing steps |
| `--ds-gutter` | 20px phone, 32px from 768px | page side margin |
| `--ds-section` | 32px phone, 48px from 768px | gap between sections |
| `--ds-hairline` | ink at 12% | lines between rows |
| `--ds-tint` | ink at 4% on paper | soft fill, hover wash |
| `--ds-card-line` | ink at 22% | the thin card outline (1.5px) |
| `--ds-radius` | 12px | cards, the hero button |
| `--ds-press` | 120ms | press feedback |
| `--ds-state` | 180ms | hover, state change |
| `--ds-sheet-in` / `--ds-sheet-out` | 300 / 200ms | bottom sheets |
| `--ds-page` | 200ms | page cross-fade (`.ds-page`) |
| `--ds-fill` | 600ms | progress fill |
| `--ds-ease`, `--ds-ease-out` | | state changes, entrances |

Rows are at least 56px tall. Reduced motion: every transition and the page
fade switch off (global rule plus `motion-reduce`).

## 4. The parts (`src/components/ds`)

| part | what it is | use it for | do not use it for |
|---|---|---|---|
| `PageFrame` | page width, section gap, optional H1, 200ms fade | every v2 screen | |
| `Section` | heading + content, no border, no fill | grouping anything | |
| `RowList` + `Row` | rows with a 1px hairline; a row can be a link with a chevron | lists, menus, settings, "up next" | rows with two buttons |
| `Tint` | soft fill, no border | a small group that must read as one thing | whole sections |
| `Card` | 1.5px outline, 12px corners, no shadow | one object tapped as a whole: a game, a case, a certificate | grouping text |
| `Hero` + `HeroButton` | big title, thin progress line, one lime button with the hard shadow | the one thing to do; max one per screen | secondary actions |
| `Stat` | number + label, inline | a row of numbers, no boxes | |
| `SheetRow` (`ds/sheet`) | a row that opens a bottom sheet | detail that would crowd the screen | |
| `HubGroups` (`ds/hub`) | groups of rows from `v2-config` | the Learn, Practise and Me hubs | |

All are server components except `SheetRow`. The old `ui/card`, `PageHeader`,
`StatCard`, `MobilePage`, `MobileSection`, `MobileCard` stay for old screens and
are removed in phase 5. `ThumbBar`, bottom sheets, the verdict band,
`ChoiceCard`, reactions, `OnceHint`, How to play, the sketch kit and the video
player are kept as they are.

`GameFrame` from the plan is not built yet; it belongs with the Practise agent,
who knows the game shells.

## 5. Page patterns

- **Home / dashboard:** greeting line, one `Hero`, then one or two `Section`s
  of rows. Phones: one column, fits one screen. From 768px: hero on the left
  two thirds, rows in a narrow right column.
- **Hub (Learn, Practise, Me):** `PageFrame` title, then `Section` + `RowList`
  per group. No descriptions unless a row needs one.
- **Library / list:** search first, one row of filter chips, then a `RowList`
  (name, one quiet line, one value on the right). Every item visible.
- **Editorial reading:** `PageFrame width="reading"`, `type-reading`, toolbar in
  one row, section list in a sheet on phones.
- **Table:** `PageFrame width="wide"`; a real table from 768px, rows that open a
  detail on phones.
- **Split / detail:** list on the left, detail on the right from 1024px; on
  phones the list, then the detail as its own screen.
- **Game frame:** one frame for every tool (Back row, How to play, the play
  area, ThumbBar). To be built by the Practise agent as `GameFrame`.

## 6. Motion and feedback

- Press: 120ms, the element moves 1 to 2px or scales to 0.99.
- Hover and state: 180ms; rows get the tint wash, the chevron moves 2px.
- Sheets: 300ms in, 200ms out, drag to close on touch.
- Page change: 200ms cross-fade.
- Progress: fills over 600ms with `transform: scaleX`.
- Focus: 2px ring (blue in light, lime in dark), always visible.
- Loading: a skeleton in the real shape of the screen, no borders.
- Only transform and opacity animate. Nothing loops.

## 7. The switch (`ui_v2`)

`src/lib/ui/v2.ts`, `uiV2For(flags, role)`, one helper used by the layout, Home
and the hub screens.

| `feature_flags` row `ui_v2` | who sees the new design |
|---|---|
| no row, or "live" | admins only (also when they "view as student") |
| "unlocked" | everyone |
| "off" | nobody |

SQL to turn it on for all: `supabase/migrations_pending/2026_11_14_ui_v2_flag.sql`.
It also shows in Admin, What's live, under "Design" once the row exists.
Server pages: `loadNavAccess()` in `src/lib/ui/access.ts` returns `v2` and what
the account may open. With v2 off, students see exactly the old screens.

## 8. Navigation (v2)

Data: `src/components/navigation/v2-config.ts`.

- Phone tabs: Home, Learn (`/learn`), Practise (`/practise`), Library
  (`/practice/medicines`), Me (`/me`). No More drawer.
- Lecture-only accounts: Home, Lectures, Doubts, Me.
- Admin tabs: unchanged.
- Top bar on phones: logo, search, bell. The account is the Me tab.
- Desktop sidebar: Home, then Learn, Practise, Library, Me as headings with
  their screens under them; quiet (no borders or shadows, soft fill on the
  current place).
- Every old address still works. Feature switches, the Study lock, per-student
  blocks and lecture-only scope apply to tabs, sidebar and hub rows.
- To add a screen to a hub, add a row to `LEARN_GROUPS`, `PRACTISE_GROUPS` or
  `ME_GROUPS`, and its path to the matching `*_MATCH` list.

## 9. Before and after

| | before | v2 |
|---|---|---|
| Home | boxed header, lime Continue card, boxed goal card with quests, two topic lists with two buttons per row, help line | greeting line, one hero, Today line (quests in a sheet), up to three rows |
| Home borders and shadows on a phone | 2px borders on every block, 2 hard shadows | hairlines only; one hard shadow (the button) |
| Phone navigation | 4 tabs + More drawer + account sheet | 5 tabs; Me is a screen |
| Top bar on phones | logo, search, bell, avatar (cut off at 320px) | logo, search, bell |
| Logo sub-line | 9px pixel type | 12px caption |
| Sidebar | 2px borders, hard shadow, blue filled current item | hairline edge, soft fill on the current item |
| Layout defects on Home, Me, Learn, Practise | Home: 54 across widths and themes | 0 at 320, 360, 390, 412, 768, 1024, 1440, light and dark |

## 10. What the audit found

Full list: [LAYOUT_DEFECTS_2026_11.md](LAYOUT_DEFECTS_2026_11.md). 13,832
defects on 114 screens before the redesign. Top root causes, by share:

1. **Tap targets under 44px (4,698).** Mostly chip rows built by hand:
   `src/app/(dashboard)/practice/formulation/page.tsx:74` (3,248 on its own),
   footer links with `min-h-8` (`src/components/site/site-footer.tsx:38`).
2. **Text under 12px (5,928).** `text-eyebrow` is 10.6px
   (`src/app/globals.css`, `@utility text-eyebrow`, used in 83 files); the top
   bar logo sub-line is 9px and the search hint 11.2px
   (`src/components/navigation/top-bar.tsx:90, 109`); about 50 one-off sizes
   like `text-[0.6rem]`; the public home's own small labels
   (`src/components/home/home.module.css`).
3. **Cut text with no way to read it (2,334).** `line-clamp-2` summaries in
   `src/components/reference/reference-library.tsx:51`, `truncate` in the study
   shelves (`src/components/study/course.tsx`), brand lists on the medicine
   list.
4. **Clipped text (1,036).** Public home stickers and journey cards cut by
   `overflow: hidden` sections; the skills grid in
   `src/app/(dashboard)/study/map/page.tsx:197` (fixed `min-h-11` cells).
5. **Overlapping text (262).** The same skills grid, and note cards.
6. **Sideways scroll (4), overflow (10), long lines (36).** Small; admin tables.

Shared habits behind the "boxes everywhere" look: `border-2` appears 1,684
times in 335 files, `hard-shadow-*` 420 times in 162 files. `PageHeader` is used
in 48 files, `Button` in 63, `EmptyState` in 19, `Badge` in 15, `StatusPill` in
10, `ui/card` in 5 (most cards are hand-written class strings, which is why
they drift).

## 11. References studied

Principles taken, nothing copied. Captured dates are the tools' own.

- Screenrove `twos-today-empty` (Twos, 2026-10-22): a today screen that is a
  date line and one list.
- Screenrove `codecademy-product-skills` (Codecademy, 2026-10-22): the
  continue item leads the page.
- Screenrove `hevy-product-settings` and `hevy-settings-private` (Hevy,
  2026-10-22): account as grouped rows with quiet group labels.
- Screenrove `habitify-product-settings`, `medium-product-settings`
  (2026-10-22): settings as rows, no cards.
- Made Good Designs `8f08269e2f80` (app home, today), `3987c7f67833` (daily
  checklist home), `5f133f9eb9cd` (learning dashboard, mobile): greeting, one
  next action, streak inline. UI by Made Good Designs, madegooddesigns.com.
- Earlier passes in this folder: `REFERENCE_LIBRARY_2026_11.md` (Lazyweb:
  Duolingo, Elevate, Apple Journal home), `MOBILE_UX_RESEARCH_2026_11.md`,
  `DESIGN_PASS_2026_11_learn.md`. Lazyweb was not queried again in this pass.

## 12. For the next agents

- Build v2 screens next to the old ones and branch on `uiV2For` (or
  `loadNavAccess().v2`) in the page. Do not edit old shared components to get
  the new look.
- Use only `type-*` classes and `--ds-*` tokens in v2 screens.
- Check every screen with
  `node e2e/layout-defects.mjs` (see [README_LAYOUT_DEFECTS.md](README_LAYOUT_DEFECTS.md)):
  zero defects at 320, 360, 390, 412, 768, 1024, 1440, light and dark.
- Progress already has the strongest and weakest topics; v2 Home no longer
  shows them. WhatsApp help is on Me.
- Not done here: `GameFrame`, the route-level `loading.tsx` for Home still has
  the old shape for the first moment (the v2 skeleton shows after the session
  check), and the desktop Me screen is the same single column as the phone.

## 13. Brand accents (15 November)

The owner's words: keep the minimal structure and the simple way it works, and
bring back a little of the old VIBHA character so it does not feel bare. These
are the only accents. Each is small, each has one job, and none of them puts a
box around text. One screen, one purpose stays the rule.

| accent | what it is | where | limit |
|---|---|---|---|
| `ds-stroke` | a short lime stroke under a heading | the page H1 (`PageFrame` and `ListHead` do it for you), a medicine's name | one per screen: the H1 |
| `type-pix`, `Pix` | the pixel font at 12px, blue (lime in dark) | a tiny label above a title ("LIBRARY", a medicine's class), section numerals ("01"), table column names | a word or two, or a number; never a sentence, never under 12px |
| `Section n` | a blue pixel numeral before a section heading (01, 02) | hub groups (Learn, Practise, Me), a medicine's sections and its index | only where sections run in order; one number sequence per screen |
| Hero context | the short line above the Hero title ("Continue watching") in the pixel voice | Home and every Hero | 28 characters or fewer, else it stays plain |
| `ds-band` | a soft blue wash behind a page header, no border | hub pages (Learn, Practise, Me), the medicine library, a medicine | the header only, one per screen |
| `IconTile` | the old lime icon tile (1.5px ink outline, no shadow) | at the right of a banded header | one per screen |
| `ds-spine` + `--spine` | a 4px colour line at the left edge | a medicine's family, on its row and its page header; the same colour is the dot on the family's filter chip | colour never carries meaning alone: the family's name is always written |
| family colours | `--med-antidepressants`, `--med-antipsychotics`, `--med-mood`, `--med-anxiety`, `--med-other`, `--med-side` (`lib/meds/colors.ts`) | spines and dots only | never the colour of text |
| the cat (`Chai`) | the pixel study cat, 56 to 64px | empty states (`EmptyLine art`), "nothing found" | one per screen, never beside the Hero |
| hard shadow | unchanged | the one primary action (Hero button, primary button) | one per screen |
| hover lift | a tappable `Card` rises 2px; a spine widens | cards and medicine rows | off with reduced motion |

Not coming back: 2px boxes around sections, shadows on cards, a border around
every list item, pill badges on every row.

Checked the same way as everything else: the layout detector at zero and axe
with no serious issues. The pixel label in blue on the blue wash is 6.2:1 in
light; in dark it is lime on the darker wash.

## 14. Motion (16 November)

The owner asked for a site that feels as fluid as a top app while staying
minimal. All of it is built into the shared parts, so a v2 screen gets it by
using them. Only transform and opacity move (plus one typed counter). Nothing
loops. Code: `src/components/ds/motion.tsx`; CSS: `src/app/globals.css`,
"DS MOTION".

| moment | what happens | where it comes from |
|---|---|---|
| page change | old page fades out (120ms), new page rises 6px and fades in (220ms). Rows, cards and the hero button tag the move "forward" (new page comes from the right, 16px); `BackLink` tags it "back" (the other way). Tabs and the sidebar get the plain fade. | `PageFrame` wraps its page in `PageMotion` (React `<ViewTransition>`, View Transitions API). Browsers without it keep the old 200ms CSS fade. |
| loading | the skeleton shows only if loading takes longer than 120ms, then fades out as the page rises in | `LoadingV2` (`SkeletonMotion`, `.ds-skel`) |
| lists | the first 8 rows rise 6px into place, 25ms apart (under 0.45s in all) | `RowList` (`data-ds-list`) |
| progress | the line fills from empty when it first paints (600ms), then moves with a transition | `ProgressLine`, `Hero` (`.ds-fill`) |
| numbers | whole numbers up to 9999 (and "72%") count up from 0 once (700ms). The real digits stay in the page, see-through, so the width never shifts and screen readers read the number. | `StatItem`, `Stat` (`CountUp`) |
| press | rows dip to 0.985, quiet buttons, chips, tabs and choices to 0.97 (120ms). The lime button keeps its sideways press into its shadow. | `.ds-press` on the ds class sets |
| sheets | iOS sheet curve up (300ms), short ease-in down (200ms); dragging follows the finger, a flick faster than 0.4px/ms closes it, a pull upward meets soft resistance | `MobileBottomSheet` |
| dialogs | from 0.96 with a strong ease-out, out to 0.98 in 150ms | `ui/dialog` |
| success | a "done" band lands with a small spring; `SuccessMark` is a lime disc whose tick draws itself | `.ds-success`, `SuccessMark` (first used on the checkpoint end) |
| focus | the 2px ring, never animated; `outline-hidden` keeps it visible in forced colours | all ds parts |

Rules: arriving is ease-out, leaving is a shorter ease-in. Under 300ms for
controls. Never from scale 0. With reduced motion, page changes become a short
fade and lists, fills, counts and the tick are simply there.

A Tailwind 4 note for everyone: `-translate-y-0.5` and friends set the
`translate` property, not `transform`, so `transition-[transform,...]` does
not animate them. Use `transition-[translate,...]` (or `transition-transform`,
which covers both). The ds parts are fixed; about 56 other files still use the
old form.

References: Screenrove motion guidelines and entries `interior-skeleton-swap`
(show-delay so fast loads never flash), `interior-modal` (0.96 enter, faster
0.98 exit), `interior-press-depth` (press feedback), `vaul-drawer` (sheet curve,
flick threshold, upward resistance); the Next.js view transitions guide
(`node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`); Chrome's
modern-web-guidance `same-document-transitions`, `motion`,
`natural-interactions`; Lazyweb Duolingo "lesson complete" (flow 2069, step
13, captured 2026-02-20) for the success landing. Mobbin needs a paid plan and
was not used.
