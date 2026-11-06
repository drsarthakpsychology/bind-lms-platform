/* Module · Trauma and stressor-related disorders, Parts II to IV (other disorders, helping, Beginner level check, Advanced). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part II · The other trauma and stressor disorders

## 2.1 Timing tells them apart [core][beginner]
:::widget guess
{"prompt": "Acute stress disorder covers severe reactions in the window after a trauma. From how many days to how long after the trauma?", "min": 0, "max": 60, "unit": "days", "answer": [3, 30], "reveal": "From 3 days to 1 month. Reactions in the first two days are expected and too early to label. After a month, PTSD is considered instead.", "clinician": "DSM-5-TR acute stress disorder: duration of 3 days to 1 month after trauma exposure; nine or more of 14 symptoms across intrusion, negative mood, dissociation, avoidance and arousal."}
:::

### Acute stress disorder
- Same criterion A exposure as PTSD.
- **Nine or more of 14** symptoms from five categories: intrusion (4), negative mood (1), dissociation (2), avoidance (2), arousal (5).
- Lasts **3 days to 1 month** after the trauma.
- Predicts PTSD only moderately: many with acute stress disorder recover, and many who later develop PTSD never had it.

### Adjustment disorder
- Emotional or behavioural symptoms in response to an **identifiable stressor** (not necessarily a trauma), beginning **within 3 months** of it.
- Distress **out of proportion** to the stressor (allowing for culture and context) and/or significant impairment.
- Not another mental disorder, not normal bereavement or prolonged grief.
- Resolves within **6 months** after the stressor or its consequences end.
- Specifiers: with depressed mood, with anxiety, mixed anxiety and depressed mood, with disturbance of conduct, mixed disturbance of emotions and conduct, unspecified. Acute (under 6 months) or persistent.

### The timeline
| Disorder | Stressor | Onset | Duration rule |
|---|---|---|---|
| Acute stress disorder | Trauma (criterion A) | Immediate | 3 days to 1 month |
| PTSD | Trauma (criterion A) | Any time; delayed expression if full criteria only after 6 months | More than 1 month |
| Adjustment disorder | Any identifiable stressor | Within 3 months | Ends within 6 months after the stressor ends |
| Prolonged grief disorder | Death of a close person | Since the death | At least 12 months after the death in adults (6 months in children) |

:::widget sort
{"prompt": "Which diagnosis fits, judged mainly by timing and stressor?", "buckets": ["Acute stress disorder", "PTSD", "Adjustment disorder", "Prolonged grief disorder"], "items": [{"text": "Two weeks after an assault: flashbacks, numbness, feeling unreal, avoiding, poor sleep", "bucket": 0}, {"text": "Four months after a car crash: nightmares, avoidance, guilt and jumpiness, unable to work", "bucket": 1}, {"text": "Six weeks after failing her UPSC attempt, low, tearful, and stopped studying, more than expected", "bucket": 2, "why": "A stressor, not a trauma, with onset within 3 months."}, {"text": "Eighteen months after her husband's death, intense yearning, disbelief, and unable to resume any part of life, beyond what her community expects", "bucket": 3}]}
:::

:::recall
1. What is the duration window for acute stress disorder? || 3 days to 1 month.
2. How many symptoms does acute stress disorder require? || Nine or more of 14.
3. Give the onset and end rules for adjustment disorder. || Onset within 3 months of the stressor; resolves within 6 months after the stressor ends.
:::

:::mcq
Q: Ten days after a train accident, a woman has flashbacks, numbness, a sense of unreality, avoidance and severe insomnia. The best diagnosis is:
- PTSD
- *Acute stress disorder
- Adjustment disorder
- Prolonged grief disorder
> Within 3 days to 1 month.
:::

## 2.2 Complex PTSD [core][beginner]
ICD-11 introduced **complex PTSD** as a separate diagnosis. DSM-5-TR does not have it (some features fall under PTSD's cluster D or under the dissociative subtype).

:::define ICD-11 complex PTSD
Exposure to an event or series of events of an extremely threatening or horrific nature, most commonly **prolonged or repetitive** and from which escape is difficult or impossible (torture, slavery, genocide, prolonged domestic violence, repeated childhood sexual or physical abuse). All the core features of **PTSD** are met, **plus** severe and persistent **disturbances in self-organisation (DSO)**:
1. **Affect dysregulation**: emotional overreactivity or numbing, violent outbursts, reckless behaviour, dissociation under stress.
2. **Negative self-concept**: beliefs of being diminished, defeated or worthless, with deep shame or guilt.
3. **Difficulties in relationships**: in sustaining relationships and feeling close to others.
:::

### Complex PTSD or borderline personality disorder?
| Feature | Complex PTSD | Borderline personality disorder |
|---|---|---|
| Self-concept | Stably negative ("I am worthless") | Unstable, shifting identity |
| Relationships | Avoids closeness, withdraws | Intense, unstable, fear of abandonment |
| Self-harm | Less central | Common, often recurrent |
| Trauma | Required | Often present but not required |
The two can co-occur.

### Treatment
Trauma-focused therapies remain central. Many clinicians use a **phased** approach for severe cases: first stabilisation and skills for emotions and relationships (for example STAIR: skills training in affective and interpersonal regulation), then trauma processing, then reintegration. Evidence suggests trauma-focused therapy can be started sooner than was once thought for many patients.

:::widget sort
{"prompt": "Which part of complex PTSD does each describe?", "buckets": ["Core PTSD", "Affect dysregulation", "Negative self-concept", "Relationship difficulties"], "items": [{"text": "Nightmares and flashbacks of years of abuse", "bucket": 0}, {"text": "Explosive rage at small slights, then complete numbness", "bucket": 1}, {"text": "\"I am dirty and worthless, I deserved it\"", "bucket": 2}, {"text": "Cannot let anyone close, ends friendships when they deepen", "bucket": 3}, {"text": "Always on guard, sits with her back to the wall", "bucket": 0}]}
:::

:::recall
1. What are the three disturbances in self-organisation in complex PTSD? || Affect dysregulation, negative self-concept, relationship difficulties.
2. What type of trauma typically underlies complex PTSD? || Prolonged or repeated trauma from which escape is difficult.
3. Give two differences between complex PTSD and borderline personality disorder. || Stable negative self versus unstable identity; avoidant versus intense unstable relationships; self-harm less central.
:::

:::mcq
Q: Complex PTSD is a diagnosis in:
- DSM-5-TR only
- *ICD-11
- Both DSM-5-TR and ICD-11
- Neither
> DSM-5-TR does not include complex PTSD.
:::

## 2.3 Childhood attachment disorders [extra][beginner]
Both follow **severe social neglect** (persistent lack of comfort, stimulation and affection; repeated changes of caregiver; rearing in settings with very few caregivers, such as poorly staffed institutions).

| Feature | Reactive attachment disorder (RAD) | Disinhibited social engagement disorder (DSED) |
|---|---|---|
| Core picture | Inhibited, emotionally withdrawn; rarely seeks or responds to comfort | Overly familiar with strangers; goes off with unfamiliar adults without checking back |
| Emotional signs | Little positive affect; unexplained irritability, sadness or fear | Not required |
| Age rules | Developmental age at least 9 months; evident before age 5 | Developmental age at least 9 months |
| After good care | Often improves when a stable caregiver is provided | May persist even after secure attachments form |
| Key differential | Autism spectrum disorder (social deficits without neglect history) | ADHD (impulsivity is general, not only social) |

:::note Why it matters
Children growing up in under-resourced institutions, or in families overwhelmed by illness, migration or poverty, are at risk. Placement in stable family-based care, and caregivers trained to respond sensitively, are the main interventions.
:::

:::recall
1. What experience is required for RAD and DSED? || Severe social neglect or insufficient care.
2. Contrast RAD and DSED. || RAD: inhibited, withdrawn, rarely seeks comfort. DSED: indiscriminate, overly familiar with strangers.
:::

:::mcq
Q: A 4-year-old raised in a large orphanage happily walks off with any stranger and climbs into strangers' laps. The most likely diagnosis is:
- Reactive attachment disorder
- *Disinhibited social engagement disorder
- Autism spectrum disorder
- Separation anxiety disorder
> Indiscriminate sociability after neglect.
:::

## 2.4 Prolonged grief disorder [core][beginner]
Grief is not a disorder. It is the price of love, and in most people it softens over time, though it may return in waves around anniversaries and festivals. For a minority, grief stays intense and disabling. DSM-5-TR (2022) and ICD-11 both now recognise **prolonged grief disorder**.

:::widget guess
{"prompt": "In DSM-5-TR, how long after a death must it be, at minimum, before prolonged grief disorder can be diagnosed in an adult?", "min": 0, "max": 36, "unit": "months", "answer": [12, 12], "reveal": "At least 12 months in adults (6 months in children and adolescents). Long, painful grief before then is usually normal grief.", "clinician": "DSM-5-TR criterion A: death at least 12 months ago (6 months in children and adolescents). ICD-11 uses at least 6 months after the loss, with a note to judge against cultural and religious norms."}
:::

:::define DSM-5-TR prolonged grief disorder (summary)
A. Death of a close person at least **12 months** ago (6 months in children and adolescents).
B. Since the death, **intense yearning** for the deceased and/or **preoccupation** with them, most days, nearly every day for at least the last month.
C. **Three or more** of: identity disruption (part of oneself has died); marked disbelief about the death; avoidance of reminders that the person is dead; intense emotional pain (anger, bitterness, sorrow); difficulty reintegrating into relationships and activities; emotional numbness; feeling life is meaningless; intense loneliness.
D. Distress or impairment.
E. Duration and severity **clearly exceed** the expected social, cultural or religious norms.
F. Not better explained by another disorder (for example depression or PTSD).
:::

### Grief, depression and PTSD
| | Prolonged grief | Depression | PTSD after a violent death |
|---|---|---|---|
| Core | Yearning and preoccupation with the deceased | Pervasive low mood and loss of pleasure in everything | Fear, intrusions about the manner of death |
| Self-esteem | Usually preserved | Worthlessness | Guilt or self-blame about the event |
| Pleasure | Can occur when not thinking of the loss | Absent broadly | Reduced |

:::note Culture and mourning
Mourning customs differ: the thirteen days of Hindu rituals, the forty days in many Muslim and Christian traditions, annual shraddh or barsi observances. These structure grief. A diagnosis must clearly exceed what the person's own community expects.
:::

### Treatment
**Prolonged grief disorder therapy** (Shear) and grief-focused CBT, combining work on accepting the reality of the loss, revisiting the story of the death, re-engaging with life goals, and an imagined conversation with the deceased, are more effective than standard supportive counselling. Antidepressants help comorbid depression but have little effect on grief symptoms themselves.

:::widget decide
{"scene": "Mr D'Souza, 70, from Mangalore, lost his wife eight months ago. He cries daily, sets her plate at dinner and has stopped going to church. His son asks for 'something to stop the grief'.", "ask": "What is the most appropriate approach?", "choices": [{"label": "Diagnose prolonged grief disorder and start an antidepressant", "verdict": "harm", "outcome": "He feels labelled and the medicine does little for his longing.", "why": "At eight months this is too early for the DSM-5-TR diagnosis; antidepressants do not target grief itself."}, {"label": "Recognise that intense grief at eight months is often within normal limits; screen for depression and suicidal thoughts; offer support, encourage contact with his community and church; review later and consider grief-focused therapy if it persists and disables", "verdict": "best", "outcome": "He joins a widowers' group at church. By the anniversary he still misses her but has resumed daily life.", "why": "Respect normal grief, assess risk, support natural recovery, and treat only if it becomes prolonged and disabling."}, {"label": "Tell him to be strong and move on", "verdict": "harm", "outcome": "He withdraws further and stops talking about her.", "why": "Rushing grief and dismissing it isolates the person."}]}
:::

:::recall
1. State the DSM-5-TR time rule for prolonged grief disorder. || At least 12 months after the death in adults; 6 months in children.
2. Name the two core symptoms. || Intense yearning; preoccupation with the deceased.
3. How does grief differ from depression in self-esteem and pleasure? || Grief usually preserves self-esteem and allows moments of pleasure; depression brings worthlessness and global loss of pleasure.
:::

:::mcq
Q: Which treatment has the best evidence for prolonged grief disorder?
- Benzodiazepines
- Supportive counselling only
- *Grief-focused therapy such as prolonged grief disorder therapy
- Antipsychotics
> Targeted grief therapy outperforms general support.
:::

# Part III · Helping

## 3.1 In the first days: psychological first aid [core][beginner]
Psychological first aid (PFA), as set out by WHO and partners, is humane, supportive, practical help for people in serious distress soon after a crisis. It is **not** therapy and **not** debriefing.

### The action principles
1. **Prepare**: learn about the event, the services available, and safety and security.
2. **Look**: check safety, people with urgent basic needs, people with serious distress reactions.
3. **Listen**: approach respectfully, ask about needs and concerns, listen and help people feel calm.
4. **Link**: help with basic needs and services, help people cope with problems, give information, connect them with loved ones and social support.

### Who needs more than PFA
People who are seriously injured, so upset they cannot care for themselves or their children, who may hurt themselves or others, or who may hurt others. Link them to urgent medical or mental health care.

:::widget sort
{"prompt": "Is each action part of PFA, or something to avoid?", "buckets": ["Part of PFA", "Avoid"], "items": [{"text": "Helping a mother find her missing child in the camp", "bucket": 0}, {"text": "Asking everyone to describe their feelings in a group the next morning", "bucket": 1, "why": "That is debriefing, not PFA."}, {"text": "Offering water, a blanket and a quiet place", "bucket": 0}, {"text": "Telling a survivor 'everything happens for a reason'", "bucket": 1}, {"text": "Giving accurate information about where relief is distributed", "bucket": 0}, {"text": "Promising that the government will rebuild every house", "bucket": 1, "why": "Never promise what you cannot guarantee."}]}
:::

:::recall
1. Name the four PFA action principles. || Prepare, look, listen, link.
2. Name two groups who need more than PFA. || Seriously injured; unable to care for self or children; at risk of harming self or others.
:::

:::mcq
Q: PFA is best described as:
- A form of psychotherapy
- *Humane, practical support after a crisis, paced by the person
- Mandatory debriefing
- Medication for distress
> Not therapy, not debriefing.
:::

## 3.2 Treatment of PTSD [core][beginner]
### First line: trauma-focused psychological therapy
Guidelines (NICE, WHO, APA, ISTSS) recommend trauma-focused therapies as first-line for adults and children:
- **Trauma-focused CBT**, including cognitive processing therapy (CPT), prolonged exposure (PE) and cognitive therapy for PTSD (Ehlers and Clark).
- **EMDR** (eye movement desensitisation and reprocessing).
- **Narrative exposure therapy (NET)** for multiple traumas, used widely with refugees and in low-resource settings.
- **Written exposure therapy (WET)**: five sessions of structured writing about the trauma; non-inferior to CPT in trials.
- For children, **TF-CBT** with caregivers.

### Medicines
- **SSRIs** (sertraline and paroxetine have US approval; fluoxetine is also used) and **venlafaxine**, when therapy is not wanted, not available, or not enough, or with comorbid depression.
- Response may take longer and need higher doses than in depression.

:::widget guess
{"prompt": "When an SSRI is used for PTSD, how many weeks can it take for a response to show?", "min": 0, "max": 16, "unit": "weeks", "answer": [8, 12], "reveal": "Often up to 8 weeks, sometimes 12. People need to know this, or they stop too soon.", "clinician": "Response is usually seen within 8 weeks but can take up to 12. Lower starting doses help tolerability, though higher doses (for example fluoxetine 60 mg) are often needed for full effect. Continue for at least 6 to 12 months after response."}
:::

:::student
### Typical adult daily doses in PTSD (educational only)
| Medicine | Typical adult daily range |
|---|---|
| Sertraline | 50 to 200 mg |
| Paroxetine | 20 to 50 mg |
| Fluoxetine | 20 to 60 mg |
| Venlafaxine (slow release) | 75 to 225 mg |
:::

:::clinician
### Dosing and adjuncts (for learning; check current guidelines)
| Medicine | Start | Range | Indian brands | Notes |
|---|---|---|---|---|
| Sertraline | 25 mg | 50 to 200 mg | Serta, Daxid | Raise every 1 to 2 weeks |
| Paroxetine | 10 mg | 20 to 50 mg | Pexep | Withdrawal on stopping; avoid in pregnancy |
| Fluoxetine | 10 to 20 mg | 20 to 60 mg | Fludac, Prodep | Higher doses often needed |
| Venlafaxine XR | 37.5 mg | 75 to 300 mg | Venlor XR | Blood pressure |
| Prazosin (nightmares) | 1 mg at night | 3 to 15 mg at night | Minipress XL, Prazopress | First-dose hypotension; a large 2018 trial in veterans was negative, others positive; still used selectively |
| Risperidone or quetiapine | Low dose | | | Adjunct for psychotic features or severe refractory symptoms; weak evidence otherwise |

**Avoid benzodiazepines** for PTSD: they do not treat core symptoms, may worsen outcomes and impair trauma processing, and add dependence risk in a group prone to substance use. **Sleep**: CBT for insomnia and imagery rehearsal therapy for nightmares.
:::

:::widget decide
{"scene": "Mr Singh, 45, a bus driver in Amritsar, developed PTSD after a crash in which a passenger died. His GP has prescribed clonazepam 1 mg twice daily for six months. He still has nightmares and avoids driving, and now needs the tablets to 'feel normal'.", "ask": "What is the best plan?", "choices": [{"label": "Increase clonazepam", "verdict": "harm", "outcome": "He becomes drowsier and more dependent; the PTSD persists.", "why": "Benzodiazepines do not treat PTSD and can impair recovery."}, {"label": "Offer trauma-focused therapy (for example CPT, PE or EMDR), start an SSRI if he wishes, and plan a slow clonazepam taper; address sleep with CBT for insomnia", "verdict": "best", "outcome": "Over months his nightmares lessen, he drives again, and the clonazepam is stopped.", "why": "First-line trauma-focused therapy plus evidence-based medicine, with safe benzodiazepine withdrawal."}, {"label": "Stop clonazepam immediately", "verdict": "harm", "outcome": "He has severe withdrawal, insomnia and agitation.", "why": "Abrupt withdrawal after long use is unsafe."}]}
:::

:::recall
1. Name four first-line trauma-focused therapies for adults. || CPT, prolonged exposure, cognitive therapy for PTSD, EMDR (also NET and WET).
2. Which SSRIs have US approval for PTSD? || Sertraline and paroxetine.
3. Why avoid benzodiazepines in PTSD? || They do not treat core symptoms, may worsen outcomes and processing, and risk dependence.
:::

:::mcq
Q: Which statement about medicines in PTSD is correct?
- Benzodiazepines are first-line
- *SSRIs or venlafaxine help, often needing higher doses and up to 12 weeks
- Medicines work faster than in depression
- No medicine helps PTSD
> Trauma-focused therapy is still first-line.
:::

## 3.3 The trauma therapies in detail [core][beginner]
| Therapy | Core method | Typical length |
|---|---|---|
| Prolonged exposure (Foa) | Psychoeducation, breathing retraining, **imaginal exposure** (repeatedly recounting the memory aloud, recorded and listened to at home) and **in vivo exposure** to avoided safe situations | 8 to 15 sessions |
| Cognitive processing therapy (Resick) | Writing an impact statement; identifying "stuck points" (beliefs about safety, trust, power, esteem, intimacy, and self-blame); Socratic questioning and worksheets; optional written account | 12 sessions |
| Cognitive therapy for PTSD (Ehlers and Clark) | Reducing the sense of current threat: updating the meaning of hotspots in the memory, discriminating triggers ("then versus now"), dropping safety behaviours, site visits | Up to 12 sessions, plus boosters |
| EMDR (Shapiro) | Holding the memory in mind while following bilateral stimulation (eye movements or taps), then installing positive beliefs | 6 to 12 sessions |
| Narrative exposure therapy | Building a lifeline of good and traumatic events ("flowers and stones") and narrating the trauma in detail in its context | 4 to 12 sessions |
| Written exposure therapy | Writing about the trauma for 30 minutes per session with set instructions | 5 sessions |

:::widget worked
{"title": "Finding a stuck point in CPT", "steps": [{"q": "Meera, 26, was assaulted by a colleague after a work party. She writes in her impact statement: 'It happened because I drank and wore that dress.' What kind of stuck point is this?", "a": "Self-blame (an assimilated belief): she has bent the event to fit a belief that bad things happen to people who 'invite' them."}, {"q": "A Socratic question?", "a": "'Who decided to assault you? Did other women at the party who drank and dressed up get assaulted? What would you say to a friend who told you this?'"}, {"q": "A more balanced belief?", "a": "'I went to a party, as people do. He chose to assault me. The responsibility is his.'"}, {"q": "A second stuck point she mentions: 'No man can be trusted.' What kind is it?", "a": "Over-accommodation: a belief stretched too far after the trauma. Work towards 'Some people are untrustworthy; I can learn to judge who is safe.'"}]}
:::

:::trap How EMDR works is debated
EMDR is effective, but trials comparing it with and without eye movements suggest the eye movements may add little beyond the exposure and cognitive elements. One proposal is that tasks that tax working memory make the memory less vivid and emotional. Report this honestly in an exam answer.
:::

:::recall
1. What are the two kinds of exposure in prolonged exposure therapy? || Imaginal (recounting the memory) and in vivo (approaching avoided safe situations).
2. What are stuck points in CPT? || Unhelpful beliefs about the trauma, such as self-blame or over-generalised mistrust.
3. What is a "flowers and stones" lifeline? || NET's timeline of positive and traumatic life events.
:::

:::mcq
Q: In cognitive processing therapy, "It happened because I didn't fight back" is an example of:
- An intrusion
- *A self-blame stuck point
- A safety behaviour
- A hallucination
> Stuck points are challenged with Socratic questioning.
:::

## 3.4 Looking after the helper [core][beginner]
People who work with trauma are affected by it.
- **Vicarious (secondary) traumatisation**: changes in a helper's own beliefs about safety, trust and the world, from repeated exposure to others' trauma stories.
- **Compassion fatigue**: emotional exhaustion and reduced capacity to empathise.
- **Burnout**: exhaustion, cynicism and reduced effectiveness, often from workload and organisational problems.
- **Moral injury**: distress from acting against, or witnessing violations of, one's moral code (for example a nurse unable to save patients because of lack of oxygen).

### Protecting yourself and your team
- Regular supervision and peer support.
- Manageable caseloads; variety of work.
- Clear limits on exposure to graphic material.
- Sleep, exercise, relationships, and interests outside work.
- Organisations that acknowledge stress rather than blame individuals.
- Seeking help early, without shame.

:::widget decide
{"scene": "Dr Fatima, 30, a psychologist in a Srinagar trauma clinic, has listened to many accounts of violence. Lately she checks her children's school route repeatedly, sleeps badly, feels numb with her husband and dreads Mondays. She tells you, 'I should be able to handle this. It's my job.'", "ask": "What is the most helpful response?", "choices": [{"label": "'Yes, toughen up; it comes with the job.'", "verdict": "harm", "outcome": "She hides her distress, makes mistakes and later leaves the profession.", "why": "Stigma about helper distress drives burnout and attrition."}, {"label": "'What you describe sounds like vicarious trauma, which is a known, normal risk of this work. Let's talk to your supervisor about caseload and support, and consider getting help for yourself.'", "verdict": "best", "outcome": "Her caseload is adjusted, she joins peer supervision and sees a therapist. She recovers and stays in the work.", "why": "Naming it, normalising it and acting at both personal and organisational levels protects the helper."}, {"label": "'Take a week off and you'll be fine.'", "verdict": "ok", "outcome": "She feels better briefly, but the symptoms return with the same caseload.", "why": "Rest helps but does not fix the underlying workload and support problems."}]}
:::

:::recall
1. Define vicarious traumatisation. || Changes in a helper's own beliefs and emotions from repeated exposure to others' trauma.
2. What is moral injury? || Distress from acting against, or witnessing violations of, one's moral code.
3. Name four protective strategies for helpers. || Supervision, peer support, manageable caseloads, limits on graphic exposure, self-care, organisational acknowledgement.
:::

:::mcq
Q: Which most reduces burnout in trauma services?
- Individual resilience training alone
- *Supervision, manageable caseloads and an organisation that acknowledges stress
- Working longer hours to finish cases
- Avoiding talking about cases
> Burnout is largely organisational.
:::

## 3.5 Level check · Beginner [beginner]
Twelve or more right out of fifteen opens the Advanced level.

:::mcq
Q: Exposure through TV news meets criterion A only when:
- It is very graphic
- It is watched repeatedly
- *It is work-related
- It involves a family member
> Criterion A4 note.

Q: How many intrusion symptoms are needed for PTSD?
- *One
- Two
- Three
- Four
> 1-1-2-2.

Q: How many negative cognition and mood symptoms are needed?
- One
- *Two
- Three
- Four
> Two of seven.

Q: PTSD requires symptoms for:
- At least 3 days
- *More than 1 month
- At least 6 months
- At least 1 year
> Criterion F.

Q: "With delayed expression" means full criteria were not met until at least:
- 1 month after the event
- 3 months after the event
- *6 months after the event
- 1 year after the event
> Some symptoms may begin earlier.

Q: Acute stress disorder lasts:
- Up to 2 days
- *3 days to 1 month
- 1 to 6 months
- More than 6 months
> Within a month of trauma.

Q: Adjustment disorder begins within what time of the stressor?
- 1 week
- 1 month
- *3 months
- 6 months
> And resolves within 6 months after the stressor ends.

Q: Complex PTSD adds which three features to PTSD?
- Psychosis, mania, catatonia
- *Affect dysregulation, negative self-concept, relationship difficulties
- Obsessions, compulsions, tics
- Amnesia, fugue, identity change
> Disturbances in self-organisation.

Q: Prolonged grief disorder in an adult needs at least how long since the death (DSM-5-TR)?
- 2 months
- 6 months
- *12 months
- 24 months
> 6 months in children.

Q: One of the strongest post-trauma risk factors for PTSD is:
- High intelligence
- *Poor social support
- Being male
- Older age
> Support protects.

Q: In Ehlers and Clark's model, PTSD persists because of:
- Low serotonin
- *A sense of current threat from negative appraisals and a poorly integrated memory
- A personality disorder
- Childhood temperament alone
> Appraisals plus memory.

Q: Single-session debriefing for everyone after a disaster is:
- Recommended
- *Not recommended; it may increase PTSD in some
- Required by law
- The same as PFA
> PFA is recommended instead.

Q: First-line treatment for PTSD in adults is:
- Benzodiazepines
- *Trauma-focused psychological therapy
- Antipsychotics
- Rest and distraction
> CPT, PE, CT-PTSD, EMDR.

Q: In CPT, "No man can ever be trusted" after an assault is an example of:
- Assimilation
- *Over-accommodation
- An intrusion
- Dissociation
> Beliefs stretched too far.

Q: A disinhibited, overly familiar 3-year-old after institutional neglect most likely has:
- RAD
- *DSED
- Autism
- ADHD
> Indiscriminate sociability.
:::

# Part IV · Advanced: mechanisms and the evidence

## 4.1 The neurobiology of PTSD [core][advanced]
### A circuit that cannot switch off the alarm
- **Amygdala**: hyperresponsive to threat cues, including masked faces the person is not aware of.
- **Ventromedial prefrontal cortex and rostral anterior cingulate**: under-active, so extinction memories are poorly recalled and the amygdala is poorly inhibited.
- **Hippocampus**: smaller volume on average, with poor encoding of context, so fear spreads to safe contexts. A twin study of Vietnam veterans found that the unexposed identical twins of men with PTSD also had smaller hippocampi, suggesting a **pre-existing vulnerability** rather than only damage.
- **Insula**: heightened interoceptive and threat awareness.

### The stress hormones
- **Noradrenaline**: raised; drives hyperarousal, startle and the vividness of trauma memory (noradrenaline strengthens emotional memory consolidation).
- **Cortisol**: surprisingly, often **normal or low** at baseline, with **enhanced negative feedback** of the HPA axis (stronger suppression after dexamethasone), unlike the high cortisol of melancholic depression. CRH in cerebrospinal fluid tends to be raised. Low cortisol at the time of trauma may predict later PTSD, which prompted trials of hydrocortisone soon after trauma (mixed results).

### Memory theories
- **Dual representation theory** (Brewin): trauma memories are stored as **sensory-bound representations** (vivid, involuntary, triggered by cues) that are poorly linked to **contextual representations** (where and when, in words). Therapy aims to link the two, so the memory is experienced as past.
- **Fear extinction failure**: people with PTSD learn fear normally but have trouble **recalling extinction**, consistent with vmPFC and hippocampal findings.

### The dissociative subtype
Whereas typical PTSD shows emotional **undermodulation** (an under-inhibited amygdala), the dissociative subtype shows **overmodulation**: excessive prefrontal inhibition of limbic regions, producing numbing, depersonalisation and derealisation. It is linked to early, repeated trauma.

### Genes
Twin heritability is roughly 30 to 40%. A genome-wide study published in 2024 (over a million participants) identified **95 risk loci**, implicating genes involved in stress response, synaptic function and immunity, with overlap with depression and other disorders.

:::widget sort
{"prompt": "Which mechanism does each finding support?", "buckets": ["Amygdala-prefrontal imbalance", "HPA axis changes", "Pre-existing vulnerability", "Overmodulation"], "items": [{"text": "Stronger cortisol suppression after dexamethasone", "bucket": 1}, {"text": "Unexposed identical twins of people with PTSD also have smaller hippocampi", "bucket": 2}, {"text": "Reduced vmPFC activity during recall of extinction", "bucket": 0}, {"text": "Excessive prefrontal inhibition with numbing and depersonalisation", "bucket": 3}, {"text": "Hyperresponsive amygdala to masked fearful faces", "bucket": 0}]}
:::

:::recall
1. Describe the cortisol pattern typical of PTSD. || Normal or low baseline cortisol with enhanced negative feedback; raised CSF CRH.
2. What did the Vietnam twin study suggest about the hippocampus? || Smaller hippocampi may be a pre-existing vulnerability.
3. Contrast undermodulation and overmodulation. || Typical PTSD: under-inhibited amygdala. Dissociative subtype: excessive prefrontal inhibition of limbic regions.
4. How many loci did the 2024 PTSD GWAS identify? || 95.
:::

:::mcq
Q: Compared with melancholic depression, PTSD is more often associated with:
- High baseline cortisol and reduced feedback
- *Normal or low baseline cortisol and enhanced negative feedback
- No HPA changes at all
- Raised thyroid hormone
> A distinctive HPA pattern.
:::

## 4.2 Pharmacology at depth, and what failed [core][advanced]
### What works, and how much
Medicines produce smaller average effects than trauma-focused therapy. SSRIs and venlafaxine have the most evidence. Paroxetine and sertraline are US-approved; fluoxetine and venlafaxine have positive trials.

### What has been tried and disappointed
| Approach | Result |
|---|---|
| Risperidone added to SSRIs in chronic military PTSD | A large trial showed no meaningful benefit |
| Prazosin for nightmares | Several small positive trials, then a large 2018 veterans' trial was negative; still used for some |
| Benzodiazepines | No benefit for core symptoms; associated with worse outcomes |
| Propranolol to prevent PTSD after trauma | Inconsistent prevention results |
| Hydrocortisone after trauma | Mixed preventive evidence |
| Brexpiprazole plus sertraline | Submitted for US approval; the FDA issued a complete response letter in September 2025 and did not approve it |

:::clinician
### Pharmacology in practice
- Start low (anxious, hyperaroused patients tolerate starting doses poorly), titrate to full doses, and give up to 12 weeks.
- For predominant nightmares with poor sleep: imagery rehearsal therapy; prazosin trial if wanted (titrate slowly from 1 mg; check orthostatic blood pressure); avoid in hypotension.
- For comorbid depression: an SSRI covers both; screen for bipolarity first.
- For comorbid alcohol use: address it; naltrexone or acamprosate alongside trauma-focused therapy; do not wait for abstinence before trauma work in all cases (integrated treatments such as COPE show benefit).
- For psychotic features (trauma-related voices, paranoia): low-dose antipsychotic, while recognising that many trauma-related voices are not schizophrenia.
:::

:::widget reveal
{"prompt": "Why might a benzodiazepine taken just after exposure therapy sessions slow recovery from PTSD?", "answer": "Recovery depends on new learning: that the memory can be held without danger and that reminders are safe now. Benzodiazepines can impair memory consolidation and extinction learning, and act as a safety signal, so the person may credit the tablet rather than their own experience for coping."}
:::

:::recall
1. Which two SSRIs have US approval for PTSD? || Sertraline and paroxetine.
2. What did the large 2018 prazosin trial find? || No benefit over placebo for nightmares in veterans.
3. What happened to brexpiprazole plus sertraline for PTSD? || The FDA issued a complete response letter in 2025.
:::

:::mcq
Q: Which statement is best supported by evidence?
- Risperidone augmentation is highly effective in chronic PTSD
- *Trauma-focused therapy outperforms medicines on average
- Benzodiazepines prevent PTSD
- Prazosin has consistently strong evidence
> Therapy is first-line.
:::

## 4.3 ICD-11, HiTOP and RDoC [core][advanced]
### ICD-11 says
- **PTSD is narrower**: three core elements only: **re-experiencing in the present** (vivid intrusive memories, flashbacks or nightmares, with strong emotions or bodily sensations), **avoidance**, and a **persistent sense of current threat** (hypervigilance or enhanced startle). Symptoms last at least several weeks. Mood and cognition symptoms are not part of ICD-11 PTSD.
- **Complex PTSD** is a sibling diagnosis (PTSD plus disturbances in self-organisation).
- **Prolonged grief disorder**: at least **6 months** after the loss (DSM-5-TR uses 12 months for adults), with persistent longing or preoccupation and intense emotional pain, exceeding cultural norms.
- **Adjustment disorder**: preoccupation with the stressor and failure to adapt, typically within a month and resolving within six months.
- Acute stress reaction is classed as a normal reaction (not a disorder) in ICD-11.

:::widget sort
{"prompt": "Is each a core part of ICD-11 PTSD?", "buckets": ["Core ICD-11 PTSD", "Not part of ICD-11 PTSD"], "items": [{"text": "Flashbacks felt as happening now", "bucket": 0}, {"text": "Avoiding reminders", "bucket": 0}, {"text": "Hypervigilance or exaggerated startle", "bucket": 0, "why": "The persistent sense of current threat."}, {"text": "Inability to remember an important aspect of the trauma", "bucket": 1}, {"text": "Loss of interest in activities", "bucket": 1, "why": "In DSM cluster D, not ICD-11 PTSD."}, {"text": "Reckless behaviour", "bucket": 1}]}
:::

### Why the difference matters
ICD-11's narrower PTSD reduces overlap with depression and anxiety. The two systems identify overlapping but different people: some meet DSM-5-TR PTSD and not ICD-11, and the reverse. Know which system a study used before comparing rates.

### HiTOP and RDoC
- **HiTOP** places PTSD in the internalising spectrum, distress subfactor, close to depression and GAD; its intrusion and avoidance features also relate to the fear subfactor. Dissociation may form its own dimension.
- **RDoC** frames PTSD through **negative valence systems** (acute threat, sustained threat), **arousal and regulatory systems** (sleep, arousal), and **cognitive systems** (memory, cognitive control). Research uses fear-potentiated startle and extinction recall paradigms across diagnoses.

:::recall
1. Name the three core elements of ICD-11 PTSD. || Re-experiencing in the present; avoidance; persistent sense of current threat.
2. What is the ICD-11 time rule for prolonged grief disorder? || At least 6 months after the loss.
3. Where does HiTOP place PTSD? || Internalising spectrum, distress subfactor.
:::

:::mcq
Q: Compared with DSM-5-TR, ICD-11 PTSD:
- Adds more mood symptoms
- *Is narrower, focusing on re-experiencing, avoidance and sense of current threat
- Requires 6 months of symptoms
- Includes complex PTSD within it
> Complex PTSD is a separate sibling diagnosis.
:::

## 4.4 Frontiers, and trauma in India [core][advanced]
### New treatments as of November 2026
| Treatment | Status |
|---|---|
| MDMA-assisted therapy | Two Phase 3 trials were positive, but in August 2024 the FDA declined approval, citing trial design, blinding and safety data concerns and asking for a further trial. In August 2026 the developer (Lykos, renamed Resilient Pharmaceuticals) was reported to have resubmitted its application; no decision had been announced. Not legal in India |
| Psilocybin | Small early studies only |
| Ketamine | A repeated-infusion randomised trial showed rapid benefit in chronic PTSD; effects fade and it is not standard care |
| Stellate ganglion block | A local anaesthetic injection in the neck; one sham-controlled trial was positive, others mixed |
| Massed and intensive therapy | Prolonged exposure or CPT delivered daily over 1 to 3 weeks gives outcomes similar to weekly therapy with fewer dropouts |
| Written exposure therapy | Five sessions, non-inferior to CPT in trials; promising for low-resource settings |
| Digital therapy | Guided internet-based trauma-focused CBT is effective for mild to moderate PTSD |

:::widget reveal
{"prompt": "MDMA-assisted therapy produced large effects in trials. Why did the FDA still decline approval in 2024?", "answer": "Concerns included functional unblinding (most participants knew whether they had received MDMA, so expectations could drive results), incomplete data on adverse events such as abuse potential and cardiovascular effects, questions about therapist conduct in the trials, and how the therapy component would be standardised. Large effects do not settle these design problems, which is why a further trial or stronger data were requested."}
:::

### Trauma in India
- **Gender-based violence**: India's National Family Health Survey (2019 to 2021) found that nearly 3 in 10 ever-married women aged 18 to 49 had experienced physical or sexual violence from a spouse. Most never seek help. Trauma assessment must include safe, private enquiry about domestic violence.
- **Child sexual abuse**: under-reported; POCSO 2012 requires mandatory reporting.
- **Disasters and conflict**: earthquakes, cyclones, floods, landslides, communal violence and long-running conflict affect millions. The NDMA's psychosocial support guidelines emphasise community-level support, trained local workers and integration with health services.
- **Road traffic accidents**: India has among the world's highest numbers of road deaths; survivors and families are a large, under-recognised group.
- **Caste and discrimination**: repeated humiliation and violence linked to caste, religion, gender identity or sexuality can shape trauma, help-seeking and trust in services.
- **Task-sharing**: lay counsellors trained in brief interventions (for example WHO's PM+ and NET in humanitarian settings) extend care where specialists are few.

:::widget decide
{"scene": "A district hospital in Odisha after a cyclone has one psychiatrist and two counsellors for 200,000 affected people. Officials ask you to 'screen everyone and give them therapy'.", "ask": "Which plan is best?", "choices": [{"label": "Screen everyone in the first week and start trauma therapy for all who score high", "verdict": "harm", "outcome": "Many early high scorers would have recovered naturally; the team is overwhelmed and people with severe needs wait.", "why": "Early distress is common and often transient; blanket early therapy wastes scarce resources and may not help."}, {"label": "Organise PFA and practical support through community workers now; restore schools, livelihoods and routines; train local workers to identify people with persistent or severe distress after the first month; refer them for brief trauma-focused therapy and the psychiatrist for complex cases", "verdict": "best", "outcome": "Most people recover with support. Those with ongoing PTSD, depression or suicidal thoughts are identified and treated.", "why": "A stepped, community-based approach matches resources to need and follows the evidence."}, {"label": "Prescribe sleeping tablets to all who report poor sleep", "verdict": "harm", "outcome": "Benzodiazepine dependence rises; PTSD is not treated.", "why": "Mass sedation is not evidence-based and can harm."}]}
:::

:::recall
1. What was the FDA's 2024 decision on MDMA-assisted therapy, and what happened in 2026? || It declined approval and asked for more data; in August 2026 the developer was reported to have resubmitted, with no decision announced.
2. What proportion of ever-married Indian women report spousal physical or sexual violence in NFHS-5? || Nearly 3 in 10.
3. Name two brief therapies suited to low-resource settings. || Written exposure therapy; narrative exposure therapy (also PM+).
:::

:::mcq
Q: The main methodological concern raised about MDMA-assisted therapy trials was:
- Too many participants
- *Functional unblinding and incomplete safety data
- No outcome measures
- Use of placebo
> Expectation effects can inflate apparent benefit.
:::
`;
