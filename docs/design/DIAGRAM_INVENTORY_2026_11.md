# Diagram inventory, November 2026

Every diagram a student sees, and what happened to it in the hand-drawn pass
(branch `agent/sketch2`). The reference style is the sketch kit, now shared at
`src/components/sketch/` (it was `src/components/meds/sketch/`): wobbly
rough.js strokes with fixed seeds, hatched and marker fills, Kalam handwriting
for labels inside drawings only, brand ink, blue and lime, re-inked for dark
mode through the `.sketch` CSS variables in `globals.css`.

Marks:

- **converted**: was odd (flat vector boxes, 7 to 9 px labels, truncated
  names), now drawn with the kit. Data format and behaviour unchanged; the
  content files did not change.
- **good**: real drawings already; left alone.
- **game UI**: an interactive task whose look is buttons, sliders and cards,
  not a diagram; left alone.

Where they appear: Study modules render widgets through
`src/components/study/widgets.tsx`. Exam Prep explanations
(`src/app/(dashboard)/prep/runner.tsx`) and long-answer model answers
(`src/app/(dashboard)/prep/long-ui.tsx`) draw their visuals through the same
`Widget` (via `PrepVisualView` in `prep/visual.tsx`), so each kind below covers
all three places. Counts are blocks in Study modules / visuals in long answers
(Exam Prep explanations reuse the shared concept library in
`src/content/prep/visuals`, which uses the same kinds).

## Study widgets

| Kind | Component | Study / long | Mark | Notes |
|---|---|---|---|---|
| flow | `visuals.tsx` Flow | 482 / 87 | converted | Hand-drawn boxes, lime number dots, drawn arrows, branch rails for trees, a loop arrow back to 1 for cycles. Text stays real HTML (`SketchFrame`), so it wraps and is never cut off. |
| layers | `visuals.tsx` Layers | 125 / 17 | converted | Pyramid, iceberg and rings drawn; a name sits in its band when it fits and as a number otherwise (the old picture cut names at 28 letters). Rings name each ring in a column with leader lines. The list below is in hand-drawn boxes. |
| curve | `visuals.tsx` Curve (6 kinds) | 81 / 17 | converted | Normal, signal detection, forgetting, inverted U, dose-response, half-life: hand-drawn charts, sliders unchanged, labels clamped inside at every slider end. |
| brainmap | `visuals.tsx` BrainMap | 65 / 11 | converted | New hand-drawn side view (lobes, fissures, cerebellum, brainstem, deep parts dashed). Parts in focus are washed and numbered like their buttons; the picked one is hatched and named with a leader. |
| journey | `animations.tsx` Journey | 51 / 0 | converted | Draws the medicine-page body (`sketch/journey-art.tsx`). Also used by the Rx Detective game. |
| receptor | `animations.tsx` Receptor | 45 / 0 | converted | Draws the medicine-page receptor and signal meter (`sketch/receptor-art.tsx`). Also used by the Rx Detective game. |
| pathways | `animations.tsx` Pathways | 14 / 0 | converted | Draws the medicine-page dopamine pathways brain (`sketch/pathways-art.tsx`). |
| neuron | `animations.tsx` Neuron | 13 / 0 | converted | Hand-drawn cell, myelin, endings and voltage trace; the fired signal keeps its jump or slide motion. |
| synapse | `widgets.tsx` Synapse | 17 / 0 | converted | |
| conditioning | `animations2.tsx` Conditioning | 21 / 3 | converted | Bell, dog, Skinner box, press-rate bars. |
| memoryflow | `animations2.tsx` MemoryFlow | 6 / 1 | converted | The lit store is solid lime with dark text so its name reads in both themes. |
| stress | `animations2.tsx` StressResponse | 7 / 1 | converted | |
| compare | `animations2.tsx` Compare | 186 / 90 | converted | Two hand-drawn boxes with marker-pen headings round real text. |
| release | `animations4.tsx` Release | 19 / 0 | converted | |
| hypnogram | `animations4.tsx` Hypnogram | 10 / 1 | converted | Night chart and live EEG strip. |
| strange | `animations4.tsx` Strange | 5 / 1 | converted | |
| attention | `animations3.tsx` Attention | 2 / 0 | converted | The selecting stage is outlined in red on a pale wash (a hatch made its words unreadable). |
| dissonance | `animations3.tsx` Dissonance | 3 / 1 | converted | Tension meter and the enjoyment scale; the belief and behaviour cards stay as cards. |
| conservation | `animations3.tsx` Conservation | 3 / 2 | converted | Glasses and coin rows. |
| illusion | `animations3.tsx` Illusion | 5 / 9 | good | Perception stimuli: the lines, bars and circles must measure exactly equal, so a wobbly stroke would change what is being tested. Kept exact. |
| experiment | `animations3.tsx` Experiment | 12 / 44 | game UI | Predict with sliders, then reveal bars. |
| thoughtrecord | `animations4.tsx` ThoughtRecord | 10 / 0 | game UI | A worksheet with sliders; its small before/after bar is part of the task. |
| timeline | `animations2.tsx` Timeline | 83 / 28 | game UI | Put events in order. |
| moodline | `widgets.tsx` Moodline | 18 / 0 | game UI | Pick the pattern that fits a mood chart. |
| guess, decide, sort, build, worked, reveal | `widgets.tsx` | 1,359 / 114 | game UI | Tasks and text cards, no diagram. |
| figure | `figures/figure.tsx` | 337 / 21 | good | Labelled anatomy and chart figures (`figures/anatomy`, `figures/charts`): real textbook line drawings with measured, non-overlapping margin labels. They sit well beside the sketches (thin ink lines, same brand fills), so they were not restyled. |

