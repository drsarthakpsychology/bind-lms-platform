/* Module · Brain and behaviour, new Advanced sections: neuroendocrine tests, sleep and circadian biology in psychiatry, neuroimaging and psychophysiology by disorder, neuroinflammation and the gut-brain axis. Original text written for VIBHA School of Psychology. */

export const advEndocrine = String.raw`
## 6.1 Neuroendocrine tests and hormones in psychiatry [core][advanced]
From the 1970s to the 1990s, psychiatrists hoped that hormone "challenge tests" would become blood tests for depression. They did not, but the findings shaped biological theories, still appear in every postgraduate psychiatry and psychology syllabus, and a few remain clinically useful. Learn each test as a protocol, a finding, and a reason it failed as a diagnostic tool.

### The dexamethasone suppression test (DST)
**The logic**: dexamethasone is a potent synthetic steroid that acts on pituitary glucocorticoid receptors and should switch off ACTH and therefore cortisol for about a day. If cortisol "escapes", feedback is weak.

| Step | Protocol |
|---|---|
| 1 | 1 mg dexamethasone by mouth at 11 pm |
| 2 | Plasma cortisol next day at 4 pm and 11 pm (some protocols add 8 am) |
| 3 | Cortisol above about 5 micrograms per decilitre at any point means **non-suppression** |

**Findings** (Bernard Carroll's work from the late 1970s):
- Non-suppression in about **40 to 60 per cent** of inpatients with melancholic depression, higher still in **psychotic depression**, and in about 20 to 40 per cent of outpatients.
- It tends to **normalise with recovery**; persistent non-suppression after apparent recovery predicts **relapse**.

**Why it failed as a test**:
- **Low specificity**: non-suppression also occurs in mania, dementia, anorexia nervosa and weight loss, alcohol use and withdrawal, acute stress, pregnancy, Cushing's syndrome and severe physical illness.
- **Drug interference**: enzyme inducers (carbamazepine, phenytoin, barbiturates) clear dexamethasone faster, giving **false positives**; high-dose benzodiazepines and steroids can give false negatives.
- **Low sensitivity** in outpatients.

The **combined dexamethasone and CRH test** (Florian Holsboer's group) is more sensitive to HPA dysregulation but remains a research tool.

:::widget stress
{
 "caption": "Picture the DST on this loop: dexamethasone acts at the pituitary like a strong dose of cortisol. In a healthy person ACTH and cortisol fall and stay low. In melancholic depression, with weaker glucocorticoid receptor feedback and high CRH drive, cortisol escapes by the next afternoon."
}
:::

### PTSD: the opposite pattern
Rachel Yehuda's studies found that many people with chronic **PTSD** have **normal or low** baseline cortisol, **more** glucocorticoid receptor sensitivity, and **exaggerated suppression** on a low-dose DST: an oversensitive brake rather than a weak one. Exams like this contrast.

:::widget compare
{
 "title": "HPA patterns: melancholic depression versus chronic PTSD",
 "a": {
  "label": "Melancholic depression",
  "points": ["High cortisol over 24 hours", "Raised CSF CRH", "Blunted ACTH response to CRH (pituitary downregulated)", "Non-suppression on the 1 mg DST", "Weak glucocorticoid receptor feedback"],
  "summary": "The brake is weak."
 },
 "b": {
  "label": "Chronic PTSD",
  "points": ["Normal or low baseline cortisol", "Raised CSF CRH (in some studies)", "More glucocorticoid receptors on white cells", "Exaggerated suppression on a low-dose DST", "Enhanced negative feedback"],
  "summary": "The brake is oversensitive."
 },
 "caption": "Both show high central CRH drive, yet opposite feedback: a reminder that 'stress hormone' findings are disorder-specific."
}
:::

### The TRH stimulation test
| Step | Protocol |
|---|---|
| 1 | Baseline TSH in the morning |
| 2 | 500 micrograms of TRH (protirelin) intravenously |
| 3 | TSH at 15, 30, 60 and 90 minutes |
| Interpretation | A normal rise is about 5 to 25 units above baseline. A rise **below about 5 to 7** is **blunted**. A rise **above about 25 to 35** is **exaggerated** and suggests **subclinical hypothyroidism** |

**Findings**: a **blunted** TSH response in about **a quarter** of euthyroid depressed patients, probably because the pituitary's TRH receptors are downregulated by excessive hypothalamic TRH (CSF TRH is raised in some depressed patients). Unlike the DST, blunting often **persists after recovery** and has been linked to a higher relapse risk. Blunting also occurs in alcohol use disorder and some other conditions. An **exaggerated** response identifies hidden thyroid failure, which can make depression resistant to treatment; the test was used for this, and in suspected lithium-induced hypothyroidism, before sensitive TSH assays made it largely unnecessary.

### Growth hormone and prolactin challenges
- **Clonidine** (an alpha-2 agonist) normally raises growth hormone. The response is **blunted** in depression, and in panic and generalised anxiety disorder, suggesting reduced sensitivity of postsynaptic alpha-2 receptors in the hypothalamus. Sleep-related growth hormone release is also reduced in depression.
- **Fenfluramine** (which releases serotonin) normally raises **prolactin**. A blunted response was found in depression, in impulsive aggression and in people who had made suicide attempts, supporting a serotonin deficit in impulsivity. Fenfluramine was later withdrawn because it damaged heart valves (through 5-HT2B receptors).

:::widget sort
{
 "prompt": "Which test and which finding?",
 "buckets": ["DST non-suppression", "Exaggerated DST suppression", "Blunted TSH to TRH", "Blunted GH to clonidine", "Blunted prolactin to fenfluramine"],
 "items": [
  { "text": "A 58-year-old with psychotic depression; cortisol at 4 pm after dexamethasone is high", "bucket": 0 },
  { "text": "A veteran with chronic PTSD whose cortisol falls very low after a small dexamethasone dose", "bucket": 1 },
  { "text": "A euthyroid depressed woman whose TSH barely rises after protirelin, and stays so after recovery", "bucket": 2 },
  { "text": "Evidence for reduced postsynaptic alpha-2 receptor sensitivity in depression and panic", "bucket": 3 },
  { "text": "Evidence linking low serotonin function to impulsive aggression and suicide attempts", "bucket": 4 }
 ]
}
:::

### Hormones as treatment and as cause
| Situation | What to know |
|---|---|
| **Lithium and the thyroid** | Hypothyroidism (clinical or subclinical) in a substantial minority, commoner in women and with thyroid antibodies; goitre; check TSH before starting and about every six months. Lithium also raises calcium through the parathyroid glands |
| **T3 augmentation** | Liothyronine 25 to 50 micrograms added to an antidepressant; in the STAR*D trial its remission rate was similar to lithium augmentation and it was better tolerated |
| **High-dose T4 in rapid cycling** | Used in some rapid-cycling bipolar disorder, which is itself associated with subclinical hypothyroidism |
| **Steroid psychiatric reactions** | Dose-related, mostly in the first weeks: risk rises steeply above about 40 mg of prednisolone a day; mania and mixed states early, depression on withdrawal |
| **Premenstrual dysphoric disorder** | Hormone levels are normal; affected women are abnormally **sensitive** to normal hormone changes (symptoms vanish when the cycle is suppressed and return when hormones are added back); SSRIs work within days, even when taken only in the luteal phase |
| **Postpartum depression** | The sharp fall in progesterone and its neurosteroid metabolite allopregnanolone; brexanolone and zuranolone act at GABA-A receptors |
| **Perimenopausal depression** | Transdermal oestradiol helps some women in the perimenopause, though not after it |
| **Hormonal contraception** | A Danish registry study found a small rise in first antidepressant use, highest in adolescents; the absolute risk is low |
| **Anabolic steroids** | Irritability, aggression, mania; depression and suicidality on withdrawal |
| **Antiandrogens** | Used with consent in some paraphilic disorders to reduce sexual drive (cyproterone, GnRH agonists) |

### Anorexia nervosa: the endocrine picture of starvation
High cortisol (with DST non-suppression), **low T3** with normal TSH (a "sick euthyroid" adaptation), **low LH and FSH** with loss of periods (hypothalamic amenorrhoea), **high growth hormone with low IGF-1** (resistance), **high ghrelin**, low leptin, and thin bones. Most normalise with weight restoration; giving hormones is not the treatment.

### Interpreting prolactin
- Normal is roughly **below 25 ng/mL in women and 20 in men**.
- **Antipsychotic-induced** rises are usually below about 100 ng/mL (amisulpride and risperidone can go higher); **above about 200** suggests a **prolactinoma**.
- Rule out pregnancy, hypothyroidism, kidney disease and **macroprolactin** (a large, inactive form that gives a falsely high result).

:::widget decide
{
 "scene": "Mr Iyer, 46, in Chennai, has bipolar disorder well controlled on lithium for eight years. He now feels slowed, cold and low; his psychiatrist plans to add an antidepressant. His last thyroid test was three years ago.",
 "ask": "What should come first?",
 "choices": [
  { "label": "Check TSH, free T4, calcium, renal function and a lithium level before changing anything", "verdict": "best", "outcome": "TSH is high: lithium-induced hypothyroidism. Levothyroxine is added, lithium continued, and his mood and energy recover without an antidepressant that might have destabilised him.", "why": "Lithium commonly causes hypothyroidism, which mimics depression; an antidepressant could trigger a switch or rapid cycling." },
  { "label": "Add an SSRI and review in a month", "verdict": "harm", "outcome": "He becomes irritable and sleepless within weeks.", "why": "Treating a hormonal cause with an antidepressant misses it and adds switch risk in bipolar disorder." },
  { "label": "Stop lithium because it is causing depression", "verdict": "harm", "outcome": "He relapses into mania two months later.", "why": "Hypothyroidism is treatable while continuing an effective mood stabiliser; abrupt lithium withdrawal raises relapse risk." }
 ]
}
:::

:::clinician
Carroll's 1981 standardised DST reported sensitivity around 40 to 50 per cent and specificity around 90 per cent for melancholia in selected inpatients, but specificity fell to near 70 per cent in heterogeneous psychiatric samples, ending clinical use. Non-suppressors may respond better to biological treatments, and HPA normalisation (on dex/CRH) predicted sustained remission in some studies; glucocorticoid receptor antagonism (mifepristone) was trialled in psychotic depression with mixed results. Low-dose (0.5 mg) DST and enhanced suppression in PTSD reflect increased glucocorticoid receptor responsiveness; FKBP5 genotype and methylation modify this. In anorexia, hypercortisolaemia and low IGF-1 contribute to osteoporosis; oestrogen replacement does not restore bone without weight gain. Subclinical hypothyroidism is associated with poorer antidepressant response and with lithium-associated rapid cycling. In endocrinology, the overnight 1 mg DST screens for Cushing's syndrome with a much lower cut-off (about 1.8 micrograms per decilitre); do not confuse the two uses. Hyperprolactinaemia raises long-term risks of osteoporosis and possibly breast cancer; aripiprazole adjunct (5 to 10 mg) lowers antipsychotic-induced prolactin.
:::

:::recall
1. Give the DST protocol and its cut-off. || 1 mg dexamethasone at 11 pm; cortisol at 4 pm and 11 pm next day; above about 5 micrograms per decilitre is non-suppression.
2. Why did the DST fail as a diagnostic test? || Low specificity (many conditions and drugs cause non-suppression) and low sensitivity in outpatients.
3. How do HPA findings in PTSD differ from depression? || PTSD: normal or low cortisol and exaggerated suppression (enhanced feedback); depression: high cortisol and non-suppression.
4. Describe the TRH stimulation test and its two abnormal results. || 500 micrograms TRH IV, TSH at 15 to 90 minutes; blunted rise (below about 5 to 7) in about a quarter of depressed patients; exaggerated rise (above about 25 to 35) in subclinical hypothyroidism.
5. What does a blunted GH response to clonidine suggest? || Reduced postsynaptic alpha-2 receptor sensitivity, in depression and anxiety disorders.
6. What is the endocrine picture of anorexia nervosa? || High cortisol, low T3, low LH and FSH, high GH with low IGF-1, high ghrelin, low leptin.
:::

:::mcq
Q: In the dexamethasone suppression test, a significant proportion of patients with melancholic depression show:
- Exaggerated suppression of cortisol
- *Failure to suppress cortisol (escape) the next day
- No cortisol at all
- A blunted prolactin response
> Non-suppression reflects weak feedback.

Q: A false-positive DST (non-suppression without depression) is especially likely in a patient taking:
- Sertraline
- *Carbamazepine
- Lithium
- Propranolol
> Enzyme induction speeds dexamethasone clearance.

Q: Read the assertion and reason. Assertion (A): Blunted TSH response to TRH is found in about a quarter of euthyroid depressed patients. Reason (R): Excess hypothalamic TRH may downregulate pituitary TRH receptors.
- *Both A and R are true, and R is the correct explanation of A
- Both A and R are true, but R is not the correct explanation of A
- A is true, but R is false
- A is false, but R is true
> Raised CSF TRH supports this explanation.

Q: In chronic PTSD, the low-dose DST typically shows:
- Non-suppression
- *Exaggerated suppression
- No change
- A rise in cortisol
> Enhanced glucocorticoid feedback.

Q: A prolactin of 280 ng/mL in a woman on a low dose of aripiprazole most suggests:
- A typical antipsychotic effect
- *A prolactinoma or other non-drug cause that needs investigation
- Normal pregnancy only
- Laboratory error that can be ignored
> Aripiprazole usually lowers prolactin; very high values need work-up.
:::
`;

