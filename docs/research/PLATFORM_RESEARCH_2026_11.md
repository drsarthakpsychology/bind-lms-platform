# Platform research, November 2026: 3D, gamification, content at scale, difficulty and focus

> Status: **research for owner decisions**. Nothing here is built yet.
> Written 7 Nov 2026 on branch `agent/research2`. Read alongside
> [STUDENT_LEARNING_PLAN.md](../plans/STUDENT_LEARNING_PLAN.md) (especially section 8),
> [CONTENT_WIDGETS.md](../design/CONTENT_WIDGETS.md) and
> [2026-11-learning-platform.md](../releases/2026-11-learning-platform.md).
> Sources are numbered [S1], [S2] and so on, with links in the last section.
> Effort is given as S (1 to 2 build days), M (3 to 7), L (8 to 20) and XL (more than 20). No week timelines, per owner decision.

---

## Executive summary: the top 10 recommendations

Ranked by expected impact on learning and engagement, highest first.

| # | Recommendation | Why (evidence) | Effort |
|---|---|---|---|
| 1 | **Fix the hint and clue economy.** One daily hint budget (3 free) plus a bank of earned "spare hints" (start with 5, cap 10), shared by every game. Hints before trying cost budget; help after a wrong try stays free. Hints lower the credit for that item. Clue reveals in the Daily case need a guess first from clue 4 on. All counted on the server, failing closed. | Students who abuse hints learn about 38 percent less [S26]. Today a student at 0 XP loses nothing by revealing clues, and hint limits switch off completely while the `games` table is missing (see 3.2). | M |
| 2 | **Make the student model real, and fix three calibration gaps.** Apply the pending migrations. Then: add a guessing correction for multiple choice, judge mastery against the skill's own questions, and feed real item difficulty to league points (it currently reads columns that do not exist, so every question counts as "easy"). | Adaptivity, leagues, item statistics and the hint budget all depend on these tables. The guessing correction is the standard fix for multiple-choice Elo [S39]. | M |
| 3 | **Build a content factory, not a content backlog.** Three production lines: rule-based item templates (Rx, emergencies, ward, differentials), AI drafts with machine checks, and a small set of hand-made anchor cases. A clinician reviews every family. Live item statistics retire weak items automatically. | One template can safely produce thousands of items [S33, S34]. AI-written questions are faster but easier, shallower and wrong more often without review [S35, S36]. | L, then ongoing |
| 4 | **One item record and one tagging scheme for every bank.** Topic, skill, learning objective, thinking level, difficulty, exam, level, safety flag, family and source. | Lets one question serve Exam Prep, Smart practice, games and reviews, and makes "2,500 without repetition" measurable. | M |
| 5 | **A structured difficulty ladder inside each skill.** Recognise → recall → apply → tell look-alikes apart → full case. Move up a rung when the predicted chance of success at the current rung reaches 0.8. Keep the overall success rate near 75 percent. | Mastery learning has a reliable effect (about 0.5 SD) [S43]. Higher success rates led to more practice without hurting gains [S41]. | M |
| 6 | **Daily quests that pay in spare hints, not just XP.** Three small quests a day tied to learning habits (clear due reviews, one stretch question, today's case). | Goals tied to the learning task drive most of the gamification benefit [S27, S28, S48]. Gives 0 XP students a way to earn help. | S |
| 7 | **Focus mode for reading and questions.** Starting a question session or opening a Study section hides the sidebar, the top bar and the phone tab bar, leaving one Exit button and a progress bar. | Directly serves the owner's "far less on screen" and "one obvious next step" rules (plan section 8). | S |
| 8 | **3D only where space is the lesson: three flagship scenes first.** A 3D brain explorer with guided "key views", a neuroimaging slicer (MRI planes, atrophy patterns, TMS and ECT placement), and a depth illusion room (Ames room). Everything else stays in the existing 2D widgets. Lazy loaded, with a 2D fallback. | 3D helps factual and spatial anatomy knowledge on average [S1], but free rotation hurts students with lower spatial ability [S3], plain screen 3D can lose to a 2D atlas [S2], and immersive VR raised presence but lowered learning [S5]. | L |
| 9 | **For patient interaction, invest in the conversation, not the 3D body.** Grow the AI patient with generated persona cards and short MSE observation clips. Use 2D illustrated patients with clear affect states. Pilot a 3D avatar only as a test. | Virtual patients improve clinical skills a lot (SMD 0.90) but knowledge no more than usual teaching [S6]; the gain comes from making decisions, not from graphics [S7]. | M, then L |
| 10 | **Show-once, in-context tips instead of tours.** One line at the moment of first use, remembered per person on the server. No slide-deck tutorials. | Tutorial decks did not improve task success and made apps seem harder [S46]. | S |

The single most important point: **items 1 and 2 are cheap and unblock everything else.** Items 3 and 4 decide whether the 2,500 target is reachable. 3D (item 8) is the most visible but has the weakest evidence for our curriculum, so it should follow, not lead.

---

## What we already have (summary of the code review)

| Area | What exists | Where |
|---|---|---|
| Adaptive engine | Elo (1-parameter IRT) per student skill and per item. Student step 0.9/(1+0.08n), item step 0.4/(1+0.05n). Ability fades after 3 idle days (half-life 45 days). Ratings hidden until 30 answers. | `src/lib/learn/model/elo.ts` |
| Mastery | Mastered = P(right on an average question, b = 0) ≥ 0.85, at least 3 correct first tries over at least 2 days. "Needs review" after 21 days. | `mastery.ts` |
| Picker | 60 percent core (P 0.70 to 0.85), 20 percent due reviews, 10 percent stretch (0.50 to 0.65), 10 percent easy wins (above 0.90). Look-alike topics interleaved. Overall about 75 to 77 percent expected success. | `picker.ts` |
| Reviews | FSRS-4.5 with default weights, 90 percent target retention. | `fsrs.ts` |
| XP and levels | 10 XP per right answer, combo bonus, daily goal 20/40/60, streak with a freeze earned every 7 days (max 2). | `src/lib/learn/engine.ts` |
| Leagues | 5 tiers (Neuron to Mind), groups of about 20, top 5 up, bottom 5 down. Points = effort XP + server XP + first-try bonus weighted by difficulty. | `src/lib/leagues/*` |
| Shop | Streak repair 60 XP (once a week), 3 extra hints 30 XP (switched off), bonus case 80 XP (switched off), profile looks. | `shop.ts` |
| Ranked play | Glicko-1 for duels; forfeits are losses; decay after 7 idle days. | `src/lib/games/duel/rating.ts` |
| Daily case hints | 3 free hints a day, then 5 XP each. Clue reveals and investigations cost score only. | `src/lib/games/daily/engine.ts`, `src/app/(dashboard)/games/daily/actions.ts` |
| Content | About 3,740 exam questions, 1,550 worked Q&As, 2,480 visuals, about 60 Daily cases, 33 detective cases, 13 Rx mysteries plus chains and puzzles, 3 Ward Week campaigns (about 47 decisions), 36 MSE excerpts, 4 escape rooms, 65 Comorbid cards, 20 AI patient case files. | `src/content/*`, `src/lib/games*` |
| Navigation | Sidebar already has auto, full and slim icon-rail modes, remembered per device. | `src/components/navigation/sidebar-state.ts` |

---

## 1. 3D and immersive learning

### 1.1 What the evidence says

| Finding | Source |
|---|---|
| Across studies, 3D visualisation beat other methods for factual anatomy knowledge (effect size about 0.50) and spatial knowledge (about 0.30). | Yammine and Violato 2015 meta-analysis [S1], effect sizes as reported in [S2] |
| In a randomised trial, **plain desktop 3D lost to a 2D atlas**. Stereoscopic AR helped mainly students with lower spatial ability. | Bogomolova and colleagues 2020 [S2] |
| Psychology students learning brain anatomy did best with a few fixed **key views**. Free "multiple views" rotation scored lowest, and hurt students with low spatial ability by roughly 30 percentage points. | Levinson and colleagues 2007 [S3] |
| Stereo depth and the learner's spatial ability decide much of whether 3D helps. Most phone and laptop screens give no stereo depth. | Review on stereopsis and VR in anatomy [S4] |
| Adding immersive VR to a lab simulation raised presence (d = 1.30) but **lowered learning** (d = 0.80) and raised mental load. | Makransky, Terkildsen and Mayer 2019 [S5] |
| Virtual patients (51 trials, 4,696 learners) improved **skills** strongly (SMD 0.90) but **knowledge** no more than usual teaching (SMD 0.11). | Kononowicz and colleagues 2019 [S6] |
| A two-hour Body Interact virtual patient session raised clinical reasoning scores from a mean of 5.3 to 7.8. | Watari and colleagues 2020 [S7] |
| A gamified, story-led lab simulation (Labster) raised learning 76 percent alone and 101 percent combined with teaching (vendor-hosted summary; small study). | Bonde and colleagues 2014 [S8] |
| PhET's design rule: guide without the student feeling guided. Clear handles, sensible limits, very little text, instant visible feedback, linked views. | Podolefsky, Moore and Perkins [S9] |
| Interesting but irrelevant extras ("seductive details") lowered learning across 58 studies and 7,500 students, most when placed next to the real diagram. | Sundararajan and Adesope 2020 [S10] |

**What this means for us.** 3D earns its place only when (a) the spatial layout *is* the thing to learn, and (b) the student *does* something in it: finds, predicts, slices, places. It hurts when it is free-spinning decoration, when it is fully immersive, or when it adds load without adding meaning. Our curriculum is psychology and psychiatry, so most content is processes, not spatial anatomy. The existing animated 2D widgets (journey, release, receptor, hypnogram, stress) already carry most of the value. 3D should be a short list of high-value scenes.

### 1.2 What the leading products do

| Product | What it is known for | Lesson for us |
|---|---|---|
| Complete Anatomy [S49] | Deep 3D atlas, native apps, heavy downloads | Great reference, wrong weight class for a phone browser |
| BioDigital Human [S49] | 3D body in the browser (WebGL), embeddable, licensed | Proof that browser 3D anatomy works; licence cost and generic style |
| Zygote [S49] | Paid professional anatomy models | Quality option if free models fall short |
| Body Interact [S49] | Virtual patient with vitals, tests and treatment decisions | The decisions drive the learning [S7] |
| Oxford Medical Simulation [S49] | VR and on-screen clinical scenarios with debrief | VR hardware is not realistic for our students; the debrief is the transferable part |
| Osmosis, Lecturio [S49] | Short videos plus question banks and spaced repetition | Our module plus Smart practice loop matches this |
| AMBOSS [S32] | Large question bank; difficulty set from peer answer data (1 to 5 hammers) | Show difficulty from real data, not author guesses |
| Kenhub [S49] | Labelled atlas images plus quizzes and spaced review | 2D labelled images plus retrieval do most of the work |
| Labster [S8] | Story-led 3D virtual labs | Story and tasks matter more than graphics [S5] |
| PhET [S9] | 2D HTML simulations with implicit guidance | The model for our widgets |

### 1.3 Where 3D genuinely helps in our curriculum

Rating: **High** = spatial layout is exam content and the student does a real task in 3D. **Medium** = 3D adds clarity or delight, but 2D works nearly as well. **Low** = keep 2D.

| Place | Value of 3D | What the student does |
|---|---|---|
| **Brain and neuroanatomy** (lobes, limbic system, basal ganglia, thalamus, ventricles, brainstem nuclei) | **High** | Snap between 6 key views (no free spinning by default). Peel layers. "Find it" tasks: tap the hippocampus, then the fornix. Lesion to symptom: pick a region, predict the deficit (Broca's, prefrontal damage, H.M.'s hippocampus), then reveal. |
| **Neuroimaging slicer** | **High** | Slide a plane through the brain in coronal, axial and sagittal views side by side with a schematic MRI. Spot hippocampal atrophy, enlarged ventricles in schizophrenia, frontotemporal patterns. MD Psychiatry level. |
| **Transmitter systems in the brain** (four dopamine pathways, raphe serotonin, locus coeruleus noradrenaline, basal forebrain acetylcholine) | **High** | Turn a system on and watch its projections light up in a see-through brain. Add a D2 blocker and see which pathway's effect changes. Builds on the 2D `pathways` widget. |
| **Brain stimulation placement** (TMS over left DLPFC, ECT bitemporal vs right unilateral, DBS targets) | **High** | Place the coil or electrodes on a head, get feedback on target and side-effect trade-offs. |
| **Stroke and vascular territories** (ACA, MCA, PCA) | **Medium to High** | Tap a vessel, see the territory, predict the neuropsychiatric picture (apathy, aphasia, neglect). |
| **Depth illusions** (Ames room, hollow face) | **High** for these two | Judge first, then walk the camera around to see the trick. These illusions are about 3D, so 2D cannot show them. |
| **Synapse and receptor pharmacology** | **Medium** | Close-up synapse built in code (not a heavy model). Drag a drug onto the receptor, watch occupancy and signal. The 2D `receptor`, `release` and `synapse` widgets already teach this well, so 3D is an upgrade, not a gap. |
| **Neuron and action potential** | **Medium** | 3D axon with myelin and channels opening. The 2D `neuron` widget is already sound. |
| **Autonomic and stress systems** | **Medium** | A see-through body; switch sympathetic and parasympathetic; organs respond. A 2.5D layered body is nearly as good and much lighter. |
| **Drug journey through the body** | **Medium** | Same sequence as the 2D `journey` widget, on a simple body outline. The learning is the sequence, not the anatomy. |
| **Eye and ear** (sensation and perception) | **Medium** | Follow light or sound to the receptor; tap structures. |
| **Ward or clinic environment** | **Medium** (engagement, not learning) | An illustrated 2.5D ward for Ward Week: tap a bed, chart or nurse to open a decision. Full 3D adds load without adding decisions. |
| **Patient interview room** | **High for the interaction, Low for 3D** | Talk to the AI patient. Watch affect change. See 1.4. |
| **MSE observation** | **High for the task, Medium for 3D** | Watch a short clip or animated patient, code appearance, behaviour, psychomotor activity, speech and affect, then compare with an expert coding. Real actor video beats any avatar for subtle non-verbal cues. |
| **Child development** (Strange Situation, conservation) | **Low** | Keep the existing 2D widgets. |
| **Sleep and EEG** | **Low** | The data is a time series. Keep the 2D `hypnogram`. |
| **Research methods and statistics** | **Low** | Keep 2D curves and experiments. |

### 1.4 Patients and avatars

- **Virtual patients work because students make decisions and get feedback** [S6, S7]. The graded AI patient in the Consulting Room is already the right core.
- **3D human avatars are costly and risky:** uncanny faces, heavy downloads, poor Indian representation in free libraries, and lip sync on mid-range phones.
- **Recommendation:** 2D illustrated patients (a few poses, about 8 clear affect states: flat, anxious, elated, irritable, tearful, guarded, perplexed, calm), drawn in our Neo-Brutalist Pastel style, plus voice. Then run a small A/B pilot with a 3D avatar from Microsoft Rocketbox (see 2.4) only if the owner wants to test it.

### Decision needed from the owner (section 1)

1. **Scope of 3D.** (a) Three flagship scenes first: brain explorer, neuroimaging slicer, depth illusion room; then decide on more from usage data. (b) A broad 3D upgrade of many widgets. (c) No 3D. **Recommendation: (a).**
2. **Default camera.** (a) Guided key views with snap buttons, free rotation as an optional extra. (b) Free rotation by default. **Recommendation: (a)** [S3].
3. **Patients.** (a) 2D illustrated patients with affect states now, 3D avatar pilot later as a test. (b) 3D avatars now. **Recommendation: (a).**
4. **MSE observation media.** (a) Short filmed role-plays with consenting actors (best fidelity, needs a shoot). (b) Animated 2D patients only. **Recommendation: (a) for 20 to 30 core clips, (b) for volume.**

---

## 2. Technology and performance

### 2.1 Stack

- **three.js with @react-three/fiber v9 and drei.** R3F v9 is the React 19 release [S12]. Import drei helpers one by one.
- **Load only where needed.** Each scene is a client component behind a dynamic import with server rendering off. Three.js must never load on Home, the Study list or question screens.
- **Size.** A tree-shaken three.js build has been reported at about 92 KB gzipped [S15]; with R3F and a few drei helpers expect roughly 150 to 250 KB gzipped. Measure with the bundle analyser before and after.
- **Renderer.** Target **WebGL 2**. WebGPU now ships in Chrome, Edge, Safari 26 and Firefox 141 on Windows, but on Android only Chrome 121+ on Android 12+ with Qualcomm or ARM GPUs, and not yet in Firefox for Android [S11]. three.js can try WebGPU and fall back, but nothing we build should need it.

### 2.2 Models, compression and textures

| Choice | Recommendation | Why |
|---|---|---|
| Format | glTF binary (`.glb`) | The web standard; one file per scene part |
| Geometry compression | **Meshopt** by default; Draco only for large static scans | Meshopt's decoder is about 32 KB and decodes very fast; Draco files are smaller but its decoder is about 200 to 290 KB plus a wrapper and decodes slower [S14] |
| Textures | **KTX2**: ETC1S for colour, UASTC for normal maps | 4 to 8 times less GPU memory than plain images (a 2048 texture: about 22 MB as RGBA, 5.6 MB UASTC, 2.8 MB ETC1S) [S14] |
| Pipeline | `gltf-transform` or `gltfpack` in a script, checked in CI against the budget | Stops heavy files reaching students |
| Hosting | R2 or the CDN with long immutable caching and brotli | Second visit costs no data |

**Procedural vs model-based geometry.**

- **Procedural (built in code):** neuron, synapse, receptors, molecules, pathways as glowing tubes, EEG, the Ames room. Tiny download, easy to animate, and it matches our flat pastel style. **Use by default.**
- **Model-based (loaded files):** real anatomy only (brain parts, skull, head for stimulation, body outline). **Use only where accuracy needs real shapes.**

### 2.3 Free anatomy models and their licences

| Source | Licence | What it requires |
|---|---|---|
| **BodyParts3D** (DBCLS, Japan) | CC BY-SA 2.1 Japan | Credit line "BodyParts3D, Copyright© The Database Center for Life Science licensed by CC Attribution-Share Alike 2.1 Japan". **Any changed models we publish must carry the same licence** [S16]. OBJ files, one per part. |
| **Z-Anatomy** (built from BodyParts3D, in Blender) | CC BY-SA 4.0 | Credit both Z-Anatomy and BodyParts3D; changed models stay CC BY-SA. **Some parts are non-commercial** (inner ear CC BY-NC-SA, kidney CC BY-NC): VIBHA charges fees, so leave those out [S17]. |

What ShareAlike means in practice:

1. A "Credits" page and a small credit line under each 3D scene.
2. The cleaned, compressed `.glb` files we derive are themselves CC BY-SA, so anyone may reuse those model files. We should offer them for download from the credits page.
3. Our app code and our own lesson content are separate works and generally stay ours, but get a short legal check before launch.

### 2.4 Avatars for patient simulations

| Option | Status and licence | Fit |
|---|---|---|
| Ready Player Me | **Shut down 31 January 2026** [S19] | Do not use |
| Microsoft Rocketbox | **MIT licence**, 115 rigged avatars with facial blendshapes, FBX [S18] | Best free option for a pilot; limited Indian representation; needs conversion and compression |
| VRoid Studio (VRM) | Alive; licence set per model by its creator [S19] | Anime style, wrong tone for clinical work |
| MetaHuman | Free, but tied to Unreal Engine [S19] | Not suitable for a phone browser |
| Our own 2D illustrated patients | Ours | **Recommended first** |

### 2.5 Phones, data and battery in India

- About 78 percent of phones shipped in India in 2025 cost under ₹30,000 [S21]. Plan for 4 to 6 GB RAM Android phones with mid-range Mali or Adreno GPUs as the common case.
- Median mobile download in India was about 132 Mbps in August 2025 [S20], but indoor 4G, crowded networks and daily data packs mean we should still treat every MB as costly.
- Mid-range phones heat up and slow down under constant GPU use. The fixes are known [S13]:
  - render only when something changes (`frameloop="demand"`);
  - pause when the scene is off screen or the tab is hidden, and after 20 seconds idle;
  - lower the pixel ratio automatically when frame rate drops (`PerformanceMonitor`, adaptive DPR);
  - reuse geometry and materials, use instancing, keep draw calls low;
  - no real-time shadows or post effects on phones; bake lighting; use simple flat materials (which also suit our style).

### 2.6 Practical budget

| Device class | Typical devices | Download per scene (first view) | Triangles | Textures (GPU memory) | Draw calls | Target fps | Pixel ratio cap |
|---|---|---|---|---|---|---|---|
| **A: entry and mid Android** | 3 to 6 GB RAM, under ₹20,000 | **≤ 3 MB** | ≤ 60,000 | ≤ 2 × 1024 KTX2 (≤ 60 MB) | ≤ 60 | **30** steady | 1.25 |
| **B: good phones, tablets, older laptops** | 6 to 8 GB, iPads | **≤ 6 MB** | ≤ 150,000 | ≤ 4 × 1024 or 2 × 2048 (≤ 120 MB) | ≤ 120 | 60, floor 30 | 1.5 |
| **C: laptops, desktops, flagships** | | **≤ 10 MB** | ≤ 300,000 | ≤ 150 MB | ≤ 200 | 60 | 2 |

Extra rules for every scene:

- The JavaScript for 3D (three.js plus R3F) loads only after the student taps "Explore in 3D". Before that, show a still image (WebP, under 80 KB).
- Pick the class from WebGL 2 support, `navigator.deviceMemory` (Chrome only), CPU cores, the Save-Data setting and a 2-second frame-rate probe. Unknown means class A.
- If WebGL 2 is missing, the frame rate stays under 20, or Save-Data is on, show the existing 2D widget instead. Every 3D scene must have a working 2D twin.
- Stream detail: a light model first, the detailed parts on demand (for example, load the brainstem nuclei only when the student opens that layer).

### 2.7 Accessibility of 3D

A canvas is invisible to screen readers, so every scene needs a parallel set of normal page controls:

- a list of structures as real buttons; choosing one moves the camera and announces a text description (the existing widgets already describe every state in words);
- keyboard control: arrow keys step between key views, Tab moves between hotspots, Enter selects;
- **no drag-only actions**: every drag (rotate, slice, place a coil) also has buttons or a slider (WCAG 2.2, success criterion 2.5.7 Dragging Movements) [S50];
- reduced motion: no auto-rotate, camera cuts instead of fly-throughs, no pulsing (WCAG 2.2, 2.3.3) [S50];
- colour-blind mode: labels and patterns, never colour alone (owner rule);
- touch targets at least 44 px; no pinch-only zoom;
- `@react-three/a11y` can help with focus and announcements inside the canvas [S51].

### Decision needed from the owner (section 2)

1. **Licence.** (a) Accept CC BY-SA: credit lines, a Credits page, and publish our derived model files under the same licence. (b) Pay for commercial models (Zygote or similar). **Recommendation: (a)**, leaving out all non-commercial parts.
2. **Low-end phones.** (a) Class A gets "lite 3D" within the budget above, with a 2D fallback. (b) Class A always gets 2D only. **Recommendation: (a)**, falling back automatically.
3. **WebGPU.** (a) WebGL 2 only for now. (b) Build for WebGPU first. **Recommendation: (a).**

---

## 3. Gamification and engagement

### 3.1 What drives retention, with evidence

| Mechanic | Who uses it | Evidence | Our status |
|---|---|---|---|
| Points, badges, leaderboards in general | Everyone | Medium overall effects: g 0.49 on learning [S48]; g 0.50 across 30 interventions, with no clear winner among game elements [S27]. In health professions, assessment plus challenge is the common and useful pairing; most studies are weak [S28]. | Have XP, levels, badges |
| **Streaks** | Duolingo, Brilliant | Letting one lesson keep the streak (instead of the full daily goal) raised day-14 retention 3.3 percent and learners on a streak 10.5 percent [S22]. Broken streaks reduce continuation; **a repair option softens that** [S25]. | Have streak, freezes and a weekly repair |
| **Leagues** | Duolingo (10 tiers, weekly, similar-habit groups) | Duolingo reports it "worked for a lot of learners" but publishes no numbers [S24]. The plan already avoids public bottom lists. | Have 5 tiers, groups of 20 |
| **Hearts vs energy** | Duolingo | Duolingo replaced hearts (lose one per mistake) with energy (spent per lesson, earned back by answering well), because beginners were twice as likely to run out of hearts mid-lesson [S23]. | We have no hearts (guardrail: nothing stops learning) |
| **Daily quests** | Duolingo, many games | Short daily goals with visible progress; strongest when tied to the learning task [S27, S28] | Daily goal ring only |
| **Spaced review** | Anki, Quizlet, Lecturio, Osmosis | FSRS predicts memory better than Anki's old SM-2 for 99.6 percent of users across about 350 million reviews [S30] | Have FSRS |
| **Mastery levels** | Khan Academy (Attempted, Familiar, Proficient, Mastered; unit tests can move them up or down) [S31] | Mastery learning about 0.5 SD [S43] | Have mastery states |
| **Adaptive difficulty** | Brilliant, Math Garden, AMBOSS | Higher success rates led children to practise more [S41]; AMBOSS sets difficulty from peer data [S32] | Have the Goldilocks picker |
| **Social live play** | Kahoot | A review of 93 studies found mostly positive effects on learning and attitudes, with some stress from time pressure [S29] | Have duels, escape room, team modes |
| **Hint abuse** | Every tutor | "Gaming the system" (rapid hint requests until the answer appears) linked to 38 percent less learning; harmful gaming correlated r = −0.33 with post-test scores [S26] | **Not protected (see 3.2)** |

### 3.2 The hint problem, as it stands in the code

1. **Daily case hints are only limited when the `games` table exists.** In `games/daily/actions.ts` the check runs only when `stored` is true. The `games` migration is still pending, so right now hints are unlimited for everyone.
2. **Clue reveals and investigations never cost XP.** They lower the case score, but a solved case always scores at least 10, and the shared daily case pays 5 XP plus score/10. A student can reveal all six clues, order every test, and still earn XP and keep the daily streak. At 0 XP there is nothing to deduct, so there is no brake at all.
3. **Hints barely touch the score.** They only cancel the "right chapter" consolation; the main score depends on clues and tests.
4. **Two wallets.** Hint spending is stored in the case table (`xp_spent`), while the shop spends through `xp_ledger`. Neither sees the other, so the same XP can be spent twice. League points expect hint rows in the ledger (`hint:` is excluded), but none are written.
5. **The escape room already does it right:** its hint opens free only after 2 wrong tries on a door. Help after an attempt is productive; help before any attempt is the abuse pattern [S26].

### 3.3 Three balanced mechanisms

All three share these rules: **XP never goes below zero, using help never removes earned XP, and ranked modes (Duel, Blitz) have no hints.**

**Mechanism A: Daily hint budget (refills).**

| Rule | Number |
|---|---|
| Free hints per day, shared across all games and Smart practice | 3 |
| Refill | 00:00 IST, no carry-over |
| Buy more | 3 hints for 30 XP, once a day |
| At 0 XP and no budget | No more "before trying" hints today; "explain after a wrong try" stays free |

Simple and already half built. Weak point: a new student at 0 XP has 3 hints and then nothing.

**Mechanism B: Earned spare hints (a hint wallet, separate from XP).**

| Rule | Number |
|---|---|
| Starting spare hints for a new student | 5 |
| Bank cap | 10 |
| Earn: complete all 3 daily quests | +2 |
| Earn: clear 10 due reviews | +1 (once a day) |
| Earn: solve today's Daily case with no hints | +1 |
| Earn: 5 first-try right in a row in Smart practice | +1 (max 2 a day) |
| Most a student can earn in a day | 5 |
| Cost | 1 per hint |

Rewards good habits and works at 0 XP. Needs daily quests and more interface.

**Mechanism C: Hint energy (regenerates over time).**

| Rule | Number |
|---|---|
| Energy cap | 5 hints |
| Regeneration | 1 hint every 3 hours (up to 8 a day) |
| Speed up | 1 hint for 10 XP |

Smooth and stops binges, but timers feel like mobile-game pressure, which clashes with owner decision 24 (timers only in fast-fact rounds).

### 3.4 Recommendation: A plus B, with an "attempt first" rule

1. **Spend order:** the 3 free daily hints first, then spare hints, then offer "3 for 30 XP" (once a day, from the single XP wallet).
2. **Hint ladder per item:** hint 1 is a nudge (where to look); hint 2 narrows it (removes two wrong options or shows the deciding criterion). Each costs 1. Never more than 2 per item. The answer itself is only shown on "Give up", which pays nothing.
3. **Help after a wrong try is always free.** After one wrong attempt, a short "why that is wrong" plus a pointer opens at no cost (as escape rooms do now). A struggling student at 0 XP is never left without help.
4. **Hints lower the credit, not the balance.**
   - Elo outcome for that item: 1 hint = 0.6, 2 hints = 0.3 (so the engine does not think the student has mastered it).
   - No first-try league points for that item.
   - Daily case: minus 10 score per hint.
5. **Clues in the Daily case:**
   - From clue 4 on, the next clue needs a guess (or "Not sure yet") first. This turns clue spam into practice.
   - Practice cases pay score/10 with no minimum. The daily base 5 XP and the daily-case streak need at least one real guess before the last clue.
   - Elo outcome = score/100.
6. **Interaction with XP, leagues and streaks.**
   - XP: unchanged except the optional purchase. Hint spends go to `xp_ledger`.
   - Leagues: hints and spare-hint earnings never count as league points (already excluded for `hint:` sources).
   - Streaks: unchanged. Any finished activity keeps the streak; the daily-case streak needs a real guess.
   - Shop: switch on "3 extra hints" once the single wallet exists.

**Anti-abuse rules.**

| Rule | Detail |
|---|---|
| Server only | Every count and earning lives on the server. If the table is missing, hints are **off**, not unlimited. |
| One ledger, two currencies | Add a `currency` column (`xp` or `hint`) to `xp_ledger`; every earn and spend is one row with a unique `ref`, so nothing is paid twice. The case table's `xp_spent` stops being a wallet. |
| Rushing check | At least 4 seconds between reveals. More than 3 reveals in 10 seconds pauses the game with a one-line nudge. |
| Earning caps | Per source and per day, as in the table above. Reviews only earn if they were due. Already-mastered items do not earn. |
| No farming via practice repeats | A practice case replayed the same day earns nothing. |
| Ranked play | No hints in Duel or Blitz. |
| Watch list | Admin "Learning insights" shows students with a high hint rate and low first-try accuracy, for a kind nudge, never a penalty. |

**Daily quests (needed for B).** Three a day, chosen from: clear your due reviews; get one stretch question right; play today's Daily case; finish a Study section; answer 10 in Smart practice. Each pays 5 XP; all three pay +10 XP and +2 spare hints. Shown as one small card on Home, inside the existing "today's goal" space so Home stays at one main action.

### Decision needed from the owner (section 3)

1. **Mechanism.** (a) A plus B as above. (b) A only (3 free a day, then XP). (c) C (regenerating energy). **Recommendation: (a).**
2. **Numbers.** (a) 3 free a day, start with 5 spares, cap 10, earn up to 5 a day. (b) More generous: 5 free, cap 15. **Recommendation: (a)**, then tune from the hint-rate data.
3. **XP purchase.** (a) Allowed, 3 for 30 XP, once a day. (b) Never; hints only from budget and quests. **Recommendation: (a).**
4. **Clue rule.** (a) Guess required before clues 4 to 6. (b) Clues stay free. **Recommendation: (a).**
5. **Hints in ranked play.** (a) None. (b) Allowed. **Recommendation: (a).**
6. **Daily quests.** (a) Add 3 a day on Home. (b) Not now. **Recommendation: (a).**

---

## 4. Content at scale (2,500 per section without meaningless repetition)

### 4.1 Where we stand

| Section | Now (approx.) | Gap to 2,500 |
|---|---|---|
| Exam Prep question bank | 3,740 questions + 260 interview questions | Done in count; needs item statistics and a quality audit |
| Worked Q&As in modules | 1,550 | 950 |
| Case library / Daily cases | about 60 | about 2,440 |
| Rx and prescription scenarios | 13 mysteries plus chains and puzzles | about 2,400 |
| Ward scenarios | 3 campaigns, about 47 decisions | about 2,450 |
| Patient interaction (AI patient cases) | 20 case files | about 2,480 |
| Diagnosis and differentials | about 60 cases + 33 detective + Criteria Sort boards | about 2,400 |
| Treatment planning | inside cases only | about 2,500 |
| Emergencies | inside cases only | about 2,500 |
| Games (MSE excerpts, Comorbid cards, escape rooms) | 36 + 65 + 4 rooms | draw mostly from the banks above |

### 4.2 How serious platforms build large banks

- **Hand writing by trained item writers**, following rules such as the NBME guide: a clinical vignette, a clear lead-in, and "cover the options" (the question can be answered before seeing the choices) [S38]. Roughly 1 person-hour per good item [S35].
- **Automatic item generation (AIG):** experts write a *cognitive model* (which features lead to which answer and why) and an *item model* (a template with slots), then software fills every valid combination. One study made over 15,000 pharmacy questions this way and found them valid after review [S34]. Simple one-layer templates make near clones (text similarity 0.74); layered templates vary much more (0.53) [S33].
- **AI drafting:** GPT-4o cut writing time from 96 to about 25 person-hours per 100 questions, but its questions were easier, more often off-topic (6 vs 0 percent) or wrongly pitched (14 vs 1 percent), had slightly more factual errors (6 vs 4 percent), and tested lower-order thinking [S35]. A review of 71 studies found error rates from under 1 to 45 percent and concluded AI is a drafting tool, not an unsupervised writer [S36].
- **Item statistics** decide what stays. Common thresholds: difficulty between 0.4 and 0.8 is moderate; discrimination (point-biserial) under 0.2 needs revision; a wrong option chosen by under 5 percent of students is "non-functioning" [S37]. AMBOSS publishes difficulty from peer answers [S32].

### 4.3 Recommended pipeline

**Step 1. Blueprint.** For each section, a grid of topic × learning objective × thinking level × difficulty, with target counts. Example: 50 topics × 50 items = 2,500, with at least 40 percent at "apply" or above.

**Step 2. Three production lines.**

| Line | Best for | How it stays genuinely different | Where the explanation comes from |
|---|---|---|---|
| **Rule templates** | Rx scenarios, interactions, monitoring, emergencies, ward vitals, differentials, treatment choice | Every instance must differ in at least one **decision-relevant feature** (a feature that changes the right answer or the reasoning). Changing only name, age or city does not count. | The rule data. Example: "valproate + pregnancy potential → avoid: major birth-defect risk" is stored once, reviewed once, and explains every item that uses it. |
| **AI drafts with machine checks** | Conceptual Q&As, research methods, theory, interview questions | Blueprint cell + source passage from the private books + a check against near-duplicates | Written by the AI, checked by a clinician |
| **Hand anchors** (about 5 percent) | Rich branching cases, rare presentations, ethics and law dilemmas | Written for a specific gap | Written by Claude from the books, reviewed by a clinician |

How a rule template works, using Rx as the example:

1. **Drug table:** class, mechanism, receptor profile, half-life, key adverse effects, monitoring, interactions (with severity and reason), pregnancy and breastfeeding, renal and liver cautions, Indian brands (verified).
2. **Patient table:** age band, sex, pregnancy status, kidney and liver function, physical illnesses, other medicines, setting.
3. **Rules:** contraindications, interactions, monitoring triggers, "first choice when" and "avoid when".
4. **Scenario types:** "what to check before starting", "what explains this side effect", "what is the safest switch", "which combination is dangerous", "what does this lab result mean", "what to tell the patient".
5. **The generator** picks a scenario type and a drug and patient that make **exactly one** option correct under the rules, picks wrong options from the same class or a known mix-up, and writes the explanation from the rules that fired.
6. **Layered wording** (two or three ways to present each part) so items do not read like clones [S33].

Differentials use the same idea with criteria data (the `needs` rules already in `src/lib/games/diagnoses.ts`): pick a target diagnosis, build a symptom set that meets its criteria but misses a look-alike's, add duration and exclusions, then explain from the criteria. Criteria must stay paraphrased in our own words.

**Step 3. Machine checks (all automatic, before a human sees it).** Schema valid; the no-dashes and no-references guards; answer key balance (the existing `balance.test.ts`); exactly one correct answer under the rules; wrong options plausible (same class or a known confusion); near-duplicate check (text similarity above 0.8 with a live item, or same decision features, is rejected); Indian brand names checked against the verified list; reading level.

**Step 4. Clinician review.**

| What is reviewed | How | Reviewer time |
|---|---|---|
| A template family | The rule table once, plus a random sample of 20 instances | about 2.5 hours per family |
| An AI-drafted item | Accept, edit or reject | about 10 minutes |
| A hand anchor case | Full read | about 20 minutes |
| Safety items (doses, emergencies, suicide and risk, Rx) | **Always before publishing** | as above |

Owner decision 11 was "publish, review after". We recommend keeping that for low-risk items (theory, history, research methods) but **reviewing before publishing** for anything touching doses, emergencies, risk or prescribing.

**Step 5. Live item statistics and retirement.** Extend `item_stats` (today it holds only `b` and `n`) with: answers, proportion right, point-biserial, choice counts per option, median time, hint rate, report count. Rules:

| Signal (after 30 answers, or pooled across a template family) | Action |
|---|---|
| Point-biserial below 0 | Pull now, alert reviewer |
| Point-biserial below 0.2 | Flag for revision |
| Proportion right above 0.95 or below 0.2 | Flag (too easy or likely flawed) |
| A wrong option chosen by under 5 percent | Rewrite that option |
| 3 or more student reports | Pull and review |
| High hint rate with low accuracy | Check wording |

Our cohorts are small, and Elo item estimates need around 100 students to settle [S39]. **Template families pool their answers**, which is a major reason to prefer templates: a family of 80 instances gets useful statistics far sooner than 80 separate items.

**Step 6. No meaningless repetition for the student.** A student never sees the same item twice except as a scheduled review. Two siblings from one family never appear in the same session. A family cools down for 3 days after a sibling is answered.

### 4.4 Realistic throughput

Assume Claude drafts and builds everything, and the clinician reviewer's time is the bottleneck.

| Section | Suggested mix (template / AI / anchor) | Reviewer hours to reach 2,500 (rough) |
|---|---|---|
| Rx and prescription scenarios | 85 / 10 / 5 | about 100 |
| Emergencies | 80 / 10 / 10 | about 120 |
| Ward scenarios (counted as decision points) | 70 / 20 / 10 | about 150 |
| Diagnosis and differentials | 70 / 20 / 10 | about 150 |
| Treatment planning | 75 / 20 / 5 | about 130 |
| Patient interaction (persona cards: disorder × presentation × persona × risk level) | 80 / 15 / 5 | about 110 |
| Case library | 40 / 40 / 20 | about 270 |
| Worked Q&As (950 more) | 0 / 95 / 5 | about 170 |
| Exam Prep audit of 3,740 | statistics first, review flagged items only | about 60 |
| **All sections** | | **about 1,250 reviewer hours** |

At 2 reviewer hours a day this is a long programme. Ways to shorten it: (1) MPhil and RCI trainees do a first-pass review, with the clinician signing off safety items and a 10 percent sample; (2) raise the template share; (3) count a branching case as several scenarios only when each branch is a real decision.

### 4.5 Tagging schema (one record shape for every item)

| Field | Values | Purpose |
|---|---|---|
| `id`, `version`, `status` | draft, review, live, retired | Life cycle |
| `section` | prep, qa, case, rx, ward, patient, ddx, treatment, emergency, game | Where it is used |
| `format` | single best answer, multi-select, order, match, typed recall, case step, rx scenario, decision | Rendering and guessing rate |
| `subject`, `topic`, `subtopic` | From the module map | Browsing |
| `skills` | One or more skill ids from `learn/model/skills.ts`, with weights | Engine updates |
| `objective` | Verb + content, for example "distinguish bipolar II from recurrent depression" | Blueprint coverage |
| `thinking` | remember, understand, apply, analyse, evaluate | Keeps the bank above recall level |
| `difficulty_author` | 1 to 5 | Starting difficulty |
| `b`, `n` | Live Elo difficulty and answer count | Adaptivity |
| `exams` | cuet-pg, ugc-net, clinical-entrance, md-psych, semester | Exam Prep filters |
| `level` | starting, beginner, advanced | Module level |
| `view` | student, clinician | Which view shows it |
| `safety` | none, dose, emergency, risk, prescribing | Review-before-publish rule |
| `population` | child, adolescent, adult, older adult, pregnancy | Coverage checks |
| `setting` | India outpatient, ward, community, global | Owner's Indian and global mix |
| `confusions` | Pairs such as mdd/adjustment | Interleaving and distractors |
| `family`, `seed` | Template family id and seed | Pooling statistics, cooldown |
| `source` | template, ai (model and prompt id), hand | Audit trail |
| `ref` | Book and page, **admin only** | Owner rule: no references in student text |
| `reviewer`, `reviewed_at` | | Accountability |
| `media` | Widget id or 3D scene id | Links to visuals |

### Decision needed from the owner (section 4)

1. **Production mix.** (a) Template-led as in 4.4. (b) Mostly AI drafts with review. (c) Mostly hand writing. **Recommendation: (a).**
2. **Review timing.** (a) Review before publishing for doses, emergencies, risk and prescribing; publish then review for the rest. (b) Keep "publish, review after" for everything. **Recommendation: (a).**
3. **Reviewers.** (a) Trainee first pass plus clinician sign-off on safety items and a sample. (b) Clinician only. **Recommendation: (a)**, with a short reviewer guide.
4. **Definition of "different".** (a) Must differ in at least one decision-relevant feature. (b) Any wording difference counts. **Recommendation: (a).**
5. **Order of sections.** **Recommendation:** Rx, then differentials, then emergencies (highest template share, fastest), then ward, treatment, patient personas, then the case library.

---

## 5. Difficulty progression

### 5.1 What the research says

- **Elo for adaptive learning** works almost as well as full IRT for item difficulty and gives a reasonable student estimate after about 10 answers. Recommended step: a/(1 + b·n) with a = 1, b = 0.05. For multiple choice, add a **guessing floor**: P = c + (1 − c) / (1 + e^−(θ − b)), with c = 1 / number of options. Item difficulty needs around 100 students to settle [S39].
- **Mastery learning** gives about 0.5 SD on average [S43]. The threshold matters more than the fancy model that computes it [S40].
- **Success rate:** children practising at higher success rates attempted more problems, and anxiety fell equally across levels [S41]. A theoretical "85 percent rule" says about 15 percent errors is ideal for some kinds of learners [S42]. Both support a target around 75 to 85 percent in practice.
- **Desirable difficulties:** spacing, interleaving, testing and varied practice slow practice but improve long-term learning [S45]. Interleaving helps most when the categories look alike [S44], which is exactly our look-alike disorders.

### 5.2 Comparison with what we have

| Topic | Ours | Research | Change |
|---|---|---|---|
| Rating model | 1PL Elo, shrinking steps | Same family | Keep |
| Student step | 0.9/(1+0.08n) | a = 1, b = 0.05 suggested | Keep; fine |
| **Guessing** | None. A 4-option question is modelled as if guessing gave 0 percent | c = 1/options | **Add**: c = 0.25 for 4 options, 0.5 for true/false, 0 for typed recall. Without it, predicted chances are off by up to 25 points, so the 70 percent target and the mastery line are both miscalibrated. |
| **Mastery check** | Chance of success on an "average" question (b = 0) | Mastery on the skill's own items | **Judge mastery at the median difficulty of that skill's live items** (or a mastery set at the level's difficulty). Today a hard skill can show "Mastered" without the student handling its harder items. |
| **New item difficulty** | Every new item starts at b = 0 | Needs priors when data is thin | **Seed b from author difficulty** (1 to 5 → −1.5 to +1.5) and from the template family average. |
| **League difficulty** | Reads `p_correct` or `rating` from `item_stats`, which only has `b` | Use real difficulty | **Bug: every item counts as easy.** Map b ≥ 0.8 → hard, b ≥ −0.2 → medium. |
| Forgetting | Elo fade (45-day half-life) and FSRS both | One clear model | Let "Needs review" come from FSRS recall chance for the skill's cards; keep Elo fade for the picker. |
| Success target | About 75 to 77 percent expected overall | 75 to 85 percent | Keep, once guessing is fixed |
| Interleaving | By family | Look-alikes | Keep |
| Hints | Not used by the engine | Partial credit | Use the outcome values in 3.4 |
| Multi-skill items | One skill | Weighted updates for each skill [S39] | Update each tagged skill by its weight |

### 5.3 Recommended progression design

1. **A format ladder inside each skill** (like Coach's four steps, extended to all banks):
   1. Recognise (pick from options)
   2. Recall (type or fill the blank)
   3. Apply (short vignette)
   4. Tell look-alikes apart (paired cases from the `confusions` tag)
   5. Full case (multi-step, from the case library or Ward Week)

   Move up a rung when the predicted chance at the current rung reaches 0.8 with at least 3 correct first tries on 2 days. Drop a rung after 3 misses in a row.
2. **Levels stay open** (plan section 8), but the module page suggests the next level when about 80 percent of the current level's skills are mastered.
3. **Mode-specific difficulty:**
   - Smart practice: adaptive, about 75 to 80 percent success.
   - Module tests and certificate checks: fixed sets at the level's difficulty (not adaptive, so results are comparable).
   - Mock exams: exam difficulty and pattern, never adaptive.
   - Duels: matched by Glicko rating.
4. **Placement per section** (15 to 20 questions, as decided) seeds every skill in that section, not just one overall ability.
5. **Pre-questions at the start of a module** (the existing `guess` blocks) as a desirable difficulty [S45].

### Decision needed from the owner (section 5)

1. **Guessing correction and skill-based mastery.** (a) Add both now. (b) Leave the model as is. **Recommendation: (a).** Some students' "Mastered" badges may change once; announce it as "more accurate mastery".
2. **Format ladder.** (a) Use the 5-rung ladder in every skill. (b) Keep questions unordered. **Recommendation: (a).**
3. **Success target.** (a) About 75 to 80 percent in practice. (b) Stay at about 70 percent. **Recommendation: (a)**, based on [S41, S42].

---

## 6. UX focus: less on screen, help at the right moment

### 6.1 Patterns that work

**Focus modes.**
- **Question mode:** starting any session goes full screen (like a Duolingo lesson): one question, the answer, the explanation, Next. Sidebar, top bar and the phone tab bar are hidden. A single Exit button (and the Esc key), a thin progress bar, and the Student or Clinician toggle stay. XP and combo feedback stay small; the full payout comes at the end.
- **Reading mode:** a Study section opens with the sidebar collapsed to the icon rail (already supported by `sidebar-state.ts`), a comfortable line length (about 65 to 75 characters), and the section list in a drawer. A "Focus" button hides the rail as well.
- **Icon rails need labels.** Show labels on hover or focus and keep labels on phone tab bars, because icons alone are often misread [S52].

**Contextual onboarding.**
- **No tours or slide decks.** In testing, a tutorial deck did not improve task success (91 vs 94 percent) and made users rate tasks as harder [S46].
- **Show-once tips:** one line at the moment of first use ("Reveal clues one at a time. Fewer clues, more points."). Dismissible. Remembered per person on the server, so it does not reappear on another device.
- **Empty states that teach:** "No reviews due. Try today's case." instead of a blank panel.
- **Progressive disclosure:** show the main action; keep advanced options behind "More" [S47].
- **Coach marks** only for a brand-new feature, at most one per screen, once.

**Dashboards that do not overwhelm.**
- Home (approved): one Continue card, today's goal, three strongest and three weakest topics. Add the daily quests inside the goal card, not as a new block.
- Progress page: a summary row first (mastery percentage, streak, this week's practice), details on tap. Compare students with their own past by default; rankings stay on the Leaderboard page.
- At most 5 numbers visible at once; every number has a word label and an icon, never colour alone.

### Decision needed from the owner (section 6)

1. **Question mode.** (a) Always full screen with one Exit button. (b) Optional toggle. **Recommendation: (a)** for question sessions, games and mocks.
2. **Reading mode.** (a) Study opens with the slim icon rail plus a Focus button. (b) No change. **Recommendation: (a).**
3. **Onboarding.** (a) Show-once tips stored per person, no tours. (b) A welcome tour. **Recommendation: (a).**

---

## 7. Implementation plan

| Phase | What | Depends on | Effort |
|---|---|---|---|
| **0. Foundations** | Owner approves the pending migrations (learning_engine, leagues, games, games2, prep, ai_cases). One wallet: all spends to `xp_ledger` with a `currency` column. Hints fail closed. Fix the league difficulty mapping. Extend `item_stats` (proportion right, point-biserial, option counts, time, hint rate, reports). | Owner approval | S to M |
| **1. Hint economy and engine fixes** | Daily budget + spare hints + XP purchase; hint ladder; attempt-first rule; clue rule; partial credit to Elo; daily quests on Home. Guessing correction, skill-based mastery, seeded item difficulty, multi-skill updates. | Phase 0 | M |
| **2. Item record and tagging** | One `items` table and `item_families`; migrate the prep bank, Daily cases and game content into it (the old files stay as the source until switched). | Phase 0 | M |
| **3. Content factory** | Rx rule tables and generator; differentials generator from criteria; machine checks; Review queue in Admin → Review; item statistics page with automatic flags; reviewer guide. | Phase 2 | L |
| **4. Focus and onboarding** | Question mode, reading mode, show-once tips stored per person, empty states. | None (can run in parallel) | S to M |
| **5. 3D foundation and flagships** | Lazy scene shell, device class detection, 2D fallback, accessibility layer, asset pipeline with CI budget check, Credits page. Then: brain explorer (key views, find-it, lesion to symptom), neuroimaging slicer with TMS and ECT placement, Ames room. | Phase 4 for the full-screen shell; licence decision | L |
| **6. Patient interaction** | Persona card generator (disorder × presentation × persona × risk), 2D illustrated patients with affect states, 20 to 30 filmed MSE clips, MSE observation scoring. Optional Rocketbox avatar A/B pilot. | Phases 2 and 3 | M, then L |
| **7. Scale to 2,500 per section** | Run the factory section by section (Rx, differentials, emergencies, ward, treatment, personas, case library); monthly item retirement review. | Phase 3 | XL, ongoing |
| **8. Measure and tune** | Hint rate, first-try accuracy, quest completion, streak survival, 3D scene completion vs 2D twin (A/B), fps and load time by device class. | Phases 1, 5 | S each |

---

## 8. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Clinical errors at scale (doses, interactions, brands) | Medium | High | Rule data reviewed once per family; review before publishing for safety items; report button; automatic pull on negative discrimination |
| Reviewer time is the bottleneck | High | High | Template-heavy mix; trainee first pass; sample review of instances |
| AI-drafted items too easy or shallow | High | Medium | Blueprint forces thinking levels; machine checks; statistics retire weak items [S35, S36] |
| Near-clone items feel repetitive | Medium | Medium | Decision-feature rule, layered templates, family cooldown |
| Small cohorts give slow item statistics | High | Medium | Pool by family; seed difficulty from author ratings |
| Hint rules too strict for weak students | Medium | High | Free help after a wrong try; 5 starting spares; tune from data |
| Students farm spare hints | Low | Low | Daily caps, due-only reviews, no earning from replays |
| 3D is slow or drains battery on cheap phones | Medium | Medium | Budget per class, render on demand, automatic 2D fallback |
| 3D becomes decoration that lowers learning | Medium | Medium | Only High-rated places; every scene has a task; key views by default [S3, S10] |
| Licence breach (ShareAlike, non-commercial parts) | Low | High | Credits page, publish derived models, exclude NC parts, legal check |
| Avatar platform shuts down (as Ready Player Me did) | Medium | Medium | MIT-licensed or our own assets only [S18, S19] |
| Uncanny or culturally wrong avatars | Medium | Medium | 2D illustrated patients first; avatar only as a tested pilot |
| WebGPU or driver bugs on Android | Low | Low | WebGL 2 only |
| 3D not usable with a screen reader or keyboard | Medium | High | Parallel controls, text descriptions, no drag-only actions [S50] |
| Mastery badges change after the model fix | High | Low | Announce once as "more accurate mastery" |
| Pending migrations delay everything | High | High | Phase 0 needs the owner's approval first |
| Criteria copyright | Low | Medium | Paraphrase criteria features; never copy manual text |

---

## Sources

- [S1] Yammine K, Violato C. A meta-analysis of the educational effectiveness of three-dimensional visualization technologies in teaching anatomy. Anatomical Sciences Education, 2015. https://zendy.io/title/10.1002/ase.1510
- [S2] Bogomolova K and colleagues. The effect of stereoscopic augmented reality visualization on learning anatomy and the modifying effect of visual-spatial abilities. Anatomical Sciences Education, 2020. https://scholarlypublications.universiteitleiden.nl/access/item%3A3147004/view
- [S3] Levinson AJ, Weaver B, Garside S, McGinn H, Norman GR. Virtual reality and brain anatomy: a randomised trial of e-learning instructional designs. Medical Education, 2007. https://typeset.io/pdf/virtual-reality-and-brain-anatomy-a-randomised-trial-of-e-2abja9bjmu.pdf
- [S4] Stereopsis, visuospatial ability, and virtual reality in anatomy learning. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5471569/
- [S5] Makransky G, Terkildsen TS, Mayer RE. Adding immersive virtual reality to a science lab simulation causes more presence but less learning. Learning and Instruction, 2019. https://imotions.com/blog/adding-immersive-virtual-reality-to-a-science-lab-simulation-causes-more-presence-but-less-learning
- [S6] Kononowicz AA and colleagues. Virtual patient simulations in health professions education: systematic review and meta-analysis. JMIR, 2019. https://wrap.warwick.ac.uk/121483
- [S7] Watari T and colleagues. The utility of virtual patient simulations for clinical reasoning education (Body Interact). 2020. https://www.pubmed.gov/32722097/
- [S8] Bonde MT and colleagues. Improving biotech education through gamified laboratory simulations. Nature Biotechnology, 2014 (summary on Labster's site). https://labster.com/research/improving-biotech-education-through-gamified-simulations
- [S9] Podolefsky NS, Moore EB, Perkins KK. Implicit scaffolding in interactive simulations (PhET). https://arxiv.org/pdf/1306.6544
- [S10] Sundararajan N, Adesope O. Seductive details meta-analysis, 2020 (university news summary). https://news.wsu.edu/2020/03/19/seductive-details-inhibit-learning/
- [S11] WebGPU is now supported in major browsers. web.dev, November 2025. https://web.dev/blog/webgpu-supported-major-browsers
- [S12] React Three Fiber v9 migration guide. https://r3f.docs.pmnd.rs/tutorials/v9-migration-guide
- [S13] React Three Fiber: scaling performance. https://r3f.docs.pmnd.rs/advanced/scaling-performance
- [S14] Optimising GLB files for the web (Meshopt, Draco, KTX2 measurements). https://app.cinevva.com/guides/optimize-glb-for-web
- [S15] three.js forum: file size when bundling. https://discourse.threejs.org/t/three-js-file-size-when-importing-via-npm-and-bundling-with-webpack/8904
- [S16] BodyParts3D README and licence. https://dbarchive.biosciencedbc.jp/data/bodyparts3d/20110915/README_e.html
- [S17] Z-Anatomy models of human anatomy (licence and credits). https://github.com/Z-Anatomy/Models-of-human-anatomy
- [S18] Microsoft Rocketbox avatar library (MIT). https://github.com/microsoft/Microsoft-Rocketbox
- [S19] Avatar platforms in 2026: who's alive, who's gone. https://avatarsdk.com/blog/2026/08/31/avatar-platforms-2026-whos-alive-whos-gone/
- [S20] India median mobile download speed, August 2025 (Ookla data). https://telecomtalk.info/india-sees-median-mobile-download-speed-jump/1000114/
- [S21] Counterpoint: 1 in 5 smartphones shipped in India in 2025 were premium. https://www.gsmarena.com/counterpoint_1_in_5_smartphones_shipped_in_india_in_2025_were_premium_models-news-71366.php
- [S22] Duolingo: improving the streak. https://blog.duolingo.com/improving-the-streak
- [S23] Duolingo: energy. https://blog.duolingo.com/duolingo-energy/
- [S24] Duolingo: leagues and leaderboards. https://blog.duolingo.com/duolingo-leagues-leaderboards/
- [S25] Silverman J, Barasch A. On or off track: how (broken) streaks affect consumer decisions. Journal of Consumer Research, 2023. https://www.colorado.edu/business/faculty-research/2023/04/19/or-track-how-broken-streaks-affect-consumer-decisions
- [S26] Baker RS and colleagues. Do performance goals lead students to game the system? 2005. https://learninganalytics.upenn.edu/ryanbaker/BRCKAIED2005Final.pdf
- [S27] Bai S, Hew KF, Huang B. Does gamification improve student learning outcome? Educational Research Review, 2020. https://www.gbl.uzh.ch/quartz/references/Bai-et-al.-(2020)
- [S28] van Gaalen AEJ and colleagues. Gamification of health professions education: a systematic review. Advances in Health Sciences Education, 2021. https://link.springer.com/content/pdf/10.1007/s10459-020-10000-3.pdf
- [S29] Wang AI, Tahir R. The effect of using Kahoot! for learning: a literature review. Computers and Education, 2020. https://research.gold.ac.uk/id/eprint/39435
- [S30] Benchmark of spaced repetition algorithms (FSRS vs SM-2). https://expertium.github.io/Benchmark.html
- [S31] Khan Academy: course and unit mastery. https://support.khanacademy.org/hc/en-us/articles/115002552631
- [S32] AMBOSS: question difficulty. https://support.amboss.com/hc/en-us/articles/360035679652
- [S33] Gierl MJ, Lai H. Automated item generation (NCME instructional module 34). https://ncme.org/wp-content/uploads/2025/10/Module-34-Automated-Item-Generation-Gierl-Lai.pdf
- [S34] Using automatic item generation to create multiple-choice questions for pharmacy assessment. https://pubmed.ncbi.nlm.nih.gov/37852684/
- [S35] AI versus human-generated multiple-choice questions for medical education: a cohort study in a high-stakes examination. BMC Medical Education, 2025. https://doaj.org/article/de53e05697e64cf089061ab76fe225c3
- [S36] Validity of AI-generated multiple-choice questions in medical education: a systematic review. https://avesis.ogu.edu.tr/yayin/52dbfdc2-52c2-48ad-b326-82a699de2e7f/validity-of-ai-generated-multiple-choice-questions-in-medical-education-a-systematic-review
- [S37] Ali SH, Ruit KG. The impact of item flaws, testing at low cognitive level, and low distractor functioning on MCQ quality. Perspectives on Medical Education, 2015. https://link.springer.com/10.1007/s40037-015-0212-x
- [S38] NBME item-writing guide. https://www.nbme.org/educators/item-writing-guide
- [S39] Pelánek R. Applications of the Elo rating system in adaptive educational systems. Computers and Education, 2016. https://www.fi.muni.cz/~xpelanek/publications/CAE-elo.pdf
- [S40] Pelánek R, Řihák J. Experimental analysis of mastery learning criteria. 2017. https://is.muni.cz/publication/1392193/en/Experimental-Analysis-of-Mastery-Learning-Criteria/Pelanek-Rihak
- [S41] Jansen BRJ and colleagues. The influence of experiencing success in math on math anxiety, perceived math competence, and math performance. Learning and Individual Differences, 2013. https://dare.uva.nl/id/789fc422-4935-49ca-bcba-803239522951
- [S42] Wilson RC, Shenhav A, Straccia M, Cohen JD. The eighty five percent rule for optimal learning. Nature Communications, 2019. https://doaj.org/article/d1aeacdf1f304a25962f05454cebb437
- [S43] Kulik CC, Kulik JA, Bangert-Drowns RL. Effectiveness of mastery learning programs: a meta-analysis. 1990. https://www.academia.edu/81783373/Effectiveness_of_Mastery_Learning_Programs_A_Meta_Analysis
- [S44] Brunmair M, Richter T. Similarity matters: a meta-analysis of interleaved learning and its moderators. Psychological Bulletin, 2019. https://pubmed.ncbi.nlm.nih.gov/31556629/
- [S45] Bjork EL, Bjork RA. Making things hard on yourself, but in a good way: creating desirable difficulties to enhance learning. 2011. https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/04/EBjork_RBjork_2011.pdf
- [S46] Nielsen Norman Group: mobile-app onboarding tutorials. https://www.nngroup.com/articles/mobile-tutorials/
- [S47] Nielsen Norman Group: progressive disclosure. https://www.nngroup.com/alertbox/progressive-disclosure.html
- [S48] Sailer M, Homner L. The gamification of learning: a meta-analysis. Educational Psychology Review, 2020. https://link.springer.com/article/10.1007/s10648-019-09498-w
- [S49] Product sites: Complete Anatomy https://3d4medical.com · BioDigital https://www.biodigital.com · Zygote https://www.zygote.com · Body Interact https://bodyinteract.com · Oxford Medical Simulation https://oxfordmedicalsimulation.com · Osmosis https://www.osmosis.org · Lecturio https://www.lecturio.com · AMBOSS https://www.amboss.com/us/features · Kenhub https://www.kenhub.com · Labster https://www.labster.com · PhET https://phet.colorado.edu
- [S50] W3C. Web Content Accessibility Guidelines 2.2 (2.5.7 Dragging Movements; 2.3.3 Animation from Interactions). https://www.w3.org/TR/WCAG22/
- [S51] pmndrs: @react-three/a11y. https://github.com/pmndrs/react-three-a11y
- [S52] Nielsen Norman Group: icon usability. https://www.nngroup.com/articles/icon-usability/

Note on sources: some pages (PubMed Central, some journal sites) blocked automated reading, so a few figures come from abstracts, institutional summaries or papers that cite the original. Product descriptions in 1.2 are general summaries, not tested claims.
