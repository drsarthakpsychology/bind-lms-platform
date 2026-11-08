/* Module · Medicines one by one, Part III (Advanced level). Original text written for VIBHA School of Psychology. */
export const part3 = String.raw`
# Part III · Advanced: receptors, enzymes, genes and risk

## 3.1 Occupancy, intrinsic activity and the logic of dosing [core][advanced]
At the Beginner level you learned which receptor each medicine acts on. At the Advanced level the question becomes **how much** of the receptor population is occupied, **how strongly** each bound molecule signals, and **how fast** it lets go. These three quantities explain why doses are what they are.

### Occupancy windows
Positron emission tomography (PET) with radiolabelled ligands lets researchers measure the fraction of receptors a drug occupies in the living brain. For antagonist antipsychotics at striatal D2 receptors, a broad pattern has held across many studies:
- Below about **60% occupancy**, antipsychotic response is unlikely.
- About **65% to 80%** is the therapeutic window for most patients.
- Above about **72%**, prolactin rises; above about **78% to 80%**, extrapyramidal side effects become likely.

The relationship between dose and occupancy is **hyperbolic**: early dose increments raise occupancy a lot; later increments raise it a little while side effects climb. This is the receptor-level reason that "more" is rarely "better" once a drug is in its window.

:::widget curve
{"kind": "dose-response", "title": "Potency, efficacy and the partial agonist ceiling", "caption": "Move the sliders. A more potent drug shifts the curve to the left (less drug needed for the same effect); a more efficacious drug raises the top of the curve. A partial agonist has a lower ceiling: in a high-dopamine state it lowers net signalling, in a low-dopamine state it raises it. Antagonists shift the agonist curve rightwards without a ceiling of their own."}
:::

:::widget receptor
{"receptor": "D2", "title": "Why a partial agonist can occupy most receptors without parkinsonism", "caption": "Set the receptor to partial agonist and imagine 90% of receptors filled this way. Each still passes some signal, so movement circuits keep working, while the excess dopamine signal of psychosis is reduced. Compare with an antagonist at the same occupancy."}
:::

### Exceptions that prove the rule
- **Clozapine and quetiapine** are effective at **low D2 occupancy** (often below 60%) and with **fast dissociation** ("hit and run"), which spares movement and prolactin. Their efficacy must come partly from other targets and from the timing of binding.
- **Partial agonists** (aripiprazole, brexpiprazole, cariprazine) occupy **90% or more** of D2 receptors at therapeutic doses without the usual parkinsonism, because each occupied receptor still transmits some signal. Their side effect is **akathisia**, not rigidity.
- **Amisulpride** at low doses preferentially blocks presynaptic D2 and D3 autoreceptors, increasing dopamine release, which may underlie its effect on negative symptoms.

:::widget layers
{"title": "The spectrum of intrinsic activity at D2 receptors", "shape": "stack", "layers": [{"label": "Full agonist (dopamine itself, bromocriptine)", "detail": "Maximal signalling. Too much in the mesolimbic pathway is linked with psychosis."}, {"label": "Partial agonist with higher activity (older experimental agents)", "detail": "Too much intrinsic activity: can worsen psychosis. Never marketed as antipsychotics."}, {"label": "Aripiprazole", "detail": "About a quarter to a third of dopamine's activity. Stabilises; more akathisia, little prolactin or parkinsonism."}, {"label": "Brexpiprazole and cariprazine", "detail": "Lower intrinsic activity than aripiprazole (brexpiprazole), or D3 preference (cariprazine). Slightly less akathisia, a little more like an antagonist."}, {"label": "Silent antagonist (haloperidol, risperidone)", "detail": "No signalling. Blocks dopamine fully at high occupancy: effective, but movement and prolactin effects."}], "caption": "Tap each layer, from most to least signalling. The 'Goldilocks' zone for antipsychotic action is between too much and none."}
:::

### Serotonin 2A and the atypical idea
Most second-generation drugs block **5-HT2A** more strongly than D2. 5-HT2A receptors on cortical neurons and on nigrostriatal dopamine terminals act as a brake on dopamine release. Blocking them releases some dopamine in the striatum and prefrontal cortex, which may offset D2 blockade where it is unwanted (movement, cognition). Pimavanserin, a selective 5-HT2A inverse agonist with no D2 action, treats Parkinson's disease psychosis, showing that 5-HT2A alone can have antipsychotic effects in some conditions.

:::widget figure
{"id": "antipsychotic-d2"}
:::

### Beyond dopamine: muscarinic antipsychotics
A new class works without blocking D2 at all. **Xanomeline**, an agonist at M1 and M4 muscarinic receptors in the brain, reduces dopamine release in the striatum through M4 receptors on cholinergic interneurons and dopamine terminals, and may improve cognition through M1. Its peripheral cholinergic side effects (nausea, vomiting, sweating) are blocked by **trospium**, a muscarinic antagonist that does not enter the brain. The combination, xanomeline-trospium, was approved in the US in 2024 for schizophrenia, the first new antipsychotic mechanism in decades.

:::widget flow
{"title": "How xanomeline-trospium splits brain and body", "layout": "chain", "nodes": [{"id": "a", "label": "Xanomeline enters the brain", "detail": "Stimulates M1 and M4 muscarinic receptors."}, {"id": "b", "label": "M4 in the striatum", "detail": "Muscarinic M4 activation reduces dopamine release from midbrain neurons projecting to the striatum, lowering the excess dopamine linked to psychosis, without blocking D2."}, {"id": "c", "label": "M1 in the cortex", "detail": "May support cognition and modulate cortical circuits."}, {"id": "d", "label": "Xanomeline also acts in the body", "detail": "Peripheral muscarinic stimulation causes nausea, vomiting, sweating and salivation."}, {"id": "e", "label": "Trospium blocks the body's receptors", "detail": "A quaternary amine that stays out of the brain, it blocks peripheral muscarinic receptors and reduces those side effects."}, {"id": "f", "label": "Remaining side effects", "detail": "Constipation, dyspepsia, raised pulse, urinary retention risk; little weight gain, prolactin or EPS."}], "caption": "Press Play. Two molecules, one designed for the brain and one designed to stay out of it."}
:::

:::widget decide
{"scene": "Dr Arora, a trainee in Delhi, has a patient with schizophrenia who has only partly responded to an adequate trial of risperidone 6 mg with good adherence. He proposes raising risperidone to 12 mg 'to push D2 occupancy higher'.", "ask": "What does receptor pharmacology suggest?", "choices": [{"label": "Raise to 12 mg; more occupancy means more response", "verdict": "harm", "outcome": "The patient develops marked parkinsonism and galactorrhoea, with no gain in response.", "why": "At 6 mg risperidone D2 occupancy is already at or above the therapeutic window. Further increases add side effects, not efficacy."}, {"label": "Check adherence and plasma level if possible, consider comorbid substance use, then switch to a different antipsychotic; if two adequate trials fail, offer clozapine", "verdict": "best", "outcome": "The level confirms adequate exposure. After a trial of olanzapine fails, clozapine produces a clear response.", "why": "Non-response at adequate occupancy points to a different neurobiology (for example normal striatal dopamine synthesis in treatment-resistant schizophrenia), which further D2 blockade does not address."}, {"label": "Add a second antipsychotic of the same kind indefinitely", "verdict": "ok", "outcome": "Little benefit; side effects increase.", "why": "Antipsychotic polypharmacy has limited evidence except for specific combinations such as clozapine plus aripiprazole or amisulpride."}]}
:::

:::clinician
### Deeper points
- **Occupancy and dose**: haloperidol about 2 to 5 mg/day reaches 65% to 80%; risperidone about 2 to 4 mg/day; olanzapine about 10 to 20 mg/day; these values match the lower ends of effective dose ranges in first-episode trials.
- **Kinetic dissociation (k-off)**: quetiapine and clozapine dissociate rapidly from D2, allowing phasic dopamine signalling; transient high occupancy after a dose can fall to low levels before the next.
- **Treatment-resistant schizophrenia**: PET studies show normal presynaptic dopamine synthesis capacity in many treatment-resistant patients, compared with raised synthesis in responders, supporting a "non-dopaminergic" subtype; glutamate abnormalities in the anterior cingulate have also been reported.
- **5-HT1A partial agonism** (aripiprazole, brexpiprazole, lurasidone, cariprazine, vortioxetine, buspirone) may contribute to anxiolytic and antidepressant effects.
- **Xanomeline-trospium**: approved in the US in September 2024 for adults with schizophrenia after positive acute trials; an adjunctive trial in 2025 did not reach significance on its primary outcome; trials in Alzheimer's disease psychosis were expected to report by late 2026. Not marketed in India as of Nov 2026. Other muscarinic agents (for example M4 positive allosteric modulators) have had mixed trial results.
- **TAAR1 agonists** (ulotaront, ralmitaront) failed to separate from placebo in phase 3 schizophrenia trials, a reminder that new mechanisms do not always translate.
:::

:::recall
1. What is the usual striatal D2 occupancy window for antipsychotic effect? || About 65% to 80%.
2. Above what occupancy do movement side effects become likely? || About 78% to 80%.
3. Why can aripiprazole occupy over 90% of D2 receptors without parkinsonism? || As a partial agonist, each occupied receptor still transmits some signal.
4. How does xanomeline reduce psychosis without blocking D2? || M4 muscarinic agonism reduces striatal dopamine release.
5. Why is trospium added to xanomeline? || To block peripheral muscarinic side effects without entering the brain.
:::

:::mcq
Q: A patient on haloperidol 20 mg has severe parkinsonism and no further improvement over 10 mg. The best explanation is:
- Haloperidol is not an antipsychotic
- *D2 occupancy was already in the therapeutic window; extra dose mainly adds side effects
- Tolerance to haloperidol
- Haloperidol is a partial agonist
> Hyperbolic dose-occupancy relationship.

Q: Which drug treats Parkinson's disease psychosis through selective 5-HT2A inverse agonism?
- Haloperidol
- *Pimavanserin
- Risperidone
- Amisulpride
> No D2 action, so no worsening of parkinsonism.
:::

## 3.2 Enzymes, genes and blood levels [core][advanced]
Two people given the same dose can have very different blood levels. The reasons are **liver enzymes**, **genes**, **other medicines**, **smoking**, **age** and **organ function**. At this level you should be able to predict the main interactions from first principles.

### The key cytochrome P450 enzymes
| Enzyme | Important substrates | Strong inhibitors | Inducers |
|---|---|---|---|
| **CYP1A2** | Clozapine, olanzapine, duloxetine, agomelatine, caffeine, theophylline | Fluvoxamine, ciprofloxacin | **Tobacco smoke** (not nicotine), omeprazole, charcoal-grilled meat |
| **CYP2D6** | Tricyclics, risperidone, aripiprazole, haloperidol, atomoxetine, vortioxetine, venlafaxine, codeine and tramadol (activated), tamoxifen (activated), many beta-blockers | **Fluoxetine, paroxetine, bupropion**, duloxetine (moderate), quinidine | Not readily induced |
| **CYP3A4** | Quetiapine, lurasidone, aripiprazole, cariprazine, buprenorphine, methadone, alprazolam, midazolam, zolpidem, many others | Ketoconazole, clarithromycin, ritonavir, grapefruit, fluvoxamine (moderate) | **Carbamazepine**, phenytoin, rifampicin, St John's wort, modafinil (mild) |
| **CYP2C19** | Citalopram, escitalopram, sertraline (partly), clobazam, diazepam, omeprazole, clopidogrel (activated) | Fluvoxamine, fluoxetine (moderate), omeprazole | Rifampicin |
| **UGT enzymes** | Lamotrigine, valproate, lorazepam | Valproate inhibits lamotrigine glucuronidation | Carbamazepine, oral contraceptives (oestrogen induces lamotrigine metabolism) |

:::widget flow
{"title": "Predicting an interaction step by step", "layout": "chain", "nodes": [{"id": "a", "label": "Name the victim drug", "detail": "The drug whose level may change. Is its therapeutic index narrow (clozapine, lithium, tricyclics, carbamazepine)?"}, {"id": "b", "label": "Find its main clearance route", "detail": "Which enzyme, or the kidney? For clozapine, CYP1A2 (with 3A4 and 2C19)."}, {"id": "c", "label": "Name the perpetrator", "detail": "Does the new drug or habit inhibit, induce, or compete for that route? Fluvoxamine strongly inhibits 1A2; smoke induces it."}, {"id": "d", "label": "Predict direction and timing", "detail": "Inhibition raises levels within days. Induction lowers levels more slowly, as new enzyme is made, and wears off just as slowly after stopping."}, {"id": "e", "label": "Decide and monitor", "detail": "Avoid, adjust dose, or monitor levels and clinical signs; tell the patient what to watch for."}], "caption": "Press Play. Every interaction question can be answered with these five steps."}
:::

### Genes that change drug handling
- **CYP2D6** and **CYP2C19** vary widely between people. **Poor metabolisers** build up higher levels and more side effects from substrates; **ultrarapid metabolisers** may get little effect, or too much active product from prodrugs such as codeine. International guidelines suggest dose adjustments for some antidepressants and antipsychotics by genotype.
- **HLA-B*15:02**: strongly linked to severe skin reactions with **carbamazepine** (and to a lesser extent oxcarbazepine, phenytoin and lamotrigine) in people of South and Southeast Asian ancestry. Testing before carbamazepine is recommended where available.
- **HLA-A*31:01**: linked to carbamazepine hypersensitivity in several ancestries.


:::widget journey
{
 "drug": "Risperidone",
 "target": "dopamine D2 and serotonin 2A receptors",
 "route": "oral",
 "notes": {
  "liver": "CYP2D6 converts risperidone into 9-hydroxyrisperidone, which is paliperidone and almost as active. A poor metaboliser makes less of it but keeps more risperidone, so the total active amount changes less than you might expect.",
  "blood": "The useful number is the sum of the two, the active moiety.",
  "out": "Paliperidone leaves mainly through the kidneys, so kidney disease, not CYP2D6, is what most changes it."
 },
 "caption": "Stop at the liver and then at the exit. A gene result matters most when it changes the total amount of active drug, not just which molecule carries it."
}
:::

### When to measure blood levels
**Therapeutic drug monitoring** is essential for lithium; strongly recommended for clozapine (and useful for olanzapine) when response is poor or toxicity suspected; useful for valproate, carbamazepine and tricyclics (especially nortriptyline); and helpful for checking adherence for many drugs.

:::widget sort
{"prompt": "Will the level of the first medicine rise or fall?", "buckets": ["Rises", "Falls"], "items": [{"text": "Quetiapine when carbamazepine is added", "bucket": 1}, {"text": "Risperidone when fluoxetine is added", "bucket": 0}, {"text": "Clozapine when ciprofloxacin is added", "bucket": 0}, {"text": "Lamotrigine when an oestrogen-containing contraceptive is started", "bucket": 1}, {"text": "Aripiprazole when paroxetine is added", "bucket": 0, "why": "Halve the aripiprazole dose with strong CYP2D6 inhibitors."}, {"text": "Methadone when rifampicin is started for tuberculosis", "bucket": 1, "why": "Withdrawal may follow; dose increases are often needed."}, {"text": "Lurasidone when clarithromycin is added", "bucket": 0, "why": "Strong CYP3A4 inhibitors are contraindicated with lurasidone."}, {"text": "Olanzapine when a heavy smoker is admitted to a no-smoking ward", "bucket": 0}]}
:::

:::widget decide
{"scene": "Ms Lalthlamuani, 27, of Mizo ancestry, has bipolar disorder and epilepsy. Her neurologist suggests carbamazepine. She has never had a severe drug reaction.", "ask": "What should happen before starting carbamazepine?", "choices": [{"label": "Start at once; skin reactions are rare", "verdict": "harm", "outcome": "Soon after, she develops blistering of the skin and mouth (Stevens-Johnson syndrome) and is admitted to a burns unit.", "why": "People of Southeast Asian and some South Asian ancestry have higher rates of HLA-B*15:02, which sharply increases the risk of SJS and TEN with carbamazepine."}, {"label": "Test for HLA-B*15:02 if available; if positive or if testing is not possible and risk is high, choose an alternative (for example lithium for bipolar disorder or levetiracetam for epilepsy after discussion with the neurologist)", "verdict": "best", "outcome": "She tests positive. Alternatives are chosen; she stays well without a skin reaction.", "why": "Pre-emptive HLA testing prevents a large share of carbamazepine-induced SJS and TEN in at-risk populations."}, {"label": "Start carbamazepine with an antihistamine to prevent rash", "verdict": "harm", "outcome": "The antihistamine does not prevent the immune reaction.", "why": "SJS and TEN are T-cell mediated, not prevented by antihistamines."}]}
:::

:::clinician
### Detail for prescribers
- **Induction timing**: carbamazepine auto-induction completes over 2 to 4 weeks; after stopping an inducer, enzyme levels fall over 1 to 3 weeks, so substrates (clozapine, quetiapine) may rise to toxicity. Smoking cessation raises clozapine levels by about 50% within a week; reduce clozapine by about 25% to 33% and check levels.
- **Prodrugs**: codeine and tramadol need CYP2D6 for analgesic activation (fluoxetine and paroxetine reduce their effect and tramadol adds serotonin and seizure risk); clopidogrel needs CYP2C19 (omeprazole and fluoxetine reduce its activation).
- **Pharmacogenomic guidance**: CPIC-style recommendations for CYP2D6 and CYP2C19 with SSRIs (for example consider 50% dose reduction of escitalopram or sertraline in CYP2C19 poor metabolisers), tricyclics, atomoxetine, aripiprazole, brexpiprazole, iloperidone, pimozide and vortioxetine; routine pre-emptive panel testing has mixed cost-effectiveness evidence; consider in repeated intolerance or non-response.
- **CYP2D6 in India**: poor metaboliser frequency is roughly 2% to 5%, and CYP2C19 poor metaboliser frequency is higher in South Asians (around 10% to 20% or more) than in Europeans; this affects escitalopram, citalopram, sertraline and clopidogrel exposure.
- **HLA-B*15:02** carrier rates: about 10% to 15% in parts of Southeast Asia; variable across Indian populations (reported up to several percent in some communities, higher in some north-eastern groups).
- **TDM ranges**: lithium 0.6 to 1.0 mmol/L (12 hours post dose); clozapine at least 350 micrograms per litre; olanzapine about 20 to 40 micrograms per litre; valproate 50 to 125 mg/L (mania often 80 to 125); carbamazepine 4 to 12 mg/L; nortriptyline 50 to 150 ng/mL; amitriptyline plus nortriptyline about 80 to 200 ng/mL.
- **Renal impairment**: reduce or avoid lithium, amisulpride, sulpiride, paliperidone, pregabalin, gabapentin, memantine, acamprosate, desvenlafaxine; **hepatic impairment**: reduce duloxetine (avoid), agomelatine (avoid), valproate (avoid in severe), many antipsychotics and antidepressants; prefer lorazepam among benzodiazepines.
:::

:::recall
1. Which enzyme does tobacco smoke induce, and which antipsychotics does that affect? || CYP1A2; clozapine and olanzapine.
2. Name three strong CYP2D6 inhibitors. || Fluoxetine, paroxetine, bupropion.
3. Name three strong enzyme inducers. || Carbamazepine, phenytoin, rifampicin (also St John's wort).
4. Why do induction interactions take longer than inhibition interactions? || New enzyme has to be made, and later lost, which takes time.
5. Which medicines need regular blood levels? || Lithium (essential), clozapine, valproate, carbamazepine, nortriptyline when indicated.
:::

:::mcq
Q: A patient on clozapine is prescribed ciprofloxacin for a urinary infection. The likely effect is:
- Lower clozapine levels
- *Higher clozapine levels, with risk of sedation and seizures
- No change
- Agranulocytosis directly caused by ciprofloxacin
> Ciprofloxacin inhibits CYP1A2.

Q: Codeine gives little pain relief to a patient on fluoxetine because:
- Fluoxetine blocks opioid receptors
- *Fluoxetine inhibits CYP2D6, which activates codeine to morphine
- Codeine induces fluoxetine metabolism
- They compete for the kidney
> Prodrug activation is blocked.
:::

## 3.3 Dangerous syndromes and how to tell them apart [core][advanced]
Several drug-induced emergencies share fever, confusion and muscle signs. Telling them apart quickly changes treatment.

:::widget flow
{"title": "A hot, confused patient on psychiatric medicines: first sorting", "layout": "tree", "nodes": [{"id": "r", "label": "Hot, confused, on psychotropics", "detail": "Check airway, breathing, circulation, temperature, glucose. Then look at the muscles, pupils, skin and the drug history."}, {"id": "ss", "label": "Serotonin toxicity", "detail": "Onset within hours of adding or increasing a serotonergic drug. Clonus (inducible, ocular), hyperreflexia worse in the legs, tremor, agitation, sweating, diarrhoea, dilated pupils.", "parent": "r"}, {"id": "nms", "label": "Neuroleptic malignant syndrome", "detail": "Onset over days, often after starting or raising an antipsychotic or stopping a dopamine agonist. Lead-pipe rigidity, slow responses, fever, autonomic instability, very high creatine kinase.", "parent": "r"}, {"id": "ach", "label": "Anticholinergic toxicity", "detail": "Hot, dry, flushed skin; dilated pupils; urinary retention; absent bowel sounds; delirium with picking behaviour; no sweating.", "parent": "r"}, {"id": "li", "label": "Lithium toxicity", "detail": "Coarse tremor, ataxia, dysarthria, myoclonus, vomiting and diarrhoea, confusion; check the lithium level and kidney function.", "parent": "r"}, {"id": "mh", "label": "Malignant hyperthermia", "detail": "During anaesthesia with volatile agents or suxamethonium; rigidity and rapidly rising temperature; treated with dantrolene in theatre.", "parent": "r"}, {"id": "inf", "label": "Infection, delirium, withdrawal", "detail": "Always consider sepsis, encephalitis, alcohol or benzodiazepine withdrawal, thyroid storm and heat stroke too.", "parent": "r"}], "caption": "Tap each branch. Pace of onset, the muscle signs and the drug history do most of the sorting."}
:::

| Feature | Serotonin toxicity | Neuroleptic malignant syndrome | Anticholinergic toxicity |
|---|---|---|---|
| Typical cause | Two or more serotonergic drugs; overdose; MAOI combinations | Antipsychotics (especially high-potency, rapid escalation, IM, dehydration); stopping levodopa | Tricyclics, antihistamines, trihexyphenidyl, datura and other plants |
| Onset | Hours | Days | Hours |
| Muscles | Clonus, hyperreflexia, tremor | Lead-pipe rigidity, slowed movement | Normal tone |
| Pupils | Dilated | Normal | Dilated |
| Skin | Sweaty | Sweaty | Hot and dry |
| Bowel | Hyperactive, diarrhoea | Normal or reduced | Absent sounds |
| Mental state | Agitation | Stupor, mutism | Delirium, picking |
| Key test | Clinical (Hunter criteria) | Creatine kinase very high, white count raised | Clinical; ECG for QRS in tricyclics |
| First treatment | Stop drugs, cool, benzodiazepines; cyproheptadine | Stop antipsychotic, cool, fluids, benzodiazepines; bromocriptine or dantrolene; ICU | Stop drug, supportive care; physostigmine only in specialist settings and never in tricyclic overdose |

:::widget sort
{"prompt": "Which syndrome? Place each patient.", "buckets": ["Serotonin toxicity", "Neuroleptic malignant syndrome", "Anticholinergic toxicity"], "items": [{"text": "On sertraline, given tramadol for a fracture; within hours: shivering, sweating, ankle clonus, agitation", "bucket": 0}, {"text": "Four days after haloperidol was increased: rigid, mute, fever 39.5 degrees, creatine kinase 18,000", "bucket": 1}, {"text": "Elderly man on amitriptyline and chlorpheniramine: hot, dry, flushed, urinary retention, picking at the air", "bucket": 2}, {"text": "On an MAOI, took a cough syrup with dextromethorphan: tremor, hyperreflexia, temperature rising", "bucket": 0}, {"text": "Man with Parkinson's disease whose levodopa was stopped on admission: rigid, feverish, unstable blood pressure", "bucket": 1, "why": "A neuroleptic malignant-like syndrome from dopamine withdrawal; restart dopaminergic treatment."}, {"text": "Young man after eating datura seeds: delirious, dry mouth, very dilated pupils, fast heart", "bucket": 2}]}
:::


:::widget compare
{
 "title": "Serotonin toxicity and NMS at the bedside",
 "a": {
  "label": "Serotonin toxicity",
  "points": [
   "Starts within hours of a new or added serotonergic drug",
   "Shivering, sweating, diarrhoea, dilated pupils",
   "Clonus and brisk reflexes, worse in the legs",
   "Restless and agitated",
   "Usually settles within a day once the drugs stop"
  ],
  "summary": "Fast, jerky and wet."
 },
 "b": {
  "label": "Neuroleptic malignant syndrome",
  "points": [
   "Develops over days after starting or raising a dopamine blocker",
   "Lead-pipe rigidity, slow movements, mute",
   "Reflexes normal or reduced; no clonus",
   "High creatine kinase, often very high",
   "Takes a week or more to settle"
  ],
  "summary": "Slow, stiff and still."
 },
 "caption": "Slide between the two. Both bring fever, a fast heart and confusion, so look at the speed of onset and at the muscles: clonus points one way, rigidity the other."
}
:::

### Other serious reactions to know
- **QT prolongation and torsades de pointes**: risk rises with several QT drugs together, high doses, low potassium or magnesium, bradycardia, heart disease, and congenital long QT. Citalopram, escitalopram (high dose), haloperidol (IV), ziprasidone, pimozide, sertindole, tricyclics and methadone are among the important ones.
- **Agranulocytosis**: clozapine most famously, also carbamazepine and mirtazapine rarely. Fever or sore throat means an urgent blood count.
- **Severe skin reactions**: carbamazepine, lamotrigine, phenytoin, oxcarbazepine; stop at the first sign of a widespread rash with fever, mucosal involvement or blistering.
- **Hyponatraemia**: SSRIs, SNRIs, carbamazepine, oxcarbazepine, especially in older adults.
- **Hepatotoxicity**: valproate, agomelatine, duloxetine, chlorpromazine (cholestatic), naltrexone at high doses, disulfiram.
- **Metabolic syndrome**: clozapine, olanzapine, and to a lesser degree quetiapine and risperidone.

:::widget decide
{"scene": "Mr Pradeep, 33, from Bhubaneswar, was admitted with mania and given haloperidol 10 mg IM twice yesterday plus oral olanzapine 20 mg. He has not drunk much. Today he is mute and stiff, his temperature is 39.2 degrees, his pulse is 132 and his blood pressure swings between high and low. His creatine kinase is 9,800.", "ask": "What do you do?", "choices": [{"label": "Give more haloperidol IM because he seems withdrawn and catatonic", "verdict": "harm", "outcome": "He develops kidney failure from muscle breakdown and needs dialysis.", "why": "This is neuroleptic malignant syndrome. More antipsychotic worsens it. Rapid escalation, IM high-potency drugs and dehydration are risk factors."}, {"label": "Stop all antipsychotics, transfer to medical high-dependency care, cool him, give IV fluids, check kidney function, give lorazepam, and consider bromocriptine or dantrolene with the medical team", "verdict": "best", "outcome": "His temperature and creatine kinase fall over several days. After recovery, a low-potency antipsychotic is restarted cautiously after a safe gap, with slow titration.", "why": "Stopping the cause and supportive care are the core. Benzodiazepines help rigidity and catatonic features. Rechallenge is possible later with care."}, {"label": "Give paracetamol and continue the same treatment", "verdict": "harm", "outcome": "He deteriorates.", "why": "Fever in NMS is central, not peripheral; antipyretics alone do little."}]}
:::

:::clinician
### Criteria and management detail
- **Hunter criteria** for serotonin toxicity (in the presence of a serotonergic agent): spontaneous clonus; or inducible clonus with agitation or diaphoresis; or ocular clonus with agitation or diaphoresis; or tremor with hyperreflexia; or hypertonia with temperature above 38 degrees and ocular or inducible clonus. Treatment: stop serotonergic drugs, supportive care, benzodiazepines, cyproheptadine 12 mg then 2 mg every 2 hours if symptoms continue (maximum about 32 mg/day; oral or via nasogastric tube), cooling; severe hyperthermia needs ICU, paralysis and intubation (avoid physical restraint, which worsens hyperthermia).
- **NMS** (DSM-5-TR features): exposure to a dopamine antagonist within 72 hours; hyperthermia; generalised rigidity; creatine kinase at least 4 times the upper limit; altered mental state; autonomic lability; tachycardia; tachypnoea; exclusion of other causes. Incidence about 0.01% to 0.02% of antipsychotic-treated patients; mortality now under 10%. Risk factors: dehydration, agitation, restraint, IM and high-potency agents, rapid titration, lithium co-prescription, catatonia, iron deficiency. Bromocriptine 2.5 mg two or three times daily (up to 45 mg/day); dantrolene 1 to 2.5 mg/kg IV; ECT for refractory cases. Rechallenge: wait at least 2 weeks, use a low-potency or partial agonist drug, titrate slowly, keep hydrated.
- **QTc thresholds**: QTc above 450 ms (men) or 470 ms (women) prompts review; above 500 ms is a high risk for torsades (stop the culprit, correct potassium and magnesium, cardiology advice). Use the Fridericia correction at high heart rates.
- **Anticholinergic toxicity**: the classic phrase "hot as a hare, dry as a bone, red as a beet, blind as a bat, mad as a hatter, full as a flask" captures hyperthermia, anhidrosis, flushing, mydriasis, delirium and urinary retention. Physostigmine reverses it but can cause bradycardia, bronchospasm and seizures, and is contraindicated with QRS widening from tricyclics.
- **DRESS** (drug reaction with eosinophilia and systemic symptoms): onset 2 to 8 weeks after starting carbamazepine, lamotrigine, phenytoin or others; fever, rash, lymphadenopathy, eosinophilia, liver injury; stop the drug; corticosteroids under specialist care.
:::

:::recall
1. Which muscle sign points to serotonin toxicity rather than NMS? || Clonus and hyperreflexia (versus lead-pipe rigidity in NMS).
2. Which test is markedly raised in NMS? || Creatine kinase.
3. How does anticholinergic toxicity differ from serotonin toxicity on the skin? || Hot and dry in anticholinergic toxicity; sweaty in serotonin toxicity.
4. Name four risk factors for NMS. || Dehydration, rapid titration, IM high-potency antipsychotics, agitation and restraint, lithium, catatonia.
5. Name four factors that raise the risk of torsades de pointes. || Several QT drugs, high doses, low potassium or magnesium, bradycardia, heart disease, congenital long QT.
:::

:::mcq
Q: A woman on fluoxetine starts tramadol and within hours has agitation, sweating, diarrhoea and inducible ankle clonus. The diagnosis is:
- Neuroleptic malignant syndrome
- *Serotonin toxicity
- Anticholinergic toxicity
- Malignant hyperthermia
> Hours, clonus, sweating.

Q: In suspected tricyclic overdose with a widened QRS, which treatment is used?
- Physostigmine
- *Sodium bicarbonate with supportive care
- Flumazenil
- Haloperidol
> Bicarbonate narrows the QRS by overcoming sodium channel block.
:::

## 3.4 Special populations [core][advanced]
The same medicine can be safe in one person and dangerous in another. These groups need a different calculation of benefit and risk.

### Pregnancy and breastfeeding
- **Untreated illness is also a risk**: relapse of bipolar disorder, psychosis or severe depression in pregnancy and after birth carries serious danger to mother and baby.
- **Avoid valproate** (highest teratogenic and neurodevelopmental risk) and, where possible, carbamazepine and paroxetine.
- **SSRIs** (especially sertraline): generally acceptable; small risks include persistent pulmonary hypertension of the newborn and transient neonatal adaptation symptoms.
- **Lithium**: a small increased risk of heart malformations, lower than once thought; needs close level monitoring (levels fall in pregnancy and rise sharply after delivery), and planning for delivery.
- **Antipsychotics**: many have reassuring data; watch for gestational diabetes with olanzapine and quetiapine.
- **Lamotrigine**: relatively safe; levels fall in pregnancy.
- **Breastfeeding**: sertraline and paroxetine give low infant levels; avoid lithium unless specialist monitoring is possible; avoid clozapine.

:::widget layers
{"title": "Thinking through a medicine in pregnancy", "shape": "pyramid", "layers": [{"label": "The mother's and baby's overall safety", "detail": "The goal at the top. Both untreated illness and medicines carry risk; the decision weighs both."}, {"label": "Illness history", "detail": "How severe were past episodes? How quickly did relapse follow stopping before? Postpartum risk in bipolar disorder can be very high."}, {"label": "What has worked before", "detail": "A medicine that kept her well is often the best choice, rather than switching to a 'safer' drug that may not work."}, {"label": "The medicine's evidence", "detail": "Malformation risk, neonatal effects, long-term development, breastfeeding data."}, {"label": "Dose and timing", "detail": "Lowest effective dose, single agent, monitoring levels across pregnancy, planning around delivery."}, {"label": "The woman's informed choice", "detail": "The foundation. She decides with full information, ideally before conception."}], "caption": "Tap each layer, from the foundation up."}
:::

### Older adults
- **Start low, go slow, but reach a therapeutic dose.**
- Sensitive to **anticholinergic** effects, **falls**, **low sodium**, **QT** effects and **sedation**.
- Antipsychotics in **dementia** raise stroke and death risk.
- Kidney function falls with age: lithium, amisulpride, pregabalin and memantine need lower doses.

### Kidney, liver, heart and epilepsy
- **Kidney disease**: lower doses of renally cleared drugs; lithium often avoided in significant kidney disease.
- **Liver disease**: avoid duloxetine and agomelatine; caution with valproate; lorazepam over diazepam.
- **Heart disease**: avoid tricyclics after a heart attack; sertraline preferred; watch QT drugs; clozapine and myocarditis.
- **Epilepsy**: most psychiatric drugs lower the seizure threshold a little; highest risk with clozapine, bupropion, tricyclics (especially clomipramine) and chlorpromazine; SSRIs are generally safe.

### Children and adolescents
Different responses: more activation on SSRIs, much greater weight gain on antipsychotics, need for careful monitoring of growth with stimulants (see the Child and adolescent module).

:::widget sort
{"prompt": "Which choice fits each special situation best?", "buckets": ["Reasonable choice", "Poor choice"], "items": [{"text": "Sertraline for depression in a breastfeeding mother", "bucket": 0}, {"text": "Valproate for a 20-year-old woman with bipolar disorder who does not use contraception", "bucket": 1}, {"text": "Amitriptyline 75 mg for depression soon after a heart attack", "bucket": 1}, {"text": "Lorazepam rather than diazepam for alcohol withdrawal in liver failure", "bucket": 0}, {"text": "Full-dose amisulpride in severe kidney failure", "bucket": 1}, {"text": "Continuing lithium through pregnancy in a woman with severe past postpartum mania, with monitoring and fetal echocardiography", "bucket": 0}, {"text": "Bupropion for a man with uncontrolled epilepsy", "bucket": 1}]}
:::

:::clinician
### Detail
- **Lithium in pregnancy**: levels fall in the second and third trimesters as glomerular filtration rises; check monthly, then weekly from 36 weeks; at delivery, renal clearance drops abruptly, so withhold or reduce at the onset of labour and check levels within 12 to 24 hours after delivery; neonatal hypotonia, hypothyroidism and nephrogenic diabetes insipidus can occur.
- **SSRIs**: first-trimester exposure shows little or no consistent increase in major malformations (paroxetine and cardiac defects the main signal); neonatal adaptation syndrome in about 20% to 30% after late exposure (jitteriness, feeding problems, usually resolving in days); persistent pulmonary hypertension absolute risk around 3 per 1,000 versus about 2 per 1,000; slight increases in postpartum haemorrhage.
- **Antipsychotics**: large cohort data show no large increase in malformations for most (a small signal for risperidone); gestational diabetes risk with olanzapine and quetiapine; neonatal EPS or withdrawal after late exposure.
- **Breastfeeding**: relative infant dose below 10% is generally considered acceptable; sertraline, paroxetine and olanzapine have low relative infant doses; lithium relative infant dose can be 10% to 50% (monitor infant levels if used).
- **Older adults**: STOPP/START and Beers criteria; check sodium after starting SSRIs; avoid tricyclics, long-acting benzodiazepines and strongly anticholinergic drugs; prefer sertraline, escitalopram (10 mg maximum), mirtazapine; dementia antipsychotic use only for severe risk, briefly.
- **Renal dosing** (eGFR under 30): lithium usually avoided; amisulpride reduced or avoided; pregabalin and gabapentin reduced; memantine 10 mg; paliperidone avoided below 10.
- **Epilepsy**: clozapine (dose-related seizures), bupropion (contraindicated in epilepsy), clomipramine and maprotiline highest risk; ECT is not contraindicated.
:::

:::recall
1. Which mood stabiliser has the highest risk in pregnancy? || Valproate.
2. Why can untreated illness also be a risk in pregnancy? || Relapse of severe depression, bipolar disorder or psychosis harms mother and baby.
3. What happens to lithium levels after delivery? || They rise sharply as kidney clearance falls, so dose and monitoring must be planned.
4. Which antidepressant is generally preferred after a heart attack? || Sertraline.
5. Name three psychiatric medicines with the highest seizure risk. || Clozapine, bupropion, clomipramine (also chlorpromazine and other tricyclics).
:::

:::mcq
Q: In a woman with severe past postpartum mania who is stable on lithium and wants to become pregnant, the best approach is:
- Stop lithium immediately and switch to valproate
- *Plan before conception: discuss continuing lithium with monitoring, fetal echocardiography and a delivery plan, or carefully considered alternatives
- Stop all medicine during pregnancy
- Lithium is completely safe without monitoring
> Weigh relapse risk and plan with her.

Q: Which drug should be avoided in significant liver disease?
- Lorazepam
- *Duloxetine
- Lithium
- Amisulpride
> Hepatotoxicity risk.
:::

## 3.5 New and emerging medicines, as of Nov 2026 [core][advanced]
Psychopharmacology is moving beyond the monoamine model. At the Advanced level you should be able to explain the mechanism, the evidence and the honest limits of each new arrival.

:::widget flow
{"title": "New mechanisms in psychiatric medicines", "layout": "tree", "nodes": [{"id": "r", "label": "Beyond classic reuptake and D2 blockade", "detail": "Newer medicines target glutamate, GABA, muscarinic, orexin and other systems."}, {"id": "glu", "label": "Glutamate", "detail": "NMDA receptor antagonists with rapid antidepressant effects.", "parent": "r"}, {"id": "esk", "label": "Esketamine nasal spray", "detail": "For treatment-resistant depression and depression with acute suicidal thinking; given under supervision with blood pressure and dissociation monitoring.", "parent": "glu"}, {"id": "dxb", "label": "Dextromethorphan-bupropion", "detail": "NMDA antagonist and sigma-1 agonist, with bupropion to block its breakdown by CYP2D6. Approved in the US for depression.", "parent": "glu"}, {"id": "gaba", "label": "GABA-A neurosteroids", "detail": "Positive allosteric modulators at synaptic and extrasynaptic GABA-A receptors.", "parent": "r"}, {"id": "zur", "label": "Zuranolone", "detail": "A 14-day oral course for postpartum depression in the US; sedation and driving impairment.", "parent": "gaba"}, {"id": "mus", "label": "Muscarinic", "detail": "Xanomeline-trospium for schizophrenia (section 3.1).", "parent": "r"}, {"id": "orx", "label": "Orexin", "detail": "Antagonists for insomnia (daridorexant, lemborexant, suvorexant); an agonist (oveporexton) for narcolepsy type 1, approved in the US in 2026.", "parent": "r"}, {"id": "psy", "label": "Psychedelics", "detail": "5-HT2A agonists such as psilocybin, studied with psychological support; a US application for psilocybin in treatment-resistant depression was in progress in 2026.", "parent": "r"}, {"id": "amy", "label": "Anti-amyloid antibodies", "detail": "Lecanemab and donanemab for early Alzheimer's disease; donanemab launched in India in 2026 (see the Delirium and dementia module).", "parent": "r"}], "caption": "Tap each branch. Most are approved in some countries but not yet in India."}
:::

### Esketamine and ketamine

:::widget journey
{"drug": "esketamine", "target": "NMDA glutamate receptors on inhibitory interneurons in the prefrontal cortex", "routes": ["nasal", "iv"], "notes": {"nose": "The spray is absorbed through the nasal lining within minutes, skipping the gut and much of the liver's first pass. Peak levels come quickly, which is why dissociation and blood pressure rise during the session.", "target": "Blocking NMDA receptors on interneurons releases a burst of glutamate, activates AMPA receptors and triggers growth of new synaptic connections within hours."}, "caption": "Compare the nasal route of esketamine with intravenous ketamine. Both reach the brain fast; both need monitoring."}
:::

**Esketamine** (the S-enantiomer of ketamine), given as a **nasal spray** in a clinic, produces antidepressant effects within hours to days in some people with treatment-resistant depression. It blocks NMDA receptors on inhibitory interneurons, leading to a burst of glutamate, activation of AMPA receptors, release of brain-derived neurotrophic factor and rapid growth of synaptic connections. Side effects during the session: **dissociation**, dizziness, nausea, raised blood pressure. It has abuse potential and needs observation for about two hours after each dose. **Intravenous ketamine** is used off-label in some centres, including in India.

:::widget figure
{"id": "nmda-receptor"}
:::

### Neurosteroids
**Brexanolone** (an intravenous infusion over about 60 hours) and **zuranolone** (an oral 14-day course) are synthetic analogues of allopregnanolone, a natural neurosteroid that falls sharply after childbirth. They act on GABA-A receptors, including extrasynaptic ones, and treat **postpartum depression** rapidly.

### Psychedelics: the honest picture
Psilocybin given once or twice with psychological support has shown rapid and sometimes lasting improvement in treatment-resistant depression in phase 3 trials, with a regulatory application under way in the US in 2026. MDMA-assisted therapy for PTSD was **not approved** by the US regulator in 2024, which asked for another trial because of concerns about blinding, data integrity and safety reporting. These treatments are **not approved in India** and should never be tried outside research.


:::widget receptor
{
 "receptor": "serotonin 5-HT2A",
 "title": "Psilocybin: switching a receptor on",
 "caption": "Most psychiatric medicines block or dampen receptors. Pick Full agonist, then Partial agonist: psilocybin is turned into psilocin in the body, which strongly stimulates 5-HT2A receptors in the cortex. That is what produces the altered perception of a session. Compare with Antagonist: several antipsychotics block the same receptor and can cut a psychedelic experience short."
}
:::

:::widget decide
{"scene": "Mr Kumar, 41, a bank officer in Chennai, has had severe depression for three years despite three antidepressants and psychotherapy. He has read that 'ketamine cures depression in one day' and asks to buy esketamine spray to use at home.", "ask": "What is the most responsible response?", "choices": [{"label": "Prescribe it for home use", "verdict": "harm", "outcome": "He uses it daily, develops dissociation and craving, and his blood pressure spikes.", "why": "Esketamine must be given under supervision with monitoring because of dissociation, blood pressure effects and abuse potential."}, {"label": "Explain the evidence (rapid but often partial and temporary benefit, needing continued sessions), the risks and the supervised clinic setting; review whether his previous trials were adequate; discuss options such as augmentation (lithium or an antipsychotic), ECT, and referral to a centre that offers supervised esketamine or ketamine", "verdict": "best", "outcome": "After review, lithium augmentation is tried first; when that fails he is referred for ECT, to which he responds. Esketamine remains an option for future relapse.", "why": "Treatment-resistant depression has several evidence-based options. New treatments should be offered honestly, in the right setting, alongside established ones."}, {"label": "Tell him ketamine is just a party drug with no medical use", "verdict": "ok", "outcome": "He loses trust and searches online for illegal sources.", "why": "Ketamine and esketamine have genuine evidence; dismissal is inaccurate and risky."}]}
:::

:::widget sort
{"prompt": "Status as of Nov 2026: place each statement.", "buckets": ["Accurate", "Inaccurate"], "items": [{"text": "Esketamine nasal spray is given under supervision with observation after each dose", "bucket": 0}, {"text": "MDMA-assisted therapy was approved for PTSD in the US in 2024", "bucket": 1, "why": "The US regulator declined approval and requested a further trial."}, {"text": "Zuranolone is a short oral course for postpartum depression in the US", "bucket": 0}, {"text": "Xanomeline-trospium blocks D2 receptors like other antipsychotics", "bucket": 1, "why": "It works through muscarinic receptors without D2 blockade."}, {"text": "Psilocybin therapy is approved and available in Indian clinics", "bucket": 1}, {"text": "Dextromethorphan is combined with bupropion partly because bupropion blocks its breakdown", "bucket": 0}]}
:::

:::clinician
### Evidence and status, as of Nov 2026
- **Esketamine**: US approval 2019 for TRD with an oral antidepressant, 2020 for MDD with acute suicidal ideation, and in January 2025 as monotherapy for TRD. Dosing: 56 mg on day 1, then 56 or 84 mg twice weekly for 4 weeks, then weekly, then every 1 to 2 weeks; blood pressure before and at about 40 minutes and 2 hours; contraindicated in aneurysmal vascular disease and recent intracerebral haemorrhage. Imported nasal spray has limited availability in India; IV racemic ketamine (0.5 mg/kg over 40 minutes) is used off-label in some Indian centres.
- **Dextromethorphan-bupropion**: approved in the US in 2022 for MDD; dextromethorphan 45 mg with bupropion 105 mg once daily, then twice daily; serotonergic and seizure precautions.
- **Brexanolone**: approved 2019 (60-hour IV infusion with continuous pulse oximetry, because of excessive sedation and loss of consciousness). **Zuranolone**: approved August 2023 for postpartum depression (50 mg at night for 14 days, with fatty food); the major depressive disorder indication was not approved; driving restrictions for at least 12 hours after each dose.
- **Psilocybin (COMP360)**: two phase 3 trials in TRD reported positive primary outcomes (a single 25 mg dose in the first, two doses in the second with response maintained to 26 weeks in about 39% of the 25 mg arm); a rolling US application was expected to complete in late 2026. Functional unblinding and expectancy effects remain methodological concerns.
- **MDMA**: the US regulator issued a complete response letter in August 2024 citing the need for an additional phase 3 trial.
- **Orexin**: daridorexant (25 to 50 mg), lemborexant (5 to 10 mg) and suvorexant (10 to 20 mg) for insomnia; oveporexton approved in the US in August 2026 for narcolepsy type 1.
- **ADHD**: centanafadine (serotonin, noradrenaline and dopamine reuptake inhibitor) approved in the US in mid-2026.
- **GLP-1 receptor agonists**: being studied for alcohol use disorder and binge eating; semaglutide failed to slow early Alzheimer's disease in phase 3 trials reported in late 2025.
- **Failures worth teaching**: TAAR1 agonists in schizophrenia, many glutamatergic and anti-inflammatory add-ons, and kappa-opioid antagonists, showing how often promising mechanisms fail in phase 3.
:::

:::recall
1. How does esketamine produce rapid antidepressant effects? || NMDA blockade on interneurons, a glutamate surge, AMPA activation, BDNF release and rapid synaptogenesis.
2. Why must esketamine be given under supervision? || Dissociation, raised blood pressure, sedation and abuse potential.
3. What natural neurosteroid do brexanolone and zuranolone mimic? || Allopregnanolone.
4. What was the US regulatory outcome for MDMA-assisted therapy in 2024? || Not approved; a further trial was requested.
5. Why is bupropion combined with dextromethorphan? || It inhibits CYP2D6, slowing dextromethorphan's breakdown (and adds its own antidepressant effect).
:::

:::mcq
Q: Esketamine's main side effects during a session include:
- Weight gain and diabetes
- *Dissociation and raised blood pressure
- Agranulocytosis
- Tardive dyskinesia
> Monitor for about two hours.

Q: Zuranolone is approved in the US for:
- Schizophrenia
- *Postpartum depression
- ADHD
- Alcohol use disorder
> A 14-day oral neurosteroid course.
:::
`;
