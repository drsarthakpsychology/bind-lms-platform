# 3D scenes: performance on a mid-range phone over mobile data (November 2026)

The four 3D scenes are `nervoussystem`, `brainexplorer`, `actionpotential` and `synapse3d`. I measured them before and after a performance pass. The two flat scenes, `genogram` and `hpaloop`, are measured too, as the baseline.

## How it was measured

- **Profile:** Chromium headless, 390 × 844 CSS pixels at 2× pixel density, touch input. CPU slowed down 4× through the Chrome DevTools Protocol (CDP), and the network throttled to the DevTools "Fast 3G" preset: 1.44 Mbps down, 675 kbps up, 562.5 ms round trip.
- **Build:** each scene was rendered on its own in a small test page, built for production by Vite (Rollup) and served with gzip. The page's main bundle holds every study widget (151 KB gzipped), roughly what a study page carries.
- **Bytes:** encoded bytes per response, taken from CDP network events.
- **Times:** milliseconds from navigation to two points. "Controls" is when the scene's buttons are on screen. "3D ready" is the first drawn 3D frame (`data-scene-ready`).
- **Frame rate:** animation frames per second over 4 s just after starting an animation. "Drag" is frames per second while turning the model, measured over 3 s after 6 s of turning has let the quality settle.
- **CPU per frame:** main-thread busy time (CDP `TaskDuration`) divided by frames.
- **Memory:** JS heap (CDP `JSHeapUsedSize`).
- **Idle and hidden:** frames drawn per second once the animation has finished, and frames drawn in 3 s with the scene scrolled off screen.
- **Device under test:** the "before" and "after" runs report 8 cores and 6 GB of memory (`navigator.hardwareConcurrency`, `navigator.deviceMemory`), which looks like a mid-range Android phone. With those values the scenes start at full quality.

**Caveat: the frame rates are a worst case.** There is no GPU here, so WebGL runs on SwiftShader, which draws on the CPU. That is far slower than even a budget phone GPU (Adreno 610 or Mali-G57 class). The machine was also shared with other jobs (load average 5 to 7 on 2 cores), so single runs vary by about ±30%. Where a number was measured more than once, the table gives the range. The CPU-per-frame column is the most phone-relevant frame number, because the 4× slowdown models a mid-range phone CPU.

## Budgets

| Target | Before | After |
|---|---|---|
| Under about 400 KB compressed extra JS for the first 3D scene | 244 KB gzip | 243 to 245 KB gzip in the test page; 247 to 249 KB gzip (208 to 209 KB Brotli) in the Next build. **Met.** |
| Interactive within 3 s on Fast 3G with 4× slower CPU | Controls after 2.5 s, but the 3D box sat blank ("Loading the 3D …") until 5.0 to 5.6 s | Controls and the flat drawing are usable at 2.5 to 2.6 s, the same as a page without 3D. The 3D fades in over the flat drawing at 5.0 to 6.6 s. **Met for interaction.** |
| 30 fps or better | 3.5 to 25 fps (SwiftShader) | 32 to 60 fps once quality settles (SwiftShader); 8 to 29 ms of main-thread time per frame at 4× slower CPU. **Met.** |
| Stop rendering when hidden | 0 frames off screen, but the stage kept drawing while idle (5 to 30 frames a second) | 0 frames off screen and 0 frames a second when idle. **Met.** |

## Numbers

### Bytes on Fast 3G (KB, as sent over the network, gzip)

| Scene | Shared 3D chunk | Scene chunk | Page JS | CSS |
|---|---|---|---|---|
| nervoussystem | 241 | 3.4 | 151 | 28 |
| brainexplorer | 241 | 3.2 | 151 | 28 |
| actionpotential | 241 | 2.0 | 151 | 28 |
| synapse3d | 241 | 2.0 | 151 | 28 |
| genogram (no 3D) | **0** | 0 | 151 | 28 |
| hpaloop (no 3D) | **0** | 0 | 151 | 28 |

Before and after are the same within 1 KB. What is in the shared 3D chunk (minified, before compression):

| Part | Size |
|---|---|
| three | 726 KB |
| @react-three/fiber, which brings its own copy of React's renderer | 168 KB |
| three-stdlib (orbit controls) | 14 KB |
| drei | 1 KB |
| everything else | 13 KB |

### Time (ms from navigation), frame rate, memory

