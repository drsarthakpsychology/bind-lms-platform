import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "trauma",
  num: 19,
  title: "Trauma and stressor-related disorders",
  emoji: "🌊",
  tagline: "PTSD, acute stress, adjustment, grief, and how to help without re-traumatising",
  when: "Weeks 15 to 16",
  outcomes: [
    "Define a traumatic event and apply the PTSD criteria with its four symptom clusters",
    "Distinguish acute stress disorder, PTSD, adjustment disorder and prolonged grief by timing",
    "Describe complex PTSD and the childhood attachment disorders",
    "Explain fear conditioning and why avoidance keeps PTSD going",
    "Give psychological first aid and plan trauma-focused treatment",
  ],
  writeTask:
    "On paper, from memory: criterion A for trauma, the four PTSD clusters with how many symptoms each needs, the timing rules for acute stress disorder, PTSD, adjustment disorder and prolonged grief, the three extra features of complex PTSD, and the steps of psychological first aid. Then check and correct in red.",
  activities: [
    act.lesson("anx-2", "Quiz: OCD and PTSD", "Criteria and treatment."),
    act.scenarios("ptsd", "Patient case: after the accident", "What to ask, and what not to push."),
    act.coach("therapy", "Coach: therapies", "Trauma-focused therapies."),
  ],
  noteId: "ptsd",
};

