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

## 2.2 Complex PTSD [core]
:::define Complex PTSD (ICD-11)
After **prolonged or repeated** trauma that is hard to escape (childhood abuse, domestic violence, torture, trafficking): **PTSD symptoms plus “disturbances in self-organisation”**: (1) **affect dysregulation**, (2) a persistently **negative self-concept** (worthless, ashamed, defeated), (3) **difficulties in relationships**.
:::
- Overlaps with borderline personality disorder; treatment is phased: safety and stabilisation, then trauma processing, then reconnection.

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

# Part III · Helping

## 3.1 In the first days: psychological first aid [core]
:::define Psychological first aid (Look, Listen, Link)
**Look** for safety, urgent needs and people in severe distress. **Listen**: approach, ask about needs, help people feel calm, don't force them to talk. **Link**: help with basic needs and information, connect with loved ones and services.
:::

:::trap Single-session debriefing
Routinely making everyone recount the trauma in detail soon after (single-session “debriefing”) **does not prevent PTSD and may worsen it**. Offer practical support, watchful waiting, and screening at about a month.
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
:::
`;
