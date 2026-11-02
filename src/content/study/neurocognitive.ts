import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "neurocognitive",
  num: 17,
  title: "Delirium and dementia",
  emoji: "🕰️",
  tagline: "Acute confusion, gradual decline, the reversible causes, and caring for families",
  when: "Weeks 13 to 14",
  outcomes: [
    "Define delirium, mild and major neurocognitive disorder, and tell delirium from dementia",
    "Find the cause of delirium and manage it without harm",
    "Describe Alzheimer's, vascular, Lewy body and frontotemporal dementias",
    "List reversible causes of cognitive decline and the work-up",
    "Manage behavioural symptoms and support carers",
  ],
  writeTask:
    "On paper, from memory: the delirium criteria and the CAM, a delirium-vs-dementia table, the PINCH ME causes, the four main dementias with a defining feature each, the reversible causes, and the medicines for Alzheimer's. Then check and correct in red.",
  activities: [
    act.lesson("ls-2", "Quiz: delirium and dementia", "Criteria, subtypes and causes."),
    act.scenarios("dementia", "Patient case: “Maa keeps asking the same thing”", "Supporting a carer and spotting delirium."),
    act.coach("neuroscience", "Coach: neuroscience", "Brain areas and transmitters."),
  ],
  noteId: "dementia",
};

