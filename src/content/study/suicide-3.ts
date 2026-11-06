import { qa } from "./suicide-qa";
/* Module · Suicide, self-harm and risk, Parts IV and V (Advanced; exam zone with Q&A bank). Original text written for VIBHA School of Psychology. Educational content: no method details by design. */
export const part3 = String.raw`
# Part IV · Advanced: prediction, mechanisms, interventions and policy

## 4.1 Why suicide cannot be predicted, and what to do instead [core][advanced]
### The base-rate problem
Suicide is, statistically, a rare event even in high-risk groups. When an outcome is rare, even a test that seems accurate produces mostly **false positives**.

:::widget guess
{"prompt": "A risk tool correctly flags 80% of people who will die by suicide in the next year and correctly clears 80% of those who will not. In a group where 1 in 200 will die by suicide that year, what percentage of people flagged 'high risk' will actually die by suicide?", "min": 0, "max": 100, "step": 0.5, "unit": "%", "answer": [1.5, 2.5], "reveal": "Only about 2%. Out of 1,000 people, 5 will die by suicide; the tool flags 4 of them, but it also flags about 199 of the 995 who will not. So about 4 in 203 flagged people (2%) are true positives, and one of the 5 deaths was in the group labelled 'low risk'. Prediction fails; care must not depend on the label.", "clinician": "With prevalence p = 0.005, sensitivity 0.8 and specificity 0.8: positive predictive value = (0.8 × 0.005) / [(0.8 × 0.005) + (0.2 × 0.995)] which is about 0.004 / 0.203, roughly 2%. Meta-analyses of real risk scales and categories report similarly low positive predictive values, and a substantial share of suicides occur among people classed as low risk."}
:::

### Consequences for practice
- Classifying people as "low", "medium" or "high" risk does not reliably predict who will die, and can **falsely reassure** clinicians about the "low-risk" group, where many deaths occur.
- Guidelines (for example NICE's 2022 guideline on self-harm) advise against using risk scales or global risk categories to predict suicide or to decide who receives care.
- The alternative is a **needs-based, formulation-driven approach**: understand the person's current state, drivers and protective factors; respond to what they need; plan for safety with them; and treat everyone who presents with suicidal thoughts or self-harm with care and follow-up.

### State, not trait
Suicidal risk **fluctuates**. Rudd's fluid vulnerability theory separates **baseline** risk (relatively stable: history, temperament) from **acute** risk (rapid changes with stressors, intoxication, sleep loss and agitation). Assessment is therefore a repeated process, not a one-time verdict.

:::widget decide
{"scene": "An emergency department in Pune requires every self-harm patient to be scored as 'low', 'medium' or 'high' risk, and only 'high-risk' patients are referred to psychiatry. Sameer, 27, scores 'low' because he has no past attempts and says he is fine now. He has just lost his job and drinks heavily.", "ask": "What would an evidence-based service do?", "choices": [{"label": "Follow the protocol and discharge him without referral", "verdict": "harm", "outcome": "He receives no follow-up. Two weeks later he presents again, more seriously.", "why": "A 'low' score does not mean low risk. Allocating care by score misses many people who go on to harm themselves."}, {"label": "Offer every self-harm patient a psychosocial assessment and a needs-based plan, regardless of score: for Sameer, a safety plan, help with alcohol and job loss, family involvement with consent, and early follow-up", "verdict": "best", "outcome": "He engages with an alcohol service and a counsellor. He does not re-present.", "why": "Assessment and care based on needs and formulation, not on a prediction score, is the recommended approach."}, {"label": "Admit everyone who self-harms", "verdict": "harm", "outcome": "Beds overflow; many patients feel coerced and avoid future help.", "why": "Blanket admission is neither feasible nor helpful; care should match needs."}]}
:::

:::recall
1. Why does a seemingly accurate risk tool produce mostly false positives? || Because suicide is rare; with a low base rate, positive predictive value is very low.
2. What does NICE advise instead of risk categories? || A needs-based psychosocial assessment, formulation and plan for everyone.
3. What does fluid vulnerability theory distinguish? || Baseline (stable) risk from acute (fluctuating) risk.
:::

:::mcq
Q: The main reason "low-risk" labels are dangerous is that:
- They are expensive
- *Many suicides occur among people labelled low risk, so the label can falsely reassure
- They are illegal
- They take too long
> Low positive and imperfect negative predictive value.
:::

## 4.2 Mechanisms: from brain to society [core][advanced]
### Biological findings
- **Serotonin**: post-mortem and cerebrospinal fluid studies link suicidal behaviour, especially violent and impulsive attempts, to **reduced serotonergic function** (for example low cerebrospinal fluid 5-HIAA, altered 5-HT1A and 5-HT2A binding in prefrontal cortex). This seems related to **impulsive aggression** across diagnoses.
- **Stress system**: hyperactivity of the HPA axis (non-suppression on the dexamethasone test in depression is associated with later suicide), and lasting stress-system changes after childhood adversity, partly through **epigenetic** changes (for example in glucocorticoid receptor gene methylation in people with histories of childhood abuse).
- **Inflammation**: raised inflammatory markers in some people with suicidal behaviour.
- **Lithium**: its antisuicidal effect in mood disorders may partly come from reduced impulsivity and aggression, independent of mood stabilisation. Ecological studies have linked higher natural lithium in drinking water with lower suicide rates, though such correlations are weak evidence.
- **Genetics**: suicidal behaviour is familial; twin studies suggest heritability of roughly 30 to 50%, partly independent of the heritability of mental disorders. No gene predicts suicide in an individual.

### Cognitive and psychological processes
- **Problem-solving deficits** and **overgeneral autobiographical memory** (recalling general rather than specific memories) make it harder to find ways out of a crisis.
- **Attentional bias to suicide-related cues** and a **"suicidal mode"** (Rudd, Beck): a network of thoughts, emotions, physiology and urges that activates quickly once primed.
- **Entrapment** (internal: trapped by one's own thoughts; external: by circumstances) is one of the strongest proximal predictors of ideation.
- **Capability for suicide**: habituation to pain and fear through repeated self-harm or exposure to violence.

### Social and structural
Economic shocks, debt, unemployment, discrimination, gender-based violence, and access to lethal means shape population suicide rates. Interventions at this level (means restriction, debt relief, school programmes, alcohol policy) often prevent more deaths than individual treatment alone.

:::widget sort
{"prompt": "At which level does each factor mainly act?", "buckets": ["Biological", "Psychological", "Social or structural"], "items": [{"text": "Low cerebrospinal fluid 5-HIAA with impulsive aggression", "bucket": 0}, {"text": "Overgeneral memory that blocks problem-solving", "bucket": 1}, {"text": "A sudden farm-debt crisis in a district", "bucket": 2}, {"text": "Entrapment after public humiliation", "bucket": 1}, {"text": "HPA axis changes after childhood abuse", "bucket": 0}, {"text": "Easy availability of highly hazardous pesticides", "bucket": 2}]}
:::

:::recall
1. What serotonin finding is linked to suicidal behaviour? || Reduced serotonergic function (low CSF 5-HIAA), especially with impulsive, violent attempts.
2. Name two cognitive processes linked to suicidality. || Problem-solving deficits; overgeneral memory; attentional bias; the suicidal mode; entrapment.
3. Roughly what is the heritability of suicidal behaviour? || About 30 to 50%, partly independent of mental disorders.
:::

:::mcq
Q: Which finding suggests that suicidal behaviour is not simply a consequence of depression?
- Suicide is common in depression
- *Its familial transmission is partly independent of the transmission of mental disorders
- Antidepressants exist
- Depression is common
> Impulsive aggression and other traits contribute.
:::

## 4.3 Interventions at depth [core][advanced]
### Suicide-specific psychological treatments
| Approach | Key mechanism | Format |
|---|---|---|
| Dialectical behaviour therapy | Emotion regulation, distress tolerance, interpersonal effectiveness and mindfulness skills; validation balanced with change; chain analysis of each self-harm episode | Individual therapy, skills group, phone coaching, therapist consultation team; about a year |
| Cognitive therapy for suicide prevention | Narrative of the suicidal crisis, identifying the chain of thoughts and events, safety planning, a "hope kit", relapse prevention with guided imagery of a future crisis | About 10 sessions after an attempt |
| CAMS | Suicide as the primary focus; collaborative suicide status form; "drivers" of suicide identified and treated | Variable, until resolution |
| ASSIP | Video-recorded narrative of the attempt, joint review, written formulation and safety strategies, then regular letters for two years | Three sessions plus letters |
| Brief contact interventions | Caring letters, postcards, phone calls | Months after discharge |
| Safety planning with follow-up calls | Stanley-Brown plan in the emergency department, then structured calls | Single session plus calls |

### Medicines and physical treatments
- **Lithium**: maintain in mood disorders with suicidal history; monitor levels; note that its lethality in overdose requires careful supply.
- **Clozapine**: for suicidality in schizophrenia and schizoaffective disorder.
- **Esketamine**: US approval for depression with acute suicidal ideation or behaviour, with an oral antidepressant; reduces depressive symptoms within a day, though trials did not clearly show faster resolution of suicidality than the comparator.
- **Intravenous ketamine**: rapid reduction in suicidal thoughts in trials, lasting days; not standard care.
- **ECT**: rapid relief in severe depression with high suicidal intent; often under-used.
- **Antidepressants**: overall benefit in depression; monitor closely in young people early on.

:::clinician
### Prescribing safely for people at risk
- Prescribe medicines that are less toxic in overdose where clinically appropriate.
- Limit quantities dispensed (for example weekly), and involve a trusted person with consent.
- Review all medicines at home, including those of other family members.
- Avoid tricyclics as first-line in people at risk; take care with lithium supply and levels.
- Address insomnia and agitation promptly; they are modifiable acute risk factors.
- Treat alcohol use; consider naltrexone or acamprosate.
:::

### Systems approaches
- **Zero Suicide** frameworks aim for safer health systems: screening, pathway to care, evidence-based treatment, follow-up after transitions and continuous improvement.
- **Care transitions**: contact within days of discharge from hospital or the emergency department; this is when risk peaks.
- **Gatekeeper training**: teachers, wardens, police and religious leaders learn to recognise and respond to warning signs.

:::widget worked
{"title": "A DBT chain analysis", "steps": [{"q": "Target behaviour?", "a": "Meghna, 22, harmed herself on Saturday night."}, {"q": "Vulnerability factors?", "a": "Slept three hours; skipped meals; had argued with her mother; had drunk alcohol at a party."}, {"q": "Prompting event?", "a": "Her boyfriend did not reply to messages for two hours."}, {"q": "Links in the chain?", "a": "Thought: 'He's leaving me, I'm unlovable.' Emotion: panic, then shame. Body: chest tight, heat. Urge: 'I need this feeling to stop.' Action: self-harm."}, {"q": "Consequences?", "a": "Short-term relief (reinforcing the behaviour); later guilt and hiding wounds."}, {"q": "Where could skills replace links?", "a": "Sleep and food (reduce vulnerability); check the facts (he was driving); TIPP skills for intense emotion (cold water on the face, paced breathing); reaching out to her sister; a plan for Saturday nights."}]}
:::

:::recall
1. Name the four skill modules of DBT. || Mindfulness, distress tolerance, emotion regulation, interpersonal effectiveness.
2. What is a chain analysis? || A step-by-step analysis of the vulnerabilities, prompts, thoughts, emotions, urges, actions and consequences around a target behaviour.
3. Give three safe-prescribing steps for a person at risk. || Lower-toxicity choices; limited quantities; involve a trusted person; review medicines at home; treat insomnia and alcohol.
:::

:::mcq
Q: In ASSIP, the first session centres on:
- A risk score
- *A video-recorded narrative of the suicidal crisis, reviewed together
- Medication review only
- Family therapy
> Narrative and joint understanding build a shared plan.
:::

## 4.4 Classification, policy and the research frontier [core][advanced]
### How the rulebooks treat suicide
- Suicidal behaviour is **not** a mental disorder in DSM-5-TR or ICD-11; it occurs across many disorders and without any.
- DSM-5-TR added codes in "other conditions that may be a focus of clinical attention" for **current** and **history of** suicidal behaviour and non-suicidal self-injury, so they can be recorded alongside any diagnosis. Suicidal behaviour disorder and NSSI disorder remain in the section of conditions for further study.
- ICD-11 records intentional self-harm through injury and external-cause codes, and symptoms within disorders.

### HiTOP and RDoC lenses
- Suicidal ideation clusters with **internalising** distress; suicidal behaviour and NSSI also relate to **disinhibited externalising** (impulsivity) and to emotional dysregulation.
- RDoC frames suicidality through **negative valence** (loss, sustained threat), **positive valence** (reduced reward anticipation, hopelessness), **cognitive control** and **arousal** systems.

### India's policy landscape
- **Mental Healthcare Act 2017, section 115**: presumption of severe stress; no prosecution; duty of care.
- **Bharatiya Nyaya Sanhita 2023**: the general offence of attempting suicide is not retained; attempting suicide to compel or restrain a public servant remains an offence.
- **National Suicide Prevention Strategy 2022**: a 10% reduction in suicide mortality by 2030; surveillance, psychiatric outpatient services in all districts, mental well-being curricula in schools, media guidelines and means restriction.
- **Supreme Court guidelines (July 2025)** for educational institutions: binding measures including qualified counsellors, staff training, anti-ragging and anti-discrimination mechanisms, crisis protocols and referral pathways.
- **Pesticide regulation**: several highly hazardous pesticides have been banned or restricted in India; international experience shows such bans can greatly reduce suicide deaths.

### Frontier research as of November 2026
| Area | Status |
|---|---|
| Machine-learning risk models from health records | Better than chance at group level but positive predictive values remain low; useful at most for prompting outreach, not for individual decisions |
| Ecological momentary assessment | Smartphone sampling shows suicidal thoughts can change within hours, supporting a fluctuating-state view |
| Digital safety planning and apps | Increasing use; evidence for symptom reduction is modest and mixed |
| Rapid-acting treatments | Ketamine and esketamine short-term effects established; long-term benefit on suicide deaths unknown |
| Lithium | Strong observational evidence; one large randomised trial in veterans did not reduce suicidal behaviour, keeping the debate open |
| Means-restriction policy | Strongest population-level evidence of all approaches |

:::widget reveal
{"prompt": "If machine-learning models can identify groups at raised risk, why should they not decide individual care?", "answer": "Because the base rate stays low, even good models flag many people who will never act and miss some who will. Decisions about a person must rest on talking with them, understanding their situation and needs, and planning together. Models may help systems decide whom to contact proactively, but they cannot replace assessment, and they raise questions about privacy, consent and bias against groups under-represented in the data."}
:::

:::recall
1. Is suicidal behaviour a mental disorder in DSM-5-TR? || No; DSM-5-TR provides codes for current and past suicidal behaviour and NSSI as conditions of clinical focus.
2. What is the target of India's National Suicide Prevention Strategy? || A 10% reduction in suicide mortality by 2030.
3. Which prevention approach has the strongest population-level evidence? || Means restriction.
:::

:::mcq
Q: Which statement about machine-learning suicide prediction is accurate as of late 2026?
- It reliably predicts individual suicides
- *It identifies higher-risk groups but has low positive predictive value for individuals
- It replaces clinical assessment
- It has no research support at all
> Useful for outreach, not individual decisions.
:::

# Part V · Exam zone

## 5.1 Long answer and short notes [core]
:::example Q. Discuss the assessment and management of a patient presenting with suicidal ideation. (15 marks)
1. Introduction: scale of the problem (global and Indian figures), ambivalence, why assessment is a clinical skill not a prediction.
2. Engagement and asking: privacy, direct questions, normalising, step-by-step sequence, the CASE approach.
3. What to establish: ideation, plan, access to means, preparation, intent, past attempts, reasons for living; mental state (hopelessness, psychosis, agitation, intoxication); stressors; supports; collateral.
4. Risk and protective factors: static versus dynamic; models (interpersonal theory, IMV) to explain why now.
5. Formulation rather than risk categories; base-rate problem; NICE guidance.
6. Management: safety planning (six steps), means safety, level of care (outpatient, crisis, admission under the Mental Healthcare Act), treat underlying disorders (lithium, clozapine, antidepressants with monitoring, ECT), psychological therapies (CT-SP, DBT, CAMS), help with social problems, follow-up after transitions.
7. Legal and ethical: section 115 of the Mental Healthcare Act 2017; confidentiality limits; documentation.
8. Special groups and postvention.
:::

:::word Short note: section 115 of the Mental Healthcare Act 2017
Section 115 provides that, notwithstanding section 309 of the Indian Penal Code, any person who attempts suicide shall be presumed, unless proved otherwise, to have severe stress and shall not be tried and punished. It places a duty on the appropriate government to provide care, treatment and rehabilitation to such a person to reduce the risk of recurrence. It reframes attempted suicide from a crime to a health need. The Bharatiya Nyaya Sanhita (2023, in force from 2024) does not retain the general offence, but makes it an offence to attempt suicide to compel or restrain a public servant.
:::

:::word Short note: safety planning
A collaborative, written plan made with a person at risk, listing in their own words: warning signs of a crisis; internal coping strategies; people and places that provide distraction; people to ask for help; professionals and services to contact; and steps to make the environment safer, especially by reducing access to lethal means. Reasons for living are often added. It differs from a no-suicide contract, which is not recommended. Safety planning with follow-up calls after an emergency visit reduced subsequent suicidal behaviour in a large study.
:::

:::word Short note: safe media reporting
Sensational, detailed or glamorised reporting of suicide is followed by imitative suicides (the Werther effect), while stories of people overcoming suicidal crises may protect (the Papageno effect). WHO guidance, adopted by the Press Council of India, advises against reporting methods or locations, sensational headlines, photographs, suicide notes and simplistic causes, and recommends neutral language ("died by suicide"), information on where to get help, and stories of hope.
:::

## 5.2 Viva rapid-fire [core]
:::viva
Strongest risk factor for suicide? :: A previous suicide attempt.
Define NSSI. :: Deliberate self-injury without intent to die.
What is the gender paradox? :: Women have more ideation and attempts; men die by suicide more often.
Durkheim's four types? :: Egoistic, altruistic, anomic, fatalistic.
Shneidman's key concept? :: Psychache.
Joiner's interpersonal theory? :: Thwarted belongingness plus perceived burdensomeness, with acquired capability.
IMV model's central link? :: Entrapment after defeat or humiliation.
Three-step theory steps? :: Pain and hopelessness; pain exceeding connectedness; capability.
Why are risk scales not used for prediction? :: Low base rate gives low positive predictive value; many deaths occur in "low-risk" groups.
Six steps of a safety plan? :: Warning signs, internal coping, distraction, people to ask, professionals, safer environment.
Are no-suicide contracts recommended? :: No.
Which medicine lowers suicide in mood disorders? :: Lithium.
Which antipsychotic lowers suicidal behaviour in schizophrenia? :: Clozapine.
Name a therapy that halved repeat attempts after an attempt. :: Cognitive therapy for suicide prevention.
What is a chain analysis? :: A DBT method analysing the sequence leading to a target behaviour.
Section 115 of the Mental Healthcare Act? :: Presumption of severe stress; no trial or punishment; government duty of care.
Werther effect? :: Imitative suicides after sensational reporting.
Papageno effect? :: Protective effect of stories of coping.
When is risk highest after discharge? :: In the first weeks.
National Suicide Prevention Strategy target? :: 10% reduction in suicide mortality by 2030.
Serotonin marker linked to impulsive suicidal behaviour? :: Low CSF 5-HIAA.
What is postvention? :: Support after a suicide, which also prevents further suicides.
:::

${qa}
## 5.6 Module test [core]
Answer every question before looking back. Your best score is saved.

:::mcq
Q: A man says he wishes he would not wake up but has no plan or intent. This is:
- Active ideation with intent
- *Passive suicidal ideation
- NSSI
- An aborted attempt
> Still explore fully and follow up.

Q: Which is the strongest known risk factor for suicide?
- Male sex
- Unemployment
- *A previous suicide attempt
- Living in a city
> Yet most people who attempt never die by suicide.

Q: Which statement about asking about suicide is supported by evidence?
- It plants the idea
- *It does not increase suicidal thoughts and may reduce distress
- It should be left to the family
- It is unethical
> Ask directly.

Q: Perceived burdensomeness and thwarted belongingness belong to:
- Durkheim's theory
- Shneidman's theory
- *The interpersonal theory of suicide
- Beck's theory
> Joiner.

Q: In the IMV model, the move from ideation to action is governed by:
- Motivational factors only
- *Volitional moderators such as access to means, impulsivity and exposure to suicide
- Durkheim's types
- Genetics alone
> The volitional phase.

Q: A risk tool with 80% sensitivity and specificity is used where suicide is rare. Its positive predictive value will be:
- About 80%
- About 50%
- *Very low (a few per cent)
- 100%
> The base-rate problem.

Q: NICE's 2022 self-harm guideline advises:
- Allocating care by risk score
- *Not using risk scales or categories to predict suicide or decide who receives care
- Discharging low-risk patients without assessment
- Admitting all self-harm patients
> Needs-based assessment for all.

Q: Which is a dynamic risk factor?
- History of childhood abuse
- *Current intoxication and agitation
- Family history of suicide
- Male sex
> Dynamic factors are targets for intervention.

Q: The first step of the Stanley-Brown safety plan is:
- Contact professionals
- *Identify warning signs
- Remove means
- Sign a contract
> Then coping, distraction, people, professionals, safer environment.

Q: No-suicide contracts are:
- Recommended
- *Not recommended; no evidence and possible harm
- Legally required
- The same as safety plans
> Use collaborative safety plans.

Q: Means safety is effective mainly because:
- Everyone substitutes another method
- *Many crises are brief and the available method affects survival
- It replaces treatment
- It reduces depression directly
> Strong population evidence.

Q: Which intervention reduced repeat suicide attempts by about half after an attempt?
- Supportive counselling
- *Cognitive therapy for suicide prevention
- Benzodiazepines
- Hospital admission alone
> A landmark randomised trial.

Q: DBT was developed mainly for:
- Schizophrenia
- *Chronic suicidality and self-harm in borderline personality disorder
- OCD
- Dementia
> Now used more widely.

Q: Clozapine reduces suicidal behaviour in:
- Depression
- *Schizophrenia and schizoaffective disorder
- Anxiety disorders
- Dementia
> InterSePT.

Q: Esketamine is approved in the US for:
- All anxiety disorders
- *Depression with acute suicidal ideation or behaviour, with an oral antidepressant
- Schizophrenia
- Bipolar mania
> Short-term rapid effects.

Q: Under section 115 of the Mental Healthcare Act 2017, a person who attempts suicide:
- Must be prosecuted
- *Is presumed to have severe stress, is not tried or punished, and must be offered care
- Is detained for six months
- Must pay a fine
> A health, not criminal, response.

Q: The Bharatiya Nyaya Sanhita makes it an offence to:
- Attempt suicide in any circumstance
- *Attempt suicide to compel or restrain a public servant from duty
- Seek help after an attempt
- Report suicide in the media
> Section 226.

Q: Imitative suicides after sensational reporting are called:
- The Papageno effect
- *The Werther effect
- Contagion immunity
- Postvention
> Safe messaging reduces risk.

Q: Which is safe messaging?
- "Committed suicide"
- Describing the method
- *"Died by suicide" with information about getting help
- Publishing a suicide note
> Neutral language and help-seeking information.

Q: Suicide risk after psychiatric discharge is highest:
- After a year
- *In the first weeks
- Never
- Only at night
> Follow up within days.

Q: Low cerebrospinal fluid 5-HIAA is most associated with:
- Planned, low-lethality attempts
- *Impulsive, violent suicidal behaviour
- Anxiety without suicidality
- Dementia
> Serotonin and impulsive aggression.

Q: Fluid vulnerability theory emphasises that:
- Risk is fixed
- *Acute risk fluctuates around a baseline, so assessment must be repeated
- Only genes matter
- Prediction is easy
> State versus trait.

Q: In DSM-5-TR, suicidal behaviour is:
- A separate mental disorder
- *Coded as a condition of clinical focus (current or history), not a disorder
- Not mentioned
- A personality disorder
> Suicidal behaviour disorder remains for further study.

Q: India's National Suicide Prevention Strategy (2022) aims to:
- Eliminate suicide by 2025
- *Reduce suicide mortality by 10% by 2030
- Criminalise attempts
- Close psychiatric hospitals
> With surveillance, schools, media and means restriction.

Q: Which is the best response after a student's suicide in a coaching centre?
- A large memorial with photos and details
- Silence
- *Sensitive information, support for close friends and vulnerable students, safe messaging and clear help pathways
- Blaming the student's family
> Planned postvention reduces contagion.

Q: Which group has particularly high suicide risk in India?
- Retired civil servants with pensions
- *Young married women facing domestic violence
- People who exercise regularly
- University professors
> Gender-based violence is a major factor.
:::
`;
