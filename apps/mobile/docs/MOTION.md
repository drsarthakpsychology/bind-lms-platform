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
8. **One source of numbers.** Every duration, spring and curve comes from
   `@/motion` (`dur`, `springs`, `curves`, `shift`, `beats`, `presets`). No
   inline springs, no `motion.*` from the theme (kept only as a deprecated
   alias of `dur`), no raw `FadeIn.duration(...)`.
9. **Keyed content never blinks.** When a question, round or view changes,
   use `Swap`: the old plays out while the new plays in, never an empty frame.
10. **Budget per screen at one time**: 40 animated views, 12 SVG paths
   drawing, 3 bursts, 1 confetti of 36 pieces. Decorative loops stop after
   two cycles; only a real loader and the skeleton shimmer loop.
11. **Low-end Android** (`useMotionTier().low`): half the particles, no
   page-behind scale on sheets, no blur, screen transitions and arrivals
   become plain fades. Everything else stays.
12. **Every animated SVG path goes through `safePath` / `finite`** from
   `src/lib/svg-safe.ts`, so a NaN in data can never crash the native view.

## Tokens (`tokens.ts`)

| Token | Value | For |
|---|---|---|
| `springs.press` | 620 / 42 / 0.35 | press feedback, chips |
| `springs.snappy` | 460 / 38 / 0.8 | moving between two places: tab pill, underline, rows closing a gap |
| `springs.bouncy` | 520 / 22 / 0.6 | a small lively settle: tab icon pop, badge, stamp |
| `springs.smooth` | 260 / 34 / 0.8 | content and list rows arriving |
| `springs.sheet` | 380 / 40 / 0.9 | bottom sheets |
| `springs.digit` | 280 / 18 / 0.3 | rolling digits |
| `springs.morph` | 420 / 40 / 0.8 | a row title gliding into its page title |
| `springs.dot`, `wave`, `art`, `room`, `dropBack`, `toggle` | see tokens.ts | PIN dots and success wave, gate art, Welcome room, drag spring back, meters and switches |
| `dur.*` | micro 100, press 120, state 180, enter 260, exit 180, fill 700, burst 560, confetti 1600, shimmer 1300 | timings |
| `dur.skeletonDelay` / `skeletonMin` | 120 / 380 | skeleton waits 120ms, then stays at least 380ms |
| `dur.swapOut` / `swapIn` | 100 / 180 | keyed content swap |
| `dur.toastIn` / `toastOut` | 180 / 140 | toast |
| `dur.tabOut` / `tabIn` | 70 / 150 | tab fade through |
| `dur.sheetIn` / `sheetOut` | 300 / 200 | sheet timing fallbacks (the sheet itself springs in) |
| `shift.*` | swapOut 6, swapIn 8, reveal 6, toast 12, tab 8 (px) | distances |
| `beats.*` | result 0, haptic 280, particles 320, sticker 640, stats 900 (ms) | the order of a celebration |
| `curves.standard` | cubic-bezier(0.2, 0, 0, 1) | colour and opacity, button press |
| `curves.sheet` | cubic-bezier(0.32, 0.72, 0, 1) | Vaul's drawer curve |
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
Presets: `rise`, `fade` (260ms), `fadeState` (180ms: controls, a revealed
block, a screen arriving), `pop`, `out`, `outUp`, `layout`, `swap(dir)` and
`swapOut` (prefer the `Swap` part), `verdict` (readable by 120ms, then the
last 16px on the smooth spring: `VerdictBand` uses it), `toast` and
`toastOut`.

### Keyed swaps
```tsx
<Swap k={q.id} dir={1} style={{ gap: space[4] }}>{question}</Swap>
```
When `k` changes, the old content stays until the new one has laid out, then
the old lifts 6px and fades (100ms) while the new fades in moving 8px from the
direction of travel (180ms). `dir`: 1 forward (from the right), -1 back, 0
rises. Works on web too. Reduce Motion: replaced in the same frame. Use it for
every question, case, round and view switch (quiz, games, prep, map practice,
medicines, widgets, PIN gate headline).
`RowList` does this by itself: the first 12 rows rise in on first appearance,
rows added or removed later fade and the others slide into place (lists over 40
rows skip the slide). `<RowList still>` turns it off.

