/* Module · Brain and behaviour, new Advanced sections: development, plasticity, and psychiatric genetics and epigenetics in depth. Original text written for VIBHA School of Psychology. */

export const advDevelopment = String.raw`
## 5.4 Building the brain: development in depth and the neurodevelopmental hypothesis [core][advanced]
You know the outline: tube, neurons, connections, pruning, myelin. At this level each step becomes a mechanism, each mechanism has a disease, and together they support one of the most influential ideas in psychiatry: that schizophrenia and several other disorders begin long before their first symptoms.

### Six processes, in overlapping order
| Process | Mechanism | When it fails |
|---|---|---|
| **Neurogenesis** | Progenitor cells in the **ventricular zone**, many of them **radial glia**, divide; at the peak, mid-gestation, the fetal brain adds hundreds of thousands of neurons a minute | **Microcephaly** (genetic, or after Zika virus infection) |
| **Migration** | Excitatory neurons climb radial glial fibres outward, **inside-out**: the deepest layer forms first and later neurons pass through it to settle above. Inhibitory interneurons travel **tangentially** from the ganglionic eminences | **Lissencephaly** ("smooth brain"), **heterotopias**, polymicrogyria: epilepsy, intellectual disability |
| **Differentiation and wiring** | Axon **growth cones** follow attractive and repulsive cues (netrins, slits, semaphorins, ephrins) | Agenesis of the corpus callosum; miswired circuits |
| **Programmed cell death** | Up to about half of neurons made die (apoptosis); survivors receive **neurotrophins** from their targets (nerve growth factor, discovered by Rita Levi-Montalcini) | Excess or deficient cell death |
| **Synaptogenesis and pruning** | Synapses overshoot in infancy and early childhood, then **pruning** removes unused ones, guided by activity, complement proteins and microglia; prefrontal pruning continues through adolescence | Proposed excessive pruning in schizophrenia; reduced pruning in some autism models |
| **Myelination** | Back to front and bottom to top: sensory and motor tracts first, prefrontal connections last, into the twenties and beyond | Leukodystrophies; adolescent vulnerability |

:::widget timeline
{
 "prompt": "Order these developmental milestones.",
 "events": [
  { "label": "Neural tube closes", "when": "first month" },
  { "label": "Peak of neurogenesis and migration", "when": "mid-gestation" },
  { "label": "Synaptic density peaks in the visual cortex", "when": "late first year" },
  { "label": "Synaptic density peaks in the prefrontal cortex", "when": "early childhood" },
  { "label": "Cortical grey matter volume peaks, then thins", "when": "late childhood to early adolescence" },
  { "label": "Prefrontal myelination and pruning approach adult levels", "when": "mid-twenties" }
 ],
 "why": "Different regions mature at different times: sensory areas early, association and prefrontal areas late. Peter Huttenlocher's post-mortem synapse counts and Jay Giedd's repeated MRI scans of children showed this back-to-front sequence."
}
:::

### Sensitive periods and the role of experience
- **David Hubel and Torsten Wiesel** sewed one eyelid of kittens shut for a few weeks early in life; the visual cortex rewired to favour the open eye, and the deprived eye stayed functionally blind even after opening. The same closure in an adult cat did little. The human counterpart is **amblyopia**, treated by patching the good eye in early childhood.
- **Konrad Lorenz's** goslings followed the first moving object they saw (imprinting) within a narrow window.
- **The English and Romanian Adoptees study** (Michael Rutter's group) followed children adopted out of severely depriving Romanian institutions: those adopted before about six months largely caught up; those adopted later had more lasting cognitive and social problems, including "quasi-autistic" features and disinhibited attachment.
- Sensitive periods are **opened and closed** by molecular brakes, such as the maturation of parvalbumin-containing GABA interneurons and the perineuronal nets around them.

### Prenatal hazards exams ask
:::widget sort
{
 "prompt": "Match each prenatal exposure to its best-known outcome.",
 "buckets": ["Neural tube defects", "Fetal alcohol spectrum disorder", "Raised schizophrenia risk", "Microcephaly"],
 "items": [
  { "text": "Valproate in the first trimester", "bucket": 0, "why": "Valproate also raises the risk of autism and lowers childhood IQ in a dose-related way." },
  { "text": "Low folate before conception", "bucket": 0 },
  { "text": "Smooth philtrum, thin upper lip, small eye openings, poor attention and learning", "bucket": 1 },
  { "text": "Conceived during the Dutch Hunger Winter of 1944 to 1945", "bucket": 2, "why": "Ezra Susser's studies found about a doubling of schizophrenia risk in those exposed to severe famine early in gestation; the Chinese famine of 1959 to 1961 gave similar results." },
  { "text": "Maternal Zika virus infection", "bucket": 3 },
  { "text": "Severe obstetric complications with fetal hypoxia", "bucket": 2 },
  { "text": "Maternal influenza or other infections in pregnancy, with maternal immune activation", "bucket": 2 }
 ]
}
:::

### The neurodevelopmental hypothesis of schizophrenia
In 1987 Daniel Weinberger in the United States and Robin Murray and Shôn Lewis in London independently argued that schizophrenia is the late expression of an **early** brain abnormality, which stays largely silent until the brain's normal adolescent maturation, especially of prefrontal circuits and dopamine regulation, unmasks it. Irwin Feinberg had earlier suggested that **excessive adolescent synaptic pruning** was the trigger.

:::widget flow
{
 "title": "Two hits: from early risk to adolescent illness",
 "layout": "chain",
 "nodes": [
  { "id": "g", "label": "Genetic risk", "detail": "Thousands of common variants, sometimes a rare CNV such as the 22q11.2 deletion." },
  { "id": "e", "label": "Early environmental hit", "detail": "Prenatal infection or famine, obstetric complications, winter or spring birth, older father." },
  { "id": "c", "label": "Subtle childhood signs", "detail": "Delayed milestones, clumsiness, lower IQ and social difficulties, minor physical anomalies, soft neurological signs." },
  { "id": "a", "label": "Adolescent second hit", "detail": "Normal pruning and dopamine maturation, plus cannabis, urban stress, migration, trauma." },
  { "id": "p", "label": "Prodrome, then psychosis", "detail": "Usually between the late teens and late twenties, earlier in men." }
 ],
 "caption": "Press Play. Which steps could prevention target? (Maternal nutrition and infection control, obstetric care, avoiding adolescent cannabis, early intervention in the prodrome.)"
}
:::

### The evidence for it
- **Childhood precursors**: in the British 1946 birth cohort, children who later developed schizophrenia sat, stood, walked and talked later and preferred solitary play. Elaine Walker's study of family home movies found more odd movements and less positive facial emotion in such children, years before illness.
- **Minor physical anomalies** (high-arched palate, low-set ears) and altered fingerprint patterns, which form in the second trimester.
- **Brain changes already present at the first episode**: enlarged ventricles and reduced grey matter, without the scarring (gliosis) that a degenerative process would leave.
- **Early environmental risks** listed above, and genetic risk enriched in genes expressed in the developing brain and at synapses.
- **C4 and pruning**: the strongest common genetic signal for schizophrenia (in the MHC region) partly reflects variation in complement component 4, which tags synapses for removal by microglia; higher C4 expression predicts higher risk.

:::widget compare
{
 "title": "Neurodevelopmental versus neurodegenerative views of schizophrenia",
 "a": {
  "label": "Neurodevelopmental",
  "points": ["The lesion is early, mostly prenatal and perinatal", "Childhood precursors in motor, cognitive and social development", "Brain changes at first episode, no gliosis", "Adolescent maturation unmasks the problem", "Fits the age of onset and early risk factors"],
  "summary": "Born vulnerable, revealed in youth."
 },
 "b": {
  "label": "Neurodegenerative (Kraepelin's 'dementia praecox')",
  "points": ["Progressive loss of grey matter after onset in some studies", "Worse outcome with longer untreated psychosis", "Cognitive decline in a subgroup", "But medicines, cannabis, alcohol, smoking and inactivity also shrink grey matter", "No typical degenerative pathology"],
  "summary": "Ongoing change after onset, cause debated."
 },
 "caption": "Most researchers now accept a neurodevelopmental origin with some progressive change around and after onset."
}
:::

### Other disorders with a developmental story
- **Autism**: early brain overgrowth in some toddlers (larger head circumference in the second year), differences in cortical organisation, and an altered balance of excitation and inhibition.
- **ADHD**: a large longitudinal MRI study led by Philip Shaw found the cortex reached its peak thickness about three years later in children with ADHD, most of all in the prefrontal cortex: a **delay** rather than a fixed deficit, consistent with many children improving with age.
- **Adolescent risk-taking**: in the **dual-systems** model, reward sensitivity in the ventral striatum peaks in mid-adolescence while prefrontal control matures into the twenties, so peers and rewards weigh most heavily at about 15 to 17.

:::widget decide
{
 "scene": "Varun, 16, in Chandigarh, has an uncle with schizophrenia. He has become withdrawn over six months, says sounds seem 'louder and strange', and has begun smoking high-potency cannabis daily with friends. His parents ask if anything can be done or if 'it is just in the genes'.",
 "ask": "What advice best reflects the neurodevelopmental model?",
 "choices": [
  { "label": "Genes decide everything; nothing can change the outcome", "verdict": "harm", "outcome": "The family loses hope and does not seek help; his cannabis use increases.", "why": "Genetic risk is not destiny. Adolescent factors such as cannabis and early help change outcomes." },
  { "label": "Refer to an early intervention service for assessment of a possible at-risk mental state, help him stop cannabis, support sleep, school and family, and monitor closely", "verdict": "best", "outcome": "He is assessed as at clinical high risk. He cuts down cannabis with support, and his symptoms ease over a year; he stays in school.", "why": "Adolescence is a second-hit window. Removing modifiable risks and offering early psychological support can reduce transition to psychosis." },
  { "label": "Start an antipsychotic immediately to protect his brain", "verdict": "ok", "outcome": "He feels sluggish, gains weight and stops the tablets.", "why": "Antipsychotics are not first-line for an at-risk state without psychosis; psychological and social support come first, with careful monitoring." }
 ]
}
:::

:::clinician
Radial unit hypothesis (Rakic): cortical columns arise from ventricular zone proliferative units; expansion of outer subventricular zone progenitors (outer radial glia) underlies primate cortical expansion. Reelin from Cajal-Retzius cells regulates the inside-out pattern (reeler mice invert layers); reduced reelin and GAD67 in post-mortem schizophrenia cortex implicate interneuron development. Parvalbumin interneurons, which generate gamma oscillations, are vulnerable to oxidative stress and NMDA hypofunction and show reduced markers in schizophrenia. Maternal immune activation models (poly I:C) produce offspring with prepulse inhibition deficits and dopamine changes at adolescence. Sekar and colleagues (2016) showed that C4A expression drives risk and that C4 mediates synapse elimination in mice. Effect sizes for individual environmental risks are modest (odds ratios mostly 1.5 to 2 for obstetric complications, winter birth about 1.1, urban upbringing about 2, migrant status about 2, daily high-potency cannabis about 3 to 5 in some samples). The ERA study's six-month cut-off emerged in the institutionalised Romanian sample; in the Bucharest Early Intervention Project the advantage was strongest with foster placement before about two years.
:::

:::recall
1. In what order do cortical layers form? || Inside-out: deep layers first, with later neurons migrating past them to superficial layers.
2. What are radial glia? || Progenitor cells in the ventricular zone that also act as scaffolds for migrating neurons.
3. Name two migration disorders and their clinical result. || Lissencephaly and heterotopia; epilepsy and intellectual disability.
4. What did Hubel and Wiesel show about sensitive periods? || Early monocular deprivation permanently shifts visual cortex responses to the open eye; the same in adults has little effect.
5. Who proposed the neurodevelopmental hypothesis of schizophrenia, and when? || Weinberger, and Murray and Lewis, independently in 1987.
6. Give four lines of evidence for it. || Childhood motor and cognitive precursors; minor physical anomalies; ventricular enlargement at first episode without gliosis; prenatal and perinatal risk factors (and C4 and pruning genetics).
7. What did Shaw's study find in ADHD? || Delayed cortical maturation, peak thickness about three years later, most in prefrontal cortex.
:::

:::mcq
Q: Neurons of the cerebral cortex reach their layers mainly by:
- Migrating outside-in, with superficial layers formed first
- *Migrating along radial glia inside-out, with deep layers formed first
- Forming in place without migration
- Migrating from the cerebellum
> Later-born neurons pass the earlier ones.

Q: The absence of gliosis in schizophrenia brains is used to argue that the abnormality is:
- Infectious
- *Developmental rather than degenerative
- Caused by medicines
- Located in the cerebellum
> Degeneration in adulthood leaves glial scarring.

Q: Children exposed to severe famine early in gestation during the Dutch Hunger Winter later showed:
- Lower risk of schizophrenia
- *About twice the risk of schizophrenia
- No change in any outcome
- Higher IQ
> Prenatal nutritional deprivation is a risk factor.

Q: Feinberg's hypothesis proposed that schizophrenia results from:
- Too little dopamine in adolescence
- *Excessive synaptic pruning during adolescence
- A single gene on chromosome 22
- Viral infection of the cerebellum
> Linked today with complement C4 and microglial pruning.
:::
`;