export const text = String.raw`
# Part I · PTSD

## 1.1 What counts as trauma [core]
:::define Criterion A
Exposure to **actual or threatened death, serious injury, or sexual violence**, by: (1) **directly** experiencing it; (2) **witnessing** it happen to others; (3) **learning** it happened to a close family member or friend (violent or accidental if a death); or (4) **repeated or extreme exposure to aversive details** (police, emergency staff, those handling remains). Exposure through media doesn't count unless work-related.
:::
- Many people experience trauma; most recover. PTSD develops in a minority, more after interpersonal violence (rape, torture) than accidents or disasters.
- Common in India: road accidents, domestic and sexual violence, communal and political violence, floods and earthquakes, child abuse.

:::mcq
Q: Which event meets criterion A for PTSD?
- Failing an exam
- A painful divorce
- *Witnessing a fatal road accident
- Losing a job
> Actual or threatened death, serious injury or sexual violence.
:::

## 1.2 The four symptom clusters [core]
| Cluster | Need | Symptoms |
|---|---|---|
| **B. Intrusion** | At least 1 of 5 | Intrusive memories; **nightmares**; **flashbacks** (feels it is happening again); distress at reminders; body reactions to reminders |
| **C. Avoidance** | At least 1 of 2 | Avoids thoughts and feelings about it; avoids people, places, activities that remind |
| **D. Negative changes in thinking and mood** | At least 2 of 7 | Can't recall key parts; negative beliefs (“I'm ruined”, “no one can be trusted”); distorted blame of self or others; persistent fear, horror, anger, guilt or shame; lost interest; detachment; inability to feel positive emotions |
| **E. Arousal and reactivity** | At least 2 of 6 | Irritability and anger outbursts; reckless or self-destructive behaviour; **hypervigilance**; **exaggerated startle**; poor concentration; sleep disturbance |

- **F**: lasting **more than 1 month**. **G**: distress or impairment. **H**: not due to a substance or medical condition.
- Specifiers: **with dissociative symptoms** (depersonalisation or derealisation); **with delayed expression** (full criteria met only 6 months or more after the event).
- Children 6 and under have separate, more behavioural criteria (play re-enacting the trauma, frightening dreams without clear content).

:::mnemonic Re-live, avoid, darker, on edge
**B** re-living · **C** avoiding · **D** darker thoughts and mood · **E** on edge. One, one, two, two.
:::

:::sounds How it sounds
- “Aankh band karte hi woh truck dikhta hai.” (Whenever I close my eyes I see that truck.) Intrusion.
- “Us road se nahi jaata, chahe ghanta lag jaaye.” (I won't take that road even if it takes an hour longer.) Avoidance.
- “Meri hi galti thi, main hi tez chala raha tha.” (It was my fault.) Self-blame.
- “Koi bhi awaaz ho, uchhal padta hoon.” (I jump at any sound.) Startle.
:::

:::mcq
Q: Since an assault 3 months ago, a woman has nightmares, avoids the street, blames herself and jumps at every sound. Which cluster does "blames herself" belong to?
- Intrusion
- Avoidance
- *Negative changes in thinking and mood
- Arousal
> Distorted self-blame is in cluster D.
:::

## 1.3 Why it happens and who is at risk [core]
- **Fear conditioning**: the trauma links neutral cues (a sound, smell, place) to terror. Normally fear **extinguishes** with safe exposure; in PTSD, **avoidance prevents extinction**.
- Memory: trauma memories are stored in fragments, with strong sensory detail and poor context, so they intrude as if happening now.
- Brain: overactive **amygdala**, underactive **prefrontal** control, smaller **hippocampus** (poor context: “that was then, this is now”).
- Risk: severity and type of trauma (interpersonal, repeated), previous trauma, female sex, past mental illness, **poor social support afterwards**, ongoing stress, dissociation at the time.

:::recall
1. State criterion A and the four ways of exposure. || Actual or threatened death, serious injury, sexual violence; direct, witnessed, learned about (close person), repeated aversive details.
2. Name the four clusters and the minimum numbers. || Intrusion 1, avoidance 1, negative thinking and mood 2, arousal 2.
3. How long must symptoms last for PTSD? || More than 1 month.
4. What does “with delayed expression” mean? || Full criteria met 6 months or more after the event.
5. Why does avoidance maintain PTSD? || It prevents fear extinction.
:::

:::mcq
Q: Which factor most protects against PTSD after a trauma?
- Talking through every detail the next day in a group
- *Good social support afterwards
- Starting benzodiazepines
- Avoiding all reminders forever
> Support after the event is one of the strongest protective factors.
:::

## 1.4 Assessing trauma: the trauma-informed interview [core]
:::define Trauma-informed care
An approach that assumes any patient may carry trauma, and organises care to avoid re-traumatising them. Its principles: **safety, trustworthiness and transparency, peer support, collaboration, empowerment and choice**, and sensitivity to **culture, gender and history**.
:::

### How to ask
1. **Prepare**: privacy, enough time, no family member present if violence at home is possible.
2. **Normalise and give control**: "You decide how much to tell me. We can stop whenever you want."
3. **Ask about events first, then effects**: you need to know that it happened and what it does to them now, not every detail.
4. **Watch for distress and dissociation** (staring, going blank, losing track). **Ground** the person: name five things you can see, feet on the floor, cold water, slow breathing.
5. **Close safely**: summarise, check how they feel, plan the next step. Never leave someone in the middle of a flashback.

### Screening and rating
| Tool | Use |
|---|---|
| **PC-PTSD-5** | Five-item primary care screen |
| **PCL-5** | 20-item self-report of PTSD symptoms (0 to 80); tracks progress |
| **CAPS-5** | Clinician-administered structured interview; gold standard |
| **International Trauma Questionnaire** | ICD-11 PTSD and complex PTSD |
| Adverse Childhood Experiences (ACE) questionnaire | Counts types of childhood adversity |

:::trap Do not make the patient re-live it for your notes
Asking for every detail in the first meeting can trigger severe distress and drop-out. The detailed telling belongs in a planned, trauma-focused therapy, not in the history.
:::

:::sounds Grounding in the room
"Rekha, you're here in the clinic with me. It's Tuesday, it's morning. Can you press your feet into the floor? Tell me three things you can see in this room. Take a slow breath with me. You're safe here."
:::

:::recall
1. Name four principles of trauma-informed care. || Safety, trustworthiness, collaboration, empowerment and choice (also peer support, cultural sensitivity).
2. Which tool is the gold-standard structured interview for PTSD? || CAPS-5.
3. Name two grounding techniques. || Naming things you can see, feet on the floor, cold water, slow breathing.
4. Why avoid detailed trauma accounts in a first assessment? || They can re-traumatise and cause drop-out.
:::

:::mcq
Q: While describing an assault, a woman goes blank and stops responding. The best next step is:
- Push for more detail
- *Ground her in the present and pause
- Give an injection
- End the interview without explanation
> Grounding first; detailed accounts belong in planned therapy.
:::

## 1.5 Trauma in children and after disasters [core]
### Children
- Young children show trauma through **behaviour**: re-enacting it in play, regression (bed-wetting, thumb-sucking, baby talk), clinginess, sleep problems, tantrums, new fears.
- School-age children: guilt ("it was my fault"), poor concentration, somatic complaints, school refusal.
- Adolescents: risk-taking, self-harm, substance use, withdrawal, anger.
- **The parent's response** is one of the strongest predictors of the child's recovery. Support the caregiver.
- Treatment: **trauma-focused CBT for children (TF-CBT)**, with a parent component (**PRACTICE**: Psychoeducation and parenting, Relaxation, Affect regulation, Cognitive coping, Trauma narrative, In vivo exposure, Conjoint sessions, Enhancing safety).

### Disasters and mass trauma
- In the first days most distress is **normal**, and most people recover with **practical help, social support and information**.
- The **IASC pyramid** for humanitarian settings: basic services and security (base) → community and family supports → focused non-specialised support → specialised services (top, for the few).
- In India, the **National Disaster Management Authority** has psychosocial guidelines; NIMHANS and state teams provide psychosocial support after floods, earthquakes and pandemics.

:::note What to watch for after a disaster
Bereavement, displacement and loss of livelihood drive depression and alcohol use as much as PTSD. Watch carers and first responders (police, health workers) too.
:::

:::recall
1. Name three ways trauma shows in young children. || Re-enactment in play, regression, clinginess, sleep problems.
2. What is the strongest predictor of a child's recovery? || The caregiver's response and support.
3. Describe the IASC pyramid. || Basic services, community supports, focused support, specialised services.
:::

:::mcq
Q: A 5-year-old keeps crashing toy cars after a road accident and has started bed-wetting again. Which is the best first step?
- Punish the bed-wetting
- *Recognise trauma signs and support the parents, considering TF-CBT
- Start an antipsychotic
- Ignore it
> Re-enactment in play and regression are common; the parent's response matters most.
:::

# Part II · The other trauma disorders

## 2.1 Timing tells them apart [core]
| Disorder | Timing | Key point |
|---|---|---|
| **Acute stress disorder** | **3 days to 1 month** after trauma | At least 9 of 14 symptoms across intrusion, negative mood, dissociation, avoidance, arousal |
| **PTSD** | **More than 1 month** | Four clusters |
| **Adjustment disorder** | Begins **within 3 months** of a stressor; resolves within **6 months** after the stressor or its consequences end | Distress out of proportion or impairment, not meeting another disorder; the stressor need not be traumatic (job loss, exam failure, divorce) |
| **Prolonged grief disorder** | **At least 12 months** after a death (6 months in children) | Intense yearning or preoccupation with the deceased nearly every day, plus at least 3 of: identity disruption, disbelief, avoidance of reminders, intense pain, difficulty moving on, numbness, meaninglessness, loneliness; beyond cultural norms |

- Adjustment disorder subtypes: with depressed mood, with anxiety, with mixed anxiety and depressed mood, with disturbance of conduct, mixed.

:::mnemonic Timing ladder
3 days to 1 month: acute stress. More than a month: PTSD. Starts within 3 months of any stressor: adjustment. A year after a death: prolonged grief.
:::

:::mcq
Q: Ten days after a fire, a man has intrusive memories, numbness and poor sleep. Diagnosis:
- PTSD
- *Acute stress disorder
- Adjustment disorder
- Prolonged grief disorder
> From 3 days to a month after the trauma; PTSD only after a month.
:::

## 2.2 Complex PTSD [core]
:::define Complex PTSD (ICD-11)
After **prolonged or repeated** trauma that is hard to escape (childhood abuse, domestic violence, torture, trafficking): **PTSD symptoms plus “disturbances in self-organisation”**: (1) **affect dysregulation**, (2) a persistently **negative self-concept** (worthless, ashamed, defeated), (3) **difficulties in relationships**.
:::
- Overlaps with borderline personality disorder; treatment is phased: safety and stabilisation, then trauma processing, then reconnection.

:::mcq
Q: After years of domestic violence, a woman has PTSD symptoms plus feeling worthless, intense emotional swings and difficulty trusting anyone. ICD-11 diagnosis:
- PTSD only
- *Complex PTSD
- Borderline personality disorder only
- Adjustment disorder
> PTSD plus disturbances in self-organisation.
:::

## 2.3 Childhood attachment disorders [extra]
| | Reactive attachment disorder | Disinhibited social engagement disorder |
|---|---|---|
| Picture | Emotionally **withdrawn**: rarely seeks or responds to comfort | **Over-familiar** with strangers, goes off with them without checking back |
| Cause | Severe neglect or frequently changing caregivers | Same |
| Age | Developmental age at least 9 months; evident before 5 | Developmental age at least 9 months |
| Course | Improves with stable, sensitive care | May persist even with good care |

:::recall
1. Give the timing rules for acute stress disorder, PTSD, adjustment disorder and prolonged grief. || 3 days to 1 month; over a month; within 3 months of a stressor, resolving within 6 months; 12 months after a death.
2. What three features does complex PTSD add? || Affect dysregulation, negative self-concept, relationship difficulties.
3. Contrast RAD with DSED. || Withdrawn and not seeking comfort vs over-familiar with strangers.
:::

:::mcq
Q: A 4-year-old from an institution goes off with any stranger without checking back with carers. Most likely:
- Reactive attachment disorder
- *Disinhibited social engagement disorder
- Autism
- ADHD
> Over-familiar with strangers after severe neglect.
:::

# Part III · Helping

## 3.1 In the first days: psychological first aid [core]
:::define Psychological first aid (Look, Listen, Link)
**Look** for safety, urgent needs and people in severe distress. **Listen**: approach, ask about needs, help people feel calm, don't force them to talk. **Link**: help with basic needs and information, connect with loved ones and services.
:::

:::trap Single-session debriefing
Routinely making everyone recount the trauma in detail soon after (single-session “debriefing”) **does not prevent PTSD and may worsen it**. Offer practical support, watchful waiting, and screening at about a month.
:::

:::mcq
Q: Two days after a flood, a volunteer asks what to offer survivors. The best answer is:
- Single-session debriefing for everyone
- *Psychological first aid: look, listen, link, with practical help
- Benzodiazepines for sleep
- Formal PTSD therapy for all
> Most recover with support; specialised care is for the few.
:::

## 3.2 Treatment of PTSD [core]
| Treatment | Key idea |
|---|---|
| **Trauma-focused CBT** (including cognitive processing therapy, prolonged exposure) | Process the memory, test unhelpful beliefs (self-blame), gradually face reminders |
| **EMDR** (eye movement desensitisation and reprocessing) | Recall the memory while doing bilateral stimulation (eye movements), with cognitive work |
| Narrative exposure therapy | Building a full life story, used with refugees and survivors of repeated violence |
| **SSRIs** (sertraline, paroxetine) or venlafaxine | When therapy isn't available or alongside it |
| Prazosin | Sometimes used for nightmares (mixed evidence) |

- Begin with **safety** (is the danger still present, such as an abusive partner?), stabilisation and coping skills.
- **Avoid benzodiazepines**: they don't help PTSD and may worsen outcomes.
- Treat comorbid depression, substance use and suicidality.
- Adjustment disorder: brief supportive therapy, problem-solving; grief: support, and prolonged grief therapy if needed.

:::word Asking about trauma safely
“Some people who come here have had frightening or painful things happen to them. Has anything like that happened to you? You don't have to tell me the details today; we'll go at your pace.”
:::

:::recall
1. What are the three parts of psychological first aid? || Look, listen, link.
2. Why is single-session debriefing not recommended? || It doesn't prevent PTSD and may worsen it.
3. Name two first-line therapies for PTSD. || Trauma-focused CBT and EMDR.
4. Which medicines help, and which should be avoided? || SSRIs or venlafaxine; avoid benzodiazepines.
:::

:::mcq
Q: A man with PTSD asks for "sleeping tablets" every night. Which is the best advice?
- Long-term benzodiazepines help PTSD
- *Trauma-focused therapy (or an SSRI) helps PTSD; benzodiazepines don't and may worsen outcome
- Alcohol at night is fine
- No treatment works
> Trauma-focused CBT or EMDR first.
:::

## 3.3 The trauma therapies in detail [core]
### Prolonged exposure (Foa)
- **Imaginal exposure**: retelling the trauma memory in present tense, eyes closed, recorded and listened to daily, until it loses its power.
- **In vivo exposure**: approaching safe but avoided reminders (the road, the hospital).
- Usually 8 to 15 weekly sessions.

### Cognitive processing therapy (Resick)
- Focuses on **stuck points**: beliefs about the trauma, especially **self-blame** ("I should have fought back") and over-generalised beliefs about **safety, trust, power, esteem and intimacy**.
- Writing an **impact statement** and challenging stuck points with worksheets.

### EMDR (Shapiro): eight phases
1. History and planning. 2. Preparation (safe place, coping). 3. Assessment (image, negative belief, positive belief, SUDS). 4. **Desensitisation** with bilateral stimulation. 5. Installation of the positive belief. 6. Body scan. 7. Closure. 8. Re-evaluation.

### Narrative exposure therapy
- The person tells their **whole life story** with a "lifeline" of flowers (good events) and stones (trauma), so traumatic memories are placed in context. Designed for refugees and survivors of repeated violence; used by lay counsellors.

| Choose | When |
|---|---|
| Prolonged exposure | Strong avoidance, clear single or few traumas |
| Cognitive processing therapy | Prominent guilt, shame, self-blame |
| EMDR | Patient prefers not to describe the trauma at length |
| Narrative exposure | Many traumas, low-resource or community settings |
| Phased approach (stabilise first) | Complex PTSD, ongoing danger, severe dissociation |

:::analogy The overstuffed cupboard
A trauma memory is like things shoved into a cupboard in a hurry. Every time the door opens, everything falls out (flashbacks). Therapy takes things out one by one, looks at them, and puts them back in order, so the door can open without an avalanche.
:::

:::mcq
Q: A survivor feels intense shame: "I should have fought back." The therapy that most directly targets this is:
- Prolonged exposure only
- *Cognitive processing therapy
- Narrative exposure therapy
- Hypnosis
> CPT works on stuck points such as self-blame.
:::

## 3.4 Looking after the helper [core]
:::define Secondary traumatic stress
Trauma-like symptoms (intrusive images, avoidance, arousal) in people who hear repeatedly about others' trauma: therapists, doctors, police, social workers. Related ideas: **burnout** (exhaustion, cynicism, low accomplishment) and **compassion fatigue**.
:::
- Warning signs: dreading work, numbness, irritability, intrusive images of patients' stories, drinking more, cynicism.
- Protection: **supervision**, peer support, manageable caseloads, mixing trauma work with other work, rest and exercise, life outside work, permission to seek help.
- **Vicarious resilience** also happens: helpers can grow from seeing patients recover.

:::recall
1. What are stuck points and which therapy targets them? || Unhelpful trauma beliefs such as self-blame; cognitive processing therapy.
2. Name four EMDR phases. || History, preparation, assessment, desensitisation, installation, body scan, closure, re-evaluation.
3. When would you choose a phased approach? || Complex PTSD, ongoing danger, severe dissociation.
4. Define secondary traumatic stress and two protective measures. || Trauma symptoms from hearing others' trauma; supervision, peer support, manageable caseloads.
:::

:::mcq
Q: A counsellor working with trauma survivors has intrusive images of clients' stories and dreads work. Most helpful:
- Working longer hours
- *Supervision, peer support and a manageable caseload
- Avoiding all trauma cases forever
- Keeping it to herself
> Secondary traumatic stress is common; support the helper.
:::

# Part IV · Exam zone

## 4.1 Long answer and short notes [core]
:::example Q. Discuss the clinical features and management of PTSD. (10 marks)
1. Criterion A; epidemiology and risk factors.
2. Four clusters with examples; duration; specifiers; children.
3. Aetiology: fear conditioning, memory, brain changes, risk and protective factors.
4. Differential: acute stress disorder, adjustment disorder, depression, complex PTSD, head injury.
5. Management: safety, psychological first aid, trauma-focused CBT, EMDR, SSRIs; avoid benzodiazepines.
6. Prognosis: many recover; chronic course with ongoing stress or poor support.
:::

:::word Short note: adjustment disorder
Emotional or behavioural symptoms developing within three months of an identifiable stressor (which need not be traumatic), out of proportion to it or causing significant impairment, not meeting criteria for another disorder and not normal bereavement, and resolving within six months after the stressor or its consequences end. Subtypes: depressed mood, anxiety, mixed, disturbance of conduct, mixed emotions and conduct. Management: supportive counselling, problem-solving, building coping and support; short-term symptomatic help if needed.
:::

## 4.2 Viva rapid-fire [core]
:::viva
Criterion A events? :: Actual or threatened death, serious injury or sexual violence.
Four PTSD clusters? :: Intrusion, avoidance, negative thinking and mood, arousal.
Minimum duration for PTSD? :: More than one month.
Acute stress disorder timing? :: 3 days to 1 month.
Delayed expression? :: Full criteria 6 months or more after the event.
Adjustment disorder onset? :: Within 3 months of a stressor.
Prolonged grief timing in adults? :: At least 12 months after the death.
Complex PTSD extra features? :: Affect dysregulation, negative self-concept, relationship difficulties.
What keeps PTSD going? :: Avoidance preventing extinction.
First-line therapies? :: Trauma-focused CBT and EMDR.
Medicine group used? :: SSRIs (or venlafaxine).
Avoid which medicines? :: Benzodiazepines.
Psychological first aid? :: Look, listen, link.
Is single-session debriefing recommended? :: No.
Gold-standard interview for PTSD? :: CAPS-5.
Self-report PTSD scale out of 80? :: PCL-5.
Grounding technique example? :: Name five things you can see; feet on the floor.
Strongest predictor of a child's recovery after trauma? :: Caregiver's response.
Therapy using stuck points? :: Cognitive processing therapy.
Imaginal plus in vivo exposure for PTSD? :: Prolonged exposure (Foa).
Lifeline with flowers and stones? :: Narrative exposure therapy.
IASC pyramid base? :: Basic services and security.
Trauma-like symptoms in helpers? :: Secondary traumatic stress.
:::

## 4.3 Module test [core]
:::mcq
Q: Which counts as criterion A trauma?
- Seeing a violent film
- *Being sexually assaulted
- Failing an exam
- Divorce
> Actual or threatened death, injury or sexual violence.

Q: Flashbacks, avoidance, self-blame and startle for 3 weeks after a crash suggest:
- PTSD
- *Acute stress disorder
- Adjustment disorder
- Prolonged grief
> 3 days to 1 month.

Q: Low mood and poor sleep for 6 weeks after losing a job, not meeting depression criteria:
- PTSD
- *Adjustment disorder
- Acute stress disorder
- Dysthymia
> Non-traumatic stressor within 3 months.

Q: Which therapy has strong evidence for PTSD?
- Single-session debriefing
- *EMDR
- Long-term benzodiazepines
- Flooding without consent
> Along with trauma-focused CBT.

Q: Which should be avoided in PTSD?
- Sertraline
- Trauma-focused CBT
- *Benzodiazepines
- Psychological first aid
> No benefit; may worsen outcomes.

Q: Repeated childhood abuse leading to PTSD with emotional dysregulation, shame and relationship problems suggests:
- Simple PTSD only
- *Complex PTSD
- Adjustment disorder
- Acute stress disorder
> ICD-11 complex PTSD.

Q: A neglected toddler goes off happily with any stranger. Most likely:
- Reactive attachment disorder
- *Disinhibited social engagement disorder
- Autism
- ADHD
> Over-familiarity with strangers.

Q: In PTSD, avoidance maintains symptoms by:
- Increasing extinction
- *Preventing fear extinction
- Lowering arousal permanently
- Improving memory
> Safe exposure is needed for extinction.

Q: Intense yearning for a parent 18 months after death, with inability to move on and loss of meaning:
- Normal grief
- *Prolonged grief disorder
- Adjustment disorder
- Psychotic depression
> At least 12 months after the loss in adults.

Q: During history-taking, a woman describing an assault begins staring blankly and stops responding. The best next step is:
- Ask for more detail to complete the history
- *Ground her in the present and pause the account
- Give an intramuscular benzodiazepine
- End the session without comment
> Grounding, then close safely.

Q: A survivor blames herself: "I should have screamed." The therapy that most directly targets this is:
- Prolonged exposure
- *Cognitive processing therapy
- Narrative exposure therapy
- Supportive therapy
> Stuck points of self-blame.

Q: After a flood, most survivors in the first week need:
- Formal PTSD treatment
- Single-session debriefing
- *Practical help, information and social support
- Benzodiazepines for sleep
> Specialised care is for the few at the top of the pyramid.

Q: A 5-year-old repeatedly crashes toy cars after a road accident. This is:
- Conduct disorder
- *Post-traumatic re-enactment in play
- Normal play needing no attention
- Psychosis
> Young children re-live trauma through play.
:::
`;
