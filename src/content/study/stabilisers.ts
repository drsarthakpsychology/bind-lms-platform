import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "stabilisers",
  num: 12,
  title: "Mood stabilisers, anxiolytics and sleep medicines",
  emoji: "⚖️",
  tagline: "Lithium, valproate, carbamazepine, lamotrigine, benzodiazepines, Z-drugs and safer sleep",
  when: "Weeks 7 to 8",
  outcomes: [
    "Use lithium safely: levels, monitoring, side effects, toxicity and interactions",
    "Know the key risks of valproate, carbamazepine and lamotrigine, including in pregnancy",
    "Explain how benzodiazepines work, when to use them and how to stop them",
    "Recognise sedative overdose and withdrawal",
    "Treat insomnia with CBT-I first, and medicines briefly",
  ],
  writeTask:
    "On paper, from memory: lithium levels and monitoring, five lithium side effects and five signs of toxicity, five things that raise levels; one key danger each for valproate, carbamazepine and lamotrigine; benzodiazepine uses, risks and withdrawal; and the CBT-I steps. Then check and correct in red.",
  activities: [
    act.lesson("ms-1", "Quiz: lithium", "Levels, toxicity and monitoring."),
    act.lesson("ms-2", "Quiz: valproate, lamotrigine and benzos", "The other mood stabilisers and sedatives."),
    act.scenarios("stabilisers", "Patient case: the summer of lithium", "A patient on lithium with a stomach bug."),
    act.detective("Clinic detective", "Guess the medicine from its clues."),
  ],
  noteId: "stabilisers",
};

