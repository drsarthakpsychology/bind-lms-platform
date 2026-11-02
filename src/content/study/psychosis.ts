import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "psychosis",
  num: 9,
  title: "Schizophrenia spectrum and catatonia",
  emoji: "🌀",
  tagline: "From brief psychosis to schizophrenia, how to tell them apart, and how to treat catatonia",
  when: "Weeks 5 to 6",
  outcomes: [
    "State the criteria for schizophrenia and the other psychotic disorders, separated by duration",
    "Describe positive, negative and cognitive symptoms with examples",
    "Explain the dopamine, glutamate and neurodevelopmental models",
    "List good and poor prognostic factors and the role of expressed emotion",
    "Recognise catatonia, rate it, and know why lorazepam and ECT come first",
  ],
  writeTask:
    "On paper, from memory: the five A-criterion symptoms of schizophrenia, the duration ladder (brief psychotic, schizophreniform, schizophrenia), the schizoaffective rule, the 12 catatonic signs, 6 good and 6 poor prognostic factors, and the treatment plan including clozapine. Then check and correct in red.",
  activities: [
    act.lesson("psy-1", "Quiz: the schizophrenia spectrum", "Durations and criteria."),
    act.lesson("psy-2", "Quiz: catatonia and red flags", "Signs, lorazepam challenge, emergencies."),
    act.scenarios("schizophrenia", "Patient case: the voices", "Talking with someone who is hearing voices, without arguing or colluding."),
    act.lesson("signs-2", "Quiz: perception and belief", "Hallucinations and delusions."),
  ],
  noteId: "schizophrenia",
};

