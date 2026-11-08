# Impeccable audit, November 2026

Owner request: "There's a lot of overlap and these kinds of UI/UX differences and
problems. These should actually be fixed." The owner asked for the impeccable
commands in this order: **audit, layout, typeset, harden, adapt, polish**. This
file is the audit. Each later command fixes the findings tagged with its name
and lands as its own commit.

World kept: the committed Neo-Brutalist Pastel look (`vibha-design` skill,
tokens in `src/app/globals.css`). This is refinement, not a redesign. No
content, scoring or data logic changes, except removing the instruction lines
the owner asked to remove (finding P-3).

## How it was checked

- `npx impeccable detect src` (offline, regex rules). Before: 8 anti-patterns,
  25 advisories.
- The live site and Supabase cannot be reached from the build machine, so every
  page was rendered from the real components in a static harness (esbuild,
  stubbed session, empty database, real shell) and photographed with Playwright
  at 390, 768, 1024, 1280 and 1536 px. Each shot was also measured in the
  browser: page width against the viewport, elements past the screen edge, text
  cut off inside its box, and every fixed and sticky element with its z-index.
- Pages covered: shell and navigation, Home, Study (home, module, reader, map,
  notes, a 3D scene), Lectures, Medicines, Exam Prep (home, subject, question
  runner, mocks, a mock, long answers), Practice, Games (home, Blitz), More
  (Progress, Doubts, Achievements, Leaderboard, Journal, My journey), the More
  drawer, the search palette, Admin home and Login.
- The impeccable skill in this repo carries only `SKILL.md`; its per-command
  reference files and `scripts/` are not in the repo and impeccable.style cannot
  be reached. Each command was run from its one-line definition in `SKILL.md`
  plus the `vibha-design` rules and `docs/design/DECISION_FRAMEWORK.md`.

Measured result before any fix: no page scrolls sideways at any of the five
widths. The overlap and inconsistency problems are below.

## Severity scale

- **P0** content hidden or unusable.
- **P1** visible overlap, layering or layout break on a common screen.
- **P2** inconsistency a student notices between sections.
- **P3** polish and detector findings.

## P0

