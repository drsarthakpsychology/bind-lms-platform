import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "substance",
  num: 15,
  title: "Substance use and addictive disorders",
  emoji: "🍶",
  tagline: "Alcohol, opioids, cannabis, stimulants, tobacco and gambling: from intoxication to recovery",
  when: "Weeks 11 to 12",
  outcomes: [
    "Apply the 11 substance use disorder criteria and grade severity",
    "Recognise intoxication and withdrawal for each major substance",
    "Manage alcohol withdrawal safely, including Wernicke's encephalopathy and delirium tremens",
    "Use opioid substitution, relapse-prevention medicines and motivational interviewing",
    "Take a substance history the non-judgemental way",
  ],
  writeTask:
    "On paper, from memory: the 11 criteria in 4 groups with severity cut-offs, the alcohol withdrawal timeline, the Wernicke triad and its treatment, opioid intoxication vs withdrawal, the three alcohol relapse-prevention medicines with one caution each, and the stages of change. Then check and correct in red.",
  activities: [
    act.lesson("ls-3", "Quiz: alcohol and substances", "Withdrawal, Wernicke and medicines."),
    act.scenarios("substance", "Patient case: “I can stop anytime”", "Motivational interviewing in practice."),
    act.coach("counselling", "Coach: counselling", "Motivational interviewing and stages of change."),
    act.detective("Clinic detective", "Guess the substance or medicine from clues."),
  ],
  noteId: "substance",
};

