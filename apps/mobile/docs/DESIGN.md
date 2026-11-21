# VIBHA phone app: the "Layers" look

This is the spec every builder follows. Read it once, then copy from the
recipes. The kit lives in `src/ds` (parts) and `src/motion` (movement). The
tokens live in `src/theme/tokens.ts`. See every part in its real states at the
route `/kit` (file `src/screens/kit.tsx`). The finished reference screen is
Today (`src/screens/home/home.tsx`). Motion numbers are in `docs/MOTION.md`.

This phase is design only. Do not change the API client, server routes, the
website or the database. Where a screen needs data the app does not have yet,
see "Mock data" and "To connect" at the end.

## 1. The idea in five lines

1. A deep blue **field** is the place you are in. It is always behind.
2. A soft white **layer** rises over the field. It holds what you do now.
3. **Stone** surfaces rest on the layer. They hold things: a card, a row group.
4. **Lime** is the one live thing on a screen: go, now, done. One, not three.
5. **Ink** is your current choice: the picked answer, the button on a result.

Depth comes from real overlap and one soft shadow. No glass, no blur, no
outlines around cards, no gradients.

## 2. Colour roles (`useTheme()`)

| Role | Token | Light | Dark | Use |
|---|---|---|---|---|
| Field | `c.field` | `#1d44d8` | `#17257a` | The background of every student screen's top zone |
| Text on field | `c.onField`, `c.onFieldMuted` | white, 80% white | same | Greeting, title, lead line |
| Patch on field | `c.fieldTint` | 14% white | 12% white | The "now" pill, round buttons, a progress track |
| Layer | `c.layer` (same as `c.bg`) | `#fbfaf6` | `#13151d` | The sheet that rises over the field |
| Stone | `c.stone` (same as `c.card`) | `#efede6` | `#21242f` | Cards, options, pebbles, quiet buttons |
| Raised | `c.raised` | `#ffffff` | `#2a2e3b` | A thing above stone: a sheet, a menu |
| Lime | `c.lime` (same as `c.primary`), text `c.onLime` | `#cdf24b` | `#cdf24b` | The one live action, progress, the current tab |
| Ink | `c.ink`, text on it `tone="onInk"` | `#12131a` | `#f2f3f7` | Text, the picked option, the result button |
| Muted, faint | `c.muted`, `c.faint` | `#565864`, `#666874` | `#aeb2c0`, `#8f93a3` | Second and third level text |
| Wrong pick | `c.missBg` | `#ffd9c9` | `#5c2a1a` | A wrong answer. Warm, never red alarm |
| Link | `c.link` | blue | soft blue | Text links only |
| Danger | `c.danger`, `c.alertBg`, `c.alertFg` | | | Delete, sign out, real errors |
| Area washes | `c.areas[area]` | | | A small icon patch per area. Never a whole card |

Older names (`bg`, `card`, `primary`, `brand`, `hairline`, `tint`, `band`...)
still work and carry the new colours. Never write a hex value in a screen.

**Dark mode is its own design.** The field becomes a deep night blue, the
layer a blue-black, stone is lighter than the layer (height is shown by a
lighter surface, not a shadow), the progress ring turns lime, links turn soft
blue. Check every screen in both.

## 3. Type (`<T v="...">`)

| Role | `v` | Face | Size |
|---|---|---|---|
| Greeting, screen title | `display` | Bricolage Grotesque 600 | 32 |
| Long title | `h1` | Bricolage 600 | 27 |
| Card title, question | `h2` | Bricolage 600 | 21 |
| Row title, strong label | `h3`, `bodyStrong` | Figtree 700, 600 | 17, 16 |
| Everything read | `body`, `reading` | Figtree 400 | 16, 17 |
| Second line | `small` | Figtree 500 | 14 |
| Group label | `label` | Figtree 700 | 13 |
| Tiny | `caption` | Figtree 600 | 12 |
| Buttons | `button` | Figtree 700 | 16 |
| IN and OUT | `fonts.big` | Bricolage 700 | 46 |
| VIBHA wordmark | `fonts.wordmark` | Archivo | only in `Wordmark` |

Bricolage is for greetings, titles and questions only. Figtree is for
everything read and tapped. Sentence case everywhere. No all-caps labels.
Font files and their OFL licences are in `assets/fonts`.

## 4. Shape, space, shadow

- Corners: layer top `layout.radiusLayer` 30, stone card `layout.radiusLg` 26,
  small things (options, fields, chips) `layout.radius` 18, buttons are pills.
