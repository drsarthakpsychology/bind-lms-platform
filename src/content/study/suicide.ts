import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "suicide",
  num: 16,
  title: "Suicide, self-harm and risk",
  emoji: "🛟",
  tagline: "How to ask, what to assess, how to make a safety plan, and how the law in India protects people in crisis",
  when: "Weeks 11 to 12",
  outcomes: [
    "Ask about suicide directly and compassionately",
    "Assess ideation, intent, plan, preparation, history, and risk and protective factors",
    "Explain why risk assessment informs care rather than predicts suicide",
    "Make a collaborative safety plan, including means safety",
    "Know the Indian legal position, helplines and safe messaging",
  ],
  writeTask:
    "On paper, from memory: the five things to establish about suicidal thinking, ten risk factors and five protective factors, the six steps of a safety plan, three myths with corrections, and the Mental Healthcare Act position on attempted suicide. Then check and correct in red.",
  activities: [
    act.lesson("rk-1", "Quiz: suicide risk", "Assessment and myths."),
    act.lesson("rk-2", "Quiz: Mental Healthcare Act 2017", "The legal protections."),
    act.coach("counselling", "Coach: counselling", "Crisis conversations."),
    act.scenarios("depression", "Patient case: “Kya fayda jeene ka?”", "Asking directly when a patient hints at hopelessness."),
  ],
  noteId: "suicide",
};

