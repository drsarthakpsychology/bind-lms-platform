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

## 1.2 Formulation: the 5 Ps [core]
:::define Case formulation
A short, shared explanation of **why this person has this problem now, and what keeps it going**. It links assessment to treatment. Without a formulation, therapy becomes a list of techniques.
:::

| P | Question | Example (a 24-year-old with panic attacks) |
|---|---|---|
| **Presenting problem** | What is the difficulty? | Panic attacks for 6 months, now avoids the metro |
| **Predisposing** | What made the person vulnerable? | Anxious mother, childhood asthma with frightening breathlessness |
| **Precipitating** | What triggered it now? | First attack after a night of no sleep before exams, with lots of coffee |
| **Perpetuating** | What keeps it going? | Catastrophic thought "I'm having a heart attack"; avoidance; checking pulse; always carrying water |
| **Protective** | What strengths help? | Supportive sister, motivated, good insight, studies well |

:::analogy A formulation is a map, not a verdict
It is written in pencil. You share it with the patient ("does this fit?"), change it when new facts come in, and use it to choose where to intervene. The **perpetuating** factors are where therapy usually starts, because they are what can change now.
:::

### The shape of a course of therapy
1. **Assessment and engagement**: history, risk, goals, building the alliance.
2. **Formulation and contract**: shared understanding; number and length of sessions, confidentiality and its limits, cancellations.
3. **Active phase**: techniques chosen from the formulation; regular review with measures (PHQ-9, GAD-7).
4. **Ending**: planned from the start; review gains, relapse prevention plan, booster sessions.

:::trap Endings matter
An abrupt ending can repeat earlier losses for the patient. Mention the number of sessions at the start and count down ("we have four more sessions").
:::

:::recall
1. Expand the 5 Ps. || Presenting, predisposing, precipitating, perpetuating, protective.
2. Which P do most therapies target first and why? || Perpetuating factors, because they can change now.
3. Name the four phases of a course of therapy. || Assessment and engagement, formulation and contract, active phase, ending.
:::

## 1.3 Motivational interviewing [core]
:::define Motivational interviewing (Miller and Rollnick)
A collaborative conversation style that **strengthens a person's own motivation for change** by exploring and resolving **ambivalence**. It is widely used in substance use, but helps any time someone is unsure about change.
:::

### Stages of change (Prochaska and DiClemente)
| Stage | Person says | Your task |
|---|---|---|
| **Precontemplation** | "I don't have a problem" | Raise doubt, give information without pressure |
| **Contemplation** | "Maybe I drink too much, but..." | Explore ambivalence, pros and cons |
| **Preparation** | "I want to cut down next month" | Help plan, set a date |
| **Action** | "I've stopped for two weeks" | Support, problem-solve, reinforce |
| **Maintenance** | "Six months sober" | Prevent relapse |
| **Relapse** | "I slipped at a wedding" | Normalise, learn, re-enter the cycle |

