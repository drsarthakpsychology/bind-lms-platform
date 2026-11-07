/* Module · Child and adolescent mental health, Part II (Beginner level). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part II · Beginner: the diagnoses

## 2.1 Intellectual disability [core][beginner]
**Intellectual disability** (DSM-5-TR calls it intellectual developmental disorder; ICD-11 calls it disorder of intellectual development) has three parts, and all three are needed:
1. **Difficulty with intellectual functions**: reasoning, problem-solving, planning, abstract thinking, judgement, learning from teaching and from experience. This is confirmed by clinical assessment **and** a standardised intelligence test.
2. **Difficulty with adaptive functioning**: the everyday skills a person needs to be independent and responsible for their age and culture. These are grouped into three areas:
   - **Conceptual**: language, reading, writing, maths, money, time, memory.
   - **Social**: understanding others, communication, friendships, judgement about people (including who to trust).
   - **Practical**: self-care, work, money management, travel, safety, schoolwork organisation.
3. **Onset during the developmental period**, that is, in childhood or adolescence.

The test score alone never makes the diagnosis. A child with an IQ of 68 who manages school, friends and self-care with little help does not have an intellectual disability. A child whose score is a little higher but who cannot manage daily life without a lot of support might.

### How severe?
Severity is judged mainly by **how much support the person needs in daily life**, not only by the IQ score. As a rough guide:

| Severity | Rough IQ range | What it often looks like in adult life | Share of people with ID |
|---|---|---|---|
| Mild | about 50 to 69 | Reads and writes at a primary-school level, can work and live with some support | About 85 in 100 |
| Moderate | about 35 to 49 | Simple speech, can learn self-care and simple work with supervision | About 10 in 100 |
| Severe | about 20 to 34 | Few words, needs help with most daily tasks | About 3 to 4 in 100 |
| Profound | below about 20 | Very limited communication, often with physical disabilities, needs constant care | About 1 to 2 in 100 |

:::widget guess
{"prompt": "An IQ test is built so that the average is 100. How many points below average is two standard deviations, the usual cut-off for intellectual disability?", "min": 0, "max": 50, "unit": "points", "answer": [30, 30], "reveal": "Thirty points. Each standard deviation is 15 points, so two below the average of 100 is a score of about 70. Allowing for measurement error of about 5 points, scores of roughly 65 to 75 can fit an intellectual disability if adaptive functioning is also clearly impaired.", "clinician": "DSM-5-TR places the cut-off at about two standard deviations below the population mean, including a margin for measurement error (about plus or minus 5 points), so roughly 65 to 75. ICD-11 also uses standard deviations: mild 2 to 3 SD below the mean, moderate 3 to 4 SD, and severe and profound 4 or more SD below, separated by adaptive behaviour. Provisional diagnosis is used when testing is not possible (infants, severe sensory or motor impairment)."}
:::

:::widget curve
{"kind": "normal", "title": "IQ scores across the population", "caption": "Move the slider along the bell curve. The average is 100 and each standard deviation is 15 points. Two standard deviations below the mean (about 70) marks the zone where intellectual disability is considered, but only if adaptive functioning is also clearly impaired. Notice how few people score below 70: about 2 in 100."}
:::

### Global developmental delay
In children **under five**, reliable IQ testing is often not possible. When a young child is clearly behind in two or more areas of development, the diagnosis is **global developmental delay**. It is reassessed later; some children catch up, others are later diagnosed with intellectual disability.

### Causes
In about half of people with intellectual disability, a cause can be found. Causes are more often found in severe disability.
- **Before birth**: genetic and chromosomal conditions (Down syndrome is the commonest chromosomal cause, fragile X the commonest inherited cause), infections in pregnancy (rubella, cytomegalovirus, toxoplasmosis, syphilis, Zika), **alcohol in pregnancy**, iodine deficiency, and some medicines (valproate).
- **Around birth**: severe prematurity, lack of oxygen at birth, severe jaundice (kernicterus), low blood sugar.
- **After birth**: brain infections (meningitis, encephalitis, cerebral malaria), head injury, lead poisoning, severe malnutrition, and severe neglect.

:::note The Indian picture
In India, preventable causes still matter: birth asphyxia, untreated neonatal jaundice, iodine deficiency (now less common since salt iodisation), congenital hypothyroidism (screened at birth in some states), infections and malnutrition. Consanguineous marriage, common in some communities, raises the risk of recessive metabolic and genetic conditions.
:::

### What else commonly comes with it
People with intellectual disability have higher rates of **epilepsy**, autism, ADHD, anxiety, depression, sensory impairments, and physical health problems. They are also at much higher risk of **abuse and exploitation**. A change in behaviour (new aggression, self-injury, withdrawal) is often the only way a person with limited speech can show pain, illness, abuse or low mood, so always look for a cause.

:::widget decide
{"scene": "Ramesh, 19, has moderate intellectual disability and few words. He lives with his parents in Nagpur and attends a day centre. Over the last month he has started hitting his own face and screaming at night. His mother asks for 'an injection to calm him'.", "ask": "What is your first step?", "choices": [{"label": "Prescribe an antipsychotic for aggression and review in three months", "verdict": "harm", "outcome": "He becomes sleepy and gains weight. A month later he is found to have a badly infected tooth.", "why": "New challenging behaviour in someone who cannot describe pain is often the only sign of a physical problem. Medicine without a search for the cause can hide it."}, {"label": "Look for a cause: pain (teeth, ears, constipation, injury), illness, side effects, sleep, changes at home or the day centre, possible abuse, and low mood", "verdict": "best", "outcome": "Examination finds a dental abscess. After treatment, the face-hitting stops. A gentle conversation also reveals that a new staff member at the centre has been rough with him, which is reported.", "why": "Challenging behaviour is communication. A careful search for pain, illness, environmental change and abuse comes first, often with a simple behaviour chart (what happens before, during and after)."}, {"label": "Tell the family this is part of his disability and nothing can be done", "verdict": "harm", "outcome": "The pain and the mistreatment continue for months.", "why": "This is 'diagnostic overshadowing': putting every new problem down to the disability."}]}
:::

:::clinician
### Management in practice
- **Early intervention** in the first years: developmental stimulation, physiotherapy, speech and occupational therapy, parent training (DEICs, NGO programmes).
- **Education**: inclusive education is the default under the RPwD Act 2016 and the Right to Education Act; special schools where needs are high. Individualised education plans.
- **Adaptive skills training**: task analysis, chaining, prompting and fading, token systems.
- **Challenging behaviour**: functional assessment (antecedent, behaviour, consequence) and positive behaviour support first. If medicine is needed for severe aggression or self-injury after this, risperidone has the best evidence (start 0.25 to 0.5 mg, usual 0.5 to 2 mg daily; Indian brands Risdone, Sizodon), with weight, prolactin and metabolic monitoring, and a planned review to stop. NICE and the STOMP campaign in the UK highlight overuse of antipsychotics in this group.
- **Comorbid illness**: treat depression, anxiety, ADHD (methylphenidate works, with smaller effects and more side effects than in typical development) and epilepsy as you would otherwise, starting at lower doses.
- **Legal and social**: disability certificate and UDID card, the National Trust Act 1999 (legal guardianship for adults with autism, cerebral palsy, ID and multiple disabilities through Local Level Committees), Niramaya health insurance, disability pension in many states.
- **Capacity**: an adult with ID may have capacity for some decisions and not others. Under the Mental Healthcare Act 2017, intellectual disability alone is not "mental illness" for the purposes of the Act, except where it co-exists with mental illness.

### Work-up for a cause (yield is highest in moderate to profound ID)
Chromosomal microarray is the first-line genetic test (yield about 15% to 20%), with fragile X testing (FMR1 CGG repeat) in boys and girls with suggestive features; exome sequencing increasingly used. Thyroid function, metabolic screen where indicated (amino acids, organic acids, lactate, ammonia), lead, and MRI or EEG for seizures, regression, microcephaly or focal signs. Hearing and vision in everyone.
:::

:::recall
1. Give the three parts of the definition of intellectual disability. || Deficits in intellectual functions (assessment and IQ test), deficits in adaptive functioning, onset in the developmental period.
2. Name the three areas of adaptive functioning. || Conceptual, social, practical.
3. What mainly decides severity in DSM-5-TR? || Adaptive functioning, that is, how much support is needed.
4. What is global developmental delay? || Delay in two or more developmental areas in a child under five, when IQ cannot yet be reliably tested.
5. What is diagnostic overshadowing? || Putting a new symptom down to the disability and missing a treatable cause.
:::

:::mcq
Q: A 9-year-old has an IQ of 66 on testing, but he is in a regular class with mild extra help, has friends, dresses himself and helps in his father's shop. The best view is:
- He has mild intellectual disability because his IQ is below 70
- *The diagnosis needs clear adaptive deficits; his adaptive functioning looks adequate, so it may not apply
- He has moderate intellectual disability
- He has a specific learning disorder
> IQ alone never makes the diagnosis.

Q: The commonest inherited cause of intellectual disability is:
- Down syndrome
- *Fragile X syndrome
- Phenylketonuria
- Rett syndrome
> Down syndrome is the commonest chromosomal cause but is usually not inherited; fragile X is the commonest inherited cause.
:::

## 2.2 Autism spectrum disorder [core][beginner]
You met the two areas of autism in the Starting level. Here we look at how autism shows at different ages, how it is diagnosed, what else comes with it, and what helps.

### How autism looks at different ages
- **Toddlers (one to three years)**: little pointing to show, poor response to name, little eye contact or shared smiles, delayed or unusual speech, playing with parts of toys (spinning wheels), lining things up, leading an adult by the hand as a tool. In about a quarter to a third, parents describe a **loss of early words** or social skills, often in the second year.
- **Preschool and school age**: difficulty joining in play, rigid routines, intense interests, echolalia, literal understanding, meltdowns at change or sensory overload, difficulty with group work.
- **Adolescence**: friendships become more complex and harder to manage; anxiety and depression rise; bullying is common; some young people realise they are different and feel deeply alone.
- **Adults**: many, especially women, are first diagnosed in adult life after years of feeling "out of step", often after a child is diagnosed or after burnout.

:::sounds How autistic young people describe it
- "Everyone else seems to have a rule book for conversations that nobody gave me."
- "The fluorescent light in class buzzes so loudly I can't hear the teacher."
- "I'm not being rude. I just don't know when it's my turn to talk."
- "After school I need to be alone for two hours, or I explode."
:::

:::widget build
{"vignette": "Kabir, 4, from Chennai, is brought by his parents. He speaks in single words, mostly repeating TV advertisements. He does not point to show his parents things, and when they point at a plane, he looks at their finger. He does not bring toys to show anyone and rarely smiles back. At preschool he plays alone, spinning the wheels of a toy car for long periods. He lines up his blocks by colour and screams if they are touched. He insists on the same blue plate at every meal. He covers his ears and runs away when the pressure cooker whistles. His motor milestones were normal. Hearing tests are normal.", "rule": "Tick what is present. Autism needs all three social communication deficits and at least two of the four restricted or repetitive patterns. Tick social items and repetitive items separately; the counter shows the total.", "symptoms": [{"label": "Social: deficit in social-emotional reciprocity", "present": true, "core": true, "why": "Does not share interest, rarely smiles back, does not bring things to show."}, {"label": "Social: deficit in nonverbal communication", "present": true, "core": true, "why": "Does not point or follow a point."}, {"label": "Social: deficit in developing relationships and play", "present": true, "core": true, "why": "Plays alone, no shared or pretend play with peers."}, {"label": "Repetitive: stereotyped movements, object use or speech", "present": true, "why": "Spinning wheels, lining up blocks, echoing advertisements."}, {"label": "Repetitive: insistence on sameness", "present": true, "why": "Same blue plate, distress when blocks are touched."}, {"label": "Repetitive: highly restricted, intense interests", "present": false, "why": "No single intense interest is described; do not tick what is not there."}, {"label": "Repetitive: unusual reaction to sensory input", "present": true, "why": "Covers ears and runs from the cooker whistle."}, {"label": "Hearing loss explains the picture", "present": false, "why": "Hearing tests are normal."}], "need": 6, "needCore": true, "verdict": "All three social communication deficits and three of the four repetitive patterns, starting in early childhood, with impairment and normal hearing. This fits autism spectrum disorder. Next: rate the support level for each domain, assess language and intellectual ability, screen for sleep problems and epilepsy, and plan early intervention."}
:::

### What else commonly comes with autism
- **Intellectual disability** in roughly a third (estimates vary widely).
- **Language disorder**, ranging from no speech to subtle problems with conversation.
- **ADHD** in a third to a half; it can be diagnosed alongside autism.
- **Anxiety** (very common), depression, and obsessive-compulsive symptoms.
- **Epilepsy** in about 1 in 5 to 1 in 4 over the lifetime, more with intellectual disability; peaks in early childhood and adolescence.
- **Sleep problems**, constipation and other gut problems, and **very selective eating**.
- **Catatonia** in some adolescents and young adults: slowing, freezing, loss of skills. This is treatable and must not be dismissed as "just autism".

### What helps
- **Early, parent-mediated intervention**: parents are coached to follow the child's lead, build shared attention and communication in daily routines. Programmes with good evidence include JASPER, the Early Start Denver Model, and PACT. An Indian adaptation, **PASS** (Parent-mediated intervention for Autism Spectrum disorders in South Asia), was delivered by non-specialist health workers in Goa.
- **Speech and language therapy**, including **augmentative and alternative communication** (picture cards, communication apps) for children with little speech. Using pictures does **not** stop a child learning to speak.
- **Structured teaching and visual schedules** at school, sensory adjustments (quiet corner, ear defenders), and clear, literal language.
- **Behavioural approaches** for specific goals and for challenging behaviour (functional assessment, positive behaviour support).
- **Treating what comes with it**: anxiety, ADHD, sleep, epilepsy.
- There is **no medicine for the core features** of autism.

:::trap Beware of "cures"
Families are often offered expensive "cures": chelation, stem-cell injections, hyperbaric oxygen, special diets for everyone, or "autism recovery" camps. None has good evidence, some are dangerous (chelation has killed children), and stem-cell treatment for autism is not approved in India. Your job is to listen without mocking, explain the evidence kindly, and keep the family engaged with real help.
:::

:::widget decide
{"scene": "The parents of Meher, 5, newly diagnosed with autism in Delhi, have read online about 'stem cell therapy for autism' at a private clinic. It costs several lakh rupees. They ask for your opinion. They are exhausted and hopeful.", "ask": "How do you respond?", "choices": [{"label": "Tell them firmly that it is a scam and they are foolish to consider it", "verdict": "ok", "outcome": "The facts are right, but the parents feel judged. They stop coming and go to the clinic anyway.", "why": "Correct information delivered with contempt loses the family. Hope and exhaustion drive these choices; meet them first."}, {"label": "Acknowledge how much they want to help Meher, explain that stem-cell treatment for autism is unproven and not approved, and offer concrete next steps: a parent-coaching programme, speech therapy, and a visual schedule at school", "verdict": "best", "outcome": "The parents decide to wait. They start parent coaching and see Meher begin to point and share for the first time a few months later.", "why": "Empathy plus honest evidence plus a real alternative keeps families engaged with help that works."}, {"label": "Say it might help and they can try it if they can afford it", "verdict": "harm", "outcome": "The family takes a loan. After the procedure Meher develops an infection; her development does not change.", "why": "False hope from a professional legitimises an unapproved, risky procedure."}]}
:::

:::clinician
### Diagnostic assessment
- **History** from parents with a developmental focus: early social communication, regression, play, sensory issues; a standardised interview such as the **ADI-R** in specialist settings.
- **Direct observation**: the **ADOS-2** is the international reference standard; in India the **INCLEN Diagnostic Tool for ASD (INDT-ASD)** is validated for children aged 2 to 9 years, and the **ISAA** (Indian Scale for Assessment of Autism, 40 items, scored 1 to 5; certification bands roughly: 70 to 106 mild, 107 to 153 moderate, above 153 severe) is used for disability certification. CARS-2 is widely used.
- **Cognitive and language** assessment, adaptive behaviour (VABS), hearing, vision, and a medical review. Genetic testing (microarray, fragile X; exome where available) is recommended for all autistic children, particularly with ID or dysmorphic features.
- **Differential**: language disorder, social (pragmatic) communication disorder (no restricted or repetitive behaviour), hearing loss, intellectual disability alone, reactive attachment disorder after severe neglect (improves with good care), selective mutism, ADHD, early-onset schizophrenia (rare, with hallucinations and delusions), Rett syndrome in girls (regression with loss of hand use and hand-wringing, slowing head growth).

### Medicines for associated problems (not core features)
| Target | Medicine | Typical dosing | Notes (Indian brands as examples) |
|---|---|---|---|
| Severe irritability, aggression, self-injury | Risperidone | Below 20 kg: start 0.25 mg; 20 kg and over: 0.5 mg; target 0.5 to 3 mg daily | Risdone, Sizodon. Weight, glucose, lipids, prolactin |
| Same | Aripiprazole | Start 2 mg; 5 to 15 mg daily | Arip MT, Aripra. Less prolactin, more akathisia |
| ADHD symptoms | Methylphenidate | Start 2.5 to 5 mg once or twice daily, raise slowly | Smaller benefit and more irritability than in ADHD alone |
| ADHD, sleep-onset, tics | Clonidine | 0.025 to 0.05 mg at night, slowly to 0.1 to 0.2 mg daily | Arkamin. Watch blood pressure and do not stop suddenly |
| Sleep onset | Melatonin | 1 to 3 mg, up to about 6 to 10 mg, 30 to 60 minutes before bed | After sleep hygiene; prolonged-release forms exist |
| Anxiety | SSRIs (for example sertraline, fluoxetine) | Start very low (sertraline 12.5 to 25 mg) | Evidence weaker than in non-autistic youth; activation common |

SSRIs do not reduce repetitive behaviours in autistic children (a large citalopram trial was negative). As of Nov 2026, oxytocin and bumetanide trials have not shown reliable benefit; no drug is approved for core features.
:::

:::recall
1. In what proportion of autistic children do parents describe a loss of early words or social skills? || About a quarter to a third.
2. Name four conditions that commonly come with autism. || Intellectual disability, ADHD, anxiety, epilepsy (also sleep problems, language disorder, selective eating, catatonia).
3. What is the evidence-based core of early intervention? || Parent-mediated programmes that build shared attention and communication in daily routines, plus speech therapy and structured teaching.
4. Does using picture cards stop a child learning to speak? || No; augmentative communication supports speech development.
5. Which Indian scale is used for autism disability certification? || ISAA (Indian Scale for Assessment of Autism).
:::

:::mcq
Q: A 7-year-old has difficulty with conversation, misses social cues and takes jokes literally, but has no repetitive behaviours, rigid routines, intense interests or sensory differences. Which diagnosis fits best?
- Autism spectrum disorder, level 1
- *Social (pragmatic) communication disorder
- ADHD
- Selective mutism
> Without the restricted or repetitive group, autism cannot be diagnosed.

Q: Which medicine has good evidence for severe irritability and aggression in autistic children?
- Fluoxetine
- *Risperidone
- Lithium
- Diazepam
> Risperidone and aripiprazole are approved for irritability in autism; neither treats core features.
:::

## 2.3 ADHD [core][beginner]
In the Starting level you met the two groups of ADHD symptoms. Now we apply the full rules, look at how ADHD changes with age, what looks like it, and how treatment is planned.

:::widget guess
{"prompt": "Before what age must several ADHD symptoms have been present?", "min": 3, "max": 18, "unit": "years", "answer": [12, 12], "reveal": "Before 12 years. The person does not need a diagnosis by then, but several symptoms must have been there. If attention problems first appear in the teens or adulthood, think first of something else: depression, anxiety, substance use, sleep problems, or a medical cause.", "clinician": "DSM-5-TR criterion B: several inattentive or hyperactive-impulsive symptoms present prior to age 12 years (raised from age 7 in DSM-IV). Collateral history and old school reports are invaluable in adults."}
:::

### The full rule, in plain words
- Enough symptoms in one or both groups (the exact numbers are in the Clinician view), clearly more than expected for the child's age.
- Present for a good while, not just after a stressful term.
- Several symptoms began in childhood.
- Seen in **two or more settings**: home, school, tuition, sports, family gatherings.
- Clearly harming school, friendships or family life.
- Not better explained by another problem.

:::widget build
{"vignette": "Dev, 8, from Indore. His class teacher writes that he 'never sits through a period', calls out answers, leaves worksheets half-done and loses his pencil box weekly. His mother says the same happens at home and at his grandmother's: he cannot wait his turn in games, runs and climbs in the house, talks over everyone and forgets what he was sent to fetch. It has been like this since he was three. He sleeps well, his hearing and vision were checked last year, and his reading is at his class level. Other children have started to avoid him. Count only the inattentive symptoms here.", "rule": "Inattentive presentation needs at least six of the nine inattentive symptoms (for a child), present in two settings, with impairment.", "symptoms": [{"label": "Careless mistakes, poor attention to detail", "present": false, "why": "Not described. Half-finished work is not the same as careless errors."}, {"label": "Difficulty sustaining attention in tasks or play", "present": true, "why": "Never sits through a period."}, {"label": "Does not seem to listen when spoken to", "present": false, "why": "Not described here."}, {"label": "Does not follow through or finish tasks", "present": true, "why": "Worksheets left half-done."}, {"label": "Difficulty organising tasks and activities", "present": false}, {"label": "Avoids tasks that need sustained mental effort", "present": false}, {"label": "Loses things needed for tasks", "present": true, "why": "Loses his pencil box weekly."}, {"label": "Easily distracted", "present": false, "why": "Not stated; don't assume."}, {"label": "Forgetful in daily activities", "present": true, "why": "Forgets what he was sent to fetch."}], "need": 6, "needCore": false, "verdict": "Only four inattentive symptoms are described, so the inattentive group is not met from this story. But Dev clearly shows hyperactive-impulsive symptoms (calls out, cannot wait, runs and climbs, talks over others, cannot stay seated) in several settings since early childhood, with impairment. If those reach six, he meets the predominantly hyperactive-impulsive presentation. Ask about the missing inattentive symptoms: a fuller history may show combined presentation."}
:::

:::widget flow
{"title": "Reaching an ADHD diagnosis step by step", "layout": "chain", "nodes": [{"id": "a", "label": "Enough symptoms", "detail": "Count inattentive and hyperactive-impulsive symptoms separately against the thresholds for age."}, {"id": "b", "label": "Beyond the expected for age", "detail": "Compare with other children of the same developmental level, not with the parents' hopes."}, {"id": "c", "label": "Childhood onset", "detail": "Several symptoms present before 12: school reports and parents' memories help."}, {"id": "d", "label": "Two or more settings", "detail": "Home and school at least; tuition, sport and family gatherings add evidence."}, {"id": "e", "label": "Clear impairment", "detail": "Learning, friendships, family life, safety."}, {"id": "f", "label": "Not better explained", "detail": "Rule out learning disorder, sensory problems, sleep, anxiety, depression, trauma, medical causes."}, {"id": "g", "label": "Name the presentation", "detail": "Combined, mainly inattentive, or mainly hyperactive-impulsive; then plan help."}], "caption": "Press Play. Every step must be satisfied; a rating scale alone is not a diagnosis."}
:::

### ADHD across the life span
- **Preschool**: very high activity, accidents, being excluded from playgroups. Diagnosis is harder before four because all young children are active.
- **School age**: classroom problems, poor marks below ability, being punished, peer rejection.
- **Adolescence**: restlessness becomes an inner feeling; disorganisation, missed deadlines, risk-taking, road accidents, early substance use, conflict at home.
- **Adults**: chaotic time management, job changes, forgotten bills, relationship strain, emotional quick temper. Many have been called "lazy" all their lives.

### Things that look like ADHD
| Look-alike | What gives it away |
|---|---|
| Normal high energy in a young child | Within the range for age; no clear impairment |
| Learning disorder | Inattention mainly during reading or writing; normal elsewhere |
| Hearing or vision problems | Fails to follow instructions; squints; tests abnormal |
| Short or poor sleep, sleep apnoea | Snoring, mouth-breathing, daytime sleepiness, late bedtimes, screens at night |
| Anxiety | Worry, stomach aches, restlessness linked to fears |
| Depression | Recent change, sad or irritable mood, loss of interest |
| Trauma or a chaotic home | Hypervigilance, symptoms began after events, fear |
| Absence seizures | Brief blank spells with eyelid flicker, many times a day |
| Medicines | Antihistamines, salbutamol, some anti-epileptics |
| Thyroid overactivity | Weight loss, sweating, fast pulse |

:::widget decide
{"scene": "Ananya, 15, in Bengaluru, says she 'cannot focus at all' this year. Her marks have fallen sharply. She asks for 'the ADHD medicine' a friend uses for exams. Her school reports from earlier years describe her as attentive and organised. On gentle questioning she sleeps four to five hours a night, has stopped dancing, which she loved, and feels 'empty and pointless' most days.", "ask": "What is the most likely explanation, and what do you do?", "choices": [{"label": "Prescribe methylphenidate for exam focus", "verdict": "harm", "outcome": "She feels more anxious, sleeps even less, and her mood drops further.", "why": "No childhood symptoms, sudden onset in the teens and clear depressive symptoms point away from ADHD. Stimulants can worsen sleep and anxiety and do not treat depression."}, {"label": "Recognise that onset in the teens with low mood, loss of pleasure and poor sleep suggests depression; assess mood and suicide risk, and involve her family with her consent", "verdict": "best", "outcome": "Ananya meets criteria for a depressive episode. She starts psychological therapy, sleep improves and her concentration slowly returns. On direct questioning she has had passing thoughts that 'it would be easier not to wake up', which are addressed with a safety plan.", "why": "Poor concentration is a symptom of depression. ADHD needs childhood onset. Always ask about safety in a low, sleepless teenager."}, {"label": "Tell her to stop using her phone at night and come back after exams", "verdict": "ok", "outcome": "Sleep hygiene helps a little, but her depression is untreated through the exams.", "why": "Good advice, but it misses a treatable depression and any risk."}]}
:::

### How ADHD is treated
Treatment is a plan, not a pill.
1. **Explain** ADHD to the child, family and school, without blame.
2. **Parent training** (especially for children under about six and when behaviour is difficult): praise for good behaviour, clear short instructions, predictable routines, calm consistent consequences.
3. **School support**: sit near the teacher and away from distractions, break tasks into small steps, short movement breaks, written instructions, extra time.
4. **Medicine** for school-age children and adolescents when symptoms remain impairing. **Stimulants** (methylphenidate) work for about 70 in 100 children. Non-stimulants (atomoxetine, clonidine, guanfacine) are alternatives.
5. **Treat what comes with it**: learning disorders, anxiety, sleep problems, tics, oppositional behaviour.

:::clinician
### Rules and evidence
- **Symptom thresholds**: six of nine in a domain under 17; five of nine at 17 and over; at least 6 months; several symptoms before 12; two or more settings; clear impairment; not better explained.
- **Rating scales**: Vanderbilt (parent and teacher, includes screening for ODD, CD, anxiety and depression), Conners-3, SNAP-IV, ADHD Rating Scale-5; Adult ADHD Self-Report Scale (ASRS v1.1) for adults; DIVA-5 structured interview for adults.
- **MTA study** (1999, 579 children): at 14 months, carefully titrated medication management beat intensive behavioural treatment and community care for core symptoms; combined treatment gave modest added benefit for some outcomes (oppositional symptoms, parent satisfaction) and allowed lower doses. Group differences faded at long-term follow-up, partly because treatments converged.
- **Comparative efficacy**: methylphenidate first choice in children and adolescents; amphetamines first choice in adults. Lisdexamfetamine and other amphetamines are not marketed in India.
- **Preschool**: parent training first; methylphenidate only if severe and after parent training (Preschool ADHD Treatment Study, PATS: effective, with more side effects).
- Full medicine profiles and dosing are in section 3.2.
:::

:::recall
1. List the six parts of the ADHD rule in plain words. || Enough symptoms in a group; persistent; several before 12; two or more settings; impairment; not better explained.
2. Name four conditions that can look like ADHD. || Learning disorder, hearing or vision problems, poor sleep or sleep apnoea, anxiety, depression, trauma, absence seizures, thyroid overactivity, medicines.
3. What is the first-line treatment for ADHD in a four-year-old? || Parent training.
4. About what proportion of children respond to stimulant medicine? || About 70 in 100.
:::

:::mcq
Q: A 16-year-old with no attention problems before 14 now cannot concentrate, sleeps poorly and has lost interest in friends. The best first step is:
- Start a stimulant
- *Assess for depression and other causes, since ADHD needs childhood onset
- Order an MRI
- Diagnose adult-type ADHD
> New-onset inattention in the teens has other causes until proven otherwise.

Q: A 9-year-old with snoring, mouth-breathing and daytime sleepiness is referred for 'ADHD'. The first thing to consider is:
- Starting atomoxetine
- *Sleep-disordered breathing, for example from enlarged tonsils and adenoids
- Autism
- Conduct disorder
> Poor sleep is a common, treatable cause of inattention and hyperactivity.
:::

## 2.4 Learning disorders, tics and communication [core][beginner]
This section groups several neurodevelopmental conditions that families often meet in school and in the paediatric clinic.

### Specific learning disorder
A specific learning disorder is diagnosed when a child has **persistent difficulty learning a key academic skill** despite targeted help, the skill is **well below** what is expected for age on standardised tests, the difficulty began in the school years, and it is **not better explained** by intellectual disability, poor vision or hearing, another mental or neurological disorder, poor teaching, or not knowing the language of instruction.

The three areas:
- **Reading**: slow, effortful, inaccurate word reading, poor understanding of what is read. Underneath is usually a difficulty with **phonological processing**: breaking words into sounds and linking sounds to letters.
- **Written expression**: spelling, grammar and punctuation errors, poorly organised writing. Handwriting alone is not enough (think of developmental coordination disorder).
- **Mathematics**: number sense, memorising number facts, accurate or fluent calculation, maths reasoning.

:::widget guess
{"prompt": "Out of every 100 school-age children, about how many have a specific learning disorder in reading, writing or maths?", "min": 0, "max": 30, "unit": "children", "answer": [5, 15], "reveal": "Roughly 5 to 15 in 100, depending on the language, school system and the cut-off used. Reading difficulty is the most common. Boys are identified more often.", "clinician": "DSM-5-TR: 5% to 15% across reading, writing and maths among school-age children in several countries. Indian school studies report roughly 3% to 10%, often with high comorbidity with ADHD (about a third)."}
:::

### Tic disorders
A **tic** is a sudden, rapid, repeated movement or sound that is not rhythmic: eye blinking, nose twitching, shoulder shrugging, throat clearing, sniffing, grunting. Complex tics include touching, jumping, repeating others' words (echolalia), or, rarely, swearing (**coprolalia**, present in only a minority).

Key facts:
- Tics often start between **four and six years**, peak around **ten to twelve**, and lessen in the late teens for most.
- Tics **wax and wane** and change over time.
- Many people feel an **urge** before a tic, like the need to sneeze, and relief after. Tics can be held back for a while, which is why teachers wrongly think the child "can stop if he wants".
- Stress, excitement and tiredness make tics worse; concentrating on an absorbing task often makes them better.

| Diagnosis | What is needed |
|---|---|
| **Tourette's disorder** | Several motor tics **and** at least one vocal tic (not necessarily at the same time), for a long period, starting in childhood |
| **Persistent (chronic) motor or vocal tic disorder** | Motor **or** vocal tics, but not both, for a long period |
| **Provisional tic disorder** | Tics present for a shorter period |

:::widget guess
{"prompt": "For Tourette's disorder or a persistent tic disorder, tics must have been present for more than how many months since they started?", "min": 0, "max": 36, "unit": "months", "answer": [12, 12], "reveal": "More than one year since the first tic. Tics present for less than a year are called a provisional tic disorder; most of these fade.", "clinician": "DSM-5-TR: Tourette's requires multiple motor and one or more vocal tics at some time during the illness, tics may wax and wane but persisted for more than 1 year since first onset, onset before age 18, not attributable to a substance or medical condition. Provisional tic disorder: present for less than 1 year. Transient tics occur in up to about 1 in 5 school children; Tourette's in about 3 to 9 per 1,000 school-age children."}
:::

:::widget flow
{"title": "Why tics are hard to stop, and how habit reversal breaks the loop", "layout": "cycle", "nodes": [{"id": "a", "label": "Premonitory urge", "detail": "An itch, pressure or tension in a body part."}, {"id": "b", "label": "Tic", "detail": "The movement or sound happens."}, {"id": "c", "label": "Relief", "detail": "The urge fades for a while."}, {"id": "d", "label": "Learning", "detail": "Relief rewards the tic, strengthening the urge-tic link. In habit reversal the child learns to notice the urge and do a competing response until the urge passes, which weakens the loop."}], "caption": "Press Play to go round the cycle. Telling a child to stop does not break it; teaching awareness and a competing response can."}
:::

### What comes with tics
In Tourette's, **ADHD** (about half) and **obsessive-compulsive symptoms** (about a third) are common and often cause more trouble than the tics themselves. Anxiety, rage attacks and learning problems also occur.

### Communication disorders
- **Language disorder**: difficulty with vocabulary, grammar and putting sentences together, in understanding and/or speaking.
- **Speech sound disorder**: difficulty making speech sounds clearly beyond the expected age.
- **Childhood-onset fluency disorder (stuttering)**: repetitions, prolongations and blocks, often with tension and avoidance of words or situations. Most young children who stutter recover, but stuttering lasting into school age needs speech therapy.
- **Social (pragmatic) communication disorder**: difficulty with the social use of language (taking turns, adjusting to the listener, understanding hints and humour) without the restricted, repetitive behaviours of autism.

### Movement disorders of development
- **Developmental coordination disorder**: clumsiness and poor motor skills (catching, handwriting, tying laces, cycling) well below age, not explained by a neurological illness.
- **Stereotypic movement disorder**: repetitive, purposeless movements such as rocking, head-banging or hand-waving that interfere with life or cause injury. More common with intellectual disability and sensory impairment.

:::widget sort
{"prompt": "Name the condition. Place each child.", "buckets": ["Tic disorder", "Stuttering", "Developmental coordination disorder", "Stereotypic movement"], "items": [{"text": "Blinks hard and sniffs repeatedly; says he feels an itch before it and can hold it back for a few minutes", "bucket": 0}, {"text": "Repeats the first sound of words ('m-m-m-mummy') and avoids answering in class", "bucket": 1}, {"text": "Cannot catch a ball, tie laces or write neatly; falls often; intelligence is average", "bucket": 2}, {"text": "A boy with severe intellectual disability rocks and bangs his head for long periods, causing bruises", "bucket": 3, "why": "Rhythmic, purposeless and self-injurious, with no premonitory urge."}, {"text": "Shrugs one shoulder and clears her throat; it is worse during exams", "bucket": 0}, {"text": "Gets stuck on words with a silent block, with facial tension", "bucket": 1}]}
:::

:::clinician
### Managing tics
1. **Psychoeducation** for the child, family and school is often enough. Teachers should not tell the child to stop; a pass to leave the room briefly can help.
2. **Comprehensive Behavioural Intervention for Tics (CBIT)**, built on **habit reversal training** (awareness training plus a competing response held for about a minute when the urge comes), is first-line when tics impair. It works about as well as medicine in trials.
3. **Medicine** for moderate to severe tics:
   - **Clonidine** (Arkamin) 0.025 to 0.05 mg at night, increase every 3 to 7 days to 0.1 to 0.3 mg daily in divided doses; or **guanfacine**. Also helps ADHD. Sedation, low blood pressure; taper to stop (rebound hypertension).
   - **Aripiprazole** (Arip MT) start 1 to 2 mg, usual 5 to 10 mg (up to 15 to 20 mg in older adolescents). FDA-approved for Tourette's from age 6.
   - **Risperidone** 0.25 to 0.5 mg, usual 1 to 3 mg.
   - **Haloperidol** 0.25 to 0.5 mg, usual 1 to 4 mg, and **pimozide** (ECG needed, QT prolongation, CYP3A4 interactions) are older approved options with more extrapyramidal effects.
   - **Tetrabenazine** for refractory cases (depression risk).
   - Deep brain stimulation only for severe, refractory adult Tourette's.
4. **Treat ADHD**: methylphenidate does not usually worsen tics on average (later meta-analyses), so it can be used with monitoring.

### Learning disorder: management
Evidence-based remediation is **structured, explicit, systematic phonics-based instruction** for reading (multisensory approaches such as Orton-Gillingham-based programmes), taught by a special educator, frequent and sustained. Coloured overlays, eye exercises and "brain training" games have no good evidence. Accommodations (extra time, reader, scribe, calculator, oral exams) reduce the impact while skills build. Screen for ADHD, anxiety and low self-esteem.

### Stuttering
The Lidcombe Program (parent-delivered operant treatment) has good evidence in preschoolers; fluency shaping and stuttering modification for older children and adults.
:::

:::recall
1. What processing difficulty usually underlies dyslexia? || Phonological processing: breaking words into sounds and linking sounds to letters.
2. What separates Tourette's disorder from a persistent motor tic disorder? || Tourette's needs both motor and vocal tics; persistent tic disorder has one kind only.
3. What is the premonitory urge? || An uncomfortable feeling before a tic, relieved by doing it.
4. What is the first-line psychological treatment for impairing tics? || CBIT, built on habit reversal training.
5. Which two conditions commonly come with Tourette's? || ADHD and obsessive-compulsive symptoms.
:::

:::mcq
Q: A teacher punishes a 10-year-old for 'deliberately' clearing his throat in class, because he can stop for a few minutes when told. The best advice is:
- The teacher is right; if he can stop, it is voluntary
- *Tics can be held back briefly but build up; explain tics to the school and avoid punishment
- He needs an antipsychotic at once
- He should be moved to a special school
> Suppressibility is part of tics, not proof they are deliberate.

Q: A child of average intelligence has very poor handwriting, cannot tie laces or catch a ball, and is often called clumsy. The most likely diagnosis is:
- Tourette's disorder
- Specific learning disorder in reading
- *Developmental coordination disorder
- Autism spectrum disorder
> Motor skills well below age, without neurological illness.
:::

## 2.5 Anxiety and depression in young people [core][beginner]
Anxiety and depression are among the commonest mental health problems in children and teenagers. They are easily missed, because these young people often suffer quietly, or show their distress through the body and behaviour rather than words.

### Normal fears change with age
Babies fear strangers and separation; preschoolers fear the dark, animals and monsters; school children fear injury, illness and failure; teenagers fear social judgement and the future. Anxiety becomes a disorder when it is **far beyond what is expected for age**, lasts, and **stops the child doing ordinary things**.

### The main childhood anxiety problems
- **Separation anxiety disorder**: excessive fear of being apart from parents, worry that something will happen to them, refusing to sleep alone or go to school, stomach aches on school mornings.
- **Selective mutism**: a child who speaks normally at home but consistently does not speak at school or with unfamiliar people. It is a form of anxiety, not stubbornness.
- **Specific phobias**: dogs, injections, the dark, vomiting.
- **Social anxiety disorder**: fear of being watched, judged or embarrassed; avoiding reading aloud, eating in front of others, parties. In children, the fear must show with other children, not only adults.
- **Generalised anxiety disorder**: worry about many things (marks, health, family money, being late), with tension and poor sleep.
- **Panic attacks**: more common from adolescence.

:::example School refusal in Kolkata
Rohit, 11, has missed most of the last month of school. Every morning he has a stomach ache and sometimes vomits. On Sundays he is fine. His tests for gut problems are normal. He tells you, when his mother steps out, that he is scared his mother will "fall ill and die" while he is at school, since she was in hospital last year. This is **school refusal driven by separation anxiety**, not truancy. Truants hide their absence and do not want to be at home with parents.
:::

:::widget flow
{"title": "How school refusal keeps itself going", "layout": "cycle", "nodes": [{"id": "a", "label": "School morning", "detail": "Fear rises: of separation, of a teacher, of a test."}, {"id": "b", "label": "Body alarm", "detail": "Stomach ache, nausea, crying."}, {"id": "c", "label": "Allowed to stay home", "detail": "Fear drops at once: a powerful reward."}, {"id": "d", "label": "Next morning is harder", "detail": "Missed work and lost friendships add new worries, and the brain has learned that avoiding works."}], "caption": "Press Play. Breaking the cycle means small, steady steps back, with support, not a single forced return."}
:::

### Depression in children and teenagers
Depression in young people often shows as:
- **Irritability** more than sadness: snapping, angry outbursts, "bad attitude".
- Loss of interest in friends, games and hobbies.
- Falling marks, poor concentration, school avoidance.
- Body complaints: headaches, stomach aches, tiredness.
- Changes in sleep and appetite; in teenagers, oversleeping is common.
- Self-criticism ("I'm useless"), hopelessness, thoughts of death, and in teenagers, **self-harm**.

:::widget sort
{"prompt": "Separation anxiety, social anxiety, or depression? Place each young person.", "buckets": ["Separation anxiety", "Social anxiety", "Depression"], "items": [{"text": "Cannot sleep unless her mother lies beside her; fears her mother will be in an accident", "bucket": 0}, {"text": "Skips the class presentation, sure that everyone will laugh at him", "bucket": 1}, {"text": "Has stopped playing cricket, snaps at everyone, says 'nothing matters'", "bucket": 2, "why": "Irritability and loss of interest are common ways depression shows in boys."}, {"text": "Eats lunch alone in the toilet because she fears being watched while eating", "bucket": 1}, {"text": "Clings and cries at the school gate every morning, fine once mother returns", "bucket": 0}, {"text": "Sleeps twelve hours, has stopped messaging friends, marks have fallen, wrote 'I want to disappear' in her notebook", "bucket": 2, "why": "This also needs a direct, kind question about suicidal thoughts and a safety plan."}]}
:::

### Indian context: pressure and protection
Board exams, competitive entrance coaching (for engineering and medicine), comparison with cousins, and the fear of disappointing parents add heavy pressure. Student suicides in coaching hubs have led to national guidelines for coaching centres (2024) limiting enrolment age and requiring counselling support. Families are also a major **protective factor**: warmth, being listened to, and not being compared are linked to better mental health. Your job is to work **with** the family.

:::widget decide
{"scene": "Simran, 16, in Kota, is preparing for the medical entrance exam. Her mother brings her because she 'cries all the time and has stopped studying'. Simran tells you, when alone, that she has failed two mock tests, feels she has 'wasted her parents' money', cannot sleep, and has been thinking that 'everyone would be better off without me'. She has not told anyone.", "ask": "What do you do next?", "choices": [{"label": "Reassure her that exams are not everything and give her study tips", "verdict": "harm", "outcome": "She feels unheard. A week later she takes an overdose of her mother's tablets and is admitted.", "why": "Thoughts that others would be better off without her are suicidal thinking. They need direct questions and a safety response, not reassurance."}, {"label": "Ask directly and calmly about suicidal thoughts and plans, make a safety plan, explain that you will need to tell her parents to keep her safe, and involve them with care", "verdict": "best", "outcome": "Simran says she has thought of jumping from the hostel terrace but has no firm plan. With her agreement you talk to her mother together. Her mother is shocked but supportive. Simran moves home for a while, starts therapy and her risk is reviewed regularly.", "why": "Asking about suicide does not plant the idea; it often brings relief. Confidentiality has limits when a young person is at risk. A safety plan, family involvement and treatment follow."}, {"label": "Promise to keep everything secret so she trusts you", "verdict": "harm", "outcome": "You cannot act safely, and the trust breaks later when you have to tell her parents without warning.", "why": "Never promise total secrecy to a young person. Explain the limits of confidentiality at the start."}]}
:::

:::clinician
### Diagnostic notes
- **Separation anxiety disorder**: fear lasting at least 4 weeks in children and adolescents (typically 6 months or more in adults); three or more of eight symptoms.
- **Selective mutism**: at least 1 month, not limited to the first month of school; not due to lack of knowledge of the language (important in children who have just moved and learn in a new language).
- **Generalised anxiety disorder**: only one associated symptom (restlessness, fatigue, concentration, irritability, tension, sleep) is required in children, versus three in adults; at least 6 months.
- **Depression**: irritable mood can replace depressed mood in children and adolescents; failure to make expected weight gain counts as a weight symptom. **Persistent depressive disorder**: 1 year in youth, not 2. Screen with PHQ-A, the Mood and Feelings Questionnaire (MFQ), or the RCADS; screen for past hypomania and family history of bipolar disorder.

### Treatment and evidence
- **Anxiety**: CBT with exposure first (Coping Cat and similar, parent involvement in younger children). **CAMS** trial (ages 7 to 17): response at 12 weeks was 81% with combination CBT plus sertraline, 60% CBT, 55% sertraline, 24% placebo. SSRIs for moderate to severe or CBT-unresponsive anxiety: sertraline start 12.5 to 25 mg, usual 50 to 200 mg; fluoxetine start 5 to 10 mg, usual 10 to 40 mg (Fludac, Flunil). Avoid long-term benzodiazepines.
- **Depression**: mild, watchful waiting and supportive care; moderate to severe, CBT or interpersonal therapy for adolescents (IPT-A), and **fluoxetine** as the first-choice medicine (start 10 mg, increase to 20 mg after about a week; maximum usually 40 to 60 mg in adolescents). Escitalopram is the second option (approved in the US from 12 years; start 5 to 10 mg, up to 20 mg). **TADS** (ages 12 to 17): 12-week response 71% combination, 61% fluoxetine, 43% CBT, 35% placebo; combination also reduced suicidal events relative to fluoxetine alone. Avoid paroxetine, venlafaxine and tricyclics (poor efficacy, more harm in youth).
- **The warning**: since 2004 antidepressants carry an FDA boxed warning about increased suicidal thinking and behaviour in children, adolescents and young adults under 25 (in trials, about 4% on drug versus 2% on placebo; no completed suicides). Untreated depression is the larger danger; monitor closely, especially in the first month and after dose changes, and warn families to watch for agitation, insomnia and new suicidal talk.
- **Coaching centre guidelines** (Ministry of Education, January 2024): no enrolment under 16 or before Class 10, counselling system required, no misleading promises of ranks; enforcement varies by state.
:::

:::recall
1. How does depression often show differently in children? || Irritability, body complaints, falling marks, loss of interest, oversleeping in teens, self-harm.
2. How do you tell school refusal from truancy? || School refusal: anxious, wants to be at home, parents know; truancy: hides absence, not at home, often with conduct problems.
3. What is selective mutism? || Consistently not speaking in certain social settings such as school, while speaking normally at home; a form of anxiety.
4. Which antidepressant is first choice in adolescent depression? || Fluoxetine.
5. What should you never promise a young person in an assessment? || Total secrecy; explain the limits of confidentiality at the start.
:::

:::mcq
Q: A 6-year-old who moved from Kerala to Delhi only recently does not speak at school but chatters in Malayalam at home. The best first view is:
- Selective mutism; start fluoxetine
- *She is still learning the school's language and has only just arrived; selective mutism should not be diagnosed yet
- Autism spectrum disorder
- Oppositional defiant disorder
> Selective mutism is not diagnosed when silence reflects a new language or the first weeks in a new school.

Q: In the CAMS trial for childhood anxiety, which treatment gave the best response?
- Sertraline alone
- CBT alone
- *CBT combined with sertraline
- Placebo
> Combination treatment had the highest response.
:::

## 2.6 Disruptive behaviour and mood dysregulation [core][beginner]
All children break rules and lose their temper sometimes. Three diagnoses describe patterns that go well beyond this.

### Oppositional defiant disorder (ODD)
A lasting pattern of **angry or irritable mood**, **arguing and defiance**, and **spitefulness**, more than expected for age. The child loses her temper easily, argues with adults, refuses requests, deliberately annoys people, blames others and holds grudges. It is usually aimed at people the child knows well, especially parents. ODD does not involve serious aggression, cruelty or crime.

### Conduct disorder
A repeated pattern of **violating other people's basic rights or major rules** expected at that age. Behaviours fall into four groups:
1. **Aggression to people and animals**: bullying, starting fights, using weapons, cruelty to people or animals, robbery, forced sexual activity.
2. **Destruction of property**: deliberate fire-setting, vandalism.
3. **Deceitfulness or theft**: breaking into homes or cars, conning others, shoplifting.
4. **Serious violation of rules**: staying out at night despite parents, running away from home, truancy from an early age.

Conduct disorder that **starts in childhood** (before about ten years) carries the worst outlook: more aggression, more ADHD, and a higher chance of antisocial personality disorder in adult life. When it starts in adolescence, it is often more linked to peers and has a better outlook.

Some young people with conduct disorder also show **limited prosocial emotions**: little remorse or guilt, little care for others' feelings, not caring about poor performance, and shallow emotions. This "callous-unemotional" group has a more severe and persistent course and needs specialised help.

### Disruptive mood dysregulation disorder (DMDD)
A child with DMDD has **severe, frequent temper outbursts** far out of proportion to the situation, **and** in between is **irritable or angry most of the day, nearly every day**. It was added to DSM-5 partly to stop many chronically irritable children being wrongly labelled with bipolar disorder. These children are more likely to develop depression and anxiety later, not bipolar disorder.

:::widget sort
{"prompt": "ODD, conduct disorder, or DMDD? Place each child.", "buckets": ["Oppositional defiant disorder", "Conduct disorder", "DMDD"], "items": [{"text": "Argues with every instruction from his parents, deliberately annoys his sister, blames everyone else, but has never hurt anyone or stolen", "bucket": 0}, {"text": "Has set fire to a neighbour's shed, steals from shops and has threatened a classmate with a knife", "bucket": 1}, {"text": "Explodes in rage several times a week over tiny things, and is grumpy and angry almost all day in between, at home and school", "bucket": 2}, {"text": "Was cruel to the family dog and bullies younger children, showing no guilt", "bucket": 1, "why": "Cruelty with no remorse suggests conduct disorder with limited prosocial emotions."}, {"text": "Spiteful and touchy with her mother, refuses chores, but calm at school and with friends", "bucket": 0, "why": "ODD can be limited to one setting, usually home."}, {"text": "Runs away from home overnight, skips school regularly, breaks into cars", "bucket": 1}]}
:::

:::widget guess
{"prompt": "DMDD should not be diagnosed for the first time before what age?", "min": 2, "max": 12, "unit": "years", "answer": [6, 6], "reveal": "Not before 6 years (because tantrums are normal in young children) and not after 18. The outbursts must have started before 10.", "clinician": "DSM-5-TR DMDD: outbursts three or more times a week on average; mood between outbursts persistently irritable or angry most of the day, nearly every day; present for 12 months or more without a break of 3 or more consecutive months; in at least two of three settings and severe in at least one; first diagnosis between 6 and 18 years; onset before 10. It cannot coexist with ODD, intermittent explosive disorder or bipolar disorder (if criteria for both DMDD and ODD are met, diagnose DMDD only). ICD-11 has no DMDD; it uses ODD with chronic irritability-anger."}
:::

:::widget flow
{"title": "The coercive cycle between parent and child", "layout": "cycle", "nodes": [{"id": "a", "label": "Parent gives an instruction", "detail": "Often vague or shouted from another room."}, {"id": "b", "label": "Child refuses or whines", "detail": "Defiance escalates."}, {"id": "c", "label": "Parent gives in, or explodes", "detail": "Giving in rewards the child's defiance; exploding teaches that shouting wins and models aggression."}, {"id": "d", "label": "Both learn", "detail": "The child learns defiance works; the parent learns that giving in or exploding ends the noise. Next time both escalate faster."}], "caption": "Press Play. Parent training breaks the cycle with clear calm instructions, praise for cooperation, and consistent non-violent consequences."}
:::

### What causes disruptive behaviour?
Disruptive behaviour grows from a mix of **child factors** (difficult temperament, ADHD, language delay, low intelligence, callous traits) and **environment** (harsh, inconsistent or neglectful parenting, family conflict and violence, parental substance use or mental illness, poverty, deviant peers, abuse). A common cycle is the **coercive cycle**: the child whines or defies; the parent gives in, which rewards the defiance; or the parent explodes, which teaches the child that shouting wins. Both escalate.

:::widget decide
{"scene": "Mr and Mrs Fernandes, from Goa, bring Joel, 6. He refuses every instruction and screams until he gets his way. His father admits he often 'gives a few slaps' and then, feeling guilty, buys Joel a toy. His mother gives in quickly to stop the noise. Joel's teacher reports that he follows rules at school.", "ask": "What is the most effective first treatment?", "choices": [{"label": "Prescribe risperidone to reduce his anger", "verdict": "harm", "outcome": "Joel gains weight and becomes sleepy. At home the pattern continues.", "why": "Medicine is not first-line for oppositional behaviour. The family pattern that maintains it is untouched."}, {"label": "Parent management training: special one-to-one play time, praise for cooperation, clear calm instructions, ignoring minor misbehaviour, and consistent non-violent consequences such as time-out", "verdict": "best", "outcome": "Over the next few months, both parents learn to respond consistently. Joel's outbursts become shorter and rarer. His father stops hitting him.", "why": "Parent training is the best-evidenced treatment for ODD and early conduct problems. It breaks the coercive cycle and replaces harsh discipline."}, {"label": "Advise firmer physical punishment", "verdict": "harm", "outcome": "Joel becomes more aggressive and starts hitting other children.", "why": "Physical punishment predicts more aggression, not less, and is a form of harm. Under the Right to Education Act corporal punishment is banned in Indian schools, and it is harmful at home too."}]}
:::

:::clinician
### Criteria in outline
- **ODD**: at least four symptoms from eight (angry/irritable mood: often loses temper, touchy or easily annoyed, angry and resentful; argumentative/defiant: argues with authority figures, defies rules, deliberately annoys, blames others; vindictiveness: spiteful at least twice in 6 months), lasting at least 6 months, with at least one person who is not a sibling. Frequency: most days for children under 5; at least once a week for children 5 and over. Severity by number of settings (mild: one; moderate: two; severe: three or more).
- **Conduct disorder**: at least three of fifteen criteria in the past 12 months, at least one in the past 6 months. Subtypes: childhood-onset (at least one symptom before 10), adolescent-onset (none before 10), unspecified onset. Specifier "with limited prosocial emotions": two or more of lack of remorse or guilt, callous lack of empathy, unconcerned about performance, shallow or deficient affect, persistently over 12 months in more than one relationship or setting. Diagnosis of antisocial personality disorder requires conduct disorder with onset before 15.
- **Prevalence**: ODD about 3%; conduct disorder about 2% to 10% (median about 4%), boys outnumbering girls in most samples.

### Treatment evidence
- **Parent management training** (Incredible Years, Triple P, Parent-Child Interaction Therapy, Parent Management Training Oregon): effect sizes around 0.5 for disruptive behaviour; delivered in groups, it is cost-effective; adapted and tested in several low- and middle-income settings.
- **Adolescents with conduct disorder**: multisystemic therapy and functional family therapy (involving family, school, peers and community), and treatment foster care for those who cannot live at home. Group treatment that puts antisocial teens together can worsen outcomes (deviancy training).
- **Treat ADHD**: stimulants reduce aggression and oppositional behaviour in children with both.
- **Medicines for severe aggression** only alongside psychosocial work: risperidone (start 0.25 to 0.5 mg, usual 0.5 to 1.5 mg; best evidence), with metabolic monitoring and a plan to taper. Avoid long-term use without review.
- **Callous-unemotional traits**: respond better to reward-based approaches than punishment; warmth in parenting predicts reduction.
- **Legal**: in India, the Juvenile Justice (Care and Protection of Children) Act 2015 governs children in conflict with the law; children aged 16 to 18 accused of heinous offences may be assessed by the Juvenile Justice Board for trial as adults, after a preliminary assessment of mental and physical capacity, which mental health professionals may be asked to support.
:::

:::recall
1. What three clusters of symptoms make up ODD? || Angry or irritable mood, argumentative or defiant behaviour, vindictiveness.
2. Name the four groups of conduct disorder behaviours. || Aggression to people and animals, destruction of property, deceitfulness or theft, serious violations of rules.
3. Which conduct disorder subtype has the worst outlook? || Childhood-onset (and with limited prosocial emotions).
4. Why was DMDD added to DSM-5? || To stop chronically irritable children being misdiagnosed with bipolar disorder; they are more likely to develop depression and anxiety later.
5. What is the coercive cycle? || Defiance rewarded by parental giving in or escalated by harsh responses, so that both child and parent escalate.
:::

:::mcq
Q: An 8-year-old has temper outbursts several times a week and is irritable almost every day in between, at home and at school, for over a year. He has never had periods of elevated mood or reduced need for sleep. The best diagnosis is:
- Bipolar I disorder
- *Disruptive mood dysregulation disorder
- Conduct disorder
- Normal tantrums
> Chronic irritability with frequent outbursts, and no episodes of mania, fits DMDD.

Q: Which is the best-evidenced first treatment for a 5-year-old with oppositional defiant disorder?
- Risperidone
- Individual play therapy alone
- *Parent management training
- Boarding school
> Parent training targets the family pattern that maintains defiance.
:::

## 2.7 Attachment, trauma and child protection [core][beginner]
Babies are born ready to form a close bond with the people who care for them. This bond, **attachment**, is the child's safe base. When care is consistent and warm, children use their carers to calm down when frightened and to explore when safe. When care is **severely** lacking (extreme neglect, constant changes of carer, institutional care with few adults for many babies), two rare but serious attachment disorders can develop.

### Two disorders after severe neglect
**Reactive attachment disorder (RAD)**: the child is **withdrawn and inhibited** with carers. She rarely seeks comfort when upset and hardly responds to it when offered. She shows little positive emotion and may be irritable, sad or fearful even in calm interactions.

**Disinhibited social engagement disorder (DSED)**: the child is **indiscriminately friendly**. He goes up to strangers, is overly familiar (hugs, sits on laps, asks personal questions), does not check back with his carer in unfamiliar places, and would willingly go off with a stranger.

:::analogy A child who stopped calling, and a child who calls everyone
In RAD, the child has learned that calling for help brings no one, so she stops calling. In DSED, the child has learned that no particular adult is special, so he calls anyone.
:::

:::widget sort
{"prompt": "RAD, DSED, or a normal pattern? Place each child.", "buckets": ["Reactive attachment disorder", "Disinhibited social engagement disorder", "Normal for age"], "items": [{"text": "A 3-year-old, after two years in an understaffed orphanage, does not turn to her new mother when hurt, and rarely smiles", "bucket": 0}, {"text": "A 4-year-old, adopted after years of neglect, hugs every visitor and would leave the park holding a stranger's hand", "bucket": 1}, {"text": "A 10-month-old cries when held by a stranger and reaches for his mother", "bucket": 2, "why": "Stranger wariness at this age is healthy attachment."}, {"text": "A 5-year-old, after severe neglect, asks unfamiliar adults personal questions and never checks where her foster carer is", "bucket": 1}, {"text": "A 2-year-old from a loving home is shy with new people and hides behind her father", "bucket": 2}, {"text": "A toddler removed from a neglectful home shows little emotion and does not seek comfort from foster carers", "bucket": 0}]}
:::

:::trap Attachment disorders are rare, and need severe neglect
These diagnoses are often misused for any adopted child with behaviour problems. They require **evidence of extremely insufficient care**. RAD in particular must be told apart from autism: autistic children have restricted and repetitive behaviours and do form attachments (often with unusual behaviour), while RAD usually improves dramatically once good care begins.
:::

### Child abuse: what to notice
Abuse and neglect harm children's mental health for life. Look for:
- **Physical abuse**: injuries that do not match the story, bruises on soft areas (ears, cheeks, buttocks), bite marks, burns in patterns, fractures in babies who cannot walk.
- **Sexual abuse**: sexual behaviour or knowledge far beyond the child's age, genital pain or infection, sudden fear of a person or place, new bedwetting, self-harm in teenagers.
- **Emotional abuse**: constant criticism, threats, humiliation, being made to witness violence.
- **Neglect**: poor growth, dirty and hungry children, untreated illness, missed school.
- **Any child** who suddenly changes: becomes withdrawn, aggressive, frightened, or starts failing at school.

:::define The POCSO Act 2012
The **Protection of Children from Sexual Offences Act** protects every person **under 18**. Anyone who knows or has reason to believe that a sexual offence against a child has happened, or may happen, **must report it** to the Special Juvenile Police Unit or the local police (Section 19). Not reporting is itself an offence (Section 21). The child's identity must be protected, and interviews, examinations and court processes must be child-friendly.
:::

:::widget flow
{"title": "When a child discloses abuse", "layout": "chain", "nodes": [{"id": "a", "label": "Listen", "detail": "Stay calm. Let the child speak in their own words. No leading questions."}, {"id": "b", "label": "Believe and reassure", "detail": "'You did the right thing telling me. It is not your fault.'"}, {"id": "c", "label": "Do not promise secrecy", "detail": "Explain kindly that you must tell people who can keep them safe."}, {"id": "d", "label": "Record", "detail": "Write the child's exact words, date and time."}, {"id": "e", "label": "Report", "detail": "Tell your supervisor at once; make sure the report reaches the police or Special Juvenile Police Unit (POCSO Section 19)."}, {"id": "f", "label": "Protect", "detail": "Plan immediate safety and medical care; involve the Child Welfare Committee."}], "caption": "Press Play. Investigation is for trained officials; your job is to listen, record, report and protect."}
:::

### What you do if a child tells you
1. **Listen calmly.** Let the child speak in their own words. Do not push for details or ask leading questions.
2. **Believe and reassure**: "You did the right thing telling me. It is not your fault."
3. **Do not promise secrecy.** Explain that you must tell people whose job is to keep them safe.
4. **Write down** exactly what the child said, in their words, with the date and time.
5. **Tell your supervisor at once**, and make sure the legal report is made. Do not investigate yourself or confront the person accused.
6. **Make the child safe**, and arrange medical care. Childline (**1098**, now linked with the national emergency number 112) can help.

:::widget decide
{"scene": "During a school counselling session in Mysuru, Lakshmi, 12, says quietly that her uncle 'does bad things' when her parents are at work, and begs you not to tell anyone because her mother 'will be angry and the family will break'.", "ask": "What do you do?", "choices": [{"label": "Promise to keep it secret and arrange to see her weekly to build trust", "verdict": "harm", "outcome": "The abuse continues. When it is discovered months later, you are also liable for not reporting.", "why": "Reporting is mandatory under POCSO, and a child's safety comes before a promise of secrecy."}, {"label": "Ask her to describe exactly what happened, in detail, and phone the uncle to confront him", "verdict": "harm", "outcome": "Lakshmi becomes distressed and goes silent. The uncle threatens her, and the family closes ranks.", "why": "Detailed questioning by an untrained person can harm the child and the case. Confronting the accused puts the child at risk."}, {"label": "Thank her for telling you, say it is not her fault, explain gently that you must tell people who can keep her safe, record her words, inform your supervisor and make sure a report is made to the police or Special Juvenile Police Unit, and plan her immediate safety", "verdict": "best", "outcome": "The report is made the same day. The Child Welfare Committee arranges for Lakshmi's safety and counselling. She later says that being believed was what helped most.", "why": "Listen, believe, do not promise secrecy, record, report, and protect. That is the legal and ethical duty."}]}
:::

:::clinician
### Criteria and evidence
- **RAD** (DSM-5-TR): consistent pattern of inhibited, emotionally withdrawn behaviour toward adult caregivers (rarely seeks or responds to comfort); persistent social and emotional disturbance (two of: minimal social and emotional responsiveness, limited positive affect, episodes of unexplained irritability, sadness or fearfulness); extremes of insufficient care (social neglect, repeated changes of primary caregivers, rearing in unusual settings with high child-to-caregiver ratios); not autism; evident before age 5; developmental age at least 9 months. Persistent if present over 12 months.
- **DSED**: two or more of reduced reticence with unfamiliar adults, overly familiar behaviour, diminished checking back, willingness to go off with an unfamiliar adult; not limited to impulsivity (as in ADHD); same history of insufficient care; developmental age at least 9 months.
- **Evidence**: the **Bucharest Early Intervention Project** (randomised children from Romanian institutions to foster care or continued institutional care) showed that signs of RAD fell sharply with foster care, while DSED signs were more persistent; earlier placement (before about 2 years) gave better cognitive and emotional outcomes. The English and Romanian Adoptees study showed lasting effects of more than about 6 months of severe deprivation.
- **Treatment**: a stable, sensitive caregiver is the treatment. Caregiver-focused interventions (Attachment and Biobehavioral Catch-up, video-feedback, child-parent psychotherapy). "Holding therapy" and "rebirthing" are harmful and have caused deaths.
- **Trauma in children**: PTSD criteria for children 6 years and younger differ (fewer avoidance symptoms needed, play re-enactment). Trauma-focused CBT is first line. See the Trauma module for detail.
- **POCSO practice points**: Section 19 reporting applies to doctors and counsellors; Section 21 penalty for failing to report; Section 23 forbids media disclosure of the child's identity; the Child Welfare Committee under the JJ Act handles care and protection. The Supreme Court (2022) held that registered medical practitioners need not disclose a minor's name in the mandatory report when providing a medical termination of pregnancy on request. Consensual sexual activity between adolescents still falls under POCSO, which creates ethical tension; follow the law, document carefully and seek supervision.
:::

:::recall
1. What history is required before RAD or DSED can be diagnosed? || Extremely insufficient care: severe neglect, repeated changes of carer, or institutional rearing.
2. How does RAD differ from DSED? || RAD is withdrawn and does not seek comfort; DSED is indiscriminately friendly with strangers.
3. Which attachment disorder improves more readily with good foster care? || RAD; DSED signs tend to persist longer.
4. What does POCSO Section 19 require? || Mandatory reporting of a known or suspected sexual offence against a child to the police or Special Juvenile Police Unit.
5. List the six steps if a child discloses abuse. || Listen calmly, believe and reassure, do not promise secrecy, record their words, tell your supervisor and report, make the child safe.
:::

:::mcq
Q: A 4-year-old girl adopted from an institution at 3 hugs strangers, sits on visitors' laps and wanders off with unfamiliar adults in the market without looking back. The most likely diagnosis is:
- Reactive attachment disorder
- *Disinhibited social engagement disorder
- Autism spectrum disorder
- ADHD
> Indiscriminate sociability after severe early deprivation.

Q: A 9-year-old tells a counselling student that a neighbour touched him inappropriately. The student should first:
- Ask the boy for every detail to be sure it is true
- Promise not to tell his parents
- *Listen, reassure him, record his words, and inform the supervisor so that a report is made
- Wait for physical evidence
> Listen, believe, do not promise secrecy, record and report.
:::

## 2.8 Elimination disorders [core][beginner]
Most children are dry by day around three, and dry at night somewhat later. Bedwetting and soiling are common, cause great shame, and are usually very treatable.

### Enuresis: wetting
**Enuresis** is repeated passing of urine into the bed or clothes, by a child old enough to be dry. It can be:
- **Nocturnal** (at night, the commonest), **diurnal** (in the daytime), or both.
- **Primary**: the child has never been reliably dry. Usually developmental, often runs in families.
- **Secondary**: wetting returns after a dry period of months. Look for a trigger: stress (a new sibling, school, family conflict, abuse), urine infection, constipation, diabetes.

:::widget guess
{"prompt": "From what age can enuresis be diagnosed?", "min": 1, "max": 10, "unit": "years", "answer": [5, 5], "reveal": "Five years (or an equivalent developmental level). Before that, wetting is common and normal. Even at five, roughly 1 in 6 to 1 in 10 children still wet the bed sometimes, and most outgrow it.", "clinician": "DSM-5-TR enuresis: repeated voiding of urine into bed or clothes, whether involuntary or intentional; at least twice a week for at least 3 consecutive months, or causing significant distress or impairment; chronological age at least 5 years (or equivalent developmental level); not due to a substance (for example a diuretic or antipsychotic) or medical condition. Prevalence about 5% to 10% at 5 years, 3% to 5% at 10 years, about 1% at 15 years and older. Spontaneous resolution about 15% per year."}
:::

### Encopresis: soiling
**Encopresis** is repeated passing of stool in inappropriate places (clothes, floor) by a child old enough to be toilet-trained. In most children it is caused by **constipation with overflow**: hard stool builds up, the bowel stretches, the child loses the feeling of needing to go, and softer stool leaks around the blockage. Parents often think the child is doing it on purpose. Usually they are not.

:::widget guess
{"prompt": "From what age can encopresis be diagnosed?", "min": 1, "max": 10, "unit": "years", "answer": [4, 4], "reveal": "Four years (or an equivalent developmental level), one year earlier than enuresis, because bowel control usually comes before night bladder control.", "clinician": "DSM-5-TR encopresis: repeated passage of faeces into inappropriate places, at least once a month for at least 3 months, chronological age at least 4 years; subtypes with constipation and overflow incontinence (most cases) or without. Prevalence about 1% of 5-year-olds, more in boys."}
:::

:::widget flow
{"title": "A child who wets the bed: first decisions", "layout": "tree", "nodes": [{"id": "r", "label": "Bedwetting at age five or older", "detail": "Take a history and test the urine."}, {"id": "p", "label": "Never been dry (primary)", "detail": "Usually developmental and familial. Reassure, remove blame, simple measures, then an alarm.", "parent": "r"}, {"id": "s", "label": "Wetting again after a dry spell (secondary)", "detail": "Look for stress, abuse, urine infection, constipation, diabetes, new medicines.", "parent": "r"}, {"id": "d", "label": "Daytime symptoms too", "detail": "Urgency, frequency, holding: think bladder dysfunction or constipation; examine the spine.", "parent": "r"}, {"id": "q", "label": "Needs quick dryness", "detail": "Camp or sleepover: desmopressin with fluid restriction, short term.", "parent": "r"}], "caption": "Tap each branch."}
:::

### How they are treated
**Enuresis**
- **Reassure and remove blame**: it is nobody's fault, and punishment makes it worse.
- **Practical steps**: regular daytime drinking, less drinking in the hour or two before bed, toilet before sleep, treat constipation, reward charts for agreed behaviours (such as using the toilet before bed), not for being dry.
- **The enuresis alarm**: a sensor in the underwear rings at the first drops, waking the child. Over weeks, the brain learns to wake or hold. About two in three children become dry, and relapse is less common than with medicine.
- **Desmopressin**: a medicine that reduces night urine. Works quickly, useful for camps and sleepovers, but wetting often returns when it is stopped.

**Encopresis**
- **Clear the blockage** (with medicine), keep stools soft for months, regular toilet sitting after meals, a diet with fibre and fluids, praise and rewards, and support for the family's frustration.

:::widget decide
{"scene": "Kavin, 8, in Coimbatore, wets the bed four nights a week. He has never been dry for long. His father, who also wet the bed until ten, says, 'He's lazy. I beat him and he still does it.' Kavin is ashamed and refuses to go on a school trip. A urine test is normal and he is not constipated.", "ask": "What is the best plan?", "choices": [{"label": "Explain that bedwetting is developmental and often runs in families, stop all punishment, and start an enuresis alarm with simple steps (toilet before bed, less drink late in the evening), with desmopressin just for the school trip", "verdict": "best", "outcome": "The father is relieved to hear it is not laziness. With the alarm, Kavin is dry most nights after a couple of months. Desmopressin gets him through the trip.", "why": "Primary nocturnal enuresis with a family history is developmental. Removing blame, the alarm for lasting cure, and desmopressin for short-term needs is the standard approach."}, {"label": "Start imipramine nightly", "verdict": "harm", "outcome": "Kavin has a dry mouth and constipation. Months later, his younger sister swallows several tablets and needs intensive care.", "why": "Tricyclics are third-line for enuresis because they are dangerous in overdose, even for siblings."}, {"label": "Tell the father to wake Kavin every hour at night", "verdict": "ok", "outcome": "Everyone is exhausted, and Kavin still wets.", "why": "Random waking does not teach the bladder-brain link the way an alarm does, and disrupts sleep."}]}
:::

:::clinician
### Work-up and medicines
- **History**: primary or secondary; day symptoms (urgency, frequency, holding manoeuvres suggest bladder dysfunction); constipation; snoring (sleep apnoea increases night urine); polyuria and thirst (diabetes); stress and abuse; family history (if one parent wet, risk about 40%; both, about 70%).
- **Examination and tests**: abdomen (faecal loading), spine (sacral dimple, hair tuft suggesting spina bifida occulta), genitalia, urinalysis for glucose, protein and infection. More tests only for daytime symptoms, secondary onset with red flags, or abnormal findings.
- **Desmopressin**: oral tablet 0.2 mg at bedtime, increase to 0.4 mg if needed; sublingual melt 120 micrograms, up to 240 micrograms (Indian brands: Minirin, D-Void). Restrict fluids from 1 hour before to 8 hours after the dose to prevent **water intoxication and hyponatraemia** (headache, vomiting, seizures); stop if vomiting or diarrhoea. Review at about 3 months with a medicine-free trial week. The nasal spray is no longer recommended for enuresis.
- **Alarm**: continue until 14 consecutive dry nights; success about 65% to 75%; overlearning (extra fluid at bedtime after dryness) reduces relapse.
- **Imipramine** (Depsonil): 25 mg at bedtime (up to 50 mg in children over about 9 years, 75 mg in adolescents), only when others have failed; ECG if cardiac history; lock it away.
- **Oxybutynin** or another anticholinergic for daytime overactive bladder, combined with desmopressin in resistant cases.
- **Encopresis**: disimpaction with polyethylene glycol (PEG 3350) at higher doses for a few days, then maintenance (about 0.4 to 0.8 g/kg/day) for many months, lactulose as an alternative; scheduled toileting after meals for 5 to 10 minutes; behavioural programme. Red flags for Hirschsprung disease: delayed passage of meconium beyond 48 hours, failure to thrive, explosive stools.
:::

:::recall
1. What is the difference between primary and secondary enuresis? || Primary: never reliably dry; secondary: wetting returns after a dry period, so look for a trigger.
2. What is the commonest cause of encopresis? || Constipation with overflow.
3. Which treatment for bedwetting gives the most lasting cure? || The enuresis alarm.
4. When is desmopressin especially useful, and what is its main danger? || For quick, short-term dryness (camps, sleepovers); water intoxication and low sodium if fluids are not restricted.
5. Why are tricyclics a poor first choice for enuresis? || Dangerous in overdose, including accidental poisoning of siblings.
:::

:::mcq
Q: A 7-year-old girl who had been dry for a year starts wetting again after her parents separate. This is best described as:
- Primary nocturnal enuresis
- *Secondary enuresis, so look for a trigger such as stress, infection or constipation
- Normal for her age
- Encopresis
> Wetting after a dry period is secondary enuresis.

Q: A mother says her 6-year-old 'soils on purpose' and leaks soft stool several times a day, though he passes large hard stools once a week. The most likely explanation is:
- Deliberate defiance
- *Constipation with overflow incontinence
- Inflammatory bowel disease
- Normal development
> Overflow around hard stool is the commonest cause of soiling.
:::

## 2.9 Level check · Beginner [core][beginner]
Twelve or more right out of fifteen opens the Advanced level.

:::mcq
Q: Severity of intellectual disability in DSM-5-TR is judged mainly by:
- The IQ score alone
- The cause
- *Adaptive functioning: how much support is needed in daily life
- Head size
> Adaptive functioning across conceptual, social and practical areas.

Q: A 3-year-old is behind in language, motor and social development. IQ cannot be tested reliably. The diagnosis is:
- Mild intellectual disability
- *Global developmental delay
- Autism
- Specific learning disorder
> Global developmental delay is used under five.

Q: A young man with moderate intellectual disability suddenly starts self-injuring. The first step is:
- Start an antipsychotic
- *Search for pain, illness, environmental change or abuse
- Increase supervision only
- Accept it as part of his disability
> Challenging behaviour is communication; avoid diagnostic overshadowing.

Q: Autism requires:
- Intellectual disability
- *All three social communication deficits and at least two restricted or repetitive patterns
- Loss of skills
- No speech
> The DSM-5-TR rule is three of three plus two of four.

Q: Which is true of early intervention in autism?
- Picture-based communication stops speech developing
- *Parent-mediated programmes that build shared attention have good evidence
- Stem-cell treatment is approved in India
- Medicines treat the core features
> Parent coaching, speech therapy and structured teaching help; no medicine treats core features.

Q: ADHD symptoms must have begun:
- Before 5 years
- *In childhood, with several present before 12 years
- At any age
- Only in adolescence
> Childhood onset is required.

Q: A 15-year-old with new poor concentration, sleeplessness and loss of interest most likely has:
- ADHD
- *Depression, until shown otherwise
- Autism
- A learning disorder
> New-onset inattention in the teens needs a mood assessment.

Q: Which feature is part of Tourette's disorder?
- Tics present for only a few months
- *Several motor tics and at least one vocal tic
- Tics that never change
- Tics that cannot be held back at all
> Tics are partly suppressible and wax and wane.

Q: Which treatment is first-line psychological therapy for impairing tics?
- Psychoanalysis
- *Habit reversal within CBIT
- Hypnosis
- Play therapy
> Awareness training plus a competing response.

Q: Depression in a 10-year-old most often shows as:
- Elevated mood
- *Irritability, body complaints and falling school performance
- Hallucinations
- Increased energy
> Irritability can replace sad mood in children.

Q: School refusal differs from truancy because the child:
- Hides the absence
- *Is anxious and wants to be at home with the parent
- Spends time with antisocial peers
- Has conduct disorder
> School refusal is anxiety-driven, and parents know.

Q: The best-evidenced first-line treatment for a 6-year-old with ODD is:
- Medicine
- *Parent management training
- Boarding school
- Physical punishment
> Parent training breaks the coercive cycle.

Q: Childhood-onset conduct disorder, compared with adolescent-onset, has:
- A better outcome
- *A worse outcome and higher risk of antisocial personality disorder
- No difference
- Only theft, no aggression
> Early onset predicts persistence.

Q: A child who is withdrawn, rarely seeks comfort, and grew up in severe neglect most likely has:
- DSED
- *Reactive attachment disorder
- Normal shyness
- Social anxiety disorder
> Inhibited, emotionally withdrawn attachment after insufficient care.

Q: The enuresis alarm, compared with desmopressin:
- Works faster
- *Gives more lasting dryness with fewer relapses
- Is more dangerous
- Is only for daytime wetting
> Desmopressin works fast but relapse is common on stopping.
:::
`;
