# To connect: Practise (area builder bpractise)

Screens in the Practise tab that are designed in full but draw on mock data
or on a shape the server does not send yet. Each line: screen, file, what
data it needs, which website code has it.

| Screen | File | What it needs | Where the website has it |
|---|---|---|---|
| Full case player (`/case/full`) | `src/practise/player/rich.tsx`, sample in `src/practise/player/mock.ts` | Rich cases in the shape of `src/practise/player/types.ts` (context blocks, steps with 4 to 6 options, 3 hints; after each answer a key per option with grade, reason and consequence, plus concept, clinical point and common errors). Keys must arrive only after the answer (a check move per step). Until then the hub shows it only in mock builds. | Not built yet: practice audit section 5.2 and WP1/WP4 (`src/lib/practice/rich/*`, `src/lib/app-api/practise.ts`). |
| Every "pick one" practice step (What would you do, Say it clinically, Ethics, Out of depth, Landmark questions, Exam prep questions) | `src/practise/cases/tool.tsx`, `src/practise/prep/set.tsx` via `src/practise/player/step.tsx` | Already live data. The player shows hints, per-option reasons, concept and common errors as soon as the banks carry them (`hints`, per-option `feedback`, `explanation`). Today only the one why line and per-option notes exist. | Content rewrite (audit WP6). |
| Practise hub levels | `src/practise/hub.tsx` (`LEVEL_OF`) | The level of each tool is set on the phone. When the server sends a level per row (or per topic and student), use it instead. | Audit WP8 (`src/lib/practice/ladder.ts`). |
| Practise hub numbers (streak, XP, board rank) | `src/practise/hub.tsx` `Numbers` | Uses GET `/leaderboards/shop` (streak, balance). The board rank shows only when the League row's `trailing` carries it ("#4"); otherwise "Open". A rank field on the hub row would be better. | `src/app/(dashboard)/leaderboard/*`. |
| Quest moment on results | `src/practise/quest.tsx` | Uses GET `/home` quests, read again after a round. No change needed; if the server adds a quest id per practice record, the result could show it at once instead of re-reading Home. | `src/lib/quests/*` (website). |
