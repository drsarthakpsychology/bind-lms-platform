/* Module · pharmacokinetics, Part V (Advanced). Original text written for VIBHA School of Psychology. */
export const advanced = String.raw`

# Part V · Advanced: receptor theory, signalling, non-linear kinetics and genes

## 5.1 Receptor theory: affinity, efficacy and the shape of the curve [core][advanced]
### Occupancy theory and its limits
Classical **occupancy theory** proposed that a drug's effect is proportional to the fraction of receptors it occupies. Two separate properties were then distinguished:
- **Affinity**: how strongly a drug binds, measured as the dissociation constant (Kd, or Ki in competition studies). A low Kd means tight binding: half the receptors are occupied at a low concentration.
- **Efficacy** (intrinsic activity): what the bound drug does to the receptor. Full agonists have high efficacy, partial agonists intermediate, antagonists none, inverse agonists negative.

Occupancy at equilibrium follows a hyperbola: occupancy = C ÷ (C + Kd). At C equal to Kd, half the receptors are occupied; at 9 times Kd, 90%; at 99 times Kd, 99%. This is why raising doses beyond a point adds little extra occupancy.

### Potency and maximal effect on the curve
| Term | Definition | On a log dose-response curve |
|---|---|---|
| EC50 | Concentration giving half the maximal effect | Position (left is more potent) |
| Emax | Maximal effect | Height |
| Hill slope | Steepness | How quickly effect rises with dose |
| Therapeutic index | Toxic dose (or TD50) ÷ effective dose (ED50) | Distance between benefit and harm curves |

:::widget curve
{"kind": "dose-response", "title": "Read potency, efficacy and partial agonism off the curve", "caption": "Slide potency and efficacy separately. Then picture a partial agonist's curve: it plateaus lower however high the dose. Now add a full agonist on top: the partial agonist pulls the full agonist's effect down towards its own ceiling, which is how aripiprazole lowers excessive dopamine signalling."}
:::

### Spare receptors and why efficacy depends on the tissue
In some tissues a full agonist produces its maximum effect while occupying only a small fraction of receptors: the rest are **spare receptors** (receptor reserve). Consequences:
- EC50 can be much lower than Kd.
- A partial agonist can behave almost like a full agonist where reserve is large, and like an antagonist where reserve is small. Aripiprazole may act more agonist-like at presynaptic D2 autoreceptors (high reserve) and more antagonist-like at postsynaptic D2 receptors in overactive circuits.
- Losing receptors (down-regulation, disease) lowers reserve and can turn a partial agonist's effect from stimulation into blockade.

:::widget receptor
{"receptor": "D2", "title": "Constitutive activity and inverse agonism", "caption": "Start with Nothing bound: the bar shows a small resting signal, because some receptors are active on their own (constitutive activity). An antagonist leaves this resting signal unchanged; an inverse agonist pushes it down. Many drugs called antagonists are, in laboratory systems, actually inverse agonists, including several antipsychotics at D2 and 5-HT2A and many antihistamines at H1."}
:::

### Allosteric modulators
An **allosteric** drug binds a site other than the messenger's site and changes how the receptor responds:
- **Positive allosteric modulators** (PAMs) increase the messenger's effect but do nothing alone: benzodiazepines and neurosteroids at GABA-A.
- **Negative allosteric modulators** (NAMs) reduce it.
- Allosteric drugs have a natural ceiling: they cannot exceed what the messenger can do, which is one reason benzodiazepines alone are rarely fatal.


:::widget receptor
{
 "receptor": "GABA-A",
 "title": "Allosteric is not the same as agonist",
 "caption": "Try the four ligand types. All of them sit in the main lock. A benzodiazepine is different: it binds a separate site and only turns up the effect of GABA that is already there. With no GABA it does little, which is one reason benzodiazepines alone rarely stop breathing, while barbiturates, which can open the channel directly at high doses, can."
}
:::

### Functional selectivity
Some agonists favour one signalling pathway over another at the same receptor (biased agonism), for example G protein signalling over beta-arrestin. This is an active area in opioid and dopamine drug design, aiming to keep benefit while losing specific side effects.

:::widget worked
{"title": "Occupancy arithmetic", "steps": [{"q": "A drug has a Kd of 2 nM. What fraction of receptors does a free concentration of 2 nM occupy?", "a": "C ÷ (C + Kd) = 2 ÷ 4 = **50%**."}, {"q": "At 18 nM?", "a": "18 ÷ 20 = **90%**. Nine times the concentration gave only 40 more percentage points."}, {"q": "At 198 nM?", "a": "198 ÷ 200 = **99%**. Above about 90%, enormous increases give tiny gains."}], "yourTurn": [{"q": "What concentration gives 80% occupancy for a drug with Kd 5 nM?", "a": "0.8 = C ÷ (C + 5), so C = 20 nM (four times Kd)."}]}
:::

:::recall
1. Define affinity and efficacy. || How strongly a drug binds (Kd); what the bound drug does to the receptor (intrinsic activity).
2. What fraction of receptors is occupied at a concentration equal to Kd? || Half.
3. What are spare receptors? || Receptors beyond those needed for a full agonist's maximal effect.
4. How does an allosteric modulator differ from an orthosteric agonist? || It binds a different site and changes the messenger's effect rather than acting alone.
:::

:::mcq
Q: In a tissue with a large receptor reserve, a partial agonist is most likely to:
- Act as an inverse agonist
- *Produce an effect close to a full agonist
- Have no effect
- Block all receptors permanently
> Reserve amplifies the partial agonist's signal.
:::

## 5.2 Targets and signalling: from receptor to gene [core][advanced]

:::widget figure
{"id": "synapse", "quiz": true, "caption": "Name each numbered part in your head first, then tap to check."}
:::

| Target family | How it signals | Speed | Psychiatric examples |
|---|---|---|---|
| Ligand-gated ion channels | Opens a pore | Milliseconds | GABA-A (benzodiazepines), NMDA (ketamine), 5-HT3 (ondansetron), nicotinic |
| G protein-coupled receptors | Activates G proteins and second messengers | Seconds to minutes | D2, 5-HT1A, 5-HT2A, alpha-2, H1, muscarinic, opioid |
| Transporters | Moves the messenger back into the neuron | Ongoing | SERT, NET, DAT (SSRIs, SNRIs, bupropion); VMAT2 (valbenazine) |
| Enzymes | Breaks down or makes a molecule | Ongoing | MAO (MAOIs), acetylcholinesterase (donepezil), IMPase and GSK-3 (lithium) |
| Voltage-gated channels | Shapes firing | Milliseconds | Sodium channels (carbamazepine, lamotrigine), calcium channels (pregabalin) |


:::widget synapse
{"drug": "maoi", "caption": "Two non-receptor targets in one picture: the pump (transporter) that SSRIs block, and the enzyme (MAO) that MAOIs block. Neither drug touches a receptor directly, yet both change receptor signalling downstream."}
:::
### The three main G protein routes
| G protein | Effect | Receptors |
|---|---|---|
| Gs | Raises cyclic AMP | D1, 5-HT4, 5-HT6, 5-HT7, beta |
| Gi | Lowers cyclic AMP, opens potassium channels | D2, D3, D4, 5-HT1A, alpha-2, mu opioid, M2, M4 |
| Gq | Activates phospholipase C, IP3, calcium, DAG | 5-HT2A, 5-HT2C, alpha-1, H1, M1, M3 |

:::widget flow
{"title": "From a receptor at the surface to a change in the nucleus", "layout": "chain", "nodes": [{"id": "g1", "label": "Messenger binds a G protein-coupled receptor", "detail": "For example serotonin at 5-HT1A, or dopamine at D2."}, {"id": "g2", "label": "G protein switches on", "detail": "The receptor swaps GDP for GTP on the G protein, which splits and acts on enzymes or channels."}, {"id": "g3", "label": "Second messengers change", "detail": "Cyclic AMP, calcium, IP3 or DAG levels rise or fall."}, {"id": "g4", "label": "Kinases act", "detail": "Protein kinase A, C and others add phosphate groups to target proteins."}, {"id": "g5", "label": "Transcription factors move", "detail": "CREB and others enter the nucleus and switch genes on or off, such as BDNF."}, {"id": "g6", "label": "The neuron changes over days", "detail": "New receptors, new synapses, changed sensitivity: the slow adaptations behind many medicines' delayed effects and their withdrawal syndromes."}], "caption": "Press Play. The early steps take seconds; the last ones take days to weeks. That gap explains why many psychiatric medicines take time."}
:::


:::widget release
{
 "transmitter": "serotonin",
 "title": "The first dose changes the synapse at once",
 "caption": "Pick SSRI: within hours serotonin lingers in the gap. Yet mood takes weeks to lift. The table below shows why: the brain answers the extra serotonin by desensitising its own brake receptors and changing gene expression, and it is that slow adaptation, not the first change you see here, that tracks recovery."
}
:::

### Adaptation: desensitisation, down-regulation and up-regulation
| Process | What happens | Timescale | Example |
|---|---|---|---|
| Desensitisation | Receptor uncouples from its G protein (phosphorylation, beta-arrestin) | Seconds to hours | Tolerance to SSRI nausea |
| Down-regulation | Fewer receptors on the surface | Days to weeks | 5-HT1A autoreceptors on SSRIs; beta receptors on antidepressants |
| Up-regulation | More receptors after chronic blockade | Weeks to months | D2 supersensitivity on antipsychotics; withdrawal and tardive dyskinesia |

:::recall
1. Name the four main types of drug target. || Receptors (ion channel and G protein-coupled), transporters, enzymes, voltage-gated channels.
2. Which G protein does D2 use, and what does it do? || Gi; lowers cyclic AMP.
3. Which G protein do 5-HT2A, alpha-1 and H1 use? || Gq.
4. What is up-regulation, with an example? || More receptors after chronic blockade; D2 supersensitivity on antipsychotics.
:::

:::mcq
Q: Ketamine acts faster than SSRIs partly because its target is:
- A transporter
- *A ligand-gated ion channel (NMDA), acting in milliseconds and triggering rapid plasticity
- An enzyme in the liver
- A Gs receptor
> Ion channels act fast; downstream growth also starts quickly.
:::

## 5.3 Non-linear kinetics and compartments [core][advanced]
### First-order and zero-order elimination
- **First-order** (most drugs): a constant **fraction** is removed per unit time. Half-life is constant, and levels rise in proportion to dose.
- **Zero-order** (saturated elimination): a constant **amount** is removed per unit time. Half-life lengthens as levels rise, and small dose increases cause large level increases.

Examples of saturable or self-limiting elimination: alcohol, phenytoin, high-dose aspirin. Among psychiatric drugs, **paroxetine** and **fluoxetine** inhibit their own CYP2D6 metabolism, so levels rise more than proportionally with dose; **valproate**'s protein binding saturates, raising the free fraction at high doses; **clozapine** metabolism can saturate at high levels.

:::widget compare
{"title": "Linear and saturated elimination", "a": {"label": "First-order (linear)", "points": ["A fixed fraction removed each hour", "Constant half-life", "Double the dose, double the level", "Steady state after 4 to 5 half-lives", "Most medicines at usual doses"], "summary": "Predictable: dose changes give proportional level changes."}, "b": {"label": "Zero-order or saturable", "points": ["A fixed amount removed each hour", "Half-life grows as levels rise", "A small dose rise can cause a big level rise", "Steady state may take much longer or never settle", "Alcohol, phenytoin; partly paroxetine, fluoxetine and high-level clozapine"], "summary": "Unpredictable at higher doses: change slowly and measure levels where possible."}, "caption": "Slide between the two. Which pattern explains why one extra drink at the end of an evening raises blood alcohol so much?"}
:::

### One or two compartments: why diazepam wears off before its half-life says it should
After an IV or oral dose, a fat-soluble drug first fills a **central compartment** (blood and well-perfused organs, including the brain), then moves into a **peripheral compartment** (fat and muscle). The first, fast fall in brain levels is **redistribution**, not elimination.
- A single dose of diazepam calms quickly and wears off within hours as it redistributes into fat, despite an elimination half-life of a day or more.
- With repeated doses, fat fills up, redistribution no longer lowers levels, and the long elimination half-life takes over: accumulation and next-day sedation.
- Lorazepam is less fat-soluble: slower onset after IV, but a longer-lasting single-dose effect, which is why it is preferred for status epilepticus.

### Flip-flop kinetics
When absorption is much slower than elimination (depot injections, some slow-release formulations), the absorption rate sets the apparent half-life. Steady state then takes four to five **absorption** half-lives: months for some depots.


:::widget journey
{
 "drug": "Aripiprazole monthly injection",
 "target": "dopamine D2 receptors, as a partial agonist",
 "route": "depot",
 "notes": {
  "muscle": "Tiny crystals sit in the muscle and dissolve slowly over weeks. This slow release, not the liver, sets how long it lasts.",
  "slow": "Because release is slower than elimination, the apparent half-life is the release half-life: flip-flop kinetics. Steady state takes months.",
  "liver": "Once in the blood it is cleared by CYP2D6 and CYP3A4 as usual, so strong inhibitors still mean a dose change."
 },
 "caption": "Follow the depot route and stop at the muscle. This is why oral cover is given at the start, and why a missed injection does not cause an immediate drop."
}
:::

:::recall
1. Contrast first-order and zero-order elimination. || A constant fraction versus a constant amount removed per unit time.
2. Name two psychiatric drugs with self-limiting (non-linear) kinetics. || Paroxetine and fluoxetine (also valproate binding, high-level clozapine).
3. Why does a single dose of diazepam wear off quickly? || Redistribution from brain into fat, not elimination.
4. What is flip-flop kinetics? || Slow absorption sets the apparent half-life.
:::

:::mcq
Q: Paroxetine 40 mg gives more than twice the level of 20 mg mainly because:
- It is better absorbed at higher doses
- *It inhibits its own CYP2D6 metabolism
- It has a small volume of distribution
- It is renally cleared
> Self-inhibition causes non-linear kinetics.
:::

## 5.4 Interactions at depth [core][advanced]
### Kinds of pharmacokinetic interaction
| Mechanism | How it works | Example |
|---|---|---|
| Reversible inhibition | Inhibitor competes at the enzyme; effect fades as inhibitor clears | Fluvoxamine at CYP1A2 |
| Mechanism-based inhibition | Inhibitor permanently inactivates the enzyme; effect lasts until new enzyme is made | Paroxetine at CYP2D6; clarithromycin at CYP3A4 |
| Induction | Inducer activates nuclear receptors (PXR, CAR, AhR), increasing enzyme production | Carbamazepine, rifampicin (PXR); smoke (AhR, CYP1A2) |
| Transporter effects | P-glycoprotein inhibition or induction changes absorption and brain entry | Verapamil or ketoconazole raise some P-gp substrates |
| Protein-binding displacement | Usually only transient unless clearance also falls | Valproate raising free phenytoin |
| Renal | Changes in kidney handling | Thiazides, NSAIDs and ACE inhibitors raising lithium |


:::widget release
{
 "transmitter": "noradrenaline",
 "title": "Two pushes on the same synapse",
 "caption": "Pick MAOI: noradrenaline stores fill because the enzyme no longer breaks it down. Now imagine adding Amphetamine (or a decongestant, or tyramine from food): the pump reverses and those full stores are dumped into the gap at once. Each drug alone is manageable; together they can cause a hypertensive crisis. Most dangerous interactions are two drugs pushing the same lever."
}
:::

### Pharmacodynamic interactions that cause most harm
| Shared effect | Combinations | Risk |
|---|---|---|
| Serotonergic | SSRI or SNRI with MAOI, tramadol, linezolid, triptans, dextromethorphan | Serotonin syndrome |
| QT prolongation | Citalopram, haloperidol, ziprasidone with methadone, ondansetron, macrolides, antimalarials, fluoroquinolones; low potassium | Torsades de pointes |
| Anticholinergic | Tricyclics, antihistamines, trihexyphenidyl, oxybutynin, clozapine, olanzapine | Delirium, retention, ileus |
| CNS and breathing depression | Benzodiazepines, opioids, gabapentinoids, alcohol, sedating antipsychotics | Respiratory arrest |
| Bleeding | SSRIs with NSAIDs, aspirin, anticoagulants | Gut and other bleeding |
| Seizure threshold | Bupropion, clozapine, tramadol, high-dose tricyclics, alcohol withdrawal | Seizures |

:::widget decide
{"scene": "Mr D'Mello, 59, in Mangaluru, has schizophrenia on haloperidol 10 mg and depression on citalopram 40 mg. He is admitted with malaria and gets an antimalarial known to prolong QT, plus ondansetron for vomiting. Potassium is 3.1 mmol/L. His ECG shows a QTc of 520 ms.", "ask": "What is the best response?", "choices": [{"label": "Continue all medicines and repeat the ECG next week", "verdict": "harm", "outcome": "On the second night he develops torsades de pointes.", "why": "Four QT-prolonging drugs plus low potassium and a QTc above 500 ms is high risk."}, {"label": "Treat it as a QT emergency: cardiac monitoring, correct potassium and magnesium, replace ondansetron, reduce or hold citalopram and haloperidol (with an antipsychotic of lower QT risk if needed), choose the antimalarial with the physicians, and repeat the ECG", "verdict": "best", "outcome": "His QTc falls below 470 ms within days. He completes malaria treatment and is moved to aripiprazole and sertraline.", "why": "Pharmacodynamic stacking is managed by removing what you can, correcting electrolytes and monitoring."}, {"label": "Stop only the antimalarial", "verdict": "harm", "outcome": "His malaria worsens and his QT stays long.", "why": "The life-saving drug is the last to remove; the psychiatric drugs and electrolytes can be changed."}]}
:::

:::recall
1. What is mechanism-based inhibition, with an example? || Permanent enzyme inactivation lasting until new enzyme is made; paroxetine at CYP2D6.
2. Which nuclear receptor mediates most CYP3A4 induction? || PXR.
3. Name four pharmacodynamic interactions that cause harm. || Serotonergic, QT, anticholinergic, CNS and breathing depression (also bleeding, seizures).
:::

:::mcq
Q: Why does the effect of stopping paroxetine on another drug's CYP2D6 clearance take days to disappear?
- Paroxetine has a very long half-life
- *Paroxetine permanently inactivates CYP2D6, so recovery needs new enzyme
- CYP2D6 is induced
- The other drug accumulates in fat
> Mechanism-based inhibition.
:::

## 5.5 Pharmacogenomics in practice [core][advanced]
### Activity scores
For **CYP2D6**, each inherited copy (allele) is given an activity value: 1 for normal function (such as *1, *2), 0.25 or 0.5 for reduced function (such as *10 and *41), 0 for no function (*3, *4, *5), and duplications double a value. The sum gives the phenotype:
| Activity score | Phenotype |
|---|---|
| 0 | Poor metaboliser |
| 0.25 to 1 | Intermediate metaboliser |
| 1.25 to 2.25 | Normal metaboliser |
| Above 2.25 | Ultrarapid metaboliser |

**CYP2C19** phenotypes come from no-function alleles (*2, *3) and an increased-function allele (*17). In several Indian samples, CYP2C19 poor metabolisers make up roughly one in eight to one in five people, much higher than in Europeans, while CYP2D6 poor metabolisers are fewer.

### What results change
| Gene result | Drugs affected | Typical guidance |
|---|---|---|
| CYP2C19 poor | Citalopram, escitalopram, sertraline | Lower starting dose or alternative |
| CYP2C19 ultrarapid | Citalopram, escitalopram | Consider an alternative |
| CYP2D6 poor | Paroxetine, vortioxetine, aripiprazole, brexpiprazole, tricyclics, atomoxetine | Lower doses (aripiprazole about half) |
| CYP2D6 ultrarapid | Tricyclics, paroxetine | Alternative or level-guided dosing |
| HLA-B*15:02 | Carbamazepine, oxcarbazepine | Avoid if positive |
| HLA-A*31:01 | Carbamazepine | Consider avoiding |

:::widget flow
{"title": "Reading a pharmacogenomic report safely", "layout": "chain", "nodes": [{"id": "r1", "label": "Genotype", "detail": "The report lists the alleles found (for example CYP2C19 *2/*17)."}, {"id": "r2", "label": "Predicted phenotype", "detail": "Alleles are translated into a metaboliser type."}, {"id": "r3", "label": "Check current medicines", "detail": "Strong inhibitors (fluoxetine, paroxetine, bupropion, fluvoxamine, omeprazole) can change the real phenotype: phenoconversion."}, {"id": "r4", "label": "Check the person", "detail": "Age, liver and kidney function, smoking, pregnancy, inflammation."}, {"id": "r5", "label": "Decide the dose or drug", "detail": "Use the result to adjust starting dose and pace, or avoid a mismatched drug. It does not say which medicine will work best."}, {"id": "r6", "label": "Monitor anyway", "detail": "Side effects, response and, where useful, drug levels."}], "caption": "Press Play. A gene test is one input to a clinical decision, never the decision itself."}
:::

:::widget decide
{"scene": "Rohan, 26, in Pune, had an online pharmacogenomic test that labelled sertraline, escitalopram and vortioxetine 'red: do not use' and an expensive brand of desvenlafaxine 'green: best for you'. He has moderate depression and asks you to follow the report. His genotype is CYP2C19 *1/*2 (intermediate) and CYP2D6 *1/*1 (normal).", "ask": "How do you advise?", "choices": [{"label": "Follow the colour coding exactly", "verdict": "ok", "outcome": "Desvenlafaxine helps, but he pays a lot and was told, wrongly, that other options were unsafe.", "why": "The genotype does not make those drugs unsafe; it suggests careful dosing for CYP2C19 substrates."}, {"label": "Explain what the result really means: an intermediate CYP2C19 result supports a lower starting dose and slower increase for escitalopram or sertraline, and no change for vortioxetine. Choose together on the usual grounds, and monitor", "verdict": "best", "outcome": "He starts sertraline at 25 mg, increases slowly, and improves without troublesome side effects.", "why": "Commercial colour codes often overstate gene effects. The useful information is about dose, not about which drug will work."}, {"label": "Ignore the test entirely", "verdict": "ok", "outcome": "He feels dismissed and stops attending.", "why": "The result is partly useful; explaining it builds trust."}]}
:::

:::recall
1. What CYP2D6 activity score defines a poor metaboliser? || 0.
2. Which allele increases CYP2C19 activity? || *17.
3. What is phenoconversion? || A medicine (or illness) changing the real metaboliser phenotype from what the genes predict.
4. What can a pharmacogenomic test not tell you? || Which medicine will work best.
:::

:::mcq
Q: A CYP2D6 normal metaboliser on bupropion is started on aripiprazole. The best approach is:
- Use the usual dose; genotype is normal
- *Treat her as a poor metaboliser while on bupropion and halve the aripiprazole dose
- Avoid aripiprazole entirely
- Double the dose
> Phenoconversion by a strong CYP2D6 inhibitor.
:::

## 5.6 From laboratory to clinic: how a medicine earns its place [core][advanced]
### The stages of development
:::widget timeline
{"prompt": "Put the stages of bringing a new psychiatric medicine to patients in order.", "events": [{"label": "Target identified and molecule designed in the laboratory"}, {"label": "Animal and cell studies of effect and toxicity"}, {"label": "Phase 1: small studies in healthy volunteers for safety and kinetics"}, {"label": "Phase 2: first patient studies to find doses and signals of benefit"}, {"label": "Phase 3: large randomised trials against placebo or an active drug"}, {"label": "Regulatory review and approval (for example the US FDA, or CDSCO in India)"}, {"label": "Phase 4: post-marketing safety monitoring in the real world"}], "why": "Most molecules fail somewhere along this line, often in phase 2 or 3: recent examples are emraclidine and ulotaront in schizophrenia. Rare serious harms, such as clozapine's agranulocytosis, are often first recognised only after approval."}
:::

### Reading the size of a benefit
| Measure | Meaning | Rough examples |
|---|---|---|
| Standardised mean difference | Difference between groups in standard deviation units | Antidepressants against placebo in acute depression: about 0.3 |
| Number needed to treat (NNT) | How many people must be treated for one extra good outcome | Antidepressants for response: about 6 to 9; antipsychotics to prevent one relapse over a year: about 3 |
| Number needed to harm (NNH) | How many treated for one extra harm | Varies by side effect |
| Absolute versus relative risk | A doubling of a rare risk may still be small | Lithium heart malformations: about 1 in 100 to about 2 in 100 |

### Why approvals differ between countries
- Regulators weigh the same evidence differently, and companies apply in different markets at different times.
- In India, the **Central Drugs Standard Control Organisation (CDSCO)** approves new drugs; local clinical data may be required. Many newer agents approved in the US (xanomeline with trospium, zuranolone) were not available in India in late 2026.
- India banned hundreds of irrational fixed-dose combinations in 2016 and 2018, but many psychiatric combinations remain in use.
- Generic medicines must show **bioequivalence**: similar blood levels (rate and extent of absorption within set limits) to the original. For narrow-range drugs such as lithium and anticonvulsants, switching brands can still shift levels, so levels are rechecked.

:::recall
1. What is the main purpose of phase 1 trials? || Safety and kinetics in small groups, often healthy volunteers.
2. What does an NNT of 6 mean? || Six people must be treated for one extra person to benefit.
3. Which body approves new medicines in India? || CDSCO.
4. What must a generic show? || Bioequivalence to the original.
:::

:::mcq
Q: A drug doubles the risk of a side effect from 1 in 1000 to 2 in 1000. Which statement is MOST accurate?
- The risk is now high
- *The relative risk doubled, but the absolute increase is 1 in 1000
- Everyone will get the side effect
- The NNH is 2
> Always ask for absolute numbers.
:::
`;
