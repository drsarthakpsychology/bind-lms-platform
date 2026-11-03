import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "antipsychotics",
  num: 11,
  title: "Antipsychotics",
  emoji: "🧠",
  tagline: "Dopamine pathways, first and second generation drugs, side effects, clozapine and emergencies",
  when: "Weeks 7 to 8",
  outcomes: [
    "Explain the four dopamine pathways and link each to a benefit or side effect",
    "Compare first- and second-generation antipsychotics with examples",
    "Recognise and treat acute dystonia, akathisia, parkinsonism and tardive dyskinesia",
    "Recognise NMS and manage it as an emergency",
    "Use clozapine and long-acting injections safely, and monitor physical health",
  ],
  writeTask:
    "On paper, from memory: the four dopamine pathways with what blocking each does, the four EPS with timing and treatment, the NMS features and steps, the clozapine monitoring list, and a metabolic monitoring schedule. Then check and correct in red.",
  activities: [
    act.lesson("ap-1", "Quiz: typical vs atypical", "Classes and side-effect profiles."),
    act.lesson("ap-2", "Quiz: clozapine and NMS", "The emergencies."),
    act.scenarios("antipsychotics", "Patient case: “I can't sit still”", "Spotting akathisia before it becomes a crisis."),
    act.detective("Clinic detective", "Guess the medicine from its clues."),
  ],
  noteId: "antipsychotics",
};