| Scene | Controls before | Controls after | 3D ready before | 3D ready after | Turning fps before | Turning fps after | Idle fps before | Idle fps after | CPU ms per frame after | JS heap after (MB) |
|---|---|---|---|---|---|---|---|---|---|---|
| nervoussystem | 2550 to 2590 | 2550 to 2630 | 5000 to 5350 | 5300 to 6600 | 8.3 | 28 to 44 | 10.7 | 0 | 8.5 to 23 | 11 to 14 |
| brainexplorer | 2490 to 2560 | 2510 to 2630 | 5640 to 5970 | 5740 to 6600 | 3.5 | 43 to 50 | 6.3 | 0 | 29 to 77 * | 9 to 22 |
| actionpotential | 2490 to 2540 | 2550 to 2600 | 4980 to 5420 | 5010 to 5170 | 17.5 | 50 to 60 | 29.7 | 0 | 12 to 25 | 11 to 12 |
| synapse3d | 2490 to 2510 | 2490 to 2650 | 5000 to 5280 | 4990 to 5470 | 8.9 | 24 to 40 | 5.0 | 0 | 11 to 29 | 9 to 11 |
| genogram | 2530 | 2530 to 2580 | none | none | not measured | not measured | not measured | not measured | 4.2 to 4.6 | 5 |
| hpaloop | 2490 | 2520 to 2610 | none | none | not measured | not measured | not measured | not measured | 4.7 to 5.7 | 4.2 |

\* The brain's high CPU number includes rebuilding its folded surface while the quality steps down. Between steps it stays near the other scenes.

- **Frames while hidden:** 0 in every 3D scene, before and after.
- **Frame rate just after starting an animation** (before the quality settles), SwiftShader: before 3.4 to 25 fps, after 6.5 to 24 fps.
- **Triangles drawn:** brain 69 000 before; after, 48 000 at full quality and about 12 000 at low. Body 22 000 before; after, 22 000 at full and 11 000 to 17 000 at lower levels.

## What changed

1. **The flat drawing is shown while the 3D loads** (`Scene3DSlot` in `kit.tsx`). The flat scene is fully interactive at once. The 3D view fades in over it after its first frame, so a slow connection never shows an empty box.
2. **On-demand rendering.** The stage draws every frame only while something moves: a signal, a heartbeat, a spike, a release. Otherwise it draws on touch, or for a moment after a change (fades, peeling, camera flights; `Waker`). It still draws nothing off screen.
3. **Automatic quality step-down** (`Governor` in `three-kit.tsx`).
   - **Starting level:** set from `navigator.deviceMemory` and `hardwareConcurrency`. Devices reporting 2 cores or 2 GB start at low; 4 cores or 4 GB start at medium.
   - **Stepping down:** two seconds of back-to-back frames under 40 fps drop one level. First the pixel ratio drops (2, then 1.5, then 1), with geometry detail scaled at the same time (segments ×1, ×0.7, ×0.45).
   - **One way only:** it never steps up, so it cannot oscillate.
   - **Visible state:** the stage shows its level as `data-quality`.
4. **No multisample antialiasing on dense screens** (pixel ratio 2 or more), where it costs the most and shows the least.
5. **Lighter geometry.**
   - The brain's hemispheres went from 150 × 100 to 120 × 80 segments at full quality.
   - A nerve's glowing overlay is now built only once a signal reaches that nerve, which roughly halves the body scene's geometry.
   - The synapse's bulb is single-sided at the lower levels.
6. **Fewer React renders per frame.**
   - The neuron's 3D view reads the simulation from a ref inside its frame loop, so it no longer re-renders on every simulation step.
   - An idle neuron stops updating altogether.
   - The 3D views are memoised.
7. **Two bugs found while measuring:**
   - Camera flights and signal pulses used the renderer's clock, which restarts when the frame loop changes mode. After a peel, tapping a deep structure (or scrolling the scene back into view) could throw the camera far off and back to the starting view. Both now use wall-clock time.
   - The stage's camera and renderer options are now fixed at mount.

## Is the 3D code kept out of other pages?

**Import graph:**
- `three`, `@react-three/fiber` and `@react-three/drei` are imported only by `three-kit.tsx` and the four `*-3d.tsx` files.
- `three-kit.tsx` is imported only by the `*-3d.tsx` files.
- Each `*-3d.tsx` file is reached only through a dynamic `import()` inside `React.lazy`, which replaced `next/dynamic`. It is rendered only on the client, when WebGL is available and reduced motion is off. No file imports a `*-3d` module statically.

**Next production build (webpack):**
- Turbopack refuses this worktree because `node_modules` is a symlink to a folder outside the project root. `next build --webpack` with mocked Google Fonts compiled every client bundle.
- three ended up in three split chunks (88 + 52 + 100 KB gzip), plus a 10 KB shared scene chunk and a 2 to 4 KB chunk per scene.
- `react-loadable-manifest.json` lists them only under the four lazy `*-3d` imports.
- None of the 245 route client-reference manifests lists them as entry JS, and neither does the build manifest. So no page loads them up front.
- The build then stopped at its type-check step on an unrelated, pre-existing error: `src/app/api/psychopharm/document/publish/route.ts` exports `validateDocument`, and route files may only export handlers and route config.

## Not done, and options for later

