import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "child",
  num: 18,
  title: "Child and adolescent mental health",
  emoji: "🧩",
  tagline: "Neurodevelopmental disorders, behaviour problems, bedwetting, and working with families and schools",
  when: "Weeks 13 to 14",
  outcomes: [
    "Know normal milestones and the red flags for development",
    "State the criteria and key facts for intellectual disability, autism, ADHD, learning disorders and tics",
    "Distinguish ODD from conduct disorder and know DMDD",
    "Manage enuresis and encopresis",
    "Assess children with many informants, and know child protection duties under POCSO",
  ],
  writeTask:
    "On paper, from memory: the autism red flags by age, the two autism domains, the ADHD symptom counts and rules, intellectual disability severity by adaptive functioning, ODD vs conduct disorder, the enuresis rules, and the POCSO reporting duty. Then check and correct in red.",
  activities: [
    act.lesson("ls-1", "Quiz: childhood", "Neurodevelopmental and behaviour disorders."),
    act.coach("disorders", "Coach: disorders", "The diagnoses you mix up."),
    act.coach("law", "Coach: law", "POCSO, RPwD and consent."),
  ],
  noteId: "child",
};

export const text = String.raw`
# Part I · Assessing children

## 1.1 How child assessment differs [core]
- Children rarely refer themselves: **parents, teachers or courts** bring them. Ask what each person wants.
- Use **many informants**: parents (sometimes separately), teachers, school reports, the child.
- Use **play, drawing and observation**; speak at the child's level.
- Think **developmentally**: is this behaviour normal for the age?
- Always ask about home and school stress, bullying, screen use, sleep, and **abuse**.
- Falling school performance is a sensitive sign of emotional trouble.

### Milestones and red flags
| Age | Expected | Red flag |
|---|---|---|
| 2 months | Social smile | No smile |
| 6 months | Babbles, reaches, laughs | No response to sounds |
| 12 months | First words, points, waves, responds to name | **No babbling, pointing or gestures** |
| 16 months | Single words | **No single words** |
| 24 months | Two-word phrases, pretend play | **No two-word phrases** |
| Any age | | **Loss of previously gained language or social skills** |

:::recall
1. Name four ways child assessment differs from adult assessment. || Brought by others, many informants, play and observation, developmental lens.
2. Give the language red flags at 12, 16 and 24 months. || No babbling or gestures; no single words; no two-word phrases.
3. What red flag applies at any age? || Loss of skills.
:::

# Part II · Neurodevelopmental disorders

## 2.1 Intellectual disability [core]
:::define Intellectual disability (intellectual developmental disorder)
Deficits in **intellectual functions** (reasoning, problem-solving, planning, abstract thinking, learning) **and adaptive functioning** (conceptual, social, practical), with **onset during the developmental period**.
:::
- IQ is typically about **70 or below** (two standard deviations below the mean of 100), but **severity is set by adaptive functioning**, not IQ alone.

| Severity | Rough picture |
|---|---|
| Mild | Most common; academic difficulties; can live independently with some support |
| Moderate | Basic reading and money skills; needs support for complex tasks |
| Severe | Limited language; needs support for all daily activities |
| Profound | Very limited communication; needs constant care; often physical disabilities |

- Causes: genetic (**Down syndrome**, fragile X, PKU), pregnancy (iodine deficiency, infections, alcohol), birth (asphyxia, prematurity), childhood (meningitis, head injury, lead, malnutrition, untreated **hypothyroidism**).
- Prevention matters in India: iodised salt, newborn screening for hypothyroidism, safe deliveries.
- Assessment in India: intelligence tests (Binet–Kamat, Malin's WISC, WAIS) and the **Vineland Social Maturity Scale** for social and adaptive functioning.
- Management: early intervention, special education, skills training, family support, treatment of comorbid epilepsy and behaviour problems, disability certification (RPwD Act).

## 2.2 Autism spectrum disorder [core]
:::define Two domains
**A. Persistent deficits in social communication and interaction** (all 3): social-emotional reciprocity; non-verbal communication (eye contact, gestures); developing and maintaining relationships.
**B. Restricted, repetitive patterns of behaviour, interests or activities** (at least 2 of 4): stereotyped movements or speech (hand-flapping, echolalia, lining up toys); insistence on sameness and routines; highly restricted, intense interests; **sensory** over- or under-reactivity (to sounds, textures, pain).
Present in early development; cause impairment; specify with or without intellectual or language impairment, and support level 1 to 3.
:::
- About 1 in 100 children; more boys diagnosed.
- **Vaccines do not cause autism.**
- Screening: **M-CHAT** at 16 to 30 months. Diagnosis by a specialist team.
- Management: early intensive behavioural and developmental interventions (applied behaviour analysis approaches), **speech and language therapy**, occupational therapy (sensory and motor), parent training, special education; treat sleep problems, anxiety, ADHD, epilepsy; risperidone or aripiprazole for severe irritability and aggression.

:::sounds How parents describe it
- “Naam pukaaro toh dekhta hi nahi.” (He doesn't look when we call his name.)
- “Gaadiyan line mein lagata rehta hai, koi hila de toh bahut rota hai.” (He lines up cars and cries if anyone moves them.)
- “Pehle kuch shabd bolta tha, ab chup ho gaya.” (He used to say a few words; now he's stopped.) Regression: urgent.
:::

## 2.3 ADHD [core]
:::define Criteria
A persistent pattern of **inattention** and/or **hyperactivity-impulsivity**: **6 or more symptoms** in either group (**5 or more at age 17 and over**) for **at least 6 months**; **several symptoms before age 12**; present in **2 or more settings** (home, school, work); clear impairment.
:::
| Inattention | Hyperactivity-impulsivity |
|---|---|
| Careless mistakes; can't sustain attention; doesn't seem to listen; doesn't finish tasks; disorganised; avoids sustained mental effort; loses things; easily distracted; forgetful | Fidgets; leaves seat; runs or climbs (restlessness in adults); can't play quietly; “on the go”; talks excessively; blurts answers; can't wait turn; interrupts |

- Presentations: combined, predominantly inattentive (often missed in girls), predominantly hyperactive-impulsive.
- Persists into adulthood in many.
- Rule out: hearing or vision problems, sleep problems, learning disorder, anxiety, family stress, absence seizures, thyroid.
- Rating scales: Vanderbilt, Conners (parents and teachers).
- Management: **parent training** and classroom strategies (first for young children), behavioural therapy; **stimulants** (**methylphenidate**) or atomoxetine for school-age children with significant impairment.
- Stimulant side effects: **reduced appetite and weight**, poor sleep, headache, stomach ache, raised pulse and BP; monitor height, weight, BP. Misuse potential.

## 2.4 Learning disorders, tics and communication [core]
### Specific learning disorder
- Difficulties in **reading** (dyslexia: slow, inaccurate reading, poor comprehension), **written expression** (dysgraphia) or **maths** (dyscalculia), well below age expectations, persisting **at least 6 months despite targeted help**, with normal intelligence and schooling opportunity.
- Assess with standardised tests; in India, certification allows exam accommodations (extra time, a scribe, exemptions).
- Management: remedial education; accommodations; address self-esteem and anxiety.

### Tic disorders
| Disorder | Rule |
|---|---|
| Provisional tic disorder | Motor and/or vocal tics for less than a year |
| Persistent (chronic) motor or vocal tic disorder | Motor **or** vocal tics for more than a year |
| **Tourette's disorder** | **Multiple motor tics and at least one vocal tic**, at some time, for **more than a year**, **onset before 18** |
- Tics wax and wane, are worsened by stress and tiredness, can be briefly suppressed, and are often preceded by an urge.
- Coprolalia (swearing) occurs in a minority only.
- Often with ADHD and OCD.
- Management: education, **habit reversal / CBIT**; medicines (aripiprazole, clonidine, risperidone) for severe tics.

### Communication disorders
Language disorder, speech sound disorder, childhood-onset fluency disorder (**stuttering**), social (pragmatic) communication disorder. Refer for speech and language therapy.

:::recall
1. What sets the severity of intellectual disability? || Adaptive functioning.
2. Give the two autism domains and their counts. || Social communication (all 3); restricted, repetitive behaviours (2 of 4).
3. What screening tool is used for autism, and at what age? || M-CHAT, 16 to 30 months.
4. State the ADHD numbers and rules. || 6 symptoms (5 from age 17), 6 months, several before 12, two or more settings.
5. Name three stimulant side effects to monitor. || Appetite and weight, sleep, BP and pulse (height).
6. State the Tourette's rules. || Multiple motor and at least one vocal tic, over a year, onset before 18.
:::

# Part III · Behaviour, mood and elimination

## 3.1 Disruptive behaviour [core]
| | Oppositional defiant disorder | Conduct disorder |
|---|---|---|
| Core | **Angry or irritable mood, argumentative or defiant behaviour, vindictiveness** | **Violates others' rights or major social rules** |
| Examples | Loses temper, argues with adults, refuses rules, annoys deliberately, blames others, spiteful | Aggression to people or animals, destruction of property, deceit or theft, serious rule violations (running away, truancy before 13) |
| Rule | At least 4 symptoms for 6 months | At least 3 of 15 in 12 months; childhood-onset (before 10) or adolescent-onset |
| Outlook | May progress to conduct disorder | Childhood onset predicts antisocial personality disorder |

- **Disruptive mood dysregulation disorder**: severe outbursts at least 3 times a week with persistent irritability between them, for 12 months, diagnosed between 6 and 18, onset before 10 (see the depression module).
- Management: **parent management training** (praise, consistent limits, time-out), school support, family therapy, multisystemic therapy for adolescents; treat ADHD and learning problems.

## 3.2 Anxiety and depression in young people [core]
- Separation anxiety, selective mutism, specific phobias and social anxiety often start in childhood (see the anxiety module).
- **School refusal** (anxiety, child stays home with parent's knowledge) differs from **truancy** (conduct problem, child hides absence).
- Depression in children: irritability, boredom, physical complaints, falling marks. Treatment: CBT, family work; **fluoxetine** if moderate to severe, with close monitoring.

## 3.3 Elimination disorders [core]
| | Enuresis | Encopresis |
|---|---|---|
| Definition | Repeated voiding of urine into bed or clothes | Repeated passage of faeces in inappropriate places |
| Age | At least **5 years** (or equivalent developmental level) | At least **4 years** |
| Frequency | At least **twice a week for 3 months**, or significant distress | At least **once a month for 3 months** |
| Common cause | Delayed bladder maturation, family history, deep sleep | **Constipation with overflow** (most cases) |
| Treatment | Reassurance, no punishment, fluid timing, star charts, **bed-wetting alarm** (most effective long term), desmopressin (short term, camps) | Treat constipation (laxatives), toilet routine, behavioural rewards |

:::recall
1. Distinguish ODD from conduct disorder. || ODD: angry, defiant, vindictive; CD: violates rights and rules, aggression, theft, destruction.
2. School refusal vs truancy? || Anxiety with parent's knowledge vs hidden absence with conduct problems.
3. Enuresis rules and the most effective long-term treatment? || Age 5, twice a week for 3 months; bed-wetting alarm.
4. Commonest cause of encopresis? || Constipation with overflow.
:::

# Part IV · Child protection

## 4.1 Abuse and POCSO [core]
- Forms: physical, sexual, emotional abuse, and neglect. Signs: unexplained injuries, sexualised behaviour beyond age, fear of going home, sudden behaviour change, poor growth and hygiene.

:::define The POCSO Act 2012
The Protection of Children from Sexual Offences Act covers anyone under **18**. **Section 19 makes reporting mandatory**: anyone who knows or suspects a sexual offence against a child must report it to the **Special Juvenile Police Unit or local police**. Failure to report is punishable (Section 21). Medical examination, statement recording and court processes must be child-friendly.
:::
- Students and trainees: tell your supervisor at once; don't investigate yourself; document the child's words exactly.
- Childline: **1098**.
- Listen calmly, believe the child, don't promise to keep it secret.

:::recall
1. Who does POCSO protect? || Everyone under 18.
2. What does Section 19 require? || Mandatory reporting to the police or Special Juvenile Police Unit.
3. What is the child helpline number? || 1098.
:::

# Part V · Exam zone

## 5.1 Long answer and short notes [core]
:::example Q. Describe the clinical features and management of ADHD. (10 marks)
1. Definition and criteria (symptom groups, numbers, age, settings, duration); presentations.
2. Epidemiology; persistence into adulthood; under-recognition in girls.
3. Aetiology: genetics, prematurity, prenatal exposures; dopamine and noradrenaline, prefrontal circuits.
4. Assessment: many informants, rating scales, rule-outs.
5. Comorbidity: learning disorder, ODD, conduct disorder, anxiety, tics.
6. Management: psychoeducation, parent training, classroom support; methylphenidate and atomoxetine with monitoring.
7. Prognosis.
:::

:::word Short note: autism spectrum disorder
A neurodevelopmental disorder with persistent deficits in social communication and interaction (reciprocity, non-verbal communication, relationships) and restricted, repetitive behaviours, interests or sensory differences, present from early development. Red flags include no babbling or gestures by twelve months, no words by sixteen months, no two-word phrases by twenty-four months, and any loss of skills. Screened with M-CHAT and diagnosed by a specialist team. Managed with early intensive behavioural and developmental intervention, speech and occupational therapy, parent training and school support; medicines treat associated irritability, sleep problems and ADHD. Vaccines do not cause autism.
:::

## 5.2 Viva rapid-fire [core]
:::viva
IQ range typical of intellectual disability? :: About 70 or below.
What determines ID severity? :: Adaptive functioning.
Scale for social maturity used in India? :: Vineland Social Maturity Scale.
Two domains of autism? :: Social communication; restricted, repetitive behaviours.
Autism screening tool? :: M-CHAT.
Do vaccines cause autism? :: No.
ADHD symptom count in children? :: Six in either group.
ADHD age-of-onset rule? :: Several symptoms before 12.
First-line ADHD medicine? :: Methylphenidate.
Tourette's rule? :: Multiple motor and one vocal tic, more than a year, onset before 18.
Therapy for tics? :: Habit reversal (CBIT).
Duration rule for learning disorder? :: Six months despite targeted help.
ODD vs conduct disorder? :: Defiance and irritability vs violating rights and rules.
Enuresis age rule? :: Five years.
Best long-term enuresis treatment? :: Bed-wetting alarm.
POCSO reporting section? :: Section 19.
Childline number? :: 1098.
:::

## 5.3 Module test [core]
:::mcq
Q: A 2-year-old has no words, doesn't point, doesn't respond to his name and lines up toys. Next step:
- Reassure; boys talk late
- *Refer for developmental assessment for autism
- Diagnose ADHD
- Start speech therapy only and review in a year
> Multiple red flags need assessment now.

Q: Severity of intellectual disability is classified mainly by:
- IQ score alone
- *Adaptive functioning
- Head circumference
- Age of diagnosis
> DSM-5-TR uses adaptive functioning.

Q: ADHD requires several symptoms present before age:
- 5
- 7
- *12
- 18
> And in two or more settings.

Q: A child with ADHD on methylphenidate is losing weight. This is:
- Unrelated
- *A common stimulant side effect needing monitoring
- A sign of overdose only
- Proof of misuse
> Appetite suppression; monitor height and weight.

Q: Multiple motor tics and one vocal tic for 2 years starting at 8 indicates:
- Provisional tic disorder
- *Tourette's disorder
- OCD
- Autism
> Over a year with onset before 18.

Q: A 12-year-old repeatedly lies, steals, bullies others and was cruel to animals. Most likely:
- ODD
- *Conduct disorder
- ADHD alone
- Autism
> Violating others' rights.

Q: A 7-year-old wets the bed 4 nights a week. Most effective long-term treatment:
- Punishment
- Fluid restriction alone
- *A bed-wetting alarm
- Antidepressants
> Plus reassurance and positive reinforcement.

Q: Most encopresis is due to:
- Anxiety
- *Constipation with overflow
- Intellectual disability
- Sexual abuse
> Treat the constipation first.

Q: A 14-year-old discloses sexual abuse by a relative. Under POCSO, you must:
- Keep it confidential as requested
- *Report to the police or Special Juvenile Police Unit and inform your supervisor
- Confront the relative
- Wait for more evidence
> Mandatory reporting under Section 19.

Q: A child stays home from school with his mother's knowledge because of stomach aches on school days. This is most likely:
- Truancy
- *School refusal
- Conduct disorder
- Malingering
> Anxiety-driven, with parental knowledge.
:::
`;
