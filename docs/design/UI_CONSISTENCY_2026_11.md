# UI consistency inventory, November 2026

What the eight student sections did before this pass, and the one rule each
now follows. Findings are numbered in
[IMPECCABLE_AUDIT_2026_11.md](IMPECCABLE_AUDIT_2026_11.md). The look stays the
Neo-Brutalist Pastel world: this is refinement inside it.

## Inventory (before)

| Section | Header | Width | Gutters | Cards | Back link | Tabs / toggles | Empty state |
|---|---|---|---|---|---|---|---|
| Home | eyebrow "Home" + title | 1024 centred | shell | 14 px | none | none | dashed box, one line |
| Study | title + one line | 1024 centred | shell | 14 and 24 px | bordered 10 px ("All modules") | Student/Clinician pill | none |
| Lectures | `PageHeader` | full width | shell | 16 px | none | week chips | `EmptyState` |
| Medicines | back pill + eyebrow "Practice · Medicines" + two-line lede | 1024 centred | **doubled** | 14 px | **pill** "Practice" | filter chips | text |
| Exam Prep | `ToolHeader` + exam list | **672 centred** | **doubled** | **10 px** | blue text link | ink-selected tabs | plain card with text |
| Practice | eyebrow + title | 1024 centred | shell | 16 px | none | none | none |
| Games | mascot + title, grey dotted panel | 1024 centred | **doubled** | 14 px | bordered 10 px | segmented pill | none |
| More pages | mixed (Journey eyebrow, Journal none, Doubts none) | 768 to 896 | **doubled** | 10 to 16 px | text or pill | pill segmented (Leaderboard) | three styles |

## The rules (after)

| Area | Rule | Where it lives |
|---|---|---|
| Page header | Eyebrow (section name, `text-eyebrow text-link`), one `text-h1` title, an optional one-line lede, optional actions on the right. Nothing else above the content. | `src/components/design-system/page-header.tsx` |
| Width | Section home pages (Home, Study, Lectures, Medicines, Exam Prep, Practice, Games, Progress, Leaderboard, Achievements, My journey): one 1024 px column, centred. Reading and forms (Doubts, Journal, notes, Quick Reference): 768 px. A question set or a game in play: 672 px. | page wrappers; `PrepFrame hub` |
| Gutters | The shell pads every page (`ShellContent`). Pages never add their own side padding or top padding. | `src/components/navigation/shell-content.tsx` |
| Cards | 14 px radius, 2 px ink border. Controls (buttons, fields, choice tiles) 10 px. Pills only for status tags, filter chips and avatars. `rounded-2xl` and `rounded-3xl` resolve to the card radius. | `src/app/globals.css` radius tokens |
| Buttons | The `Button` scale: `sm` 36, default 40, `lg` 48; touch screens raise everything to 44. | `src/components/ui/button.tsx` |
| Back link | One bordered 44 px rectangle with an arrow and the destination's name. | `BackPill` / `backLinkClass` in `src/components/study/back.tsx` |
| Tabs and toggles | One segmented style: a bordered 10 px box, segments 44 px tall on touch, the chosen segment filled ink. | `segmentGroup` / `segmentItem` in `src/components/ui/segmented-control.tsx` |
| Empty state | `EmptyState` (`row` inside lists, full otherwise): dashed border, icon, one line. | `src/components/design-system/empty-state.tsx` |
| Layers | 20 in-page sticky, 30 sidebar, 40 top and bottom bars, 50 overlays, 100 first-login form. In-page sticky bars sit at `top-0` on phones and `top-[var(--top-h)]` from 768 px. Anchors stop below the top bar. | `src/app/globals.css` (Layers note) |