- **Tree-shaking three.** The fiber `Canvas` registers the whole three namespace (`extend(THREE)`), so every class ships. A custom canvas with an explicit list of the classes the scenes use could save an estimated 60 to 90 KB gzip. It was not attempted, because it means re-implementing parts of the library's canvas, and the budget is already met.
- **Starting the 3D download earlier.** The 3D chunk starts loading when the scene first renders. Loading it any earlier would mean loading it on study pages that have no 3D scene.
- **Real-device check.** The frame rates above come from software rendering. One check on a real mid-range Android phone over 4G would confirm the expected headroom.

## Reproducing

The test page lives in `.scene-harness/` (not committed). The measuring scripts are a gzip static server and a measuring script, kept in the agent's scratch folder:

- Build the page: `npx vite build --config .scene-harness/vite.config.mts --outDir dist`.
- Serve `dist` with gzip, then run the measuring script.
- The page sets `window.__scenePerf = []` before loading. The stage then logs frame rate, draw calls, triangles, pixel ratio and quality once a second, and counts frames in `window.__sceneFrames`. Without that flag the probe does nothing.

## Re-measure after the effects pass (8 November 2026)

The six 3D scenes (`nervoussystem`, `brainexplorer`, `actionpotential`, `synapse3d`, `brainslicer`, `amesroom`) gained glow sprites, particle flows, tap ripples, an outline on the selected brain part, depth fog, a rim light, eased camera arcs, idle sway, sound and quick challenges. They were measured on the same profile as above: 390 × 844 at 2×, 4× slower CPU and Fast 3G, on SwiftShader. "Before" is the build just before the pass (commit bfafd58). "After" is commit a1de72e. Both builds were served side by side and measured in turns.

**Caveat:** the machine was shared and much busier than in the first round, with a load average of 2.6 to 6 on 2 cores. The same build gave very different numbers on repeat runs; for example, the brain's animation ran at 14 fps in one run and 50 fps in the next. The tables give the range of 2 or 3 runs per build, and differences inside those ranges are noise.

### Budgets

| Target | After the effects pass |
|---|---|
| Under about 400 KB compressed extra JS for the first 3D scene | 243.8 KB gzip for the shared 3D chunk plus 2.1 to 6.1 KB per scene. The effects add about 3 KB. **Met.** |
| Interactive within 3 s | Controls at 2.6 to 2.9 s; the 3D fades in at 5.1 to 6.2 s, the same as before. **Met.** |
| 30 fps or better | While turning the model: 17 to 55 fps after against 11 to 52 fps before, at quality 0 to 1. Main-thread time per frame: 5.6 to 69 ms after against 4 to 29 ms before; the two ranges overlap run to run. **Met while turning. Animation frame rates overlap with before, within the noise.** |
| Stop rendering when hidden or idle | 0 frames off screen in every scene. 0 frames a second when idle, except the brain: there the measuring script presses Play, and the journey is still playing at reading pace when idle is measured, as it was before. The idle sway stops for good after 14 s or the first touch. **Met.** |

### Numbers (ranges over runs)

| Scene | Turning fps before | Turning fps after | Animation fps before | Animation fps after | CPU ms per frame before | CPU ms per frame after | Quality at end, after |
|---|---|---|---|---|---|---|---|
| nervoussystem | 18 to 44 | 17 to 35 | 16 to 19 | 6 to 17 | 11 to 20 | 17 to 44 | 0 |
| brainexplorer | 20 to 52 | 46 to 55 | 14 to 50 | 14 to 50 | 21 to 29 | 32 (one run at 168 while it stepped down) | 0 |
| actionpotential | 47 | 43 | 30 | 24 | 13 | 15 | 0 |
| synapse3d | 40 | 43 | 33 | 41 | 4 | 6 | 0 |
| brainslicer | 11 to 43 | 28 to 39 | 9 to 13 | 4 to 12 | 21 to 29 | 27 to 69 | 0 |
| amesroom (peephole is fixed, so no turning) | none | none | 18 to 49 | 5 to 38 | 6 to 12 | 7 to 55 | 0 to 2 |

### Found and fixed while measuring

1. **A soft studio environment map was removed.** It was a reflection map made with three.js `RoomEnvironment` and `PMREMGenerator`. Building it took seconds of main-thread time on the throttled CPU, right when the student first touched the scene. On SwiftShader it also cut frame rates sharply (Ames room 1 to 2 fps at full quality). The warm key light and cool rim light give most of the look for nothing.
2. **Tap ripples no longer raycast during drags.** The first version put a pointer handler on the whole model, so every pointer move tested every triangle. On the brain slicer that cost up to 1.2 s of main-thread time per frame while turning. Ripples now use plain DOM events and one raycast per tap.
3. **The quality governor missed very slow devices.** It treated any frame slower than 0.25 s as a pause, so at 1 to 3 fps it never stepped down. It now also steps down after 4 slow frames in a row (0.1 to 1 s each) once warmed up.
4. **Glow and particles ask for frames only while they move.** Particle flows for the rTMS pulse train and the ECT current run for 4 s and 3.2 s, then stop. Ripples last 0.65 s. The outline pulses for 1.2 s and then holds.