export const text = String.raw`
# Part I · Mood stabilisers

## 1.1 Lithium [core]
The oldest and best-proven mood stabiliser. Prevents mania and depression, treats mania, augments antidepressants, and **reduces suicide**.

:::define Levels
Take blood **12 hours after the last dose**, about **5 days** after starting or changing the dose. Usual maintenance about **0.6 to 1.0 mmol/L** (mEq/L); acute mania often needs about **1.0 to 1.5** with close monitoring; older adults usually lower. Lithium has a **narrow therapeutic range**: the toxic level is close to the useful one.
:::

### Before starting and monitoring
| When | What |
|---|---|
| Baseline | Kidney function (creatinine, eGFR), thyroid (TSH), calcium, weight, ECG if heart disease or over 40, pregnancy test |
| First weeks | Level weekly until stable |
| Ongoing | Level every 3 months for the first year, then every 3 to 6 months; kidney and thyroid every 6 months; calcium yearly |

### Side effects
| Common | Longer term |
|---|---|
| Thirst, passing lots of urine | **Hypothyroidism** (common, treat with thyroxine; don't necessarily stop lithium) |
| Fine tremor | **Kidney**: nephrogenic diabetes insipidus; slow decline in kidney function |
| Nausea, loose stools (early) | Hyperparathyroidism (raised calcium) |
| Weight gain, acne, psoriasis worsening | Heart conduction changes |
| Metallic taste | In pregnancy: small risk of Ebstein's anomaly (heart defect) |

:::safety Lithium toxicity
Often above 1.5 mmol/L, but can occur in range in older adults.
- **Mild to moderate**: coarse tremor, vomiting, diarrhoea, unsteadiness (ataxia), slurred speech, muscle twitching.
- **Severe**: confusion, drowsiness, fits, arrhythmias, coma, kidney failure.
- **Management**: stop lithium, check level, kidney function and electrolytes, IV fluids (saline), monitor ECG; **haemodialysis** for severe toxicity or kidney failure.
:::

### What raises lithium levels
- **Dehydration**: heat, fever, vomiting, diarrhoea, low fluid intake.
- **NSAIDs** (ibuprofen, diclofenac), **ACE inhibitors** and ARBs, **thiazide diuretics**.
- Low-salt diets; kidney impairment; older age.

:::mnemonic Lithium's enemies: “DANT”
**D**ehydration · **A**CE inhibitors and ARBs · **N**SAIDs · **T**hiazides.
:::

:::word Patient advice line
“Take it at the same time daily. Drink enough water, more in summer or if you have fever, vomiting or loose motions. Don't take painkillers like ibuprofen without asking. If you get shaky hands, vomiting, diarrhoea or feel unsteady, stop and come in that day. Never stop suddenly: it can bring back mania.”
:::

## 1.2 Valproate [core]
- Effective for mania, mixed states and rapid cycling; also epilepsy.
- Level about 50 to 100 µg/mL.
- Side effects: nausea, **weight gain**, tremor, **hair loss**, sedation, raised ammonia, **polycystic ovaries** and menstrual problems.
- Serious: **liver toxicity** (higher risk in young children), **pancreatitis**, low platelets.
- Monitor: liver function and blood count at baseline and in the first 6 months.

:::trap Valproate in women and girls
Valproate is highly teratogenic: **neural tube defects** (spina bifida) and other malformations, and **lower IQ and autism risk** in children exposed in the womb. Avoid in girls and women who could become pregnant unless there is no alternative and a pregnancy prevention plan is in place.
:::

## 1.3 Carbamazepine and oxcarbazepine [core]
- Used for mania (second-line), epilepsy and trigeminal neuralgia. Level about 4 to 12 µg/mL.
- **Enzyme inducer** (CYP3A4): lowers levels of many drugs, including the contraceptive pill, antipsychotics, and itself (auto-induction in the first weeks).
- Side effects: dizziness, double vision, unsteadiness, rash, **hyponatraemia**.
- Serious: **Stevens–Johnson syndrome / toxic epidermal necrolysis**, especially with the **HLA-B*1502** gene variant common in South and East Asian populations (test before starting where available); **aplastic anaemia and agranulocytosis** (rare); liver toxicity; teratogenic.
- Oxcarbazepine: similar, fewer interactions, more hyponatraemia.

## 1.4 Lamotrigine [core]
- Mainly **prevents bipolar depression**; little effect on mania.
- Main risk: **serious rash** (including SJS), reduced by **very slow dose titration** over weeks. Stop if a rash appears.
- **Valproate doubles lamotrigine levels**: halve the lamotrigine dose and titrate even more slowly. Carbamazepine lowers it.
- Relatively safer in pregnancy than valproate; weight-neutral.

| Medicine | Best for | Biggest danger | Key monitoring |
|---|---|---|---|
| Lithium | Mania, maintenance, suicide prevention | Toxicity (narrow range) | Levels, kidney, thyroid, calcium |
| Valproate | Mania, mixed, rapid cycling | Teratogenicity, liver, pancreas | Liver, blood count |
| Carbamazepine | Second-line mania | SJS (HLA-B*1502), aplastic anaemia, interactions | Blood count, sodium, liver |
| Lamotrigine | Preventing bipolar depression | Rash and SJS | Slow titration; watch skin |

:::recall
1. When do you take a lithium level, and what is the maintenance range? || 12 hours after the last dose, 5 days after a change; about 0.6 to 1.0 mmol/L.
2. List the baseline tests before lithium. || Kidney, thyroid, calcium, weight, ECG if indicated, pregnancy test.
3. Name the signs of mild and severe lithium toxicity. || Coarse tremor, vomiting, diarrhoea, ataxia, slurred speech; confusion, fits, arrhythmia, coma.
4. What raises lithium levels? || Dehydration, ACE inhibitors and ARBs, NSAIDs, thiazides, low salt.
5. Why avoid valproate in women who could become pregnant? || Neural tube defects, lower IQ and autism risk in the child.
6. Which gene test matters before carbamazepine in Indian patients? || HLA-B*1502 (risk of SJS).
7. What does valproate do to lamotrigine levels? || Doubles them.
:::

## 1.5 Lithium in depth [core]
### How it works (what we think)
- Inhibits **inositol monophosphatase** (the "inositol depletion" hypothesis) and **GSK-3 beta**, an enzyme involved in cell survival and circadian rhythm.
- Increases **BDNF** and protects neurons (people on lithium show larger grey matter volumes on scans).
- Dampens excess signalling through second messenger systems, which may explain stabilisation in both directions.

### Who responds best
| Better response | Poorer response |
|---|---|
| Classic **euphoric mania** | Mixed features, rapid cycling |
| **Mania, then depression, then a well interval** (M-D-I pattern) | Depression-mania-interval pattern |
| Full recovery between episodes | Residual symptoms between episodes |
| **Family history of bipolar disorder**, especially lithium responders | Comorbid substance use |
| Few previous episodes | Many episodes before starting |

### Starting and stopping
- Usual start 300 to 400 mg at night, adjusting by level. Older people and those with kidney problems need lower doses.
- Once-daily dosing at night is common and may be kinder to the kidneys.
- **Do not stop suddenly**: abrupt stopping raises the risk of **rebound mania** and suicide. Taper over **at least 4 weeks**, ideally longer.
- **Lithium and suicide**: lithium lowers suicide and self-harm in mood disorders more than other mood stabilisers; this is one reason it remains first choice for maintenance.

### Kidney and thyroid in practice
- **Polyuria and polydipsia** (nephrogenic diabetes insipidus) are common and usually not dangerous; check fluid intake and sodium.
- A **steady fall in eGFR** needs discussion with the patient and a physician: options include a lower target level, once-daily dosing, or switching. Do not stop lithium in a panic over one result.
- **Hypothyroidism**: add thyroxine, continue lithium.

:::analogy A narrow mountain path
Lithium works on a narrow path: a little too low and it does nothing, a little too high and it is toxic. Anything that pushes the patient sideways (fever, vomiting, a painkiller, a new blood pressure tablet) can tip them off. That is why levels and patient education matter so much.
:::

:::recall
1. Name two molecular targets of lithium. || Inositol monophosphatase and GSK-3 beta.
2. Give three predictors of good lithium response. || Euphoric mania, M-D-I pattern, full inter-episode recovery, family history of response.
3. What is the risk of stopping lithium abruptly? || Rebound mania and suicide.
4. What do you do if lithium causes hypothyroidism? || Add thyroxine and usually continue lithium.
:::

## 1.6 Choosing a mood stabiliser [core]
### Antipsychotics as mood stabilisers
| Medicine | Mania | Bipolar depression | Maintenance |
|---|---|---|---|
| Quetiapine | Yes | **Yes** | Yes |
| Olanzapine | Yes | With fluoxetine | Yes (metabolic cost) |
| Aripiprazole | Yes | No | Prevents mania |
| Risperidone | Yes | No | Long-acting injection prevents mania |
| **Lurasidone** | No | **Yes** | Limited |
| Cariprazine | Yes | Yes | Some evidence |
| Haloperidol | Yes (short term) | No | No |

### Matching the medicine to the person
| Situation | Reasonable first choice | Avoid |
|---|---|---|
| Classic euphoric mania, family history of lithium response | **Lithium** | |
| Mixed features or rapid cycling | Valproate or an atypical (quetiapine, olanzapine, aripiprazole) | Antidepressants |
| Recurrent bipolar depression | Lamotrigine, quetiapine, lurasidone, or lithium | Antidepressant alone |
| Woman who could become pregnant | Lithium, lamotrigine or an atypical, with contraception advice | **Valproate**, carbamazepine |
| Kidney disease | Valproate, lamotrigine or an atypical | Lithium |
| Obesity, diabetes | Lithium, lamotrigine, aripiprazole, lurasidone | Olanzapine, clozapine, valproate |
| Poor adherence | Long-acting injectable antipsychotic | |
| Severe mania with danger | Antipsychotic plus lithium or valproate; ECT if needed | |

### Mood stabilisers in pregnancy and breastfeeding
| Medicine | Pregnancy | Breastfeeding |
|---|---|---|
| Lithium | Small risk of **Ebstein's anomaly**; levels fall in pregnancy and **rise sharply after delivery**; detailed fetal heart scan; monitor levels often | Generally avoided or used with close infant monitoring |
| Valproate | **Avoid**: neural tube defects, lower IQ, autism risk | Compatible but not if pregnancy is possible later without contraception |
| Carbamazepine | Neural tube defects, facial anomalies | Usually compatible |
| Lamotrigine | **Relatively safer**; levels fall in pregnancy | Usually compatible; watch infant rash |
| Atypicals (quetiapine, olanzapine) | Relatively safer; watch gestational diabetes | Usually compatible |

- Give **folic acid** (high dose, 5 mg) to women on anticonvulsants planning pregnancy.
- **Postpartum period** carries a very high relapse risk in bipolar disorder, including **postpartum psychosis**: plan ahead.

:::recall
1. Which antipsychotics treat bipolar depression? || Quetiapine, lurasidone, cariprazine (and olanzapine with fluoxetine).
2. Which mood stabiliser is avoided in women who could become pregnant? || Valproate.
3. What happens to lithium levels after delivery? || They rise sharply.
4. What dose of folic acid is used with anticonvulsants before pregnancy? || 5 mg.
:::

# Part II · Anxiolytics and hypnotics

## 2.1 Benzodiazepines [core]
:::define How they work
Benzodiazepines are **positive allosteric modulators of the GABA-A receptor**: they make GABA, the brain's main calming transmitter, more effective (more frequent chloride channel opening).
:::
| Effect | Clinical use |
|---|---|
| Anxiolytic | Short-term severe anxiety, panic (as a bridge) |
| Hypnotic | Short-term insomnia |
| Anticonvulsant | Status epilepticus, febrile seizures |
| Muscle relaxant | Spasm |
| Amnesic, sedative | Procedures |
| Others | **Alcohol withdrawal** (chlordiazepoxide, diazepam, lorazepam), **catatonia** (lorazepam), acute agitation, akathisia |

| Drug | Duration | Notes |
|---|---|---|
| Alprazolam | Short | Strong dependence and rebound anxiety; commonly misused |
| Lorazepam | Short to intermediate | No active metabolites; safer in liver disease; catatonia |
| Clonazepam | Long | Panic, akathisia; widely prescribed in India |
| Diazepam | Long (active metabolites) | Withdrawal regimens, seizures |
| Chlordiazepoxide | Long | Alcohol withdrawal |

### Risks
- **Tolerance and dependence** (can develop within weeks), misuse.
- **Withdrawal**: anxiety, insomnia, irritability, tremor, sweating, perceptual changes, and **seizures** if stopped suddenly after long use.
- Sedation, poor memory and concentration, **falls and fractures** in older adults, road accidents.
- **Respiratory depression** with alcohol, opioids or in lung disease (sleep apnoea, COPD).
- Paradoxical agitation (children, older adults, learning disability).

:::define Prescribing rules
Use the lowest dose for the **shortest time: about 2 to 4 weeks**. Explain dependence risk at the start. Stop long-term use **gradually** (for example reduce by about a tenth to a quarter every 1 to 2 weeks, often after switching to a long-acting drug such as diazepam).
:::

:::safety Overdose
Benzodiazepines alone are rarely fatal, but with alcohol or opioids they can stop breathing. **Flumazenil** reverses them but can provoke seizures in dependent patients or mixed overdoses (especially with tricyclics); support breathing first.
:::

## 2.2 Other anxiolytics and hypnotics [core]
| Medicine | Notes |
|---|---|
| Z-drugs (zolpidem, zopiclone) | Act on GABA-A; short-term insomnia; similar dependence risks; complex sleep behaviours (sleep walking, driving) |
| Melatonin and agonists | Sleep onset, jet lag, older adults, children with neurodevelopmental disorders |
| Sedating antihistamines (promethazine, hydroxyzine) | Short-term; anticholinergic; hangover |
| Low-dose sedating antidepressants (mirtazapine, trazodone, doxepin) | Insomnia with depression |
| Buspirone | GAD; 5-HT1A partial agonist; slow onset; no dependence |
| Pregabalin | GAD; misuse potential |
| Propranolol | Performance anxiety |

## 2.3 Treating insomnia properly [core]
:::define Insomnia disorder
Difficulty starting or keeping sleep, or waking early, at least **3 nights a week for at least 3 months**, despite adequate opportunity, with daytime impairment.
:::
**CBT for insomnia (CBT-I) is first-line**, ahead of medicines:
1. **Stimulus control**: bed only for sleep (and sex); leave the bed if awake more than about 20 minutes; same wake time daily.
2. **Sleep restriction**: limit time in bed to actual sleep time, then widen it as sleep improves.
3. **Sleep hygiene**: no caffeine after midday, limit alcohol and screens at night, regular routine, dark quiet room, daytime light and exercise.
4. **Cognitive work** on worry about sleep (“If I don't sleep 8 hours I'll fail”).
5. **Relaxation**.

Look for causes: depression, anxiety, pain, sleep apnoea (snoring, daytime sleepiness), restless legs, shift work, caffeine, alcohol, medicines.

:::recall
1. How do benzodiazepines work? || Positive allosteric modulation of GABA-A, increasing chloride channel opening frequency.
2. Give five uses of benzodiazepines. || Short-term anxiety, insomnia, seizures, alcohol withdrawal, catatonia (also agitation, akathisia).
3. What is the maximum usual duration, and why? || About 2 to 4 weeks, because of tolerance and dependence.
4. What is the danger of stopping long-term benzodiazepines suddenly? || Withdrawal seizures.
5. What is the antidote, and its risk? || Flumazenil; can trigger seizures in dependence or mixed overdose.
6. Define insomnia disorder and name the first-line treatment. || 3 nights a week for 3 months with daytime impairment; CBT-I.
:::

## 2.4 Stopping benzodiazepines safely [core]
### Diazepam equivalents (approximate)
| Medicine | Dose roughly equal to 10 mg diazepam |
|---|---|
| Alprazolam | 0.5 mg |
| Clonazepam | 0.5 mg |
| Lorazepam | 1 mg |
| Chlordiazepoxide | 25 mg |
| Zolpidem | 20 mg |

### A taper plan
1. **Engage**: explain why, agree a pace the person can manage, and that symptoms during taper are expected and pass.
2. **Switch** a short-acting benzodiazepine (alprazolam) to an equivalent dose of a **long-acting** one (diazepam or clonazepam), in steps.
3. **Reduce slowly**: about **5 to 10% every 1 to 2 weeks**, slower towards the end. Total taper often takes **months**.
4. **Support**: CBT for anxiety and insomnia, sleep hygiene, relaxation.
5. **Do not rush the last steps**; pause rather than go back up if withdrawal is hard.

### Benzodiazepine misuse in India
- Benzodiazepines (alprazolam, clonazepam, nitrazepam) are widely available and commonly misused, sometimes with opioids or cough syrups.
- Long-term prescriptions often start in general practice for "tension" or sleep and are never reviewed.
- Good prescribing: clear diagnosis, short course, written plan, avoid alprazolam, review and document.

:::trap Do not stop high doses suddenly
A person taking large doses (for example many alprazolam tablets a day) who stops suddenly can have **seizures, delirium and psychosis**. Admit for supervised detoxification if doses are high, there is a seizure history, or alcohol is also used.
:::

:::recall
1. How much clonazepam roughly equals 10 mg diazepam? || 0.5 mg.
2. Why switch alprazolam to diazepam before tapering? || A long half-life gives smoother withdrawal.
3. How fast should a long-term benzodiazepine be reduced? || About 5 to 10% every 1 to 2 weeks, slower at the end.
4. When is inpatient detoxification needed? || High doses, seizure history, alcohol or other drug use.
:::

# Part III · Exam zone

## 3.1 Long answer and short notes [core]
:::example Q. Discuss lithium: indications, pharmacology, side effects, toxicity and monitoring. (15 marks)
1. Indications: acute mania, bipolar maintenance, augmentation in depression, suicide prevention, schizoaffective.
2. Pharmacology: not metabolised, excreted by the kidney, narrow therapeutic index; levels and timing.
3. Pre-treatment work-up and monitoring schedule.
4. Side effects: early and long-term (thyroid, kidney, parathyroid, weight, skin, heart); pregnancy.
5. Toxicity: features by severity, causes (DANT), management including dialysis.
6. Patient education; abrupt stopping and rebound mania.
:::

:::word Short note: benzodiazepine dependence
Regular use for more than a few weeks produces tolerance and physical dependence, especially with short-acting high-potency drugs such as alprazolam. Withdrawal causes anxiety, insomnia, irritability, tremor, sweating, perceptual disturbances and seizures. Prevention: short courses of two to four weeks, clear explanation at the outset. Management: gradual taper, often after switching to an equivalent dose of a long-acting benzodiazepine like diazepam, reducing by small steps every one to two weeks, with CBT for anxiety and insomnia.
:::

## 3.2 Viva rapid-fire [core]
:::viva
When is a lithium level taken? :: 12 hours after the last dose, about 5 days after a change.
Lithium maintenance range? :: About 0.6 to 1.0 mmol/L.
Commonest endocrine side effect of lithium? :: Hypothyroidism.
Kidney side effect of lithium? :: Nephrogenic diabetes insipidus.
Four things that raise lithium levels? :: Dehydration, ACE inhibitors, NSAIDs, thiazides.
Treatment of severe lithium toxicity? :: Stop lithium, IV fluids, haemodialysis.
Main teratogenic risk of valproate? :: Neural tube defects (and lower IQ, autism).
Valproate's serious organ risks? :: Liver toxicity and pancreatitis.
Gene to test before carbamazepine in South Asians? :: HLA-B*1502.
Electrolyte problem with carbamazepine? :: Hyponatraemia.
What does valproate do to lamotrigine? :: Doubles its level.
Main risk of lamotrigine? :: Serious rash (SJS).
Mechanism of benzodiazepines? :: Positive allosteric modulation of GABA-A.
Benzodiazepine of choice in liver disease? :: Lorazepam.
Benzodiazepine used for catatonia? :: Lorazepam.
Antidote for benzodiazepines? :: Flumazenil.
First-line treatment for insomnia? :: CBT for insomnia.
Insomnia disorder rule? :: 3 nights a week for 3 months.
Lithium inhibits which enzyme in the inositol pathway? :: Inositol monophosphatase.
Pattern of episodes that predicts good lithium response? :: Mania, then depression, then interval (M-D-I).
How long should lithium be tapered? :: At least 4 weeks.
Lithium-induced hypothyroidism management? :: Add thyroxine; continue lithium.
Antipsychotic licensed for bipolar depression but not mania? :: Lurasidone.
Mood stabiliser relatively safer in pregnancy? :: Lamotrigine.
Heart defect linked to lithium in pregnancy? :: Ebstein's anomaly.
Folic acid dose with anticonvulsants before pregnancy? :: 5 mg.
Alprazolam equivalent of 10 mg diazepam? :: 0.5 mg.
Benzodiazepine taper rate? :: About 5 to 10% every 1 to 2 weeks.
:::

## 3.3 Module test [core]
:::mcq
Q: A lithium level should be taken:
- 2 hours after the dose
- *12 hours after the last dose
- At any time
- 24 hours after stopping
> Trough level, about 5 days after a change.

Q: A patient on lithium has diarrhoea and vomiting for 3 days and now coarse tremor and unsteadiness. Next step:
- Increase lithium
- *Stop lithium, check level and kidney function, give fluids
- Start an anticholinergic
- Add ibuprofen for pain
> Dehydration has caused toxicity.

Q: Which drug is most likely to raise lithium levels?
- Paracetamol
- *Ibuprofen
- Omeprazole
- Amoxicillin
> NSAIDs reduce kidney lithium clearance.

Q: A woman on lithium for 5 years feels tired, cold and has gained weight. Most likely:
- Lithium toxicity
- *Lithium-induced hypothyroidism
- Depression only
- Anaemia only
> Check TSH; thyroxine can be added.

Q: Which mood stabiliser should be avoided in a 22-year-old woman not using reliable contraception?
- Lithium
- *Valproate
- Lamotrigine
- Quetiapine
> High teratogenic risk.

Q: Before starting carbamazepine in an Indian patient, which test reduces the risk of SJS?
- HLA-B27
- *HLA-B*1502
- TPMT
- G6PD
> HLA-B*1502 carriers have a high SJS risk.

Q: A patient on valproate needs lamotrigine. You should:
- Use the usual dose
- *Halve the lamotrigine dose and titrate slowly
- Double the dose
- Avoid titration
> Valproate doubles lamotrigine levels.

Q: Benzodiazepines act by:
- Blocking dopamine
- *Enhancing GABA-A receptor function
- Blocking NMDA receptors
- Inhibiting serotonin reuptake
> Positive allosteric modulation.

Q: The usual maximum duration for benzodiazepine use in anxiety or insomnia is about:
- 2 to 4 days
- *2 to 4 weeks
- 6 months
- Indefinite
> Dependence develops quickly.

Q: A man stops alprazolam he has taken for 3 years and has a seizure 2 days later. Cause:
- Epilepsy
- *Benzodiazepine withdrawal
- Serotonin syndrome
- Alcohol intoxication
> Sudden cessation after long use.

Q: First-line treatment for chronic insomnia:
- Zolpidem
- Clonazepam
- *CBT for insomnia
- Promethazine
> Stimulus control, sleep restriction, hygiene, cognitive work.

Q: Which benzodiazepine is preferred in significant liver disease?
- Diazepam
- Chlordiazepoxide
- *Lorazepam
- Clonazepam
> No active metabolites; glucuronidation preserved.

Q: A woman on lithium becomes hypothyroid. The best plan is:
- Stop lithium immediately
- *Start thyroxine and continue lithium
- Switch to valproate
- Double the lithium dose
> Hypothyroidism is common and treatable.

Q: Which feature predicts a POOR response to lithium?
- Euphoric mania
- Full recovery between episodes
- *Rapid cycling
- Family history of lithium response
> Rapid cycling and mixed features respond less well.

Q: The safest first choice for bipolar maintenance in a 25-year-old woman planning pregnancy in two years is generally:
- Valproate
- Carbamazepine
- *Lamotrigine or lithium with careful planning
- Long-term alprazolam
> Avoid valproate in women who could become pregnant.

Q: A patient taking alprazolam 4 mg daily for 5 years wants to stop. The best first step is:
- Stop today and give propranolol
- *Switch gradually to an equivalent dose of diazepam, then taper slowly
- Reduce by half every week
- Replace with zolpidem
> Long-acting switch and slow taper.
:::
`;
