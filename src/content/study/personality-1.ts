/* Module · Personality disorders, Parts I and II (Starting and Beginner levels). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: personality and its difficulties

## 1.1 What personality is, and when it becomes a disorder [core][starting]
Your **personality** is your usual way of thinking, feeling, relating to people and handling your impulses. It is what your friends mean when they say "that's so typical of you". Personality is fairly stable from early adulthood onwards, but it still changes slowly through life: most people become calmer, more agreeable and more organised with age.

Everyone has **traits**: some of us are shy, some bold; some careful, some carefree; some trusting, some suspicious. Traits are not good or bad in themselves. A suspicious streak helps a bank auditor; carefulness helps a surgeon.

### When traits become a problem
A personality **disorder** is diagnosed when a person's long-standing pattern is:
- **Far from what their culture expects**, in how they see themselves and others, in their emotions, in their relationships, or in controlling their impulses.
- **Rigid**: they react in the same way across many different situations, even when it clearly does not work.
- **Long-lasting**: it can be traced back to the teens or early adulthood. It is not a recent change.
- **Harmful**: it causes real suffering to the person or serious problems in work, study or relationships.
- **Not better explained** by another mental illness, a drug, or a medical condition.

:::analogy A key that fits only one lock
Healthy personality is like a bunch of keys: you pick the one that fits the door in front of you, a bit of humour here, firmness there, patience somewhere else. A personality disorder is like having only one key. You try it on every door, push harder when it does not turn, and end up locked out again and again.
:::

:::widget sort
{"prompt": "A personality trait, or a pattern that may be a disorder? Place each description.", "buckets": ["Ordinary trait", "Possible personality disorder"], "items": [{"text": "Sanjay is quiet at parties but has close friends and a job he enjoys", "bucket": 0}, {"text": "Since her teens, Ritu has suspected every friend, colleague and partner of plotting against her, and has lost three jobs over it", "bucket": 1}, {"text": "Arun likes his desk tidy and makes lists", "bucket": 0}, {"text": "Since college, Neha's relationships have swung from adoration to rage within weeks; she cuts herself when she fears being left", "bucket": 1}, {"text": "Mohan has been irritable and withdrawn for two months since losing his job", "bucket": 0, "why": "A recent change after a stressor is not a long-standing personality pattern. Think of depression or an adjustment problem."}, {"text": "Kiran has avoided almost every social event, job interview and friendship since school, sure he will be ridiculed, though he longs for company", "bucket": 1}]}
:::

:::widget flow
{"title": "Is this a personality disorder? A first decision tree", "layout": "tree", "nodes": [{"id": "r", "label": "A long-standing pattern causing trouble", "detail": "Start by describing the pattern in thinking, emotion, relationships and impulse control."}, {"id": "new", "label": "Began recently, or after an illness or injury", "detail": "Not a personality disorder. Think of depression, mania, psychosis, substances, dementia, brain injury or personality change due to a medical condition.", "parent": "r"}, {"id": "cult", "label": "Fits the person's culture and context", "detail": "Not a disorder. Interdependence, religious practice or restraint may be normal where they live.", "parent": "r"}, {"id": "narrow", "label": "Only in one situation", "detail": "Think of a relationship problem, a reaction to an abusive setting, or a specific anxiety.", "parent": "r"}, {"id": "pd", "label": "Since youth, rigid, across settings, harmful", "detail": "Consider a personality disorder; describe severity and traits, check comorbidity, and gather collateral history.", "parent": "r"}], "caption": "Tap each branch. Most errors happen at the first two branches."}
:::

:::widget compare
{"title": "A strong trait or a personality disorder?", "a": {"label": "Strong trait", "points": ["Shy, tidy, sensitive or bold, for example", "Bends to fit the situation", "The person can step outside it when needed", "Life goes reasonably well"], "summary": "A trait: part of who someone is, and flexible enough to get by."}, "b": {"label": "Personality disorder", "points": ["The same rigid pattern in almost every situation", "Began by adolescence or early adulthood and has lasted", "Clashes with what the person's culture expects", "Causes real distress or keeps damaging work and relationships"], "summary": "A disorder: inflexible, pervasive, long-lasting and harmful."}, "caption": "Everyone has traits. What makes it a disorder is rigidity across settings, plus lasting harm."}
:::

### Why the word "disorder" needs care
Personality disorder diagnoses carry heavy **stigma**. People given these labels are often treated as "difficult", "manipulative" or "attention-seeking", and their physical and mental health complaints are taken less seriously. Remember three things:
1. A personality disorder describes **patterns that cause suffering**, not a bad character.
2. Most of these patterns grew from a mix of **temperament and painful experiences**, often in childhood.
3. **People improve.** Long-term studies show that many no longer meet criteria years later, and good treatments exist.

:::widget guess
{"prompt": "Out of every 100 adults in the general population, about how many have a personality disorder of some kind?", "min": 0, "max": 40, "unit": "adults", "answer": [7, 13], "reveal": "About 1 in 10 (studies range roughly from 7 to 12 in 100). In mental health clinics the figure is far higher: many people treated for depression, anxiety or addiction also have a personality disorder, which affects how they respond to treatment.", "clinician": "Global meta-analysis (2020): pooled prevalence of any personality disorder about 7.8%, higher in high-income countries; Cluster C most common in the community. In psychiatric outpatients, rates of 40% to 50% are reported with structured interviews. Indian community data are sparse; clinic studies suggest under-recognition."}
:::

:::clinician
### DSM-5-TR general criteria (section II)
- **A.** An enduring pattern of inner experience and behaviour that deviates markedly from the expectations of the individual's culture, in **two or more** of: cognition (ways of perceiving and interpreting self, others and events); affectivity (range, intensity, lability and appropriateness of emotional response); interpersonal functioning; impulse control.
- **B.** Inflexible and pervasive across a broad range of personal and social situations.
- **C.** Clinically significant distress or impairment.
- **D.** Stable and of long duration, with onset traceable at least to adolescence or early adulthood.
- **E.** Not better explained as a manifestation or consequence of another mental disorder.
- **F.** Not attributable to a substance or another medical condition (for example head trauma).

Diagnosis under 18: possible when maladaptive traits are pervasive, persistent and unlikely to be limited to a developmental stage or another disorder, present for **at least 1 year**; antisocial personality disorder cannot be diagnosed under 18. ICD-11 requires the disturbance to have persisted for an extended period (for example 2 years or more).

Two more DSM categories: **personality change due to another medical condition** (for example frontal lobe injury, temporal lobe epilepsy, HIV), and other specified or unspecified personality disorder.
:::

:::recall
1. What is a personality trait? || A lasting tendency in how a person thinks, feels, relates or acts; not good or bad in itself.
2. Give the five features that turn traits into a disorder. || Far from cultural expectations, rigid across situations, long-lasting from youth, causing suffering or impairment, not better explained by something else.
3. Why should a recent change in behaviour after a stressor not be called a personality disorder? || Personality disorders are long-standing patterns traceable to youth; a recent change suggests another condition.
4. About what share of adults have a personality disorder? || About 1 in 10.
:::

:::mcq
Q: Lata, 45, has become suspicious, irritable and forgetful over the past year after a head injury. Before that, her family say she was warm and trusting. The best view is:
- Paranoid personality disorder
- *A recent change after a brain injury suggests personality change due to a medical condition, not a personality disorder
- Borderline personality disorder
- Normal ageing
> Personality disorders begin by early adulthood; new change suggests another cause.

Q: Which statement about personality disorders is most accurate?
- They never change
- *Many people improve over the years, and effective therapies exist
- They are a sign of bad character
- They cannot be diagnosed in India
> Long-term studies show high rates of remission.
:::

## 1.2 The three clusters in plain words [core][starting]
DSM-5-TR describes **ten** personality disorders, grouped into **three clusters** by the kind of impression they make. The clusters are a memory aid more than a scientific grouping, and many people have features from more than one.

:::widget guess
{"prompt": "In a large community sample of adults, about what percentage have at least one personality disorder?", "min": 0, "max": 40, "unit": "%", "answer": [6, 12], "reveal": "Roughly 1 in 10 adults. Rates are far higher among people in psychiatric clinics, in prison and among those with substance problems. Personality disorders are common, not rare curiosities."}
:::

### Cluster A: odd or eccentric
- **Paranoid**: distrust and suspicion of others' motives. Holds grudges, sees insults where none were meant, suspects a partner of cheating without reason.
- **Schizoid**: detached from relationships and shows little emotion. Prefers being alone, has little interest in sex or close friends, seems indifferent to praise or criticism.
- **Schizotypal**: odd beliefs, odd perceptions and odd behaviour, with discomfort in close relationships. Magical thinking (believing thoughts can cause events), ideas that things refer to them, unusual speech and dress.

### Cluster B: dramatic, emotional or erratic
- **Antisocial**: disregard for the rights of others from youth. Lies, breaks the law, is reckless and aggressive, shows little remorse.
- **Borderline**: unstable relationships, self-image and emotions, with marked impulsivity. Intense fear of abandonment, self-harm.
- **Histrionic**: attention-seeking with shallow, rapidly shifting emotions. Uncomfortable when not the centre of attention, dramatic, uses appearance to draw attention.
- **Narcissistic**: grandiosity, need for admiration, lack of empathy. Inside, often a fragile self-esteem.

### Cluster C: anxious or fearful
- **Avoidant**: avoids people and activities from fear of criticism or rejection, feels inadequate, longs for closeness.
- **Dependent**: needs to be taken care of, clings, cannot make everyday decisions without reassurance, fears being left alone.
- **Obsessive-compulsive**: preoccupied with order, perfectionism and control, at the cost of flexibility and efficiency. (This is different from obsessive-compulsive disorder, which you meet in another module.)

:::widget flow
{"title": "The ten personality disorders in three clusters", "layout": "tree", "nodes": [{"id": "r", "label": "DSM-5-TR personality disorders", "detail": "Ten categories grouped by the impression they make."}, {"id": "a", "label": "Cluster A: odd", "detail": "Distant, suspicious or eccentric.", "parent": "r"}, {"id": "a1", "label": "Paranoid", "detail": "Distrust and suspicion of others' motives.", "parent": "a"}, {"id": "a2", "label": "Schizoid", "detail": "Detached, little emotion, no wish for closeness.", "parent": "a"}, {"id": "a3", "label": "Schizotypal", "detail": "Odd beliefs and perceptions, social unease.", "parent": "a"}, {"id": "b", "label": "Cluster B: dramatic", "detail": "Emotional, erratic, rule-breaking.", "parent": "r"}, {"id": "b1", "label": "Antisocial", "detail": "Disregard for others' rights since youth.", "parent": "b"}, {"id": "b2", "label": "Borderline", "detail": "Unstable emotions, relationships and self; abandonment fear.", "parent": "b"}, {"id": "b3", "label": "Histrionic", "detail": "Attention-seeking, shallow shifting emotion.", "parent": "b"}, {"id": "b4", "label": "Narcissistic", "detail": "Grandiosity, need for admiration, low empathy.", "parent": "b"}, {"id": "c", "label": "Cluster C: anxious", "detail": "Fearful and inhibited.", "parent": "r"}, {"id": "c1", "label": "Avoidant", "detail": "Avoids people from fear of rejection, longs for closeness.", "parent": "c"}, {"id": "c2", "label": "Dependent", "detail": "Needs to be cared for; clings; fears being alone.", "parent": "c"}, {"id": "c3", "label": "Obsessive-compulsive", "detail": "Perfectionism, control, rigidity.", "parent": "c"}], "caption": "Tap each box. Use the tree to learn the ten, but remember people rarely fit just one."}
:::

:::mnemonic Mad, bad and sad
A rough, old shorthand: **Cluster A is "mad"** (odd, like a mild echo of psychosis), **Cluster B is "bad"** (dramatic and rule-breaking), **Cluster C is "sad"** (anxious and fearful). Use it only to remember, never to describe a person.
:::

:::widget sort
{"prompt": "Which cluster? Place each person.", "buckets": ["Cluster A (odd)", "Cluster B (dramatic)", "Cluster C (anxious)"], "items": [{"text": "Lives alone, has no friends, says he 'doesn't see the point' of relationships and shows no feeling at his father's funeral", "bucket": 0, "why": "Schizoid: detachment and restricted emotion."}, {"text": "Cannot choose a sari or a lunch order without phoning her sister, and stays with a partner who insults her because she fears being alone", "bucket": 2, "why": "Dependent."}, {"text": "Believes she can read strangers' auras and that number plates send her messages; has few friends and dresses unusually", "bucket": 0, "why": "Schizotypal."}, {"text": "Takes credit for colleagues' work, expects special treatment, and is furious when not praised", "bucket": 1, "why": "Narcissistic."}, {"text": "Turns down a promotion that needs presenting to clients, sure he will be laughed at", "bucket": 2, "why": "Avoidant."}, {"text": "Has cheated, stolen and fought since his early teens, and shrugs when people are hurt", "bucket": 1, "why": "Antisocial."}, {"text": "Rewrites every report many times, cannot delegate, and misses deadlines because nothing is perfect", "bucket": 2, "why": "Obsessive-compulsive personality."}, {"text": "Is convinced her neighbours are spying on her and reads hidden insults into every remark, for years", "bucket": 0, "why": "Paranoid."}]}
:::

:::widget decide
{"scene": "During a ward round, a senior resident says about a woman admitted after an overdose: 'She's just a borderline. Attention-seeking. Don't waste time on her, discharge her.' The woman, Pooja, 24, is crying in her bed.", "ask": "What is the most helpful response for a student on the team?", "choices": [{"label": "Agree; it is not your place to question", "verdict": "harm", "outcome": "Pooja is discharged without a risk assessment or follow-up. She takes a larger overdose the following month.", "why": "People with borderline personality disorder have a high risk of suicide. Dismissive care increases risk and shame."}, {"label": "Politely ask whether a full risk assessment and a follow-up plan have been made, and spend a few minutes listening to Pooja", "verdict": "best", "outcome": "The team completes a risk assessment and arranges outpatient follow-up. Pooja says later that being listened to on the ward 'made me want to come back'.", "why": "Respectful curiosity keeps the focus on safety and care. Self-harm is communication of distress, not a reason for rejection."}, {"label": "Argue loudly with the resident in front of the patient", "verdict": "ok", "outcome": "The point is right, but the argument embarrasses everyone and Pooja feels she has caused trouble.", "why": "Advocate for the patient, but do it in a way that improves care rather than creating conflict at the bedside."}]}
:::

:::clinician
### Criteria counts at a glance (DSM-5-TR)
| Disorder | Threshold | Notes |
|---|---|---|
| Paranoid | 4 of 7 | Not only during psychosis or a mood episode with psychotic features |
| Schizoid | 4 of 7 | |
| Schizotypal | 5 of 9 | Also listed in the schizophrenia spectrum chapter; ICD-11 classifies schizotypal disorder there and not as a personality disorder |
| Antisocial | 3 of 7 | Age at least 18; evidence of conduct disorder with onset before 15 |
| Borderline | 5 of 9 | |
| Histrionic | 5 of 8 | |
| Narcissistic | 5 of 9 | |
| Avoidant | 4 of 7 | |
| Dependent | 5 of 8 | |
| Obsessive-compulsive | 4 of 8 | |

The cluster model has weak empirical support: factor analyses do not recover three clusters, comorbidity across clusters is the rule, and "not otherwise specified" was historically the most common diagnosis. This is the main reason for the dimensional models in section 3.1.
:::

:::recall
1. Name the three clusters and their themes. || A: odd or eccentric; B: dramatic, emotional or erratic; C: anxious or fearful.
2. List the three Cluster A disorders. || Paranoid, schizoid, schizotypal.
3. List the four Cluster B disorders. || Antisocial, borderline, histrionic, narcissistic.
4. List the three Cluster C disorders. || Avoidant, dependent, obsessive-compulsive.
5. How is obsessive-compulsive personality disorder different from OCD? || OCPD is a lasting perfectionist, controlling style the person often sees as right; OCD involves unwanted obsessions and compulsions the person usually sees as excessive.
:::

:::mcq
Q: A man has always preferred solitary activities, shows little emotion, and seems indifferent to praise or criticism. He has no odd beliefs. Which disorder fits best?
- Schizotypal
- *Schizoid
- Avoidant
- Paranoid
> Detachment without odd beliefs and without longing for closeness.

Q: Which pair is most often confused because both involve few relationships?
- Histrionic and narcissistic
- *Schizoid and avoidant
- Dependent and antisocial
- Paranoid and obsessive-compulsive
> Schizoid people do not want closeness; avoidant people long for it but fear rejection.
:::

## 1.3 Borderline personality in plain words [core][starting]
**Borderline personality disorder** (sometimes called **emotionally unstable personality disorder**) is the personality disorder you will meet most often in clinics and emergency departments. Its heart is **instability**: of emotions, of relationships, of the sense of self, and of behaviour.

### Four areas of instability
1. **Emotions**: feelings rise fast, very high, and take a long time to settle. Many people describe chronic emptiness and bursts of intense anger.
2. **Relationships**: intense and stormy. A partner or friend can be seen as perfect one day and worthless the next. There is a powerful **fear of abandonment**, real or imagined.
3. **Self-image**: an unstable sense of who one is. Goals, values, friends, even sexual identity may shift. Under extreme stress, some people feel unreal or have brief paranoid thoughts.
4. **Impulses and behaviour**: impulsive spending, unsafe sex, binge eating, substance use, reckless driving, and repeated **self-harm** or suicidal behaviour.

:::sounds How people describe it
- "It's like I have no skin. Everything hurts more."
- "When he didn't reply for an hour, I was sure he'd left me forever."
- "I don't know who I am. I become whoever I'm with."
- "Cutting is the only thing that makes the storm stop for a while."
- "I feel empty, like a hole in the middle of me."
:::

### What it is not
- **Not "manipulative" or "attention-seeking".** Self-harm usually relieves unbearable feelings or communicates distress. Call it what it is: distress.
- **Not bipolar disorder.** In borderline personality disorder, mood changes within hours and in response to events, especially in relationships. In bipolar disorder, mood episodes last days to weeks and are a change from the person's usual self.
- **Not untreatable.** Specific therapies work well, and most people improve over the years.

:::widget moodline
{"prompt": "Here is one person's mood, rated every few hours over three days (0 is calm). What does this pattern suggest?", "series": [0, 2, -3, -1, 1, -4, 0, 2, -2, 3, -3, 0], "labels": ["Mon am", "Mon pm", "Tue am", "Tue pm", "Wed am", "Wed pm"], "options": ["A depressive episode", "A manic episode", "Rapid, reactive swings within hours, typical of borderline emotional instability", "Normal stable mood"], "answer": 2, "why": "The mood swings up and down many times within a day, usually after events such as an argument or a message. That reactive, hour-to-hour instability is typical of borderline personality. A depressive or manic episode would hold steady at a low or high level for days or weeks."}
:::

:::widget flow
{"title": "The abandonment cycle in borderline personality", "layout": "cycle", "nodes": [{"id": "a", "label": "A trigger", "detail": "A late reply, a change of plan, a partner spending time with friends."}, {"id": "b", "label": "Fear of being left", "detail": "'He's going to leave me', felt as certain and unbearable."}, {"id": "c", "label": "Frantic effort", "detail": "Dozens of calls and messages, accusations, pleading."}, {"id": "d", "label": "Conflict", "detail": "The other person pulls back or gets angry."}, {"id": "e", "label": "Feared outcome seems confirmed", "detail": "Emptiness, rage or despair; self-harm may bring brief relief."}, {"id": "f", "label": "Belief strengthened", "detail": "'People always leave me', which makes the next trigger hit harder."}], "caption": "Press Play. Therapy works at every link: noticing triggers, checking the facts, tolerating the feeling, and asking for reassurance in safer ways."}
:::

:::example Two lives
**Neha**, 22, a commerce student in Ahmedabad, has had stormy relationships since school. When her boyfriend does not answer calls, she panics, sends dozens of messages, then cuts her arm. She feels empty most days and has changed her course three times.

**Liam**, 34, in Dublin, has been in and out of emergency departments after overdoses following break-ups. He describes waves of rage that frighten him, binge drinking, and a constant fear that people he loves will leave.
:::

:::widget guess
{"prompt": "Among people diagnosed with borderline personality disorder and followed for ten years, about what percentage no longer met the criteria at some point (remission)?", "min": 0, "max": 100, "unit": "percent", "answer": [75, 95], "reveal": "Most of them: around 85 to 90 in 100 had a period of remission within ten years, and relapse after a long remission was uncommon. Impulsive behaviours such as self-harm improve fastest; feelings of emptiness and difficulties in work and relationships improve more slowly.", "clinician": "McLean Study of Adult Development (and 2012): 2-year remission 93%, 4-year sustained remission 78% by 16 years; recovery (remission plus good social and vocational functioning) about 50% to 60%. The Collaborative Longitudinal Personality Disorders Study found similar symptomatic improvement with persisting functional impairment."}
:::

:::widget brainmap
{"title": "Emotion and control circuits studied in borderline personality", "focus": ["amygdala", "prefrontal", "hippocampus"], "notes": {"amygdala": "Reacts strongly and quickly to emotional faces and perceived rejection in many studies, part of the brain's alarm system.", "prefrontal": "Regions that calm and reappraise emotion often show weaker control signals, so feelings rise fast and settle slowly.", "hippocampus": "Smaller volumes are reported in some studies, possibly linked to early stress and trauma."}, "caption": "Tap each area. These are averages across groups that help explain emotional instability; they do not diagnose an individual."}
:::

:::safety Self-harm is a risk, not a nuisance
People with borderline personality disorder have high rates of self-harm and a raised risk of suicide over their lifetime. Every act of self-harm needs a calm, kind, thorough assessment of risk, and every crisis is a chance to build trust. If you are worried about someone's immediate safety, involve your supervisor straight away.
:::

:::clinician
### Borderline criteria (DSM-5-TR, five or more of nine)
1. Frantic efforts to avoid real or imagined abandonment.
2. Unstable and intense relationships alternating between idealisation and devaluation.
3. Identity disturbance: markedly and persistently unstable self-image or sense of self.
4. Impulsivity in at least two potentially self-damaging areas (spending, sex, substances, reckless driving, binge eating).
5. Recurrent suicidal behaviour, gestures or threats, or self-mutilating behaviour.
6. Affective instability due to marked reactivity of mood (episodes usually last a few hours, rarely more than a few days).
7. Chronic feelings of emptiness.
8. Inappropriate, intense anger or difficulty controlling anger.
9. Transient, stress-related paranoid ideation or severe dissociative symptoms.

Prevalence: median about 2.7% in community studies; about 6% in primary care, 10% in outpatient and 20% in inpatient psychiatric settings (DSM-5-TR). The female excess seen in clinics is much smaller in community samples. Lifetime suicide rates in long-term cohorts range from roughly 3% to 10%; self-harm in 60% to 80%.
:::

:::recall
1. Name the four areas of instability in borderline personality disorder. || Emotions, relationships, self-image, impulses and behaviour.
2. How do mood changes in borderline personality differ from bipolar disorder? || Borderline: minutes to hours, reactive to events; bipolar: lasting episodes of days to weeks that are a change from usual self.
3. Why is "attention-seeking" a harmful label? || It dismisses real distress, increases shame and risk, and ignores that self-harm usually relieves unbearable feelings.
4. What happens to most people with borderline personality disorder over ten years? || Most have a remission; impulsive behaviour improves fastest.
:::

:::mcq
Q: A woman's mood shifts from calm to rage to tears several times a day, usually after arguments with her partner. She has never had days of reduced sleep with high energy. This most suggests:
- Bipolar I disorder
- *Emotional instability typical of borderline personality disorder
- Cyclothymia
- Schizophrenia
> Rapid, reactive mood shifts within hours.

Q: Which statement about borderline personality disorder is true?
- It never improves
- *Most people have a remission within ten years
- Self-harm is always manipulative
- It is the same as bipolar disorder
> Long-term studies show high remission rates.
:::

## 1.4 Where personality patterns come from [core][starting]
No single cause produces a personality disorder. Patterns grow from **temperament** (what we are born with), **experiences** (what happens to us, especially early), and the **culture** around us, all acting on each other over years.

### Temperament and genes
Babies differ from birth: some are easily upset and slow to calm, some cautious, some bold. Twin studies suggest that roughly **40 to 60 in 100** of the differences between people in personality traits and personality disorders come from genes. Genes do not decide a disorder. They shape sensitivity, and experience does the rest.

### Early experience and attachment
Many people with personality disorders, especially borderline, report **childhood abuse, neglect, loss or chaotic care**. Not everyone with these experiences develops a disorder, and not everyone with a disorder had them. A powerful idea is the **invalidating environment**: a child whose emotions are repeatedly dismissed, punished or ignored ("Stop crying, it's nothing") does not learn to understand, trust or calm her own feelings.

:::widget flow
{"title": "The biosocial transaction over time", "layout": "cycle", "nodes": [{"id": "a", "label": "Sensitive temperament", "detail": "The child reacts strongly and takes longer to calm."}, {"id": "b", "label": "Strong emotion shown", "detail": "Crying, anger, fear."}, {"id": "c", "label": "Invalidating response", "detail": "'Stop overreacting', punishment, or being ignored."}, {"id": "d", "label": "Escalation", "detail": "Only extreme displays get attention, so the child learns to escalate, while not learning to name or soothe feelings."}, {"id": "e", "label": "More sensitivity", "detail": "Each round strengthens emotional reactivity and mistrust of one's own feelings."}], "caption": "Press Play. Neither the child nor the parent is to blame: it is the mismatch, repeated over years, that matters. DBT validation and skills break the cycle."}
:::

:::analogy A sensitive plant in harsh weather
Imagine a plant that is naturally sensitive to cold. In a warm greenhouse it grows well. Left out in a harsh winter, it is damaged far more than a hardier plant would be. Temperament is the plant; the environment is the weather. Neither alone explains the damage.
:::

### Culture and context
What counts as "deviant" depends on culture. In many Indian families, deferring to elders, relying on family for decisions, and keeping emotions private are **expected**, not disordered. Calling a young woman "dependent" because she consults her parents before a decision would be a cultural mistake. On the other hand, real personality difficulties can be hidden for years because families absorb them, or labelled as "nazar", "stubbornness" or "spoilt nature".

:::widget sort
{"prompt": "Cultural norm or possible pathology? Place each example (think about context).", "buckets": ["Within cultural norms", "May be a personality difficulty"], "items": [{"text": "A 25-year-old in Lucknow consults her parents before accepting a job offer in another city", "bucket": 0}, {"text": "A 30-year-old cannot decide what to eat, wear or buy without phoning his mother, many times a day, and panics when she is unavailable", "bucket": 1, "why": "Far beyond what the culture expects, and distressing."}, {"text": "A man keeps his feelings private with strangers", "bucket": 0}, {"text": "A woman believes, against all evidence, that every neighbour has poisoned her water at different times over 15 years", "bucket": 1}, {"text": "A young couple lives with the husband's parents and shares decisions with them", "bucket": 0}, {"text": "A student lies, steals from family, threatens his mother with a knife, and shows no regret, since age 13", "bucket": 1}]}
:::

:::widget decide
{"scene": "Ms Thomas brings her daughter Ann, 19, from Thrissur, who has started cutting her arms after arguments. The mother says, 'In our family we don't make a drama about feelings. I always told her to stop crying and pray.' Ann says quietly that no one ever asked her how she felt.", "ask": "How do you use the idea of the invalidating environment here?", "choices": [{"label": "Tell the mother she caused Ann's problems by being cold", "verdict": "harm", "outcome": "The mother leaves angry and refuses to return. Ann loses her main support.", "why": "Blaming parents is inaccurate (temperament matters too) and destroys the alliance you need."}, {"label": "Explain that some people are born more emotionally sensitive, and that they need extra help to name and calm feelings; invite the mother to learn validation skills alongside Ann", "verdict": "best", "outcome": "The mother is relieved not to be blamed, attends family skills sessions, and starts saying 'I can see you're upset' before giving advice. Ann's cutting reduces.", "why": "The biosocial model describes a mismatch between a sensitive temperament and an environment that does not validate it, without blame. Families can learn to validate."}, {"label": "Avoid discussing the family at all", "verdict": "ok", "outcome": "Ann works on skills, but conflict at home keeps triggering crises.", "why": "Individual work helps, but involving willing family members often helps more."}]}
:::

:::clinician
### Aetiological evidence in brief
- **Heritability**: twin studies estimate about 40% to 60% for most personality disorders , with shared environment contributing little and non-shared environment much.
- **Childhood adversity**: retrospective studies report childhood sexual abuse in 40% to 70% of patients with BPD; prospective cohorts confirm that documented abuse and neglect raise the risk of adult personality disorder about four-fold. Neglect and emotional abuse may matter as much as sexual abuse.
- **Neurobiology**: heightened amygdala reactivity to emotional faces and reduced prefrontal regulation in BPD; altered serotonergic function linked to impulsive aggression; low autonomic arousal and reduced amygdala response to others' distress in psychopathy.
- **Developmental models**: Linehan's biosocial theory (emotional vulnerability plus invalidating environment); Fonagy's mentalisation model (insecure, especially disorganised, attachment undermines the capacity to understand mental states); Kernberg's object relations model (splitting and identity diffusion); Young's schema model (early maladaptive schemas from unmet core needs).
- **Course**: personality traits show mean-level maturation with age (the "maturity principle"); Cluster B symptoms, especially impulsivity, decline most with age.
:::

:::widget timeline
{"prompt": "Order how a personality takes shape, from birth to adult life.", "events": [{"label": "Temperament at birth: some babies are calm, others easily upset"}, {"label": "Early attachment: how carers respond shapes the sense of safety with others"}, {"label": "Childhood experiences: school, friends, praise, neglect or abuse"}, {"label": "Adolescence: identity forms and patterns become clearer"}, {"label": "Early adulthood: the pattern is fairly stable, and a disorder can be diagnosed with confidence"}], "why": "Genes and temperament give the starting point; experience shapes it. This is why personality disorders are usually diagnosed from late adolescence on, and why traits can still soften across adult life."}
:::

:::recall
1. What three broad influences shape personality disorders? || Temperament and genes, early experience, culture and context.
2. Roughly what share of personality differences comes from genes? || About 40 to 60 in 100.
3. What is an invalidating environment? || One in which a child's emotions are repeatedly dismissed, punished or ignored, so the child does not learn to understand or regulate them.
4. Why must culture be considered before calling someone "dependent"? || Deferring to family can be a cultural norm; disorder means far beyond what the culture expects, with distress or impairment.
:::

:::mcq
Q: The biosocial model of borderline personality disorder proposes:
- Bad parenting alone causes the disorder
- *An emotionally sensitive temperament meets an environment that invalidates emotions
- It is purely genetic
- It results from head injury
> Vulnerability plus invalidation, without blame.

Q: A 24-year-old Indian woman lets her parents help choose her marriage partner. This is best seen as:
- Dependent personality disorder
- *A cultural practice, not evidence of disorder by itself
- Avoidant personality disorder
- Borderline personality disorder
> Judge against the person's own cultural expectations.
:::

## 1.5 Level check · Starting [core][starting]
Twelve or more right out of fifteen opens the Beginner level.

:::mcq
Q: Personality is best described as:
- A mood that lasts a few days
- *A person's usual way of thinking, feeling, relating and acting
- An illness that starts suddenly
- Intelligence
> Personality is the stable, characteristic pattern.

Q: A personality disorder pattern must usually be traceable to:
- Old age
- *Adolescence or early adulthood
- Last month
- Early childhood only
> It is long-standing.

Q: Which feature is needed for a personality disorder?
- High intelligence
- *Rigidity across many situations
- A recent stressor
- Hallucinations
> Inflexible and pervasive.

Q: Which cluster contains the anxious and fearful disorders?
- Cluster A
- Cluster B
- *Cluster C
- There is no such cluster
> Avoidant, dependent, obsessive-compulsive.

Q: Which is a Cluster A disorder?
- Histrionic
- *Schizotypal
- Dependent
- Borderline
> Paranoid, schizoid, schizotypal.

Q: A person who longs for friends but avoids them for fear of ridicule most likely has:
- Schizoid personality disorder
- *Avoidant personality disorder
- Antisocial personality disorder
- Histrionic personality disorder
> Desire for closeness separates avoidant from schizoid.

Q: Grandiosity, need for admiration and lack of empathy describe:
- Histrionic
- *Narcissistic
- Paranoid
- Dependent
> Narcissistic personality disorder.

Q: Which is a core feature of borderline personality disorder?
- Lasting elation for weeks
- *Intense fear of abandonment
- Lack of interest in relationships
- Odd magical beliefs only
> Abandonment fear is central.

Q: Mood changes in borderline personality disorder usually last:
- Several weeks
- *Hours, and are often triggered by events
- Months
- Exactly one day
> Reactive and brief.

Q: Self-harm in borderline personality disorder is best understood as:
- Manipulation
- *A way of coping with or communicating unbearable distress, needing careful risk assessment
- Harmless
- A sign of psychosis
> Treat with respect and assess risk every time.

Q: Over ten years, most people with borderline personality disorder:
- Get worse
- *Have a period of remission
- Develop schizophrenia
- Never change
> Remission is common.

Q: Which best explains why personality disorders develop?
- Genes alone
- Bad luck alone
- *A mix of temperament, early experience and culture
- Diet
> Multiple interacting causes.

Q: An invalidating environment is one in which:
- A child is given too many choices
- *A child's emotions are repeatedly dismissed or punished
- A child lives with grandparents
- A child moves school
> Emotions are not acknowledged.

Q: Before diagnosing a personality disorder you must consider:
- Only the patient's words
- *Cultural expectations, and whether another illness or a drug explains the picture
- Only the family's view
- Blood tests
> General criteria E and F, and culture.

Q: The "mad, bad, sad" shorthand should be used:
- To describe patients in notes
- *Only as a private memory aid for the clusters, never to label a person
- With families
- In court reports
> It is stigmatising if used about people.
:::

# Part II · Beginner: the ten disorders and how to assess them

## 2.1 Assessing personality well [core][beginner]
Personality cannot be assessed in one rushed interview, especially when the person is in crisis. Depression makes everyone look dependent and hopeless; mania makes people look grandiose and impulsive; drugs and intoxication change behaviour. The rule is: **assess the long-term pattern, not the current state.**

### Principles
1. **Ask about the whole life**, not only now: "What were you like at school? At college? In your first job? How do your friends describe you?"
2. **Look for patterns across situations and relationships**: the same conflicts with different bosses, partners and friends.
3. **Use collateral history** from a family member or friend who has known the person for years, with consent.
4. **Avoid diagnosing during an acute episode** of depression, mania, psychosis or intoxication. Wait, or describe "traits" provisionally.
5. **Notice your own reactions**: strong feelings in the clinician (wanting to rescue, feeling angry or bored) can be clues to the patient's relationship patterns, not proof of anything.
6. **Consider culture**, gender and life stage.

:::widget decide
{"scene": "Mr Iyer, 52, is admitted with severe depression. He is clingy, phones his wife a dozen times a day from the ward, asks the nurses to choose his meals, and says he 'can't do anything alone'. A trainee writes 'dependent personality disorder' in the notes.", "ask": "What is the best response?", "choices": [{"label": "Keep the diagnosis; the behaviour clearly fits", "verdict": "harm", "outcome": "The label follows him in his records for years. After recovery he is independent and runs his own business.", "why": "Dependency and indecision are common in severe depression. A personality diagnosis needs a long-standing pattern, ideally assessed when the person is well."}, {"label": "Treat the depression, and take a lifelong history from Mr Iyer and his wife; revisit personality only when he is well", "verdict": "best", "outcome": "His wife says he has always been confident and decisive. After recovery, the dependent behaviour disappears.", "why": "State (current illness) must be separated from trait (long-term pattern). Collateral history is key."}, {"label": "Ask him to complete a personality questionnaire today", "verdict": "ok", "outcome": "The questionnaire scores high on dependency and neuroticism, which reflects his depression more than his personality.", "why": "Self-report questionnaires completed during depression are distorted by the low mood."}]}
:::

:::widget flow
{"title": "Separating state from trait", "layout": "chain", "nodes": [{"id": "a", "label": "Note the current picture", "detail": "Record behaviour as 'observed during the current episode'."}, {"id": "b", "label": "Take a lifetime history", "detail": "School, college, work, relationships, coping with past stress."}, {"id": "c", "label": "Get collateral", "detail": "Someone who has known the person for years: 'What were they like before?'"}, {"id": "d", "label": "Look for consistency", "detail": "Same pattern with different people and places since youth?"}, {"id": "e", "label": "Treat the episode", "detail": "Depression, mania, psychosis, intoxication."}, {"id": "f", "label": "Reassess when well", "detail": "Use structured interviews only when the person is in a stable state."}], "caption": "Press Play. Skipping steps is how people with depression get labelled 'dependent' for life."}
:::

### Tools you may meet
- **Structured interviews**: the Structured Clinical Interview for DSM-5 Personality Disorders (SCID-5-PD); the International Personality Disorder Examination (IPDE), developed with the World Health Organization and field-tested internationally, including in India.
- **Screening questionnaires**: the SAPAS (8 questions, quick screen), the Personality Diagnostic Questionnaire (PDQ-4).
- **Dimensional measures**: the Personality Inventory for DSM-5 (PID-5) for the trait domains; the Level of Personality Functioning Scale; the Standardised Assessment of Severity of Personality Disorder (SASPD) for ICD-11 severity.
- **Psychopathy**: the Hare Psychopathy Checklist-Revised (PCL-R), used in forensic settings by trained raters.

:::widget worked
{"title": "Separating state from trait", "steps": [{"q": "Farah, 28, presents after an overdose following a break-up. She is tearful, angry and says she 'always ruins everything'. What is the first question in your head?", "a": "Is this a crisis reaction (state), a mood disorder, a long-standing pattern (trait), or several of these? Do not decide yet."}, {"q": "What do you ask to explore the long-term pattern?", "a": "How have her relationships gone since her teens? Has she self-harmed before? How stable are her goals and sense of self? How do friends and family describe her over the years? Any periods of feeling well and steady?"}, {"q": "She describes five intense relationships ending in crises since 16, cutting since 15, chronic emptiness and frequent changes of career plan. Her sister confirms this. What does this suggest?", "a": "A long-standing pattern across relationships and situations, from adolescence, confirmed by collateral history: borderline personality disorder is likely. Still screen for depression, PTSD, substance use and bipolar disorder."}, {"q": "How do you share this?", "a": "Explain the diagnosis as a description of patterns that cause suffering, link it to her experiences, emphasise that people improve and that specific therapies work, and agree a crisis plan."}], "yourTurn": [{"q": "Vikram, 40, is referred for 'narcissistic personality' because he was rude and boastful in a manic episode last month. He is now well. What do you do?", "a": "Assess his personality now that he is well, with a lifetime history and collateral. Grandiosity and irritability during mania are features of the episode, not personality. If he was not like this before or after the episode, do not diagnose a personality disorder."}]}
:::

:::clinician
### Practical notes
- **SAPAS** (2003): 8 yes/no items; a score of 3 or more has sensitivity about 0.94 and specificity about 0.85 for any personality disorder in psychiatric outpatients.
- **IPDE**: semi-structured, covers ICD-10 and DSM-IV categories; developed by Loranger and the WHO, with field trials in 11 countries including India.
- **Countertransference** is information, not evidence. Strong urges to rescue, reject, or bend rules are common with Cluster B presentations; use supervision and team consultation.
- **Disclosure**: many patients find a personality disorder diagnosis validating when explained well; others feel condemned. Offer written information and the chance to ask questions; never use the label as a reason to refuse care.
- **Documentation**: describe behaviours and traits, avoid pejorative terms ("manipulative", "attention-seeking"), and record risk assessments carefully.
:::

:::recall
1. What is the rule for assessing personality in someone acutely ill? || Assess the long-term pattern, not the current state; avoid diagnosing during an acute episode.
2. Why is collateral history important? || Someone who has known the person for years can confirm a long-standing pattern and correct state-dependent self-report.
3. Name two structured interviews for personality disorders. || SCID-5-PD and IPDE.
4. What is the SAPAS? || A brief 8-question screen for personality disorder.
:::

:::mcq
Q: The main reason not to diagnose a personality disorder during a severe depressive episode is:
- Depression protects against personality disorder
- *Depression distorts self-report and behaviour, so the long-term pattern cannot be judged reliably
- It is illegal
- Personality disorders cannot coexist with depression
> State versus trait.

Q: Which tool is used to assess psychopathy in forensic settings?
- SAPAS
- PHQ-9
- *PCL-R
- MMSE
> The Hare Psychopathy Checklist-Revised.
:::

## 2.2 Cluster A in depth [core][beginner]
Cluster A disorders share **odd or eccentric** ways of thinking and relating, and a modest link with the schizophrenia spectrum, strongest for schizotypal.

### Paranoid personality disorder
A pervasive **distrust and suspiciousness**. The person:
- Suspects, without enough basis, that others are exploiting, harming or deceiving them.
- Doubts the loyalty of friends and colleagues.
- Will not confide in others, fearing information will be used against them.
- Reads hidden insults or threats into harmless remarks.
- Holds grudges for years.
- Quickly feels attacked and counter-attacks.
- Repeatedly suspects a partner of infidelity without reason.

**Key difference from delusional disorder and schizophrenia**: in paranoid personality, suspicions are lasting attitudes held with some flexibility, not fixed false beliefs, and there are no hallucinations.

### Schizoid personality disorder
**Detachment** from relationships and a narrow range of emotional expression. The person does not want or enjoy close relationships, almost always chooses solitary activities, has little interest in sex, takes pleasure in few activities, has no close friends beyond family, seems indifferent to praise or criticism, and appears cold or flat. Unlike avoidant personality, they are not secretly longing for closeness.

### Schizotypal personality disorder
**Discomfort with close relationships plus odd thinking, perception and behaviour**:
- Ideas of reference (but not fixed delusions).
- Odd beliefs or magical thinking beyond cultural norms (telepathy, a "sixth sense").
- Unusual perceptual experiences (sensing a presence).
- Odd, vague or overly elaborate speech.
- Suspiciousness; inappropriate or constricted emotion; odd appearance or behaviour.
- No close friends; social anxiety that does not lessen with familiarity, linked to paranoid fears rather than self-criticism.

:::widget flow
{"title": "A suspicious patient: personality, delusion or psychosis?", "layout": "tree", "nodes": [{"id": "r", "label": "Long-standing suspicion of others", "detail": "Ask how fixed the belief is, how long it has lasted, and whether there are other psychotic symptoms."}, {"id": "p", "label": "Suspicious attitude, some flexibility, since youth", "detail": "Paranoid personality disorder.", "parent": "r"}, {"id": "d", "label": "One fixed false belief, otherwise well", "detail": "Delusional disorder (for example persecutory or jealous type).", "parent": "r"}, {"id": "s", "label": "Fixed beliefs plus hallucinations, disorganisation or decline", "detail": "Schizophrenia or another psychotic disorder.", "parent": "r"}, {"id": "c", "label": "Understandable mistrust", "detail": "Real discrimination, persecution or abuse: not a disorder.", "parent": "r"}], "caption": "Tap each branch."}
:::

:::trap Culture before odd beliefs
Belief in spirit possession, the evil eye (nazar), astrology or the power of a guru's blessing is common and shared in many Indian communities. It is not schizotypal thinking. Ask: is the belief shared by the person's community, and does the person hold it in the same way they do?
:::

:::widget sort
{"prompt": "Paranoid personality, schizoid, schizotypal, or a psychotic disorder? Place each person.", "buckets": ["Paranoid personality", "Schizoid personality", "Schizotypal personality", "Psychotic disorder"], "items": [{"text": "For years has suspected colleagues of trying to get him fired; refuses to share anything personal; holds grudges, but accepts it 'might be in my head' sometimes", "bucket": 0}, {"text": "Lives alone in Shimla, enjoys solitary walking and model trains, has no wish for friends, shows little emotion, no odd beliefs", "bucket": 1}, {"text": "Believes she can sense when strangers are thinking about her, wears mismatched clothes and speaks in a vague, roundabout way; few friends", "bucket": 2}, {"text": "Hears voices commenting on his actions for six months and is certain the government has implanted a chip", "bucket": 3}, {"text": "Has an 'aura reading' practice, feels a presence in the room at times, and is uneasy even with people she has known for years", "bucket": 2}, {"text": "Fixed, unshakeable belief for a year that his wife is poisoning him, with no other symptoms", "bucket": 3, "why": "A fixed false belief held with complete conviction suggests delusional disorder."}]}
:::

:::widget decide
{"scene": "Mr Bhatt, 48, a retired government clerk in Vadodara, is referred by his son. For decades he has been suspicious of neighbours, relatives and colleagues, accusing them of 'plotting'. He has filed several police complaints, all found baseless. He agrees to see you only to 'prove he is right'. He is tense and guarded.", "ask": "How do you approach the interview?", "choices": [{"label": "Tell him immediately that his suspicions are false and he needs medicine", "verdict": "harm", "outcome": "He leaves, convinced you are 'part of it', and refuses all future appointments.", "why": "Direct confrontation confirms the person's fear that others are against him."}, {"label": "Be straightforward, respectful and consistent; explain what you will do and why; focus on his distress and the stress the conflicts cause him, without arguing about the content", "verdict": "best", "outcome": "He returns for a second meeting and agrees to talk about his poor sleep and anger. Trust builds slowly.", "why": "With paranoid patients, transparency, consistency and a focus on shared goals (less stress, better sleep) build the alliance. Avoid both arguing and agreeing with suspicions."}, {"label": "Agree with his suspicions to build rapport", "verdict": "harm", "outcome": "He files another complaint, saying 'even the doctor agrees'.", "why": "Colluding reinforces the suspicion and can harm others."}]}
:::

:::clinician
### Depth notes
- **Paranoid PD**: prevalence about 2% to 4% (NESARC 4.4%); higher in relatives of people with schizophrenia and delusional disorder; immigrants, refugees and minority groups may show understandable mistrust that should not be pathologised. Treatment: supportive psychotherapy, CBT targeting threat appraisals; low-dose antipsychotic only for transient psychotic decompensation.
- **Schizoid PD**: rare (under 1% to about 3%); differential includes autism (restricted interests and social communication deficits from early childhood), avoidant PD, schizophrenia prodrome, and depression with withdrawal.
- **Schizotypal PD**: prevalence about 0.6% to 4.6%; strongest genetic link with schizophrenia; about 20% to 40% of clinically referred young people with schizotypal features meet criteria for an "at-risk mental state", and a minority transition to schizophrenia. Low-dose risperidone (0.25 to 2 mg) showed benefit for psychotic-like symptoms in small trials; antidepressants for comorbid depression. ICD-11 classifies **schizotypal disorder** in the schizophrenia spectrum chapter (6A22), not as a personality disorder.
:::

:::widget compare
{"title": "Schizotypal personality or schizophrenia?", "a": {"label": "Schizotypal personality disorder", "points": ["Odd beliefs: magic, telepathy, a 'sixth sense'", "Unusual perceptions, such as sensing a presence", "Ideas of reference, not fixed delusions", "Odd speech and dress, few close friends", "A lifelong, stable pattern"], "summary": "Schizotypal: eccentric thinking and social discomfort, without lasting psychosis."}, "b": {"label": "Schizophrenia", "points": ["Fixed delusions held with full conviction", "Persistent hallucinations", "Clear decline from a previous level of functioning", "Often disorganised speech and negative symptoms", "Begins as an illness, usually in the late teens or twenties"], "summary": "Schizophrenia: an illness with full psychotic symptoms and a decline."}, "caption": "Schizotypal disorder is genetically related to schizophrenia, and ICD-11 places it with the psychotic disorders rather than with personality."}
:::

:::recall
1. What separates paranoid personality from delusional disorder? || Paranoid personality: lasting suspicious attitudes held with some flexibility; delusional disorder: fixed false beliefs held with full conviction.
2. What separates schizoid from avoidant personality? || Schizoid people do not want close relationships; avoidant people long for them but fear rejection.
3. Name three features of schizotypal personality. || Ideas of reference, magical thinking, unusual perceptions, odd speech, suspiciousness, lasting social anxiety, odd behaviour.
4. Where does ICD-11 place schizotypal disorder? || In the schizophrenia spectrum chapter, not among personality disorders.
:::

:::mcq
Q: A man in Varanasi believes a family elder's blessing protects him from accidents, as does everyone in his village. He has friends and a stable job. This is:
- Schizotypal personality disorder
- *A culturally shared belief, not pathology
- Delusional disorder
- Paranoid personality disorder
> Shared cultural beliefs are not magical thinking in the clinical sense.

Q: Which Cluster A disorder has the strongest genetic link with schizophrenia?
- Paranoid
- Schizoid
- *Schizotypal
- None of them
> Schizotypal is part of the schizophrenia spectrum.
:::

## 2.3 Cluster B: antisocial, histrionic and narcissistic [core][beginner]
Cluster B disorders share **dramatic, emotional or erratic** behaviour. Borderline personality has its own section next.

:::widget layers
{"title": "Narcissism: what shows and what lies beneath", "shape": "iceberg", "layers": [{"label": "Above the surface: grandiosity", "detail": "Boasting, entitlement, need for admiration, contempt for others."}, {"label": "Just below: sensitivity to criticism", "detail": "Rage, sulking or collapse when admiration is withdrawn (narcissistic injury)."}, {"label": "Deeper: fragile self-worth", "detail": "Shame, emptiness, fear of being ordinary or worthless."}, {"label": "Deepest: early experience", "detail": "Often a history of conditional love, idealisation or neglect of the child's real feelings."}], "caption": "Tap each layer. Therapy that only confronts the surface often fails; empathic attention to the layers beneath builds the alliance."}
:::

### Antisocial personality disorder
A pattern of **disregard for, and violation of, the rights of others**, beginning in childhood or early adolescence as conduct disorder and continuing into adult life. Features include repeated law-breaking, lying and conning, impulsivity, irritability and fights, reckless disregard for safety, irresponsibility at work and with money, and **lack of remorse**. It is diagnosed only in adults, and only if conduct disorder was present before about fifteen.

**Psychopathy** overlaps with antisocial personality but is narrower and more severe: superficial charm, grandiosity, pathological lying, cunning, shallow emotions, callousness and no empathy, alongside an antisocial lifestyle. Most people with antisocial personality disorder are not psychopaths, but most psychopaths in prison meet antisocial criteria.

### Histrionic personality disorder
**Excessive emotionality and attention-seeking**: uncomfortable when not the centre of attention; inappropriately seductive or provocative; rapidly shifting, shallow emotions; uses appearance to draw attention; speech that is dramatic but vague; theatrical; easily influenced; thinks relationships are more intimate than they are.

### Narcissistic personality disorder
**Grandiosity, need for admiration and lack of empathy**: an inflated sense of importance; fantasies of unlimited success or brilliance; believes they are special and should mix only with high-status people; needs constant admiration; sense of entitlement; exploits others; envies others or believes others envy them; arrogant behaviour. Many have a fragile self-esteem underneath, and react to criticism with rage or collapse (**narcissistic injury**). Some present as shy, hypersensitive and resentful (the "vulnerable" form) rather than openly boastful.

:::widget sort
{"prompt": "Antisocial, histrionic or narcissistic? Place each person.", "buckets": ["Antisocial", "Histrionic", "Narcissistic"], "items": [{"text": "Wears dramatic outfits to the office, sulks if not the centre of attention, and calls a new acquaintance her 'best friend'", "bucket": 1}, {"text": "Has defrauded several elderly people and laughs about it; was expelled for stealing at 13", "bucket": 0}, {"text": "Insists on seeing only the head of department, belittles junior doctors, and explodes when kept waiting", "bucket": 2}, {"text": "Describes her week in vivid, emotional terms but cannot give a single concrete detail", "bucket": 1, "why": "Impressionistic, vague speech is typical of histrionic style."}, {"text": "Feels secretly superior, deeply wounded by any criticism, envious of colleagues' success", "bucket": 2, "why": "The vulnerable form of narcissism."}, {"text": "Repeated fights, reckless driving after drinking, no stable job, no regret for injuring others", "bucket": 0}]}
:::

:::widget decide
{"scene": "Rajeev, 35, a successful businessman in Gurugram, is referred by his wife after she threatened to leave. In the first session he says he is 'more intelligent than most therapists', that his staff are 'idiots who can't keep up', and that he has come only to show his wife he 'tried'. When you ask about his childhood, he becomes cold and says you are wasting his time.", "ask": "What helps most in building an alliance?", "choices": [{"label": "Challenge his arrogance directly in the first session", "verdict": "harm", "outcome": "He experiences humiliation, becomes enraged and does not return.", "why": "Early confrontation of grandiosity feels like an attack on a fragile self-esteem and ends therapy."}, {"label": "Acknowledge his achievements and his frustration, show genuine interest in what matters to him, and link therapy to his own goals (keeping his marriage)", "verdict": "best", "outcome": "He relaxes a little and agrees to come back to 'see if this is worth it'. Over months he begins to talk about feeling empty and alone.", "why": "Empathic attunement to the person's need to be valued, without colluding, makes room for exploring the vulnerability underneath. Kohut's self psychology describes this approach."}, {"label": "Flatter him constantly so that he keeps coming", "verdict": "ok", "outcome": "He keeps attending but nothing changes.", "why": "Respect is needed, but uncritical flattery colludes with the pattern."}]}
:::

:::clinician
### Depth notes
- **Antisocial PD criteria** (DSM-5-TR): pervasive disregard for others' rights since age 15, three or more of: failure to conform to lawful behaviour; deceitfulness; impulsivity or failure to plan; irritability and aggressiveness; reckless disregard for safety; consistent irresponsibility; lack of remorse. Age at least 18; evidence of conduct disorder before 15; not exclusively during schizophrenia or bipolar disorder. Prevalence 0.2% to 3.3% in community; much higher in prisons (about 40% to 70% of male prisoners) and in substance use services. Mortality from violence, accidents and suicide is raised.
- **Psychopathy (PCL-R)**: 20 items scored 0 to 2 (total 0 to 40), cut-offs about 30 (North America) and 25 (UK); Factor 1 interpersonal-affective (glibness, grandiosity, lying, conning, lack of remorse, shallow affect, callousness, failure to accept responsibility) and Factor 2 lifestyle-antisocial (stimulation-seeking, parasitic lifestyle, poor behavioural control, early behaviour problems, lack of goals, impulsivity, irresponsibility, juvenile delinquency, revocation of release). High PCL-R predicts violent recidivism; ethically, it should never be used outside trained forensic assessment.
- **Treatment of antisocial PD**: limited evidence; treat substance use and comorbid ADHD; cognitive-behavioural programmes focused on offending (for example Reasoning and Rehabilitation, Thinking Skills); mentalisation-based treatment for antisocial PD is under trial. No medicine is licensed; lithium, SSRIs and some antipsychotics have weak evidence for impulsive aggression.
- **Histrionic PD**: prevalence about 1.8%; differential includes borderline (more self-destructive, empty, unstable), somatic symptom disorder, and cultural styles of emotional expression.
- **Narcissistic PD**: prevalence 0% to 6.2%; grandiose and vulnerable presentations; risk of suicide after narcissistic injury (shame after a public failure or legal problem) can be underestimated because the person appears confident. Transference-focused psychotherapy, mentalisation-based treatment, schema therapy.
:::

:::widget compare
{"title": "Antisocial personality disorder and psychopathy", "a": {"label": "Antisocial personality disorder", "points": ["Defined mainly by behaviour: law-breaking, lying, aggression, irresponsibility", "Needs conduct disorder before age 15", "Diagnosed only from age 18", "Common in prisons: many inmates meet criteria"], "summary": "ASPD: a broad, behaviour-based diagnosis."}, "b": {"label": "Psychopathy", "points": ["Adds interpersonal and emotional features: charm, grandiosity, manipulation", "Shallow emotion, no remorse or guilt, little empathy", "Measured with a structured checklist, not a DSM diagnosis", "Only a minority of people with ASPD are psychopathic"], "summary": "Psychopathy: a narrower, more severe group, defined by a cold emotional core."}, "caption": "Most people with high psychopathy meet ASPD criteria, but most people with ASPD are not psychopaths."}
:::

:::recall
1. What childhood history is required for antisocial personality disorder? || Conduct disorder with onset before about 15.
2. How is psychopathy different from antisocial personality disorder? || Narrower and more severe: adds callousness, shallow affect, grandiosity and lack of empathy to antisocial behaviour; measured by the PCL-R.
3. What is narcissistic injury? || Rage or collapse after criticism or failure, exposing a fragile self-esteem.
4. Name three features of histrionic personality. || Needs attention, shallow shifting emotions, seductive or dramatic behaviour, vague impressionistic speech, overestimates intimacy.
:::

:::mcq
Q: A man of 30 has repeated arrests for fraud and assault, lies easily, and shows no remorse. As a child he was expelled for theft and fighting from age 12. The diagnosis is:
- Narcissistic personality disorder
- *Antisocial personality disorder
- Borderline personality disorder
- Paranoid personality disorder
> Adult disregard for others with conduct disorder before 15.

Q: A confident executive becomes suicidal after being publicly sacked for fraud. Which personality style puts him at particular risk at this moment?
- Schizoid
- Dependent
- *Narcissistic, because of shame after a public fall
- Avoidant
> Narcissistic injury can precipitate suicide; risk is easily missed.
:::

## 2.4 Borderline personality disorder in depth [core][beginner]
You met the four areas of instability at the Starting level. Here you apply the full criteria, look at what commonly comes with borderline personality disorder, and learn the principles of good general care.

:::widget build
{"vignette": "Priyanka, 26, a nurse in Kolkata, is seen after cutting her forearm deeply when her partner went to a friend's wedding without her. She says she 'knew he was going to leave'. Since 17 she has had a series of intense relationships that start with 'he's my soulmate' and end with screaming fights and breaking things. She often spends a month's salary in a day and has had unsafe sex with strangers when upset. Her mood swings from fine to furious to despairing within hours. She says she feels 'hollow' most of the time and 'doesn't know who she really is'. She has cut herself since 15. She denies hearing voices, and when very stressed she feels 'like I'm watching myself from outside'. She has never had a period of days with reduced need for sleep and high energy.", "rule": "Tick every borderline criterion present. Diagnosis needs five or more of nine.", "symptoms": [{"label": "Frantic efforts to avoid real or imagined abandonment", "present": true, "why": "Convinced he would leave; intense reaction to a brief absence."}, {"label": "Unstable, intense relationships alternating idealisation and devaluation", "present": true, "why": "'Soulmate' to screaming fights."}, {"label": "Identity disturbance", "present": true, "why": "'Doesn't know who she really is.'"}, {"label": "Impulsivity in at least two self-damaging areas", "present": true, "why": "Spending and unsafe sex."}, {"label": "Recurrent suicidal behaviour or self-harm", "present": true, "why": "Cutting since 15."}, {"label": "Affective instability from marked mood reactivity", "present": true, "why": "Fine to furious to despairing within hours."}, {"label": "Chronic emptiness", "present": true, "why": "'Hollow' most of the time."}, {"label": "Intense, inappropriate anger", "present": true, "why": "Screaming fights and breaking things."}, {"label": "Transient stress-related paranoia or severe dissociation", "present": true, "why": "Depersonalisation under stress."}], "need": 5, "needCore": false, "verdict": "All nine criteria are present, beginning in adolescence, across relationships, with serious self-harm. Borderline personality disorder is very likely. Next: assess suicide risk now, screen for depression, PTSD (including complex PTSD), substance use and eating disorders, and plan a structured treatment such as DBT or MBT with a crisis plan."}
:::

### What often comes with it
Most people with borderline personality disorder have at least one other condition: **depression** (very common), **anxiety disorders**, **PTSD and complex PTSD**, **substance use**, **eating disorders** (especially bulimia and binge eating), and **ADHD**. Treating these matters, but treating them alone without addressing the personality pattern often gives disappointing results.

:::widget flow
{"title": "Responding to a crisis call from someone with borderline personality", "layout": "tree", "nodes": [{"id": "r", "label": "Distressed call", "detail": "Listen and validate first. Then ask directly about intent, plan, means, and what has stopped them so far."}, {"id": "low", "label": "Distress, no intent or plan", "detail": "Work through the crisis plan and skills together; agree the next few hours; arrange routine follow-up.", "parent": "r"}, {"id": "mid", "label": "Thoughts with some planning or access to means", "detail": "Reduce means, involve a trusted person to stay, arrange urgent review within a day.", "parent": "r"}, {"id": "high", "label": "Clear intent, plan or recent overdose", "detail": "Emergency assessment now; medical care if anything was taken; a brief, focused admission if needed.", "parent": "r"}], "caption": "Tap each branch. Every call deserves a calm, structured risk assessment, not 'it's the usual'."}
:::

:::widget compare
{"title": "Borderline personality disorder or bipolar disorder?", "a": {"label": "Borderline personality disorder", "points": ["Mood swings over hours, often triggered by a row or a feared rejection", "Shifts between anger, emptiness, anxiety and despair", "Lifelong pattern since adolescence", "Chronic emptiness and fear of abandonment", "Self-harm often linked to interpersonal stress"], "summary": "BPD: fast, reactive emotional storms in a stable pattern of unstable relationships."}, "b": {"label": "Bipolar disorder", "points": ["Distinct episodes lasting days or longer", "Elevated mood with less need for sleep and more energy", "Episodes can arise without any trigger", "Clear periods of normal mood in between", "Often runs in families; responds to mood stabilisers"], "summary": "Bipolar: distinct episodes that are a change from the person's usual self."}, "caption": "Ask how long a high lasts and whether sleep need falls. Both disorders can occur together."}
:::

:::widget moodline
{"prompt": "Here is Priya's mood across one fortnight. Which pattern fits best?", "series": [1, -2, 0, -2.5, 1.5, -1, -2.8, 0.5, -1.5, 1, -2, 0.5, -2.2, 0], "labels": ["Day 1", "Day 7", "Day 14"], "options": ["Bipolar disorder with a manic episode", "Rapid, reactive mood shifts every day or two", "Steady depression", "Normal mood"], "answer": 1, "why": "The line jumps up and down every day or two, never staying high or low for long. That matches the affective instability of borderline personality disorder, where moods shift within hours in response to events. A bipolar episode would hold its high or low for days on end."}
:::

### Good general care: what everyone should do
Whatever the setting, these principles help:
- **Validate first**: acknowledge feelings before problem-solving ("It makes sense you felt terrified when he left").
- **Be consistent and reliable**: keep appointments, explain absences in advance, avoid sudden changes of clinician.
- **Be clear about boundaries**, kindly: what you can and cannot offer, and why.
- **Share a crisis plan**, written with the patient: early warning signs, coping steps, people to call, what to do if risk rises.
- **Avoid rescuing and rejecting**: both extremes repeat old patterns.
- **Use the team**: supervision and a shared approach prevent "splitting" of staff into good and bad.
- **Avoid long hospital admissions** where possible; short, goal-focused admissions in crisis are sometimes needed.

:::widget decide
{"scene": "At 11 p.m., the on-call doctor receives a call from Meenal, 30, who has borderline personality disorder and is in a DBT programme. She is crying, says her flatmate shouted at her, and she 'wants to die'. She has a crisis plan. She has not taken anything and has no immediate plan or means at hand.", "ask": "What is the best response?", "choices": [{"label": "Tell her this is 'just her personality' and to call her therapist on Monday", "verdict": "harm", "outcome": "She feels dismissed, takes an overdose of paracetamol and is admitted to a medical ward.", "why": "Dismissing suicidal talk is dangerous. Every call deserves a calm risk assessment."}, {"label": "Listen and validate, assess current risk directly (intent, plan, means, what has stopped her so far), work through her crisis plan and skills with her, agree what she will do in the next few hours, and arrange follow-up with her team", "verdict": "best", "outcome": "She uses her ice-water and paced-breathing skills while on the phone, calms down, and agrees to stay with a cousin overnight. Her therapist calls her the next day.", "why": "Validation plus a structured risk assessment and use of the agreed crisis plan is safe and builds her own coping. Escalate if risk is high."}, {"label": "Admit her to hospital at once, for a long stay", "verdict": "ok", "outcome": "She is admitted, settles in a day, but then becomes more distressed on the ward and self-harms there.", "why": "Admission can be needed when risk is high, but routine long admissions can increase dependence and self-harm in borderline personality disorder. Brief, goal-focused admission is better if needed."}]}
:::

:::clinician
### Comorbidity and differential (practice points)
- Lifetime comorbidity in BPD: mood disorders about 80% to 95%, anxiety disorders about 85%, substance use disorders about 50% to 65%, eating disorders about 20% to 50%, PTSD about 30% to 60%, ADHD about 15% to 30%.
- **Bipolar II versus BPD**: look for discrete hypomanic episodes (several days, reduced need for sleep, increased goal-directed activity) that are a change from baseline; BPD mood shifts are hours-long and interpersonally triggered. Both can coexist (about 10% to 20%).
- **Complex PTSD (ICD-11)**: PTSD core symptoms plus disturbances in self-organisation (affect dysregulation, negative self-concept, relational disturbances), usually after prolonged or repeated trauma; less fear of abandonment, less self-image instability and fewer impulsive self-harm behaviours than in BPD. The two often overlap.
- **Adolescents**: BPD can be diagnosed in adolescence (NICE, Australian guidelines); early intervention programmes such as Helping Young People Early (HYPE, Melbourne) show benefit.
- **Structured clinical management** and **good psychiatric management (GPM)**, developed by John Gunderson: generalist approaches with psychoeducation, case management, focus on interpersonal hypersensitivity and life outside treatment; GPM equalled DBT at 1 and 2 years in McMain's 2009 trial.
- **Never** use a BPD diagnosis to deny assessment of physical symptoms or to refuse emergency care.
:::

:::recall
1. How many of the nine borderline criteria are needed? || Five.
2. Name five conditions that commonly come with borderline personality disorder. || Depression, anxiety, PTSD, substance use, eating disorders, ADHD.
3. Name four principles of good general care in borderline personality disorder. || Validate, be consistent, clear kind boundaries, shared crisis plan, avoid rescuing and rejecting, team approach, avoid long admissions.
4. What is splitting in a team? || Staff becoming divided into "good" and "bad" in the patient's eyes and in their own, often reflecting the patient's all-or-nothing view of people.
:::

:::mcq
Q: A woman with borderline personality disorder has repeated long admissions after self-harm, and self-harms more on the ward. The best plan is usually:
- Longer admissions
- *Brief, goal-focused admissions when needed, with a community-based structured therapy and crisis plan
- Discharge and no follow-up
- Sedation with benzodiazepines
> Long admissions can increase dependency and self-harm.

Q: Which feature best distinguishes bipolar II disorder from borderline personality disorder?
- Self-harm
- Anger
- *Distinct episodes of hypomania lasting days with reduced need for sleep
- Fear of abandonment
> Look for discrete episodes that are a change from baseline.
:::

## 2.5 Cluster C in depth [core][beginner]
Cluster C disorders share **anxiety and fear**. They are the most common personality disorders in the community, but often go unrecognised because these people suffer quietly.

### Avoidant personality disorder
A pattern of **social inhibition, feelings of inadequacy and hypersensitivity to criticism**. The person avoids jobs that involve contact with people, will not get involved unless sure of being liked, holds back in close relationships for fear of shame, is preoccupied with criticism or rejection, feels inferior, and avoids new activities. Unlike schizoid people, they **long for relationships**. It overlaps heavily with social anxiety disorder; many experts see them as points on one continuum.

:::widget flow
{"title": "How avoidance keeps avoidant personality going", "layout": "cycle", "nodes": [{"id": "a", "label": "Belief", "detail": "'If people see the real me, they will reject me.'"}, {"id": "b", "label": "Avoid", "detail": "Turn down the invitation, the promotion, the date."}, {"id": "c", "label": "Short-term relief", "detail": "Anxiety drops at once."}, {"id": "d", "label": "No chance to learn otherwise", "detail": "The belief is never tested; skills and confidence fade; loneliness grows."}], "caption": "Press Play. CBT and schema therapy test the belief through graded steps towards people."}
:::

:::widget compare
{"title": "Avoidant or schizoid?", "a": {"label": "Avoidant personality disorder", "points": ["Wants closeness but fears rejection", "Painfully sensitive to criticism", "Feels inadequate and inferior", "Lonely and unhappy about being alone"], "summary": "Avoidant: longs for people, but fear holds them back."}, "b": {"label": "Schizoid personality disorder", "points": ["Little desire for close relationships", "Indifferent to praise or criticism", "Prefers solitary activities", "Content, not distressed, being alone"], "summary": "Schizoid: does not seek people, and does not miss them."}, "caption": "Both live quietly apart. The question is: do they want to be with others? Avoidant, yes; schizoid, mostly no."}
:::

### Dependent personality disorder
A pervasive **need to be taken care of**, leading to submissive, clinging behaviour and fear of separation. The person cannot make everyday decisions without excessive advice, needs others to take responsibility for major areas of life, cannot express disagreement for fear of losing support, struggles to start projects alone, goes to great lengths to obtain support (even volunteering for unpleasant tasks), feels helpless alone, urgently seeks another relationship when one ends, and is preoccupied with fears of being left to care for themselves. They are at risk of staying in **abusive relationships**.

### Obsessive-compulsive personality disorder (OCPD)
A pervasive **preoccupation with orderliness, perfectionism and control**, at the cost of flexibility, openness and efficiency. Features: preoccupation with details, rules, lists and schedules so that the point of the activity is lost; perfectionism that stops tasks being finished; excessive devotion to work; over-conscientiousness about morality; cannot throw away worthless objects; reluctant to delegate; miserly; rigid and stubborn.

:::widget sort
{"prompt": "OCPD or OCD? Place each feature.", "buckets": ["Obsessive-compulsive personality disorder", "Obsessive-compulsive disorder"], "items": [{"text": "Unwanted, intrusive thoughts of contamination that she knows are excessive", "bucket": 1}, {"text": "Believes his strict rules for the household are simply the right way to do things", "bucket": 0, "why": "In OCPD, the traits usually feel right to the person (ego-syntonic)."}, {"text": "Washes hands for two hours a day to neutralise anxiety", "bucket": 1}, {"text": "Cannot hand over any task at work because others 'won't do it properly'", "bucket": 0}, {"text": "Checks the gas knob twenty times, feeling dread until it is done", "bucket": 1}, {"text": "Misses every deadline because reports are never perfect enough; works through every weekend", "bucket": 0}]}
:::

:::widget decide
{"scene": "Sunita, 38, from Bhopal, has been married for fifteen years to a husband who insults and sometimes slaps her. She says she could never manage alone and asks you to 'help me be a better wife so he won't get angry'. She cannot decide anything, from groceries to her own medical tests, without his approval. She has done this since she was a teenager with her father.", "ask": "What is the priority?", "choices": [{"label": "Help her become a 'better wife' as she asks", "verdict": "harm", "outcome": "She blames herself more. The violence continues.", "why": "Accepting the request unchallenged colludes with abuse."}, {"label": "Assess her safety and the domestic violence carefully, inform her of legal protection and support services, and work on her confidence and decision-making over time", "verdict": "best", "outcome": "She makes a safety plan and gradually starts small independent decisions. She contacts a women's support service.", "why": "People with dependent personality traits are vulnerable to abuse. Safety comes first; then therapy builds autonomy step by step. In India, the Protection of Women from Domestic Violence Act 2005 provides protection orders and Protection Officers."}, {"label": "Tell her to leave him immediately", "verdict": "ok", "outcome": "She feels pressured and stops coming.", "why": "The aim is right, but she needs support to build capacity and a safe plan. Pushing too fast loses her."}]}
:::

:::clinician
### Depth notes
- **Prevalence**: OCPD is the commonest personality disorder in many community surveys (about 2% to 8%); avoidant about 2.4%; dependent under 1%.
- **Avoidant PD and social anxiety disorder**: 30% to 50% overlap; avoidant PD shows a more pervasive sense of inadequacy; CBT for social anxiety and SSRIs (sertraline, escitalopram, paroxetine) help both; group CBT and schema therapy have evidence for avoidant PD.
- **Dependent PD**: differential from dependence in depression, agoraphobia, and culturally sanctioned interdependence; watch for dependence transferring to the therapist, and plan endings carefully.
- **OCPD**: comorbid with OCD in about 20% to 30%; associated with anorexia nervosa, hoarding and treatment resistance in OCD. CBT and schema therapy; SSRIs have weak evidence.
- **Schema therapy** (2014) for Cluster C plus paranoid, histrionic and narcissistic PDs outperformed treatment as usual and clarification-oriented psychotherapy on recovery.
:::

:::recall
1. What is the core of avoidant personality disorder? || Social inhibition, feelings of inadequacy and hypersensitivity to rejection, with a longing for relationships.
2. What risk do people with dependent personality disorder face? || Staying in abusive relationships for fear of being alone.
3. How does OCPD differ from OCD? || OCPD traits are lasting and feel right to the person; OCD has unwanted obsessions and compulsions seen as excessive.
4. Which Cluster C disorder is most common in the community? || Obsessive-compulsive personality disorder.
:::

:::mcq
Q: A man rewrites emails many times, will not let anyone else touch his projects, and works seventy-hour weeks, believing this is simply how work should be done. He has no intrusive unwanted thoughts. The diagnosis is:
- OCD
- *Obsessive-compulsive personality disorder
- Avoidant personality disorder
- Generalised anxiety disorder
> Ego-syntonic perfectionism and control.

Q: A woman who cannot make daily decisions without reassurance stays in an abusive marriage for fear of being alone. The most important first step is:
- Couples therapy to improve communication
- *Assess and plan for her safety
- Start an antidepressant
- Advise her to be more assertive
> Safety first in domestic violence.
:::

## 2.6 Telling personality disorders from other conditions [core][beginner]
Many conditions can look like a personality disorder, and personality disorders can hide or complicate other illnesses. A careful differential protects patients from wrong labels and from missed treatment.

| Look-alike | What helps tell them apart |
|---|---|
| **Depression** | Recent onset, episodic, change from usual self; dependency, irritability and hopelessness lift with recovery |
| **Bipolar disorder** | Discrete episodes lasting days or weeks, reduced need for sleep; mood not mainly triggered by relationship events |
| **PTSD and complex PTSD** | Clear link to trauma, re-experiencing and avoidance; disturbances of self-organisation in complex PTSD |
| **Autism** | Social communication differences and restricted interests from early childhood; not driven by fear of rejection or detachment by choice |
| **ADHD** | Childhood onset of inattention and hyperactivity; impulsivity without the interpersonal storms |
| **Psychotic disorders** | Fixed delusions, hallucinations, thought disorder; personality disorders have, at most, brief stress-related experiences |
| **Substance use** | Behaviour changes during intoxication, withdrawal or craving; reassess after abstinence |
| **Personality change due to a medical condition** | New change after head injury, epilepsy, dementia, brain tumour, encephalitis, HIV |
| **Social anxiety disorder** | Fear focused on performance and scrutiny; overlaps strongly with avoidant personality |

:::widget sort
{"prompt": "Most likely explanation? Place each person.", "buckets": ["Likely a personality disorder", "Likely another condition"], "items": [{"text": "A 55-year-old who became disinhibited, rude and impulsive over a year, having been courteous all his life", "bucket": 1, "why": "New personality change in mid-life suggests frontotemporal dementia or another brain disorder."}, {"text": "A 23-year-old with unstable relationships, chronic emptiness and self-harm since 15", "bucket": 0}, {"text": "A 30-year-old who has been withdrawn and odd since childhood, with intense interest in train timetables and difficulty with eye contact and conversation", "bucket": 1, "why": "Lifelong social communication differences with restricted interests suggest autism."}, {"text": "A man who is aggressive only when drinking heavily, and gentle when sober for months", "bucket": 1}, {"text": "A woman with lifelong fear of criticism who has avoided promotion, friendships and marriage for fear of rejection", "bucket": 0}, {"text": "A 40-year-old with sudden suspiciousness, aggression and confusion after a fever and seizures", "bucket": 1, "why": "Possible encephalitis: a medical emergency."}]}
:::

:::widget decide
{"scene": "Mr Patel, 58, a temple trustee in Surat, has become rude, makes inappropriate sexual jokes, spends money impulsively, and eats sweets constantly over the past eighteen months. He used to be quiet and formal. His family say 'his true nature is finally showing' and ask whether this is a personality disorder.", "ask": "What is the best next step?", "choices": [{"label": "Agree it is a late-onset personality disorder and suggest therapy", "verdict": "harm", "outcome": "A year later he is unable to manage his affairs and is diagnosed with advanced frontotemporal dementia; the family's finances have suffered.", "why": "Personality disorders begin by early adulthood. New disinhibition, impulsivity and change in eating in mid-life point to a neurocognitive disorder."}, {"label": "Recognise a new personality change in later life and arrange neurological and cognitive assessment, including brain imaging", "verdict": "best", "outcome": "Imaging shows frontal and temporal atrophy. The family receives a diagnosis, plans for his finances, and gets carer support.", "why": "Behavioural variant frontotemporal dementia often presents with disinhibition, apathy, loss of empathy, compulsive behaviour and change in eating."}, {"label": "Start an antidepressant and review in a year", "verdict": "ok", "outcome": "Little change; the diagnosis is delayed.", "why": "Depression can change behaviour, but this pattern needs neurological assessment first."}]}
:::

:::widget flow
{"title": "New personality change in adult life: think medical first", "layout": "tree", "nodes": [{"id": "r", "label": "Personality changed in adulthood", "detail": "Not a personality disorder by definition. Find the cause."}, {"id": "n", "label": "Neurological", "detail": "Frontotemporal dementia, head injury, stroke, brain tumour, epilepsy, Huntington's, multiple sclerosis.", "parent": "r"}, {"id": "i", "label": "Infection and inflammation", "detail": "Encephalitis (including autoimmune), HIV, neurosyphilis.", "parent": "r"}, {"id": "m", "label": "Metabolic and endocrine", "detail": "Thyroid, Cushing's, B12 deficiency, liver failure.", "parent": "r"}, {"id": "p", "label": "Psychiatric and substances", "detail": "Mania, depression, psychosis, alcohol, stimulants, cannabis.", "parent": "r"}], "caption": "Tap each branch. Examination, cognitive testing, bloods and brain imaging guide the search."}
:::

:::clinician
### Comorbidity matters for treatment
- Personality disorders predict poorer response and higher relapse in depression and anxiety treatment trials (effect modest: roughly a doubling of the odds of poor outcome in depression). They do not mean treatment of the comorbid disorder will fail; adapt it (longer, more structured, attention to alliance ruptures).
- **Substance use and antisocial or borderline PD**: integrated treatment; DBT has adaptations for substance use (DBT-S).
- **Medical causes of personality change**: frontotemporal dementia, Huntington's disease, temporal lobe epilepsy (interictal hyposexuality, religiosity, hypergraphia, viscosity are described but debated), traumatic brain injury (especially orbitofrontal), anti-NMDA receptor encephalitis, neurosyphilis, HIV, multiple sclerosis, endocrine disorders (Cushing's, thyroid). ICD-11 and DSM-5-TR code "personality change due to another medical condition" with subtypes (labile, disinhibited, aggressive, apathetic, paranoid).
:::

:::recall
1. Why does new personality change in mid-life suggest a medical cause? || Personality disorders begin by early adulthood; new change suggests dementia, brain injury, epilepsy, encephalitis or another illness.
2. How do you separate substance-related behaviour from personality? || Look at behaviour during sustained abstinence.
3. What separates autism from schizoid or avoidant personality? || Autism shows social communication differences and restricted interests from early childhood, not a later preference for solitude or fear of rejection.
4. Name three causes of personality change due to a medical condition. || Frontotemporal dementia, head injury, temporal lobe epilepsy, encephalitis, brain tumour, HIV, Huntington's.
:::

:::mcq
Q: A 60-year-old woman who was always cheerful becomes apathetic, loses empathy for her grandchildren and starts eating compulsively. The most likely cause is:
- Late-onset borderline personality disorder
- *Behavioural variant frontotemporal dementia
- Dependent personality disorder
- Normal ageing
> New personality change in later life needs neurocognitive assessment.

Q: A young man is aggressive and impulsive only during heavy alcohol use. The best next step before diagnosing a personality disorder is:
- Diagnose antisocial personality disorder now
- *Treat the alcohol use and reassess his behaviour during abstinence
- Start an antipsychotic
- Refer for psychoanalysis
> Separate substance effects from long-standing traits.
:::

## 2.7 Level check · Beginner [core][beginner]
Twelve or more right out of fifteen opens the Advanced level.

:::mcq
Q: The best time to assess personality in someone with severe depression is:
- During the worst of the episode
- *After recovery, with a lifetime history and collateral
- Never
- Only with a questionnaire
> Separate state from trait.

Q: Which is a structured interview for personality disorders?
- MMSE
- *SCID-5-PD
- PHQ-9
- AUDIT
> Also the IPDE.

Q: A man has suspected his colleagues and neighbours of plotting against him for thirty years, but accepts it might be his imagination at times. He has no hallucinations. The best fit is:
- Schizophrenia
- *Paranoid personality disorder
- Delusional disorder
- Schizoid personality disorder
> Suspicious attitudes held with some flexibility.

Q: Which feature belongs to schizotypal rather than schizoid personality?
- Little interest in relationships
- Flat emotion
- *Magical thinking and unusual perceptions
- Prefers solitary activities
> Odd thinking and perception separate schizotypal.

Q: Antisocial personality disorder can be diagnosed only if:
- The person has been in prison
- *The person is at least 18 and had conduct disorder before about 15
- The PCL-R score is above 30
- The person is male
> Adult diagnosis with childhood conduct disorder.

Q: Superficial charm, callousness and shallow emotions are core to:
- Histrionic personality disorder
- *Psychopathy
- Avoidant personality disorder
- Dependent personality disorder
> PCL-R Factor 1 features.

Q: A vague, dramatic, impressionistic speaking style is typical of:
- Schizoid personality
- *Histrionic personality
- Obsessive-compulsive personality
- Paranoid personality
> Speech lacking detail.

Q: Narcissistic injury is:
- A physical injury
- *Rage or collapse after criticism exposes fragile self-esteem
- A type of self-harm
- A delusion
> It can precipitate suicidal crises.

Q: How many borderline criteria must be present for diagnosis?
- Three
- *Five of nine
- All nine
- Two
> Five or more.

Q: Which is NOT one of the nine borderline criteria?
- Chronic emptiness
- Identity disturbance
- *Reduced need for sleep for several days
- Transient stress-related paranoia or dissociation
> Reduced need for sleep suggests hypomania or mania.

Q: Which principle is part of good general care for borderline personality disorder?
- Long admissions after every self-harm
- *A shared, written crisis plan
- Avoiding any discussion of the diagnosis
- Frequent changes of clinician
> Consistency and a crisis plan.

Q: A woman longs for friends but avoids them for fear of rejection. Which other condition overlaps most with her pattern?
- Schizophrenia
- *Social anxiety disorder
- Bipolar disorder
- ADHD
> Avoidant personality and social anxiety overlap heavily.

Q: The commonest Cluster C disorder in community surveys is:
- Dependent
- Avoidant
- *Obsessive-compulsive personality disorder
- Histrionic
> OCPD is common.

Q: A previously courteous 55-year-old becomes disinhibited and impulsive. You should first think of:
- Late-onset antisocial personality disorder
- *A neurocognitive disorder such as frontotemporal dementia
- Histrionic personality disorder
- Normal ageing
> New personality change in mid-life needs medical assessment.

Q: Which statement about personality disorders and depression is true?
- They cannot coexist
- *A personality disorder can make depression harder to treat, but treatment still helps
- Antidepressants cure personality disorders
- Personality disorders cause depression to remit faster
> Adapt, don't abandon, treatment.
:::
`;