None found after the sidebar fix already on `main` (57daa42: opening the
folded sidebar on hover now pushes the page aside instead of covering the
Study reader's contents panel).

## P1: overlap and layering

| ID | Finding | Where | Fixed by |
|---|---|---|---|
| L-1 | **Mock exam bar slides under the top bar.** The question bar is `sticky top-0 z-20`; from 768 px the top bar is sticky too (`z-40`), so the timer and question numbers scroll underneath it. | `src/app/(dashboard)/prep/mock/exam.tsx:285` | layout |
| L-2 | **Lecture week chips slide under the top bar on tablets** (768 to 1023): `top-0` there, `lg:top-16` only from 1024, and 64 px is wrong on short laptops where the bar is 56 px. | `src/components/course/week-chips.tsx:28` | layout |
| L-3 | **Quick Reference letter bar slides under the top bar** from 768 px (`sticky top-0`). | `src/components/reference/reference-library.tsx:171` | layout |
| L-4 | **Medicine page sticky bar floats 56 px down on phones.** `top-14` assumes a sticky top bar, but on phones the top bar scrolls away, so page text shows through the gap above the bar. | `src/components/meds/medicine-view.tsx:67` | layout |
| L-5 | **Admin sticky bars use a fixed 64 px** (`top-16`) while the top bar is 56 px on tablets and short laptops: an 8 px gap with content showing through. | `admin/access/access-manager.tsx:114`, `admin/students/student-table.tsx:201`, `admin/emails/failed-list.tsx:108` | layout |
| L-6 | **Anchors land under the sticky top bar.** No `scroll-margin-top` anywhere except two hand-set `scroll-mt-24`; links such as `/study/<module>#steps` and the reader's part jumps put the heading under the 56 to 64 px bar. | `src/app/globals.css` (base), `src/components/study/reader.tsx:229,286` | layout |
| L-7 | **Toasts cover the phone bottom bar.** Sonner sits 16 px from the bottom on phones; the bottom tab bar is 66 px tall plus the safe area, so a toast covers Home/Study/Lectures. | `src/components/ui/sonner.tsx` | adapt |
| L-8 | **Practice keyboard hint covers the phone bottom bar** (`fixed bottom-4 z-50`). | `src/components/practice/keyboard-nav.tsx:52` | adapt |
| L-9 | **No written z-index scale.** Values in use: 10, 20, 30, 40, 50, 60, 100 and arbitrary 5 to 8, chosen per file. The working order is: in-page sticky 20, sidebar 30, top bar and bottom bars 40, overlays 50, first-login form 100. | many | layout (documented in globals.css) |
| L-10 | **Full-height play screens always scroll by about 36 px.** `min-h-[calc(100dvh-4rem)]` ignores the shell's top bar and padding. | `src/components/learn/player.tsx:157,461`, `coach.tsx:142`, `clinic-games.tsx:94` | layout |

## P2: differences between sections

| ID | Finding | Where | Fixed by |
|---|---|---|---|
| C-1 | **Double page gutters.** The shell already pads every page (`px-4 sm:px-6 lg:px-10`, `py-6 lg:py-8`). About 90 page wrappers pad again, so Exam Prep, Medicines, Games, Notes, Map, Doubts, Journal, Leaderboard, My journey, every Practice tool and every game lose 32 px of width on a phone and start 24 to 40 px lower than Home, Study and Practice. | `prep/ui.tsx:38` (PrepFrame), `practice/medicines/page.tsx:12`, `components/learn/learn-home.tsx:100`, `study/map/page.tsx:33`, `study/notes/page.tsx:28`, `doubts/page.tsx`, `reflect/page.tsx`, `leaderboard/page.tsx`, `journey/page.tsx`, `games/*`, `practice/*`, `components/learn/*`, `components/lab/*`, `components/casebook/*` | layout |
| C-2 | **Page widths and alignment differ**, so the title jumps when switching sections: Home and Lectures have no max width, Study/Practice/Games/Medicines use 1024 px centred, Exam Prep a 672 px centred column, Map 1152 px, More pages 768 to 896 px. | the same files | layout |
| C-3 | **Card radius has four values for one role** (10, 14, 16 and 24 px). `rounded-md` 848, `rounded-2xl` 272, `rounded-xl` 222, `rounded-3xl` 45 on bordered boxes. The rule is 14 px for cards, 10 px for controls, pills for status. The reader contents panel is 24 px, Exam Prep cards are 10 px. | `globals.css` radius tokens, `study/reader.tsx:215,240`, `prep/ui.tsx:41,73`, `prep/page.tsx` | layout |
| C-4 | **Seven page header patterns.** Home: eyebrow + title. Study: title + line. Practice: eyebrow + title. Lectures: `PageHeader`. Medicines: back link + eyebrow "Practice · Medicines" + two-line lede. Exam Prep: `ToolHeader` + exam list. Games and Notes: mascot + title. Journal: title + line, no eyebrow. One shared `PageHeader` exists and two pages use it. | `dashboard/home-view.tsx:225`, `components/study/course.tsx:83`, `components/practice/practice-hub.tsx:205`, `practice/medicines/page.tsx:16`, `prep/ui.tsx:20`, `components/learn/learn-home.tsx:101`, `reflect/journal-view.tsx` | typeset |
| C-5 | **Medicines still says it lives inside Practice** ("Practice · Medicines" eyebrow and a "Back to Practice" pill) although Medicines is its own menu item and its own section (`navigation/sections.ts`). | `practice/medicines/page.tsx:13-16` | typeset |
| C-6 | **Four Back-link styles**: bordered 10 px rectangle (`BackPill`, Study module), blue text link (`BackToPrep`, Study map), bordered pill (Medicines, Notes, Quiz path), plain text. | `components/study/back.tsx`, `prep/ui.tsx:11`, `practice/medicines/page.tsx:13`, `components/learn/learn-home.tsx:134` and others | harden |
| C-7 | **Three segmented-control styles.** Exam Prep subject tabs (10 px box, ink selected), `SegmentedControl` (pill, lime selected), Student/Clinician toggle (pill, lime for one option and ink for the other, 28 px tall next to 44 px buttons). | `prep/long-ui.tsx:25`, `components/ui/segmented-control.tsx`, `components/learn/view-toggle.tsx:46` | harden |
| C-8 | **Empty states drawn three ways**: the `EmptyState` primitive, dashed boxes with one line ("Nothing to fix yet."), and plain grey text ("Nothing here yet."). | `design-system/empty-state.tsx`, `study/map/page.tsx`, `reflect/journal-view.tsx`, `prep/page.tsx:79` | harden |
| C-9 | **Headline sizes outside the scale**: the reader title (`text-[1.85rem]`), the module hero (`text-3xl sm:text-5xl`) and the reader eyebrow (hand-made `text-xs uppercase` instead of `text-eyebrow`). 51 hand-made uppercase labels on the student side. | `components/study/reader.tsx:246,250`, `components/study/course.tsx:215,218` | typeset |
| C-10 | **Games page sits on a grey dotted panel** of its own (`.texture`), unlike every other section. | `components/learn/learn-home.tsx:100`, `learn.module.css:219` | polish |

## P2: phones and tablets

| ID | Finding | Where | Fixed by |
|---|---|---|---|
| A-1 | **Reader toolbar wraps at 390 and 768**: "My note" drops to its own row under Student/Clinician and Bookmark. | `components/study/marks.tsx`, `components/learn/view-toggle.tsx` | adapt |
| A-2 | **League names cut to "Syna..."** in the leaderboard league strip at 390. | `src/app/(dashboard)/leaderboard/page.tsx:104` (TierLadder) | harden |
| A-3 | **Student/Clinician toggle is 28 px tall** on touch screens (floor is 44 px for touch). | `components/learn/view-toggle.tsx` | adapt |

## P3: detector findings and polish

| ID | Finding | Where | Fixed by |
|---|---|---|---|
| D-1 | **Bounce and elastic easings** (overshooting cubic-beziers, `animate-bounce`, wobble). `vibha-design` keeps exactly one: the springy ease for the rubber **stamp** landing. Everything else is out. | `globals.css:254` (token stays for the stamp), `games/duel/duel.module.css:37`, `components/home/home.module.css:345,981,3892`, `components/learn/learn.module.css:10,97,139,181`, `components/learn/notes.module.css:83`, `components/sim/chat-message.tsx:39`, `components/study/scenes/genogram.tsx:264`, `lib/games/ui/fx.module.css:13-93`, `lib/games-sims/ui/games2.module.css:8-44`, `globals.css:945` (wave-bounce is a voice level meter, not an easing: renamed) | polish |
| D-2 | **Decorative grid background** behind the public home section. | `components/home/home.module.css:153` | polish |
| D-3 | **Thick one-side borders** on cards (`border-l-4`). | `notifications/[id]/page.tsx:46`, `components/admin/rich-editor.tsx:124`, `home.module.css:2431`, `components/policies/policy-nav.tsx:38`, `components/study/marks.tsx:177`, `components/study/scenes/action-potential.tsx:246`, `components/study/scenes/kit.tsx:196` | polish |
| D-4 | `font-family: Arial` in the achievement email. Email clients need a safe stack; kept, the detector rule does not apply to email HTML. | `lib/achievements/notify.ts:134` | (kept, reason noted) |
| P-3 | **Instruction and meta lines in Study content**: about 70 lines that tell students how to approach the questions ("Think each question through, or jot an answer, before you open it.", "Try each question first, then open the answer."). Lines that state a rule ("Score 80% or more to open the Beginner level.") stay. | `src/content/study/*.ts` | polish |

## Result after the six commands

Detector: 8 anti-patterns and 25 advisories before; 4 and 3 after. What is
left is kept on purpose:

- `--ease-springy` (`globals.css`) and the two `stamp` landings
  (`lib/games/ui/fx.module.css`, `lib/games-sims/ui/games2.module.css`):
  `vibha-design` keeps the overshoot for the rubber stamp hitting paper, and
  for nothing else.
- Blockquote rules in a notification body and the admin editor
  (`border-l-4`): a quote convention in rich text, not a card.
- The divider between a bookmark and its remove button
  (`components/study/marks.tsx`): a 2 px separator, not a side-tab card.
- `font-family: Arial` in the achievement email (D-4): email clients need a
  safe font stack.

Screenshots before and after every command, at 390, 768, 1024, 1280 and
1536 px, are kept with the harness outside the repo (scratchpad
`uifix-shots/shots/before` and `uifix-shots/shots/after`).

## What is fine

- No page scrolls sideways at 390, 768, 1024, 1280 or 1536 px.
- Dialogs, sheets, the search palette, popovers and menus share `z-50` and
  render in portals; the first-login form (`z-100`) uses a native select, so no
  menu can open under it.
- The phone reader's Back and Next bar and the bottom tab bar never show
  together (reading is a "run" path, `navigation/sections.ts`).
- 3D scene cards hold no fixed or sticky layers; they stay inside their card.
- Reduced motion: the global flatten rule and per-component gates are in place.
