import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "more-disorders",
  num: 20,
  title: "Eating, sleep, body and dissociative disorders",
  emoji: "🩻",
  tagline: "Anorexia, bulimia, sleep disorders, somatic and functional symptoms, dissociation, and sexual health",
  when: "Weeks 15 to 16",
  outcomes: [
    "State the criteria and medical risks of anorexia, bulimia and binge-eating disorder",
    "Recognise the main sleep disorders and parasomnias",
    "Work with somatic symptoms, functional neurological disorder and illness anxiety without dismissing patients",
    "Describe the dissociative disorders and Indian culture-related syndromes",
    "Talk about sexual problems and gender identity respectfully",
  ],
  writeTask:
    "On paper, from memory: the three criteria for anorexia and the severity bands, five medical complications, refeeding syndrome, the bulimia and binge-eating rules, NREM parasomnias vs nightmares, the narcolepsy tetrad, positive signs of functional weakness and seizures, and factitious disorder vs malingering. Then check and correct in red.",
  activities: [
    act.coach("disorders", "Coach: disorders", "These diagnoses side by side."),
    act.terms("Say it clinically", "Dhat, ghabrahat, kamzori into clinical language."),
    act.lesson("cs-2", "Case files: ward round", "Applying it to patients."),
  ],
  noteId: "eating",
};

