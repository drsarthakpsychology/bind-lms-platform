/* Module · Brain and behaviour, Parts III and IV (Advanced level and exam zone). Original text written for VIBHA School of Psychology. */
export const a5Signalling = String.raw`
## 5.1 Inside the receiving cell: signalling in depth [core][advanced]
A medicine binds a receptor in seconds, yet most psychiatric medicines take weeks to work. The answer lies **inside** the receiving cell, in chains of reactions that end by changing which genes are switched on.

### From receptor to gene
1. A transmitter binds a **G-protein-coupled receptor**.
2. The G-protein splits and switches an enzyme on or off. **Gs** turns adenylyl cyclase on (more cyclic AMP); **Gi** turns it off; **Gq** activates phospholipase C (making IP3 and DAG, which release calcium and activate protein kinase C).
3. These **second messengers** activate protein kinases, which add phosphate groups to other proteins and change their behaviour.
4. Some kinases reach the nucleus and switch on **transcription factors** such as CREB. These change gene expression, for example raising **BDNF** (brain-derived neurotrophic factor), which helps neurons grow and form connections.

| Receptor | G-protein | Main effect | Clinical link |
|---|---|---|---|
| D1 | Gs | More cyclic AMP | Working memory in prefrontal cortex |
| D2 | Gi | Less cyclic AMP | Target of all licensed antipsychotics except xanomeline-trospium |
| 5-HT1A | Gi | Inhibits firing (autoreceptor and postsynaptic) | Buspirone; delay of SSRI effect |
| 5-HT2A | Gq | Excites cortical neurons | Psychedelics (agonists); atypical antipsychotics (antagonists) |
| Alpha-2 | Gi | Brakes noradrenaline release | Clonidine, mirtazapine |
| M1 | Gq | Excites, supports memory | Anticholinergic confusion; xanomeline target |

:::analogy Doorbell and household
The receptor is a doorbell. Ringing it once (the transmitter) sets off a chain in the house: someone walks to the door, calls others, and eventually the family rearranges the furniture. Medicines that ring the bell every day for weeks end up changing the whole layout, which is why their full effect is slow.
:::

### Receptors change with use
- **Downregulation**: with constant stimulation, cells reduce the number of receptors or uncouple them (desensitisation). This underlies **tolerance**.
- **Upregulation**: with constant blockade, cells add receptors. Long-term D2 blockade upregulates D2 receptors, one theory of **tardive dyskinesia** and of **supersensitivity psychosis** after stopping antipsychotics.


:::widget receptor
{
 "receptor": "D2",
 "caption": "Compare haloperidol (antagonist) with aripiprazole (partial agonist) at a D2 receptor. When dopamine is high, the partial agonist lowers the signal; when dopamine is low, it lifts it a little. This is why aripiprazole treats psychosis with less stiffness and less prolactin rise."
}
:::

### Autoreceptors explain the delay
Serotonin neurons carry **5-HT1A autoreceptors** on their cell bodies. When an SSRI first raises serotonin, these autoreceptors sense it and **slow the neuron's firing**, cancelling much of the gain. Over a few weeks the autoreceptors desensitise, the neurons fire normally again, and serotonin release at the far ends finally rises. Downstream changes in BDNF and connections follow.

:::widget reveal
{"prompt": "Mirtazapine blocks alpha-2 receptors on noradrenaline and serotonin terminals. Using the idea of autoreceptors and brakes, predict what that does to transmitter release.", "answer": "Alpha-2 receptors are brakes. Blocking them takes the brake off, so more noradrenaline and serotonin are released. Mirtazapine raises monoamines without touching the reuptake pump, which is why it is called a noradrenergic and specific serotonergic antidepressant (NaSSA)."}
:::


:::widget flow
{
 "title": "Why an SSRI takes time: the autoreceptor story",
 "layout": "chain",
 "nodes": [
  {
   "id": "b",
   "label": "SSRI blocks reuptake",
   "detail": "Within hours, more serotonin near the cell bodies."
  },
  {
   "id": "a",
   "label": "Autoreceptors sense it",
   "detail": "5-HT1A autoreceptors slow the neuron's firing."
  },
  {
   "id": "n",
   "label": "Little net gain at first",
   "detail": "Release at the far terminals barely rises; side effects can appear."
  },
  {
   "id": "d",
   "label": "Autoreceptors desensitise",
   "detail": "Over the following weeks the brake weakens."
  },
  {
   "id": "r",
   "label": "Release rises, plasticity follows",
   "detail": "More serotonin at terminals, BDNF and new connections; mood improves."
  }
 ],
 "caption": "Press Play. This is one reason the first weeks need encouragement and side-effect support."
}
:::

### Allosteric modulators and the NMDA receptor
- **Benzodiazepines** do not open the GABA-A channel themselves. They bind a separate site and make GABA more effective (positive allosteric modulators). That is why they are safer alone than barbiturates, which can open the channel directly at high doses.
- The **NMDA receptor** needs two things at once: glutamate binding and a depolarised cell that pushes out the magnesium plug. It is a **coincidence detector**, which makes it the key to learning (Sections 5.3 and 5.5). Ketamine and memantine block it inside the channel.
- **Neurosteroids** such as allopregnanolone are positive modulators at a different GABA-A site. Brexanolone and oral zuranolone, licensed in the United States for postpartum depression, act here.

:::widget decide
{
  "scene": "Dr Rao, a junior resident in Vizag, wants to add diazepam to a patient with severe insomnia who drinks half a bottle of whisky each night and was recently given a barbiturate-containing tablet by a local practitioner.",
  "ask": "What does receptor knowledge tell you to do?",
  "choices": [
    { "label": "Add diazepam; benzodiazepines are safe", "verdict": "harm", "outcome": "The patient is found unrousable with slow breathing after a heavy night.", "why": "Alcohol, barbiturates and benzodiazepines all enhance GABA-A at different sites. Together, the effects multiply and can stop breathing. Barbiturates can open the channel directly." },
    { "label": "Avoid adding a sedative, stop the barbiturate safely, assess alcohol use and treat withdrawal or dependence properly", "verdict": "best", "outcome": "A planned, supervised alcohol detoxification is arranged; insomnia is then treated with CBT-I.", "why": "The safest route avoids stacking GABA-A enhancers and treats the real driver of his insomnia." },
    { "label": "Switch the barbiturate to a higher dose of diazepam only", "verdict": "ok", "outcome": "Safer than a barbiturate, but nightly drinking on top remains dangerous.", "why": "Substituting reduces some risk, but without addressing alcohol the combined sedation persists." }
  ]
}
:::

:::clinician
The NMDA receptor requires glycine or D-serine as co-agonist at the GluN1 subunit; the glutamate hypofunction model of schizophrenia derives from PCP and ketamine producing positive, negative and cognitive symptoms in healthy volunteers, and from anti-NMDA receptor encephalitis. Proposed mechanisms of ketamine's rapid antidepressant effect include blocking NMDA receptors on GABA interneurons (disinhibiting pyramidal cells), a glutamate burst activating AMPA receptors, BDNF release and mTOR-dependent synaptogenesis within hours; the metabolite hydroxynorketamine and opioid-system involvement remain debated. Muscarinic agonism as an antipsychotic mechanism reached clinical use when xanomeline-trospium (an M1 and M4 preferring agonist, with a peripheral muscarinic antagonist to limit cholinergic side effects) was approved by the US FDA in September 2024 for schizophrenia, the first approved antipsychotic without direct D2 blockade. As of Nov 2026, its adjunctive trial in inadequate responders (ARISE) missed its primary endpoint (2025), and the M4 positive allosteric modulator emraclidine failed its phase 2 trials (2024). Treat it as an important proof of principle with a still-maturing evidence base, and check current availability before mentioning it to Indian patients.
:::

:::recall
1. Trace the pathway from a G-protein receptor to gene expression. || Receptor to G-protein to enzyme (adenylyl cyclase or phospholipase C) to second messenger (cAMP, IP3/DAG, calcium) to kinases to transcription factors (CREB) to genes such as BDNF.
2. Why does an SSRI take weeks to act, in autoreceptor terms? || 5-HT1A autoreceptors first slow serotonin neuron firing; they desensitise over weeks, then release rises and downstream plasticity follows.
3. Why is the NMDA receptor called a coincidence detector? || It opens only when glutamate binds and the cell is already depolarised enough to expel the magnesium block.
4. How do benzodiazepines differ from barbiturates at GABA-A? || Benzodiazepines only increase GABA's effect (allosteric); barbiturates can open the channel directly at high doses, so are more lethal.
:::

:::mcq
Q: Long-term D2 receptor blockade leading to more D2 receptors is an example of:
- Desensitisation
- *Upregulation
- Allosteric modulation
- Enzyme induction
> Chronic blockade increases receptor number, a proposed mechanism of tardive dyskinesia.

Q: Which receptor is a Gq-coupled target of psychedelic drugs?
- 5-HT1A
- 5-HT3
- *5-HT2A
- D2
> Psychedelics are 5-HT2A agonists; 5-HT2A couples to Gq.

Q: Zuranolone and brexanolone act mainly as:
- D2 antagonists
- *Positive allosteric modulators of GABA-A receptors (neurosteroids)
- NMDA antagonists
- Serotonin reuptake inhibitors
> They are neurosteroid analogues at GABA-A.
:::

`;