export const advSleep = String.raw`
## 6.2 Sleep and circadian biology for the psychiatrist [core][advanced]
Almost every psychiatric disorder disturbs sleep, and disturbed sleep worsens almost every disorder. At this level you need the sleep laboratory findings in each disorder, the molecular clock, the chronotherapies that act within days, and how medicines change sleep architecture.

### The molecular clock
Inside nearly every cell, and most tightly in the SCN, a **transcription-translation feedback loop** keeps a roughly 24-hour rhythm:
1. Two proteins, **CLOCK and BMAL1**, pair up and switch on the **Period (PER)** and **Cryptochrome (CRY)** genes.
2. PER and CRY proteins build up, enter the nucleus and **switch off** CLOCK and BMAL1.
3. PER and CRY are slowly degraded (timed by kinases such as casein kinase 1 and GSK-3), releasing the brake, and the cycle restarts.
4. Light reaches the SCN through melanopsin cells and resets the loop by inducing PER.

:::widget figure
{"id": "sleep-centres", "focus": ["scn", "pineal"]}
:::

Jeffrey Hall, Michael Rosbash and Michael Young shared the 2017 Nobel Prize for discovering this loop in fruit flies.

:::widget flow
{
 "title": "The core clock loop",
 "layout": "cycle",
 "nodes": [
  { "id": "a", "label": "CLOCK and BMAL1 switch genes on", "detail": "They bind 'E-box' sequences in PER and CRY genes." },
  { "id": "b", "label": "PER and CRY proteins accumulate", "detail": "Over the day, in the cytoplasm." },
  { "id": "c", "label": "PER and CRY switch CLOCK and BMAL1 off", "detail": "Negative feedback in the nucleus." },
  { "id": "d", "label": "PER and CRY are degraded", "detail": "Kinases (casein kinase 1, GSK-3) time the breakdown. Lithium inhibits GSK-3 and lengthens the period." },
  { "id": "e", "label": "The brake lifts", "detail": "About 24 hours after the start, the loop restarts. Morning light resets the phase." }
 ],
 "caption": "Where might a mood stabiliser act on the clock? (GSK-3, at the degradation step.)"
}
:::

**Clinical genetics of the clock**: a PER2 mutation causes **familial advanced sleep phase** (sleeping at 7 pm, waking at 3 am); a CRY1 variant is linked to delayed sleep phase. Mice with a mutated CLOCK gene are hyperactive, sleep less and show mania-like reward seeking, reversed by **lithium**.

:::widget figure
{"id": "two-process-sleep"}
:::

### Sleep in depression
:::widget hypnogram
{}
:::

| Finding | Detail |
|---|---|
| Insomnia | In about three-quarters; early morning waking typical of melancholia |
| Hypersomnia | In about a fifth, more in young people, atypical depression and bipolar depression |
| **Short REM latency** | First REM often within about an hour of sleep onset instead of about 90 minutes; also in some unaffected relatives |
| Increased REM density | More eye movements, especially in the first REM period |
| Reduced slow-wave sleep | Especially in the first cycle |
| Insomnia as a cause | Persistent insomnia roughly **doubles** the risk of a later depressive episode; treating it with CBT-I also reduces depressive symptoms |

Short REM latency is **not specific**: it also occurs in schizophrenia, OCD, eating disorders, alcohol withdrawal and, most strikingly, narcolepsy.

:::widget figure
{"id": "hypnogram"}
:::

### Chronotherapy: sleep, light and timing as treatments
- **Total sleep deprivation** ("wake therapy"): keeping a depressed patient awake for one night lifts mood the next day in roughly half, within hours, faster than any medicine except ketamine. Most relapse after the next sleep, so it is combined with **sleep phase advance** (sleeping early for a few nights) and **morning bright light**, and with **lithium** in bipolar depression, a package called **triple chronotherapy**. Risk: a switch into mania in bipolar disorder.
- **Bright light therapy**: about **10,000 lux for 30 minutes soon after waking**; first-line for **seasonal affective disorder** (described by Norman Rosenthal in 1984), effective as an add-on in non-seasonal and bipolar depression. Side effects: headache, eye strain, and occasionally hypomania.
- **Melatonin and agomelatine**: timed melatonin shifts the clock; agomelatine (melatonin agonist plus 5-HT2C antagonist) improves sleep and rhythms in depression and needs liver tests.

:::widget guess
{
 "prompt": "One night of total sleep deprivation brings a rapid improvement in mood the next day in what share of people with depression?",
 "min": 0,
 "max": 100,
 "unit": "per cent",
 "answer": [40, 60],
 "reveal": "About half, often within hours. Unfortunately most relapse after recovery sleep, even a nap, which is why it is combined with phase advance, morning light and lithium to hold the gain.",
 "clinician": "Proposed mechanisms include enhanced monoaminergic and glutamatergic activity, increased synaptic potentiation (reversing a 'saturated' plasticity state in depression), and resetting of circadian phase. Response is better in melancholic and bipolar depression and in patients whose mood improves in the evening (diurnal variation)."
}
:::

### Sleep and circadian rhythm in bipolar disorder
- **Reduced need for sleep** is the most sensitive early warning sign of mania, and **sleep loss** itself can **trigger** mania (Thomas Wehr's observations of switches after nights of lost sleep, including after overnight travel and childbirth).
- The **social zeitgeber theory** (Cindy Ehlers, Ellen Frank and David Kupfer): life events that disrupt daily routines (meals, sleep, contact with people) destabilise the clock and trigger episodes. **Interpersonal and social rhythm therapy** stabilises these routines.
- **Lithium** lengthens the circadian period and inhibits GSK-3; some patients are "phase advanced" when manic and delayed when depressed.

:::widget decide
{
 "scene": "Neha, 24, has bipolar I disorder, stable on lithium. She has been offered a job with rotating night shifts at a call centre in Gurugram that pays well. She asks your opinion.",
 "ask": "What advice best uses circadian biology?",
 "choices": [
  { "label": "Explain that irregular sleep and night work are well-known triggers of relapse, discuss day-shift options or a stable fixed schedule, and build a plan with sleep protection and early warning signs if she accepts", "verdict": "best", "outcome": "She negotiates a fixed evening shift, keeps a regular wake time and a mood and sleep diary, and stays well.", "why": "Social rhythm disruption and sleep loss destabilise bipolar disorder; a respectful, practical plan supports her autonomy and health." },
  { "label": "Tell her she must never work", "verdict": "harm", "outcome": "She feels controlled and stops attending follow-up.", "why": "Work is protective for most people; the problem is irregular sleep, not employment." },
  { "label": "Say it makes no difference while she takes lithium", "verdict": "harm", "outcome": "Within two months of rotating nights she becomes manic.", "why": "Medication lowers but does not remove the risk from repeated sleep loss." }
 ]
}
:::

### Sleep in other disorders
| Disorder | Sleep findings and clinical points |
|---|---|
| **Schizophrenia** | Insomnia often heralds relapse; reduced slow-wave sleep; **reduced sleep spindles**, even in unmedicated and first-episode patients and in relatives, linked to poor memory consolidation |
| **PTSD** | Trauma nightmares in REM; hyperarousal and fragmented sleep; **imagery rehearsal therapy**; prazosin helped in early trials but a large later trial was negative |
| **Anxiety disorders** | Difficulty falling asleep; nocturnal panic attacks arise from N2 and N3, not from dreams |
| **ADHD** | Delayed melatonin onset and evening chronotype; stimulants can worsen sleep onset |
| **Alcohol use disorder** | Alcohol shortens sleep onset but suppresses REM early and fragments the second half; in withdrawal, REM rebound and nightmares; persistent insomnia predicts relapse |
| **Dementia** | **Sundowning**; SCN degeneration; poor sleep may speed amyloid build-up (clearance falls); **REM sleep behaviour disorder** precedes Lewy body dementia and Parkinson's by years |
| **Suicide** | Insomnia and nightmares are independent risk factors; ask about them in every risk assessment |

### How medicines change sleep
| Medicine | Effect on sleep |
|---|---|
| Benzodiazepines and Z-drugs | Shorter sleep onset; less N3 and slightly less REM; more N2 and spindles; tolerance and rebound insomnia; Z-drugs can cause complex sleep behaviours |
| Most antidepressants (SSRIs, SNRIs, tricyclics, MAOIs) | **Suppress REM** and lengthen REM latency (MAOIs most); can unmask REM sleep behaviour disorder and worsen restless legs and periodic limb movements; vivid dreams on stopping |
| Mirtazapine, trazodone, low-dose doxepin | Sedating through H1 (and 5-HT2) block; trazodone and mirtazapine increase slow-wave sleep |
| Agomelatine | Resynchronises rhythms without suppressing REM |
| Lithium | Suppresses REM, increases N3 |
| Antipsychotics | Sedation (H1), increased slow-wave sleep with some; weight gain raises sleep apnoea risk; restless legs |
| Stimulants and modafinil | Delay sleep; reduce total sleep |
| Orexin receptor antagonists | Promote sleep with little change in architecture and less next-day impairment |

:::clinician
Kupfer's early reports established REM latency as a candidate biological marker of depression; meta-analyses show effect sizes are moderate and overlap with other disorders, so it is not diagnostic. The delta sleep ratio (slow-wave activity in the first versus second NREM period) is reduced in depression and predicts recurrence in some studies. Wake therapy response correlates with baseline hyperactivity of the anterior cingulate. Light therapy: 10,000 lux for 30 minutes, or 2,500 lux for about two hours, within an hour of waking; check for retinal disease and photosensitising drugs (some antipsychotics, St John's wort, lithium rarely). Bipolar depression: midday light (rather than morning) was used in one trial to reduce switch risk. CBT-I components are sleep restriction, stimulus control, cognitive therapy, relaxation and sleep hygiene education; sleep restriction can trigger hypomania in bipolar disorder and seizures in epilepsy, so modify it. Restless legs: check ferritin (supplement if below about 75 micrograms per litre), avoid sedating antihistamines, mirtazapine and many SSRIs where possible; dopamine agonists cause augmentation over time, so alpha-2-delta ligands are often preferred first.
:::

:::recall
1. Describe the core molecular clock loop. || CLOCK and BMAL1 activate PER and CRY; PER and CRY proteins inhibit CLOCK and BMAL1; their kinase-timed degradation restarts the cycle about every 24 hours.
2. List four sleep laboratory findings in depression. || Short REM latency, increased REM density, reduced slow-wave sleep (especially first cycle), more waking and early morning waking.
3. What is triple chronotherapy? || Total sleep deprivation plus sleep phase advance plus morning bright light (often with lithium).
4. Give the standard light therapy dose. || About 10,000 lux for 30 minutes soon after waking.
5. What is the social zeitgeber theory? || Life events disrupt daily social rhythms, destabilising the circadian system and triggering mood episodes in vulnerable people.
6. Which sleep finding in schizophrenia is a candidate endophenotype? || Reduced sleep spindles.
7. How do most antidepressants change REM sleep? || They suppress REM and lengthen REM latency.
:::

:::mcq
Q: Which of the following sleep EEG changes are classically reported in major depressive disorder?
- Longer REM latency and more slow-wave sleep
- *Shorter REM latency, increased REM density and reduced slow-wave sleep
- Absent REM sleep
- Increased sleep spindles only
> The classic triad of REM changes plus reduced deep sleep.

Q: Lithium's effect on the circadian clock is thought to involve inhibition of:
- CLOCK gene transcription directly
- *Glycogen synthase kinase 3 (GSK-3)
- Melatonin synthesis
- Orexin receptors
> GSK-3 times the breakdown of clock proteins.

Q: The most common relapse after one night of therapeutic sleep deprivation occurs:
- After several months
- *After the next night's recovery sleep
- Only if antidepressants are stopped
- Never
> Hence the combination with phase advance and light.

Q: A man with bipolar disorder sleeps only three hours for two nights after an overnight flight and then becomes elated and overactive. This illustrates:
- Seasonal pattern
- *Sleep loss as a trigger for mania
- REM rebound
- Antidepressant switch
> Protecting sleep is part of relapse prevention.

Q: Familial advanced sleep phase syndrome has been linked to a mutation in:
- BDNF
- *PER2
- COMT
- APOE
> Very early sleep and waking times run in such families.
:::
`;

