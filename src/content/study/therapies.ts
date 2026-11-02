import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "therapies",
  num: 13,
  title: "Psychotherapies and counselling",
  emoji: "🛋️",
  tagline: "What actually helps people change: CBT, behaviour therapy, psychodynamic, IPT, DBT, ACT, family and group work",
  when: "Weeks 9 to 10",
  outcomes: [
    "Explain the common factors that make all therapy work",
    "Describe the theory and techniques of CBT and behaviour therapy",
    "Describe psychodynamic, interpersonal, DBT, ACT and mindfulness-based approaches",
    "Know family, group and couple therapies and Yalom's factors",
    "Match a therapy to a problem, and adapt it to Indian clients",
  ],
  writeTask:
    "On paper, from memory: the common factors, the CBT cognitive model with a five-column thought record, six behaviour therapy techniques with their principle, the ABCDE of REBT, the four IPT problem areas, the six ACT processes, and five of Yalom's factors. Then check and correct in red.",
  activities: [
    act.coach("therapy", "Coach: therapies", "Techniques and their founders."),
    act.coach("counselling", "Coach: counselling", "Micro-skills and tricky moments."),
    act.scenarios("depression", "Patient case: “Mann nahi lagta”", "Putting the skills to work."),
  ],
  noteId: "therapies",
};

