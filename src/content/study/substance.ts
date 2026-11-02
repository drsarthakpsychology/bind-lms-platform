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

## 2.3 Wernicke and Korsakoff [core]
:::safety Wernicke's encephalopathy
Acute thiamine deficiency. The classic triad: **confusion, ataxia, eye signs** (nystagmus, ophthalmoplegia); all three appear together in only a minority, so **treat on suspicion**. Give **IV thiamine** in high doses for several days **before glucose**. Untreated, it can kill or progress to Korsakoff syndrome.
:::
:::define Korsakoff syndrome
Chronic memory disorder after Wernicke's: severe **anterograde amnesia** (can't form new memories), some retrograde amnesia, and **confabulation**, with relatively preserved other cognition and consciousness.
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

## 3.2 Cannabis, stimulants and others [core]
| Substance | Intoxication | Problems |
|---|---|---|
| **Cannabis** (ganja, charas, bhang) | Relaxation, euphoria, red eyes, hunger, fast pulse, slowed time, anxiety or panic | Psychosis and raised schizophrenia risk (strong cannabis, teenage use), poor memory and motivation, cannabis hyperemesis (cyclical vomiting relieved by hot showers); withdrawal: irritability, poor sleep, low appetite |
| **Stimulants** (amphetamine, methamphetamine, cocaine) | Euphoria, energy, **dilated pupils**, fast pulse, high BP, sweating, little sleep | **Paranoid psychosis**, tactile hallucinations (insects under the skin: formication), stroke, heart attack, seizures; after-use crash with depression and sleepiness |
| **Hallucinogens** (LSD, mushrooms) | Perceptual changes, synaesthesia, mood swings | “Bad trips”, accidents, flashbacks (hallucinogen persisting perception disorder) |
| **Inhalants** (whitener, petrol, glue) | Euphoria, slurred speech, unsteadiness | Common in street children and adolescents; brain, liver and kidney damage; **sudden sniffing death** (arrhythmia) |
| **Sedatives** (benzodiazepines) | Drowsiness, slurring, unsteadiness | Dependence; withdrawal seizures; dangerous with alcohol and opioids |

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
:::
`;
