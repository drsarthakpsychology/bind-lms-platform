import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "ocd",
  num: 8,
  title: "Obsessive-compulsive and related disorders",
  emoji: "🔁",
  tagline: "Obsessions, rituals, body dysmorphia, hoarding, hair pulling and skin picking",
  when: "Weeks 5 to 6",
  outcomes: [
    "Define obsessions and compulsions and state the OCD criteria with the insight specifier",
    "Describe the common symptom themes and how to ask about them",
    "Explain the brain circuit and the learning model of OCD",
    "Distinguish OCD from OCPD, delusions, GAD worry, depressive rumination and tics",
    "Plan treatment with exposure and response prevention and SSRIs, and recognise the related disorders",
  ],
  writeTask:
    "On paper, from memory: definitions of obsession and compulsion, the OCD criteria and insight levels, the four main symptom themes, the OCD vs OCPD table, the cycle of obsession, anxiety, ritual and relief, and the treatment ladder. Then check and correct in red.",
  activities: [
    act.lesson("anx-2", "Quiz: OCD and PTSD", "Criteria and treatment."),
    act.scenarios("ocd", "Patient case: “Just once more”", "When reassurance feeds the ritual."),
    act.coach("therapy", "Coach: therapies", "ERP and CBT terms."),
  ],
  noteId: "ocd",
};

