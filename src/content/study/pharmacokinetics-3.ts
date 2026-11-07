/* Module · pharmacokinetics, exam zone: long answers, viva, Q&A bank and module test. Original text written for VIBHA School of Psychology. */
const exam = String.raw`

# Part VI · Exam zone

## 6.1 Long answer and short notes [core]
:::example Q. Describe the pharmacokinetics of psychotropic drugs, with clinical examples. (15 marks)
1. Definitions: pharmacokinetics against pharmacodynamics; ADME.
2. Absorption: routes, bioavailability, first pass, food (lurasidone, xanomeline with trospium), formulations, depots.
3. Distribution: volume of distribution (lithium against fat-soluble drugs), protein binding (valproate), blood-brain barrier and P-glycoprotein, areas outside the barrier.
4. Metabolism: Phase I and II; CYP1A2, 2D6, 2C19, 3A4 with substrates, inhibitors and inducers; smoking; induction and inhibition timing.
5. Excretion and the maths: clearance, half-life, steady state, loading and maintenance doses.
6. TDM: lithium, clozapine, anticonvulsants.
7. Special populations and pharmacogenomics.
:::

:::example Q. Explain receptor theory and its relevance to psychopharmacology. (15 marks)
1. Occupancy theory; affinity (Kd) and efficacy; the hyperbolic occupancy curve.
2. Dose-response curves: potency (EC50), Emax, slope, therapeutic index.
3. Full, partial, antagonist and inverse agonist action, with constitutive activity; examples (aripiprazole, pimavanserin).
4. Spare receptors and tissue-dependent partial agonism.
5. Allosteric modulators (benzodiazepines, neurosteroids) and their ceiling effect.
6. Signalling (ion channels, G proteins, second messengers) and adaptation (desensitisation, down-regulation, supersensitivity) explaining delayed effects, tolerance and withdrawal.
:::

:::word Short note: therapeutic drug monitoring
Measuring drug levels to guide dosing is most useful when the range is narrow (lithium), individual variation is large (clozapine, tricyclics), toxicity mimics illness, or adherence is uncertain. Samples are usually troughs taken at steady state (about five half-lives after a change); lithium is sampled 12 hours after the last dose. Results must be read alongside the clinical picture, timing, formulation and interacting factors such as smoking, infection and pregnancy.
:::

## 6.2 Viva rapid-fire [core]
:::viva
Define pharmacokinetics. :: What the body does to a drug: ADME.
Define pharmacodynamics. :: What the drug does to the body.
Define bioavailability. :: The fraction of a dose reaching the circulation unchanged.
What is first-pass metabolism? :: Loss of a swallowed drug in gut wall and liver before it reaches the body.
Half-life formula? :: 0.693 × Vd ÷ clearance.
Time to steady state? :: About 4 to 5 half-lives.
Loading dose formula? :: Target level × Vd ÷ F.
Steady-state level depends on? :: Dosing rate ÷ clearance.
Enzyme induced by smoking? :: CYP1A2.
Strong CYP1A2 inhibitor? :: Fluvoxamine (also ciprofloxacin).
Three strong CYP2D6 inhibitors? :: Fluoxetine, paroxetine, bupropion.
Strong CYP3A4 inducer used for TB? :: Rifampicin.
How long does induction take? :: About 1 to 3 weeks.
What is phenoconversion? :: A medicine changing the metaboliser phenotype from what genes predict.
Brain area outside the barrier raising prolactin? :: Pituitary.
Pump limiting brain entry of paliperidone? :: P-glycoprotein.
Benzodiazepine preferred in liver disease? :: Lorazepam.
Define affinity. :: How tightly a drug binds (Kd).
Define efficacy. :: The maximum effect a drug produces.
Define potency. :: The dose needed for an effect (EC50).
What is an inverse agonist? :: A drug lowering a receptor below its resting activity.
What is a PAM? :: Positive allosteric modulator, such as a benzodiazepine at GABA-A.
G protein for D2? :: Gi.
G protein for 5-HT2A? :: Gq.
Zero-order example? :: Alcohol (also phenytoin).
Why does single-dose diazepam wear off fast? :: Redistribution into fat.
CYP2C19 increased-function allele? :: *17.
CYP2D6 activity score for a poor metaboliser? :: 0.
What does NNT mean? :: Number needed to treat for one extra benefit.
Indian drug regulator? :: CDSCO.
:::
`;