export const text = String.raw`
# Part I · The framework

## 1.1 Substance use disorder: the 11 criteria [core]
:::define Substance use disorder
A problematic pattern of use leading to clinically significant impairment or distress, shown by **at least 2 of 11** criteria **within 12 months**. Severity: **2 to 3 mild, 4 to 5 moderate, 6 or more severe**.
:::

| Group | Criteria |
|---|---|
| **Impaired control** | 1. Taken in larger amounts or for longer than intended · 2. Persistent desire or failed efforts to cut down · 3. A great deal of time spent getting, using or recovering · 4. **Craving** |
| **Social impairment** | 5. Failure to fulfil major roles at work, school or home · 6. Continued use despite social or interpersonal problems · 7. Important activities given up |
| **Risky use** | 8. Use in physically hazardous situations (driving) · 9. Continued use despite knowing it causes physical or psychological harm |
| **Pharmacological** | 10. **Tolerance** (needs more for the same effect) · 11. **Withdrawal** (or use to relieve it) |

:::trap Prescribed medicines
Tolerance and withdrawal **don't count** towards the diagnosis when they occur with medicines taken as prescribed (opioids for pain, benzodiazepines). Being physically dependent is not the same as having a use disorder.
:::

### The other substance diagnoses
- **Intoxication**: a reversible substance-specific syndrome from recent use.
- **Withdrawal**: a substance-specific syndrome after stopping or reducing heavy, prolonged use.
- **Substance-induced mental disorders**: psychotic, depressive, anxiety, bipolar, sleep, sexual, neurocognitive disorders.

### Why addiction happens
- Drugs of abuse all increase **dopamine in the mesolimbic reward pathway** (nucleus accumbens): learning that “this matters”.
- With repeated use, reward signals shift from the drug to its **cues** (places, people, smells), driving craving.
- Prefrontal control weakens; stress systems become overactive in withdrawal, so use shifts from seeking pleasure to escaping distress.
- Risk factors: genes, early use, trauma, peer and family use, availability, mental illness, poverty.

:::recall
1. State the threshold and severity grades. || At least 2 of 11 in 12 months; 2 to 3 mild, 4 to 5 moderate, 6 or more severe.
2. Name the four groups and their criteria. || Impaired control (amount, cut down, time, craving); social (roles, problems, activities given up); risky (hazardous, despite harm); pharmacological (tolerance, withdrawal).
3. When do tolerance and withdrawal not count? || With medicines taken as prescribed.
4. Which brain pathway do all drugs of abuse act on? || Mesolimbic dopamine reward pathway.
:::

:::mcq
Q: A man drinks more than he means to, has tried to cut down twice and failed, gave up cricket for drinking, and drinks despite a liver warning. He has no withdrawal or tolerance. Severity of alcohol use disorder:
- Mild (2 to 3 criteria)
- *Moderate (4 to 5 criteria)
- Severe (6 or more)
- Not a disorder without withdrawal
> Count criteria: larger amounts, failed attempts, activities given up, use despite harm = 4.
:::

## 1.2 Taking a substance history [core]
- Be **non-judgemental** and matter-of-fact; normalise (“Many people drink to cope with stress; how about you?”).
- For each substance: age at first use, pattern, route, amount, frequency, **last use**, dependence features, withdrawal, complications, treatment, periods of abstinence, **readiness to change**.
- Always ask about **tobacco** (smoked and chewed: bidi, gutkha, khaini) and gambling.
- Quantify alcohol in drinks and type (“Quarter, half or full bottle? Beer or whisky?”).
- Screening tools: **AUDIT** (alcohol, 10 items), CAGE, ASSIST (all substances).

:::sounds How it sounds
- “Bas social drinking hai, roz shaam ko ek-do peg.” (Just social drinking, a couple of pegs every evening.) Quantify it.
- “Jab chahun chhod sakta hoon.” (I can stop whenever I want.) Ask when they last tried, and what happened.
- “Subah haath kaanpte hain, ek peg lo toh theek.” (My hands shake in the morning; a drink fixes it.) Withdrawal and relief drinking.
- “Thoda smack leta hoon, dard ke liye.” Opioid use framed as pain relief.
:::

:::recall
1. List the eight things to ask about each substance. || Age at first use, pattern, route, amount, last use, dependence, withdrawal, complications (also treatment, abstinence, readiness).
2. Which forms of tobacco are often missed in India? || Chewed tobacco: gutkha, khaini, and bidis.
:::

:::mcq
Q: A patient says he drinks "a bottle on Saturdays". The most useful next question is:
- "Why do you drink?"
- *"What size bottle and what drink, and over how many hours?"
- "Do you drink socially?"
- "Are you an alcoholic?"
> Turn it into standard drinks and a pattern.
:::

## 1.3 Screening and brief intervention [core]
### Standard drinks
- A **standard drink** in India is usually taken as about **10 g of pure alcohol**: roughly a small peg (30 mL) of whisky or rum, a small glass (100 mL) of wine, or about 285 to 330 mL of regular beer. A large bottle of strong beer can hold 2 to 3 standard drinks.
- Grams of alcohol = volume in mL multiplied by the alcohol percentage multiplied by 0.79 (for example, 750 mL of 42.8% whisky contains about 250 g of alcohol).

### AUDIT in practice
| AUDIT score (out of 40) | Zone | Action |
|---|---|---|
| 0 to 7 | Low risk | Education |
| 8 to 15 | Hazardous | **Brief advice** |
| 16 to 19 | Harmful | Brief counselling and monitoring |
| 20 to 40 | Possible dependence | **Referral** for assessment and treatment |

- **AUDIT-C** (first three questions) is a quick screen.
- **CAGE**: Cut down? Annoyed by criticism? Guilty? Eye-opener in the morning? Two or more "yes" answers suggest a problem.

### Brief intervention: the FRAMES model
| Letter | Meaning |
|---|---|
| **F**eedback | Personal results ("Your AUDIT score and liver test suggest your drinking is affecting your health") |
| **R**esponsibility | The choice is theirs |
| **A**dvice | Clear advice to cut down or stop |
| **M**enu | Options: cut down, alcohol-free days, stop, get help |
| **E**mpathy | Warm, non-judgemental |
| **S**elf-efficacy | Build confidence they can change |

- A **5 to 15 minute** brief intervention in primary care reduces drinking in hazardous drinkers.

:::recall
1. How much alcohol is a standard drink in India? || About 10 g.
2. What AUDIT score suggests possible dependence? || 20 or more.
3. Expand CAGE. || Cut down, annoyed, guilty, eye-opener.
4. Expand FRAMES. || Feedback, responsibility, advice, menu, empathy, self-efficacy.
:::

:::mcq
Q: A man's AUDIT score is 12 and his liver tests are normal. The best step in primary care is:
- Admit for detox
- *A brief intervention: feedback, advice and a menu of options
- Start naltrexone and disulfiram together
- No action
> Hazardous drinking zone: brief advice works.
:::

## 1.4 Dual diagnosis [core]
:::define Dual diagnosis
A substance use disorder together with another mental disorder. It is the **rule, not the exception**: depression, anxiety, PTSD, ADHD, bipolar disorder, psychosis and personality disorders all raise substance use risk, and substances worsen all of them.
:::

### Which came first?
| Pattern | Clue |
|---|---|
| **Substance-induced** disorder | Symptoms begin during intoxication or withdrawal and **settle within about a month of abstinence** |
| **Independent** disorder | Symptoms began before the substance use, or persist well beyond a month of abstinence, or are out of proportion to the amount used |

- Common examples: alcohol-induced depression (often lifts within 2 to 4 weeks of stopping), stimulant-induced psychosis, cannabis-induced psychosis (which often predicts later schizophrenia).

### Principles
- **Integrated treatment**: the same team treats both problems; do not send patients back and forth ("come back when you're sober").
- Treat the mental disorder even while substance use continues, when it is clearly independent and severe.
- Choose medicines with low misuse potential; avoid benzodiazepines long term.
- Higher risk of suicide, violence, homelessness, HIV and hepatitis.

:::recall
1. How do you tell a substance-induced disorder from an independent one? || Induced: begins with use and settles within about a month of abstinence.
2. What is integrated treatment? || One team treating both disorders together.
3. Which psychosis often predicts later schizophrenia? || Cannabis-induced psychosis.
:::

:::mcq
Q: A woman drinking heavily for years has low mood. Two weeks after stopping alcohol, her mood is lifting. This most suggests:
- Independent major depression needing urgent ECT
- *An alcohol-induced depressive disorder
- Bipolar disorder
- Dysthymia
> Induced disorders settle with abstinence, usually within a month.
:::

# Part II · Alcohol

## 2.1 Alcohol use and its complications [core]
- Alcohol is the most commonly used psychoactive substance in India after tobacco; a large treatment gap exists.
- Markers of heavy drinking: raised **GGT**, raised **MCV**, AST more than ALT (often about 2:1), low platelets.

| System | Complications |
|---|---|
| Brain | Wernicke's encephalopathy, Korsakoff syndrome, dementia, cerebellar degeneration, peripheral neuropathy, seizures |
| Liver and gut | Fatty liver, hepatitis, cirrhosis, pancreatitis, gastritis, varices |
| Heart | Cardiomyopathy, arrhythmias, hypertension |
| Mental | Depression, anxiety, suicide, alcoholic hallucinosis, delusions of jealousy, sexual dysfunction |
| Social | Domestic violence, road accidents, job loss, debt, legal problems |
| Pregnancy | Fetal alcohol spectrum disorder |

:::mcq
Q: Which blood finding best supports recent heavy drinking?
- Low MCV
- *Raised GGT and MCV, with AST higher than ALT
- High platelets
- Low bilirubin only
> Classic alcohol pattern; carbohydrate-deficient transferrin is more specific.
:::

## 2.2 Alcohol withdrawal [core]
| Time after last drink | What happens |
|---|---|
| **6 to 24 hours** | Tremor, sweating, anxiety, nausea, insomnia, fast pulse, craving |
| **12 to 48 hours** | **Withdrawal seizures** (generalised, often peak around 24 hours); **alcoholic hallucinosis** (mainly voices or visions in **clear consciousness**) |
| **48 to 96 hours** | **Delirium tremens**: confusion, disorientation, vivid visual hallucinations (often small animals or insects), severe tremor, fever, sweating, fast heart rate, unstable BP; a medical emergency |

:::define Managing withdrawal
- Assess severity with **CIWA-Ar**; check for head injury, infection, liver disease and other drugs.
- **Benzodiazepines**: chlordiazepoxide or diazepam (fixed tapering dose or symptom-triggered); **lorazepam in liver disease** or older adults.
- **Thiamine** (vitamin B1) before glucose, to everyone: oral for low risk, **IV high dose** if Wernicke's is possible.
- Fluids, electrolytes (magnesium, potassium), nutrition; treat infection.
- Delirium tremens: inpatient or ICU care, large benzodiazepine doses, monitor closely.
:::

:::mcq
Q: On his second day in hospital a heavy drinker is shaking, sweating and anxious with a fast pulse but is fully oriented. The best treatment is:
- Haloperidol
- *A benzodiazepine on a symptom-guided schedule, with thiamine
- Nothing; it will pass
- Alcohol in small amounts
> Treat withdrawal early to prevent seizures and delirium tremens.
:::

## 2.3 Wernicke and Korsakoff [core]
:::safety Wernicke's encephalopathy
Acute thiamine deficiency. The classic triad: **confusion, ataxia, eye signs** (nystagmus, ophthalmoplegia); all three appear together in only a minority, so **treat on suspicion**. Give **IV thiamine** in high doses for several days **before glucose**. Untreated, it can kill or progress to Korsakoff syndrome.
:::
:::define Korsakoff syndrome
Chronic memory disorder after Wernicke's: severe **anterograde amnesia** (can't form new memories), some retrograde amnesia, and **confabulation**, with relatively preserved other cognition and consciousness.
:::

:::mcq
Q: A malnourished drinker is confused, unsteady and has nystagmus. Glucose is needed. The correct order is:
- Glucose first, then thiamine
- *IV thiamine first (high dose), then glucose
- Oral thiamine next week
- No thiamine unless all three signs persist
> Thiamine before glucose prevents worsening Wernicke's encephalopathy.
:::

## 2.4 Relapse prevention [core]
| Medicine | How it works | Key cautions |
|---|---|---|
| **Disulfiram** | Blocks aldehyde dehydrogenase; drinking causes flushing, nausea, palpitations (acetaldehyde reaction) | **Only with informed consent**, never secretly; avoid in heart disease, psychosis; avoid alcohol in medicines and foods |
| **Naltrexone** | Opioid antagonist; reduces craving and pleasure of drinking | Avoid with opioid use (precipitates withdrawal) and liver failure |
| **Acamprosate** | Modulates glutamate; reduces craving in abstinence | Excreted by the kidney: avoid in kidney failure |
| Baclofen, topiramate | Craving | Specialist use |

- Psychological: **motivational interviewing**, CBT relapse prevention (high-risk situations, coping, lapse vs relapse), family work, **Alcoholics Anonymous** and 12-step groups.

:::trap Secret disulfiram
Families sometimes ask for disulfiram to be mixed in food without the patient knowing. This is unethical and dangerous (severe reactions with even small amounts of alcohol). Disulfiram needs the patient's informed consent.
:::

:::recall
1. Give the alcohol withdrawal timeline. || 6 to 24 h tremor and anxiety; 12 to 48 h seizures and hallucinosis; 48 to 96 h delirium tremens.
2. How does alcoholic hallucinosis differ from delirium tremens? || Clear consciousness vs confusion with autonomic instability.
3. What is the Wernicke triad, and its treatment? || Confusion, ataxia, eye signs; high-dose IV thiamine before glucose.
4. Describe Korsakoff syndrome. || Anterograde amnesia with confabulation and preserved consciousness.
5. Which benzodiazepine in liver disease? || Lorazepam.
6. Name three relapse-prevention medicines with one caution each. || Disulfiram (consent, heart disease), naltrexone (opioids, liver failure), acamprosate (kidney failure).
:::

:::mcq
Q: A man wants help to stay sober but has kidney failure. Which relapse-prevention medicine should be avoided?
- Naltrexone
- *Acamprosate
- Disulfiram
- Baclofen
> Acamprosate is cleared by the kidneys.
:::

## 2.5 Alcohol in special groups and the body [core]
### Women and pregnancy
- Women reach higher blood alcohol from the same amount and develop liver damage and dependence faster (**telescoping**).
- There is **no known safe amount in pregnancy**. **Fetal alcohol spectrum disorder** causes facial features, growth problems, and lifelong learning and behaviour problems.

### Older adults
- Lower tolerance, more falls, interactions with medicines, confusion. Drinking often hidden; ask directly.

### The body: what to look for
| System | Effects |
|---|---|
| Liver | Fatty liver, alcoholic hepatitis, cirrhosis; raised **GGT**, **AST more than ALT** (ratio about 2:1 suggests alcohol) |
| Blood | Raised **MCV** (large red cells), low platelets |
| Gut | Gastritis, pancreatitis, oesophageal varices |
| Heart | High BP, cardiomyopathy, atrial fibrillation |
| Nerves and brain | Peripheral neuropathy, Wernicke–Korsakoff, cerebellar degeneration, dementia, seizures |
| Other | Cancers (mouth, throat, oesophagus, liver, breast), injuries, accidents, violence |

- **Carbohydrate-deficient transferrin (CDT)** is a specific marker of heavy drinking over recent weeks.

### Alcohol and family
- Domestic violence, financial ruin and children's emotional problems are common. Involve family: **community reinforcement and family training (CRAFT)** helps families encourage a reluctant drinker into treatment.
- **Al-Anon** supports families; **Alcoholics Anonymous** (12 steps) supports people in recovery.

:::recall
1. What liver enzyme pattern suggests alcohol? || Raised GGT with AST about twice ALT.
2. What blood count change suggests heavy drinking? || Raised MCV.
3. What is telescoping? || Faster progression to dependence and liver damage in women.
4. What is CRAFT? || Community reinforcement and family training for families of reluctant drinkers.
:::

:::mcq
Q: A pregnant woman asks how much alcohol is safe. The correct answer is:
- One drink a day
- Only wine is safe
- *No known amount is safe in pregnancy
- Safe after the first trimester
> Fetal alcohol spectrum disorder is preventable.
:::

# Part III · Other substances

## 3.1 Opioids [core]
Heroin (“smack”, “brown sugar”), opium (“afeem”, “doda post”), codeine syrups, tramadol, pharmaceutical opioids.

| | Intoxication | Withdrawal |
|---|---|---|
| Pupils | **Pinpoint** | **Dilated** |
| Breathing | **Slowed**: overdose kills | Normal or fast |
| Mood | Euphoria then drowsiness | Anxiety, irritability, craving |
| Body | Constipation, itching, slurred speech | **Yawning, watering eyes, runny nose, gooseflesh**, sweating, aches, abdominal cramps, diarrhoea, vomiting |
| Timing | | Starts about 6 to 12 hours after heroin; peaks in 1 to 3 days; lasts about a week (longer for methadone) |
| Danger | Respiratory arrest | Rarely dangerous in itself, but loss of tolerance raises overdose risk on relapse |

:::safety Opioid overdose
Pinpoint pupils, slow or stopped breathing, unconsciousness. Give **naloxone** (IV, IM or nasal), support breathing, and observe: naloxone wears off before many opioids, so overdose can return.
:::

### Treatment
- **Opioid substitution therapy (OST)**: **buprenorphine** (partial agonist; start only once in moderate withdrawal to avoid precipitated withdrawal; often with naloxone) or **methadone** (full agonist; watch QT and overdose). Reduces illicit use, infections (HIV, hepatitis C), crime and death.
- **Naltrexone** for motivated, detoxified patients.
- Symptomatic withdrawal relief: clonidine, painkillers, antiemetics, loperamide.
- Harm reduction: needle and syringe programmes, naloxone for families, HIV and hepatitis testing.

:::mcq
Q: A young man is brought in drowsy, breathing slowly, with pinpoint pupils. The first drug is:
- Flumazenil
- *Naloxone, and watch: it may wear off before the opioid does
- Haloperidol
- Activated charcoal only
> Opioid overdose: support breathing and give naloxone.
:::

## 3.2 Cannabis, stimulants and others [core]
| Substance | Intoxication | Problems |
|---|---|---|
| **Cannabis** (ganja, charas, bhang) | Relaxation, euphoria, red eyes, hunger, fast pulse, slowed time, anxiety or panic | Psychosis and raised schizophrenia risk (strong cannabis, teenage use), poor memory and motivation, cannabis hyperemesis (cyclical vomiting relieved by hot showers); withdrawal: irritability, poor sleep, low appetite |
| **Stimulants** (amphetamine, methamphetamine, cocaine) | Euphoria, energy, **dilated pupils**, fast pulse, high BP, sweating, little sleep | **Paranoid psychosis**, tactile hallucinations (insects under the skin: formication), stroke, heart attack, seizures; after-use crash with depression and sleepiness |
| **Hallucinogens** (LSD, mushrooms) | Perceptual changes, synaesthesia, mood swings | “Bad trips”, accidents, flashbacks (hallucinogen persisting perception disorder) |
| **Inhalants** (whitener, petrol, glue) | Euphoria, slurred speech, unsteadiness | Common in street children and adolescents; brain, liver and kidney damage; **sudden sniffing death** (arrhythmia) |
| **Sedatives** (benzodiazepines) | Drowsiness, slurring, unsteadiness | Dependence; withdrawal seizures; dangerous with alcohol and opioids |

:::mcq
Q: A student smokes cannabis daily and over a month becomes suspicious and hears voices. The most important advice is:
- Cannabis is harmless
- *Stop cannabis: it can trigger psychosis and raise the risk of schizophrenia
- Switch to synthetic cannabinoids
- Only smoke at weekends
> Cannabis-induced psychosis often predicts later schizophrenia.
:::

## 3.3 Tobacco and gambling [core]
### Tobacco
- The single biggest preventable cause of death among people with mental illness and substance use.
- Smoked (cigarettes, bidis) and smokeless (gutkha, khaini, mishri): mouth cancer is common in India.
- Treat: brief advice every visit (**ask, advise, assess, assist, arrange**), nicotine replacement (patch, gum), **varenicline**, **bupropion**, behavioural support.

### Gambling disorder
- Persistent, recurrent problem gambling: **at least 4 of 9** criteria in 12 months (needs bigger bets for excitement, restless when cutting down, failed attempts to stop, preoccupation, gambles when distressed, **chasing losses**, lies, jeopardises relationships or jobs, relies on others for money).
- Online betting, card games, cricket betting and gaming apps. High suicide risk with debt.
- Internet gaming disorder is listed for further study.

:::recall
1. Contrast opioid intoxication and withdrawal by pupils and breathing. || Pinpoint pupils, slow breathing; dilated pupils, normal or fast breathing.
2. Name five signs of opioid withdrawal. || Yawning, watering eyes, runny nose, gooseflesh, diarrhoea, cramps, aches.
3. What is the antidote for opioid overdose, and the pitfall? || Naloxone; it can wear off before the opioid.
4. Why must buprenorphine start only in moderate withdrawal? || To avoid precipitated withdrawal.
5. What is formication, and which drugs cause it? || Feeling insects under the skin; stimulants (cocaine, amphetamine).
6. What is the gambling disorder threshold? || 4 of 9 in 12 months.
:::

:::mcq
Q: A smoker with depression wants to quit. Which medicine helps with both?
- Varenicline only
- *Bupropion
- Nicotine patches only
- Alprazolam
> Bupropion is an antidepressant licensed for smoking cessation.
:::

## 3.4 Opioid treatment and harm reduction in India [core]
### Opioid substitution therapy (OST) in more detail
| | Buprenorphine | Methadone |
|---|---|---|
| Action | Partial agonist with a **ceiling effect** on breathing | Full agonist |
| Safety | Safer in overdose | Risk of overdose, especially early; **QT prolongation** |
| Starting | In moderate withdrawal (to avoid precipitated withdrawal) | Low dose, increase slowly |
| Forms | Sublingual tablet; with **naloxone** to discourage injecting | Oral liquid |
| In India | Widely used in OST centres | Available in some programmes |

- OST **reduces injecting, HIV and hepatitis C transmission, crime and deaths**, and keeps people in treatment. Usually long term; tapering too early raises relapse and overdose risk.
- **Naltrexone** (antagonist) for opioid use helps only very motivated people (for example with legal or professional pressure); after detoxification tolerance is lost, so **overdose risk is high if they relapse**.

### Harm reduction
- **Needle and syringe programmes**, **OST**, **naloxone** to families and peers, testing and treatment for HIV and hepatitis C, safe injecting education, condoms.
- In India, harm reduction services for people who inject drugs run through national AIDS control and drug dependence treatment programmes.

### Regional patterns in India
- **Punjab and the north-west**: heroin ("chitta"), injecting, and **poppy husk ("doda post")**.
- **North-east**: injecting heroin and pharmaceutical opioids; high HIV among injectors.
- Across India: **alcohol** is the most common substance treated, then cannabis and opioids; **inhalant use** in children and adolescents; tobacco (smoked and smokeless) widespread.

:::trap Overdose risk after a break
After detox, prison or a hospital stay, opioid tolerance falls quickly. A person who returns to their old dose can overdose. Give **naloxone** and overdose education at discharge.
:::

:::recall
1. Why is buprenorphine safer in overdose than methadone? || As a partial agonist it has a ceiling effect on breathing.
2. What does OST reduce? || Injecting, HIV and hepatitis C, crime and deaths.
3. Why is naltrexone risky in opioid users who relapse? || Tolerance is lost, so overdose risk is high.
4. Name four harm reduction measures. || Needle programmes, OST, naloxone, HIV and hepatitis testing.
:::

:::mcq
Q: A heroin user is in severe craving but has only mild withdrawal now. When should buprenorphine be started?
- Immediately
- *Once withdrawal is at least moderate, to avoid precipitated withdrawal
- Only after a week of abstinence
- Never with heroin users
> Buprenorphine displaces heroin; too early causes sudden withdrawal.
:::

## 3.5 Newer and hidden problems [core]
| Problem | What to know |
|---|---|
| **Prescription and over-the-counter misuse** | Codeine cough syrups, tramadol, alprazolam, pregabalin, painkillers; often hidden; ask about every medicine |
| **Synthetic cannabinoids** ("spice") | More potent than cannabis; agitation, psychosis, seizures; not detected on routine drug tests |
| **Methamphetamine** | Long-lasting stimulant; psychosis, violence, dental damage ("meth mouth"), weight loss |
| **MDMA (ecstasy)** | Party drug; overheating, low sodium from drinking too much water, serotonin syndrome |
| **Ketamine** | Dissociation; **bladder damage** with heavy use |
| **Behavioural addictions** | Gambling (including online betting and fantasy sports), gaming, possibly compulsive buying and pornography use |

### Drug testing
- **Urine drug screens** detect recent use (cannabis can stay positive for weeks in heavy users; most others for 1 to 3 days).
- Many newer drugs are not detected. A negative screen does not rule out use. Use testing to **support** treatment, not to punish.

:::recall
1. Which over-the-counter products are commonly misused in India? || Codeine cough syrups, tramadol, alprazolam, pregabalin.
2. Name a danger specific to ketamine misuse. || Bladder damage.
3. How long can cannabis stay positive in urine for heavy users? || Several weeks.
:::

:::mcq
Q: A college student uses codeine cough syrup daily "for sleep" and tramadol from a chemist. The best first step is:
- Ignore; they are legal
- *Ask about every medicine, explain dependence, and plan a supervised taper with support
- Prescribe alprazolam instead
- Report to police
> Over-the-counter opioids cause dependence; treat as substance use.
:::

# Part IV · Helping people change

## 4.1 Motivation and the stages of change [core]
:::define Stages of change (Prochaska and DiClemente)
**Precontemplation** (not considering change) → **contemplation** (ambivalent, weighing pros and cons) → **preparation** (planning) → **action** (changing) → **maintenance** (keeping it up) → and often **relapse**, which is part of the cycle, not failure.
:::

:::define Motivational interviewing
A collaborative conversation style that strengthens a person's **own** motivation for change by exploring and resolving **ambivalence**. Core skills, **OARS**: **O**pen questions, **A**ffirmations, **R**eflections, **S**ummaries. The clinician elicits “change talk” rather than arguing.
:::

:::word Motivational interviewing, not lecturing
- Instead of: “You'll destroy your liver if you keep drinking.”
- Try: “What do you enjoy about drinking? And what are the not-so-good things?” … “So it helps you relax after work, and you're also worried about your daughter seeing you drunk. Where does that leave you?”
:::

### What helps at each stage
| Stage | Clinician's task |
|---|---|
| Precontemplation | Build rapport, give information, raise doubt gently; harm reduction |
| Contemplation | Explore ambivalence; decisional balance |
| Preparation | Plan together; set a quit date; arrange detox |
| Action | Support, relapse-prevention skills, medicines |
| Maintenance | Prevent relapse; build a life without the substance |
| Relapse | Normalise, learn from it, restart |

:::recall
1. Name the stages of change in order. || Precontemplation, contemplation, preparation, action, maintenance, relapse.
2. What does OARS stand for? || Open questions, affirmations, reflections, summaries.
3. What is the main task in contemplation? || Exploring and resolving ambivalence.
:::

:::mcq
Q: A man says, "I know drinking hurts my family, but it's the only way I relax." His stage of change is:
- Precontemplation
- *Contemplation
- Action
- Maintenance
> Ambivalence: he sees both sides. Explore it with MI.
:::

# Part V · Exam zone

## 5.1 Long answer and short notes [core]
:::example Q. Describe the clinical features and management of alcohol dependence. (15 marks)
1. Definitions: use disorder criteria and severity; standard drinks; screening (AUDIT, CAGE).
2. Aetiology: reward pathway, genetics, social and cultural factors.
3. Clinical features: dependence, withdrawal timeline, complications by system, psychiatric complications.
4. Investigations: GGT, MCV, AST/ALT, LFTs, platelets, glucose, electrolytes.
5. Management of withdrawal: CIWA-Ar, benzodiazepines, thiamine, fluids, delirium tremens, Wernicke's.
6. Relapse prevention: disulfiram, naltrexone, acamprosate; MI, CBT, AA, family therapy.
7. Prognosis and harm reduction.
:::

:::word Short note: delirium tremens
The most severe form of alcohol withdrawal, typically 48 to 96 hours after the last drink, with clouded consciousness and disorientation, vivid hallucinations (often visual, small animals), severe tremor, agitation, fever, sweating, tachycardia and fluctuating blood pressure. Risk factors include long heavy drinking, previous DTs or seizures, and medical illness. It is a medical emergency with significant mortality if untreated: manage in hospital with high-dose benzodiazepines, IV thiamine, fluids and electrolytes, treatment of infection, and close monitoring.
:::

## 5.2 Viva rapid-fire [core]
:::viva
Minimum criteria for a substance use disorder? :: Two of 11 in 12 months.
Severity cut-offs? :: 2 to 3 mild, 4 to 5 moderate, 6 or more severe.
When do withdrawal seizures occur after alcohol? :: About 12 to 48 hours.
When does delirium tremens occur? :: About 48 to 96 hours.
Alcoholic hallucinosis vs DTs? :: Hallucinosis has clear consciousness.
Scale for alcohol withdrawal? :: CIWA-Ar.
Wernicke triad? :: Confusion, ataxia, eye signs.
Treatment of Wernicke's? :: High-dose IV thiamine before glucose.
Korsakoff's core features? :: Anterograde amnesia and confabulation.
Disulfiram mechanism? :: Blocks aldehyde dehydrogenase.
Acamprosate caution? :: Kidney failure.
Naltrexone caution? :: Opioid use and liver failure.
Opioid intoxication pupils? :: Pinpoint.
Opioid withdrawal pupils? :: Dilated.
Opioid overdose antidote? :: Naloxone.
Buprenorphine type? :: Partial opioid agonist.
Formication occurs with? :: Cocaine and amphetamine.
Cannabis hyperemesis relief? :: Hot showers.
Sudden death risk with inhalants? :: Arrhythmia (sudden sniffing death).
Stages of change? :: Precontemplation, contemplation, preparation, action, maintenance, relapse.
OARS? :: Open questions, affirmations, reflections, summaries.
Standard drink in India? :: About 10 g of alcohol.
AUDIT score suggesting dependence? :: 20 or more.
FRAMES first letter? :: Feedback.
Substance-induced depression usually settles within? :: About a month of abstinence.
AST to ALT ratio suggesting alcohol? :: About 2 to 1.
Specific marker of heavy drinking? :: Carbohydrate-deficient transferrin.
Partial agonist with a ceiling effect? :: Buprenorphine.
Methadone heart risk? :: QT prolongation.
Poppy husk in Punjab? :: Doda post.
Danger after detox or prison? :: Overdose from lost tolerance.
Ketamine organ damage? :: Bladder.
:::

## 5.3 Module test [core]
:::mcq
Q: A man meets 5 substance use disorder criteria for alcohol. Severity:
- Mild
- *Moderate
- Severe
- Not a disorder
> 4 to 5 is moderate.

Q: Two days after admission, a heavy drinker is confused, sees insects, is sweating, febrile and tremulous. Diagnosis:
- Alcoholic hallucinosis
- *Delirium tremens
- Wernicke's encephalopathy only
- Schizophrenia
> 48 to 96 hours with clouded consciousness and autonomic instability.

Q: A drinker hears abusive voices in clear consciousness, oriented, 24 hours after stopping. Most likely:
- Delirium tremens
- *Alcoholic hallucinosis
- Korsakoff syndrome
- Cannabis psychosis
> Hallucinations with clear consciousness.

Q: Which should be given before IV glucose in a malnourished heavy drinker?
- Lorazepam
- *Thiamine
- Naloxone
- Haloperidol
> Glucose can precipitate Wernicke's.

Q: Confusion, unsteady gait and nystagmus in a heavy drinker suggest:
- Korsakoff syndrome
- *Wernicke's encephalopathy
- Hepatic encephalopathy only
- Stroke only
> Treat on suspicion with IV thiamine.

Q: Which alcohol relapse-prevention drug must never be given without the patient's knowledge?
- Acamprosate
- Naltrexone
- *Disulfiram
- Baclofen
> Severe reactions; needs informed consent.

Q: Pinpoint pupils, slow breathing and unconsciousness. First treatment:
- Flumazenil
- *Naloxone with airway support
- Thiamine
- Activated charcoal only
> Opioid overdose.

Q: Yawning, watering eyes, runny nose, gooseflesh and dilated pupils suggest:
- Opioid intoxication
- *Opioid withdrawal
- Cocaine intoxication
- Alcohol intoxication
> Classic opioid withdrawal.

Q: Buprenorphine started too early in someone who recently used heroin can cause:
- Overdose
- *Precipitated withdrawal
- Serotonin syndrome
- Seizures
> A partial agonist displaces the full agonist.

Q: A patient says, “I know drinking is a problem, but it's the only thing that helps me sleep.” Stage of change:
- Precontemplation
- *Contemplation
- Action
- Maintenance
> Ambivalent, weighing pros and cons.

Q: Which is a stimulant effect?
- Pinpoint pupils
- *Paranoid psychosis with dilated pupils
- Respiratory depression
- Cyclical vomiting relieved by hot showers
> Cocaine and amphetamines.

Q: Which blood test combination best suggests heavy drinking?
- Low GGT and low MCV
- *Raised GGT and raised MCV
- Raised TSH
- Low potassium only
> Classic markers, with AST more than ALT.

Q: A man's AUDIT score is 11. The best action is:
- Immediate admission for detoxification
- *Brief advice using FRAMES
- Start disulfiram
- No action
> Hazardous drinking zone.

Q: A man has low mood after 10 years of heavy drinking. Two weeks after stopping, his mood is improving. This most suggests:
- Independent major depression needing ECT
- *Alcohol-induced depressive disorder
- Bipolar disorder
- Dysthymia
> Induced disorders settle with abstinence.

Q: A heroin user is released from prison after a year. The most important harm reduction step is:
- Advise him to restart at his previous dose
- *Provide naloxone and overdose education
- Prescribe a benzodiazepine
- Arrange a urine test only
> Tolerance has fallen.

Q: Which is TRUE of buprenorphine?
- It is a full opioid agonist
- *It has a ceiling effect on breathing depression
- It should be started during intoxication
- It is not used in India
> Start in moderate withdrawal.
:::
`;