export const a5Circuits = String.raw`
## 5.2 Circuits of symptoms [core][advanced]
Modern psychiatry increasingly thinks in **circuits**, groups of brain areas that work together, rather than single chemicals or single regions. A symptom is what a circuit produces when it runs wrongly.


:::widget brainmap
{
 "title": "Circuits of symptoms",
 "focus": [
  "amygdala",
  "prefrontal",
  "basal-ganglia",
  "thalamus",
  "hippocampus"
 ],
 "notes": {
  "amygdala": "Fear and salience: overactive in anxiety and PTSD.",
  "prefrontal": "Orbitofrontal and anterior cingulate cortex in the OCD loop; ventromedial cortex for safety learning; medial cortex in the default mode network.",
  "basal-ganglia": "The nucleus accumbens for reward and craving; the caudate in OCD checking loops; the dorsal striatum for habits.",
  "thalamus": "Relays the cortico-striato-thalamo-cortical loop back to the cortex.",
  "hippocampus": "Context for fear memories."
 },
 "caption": "Tap each region and say which circuit, and which symptom, it belongs to."
}
:::

### Five circuits worth knowing

:::widget figure
{"id": "prefrontal", "quiz": true, "caption": "Name each numbered part in your head first, then tap to check."}
:::

| Circuit | Key parts | When it misfires |
|---|---|---|
| **Fear and safety** | Amygdala (threat), ventromedial prefrontal cortex (safety, "it's over now"), hippocampus (context) | Anxiety disorders and PTSD: a strong amygdala alarm with weak prefrontal and hippocampal braking |
| **Reward and motivation** | Ventral tegmental area, nucleus accumbens, orbitofrontal cortex | Addiction (cues hijack wanting); anhedonia in depression (little anticipation of reward) |
| **Habit and checking (CSTC loop)** | Orbitofrontal cortex, anterior cingulate, caudate, thalamus | OCD: a loop that keeps signalling "not done, check again" |
| **Default mode network** | Medial prefrontal cortex, posterior cingulate, precuneus | Rumination in depression: the self-focused "mind-wandering" network stays switched on |
| **Salience network** | Anterior insula, dorsal anterior cingulate | Psychosis: ordinary things feel loaded with meaning (aberrant salience) |

:::student
You can explain exposure therapy in brain terms to a patient: "Every time you stay with the fear and nothing bad happens, your front brain is learning a new message: this is safe. The old alarm memory stays, but the new safety memory learns to win." This is accurate, hopeful, and helps people stay in the room.
:::


:::widget brainmap
{
 "title": "The fear and safety circuit",
 "focus": [
  "amygdala",
  "prefrontal",
  "hippocampus",
  "hypothalamus"
 ],
 "notes": {
  "amygdala": "The alarm: detects threat and triggers fear responses.",
  "prefrontal": "The ventromedial prefrontal cortex stores the new safety memory learned in exposure and damps the amygdala.",
  "hippocampus": "Adds context: is this place safe or dangerous? Context explains why fear can return in a new setting.",
  "hypothalamus": "Turns the alarm into a body response through the HPA axis and the sympathetic nerves."
 },
 "caption": "In anxiety and PTSD, the alarm is strong and the braking from the prefrontal cortex and hippocampus is weak. Exposure strengthens the brake."
}
:::

### Fear extinction: new learning, not erasing
When a fear is "extinguished", the original fear memory is not deleted. A new safety memory is formed in the ventromedial prefrontal cortex and competes with it. This explains three common clinical events:
- **Spontaneous recovery**: the fear returns after time passes.
- **Renewal**: the fear returns in a new place (a phobia treated in the clinic returns at home).
- **Reinstatement**: a fresh shock or stress brings the old fear back.

:::widget figure
{"id": "amygdala-fear", "focus": ["vmpfc", "brake"]}
:::

:::widget decide
{
  "scene": "Farah, 31, from Srinagar, had a car accident and now panics in cars. After six sessions of graded exposure in the clinic car park, she can sit in a car calmly. She plans to stop therapy.",
  "ask": "Knowing how fear extinction works, what is the best plan?",
  "choices": [
    { "label": "Stop now; the fear has gone", "verdict": "ok", "outcome": "A month later she panics on a highway and believes therapy failed.", "why": "Extinction learned in one setting does not automatically transfer. Renewal in new contexts is expected." },
    { "label": "Practise in varied places, times and moods (highways, night, as a passenger and driver), and plan for a possible return of fear", "verdict": "best", "outcome": "She has a small wobble on a mountain road, uses her plan, and keeps driving.", "why": "Varying contexts and preparing for spontaneous recovery strengthen the safety memory and its reach." },
    { "label": "Add a benzodiazepine before each drive to make it easier", "verdict": "harm", "outcome": "She manages drives only with tablets, and fear returns when she stops.", "why": "Sedatives can block the learning that exposure depends on, and the safety gets credited to the pill." }
  ]
}
:::

### Addiction as learning gone wrong
Drugs raise dopamine in the nucleus accumbens far more, and more reliably, than natural rewards. With repetition:
- Cues (a lane, a friend, a time of day) learn to predict the drug and trigger craving (**incentive salience**).
- Control shifts from goal-directed choice to **habit** (from ventral to dorsal striatum).
- The prefrontal "brake" weakens, so stopping feels impossible even when the person sincerely wants to.
- Baseline reward drops, so ordinary life feels flat without the drug.

:::widget figure
{"id": "dopamine-pathways", "focus": ["mesolimbic", "accumbens"]}
:::


:::widget flow
{
 "title": "The addiction cycle",
 "layout": "cycle",
 "nodes": [
  {
   "id": "b",
   "label": "Binge or intoxication",
   "detail": "A big dopamine surge in the nucleus accumbens; strong reward learning."
  },
  {
   "id": "w",
   "label": "Withdrawal and negative mood",
   "detail": "Baseline reward falls and stress systems rise, so ordinary life feels flat or painful."
  },
  {
   "id": "p",
   "label": "Preoccupation and craving",
   "detail": "Cues trigger craving; prefrontal control weakens; habit takes over from choice."
  }
 ],
 "edgeLabels": {
  "b>w": "tolerance",
  "w>p": "relief-seeking",
  "p>b": "relapse"
 },
 "caption": "Each turn of the loop strengthens it. Treatments aim at different points: medicines for withdrawal and craving, cue exposure and coping skills for preoccupation, and building other rewards."
}
:::

:::analogy The well-worn path
A habit circuit is like a path through a field. Walk it every day for years and it becomes a road; it does not vanish when you stop walking it. Recovery is building another road and walking it until it is just as easy.
:::

:::widget sort
{
  "prompt": "Which circuit is most involved?",
  "buckets": ["Fear and safety", "Reward", "CSTC (habit and checking)", "Default mode", "Salience"],
  "items": [
    { "text": "Washing hands for an hour because it never feels 'just right'", "bucket": 2 },
    { "text": "Flashbacks and startle after a bomb blast", "bucket": 0 },
    { "text": "Craving whenever passing the liquor shop on the way home", "bucket": 1 },
    { "text": "Lying awake going over every mistake of the day, again and again", "bucket": 3 },
    { "text": "A number plate seems to carry a secret message meant only for him", "bucket": 4, "why": "Aberrant salience: an ordinary stimulus is tagged as hugely meaningful, a proposed first step to delusion." },
    { "text": "No longer looking forward to anything, even her daughter's visit", "bucket": 1, "why": "Anticipatory anhedonia reflects reduced reward-circuit activity." }
  ]
}
:::

:::clinician
Treat circuit models as heuristics with uneven evidence. Strongest: fear conditioning and extinction (translational from rodents, with human vmPFC and amygdala imaging), and dopamine prediction-error signalling (Schultz; human PET shows dopamine release to drugs and cues). CSTC hyperactivity in OCD rests on PET and fMRI with symptom provocation and on the efficacy of neurosurgical and DBS interventions targeting the loop (ventral capsule and ventral striatum), but newer models emphasise an imbalance between goal-directed and habitual control. Default mode hyperconnectivity in depression is inconsistent across large samples; the REST-meta-MDD consortium actually found reduced DMN functional connectivity in recurrent depression. Aberrant salience remains the most coherent bridge between presynaptic dopamine excess and delusion formation, and connects to predictive processing accounts where delusions are attempts to explain persistent prediction errors. Research Domain Criteria (RDoC) organises research around such systems (negative valence, positive valence, cognitive systems, social processes, arousal and regulatory, sensorimotor) rather than diagnoses; see the Frontiers module.
:::

:::recall
1. Name the brain areas in the fear and safety circuit and what each adds. || Amygdala (threat alarm), ventromedial prefrontal cortex (safety and extinction), hippocampus (context).
2. Give the three ways extinguished fear returns. || Spontaneous recovery (time), renewal (new context), reinstatement (new stress or shock).
3. What happens to control in addiction over time? || It shifts from goal-directed (ventral striatum) to habitual (dorsal striatum) with weaker prefrontal control and cue-driven craving.
4. What is aberrant salience? || Ordinary stimuli are inappropriately tagged as significant (linked to excess dopamine), a proposed route to delusions.
:::

:::mcq
Q: A spider phobia treated successfully in the clinic returns when the patient sees a spider at her in-laws' house. This is:
- Reinstatement
- *Renewal
- Spontaneous recovery
- Habituation failure only
> Return of fear in a new context is renewal.

Q: The network most associated with self-focused thought and rumination is the:
- Salience network
- *Default mode network
- Dorsal attention network
- Nigrostriatal pathway
> The default mode network is active during self-referential mind-wandering.
:::

`;