export const text = String.raw`
# Part I · The disorders

## 1.1 What psychosis is [core]
:::define Psychosis
A state in which a person's contact with shared reality is impaired, shown by **delusions, hallucinations, disorganised thinking or behaviour**, often with **loss of insight**. Psychosis is a syndrome, not a diagnosis: it occurs in schizophrenia, mood disorders, substance use, delirium and many medical conditions.
:::

### The five domains that define the spectrum
| Domain | Example |
|---|---|
| Delusions | “The neighbours are poisoning my food.” |
| Hallucinations | Voices discussing the patient in the third person |
| Disorganised thinking (speech) | Derailment, tangentiality, incoherence |
| Grossly disorganised or abnormal motor behaviour, including catatonia | Unpredictable agitation, silliness, posturing, mutism |
| Negative symptoms | Reduced emotional expression and avolition |

:::recall
1. Define psychosis. || Impaired contact with reality shown by delusions, hallucinations, or disorganised thought or behaviour, often with loss of insight.
2. Name the five domains of the schizophrenia spectrum. || Delusions, hallucinations, disorganised speech, disorganised or catatonic behaviour, negative symptoms.
:::

## 1.2 Schizophrenia: criteria and symptoms [core]
:::define Criteria
**A.** Two or more of: (1) delusions, (2) hallucinations, (3) disorganised speech, (4) grossly disorganised or catatonic behaviour, (5) negative symptoms. Each present for a significant part of **1 month** (less if treated), and **at least one must be 1, 2 or 3**.
**B.** Level of functioning (work, relationships, self-care) is markedly below the previous level.
**C.** Continuous signs for **at least 6 months**, including at least 1 month of A symptoms. The rest may be prodromal or residual (negative symptoms only, or attenuated A symptoms such as odd beliefs).
**D.** Schizoaffective and mood disorders with psychotic features are ruled out.
**E.** Not due to a substance or medical condition.
**F.** With a history of autism or a communication disorder, prominent delusions or hallucinations must be present for at least 1 month.
:::

### The three symptom groups
| Group | Features | Notes |
|---|---|---|
| Positive | Delusions, hallucinations, disorganised speech and behaviour | Respond best to antipsychotics |
| Negative | **Alogia** (poverty of speech), **avolition** (lack of drive), **anhedonia**, **asociality**, **affective blunting** | The “5 A's”. Drive long-term disability; respond poorly to medicines |
| Cognitive | Poor attention, working memory, processing speed, executive function | Present before onset; strongly predict functional outcome |

:::mnemonic The 5 A's of negative symptoms
**A**logia · **A**volition · **A**nhedonia · **A**sociality · **A**ffective blunting.
:::

### Classical descriptions
- **Bleuler's 4 A's**: disturbances of **A**ssociations, **A**ffect, **A**utism (withdrawal into an inner world) and **A**mbivalence. He coined the word schizophrenia (“split mind”: split between thought, emotion and behaviour, not a split personality).
- **Schneider's first-rank symptoms**: audible thoughts (thought echo), voices arguing or discussing, voices commenting on actions, somatic passivity, thought withdrawal, insertion and broadcasting, made feelings, made impulses, made actions, and delusional perception. Suggestive, not diagnostic: they also occur in mania and organic states.

:::trap Old subtypes
DSM-5 and ICD-11 dropped the subtypes (paranoid, hebephrenic, catatonic, undifferentiated, residual) because they were unstable and didn't guide treatment. Know them for older question papers: **paranoid** (delusions and voices, better preserved), **hebephrenic or disorganised** (early onset, silliness, poor prognosis), **catatonic**, **simple** (insidious negative symptoms).
:::

:::sounds How it sounds
- “TV pe news wale mere baare mein baat karte hain.” Delusion of reference.
- “Do log baat karte hain, ‘dekho, ab yeh uth raha hai’.” Third-person running commentary.
- “Mere dimaag mein koi aur vichaar daal deta hai.” Thought insertion.
- Family: “Pehle bahut padhta tha, ab saara din kamre mein padha rehta hai, nahata bhi nahi.” (He used to study hard; now he lies in his room all day and doesn't bathe.) Negative symptoms and decline.
:::

:::recall
1. Give criteria A and C exactly. || Two of five symptoms for a month, one being delusions, hallucinations or disorganised speech; 6 months in total including 1 month active.
2. List the 5 A's of negative symptoms. || Alogia, avolition, anhedonia, asociality, affective blunting.
3. What are Bleuler's 4 A's? || Associations, affect, autism, ambivalence.
4. Name six first-rank symptoms. || Thought echo, voices arguing, running commentary, somatic passivity, thought withdrawal/insertion/broadcasting, made actions, delusional perception.
5. Which symptom group best predicts long-term function? || Cognitive (and negative) symptoms.
:::

## 1.3 The duration ladder and other psychotic disorders [core]
| Disorder | Duration | Key point |
|---|---|---|
| Brief psychotic disorder | At least **1 day**, less than **1 month** | Full return to previous functioning. Specify with marked stressor, without stressor, or with peripartum onset |
| Schizophreniform disorder | At least **1 month**, less than **6 months** | Like schizophrenia but shorter; decline in functioning not required. Specify with or without good prognostic features |
| Schizophrenia | At least **6 months** | Including 1 month of active symptoms |

:::mnemonic Day, month, six months
One day to one month: brief. One to six months: schizophreniform. Six months or more: schizophrenia.
:::

### Schizoaffective disorder
:::define Criteria
An uninterrupted illness with a **major mood episode** (depressive or manic) **at the same time** as schizophrenia criterion A; **delusions or hallucinations for at least 2 weeks without a major mood episode** at some point; and mood symptoms present for the **majority** of the total illness. Specify bipolar type or depressive type.
:::
:::trap Schizoaffective versus psychotic mood disorder
In a mood disorder with psychotic features, psychosis occurs **only during** mood episodes. In schizoaffective disorder there is a period of at least 2 weeks of psychosis **without** a mood episode. If mood episodes are only a small part of the illness, it is schizophrenia.
:::

### Delusional disorder
- One or more delusions for **at least 1 month**.
- Schizophrenia criterion A has **never** been met; hallucinations, if present, are not prominent and relate to the delusion.
- Apart from the delusion, functioning is **not markedly impaired** and behaviour is not obviously odd.
- Types: **erotomanic** (someone, often of higher status, loves them), **grandiose**, **jealous** (partner is unfaithful; risk of violence), **persecutory** (commonest), **somatic** (infested, smell, deformed), mixed, unspecified.
- Shared delusions between close family (folie à deux) are now coded here.

### Other diagnoses
- **Substance or medication-induced psychotic disorder**: cannabis, stimulants (amphetamine, cocaine), hallucinogens, alcohol withdrawal and alcoholic hallucinosis, steroids, levodopa.
- **Psychotic disorder due to another medical condition**: epilepsy (temporal lobe), autoimmune encephalitis (anti-NMDA receptor), thyroid disease, SLE, HIV, neurosyphilis, brain tumours, B12 deficiency, Huntington's, Wilson's disease.
- **Schizotypal personality disorder**: odd beliefs, odd speech, few friends; counted in the spectrum.
- **Catatonia**: see Part III.

:::note Acute psychoses in India
Acute, brief psychoses, often with a stressor, confusion-like features or possession beliefs, are relatively common in India and South Asia and often recover well. ICD calls them acute and transient psychotic disorders. Always look for medical causes (fever, infection, substance) first.
:::

:::recall
1. Give the duration ladder. || Brief psychotic: 1 day to 1 month; schizophreniform: 1 to 6 months; schizophrenia: 6 months or more.
2. State the schizoaffective rule. || Mood episode concurrent with criterion A, plus 2 weeks of psychosis without mood episode; mood symptoms for most of the illness.
3. State the criteria for delusional disorder. || Delusion at least a month, criterion A never met, hallucinations not prominent, function not markedly impaired.
4. Name the types of delusional disorder. || Erotomanic, grandiose, jealous, persecutory, somatic, mixed.
5. Name six medical causes of psychosis. || Epilepsy, anti-NMDA encephalitis, thyroid, SLE, HIV, neurosyphilis, tumour, B12, Wilson's.
:::

## 1.4 Red flags for an organic cause [core]
Most psychosis seen in clinics is primary, but missing a medical cause can be fatal. These features should make you **look harder**.

| Red flag | Think of |
|---|---|
| **Confusion, fluctuating consciousness, disorientation** | Delirium (infection, metabolic, drugs, withdrawal) |
| **Visual, tactile or olfactory hallucinations** predominating | Delirium, epilepsy, substances, Lewy body dementia |
| **First episode after 40 to 45** | Brain tumour, stroke, dementia, endocrine |
| **Seizures, abnormal movements, catatonia, autonomic instability** | **Anti-NMDA receptor encephalitis**, other encephalitis |
| Headache, vomiting, focal signs | Space-occupying lesion, raised pressure |
| Recent infection, fever, rash, joint pains | Encephalitis, SLE |
| Rapid cognitive decline, myoclonus | Prion disease |
| Tremor, liver disease, Kayser–Fleischer rings, young age | **Wilson's disease** |
| Weight loss, palpitations or slowness, goitre | Thyroid disease |
| Risk behaviours | HIV, neurosyphilis |
| Substance use, timing linked to use | Substance-induced psychosis |

:::define Anti-NMDA receptor encephalitis
An autoimmune encephalitis, most often in **young women** (sometimes with an **ovarian teratoma**), that starts with **psychiatric symptoms** (anxiety, agitation, psychosis, catatonia) then progresses to **seizures, abnormal movements (especially mouth and face), falling consciousness and autonomic instability**. Diagnosis: antibodies in CSF, EEG, MRI. Treatment: immunotherapy and tumour removal. **Very sensitive to antipsychotics** (can mimic NMS).
:::

### Postpartum psychosis
- Onset usually within **the first 2 weeks** after delivery, often suddenly; about **1 to 2 per 1000** births.
- Confusion, rapidly changing mood (often manic or mixed), delusions about the baby, insomnia, odd behaviour.
- Strongly linked to **bipolar disorder** (personal or family history).
- A **psychiatric emergency**: risk of suicide and infanticide. Admit (ideally to a mother-and-baby unit), treat (antipsychotic, mood stabiliser, ECT is very effective), keep mother and baby together safely when possible.

### Psychosis across the lifespan
- **Childhood-onset schizophrenia** (before 13): rare, severe, more insidious, more neurodevelopmental problems.
- **Late-onset** (after 40) and **very late-onset** (after 60) psychosis: more women, more persecutory delusions and hallucinations, fewer negative symptoms; sensory impairment (hearing loss) and social isolation are risk factors. Lower antipsychotic doses.
- **Psychosis of epilepsy**: ictal, post-ictal (after a cluster of seizures, after a lucid interval) and interictal forms.

:::recall
1. Name five red flags for an organic psychosis. || Confusion, visual or tactile hallucinations, onset after 40, seizures or abnormal movements, focal signs, fever.
2. Describe anti-NMDA receptor encephalitis. || Autoimmune encephalitis in young women, psychosis then seizures, dyskinesias, autonomic instability; ovarian teratoma.
3. When does postpartum psychosis start and what is it linked to? || Within 2 weeks of delivery; bipolar disorder.
4. Name two risk factors for very late-onset psychosis. || Hearing loss, social isolation (female sex).
:::

# Part II · Why it happens and how it runs

## 2.1 Causes [core]
### Epidemiology
- Lifetime prevalence about **0.7%** worldwide.
- Equal overall in men and women, but men start earlier: peak onset about **10 to 25 in men** and **25 to 35 in women**; women have a second smaller peak after 40.
- More common in cities, migrants, people born in late winter or spring, and those with cannabis use.

### Genetics
- Risk rises with genetic closeness: general population about 1%, a sibling or child of a patient about 10%, an identical twin about **50%**.
- The 50% concordance in identical twins proves environment matters too.
- Hundreds of common variants each add a little risk; rare deletions (for example 22q11) add more.

### The dopamine hypothesis
- **Too much dopamine in the mesolimbic pathway** produces positive symptoms. Evidence: amphetamines cause psychosis; all effective antipsychotics block D2 receptors.
- **Too little dopamine in the mesocortical pathway** (to the prefrontal cortex) is linked to negative and cognitive symptoms.
- The modern view: dysregulated dopamine causes **aberrant salience**: ordinary events feel loaded with meaning, which the person then explains with a delusion.

### The glutamate hypothesis
- NMDA receptor blockers (ketamine, PCP) cause positive, negative **and** cognitive symptoms in healthy people.
- Under-active NMDA signalling on inhibitory interneurons may lead secondarily to dopamine excess.
- Anti-NMDA receptor encephalitis can look exactly like first-episode psychosis.

### The neurodevelopmental model
- Early insults (obstetric complications, low birth weight, maternal infection in pregnancy, malnutrition) alter brain development.
- The illness shows itself in adolescence when the brain prunes connections.
- Findings: subtle childhood motor and social differences, enlarged lateral ventricles, reduced grey matter.

### Environment and stress
- **Cannabis**, especially heavy use of strong cannabis in adolescence, raises risk.
- Childhood adversity, migration, urban upbringing, social exclusion.
- **Stress–vulnerability model**: an inherited and developmental vulnerability plus stress crosses a threshold into illness.

:::define Expressed emotion (EE)
The emotional climate in the family, measured as **critical comments, hostility and emotional over-involvement**. Patients returning to high-EE families relapse far more often. Family interventions that lower EE reduce relapse.
:::

:::recall
1. What is the lifetime prevalence of schizophrenia, and the peak onset by sex? || About 0.7%; men 10 to 25, women 25 to 35 (second peak after 40).
2. What is the concordance in identical twins, and what does it show? || About 50%: genes matter but so does environment.
3. Summarise the dopamine hypothesis in two lines. || Mesolimbic excess gives positive symptoms; mesocortical deficit gives negative and cognitive symptoms.
4. What evidence supports the glutamate hypothesis? || NMDA blockers like ketamine and PCP cause positive, negative and cognitive symptoms.
5. Define expressed emotion and its three components. || Family emotional climate: critical comments, hostility, emotional over-involvement.
:::

## 2.2 Course and prognosis [core]
### Phases
1. **Premorbid**: subtle social, motor or cognitive differences.
2. **Prodrome** (months to years): withdrawal, falling school or work performance, odd ideas, suspiciousness, poor self-care, sleep change.
3. **Active phase**: positive symptoms; usually when help is sought.
4. **Residual phase**: negative and cognitive symptoms may persist; relapses occur, often after stopping medicines.

- About 20% have a single episode with good recovery; most have relapses; a proportion have a persistent course.
- People with schizophrenia die 10 to 20 years earlier on average, mainly from heart disease, diabetes and smoking, and suicide (about 5% lifetime).
- Classic WHO studies found **better outcomes in low- and middle-income countries such as India**, perhaps due to family support and social inclusion.

| Good prognosis | Poor prognosis |
|---|---|
| Late onset | Early onset |
| Acute onset | Insidious onset |
| Clear precipitating factor | No precipitant |
| Good premorbid functioning | Poor premorbid functioning |
| Mood symptoms (especially depression) | Negative symptoms, withdrawn |
| Married, good support | Single, divorced, poor support |
| Female | Male |
| Positive symptoms | Neurological signs, history of birth trauma |
| Short duration untreated | Long duration of untreated psychosis |
| No family history | Family history of schizophrenia |
| Good response to treatment | Substance use, frequent relapses |

:::trap Duration of untreated psychosis
The longer psychosis goes untreated, the worse the outcome. Early intervention matters; don't send a first-episode patient away to “see if it settles”.
:::

:::recall
1. List the four phases of schizophrenia. || Premorbid, prodrome, active, residual.
2. Give eight good prognostic factors. || Late and acute onset, precipitant, good premorbid, mood symptoms, married, female, positive symptoms, short untreated duration.
3. Why do people with schizophrenia die early? || Heart disease, diabetes, smoking, suicide.
:::

## 2.3 Assessment and treatment [core]
### First-episode assessment
- Full history with collateral; MSE; risk (suicide, violence, self-neglect, vulnerability to exploitation).
- **Exclude organic and substance causes**: urine drug screen, blood count, glucose, kidney, liver, thyroid, calcium, B12, HIV, VDRL; consider CT or MRI and EEG (atypical features, neurological signs, confusion, late onset); consider autoimmune encephalitis (seizures, fluctuating consciousness, movement disorders).
- Baseline physical health before antipsychotics: weight, BMI, waist, blood pressure, fasting glucose or HbA1c, lipids, ECG, prolactin where relevant.

### Medicines
- **Antipsychotics** are the core. Start low, go slow in first episode (first-episode patients respond to lower doses and are sensitive to side effects).
- Give an adequate trial: about **4 to 6 weeks** at an adequate dose before calling it a failure.
- After a first episode, continue for **at least 1 to 2 years**; after several episodes, often 5 years or long-term.
- **Long-acting injections** for poor adherence or patient preference.
- **Treatment resistance**: failure of at least **two antipsychotics** at adequate dose and duration. **Clozapine** is the treatment, and also reduces suicidal behaviour. Requires blood count monitoring (risk of agranulocytosis), and watch for constipation, myocarditis, seizures, drooling and weight gain.

### Psychosocial care (as important as medicine)
| Intervention | Purpose |
|---|---|
| Psychoeducation | Understanding the illness, warning signs, medicines |
| Family intervention | Lowers expressed emotion; reduces relapse |
| CBT for psychosis | Coping with voices and beliefs; reduces distress |
| Social skills training, supported employment | Function and independence |
| Cognitive remediation | Attention and memory |
| Assertive community treatment | Severe illness, frequent admissions |
| Physical health care | Diet, exercise, smoking cessation, metabolic monitoring |

:::word Talking with a voice-hearer
“That must be frightening. Tell me what the voices say. When do they get louder? What helps?” Neither agree that the neighbours are poisoning him nor argue that they aren't: acknowledge the fear, explore the experience, and offer help with the distress.
:::

:::recall
1. List eight investigations in first-episode psychosis. || Drug screen, blood count, glucose, kidney, liver, thyroid, calcium, B12, HIV, VDRL, imaging, EEG.
2. How long should an antipsychotic trial last before calling it a failure? || About 4 to 6 weeks at an adequate dose.
3. Define treatment resistance and its treatment. || Failure of two adequate antipsychotic trials; clozapine.
4. Name four psychosocial interventions with evidence. || Family intervention, CBTp, psychoeducation, supported employment, social skills, cognitive remediation.
:::

## 2.4 Early intervention and the at-risk mental state [core]
:::define At-risk mental state (clinical high risk)
A young person seeking help with **attenuated psychotic symptoms** (unusual beliefs or perceptions below the threshold of psychosis), **brief limited psychotic episodes** (lasting less than a week and resolving on their own), or **genetic risk with a recent fall in functioning**.
:::
- About **a fifth to a third** go on to psychosis within 2 to 3 years; many others have depression or anxiety.
- Treatment: monitoring, CBT, treating depression and anxiety, stopping cannabis, family support. **Antipsychotics are not routinely given** before psychosis develops.

### Early intervention services
- Aim to cut the **duration of untreated psychosis** and give intensive, youth-friendly care for the first 3 to 5 years: medicine at low doses, CBT, family work, education and employment support, physical health care.
- The "**critical period**" idea: much of the disability develops in the first few years, so this is where help counts most.

### Expressed emotion and family work in depth
| Component of high expressed emotion | Example |
|---|---|
| **Critical comments** | "He's lazy, he just lies around all day." |
| **Hostility** | Rejection: "I'm sick of him; he should go." |
| **Emotional over-involvement** | Excessive worry, self-sacrifice, intrusiveness: "I can't leave him alone for a minute; I've given up my job." |
| (Protective) Warmth and positive remarks | "He tried hard to help with dinner today." |

- High expressed emotion **doubles or triples relapse** risk; more face-to-face contact with high-EE relatives raises it further.
- Family intervention (at least 10 sessions over months): psychoeducation, communication training, problem-solving, reducing criticism, support for carers. **Reduces relapse and admissions**.

:::sounds Reframing for a family
Mother: "He's just lazy. He won't even bathe."
Clinician: "It can look like laziness. Lack of drive is actually one of the symptoms, called negative symptoms. It's not something he chooses. Small, regular routines with praise work better than pushing; let's plan one or two together."
:::

:::recall
1. What are the three types of at-risk mental state? || Attenuated psychotic symptoms, brief limited psychotic episodes, genetic risk with functional decline.
2. Are antipsychotics routinely given in at-risk states? || No.
3. Name the three components of high expressed emotion. || Critical comments, hostility, emotional over-involvement.
4. What does family intervention reduce? || Relapse and admissions.
:::

## 2.5 Talking therapy for voices and beliefs [core]
### CBT for psychosis (CBTp)
- **Engage** around the person's goals ("being able to go to the market without fear"), not around convincing them they are ill.
- **Normalise**: many people hear voices at some point (bereavement, sleep loss, stress); voices are an experience, not a verdict.
- **Map the experience**: when do voices come? What do they say? What do you believe about them? How do you respond?
- **Beliefs about voices** drive distress more than the voices themselves: belief that the voice is **all-powerful (omnipotence)**, **malevolent**, and must be obeyed. Testing these beliefs reduces distress and compliance with commands.
- **Coping strategies**: humming, music, talking to someone, earplug in one ear, focusing attention elsewhere, answering back calmly at set times.
- For delusions: gently explore evidence and alternative explanations; **behavioural experiments**; never argue head-on.

:::trap Arguing makes delusions stronger
Telling a patient "that's impossible, the neighbours aren't poisoning you" usually makes them defend the belief and distrust you. Instead, explore with curiosity: "What makes you think that? What would help you feel safer? Is there any other way to explain it?"
:::

### Rehabilitation and recovery
- **Recovery** means living a meaningful life with or without symptoms: work, relationships, hope, identity beyond illness.
- In India: **day care centres**, half-way homes, vocational training, **supported employment**, self-help groups.
- **Disability certification** under the RPwD Act (mental illness is a benchmark disability at 40% or more, assessed with the **IDEAS** scale) opens access to benefits, pensions and concessions.
- **District Mental Health Programme** and **Tele-MANAS** support community care.

:::recall
1. What drives distress from voices more than the voices themselves? || Beliefs about their power, malevolence and need to obey.
2. Name three coping strategies for voices. || Humming, music, talking to someone, attention focus, earplug.
3. Which scale is used for mental illness disability certification in India? || IDEAS.
4. Define recovery in one line. || A meaningful life, with or without symptoms.
:::

# Part III · Catatonia

## 3.1 Recognising and treating catatonia [core]
:::define Catatonia
A syndrome of marked psychomotor disturbance. DSM-5-TR requires **at least 3 of 12** signs.
:::

| Sign | Meaning |
|---|---|
| Stupor | No psychomotor activity, not relating to surroundings |
| Catalepsy | Passively placed posture held against gravity |
| Waxy flexibility | Slight, even resistance to being positioned |
| Mutism | Little or no speech (not due to aphasia) |
| Negativism | Opposing or not responding to instructions |
| Posturing | Spontaneous, active holding of a posture |
| Mannerism | Odd caricature of normal actions |
| Stereotypy | Repetitive, purposeless movements |
| Agitation | Not influenced by external stimuli |
| Grimacing | |
| Echolalia | Mimicking another's speech |
| Echopraxia | Mimicking another's movements |

:::mnemonic Not just schizophrenia
Catatonia is **most often caused by mood disorders** (especially mania and severe depression), then schizophrenia, then medical conditions (encephalitis, metabolic disturbance, epilepsy) and drugs. DSM codes it as a specifier of another disorder, due to a medical condition, or unspecified.
:::

### Assessment
- Rate with the **Bush–Francis Catatonia Rating Scale**.
- Look for a medical cause: infection, electrolytes, kidney and liver, glucose, CK, EEG (non-convulsive status), brain imaging, autoimmune tests.
- Check food and fluid intake, pressure areas, clots (immobility), and temperature.

### Treatment
1. **Lorazepam challenge**: 1 to 2 mg IV or IM (or oral); improvement within hours supports the diagnosis and is the first-line treatment. Continue regular lorazepam, often at high doses.
2. **ECT** if no response within a few days, or immediately in malignant catatonia. Highly effective.
3. Treat the underlying cause.
4. **Avoid starting high-potency antipsychotics during acute catatonia**: they can worsen it or precipitate neuroleptic malignant syndrome.

:::safety Malignant catatonia
Catatonia with **fever, autonomic instability** (fluctuating BP, fast heart rate) and rising CK is life-threatening and overlaps with neuroleptic malignant syndrome. Stop antipsychotics, give lorazepam, arrange urgent ECT and medical care.
:::

:::recall
1. How many catatonic signs does DSM-5-TR require? Name all 12. || Three; stupor, catalepsy, waxy flexibility, mutism, negativism, posturing, mannerism, stereotypy, agitation, grimacing, echolalia, echopraxia.
2. What is the commonest cause of catatonia? || Mood disorders.
3. Describe the lorazepam challenge. || 1 to 2 mg IV or IM; improvement within hours supports the diagnosis.
4. Why avoid antipsychotics in acute catatonia? || They may worsen it or trigger NMS.
5. What is malignant catatonia? || Catatonia with fever and autonomic instability: an emergency.
:::

# Part IV · Exam zone

## 4.1 Long answer and short notes [core]
:::example Q. Discuss the aetiology, clinical features and management of schizophrenia. (15 marks)
1. Definition; epidemiology (0.7%, onset by sex).
2. Aetiology: genetics (twin concordance), dopamine and glutamate hypotheses, neurodevelopment, cannabis, stress–vulnerability, expressed emotion.
3. Clinical features: positive, negative (5 A's), cognitive; Bleuler and Schneider.
4. DSM-5-TR criteria A to F; duration ladder table; old subtypes in one line.
5. Differential: mood disorders with psychosis, schizoaffective, delusional, substance, organic.
6. Investigations: organic screen, imaging and EEG when indicated, baseline metabolic tests.
7. Management: antipsychotic principles, duration, LAIs, clozapine; psychosocial interventions; physical health.
8. Course and prognosis table; better outcome in India.
:::

:::word Short note: expressed emotion
Expressed emotion is the emotional climate of a patient's family, assessed with the Camberwell Family Interview as critical comments, hostility and emotional over-involvement. Patients with schizophrenia living with high-EE relatives relapse significantly more, especially with long face-to-face contact and without medication. Family interventions combining psychoeducation, communication and problem-solving skills reduce EE and relapse. EE is a predictor of relapse, not a cause of schizophrenia, and families should never be blamed.
:::

:::word Short note: catatonia
A psychomotor syndrome diagnosed by at least three of twelve signs: stupor, catalepsy, waxy flexibility, mutism, negativism, posturing, mannerism, stereotypy, agitation, grimacing, echolalia and echopraxia. Most often due to mood disorders, then schizophrenia and medical causes. Rated with the Bush–Francis scale; a lorazepam challenge both supports the diagnosis and treats it; ECT is used for non-response or malignant catatonia. Antipsychotics are avoided acutely because of the risk of NMS.
:::

## 4.2 Viva rapid-fire [core]
:::viva
How many A symptoms for schizophrenia, and what must one of them be? :: Two; at least one of delusions, hallucinations or disorganised speech.
Total duration for schizophrenia? :: At least 6 months, including 1 month of active symptoms.
Duration of brief psychotic disorder? :: At least 1 day, less than 1 month.
Duration of schizophreniform disorder? :: 1 to 6 months.
Key rule for schizoaffective disorder? :: 2 weeks of psychosis without a mood episode, and mood symptoms for most of the illness.
Minimum duration of delusional disorder? :: One month.
The 5 A's of negative symptoms? :: Alogia, avolition, anhedonia, asociality, affective blunting.
Bleuler's 4 A's? :: Associations, affect, autism, ambivalence.
Lifetime prevalence of schizophrenia? :: About 0.7%.
Concordance in identical twins? :: About 50%.
Which pathway is linked to positive symptoms? :: Mesolimbic dopamine excess.
Which drugs support the glutamate hypothesis? :: Ketamine and PCP (NMDA blockers).
Three components of expressed emotion? :: Critical comments, hostility, emotional over-involvement.
Definition of treatment-resistant schizophrenia? :: Failure of two adequate antipsychotic trials.
Treatment for resistance and suicidality? :: Clozapine.
Main blood risk with clozapine? :: Agranulocytosis (low neutrophils).
How many catatonic signs are needed? :: Three of twelve.
Commonest cause of catatonia? :: Mood disorders.
First-line treatment of catatonia? :: Lorazepam; ECT if no response.
A medical cause that mimics first-episode psychosis? :: Anti-NMDA receptor encephalitis.
Autoimmune encephalitis mimicking psychosis in young women? :: Anti-NMDA receptor encephalitis.
Tumour associated with it? :: Ovarian teratoma.
Postpartum psychosis onset? :: Usually within 2 weeks of delivery.
Postpartum psychosis is linked to? :: Bipolar disorder.
Risk factor for very late-onset psychosis? :: Hearing loss.
Proportion of at-risk youth developing psychosis in 2 to 3 years? :: About a fifth to a third.
Three components of high expressed emotion? :: Critical comments, hostility, emotional over-involvement.
What drives distress from voices? :: Beliefs about the voices.
Indian disability scale for mental illness? :: IDEAS.
:::

## 4.3 Module test [core]
:::mcq
Q: A 22-year-old has heard voices and believed he is being followed for 3 months, with no mood episode. Most likely diagnosis now:
- Brief psychotic disorder
- *Schizophreniform disorder
- Schizophrenia
- Delusional disorder
> One to six months is schizophreniform.

Q: Psychosis that started after a family death and fully resolved within 3 weeks is:
- Schizophreniform disorder
- *Brief psychotic disorder with marked stressor
- Adjustment disorder
- Delusional disorder
> At least 1 day, under 1 month, full recovery.

Q: Which is NOT a negative symptom?
- Alogia
- Avolition
- *Thought broadcasting
- Asociality
> Thought broadcasting is a positive (first-rank) symptom.

Q: A man has believed for a year that his wife is unfaithful, checks her phone constantly, but works normally and has no hallucinations. Diagnosis:
- Schizophrenia
- *Delusional disorder, jealous type
- OCD
- Paranoid personality disorder
> A single fixed delusion with preserved functioning.

Q: A patient has had psychosis for 2 years with depressive episodes covering most of that time, and one 3-week period of voices without depression. Diagnosis:
- Major depression with psychotic features
- Schizophrenia
- *Schizoaffective disorder, depressive type
- Brief psychotic disorder
> Psychosis without mood for 2 weeks plus mood episodes for most of the illness.

Q: The concordance for schizophrenia in identical twins is about:
- 10%
- 25%
- *50%
- 90%
> Shows both genes and environment matter.

Q: Positive symptoms are best linked to:
- Mesocortical dopamine deficit
- *Mesolimbic dopamine excess
- Nigrostriatal dopamine excess
- Tuberoinfundibular dopamine excess
> Mesolimbic excess; mesocortical deficit relates to negative and cognitive symptoms.

Q: Which is a good prognostic factor in schizophrenia?
- Insidious onset
- *Clear precipitating stressor
- Prominent negative symptoms
- Early onset in a male
> Acute onset with a precipitant predicts better outcome.

Q: Relapse in schizophrenia is most strongly predicted by living with relatives who show:
- Low contact
- *High expressed emotion
- Introversion
- High education
> Criticism, hostility and over-involvement.

Q: Treatment-resistant schizophrenia is treated with:
- Haloperidol at a higher dose
- *Clozapine
- Lithium alone
- ECT only
> After failure of two adequate antipsychotic trials.

Q: A patient lies motionless, mute, holds odd postures and resists being moved. First step:
- Start haloperidol injection
- *Lorazepam challenge and medical work-up
- Wait for spontaneous recovery
- Start an SSRI
> Benzodiazepines first; avoid antipsychotics acutely.

Q: Catatonia is most often caused by:
- Schizophrenia
- *Mood disorders
- Head injury
- Personality disorder
> Mania and severe depression are commonest.

Q: A 19-year-old with first-episode psychosis also has seizures and fluctuating consciousness. Which must be excluded?
- Social anxiety
- *Autoimmune (anti-NMDA receptor) encephalitis
- Dysthymia
- Malingering
> It can mimic psychosis and needs urgent neurology.

Q: Duration of untreated psychosis is important because:
- It has no effect
- *Longer untreated psychosis predicts worse outcome
- It predicts better recovery
- It only matters in older patients
> Early intervention improves outcomes.

Q: A 24-year-old woman develops anxiety and psychosis, then seizures, mouth dyskinesias and fluctuating BP. The most likely diagnosis is:
- Schizophrenia
- NMS
- *Anti-NMDA receptor encephalitis
- Conversion disorder
> Look for an ovarian teratoma.

Q: Ten days after delivery, a woman with a family history of bipolar disorder is confused, elated and says her baby is the devil. The best action is:
- Reassure: baby blues
- Outpatient review in a month
- *Urgent admission as a psychiatric emergency
- Start an SSRI alone
> Risk to mother and baby.

Q: A mother says, "I can't leave him alone even for a minute; I've given up everything." This is:
- Critical comments
- Hostility
- *Emotional over-involvement
- Warmth
> A component of high expressed emotion.

Q: In CBT for psychosis, distress from command voices is most reduced by:
- Arguing that voices don't exist
- *Testing beliefs about the voices' power and need to obey
- Avoiding all discussion of voices
- Increasing benzodiazepines
> Beliefs drive distress and compliance.
:::
`;
