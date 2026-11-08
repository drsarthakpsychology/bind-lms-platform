/* Module · antipsychotics, Part V (Advanced). Original text written for VIBHA School of Psychology. */
export const advanced = String.raw`

# Part V · Advanced: occupancy, receptors, kinetics and the new mechanisms

## 5.1 Occupancy, affinity and the fast-off idea [core][advanced]
Brain imaging with PET lets us measure what fraction of D2 receptors a dose actually occupies in a living person. These studies turned antipsychotic dosing from guesswork into something close to a law.

### What occupancy studies showed
| D2 occupancy in the striatum | What tends to happen |
|---|---|
| Below about 60% | Many people do not respond |
| About 65 to 80% | Antipsychotic response, with few movement side effects |
| From about 72% | Prolactin rises (the pituitary also sees the drug) |
| Above about 78 to 80% | Movement side effects become likely |

In first-episode patients, about 2 to 5 mg of haloperidol already reaches the therapeutic window. Older practice used doses many times higher, giving more side effects without more benefit. Occupancy rises along a curve that flattens: each extra milligram adds less occupancy than the one before, but side effects keep rising.

:::widget curve
{"kind": "dose-response", "title": "Occupancy and response: where the window sits", "caption": "Move the sliders. Picture the response curve levelling off near 65 to 80% occupancy, and a second, side-effect curve starting to climb steeply just after it. A high-potency drug reaches both at low milligram doses, so its safe window is narrow in milligrams."}
:::

### Affinity, and why clozapine and quetiapine are different
**Affinity** is how tightly a drug binds, usually given as Ki (the concentration that occupies half the receptors; lower Ki means tighter binding). Most antipsychotics bind D2 more tightly than dopamine itself. Clozapine and quetiapine bind D2 more loosely than dopamine.

The **fast-off hypothesis** suggests that loose binders let go of the receptor quickly, within seconds to minutes, and so let natural, phasic bursts of dopamine through. The receptor is blocked "on average" but not continuously. This could explain few movement side effects and little prolactin rise. A second idea, that strong **5-HT2A block** matters most, explains why risperidone causes few movement problems at low doses but many at higher doses. Both ideas probably carry part of the truth.

| Drug | D2 binding | 5-HT2A to D2 ratio | Typical clinical D2 occupancy |
|---|---|---|---|
| Haloperidol | Very tight | Low | High, rises easily above 80% |
| Risperidone | Tight | High | Rises above 80% above about 6 mg |
| Olanzapine | Moderate | High | 60 to 80% at 10 to 20 mg |
| Quetiapine | Loose, fast-off | Moderate | Often transiently 60%, then falls |
| Clozapine | Loose, fast-off | High | About 40 to 60% |
| Aripiprazole | Very tight, but partial | Moderate | Over 90%, without EPS, because it partly activates |

:::widget receptor
{"receptor": "5-HT2A", "title": "Serotonin 2A: antagonist or inverse agonist?", "caption": "Most second-generation drugs act as antagonists or inverse agonists at 5-HT2A. Pick Inverse agonist: the signal drops below background. That is pimavanserin, which blocks 5-HT2A without touching D2 and was approved in the US in 2016 for hallucinations and delusions in Parkinson's disease. It shows that serotonin 2A activity alone can drive psychosis, as psychedelics also suggest."}
:::

:::widget worked
{"title": "Reading an occupancy problem", "steps": [{"q": "A first-episode patient on haloperidol 10 mg is stiff and slow but no longer hears voices. Imaging would probably show what occupancy?", "a": "Above about 80%: past the point where movement side effects start, with no extra benefit for the voices."}, {"q": "What would lowering the dose to 4 mg likely do?", "a": "Bring occupancy back into the 65 to 80% window: the voices stay controlled and the stiffness eases."}, {"q": "Why does aripiprazole reach over 90% occupancy without such stiffness?", "a": "Because it is a partial agonist: even when it fills nearly every receptor, it keeps about a quarter to a third of the normal signal, so the movement circuit still receives some dopamine-like input."}], "yourTurn": [{"q": "A man on quetiapine 600 mg has a brief rise in D2 occupancy after each dose, then a fall within hours. Why might he still improve?", "a": "The fast-off and transient occupancy model suggests that a high peak for some hours each day may be enough to calm psychosis, while low troughs spare movement and prolactin. His 5-HT2A and other receptor actions also contribute."}]}
:::

:::recall
1. Give the occupancy thresholds for response, prolactin rise and movement side effects. || About 65%; about 72%; about 78 to 80%.
2. What is the fast-off hypothesis? || Loose D2 binders let go quickly, allowing phasic dopamine through, so they cause fewer EPS and less prolactin rise.
3. Why can aripiprazole occupy over 90% of D2 receptors without EPS? || Partial agonism keeps part of the signal.
4. What does pimavanserin's success in Parkinson's psychosis suggest? || 5-HT2A activity alone can drive psychosis.
:::

:::mcq
Q: In a first-episode patient, increasing haloperidol from 4 mg to 15 mg will most likely:
- Double the antipsychotic effect
- *Push D2 occupancy past 80%, adding movement side effects with little extra benefit
- Lower prolactin
- Reduce akathisia
> Occupancy curves flatten; side effects climb.
:::

## 5.2 Partial agonists: the dopamine stabiliser idea [core][advanced]
A partial agonist binds the receptor and produces only part of the full response. Its **intrinsic activity** is the percentage of the full agonist's effect it can produce. Aripiprazole has about a quarter to a third of dopamine's activity at D2; brexpiprazole has less; cariprazine sits between and binds D3 even more tightly than D2.

### Why a partial agonist "stabilises"
- In the mesolimbic pathway, where dopamine is too high, the partial agonist displaces dopamine and lowers the signal to its own level: an antipsychotic effect.
- In the pituitary and the movement circuit, it keeps some signal, so prolactin falls and movement side effects are rare.
- If the partial agonist's activity is too high, it acts like a weak dopamine booster: nausea, insomnia, restlessness and, rarely, impulse-control problems (gambling, shopping, eating).

:::widget receptor
{"receptor": "D2", "title": "The dimmer switch at work", "caption": "Pick Full agonist (dopamine in an overactive pathway), then Partial agonist: the signal falls. Now imagine the pituitary, where blocking drugs had pushed the signal to background: switch from Antagonist to Partial agonist and the signal rises. Same drug, opposite direction, depending on what was there before."}
:::

| | Aripiprazole | Brexpiprazole | Cariprazine |
|---|---|---|---|
| D2 intrinsic activity | Moderate | Lower | Moderate |
| D3 | Partial agonist | Partial agonist | Partial agonist, about ten times stronger at D3 than D2 |
| 5-HT1A | Partial agonist | Partial agonist (stronger) | Partial agonist |
| 5-HT2A | Antagonist | Antagonist (stronger) | Antagonist |
| Main side effect | Akathisia, nausea, insomnia | Less akathisia; mild weight gain | Akathisia; very long-lived metabolite |
| Approved uses (US) | Schizophrenia, mania, add-on in depression, irritability in autism, Tourette's | Schizophrenia, add-on in depression, agitation in Alzheimer's dementia | Schizophrenia, mania, bipolar depression, add-on in depression |

:::widget figure
{"id": "partial-agonist"}
:::

### Switching onto a partial agonist
Moving from a strong blocker (such as olanzapine or haloperidol) to aripiprazole needs care. Months of D2 blockade can make D2 receptors more numerous and more sensitive. Replacing a full blocker with a drug that partly stimulates them can cause a rebound: restlessness, insomnia and occasionally a worsening of psychosis. A gradual cross-taper, sometimes over weeks, usually avoids this.

:::widget decide
{"scene": "Ms Ahmed, 32, in Mumbai, has been well for three years on risperidone 4 mg, but has stopped having periods and her prolactin is very high. She does not want to change anything that might bring back the voices. Her bone density is low for her age.", "ask": "What is the best plan?", "choices": [{"label": "Stop risperidone and start aripiprazole 15 mg the next day", "verdict": "harm", "outcome": "Within two weeks she cannot sleep, feels restless and the voices begin again.", "why": "An abrupt swap from a tight blocker to a partial agonist risks rebound from supersensitive receptors, and gives no overlap."}, {"label": "Add low-dose aripiprazole (2 to 5 mg) to risperidone and recheck prolactin; or, if she prefers a single drug later, cross-taper slowly", "verdict": "best", "outcome": "Her prolactin falls to normal and her periods return within months. She stays well.", "why": "A small dose of partial agonist occupies enough pituitary D2 receptors to restore some signal and lower prolactin, without unsettling a stable mental state."}, {"label": "Leave it; prolactin does not matter if she feels fine", "verdict": "harm", "outcome": "Over years her bone loss progresses and she has a fracture.", "why": "Long-term high prolactin lowers oestrogen and bone density, and affects fertility and sexual health."}]}
:::

:::recall
1. What is intrinsic activity? || The fraction of a full agonist's effect a partial agonist produces.
2. Why do partial agonists lower prolactin? || They keep some D2 signal at the pituitary.
3. Which partial agonist binds D3 most strongly? || Cariprazine.
4. Why cross-taper slowly onto aripiprazole? || To avoid rebound from supersensitive D2 receptors.
:::

:::mcq
Q: A man on aripiprazole develops new urges to gamble. The best explanation is:
- A personality disorder
- *Partial agonist activity acting like a weak dopamine boost in reward circuits
- Low prolactin
- Serotonin syndrome
> Impulse-control problems are a recognised, if uncommon, effect.
:::

## 5.3 Beyond dopamine: serotonin, glutamate and muscarinic drugs [core][advanced]
For seventy years every antipsychotic has worked mainly by turning down D2 signalling. That changed in September 2024, when the US approved **xanomeline with trospium**, the first schizophrenia medicine that does not block dopamine receptors directly.

:::widget figure
{"id": "gpcr-scene"}
:::

### How the muscarinic approach works
- **Xanomeline** is an agonist at muscarinic **M1 and M4** receptors in the brain. M4 receptors sit on neurons in the striatum and on the inputs to the dopamine cell bodies; switching them on reduces dopamine release in the striatum from upstream. M1 action in the cortex may help thinking.
- On its own, xanomeline also activates muscarinic receptors in the gut, sweat glands and heart: vomiting, sweating, diarrhoea. Early trials stopped for this reason.
- **Trospium** blocks muscarinic receptors but **cannot cross the blood-brain barrier**. It mops up xanomeline's effects in the body while leaving its brain effects intact.

:::widget journey
{"drug": "xanomeline with trospium", "target": "M1 and M4 muscarinic receptors in the striatum and cortex (xanomeline only; trospium stays outside the brain)", "routes": ["oral"], "notes": {"mouth": "One capsule holds both drugs. It is taken twice a day on an empty stomach, at least an hour before or two hours after a meal, because food lowers how much is absorbed.", "gut": "Both are absorbed. Trospium also blocks muscarinic receptors in the gut, which reduces the nausea and cramps xanomeline would cause, but can cause constipation and dry mouth.", "liver": "Xanomeline is broken down by several CYP enzymes. Trospium is barely metabolised and is mostly removed by the kidneys.", "blood": "Xanomeline would switch on muscarinic receptors in sweat glands, heart and bladder; trospium, travelling alongside, blocks them there.", "bbb": "Here the two drugs part company. Xanomeline crosses into the brain. Trospium, an electrically charged molecule, is kept out by the barrier.", "out": "Both are cleared within hours, so a dose is needed twice a day. Trospium is removed through the kidneys, so it needs care in kidney disease and in men with urinary retention."}, "caption": "Press Play and watch the blood-brain barrier do the clever part: one drug in, one drug out. Then ask: what side effects does this design avoid that D2 blockers cause?"}
:::

:::widget flow
{"title": "Lowering dopamine without touching D2", "layout": "chain", "nodes": [{"id": "x1", "label": "Xanomeline crosses into the brain", "detail": "It is an agonist at M1 and M4 receptors."}, {"id": "x2", "label": "M4 switched on in the midbrain and striatum", "detail": "M4 receptors on cholinergic and other neurons act as brakes on the circuit that drives dopamine release."}, {"id": "x3", "label": "Less dopamine released in the associative striatum", "detail": "The overactive dopamine signal in psychosis is reduced upstream."}, {"id": "x4", "label": "Psychotic symptoms ease", "detail": "Trials showed clear improvement in positive and negative symptom scores over placebo within a few weeks."}, {"id": "x5", "label": "No D2 block, so no D2 side effects", "detail": "No raised prolactin, little EPS and little weight gain. Instead: nausea, vomiting, constipation, dry mouth, indigestion, raised pulse and urinary retention."}], "caption": "Press Play. Compare this with the pathways widget: here dopamine is quietened at its source rather than blocked at the receptor."}
:::


:::widget timeline
{"prompt": "Put these moments in antipsychotic history in order.", "events": [{"label": "Chlorpromazine is first used to calm psychosis in Paris", "when": "1952"}, {"label": "Haloperidol is made in Belgium", "when": "1958"}, {"label": "Clozapine is withdrawn in several countries after deaths from agranulocytosis, then later brought back with blood monitoring", "when": "1970s to 1989"}, {"label": "Risperidone is approved in the US", "when": "1993"}, {"label": "Aripiprazole, the first D2 partial agonist, is approved in the US", "when": "2002"}, {"label": "Xanomeline with trospium, the first non-D2 antipsychotic, is approved in the US", "when": "September 2024"}, {"label": "A once-monthly olanzapine injection under the skin is approved in the US", "when": "October 2026"}], "why": "Seventy years of drugs that block D2 in different ways, and only recently a different mechanism."}
:::

:::widget receptor
{
 "receptor": "muscarinic M4",
 "title": "Xanomeline: an agonist, not a blocker",
 "caption": "Pick Full agonist. Xanomeline stimulates M1 and M4 receptors in the brain; M4 receptors on dopamine and other neurons reduce dopamine release in the striatum, so psychosis eases without any D2 block. Trospium, the partner drug, is an antagonist that cannot cross into the brain, so it soaks up the gut and bladder side effects of xanomeline outside it."
}
:::

### Other routes being tried
| Approach | Example | Where it stands (late 2026) |
|---|---|---|
| 5-HT2A inverse agonism | Pimavanserin | US approved for Parkinson's disease psychosis (2016) |
| Mixed 5-HT2A, D2 and glutamate modulation | Lumateperone | US approved for schizophrenia (2019) and bipolar depression (2021), as an add-on in depression (November 2025), and for relapse prevention in schizophrenia in 2026 |
| M4 positive allosteric modulator | Emraclidine | Failed two trials in November 2024 |
| Muscarinic agonist as add-on to other antipsychotics | Xanomeline with trospium | An add-on trial in 2025 did not meet its main goal |
| TAAR1 agonism | Ulotaront | Failed to beat placebo in large trials in 2023 |
| Active metabolite of iloperidone | Milsaperidone | US approved in February 2026 for schizophrenia and mania in bipolar I disorder |

:::widget pathways
{"system": "dopamine", "title": "Revisit the pathways with muscarinic action in mind", "caption": "Add the D2 blocker and see the cost in the movement and pituitary pathways. A muscarinic drug aims to quieten mainly the overactive striatal dopamine at its source, so in principle the nigrostriatal and tuberoinfundibular pathways are spared. Note: this widget shows D2 and 5-HT2A block only; use it to see what the new drugs try to avoid."}
:::

:::clinician
### Xanomeline with trospium (for learning; check current guidelines)
- Start 50 mg xanomeline with 20 mg trospium twice daily for at least 2 days, then 100 mg with 20 mg twice daily for at least 5 days; may increase to 125 mg with 30 mg twice daily.
- Older adults: titrate more slowly and do not exceed 100 mg with 20 mg twice daily.
- Take at least 1 hour before or 2 hours after food.
- Avoid in urinary retention, moderate or severe liver impairment, gastric retention and untreated narrow-angle glaucoma; watch heart rate and blood pressure.
- Not available in India as of late 2026.
:::

:::recall
1. Which receptors does xanomeline act on? || Muscarinic M1 and M4, as an agonist.
2. Why is trospium added? || It blocks muscarinic side effects in the body but cannot cross the blood-brain barrier.
3. When was xanomeline with trospium approved in the US? || September 2024.
4. Name two non-dopamine approaches that failed recently. || Emraclidine (M4 modulator, 2024) and ulotaront (TAAR1, 2023).
:::

:::mcq
Q: A drug company proposes an antipsychotic with no D2 action. Which side effect profile would you predict for a muscarinic agonist approach like xanomeline with trospium?
- High prolactin and marked EPS
- Marked weight gain and diabetes
- *Nausea, constipation, dry mouth and raised pulse, with little EPS, prolactin rise or weight gain
- Agranulocytosis
> No D2 block; muscarinic effects in the body, partly blocked by trospium.
:::

## 5.4 Pharmacokinetics of antipsychotics [core][advanced]

:::widget figure
{"id": "liver-cell-cyp"}
:::
### Which enzyme matters for which drug
| Drug | Main route of clearance | What changes levels |
|---|---|---|
| Clozapine | CYP1A2 (also 3A4, 2C19) | Smoking lowers (up to half); stopping smoking raises; fluvoxamine and ciprofloxacin raise severalfold; infection and inflammation raise |
| Olanzapine | CYP1A2, glucuronidation | Smoking lowers; fluvoxamine raises |
| Haloperidol | CYP2D6, 3A4 | Carbamazepine lowers; fluoxetine and paroxetine raise |
| Risperidone | CYP2D6 to paliperidone (active) | Genotype changes the ratio more than the total active drug |
| Paliperidone, amisulpride | Kidneys, unchanged | Kidney function |
| Aripiprazole, brexpiprazole | CYP2D6, 3A4 | Halve with strong inhibitors; double with inducers; CYP2D6 poor metabolisers need half |
| Quetiapine, lurasidone, cariprazine | CYP3A4 | Strong inhibitors (ketoconazole, clarithromycin) raise sharply; carbamazepine, rifampicin and phenytoin lower sharply |

:::widget sort
{"prompt": "Raises or lowers the antipsychotic's level?", "buckets": ["Raises the level", "Lowers the level"], "items": [{"text": "A clozapine patient stops smoking on admission", "bucket": 0}, {"text": "Carbamazepine added to quetiapine", "bucket": 1, "why": "CYP3A4 induction can lower quetiapine levels by over 80%."}, {"text": "Fluvoxamine added to clozapine", "bucket": 0, "why": "Strong CYP1A2 inhibition."}, {"text": "A patient on olanzapine starts smoking 20 cigarettes a day", "bucket": 1}, {"text": "Pneumonia in a patient on clozapine", "bucket": 0, "why": "Inflammation suppresses CYP1A2; clozapine levels can double during a serious infection."}, {"text": "Fluoxetine added to aripiprazole", "bucket": 0}, {"text": "Rifampicin started for tuberculosis in a patient on lurasidone", "bucket": 1, "why": "Strong CYP3A4 induction; the combination is avoided."}]}
:::

### Long-acting injections and "flip-flop" kinetics
After an oral dose, absorption is fast and elimination sets the half-life. After a depot injection, release from the muscle is so slow that **absorption becomes the slowest step**, and the apparent half-life is the release half-life: weeks. This is called **flip-flop kinetics**. It explains three practical rules:
1. Steady state takes months, so loading doses or oral cover are needed at the start.
2. Dose changes take months to show their full effect; do not keep increasing a depot because the first months look partial.
3. After the last injection, drug (and side effects) remain for months.


:::widget journey
{
 "drug": "Clozapine",
 "target": "many receptors at once: D4, 5-HT2A, a loose hold on D2, and others",
 "route": "oral",
 "notes": {
  "liver": "Broken down mainly by CYP1A2, with help from CYP3A4 and CYP2C19. Tobacco smoke (the tar, not the nicotine) speeds CYP1A2 up; fluvoxamine and ciprofloxacin slow it down.",
  "blood": "Stopping smoking, say on admission to a smoke-free ward, can raise the blood level by about half within a week or two: risk of sedation and seizures. Starting to smoke again can drop it.",
  "out": "Cleared as norclozapine and other metabolites. The clozapine to norclozapine ratio helps judge whether tablets are being taken and how fast the liver is working."
 },
 "caption": "Stop at the liver and the blood. Most clozapine level surprises in practice come from smoking, infection or another medicine changing CYP1A2."
}
:::

### Therapeutic drug monitoring
| Drug | When levels help | Useful range (approximate) |
|---|---|---|
| Clozapine | Non-response, toxicity, adherence, smoking change, infection | At least 350 ng/mL for response; seizure prophylaxis considered above about 600 ng/mL, and especially near 1000 |
| Olanzapine | Non-response, adherence, smoking | About 20 to 40 ng/mL (12 hours after dose) |
| Others | Mainly adherence and interactions | Varies |

The clozapine to norclozapine ratio averages about 1.25 and stays fairly constant for a given person. A rise suggests inhibition (fluvoxamine, infection), saturation at high doses or a sample taken too soon after a dose; a fall suggests induction (smoking restarted). How much the ratio adds in practice is debated, and the time of sampling changes it a lot.

:::widget guess
{"prompt": "A smoker on clozapine stops smoking completely. By what percentage might his clozapine level rise?", "min": 0, "max": 200, "unit": "%", "answer": [40, 100], "reveal": "Often by around 50%, and sometimes it doubles, within about a week. Smoking can lower clozapine levels by up to half; removing it reverses this. Nicotine replacement does not prevent the rise, because the enzyme induction comes from the smoke, not the nicotine.", "clinician": "Take a level before stopping if possible; reduce the dose gradually over about a week to about 75% of the original; repeat the level one week later and expect further reductions. On restarting smoking, increase back over a week and recheck."}
:::

:::recall
1. Which enzyme clears clozapine and olanzapine, and what induces it? || CYP1A2; tobacco smoke.
2. What does an infection do to clozapine levels? || Raises them (inflammation suppresses CYP1A2).
3. What is flip-flop kinetics? || When slow absorption from a depot, not elimination, sets the apparent half-life.
4. What does a rising clozapine to norclozapine ratio suggest? || Inhibited or saturated metabolism, or a sample taken too soon after a dose.
:::

:::mcq
Q: A woman on quetiapine 600 mg for bipolar disorder starts carbamazepine. Within weeks she becomes manic. The best explanation is:
- Carbamazepine causes mania
- *CYP3A4 induction has lowered quetiapine levels dramatically
- Quetiapine and carbamazepine add sedation
- She stopped her tablets
> Quetiapine levels can fall by over 80%.
:::

## 5.5 Treatment-resistant schizophrenia and the science of clozapine [core][advanced]
### Defining resistance properly
An international working group agreed minimum criteria so that research and practice speak the same language:
- At least **two** adequate trials of different antipsychotics, each long enough and at a high enough dose.
- Adherence confirmed (at least 80% of doses, ideally with a level or a depot).
- At least moderate symptoms on a standard rating scale, with impaired functioning.

:::clinician
### The working group's minimum numbers
Each trial at least 6 weeks at a dose equivalent to at least 600 mg chlorpromazine a day; adherence of at least 80% of prescribed doses, confirmed by at least two sources, including a plasma level on at least one occasion where possible.
:::

About a third of people with schizophrenia meet these criteria. Many are **resistant from the first episode**, which suggests a different biology: imaging finds normal, not raised, dopamine synthesis in many resistant patients, and glutamate differences instead.

:::widget flow
{"title": "From first episode to clozapine and beyond", "layout": "tree", "nodes": [{"id": "f0", "label": "First antipsychotic at an adequate dose", "detail": "Most first-episode patients respond, often at low doses."}, {"id": "f1", "label": "Responds", "parent": "f0", "detail": "Continue, monitor physical health, relapse prevention plan."}, {"id": "f2", "label": "Little or no response", "parent": "f0", "detail": "Check adherence (level or depot), substances, dose and duration, and diagnosis."}, {"id": "f3", "label": "Second, different antipsychotic", "parent": "f2", "detail": "A full trial, long enough and at an adequate dose."}, {"id": "f4", "label": "Still resistant: offer clozapine", "parent": "f3", "detail": "Do not delay. Each year of delay lowers the chance of response."}, {"id": "f5", "label": "Clozapine response", "parent": "f4", "detail": "Continue with full monitoring."}, {"id": "f6", "label": "Partial response on clozapine", "parent": "f4", "detail": "Check level (at least 350 ng/mL), wait long enough, then consider augmentation: amisulpride or aripiprazole, or ECT; treat side effects."}], "caption": "Tap each branch. The commonest error in practice is not a wrong drug but a long delay before clozapine."}
:::

### Why clozapine works, and what we still do not know
- It has weak, fast-off D2 binding, strong 5-HT2A, alpha-1, alpha-2, H1 and M1 block, M4 partial agonism by its metabolite **norclozapine**, and effects on glutamate signalling.
- No single receptor action explains its advantage. Its unique benefit in resistant patients, whose dopamine may not be raised, hints that its non-dopamine actions matter.
- It reduces suicidal behaviour more than olanzapine in a large trial of high-risk patients, and lowers all-cause mortality in cohort studies despite its metabolic harm.

### Neutropenia, ancestry and over-caution
- Many people of African, Middle Eastern and some other ancestries carry the **Duffy-null** blood group, which gives lifelong lower neutrophil counts without any added infection risk. Under strict rules they are often wrongly denied clozapine.
- True clozapine-induced agranulocytosis affects under 1%, peaks in the first months, and is probably immune-mediated, with some HLA links.

:::widget decide
{"scene": "Mr Abebe, 30, an Ethiopian engineer working in Pune, has treatment-resistant schizophrenia. Two antipsychotics failed. His neutrophil count has always been around 1.3 x 10^9/L, even when well. The ward team says: 'His neutrophils are too low; clozapine is impossible.'", "ask": "What do you advise?", "choices": [{"label": "Agree; clozapine is contraindicated", "verdict": "harm", "outcome": "He spends another two years unwell on a third and fourth antipsychotic.", "why": "A lifelong, stable low count in someone of East African ancestry is likely Duffy-null associated neutrophil count, which does not carry extra risk."}, {"label": "Ask a haematologist to assess for Duffy-null associated neutrophil count; if confirmed, start clozapine using adjusted thresholds and close monitoring", "verdict": "best", "outcome": "The test confirms Duffy-null status. Clozapine is started with lower but safe thresholds and he improves markedly over six months.", "why": "Recognising benign ethnic variation prevents unfair denial of the most effective treatment."}, {"label": "Start clozapine with no blood monitoring", "verdict": "harm", "outcome": "No problem arises this time, but the team breaks a key safety rule and would miss true agranulocytosis.", "why": "Adjusted thresholds, not no monitoring, are the safe answer."}]}
:::

:::widget decide
{"scene": "Mrs Nair, 45, in Thiruvananthapuram, has been well on clozapine 350 mg for two years. At her monthly blood test she mentions she has not opened her bowels for four days, has a swollen, painful belly and vomited this morning. Her neutrophils are normal.", "ask": "What do you do?", "choices": [{"label": "Advise a high-fibre diet and review next month", "verdict": "harm", "outcome": "She is admitted two days later with bowel obstruction and needs surgery.", "why": "Clozapine slows the whole gut. Belly pain, swelling and vomiting are an emergency: clozapine-induced gut hypomotility can be fatal. Bulk-forming fibre without movement can make it worse."}, {"label": "Send her to emergency care today for assessment of obstruction; afterwards start regular stimulant or osmotic laxatives, ask about bowels at every visit, and review other anticholinergic drugs", "verdict": "best", "outcome": "Early ileus is treated without surgery. With a laxative plan she stays well on clozapine.", "why": "Constipation kills more clozapine patients than agranulocytosis in some series. It is preventable with routine questions and laxatives."}, {"label": "Stop clozapine permanently", "verdict": "ok", "outcome": "Her bowel settles, but she relapses within months.", "why": "The bowel emergency needs urgent care, but stopping a life-changing medicine is not the first answer; prevention is."}]}
:::

:::recall
1. State the main criteria for treatment-resistant schizophrenia. || Two adequate trials (long enough, at least 600 mg chlorpromazine equivalent), confirmed adherence, at least moderate symptoms and impaired function.
2. What does imaging suggest about dopamine in many resistant patients? || Dopamine synthesis is often normal, not raised.
3. Name two augmentation options for partial clozapine response. || Amisulpride or aripiprazole; ECT.
4. What is Duffy-null associated neutrophil count? || A benign, lifelong lower count common in some ancestries, without extra infection risk.
:::

:::mcq
Q: Which clozapine-related problem is most often fatal in some long-term case series, yet is preventable with routine questions?
- Hypersalivation
- *Gut hypomotility leading to bowel obstruction
- Weight gain
- Fever early in titration
> Ask about bowels at every visit; prescribe laxatives.
:::

## 5.6 Metabolic harm, tardive dyskinesia and supersensitivity: the mechanisms [core][advanced]
### Why antipsychotics cause weight gain and diabetes
| Mechanism | Receptor or system | Drugs most affected |
|---|---|---|
| More appetite | H1 and 5-HT2C block in the hypothalamus | Olanzapine, clozapine, quetiapine |
| Less insulin release | M3 block on pancreatic beta cells | Olanzapine, clozapine |
| Insulin resistance in liver and muscle | Direct effects, partly independent of weight | Olanzapine, clozapine |
| Less activity, more sleep | Sedation | Many |

Weight gain is fastest in the first months and greatest in young, drug-naive people. Diabetes can appear within weeks, sometimes as diabetic ketoacidosis, even before much weight is gained. Countermeasures include choosing a lower-risk drug, lifestyle work from day one, metformin, and adding aripiprazole. In the US, a combination of olanzapine with samidorphan (an opioid blocker that reduces appetite gain) was approved in 2021. GLP-1 medicines are under study.


:::widget pathways
{
 "system": "dopamine",
 "title": "Years of blockade in the movement pathway",
 "caption": "Add the D2 blocker and stay on the movement (nigrostriatal) pathway. Over months to years the striatum responds by building more, and more sensitive, D2 receptors. When the drug level dips, those extra receptors over-respond: that is one leading idea behind tardive dyskinesia and supersensitivity psychosis."
}
:::

### Tardive dyskinesia
- Develops after months to years of D2 block; roughly 5% a year in the early years with older drugs, and less with second-generation drugs.
- The leading theory: long-term blockade makes striatal D2 receptors more numerous and sensitive (**supersensitivity**), with loss of inhibitory neurons and oxidative damage.
- Masking: raising the antipsychotic dose temporarily hides the movements (more block), and lowering it can unmask them. This is why TD often first appears when a dose is reduced.
- Treatment: **VMAT2 inhibitors** (valbenazine, deutetrabenazine, tetrabenazine) reduce dopamine packaged into vesicles, so less is released onto supersensitive receptors. Valbenazine and deutetrabenazine were approved in the US for TD in 2017.

:::widget flow
{"title": "The supersensitivity cycle", "layout": "cycle", "nodes": [{"id": "s1", "label": "Long-term D2 block", "detail": "Months to years of high occupancy, especially with tight binders."}, {"id": "s2", "label": "More and more sensitive D2 receptors", "detail": "The brain compensates for the blockade by making more receptors and making them more responsive."}, {"id": "s3", "label": "Dose lowered or missed", "detail": "Natural dopamine now meets an over-responsive system."}, {"id": "s4", "label": "Rebound", "detail": "Movements (withdrawal dyskinesia, tardive dyskinesia) and sometimes a rebound psychosis worse than before."}, {"id": "s5", "label": "Dose raised again", "detail": "Symptoms are masked, and the blockade deepens, feeding the cycle."}], "caption": "Press Play. The way out is the lowest effective dose, slow changes, and drugs with partial or loose D2 binding where suitable."}
:::

:::widget brainmap
{"title": "Where antipsychotic side effects begin", "focus": ["basal-ganglia", "hypothalamus", "prefrontal", "brainstem"], "notes": {"basal-ganglia": "The striatum: dystonia, parkinsonism, akathisia and tardive dyskinesia come from changes in D2 signalling here.", "hypothalamus": "Appetite (H1 and 5-HT2C block), temperature control (one of the failures in NMS), and the start of the prolactin pathway.", "prefrontal": "Blocking dopamine here may worsen apathy and slowed thinking: the 'neuroleptic-induced deficit' some patients describe.", "brainstem": "The vomiting centre (dopamine block here explains why some antipsychotics also stop nausea), and the dopamine source cells."}, "caption": "Tap each region and link it to a side effect you have met in this module."}
:::

:::recall
1. Name three mechanisms of antipsychotic-induced diabetes. || More appetite (H1, 5-HT2C), less insulin release (M3), direct insulin resistance.
2. What is the main theory of tardive dyskinesia? || D2 receptor supersensitivity after long-term blockade.
3. How do VMAT2 inhibitors work? || They reduce dopamine loaded into vesicles, so less is released.
4. Why might TD first appear when a dose is lowered? || The higher dose was masking it.
:::

:::mcq
Q: A man on haloperidol for ten years has his dose halved and, weeks later, develops chewing and lip-smacking movements. The best explanation is:
- A new stroke
- *Unmasking of tardive dyskinesia after a dose reduction
- Acute dystonia
- Akathisia
> Higher doses can hide TD; lowering them reveals it.
:::

## 5.7 ICD-11 and guidelines say [core][advanced]
:::note ICD-11 says
- ICD-11 drops the old subtypes of schizophrenia (paranoid, hebephrenic and others) and uses **symptom specifiers** (positive, negative, depressive, manic, psychomotor, cognitive) rated for severity. These map better onto treatment targets.
- It describes the course (first episode, multiple episodes, continuous) with current state (symptomatic, partial or full remission), which affects how long to continue medicine.
- Catatonia is a separate syndrome that can occur with many conditions; lorazepam and ECT, not antipsychotics, are first-line.
:::

:::note Guidelines say
- **First episode:** offer an antipsychotic with psychological therapy and family intervention; choose the drug with the person, by side effects.
- **Clozapine:** offer after two adequate failed trials, and do not delay.
- **Physical health:** monitoring at baseline, early, and at least yearly is part of prescribing, not an optional extra.
- **Indian Psychiatric Society guidance** stresses cost, family involvement, depots for poor adherence, avoiding routine anticholinergics and irrational combinations, and the Mental Healthcare Act 2017 rules on consent, supported admission and modified ECT.
- **Long-acting injections** should be offered to anyone who might benefit, not only after many relapses.
:::

:::widget sort
{"prompt": "Good practice or a common error? Place each card.", "buckets": ["Good practice", "Common error"], "items": [{"text": "Adding trihexyphenidyl to every antipsychotic prescription", "bucket": 1}, {"text": "Offering clozapine after two adequate failed trials", "bucket": 0}, {"text": "Two antipsychotics at full dose for a patient who has not tried clozapine", "bucket": 1, "why": "Polypharmacy adds side effects without the benefit clozapine would bring."}, {"text": "Checking weight, glucose and lipids at baseline and after about three months", "bucket": 0}, {"text": "Raising the dose when a patient paces and cannot sit still", "bucket": 1, "why": "That is akathisia; it is made worse by more drug."}, {"text": "Offering a depot early to someone who relapses after stopping tablets", "bucket": 0}, {"text": "Haloperidol for hallucinations in Lewy body dementia", "bucket": 1}]}
:::

:::recall
1. What did ICD-11 replace the schizophrenia subtypes with? || Symptom specifiers rated for severity.
2. What is first-line for catatonia? || Lorazepam (and ECT).
3. Name three Indian practice points from guidelines. || Avoid routine anticholinergics and irrational combinations; involve family and consider cost; depots for poor adherence (also Mental Healthcare Act rules).
:::

:::mcq
Q: A patient with schizophrenia becomes mute, stares and holds odd postures for hours. The first-line treatment is:
- Increase haloperidol
- *Lorazepam (and ECT if needed)
- Trihexyphenidyl
- Clozapine immediately
> Catatonia responds to benzodiazepines; antipsychotics can worsen it and raise NMS risk.
:::
`;