export const a5Plasticity = String.raw`
## 5.3 Plasticity, development and genes: the overview [core][advanced]
### Learning changes synapses
**Neuroplasticity** is the brain's ability to change its structure and function with experience. The best-studied form is **long-term potentiation (LTP)**: when one neuron repeatedly helps fire another, the connection between them strengthens ("cells that fire together wire together", after Donald Hebb). LTP was first shown in the hippocampus in 1973.

How it works at the synapse:
1. Repeated strong input depolarises the receiving cell.
2. The magnesium plug leaves the NMDA receptor; calcium flows in.
3. Calcium triggers kinases that insert more AMPA receptors (the synapse "listens harder").
4. With repetition, new proteins are made and the synapse grows (structural change, helped by BDNF).


:::widget flow
{
 "title": "Long-term potentiation in four steps",
 "layout": "chain",
 "nodes": [
  {
   "id": "1",
   "label": "Strong, repeated input",
   "detail": "Glutamate binds AMPA receptors; the cell depolarises."
  },
  {
   "id": "2",
   "label": "Magnesium plug leaves NMDA",
   "detail": "Only with glutamate plus depolarisation: a coincidence detector."
  },
  {
   "id": "3",
   "label": "Calcium enters",
   "detail": "Activates kinases."
  },
  {
   "id": "4",
   "label": "More AMPA receptors, then growth",
   "detail": "The synapse 'listens harder'; with repetition, new proteins and BDNF make it lasting."
  }
 ],
 "caption": "Cells that fire together wire together."
}
:::

**Long-term depression (LTD)** is the opposite: weak, poorly timed input weakens a synapse. Both are needed; a brain that only strengthened would fill up with noise.

### The brain across life
- **Before birth**: neurons are made, migrate to their places and connect. Problems here (infection, malnutrition, alcohol in pregnancy, genetic variants) raise later risk of autism, intellectual disability and schizophrenia.
- **Childhood**: an overgrowth of synapses, then **synaptic pruning** of unused ones. "Use it or lose it."
- **Adolescence**: pruning in the prefrontal cortex and myelination continue into the mid-twenties. The reward system matures earlier than prefrontal control, one reason teenagers take risks. Most serious mental illnesses begin between about 14 and 25.
- **Adulthood and old age**: plasticity continues but slows; cognitive reserve (education, bilingualism, active life) buffers decline.

:::widget guess
{
  "prompt": "Twin studies estimate how much of the variation in risk for schizophrenia in a population is due to genetic differences. What is the estimate?",
  "min": 0,
  "max": 100,
  "unit": "per cent",
  "answer": [70, 85],
  "reveal": "About 80 per cent, among the highest in psychiatry. Bipolar disorder is similar (around 60 to 85 per cent), depression much lower (around 35 to 40 per cent). But 'heritable' does not mean 'inevitable': an identical twin of a person with schizophrenia has roughly a 40 to 50 per cent chance, not 100 per cent.",
  "clinician": "Heritability is a population statistic for variance explained in a particular environment, not a statement about an individual, and it says nothing about modifiability (phenylketonuria is highly heritable and fully treatable by diet). Twin heritability for schizophrenia is about 0.79; SNP-based heritability is far lower (about 0.24), the 'missing heritability' gap."
}
:::


:::widget timeline
{
 "prompt": "Put these brain development events in order.",
 "events": [
  {
   "label": "Neurons are made and migrate",
   "when": "before birth"
  },
  {
   "label": "Rapid growth of synapses",
   "when": "infancy and early childhood"
  },
  {
   "label": "Pruning of unused synapses begins",
   "when": "childhood"
  },
  {
   "label": "Reward system matures",
   "when": "early adolescence"
  },
  {
   "label": "Prefrontal pruning and myelination finish",
   "when": "mid-twenties"
  }
 ],
 "why": "The gap between early-maturing reward systems and late-maturing control helps explain adolescent risk-taking and the age of onset of many illnesses."
}
:::

### Genes: many small effects
For almost all mental disorders, there is **no single gene**. Risk comes from thousands of common variants, each with a tiny effect, plus a few rare variants with larger effects, all interacting with environment.

| Finding | What it means |
|---|---|
| **Genome-wide association studies (GWAS)** | Scan the genome in huge samples to find variants linked with a disorder. The 2022 schizophrenia study found 287 linked regions; a 2025 study of depression across ancestries found about 700 variants |
| **Polygenic risk score** | Adds up a person's many small-effect variants. Useful in research; **not** useful for diagnosing or predicting an individual's illness in the clinic as of Nov 2026 |
| **Copy number variants (CNVs)** | Missing or extra stretches of DNA. 22q11.2 deletion carries roughly a 25 per cent lifetime risk of schizophrenia-spectrum psychosis |
| **Shared genetics** | Many variants raise risk for several disorders (schizophrenia, bipolar, depression, ADHD, autism), challenging sharp diagnostic boundaries |
| **Epigenetics** | Chemical tags (for example DNA methylation) that change gene activity without changing the DNA code. Early adversity can alter them |

:::trap "Gene for X" headlines
Be suspicious of any headline about "the gene for depression" or a single "warrior gene". Early candidate-gene findings (such as the serotonin transporter variant with life stress, and COMT with cannabis) mostly failed to replicate in large samples. Teach students to ask: how big was the sample, and has it been replicated?
:::

:::widget decide
{
  "scene": "A couple in Ahmedabad, both in their thirties, ask you: 'My brother has schizophrenia. We saw an online test that gives a genetic risk score. Should we test our unborn child?'",
  "ask": "What is the most accurate guidance?",
  "choices": [
    { "label": "Yes, the score will tell you if the child will get schizophrenia", "verdict": "harm", "outcome": "They pay for a test whose result they misread as a verdict, and are frightened for years.", "why": "Polygenic scores explain only a small share of individual risk and are not validated for prenatal prediction. They can cause harm through false certainty." },
    { "label": "Explain that risk for a child with an affected uncle is only modestly raised above the general population, that current genetic scores cannot predict an individual's illness, and offer referral to a genetic counsellor if they want more", "verdict": "best", "outcome": "They feel reassured and informed, and decide not to test.", "why": "Accurate numbers, honest limits and a route to specialist counselling respect their choice." },
    { "label": "Tell them genetics plays no role", "verdict": "harm", "outcome": "They later read otherwise and stop trusting your advice.", "why": "Schizophrenia is strongly heritable; denying it is inaccurate." }
  ]
}
:::

:::clinician
Adult hippocampal neurogenesis in humans is contested: Sorrells' group found it drops to undetectable levels in adults, while Boldrini and Moreno-Jiménez reported persistence into old age, with differences partly explained by tissue fixation methods; later single-cell studies remain mixed. So "antidepressants work by neurogenesis" is a rodent-derived hypothesis, not established human fact. The complement component C4 finding links the strongest schizophrenia GWAS signal (the MHC region) to synaptic pruning, a mechanism coherent with the adolescent onset and reduced dendritic spine density seen post-mortem. The Psychiatric Genomics Consortium schizophrenia GWAS reported 287 loci with enrichment in synaptic genes expressed in neurons, not glia. The trans-ancestry depression GWAS reported about 700 independent variants and highlighted the need for non-European samples; South Asian representation in psychiatric genetics remains small, so polygenic scores built in European samples predict even less well in Indian patients. Pharmacogenomic panels are a separate matter (Section 6.5).
:::

:::recall
1. Describe LTP in four steps. || Strong repeated input depolarises the cell; magnesium leaves the NMDA receptor and calcium enters; kinases insert more AMPA receptors; with repetition, structural growth via new proteins and BDNF.
2. Why are teenagers risk-takers in brain terms? || The reward system matures before prefrontal control, which keeps developing into the mid-twenties.
3. What is a polygenic risk score and what is its clinical status? || A sum of many small-effect variants; useful in research, not valid for individual diagnosis or prediction as of Nov 2026.
4. Name one copy number variant with high psychosis risk. || 22q11.2 deletion (about 25 per cent lifetime risk of psychosis).
:::

:::mcq
Q: Which statement about the heritability of schizophrenia is correct?
- It means 80 per cent of an individual's illness is caused by genes
- *It describes how much of the variation in risk across a population relates to genetic differences
- It proves the illness cannot be treated
- It means identical twins are always both affected
> Heritability is a population statistic; identical twins are concordant in only about 40 to 50 per cent.

Q: Long-term potentiation depends especially on which receptor acting as a coincidence detector?
- GABA-B
- *NMDA
- 5-HT3
- Nicotinic
> NMDA receptors open only with glutamate plus depolarisation, admitting calcium.
:::

`;