- Pebbles are hand-shaped: four uneven corner sets, `pebbleShape(i)`.
- Space steps only: `space[1..8]` = 4, 8, 12, 16, 24, 32, 48, 64. Side margin
  `layout.gutter` 20. Between groups on a layer `space[5]` 24.
- Touch targets 48 or more (`layout.target`). Main button 52.
- One shadow: `layerShadow(c)`, cast by a layer onto the field, and by a rising
  sheet. The tab bar has its own. Nothing else has a shadow.

## 5. The kit

Import from `@/ds` and `@/motion`.

| Part | What it is | One-line use |
|---|---|---|
| `Screen` | Field plus layer, safe areas, scroll, pull to refresh, footer | `<Screen title="Lectures" lead="12 of 40 done" field={...}>...</Screen>` |
| `Screen plain` | No field, all layer (reader, long forms, admin lists) | `<Screen plain title="Timetable">` |
| `BlueField`, `Layer` | The same two pieces for a screen that lays itself out | `<BlueField>...</BlueField><Layer>...</Layer>` |
| `TabTop`, `TopBar` | Wordmark, search, bell on the field | `<Screen tab top={<TabTop />}>` |
| `FieldCard` | The one "now" pill on the field | `<FieldCard live title="OPD is open" meta="5 to 8 pm" action={{ label: "Scan in", onPress }} />` |
| `FieldProgress` | Lime bar on the field with "14 of 20" | `<FieldProgress done={14} total={20} />` |
| `RoundButton` | 40px round close or back | `<RoundButton onField label="Close" onPress={close}><X /></RoundButton>` |
| `Label` | Quiet heading over a group | `<Label>Keep going</Label>` |
| `Stone` | A card resting on the layer | `<Stone><T v="h2">Title</T></Stone>` |
| `Stone grow` | A card that grows into the screen it opens | `<Stone grow={() => router.push("/lecture/l5")}>` |
| `Stone quiet` | Outlined, for the second thing | `<Stone quiet onPress={open}>` |
| `Pebbles` | Two to four quick-action circles | `<Pebbles items={[{ label: "Scan", icon: QrCode, live: true, onPress }]} />` |
| `ChoicePebbles` | Two big choices (IN, OUT) | `<ChoicePebbles label="Arriving or leaving" value={way} onChange={setWay} options={[...]} />` |
| `Button` | Pills: `primary` lime, `quiet` stone, `ink`, `text`, `danger`; `small` | `<Button label="Check" disabled={picked === null} onPress={check} />` |
| `HoldButton` | Press and hold one second to confirm | `<HoldButton label="Hold to mark IN" tapLabel="Mark IN" onConfirm={save} />` |
| `Flood` | The colour floods the area when a mark is confirmed | `<Flood on={done} tone="lime" title="You are IN" meta="9:54 am" />` |
| `Row`, `RowList` | Lists, menus, settings | `<RowList><Row title="Leave" meta="2 pending" chevron onPress={open} /></RowList>` |
| `Section` | A titled group of rows | `<Section title="Account">...</Section>` |
| `OptionList` | Answers: choose, then Check | `<OptionList options={opts} picked={i} onPick={setI} checked={done} answer={1} />` |
| `HintBubble`, `HintText` | The hint bulb and its words | `<HintBubble open={h} onToggle={() => setH(!h)} />` then `{h ? <HintText>...</HintText> : null}` |
| `ResultSheet` | The verdict rising from the bottom | `<ResultSheet open={done} right={ok} title={ok ? "Yes, that fits" : "Not quite"} why={why} action={{ label: ok ? "Next" : "Try it again", onPress }} />` |
| `ProgressRing` | A ring that draws in | `<ProgressRing pct={28} size={58} stroke={5} />` |
| `ProgressLine` | A bar that fills (0 to 100) | `<ProgressLine value={40} label="40 percent done" />` |
| `RollingNumber` | Digits roll to the value | `<RollingNumber value={18} />` |
| `Stat` | A number with its label | `<Stat value="86%" label="Attendance" />` |
| `QuietEmpty` | Empty state on the layer; may hold Jyo | `<QuietEmpty title="Nothing due today" body="..." art={<Jyo pose="resting" size={56} />} />` |
| `EmptyState`, `LoadError` | The older plain ones, still fine | `<LoadError what="your notes" onRetry={refetch} />` |
| `Loaded`, `Skeleton`, `LoadSwap` | Loading that becomes content | `<Loaded q={q} skeleton={<RowsSkeleton />}>{(d) => ...}</Loaded>` |
| `Sheet` | Bottom sheet you can drag down | `<Sheet open={o} onClose={close} title="Filters">...</Sheet>` |
| `toast` | One short line above the tab bar | `toast.show("Saved")` |
| `Field` | A text input | `<Field label="Reason" value={v} onChangeText={setV} />` |
| `Chips`, `TabRow` | Filters and in-page tabs | `<Chips label="Filter" options={o} value={v} onChange={setV} />` |
| `Jyo`, `Flame` | The companion, and its flame alone | `<Jyo pose="hello" size={72} />` |
| `TabBar` | The floating dark bar with the lime pill | in `app/(student)/_layout.tsx` only |

