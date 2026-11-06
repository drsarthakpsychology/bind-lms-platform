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
- **Teach visually.** Use a picture or interaction wherever it explains better than text.

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
| `synapse` | reuptake and enzyme block (ssri/snri/maoi), with a time-passes step | `{"drug":"ssri","caption":"…"}` |
| `moodline` | mood over time → pick the pattern | see types |
| `guess`, `decide`, `sort`, `build`, `worked`, `reveal` | commit first, then the reasoning (see types) | see types |

JSON must be valid: double quotes, no trailing commas. The parser throws on bad JSON and the tests catch it.
