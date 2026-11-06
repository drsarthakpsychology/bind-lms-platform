/* Module · Writing the case sheet and formulation, Parts III and IV (Advanced level and exam zone). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part III · Advanced: synthesis, plans, records and a full case sheet

## 3.1 The summary and the formulation [core][advanced]
### The summary
A summary is **one paragraph** that lets a busy reader understand the case in thirty seconds: who the person is, the main problems with duration and course, key positives and negatives from history and MSE, and risk.

:::example A summary paragraph
"Mr S, 34, married shopkeeper from Kanpur, presents with five months of insidious, progressive low mood following a robbery at his shop, with anhedonia, early morning awakening, 6 kg weight loss, ideas of being a burden and a passive death wish ten days ago. No past elevated mood, psychosis or regular substance use. MSE: depressed affect, psychomotor slowing, ideas of worthlessness, passive death wishes without current plan; insight partial. Risk moderate."
:::

### The formulation
A **diagnosis** says what the person has in common with others. A **formulation** explains what is **unique** about this person: why this problem, in this person, at this time, and what keeps it going. It turns information into a plan.

### The 5P grid
The most widely taught structure crosses five Ps with three domains.

| | Biological | Psychological | Social |
|---|---|---|---|
| **Presenting problem** | The main problems in one line | | |
| **Predisposing** (why this person?) | Family history, temperament, early illness | Early adversity, attachment, core beliefs, personality traits | Poverty, migration, discrimination |
| **Precipitating** (why now?) | Childbirth, a new medicine, a substance binge, physical illness | A loss or humiliation that hits a core belief | Job loss, exams, marital conflict |
| **Perpetuating** (why does it continue?) | Poor adherence, ongoing substance use, untreated thyroid | Avoidance, rumination, hopelessness | Ongoing conflict, isolation, debt, stigma |
| **Protective** (what helps?) | Good physical health, past response to treatment | Insight, coping skills, motivation | Supportive family, job, faith, community |

:::analogy A fire
Predisposing factors are dry wood. Precipitating factors are the match. Perpetuating factors are the wind that keeps it burning. Protective factors are the water nearby. The plan works on all four.
:::

:::widget sort
{
  "prompt": "Sort each factor in Mr S's story into the right P.",
  "buckets": ["Predisposing", "Precipitating", "Perpetuating", "Protective"],
  "items": [
    { "text": "Mother treated for depression", "bucket": 0 },
    { "text": "Robbery at his shop", "bucket": 1 },
    { "text": "Staying at home and not opening the shop, so income and confidence keep falling", "bucket": 2 },
    { "text": "A supportive wife who brought him for help", "bucket": 3 },
    { "text": "A lifelong belief that 'a man must provide or he is worthless'", "bucket": 0, "why": "A long-standing core belief is a psychological predisposing factor; the robbery activated it." },
    { "text": "Debt to a moneylender taken after the robbery", "bucket": 2 },
    { "text": "Responded well to treatment in a past episode", "bucket": 3 }
  ]
}
:::

### Writing it as a narrative
Examiners and good clinicians prefer a short narrative that links the factors, not just a filled grid.

:::widget worked
{
  "title": "From grid to narrative formulation",
  "steps": [
    { "q": "Start with the person and the problem.", "a": "Mr S is a 34-year-old shopkeeper presenting with a moderate depressive episode." },
    { "q": "Add vulnerability.", "a": "He may be biologically vulnerable, given his mother's depression, and psychologically vulnerable through a long-held belief that his worth depends on providing for his family." },
    { "q": "Add the trigger and why it mattered to him.", "a": "The robbery threatened exactly this belief, triggering shame and hopelessness." },
    { "q": "Add the maintaining cycle.", "a": "Withdrawal from the shop reduced income and contact, which confirmed his belief that he is a failure and deepened his low mood; debt adds ongoing stress." },
    { "q": "Add strengths and the plan link.", "a": "His supportive wife, his previous good response to treatment and his help-seeking are strengths. The plan therefore combines an antidepressant, behavioural activation with a graded return to the shop, work on his beliefs about worth, and help with debt, with risk monitoring." }
  ],
  "yourTurn": [
    { "q": "Ms T, 19 (OCD and low mood): predisposing anxious temperament and a perfectionist father; precipitated by first-year exams; perpetuated by rituals that relieve anxiety briefly and by the family doing her washing to 'help'; protective: insight, motivation, a supportive mother. Write a three-sentence narrative.", "a": "Ms T, 19, presents with obsessive-compulsive disorder and secondary low mood. An anxious temperament and high standards modelled in the family made her vulnerable, and the pressure of first-year exams triggered contamination fears. Rituals and family accommodation give short-term relief but keep the cycle going; her good insight, motivation and supportive mother are strengths, so the plan centres on exposure and response prevention with family work to reduce accommodation." }
  ]
}
:::

:::clinician
Several formulation models suit different purposes: the 5P model (descriptive and integrative); the cognitive-behavioural longitudinal formulation (early experience, core beliefs, rules, critical incident, maintenance cycle); the psychodynamic formulation (see Psychodynamics in depth, Section 3.1); the biopsychosocial grid (Engel); and the "4P plus cultural" model adding explanatory models and cultural identity. Research on formulation reliability shows good agreement for descriptive elements and poorer agreement for inferential mechanisms (Kuyken and colleagues, Behaviour Research and Therapy 2005), which argues for collaborative formulation with the patient and explicit evidence for each link. Keep formulation hypotheses testable ("if avoidance maintains low mood, graded activity should improve it") and revise them at review.
:::

:::recall
1. What is the difference between a diagnosis and a formulation? || A diagnosis groups a person with others who share features; a formulation explains this person's problem: why them, why now, what maintains it and what helps.
2. Name the five Ps. || Presenting, predisposing, precipitating, perpetuating, protective.
3. What three domains cross the five Ps? || Biological, psychological, social.
4. What makes a narrative formulation better than a filled grid? || It links the factors into an explanation that leads to the plan.
:::

:::mcq
Q: A patient's continued cannabis use that worsens his paranoia is a:
- Predisposing factor
- Precipitating factor
- *Perpetuating factor
- Protective factor
> It keeps the illness going.

Q: The main purpose of a formulation is to:
- Replace the diagnosis
- *Explain this person's problem in a way that guides treatment
- List all symptoms
- Satisfy insurance
> Formulation links understanding to the plan.
:::

## 3.2 Differential and provisional diagnosis [core][advanced]
### How to reason
1. **Describe the syndrome**: what pattern of symptoms is present (for example a manic syndrome with psychotic features)?
2. **List what can cause it**, in a set order:
   - **Organic** (medical and neurological causes)
   - **Substance-induced**
   - **Primary psychiatric** disorders, from most to least likely
   - **Personality** factors and **no disorder** (normal reaction)
3. For each, write **points for** and **points against**.
4. Choose the **provisional diagnosis** with its classification code.

:::mnemonic The diagnostic ladder: "Organic, Substance, Psychotic, Mood, Anxiety, Personality"
Climb from the causes you must never miss (organic, substance) to those that are common, then to personality and normal reactions.
:::

:::example A differential, written properly
**Syndrome**: acute onset of elevated mood, overactivity, reduced need for sleep, grandiose and religious delusions, over about a month.
1. **Bipolar I disorder, current episode manic, with mood-congruent psychotic features**: for: classic manic syndrome, past depressive episode with a brief elevation on an antidepressant, maternal uncle with bipolar disorder. Against: none major.
2. **Substance-induced manic episode**: for: young age. Against: no substance use reported by patient or family; urine screen negative.
3. **Mania due to a medical condition** (thyroid, steroid use, encephalitis, neurological illness): for: first manic episode. Against: no medical history or medicines, normal examination and thyroid function; no neurological signs.
4. **Schizoaffective disorder**: against: psychotic symptoms occur only during the mood episode.
5. **Acute and transient psychotic disorder**: against: a full manic syndrome dominates.
**Provisional diagnosis**: Bipolar I disorder, current episode manic, severe, with mood-congruent psychotic features (DSM-5-TR); ICD-11 6A60.2 bipolar type I disorder, current episode manic, with psychotic symptoms.
:::

:::widget decide
{
  "scene": "Mr J, 62, a retired railway officer in Nagpur, has developed suspiciousness, visual hallucinations of children in the room and fluctuating confusion over three days. The trainee's differential lists 'late-onset schizophrenia, delusional disorder, psychotic depression'.",
  "ask": "What is wrong with this differential?",
  "choices": [
    { "label": "Nothing; these are the common late-life psychoses", "verdict": "harm", "outcome": "A urinary infection with delirium is missed for two days; he falls and fractures his hip.", "why": "Acute onset, fluctuating consciousness and visual hallucinations in an older adult point first to delirium. Organic causes must come first." },
    { "label": "It skips the organic and substance causes: delirium (infection, medicines, metabolic), Lewy body dementia, alcohol or sedative withdrawal must be listed first and investigated", "verdict": "best", "outcome": "Urine culture shows infection; antibiotics and supportive care clear the confusion.", "why": "Always climb the ladder from organic and substance causes. Fluctuation and new visual hallucinations are red flags." },
    { "label": "Add personality disorder", "verdict": "ok", "outcome": "Irrelevant to the acute picture.", "why": "Personality is the last rung, not the missing one here." }
  ]
}
:::

:::clinician
Indian clinical records commonly code in ICD-10 for administrative purposes and in DSM-5-TR or ICD-11 for teaching; ICD-11 became the WHO reporting standard in 2022, and Indian transition is under way as of Nov 2026, so write the system you used. Use the "provisional" label honestly and revisit after investigations and observation; diagnostic revision at follow-up is common in first-episode psychosis (a substantial minority of initial diagnoses change over the first two years). Hierarchical rules matter: substance-induced and medical causes take priority; schizoaffective disorder requires psychotic symptoms for at least two weeks without prominent mood symptoms (DSM-5-TR); acute and transient psychotic disorder in ICD-11 resolves within three months. List the evidence that would change your mind, which shows examiners and colleagues that you think in probabilities.
:::

:::recall
1. In what order should causes be listed in a differential? || Organic, substance-induced, primary psychiatric (most likely first), personality, and no disorder.
2. What should be written for each differential? || Points for and points against.
3. Why label a diagnosis "provisional"? || It is the best current judgement, to be revised with investigations and observation.
:::

:::mcq
Q: In an older adult with acute, fluctuating confusion and visual hallucinations, the first diagnosis to consider is:
- Late-onset schizophrenia
- *Delirium
- Personality disorder
- Generalised anxiety disorder
> Organic causes first.

Q: A differential diagnosis entry should include:
- Only the name of the condition
- *The condition with points for and against
- The treatment only
- The family's preferred diagnosis
> Reasoning must be visible.
:::

## 3.3 The management plan, risk and legal documentation [core][advanced]
### A biopsychosocial plan in two time frames
| | Immediate (now to the next few days) | Short to long term |
|---|---|---|
| **Biological** | Safety, medicines with dose and reason, managing withdrawal, investigations | Continuation and maintenance treatment, monitoring, physical health |
| **Psychological** | Psychoeducation, crisis support, safety planning | Specific therapy (CBT, IPT, family therapy), relapse prevention |
| **Social** | Who will stay with the patient, leave from work or college, removing means of harm | Work or study return, housing, finances, disability benefits, support groups |

Each item should say **what, who, when** and **how we will know it is working**.

### Risk: write a formulation, not just a rating
"Low, medium or high" on its own is not enough. Write:
1. **What** the risk is: to self (suicide, self-harm, neglect), to others (violence), from others (exploitation, abuse), and other risks (driving, wandering, financial).
2. **Static factors**: history, demographics.
3. **Dynamic factors**: current symptoms, substance use, stressors that can change.
4. **Protective factors**.
5. **Current state**: plan, intent, access to means.
6. **What would make it worse or better.**
7. **Plan**: who does what, safety plan given to patient and family, follow-up date, crisis numbers.

:::widget decide
{
  "scene": "At 11 pm in an emergency department in Delhi, Ms Y, 22, has taken ten paracetamol tablets after a fight with her partner. Medically she is now fit. She says, 'I won't do it again.' Your colleague writes: 'Low risk. Discharge.'",
  "ask": "What should the risk entry say?",
  "choices": [
    { "label": "Leave it as 'Low risk. Discharge.'", "verdict": "harm", "outcome": "She is discharged alone at midnight, returns home where the partner is, and takes a larger overdose.", "why": "A single rating hides the reasoning, ignores dynamic factors and gives no plan. Self-harm is a strong predictor of future self-harm and suicide." },
    { "label": "Document the act, intent, circumstances, current thoughts and plans, static and dynamic risk and protective factors, a collaboratively written safety plan, who she will be with tonight, removal of medicines at home, and a follow-up appointment within a few days", "verdict": "best", "outcome": "She goes to her sister's home with a written safety plan; she attends follow-up and starts therapy.", "why": "A risk formulation with a concrete plan is safer and more defensible than a rating. Guidelines advise against relying on risk scales to decide discharge." },
    { "label": "Admit her compulsorily to be safe", "verdict": "ok", "outcome": "She feels punished and is less likely to disclose next time.", "why": "Admission may be needed in some cases, but it should follow from an assessment and her capacity and wishes, not be a default." }
  ]
}
:::

### Documentation the law expects (Mental Healthcare Act 2017)
- **Capacity**: for treatment decisions, record that the person can understand the information, appreciate its consequences, and communicate a decision (section 4 sets these out). Capacity is decision-specific and can change.
- **Informed consent**: what was explained (benefits, risks, alternatives), in which language, and the person's decision.
- **Advance directive** and **nominated representative**, if any, with details.
- **Type of admission**: independent (section 86) or supported (section 89, and section 90 for longer stays), and the assessments that support it.
- **Restraint**: only when necessary to prevent imminent harm, for the shortest time, with reasons, monitoring and review recorded (section 97).
- **Information to the patient** about their rights.

:::clinician
NICE guidance on self-harm (NG225, 2022) states that risk assessment tools and scales should not be used to predict future suicide or self-harm or to determine who is offered treatment or discharged; instead, assess needs and risks holistically and formulate. Indian practice increasingly follows this. The Stanley–Brown Safety Planning Intervention has trial evidence for reducing suicidal behaviour after emergency department visits. Under the MHCA, supported admission (section 89) is for up to 30 days, with section 90 for continued stays beyond 30 days with a higher threshold and Mental Health Review Board oversight; emergency treatment under section 94 is limited to 72 hours. Record the nominated representative's involvement and the patient's own expressed wishes even when they lack capacity. Write medicines in full with dose, route, frequency and the reason, and avoid ambiguous abbreviations (for example write "units" and "micrograms" in full).
:::

:::recall
1. What three domains and two time frames structure a management plan? || Biological, psychological, social; immediate and short-to-long term.
2. What seven elements make a risk formulation? || Type of risk, static factors, dynamic factors, protective factors, current state (plan, intent, means), what would change it, and the plan.
3. What three abilities show capacity under the MHCA? || Understanding information, appreciating consequences, and communicating a decision.
4. What must be recorded about restraint? || That it was necessary for imminent harm, for the shortest time, with reasons, monitoring and review.
:::

:::mcq
Q: Under the MHCA 2017, independent admission is under:
- Section 23
- *Section 86
- Section 94
- Section 115
> Section 86.

Q: Guidelines advise that risk scales should:
- Decide who is discharged
- *Not be used alone to predict suicide or to decide treatment; use a full assessment and formulation instead
- Replace interviews
- Be given only to men
> Scales have poor predictive value for individuals.
:::

## 3.4 Progress notes, discharge summaries and letters [core][advanced]
### Progress notes: SOAP
- **S (Subjective)**: what the patient and family report since the last note, in their words.
- **O (Objective)**: your MSE today, vitals, ward observations, investigation results, rating scale scores.
- **A (Assessment)**: your interpretation: better, same, worse; response to treatment; side effects; current risk.
- **P (Plan)**: changes and next steps, with who and when.

:::widget worked
{
  "title": "Writing a SOAP note on day five of admission",
  "steps": [
    { "q": "Information: Ms P (mania) slept six hours last night (nurses' chart); says 'I feel calmer, but I still have a mission from God'; ate all meals; YMRS 24 (was 38 on admission); mild stiffness of arms; no aggression; mother visited, no conflict. Lithium level 0.7 yesterday. Write S and O.", "a": "S: Pt says she feels 'calmer' but maintains she has 'a mission from God'. Mother reports she was calm during her visit. O: Slept about six hours (nursing chart). Ate all meals. Less overactive; speech still rapid but interruptible. Grandiose religious delusion persists, less preoccupied. YMRS 24 (38 on admission). Mild cogwheel rigidity at both elbows. Serum lithium 0.7 mmol/L." },
    { "q": "Write A and P.", "a": "A: Manic episode improving (YMRS down by about a third); psychotic features persisting; mild drug-induced parkinsonism; no current risk to self or others. P: Continue lithium at the current dose; reduce antipsychotic slightly given rigidity and improvement; repeat lithium level in five days; continue psychoeducation with patient and mother; review in 24 hours." }
  ],
  "yourTurn": [
    { "q": "Write a brief SOAP note: Mr S (depression), outpatient review a month after starting sertraline. He says 'sleep is better, mood a little better'; wife says he opened the shop three days last week; PHQ-9 down from 19 to 12; nausea gone; denies death wishes now; plan agreed to increase activity.", "a": "S: Reports better sleep and slightly improved mood; wife reports he worked three days last week. O: Brighter affect, normal speech rate; no death wishes or plans; PHQ-9 12 (19 at baseline); no side effects. A: Partial response; risk reduced. P: Continue sertraline; increase behavioural activation (shop five days, one social visit); review in a month or earlier if worse." }
  ]
}
:::

### The discharge summary
Write it so the next clinician (often a general practitioner far away) can continue care safely:
1. Identification, dates of admission and discharge, type of admission.
2. Reason for admission and presenting problems.
3. Diagnosis (provisional and final), with codes.
4. Key findings: investigations, MSE at admission and discharge.
5. Treatment given and response, including side effects.
6. Risk at discharge and plan.
7. **Medicines at discharge**: name, dose, timing, duration, and any that were stopped and why.
8. Follow-up: when, where, with whom; monitoring needed (for example lithium levels).
9. Advice given to patient and family; warning signs of relapse; crisis contacts.
10. Name, signature, registration.

### Referral letters
State clearly **who** you are, **who** the patient is, **what question** you want answered, the relevant background, current medicines and allergies, and urgency. One question per referral, clearly put, gets the best answer.

:::widget decide
{
  "scene": "You are writing a discharge summary for Mr J (delirium, now resolved) to his general practitioner in a small town near Nagpur. The ward plan is to stop the haloperidol given during admission.",
  "ask": "What must the medicines section include?",
  "choices": [
    { "label": "List only the medicines to continue", "verdict": "ok", "outcome": "The GP's old notes still show haloperidol; it is restarted by mistake at the next visit.", "why": "Medicines stopped, and why, must also be stated to prevent accidental restarting." },
    { "label": "List each medicine to continue with dose and timing, and state clearly that haloperidol was given only for delirium, has been stopped, and should not be restarted without review", "verdict": "best", "outcome": "The GP understands the plan and the haloperidol is not restarted.", "why": "Medicine reconciliation at discharge prevents errors, especially in older adults." },
    { "label": "Write 'continue same medicines'", "verdict": "harm", "outcome": "No one knows which medicines are meant; errors follow.", "why": "Vague instructions are dangerous." }
  ]
}
:::

:::clinician
Progress notes in inpatient units should record MHCA-relevant events in real time (capacity reviews, restraint, rights information, Mental Health Review Board communications). For psychotherapy, keep a separate, minimal therapy note (date, attendance, themes, interventions, risk, plan) distinct from process notes; in India there is no separate legal protection for psychotherapy notes as in some US jurisdictions, so write as if the patient (who has a right of access under section 25) or a court may read them. Discharge summaries are among the most important safety documents in care transitions; audits show missing medication changes are the commonest serious omission. Use plain language for the patient copy. When writing to schools or employers, give only the information needed for the purpose, with the patient's consent.
:::

:::recall
1. What do the letters of SOAP stand for? || Subjective, Objective, Assessment, Plan.
2. List the ten parts of a discharge summary. || Identification and dates; reason for admission; diagnosis; key findings; treatment and response; risk and plan; discharge medicines including stopped ones; follow-up and monitoring; advice and warning signs; signature.
3. What makes a good referral letter? || A clear question, relevant background, medicines and allergies, urgency, and who you are.
:::

:::mcq
Q: In a SOAP note, a YMRS score belongs under:
- Subjective
- *Objective
- Assessment
- Plan
> Measured findings are objective.

Q: The most common serious omission in discharge summaries is:
- The patient's religion
- *Changes to medicines (including those stopped)
- The weather
- The family tree
> Medicine reconciliation is critical.
:::

## 3.5 Special case records [core][advanced]
The core structure stays the same, but some groups need extra headings.

### Child and adolescent case sheet
- **Informants**: parents, teachers (school reports), sometimes grandparents; the child's own account at an age-appropriate level.
- **Detailed birth and developmental history**: pregnancy (infections, medicines, alcohol), birth (term, weight, cry, NICU), milestones in each domain.
- **School history**: grades, attendance, teacher concerns, learning difficulties, peer relationships, bullying.
- **Family functioning and parenting**: discipline style, conflicts, screen time, routines.
- **Temperament** and play.
- **Safeguarding**: any concern about abuse or neglect, and actions taken (POCSO reporting where required).
- **Observation of play and interaction** as part of the MSE.

### Older adult case sheet
- **Functional status**: activities of daily living (bathing, dressing, eating, toileting) and instrumental activities (money, medicines, cooking, phone, transport).
- **Cognitive history** from an informant: what has changed, when, how fast.
- **Falls, sensory loss** (vision, hearing), continence.
- **Full medicine list** including over-the-counter and herbal remedies (anticholinergic burden).
- **Carer** situation and strain; capacity for specific decisions (finances, property, will).
- **Elder abuse** screening.

### Substance use case sheet
- Detailed substance history for each substance (Section 2.2), **readiness to change**, **withdrawal risk and history** (seizures, delirium tremens), **complications** (liver, nerves, injecting risks, HIV and hepatitis C), and **legal issues**.

### The clinical psychology case record
A psychologist's record often adds:
- **Referral question** and reason for psychological work.
- **Psychological assessment**: tests used, scores with ranges, interpretation (see the Assessment module).
- **Psychological formulation** (for example a CBT longitudinal formulation).
- **Therapy goals** agreed with the client, the therapy plan, number and type of sessions.
- **Session notes**: date, attendance, content themes, interventions, homework, risk, outcome measures.
- **Termination summary**: what was achieved, what remains, relapse prevention.

### Medicolegal records
In any case that may go to court (assault, accidents, custody, criminal responsibility, disability claims): record times exactly, quote statements word for word, describe injuries objectively, note who was present, keep originals safe, and avoid opinions beyond your evidence.

:::widget sort
{
  "prompt": "Which special record needs this heading most?",
  "buckets": ["Child and adolescent", "Older adult", "Substance use", "Clinical psychology", "Medicolegal"],
  "items": [
    { "text": "Instrumental activities of daily living", "bucket": 1 },
    { "text": "Teacher's report and school attendance", "bucket": 0 },
    { "text": "History of withdrawal seizures and delirium tremens", "bucket": 2 },
    { "text": "Agreed therapy goals and session-by-session outcome measures", "bucket": 3 },
    { "text": "Exact times and word-for-word quotes of statements", "bucket": 4 },
    { "text": "Anticholinergic burden of all medicines", "bucket": 1 }
  ]
}
:::

:::clinician
Child records must reflect the Juvenile Justice Act 2015 and POCSO Act 2012 duties (mandatory reporting of sexual offences against children under section 19, with penalties for failure under section 21), as well as consent from guardians and the child's assent. For older adults, record capacity assessments for specific decisions (treatment, finances, property) and the evidence for them; disputes about wills and property transfers often reach courts years later and rely on contemporaneous notes. In substance use services, the NDPS Act 1985 and its rules govern opioid substitution therapy records (buprenorphine and methadone dispensing). Psychology session notes should include routine outcome measures (for example PHQ-9, GAD-7, CORE-10), which improve outcomes when fed back to therapists (Lambert's feedback research).
:::

:::recall
1. What extra headings does a child case sheet need? || Detailed birth and development, school history, family functioning and parenting, temperament and play, safeguarding, play observation.
2. What extra headings does an older adult case sheet need? || ADLs and IADLs, informant cognitive history, falls and sensory loss, full medicine list including herbal remedies, carer situation, capacity, elder abuse screening.
3. What does a clinical psychology record add? || Referral question, assessment results, psychological formulation, therapy goals and plan, session notes with outcome measures, termination summary.
:::

:::mcq
Q: Managing money and taking medicines independently are examples of:
- Basic activities of daily living
- *Instrumental activities of daily living
- Premorbid personality
- MSE findings
> IADLs.

Q: In a medicolegal record, statements should be recorded:
- In your own summary words only
- *Word for word, with exact times and who was present
- Only if the patient agrees with your view
- Only after the trial
> Accuracy is essential for legal use.
:::

## 3.6 A complete sample case sheet [core][advanced]
This is a full case sheet for one patient, written as you would for a postgraduate exam. Read it alongside the earlier sections; each part uses the rules you have learned.

:::example 1. Identification data
Ms P, 26, female, unmarried, Hindu, BCom graduate, accounts assistant in a textile firm, lower-middle socioeconomic status (modified Kuppuswamy class III), urban Surat, Gujarati and Hindi speaking. Brought by parents to the psychiatry emergency on GP referral. Date of assessment recorded; interview in Gujarati and Hindi, no interpreter.
:::

:::example 2. Informants
(1) Patient: unreliable for recent events because of illness and lack of insight; adequate for personal history. (2) Mother, 52, homemaker, lives with the patient: reliable and adequate. (3) Father, 58, shop owner, lives with the patient but works long hours: reliable, partly adequate.
:::

:::example 3. Chief complaints
Per mother (in order of onset): (1) Reduced sleep, about one month. (2) Talking excessively and very fast, about 20 days. (3) Spending money and giving away belongings, about 15 days. (4) Says she is a goddess with a mission, about 10 days. (5) Angry and aggressive when stopped, about 5 days.
Patient: “Mujhe kuch nahi hua, main bahut khush hoon. Bhagwan ne mujhe ek kaam diya hai” (Nothing is wrong with me, I am very happy. God has given me a task).
:::

:::example 4. History of present illness
The patient was apparently well until about one month ago. The illness began acutely, about a week after a family wedding at which she slept very little for several nights, and progressed rapidly. She first began sleeping only three to four hours a night without feeling tired, then cleaned and rearranged the house at night. Over the next days she became unusually cheerful and talkative, speaking rapidly and jumping between topics, made many phone calls, and started several plans (opening a boutique, writing a book). For about 15 days she has spent about 40,000 rupees from her savings on clothes and gifts and given away jewellery to neighbours. For about 10 days she has said she is an avatar of a goddess with a mission to save the city, and that she can understand what birds are saying to her. For about 5 days she has become irritable and shouted at and pushed her father when he took her phone. She dresses in bright colours and heavy makeup, unlike her usual style. She has been going out late at night alone and has talked to strangers about her mission, which worries the family.
**Biological functions**: sleep three to four hours; appetite reduced (too busy to eat); weight loss of about 2 kg per mother; libido possibly increased (she has messaged a former colleague repeatedly); menstrual cycle regular, last period two weeks ago.
**Negative history**: no substance use (confirmed by family); no recent medicines or steroids; no fever, headache, seizures, head injury or medical illness; no hallucinations apart from the claim of understanding birds; no first-rank symptoms; no suicidal ideas.
**Impact**: stopped going to work for two weeks; conflict at home.
**Treatment so far**: taken to a local temple for blessings; GP gave a sleeping tablet (name not known) for two nights without benefit, then referred.
:::

:::example 5. Past history
At 21, after her final-year exams, she had a depressive episode of about four months (low mood, crying, poor sleep, staying in her room), treated by a GP with escitalopram 10 mg for about three months. Her mother recalls that about a month after starting it she was “too happy and active for a week”, spending on friends and sleeping little, which settled on its own; it was not reported to the doctor. No past admissions. No medical or surgical illness. No known drug allergies.
:::

:::example 6. Treatment history
Escitalopram 10 mg daily for about three months at age 21: good response; possible antidepressant-associated hypomanic symptoms within a month of starting; stopped by herself once well. Sleeping tablet for two nights this month: no benefit. No ECT, no psychotherapy. Traditional: temple visits.
:::

:::example 7. Substance use history
No alcohol, tobacco, cannabis or other substances (patient and both parents agree). Drinks two to three cups of tea daily.
:::

:::example 8. Family history
Nuclear family; lives with both parents; one younger brother, 22, studying in Ahmedabad. **Mother's brother**, 48, has “bipolar” and takes lithium; two admissions in his thirties. **Father** drinks two to three pegs most evenings, no complications reported. Parents' marriage arranged, not consanguineous; relationship described as “fine but tense when father drinks”. Family attitude: mother frightened and supportive; father angry and embarrassed (“what will people say”). Genogram drawn with the patient marked by an arrow and double outline, the maternal uncle shown with shading and “bipolar disorder, on lithium” written beside.
:::

:::example 9. Personal history
Birth: full-term normal hospital delivery, cried at birth. Milestones normal. Schooling: Gujarati-medium school, average to good student, no failures; BCom in Surat, second class. Work: accounts assistant for four years, good record. Menarche at 13, regular cycles, no premenstrual mood changes. Unmarried; parents are looking for a match, which she finds stressful. No romantic relationship disclosed. Sexual history not explored in detail on first interview. No forensic history. Religious, regular at temple. Leisure: garba dance, watching serials.
:::

:::example 10. Premorbid personality (per mother)
Quiet, responsible, slightly shy; a few close friends from school and work; generally cheerful but worries about the family; hard-working and careful with money; religious without being preoccupied; copes with stress by praying and talking to her mother. No substance use.
:::

:::example 11. Physical examination
Pulse 96 per minute, BP 124/80, temperature normal, respiratory rate 18. Weight 54 kg, height 158 cm, BMI about 21.6, waist 74 cm. No pallor, jaundice, thyroid swelling or signs of injury or self-harm. Systemic examination normal. Neurological: no focal signs; no tremor; normal gait and reflexes.
:::

:::example 12. Mental status examination
**General appearance and behaviour**: young woman, looks her age, wearing bright clothes and heavy makeup, dishevelled hair; overfamiliar (calls the doctor “bhai” and touches his arm); increased psychomotor activity (stands up, walks around, adjusts objects on the desk); rapport easily established but superficial; eye contact excessive.
**Speech**: increased in rate, volume and amount; pressured; difficult to interrupt; spontaneous; makes puns and rhymes.
**Mood and affect**: subjectively “Bahut khush, sabse zyada khush” (very happy, happiest ever); objectively elevated with irritability when interrupted; affect labile, of increased intensity, congruent.
**Thought**: stream increased; form: flight of ideas with clang associations, goal not reached at times; content: grandiose delusion that she is an avatar of a goddess with a mission to save the city, held with full conviction, mood-congruent; no persecutory delusions; no passivity phenomena; no suicidal ideas.
**Perception**: says she “understands the language of birds”; on enquiry no voices heard; this seems to be a delusional interpretation rather than a hallucination. No other perceptual disturbance.
**Cognitive functions**: conscious; oriented to time, place and person; attention easily aroused but poorly sustained, highly distractible (stops to comment on a sound outside); immediate, recent and remote memory grossly intact; intelligence average by educational history; abstraction intact for proverbs.
**Insight**: grade 1 (complete denial of illness).
**Judgement**: personal and social judgement impaired (spending, giving away jewellery, going out alone at night); test judgement intact.
:::

:::example 13. Summary
Ms P, 26, unmarried accounts assistant from Surat with a past depressive episode with probable antidepressant-associated hypomania, and a maternal uncle with bipolar disorder, presents with about a month of acute-onset, rapidly progressive decreased need for sleep, elevated and irritable mood, pressured speech, overactivity, overspending and disinhibition, with mood-congruent grandiose delusions for about ten days, following sleep loss at a family wedding. No substance use or medical illness. MSE: elevated labile affect, pressured speech, flight of ideas, grandiose delusion, distractibility, no insight, impaired judgement. Risks: financial, sexual vulnerability and exploitation, possible aggression when frustrated; no suicidal ideas.
:::

:::example 14. Formulation (5P)
**Presenting**: a severe manic episode with psychotic features.
**Predisposing**: biological: family history of bipolar disorder (maternal uncle); past depressive episode with probable antidepressant-associated hypomania. Psychological: a conscientious, reserved temperament with worry about family duties. Social: pressure around marriage arrangements.
**Precipitating**: several nights of sleep loss at a family wedding, a well-known trigger for mania.
**Perpetuating**: continuing lack of sleep, no insight and no treatment yet; family conflict with an angry father; stigma ("what will people say") that may delay continued care.
**Protective**: a supportive, observant mother; good premorbid functioning and work record; no substance use; previous good response to treatment; family willingness to seek help.
**Narrative**: Ms P has a strong biological vulnerability to bipolar disorder, signalled by her uncle's illness and a likely switch into hypomania on an antidepressant five years ago. Sleep loss at a wedding triggered a full manic episode, now sustained by continuing sleeplessness and lack of insight. Her mother's support and her good premorbid functioning are important strengths for treatment and recovery.
:::

:::example 15. Differential diagnosis
As written in Section 3.2: (1) Bipolar I disorder, current episode manic, with mood-congruent psychotic features, most likely; (2) substance-induced mania, unlikely (no use, urine screen to confirm); (3) mania due to another medical condition (thyroid, autoimmune or other neurological illness), to exclude by examination and tests; (4) schizoaffective disorder, unlikely (psychosis confined to the mood episode); (5) acute and transient psychotic disorder, unlikely (full manic syndrome).
**Provisional diagnosis**: Bipolar I disorder, current episode manic, severe, with mood-congruent psychotic features (DSM-5-TR).
:::

:::example 16. Investigations
Complete blood count; thyroid function (baseline and to exclude hyperthyroidism); renal function and electrolytes, calcium (lithium baseline); liver function; fasting glucose and lipids (antipsychotic baseline); urine pregnancy test (before medicines); urine drug screen (to exclude substance-induced mania); ECG (baseline). Brain imaging and EEG only if atypical features (confusion, neurological signs, seizures) develop.
:::

:::example 17. Management plan
**Legal and consent**: she lacks capacity for treatment decisions at present (cannot appreciate that she is ill or the consequences of refusing treatment). Admission as a supported admission under section 89 of the MHCA 2017 on application by her mother as nominated representative, after assessment by a psychiatrist and a second mental health professional; rights explained to her and the family; capacity to be reviewed daily.
**Biological, immediate**: a secure, low-stimulus room; an antipsychotic (for example olanzapine or risperidone at standard starting doses) for mania and psychosis, with a short-term benzodiazepine for sleep and agitation if needed; start lithium after baseline tests, with a level checked after about five days; valproate avoided because she is a woman of child-bearing potential. Monitor sleep, food and fluid intake, vitals, side effects.
**Psychological**: calm, consistent communication; psychoeducation for patient (when able) and family about bipolar disorder, sleep, relapse signs and adherence; later, a relapse prevention plan and family-focused work.
**Social**: leave from work with a medical certificate; family meeting to reduce conflict and address the father's anger and stigma; protect finances (parents to hold her bank card temporarily with her later agreement); discuss marriage plans being postponed until stable.
**Long term**: maintenance lithium, regular level, renal and thyroid monitoring; avoid antidepressant monotherapy; sleep regularity; plan for pregnancy counselling in future.
:::

:::example 18. Risk assessment and safety plan
**To self**: no suicidal ideas currently; risk will be reviewed as mania settles (depressive switch risk). **To others**: has pushed her father when frustrated; low-moderate risk of aggression if confronted; staff to avoid confrontation and use de-escalation. **From others**: high vulnerability to sexual and financial exploitation because of disinhibition and going out alone at night. **Other**: financial (overspending). **Plan**: inpatient care in a supervised ward; female staff available; visitors limited to family; finances protected; daily review of risk and capacity.
**Prognosis**: good for recovery from this episode (good premorbid functioning, family support, acute onset); recurrence risk is high without maintenance treatment.
:::

:::widget reveal
{"prompt": "In this case sheet, what single historical finding most changes long-term treatment, and why?", "answer": "The probable antidepressant-associated hypomania at 21, together with the family history. It confirms a bipolar course, means antidepressant monotherapy should be avoided in future depressions, and supports long-term mood-stabiliser treatment. It was found only because the mother was asked specifically."}
:::

:::clinician
Points examiners probe in this case: the evidence for capacity loss and the specific MHCA route (section 89 rather than independent admission, with the nominated representative under section 14); the choice of lithium over valproate in a woman of child-bearing potential (valproate teratogenicity and polycystic ovary risk); whether "understanding birds" is a hallucination or a delusional interpretation (careful phenomenology); the role of sleep loss as a trigger and of social rhythm stability in prevention (interpersonal and social rhythm therapy); and the prognostic factors. Expect to be asked to defend each heading's content and to say what new information would change your diagnosis (for example a positive urine drug screen, a fever with neck stiffness, or abnormal movements suggesting autoimmune encephalitis).
:::

:::recall
1. In the sample case, why is valproate avoided? || She is a woman of child-bearing potential; valproate is highly teratogenic.
2. What makes this a supported rather than independent admission? || She lacks capacity for treatment decisions (no insight, cannot appreciate consequences) and has a severe illness with risk.
3. Name two protective factors in the sample case. || A supportive, observant mother; good premorbid functioning; no substance use; past response to treatment.
:::

:::mcq
Q: In the sample case, "understands the language of birds" without hearing voices is best recorded as:
- An auditory hallucination
- *A delusional interpretation, after careful enquiry
- An illusion
- Normal religious belief
> Careful phenomenology changes the label.

Q: The precipitating factor in the sample case is:
- Family history of bipolar disorder
- *Sleep loss at a family wedding
- The supportive mother
- The past depressive episode
> The trigger just before onset.
:::

## 3.7 Presenting a case in exams and on rounds [core][advanced]
### The long case presentation
In a clinical exam you take a history and MSE in about 45 to 60 minutes, then present for about 10 minutes, then answer questions. A clear presentation follows the case sheet order but is **selective**:
1. **Opening line**: identification and the main problem in one sentence.
2. **Chief complaints** with durations.
3. **HPI** as a story: onset, course, key symptoms, biological functions, negatives, risk, treatment so far.
4. **Past, family, personal, premorbid**: only the relevant points.
5. **MSE**: the abnormal findings first, then key negatives.
6. **Summary** in three or four sentences.
7. **Differential and provisional diagnosis**, with reasons.
8. **Formulation** (briefly), **investigations** and **management**.

### Things examiners notice
- You **know** the facts (no "I think he said...").
- You **separate history from MSE**.
- You give **relevant negatives** for your differentials.
- You can say **why** you chose your diagnosis and what would change your mind.
- You treat the patient with respect, thank them, and keep confidentiality.

:::widget decide
{
  "scene": "In your exam, the examiner interrupts after two minutes: 'Just tell me your diagnosis and why.' You have prepared a ten-minute presentation.",
  "ask": "What is the best response?",
  "choices": [
    { "label": "Continue your full presentation from the beginning", "verdict": "harm", "outcome": "The examiner becomes impatient and marks you down for not answering.", "why": "Answer the question asked. Flexibility is part of the skill." },
    { "label": "Give the provisional diagnosis in one line, then three or four key supporting features, one key negative, and your main differential", "verdict": "best", "outcome": "The examiner nods and moves to management questions, where you score well.", "why": "A concise, reasoned answer shows clinical maturity." },
    { "label": "Say you are not sure and need more time", "verdict": "ok", "outcome": "Honest, but it suggests poor preparation.", "why": "Uncertainty is fine, but give your best reasoned answer and say what would confirm it." }
  ]
}
:::

### Common viva questions after a case
- Why is this not schizophrenia (or another differential)?
- What investigations would you do and why?
- How would you assess and manage risk?
- What does the law say about admitting this patient?
- What is the prognosis and what are the prognostic factors?
- How would you explain the diagnosis to the family?
- What psychological treatment would you offer?

:::clinician
Structured clinical exams (OSCEs) in Indian MD, DNB and MPhil programmes increasingly test discrete skills (risk assessment, explaining a diagnosis, capacity assessment, breaking bad news) alongside the traditional long case. Prepare a 60-second "elevator" summary for every case you see. On ward rounds, the same skills apply: lead with what has changed and what decision is needed today, rather than retelling the whole history. Practise presenting cases where the diagnosis is uncertain; examiners reward a well-argued differential with a clear plan to resolve it more than false certainty.
:::

:::recall
1. List the order of a long case presentation. || Opening line; chief complaints; HPI; relevant past, family, personal and premorbid; MSE abnormal findings and key negatives; summary; differential and provisional diagnosis; formulation, investigations, management.
2. What do examiners value most? || Knowing the facts, separating history from MSE, relevant negatives, reasoned diagnosis, respect for the patient.
:::

:::mcq
Q: When asked "Why not schizophrenia?" in a case of mania with psychosis, the best answer focuses on:
- The patient's age only
- *The psychotic features occurring only within the mood episode, the full manic syndrome, and the family history of bipolar disorder
- The family's opinion
- The patient's religion
> Give the distinguishing evidence.
:::

# Part IV · Exam zone

## 4.1 Long answers and short notes [core]
### Long answer skeletons
**1. Describe the components of a psychiatric case history (15 marks).**
Purpose of the case history → identification and informants (reliability, adequacy) → chief complaints → HPI elements → past, treatment and substance history → family history with genogram → personal history → premorbid personality → physical examination and MSE (briefly) → summary, formulation, differential, investigations, plan, risk → principles of good documentation and legal aspects.

**2. What is a formulation? Write a 5P formulation for a case of your choice (15 marks).**
Definition and difference from diagnosis → models (5P, biopsychosocial, CBT, psychodynamic) → 5P grid explained → worked example with narrative → how formulation guides the plan → limits and collaboration with the patient.

**3. Documentation and the law in Indian psychiatric practice (10 marks).**
Purposes of records → MHCA 2017: capacity, consent, advance directive, nominated representative, admission types, restraint, confidentiality (section 23), access to records (section 25) → POCSO and other reporting duties → medicolegal records → retention and confidentiality → electronic records.

### Short notes (5 marks each)
- Informant reliability and adequacy
- History of present illness
- Treatment history and adequacy of trials
- Genogram
- Premorbid personality
- The 5P formulation
- Differential diagnosis: the diagnostic ladder
- Risk formulation and safety planning
- SOAP notes
- Discharge summary
- Child case history
- The clinical psychology case record

:::student
For "write a case history" questions, use the headings as sub-titles and give a one-line example under each. It shows structure and practical understanding at the same time.
:::

:::clinician
Postgraduate examiners frequently ask candidates to critique a poorly written case sheet; practise spotting unattributed opinions, history in the MSE, missing negatives, missing treatment adequacy, absent risk formulation and missing legal status. For MPhil and PsyD candidates, expect questions on the psychological case record, therapy notes and outcome measures.
:::

:::recall
1. What are the three skeleton long answers in this module? || Components of the case history; formulation with a 5P example; documentation and the law.
2. Name five errors examiners look for in a case sheet. || Unattributed opinions, history in the MSE, missing negatives, missing treatment adequacy, no risk formulation (also missing legal status).
:::

## 4.2 Viva rapid-fire [core]
:::viva
What are the purposes of a case sheet? :: Clinical care, communication, continuity, legal record, teaching and research.
Reliable versus adequate informant? :: Reliable: no reason to doubt accuracy. Adequate: enough contact to know.
How are chief complaints ordered? :: Chronologically, with durations.
Where does the HPI start? :: From the last time the patient was well.
What are biological functions? :: Sleep, appetite, weight, energy, libido, menstruation, bowel and bladder.
What is a relevant negative? :: An important absent feature that bears on the differential.
What six details does a treatment history need for each drug? :: Name and dose, duration, response, side effects, adherence, reason stopped.
Genogram symbols for male and female? :: Square and circle.
Symbol for consanguinity? :: A double line between partners.
Name the premorbid personality headings. :: Social relations, leisure, mood, attitudes to self and others, work, moral and religious standards, fantasy, reaction to stress, habits.
Eight MSE headings? :: Appearance and behaviour, speech, mood and affect, thought, perception, cognition, insight, judgement.
The five Ps? :: Presenting, predisposing, precipitating, perpetuating, protective.
Diagnosis versus formulation? :: Diagnosis is what they share with others; formulation is what is unique to them.
Order of the diagnostic ladder? :: Organic, substance, primary psychiatric, personality, no disorder.
SOAP? :: Subjective, objective, assessment, plan.
MHCA section for independent admission? :: Section 86.
MHCA section for supported admission? :: Section 89 (up to 30 days), section 90 beyond.
MHCA section on confidentiality? :: Section 23.
MHCA section on access to records? :: Section 25.
What should never be used alone to decide discharge after self-harm? :: A risk scale.
What scale is commonly used for socioeconomic status in India? :: The modified Kuppuswamy scale.
What must a discharge summary say about medicines? :: Each medicine to continue with dose and timing, and any stopped with reasons.
:::

## 4.3 Module test [core]
Score 80% or more to complete the module.

:::mcq
Q: The case sheet's legal role means:
- It can be written later from memory
- *Contemporaneous, accurate, signed records are the evidence of what was done
- Only diagnoses need to be written
- Opinions should be unattributed
> Records are legal evidence.

Q: Which identification item most changes the likely diagnosis of a first psychosis?
- Religion
- *Age
- Address
- Language
> Late onset raises organic causes.

Q: A neighbour who has known the patient for two days is likely:
- Reliable and adequate
- *Inadequate
- The best informant
- Unnecessary to record
> Too little contact.

Q: "Wakes at 3 am and cannot sleep again" is described as:
- Initial insomnia
- Middle insomnia
- *Early morning awakening (terminal insomnia)
- Hypersomnia
> Typical of melancholic depression.

Q: Writing "patient says 'I feel empty inside'" follows the rule of:
- Relevant negatives
- *Recording the patient's own words
- Formulation
- Attribution to an informant
> Quotation preserves the patient's voice.

Q: Insidious onset means:
- Within hours
- Within a day
- *Gradually over weeks to months
- After a head injury only
> Slow, gradual onset.

Q: In depression, asking the informant about past periods of elevated mood is done to:
- Calculate SES
- *Exclude bipolar disorder before choosing treatment
- Draw the genogram
- Record premorbid personality
> Hypomania is often missed by patients.

Q: An adequate trial of an antidepressant requires:
- Any dose for any time
- *A therapeutic dose for an adequate duration with adherence confirmed
- Only a brand-name medicine
- Hospital admission
> Dose, duration, adherence.

Q: "Doda post" in a substance history refers to:
- A sedative tablet
- *Poppy husk, an opioid used in parts of north-west India
- A cannabis drink
- An inhalant
> Ask about region-specific substances.

Q: In a genogram, the index patient is shown by:
- A dotted line
- *An arrow and a double outline
- A double partner line
- A diamond
> Mark the patient clearly.

Q: Expressed emotion in families is assessed mainly because it predicts:
- IQ
- *Relapse, especially in schizophrenia
- Height
- Response to ECT only
> Criticism and over-involvement predict relapse.

Q: Age at menarche and postpartum illness belong in:
- Family history
- *Personal history
- Premorbid personality
- MSE
> Menstrual and obstetric history.

Q: Premorbid personality describes:
- The patient during the illness
- *The patient's usual personality before the illness began
- The family's personalities
- The doctor's impression
> Baseline personality.

Q: Weight, waist and blood pressure must be recorded before starting:
- Psychotherapy
- *Antipsychotics
- Psychological testing
- Relaxation training
> Metabolic monitoring.

Q: Why write a reason next to each investigation?
- To lengthen the record
- *To show reasoning and avoid unnecessary tests
- Because the law requires it for every test
- To impress the patient
> Purposeful investigation.

Q: A formulation answers:
- Only "what is the diagnosis?"
- *Why this person, why this problem, why now, what keeps it going and what helps
- Only "what medicine?"
- Only "what is the prognosis?"
> The essence of formulation.

Q: Avoidance of the shop that deepens a man's depression is a:
- Predisposing factor
- Precipitating factor
- *Perpetuating factor
- Protective factor
> It maintains the problem.

Q: A family history of bipolar disorder is a:
- *Predisposing factor
- Precipitating factor
- Perpetuating factor
- Protective factor
> Long-standing vulnerability.

Q: The first step in a differential diagnosis is to:
- Choose a treatment
- *Describe the syndrome clearly
- Ask the family their opinion
- Write the code
> Describe, then list causes.

Q: Organic causes are placed first in a differential because:
- They are the most common
- *They must not be missed and are often treatable
- They are the easiest
- The law requires it
> Safety first.

Q: Under the MHCA 2017, supported admission for up to 30 days is under:
- Section 86
- *Section 89
- Section 94
- Section 23
> Section 89.

Q: Capacity under the MHCA involves the ability to:
- Read and write
- *Understand information, appreciate consequences and communicate a decision
- Agree with the doctor
- Pay for treatment
> The three elements.

Q: A risk entry should be:
- A single word: low, medium or high
- *A formulation with factors, current state and a concrete plan
- Left out if the patient denies risk
- Written only by a senior
> Formulate and plan.

Q: In SOAP, "Manic episode improving; mild drug-induced parkinsonism" belongs under:
- Subjective
- Objective
- *Assessment
- Plan
> Interpretation.

Q: A discharge summary should state medicines that were stopped because:
- It makes the summary longer
- *It prevents them being restarted by mistake
- It is required by insurance
- It is not needed
> Medicine reconciliation.

Q: Instrumental activities of daily living are most important in the case record of:
- A child
- *An older adult
- A substance user only
- A medicolegal case only
> Functional assessment in later life.

Q: In medicolegal records, statements should be:
- Paraphrased
- *Quoted word for word with exact times
- Omitted
- Written after the trial
> Precision for legal use.

Q: In an exam, when asked only for the diagnosis, you should:
- Present the whole case anyway
- *Give the provisional diagnosis with key supporting features, a key negative and the main differential
- Refuse to answer
- Ask to see the patient again
> Answer what is asked, concisely.
:::
`;