export const a6Imaging = String.raw`
## 6.3 Seeing and stimulating the brain [core][advanced]
### Tools to look at the brain
| Tool | What it shows | Good for in psychiatry |
|---|---|---|
| **EEG** | Electrical activity, millisecond by millisecond | Epilepsy, delirium (diffuse slowing), sleep studies, some encephalitis; not a test for "mental illness" |
| **CT** | Structure, using X-rays; quick, cheap | Bleeding, large strokes, tumours, after head injury |
| **MRI** | Structure in fine detail, no radiation | White-matter disease, small strokes, atrophy patterns in dementia, MS, encephalitis |
| **Functional MRI (fMRI)** | Changes in blood oxygen as a sign of activity | Research; not a clinical diagnostic tool in psychiatry |
| **PET and SPECT** | Metabolism, blood flow or specific molecules (for example dopamine transporters, amyloid) | Dementia subtyping, DAT scan for Lewy body dementia and Parkinson's; amyloid PET where available |

The EEG rhythms and sleep recording were covered in 4.4. Here the focus is on what each tool adds in the clinic and its limits.

:::widget decide
{
  "scene": "Meena, 58, in Coimbatore, has had a gradual change over a year: she has become apathetic, eats sweets compulsively, has made inappropriate comments to neighbours and lost interest in her grandchildren. Her MMSE score is normal. She was diagnosed with depression and has not improved on two antidepressants.",
  "ask": "What is the most useful next step?",
  "choices": [
    { "label": "Try a third antidepressant at a higher dose", "verdict": "ok", "outcome": "No change after another two months; the family's distress grows.", "why": "Not unreasonable in true depression, but the pattern points elsewhere and delays the right diagnosis." },
    { "label": "Detailed history from family, executive-function testing and an MRI looking for frontal and temporal atrophy; refer to a memory or neurology clinic", "verdict": "best", "outcome": "MRI shows frontal and anterior temporal atrophy, supporting behavioural variant frontotemporal dementia. The family gets an accurate explanation and support.", "why": "Late-onset personality change, disinhibition, apathy and dietary change with a normal MMSE suggest bvFTD. Imaging is genuinely useful here." },
    { "label": "Order an fMRI to confirm depression", "verdict": "harm", "outcome": "An expensive scan that cannot diagnose depression; the result is uninterpretable.", "why": "No functional scan is validated to diagnose depression or any primary psychiatric disorder." }
  ]
}
:::

### When should a psychiatric patient have a scan?
Most people with a typical presentation do not need one. Red flags that justify imaging include:
- First episode of psychosis or mood disorder **after about 40 to 50**, or with atypical features.
- **Neurological signs**: focal weakness, seizures, abnormal gait, new severe headache.
- **Cognitive decline** or personality change in middle or late life.
- Head injury, catatonia, or a poor response to standard treatment with atypical features.


:::widget brainmap
{
 "title": "Where brain stimulation is aimed",
 "focus": [
  "prefrontal",
  "basal-ganglia",
  "thalamus",
  "brainstem"
 ],
 "notes": {
  "prefrontal": "rTMS for depression targets the left dorsolateral prefrontal cortex; accelerated protocols use imaging to pick the spot.",
  "basal-ganglia": "Deep brain stimulation for severe OCD targets the ventral capsule and ventral striatum; for Parkinson's disease, the subthalamic nucleus.",
  "thalamus": "A DBS target in tremor.",
  "brainstem": "Vagus nerve stimulation sends signals up through the brainstem."
 },
 "caption": "Tap each target and link it to the condition treated."
}
:::

### Stimulating the brain

:::widget figure
{"id": "tms"}
:::

:::widget figure
{"id": "ect-placements"}
:::

- **Electroconvulsive therapy (ECT)**: a brief, controlled seizure under anaesthesia and muscle relaxant. The most effective acute treatment for severe depression, catatonia and some treatment-resistant states. In India, the Mental Healthcare Act 2017 bans ECT without anaesthesia and muscle relaxant (see the Ethics and law module).
- **Repetitive transcranial magnetic stimulation (rTMS)**: magnetic pulses over the scalp, usually over the left dorsolateral prefrontal cortex for depression. No anaesthesia; awake outpatient sessions. Widely offered in Indian cities.
- **Accelerated, imaging-guided TMS** (for example the Stanford "SAINT" protocol): many sessions per day over five days, targeted with MRI. Cleared in the United States in 2022 for treatment-resistant depression.
- **Deep brain stimulation (DBS)**: implanted electrodes; established in Parkinson's disease, used in specialist centres for severe treatment-resistant OCD.
- **Vagus nerve stimulation**: an implanted device; modest evidence in chronic depression.
- **Transcranial direct current stimulation (tDCS)**: weak current via scalp electrodes; cheap and portable; evidence for depression is mixed.

:::widget brainslicer
{"title":"Slice the brain, then stimulate it","start":"slice","caption":"Scroll a coronal slice until the hippocampus appears, then switch to the rTMS coil and the ECT electrodes. Which treatment reaches deep structures directly, and which works through connections?"}
:::

:::widget guess
{
  "prompt": "In a standard course of rTMS for depression, how many treatment sessions are usually given?",
  "min": 1,
  "max": 60,
  "unit": "sessions",
  "answer": [20, 36],
  "reveal": "Usually about 20 to 30 daily sessions on weekdays, each lasting from a few minutes (with newer 'theta burst' patterns) to around 40 minutes. Accelerated protocols compress this into several sessions per day.",
  "clinician": "The original FDA-cleared protocol (2008) used 10 Hz stimulation for about 37 minutes per session, five days a week for four to six weeks. Intermittent theta burst stimulation (iTBS) was non-inferior in the THREE-D trial at about 3 minutes per session. The SAINT/Stanford neuromodulation therapy protocol (ten iTBS sessions daily for five days, targeting the DLPFC subregion most anticorrelated with subgenual cingulate on fMRI) reported high remission rates in small trials; larger replication is ongoing as of Nov 2026, and cost and access limit its use in India."
}
:::

:::clinician
The strongest caution in psychiatric neuroimaging is about effect sizes and sample sizes. Marek's group showed that brain-wide associations between imaging measures and behavioural or mental health phenotypes are small and need thousands of participants to replicate; many earlier small-sample findings were inflated. Reverse inference (concluding a mental state from activation of a region, for example "amygdala lit up, so fear") is logically weak because regions serve many functions. As of Nov 2026, no imaging, EEG or blood test is approved for diagnosing a primary psychiatric disorder; quantitative EEG and "brain mapping" offered commercially for diagnosing ADHD or depression lack validation. Clinically meaningful uses are excluding organic causes, dementia subtyping (FDG-PET, amyloid and tau PET; DAT-SPECT), and EEG in delirium, epilepsy, catatonia mimics (non-convulsive status) and encephalitis. In first-episode psychosis, routine MRI yields clinically actionable findings in only a small minority, so many guidelines advise targeted rather than universal imaging.
:::

:::recall
1. Which EEG pattern suggests delirium? || Diffuse slowing, with more delta and theta activity in an awake patient.
2. Name three red flags that justify brain imaging in a psychiatric patient. || Late first onset or atypical features; neurological signs or seizures; cognitive decline or personality change in mid or late life (also head injury, catatonia, atypical non-response).
3. Where is rTMS usually applied for depression? || The left dorsolateral prefrontal cortex.
4. What can a DAT scan help diagnose? || Lewy body dementia and Parkinson's disease (reduced dopamine transporter uptake).
:::

:::mcq
Q: Which statement about functional MRI in psychiatry is correct as of Nov 2026?
- It is the standard test to diagnose depression
- *It is a research tool; no fMRI test is approved to diagnose a primary psychiatric disorder
- It is required before starting antipsychotics
- It measures serotonin levels directly
> fMRI measures blood oxygen changes; diagnostic use is not validated.

Q: Alpha rhythm is best seen:
- In deep sleep
- *In an awake, relaxed person with eyes closed, over the back of the head
- During a seizure
- In coma
> Posterior alpha with eyes closed is the normal awake resting rhythm.
:::

`;

