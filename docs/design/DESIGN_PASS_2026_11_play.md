# Design pass, November 2026: Games, Practice and Tools ("play")

Scope: /games (hub and every game), /practice (tools), /tools (medicine pages).
World kept: Neo-Brutalist Pastel (ink 2px borders, hard zero-blur shadows, lime
action fill, blue selected fill, 10px cards). Refinement, not a new world.
Game logic was not touched; edits in game files are markup, classes and two
UI timing constants.

## How the screens were checked

- Harness: esbuild bundle of the real pages with stubbed Next and Supabase
  (scratchpad `dzplay-shots`), with the games' own server actions running in
  the browser so starting, answering and finishing really happen.
- Widths: 320, 390, 768, 1280. Landscape phone 844 x 390. Light and dark.
  Reduced motion on for screenshots; motion checked separately.
- Before shots: `dzplay-shots/shots/before/` and `shots/play-before/`.
  After shots: `shots/after/` and `shots/play-after/`.

## Worst problems found (before)

| # | Screen | Problem |
|---|---|---|
| 1 | Every game | The first-time How to play panel touched the content under it (4px gap; its own hard shadow ran into the next heading). |
| 2 | Rx Detective, MSE Lab, Comorbid start screens | The first choice was lime-filled at rest, so it read as already picked; the others looked like plain outline buttons. No arrows, no shared look. |
| 3 | Games hub (phone) | The tag sticker sat on top of the game icon; tiles had no shadow at rest; 16px corners against the 10px card rule. |
| 4 | Clinic detective start | Three identical full-colour buttons (iso-styled competing CTAs), a second copy of the page title, a stray Back link. |
| 5 | Criteria sort (phone) | Sixteen tall "Empty" boxes came before the tiles: about 950px of empty slots. Every "tap a tile, tap a group" meant scrolling up and down. |
| 6 | Formulation (phone) | Same scroll problem with five 120px buckets; every factor card cut at 42 characters plus "...", even short ones; step tabs wrapped ("2 ·" / "Narrative") and used jargon (Diff). |
| 7 | Rx Detective | Step boxes wrapped to two lines at 12px on phones; the verdict was a small pill beside "+0". |
| 8 | MSE Lab | Same small verdict pill. |
| 9 | Judgment calls | Answer buttons at 12px in grey borders; the panel chart's bars had zero height (percent of an auto box) and two labels both read "Much"; no win or lose sticker; meta copy. |
| 10 | Out of depth, Ethics dilemmas | No reaction stickers at all (rule: every game and practice tool). |
| 11 | MSE trainer | Locked levels faded to 40% (unreadable); five chips stacked four rows deep on phones. |
| 12 | Ward Week, Escape Room | Small counts on every card ("5 sessions", "7 doors"), against the owner rule. |
| 13 | Blitz | Start screen was three loose boxes; a right answer flashed for 260ms, too fast to see. |
| 14 | Games loading | The dashboard's three-card skeleton, then a jump into the game frame. |

## What changed, and the reference behind it

### Shared pieces (prefer these in new work)

- `ChoiceCard` and `PickHeading` in `src/lib/games-sims/ui/kit.tsx`: one card
  for every game start choice. Same look for every choice at rest; the
  suggested one carries a small "Start here" tag; 64px target; arrow; hard
  shadow; press flattens. Accessible name is the title only, the line is its
  description. Used by Rx Detective, MSE Lab, Comorbid, Clinic detective.
- `Verdict` in the same kit: the answer band. Verdict colour, icon in a disc,
  the word in large type, the points. Used by Rx Detective and MSE Lab.
- `src/app/(dashboard)/games/loading.tsx`: game-frame skeleton.

### References (Screenrove, captured dates as listed by Screenrove)

- `duolingo-product-correct` (Duolingo, 2026-09-24) and
  `duolingo-product-incorrect` (2026-09-24): the answer band: one coloured
  band, icon in a white disc, the verdict word large, Continue in thumb reach.
  Taken for `Verdict` and the Judgment calls panel.
- `codecademy-quiz-answer` (Codecademy, 2026-10-22): wrong pick filled, right
  answer marked in place with a label, explanation under it. Matches what Rx
  options already do; kept.
