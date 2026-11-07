import { qa } from "./psychosis-qa";
/* Module · Schizophrenia spectrum and catatonia, Parts IV and V (Advanced; exam zone). Original text written for VIBHA School of Psychology. */
export const part3 = String.raw`
# Part IV · Advanced: mechanisms, new medicines and the global picture

## 4.1 Dopamine and glutamate in depth [core][advanced]
### Four dopamine pathways
| Pathway | From and to | Relevance |
|---|---|---|
| Mesolimbic | Ventral tegmental area to ventral striatum | Classic site linked to positive symptoms and reward |
| Mesocortical | Ventral tegmental area to prefrontal cortex | Reduced dopamine linked to negative and cognitive symptoms |
| Nigrostriatal | Substantia nigra to dorsal striatum | D2 blockade here causes extrapyramidal side effects |
| Tuberoinfundibular | Hypothalamus to pituitary | D2 blockade raises prolactin |

### What imaging actually shows
- The strongest, most replicated finding is **increased presynaptic dopamine synthesis and release capacity**, especially in the **associative (dorsal) striatum**, rather than more D2 receptors. It is present in people at clinical high risk who go on to develop psychosis and rises as psychosis emerges, a line of work led by Oliver Howes.
- **Aberrant salience** (Kapur): dysregulated dopamine assigns importance to irrelevant events and perceptions; delusions are the person's attempt to explain this strange sense of significance. Antipsychotics dampen salience, so beliefs lose urgency before they fade.
- A subgroup of people with treatment-resistant schizophrenia appear to have **normal** striatal dopamine synthesis, which may explain why D2 blockers fail them while clozapine, with a broader action, can still work.

### The glutamate hypothesis
- NMDA receptor antagonists (ketamine, PCP) produce positive, negative and cognitive symptoms in healthy people, and worsen symptoms in schizophrenia.
- A leading model: **NMDA receptor hypofunction on fast-spiking parvalbumin GABA interneurons** reduces inhibition of pyramidal cells. This disinhibition disrupts cortical gamma oscillations (linked to working memory) and drives excess glutamate output, which in turn dysregulates midbrain dopamine neurons.
- Drugs targeting glutamate directly (glycine transporter inhibitors such as bitopertin, mGluR2/3 agonists) have **not** succeeded in Phase 3 trials so far.

:::widget sort
{"prompt": "Which pathway or mechanism explains each finding?", "buckets": ["Mesolimbic or associative striatum", "Mesocortical", "Nigrostriatal", "Tuberoinfundibular", "NMDA hypofunction"], "items": [{"text": "Galactorrhoea and missed periods on risperidone", "bucket": 3}, {"text": "Raised dopamine synthesis capacity in people at high risk who later develop psychosis", "bucket": 0}, {"text": "Rigidity and tremor on haloperidol", "bucket": 2}, {"text": "Ketamine producing psychosis-like symptoms in volunteers", "bucket": 4}, {"text": "Apathy and poor working memory", "bucket": 1}]}
:::

:::widget brainmap
{"title": "The dopamine pathways", "focus": ["brainstem", "basal-ganglia", "prefrontal", "hypothalamus"], "notes": {"brainstem": "Ventral tegmental area and substantia nigra: dopamine cell bodies.", "basal-ganglia": "Striatum: mesolimbic (ventral) and nigrostriatal (dorsal) targets; raised presynaptic dopamine in the associative striatum in psychosis; D2 blockade here causes EPS.", "prefrontal": "Mesocortical target: reduced dopamine linked to negative and cognitive symptoms.", "hypothalamus": "Tuberoinfundibular pathway: dopamine inhibits prolactin; blockade raises it."}}
:::

:::widget flow
{"title": "The glutamate-dopamine chain", "layout": "chain", "nodes": [{"id": "nmda", "label": "NMDA receptor hypofunction", "detail": "On parvalbumin GABA interneurons."}, {"id": "disinhib", "label": "Less inhibition", "detail": "Pyramidal neurons are disinhibited."}, {"id": "gamma", "label": "Disrupted gamma rhythms", "detail": "Working memory and cognition suffer."}, {"id": "glu", "label": "Excess glutamate output", "detail": "Downstream circuits are over-driven."}, {"id": "da", "label": "Dopamine dysregulation", "detail": "Midbrain dopamine neurons fire abnormally."}, {"id": "sal", "label": "Aberrant salience", "detail": "Irrelevant events feel significant; delusions explain them."}]}
:::

:::widget pathways
{"system": "dopamine", "caption": "The four pathways with dopamine flowing. Toggle D2 blockade and then 5-HT2A blockade, and match each change to a symptom or side effect."}
:::

:::widget neuron
{"title": "Interneurons and the brakes on cortex", "myelinated": true, "caption": "Fast-spiking parvalbumin interneurons release GABA to keep pyramidal neurons below threshold and in rhythm. If their NMDA receptors under-function, the brake weakens, pyramidal neurons fire too readily, gamma rhythms break down and downstream dopamine neurons become dysregulated."}
:::

:::recall
1. Which dopamine finding in schizophrenia is most replicated? || Increased presynaptic dopamine synthesis and release capacity in the associative striatum.
2. What is aberrant salience? || Dysregulated dopamine assigning importance to irrelevant stimuli; delusions explain the resulting sense of significance.
3. Outline the interneuron model of glutamate dysfunction. || NMDA hypofunction on parvalbumin interneurons, reduced inhibition, disrupted gamma oscillations, excess glutamate, downstream dopamine dysregulation.
:::

:::mcq
Q: Why might some people with treatment-resistant schizophrenia not respond to D2 antagonists?
- They metabolise drugs too slowly
- *Their striatal dopamine synthesis may be normal, implying a non-dopaminergic mechanism
- They have too many D2 receptors
- They are non-adherent by definition
> A proposed subgroup with "normodopaminergic" illness.
:::

## 4.2 Antipsychotic pharmacology and the first non-dopamine drug [core][advanced]
### The D2 occupancy window
PET studies show that antipsychotic response becomes likely at around **65%** striatal D2 occupancy; prolactin rises above about **72%**; extrapyramidal side effects become likely above about **78%**. This narrow window explains why "more" is not "better", and why low doses work in first episodes.

:::widget guess
{"prompt": "PET studies suggest antipsychotic response becomes likely at roughly what percentage of striatal D2 receptors occupied?", "min": 0, "max": 100, "unit": "%", "answer": [60, 70], "reveal": "About 65%. Above roughly 78%, stiffness and tremor become likely. The useful range is narrow.", "clinician": "Shitij Kapur's PET work found response at about 65% occupancy, hyperprolactinaemia above about 72%, and EPS above about 78%."}
:::

### Receptor profiles that explain side effects
| Receptor | Blockade causes | High in |
|---|---|---|
| D2 (striatal) | EPS | Haloperidol, high-dose risperidone |
| D2 (pituitary) | Raised prolactin | Risperidone, paliperidone, amisulpride |
| H1 | Sedation, weight gain | Olanzapine, clozapine, quetiapine |
| M1 | Dry mouth, constipation, blurred vision, confusion | Clozapine, olanzapine |
| Alpha-1 | Postural hypotension, dizziness | Clozapine, quetiapine, risperidone |
| 5-HT2C | Weight gain | Olanzapine, clozapine |
| 5-HT2A | (Antagonism) less EPS, may help negative symptoms | Most second-generation drugs |

- **Partial agonists** (aripiprazole, brexpiprazole, cariprazine) stabilise dopamine signalling: they act as antagonists where dopamine is high and agonists where it is low. Low prolactin and metabolic risk; akathisia is common. Cariprazine favours D3 receptors and has evidence for predominant negative symptoms.
- **Pimavanserin** (5-HT2A inverse agonist, no D2 action) is approved in the US for psychosis in Parkinson's disease.

### The first non-dopamine antipsychotic: xanomeline-trospium
- **Xanomeline** stimulates **M1 and M4 muscarinic receptors** in the brain. M4 activation on striatal and midbrain circuits reduces dopamine release indirectly; M1 may help cognition.
- **Trospium**, a peripheral muscarinic antagonist that does not enter the brain, blocks xanomeline's gut and bladder side effects.
- Approved by the US FDA in **September 2024** for schizophrenia in adults (brand Cobenfy): the first new mechanism in decades. Side effects are mainly nausea, vomiting, constipation, indigestion and urinary retention; little weight gain, sedation or EPS, and no prolactin rise.
- An adjunctive trial (ARISE, added to other antipsychotics) **did not meet its primary endpoint** in April 2025.

:::widget flow
{"title": "How xanomeline-trospium calms psychosis without blocking D2", "layout": "chain", "nodes": [{"id": "x", "label": "Xanomeline enters the brain", "detail": "It stimulates M1 and M4 muscarinic receptors."}, {"id": "m4", "label": "M4 activation", "detail": "On striatal and midbrain circuits, M4 turns down dopamine release indirectly."}, {"id": "da", "label": "Less striatal dopamine", "detail": "The hyperdopaminergic signal behind positive symptoms is reduced, without a D2 blocker."}, {"id": "t", "label": "Trospium stays in the body", "detail": "It blocks muscarinic receptors in gut and bladder but cannot cross the blood-brain barrier."}, {"id": "se", "label": "Fewer gut side effects", "detail": "Nausea and vomiting are reduced, though constipation and urinary retention can occur. Little weight gain, EPS or prolactin rise."}], "caption": "Two drugs in one capsule: one acts in the brain, the other guards the body."}
:::

### What failed
| Drug | Mechanism | Outcome |
|---|---|---|
| Ulotaront | TAAR1 agonist | Phase 3 trials failed (2023) |
| Emraclidine | M4 positive allosteric modulator | Phase 2 trials failed (November 2024) |
| Bitopertin | Glycine transporter inhibitor | Phase 3 failed |

:::clinician
### Choosing an antipsychotic
- **First episode**: low-dose second-generation drug (for example aripiprazole, risperidone, or amisulpride where available), chosen with the person according to side-effect priorities (weight, prolactin, sedation, sexual function).
- **Metabolic risk high**: aripiprazole, lurasidone, cariprazine, ziprasidone; avoid olanzapine and clozapine where possible; consider metformin for antipsychotic weight gain.
- **Prolactin-related problems**: switch to or add aripiprazole.
- **Akathisia**: reduce dose, propranolol, consider mirtazapine (low dose).
- **Tardive dyskinesia**: review the need for the antipsychotic, switch to clozapine or quetiapine, VMAT2 inhibitors (valbenazine, deutetrabenazine) where available.
- **Pregnancy**: avoid sudden stopping; weigh relapse risk; prefer drugs with more safety data and monitor for gestational diabetes.
:::

:::widget curve
{"kind": "dose-response", "title": "Full antagonist, partial agonist and the D2 window", "caption": "Compare a full antagonist with a partial agonist such as aripiprazole: the partial agonist cannot drive the receptor to zero activity, which lowers EPS and prolactin. Response becomes likely around 65% D2 occupancy; EPS above about 78%."}
:::

:::widget receptor
{"receptor": "D2", "title": "Antagonist, partial agonist and inverse agonist at D2", "caption": "Haloperidol is a full antagonist; aripiprazole, brexpiprazole and cariprazine are partial agonists; pimavanserin acts as an inverse agonist at 5-HT2A instead. Compare the signal each produces."}
:::

:::recall
1. Give the D2 occupancy thresholds for response, prolactin rise and EPS. || About 65%, 72% and 78%.
2. Which receptor blockades cause weight gain? || H1 and 5-HT2C.
3. How does xanomeline-trospium work? || Xanomeline stimulates brain M1 and M4 receptors (indirectly lowering dopamine); trospium blocks peripheral muscarinic side effects.
4. Name a failed TAAR1 agonist. || Ulotaront.
:::

:::mcq
Q: Which statement about xanomeline-trospium is correct as of late 2026?
- It blocks D2 receptors strongly
- *It was approved in the US in 2024 as the first antipsychotic without direct D2 blockade; an adjunctive trial failed in 2025
- It causes marked weight gain
- It is a TAAR1 agonist
> A new muscarinic mechanism.
:::

## 4.3 Genes, development and immunity [core][advanced]
### What the genetics now shows
- The largest genome-wide study (2022) identified **287 loci**, concentrated in genes expressed in neurons and involved in **synaptic function**. Common variants together explain only a modest share of risk in any one person.
- Exome sequencing (SCHEMA) found ultra-rare damaging variants in about **10 genes** that each sharply raise risk, several involved in glutamate signalling (for example GRIN2A).
- **Copy number variants**: 22q11.2 deletion, 1q21.1, 15q13.3, 16p11.2 duplication and others raise risk and often also raise risk of autism, intellectual disability and epilepsy: genetic risk is shared across neurodevelopmental conditions.
- **Polygenic risk scores** are useful in research but **do not diagnose or predict** illness well enough for clinical use.

### The complement story
Variation in the **complement component 4 (C4)** gene affects how much C4A protein is made. Higher C4A expression is associated with schizophrenia and, in animal work, with more microglial **synaptic pruning**. This links immunity, adolescent pruning and the timing of onset.

:::widget flow
{"title": "From a gene to fewer synapses", "layout": "chain", "nodes": [{"id": "g", "label": "C4 gene variants", "detail": "Some structural forms of the gene produce more C4A protein."}, {"id": "c", "label": "More C4A", "detail": "C4A is part of the complement system, which tags things for removal."}, {"id": "t", "label": "Synapses tagged", "detail": "Complement marks synapses during development."}, {"id": "m", "label": "Microglia prune", "detail": "The brain's immune cells remove tagged synapses; in animal work, more C4A means more pruning."}, {"id": "o", "label": "Thinner cortical connections", "detail": "Excess pruning in adolescence fits the typical age at onset and the reduced synapse density seen in schizophrenia."}], "caption": "An attractive link between genes, immunity and timing. The effect of any single variant on risk is small."}
:::

### Immunity and infection
- Maternal infection in pregnancy and childhood CNS infection modestly raise risk.
- A subgroup shows raised inflammatory markers (for example CRP, IL-6).
- **Autoimmune encephalitis** (anti-NMDA receptor) can present as psychosis and must be excluded.

### Brain structure
On average: enlarged ventricles, reduced grey matter (prefrontal and temporal), smaller hippocampi. Some grey matter loss over time is associated with antipsychotic exposure as well as illness. None is diagnostic in an individual.

:::widget reveal
{"prompt": "If schizophrenia is about 80% heritable, why can't a genetic test diagnose it?", "answer": "Heritability describes how much variation in a population is due to genes, not how predictable it is for one person. Risk is spread across thousands of common variants, each tiny, plus rare variants in a minority. Polygenic scores shift probability only a little, many people with high scores never become ill, and environment and chance matter. So genetics informs mechanism and research, not individual diagnosis."}
:::

:::recall
1. How many loci did the 2022 schizophrenia GWAS identify? || 287.
2. What did the C4 studies suggest? || Higher C4A expression associates with schizophrenia and more synaptic pruning.
3. Why are polygenic risk scores not clinically useful yet? || They shift individual risk only slightly and cannot diagnose or predict reliably.
:::

:::mcq
Q: The 22q11.2 deletion is best described as:
- A common variant with tiny effect
- *A rare copy number variant carrying a high risk of psychosis and other neurodevelopmental conditions
- A diagnostic test for schizophrenia
- Protective against psychosis
> About a quarter develop psychosis.
:::

## 4.4 New frameworks: ICD-11, HiTOP, RDoC and the continuum [core][advanced]
### ICD-11 says
- No subtypes of schizophrenia; instead six **symptom specifiers** rated not present, mild, moderate or severe: positive, negative, depressive mood, manic mood, psychomotor and cognitive symptoms.
- Schizophrenia needs symptoms for **at least 1 month** (no 6-month rule).
- **Acute and transient psychotic disorder** (sudden, polymorphic, remitting within about 3 months) has no exact DSM-5-TR equivalent and has a generally good outcome; it is relatively common in low- and middle-income countries.
- Delusional disorder needs at least 3 months.
- **Schizotypal disorder** is placed with schizophrenia, not personality disorders.

### HiTOP
- The **thought disorder** spectrum contains schizophrenia, schizotypy, psychotic features of mood disorders and, partly, mania.
- **Negative symptoms** load on the **detachment** spectrum, shared with schizoid and avoidant traits. This explains why positive and negative symptoms respond differently to treatment.

### RDoC
Schizophrenia research under RDoC focuses on **cognitive systems** (working memory, cognitive control), **positive valence** (reward learning, anticipatory pleasure, relevant to avolition) and **social processes** (social cognition, theory of mind).

### The psychosis continuum
Psychotic experiences occur in about 5 to 6% of the general population over a lifetime, usually briefly. Psychosis may sit at the end of a continuum of experiences, distress and impairment, rather than being a strict on-off category. This underpins the clinical high-risk approach and also warns against over-pathologising.

:::widget sort
{"prompt": "Where does each feature sit in HiTOP?", "buckets": ["Thought disorder spectrum", "Detachment spectrum"], "items": [{"text": "Persecutory delusions", "bucket": 0}, {"text": "Avolition and asociality", "bucket": 1}, {"text": "Third-person voices", "bucket": 0}, {"text": "Restricted emotional expression", "bucket": 1}, {"text": "Odd, magical beliefs of schizotypy", "bucket": 0}]}
:::

:::widget curve
{"kind": "normal", "title": "Psychosis as a continuum", "caption": "Many traits and experiences are spread along a continuum in the population. Psychotic experiences are reported by about 5 to 6% of people over a lifetime; illness lies in the far tail, where experiences are frequent, distressing and disabling. Use the explorer to see how small the tail beyond a cut-off is."}
:::

:::recall
1. Name the six ICD-11 symptom specifiers. || Positive, negative, depressive mood, manic mood, psychomotor, cognitive.
2. What is ICD-11 acute and transient psychotic disorder? || Sudden, polymorphic psychosis remitting within about 3 months.
3. Where does ICD-11 place schizotypal disorder? || With schizophrenia and primary psychotic disorders.
4. Which HiTOP spectrum holds negative symptoms? || Detachment.
:::

:::mcq
Q: Under ICD-11, the minimum duration of symptoms for schizophrenia is:
- 6 months
- *1 month
- 1 week
- 1 year
> DSM-5-TR requires 6 months of continuous signs.
:::

## 4.5 Schizophrenia in India and the world [core][advanced]
### The outcome puzzle
WHO's international studies in the 1970s to 1990s (including centres in Agra and Chandigarh) reported **better outcomes in lower-income countries** than in high-income ones. Proposed reasons included family involvement, less stigma, more flexible work, and a higher proportion of acute, remitting psychoses. Later analyses questioned this, noting high mortality, chronic disability, chaining, and loss to follow-up in some low-income settings. The honest summary: outcomes vary enormously with access to care and social circumstances, and no setting is uniformly better.

### Indian evidence
- India's National Mental Health Survey found schizophrenia and other psychoses in about 0.4% of adults currently, with a large treatment gap.
- The **Madras Longitudinal Study** (Schizophrenia Research Foundation, Chennai) followed first-episode patients for decades, showing that many achieved remission and lived with families, while a substantial minority had persistent symptoms.
- The **COPSI trial** (community care for people with schizophrenia in India, 2014) found that adding trained lay health workers delivering community care to facility-based care led to modest improvements in symptoms and disability.
- **Families** provide most care in India. This is a strength, but carer burden, high expressed emotion and lack of respite are real. Family psychoeducation is essential.
- The **Mental Healthcare Act 2017** guarantees rights to community living, protection from cruel and degrading treatment (including chaining), and free treatment in government services for those below the poverty line, and requires informed consent, advance directives and supported decision-making.

:::widget decide
{"scene": "You are planning services for a rural block in Maharashtra with many people with untreated psychosis, one visiting psychiatrist a month, and active ASHA workers. Families travel hours to the district hospital, and many stop medicine after a few months.", "ask": "Which plan would most improve outcomes?", "choices": [{"label": "Build a long-stay psychiatric ward at the district hospital", "verdict": "harm", "outcome": "Few families can reach it; people lose community ties; the treatment gap barely changes.", "why": "Long-stay institutional care does not address access or adherence and conflicts with the right to community living."}, {"label": "Train ASHAs and lay workers to identify psychosis, support adherence and families, and link with monthly specialist clinics; provide free medicines locally, including long-acting injections where suitable, and family psychoeducation", "verdict": "best", "outcome": "More people are identified and stay on treatment; relapses and family distress fall.", "why": "Community-based collaborative care with task-sharing is supported by Indian trial evidence and matches the law's emphasis on community living."}, {"label": "Rely on faith healers, who are already trusted", "verdict": "harm", "outcome": "Many remain untreated; some are restrained.", "why": "Traditional healers can be partners in referral, but are not a substitute for treatment."}]}
:::

:::recall
1. What did WHO's international studies report, and what caveats apply? || Better outcomes in lower-income countries; later questioned because of mortality, disability, loss to follow-up and case mix.
2. What did the COPSI trial show? || Lay health worker community care added to usual care modestly improved symptoms and disability.
3. Name three rights for people with mental illness in the Mental Healthcare Act 2017. || Community living; protection from cruel or degrading treatment (no chaining); free treatment for those below the poverty line; informed consent; advance directives.
:::

:::mcq
Q: The best-supported way to improve schizophrenia care in rural India is:
- Long-stay hospitals
- *Community-based care with trained lay workers, family support and specialist supervision
- Faith healing alone
- Waiting for more psychiatrists
> Task-sharing and collaborative care.
:::

# Part V · Exam zone

## 5.1 Long answer and short notes [core]
:::example Q. Describe the clinical features, aetiology and management of schizophrenia. (15 marks)
1. Definition and DSM-5-TR criteria (A: two of five for a month, one being delusions, hallucinations or disorganised speech; B: decline; C: 6 months; D and E exclusions); ICD-11 (1 month, symptom specifiers, no subtypes).
2. Epidemiology: lifetime prevalence about 0.3 to 0.7%; onset late teens to early thirties, earlier in men; urbanicity, migration.
3. Clinical features: positive, negative, cognitive; first-rank symptoms with caveats; phases; suicide (5 to 6%).
4. Aetiology: genetics (twin heritability about 80%, 287 loci, CNVs); neurodevelopment; cannabis; dopamine (presynaptic synthesis capacity, aberrant salience) and glutamate (NMDA hypofunction); stress-vulnerability.
5. Differential: other psychotic disorders by duration, mood disorders with psychotic features, substance and organic causes (red flags), personality disorders.
6. Assessment: history, MSE, risk, physical work-up, PANSS.
7. Management: engagement; antipsychotics (choice by side effects, low dose in first episode, 4 to 6 week trials, maintenance, LAIs); clozapine for resistance; CBTp, family intervention (expressed emotion), rehabilitation (IPS); physical health; early intervention services.
8. Prognosis: good and poor factors; reduced life expectancy; Indian outcome studies.
:::

:::word Short note: expressed emotion
Expressed emotion describes family attitudes towards a relative with mental illness, measured by the Camberwell Family Interview: critical comments, hostility and emotional over-involvement (with less weight on warmth and positive remarks). High expressed emotion roughly doubles the risk of relapse in schizophrenia and also predicts relapse in mood and eating disorders. Family interventions, including psychoeducation, communication training and problem-solving, reduce expressed emotion and relapse, and are recommended for families of people with schizophrenia.
:::

:::word Short note: clozapine
An atypical antipsychotic with high affinity for D4, 5-HT2A, H1, M1 and alpha-1 receptors and relatively low D2 occupancy. It is the only drug with clear superiority in treatment-resistant schizophrenia (failure of two adequate trials), helping about 40% of such patients, and it reduces suicidal behaviour. It is started at 12.5 mg and titrated slowly with plasma level guidance. Serious adverse effects include agranulocytosis (requiring regular blood counts), myocarditis, severe constipation and ileus, seizures and metabolic syndrome; common effects include sedation, hypersalivation and tachycardia. Smoking lowers levels through CYP1A2 induction.
:::

:::word Short note: catatonia
A psychomotor syndrome diagnosed in DSM-5-TR by 3 or more of 12 signs (stupor, catalepsy, waxy flexibility, mutism, negativism, posturing, mannerism, stereotypy, agitation, grimacing, echolalia, echopraxia). It occurs most often with mood disorders, also with schizophrenia, autism and medical conditions. Rated with the Bush-Francis scale. Lorazepam is first-line (a test dose often helps quickly); ECT is used if benzodiazepines fail or in malignant catatonia. Antipsychotics are avoided early. Complications include dehydration, clots, pneumonia and death.
:::

## 5.2 Viva rapid-fire [core]
:::viva
DSM-5-TR schizophrenia criterion A? :: Two or more of five for a month, one being delusions, hallucinations or disorganised speech.
Total duration for schizophrenia (DSM-5-TR)? :: At least 6 months.
Schizophreniform duration? :: 1 month to under 6 months.
Brief psychotic disorder duration? :: At least 1 day, under 1 month, with full recovery.
Delusional disorder duration (DSM-5-TR)? :: At least 1 month.
Schizoaffective key rule? :: Psychosis for 2 weeks or more without mood episodes, mood episodes for most of the illness.
Lifetime prevalence of schizophrenia? :: About 0.3 to 0.7%.
Suicide rate in schizophrenia? :: About 5 to 6% die by suicide.
Twin heritability? :: About 80%.
Risk with one affected parent? :: About 10%.
Three components of expressed emotion? :: Critical comments, hostility, emotional over-involvement.
D2 occupancy for response? :: About 65%.
Order of EPS onset? :: Acute dystonia, akathisia, parkinsonism, tardive dyskinesia.
NMS features? :: Fever, rigidity, altered consciousness, autonomic instability, raised CK.
Definition of treatment-resistant schizophrenia? :: Failure of two adequate antipsychotic trials with confirmed adherence.
Which antipsychotic reduces suicidal behaviour? :: Clozapine.
Effect of smoking on clozapine? :: Lowers levels via CYP1A2 induction.
First non-D2 antipsychotic approved in the US? :: Xanomeline-trospium (2024).
Number of catatonia signs needed in DSM-5-TR? :: Three of 12.
First-line treatment for catatonia? :: Lorazepam; ECT if it fails.
What is aberrant salience? :: Dopamine-driven misattribution of significance to irrelevant stimuli.
ICD-11 schizophrenia duration? :: At least 1 month.
What is ICD-11 acute and transient psychotic disorder? :: Sudden, polymorphic psychosis remitting within about 3 months.
Number of loci in the 2022 schizophrenia GWAS? :: 287.
:::

${qa}
## 5.6 Module test [core]
Answer every question before looking back. Your best score is saved.

:::mcq
Q: A 24-year-old has had persecutory delusions and third-person voices for 8 months with marked decline. No mood episodes or substance use. Diagnosis:
- Schizophreniform disorder
- *Schizophrenia
- Delusional disorder
- Brief psychotic disorder
> Over 6 months with criterion A met.

Q: A woman develops sudden psychosis after her husband's death, lasting 12 days, with complete recovery. Diagnosis:
- Schizophrenia
- Schizophreniform disorder
- *Brief psychotic disorder with marked stressor
- Adjustment disorder
> 1 day to under 1 month.

Q: A 50-year-old has believed for two years that his wife is unfaithful; otherwise he works and behaves normally. Diagnosis:
- Schizophrenia
- *Delusional disorder, jealous type
- OCD
- Paranoid personality disorder
> A delusion for at least a month, criterion A never met.

Q: Psychotic symptoms that occur only during manic episodes indicate:
- Schizoaffective disorder
- *Bipolar I disorder with psychotic features
- Schizophrenia
- Delusional disorder
> Psychosis outside mood episodes suggests schizoaffective disorder.

Q: Which is a negative symptom?
- Thought broadcasting
- *Avolition
- Running commentary
- Flight of ideas
> Loss of motivation.

Q: Which red flag most suggests anti-NMDA receptor encephalitis?
- Gradual withdrawal
- *Psychosis with seizures, orofacial dyskinesias and autonomic instability in a young woman
- Persecutory delusions in clear consciousness
- Family history of schizophrenia
> Requires urgent work-up.

Q: The most replicated dopamine finding in schizophrenia is:
- More D2 receptors in cortex
- *Increased presynaptic dopamine synthesis and release capacity in the striatum
- Low dopamine everywhere
- No dopamine differences
> Associative striatum especially.

Q: NMDA receptor antagonists such as ketamine:
- Cure schizophrenia
- *Produce positive, negative and cognitive symptoms in healthy people
- Only cause sedation
- Have no psychiatric effects
> Basis of the glutamate hypothesis.

Q: Raised prolactin on risperidone is due to D2 blockade in the:
- Mesolimbic pathway
- Nigrostriatal pathway
- *Tuberoinfundibular pathway
- Mesocortical pathway
> Dopamine inhibits prolactin release.

Q: EPS become likely above about what D2 occupancy?
- 40%
- 55%
- *78%
- 95%
> Response at about 65%.

Q: Which antipsychotic is lowest in metabolic risk among these?
- Olanzapine
- Clozapine
- *Aripiprazole
- Quetiapine
> Olanzapine and clozapine are highest.

Q: Restlessness with an urge to keep moving two weeks after starting an antipsychotic is:
- Tardive dyskinesia
- *Akathisia
- Acute dystonia
- NMS
> Often mistaken for agitation.

Q: Which is TRUE of clozapine?
- It is first-line in all first episodes
- *It is indicated after two failed adequate antipsychotic trials and reduces suicidal behaviour
- It needs no monitoring
- It causes marked EPS
> Monitoring of blood counts is required.

Q: A patient on clozapine stops smoking on admission. The likely result is:
- Lower levels and relapse
- *Rising clozapine levels with toxicity risk
- No change
- Agranulocytosis
> Reduce the dose and check levels.

Q: High expressed emotion in a family most increases the risk of:
- Remission
- *Relapse
- Catatonia
- Tardive dyskinesia
> Family intervention reduces it.

Q: In people at clinical high risk for psychosis, recommended first-line care is:
- Antipsychotics for all
- *Monitoring, CBT and treatment of comorbid problems
- ECT
- Discharge
> Most do not convert.

Q: The goal of CBT for psychosis with voices is often to:
- Prove the voices do not exist
- *Reduce distress by changing beliefs about the voices' power and intent
- Replace all medicine
- Induce more voices
> Beliefs drive distress.

Q: Xanomeline-trospium works mainly by:
- D2 antagonism
- *Muscarinic M1 and M4 agonism in the brain
- Serotonin reuptake inhibition
- GABA-A modulation
> Trospium blocks peripheral effects.

Q: Which TAAR1 agonist failed in Phase 3?
- Pimavanserin
- *Ulotaront
- Cariprazine
- Lurasidone
> 2023.

Q: Higher C4A expression has been linked to schizophrenia through:
- Dopamine synthesis
- *Increased synaptic pruning
- Serotonin depletion
- Thyroid dysfunction
> Complement and microglia.

Q: In DSM-5-TR, catatonia requires:
- One sign
- *Three of 12 signs
- Five of 14 signs
- Stupor only
> A specifier or medical-condition diagnosis.

Q: Malignant catatonia is best treated urgently with:
- Haloperidol
- *ECT (with benzodiazepines and supportive care)
- Watchful waiting
- An SSRI
> Life-threatening.

Q: ICD-11 differs from DSM-5-TR for schizophrenia by:
- Keeping paranoid and hebephrenic subtypes
- *Requiring 1 month of symptoms and using symptom specifiers instead of subtypes
- Requiring 2 years
- Excluding negative symptoms
> Subtypes were removed.

Q: In HiTOP, negative symptoms load mainly on:
- Internalising
- *Detachment
- Disinhibition
- Somatoform
> Positive symptoms load on thought disorder.

Q: Life expectancy in schizophrenia is reduced by roughly:
- 1 to 2 years
- *About 15 years, mostly from physical illness
- 40 years
- Not at all
> Physical health care is essential.

Q: The COPSI trial in India showed that:
- Hospital care alone is best
- *Community care by trained lay workers added to usual care modestly improved outcomes
- Faith healing is effective
- Medicine is unnecessary
> Task-sharing works.
:::
`;