export const text = String.raw`
# Part I · Understanding suicide

## 1.1 The facts that change how you practise [core]
:::safety Taught at the level of what a clinician assesses
This module teaches how to recognise and assess risk and how to help. It is not a protocol for working alone. Students on placement always involve their supervisor when a patient is at risk.
:::

- Suicide is a leading cause of death among young people in India and worldwide. India records well over a lakh suicide deaths every year, with students, farmers, daily-wage workers and homemakers among the groups most affected.
- For every death there are many more attempts. A **previous attempt** is one of the strongest predictors of future suicide.
- Most people who die by suicide had a mental disorder (especially depression, substance use, psychosis, personality disorder), but social stressors (debt, exam failure, relationship breakdown, domestic violence, chronic illness) are powerful too.

:::trap Myths that cost lives
| Myth | Fact |
|---|---|
| Asking about suicide puts the idea in someone's head | Asking directly **reduces** distress and opens the door to help |
| People who talk about it won't do it | Many who die told someone first. Take every mention seriously |
| Suicide happens without warning | Most people show warning signs: hopelessness, withdrawal, putting affairs in order |
| Once suicidal, always suicidal | Crises pass; with help most people recover and live |
| Only people with mental illness die by suicide | Many have no diagnosis; stressors and impulsivity matter |
| Improving mood means the danger has passed | Risk can rise in early recovery, when energy returns before hope |
:::

:::recall
1. What is one of the strongest predictors of suicide? || A previous attempt.
2. Correct the myth that asking puts the idea in someone's head. || Asking directly reduces distress and opens the door to help.
3. Why can risk rise in early recovery from depression? || Energy returns before hope.
:::

:::mcq
Q: A man who was severely depressed and slow for weeks is suddenly calm and giving away his belongings after starting treatment. The right reading is:
- He is recovering; reduce follow-up
- *Risk may have risen; ask directly about suicidal plans
- He is manic
- He is malingering
> Sudden calm and putting affairs in order are warning signs.
:::

## 1.2 Risk factors and protective factors [core]
| Area | Risk factors |
|---|---|
| History | **Previous attempts**, especially recent and high-lethality; self-harm |
| Mental health | Depression, **hopelessness**, bipolar disorder, psychosis (command voices), substance use (especially alcohol), personality disorder, recent discharge from hospital, eating disorders |
| Demographic | Male (more deaths), female (more attempts); young adults and the elderly; students |
| Social | Living alone, divorce, bereavement, isolation, unemployment, **debt**, exam failure, domestic violence, sexual or physical abuse, LGBTQ+ people facing rejection, family history of suicide |
| Physical | Chronic pain, disabling or terminal illness, recent diagnosis |
| Situational | **Access to means** (pesticides, medicines, hanging), recent loss or humiliation, legal trouble, a suicide in the community or media |

| Protective factors |
|---|
| Reasons for living: children, family, faith, future plans |
| Strong social support and a sense of belonging |
| Engagement with care and a trusted clinician |
| Problem-solving and coping skills |
| Religious or cultural beliefs against suicide |
| Restricted access to lethal means |

:::note Checklists don't predict
Scores such as SAD PERSONS are poor at predicting who will die. Suicide is rare and risk factors are common, so **no assessment predicts an individual's suicide**. Risk assessment exists to understand the person and decide the **level of care and support**, not to label them “low risk” and stop worrying.
:::

:::recall
1. List ten risk factors across the six areas. || Previous attempt, hopelessness, depression, alcohol, male sex, living alone, debt, chronic pain, recent discharge, access to means.
2. List five protective factors. || Reasons for living, support, engagement with care, coping skills, beliefs, restricted means.
3. What is the purpose of risk assessment, if not prediction? || To understand the person and decide the level of care.
:::

:::mcq
Q: Which of these is the strongest single predictor of future suicide?
- Female sex
- Being a student
- *A previous suicide attempt
- Living with family
> Past attempts, especially recent and high-lethality, carry the highest risk.
:::

## 1.3 Why people become suicidal: the models [core]
No single cause explains suicide. Models help you see **what to ask about and where to help**.

| Model | Key idea | What it tells you to look for |
|---|---|---|
| **Durkheim** (sociology, 1897) | Suicide rates reflect social integration and regulation. Types: **egoistic** (too little belonging), **altruistic** (too much: dying for the group), **anomic** (sudden social change, loss of norms), **fatalistic** (excessive control) | Isolation, sudden economic or social upheaval |
| **Stress-diathesis** | A vulnerability (genes, early adversity, impulsivity, neurobiology) meets a stressor (loss, shame, illness) | Both the long-term vulnerability and the current trigger |
| **Interpersonal theory (Joiner)** | Desire for death comes from **thwarted belongingness** and **perceived burdensomeness**; acting on it needs **acquired capability** (reduced fear of death, from past self-harm or exposure to pain) | "Do you feel you belong? Do you feel a burden? Have you hurt yourself before?" |
| **Three-step theory (Klonsky)** | Pain plus hopelessness creates ideation; ideation grows when pain exceeds connection; capability turns ideation into action | Pain, hope, connection, capability |
| **Cognitive** | **Hopelessness** (Beck) predicts suicide better than depression severity; poor problem-solving; feeling trapped (**entrapment**) | Hopelessness and a sense of no way out |

### Biology
- Low **serotonin** function: low **5-HIAA** (a serotonin breakdown product) in the spinal fluid of people who made violent attempts.
- Impulsivity and aggression traits, **HPA axis** changes, and family history (partly genetic, partly learned).

:::analogy Pain, a trap, and a ladder
Think of three things together: unbearable **pain**, the feeling of being **trapped** with no way out, and the **ladder** of capability (past self-harm, access to means, intoxication). Treatment reduces the pain, opens exits (hope, problem-solving, connection), and takes away the ladder (means safety, sobriety).
:::

:::recall
1. Name Durkheim's four types of suicide. || Egoistic, altruistic, anomic, fatalistic.
2. What are the three parts of Joiner's interpersonal theory? || Thwarted belongingness, perceived burdensomeness, acquired capability.
3. Which cognitive factor predicts suicide better than depression severity? || Hopelessness.
4. What is low in the spinal fluid after violent suicide attempts? || 5-HIAA.
:::

:::mcq
Q: A widowed farmer says, "I'm only a burden to my sons now, and nobody needs me." In Joiner's theory, these reflect:
- Acquired capability
- *Perceived burdensomeness and thwarted belongingness
- Fatalistic suicide
- Learned helplessness only
> The two parts of the desire for death; capability turns it into action.
:::

## 1.4 Groups who need special attention [core]
| Group | What drives risk | What helps |
|---|---|---|
| **Students and young people** | Exam pressure, academic failure, competitive coaching hubs, bullying, relationship breakups, family conflict, online harassment | School and college counselling, gatekeeper training for teachers, reducing exam stigma, parents' support |
| **Farmers and rural workers** | Debt, crop failure, price shocks, easy access to **pesticides** | Debt relief, crop insurance, safe pesticide storage, primary care screening |
| **Homemakers and young married women** | Domestic violence, dowry harassment, isolation, early marriage | Ask about violence, link to protection services, family work |
| **Older adults** | Physical illness, pain, loneliness, bereavement, depression often missed; **higher lethality** of attempts | Treat depression and pain, social connection, review medicines |
| **People after psychiatric discharge** | The weeks after discharge are a **very high-risk period** | Follow-up within days, a clear safety plan, contact with family |
| **LGBTQ+ people** | Rejection, discrimination, violence, hiding identity | Affirming care, family support, peer groups |
| **People in custody or prison** | Shame, isolation, withdrawal from substances | Screening on entry, observation, removing means |
| **Health workers and doctors** | Long hours, burnout, access to medicines, stigma about seeking help | Confidential support, peer support, supervision |

:::note Pesticide access and Indian data
In India, family problems and illness are among the most commonly recorded causes in national crime records, and **daily wage earners, homemakers, students and farmers** carry a large share of deaths. Restricting highly hazardous pesticides is one of the most effective population-level measures in South Asia.
:::

:::recall
1. Which period after hospital discharge carries high risk? || The first weeks.
2. Name three risk drivers in students. || Exam pressure, academic failure, bullying, breakups, family conflict.
3. What is the most effective population-level measure in rural South Asia? || Restricting access to highly hazardous pesticides.
4. Why are attempts by older adults especially serious? || Higher lethality.
:::

:::mcq
Q: A man is discharged from a psychiatric ward after a suicide attempt. The single most useful measure is:
- No follow-up for a month
- *A follow-up contact within the first few days, with a safety plan
- A risk score only
- Prescribing a month of tricyclics
> The weeks after discharge are very high risk.
:::

# Part II · Assessment

## 2.1 How to ask [core]
Ask in steps, from general to specific, calmly and without hurry.

1. “How have things been for you lately? How do you see the future?”
2. “Sometimes when people feel this low, they feel life isn't worth living. Has that happened to you?”
3. “Have you had thoughts of ending your life?”
4. “Have you thought about how you would do it?”
5. “Have you done anything to prepare?” “Have you ever tried before?”
6. “What has stopped you so far?”

:::sounds How suicidal thinking may be voiced
- “Bas sab khatam karna hai.” (I just want to end everything.)
- “Mere jaane se sab theek ho jaayega.” (Everything will be fine when I'm gone.)
- “Thak gaya hoon, ab aur nahi hota.” (I'm exhausted; I can't do this anymore.)
- “Neend mein hi chala jaaun toh accha.” (It would be better to not wake up.) Passive: still ask about active thoughts.
- Giving away belongings, sudden calm after weeks of distress, saying goodbyes.
:::

:::mcq
Q: Which way of asking about suicide is best?
- "You're not thinking of doing anything silly, are you?"
- *"With everything you've told me, have you had thoughts of ending your life?"
- Avoid asking, it plants the idea
- Ask the family instead of the patient
> Ask directly and neutrally; asking does not increase risk.
:::

## 2.2 What to establish [core]
| Domain | Questions |
|---|---|
| **Ideation** | Passive (wish to be dead) or active (thoughts of killing oneself)? How often, how intense, how long? |
| **Intent** | How much do they mean to act? Do they expect to die? |
| **Plan** | Is there a plan? How specific (method, time, place)? |
| **Preparation** | Means acquired? Note written? Affairs put in order? Rehearsal? |
| **History** | Past attempts: method, lethality, chance of rescue, regret or relief at survival |
| **Current state** | Hopelessness, agitation, psychosis (command voices), intoxication, insomnia |
| **Protective factors** | Reasons for living, supports, willingness to engage |
| **Access to means** | Medicines at home, pesticides, weapons |

:::define After an attempt: questions that reveal intent
Was it planned or impulsive? Was it done alone, timed to avoid discovery? Did they take steps to prevent rescue? A suicide note? What did they expect would happen? How do they feel about surviving (regret, relief)? Is the precipitating problem still there?
:::

:::word Documenting risk
“Reports passive death wishes for 3 weeks and active suicidal thoughts for 4 days, with a plan to take her mother's tablets; has not collected them. No previous attempts. Protective: her two children, willingness to accept help. Risk factors: severe depression, hopelessness, recent separation, access to medicines. Formulation: high current risk. Plan: discussed with supervisor; safety plan made; mother agreed to keep medicines locked; review tomorrow; crisis numbers given.”
:::

:::recall
1. List the eight domains of a suicide assessment. || Ideation, intent, plan, preparation, history, current state, protective factors, access to means.
2. Give five questions that reveal intent after an attempt. || Planned or impulsive, alone and timed, prevented rescue, note, expected outcome, feelings about surviving.
3. Distinguish passive from active ideation. || Wishing to be dead vs thoughts of killing oneself.
:::

:::mcq
Q: After an overdose, which detail most suggests high intent?
- Took the tablets in front of her husband
- *Took them alone, timed when no one would be home, and left a note
- Called a friend straight after
- Took 3 paracetamol
> Planning, isolation, avoiding rescue and a note show intent.
:::

## 2.3 Self-harm in the emergency department [core]
### Medical first, then everyone gets a psychosocial assessment
1. **Medical safety**: treat the injury or overdose; check for paracetamol and other co-ingestions; involve the poisons service.
2. **Do not wait** until the person is "fully well" to be kind. A respectful first contact predicts whether they return for help.
3. **Psychosocial assessment** for every person who self-harms, once medically fit and not intoxicated: the events, intent, mental state, risks, needs, supports, and what the person wants.
4. **Plan**: level of care, safety plan, follow-up within days, letter to the general practitioner or local clinic, family involvement with consent.

### Special situations
| Situation | Approach |
|---|---|
| **Intoxicated** | Keep safe and observed; full assessment when sober; never discharge only because they "say they're fine" while drunk |
| **Psychotic** (command voices, delusions of guilt) | High risk; usually admission |
| **Child or adolescent** | Involve parents or guardians; screen for abuse (POCSO duties); school liaison |
| **Repeated self-harm** | Each episode assessed afresh; avoid "attention seeking" labels; look at function (relief, communication, punishment) |
| **Wants to leave before assessment** | Assess capacity; if lacking capacity and at serious risk, use MHCA emergency provisions; document |

### Formulating risk, not scoring it
- Write a short **risk formulation**: who is at risk, of what, why now, what makes it worse or better, and what will be done.
- State **static** factors (past attempts, sex, history) and **dynamic** factors (hopelessness, intoxication, access to means, current stressors). Dynamic factors are where you act.

:::trap Scores do not decide discharge
Avoid "low, medium, high" labels based on checklists. Two people with the same score can have opposite needs. Base decisions on the conversation, the formulation and the person's needs.
:::

:::recall
1. Who should get a psychosocial assessment after self-harm? || Everyone, once medically fit and not intoxicated.
2. Distinguish static from dynamic risk factors. || Static cannot change (history, sex); dynamic can (hopelessness, intoxication, means).
3. What does a risk formulation include? || Who, of what, why now, what worsens or helps, and the plan.
4. What should you do if a patient lacking capacity tries to leave at serious risk? || Use MHCA emergency provisions and document.
:::

:::mcq
Q: A man after self-harm is drunk and says he is fine and wants to go. The best action is:
- Discharge, he has denied suicidal thoughts
- *Keep him safe and observed and assess fully once sober
- Give a large sedative and discharge
- Call it attention seeking
> Assessment while intoxicated is unreliable.
:::

# Part III · Helping

## 3.1 Safety planning and level of care [core]
:::define A collaborative safety plan (written with the patient)
1. **Warning signs** that a crisis may be coming (thoughts, moods, situations)
2. **Internal coping strategies** (things they can do alone: walking, music, prayer, breathing)
3. **People and places** that provide distraction
4. **People to ask for help** (names and numbers)
5. **Professionals and crisis lines** (clinic, Tele-MANAS 14416, emergency 112)
6. **Making the environment safe**: means safety
:::

### Means safety
Limiting access to lethal means saves lives because many crises are brief.
- Ask family to lock away medicines and pesticides; dispense small quantities of medicines; remove other means.
- Pesticide restrictions have reduced suicides in several countries.

### Level of care
| Situation | Typical response |
|---|---|
| Thoughts without plan or intent, good supports | Outpatient care, safety plan, close follow-up |
| Plan or intent, but can engage, with support at home | Intensive follow-up, family involvement, means safety, treat the cause |
| High intent, plan, preparation, psychosis, intoxication, no support, or can't keep safe | **Urgent specialist assessment; admission** |

- Treat the underlying condition (depression, psychosis, substance use). Lithium reduces suicide in mood disorders; clozapine in schizophrenia.
- Follow up quickly after discharge: the weeks after leaving hospital are high risk.

### Self-harm
- Non-suicidal self-injury (cutting, burning) is usually a way to cope with overwhelming emotion, but it **raises long-term suicide risk**. Respond with respect, not anger or dismissal.
- Assess each episode; treat wounds; explore function; teach alternative coping (DBT skills); involve family where appropriate.

:::mcq
Q: In a safety plan, which step comes first?
- Calling the police
- *Recognising personal warning signs that a crisis is starting
- Going to the emergency department
- Taking a sedative
> Warning signs, coping alone, people and places, people to ask, professionals, means safety.
:::

## 3.2 India: law, helplines and messaging [core]
:::define Mental Healthcare Act 2017, Section 115
A person who attempts suicide **shall be presumed, unless proved otherwise, to have severe stress** and **shall not be tried and punished** under the Indian Penal Code (Section 309). The government has a duty to provide **care, treatment and rehabilitation** to such a person.
:::
- Attempted suicide is still recorded as a medico-legal case in hospitals; the law protects the person from punishment.
- **Tele-MANAS: 14416** (or 1-800-891-4416), the national tele-mental health helpline, free and 24 hours.
- **Emergency: 112**.

:::trap Safe messaging
When talking, posting or teaching about suicide: don't describe methods or locations; don't present suicide as a solution or as inevitable; don't sensationalise. Do share stories of recovery and where to get help.
:::

:::recall
1. List the six parts of a safety plan. || Warning signs, internal coping, distraction contacts, help contacts, professionals and crisis lines, means safety.
2. Why does means restriction work? || Many crises are brief; removing means buys time.
3. What does Section 115 of the MHCA 2017 say? || Attempted suicide is presumed to be due to severe stress, not punished, and the state must provide care.
4. What is the national tele-mental health number? || Tele-MANAS 14416.
:::

:::mcq
Q: A news site wants to report a celebrity's suicide with photos of the method. The safe-messaging advice is to:
- Describe the method in detail to warn others
- *Avoid method details and sensational headlines, and include where to get help
- Call it a brave choice
- Publish the note
> Responsible reporting lowers copycat suicides.
:::

## 3.3 Risk to others [extra]
- Assess thoughts of harming others the same way: ideation, intent, plan, target, means, history of violence.
- Strongest predictor: **past violence**. Others: substance use, young male, antisocial traits, persecutory delusions with anger, command hallucinations to harm, non-adherence, recent stressors.
- Most people with mental illness are not violent and are more often victims.
- Where there is a serious risk to an identifiable person, confidentiality may be breached to protect them; always involve a senior.

:::recall
1. What is the strongest predictor of violence? || Past violence.
:::

## 3.4 Treatments that lower suicide [core]
| Treatment | Evidence |
|---|---|
| **Lithium** | Reduces suicide and self-harm in mood disorders |
| **Clozapine** | Reduces suicidal behaviour in schizophrenia |
| **ECT** | Rapid relief in severe depression with high suicide risk |
| **Ketamine and esketamine** | Rapid but short-lived reduction in suicidal thoughts; specialist use |
| Antidepressants | Treat depression; monitor closely early on, especially under 25 |
| **DBT** | Reduces self-harm in borderline personality disorder |
| **CBT for suicide prevention** | Reduces repeat attempts |
| **Brief contact interventions** | Caring letters, texts or calls after an attempt reduce repeats |
| **Safety planning plus follow-up calls** | Reduces suicidal behaviour after emergency visits |

:::note Follow-up is treatment
Contact within the first days after discharge or an emergency visit is one of the simplest and most effective measures. A missed appointment after self-harm deserves a call, not a closed file.
:::

:::mcq
Q: Which medicine reduces suicidal behaviour in schizophrenia?
- Haloperidol
- *Clozapine
- Alprazolam
- Amitriptyline
> Clozapine (and lithium in mood disorders) has anti-suicidal effects.
:::

## 3.5 After a suicide: postvention [core]
:::define Postvention
Support given after a suicide to the people affected: family, friends, classmates, colleagues and clinicians. It is also prevention, because those bereaved by suicide have a **higher risk** of suicide themselves.
:::
- **Families**: practical help, honest information, space for grief, guilt and anger; screen for depression; link to support groups.
- **Schools and colleges**: share accurate, non-sensational information; identify close friends and vulnerable students; avoid memorials that glamorise; offer counselling.
- **Clinicians**: losing a patient to suicide is a recognised trauma. Expect grief, guilt and fear of blame. Use a supportive (not blaming) case review, supervision, and peer support.

:::sounds Words for a bereaved family
"I'm so sorry about Rahul. Many families feel guilt and keep asking 'why' or 'what if'. Those feelings are common after a suicide. You don't have to find all the answers now. Can we talk about how each of you is coping, and who is around to support you?"
:::

:::recall
1. Name four treatments with evidence for reducing suicide or self-harm. || Lithium, clozapine, DBT, CBT, brief contact interventions, safety planning with follow-up.
2. What is postvention and why is it also prevention? || Support after a suicide; the bereaved have higher risk.
3. How should a school respond after a student's suicide? || Accurate information, identify vulnerable students, avoid glamorising, offer counselling.
:::

:::mcq
Q: A week after a student's suicide, the college asks what to do. The best advice is:
- Hold a large memorial with the method described
- *Give accurate, calm information, identify close friends and vulnerable students, and offer counselling
- Say nothing at all
- Expel students who talk about it
> Postvention protects others at higher risk.
:::

# Part IV · Exam zone

## 4.1 Long answer and short notes [core]
:::example Q. How would you assess and manage a patient with suicidal ideation? (10 marks)
1. Epidemiology and importance; myths.
2. Approach: privacy, rapport, asking directly in stages.
3. Assessment: ideation, intent, plan, preparation, history, current state, protective factors, means; collateral.
4. Risk and protective factors table; why prediction fails; formulation.
5. Management: level of care, safety plan, means safety, treat the cause, follow-up, family involvement.
6. Legal and ethical: MHCA 2017 Section 115, confidentiality limits, documentation.
7. Helplines and safe messaging.
:::

:::word Short note: safety planning
A safety plan is a brief, written, prioritised list developed collaboratively with a person at risk, used during suicidal crises. It includes personal warning signs, internal coping strategies, people and places for distraction, people to ask for help, professional and crisis contacts (such as Tele-MANAS 14416), and steps to make the environment safe by limiting access to lethal means. It is kept where it can be found in a crisis and reviewed regularly. It supports, but does not replace, treatment and follow-up.
:::

## 4.2 Viva rapid-fire [core]
:::viva
Strongest predictor of suicide? :: A previous attempt.
Does asking about suicide increase risk? :: No; it reduces distress and opens help.
Five domains of suicidal thinking? :: Ideation, intent, plan, preparation, history.
Passive vs active ideation? :: Wish to be dead vs thoughts of killing oneself.
What is means safety? :: Limiting access to lethal means.
Why can risk rise in early recovery? :: Energy returns before hope.
Medicine that reduces suicide in mood disorders? :: Lithium.
Medicine that reduces suicidal behaviour in schizophrenia? :: Clozapine.
High-risk period after hospital care? :: The weeks after discharge.
What does MHCA 2017 Section 115 say? :: Attempted suicide is presumed due to severe stress and not punished.
National tele-mental health helpline? :: Tele-MANAS 14416.
Does self-harm raise suicide risk? :: Yes, in the long term.
Strongest predictor of violence? :: Past violence.
Durkheim's type linked to sudden social upheaval? :: Anomic.
Joiner's three factors? :: Thwarted belongingness, perceived burdensomeness, acquired capability.
Best cognitive predictor of suicide? :: Hopelessness.
Serotonin metabolite low after violent attempts? :: 5-HIAA.
Highest-risk time after psychiatric discharge? :: The first weeks.
Most effective population measure in rural India? :: Restricting hazardous pesticides.
Who gets a psychosocial assessment after self-harm? :: Everyone.
Medicine reducing suicide in schizophrenia? :: Clozapine.
Medicine reducing suicide in mood disorders? :: Lithium.
Caring letters after an attempt? :: Brief contact intervention.
Support after a suicide? :: Postvention.
:::

## 4.3 Module test [core]
:::mcq
Q: A depressed patient says, “Sometimes I wish I wouldn't wake up.” Best next step:
- Change the subject to avoid upsetting her
- *Ask directly whether she has had thoughts of ending her life
- Reassure her that things will get better
- Prescribe a sleeping tablet
> Passive ideation needs direct follow-up questions.

Q: Which is the strongest single predictor of eventual suicide?
- Female sex
- *A previous suicide attempt
- Living with family
- Religious belief
> Especially recent, high-lethality attempts.

Q: The main purpose of suicide risk assessment is to:
- Predict exactly who will die
- *Understand the person and decide the level of care
- Fill in a checklist score
- Decide whether to call the police
> Prediction is not possible for individuals.

Q: Which is NOT part of a safety plan?
- Warning signs
- Coping strategies
- People to contact
- *A promise never to feel suicidal again
> “No-suicide contracts” are not effective.

Q: Under the Mental Healthcare Act 2017, a person who attempts suicide is:
- Punished under the penal code
- *Presumed to have severe stress and not punished
- Automatically admitted for 6 months
- Reported to their employer
> Section 115.

Q: A patient's mood improves and he suddenly seems calm after weeks of distress, giving away belongings. This should:
- Reassure you
- *Raise concern about a decision to die
- Lead to discharge
- Be ignored
> Sudden calm with goodbyes can signal a plan.

Q: The national tele-mental health helpline number in India is:
- 100
- *14416
- 108
- 1098
> Tele-MANAS, free and 24 hours.

Q: Which is a protective factor?
- Access to pesticides
- Recent discharge from hospital
- *Children and a strong sense of responsibility to family
- Alcohol use
> Reasons for living.

Q: A teenager cuts her arms to calm overwhelming feelings. Best response:
- Tell her it's attention-seeking
- *Respond with respect, assess, treat wounds and teach alternative coping
- Ignore it to avoid reinforcing it
- Lock her room
> Non-suicidal self-injury still raises long-term risk.

Q: Safe messaging about suicide means:
- Describing methods so people understand
- *Avoiding method details and sharing help and recovery stories
- Calling suicide a solution
- Sensational headlines
> Reduces imitation.

Q: A man says, "My family would be better off without me; I don't fit anywhere." In Joiner's theory these reflect:
- Acquired capability only
- *Perceived burdensomeness and thwarted belongingness
- Anomic suicide
- Altruistic suicide
> Desire for death; capability is the third factor.

Q: Which is a dynamic risk factor?
- Male sex
- Previous attempt
- *Current intoxication with alcohol
- Family history of suicide
> Dynamic factors can change and are where you act.

Q: An intoxicated man after self-harm says he is fine and wants to go home. The best action is:
- Discharge as he denies suicidal thoughts
- *Keep him safe and observed, and assess fully when sober
- Give a large dose of sedative and discharge
- Call it attention seeking
> Assessment while intoxicated is unreliable.

Q: Which intervention has evidence for reducing repeat attempts after an emergency visit?
- A single risk score
- *Safety planning with follow-up contact
- Benzodiazepines on discharge
- Avoiding talking about suicide
> Plus brief contact interventions.
:::
`;
