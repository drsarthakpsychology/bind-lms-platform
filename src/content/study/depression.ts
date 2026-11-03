import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "depression",
  num: 5,
  title: "Depressive disorders",
  emoji: "🌧️",
  tagline: "Every depressive diagnosis: what it is, why it happens, how to recognise and treat it",
  when: "Weeks 5 to 6",
  outcomes: [
    "State the criteria for major depressive disorder and every other depressive diagnosis",
    "Tell melancholic from atypical features, and grief from depression",
    "Explain depression through biology, psychology and social factors",
    "Recognise how depression presents in Indian clinics, in children and in older adults",
    "Plan stepped treatment, from psychoeducation to ECT, and know how long to continue",
  ],
  writeTask:
    "On paper, from memory: the 9 symptoms of a major depressive episode (SIG E CAPS plus mood), the duration and number rules, the melancholic and atypical specifiers, the criteria for persistent depressive disorder, and a stepped treatment plan with durations. Then check and correct in red.",
  activities: [
    act.lesson("mood-1", "Quiz: depression", "Criteria, specifiers and red flags."),
    act.scenarios("depression", "Patient case: “Mann nahi lagta”", "A tricky first meeting where the wrong kind word does harm."),
    act.coach("disorders", "Coach: disorders", "Chai repeats the diagnoses you confuse."),
    act.lesson("ad-1", "Quiz: antidepressant classes and timing", "Links this module to the medicines module."),
  ],
  noteId: "depression",
};

