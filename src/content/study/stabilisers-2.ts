/* Module · stabilisers, Part V (Advanced). Original text written for VIBHA School of Psychology. */
export const advanced = String.raw`

# Part V · Advanced: ions, channels, receptors, kinetics and reproductive safety

## 5.1 How lithium works: from a simple ion to body-clock genes [core][advanced]
Lithium binds no receptor. It is a small ion that competes with sodium and, more importantly, with **magnesium** at the active sites of several enzymes. Its effects build over weeks, which fits a mechanism that works through signalling cascades and gene expression rather than through a single receptor.

### The main targets
| Target | What lithium does | Proposed consequence |
|---|---|---|
| **Inositol monophosphatase** (IMPase) | Inhibits it, so inositol is not recycled | Neurons that fire most (the overactive ones) run short of the inositol they need to keep phosphoinositide signalling going: the **inositol depletion** hypothesis |
| **GSK-3 beta** | Inhibits it directly (competing with magnesium) and indirectly (through Akt) | More beta-catenin and BDNF signalling, neuroprotection, and resetting of body-clock proteins |
| **Circadian clock** | Lengthens the period of clock genes via GSK-3 | Stabilises disrupted sleep and daily rhythms, central to bipolar relapse |
| **Neurotrophic and protective pathways** | Raises BDNF and Bcl-2, reduces apoptosis | Larger grey matter volumes on scans in people on lithium |
| **Glutamate and dopamine** | Damps excess glutamate and dopamine signalling | May explain the antimanic effect |

:::widget flow
{"title": "Inositol depletion: why lithium hits the busiest neurons hardest", "layout": "cycle", "nodes": [{"id": "n1", "label": "Receptor fires", "detail": "Many receptors (serotonin 2A, muscarinic, alpha-1) signal by splitting a membrane lipid (PIP2) into two messengers, IP3 and DAG."}, {"id": "n2", "label": "Messengers act", "detail": "IP3 releases calcium inside the cell; DAG switches on protein kinase C."}, {"id": "n3", "label": "Recycling", "detail": "IP3 is broken down step by step back to inositol, which is used to rebuild PIP2. The last step needs the enzyme IMPase."}, {"id": "n4", "label": "Lithium blocks IMPase", "detail": "Inositol is not recycled. Neurons that fire a lot use up their inositol first."}, {"id": "n5", "label": "Overactive signalling slows", "detail": "Without new PIP2, the overactive pathway quietens; quiet pathways barely notice. A selective brake on the circuits most driven in mania."}], "caption": "Press Play. Brain inositol cannot easily be replaced from the blood, which is why the brain is affected more than the body."}
:::

### Lithium and suicide
Across trials and large cohort studies, lithium lowers suicide and suicide attempts in mood disorders, by more than half against placebo in pooled analyses, and more than other mood stabilisers. The effect seems partly independent of its effect on mood episodes: it may also reduce impulsive aggression. Even trace lithium in drinking water has been linked with lower suicide rates in population studies, though such studies cannot prove cause.

### Who responds, and why we are still learning
About a third of people with bipolar disorder are excellent lithium responders. Response runs in families, and a large international genetic consortium has linked it with common gene variants and with a lower genetic load for schizophrenia. Brain imaging, stem cell models (neurons grown from patients' skin cells) and circadian measures are being studied to predict response before months of trial and error.

:::recall
1. Name two enzymes inhibited by lithium. || Inositol monophosphatase and GSK-3 beta.
2. What is the inositol depletion hypothesis? || Blocking IMPase starves the most active neurons of inositol, quietening overactive phosphoinositide signalling.
3. Which ion does lithium compete with at enzyme sites? || Magnesium.
4. How does lithium affect body clocks? || Through GSK-3, it lengthens and stabilises circadian rhythms.
:::

:::mcq
Q: Why is lithium thought to affect overactive neurons more than quiet ones?
- It binds more receptors on them
- *Busy neurons use up inositol fastest once IMPase is blocked
- It is concentrated by dopamine
- It only enters active neurons
> The inositol depletion hypothesis.
:::

## 5.2 Anticonvulsants: channels, GABA and genes [core][advanced]
Valproate, carbamazepine and lamotrigine all reduce excessive neuronal firing, but by different routes, which is why they help different poles of bipolar disorder.

| Medicine | Main actions | Strongest clinical effect |
|---|---|---|
| Valproate | Sodium channel block; raises GABA by reducing its breakdown; T-type calcium block; inhibits histone deacetylase (changing gene expression) | Mania, mixed states |
| Carbamazepine | Binds inactivated voltage-gated sodium channels, limiting rapid repetitive firing | Mania (second line) |
| Oxcarbazepine | Similar sodium channel action | Weaker evidence in mania |
| Lamotrigine | Sodium channel block on the presynaptic side, reducing glutamate release | Preventing bipolar depression |
| Topiramate, gabapentin | Various | No benefit in mania in trials, despite being anticonvulsants |

### State-dependent block
Voltage-gated sodium channels cycle between resting, open and inactivated states. Carbamazepine, lamotrigine and phenytoin bind mainly to the **inactivated** state. Neurons that fire fast spend more time inactivated, so they are blocked more: a **use-dependent** brake, rather like lithium's selectivity for busy neurons.

### Why "anticonvulsant" does not mean "mood stabiliser"
Topiramate, gabapentin, levetiracetam and others stop seizures but failed to treat mania. So the mood effect is not simply "less firing". Lamotrigine's action on glutamate release, valproate's effects on gene expression and lithium's enzyme effects point to shared downstream pathways (such as GSK-3 and protein kinase C) as more likely common ground.

:::widget sort
{"prompt": "Match each mechanism to its medicine.", "buckets": ["Lithium", "Valproate", "Lamotrigine", "Carbamazepine"], "items": [{"text": "Inhibits inositol monophosphatase", "bucket": 0}, {"text": "Inhibits histone deacetylase", "bucket": 1, "why": "This changes how genes are read, and is also why valproate is being studied in cancer."}, {"text": "Reduces presynaptic glutamate release", "bucket": 2}, {"text": "Induces its own metabolism over weeks", "bucket": 3}, {"text": "Competes with magnesium at GSK-3", "bucket": 0}, {"text": "Raises brain GABA by slowing its breakdown", "bucket": 1}, {"text": "Prevents depression more than mania", "bucket": 2}]}
:::

:::recall
1. What is state-dependent sodium channel block? || Drugs bind the inactivated channel, so fast-firing neurons are blocked more.
2. Which anticonvulsants failed in mania? || Topiramate and gabapentin (also levetiracetam).
3. Which mood stabiliser inhibits histone deacetylase? || Valproate.
:::

:::mcq
Q: A colleague suggests gabapentin for acute mania "because all anticonvulsants stabilise mood". The best reply is:
- Agree
- *Trials show gabapentin does not treat mania; the mood effect is not shared by all anticonvulsants
- Gabapentin is better than lithium
- Only if combined with lamotrigine
> Anticonvulsant action is not the same as mood-stabilising action.
:::

## 5.3 Kinetics and interactions in depth [core][advanced]
### Lithium and the kidney
- About 80% of filtered lithium is reabsorbed in the **proximal tubule**, alongside sodium. Anything that makes the proximal tubule hold on to sodium (salt depletion, dehydration, thiazides acting downstream) raises lithium.
- **Thiazides** typically raise lithium levels by about a quarter to two-fifths; **NSAIDs** and **ACE inhibitors** or ARBs by variable amounts through reduced kidney blood flow. **Loop diuretics** have smaller, less predictable effects; **caffeine** and theophylline lower levels slightly.
- In the collecting duct, lithium enters cells through the **ENaC sodium channel** and disrupts the water channels: this is **nephrogenic diabetes insipidus**. **Amiloride** blocks ENaC and can reduce lithium-induced polyuria.

:::widget worked
{"title": "Predicting a lithium level after a new blood pressure tablet", "steps": [{"q": "Mrs Iyer's lithium level is 0.7 mmol/L. Her GP starts a thiazide for blood pressure. If the level rises by about a third, what might it reach?", "a": "0.7 plus a third of 0.7 (about 0.23) is about **0.93 mmol/L**."}, {"q": "Is that dangerous?", "a": "Not yet toxic, but higher than intended, and in a 70-year-old it could cause tremor and unsteadiness. A second insult, such as a stomach bug, could push it past 1.2."}, {"q": "What is the safer plan?", "a": "Ask the GP for a non-thiazide option (for example a calcium channel blocker such as amlodipine), or, if a thiazide is essential, lower the lithium dose and recheck the level in 5 to 7 days."}], "yourTurn": [{"q": "A man's level is 0.8 mmol/L. He starts regular ibuprofen and the level rises by a quarter. What is the new level?", "a": "0.8 plus 0.2 = about 1.0 mmol/L. Advise paracetamol instead and recheck."}]}
:::

### Valproate: protein binding and free levels
Valproate is about 90% bound to albumin, and the binding saturates at higher concentrations. When albumin is low (malnutrition, liver disease, pregnancy, old age) or binding sites are full, the **free** fraction rises: a "normal" total level can hide a toxic free level. Valproate also inhibits glucuronidation and epoxide hydrolase, raising lamotrigine and the active carbamazepine epoxide.

### Carbamazepine: auto-induction and the epoxide
Carbamazepine induces CYP3A4 and other enzymes, including those that clear it. Over the first weeks its half-life shortens markedly, levels fall and the dose usually needs raising. Its active **10,11-epoxide** metabolite causes much of the toxicity (dizziness, double vision); valproate raises it.

### Lamotrigine: glucuronidation and hormones
Lamotrigine is cleared mainly by glucuronidation (UGT1A4). Valproate inhibits this (levels double); carbamazepine, phenytoin and **oestrogen** induce it (levels fall by about half on the combined pill). Pregnancy raises clearance progressively; it falls back within days after delivery, so doses must be cut after birth to avoid toxicity.

:::widget curve
{"kind": "half-life", "title": "Auto-induction: when the half-life itself changes", "caption": "Start with a long half-life, then slide it shorter, as happens with carbamazepine over its first weeks. With the same dose, the steady level drops. This is why a carbamazepine level that was fine early can fall out of range a month later."}
:::

:::recall
1. Where is most lithium reabsorbed in the kidney? || The proximal tubule, with sodium.
2. How does amiloride help lithium-induced polyuria? || It blocks ENaC, the route lithium uses to enter collecting duct cells.
3. Why can a normal total valproate level hide toxicity? || Saturable albumin binding: the free fraction rises when albumin is low.
4. What happens to lamotrigine clearance in pregnancy and after delivery? || It rises during pregnancy, then falls back quickly after delivery.
:::

:::mcq
Q: A woman on lamotrigine 200 mg starts a combined oestrogen pill. The most likely result is:
- Lamotrigine levels double
- *Lamotrigine levels fall by about half, with risk of relapse
- No change
- Serotonin syndrome
> Oestrogen induces glucuronidation.
:::

## 5.4 Toxicity at depth: lithium, valproate and the skin [core][advanced]
### Three patterns of lithium toxicity
| Pattern | What happens | Typical picture |
|---|---|---|
| Acute (overdose in someone not on lithium) | High blood level, brain not yet loaded | Vomiting and diarrhoea first; neurotoxicity may be mild at first |
| Acute on chronic (overdose in someone on lithium) | Brain already loaded | Severe neurotoxicity at lower blood levels |
| Chronic (gradual build-up) | Brain fully loaded; often dehydration, NSAIDs, kidney decline | Confusion, ataxia, tremor, myoclonus even at modest levels |

### When dialysis is used
Haemodialysis removes lithium well because it is small and not protein-bound. Broadly, it is advised for lithium poisoning with impaired kidney function and a level above about 4.0 mmol/L, or with reduced consciousness, seizures or life-threatening arrhythmias at any level; and it is suggested at levels above about 5.0, with significant confusion, or when the level is not expected to fall below 1.0 within a day and a half. Levels can rebound after dialysis as lithium moves out of cells, so repeat levels are needed. Activated charcoal does not bind lithium; whole-bowel irrigation is considered for large slow-release overdoses.

:::widget guess
{"prompt": "Activated charcoal binds many drugs in overdose. How much lithium does it remove?", "min": 0, "max": 100, "unit": "%", "answer": [0, 5], "reveal": "Almost none. Lithium is a small charged ion that charcoal cannot bind. Fluids, stopping lithium and, when needed, haemodialysis are the treatments.", "clinician": "Charcoal is not indicated for isolated lithium ingestion (it may be used for co-ingestants). Whole-bowel irrigation with polyethylene glycol can be considered for large slow-release ingestions presenting early with a protected airway."}
:::

:::note SILENT
Some people are left with lasting cerebellar problems (ataxia, slurred speech), memory difficulties or movement disorders after severe lithium toxicity: the **syndrome of irreversible lithium-effectuated neurotoxicity**. It is a strong reason to prevent toxicity, not just treat it.
:::

### Valproate: ammonia and the liver
- **Hyperammonaemic encephalopathy**: drowsiness, confusion and vomiting with high ammonia, sometimes with normal liver tests and normal valproate levels. Risk is higher with topiramate, urea cycle disorders and carnitine deficiency. Treatment: stop valproate; L-carnitine may help.
- **Hepatotoxicity**: rare in adults, highest in children under two on several anticonvulsants and in mitochondrial disorders (POLG variants).
- **Pancreatitis**: severe abdominal pain with vomiting; check amylase or lipase.

### Serious skin reactions and HLA genes
| Gene variant | Drug | Reaction | Who carries it |
|---|---|---|---|
| HLA-B*15:02 | Carbamazepine, oxcarbazepine, phenytoin (lamotrigine weaker) | Stevens-Johnson syndrome and toxic epidermal necrolysis | South and East Asian populations, including many Indians |
| HLA-A*31:01 | Carbamazepine | Drug reaction with eosinophilia (DRESS), SJS | European, Japanese and other populations |

The HLA protein presents the drug, or a drug-peptide complex, to T cells as if it were foreign, triggering a destructive immune attack on the skin and mucous membranes. Most reactions start within the first two months.

:::recall
1. Why is acute-on-chronic lithium toxicity the most dangerous pattern? || The brain is already loaded, so neurotoxicity is severe at lower blood levels.
2. Why does dialysis work well for lithium? || It is small, water-soluble and not protein-bound.
3. Name a valproate toxicity that can occur with normal liver tests. || Hyperammonaemic encephalopathy.
4. Which HLA variant links carbamazepine to SJS in Asian populations? || HLA-B*15:02 (HLA-B*1502).
:::

:::mcq
Q: A woman on valproate and topiramate becomes drowsy and confused. Her valproate level and liver tests are normal. Which test is most useful next?
- Lithium level
- *Blood ammonia
- Thyroid function
- HLA typing
> Valproate hyperammonaemia can occur with normal levels and liver tests.
:::

## 5.5 Reproductive safety in depth [core][advanced]
### Valproate: what the numbers show
- Major malformations in about **10%** of exposed pregnancies (neural tube defects, heart and limb defects, cleft palate), rising with dose.
- Neurodevelopmental problems (lower IQ, autism, ADHD, learning difficulties) in up to **30 to 40%** of exposed children, also dose-related, from exposure throughout pregnancy.
- Folic acid reduces neural tube defects in general but does not reverse valproate's effects on brain development.
- UK regulators require a **pregnancy prevention programme** for girls and women who must take it, and since 2024 also advise caution in men (contraception for men and their partners, and two-specialist agreement before starting it in men under 55). A 2026 analysis found no increased risk in children of fathers taking valproate, so this area is still being debated.

### Lithium: an old fear, revised
Early registries suggested a large risk of **Ebstein's anomaly** (a malformed tricuspid valve). Large modern studies show a much smaller risk: overall heart malformations rise from about 1 in 100 to about 2 in 100 exposed pregnancies, with higher risk at higher doses. A detailed fetal heart scan is offered.

### Around delivery
- Lithium clearance rises through pregnancy, then falls abruptly at delivery: levels can **double** within days. Many teams reduce or pause the dose at the start of labour, keep the mother well hydrated, and check levels within a day of delivery.
- Lamotrigine levels fall through pregnancy and rise after delivery: doses must be reduced after birth.
- **Postpartum relapse**: about a third of women with bipolar disorder relapse after birth, and far more among those who stop medication in pregnancy. Postpartum psychosis is a psychiatric emergency.


:::widget timeline
{"prompt": "Put these points in a planned pregnancy on lithium in order.", "events": [{"label": "Review the medicine and start folic acid before trying to conceive"}, {"label": "Early booking and a detailed fetal heart scan"}, {"label": "More frequent lithium levels as pregnancy advances"}, {"label": "Lithium dose reduced or held at the start of labour, with fluids"}, {"label": "Level checked within a day of delivery"}, {"label": "Close review in the weeks after birth, when relapse risk is highest"}], "why": "Risk to the baby is highest early; risk of toxicity peaks at delivery; risk of relapse peaks after birth. The plan follows those three peaks."}
:::
:::widget flow
{"title": "Planning pregnancy with bipolar disorder", "layout": "chain", "nodes": [{"id": "g1", "label": "Before conception", "detail": "Review the medicine: switch away from valproate and carbamazepine; discuss lithium, lamotrigine or an antipsychotic; folic acid; plan care."}, {"id": "g2", "label": "First trimester", "detail": "Early booking, glucose screening if on antipsychotics, detailed fetal heart scan if on lithium."}, {"id": "g3", "label": "Second and third trimesters", "detail": "More frequent levels (lithium monthly, then weekly near term; lamotrigine as needed); doses often rise."}, {"id": "g4", "label": "Delivery", "detail": "Lithium dose reduced or held at the start of labour; fluids; level within a day; paediatric team aware."}, {"id": "g5", "label": "First weeks after birth", "detail": "Highest relapse risk. Protect sleep, family support, early review, lamotrigine dose reduced, breastfeeding plan."}], "caption": "Press Play. Each step reduces either the risk to the baby or the risk of a relapse."}
:::

:::widget decide
{"scene": "Sunita, 33, in Patna, has bipolar disorder and is nearly at full term in pregnancy on lithium 1000 mg, with a level of 0.7 mmol/L. She goes into labour overnight. The labour ward, not used to lithium, keeps her usual dose going, gives little fluid, and she has a long labour. Two days after delivery she is shaky, confused and vomiting.", "ask": "What went wrong, and what should happen now?", "choices": [{"label": "This is postpartum psychosis: start an antipsychotic and continue lithium", "verdict": "harm", "outcome": "Her confusion deepens and she has a seizure.", "why": "Confusion, coarse tremor and vomiting soon after delivery on lithium are toxicity until proved otherwise."}, {"label": "Lithium clearance fell abruptly at delivery while the dose and dehydration continued, so the level rose. Stop lithium now, give IV fluids, check the level, kidney function and the baby; restart at a lower dose once safe, with a postpartum plan", "verdict": "best", "outcome": "Her level is 1.9 mmol/L. With fluids she recovers in two days. She restarts at a lower dose and stays well.", "why": "Delivery is a high-risk moment for lithium toxicity. A written labour plan (reduce or hold the dose, fluids, early level) prevents it."}, {"label": "Stop lithium permanently and discharge her", "verdict": "harm", "outcome": "Three weeks later she develops postpartum mania.", "why": "The postpartum period is when she most needs protection from relapse."}]}
:::

:::recall
1. What proportion of valproate-exposed children have neurodevelopmental problems? || Up to about 30 to 40%.
2. How large is the heart malformation risk with lithium in modern studies? || About 2 in 100 exposed pregnancies, against about 1 in 100.
3. What happens to lithium levels at delivery? || They can rise sharply as clearance falls.
4. About what proportion of women with bipolar disorder relapse after birth? || About a third, more if medication was stopped.
:::

:::mcq
Q: Which statement about lithium in pregnancy is MOST accurate today?
- It causes Ebstein's anomaly in 1 in 10 pregnancies
- *It slightly raises the risk of heart malformations, about 2 in 100 versus 1 in 100, so a planned, monitored choice may be reasonable
- It is safer than every other option in every case
- It must always be stopped in the first trimester
> Modern studies revised the old, larger estimates.
:::

## 5.6 GABA-A receptor science, dependence and newer sleep medicines [core][advanced]
### One receptor, many forms
GABA-A receptors are built from five subunits around a chloride channel, most often two alpha, two beta and one gamma. Benzodiazepines bind between an **alpha** and the **gamma2** subunit. Which alpha subunit is present decides what a drug does there.

| Subunit | Where | What benzodiazepine action there causes |
|---|---|---|
| Alpha1 | Cortex, thalamus, cerebellum | Sedation, amnesia, some anticonvulsant action, dependence |
| Alpha2 and alpha3 | Limbic system, spinal cord | Anxiety relief, muscle relaxation |
| Alpha5 | Hippocampus | Memory and learning effects |
| Alpha4 and alpha6 with delta (extrasynaptic) | Thalamus, cerebellum | Insensitive to benzodiazepines; sensitive to neurosteroids and low doses of alcohol |

- **Zolpidem** prefers alpha1-containing receptors: strongly sedating, weakly anxiolytic.
- **Neurosteroids** (zuranolone, brexanolone, allopregnanolone) act at a different site and also on extrasynaptic receptors, giving a steady background calm.
- **Barbiturates** and high-dose alcohol can open the channel directly even without GABA, which is why they are far more dangerous in overdose than benzodiazepines.

:::widget receptor
{"receptor": "GABA-A", "title": "Full, partial and inverse at the benzodiazepine site", "caption": "Pick Full agonist (diazepam): GABA's effect is boosted strongly. Pick Partial agonist: a smaller boost, which researchers hoped would calm anxiety with less sedation and dependence. Pick Inverse agonist: GABA's effect is reduced, producing anxiety and even seizures. Flumazenil, the antagonist, simply blocks the site, which is why it can trigger withdrawal seizures in someone dependent."}
:::

### How tolerance and dependence develop
- **Receptor uncoupling**: the link between the benzodiazepine site and the GABA site weakens.
- **Subunit changes**: the cell makes fewer benzodiazepine-sensitive subunits and more insensitive ones.
- **Glutamate rebound**: the excitatory system turns itself up to balance the extra braking.
- Tolerance to sedation develops within days to weeks; tolerance to anxiety relief more slowly; tolerance to amnesia and to effects on balance in older people may never fully develop.
- On stopping, the brake suddenly weakens while the accelerator is still turned up: anxiety, insomnia, perceptual distortions, seizures.

### Newer sleep medicines
**Orexin** (hypocretin) neurons in the hypothalamus hold the brain awake. In narcolepsy they are lost. **Dual orexin receptor antagonists** (suvorexant, lemborexant, daridorexant; daridorexant was approved in the US in January 2022) block this wake signal rather than boosting sedation, with less rebound and less dependence, though next-day drowsiness and vivid dreams occur.

:::widget flow
{"title": "Benzodiazepine dependence: the adaptation loop", "layout": "cycle", "nodes": [{"id": "b1", "label": "Regular benzodiazepine", "detail": "The GABA brake is strengthened every day."}, {"id": "b2", "label": "The brain compensates", "detail": "Receptors uncouple and change subunits; glutamate activity rises."}, {"id": "b3", "label": "Less effect", "detail": "Sleep and calm need more drug: tolerance."}, {"id": "b4", "label": "Dose missed or reduced", "detail": "The brake weakens while the accelerator is still turned up."}, {"id": "b5", "label": "Withdrawal", "detail": "Anxiety, insomnia, tremor, sensitivity to light and sound, and after long or high use, seizures. Taking the drug relieves it, which feels like proof that it is needed."}], "caption": "Press Play. A slow taper lets the brain reverse each adaptation step by step."}
:::

:::recall
1. Between which subunits do benzodiazepines bind? || Alpha and gamma2.
2. Which alpha subunit mediates sedation, and which anxiety relief? || Alpha1; alpha2 and alpha3.
3. Why are barbiturates more dangerous than benzodiazepines in overdose? || They can open the chloride channel directly, without GABA.
4. How do orexin antagonists promote sleep? || They block the hypothalamic wake signal.
:::

:::mcq
Q: Zolpidem is strongly sedating but a weak anxiolytic mainly because it:
- Blocks histamine
- *Prefers alpha1-containing GABA-A receptors
- Acts on orexin receptors
- Is an inverse agonist
> Alpha1 mediates sedation.
:::

## 5.7 ICD-11 and guidelines say [core][advanced]
:::note ICD-11 says
- Bipolar type I needs at least one manic or mixed episode; bipolar type II needs hypomania and depression. ICD-11, unlike earlier versions, allows a diagnosis after a single manic episode.
- ICD-11 describes mixed episodes as a category in their own right; these respond less well to lithium and better to valproate or antipsychotics.
- Insomnia disorder is placed in a separate chapter on sleep-wake disorders, recognising it as a condition in itself rather than only a symptom.
- Sedative, hypnotic or anxiolytic dependence and withdrawal are coded with severity, including withdrawal with seizures or delirium.
:::

:::note Guidelines say
- **Lithium** is the first-line long-term treatment for bipolar disorder in most international guidelines, especially for classic mania and suicide prevention.
- **Valproate** must not be started in girls and women of childbearing potential unless other options are unsuitable and a pregnancy prevention programme is in place.
- **Lamotrigine** is preferred for preventing depressive relapse.
- **Antidepressants alone** are not recommended in bipolar disorder.
- **Benzodiazepines**: short courses only; avoid alprazolam for new prescriptions; review long-term users and offer supported tapering.
- **Insomnia**: CBT-I first, including digital versions; medicines only short-term.
- **Indian Psychiatric Society guidance** adds attention to cost (lithium is cheap but needs lab access), HLA testing where available before carbamazepine, and the widespread over-the-counter availability of benzodiazepines.
:::

:::widget sort
{"prompt": "Good practice or a common error?", "buckets": ["Good practice", "Common error"], "items": [{"text": "Starting valproate in a 20-year-old woman with no contraception plan", "bucket": 1}, {"text": "Giving written sick-day rules to everyone on lithium", "bucket": 0}, {"text": "Prescribing alprazolam every night for two years", "bucket": 1}, {"text": "Testing HLA-B*1502 before carbamazepine in a patient of Indian ancestry", "bucket": 0}, {"text": "Halving lamotrigine when valproate is added", "bucket": 0}, {"text": "Giving activated charcoal for a lithium overdose", "bucket": 1, "why": "Charcoal does not bind lithium."}, {"text": "Offering CBT-I before any sleeping tablet", "bucket": 0}]}
:::

:::recall
1. Which mood stabiliser do most guidelines put first for long-term bipolar treatment? || Lithium.
2. What is first-line for chronic insomnia? || CBT-I.
3. Can ICD-11 bipolar I be diagnosed after a single manic episode? || Yes.
:::

:::mcq
Q: Which statement reflects current guidance on benzodiazepines?
- Use alprazolam first for panic disorder long-term
- *Short courses only, avoid new alprazolam prescriptions, and offer supported tapering to long-term users
- Stop all long-term users abruptly
- They are first-line for insomnia ahead of CBT-I
> Short-term use and supported tapering.
:::
`;