### Do

- One lime thing per screen. If two things want lime, one of them is `quiet`.
- Put the title and at most one short thing on the field. Everything else goes on the layer.
- Use `Label` for group headings on a layer, not `h2`.
- Use `Stone` for a thing you tap as a whole, `Row` for a line in a list.
- Give every pressable a `testID` and an `accessibilityLabel` that says what it does.
- Say the result in words as well as colour ("Correct answer", "Your answer").

### Do not

- No long text on the blue field. No forms on the field.
- No card inside a card. A stone holds content, not another stone.
- No borders around stones, no drop shadows, no gradients, no blur.
- No new colours, radii or font sizes in a screen file.
- No Bricolage for body text or buttons.
- No emoji as icons. Icons come from `lucide-react-native`, stroke 1.9 to 2.
- Do not put the app's API calls inside kit parts.

## 6. Motion

Motion is a headline of this app. Be generous with it, and use the ready
parts so it stays one voice. Rules that never bend:

1. UI thread only: Reanimated worklets, transform and opacity. No `setState` per frame.
2. Reduce Motion gives a fade or an instant change. The meaning never depends on movement.
3. Low-end Android (`useMotionTier().low`) gets fades. The parts below already do this.
4. Nothing delays a task. Taps work while things are still arriving.
5. No motion inside reading text, case notes, medicine and dose tables, or admin numbers.
6. Haptics: none on plain navigation or opening things. `haptic.select()` when a choice is picked, `haptic.success()` or `haptic.warn()` when a result lands. The parts already do this.

| Moment | Ready part | One-line use |
|---|---|---|
| A tapped card becomes the next screen | `Stone grow`, `growOr` on the route | `<Stone grow={() => router.push(href)}>`; in `app/_layout.tsx`: `options={({ route }) => ({ ...growOr(route.key ?? route.name, m.push, reduce) })}` |
| The card settles when you come back | built into `Stone grow` (or `useGrowCard`) | nothing to add |
| A layer rises and settles | built into `Screen` and `Layer` (`presets.layer`) | nothing to add |
| Deeper screen slides in, back follows the finger | `useStackMotion().push` (the default) | nothing to add |
| Short task or focused mode rises from the bottom | `m.sheet`, `m.play` on the route | `options={{ ...m.play, headerShown: false }}` |
| Blocks arrive one after another | `Enter` | `<Enter i={2}>...</Enter>` |
| Rows arrive one after another and close gaps | `StaggerList` | `<StaggerList>{rows}</StaggerList>` |
| A ring or bar draws in | `ProgressRing`, `ProgressLine`, `ProgressFill` | see the kit table |
| A number rolls | `RollingNumber` | `<RollingNumber value={points} />` |
| The lime pill slides between tabs | built into `TabBar` | nothing to add |
| Something soft squishes under the thumb | `Press squish` | `<Press squish scale={0.9} onPress={go} innerStyle={...}>` |
| A row or card sinks under the thumb | `Press`, `usePressScale` | `<Press onPress={open} innerStyle={...}>` |
| Hold to confirm, colour floods | `HoldButton`, `Flood` | see the kit table |
| A result rises | `ResultSheet` | see the kit table |
| A real win | `ResultSheet win`, `Burst`, `Confetti`, `useCelebrate` | `<ResultSheet win open right ... />` |
| Pull to refresh with Jyo's flame | built into `Screen onRefresh` | `<Screen onRefresh={refetch} refreshing={q.isRefetching}>` |
| A long wait | `Flame` | `<Flame on={saving} />` |
| A sheet follows the finger | `Sheet` | see the kit table |
| Skeleton becomes content | `Loaded`, `LoadSwap`, `SkeletonIn`, `Reveal` | `<LoadSwap ready={!!d} skeleton={<RowsSkeleton />}>...</LoadSwap>` |
| One question swaps for the next | `Swap` | `<Swap k={index} dir={1}>...</Swap>` |
| A hint or tip opens | `HintText` | see the kit table |

