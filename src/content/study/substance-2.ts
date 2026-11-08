/* Module · Substance use and addictive disorders, Part II (Beginner level). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part II · Beginner: the diagnoses, substance by substance

## 2.1 The eleven criteria, intoxication and withdrawal [core][beginner]
DSM-5-TR uses the same **eleven criteria** for almost every substance. They fall into **four groups**, which makes them easy to remember.

| Group | Criteria |
|---|---|
| **Impaired control** | 1. Taking more, or for longer, than intended. 2. Wanting to cut down, or failed attempts. 3. A lot of time spent getting, using or recovering. 4. Craving |
| **Social impairment** | 5. Failing at major roles (work, school, home). 6. Continuing despite social or relationship problems caused by use. 7. Giving up important activities |
| **Risky use** | 8. Use in physically dangerous situations (driving, machinery). 9. Continuing despite knowing it causes or worsens a physical or mental problem |
| **Pharmacological** | 10. Tolerance. 11. Withdrawal |

**Severity** depends on the number of criteria met in the same year: **2 to 3 mild, 4 to 5 moderate, 6 or more severe**.

:::trap Tolerance and withdrawal alone are not addiction
A patient taking prescribed morphine for cancer pain, or a benzodiazepine as prescribed, may develop tolerance and withdrawal. These two criteria are **not counted** when the medicine is taken as prescribed under medical supervision. Physical dependence is not the same as addiction.
:::

:::widget build
{"vignette": "Harish, 42, a bank manager in Kanpur, drinks most evenings. Over the past year he has often meant to have 'two pegs' and finished the bottle. He promised his wife twice to stop and lasted three days each time. He now needs about twice as much whisky to feel relaxed as he did a few years ago. He has missed work several Mondays and received a warning. His wife has moved to her parents' house over his drinking, but he continues. He has stopped going to his Sunday badminton. He has not driven after drinking and his doctor has not found any health problems. He denies morning shakes or sweats. He sometimes thinks about drinking for much of the afternoon.", "rule": "Tick every criterion present in the past year. Two to three is mild, four to five moderate, six or more severe.", "symptoms": [{"label": "More or longer than intended", "present": true, "why": "'Two pegs' becomes the whole bottle."}, {"label": "Wants to cut down or has failed attempts", "present": true, "why": "Two failed attempts."}, {"label": "A lot of time spent on use", "present": false, "why": "Not described beyond evenings; ask."}, {"label": "Craving", "present": true, "why": "Thinks about drinking for much of the afternoon."}, {"label": "Failing at major roles", "present": true, "why": "Missed work, warning."}, {"label": "Continues despite social problems", "present": true, "why": "Wife has left; he keeps drinking."}, {"label": "Gives up important activities", "present": true, "why": "Stopped badminton."}, {"label": "Use in hazardous situations", "present": false, "why": "No drink-driving reported."}, {"label": "Continues despite physical or mental harm", "present": false, "why": "No known health problem."}, {"label": "Tolerance", "present": true, "why": "Needs twice as much."}, {"label": "Withdrawal", "present": false, "why": "Denies morning symptoms; still check carefully."}], "need": 6, "needCore": false, "verdict": "Seven criteria: alcohol use disorder, severe. Even without withdrawal, loss of control, role failure and continued use despite harm make this severe. Next: assess physical health (liver, blood pressure), mood, suicide risk and motivation, and plan treatment."}
:::

:::widget flow
{"title": "The eleven criteria in four groups", "layout": "tree", "nodes": [{"id": "r", "label": "Substance use disorder", "detail": "Two or more of eleven criteria within a year. 2 to 3 mild, 4 to 5 moderate, 6 or more severe."}, {"id": "c", "label": "Impaired control", "detail": "More or longer than intended; failed attempts to cut down; much time spent; craving.", "parent": "r"}, {"id": "s", "label": "Social impairment", "detail": "Failing at major roles; continuing despite social problems; giving up activities.", "parent": "r"}, {"id": "k", "label": "Risky use", "detail": "Use in dangerous situations; continuing despite physical or mental harm.", "parent": "r"}, {"id": "p", "label": "Pharmacological", "detail": "Tolerance; withdrawal. Not counted for medicines taken as prescribed.", "parent": "r"}], "caption": "Learn the groups first; the eleven criteria then follow naturally."}
:::

### Intoxication and withdrawal
Each substance also has its own **intoxication** syndrome (the effects of taking too much) and, for many, a **withdrawal** syndrome (what happens on stopping). These are diagnosed separately from the use disorder.

| Substance | Intoxication: key signs | Withdrawal: key signs |
|---|---|---|
| Alcohol | Slurred speech, unsteadiness, poor judgement, nystagmus, memory blackouts, coma | Tremor, sweating, fast pulse, anxiety, insomnia, nausea; seizures; delirium tremens |
| Opioids | Pinpoint pupils, drowsiness, slow breathing, constipation | Dilated pupils, runny nose, tears, yawning, goosebumps, aches, cramps, diarrhoea |
| Cannabis | Red eyes, hunger, dry mouth, fast pulse, slowed time, anxiety or paranoia | Irritability, anxiety, poor sleep and strange dreams, reduced appetite, restlessness, low mood |
| Stimulants | Dilated pupils, fast pulse, high blood pressure, sweating, agitation, paranoia, high temperature | "Crash": exhaustion, oversleeping, increased appetite, low mood, craving |
| Sedatives | Like alcohol: slurred speech, unsteadiness, drowsiness | Like alcohol: tremor, anxiety, insomnia, seizures, delirium |
| Nicotine | (Mild) nausea, dizziness in new users | Irritability, anxiety, poor concentration, hunger, restlessness, low mood |

:::widget sort
{"prompt": "Intoxication or withdrawal? Place each patient (think of the substance).", "buckets": ["Intoxication", "Withdrawal"], "items": [{"text": "Heroin user with pinpoint pupils, very slow breathing, hard to wake", "bucket": 0}, {"text": "Heroin user with wide pupils, runny nose, yawning and cramps", "bucket": 1}, {"text": "Drinker with tremor, sweating and a seizure two days after admission for a fracture", "bucket": 1}, {"text": "Young man after a party with dilated pupils, chest pain, a temperature of 40 degrees and paranoia", "bucket": 0, "why": "Stimulant intoxication can cause dangerous overheating and heart problems."}, {"text": "Cannabis smoker with red eyes, laughing, and eating a whole packet of biscuits", "bucket": 0}, {"text": "Daily ganja user who stopped a few days ago, now irritable, sleepless, with vivid dreams", "bucket": 1}]}
:::

:::clinician
### Criteria details
- **Time frame**: at least 2 criteria within 12 months. **Remission**: early (3 to under 12 months with no criteria except craving), sustained (12 months or more, craving allowed). Specifiers: "in a controlled environment", "on maintenance therapy" (for opioid and tobacco use disorders).
- **Exceptions**: tolerance and withdrawal not counted for medicines used appropriately under supervision (opioids, sedatives, stimulants). No withdrawal criterion for hallucinogens and inhalants (DSM-5-TR does not define withdrawal syndromes for them).
- **ICD-11 dependence**: two of three features (impaired control; increasing precedence; physiological features) over 12 months, or 1 month if continuous. ICD-11 also has "harmful pattern of use" and "episode of harmful use" for single damaging episodes.
- **Substance-induced mental disorders**: depressive, anxiety, psychotic, bipolar, sleep, sexual and neurocognitive disorders can be substance-induced if they develop during or soon after intoxication or withdrawal and the substance can produce them. Persistence beyond about one month of abstinence suggests an independent disorder.
- **Polysubstance use** is the norm in many settings: always ask about every class, and about combinations (alcohol with benzodiazepines or opioids raises overdose risk sharply).
:::

:::recall
1. Name the four groups of substance use disorder criteria. || Impaired control, social impairment, risky use, pharmacological.
2. What are the severity cut-offs? || 2 to 3 mild, 4 to 5 moderate, 6 or more severe.
3. When are tolerance and withdrawal not counted? || When a medicine is taken as prescribed under medical supervision.
4. Name four signs of opioid withdrawal. || Dilated pupils, runny nose and tears, yawning, goosebumps, aches, cramps, diarrhoea.
5. What is a stimulant "crash"? || Withdrawal after stimulants: exhaustion, oversleeping, hunger, low mood and craving.
:::

:::mcq
Q: A woman takes prescribed morphine for cancer pain and needs higher doses over time; she has withdrawal if a dose is late. She uses it exactly as prescribed. Which is correct?
- She has severe opioid use disorder
- *Tolerance and withdrawal are not counted for medicine used as prescribed, so she does not meet criteria on these alone
- She has mild opioid use disorder
- She should stop morphine at once
> Physical dependence is not addiction.

Q: A man meets four of the eleven criteria for alcohol use disorder in the past year. Severity is:
- Mild
- *Moderate
- Severe
- Not a disorder
> Four to five is moderate.
:::

## 2.2 Alcohol: the body, the mind and brief help [core][beginner]
Alcohol touches nearly every organ. Many people with alcohol problems first come to doctors with a physical complaint, an injury or a family crisis, not asking for help with drinking.

### What alcohol does to the body
- **Liver**: fatty liver (reversible), alcoholic hepatitis, cirrhosis and liver cancer.
- **Gut**: gastritis, ulcers, pancreatitis, bleeding from varices.
- **Heart and blood**: high blood pressure, irregular heartbeat, cardiomyopathy, anaemia, large red cells.
- **Brain and nerves**: blackouts, Wernicke's encephalopathy and Korsakoff's syndrome, cerebellar damage (unsteady walking), peripheral neuropathy, dementia, seizures.
- **Cancer**: mouth, throat, oesophagus, liver, bowel and breast.
- **Pregnancy**: fetal alcohol spectrum disorder.
- **Injuries**: road accidents, falls, burns, violence, drowning.

### What alcohol does to the mind and the family
- **Depression and anxiety** (often caused or worsened by drinking, and improving with abstinence).
- **Suicide**: alcohol is involved in a large share of suicides, through intoxication, depression and impulsivity.
- **Alcohol-related psychosis**: hallucinations (often voices) during or after heavy drinking, with clear consciousness (alcoholic hallucinosis).
- **Morbid jealousy**: a delusion that the partner is unfaithful, sometimes leading to violence.
- **Domestic violence, debt, child neglect** and the family's own exhaustion and depression.

:::widget decide
{"scene": "Mr Singh, 50, a farmer from Bathinda, is admitted to a medical ward with vomiting blood. He drinks country liquor daily. The physician has stabilised him. On the second day he becomes restless and sweaty. His wife says, 'He promises to stop every year. Please, doctor, give him something.'", "ask": "What are your priorities?", "choices": [{"label": "Assess and treat alcohol withdrawal now (using a withdrawal scale and a benzodiazepine regimen), give parenteral thiamine, and once he is settled, talk with him and his wife about his drinking and next steps", "verdict": "best", "outcome": "His withdrawal is controlled without fits or delirium. After a few days, he agrees to start a relapse-prevention medicine and attend follow-up with his wife.", "why": "On medical wards, withdrawal often starts on the second day. Treating it safely, protecting the brain with thiamine, and using the crisis as a moment for change is good practice."}, {"label": "Give haloperidol for his restlessness", "verdict": "harm", "outcome": "He has a seizure that night and becomes delirious.", "why": "Antipsychotics alone lower the seizure threshold and do not treat alcohol withdrawal. Benzodiazepines are the first-line treatment."}, {"label": "Discharge him once the bleeding stops, with advice to drink less", "verdict": "harm", "outcome": "He develops delirium tremens at home and is readmitted to intensive care.", "why": "Withdrawal is just beginning. Discharge at this stage is dangerous."}]}
:::

:::widget journey
{"drug": "alcohol (ethanol)", "target": "GABA-A receptors (enhanced) and NMDA glutamate receptors (blocked), with release of endorphins and dopamine", "routes": ["oral"], "notes": {"gut": "Alcohol is absorbed quickly from the stomach and small intestine, faster on an empty stomach and with fizzy drinks.", "liver": "The liver breaks down roughly one standard drink an hour, using alcohol dehydrogenase and then aldehyde dehydrogenase. Toxic acetaldehyde builds up if the second step is blocked (disulfiram) or slow (some East Asian genetic variants).", "out": "The liver cannot be sped up: coffee, cold showers and food do not sober a person faster."}, "caption": "Follow a drink through the body. The fixed speed of the liver explains why heavy drinking builds up blood levels so quickly."}
:::

:::widget guess
{"prompt": "How many standard drinks of alcohol can an average adult liver clear in one hour?", "min": 0, "max": 6, "step": 0.5, "unit": "drinks", "answer": [1, 1], "reveal": "About one standard drink an hour, and nothing speeds it up: not coffee, a cold shower or sleep. Five pegs at a late party can still leave someone over the driving limit the next morning."}
:::

### Brief intervention: five to fifteen minutes that help
Many people with risky or harmful drinking do not need a specialist. A short, structured talk by a doctor, nurse or counsellor reduces drinking. The **FRAMES** approach is a guide:
- **F**eedback on their drinking and its risks (for example AUDIT score, liver tests).
- **R**esponsibility: the choice is theirs.
- **A**dvice: a clear recommendation to cut down or stop.
- **M**enu of options: ways to cut down, goals, support.
- **E**mpathy: warm, non-judgemental.
- **S**elf-efficacy: belief that they can change.

:::widget sort
{"prompt": "Which FRAMES element is each sentence?", "buckets": ["Feedback", "Responsibility", "Advice", "Menu", "Empathy", "Self-efficacy"], "items": [{"text": "'Your liver test is raised, and your AUDIT score puts you in the harmful range.'", "bucket": 0}, {"text": "'It's your decision what you do with this information.'", "bucket": 1}, {"text": "'As your doctor, I'd recommend cutting down to no more than two drinks on any day, with drink-free days.'", "bucket": 2}, {"text": "'Some people set drink-free days, some switch to smaller pegs, some stop completely for a month. What might suit you?'", "bucket": 3}, {"text": "'It sounds like work has been very stressful, and drinking is how you unwind.'", "bucket": 4}, {"text": "'You stopped smoking two years ago; you know how to make a hard change.'", "bucket": 5}]}
:::

:::clinician
### Physical assessment and evidence
- **Examination**: jaundice, spider naevi, palmar erythema, gynaecomastia, hepatomegaly, ascites, tremor, nystagmus, ataxia, neuropathy, Dupuytren's contracture, parotid enlargement.
- **Investigations**: full blood count (MCV, platelets), liver function (GGT, AST:ALT above 2 suggests alcoholic liver disease), INR and albumin (synthetic function), lipase, glucose, electrolytes including magnesium and phosphate, ECG, hepatitis B and C and HIV if any injecting or sexual risk, FibroScan or ultrasound where available.
- **Brief intervention evidence**: in primary care, brief intervention reduces drinking by about 20 g a week on average at one year; less effective in dependence, which needs specialist treatment.
- **Alcohol and depression**: in dependent drinkers, depressive symptoms often improve markedly within 2 to 4 weeks of abstinence; if depression persists beyond that, treat it (SSRIs or mirtazapine; avoid tricyclics because of overdose and interaction with alcohol).
- **Alcoholic hallucinosis**: predominantly auditory hallucinations with clear consciousness, usually within 48 hours of reducing heavy drinking; treat withdrawal and use short-term antipsychotics if needed; some cases persist.
- **Morbid (delusional) jealousy**: risk of violence to the partner; ask directly, document, consider duty to protect, and treat both alcohol use and the delusion.
:::

:::recall
1. Name five organs or systems harmed by alcohol. || Liver, gut and pancreas, heart and blood, brain and nerves, cancers, pregnancy.
2. What is alcoholic hallucinosis? || Hallucinations, usually voices, during or after heavy drinking, with clear consciousness.
3. What does FRAMES stand for? || Feedback, Responsibility, Advice, Menu, Empathy, Self-efficacy.
4. Which medicine class is first-line for alcohol withdrawal? || Benzodiazepines.
:::

:::mcq
Q: A heavy drinker on a surgical ward becomes tremulous and sweaty on his second day after admission. The first-line treatment is:
- Haloperidol
- *A benzodiazepine regimen with parenteral thiamine
- Paracetamol only
- Discharge
> Benzodiazepines for withdrawal; thiamine to protect the brain.

Q: A man with long-standing heavy drinking accuses his wife of affairs with every visitor and checks her phone constantly. The most important concern is:
- Normal jealousy
- *Morbid jealousy with risk of violence to his wife
- Social anxiety
- Alcohol withdrawal
> Ask about risk and protect the partner.
:::

## 2.3 Alcohol withdrawal, delirium tremens and Wernicke-Korsakoff [core][beginner]
Alcohol withdrawal ranges from a mild morning shake to a life-threatening delirium. Knowing the timeline lets you predict and prevent the dangerous stages.

:::widget figure
{"id": "limbic-system", "focus": ["mammillary"]}
:::

:::widget figure
{"id": "cerebellum", "focus": ["vermis"]}
:::

:::widget guess
{"prompt": "After the last drink, within about how many hours do the first withdrawal symptoms (tremor, sweating, anxiety) usually begin in a dependent drinker?", "min": 0, "max": 72, "unit": "hours", "answer": [6, 12], "reveal": "Within about 6 to 12 hours, often while there is still some alcohol in the blood. That is why dependent drinkers shake in the morning and drink to steady themselves. Symptoms usually peak over the first two to three days.", "clinician": "Uncomplicated withdrawal: onset 6 to 12 hours (sometimes earlier), peak 24 to 72 hours, resolving by 5 to 7 days. Withdrawal seizures: usually 12 to 48 hours (peak about 24 hours), generalised tonic-clonic, often single or in a short cluster. Alcoholic hallucinosis: 12 to 48 hours, clear consciousness. Delirium tremens: 48 to 96 hours after the last drink, lasting about 3 days (up to a week)."}
:::

:::widget flow
{"title": "Why stopping heavy drinking over-excites the brain", "layout": "chain", "nodes": [{"id": "a", "label": "Daily heavy drinking", "detail": "Alcohol boosts GABA (calming) and blocks NMDA glutamate (exciting) receptors."}, {"id": "b", "label": "The brain adapts", "detail": "GABA-A receptors become less sensitive; NMDA receptors increase in number and sensitivity."}, {"id": "c", "label": "Alcohol stops", "detail": "The calming boost vanishes while the extra excitation remains."}, {"id": "d", "label": "Over-excitation", "detail": "Tremor, sweating, fast pulse, anxiety, insomnia; then seizures; then, in some, delirium tremens."}, {"id": "e", "label": "Treatment", "detail": "Benzodiazepines stand in for alcohol at GABA-A receptors and are then tapered, letting the brain re-adapt safely."}], "caption": "This is why benzodiazepines, not antipsychotics, are the treatment for alcohol withdrawal."}
:::

### Delirium tremens (DTs)
The most severe form of withdrawal. It starts a few days after the last drink (guess the window below), and brings:
- **Clouded consciousness and confusion** (delirium), disorientation, fluctuating attention.
- **Vivid hallucinations**, often visual (insects, small animals, "Lilliputian" figures), and terror.
- **Severe tremor, sweating, fever, fast heart, high blood pressure**: the body's alarm system is in overdrive.
- Risk of **death** from heart rhythm problems, dehydration, infection, injury and seizures.

Risk factors: previous DTs or withdrawal seizures, heavy daily drinking for years, older age, physical illness (infection, liver disease, injury), low potassium or magnesium, and high withdrawal scores early on.

:::widget guess
{"prompt": "Delirium tremens usually begins around how many hours after the last drink?", "min": 0, "max": 168, "unit": "hours", "answer": [48, 96], "reveal": "Usually between about 48 and 96 hours, that is, the second to fourth day. This is why patients admitted for surgery or injury who drink heavily often become delirious two or three days later.", "clinician": "Untreated DTs historically had mortality up to 15% to 20%; with good care about 1% to 5%. Treatment: high-dose benzodiazepines (front-loading), ICU-level monitoring, fluids, electrolyte and magnesium correction, parenteral thiamine before glucose, treat infection and injury; phenobarbital in benzodiazepine-resistant cases under specialist care."}
:::

:::widget timeline
{"prompt": "Order the stages of alcohol withdrawal by when they usually appear after the last drink.", "events": [{"label": "Tremor, sweating, anxiety, fast pulse, nausea", "when": "6 to 12 hours"}, {"label": "Withdrawal seizures and alcoholic hallucinosis can occur", "when": "12 to 48 hours"}, {"label": "Delirium tremens: confusion, terror, visual hallucinations, fever", "when": "48 to 96 hours"}, {"label": "Most symptoms settle, though sleep and mood may stay poor for longer", "when": "5 to 7 days"}], "why": "Knowing the clock lets you prevent the dangerous stages. A patient admitted with an injury who drinks heavily should be watched from the first day, because the worst comes on the second to fourth day."}
:::

### Wernicke's encephalopathy and Korsakoff's syndrome
Heavy drinkers often lack **thiamine** (vitamin B1) because they eat poorly, absorb it badly and store less in the liver. The brain needs thiamine to use glucose. Severe deficiency causes **Wernicke's encephalopathy**, an emergency:
- **Confusion**.
- **Eye signs**: nystagmus, paralysis of eye movements (ophthalmoplegia).
- **Ataxia**: unsteady, wide-based walking.

Only a minority show all three. Any drinker with **confusion or unsteadiness or eye signs**, or who is malnourished, should be treated as possible Wernicke's.

If not treated quickly, it can leave **Korsakoff's syndrome**: a lasting severe inability to form new memories (**anterograde amnesia**), with some loss of older memories, and **confabulation** (filling memory gaps with invented stories, without intending to lie). Other thinking may be fairly well preserved.

:::widget brainmap
{"title": "Where thiamine deficiency strikes", "focus": ["thalamus", "cerebellum", "brainstem", "hippocampus"], "notes": {"thalamus": "Damage to the medial thalamus and the nearby mamillary bodies causes the dense memory loss of Korsakoff's syndrome.", "cerebellum": "Damage to the cerebellar vermis causes a wide-based, unsteady walk (ataxia).", "brainstem": "Damage around the nuclei that move the eyes causes nystagmus and paralysis of eye movements.", "hippocampus": "Memory circuits linking the hippocampus, mamillary bodies and thalamus are disrupted, so new memories cannot be stored."}, "caption": "These regions have very high energy needs, so they suffer first when thiamine runs out."}
:::

:::safety Thiamine before glucose
Giving glucose (for example a sugar drip) to a thiamine-deficient person can tip them into Wernicke's encephalopathy, because glucose use consumes the little thiamine left. In any malnourished or heavy-drinking patient, give **parenteral thiamine first**, then glucose.
:::

:::widget decide
{"scene": "Ram, 55, a homeless man in Mumbai, is brought to emergency confused and unsteady. He smells of alcohol. His eyes flick sideways when he looks to either side. Blood sugar is low. The nurse is about to start a 25% dextrose drip.", "ask": "What do you do?", "choices": [{"label": "Let the dextrose go in first, then give oral thiamine tomorrow", "verdict": "harm", "outcome": "His confusion worsens over the next day, and he is left with severe memory loss months later.", "why": "Glucose before thiamine can precipitate or worsen Wernicke's. Oral thiamine is poorly absorbed in heavy drinkers."}, {"label": "Give high-dose intravenous thiamine first, then correct the low sugar, check magnesium, and continue high-dose parenteral thiamine for several days", "verdict": "best", "outcome": "His eye signs settle within a day, and his walking and confusion improve over the following weeks. He has some memory problems but can live in a supported hostel.", "why": "Possible Wernicke's encephalopathy is treated urgently with high-dose parenteral thiamine, given before glucose. Magnesium is needed for thiamine to work."}, {"label": "Treat him as simply drunk and let him sleep it off", "verdict": "harm", "outcome": "He is found more confused the next morning, with worsening eye signs.", "why": "Confusion, eye signs and ataxia in a drinker must be treated as Wernicke's, not intoxication."}]}
:::

:::clinician
### Alcohol withdrawal: assessment and treatment
- **CIWA-Ar** (10 items: nausea and vomiting, tremor, sweating, anxiety, agitation, tactile, auditory and visual disturbances, headache, orientation; maximum 67): 10 or less mild (often no medicine needed), 11 to 15 moderate, above 15 severe. A score above 10 should prompt medically assisted withdrawal. Not valid in delirium or when patients cannot communicate; monitor vital signs and use clinical judgement.
- **Regimens** (adapt to local protocol):
  - **Fixed-dose reducing regimen** (community or ward): chlordiazepoxide (Librium) for example 20 to 30 mg four times daily on day 1, reducing over 5 to 7 days; higher doses (up to about 250 mg/day in total) for severe dependence in hospital. Diazepam (Valium, Calmpose) 10 to 20 mg four times daily reducing is an alternative.
  - **Symptom-triggered**: chlordiazepoxide 25 to 50 mg or diazepam 10 to 20 mg when CIWA-Ar is above 8 to 10, reassessing hourly; uses less medicine in hospitals with trained staff.
  - **Liver failure, elderly, respiratory disease**: use a shorter-acting benzodiazepine without active metabolites, for example lorazepam (Ativan, Larpose) 1 to 2 mg as needed or regularly with a taper (oxazepam is not widely available in India).
- **Seizures**: benzodiazepines are the treatment and prophylaxis; phenytoin does not prevent alcohol withdrawal seizures. Investigate first or atypical seizures.
- **Thiamine**: prophylaxis in all dependent drinkers in assisted withdrawal, for example thiamine 250 mg IM or IV daily for 3 to 5 days (UK: one pair of high-potency B-complex ampoules IM daily for 5 days), then oral thiamine 100 mg three times daily (300 mg/day). **Suspected or definite Wernicke's**: thiamine about 500 mg IV three times daily for 3 to 5 days (UK: two pairs of high-potency B-complex IV three times daily), then 250 mg daily for a further 3 to 5 days if improving, then oral. Correct magnesium. Anaphylaxis is rare; give in a setting with resuscitation facilities.
- **Caine criteria** for Wernicke's in alcohol dependence (two of four): dietary deficiency, eye signs, cerebellar dysfunction, and altered mental state or mild memory impairment. Sensitivity about 85% versus about 20% for the classic triad.
- **Korsakoff's pathology**: mamillary bodies, mediodorsal thalamus and their connections; about a quarter recover substantially, about half partially, a quarter not at all.
:::

:::recall
1. When do alcohol withdrawal symptoms usually begin, and when do seizures and DTs tend to occur? || About 6 to 12 hours; seizures about 12 to 48 hours; DTs about 48 to 96 hours.
2. Name the classic triad of Wernicke's encephalopathy. || Confusion, eye signs (nystagmus, ophthalmoplegia), ataxia.
3. Why give thiamine before glucose? || Glucose use consumes remaining thiamine and can precipitate Wernicke's.
4. What is confabulation in Korsakoff's syndrome? || Filling memory gaps with invented stories, without intent to deceive.
5. Which medicines prevent and treat alcohol withdrawal seizures? || Benzodiazepines (not phenytoin).
:::

:::mcq
Q: A dependent drinker admitted after a road accident becomes confused, terrified and sees insects on the walls on his third day, with fever, sweating and a fast pulse. The diagnosis is:
- Alcoholic hallucinosis
- *Delirium tremens
- Wernicke's encephalopathy only
- Schizophrenia
> Delirium with autonomic overactivity on day two to four.

Q: Only a minority of patients with Wernicke's encephalopathy show the full triad. The safest rule is to:
- Wait for all three signs before treating
- *Treat with high-dose parenteral thiamine if any sign is present in a drinker or malnourished person
- Give oral thiamine only
- Give glucose first
> Low threshold for parenteral thiamine.
:::

## 2.4 Opioids: intoxication, overdose and withdrawal [core][beginner]
Opioids include natural ones (morphine, codeine, opium), semi-synthetic ones (heroin, buprenorphine) and synthetic ones (methadone, tramadol, fentanyl). They act on **opioid receptors**, mainly the **mu** receptor, to relieve pain and produce a warm, drowsy euphoria.

:::widget figure
{"id": "medulla-section"}
:::

:::widget figure
{"id": "pons-section", "focus": ["lc"]}
:::

### Overdose: the deadly risk
Opioid overdose kills by **stopping breathing**. Signs:
- Unresponsive or very drowsy.
- **Pinpoint pupils**.
- **Slow or absent breathing**, blue lips, gurgling or snoring sounds.

**Naloxone** reverses opioid overdose within minutes. It can be given by injection or nasal spray, even by trained family members and peers. Because naloxone wears off faster than many opioids, people must be watched for hours after it is given.

:::widget flow
{"title": "Responding to an opioid overdose", "layout": "chain", "nodes": [{"id": "a", "label": "Recognise", "detail": "Unresponsive, pinpoint pupils, slow or no breathing, blue lips, snoring or gurgling."}, {"id": "b", "label": "Call for help", "detail": "Emergency services or the nearest health worker."}, {"id": "c", "label": "Give naloxone", "detail": "Nasal spray or injection; repeat after two to three minutes if no response."}, {"id": "d", "label": "Support breathing", "detail": "Rescue breaths if trained; open the airway."}, {"id": "e", "label": "Recovery position", "detail": "On the side to protect the airway from vomit."}, {"id": "f", "label": "Stay and watch", "detail": "Naloxone wears off in about an hour; the overdose can return. Hospital observation is safest."}], "caption": "Trained family members and peers can do every step."}
:::

### When is overdose most likely?
- After a period of **reduced tolerance**: release from prison, discharge from hospital or rehabilitation, after a detox.
- **Mixing** opioids with alcohol, benzodiazepines, or other sedatives.
- Using **alone**, or using a new supply that may be stronger or contain fentanyl.

:::widget sort
{"prompt": "Higher or lower overdose risk? Place each situation.", "buckets": ["Higher risk", "Lower risk"], "items": [{"text": "Released from prison yesterday after six months without heroin, plans to use his old dose", "bucket": 0, "why": "Tolerance falls quickly; the old dose can kill."}, {"text": "Takes a stable daily methadone dose under supervision at a clinic", "bucket": 1}, {"text": "Injects heroin after drinking half a bottle of rum and taking alprazolam", "bucket": 0}, {"text": "Uses with a friend who has naloxone and knows how to use it", "bucket": 1}, {"text": "Just finished a ten-day inpatient detox and is going straight to a party", "bucket": 0}, {"text": "On buprenorphine maintenance for two years with no other drugs", "bucket": 1}]}
:::

### Withdrawal
Opioid withdrawal is extremely unpleasant but rarely dangerous in a healthy adult. It is the mirror image of opioid effects: **dilated pupils, runny nose, tears, yawning, goosebumps** ("cold turkey"), sweating, **aches and cramps**, nausea, vomiting, **diarrhoea**, restlessness, insomnia, anxiety and strong craving.

:::widget guess
{"prompt": "After the last dose of heroin, at about how many hours does withdrawal typically peak?", "min": 0, "max": 120, "unit": "hours", "answer": [32, 72], "reveal": "Withdrawal starts within about 4 to 12 hours, peaks around 1.5 to 3 days, and largely settles in about 5 to 7 days. Methadone withdrawal starts later, peaks later and lasts much longer, because methadone stays in the body far longer.", "clinician": "Untreated heroin withdrawal: onset about 4 to 6 hours, peak 32 to 72 hours, substantially subsided by day 5. Untreated methadone withdrawal: peak at about 4 to 6 days, symptoms persisting 10 to 12 days or more. Buprenorphine withdrawal: milder, lasting up to about 10 days. A protracted phase of insomnia, dysphoria and craving can last months."}
:::

:::widget decide
{"scene": "At a party in Imphal, Thoiba, 24, collapses after injecting heroin. He is blue around the lips, barely breathing, and his pupils are tiny. A friend has a naloxone kit from the harm-reduction centre.", "ask": "What should happen?", "choices": [{"label": "Throw cold water on him and let him sleep it off", "verdict": "harm", "outcome": "His breathing stops. He dies before help arrives.", "why": "Opioid overdose kills by respiratory depression. 'Sleeping it off' is how many people die."}, {"label": "Call for emergency help, give naloxone, support breathing (rescue breaths), put him in the recovery position, and stay with him, because the overdose can return when naloxone wears off", "verdict": "best", "outcome": "He starts breathing within two minutes, wakes up in withdrawal, and is taken to hospital, where he is observed and later linked with an opioid substitution centre.", "why": "Naloxone plus breathing support and observation saves lives. Overdose can recur as naloxone wears off, especially with long-acting opioids."}, {"label": "Give him a stimulant to wake him up", "verdict": "harm", "outcome": "He has a cardiac arrest.", "why": "Stimulants do not reverse opioid overdose and add heart risk."}]}
:::

:::clinician
### Overdose and withdrawal management
- **Naloxone**: 0.4 mg IV, IM or subcutaneous, repeated every 2 to 3 minutes as needed (up to about 10 mg; consider other causes if no response); intranasal 4 mg (1.8 mg in some products). Titrate in dependent patients (for example 0.04 to 0.1 mg IV increments) to restore breathing without precipitating severe withdrawal. Duration of action about 30 to 90 minutes; observe for at least 2 to 6 hours, longer for methadone or long-acting preparations (infusion may be needed). Take-home naloxone programmes reduce deaths.
- **COWS** (Clinical Opiate Withdrawal Scale, 11 items: pulse, sweating, restlessness, pupil size, bone or joint aches, runny nose or tearing, GI upset, tremor, yawning, anxiety or irritability, gooseflesh): 5 to 12 mild; 13 to 24 moderate; 25 to 36 moderately severe; above 36 severe.
- **Symptomatic withdrawal relief** when substitution is not used: clonidine 0.1 mg two to four times daily (check blood pressure; hold if systolic below about 90 mm Hg), loperamide for diarrhoea, ondansetron or metoclopramide for nausea, NSAIDs or paracetamol for aches, short-term hypnotic. Lofexidine is not marketed in India.
- **Opioid-assisted withdrawal**: buprenorphine taper over about 7 to 14 days is more effective and more comfortable than clonidine alone, but relapse after detox is common; maintenance treatment is more effective than detox for most people (section 3.2).
- **Tramadol** (now under NDPS) can cause seizures and serotonin toxicity in overdose; **fentanyl and nitazenes** may need repeated naloxone doses.
- **Injecting complications**: abscesses, cellulitis, thrombosis, endocarditis, HIV, hepatitis B and C, overdose; offer testing, hepatitis B vaccination and harm reduction.
:::

:::widget compare
{"title": "Opioid intoxication and opioid withdrawal", "a": {"label": "Intoxication or overdose", "points": ["Pinpoint pupils", "Drowsy, slurred speech, nodding off", "Slow, shallow breathing: the cause of death", "Constipation", "Low pulse and blood pressure"], "summary": "Intoxication: everything slows down. Overdose stops breathing, and naloxone reverses it."}, "b": {"label": "Withdrawal", "points": ["Wide pupils", "Yawning, runny nose and eyes", "Goosebumps, aches, restlessness", "Diarrhoea, cramps and vomiting", "Craving, poor sleep, fast pulse"], "summary": "Withdrawal: the mirror image. Miserable, but rarely dangerous to life in a healthy adult."}, "caption": "Withdrawal is often the opposite of the drug's effect, because the body has adapted in the opposite direction. The same rule works for alcohol: sedated when drunk, shaky and over-excited in withdrawal."}
:::

:::recall
1. Name the three signs of opioid overdose. || Unconsciousness, pinpoint pupils, slow or absent breathing.
2. Why must people be observed after naloxone? || Naloxone wears off before many opioids do, so overdose can return.
3. When is overdose risk highest? || After loss of tolerance (prison release, detox, hospital), mixing with sedatives or alcohol, using alone, new stronger supply.
4. When does heroin withdrawal peak? || About 1.5 to 3 days after the last dose.
5. What is the COWS? || The Clinical Opiate Withdrawal Scale, used to rate opioid withdrawal severity.
:::

:::mcq
Q: Which sign helps you tell opioid overdose from alcohol intoxication?
- Slurred speech
- *Pinpoint pupils with slow breathing
- Smell of alcohol
- Vomiting
> Pinpoint pupils and respiratory depression point to opioids.

Q: A man is released from prison after a year without heroin. The most important advice before release is:
- He can safely use his old dose
- *His tolerance has fallen, so his old dose could kill him; offer naloxone and link him to substitution treatment
- Withdrawal will be severe
- Only injecting is risky
> Loss of tolerance is a leading cause of post-release death.
:::

## 2.5 Cannabis, stimulants, sedatives, inhalants and hallucinogens [core][beginner]
### Cannabis
Cannabis contains **THC** (which produces the high, and in large amounts anxiety and psychosis) and **CBD** (which does not produce a high). Modern cannabis is often far stronger in THC than in the past.

Short-term effects: relaxation, laughter, hunger, red eyes, dry mouth, fast heart, slowed sense of time, poor short-term memory and coordination. Too much: **anxiety, panic, paranoia**, and in some people brief psychotic symptoms.

Long-term risks:
- **Dependence**: about 1 in 10 users overall, more with daily and early use.
- **Psychosis**: daily use, especially of high-potency cannabis and starting in the teens, raises the risk of schizophrenia, and in those who already have psychosis, it worsens the course.
- **Thinking and motivation**: poorer memory and attention in heavy users; early, heavy teen use is linked with poorer school outcomes.
- **Cannabis hyperemesis syndrome**: repeated bouts of severe vomiting in long-term daily users, relieved by hot baths, curing only with stopping.
- **Lungs**: cough and bronchitis when smoked, often with tobacco.

:::widget flow
{"title": "How stimulants raise dopamine", "layout": "tree", "nodes": [{"id": "r", "label": "Stimulants increase synaptic dopamine and noradrenaline", "detail": "But by different routes."}, {"id": "c", "label": "Cocaine", "detail": "Blocks the dopamine, noradrenaline and serotonin transporters, so messengers stay in the synapse. Short-acting, so binges are common.", "parent": "r"}, {"id": "m", "label": "Methamphetamine and amphetamines", "detail": "Enter the nerve ending, empty storage vesicles and run the transporter backwards, pushing out large amounts of dopamine. Long-acting and more neurotoxic.", "parent": "r"}, {"id": "x", "label": "MDMA", "detail": "Mainly releases serotonin (and oxytocin), with some dopamine: warmth, closeness, and risks of overheating and low sodium.", "parent": "r"}, {"id": "p", "label": "Prescribed methylphenidate", "detail": "Blocks transporters at therapeutic oral doses, rising slowly in the brain, which lowers its addictive potential compared with smoked or injected stimulants.", "parent": "r"}], "caption": "Speed of rise in the brain matters as much as the mechanism."}
:::

### Stimulants
Methamphetamine, amphetamines, cocaine, MDMA ("ecstasy") and mephedrone. Effects: energy, confidence, euphoria, reduced appetite and sleep. Dangers: **paranoia and psychosis** (often with tactile hallucinations like insects under the skin), **stroke and heart attack**, dangerous **overheating** (especially MDMA at crowded parties), seizures, severe weight loss, dental damage, and a **crash** of exhaustion and depression on stopping.

:::widget journey
{"drug": "cocaine", "target": "dopamine transporters in the nucleus accumbens, blocking dopamine reuptake", "routes": ["nasal", "iv"], "notes": {"nose": "Snorted powder is absorbed through the nasal lining and reaches the brain within minutes. It also narrows blood vessels, which can damage the nose.", "vein": "Injected cocaine reaches the brain within seconds, giving an intense rush.", "target": "Blocks the dopamine transporter, so dopamine piles up in the synapse: euphoria, energy and confidence.", "out": "Broken down quickly; the high fades within an hour, followed by a crash that drives the next dose."}, "caption": "The faster a drug reaches the brain, the stronger the rush and the more addictive the pattern. Smoked and injected forms are the most dangerous for this reason."}
:::

:::widget release
{"transmitter": "dopamine", "title": "Two ways stimulants flood the synapse", "caption": "Pick the SSRI or a reuptake block to picture cocaine: dopamine is released normally but cannot be taken back up. Pick amphetamine: it enters the nerve ending and pushes dopamine out through the transporter, so release happens even without a signal. Both end with far more dopamine in the reward pathway than any natural reward produces."}
:::

:::widget figure
{"id": "stimulant-synapse"}
:::

### Sedatives and hypnotics
Benzodiazepines (alprazolam, clonazepam, nitrazepam, diazepam) and "Z-drugs" (zolpidem). Often started on prescription, then continued for years. Tolerance develops quickly, and **sudden stopping after long use can cause seizures and delirium**, like alcohol withdrawal. Mixing with alcohol or opioids is a common cause of fatal overdose.

### Inhalants
Glue, correction fluid, petrol and paint thinner, mostly used by **children and young adolescents**, often in street situations. They cause quick intoxication with dizziness and slurred speech, and can cause **sudden death** from heart rhythm problems, plus lasting brain, nerve, liver and kidney damage.

### Hallucinogens
LSD, psilocybin ("magic mushrooms"), and others. They alter perception and sense of self. Risks: frightening experiences ("bad trips"), dangerous behaviour while intoxicated, and in some people, **lasting visual disturbances** after use (hallucinogen persisting perception disorder). Most are not physically addictive.

:::widget sort
{"prompt": "Which substance best explains each presentation?", "buckets": ["Cannabis", "Stimulant", "Sedative", "Inhalant"], "items": [{"text": "A 13-year-old found with a cloth soaked in correction fluid, slurred speech and dizziness", "bucket": 3}, {"text": "A young man with paranoia, sleeplessness for days, weight loss and the feeling of insects under his skin", "bucket": 1}, {"text": "A woman who has taken alprazolam for ten years has a seizure two days after running out", "bucket": 2}, {"text": "A daily smoker with repeated bouts of vomiting that ease only in a hot shower", "bucket": 0}, {"text": "A partygoer with a temperature of 41 degrees, rigid muscles and confusion", "bucket": 1, "why": "MDMA and other stimulants can cause life-threatening hyperthermia."}, {"text": "A student with red eyes, laughing, hungry and paranoid at a hostel", "bucket": 0}]}
:::

:::widget decide
{"scene": "Varun, 19, from Shimla, has been smoking strong charas daily for two years. Over the past month he has become convinced that his phone is hacked and that neighbours are recording him. He hears voices commenting on him. He says cannabis is 'natural and harmless' and helps him sleep.", "ask": "What is the best plan?", "choices": [{"label": "Tell him cannabis is harmless and start sleeping tablets", "verdict": "harm", "outcome": "His psychosis worsens and he becomes aggressive towards a neighbour.", "why": "Daily high-potency cannabis is linked with psychosis. Benzodiazepines add new risks and do not treat psychosis."}, {"label": "Assess the psychosis and risk, explain clearly and respectfully the link between strong daily cannabis and psychosis, start treatment for the psychosis, and support him to stop or cut down with motivational work", "verdict": "best", "outcome": "On a low-dose antipsychotic, his voices fade. He cuts down, then stops cannabis. His family learns the warning signs. He stays well when abstinent.", "why": "Treat the psychosis and the cannabis use together. Motivational interviewing works better than lecturing."}, {"label": "Insist that he must stop cannabis before you will treat him", "verdict": "harm", "outcome": "He walks out and does not return.", "why": "Making treatment conditional on abstinence loses the patient. Treat both together."}]}
:::

:::clinician
### Depth notes
- **Cannabis and psychosis**: daily use of high-potency cannabis (THC 10% or more) was associated with about five times the odds of psychotic disorder in a large multicentre European study. A 2023 Danish registry analysis estimated that up to about 30% of schizophrenia cases in young men might be attributable to cannabis use disorder. Continued use after a first episode predicts relapse and admission.
- **Cannabis withdrawal** (DSM-5-TR): three or more of irritability, anxiety, sleep difficulty, decreased appetite, restlessness, depressed mood, and physical symptoms (abdominal pain, tremor, sweating, fever, chills, headache), within about 1 week of stopping heavy, prolonged use; peaks in the first week, lasts 1 to 2 weeks. No medicine is approved for cannabis use disorder; CBT, MET and contingency management help; gabapentin and N-acetylcysteine (in adolescents) have mixed evidence.
- **Stimulant psychosis**: treat with short-term antipsychotics and benzodiazepines for agitation; persistence beyond about a month of abstinence suggests a primary psychotic disorder. Contingency management has the strongest evidence for stimulant use disorder; no approved medicine (bupropion plus naltrexone showed modest benefit in the ADAPT-2 trial).
- **Benzodiazepine withdrawal**: switch to diazepam (equivalents: diazepam 10 mg is roughly alprazolam 0.5 to 1 mg, clonazepam 0.5 to 1 mg, lorazepam 1 mg, nitrazepam 10 mg, zolpidem 20 mg) and reduce by about 5% to 10% every 1 to 2 weeks (slower near the end); many months may be needed for long-term users. Alprazolam has rapid, severe withdrawal.
- **MDMA hyperthermia and hyponatraemia**: cooling, benzodiazepines, fluids; avoid antipsychotics with anticholinergic effects; dantrolene is controversial.
- **Hallucinogens**: DSM-5-TR includes hallucinogen persisting perception disorder (flashbacks, trails, halos); research on psilocybin therapy is discussed in section 3.5.
:::

:::recall
1. Which component of cannabis produces the high and the psychosis risk? || THC.
2. What pattern of cannabis use most raises psychosis risk? || Daily use of high-potency cannabis, especially starting in adolescence.
3. What is cannabis hyperemesis syndrome? || Repeated bouts of severe vomiting in long-term daily users, relieved by hot baths, resolving with abstinence.
4. Why is stopping long-term benzodiazepines suddenly dangerous? || It can cause seizures and delirium.
5. Who most commonly uses inhalants, and what is the acute danger? || Children and young adolescents; sudden death from heart rhythm problems.
:::

:::mcq
Q: A woman taking alprazolam 2 mg daily for eight years wants to stop. The safest approach is:
- Stop today
- *A slow taper, often after switching to a longer-acting benzodiazepine such as diazepam
- Replace it with alcohol
- Halve the dose every day
> Gradual reduction over weeks to months.

Q: A young man has paranoia and tactile hallucinations after a week of no sleep using methamphetamine. The most likely diagnosis is:
- Schizophrenia
- *Stimulant-induced psychotic disorder
- Alcohol withdrawal
- Cannabis intoxication
> Stimulant psychosis; reassess after abstinence.
:::

## 2.6 Tobacco and behavioural addictions [core][beginner]
### Tobacco: the biggest killer
Tobacco kills more people than any other substance. About **half of long-term users die** from a tobacco-related disease. In India, smokeless forms (gutka, khaini, gul, mawa) cause **mouth cancer**, the leading cancer among men, and smoking causes heart disease, stroke, lung disease and many cancers.

**Nicotine** is highly addictive. It reaches the brain within seconds of smoking. Withdrawal brings irritability, anxiety, restlessness, poor concentration, hunger and strong craving.

People with mental illness smoke much more, and die years earlier, largely from tobacco-related illness. Helping them quit is one of the most effective things a mental health professional can do.

### Helping people quit: the 5 As
- **Ask** about tobacco use at every visit.
- **Advise** clearly to quit, linked to their own health.
- **Assess** readiness to quit.
- **Assist**: set a quit date, offer medicines (nicotine replacement, varenicline, bupropion) and behavioural support.
- **Arrange** follow-up.

For people not ready, the **5 Rs** build motivation: **Relevance**, **Risks**, **Rewards**, **Roadblocks**, **Repetition**.

:::widget decide
{"scene": "Mr D'Souza, 45, has schizophrenia and has been stable on clozapine for three years. He smokes 25 cigarettes a day and wants to quit after his brother's heart attack. He plans to stop completely tomorrow.", "ask": "What is the most important thing to plan for?", "choices": [{"label": "Encourage him to quit and offer nicotine replacement and support, and also plan to check his clozapine level and reduce the dose if needed, because stopping smoking raises clozapine levels", "verdict": "best", "outcome": "His clozapine level is checked a few days after quitting and the dose is reduced. He quits successfully without toxicity.", "why": "Tobacco smoke (not nicotine) induces the liver enzyme CYP1A2, which breaks down clozapine and olanzapine. On quitting, levels can rise sharply, risking sedation, seizures and other toxicity."}, {"label": "Tell him people with schizophrenia should not try to quit because it will cause relapse", "verdict": "harm", "outcome": "He continues smoking and has a heart attack at 52.", "why": "People with severe mental illness can quit successfully with support, and it does not usually cause relapse."}, {"label": "Encourage him to quit with willpower alone", "verdict": "ok", "outcome": "He relapses in a few days and feels he has failed.", "why": "Medicines plus support roughly double or triple quit rates. Willpower alone works for few heavy smokers."}]}
:::

:::widget receptor
{"receptor": "alpha-4 beta-2 nicotinic", "title": "How varenicline helps people stop smoking", "caption": "Nicotine is a full agonist: a big burst of signal, and dopamine release. Varenicline is a partial agonist: it gives a smaller steady signal that eases craving and withdrawal, and it occupies the receptor so a cigarette gives less reward. Switch between full and partial agonist to see both effects."}
:::

### Behavioural addictions
Some behaviours can take over a person's life in the same way as drugs.
- **Gambling disorder**: needing to bet more for the same excitement, restlessness when trying to stop, repeated failed attempts, preoccupation, gambling to escape bad moods, **chasing losses** (betting more to win back money), lying, risking relationships and jobs, relying on others to pay debts. In India, online betting, fantasy sports and card games (teen patti, rummy apps) are growing concerns.
- **Gaming disorder** (in ICD-11): loss of control over gaming, gaming taking priority over other interests and daily activities, and continuing despite harm, causing significant impairment over a long period.
- Other proposed behavioural addictions (shopping, social media, sex, exercise) are debated and not official diagnoses.

:::widget sort
{"prompt": "Gambling disorder criterion or not? Place each statement.", "buckets": ["Gambling disorder criterion", "Not a criterion"], "items": [{"text": "Bets bigger amounts to get the same thrill", "bucket": 0}, {"text": "After losing, returns the next day to win the money back", "bucket": 0, "why": "Chasing losses."}, {"text": "Enjoys a lottery ticket at Diwali", "bucket": 1}, {"text": "Hides the extent of gambling from his wife", "bucket": 0}, {"text": "Gambles when feeling low or anxious", "bucket": 0}, {"text": "Borrowed from friends to pay gambling debts", "bucket": 0, "why": "Relies on others to relieve financial situations caused by gambling."}, {"text": "Plays cards with family once a year for small stakes", "bucket": 1}]}
:::

:::clinician
### Tobacco: medicines and facts
- **Nicotine replacement therapy** (Nicotex, Nicorette): patches (21 mg/24 h if more than 10 cigarettes a day, reducing over 8 to 12 weeks), gum or lozenges 2 mg (4 mg if first cigarette within 30 minutes of waking), up to about 15 to 20 pieces a day. Combination (patch plus short-acting form) is more effective than single NRT.
- **Varenicline**: alpha-4 beta-2 nicotinic partial agonist; 0.5 mg once daily for days 1 to 3, 0.5 mg twice daily days 4 to 7, then 1 mg twice daily for 12 weeks; quit date between days 8 and 35. Nausea, vivid dreams. The EAGLES trial (2016, 8,144 smokers including about 4,100 with psychiatric illness) showed no significant increase in neuropsychiatric events versus placebo, and higher quit rates than bupropion or NRT. Supply was disrupted globally by a 2021 recall over nitrosamine impurities; check local availability.
- **Bupropion SR**: 150 mg daily for 3 days, then 150 mg twice daily, starting 1 to 2 weeks before the quit date, for 7 to 12 weeks; contraindicated in seizures, eating disorders, and with MAOIs.
- **Cytisine**: a plant-derived partial agonist used for decades in central and eastern Europe, cheap and effective (about as effective as varenicline in trials). As of Nov 2026, the US FDA issued a complete response letter for cytisinicline in June 2026 citing manufacturing-site and labelling issues, not efficacy or safety; it is not marketed in India.
- **Smoking and drug levels**: polycyclic aromatic hydrocarbons in smoke induce CYP1A2. After quitting, clozapine levels can rise by about 50% or more within a week; reduce the dose by about a quarter to a third with level monitoring. Olanzapine, fluvoxamine (inhibitor) and caffeine are also affected.
- **Indian law**: COTPA 2003 (bans smoking in public places, advertising, sale to minors and within 100 yards of educational institutions); Prohibition of Electronic Cigarettes Act 2019 bans production, sale and advertisement of e-cigarettes; gutka and pan masala with tobacco are banned as food products in most states, though twin-pack sales continue.

### Gambling and gaming
- **Gambling disorder** (DSM-5-TR): four or more of nine criteria in 12 months; mild 4 to 5, moderate 6 to 7, severe 8 to 9. High suicide risk (ask). Treatment: CBT, MI, Gamblers Anonymous, financial counselling, self-exclusion; naltrexone (50 to 150 mg) and nalmefene have modest evidence.
- **Gaming disorder** (ICD-11 6C51): impaired control, increasing priority, continuation despite harm, normally evident over at least 12 months (shorter if severe). DSM-5-TR lists internet gaming disorder in Section III for further study (five of nine criteria). India: NIMHANS SHUT (Service for Healthy Use of Technology) clinic.
- **India**: the Promotion and Regulation of Online Gaming Act 2025 bans real-money online games (including fantasy sports and rummy for money), with penalties for operators and advertisers, while promoting e-sports and social games; as of Nov 2026, its effects on gambling-related harm are not yet known.
:::

:::widget conditioning
{"kind": "operant", "title": "Why gambling grips so hard", "caption": "Slot machines, online betting and loot boxes pay out on a variable ratio schedule: wins come at unpredictable moments. This schedule produces the fastest, most persistent responding, and it is the hardest to extinguish. Near-misses add to the pull. Gambling disorder shows that addiction can happen without any drug."}
:::

:::recall
1. About what fraction of long-term tobacco users die from a tobacco-related disease? || About half.
2. What are the 5 As of tobacco cessation? || Ask, Advise, Assess, Assist, Arrange.
3. Why can quitting smoking raise clozapine levels? || Tobacco smoke induces the CYP1A2 enzyme that breaks down clozapine; on quitting, levels rise.
4. What is "chasing losses"? || Gambling more to win back money already lost.
5. Name the three core features of gaming disorder in ICD-11. || Impaired control, increasing priority over other activities, continuation despite harm.
:::

:::mcq
Q: Which medicine has the highest quit rates for smoking in the EAGLES trial?
- Bupropion
- Nicotine patch alone
- *Varenicline
- Placebo
> Varenicline outperformed bupropion and NRT.

Q: A man has bet more and more on cricket apps, lies to his family about it, has borrowed from friends to cover losses, and keeps betting to win back money. This most suggests:
- Normal recreation
- *Gambling disorder
- Bipolar disorder
- Gaming disorder
> Several criteria, including chasing losses.
:::

## 2.7 Level check · Beginner [core][beginner]
Twelve or more right out of fifteen opens the Advanced level.

:::mcq
Q: The eleven substance use disorder criteria fall into how many groups?
- Two
- Three
- *Four
- Eleven
> Impaired control, social impairment, risky use, pharmacological.

Q: Six of eleven criteria in the past year means:
- Mild
- Moderate
- *Severe
- Not a disorder
> Six or more is severe.

Q: Which is NOT counted for a medicine taken as prescribed?
- Craving
- *Tolerance and withdrawal
- Role failure
- Giving up activities
> Physical dependence alone is not addiction.

Q: Pinpoint pupils, slow breathing and unresponsiveness suggest:
- Stimulant intoxication
- *Opioid overdose
- Alcohol withdrawal
- Cannabis intoxication
> Give naloxone and support breathing.

Q: Naloxone works by:
- Stimulating the heart
- *Blocking opioid receptors, reversing the opioid
- Replacing thiamine
- Sedating the patient
> An opioid antagonist.

Q: Delirium tremens most commonly begins:
- Within an hour of the last drink
- *Around the second to fourth day after the last drink
- After a fortnight or more
- Only during intoxication
> About 48 to 96 hours.

Q: The classic triad of Wernicke's encephalopathy is:
- Fever, rash, headache
- *Confusion, eye signs, ataxia
- Tremor, sweating, anxiety
- Amnesia, confabulation, apathy
> The last option describes Korsakoff's syndrome.

Q: In a malnourished drinker with low blood sugar, you should:
- Give glucose first
- *Give parenteral thiamine before glucose
- Give oral thiamine next week
- Give haloperidol
> Thiamine first.

Q: Which is the first-line medicine class for alcohol withdrawal?
- Antipsychotics
- *Benzodiazepines
- Opioids
- Antidepressants
> Benzodiazepines prevent seizures and delirium.

Q: Daily use of high-potency cannabis is most strongly linked with:
- Improved memory
- *Increased risk of psychosis
- Lower blood pressure
- Weight loss
> A dose-related risk.

Q: Sudden stopping of long-term benzodiazepines can cause:
- No effects
- *Seizures and delirium
- Pinpoint pupils
- Hyperemesis
> Like alcohol withdrawal.

Q: Opioid withdrawal is characterised by:
- Pinpoint pupils
- Constipation
- *Dilated pupils, runny nose, yawning, aches and diarrhoea
- Slow breathing
> The mirror image of opioid effects.

Q: Quitting smoking can increase the blood level of:
- Lithium
- *Clozapine
- Sertraline
- Valproate
> Removal of CYP1A2 induction.

Q: Which element is part of FRAMES?
- Force
- *Menu of options
- Medication only
- Rules
> Feedback, Responsibility, Advice, Menu, Empathy, Self-efficacy.

Q: 'Chasing losses' is a criterion for:
- Alcohol use disorder
- *Gambling disorder
- Gaming disorder
- Opioid use disorder
> Gambling more to recover losses.
:::
`;
