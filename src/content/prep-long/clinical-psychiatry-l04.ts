import type { LongQA } from "@/lib/prep/long-types";
import { brain, chain, compare, timeline, vis } from "./visual";

export const CLINICAL_PSYCHIATRY_L04: LongQA[] = [
  {
    id: "cpsy-l04-001",
    subject: "clinical-psychiatry",
    topic: "alcohol-withdrawal",
    marks: 15,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Describe the clinical features of the alcohol withdrawal syndrome and discuss the management of uncomplicated withdrawal and delirium tremens.",
    plan: ["Mechanism of withdrawal", "Timeline of features: minor withdrawal, seizures, hallucinosis, delirium tremens", "Assessment with CIWA-Ar and investigations", "Management of uncomplicated withdrawal", "Management of delirium tremens", "After detoxification and conclusion"],
    answer: `## Mechanism
Chronic alcohol use enhances GABA A inhibition and blocks NMDA glutamate receptors. The brain adapts by reducing GABA function and increasing glutamate receptors. When drinking stops, the brain is left over excited: noradrenaline and glutamate surge, producing autonomic hyperactivity, seizures and delirium. Repeated withdrawals make later ones worse (kindling).

## Clinical features and timeline
| Stage | Usual timing after last drink | Features |
| Minor withdrawal | 6 to 24 hours, peaks at 24 to 48 | Tremor, sweating, anxiety, nausea, vomiting, tachycardia, hypertension, insomnia, craving |
| Withdrawal seizures | 12 to 48 hours | Generalised tonic clonic, usually one or a few; may precede delirium tremens |
| Alcoholic hallucinosis | 12 to 48 hours | Mainly auditory (sometimes visual) hallucinations with a clear sensorium |
| Delirium tremens | 48 to 96 hours, lasts 3 to 5 days | Clouding of consciousness, disorientation, vivid visual (often Lilliputian) and tactile hallucinations, terror, marked tremor, fever, severe autonomic instability |
Delirium tremens carries a mortality of a few percent even with treatment, from arrhythmia, aspiration, infection and dehydration. Risk factors: previous delirium tremens or seizures, heavy prolonged drinking, older age, medical illness, low platelets, electrolyte imbalance.

## Assessment
- History: amount, pattern, time of last drink, past withdrawals, seizures, other substances (benzodiazepines, opioids).
- Clinical Institute Withdrawal Assessment for Alcohol, revised (CIWA-Ar): ten items (nausea, tremor, sweating, anxiety, agitation, tactile, auditory and visual disturbances, headache, orientation), maximum 67; under about 8 to 10 is mild, 10 to 15 moderate, over 15 severe.
- Examination for Wernicke signs, head injury, liver disease, infection, gastrointestinal bleeding.
- Investigations: blood count (macrocytosis, low platelets), liver tests (raised GGT, AST more than ALT), electrolytes including magnesium and phosphate, glucose, renal function, blood alcohol level, ECG.

## Management of uncomplicated withdrawal
- Setting: outpatient or home detoxification for mild cases with support and no complications; inpatient for severe dependence, past seizures or delirium tremens, medical or psychiatric comorbidity, or poor support.
- Benzodiazepines are the treatment of choice. Chlordiazepoxide is widely used in India: for example 20 to 30 mg four times a day on day one, reduced over five to seven days (fixed schedule), or given according to CIWA-Ar scores (symptom triggered), which uses less medicine. Diazepam is an alternative. In liver disease or old age, lorazepam or oxazepam are preferred because they do not depend on liver oxidation.
- Thiamine: parenteral thiamine for all inpatients and high risk patients, before glucose; oral thiamine afterwards.
- Fluids, nutrition, electrolyte correction (potassium, magnesium).
- A calm, well lit environment; reassurance.
- Avoid antipsychotics alone, as they lower the seizure threshold; haloperidol may be added for persistent hallucinations after benzodiazepine cover.
- Withdrawal seizures: benzodiazepines; phenytoin does not prevent them.

## Management of delirium tremens
- Medical emergency: admit to a high dependency or intensive care unit.
- Large doses of intravenous benzodiazepines (diazepam or lorazepam given every few minutes until the patient is calm but rousable).
- For benzodiazepine resistant cases, phenobarbital, propofol or dexmedetomidine in intensive care.
- High dose parenteral thiamine (treat as possible Wernicke encephalopathy).
- Treat fever, dehydration, electrolyte imbalance, hypoglycaemia, infection and other complications; monitor vital signs, oxygen and cardiac rhythm.
- Look for and treat complications: pneumonia, head injury, hepatic encephalopathy, pancreatitis.

## After detoxification
Detoxification is only the first step. Follow with motivational interviewing, relapse prevention, anti craving medicines (naltrexone, acamprosate) or disulfiram, family involvement, mutual help groups and treatment of comorbid depression and anxiety.

## Conclusion
Alcohol withdrawal ranges from mild tremor to life threatening delirium tremens. Benzodiazepines titrated to CIWA-Ar, thiamine before glucose, and careful medical care prevent complications, and detoxification must lead on to long term treatment.`,
    keyPoints: ["Neurobiology of GABA and glutamate rebound", "Timeline table of four stages", "Delirium tremens features and mortality", "CIWA-Ar items and cut offs", "Benzodiazepine regimens including lorazepam in liver disease", "Thiamine before glucose", "Delirium tremens in intensive care with escalation", "Follow on relapse prevention"],
    pitfalls: ["Using antipsychotics alone", "Forgetting thiamine or giving glucose first", "Ending care at detoxification"],
    visuals: [
      timeline("Order the withdrawal stages by onset", [["Tremor, sweating, anxiety", "6 to 24 hours"], ["Withdrawal seizures", "12 to 48 hours"], ["Alcoholic hallucinosis", "12 to 48 hours, clear sensorium"], ["Delirium tremens", "48 to 96 hours"]]),
      compare("Hallucinosis or delirium tremens?", ["Alcoholic hallucinosis", ["Clear consciousness", "Mainly voices", "Oriented", "Little autonomic change"], "Psychotic, not delirious"], ["Delirium tremens", ["Clouded consciousness", "Visual and tactile hallucinations", "Disoriented, terrified", "Fever, tachycardia, sweating"], "A medical emergency"]),
    ],
    module: "substance",
    ref: "Maudsley alcohol withdrawal; Sullivan 1989 CIWA-Ar; Mayo-Smith 2004 ASAM DT guideline; NICE CG100; Basu IPS guidelines alcohol",
  },
  {
    id: "cpsy-l04-002",
    subject: "clinical-psychiatry",
    topic: "alcohol-relapse-prevention",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the medicines and psychosocial treatments used to prevent relapse in alcohol dependence.",
    plan: ["Goals of treatment", "Medicines: disulfiram, naltrexone, acamprosate, baclofen, topiramate", "Psychosocial treatments", "Indian services and conclusion"],
    answer: `## Goals
Abstinence is the safest goal for people with alcohol dependence, especially with liver disease or psychiatric comorbidity. Reduced drinking is a reasonable intermediate goal for some. Treatment combines medicines that reduce craving or deter drinking with psychological and social support.

## Medicines
| Medicine | Action | Usual dose | Key points |
| Disulfiram | Blocks aldehyde dehydrogenase, so acetaldehyde builds up if alcohol is taken | 250 mg daily | Flushing, palpitations, nausea, hypotension with alcohol; works best when supervised by a family member; avoid in heart disease, psychosis, pregnancy; avoid alcohol in foods and medicines |
| Naltrexone | Opioid receptor antagonist; reduces reward from alcohol and heavy drinking | 50 mg daily | Avoid in people using or needing opioids and in liver failure; check liver tests |
| Acamprosate | Modulates glutamate (NMDA) activity; reduces craving after abstinence | 666 mg three times a day (lower if under 60 kg) | Start after detoxification; renal excretion, avoid in renal failure; diarrhoea |
| Baclofen | GABA B agonist | Variable | Option in liver disease; sedation, misuse |
| Topiramate | Glutamate and GABA effects | 75 to 300 mg | Off label; cognitive slowing |
Nalmefene, an opioid modulator, is used in some countries for reduced drinking. Medicines are usually continued for six to twelve months.

## Psychosocial treatments
- Motivational interviewing and motivational enhancement therapy: resolve ambivalence, build commitment.
- Cognitive behavioural relapse prevention (Marlatt): identify high risk situations (negative emotions, social pressure, conflict), coping skills, and handling lapses without the "abstinence violation effect" (one drink means total failure).
- Community reinforcement approach and contingency management.
- Family involvement: couples therapy, and CRAFT (community reinforcement and family training) to help families encourage treatment.
- Mutual help groups: Alcoholics Anonymous and its twelve steps.
- Treat comorbid depression, anxiety and sleep problems; address employment and housing.

## Indian services and context
De addiction centres in medical colleges, the National Drug Dependence Treatment Centre at AIIMS, NIMHANS and many NGO run centres provide care; the government's Nasha Mukt Bharat Abhiyaan, launched in 2020, focuses on high burden districts. Disulfiram is widely used in India because family supervision is common. Wives often bring husbands for treatment, and family counselling is central. Avoid unregulated "rehabilitation centres" that use coercion and restraint, which violate the MHCA 2017.

## Conclusion
Relapse prevention in alcohol dependence combines anti craving or deterrent medicines with motivational and cognitive behavioural therapy, family involvement and mutual help. Choice of medicine depends on goals, liver and kidney function, supervision and comorbidity.`,
    keyPoints: ["Abstinence versus reduced drinking goals", "Disulfiram mechanism, reaction and supervision", "Naltrexone dose and contraindications", "Acamprosate dose and renal caution", "Baclofen and topiramate", "MI, Marlatt relapse prevention and abstinence violation effect", "Family, AA and CRAFT", "Indian services including Nasha Mukt Bharat"],
    visuals: [chain("Marlatt's relapse model", [["High risk situation", "Stress, party, conflict"], ["Coping response?", "If none, confidence falls"], ["Positive expectations of drinking", ""], ["Lapse", "One drink"], ["Abstinence violation effect", "I have failed, so I may as well drink"], ["Relapse", "Prevented by planning for lapses"]])],
    module: "substance",
    ref: "Maudsley alcohol relapse prevention; Marlatt and Gordon 1985; Jonas 2014 JAMA meta-analysis; NICE CG115; Nasha Mukt Bharat Abhiyaan",
  },
  {
    id: "cpsy-l04-003",
    subject: "clinical-psychiatry",
    topic: "opioid-dependence",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Discuss the epidemiology and management of opioid dependence in India, with emphasis on opioid substitution therapy.",
    plan: ["Indian epidemiology and patterns", "Clinical features: intoxication, overdose, withdrawal", "Detoxification options", "Opioid substitution with buprenorphine and methadone", "Antagonist treatment, psychosocial care, harm reduction and law", "Conclusion"],
    answer: `## Epidemiology in India
The 2019 national survey on the magnitude of substance use found that about 2 percent of Indians aged 10 to 75 currently use opioids (heroin, pharmaceutical opioids and opium), and that about 0.5 percent (roughly 77 lakh people) need help for harmful use or dependence. Heroin use is concentrated in Punjab, Haryana, Delhi and the north eastern states (Manipur, Mizoram), where injecting is common and HIV and hepatitis C rates among people who inject drugs are high. Traditional opium (afeem, doda post) use persists in Rajasthan and Punjab, and pharmaceutical opioid misuse (tramadol, codeine syrups, buprenorphine injections) is widespread.

## Clinical features
- Intoxication: euphoria, sedation, pinpoint pupils, constipation, slowed breathing.
- Overdose: the triad of coma, pinpoint pupils and respiratory depression; treated with naloxone and airway support. Risk rises after loss of tolerance (after prison or detoxification) and with benzodiazepines or alcohol.
- Withdrawal: begins 6 to 12 hours after short acting opioids such as heroin, peaks at 24 to 72 hours: craving, yawning, lacrimation, rhinorrhoea, dilated pupils, gooseflesh, sweating, muscle aches, abdominal cramps, diarrhoea, vomiting, insomnia. Rated with the Clinical Opiate Withdrawal Scale (COWS). Distressing but rarely life threatening.

## Detoxification
- Buprenorphine tapered over one to three weeks.
- Clonidine or lofexidine (alpha 2 agonists) for autonomic symptoms, with symptomatic medicines for pain, diarrhoea and sleep.
- Detoxification alone has high relapse rates and raises overdose risk after tolerance falls, so it should lead into longer term treatment.

## Opioid substitution therapy (OST)
OST replaces short acting, often injected opioids with a long acting, legally prescribed opioid. It reduces illicit use, injecting, HIV and hepatitis transmission, crime and deaths, and improves social functioning.

| Feature | Buprenorphine | Methadone |
| Action | Partial mu agonist, kappa antagonist; high receptor affinity | Full mu agonist; also NMDA antagonist |
| Route | Sublingual tablets (also with naloxone) | Oral liquid |
| Usual dose | 8 to 24 mg a day | 60 to 120 mg a day |
| Safety | Ceiling effect on respiratory depression; safer in overdose | Risk of overdose in early weeks and with sedatives |
| Starting | Wait until moderate withdrawal (for example COWS 8 to 12 or more), else precipitated withdrawal | Start low, go slow because of long half life |
| Special risks | Diversion and injection of tablets | QTc prolongation, many drug interactions |
| Indian availability | Widely used through NACO OST centres and drug treatment clinics | Available at selected government centres |

Indian programmes: the National AIDS Control Organisation runs OST centres for people who inject drugs, and the Ministry of Health's Drug Treatment Clinic scheme (coordinated by AIIMS) offers buprenorphine in general hospitals. Take home doses are given as patients stabilise.

## Antagonist treatment
Naltrexone (oral, or long acting injection where available) blocks opioid effects. It suits highly motivated, opioid free patients (for example professionals or those under supervision), but adherence is often poor and overdose risk is high if it is stopped.

## Psychosocial care
Motivational interviewing, CBT, contingency management, family therapy, vocational support, Narcotics Anonymous, and treatment of depression, PTSD and other substance use. Screening and treatment for HIV, hepatitis B and C and tuberculosis.

## Harm reduction
Needle and syringe programmes, OST, naloxone distribution to users and families, safer injecting education and outreach through targeted interventions.

## Legal context
Opioids are controlled under the NDPS Act 1985. Section 64A gives immunity from prosecution to a person charged with consumption or small quantity possession who volunteers for treatment, and section 71 empowers the government to set up treatment centres. The MHCA 2017 includes substance use disorders within mental illness, giving rights to care and protection from cruel practices, which many unregulated "rehabilitation" centres violate.

## Conclusion
Opioid dependence is a major public health problem in parts of India. OST with buprenorphine or methadone is the most effective treatment and should be combined with psychosocial care, harm reduction and protection of rights.`,
    keyPoints: ["Indian prevalence and regional patterns", "Overdose triad and naloxone", "Withdrawal timing and COWS", "Detoxification limits and overdose risk", "Buprenorphine versus methadone table", "Precipitated withdrawal and induction rule", "NACO OST and Drug Treatment Clinic scheme", "NDPS sections 64A and 71 and harm reduction"],
    pitfalls: ["Treating detoxification as the cure", "Starting buprenorphine too early", "No mention of HIV and hepatitis"],
    visuals: [
      vis("receptor", { receptor: "mu opioid", caption: "Full agonist (heroin, methadone) versus partial agonist (buprenorphine) versus antagonist (naloxone, naltrexone)." }),
      vis("curve", { kind: "dose-response", title: "Why buprenorphine has a ceiling" }, "A partial agonist's effect levels off: respiratory depression stops rising at higher doses."),
    ],
    module: "substance",
    ref: "Ambekar 2019 Magnitude of Substance Use in India; Maudsley opioid chapter; WHO 2009 OST guidelines; NDPS Act 1985 s64A, s71; NACO OST guidelines; Stahl prescriber's guide buprenorphine",
  },
  {
    id: "cpsy-l04-004",
    subject: "clinical-psychiatry",
    topic: "cannabis",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Describe the psychiatric effects of cannabis and the management of cannabis use disorder.",
    plan: ["Pharmacology and use in India", "Acute effects and intoxication", "Withdrawal and use disorder", "Psychiatric complications: psychosis, cognition, mood, hyperemesis", "Management and conclusion"],
    answer: `## Pharmacology and use in India
Cannabis contains delta 9 tetrahydrocannabinol (THC), a partial agonist at CB1 receptors that produces the "high", and cannabidiol (CBD), which is not intoxicating and may oppose some THC effects. High potency forms have more THC and less CBD. In India, cannabis is used as bhang (leaves, often in drinks during Holi and Shivratri), ganja (flowering tops) and charas (resin). Under the NDPS Act, ganja and charas are prohibited, but bhang (leaves) is excluded and regulated by states. About 3 percent of Indians aged 10 to 75 used cannabis in the past year in the 2019 national survey.

## Acute effects and intoxication
Euphoria, relaxation, altered time perception, increased appetite, red eyes, dry mouth, tachycardia, impaired coordination and reaction time (risk while driving), and at higher doses anxiety, panic, paranoia, depersonalisation and transient psychotic symptoms. Edible forms act slowly, so people often take too much.

## Withdrawal and use disorder
About one in ten users, and more than one in six who start in adolescence, develop cannabis use disorder. Withdrawal, recognised in DSM-5, starts within a day or two of stopping heavy use and lasts one to two weeks: irritability, anxiety, insomnia and strange dreams, reduced appetite, restlessness, depressed mood and physical discomfort.

## Psychiatric complications
- Psychosis: cannabis can cause acute intoxication psychosis and cannabis induced psychotic disorder. Longitudinal studies (the Swedish conscripts and Dunedin cohorts) show that regular use, especially in adolescence, roughly doubles the risk of schizophrenia, and daily high potency use raises it about five times. Continued use in people with schizophrenia worsens relapse and outcome. About a third of people with cannabis induced psychosis later develop schizophrenia or bipolar disorder.
- Cognition: impaired attention and memory during use; heavy adolescent use is linked to lasting deficits and lower educational achievement.
- Mood and anxiety: associations with depression, suicidal ideas and anxiety; the "amotivational syndrome" is debated and may reflect chronic intoxication or depression.
- Cannabinoid hyperemesis syndrome: cyclical vomiting and abdominal pain in heavy users, relieved by hot showers; it resolves with abstinence.
- Mania can be triggered in bipolar disorder.

## Management
- Assessment of pattern, motivation, comorbidity and risk; urine screening if needed.
- Psychological treatments are the mainstay: motivational enhancement therapy, CBT and contingency management, often combined; family based approaches for adolescents (multidimensional family therapy).
- Psychoeducation about psychosis risk, especially for young people with a family history or early symptoms.
- No medicine is approved; gabapentin and N acetylcysteine (in adolescents) have small studies; treat withdrawal symptoms such as insomnia briefly.
- Treat comorbid psychosis, depression and anxiety, and encourage abstinence in people with psychotic illness.

## Conclusion
Cannabis is widely used and culturally familiar in India, but it causes dependence and raises the risk of psychosis, especially with early, heavy and high potency use. Psychological treatments are effective and medicines play little role.`,
    keyPoints: ["THC and CBD with CB1 receptor", "Bhang, ganja, charas and NDPS status", "Intoxication effects", "DSM-5 withdrawal features", "Psychosis risk figures from cohort studies", "Cognitive effects and hyperemesis syndrome", "MET, CBT and contingency management", "No approved medicines"],
    visuals: [brain("Where cannabis acts", { hippocampus: "Many CB1 receptors: memory problems", prefrontal: "Attention and planning slowed", "basal-ganglia": "Reward and movement timing", cerebellum: "Coordination and driving impaired", amygdala: "Anxiety and paranoia at high doses" })],
    module: "substance",
    ref: "Di Forti 2019 Lancet Psychiatry; Andreasson 1987; Meier 2012 Dunedin IQ; DSM-5-TR cannabis withdrawal; NDPS Act definition of cannabis",
  },
  {
    id: "cpsy-l04-005",
    subject: "clinical-psychiatry",
    topic: "nicotine",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the assessment and treatment of tobacco dependence, with reference to India.",
    plan: ["Tobacco use in India", "Pharmacology and dependence assessment", "Brief advice: 5 As and 5 Rs", "Medicines with evidence", "Special points in psychiatric patients, Indian programmes and conclusion"],
    answer: `## Tobacco use in India
The Global Adult Tobacco Survey 2016 to 17 found that about 29 percent of Indian adults use tobacco: about 21 percent smokeless tobacco (khaini, gutkha, zarda, betel quid with tobacco), about 11 percent smoking (bidis and cigarettes), and some both. India has one of the highest rates of oral cancer in the world. Tobacco causes over a million deaths a year in India.

## Pharmacology and dependence
Nicotine acts on alpha 4 beta 2 nicotinic acetylcholine receptors in the ventral tegmental area, releasing dopamine in the nucleus accumbens. Its short half life (about two hours) drives frequent use. Withdrawal includes irritability, anxiety, low mood, poor concentration, increased appetite, restlessness and craving.
Assessment: the Fagerstrom Test for Nicotine Dependence (time to first use after waking is the best single item; within five minutes indicates high dependence), the number used per day, past quit attempts and motivation.

## Brief advice
Every clinician should use the 5 As:
- Ask about tobacco use at every visit.
- Advise clearly and personally to quit.
- Assess willingness to quit.
- Assist with a quit plan, counselling and medicines.
- Arrange follow up.
For those not ready, the 5 Rs: relevance, risks, rewards, roadblocks and repetition. Even brief advice of a few minutes increases quit rates.

## Medicines
| Medicine | Notes |
| Nicotine replacement therapy | Patch with gum or lozenge combined works best; available in India |
| Bupropion | 150 mg daily for 3 days, then twice daily; start one to two weeks before quitting; avoid with seizure risk and eating disorders |
| Varenicline | Partial agonist at alpha 4 beta 2 receptors; the most effective single medicine; nausea and vivid dreams; a large safety trial (EAGLES) found no significant increase in neuropsychiatric events, including in people with mental illness |
| Cytisine | A related, low cost plant derived partial agonist with good evidence |
Treatment usually lasts 8 to 12 weeks, combined with behavioural support.

## Psychiatric patients
People with schizophrenia, bipolar disorder, depression and substance use smoke much more and die earlier, partly due to tobacco. Smoking induces the liver enzyme CYP1A2, so stopping can raise clozapine and olanzapine levels sharply; reduce doses and monitor levels when patients quit (nicotine replacement does not induce the enzyme, as the effect comes from tobacco smoke).

## Indian programmes and law
- The Cigarettes and Other Tobacco Products Act (COTPA) 2003 bans smoking in public places, advertising, and sale to minors and near schools.
- The National Tobacco Control Programme (from 2007 to 08) supports tobacco cessation centres in districts and medical colleges.
- The national quitline (1800 11 2356) and the mCessation text message programme.
- Electronic cigarettes were banned in 2019.
- Smokeless tobacco cessation needs special attention, as it is often not seen as harmful.

## Conclusion
Tobacco dependence is a chronic relapsing condition. Brief advice for all, behavioural support and effective medicines (varenicline, combined NRT, bupropion) markedly increase quit rates, and psychiatric patients deserve particular priority.`,
    keyPoints: ["GATS 2 figures and smokeless tobacco", "Nicotinic receptor and dopamine", "Fagerstrom test", "5 As and 5 Rs", "NRT, bupropion and varenicline with key points", "EAGLES safety finding", "CYP1A2 and clozapine levels on quitting", "COTPA, quitline and e cigarette ban"],
    visuals: [chain("The 5 As", [["Ask", "Every visit"], ["Advise", "Clear and personal"], ["Assess", "Ready to quit?"], ["Assist", "Plan, counselling, medicine"], ["Arrange", "Follow up"]])],
    module: "substance",
    ref: "GATS-2 India 2017; Anthenelli 2016 EAGLES; Fiore 2008 USPHS guideline; COTPA 2003; PECA 2019; Maudsley smoking and CYP1A2",
  },
  {
    id: "cpsy-l04-006",
    subject: "clinical-psychiatry",
    topic: "gambling",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Discuss gambling disorder and gaming disorder as behavioural addictions.",
    plan: ["Concept of behavioural addiction", "Gambling disorder criteria and features", "Gaming disorder in ICD-11 and DSM-5-TR", "Mechanisms", "Assessment, treatment and Indian context", "Conclusion"],
    answer: `## Behavioural addictions
Behavioural addictions are repetitive, rewarding behaviours that become compulsive and harmful despite negative consequences, with loss of control, craving, tolerance like escalation and withdrawal like irritability. DSM-5 moved gambling disorder into the substance related and addictive disorders chapter because it shares brain mechanisms, comorbidity and treatment response with substance use.

## Gambling disorder
DSM-5-TR requires persistent problem gambling causing distress or impairment, with four or more of nine features in twelve months:
- Needs to gamble with increasing amounts to get excitement.
- Restless or irritable when cutting down.
- Repeated failed efforts to control.
- Preoccupation with gambling.
- Gambles when distressed.
- "Chasing losses": returning to win back money.
- Lies to hide gambling.
- Jeopardises relationships, jobs or education.
- Relies on others for money to relieve financial crises.
Severity: mild 4 to 5, moderate 6 to 7, severe 8 to 9. Lifetime prevalence is about 0.5 to 1 percent. Comorbid depression, alcohol use, ADHD and suicide risk are high.

## Gaming disorder
- ICD-11 gaming disorder: a pattern of digital or video gaming with impaired control, increasing priority over other interests and activities, and continuation despite harm, usually over at least twelve months, with significant impairment.
- DSM-5-TR lists internet gaming disorder only as a condition for further study (five of nine criteria).
- The concept is debated: critics worry about pathologising a common hobby, and many heavy gamers are not impaired.

## Mechanisms
- Variable ratio reinforcement (rewards that come unpredictably) produces strong, extinction resistant behaviour, as in slot machines and "loot boxes".
- Near misses and the illusion of control keep people playing.
- Cognitive distortions: the gambler's fallacy ("a win is due"), selective memory for wins.
- Dopamine release in the reward circuit during uncertain reward.
- Escape from negative emotions, loneliness and stress; in gaming, social belonging and achievement.

## Assessment
History of time, money, debts, legal issues and impact; screening tools such as the South Oaks Gambling Screen and the Problem Gambling Severity Index; screening for depression, suicide and substance use.

## Treatment
- CBT: correcting distortions, managing urges, problem solving, relapse prevention.
- Motivational interviewing.
- Practical steps: handing over control of money, self exclusion from betting sites and apps, blocking software, debt counselling.
- Family therapy, especially for adolescents with gaming disorder; structured daily routines and screen limits.
- Gamblers Anonymous.
- Medicines: naltrexone has some evidence for gambling urges; treat comorbid ADHD and depression.

## Indian context
Online betting, fantasy sports and "real money" games grew rapidly in India, with reports of debts and suicides among young people. In 2025 Parliament passed a law to ban online real money games and to promote e-sports and social games. NIMHANS runs the SHUT clinic (Service for Healthy Use of Technology), the first specialist clinic for technology addictions in India.

## Conclusion
Gambling disorder is an established addiction, and gaming disorder is recognised in ICD-11. Both rely on powerful reinforcement schedules and respond to CBT, motivational work, financial and access controls and family support.`,
    keyPoints: ["Concept and move to addictions chapter", "Nine gambling criteria with four needed", "Chasing losses", "ICD-11 gaming disorder three features", "DSM-5-TR further study status and debate", "Variable ratio reinforcement and near misses", "CBT, self exclusion and naltrexone", "Indian online gaming law and SHUT clinic"],
    visuals: [vis("conditioning", { kind: "operant", caption: "Try the variable ratio schedule, then extinction: why does unpredictable reward keep people playing?" })],
    module: "substance",
    ref: "DSM-5-TR gambling disorder; ICD-11 6C51 gaming disorder; Potenza; Sharma NIMHANS SHUT clinic; Promotion and Regulation of Online Gaming Act 2025",
  },
  {
    id: "cpsy-l04-007",
    subject: "clinical-psychiatry",
    topic: "inhalant",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on inhalant use among children and adolescents in India.",
    plan: ["What inhalants are", "Who uses them in India", "Effects and complications", "Management and prevention"],
    answer: `## What inhalants are
Inhalants are volatile substances inhaled for their intoxicating effect: correction fluid ("whitener"), glue, petrol, paint thinner, nail polish remover, aerosols and butane. They contain solvents such as toluene, n hexane and trichloroethane. They are cheap, legal and easily available.

## Who uses them
In the 2019 national survey, inhalants were the only substance group used more by children and adolescents than by adults, with about 1 percent of 10 to 17 year olds reporting current use. Use is highest among street children, children who work, school dropouts and children in shelters, often starting at age 8 to 12 to cope with hunger, cold and abuse.

## Effects and complications
- Acute: rapid euphoria like alcohol intoxication, dizziness, slurred speech, ataxia, hallucinations, then drowsiness and headache.
- Sudden sniffing death: cardiac arrhythmia, especially with exertion or fright after inhalation; also asphyxia and suffocation from bags.
- Chronic: cerebellar damage and ataxia, white matter damage (toluene leucoencephalopathy) with cognitive decline, peripheral neuropathy (n hexane), hearing loss, liver and kidney damage, bone marrow suppression (benzene).
- Psychiatric: inhalant use disorder, psychosis, depression, school failure and progression to other drugs.

## Management
- Engage through outreach and child friendly services; address shelter, food and safety.
- Medical assessment of neurological, liver and kidney damage.
- Motivational and family based approaches, life skills, education and vocational training.
- Treat comorbid depression, ADHD and trauma.
- Child protection under the Juvenile Justice Act 2015; section 77 makes giving intoxicating substances to a child an offence.

## Prevention
Restrictions on sale of whitener and glue to children, school programmes, and support for vulnerable children.

## Conclusion
Inhalant use is a serious, often hidden problem of vulnerable Indian children, with risks of sudden death and lasting brain damage; it needs both treatment and social protection.`,
    keyPoints: ["Common inhalants and solvents", "Higher use in children in India", "Street and working children", "Sudden sniffing death", "Toluene and n hexane damage", "Psychosocial treatment and child protection under JJ Act"],
    module: "substance",
    ref: "Ambekar 2019 national survey; Dhawan inhalant studies NDDTC; JJ Act 2015 s77",
  },
  {
    id: "cpsy-l04-008",
    subject: "clinical-psychiatry",
    topic: "dual-diagnosis",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on dual diagnosis.",
    plan: ["Definition and prevalence", "Models of association", "Problems in care", "Integrated treatment"],
    answer: `## Definition and prevalence
Dual diagnosis refers to the co-occurrence of a substance use disorder and another mental disorder in the same person. About half of people with schizophrenia have a lifetime substance use disorder (most often tobacco, alcohol and cannabis), and rates are high in bipolar disorder, depression, PTSD, ADHD and personality disorders.

## Models of association
- Self medication: substances are used to relieve symptoms or side effects (alcohol for anxiety, cannabis for distress).
- Substance induced disorder: the substance causes the psychiatric illness (stimulant psychosis, alcohol induced depression).
- Common factor: shared genetic or environmental risks (childhood trauma, impulsivity).
- Bidirectional: each worsens the other.

## Problems in care
- Diagnostic difficulty: intoxication and withdrawal mimic psychiatric disorders; waiting two to four weeks of abstinence helps clarify.
- Poor adherence, more relapse, violence, suicide, homelessness, HIV and hepatitis.
- Services often split, with addiction and mental health teams each sending the patient elsewhere.

## Integrated treatment
- One team treats both conditions at the same time.
- Stage wise approach: engagement, persuasion (motivational interviewing), active treatment and relapse prevention.
- Choose medicines that suit both (clozapine may reduce substance use in schizophrenia; avoid benzodiazepines in long term care).
- Psychoeducation, family support, contingency management, housing and employment support.

## Conclusion
Dual diagnosis is common and has worse outcomes; integrated, motivational, long term care works best.`,
    keyPoints: ["Definition", "High rates in schizophrenia and others", "Four models", "Diagnostic difficulty and abstinence period", "Problems of split services", "Integrated stage wise treatment"],
    module: "substance",
    ref: "Drake integrated treatment; Mueser 2003; Maudsley dual diagnosis",
  },
  {
    id: "cpsy-l04-009",
    subject: "clinical-psychiatry",
    topic: "harm-reduction",
    marks: 5,
    difficulty: 1,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on harm reduction in substance use.",
    plan: ["Definition and principles", "Examples", "Evidence", "Indian programmes and debate"],
    answer: `## Definition and principles
Harm reduction is a set of policies and practices that aim to reduce the health, social and economic harms of substance use without requiring abstinence first. Its principles are pragmatism (drug use exists), meeting people where they are, respect and non judgement, involvement of users, and focus on immediate, achievable goals.

## Examples
- Needle and syringe programmes to prevent HIV and hepatitis C.
- Opioid substitution therapy with buprenorphine or methadone.
- Naloxone distribution to users and families to reverse overdose.
- Safer drinking advice, designated drivers and drink driving laws.
- Testing for HIV and hepatitis and linkage to treatment.
- Supervised consumption sites in some countries.
- Nicotine replacement and less harmful products for those who cannot quit.

## Evidence
Needle and syringe programmes and OST reduce HIV transmission, overdose deaths and crime, and do not increase drug use. Naloxone programmes save lives.

## Indian programmes
The National AIDS Control Organisation runs targeted interventions for people who inject drugs, with needle and syringe exchange, OST centres, condoms and HIV testing, especially in the north east and Punjab. NGOs provide outreach and drop in centres. Section 64A of the NDPS Act supports treatment rather than punishment for those who volunteer.

## Debate
Critics argue that harm reduction "condones" drug use; supporters reply that dead people cannot recover, and harm reduction often leads to treatment. Most international bodies, including WHO and UNAIDS, endorse it.

## Conclusion
Harm reduction is an evidence based public health approach that saves lives and builds bridges to treatment.`,
    keyPoints: ["Definition", "Principles", "At least five examples", "Evidence on HIV and overdose", "NACO targeted interventions", "Debate"],
    module: "substance",
    ref: "WHO UNODC UNAIDS technical guide; NACO targeted interventions; NDPS s64A",
  },
  {
    id: "cpsy-l04-010",
    subject: "clinical-psychiatry",
    topic: "urine-testing",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry"],
    question: "Write short notes on urine drug testing in psychiatric practice.",
    plan: ["Uses", "Methods: screening and confirmation", "Detection windows", "False results, tampering and ethics"],
    answer: `## Uses
Diagnosis of substance induced presentations (first episode psychosis, delirium, emergencies), monitoring abstinence and adherence in treatment (for example on buprenorphine), contingency management, and medico legal settings.

## Methods
- Screening by immunoassay: quick and cheap, but less specific.
- Confirmation by gas or liquid chromatography with mass spectrometry: specific and quantitative, used when results matter legally or are disputed.

## Approximate detection windows in urine
| Substance | Window |
| Alcohol | Hours; ethyl glucuronide up to about 80 hours |
| Amphetamines | 2 to 3 days |
| Cocaine (benzoylecgonine) | 2 to 4 days |
| Opioids (heroin, morphine, codeine) | 1 to 3 days |
| Cannabis | About 3 days after single use; up to a month or more with daily heavy use |
| Benzodiazepines | 3 days to several weeks for long acting drugs |
Buprenorphine, fentanyl, tramadol and many synthetic opioids need specific tests and may be missed by standard opiate screens.

## False results and tampering
- False positives on immunoassay: poppy seeds (opiates), quetiapine (tricyclics and methadone), sertraline (benzodiazepines), some cold remedies and labetalol (amphetamines).
- False negatives: dilution, recent use not yet detectable, drugs not covered by the panel.
- Tampering: dilution or substitution, detected by low creatinine and specific gravity, abnormal temperature or pH; supervised collection helps.

## Ethics
Explain the purpose and obtain consent; use results to help, not punish; keep confidentiality under the MHCA 2017; interpret results with history and clinical findings.

## Conclusion
Urine testing is a useful adjunct to clinical assessment when its methods, windows and limits are understood.`,
    keyPoints: ["Clinical uses", "Immunoassay screen and mass spectrometry confirmation", "Detection windows table", "Opioids missed by standard screens", "False positives with examples", "Tampering checks and consent"],
    module: "substance",
    ref: "Moeller 2017 Mayo urine drug testing review; SAMHSA TIP; Maudsley drug screening",
  },
];
