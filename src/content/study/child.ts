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

## 1.2 Development and screening tools [core]
### Social and emotional milestones
| Age | What to expect |
|---|---|
| 2 to 3 months | Social smile, follows faces |
| 6 to 8 months | **Stranger anxiety** begins; recognises familiar people |
| 9 to 12 months | **Separation anxiety** peaks; **joint attention** (follows a point, shows objects); waves bye-bye |
| 18 months | Pretend play begins (feeding a doll); points to show interest |
| 2 years | Parallel play beside other children; "no" phase; tantrums common |
| 3 to 4 years | Cooperative play, takes turns, imaginary friends are normal, knows own gender |
| 4 to 5 years | **Theory of mind**: understands others can hold false beliefs (passes the false belief test) |
| 6 to 12 years | Rule-based games, friendships, competence at school (Erikson's industry) |
| Adolescence | Identity, peer influence, abstract thinking, risk taking |

:::trap Joint attention is a key autism marker
A child of 12 to 18 months who does not point to show things, does not follow your point, and does not look back to share interest needs an autism screen, even if words are present.
:::

### Screening and diagnostic tools used in India
| Tool | Use |
|---|---|
| **Trivandrum Developmental Screening Chart (TDSC)** | Quick developmental screening, 0 to 6 years |
| Developmental Screening Test, Denver II | Developmental milestones |
| **M-CHAT-R/F** | Autism screening at 16 to 30 months |
| **INCLEN Diagnostic Tool for ASD (INDT-ASD)** | Indian diagnostic tool for autism |
| **Indian Scale for Assessment of Autism (ISAA)** | Used for **autism disability certification** in India |
| **Vineland Social Maturity Scale** | Social quotient for intellectual disability |
| Conners, Vanderbilt | ADHD symptoms from parents and teachers |
| **NIMHANS SLD battery** | Specific learning disorder |
| Strengths and Difficulties Questionnaire (SDQ) | Broad emotional and behavioural screen |

### The family and the child together
- See the family together first, then the child alone (from about 10 to 12 years especially), then parents alone.
- Notice how the family sits, who answers for the child, and how parents respond to the child's behaviour in the room.
- Ask about **screen time**, sleep, diet, school, friendships, bullying, family conflict, parental mental health and substance use.

:::recall
1. At what age does stranger anxiety begin and separation anxiety peak? || About 6 to 8 months; about 9 to 12 months.
2. What is joint attention and why does it matter? || Sharing attention through pointing and following a point; its absence suggests autism.
3. Which Indian tool is used for autism disability certification? || ISAA.
4. At what age is theory of mind usually present? || About 4 to 5 years.
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

## 2.5 Genetic syndromes and behavioural phenotypes [core]
| Syndrome | Genetics | Physical features | Behaviour and mental health |
|---|---|---|---|
| **Down syndrome** | **Trisomy 21** (mostly non-disjunction; risk rises with maternal age) | Upward-slanting eyes, flat face, single palmar crease, heart defects, hypothyroidism | Sociable; early **Alzheimer's** (by the 40s and 50s); depression |
| **Fragile X** | **CGG repeat in FMR1, X chromosome** (commonest inherited cause) | Long face, large ears, large testes after puberty | **Social anxiety, gaze avoidance, autism features, ADHD** |
| **Prader-Willi** | Loss of paternal chromosome 15q11-13 | Hypotonia in infancy, short stature, small hands | **Hyperphagia** (constant hunger), obesity, skin picking, temper outbursts, OCD-like features |
| **Angelman** | Loss of maternal 15q11-13 | Seizures, ataxic gait | **Happy demeanour, frequent laughter**, little speech |
| **Williams** | Deletion 7q11.23 | "Elfin" face, heart defect (supravalvular aortic stenosis), high calcium | **Very sociable, over-friendly**, good verbal skills, poor visuospatial skills, anxiety |
| **Rett syndrome** | **MECP2**, X-linked, mostly girls | Normal early development, then loss of skills and slowing head growth | **Hand-wringing**, loss of purposeful hand use, breathing irregularities |
| **Phenylketonuria** | Recessive enzyme deficiency | Fair skin, musty smell | Preventable intellectual disability with a low-phenylalanine diet |
| **Fetal alcohol spectrum disorder** | Alcohol exposure in pregnancy (not genetic) | Smooth philtrum, thin upper lip, small eyes, small head | ADHD-like problems, learning difficulties; **the commonest preventable cause** |
| Lesch-Nyhan | X-linked, HGPRT deficiency | Gout, high uric acid | **Severe self-injury** (biting lips and fingers) |

:::mnemonic Prader-Willi versus Angelman
**P**rader-Willi: **P**aternal deletion, **P**lenty of appetite. **A**ngelman: m**A**ternal deletion, **A**lways laughing.
:::

:::recall
1. What is the commonest inherited cause of intellectual disability and its genetic change? || Fragile X; CGG repeat in FMR1.
2. Which syndrome has hyperphagia, and which has frequent laughter? || Prader-Willi; Angelman.
3. Which syndrome shows hand-wringing after early normal development? || Rett syndrome.
4. What is the commonest preventable cause of intellectual disability? || Fetal alcohol exposure (and in India, iodine deficiency is also preventable).
5. Which syndrome is associated with early Alzheimer's? || Down syndrome.
:::

## 2.6 ADHD medicines and adult ADHD [core]
| Medicine | Type | Notes |
|---|---|---|
| **Methylphenidate** (short and long-acting) | Stimulant: blocks dopamine and noradrenaline reuptake | First-line in most children over 6; works within an hour |
| **Atomoxetine** | Non-stimulant: noradrenaline reuptake inhibitor | Takes weeks; useful with tics, anxiety or misuse risk; watch liver and suicidal thinking |
| Clonidine, guanfacine | Alpha-2 agonists | With tics, sleep problems, aggression; watch BP and do not stop suddenly |
| Amphetamines | Stimulant | Limited availability in India |

### Practical points
- **Before**: height, weight, pulse, BP, heart history (sudden collapse, family history of sudden death; ECG if concerns).
- **During**: growth chart, appetite, sleep, BP and pulse, mood, tics; give medicine after breakfast to protect appetite.
- **Drug holidays** (weekends or holidays) may help growth, but are not needed for everyone.
- Methylphenidate is a **controlled medicine**: keep records, watch for diversion in adolescents.

### Adult ADHD
- Many children continue to have symptoms; hyperactivity becomes **inner restlessness**, with disorganisation, lateness, job changes, impulsive spending, accidents and relationship problems.
- Diagnosis needs evidence of **childhood onset** (several symptoms before 12), from school reports or a parent.
- High comorbidity: depression, anxiety, substance use, personality difficulties.
- Treatment: stimulants or atomoxetine, plus coaching, CBT and organisational skills.

:::recall
1. How does methylphenidate work? || Blocks dopamine and noradrenaline reuptake.
2. When is atomoxetine preferred? || Tics, anxiety, risk of misuse.
3. What do you check before starting a stimulant? || Height, weight, pulse, BP, heart history.
4. What is essential for diagnosing ADHD in an adult? || Evidence of childhood onset before 12.
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

## 3.4 Adolescents [core]
### What is normal and what is not
| Usually normal | Needs attention |
|---|---|
| Moodiness, wanting privacy, arguments over rules | Persistent low mood or irritability for weeks, withdrawal from friends |
| Interest in peers over family | Falling marks, school refusal, dropping all interests |
| Some risk taking | Self-harm, substance use, unsafe sex, running away |
| Late sleeping | Severe sleep disruption, night-long gaming or phone use |
| Concern about appearance | Restrictive eating, weight loss, bingeing, vomiting |

### HEADSSS: the adolescent psychosocial interview
**H**ome · **E**ducation and employment · **A**ctivities · **D**rugs · **S**exuality · **S**uicide and depression · **S**afety (including online). Interview the young person **alone**, explain confidentiality and its limits first.

### Problems that often start in adolescence
- **Depression and self-harm**: ask directly; fluoxetine with CBT for moderate to severe depression.
- **Eating disorders**: see the module on other disorders.
- **Substance use**: tobacco, alcohol, cannabis, inhalants (whitener and glue sniffing in street children).
- **Early psychosis**: decline in functioning, social withdrawal, odd beliefs; early intervention improves outcome.
- **Problematic internet and gaming use**: **gaming disorder** (ICD-11): impaired control, priority over other activities, continuing despite harm, for about 12 months.
- **Exam stress**: common around board and entrance exams; watch for hopelessness.

### Working with parents and schools
- **Parent management training**: praise and attention for good behaviour, clear instructions, consistent consequences, time-out, special time with the child.
- **School**: individualised education plans, exam accommodations, anti-bullying policies, a link teacher.
- Look after the **parents' mental health**: maternal depression strongly affects children.

:::recall
1. Expand HEADSSS. || Home, education, activities, drugs, sexuality, suicide and depression, safety.
2. Name four warning signs in an adolescent that need attention. || Persistent low mood, falling marks, self-harm, substance use, restrictive eating, severe sleep disruption.
3. What are the features of gaming disorder? || Impaired control, priority over other activities, continuing despite harm, about 12 months.
4. Name four parts of parent management training. || Praise, clear instructions, consistent consequences, time-out, special time.
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
Stranger anxiety starts at? :: About 6 to 8 months.
Theory of mind appears at? :: About 4 to 5 years.
Indian autism certification tool? :: ISAA.
Commonest inherited cause of intellectual disability? :: Fragile X.
Genetics of fragile X? :: CGG repeat in FMR1 on the X chromosome.
Hyperphagia and skin picking? :: Prader-Willi syndrome.
Over-friendly with poor visuospatial skills? :: Williams syndrome.
Hand-wringing in a girl after normal early development? :: Rett syndrome.
Severe self-biting? :: Lesch-Nyhan syndrome.
Non-stimulant for ADHD? :: Atomoxetine.
Adolescent psychosocial interview mnemonic? :: HEADSSS.
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

Q: A boy with intellectual disability, long face, large ears, gaze avoidance and social anxiety most likely has:
- Down syndrome
- *Fragile X syndrome
- Williams syndrome
- Angelman syndrome
> Commonest inherited cause.

Q: A child with a heart murmur is extremely friendly with strangers, chatty, but cannot copy simple shapes. Most likely:
- Prader-Willi syndrome
- *Williams syndrome
- Rett syndrome
- Fetal alcohol spectrum disorder
> Supravalvular aortic stenosis and visuospatial weakness.

Q: An ADHD child with tics and a sibling who misuses drugs. The most suitable first medicine may be:
- High-dose methylphenidate
- *Atomoxetine
- Haloperidol
- Alprazolam
> No misuse potential; does not worsen tics.

Q: Which is the best approach to interviewing a 15-year-old?
- Only with parents present
- *See them alone after explaining confidentiality and its limits
- Promise complete secrecy
- Rely on teachers only
> Using HEADSSS.
:::
`;