export const advImaging = String.raw`
## 6.4 Neuroimaging and psychophysiology by disorder [core][advanced]
6.3 covered when to scan and the limits of imaging. Here are the methods in technical depth and the findings that exams ask for, disorder by disorder, plus the bodily measures (skin conductance, heart rate, startle, eye movements) of psychophysiology.


:::widget brainslicer
{"title":"Read a scan in three planes","start":"slice","caption":"Where would you look for an enlarged ventricle in schizophrenia, or a small hippocampus in depression or Alzheimer disease?"}
:::

### What each method measures
| Method | Physical basis | Resolution | Best psychiatric uses and findings |
|---|---|---|---|
| **CT** | X-ray attenuation | Good spatial, no function | Bleeds, large infarcts, hydrocephalus; the first evidence of **enlarged ventricles** in schizophrenia (Eve Johnstone, 1976) |
| **Structural MRI** | Proton behaviour in a magnetic field. **T1**: CSF dark, good anatomy. **T2**: CSF and oedema bright. **FLAIR**: CSF suppressed, so white matter lesions stand out | About 1 mm | Atrophy patterns, white matter hyperintensities, hippocampal volume |
| **Diffusion tensor imaging (DTI)** | Direction of water diffusion along axons; **fractional anisotropy (FA)** high in healthy tracts | Tract level | **Reduced FA** suggests damaged white matter integrity (myelin or axons); widespread in schizophrenia |
| **Functional MRI (fMRI)** | **BOLD**: deoxyhaemoglobin is paramagnetic; active areas get more oxygenated blood than they use, so signal rises | Millimetres, seconds (the response lags 4 to 6 seconds) | Task activation; resting-state connectivity. BOLD tracks synaptic input (local field potentials) more than spiking output, as Nikos Logothetis showed |
| **MR spectroscopy (MRS)** | Chemical signatures | Centimetre voxels | N-acetylaspartate (neuronal health), glutamate and glutamine, GABA, choline; brain lithium |
| **PET** | Positron-emitting tracers (fluorine-18, carbon-11) | About 4 to 5 mm, minutes | FDG for glucose use; **raclopride** for D2 occupancy and dopamine release; F-DOPA for dopamine synthesis; amyloid and tau tracers |
| **SPECT** | Single-photon tracers, cheaper and more available | Lower than PET | Blood flow (HMPAO); **DaTscan** for the dopamine transporter |
| **EEG and MEG** | Electrical and magnetic fields of synchronised neurons | Milliseconds; poor localisation (MEG better) | Epilepsy, delirium, ERPs, sleep |
| **fNIRS** | Near-infrared light through the skull measuring blood oxygen | Surface cortex only | Infants and children: quiet, portable, tolerant of movement |

The **subtraction method** (Michael Posner, Steven Petersen and Marcus Raichle) compares a task with a control task that differs in one process; Raichle later noticed regions that become **less** active during tasks, the **default mode network**.

:::widget sort
{
 "prompt": "Which method answers the question?",
 "buckets": ["DTI", "PET with raclopride", "MRS", "FDG-PET", "DaTscan SPECT"],
 "items": [
  { "text": "What share of striatal D2 receptors does this dose of risperidone occupy?", "bucket": 1 },
  { "text": "Is the white matter of the arcuate fasciculus less organised in people who hear voices?", "bucket": 0 },
  { "text": "Is glutamate raised in the anterior cingulate in first-episode psychosis?", "bucket": 2 },
  { "text": "Does this 66-year-old with hallucinations and parkinsonism have Lewy body dementia?", "bucket": 4 },
  { "text": "Is temporoparietal glucose use reduced, as in Alzheimer's disease?", "bucket": 3 }
 ]
}
:::

### Schizophrenia
- **Structure**: enlarged lateral and third ventricles; whole-brain volume a few per cent smaller; reduced grey matter in the **superior temporal gyrus** (more with hallucinations), hippocampus, thalamus and prefrontal cortex; thinner cortex; slightly larger pallidum. Some progression around and after onset, partly related to medicines, cannabis and illness duration.
- **Function**: **hypofrontality**: less prefrontal activation during executive tasks such as the Wisconsin Card Sorting Test (Daniel Weinberger), first noted in blood-flow studies by David Ingvar and Göran Franzén; auditory cortex and speech areas activate during hallucinations.
- **Dopamine PET**: **raised presynaptic dopamine synthesis capacity** in the striatum (F-DOPA), present even in people at clinical high risk who later become psychotic; **exaggerated dopamine release** after amphetamine (raclopride displacement, Marc Laruelle and Anissa Abi-Dargham); D2 receptor density itself only slightly raised.
- **MRS**: raised glutamate in early illness, reduced N-acetylaspartate.
- **Psychophysiology**: impaired **smooth pursuit eye movements** (first described in 1908 and revived by Philip Holzman), seen in about half to most patients and many unaffected relatives; more **antisaccade** errors; reduced **prepulse inhibition** of startle (David Braff); reduced P50 gating, mismatch negativity and P300; about half are skin-conductance "non-responders".

### Mood disorders

:::widget figure
{"id": "prefrontal", "focus": ["sgacc", "dlpfc"]}
:::

- **Depression**: smaller **hippocampus**, especially with recurrent and early-onset illness (large ENIGMA consortium data); reduced grey matter and altered metabolism in the **subgenual anterior cingulate**; **amygdala** over-reacts to negative faces; reduced dorsolateral prefrontal activity with increased ventral limbic activity (Helen Mayberg's limbic-cortical dysregulation model), which normalises with response to medicines, CBT or stimulation; reduced striatal response to reward in anhedonia; raised brain MAO-A binding; white matter hyperintensities in late-life depression.
- **Bipolar disorder**: more **deep white matter hyperintensities**, enlarged ventricles, thinner frontal and temporal cortex; **lithium-treated** patients have larger hippocampal and grey matter volumes than those not on lithium; MRS suggests mitochondrial energy problems.

### Anxiety, OCD and PTSD
- **OCD**: hyperactivity in the **orbitofrontal cortex, caudate and anterior cingulate** at rest and on symptom provocation; Lewis Baxter's group showed this normalised after successful treatment with **either fluoxetine or behaviour therapy**, an early demonstration that psychotherapy changes brain function. Large error-related negativity.
- **PTSD**: **smaller hippocampus**; amygdala hyperactivity; reduced ventromedial prefrontal and rostral anterior cingulate activity. Mark Gilbertson's study of identical twins, one of whom went to combat, found that the **unexposed** co-twins of veterans with PTSD also had small hippocampi: a small hippocampus is partly a **pre-existing vulnerability**, not only a result of trauma.
- **Panic disorder**: hypersensitivity to body signals and to carbon dioxide; panic attacks can be provoked by **sodium lactate** infusion (Pitts and McClure, 1967), 35 per cent carbon dioxide, yohimbine, CCK-4 and caffeine. Donald Klein's **false suffocation alarm** theory proposes an oversensitive brainstem CO2 detector.

### Addiction, ADHD and autism
- **Addiction**: Nora Volkow's raclopride PET studies found **reduced striatal D2 receptor availability** in people addicted to cocaine, methamphetamine, alcohol and opioids (and in severe obesity), with reduced orbitofrontal metabolism; cues trigger dopamine release and craving.
- **ADHD**: smaller total brain and caudate volume on average; delayed cortical maturation (5.4); reduced frontostriatal activation; therapeutic methylphenidate blocks over half of dopamine transporters.
- **Autism**: early brain overgrowth in some; altered connectivity; findings vary greatly between individuals.

### Dementias and organic look-alikes
| Condition | Imaging pattern |
|---|---|
| **Alzheimer's disease** | Hippocampal and entorhinal atrophy; FDG-PET and SPECT reduced in **temporoparietal** and posterior cingulate cortex; positive amyloid and tau PET |
| **Behavioural variant frontotemporal dementia** | Frontal and anterior temporal atrophy and hypometabolism, often asymmetric |
| **Lewy body dementia** | Relatively preserved medial temporal lobes; **reduced DaTscan uptake**; occipital hypometabolism with a spared posterior cingulate ("cingulate island sign") |
| **Vascular dementia** | Infarcts and confluent white matter hyperintensities |
| **Huntington's disease** | Caudate atrophy with box-shaped frontal horns of the lateral ventricles |
| **Creutzfeldt-Jakob disease** | Cortical ribbon and basal ganglia bright on diffusion MRI; the "pulvinar sign" in variant CJD |
| **Wernicke's encephalopathy** | T2 or FLAIR brightness in the mammillary bodies, medial thalamus and around the aqueduct |
| **Herpes simplex encephalitis** | Medial temporal and inferior frontal brightness, often one side first |

:::widget decide
{
 "scene": "A private hospital in Bengaluru offers a 'SPECT brain scan package' to 'see which of seven types of ADHD or depression your child has' before choosing treatment. A worried father asks you whether to pay for it.",
 "ask": "What do you advise?",
 "choices": [
  { "label": "Explain that no scan can type or diagnose ADHD or depression, that scan-based subtypes are not validated, and that the radiation and cost bring no benefit; recommend a careful clinical assessment instead", "verdict": "best", "outcome": "The father saves money and his son receives a proper assessment with school reports and rating scales.", "why": "Group-level imaging differences overlap heavily with healthy people and cannot guide individual treatment as of Nov 2026." },
  { "label": "Recommend it, since more information is always better", "verdict": "harm", "outcome": "The report labels the boy with an 'overfocused type' and suggests supplements; the family delays effective treatment.", "why": "Unvalidated tests mislead and expose a child to radiation." },
  { "label": "Suggest an MRI instead", "verdict": "ok", "outcome": "The MRI is normal, as expected, and changes nothing.", "why": "Safer than SPECT, but still not indicated without neurological red flags." }
 ]
}
:::

### Psychophysiology: the body's signals
| Measure | What it reflects | Findings |
|---|---|---|
| **Skin conductance (electrodermal activity)** | Sweat gland activity, driven by **sympathetic cholinergic** nerves; orienting responses and their habituation | Slow habituation in anxiety; non-responding in about half of schizophrenia; **poor fear conditioning in psychopathy** (David Lykken's 1957 study) |
| **Resting heart rate** | Autonomic arousal | **Low resting heart rate** is one of the best-replicated biological correlates of antisocial behaviour in children and adolescents (Adrian Raine) |
| **Heart rate variability** | Beat-to-beat variation, much of it vagal (parasympathetic) | Reduced in depression, anxiety and PTSD; rises with recovery and exercise |
| **Startle eyeblink** | Brainstem reflex modulated by the amygdala | Fear-potentiated startle is larger in anxiety and PTSD; **prepulse inhibition** (a weak sound just before a loud one reduces startle) is reduced in schizophrenia, OCD, Tourette syndrome and Huntington's disease |
| **Eye movements** | Smooth pursuit, saccades | Pursuit and antisaccade abnormalities in schizophrenia and relatives |
| **Pupil size** | Sympathetic and parasympathetic balance; locus coeruleus activity | Mental effort and arousal |
| **Polygraph** | Several autonomic measures together | Measures arousal, not lying; high error rates |

:::widget compare
{
 "title": "Fear psychophysiology: anxiety versus psychopathy",
 "a": {
  "label": "Anxiety disorders and PTSD",
  "points": ["Large skin conductance responses", "Slow habituation", "Fear-potentiated startle increased", "Fast fear conditioning, slow extinction", "Raised heart rate to reminders"],
  "summary": "An alarm that rings too easily."
 },
 "b": {
  "label": "Psychopathy and some antisocial behaviour",
  "points": ["Small skin conductance responses to threat", "Poor fear conditioning (Lykken)", "Reduced fear-potentiated startle", "Low resting heart rate", "Reduced amygdala response to distress cues"],
  "summary": "An alarm that barely rings."
 },
 "caption": "The same measures, opposite directions: a strong exam contrast."
}
:::

:::example Brain tests in Indian courts
In 2010, in Selvi versus State of Karnataka, the Supreme Court of India held that narcoanalysis, polygraph and brain electrical activation profile tests cannot be administered without consent, because compulsion violates the right against self-incrimination and personal liberty, and that even voluntary results cannot be used as evidence by themselves. An earlier Pune conviction that had relied partly on an EEG-based "brain signature" test had drawn sharp scientific criticism. A psychologist asked to "prove a lie" with physiological measures should know both the science and the law.
:::

:::clinician
Interpretive pitfalls: circular analysis (selecting voxels and then reporting their effect size in the same data) inflated many early brain-behaviour correlations; uncorrected multiple comparisons famously produced "activation" in a dead salmon. Marek and colleagues (2022) showed typical brain-wide association effect sizes around r of 0.1, needing thousands of participants. ENIGMA meta-analyses: in schizophrenia, the largest effects are lower hippocampal volume (Cohen's d around minus 0.46), larger ventricles (about plus 0.37) and thinner cortex; in major depression, hippocampal reductions are small (d around minus 0.14) and driven by recurrent, early-onset cases. The F-DOPA striatal synthesis capacity elevation in schizophrenia has an effect size near 0.8 and predicts antipsychotic response: patients with normal synthesis capacity are more often treatment-resistant. TSPO PET (a putative microglial marker) has not shown consistent increases in schizophrenia; a meta-analysis found lower binding. Baxter's 1992 OCD study reported reduced right caudate glucose metabolism in responders to both fluoxetine and exposure and response prevention. Gilbertson's 2002 twin study suggests a smaller hippocampus is a risk factor for PTSD after trauma.
:::

:::recall
1. What does DTI measure and what does reduced FA suggest? || Directional water diffusion along tracts; reduced FA suggests impaired white matter integrity.
2. What does the BOLD signal depend on? || The ratio of oxygenated to deoxygenated haemoglobin; deoxyhaemoglobin is paramagnetic and active areas are over-supplied with oxygenated blood.
3. What is the most robust dopamine PET finding in schizophrenia? || Raised presynaptic striatal dopamine synthesis capacity, with exaggerated amphetamine-induced release.
4. Who first showed ventricular enlargement in schizophrenia, and with what? || Eve Johnstone and colleagues, with CT, in 1976.
5. What did Baxter's OCD studies show? || Orbitofrontal and caudate hyperactivity normalised with response to either fluoxetine or behaviour therapy.
6. What did Gilbertson's twin study show? || Unexposed co-twins of veterans with PTSD also had small hippocampi: a pre-existing vulnerability.
7. What did Volkow's PET studies find in addiction? || Reduced striatal D2 receptor availability and reduced orbitofrontal metabolism.
8. Name two psychophysiological findings in psychopathy. || Poor fear conditioning of skin conductance; low resting heart rate (also reduced fear-potentiated startle).
:::

:::mcq
Q: The BOLD signal in functional MRI depends mainly on:
- Glucose uptake by neurons
- *The ratio of oxygenated to deoxygenated haemoglobin
- Electrical currents from axons
- Dopamine release
> Deoxyhaemoglobin distorts the magnetic field.

Q: PET studies with carbon-11 raclopride are used to measure:
- Glucose metabolism
- *D2 receptor availability and occupancy, and dopamine release by displacement
- Amyloid plaques
- Serotonin transporters
> Raclopride competes with dopamine at D2 receptors.

Q: In a T1-weighted MRI, cerebrospinal fluid appears ____, and in a T2-weighted scan it appears ____.
- *Dark; bright
- Bright; dark
- Bright; bright
- Dark; dark
> "World War 2: water white on T2."

Q: Which pattern most supports Lewy body dementia?
- Severe hippocampal atrophy with normal DaTscan
- *Reduced striatal DaTscan uptake with relative sparing of the medial temporal lobes
- Caudate atrophy with box-shaped ventricles
- Cortical ribboning on diffusion MRI
> Plus occipital hypometabolism.

Q: Reduced prepulse inhibition of the startle reflex is most consistently found in:
- *Schizophrenia
- Specific phobia only
- Healthy older adults only
- Hypothyroidism
> A sensorimotor gating deficit, also in OCD and Tourette syndrome.

Q: Which method is particularly suited to studying brain activity in infants?
- PET
- *Functional near-infrared spectroscopy
- CT
- Intracranial EEG
> Silent, portable and tolerant of movement.
:::
`;