export const text = String.raw`
# Part I · Feeding and eating disorders

## 1.1 Anorexia nervosa [core]
:::define Criteria
(A) **Restriction of energy intake** leading to **significantly low body weight** for age, sex and health; (B) **intense fear of gaining weight** or persistent behaviour that interferes with weight gain; (C) **disturbed experience of body weight or shape**, undue influence of weight on self-worth, or not recognising the seriousness of low weight.
:::
- Types: **restricting** or **binge-eating/purging**.
- Severity in adults by BMI: **mild** 17 or above; **moderate** 16 to under 17; **severe** 15 to under 16; **extreme** below 15.
- Usually begins in adolescence; more common in girls but occurs in boys and in India too.
- **Highest death rate of any mental disorder** (starvation, arrhythmia, suicide).

| System | Complications |
|---|---|
| Heart | **Slow pulse**, low BP, arrhythmias, QT prolongation |
| Blood and electrolytes | Low potassium (with purging), low sodium, anaemia, low white count |
| Bones and hormones | Osteoporosis, absent periods, delayed puberty, low thyroid hormone (adaptive) |
| Skin | Dry skin, **lanugo** (fine downy hair), cold hands |
| Gut | Constipation, delayed emptying |
| Brain | Poor concentration, rigid thinking, low mood |

:::safety Refeeding syndrome
When feeding restarts after starvation, insulin drives phosphate, potassium and magnesium into cells, and **phosphate can fall dangerously** (heart failure, confusion, death). Start nutrition carefully, monitor electrolytes daily at first, and supplement phosphate and thiamine.
:::

- Treatment: weight restoration and medical safety; **family-based treatment** (Maudsley approach) for adolescents; **CBT-E** and other specialist therapies for adults; admission for very low BMI, fast weight loss, unstable vital signs, electrolyte problems or high suicide risk. Medicines have little role in weight restoration.

:::mcq
Q: A 17-year-old girl with a BMI of 15.5 eats very little, fears gaining weight and believes she is fat. Her severity is:
- Mild
- Moderate
- *Severe (15 to under 16)
- Not anorexia because she still menstruates
> Adult BMI bands; menstruation is no longer required for the diagnosis.
:::

## 1.2 Bulimia and binge-eating disorder [core]
| | Bulimia nervosa | Binge-eating disorder |
|---|---|---|
| Binges | Eating a large amount in a short time with **loss of control** | Same |
| Compensation | **Yes**: vomiting, laxatives, diuretics, fasting, excessive exercise | **No** regular compensation |
| Frequency | At least **once a week for 3 months** | At least **once a week for 3 months** |
| Weight | Usually normal | Often overweight |
| Signs | **Russell's sign** (calluses on knuckles), swollen parotid glands, dental erosion, **low potassium** | Distress, eating alone, guilt |
| Treatment | CBT-E; **fluoxetine** (higher dose) | CBT; lisdexamfetamine in some countries |

- Self-worth unduly based on shape and weight in bulimia.
- Other eating disorders: **ARFID** (avoidant/restrictive food intake: sensory aversion, fear of choking or vomiting, low interest; not about body image), **pica** (non-food items, at least a month: check iron deficiency), **rumination disorder** (regurgitating and re-chewing).

:::recall
1. State the three anorexia criteria. || Restriction with low weight; fear of weight gain; disturbed body image or not recognising seriousness.
2. Give the adult BMI severity bands. || Mild 17 or more, moderate 16 to 17, severe 15 to 16, extreme under 15.
3. What is refeeding syndrome, and which mineral falls? || Electrolyte shifts on restarting nutrition; phosphate.
4. How does bulimia differ from binge-eating disorder? || Bulimia has compensatory behaviours.
5. What is Russell's sign? || Calluses on the knuckles from induced vomiting.
:::

:::mcq
Q: A woman of normal weight binges weekly and then makes herself vomit. Her potassium is low. Most likely:
- Binge-eating disorder
- *Bulimia nervosa
- Anorexia nervosa, restricting type
- ARFID
> Binges with compensation at normal weight; vomiting lowers potassium.
:::

## 1.3 Eating disorders: causes, assessment and treatment [core]
### Why they develop
- **Biology**: genetic risk (anorexia is substantially heritable), perfectionistic and anxious temperament, changes in appetite and reward systems.
- **Psychology**: low self-esteem, perfectionism, need for control, self-worth judged by weight and shape.
- **Social**: thin ideals in media and social media, weight-focused sports and professions (dance, modelling, athletics), teasing about weight, family emphasis on appearance, comments about "becoming fat" before marriage.
- **Triggers**: dieting, puberty, exams, bullying, loss.

### The assessment
| Area | What to check |
|---|---|
| Eating | A typical day's food, restriction, bingeing, rules about food |
| Compensation | Vomiting, laxatives, diuretics, diet pills, fasting, excessive exercise |
| Body image | Checking, avoidance, fear of weight gain |
| Weight history | Highest and lowest weight, rate of loss |
| Physical | BMI (or percentile in children), pulse, BP lying and standing, temperature, muscle strength (sit-up and squat test) |
| Bloods and ECG | Electrolytes (potassium, phosphate, magnesium), glucose, blood count, liver and kidney function, **ECG** (slow pulse, QT) |
| Mental health | Depression, OCD, self-harm, suicide, substance use |

:::safety When to admit to hospital
Very low BMI (for example below about 13 to 14), rapid weight loss, **pulse below about 40**, low BP or fainting, **low potassium or phosphate**, QT prolongation, temperature below 35.5, inability to stand from squatting, **suicide risk**, or failure of outpatient care. Medical stabilisation comes first.
:::

### Treatment in more detail
- **Refeeding**: start carefully (about 1200 to 1600 kcal a day in many protocols, then increase), **check phosphate, potassium and magnesium daily** for the first week, give **thiamine** and supplements.
- **Family-based treatment (Maudsley)** for adolescents: three phases: parents take charge of eating, gradual return of control to the young person, then normal adolescent development.
- **CBT-E** (enhanced CBT): regular eating, addressing over-evaluation of shape and weight, body checking, and the dieting-bingeing cycle. First-line for bulimia and binge-eating disorder, and used for adult anorexia.
- **MANTRA** and **SSCM** (specialist supportive clinical management) for adult anorexia.
- **Medicines**: no medicine treats anorexia itself (olanzapine at low dose may help agitation and weight gain); **fluoxetine** for bulimia.

:::sounds How it sounds in the room
- "Main moti hoon, sab yahi kehte hain." (I'm fat, everyone says so.) Body image disturbance.
- "Khaana khaaya toh guilt hota hai, phir ulti kar deti hoon." (If I eat I feel guilty, then I vomit.)
- Mother: "Bas ek roti khaati hai, aur ghanton exercise." (She eats just one roti and exercises for hours.)
:::

:::recall
1. Name four physical findings that call for admission in anorexia. || Very low BMI, pulse below 40, low potassium or phosphate, fainting or low BP, low temperature, QT prolongation.
2. What is monitored daily in early refeeding? || Phosphate, potassium and magnesium.
3. Describe family-based treatment. || Parents take charge of eating, then gradually return control, then normal development.
4. What is first-line for bulimia? || CBT-E (plus fluoxetine).
:::

:::mcq
Q: Three days into refeeding a severely underweight patient, which blood test is most important to watch?
- Cholesterol
- *Phosphate (with potassium and magnesium)
- Amylase
- Vitamin D
> Refeeding syndrome: phosphate falls dangerously.
:::

# Part II · Sleep–wake disorders

## 2.1 The main sleep disorders [core]
| Disorder | Key features | Treatment |
|---|---|---|
| **Insomnia** | Trouble starting or keeping sleep, at least 3 nights a week for 3 months, with daytime effects | **CBT-I** first; short-term medicines |
| **Obstructive sleep apnoea** | Loud snoring, witnessed pauses, gasping, **daytime sleepiness**, morning headaches; obesity, thick neck; raises BP and accident risk | Weight loss, **CPAP**; avoid sedatives |
| **Narcolepsy** | Sleep attacks; **cataplexy** (sudden loss of muscle tone with emotion, like laughter); sleep paralysis; hypnagogic hallucinations; low hypocretin | Scheduled naps, modafinil, sodium oxybate, antidepressants for cataplexy |
| Hypersomnolence | Excessive sleepiness despite long sleep | Exclude other causes |
| Circadian rhythm disorders | Delayed sleep phase (teenagers), shift work, jet lag | Light timing, melatonin, schedules |
| **Restless legs syndrome** | Urge to move legs at rest in the evening, relieved by moving | **Check iron (ferritin)**; dopamine agonists, gabapentinoids |

:::mcq
Q: A heavy man on olanzapine snores loudly, stops breathing at night and falls asleep in class. The best next test is:
- EEG
- *Overnight sleep study (polysomnography)
- MRI brain
- Thyroid only
> Obstructive sleep apnoea, worsened by weight gain and sedatives.
:::

## 2.2 Parasomnias [core]
| | NREM arousal disorders (sleepwalking, night terrors) | Nightmare disorder | REM sleep behaviour disorder |
|---|---|---|---|
| Sleep stage | Deep NREM sleep | REM sleep | REM sleep |
| Time of night | **First third** | Last half | Later in the night |
| Memory of event | **Little or none** | **Vivid recall** | Recalls dream |
| Who | Children mostly | Any age; PTSD | **Older men**; may precede Parkinson's or Lewy body dementia |
| What happens | Walking, screaming, confused, hard to wake | Wakes frightened, alert quickly | **Acts out dreams** (punching, kicking) because normal REM paralysis is lost |

:::recall
1. Give three features of obstructive sleep apnoea and its treatment. || Snoring, witnessed pauses, daytime sleepiness; CPAP and weight loss.
2. What is cataplexy? || Sudden loss of muscle tone triggered by emotion, in narcolepsy.
3. What blood test matters in restless legs? || Ferritin (iron).
4. Contrast night terrors and nightmares. || Deep NREM, first third, no recall vs REM, later, vivid recall.
5. Why does REM sleep behaviour disorder matter? || It can precede Parkinson's and Lewy body dementia.
:::

:::mcq
Q: A 6-year-old screams and seems terrified an hour after falling asleep, can't be comforted and remembers nothing next day. Most likely:
- Nightmare disorder
- *Night terrors (NREM arousal disorder)
- REM sleep behaviour disorder
- Epilepsy only
> First third of the night, deep sleep, no recall.
:::

## 2.3 More on sleep: assessment and the less common disorders [core]
### Taking a sleep history
- **Sleep diary** for two weeks: bedtime, time to fall asleep, wakings, wake time, naps, caffeine, alcohol.
- Ask a **bed partner**: snoring, pauses, kicking, acting out dreams.
- Daytime: sleepiness (**Epworth Sleepiness Scale**, score above 10 suggests excessive sleepiness), driving safety.
- Medicines, shift work, screens, mood and anxiety.

### Tests
| Test | Use |
|---|---|
| **Polysomnography** | Overnight recording of EEG, breathing, oxygen, leg movements: sleep apnoea, parasomnias, REM sleep behaviour disorder |
| **Multiple Sleep Latency Test** | Naps through the day: **short sleep latency and REM in two or more naps** suggests narcolepsy |
| Actigraphy | Wrist movement over weeks: circadian rhythm disorders |
| CSF hypocretin (orexin) | **Low in narcolepsy type 1** |

### Narcolepsy in more detail
- Caused by loss of **hypocretin (orexin)** neurons in the hypothalamus (type 1, with cataplexy).
- The tetrad: **excessive daytime sleepiness**, **cataplexy**, **sleep paralysis**, **hypnagogic hallucinations** (on falling asleep). Plus disturbed night sleep.
- Often misdiagnosed as depression, epilepsy or psychosis (because of hallucinations).
- Treatment: scheduled naps, **modafinil**, stimulants, sodium oxybate; antidepressants (which suppress REM) for cataplexy.

### Obstructive sleep apnoea in psychiatry
- Common in people on weight-gaining medicines, with obesity, alcohol use; causes **tiredness, poor concentration and low mood** that look like depression.
- **Benzodiazepines and alcohol worsen** it. Screen with **STOP-BANG** (Snoring, Tired, Observed pauses, Pressure high, BMI, Age over 50, Neck size, Gender male).

:::recall
1. What Epworth score suggests excessive sleepiness? || Above 10.
2. What does the Multiple Sleep Latency Test show in narcolepsy? || Short sleep latency with REM in two or more naps.
3. Name the narcolepsy tetrad. || Daytime sleepiness, cataplexy, sleep paralysis, hypnagogic hallucinations.
4. Why does sleep apnoea matter in psychiatry? || It mimics depression and is worsened by sedatives and weight gain.
:::

:::mcq
Q: A young man falls asleep suddenly in the day and his knees buckle when he laughs. Most likely:
- Epilepsy
- *Narcolepsy with cataplexy
- Depression
- Conversion disorder
> Cataplexy is emotion-triggered loss of muscle tone.
:::

# Part III · Somatic symptom and related disorders

## 3.1 The disorders [core]
| Disorder | Core |
|---|---|
| **Somatic symptom disorder** | One or more **distressing bodily symptoms** plus **excessive thoughts, feelings or behaviours** about them (persistent worry, high anxiety, excessive time and energy), usually for more than 6 months. Symptoms may or may not have a medical explanation |
| **Illness anxiety disorder** | Preoccupation with **having or getting a serious illness**, with **few or no symptoms**, high health anxiety, checking or avoidance; at least 6 months |
| **Functional neurological symptom disorder** (conversion) | Weakness, paralysis, abnormal movements, non-epileptic seizures, numbness, blindness or speech loss, with **clinical findings incompatible with recognised neurological disease** |
| **Factitious disorder** | **Deliberately feigning or inducing illness** without obvious external reward, to take on the sick role; imposed on self, or **on another** (often a child, by a carer) |
| Psychological factors affecting other medical conditions | For example, anxiety worsening asthma |

:::trap Factitious disorder versus malingering
Both involve deliberately produced symptoms. In **factitious disorder** the motive is internal (to be a patient); in **malingering** the motive is an **external reward** (money, avoiding duty or prosecution, drugs). Malingering is **not a mental disorder**; it's recorded as a condition for clinical attention.
:::

### Functional neurological disorder: positive signs
Diagnosis is made by **positive features**, not just by normal tests:
- **Hoover's sign**: weak hip extension that becomes normal when the other leg flexes against resistance.
- Give-way weakness; tremor that changes rhythm or stops with distraction (entrainment).
- Non-epileptic seizures: often **eyes closed**, side-to-side head movements, pelvic thrusting, long duration, waxing and waning, recall of the event, crying afterwards. Video EEG confirms.

### How to help
- **Believe the symptoms are real.** Never say “it's all in your head” or “nothing is wrong”.
- Explain the condition positively (“Your nervous system's software isn't working properly, though the hardware is intact”).
- One coordinating doctor; avoid repeated tests once serious disease is excluded; agree goals around function.
- CBT, physiotherapy (for functional weakness), treat depression and anxiety.

:::sounds Body talk in Indian clinics
- “Poore shareer mein jalan hoti hai.” (Burning all over the body.)
- “Sar mein bhaari pan, gas upar chadh jaati hai.” (Heaviness in the head, gas rising up.)
- “Kamzori, dhaat jaati hai.” (Weakness; semen is being lost.) Dhat syndrome: see 4.2.
:::

:::recall
1. Distinguish somatic symptom disorder from illness anxiety disorder. || Distressing symptoms with excessive response vs fear of illness with few symptoms.
2. Give two positive signs of functional weakness and two features of non-epileptic seizures. || Hoover's sign, give-way weakness; eyes closed, side-to-side movements, long duration, recall.
3. Distinguish factitious disorder from malingering. || Internal motive (sick role) vs external reward; malingering isn't a mental disorder.
4. What should you never say to a patient with functional symptoms? || That it's all in their head or nothing is wrong.
:::

:::mcq
Q: A woman suddenly cannot move her legs after a family quarrel. Hoover's sign is positive and scans are normal. The best explanation to her is:
- "It's all in your head."
- *"Your nervous system's software isn't working properly, though the hardware is fine; this is common and treatable."
- "You are faking."
- "We found nothing, so go home."
> Functional neurological disorder: positive signs, a real condition, clear explanation.
:::

## 3.2 Illness anxiety, factitious disorder and malingering in depth [core]
### Illness anxiety (health anxiety)
- Preoccupation with having a serious illness with **few or no symptoms**; anxiety is high; the person either **checks and seeks care** (care-seeking type) or **avoids** doctors (care-avoidant type).
- Reassurance helps briefly, then doubt returns: reassurance works like a compulsion.
- **CBT** (reducing checking, internet searching and reassurance seeking; behavioural experiments) and SSRIs help.

### Factitious disorder and malingering
| | Factitious disorder | Malingering |
|---|---|---|
| Symptoms produced | Deliberately | Deliberately |
| Motive | Internal: to take the **sick role** | External: money, avoiding work, duty, prison, getting drugs |
| Is it a mental disorder? | Yes | **No** (a behaviour, not a diagnosis) |
| Typical clues | Medical knowledge (often health workers), many hospitals, dramatic stories, eagerness for tests and surgery, symptoms worse when observed less | Clear gain, vague symptoms, poor cooperation, symptoms disappear when the gain is achieved |
| Extreme form | **Munchausen syndrome** (wandering between hospitals with dramatic false histories) | |

:::safety Factitious disorder imposed on another
A caregiver (usually a parent) **induces or fakes illness in a child** to gain attention. It is **child abuse**. Clues: symptoms only when the parent is present, unusual test results, a parent who welcomes invasive tests. Involve paediatrics and child protection; under POCSO and child protection procedures, report.
:::

### Telling functional symptoms from feigning
- **Functional (conversion) symptoms are not deliberate**. The person is not choosing them. Most functional patients are not faking.
- Use **positive signs** (Hoover's, entrainment) to diagnose functional disorder, not "tests are normal so it must be fake".

:::recall
1. Name the two types of illness anxiety disorder. || Care-seeking and care-avoidant.
2. What is the key difference between factitious disorder and malingering? || Internal motive (sick role) versus external gain.
3. What is Munchausen syndrome? || An extreme factitious disorder with wandering between hospitals and dramatic histories.
4. What is factitious disorder imposed on another and how is it managed? || A carer induces illness in a dependant; child protection and reporting.
:::

:::mcq
Q: A man complains of back pain only when a compensation case is pending, and his symptoms vanish when the case is settled. Most likely:
- Factitious disorder
- *Malingering
- Somatic symptom disorder
- Conversion disorder
> Deliberate symptoms for an external gain.
:::

# Part IV · Dissociation and culture

## 4.1 Dissociative disorders [core]
:::define Dissociation
A disruption of the normal integration of consciousness, memory, identity, emotion, perception and behaviour. Often linked to trauma.
:::
| Disorder | Core |
|---|---|
| **Dissociative identity disorder** | Two or more distinct **personality states** with discontinuity in sense of self, plus recurrent **gaps in memory**. Not part of accepted cultural or religious practice |
| **Dissociative amnesia** | Inability to recall important personal information, usually traumatic, beyond ordinary forgetting; may include **dissociative fugue** (purposeful travel or wandering with amnesia) |
| **Depersonalisation/derealisation disorder** | Persistent or recurrent feelings of unreality of self or surroundings, with **reality testing intact** |

- Rule out epilepsy, head injury, substances, and malingering.
- Treatment is phased: **safety and stabilisation** (grounding, emotion regulation), **trauma processing**, then **integration** and rebuilding life.

:::mcq
Q: A woman is found in another city with no memory of who she is, after her husband's death. Medical tests are normal. Most likely:
- Delirium
- *Dissociative amnesia with dissociative fugue
- Korsakoff syndrome
- Schizophrenia
> Loss of identity with travel, after a stressor; new learning intact.
:::

## 4.2 Culture-related presentations in India [core]
| Presentation | What it is | How to approach |
|---|---|---|
| **Dhat syndrome** | Anxiety and weakness attributed to **loss of semen** (in urine, night emissions, masturbation) | Explore beliefs respectfully; sex education; treat associated depression or anxiety |
| **Possession and trance states** | Behaviour attributed to a spirit or deity, often with altered consciousness and amnesia | Normal within religious ritual; a disorder only if involuntary, distressing and outside accepted practice; exclude psychosis and epilepsy |
| Koro | Fear that the genitals are retracting and death will follow (epidemics reported in some regions) | Reassurance, education |
| “Tension”, “gas”, “ghabrahat”, “kamzori” | Idioms of distress | Clarify meaning; screen for depression and anxiety |

- Ask the **explanatory model**: “What do you think caused this? What have you tried? What do you hope we can do?” Many families visit faith healers too; respect beliefs while offering treatment.

:::recall
1. Name the three dissociative disorders. || DID, dissociative amnesia (with or without fugue), depersonalisation/derealisation disorder.
2. What is Dhat syndrome? || Anxiety and weakness attributed to semen loss.
3. When is a possession state a disorder? || When involuntary, distressing and outside accepted cultural practice.
:::

:::mcq
Q: A young man complains of weakness and fatigue that he blames on losing semen in urine. Tests are normal and he is anxious and low. The best approach is:
- Tell him the belief is foolish
- *Explore his explanation, educate gently about normal physiology, and treat the anxiety and depression
- Prescribe tonics
- Refer to a surgeon
> Dhat syndrome: respect the cultural model, treat the distress.
:::

## 4.3 Dissociation in practice [core]
### Dissociative (conversion) presentations in Indian clinics
- **Dissociative seizures**, fainting spells, trance-like states and "fits" in young women after family conflict, exam pressure or relationship stress are common in Indian emergency rooms.
- Look for the **stressor**, the **secondary gain** (attention, escape from a conflict) without accusing, and **what the symptom communicates**.
- Avoid rewarding the episodes with excessive attention; give attention to the person between episodes.

### Depersonalisation and derealisation
- Depersonalisation: "I feel like a robot, as if I'm watching myself from outside."
- Derealisation: "Everything looks like a film, flat and unreal."
- **Insight is preserved** (the person knows it is a feeling, unlike psychosis).
- Common transiently in anxiety, panic, sleep loss and cannabis use. As a disorder: persistent. Treat anxiety and depression, grounding, CBT.

### Dissociative identity disorder: approach
- Rare and controversial in some quarters, but real. Strongly linked with severe, repeated childhood trauma.
- Distinguish from **possession trance** that is culturally accepted, from psychosis (voices in DID are often experienced as inside the head and linked to "parts"), and from feigning.
- Phased treatment: safety, stabilisation, then trauma work; avoid encouraging the creation of more "parts".

:::analogy Dissociation as a circuit breaker
When the load is too much, the brain trips a switch to protect itself: feeling numb, unreal, losing time or function. It helped once. Treatment teaches safer ways to carry the load, so the switch trips less often.
:::

:::recall
1. What is preserved in depersonalisation that separates it from psychosis? || Insight.
2. How should staff respond to dissociative seizures? || Calm, not rewarding episodes, attention to the person between episodes, explore stressors.
3. What history is strongly linked with DID? || Severe, repeated childhood trauma.
:::

:::mcq
Q: A patient says everything around her looks unreal, like a film, but she knows it isn't really so. This is:
- A delusion
- *Derealisation (with insight kept)
- A hallucination
- Thought broadcasting
> Insight separates it from psychosis.
:::

# Part V · Sexual health and gender

## 5.1 Sexual dysfunctions [core]
- Erectile disorder; premature (early) or delayed ejaculation; female sexual interest/arousal disorder; female orgasmic disorder; genito-pelvic pain/penetration disorder; male hypoactive sexual desire disorder. Usually present about **6 months** with distress.
- Causes: physical (diabetes, vascular disease, hormones, alcohol, smoking), **medicines** (SSRIs, antipsychotics, beta-blockers), psychological (performance anxiety, relationship conflict, depression), lack of knowledge.
- Treatment: education, couple work, **sensate focus** (graded touching without pressure to perform), the stop–start or squeeze technique for early ejaculation, PDE-5 inhibitors (sildenafil) for erectile disorder; adjust causative medicines.
- **Ask routinely** about sexual side effects of medicines: patients rarely volunteer them.

:::mcq
Q: A 30-year-old man has erectile problems with his partner but normal morning erections. The most likely cause is:
- Diabetes
- Vascular disease
- *Performance anxiety or a relationship problem
- Low testosterone
> Physical causes usually affect morning erections too.
:::

## 5.2 Gender dysphoria [core]
- **Distress** due to marked incongruence between one's experienced or expressed gender and assigned gender, for at least **6 months**.
- **Being transgender is not a mental disorder**; the diagnosis concerns distress and access to care.
- Use the person's chosen name and pronouns; affirming, non-judgemental care; screen for depression, anxiety and suicide risk linked to stigma; the Transgender Persons (Protection of Rights) Act 2019 protects against discrimination.
- **Conversion therapy is unethical and harmful.**

:::recall
1. Name four causes of erectile disorder. || Diabetes, vascular disease, medicines, alcohol and smoking, anxiety, relationship problems.
2. What is sensate focus? || Graded touching exercises without pressure to perform.
3. Is being transgender a mental disorder? || No; gender dysphoria concerns distress.
:::

:::mcq
Q: A transgender woman seeks help for low mood after family rejection. The right approach is:
- Try to change her gender identity
- *Affirming care: use her chosen name and pronouns, treat the depression, support the family
- Refuse treatment
- Diagnose a psychotic disorder
> Being transgender is not a disorder; conversion therapy is unethical and harmful.
:::

## 5.3 Sexual function and paraphilic disorders [core]
### The human sexual response
| Phase (Masters and Johnson, with a desire phase added later) | What happens | Linked dysfunction |
|---|---|---|
| **Desire** | Interest, fantasies | Low desire |
| **Excitement or arousal** | Erection, vaginal lubrication | Erectile disorder, arousal disorder |
| **Plateau** | Arousal builds | |
| **Orgasm** | Ejaculation, orgasm | Premature or delayed ejaculation, orgasmic disorder |
| **Resolution** | Return to baseline; refractory period in men | |

### Assessment and treatment in more detail
- Ask with **comfort and privacy**: "Many people have problems with sexual life, especially with stress or medicines. Has that been a concern for you?"
- Morning erections suggest a **psychological** rather than physical cause of erectile problems.
- **PDE5 inhibitors** (sildenafil, tadalafil) for erectile disorder (not with nitrates).
- **Premature ejaculation**: **stop-start** and **squeeze** techniques, SSRIs (dapoxetine on demand).
- **Vaginismus** (genito-pelvic pain/penetration disorder): education, graded dilators, relaxation, couple therapy; common cause of unconsummated marriages.
- **Dhat** concerns and performance anxiety in young men are common: education about normal sexual physiology helps greatly.

### Paraphilic disorders
- A **paraphilia** is an intense, persistent atypical sexual interest. It is a **disorder** only when it causes distress or impairment, or involves **non-consenting people** or harm.
- Examples: voyeuristic, exhibitionistic, frotteuristic (touching or rubbing against non-consenting people, for example in crowded buses), sexual masochism and sadism, **paedophilic disorder**, fetishistic, transvestic.
- **Paedophilic disorder**: sexual attraction to prepubescent children; any offence involves **mandatory reporting** under POCSO. Treatment: specialist CBT, relapse prevention, sometimes anti-androgen medicines, and close risk management.

:::recall
1. Name the phases of the sexual response cycle. || Desire, excitement, plateau, orgasm, resolution.
2. What do preserved morning erections suggest? || A psychological cause.
3. Name two behavioural techniques for premature ejaculation. || Stop-start and squeeze.
4. When is a paraphilia a disorder? || When it causes distress or impairment, or involves non-consenting people or harm.
:::

:::mcq
Q: A man repeatedly rubs against women in crowded buses and is caught. This is:
- Exhibitionistic disorder
- *Frotteuristic disorder
- Voyeuristic disorder
- Fetishistic disorder
> Touching or rubbing against non-consenting people.
:::

# Part VI · Exam zone

## 6.1 Long answer and short notes [core]
:::example Q. Discuss the clinical features, complications and management of anorexia nervosa. (10 marks)
1. Definition and criteria; types; severity bands.
2. Epidemiology and risk factors (perfectionism, dieting culture, family, genetics).
3. Clinical features: psychological and physical.
4. Complications by system; mortality.
5. Assessment: BMI, vital signs, ECG, electrolytes, risk.
6. Management: medical stabilisation, refeeding safely, family-based treatment, CBT-E; admission criteria.
7. Prognosis.
:::

:::word Short note: functional neurological disorder
Previously called conversion disorder: neurological symptoms such as weakness, paralysis, tremor, non-epileptic seizures, sensory loss or speech loss, with clinical findings incompatible with recognised neurological disease. Diagnosed by positive signs, such as Hoover's sign, give-way weakness, tremor entrainment, and typical non-epileptic seizure features confirmed by video EEG. Often associated with stress, trauma, anxiety and depression, but a stressor is no longer required for diagnosis. Managed by a clear, respectful explanation, physiotherapy, CBT and treating comorbid conditions; avoiding dismissive language and unnecessary tests is central.
:::

## 6.2 Viva rapid-fire [core]
:::viva
Three criteria for anorexia? :: Restriction with low weight, fear of weight gain, body image disturbance.
Extreme anorexia BMI? :: Below 15.
Mineral that falls in refeeding syndrome? :: Phosphate.
Bulimia frequency rule? :: Once a week for 3 months.
Russell's sign? :: Calluses on knuckles from vomiting.
Medicine with evidence in bulimia? :: Fluoxetine.
Cataplexy is seen in? :: Narcolepsy.
Treatment for sleep apnoea? :: CPAP and weight loss.
Test in restless legs? :: Ferritin.
Night terrors: stage and recall? :: Deep NREM, no recall.
Parasomnia that may precede Parkinson's? :: REM sleep behaviour disorder.
Hoover's sign suggests? :: Functional weakness.
Factitious vs malingering? :: Internal motive vs external reward.
Dhat syndrome? :: Anxiety attributed to semen loss.
Treatment phases for dissociation? :: Stabilisation, processing, integration.
Sensate focus is used for? :: Sexual dysfunction.
Hospital admission pulse threshold in anorexia? :: Below about 40.
Minerals checked daily during refeeding? :: Phosphate, potassium, magnesium.
First-line therapy for bulimia? :: CBT-E.
Epworth score suggesting excess sleepiness? :: Above 10.
Neuropeptide lost in narcolepsy type 1? :: Hypocretin (orexin).
Sleep apnoea screening tool? :: STOP-BANG.
Two types of illness anxiety disorder? :: Care-seeking and care-avoidant.
Malingering motive? :: External gain.
Factitious disorder in a child caused by a parent? :: Factitious disorder imposed on another; child abuse.
Is insight preserved in depersonalisation? :: Yes.
Treatment for erectile disorder? :: PDE5 inhibitors with psychological work.
Common cause of unconsummated marriage? :: Vaginismus.
:::

## 6.3 Module test [core]
:::mcq
Q: A 16-year-old with BMI 15.5, fear of weight gain and amenorrhoea. Severity:
- Mild
- Moderate
- *Severe
- Extreme
> 15 to under 16 is severe.

Q: Three days after nutrition restarts in severe anorexia, a patient becomes confused with heart failure. Which level is most likely low?
- Sodium
- *Phosphate
- Calcium only
- Glucose
> Refeeding syndrome.

Q: Normal-weight woman bingeing and vomiting twice a week for 6 months, with low potassium:
- Anorexia, binge-purge type
- *Bulimia nervosa
- Binge-eating disorder
- ARFID
> Compensatory behaviour at normal weight.

Q: Loud snoring, witnessed pauses in breathing and daytime sleepiness suggest:
- Narcolepsy
- *Obstructive sleep apnoea
- Insomnia
- Restless legs
> Treat with CPAP and weight loss.

Q: A 6-year-old screams in the first hours of sleep, is hard to wake, and remembers nothing. Most likely:
- Nightmare disorder
- *Sleep terrors (NREM arousal disorder)
- Epilepsy only
- REM sleep behaviour disorder
> First third of the night, no recall.

Q: A 68-year-old man punches and kicks during dreams. Most likely and why it matters:
- Night terrors; harmless
- *REM sleep behaviour disorder; may precede Parkinson's
- Sleepwalking; childhood onset
- Nightmares; trauma
> Loss of REM atonia.

Q: Weak hip extension that becomes normal when the other leg pushes against resistance:
- Stroke
- *Hoover's sign of functional weakness
- Malingering proven
- Spinal cord injury
> A positive sign of FND.

Q: A nurse secretly injects insulin to cause hypoglycaemia and be admitted, with no financial gain:
- Malingering
- *Factitious disorder
- Somatic symptom disorder
- Illness anxiety disorder
> Internal motive to take the sick role.

Q: A young man fears weakness from losing semen at night and feels tired and anxious:
- Erectile disorder
- *Dhat syndrome
- Illness anxiety disorder only
- Koro
> A culture-related syndrome in South Asia.

Q: Feeling unreal and detached from one's body with intact reality testing:
- Psychosis
- *Depersonalisation
- DID
- Delirium
> Insight preserved.

Q: A 16-year-old with anorexia has a pulse of 38 and potassium of 2.8. The best plan is:
- Outpatient CBT-E
- *Hospital admission for medical stabilisation
- Fluoxetine and review in a month
- Advise her to eat more
> Medical risk comes first.

Q: Short sleep latency with REM in several daytime naps suggests:
- Obstructive sleep apnoea
- *Narcolepsy
- Insomnia disorder
- Depression
> Multiple Sleep Latency Test finding.

Q: A nurse repeatedly presents to different hospitals with unexplained infections and is found injecting herself. No external gain is found. This is:
- Malingering
- *Factitious disorder
- Somatic symptom disorder
- Conversion disorder
> Internal motive: the sick role.

Q: A man who has erectile problems with his wife but normal morning erections most likely has:
- Vascular disease
- Diabetes-related nerve damage
- *A psychological cause such as performance anxiety
- Low testosterone only
> Physical causes usually affect morning erections too.
:::
`;