export const a6Body = String.raw`
## 6.5 The body talks back: immunity, hormones, gut and genes in prescribing [core][advanced]
### The immune system and the brain
The brain is not sealed off from the body. Inflammation in the body sends signals into the brain through the blood, through nerves such as the vagus, and through the brain's own microglia. Everyone has felt this as "sickness behaviour" in fever: tired, withdrawn, no appetite, low mood. In a subgroup of people with depression, markers of inflammation (such as C-reactive protein, CRP) are raised.

### Autoimmune encephalitis: the diagnosis not to miss
In **anti-NMDA receptor encephalitis**, the immune system makes antibodies against the NMDA receptor. It often starts like a psychiatric illness:
- A young person, often a woman, sometimes after a flu-like illness.
- Anxiety, insomnia, strange behaviour, then psychosis or mania.
- Then: seizures, abnormal movements of the mouth and limbs, catatonia, falling consciousness, unstable pulse and blood pressure.
- In some women an ovarian **teratoma** (a tumour) triggers it.

Treatment is immunotherapy (steroids, immunoglobulin, plasma exchange) and tumour removal. Many recover well if treated early.

:::widget build
{
  "vignette": "Divya, 23, an IT employee in Pune, had a fever two weeks ago. Since then she has become fearful, sleepless and convinced colleagues are plotting against her. Over three days she has had one seizure, odd chewing movements of her mouth, periods of staring and not responding, and her pulse swings between fast and slow. She is very sensitive to a small dose of haloperidol, becoming rigid.",
  "rule": "Tick the features that should make you suspect autoimmune encephalitis rather than a primary psychotic illness. Suspicion is strong with three or more red flags.",
  "symptoms": [
    { "label": "Recent viral-like illness before onset", "present": true, "why": "A prodrome of fever or headache is common." },
    { "label": "Seizure", "present": true, "core": true, "why": "Seizures are a major red flag in new psychosis." },
    { "label": "Abnormal movements of mouth and face", "present": true, "core": true, "why": "Orofacial dyskinesias are typical." },
    { "label": "Autonomic instability (pulse and blood pressure swings)", "present": true, "why": "Common as the illness progresses." },
    { "label": "Unusual sensitivity to antipsychotics (rigidity)", "present": true, "why": "Suggests an underlying encephalopathy and raises the risk of NMS-like reactions." },
    { "label": "Paranoid ideas", "present": true, "why": "Present, but common to both; on its own it does not distinguish." },
    { "label": "Gradual decline in functioning over two years", "present": false, "why": "A long prodrome would fit schizophrenia better; here onset is rapid." }
  ],
  "need": 3,
  "needCore": true,
  "verdict": "Several red flags are present: rapid onset after a viral prodrome, a seizure, orofacial dyskinesia, autonomic instability and antipsychotic intolerance. This needs urgent neurology input, MRI, EEG, lumbar puncture with NMDA receptor antibody testing, and a search for an ovarian teratoma. Paranoia alone would not raise the question."
}
:::

### Hormones in mental health
- **Thyroid**: underactivity mimics depression; overactivity mimics anxiety or mania. Lithium can cause hypothyroidism.
- **Reproductive hormones**: the premenstrual phase (premenstrual dysphoric disorder), after childbirth (postpartum depression and psychosis) and the menopause transition are windows of raised risk for some women.
- **Cortisol**: Cushing's syndrome and long-term steroid medicines can cause depression, mania or psychosis.

### The gut-brain axis
The gut has its own nervous system, and gut microbes produce substances that affect immunity and possibly mood. Animal studies are striking; human evidence is still early. As of Nov 2026, probiotics ("psychobiotics") do not have reliable evidence as a treatment for depression or anxiety. Diet quality does relate to mood, and a Mediterranean-style diet trial gave promising but small results.

:::widget figure
{"id": "gut-brain"}
:::


:::widget journey
{
 "drug": "carbamazepine",
 "target": "voltage-gated sodium channels in neurons",
 "routes": [
  "oral"
 ],
 "notes": {
  "gut": "Absorbed slowly and somewhat erratically.",
  "liver": "Broken down by CYP3A4, and it induces this enzyme, so its own levels fall over the first weeks and many other drugs (including oral contraceptives) are weakened.",
  "blood": "Mostly protein-bound.",
  "brain": "Stabilises over-active neurons by blocking sodium channels.",
  "elimination": "Metabolites cleared by the kidneys. Before starting in at-risk Asian groups, test for HLA-B*15:02 because of the risk of severe skin reactions."
 },
 "caption": "Find the stops where interactions and genetic risk enter the story."
}
:::

### Genes and prescribing (pharmacogenomics)
Some gene variants change how a person handles a medicine:
- **CYP2D6 and CYP2C19**: "poor metabolisers" build up high levels of some antidepressants and antipsychotics; "ultra-rapid metabolisers" may get little effect. International guidance suggests dose changes for known genotypes.
- **HLA-B*15:02**: a variant common in people of East and South-East Asian descent, and present in parts of India, strongly raises the risk of a life-threatening skin reaction (Stevens-Johnson syndrome) with **carbamazepine** (and possibly oxcarbazepine and phenytoin). Testing before starting carbamazepine is recommended where feasible in at-risk populations.
- **HLA-A*31:01**: linked to carbamazepine hypersensitivity in several populations.

:::widget decide
{
  "scene": "Dr Sen in Guwahati wants to start carbamazepine for a young woman with bipolar disorder who has not tolerated lithium or valproate. HLA testing is available in a lab two days away.",
  "ask": "What is the best approach?",
  "choices": [
    { "label": "Start carbamazepine today; skin reactions are rare", "verdict": "ok", "outcome": "She is fine, but the risk was avoidable. In a carrier, the outcome could have been severe.", "why": "Reactions are rare overall, but carrier risk is high, and the population in North-East India includes groups with higher HLA-B*15:02 frequency." },
    { "label": "Send HLA-B*15:02 testing and use a safe bridging option until the result; if positive, avoid carbamazepine and related drugs", "verdict": "best", "outcome": "The test is positive. A different mood stabiliser is chosen, and the result is recorded prominently in her notes.", "why": "Testing in at-risk populations prevents a potentially fatal reaction, and the result guides lifelong prescribing." },
    { "label": "Order a full commercial pharmacogenomic panel to choose every future medicine", "verdict": "ok", "outcome": "The panel arrives with colour-coded advice that partly conflicts with her clinical history.", "why": "Broad panels for antidepressant choice have limited evidence of benefit; the targeted HLA test is the high-value step here." }
  ]
}
:::

:::clinician
Inflammation: Osimo's group estimated that about a quarter of people with depression have low-grade inflammation (CRP above 3 mg/L). Trials of anti-inflammatory add-ons (celecoxib, minocycline, infliximab in high-CRP subgroups) show inconsistent results, and none is a routine treatment as of Nov 2026; stratifying by inflammatory markers is the main research direction. Autoimmune encephalitis: the Graus criteria define possible autoimmune encephalitis by subacute onset (under three months) of working memory deficits, altered mental status or psychiatric symptoms with at least one of new focal CNS findings, unexplained seizures, CSF pleocytosis or suggestive MRI. The 2020 Pollak consensus on autoimmune psychosis lists red flags including rapid progression, catatonia, antipsychotic intolerance, seizures, dyskinesia, autonomic instability and reduced consciousness. Pharmacogenomics: CPIC guidelines give actionable CYP2D6 and CYP2C19 recommendations for SSRIs and TCAs, but RCT evidence that panel-guided antidepressant selection improves outcomes is modest. The US label for carbamazepine advises HLA-B*15:02 screening in patients with ancestry in genetically at-risk populations, which explicitly include South Asian Indians; allele frequency varies widely between Indian communities.
:::

:::recall
1. List four red flags for autoimmune encephalitis in a new psychosis. || Rapid onset after a viral prodrome, seizures, orofacial dyskinesia or catatonia, autonomic instability, reduced consciousness, antipsychotic intolerance.
2. Which tumour is linked with anti-NMDA receptor encephalitis? || Ovarian teratoma.
3. Which gene variant should be tested before carbamazepine in at-risk Asian populations and why? || HLA-B*15:02, because it greatly raises the risk of Stevens-Johnson syndrome or toxic epidermal necrolysis.
4. What is the status of probiotics for depression as of Nov 2026? || Not an evidence-based treatment; human evidence is early and inconsistent.
:::

:::mcq
Q: A 19-year-old develops psychosis over a week after a fever, then has a seizure and abnormal mouth movements. The key next step is:
- Start clozapine
- *Urgent neurological work-up including antibody testing in blood and spinal fluid
- Discharge with outpatient follow-up in a month
- Start ECT immediately
> Rapid psychosis with seizures and dyskinesia demands an autoimmune encephalitis work-up.

Q: Lithium is most likely to affect which gland?
- Adrenal
- *Thyroid
- Pineal
- Pancreas
> Lithium commonly causes hypothyroidism and goitre; check thyroid function.
:::

`;

