/* Module · Eating, sleep, body, dissociative, sexual and impulse disorders, Part II (Beginner level). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part II · Beginner: criteria, risks and first-line care

## 2.1 Anorexia nervosa [core][beginner]
### The three core features
1. **Restriction** of energy intake leading to a **significantly low body weight** for age, sex, development and physical health.
2. **Intense fear of gaining weight** or becoming fat, or **persistent behaviour that prevents weight gain**, even though underweight.
3. **Disturbance in how body weight or shape is experienced**, undue influence of weight or shape on self-worth, or **persistent lack of recognition** of how serious the low weight is.

There are two types: **restricting** (weight loss by dieting, fasting or exercise) and **binge-eating/purging** (also binges or purges by vomiting, laxatives, diuretics or enemas).

### Severity by BMI (adults)
Severity is based on body mass index (weight in kg divided by height in metres squared):
| Severity | BMI |
|---|---|
| Mild | 17 or more |
| Moderate | 16 to 16.99 |
| Severe | 15 to 15.99 |
| Extreme | below 15 |

For children and adolescents, BMI centiles or percentage of median BMI for age are used, because BMI alone is misleading in growing bodies.

:::widget build
{"vignette": "Sneha, 19, a college student in Chennai, has lost 14 kg over the past year. Her BMI is now 15.4. She eats one small meal a day and walks for three hours. She says, 'I'm still too big around the thighs,' and becomes tearful when asked to eat rice. She weighs herself several times a day; her mood depends on the number. She does not think her weight is a problem, though her periods stopped months ago and she faints at times. She denies binge eating or vomiting.", "rule": "Tick every core feature present. Anorexia needs all three core features. Then note the type and the severity from the BMI.", "symptoms": [{"label": "Restriction leading to significantly low weight", "present": true, "core": true, "why": "BMI 15.4 after restricting and over-exercising."}, {"label": "Fear of weight gain or behaviour that prevents weight gain", "present": true, "core": true, "why": "Distress at eating rice; hours of walking."}, {"label": "Disturbed body image, self-worth tied to weight, or lack of recognition of seriousness", "present": true, "core": true, "why": "Sees her thighs as too big; mood depends on the scales; denies the problem."}, {"label": "Binge eating or purging in the recent past", "present": false, "why": "Denies both, so the restricting type."}, {"label": "Stopped periods", "present": true, "why": "A common medical consequence, no longer required for the diagnosis."}], "need": 3, "needCore": true, "verdict": "All three core features are present: anorexia nervosa, restricting type, severe (BMI 15 to 15.99). Fainting and amenorrhoea point to medical risk. Next: urgent medical assessment (heart rate, blood pressure lying and standing, temperature, ECG, electrolytes, glucose, phosphate), assess suicide risk, and plan specialist treatment."}
:::

### The body under starvation
Starvation affects nearly every organ:
- **Heart**: slow heart rate, low blood pressure, fainting, rhythm problems, a shrinking heart muscle; the leading cause of death.
- **Temperature**: feeling cold; fine downy hair (**lanugo**) on the body.
- **Hormones**: periods stop; low testosterone in men; growth stops in adolescents.
- **Bones**: thinning (osteopenia, osteoporosis), fractures.
- **Blood and salts**: low potassium (from vomiting or laxatives), low sodium, low sugar, low phosphate, anaemia.
- **Brain**: shrinkage (largely reversible), poor concentration, rigid thinking, obsessions about food; low mood and anxiety, which often improve with nutrition.
- **Gut**: slow emptying, constipation, bloating.

:::safety Refeeding syndrome
When a severely malnourished person starts eating again, the sudden shift in body chemistry can drop **phosphate, potassium and magnesium** dangerously, causing heart failure, confusion, seizures and death, usually in the first days of refeeding. Refeeding must be **medically supervised** with blood tests, supplements and thiamine. Eating less is not the answer; careful monitoring is.
:::

:::widget decide
{"scene": "Rahul, 21, a hostel student in Delhi, has anorexia nervosa with a BMI of 13.8. His heart rate is 38, temperature 35.2 degrees, and he cannot rise from a squat without using his arms. His potassium is low. He says he is 'fine' and refuses admission, wanting to 'eat more on my own'.", "ask": "What is the right course?", "choices": [{"label": "Respect his wish and give him a diet plan to follow at the hostel", "verdict": "harm", "outcome": "He is found collapsed three days later with a cardiac arrhythmia.", "why": "BMI below 14, heart rate below 40, hypothermia, muscle weakness and low potassium indicate high medical risk. Outpatient care is unsafe."}, {"label": "Explain clearly and kindly that his life is at risk, assess his capacity to refuse (starvation often impairs it), and arrange urgent medical admission for monitored refeeding, using the Mental Healthcare Act if he lacks capacity and remains at serious risk", "verdict": "best", "outcome": "After discussion with his parents, he accepts admission. With careful refeeding, electrolyte monitoring and supplements, his heart rate recovers. He later engages in therapy.", "why": "High-risk anorexia is a medical emergency. Capacity in severe anorexia is often impaired by fear of weight gain and starvation effects; involuntary treatment may be lawful and life-saving."}, {"label": "Admit him and feed him 3,500 kcal from day one to restore weight quickly", "verdict": "harm", "outcome": "On day three he becomes confused with very low phosphate and heart failure.", "why": "Aggressive refeeding without monitoring and supplementation causes refeeding syndrome."}]}
:::

:::clinician
### Risk assessment (adapted from the MEED 2022 guidance, which replaced MARSIPAN)
| Domain | High risk (consider admission) |
|---|---|
| BMI (adults) | Below 13; rapid loss (more than 1 kg a week for several weeks) |
| Heart rate | Below 40 awake, or ECG abnormality (prolonged QTc, arrhythmia) |
| Blood pressure | Systolic below 90 mm Hg, or postural drop with symptoms |
| Temperature | Below 35.5 degrees (35 degrees axillary) |
| Muscle strength | Unable to rise from squat or sit up from lying without using arms (SUSS test) |
| Bloods | Low potassium, sodium, phosphate, magnesium, glucose; raised transaminases; neutropenia |
| Other | Suicide risk, food refusal including fluids, purging with electrolyte disturbance |

**Investigations**: full blood count, urea and electrolytes, calcium, phosphate, magnesium, glucose, liver function, thyroid, ECG; DEXA if underweight for more than about 6 to 12 months.

**Refeeding**: MEED (Royal College of Psychiatrists 2022) and recent evidence support starting oral refeeding at about 1,400 to 2,000 kcal/day in most inpatients (higher than older "start low" regimens), increasing steadily, with daily phosphate, potassium and magnesium for at least the first week, prophylactic phosphate where indicated, thiamine and multivitamins. Very high-risk patients (very low BMI, negligible intake for several days, low baseline electrolytes) may start lower (for example 10 to 20 kcal/kg/day) with intensive monitoring. Aim for about 0.5 to 1 kg weight gain a week in hospital.

**ICD-11 (6B80)**: significantly low body weight (BMI below 18.5 in adults); "dangerously low" below 14; no requirement for fear of fatness, recognising culturally diverse presentations; recovery qualifier.

**Law**: under the MHCA 2017, admission without consent (supported admission, Section 89) requires a mental illness, risk of serious harm or inability to care for oneself, and lack of capacity; nasogastric feeding can be lawful treatment for anorexia with careful documentation, family involvement and Review Board oversight.
:::

:::recall
1. Name the three core features of anorexia nervosa. || Restriction leading to significantly low weight; fear of weight gain or behaviour preventing gain; disturbed body image, self-worth tied to weight, or lack of recognition of seriousness.
2. Give the BMI severity bands. || Mild 17 or more, moderate 16 to 16.99, severe 15 to 15.99, extreme below 15.
3. What is refeeding syndrome? || A dangerous fall in phosphate, potassium and magnesium when a starved person starts eating, causing heart failure, confusion and seizures.
4. Name four signs of high medical risk in anorexia. || Very low BMI, heart rate below 40, low blood pressure, low temperature, failed squat test, low potassium or phosphate.
:::

:::mcq
Q: Which is NOT required for a diagnosis of anorexia nervosa in DSM-5-TR?
- Restriction leading to low weight
- Fear of weight gain or behaviour preventing gain
- Disturbed body image or lack of recognition of seriousness
- *Absence of periods
> Amenorrhoea was removed as a criterion in DSM-5.

Q: An adult with anorexia has a BMI of 14.6. Severity is:
- Mild
- Moderate
- Severe
- *Extreme
> Below 15 is extreme.
:::

## 2.2 Bulimia, binge-eating disorder, ARFID, pica and rumination [core][beginner]
### Bulimia nervosa
- Repeated **binge eating**: eating an amount clearly larger than most people would in a similar time, with a **sense of loss of control**.
- Repeated **compensatory behaviour** to prevent weight gain: vomiting, laxatives, diuretics, fasting, excessive exercise, misuse of insulin in diabetes.
- Both happen regularly over a sustained period.
- **Self-worth is unduly tied to shape and weight**.
- It does not happen only during episodes of anorexia.

Signs to look for: swollen salivary glands (puffy cheeks), dental erosion, calluses on the knuckles from inducing vomiting (**Russell's sign**), low potassium, and a high blood bicarbonate (metabolic alkalosis) from vomiting.

### Binge-eating disorder
- Repeated binges with loss of control, with **at least three** of: eating much faster than normal, eating until uncomfortably full, eating large amounts when not hungry, eating alone because of embarrassment, and feeling disgusted, depressed or guilty afterwards.
- **Marked distress**, and **no regular compensatory behaviour**.
- The commonest eating disorder, affecting men more than other eating disorders do; often linked to obesity, diabetes and depression.

:::widget guess
{"prompt": "For bulimia and binge-eating disorder, binges (and, in bulimia, compensatory behaviours) must happen on average at least how many times a week?", "min": 0, "max": 7, "unit": "times a week", "answer": [1, 1], "reveal": "At least once a week, sustained over a long period. Severity in bulimia is rated by how many compensatory episodes happen per week; in binge-eating disorder, by the number of binges per week.", "clinician": "DSM-5-TR: binge eating and inappropriate compensatory behaviours both occur, on average, at least once a week for 3 months (bulimia); binge eating at least once a week for 3 months (BED). Bulimia severity by compensatory episodes per week: mild 1 to 3, moderate 4 to 7, severe 8 to 13, extreme 14 or more. BED severity by binges per week: mild 1 to 3, moderate 4 to 7, severe 8 to 13, extreme 14 or more."}
:::

### ARFID, pica and rumination
- **ARFID** (avoidant/restrictive food intake disorder): avoidance or restriction of food because of **sensory dislike**, **fear of choking or vomiting**, or **low interest in eating**, causing weight loss or poor growth, nutritional deficiency, dependence on supplements or tube feeding, or social problems. No body image disturbance. Common in autistic children, but also in adults.
- **Pica**: persistently eating non-food substances (soil, chalk, paint, ice, hair) beyond the age when this is normal. Seen with iron deficiency, pregnancy, intellectual disability and autism. Check for **iron deficiency, lead poisoning** and gut blockage.
- **Rumination disorder**: repeated regurgitation of food, which is re-chewed, re-swallowed or spat out, not due to a gut disease.

:::widget sort
{"prompt": "Which diagnosis fits best? Place each person.", "buckets": ["Bulimia nervosa", "Binge-eating disorder", "ARFID", "Pica"], "items": [{"text": "A 3-year-old in a village in Jharkhand eats soil daily; her haemoglobin is low", "bucket": 3}, {"text": "A 28-year-old binges on sweets and then takes twenty laxatives, several times a week", "bucket": 0, "why": "Laxative use after binges is compensatory behaviour, so this is bulimia, not binge-eating disorder."}, {"text": "A 45-year-old man binges at night with shame and distress, no vomiting or fasting, BMI 32", "bucket": 1}, {"text": "A 12-year-old who eats only five foods since he vomited at a restaurant, and has lost weight", "bucket": 2}, {"text": "A 20-year-old with puffy cheeks, eroded teeth and calluses on her knuckles", "bucket": 0}, {"text": "A pregnant woman with strong cravings to eat ice and chalk", "bucket": 3}]}
:::

:::clinician
### Treatment overview (details in section 3.1)
- **Bulimia**: CBT-E or CBT-BN (about 20 sessions) is first-line; guided self-help for milder cases; **fluoxetine 60 mg** is the best-evidenced medicine (higher than the antidepressant dose), reducing binge and purge frequency. Avoid bupropion (seizure risk with purging). Monitor potassium; avoid laxative abrupt withdrawal without support (rebound oedema and constipation).
- **Binge-eating disorder**: CBT, guided self-help; **lisdexamfetamine** (30 mg, increasing by 20 mg weekly to 50 to 70 mg) is FDA-approved for moderate to severe BED in adults (not marketed in India); topiramate (off-label) reduces binges and weight; behavioural weight management. As of Nov 2026, GLP-1 agonists are being studied for BED with promising early data.
- **ARFID**: exposure-based CBT (CBT-AR), family involvement, dietetic support, treat anxiety; occupational therapy for sensory issues.
- **Pica**: correct iron and zinc deficiency, test lead, behavioural approaches, environmental safety.
- **Dental and medical**: dental review; avoid brushing immediately after vomiting (rinse instead).
:::

:::recall
1. What two behaviours define bulimia nervosa? || Repeated binge eating with loss of control, and repeated compensatory behaviours.
2. Name three of the five binge-eating disorder features. || Eating rapidly, until uncomfortably full, large amounts when not hungry, alone from embarrassment, disgust or guilt afterwards.
3. What is Russell's sign? || Calluses on the knuckles from inducing vomiting.
4. What must be checked in a child with pica? || Iron deficiency and lead poisoning.
5. Which medicine and dose has the best evidence in bulimia? || Fluoxetine 60 mg daily.
:::

:::mcq
Q: Low potassium and raised bicarbonate in a young woman of normal weight with dental erosion suggest:
- Anorexia nervosa, restricting type
- *Self-induced vomiting, as in bulimia nervosa
- Binge-eating disorder
- ARFID
> Metabolic alkalosis from vomiting.

Q: Which feature distinguishes binge-eating disorder from bulimia?
- Loss of control
- Distress
- *Absence of regular compensatory behaviour
- Normal weight
> No regular vomiting, laxatives or fasting.
:::

## 2.3 Insomnia, sleepiness and breathing in sleep [core][beginner]
### Insomnia disorder
Insomnia disorder means persistent dissatisfaction with sleep: **difficulty falling asleep, staying asleep, or waking too early** and being unable to get back to sleep, happening regularly over a long period, **despite adequate opportunity to sleep**, and causing daytime problems (tiredness, irritability, poor concentration, worry about sleep).

Insomnia often begins with a stressor, then **keeps going** because of habits and fears that develop around sleep: spending long hours in bed awake, napping, worrying about not sleeping, checking the clock, and using alcohol or sleeping pills.

:::widget sort
{"prompt": "Keeps insomnia going, or helps break it? Place each habit.", "buckets": ["Keeps insomnia going", "Helps break it"], "items": [{"text": "Staying in bed for ten hours to 'catch up'", "bucket": 0, "why": "Lying awake in bed weakens the link between bed and sleep."}, {"text": "Getting up at the same time every morning, however the night went", "bucket": 1, "why": "A fixed wake time anchors the body clock and builds sleep pressure for the next night."}, {"text": "Leaving the bed if unable to sleep, and returning only when sleepy", "bucket": 1}, {"text": "Watching the clock and calculating how many hours are left", "bucket": 0}, {"text": "Limiting time in bed to roughly the hours actually slept, then gradually extending", "bucket": 1, "why": "Sleep restriction builds sleep pressure."}, {"text": "Taking a sleeping pill nightly for years", "bucket": 0}, {"text": "Writing worries down earlier in the evening", "bucket": 1}]}
:::

### Excessive daytime sleepiness
**Sleepiness** (dozing off) is different from **tiredness** (feeling drained). Causes of sleepiness:
- **Not enough sleep**: the commonest cause.
- **Obstructive sleep apnoea**: the throat collapses repeatedly during sleep, breathing stops, oxygen drops, and the person partly wakes many times without knowing. Signs: loud snoring, witnessed pauses, gasping, morning headaches, high blood pressure, a thick neck, obesity.
- **Narcolepsy**: a brain disorder in which the chemical **orexin** (hypocretin), which keeps us awake, is lost. Features: sudden irresistible sleep attacks, **cataplexy** (sudden muscle weakness triggered by laughter or strong emotion), **sleep paralysis** (unable to move on waking or falling asleep), **vivid hallucinations** at sleep onset or waking, and broken night sleep.
- **Medicines and substances**: sedatives, antipsychotics, antihistamines, alcohol.
- **Depression**, other medical conditions.

:::widget decide
{"scene": "Mr Bhatia, 52, a truck driver from Ludhiana, is referred for 'depression' because he is always tired, falls asleep at traffic signals, and has morning headaches. His wife says he snores like a 'tractor' and sometimes stops breathing at night, then gasps. His BMI is 34 and blood pressure is high.", "ask": "What do you do?", "choices": [{"label": "Start an antidepressant for his tiredness", "verdict": "ok", "outcome": "He feels no better and has a near-miss road accident.", "why": "Depression can cause tiredness, but loud snoring, witnessed apnoeas, morning headaches and dozing off strongly suggest obstructive sleep apnoea."}, {"label": "Recognise probable obstructive sleep apnoea: advise him not to drive while sleepy, refer for a sleep study, and discuss weight loss and treatment with CPAP", "verdict": "best", "outcome": "The sleep study shows severe sleep apnoea. On CPAP he feels alert within weeks, his blood pressure improves, and his 'depression' lifts.", "why": "Sleep apnoea is common, dangerous for drivers, and very treatable. Driving safety must be addressed immediately."}, {"label": "Prescribe a sleeping tablet for better sleep", "verdict": "harm", "outcome": "His breathing pauses worsen at night and his sleepiness increases.", "why": "Sedatives worsen sleep apnoea and can be dangerous."}]}
:::

:::clinician
### Criteria and assessment
- **Insomnia disorder** (DSM-5-TR): difficulty initiating or maintaining sleep or early-morning awakening, at least 3 nights a week, for at least 3 months, despite adequate opportunity, with distress or impairment; not better explained by another sleep-wake disorder or substance. "Episodic" if 1 to 3 months. Spielman's **3P model**: predisposing, precipitating and perpetuating factors.
- **Hypersomnolence disorder**: excessive sleepiness despite at least 7 hours of main sleep, with recurrent lapses into sleep, prolonged unrefreshing sleep (9 hours or more) or difficulty being fully awake after abrupt awakening, at least 3 times a week for at least 3 months.
- **Narcolepsy**: recurrent periods of irresistible need to sleep, lapses or naps at least 3 times a week over 3 months, plus at least one of: cataplexy; hypocretin deficiency (CSF hypocretin-1 of 110 pg/mL or less, or one third of normal); nocturnal PSG REM latency of 15 minutes or less, or MSLT mean sleep latency of 8 minutes or less with two or more sleep-onset REM periods. Type 1 (with cataplexy or hypocretin deficiency) and type 2. HLA-DQB1*06:02 in nearly all type 1. Peak onset in adolescence; diagnostic delay often 10 years or more.
- **Obstructive sleep apnoea hypopnoea**: on PSG, at least 5 obstructive apnoeas or hypopnoeas per hour with symptoms (snoring, gasping, unrefreshing sleep, sleepiness), or 15 or more per hour regardless of symptoms. Severity: mild 5 to 14, moderate 15 to 29, severe 30 or more per hour (apnoea-hypopnoea index). **STOP-BANG**: Snoring, Tiredness, Observed apnoea, Pressure (hypertension), BMI above 35, Age above 50, Neck circumference above 40 cm, male Gender; 3 or more suggests risk.
- **OSA and psychiatry**: common in people on antipsychotics with weight gain; untreated OSA worsens depression, cognition and blood pressure; avoid benzodiazepines and opioids where possible; sodium oxybate is contraindicated in untreated OSA.
- **Driving**: advise patients with excessive sleepiness not to drive until treated; occupational drivers need specific advice and documentation.
:::

:::recall
1. What are the three complaints of insomnia disorder? || Difficulty falling asleep, staying asleep, or waking too early, with daytime impairment.
2. Name three habits that keep insomnia going. || Long time in bed awake, napping, clock-watching and worry, alcohol or long-term sleeping pills.
3. Name four signs of obstructive sleep apnoea. || Loud snoring, witnessed pauses, gasping, morning headache, daytime sleepiness, obesity, hypertension, thick neck.
4. Name the classic narcolepsy features. || Sleep attacks, cataplexy, sleep paralysis, hypnagogic or hypnopompic hallucinations, broken night sleep.
5. Which brain chemical is lost in narcolepsy type 1? || Orexin (hypocretin).
:::

:::mcq
Q: A 17-year-old has sudden sleep attacks in class and collapses at the knees whenever she laughs, while staying conscious. The most likely diagnosis is:
- Epilepsy
- *Narcolepsy with cataplexy
- Functional seizures
- Sleep apnoea
> Emotion-triggered weakness with preserved awareness is cataplexy.

Q: Which is the best first-line treatment for chronic insomnia disorder in adults?
- Long-term zolpidem
- *Cognitive behavioural therapy for insomnia (CBT-I)
- Alcohol at night
- Antipsychotics
> CBT-I is first-line in all major guidelines.
:::

## 2.4 Body clock problems and parasomnias [core][beginner]
### Circadian rhythm sleep-wake disorders
When the body clock is out of step with the timing a person needs:
- **Delayed sleep phase**: cannot fall asleep until very late (often 2 to 3 a.m.) and cannot wake early; common in adolescents.
- **Advanced sleep phase**: sleepy very early in the evening and waking very early; more in older adults.
- **Shift work type**: insomnia and sleepiness from night or rotating shifts (common in IT, call centres, hospitals, transport).
- **Jet lag**: after crossing time zones.
- **Non-24-hour type**: the clock drifts later each day; common in totally blind people.

**Light** and **melatonin**, timed correctly, shift the body clock: morning light pulls it earlier; evening light pushes it later.

### Parasomnias: unusual events in sleep
**NREM parasomnias** (from deep sleep, usually in the **first third of the night**, more in children):
- **Sleepwalking**: getting up and walking, with blank face, hard to wake, little or no memory.
- **Sleep terrors**: sudden screaming with intense fear, racing heart, sweating, hard to comfort, no memory in the morning.
- **Confusional arousals** and sleep-related eating.

**REM parasomnias** (from dreaming sleep, usually in the **later part of the night**):
- **Nightmare disorder**: repeated frightening dreams, with **clear memory** on waking; common after trauma.
- **REM sleep behaviour disorder**: acting out dreams (punching, kicking, shouting) because the normal muscle paralysis of REM is lost; mostly in older men; a strong early warning sign of **Parkinson's disease and Lewy body dementia**.
- **Sleep paralysis**: briefly unable to move on waking or falling asleep, often with a sense of a presence; common and usually harmless.

### Restless legs syndrome
An **urge to move the legs**, often with unpleasant sensations, that starts or worsens **at rest** and **in the evening or night**, and is **relieved by movement**. Linked to **iron deficiency**, kidney failure, pregnancy, and some medicines (antidepressants, antihistamines, antipsychotics).

:::widget sort
{"prompt": "NREM parasomnia, REM parasomnia, or other? Place each.", "buckets": ["NREM parasomnia", "REM parasomnia", "Restless legs"], "items": [{"text": "A 6-year-old screams and thrashes an hour after falling asleep, cannot be comforted, and remembers nothing", "bucket": 0, "why": "Sleep terror."}, {"text": "A 68-year-old man punches his wife in his sleep while dreaming of fighting robbers, and remembers the dream", "bucket": 1, "why": "REM sleep behaviour disorder."}, {"text": "A 30-year-old wakes from vivid dreams of the accident, recalls them clearly, and can't get back to sleep", "bucket": 1, "why": "Nightmare disorder."}, {"text": "A 10-year-old walks to the kitchen at night with a blank stare and has no memory", "bucket": 0}, {"text": "A pregnant woman feels a crawling urge to move her legs every evening, eased only by walking", "bucket": 2}, {"text": "A student wakes unable to move for a few seconds, sensing someone in the room", "bucket": 1, "why": "Sleep paralysis, an intrusion of REM features into wakefulness."}]}
:::

:::widget decide
{"scene": "Mrs Rao's son, Arjun, 7, from Visakhapatnam, has episodes two or three times a month, about an hour after falling asleep, of sitting up screaming with wide eyes and sweating. He doesn't recognise his parents and settles after a few minutes. In the morning he remembers nothing. His grandmother says he is possessed and wants an exorcism.", "ask": "What do you advise?", "choices": [{"label": "Agree with an exorcism ritual and rousing him fully during episodes", "verdict": "harm", "outcome": "Waking him during episodes makes them longer and more frightening, and the ritual frightens him.", "why": "These are sleep terrors, a common, harmless NREM parasomnia in children. Waking the child during an episode prolongs confusion."}, {"label": "Explain sleep terrors (common in children, usually outgrown), keep him safe without waking him fully, ensure regular and sufficient sleep, reduce stress and screens before bed, and consider scheduled awakenings if they are frequent", "verdict": "best", "outcome": "With an earlier, regular bedtime the episodes become rare. The family is reassured.", "why": "Sleep terrors are worsened by sleep deprivation and irregular schedules. Safety, reassurance and good sleep habits are usually enough."}, {"label": "Start a sleeping pill", "verdict": "harm", "outcome": "He becomes drowsy at school; the episodes continue.", "why": "Medicines are rarely needed in childhood sleep terrors."}]}
:::

:::clinician
### Depth notes
- **Delayed sleep-wake phase disorder**: treat with low-dose melatonin (0.5 to 3 mg) about 3 to 5 hours before the habitual sleep onset, bright light on waking, and fixed wake time; gradually advance. Common in adolescents and in ADHD.
- **Shift work disorder**: planned naps, bright light during the shift, dark sunglasses on the way home, blackout curtains, melatonin before daytime sleep; modafinil or armodafinil for sleepiness during shifts (licensed in some countries).
- **NREM parasomnias**: precipitated by sleep deprivation, fever, stress, alcohol, sedatives (zolpidem-related complex sleep behaviours carry an FDA boxed warning), sleep apnoea and restless legs. Safety measures; scheduled awakenings 15 to 30 minutes before the usual time; clonazepam 0.25 to 1 mg at bedtime for dangerous adult cases.
- **Nightmare disorder**: imagery rehearsal therapy; prazosin (1 mg at night, increasing to 3 to 15 mg) had positive early trials but a large trial in veterans was negative (2018); still used.
- **REM sleep behaviour disorder**: confirm with PSG (REM sleep without atonia); bedroom safety; melatonin 3 to 12 mg or clonazepam 0.25 to 1 mg; antidepressants (SSRIs, SNRIs, mirtazapine) can trigger or worsen it. Idiopathic RBD converts to a synucleinopathy (Parkinson's, DLB, multiple system atrophy) in about 70% to 90% over 10 to 15 years (about 6% a year).
- **Restless legs syndrome**: check ferritin and transferrin saturation; give iron if ferritin is 75 micrograms per litre or less or saturation below 20% (oral or IV); stop aggravating drugs; the AASM 2024 guideline recommends gabapentin enacarbil, gabapentin or pregabalin and IV iron, and recommends against standard use of dopamine agonists (pramipexole, ropinirole, rotigotine) because of **augmentation** (symptoms becoming earlier, stronger and spreading). Low-dose opioids for refractory cases.
:::

:::recall
1. When do NREM parasomnias usually occur, and is there memory of them? || In the first third of the night; little or no memory.
2. How do nightmares differ from sleep terrors? || Nightmares occur in REM sleep later in the night with clear dream recall; sleep terrors arise from deep NREM sleep early in the night without recall.
3. What is REM sleep behaviour disorder a warning sign of? || Parkinson's disease, Lewy body dementia and related synucleinopathies.
4. Give the four features of restless legs syndrome. || Urge to move the legs, worse at rest, worse in the evening or night, relieved by movement.
5. What blood test should be checked in restless legs? || Ferritin (iron stores).
:::

:::mcq
Q: A 70-year-old man has shouted and kicked in his sleep for years, acting out dreams. This most increases his future risk of:
- Alzheimer's disease
- *Parkinson's disease or Lewy body dementia
- Schizophrenia
- Narcolepsy
> RBD is a prodromal synucleinopathy.

Q: A teenager who cannot sleep before 3 a.m. and cannot wake for school most likely needs:
- Long-term hypnotics
- *Correctly timed melatonin, morning light and a fixed wake time
- Antipsychotics
- More naps
> Delayed sleep phase is shifted with light and melatonin.
:::

## 2.5 Somatic symptom, illness anxiety, functional and factitious disorders [core][beginner]
### Somatic symptom disorder
- One or more **body symptoms** that are distressing or disrupt daily life.
- **Excessive thoughts, feelings or behaviours** about them: persistent, disproportionate worry about how serious they are; constant high anxiety about health; or a great deal of time and energy devoted to them.
- Lasting a long time (though any one symptom may come and go).

The symptoms **may or may not** be medically explained. The disorder is defined by the **excessive response**, not by the absence of a medical cause.

### Illness anxiety disorder
- **Preoccupation with having or getting a serious illness**.
- Body symptoms are **absent or mild**.
- High health anxiety; easily alarmed.
- Either **excessive checking** (examining the body, searching online, seeking reassurance and tests) or **avoidance** of doctors and hospitals.

### Functional neurological disorder (conversion disorder)
- Symptoms of altered movement or sensation: weakness, tremor, jerks, gait problems, seizures, numbness, loss of vision or speech, swallowing difficulty.
- **Clinical findings show incompatibility** with known neurological disease: the diagnosis is made on **positive signs**, not just normal tests.
- Stressful events are common but **not required** for the diagnosis.

Positive signs include:
- **Hoover's sign**: a weak leg that cannot push down on request, but pushes down strongly when the other leg lifts.
- **Tremor entrainment**: the tremor changes rhythm to match a rhythm tapped by the other hand.
- **Functional seizures**: long duration, eyes closed and resisting opening, side-to-side head movements, waxing and waning movements, crying afterwards, memory of the event; video-EEG is normal during the attack.

### Factitious disorder and malingering
- **Factitious disorder imposed on self**: deliberately faking, exaggerating or inducing symptoms (for example injecting insulin, contaminating wounds), presenting as ill, even without obvious external rewards.
- **Factitious disorder imposed on another** (formerly Munchausen by proxy): a carer, usually a parent, fabricates or induces illness in a child or dependent. This is **child abuse**.
- **Malingering**: faking for clear **external incentives** (money, avoiding duty, drugs, legal benefit). Not a mental disorder.

:::widget sort
{"prompt": "Which diagnosis fits best? Place each person.", "buckets": ["Somatic symptom disorder", "Illness anxiety disorder", "Functional neurological disorder", "Factitious disorder"], "items": [{"text": "Has back pain from a real disc problem, but spends most of the day researching it, fears paralysis and has stopped all activity", "bucket": 0, "why": "A real symptom with an excessive, disabling response."}, {"text": "Has no symptoms but is convinced a mole is cancer, checks it hourly and has seen eight dermatologists", "bucket": 1}, {"text": "Cannot move her right leg, but Hoover's sign is positive and an MRI is normal", "bucket": 2}, {"text": "A nurse with repeated unexplained low blood sugars is found to be injecting insulin secretly, with no financial gain", "bucket": 3}, {"text": "Avoids all doctors because he is sure they will find a fatal illness", "bucket": 1, "why": "The care-avoidant type of illness anxiety disorder."}, {"text": "A mother repeatedly brings her child for 'fits' that no one else has seen; blood tests show sedatives the child was never prescribed", "bucket": 3, "why": "Factitious disorder imposed on another: a child protection emergency."}]}
:::

### Dhat syndrome
A culture-related presentation seen across South Asia: young men attribute weakness, fatigue, poor concentration, sexual problems or anxiety to the **loss of semen** (in urine, at night, or through masturbation), which they believe is a vital essence. It often hides **depression, anxiety or sexual dysfunction**. Helpful care: respectful listening, clear education about sexual physiology, treating underlying anxiety or depression, and avoiding ridicule.

:::widget decide
{"scene": "Ramesh, 22, a student from a small town in Uttar Pradesh, comes with tiredness, poor concentration and 'weakness in the body'. He is sure this is because he 'loses dhat' in his urine and at night, and has spent money on herbal remedies. He feels guilty about masturbation and is anxious about his upcoming marriage.", "ask": "What is the most helpful approach?", "choices": [{"label": "Laugh and tell him it is a myth and he should stop worrying", "verdict": "harm", "outcome": "He feels humiliated and goes to another 'sex clinic' that sells him more remedies.", "why": "Ridicule destroys trust. His distress is real and culturally shaped."}, {"label": "Listen respectfully, explain sexual physiology simply and accurately (semen is constantly produced; its loss does not cause weakness), ask about mood, anxiety, sleep and marriage worries, and treat any depression or anxiety", "verdict": "best", "outcome": "He is relieved by the explanation, screens positive for anxiety and depression, starts treatment and counselling, and feels better before his marriage.", "why": "Culturally sensitive education plus treatment of underlying distress is effective in Dhat syndrome."}, {"label": "Order many tests to prove there is no problem", "verdict": "ok", "outcome": "The tests are normal but he believes the doctor missed something.", "why": "Tests alone rarely reassure; education and treating distress help more."}]}
:::

:::clinician
### Criteria and management
- **Somatic symptom disorder** (DSM-5-TR): A. one or more distressing or disruptive somatic symptoms; B. at least one of disproportionate persistent thoughts about seriousness, persistently high anxiety about health or symptoms, or excessive time and energy devoted; C. persistence (typically more than 6 months). Specifiers: with predominant pain; persistent; severity by number of B features. ICD-11: **bodily distress disorder** (6C20), mild, moderate or severe.
- **Illness anxiety disorder**: at least 6 months; care-seeking or care-avoidant. ICD-11 places **hypochondriasis** within obsessive-compulsive and related disorders.
- **FND** (DSM-5-TR "functional neurological symptom disorder"): subtypes weakness or paralysis, abnormal movement, swallowing, speech, attacks or seizures, anaesthesia or sensory loss, special sensory, mixed; acute (under 6 months) or persistent; with or without psychological stressor. ICD-11: dissociative neurological symptom disorder (6B60).
- **Management principles**: one consistent clinician; regular scheduled appointments rather than symptom-driven visits; validate and explain positively (for FND, demonstrate positive signs to the patient); limit investigations to what is clinically indicated; treat depression and anxiety (SSRIs, SNRIs, tricyclics at low dose for pain); CBT; graded activity; physiotherapy for functional motor symptoms; avoid opioids and unnecessary procedures.
- **Factitious disorder**: rare (perhaps about 1% of hospital patients); often health workers; confront non-punitively, with a team approach and attention to safety; FDIA requires immediate child protection referral.
- **Malingering**: document observations objectively; consider legal and forensic contexts; symptom validity tests in neuropsychology.
- **Dhat**: first described by the Indian psychiatrist N. N. Wig in 1960; often comorbid with depression (around 40% to 60%), anxiety and erectile dysfunction or early ejaculation in Indian case series.
:::

:::recall
1. What defines somatic symptom disorder? || Distressing body symptoms with excessive thoughts, feelings or behaviours about them, over a long period.
2. How does illness anxiety differ from somatic symptom disorder? || In illness anxiety, symptoms are absent or mild and the focus is fear of having an illness.
3. How is functional neurological disorder diagnosed? || On positive clinical signs of incompatibility with neurological disease, not just normal tests.
4. What is Hoover's sign? || Weak hip extension on request that becomes strong when the opposite hip flexes against resistance.
5. Why is factitious disorder imposed on another an emergency? || It is a form of child or dependent abuse needing protection.
:::

:::mcq
Q: The diagnosis of somatic symptom disorder requires:
- That the symptoms have no medical explanation
- *An excessive response of thoughts, feelings or behaviours to the symptoms
- A history of trauma
- Hallucinations
> The response, not the explanation, defines it.

Q: Which sign suggests a functional rather than epileptic seizure?
- Tongue biting on the side
- Incontinence
- *Eyes tightly closed with resistance to opening, and side-to-side head movement
- Post-ictal confusion
> Video-EEG confirms.
:::

## 2.6 Dissociative disorders and culture [core][beginner]
### Depersonalisation/derealisation disorder
Persistent or repeated experiences of **unreality, detachment or being an outside observer** of one's thoughts, feelings, body or actions (depersonalisation), or of the surroundings seeming **unreal, dreamlike, foggy or lifeless** (derealisation). **Reality testing stays intact**: the person knows it is a feeling, not a fact. Often triggered by severe stress, anxiety, panic or drugs such as cannabis.

### Dissociative amnesia
Inability to recall important autobiographical information, usually about a **traumatic or stressful** event, that is too extensive to be ordinary forgetting. Most often **localised** (a period of time) or **selective** (parts of an event). Sometimes with **dissociative fugue**: purposeful travel or bewildered wandering with amnesia for identity.

### Dissociative identity disorder (DID)
Disruption of identity by **two or more distinct personality states**, with discontinuity in sense of self and agency, and **recurrent gaps in memory** for everyday events or personal information. Usually linked to severe, repeated childhood trauma in clinical accounts. It is **controversial**: some experts see it as a result of severe early trauma; others argue that suggestion, media and some therapy practices shape how distress is expressed.

### Trance and possession in India
Possession and trance experiences are common in many Indian religious and cultural settings (temples, dargahs, festivals) and are **not** disorders when they are **culturally accepted, voluntary and not distressing**. A disorder is considered when episodes are **involuntary, distressing, outside accepted practice, and impairing**, for example a young woman who is repeatedly "possessed" at home after conflict with her in-laws and cannot carry out her daily life.

:::widget sort
{"prompt": "Cultural practice or possible dissociative disorder? Place each.", "buckets": ["Accepted cultural or religious practice", "Possible dissociative disorder"], "items": [{"text": "A devotee enters a trance during a temple festival, as expected in that ritual, and is well afterwards", "bucket": 0}, {"text": "A newly married woman has repeated episodes at home of speaking in another voice as a goddess, with amnesia and distress, unable to cook or work", "bucket": 1}, {"text": "A priest becomes 'possessed' each year during a village ceremony, by tradition", "bucket": 0}, {"text": "A schoolgirl after exams has repeated sudden falls with unresponsiveness and no memory, causing her to miss school", "bucket": 1, "why": "Possible functional (dissociative) seizures."}, {"text": "A man is found in another city with no memory of his name, weeks after a business collapse", "bucket": 1, "why": "Dissociative amnesia with fugue."}, {"text": "A woman sings and sways in religious ecstasy at a dargah gathering, enjoying it", "bucket": 0}]}
:::

:::widget decide
{"scene": "Kavitha, 19, from a village near Madurai, married eight months ago. She has had repeated episodes of falling to the floor, shaking and speaking in a man's voice, saying she is the spirit of her late uncle. She has no memory afterwards. Her in-laws have taken her to several temples. In private, she says she is not allowed to visit her parents and is criticised for not becoming pregnant.", "ask": "What is the most helpful approach?", "choices": [{"label": "Tell the family she is pretending for attention", "verdict": "harm", "outcome": "The episodes become more frequent; she is punished at home.", "why": "Dissociative episodes are not deliberate. Blame worsens distress and risk."}, {"label": "Recognise a probable dissociative disorder linked to stress; respect the family's beliefs while explaining the link with stress; meet Kavitha alone to explore her situation and safety; involve the family in reducing stress (such as visits to her parents); offer psychological therapy and treat any depression", "verdict": "best", "outcome": "With the family agreeing to regular visits to her parents and less pressure about pregnancy, plus counselling, her episodes reduce sharply. Her husband becomes more supportive.", "why": "Dissociative states in young married women often express distress and lack of voice. Exploring stressors, safety and family dynamics, without dismissing culture, works best."}, {"label": "Start an antipsychotic for 'hearing a spirit'", "verdict": "harm", "outcome": "She becomes drowsy and gains weight; the episodes continue.", "why": "This is not psychosis. Antipsychotics are not a treatment for dissociation."}]}
:::

:::clinician
### Depth notes
- **DID criteria** (DSM-5-TR): two or more distinct personality states or an experience of possession; recurrent gaps in recall; distress or impairment; not part of broadly accepted cultural or religious practice; not due to substances or a medical condition (for example complex partial seizures). In children, not better explained by imaginary playmates. Community prevalence estimates about 1% to 1.5% (contested). The **trauma model** (2012) versus the **sociocognitive model** (Lilienfeld, Lynn and colleagues); integrative views are increasingly common.
- **Treatment** of DID and complex dissociation: phase-oriented treatment (ISSTD guidelines): safety and stabilisation, trauma processing, integration and rehabilitation; the TOP DD naturalistic study reported improvement; RCT evidence is limited. Avoid techniques that may encourage elaboration of identities (for example hypnosis to "find alters").
- **Depersonalisation/derealisation disorder**: prevalence about 1% to 2%; onset in adolescence; SSRIs and lamotrigine have limited evidence (lamotrigine combined with SSRIs in some studies); CBT targeting catastrophic interpretations and avoidance; treat comorbid anxiety and depression.
- **Dissociative amnesia**: rule out organic causes (head injury, transient global amnesia, epilepsy, intoxication, Korsakoff's); memory usually returns.
- **ICD-11 possession trance disorder (6B63)**: trance states with replacement of identity by an external "possessing" identity attributed to a spirit, power or deity, involuntary, not part of collective cultural or religious practice; **trance disorder (6B62)** without replacement of identity. Indian clinical series show dissociative and conversion presentations are commoner in young women from rural areas with limited education and autonomy, often with family conflict.
- **Mass psychogenic illness**: episodes in Indian schools and factories (fainting, breathlessness, possession) spread through social contagion; respond calmly, separate affected people, give clear information, avoid over-medicalisation.
:::

:::recall
1. What is preserved in depersonalisation/derealisation disorder? || Reality testing: the person knows the experience is not real.
2. What is dissociative fugue? || Purposeful travel or bewildered wandering with amnesia for identity or other personal information.
3. Why is DID controversial? || Debate between a trauma model and a sociocognitive model in which suggestion and culture shape expression.
4. When is a possession experience considered a disorder? || When it is involuntary, distressing, impairing and outside accepted cultural or religious practice.
:::

:::mcq
Q: A man is found in another state with no memory of who he is, soon after his business failed. Medical tests are normal. The most likely diagnosis is:
- Dementia
- *Dissociative amnesia with dissociative fugue
- Delirium
- Malingering always
> Rule out organic causes first.

Q: Which treatment is NOT appropriate for dissociative episodes without psychosis?
- Exploring stressors
- Psychological therapy
- Family work
- *Antipsychotic medication as first-line
> Antipsychotics do not treat dissociation.
:::

## 2.7 Sexual dysfunctions, gender dysphoria and paraphilic disorders [core][beginner]
### Sexual dysfunctions
Sexual problems are common and often treatable. A dysfunction is diagnosed when a problem is **persistent**, occurs on **most occasions**, causes **distress**, and is not better explained by another condition, relationship problems, or a medicine (in which case it is substance/medication-induced).

| Problem | In plain words |
|---|---|
| **Erectile disorder** | Difficulty getting or keeping an erection, or reduced rigidity |
| **Premature (early) ejaculation** | Ejaculation very soon after penetration, before the person wishes, most of the time |
| **Delayed ejaculation** | Marked delay or inability to ejaculate |
| **Male hypoactive sexual desire disorder** | Persistently low or absent sexual thoughts and desire |
| **Female sexual interest/arousal disorder** | Reduced or absent interest, arousal or pleasure |
| **Female orgasmic disorder** | Marked delay, rarity or absence of orgasm, or reduced intensity |
| **Genito-pelvic pain/penetration disorder** | Difficulty with penetration, pain, fear of pain, or tightening of pelvic floor muscles (previously vaginismus and dyspareunia) |

**Causes** are usually a mix: **physical** (diabetes, high blood pressure, heart disease, smoking, low testosterone, thyroid problems), **medicines** (SSRIs, antipsychotics, beta-blockers, finasteride), **psychological** (anxiety, depression, performance worry, guilt, trauma), and **relationship** factors.

:::widget sort
{"prompt": "Which cause is most likely? Place each.", "buckets": ["Physical or medical", "Medicine-related", "Psychological or relationship"], "items": [{"text": "A 55-year-old diabetic smoker with gradual loss of erections at all times, including on waking", "bucket": 0, "why": "Gradual, constant loss with vascular risk factors points to a physical cause."}, {"text": "A 28-year-old with erection problems only with his new wife, but normal morning erections", "bucket": 2, "why": "Normal morning and self-stimulation erections suggest a psychological cause such as performance anxiety."}, {"text": "A woman who cannot reach orgasm since starting paroxetine", "bucket": 1}, {"text": "A man with schizophrenia on risperidone with low desire, breast swelling and high prolactin", "bucket": 1}, {"text": "A newly married woman with fear and tightening on attempted penetration after a traumatic first night", "bucket": 2}, {"text": "A 50-year-old man with low desire, tiredness and low morning testosterone", "bucket": 0}]}
:::

### Gender dysphoria
**Gender dysphoria** is distress caused by a marked difference between a person's **experienced or expressed gender** and the **sex assigned at birth**, lasting over time. Not every transgender person has dysphoria, and being transgender is not a disorder. In ICD-11, **gender incongruence** has been moved out of the mental disorders chapter into a chapter on sexual health, to reduce stigma while keeping access to care.

Supportive care includes: respecting the person's name and pronouns, assessing and treating any depression, anxiety or suicide risk (rates are high because of discrimination), supporting families, and, for those who want it, access to **gender-affirming medical care** (hormones, surgery) through specialist teams.

### Paraphilias and paraphilic disorders
A **paraphilia** is an intense, persistent sexual interest in unusual objects, situations or targets. It becomes a **paraphilic disorder** only when it causes **distress or impairment**, or when it involves **harm or risk of harm to others**, including acting on urges with **non-consenting people** or **children**. Examples: voyeuristic, exhibitionistic, frotteuristic (touching or rubbing against non-consenting people, for example in crowded buses and trains), sexual sadism, sexual masochism, paedophilic, fetishistic and transvestic disorders.

:::widget decide
{"scene": "Neha, 26, a software tester in Pune, was assigned male at birth. She has lived as a woman for two years and is seeking help for low mood after her family stopped speaking to her. She asks, 'Do you think I'm mentally ill for being trans?'", "ask": "What is the best response?", "choices": [{"label": "'Yes, gender dysphoria is a mental illness that we can try to cure.'", "verdict": "harm", "outcome": "She feels pathologised and does not return; her depression worsens.", "why": "Being transgender is not a mental illness, and attempts to change gender identity are harmful and unethical."}, {"label": "'Being transgender isn't a mental illness. Your low mood after losing your family's support is very understandable, and it's what we can help with together.' Then assess mood, safety and support, use her name and pronouns, and discuss family support and referral to affirming services if she wishes", "verdict": "best", "outcome": "She feels respected, engages in therapy for depression, joins a transgender support group, and later reconnects with her sister.", "why": "Affirming, non-judgemental care that addresses minority stress and depression is effective and ethical."}, {"label": "Avoid the question and focus only on medicines", "verdict": "ok", "outcome": "Her depression improves a little, but she feels unseen.", "why": "Medicines may help, but her question deserves an honest, respectful answer."}]}
:::

:::clinician
### Criteria, assessment and law
- **Sexual dysfunctions** (DSM-5-TR): minimum duration about 6 months; occurs on about 75% to 100% of occasions; clinically significant distress. Specify lifelong or acquired, generalised or situational, and severity. **Premature ejaculation**: within approximately 1 minute of vaginal penetration (criteria adapted for other sexual activities). Assessment: sexual history in private, with sensitivity; medicines; vascular risk factors; examination; glucose, lipids, morning testosterone, prolactin and thyroid where indicated.
- **Gender dysphoria** (DSM-5-TR, adolescents and adults): marked incongruence of at least 6 months, with at least two of six features (incongruence with primary or secondary sex characteristics; desire to be rid of them; desire for those of the other gender; desire to be of the other gender; desire to be treated as the other gender; conviction of having the feelings and reactions of the other gender), with distress or impairment. In children, six of eight, including a strong desire to be of the other gender.
- **India**: NALSA v Union of India (Supreme Court 2014) recognised transgender people's right to self-identify, including as a third gender; the **Transgender Persons (Protection of Rights) Act 2019** prohibits discrimination and provides identity certificates through the District Magistrate (criticised for requiring proof of surgery to change to male or female); **Navtej Singh Johar v Union of India** (2018) decriminalised consensual same-sex relations. The National Medical Commission (2022) declared conversion therapy professional misconduct after the Madras High Court's directions (S. Sushma, 2021).
- **Paraphilic disorders**: DSM-5-TR requires recurrent intense arousal for at least 6 months, acted on with a non-consenting person or causing distress or impairment. **Paedophilic disorder**: age at least 16 and at least 5 years older than the child (generally age 13 or younger). Obligations: POCSO reporting for any child at risk.
:::

:::recall
1. Name four groups of causes of sexual dysfunction. || Physical, medicine-related, psychological, relationship.
2. Which clue suggests a psychological rather than physical cause of erectile problems? || Normal morning or self-stimulation erections, with problems only in some situations.
3. Is being transgender a mental disorder? || No; gender dysphoria refers to distress, and ICD-11 places gender incongruence outside mental disorders.
4. When does a paraphilia become a paraphilic disorder? || When it causes distress or impairment, or involves harm or risk of harm to others, including non-consenting people or children.
:::

:::mcq
Q: Which medicine class most commonly causes delayed orgasm and ejaculation?
- Stimulants
- *SSRIs
- Antihistamines
- Thyroid hormone
> Serotonergic antidepressants.

Q: Under Indian law, which statement is correct?
- Same-sex relations between consenting adults are a crime
- *Conversion therapy has been declared professional misconduct by the National Medical Commission
- Transgender people cannot obtain identity documents
- Gender identity must be 'treated'
> NMC 2022 directive after the Madras High Court.
:::

## 2.8 Impulse control and elimination disorders [core][beginner]
### Impulse control disorders
These share a failure to resist an urge or impulse that is harmful, often with **rising tension before** and **relief or pleasure during or after** the act.

- **Intermittent explosive disorder (IED)**: repeated outbursts of verbal or physical aggression **far out of proportion** to the trigger, not planned, not for a goal, with distress or consequences. Between outbursts the person may be calm. Often begins in childhood or adolescence.
- **Kleptomania**: repeated failure to resist urges to steal objects **not needed** for personal use or their value. Not done in anger, revenge or because of delusions. Often linked to depression, anxiety and shame.
- **Pyromania**: deliberate fire-setting on more than one occasion, with **fascination** with fire, tension before and relief after, **not** for money, revenge, political reasons, concealment of a crime, or because of psychosis or intoxication. Rare; most fire-setting is not pyromania.

Related disorders placed elsewhere in DSM-5-TR:
- **Trichotillomania** (hair-pulling) and **excoriation** (skin-picking): body-focused repetitive behaviours in the obsessive-compulsive related chapter.
- **Gambling disorder**: in the addictions chapter.
- **Compulsive sexual behaviour disorder**: in ICD-11's impulse control disorders.

:::widget sort
{"prompt": "Which disorder fits? Place each person.", "buckets": ["Intermittent explosive disorder", "Kleptomania", "Pyromania", "Not an impulse control disorder"], "items": [{"text": "A bank clerk smashes his phone and punches walls over minor annoyances several times a year, and is deeply ashamed afterwards", "bucket": 0}, {"text": "A wealthy woman repeatedly steals cheap hairclips she never uses, feeling tension before and relief after", "bucket": 1}, {"text": "A man sets fire to his own shop to claim insurance", "bucket": 3, "why": "Fire-setting for money is arson, not pyromania."}, {"text": "A teenager repeatedly sets small fires because he is fascinated by flames and feels relief watching them", "bucket": 2}, {"text": "A woman pulls out her eyebrow hairs when anxious, leaving bald patches", "bucket": 3, "why": "Trichotillomania is classified with obsessive-compulsive related disorders."}, {"text": "A man steals food because his family is starving", "bucket": 3}]}
:::

### Elimination disorders (recap and adults)
Enuresis (wetting, from age five) and encopresis (soiling, from age four) are covered in detail in the Child and adolescent module. Points for adult psychiatry:
- **Medicine-induced enuresis**, especially with **clozapine** and some other antipsychotics: night-time wetting that is often hidden from embarrassment. Ask about it.
- **New incontinence in older adults** may signal infection, normal pressure hydrocephalus, dementia or delirium.
- **Wetting or soiling in a child who had been dry** may be a sign of stress, constipation or abuse.

:::widget decide
{"scene": "Sanjay, 29, has treatment-resistant schizophrenia and has done well on clozapine for six months. His mother quietly tells you he has been wetting the bed most nights and is so ashamed he wants to stop clozapine.", "ask": "What do you do?", "choices": [{"label": "Stop clozapine because of the side effect", "verdict": "harm", "outcome": "He relapses into psychosis within weeks and is admitted.", "why": "Clozapine is often the only effective antipsychotic in treatment resistance. Bedwetting is a known, manageable side effect."}, {"label": "Talk with Sanjay privately and without blame, explain that this is a known clozapine side effect, check for urine infection or diabetes, adjust dose timing, limit evening fluids, use a scheduled night-time toilet visit, and consider medicine (for example desmopressin with sodium monitoring) if needed", "verdict": "best", "outcome": "With fluid timing, a night alarm and a small dose change, the wetting becomes rare. He stays on clozapine and remains well.", "why": "Clozapine-induced enuresis is common, under-reported, and can usually be managed without stopping a life-changing medicine."}, {"label": "Ignore it; it is not important", "verdict": "harm", "outcome": "He stops clozapine secretly.", "why": "Embarrassing side effects drive non-adherence."}]}
:::

:::clinician
### Criteria and treatment
- **IED** (DSM-5-TR): recurrent outbursts of either verbal aggression or physical aggression without damage or injury, twice weekly on average for 3 months; or three outbursts involving damage or injury within 12 months; out of proportion; not premeditated; distress, impairment or legal or financial consequences; age at least 6. Lifetime prevalence about 2.7% (US). Treatment: CBT with relaxation and cognitive restructuring; **fluoxetine** (20 to 60 mg) reduced impulsive aggression in an RCT ; mood stabilisers have weaker evidence.
- **Kleptomania**: prevalence low (about 0.3% to 0.6%), more in women; high comorbidity with mood, anxiety and eating disorders; **naltrexone** 50 to 150 mg reduced urges in an RCT ; CBT including covert sensitisation and exposure with response prevention.
- **Pyromania**: very rare; most juvenile fire-setting relates to conduct disorder, ADHD or curiosity; treatment includes fire-safety education and CBT.
- **Trichotillomania and excoriation**: habit reversal training first-line; N-acetylcysteine 1,200 to 2,400 mg daily had positive trials in adults for trichotillomania; SSRIs have limited evidence.
- **Compulsive sexual behaviour disorder** (ICD-11 6C72): persistent failure to control intense, repetitive sexual impulses over an extended period (6 months or more), causing marked distress or impairment, not solely due to moral disapproval.
- **Clozapine-induced enuresis**: reported in roughly 20% or more of patients when asked; management as in the decide scenario; desmopressin (0.1 to 0.2 mg at night; Minirin) with sodium monitoring; oxybutynin or ephedrine have been used; investigate seizures (nocturnal fits) if new.
:::

:::recall
1. What do impulse control disorders share? || Failure to resist a harmful urge, often with tension before and relief or pleasure after.
2. What separates kleptomania from ordinary theft? || The objects are not needed for use or value, and stealing relieves tension; not done for gain, anger or revenge.
3. Why is most fire-setting not pyromania? || It is done for money, revenge, concealment, or occurs with conduct disorder, psychosis or intoxication.
4. Which medicine has evidence for kleptomania? || Naltrexone.
5. Which antipsychotic commonly causes night-time enuresis? || Clozapine.
:::

:::mcq
Q: A man has explosive outbursts several times a year, smashing objects over trivial triggers, unplanned, with remorse afterwards. The most likely diagnosis is:
- Antisocial personality disorder
- *Intermittent explosive disorder
- Bipolar disorder
- Kleptomania
> Disproportionate, impulsive aggression.

Q: Which medicine has the best evidence for reducing impulsive aggression in intermittent explosive disorder?
- Diazepam
- *Fluoxetine
- Haloperidol
- Donepezil
> SSRI with RCT support.
:::

## 2.9 Level check · Beginner [core][beginner]
Twelve or more right out of fifteen opens the Advanced level.

:::mcq
Q: An adult with anorexia nervosa has a BMI of 16.4. Severity is:
- Mild
- *Moderate
- Severe
- Extreme
> 16 to 16.99.

Q: Refeeding syndrome is mainly caused by a sudden fall in:
- Sodium
- *Phosphate, potassium and magnesium
- Calcium
- Glucose only
> Monitor and supplement.

Q: Russell's sign suggests:
- Restricting anorexia
- *Self-induced vomiting
- Binge-eating disorder
- ARFID
> Knuckle calluses.

Q: The best-evidenced medicine for bulimia nervosa is:
- Bupropion
- *Fluoxetine 60 mg
- Olanzapine
- Lithium
> Higher than the antidepressant dose.

Q: The first-line treatment for chronic insomnia is:
- Zolpidem nightly
- *CBT-I
- Alcohol
- Long naps
> CBT-I.

Q: Cataplexy is:
- A type of epilepsy
- *Sudden muscle weakness triggered by emotion, with preserved awareness
- A nightmare
- Sleepwalking
> A narcolepsy type 1 feature.

Q: Loud snoring, witnessed apnoeas and daytime sleepiness need:
- Sleeping pills
- *A sleep study for obstructive sleep apnoea
- Antidepressants only
- Reassurance
> And driving advice.

Q: Sleep terrors arise from:
- REM sleep, late in the night
- *Deep NREM sleep, early in the night
- Wakefulness
- Daytime naps
> No recall.

Q: Acting out dreams in an older man is an early sign of:
- Alzheimer's disease
- *Parkinson's disease or Lewy body dementia
- Depression
- Narcolepsy type 2
> REM sleep behaviour disorder.

Q: Which blood test matters most in restless legs syndrome?
- Vitamin D
- *Ferritin
- Uric acid
- Amylase
> Iron deficiency worsens RLS.

Q: Somatic symptom disorder is defined mainly by:
- Absence of a medical cause
- *Excessive thoughts, feelings or behaviours about body symptoms
- Faking symptoms
- Trauma history
> The excessive response.

Q: Hoover's sign is used in diagnosing:
- Epilepsy
- *Functional limb weakness
- Stroke
- Parkinson's disease
> A positive sign of FND.

Q: A carer who secretly induces illness in a child has:
- Malingering
- Somatic symptom disorder
- *Factitious disorder imposed on another, which is child abuse
- Illness anxiety disorder
> Child protection emergency.

Q: Dhat syndrome is best managed by:
- Ridicule
- Many tests
- *Respectful education about sexual physiology and treating underlying anxiety or depression
- Antipsychotics
> Culturally sensitive care.

Q: Which is NOT required for a paraphilic disorder?
- Recurrent intense sexual interest
- *A criminal conviction
- Distress, impairment, or harm or risk to others
- Persistence over time
> Diagnosis is clinical, not legal.
:::
`;