## 2D twins of the 3D scenes

Shown when the device has no WebGL, when the student asks for less motion,
when they press "Flat view", while the 3D view loads, and on the server. The
3D views themselves are unchanged.

| Kind | Flat view | Study / long | Mark | Notes |
|---|---|---|---|---|
| synapse3d | `scenes/synapse-scene.tsx` SynapseFlat | 1 / 0 | converted | Static parts are drawn once per step (memoised); moving vesicles and molecules stay plain shapes in sketch colours, so 60 fps playback does not re-ink. |
| actionpotential | `scenes/action-potential.tsx` NeuronFlat, Trace, Channels | 2 / 0 | converted | Same split: the grid and the cell are inked once, the live trace is a plain blue line. |
| hpaloop | `scenes/hpa-loop.tsx` DayChart, ChronicChart, Axis | 3 / 0 | converted | The rotated "off switch" label is now upright beside the loop. |
| nervoussystem | `scenes/nervous-system.tsx` NervousFlat | 4 / 1 | converted | Body, brain, cord and nerves inked; organs keep their breathing and beating motion. |
| brainexplorer | `scenes/brain-explorer.tsx` BrainFlat, InferiorFlat | 4 / 4 | converted | Region colours stay matched to the 3D view and the region buttons; outlines and labels are hand-drawn; invisible tap targets keep every part pickable. The coronal scan slice is an MRI-style image and stays as it is. |
| genogram | `scenes/genogram.tsx` | 2 / 0 | converted | Standard genogram symbols drawn by hand; "has the condition" is a hatched fill. |
| brainslicer | `scenes/brain-slicer.tsx` SlicerFlat | 3 / 0 | converted | The scan slice canvas stays an MRI-style image. |
| amesroom | `scenes/ames-room.tsx` AmesFlat | 1 / 2 | converted (re-inked) | Kalam labels and sketch colours, but the room keeps exact straight perspective: the illusion depends on it. Names sit on a lime marker so they read over the checkerboard. |

## Medicine widgets outside medicine pages

The medicine pictures (`src/components/meds/sketch/*`) are only rendered on
Practice, Medicines. The medicine-style Study widgets (journey, receptor,
pathways, neuron, synapse, release) appear in Study modules and the
psychopharmacology Exam Prep material, and Journey and Receptor are also used
by the Rx Detective game (`src/app/(dashboard)/games/rx/rx-detective.tsx`). All
of them now draw the same hand-drawn pictures as the medicine pages.

## Checks

- `src/components/study/sketched.ts` lists the converted kinds.
- `src/components/study/sketch-labels.test.tsx`: every diagram of a converted
  kind in Study, Exam Prep and long answers, in every state (each button
  pressed, each slider at both ends), has no overlapping or cut-off labels,
  measured with Kalam's own widths (`src/components/sketch/check.ts`).
- `src/components/study/all-widgets-render.test.tsx` and the Exam Prep and
  long-answer render tests: every widget still renders.
- Screenshots at 390 and 1280 px, light and dark, with a real-browser label
  check, from the scratch harness (`sketch2-shots/harness`).
