/* Module · Brain and behaviour, new Advanced Part VII: biological theories of the major disorders, as examinations ask them. Original text written for VIBHA School of Psychology. */

export const advTheories = String.raw`
## 7.1 Biological theories of schizophrenia [core][advanced]
Exams ask you to "discuss the biological basis of schizophrenia" in 15 marks. A strong answer moves through the hypotheses in historical order, gives the key evidence for each with a name and a number, states the limits, and ends by showing how they fit together. This section gives you that structure; imaging (6.4), development (5.4) and genetics (5.6) supply the details.

### The dopamine hypothesis in three versions
| Version | Claim | Key evidence |
|---|---|---|
| **I: dopamine excess** (1960s to 1970s) | Too much dopamine activity causes psychosis | Arvid Carlsson showed antipsychotics increased dopamine turnover (he shared the 2000 Nobel Prize); **Philip Seeman** and **Ian Creese, David Burt and Solomon Snyder** (1975 to 1976) found that antipsychotics' clinical potency correlates with their **D2 binding affinity**; amphetamine and levodopa can cause psychosis |
| **II: regional imbalance** (Kenneth Davis and colleagues, 1991) | **Too much** subcortical (mesolimbic) dopamine gives positive symptoms; **too little** prefrontal (mesocortical) dopamine gives negative and cognitive symptoms | Hypofrontality; D1 signalling in working memory |
| **III: the final common pathway** (Oliver Howes and Shitij Kapur, 2009) | Many hits (genes, development, stress, drugs) converge on **presynaptic dopamine dysregulation**, mainly in the associative striatum; dopamine excess creates **aberrant salience**, and delusions are the person's attempt to explain it | Raised dopamine synthesis capacity on F-DOPA PET, already present in high-risk people who later convert; exaggerated amphetamine-induced release |

**Limits**: about a third of patients are **treatment-resistant** and often have **normal** dopamine synthesis; D2 blockade is immediate but improvement builds over days to weeks; negative and cognitive symptoms barely respond to D2 blockade.

:::widget pathways
{
 "system": "dopamine",
 "caption": "Use the toggles to illustrate Version II: block D2 and watch positive symptoms ease in the mesolimbic road while the already low mesocortical road falls further. Add 5-HT2A block and see why second-generation drugs were hoped to spare negative symptoms and movement."
}
:::

### The glutamate (NMDA hypofunction) hypothesis
- **Phencyclidine** (Edward Luby, 1959) and **ketamine** (John Krystal, 1994) block NMDA receptors and produce, in healthy volunteers, **positive, negative and cognitive** symptoms together, unlike amphetamine, which mainly produces positive symptoms.
- **Anti-NMDA receptor encephalitis** (Josep Dalmau, 2007): antibodies that remove NMDA receptors cause psychosis and catatonia.
- **Mechanism**: NMDA receptors on fast-spiking **parvalbumin GABA interneurons** are especially sensitive. Weakening them **disinhibits** pyramidal neurons, causing disorganised cortical activity, poor gamma oscillations, and downstream **excess striatal dopamine**: the glutamate story feeds the dopamine story.
- **Supporting markers**: reduced mismatch negativity; raised glutamate on MRS in early illness.
- **Limits**: drugs aimed at the glycine site or metabotropic glutamate receptors failed in large trials.

:::widget flow
{
 "title": "How NMDA hypofunction leads to dopamine excess",
 "layout": "chain",
 "nodes": [
  { "id": "n", "label": "NMDA receptors weakened", "detail": "Genes (GRIN2A, others), antibodies, ketamine or PCP, kynurenic acid." },
  { "id": "p", "label": "Parvalbumin interneurons fire less", "detail": "Less GABA brake on cortical pyramidal cells; reduced GAD67 and parvalbumin post-mortem." },
  { "id": "d", "label": "Cortex disinhibited", "detail": "Disorganised firing, poor gamma rhythms: cognitive symptoms and disorganisation." },
  { "id": "h", "label": "Hippocampus overactive", "detail": "Drives the ventral striatum and midbrain." },
  { "id": "s", "label": "Striatal dopamine release rises", "detail": "Aberrant salience, then positive symptoms." }
 ],
 "caption": "This sequence (developed by Anthony Grace and others) links the glutamate, GABA and dopamine hypotheses into one circuit."
}
:::

:::widget figure
{"id": "nmda-receptor"}
:::

### Other neurotransmitter contributions
- **GABA**: David Lewis's post-mortem work shows reduced GAD67 and parvalbumin in prefrontal interneurons, linked to working-memory deficits.
- **Serotonin**: LSD and psilocybin (5-HT2A agonists) cause hallucinations; Herbert Meltzer proposed that a high **5-HT2A to D2 blocking ratio** defines "atypical" antipsychotics; pimavanserin, a 5-HT2A inverse agonist, treats Parkinson's disease psychosis.
- **Acetylcholine**: muscarinic M1 and M4 agonism (xanomeline) treats positive symptoms without D2 block; nicotinic alpha-7 receptors are linked to P50 gating, and **most people with schizophrenia smoke**, possibly partly as self-medication.

:::widget guess
{
 "prompt": "In many countries, what share of people with schizophrenia smoke tobacco?",
 "min": 0,
 "max": 100,
 "unit": "per cent",
 "answer": [55, 75],
 "reveal": "Roughly 60 to 70 per cent in Western samples, two to three times the general population; rates in India are also high, especially among men, including smokeless tobacco and bidis. Nicotine briefly improves sensory gating and attention, which may be one reason. Smoking also lowers clozapine and olanzapine levels by inducing CYP1A2.",
 "clinician": "Heavy smoking contributes to the 15 to 20 year mortality gap in schizophrenia. Varenicline and bupropion are effective and safe for cessation in stable patients; adjust clozapine dose when smoking stops."
}
:::

### Environmental and other biological hypotheses
| Factor | Evidence (approximate size of effect) |
|---|---|
| **Cannabis** | Swedish conscripts who used cannabis heavily by 18 had about six times the later risk (Sven Andréasson, 1987); in a European study, daily high-potency use was linked with about five times the odds of psychosis (Marta Di Forti, 2019) |
| **Urbanicity** | Higher incidence in cities (Robert Faris and Warren Dunham, Chicago, 1939); childhood urban upbringing roughly doubles risk, more than adult residence, arguing against pure social drift |
| **Migration and minority status** | About two to three times the risk in many migrant groups, linked to social adversity and discrimination |
| **Prenatal and perinatal** | Famine, infection, obstetric complications, winter or spring birth, older paternal age (5.4) |
| **Infection and immunity** | Toxoplasma antibodies (odds about 2 to 3), raised cytokines in acute illness, complement C4 (5.4, 6.6) |
| **Stress-vulnerability** (Joseph Zubin and Bonnie Spring, 1977) | Each person has a threshold; the greater the inherited vulnerability, the less stress needed to trigger an episode. High **expressed emotion** in families predicts relapse |

:::widget sort
{
 "prompt": "Which hypothesis does each finding mainly support?",
 "buckets": ["Dopamine", "Glutamate", "Neurodevelopmental", "Immune"],
 "items": [
  { "text": "Antipsychotic potency correlates with D2 affinity", "bucket": 0 },
  { "text": "Ketamine causes negative symptoms and cognitive deficits in healthy volunteers", "bucket": 1 },
  { "text": "Minor physical anomalies and childhood motor delay in people who later develop the illness", "bucket": 2 },
  { "text": "Raised F-DOPA uptake in people at clinical high risk who later convert", "bucket": 0 },
  { "text": "The strongest common genetic signal lies in the MHC region, partly through complement C4", "bucket": 3 },
  { "text": "Reduced mismatch negativity", "bucket": 1 },
  { "text": "Enlarged ventricles at the first episode without gliosis", "bucket": 2 }
 ]
}
:::

:::widget decide
{
 "scene": "Aman, 23, from Ludhiana, has recovered from a first psychotic episode. He used high-potency cannabis daily for three years before it began. He asks: 'Did the cannabis cause it? My friends smoke more and they are fine.'",
 "ask": "What is the most accurate and helpful answer?",
 "choices": [
  { "label": "Explain that cannabis, especially strong daily use in the teens, raises the risk several times but does not act alone; genes and other factors make some people more vulnerable, and continuing use roughly doubles the chance of relapse", "verdict": "best", "outcome": "Aman understands his personal risk and engages with a cannabis-reduction plan.", "why": "Honest about causation (a contributory cause in a vulnerable person), and focused on what he can change." },
  { "label": "Say cannabis is the only cause, so stopping guarantees he will never be ill again", "verdict": "harm", "outcome": "He stops cannabis but feels betrayed when he later has a stress-related relapse.", "why": "Overstates a single cause and makes a promise no one can keep." },
  { "label": "Say cannabis is harmless and unrelated", "verdict": "harm", "outcome": "He resumes daily use and relapses within months.", "why": "Contrary to strong epidemiological evidence." }
 ]
}
:::

:::clinician
A model answer integrates levels: polygenic and rare-variant risk enriched in synaptic genes (GRIN2A, SETD1A, complement C4); neurodevelopmental disruption of interneuron maturation and excessive pruning; NMDA hypofunction on parvalbumin interneurons producing cortical and hippocampal disinhibition; hippocampal overdrive of VTA dopamine neurons (Grace's model) producing striatal presynaptic hyperdopaminergia; aberrant salience and predictive processing errors generating delusions and hallucinations; and stress, cannabis and social adversity sensitising the dopamine system (sensitisation is shown by larger stress-induced dopamine release in high-risk individuals). Treatment-resistant schizophrenia appears to be a "normodopaminergic" subtype in many cases, with glutamatergic abnormalities (raised anterior cingulate glutamate) and better response to clozapine, whose mechanism remains uncertain (low, transient D2 occupancy, D4, 5-HT2A, muscarinic, glutamatergic and immune effects). Trace amine-associated receptor 1 agonists (ulotaront) missed primary endpoints in phase 3 trials. Kraepelin's "dementia praecox" and Bleuler's four A's frame the historical neurodegenerative versus syndromic debate.
:::

:::recall
1. Who showed that antipsychotic potency correlates with D2 affinity? || Seeman, and Creese, Burt and Snyder, in 1975 to 1976.
2. State Davis's revised dopamine hypothesis. || Subcortical dopamine excess causes positive symptoms; prefrontal dopamine deficit causes negative and cognitive symptoms.
3. What is Version III of the dopamine hypothesis? || Howes and Kapur: many risk factors converge on presynaptic striatal dopamine dysregulation, producing aberrant salience.
4. Give two lines of evidence for the glutamate hypothesis. || PCP and ketamine reproduce positive, negative and cognitive symptoms; anti-NMDA receptor encephalitis causes psychosis (also reduced MMN and GRIN2A genetics).
5. How does NMDA hypofunction lead to dopamine excess? || Weakened interneurons disinhibit cortex and hippocampus, which then drive midbrain dopamine neurons and striatal release.
6. State the stress-vulnerability model. || Zubin and Spring: episodes occur when stress exceeds an individual's vulnerability threshold.
:::

:::mcq
Q: The finding that best supports the original dopamine hypothesis is that:
- Antipsychotics increase serotonin
- *Clinical potency of antipsychotics correlates with their D2 receptor binding affinity
- Dopamine levels are high in the blood of patients
- All patients respond to D2 blockade
> Seeman and Snyder's correlation.

Q: Unlike amphetamine, ketamine in healthy volunteers produces:
- Only positive symptoms
- *Positive, negative and cognitive symptoms
- No psychological effects
- Only euphoria
> Why NMDA hypofunction models the whole syndrome.

Q: Patients with treatment-resistant schizophrenia often show:
- Very high striatal dopamine synthesis capacity
- *Normal striatal dopamine synthesis capacity
- Absent D2 receptors
- High serotonin transporter binding
> Pointing to non-dopaminergic mechanisms and clozapine.

Q: Read the assertion and reason. Assertion (A): Childhood urban upbringing is associated with higher schizophrenia risk. Reason (R): People with schizophrenia drift into cities only after illness begins.
- Both A and R are true, and R is the correct explanation of A
- Both A and R are true, but R is not the correct explanation of A
- *A is true, but R is false
- A is false, but R is true
> Drift happens, but the risk is linked to urban birth and upbringing before any illness, so drift alone cannot explain it.
:::

## 7.2 Biological theories of depression and bipolar disorder [core][advanced]
Mood disorders have the longest list of biological theories in psychiatry. Exams reward an answer that starts with the monoamine hypothesis, explains why it is incomplete, then shows the newer models (receptor adaptation, stress hormones, neurotrophins, glutamate, inflammation, circadian rhythm, kindling), and finally treats bipolar disorder and lithium separately.

### How the monoamine hypothesis began
:::widget timeline
{
 "prompt": "Put the origins of the monoamine hypothesis in order.",
 "events": [
  { "label": "Reserpine, used for high blood pressure, depletes monoamines and is linked with depression in some patients", "when": "early 1950s" },
  { "label": "Iproniazid, a tuberculosis drug and MAO inhibitor, lifts patients' mood", "when": "1950s" },
  { "label": "Roland Kuhn reports the antidepressant effect of imipramine", "when": "1957" },
  { "label": "Joseph Schildkraut's catecholamine hypothesis", "when": "1965" },
  { "label": "Alec Coppen's serotonin (indoleamine) hypothesis", "when": "1967" },
  { "label": "Fridolin Sulser and colleagues: chronic antidepressants downregulate beta receptors", "when": "late 1970s" }
 ],
 "why": "Medicines discovered by chance shaped the theory, not the other way round, which is one reason the theory proved too simple."
}
:::

### Evidence for and against the monoamine hypothesis
| For | Against |
|---|---|
| Drugs that raise monoamines treat depression | Reuptake is blocked in hours but benefit takes weeks |
| **Tryptophan depletion** (Pedro Delgado, 1990) causes rapid relapse in recovered patients taking SSRIs | Tryptophan depletion does **not** cause depression in people never depressed |
| Low CSF 5-HIAA in violent suicide | Cocaine and amphetamine raise monoamines but are not antidepressants |
| Reserpine depression in some patients | Tianeptine, which **enhances** reuptake in some studies, is an antidepressant |
| Raised brain MAO-A binding in depression | A 2022 umbrella review found no consistent evidence of a serotonin deficit |

**Refinements**:
- **Permissive hypothesis** (Arthur Prange, 1974): low serotonin "permits" mood swings, with noradrenaline deciding the direction (low in depression, high in mania).
- **Receptor sensitivity hypothesis**: depression reflects receptor changes; chronic antidepressants and ECT **downregulate beta-adrenergic** and 5-HT2 receptors and desensitise 5-HT1A autoreceptors, matching the time course of benefit.
- **Cholinergic-adrenergic balance** (David Janowsky, 1972): relative cholinergic excess in depression (physostigmine can induce low mood) and adrenergic excess in mania.

### Newer models
| Model | Core idea | Key evidence |
|---|---|---|
| **HPA axis** (6.1) | Chronic stress and weak feedback keep cortisol high | DST non-suppression; raised CSF CRH; Cushing's syndrome causes depression |
| **Neurotrophic** (5.5) | Stress lowers BDNF and shrinks dendrites; treatments restore plasticity | Hippocampal and prefrontal volume loss; BDNF rises with treatment |
| **Glutamate** | Stress-induced synaptic loss in prefrontal cortex; ketamine restores synapses in hours | Rapid antidepressant effect of ketamine and esketamine |
| **Inflammation** (6.6) | Cytokines divert tryptophan and dampen reward | Interferon-induced depression; raised CRP in a subgroup |
| **Circadian** (6.2) | A disrupted clock destabilises mood | Short REM latency; wake and light therapy; clock gene links |
| **Cognitive neuropsychological** (Catherine Harmer) | Antidepressants shift emotional processing towards positive information within hours; mood improves later as the person relearns from the world | Single doses change recognition of happy and fearful faces |
| **Learned helplessness** (Martin Seligman) | Uncontrollable stress produces passivity | Later neuroscience (Steven Maier and Seligman, 2016) reversed it: passivity is the default response, mediated by dorsal raphe serotonin, and the ventromedial prefrontal cortex learns **control**, which protects |
| **Circuits** (Helen Mayberg) | Overactive subgenual cingulate and underactive dorsolateral prefrontal cortex | Treatment response normalises both; DBS and TMS target the circuit |

:::widget build
{
 "vignette": "A 52-year-old man in Kanpur has had severe depression for two months with early morning waking, worse mood in the mornings, marked weight loss, psychomotor slowing and intense guilt. A research team plans biological tests.",
 "rule": "Tick the findings that would be expected in melancholic depression according to classic biological research. A typical picture shows at least four.",
 "symptoms": [
  { "label": "Shortened REM latency on a sleep study", "present": true, "core": true, "why": "The best-known sleep marker of depression." },
  { "label": "Non-suppression of cortisol after 1 mg dexamethasone", "present": true, "core": true, "why": "Found in about half of melancholic inpatients." },
  { "label": "Blunted TSH response to TRH", "present": true, "why": "In about a quarter of euthyroid depressed patients." },
  { "label": "Blunted growth hormone response to clonidine", "present": true, "why": "Suggesting reduced alpha-2 receptor sensitivity." },
  { "label": "Increased slow-wave (N3) sleep", "present": false, "why": "Slow-wave sleep is usually reduced." },
  { "label": "Exaggerated cortisol suppression on a low-dose test", "present": false, "why": "That pattern belongs to chronic PTSD." },
  { "label": "A blood test showing low serotonin that confirms the diagnosis", "present": false, "why": "No such diagnostic test exists." }
 ],
 "need": 4,
 "needCore": true,
 "verdict": "Short REM latency, DST non-suppression, blunted TSH to TRH and blunted GH to clonidine are the classic findings. None is diagnostic: each is found in only a proportion of patients and in other conditions."
}
:::

### Bipolar disorder: the extra theories
- **Genetics**: higher heritability than unipolar depression (5.6), with heavy overlap with schizophrenia.
- **Dopamine in mania**: amphetamine and levodopa can induce mania; antipsychotics treat it; dopamine overactivity in mania and underactivity in bipolar depression is a working model.
- **Kindling and sensitisation** (Robert Post, 1992): borrowed from epilepsy (5.5). Early episodes follow major stressors; with each episode the brain is sensitised, so later episodes need smaller triggers or arise spontaneously, and intervals shorten. It supports early and continued treatment and helped introduce anticonvulsants, though evidence for the pattern is mixed.
- **Circadian and social rhythm** disruption (6.2).
- **Intracellular signalling and energy**: mitochondrial dysfunction and oxidative stress; altered sodium-potassium pump activity.

### How lithium might work: an exam table
| Target | Effect |
|---|---|
| **Inositol monophosphatase** | Lithium inhibits it, depleting inositol in overactive neurons and damping phosphatidylinositol signalling (Michael Berridge's **inositol depletion hypothesis**, 1989) |
| **GSK-3 beta** | Inhibited directly and indirectly; affects clock proteins, neuroprotection and plasticity |
| **Protein kinase C** | Reduced; tamoxifen, a PKC inhibitor, showed antimanic effects in small trials |
| **Neuroprotection** | Raises BCL-2 and BDNF; lithium users have larger grey matter and hippocampal volumes |
| **Neurotransmission** | Reduces dopamine and glutamate excess, enhances serotonin |
| **Clock** | Lengthens the circadian period |
| **Clinical uniqueness** | Reduces suicide and suicide attempts more than other mood stabilisers |

John Cade, an Australian psychiatrist, reported lithium's effect in mania in **1949**, after noticing that lithium made guinea pigs placid.

:::widget compare
{
 "title": "Unipolar depression versus bipolar disorder: biological contrasts",
 "a": {
  "label": "Unipolar depression",
  "points": ["Heritability about 35 to 40 per cent", "HPA overactivity in melancholic forms", "Inflammation in a subgroup", "Responds to antidepressants, ECT, ketamine", "Fewer white matter hyperintensities"],
  "summary": "A common, moderately heritable, stress-linked disorder."
 },
 "b": {
  "label": "Bipolar disorder",
  "points": ["Heritability about 60 to 85 per cent", "Strong circadian and sleep sensitivity", "Kindling-like course in some", "Antidepressants alone can trigger switches", "Lithium is uniquely effective and anti-suicidal"],
  "summary": "A highly heritable disorder of mood regulation and rhythm."
 },
 "caption": "Shared features (short REM latency, DST non-suppression in depressive phases) make biology a poor guide to telling them apart in one patient."
}
:::

:::clinician
For a 15-mark answer, structure: monoamine hypothesis (origins, evidence, criticisms including the 2022 umbrella review and its own critics); receptor sensitivity and autoreceptor desensitisation; neuroendocrine (HPA, HPT, GH); neurotrophic and neuroplasticity, including ketamine's synaptogenic action via mTOR and the debate about opioid involvement; inflammation; circadian; genetics (GWAS with hundreds of loci, heritability about 37 per cent); circuits and the cognitive neuropsychological account; and an integrated diathesis-stress formulation. Janowsky's cholinergic-adrenergic hypothesis gained renewed interest when scopolamine showed rapid antidepressant effects in small trials. Lithium's anti-suicidal effect may be partly independent of mood stabilisation (reduced impulsivity and aggression). Post's kindling model predicts that untreated early episodes worsen prognosis; supportive data include associations between number of prior episodes and poorer treatment response, but cycle-length shortening is not universal. Mitochondrial complex I dysfunction and raised brain lactate on MRS are reported in bipolar disorder.
:::

:::recall
1. Who proposed the catecholamine and the indoleamine hypotheses of depression? || Schildkraut (1965) and Coppen (1967).
2. What does tryptophan depletion show? || Rapid relapse in recovered SSRI-treated patients, but no depression in never-depressed people: serotonin is involved in maintaining response, not a simple cause.
3. State Prange's permissive hypothesis. || Low serotonin permits mood disorder; noradrenaline level decides depression versus mania.
4. What is the receptor sensitivity hypothesis? || Chronic antidepressants act by downregulating beta and 5-HT2 receptors and desensitising autoreceptors, matching the delay in effect.
5. Describe Post's kindling hypothesis. || Early mood episodes need major stressors; sensitisation makes later episodes need smaller triggers or arise spontaneously, with shorter intervals.
6. Name three proposed mechanisms of lithium. || Inositol monophosphatase inhibition (inositol depletion), GSK-3 beta inhibition, neuroprotection via BCL-2 and BDNF (also PKC, clock effects).
7. Who introduced lithium for mania and when? || John Cade, in 1949.
:::

:::mcq
Q: Reserpine, used in the 1950s for high blood pressure, was linked with depression because it:
- Blocks serotonin receptors
- *Depletes monoamines by blocking vesicular storage
- Inhibits MAO
- Blocks reuptake
> VMAT blockade empties vesicles.

Q: Chronic antidepressant treatment and ECT both lead to:
- Upregulation of beta-adrenergic receptors
- *Downregulation of beta-adrenergic receptors
- Loss of all serotonin receptors
- No receptor changes
> Sulser's receptor sensitivity findings.

Q: Berridge's inositol depletion hypothesis explains the action of:
- Valproate
- *Lithium
- Lamotrigine
- Fluoxetine
> Inhibition of inositol monophosphatase.

Q: The kindling hypothesis of mood disorders was proposed by:
- Schildkraut
- *Robert Post
- John Cade
- Martin Seligman
> Borrowed from Goddard's epilepsy model.

Q: Maier and Seligman's later neuroscience of learned helplessness concluded that:
- Helplessness must be learned through repeated failure
- *Passivity is the default response to uncontrollable stress, and the prefrontal cortex learns control
- Serotonin plays no part
- Helplessness cannot be reversed
> A reversal of the original account.
:::

:::widget figure
{"id": "lithium-neuron"}
:::

## 7.3 Biological theories of anxiety, OCD and PTSD [core][advanced]
These disorders share the fear and threat circuits of 5.2, but each has its own signature: panic's body alarm, OCD's looping circuit, PTSD's memory that will not settle.

### Anxiety and panic
| Theory | Core idea and evidence |
|---|---|
| **Noradrenergic (locus coeruleus)** | Eugene Redmond showed that stimulating the locus coeruleus in monkeys produced fear and that lesions reduced it; **yohimbine** (an alpha-2 blocker that raises noradrenaline) provokes panic in panic disorder; clonidine damps it |
| **GABA and the benzodiazepine receptor** | Benzodiazepines relieve anxiety; in panic disorder, **flumazenil** (neutral in healthy people) provokes panic, suggesting a shifted receptor "set point"; PET shows reduced benzodiazepine binding in some studies |
| **Serotonin's dual role** (Bill Deakin and Frederico Graeff) | Serotonin **increases** anticipatory anxiety in the amygdala but **restrains** panic in the periaqueductal grey; SSRIs at first can worsen anxiety, then reduce panic |
| **CRH and CCK** | CRH drives fear behaviour; the peptide CCK-4 triggers panic attacks |
| **False suffocation alarm** (Donald Klein, 1993) | Panic is a misfiring brainstem suffocation detector; patients are hypersensitive to **carbon dioxide** and **sodium lactate** |
| **Neuroanatomical model** (Jack Gorman, 2000) | A fear network centred on the amygdala, with brainstem, hypothalamic and cortical connections; drugs act from below (brainstem), therapy from above (prefrontal cortex and hippocampus) |
| **Behavioural inhibition** (Jerome Kagan) | About 15 to 20 per cent of toddlers are shy and wary of novelty, with higher heart rates and cortisol; they are at higher risk of later social anxiety |
| **Gray's behavioural inhibition system** | A septo-hippocampal system that detects conflict and inhibits behaviour; anxiolytics act on it |

:::widget experiment
{
 "title": "Provoking panic in the laboratory",
 "question": "In classic studies, people with panic disorder and healthy controls received an intravenous sodium lactate infusion. Predict the share of each group who had a panic attack.",
 "unit": "%",
 "conditions": [
  { "label": "Panic disorder", "value": 70, "note": "Most studies report roughly 60 to 80 per cent." },
  { "label": "Healthy controls", "value": 10, "note": "Usually 0 to 20 per cent." }
 ],
 "why": "First shown by Ferris Pitts and James McClure in 1967. Lactate and 35 per cent carbon dioxide provoke panic far more often in panic disorder, supporting a hypersensitive body alarm, and successful treatment reduces the response."
}
:::

### OCD
- **Cortico-striato-thalamo-cortical (CSTC) loop**: overactivity of the **orbitofrontal cortex, caudate and anterior cingulate** with the thalamus, a loop that keeps signalling "not done" (5.2, 6.4). The direct pathway is thought to dominate the indirect pathway in this loop.
- **Serotonin**: the key clue was that **clomipramine**, a strongly serotonergic tricyclic, works in OCD while the noradrenergic desipramine does not; SSRIs need higher doses and longer trials than in depression; the serotonin agonist mCPP can worsen symptoms.
- **Dopamine**: low-dose antipsychotic augmentation helps, especially with **tics**; OCD and Tourette syndrome run together.
- **Glutamate**: raised CSF glutamate in some studies, genetic signals in glutamate transporter genes; glutamate-modulating drugs are under study.
- **Animal models**: mice lacking the synaptic protein SAPAP3 groom themselves until they are injured, and fluoxetine reverses it; mice with a mutated Hoxb8 gene in microglia also over-groom.
- **Habit model** (Claire Gillan): people with OCD over-rely on habits rather than goal-directed control.
- **Treatment of last resort** targets the loop: anterior capsulotomy, cingulotomy, and **deep brain stimulation** of the ventral capsule and ventral striatum.

:::widget sort
{
 "prompt": "Which theory does each finding support?",
 "buckets": ["Panic: noradrenergic", "Panic: suffocation alarm", "OCD: serotonin", "OCD: CSTC circuit"],
 "items": [
  { "text": "Yohimbine provokes panic attacks", "bucket": 0 },
  { "text": "35 per cent carbon dioxide provokes panic attacks", "bucket": 1 },
  { "text": "Clomipramine works but desipramine does not", "bucket": 2 },
  { "text": "Orbitofrontal and caudate hyperactivity falls after successful treatment", "bucket": 3 },
  { "text": "Deep brain stimulation of the ventral capsule and striatum helps severe cases", "bucket": 3 },
  { "text": "Clonidine reduces panic symptoms", "bucket": 0 }
 ]
}
:::

### PTSD
Only a minority of people exposed to trauma develop PTSD (roughly 1 in 10 to 1 in 5 depending on the trauma), so biology helps explain **who** is vulnerable as well as what changes.
- **Fear conditioning and failed extinction**: strong conditioning in the amygdala, weak extinction and safety signalling from the ventromedial prefrontal cortex and hippocampus (5.2).
- **Noradrenaline**: raised levels, yohimbine provokes flashbacks; **adrenaline at the time of trauma strengthens memory consolidation** (James McGaugh), which led to trials of **propranolol** soon after trauma (mixed results).
- **HPA**: low or normal cortisol with **enhanced feedback** (6.1); low cortisol in the hours after trauma predicted later PTSD in some studies, and early **hydrocortisone** may prevent PTSD in some groups.
- **Structure**: small hippocampus, partly **pre-existing** (Gilbertson's twins, 6.4).
- **Genes and epigenetics**: heritability about 30 to 40 per cent; FKBP5 variants interacting with childhood trauma (5.6).
- **Dissociative subtype**: excess prefrontal inhibition of limbic areas ("overmodulation"), opposite to the usual undermodulation.

:::widget flow
{
 "title": "From trauma to PTSD: where biology adds risk",
 "layout": "chain",
 "nodes": [
  { "id": "p", "label": "Before the trauma", "detail": "Genetic risk, a smaller hippocampus, earlier childhood adversity, FKBP5 variants." },
  { "id": "t", "label": "During the trauma", "detail": "A surge of noradrenaline and adrenaline; peritraumatic dissociation." },
  { "id": "c", "label": "Hours after", "detail": "Low cortisol may fail to restrain the stress response and memory consolidation." },
  { "id": "f", "label": "Weeks after", "detail": "Avoidance prevents extinction learning; sleep disruption impairs emotional memory processing." },
  { "id": "d", "label": "Chronic PTSD", "detail": "Amygdala overactivity, weak prefrontal control, enhanced HPA feedback, hyperarousal." }
 ],
 "caption": "Each step suggests a window for prevention: early psychological help, sleep protection, and research treatments such as hydrocortisone."
}
:::

:::clinician
Panic: the anxiogenic effect of flumazenil in panic disorder (Nutt, 1990) suggested an inverse-agonist shift at the benzodiazepine site. CO2 hypersensitivity is shared by unaffected first-degree relatives, suggesting a trait marker. Acid-sensing ion channels in the amygdala detect CO2-induced acidosis in rodents. OCD: SSRI response typically needs two to three months at higher doses and is partial in many; augmentation with low-dose aripiprazole or risperidone is supported, especially with tics. Glutamatergic agents (memantine, N-acetylcysteine, topiramate) have small mixed trials. DBS of the ventral capsule and ventral striatum gained a US humanitarian device exemption in 2009. PTSD: SSRIs (sertraline, paroxetine) have modest effects; trauma-focused psychotherapies are first-line. The large US Veterans Affairs prazosin trial (2018) found no benefit over placebo for nightmares in chronic military PTSD, contrasting with earlier positive smaller trials. MDMA-assisted therapy was not approved by the US FDA in 2024, which requested further trials.
:::

:::recall
1. Give three lines of evidence for a noradrenergic theory of panic. || Locus coeruleus stimulation causes fear in monkeys; yohimbine provokes panic; clonidine reduces it.
2. What is Klein's false suffocation alarm theory? || Panic reflects an oversensitive brainstem detector of suffocation, shown by CO2 and lactate sensitivity.
3. What is the dual role of serotonin in anxiety (Deakin and Graeff)? || It increases anticipatory anxiety via the amygdala but inhibits panic in the periaqueductal grey.
4. What is the key pharmacological clue for the serotonin hypothesis of OCD? || Clomipramine is effective but desipramine is not.
5. Which circuit is hyperactive in OCD? || Orbitofrontal cortex, caudate, anterior cingulate and thalamus (CSTC loop).
6. Why does adrenaline at the time of trauma matter? || It enhances memory consolidation, strengthening the trauma memory.
7. What is the dissociative subtype of PTSD in brain terms? || Prefrontal overmodulation of limbic responses.
:::

:::mcq
Q: Sodium lactate infusion provokes panic attacks in:
- *Most people with panic disorder and few healthy controls
- Most healthy controls
- Only people with OCD
- Nobody
> Pitts and McClure, 1967.

Q: The drug whose superior efficacy in OCD led to the serotonin hypothesis is:
- Desipramine
- *Clomipramine
- Bupropion
- Diazepam
> Strongly serotonergic.

Q: Which finding suggests that a small hippocampus can be a pre-existing risk factor for PTSD?
- PTSD patients have larger amygdalae
- *Unexposed identical co-twins of veterans with PTSD also have small hippocampi
- Hippocampal volume increases with trauma
- PTSD has no genetic component
> Gilbertson's twin study.

Q: Mice lacking SAPAP3 groom excessively until injured, a behaviour reversed by:
- Haloperidol
- *Fluoxetine
- Diazepam only
- Lithium only
> A model of compulsive behaviour in the CSTC circuit.
:::

## 7.4 Biological theories of addiction and dementia [core][advanced]
Two very different groups, one theme: in addiction, normal learning machinery is captured; in dementia, the machinery itself degenerates. Both are favourite long-answer topics.

### Addiction: one final common pathway, many doors
In 1988 Gaetano Di Chiara and Assunta Imperato showed that most drugs misused by humans **raise dopamine in the nucleus accumbens**, more than natural rewards. Each drug opens a different door to the same room.

| Drug | How it raises accumbens dopamine |
|---|---|
| **Cocaine** | Blocks the dopamine transporter (DAT) |
| **Amphetamine, methamphetamine** | Reverse the transporter and empty vesicles (VMAT2), pushing dopamine out |
| **Opioids** | Act at mu receptors on GABA interneurons in the ventral tegmental area, **disinhibiting** dopamine neurons; also act directly in the accumbens |
| **Alcohol** | Enhances GABA-A, blocks NMDA, releases endogenous opioids |
| **Nicotine** | Stimulates alpha-4 beta-2 nicotinic receptors on VTA dopamine neurons |
| **Cannabis** | CB1 receptors on GABA terminals in the VTA reduce inhibition of dopamine neurons |
| **Benzodiazepines** | Enhance GABA-A on VTA interneurons, disinhibiting dopamine neurons |

:::widget release
{
 "transmitter": "dopamine",
 "caption": "Compare amphetamine (pushes dopamine out) with a reuptake blocker and with an antagonist. In the accumbens, a surge like this, larger and faster than any natural reward, teaches the brain that the drug 'matters more than anything'."
}
:::

### Learning theories in brain terms
- **Reward prediction error** (Wolfram Schultz): dopamine neurons fire to **unexpected** rewards; after learning they fire to the **cue** instead, and dip when an expected reward fails to appear. Drugs produce a dopamine surge every time, so the "better than expected" signal never stops: cues gain ever more value.
- **Incentive sensitisation** (Terry Robinson and Kent Berridge): repeated drug use **sensitises** dopamine "wanting" while "liking" (pleasure, carried by opioid hotspots) stays the same or falls. People crave drugs they no longer enjoy.
- **Opponent process and allostasis** (George Koob): with repeated use, the reward system drops below baseline (**reward deficit**) and stress systems (CRH, dynorphin, noradrenaline in the extended amygdala) rise (**stress surfeit**), so drug use shifts from seeking pleasure to escaping misery: negative reinforcement.
- **Habit** (Barry Everitt and Trevor Robbins): control shifts from the ventral to the dorsal striatum (5.2).
- **Impaired control** (Nora Volkow): reduced striatal D2 receptors and reduced orbitofrontal and anterior cingulate activity weaken the brake.
- **Molecular switches**: **delta-FosB**, a stable transcription factor, accumulates in the accumbens with repeated use (Eric Nestler) and sustains changes; disturbed **glutamate homeostasis** in the accumbens (Peter Kalivas) drives cue-induced relapse.

### Tolerance, withdrawal and conditioned tolerance
| Type | Mechanism |
|---|---|
| **Metabolic (dispositional) tolerance** | The liver clears the drug faster (enzyme induction in heavy drinkers) |
| **Pharmacodynamic (cellular) tolerance** | Receptors downregulate or uncouple; opioid neurons upregulate cAMP signalling |
| **Conditioned (behavioural) tolerance** | The body learns to prepare for the drug in familiar surroundings. Shepard Siegel found rats given a large heroin dose in a **new** room died far more often than rats given it in their usual room |
| **Sensitisation (reverse tolerance)** | Repeated stimulant doses produce **larger** behavioural effects, especially psychosis-like effects |
| **Withdrawal** | The adapted brain without the drug: alcohol (weak GABA, excess glutamate: tremor, seizures, delirium tremens); opioids (unbraked locus coeruleus and cAMP overshoot: sweating, gooseflesh, diarrhoea, pain) |

:::widget decide
{
 "scene": "Firoz, 27, in Kolkata, has used heroin for five years, always at home. After two months of abstinence in a rehabilitation centre he relapses at a friend's flat, using his old usual dose.",
 "ask": "Why is he at especially high risk of fatal overdose, and what should the service have done?",
 "choices": [
  { "label": "His tolerance has fallen during abstinence, and conditioned tolerance tied to his home is absent in a new place; services should warn about this, provide naloxone and offer opioid agonist treatment (methadone or buprenorphine) on discharge", "verdict": "best", "outcome": "On his next admission he leaves with buprenorphine and naloxone, and his family is trained to use it.", "why": "Lost tolerance plus a new setting (Siegel's conditioned tolerance) make the old dose dangerous; the weeks after release from rehabilitation or prison carry very high overdose risk." },
  { "label": "There is no special risk because he used his usual dose", "verdict": "harm", "outcome": "He is found unconscious with pinpoint pupils and slow breathing.", "why": "Tolerance is lost within weeks, and context matters." },
  { "label": "Only abstinence-based rehabilitation should be offered again", "verdict": "ok", "outcome": "He relapses again; the cycle continues.", "why": "Abstinence is a valid goal, but agonist treatment and naloxone clearly reduce deaths." }
 ]
}
:::

### Genes and protection
Addictions are about **50 per cent heritable**. Some variants **protect**: the **ALDH2** variant common in East Asian populations causes flushing and nausea after alcohol and strongly lowers the risk of alcohol use disorder; **disulfiram** mimics this by blocking the same enzyme.

### Dementia: Alzheimer's disease
- **Amyloid cascade hypothesis** (John Hardy and Gerald Higgins, 1992): the amyloid precursor protein is cut by **beta-secretase** and **gamma-secretase** (whose core is **presenilin**) into **amyloid-beta 42**, which aggregates into plaques, triggering tau pathology, inflammation, synapse loss and dementia.
- **Supporting evidence**: every known gene causing early-onset familial Alzheimer's (APP, PSEN1, PSEN2) increases amyloid-beta 42; people with **Down syndrome** (three copies of APP) develop Alzheimer's pathology by about 40; a protective APP variant (found in Iceland) reduces amyloid production.
- **Tau**: hyperphosphorylated tau forms **neurofibrillary tangles** that spread in a predictable order (Heiko Braak's stages: transentorhinal, then limbic, then neocortex), and tangle burden matches cognitive decline **better** than plaque burden.
- **Cholinergic hypothesis**: early loss of the nucleus basalis of Meynert and of choline acetyltransferase correlates with cognitive decline; cholinesterase inhibitors give modest symptomatic benefit.
- **Glutamate**: excitotoxic damage; memantine (NMDA blocker) in moderate to severe disease.
- **Genetic risk**: **APOE e4** (one copy about three times the risk, two copies roughly eight to twelve times); TREM2 variants implicate microglia.
- **Anti-amyloid antibodies**: **lecanemab** (US approval 2023) and **donanemab** (2024) remove plaques and slowed decline by roughly a quarter to a third over 18 months in early disease, at the cost of brain swelling and microbleeds (ARIA), which are commonest in APOE e4 carriers. They are expensive, need repeated MRI and infusions, and are not widely available in India; their real-world value is debated. A blood test for p-tau217 was cleared in the United States in 2025.

:::widget flow
{
 "title": "The amyloid cascade",
 "layout": "chain",
 "nodes": [
  { "id": "a", "label": "APP cut by beta- then gamma-secretase", "detail": "Presenilin is the core of gamma-secretase; APP, PSEN1 and PSEN2 mutations cause familial disease." },
  { "id": "b", "label": "Amyloid-beta 42 builds up", "detail": "It aggregates into soluble clumps (oligomers), then plaques; APOE e4 slows its clearance." },
  { "id": "t", "label": "Tau tangles spread", "detail": "Entorhinal cortex, then hippocampus and limbic areas, then neocortex (Braak stages)." },
  { "id": "i", "label": "Microglia and inflammation", "detail": "TREM2 variants alter the microglial response." },
  { "id": "s", "label": "Synapse and neuron loss", "detail": "Hippocampal and temporoparietal atrophy; cholinergic loss." },
  { "id": "d", "label": "Dementia", "detail": "Episodic memory first, then language, visuospatial and executive skills." }
 ],
 "caption": "Press Play. At which step do anti-amyloid antibodies act, and why might they help only early? (At amyloid build-up; once tau and neuron loss are widespread, removing plaques changes less.)"
}
:::

### Other dementias in brief
| Dementia | Biology | Psychiatric clue |
|---|---|---|
| **Lewy body dementia** | Alpha-synuclein Lewy bodies in cortex and brainstem; marked cholinergic loss | Fluctuating attention, well-formed visual hallucinations, parkinsonism, REM sleep behaviour disorder; **severe sensitivity to antipsychotics**; good response to rivastigmine |
| **Frontotemporal dementia** | Tau, TDP-43 or FUS pathology; C9orf72 repeat expansion (also causes ALS and often psychosis), GRN, MAPT | Disinhibition, apathy, loss of empathy, compulsions, sweet craving; often misdiagnosed as mania or depression |
| **Vascular dementia** | Infarcts and small vessel disease | Stepwise course, slowing, apathy, depression |
| **Creutzfeldt-Jakob disease** | Misfolded prion protein converts normal protein | Rapid decline over months, myoclonus, periodic EEG; variant CJD presents with depression and anxiety in young people |
| **Huntington's and Parkinson's disease dementia** | Basal ganglia and cortical degeneration | Slowing, apathy, depression, psychosis |

:::widget compare
{
 "title": "Cortical versus subcortical dementia",
 "a": {
  "label": "Cortical (Alzheimer's disease)",
  "points": ["Amnesia from failed storage: cues do not help", "Aphasia, apraxia, agnosia", "Normal speed of thinking early", "Mood often relatively preserved early", "Motor system normal until late"],
  "summary": "The four A's."
 },
 "b": {
  "label": "Subcortical (Huntington's, Parkinson's, HIV, small vessel disease)",
  "points": ["Forgetfulness from failed retrieval: cues help", "Language largely preserved", "Marked slowing of thought (bradyphrenia)", "Apathy and depression prominent", "Motor signs early"],
  "summary": "Slow, apathetic, with movement problems."
 },
 "caption": "A simplification from the 1970s and 1980s, still loved by examiners and useful at the bedside."
}
:::

:::clinician
Volkow's dopamine model of addiction: reduced D2 availability in addicted individuals correlates with orbitofrontal and cingulate hypometabolism; in non-addicted relatives of alcoholics, higher D2 availability may be protective. Koob's three-stage model maps binge-intoxication to the basal ganglia, withdrawal-negative affect to the extended amygdala, and preoccupation-anticipation to the prefrontal cortex. Siegel's 1982 study found about 64 per cent mortality when heroin was given in a novel environment versus about 32 per cent in the usual one. A 2019 national survey in India estimated current alcohol use at about 14.6 per cent of people aged 10 to 75, with opioid use about 2.1 per cent, much of it heroin and pharmaceutical opioids, and wide state variation. In Alzheimer's, amyloid PET becomes positive 15 to 20 years before symptoms; tau PET tracks symptoms and atrophy. Lecanemab reduced decline on the CDR-SB by 27 per cent at 18 months; donanemab by about 35 per cent in low-to-medium tau groups; ARIA-E occurred in roughly a quarter to a third of APOE e4 homozygotes. Aducanumab was withdrawn by its maker in 2024. In Lewy body dementia, up to about half react badly to antipsychotics (rigidity, confusion, falls, sometimes NMS-like states and death), so if needed, use very low-dose quetiapine or clozapine and favour cholinesterase inhibitors.
:::

:::recall
1. What did Di Chiara and Imperato show? || Most drugs misused by humans increase dopamine in the nucleus accumbens.
2. How do opioids and cannabis raise VTA dopamine? || By disinhibition: opioids via mu receptors and cannabis via CB1 receptors on GABA inputs to dopamine neurons.
3. Distinguish wanting and liking. || Wanting (incentive salience) is dopamine-based and sensitised by drugs; liking (pleasure) is opioid-based and does not grow.
4. What is Koob's allostatic model? || Repeated use lowers reward function and raises stress systems, shifting drug use to negative reinforcement.
5. What did Siegel show? || Conditioned tolerance: a usual heroin dose in a new environment was far more often fatal.
6. State the amyloid cascade hypothesis. || APP cleavage by beta- and gamma-secretase produces amyloid-beta 42, which aggregates and triggers tau tangles, inflammation, synapse loss and dementia.
7. Which correlates better with cognition in Alzheimer's, plaques or tangles? || Tangles.
8. Contrast cortical and subcortical dementia. || Cortical: storage amnesia, aphasia, apraxia, agnosia, normal speed. Subcortical: retrieval deficit, slowing, apathy, depression, motor signs.
:::

:::mcq
Q: Cocaine and amphetamine both increase synaptic dopamine. The key difference is that amphetamine also:
- Blocks D2 receptors
- *Reverses the dopamine transporter and releases dopamine from vesicles
- Inhibits acetylcholinesterase
- Activates mu opioid receptors
> Cocaine only blocks reuptake.

Q: Siegel's research on morphine and heroin tolerance showed that overdose deaths were more likely when a usual dose was given:
- In the usual environment
- *In a new environment
- With food
- At night
> Conditioned compensatory responses are cue-dependent.

Q: The incentive sensitisation theory holds that with repeated drug use:
- Liking increases while wanting falls
- *Wanting is sensitised while liking does not grow
- Both disappear
- Only withdrawal matters
> Robinson and Berridge.

Q: Early-onset familial Alzheimer's disease is caused by mutations in all of the following EXCEPT:
- APP
- PSEN1
- PSEN2
- *APOE
> APOE e4 is a risk gene, not a deterministic cause.

Q: A 72-year-old with fluctuating confusion, well-formed visual hallucinations of children and parkinsonism becomes rigid and confused after a small dose of haloperidol. The most likely diagnosis is:
- Alzheimer's disease
- *Dementia with Lewy bodies
- Frontotemporal dementia
- Vascular dementia
> Severe neuroleptic sensitivity is a key feature.

Q: In subcortical dementia, memory testing typically shows:
- Storage failure that cues cannot help
- *Retrieval failure that cues and recognition improve
- Normal memory with aphasia
- Loss of remote memory first
> Contrast with cortical (Alzheimer's) amnesia.
:::
`;