export const text = String.raw`
# Part I · Delirium

## 1.1 What delirium is [core]
:::define Delirium
A disturbance in **attention** and **awareness** that develops over a **short period** (hours to days), represents a change from baseline, and **fluctuates** during the day; with an additional disturbance in cognition (memory, orientation, language, perception); not better explained by a pre-existing neurocognitive disorder and not occurring in coma; with evidence of a **medical cause** (illness, intoxication, withdrawal, medicine).
:::

| Subtype | What you see | Note |
|---|---|---|
| Hyperactive | Agitated, restless, pulling lines, hallucinating | Easy to spot |
| **Hypoactive** | Quiet, drowsy, withdrawn, slow | **Commonest and most missed**; often mistaken for depression |
| Mixed | Swings between both | |

- Common in older adults in hospital, after surgery (especially hip fracture), in ICU, and at the end of life.
- It is a **medical emergency**: it raises the risk of death, longer stays, falls, and lasting cognitive decline.

:::sounds How delirium sounds
- Family: “Kal tak bilkul theek the, aaj kisi ko pehchaan nahi rahe.” (Fine yesterday; today he doesn't recognise anyone.)
- Patient at night: “Deewar pe keede chal rahe hain!” (Insects are crawling on the wall!)
- Nurse: “Subah theek lagte hain, shaam ko confuse ho jaate hain.” Fluctuation and sundowning.
:::

## 1.2 Finding the cause [core]
:::mnemonic PINCH ME
**P**ain · **I**nfection (urine, chest) · **N**utrition (and thiamine) · **C**onstipation (and urinary retention) · **H**ydration (dehydration, electrolytes, sodium) · **M**edication (anticholinergics, opioids, benzodiazepines, steroids, new drugs; alcohol or benzodiazepine **withdrawal**) · **E**nvironment (new ward, no glasses or hearing aid, sleep loss).
:::
Also: low oxygen, low or high glucose, stroke, head injury, seizures, liver or kidney failure, heart attack, thyroid.

### Assessment
- Screen with the **CAM** (Confusion Assessment Method): (1) acute onset and fluctuating course **and** (2) inattention, **plus** either (3) disorganised thinking **or** (4) altered level of consciousness. Or the **4AT**.
- Test attention: months of the year backwards, digit span.
- History from family and notes: baseline function, timing, new medicines, alcohol.
- Examination and tests: vital signs, oxygen, glucose, blood count, electrolytes (sodium, calcium), kidney and liver, urine, chest X-ray, ECG; CT if focal signs, fall or anticoagulants; EEG if seizures are possible.

## 1.3 Management [core]
1. **Treat the cause(s)**: often more than one.
2. **Non-drug care** (the backbone): calm, well-lit room; clocks and calendars; glasses and hearing aids on; familiar people; explain what's happening; sleep at night, daylight by day; mobilise; hydrate; avoid catheters and restraints; same staff.
3. **Medicines only** when the patient is very distressed or dangerous after non-drug steps: **low-dose haloperidol** short-term. In Parkinson's or Lewy body dementia avoid haloperidol (severe sensitivity); use a small dose of quetiapine with care.
4. **Benzodiazepines only for alcohol or benzodiazepine withdrawal** (they worsen other delirium).
5. Review medicines and stop anticholinergic and sedative drugs where possible.

:::trap Delirium versus dementia
| Feature | Delirium | Dementia |
|---|---|---|
| Onset | Acute (hours to days) | Insidious (months to years) |
| Course | Fluctuating, worse at night | Slowly progressive, stable over a day |
| Attention | **Markedly impaired** | Relatively preserved early |
| Consciousness | Altered | Clear until late |
| Hallucinations | Common, especially visual | Less common (except Lewy body) |
| Reversibility | Often reversible | Usually progressive |

Delirium is often **superimposed on dementia**: any sudden worsening in someone with dementia is delirium until proven otherwise.
:::

:::recall
1. Define delirium in one sentence. || Acute, fluctuating disturbance of attention and awareness with other cognitive change, due to a medical cause.
2. Which subtype is commonest and most missed? || Hypoactive.
3. Expand PINCH ME. || Pain, infection, nutrition, constipation, hydration, medication, environment.
4. State the CAM criteria. || Acute onset and fluctuation, inattention, plus disorganised thinking or altered consciousness.
5. When are benzodiazepines appropriate in delirium? || Only for alcohol or benzodiazepine withdrawal.
6. Give five differences between delirium and dementia. || Onset, course, attention, consciousness, reversibility.
:::

## 1.4 Delirium in special situations [core]
### Delirium tremens (alcohol withdrawal delirium)
| Time after last drink | What appears |
|---|---|
| 6 to 24 hours | Tremor, sweating, anxiety, nausea, fast pulse, insomnia (simple withdrawal) |
| 12 to 48 hours | **Withdrawal seizures** (generalised, usually one or a few) |
| 12 to 48 hours | **Alcoholic hallucinosis**: hallucinations (often voices) **with a clear sensorium** |
| **48 to 72 hours** | **Delirium tremens**: confusion, disorientation, vivid visual (often small animals or insects) and tactile hallucinations, marked tremor, fever, autonomic instability |

- Delirium tremens can kill (arrhythmia, dehydration, infection, seizures). Treat in hospital: **benzodiazepines** (chlordiazepoxide, or lorazepam if liver disease or the elderly), fluids, electrolytes, look for infection and head injury.
- Give **parenteral thiamine before glucose** to prevent precipitating Wernicke's encephalopathy.

### Delirium in the intensive care unit and after surgery
- Very common (up to most ventilated patients). Linked to sedatives (benzodiazepines especially), pain, sleep loss, immobility, catheters.
- Prevention bundles: light sedation, daily sedation breaks, early mobilisation, sleep protection, family presence, glasses and hearing aids.

### Preventing delirium on any ward
:::define Multicomponent prevention (for example the Hospital Elder Life Program)
Simple non-drug measures that cut delirium by about a third in older inpatients: **orientation** (clock, calendar, names), **glasses and hearing aids**, **hydration and nutrition**, **early mobilisation**, **sleep without sedatives** (quiet nights, lights off), **avoid unnecessary catheters and lines**, **pain control**, **review medicines** (stop anticholinergics, sedatives).
:::

:::trap Antipsychotics do not prevent or cure delirium
They may be used briefly at a low dose for severe agitation that is dangerous or distressing, after non-drug measures. They do not treat the cause and are **avoided in Lewy body and Parkinson's disease**. Benzodiazepines usually **worsen** delirium, except in alcohol or sedative withdrawal.
:::

:::recall
1. When does delirium tremens usually begin after the last drink? || About 48 to 72 hours.
2. How does alcoholic hallucinosis differ from delirium tremens? || Hallucinations with a clear sensorium versus confusion with autonomic signs.
3. Why give thiamine before glucose? || To avoid precipitating Wernicke's encephalopathy.
4. List five non-drug measures to prevent delirium. || Orientation, glasses and hearing aids, hydration, mobilisation, sleep protection, medicine review.
:::

# Part II · Dementia (major neurocognitive disorder)

## 2.1 Definitions [core]
:::define Major and mild neurocognitive disorder
**Major**: significant decline from a previous level in one or more cognitive domains, enough to **interfere with independence** in everyday activities (paying bills, managing medicines). **Mild**: modest decline, **independence preserved** (perhaps with greater effort or strategies). Neither occurs only during delirium.
:::
The six domains: **complex attention, executive function, learning and memory, language, perceptual-motor, social cognition**.

## 2.2 The main types [core]
| Type | Key features | Brain changes |
|---|---|---|
| **Alzheimer's disease** (commonest) | Insidious, gradual; **memory for new information first**, then language, visuospatial, executive problems; later behaviour and self-care | Amyloid plaques, tau tangles, loss of cholinergic neurons; hippocampus first. Risk: age, APOE e4, Down syndrome |
| **Vascular** | **Stepwise** decline, focal neurological signs, slowing and executive problems more than memory; vascular risk factors | Strokes, small vessel disease |
| **Lewy body** | **Fluctuating** attention, **recurrent detailed visual hallucinations**, **parkinsonism**, REM sleep behaviour disorder; **severe sensitivity to antipsychotics** | Lewy bodies (alpha-synuclein) |
| **Frontotemporal** | Younger onset (often 45 to 65); **personality and behaviour change** (disinhibition, apathy, loss of empathy, compulsions, sweet cravings, hyperorality) or language problems; memory relatively spared early | Frontal and temporal atrophy |
| Parkinson's disease dementia | Dementia developing a year or more after established Parkinson's | |
| Others | Alcohol (Korsakoff), HIV, head injury, Huntington's (chorea, family history), prion disease (very rapid decline, myoclonus) | |

:::mnemonic Lewy body in three lines
Fluctuating, visual hallucinations, parkinsonism: and never give them haloperidol.
:::

## 2.3 Reversible causes and the work-up [core]
| Reversible cause | Clue | Test |
|---|---|---|
| **Depression** (pseudodementia) | Mood first, poor effort, “I don't know” | History, trial of treatment |
| Hypothyroidism | Slowness, weight gain, cold | TSH |
| **Vitamin B12 deficiency** | Neuropathy, anaemia | B12, blood count |
| Normal pressure hydrocephalus | **Wet, wobbly, wacky**: urinary incontinence, gait problem, confusion | CT or MRI |
| Subdural haematoma | Falls, anticoagulants, fluctuation | CT |
| Neurosyphilis, HIV | Risk history | VDRL, HIV |
| Medicines | Anticholinergics, sedatives | Medicine review |
| Alcohol | History | LFTs, MCV |

- Cognitive screening: MMSE (education-sensitive; Hindi version available), **MoCA**, clock drawing; interpret against education.
- Bloods: count, glucose, kidney, liver, calcium, thyroid, B12, folate; VDRL and HIV by risk; brain imaging (CT or MRI).

## 2.4 Management [core]
### Medicines for Alzheimer's (and Lewy body, Parkinson's dementia)
| Medicine | Use | Side effects |
|---|---|---|
| **Cholinesterase inhibitors**: donepezil, rivastigmine (also patch), galantamine | Mild to moderate | Nausea, diarrhoea, poor appetite, vivid dreams, **slow heart rate** (caution in heart block), urinary frequency |
| **Memantine** (NMDA antagonist) | Moderate to severe | Dizziness, headache, constipation |

They modestly slow symptom progression; they don't stop the disease.

### Behavioural and psychological symptoms (BPSD)
Agitation, aggression, wandering, sleep problems, psychosis, depression, apathy.
- First look for **pain, infection, constipation, delirium, hunger, noise, boredom**.
- Non-drug first: routine, activities, music, reassurance, simplifying tasks, carer training.
- Antipsychotics only for severe, dangerous symptoms, lowest dose, shortest time, review often: they **increase stroke and death** in dementia. Avoid in Lewy body dementia.

### Care and law
- Support carers: education, respite, carer burnout is common. In India most care is given by family, often daughters and daughters-in-law.
- Plan early while capacity remains: finances, property, wishes for care; **advance directive** and nominated representative under the Mental Healthcare Act.
- Safety: driving, cooking, wandering, medicines, abuse of vulnerable elders.

:::recall
1. Define major vs mild neurocognitive disorder. || Decline interfering with independence vs modest decline with independence preserved.
2. Name the six cognitive domains. || Complex attention, executive, learning and memory, language, perceptual-motor, social cognition.
3. Give a defining feature for each of the four main dementias. || Alzheimer's: memory first; vascular: stepwise; Lewy: hallucinations, fluctuation, parkinsonism; frontotemporal: early behaviour change.
4. What is the NPH triad? || Urinary incontinence, gait disturbance, confusion.
5. Name the two drug groups for Alzheimer's and when each is used. || Cholinesterase inhibitors (mild to moderate); memantine (moderate to severe).
6. Why avoid antipsychotics in Lewy body dementia? || Severe sensitivity reactions.
:::

## 2.5 Alzheimer's disease in depth [core]
### Biology
- **Amyloid plaques** (outside neurons, beta-amyloid) and **neurofibrillary tangles** (inside neurons, hyperphosphorylated **tau**), with neuron loss starting in the **entorhinal cortex and hippocampus**, then spreading to temporal and parietal cortex.
- **Cholinergic deficit**: loss of neurons in the **nucleus basalis of Meynert**: the rationale for cholinesterase inhibitors.
- Genetics: **APOE e4** raises risk (one copy about 3 times, two copies much more); **early-onset familial** forms (before 65) from mutations in **APP, presenilin 1, presenilin 2**. **Down syndrome** (extra chromosome 21, which carries APP) brings Alzheimer's changes by the 40s.

### Risk and protection
- Risk: age (the strongest), family history, APOE e4, hypertension, diabetes, smoking, obesity, physical inactivity, **hearing loss**, depression, low education, social isolation, head injury, air pollution, excess alcohol.
- About **40% of dementia risk** is linked to modifiable factors. Treating hearing loss, blood pressure and staying physically, mentally and socially active help.

### The course
| Stage | Typical picture |
|---|---|
| **Mild cognitive impairment** | Memory complaints with test evidence, **independent in daily life**; about 10 to 15% per year progress to dementia |
| Mild dementia | Forgets recent events, repeats questions, misplaces things, trouble with money and complex tasks, word-finding pauses |
| Moderate | Needs help with dressing and bathing, gets lost, wandering, behaviour changes, may not recognise people |
| Severe | Little speech, incontinence, cannot walk, swallowing problems; death often from pneumonia |

- The **4 As**: **amnesia, aphasia, apraxia, agnosia**.
- Average survival after diagnosis is about **8 to 10 years**, varying widely.

:::recall
1. Name the two hallmark pathologies of Alzheimer's disease. || Amyloid plaques and tau neurofibrillary tangles.
2. Which gene variant raises the risk of late-onset Alzheimer's? || APOE e4.
3. Why does Down syndrome increase the risk? || Chromosome 21 carries the APP gene.
4. Define mild cognitive impairment. || Measurable cognitive decline with daily independence preserved.
5. List the 4 As. || Amnesia, aphasia, apraxia, agnosia.
:::

## 2.6 Alcohol, infection and other causes [core]
### Wernicke–Korsakoff syndrome
:::define Wernicke's encephalopathy
An acute, life-threatening brain disorder from **thiamine (vitamin B1) deficiency**, usually in heavy drinkers, but also in severe vomiting (hyperemesis), starvation, bariatric surgery and cancer.
:::
- Classic triad: **confusion, ophthalmoplegia (nystagmus, eye movement palsy), ataxia**. Only about **one in ten** shows all three, so **treat on suspicion**.
- Treatment: **high-dose intravenous thiamine** before glucose, for several days, then oral.
- **Korsakoff syndrome** follows if untreated: severe **anterograde amnesia** and patchy retrograde loss, **confabulation**, with other abilities relatively preserved. Damage in the **mammillary bodies** and medial thalamus.

### Other important causes
| Cause | What to look for |
|---|---|
| **HIV-associated neurocognitive disorder** | Slowed thinking, apathy, motor slowing (subcortical pattern); improves with antiretrovirals |
| **Neurosyphilis** (general paresis) | Personality change, grandiosity, dementia, Argyll Robertson pupils; VDRL and CSF |
| **Huntington's disease** | Autosomal dominant (CAG repeats, chromosome 4); chorea, depression, irritability, subcortical dementia; age 30 to 50 |
| **Creutzfeldt–Jakob disease** | Very rapid decline over months, myoclonus, periodic EEG complexes, MRI changes |
| **Traumatic brain injury** | Memory, attention, executive problems, personality change, irritability, depression |
| **Normal pressure hydrocephalus** | Gait, urinary incontinence, cognitive decline; may improve with shunting |

### Cortical versus subcortical dementia
| | Cortical (Alzheimer's) | Subcortical (vascular small vessel, Parkinson's, Huntington's, HIV) |
|---|---|---|
| Memory | Cannot learn new information; cues do not help | Slow retrieval; **cues help** |
| Language | Aphasia | Normal, slow speech |
| Speed | Normal early | **Slowed thinking (bradyphrenia)** |
| Mood | Less prominent early | Apathy, depression common |
| Movement | Normal early | Abnormal early |

:::recall
1. State the classic triad of Wernicke's encephalopathy. || Confusion, ophthalmoplegia, ataxia.
2. What are the features of Korsakoff syndrome? || Anterograde amnesia, confabulation, other abilities relatively preserved.
3. What is the inheritance and repeat in Huntington's disease? || Autosomal dominant, CAG repeats on chromosome 4.
4. Give two differences between cortical and subcortical dementia. || Cortical: aphasia, cues do not help recall. Subcortical: slow thinking, cues help, early motor signs.
:::

## 2.7 Depression or dementia? [core]
| Feature | Depression with cognitive problems | Dementia |
|---|---|---|
| Onset | Relatively quick, often datable | Insidious |
| Mood | Low mood comes **first** | Mood changes come later, often shallow |
| Complaint | Complains a lot of memory loss | Often **unaware**, family brings them |
| Answers | "**I don't know**" | Near misses, confabulation |
| Effort on tests | Poor | Good effort, poor performance |
| Pattern | Variable, patchy | Consistent decline |
| History | Past depression often | Usually none |
| After treatment | Improves | Does not improve |

:::note They often go together
Depression can be an **early sign** of dementia, and late-life depression with cognitive problems raises the later risk of dementia. Treat the depression, then **re-test cognition** after recovery.
:::

:::recall
1. Give four features that suggest depression rather than dementia. || Quick onset, mood first, complains of memory loss, "I don't know" answers, improves with treatment.
2. Why re-test cognition after treating depression? || Depression may be an early sign of dementia.
:::

# Part III · Exam zone

## 3.1 Long answer and short notes [core]
:::example Q. Define delirium. Discuss its causes, clinical features and management. (10 marks)
1. Definition and criteria; subtypes.
2. Epidemiology and who is at risk.
3. Causes: PINCH ME plus organ failures, withdrawal, medicines.
4. Clinical features: attention, consciousness, fluctuation, disorientation, perceptual disturbance, sleep–wake reversal.
5. Assessment: CAM or 4AT, attention tests, investigations.
6. Delirium vs dementia table.
7. Management: treat causes, non-drug care, cautious medicines, benzodiazepines only for withdrawal.
8. Prognosis: mortality, prolonged stay, cognitive decline.
:::

:::word Short note: Lewy body dementia
A neurocognitive disorder with Lewy bodies (alpha-synuclein) in the cortex and brainstem. Core features: fluctuating cognition with marked variation in attention and alertness, recurrent well-formed visual hallucinations, REM sleep behaviour disorder, and parkinsonism. Severe sensitivity to antipsychotics can cause rigidity, confusion and death, so they are avoided; cholinesterase inhibitors (especially rivastigmine) help cognition and hallucinations. Distinguished from Parkinson's disease dementia by dementia starting before or within a year of the parkinsonism.
:::

## 3.2 Viva rapid-fire [core]
:::viva
Core of delirium? :: Acute, fluctuating disturbance of attention and awareness.
Commonest delirium subtype? :: Hypoactive.
CAM features? :: Acute onset and fluctuation, inattention, plus disorganised thinking or altered consciousness.
Drug for distressing delirium? :: Low-dose haloperidol briefly (not in Lewy body or Parkinson's).
When are benzodiazepines used in delirium? :: Alcohol or benzodiazepine withdrawal only.
Commonest dementia? :: Alzheimer's disease.
First symptom in Alzheimer's? :: Memory for new information.
Stepwise decline suggests? :: Vascular dementia.
Dementia with early disinhibition and personality change? :: Frontotemporal dementia.
Three core features of Lewy body dementia? :: Fluctuation, visual hallucinations, parkinsonism.
NPH triad? :: Wet, wobbly, wacky: incontinence, gait, confusion.
Reversible causes of dementia (four)? :: Depression, hypothyroidism, B12 deficiency, NPH, subdural, syphilis.
Mechanism of donepezil? :: Cholinesterase inhibitor.
Mechanism of memantine? :: NMDA receptor antagonist.
Cardiac caution with cholinesterase inhibitors? :: Slow heart rate.
Antipsychotic risk in dementia? :: Stroke and death.
When does delirium tremens usually start? :: About 48 to 72 hours after the last drink.
Hallucinations with a clear sensorium after stopping alcohol? :: Alcoholic hallucinosis.
Give thiamine before or after glucose? :: Before.
Two hallmark pathologies of Alzheimer's? :: Amyloid plaques and tau tangles.
Gene variant raising late-onset Alzheimer's risk? :: APOE e4.
Where are the cholinergic neurons lost in Alzheimer's? :: Nucleus basalis of Meynert.
Wernicke's triad? :: Confusion, ophthalmoplegia, ataxia.
Korsakoff lesion site? :: Mammillary bodies and medial thalamus.
Huntington's inheritance? :: Autosomal dominant, CAG repeat, chromosome 4.
Dementia where cues help recall? :: Subcortical.
4 As of Alzheimer's? :: Amnesia, aphasia, apraxia, agnosia.
:::

## 3.3 Module test [core]
:::mcq
Q: An 80-year-old is quiet and drowsy two days after hip surgery, can't say the months backwards, and her alertness varies. Most likely:
- Depression
- *Hypoactive delirium
- Alzheimer's disease
- Normal ageing
> Acute, fluctuating inattention.

Q: The first step in managing delirium is:
- Start haloperidol
- *Find and treat the underlying causes
- Physical restraint
- Start donepezil
> Medicines are not the main treatment.

Q: Which drug is most likely to worsen delirium?
- Paracetamol
- *An anticholinergic such as amitriptyline
- Thiamine
- Saline
> Anticholinergics are a classic cause.

Q: Fluctuating cognition, vivid visual hallucinations and parkinsonism suggest:
- Alzheimer's disease
- Vascular dementia
- *Lewy body dementia
- Frontotemporal dementia
> And avoid antipsychotics.

Q: A 55-year-old becomes disinhibited, eats sweets compulsively and loses empathy, with memory intact. Most likely:
- Alzheimer's disease
- *Frontotemporal dementia
- Depression
- Delirium
> Early behavioural change, younger onset.

Q: Urinary incontinence, gait problems and confusion suggest:
- Alzheimer's disease
- *Normal pressure hydrocephalus
- Parkinson's disease
- Huntington's disease
> Wet, wobbly, wacky; potentially treatable.

Q: Memantine works as:
- A cholinesterase inhibitor
- *An NMDA receptor antagonist
- A dopamine agonist
- A serotonin reuptake inhibitor
> Used in moderate to severe Alzheimer's.

Q: A man with dementia suddenly becomes much more confused over two days. First consider:
- Disease progression
- *Superimposed delirium
- Depression
- Malingering
> Sudden change means delirium until proven otherwise.

Q: Which test is essential in the work-up of cognitive decline?
- Serum amylase
- *Vitamin B12 and thyroid function
- Urine pregnancy test
- Prolactin
> Reversible causes.

Q: Which side effect of donepezil needs caution in heart block?
- Fast heart rate
- *Slow heart rate
- High blood pressure
- QT shortening
> Cholinergic slowing of the heart.

Q: Three days after admission, a heavy drinker becomes confused, tremulous, febrile and sees insects on the wall. The diagnosis is:
- Alcoholic hallucinosis
- *Delirium tremens
- Wernicke's encephalopathy
- Korsakoff syndrome
> Confusion with autonomic instability at 48 to 72 hours.

Q: An older woman complains loudly of poor memory, answers "I don't know" and became low after her husband died 2 months ago. Most likely:
- Alzheimer's disease
- *Depression with cognitive impairment
- Lewy body dementia
- Delirium
> Mood first, complaint and poor effort.

Q: Which is NOT a feature of Korsakoff syndrome?
- Confabulation
- Anterograde amnesia
- *Severe loss of general intelligence
- Mammillary body damage
> Other abilities are relatively preserved.

Q: The strongest risk factor for Alzheimer's disease is:
- APOE e4
- Hypertension
- *Age
- Low education
> APOE e4 is the main genetic risk factor.

Q: A man with dementia shows slowed thinking, apathy and good recall with cues. The pattern is:
- *Subcortical
- Cortical
- Frontotemporal language variant
- Normal ageing
> Typical of small vessel, Parkinson's, Huntington's or HIV-related dementia.
:::
`;