const qa = String.raw`

## 6.3 Q&A bank · Starting [core][starting]

:::qa What is the difference between pharmacokinetics and pharmacodynamics, with an example of each? [starting]
### Short answer
Pharmacokinetics is what the body does to a medicine (absorbing, spreading, changing and removing it). Pharmacodynamics is what the medicine does to the body (which target it acts on and what follows).
| | Example |
|---|---|
| Pharmacokinetic | Smoking speeds up the liver enzyme that clears clozapine, so its level falls |
| Pharmacodynamic | Mirtazapine blocks histamine H1 receptors, so people feel sleepy and hungry |
### Why it matters
If a medicine is not working, the cause may be kinetic (not enough reaches the target) or dynamic (it reaches the target, but that target is not the right one for this person). The fixes differ.
:::

:::qa What happens to a tablet from the moment it is swallowed? [starting]
### Short answer
It dissolves, is absorbed through the gut wall, passes through the liver (first pass), enters the blood, spreads to tissues, crosses into the brain if it can, acts on its target, and is then changed by the liver and removed by the kidneys or bile.
### Step by step
1. **Dissolving and absorption** in the stomach and small intestine.
2. **First pass**: the portal vein carries it to the liver, where part is broken down.
3. **Distribution**: blood carries it; much sticks to proteins; the free part enters tissues.
4. **Blood-brain barrier**: only suitable molecules cross.
5. **Action** at the target.
6. **Metabolism and excretion**.
:::

:::qa Why do injections often work faster than tablets? [starting]
### Short answer
An injection into a vein or muscle skips the slow absorption step and the liver's first pass, so more medicine reaches the blood, and faster. A vein injection reaches the blood at once.
### When speed matters
- Severe agitation (IM lorazepam or haloperidol with promethazine).
- A long seizure (IV lorazepam, or nasal or buccal midazolam when there is no vein).
### Trade-offs
Injections need trained staff, can cause pain or dystonia, and cannot be taken back once given.
:::

:::qa What does half-life tell a patient in everyday terms? [starting]
### Short answer
How often to take the medicine, how long until it reaches its full steady level, and how quickly it leaves (including how rough stopping might feel).
### Plain examples
- Short half-life (alprazolam): effect wears off between doses; stopping suddenly feels bad quickly.
- About a day (sertraline): once a day; steady within about a week.
- Very long (fluoxetine): a missed dose barely matters; it lingers for weeks after stopping.
:::

:::qa Why do some medicines interact with each other? [starting]
### Short answer
Either one medicine changes how much of the other is in the body (by speeding up or slowing down the liver enzymes or kidneys that clear it), or both act on the same system and add up (for example two sedatives together).
### Two everyday examples
- **Level change**: fluvoxamine slows the enzyme that clears clozapine, so clozapine builds up.
- **Added effects**: alcohol and a benzodiazepine both strengthen the GABA brake; together they can stop breathing.
:::

:::qa What is the blood-brain barrier, and why does it matter for psychiatric medicines? [starting]
### Short answer
It is the tightly sealed lining of the brain's blood vessels that keeps most substances out. Medicines for the mind must be able to cross it, usually by being small and fat-soluble.
### Why it matters
- Medicines that cannot cross do not act on the brain (useful: trospium blocks body side effects of xanomeline without entering the brain).
- A few areas lie outside it, such as the pituitary and the vomiting centre, which explains some side effects (prolactin rise, nausea).
:::

:::qa What do agonist, antagonist and partial agonist mean? [starting]
### Short answer
An agonist switches a receptor on, an antagonist blocks it without switching it on, and a partial agonist switches it on only part of the way.
| Type | Example |
|---|---|
| Full agonist | Morphine at opioid receptors |
| Partial agonist | Buprenorphine at opioid receptors; aripiprazole at D2 |
| Antagonist | Naloxone at opioid receptors; haloperidol at D2 |
| Inverse agonist | Pimavanserin at 5-HT2A |
:::

:::qa Why can the same dose suit one person and not another? [starting]
### Short answer
People differ in how they absorb, spread, change and remove medicines (genes, age, liver and kidney function, smoking, pregnancy, other medicines) and in how sensitive their targets are.
### Main reasons
- **Genes**: fast or slow liver enzymes.
- **Age**: slower kidneys and more body fat in older people.
- **Other medicines**: inhibitors and inducers.
- **Habits**: smoking, alcohol, diet.
- **Illness**: liver, kidney or heart disease, infection.
:::

:::qa What is a drug level, and when is it worth measuring? [starting]
### Short answer
A drug level is the concentration of the medicine in the blood. It is worth measuring when the safe range is narrow (lithium), when people vary a lot (clozapine), when toxicity is suspected, or when it is unclear whether doses are being taken.
### Timing matters
Most levels are taken just before the next dose (the trough), once the drug has reached a steady level. Lithium is taken about 12 hours after the last dose.
:::

:::qa Why are older adults more sensitive to medicines? [starting]
### Short answer
Their kidneys and liver clear drugs more slowly, they have more body fat and less water, they often take several medicines, and their brains are more sensitive to sedation and anticholinergic effects.
### The rule
Start low, go slow, review often, and remove what is not needed.
:::

:::qa What is a generic medicine, and is it the same as the brand? [starting]
### Short answer
A generic contains the same active medicine as the original brand and must show similar blood levels (bioequivalence). For most medicines it works the same. For narrow-range medicines such as lithium and some anticonvulsants, switching brands can change levels, so levels are rechecked after a switch.
:::

:::qa What does it mean that a medicine is "potent"? [starting]
### Short answer
Potent means that only a small amount is needed for an effect. It does not mean stronger or better. Haloperidol is potent (a few milligrams); chlorpromazine is less potent (hundreds of milligrams); both can control psychosis.
:::

:::qa Why do some medicines need to be taken with food and others on an empty stomach? [starting]
### Short answer
Food changes how some medicines are absorbed. Lurasidone and ziprasidone are absorbed much better with a meal; zuranolone needs fat-containing food; xanomeline with trospium is absorbed less with food, so it is taken away from meals. For many others, food matters only for comfort (less nausea).
:::

## 6.4 Q&A bank · Beginner [core][beginner]

:::qa Explain bioavailability and first-pass metabolism with psychiatric examples. [beginner]
### Short answer
Bioavailability is the fraction of a dose reaching the circulation unchanged; first-pass metabolism (in gut wall and liver) is a major cause of low oral bioavailability.
| Drug | Oral bioavailability | Consequence |
|---|---|---|
| Ketamine | Low | Given nasally (esketamine) or IV |
| Asenapine | Very low swallowed | Sublingual only |
| Buprenorphine | Very low swallowed | Sublingual |
| Haloperidol, olanzapine | Moderate | Injected doses lower than oral |
| Lithium | High | Oral works well |
:::

:::qa How do inhibitors and inducers differ in onset, offset and clinical importance? [beginner]
### Short answer
Inhibitors act within days as they reach their level (mechanism-based ones persist until new enzyme forms); inducers take 1 to 3 weeks to build up and to wear off, because enzyme must be made or lost.
| | Inhibitor | Inducer |
|---|---|---|
| Effect on substrate | Level rises | Level falls |
| Onset | Days | 1 to 3 weeks |
| Offset | Days (longer if irreversible) | 1 to 3 weeks |
| Example | Fluvoxamine raises clozapine | Carbamazepine lowers quetiapine |
| Risk | Toxicity | Treatment failure; toxicity when the inducer stops |
### The hidden danger
When an inducer is stopped (someone quits smoking, carbamazepine is withdrawn), levels of the other drug rise over weeks.
:::

:::qa How does smoking affect psychiatric medicines, and what should happen when someone stops? [beginner]
### Short answer
Hydrocarbons in tobacco smoke induce CYP1A2, lowering levels of clozapine, olanzapine, duloxetine, agomelatine, fluvoxamine and some others. Nicotine itself does not. Stopping smoking removes the induction over about a week, so levels rise.
### Plan
- Check a clozapine level before stopping if possible.
- Reduce clozapine by about a quarter over a week, recheck the level, and expect further reductions.
- Ask about smoking at admission, discharge and every review.
:::

:::qa Work through the half-life, steady state and washout of a medicine. [beginner]
### Short answer
With first-order kinetics, the level after each half-life halves. Steady state with regular dosing is reached after about 4 to 5 half-lives; washout after stopping takes the same.
### Worked example
A drug with a half-life of 24 hours:
1. Steady state after about 4 to 5 days.
2. After stopping: 50% left at 1 day, 25% at 2, 12.5% at 3, about 3% at 5 days.
3. If clearance halves (inhibitor, kidney decline), half-life doubles to 48 hours and the steady level doubles.
:::

:::qa When and why is a loading dose used? [beginner]
### Short answer
A loading dose is used when a drug with a long half-life must reach its target level quickly. It fills the volume of distribution at once; maintenance doses then replace what is cleared.
### Examples
- Valproate loading in acute mania.
- Paliperidone palmitate's two deltoid injections a week apart.
- Aripiprazole monthly's two-injection start.
### Caution
Loading increases early side effects, and is avoided where slow titration is needed for safety (lamotrigine, clozapine).
:::

:::qa How does pregnancy change pharmacokinetics, and what follows for psychiatric medicines? [beginner]
### Short answer
Pregnancy increases blood volume and kidney clearance, raises CYP2D6, CYP3A4 and UGT activity, lowers CYP1A2, and lowers albumin.
| Drug | Change in pregnancy | After delivery |
|---|---|---|
| Lithium | Levels fall | Levels rise sharply |
| Lamotrigine | Levels fall a lot | Levels rise within days |
| Clozapine, olanzapine | Levels may rise (CYP1A2 down) | Fall back |
| SSRIs cleared by CYP2D6 | Levels may fall late in pregnancy | Rise back |
### Practice
More frequent levels where available, planned dose changes after birth, and close clinical review.
:::

:::qa How should medicines be adjusted in liver disease? [beginner]
### Short answer
Liver disease reduces CYP metabolism, albumin and first-pass extraction (blood may bypass the liver), so levels of many drugs rise. Phase II (glucuronidation) is relatively spared.
### Practical choices
- Benzodiazepines: lorazepam or oxazepam rather than diazepam or chlordiazepoxide.
- Avoid duloxetine and agomelatine; use caution with valproate.
- Start low with SSRIs (sertraline, escitalopram at lower doses).
- Watch for hepatic encephalopathy worsened by sedatives.
- Lithium is not metabolised by the liver, but fluid shifts and diuretics in cirrhosis make levels unstable.
:::

:::qa How should medicines be adjusted in kidney disease? [beginner]
### Short answer
Drugs or active metabolites cleared mainly by the kidneys accumulate and need lower doses or alternatives.
| Drug | Action |
|---|---|
| Lithium | Avoid or use with specialist input and close levels |
| Paliperidone, amisulpride | Reduce dose |
| Pregabalin, gabapentin | Reduce dose |
| Desvenlafaxine, venlafaxine | Reduce dose |
| Most SSRIs, mirtazapine | Usually fine at lower starting doses |
:::

:::qa Explain protein binding and when it matters clinically. [beginner]
### Short answer
Only free drug acts and is cleared. Binding changes matter when a drug is highly bound, has a narrow range and a small volume, or when labs measure total levels while free levels change.
### When it matters
- Low albumin (malnutrition, liver disease, pregnancy, old age): more free valproate and phenytoin.
- Saturable binding at high valproate doses.
- Displacement interactions are usually short-lived, because more free drug is also cleared faster.
:::

:::qa How would you explain a "therapeutic window" with nortriptyline? [beginner]
### Short answer
For most drugs, more is better up to a plateau. For nortriptyline, response is best within a middle range of levels and can fall above it. This inverted pattern is a therapeutic window, and it is one reason levels are useful for nortriptyline.
:::

:::qa What special kinetic issues apply to depot antipsychotics? [beginner]
### Short answer
Release from the injection site is slower than elimination (flip-flop kinetics), so the apparent half-life is long; steady state takes months; loading doses or oral cover are needed; dose changes take months to show; and effects linger after stopping.
:::

:::qa Why are drug interactions so common in Indian clinical practice? [beginner]
### Short answer
Patients often see several doctors, buy medicines over the counter, take fixed-dose combinations, use traditional remedies, and are treated for tuberculosis (rifampicin), malaria (QT-prolonging antimalarials) and infections (macrolides, fluoroquinolones). Tobacco use is common.
### Good practice
Ask for every strip and bottle, including Ayurvedic and homeopathic remedies; check interactions; avoid unnecessary combinations; and communicate with other prescribers.
:::

:::qa How do the main CYP enzymes relate to common psychiatric drugs? [beginner]
### Short answer
| Enzyme | Key substrates | Key inhibitors | Key inducers |
|---|---|---|---|
| CYP1A2 | Clozapine, olanzapine, duloxetine, agomelatine | Fluvoxamine, ciprofloxacin | Smoking |
| CYP2D6 | Tricyclics, paroxetine, fluoxetine, aripiprazole, risperidone, vortioxetine | Fluoxetine, paroxetine, bupropion | None important |
| CYP2C19 | Citalopram, escitalopram, diazepam | Fluvoxamine, omeprazole | Rifampicin |
| CYP3A4 | Quetiapine, lurasidone, cariprazine, alprazolam, carbamazepine | Clarithromycin, ketoconazole, grapefruit | Carbamazepine, rifampicin, St John's wort |
:::

## 6.5 Q&A bank · Advanced [core][advanced]

:::qa Derive and apply the relationship between half-life, volume of distribution and clearance. [advanced]
### Short answer
For first-order kinetics, the elimination rate constant k = CL ÷ Vd, and half-life = ln 2 ÷ k = 0.693 × Vd ÷ CL.
### Applications
1. Old age: Vd of fat-soluble drugs rises and clearance falls, so half-life lengthens (diazepam).
2. Kidney decline: lithium clearance falls, half-life and steady level rise.
3. Inhibitors: clearance falls, half-life and level rise.
4. Dialysis works for drugs with small Vd and low binding (lithium), not for drugs with huge Vd (tricyclics).
### Caution
Half-life alone does not tell you clearance: two drugs with the same half-life can have very different clearance if their Vd differs.
:::

:::qa Explain occupancy theory and how it explains the flat dose-response of SSRIs and antipsychotics. [advanced]
### Short answer
Occupancy follows C ÷ (C + Kd), a hyperbola. Usual doses of SSRIs occupy about 80% of SERT, and antipsychotics about 65 to 80% of D2, near the plateau. Further increases add little occupancy but more off-target and on-target side effects.
### Implications
- Flat average dose-response in depression above starting doses.
- Movement side effects appear above about 80% D2 occupancy.
- Tapering must slow at low doses, where occupancy changes steeply.
- PET imaging links dose, level and occupancy, making rational dosing possible.
:::

:::qa Distinguish affinity, efficacy and potency with examples. [advanced]
### Short answer
| Property | Meaning | Example |
|---|---|---|
| Affinity | How tightly a drug binds (Kd) | Aripiprazole binds D2 very tightly |
| Efficacy | The response the bound drug produces | Aripiprazole's D2 efficacy is low (partial agonist) |
| Potency | Dose or concentration for a given effect | Haloperidol is potent; chlorpromazine is not |
### Key insight
High affinity with low efficacy (aripiprazole) produces a drug that displaces dopamine yet keeps some signal: a stabiliser. Potency depends on both affinity and efficacy, plus kinetics.
:::

:::qa How do spare receptors and receptor reserve change what a partial agonist does? [advanced]
### Short answer
Where reserve is large, a partial agonist can occupy enough receptors to produce a near-maximal response; where reserve is small, it produces a small response and blocks full agonists. Its effect therefore depends on the tissue and on receptor numbers, which change with disease and chronic treatment.
### Examples
- Buprenorphine: strong analgesia in some systems, yet blocks other opioids.
- Aripiprazole: more agonist-like at presynaptic D2 autoreceptors, more antagonist-like in an overactive mesolimbic pathway.
- After D2 up-regulation (chronic blockade), aripiprazole's partial agonism can feel stimulating: rebound and akathisia on switching.
:::

:::qa Explain inverse agonism and constitutive activity, and why they matter. [advanced]
### Short answer
Some receptors signal without any messenger (constitutive activity). An antagonist leaves this resting activity unchanged; an inverse agonist reduces it. Many clinically used "antagonists" are inverse agonists in experimental systems.
### Relevance
- Pimavanserin's 5-HT2A inverse agonism treats Parkinson's psychosis.
- Inverse agonism at H1 may explain strong sedation with some antihistamines.
- Chronic inverse agonism can up-regulate receptors, with rebound on stopping.
- Benzodiazepine-site inverse agonists cause anxiety and seizures, showing that the GABA-A receptor can be pushed in either direction.
:::

:::qa How do G protein-coupled receptor signalling and adaptation explain delayed drug effects and withdrawal? [advanced]
### Short answer
Drugs change second messengers within seconds, but these trigger kinase cascades, transcription factors (CREB) and gene expression (BDNF, receptor proteins) over days to weeks. The brain then adapts: desensitisation, down-regulation or up-regulation. These slow changes underlie delayed benefit, tolerance and withdrawal.
### Examples
- SSRIs: 5-HT1A autoreceptor desensitisation, BDNF rise, then mood improvement.
- Benzodiazepines: GABA-A uncoupling and glutamate up-regulation, then withdrawal.
- Antipsychotics: D2 up-regulation, then supersensitivity and tardive dyskinesia.
:::

:::qa Discuss non-linear pharmacokinetics in psychiatric drugs. [advanced]
### Short answer
When elimination or binding saturates, levels rise disproportionately with dose and half-life lengthens.
| Drug | Mechanism | Practical point |
|---|---|---|
| Paroxetine, fluoxetine | Self-inhibition of CYP2D6 | Larger level rises at higher doses; slow washout |
| Valproate | Saturable albumin binding | Free fraction rises at high levels |
| Clozapine | Saturable metabolism at high levels | Level jumps with small dose increases |
| Alcohol, phenytoin | Zero-order elimination | Small dose increases, big level changes |
:::

:::qa Explain redistribution and multi-compartment kinetics using benzodiazepines. [advanced]
### Short answer
After a dose, fat-soluble drugs first reach blood and brain, then move into fat and muscle. The fast early fall in brain levels is redistribution; the slower later fall is elimination.
### Consequences
- Single-dose diazepam acts briefly despite a long elimination half-life.
- Repeated doses saturate fat, so accumulation follows the long half-life.
- Lorazepam's lower fat solubility gives a longer single-dose effect in status epilepticus.
- Anaesthetic induction agents work on the same principle.
:::

:::qa How do mechanism-based inhibition and induction through nuclear receptors work? [advanced]
### Short answer
Mechanism-based inhibitors are metabolised by the enzyme into reactive forms that bind it permanently; recovery needs new enzyme (days). Inducers bind nuclear receptors (PXR, CAR, AhR), increasing transcription of CYP and transporter genes over 1 to 3 weeks.
### Examples
- Paroxetine (CYP2D6) and clarithromycin (CYP3A4): mechanism-based.
- Rifampicin, carbamazepine, St John's wort: PXR inducers of CYP3A4 and P-glycoprotein.
- Tobacco smoke: AhR inducer of CYP1A2.
### Clinical impact
Interaction effects outlast the presence of the inhibitor; induction must be planned for when starting and stopping.
:::

:::qa Critically discuss pharmacogenomic testing in psychiatry. [advanced]
### Short answer
Testing CYP2D6 and CYP2C19 can guide dosing for some antidepressants and antipsychotics, and HLA testing prevents serious carbamazepine reactions. Trials of genotype-guided antidepressant prescribing show modest improvements in remission, mostly from avoiding mismatches. Limitations include phenoconversion, small effect sizes, cost, variable commercial reports and the inability to predict efficacy.
### Balanced use
- Strongly recommended: HLA-B*15:02 before carbamazepine in at-risk populations.
- Reasonable: after several failures or intolerance at low doses.
- Not useful: choosing a first antidepressant by "colour codes" alone.
- Indian context: high CYP2C19 poor metaboliser frequency makes citalopram and escitalopram dosing especially relevant.
:::

:::qa How do you interpret a CYP2D6 activity score report? [advanced]
### Short answer
Each allele has an activity value (normal 1, reduced 0.25 or 0.5, none 0; duplications multiply). The total gives the phenotype: 0 poor, 0.25 to 1 intermediate, 1.25 to 2.25 normal, above 2.25 ultrarapid.
### Example
*1/*4: 1 + 0 = 1, an intermediate metaboliser. With paroxetine on board (a strong inhibitor), treat as a poor metaboliser.
### Action
Use the phenotype, adjusted for inhibitors, to guide doses of CYP2D6-dependent drugs such as aripiprazole, vortioxetine and tricyclics.
:::

:::qa How should the size of a treatment effect be judged? [advanced]
### Short answer
Look at absolute effects (risk difference, NNT and NNH), standardised mean differences with confidence intervals, the population studied, the comparator, trial length and outcomes that matter to patients.
### Pitfalls
- Relative risks exaggerate small absolute changes.
- Short trials miss relapse prevention benefits and late harms.
- Averages hide subgroups with large or no benefit.
- Publication bias and sponsorship inflate effects.
### Example
Antidepressants against placebo: SMD about 0.3, NNT about 6 to 9 for response; antipsychotics in relapse prevention: NNT about 3 over a year.
:::

:::qa How would you apply kinetic principles to a patient whose clozapine level doubled without a dose change? [advanced]
### Short answer
Think of anything that reduced clearance: stopping smoking, a new CYP1A2 inhibitor (fluvoxamine, ciprofloxacin), infection or inflammation, liver impairment, or, rarely, a sample taken too soon after a dose.
### Steps
1. Ask about smoking, new drugs, infections, caffeine changes.
2. Check timing of the sample.
3. Look at the clozapine to norclozapine ratio for clues (a rise suggests inhibition or saturation).
4. Reduce the dose if toxic or at risk; treat the cause; recheck.
5. Watch for seizures, sedation, low blood pressure and constipation.
:::

:::qa How do regulators decide that a generic is equivalent, and why does it matter for narrow-range drugs? [advanced]
### Short answer
Generics must show bioequivalence: the 90% confidence interval for the ratio of key exposure measures (peak level and area under the curve) falls within set limits (commonly 80 to 125%). For most drugs this is clinically trivial. For narrow therapeutic index drugs (lithium, carbamazepine, lamotrigine, clozapine), even small shifts can matter, so some regulators set tighter limits and clinicians recheck levels after switching brands.
:::

:::qa Why do approvals of psychiatric medicines differ between the US and India, and what does that mean for students? [advanced]
### Short answer
Regulators weigh evidence and local needs differently, companies apply at different times, and local trials may be required. Many recent US approvals (xanomeline with trospium in September 2024, zuranolone in 2023, a once-monthly subcutaneous olanzapine injection in October 2026) were not available in India in late 2026.
### For students
Learn mechanisms and evidence for new drugs, but base practice on what is approved and available locally, and check current status rather than relying on memory.
:::
`;