export const advImmune = String.raw`
## 6.6 Neuroinflammation and the gut-brain axis in depth [core][advanced]
6.5 introduced sickness behaviour, raised CRP in a subgroup with depression, and autoimmune encephalitis. Here are the routes by which the immune system and the gut reach the brain, the molecular steps that turn inflammation into low mood and psychosis, and an honest weighing of the evidence.

### How immune signals reach the brain
1. **Through the blood**: cytokines such as **interleukin-1 beta, interleukin-6 and tumour necrosis factor alpha** enter at leaky regions (circumventricular organs) and by active transport, and signal across blood vessel walls.
2. **Through nerves**: **vagus nerve** fibres sense cytokines in the abdomen and signal the brainstem within minutes.
3. **Through cells**: in animals under chronic stress, immune cells from the bone marrow travel to the brain's blood vessels and meninges.
4. **Inside the brain**: **microglia**, the resident immune cells (born from yolk-sac precursors early in development), and astrocytes produce their own cytokines and complement proteins.

### From inflammation to symptoms
:::widget flow
{
 "title": "How inflammation can lower mood and motivation",
 "layout": "chain",
 "nodes": [
  { "id": "c", "label": "Cytokines rise", "detail": "IL-1 beta, IL-6, TNF-alpha from infection, obesity, chronic stress, poor sleep, smoking, autoimmune disease." },
  { "id": "i", "label": "IDO enzyme switched on", "detail": "Indoleamine 2,3-dioxygenase diverts tryptophan away from serotonin into the kynurenine pathway." },
  { "id": "k", "label": "Kynurenine metabolites", "detail": "Microglia make quinolinic acid (an NMDA agonist, toxic in excess); astrocytes make kynurenic acid (an NMDA blocker, raised in schizophrenia)." },
  { "id": "d", "label": "Less dopamine in the reward circuit", "detail": "Cytokines reduce tetrahydrobiopterin, a cofactor for monoamine synthesis, and dampen striatal dopamine release." },
  { "id": "h", "label": "HPA and plasticity changes", "detail": "Glucocorticoid resistance, less BDNF, less neurogenesis in animals." },
  { "id": "s", "label": "Symptoms", "detail": "Anhedonia, fatigue, psychomotor slowing, poor sleep and appetite, social withdrawal: sickness behaviour that can become depression." }
 ],
 "caption": "Which symptoms of depression best fit this pathway? (Anhedonia, fatigue and slowing more than guilt.)"
}
:::

### The evidence, weighed
| For an inflammatory contribution | Against a simple causal story |
|---|---|
| Meta-analyses show raised IL-6, TNF-alpha and CRP on average in depression, and raised cytokines in acute psychosis and mania | Most depressed people have normal markers; about a quarter have low-grade inflammation |
| **Interferon-alpha** treatment (for hepatitis C or melanoma) causes depression in up to about a third to half of patients; an SSRI started beforehand can prevent much of it | Obesity, smoking, alcohol, poor sleep, inactivity and physical illness raise both inflammation and depression (confounding) |
| Healthy volunteers given a typhoid vaccine or low-dose endotoxin develop low mood, fatigue and feelings of social disconnection, with reward and insula changes on fMRI | Anti-inflammatory add-on trials give inconsistent results |
| Danish registers: severe infections and autoimmune diseases raise later risk of mood disorders and schizophrenia, with a dose-response pattern | Reverse causation: depression itself increases inflammation |
| Genetic (Mendelian randomisation) studies suggest IL-6 signalling may causally raise depression risk | High-inflammation subgroups may respond to anti-inflammatories while others are harmed |

:::widget experiment
{
 "title": "Infliximab in treatment-resistant depression",
 "question": "In a trial of the TNF-alpha blocker infliximab, patients were split by baseline CRP. Predict whether the drug beat placebo in each group, as a rough response advantage in percentage points.",
 "unit": " points",
 "max": 40,
 "conditions": [
  { "label": "All patients together", "value": 0, "note": "No overall difference from placebo." },
  { "label": "Patients with CRP above 5 mg/L", "value": 30, "note": "A clear advantage over placebo in this small subgroup (response roughly 62 versus 33 per cent)." }
 ],
 "why": "Inflammation-targeted treatment may help only people who are inflamed. In those with low CRP, placebo did slightly better. This is why trials now select patients by inflammatory markers."
}
:::

### Immune-linked syndromes psychiatrists must know
- **Autoimmune encephalitis** (6.5): anti-NMDA receptor and other antibodies.
- **Sydenham's chorea**: after rheumatic fever, chorea often with OCD symptoms and emotional lability; still seen in India.
- **PANDAS and PANS**: sudden-onset OCD or tics in children after streptococcal or other infections. The concept is plausible and actively studied, but diagnostic criteria and treatments (antibiotics, immunoglobulin) remain **controversial**.
- **Neuropsychiatric lupus**: psychosis, depression and cognitive change; distinguish from steroid effects.
- **HIV** and **neurosyphilis**: still important causes of new psychiatric presentations in India.

### Microglia and complement in schizophrenia
Complement C4 tags synapses for pruning by microglia (5.4), and post-mortem studies show microglial activation in some patients. But PET with a microglial marker (TSPO) has **not** shown consistent increases in living patients, and trials of minocycline (an antibiotic that damps microglia) for negative symptoms were negative in the largest study. The immune story is strongest in specific subgroups.

### The gut-brain axis
The gut talks to the brain in four ways:
| Route | Mechanism | Example finding |
|---|---|---|
| **Vagus nerve** | Sensory fibres from the gut wall to the brainstem | In mice, a Lactobacillus strain reduced anxiety-like behaviour and changed GABA receptor expression; cutting the vagus abolished the effect |
| **Immune** | A leaky gut barrier lets bacterial products (lipopolysaccharide) into the blood, raising cytokines | Raised antibodies to gut bacteria in some people with depression |
| **Endocrine and HPA** | Gut cells make serotonin and gut hormones (GLP-1, ghrelin, PYY); microbes shape stress responses | **Germ-free mice** had exaggerated HPA responses to restraint, corrected by colonisation with Bifidobacterium only if done early in life |
| **Microbial metabolites** | Short-chain fatty acids (butyrate), tryptophan metabolites, GABA made by some bacteria | Faecal microbes from depressed people transferred to germ-free rodents induced depression-like behaviour |

:::widget figure
{"id": "gut-brain", "quiz": true}
:::

:::widget decide
{
 "scene": "A health influencer in Mumbai sells a 'gut reset' probiotic course, claiming it 'cures anxiety and depression in 21 days so you can stop your medicines'. Your client, Kavita, 34, on sertraline for panic disorder with good effect, wants to switch.",
 "ask": "What is the evidence-based reply?",
 "choices": [
  { "label": "Explain that the gut-brain link is real and interesting, but probiotics have only small and inconsistent effects in trials and do not replace effective treatment; a healthy, fibre-rich diet and exercise are reasonable additions", "verdict": "best", "outcome": "Kavita keeps her medicine, adds regular exercise and better meals, and feels respected rather than dismissed.", "why": "Accurate about the science, honest about the limits, and focused on her safety." },
  { "label": "Agree and help her stop sertraline", "verdict": "harm", "outcome": "She has discontinuation symptoms and a return of panic attacks.", "why": "Unproven claims should not displace effective treatment." },
  { "label": "Tell her the gut has nothing to do with the brain", "verdict": "ok", "outcome": "She feels dismissed and turns to the influencer for advice.", "why": "Factually wrong and unhelpful; the gut-brain axis is real, even if treatments are unproven." }
 ]
}
:::

### Diet, mood and the evidence
- Large population studies link healthier diets (vegetables, fruit, pulses, whole grains, fish, less ultra-processed food) with lower depression risk; reverse causation is possible.
- A small Australian randomised trial of a Mediterranean-style diet as an add-on in moderate to severe depression reported far higher remission than a social-support control, but it had about 70 participants and needs replication.
- Probiotic ("psychobiotic") meta-analyses show small, heterogeneous effects; as of Nov 2026, no probiotic is a recommended treatment for any psychiatric disorder.
- In **autism**, gut symptoms are common, but microbiome differences may largely reflect restricted, selective diets rather than cause the condition.
- Classic gut-brain disorders are real and treatable: **irritable bowel syndrome** often co-occurs with anxiety and depression and responds to CBT, gut-directed hypnotherapy and low-dose tricyclics; **hepatic encephalopathy** (ammonia from gut bacteria) causes confusion treated with lactulose and rifaximin; **coeliac disease** can present with depression and fatigue.

:::clinician
Dowlati's 2010 meta-analysis found raised IL-6 and TNF-alpha in depression; Osimo's 2019 meta-analysis estimated about 27 per cent with CRP above 3 mg/L and about 58 per cent above 1 mg/L. Raison's 2013 infliximab trial showed benefit only with baseline CRP above 5 mg/L. Musselman (2001) showed paroxetine pretreatment reduced interferon-induced depression. Benros's Danish registry studies found that hospitalisation for infection and autoimmune disease raised mood disorder risk (incidence rate ratio around 1.6) and schizophrenia risk, with dose-response effects. Felger and Miller's work links inflammation to reduced ventral striatal responses to reward and to motor slowing, symptoms that might predict response to dopaminergic agents. The Flemish Gut Flora Project found Coprococcus and Dialister depleted in depression independent of antidepressant use. Bravo and colleagues (2011) showed vagally mediated effects of Lactobacillus rhamnosus JB-1 in mice; a later human trial of the same strain was negative. The SMILES trial (Jacka, 2017) reported remission of 32 versus 8 per cent after three months. Exercise has anti-inflammatory effects and moderate antidepressant effect sizes in meta-analyses, making it the most practical "anti-inflammatory" intervention.
:::

:::recall
1. Name four routes by which inflammation reaches the brain. || Blood-borne cytokines (circumventricular organs, transport), vagal afferents, immune cell trafficking, and microglia and astrocytes within the brain.
2. How does IDO link inflammation to depression? || It diverts tryptophan from serotonin to kynurenine; kynurenine metabolites (quinolinic acid, kynurenic acid) act on NMDA receptors.
3. What share of patients on interferon-alpha develop depression, and what prevents it? || Up to about a third to a half; SSRI pretreatment reduces it.
4. What did the infliximab trial show? || No overall benefit, but benefit in patients with baseline CRP above 5 mg/L.
5. Name four routes of the gut-brain axis. || Vagus nerve, immune (gut barrier and cytokines), endocrine and HPA, microbial metabolites.
6. What did germ-free mice show? || Exaggerated HPA responses to stress, normalised by early colonisation with Bifidobacterium.
7. What is the status of probiotics for psychiatric disorders as of Nov 2026? || Small, inconsistent effects; not a recommended treatment.
:::

:::mcq
Q: Indoleamine 2,3-dioxygenase (IDO), induced by inflammatory cytokines, shifts tryptophan metabolism towards:
- Serotonin
- Melatonin
- *Kynurenine
- Dopamine
> Less substrate for serotonin, more NMDA-active metabolites.

Q: In germ-free mice, the HPA response to restraint stress is:
- Absent
- *Exaggerated, and normalised by early bacterial colonisation
- Normal
- Exaggerated only in old age
> Microbes shape stress system development.

Q: Read the assertion and reason. Assertion (A): Anti-inflammatory drugs are not a routine treatment for depression as of Nov 2026. Reason (R): Only a minority of depressed patients show raised inflammatory markers, and trial results are inconsistent.
- *Both A and R are true, and R is the correct explanation of A
- Both A and R are true, but R is not the correct explanation of A
- A is true, but R is false
- A is false, but R is true
> Stratification by markers is the research direction.

Q: A child develops sudden severe OCD symptoms and tics weeks after a sore throat. The most accurate statement is:
- The link is proven and antibiotics are standard treatment
- *An immune-triggered mechanism (PANDAS or PANS) is proposed but its diagnosis and treatment remain controversial
- Infections never affect the brain
- This must be Sydenham's chorea
> Assess carefully; evidence-based OCD treatment remains central.

Q: In mice, the anxiety-reducing effect of a Lactobacillus strain was abolished by:
- Antidepressants
- *Cutting the vagus nerve
- Removing the spleen
- Feeding sugar
> Evidence for a vagal route.
:::
`;