Timings: press 100 to 150 ms; chosen or switched 150 to 220; arriving 240 to
320; leaving faster than arriving; a new screen or sheet 300 to 460 on the
sheet curve or a spring with no bounce; a real win up to 900 ms, once; rows
40 ms apart, 8 at most. Springs and durations are in `src/motion/tokens.ts`
(`springs.layer`, `springs.sheet`, `springs.snappy`, `springs.bouncy`). Do
not invent new numbers.

Tabs: the screens switch at once (no slide between tabs). Only the pill moves.

Big moments are rare: one celebration per real win. Right answers in the
middle of a set do not get sparks; finishing the set does.

## 7. Jyo, the clay lamp

`<Jyo pose="hello" | "thinking" | "wellDone" | "resting" size={72} />`.
The flame sways for three breaths and then rests. Still under Reduce Motion.

**May appear (at most once on a screen):** the welcome and first sign-in
(hello); an empty screen such as nothing due, no notes, no doubts (resting);
a real win such as a module finished, a certificate earned, a full week of
attendance (wellDone); a first-time tip, once, that can be dismissed (hello);
a wait longer than two seconds (thinking).

**Never:** inside a case or patient story, anything about risk or self harm,
medicines and doses, attendance results, leave decisions, errors, "you missed
this", anywhere in admin or the lead doctor's screens, on certificates, beside
a button as decoration, twice on one screen.

`Flame` (the flame alone, no face) is allowed for waits anywhere a spinner
would be.

## 8. Navigation

Student tabs: **Today, Learn, Practise, Notes, Me**. Route files keep their
old names so every link still works: Today is `/home`, Notes is `/library`.

- Today: greeting, the now pill with Scan in, Keep going, quick actions, After that.
- Learn: lectures, modules, hand-ins. A shelf of courses.
- Practise: cases, games, exam prep.
- Notes: a hub (`src/screens/notes/hub.tsx`) for Revision notes (`/notes`),
  Quick reference (`/reference`) and Medicines (`/medicines`, the old library
  list), plus Saved and Compare. Medicine links that used to open the tab now
  open `/medicines`.
- Me: clinic first, then progress, certificates, settings.

Search and the bell stay in the top bar on every tab. Add any new route to
`app/_layout.tsx` with its motion kind, and to `src/nav/targets.ts` if the
website links to it. Admin keeps its own tabs and stays plain and dense.

## 9. Recipes

Each recipe is a skeleton. Fill it, do not restyle it.

**List screen** (lectures, assignments, notifications)
`<Screen title lead>` then `<Loaded q={q} skeleton={<RowsSkeleton />}>`; inside,
`<Label>` plus `<StaggerList>` of `<Row>`; the first or current item may be a
`<Stone grow>` card. Empty: `<QuietEmpty>`.

**Hub or dashboard with numbers** (Me, Progress, admin home)
Field: title and one `FieldCard`. Layer: one `Stone` with a `ProgressRing`
and the headline number as `RollingNumber`; then a row of two or three `Stat`
in stones (`flexDirection: "row", gap: space[3]`); then `Label` plus `RowList`.
Numbers use `num` on `T` so digits line up.

**Long reading** (module section, a note, a policy)
`<Screen plain>` with a small top bar; body in `T v="reading"`, max width
`layout.readingWidth`; headings `h2`; a `ProgressLine` under the bar for how
far through. No motion in the text. Tools (text size, save) in a `Sheet`.

**Video lecture page**
Video on black at the top, edge to edge (`Screen bleed`, `fixed` colours);
the layer rises under it with the title (`h1`), a `TabRow` (About, Materials,
Assignment), then rows. The one lime thing is Play or Continue.

**Question screen** (checkpoint, practice set, mock)
Field: `RoundButton` close, `FieldProgress`, the case text if short. Layer:
the question in `h2` with `HintBubble`, `OptionList`. Footer: `Button`
"Check", disabled until a choice is made. Then `ResultSheet` with "Next" or
"Try it again". Wrap the question in `Swap k={index}`. Route kind `m.play`.

**Case player** (long case, detective, OSCE)
Same as the question screen, but the case sits on the layer in a `Stone` that
can be folded, and the question follows it. Never Jyo, never sparks inside a
case. The result explains why, in one or two lines.

**Game shell** (`src/practise/frame.tsx`)
Field: close, score as `RollingNumber`, timer. Layer: the play area. How-to
and leave are `Sheet`s. The end is a `ResultSheet win` or a full result
screen with `Confetti` once. Route kind `m.play`, no edge swipe.