export const text = String.raw`
# Part I · OCD

## 1.1 Obsessions and compulsions [core]
:::define Obsessions
Recurrent and persistent **thoughts, urges or images** experienced as **intrusive and unwanted**, causing marked anxiety or distress. The person tries to ignore, suppress or neutralise them with another thought or action.
:::
:::define Compulsions
**Repetitive behaviours** (washing, checking, ordering) or **mental acts** (praying, counting, repeating words) that the person feels driven to perform in response to an obsession or according to rigid rules, aimed at reducing distress or preventing a dreaded event, but **not realistically connected** to it or clearly excessive.
:::

### The OCD cycle
Obsession (“my hands are contaminated”) → anxiety → compulsion (washing) → **short relief** → the relief rewards the ritual → the obsession returns stronger.

:::analogy Scratching a mosquito bite
A compulsion is like scratching a bite: it relieves the itch for a moment and makes it itch more later. Treatment is learning to leave the itch alone until it fades.
:::

## 1.2 OCD: criteria and presentation [core]
:::define Criteria
Obsessions, compulsions, or both, that are **time-consuming** (for example **more than 1 hour a day**) or cause clinically significant distress or impairment; not due to a substance or medical condition; not better explained by another disorder.
:::
**Insight specifier**: good or fair insight (recognises beliefs are definitely or probably not true); poor insight (thinks they are probably true); **absent insight / delusional beliefs** (completely convinced). **Tic-related** specifier if there is a current or past tic disorder.

### Common themes
| Theme | Obsession | Compulsion |
|---|---|---|
| Contamination | Germs, dirt, bodily fluids, impurity (“ashuddh”) | Washing, bathing, cleaning, avoiding touching |
| Doubt and harm | “Did I lock the door, turn off the gas?” | Checking, asking for reassurance |
| Symmetry and order | Things must be “just right” | Arranging, counting, repeating |
| Unacceptable thoughts | Aggressive, sexual or blasphemous thoughts; fear of harming a child | Mental rituals, praying, confessing, avoiding knives |

- Lifetime prevalence about 2 to 3%; onset often in childhood or adolescence (earlier in boys); course waxes and wanes.
- Many hide symptoms for years because of shame. **Ask directly**.
- Severity rated with the **Y-BOCS** (Yale–Brown Obsessive Compulsive Scale, 0 to 40).

:::sounds How it sounds
- “Pata hai bewakoofi hai, par phir bhi haath dhone padte hain.” (I know it's silly but I still have to wash.) Good insight.
- “Taala check karne baar-baar wapas jaata hoon.” (I keep going back to check the lock.)
- “Bhagwan ke baare mein gande vichaar aate hain, bahut paap lagta hai.” (Dirty thoughts about God come; I feel sinful.) Religious obsessions (scrupulosity).
- Family: “Ek ghanta nahaati hai, poora ghar saaf karwati hai.” (She bathes for an hour and makes us clean the whole house.) Family accommodation.
:::

:::trap Thoughts of harm in OCD are not intent
A mother with OCD who has intrusive images of harming her baby is horrified by them and avoids knives. This is ego-dystonic obsession, not risk of harm. Distinguish carefully from psychotic or depressive thoughts of harm, and don't respond with alarm, which reinforces the fear.
:::

:::recall
1. Define obsession and compulsion. || Intrusive, unwanted thoughts, urges or images causing distress; repetitive acts or mental acts performed to reduce distress, unrealistic or excessive.
2. What is the time guide in OCD criteria? || More than 1 hour a day, or distress or impairment.
3. Give the three insight levels. || Good or fair; poor; absent or delusional.
4. Name four symptom themes. || Contamination, doubt and checking, symmetry, unacceptable thoughts.
5. What scale rates OCD severity, and its range? || Y-BOCS, 0 to 40.
:::

## 1.3 Causes and differential diagnosis [core]
### Causes
- **Brain circuit**: the cortico-striato-thalamo-cortical loop (**orbitofrontal cortex, caudate, thalamus**) is overactive: an “error signal” that won't switch off.
- **Serotonin**: SSRIs and clomipramine work; dopamine involved especially with tics.
- **Genetics**: higher risk in relatives; links with tic disorders.
- **Paediatric acute onset** after streptococcal infection (PANDAS/PANS) in some children.
- **Learning**: obsessions produce anxiety; rituals reduce it and are reinforced (negative reinforcement).
- **Cognitive**: inflated responsibility, overestimation of threat, need for certainty, thought–action fusion (“thinking it makes it more likely”).

### Differential
| Condition | How it differs |
|---|---|
| Obsessive-compulsive personality disorder | Perfectionism and control are **ego-syntonic** (felt as right); no true obsessions; lifelong style |
| Delusion | Held with full conviction and not resisted (but OCD with absent insight exists) |
| GAD | Worries are about real-life problems, not intrusive and senseless |
| Depressive rumination | Brooding about loss and failure, mood-congruent, not resisted |
| Tics | Sudden, not driven by an obsession; preceded by an urge |
| Autism | Repetitive behaviours enjoyed, not anxiety-driven |
| Psychosis | Other psychotic features present |

| | OCD | OCPD |
|---|---|---|
| Experience | Ego-dystonic: unwanted, distressing | Ego-syntonic: feels correct |
| Core | Obsessions and compulsions | Perfectionism, orderliness, control, rigidity |
| Insight | Usually knows it's excessive | Thinks others are careless |
| Treatment seeking | Seeks help for symptoms | Usually brought by others' complaints |

:::recall
1. Name the brain circuit implicated in OCD. || Orbitofrontal cortex, caudate, thalamus (CSTC loop).
2. What maintains rituals in learning terms? || Negative reinforcement: relief from anxiety.
3. Give three cognitive features of OCD. || Inflated responsibility, threat overestimation, need for certainty, thought–action fusion.
4. Distinguish OCD from OCPD in one line. || OCD is ego-dystonic obsessions and rituals; OCPD is ego-syntonic perfectionism.
:::

## 1.4 Treatment [core]
:::define Exposure and response prevention (ERP)
The first-line psychological treatment. The person is **exposed** to the obsessional trigger (touching a “dirty” surface) and **prevented from performing the ritual** (no washing), staying with the anxiety until it falls. Repeated across a graded hierarchy.
:::
- Add cognitive work on responsibility and threat beliefs.
- Reduce **family accommodation**: relatives should stop joining in rituals or giving endless reassurance (agreed together, kindly).

### Medicines
- **SSRIs** (fluoxetine, sertraline, fluvoxamine, escitalopram) at **higher doses** than for depression, with **longer trials (8 to 12 weeks)** before judging response.
- **Clomipramine** (a serotonergic tricyclic) is effective but has more side effects.
- **Augmentation** for partial response: low-dose antipsychotic (risperidone, aripiprazole), especially with tics.
- Severe refractory OCD: deep brain stimulation or neurosurgery in specialist centres.
- Continue at least 1 to 2 years after response; relapse is common on stopping.

:::trap Reassurance is a ritual
Answering “Are you sure my hands are clean?” again and again works like another wash. Clinicians and families should gently refuse to give repeated reassurance once the plan is agreed.
:::

:::recall
1. Describe ERP. || Exposure to the trigger while preventing the ritual until anxiety falls, up a hierarchy.
2. How does SSRI use differ in OCD versus depression? || Higher doses and longer trials (8 to 12 weeks).
3. What do you add for partial response, especially with tics? || A low-dose antipsychotic.
4. Why should families stop giving reassurance? || It acts as a ritual and keeps OCD going.
:::

## 1.5 ERP in practice: a worked case [core]
:::example Priya, 22, contamination OCD
Priya washes her hands 40 times a day and bathes for 90 minutes after coming home. She will not sit on the sofa in "outside clothes" and asks her mother many times a day, "Are my hands clean?" Y-BOCS is 28 (severe).
:::

### Step 1: understand the OCD map together
- **Triggers**: door handles, money, public toilets, her brother's college bag.
- **Feared outcome**: "I'll get a disease and pass it to my family."
- **Rituals**: washing, bathing, changing clothes, asking for reassurance, avoiding touch.
- **Family accommodation**: mother washes the bag, answers reassurance questions, keeps a "clean chair".

### Step 2: build the hierarchy (SUDS 0 to 100)
| Step | Exposure | SUDS |
|---|---|---|
| 1 | Touch the outer door handle, no washing for 30 minutes | 35 |
| 2 | Handle coins and notes, then touch own face | 45 |
| 3 | Sit on the sofa in outside clothes | 55 |
| 4 | Touch brother's college bag, then eat a biscuit | 65 |
| 5 | Touch a public toilet door handle, then own clothes and hair | 80 |
| 6 | Hug family members after touching the toilet handle | 90 |

### Step 3: do the exposures, block the rituals
- In session first, then **daily homework**. Stay with the anxiety until it falls or the feared prediction is tested; **no washing, no reassurance**.
- Agreed **response prevention rules**: one 10-minute shower a day, handwashing only before food and after the toilet, no questions about cleanliness.
- Track SUDS before, at peak, and after; review in each session.

### Step 4: the family plan
- Mother learns a kind, agreed reply: "I know it's the OCD asking. I'm not going to answer, because answering feeds it. I love you."
- Remove the "clean chair"; stop washing the bag.

### Step 5: relapse prevention
- Expect lapses; "**lapse is not relapse**". Practise exposures in daily life ("lifestyle exposure"), spot early signs, return to ERP quickly.

:::trap Mental rituals undo exposure
Silently praying, counting or saying "it's fine, it's fine" during exposure is still a ritual. Ask about them directly and include them in response prevention.
:::

:::recall
1. List four things to map before ERP. || Triggers, feared outcome, rituals including mental ones, family accommodation.
2. Where should a hierarchy start? || Around 30 to 40 SUDS.
3. What does the family say instead of reassuring? || A kind, agreed reply naming the OCD and declining to answer.
4. What does "lapse is not relapse" mean? || A slip is expected and can be recovered from quickly.
:::

## 1.6 OCD in special groups [core]
### Perinatal OCD
- Onset or worsening in pregnancy and after childbirth is common. Typical obsessions: **intrusive thoughts of harming the baby** (dropping, drowning, stabbing), contamination of the baby.
- Mothers **avoid** bathing the baby or being alone with it, out of horror at the thoughts. Risk of harm is **not** increased; the thoughts are ego-dystonic.
- Treatment: ERP and, if needed, sertraline (often preferred in breastfeeding).
- Distinguish from **postpartum psychosis**, where thoughts of harm may be ego-syntonic and linked to delusions: an emergency.

### Children and adolescents
- Onset often 8 to 12 years; boys earlier. Children may not see rituals as excessive and often **involve parents** heavily.
- First-line: **CBT with ERP**, with parents; add sertraline or fluoxetine for moderate to severe cases.
- Sudden dramatic onset after a streptococcal or other infection: consider **PANS/PANDAS** and paediatric assessment.

### Religious obsessions (scrupulosity)
- Obsessions about sin, impurity, blasphemy or doing rituals wrongly; compulsions such as repeated prayer, confession, bathing for purity, redoing rituals.
- Common in India (**ashuddh**, purity and pollution themes). The question is not whether the person is religious, but whether the practice is **driven by anxiety, unwanted and excessive** compared with others of the same faith.
- Involving a respected religious teacher can help ("God does not require you to repeat this 50 times").

### Tic-related OCD
- Earlier onset, more males, symmetry and "**just right**" feelings, touching and tapping rituals, more family history. Antipsychotic augmentation helps more often.

:::recall
1. How do you tell perinatal OCD from postpartum psychosis? || OCD: ego-dystonic thoughts with avoidance and no psychosis. Psychosis: delusions, confusion, ego-syntonic thoughts; an emergency.
2. What is the first-line treatment for OCD in children? || CBT with ERP, involving parents.
3. Define scrupulosity. || Religious or moral obsessions with rituals such as repeated prayer or confession.
4. Give three features of tic-related OCD. || Early onset, male, just-right symmetry rituals, family history; antipsychotic augmentation helps.
:::

## 1.7 When OCD does not get better [core]
### First, check the basics
- Was the **SSRI dose high enough for long enough** (12 weeks at good dose)? Was it taken?
- Was ERP done properly, with real response prevention and homework, or was it just talk?
- Comorbidity: depression, tics, autism, substance use, OCPD, hoarding.
- Ongoing **family accommodation**.

### Then step up
| Step | Option |
|---|---|
| 1 | Optimise SSRI dose and duration; add or intensify ERP |
| 2 | Switch to another SSRI |
| 3 | **Clomipramine** (alone or carefully with an SSRI, watching levels and ECG) |
| 4 | **Augment** with low-dose risperidone or aripiprazole |
| 5 | Intensive or residential ERP |
| 6 | Specialist neuromodulation: **deep TMS** (approved for OCD), **deep brain stimulation**, or ablative neurosurgery for the most severe, chronic cases |

- **Treatment-resistant OCD** is usually defined as failure of at least two adequate SSRI trials and adequate CBT with ERP.

:::recall
1. Name four reasons OCD may seem resistant. || Low dose or short trial, poor adherence, ERP not done properly, comorbidity, family accommodation.
2. Which antipsychotics are used to augment? || Low-dose risperidone or aripiprazole.
3. Define treatment-resistant OCD. || No response after two adequate SSRI trials and adequate ERP.
:::

# Part II · Related disorders

## 2.1 Body dysmorphic disorder [core]
- Preoccupation with one or more **perceived defects or flaws** in appearance that are **not observable or appear slight** to others.
- Repetitive behaviours (mirror checking, grooming, skin picking, seeking reassurance) or mental acts (comparing with others).
- Specifiers: **muscle dysmorphia** (belief one's body is too small); insight (good, poor, absent or delusional).
- High rates of depression and **suicide**. Cosmetic procedures rarely help and often worsen distress.
- Treatment: CBT with ERP and SSRIs (often higher doses).

## 2.2 Hoarding disorder [core]
- Persistent difficulty **discarding** possessions regardless of value, because of a perceived need to save them and distress at discarding.
- Results in clutter that congests living areas and compromises their use.
- Specifier: with excessive acquisition. Insight often poor.
- Risks: fire, falls, hygiene, family conflict. Treatment: specialised CBT, home visits, harm reduction.

## 2.3 Trichotillomania and excoriation [core]
| | Trichotillomania (hair-pulling) | Excoriation (skin-picking) |
|---|---|---|
| Behaviour | Recurrent pulling out of hair, causing hair loss | Recurrent skin picking, causing lesions |
| Required | Repeated attempts to stop; distress or impairment | Repeated attempts to stop; distress or impairment |
| Treatment | **Habit reversal training** (awareness, competing response), SSRIs, N-acetylcysteine | Habit reversal training, SSRIs |

- Both are **body-focused repetitive behaviours**; often with tension before and relief during.
- Other related: olfactory reference syndrome (belief one smells), and substance- or medically-induced OCD-related disorders.

:::recall
1. State the core feature of BDD and two risks. || Preoccupation with slight or unseen defects; depression, suicide, unhelpful cosmetic surgery.
2. What is muscle dysmorphia? || The belief one's body is too small or not muscular enough.
3. Define hoarding disorder. || Persistent difficulty discarding, with clutter compromising living spaces.
4. What is the main treatment for trichotillomania? || Habit reversal training.
:::

## 2.4 Telling the spectrum apart [core]
| Disorder | Core preoccupation | Repetitive behaviour | Key clue |
|---|---|---|---|
| **OCD** | Intrusive thoughts (contamination, harm, symmetry) | Washing, checking, ordering, mental rituals | Ego-dystonic, anxiety-driven |
| **Body dysmorphic disorder** | A perceived defect in appearance, unnoticeable or slight to others | Mirror checking, grooming, comparing, camouflage, skin picking | Shame about looks; may seek surgery |
| **Hoarding disorder** | Need to save items; distress at discarding | Acquiring, saving | Cluttered living spaces |
| **Trichotillomania** | Urge or tension, sometimes none | Hair pulling | Hair loss; often in automatic or focused episodes |
| **Excoriation** | Urge or tension | Skin picking | Skin lesions |
| **Illness anxiety disorder** (classified elsewhere) | Fear of having a serious illness | Checking body, seeking reassurance or avoiding doctors | Few or no symptoms |

### BDD in more depth
- Onset in adolescence; often hidden for years. Common areas: skin (acne, scars), hair, nose, teeth, body shape.
- **Muscle dysmorphia**: mostly men who believe they are too small or not muscular enough; excessive gym, diet, and **anabolic steroid use**.
- **High suicide risk**: ask every person with BDD about suicidal thoughts.
- Insight is often poor or absent (delusional conviction does not change the diagnosis; it is BDD with absent insight).
- **Cosmetic procedures rarely help** and often lead to dissatisfaction, more procedures, or anger at the surgeon.
- Treatment: CBT with ERP (stop mirror checking and camouflage, exposure to being seen) and **SSRIs at high doses**.

### Habit reversal training (for hair pulling and skin picking)
1. **Awareness training**: notice when, where and how pulling happens; early warning signs.
2. **Competing response**: a physically incompatible action for about one minute (clenching fists, holding a stress ball).
3. **Social support**: a family member gently prompts and praises.
- Plus **stimulus control**: gloves, short nails, covering mirrors, keeping hands busy.

:::recall
1. What is muscle dysmorphia? || A BDD form, mostly in men, believing they are not muscular enough.
2. Why should cosmetic surgery usually be avoided in BDD? || It rarely helps and leads to more dissatisfaction.
3. Name the three parts of habit reversal training. || Awareness training, competing response, social support.
4. What is unusual about suicide risk in BDD? || It is high; always ask.
:::

# Part III · Exam zone

## 3.1 Long answer and short notes [core]
:::example Q. Discuss the clinical features and management of OCD. (10 marks)
1. Definitions of obsession and compulsion; criteria; insight and tic specifiers.
2. Epidemiology and course.
3. Symptom themes table with examples; how to ask; Indian presentations (purity, religious themes).
4. Aetiology: CSTC circuit, serotonin, genetics, PANDAS, learning and cognitive models.
5. Differential: OCPD (table), delusion, GAD, rumination, tics, autism.
6. Assessment: Y-BOCS; risk; comorbid depression.
7. Management: ERP, cognitive therapy, family accommodation; SSRIs at higher doses and longer trials, clomipramine, augmentation, neuromodulation.
8. Prognosis: chronic, waxing and waning; better with early treatment and good insight.
:::

:::word Short note: obsession
An obsession is a recurrent, persistent, intrusive and unwanted thought, urge or image that causes marked anxiety; the person recognises it as a product of their own mind (unlike thought insertion) and tries to ignore, suppress or neutralise it. Content is typically repugnant to the person: contamination, doubt, symmetry, or aggressive, sexual and religious themes. Because it must be resisted, there can be obsessional ideas, images, fears and impulses but no obsessional hallucination or mood.
:::

## 3.2 Viva rapid-fire [core]
:::viva
Define a compulsion. :: A repetitive act or mental act driven by an obsession or rigid rules to reduce distress, unrealistic or excessive.
Time guide in OCD? :: More than 1 hour a day, or distress or impairment.
Three insight levels? :: Good or fair, poor, absent or delusional.
Severity scale? :: Y-BOCS, 0 to 40.
Brain circuit in OCD? :: Orbitofrontal cortex, caudate and thalamus.
First-line therapy? :: Exposure and response prevention.
SSRI dosing in OCD? :: Higher doses, 8 to 12 week trials.
Which tricyclic treats OCD? :: Clomipramine.
Augmentation with tics? :: Low-dose antipsychotic.
OCD vs OCPD in one word? :: Ego-dystonic vs ego-syntonic.
Why is reassurance harmful? :: It works like a ritual.
What is thought–action fusion? :: Believing thinking something makes it more likely or is as bad as doing it.
Core feature of BDD? :: Preoccupation with slight or unseen appearance flaws.
Define hoarding disorder. :: Persistent difficulty discarding with congested living spaces.
Treatment of trichotillomania? :: Habit reversal training.
Y-BOCS range? :: 0 to 40.
First step in ERP? :: Build a hierarchy with SUDS ratings.
Does silent counting during exposure count as a ritual? :: Yes, a mental ritual.
Perinatal OCD typical obsession? :: Intrusive thoughts of harming the baby.
Religious obsessions are called? :: Scrupulosity.
SSRI trial length in OCD? :: About 12 weeks at a good dose.
Tricyclic used in OCD? :: Clomipramine.
Neuromodulation approved for OCD? :: Deep TMS.
Muscle dysmorphia linked substance? :: Anabolic steroids.
Habit reversal key step? :: Competing response.
:::

## 3.3 Module test [core]
:::mcq
Q: A man knows his fear of contamination is excessive but washes for 3 hours daily. This shows:
- *OCD with good or fair insight
- OCD with absent insight
- OCPD
- Delusional disorder
> He recognises the beliefs as excessive.

Q: Which feature best separates OCD from OCPD?
- Age of onset
- *OCD symptoms are ego-dystonic; OCPD traits are ego-syntonic
- OCPD has compulsions
- OCD is always milder
> Unwanted versus felt to be right.

Q: First-line psychological treatment for OCD is:
- Psychoanalysis
- *Exposure and response prevention
- Hypnosis
- Relaxation alone
> Exposure to triggers while blocking rituals.

Q: Compared with depression, SSRIs in OCD are usually given:
- At lower doses for shorter trials
- *At higher doses for longer trials
- Only once a week
- Only with benzodiazepines
> 8 to 12 week trials at higher doses.

Q: A mother has horrifying intrusive images of stabbing her baby and hides the knives. This most likely represents:
- Psychotic intent to harm
- *Ego-dystonic obsessions in OCD
- Antisocial traits
- Postpartum mania
> She is distressed and avoids the feared act.

Q: A woman spends hours checking a barely visible nose bump and has had two surgeries without relief. Diagnosis:
- OCD
- *Body dysmorphic disorder
- Delusional disorder, somatic type only
- Anorexia nervosa
> Preoccupation with a slight perceived flaw with repetitive checking.

Q: The brain circuit most implicated in OCD involves:
- Cerebellum and pons
- *Orbitofrontal cortex, caudate and thalamus
- Occipital lobe
- Hippocampus only
> The CSTC loop.

Q: The main treatment for trichotillomania is:
- Flooding
- *Habit reversal training
- Antipsychotics alone
- ECT
> Awareness training and a competing response.

Q: Rituals in OCD are maintained mainly by:
- Positive reinforcement
- *Negative reinforcement (relief from anxiety)
- Punishment
- Extinction
> Relief rewards the ritual.

Q: For partial response with comorbid tics, the usual augmentation is:
- Lithium
- *A low-dose antipsychotic
- A benzodiazepine
- Stimulants
> Risperidone or aripiprazole.

Q: During ERP, a patient touches the floor without washing but silently repeats "I'm safe" over and over. The therapist should:
- Praise the success
- *Treat the repeated phrase as a mental ritual and block it too
- Stop exposure as it is too difficult
- Add a benzodiazepine
> Mental rituals undo exposure.

Q: A new mother has horrifying thoughts of drowning her baby and avoids bathing it. She is not psychotic. The best description is:
- High risk of infanticide
- *Perinatal OCD with ego-dystonic harm obsessions
- Postpartum psychosis
- Baby blues
> Ego-dystonic thoughts with avoidance; risk not increased.

Q: A man spends 4 hours a day in the gym, uses steroids, and believes he looks puny despite being muscular. The diagnosis is:
- OCPD
- *Body dysmorphic disorder (muscle dysmorphia)
- Anorexia nervosa
- Delusional disorder, somatic type only
> A BDD form.

Q: Which is NOT part of habit reversal training?
- Awareness training
- Competing response
- Social support
- *Flooding
> Flooding is an exposure method.
:::
`;
