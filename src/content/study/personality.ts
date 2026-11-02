import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "personality",
  num: 14,
  title: "Personality disorders",
  emoji: "🎭",
  tagline: "All ten, by cluster, and how to work with people whose patterns hurt them and others",
  when: "Weeks 11 to 12",
  outcomes: [
    "State the general criteria for a personality disorder",
    "Describe all ten DSM personality disorders by cluster, with key features",
    "Know the borderline criteria in full and the biosocial model",
    "Describe the dimensional approach (ICD-11 severity and trait domains)",
    "Plan treatment: DBT and other therapies, a crisis plan, and sensible use of medicines",
  ],
  writeTask:
    "On paper, from memory: the general criteria for personality disorder, the three clusters with all ten disorders and one defining line each, the nine borderline criteria, the four DBT skill modules, and the five ICD-11 trait domains. Then check and correct in red.",
  activities: [
    act.lesson("df-2", "Quiz: personality disorders", "Clusters and key features."),
    act.lesson("df-1", "Quiz: defence mechanisms", "Splitting, projection and friends."),
    act.coach("counselling", "Coach: counselling", "Working with difficult moments."),
    act.coach("disorders", "Coach: disorders", "The diagnoses you mix up."),
  ],
  noteId: "personality",
};

export const text = String.raw`
# Part I · What a personality disorder is

## 1.1 General criteria [core]
:::define Personality disorder
An **enduring pattern** of inner experience and behaviour that **deviates markedly from the expectations of the person's culture**, is **pervasive and inflexible**, begins in **adolescence or early adulthood**, is **stable over time**, and leads to **distress or impairment**.
:::
The pattern shows in at least 2 of:
1. **Cognition**: ways of seeing oneself, others and events
2. **Affectivity**: range, intensity, lability and appropriateness of emotion
3. **Interpersonal functioning**
4. **Impulse control**

Not better explained by another mental disorder, a substance or a medical condition (for example personality change after head injury).

:::trap Traits versus disorder
Everyone has personality traits. A disorder needs **inflexibility, pervasiveness across situations, and significant distress or impairment**. Be careful labelling in a single crisis or during another illness (a depressed person can look dependent; a manic one, narcissistic).
:::

:::note Age rules
Can be diagnosed under 18 if features have been present for at least a year, **except antisocial personality disorder**, which requires age **18 or more** and evidence of **conduct disorder before 15**.
:::

- About 1 in 10 adults has a personality disorder; much higher in clinics, prisons and among people who self-harm.
- They raise the risk of depression, substance use, suicide and poor treatment response.

:::recall
1. State the general criteria. || Enduring, culturally deviant pattern, pervasive and inflexible, onset adolescence or early adulthood, stable, causing distress or impairment.
2. Name the four areas where the pattern shows. || Cognition, affectivity, interpersonal functioning, impulse control.
3. What are the age rules for antisocial personality disorder? || 18 or older with conduct disorder before 15.
:::

# Part II · The ten disorders

## 2.1 Cluster A: odd and eccentric [core]
| Disorder | Core picture | Key features |
|---|---|---|
| **Paranoid** | Pervasive **distrust and suspicion**; others' motives read as malevolent | Suspects exploitation without basis; doubts loyalty; reads hidden insults; bears grudges; reluctant to confide; quick to counter-attack; suspicious of partner's fidelity (at least 4 of 7) |
| **Schizoid** | **Detachment** from relationships; restricted emotional range | Neither desires nor enjoys close relationships; chooses solitary activities; little interest in sex; few pleasures; no close friends; indifferent to praise or criticism; emotionally cold (at least 4 of 7) |
| **Schizotypal** | Social and interpersonal deficits with **cognitive or perceptual distortions and eccentricity** | Ideas of reference (not delusional); odd beliefs or magical thinking; unusual perceptions; odd speech; suspiciousness; inappropriate or constricted affect; odd behaviour or appearance; no close friends; social anxiety that doesn't settle with familiarity (at least 5 of 9). Genetically linked to schizophrenia |

## 2.2 Cluster B: dramatic, emotional, erratic [core]
| Disorder | Core picture | Key features |
|---|---|---|
| **Antisocial** | **Disregard for and violation of others' rights** since age 15 | Unlawful acts; deceitfulness; impulsivity; irritability and aggression; reckless disregard for safety; irresponsibility; **lack of remorse** (at least 3 of 7). Age 18 or more, conduct disorder before 15 |
| **Borderline** | **Instability** of relationships, self-image and emotions, with marked **impulsivity** | See 2.4 (at least 5 of 9) |
| **Histrionic** | Excessive **emotionality and attention seeking** | Uncomfortable when not the centre of attention; seductive or provocative; shallow, rapidly shifting emotions; uses appearance for attention; impressionistic speech; theatrical; suggestible; sees relationships as more intimate than they are (at least 5 of 8) |
| **Narcissistic** | **Grandiosity**, need for **admiration**, lack of **empathy** | Grandiose self-importance; fantasies of success or power; believes they are special; needs excessive admiration; entitlement; exploits others; lacks empathy; envious; arrogant (at least 5 of 9) |

## 2.3 Cluster C: anxious and fearful [core]
| Disorder | Core picture | Key features |
|---|---|---|
| **Avoidant** | **Social inhibition**, feelings of inadequacy, **hypersensitivity to criticism** | Avoids jobs with contact for fear of disapproval; won't get involved unless sure of being liked; restrained in intimacy; preoccupied with rejection; inhibited in new situations; sees self as inferior; reluctant to take risks (at least 4 of 7) |
| **Dependent** | Excessive **need to be taken care of**: submissive, clinging, fears separation | Can't make everyday decisions without excessive advice; needs others to take responsibility; can't disagree; can't start projects alone; goes to great lengths for support; uncomfortable alone; urgently seeks a new relationship when one ends; fears being left to care for self (at least 5 of 8) |
| **Obsessive-compulsive (OCPD)** | Preoccupation with **orderliness, perfectionism and control**, at the expense of flexibility and efficiency | Preoccupied with rules and lists; perfectionism that stops tasks being finished; excessive devotion to work; over-conscientious about morals; can't discard worthless objects; won't delegate; miserly; rigid and stubborn (at least 4 of 8). Ego-syntonic |

:::mnemonic Clusters in three words
**A = weird** (odd, eccentric) · **B = wild** (dramatic, erratic) · **C = worried** (anxious, fearful).
:::

:::sounds How each might sound in the room
- Paranoid: “Aap yeh sab kyun likh rahe ho? Kisko dikhaoge?” (Why are you writing all this? Who will you show it to?)
- Borderline: “Sab mujhe chhod dete hain. Aap bhi chhod doge.” (Everyone leaves me. You will too.)
- Narcissistic: “Mujhe senior doctor chahiye, aap mere case ke layak nahi.” (I need a senior doctor; you're not up to my case.)
- Dependent: “Mummy se poochh ke batata hoon.” (I'll tell you after asking my mother), about everyday decisions, at 35.
- Avoidant: “Log hasenge, isliye main kahin nahi jaata.” (People will laugh, so I don't go anywhere.)
:::

:::recall
1. Name the three Cluster A disorders with one line each. || Paranoid: distrust; schizoid: detachment; schizotypal: odd beliefs and perceptions.
2. Name the four Cluster B disorders with one line each. || Antisocial: violates rights; borderline: instability; histrionic: attention-seeking emotionality; narcissistic: grandiosity and no empathy.
3. Name the three Cluster C disorders with one line each. || Avoidant: inhibition and fear of criticism; dependent: need to be cared for; OCPD: perfectionism and control.
4. Which Cluster A disorder is genetically linked to schizophrenia? || Schizotypal.
5. How does avoidant differ from schizoid? || Avoidant wants relationships but fears rejection; schizoid doesn't want them.
:::

## 2.4 Borderline personality disorder in depth [core]
:::define The nine criteria (at least 5)
1. Frantic efforts to avoid real or imagined **abandonment**
2. Unstable, intense relationships swinging between **idealisation and devaluation**
3. **Identity disturbance**: unstable self-image
4. **Impulsivity** in at least two self-damaging areas (spending, sex, substances, reckless driving, binge eating)
5. Recurrent **suicidal behaviour**, gestures or threats, or **self-harm**
6. **Affective instability**: intense mood reactions usually lasting hours, rarely more than a few days
7. Chronic feelings of **emptiness**
8. Inappropriate, intense **anger** or difficulty controlling it
9. Transient, stress-related **paranoid ideas or severe dissociative** symptoms
:::

:::mnemonic DESPAIRER
**D**isturbed identity · **E**motional instability · **S**uicidal behaviour or self-harm · **P**aranoia or dissociation under stress · **A**bandonment fears · **I**mpulsivity · **R**elationships unstable · **E**mptiness · **R**age.
:::

### Why it develops: the biosocial model (Linehan)
- A **biological vulnerability** to intense, fast and slow-to-settle emotions,
- meets an **invalidating environment** (emotions dismissed, punished or ignored; sometimes abuse or neglect).
- The person never learns to name, trust or regulate emotions, and uses self-harm or impulsive acts to cope.

### Defences seen
- **Splitting**: people are all good or all bad, switching quickly.
- **Projective identification**: provoking in others the feelings one disowns.

### Course
- Most severe in early adulthood; **improves with age**: many no longer meet criteria after 10 years.
- Suicide risk is substantial (up to about 1 in 10 over a lifetime); self-harm is common.

:::trap Borderline versus bipolar
Borderline mood shifts last **hours**, are **reactive** to interpersonal events, with chronic emptiness and fear of abandonment. Bipolar episodes last **days to weeks**, with sleep and energy changes and periods of normal mood between. Both can coexist.
:::

:::recall
1. List the nine borderline criteria. || Abandonment, unstable relationships, identity, impulsivity, suicidality or self-harm, affective instability, emptiness, anger, stress paranoia or dissociation.
2. Explain the biosocial model. || Emotional vulnerability plus invalidating environment.
3. What is splitting? || Seeing people as all good or all bad.
4. What happens to borderline features with age? || They usually improve.
:::

## 2.5 The dimensional view [extra]
ICD-11 replaced named types with:
- **Severity**: personality difficulty, mild, moderate or severe personality disorder.
- **Trait domains**: **negative affectivity** (anxious, angry, low mood), **detachment** (social and emotional distance), **dissociality** (disregard for others, callousness), **disinhibition** (impulsive, distractible), **anankastia** (perfectionism, rigidity).
- A **borderline pattern** specifier.

DSM-5-TR keeps the ten categories but offers an alternative dimensional model in Section III. Dimensions reflect reality better: traits vary in degree and overlap.

:::recall
1. Name the five ICD-11 trait domains. || Negative affectivity, detachment, dissociality, disinhibition, anankastia.
:::

# Part III · Treatment

## 3.1 What works [core]
**Psychological therapy is the main treatment.** Medicines treat comorbid conditions, not the personality disorder itself.

| Therapy | Key ideas | Best evidence for |
|---|---|---|
| **Dialectical behaviour therapy (DBT)** | Balance acceptance and change; individual therapy, skills group, phone coaching, team consultation | Borderline, especially self-harm |
| Mentalisation-based therapy (MBT) | Improve the ability to understand one's own and others' minds | Borderline |
| Schema therapy | Identify and change early maladaptive schemas | Borderline and others |
| Transference-focused psychotherapy | Psychodynamic work on relationship patterns | Borderline |
| CBT | Specific beliefs and behaviours | Avoidant, others |

:::mnemonic The four DBT skill modules
**Mindfulness** · **Distress tolerance** · **Emotion regulation** · **Interpersonal effectiveness**.
:::

### Principles for every clinician
- A **consistent, clear, non-judgemental** relationship; agree boundaries and stick to them kindly.
- A written **crisis plan** made with the patient: triggers, warning signs, coping steps, who to call.
- Validate emotions before problem-solving (“It makes sense you're furious after being left out”).
- Avoid repeated emergency admissions where possible (they can reinforce crises); short admissions for genuine high risk.
- Look after the team: these patients often provoke strong feelings (countertransference); supervision helps.

### Medicines
- No medicine is licensed for borderline PD itself.
- Treat comorbid depression, anxiety, ADHD or substance use.
- For short crises, a sedating antihistamine or low-dose antipsychotic briefly. **Avoid benzodiazepines** (disinhibition, dependence) and large supplies of toxic drugs (overdose).
- Antisocial PD: treat substance use; programmes for anger and offending behaviour; risk management.

:::recall
1. What is the main treatment for personality disorders? || Psychological therapy.
2. Name the four DBT skills modules. || Mindfulness, distress tolerance, emotion regulation, interpersonal effectiveness.
3. Why avoid benzodiazepines in borderline PD? || Disinhibition, dependence, overdose risk.
4. What goes into a crisis plan? || Triggers, warning signs, coping steps, contacts.
:::

# Part IV · Exam zone

## 4.1 Long answer and short notes [core]
:::example Q. Classify personality disorders and discuss borderline personality disorder. (15 marks)
1. Definition and general criteria; traits vs disorder.
2. Classification: three clusters with all ten disorders in a table; ICD-11 dimensional model.
3. Epidemiology and burden.
4. Borderline: nine criteria with examples, biosocial model, splitting and projective identification.
5. Differential: bipolar, complex PTSD, depression, substance use.
6. Management: DBT (four modules), MBT, schema therapy; crisis planning; medicine principles.
7. Course and prognosis: improves with age; suicide risk.
:::

:::word Short note: antisocial personality disorder
A pervasive pattern of disregard for and violation of the rights of others since age fifteen, shown by at least three of unlawful behaviour, deceitfulness, impulsivity, irritability and aggression, reckless disregard for safety, consistent irresponsibility and lack of remorse; the person is at least eighteen and had conduct disorder before fifteen. More common in men, prisons and substance use services. Risk factors include genetic loading, harsh or inconsistent parenting, abuse and early conduct problems. Management centres on risk assessment, treating substance use and structured programmes; prognosis improves somewhat in middle age.
:::

## 4.2 Viva rapid-fire [core]
:::viva
Three areas of the general criteria (name two)? :: Cognition, affectivity, interpersonal functioning, impulse control (two of four).
When does a personality disorder begin? :: Adolescence or early adulthood.
Cluster A theme? :: Odd and eccentric.
Cluster B theme? :: Dramatic, emotional, erratic.
Cluster C theme? :: Anxious and fearful.
Age rule for antisocial PD? :: 18 or older, conduct disorder before 15.
How many borderline criteria are needed? :: Five of nine.
Core of narcissistic PD? :: Grandiosity, need for admiration, lack of empathy.
Avoidant vs schizoid? :: Avoidant wants closeness but fears rejection; schizoid doesn't want it.
Which PD is ego-syntonic perfectionism? :: Obsessive-compulsive personality disorder.
Which Cluster A PD is linked to schizophrenia? :: Schizotypal.
Biosocial model? :: Emotional vulnerability plus invalidating environment.
Four DBT modules? :: Mindfulness, distress tolerance, emotion regulation, interpersonal effectiveness.
Who developed DBT? :: Marsha Linehan.
Five ICD-11 trait domains? :: Negative affectivity, detachment, dissociality, disinhibition, anankastia.
Course of borderline PD with age? :: Usually improves.
:::

## 4.3 Module test [core]
:::mcq
Q: A woman has unstable relationships, fear of abandonment, self-harm, chronic emptiness and mood shifts lasting hours. Diagnosis:
- Bipolar II disorder
- *Borderline personality disorder
- Histrionic personality disorder
- Cyclothymia
> Reactive shifts in hours with abandonment fears.

Q: Antisocial personality disorder requires:
- Age 16 and any criminal record
- *Age 18 and conduct disorder before 15
- Psychopathy checklist score
- Substance use
> DSM age and history rules.

Q: A man avoids people because he fears criticism but longs for friends. Diagnosis:
- Schizoid
- *Avoidant
- Paranoid
- Dependent
> Wants relationships but fears rejection.

Q: Odd beliefs, magical thinking, unusual perceptions and odd speech without psychosis suggest:
- Schizoid PD
- *Schizotypal PD
- Paranoid PD
- Autism only
> Cluster A with cognitive-perceptual distortions.

Q: Grandiosity, entitlement, need for admiration and lack of empathy:
- Histrionic PD
- *Narcissistic PD
- Antisocial PD
- Borderline PD
> Classic narcissistic triad.

Q: Which therapy has the strongest evidence for reducing self-harm in borderline PD?
- Psychoanalysis
- *Dialectical behaviour therapy
- Hypnotherapy
- Flooding
> DBT.

Q: Which is NOT a DBT skills module?
- Mindfulness
- Distress tolerance
- *Free association
- Emotion regulation
> The fourth is interpersonal effectiveness.

Q: Seeing a therapist as perfect one week and useless the next reflects:
- Projection
- *Splitting
- Sublimation
- Reaction formation
> All good or all bad.

Q: Medicines in borderline PD are mainly used to:
- Cure the disorder
- *Treat comorbid conditions or short crises
- Replace therapy
- Prevent ageing
> No medicine treats the disorder itself.

Q: Which personality disorder is defined by an excessive need to be taken care of?
- Avoidant
- *Dependent
- Histrionic
- OCPD
> Submissive, clinging, fear of separation.
:::
`;
