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

## Second batch (the rest of the admin area)

Same pattern: the page file asks `uiV2For(flags, role)`; the old screen is the `else` branch; loaders, server actions and the Super Admin / view-only checks are the same code.

New in the kit (`_v2/kit.tsx`): `Rows`, `RowLink`, `RowItem` (hairline lists for phones and for lists that are not tables), `Field`, `More` (a closed group for rarely used controls), `LoadError`, `nameLink`, `rowList`.
`_v2/v2-context.tsx`: the admin layout reads the switch once and hands it to `AdminLoading` (kit `ListSkeleton` rows in place of the old boxed skeleton) and to `admin/error.tsx` (a new error screen for every admin page, inside the admin layout).

| Screen | Purpose | Before | After |
| --- | --- | --- | --- |
| Inbox `/admin/inbox` | Answer what is waiting | Boxed login finder first, a card per thread | Doubts and concerns first, then email replies, as plain rows with the reply box under each; login finder last |
| Cohorts `/admin/cohorts` | Pick a cohort | A grid of cards with three boxed numbers each, a boxed form beside it | A table (rows on phones); New cohort closed under the list |
| Cohort `/admin/cohorts/[id]` | Run one cohort | Stat cards, coloured link cards, boxed lists | Underlined tabs, numbers in a line, members and progress as tables (rows on phones), settings as two plain columns |
| Pipeline `/admin/people` | Who to contact next | Pill chips, avatar list in a box, boxed board columns | One filter bar (search, view, table or board), a table, rows on phones; the board keeps one column per stage with hairlines |
| Person `/admin/people/[id]` | One person's history | Boxed card with avatar, boxed timeline items | Timeline as the main column, stage and follow-up plus facts in a narrow column, contact buttons in the header |
| Enquiries `/admin/enquiries` | Reply to public form leads | Two columns of cards | A table from 1024px (name, who they are, message, received, actions); rows below |
| Needs a look `/admin/triage` | Sessions to check | Boxed counters and cards | The queue as rows, weak quiz questions as a table |
| Submissions `/admin/submissions` | Grade work | Two filter rows, a card per submission | Status tabs and one filter row; each submission is a row that opens in place |
| Doubts `/admin/doubts` | Reply to students | Pill tab box, boxed list | Tabs, the shared filter bar, a table (rows on phones) with status in words |
| Sign-offs `/admin/supervision` | Sign or reject | A card per entry, two coloured buttons | Rows; Sign is the dark button, Reject is quiet |
| Courses `/admin/courses` | Open a course | A create card first, then course cards | A table (rows on phones); New course closed under the list |
| Course `/admin/courses/[courseId]` | Its lectures | People panel first, boxed accordions, a card per lecture with a thumbnail | Lectures first, by week, as a table from 1280px and rows below; Add a lecture, Students and cohorts and Course files are closed sections |
| What's live `/admin/flags` | Choose what students see | Three coloured stat cards, a grid of switch cards | Three numbers in a line; each tool is a row with its switch on the right |
| Medicines `/admin/psychopharm-review` | Open a medicine to edit | Boxed rows | A table (name, class, student summary, status); rows on phones |
| Forms `/admin/forms` and its pages | See answers | Cards with boxed numbers | A table from 1280px, rows below; answers, new, edit and contact pages share the v2 frame |
| Badges and certificate types `/admin/achievements` | Manage badge types | Own header and pill tabs | v2 title and underlined tabs; inner forms flattened |
| Find and issue, Issued certificates | Credentials | Own headers | v2 title and actions; the shared filter bar in its v2 look. The certificate studio is not touched |
| Usage and AI providers `/admin/infra` | Is anything about to fail | Four boxed panels and a boxed list | Storage as one line with its bar, providers as a table, table sizes as a small table |
| Who needs a nudge, Learning insights, Check-ins | Activity | Own headers, boxed panels | v2 frame; check-ins get numbers in a line and a real table |
| Access for many, Admins, Support key, Login links | People and System | Own headers, boxed panels | v2 frame; inner tools flattened |

Older parts that sit inside v2 screens (cohort forms, lecture form and uploaders, form builder) keep their own logic and markup. `_v2/admin-v2.css` turns their 2px ink boxes into one hairline with no fill or shadow, lifts text under 12px to 12px, and makes their controls 44px tall on touch widths. `FilterBar`, `FlagToggle`, `LoginFinder`, `PersonLinks`, `PersonActions`, `SupervisionReview`, `SubmissionReviewRow` and `AchievementsAdmin` take a `v2` prop that changes class names only.

References looked up for this batch (Screenrove, listed by search, captured dates as given): `plane-product-inbox` (2026-10-21), `fibery-product-inbox` (2026-10-22) for the inbox list; `folk-product-people` (2026-10-21), `twenty-product-opportunities-table` (2026-10-22) for the pipeline table; `sentry-product-org-settings` (2026-10-21), `retool-product-settings` (2026-10-21) for settings rows with a control on the right; `neon-product-overview` (2026-10-21) for usage. The structure follows the four references of the first batch; these were found by search and not studied in depth.

## Third batch: shell, older parts, last frames

Admin shell when `ui_v2` is on (only admin branches of the shared shell changed; student navigation is untouched):
- Phone: the same five-tab bar as students: Home, Students, Activity, Messages, More. More is a screen (`/admin/more`), not a drawer: grouped rows (People: Inbox, Cohorts, People; Teach: Review, Content, Forms; Credentials: Certificates, Achievements; Settings: System, Settings), then Dark mode, View as student and Log out, like the student Me screen.
- Phone top bar: logo, search and bell (the Inbox icon is on More).
- Desktop: the quiet sidebar (hairline edge), regrouped into People, Messages, Teach and Settings; section tabs are quiet underlined tabs.
- Config: `ADMIN_V2_TABS`, `ADMIN_MORE_GROUPS`, `ADMIN_MORE_MATCH`, `adminV2SidebarItems` in `src/components/navigation/v2-config.ts`; test `admin-v2-config.test.ts`.

Older parts given a `v2` prop (class names only, same logic): `FailedList` (table with a tick column on desktop, rows on phones, the action bar only while something is ticked), `NotifyTab` and `ComposeTab` (no second title, hairlines instead of boxes, the chosen template and mode are dark so lime stays on Send), `PersonAccess` (the per-student access editor: sections split by hairlines, quiet toggles), `QuietPanel` and `PulseView` (numbers in one line, check-ins as a table, quiet students as rows), `AccessManager` and `RosterActions` (hairline rows, 44px tick targets), `ResponsesTable` (emails wrap at sensible points, cut answers carry their full text), `LearningInsightsView` (no numbered eyebrows), `AchievementsAdmin` rows. `_v2/admin-v2.css` second pass: text inside v2 screens wraps instead of being cut, paragraphs keep a 75ch measure, eyebrow text is 12px, older dropdowns are 44px on touch.

Frames only (old body kept, v2 title, lead and Back): Find and issue (with underlined tabs), Issued certificates, AI cases, Study cards, Modules, Reported wall content, Practice sessions, Add students (with underlined tabs). The certificate studio and the medicine editor (a full-height editing tool) are not changed.