### Loading to content
- `Skeleton` (in `@/ds`) has a soft light sweep (`Shimmer`); all skeletons on a
  screen sweep in step.
- `Loaded` and `Query` (in `@/ds`) do loading to content for every screen
  through `LoadSwap`: nothing for 120ms, then the skeleton for at least 380ms
  once shown (no grey blink), then the content rises 6px into place. Saved
  data shows at once, still. For your own screen:
  `<LoadSwap ready={!!data} skeleton={<LectureSkeleton />}>{content}</LoadSwap>`,
  or `useLoadGate(ready)` for the phase alone.
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

```tsx
<View><ProgressRing pct={100} /><PixelBurst fire={n} bursts={2} /></View>
```
`PixelBurst`: pixel fireworks for a rare win (goal met, level up,
certificate): dotted rings of square cells in lime, blue and ink (lime, light
blue and white in dark), up to 3 bursts 380ms apart, 24 cells each, half on
low-end phones. Nothing with Reduce Motion.

### Celebrations in order
```tsx
const celebrate = useCelebrate();
celebrate({ win: allRight, result: () => setShown(true), particles: () => setFire((n) => n + 1), sticker: showSticker, stats: () => setStats(true) });
```
Every win runs through `useCelebrate`, so the order is always: the result
lands (0ms), the haptic (280), particles (320), the sticker (640), the stats
(900) (`beats`). A loss gets a warn haptic and never particles. Timers are
cancelled on unmount or when a new moment starts. Reduce Motion: same order
at once, no particles. Pass a raw `[{ at, run, motion? }]` list for anything
else. Mount Confetti at the screen root, not inside a scroll.

### Motion graphics
```tsx
<Svg width={120} height={40}>
  <DrawInk k="underline" shape={{ t: "line", x1: 4, y1: 30, x2: 116, y2: 28 }} duration={260} />
</Svg>
<Sprite frames={sprites.loader} cell={6} frameMs={130} loops={-1} />
<MaskLine delay={380} h={32}><T v="display">Learn psychiatry</T></MaskLine>
```
- `DrawInk`: a rough.js shape (same props as `Ink` in src/sketch/ink.tsx)
  that draws itself on like a pen: each stroke's dash offset runs on the UI
  thread, strokes one after another (`stagger`). Lengths are worked out in JS
  (`pathLength`). Plays once on mount (`delay`, `duration`) or follows your own
  `progress` shared value (PIN shield: digits / 4). Solid fills fade in. At
  most 12 paths drawing at once. Reduce Motion: drawn in full.
- `Sprite`: a small pixel grid (up to 8x8 cells in one Svg). Frames are rows of
  `"#"` (on) and `"."` (off); one shared value picks the frame. Ready-made:
  `sprites.loader` (3x3 chevron wave), `tick`, `star`, `flame`. Loops twice by
  default; `loops={-1}` only for a loader while something really loads.
  Reduce Motion: the last frame, still.
- `MaskLine`: a line of type rising out of its own clipped box (Welcome
  headline, game titles). Transform only.

### Motion tier
```tsx
const tier = useMotionTier();          // { low, particles, pageBehind }
<Confetti count={scaled(36, tier)} />
```
Worked out once per launch: low-end is Android with 2GB RAM or less, Android
10 or older, or a screen density of 2 or less. Reduce Motion is separate.

### Tab bar and screen transitions
- `src/nav/tabs.tsx` uses `MotionTabBar`: a soft pill springs behind the current
  icon and stretches a little as it travels, the icon pops on arrival, presses
  sink. On the student tabs (`TabDef.area`) the pill washes from one area's
  colour into the next as it travels (`interpolateColor` on the UI thread) and
  the current icon and label wear the area's deep colour. Tab screens "fade
  through" (`tabSceneOptions(reduce, low)`, native driver): the old one fades
  out in the first 70ms, the new one fades in with an 8px lift after it, so
  two pages of text never show at once; low-end Android fades only. The tab
  screen's area glow then washes down from the top (`AreaGlow` in `Screen`,
  420ms, fade only on low-end) each time the tab comes to the front. The other
  tabs render in the background 1.2s after the first one settles, so a first
  visit never shows an empty frame. The bar slides down behind the keyboard
  frame by frame (`useAnimatedKeyboard`, UI thread) and comes back as the
  keyboard closes.
