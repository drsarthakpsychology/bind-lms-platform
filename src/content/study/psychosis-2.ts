/* Module · Schizophrenia spectrum and catatonia, Parts II and III (causes, course and treatment; catatonia; Beginner level check). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part II · Why it happens and how it runs

## 2.1 Causes [core][beginner]
Schizophrenia arises from **many small influences** adding up over development: genes, early brain development and later environmental hits.

### Genes
- Heritability in twin studies is about **80%**, among the highest in psychiatry. Yet most people with schizophrenia have no affected parent.
- Risk for relatives rises with closeness: roughly 1% general population, about 10% for a child of one affected parent or a sibling, about 40 to 50% for a child of two affected parents or an identical co-twin.
- Thousands of common variants each add a tiny amount; rare **copy number variants** (for example the **22q11.2 deletion**, which carries about a 25% risk) add a lot.

### Neurodevelopment
- **Obstetric complications** (hypoxia, low birth weight, maternal infection or malnutrition in pregnancy).
- **Winter and spring birth** (small effect, possibly infection-related).
- Subtle childhood differences in motor development, cognition and social behaviour, years before onset.
- **Adolescent synaptic pruning** in the prefrontal cortex may "unmask" earlier vulnerability, explaining onset in young adulthood.

### Environment
- **Cannabis**, especially frequent, high-potency use starting in adolescence, raises risk (roughly two- to fourfold with daily high-potency use).
- **Urban upbringing**, **migration** and **minority status** (with discrimination and social defeat), and **childhood adversity**.
- Stress acts on a vulnerable brain (the **stress-vulnerability model**, Zubin and Spring).

### Brain chemistry (in outline)
- **Dopamine**: excess dopamine release in the striatum is linked to positive symptoms; all current approved antipsychotics except one new class act on dopamine D2 receptors.
- **Glutamate**: reduced NMDA receptor function (ketamine and PCP produce positive, negative and cognitive symptoms in healthy people) may sit upstream of the dopamine changes.
(Detail in the Advanced level.)

:::widget guess
{"prompt": "If one identical twin has schizophrenia, roughly what is the chance that the other twin also develops it?", "min": 0, "max": 100, "unit": "%", "answer": [40, 50], "reveal": "About 40 to 50%. Very high, but not 100%, even with identical genes. Something beyond genes (development, environment, chance) decides whether illness appears.", "clinician": "Concordance in monozygotic twins is roughly 40 to 50% versus about 10 to 15% in dizygotic twins; twin heritability estimates are around 80%."}
:::

:::widget sort
{"prompt": "Gene, development or environment?", "buckets": ["Genetic", "Neurodevelopmental", "Environmental"], "items": [{"text": "22q11.2 deletion", "bucket": 0}, {"text": "Low birth weight after maternal malnutrition", "bucket": 1}, {"text": "Daily high-potency cannabis from age 15", "bucket": 2}, {"text": "Growing up in a large city", "bucket": 2}, {"text": "Delayed motor milestones and social awkwardness in childhood", "bucket": 1}, {"text": "A parent with schizophrenia", "bucket": 0, "why": "Shared genes, though family environment also contributes."}]}
:::

:::recall
1. What is the twin heritability of schizophrenia? || About 80%.
2. Give the approximate risk for a child of one affected parent and for an identical co-twin. || About 10%; about 40 to 50%.
3. Name three environmental risk factors. || Adolescent cannabis, urban upbringing, migration and minority status, childhood adversity.
:::

:::mcq
Q: The stress-vulnerability model proposes that schizophrenia appears when:
- Stress alone is severe enough
- Genes alone are present
- *Stress acts on an underlying vulnerability
- Parents are cold
> Vulnerability plus stress, not either alone.
:::

## 2.2 Course and prognosis [core][beginner]
### Phases
1. **Premorbid**: often subtle differences in childhood.
2. **Prodrome**: months to years of withdrawal, falling functioning, odd ideas, suspiciousness, sleep change. Often noticed only in hindsight.
3. **Acute (active) phase**: positive symptoms dominate.
4. **Residual or stable phase**: negative and cognitive symptoms may persist; relapses can occur.

### Outcomes are varied
- Some recover fully after one episode; many have relapses with partial recovery between; a minority have a continuous, disabling course.
- In a meta-analysis, only about **1 in 7** met strict long-term criteria for both clinical and social recovery. Yet many more live meaningful lives with some ongoing symptoms ("personal recovery").
- Life expectancy is reduced by about **15 years**, mostly from heart disease, diabetes, smoking and lung disease, accidents and suicide. Physical health care is part of psychiatric care.

### Good and poor prognostic factors
| Good prognosis | Poor prognosis |
|---|---|
| Acute onset | Insidious onset |
| Later onset | Early onset, especially in adolescence |
| Clear precipitating stressor | No precipitant |
| Prominent mood symptoms | Prominent negative symptoms |
| Good premorbid functioning | Poor premorbid functioning |
| Female | Male |
| Married, supportive family | Single, isolated |
| Short duration of untreated psychosis | Long duration of untreated psychosis |
| Good adherence | Substance use, poor adherence |
| Family history of mood disorder | Family history of schizophrenia |

### Expressed emotion
**Expressed emotion (EE)** describes family attitudes towards the ill person: **critical comments**, **hostility** and **emotional over-involvement**. High EE roughly **doubles** relapse risk. **Family interventions** (education, communication and problem-solving skills) reduce relapse and are recommended for every family in contact with the person.

:::widget sort
{"prompt": "Good or poor prognostic factor?", "buckets": ["Good prognosis", "Poor prognosis"], "items": [{"text": "Sudden onset after a bereavement", "bucket": 0}, {"text": "Gradual onset over years in a socially isolated teenager", "bucket": 1}, {"text": "Prominent depressive symptoms during the episode", "bucket": 0}, {"text": "Continued daily cannabis use", "bucket": 1}, {"text": "Untreated psychosis for three years before first treatment", "bucket": 1}, {"text": "Married, working, supportive family", "bucket": 0}]}
:::

:::widget decide
{"scene": "Ramesh, 28, is recovering from his second episode. His mother, devoted and anxious, does everything for him, checks on him constantly and cries when he goes out alone. His father often says, 'He is just lazy, he could work if he tried.'", "ask": "What would most reduce his risk of relapse?", "choices": [{"label": "Increase his antipsychotic dose", "verdict": "ok", "outcome": "He becomes drowsy; the family tension continues and he relapses within a year.", "why": "Medicine matters, but high expressed emotion is a separate, treatable relapse risk."}, {"label": "Offer family intervention: education about the illness, reducing criticism and over-involvement, and teaching communication and problem-solving, alongside continued medicine", "verdict": "best", "outcome": "The father stops calling him lazy; the mother lets him take the bus alone. He stays well and starts part-time work.", "why": "Family interventions targeting expressed emotion reduce relapse."}, {"label": "Advise him to cut contact with his parents", "verdict": "harm", "outcome": "He moves out, stops medicine and relapses.", "why": "The family is a resource; the aim is to change patterns, not to remove support."}]}
:::

:::recall
1. Name the four phases of schizophrenia. || Premorbid, prodrome, acute, residual or stable.
2. Give five good prognostic factors. || Acute onset, later onset, precipitant, mood symptoms, good premorbid function, female, married, short DUP.
3. What are the three components of expressed emotion? || Critical comments, hostility, emotional over-involvement.
4. By how much is life expectancy reduced in schizophrenia? || About 15 years.
:::

:::mcq
Q: Which factor predicts a poorer prognosis?
- Acute onset
- Clear precipitant
- *Prominent negative symptoms
- Married status
> Negative symptoms predict worse functional outcome.
:::

## 2.3 Assessment and treatment [core][beginner]
### Assessment
History (including collateral), MSE, risk (to self, from others, to others, of neglect), physical examination and first-episode work-up, substance use, family and social circumstances, and the person's own goals. Rating: **PANSS** (30 items: 7 positive, 7 negative, 16 general psychopathology) or **BPRS**.

### Treatment principles
1. **Engage** the person and family; agree shared goals.
2. **Antipsychotic medicine** at the lowest effective dose.
3. **Psychological and family interventions**: CBT for psychosis, family intervention.
4. **Rehabilitation**: supported employment (Individual Placement and Support), education, social skills, housing.
5. **Physical health**: weight, glucose, lipids, blood pressure, smoking cessation.
6. **Relapse prevention**: early warning signs plan, continued treatment.

:::widget guess
{"prompt": "In first-episode schizophrenia, if an antipsychotic is going to help, by about how many weeks should at least some improvement usually show?", "min": 0, "max": 12, "unit": "weeks", "answer": [2, 4], "reveal": "Often within the first 2 to 4 weeks. Most improvement happens early. If there is no improvement at all after several weeks at an adequate dose, a change is usually considered, rather than waiting months.", "clinician": "Improvement typically begins in the first 1 to 2 weeks; lack of any improvement by 2 to 4 weeks at an adequate dose predicts non-response. An adequate trial is usually about 4 to 6 weeks at a therapeutic dose with confirmed adherence."}
:::

:::student
### Typical adult daily doses (educational only)
| Medicine | Typical adult daily range |
|---|---|
| Risperidone | 2 to 6 mg |
| Olanzapine | 10 to 20 mg |
| Aripiprazole | 10 to 30 mg |
| Quetiapine | 300 to 800 mg |
| Amisulpride | 400 to 800 mg |
| Haloperidol | 2 to 10 mg |
| Clozapine | 200 to 450 mg (specialist use) |
:::

:::clinician
### Antipsychotic dosing (for learning; check current guidelines)
| Medicine | Start | First-episode target | Usual max | Indian brands | Watch for |
|---|---|---|---|---|---|
| Risperidone | 1 to 2 mg | 2 to 4 mg | 6 to 8 mg | Sizodon, Risdone | Prolactin, EPS at higher doses |
| Olanzapine | 5 to 10 mg | 10 to 15 mg | 20 mg | Oleanz, Olimelt | Weight, glucose, lipids, sedation |
| Aripiprazole | 5 to 10 mg | 10 to 15 mg | 30 mg | Arip MT, Aripra | Akathisia; low prolactin and metabolic risk |
| Quetiapine | 50 to 100 mg | 300 to 600 mg | 800 mg | Qutipin, Seroquin | Sedation, orthostasis, metabolic |
| Amisulpride | 200 to 400 mg | 400 to 800 mg | 1200 mg | Sulpitac, Amipride | Prolactin, QT; renally cleared |
| Lurasidone | 40 mg with food | 40 to 80 mg | 160 mg | Lurasid | Take with at least 350 kcal; akathisia |
| Haloperidol | 1.5 to 3 mg | 2 to 5 mg | 10 to 20 mg | Serenace | EPS, dystonia, QT (IV) |

**Titration.** First-episode patients respond to lower doses and are more sensitive to side effects: start low, increase over 1 to 2 weeks, and judge after about 4 to 6 weeks at a therapeutic dose. **Monitoring**: weight weekly for 6 weeks, then at 12 weeks and yearly; glucose and lipids at baseline, 12 weeks and yearly; prolactin if symptomatic; ECG at baseline with QT risk. **Long-acting injections** (for example paliperidone palmitate, aripiprazole monohydrate, flupentixol, fluphenazine decanoate such as Prolinate, haloperidol decanoate) help adherence and reduce relapse; offer early, not only as a last resort.
:::

### Side effects to know
| Type | Examples |
|---|---|
| Extrapyramidal | Acute dystonia (hours to days; treat with an anticholinergic), akathisia (inner restlessness; propranolol, dose reduction), parkinsonism (weeks), tardive dyskinesia (months to years; involuntary mouth and tongue movements; VMAT2 inhibitors where available) |
| Neuroleptic malignant syndrome | Fever, rigidity, confusion, autonomic instability, raised CK: an emergency; stop the antipsychotic |
| Metabolic | Weight gain, diabetes, raised lipids (olanzapine and clozapine highest) |
| Prolactin | Breast enlargement, galactorrhoea, menstrual and sexual problems, bone loss (risperidone, amisulpride, haloperidol) |
| Cardiac | QT prolongation, orthostatic hypotension, tachycardia |
| Other | Sedation, anticholinergic effects, seizures (clozapine) |

### How long to continue
After a first episode, continuing medicine for at least **1 to 2 years** after remission is usually advised. In trials, about **27%** relapsed within a year on maintenance antipsychotics versus about **64%** on placebo.

:::recall
1. Name the six principles of treatment. || Engage; antipsychotic; psychological and family work; rehabilitation; physical health; relapse prevention.
2. What predicts non-response early in treatment? || No improvement by about 2 to 4 weeks at an adequate dose.
3. Give the four extrapyramidal side effects in order of onset. || Acute dystonia, akathisia, parkinsonism, tardive dyskinesia.
4. Roughly what were 1-year relapse rates on maintenance versus placebo? || About 27% versus 64%.
:::

:::mcq
Q: A young man develops a painful backward twisting of the neck and upward eye deviation a day after his first haloperidol injection. This is:
- Tardive dyskinesia
- Akathisia
- *Acute dystonia
- Neuroleptic malignant syndrome
> Treat with an anticholinergic such as procyclidine or promethazine.
:::

## 2.4 Early intervention and the at-risk mental state [core][beginner]
### Early intervention in psychosis
Specialist teams for people in their first episode (usually aged 14 to 35) provide rapid assessment, low-dose medicine, family work, CBT for psychosis, education and employment support, and physical health care, typically for about three years. They reduce relapse and admissions and improve work and study outcomes.

### The clinical high-risk (at-risk mental state) state
Young people seeking help with:
- **Attenuated psychotic symptoms**: unusual thoughts or perceptions below psychotic intensity;
- **Brief limited intermittent psychotic symptoms (BLIPS)**: frank psychosis lasting days and resolving without treatment;
- **Genetic risk with functional decline**: a first-degree relative with psychosis, or schizotypal personality, plus falling functioning.
Assessed with the **CAARMS** or **SIPS**.

:::widget guess
{"prompt": "In early studies of young people meeting clinical high-risk criteria, roughly what percentage developed psychosis within about 2 to 3 years?", "min": 0, "max": 100, "unit": "%", "answer": [20, 30], "reveal": "Roughly 20 to 30% in early studies, lower (often 15 to 20%) in more recent cohorts. So most do not develop psychosis, though many have ongoing depression, anxiety or poor functioning and need help regardless.", "clinician": "A 2012 meta-analysis reported transition of about 22% at 1 year, 29% at 2 years and 36% after 3 years; later cohorts show lower rates, possibly from earlier referral and dilution of samples."}
:::

### Management of clinical high risk
- Monitoring, support, treatment of depression, anxiety and substance use, and **CBT**.
- **Antipsychotics are not routinely recommended** for prevention.
- Omega-3 fatty acids looked promising in one trial but larger trials did not replicate the benefit.

:::widget decide
{"scene": "Nisha, 18, from Bhubaneswar, says that for two months she has heard faint whispers when she is alone and feels people on the street may be looking at her for a reason, though she can see this might be her imagination. Her studies have slipped. Her uncle has schizophrenia. Her parents demand 'an injection so she never gets schizophrenia'.", "ask": "What is the best plan?", "choices": [{"label": "Start an antipsychotic to prevent schizophrenia", "verdict": "harm", "outcome": "She gains weight and feels dulled, stops the tablets and avoids services.", "why": "Antipsychotics are not routinely recommended at clinical high risk; most never develop psychosis."}, {"label": "Explain the at-risk state honestly and without alarm; offer regular monitoring, CBT, help with study stress and low mood, advice to avoid cannabis, and a clear plan if symptoms worsen", "verdict": "best", "outcome": "She stays engaged. Her symptoms settle over months and she returns to college.", "why": "Monitoring plus psychological support is the evidence-based approach; it treats current distress and catches transition early."}, {"label": "Reassure them it's nothing and discharge", "verdict": "harm", "outcome": "Six months later she is admitted with full psychosis after a long delay.", "why": "Clinical high-risk states need follow-up."}]}
:::

:::recall
1. Name the three ways young people meet clinical high-risk criteria. || Attenuated psychotic symptoms; BLIPS; genetic risk with functional decline.
2. Are antipsychotics routinely recommended at clinical high risk? || No.
3. What do early intervention in psychosis services provide? || Rapid assessment, low-dose medicine, family work, CBTp, education and work support, physical health care.
:::

:::mcq
Q: Which statement about clinical high-risk states is correct?
- Almost all develop schizophrenia
- *Most do not develop psychosis, but many need help for other problems
- Antipsychotics are first-line
- They are diagnosed by brain scan
> Monitoring and psychological support.
:::

## 2.5 Talking therapy for voices and beliefs [core][beginner]
### CBT for psychosis (CBTp)
- Builds a shared understanding of how experiences developed (often linking stress, trauma, sleep loss and drugs).
- Examines the evidence for distressing beliefs and alternative explanations, gently and collaboratively.
- Reduces distress from voices by changing beliefs about their power and intent ("The voice says it will kill my family if I don't obey" becomes "It has said that for years and never acted").
- Reduces safety behaviours and avoidance; builds coping strategies.
- Effects on symptoms are modest but meaningful; it can help people who decline medicine and those with persistent symptoms.

### Other approaches
| Approach | What it involves |
|---|---|
| Family intervention | Education, communication and problem-solving with families; reduces relapse |
| AVATAR therapy | The person creates a computer avatar of their persecutory voice and practises standing up to it in dialogue with a therapist who voices the avatar; promising trials |
| Cognitive remediation | Computerised and coached exercises to improve attention, memory and planning; benefits largest with rehabilitation |
| Social skills training | Practising everyday interactions |
| Supported employment (IPS) | Rapid job search with ongoing support, rather than long pre-vocational training |
| Peer support and hearing voices groups | Shared experience, hope and coping |

:::widget worked
{"title": "Working with a frightening voice in CBTp", "steps": [{"q": "Ravi, 30, hears a voice saying, 'If you go out, they will kill you.' What is the first step?", "a": "Engage and understand: when did it start, what does it say, how powerful does Ravi believe it is (0 to 100%), what does he do in response (stays in)."}, {"q": "What beliefs about the voice drive his distress?", "a": "'The voice is powerful, knows everything and will make it happen.' Rate belief: 90%."}, {"q": "How might you gently test the belief?", "a": "Review the evidence together: how many times has the voice made threats? What happened? Has it ever been right? Design a small experiment: a short walk to the corner shop with the therapist."}, {"q": "What happened, and what changed?", "a": "The walk happened; nothing bad occurred, and the voice got quieter. Belief in the voice's power fell to 50%, and Ravi planned a longer walk."}]}
:::

:::recall
1. Name three goals of CBT for psychosis. || Shared understanding, re-evaluating distressing beliefs, changing beliefs about voices, reducing safety behaviours and avoidance, coping.
2. What is AVATAR therapy? || Dialogue with a computer avatar of one's persecutory voice to build power and control.
3. What is IPS? || Individual Placement and Support: rapid supported job search.
:::

:::mcq
Q: In CBTp, which belief would therapy most likely target to reduce distress from voices?
- That the voices exist
- *That the voice is all-powerful and must be obeyed
- That the person has an illness
- That medicine is unnecessary
> Beliefs about power and intent drive distress.
:::

## 2.6 Clozapine and treatment-resistant schizophrenia [core][beginner]
:::define Treatment-resistant schizophrenia
Persistent significant symptoms despite **at least two** antipsychotics, each given at an **adequate dose** for an **adequate duration** (usually at least 6 weeks), with **confirmed adherence**. About a quarter to a third of people with schizophrenia meet this definition.
:::

**Clozapine** is the only antipsychotic with clear superiority in treatment-resistant schizophrenia. Around 40% of people who did not respond to other drugs respond to clozapine. It also reduces suicidal behaviour in schizophrenia. Yet it is under-used, often started years too late.

### Starting and monitoring
- Start low (12.5 mg once or twice on day 1) and increase gradually by 25 to 50 mg a day, as tolerated, towards about 300 mg over 2 to 3 weeks. Usual range 300 to 450 mg; adjust by response and plasma levels (a level of about 350 ng/mL or more is a common target).
- **Blood counts** to monitor neutrophils: commonly weekly for the first 18 weeks, then fortnightly to a year, then monthly (schedules vary by country). In 2025 the US FDA ended its clozapine REMS programme, but regular counts remain standard in India and the UK.
- Watch for **myocarditis** in the first two months (fever, chest pain, raised heart rate, troponin and CRP).

### Side effects
| Serious | Common |
|---|---|
| Neutropenia and agranulocytosis (under 1%, mostly in the first 18 weeks) | Sedation |
| Myocarditis and cardiomyopathy | Hypersalivation (often at night) |
| Severe constipation and ileus (can be fatal) | Weight gain, diabetes, raised lipids |
| Seizures (dose-related) | Tachycardia, postural hypotension |
| Neuroleptic malignant syndrome | Fever early in treatment, urinary incontinence |

:::clinician
### Clozapine pearls
- **Smoking** induces CYP1A2 and lowers clozapine levels by up to about half; **stopping smoking** (including during admission) can raise levels sharply. Adjust and check levels.
- **Fluvoxamine** and **ciprofloxacin** inhibit CYP1A2 and raise levels.
- Missing more than 48 hours means re-titrating from a low dose.
- Treat constipation actively (stool softeners, stimulant laxatives); ask about it at every visit.
- If response is partial, consider augmentation with aripiprazole or amisulpride, or ECT.
- Indian brands include Sizopin, Lozapin and Skizoril.
:::

:::widget decide
{"scene": "Deepa, 32, from Nagpur, has had schizophrenia for nine years. She has taken risperidone 6 mg, olanzapine 20 mg and haloperidol, each for months, with confirmed adherence (including an injection). She still hears constant voices and has tried to harm herself twice.", "ask": "What is the best next step?", "choices": [{"label": "Combine two other antipsychotics at high doses", "verdict": "harm", "outcome": "She becomes stiff and sedated; the voices continue.", "why": "High-dose combinations have weak evidence and more side effects. Clozapine is indicated."}, {"label": "Offer clozapine with careful titration and blood monitoring, explain benefits and risks, and continue psychological and family support", "verdict": "best", "outcome": "After three months on clozapine her voices are much quieter, and she has no further suicidal behaviour.", "why": "She meets criteria for treatment-resistant schizophrenia; clozapine is the evidence-based choice and reduces suicidal behaviour."}, {"label": "Accept that nothing more can help", "verdict": "harm", "outcome": "She continues to suffer and remains at risk.", "why": "Clozapine has not been tried."}]}
:::

:::recall
1. Define treatment-resistant schizophrenia. || Persistent symptoms despite two adequate antipsychotic trials with confirmed adherence.
2. Name four serious clozapine side effects. || Agranulocytosis, myocarditis, severe constipation or ileus, seizures (also NMS).
3. How does smoking affect clozapine levels? || Smoking lowers levels via CYP1A2 induction; stopping raises them.
:::

:::mcq
Q: Which antipsychotic reduces suicidal behaviour in schizophrenia?
- Haloperidol
- *Clozapine
- Quetiapine
- Amisulpride
> Shown in the InterSePT trial.
:::

# Part III · Catatonia

## 3.1 Recognising and treating catatonia [core][beginner]
Catatonia is a **psychomotor syndrome** that can occur with mood disorders (most commonly), schizophrenia, autism, and many medical conditions. It is common, often missed, and usually very treatable.

:::define DSM-5-TR catatonia: 3 or more of 12
Stupor; catalepsy; waxy flexibility; mutism; negativism; posturing; mannerism; stereotypy; agitation not influenced by external stimuli; grimacing; echolalia; echopraxia.
DSM-5-TR uses it as a specifier ("with catatonia") for other mental disorders, as **catatonic disorder due to another medical condition**, or as unspecified catatonia.
:::

### Two faces
- **Retarded (stuporous)**: mutism, immobility, staring, rigidity, posturing, refusal to eat or drink.
- **Excited**: purposeless overactivity, agitation, combativeness, impulsivity.
- **Malignant catatonia**: catatonia with fever and autonomic instability: life-threatening; overlaps with **neuroleptic malignant syndrome**.

### Assessment
- Examine actively: raise an arm (catalepsy, waxy flexibility), test for resistance proportional to force (gegenhalten), grasp reflex, echo phenomena, automatic obedience.
- **Bush-Francis Catatonia Rating Scale**: 23 items; the first 14 form a screening instrument.
- Search for causes: infections, encephalitis (including anti-NMDA receptor), non-convulsive status epilepticus, metabolic disorders, drug withdrawal (benzodiazepines, clozapine), neuroleptic malignant syndrome.
- Check hydration, nutrition, clots, pressure areas, CK, renal function.

### Treatment
1. **Lorazepam**: a test dose (for example 1 to 2 mg) often produces striking improvement within hours, which supports the diagnosis. Many respond to standard doses (up to about 4 mg a day); some need higher doses (8 to 24 mg a day).
2. **ECT** if benzodiazepines fail, in malignant catatonia, or when the person's life is at risk from not eating or drinking. ECT is highly effective.
3. **Avoid starting antipsychotics** until NMS is excluded and catatonia is improving; high-potency antipsychotics can worsen catatonia.
4. Treat the underlying cause and give supportive medical care (fluids, nutrition, clot prevention).

:::widget decide
{"scene": "Mr Kumar, 45, with a history of depression, is brought to emergency in Patna: mute and motionless for four days, not eating or drinking, staring, with an arm held in an odd position. His temperature is normal; CK is mildly raised. A colleague suggests haloperidol 'to calm him'.", "ask": "What is the best plan?", "choices": [{"label": "Give haloperidol", "verdict": "harm", "outcome": "He becomes rigid and febrile with rising CK: neuroleptic malignant syndrome.", "why": "Antipsychotics can worsen catatonia and precipitate NMS."}, {"label": "Give a lorazepam test dose, start regular lorazepam, rehydrate, start clot prevention, investigate medical causes, and plan ECT if he does not respond quickly", "verdict": "best", "outcome": "Within hours of lorazepam he begins to speak and drink. His underlying depression is then treated.", "why": "Benzodiazepines first, ECT if needed, with medical support and a search for causes."}, {"label": "Wait for him to start talking", "verdict": "harm", "outcome": "He becomes dehydrated with acute kidney injury.", "why": "Catatonic stupor is a medical emergency."}]}
:::

:::recall
1. How many of the 12 DSM-5-TR catatonic signs are needed? || Three.
2. With which condition is catatonia most commonly associated? || Mood disorders.
3. What is the first-line treatment, and what if it fails? || Lorazepam; ECT.
4. Why avoid antipsychotics early in catatonia? || They can worsen it and precipitate NMS.
:::

:::mcq
Q: Malignant catatonia is distinguished by:
- Mutism only
- *Fever and autonomic instability, making it life-threatening
- Response to haloperidol
- Hallucinations
> An emergency; ECT is often needed.
:::

## 3.2 Level check · Beginner [beginner]
Twelve or more right out of fifteen opens the Advanced level.

:::mcq
Q: Criterion A of schizophrenia requires two or more symptoms, including at least one of:
- Negative symptoms or catatonia
- *Delusions, hallucinations or disorganised speech
- Depression or mania
- Cognitive impairment
> At least one of the first three.

Q: Total duration of continuous signs for DSM-5-TR schizophrenia is at least:
- 1 month
- 3 months
- *6 months
- 12 months
> Including at least a month of active symptoms.

Q: Psychosis for 3 months with no mood episodes is:
- Brief psychotic disorder
- *Schizophreniform disorder
- Schizophrenia
- Schizoaffective disorder
> 1 to under 6 months.

Q: Brief psychotic disorder lasts:
- *At least 1 day but less than 1 month
- 1 to 6 months
- 6 months or more
- Less than a day
> With full return to previous functioning.

Q: Schizoaffective disorder requires delusions or hallucinations without a mood episode for at least:
- 1 day
- *2 weeks
- 6 months
- 1 year
> And mood episodes for most of the illness.

Q: Which suggests an organic cause of psychosis?
- Third-person voices in clear consciousness
- *Seizures, dyskinesias and fluctuating consciousness
- Gradual withdrawal over a year
- Family history of schizophrenia
> Think encephalitis or delirium.

Q: The twin heritability of schizophrenia is about:
- 10%
- 30%
- 50%
- *80%
> Among the highest in psychiatry.

Q: Which is a poor prognostic factor?
- Acute onset
- Prominent mood symptoms
- *Long duration of untreated psychosis
- Good premorbid functioning
> Delay predicts worse outcome.

Q: High expressed emotion includes:
- Warmth and praise
- *Critical comments, hostility and emotional over-involvement
- Silence
- Religious belief
> Roughly doubles relapse risk.

Q: The earliest-onset extrapyramidal side effect is:
- Tardive dyskinesia
- Parkinsonism
- *Acute dystonia
- Akathisia
> Hours to days.

Q: Fever, rigidity, confusion and raised CK on an antipsychotic suggest:
- Akathisia
- *Neuroleptic malignant syndrome
- Tardive dyskinesia
- Serotonin syndrome
> An emergency.

Q: Antipsychotics for clinical high-risk young people are:
- First-line
- *Not routinely recommended
- Required by law
- Given to all with a family history
> Monitoring and CBT.

Q: Treatment-resistant schizophrenia is defined by failure of at least:
- One antipsychotic for 1 week
- *Two adequate antipsychotic trials with confirmed adherence
- Three antipsychotics including clozapine
- Psychotherapy alone
> Then clozapine.

Q: Stopping smoking in a patient on clozapine is likely to:
- Lower clozapine levels
- *Raise clozapine levels
- Have no effect
- Cause neutropenia directly
> Smoking induces CYP1A2.

Q: First-line treatment for catatonia is:
- Haloperidol
- *Lorazepam
- Lithium
- Sertraline
> ECT if it fails.
:::
`;
