# Motion and touch kit

Everything that moves in the app takes its numbers and parts from `src/motion`.
Import from `@/motion`. One voice: quick to react, calm to settle, bold only when
the student wins something.

## The rules

1. **Animate to explain**: where something came from, that a press landed, that
   something changed, or a real win. Never for decoration.
2. **Transform and opacity only.** No animated `width`, `height`, `top`, `margin`.
3. **On the UI thread.** Shared values, `useAnimatedStyle`, layout animations
   (`entering`, `exiting`, `layout`). No `setInterval`, no `Animated` from
   react-native in new code, no state updates per frame.
4. **Quick.** Presses 100 to 150ms, state changes about 180ms, entries about
   260ms, exits faster than entries. Nothing blocks a task: a button never waits
   for an animation.
5. **Reduce Motion is respected everywhere.** Every part reads
   `useReducedMotion()` and keeps the meaning without the movement (the number
   still changes, the bar is still full, the tab still switches).
6. **Do not animate what people do all day by keyboard.** Search results that
   change as you type do not animate (`<RowList still>`).
7. **Never scale from 0.** Things appear from 0.9 or more, with a fade.

## Tokens (`tokens.ts`)

| Token | Value | For |
|---|---|---|
| `springs.press` | 620 / 42 / 0.35 | press feedback, chips |
| `springs.snappy` | 460 / 38 / 0.8 | moving between two places: tab pill, underline, rows closing a gap |
| `springs.bouncy` | 520 / 22 / 0.6 | a small lively settle: tab icon pop, badge, stamp |
| `springs.smooth` | 260 / 34 / 0.8 | content and list rows arriving |
| `springs.sheet` | 380 / 40 / 0.9 | bottom sheets |
| `springs.digit` | 280 / 18 / 0.3 | rolling digits |
| `dur.*` | micro 100, press 120, state 180, enter 260, exit 180, fill 700, burst 560, confetti 1600 | timings |
| `curves.out` | cubic-bezier(0.23, 1, 0.32, 1) | anything entering or leaving |
| `curves.inOut` | cubic-bezier(0.77, 0, 0.175, 1) | moves on screen |
| `stagger` | 40ms a row, at most 8 steps, 10px rise | list entry |

Springs are `{ stiffness, damping, mass }` for `withSpring`.

## Parts

### Press feedback
```tsx
<Press onPress={open} scale={0.97} feel="select" innerStyle={{ padding: 16 }}>...</Press>
const { style, handlers } = usePressScale(0.97); // for your own Pressable
<Pressable {...handlers} onPress={...}><Animated.View style={style}>...</Animated.View></Pressable>
```
`Row`, `Card`, `Chips`, `IconButton` and `Button` already have it. `feel`:
`"select"` (picking, default), `"tap"` (an action), `"none"`.

### List and block entry
```tsx
<Enter i={0}>greeting</Enter>
<Enter i={1}><Hero ... /></Enter>          // arrives 40ms later
<StaggerList>{rows}</StaggerList>           // rows rise in, slide on add/remove
const entering = useEnter(i, "rise" | "fade" | "pop");
<Animated.View entering={presets.pop(200)} exiting={presets.out()} layout={presets.layout()} />
```
`RowList` does this by itself: the first 12 rows rise in on first appearance,
rows added or removed later fade and the others slide into place (lists over 40
rows skip the slide). `<RowList still>` turns it off.

### Loading to content
- `Skeleton` (in `@/ds`) has a soft light sweep (`Shimmer`); all skeletons on a
  screen sweep in step.
- `SkeletonIn` shows a skeleton only if loading takes longer than 120ms, so a
  fast load never flashes grey. `RowsSkeleton` and `HomeSkeleton` use it.
- `Reveal` settles freshly loaded content in with a fade and a 6px rise. Wrap
  one block, not a fragment (it is a View, so the parent's `gap` no longer
  spaces the children inside it).

### Numbers
```tsx
<RollingNumber value={86} suffix="%" v="h1" />
```
Each digit rolls into place (from 0 the first time, then from the old value),
tabular figures so nothing shifts. `Stat` uses it automatically for values such
as `"12"`, `"86%"`, `"1,240"` and `"3/12"`.

### Progress
```tsx
<ProgressRing pct={60} size={28} stroke={4}>{optional centre}</ProgressRing>
<ProgressFill pct={40} height={6} />   // ProgressLine in @/ds uses this
const v = useFill(pct, delay);          // 0..1 shared value, for your own drawings
```
Fills from empty on arrival (700ms, strong ease-out), then eases between values.

### Success moments
```tsx
<View>{ring}<Burst fire={n} reach={30} /></View>   // square sparks + ring from the centre
<Confetti fire={n} />                              // full-screen, big wins only
<Stamp fire={n} rotate={-3}>...</Stamp>            // the website's stamp-in
const n = useNewWins("achievements", ids);         // fires once per new id, with a success haptic
```
Use a counter for `fire`; each new value plays it again. Burst for a daily goal,
Confetti for a certificate or every quest done. Both draw nothing with Reduce
Motion; the haptic still plays.

### Tab bar and screen transitions
- `src/nav/tabs.tsx` uses `MotionTabBar`: a soft pill springs behind the current
  icon and stretches a little as it travels, the icon pops on arrival, presses
  sink. Tab screens trade places with a fade and 16px shift
  (`tabSceneOptions`). Hidden while the keyboard is up.
- `app/_layout.tsx` spreads `stackMotion(reduce)` into the stack: native
  slide-from-right with parallax on both platforms, edge swipe anywhere,
  `modalMotion` (slide up) for Ask a doubt and New message, `fadeMotion` for
  Search. All become a short fade with Reduce Motion.

### Sheets
`Sheet` in `@/ds` springs up (`springs.sheet`), follows the finger 1:1 when
dragged (rubber band upward), closes on a long or quick pull, else springs back.

### Pull to refresh
`Screen` handles it: pass `onRefresh` and `refreshing` as before. The spinner
only shows for the person's own pull (not for quiet background refreshes), stays
at least 500ms, and the pull gives a selection haptic. `useRefresh(...refetch)`
gives the same for screens that do not use `Screen`.

## Performance
- All motion runs in worklets on the UI thread; JS only starts it.
- Rows are plain Views inside `RowList`; FlashList is not installed. Lists are
  short except the medicine library, where per-row layout springs switch off
  above 40 rows and entry is capped at the first 12.
- Bursts and confetti use one shared value each; particles compute their place
  from it (no per-particle timers).

## Tests
The jest mock of Reanimated reports Reduce Motion on, so components render
their still versions in tests. Layout animation builders chain freely in the
mock (`jest.setup.ts`).