export const examZone = String.raw`
# Part VIII · Exam zone

## 8.1 Long answers and short notes [core]
### Long answer skeletons
**1. Describe the dopamine pathways and their relevance to antipsychotic action (15 marks).**
Introduction (dopamine synthesis, D1-like and D2-like receptors) → the four pathways with origin, target and normal role → the dopamine hypothesis of schizophrenia and its revision (presynaptic excess in the associative striatum, aberrant salience) → effects of D2 blockade in each pathway (wanted effects, negative and cognitive worsening, EPS, hyperprolactinaemia) → the therapeutic window of occupancy → how atypical drugs differ (5-HT2A block, fast-off, partial agonism) → newer non-D2 approaches (muscarinic) → conclusion.

**2. Neurobiology of memory and its disorders (15 marks).**
Classification (working, explicit episodic and semantic, implicit procedural, priming, conditioning) → anatomy of each → consolidation and LTP → H.M. → amnesias (anterograde, retrograde, Ribot) → Korsakoff, transient global amnesia, dissociative amnesia, dementia → bedside and formal testing.

**3. The stress response and its role in psychiatric disorders (10 marks).**
Sympathetic-adrenal and HPA axes → feedback → acute versus chronic stress, allostatic load → findings in depression (dexamethasone non-suppression), PTSD and early adversity → links to hippocampus, immunity and sleep → clinical implications.

**4. Basic principles of pharmacokinetics with clinical examples (10 marks).**
Absorption and first pass → distribution, protein binding, blood-brain barrier → metabolism by CYP enzymes, inducers and inhibitors with psychiatric examples → excretion (lithium) → half-life, steady state, washout → therapeutic index and drug monitoring → special groups (elderly, pregnancy, liver and kidney disease, pharmacogenomics).

**5. Biological basis of schizophrenia (15 marks).**
Genetics (twin, adoption, Gottesman's risks, GWAS, CNVs) → neurodevelopmental hypothesis and its evidence → dopamine hypothesis in three versions → glutamate and GABA → other transmitters → structural and functional imaging → psychophysiology and endophenotypes → environmental risks acting on biology → an integrated circuit model → limits and conclusion.

**6. Biological theories of depression (15 marks).**
Monoamine hypothesis (origins: reserpine, iproniazid, imipramine; Schildkraut, Coppen, Prange) → evidence for and against (tryptophan depletion, delay, 2022 review) → receptor sensitivity and autoreceptors → HPA axis (DST), thyroid (TRH test), growth hormone → neurotrophic and glutamate (ketamine) → inflammation → circadian and sleep → circuits and cognitive neuropsychology → genetics → conclusion.

**7. The basal ganglia: anatomy, circuits and disorders (15 marks).**
Components → inputs and outputs → direct and indirect pathways with D1 and D2 → parallel frontal-subcortical loops → Parkinson's, Huntington's, hemiballismus, Wilson's disease, drug-induced movement disorders → OCD, Tourette syndrome and addiction as loop disorders → DBS → conclusion.

**8. The hypothalamus and the neuroendocrine axes in psychiatry (15 marks).**
Nuclei and functions → portal system and posterior pituitary → HPA, HPT, HPG axes with feedback → prolactin, growth hormone, melatonin, oxytocin and vasopressin → challenge tests (DST, TRH, clonidine GH) → endocrine disorders that mimic psychiatric illness → psychiatric medicines that disturb hormones (lithium, antipsychotics, SSRIs and SIADH) → conclusion.

**9. Sleep: physiology, regulation and its disorders (10 marks).**
EEG rhythms and stages → REM features and discovery → two-process model, flip-flop switch, reciprocal interaction → theories of dreaming and function → sleep across life → classification of sleep disorders → sleep in depression and chronotherapy.

**10. Neurobiology of addiction (10 marks).**
Mesolimbic pathway and the common dopamine pathway → mechanisms of each drug class → prediction error, incentive sensitisation, allostasis, habit, impaired control → tolerance, withdrawal and conditioned tolerance → genetics → treatment implications.

### Short notes (5 marks each)
- Synaptic transmission
- Neurotransmitter receptors: ionotropic versus metabotropic
- Extrapyramidal side effects
- Frontal lobe syndromes
- Aphasias
- Sleep architecture and changes in depression
- Long-term potentiation
- Anti-NMDA receptor encephalitis
- HLA-B*15:02 and carbamazepine
- rTMS
- Nernst and Goldman equations
- Refractory periods and saltatory conduction
- SNARE proteins and the toxins that act on them
- Endocannabinoids
- Orexin and narcolepsy
- Brown-Séquard syndrome
- Cranial nerves with parasympathetic fibres
- Papez circuit
- Klüver-Bucy syndrome
- Hypothalamic nuclei
- Brodmann areas
- Normal pressure hydrocephalus
- Dexamethasone suppression test
- TRH stimulation test
- Event-related potentials in schizophrenia
- Two-process model of sleep
- Fragile X syndrome
- Genomic imprinting
- Epigenetics and early life stress
- Kindling hypothesis
- Lithium's mechanisms of action
- Amyloid cascade hypothesis
- Cortical versus subcortical dementia

:::student
In a short note, aim for five crisp points with one example each, plus a line on clinical relevance. Draw a labelled diagram (synapse, HPA axis or dopamine pathways) whenever you can; examiners award marks quickly for a clear figure.
:::

:::clinician
For postgraduate and NET-level answers, add one or two lines of current evidence with a named landmark study (for example Kapur's D2 occupancy data, Marek's brain-wide association work, the PGC 2022 schizophrenia GWAS, xanomeline-trospium approval in 2024), and show you know its limits. Examiners reward a balanced "what we know, what we do not" paragraph more than a long list.
:::

:::recall
1. List the steps of a long answer on dopamine pathways. || Synthesis and receptors; four pathways; dopamine hypothesis and its revision; D2 blockade effects per pathway; occupancy window; atypicals; non-D2 approaches.
2. What should every short note include besides facts? || An example per point, a diagram if possible, and a line on clinical relevance.
:::

## 8.2 Viva rapid-fire [core]
:::viva
What is the resting membrane potential? :: About minus 70 millivolts, inside negative.
What is saltatory conduction? :: Jumping of the action potential between nodes of Ranvier along a myelinated axon.
Name the rate-limiting enzyme for serotonin synthesis. :: Tryptophan hydroxylase.
Where is the locus coeruleus and what does it make? :: In the pons; noradrenaline.
Which serotonin receptor is an ion channel? :: 5-HT3.
Name the four dopamine pathways. :: Mesolimbic, mesocortical, nigrostriatal, tuberoinfundibular.
What D2 occupancy gives antipsychotic effect without EPS? :: About 65 to 78 per cent.
What is Gerstmann syndrome? :: Agraphia, acalculia, finger agnosia and left-right disorientation from a dominant parietal lesion.
Which aphasias spare repetition? :: Transcortical motor and transcortical sensory.
What is Klüver-Bucy syndrome? :: Placidity, hyperorality, hypersexuality and visual agnosia after bilateral amygdala damage.
What is Ribot's law? :: Recent memories are lost before remote ones in retrograde amnesia.
Which vitamin deficiency causes Korsakoff syndrome? :: Thiamine.
What is the master clock of the body? :: The suprachiasmatic nucleus of the hypothalamus.
What happens to REM latency in depression? :: It shortens.
How many half-lives to steady state? :: About four to five.
Name a CYP1A2 inducer relevant to psychiatry. :: Tobacco smoke.
Which drug raises lamotrigine levels? :: Valproate.
What is a partial agonist? :: A drug that partly activates a receptor, acting as a brake or a booster depending on transmitter levels.
What test should precede carbamazepine in at-risk Asian patients? :: HLA-B*15:02.
What is the first antipsychotic approved without direct D2 blockade? :: Xanomeline-trospium, a muscarinic agonist, US approval 2024.
What EEG finding suggests delirium? :: Diffuse slowing.
What is a DAT scan used for? :: Showing loss of dopamine transporters in Parkinson's disease and Lewy body dementia.
What does the sodium-potassium pump move per ATP? :: Three sodium out and two potassium in.
What is the approximate potassium equilibrium potential? :: About minus 90 millivolts.
What causes the absolute refractory period? :: Inactivation of voltage-gated sodium channels.
What is the calcium sensor for vesicle fusion? :: Synaptotagmin.
What does botulinum toxin cleave? :: SNARE proteins, blocking acetylcholine release.
What does strychnine block? :: Glycine receptors.
Which enzyme makes GABA? :: Glutamic acid decarboxylase, which needs vitamin B6.
What is the main breakdown product of serotonin? :: 5-HIAA.
Where is histamine made in the brain? :: The tuberomammillary nucleus.
Where are orexin neurons? :: The lateral hypothalamus.
What is anandamide? :: An endocannabinoid that acts retrogradely on CB1 receptors.
What does the Bell-Magendie law state? :: Dorsal roots are sensory, ventral roots motor.
Which cranial nerve exits the back of the brainstem? :: The trochlear (IV).
Which cranial nerves carry parasympathetic fibres? :: III, VII, IX and X.
What is the only output of the cerebellar cortex? :: Purkinje cells, which are GABAergic.
What lesion causes hemiballismus? :: The contralateral subthalamic nucleus.
Name the stations of Papez's circuit. :: Hippocampus, fornix, mammillary bodies, anterior thalamus, cingulate gyrus, parahippocampal cortex.
Who coined the term limbic system? :: Paul MacLean, 1952.
Which Brodmann area is primary visual cortex? :: Area 17.
Which Brodmann area is primary auditory cortex? :: Areas 41 and 42.
What is the triad of normal pressure hydrocephalus? :: Gait disturbance, urinary incontinence and dementia.
What is the DST cut-off for non-suppression? :: Cortisol above about 5 micrograms per decilitre.
What share of euthyroid depressed patients show a blunted TSH response to TRH? :: About a quarter.
What did Moruzzi and Magoun discover? :: The ascending reticular activating system.
Who discovered REM sleep? :: Aserinsky and Kleitman, 1953.
What is Process S? :: Homeostatic sleep pressure, linked to adenosine.
Which ERP is enlarged in OCD? :: The error-related negativity.
What is Gottesman's risk for the MZ co-twin of a person with schizophrenia? :: About 48 per cent.
What is the commonest inherited cause of intellectual disability? :: Fragile X syndrome.
Which syndrome follows loss of the paternal 15q11 to 13 region? :: Prader-Willi syndrome.
What did Bliss and Lømo discover? :: Long-term potentiation, in 1973.
What did Kandel study in Aplysia? :: Habituation and sensitisation of the gill-withdrawal reflex.
Who proposed the kindling hypothesis of mood disorders? :: Robert Post.
Who introduced lithium for mania? :: John Cade, in 1949.
What did Di Chiara and Imperato show? :: Most drugs of abuse raise dopamine in the nucleus accumbens.
What did Siegel show about tolerance? :: It is partly conditioned to the environment.
What correlates best with cognition in Alzheimer's disease? :: Neurofibrillary tangle burden.
:::

## 8.3 Module test [core]
Score 80% or more to complete the module.

:::mcq
Q: The parasympathetic system is responsible for:
- Pupil dilation in fear
- *Slowing the heart and promoting digestion
- Releasing cortisol
- Voluntary movement
> Rest and digest.

Q: Which ion rushes into the neuron during the rising phase of the action potential?
- Potassium
- *Sodium
- Chloride
- Magnesium
> Voltage-gated sodium channels open.

Q: Microglia are best described as:
- Myelin-making cells
- *The brain's immune cells that also prune synapses
- Cells forming the blood-brain barrier alone
- Neurons in the cerebellum
> Microglia defend and prune.

Q: Which step triggers vesicles to release their transmitter?
- Potassium leaving the cell
- *Calcium entering the axon terminal
- Myelin breaking down
- Receptors upregulating
> Calcium influx triggers vesicle fusion.

Q: Noradrenaline is synthesised from:
- Serotonin
- Tryptophan
- *Dopamine
- Acetylcholine
> Tyrosine to L-DOPA to dopamine to noradrenaline.

Q: Ondansetron reduces nausea by blocking:
- D2 receptors
- *5-HT3 receptors
- H1 receptors
- M1 receptors
> The ion-channel serotonin receptor.

Q: A man on olanzapine gains 12 kg in six months. The receptors most responsible are:
- D2 and alpha-1
- *H1 and 5-HT2C
- 5-HT3 and nicotinic
- GABA-A and NMDA
> Histamine H1 and 5-HT2C blockade drive appetite and weight gain.

Q: Tardive dyskinesia typically appears:
- Within hours of the first dose
- *After months to years of treatment
- Only after stopping treatment for a day
- Only in children
> It is a late, sometimes permanent side effect.

Q: Raised prolactin from risperidone is explained by D2 blockade in the:
- Mesolimbic pathway
- Mesocortical pathway
- Nigrostriatal pathway
- *Tuberoinfundibular pathway
> Dopamine normally inhibits prolactin release from the pituitary.

Q: A patient can speak fluently and understands well but cannot repeat sentences. The lesion is most likely in the:
- Broca's area
- Wernicke's area
- *Arcuate fasciculus
- Occipital lobe
> Conduction aphasia.

Q: A retired teacher becomes apathetic, speaks little and sits for hours without starting any activity. The most likely frontal area affected is the:
- Orbitofrontal cortex
- *Medial frontal cortex and anterior cingulate
- Occipital cortex
- Primary motor cortex
> The medial frontal (apathetic) syndrome.

Q: Henry Molaison could still learn mirror tracing because:
- His hippocampus was intact
- *Procedural memory depends on the basal ganglia and cerebellum, not the hippocampus
- He was faking amnesia
- Working memory stores skills
> Implicit and explicit memory are separate systems.

Q: Confabulation is characteristic of:
- Broca's aphasia
- *Korsakoff syndrome
- Transient global amnesia
- Generalised anxiety disorder
> Gaps are filled with believed false stories.

Q: Which hormone signals "night" to the body?
- Cortisol
- *Melatonin
- Thyroxine
- Oxytocin
> Melatonin from the pineal gland.

Q: Sleepwalking arises mostly from:
- REM sleep
- Stage N1
- *Stage N3 (slow-wave sleep)
- Wakefulness
> Arousal disorders come from deep NREM sleep.

Q: Carbamazepine lowers the level of many other medicines because it:
- Inhibits CYP enzymes
- *Induces CYP enzymes, including its own metabolism
- Blocks their absorption
- Binds them in the blood
> A strong enzyme inducer.

Q: A medicine with a half-life of 24 hours, given daily, reaches steady state in about:
- 1 day
- *4 to 5 days
- 2 weeks
- 6 weeks
> Four to five half-lives.

Q: Which medicine has the narrowest therapeutic index?
- Sertraline
- *Lithium
- Fluoxetine
- Escitalopram
> Small rises in lithium level cause toxicity.

Q: The delay in SSRI benefit is best explained at first by:
- Slow absorption from the gut
- *5-HT1A autoreceptors initially reducing serotonin neuron firing until they desensitise
- The SSRI not reaching the brain for weeks
- Liver enzymes destroying the SSRI
> Autoreceptor desensitisation, then downstream plasticity.

Q: A fear that was extinguished in therapy returns after a frightening new life event. This is:
- Renewal
- *Reinstatement
- Habituation
- Sensitisation only
> A new stressor reinstates the old fear.

Q: In addiction, control over drug-taking shifts over time from:
- Dorsal to ventral striatum
- *Ventral (goal-directed) to dorsal (habit) striatum
- Cerebellum to occipital cortex
- Brainstem to hippocampus
> Habit takes over from goal-directed control.

Q: Which is TRUE about polygenic risk scores as of Nov 2026?
- They can diagnose schizophrenia in an individual
- *They are research tools with little power to predict an individual's illness
- They are recommended before all pregnancies
- They work equally well in all ancestries
> They explain a small share of variance and transfer poorly across ancestries.

Q: A 22q11.2 deletion is important in psychiatry because it:
- Causes Down syndrome
- *Carries a high lifetime risk of psychosis
- Protects against depression
- Causes Huntington's disease
> About a quarter of carriers develop psychotic illness.

Q: Which scan best supports a diagnosis of Lewy body dementia?
- Plain CT
- *Dopamine transporter (DAT) SPECT
- fMRI during a memory task
- EEG alone
> Reduced striatal DAT uptake supports DLB.

Q: rTMS for depression is usually applied over the:
- Occipital cortex
- *Left dorsolateral prefrontal cortex
- Cerebellum
- Brainstem
> The standard target.

Q: A young woman with new psychosis, seizures and orofacial dyskinesia should be tested for:
- Thyroid antibodies only
- *Anti-NMDA receptor antibodies
- HLA-B*15:02
- Vitamin D only
> Anti-NMDA receptor encephalitis.

Q: HLA-B*15:02 testing is recommended before starting which medicine in at-risk Asian patients?
- Lithium
- Valproate
- *Carbamazepine
- Sertraline
> It predicts Stevens-Johnson syndrome with carbamazepine.

Q: Xanomeline-trospium is notable because it:
- Is a long-acting injectable haloperidol
- *Treats schizophrenia through muscarinic receptors without direct D2 blockade
- Is an NMDA antagonist for depression
- Is a GABA-A modulator for postpartum depression
> Approved in the US in 2024, a new mechanism.
Q: Vasopressin (ADH) is released from the:
- Anterior pituitary
- *Posterior pituitary
- Adrenal medulla
- Pineal gland
> Made in the hypothalamus and released from the posterior pituitary.

Q: Ghrelin is best described as a:
- Fullness hormone from fat
- *Hunger hormone from the stomach
- Thyroid hormone
- Sex hormone
> It rises before meals.

Q: A split-brain patient's left hemisphere invents a reason for an action started by the right hemisphere. This illustrates:
- The Wada test
- *The left-hemisphere interpreter
- Dichotic listening
- Anosognosia from parietal stroke
> Gazzaniga's interpreter.

Q: In twin studies, the influence that makes siblings different from each other is called:
- Additive genetics
- Shared environment
- *Unique (non-shared) environment
- Assortative mating
> E in the ACE model.

Q: Children of mothers with schizophrenia adopted at birth into healthy families still showed raised risk. This came from:
- Twin studies
- *Adoption studies
- Family studies alone
- Linkage studies
> Heston's adoption study.

Q: The resting potential is closest to the equilibrium potential of:
- Sodium
- *Potassium
- Calcium
- Chloride
> Potassium leak channels dominate at rest.

Q: Tetrodotoxin abolishes action potentials but barely changes the resting potential because it:
- Blocks potassium leak channels
- *Blocks voltage-gated sodium channels
- Stops the sodium-potassium pump
- Opens chloride channels
> Rest depends on potassium.

Q: Lambert-Eaton syndrome is caused by antibodies against:
- Postsynaptic nicotinic receptors
- *Presynaptic voltage-gated calcium channels
- NMDA receptors
- Acetylcholinesterase
> Often with small-cell lung cancer.

Q: The rate-limiting enzyme in the synthesis of dopamine and noradrenaline is:
- DOPA decarboxylase
- Dopamine beta-hydroxylase
- *Tyrosine hydroxylase
- MAO-B
> Tyrosine to L-DOPA.

Q: Which receptor is a G-protein receptor coupled to Gi?
- 5-HT3
- NMDA
- *D2
- Nicotinic
> D2, 5-HT1A, alpha-2, M2 and M4 are Gi-coupled.

Q: A stab wound hemisects the right side of the thoracic cord. Below the lesion there will be:
- Left weakness and right pain loss
- *Right weakness and loss of vibration, with left loss of pain and temperature
- Bilateral weakness only
- No sensory loss
> Brown-Séquard syndrome.

Q: Bilateral sixth nerve palsy, ataxia and confusion in a malnourished drinker suggest:
- Korsakoff syndrome only
- *Wernicke's encephalopathy
- Cerebellar stroke
- Myasthenia gravis
> Give parenteral thiamine.

Q: In Huntington's disease, chorea arises mainly because of early loss of:
- Dopamine neurons in the substantia nigra
- *Indirect-pathway striatal neurons
- Purkinje cells
- Cholinergic basal forebrain neurons
> The brake is weakened.

Q: The hypothalamic nucleus that acts as the master circadian clock is the:
- Arcuate nucleus
- Paraventricular nucleus
- *Suprachiasmatic nucleus
- Ventromedial nucleus
> Set by light through melanopsin cells.

Q: Alexia without agraphia follows a stroke in the territory of the:
- Right middle cerebral artery
- *Left posterior cerebral artery
- Anterior cerebral artery
- Basilar artery only
> Left occipital cortex plus the splenium.

Q: Cortisol is produced mainly by the:
- Zona glomerulosa
- *Zona fasciculata
- Zona reticularis
- Adrenal medulla
> "Salt, sugar, sex".

Q: Prolactin taken soon after an event may help distinguish:
- Delirium from dementia
- *Epileptic seizures from functional (dissociative) seizures
- Mania from schizophrenia
- Depression from anxiety
> Prolactin rises for about an hour after a generalised seizure.

Q: In chronic PTSD, the HPA axis typically shows:
- High cortisol with non-suppression
- *Normal or low cortisol with enhanced negative feedback
- Absent ACTH
- Raised thyroid hormone
> Yehuda's findings.

Q: Shortened REM latency is:
- Specific to depression
- *Found in depression but also in narcolepsy, schizophrenia and other conditions
- Never found in depression
- Caused only by antidepressants
> Sensitive but not specific.

Q: The protein whose variation explains part of the MHC-region signal for schizophrenia and which tags synapses for pruning is:
- BDNF
- *Complement component 4
- APOE
- FMR1
> Microglia remove tagged synapses.

Q: Meaney's work showed that high maternal licking and grooming produces offspring with:
- More methylation of the glucocorticoid receptor gene and larger stress responses
- *Less methylation of the glucocorticoid receptor gene and smaller stress responses
- No epigenetic change
- Changes only in the liver
> Cross-fostering showed the effect was due to mothering.

Q: Antidepressant-like effects of fluoxetine in mice were abolished when researchers blocked:
- Dopamine release
- *Hippocampal neurogenesis
- Melatonin synthesis
- Thyroid hormone
> Santarelli and colleagues, 2003; human relevance is debated.

Q: Volkow's raclopride PET studies of people addicted to cocaine and alcohol showed:
- Increased striatal D2 availability
- *Reduced striatal D2 receptor availability
- Absent dopamine transporters
- Increased serotonin release
> Linked with reduced orbitofrontal activity.

Q: The amyloid precursor protein gene is on chromosome 21, which explains early Alzheimer's pathology in:
- Fragile X syndrome
- *Down syndrome
- Turner syndrome
- Williams syndrome
> Three copies of APP.

Q: A patient with dementia with Lewy bodies should usually avoid:
- Rivastigmine
- *Typical antipsychotics such as haloperidol
- Sleep hygiene
- Physiotherapy
> Severe neuroleptic sensitivity.

Q: Interferon-alpha treatment causes depression in a substantial minority of patients, which supports:
- The monoamine hypothesis only
- *An inflammatory contribution to depression
- The dopamine hypothesis of schizophrenia
- The kindling hypothesis
> SSRI pretreatment reduces the risk.
:::
`;
