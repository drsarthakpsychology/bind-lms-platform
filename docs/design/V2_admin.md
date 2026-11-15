# Admin area, v2 (behind the `ui_v2` switch)

Standard: Linear, Stripe dashboard and Vercel for density and calm. Principles taken, not looks.
Every screen below is a v2 composition shown only when `uiV2For(flags, role)` says so. The old screen is the `else` branch of the same page file. Data loaders, server actions and the Super Admin / view-only checks are the same code; only what is drawn changed.

## Where things live

- `src/app/(dashboard)/admin/_v2/kit.tsx`: the admin kit. Local wrappers over `src/components/ds` (nothing in ds was edited):
  `AdminPage` (wide frame, one H1, actions), `Block` (heading with count and one link), `ViewTabs` (underlined link tabs), `Status` (dot plus words), `Tag`, `Meter`, `Figures` (numbers in one line, no boxes), `Facts`, `Empty`, `Notice`, `ListSkeleton`, and the class sets `table`, `btn`, `control`, `link`.
- `_v2/admin-v2.css`: scoped to `[data-admin-v2]`. Quiets the older shared Button, form fields and key hints when an older action component (copy login, lock, add to cohort, reply box, compose form) sits inside a v2 screen, and makes them 44px tall on touch widths. Nothing outside v2 admin screens changes.
- `_v2/home.tsx`, `students-table.tsx`, `student-profile.tsx`, `activity.tsx`, `mail.tsx`: the five screens. All take plain props, so they render in the fixture harness and in tests.

## Rules used on every screen

1. One purpose and one focus per screen. The first thing on the page is the thing to act on.
2. No nested cards. Sections are a heading and whitespace; lists are hairlines.
3. Desktop (768px and up): a real `<table>` with a sticky header, row hover, a selected state, numbers right aligned in tabular figures.
4. Phones: rows that open a detail screen. Search stays visible; other filters sit behind one Filters button.
5. One filter bar. One action bar, and only while something is selected (bottom of the screen, in thumb reach).
6. Status is a dot plus words, never colour alone. Lime is kept for the one primary action.
7. Text wraps instead of being cut. Where one line is the right call (mail preview) the full text is in `title`.

## Screens

| Screen | Purpose | Before | After |
| --- | --- | --- | --- |
| Home `/admin` | What needs a look now | Four stat cards, a boxed to-do, cohort cards, a shortcut grid | "Needs a look" list first with counts, "On VIBHA now" beside it, cohorts as a small table, numbers as one line of links |
| Students `/admin/students` | Find a student and act on them | Search, a row of 2px selects, a permanent bulk bar, a boxed grid list | One filter bar, a table with sticky header and selection, details open under the row, the action bar appears only with a selection; phones get rows that open the profile |
| Student profile `/admin/students/[id]` | One person, one next step | A boxed header with avatar, a boxed next step, stat cards, boxed sections | Name and facts as plain type, one tinted next-step line, the action row, tabs, doubts in the main column and progress plus details in a narrow side column |
| Activity `/admin/activity` | What students are doing | Pill tab box, five number cards, cohort cards, a boxed wide table | Underlined tabs, numbers in one line, live list as a table, cohorts as a table, falling-behind as a table with one Nudge all, everyone as a ranked table |
| Messages `/admin/emails` | Read, reply, send | A second left rail of folders, boxed bodies | Folders as tabs, a plain list, the open email beside it on wide screens and as its own screen on phones, Compose as the one primary action |

## References studied

Screenrove (captured dates as given by the library):
- `dub-product-customers` (2026-10-21): table density, quiet header row, filter and search above the table.
- `posthog-product-flags` (2026-10-21): filters in one bar, checkbox column, status in the row, row menu at the far right.
- `shortcut-product-my-work` (2026-10-21): the home starts with the person's own work, activity feed beside it.
- `plane-product-item` (2026-10-21): detail page with a properties column on the right and tabs under the title.

Taken: order and structure. Not taken: colours, type, radii, words.

## Checks

- Layout defect detector (`e2e/layout-defects.mjs`), 20 fixture pages (five screens with their empty, view-only and sub-tab states) at 320, 360, 390, 412, 768, 1024, 1440, light and dark: 0 defects in the admin screens. The old Students list and old profile header on the same fixtures at 390 and 1440 light: 126 distinct defects (mostly small tap targets and cut-off text).
- The detector still reports three things in the app shell on every admin page (bottom tab bar 3px too wide at 320px, the 9px "ADMIN" word under the logo, the 11px "/" key hint in the search box). The shell is not part of this work.
- axe (WCAG 2.2 A and AA) at 390x844, 1440x900 and phone landscape 844x390, light and dark: no issues.
- Fixture harness and screenshots: scratchpad `v2admin-shots/` (`shots/after`, `shots/before`, `shots/landscape-*`).