**Form** (leave request, ask a doubt, profile)
`<Screen plain title>`; `Field`s with `space[4]` between; one `Button` in the
`footer`, with `needsServer` so it waits for the internet; errors under the
field in words; success is a `toast` and going back. Route kind `m.sheet`.

**Editor** (admin: timetable entry, certificate, message)
A form, plus a preview `Stone` at the top that updates as you type, and
"Save" in the footer. Destructive actions are `Button kind="danger"` behind a
confirm `Sheet`.

**Table turned into a phone list** (attendance register, marks, students)
Each table row becomes a `Row`: the name as title, the two most useful
columns as `meta`, the key number as `trailing`. The rest opens on tap.
Filters are `Chips` under the title. Sort lives in a `Sheet`. Totals go in a
`Stone` above the list.

**Admin list** (queue, students, doubts)
`<Screen plain>`; dense `RowList`, counts first, the action on the row. No
big cards, no Jyo, almost no motion (`RowList still` for lists that change as
you type).

**Admin control screen** (what is live, limits, access)
`Section` per group; each line is a `Row` with a `Switch` or a stepper as
`trailing` and one line of `meta` saying what it does; a limit shows its
current value and opens a small `Sheet` to change it. Changes save at once
with a `toast`; anything that affects students asks first in a confirm `Sheet`.

**Upload flow** (assignment hand-in, case sheet photo)
Three states on one `Stone`: pick (a dashed quiet stone with "Choose a file"
and "Take a photo"), uploading (`ProgressLine` and the file name, with
Cancel), done (a tick, the file name, "Replace"). Submit is the lime button in
the footer. Failed uploads say why and keep the file.

**Calendar and timetable** (schedule, leave, sessions)
A week strip of seven day pills on the field (today in lime, the picked day
in ink); the layer lists that day's sessions as `Row`s with the time as the
leading text. Arrows change the week (48px targets). A month view is a
`Sheet`.

**Chat or wall feed** (doubt thread, class wall, admin messages)
`<Screen plain>`; messages are stones (mine on the right in `c.areas.learn.wash`,
others on the left in stone), 18px corners with one tighter corner; the
compose box is the `footer` with a round lime send `Press`; new messages
arrive with `Enter kind="rise"`.

**Certificate**
The certificate is a printed page (`c.paper`), shown whole on the layer, not
restyled. Actions under it: "Download" (lime), "Share" (quiet). No Jyo here.
The earning moment is a celebration screen in `src/moments`.

**Result** (attendance marked, test finished)
For a mark: `Flood` over the layer with the word and the time, and one
outlined action. For a score: a result screen on the field with the number
as `RollingNumber`, a `ProgressRing`, and what to do next on the layer.

**Attendance choice** (when the clinic screens are rebuilt)
Field: back, session name, "code scanned 9:54 am". Layer: "Arriving or
leaving?" in `h2`, `ChoicePebbles` IN and OUT, `HoldButton`, a muted line
"Press and hold for one second. Letting go early cancels.", then `Flood`.
With Reduce Motion or a screen reader the hold is a normal tap (built in).

## 10. Mock data

When a screen needs data the app has no API for yet, put it in one file named
`mock.ts` beside the screen, export plain typed objects, start the file with
the comment `// MOCK DATA: design phase only. See docs/DESIGN.md, To connect.`
and add a line under "To connect" below. Never mix mock values into a real
query hook, and never invent numbers on a screen that also shows real data
without marking them.

## 11. To connect (for the backend phase)

| Screen | What is designed | What it needs |
|---|---|---|
| Notes tab (`src/screens/notes/hub.tsx`) | The search pill opens Quick reference | One search across notes, reference and medicines |
| Notes tab | Three shelves that link to three old lists | One merged library with filters (Criteria, Disorders, Medicines, Terms) |
| Today (`src/screens/home/home.tsx`) | "Your day" still uses the old clinic block (`src/clinic/today.tsx`) | Restyle with the clinic screens; no new data |
| Attendance (`/clinic/scan`) | Kit parts only (`ChoicePebbles`, `HoldButton`, `Flood` in `/kit`) | The two-step scan contract (identify, then confirm IN or OUT) |
| Today, quick actions | Scan is always shown | Hide or dim Scan on days with no clinic, from the clinic day data |

No mock data files exist yet. Add a row here for each one you create.

## 12. Before you call a screen done

- `npx tsc --noEmit`, `npx eslint .`, `npx jest` pass (run through the gate script).
- Looked at in the browser build at 390 wide, light and dark, with real and empty data.
- One lime thing. Title on the field. Nothing clipped under the tab bar.
- Works with Reduce Motion and with large text (no cut-off words).
- testIDs kept; new pressables have labels.
