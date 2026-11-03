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

:::mcq
Q: A 25-year-old has been impulsive and unstable in relationships only since a head injury 6 months ago. A personality disorder diagnosis is:
- Correct
- *Wrong: the pattern must be long-standing from adolescence or early adulthood; think personality change due to a medical condition
- Correct if MMPI is abnormal
- Correct after a month
> Personality disorders are enduring patterns, not new changes.
:::

## 1.2 Theories of personality and causes [core]
### Trait models
| Model | Dimensions |
|---|---|
| **Big Five (Costa and McCrae)** | **O**penness, **C**onscientiousness, **E**xtraversion, **A**greeableness, **N**euroticism (OCEAN) |
| **Eysenck** | Extraversion, neuroticism, psychoticism (PEN) |
| **Cloninger** | **Temperament** (inherited): novelty seeking (dopamine), harm avoidance (serotonin), reward dependence (noradrenaline), persistence. **Character** (learned): self-directedness, cooperativeness, self-transcendence |
| **Allport** | Cardinal, central and secondary traits |

### Other approaches
- **Psychodynamic**: personality as habitual defences and ways of relating (Kernberg's personality organisation: neurotic, borderline, psychotic levels).
- **Humanistic**: Rogers' self-concept; Maslow's **hierarchy of needs** (physiological, safety, love and belonging, esteem, self-actualisation).
- **Social-cognitive**: Bandura's reciprocal determinism (person, behaviour and environment shape each other).

### Why personality disorders develop
- **Genes**: personality traits are about 40 to 50% heritable; schizotypal links with schizophrenia, antisocial with substance use in relatives.
- **Childhood adversity**: abuse, neglect, bullying, parental loss, chaotic homes; strongly linked with borderline and antisocial patterns.
- **Attachment**: disorganised or insecure attachment shapes later relationships.
- **Temperament** meets environment: a highly sensitive child in an invalidating home (Linehan's biosocial model).

:::analogy Soil and seed
Temperament is the seed; the family and wider world are the soil and weather. The same seed grows differently in different soil. That is also why the shape can change later, in better soil (therapy, stable relationships).
:::

:::recall
1. Expand OCEAN. || Openness, conscientiousness, extraversion, agreeableness, neuroticism.
2. Name Cloninger's four temperament dimensions. || Novelty seeking, harm avoidance, reward dependence, persistence.
3. Give Maslow's hierarchy from the base. || Physiological, safety, love and belonging, esteem, self-actualisation.
4. What are Kernberg's three levels of personality organisation? || Neurotic, borderline, psychotic.
:::

:::mcq
Q: In Cloninger's model, a person who seeks thrills and gets bored easily scores high on:
- Harm avoidance
- *Novelty seeking
- Reward dependence
- Persistence
> Novelty seeking is linked to dopamine.
:::

## 1.3 Assessing personality well [core]
### Principles
- **Longitudinal**: you need a pattern since adolescence, across years and situations, not one crisis.
- **Not during acute illness**: depression, mania, psychosis and intoxication all distort personality. Re-assess when well.
- **Collateral history** from someone who has known the person for years is essential; people often lack insight into their own traits.
- **Culture**: behaviour that is expected in one setting (deference to elders, joint family decisions) is not dependence.

### Questions that open up personality
- "How would your close friends describe you? And people who don't like you?"
- "How do you usually react when things go wrong?"
- "What are your relationships usually like? How do they end?"
- "Have you been in trouble with the police, at school or work?"
- "How do you feel about yourself most of the time?"

### Tools
| Tool | Use |
|---|---|
| **SCID-5-PD** | Structured interview for DSM-5 personality disorders |
| **IPDE** (International Personality Disorder Examination) | Semi-structured interview for ICD and DSM |
| MMPI-2, NEO-PI | Personality traits and profiles |
| **PCL-R** (Hare Psychopathy Checklist) | Psychopathy, in forensic settings |

:::trap Do not diagnose a personality disorder in one meeting during a crisis
A woman brought after an overdose, angry and tearful, may look "borderline". She may have depression, an abusive partner, or both. Gather history over time and from others before labelling. The label sticks and changes how others treat her.
:::

:::recall
1. Why should personality not be diagnosed during acute illness? || Acute illness distorts behaviour and self-report.
2. Why is collateral history essential? || People often lack insight into their own traits.
3. Name two structured interviews for personality disorders. || SCID-5-PD and IPDE.
:::

:::mcq
Q: A tearful woman, angry and impulsive, is seen once after an overdose. The best approach to personality diagnosis is:
- Diagnose borderline personality disorder today
- *Treat the crisis, gather history over time and from others, then decide
- Run a projective test now
- Avoid any assessment
> One crisis is not a lifelong pattern.
:::

# Part II · The ten disorders

## 2.1 Cluster A: odd and eccentric [core]
| Disorder | Core picture | Key features |
|---|---|---|
| **Paranoid** | Pervasive **distrust and suspicion**; others' motives read as malevolent | Suspects exploitation without basis; doubts loyalty; reads hidden insults; bears grudges; reluctant to confide; quick to counter-attack; suspicious of partner's fidelity (at least 4 of 7) |
| **Schizoid** | **Detachment** from relationships; restricted emotional range | Neither desires nor enjoys close relationships; chooses solitary activities; little interest in sex; few pleasures; no close friends; indifferent to praise or criticism; emotionally cold (at least 4 of 7) |
| **Schizotypal** | Social and interpersonal deficits with **cognitive or perceptual distortions and eccentricity** | Ideas of reference (not delusional); odd beliefs or magical thinking; unusual perceptions; odd speech; suspiciousness; inappropriate or constricted affect; odd behaviour or appearance; no close friends; social anxiety that doesn't settle with familiarity (at least 5 of 9). Genetically linked to schizophrenia |

:::mcq
Q: A man lives alone, has no wish for friends, shows little emotion and is content with solitary hobbies. Most likely:
- Avoidant
- *Schizoid
- Schizotypal
- Paranoid
> Schizoid: no desire for relationships. Avoidant: wants them, fears rejection.
:::

## 2.2 Cluster B: dramatic, emotional, erratic [core]
| Disorder | Core picture | Key features |
|---|---|---|
| **Antisocial** | **Disregard for and violation of others' rights** since age 15 | Unlawful acts; deceitfulness; impulsivity; irritability and aggression; reckless disregard for safety; irresponsibility; **lack of remorse** (at least 3 of 7). Age 18 or more, conduct disorder before 15 |
| **Borderline** | **Instability** of relationships, self-image and emotions, with marked **impulsivity** | See 2.4 (at least 5 of 9) |
| **Histrionic** | Excessive **emotionality and attention seeking** | Uncomfortable when not the centre of attention; seductive or provocative; shallow, rapidly shifting emotions; uses appearance for attention; impressionistic speech; theatrical; suggestible; sees relationships as more intimate than they are (at least 5 of 8) |
| **Narcissistic** | **Grandiosity**, need for **admiration**, lack of **empathy** | Grandiose self-importance; fantasies of success or power; believes they are special; needs excessive admiration; entitlement; exploits others; lacks empathy; envious; arrogant (at least 5 of 9) |

:::mcq
Q: A woman needs to be the centre of attention, dresses provocatively, and her emotions shift quickly and seem shallow. Most likely:
- Borderline
- *Histrionic
- Narcissistic
- Antisocial
> Attention-seeking and shallow, theatrical emotion.
:::

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

:::mcq
Q: A 34-year-old cannot choose clothes or meals without asking his mother and fears being left alone. Most likely:
- Avoidant
- *Dependent
- OCPD
- Schizoid
> Excessive need to be cared for, beyond what is culturally expected.
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

:::mcq
Q: A patient's moods swing within hours after arguments, she feels empty, fears abandonment and cuts herself. These mood shifts point more to:
- Bipolar disorder
- *Borderline personality disorder
- Schizophrenia
- Major depression only
> Reactive shifts lasting hours, chronic emptiness, abandonment fears.
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

## 2.6 Antisocial personality and psychopathy [core]
:::define Psychopathy
A constellation of **interpersonal and emotional** traits (glibness, superficial charm, grandiosity, pathological lying, manipulation, **lack of remorse and empathy**, shallow emotion) with an **antisocial lifestyle** (impulsivity, irresponsibility, early behaviour problems, criminal versatility). Measured with Hare's **PCL-R** (20 items, 0 to 40).
:::

| | Antisocial personality disorder | Psychopathy |
|---|---|---|
| Based on | Behaviour (law-breaking, deceit, aggression) | Emotional and interpersonal traits plus behaviour |
| Prevalence in prisons | High (often half or more) | Much smaller group |
| Predicts | Offending | **Violent re-offending**, poor treatment response |

- **Conduct disorder before 15** is required for antisocial personality disorder; **callous-unemotional traits** in childhood ("limited prosocial emotions" specifier) predict the most persistent course.
- Biology: low resting heart rate, reduced fear conditioning, reduced amygdala response to others' distress.
- Course: antisocial behaviour often **lessens after the 40s**; substance use, injury and early death are common.
- Treatment: limited; focus on **comorbid substance use**, structured programmes, and managing risk. Treat the child: **parent training** for conduct problems is the best prevention.

:::trap Charm is not a sign of good rapport
A patient who is unusually charming, flattering and quickly "close" to staff, while stories don't add up, may be manipulating. Check facts, keep boundaries, and work as a consistent team.
:::

:::recall
1. What does the PCL-R measure and how is it scored? || Psychopathy; 20 items, 0 to 40.
2. Give two differences between ASPD and psychopathy. || ASPD is behaviour-based and common in prisons; psychopathy adds emotional traits and predicts violent re-offending.
3. What childhood feature predicts the most persistent antisocial course? || Callous-unemotional traits.
4. What is the best prevention of adult antisocial behaviour? || Parent training for childhood conduct problems.
:::

:::mcq
Q: A charming man lies easily, shows no remorse after hurting others, and has a long history of fighting since age 12. Which tool measures psychopathy?
- MMPI-2 only
- *Hare PCL-R
- Y-BOCS
- PANSS
> 20 items, 0 to 40; high scores predict violent re-offending.
:::

## 2.7 Telling personality disorders from other illnesses [core]
| Personality disorder | Can be confused with | How to tell |
|---|---|---|
| Schizotypal, schizoid, paranoid | **Schizophrenia, delusional disorder** | No sustained delusions or hallucinations; lifelong stable pattern, not a change from previous level |
| Borderline | **Bipolar disorder**, complex PTSD, depression | Mood shifts last hours, reactive; chronic emptiness; trauma history may suggest complex PTSD |
| Avoidant | **Social anxiety disorder** | Large overlap; avoidant is more pervasive, lifelong, with a core sense of inadequacy |
| Obsessive-compulsive (OCPD) | **OCD** | Ego-syntonic perfectionism, no true obsessions or rituals |
| Antisocial | Substance use, mania | Pattern since childhood; persists when sober and euthymic |
| Narcissistic | Hypomania | Stable lifelong grandiosity, not episodic, with normal sleep and energy |
| Any | **Personality change due to a medical condition** | New change in adulthood after head injury, epilepsy, frontal tumour, dementia |

:::note Comorbidity is the rule
Personality disorders commonly co-exist with depression, anxiety, eating disorders and substance use, and **worsen the outcome** of each. Ask about personality in every patient who "does not respond".
:::

:::recall
1. How do you tell schizotypal personality from schizophrenia? || No sustained psychotic symptoms; stable lifelong pattern.
2. How do you tell avoidant personality from social anxiety disorder? || Overlap; avoidant is more pervasive with core inadequacy.
3. What suggests personality change due to a medical condition? || New change in adulthood with a neurological cause.
:::

:::mcq
Q: A man has been odd, isolated and believes in telepathy for years, but has never had sustained hallucinations or delusions. Most likely:
- Schizophrenia
- *Schizotypal personality disorder
- Delusional disorder
- Bipolar disorder
> Odd beliefs and perceptions without sustained psychosis; genetically linked to schizophrenia.
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

:::mcq
Q: Which treatment has the best evidence for reducing self-harm in borderline personality disorder?
- Long-term benzodiazepines
- *Dialectical behaviour therapy
- High-dose antipsychotics
- Long hospital admissions
> DBT; also mentalisation-based therapy.
:::

## 3.2 Managing crises and the team [core]
### The borderline crisis: what helps
- **Validation first**: "It makes sense you're this upset after the fight; anyone would be hurt." Validation is not agreement with the behaviour.
- **Assess risk** properly every time; chronic risk does not mean no acute risk.
- **Problem-solve** the trigger; agree a short, concrete plan.
- **Brief admission** only with clear goals, a set length, and an agreed plan; long admissions often make things worse (regression, more self-harm).
- **Crisis plan written with the patient**: triggers, early signs, things that help, who to call, what the team will do.

:::sounds How it sounds in the room
"I can see how much pain you're in right now. You cut because the feeling was unbearable and it gave some relief. I'm not going to lecture you. Let's look at what happened today, step by step, and work out what we can do tonight to keep you safe."
:::

### The team and the clinician
- **Consistency**: one care coordinator, a shared plan, the same boundaries from all staff. Splitting ("you're the only one who understands me") divides teams; discuss it openly in team meetings.
- **Notice countertransference**: anger, rescuing, rejection. Use supervision.
- **Prescribe cautiously**: no long-term benzodiazepines, small quantities of medicines that are dangerous in overdose; medicines for comorbid conditions or short-term symptoms only.

### Indian context
- Families are often highly involved; **family psychoeducation** reduces conflict and invalidation.
- Stigma: "personality disorder" can sound like "bad character". Explain it as patterns learned to survive that can change.
- Structured therapies (DBT) are spreading in Indian centres; **group skills** formats suit resource-limited settings.

:::recall
1. What is the first step in responding to a borderline crisis? || Validation, then risk assessment.
2. What are the conditions for a helpful brief admission? || Clear goals, fixed length, agreed plan.
3. How do teams manage splitting? || Consistency, one coordinator, shared plan, open discussion.
4. Which medicines should be avoided long-term in personality disorder? || Benzodiazepines; limit overdose-dangerous medicines.
:::

:::mcq
Q: A borderline patient tells you, "You're the only doctor who understands me; the others are useless." The best response is:
- Agree and take over all her care
- *Thank her, stay with the shared team plan, and discuss the splitting in the team
- Tell her she is manipulative
- Discharge her
> Consistency across the team manages splitting.
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
Big Five dimensions? :: Openness, conscientiousness, extraversion, agreeableness, neuroticism.
Cloninger temperament linked to dopamine? :: Novelty seeking.
Maslow's top level? :: Self-actualisation.
Structured interview for ICD and DSM personality disorders? :: IPDE.
Psychopathy checklist? :: Hare PCL-R, 20 items.
Required in childhood for ASPD? :: Conduct disorder before 15.
Childhood traits predicting persistent antisocial course? :: Callous-unemotional traits.
Diagnose personality during acute mania? :: No; reassess when well.
First response to a borderline crisis? :: Validation, then risk assessment.
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

Q: A 30-year-old seen during a severe depressive episode is clingy and indecisive. The best approach to personality diagnosis is to:
- Diagnose dependent personality disorder now
- *Treat the depression and reassess personality with collateral history when well
- Use a projective test immediately
- Diagnose borderline personality disorder
> Acute illness distorts personality.

Q: In Cloninger's model, harm avoidance is linked mainly to:
- Dopamine
- *Serotonin
- Noradrenaline
- GABA
> Novelty seeking with dopamine, reward dependence with noradrenaline.

Q: Which best predicts violent re-offending?
- Avoidant personality
- *High psychopathy score on the PCL-R
- OCPD
- Dependent personality
> Psychopathy predicts violent recidivism.

Q: A man develops new disinhibition and irritability at 50 after a road accident. The most likely diagnosis is:
- Antisocial personality disorder
- Histrionic personality disorder
- *Personality change due to a medical condition (head injury)
- Borderline personality disorder
> New change in adulthood with a neurological cause.
:::
`;