- Every stack (root, admin, visitor) takes its transitions from
  `useStackMotion()` (`src/motion/stack.ts`), one kind per route:

  | Kind | Routes | Phone | Low-end Android | Reduce Motion |
  |---|---|---|---|---|
  | `push` | every step deeper (default) | slide from the right over a parallaxed, dimmed page, 320ms; back is the exact reverse; edge swipe anywhere | fade 200ms | fade 150ms |
  | `sheet` | Ask a doubt, New message | iPhone: system page sheet (page behind steps back, swipe down). Android: slides up, 300ms | fade 200ms | fade 150ms |
  | `overlay` | Search, attendance code, the signed-out group | fade 180ms | fade 200ms | fade 150ms |
  | `play` | games, cases, tests, checkpoints, map practice, prep sets, mocks | fades up from the bottom, 260ms, no edge swipe | fade 200ms | fade 150ms |

  The account groups (student, lecture, admin) switch with no animation: the
  PIN gate lifting away is the only move.
- **Predictive back (Android 14+)**: on (`predictiveBackGestureEnabled` in
  app.config.ts). At the root of the app the system shows its back-to-home
  preview as the finger moves. Inside the app, react-native-screens 4.30 has
  no in-app predictive preview, so the gesture plays the push's reverse on
  release. Keep `BackHandler` listeners scoped to a focused screen
  (`useHardwareBack`), or the system preview at the root is lost.

### Screen arrival choreography
`Screen` plays one short sequence on arrival, on the UI thread, alongside the
native slide: the header (title and lead) fades in and lifts 10px (220ms,
`presets.head`), then the body follows 70ms behind with an 8px lift (240ms,
`presets.body`), so the screen has landed by about 310ms. Low-end Android:
fades only (180ms, the body 40ms behind). Reduce Motion: nothing moves. No
need to add your own whole-screen fade; `Enter` and `RowList` inside the body
still stagger their own rows.

### List to page continuity
```tsx
<FromRow title={page.name}><T v="display">{page.name}</T></FromRow>
const entering = useFromRow(title, presets.head()); // for your own view
```
A pressed `Row` notes its title and where it sat on screen
(`continuity.mark`, kept one second). A page whose title matches lets its
title glide from the row's height into its own place (at most 160px, from
0.94 and a light opacity, `springs.morph`) while the page slides in, so the
row reads as having opened into the page. Used by `Screen`'s title, the
medicine page, a notification, a doubt and an admin's student page. Low-end
Android: the plain header fade. Reduce Motion: still.

### Sheets
`Sheet` in `@/ds` springs up from its own measured height (`springs.sheet`, no
time spent off screen), and the scrim and the sheet move from one value, so
they always agree. Drag runs on the UI thread (gesture-handler Pan): on the
grabber always, on the whole sheet once its content is scrolled to the top. It
follows the finger 1:1 (rubber band upward), closes past 25% of its height or
on a flick over 0.4px/ms, else springs back. A selection haptic on open. With
the keyboard up it sits on top of it (`useKeyboardPad`).

### Toast
`toast.show("Saved")`. It rises 12px and fades in (180ms) and leaves the same
way (140ms); a new toast pushes the old one out. It sits above the front
screen's pinned footer and the tab bar, both measured (`Screen` and
`MotionTabBar` report them to `src/ds/bottom-chrome.ts`), and rides up with
the keyboard, so it never covers a footer button.

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

## Web build
`presets.*` return nothing on react-native-web (the screenshot build): its CSS
emulation of layout animations left rows and badges misplaced after a
re-render. Phones get every animation. Each preset call with the same
arguments returns the same object, so re-renders never restart an animation.

## Tests
The jest mock of Reanimated reports Reduce Motion on, so components render
their still versions in tests. `__tests__/motion-kit.test.tsx` covers the
kit's helpers (path lengths, tier scaling, celebration order, toast
placement) and renders each part. Layout animation builders chain freely in the
mock (`jest.setup.ts`).