export const advPlasticity = String.raw`
## 5.5 Plasticity in depth: LTP, LTD, a sea slug and the growing brain [core][advanced]
In 5.3 you saw LTP in four steps. Here are the molecular stages, its opposite (LTD), the timing rule that decides between them, the sea slug that earned a Nobel Prize, and the honest state of evidence on adult neurogenesis and BDNF in psychiatry.

### From Hebb to Bliss and Lømo
- **Donald Hebb** (1949) proposed that when one cell repeatedly helps fire another, the connection between them strengthens: "cells that fire together wire together".
- **Timothy Bliss and Terje Lømo** (1973) found it: brief high-frequency stimulation of the pathway into the rabbit hippocampus (the perforant path to the dentate gyrus) made responses stronger for hours to days. They called it **long-term potentiation**.

LTP has four properties that make it a good memory mechanism:
1. **Input specificity**: only the stimulated synapses strengthen.
2. **Cooperativity**: enough inputs must be active together to reach the threshold.
3. **Associativity**: a weak input paired with a strong one onto the same cell is strengthened too, the cellular version of classical conditioning.
4. **Persistence**: it lasts hours to months.

### Early and late LTP
:::widget flow
{
 "title": "Early LTP becomes late LTP",
 "layout": "chain",
 "nodes": [
  { "id": "n", "label": "NMDA receptors open", "detail": "Glutamate plus strong depolarisation expels magnesium; calcium floods the spine." },
  { "id": "k", "label": "Kinases switch on", "detail": "CaMKII (which keeps itself active by phosphorylating itself), protein kinase C and others." },
  { "id": "a", "label": "Early LTP (1 to 3 hours)", "detail": "Existing AMPA receptors are phosphorylated and work better, and spare AMPA receptors are inserted into the membrane. No new proteins needed." },
  { "id": "c", "label": "Signals reach the nucleus", "detail": "With repeated or strong stimulation, cAMP, protein kinase A and MAP kinase activate the transcription factor CREB." },
  { "id": "l", "label": "Late LTP (hours to months)", "detail": "New genes and proteins, BDNF, enlarged and new dendritic spines. Blocked by protein synthesis inhibitors." }
 ],
 "caption": "Press Play. Compare with memory: short-term memory does not need new proteins; long-term memory does."
}
:::

- **Synaptic tagging and capture**: a weakly stimulated synapse gets a temporary "tag" and can capture the new proteins made for a strongly stimulated neighbour, so a trivial event near an important one may be remembered too.
- **Retrograde messengers** such as **nitric oxide** may tell the presynaptic terminal to release more.

### Long-term depression and the calcium rule
**LTD** is a lasting weakening, produced by prolonged **low-frequency** stimulation (about once a second for several minutes).
- A **small, slow** rise in calcium activates **phosphatases** (calcineurin, protein phosphatase 1), which remove phosphates and pull AMPA receptors **out** of the membrane.
- A **large, fast** rise activates **kinases** and gives LTP.
- In the **cerebellum**, LTD at the parallel fibre to Purkinje cell synapse, triggered when the climbing fibre fires at the same time (signalling an error), underlies motor learning, as Masao Ito showed.

:::widget compare
{
 "title": "LTP and LTD",
 "a": {
  "label": "Long-term potentiation",
  "points": ["High-frequency or well-timed input", "Large, fast calcium rise", "Kinases: CaMKII, PKA, PKC", "AMPA receptors inserted", "Spines grow"],
  "summary": "Strengthens a connection."
 },
 "b": {
  "label": "Long-term depression",
  "points": ["Low-frequency or poorly timed input", "Small, prolonged calcium rise", "Phosphatases: calcineurin, PP1", "AMPA receptors removed", "Spines shrink"],
  "summary": "Weakens a connection."
 },
 "caption": "Both are needed. A brain that could only strengthen would saturate; a brain that could only weaken would forget everything."
}
:::

### Spike-timing-dependent plasticity
Timing within a few tens of milliseconds decides the direction:
- the sending neuron fires **just before** the receiving neuron: the synapse is **strengthened** (it helped cause the spike);
- the sending neuron fires **just after**: the synapse is **weakened** (it was irrelevant).

This turns Hebb's rule into a causal rule. On top of it, **homeostatic scaling** turns all of a neuron's synapses up or down together to keep its overall firing in a healthy range, and **metaplasticity** means a synapse's recent history changes how easily it changes next.

### Learning in a sea slug: Eric Kandel's Aplysia
Kandel chose the sea slug **Aplysia**, with about 20,000 large, identifiable neurons, and studied its **gill-withdrawal reflex**. He shared the 2000 Nobel Prize for this work.

| Learning | What happens at the synapse |
|---|---|
| **Habituation** (repeated gentle touches; the reflex weakens) | The sensory neuron releases **less** transmitter onto the motor neuron (fewer calcium channels open, fewer vesicles ready) |
| **Sensitisation** (a shock to the tail; the reflex strengthens) | Facilitating interneurons release **serotonin** onto the sensory neuron terminal; cAMP and protein kinase A close potassium channels, prolonging the spike, letting in more calcium and releasing **more** transmitter |
| **Long-term sensitisation** (repeated shocks) | Protein kinase A enters the nucleus, activates **CREB**, and new proteins build **new synapses**: long-term memory needs gene expression and growth |
| **Classical conditioning** | A touch paired with a shock gives activity-dependent presynaptic facilitation, larger than either alone |

:::widget flow
{
 "title": "Sensitisation in Aplysia",
 "layout": "chain",
 "nodes": [
  { "id": "t", "label": "Shock to the tail", "detail": "Activates facilitating interneurons." },
  { "id": "s", "label": "Serotonin released", "detail": "Onto the terminals of the siphon sensory neurons." },
  { "id": "c", "label": "cAMP and protein kinase A", "detail": "The second-messenger chain switches on." },
  { "id": "k", "label": "Potassium channels close", "detail": "The spike lasts longer." },
  { "id": "r", "label": "More calcium, more release", "detail": "The motor neuron is driven harder: a stronger gill withdrawal." },
  { "id": "g", "label": "With repetition: CREB, new synapses", "detail": "Short-term memory becomes long-term." }
 ],
 "caption": "The same molecules, cAMP, PKA and CREB, reappear in mammalian late LTP and in how antidepressants change neurons."
}
:::

### Structural plasticity and new neurons
- **Enriched environments**: Mark Rosenzweig and colleagues found that rats raised with toys, companions and changing cages developed a heavier, thicker cortex with more synapses than rats housed alone; William Greenough's group counted more dendritic spines.
- **Learning in humans**: three months of learning to juggle increased grey matter in a motion-processing area of the temporal cortex, which shrank back after practice stopped; string players have a larger cortical representation of the fingers of the left hand.
- **Adult neurogenesis**: new neurons are born in the dentate gyrus of the hippocampus (and, in rodents, the walls of the lateral ventricles feeding the olfactory bulb). In humans the scale is **contested**: one carbon-dating study estimated about 700 new neurons a day in each hippocampus, while other post-mortem studies found almost none in adults.

:::widget guess
{
 "prompt": "A study that measured carbon-14 from 1950s nuclear tests in human DNA estimated how many new neurons each adult hippocampus adds per day. What was the estimate?",
 "min": 0,
 "max": 5000,
 "step": 50,
 "unit": "neurons a day",
 "answer": [600, 800],
 "reveal": "About 700 a day in each hippocampus, with a modest decline with age. Later post-mortem studies disagreed sharply, some finding almost no young neurons in adults, so treat human adult neurogenesis as possible but unsettled.",
 "clinician": "In mice, Santarelli and colleagues (2003) showed that blocking hippocampal neurogenesis with irradiation abolished some behavioural effects of fluoxetine; this rodent result fuelled the neurogenesis hypothesis of antidepressant action. Exercise, enrichment and antidepressants increase rodent neurogenesis; stress, glucocorticoids, alcohol and sleep loss reduce it."
}
:::

### BDNF and the neurotrophic hypothesis of depression
- **Brain-derived neurotrophic factor (BDNF)** supports neuron survival, spine growth and late LTP.
- Ronald Duman's **neurotrophic hypothesis**: chronic stress and high cortisol lower BDNF and shrink dendrites in the hippocampus and prefrontal cortex; antidepressants, ECT and exercise raise BDNF and reverse the shrinkage over weeks. Ketamine triggers BDNF release and mTOR-dependent spine growth within hours.
- Serum BDNF is lower on average in depression and rises with treatment, but it overlaps too much with healthy levels to be a test.
- A common variant, **Val66Met**, reduces activity-dependent BDNF release; Met carriers have, on average, slightly smaller hippocampi and weaker episodic memory, but its link with depression itself is weak.

:::widget decide
{
 "scene": "Priya, 29, a teacher in Bhubaneswar recovering from depression, reads online that 'antidepressants regrow your brain cells'. She asks whether that means she must take tablets for life to keep her new neurons.",
 "ask": "What is the most accurate answer?",
 "choices": [
  { "label": "Yes, tablets permanently grow new brain cells that will die if you stop", "verdict": "harm", "outcome": "She becomes frightened of ever stopping and distrustful when later told otherwise.", "why": "This overstates rodent findings; human adult neurogenesis is unsettled, and stopping medicine does not kill neurons." },
  { "label": "Explain that antidepressants, therapy, exercise and sleep all seem to promote brain plasticity, mostly connections rather than proven new neurons in humans; how long to continue medicine depends on relapse risk, not on keeping neurons alive", "verdict": "best", "outcome": "She understands the reasons for continuing treatment for some months after recovery and adds regular exercise.", "why": "Accurate, hopeful and practical: it links plasticity to several treatments and keeps the decision about duration clinical." },
  { "label": "Tell her the brain cannot change in adults", "verdict": "harm", "outcome": "She concludes recovery is luck and loses motivation for therapy.", "why": "Adult synaptic plasticity is well established." }
 ]
}
:::

:::clinician
Late LTP maintenance has been attributed to the persistently active atypical kinase PKMzeta (ZIP erased established memories in rodents), but PKMzeta knockout mice still show LTP and memory, with compensation by PKC iota/lambda, so the maintenance mechanism is debated. Memory reconsolidation: Nader, Schafe and LeDoux (2000) showed that a reactivated fear memory became labile and could be blocked by protein synthesis inhibition in the amygdala; human propranolol-reconsolidation trials in PTSD have mixed results. Engram cells (Tonegawa): optogenetic reactivation of dentate gyrus cells tagged during learning recalls fear in a new context. Fragile X: loss of FMRP leads to exaggerated mGluR5-dependent LTD and protein synthesis (Bear's mGluR theory); mGluR5 antagonist trials in humans failed, a lesson in translation. Psychedelics and ketamine increase spine density in rodent prefrontal cortex ("psychoplastogens"), but human evidence of structural change is indirect. Kindling (Goddard, 1967): repeated subconvulsive stimulation progressively lowers seizure threshold until spontaneous seizures occur, the model behind Post's kindling and sensitisation hypothesis of recurrent mood episodes (Section 7.2).
:::

:::recall
1. Who first described LTP, in which structure and year? || Bliss and Lømo, rabbit hippocampus (perforant path to dentate gyrus), 1973.
2. Name the four properties of LTP. || Input specificity, cooperativity, associativity, persistence.
3. Distinguish early and late LTP. || Early: kinase-driven changes to existing proteins and AMPA insertion, hours, no protein synthesis. Late: CREB-driven gene expression, new proteins, structural growth, lasting.
4. What decides LTP versus LTD at the same synapse? || The size and speed of the calcium rise (large and fast: kinases and LTP; small and slow: phosphatases and LTD), and spike timing.
5. Describe sensitisation in Aplysia. || Tail shock releases serotonin onto sensory terminals; cAMP and PKA close potassium channels, prolonging spikes and increasing calcium entry and release; repetition activates CREB and new synapses.
6. What is the neurotrophic hypothesis of depression? || Stress lowers BDNF and causes dendritic atrophy; antidepressant treatments raise BDNF and restore plasticity.
:::

:::mcq
Q: Long-term memory, but not short-term memory, for sensitisation in Aplysia requires:
- Habituation of the reflex
- *New protein synthesis via CREB and growth of new synapses
- Reduced serotonin release
- Loss of potassium channels
> Kandel's distinction between short- and long-term facilitation.

Q: Associativity in LTP means that:
- Only strongly stimulated synapses strengthen
- *A weak input paired with a strong input onto the same cell is strengthened too
- All synapses on a cell strengthen together
- LTP lasts only seconds
> The cellular parallel of classical conditioning.

Q: Low-frequency stimulation producing a modest rise in postsynaptic calcium most likely leads to:
- LTP via CaMKII
- *LTD via phosphatases and removal of AMPA receptors
- No change
- Excitotoxic cell death
> The calcium rule of plasticity.

Q: In spike-timing-dependent plasticity, a synapse is strengthened when:
- *The presynaptic neuron fires a few milliseconds before the postsynaptic neuron
- The postsynaptic neuron fires before the presynaptic neuron
- Both are silent
- The presynaptic neuron fires at random
> It contributed causally to the spike.

Q: The claim that antidepressants work mainly by generating new hippocampal neurons in humans is best described as:
- Firmly established in human studies
- *A hypothesis based mostly on rodent studies; human adult neurogenesis is debated
- Disproven in all species
- Relevant only to ketamine
> Treat it as unsettled.
:::
`;

