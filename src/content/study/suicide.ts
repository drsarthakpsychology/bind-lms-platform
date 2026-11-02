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

## 3.3 Risk to others [extra]
- Assess thoughts of harming others the same way: ideation, intent, plan, target, means, history of violence.
- Strongest predictor: **past violence**. Others: substance use, young male, antisocial traits, persecutory delusions with anger, command hallucinations to harm, non-adherence, recent stressors.
- Most people with mental illness are not violent and are more often victims.
- Where there is a serious risk to an identifiable person, confidentiality may be breached to protect them; always involve a senior.

:::recall
1. What is the strongest predictor of violence? || Past violence.
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
:::
`;
