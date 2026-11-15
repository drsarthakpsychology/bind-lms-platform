# V2: Practise and Library

New-design (ui_v2) screens for games, practice tools, Exam Prep and the medicine library. Every screen is behind the `ui_v2` switch (`src/components/play/v2.ts`, `playV2()`); the old screen is untouched and shows when the switch is off. Same loaders, same server actions, no logic changes.

## Parts (src/components/play)

| file | what it is |
|---|---|
| `game-frame.tsx` | `GameFrame`: the one frame for every game and practice tool. Row 1: Back, name, How to play. Then the play area, plain on the page. The activity's own ThumbBar stays the pinned action. |
| `play-frame.tsx` | `PlayFrame`: picks `GameFrame` (v2) or the old `ActivityFrame` + `ActivityTip`, so a page states its title and how-to once. |
| `parts.tsx` | `PlayStack`, `Fold` (a hairline row that opens in place), `BackLine`, `ListHead`. Local wrappers; nothing was added to `components/ds`. |
| `games-hub.tsx`, `practice-hub-v2.tsx`, `hub-parts.tsx` | The two hubs. |
| `medicine-library.tsx` | Search, one row of chips, the list (table on wide screens, compact rows on phones). |
| `medicine-page.tsx` | The editorial medicine page with its section index. |

## Screens

- `/games`: two groups (Solo, With others) of thin cards, then two rows (board, Lab).
- `/practice`: Main skills as thin cards, the smaller tools as rows, record links as rows.
- Every game (`/games/blitz`, `sort`, `mse`, `ward`, `rx`, `duel`, `escape`, `comorbid`) and every practice tool (`daily`, `detective` and its two-minute mode, `scenarios`, `terms`, `judgment`, `ethics`, `landmark`, `osce`, `mse`, `formulation`, `role-play`, `weak-spots`, `out-of-depth`, `consulting-room` lobby, `library`) sits in `GameFrame`.
- `/prep`: one hero (pick up where you left off), subjects as rows, the other tools as rows.
- `/prep/<subject>`: topics as rows. `/prep/<subject>/<topic>`: one question per screen, options as large rows, the verdict as a full-width band; the set picker is a sheet from the frame's top row.
- `/practice/medicines`: search first, chips in one scrolling row, every medicine listed.
- `/practice/medicines/<id>`: editorial page; index beside the page on wide screens, a bottom sheet on phones; key facts as a two-column list; facts first, How it works last. Words, order, anchors (`#how-it-works`) and the hand-drawn pictures are unchanged.
- `/tools/psychopharm/<drug>`: editorial head and rows around the same reference components.

## References (Screenrove, captured dates as listed there)

- `stripe-product-docs-checkout` (2026-09-24), `raycast-product-docs` (2026-09-24): article column with an "on this page" index; took the quiet side index and hairline section breaks.
- `hygraph-content-search` (2026-10-22), `shortcut-search-page` (2026-10-21), `postman-browse-apis` (2026-10-21): search above a plain table; took search first, column names as small caps-free captions, rows as the link.
- `ticktick-product-list` (2026-10-21): sections of rows with hairlines; took the grouped hub.
- `grafana-tailor-answers` (2026-10-22): one question, large choice rows, one action; took the runner.

Only the search results and thumbnails were used (principles, not looks). No copy or branding was taken.

## Checks

`e2e/layout-defects.mjs` against a static harness (scratchpad `v2play-shots/`), widths 320 to 1440, light and dark. Results and what is left are in the agent's report.
