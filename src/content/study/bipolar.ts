import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "bipolar",
  num: 6,
  title: "Bipolar and related disorders",
  emoji: "🎢",
  tagline: "Mania, hypomania, the depressions that come with them, and how to keep people well",
  when: "Weeks 5 to 6",
  outcomes: [
    "State the criteria for a manic and a hypomanic episode, and tell them apart",
    "Distinguish bipolar I, bipolar II and cyclothymic disorder",
    "Recognise mixed features and rapid cycling",
    "Plan treatment for acute mania, bipolar depression and maintenance",
    "Explain why antidepressants alone are risky in bipolar disorder",
  ],
  writeTask:
    "On paper, from memory: the 7 manic symptoms (DIGFAST), the duration rules for mania and hypomania, the definitions of bipolar I, II and cyclothymia, and a three-part treatment plan (acute mania, bipolar depression, maintenance) including lithium monitoring. Then check and correct in red.",
  activities: [
    act.lesson("mood-2", "Quiz: mania and bipolar", "Episode rules and specifiers."),
    act.scenarios("bipolar", "Patient case: the ₹2 lakh week", "A manic patient who feels better than ever."),
    act.lesson("ms-1", "Quiz: lithium", "Levels, toxicity and monitoring."),
    act.coach("pharmacology", "Coach: medicines", "Mood stabilisers and antipsychotics you confuse."),
  ],
  noteId: "bipolar",
};