export const advGenetics = String.raw`
## 5.6 Psychiatric genetics and epigenetics in depth [core][advanced]
Exams at this level ask for numbers (risks, heritabilities, loci), for named studies, and for the reasoning that links twin estimates, molecular findings and the environment. They also reward a clear grasp of what genetics can and cannot tell an individual patient.

### Single-gene and chromosomal conditions with behavioural features
| Condition | Genetic cause | Behavioural and psychiatric features |
|---|---|---|
| **Down syndrome** | Trisomy 21 (mostly nondisjunction; risk rises with maternal age) | Commonest genetic cause of intellectual disability; Alzheimer's pathology by about 40 because the amyloid precursor protein gene is on chromosome 21 |
| **Fragile X syndrome** | X-linked; CGG repeat expansion in FMR1 (over 200 repeats silences the gene by methylation) | Commonest **inherited** cause of intellectual disability; autism features, social anxiety, gaze avoidance, ADHD; long face, large ears, large testes after puberty. Premutation carriers (55 to 200) risk a late-onset tremor-ataxia syndrome and early menopause |
| **22q11.2 deletion (velocardiofacial)** | Microdeletion on chromosome 22, about 1 in 4,000 births | About a quarter develop psychosis; heart defects, cleft palate, immune problems; the region includes COMT |
| **Williams syndrome** | Microdeletion at 7q11.23, including the elastin gene | Very sociable, chatty "cocktail party" manner, relatively strong language but weak visuospatial skills, anxiety, love of music, a narrowed aorta |
| **Prader-Willi syndrome** | Loss of **paternal** 15q11 to 13 (deletion or two maternal copies) | Insatiable hunger and obesity, skin picking, OCD-like behaviour, tantrums; psychosis especially with maternal disomy |
| **Angelman syndrome** | Loss of **maternal** UBE3A in the same region | Severe intellectual disability, absent speech, frequent laughter, seizures, jerky gait |
| **Turner syndrome** | 45,X | Short stature, normal verbal ability, weaker visuospatial and arithmetic skills, social cognition difficulties |
| **Klinefelter syndrome** | 47,XXY | Tall, small testes, language and reading delays, higher rates of anxiety, depression and ADHD |
| **Phenylketonuria** | Autosomal recessive; phenylalanine hydroxylase deficiency | Untreated: intellectual disability; prevented by a low-phenylalanine diet from birth |
| **Huntington's disease** | Autosomal dominant CAG expansion on chromosome 4 | Depression, irritability, psychosis, suicide, dementia, chorea |
| **Lesch-Nyhan syndrome** | X-linked recessive; HPRT deficiency | Severe compulsive self-biting, gout |
| **Rett syndrome** | MECP2, X-linked, almost only girls | Normal early months, then regression, hand-wringing, loss of speech |
| **Smith-Magenis syndrome** | 17p11.2 deletion | Self-hugging, self-injury, sleep disturbance from an inverted melatonin rhythm |

Prader-Willi and Angelman syndromes are the textbook example of **genomic imprinting**: the same stretch of DNA causes different syndromes depending on which parent's copy is missing, because some genes are switched on only from one parent's chromosome.

:::widget sort
{
 "prompt": "Name the syndrome.",
 "buckets": ["Fragile X", "Williams", "Prader-Willi", "22q11.2 deletion", "Down syndrome"],
 "items": [
  { "text": "A friendly, talkative girl who hugs strangers, struggles to copy a simple drawing, and had heart surgery for a narrowed aorta", "bucket": 1 },
  { "text": "A boy with intellectual disability, avoids eye contact, long face and large ears; his mother's father developed a tremor and unsteadiness in his sixties", "bucket": 0, "why": "The grandfather likely carries a premutation (tremor-ataxia syndrome). Expansion through the mother produced the full mutation." },
  { "text": "A teenager with a cleft palate repair and a heart defect in infancy who now hears voices", "bucket": 3 },
  { "text": "A child who forages for food at night, picks his skin and has rapidly gained weight", "bucket": 2 },
  { "text": "A man of 45 with intellectual disability whose memory has begun to decline", "bucket": 4 }
 ]
}
:::

### Inheritance patterns and risk arithmetic
:::widget worked
{
 "title": "Risk for relatives in single-gene conditions",
 "steps": [
  { "q": "A man has Huntington's disease (autosomal dominant). His wife is unaffected. What is the risk for each child?", "a": "50 per cent for each child, regardless of sex, because each child receives either his affected or his normal copy." },
  { "q": "Both parents carry one copy of the phenylketonuria variant (autosomal recessive) and are healthy. What is the risk for each child?", "a": "25 per cent affected, 50 per cent healthy carriers, 25 per cent non-carriers. Consanguineous marriage, common in some Indian communities, raises the chance that both parents carry the same rare recessive variant." },
  { "q": "A woman carries an X-linked recessive condition such as Lesch-Nyhan syndrome; her husband is unaffected. What are the risks?", "a": "Each son has a 50 per cent chance of being affected; each daughter a 50 per cent chance of being a carrier. There is no father-to-son transmission in X-linked conditions." }
 ],
 "yourTurn": [
  { "q": "Why does Huntington's disease often begin earlier in a child than in the affected father?", "a": "Anticipation: the CAG repeat tends to expand when passed through the father's sperm, and longer repeats give earlier onset." }
 ]
}
:::

### How much do genes matter in common psychiatric disorders?
| Disorder | Twin heritability (approximate) |
|---|---|
| Schizophrenia | About 80 per cent (estimates 60 to 85) |
| Bipolar disorder | About 60 to 85 per cent |
| Autism | About 80 per cent |
| ADHD | About 70 to 80 per cent |
| Anorexia nervosa | About 50 to 60 per cent |
| Alcohol use disorder | About 50 per cent |
| OCD | About 40 to 50 per cent |
| Panic disorder | About 40 per cent |
| Major depression | About 35 to 40 per cent (higher in recurrent and early-onset illness) |
| Generalised anxiety disorder, PTSD | About 30 to 40 per cent |
| Big Five personality traits | About 40 to 50 per cent |
| Adult general intelligence | About 50 to 80 per cent, rising with age |

:::widget experiment
{
 "title": "Irving Gottesman's pooled risks for schizophrenia",
 "question": "Gottesman combined European family and twin studies. Predict the lifetime risk of schizophrenia for each relative of a person with schizophrenia.",
 "unit": "%",
 "max": 50,
 "conditions": [
  { "label": "General population", "value": 1 },
  { "label": "First cousin", "value": 2 },
  { "label": "Uncle or aunt", "value": 2 },
  { "label": "Grandchild", "value": 5 },
  { "label": "Sibling", "value": 9 },
  { "label": "Child of one affected parent", "value": 13 },
  { "label": "Fraternal (DZ) twin", "value": 17 },
  { "label": "Child of two affected parents", "value": 46 },
  { "label": "Identical (MZ) twin", "value": 48 }
 ],
 "why": "Risk falls with genetic distance, as genetic transmission predicts. Yet even an identical twin has only about a 50 per cent risk, so non-genetic factors matter. Indian textbooks quote similar figures (MZ about 46, DZ about 14, child of two affected parents about 40 per cent). Gottesman also showed that the children of the unaffected MZ twin have about the same risk as the children of the affected twin: the risk was carried, but not expressed."
}
:::

### Adoption studies that changed psychiatry
- **Leonard Heston (1966)**: of 47 children born to mothers with schizophrenia and adopted soon after birth, 5 developed schizophrenia; none of 50 matched adoptees did.
- **Seymour Kety, David Rosenthal and Paul Wender** (Danish registers): schizophrenia-spectrum illness was concentrated in the **biological**, not the adoptive, relatives of adoptees with schizophrenia.
- **Pekka Tienari** (Finnish adoption study): children of mothers with schizophrenia developed illness mainly when raised in **disturbed** adoptive families; good adoptive families appeared protective: a real **gene-environment interaction**.

### From genome scans to polygenic scores
- **GWAS** compare millions of common variants in huge case-control samples. The largest schizophrenia study (2022, about 77,000 cases) found **287 associated regions**, enriched in genes expressed in neurons and at synapses. One sits at **DRD2**, the target of all antipsychotics, a reassuring overlap between genetics and treatment. Bipolar disorder GWAS have found dozens of regions, and depression GWAS now find several hundred.
- **Polygenic risk scores** sum these effects. For schizophrenia they explain only a modest share of liability (well under a tenth) in people of European ancestry, less in other ancestries; most people with high scores never become ill.
- **SNP heritability** (what common variants together capture) is much lower than twin heritability, about a quarter for schizophrenia, the "missing heritability".
- **Genetic correlations** show heavy overlap: schizophrenia and bipolar disorder share much of their common-variant risk; depression, anxiety and neuroticism overlap strongly too.
- **Rare variants**: copy number variants (22q11.2 deletion, 3q29 deletion, 1q21.1 and 15q13.3 deletions, 16p11.2 duplication, NRXN1 deletions) and rare damaging mutations in genes such as SETD1A raise schizophrenia risk many times, and also raise risks for autism, intellectual disability and epilepsy.

:::widget compare
{
 "title": "Common variants versus rare variants",
 "a": {
  "label": "Common variants (GWAS)",
  "points": ["Found in many people", "Each raises risk by a tiny amount", "Thousands act together", "Summed into polygenic scores", "Explain much of population risk"],
  "summary": "Many small pushes."
 },
 "b": {
  "label": "Rare variants (CNVs and damaging mutations)",
  "points": ["Found in few people", "Each raises risk several-fold or more", "Often new (de novo) or recent", "Usually raise risk for several disorders", "Clinically testable (chromosomal microarray)"],
  "summary": "Few large pushes."
 },
 "caption": "Most patients carry many common risk variants and no rare one. A chromosomal microarray is worth considering in psychosis with intellectual disability, dysmorphic features or congenital anomalies."
}
:::

### Candidate genes and gene-environment interaction: lessons in caution
- In 2002, Avshalom Caspi and Terrie Moffitt reported in the Dunedin cohort that maltreated boys with a **low-activity MAOA** variant were more likely to become antisocial; meta-analyses give modest support.
- In 2003 they reported that the **short serotonin transporter (5-HTTLPR)** allele increased depression after stressful life events. Large later studies, including a 2019 analysis of 18 classic candidate genes for depression, found **no support** for these candidate effects.
- **COMT and adolescent cannabis** (2005) likewise failed to replicate robustly.
- What does hold: **genetic liability** as a whole (family history or polygenic score) interacts with stress, cannabis and adversity; Kenneth Kendler showed that severe life events raised depression risk most in women at highest genetic risk; Tienari's adoption study above is another example.
- **Differential susceptibility** (Jay Belsky and Michael Pluess) proposes that some people are more sensitive to the environment "for better and for worse": they fare worst in poor environments and best in supportive ones, unlike the one-way **diathesis-stress** model.

### Epigenetics: experience written on the genome
**Epigenetic** marks change gene activity without changing the DNA sequence:
- **DNA methylation**: methyl groups on cytosines (at CpG sites) in a gene's promoter usually **silence** it.
- **Histone modification**: acetylation loosens chromatin and allows transcription; deacetylation tightens it. (Valproate is a histone deacetylase inhibitor.)
- **Non-coding RNAs** such as microRNAs fine-tune protein production.

:::widget flow
{
 "title": "Michael Meaney's rat mothers",
 "layout": "chain",
 "nodes": [
  { "id": "m", "label": "High licking and grooming by the mother", "detail": "In the first week of life." },
  { "id": "s", "label": "Serotonin signalling in the pup's hippocampus", "detail": "Activates a transcription factor (NGFI-A)." },
  { "id": "d", "label": "Less methylation of the glucocorticoid receptor gene promoter", "detail": "The gene stays more open." },
  { "id": "g", "label": "More glucocorticoid receptors in the hippocampus", "detail": "Stronger negative feedback on the HPA axis." },
  { "id": "a", "label": "A calmer adult with smaller stress responses", "detail": "And, if female, a high-licking mother herself." }
 ],
 "caption": "Cross-fostering proved it was the mothering, not the genes. In people, a study of suicide victims found more methylation of the same receptor gene in the hippocampus of those abused in childhood."
}
:::

Other examples exams ask:
- **Dutch Hunger Winter**: about six decades later, people conceived during the famine had **less methylation** of the IGF2 gene than their unexposed siblings, with higher rates of obesity, heart disease and schizophrenia.
- **FKBP5**: in people with a particular FKBP5 variant, childhood trauma (not adult trauma) removes methylation in a stress-responsive region, raising later PTSD and depression risk: gene, timing and environment together.
- **Imprinting** (Prader-Willi and Angelman) and **X-inactivation** in females are normal epigenetic processes.
- Claims that trauma is passed on epigenetically across human generations remain **unproven**; animal findings exist but are debated.

### Concepts exams define
| Term | Meaning |
|---|---|
| **Heritability** | The proportion of **variation** in a trait in a **particular population and environment** associated with genetic differences; not a property of an individual |
| **Broad-sense heritability** | All genetic variance (additive, dominance, interaction between genes) |
| **Narrow-sense heritability** | Only the **additive** part; predicts resemblance between parents and children and response to selection |
| **Concordance** | The share of twin pairs in which, if one has the disorder, the other does too |
| **Endophenotype** (Irving Gottesman and Todd Gould) | A measurable, heritable, state-independent trait between genes and diagnosis, found more often in unaffected relatives: P50 gating, prepulse inhibition, smooth pursuit eye movements, working memory |
| **Reaction range** (Gottesman) | Genes set a range of possible outcomes; environment decides where within it a person lands |
| **Turkheimer's laws** | All behavioural traits are heritable; the effect of being raised in the same family is smaller than the effect of genes; a large part of variation is explained by neither genes nor family |

:::widget decide
{
 "scene": "Mrs Desai, 32, in Surat, has a brother with schizophrenia who also has a heart defect, a cleft palate repair and mild intellectual disability. She is pregnant and asks whether genetic testing could help her family.",
 "ask": "What is the most useful guidance?",
 "choices": [
  { "label": "Offer her brother a chromosomal microarray through a genetics service, because his features suggest a 22q11.2 deletion; if found, she can be tested and counselled about her own and her baby's risk", "verdict": "best", "outcome": "Her brother has a 22q11.2 deletion. She does not carry it, so her baby's risk from this cause is low; her brother's care now includes heart, calcium and immune checks.", "why": "Psychosis with congenital anomalies and intellectual disability is exactly when a rare-variant test is valuable, unlike a polygenic score." },
  { "label": "Order a polygenic risk score for the unborn baby", "verdict": "harm", "outcome": "A number with little predictive value causes worry throughout the pregnancy.", "why": "Polygenic scores are not validated for individual or prenatal prediction." },
  { "label": "Reassure her that schizophrenia is never genetic", "verdict": "harm", "outcome": "An actionable diagnosis in her brother is missed.", "why": "Inaccurate, and it closes the door on testing that would help." }
 ]
}
:::

:::clinician
Key molecular facts: PGC3 schizophrenia GWAS (2022) reported 287 loci with fine-mapping prioritising about 120 genes, and rare-variant exome studies (SCHEMA) implicated ten genes with large effects (including SETD1A, GRIN2A, GRIA3, CACNA1G, SP4, XPO7, TRIO, CUL1, HERC1, RB1CC1). CNV odds ratios for schizophrenia range from about 2 to 4 (16p11.2 duplication, 1q21.1) to above 20 (22q11.2 deletion) and about 40 (3q29 deletion). APOE e4: one copy raises Alzheimer's risk about threefold, two copies roughly eight- to twelvefold; e2 is protective; early-onset familial Alzheimer's follows APP, PSEN1 or PSEN2 mutations. DISC1, discovered through a translocation co-segregating with major mental illness in a Scottish family, is not supported by population GWAS. The 2019 analysis by Border and colleagues of 18 depression candidate genes in very large samples found no effects larger than chance, a cautionary tale about underpowered studies. Indian psychiatric genetics is under-represented: polygenic scores derived in Europeans perform worse in South Asians, and consanguinity in parts of South India increases recessive disorders; family cohorts such as the NIMHANS-led accelerator study of multiplex families are filling this gap. Klengel and colleagues (2013) reported allele-specific, childhood-trauma-dependent FKBP5 demethylation. Galton coined "nature and nurture" and pioneered twin and family methods, but also founded eugenics, a history that should shape how genetic information is used.
:::

:::recall
1. What is the commonest inherited cause of intellectual disability and its mechanism? || Fragile X syndrome: CGG repeat expansion in FMR1 with methylation silencing.
2. Explain imprinting using Prader-Willi and Angelman syndromes. || Loss of the paternal 15q11 to 13 region gives Prader-Willi; loss of the maternal copy (UBE3A) gives Angelman, because some genes there are expressed from only one parent's chromosome.
3. Give Gottesman's risks for an MZ twin, a DZ twin, a sibling and a child of two affected parents. || About 48, 17, 9 and 46 per cent.
4. What did the Tienari study show? || Genetic risk for schizophrenia was expressed mainly in disturbed adoptive families: gene-environment interaction.
5. How many regions did the largest schizophrenia GWAS find, and which drug target lies among them? || 287; DRD2.
6. Distinguish broad and narrow heritability. || Broad: all genetic variance. Narrow: additive variance only.
7. Describe Meaney's finding. || High maternal licking and grooming reduces methylation of the glucocorticoid receptor gene promoter, increasing hippocampal receptors and dampening adult stress responses.
8. What is an endophenotype? Give two examples. || A heritable, state-independent intermediate trait found in unaffected relatives; P50 gating deficit, smooth pursuit eye movement abnormality.
:::

:::mcq
Q: According to Gottesman's pooled data, the lifetime risk of schizophrenia for the identical co-twin of a person with schizophrenia is about:
- 10 per cent
- 17 per cent
- *48 per cent
- 100 per cent
> Half: genes matter, but are not destiny.

Q: Fragile X syndrome is caused by:
- Trisomy of chromosome 21
- *A CGG trinucleotide repeat expansion in the FMR1 gene on the X chromosome
- A deletion on chromosome 22
- A single base change in the phenylalanine hydroxylase gene
> Full mutations above 200 repeats are methylated and silenced.

Q: DNA methylation at a gene's promoter usually:
- Activates the gene
- *Silences the gene
- Changes the DNA sequence
- Duplicates the gene
> An epigenetic off switch.

Q: Read the assertion and reason. Assertion (A): A trait with a heritability of 0.8 can still be changed greatly by the environment. Reason (R): Heritability describes variance in a particular population and environment, not the fixed cause of a trait in an individual.
- *Both A and R are true, and R is the correct explanation of A
- Both A and R are true, but R is not the correct explanation of A
- A is true, but R is false
- A is false, but R is true
> Phenylketonuria is the classic example.

Q: Belsky and Pluess's differential susceptibility hypothesis differs from the diathesis-stress model in proposing that:
- Only negative environments matter
- *Some individuals are more responsive to both negative and positive environments
- Genes have no role
- Stress always causes illness
> "For better and for worse".

Q: Large studies in 2019 testing 18 classic candidate genes for depression found:
- Strong support for the serotonin transporter gene
- *No support beyond chance for the candidate genes
- That depression is caused by one gene
- That candidate genes explain most heritability
> Underpowered early studies produced false positives.

Q: A 15-year-old with mild intellectual disability, a repaired cleft palate and a history of a heart defect develops psychosis. The most useful genetic test is:
- A polygenic risk score
- *A chromosomal microarray for copy number variants such as 22q11.2 deletion
- APOE genotyping
- HLA-B*15:02 testing
> Rare large-effect variants are clinically testable.
:::
`;