export const text = String.raw`
# Part I · How they work

## 1.1 Dopamine pathways [core]
All antipsychotics block **dopamine D2 receptors** (aripiprazole, brexpiprazole and cariprazine are partial agonists). Blocking D2 in different pathways explains both benefits and side effects.

| Pathway | Runs from → to | Normal role | Effect of D2 blockade |
|---|---|---|---|
| **Mesolimbic** | Midbrain (VTA) → limbic areas (nucleus accumbens) | Reward, salience | **Reduces positive symptoms** (intended); may dull pleasure and motivation |
| **Mesocortical** | VTA → prefrontal cortex | Cognition, motivation | May **worsen negative and cognitive symptoms** |
| **Nigrostriatal** | Substantia nigra → striatum | Movement | **Extrapyramidal side effects** (dystonia, parkinsonism, akathisia, tardive dyskinesia) |
| **Tuberoinfundibular** | Hypothalamus → pituitary | Dopamine inhibits prolactin | **Raised prolactin** (galactorrhoea, amenorrhoea, sexual dysfunction, osteoporosis) |

:::define The therapeutic window
About **60 to 80% D2 occupancy** gives antipsychotic effect; above about **80%** EPS become common. More dose is not more benefit.
:::

### Why second-generation drugs differ
- Most second-generation (atypical) drugs block **serotonin 5-HT2A** as well as D2. 5-HT2A blockade releases dopamine in the striatum and cortex, giving **fewer EPS** and less prolactin rise (except risperidone, paliperidone and amisulpride).
- Many also block H1 (sedation, weight gain), muscarinic (anticholinergic effects) and alpha-1 receptors (postural hypotension), and affect insulin and lipids: hence **metabolic side effects**.

:::recall
1. Name the four dopamine pathways and the effect of D2 blockade in each. || Mesolimbic: fewer positive symptoms; mesocortical: negative and cognitive worsening; nigrostriatal: EPS; tuberoinfundibular: raised prolactin.
2. What D2 occupancy is therapeutic, and above what do EPS rise? || 60 to 80%; above 80%.
3. Why do most second-generation drugs cause fewer EPS? || 5-HT2A blockade releases striatal dopamine.
:::

:::mcq
Q: A young woman on risperidone stops having periods and notices milk from her breasts. The pathway responsible is:
- Mesolimbic
- Mesocortical
- Nigrostriatal
- *Tuberoinfundibular
> Dopamine normally holds prolactin down; blocking it raises prolactin.
:::

## 1.2 The drugs [core]
### First-generation (typical)
| Drug | Potency | Notes |
|---|---|---|
| Haloperidol | High | Many EPS, little sedation; injectable and depot; used in delirium and acute agitation |
| Fluphenazine, trifluoperazine | High | EPS; fluphenazine depot |
| Chlorpromazine | Low | Sedation, postural hypotension, anticholinergic effects, photosensitivity, weight gain; fewer EPS than haloperidol |
| Flupentixol, zuclopenthixol | Medium | Depots |

:::mnemonic High versus low potency
High potency (haloperidol): **H**igh EPS, low sedation. Low potency (chlorpromazine): low EPS, **high sedation and anticholinergic** effects.
:::

### Second-generation (atypical)
| Drug | Strengths | Main concerns |
|---|---|---|
| Risperidone, paliperidone | Effective; depot forms | **Prolactin rise**, EPS at higher doses |
| Olanzapine | Effective; sedating | **Weight gain, diabetes, lipids** (high) |
| Quetiapine | Sedating; bipolar depression | Weight, sedation, postural drop; little EPS or prolactin |
| Aripiprazole | Partial agonist; weight-neutral; lowers prolactin | **Akathisia**, insomnia, nausea |
| Amisulpride | Effective | Prolactin rise; kidney excretion |
| Ziprasidone, lurasidone | Lower metabolic risk | Ziprasidone QT; lurasidone with food |
| **Clozapine** | Most effective; treatment resistance; reduces suicidal behaviour | Agranulocytosis, myocarditis, seizures, constipation (see 3.1) |

:::trap “Atypical” does not mean “safe”
Second-generation drugs swap EPS for **metabolic harm**. Olanzapine and clozapine carry the highest weight and diabetes risk. Monitor everyone.
:::

:::recall
1. Compare high- and low-potency first-generation drugs. || High potency: more EPS, less sedation; low potency: sedation, anticholinergic, fewer EPS.
2. Which atypicals raise prolactin most? || Risperidone, paliperidone, amisulpride.
3. Which atypicals carry the highest metabolic risk? || Olanzapine and clozapine.
4. What is aripiprazole's typical side effect? || Akathisia.
:::

:::mcq
Q: Which antipsychotic is most likely to cause marked weight gain and diabetes?
- Aripiprazole
- Haloperidol
- *Olanzapine
- Amisulpride
> Olanzapine and clozapine carry the highest metabolic risk.
:::

## 1.3 Choosing, dosing and how long to treat [core]
### First episode
- **Start low**, increase slowly: first-episode patients respond to **lower doses** and are more sensitive to side effects.
- Choose with the patient, by **side-effect profile**: weight (avoid olanzapine in someone already overweight), prolactin (avoid risperidone and amisulpride in a young woman worried about periods), sedation, EPS, heart.
- Give an adequate trial: **2 to 6 weeks at a therapeutic dose**. Early improvement in the first 2 weeks predicts later response; no improvement at all by then suggests a change may be needed.

### Dose equivalents (approximate, to chlorpromazine 100 mg)
| Medicine | Equivalent dose |
|---|---|
| Haloperidol | 2 mg |
| Risperidone | 1 to 2 mg |
| Olanzapine | 5 mg |
| Quetiapine | 100 to 150 mg |
| Aripiprazole | 7.5 mg |
| Trifluoperazine | 5 mg |

- Equivalents help when switching or judging if a dose is high. **Combining two antipsychotics** is usually avoided (except clozapine augmentation in specialist hands); it raises side effects without clear benefit.

### Switching
- **Cross-taper**: slowly reduce the old medicine while increasing the new one over 1 to 4 weeks, to avoid rebound (cholinergic rebound with clozapine or olanzapine; rebound insomnia; relapse).

### How long to continue
| Situation | Typical duration |
|---|---|
| First episode, full recovery | At least **1 to 2 years** after remission, then a slow, monitored taper if the patient wishes |
| Second episode or more | **Long term** (often years), as relapse risk on stopping is high |
| Dangerous relapses (violence, suicide) | Long term, often depot |

:::note Relapse after stopping
About **4 in 5** people with a first episode relapse within 5 years if medicines are stopped. Each relapse can bring more lasting disability. Share this honestly, and respect informed choice.
:::

### Adherence
- Up to half of patients do not take medicines as prescribed. Ask non-judgementally: "Many people miss doses. How often does that happen for you?"
- Reasons: side effects, poor insight, stigma, cost, complicated regimens, substance use. Solutions: simplify (once daily), address side effects, involve family, **depots**, motivational approaches.

:::recall
1. How long is an adequate antipsychotic trial? || 2 to 6 weeks at a therapeutic dose.
2. What is 100 mg chlorpromazine equal to in haloperidol and olanzapine? || About 2 mg and 5 mg.
3. How long to continue after a first episode with full recovery? || At least 1 to 2 years after remission.
4. What is a cross-taper? || Slowly reducing the old drug while increasing the new one.
:::

:::mcq
Q: A man recovered fully from a first psychotic episode 4 months ago and wants to stop his medicine now. The best advice is:
- Stop today
- *Continue for at least 1 to 2 years after remission, then a slow, watched taper if he wishes
- Continue lifelong without discussion
- Switch to a benzodiazepine
> Relapse is very common after stopping early; share the facts and respect his choice.
:::

## 1.4 Antipsychotics in special groups [core]
| Group | Key points |
|---|---|
| **Older people with dementia** | **Increased risk of stroke and death**. Use only for severe distress or danger after non-drug approaches, lowest dose, shortest time, review often. Avoid in Lewy body dementia |
| **Pregnancy** | Untreated psychosis is dangerous; most antipsychotics are not major teratogens. Monitor glucose (gestational diabetes), weight; avoid stopping suddenly; plan around delivery |
| **Breastfeeding** | Many are compatible with monitoring of the baby (sedation, feeding) |
| **Children and adolescents** | More sensitive to weight gain, prolactin and EPS; use the evidence-based options; monitor growth |
| **Heart disease** | Avoid QT-prolonging drugs; ECG at baseline; aripiprazole or lurasidone often preferred |
| **Epilepsy** | Clozapine and chlorpromazine lower seizure threshold most; haloperidol, aripiprazole lower risk |
| **Parkinson's disease** | Avoid typical antipsychotics and risperidone; use **quetiapine or clozapine** at low doses |
| **Diabetes, obesity** | Aripiprazole, lurasidone, ziprasidone; avoid olanzapine and clozapine where possible |

:::recall
1. What risk do antipsychotics carry in older people with dementia? || Increased stroke and death.
2. Which antipsychotics are used in Parkinson's disease psychosis? || Low-dose quetiapine or clozapine.
3. Which antipsychotics lower the seizure threshold most? || Clozapine and chlorpromazine.
:::

:::mcq
Q: An 82-year-old with Lewy body dementia is distressed by visual hallucinations. Which is the most dangerous choice?
- Explaining and reassuring
- A cholinesterase inhibitor
- *Haloperidol
- Low-dose quetiapine with care
> Severe sensitivity to antipsychotics, especially typicals, can be fatal.
:::

# Part II · Side effects

## 2.1 Extrapyramidal side effects [core]
| Effect | Timing | What you see | Treatment |
|---|---|---|---|
| **Acute dystonia** | Hours to days after starting or raising the dose | Painful sustained spasms: neck twisting (torticollis), eyes rolling up (**oculogyric crisis**), jaw, tongue; frightening; young men most at risk | **Anticholinergic IM or IV** (for example procyclidine, benztropine, promethazine); relief within minutes; then oral cover |
| **Akathisia** | Days to weeks | Inner restlessness, can't sit still, pacing, rocking from foot to foot; distressing; linked to agitation and **suicidality** | Reduce dose or switch; **propranolol**; benzodiazepine; mirtazapine low dose. Anticholinergics help little |
| **Parkinsonism** | Weeks | Tremor, rigidity (cogwheel), slowness, mask-like face, shuffling gait, drooling | Reduce dose or switch; anticholinergic (trihexyphenidyl) |
| **Tardive dyskinesia** | Months to years | Involuntary repetitive movements: lip smacking, tongue writhing, chewing, grimacing, limb or trunk movements; may be permanent | Review need; reduce or switch (clozapine lowest risk); **VMAT2 inhibitors** (tetrabenazine, valbenazine, deutetrabenazine). **Anticholinergics can worsen it** |

:::mnemonic Timing order
**4 hours, 4 days, 4 weeks, 4 months**: dystonia (hours), akathisia (days), parkinsonism (weeks), tardive dyskinesia (months). A rough guide, but easy to remember.
:::

:::sounds How akathisia sounds
“Andar se bechaini hai, baith hi nahi paata, pair hilte rehte hain.” (A restlessness inside; I can't sit; my legs keep moving.) Staff may misread it as worsening psychosis and raise the dose, making it worse.
:::

- Monitor movement with the **AIMS** (Abnormal Involuntary Movement Scale) at baseline and regularly.

:::mcq
Q: Two days after starting haloperidol, a 19-year-old has painful neck twisting and his eyes roll upward. Treatment:
- Increase haloperidol
- *An anticholinergic such as procyclidine or benztropine injection
- Propranolol
- Stop all fluids
> Acute dystonia responds quickly to anticholinergics.

Q: A patient on aripiprazole paces, cannot sit still and feels restless inside. This is most likely:
- Anxiety
- *Akathisia
- Tardive dyskinesia
- Mania
> Akathisia can be mistaken for agitation; it raises suicide risk. Propranolol helps.
:::

## 2.2 Neuroleptic malignant syndrome [core]
:::safety NMS: a medical emergency
A rare, potentially fatal reaction to dopamine blockade, usually in the **first days to weeks** or after a dose increase. Risk higher with high-potency drugs, rapid escalation, injections, dehydration, exhaustion and catatonia.
:::
| Feature | Detail |
|---|---|
| Fever | High temperature |
| **Lead-pipe rigidity** | Generalised, severe |
| Altered consciousness | Confusion, stupor, mutism |
| Autonomic instability | Fluctuating BP, fast heart rate, sweating |
| Tests | **Raised CK** (muscle breakdown), raised white count, kidney injury (myoglobin) |

:::mnemonic FEVER
**F**ever · **E**ncephalopathy · **V**ital signs unstable · **E**levated CK (and white cells) · **R**igidity.
:::

Management:
1. **Stop the antipsychotic** (and other dopamine blockers such as metoclopramide).
2. Transfer to medical care; IV fluids, cooling, monitor kidneys and electrolytes.
3. Benzodiazepines; **dantrolene** (muscle relaxant) and **bromocriptine** (dopamine agonist) in severe cases; ECT if persisting or with catatonia.
4. After recovery, wait at least 2 weeks before cautiously restarting a low-potency or different antipsychotic.

:::mcq
Q: Five days after a haloperidol increase, a man has high fever, rigid limbs, confusion, fluctuating BP and a very high CK. First step:
- Increase the dose
- *Stop the antipsychotic and transfer for urgent medical care
- Give an anticholinergic and continue
- Start lithium
> Neuroleptic malignant syndrome is an emergency.
:::

## 2.3 Metabolic, cardiac and other effects [core]
| Effect | High-risk drugs | What to do |
|---|---|---|
| Weight gain, diabetes, raised lipids | Olanzapine, clozapine, quetiapine, chlorpromazine | Diet and exercise advice from day one; metformin may help; switch to aripiprazole, lurasidone or ziprasidone |
| Raised prolactin | Risperidone, paliperidone, amisulpride, haloperidol | Ask about periods, breast discharge, libido; switch or add aripiprazole |
| QT prolongation | Ziprasidone, IV haloperidol, thioridazine, sertindole | ECG; correct potassium and magnesium |
| Sedation | Clozapine, olanzapine, quetiapine, chlorpromazine | Night-time dosing |
| Postural hypotension | Clozapine, quetiapine, chlorpromazine | Slow titration; caution in older adults |
| Anticholinergic effects | Clozapine, olanzapine, chlorpromazine | Watch constipation and confusion |
| Seizure threshold lowered | Clozapine, chlorpromazine | Caution in epilepsy |
| Older adults with dementia | All antipsychotics | **Increased risk of stroke and death**; use only for severe, dangerous symptoms, lowest dose, shortest time |

### Physical health monitoring
| When | What |
|---|---|
| Baseline | Weight, BMI, waist, BP, pulse, fasting glucose or HbA1c, lipids, ECG (if risk), prolactin (if relevant), movement (AIMS) |
| Weekly for 6 weeks | Weight |
| 12 weeks | Weight, BP, glucose, lipids |
| Then yearly (at least) | All of the above |

:::recall
1. Give the timing and treatment for each EPS. || Dystonia: hours, IM anticholinergic; akathisia: days, propranolol and dose reduction; parkinsonism: weeks, anticholinergic; TD: months, review, VMAT2 inhibitors.
2. Which EPS is worsened by anticholinergics? || Tardive dyskinesia.
3. Expand FEVER for NMS. || Fever, encephalopathy, vital signs unstable, elevated CK, rigidity.
4. What is the first step in NMS? || Stop the antipsychotic.
5. Why use antipsychotics cautiously in dementia? || Increased stroke and death.
:::

:::mcq
Q: Which check is essential at baseline and regularly for someone starting olanzapine?
- EEG
- *Weight, waist, blood pressure, fasting glucose or HbA1c and lipids
- Lithium level
- Thyroid scan
> Physical health monitoring is part of every antipsychotic plan.
:::

## 2.4 Managing side effects in practice [core]
| Problem | Options |
|---|---|
| **Weight gain** | Lifestyle advice from the start, switch to a weight-friendly drug, **metformin** (evidence in antipsychotic-induced weight gain), add aripiprazole |
| **Raised prolactin** | Reduce dose, switch (aripiprazole, quetiapine), or **add low-dose aripiprazole**; check bone health with long-term high levels |
| **Sexual dysfunction** | Ask (patients rarely volunteer it); reduce dose, switch to a prolactin-sparing drug |
| **Hypersalivation** (clozapine) | Towel on the pillow, chewing gum; hyoscine or glycopyrrolate; sometimes atropine eye drops under the tongue |
| **Sedation** | Night dosing, lower dose, switch |
| **Postural hypotension** | Slow titration, stand up slowly, fluids |
| **Akathisia** | Reduce dose, **propranolol**, benzodiazepine, mirtazapine (low dose); anticholinergics help little |
| **Tardive dyskinesia** | Review need for antipsychotic; switch to clozapine or quetiapine; **VMAT2 inhibitors** (tetrabenazine, valbenazine, deutetrabenazine); **stop anticholinergics** (they can worsen TD) |

:::trap Don't give anticholinergics routinely
Trihexyphenidyl and benztropine help dystonia and parkinsonism, but given "just in case" they cause memory problems, constipation, misuse (they can give a "high") and may worsen tardive dyskinesia. Use them when needed, and review.
:::

### The physical health check (annually at least, more often early)
Weight and waist, BP, pulse, fasting glucose or HbA1c, lipids, prolactin if symptoms, ECG if risk, smoking status, alcohol, diet, exercise, dental health. People with severe mental illness die **10 to 20 years earlier** than others, mostly from heart disease, diabetes and smoking-related illness.

:::recall
1. Which medicine helps antipsychotic-induced weight gain? || Metformin.
2. How can you lower prolactin without stopping risperidone? || Add low-dose aripiprazole.
3. Which medicine helps akathisia most? || Propranolol.
4. Which drugs treat tardive dyskinesia? || VMAT2 inhibitors: tetrabenazine, valbenazine, deutetrabenazine.
5. How much earlier do people with severe mental illness die on average? || About 10 to 20 years.
:::

:::mcq
Q: A man on risperidone has put on 10 kg in 6 months. He is well and wants to stay on it. A reasonable addition is:
- A second antipsychotic
- *Lifestyle support and metformin, or adding low-dose aripiprazole
- A benzodiazepine
- Stopping all medicines
> Metformin has evidence for antipsychotic weight gain.
:::

# Part III · Special uses

## 3.1 Clozapine [core]
:::define Indications
**Treatment-resistant schizophrenia** (failure of at least two antipsychotics at adequate dose and duration), persistent **suicidal behaviour** in schizophrenia, and patients with intolerable EPS or tardive dyskinesia.
:::
| Risk | What to know |
|---|---|
| **Agranulocytosis** (dangerously low neutrophils) | About 1%, mostly in the first 18 weeks. Blood counts **weekly for 18 weeks**, then every 2 weeks up to a year, then monthly. Stop if neutrophils fall below safe limits. Any fever or sore throat: urgent blood count |
| **Myocarditis**, cardiomyopathy | Mostly in the first 2 months: fever, chest pain, breathlessness, fast pulse. Check troponin, CRP, ECG |
| **Seizures** | Dose-related |
| **Constipation** | Can lead to fatal bowel obstruction. Ask every visit; prescribe laxatives |
| Hypersalivation | Especially at night |
| Weight gain, diabetes | High |
| Sedation, postural hypotension, fever early on | Titrate slowly |

:::note Smoking and clozapine
Tobacco smoke induces the liver enzyme CYP1A2, lowering clozapine levels. **When a patient stops smoking (for example on admission), clozapine levels can rise sharply**: watch for toxicity and reduce the dose. Fluvoxamine and ciprofloxacin also raise levels.
:::

:::mcq
Q: A man on clozapine for 6 weeks has fever, a sore throat and mouth ulcers. The first test is:
- Clozapine level
- *Full blood count (neutrophils), urgently
- Chest X-ray only
- Liver tests
> Possible neutropenia or agranulocytosis.

Q: A clozapine patient admitted to a non-smoking ward becomes very drowsy and has a seizure a week later. The likely reason is:
- Infection
- *Clozapine levels rose because he stopped smoking
- Lower adherence
- NMS
> Smoking induces CYP1A2; stopping can sharply raise levels.
:::

## 3.2 Long-acting injections (depots) [core]
- For poor adherence, patient preference, or relapse after stopping oral medicine.
- Examples: fluphenazine decanoate, haloperidol decanoate, flupentixol decanoate, zuclopenthixol decanoate, **paliperidone palmitate**, aripiprazole long-acting, risperidone long-acting. Olanzapine pamoate needs observation for 3 hours after injection (post-injection delirium sedation syndrome).
- Give a test dose for older depots; establish tolerability on the oral form first.

:::mcq
Q: Which patient is the best candidate for a long-acting injection?
- A woman with first-episode psychosis who takes tablets reliably and prefers them
- *A man with repeated relapses after stopping tablets, who agrees to a monthly injection
- A man allergic to all antipsychotics
- A patient with NMS last week
> Depots help when adherence is the problem and the person agrees.
:::

## 3.3 Rapid tranquillisation [core]
For severe agitation when calming talk and oral medicine have failed:
- Oral first if possible: lorazepam, or an antipsychotic.
- IM options: **lorazepam**; **haloperidol with promethazine** (promethazine reduces dystonia and sedates; a common Indian combination); olanzapine IM (don't give with IM benzodiazepine within an hour).
- Monitor pulse, BP, breathing, temperature and consciousness afterwards; have flumazenil available after benzodiazepines.

:::recall
1. Give three indications for clozapine. || Treatment resistance, suicidal behaviour, intolerable EPS or TD.
2. Describe the blood monitoring schedule. || Weekly for 18 weeks, fortnightly to a year, then monthly.
3. Which clozapine side effect can kill quietly and must be asked about every visit? || Constipation leading to bowel obstruction.
4. What happens to clozapine levels when a patient stops smoking? || They rise, sometimes sharply.
5. Name two IM options for rapid tranquillisation. || Lorazepam; haloperidol with promethazine; olanzapine.
:::

:::mcq
Q: After calm talk and oral medicine fail, a man is about to hit staff. Which IM option is commonly used in India?
- Haloperidol alone at high dose
- *Haloperidol with promethazine, or lorazepam, then monitoring
- Diazepam by IM injection
- Chlorpromazine IV push
> Promethazine lowers dystonia risk and sedates; monitor vital signs afterwards.
:::

## 3.4 Starting clozapine step by step [core]
### Before
1. Confirm **treatment resistance**: two antipsychotics, adequate dose, at least 6 weeks each, with good adherence (consider levels or a depot trial).
2. Consent: explain benefits (often dramatic), blood tests, side effects.
3. Baseline: **blood count** (neutrophils), weight, BP, pulse, temperature, ECG, glucose, lipids, **troponin and CRP** (for myocarditis monitoring), bowel habit, smoking status.

### Titration
- Start **12.5 mg** once or twice on day 1, increasing by about **25 mg a day** as tolerated, to around **200 to 300 mg** by 2 to 3 weeks, then slowly upward as needed (usual range 200 to 450 mg; maximum 900 mg).
- Check pulse, BP and temperature regularly during titration (tachycardia, hypotension, fever are common early).
- **Restart from 12.5 mg** if more than **48 hours** of doses are missed.

### Blood levels and response
- A **clozapine level of at least 350 ng/mL** is usually needed for a good response. Smokers need higher doses.
- Response can take **months**; judge after at least 8 to 12 weeks at an adequate level.

### Red flags to teach the patient and family
- **Fever, sore throat, mouth ulcers**: check blood count urgently (neutropenia).
- **Chest pain, breathlessness, fast pulse** in the first 2 months: myocarditis.
- **No bowel movement for 2 to 3 days, abdominal pain, vomiting**: bowel obstruction, an emergency.
- **Fits**.

:::analogy The most powerful tool needs the most careful hands
Clozapine helps a third or more of people for whom nothing else worked. It is like a powerful machine with clear safety rules: follow the checklist and it is very safe; skip it and it can cause harm.
:::

:::recall
1. Define treatment resistance before clozapine. || Two adequate trials of different antipsychotics with good adherence.
2. What is the starting dose, and when must titration restart? || 12.5 mg; after missing 48 hours.
3. What plasma level is usually needed? || At least 350 ng/mL.
4. Name three red flags for patients to report. || Fever or sore throat, chest pain or breathlessness, constipation or abdominal pain, fits.
:::

:::mcq
Q: A man missed 3 days of clozapine. The safe way to restart is:
- His usual full dose
- *Restart titration from 12.5 mg
- Half his usual dose
- Double dose to catch up
> After missing more than 48 hours, re-titrate to avoid collapse and seizures.
:::

# Part IV · Exam zone

## 4.1 Long answer and short notes [core]
:::example Q. Classify antipsychotics and describe their side effects and management. (15 marks)
1. Mechanism: D2 blockade and pathways table; 5-HT2A for second generation; therapeutic window.
2. Classification: first generation (potency) and second generation with examples; partial agonists.
3. Side effects: EPS table with timing and treatment; NMS; metabolic; prolactin; cardiac; anticholinergic; sedation; seizures; dementia warning.
4. Clozapine: indications, monitoring, risks, smoking interaction.
5. Depots and rapid tranquillisation.
6. Physical health monitoring schedule.
:::

:::word Short note: tardive dyskinesia
A late-onset, often persistent involuntary movement disorder after months to years of dopamine-blocking drugs, mainly orofacial (lip smacking, chewing, tongue protrusion, grimacing) but also limbs and trunk. Risk factors: older age, female sex, long exposure, high doses, first-generation drugs, early EPS, diabetes and mood disorders. Prevent with lowest effective doses and regular AIMS screening; manage by reviewing the need, reducing dose or switching to clozapine, and VMAT2 inhibitors; stop anticholinergics, which can worsen it.
:::

## 4.2 Viva rapid-fire [core]
:::viva
Which receptor do all antipsychotics act on? :: Dopamine D2.
Pathway responsible for EPS? :: Nigrostriatal.
Pathway responsible for raised prolactin? :: Tuberoinfundibular.
Therapeutic D2 occupancy? :: About 60 to 80%.
Why do atypicals cause fewer EPS? :: 5-HT2A blockade.
Antipsychotic that is a partial agonist? :: Aripiprazole.
Atypical with the most weight gain? :: Olanzapine (and clozapine).
Atypical that raises prolactin most? :: Risperidone (and paliperidone, amisulpride).
Earliest EPS? :: Acute dystonia (hours to days).
Treatment of acute dystonia? :: IM or IV anticholinergic.
Treatment of akathisia? :: Reduce dose, propranolol, benzodiazepine.
EPS worsened by anticholinergics? :: Tardive dyskinesia.
Lab test raised in NMS? :: Creatine kinase.
First step in NMS? :: Stop the antipsychotic.
Clozapine's main blood risk? :: Agranulocytosis.
How often are blood counts taken in the first 18 weeks of clozapine? :: Weekly.
Effect of stopping smoking on clozapine levels? :: They rise.
Antipsychotic warning in dementia? :: Increased stroke and death.
Scale for monitoring abnormal movements? :: AIMS.
Common Indian IM combination for agitation? :: Haloperidol with promethazine.
Chlorpromazine 100 mg equals how much haloperidol? :: About 2 mg.
Adequate antipsychotic trial length? :: 2 to 6 weeks at a therapeutic dose.
Minimum duration after first-episode remission? :: 1 to 2 years.
Antipsychotic risk in dementia? :: Stroke and death.
Antipsychotic for Parkinson's psychosis? :: Low-dose quetiapine or clozapine.
Medicine for antipsychotic weight gain? :: Metformin.
Add-on to lower prolactin? :: Low-dose aripiprazole.
Best medicine for akathisia? :: Propranolol.
Medicine class for tardive dyskinesia? :: VMAT2 inhibitors.
Clozapine starting dose? :: 12.5 mg.
Restart clozapine titration after missing how long? :: 48 hours.
Target clozapine level? :: At least 350 ng/mL.
:::

## 4.3 Module test [core]
:::mcq
Q: Raised prolactin from antipsychotics is due to blockade in the:
- Mesolimbic pathway
- Nigrostriatal pathway
- *Tuberoinfundibular pathway
- Mesocortical pathway
> Dopamine normally inhibits prolactin release.

Q: A 20-year-old man given haloperidol yesterday has his eyes stuck upward and neck twisted. Treatment:
- Stop all medicines and wait
- *IM anticholinergic (for example procyclidine or promethazine)
- Propranolol
- Dantrolene
> Acute dystonia responds within minutes.

Q: Two weeks into aripiprazole, a patient paces, can't sit still and feels terrible inside. Most likely:
- Worsening psychosis
- *Akathisia
- Tardive dyskinesia
- Parkinsonism
> Inner restlessness; reduce dose or add propranolol.

Q: After 6 years on fluphenazine, a woman has lip smacking and tongue writhing. Which would worsen it?
- Lowering the dose
- Switching to clozapine
- *Adding an anticholinergic
- A VMAT2 inhibitor
> Anticholinergics can worsen tardive dyskinesia.

Q: Fever, lead-pipe rigidity, confusion, unstable BP and a CK of 9,000 on haloperidol. Diagnosis:
- Serotonin syndrome
- *Neuroleptic malignant syndrome
- Malignant hyperthermia from anaesthesia
- Infection only
> Classic NMS.

Q: The first action in suspected NMS is:
- Increase the antipsychotic
- *Stop the antipsychotic and transfer to medical care
- Give an SSRI
- Start lithium
> Then fluids, cooling, benzodiazepines, dantrolene or bromocriptine.

Q: Which antipsychotic has the highest risk of weight gain and diabetes?
- Aripiprazole
- Haloperidol
- *Olanzapine
- Lurasidone
> Olanzapine and clozapine.

Q: A patient on clozapine develops fever and sore throat. First step:
- Paracetamol and review next week
- *Urgent blood count (neutrophils)
- Increase the dose
- Start antibiotics only
> Rule out agranulocytosis.

Q: A clozapine patient admitted to a no-smoking ward becomes drowsy and has a seizure. Why?
- Clozapine was stopped
- *Stopping smoking raised clozapine levels
- Nicotine withdrawal causes seizures
- Infection
> CYP1A2 induction by smoke is lost.

Q: Clozapine is indicated after failure of:
- One antipsychotic for 1 week
- *Two antipsychotics at adequate dose and duration
- Psychotherapy alone
- ECT only
> Treatment-resistant schizophrenia.

Q: Which is a reason to choose aripiprazole?
- Need for sedation
- *Raised prolactin or weight gain on another antipsychotic
- Severe akathisia
- QT prolongation risk is irrelevant
> Partial agonist; weight-neutral; lowers prolactin.

Q: Antipsychotics in older adults with dementia:
- Are safe at any dose
- *Increase the risk of stroke and death
- Improve memory
- Have no side effects
> Use only for severe risk, briefly, at the lowest dose.

Q: A first-episode patient on risperidone develops amenorrhoea and galactorrhoea but is otherwise well. A reasonable step is:
- Add haloperidol
- *Reduce the dose or add low-dose aripiprazole
- Stop all medicines suddenly
- Add trihexyphenidyl
> Partial agonism lowers prolactin.

Q: A patient on clozapine missed 4 days of doses. The correct plan is:
- Restart at the previous full dose
- *Restart titration from 12.5 mg
- Double the dose for 2 days
- Switch to haloperidol
> Missing more than 48 hours requires re-titration.

Q: An 80-year-old with Alzheimer's is restless at night. The first approach is:
- Haloperidol at night
- Risperidone long term
- *Look for causes and use non-drug measures first
- Clozapine
> Antipsychotics raise stroke and death risk in dementia.

Q: Which is the best treatment option for tardive dyskinesia?
- Increase trihexyphenidyl
- *A VMAT2 inhibitor such as tetrabenazine or valbenazine
- Increase haloperidol
- Add a benzodiazepine long-term only
> Also review the antipsychotic and consider switching to clozapine.
:::
`;