export const text = String.raw`
# Part I · The episodes

## 1.1 Mania [core]
:::define Manic episode
A distinct period of **abnormally and persistently elevated, expansive or irritable mood** and **abnormally and persistently increased activity or energy**, lasting **at least 1 week** and present most of the day, nearly every day, **or any duration if hospitalisation is needed**.
:::

During this period, **at least 3** of the following (**4** if the mood is only irritable), representing a noticeable change:

| # | Symptom | What it looks like |
|---|---|---|
| 1 | Inflated self-esteem or grandiosity | “I'll be the next prime minister.” Grandiose delusions in severe mania |
| 2 | Decreased need for sleep | Feels rested after 3 hours; doesn't feel tired (unlike insomnia, where the person wants to sleep) |
| 3 | More talkative than usual, or pressure to keep talking | Hard to interrupt |
| 4 | Flight of ideas or racing thoughts | Jumps topic to topic by sound or chance links |
| 5 | Distractibility | Attention pulled by trivial things in the room |
| 6 | Increased goal-directed activity or psychomotor agitation | Many projects, cleaning at 3 a.m., socialising, sexual activity |
| 7 | Excessive involvement in risky activities | Spending sprees, foolish investments, sexual indiscretion, reckless driving |

- **C**: severe enough to cause marked impairment, or to need hospitalisation, or there are psychotic features.
- **D**: not due to a substance or medical condition. A full manic episode that emerges during antidepressant treatment and **persists beyond** the drug's effect counts as mania.

:::mnemonic DIGFAST
**D**istractibility · **I**nsomnia (decreased need for sleep) · **G**randiosity · **F**light of ideas · **A**ctivity increased · **S**peech pressured · **T**houghtlessness (risky behaviour).
:::

### Stages of mania [extra]
| Stage | Picture |
|---|---|
| I | Euphoria, expansiveness, increased activity, grandiosity, but organised |
| II | More intense, irritability, hostility, accelerated speech, flight of ideas, preoccupations becoming delusional |
| III | Desperate, panic-stricken, bizarre behaviour, incoherence, delusions, disorientation (“delirious mania”) |

:::sounds How mania sounds
- “Doctor, I haven't felt this good in years! Main bahut bada business shuru karne wala hoon.”
- “Neend ki zaroorat hi nahi, teen ghante kaafi hain.” (I don't need sleep; three hours is enough.)
- Family: “Usne ek hafte mein do lakh kharch kar diye, sabko gifts de raha hai.” (He spent two lakh in a week giving everyone gifts.)
- Irritable mania: “Aap log meri baat samajhte hi nahi!” (You people don't understand me!) when contradicted.
:::

:::recall
1. State the A criterion for a manic episode. || Elevated, expansive or irritable mood plus increased activity or energy, at least 1 week (any duration if hospitalised).
2. How many B symptoms are needed, and when do you need one more? || Three; four if the mood is only irritable.
3. Expand DIGFAST. || Distractibility, insomnia (less need for sleep), grandiosity, flight of ideas, activity, speech pressure, thoughtlessness.
4. How does decreased need for sleep differ from insomnia? || The person doesn't feel tired and doesn't want more sleep.
:::

## 1.2 Hypomania and mixed features [core]
:::define Hypomanic episode
The same mood and energy change and the same B symptoms, lasting **at least 4 consecutive days**, an unequivocal change that **others can observe**, but **not** severe enough to cause marked impairment or need hospitalisation, and **no psychotic features**.
:::

| Feature | Mania | Hypomania |
|---|---|---|
| Duration | At least 1 week (any if admitted) | At least 4 days |
| Impairment | Marked, or needs admission | Not marked; may even seem productive |
| Psychosis | May be present | Never (psychosis makes it mania) |
| Diagnosis it gives | Bipolar I | Bipolar II (with a depressive episode) |

:::trap Psychosis upgrades hypomania to mania
If psychotic features are present, it is mania, whatever the duration or impairment. And if the patient needed admission, it is mania even if it lasted less than a week.
:::

### Mixed features
- A manic or hypomanic episode **with mixed features** has at least 3 depressive symptoms during most days of the episode.
- A depressive episode with mixed features has at least 3 manic or hypomanic symptoms.
- Mixed states carry **high suicide risk** (despair plus energy and impulsivity) and respond less well to antidepressants.

### Rapid cycling
- **At least 4 mood episodes in 12 months** (mania, hypomania or depression), each meeting criteria and separated by remission or a switch.
- More common in women, bipolar II, hypothyroidism and antidepressant use. Check thyroid function; avoid antidepressants.

:::recall
1. Give the duration and impairment rules for hypomania. || At least 4 days; observable change; not marked impairment, no admission, no psychosis.
2. What happens to the diagnosis if a hypomanic patient becomes psychotic? || It becomes mania.
3. Define rapid cycling and name two associations. || 4 or more episodes in 12 months; women, bipolar II, hypothyroidism, antidepressants.
4. Why are mixed states dangerous? || High suicide risk: despair with energy and impulsivity.
:::

# Part II · The disorders

## 2.1 Bipolar I, bipolar II and cyclothymia [core]
| Disorder | Requires | Never |
|---|---|---|
| Bipolar I | At least **one manic episode** (depression is common but not required) | |
| Bipolar II | At least **one hypomanic** episode **and** at least **one major depressive** episode | A manic episode |
| Cyclothymic disorder | **At least 2 years** (1 year in children) of many periods of hypomanic symptoms and depressive symptoms that don't meet full episode criteria; symptoms at least half the time; never symptom-free for more than 2 months | Full criteria for mania, hypomania or major depression |

:::trap Bipolar II is not “milder bipolar”
Bipolar II has less severe highs, but the depressions are often long and frequent, and suicide risk is high. Many people with bipolar II are first treated for “recurrent depression” for years.
:::

### Other bipolar diagnoses
- **Substance or medication-induced** bipolar disorder: steroids, stimulants, levodopa, antidepressant-induced switches that don't persist beyond the drug.
- **Due to another medical condition**: hyperthyroidism, Cushing's, multiple sclerosis, frontal or right-hemisphere lesions, HIV, neurosyphilis. Think of these especially in **first-onset mania after 50**.

### Specifiers
Anxious distress; mixed features; rapid cycling; melancholic or atypical features (for depressive episodes); mood-congruent or incongruent psychotic features; catatonia; peripartum onset; seasonal pattern.

:::recall
1. What is the minimum needed for bipolar I? || One manic episode.
2. What two episodes define bipolar II? || At least one hypomanic and one major depressive episode, never mania.
3. State the cyclothymia rules. || 2 years (1 in youth) of sub-threshold highs and lows, symptomatic half the time, never symptom-free over 2 months, never full episodes.
4. In whom must you hunt hard for a medical cause of mania? || First-onset mania in later life (after about 50).
:::

## 2.2 Why it happens [core]
### Genetics: the strongest of the common psychiatric disorders
- Heritability is high (roughly 60 to 85% in twin studies).
- First-degree relatives have a much higher risk of bipolar disorder and also of depression.
- Many genes of small effect overlap with schizophrenia and depression.

### Biology
- Dysregulated monoamines: increased dopamine activity linked to mania (dopamine-raising drugs can trigger it; dopamine-blocking antipsychotics treat it).
- Disrupted **circadian rhythms**: sleep loss can trigger mania; regular sleep protects.
- Intracellular signalling: lithium and valproate act on second-messenger pathways and promote neuroprotection.
- Kindling hypothesis: early episodes often follow stressors; later episodes can occur on their own.

### Triggers
- Sleep deprivation (night shifts, travel, exams, newborn baby).
- Stressful life events, both negative and positive.
- Stopping medication, especially lithium abruptly (rebound mania).
- Antidepressants, steroids, stimulants, cannabis.
- Childbirth (high risk of postpartum episodes, including postpartum psychosis).

:::recall
1. Which common mood disorder is most heritable? || Bipolar disorder.
2. Name five triggers of a manic episode. || Sleep loss, stress, stopping lithium, antidepressants, steroids, stimulants, childbirth.
3. What is the kindling hypothesis? || Early episodes are triggered by stress; later ones arise spontaneously.
:::

## 2.3 Recognising bipolar disorder [core]
### Who to suspect
- Depression starting in the **teens or early 20s**.
- Many episodes, abrupt onset and offset.
- Atypical features, psychotic depression, **postpartum** depression or psychosis.
- Family history of bipolar disorder.
- Antidepressant-induced high, agitation or “switch”.
- Poor response to several antidepressants.

### Differential diagnosis of mania
| Condition | Distinguishing points |
|---|---|
| Substance intoxication (stimulants, cannabis) | Timing with use, urine drug screen, settles as the drug clears |
| Medicines (steroids, levodopa, antidepressants) | Timing with the medicine |
| Hyperthyroidism | Weight loss, tremor, heat intolerance; thyroid tests |
| Schizophrenia or schizoaffective disorder | Psychosis persists without mood episodes |
| ADHD | Lifelong, not episodic; no decreased need for sleep |
| Borderline personality disorder | Mood shifts last hours and react to interpersonal events; chronic emptiness |
| Delirium or brain lesion | Fluctuating consciousness, neurological signs, late onset |

:::word MSE in mania (key lines)
Elated and labile affect, irritable when contradicted; pressure of speech with flight of ideas and clang associations; grandiose delusion (“I have a message from God”); distractible; insight grade 1 (“nothing is wrong with me”); personal and social judgement impaired (spent ₹2 lakh this week).
:::

:::recall
1. List five features that should make you suspect bipolarity in a depressed patient. || Early onset, many abrupt episodes, atypical or psychotic features, postpartum onset, family history, antidepressant switch.
2. How do you tell borderline mood instability from bipolar disorder? || Borderline shifts last hours and react to relationships; bipolar episodes last days to weeks with sleep and energy change.
3. How do you tell ADHD from mania? || ADHD is lifelong, not episodic, without decreased need for sleep.
:::

# Part III · Treatment

## 3.1 Acute mania [core]
1. **Safety first**: assess risk to self, others, finances and reputation; consider admission (often needed).
2. **Stop antidepressants** and stimulants.
3. **Start an antimanic agent**:
   - An **atypical antipsychotic** (olanzapine, risperidone, quetiapine, aripiprazole) or haloperidol, for fast control, especially with psychosis or agitation.
   - **Lithium** (classic mania, long-term plan) or **valproate** (mixed states, rapid cycling; avoid in women who could become pregnant).
   - Severe mania: antipsychotic **plus** lithium or valproate.
4. **Short-term benzodiazepine** (lorazepam) for agitation and sleep.
5. **ECT** for severe, treatment-resistant mania, or mania in pregnancy.
6. Reduce stimulation; restore sleep; involve family.

:::note Timing
An untreated manic episode lasts about **3 months**, so don't stop treatment early when the patient seems calmer.
:::

## 3.2 Bipolar depression [core]
:::trap Antidepressants alone are risky
An antidepressant **without** a mood stabiliser can trigger mania, mixed states or rapid cycling, and often works less well in bipolar depression. Avoid antidepressant monotherapy in bipolar I. If used, combine with a mood stabiliser and stop once the depression resolves.
:::
Evidence-based options:
- **Quetiapine**, **lurasidone**, olanzapine with fluoxetine.
- **Lamotrigine**: better for preventing depressive episodes than treating acute depression (slow titration because of rash risk).
- **Lithium**: modest acute benefit; strongly anti-suicidal.
- ECT for severe or psychotic bipolar depression.

## 3.3 Maintenance: keeping people well [core]
After a manic episode, most patients have further episodes (about 90% after a single manic episode). Long-term treatment is the rule.

| Option | Notes |
|---|---|
| **Lithium** | The gold standard. Prevents mania and depression and **reduces suicide**. Narrow therapeutic range |
| Valproate | Good for mania prevention; **avoid in women of childbearing potential** (birth defects) |
| Lamotrigine | Mainly prevents depression |
| Quetiapine, aripiprazole, olanzapine | Useful especially if they controlled the acute episode; watch metabolic effects |

### Lithium in practice
- Blood level taken **12 hours after the last dose**, about **5 days** after starting or changing the dose.
- Usual target for maintenance about **0.6 to 1.0 mmol/L**; acute mania often needs higher (about 1.0 to 1.5) with close monitoring.
- Before starting: kidney function, thyroid function, calcium, ECG if heart disease, pregnancy test, weight.
- Monitor: levels every 3 months at first, then every 3 to 6 months; kidney and thyroid every 6 months.
- Common side effects: thirst and passing a lot of urine, fine tremor, weight gain, hypothyroidism, acne, worsening psoriasis.
- **Toxicity** (often above 1.5): coarse tremor, vomiting, diarrhoea, unsteadiness, slurred speech, confusion, fits. An emergency.
- **Raises levels**: dehydration, fever, NSAIDs (ibuprofen), ACE inhibitors, thiazide diuretics, low-salt diets.
- Stop gradually: **abrupt stopping can cause rebound mania**.

:::safety Teach every patient on lithium
Drink enough fluids, especially in summer and with fever or diarrhoea; avoid over-the-counter painkillers like ibuprofen; know the signs of toxicity and come in at once if they appear.
:::

### Psychological and social care
- **Psychoeducation**: knowing early warning signs (less sleep, more talk, more spending) is one of the most effective relapse-prevention tools.
- Mood charting and a **relapse signature** with an action plan agreed with family.
- **Regular sleep and routine** (interpersonal and social rhythm therapy).
- Family-focused therapy; CBT for depression; reduce alcohol and cannabis.
- Pregnancy planning: many mood stabilisers carry risks; plan with a specialist.

:::recall
1. Outline the treatment of acute mania in five steps. || Safety, stop antidepressants, antimanic agent (antipsychotic, lithium or valproate), short-term benzodiazepine, ECT if severe.
2. Why avoid antidepressant monotherapy in bipolar I? || It can trigger mania, mixed states or rapid cycling, and works less well.
3. Name three evidence-based treatments for bipolar depression. || Quetiapine, lurasidone, lamotrigine (for prevention), lithium.
4. Which maintenance treatment reduces suicide? || Lithium.
5. Give five things that raise lithium levels. || Dehydration, fever, NSAIDs, ACE inhibitors, thiazides, low salt.
6. List five signs of lithium toxicity. || Coarse tremor, vomiting, diarrhoea, ataxia, slurred speech, confusion, fits.
:::

## 3.4 Course and prognosis [core]
- Onset usually in the late teens to 20s; equal in men and women for bipolar I.
- Recurrent: about 90% of people with one manic episode have more.
- Untreated mania lasts about 3 months; depressions last longer and dominate the illness over time.
- Many have residual symptoms and problems at work and in relationships between episodes.
- Suicide risk is many times higher than in the general population.

| Better outcome | Worse outcome |
|---|---|
| Good adherence and insight | Poor adherence, stopping lithium suddenly |
| Short episodes, late onset | Rapid cycling, mixed states |
| Few psychotic features | Substance use, especially alcohol and cannabis |
| Good support | Psychotic features, comorbid anxiety, poor work history |

:::recall
1. What proportion of people with one manic episode have more? || About 90%.
2. Name four poor prognostic factors. || Poor adherence, rapid cycling, mixed states, substance use, psychotic features.
:::

# Part IV · Exam zone

## 4.1 Long answer and short notes [core]
:::example Q. Describe the clinical features and management of a manic episode. (15 marks)
1. Definition and criteria (A, B with DIGFAST, C, D).
2. Clinical features under MSE headings: appearance, behaviour, speech, mood and affect, thought, perception, cognition, insight, judgement.
3. Stages of mania.
4. Mania versus hypomania table; bipolar I vs II vs cyclothymia.
5. Aetiology: genetics, circadian rhythm, triggers.
6. Differential diagnosis with distinguishing points.
7. Investigations: thyroid, drug screen, kidney function and calcium before lithium, ECG, imaging in late onset.
8. Management: acute (safety, stop antidepressants, antipsychotic, lithium or valproate, benzodiazepine, ECT); maintenance (lithium and monitoring); psychoeducation, sleep, family.
9. Course, prognosis, suicide risk.
:::

:::word Short note: hypomania
A distinct period of at least four consecutive days of abnormally elevated, expansive or irritable mood with increased energy and at least three manic symptoms (four if only irritable), an observable change that is not severe enough to cause marked impairment or hospitalisation and has no psychotic features. With at least one major depressive episode and no mania, it defines bipolar II. It may be experienced as productivity and go unreported, so ask families directly.
:::

:::word Short note: lithium monitoring
Baseline kidney function, thyroid function, calcium, weight, ECG where indicated and pregnancy test. Levels 12 hours after the last dose, five days after each change; maintenance usually 0.6 to 1.0 mmol/L, higher in acute mania. Levels every three months initially, then every three to six months; kidney and thyroid every six months. Toxicity causes coarse tremor, vomiting, diarrhoea, ataxia and confusion; levels rise with dehydration, NSAIDs, ACE inhibitors and thiazides.
:::

## 4.2 Viva rapid-fire [core]
:::viva
Minimum duration of a manic episode? :: One week, or any duration if hospitalised.
Minimum duration of hypomania? :: Four consecutive days.
How many manic symptoms are needed? :: Three, or four if the mood is only irritable.
Expand DIGFAST. :: Distractibility, insomnia (less need for sleep), grandiosity, flight of ideas, activity, speech pressure, thoughtlessness.
What turns hypomania into mania? :: Marked impairment, hospitalisation or psychotic features.
Define bipolar II. :: At least one hypomanic and one major depressive episode, never mania.
Define cyclothymia. :: Two years of sub-threshold highs and lows, never full episodes.
Define rapid cycling. :: Four or more episodes in 12 months.
Why are mixed states dangerous? :: High suicide risk.
How long does untreated mania last? :: About three months.
First step in managing mania on an antidepressant? :: Stop the antidepressant.
Gold standard maintenance treatment? :: Lithium.
Which mood stabiliser to avoid in women who may become pregnant? :: Valproate.
Which drug mainly prevents bipolar depression? :: Lamotrigine.
Lithium maintenance level? :: About 0.6 to 1.0 mmol/L, 12 hours after the last dose.
Three drugs that raise lithium levels? :: NSAIDs, ACE inhibitors, thiazides.
Sign that separates lithium toxicity from side effect tremor? :: Coarse tremor with vomiting, diarrhoea, ataxia or confusion.
What happens if lithium is stopped abruptly? :: Rebound mania.
Which mood disorder is most heritable? :: Bipolar disorder.
First-onset mania at 60: what must you exclude? :: A medical or neurological cause.
:::

## 4.3 Module test [core]
:::mcq
Q: A man has had elevated mood, little need for sleep, pressured speech and reckless spending for 5 days, and was admitted because of aggression. The episode is:
- Hypomanic, because it lasted less than a week
- *Manic, because hospitalisation was needed
- Cyclothymic
- Mixed
> Any duration counts if hospitalisation is required.

Q: A woman reports two depressive episodes and a 5-day period of high energy and productivity noticed by colleagues, without impairment. Diagnosis:
- Bipolar I
- *Bipolar II
- Cyclothymic disorder
- Major depressive disorder, recurrent
> Hypomania plus major depression, never mania.

Q: If a patient's mood is only irritable, how many additional manic symptoms are required?
- Two
- Three
- *Four
- Five
> Four instead of three.

Q: Which feature makes an episode mania rather than hypomania regardless of duration?
- Decreased need for sleep
- Overspending
- *Psychotic features
- Flight of ideas
> Psychosis always means mania.

Q: Four or more mood episodes in a year is called:
- Cyclothymia
- Mixed features
- *Rapid cycling
- Ultradian cycling
> Associated with hypothyroidism, women, bipolar II and antidepressants.

Q: The first step for a patient who becomes manic on sertraline is:
- Increase the sertraline
- Add a second antidepressant
- *Stop the sertraline and start an antimanic agent
- Wait and watch for two weeks
> Remove the trigger and treat the mania.

Q: Which maintenance treatment has the best evidence for reducing suicide in bipolar disorder?
- Valproate
- Lamotrigine
- *Lithium
- Clonazepam
> Lithium's anti-suicidal effect is well established.

Q: A woman of 24 with bipolar I is planning a family. Which mood stabiliser should usually be avoided?
- Lithium
- *Valproate
- Quetiapine
- Lamotrigine
> High risk of birth defects and developmental problems.

Q: A patient on lithium develops diarrhoea, vomiting, coarse tremor and unsteadiness after starting ibuprofen. Most likely:
- Lithium-induced hypothyroidism
- *Lithium toxicity
- Neuroleptic malignant syndrome
- Serotonin syndrome
> NSAIDs raise lithium levels.

Q: Lithium levels should be measured:
- *12 hours after the last dose
- 1 hour after the dose
- Only once a year
- Just before the morning dose on day one
> About 5 days after starting or changing the dose.

Q: Which drug is used mainly to prevent depressive relapses in bipolar disorder?
- Haloperidol
- *Lamotrigine
- Lorazepam
- Fluoxetine alone
> Lamotrigine prevents depression more than mania.

Q: Mood swings lasting hours, triggered by arguments, with chronic emptiness and fear of abandonment suggest:
- Bipolar I disorder
- Rapid cycling
- *Borderline personality disorder
- Cyclothymia
> Short, reactive shifts point to personality rather than episodes.

Q: A 62-year-old with no psychiatric history develops mania. What is most important?
- Start lithium at once
- *Look for a medical or neurological cause
- Diagnose bipolar I and discharge
- Prescribe an antidepressant
> Late-onset mania needs a medical work-up.

Q: Which is a recognised trigger of mania?
- Increased sleep
- *Sleep deprivation
- Lithium adherence
- Regular routine
> Sleep loss is a classic trigger.
:::
`;