### The spirit and the skills
- Spirit: **partnership, acceptance, compassion, evocation** (drawing out the person's own reasons).
- **OARS**: **O**pen questions, **A**ffirmations, **R**eflective listening, **S**ummaries.
- Listen for and strengthen **change talk** (desire, ability, reasons, need, commitment). Avoid the **righting reflex** (the urge to argue for change, which makes the person argue against it).

:::sounds How it sounds in the room
Patient: "Everyone keeps nagging me about my drinking. It's not that bad."
Poor: "You must stop; your liver test is abnormal."
Better: "It sounds frustrating to be told what to do. At the same time you came today, so something is on your mind. What concerns you, if anything, about your drinking?"
:::

:::recall
1. Name the six stages of change. || Precontemplation, contemplation, preparation, action, maintenance, relapse.
2. Expand OARS. || Open questions, affirmations, reflective listening, summaries.
3. What is the righting reflex and why avoid it? || The urge to argue for change; it provokes resistance.
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

## 2.4 Exposure and behavioural activation in detail [core]
### Exposure therapy, step by step
1. **Psychoeducation**: avoidance keeps fear alive; facing fear safely lets it fall.
2. **Build a hierarchy** with the patient: situations rated 0 to 100 in **SUDS** (subjective units of distress).
3. **Start around 30 to 40 SUDS**, stay in the situation until fear falls noticeably or the expectation is disproved, repeat until easy, then climb.
4. **Drop safety behaviours** (carrying water, holding a rail, checking pulse), which stop the brain learning that the situation is safe.
5. **Daily homework**; review progress each session.

| Type | How |
|---|---|
| **In vivo** | Real-life situations (riding the metro) |
| **Imaginal** | Vividly imagining the feared scene (trauma memories, catastrophes) |
| **Interoceptive** | Bringing on the feared body sensations (spinning in a chair, running on the spot, breathing through a straw) for panic disorder |
| **Exposure and response prevention (ERP)** | Exposure to obsessional triggers while **not** doing the compulsion (OCD) |
| **Flooding** | Starting at the top of the hierarchy; effective but harder to tolerate |

:::note Why exposure works
The older idea was **habituation** (fear fades with time). The newer **inhibitory learning** model says exposure builds a **new safety memory** that competes with the old fear memory. So: vary the situations, drop safety behaviours, and test the feared prediction ("I will faint") directly.
:::

### Behavioural activation for depression
- Depression shrinks life: less activity leads to less reward, which deepens low mood.
- Steps: **activity monitoring** (a diary with mood and sense of mastery and pleasure), find patterns, **schedule** valued and enjoyable activities, start small (**graded task assignment**), tackle **avoidance** (TRAP: Trigger, Response, Avoidance Pattern; replace with TRAC: Trigger, Response, Alternative Coping).
- As effective as full CBT for many people, and easier to teach to lay counsellors (the basis of the **Healthy Activity Programme** tested in Goa).

:::recall
1. What does SUDS stand for and where should exposure start? || Subjective units of distress; around 30 to 40.
2. Why should safety behaviours be dropped during exposure? || They prevent learning that the situation is safe.
3. What is interoceptive exposure and for which disorder? || Bringing on feared body sensations; panic disorder.
4. Expand TRAP and TRAC. || Trigger, Response, Avoidance Pattern; Trigger, Response, Alternative Coping.
:::

## 2.5 Cognitive distortions and DBT skills [core]
### Thinking errors (cognitive distortions)
| Distortion | What it sounds like |
|---|---|
| **All-or-nothing** | "If I don't top, I've failed" |
| **Overgeneralisation** | "I always mess up" |
| **Mental filter** | Remembers the one criticism, forgets the ten compliments |
| **Disqualifying the positive** | "They only praised me to be polite" |
| **Mind reading** | "He thinks I'm stupid" |
| **Fortune telling** | "I'll definitely fail the interview" |
| **Catastrophising** | "If I fail, my life is ruined" |
| **Emotional reasoning** | "I feel guilty, so I must have done wrong" |
| **Should statements** | "I should never feel sad" |
| **Labelling** | "I'm a loser" |
| **Personalisation** | "My son failed because I'm a bad mother" |

### Beck's levels of cognition
- **Automatic thoughts** (surface, situation-specific) → **intermediate beliefs** (rules and assumptions: "If people see my weakness, they'll reject me") → **core beliefs** (deep: "I am unlovable").
- **Downward arrow technique**: "And if that were true, what would it mean about you?" reveals the core belief.

### DBT skills worth knowing by name
| Module | Skill | What it is |
|---|---|---|
| Distress tolerance | **TIPP** | Temperature (cold water on the face), Intense exercise, Paced breathing, Paired muscle relaxation |
| Distress tolerance | **Radical acceptance** | Fully accepting what cannot be changed right now |
| Emotion regulation | **Opposite action** | Acting opposite to the emotion's urge when it doesn't fit the facts |
| Emotion regulation | **PLEASE** | Treat PhysicaL illness, balanced Eating, avoid mood-Altering drugs, balanced Sleep, Exercise |
| Interpersonal effectiveness | **DEAR MAN** | Describe, Express, Assert, Reinforce; stay Mindful, Appear confident, Negotiate |
| Mindfulness | **Wise mind** | Balancing emotion mind and reasonable mind |

- **Chain analysis**: after self-harm, trace the chain of vulnerability, trigger, thoughts, feelings, urges, behaviour and consequences to find points to change.
- DBT has four parts: individual therapy, **group skills training**, **phone coaching**, and a **therapist consultation team**.

:::recall
1. Give five cognitive distortions with an example each. || All-or-nothing, overgeneralisation, mind reading, catastrophising, personalisation, and others.
2. Name Beck's three levels of cognition. || Automatic thoughts, intermediate beliefs, core beliefs.
3. Expand DEAR MAN. || Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate.
4. Name the four parts of DBT. || Individual therapy, group skills, phone coaching, consultation team.
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

## 3.5 Other therapies and the therapist's ethics [core]
### More approaches you should be able to define
| Therapy | Key idea |
|---|---|
| **Supportive psychotherapy** | Strengthens coping and adaptive defences; reassurance, advice, encouragement; for crises, chronic illness, fragile patients |
| **Problem-solving therapy** | Structured steps: define the problem, brainstorm, weigh options, act, review. Good in primary care and for older adults |
| **Solution-focused brief therapy** | Focus on exceptions and solutions, not problems; the **miracle question** ("If a miracle happened overnight, what would be different?") |
| **Narrative therapy** | Separating the person from the problem ("externalising": "the anger" not "your anger") |
| **Gestalt therapy** (Perls) | Awareness in the here and now; **empty chair** technique |
| **Transactional analysis** (Berne) | Parent, Adult and Child ego states; games people play |
| **Logotherapy** (Frankl) | Finding meaning, even in suffering |
| **Existential therapy** (Yalom) | Death, freedom, isolation, meaninglessness |
| **Hypnotherapy** | Focused attention and suggestion; habit and pain work; not for psychosis |
| **Biofeedback** | Seeing body signals (muscle tension, heart rate variability) to learn control |
| **Eye movement desensitisation and reprocessing (EMDR)** | Recalling trauma memories with bilateral stimulation; effective for PTSD |

### Indian contributions
- **Yoga and meditation**: evidence as an add-on for depression and anxiety; yoga studies at NIMHANS in schizophrenia show benefit for negative symptoms and function.
- **The guru-chela model** (described by J. S. Neki): Indian patients may expect a more directive, warm, teacher-like therapist rather than a neutral one.
- **Family involvement** is the norm; therapy plans often work better with families included from the start.

### Ethics and boundaries
- **Confidentiality** with clear limits: risk to self or others, child protection, court orders. Tell the patient these limits at the start.
- **Boundaries**: no dual relationships (treating a friend, business dealings), no sexual contact ever, care with gifts and touch, no self-disclosure for the therapist's own benefit.
- **Competence and supervision**: work within training; use supervision for difficult cases and for countertransference.
- **Documentation**: brief, factual, risk-focused notes.

:::trap Boundary crossings versus violations
A **crossing** (accepting a small box of sweets at Diwali, a brief supportive touch on the shoulder at a funeral) may be harmless and culturally fitting if thought through. A **violation** exploits the patient and harms them (romantic contact, borrowing money, using the patient's information). Crossings that increase in frequency can slide into violations.
:::

:::recall
1. What is the miracle question and which therapy uses it? || "If a miracle happened, what would be different?"; solution-focused brief therapy.
2. Who developed the empty chair technique? || Fritz Perls (Gestalt therapy).
3. Name Berne's three ego states. || Parent, Adult, Child.
4. List three limits of confidentiality. || Serious risk to self or others, child protection, court orders.
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
Expand the 5 Ps of formulation? :: Presenting, predisposing, precipitating, perpetuating, protective.
Founders of motivational interviewing? :: Miller and Rollnick.
Stages of change model? :: Prochaska and DiClemente.
Expand OARS? :: Open questions, affirmations, reflections, summaries.
SUDS? :: Subjective units of distress.
Exposure to feared body sensations? :: Interoceptive exposure.
Newer model of how exposure works? :: Inhibitory learning.
Technique to find a core belief? :: Downward arrow.
DBT skill for asking for something? :: DEAR MAN.
Miracle question? :: Solution-focused brief therapy.
Empty chair? :: Gestalt therapy, Fritz Perls.
Logotherapy? :: Viktor Frankl; finding meaning.
Guru-chela model of Indian psychotherapy? :: J. S. Neki.
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

Q: A patient says, "I've decided to quit next month and told my wife." The stage of change is:
- Precontemplation
- Contemplation
- *Preparation
- Maintenance
> Planning with a date.

Q: In a panic disorder formulation, "checking pulse and carrying water" are:
- Predisposing factors
- Precipitating factors
- *Perpetuating factors (safety behaviours)
- Protective factors
> They keep the fear going.

Q: "My son failed because I'm a bad mother" is an example of:
- Mind reading
- *Personalisation
- Emotional reasoning
- Labelling
> Taking responsibility for an outcome not under one's control.

Q: Spinning in a chair to bring on dizziness is used in:
- ERP for OCD
- *Interoceptive exposure for panic disorder
- Behavioural activation
- Flooding for PTSD
> It teaches that the sensations are not dangerous.

Q: Which is a boundary violation rather than a crossing?
- Accepting a small festival sweet box
- *Borrowing money from a patient
- Attending a patient's funeral service for a relative, with thought
- Offering a tissue
> Violations exploit the patient.
:::
`;