export const text = String.raw`
# Part I · What depression is

## 1.1 The depressive disorders at a glance [core]
Depression is not sadness. Sadness is a normal response to loss; depression is a **persistent change in mood, thinking and body functions that impairs life**. The depressive disorders all share sad, empty or irritable mood with bodily and cognitive changes. They differ in **duration, timing and cause**.

| Disorder | The core idea | Key rule |
|---|---|---|
| Major depressive disorder (MDD) | One or more major depressive episodes, and never a manic or hypomanic episode | At least 5 of 9 symptoms, most of the day, nearly every day, for at least 2 weeks |
| Persistent depressive disorder (dysthymia) | Chronic, lower-grade depression | Depressed mood most days for at least 2 years (1 year in children and adolescents) |
| Premenstrual dysphoric disorder | Severe mood symptoms tied to the menstrual cycle | At least 5 symptoms in the final week before menses, improving within days of onset |
| Disruptive mood dysregulation disorder | Children with severe, frequent temper outbursts and constant irritability | Outbursts at least 3 times a week, for at least 12 months; onset before 10; diagnosed between 6 and 18 |
| Substance or medication-induced depressive disorder | Depression caused by a substance or medicine | Develops during or soon after intoxication, withdrawal or exposure |
| Depressive disorder due to another medical condition | Depression as a direct effect of physical illness | Evidence that the medical condition causes it (for example hypothyroidism, stroke) |

:::trap The bipolar question
A single past manic or hypomanic episode changes the diagnosis to a bipolar disorder. **Always ask about past highs before diagnosing depression**: it changes the treatment (antidepressants alone can trigger mania).
:::

### How common is it?
- Depression is one of the commonest mental disorders worldwide and a leading cause of disability.
- About twice as common in women as in men, from adolescence onwards.
- In India, the National Mental Health Survey found depression among the commonest disorders, with most people never receiving treatment (the “treatment gap”).
- The first episode occurs before age 40 in about half of patients; it can begin at any age.

:::recall
1. What do all depressive disorders share? || Sad, empty or irritable mood with bodily and cognitive changes that impair functioning.
2. What single history finding changes depression to bipolar disorder? || Any past manic or hypomanic episode.
3. Give the duration rule for MDD and for persistent depressive disorder. || At least 2 weeks; at least 2 years (1 year in youth).
:::

:::mcq
Q: A woman has had low mood most days for 3 years, with poor sleep and low self-esteem, but never a full depressive episode. Most likely:
- Major depressive disorder, single episode
- *Persistent depressive disorder (dysthymia)
- Adjustment disorder
- Cyclothymia
> Two years or more of low mood more days than not, below the threshold of a major episode for much of it.
:::

## 1.2 Major depressive disorder: the criteria [core]
:::define Major depressive episode (criterion A)
**Five or more** of the following during the **same 2-week period**, representing a change from previous functioning; **at least one** is (1) depressed mood or (2) loss of interest or pleasure.
:::

| # | Symptom | What it looks like |
|---|---|---|
| 1 | Depressed mood most of the day, nearly every day | Sad, empty, hopeless; tearful. In children and adolescents can be **irritable** mood |
| 2 | Markedly diminished interest or pleasure (anhedonia) | “Mann nahi lagta”; stops hobbies, family time, prayer |
| 3 | Significant weight loss or gain, or appetite change | A change of more than 5% of body weight in a month |
| 4 | Insomnia or hypersomnia nearly every day | Classically early morning waking |
| 5 | Psychomotor agitation or retardation | Observable by others, not just felt |
| 6 | Fatigue or loss of energy | “Kamzori”, “no strength” |
| 7 | Worthlessness or excessive or inappropriate guilt | May reach delusional guilt |
| 8 | Diminished ability to think or concentrate, or indecisiveness | Students: marks fall, can't read |
| 9 | Recurrent thoughts of death, suicidal ideation, plan or attempt | Not just fear of dying |

The rest of the criteria:
- **B**: clinically significant distress or impairment.
- **C**: not due to a substance or another medical condition.
- **D**: not better explained by a psychotic disorder (schizoaffective, schizophrenia and others).
- **E**: there has **never** been a manic or hypomanic episode.

:::mnemonic SIG E CAPS, plus mood
Depressed mood, then **S**leep, **I**nterest, **G**uilt, **E**nergy, **C**oncentration, **A**ppetite, **P**sychomotor, **S**uicide. Nine in all. Five needed. Mood or interest must be one of them.
:::

### Severity, course and specifiers
- **Severity**: mild, moderate, severe (by number of symptoms, intensity and impairment).
- **Course**: single episode or recurrent (episodes separated by at least 2 months without meeting criteria).
- **Remission**: partial or full.

| Specifier | What it means |
|---|---|
| With anxious distress | Keyed up, restless, worry, fear something awful will happen. Raises suicide risk and predicts slower response |
| With mixed features | At least 3 manic or hypomanic symptoms during the depressive episode. A warning sign of bipolarity |
| With melancholic features | See 1.3 |
| With atypical features | See 1.3 |
| With psychotic features | Delusions or hallucinations; mood-congruent (guilt, nihilism, poverty, deserved punishment) or mood-incongruent |
| With catatonia | Catatonic signs during the episode |
| With peripartum onset | Onset during pregnancy or within 4 weeks after delivery |
| With seasonal pattern | Regular onset and remission at particular times of year |

:::trap Grief is not automatically depression
Bereavement can cause sadness, poor sleep and poor appetite. In grief, the pain comes in **waves** linked to reminders of the person, humour and self-esteem are preserved, and guilt is about the deceased (“I should have visited more”). In depression the low mood is **pervasive**, self-esteem collapses (“I am worthless”), and there is anhedonia across life. A full major depressive episode can occur during grief and should not be dismissed. Intense grief still disabling a year later may be **prolonged grief disorder**.
:::

:::recall
1. State criterion A for a major depressive episode exactly. || Five or more of nine symptoms in the same 2 weeks, a change from before, at least one being depressed mood or loss of interest.
2. What does criterion E exclude? || Any past manic or hypomanic episode.
3. In children, what can replace depressed mood? || Irritable mood.
4. Name six specifiers of a depressive episode. || Anxious distress, mixed features, melancholic, atypical, psychotic, catatonia (also peripartum, seasonal).
5. Give three differences between grief and depression. || Waves vs pervasive; self-esteem preserved vs lost; guilt about the deceased vs worthlessness.
:::

:::mcq
Q: A man has had low mood, poor sleep, guilt and tiredness for 10 days after losing his job. Concentration is poor. Does he meet criteria for a major depressive episode?
- Yes, he has five symptoms
- *Not yet: the episode must last at least 2 weeks
- Yes, any stressor counts
- No, because there is a trigger
> Duration of at least 2 weeks is required; a trigger does not rule out depression.

Q: A woman reports low mood, no pleasure in anything, early waking, weight loss and fatigue for 3 weeks, and feels worthless. Which additional symptom would most change your immediate plan?
- Poor concentration
- Psychomotor slowing
- *Thoughts that her family would be better off without her
- Reduced appetite
> Suicidal thinking changes the urgency of everything you do next.
:::

## 1.3 Melancholic and atypical features [core]
These two specifiers are opposites in many ways, and exam questions love the contrast.

| Feature | Melancholic | Atypical |
|---|---|---|
| Core | Loss of pleasure in all or almost all activities, or **no mood reactivity** (doesn't brighten even briefly when good things happen) | **Mood reactivity** is preserved (brightens with good news) |
| Plus | At least 3 of: a distinct quality of despondency; worse in the **morning**; **early morning waking** (at least 2 hours early); marked psychomotor change; marked loss of appetite or weight; excessive guilt | At least 2 of: increased appetite or weight gain; **hypersomnia**; **leaden paralysis** (heavy limbs); long-standing **sensitivity to rejection** |
| Sleep | Early morning waking | Too much sleep |
| Appetite | Loss | Gain |
| Treatment notes | Often responds well to biological treatment (antidepressants, ECT) | Historically linked to MAOI response; SSRIs used first now |

:::mnemonic Diurnal variation
Melancholic depression is **worst in the morning** and lifts slightly by evening. Ask: “Which part of the day is hardest?”
:::

:::sounds How it sounds
- Melancholic: “Subah 3–4 baje neend khul jaati hai, phir bas padha rehta hoon. Subah sabse bura lagta hai.” (I wake at 3 or 4 and just lie there. Mornings are the worst.)
- Atypical: “Bas sota rehta hoon, haath-pair bhaari lagte hain. Koi kuch keh de toh bahut bura lag jaata hai.” (I sleep all day, limbs feel heavy, and I'm crushed if anyone says anything.)
:::

:::recall
1. What is the core feature of melancholia? || Loss of pleasure in almost everything, or no mood reactivity.
2. Give the four associated features of atypical depression. || Weight or appetite gain, hypersomnia, leaden paralysis, rejection sensitivity.
3. When is melancholic depression usually worst? || In the morning.
:::

:::mcq
Q: A depressed patient wakes at 4 am, feels worst in the morning, has lost weight and nothing cheers him even briefly. This pattern is:
- Atypical features
- *Melancholic features
- Seasonal pattern
- Mixed features
> Early waking, morning worsening, weight loss and non-reactive mood. Melancholic depression responds well to physical treatments.

Q: A 24-year-old with depression sleeps 12 hours, eats more, feels her limbs are heavy and brightens when friends visit. Which is TRUE?
- These are melancholic features
- *These are atypical features, and bipolarity should be asked about
- She cannot be depressed if her mood lifts
- Tricyclics are first choice
> Atypical features (reactive mood, oversleeping, overeating, leaden paralysis) are commoner in bipolar depression.
:::

## 1.4 The other depressive disorders [core]
### Persistent depressive disorder (dysthymia)
:::define Criteria
Depressed mood for most of the day, for more days than not, for **at least 2 years** (in children and adolescents mood can be irritable, and the duration is **at least 1 year**), with **at least 2** of: poor appetite or overeating; insomnia or hypersomnia; low energy; low self-esteem; poor concentration or indecision; hopelessness. Never without symptoms for more than 2 months at a time. Never a manic or hypomanic episode.
:::
- It often begins insidiously before 25 and the person may think “this is just how I am”.
- Major depressive episodes can occur on top of it (once called “double depression”); specify with persistent major depressive episode or intermittent episodes.
- Prognosis improves with treatment; untreated, many never fully recover.

### Premenstrual dysphoric disorder
- In most menstrual cycles in the past year, **at least 5 symptoms** in the final week before menses, improving within a few days after onset and minimal in the week after.
- At least one of: marked mood swings, irritability or anger, depressed mood or hopelessness, anxiety or tension.
- Plus others: reduced interest, poor concentration, low energy, appetite change or cravings, sleep change, feeling overwhelmed, physical symptoms (breast tenderness, bloating, joint pain).
- Must be confirmed by **daily ratings over at least 2 cycles**.

### Disruptive mood dysregulation disorder
- Severe recurrent temper outbursts out of proportion to the situation, **at least 3 times a week**.
- Between outbursts, mood is **persistently irritable or angry** most of the day, nearly every day.
- Present for **at least 12 months**, in at least 2 settings (home, school, peers).
- Not diagnosed before age 6 or after 18; onset before 10.
- Created partly to stop over-diagnosis of bipolar disorder in irritable children. These children more often develop depression and anxiety than bipolar disorder.

### Substance or medication-induced, and due to a medical condition
| Cause | Examples |
|---|---|
| Substances | Alcohol (intoxication and withdrawal), withdrawal from stimulants, sedatives |
| Medicines | Corticosteroids, interferon, isotretinoin, some antihypertensives, hormonal treatments |
| Medical conditions | Hypothyroidism, Cushing's syndrome, stroke (especially left frontal), Parkinson's disease, multiple sclerosis, cancer (pancreatic), HIV, anaemia, vitamin B12 deficiency, chronic pain |

:::trap Always screen the body
Check thyroid function, blood count, glucose, and B12 in new depression, especially in older adults or atypical presentations. Treating hypothyroidism can resolve the “depression”.
:::

:::recall
1. Give the full criteria for persistent depressive disorder. || Depressed mood most days for at least 2 years (1 in youth) plus 2 of 6 symptoms, never symptom-free over 2 months, never manic.
2. How is PMDD confirmed? || Prospective daily ratings over at least 2 cycles.
3. State the age rules for DMDD. || Diagnosed 6 to 18; onset before 10.
4. Name five medical causes of depression. || Hypothyroidism, Cushing's, stroke, Parkinson's, cancer, B12 deficiency, anaemia, HIV, MS.
:::

:::mcq
Q: A 9-year-old has severe temper outbursts four times a week, and is irritable and angry between them, for over a year. Most likely:
- Bipolar disorder
- *Disruptive mood dysregulation disorder
- Oppositional defiant disorder only
- Normal childhood
> Chronic irritability with frequent severe outbursts, from age 6 to 18; introduced partly to reduce bipolar overdiagnosis in children.
:::

# Part II · Why it happens

## 2.1 The biology of depression [core]
No single cause explains depression. Think of **vulnerability plus stress**: genes and early experience load the gun; life events pull the trigger.

### Genetics
- First-degree relatives have about 2 to 3 times the risk.
- Twin studies suggest heritability of roughly a third to a half.
- Many genes of small effect; no single “depression gene”.

### The monoamine hypothesis and its limits
- **Idea**: depression reflects too little serotonin, noradrenaline and dopamine signalling. Supported by the fact that antidepressants raise these, and that reserpine (which depletes them) could cause depression.
- **Problem**: antidepressants raise monoamines within hours, yet mood improves only over **2 to 6 weeks**. So the delay points to slower downstream changes.

### Downstream changes: neuroplasticity
- Chronic stress and depression reduce **BDNF** (brain-derived neurotrophic factor), a growth factor for neurons.
- Hippocampal volume is reduced in recurrent depression.
- Antidepressants, ECT and exercise increase BDNF and new connections over weeks: a good explanation for the delay.

### Stress hormones: the HPA axis
- Hypothalamus releases CRH, pituitary releases ACTH, adrenals release **cortisol**.
- In many depressed patients the axis is overactive: raised cortisol, and failure of cortisol to fall after dexamethasone (the “dexamethasone suppression test”, now a research tool).
- Long-term high cortisol damages hippocampal neurons, linking stress, memory problems and depression.

### Other biological findings
| Area | Finding |
|---|---|
| Sleep | Shortened REM latency (dreaming starts sooner), increased REM, reduced deep sleep |
| Inflammation | Raised inflammatory markers in a subgroup; depression is common in inflammatory illness |
| Brain circuits | Overactive amygdala and subgenual cingulate; underactive prefrontal control; reduced reward responses in the striatum (anhedonia) |
| Thyroid | Subclinical hypothyroidism can worsen depression and resistance |

:::analogy A road and its repair crew
Monoamines are the traffic signals; neuroplasticity is the road. Antidepressants fix the signals in hours, but it takes weeks for the repair crew (BDNF) to rebuild the damaged road. That is why patients must keep taking the medicine through the first weeks.
:::

:::recall
1. What is the main problem with the simple monoamine hypothesis? || Monoamines rise in hours but mood improves over weeks.
2. What is BDNF, and what happens to it in depression? || A neuron growth factor; it falls with stress and depression and rises with treatment.
3. Describe the HPA axis findings in depression. || Overactive CRH, ACTH, cortisol; non-suppression after dexamethasone.
4. Name two sleep changes in depression. || Shortened REM latency; increased REM; reduced deep sleep.
:::

:::mcq
Q: Which finding argues AGAINST the simple idea that depression is just "low serotonin"?
- SSRIs help many people
- *Reuptake blocking is immediate, but mood takes weeks to improve
- Tryptophan depletion can trigger relapse
- Low 5-HIAA is found in violent suicide
> The delay points to downstream changes (receptor adaptation, plasticity), not just transmitter levels.
:::

## 2.2 Psychological and social causes [core]
### Cognitive model (Beck)
:::define The cognitive triad
Negative views of the **self** (“I am a failure”), the **world** (“nothing works out”) and the **future** (“it will always be like this”).
:::
- Early experiences create **schemas** (core beliefs) such as “I am unlovable”.
- A stressful event activates the schema, producing **negative automatic thoughts**.
- Thoughts are distorted by predictable **errors**:

| Distortion | Example |
|---|---|
| All-or-nothing thinking | “If I don't top, I've failed completely.” |
| Overgeneralisation | “I failed one test; I fail at everything.” |
| Mental filter | Remembering only the one criticism in a day of praise |
| Catastrophising | “My boss frowned; I'll be fired.” |
| Personalisation | “My parents fight because of me.” |
| Should statements | “I should never feel this way.” |
| Mind reading | “Everyone thinks I'm useless.” |

### Behavioural model
- Low mood leads to withdrawal; withdrawal removes rewarding experiences; fewer rewards deepen low mood (Lewinsohn). This loop is broken by **behavioural activation**.
- **Learned helplessness** (Seligman): repeated uncontrollable bad events teach that action is pointless. Later reformulated as a hopeless attributional style: internal (“it's me”), stable (“always”), global (“everything”).

### Psychodynamic view [extra]
- Freud's “Mourning and Melancholia”: in melancholia, anger at a lost loved object is turned inward against the self, producing self-reproach.
- Attachment theory: early loss or insecure attachment increases later vulnerability.

### Social factors
- Stressful life events, especially **loss and humiliation**, often precede episodes.
- Early childhood adversity (loss of a parent, abuse, neglect).
- Poverty, unemployment, debt, domestic violence, social isolation.
- Lack of a confiding relationship (Brown and Harris: having young children at home, no confidant, no work outside home, and early loss of mother were vulnerability factors in women).

:::recall
1. State Beck's cognitive triad. || Negative views of self, world and future.
2. Name four cognitive distortions with an example each. || All-or-nothing, overgeneralisation, catastrophising, personalisation, mind reading.
3. Describe learned helplessness and its reformulation. || Uncontrollable events teach that action is useless; internal, stable, global attributions.
4. List four social risk factors. || Loss and humiliation events, childhood adversity, poverty, no confidant, isolation.
:::

:::mcq
Q: A student fails one test and concludes, "I'm useless, I'll fail everything, my future is ruined." In Beck's triad these thoughts are about:
- Self only
- *Self, the future, and implicitly the world
- Others only
- The past
> The negative triad: self, world and future, maintained by distortions such as overgeneralisation.
:::

# Part III · Recognising it

## 3.1 How depression presents [core]
| Domain | Features |
|---|---|
| Emotional | Sadness, emptiness, irritability, anxiety, inability to cry or crying easily, loss of feeling |
| Cognitive | Poor concentration, indecision, worthlessness, guilt, hopelessness, rumination, suicidal thoughts |
| Biological | Sleep change (early waking), appetite and weight change, low energy, loss of libido, constipation, diurnal variation |
| Behavioural | Withdrawal, neglect of self-care, slowed movement and speech, reduced work output |
| Psychotic (severe) | Delusions of guilt, poverty, nihilism or disease; voices accusing the patient |

### Depression in Indian clinics
- Many patients first describe **body symptoms**: aches, headache, burning, “gas”, weakness, heaviness in the head. Ask about mood and interest directly.
- Distress may be framed as “tension” or blamed on family conflict, finances or nazar.
- Stigma: patients may fear being called “pagal”; families may want “a tonic” rather than an antidepressant.

:::sounds What patients say
- “Mann nahi lagta, kisi cheez mein.” (Nothing interests me.) Anhedonia.
- “Bas tension hai, neend nahi aati.” Ask what the tension is, and how they sleep.
- “Poore body mein dard rehta hai, kamzori lagti hai.” Somatic presentation: still screen for mood.
- “Main sab pe bojh hoon.” (I'm a burden on everyone.) Worthlessness and a suicide-risk clue.
- “Kya fayda jeene ka?” (What's the point of living?) Ask directly about suicidal thoughts.
:::

### Special groups
- **Children**: irritability, school refusal, falling marks, physical complaints, boredom.
- **Adolescents**: irritability, anger, substance use, self-harm.
- **Older adults**: physical complaints, memory complaints, agitation; may look like dementia (**depressive pseudodementia**: answers “I don't know”, patchy effort, onset is clearer, and mood symptoms precede memory complaints).
- **Postpartum**: within 4 weeks of delivery (peripartum onset); ask about thoughts of harming the baby. Distinguish from “baby blues” (common, brief, within the first two weeks, mild).

:::trap Pseudodementia versus dementia
| Feature | Depressive pseudodementia | Dementia |
|---|---|---|
| Onset | Relatively quick, datable | Slow and insidious |
| Effort | Poor effort; “I don't know” | Tries hard; near-miss answers |
| Complaints | Complains loudly of memory loss | Often unaware or hides it |
| Mood | Depressive symptoms come first | Mood changes later |
| Treatment | Improves with antidepressants | Progresses |
:::

:::recall
1. List the five domains of depressive features with two examples each. || Emotional, cognitive, biological, behavioural, psychotic.
2. How does depression often first present in Indian primary care? || With body symptoms: aches, weakness, gas, headache.
3. Give four differences between pseudodementia and dementia. || Onset, effort, complaints, mood first, response to treatment.
4. How do baby blues differ from peripartum depression? || Blues are common, mild and settle within two weeks.
:::

:::mcq
Q: A 60-year-old man in an Indian clinic complains only of "gas", body aches and weakness. Tests are normal. He has stopped going to the temple and no longer plays with his grandson. The likely missed diagnosis is:
- Somatic symptom disorder only
- *Depression presenting with physical complaints
- Hypochondriasis
- Malingering
> Somatic presentation is common; ask about interest, mood, sleep and hopelessness.
:::

## 3.2 Assessment and differential diagnosis [core]
### What to ask
- Mood, interest, the nine symptoms, duration, impairment.
- **Past highs**: “Have you ever felt so good or full of energy that others worried, slept little and didn't feel tired, spent a lot, or started many plans?”
- **Suicide**: ideation, intent, plan, preparation, past attempts, protective factors.
- Psychotic symptoms; substance use; medical illness; medicines.
- Stressors, supports, functioning, family history.

### Rating scales
| Scale | Who rates | Use |
|---|---|---|
| PHQ-9 | Patient | Screening and tracking; scores 0 to 27 (5, 10, 15, 20 mark mild, moderate, moderately severe, severe). Item 9 asks about self-harm thoughts |
| HAM-D (Hamilton) | Clinician | Severity in research and clinics |
| BDI-II (Beck) | Patient | Severity |
| Geriatric Depression Scale | Patient | Older adults; fewer somatic items |
| EPDS (Edinburgh) | Patient | Postnatal depression |

### Investigations
Blood count, thyroid function, glucose, kidney and liver function, B12 and folate where indicated; ECG before some medicines; consider HIV and VDRL by risk.

### Differential diagnosis
| Condition | How to tell |
|---|---|
| Bipolar depression | Past mania or hypomania; family history of bipolar; early onset, many episodes, atypical or psychotic features, postpartum onset |
| Adjustment disorder | Clear stressor, symptoms short of a full episode |
| Normal grief | Waves, preserved self-esteem |
| Dysthymia | Long, milder course |
| Schizophrenia (negative symptoms) | Blunted affect rather than sad mood; psychotic history |
| Dementia | See pseudodementia table |
| Hypothyroidism, anaemia, medicines, alcohol | Tests and history |

:::word Diagnosis line
“Major depressive disorder, single episode, severe, without psychotic features, with anxious distress. Passive death wishes, no plan. Insight grade 4.”
:::

:::recall
1. What screening question do you ask for past mania? || Have you ever felt very high or energetic, slept little without tiredness, spent a lot or started many plans?
2. What is the PHQ-9 range, and what are the cut-offs? || 0 to 27; 5, 10, 15, 20.
3. Name five differential diagnoses of depression. || Bipolar depression, adjustment disorder, grief, dysthymia, negative schizophrenia, dementia, medical causes.
:::

:::mcq
Q: A 45-year-old woman with low mood, tiredness, weight gain, constipation and dry skin. Before starting an antidepressant you should check:
- Lithium level
- *Thyroid function (TSH)
- EEG
- Urine drug screen only
> Hypothyroidism mimics depression and is easily treated.

Q: A man with first-episode depression has a history of a week of little sleep, overspending and talking fast 2 years ago. The best initial plan is:
- SSRI alone at full dose
- *Treat as possible bipolar depression: avoid an antidepressant alone and consider a mood stabiliser
- Benzodiazepine only
- No treatment
> A past hypomanic or manic episode changes the diagnosis and the treatment.
:::

## 3.3 Depression with physical illness [core]
Depression is two to three times more common in people with chronic physical illness, and it **worsens the physical outcome**: more pain, poorer self-care, worse adherence and higher death rates.

| Physical condition | What to know |
|---|---|
| **Heart disease** (after a heart attack) | Depression raises the risk of further cardiac events and death; **sertraline** is well studied and safe; avoid TCAs |
| **Diabetes** | Depression worsens glucose control; some antipsychotics and mirtazapine raise weight; SSRIs and CBT help |
| **Stroke** | Post-stroke depression is common, especially in the first year; it slows rehabilitation; SSRIs help |
| **Parkinson's disease** | Depression and anxiety are common and may come before the movement symptoms |
| **Hypothyroidism** | Can mimic depression (slowness, weight gain, tiredness); always check TSH |
| **Cancer** | Distinguish depression from normal sadness and from the body effects of cancer and its treatment |
| **HIV, tuberculosis** | Depression lowers adherence to treatment; **efavirenz** and some TB medicines can affect mood |
| **Chronic pain** | Two-way link; duloxetine or low-dose amitriptyline help both |

:::trap Don't count only body symptoms
In physical illness, fatigue, poor appetite and poor sleep may come from the illness itself. Lean on **psychological symptoms**: hopelessness, worthlessness, guilt, loss of interest, suicidal thoughts. The **Hospital Anxiety and Depression Scale (HADS)** avoids body symptoms for this reason.
:::

### Questions that help in the medical ward
- "How has your mood been since the illness began?"
- "Are you still able to enjoy anything, even small things?"
- "Do you feel hopeless about the future?"
- "Have you felt life is not worth living?"

:::recall
1. Which antidepressant is well studied after a heart attack? || Sertraline.
2. Why are body symptoms less useful for diagnosing depression in physical illness? || The illness itself causes them.
3. Which scale avoids body symptoms? || Hospital Anxiety and Depression Scale.
4. Which HIV medicine can affect mood? || Efavirenz.
:::

:::mcq
Q: A man has been low since his heart attack 2 months ago. The best antidepressant choice is usually:
- Amitriptyline
- *Sertraline
- Lithium
- Dothiepin
> Sertraline is well studied after a heart attack; tricyclics are avoided in heart disease.
:::

# Part IV · Treating it

## 4.1 Stepped care [core]
Treatment matches severity and risk.

| Step | Who | What |
|---|---|---|
| 1 | All | Assessment, psychoeducation, safety plan, sleep and activity advice, follow-up |
| 2 | Mild | Guided self-help, behavioural activation, problem-solving, exercise, brief CBT. Antidepressants not routinely first-line for mild depression |
| 3 | Moderate to severe | An antidepressant (usually an SSRI) **plus** psychological therapy (CBT, behavioural activation, interpersonal therapy) |
| 4 | Severe, psychotic, high suicide risk, refusing food and fluids, or catatonic | Specialist care; antidepressant plus antipsychotic, or **ECT** (fastest, most effective for severe and psychotic depression); admission if unsafe |

:::define How long to treat
After **remission**, continue the antidepressant at the same dose for **at least 6 to 12 months** for a first episode. For recurrent episodes (two or more, especially with residual symptoms or high risk), continue for **2 years or longer**, sometimes indefinitely. Stopping before about 3 months almost always brings symptoms back. Taper slowly to avoid discontinuation symptoms.
:::

### The first weeks
- Side effects come early; benefit comes later. Tell the patient: **sleep and energy often improve first; mood follows in 2 to 6 weeks**.
- Review within 1 to 2 weeks (sooner if young or at risk: SSRIs can increase suicidal thinking in under-25s early on).
- If little response by **4 to 6 weeks** at an adequate dose: check adherence and diagnosis, increase the dose, switch, or augment.

### When the first treatment fails
- **Optimise**: adequate dose, adequate duration, adherence.
- **Switch**: to another SSRI or a different class (SNRI, mirtazapine, bupropion).
- **Augment**: lithium, an atypical antipsychotic (for example aripiprazole, quetiapine), or thyroid hormone (T3).
- **Combine**: two antidepressants with different actions (for example SSRI plus mirtazapine).
- **Treatment-resistant depression**: failure of at least 2 adequate trials. Options include ECT, esketamine (nasal), and rTMS.

### Electroconvulsive therapy (ECT)
- Indications: severe depression with psychosis, high suicide risk, refusal of food and fluids, catatonia, stupor, previous good response, treatment resistance, pregnancy when medicines are risky.
- Given under anaesthesia with a muscle relaxant, usually 2 to 3 times a week, 6 to 12 sessions.
- Side effects: headache, confusion, short-term memory loss (usually recovers).
- In India the Mental Healthcare Act 2017 bans ECT without anaesthesia and muscle relaxant, and ECT for minors needs extra safeguards.

### Psychological therapies
- **CBT**: identify and test negative thoughts; behavioural experiments.
- **Behavioural activation**: schedule rewarding and meaningful activities; act first, mood follows.
- **Interpersonal therapy (IPT)**: focuses on grief, role disputes, role transitions, interpersonal deficits.
- **Problem-solving therapy**, mindfulness-based cognitive therapy (prevents relapse after 3 or more episodes).

:::trap Things that lose marks and harm patients
- Prescribing an antidepressant alone without asking about past mania.
- Stopping treatment as soon as the patient feels better.
- Not reviewing early in young patients.
- Prescribing large supplies of a toxic medicine (for example tricyclics) to someone at risk of overdose.
:::

:::recall
1. Outline the four steps of stepped care. || Assess and educate; mild: self-help, BA, CBT; moderate-severe: antidepressant plus therapy; severe or psychotic: specialist, antipsychotic or ECT.
2. How long do you continue an antidepressant after a first episode remits? || At least 6 to 12 months.
3. What do you do at 4 to 6 weeks with little response? || Check adherence and diagnosis; increase dose, switch, augment or combine.
4. Define treatment-resistant depression. || Failure of at least 2 adequate trials.
5. Give five indications for ECT. || Psychotic depression, high suicide risk, refusing food and fluids, catatonia, resistance (also pregnancy, previous response).
:::

:::mcq
Q: A woman with mild depression of 3 weeks, no risk, asks for "the strongest tablet". In stepped care the best first step is:
- High-dose antidepressant plus benzodiazepine
- *Guided self-help or behavioural activation, with review
- ECT
- Admission
> Medicines show the clearest benefit in moderate to severe depression.

Q: Four weeks into an adequate dose of sertraline, a man shows little change and takes it regularly. The diagnosis is clear. The next step is:
- Stop all treatment
- *Increase the dose or switch, and add psychological therapy if not started
- Wait 6 more months
- Add alprazolam long term
> Review at 4 to 6 weeks: adjust when little response.
:::

## 4.2 Course and prognosis [core]
- An untreated episode lasts about **6 to 13 months**; treated episodes average about **3 months**.
- Depression tends to **recur**: about half recover within the first year after a first hospital admission, and about **50 to 75%** have a recurrence within 5 years.
- Each episode raises the risk of the next; episodes may become more frequent and severe.
- Persistent depressive disorder often lasts years; about a quarter never fully recover without treatment.

| Better prognosis | Worse prognosis |
|---|---|
| Mild episode, no psychosis | Severe or psychotic episode |
| Short hospital stay | Comorbid anxiety, substance use or personality disorder |
| Good social support, stable family | Poor support, ongoing stressors |
| Good premorbid functioning | Early onset, chronic course, residual symptoms |
| Few previous episodes | Many episodes, older age at onset with medical illness |

:::note Suicide
Depression carries a high lifetime risk of suicide. Risk is highest early in an episode, after discharge, when hopelessness is high, and in the early weeks of recovery when energy returns before mood. Ask at every visit.
:::

:::recall
1. How long does an untreated depressive episode last, and a treated one? || 6 to 13 months; about 3 months.
2. What proportion of patients have a recurrence within 5 years? || About half to three quarters.
3. Name four good and four poor prognostic factors. || From the table.
4. When is suicide risk especially high in depression? || Early in the episode, after discharge, high hopelessness, early recovery.
:::

:::mcq
Q: Which feature predicts a WORSE course of depression?
- Acute onset with a clear stressor
- Good social support
- *Residual symptoms after the episode improves
- First episode in middle age with full recovery
> Incomplete recovery strongly predicts relapse; treat to full remission.
:::

## 4.3 ECT and brain stimulation in depth [core]
### How ECT is given
1. **Assessment**: indication, physical health (heart, lungs, teeth), anaesthetic review, medicines (stop or reduce lithium, benzodiazepines and anticonvulsants if possible; they raise the seizure threshold or cause confusion).
2. **Consent**: written informed consent; under the MHCA, the person's own consent if they have capacity, or as per supported decision-making provisions; never without anaesthesia and muscle relaxant.
3. **The session**: fasting, short-acting anaesthetic (thiopentone, propofol, ketamine), muscle relaxant (**succinylcholine**), oxygen, then a brief electrical stimulus to produce a seizure of about **25 seconds or more** (monitored by EEG).
4. **Course**: usually **2 to 3 times a week**, 6 to 12 sessions; response often seen after a few sessions.
5. **Continuation or maintenance**: ECT or medicines after the course to prevent relapse (relapse is high without it).

### Electrode placement
| Placement | Speed and efficacy | Memory effects |
|---|---|---|
| **Bilateral** (bitemporal) | Fastest, most effective | More memory effects |
| **Right unilateral** | Effective at higher doses | Fewer memory effects |
| Bifrontal | Intermediate | Intermediate |

### Safety
- **No absolute contraindications**; the main relative ones are **raised intracranial pressure** (space-occupying lesion), recent heart attack or stroke, and high anaesthetic risk.
- Death rate is very low, similar to minor anaesthesia.
- Side effects: headache, muscle aches, short-term confusion, **memory loss** around the treatment period (usually recovers within weeks; some gaps for events around the course can remain).
- **Safe in pregnancy** with obstetric support; often used in severe or psychotic depression in pregnancy.

### How does it work?
- Not fully known. ECT increases **BDNF** and neuroplasticity, raises GABA (the seizure threshold rises over a course), normalises the **HPA axis**, and changes connectivity in mood circuits.

### Other brain stimulation
| Method | What it is | Use |
|---|---|---|
| **rTMS** (repetitive transcranial magnetic stimulation) | A magnetic coil over the **left dorsolateral prefrontal cortex**; awake, no anaesthesia; daily sessions for weeks | Depression not responding to medicines; few side effects (scalp discomfort, headache; rare seizures) |
| **tDCS** (transcranial direct current) | Weak current through scalp electrodes | Research and some clinical use |
| Vagus nerve stimulation | Implanted device | Chronic resistant depression (specialist) |
| Deep brain stimulation | Implanted electrodes | Research for very resistant depression |

:::sounds Explaining ECT to a family
"ECT today is not like the old films. Your mother will be fully asleep under anaesthesia, and a medicine relaxes her muscles so her body hardly moves. A small current causes a brief controlled seizure in the brain for less than a minute. Most people wake up within minutes, a little confused for a while. It is one of the most effective treatments we have for severe depression like hers."
:::

:::recall
1. Which muscle relaxant is used in ECT? || Succinylcholine.
2. What is the minimum seizure length usually aimed for? || About 25 seconds.
3. Compare bilateral and right unilateral ECT. || Bilateral: faster and stronger but more memory effects; right unilateral: fewer memory effects.
4. Name the main relative contraindication to ECT. || Raised intracranial pressure.
5. Where is the rTMS coil placed for depression? || Over the left dorsolateral prefrontal cortex.
:::

:::mcq
Q: A 70-year-old has stopped eating and drinking, believes her intestines have rotted, and is losing weight fast. The most appropriate treatment is:
- Wait for an SSRI to work over 6 weeks
- *ECT, given the life-threatening refusal and psychotic features
- Benzodiazepine only
- Psychotherapy only
> Psychotic depression with refusal of food and fluids is a classic indication for ECT.
:::

# Part V · Exam zone

## 5.1 Long answer and short notes [core]
:::example Q. Describe the clinical features, diagnosis and management of major depressive disorder. (15 marks)
1. Definition and the place of MDD among depressive disorders.
2. Epidemiology: common, twice as common in women, often first episode before 40, large treatment gap.
3. Aetiology: genetic, monoamine and neuroplasticity, HPA axis; cognitive triad, learned helplessness; life events and social factors.
4. Clinical features by domain, with Indian presentations and special groups.
5. Criteria A to E (draw the nine symptoms) and specifiers (melancholic vs atypical table).
6. Differential diagnosis, including bipolar depression and medical causes.
7. Investigations and rating scales.
8. Management: stepped care, antidepressant principles and duration, therapy types, ECT indications, treatment resistance.
9. Course, prognosis and suicide risk.
:::

:::word Short note: melancholic depression
Melancholic features are a specifier of a major depressive episode: loss of pleasure in all or almost all activities or lack of mood reactivity, with at least three of a distinct quality of depressed mood, diurnal variation with morning worsening, early morning waking at least two hours early, marked psychomotor retardation or agitation, significant anorexia or weight loss, and excessive guilt. It predicts a good response to biological treatments, including ECT. Example: a 55-year-old who wakes at 3 a.m., is worst in the morning, has lost 6 kg and feels he has ruined his family.
:::

:::word Short note: persistent depressive disorder
Chronic depressed mood for most of the day, more days than not, for at least two years (one year in children, where mood may be irritable), with at least two of poor appetite or overeating, sleep change, low energy, low self-esteem, poor concentration and hopelessness, never symptom-free for more than two months and never manic. Onset is often insidious before 25; major depressive episodes may be superimposed. Treated with antidepressants and CBT; prognosis improves with treatment.
:::

## 5.2 Viva rapid-fire [core]
:::viva
How many symptoms are needed for a major depressive episode? :: Five of nine, for at least two weeks, one being depressed mood or loss of interest.
What finding rules out MDD? :: Any past manic or hypomanic episode.
What replaces depressed mood in children? :: Irritable mood.
What is anhedonia? :: Loss of interest or pleasure in previously enjoyable activities.
Duration for persistent depressive disorder? :: At least 2 years in adults, 1 year in children and adolescents.
What is double depression? :: Major depressive episodes on top of persistent depressive disorder.
Core of melancholic features? :: Loss of pleasure in nearly everything or lack of mood reactivity.
Associated features of atypical depression? :: Weight gain or increased appetite, hypersomnia, leaden paralysis, rejection sensitivity.
When is melancholic depression worst? :: In the morning.
What is peripartum onset? :: Onset in pregnancy or within 4 weeks after delivery.
How do baby blues differ from postpartum depression? :: Common, mild, settle within about 2 weeks.
Age rules for DMDD? :: Diagnosed between 6 and 18; onset before 10.
How is PMDD confirmed? :: Daily prospective ratings for at least 2 cycles.
Why do antidepressants take weeks to work? :: Downstream neuroplastic changes (BDNF, new connections) take weeks.
What is Beck's cognitive triad? :: Negative views of self, world and future.
What is learned helplessness? :: Learning from uncontrollable events that action is pointless.
Name three medical causes of depression. :: Hypothyroidism, stroke, Cushing's (also Parkinson's, B12 deficiency, cancer).
What is depressive pseudodementia? :: Apparent cognitive impairment caused by depression, improving with treatment.
How long to continue after a first episode? :: At least 6 to 12 months after remission.
Define treatment-resistant depression. :: Failure of at least two adequate antidepressant trials.
Three augmentation options? :: Lithium, an atypical antipsychotic, thyroid hormone.
Fastest, most effective treatment for psychotic depression? :: ECT.
What does PHQ-9 item 9 ask about? :: Thoughts of being better off dead or of self-harm.
Grief vs depression in one line? :: Grief comes in waves with self-esteem kept; depression is pervasive with worthlessness.
Antidepressant studied after a heart attack? :: Sertraline.
Scale avoiding body symptoms for depression in illness? :: HADS.
Muscle relaxant in ECT? :: Succinylcholine.
Usual ECT frequency? :: 2 to 3 times a week.
Placement with fewest memory effects? :: Right unilateral.
Main relative contraindication to ECT? :: Raised intracranial pressure.
Is ECT safe in pregnancy? :: Yes, with obstetric support.
rTMS target for depression? :: Left dorsolateral prefrontal cortex.
:::

## 5.3 Module test [core]
Answer every question before checking. Your best score is saved.

:::mcq
Q: A 30-year-old woman has had low mood, loss of interest, poor sleep, low energy and poor concentration for 10 days. What is missing for a major depressive episode?
- Five symptoms
- *The two-week duration
- Psychomotor change
- A precipitating event
> She has five symptoms, including mood and interest. What's missing is time: an episode needs at least two weeks.

Q: Which history finding most changes the treatment of a depressed patient?
- Family history of depression
- *A past week of elation, little sleep and overspending
- Poor appetite
- A recent breakup
> Past hypomania or mania means bipolar disorder; antidepressant alone may trigger mania.

Q: Early morning waking, worse mood in the morning, weight loss and excessive guilt suggest:
- Atypical features
- *Melancholic features
- Anxious distress
- Seasonal pattern
> Classic melancholia.

Q: Hypersomnia, weight gain, heavy limbs and mood that brightens with good news suggest:
- Melancholic features
- *Atypical features
- Mixed features
- Catatonia
> Mood reactivity plus atypical features.

Q: The minimum duration for persistent depressive disorder in an adult is:
- 6 months
- 1 year
- *2 years
- 5 years
> One year in children and adolescents.

Q: A 9-year-old has severe temper outbursts four times a week and is irritable between them for over a year. The most likely diagnosis is:
- Bipolar I disorder
- *Disruptive mood dysregulation disorder
- Persistent depressive disorder
- ADHD
> DMDD: frequent outbursts plus persistent irritability; onset before 10.

Q: Why do antidepressants usually take weeks to improve mood?
- They are absorbed slowly
- They raise monoamines slowly
- *Mood depends on slower downstream changes such as neuroplasticity
- The dose is always too low at first
> Monoamines rise within hours; mood follows slower plastic changes.

Q: Which is NOT part of Beck's cognitive triad?
- The self
- The world
- The future
- *The past
> Self, world and future.

Q: A 70-year-old with low mood answers memory questions with “I don't know” and complains loudly of forgetfulness that began 2 months ago. Most likely:
- Alzheimer's disease
- *Depressive pseudodementia
- Delirium
- Vascular dementia
> Quick onset, poor effort, loud complaint, mood first.

Q: After remission of a first depressive episode, the antidepressant should usually be continued for:
- 2 weeks
- 6 weeks
- *6 to 12 months
- Lifelong
> Stopping early brings relapse.

Q: Which is the most effective, fastest treatment for severe depression with delusions of guilt and refusal to eat?
- Higher-dose SSRI
- CBT
- *ECT
- Benzodiazepines
> ECT is indicated for psychotic depression, food refusal and high suicide risk.

Q: Treatment-resistant depression is usually defined as failure of:
- *At least two adequate antidepressant trials
- One week of treatment
- Psychotherapy only
- Any single medicine
> Two adequate trials of adequate dose and duration.

Q: Which test is most important to rule out a common medical cause of depression?
- Serum amylase
- *Thyroid function
- Chest X-ray
- EEG
> Hypothyroidism commonly mimics or worsens depression.

Q: A man says “Mann nahi lagta, kisi kaam mein” for a month. In clinical terms this is:
- Alexithymia
- *Anhedonia
- Apathy due to dementia
- Avolition only
> Loss of interest or pleasure.

Q: In grief, compared with depression:
- Self-esteem collapses
- *Pain comes in waves linked to reminders, and self-esteem is preserved
- Psychotic features are common
- Anhedonia is pervasive
> Classic distinction.

Q: A man is low after a heart attack. The safest antidepressant choice is usually:
- Amitriptyline
- *Sertraline
- Dothiepin
- Lithium alone
> TCAs are avoided in heart disease.

Q: Which is a relative contraindication to ECT?
- Pregnancy
- Old age
- *Raised intracranial pressure
- Psychotic depression
> Pregnancy and old age are not contraindications.

Q: Compared with bilateral ECT, right unilateral ECT:
- Works faster
- *Has fewer memory side effects
- Needs no anaesthesia
- Is contraindicated in older adults
> Bilateral is faster but affects memory more.
:::
`;
