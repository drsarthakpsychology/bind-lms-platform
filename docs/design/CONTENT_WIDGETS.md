# Module content: blocks and widgets (author guide)

Every module is written in the study dialect (`src/lib/study/parse.ts`). Types are in `src/lib/study/types.ts`. The renderers are `src/components/study/{blocks,widgets,visuals}.tsx`.

## Rules (owner, 2026-11-06)
- **No formal references in student text:**
  - no book titles, no authors-as-citations, no editions or page numbers
  - no journal names (Lancet, JAMA, NEJM, Psychological Bulletin, Am J Psychiatry, World Psychiatry, Cochrane…)
  - no "et al.", DOIs, links or bibliographies

  `src/content/study/no-references.test.ts` enforces this.
- **Teach researchers and studies naturally:**
  - OK: "Beck's cognitive model", "Milgram's obedience studies", "a large 2018 network meta-analysis of 21 antidepressants".
  - Not OK: "Cipriani and colleagues, Lancet 2018".
- **Levels build on each other:** Starting → Beginner → Advanced. Depth, technical complexity and academic language grow, and nothing is repeated in new words.
- **No tappable glossary terms.**
- **No week numbers in student prose.**
- **No colour-only meaning.**
- **No em dashes (—) or en dashes (–)** anywhere in student text: they read as AI-written. Use commas, colons, full stops or brackets; write ranges as "3 to 5". Avoid AI-sounding phrases. Enforced by the same test file.
- **Teach visually, a lot:** aim for 25 to 40 visuals and interactions per module. Use a picture or interaction wherever it explains better than text.

## Q&A bank: `:::qa`
```
:::qa How does the cognitive model explain the maintenance of panic disorder? [advanced]
### Short answer
One or two sentences.
### Step by step
1. …
| Feature | Panic | GAD |
|---|---|---|
| … | … | … |
:::
```
- The question goes on the opening line, with an optional level tag. The answer is ordinary blocks: headings, lists, tables and boxes.
- It renders as "Think it through, then open the answer".
- Put each module's bank in its own sections near the end, for example `## 8.1 Q&A bank · Starting [starting]`, `## 8.2 Q&A bank · Beginner [beginner]`, `## 8.3 Q&A bank · Advanced [advanced]`.
- Write varied questions: conceptual, theoretical, technical, application, clinical and research. Answers must be fully developed. No filler questions.

