# App speed

How the app makes screens open on data that is already there, the rules every
new screen follows, and the before and after numbers. The server side
(ETag and 304, lean answers) is in `docs/app/PERFORMANCE_SERVER.md`.

## The idea

Fast apps do not load faster; they load earlier and wait less often:

1. **Show the saved copy at once, refresh quietly** (stale while
   revalidate). Every answer is kept on the phone (TanStack Query persisted
   cache, 24 hours, wiped on sign-out) and a screen opens on it with no
   skeleton, then swaps in the fresh answer when it lands.
2. **Ask before the screen asks.** All tabs load together the moment an
   account opens; a tap starts the next screen's load before the navigator
   has drawn it; the obvious next step (Continue) loads as soon as it is
   known.
3. **Ask once.** A screen that opens on a fresh copy does not call the
   server; the same address asked twice at once is one call; an unchanged
   answer comes back as an empty 304.
4. **Hide the wait you cannot avoid** inside something the student already
   waits for (the Blitz 3-2-1 count, the PIN screen).

## Rules for new code

- **Every read is a ready-made query** in the data layer: `qo.*`
  (`src/api/queries.ts`), `learnQo.*` (`src/api/learn.ts`), `readQuery` /
  `toolQuery` (`src/practise/api.ts`), `adminQo.*` (`src/admin/api.ts`).
  The screen's hook and the prefetcher use the same one, so the key and the
  fresh time can never drift apart.
- **Fresh times by kind of data**: 30 seconds (the default) for what changes
  as the student works (Home, progress, Practise, doubts); 2 minutes for
  course outlines; 5 minutes for module outlines; 10 minutes for reading and
  notes; an hour for the medicine library and the quick reference; 10
  minutes for `/config`. A screen that changes something invalidates the
  reads it changed at once (lecture done, section done, quiz sent), so a long
  fresh time never shows old progress.
- **Never kept on the phone**: video addresses, checkpoint and test
  questions, game deals, prep sets, setup tokens (`NEVER_PERSIST` in
  `queries.ts`). Their ETag copies live only in memory for this sign-in.
- **Open screens with `go(href)`** (`src/api/prefetch.ts`) or `openTarget`
  (`src/nav/targets.ts`), not a bare `router.push`, when the screen loads
  data. It starts the load in the same tap. A new screen that loads data
  adds its address to `routeReads` in `prefetch.ts`.
- **A new tab** adds its first reads to `tabReads` in `prefetch.ts`.
- **A new "next step"** an answer names (like `next.target`) goes into
  `nextReads`, so Continue is instant.
- **Loading states**: use `Loaded` / `LoadSwap` (nothing for 120ms, then a
  skeleton for at least 380ms, docs/MOTION.md). With the above, most screens
  never reach the skeleton.
- **Parallel, not in a row**: a screen's reads start together (several
  `useQuery` calls in one component run in parallel). Never wait for one
  answer to start another unless the second needs the first.
- **Deals are not cached** (`useLoad` in Practise): a round is used once.
  Hide its wait in the start animation instead (Blitz deals during 3-2-1).
- **No `refetchOnMount: "always"` and no refetch on every focus.** The app
  refreshes on coming back to the front (`src/api/lifecycle.ts`), on pull to
  refresh, and when a fresh time runs out.
- **Startup**: route screens are loaded by Expo Router only when first
  drawn; the Practise mock content (270 KB) is required only in mock builds.
  Keep large data (word lists, tool tables) behind a `require` inside the
  screen that uses it, never in a module the root layout imports.

## ETag and 304

`src/api/client.ts` keeps the last answer of each GET address with its
`ETag` (in memory, 200 addresses, cleared on sign-out) and sends
`If-None-Match` on the next GET of that address. An empty `304` hands back
the held copy, so a repeat open of a large tool costs a few hundred bytes.
A 304 for a copy the client no longer holds is asked again in full. The
mock server answers ETags the same way, so the web build and the tests use
this path.

## Measuring

Web export with the mock server (`EXPO_PUBLIC_API_MODE=mock npx expo export
-p web`), headless Chromium at 390 x 844, median of 3 runs.
`?as=student&delay=300` makes every mock call (not the sign-in) wait 300ms,
like a slow phone network; `window.__vibhaCalls()` lists the calls made;
`performance.mark("vibha-open")` is the moment the account is open. Time to
content is from that mark (or from the tap) to the screen's first data-driven
element being visible. The web build adds about 350 to 400ms of its own for
the sign-in redirect and the first draw, the same in both columns: compare
the columns, not the absolute numbers with a phone.

