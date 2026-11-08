/* Module · Eating, sleep, body, dissociative, sexual and impulse disorders, Part I (Starting level). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: body, sleep, self and impulses in plain words

## 1.1 Eating, weight and the body [core][starting]
Eating disorders are serious mental illnesses in which a person's eating, and their thoughts about food, weight and shape, cause great harm. They are not a lifestyle choice, a phase, or vanity. **Anorexia nervosa has one of the highest death rates of any mental illness.**

### The main eating disorders, in plain words
- **Anorexia nervosa**: the person eats far too little and becomes dangerously underweight, yet is terrified of gaining weight and often sees themselves as bigger than they are.
- **Bulimia nervosa**: repeated **binges** (eating a very large amount with a sense of loss of control), followed by efforts to undo them: vomiting, laxatives, fasting or over-exercise. Weight is often normal, so it is easily hidden.
- **Binge-eating disorder**: repeated binges with distress and loss of control, **without** regular vomiting or other compensation. It is the commonest eating disorder, and often linked with obesity.
- **Avoidant/restrictive food intake disorder (ARFID)**: very limited eating because of fear (of choking or vomiting), sensory dislike of textures and smells, or little interest in food, with **no** worry about weight or shape.

:::widget sort
{"prompt": "Which eating problem fits best? Place each person.", "buckets": ["Anorexia nervosa", "Bulimia nervosa", "Binge-eating disorder", "ARFID"], "items": [{"text": "A 16-year-old in Pune eats only a few vegetables a day, is very thin, runs for hours, and says she is 'still fat'", "bucket": 0}, {"text": "A 22-year-old of normal weight eats several packets of biscuits in secret, then makes herself vomit, most nights", "bucket": 1}, {"text": "A 40-year-old man eats large amounts late at night, feels out of control and disgusted, but never vomits or fasts", "bucket": 2}, {"text": "A 10-year-old eats only white rice and plain biscuits because other foods 'feel wrong' in his mouth; he has no worries about weight", "bucket": 3}, {"text": "A 25-year-old has lost a lot of weight after choking on fish, and now avoids all solid food out of fear", "bucket": 3}, {"text": "A 19-year-old athlete keeps her weight very low and panics at the thought of gaining even a kilo", "bucket": 0}]}
:::

:::widget flow
{"title": "Which eating disorder? A first decision tree", "layout": "tree", "nodes": [{"id": "r", "label": "Disturbed eating causing harm", "detail": "Start with weight, binges, compensation and the reason for avoiding food."}, {"id": "an", "label": "Significantly low weight with fear of gaining", "detail": "Anorexia nervosa (restricting, or binge-eating/purging type).", "parent": "r"}, {"id": "bn", "label": "Binges plus regular compensation, weight not low", "detail": "Bulimia nervosa.", "parent": "r"}, {"id": "bed", "label": "Binges with distress, no regular compensation", "detail": "Binge-eating disorder.", "parent": "r"}, {"id": "arf", "label": "Avoidance from fear, texture or low interest, no weight worry", "detail": "Avoidant/restrictive food intake disorder (ARFID).", "parent": "r"}], "caption": "Weight decides between anorexia binge-purge type and bulimia."}
:::

### Myths that delay help
- **"Eating disorders only affect rich, thin, Western girls."** They affect boys and men, people of every body size, every income and every country, including India.
- **"You can tell by looking."** Most people with bulimia and binge-eating disorder have normal or higher weight.
- **"They just need to eat."** Eating disorders are driven by powerful fears and thoughts that need specialist treatment.
- **"It's a phase."** Without treatment, eating disorders can last years and cause lasting damage to the heart, bones, fertility and teeth.

:::widget compare
{"title": "Ordinary dieting or anorexia nervosa?", "a": {"label": "Ordinary dieting", "points": ["Wants to lose a few kilos for a wedding", "Stops when the goal is reached, or gives up", "Weight stays in the healthy range", "Self-worth rests on many things", "Eats normally with family on festival days"], "summary": "Dieting: a choice the person can set aside."}, "b": {"label": "Anorexia nervosa", "points": ["Keeps restricting even when underweight", "Intense fear of gaining weight, which grows as weight falls", "Sees herself as fat despite being thin", "Self-worth depends almost entirely on weight and shape", "Hides food, avoids family meals, over-exercises"], "summary": "Anorexia: a serious illness in which the drive to lose weight takes over."}, "caption": "Anorexia has one of the highest death rates of any mental disorder. Early help makes recovery more likely."}
:::

### Why this matters in India
Eating disorders are under-recognised in India. Rising rates are reported among urban adolescents and young adults, influenced by social media, fitness culture and pressure about appearance, including for marriage. Some Indian patients with anorexia do not describe fear of fatness; they may explain not eating as stomach discomfort, fasting, or "no appetite". Clinicians must look past the explanation to the pattern.

:::widget guess
{"prompt": "Over about how many years of follow-up, out of every 100 people with anorexia nervosa, have around 5 died?", "min": 1, "max": 50, "unit": "years", "answer": [8, 12], "reveal": "About a decade. Roughly 5 in 100 people with anorexia die per decade of illness, from starvation, heart rhythm problems or suicide. This is why weight loss in anorexia is a medical emergency, not just a psychological concern.", "clinician": "Crude mortality about 5% per decade; standardised mortality ratio about 5 to 6 (2011), one of the highest in psychiatry; about one in five deaths are suicides. Bulimia SMR about 2; binge-eating disorder raises cardiometabolic risk. Early, effective treatment improves outcome; about half recover fully, a third improve, and about a fifth have a chronic course."}
:::

:::widget decide
{"scene": "Aditi, 15, from Gurugram, has lost a lot of weight over six months. She now eats only salad at lunch and skips dinner, saying she 'isn't hungry'. Her periods have stopped. She feels dizzy when standing and is always cold. Her parents think she is 'just dieting for her cousin's wedding'.", "ask": "What do you advise?", "choices": [{"label": "Reassure the parents that teenage dieting is normal and she will grow out of it", "verdict": "harm", "outcome": "Months later Aditi collapses at school with a very slow heart rate and is admitted to intensive care.", "why": "Marked weight loss, stopped periods, dizziness and feeling cold are signs of serious starvation. Delay is dangerous."}, {"label": "Explain gently that this looks like an eating disorder, arrange an urgent medical check (weight, height, heart rate, blood pressure on standing, temperature, blood tests and ECG), and refer to an eating disorder service with family involvement", "verdict": "best", "outcome": "Her heart rate is 44 and potassium is low. She is admitted briefly for safe refeeding, then starts family-based treatment as an outpatient.", "why": "Early recognition, medical risk assessment and family-based treatment give adolescents with anorexia the best chance of recovery."}, {"label": "Tell Aditi she must eat more, or she will be punished", "verdict": "harm", "outcome": "She hides food and starts vomiting secretly.", "why": "Threats increase secrecy and fear. Eating disorders need specialist treatment and support for the family."}]}
:::

:::clinician
### Key facts at a glance
- **Lifetime prevalence** (approximate): anorexia 0.5% to 1% in women (about a third of that in men), bulimia 1% to 2%, binge-eating disorder 1.5% to 3%. Onset typically in adolescence or early adulthood; binge-eating disorder later.
- **SCOFF screen** (2 or more suggests an eating disorder): Do you make yourself **S**ick because you feel uncomfortably full? Do you worry you have lost **C**ontrol over how much you eat? Have you recently lost more than **O**ne stone (about 6 kg) in 3 months? Do you believe yourself to be **F**at when others say you are thin? Would you say **F**ood dominates your life?
- **Indian data**: community data are sparse; school and college surveys report disordered eating attitudes in 10% to 25% of urban students; clinical case series from NIMHANS, PGIMER and private centres document atypical presentations without fat phobia ("non-fat-phobic anorexia", first described in Hong Kong and South Asia).
- **Men**: often present with muscularity concerns, over-exercise and supplement use; screening tools miss many.
:::

:::recall
1. Name the four main eating disorders. || Anorexia nervosa, bulimia nervosa, binge-eating disorder, ARFID.
2. How does bulimia differ from binge-eating disorder? || Bulimia includes regular compensatory behaviour such as vomiting; binge-eating disorder does not.
3. What makes ARFID different from anorexia? || No fear of weight gain or body image disturbance; avoidance is due to fear, sensory dislike or low interest.
4. Why is anorexia a medical emergency? || It has one of the highest death rates of any mental illness, from starvation, heart problems and suicide.
:::

:::mcq
Q: A woman of normal weight binges in secret and vomits afterwards several times a week. The most likely diagnosis is:
- Anorexia nervosa
- *Bulimia nervosa
- ARFID
- Binge-eating disorder
> Binges plus compensatory behaviour at normal weight.

Q: Which statement is true?
- Eating disorders only affect girls
- You can always tell from a person's weight
- *Eating disorders occur in all genders, sizes and countries, including India
- They are a phase that passes without help
> They are under-recognised everywhere.
:::

## 1.2 Sleep in plain words [core][starting]
Sleep is not just "switching off". During sleep the brain sorts memories, clears waste, balances hormones and resets emotions. Poor sleep worsens almost every mental and physical illness, and many mental illnesses disturb sleep.

:::widget figure
{"id": "sleep-centres"}
:::

### How sleep is built
Sleep comes in cycles of about **90 minutes**, repeated four or five times a night:
- **Light sleep** (stages N1 and N2): drifting off and settling.
- **Deep sleep** (stage N3, slow-wave sleep): the hardest to wake from; more in the first half of the night; important for physical recovery.
- **REM sleep** (rapid eye movement): vivid dreaming; the body's muscles are temporarily paralysed so we don't act out dreams; more in the second half of the night.

:::widget figure
{"id": "hypnogram"}
:::

### What controls sleep
- **Sleep pressure**: the longer you stay awake, the more a chemical called **adenosine** builds up and makes you sleepy. Caffeine blocks it.
- **The body clock** (circadian rhythm): a 24-hour clock in the brain, set mainly by **light**, especially morning light. Darkness releases **melatonin**, which signals night.

:::widget layers
{"title": "A night of sleep", "shape": "stack", "layers": [{"label": "Awake", "detail": "Brief awakenings are normal; most are not remembered."}, {"label": "REM sleep", "detail": "Vivid dreams with muscle paralysis; longer periods towards morning. Emotional memory processing."}, {"label": "Light sleep (N1, N2)", "detail": "About half the night. Sleep spindles help consolidate learning."}, {"label": "Deep sleep (N3)", "detail": "Slow waves; mostly in the first half of the night; physical restoration and growth hormone release."}], "caption": "Through the night the brain cycles down to deep sleep and up to REM about every 90 minutes; deep sleep dominates early, REM dominates late."}
:::

:::analogy Two dials
Imagine two dials. One is sleep pressure, which fills up the longer you are awake, like a tank. The other is the body clock, which opens the "sleep gate" at night. Good sleep happens when the tank is full and the gate is open. Napping in the evening empties the tank; bright screens at night keep the gate closed.
:::

:::widget guess
{"prompt": "How many hours of sleep do most adults need each night to feel and function well?", "min": 3, "max": 12, "unit": "hours", "answer": [7, 9], "reveal": "Most adults need about 7 to 9 hours. Teenagers need more, about 8 to 10, and their body clocks naturally shift later, which collides with early school and coaching timings. Older adults sleep more lightly but still need about 7 to 8 hours.", "clinician": "American Academy of Sleep Medicine and Sleep Research Society consensus: 7 or more hours for adults 18 to 60; National Sleep Foundation: 8 to 10 hours for 14 to 17-year-olds, 9 to 12 for 6 to 13-year-olds. Chronic short sleep is associated with obesity, diabetes, hypertension, depression, accidents and impaired learning."}
:::

:::widget timeline
{"prompt": "Order the stages of a healthy first sleep cycle, from lying down to the first dream.", "events": [{"label": "Awake, drowsy, eyes closed"}, {"label": "N1: drifting off, easily woken"}, {"label": "N2: settled light sleep"}, {"label": "N3: deep, slow-wave sleep"}, {"label": "Back up to lighter N2"}, {"label": "REM sleep: the first, short dream period"}], "why": "A cycle lasts about 90 minutes and repeats four or five times. Early cycles hold more deep sleep; later ones hold longer REM periods, which is why vivid dreams come towards morning."}
:::

### Common sleep problems
- **Insomnia**: difficulty falling asleep, staying asleep, or waking too early, with daytime tiredness, despite having the chance to sleep.
- **Excessive sleepiness**: falling asleep in the day, for example from **sleep apnoea** (breathing stops repeatedly at night, with loud snoring) or **narcolepsy**.
- **Body clock problems**: for example a teenager who cannot sleep before 2 a.m. and cannot wake for school.
- **Unusual events in sleep** (parasomnias): sleepwalking, night terrors, nightmares, acting out dreams.
- **Restless legs**: an urge to move the legs in the evening.

:::widget hypnogram
{"title": "Drag through a night of sleep", "caption": "Notice deep N3 sleep in the first cycles and longer REM periods towards morning, with brief awakenings that are normal and mostly forgotten."}
:::

### Good sleep habits
- Keep **regular** sleep and wake times, including weekends.
- **Morning light** and daytime activity; avoid long or late naps.
- Limit **caffeine** (tea, coffee, cola, energy drinks) after midday; avoid alcohol as a sleep aid (it fragments sleep).
- **Screens off** well before bed; keep the bedroom dark, quiet and cool.
- Use the bed for sleep (and sex) only; if you can't sleep, get up and do something calm until sleepy.

:::widget sort
{"prompt": "Helps sleep or harms sleep? Place each habit.", "buckets": ["Helps sleep", "Harms sleep"], "items": [{"text": "Waking at the same time every day, even on Sundays", "bucket": 0}, {"text": "Two cups of strong coffee at 8 p.m. to finish an assignment", "bucket": 1}, {"text": "Scrolling reels in bed until 2 a.m.", "bucket": 1}, {"text": "A walk in the morning sunlight", "bucket": 0}, {"text": "A 'peg' of whisky to fall asleep", "bucket": 1, "why": "Alcohol may help you drop off but causes broken, poor-quality sleep later in the night."}, {"text": "Getting out of bed to read quietly when unable to sleep for a long time", "bucket": 0}, {"text": "A two-hour nap at 6 p.m.", "bucket": 1}]}
:::

:::clinician
### Sleep architecture and assessment
- **Normal adult sleep**: N1 about 5%, N2 about 50%, N3 about 15% to 20% (declining with age), REM about 20% to 25%; REM latency about 70 to 120 minutes. Depression shortens REM latency and increases REM density; most antidepressants suppress REM.
- **Assessment**: a two-week sleep diary; Insomnia Severity Index (ISI, 0 to 28); Epworth Sleepiness Scale (ESS, 0 to 24; above 10 suggests excessive sleepiness); STOP-BANG for sleep apnoea; actigraphy; polysomnography (PSG) for suspected apnoea, parasomnias, RBD and narcolepsy (with the multiple sleep latency test the next day).
- **Indian context**: shift work in IT and BPO sectors, long commutes, coaching schedules, shared sleeping spaces, heat and noise; high prevalence of obstructive sleep apnoea with central obesity.
:::

:::recall
1. Name the three main types of sleep. || Light sleep (N1, N2), deep sleep (N3), REM sleep.
2. What two systems control sleep? || Sleep pressure (adenosine) and the body clock (circadian rhythm, set by light, with melatonin).
3. How many hours do most adults need? || About 7 to 9.
4. Name four good sleep habits. || Regular times, morning light, limiting caffeine and alcohol, screens off before bed, a dark quiet room, getting up if unable to sleep.
:::

:::mcq
Q: A 17-year-old cannot fall asleep before 2 a.m. and cannot wake for school, but sleeps well from 2 a.m. to 10 a.m. on holidays. The most likely problem is:
- Insomnia from depression
- *A delayed body clock (delayed sleep phase)
- Narcolepsy
- Sleep apnoea
> Normal sleep at a later time.

Q: Alcohol at bedtime:
- Improves sleep quality
- *Helps falling asleep but fragments sleep later in the night
- Has no effect on sleep
- Treats insomnia
> Avoid alcohol as a sleep aid.
:::

:::widget figure
{"id": "two-process-sleep"}
:::

## 1.3 When the body carries distress [core][starting]
Many people come to doctors with **body symptoms** (pain, weakness, dizziness, fatigue, stomach trouble, fits, numbness) that are real and distressing, but are not explained by tests for disease. This is one of the commonest problems in medicine, especially in primary care.

### Three important ideas
1. **The symptoms are real.** The person is not "making it up". Pain, weakness or fits happen, and are often disabling.
2. **Mind and body are one system.** Stress, anxiety, low mood and trauma can change how the nervous system works, and how sensations are processed and felt.
3. **"Nothing is wrong" is the wrong message.** Saying "it's all in your mind" or "your tests are normal, you can go" leaves people feeling disbelieved, and often leads to more tests and more doctors.

### The main conditions, in plain words
- **Somatic symptom disorder**: distressing body symptoms with **excessive worry, attention and effort** devoted to them, taking over a person's life.
- **Illness anxiety disorder**: intense fear of having a serious illness, with few or mild symptoms; repeated checking or avoiding doctors.
- **Functional neurological disorder** (also called conversion disorder): real neurological symptoms such as weakness, abnormal movements, fits (often called **dissociative or functional seizures**) or loss of sensation, caused by a problem in how the nervous system **functions**, not by structural damage. Often described as a "software" rather than a "hardware" problem.
- **Factitious disorder**: deliberately faking or causing symptoms, without an obvious outside reward, to be seen as ill.
- **Malingering** (not a mental disorder): faking symptoms for an outside reward, such as money, avoiding duty, or drugs.

:::widget flow
{"title": "How health anxiety keeps itself going", "layout": "cycle", "nodes": [{"id": "a", "label": "A body sensation", "detail": "A headache, a lump, a skipped heartbeat."}, {"id": "b", "label": "Catastrophic thought", "detail": "'This must be a tumour.'"}, {"id": "c", "label": "Anxiety", "detail": "Fear makes the body more aroused, producing more sensations."}, {"id": "d", "label": "Checking and reassurance", "detail": "Searching online, examining the body, asking for tests: brief relief."}, {"id": "e", "label": "Doubt returns", "detail": "Relief fades; attention to the body increases, so more sensations are noticed."}], "caption": "CBT breaks the cycle by reducing checking and reassurance, testing beliefs and shifting attention."}
:::

:::analogy Software, not hardware
In a stroke, part of the brain's "hardware" is damaged, and scans show it. In functional neurological disorder, the hardware is intact, but the "software" that sends and receives signals is running wrongly, so a limb won't move or a fit happens. Scans are normal, but the problem is real. And software problems can often be retrained.
:::

:::sounds How distress is described through the body in Indian clinics
- "Kamzori hai, haath-pair mein jaan nahi." (Weakness, no strength in my hands and legs.)
- "Ghabrahat hoti hai, dil baith jaata hai." (Panicky feeling, my heart sinks.)
- "Sar bhaari rehta hai, gas chadhti hai." (My head feels heavy, gas rises up.)
- "Jalan hoti hai pure sharir mein." (Burning all over my body.)
- "Dhat jaata hai, isliye kamzori hai." (Semen is being lost, that's why I'm weak.)
:::

:::widget decide
{"scene": "Mrs Yadav, 38, from Lucknow, has visited five doctors in a year for headaches, burning feet and tiredness. Every test, including an MRI, has been normal. The last doctor told her, 'Nothing is wrong with you, it's just tension.' She is upset and asks you for 'one more scan to find the real problem'.", "ask": "What is the most helpful approach?", "choices": [{"label": "Order another MRI to reassure her", "verdict": "ok", "outcome": "The scan is normal. She feels relieved for a week, then the worry returns and she asks for another test.", "why": "Repeated tests give short-lived reassurance and can reinforce the belief that something is being missed."}, {"label": "Take her symptoms seriously, explain that they are real and can come from how the nervous system and stress interact, ask about mood, worries and life stresses, agree on regular scheduled visits rather than new tests, and offer treatment for any anxiety or depression", "verdict": "best", "outcome": "She talks about her husband's drinking and money worries. With regular visits, an antidepressant for her low mood and pain, and counselling, her symptoms ease and doctor visits fall.", "why": "Acknowledging real symptoms, explaining them positively, exploring psychosocial factors and offering a steady relationship with one clinician help most."}, {"label": "Tell her she is wasting doctors' time", "verdict": "harm", "outcome": "She goes to another doctor who orders unnecessary invasive tests.", "why": "Dismissal increases distress and drives repeated, sometimes harmful, investigations."}]}
:::

:::widget compare
{"title": "Functional symptoms or faking?", "a": {"label": "Functional and somatic symptoms", "points": ["The symptom is real and not under conscious control", "A weak leg or seizure-like attacks without a structural cause", "The person is genuinely distressed and disabled", "Treatment explains the diagnosis and builds recovery"], "summary": "Functional: a genuine problem in how the nervous system works, not a pretence."}, "b": {"label": "Factitious disorder and malingering", "points": ["Symptoms are produced or exaggerated deliberately", "Factitious: to take on the sick role, without an obvious outside gain", "Malingering: for an outside reward, such as money or avoiding duty", "Malingering is not a mental disorder"], "summary": "Intentional: the person knowingly creates or exaggerates the symptom."}, "caption": "Most people with unexplained physical symptoms are not faking. Calling them liars damages trust and delays help."}
:::

:::clinician
### Language and frequency
- About **a third** of new neurology outpatients have symptoms that are largely or wholly functional; in primary care, medically unexplained or persistent physical symptoms account for a large share of visits.
- **Preferred terms**: "functional", "persistent physical symptoms", "functional seizures" or "dissociative seizures" (rather than "pseudoseizures" or "hysteria"). Patients find "functional" acceptable and accurate.
- **India**: somatic presentation of depression and anxiety is common (often with "ghabrahat", "kamzori", heat or burning sensations, gas); Dhat syndrome is a culturally specific idiom; dissociative seizures are common in young women, often in the context of family conflict and limited voice.
- **Iatrogenic harm**: repeated investigation, unnecessary surgery, opioid prescribing and labelling as "nothing wrong" worsen outcomes.
:::

:::recall
1. Are functional symptoms real? || Yes; they are genuinely experienced and often disabling.
2. What is functional neurological disorder? || Real neurological symptoms caused by altered nervous system function, not structural damage.
3. How does factitious disorder differ from malingering? || Factitious: deliberate faking without obvious outside reward; malingering: faking for an outside reward, and not a mental disorder.
4. Why is "nothing is wrong with you" unhelpful? || It leaves people feeling disbelieved and drives more tests and doctors.
:::

:::mcq
Q: A young woman has seizures with her eyes tightly closed, side-to-side head movements and full recall afterwards. Her EEG during an attack is normal. The most likely diagnosis is:
- Epilepsy
- *Functional (dissociative) seizures
- Malingering
- Syncope
> Video-EEG confirms functional seizures.

Q: A man fakes back pain to obtain compensation after an accident. This is:
- Factitious disorder
- Somatic symptom disorder
- *Malingering
- Functional neurological disorder
> External reward.
:::

## 1.4 Dissociation, sexuality, gender and impulses [core][starting]
This section introduces four areas that are often surrounded by silence, shame or myth. Getting the basic ideas right protects patients from harm.

### Dissociation
**Dissociation** is a disconnection between parts of experience that normally go together: thoughts, memories, feelings, actions, and the sense of self. Mild dissociation is common: "zoning out" while driving, getting lost in a film. It becomes a disorder when it is severe and disruptive:
- **Depersonalisation and derealisation**: feeling detached from oneself ("as if I'm watching myself") or that the world is unreal ("like a dream"), while knowing it is not really so.
- **Dissociative amnesia**: inability to recall important personal information, usually about a traumatic or stressful event, far beyond ordinary forgetting.
- **Dissociative identity disorder**: two or more distinct identity states, with gaps in memory. Rare, and controversial.
- **Trance and possession states**: in some cultures, including parts of India, distress can take the form of a trance or being "possessed" by a spirit or deity. When this happens **outside** accepted religious or cultural practice and causes distress, it may be a disorder.

:::widget layers
{"title": "From everyday dissociation to disorder", "shape": "stack", "layers": [{"label": "Dissociative identity disorder", "detail": "Two or more identity states with memory gaps. Rare and debated."}, {"label": "Dissociative amnesia and fugue", "detail": "Loss of important personal memories, sometimes with travel and loss of identity."}, {"label": "Possession trance or dissociative seizures", "detail": "Involuntary, distressing episodes outside accepted practice."}, {"label": "Depersonalisation and derealisation", "detail": "Feeling unreal or detached, with reality testing intact."}, {"label": "Everyday dissociation", "detail": "Daydreaming, absorption, driving on autopilot. Normal."}]}
:::

### Sexual health
Sexual problems are common and treatable, but people rarely raise them, especially in India. Ask routinely and respectfully, especially when prescribing medicines that affect sex (many antidepressants and antipsychotics do). Common problems: low desire, erection difficulties, early ejaculation, difficulty with orgasm, and pain or inability to have penetration.

### Gender identity
**Gender identity** is a person's inner sense of being a man, a woman, both, neither, or another gender. For most people it matches the sex they were assigned at birth; for **transgender** people it does not. Being transgender is **not a mental illness**. Some transgender people experience **gender dysphoria**: distress about the mismatch. In India, **hijra** and other communities have a long history, and the law recognises transgender people's rights.

### Impulses
Some people experience **irresistible urges** to do something harmful, with tension before and relief after:
- **Intermittent explosive disorder**: repeated outbursts of anger out of proportion to the trigger.
- **Kleptomania**: urges to steal things not needed for use or money.
- **Pyromania**: deliberate fire-setting for fascination, tension relief or pleasure.

:::widget sort
{"prompt": "Myth or fact? Place each statement.", "buckets": ["Myth", "Fact"], "items": [{"text": "Being transgender is a mental illness", "bucket": 0, "why": "ICD-11 has moved gender incongruence out of the mental disorders chapter."}, {"text": "Antidepressants can cause sexual problems, which should be asked about", "bucket": 1}, {"text": "Feeling unreal briefly under extreme stress can happen to healthy people", "bucket": 1}, {"text": "Everyone who reports being possessed has a mental illness", "bucket": 0, "why": "Possession experiences within accepted religious practice, without distress, are not a disorder."}, {"text": "Sexual problems are rare and not worth asking about", "bucket": 0}, {"text": "Same-sex attraction can be 'cured' by therapy", "bucket": 0, "why": "Sexual orientation is not an illness. Conversion therapy is harmful and treated as professional misconduct in India."}, {"text": "Kleptomania involves stealing things the person does not need", "bucket": 1}]}
:::

:::widget decide
{"scene": "Vikram, 32, has been taking sertraline for depression for three months and feels much better. At a follow-up in Jaipur, he seems hesitant and says he wants to stop the medicine. When asked gently why, he looks embarrassed.", "ask": "What do you do?", "choices": [{"label": "Tell him he must continue the medicine because it is working", "verdict": "ok", "outcome": "He agrees but stops it secretly, and his depression returns.", "why": "There is a reason he wants to stop. Not finding it out risks hidden non-adherence."}, {"label": "Normalise and ask directly: 'Some people notice changes in sexual function on this medicine, such as delayed ejaculation or low desire. Has anything like that happened?'", "verdict": "best", "outcome": "He admits to delayed ejaculation causing strain in his marriage. You discuss options, such as a dose adjustment or switching to an alternative with fewer sexual side effects, and he stays on treatment.", "why": "Sexual side effects are common, under-reported and a leading reason for stopping antidepressants. Asking directly and offering solutions keeps people well."}, {"label": "Let him stop at once", "verdict": "harm", "outcome": "He has discontinuation symptoms and relapses.", "why": "Stopping suddenly can cause discontinuation symptoms and relapse; the side effect can be managed."}]}
:::

:::clinician
### Orientation to the rest of the module
- **Dissociative disorders** (DSM-5-TR): dissociative identity disorder, dissociative amnesia (with or without fugue), depersonalisation/derealisation disorder, other specified (including dissociative trance, identity disturbance from coercive persuasion, acute dissociative reactions). **ICD-11** groups dissociative neurological symptom disorder (functional neurological disorder), dissociative amnesia, trance disorder, possession trance disorder, DID, partial DID and depersonalisation-derealisation disorder.
- **Sexual dysfunctions** (DSM-5-TR): delayed ejaculation, erectile disorder, female orgasmic disorder, female sexual interest/arousal disorder, genito-pelvic pain/penetration disorder, male hypoactive sexual desire disorder, premature (early) ejaculation, substance/medication-induced sexual dysfunction. Most require about 6 months and occurrence on about 75% to 100% of occasions, with distress.
- **Gender**: DSM-5-TR gender dysphoria (separate criteria for children and for adolescents and adults); ICD-11 gender incongruence (HA60, HA61) in the chapter on conditions related to sexual health.
- **Impulse control**: DSM-5-TR places intermittent explosive disorder, pyromania and kleptomania in the disruptive, impulse-control and conduct disorders chapter; trichotillomania and excoriation disorder in obsessive-compulsive and related disorders; gambling in addictions. ICD-11 adds **compulsive sexual behaviour disorder** to impulse control disorders.
:::

:::recall
1. What is dissociation? || A disconnection between thoughts, memories, feelings, actions and sense of self that normally go together.
2. What is the difference between depersonalisation and derealisation? || Depersonalisation: feeling detached from oneself; derealisation: feeling the world is unreal.
3. Is being transgender a mental illness? || No; distress from incongruence may be gender dysphoria.
4. Name three impulse control disorders. || Intermittent explosive disorder, kleptomania, pyromania.
:::

:::mcq
Q: A woman feels as if she is watching herself from outside her body and knows it is not really happening. This is:
- Psychosis
- *Depersonalisation
- Derealisation
- Possession
> Reality testing is intact.

Q: Why should you ask about sexual function when prescribing an SSRI?
- It is not relevant
- *Sexual side effects are common, rarely volunteered, and a leading reason for stopping treatment
- SSRIs improve sexual function
- Only women are affected
> Ask routinely and offer solutions.
:::

## 1.5 Level check · Starting [core][starting]
Twelve or more right out of fifteen opens the Beginner level.

:::mcq
Q: Which eating disorder has one of the highest death rates in psychiatry?
- Binge-eating disorder
- ARFID
- *Anorexia nervosa
- Pica
> About 5 in 100 per decade.

Q: Binges without regular compensatory behaviour describe:
- Bulimia nervosa
- *Binge-eating disorder
- Anorexia nervosa
- ARFID
> No vomiting, laxatives or fasting.

Q: A child eats very few foods because of textures, with no concern about weight. This suggests:
- Anorexia nervosa
- *ARFID
- Bulimia nervosa
- Normal picky eating always
> No body image disturbance.

Q: Most adults need about how much sleep?
- 4 to 5 hours
- *7 to 9 hours
- 10 to 12 hours
- 3 hours
> Seven to nine.

Q: Vivid dreaming mostly happens in:
- Deep sleep
- *REM sleep
- Light sleep only
- Waking
> REM, more in the second half of the night.

Q: Which habit harms sleep?
- Regular wake times
- Morning light
- *Late-evening caffeine
- A dark bedroom
> Caffeine blocks adenosine.

Q: Loud snoring, pauses in breathing and daytime sleepiness suggest:
- Narcolepsy
- *Sleep apnoea
- Insomnia
- Restless legs
> Breathing-related sleep disorder.

Q: Functional symptoms are best described as:
- Imaginary
- Always faked
- *Real symptoms from altered nervous system function
- Always caused by structural damage
> Software, not hardware.

Q: Faking illness for compensation is:
- Factitious disorder
- *Malingering
- Somatic symptom disorder
- Illness anxiety disorder
> External reward.

Q: Faking or inducing illness without an obvious external reward is:
- *Factitious disorder
- Malingering
- Conversion disorder
- Hypochondriasis
> To take the sick role.

Q: A common Indian idiom of distress expressed through the body is:
- Hearing voices
- *'Kamzori' (weakness) and 'ghabrahat' (panicky feeling)
- Grandiosity
- Elation
> Body idioms for depression and anxiety.

Q: Feeling that the world is unreal, like a dream, is:
- Depersonalisation
- *Derealisation
- Delusion
- Hallucination
> Reality testing preserved.

Q: Which statement is true?
- Transgender identity is a mental illness
- *Gender dysphoria refers to distress about incongruence between gender identity and assigned sex
- Conversion therapy is recommended
- Gender identity always matches assigned sex
> Identity is not illness.

Q: Kleptomania involves:
- Stealing for money
- *Stealing items not needed, with tension before and relief after
- Setting fires
- Explosive anger
> An impulse control disorder.

Q: A man stops his antidepressant because of embarrassing sexual side effects. The best approach is to:
- Ignore it
- *Ask directly and offer solutions such as dose change or switching
- Tell him to tolerate it
- Stop all treatment
> Address the cause of non-adherence.
:::
`;