## Visual widgets: `:::widget <kind>` + JSON + `:::`
| Kind | Use it for | JSON |
|---|---|---|
| `flow` | processes, mechanisms, stage sequences (`chain`), vicious cycles and maintenance loops (`cycle`), classification and decision trees (`tree`). The student taps a box or presses Play to step through. | `{"title":"…","layout":"chain"\|"cycle"\|"tree","nodes":[{"id":"a","label":"…","detail":"…","parent":"(tree only)"}],"edgeLabels":{"a>b":"…"},"caption":"…"}` |
| `curve` | interactive explorers with sliders: `normal` (z, percentile, two-tailed p, IQ), `sdt` (d′, criterion, hits and false alarms), `forgetting` (Ebbinghaus with spaced reviews), `inverted-u` (arousal × task complexity), `dose-response` (potency vs efficacy, partial agonist), `half-life` (repeated dosing → steady state) | `{"kind":"normal","title":"…","caption":"…"}` |
| `layers` | layered models: `pyramid` (Maslow; layers[0] = top), `rings` (Bronfenbrenner; layers[0] = centre), `iceberg` (Freud's topography; layers[0] = above water), `stack` (any ordered levels) | `{"title":"…","shape":"rings","layers":[{"label":"Microsystem","detail":"…"}],"caption":"…"}` |
| `brainmap` | where something happens in the brain. Regions: frontal, prefrontal, motor, sensory, parietal, occipital, temporal, broca, wernicke, cerebellum, brainstem, corpus-callosum, thalamus, hypothalamus, basal-ganglia, amygdala, hippocampus | `{"title":"…","focus":["amygdala","hippocampus"],"notes":{"amygdala":"…"},"caption":"…"}` |
| `journey` | a medicine's route through the body to its brain target, animated: tablet → gut → liver first pass → blood → blood-brain barrier → target → elimination; also IV, nasal spray, depot | `{"drug":"sertraline","target":"serotonin transporters in the raphe and cortex","routes":["oral","iv"],"notes":{"liver":"…"},"caption":"…"}` |
| `neuron` | action potential: threshold slider (all-or-none), myelin on/off (saltatory conduction), live voltage trace | `{"title":"…","myelinated":true,"caption":"…"}` |
| `pathways` | the four dopamine pathways with animated flow; toggle a D2 blocker and then serotonin 2A block, and see each pathway's effect | `{"system":"dopamine","caption":"…"}` |
| `receptor` | full agonist vs partial agonist vs antagonist vs inverse agonist at one receptor, with a live signal bar | `{"receptor":"D2","caption":"…"}` |
| `conditioning` | classical (bell, food, salivation, extinction) or operant (lever, reinforcement, variable ratio, extinction burst), played step by step | `{"kind":"classical"}` or `{"kind":"operant"}` |
| `memoryflow` | sensory register, working memory and long-term memory with attention, rehearsal, encoding and retrieval | `{"caption":"..."}` |
| `stress` | amygdala, hypothalamus, pituitary and adrenal chain with a beating heart, cortisol gauge, feedback and chronic stress | `{"caption":"..."}` |
| `timeline` | put events in order on a line, then check. List the events in the CORRECT order; the widget shuffles them | `{"prompt":"Order Erikson's stages","events":[{"label":"Trust vs mistrust","when":"0 to 1 yr"},{"label":"Autonomy vs shame"}],"why":"..."}` |
| `compare` | two states side by side with a slider (healthy vs ill, before vs after, novice vs expert) | `{"title":"...","a":{"label":"Novice","points":["..."],"summary":"..."},"b":{"label":"Expert","points":["..."],"summary":"..."}}` |
| `attention` | selective attention at a cocktail party: two voices, tap to attend left or right, compare Broadbent's early filter, Treisman's attenuation and Deutsch and Deutsch's late selection, then say the student's name in the ignored ear | `{"caption":"Which theory explains hearing your own name across a noisy room?"}` |
| `dissonance` | cognitive dissonance: a belief and a behaviour clash, a tension meter rises, the student picks a way to reduce it (change the behaviour, change the belief, add a justifying thought, trivialise); includes Festinger's $1 or $20 study. Defaults to smoking | `{"belief":"I care about the planet.","behaviour":"I fly abroad three times a year."}` |
| `conservation` | Piaget's conservation: pour water into a tall thin glass (`liquid`) or spread out a row of coins (`number`); switch between a preoperational and a concrete operational child and tap the reasons (centration, identity, reversibility, compensation) | `{"kind":"liquid"}` or `{"kind":"number"}` |
| `experiment` | replay a classic study: the student predicts each condition with a slider, then reveals the real result as growing bars. `unit` is shown after each number; `max` defaults to 100 for "%". No defaults: supply real data | `{"title":"The bystander effect","question":"A student over an intercom seems to have a seizure. What share of people went for help?","unit":"%","conditions":[{"label":"Alone","value":85},{"label":"With one other person","value":62},{"label":"With four others","value":31}],"why":"The more people present, the more responsibility is spread across them."}` |
| `release` | how a transmitter crosses a synapse: signal arrives, calcium enters, release, binding, reuptake, breakdown by MAO; drug picker for SSRI, MAOI, amphetamine, botulinum toxin and a receptor blocker. Models a monoamine synapse, so use serotonin, dopamine or noradrenaline | `{"transmitter":"dopamine"}` |
| `thoughtrecord` | a CBT thought record filled in step by step: situation, automatic thought, rate the feeling, pick the thinking trap (with feedback), reveal evidence for and against, balanced thought, rate again. Mark the right trap or traps with `"right":true` | `{"situation":"My friend did not reply to my message all day.","thought":"She is angry with me.","emotion":"anxious","traps":[{"label":"Mind reading","right":true,"why":"You are guessing what she thinks without asking."},{"label":"Catastrophising","why":"Close, but the thought is about her mind, not a disaster."}],"forEvidence":["She usually replies within an hour."],"againstEvidence":["She told me she has exams this week.","We laughed together yesterday."],"balanced":"She is probably busy with exams. If I am worried, I can ask her."}` |
| `hypnogram` | a night of sleep: hypnogram with a time slider, the brain waves of each stage (beta, alpha, theta, spindles and K complexes, delta, sawtooth), and a depression toggle (short REM latency, less N3, more waking, early waking) | `{"caption":"Drag through the night, then switch on depression."}` |
| `strange` | Ainsworth's Strange Situation: step through with caregiver, stranger comes in, caregiver leaves, reunion, and switch between secure, avoidant, ambivalent and disorganised infants, with rough base rates | `{"caption":"Watch the reunion: it tells you the most."}` |
| `illusion` | perception illusions: judge first, then measure to show the parts are equal. Kinds: `muller-lyer`, `ponzo`, `ebbinghaus`, `figure-ground` (the vase and faces, with a flip instead of a ruler) | `{"kind":"ponzo"}` |
| `synapse` | reuptake and enzyme block (ssri/snri/maoi), with a time-passes step | `{"drug":"ssri","caption":"…"}` |
| `moodline` | mood over time → pick the pattern | see types |
| `guess`, `decide`, `sort`, `build`, `worked`, `reveal` | commit first, then the reasoning (see types) | see types |

JSON must be valid: double quotes, no trailing commas. The parser throws on bad JSON and the tests catch it.