"Cold" is a first open with nothing saved; "warm" is opening again with the
saved copy on the phone (an app restart).

## Before and after (16 Nov 2026)

Milliseconds to the first real content, web export, median of 3. Each cell
is before → after.

### Opening the app on a screen

| Screen | Cold, 0ms | Cold, 300ms | Cold, 800ms | Warm (saved copy), 800ms |
|---|---|---|---|---|
| Home | 428 → 391 | 731 → 393 | 1203 → 846 | 381 → 384 |
| Practise | 411 → 457 | 753 → 438 | 1226 → 849 | 392 → 404 |
| Learn | 397 → 399 | 735 → 432 | 1189 → 822 | 386 → 393 |
| Lectures | 418 → 381 | 884 → 371 | 1189 → 867 | 359 → 343 |
| Medicines | 486 → 404 | 711 → 385 | 1219 → 843 | 394 → 387 |
| Me | 455 → 390 | 712 → 398 | 1204 → 833 | 397 → 369 |
| Admin Home | 502 → 391 | 911 → 375 | 1235 → 888 | 387 → 395 |
| A module (link straight to it) | 392 → 373 | 893 → 877 | 1206 → 1190 | 369 → 358 |
| The reader (link straight to it) | 402 → 403 | 740 → 694 | 1194 → 1190 | 356 → 360 |

Warm opens were already instant (the saved copy); they stay so. A cold
open now waits for one network trip instead of about two (the account opens,
then the screen mounts, then asks). A link straight into a module or the
reader still waits for its own answer: nothing can know it earlier.

### Moving inside the app

| Move | 0ms | 300ms | 800ms | Calls after the tap (300ms) |
|---|---|---|---|---|
| Home → Practise tab, at once | 438 → 420 | 718 → 422 | 1192 → 403 | 8 → 0 |
| Home → Learn tab, at once | 398 → 390 | 720 → 391 | 941 → 396 | 8 → 0 |
| Home → Medicines tab, at once | 435 → 415 | 745 → 411 | 1209 → 448 | 8 → 0 |
| Home → Me tab, at once | 1240 → 1266 | 1316 → 1264 | 1298 → 904 | 8 → 0 |
| Home → Practise tab, after 3s | 92 → 77 | 48 → 87 | 80 → 57 | 0 → 0 |
| Learn → Lectures | 399 → 416 | 401 → 410 | 433 → 430 | 5 → 0 |
| Study → a module | 637 → 380 | 1244 → 616 | 1432 → 701 | 1 → 0 |
| A module → its next section | 617 → 386 | 939 → 642 | 1446 → 1124 | 4 → 3 |
| Blitz: Play → first question | 2086 → 2050 | 2358 → 2338 | 2855 → 2191 | 1 → 1 |

Tabs no longer depend on the network at all: their data is already there by
the time anyone taps. Study → module halves (the module loads in the same
tap). Blitz no longer adds the deal's wait after the 3-2-1 count (it hides
up to about 2 seconds of network inside the count). The Me tab takes about
1.2s even with no network delay: that is drawing time on the screen itself,
not data, and is left for the screen's owner.

### Calls

- Opening the app now makes about 16 calls at once (every tab plus the
  next step: the lecture and course Continue points at), against 11 before,
  all in parallel and once per session. Tab switches and the module open
  make none.
- No duplicates: a read asked by two screens at once is one call. The reader
  makes one GET and one PUT of the learn record (the save of "where you are
  reading"); that is a save, not a repeat.
- No refetch on every focus: screens refresh when a fresh time runs out, on
  pull to refresh, and when the app comes back to the front.
- With the server's ETags, a repeat GET of an unchanged answer is an empty
  304.

## Looked at and not done

- **expo-image**: the app's images are bundled stickers (already in memory)
  and lecture materials, which are protected files that must not be written
  to the phone's disk cache. Adding it would need a new native build for no
  gain on what the app shows today.
- **Placeholder data from list rows** (a module row's title on the module
  screen before it loads): the list rows carry too little for the detail
  screens, which would show a half screen and then jump. Prefetch on tap
  gives the full screen instead.
- **Inline requires for the whole bundle**: Expo Router already loads each
  screen's code when it is first drawn, and there is no large data module
  imported at startup. A global switch would change module start-up order
  (crash handlers, Reanimated) for a small gain.
- **Persisting ETag copies across launches**: the saved Query cache already
  opens the screen at once; the first refresh after a restart is a full
  answer, every one after that a 304.
