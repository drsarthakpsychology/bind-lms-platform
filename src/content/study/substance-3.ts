/* Module · Substance use and addictive disorders, Parts III and IV (Advanced level and exam zone). Original text written for VIBHA School of Psychology. */
export const part3 = String.raw`
# Part III · Advanced: treatment in depth, India and the frontier

## 3.1 Withdrawal management in depth [core][advanced]
Medically assisted withdrawal ("detox") is a starting point, not a treatment on its own. Done well, it is safe and humane, and it opens the door to longer-term help. Done badly, it can kill (seizures, delirium, Wernicke's), or leave people more vulnerable to overdose.

### Where should withdrawal happen?
**Community or outpatient** withdrawal is often possible when withdrawal is expected to be mild to moderate, there is a responsible adult at home, the person can attend daily, and there is no history of complicated withdrawal.

**Hospital (inpatient)** withdrawal is safer when there is:
- A history of **withdrawal seizures or delirium tremens**.
- Very heavy daily use, or high scores on a withdrawal scale early on.
- Serious **physical illness** (liver failure, infection, heart disease) or **pregnancy**.
- Dependence on **several substances**, especially alcohol with benzodiazepines.
- **Suicide risk** or serious mental illness.
- No safe home, or repeated failed community attempts.

:::widget sort
{"prompt": "Community withdrawal reasonable, or hospital advised? Place each patient.", "buckets": ["Community withdrawal reasonable", "Hospital advised"], "items": [{"text": "Drinks 8 standard drinks a day, no past fits, lives with a supportive wife, can attend daily", "bucket": 0}, {"text": "Had delirium tremens two years ago during a previous attempt", "bucket": 1}, {"text": "Drinks heavily and also takes alprazolam 4 mg daily", "bucket": 1}, {"text": "Pregnant woman with alcohol dependence", "bucket": 1}, {"text": "Moderate drinker with mild morning tremor, works from home, partner present", "bucket": 0}, {"text": "Lives alone, has cirrhosis with jaundice, and drinks a full bottle a day", "bucket": 1}]}
:::

### Rating scales guide the dose
Rather than guessing, clinicians use **rating scales** to measure withdrawal severity and adjust treatment:
- **CIWA-Ar** for alcohol: ten items, rated by a nurse or doctor.
- **COWS** for opioids: eleven items, including pulse, pupils, sweating, aches, runny nose, gut upset, tremor, yawning, anxiety and goosebumps.

Scores are repeated regularly. Rising scores mean more treatment; falling scores mean the dose can be reduced.

:::widget worked
{"title": "Scoring and acting on CIWA-Ar", "steps": [{"q": "Mohan, 46, is 18 hours from his last drink on a medical ward. He has moderate tremor with arms extended, visible sweat on the forehead, is moderately anxious and restless, mild nausea, no hallucinations, fully oriented, mild headache. The nurse scores CIWA-Ar at 17. What does this mean?", "a": "Above 15: severe withdrawal. He needs benzodiazepine treatment now and close monitoring, because he is at risk of seizures and delirium."}, {"q": "Using a symptom-triggered approach, what do you give?", "a": "For example chlordiazepoxide 50 mg (or diazepam 20 mg) orally now, then repeat CIWA-Ar in one hour, giving further doses while the score stays above about 10."}, {"q": "What else must be given or checked?", "a": "Parenteral thiamine (before any glucose), magnesium, potassium and phosphate, fluids, a search for infection, injury or GI bleeding, and a look at his liver function, which affects benzodiazepine choice."}, {"q": "After three doses over the evening, his score is 6. What next?", "a": "Continue monitoring every 4 hours. Give doses only if the score rises again. Over the following days the total daily need falls; plan relapse-prevention treatment."}], "yourTurn": [{"q": "On day two, Mohan becomes disoriented, picks at the bedsheets and sees spiders. CIWA-Ar now reads 28. What is happening and what do you change?", "a": "Delirium tremens is likely. CIWA-Ar is not reliable in delirium; move to high-dependency care, give high-dose benzodiazepines (front-loading), correct fluids and electrolytes, continue high-dose thiamine, and treat any medical cause. Avoid using an antipsychotic alone."}]}
:::

:::widget decide
{"scene": "Asif, 28, from Srinagar, uses about 1 g of heroin a day by smoking. He asks for help 'to get off heroin' and wants a ten-day inpatient detox, after which he plans to 'never use again'. He has had two detoxes before; both times he relapsed within a month, and after the last one he overdosed.", "ask": "What is the best advice?", "choices": [{"label": "Arrange another ten-day detox exactly as he asks", "verdict": "ok", "outcome": "He completes detox but relapses within weeks, at his old dose, and overdoses again.", "why": "Detox alone has high relapse rates in opioid dependence and leaves people with low tolerance, raising overdose risk."}, {"label": "Explain honestly that maintenance treatment with buprenorphine (or methadone), together with counselling, is far more likely to keep him alive and well than detox alone, and offer naloxone; if he still prefers detox, plan relapse-prevention support and overdose education", "verdict": "best", "outcome": "Asif chooses buprenorphine maintenance at a clinic. He stops using street heroin, returns to work and keeps a naloxone kit.", "why": "Opioid agonist treatment reduces illicit use, overdose deaths, HIV and crime far more than detox alone. Shared decision-making respects his choice while giving him the evidence."}, {"label": "Refuse treatment because he relapsed before", "verdict": "harm", "outcome": "He continues using and overdoses again.", "why": "Relapse is part of the condition, not a reason to refuse help."}]}
:::

:::clinician
### Detailed regimens (examples; follow local protocols)
**Alcohol, fixed-dose chlordiazepoxide (moderate to severe dependence, inpatient)**
| Day | Dose |
|---|---|
| 1 | 30 to 40 mg four times daily (plus as-needed doses for breakthrough, up to a ceiling) |
| 2 | 25 to 30 mg four times daily |
| 3 | 20 to 25 mg four times daily |
| 4 | 15 to 20 mg four times daily |
| 5 | 10 mg four times daily |
| 6 | 10 mg twice daily |
| 7 | 10 mg at night, then stop |

Doses must be individualised: lower in mild dependence and in the elderly; higher, with careful monitoring, in very heavy drinkers. In hepatic impairment, prefer lorazepam (for example 1 to 2 mg four times daily, reducing) or symptom-triggered dosing. Avoid giving more than a few days' supply in community withdrawal; daily review. Never give a benzodiazepine supply to a patient who continues to drink.

**Adjuncts**: thiamine (see section 2.3), multivitamins, folate, magnesium; antiemetics; treat hypokalaemia. Carbamazepine (for example 200 mg three to four times daily, reducing over 5 days) or gabapentin are alternatives in mild to moderate withdrawal where benzodiazepines are a concern; not first-line for severe withdrawal. Baclofen is not recommended for acute withdrawal. In benzodiazepine-refractory DTs (very high doses needed), phenobarbital or propofol with ICU support.

**Opioids, buprenorphine-assisted withdrawal**: day 1, 4 mg once COWS is at least 8 to 12 (to avoid precipitated withdrawal), with a further 2 to 4 mg if needed (total about 8 mg); days 2 to 3, stabilise at 8 to 16 mg; then reduce by 2 mg every 1 to 2 days over 7 to 14 days. Symptomatic adjuncts as in section 2.4.

**Benzodiazepine dependence**: convert to diazepam equivalents; reduce about 10% of the current dose every 1 to 2 weeks (smaller steps below 20 mg diazepam); total duration 2 to 6 months or longer in long-term users; consider inpatient withdrawal for very high doses or past seizures.

**Pregnancy**: alcohol withdrawal in pregnancy is managed in hospital with benzodiazepines; opioid-dependent pregnant women should be offered maintenance (methadone or buprenorphine) rather than withdrawal, which risks fetal distress and relapse; plan for neonatal opioid withdrawal syndrome.
:::

:::recall
1. Give four reasons for inpatient rather than community alcohol withdrawal. || Past seizures or DTs, very heavy use, serious physical illness or pregnancy, polysubstance dependence, suicide risk, no safe home.
2. What CIWA-Ar score indicates severe withdrawal? || Above 15.
3. Why is detox alone risky in opioid dependence? || High relapse rates, and loss of tolerance raises overdose risk.
4. Why is buprenorphine started only once withdrawal is visible? || Starting too early can precipitate sudden, severe withdrawal, because buprenorphine displaces full agonists.
:::

:::mcq
Q: A man with past delirium tremens asks for alcohol withdrawal at home. The best advice is:
- Home withdrawal with a week's supply of diazepam
- *Inpatient withdrawal, because past DTs predict a high risk of recurrence
- No medicine is needed
- Stop drinking gradually without help
> Previous complicated withdrawal is a key reason for inpatient care.

Q: CIWA-Ar is not reliable when the patient:
- Is anxious
- Is sweating
- *Is delirious
- Has a tremor
> It depends on the patient's report; in delirium, use clinical monitoring.
:::

## 3.2 Medicines for staying well [core][advanced]
Withdrawal gets the substance out; relapse prevention keeps life moving forward. Medicines can roughly double the chance of staying abstinent or reducing harm, but they work best with psychological support and are badly under-used.

### Alcohol
- **Naltrexone** blocks opioid receptors, reducing the "reward" of drinking and the urge to keep going after the first drink. It helps both reduced drinking and abstinence. It must not be used with opioids, and needs care in liver disease.
- **Acamprosate** is thought to calm the over-excited brain after alcohol stops, reducing craving. It is used for abstinence, needs dose changes in kidney disease, and is fine in liver disease.
- **Disulfiram** blocks the breakdown of alcohol, so drinking causes a very unpleasant reaction (flushing, pounding heart, nausea, vomiting, low blood pressure). It works only if taken, so it helps most when someone (often a family member) supervises each dose. It is dangerous in heart disease and must never be given secretly.
- **Baclofen, topiramate and gabapentin** are second-line options with some evidence.

### Opioids
**Opioid agonist treatment** (also called opioid substitution therapy, OST) replaces short-acting street opioids with a long-acting, prescribed opioid taken by mouth or under the tongue:
- **Methadone**, a full agonist, taken as a daily liquid.
- **Buprenorphine**, a partial agonist with a "ceiling" on breathing suppression, safer in overdose, taken under the tongue; often combined with **naloxone** to discourage injection.

These are the most effective treatments for opioid dependence. They **halve the risk of death**, reduce HIV and hepatitis spread, crime and illicit use, and help people return to work and family.

**Naltrexone** blocks opioids and can help highly motivated people after full detox, but adherence is often poor and overdose risk rises if it is stopped.

### Tobacco
Nicotine replacement, varenicline and bupropion (see section 2.6).

:::widget sort
{"prompt": "Which alcohol relapse-prevention medicine fits each patient best?", "buckets": ["Naltrexone", "Acamprosate", "Disulfiram", "Avoid all three; think again"], "items": [{"text": "Wants to cut down rather than stop completely; normal liver and kidneys", "bucket": 0, "why": "Naltrexone has evidence for reducing heavy drinking."}, {"text": "Aiming for abstinence, has moderate liver disease, normal kidneys", "bucket": 1, "why": "Acamprosate is not processed by the liver."}, {"text": "Aiming for abstinence, motivated, wife will watch him take it daily, no heart disease", "bucket": 2}, {"text": "Uses daily tramadol for back pain and also drinks heavily", "bucket": 1, "why": "Naltrexone would block his opioid and precipitate withdrawal; acamprosate is an option if kidneys are fine."}, {"text": "Family wants to mix a medicine secretly into his food to make him sick if he drinks", "bucket": 3, "why": "Covert disulfiram is unethical and dangerous; never give any medicine secretly."}, {"text": "Severe kidney failure, wants abstinence, also has heart failure", "bucket": 0, "why": "Acamprosate is contraindicated in severe renal impairment and disulfiram in heart disease; naltrexone is an option if the liver is acceptable."}]}
:::

:::widget decide
{"scene": "Mrs Sharma, from Delhi, asks for 'a tablet to put in my husband's tea' because he refuses treatment and becomes violent when drunk. She has heard that 'a medicine will make him hate alcohol'.", "ask": "How do you respond?", "choices": [{"label": "Prescribe disulfiram for her to give secretly", "verdict": "harm", "outcome": "He drinks at a wedding, collapses with a severe reaction, and is admitted to intensive care.", "why": "Covert disulfiram is unethical, illegal without consent and dangerous: the reaction can be life-threatening."}, {"label": "Refuse the secret medicine, explain why, assess her and her children's safety from violence, and offer family-focused help to encourage him into treatment (for example a CRAFT approach) and support for her", "verdict": "best", "outcome": "She makes a safety plan, joins a family group, and some months later her husband agrees to an assessment.", "why": "Families need support and safety first. Approaches that teach families to reward sobriety and invite treatment (Community Reinforcement and Family Training) get more reluctant drinkers into care than confrontation."}, {"label": "Tell her nothing can be done until he wants help", "verdict": "ok", "outcome": "She feels hopeless and the violence continues.", "why": "There is a lot a family can do, and her own safety and well-being need attention."}]}
:::

:::clinician
### Dosing and practice (Indian brands are examples)
| Medicine | Dose | Before starting | Key cautions |
|---|---|---|---|
| **Naltrexone** (Naltima, Nodict) | 25 mg for 1 to 3 days, then 50 mg daily; can start while drinking (for reduction) | LFTs; opioid-free 7 to 10 days (naloxone challenge if uncertain) | Precipitates opioid withdrawal; blocks opioid analgesia (carry a card); avoid in acute hepatitis or liver failure; nausea, headache |
| **Acamprosate** (Acamprol, Acamptas) | 666 mg three times daily (two 333 mg tablets) if 60 kg or more; 666 mg morning, 333 mg midday and night if under 60 kg | Renal function; start as soon as possible after withdrawal | Reduce dose if creatinine clearance 30 to 50 mL/min; contraindicated below 30; diarrhoea; continue about 6 to 12 months |
| **Disulfiram** (Esperal) | 250 mg daily (125 to 500 mg); start at least 24 hours after the last drink | Informed consent; ECG and LFTs; no alcohol in medicines, foods or toiletries | Contraindicated in heart disease, stroke, psychosis, pregnancy; hepatotoxicity (rare but serious); reaction can last hours; supervised dosing helps |
| **Baclofen** (Liofen) | 5 to 10 mg three times daily, up to about 30 to 80 mg/day | Renal function | Sedation, overdose risk, withdrawal seizures on abrupt stop; useful in liver disease |
| **Topiramate** (Topamac) | 25 mg daily, increasing weekly to 100 to 200 mg/day | | Cognitive slowing, paraesthesia, kidney stones, weight loss |
| **Gabapentin** (Gabapin) | 300 mg, increasing to 900 to 1,800 mg/day | | Misuse potential, especially with opioids |

**Opioid agonist treatment**
- **Methadone**: start 10 to 30 mg (lower if tolerance uncertain, maximum 40 mg on day 1), increase by 5 to 10 mg every 3 to 5 days (no more than 20 to 30 mg a week); usual maintenance 60 to 120 mg daily; supervised daily dosing initially. QT prolongation (ECG at baseline and above about 100 mg or with other QT drugs); many interactions (rifampicin and some antiretrovirals lower levels). Deaths cluster in the first two weeks of induction.
- **Buprenorphine** (Addnok) and **buprenorphine-naloxone** (Addnok-N): first dose when in clear withdrawal (COWS at least 8 to 12, usually 12 to 24 hours after heroin, 48 to 72 hours or more after methadone); 2 to 4 mg, repeated to about 8 to 12 mg on day 1; maintenance usually 8 to 24 mg daily (up to 32 mg in some guidelines). Low-dose "micro-induction" (for example Bernese method) avoids the need for withdrawal, useful with fentanyl or when switching from methadone. Long-acting monthly injectable buprenorphine exists internationally but not in India.
- **Retention** is the main predictor of benefit; higher doses predict better retention. Discontinuation multiplies overdose risk, especially in the first month.
- **Naltrexone** for opioids: oral 50 mg daily after 7 to 10 days opioid-free; extended-release injectable (380 mg monthly) is not marketed in India.

**Evidence summaries**: Cochrane reviews show acamprosate (NNT about 12 for return to any drinking) and naltrexone (NNT about 20 for return to any drinking, about 12 for heavy drinking) are effective; disulfiram works mainly in supervised, open-label settings. Methadone and buprenorphine maintenance reduce all-cause mortality by about half (Santo et al., JAMA Psychiatry 2021).
:::

:::recall
1. How does naltrexone help in alcohol dependence? || Blocks opioid receptors, reducing the reward of drinking and urges to continue.
2. Which alcohol medicine is safe in liver disease but needs adjusting in kidney disease? || Acamprosate.
3. Why must disulfiram never be given secretly? || It causes a dangerous reaction with alcohol and requires informed consent.
4. Why is buprenorphine safer than methadone in overdose? || As a partial agonist, it has a ceiling on respiratory depression.
5. By about how much does opioid agonist treatment cut the risk of death? || About half.
:::

:::mcq
Q: A man with alcohol dependence takes tramadol daily for chronic pain. Which relapse-prevention medicine should be avoided?
- Acamprosate
- *Naltrexone
- Baclofen
- Topiramate
> Naltrexone blocks opioids and would precipitate withdrawal.

Q: The most effective treatment for opioid dependence in reducing death is:
- Repeated detox
- Naltrexone tablets
- *Maintenance with methadone or buprenorphine
- Clonidine
> Opioid agonist treatment roughly halves mortality.
:::

## 3.3 Motivational interviewing and psychological treatment [core][advanced]
Most people with substance problems feel **two ways** about change: they want to stop and they want to keep using. This is called **ambivalence**, and it is normal. Lecturing, warning and arguing usually make people defend their use more. **Motivational interviewing (MI)**, developed by William Miller and Stephen Rollnick, helps people resolve ambivalence in favour of change, in their own words.

### The spirit of MI
- **Partnership**: working with the person, not on them.
- **Acceptance**: respecting their autonomy, worth and choices.
- **Compassion**: putting their well-being first.
- **Evocation**: drawing out their own reasons for change, rather than installing yours.

### The core skills: OARS
- **O**pen questions: "What worries you about your drinking?"
- **A**ffirmations: "You've been honest with me about something hard."
- **R**eflections: "Part of you enjoys the evenings with your friends, and part of you is scared about your liver."
- **S**ummaries: drawing together what the person has said, especially their reasons for change.

### Change talk and sustain talk
Listen for **change talk** (the person's own statements in favour of change) and gently strengthen it:
- **Desire**: "I want to be there for my kids."
- **Ability**: "I managed a month without drinking last year."
- **Reasons**: "My blood pressure is high."
- **Need**: "I have to do something."
- **Commitment**: "I will go to the clinic on Monday."

**Sustain talk** ("Drinking is the only way I relax") is not argued with. You reflect it, and look for the other side. Arguing creates **discord** (what used to be called resistance).

:::widget sort
{"prompt": "Change talk or sustain talk? Place each statement.", "buckets": ["Change talk", "Sustain talk"], "items": [{"text": "'I don't want my daughter to see me drunk again.'", "bucket": 0, "why": "Desire and a reason."}, {"text": "'Everyone in my office drinks like this.'", "bucket": 1}, {"text": "'I stopped for Ramzan once, so I know I can do it.'", "bucket": 0, "why": "Ability."}, {"text": "'A few pegs is the only thing that helps me sleep.'", "bucket": 1}, {"text": "'I'll call the clinic tomorrow.'", "bucket": 0, "why": "Commitment."}, {"text": "'My liver test isn't that bad.'", "bucket": 1}, {"text": "'I have to cut down before I lose my job.'", "bucket": 0, "why": "Need."}]}
:::

:::widget decide
{"scene": "Rakesh, 38, an auto-rickshaw driver in Jaipur, comes because his wife insisted. He says: 'Everyone drinks after work. It's only three or four quarters at night. My wife is just nagging. But yes, my chest was paining last week and the doctor said my pressure is high.'", "ask": "Which response best fits motivational interviewing?", "choices": [{"label": "'Three or four quarters is very heavy. You must stop now or you will have a heart attack.'", "verdict": "harm", "outcome": "Rakesh crosses his arms: 'You doctors exaggerate. My father drank more and lived to 80.' He does not return.", "why": "Warnings and confrontation provoke sustain talk and discord. He argues for drinking."}, {"label": "'Drinking with friends after work matters to you, and you're also worried about the chest pain and your blood pressure.'", "verdict": "best", "outcome": "Rakesh nods: 'Yes, my brother had a heart attack at 45. I don't want that.' He begins to talk about cutting down.", "why": "A double-sided reflection acknowledges both sides of his ambivalence and lets him hear his own reason for change, which he then expands."}, {"label": "'Why don't you just drink less?'", "verdict": "ok", "outcome": "He says it's not that easy. The conversation stalls.", "why": "A closed, advice-giving question invites 'yes, but'. Open questions and reflections work better."}]}
:::

### The stages of change
Prochaska and DiClemente described stages people move through, often more than once:
1. **Precontemplation**: not considering change ("I don't have a problem").
2. **Contemplation**: thinking about it, ambivalent ("Maybe I should, but...").
3. **Preparation**: planning ("I'm going to stop next month").
4. **Action**: making changes.
5. **Maintenance**: keeping changes going.
6. **Relapse**: going back to old patterns, then usually back into the cycle.

Matching your approach to the stage helps: raise doubt in precontemplation, tip the balance in contemplation, plan in preparation, support skills in action and maintenance, and treat relapse as a learning opportunity.

:::widget sort
{"prompt": "Which stage of change? Place each statement.", "buckets": ["Precontemplation", "Contemplation", "Preparation", "Action", "Maintenance"], "items": [{"text": "'I drink, so what? It's my life.'", "bucket": 0}, {"text": "'I know I should cut down, but it's my only way to relax.'", "bucket": 1}, {"text": "'I've told my friends I'm stopping from the first of next month and bought nicotine patches.'", "bucket": 2}, {"text": "'I stopped smoking last month and I'm using the patch every day.'", "bucket": 3}, {"text": "'It's been two years since my last drink. I still go to my group.'", "bucket": 4}]}
:::

### Other psychological treatments
- **Cognitive behavioural therapy (CBT) and relapse prevention**: identifying high-risk situations, coping with craving (urge surfing, delay, distraction), refusal skills, managing lapses so they don't become relapses.
- **Contingency management**: small rewards (vouchers, prizes) for negative drug tests. Very effective, especially for stimulants, but rarely available.
- **Community reinforcement approach** and family involvement (CRAFT, behavioural couples therapy).
- **Mutual help**: Alcoholics Anonymous and Narcotics Anonymous (with active groups in many Indian cities), SMART Recovery.
- **Social support**: housing, work, debt advice, and rebuilding meaningful life.

:::clinician
### Evidence and practice
- **MI**: meta-analyses show small to moderate effects on substance use, larger when MI is added to other treatment and in people less ready to change; fidelity matters. Four processes in the third edition: engaging, focusing, evoking, planning. MITI (Motivational Interviewing Treatment Integrity) is used to rate fidelity; reflections should outnumber questions (about 2 to 1 for proficiency).
- **Project MATCH** (1997, about 1,700 drinkers): motivational enhancement therapy (4 sessions), CBT (12 sessions) and twelve-step facilitation (12 sessions) gave similar overall outcomes; patient-treatment matching hypotheses were largely unsupported. **UKATT** (2005): social behaviour and network therapy equalled MET.
- **Contingency management**: the largest effect sizes of any psychosocial treatment for stimulant use disorder (meta-analysis by Bentzley et al., 2021); also effective for opioids, tobacco and alcohol; cost and ideological objections limit uptake.
- **Twelve-step**: Cochrane (Kelly et al., 2020) found manualised twelve-step facilitation and AA were as effective as other established treatments for abstinence and more effective for continuous abstinence, and reduced health-care costs.
- **Relapse prevention** (Marlatt): the abstinence violation effect ("I've blown it, so I may as well keep going") is targeted by reframing lapses.
- **Indian adaptations**: brief interventions by lay counsellors (for example the CAP, Counselling for Alcohol Problems, trial in Goa, part of the PREMIUM programme, showed higher remission at 3 and 12 months versus enhanced usual care), family-based approaches, and integration with primary care.
:::

:::recall
1. What are the four parts of the spirit of MI? || Partnership, acceptance, compassion, evocation.
2. What does OARS stand for? || Open questions, affirmations, reflections, summaries.
3. Give the five types of preparatory and commitment change talk. || Desire, ability, reasons, need, commitment (DARN-C).
4. List the stages of change. || Precontemplation, contemplation, preparation, action, maintenance, relapse.
5. Which psychological treatment has the strongest evidence for stimulant use disorder? || Contingency management.
:::

:::mcq
Q: A man says, 'I know my drinking upsets my wife, but it's the only way I can cope with work.' The best MI response is:
- 'You need to stop for your wife's sake.'
- *'Drinking helps you cope with work, and you're also aware of how it affects your wife.'
- 'That's an excuse.'
- 'Have you tried yoga?'
> A double-sided reflection holds both sides of ambivalence.

Q: In Project MATCH, which treatment gave clearly better overall outcomes than the others?
- CBT
- Motivational enhancement therapy
- Twelve-step facilitation
- *None; all three gave similar outcomes
> Overall outcomes were similar.
:::

## 3.4 Dual diagnosis, special groups and the Indian system [core][advanced]
### Dual diagnosis
Substance use and other mental illnesses go together far more often than chance: depression, anxiety, PTSD, bipolar disorder, schizophrenia, ADHD and personality disorders all raise the risk, and substance use worsens all of them. The old approach, "sort out the drinking first and then we'll treat your depression", leaves people bouncing between services. **Integrated treatment**, where one team treats both, works better.

Key principles:
- **Assess both** properly; reassess mood and anxiety after a period of abstinence to separate substance-induced symptoms from independent illness.
- **Do not withhold treatment** of the mental illness because the person is still using.
- **Choose medicines with care**: avoid those dangerous in overdose or with alcohol; watch interactions.
- **Plan for risk**: suicide risk is much higher when substance use and mental illness occur together.

:::widget decide
{"scene": "Leela, 32, from Chennai, has bipolar I disorder and alcohol use disorder. She has been admitted twice with mania after binges. Her community team says, 'We can't treat her bipolar disorder until she stops drinking.' The de-addiction centre says, 'We don't take people with mania.' She is currently drinking daily and her mood is rising.", "ask": "What is the best approach?", "choices": [{"label": "Wait until she stops drinking before treating her mood disorder", "verdict": "harm", "outcome": "She becomes fully manic, spends her savings and is admitted under the Mental Healthcare Act.", "why": "Untreated bipolar disorder fuels drinking and vice versa. Withholding treatment helps neither."}, {"label": "Offer integrated care: treat the bipolar disorder now (a mood stabiliser and close monitoring), offer motivational work and relapse-prevention medicine for alcohol, and coordinate one plan between teams", "verdict": "best", "outcome": "Her mood stabilises; with naltrexone and regular sessions her drinking falls sharply. She has no admissions in the following year.", "why": "Integrated treatment of both conditions together gives the best outcomes in dual diagnosis."}, {"label": "Refer her to a residential rehabilitation centre only", "verdict": "ok", "outcome": "She stops drinking there but relapses into mania after discharge because her mood disorder was not treated.", "why": "Rehabilitation helps, but must be combined with treatment of the mental illness."}]}
:::

### Special groups
- **Adolescents**: early use predicts later addiction; involve families; focus on school, peers and skills.
- **Women**: often hidden use, more stigma, faster physical harm from alcohol (the "telescoping" effect), and pregnancy-related needs. Women-only and child-friendly services improve access.
- **Pregnancy**: no safe level of alcohol; opioid maintenance is safer than withdrawal; tobacco cessation helps mother and baby.
- **Older adults**: alcohol and benzodiazepine problems are easily missed, causing falls, confusion and drug interactions.
- **People in prison**: high rates of addiction; overdose risk soars after release.

### The Indian system
- **Law**: the **Narcotic Drugs and Psychotropic Substances (NDPS) Act 1985** makes possession and use of illicit drugs an offence, but **Section 64A** gives immunity from prosecution to a person charged with consumption of a small quantity who volunteers for treatment, and **Section 71** allows government to set up treatment centres. A 2014 amendment eased access to "essential narcotic drugs" such as morphine and methadone for medical use.
- **Services**: government de-addiction centres in medical colleges and district hospitals; the **Drug Treatment Clinic** scheme supported by the National Drug Dependence Treatment Centre (AIIMS) delivering buprenorphine-naloxone maintenance; **targeted interventions and OST centres for people who inject drugs** under the National AIDS Control Organisation; Punjab's large network of outpatient opioid treatment clinics; NGO-run integrated rehabilitation centres supported by the Ministry of Social Justice.
- **Nasha Mukt Bharat Abhiyaan** (2020): a national awareness and outreach campaign focused on high-burden districts.
- **The Mental Healthcare Act 2017** applies: substance use disorders count as mental illness under the Act; admission must follow its rules on capacity and consent.
- **The dark side**: many unregulated private "rehabilitation" or "nasha mukti" centres hold people against their will, use physical punishment and offer no evidence-based treatment. Deaths in such centres are reported regularly. Recommending a centre means checking that it is licensed and humane.

:::widget sort
{"prompt": "Good practice or harmful practice? Place each feature of a treatment centre.", "buckets": ["Good practice", "Harmful practice"], "items": [{"text": "Voluntary admission with informed consent, and freedom to leave", "bucket": 0}, {"text": "Patients chained or beaten 'to break the habit'", "bucket": 1}, {"text": "Opioid substitution treatment offered with counselling", "bucket": 0}, {"text": "Family pays to have a relative picked up at night by force without any medical assessment", "bucket": 1}, {"text": "Treating depression and psychosis alongside the addiction", "bucket": 0}, {"text": "Refusing all medicines because 'medicine is another drug'", "bucket": 1, "why": "Denying effective medicines such as OST or relapse-prevention drugs harms patients."}, {"text": "Registered under the Mental Healthcare Act with qualified staff", "bucket": 0}]}
:::

:::clinician
### Detail
- **Dual diagnosis prevalence**: in schizophrenia, lifetime substance use disorder about 40% to 50% (excluding tobacco); in bipolar disorder about 40% to 60%; tobacco use 60% to 80% in schizophrenia. Integrated models: assertive community treatment with integrated dual-diagnosis treatment.
- **Medicine choice in dual diagnosis**: prefer SSRIs or mirtazapine over tricyclics; avoid benzodiazepines long-term; clozapine may reduce substance use in schizophrenia (observational data); lithium needs caution with dehydration and erratic intake; valproate with liver monitoring; naltrexone and acamprosate can be used with antipsychotics and mood stabilisers.
- **NDPS details**: Section 27 (consumption: up to 1 year for cocaine, morphine, heroin and specified drugs; up to 6 months for others); Section 64A (immunity for addicts volunteering for treatment, small quantity cases); Section 39 (court may release an addict for treatment instead of sentencing). Ganja and charas are prohibited centrally; bhang (leaves and seeds) is excluded from the NDPS definition of cannabis and regulated by state excise laws.
- **Mental Healthcare Act 2017**: Section 2(1)(s) defines mental illness to include "mental conditions associated with the abuse of alcohol and drugs"; supported admission (Section 89) requires assessment, and centres must be registered as mental health establishments. In 2022 to 2024, several High Courts and state authorities ordered inspections and closures of illegal de-addiction centres after deaths in custody.
- **Women and pregnancy**: alcohol in pregnancy carries risk of FASD at any level; methadone and buprenorphine are both acceptable in pregnancy (MOTHER trial, 2010: buprenorphine gave milder neonatal withdrawal); breastfeeding is generally encouraged on stable OST.
- **Older adults**: lower alcohol thresholds; benzodiazepines in the elderly raise falls and fracture risk; deprescribing with slow tapers.
:::

:::recall
1. What is integrated treatment in dual diagnosis? || One team treating both the substance use and the mental illness together.
2. What does Section 64A of the NDPS Act provide? || Immunity from prosecution for a person charged with small-quantity consumption who volunteers for treatment.
3. Name three parts of India's treatment system for substance use. || Government de-addiction centres, Drug Treatment Clinics with buprenorphine-naloxone, NACO OST centres, NGO rehabilitation centres, Punjab outpatient clinics.
4. Why should you check a private rehabilitation centre before recommending it? || Many are unregulated, hold people forcibly, use punishment and lack evidence-based treatment.
:::

:::mcq
Q: A man with schizophrenia uses cannabis daily. The community team wants to stop his antipsychotic until he is abstinent. The best response is:
- Agree
- *Continue treating his psychosis and offer integrated help for cannabis use
- Refer him to a residential centre that refuses medicines
- Discharge him
> Do not withhold treatment of the mental illness.

Q: Under the NDPS Act, a person charged with consuming a small quantity who volunteers for treatment may receive:
- An automatic prison sentence
- *Immunity from prosecution under Section 64A
- A fine only
- Compulsory admission for a year
> Section 64A.
:::

## 3.5 The frontier, as of Nov 2026 [core][advanced]
Addiction science is moving fast. At the Advanced level, you should be able to explain what is promising, what is proven, and what is hype.

### New medicines
- **GLP-1 medicines** (semaglutide, used for diabetes and obesity) reduce appetite, and seem to reduce the rewarding effects of alcohol and other substances. Randomised trials have now shown that semaglutide reduced heavy drinking in some groups (details in the Clinician view). They are not yet approved for addiction anywhere.
- **Psychedelic-assisted therapy**: small trials of psilocybin with psychotherapy for alcohol use disorder and smoking cessation have shown encouraging results; larger trials are under way. Not approved, and not something to try outside research.
- **New smoking-cessation medicines** such as cytisinicline are close to approval in some countries.

### New dangers
- **Synthetic opioids** such as **fentanyl** and the even stronger **nitazenes** have caused overdose epidemics in North America and parts of Europe. Contaminated supplies are a growing global risk.
- **Xylazine**, an animal sedative mixed into fentanyl in the US, causes severe skin wounds and does not respond to naloxone.
- **High-potency cannabis**: THC levels have risen steeply in many markets, increasing psychosis and dependence risks.
- **Vaping**: e-cigarettes are banned in India, but illegal sales to young people are widespread.
- **Online gambling and gaming**: rapid growth has led to new laws and treatment services.

:::widget sort
{"prompt": "How strong is the evidence, as of Nov 2026? Place each claim.", "buckets": ["Well supported", "Promising, not yet established", "Not supported"], "items": [{"text": "Opioid agonist treatment reduces deaths in opioid dependence", "bucket": 0}, {"text": "Semaglutide reduces heavy drinking in people with alcohol use disorder and obesity", "bucket": 1, "why": "A randomised trial showed benefit; replication and approval are pending."}, {"text": "Psilocybin therapy cures alcohol use disorder in one session", "bucket": 2}, {"text": "Contingency management reduces stimulant use", "bucket": 0}, {"text": "Naloxone reverses xylazine sedation", "bucket": 2, "why": "Xylazine is not an opioid; naloxone still treats the opioid component of mixed overdoses."}, {"text": "Psilocybin-assisted therapy may reduce drinking in alcohol use disorder", "bucket": 1}, {"text": "Forced detention in unregulated centres leads to lasting recovery", "bucket": 2}, {"text": "Varenicline helps people quit smoking", "bucket": 0}]}
:::

:::widget decide
{"scene": "A 40-year-old engineer in Bengaluru with alcohol use disorder and a BMI of 33 has read that 'weight-loss injections cure alcoholism'. He asks you to prescribe semaglutide for his drinking instead of naltrexone or acamprosate.", "ask": "How do you respond?", "choices": [{"label": "Prescribe semaglutide alone, telling him it is proven for alcohol", "verdict": "harm", "outcome": "He stops attending counselling, believing the injection will fix everything. His drinking continues.", "why": "Overstating early evidence is misleading. Semaglutide is not approved for alcohol use disorder, and established treatments exist."}, {"label": "Explain honestly what the trials show and what is still uncertain; recommend established relapse-prevention medicine and counselling; and, since he has obesity, discuss semaglutide for his weight with his physician, noting it may help his drinking too", "verdict": "best", "outcome": "He starts acamprosate and counselling. His physician later prescribes semaglutide for obesity. His drinking and weight both fall over the following months.", "why": "Evidence-based treatment first, honest framing of emerging research, and using a medicine for its approved indication where appropriate."}, {"label": "Dismiss the idea as internet nonsense", "verdict": "ok", "outcome": "He feels mocked and looks for the injection online.", "why": "The research is real, if early. Dismissing it damages trust."}]}
:::

:::clinician
### Evidence, as of Nov 2026
- **GLP-1 receptor agonists**: Hendershot et al. (JAMA Psychiatry, February 2025): 9 weeks of low-dose semaglutide (up to 1 mg weekly) in 48 non-treatment-seeking adults with AUD reduced laboratory alcohol self-administration, drinks per drinking day and craving, but not drinking days. A Danish 26-week RCT (The Lancet, April 2026; 108 adults with AUD and obesity, semaglutide 2.4 mg weekly) reduced heavy-drinking days by about 41 percentage points versus 26 with placebo, with greater weight loss; no post-treatment follow-up. Earlier exenatide trial (Klausen 2022) was negative overall but suggested benefit in obese participants. Large observational studies associate GLP-1 use with lower rates of alcohol- and opioid-related events. Not approved for any substance use disorder.
- **Psilocybin**: Bogenschutz et al. (JAMA Psychiatry 2022, 95 participants): two psilocybin sessions with psychotherapy reduced heavy-drinking days versus diphenhydramine over 32 weeks (about 9.7% versus 23.6% of days); blinding was difficult. Phase 2 and 3 trials in AUD and tobacco are ongoing.
- **Cytisinicline**: phase 3 ORCA-2 and ORCA-3 trials positive; the FDA issued a complete response letter in June 2026 citing third-party manufacturing and labelling issues, not efficacy or safety.
- **Synthetic opioids**: nitazenes (for example isotonitazene, metonitazene) are many times more potent than fentanyl; repeated naloxone doses may be needed. Xylazine ("tranq") causes sedation, bradycardia and necrotic wounds; naloxone does not reverse it but should still be given for co-occurring opioids. As of Nov 2026, fentanyl is not a major part of India's illicit market, but tramadol, pharmaceutical opioids and heroin of varying purity are.
- **Cannabis potency**: average THC in seized herbal cannabis and resin in Europe and the US has roughly doubled or more since the early 2000s; concentrates exceed 60% to 80% THC.
- **Long-acting injectable buprenorphine** (weekly or monthly) improves retention internationally; not yet available in India.
- **Digital therapeutics**: app-based CBT and contingency management (for example reSET) received FDA clearance in the late 2010s; evidence in India is limited.
:::

:::recall
1. What did a 2026 randomised trial find about semaglutide in alcohol use disorder with obesity? || It reduced heavy-drinking days more than placebo over about six months.
2. Why does naloxone not fully reverse an overdose involving xylazine? || Xylazine is not an opioid; naloxone reverses only the opioid component.
3. What are nitazenes? || Synthetic opioids many times more potent than fentanyl.
4. Is psilocybin approved for addiction as of Nov 2026? || No; early trials are encouraging, larger trials are ongoing.
:::

:::mcq
Q: Which statement about GLP-1 medicines and alcohol is accurate as of Nov 2026?
- They are approved for alcohol use disorder in India
- *Randomised trials show reduced heavy drinking in some groups, but they are not approved for addiction
- They have been shown to have no effect
- They replace all other treatments
> Promising, not yet established.

Q: A patient overdoses on heroin mixed with xylazine. After naloxone, breathing improves but he remains very sedated. This is because:
- Naloxone was given too late
- *Xylazine sedation is not reversed by naloxone
- He has Wernicke's encephalopathy
- He is in opioid withdrawal
> Support breathing and circulation; give naloxone for the opioid component.
:::

# Part IV · Exam zone

## 4.1 Long answers, short notes and viva [core]
### Long answer plans
**1. Describe the clinical features and management of alcohol withdrawal, including delirium tremens and Wernicke's encephalopathy.**
Neurobiology (GABA-A downregulation, NMDA upregulation) → timeline of uncomplicated withdrawal, seizures, hallucinosis and DTs → risk factors → assessment (CIWA-Ar, vital signs, bloods) → setting (community versus inpatient) → benzodiazepine regimens (fixed and symptom-triggered; lorazepam in liver disease) → thiamine (prophylaxis and treatment doses, before glucose) → Wernicke's (triad, Caine criteria, pathology) and Korsakoff's → electrolyte correction → treatment of DTs → follow-on relapse prevention.

**2. Discuss opioid dependence: clinical features, complications and management, with reference to India.**
Epidemiology in India (heroin, pharmaceutical opioids, injecting in the north-east and Punjab) → intoxication, overdose and withdrawal → complications (HIV, hepatitis, overdose, infections) → assessment (COWS, urine screen) → overdose management (naloxone, take-home naloxone) → withdrawal management → opioid agonist treatment (methadone, buprenorphine-naloxone; induction and dosing; evidence) → naltrexone → psychosocial treatment → Indian services (DTCs, NACO OST, Punjab) → NDPS and harm reduction.

**3. Motivational interviewing: principles and application.**
Ambivalence → spirit (partnership, acceptance, compassion, evocation) → OARS → change talk (DARN-CAT) and sustain talk → discord → four processes → stages of change → FRAMES brief intervention → evidence (Project MATCH, UKATT, CAP in Goa) → an example dialogue.

### Short notes to practise
CIWA-Ar · COWS · Korsakoff's syndrome · Disulfiram · Acamprosate versus naltrexone · Buprenorphine induction · Cannabis and psychosis · Stages of change · Gambling disorder · Smoking cessation in severe mental illness · NDPS Section 64A.

:::viva
Number of substance use disorder criteria? :: Eleven, in four groups.
Severity cut-offs? :: 2 to 3 mild, 4 to 5 moderate, 6 or more severe.
Onset of alcohol withdrawal? :: About 6 to 12 hours after the last drink.
Timing of withdrawal seizures? :: About 12 to 48 hours.
Timing of delirium tremens? :: About 48 to 96 hours, lasting around 3 days.
CIWA-Ar severe range? :: Above 15 (maximum 67).
COWS categories? :: 5 to 12 mild, 13 to 24 moderate, 25 to 36 moderately severe, above 36 severe.
Wernicke's triad? :: Confusion, ophthalmoplegia or nystagmus, ataxia.
Wernicke's treatment? :: High-dose IV thiamine (about 500 mg three times daily for 3 to 5 days) before glucose, with magnesium.
Korsakoff's core features? :: Anterograde amnesia and confabulation.
Opioid overdose triad? :: Coma, pinpoint pupils, respiratory depression.
Naloxone adult dose? :: 0.4 mg IV or IM, repeated every 2 to 3 minutes as needed.
Heroin withdrawal peak? :: About 32 to 72 hours.
Buprenorphine first dose rule? :: Only in clear withdrawal (COWS at least 8 to 12).
Methadone usual maintenance? :: About 60 to 120 mg daily.
Naltrexone dose for alcohol? :: 50 mg daily.
Acamprosate dose over 60 kg? :: 666 mg three times daily.
Disulfiram dose? :: 250 mg daily, at least 24 hours after the last drink.
Medicine for alcohol in liver disease? :: Acamprosate (also baclofen).
Drug level that rises after quitting smoking? :: Clozapine (also olanzapine).
Strongest evidence for stimulant use disorder? :: Contingency management.
MI skills? :: OARS: open questions, affirmations, reflections, summaries.
Stages of change? :: Precontemplation, contemplation, preparation, action, maintenance, relapse.
Gambling disorder threshold? :: Four of nine criteria in 12 months.
NDPS immunity for treatment seekers? :: Section 64A.
:::

:::recall
1. Outline the long answer on alcohol withdrawal in eight headings. || Neurobiology, timeline, risk factors, assessment, setting, benzodiazepines, thiamine and Wernicke's, DTs and follow-on care.
2. Name five short-note topics from this module. || CIWA-Ar, COWS, Korsakoff's, disulfiram, buprenorphine induction, cannabis and psychosis, stages of change, gambling disorder, NDPS 64A.
:::

## 4.2 Module test [core]
:::mcq
Q: Which group of substance use disorder criteria includes craving?
- Social impairment
- Risky use
- *Impaired control
- Pharmacological
> Craving sits with the control criteria.

Q: A man meets two criteria for cannabis use disorder in the past year. Severity is:
- *Mild
- Moderate
- Severe
- Not a disorder
> Two to three is mild.

Q: Which is the best single question to suggest alcohol dependence?
- 'Do you like beer?'
- *'Do you need a drink in the morning to steady your nerves?'
- 'Do you drink at weddings?'
- 'Which brand do you prefer?'
> Morning use suggests withdrawal relief.

Q: An Indian standard drink contains about:
- 1 g of alcohol
- *10 g of alcohol
- 30 g of alcohol
- 60 g of alcohol
> Ten grams.

Q: An AUDIT score of 9 suggests:
- No risk
- *Hazardous drinking, for which brief advice is appropriate
- Dependence
- Withdrawal
> 8 to 15 is hazardous.

Q: Alcohol withdrawal seizures typically occur:
- Within the first hour
- *About 12 to 48 hours after the last drink
- After two weeks
- Only during intoxication
> Peak around 24 hours.

Q: Which medicine should NOT be used alone for alcohol withdrawal agitation?
- Chlordiazepoxide
- Diazepam
- Lorazepam
- *Haloperidol
> Antipsychotics alone lower seizure threshold and do not treat withdrawal.

Q: In liver failure, which benzodiazepine is preferred for alcohol withdrawal?
- Chlordiazepoxide
- Diazepam
- *Lorazepam
- Clonazepam
> Short-acting, no active metabolites.

Q: Korsakoff's syndrome is characterised by:
- Visual hallucinations and fever
- *Anterograde amnesia and confabulation
- Tremor and sweating
- Pinpoint pupils
> Lasting memory loss after Wernicke's.

Q: Which sign is most typical of opioid intoxication?
- Dilated pupils
- *Pinpoint pupils
- High fever
- Hyperactivity
> Miosis.

Q: The main danger of opioid overdose is:
- Seizures
- *Respiratory depression
- Hyperthermia
- Liver failure
> Breathing stops.

Q: Why should people be observed for hours after naloxone?
- Naloxone causes addiction
- *Naloxone can wear off before the opioid, so overdose can return
- Naloxone causes seizures
- Naloxone lowers blood sugar
> Short duration of action.

Q: Buprenorphine given too early to someone using heroin may cause:
- Overdose
- *Precipitated withdrawal
- Seizures
- Wernicke's encephalopathy
> It displaces the full agonist.

Q: Which treatment roughly halves death rates in opioid dependence?
- Repeated detox
- Clonidine
- *Methadone or buprenorphine maintenance
- Residential rehabilitation without medicine
> Opioid agonist treatment.

Q: Which alcohol relapse-prevention medicine requires informed, supervised use because of a dangerous reaction with alcohol?
- Acamprosate
- Naltrexone
- *Disulfiram
- Baclofen
> Never give secretly.

Q: Acamprosate needs dose reduction in:
- Liver disease
- *Kidney disease
- Heart disease
- Pregnancy only
> Renally excreted.

Q: Daily use of high-potency cannabis increases the risk of:
- Opioid overdose
- *Psychotic disorder
- Wernicke's encephalopathy
- Delirium tremens
> Dose-related psychosis risk.

Q: Repeated severe vomiting relieved by hot showers in a daily cannabis user suggests:
- Opioid withdrawal
- *Cannabis hyperemesis syndrome
- Alcoholic gastritis
- Methanol poisoning
> Resolves with abstinence.

Q: Stopping smoking can cause toxicity from:
- Lithium
- *Clozapine
- Haloperidol
- Sertraline
> Loss of CYP1A2 induction raises clozapine levels.

Q: Which is NOT part of the spirit of motivational interviewing?
- Partnership
- Evocation
- Compassion
- *Confrontation
> MI avoids confrontation.

Q: 'I want to be there for my children' is an example of:
- Sustain talk
- *Change talk (desire)
- Discord
- Commitment only
> Desire to change.

Q: A person thinking about change but undecided is in which stage?
- Precontemplation
- *Contemplation
- Action
- Maintenance
> Ambivalence.

Q: The psychological treatment with the strongest evidence for stimulant use disorder is:
- Psychoanalysis
- *Contingency management
- Hypnosis
- Aversion therapy
> Rewards for negative tests.

Q: A woman with bipolar disorder and alcohol use disorder is best helped by:
- Treating alcohol first, then mood
- Treating mood first, then alcohol
- *Integrated treatment of both together
- Rehabilitation without medicines
> Integrated dual-diagnosis care.

Q: Section 64A of the NDPS Act provides:
- Death penalty for trafficking
- *Immunity from prosecution for small-quantity consumers who volunteer for treatment
- Licensing of bhang shops
- Compulsory detention
> Treatment over punishment.

Q: Which is a criterion for gambling disorder?
- Hearing voices
- *Chasing losses
- Withdrawal seizures
- Needing alcohol in the morning
> Gambling more to win back losses.

Q: As of Nov 2026, semaglutide for alcohol use disorder is best described as:
- Approved and first-line
- Shown to be useless
- *Promising in randomised trials but not approved
- Dangerous and banned
> Early but encouraging evidence.
:::
`;