export const text = String.raw`
# Part I · Foundations

## 1.1 What makes therapy work [core]
:::define Common factors
Across therapies, outcomes depend heavily on shared ingredients: the **therapeutic alliance** (agreement on goals and tasks, and a bond), **empathy**, **positive regard and genuineness** (Rogers), **hope and expectation**, a credible **rationale** and **rituals** of treatment, and the client's own resources and circumstances.
:::
- Carl Rogers' **person-centred** conditions: **empathy, unconditional positive regard, congruence (genuineness)**.
- Micro-skills: attending, open questions, paraphrasing, reflecting feelings, summarising, silence, gentle challenge.
- Supportive psychotherapy: strengthens coping and defences, reassurance after assessment, advice, problem-solving; the backbone of much everyday practice.

### Matching therapy to problem
| Problem | Therapies with good evidence |
|---|---|
| Depression | CBT, behavioural activation, IPT, problem-solving; MBCT to prevent relapse |
| Anxiety disorders | CBT with exposure |
| OCD | Exposure and response prevention |
| PTSD | Trauma-focused CBT, EMDR |
| Borderline PD | DBT, MBT, schema therapy |
| Psychosis | CBTp, family intervention |
| Eating disorders | Family-based treatment (adolescents), CBT-E |
| Substance use | Motivational interviewing, CBT, contingency management |
| Insomnia | CBT-I |

:::recall
1. Name four common factors. || Alliance, empathy, hope, credible rationale (also positive regard, genuineness).
2. Rogers' three core conditions? || Empathy, unconditional positive regard, congruence.
:::

# Part II · Behavioural and cognitive therapies

## 2.1 Behaviour therapy [core]
Based on learning theory: **classical conditioning** (Pavlov, Watson), **operant conditioning** (Skinner), **social learning** (Bandura).

| Technique | Principle | Use |
|---|---|---|
| **Systematic desensitisation** (Wolpe) | Reciprocal inhibition: relaxation paired with a graded fear hierarchy | Phobias |
| **Exposure** (graded, prolonged, flooding) | Extinction of fear by staying with it | Anxiety disorders |
| **Exposure and response prevention** | Exposure plus blocking rituals | OCD |
| **Token economy** | Positive reinforcement with exchangeable tokens | Wards, children, intellectual disability |
| **Shaping** | Reinforcing successive approximations | Skill learning, autism |
| **Modelling** (Bandura) | Learning by watching | Social skills, phobias |
| **Aversion therapy** | Pairing a behaviour with an unpleasant stimulus | Rarely used now (ethics) |
| **Habit reversal** | Awareness training plus competing response | Tics, trichotillomania |
| **Behavioural activation** | Scheduling rewarding and meaningful activities | Depression |
| Relaxation (Jacobson's progressive muscle relaxation) | Reduce arousal | Anxiety, insomnia |

:::define Reinforcement and punishment
**Positive reinforcement** adds something pleasant to increase a behaviour (praise). **Negative reinforcement** removes something unpleasant to increase a behaviour (relief from anxiety after avoidance or rituals). **Punishment** decreases behaviour. **Extinction**: a behaviour fades when no longer reinforced.
:::

:::trap Negative reinforcement is not punishment
Negative reinforcement **increases** a behaviour by removing something unpleasant: avoidance relieves anxiety, so avoidance grows. That's exactly why OCD rituals and phobic avoidance persist.
:::

## 2.2 Cognitive behavioural therapy [core]
:::define The cognitive model (Beck)
It is not events themselves but **how we interpret them** that shapes feelings and behaviour. Situation → **automatic thoughts** → emotions, body sensations, behaviour. Thoughts come from **intermediate beliefs** (rules, assumptions) and **core beliefs** (schemas: “I am unlovable”).
:::

### Structure of CBT
- Short-term (often 8 to 20 sessions), structured, **collaborative**, present-focused, with **homework**.
- Session: mood check, agenda, review homework, work on a problem, new homework, feedback.
- **Socratic questioning** and **guided discovery** rather than telling.

### Core techniques
| Technique | What it involves |
|---|---|
| Psychoeducation | Explaining the model and the problem |
| **Thought record** | Situation, emotion (rated), automatic thought, evidence for and against, balanced thought, re-rated emotion |
| Identifying distortions | All-or-nothing, catastrophising, mind reading, personalisation, should statements |
| **Behavioural experiments** | Testing a belief in real life (“If I speak up, everyone will laugh”) |
| Activity scheduling, graded tasks | Depression |
| Problem-solving | Define, brainstorm, choose, act, review |
| Relapse prevention | Early signs and plans |

### Rational emotive behaviour therapy (Albert Ellis)
:::mnemonic ABCDE
**A**ctivating event → **B**elief (irrational: “I must be perfect”) → **C**onsequence (emotion, behaviour) → **D**isputing the belief → **E**ffective new belief.
:::

:::word A thought record entry
- Situation: Boss didn't reply to my message.
- Emotion: anxious, 80%.
- Automatic thought: “She's angry; I'll be fired.”
- Evidence for: she replied to others. Evidence against: she's in meetings all day; last week she praised my work.
- Balanced thought: “She's probably busy. One unanswered message doesn't mean I'm in trouble.”
- Re-rated: anxious, 30%.
:::

## 2.3 Third-wave therapies [core]
| Therapy | Key ideas |
|---|---|
| **DBT** (Linehan) | Dialectic of acceptance and change; four skills modules: **mindfulness, distress tolerance, emotion regulation, interpersonal effectiveness**; for borderline PD and self-harm |
| **ACT** (Acceptance and Commitment Therapy, Hayes) | Six processes (the hexaflex): **acceptance, cognitive defusion, being present, self-as-context, values, committed action**. Aim: psychological flexibility, not symptom removal |
| **MBCT** (mindfulness-based cognitive therapy) | Mindfulness plus CBT; prevents relapse after 3 or more depressive episodes |
| Compassion-focused therapy | Building self-compassion for shame and self-criticism |
| Schema therapy | Early maladaptive schemas and modes; personality disorders |

:::recall
1. Define positive and negative reinforcement. || Adding something pleasant; removing something unpleasant, both increasing behaviour.
2. Which technique is based on reciprocal inhibition? || Systematic desensitisation.
3. Describe the columns of a thought record. || Situation, emotion, automatic thought, evidence for and against, balanced thought, re-rated emotion.
4. Expand ABCDE. || Activating event, belief, consequence, disputing, effective new belief.
5. Name the six ACT processes. || Acceptance, defusion, present moment, self-as-context, values, committed action.
6. When is MBCT used? || To prevent relapse after 3 or more depressive episodes.
:::

# Part III · Other approaches

## 3.1 Psychodynamic therapy [core]
- Aims to bring **unconscious conflicts** and repeating relationship patterns into awareness, so the person can choose differently.
- Techniques: **free association**, **interpretation**, exploring **transference** and countertransference, working with **resistance** and defences, **working through**.
- Forms: classical psychoanalysis (several sessions a week, years), psychodynamic psychotherapy (weekly), brief dynamic therapy (focused, time-limited).
- Evidence supports it for depression and personality difficulties; less structured than CBT.

## 3.2 Interpersonal therapy (IPT) [core]
- Time-limited therapy linking mood to relationships. Pick one or two of **four problem areas**:
  1. **Grief** (complicated bereavement)
  2. **Role disputes** (conflicts with partner, family, work)
  3. **Role transitions** (marriage, job loss, migration, becoming a parent)
  4. **Interpersonal deficits** (isolation)
- Effective for depression, including perinatal and adolescent depression.

## 3.3 Family, couple and group therapy [core]
| Approach | Key ideas |
|---|---|
| **Structural family therapy** (Minuchin) | Family structure, boundaries, hierarchies, subsystems; enmeshed vs disengaged families |
| Strategic family therapy (Haley) | Directives, reframing, paradoxical tasks |
| Systemic (Milan) | Circular questioning; the problem as part of a family system |
| Family psychoeducation | Reduces expressed emotion and relapse in psychosis and bipolar disorder |
| Couple therapy | Communication, conflict resolution; sensate focus for sexual problems |

### Group therapy: Yalom's therapeutic factors
**Instillation of hope**, **universality** (“I'm not alone”), imparting information, **altruism**, corrective recapitulation of the family group, development of socialising techniques, imitative behaviour, **interpersonal learning**, **group cohesiveness**, **catharsis**, existential factors.

## 3.4 Adapting therapy for Indian clients [core]
- **Family involvement** is often expected; agree with the client what is shared.
- Clients may expect a more **directive, guru-like** role at first; build collaboration gradually.
- Use **local idioms** (“tension”, “mann”) and examples; translate homework; account for literacy.
- Respect religious and spiritual coping; integrate **yoga, breathing (pranayama), meditation** where the client finds them meaningful.
- Fewer sessions are often possible (cost, distance): be focused and practical; consider tele-therapy.
- Stigma: frame therapy as skill-building or “counselling for stress” if that helps engagement.

:::recall
1. Name four psychodynamic techniques. || Free association, interpretation, transference work, working through resistance.
2. List the four IPT problem areas. || Grief, role disputes, role transitions, interpersonal deficits.
3. Who developed structural family therapy, and what does it focus on? || Minuchin; boundaries, hierarchy, subsystems.
4. Name five of Yalom's factors. || Hope, universality, altruism, interpersonal learning, cohesiveness, catharsis.
5. Give three ways to adapt therapy for Indian clients. || Family involvement, local idioms, directive start, spiritual coping, brief focused work.
:::

# Part IV · Exam zone

## 4.1 Long answer and short notes [core]
:::example Q. Describe cognitive behaviour therapy for depression. (15 marks)
1. Theory: Beck's cognitive model; triad; schemas; distortions.
2. Structure: assessment, formulation, collaborative goals, session structure, homework.
3. Behavioural components: activity monitoring and scheduling, graded tasks, behavioural activation.
4. Cognitive components: identifying automatic thoughts, thought records, Socratic questioning, behavioural experiments, core beliefs.
5. Relapse prevention; MBCT for recurrent depression.
6. Evidence and indications; combining with medicines.
7. Indian adaptation; limitations.
:::

:::word Short note: token economy
A behaviour modification programme based on operant conditioning in which desired behaviours earn tokens (points, stars, chips) that can later be exchanged for rewards or privileges. Requires clear target behaviours, consistent immediate reinforcement, and a menu of meaningful back-up rewards, with gradual fading to natural reinforcers. Used in psychiatric wards (rehabilitation in chronic schizophrenia), classrooms, and with children and people with intellectual disability. Limitations: generalisation outside the programme and ethical concerns about withholding basic rights.
:::

## 4.2 Viva rapid-fire [core]
:::viva
Rogers' three conditions? :: Empathy, unconditional positive regard, congruence.
Founder of systematic desensitisation? :: Joseph Wolpe.
Founder of operant conditioning? :: B. F. Skinner.
Founder of social learning theory? :: Albert Bandura.
Founder of CBT? :: Aaron Beck.
Founder of REBT? :: Albert Ellis.
Founder of DBT? :: Marsha Linehan.
Founder of ACT? :: Steven Hayes.
Founder of structural family therapy? :: Salvador Minuchin.
Negative reinforcement? :: Removing something unpleasant to increase a behaviour.
Four IPT problem areas? :: Grief, role disputes, role transitions, interpersonal deficits.
Four DBT modules? :: Mindfulness, distress tolerance, emotion regulation, interpersonal effectiveness.
Therapy for relapse prevention after 3 depressive episodes? :: MBCT.
Yalom's factor “I'm not alone”? :: Universality.
Jacobson's technique? :: Progressive muscle relaxation.
:::

## 4.3 Module test [core]
:::mcq
Q: Avoiding a feared situation relieves anxiety and so avoidance increases. This is:
- Positive reinforcement
- *Negative reinforcement
- Punishment
- Extinction
> Removing an unpleasant state strengthens the behaviour.

Q: Pairing relaxation with a graded fear hierarchy is:
- Flooding
- *Systematic desensitisation
- Aversion therapy
- Token economy
> Wolpe's reciprocal inhibition.

Q: In CBT, the column after “automatic thought” in a thought record is usually:
- Core belief
- *Evidence for and against
- Homework
- Diagnosis
> Then a balanced thought.

Q: Which is NOT one of the four IPT areas?
- Grief
- Role disputes
- *Cognitive distortions
- Role transitions
> The fourth is interpersonal deficits.

Q: Acceptance, defusion and values-based committed action belong to:
- DBT
- *ACT
- REBT
- Psychoanalysis
> The ACT hexaflex.

Q: A therapy that reduces expressed emotion in families of people with schizophrenia:
- Flooding
- *Family psychoeducation
- Hypnosis
- Aversion therapy
> Reduces relapse.

Q: “Hearing others in the group with the same problem, I feel I'm not alone.” Yalom's factor:
- Catharsis
- *Universality
- Altruism
- Cohesiveness
> Shared experience.

Q: Which is a psychodynamic technique?
- Thought record
- Token economy
- *Free association
- Exposure hierarchy
> Saying whatever comes to mind.

Q: Which therapy has the strongest evidence for borderline personality disorder with self-harm?
- REBT
- *DBT
- Psychoanalysis
- Systematic desensitisation
> Developed for chronically suicidal clients.
:::
`;