const test = String.raw`
## 6.6 Module test [core]
:::mcq
Q: Pharmacodynamics is best described as:
- What the body does to a drug
- *What a drug does to the body
- How drugs are made
- How drugs are priced
> Targets and effects.

Q: Which route avoids the first pass?
- Tablet
- Syrup
- *Sublingual
- Capsule
> Absorbed directly into the systemic circulation.

Q: Asenapine must be dissolved under the tongue because:
- It tastes bitter
- *Swallowed, nearly all is lost on the first pass
- It is a depot
- It damages the stomach
> Oral bioavailability is very low.

Q: Lithium is efficiently removed by haemodialysis because:
- It is highly protein-bound
- *It has a small volume of distribution and no protein binding
- It is metabolised by the liver
- It is fat-soluble
> Dialysis clears what is in the blood.

Q: Which area outside the blood-brain barrier explains prolactin rise with amisulpride?
- Hippocampus
- *Pituitary
- Prefrontal cortex
- Striatum
> The pituitary sees blood levels directly.

Q: A heavy smoker on olanzapine stops smoking. Olanzapine levels will likely:
- Fall
- *Rise over about a week
- Stay the same
- Fall to zero
> CYP1A2 induction is lost.

Q: Which is a strong CYP3A4 inducer commonly used in India?
- Omeprazole
- *Rifampicin
- Paracetamol
- Metformin
> Tuberculosis treatment.

Q: Half-life equals:
- Dose ÷ clearance
- *0.693 × volume of distribution ÷ clearance
- Clearance × volume
- Bioavailability ÷ dose
> Larger Vd or lower clearance lengthens it.

Q: If clearance halves at the same dose, the steady-state level:
- Halves
- *Doubles
- Stays the same
- Becomes unpredictable always
> Steady level = dose rate ÷ clearance.

Q: Time to steady state depends on:
- The dose
- *The half-life
- The route only
- The brand
> About 4 to 5 half-lives.

Q: A loading dose is calculated as:
- Clearance × dose
- *Target level × volume of distribution ÷ bioavailability
- Half-life × dose
- Dose ÷ volume
> It fills the volume quickly.

Q: The best time to take a lithium level is:
- Two hours after a dose
- *About 12 hours after the last dose, at steady state
- Any time
- Immediately after a dose change
> Trough at steady state.

Q: In pregnancy, lamotrigine levels usually:
- Rise
- *Fall, then rise again quickly after delivery
- Stay the same
- Become zero
> Glucuronidation rises in pregnancy.

Q: In liver disease, the preferred benzodiazepine is:
- Diazepam
- *Lorazepam
- Chlordiazepoxide
- Alprazolam
> Glucuronidation is relatively preserved.

Q: An inverse agonist:
- Turns a receptor fully on
- Blocks it without effect
- *Lowers it below resting activity
- Destroys the receptor
> Needs constitutive activity to act.

Q: A positive allosteric modulator:
- Binds the messenger site and turns it on
- *Binds a separate site and increases the messenger's effect
- Destroys the messenger
- Always acts alone
> Benzodiazepines at GABA-A.

Q: Potency describes:
- The maximum effect
- *The dose needed for an effect
- The half-life
- Bioavailability
> EC50.

Q: Which receptor uses Gq signalling?
- D2
- 5-HT1A
- *5-HT2A
- Alpha-2
> Phospholipase C, IP3 and DAG.

Q: Paroxetine shows non-linear kinetics because it:
- Is renally cleared
- *Inhibits its own CYP2D6 metabolism
- Is poorly absorbed
- Has a tiny volume of distribution
> Self-inhibition.

Q: Single-dose diazepam wears off quickly mainly because of:
- Rapid elimination
- *Redistribution into fat
- Kidney excretion
- Protein binding
> Elimination half-life is long.

Q: Mechanism-based inhibition means:
- An inhibitor that acts only in the gut
- *Permanent inactivation of the enzyme until new enzyme is made
- Induction through PXR
- Displacement from proteins
> Paroxetine at CYP2D6.

Q: A CYP2D6 activity score of 0 indicates:
- Ultrarapid metaboliser
- Normal metaboliser
- Intermediate metaboliser
- *Poor metaboliser
> No functional alleles.

Q: A normal CYP2D6 metaboliser on bupropion should be treated as:
- An ultrarapid metaboliser
- *A poor metaboliser for CYP2D6 drugs
- A normal metaboliser
- Unaffected
> Phenoconversion.

Q: An NNT of 3 means:
- Three people are harmed for each benefit
- *Three people must be treated for one extra good outcome
- The drug works in 3%
- Three doses are needed
> Lower NNT, bigger benefit.

Q: Which body approves new drugs in India?
- FDA
- EMA
- *CDSCO
- WHO
> Central Drugs Standard Control Organisation.

Q: Why recheck levels after switching lithium brands?
- Brands always contain different drugs
- *Release patterns differ and lithium's range is narrow
- Generics are illegal
- It is never needed
> Narrow therapeutic index.
:::
`;

export const examZone = exam + qa + test;