- `prezi-product-games` (Prezi, 2026-10-21): game picker as a card grid with a
  short tag chip per game, grouped under a short heading. Taken for the hub
  tile and its tag.
- `maze-block-menu` (Maze, 2026-10-22): rows with a coloured square icon, bold
  name and one grey line. Taken for `ChoiceCard`.
- `duolingo-product-match` (Duolingo, 2026-09-24) and
  `duolingo-first-exercise` (2026-09-24): selected tile in blue, placed ones
  greyed, one action at the bottom. Confirms the Sort and Formulation flows.
- Screenrove `check_my_ui` was run on the after state of the hub, Criteria
  sort and Judgment calls; the closest matches were the Prezi games page, the
  Duolingo match exercise and the Duolingo answer feedback, with no missing
  blocks reported for the lesson screens.
- Screenrove `get_motion_guidelines` and `suggest_polish`: press feedback
  100 to 160ms, enter with a strong ease-out, sheets slide up and leave the way
  they came, never animate from scale 0, reduced motion keeps the state change
  and drops the movement. Taken for the bottom pickers (slide-up using the
  existing `rise` keyframe, off under reduced motion) and the timing below.
  Its sound suggestions (the `cuelume` package: tap, success, count) were not
  added: it is a new dependency and the app already gives haptics. Left as an
  owner decision.

### Other sources

- Mobbin: the connector asks for a paid plan, so no Mobbin screens were used.
- gumroad.com (read as the "Gummble" the owner named): the page export carries
  no styles, so only its structure was readable (pill tag grid, stacked proof
  cards). Nothing taken beyond confirming pill = tag, card = holds.
- Made Good Designs: not needed beyond the tokens already in the world.

## Timing (owner rule: human timing)

- Blitz right answer hold 260ms to 420ms; wrong answer hold 750ms to 1100ms,
  so the right answer is readable before the next question. The clock still
  runs during the hold, as before.
- Every other game and tool waits for the student's Next; nothing auto
  advances.
- Bottom pickers slide up with the existing 400ms out-expo `rise`; none under
  reduced motion.

## Per screen

- Games hub: tag off the icon on phones (under the words), hard shadow at
  rest, 10px corners, tactile press.
- Blitz: one game card (lime band with the timer mark, the two bests side by
  side, Start inside). Timing above.
- Rx Detective: ChoiceCard picker; step boxes become a progress track (blue
  now, lime right, red wrong, one-line names); Verdict band. Wrong answers
  still link to How it works.
- MSE Lab: ChoiceCard picker, Verdict band.
- Comorbid: ChoiceCard picker, "Pass and play" as its own choice.
- Criteria sort: compact slot meter per group; when a tile is picked the
  bottom bar offers the four groups as big buttons (phones and tablets).
- Ward Week, Escape Room: small counts removed; pick headings match.
- Clinic detective: start screen rebuilt (Chai, Pick a case type, best score
  chip, three choice cards, alert-style error).
- Judgment calls: icon scale, chart that draws, your answer marked, reactions.
- Out of depth, Ethics dilemmas: reactions and end stickers.
- Formulation: full card text, compact buckets, bottom bucket picker,
  numbered steps with plain names.
- MSE trainer: readable locked chips with a lock, done chips with a check, a
  single sideways row on phones (fixed an off-screen overflow from the
  screen-reader text while doing it).

## Left, and why

- Two practice frames still exist: games and Daily case use `ActivityFrame`
  (Back + title in one row); most practice tools use BackPill + a large
  ToolHeader title. Merging them touches every tool page and the shell's
  help-button placement (mobile shell agent's area); worth one owner decision.
- Duel's opponent cards hold a card and a button that do the same thing.
  Duel is being reworked by the games server agent; left alone.
- Daily case and Rx in-play markup beyond the verdict was left alone because
  the cases agent and the games server agent are editing those files.
- Sounds (see above).
- Medicine pages already put facts first and How it works last; the harness
  could not render `/tools/psychopharm/*` (they redirect or need the store),
  so no changes there.
