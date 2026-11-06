/* Module · Motivation, emotion and stress, Parts III and IV (Advanced level and exam zone). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part III · Advanced: brain, regulation, body and practice

## 3.1 The emotional brain [core][advanced]
### From Papez to the limbic system
In 1937 the neuroanatomist **James Papez** proposed a loop of structures for emotion, the **Papez circuit**: hippocampus → fornix → mammillary bodies → mammillothalamic tract → anterior thalamic nuclei → cingulate cortex → parahippocampal (entorhinal) cortex → back to the hippocampus. The idea was that the cingulate cortex turns hypothalamic activity into conscious feeling.

**Paul MacLean** (1952) widened the loop into the **limbic system**, adding the amygdala, septum and parts of the prefrontal cortex, and later proposed the **triune brain** (a "reptilian" core, a "paleomammalian" limbic layer and a "neomammalian" neocortex). Exams still ask about both, but you should know their status: the Papez circuit is now seen mainly as a **memory** circuit (damage to the mammillary bodies and anterior thalamus causes amnesia, as in Korsakoff syndrome), and the triune brain is **not accepted** by comparative neuroscience: brains did not evolve by adding layers on top of each other.

### Classic lesion findings
- **Sham rage** (Bard, 1928): cats with the cortex removed but the hypothalamus intact showed sudden, undirected rage attacks at slight touches. The **hypothalamus** organises the bodily side of emotion; the cortex normally restrains and directs it.
- **Klüver-Bucy syndrome** (1937 to 1939): monkeys with both temporal lobes removed (including the amygdalae) became **tame and fearless**, put objects in their mouths (**hyperorality**), failed to recognise the meaning of objects (**psychic blindness**, a visual agnosia), touched everything (**hypermetamorphosis**) and showed **hypersexuality**. In humans it can follow herpes encephalitis or trauma.

:::mnemonic Klüver-Bucy: "Hyper, Hyper, Hyper, Placid, Blind"
**Hyper**orality, **hyper**sexuality, **hyper**metamorphosis, **placid**ity (loss of fear), psychic **blind**ness.
:::

### The amygdala and fear
The **amygdala**, an almond-shaped group of nuclei in the medial temporal lobe, detects **threat and salience**. **Joseph LeDoux**, studying fear conditioning in rats, described two routes:
- The **low road**: sensory thalamus → amygdala directly. It is **fast and crude**, triggering a startle before you know what you saw.
- The **high road**: sensory thalamus → sensory cortex → amygdala. It is **slower but detailed**, allowing you to decide "it's only a stick" and calm the response.

The **lateral nucleus** receives sensory input and stores fear associations; the **central nucleus** sends output to the hypothalamus and brainstem, producing freezing, raised heart rate and stress hormones.

:::example Patient S.M.
S.M., a woman in the United States with **Urbach-Wiethe disease**, a rare genetic condition that calcified both her amygdalae, could not recognise fear in faces and did not feel fear when shown snakes and spiders, in a haunted house, or in real-life dangers such as being held at knifepoint (Feinstein and colleagues, 2011). She still felt other emotions. Interestingly, she did feel panic when breathing air with a high carbon dioxide level, a threat detected inside the body rather than outside.
:::

### The insula, the cingulate and the prefrontal cortex
- **Insula**: maps the body's internal state (**interoception**), central to **disgust** and to the feeling of heartbeats, breathing and gut sensations. People with insula damage may lose the sense of disgust.
- **Anterior cingulate cortex (ACC)**: conflict monitoring and the distress of pain, including social pain (being excluded; Eisenberger's "Cyberball" studies).
- **Ventromedial prefrontal cortex (vmPFC)** and orbitofrontal cortex: link emotion with decisions and help regulate the amygdala.

:::example Phineas Gage and the somatic marker
In 1848 a tamping iron passed through the left frontal lobe of **Phineas Gage**, a railway foreman in Vermont. He survived but became impulsive and unreliable, "no longer Gage". **Antonio Damasio**'s modern patient "Elliot", after surgery for a frontal tumour, had normal intelligence but could not make sensible life decisions and seemed emotionally flat. Damasio's **somatic marker hypothesis** says that bodily emotional signals, learned from past outcomes, mark options as good or bad and guide decisions. In the **Iowa Gambling Task**, healthy people develop a skin-conductance "warning" before choosing from risky decks, often before they can say why; vmPFC patients do not.
:::

:::widget sort
{
  "prompt": "Which structure is most involved?",
  "buckets": ["Amygdala", "Insula", "Hypothalamus", "Ventromedial PFC"],
  "items": [
    { "text": "A fast startle when a shape on the path looks like a snake", "bucket": 0 },
    { "text": "Disgust at the smell of rotting food", "bucket": 1, "why": "Disgust and the sense of the body's inner state are mapped mainly in the insula." },
    { "text": "Noticing your own heartbeat racing", "bucket": 1 },
    { "text": "Sham rage in cats without a cortex", "bucket": 2 },
    { "text": "Choosing safely in the Iowa Gambling Task after learning which decks lose", "bucket": 3 },
    { "text": "Failure to recognise fear in faces (patient S.M.)", "bucket": 0 }
  ]
}
:::

### Hormones, chemicals and the two sides of the brain
- **Adrenaline and noradrenaline** (sympathetic arousal), **cortisol** (longer stress response), **oxytocin** (bonding, trust, maternal care), **endorphins** (pain relief), **serotonin** (mood and impulse control) and **dopamine** (wanting and reward) all shape emotion.
- **Richard Davidson** found that greater **left prefrontal** activity goes with **approach** emotions (joy, interest, and also anger, which is an approach emotion) and greater **right prefrontal** activity with **withdrawal** emotions (fear, disgust, sadness).

### Measuring emotion in the body
Researchers use **skin conductance (galvanic skin response)**, heart rate and heart-rate variability, blood pressure, **facial EMG** (corrugator muscle for frowning, zygomaticus for smiling), startle eye-blink, hormone levels and brain imaging. The **polygraph** combines several of these; why it fails as a "lie detector" is discussed in the applied module.

:::clinician
Current affective neuroscience treats emotions as products of distributed networks rather than single "centres". Meta-analyses of neuroimaging (Lindquist and colleagues, Behavioral and Brain Sciences, 2012) found little evidence that discrete emotions map onto dedicated regions; the amygdala responds to salience, novelty and uncertainty in general, not only fear. LeDoux himself now distinguishes **defensive survival circuits** (amygdala-dependent threat detection and response) from the **conscious feeling of fear**, which he argues depends on cortical working-memory and self-related networks; calling the amygdala the "fear centre" conflates the two. Interoceptive accounts (Craig's posterior-to-anterior insula model; Barrett and Simmons's predictive interoception) give James's idea a modern form. **Polyvagal theory** (Porges) is popular in trauma training but its central evolutionary and anatomical claims are disputed by autonomic physiologists (Grossman and Taylor, 2007); teach it as a contested model. Clinically, amygdala hyper-reactivity and reduced prefrontal regulation are reported in anxiety disorders, PTSD and depression, and normalisation after CBT or SSRIs has been shown in several imaging studies, though effects are group-level and not diagnostic.
:::

:::recall
1. Trace the Papez circuit. || Hippocampus, fornix, mammillary bodies, mammillothalamic tract, anterior thalamus, cingulate cortex, parahippocampal cortex, back to hippocampus.
2. Why is the triune brain no longer accepted? || Comparative neuroscience shows brains did not evolve by stacking new layers on old ones.
3. Name the features of Klüver-Bucy syndrome. || Hyperorality, hypersexuality, hypermetamorphosis, placidity or loss of fear, psychic blindness.
4. Contrast LeDoux's low road and high road. || Low road: thalamus straight to amygdala, fast and crude. High road: via sensory cortex, slower and detailed.
5. What is the somatic marker hypothesis? || Bodily emotional signals, learned from past outcomes, mark options and guide decisions (Damasio).
6. What did Davidson find about frontal asymmetry? || Left prefrontal activity with approach emotions, right with withdrawal emotions.
:::

:::mcq
Q: A monkey with bilateral temporal lobe lesions becomes fearless, puts stones in its mouth and approaches a snake. This is:
- *Klüver-Bucy syndrome
- Sham rage
- Korsakoff syndrome
- Learned helplessness
> Placidity, hyperorality and psychic blindness after temporal lesions.

Q: A hiker jumps back from a curved stick before consciously recognising it. Which pathway is mainly responsible for the jump?
- Thalamus to sensory cortex to amygdala
- Hippocampus to fornix
- Insula to cingulate
- *Thalamus directly to amygdala
> LeDoux's fast, crude low road.

Q: Which statement about anger fits Davidson's model?
- It is a withdrawal emotion linked to right frontal activity
- It has no frontal asymmetry
- *It is an approach emotion linked to left frontal activity
- It is processed only by the hypothalamus
> Anger motivates approach, so it groups with left frontal activity despite being negative.
:::

## 3.2 Emotion regulation, emotional intelligence and conflict [core][advanced]
### Gross's process model
**Emotion regulation** is how people influence which emotions they have, when they have them and how they experience and express them. **James Gross** (1998) organised strategies by **when** they act in the unfolding of an emotion:
| Point in the process | Strategy family | Example before a tense family dinner in Kolkata |
|---|---|---|
| 1. Situation | **Situation selection** | Decide to go, but leave early |
| 2. Situation | **Situation modification** | Sit next to your supportive cousin, not your critical uncle |
| 3. Attention | **Attentional deployment** | Focus on the food and the children's games (distraction) or stop replaying insults (less rumination) |
| 4. Appraisal | **Cognitive change** (reappraisal) | "My uncle's comments are about his worries, not my worth" |
| 5. Response | **Response modulation** | Hide your irritation (suppression), take slow breaths, have a glass of water |

The first four are **antecedent-focused** (they act before the emotion is fully formed). The fifth is **response-focused** (it acts on an emotion already under way).

### Reappraisal versus suppression
**Gross and John** (2003) built the **Emotion Regulation Questionnaire (ERQ)** to measure two strategies:
- **Cognitive reappraisal**: changing how you think about a situation to change its emotional impact. Linked to more positive emotion, better relationships and wellbeing.
- **Expressive suppression**: hiding the outward expression of an emotion. It reduces the visible expression but **not** the inner feeling; it **raises** sympathetic arousal, impairs memory for the event (Richards and Gross, 2000) and can make conversation partners feel less close.

:::widget sort
{
  "prompt": "Which family of Gross's model is each strategy?",
  "buckets": ["Situation selection or modification", "Attentional deployment", "Cognitive change", "Response modulation"],
  "items": [
    { "text": "Taking the longer route to avoid a stretch where you once had an accident", "bucket": 0 },
    { "text": "Counting tiles on the ceiling during an injection", "bucket": 1 },
    { "text": "Telling yourself a rejection letter is one editor's view, not a verdict on your work", "bucket": 2 },
    { "text": "Keeping a straight face while your boss scolds you", "bucket": 3 },
    { "text": "Asking a friend to come to a hard hospital appointment with you", "bucket": 0 },
    { "text": "Slow belly breathing once panic has already started", "bucket": 3 }
  ]
}
:::

:::trap Suppression is not always harmful
Western studies link suppression with poorer wellbeing. But **Butler, Lee and Gross** (2007) found that the social costs of suppression were smaller for people with Asian bicultural values, where hiding strong emotion in company is expected and valued. In many Indian families, not showing anger to an elder is a sign of respect, not a symptom. Ask what the strategy means and costs in the person's world.
:::

### Emotional intelligence (EI)
**Peter Salovey and John Mayer** (1990) defined emotional intelligence as the ability to perceive, use, understand and manage emotions. Their **four-branch ability model**:
1. **Perceiving** emotions in faces, voices and art.
2. **Using** emotions to help thinking (a positive mood for brainstorming).
3. **Understanding** emotions: how they blend and change ("irritation can grow into rage").
4. **Managing** emotions in yourself and others.

It is measured with the **MSCEIT**, a performance test with right and wrong answers. **Daniel Goleman**'s book Emotional Intelligence (1995) popularised a **mixed model** (self-awareness, self-regulation, motivation, empathy and social skill), and **Reuven Bar-On** developed the self-report **EQ-i**.

:::clinician
Mixed models and self-report EI scales overlap heavily with the Big Five (especially neuroticism and extraversion) and with self-efficacy, and their incremental validity beyond personality and cognitive ability is limited. Ability EI (MSCEIT) is more distinct but correlates moderately with verbal intelligence, and the "managing" branch carries most of its predictive power for job performance in emotionally demanding work (Joseph and Newman's cascading model, 2010). Claims such as "EQ matters twice as much as IQ" are not supported. Gross's **extended process model** (2015) adds valuation stages (identification, selection, implementation, monitoring), and **regulatory flexibility** (Bonanno and Burton, 2013) argues that adaptation depends on fitting strategy to context rather than on any single strategy. Clinically, reappraisal is the active ingredient of cognitive restructuring; acceptance-based strategies (in ACT and DBT) target the relationship to emotion rather than its content, and rumination and experiential avoidance are trans-diagnostic targets across depression, anxiety and eating disorders.
:::

### Motivational and emotional conflict
**Kurt Lewin** described three kinds of conflict, and **Neal Miller** studied them with rats in harness:
| Conflict | What it looks like | Example |
|---|---|---|
| **Approach-approach** | Two attractive goals | Choosing between admission to two good colleges. Usually resolved easily. |
| **Avoidance-avoidance** | Two unattractive options | Study for an exam you hate or face failing. People vacillate or try to escape the field. |
| **Approach-avoidance** | One goal with good and bad sides | Accepting a well-paid job in another city, far from ageing parents |
| **Double (multiple) approach-avoidance** | Two or more options, each mixed | Arranged match A is kind but lives abroad; match B is local but less compatible |

Miller found that the **avoidance gradient is steeper** than the approach gradient: as you get closer to a goal with mixed features, fear rises faster than desire. So people rush towards a mixed goal from far away, then hesitate or back off when it is near, as in cold feet before a wedding.

:::widget decide
{
  "scene": "Ishaan, 24, has an offer to join a start-up in Bengaluru. Months before the joining date he is excited and tells everyone. Two days before, he panics and considers declining, though nothing about the job has changed.",
  "ask": "What explains this best?",
  "choices": [
    { "label": "He has realised the job is bad", "verdict": "ok", "outcome": "Possible, but nothing new has happened.", "why": "Without new information, a change of heart near the goal is better explained by the gradients." },
    { "label": "An approach-avoidance conflict: the avoidance gradient rises more steeply as the goal comes near", "verdict": "best", "outcome": "Naming the pattern helps him list the real pros and cons calmly and he decides to join.", "why": "Miller's steeper avoidance gradient predicts eager approach from afar and hesitation up close." },
    { "label": "He has an avoidance-avoidance conflict", "verdict": "harm", "outcome": "Treating the job as a purely negative option feeds his urge to back out.", "why": "The job has attractive features; this is a single goal with mixed features." }
  ]
}
:::

:::recall
1. Name Gross's five families of emotion regulation in order. || Situation selection, situation modification, attentional deployment, cognitive change, response modulation.
2. What are the costs of expressive suppression in Western studies? || Higher sympathetic arousal, poorer memory for the event, less closeness; inner feeling is not reduced.
3. Give the four branches of the Mayer-Salovey model. || Perceiving, using, understanding and managing emotions.
4. Which kind of conflict leads to vacillation and "leaving the field"? || Avoidance-avoidance.
5. What did Miller find about the two gradients? || The avoidance gradient is steeper than the approach gradient.
:::

:::mcq
Q: Reminding yourself before a viva that the examiners want to see how you think, not to trap you, is an example of:
- Response modulation
- *Cognitive change (reappraisal)
- Situation selection
- Attentional deployment
> Changing the meaning of the situation is reappraisal.

Q: Which measure of emotional intelligence is a performance test with scored answers rather than a self-report?
- *MSCEIT
- EQ-i
- ERQ
- PANAS
> The MSCEIT tests ability; the EQ-i is self-report.
:::

## 3.3 Stress, the body and illness [core][advanced]
### Two stress systems
The stress response runs through two linked systems:
1. **The SAM axis** (sympathetic-adrenal-medullary): within seconds, the sympathetic nerves and the adrenal medulla release **adrenaline and noradrenaline**. This is Cannon's fight or flight.
2. **The HPA axis** (hypothalamic-pituitary-adrenal): over minutes, the **hypothalamus** releases **CRH**, the **pituitary** releases **ACTH**, and the **adrenal cortex** releases **cortisol**. Cortisol raises blood glucose, damps inflammation and, through **negative feedback** on the hypothalamus and pituitary, switches the response off.

:::widget worked
{
  "title": "Follow the stress response through the body",
  "steps": [
    { "q": "Priya, a resident doctor in Delhi, is told at 2 am that a patient is crashing. What happens in the first seconds?", "a": "The amygdala signals the hypothalamus; sympathetic nerves and the adrenal medulla release adrenaline and noradrenaline. Her heart races, breathing quickens, glucose rises: the SAM axis." },
    { "q": "What happens over the next few minutes?", "a": "The hypothalamus releases CRH, the pituitary releases ACTH, and the adrenal cortex releases cortisol: the HPA axis. Cortisol keeps energy available and dampens inflammation." },
    { "q": "The crisis ends and she rests. What switches the system off?", "a": "Cortisol feeds back on the hypothalamus and pituitary (and the hippocampus), reducing CRH and ACTH. The parasympathetic system restores heart rate." },
    { "q": "Now imagine months of night shifts, conflicts and little sleep. What changes?", "a": "The system stays switched on or stops switching off properly. Cortisol rhythms flatten, sleep and immunity suffer, blood pressure and blood sugar creep up. This wear and tear is allostatic load." }
  ],
  "yourTurn": [
    { "q": "A farmer in Vidarbha faces three failed harvests and growing debt. Describe what chronic stress may do to his HPA axis and health, in four steps.", "a": "Repeated threat keeps CRH, ACTH and cortisol output high or poorly regulated; feedback weakens and the daily rhythm flattens; sleep, mood and immune function deteriorate and blood pressure rises; the cumulative cost (allostatic load) raises risk of heart disease, infection and depression. Social and economic support are as much part of the answer as personal coping." }
  ]
}
:::

### Allostasis and allostatic load
**Homeostasis** means keeping a set point. **Allostasis** (Sterling and Eyer, 1988) means **stability through change**: the body adjusts its set points to meet expected demands (blood pressure is higher when you stand up or face a challenge). **Bruce McEwen** called the cost of repeated or prolonged adaptation **allostatic load**. He described four patterns:
1. **Repeated hits**: frequent stressors.
2. **Lack of adaptation**: no getting used to a repeated stressor (still panicking at the hundredth presentation).
3. **Prolonged response**: failure to switch off after the stressor ends.
4. **Inadequate response**: too little response from one system, leading others to overreact (for example low cortisol allowing inflammation to rise).

### Tend and befriend
**Shelley Taylor and colleagues** (2000) pointed out that fight or flight was studied mostly in male animals. Especially in females, a common response to threat is **tend and befriend**: protecting offspring and seeking social support, linked to **oxytocin** and endogenous opioids. Both patterns are found in both sexes.

### Stress and illness
- **Cardiovascular**: acute anger and stress can trigger heart attacks; chronic stress raises blood pressure. Hostility and job strain predict coronary disease.
- **Immune**: brief, acute stress tends to **boost** some quick immune defences; **chronic** stress **suppresses** many immune functions (Segerstrom and Miller's 2004 meta-analysis of about 300 studies). Medical students show lower natural killer cell activity during exams (Kiecolt-Glaser and colleagues), and wounds heal more slowly in stressed caregivers.
- **Gut and skin**: stress worsens irritable bowel syndrome and psoriasis. **Peptic ulcers**, once thought "stress ulcers", are mainly caused by the bacterium **Helicobacter pylori** (Marshall and Warren, Nobel Prize 2005), with stress as a contributor.
- **Mind**: stress is a major trigger of depression and anxiety, especially with genetic or early-life vulnerability (the diathesis-stress model).

The details of psychoneuroimmunology and chronic illness are taught in the applied module's health psychology lessons.

:::widget guess
{
  "prompt": "In the Western Collaborative Group Study, how many times higher was the rate of coronary heart disease in Type A men than in Type B men?",
  "min": 1,
  "max": 5,
  "step": 0.5,
  "unit": "times",
  "answer": [1.5, 2.5],
  "reveal": "About twice as high. Later studies were less consistent, and hostility turned out to be the stronger predictor.",
  "clinician": "Rosenman and colleagues (JAMA, 1975) reported a relative risk around 2 over roughly eight and a half years of follow-up, independent of standard risk factors. MRFIT and later cohorts did not replicate global Type A effects; hostility, anger and depression have more consistent prospective associations with coronary events."
}
:::

### Burnout
**Burnout** (Christina Maslach) is a response to chronic work stress with three parts: **exhaustion**, **cynicism or depersonalisation** (a cold, detached attitude to clients or work) and **reduced professional efficacy**. It is common among doctors, nurses, teachers and IT workers. **ICD-11** lists burnout as an **occupational phenomenon** (code QD85) in the chapter on factors influencing health status, **not** as a medical condition, and only for the work context.

:::clinician
Chronic stress is associated with HPA dysregulation, but the direction differs across conditions: melancholic depression often shows hypercortisolaemia and dexamethasone non-suppression, whereas PTSD and some chronic fatigue and burnout samples show low or flattened cortisol with enhanced feedback sensitivity (Yehuda's work on PTSD). Glucocorticoid excess has been linked to reduced hippocampal volume in animal models (Sapolsky) and in Cushing's syndrome, with partial reversibility. Allostatic load is operationalised as composite indices of neuroendocrine, cardiovascular, metabolic and immune markers (Seeman and colleagues, MacArthur Studies of Successful Aging), which predict mortality and decline. The Segerstrom and Miller meta-analysis (Psychological Bulletin, 2004) distinguished acute time-limited stressors (up-regulation of natural immunity), brief naturalistic stressors such as exams (shift from cellular to humoral responses), and chronic stressors (global suppression). Tend-and-befriend remains a hypothesis supported mainly by animal oxytocin work and self-report patterns; human oxytocin findings, especially intranasal studies, have replicated poorly.
:::

:::recall
1. Which hormones does the SAM axis release, and which does the HPA axis end with? || SAM: adrenaline and noradrenaline. HPA: CRH, then ACTH, then cortisol.
2. What switches the HPA axis off? || Negative feedback of cortisol on the hypothalamus, pituitary and hippocampus.
3. Define allostatic load. || The cumulative wear and tear from repeated or prolonged adaptation to stress (McEwen).
4. Name McEwen's four patterns of allostatic load. || Repeated hits, lack of adaptation, prolonged response, inadequate response.
5. What did Segerstrom and Miller find about chronic stress and immunity? || Chronic stress suppresses many immune functions; brief acute stress up-regulates some.
6. How does ICD-11 classify burnout? || As an occupational phenomenon (QD85), not a medical condition.
:::

:::mcq
Q: The correct order of the HPA axis is:
- ACTH from the hypothalamus, CRH from the pituitary, cortisol from the adrenal medulla
- *CRH from the hypothalamus, ACTH from the pituitary, cortisol from the adrenal cortex
- Cortisol from the pituitary, ACTH from the adrenal cortex
- Adrenaline from the hypothalamus, cortisol from the thyroid
> Hypothalamus to pituitary to adrenal cortex.

Q: A nurse in a Mumbai ICU feels drained, has become cold and detached with patients, and feels she achieves nothing. This picture is:
- Type A behaviour
- The alarm stage of GAS
- Learned helplessness
- *Burnout
> Exhaustion, depersonalisation and reduced efficacy define burnout.
:::

## 3.4 Stress management: what works [core][advanced]
Stress management aims at three levels: the **stressor** (change it), the **appraisal** (see it differently) and the **response** (calm the body and mind). Good programmes combine all three.

### Relaxation methods
- **Progressive muscle relaxation (PMR)**: **Edmund Jacobson** (1920s to 1930s) taught people to tense and then release muscle groups in sequence, learning to notice and let go of tension. Shorter modern versions are widely used.
- **The relaxation response**: **Herbert Benson** (1975), a cardiologist at Harvard, described a state opposite to fight or flight, produced by a repeated word or breath focus, a passive attitude, a quiet setting and a comfortable posture. He drew on Transcendental Meditation research.
- **Autogenic training**: **Johannes Schultz** (1932) used self-suggestions of heaviness and warmth in the limbs.
- **Breathing**: slow, paced breathing (around six breaths a minute) raises heart-rate variability and calms arousal. **Pranayama** comes from yoga.

### Biofeedback
**Biofeedback** gives people real-time information about a body signal they normally cannot sense, so they can learn to control it:
| Type | Signal | Common use |
|---|---|---|
| **EMG** | Muscle tension | Tension headache, bruxism |
| **Thermal** | Skin temperature | Migraine, Raynaud's |
| **Heart-rate variability** | Beat-to-beat variation | Anxiety, stress |
| **Skin conductance** | Sweat gland activity | Anxiety |
| **EEG (neurofeedback)** | Brain waves | ADHD, epilepsy (evidence mixed) |

### Mindfulness-based programmes
**Jon Kabat-Zinn** started **Mindfulness-Based Stress Reduction (MBSR)** in 1979 at the University of Massachusetts Medical Center for patients with chronic pain and illness. He defined mindfulness as "paying attention in a particular way: on purpose, in the present moment, and non-judgementally". MBSR draws on Buddhist meditation, presented in a secular form. **Mindfulness-Based Cognitive Therapy (MBCT)** (Segal, Williams and Teasdale) combines it with cognitive therapy to prevent depressive relapse.

:::widget guess
{
  "prompt": "A standard MBSR course is a series of group classes plus one full-day retreat. How many group classes does it have?",
  "min": 2,
  "max": 20,
  "unit": "classes",
  "answer": [8, 8],
  "reveal": "Eight. Each class lasts about two and a half hours, with daily home practice of roughly 45 minutes and a full-day silent retreat near the end.",
  "clinician": "Standard MBSR: eight weekly 2.5-hour sessions, a day-long retreat in the sixth or seventh week, and around 45 minutes of daily home practice (body scan, sitting meditation, mindful yoga). MBCT keeps the eight-week structure and is recommended by NICE for people with recurrent depression who are currently well. Meta-analyses show moderate effects on stress, anxiety and depression compared with waitlist (Khoury and colleagues, 2015), with smaller effects against active controls (Goldberg and colleagues, 2018)."
}
:::

### Stress inoculation training (SIT)
**Donald Meichenbaum** (1985) built **stress inoculation training**, which works like a vaccine: small, manageable doses of stress build resistance. It has three phases:
1. **Conceptualisation**: understand the stress and your reactions; see stress as a set of problems to solve.
2. **Skills acquisition and rehearsal**: learn relaxation, problem solving, coping self-statements ("One step at a time; I can handle this").
3. **Application and follow-through**: practise in imagery, role play and real life, with graded exposure and relapse prevention.

:::widget sort
{
  "prompt": "Which phase of stress inoculation training is each step?",
  "buckets": ["Conceptualisation", "Skills acquisition", "Application"],
  "items": [
    { "text": "A police trainee in Hyderabad learns how his body reacts when he is shouted at", "bucket": 0 },
    { "text": "He practises slow breathing and the self-statement “Stay calm, gather facts”", "bucket": 1 },
    { "text": "He handles a staged angry crowd in a training exercise", "bucket": 2 },
    { "text": "He learns to see his stress as a set of problems that can be broken down", "bucket": 0 },
    { "text": "He rehearses assertive phrases for de-escalation", "bucket": 1 },
    { "text": "He plans what to do if he slips back into old reactions", "bucket": 2, "why": "Relapse prevention and follow-through belong to the application phase." }
  ]
}
:::

### Changing the stressor and the appraisal
- **Problem solving**: define the problem, generate options, weigh them, act, review (D'Zurilla and Goldfried).
- **Cognitive restructuring**: catch and test catastrophic thoughts (from CBT).
- **Time management and assertiveness**: prioritise, say no, ask for help.
- **Social support**: Cohen and Wills (1985) described two effects: a **main effect** (support helps everyone) and a **buffering effect** (support protects most when stress is high). Perceived support matters more than support actually received.
- **Expressive writing**: **James Pennebaker** found that writing about traumatic or stressful experiences for 15 to 20 minutes on a few consecutive days led to fewer doctor visits and better mood later.
- **Exercise and sleep**: among the best-supported, cheapest stress buffers.

### Yoga, meditation and Indian practices
Yoga combines posture (asana), breathing (pranayama), relaxation and meditation. Trials in India and abroad show benefits for stress, anxiety and mild to moderate depression, though many are small and hard to blind. At **NIMHANS**, Janakiramaiah, Gangadhar and colleagues studied **Sudarshan Kriya Yoga**, a rhythmic breathing practice, in melancholic depression and dysthymia, with encouraging results in small trials. Yoga is now part of several Indian mental health and school wellbeing programmes.

:::widget decide
{
  "scene": "A software company in Gurugram asks you to design a stress programme after several employees burn out during a product launch. The HR head wants a one-hour yoga session a month as the whole solution.",
  "ask": "What do you recommend?",
  "choices": [
    { "label": "Agree: yoga alone will fix burnout", "verdict": "ok", "outcome": "Some employees enjoy it, but the burnout continues.", "why": "Individual relaxation helps, but burnout is driven largely by workload, control and fairness at work." },
    { "label": "Combine individual skills (relaxation, SIT, sleep) with changes to the stressor itself: workload planning, realistic deadlines, recognition and manager training", "verdict": "best", "outcome": "Six months later, sick days and resignations fall.", "why": "Effective programmes act on the stressor, the appraisal and the response. Organisational causes need organisational fixes." },
    { "label": "Screen staff and dismiss those who seem least resilient", "verdict": "harm", "outcome": "Fear rises and people hide distress.", "why": "Punishing the stressed blames individuals for systemic problems and raises stress for everyone." }
  ]
}
:::

:::clinician
Evidence summary for exam answers. **PMR and applied relaxation** (Öst) have good evidence in generalised anxiety disorder, comparable to CBT in some trials. **Biofeedback** has the best evidence for tension-type headache and migraine (EMG and thermal), reasonable evidence for HRV biofeedback in anxiety, and contested evidence for EEG neurofeedback in ADHD once blinded raters are used (Cortese and colleagues, 2016). **SIT** has support in anxiety, anger, performance and occupational stress, and is a component of prolonged and trauma-focused CBT protocols. **Mindfulness**: Goldberg and colleagues' meta-analysis (Clinical Psychology Review, 2018) found mindfulness-based interventions superior to no treatment and comparable to other evidence-based treatments for several conditions; adverse effects (anxiety, dissociation) occur in a minority and should be monitored. **Yoga**: Cramer and colleagues' meta-analyses show short-term benefits for depression and anxiety with high risk of bias in many trials. **Organisational interventions** (job redesign, participatory approaches) reduce burnout more durably than individual programmes alone (Panagioti and colleagues, JAMA Internal Medicine, 2017, in physicians). Assessment of stress commonly uses the **Perceived Stress Scale** (Cohen, Kamarck and Mermelstein, 1983; 10-item version widely used in India), the PSLES for life events and the Brief COPE for coping.
:::

:::recall
1. Who developed progressive muscle relaxation, and how does it work? || Edmund Jacobson; tensing then releasing muscle groups to learn to notice and release tension.
2. What four elements did Benson say produce the relaxation response? || A repeated word or focus, a passive attitude, a quiet setting, a comfortable position.
3. Name the three phases of stress inoculation training. || Conceptualisation, skills acquisition and rehearsal, application and follow-through.
4. What are the main and buffering effects of social support? || Main: support helps everyone. Buffering: it protects most when stress is high.
5. How did Kabat-Zinn define mindfulness? || Paying attention on purpose, in the present moment, non-judgementally.
:::

:::mcq
Q: A patient with tension headaches learns to lower forehead muscle tension while watching a display of the signal. This is:
- Thermal biofeedback
- Neurofeedback
- *EMG biofeedback
- Autogenic training
> EMG biofeedback measures muscle activity.

Q: According to the buffering hypothesis, social support protects health:
- Equally at all levels of stress
- Only when it is received, not perceived
- Only in women
- *Most strongly when stress is high
> Buffering means the protective effect is greatest under high stress.
:::

## 3.5 Motivation and emotion in the clinic and across cultures [core][advanced]
Everything in this module matters in clinical work. This section ties it together for PG answers and interviews.

### Motivation problems in disorders
- **Avolition and apathy**: reduced initiation of goal-directed behaviour, common in schizophrenia (negative symptoms), depression, frontal lobe damage and dementia. Apathy is motivational; it is not the same as sadness.
- **Anhedonia**: loss of pleasure. Research separates **anticipatory** anhedonia (reduced wanting, linked with dopamine and effort-based decision-making) from **consummatory** anhedonia (reduced liking). Many people with depression and schizophrenia still enjoy things in the moment but do not expect to, so they do not try.
- **Learned helplessness and explanatory style**: the bridge from motivation theory to Beck's and Seligman's models of depression.
- **Ambivalence**: in addiction, people are often stuck in an approach-avoidance conflict. **Motivational interviewing** (Miller and Rollnick) works with this ambivalence, drawing out the person's own reasons for change, which is SDT's autonomy in practice. The **transtheoretical model** of stages of change is taught in the applied module.

### Emotion problems in disorders
- **Emotion dysregulation**: intense, fast, slow-to-settle emotions with poor regulation strategies, central to borderline personality disorder and targeted by DBT.
- **Alexithymia**: difficulty identifying and describing feelings and telling them apart from bodily sensations (Sifneos). It is common in somatic symptom presentations and is measured by the Toronto Alexithymia Scale (TAS-20).
- **Affect in the MSE**: described by range, reactivity, intensity, stability and congruence with mood and thought (see the MSE module).

:::widget decide
{
  "scene": "Mr Tiwari, 60, after a stroke affecting his frontal lobe, sits at home all day and says he “just doesn't feel like doing anything”. He denies sadness, eats well, sleeps well and laughs at TV comedies. His family say he is “depressed and lazy”.",
  "ask": "What is the most accurate understanding?",
  "choices": [
    { "label": "He has major depression and needs an antidepressant immediately", "verdict": "ok", "outcome": "Depression should be screened for, but the core features don't fit well.", "why": "Post-stroke depression is common, but he denies sadness and enjoys things. Assess carefully before labelling." },
    { "label": "This looks like apathy, a loss of motivation that can follow frontal damage; plan structured, cued activity and assess for depression too", "verdict": "best", "outcome": "A daily schedule with prompts from his grandson gets him walking and gardening.", "why": "Apathy is a motivational disorder distinct from depression; it responds to external structure and cues." },
    { "label": "He is lazy and needs to be pushed harder with criticism", "verdict": "harm", "outcome": "He withdraws further and the family relationship sours.", "why": "Moral judgement misreads a brain-based motivational deficit." }
  ]
}
:::

### Culture and emotion in Indian clinical work
- **Idioms of distress**: people often express distress in bodily or local terms: "ghabrahat" (a mix of anxiety and palpitations), "dil baith raha hai" (sinking heart), "tension", "mann nahi lagta" (the mind doesn't settle). These carry emotion even when the word "sad" or "anxious" is never used.
- **Somatisation and emotion talk**: many patients first present with aches, fatigue or burning sensations. This is not "denial"; in many settings bodily language is the accepted way to speak about distress.
- **Collectivist motivation**: duty (kartavya), family honour and harmony can be powerful motives. Socially oriented achievement and interdependent self-construal (Markus and Kitayama) are better frames than calling such motives "external".
- **Emotion display**: anger towards elders is often suppressed; grief may be expressed loudly at funerals and then held tightly. Normal and abnormal must be judged against the person's own cultural norms.

:::example Two students, one exam
Ananya in Kota and Lucas in Lyon both fail an entrance mock. Ananya says, "I've let my parents down; they spent so much on coaching." Lucas says, "I'm disappointed in myself; I wanted that school." Both are distressed. Ananya's motive is more socially oriented and her emotion is closer to guilt and shame before family; Lucas's is more individual and closer to disappointment. Good counselling works with the person's own motive, not against it: for Ananya, a conversation with her parents may matter as much as a new study plan.
:::

:::clinician
Indian research on emotion and wellbeing includes work on **anasakti** (non-attachment, from the Gita; Pande and Naidu, 1992), which predicted lower stress-related strain in some samples, and on **lajja** and **shame-based** self-regulation (Menon and Shweder). Cultural concepts of distress listed in DSM-5-TR include **dhat syndrome** and **kufungisisa** (Zimbabwe: "thinking too much"), and the Cultural Formulation Interview is designed to elicit such idioms. Apathy has its own scales (Marin's Apathy Evaluation Scale) and is a separate target from depression in Parkinson's disease, stroke and dementia; dopaminergic agents have some evidence for apathy, SSRIs may worsen it. Effort-based decision tasks (EEfRT, Treadway) quantify motivational anhedonia and are used in RDoC's positive valence systems domain. For entrance interviews, practise one integrated answer: how the Yerkes-Dodson law, appraisal theory and SDT each inform how you would help an anxious, demotivated student.
:::

:::recall
1. How does apathy differ from depression? || Apathy is reduced motivation and initiation without necessarily low mood; depression centres on low mood or loss of pleasure.
2. What is the difference between anticipatory and consummatory anhedonia? || Anticipatory: reduced wanting or expecting pleasure. Consummatory: reduced enjoyment in the moment.
3. Define alexithymia and name its scale. || Difficulty identifying and describing feelings; Toronto Alexithymia Scale (TAS-20).
4. Give two Indian idioms of distress. || Any two: ghabrahat, dil baith raha hai, tension, mann nahi lagta.
:::

:::mcq
Q: Motivational interviewing's emphasis on drawing out the client's own reasons for change fits most closely with:
- *Self-determination theory's emphasis on autonomy
- Drive-reduction theory
- Opponent-process theory
- The James-Lange theory
> MI supports autonomous motivation.

Q: A patient says, "I don't know what I feel, I just have a headache and pressure in my chest." He struggles to name any emotion across several sessions. This best fits:
- Anhedonia
- Apathy
- *Alexithymia
- Emotional lability
> Difficulty identifying and describing feelings is alexithymia.
:::

# Part IV · Exam zone

## 4.1 Long answers with model outlines [core]
Use the scoring frame for every long answer: **definition → theory or model → evidence or study → Indian example → critique → conclusion**.

### Q1. Critically evaluate the major theories of emotion. (15 marks)
:::widget reveal
{
  "prompt": "Plan your answer in one minute, then reveal the model outline.",
  "answer": "1. Define emotion with its five components (appraisal, body, expression, feeling, action tendency); separate emotion, mood and affect. 2. James-Lange: body first, feeling as perception of bodily change; Cannon's five criticisms. 3. Cannon-Bard: thalamus triggers both together; critique (thalamus is a relay). 4. Schachter-Singer two-factor: arousal plus label; the adrenaline-stooge experiment; misattribution (Dutton and Aron); weak replication (Marshall and Zimbardo). 5. Lazarus's appraisal and core relational themes versus Zajonc's affective primacy; the definitional nature of the debate. 6. Facial feedback: Strack's pen study, the failed replication and the small meta-analytic effect. 7. Modern synthesis: LeDoux's two routes, Damasio's somatic marker, Barrett's constructed emotion. 8. Indian contribution: rasa theory (bhava, rasa, vibhava, anubhava), lajja. 9. Conclusion: each theory captured a piece; modern views integrate bodily, cognitive and cultural components."
}
:::

### Q2. Discuss theories of motivation, with special reference to need theories. (15 marks)
:::widget reveal
{
  "prompt": "Plan, then reveal.",
  "answer": "1. Define motivation (activation, direction, intensity); push versus pull. 2. Biological: instinct (McDougall; circularity), drive reduction (Hull; primary and secondary drives; homeostasis), arousal (Yerkes-Dodson, task difficulty), opponent process. 3. Need theories: Murray's needs and press; Maslow's hierarchy with D and B needs and the evidence (Wahba and Bridwell; Tay and Diener); Alderfer's ERG and frustration-regression; McClelland's nAch, nAff, nPow, TAT measurement, Kakinada training, leadership motive pattern. 4. Cognitive: SDT (three needs, continuum, overjustification), expectancy-value (Atkinson, Vroom), attribution (Weiner), goal-setting, self-efficacy. 5. Indian critique: socially oriented achievement (Agarwal and Misra), interdependent self. 6. Conclusion: need theories describe content; cognitive theories describe process; both are needed."
}
:::

### Q3. Explain the transactional model of stress and evaluate the role of personality in stress and health. (15 marks)
:::widget reveal
{
  "prompt": "Plan, then reveal.",
  "answer": "1. Three meanings of stress (stimulus, response, transaction). 2. Response-based: Cannon, Selye's GAS with the triad and its critique (Mason). 3. Stimulus-based: SRRS, PSLES, hassles; critiques. 4. Lazarus and Folkman: primary appraisal (harm, threat, challenge), secondary appraisal, reappraisal; coping: problem- and emotion-focused, approach-avoidance, meaning-focused, religious; goodness of fit. 5. Personality: Type A (WCGS, hostility as the toxic part, MRFIT), Types C and D with evidence status, hardiness (Kobasa), sense of coherence (Antonovsky), optimism, locus of control. 6. Mechanisms: HPA, SAM, allostatic load, health behaviour. 7. Indian example: farmer distress or exam stress with family support and religious coping. 8. Conclusion: stress is a transaction; personality acts through appraisal, coping, physiology and behaviour."
}
:::

### Q4. Describe the neural basis of emotion. (10 marks)
:::widget reveal
{
  "prompt": "Plan, then reveal.",
  "answer": "Papez circuit and MacLean's limbic system (with status); hypothalamus and sham rage; Klüver-Bucy; amygdala, LeDoux's low and high roads, patient S.M.; insula and interoception; ACC; vmPFC, Phineas Gage, Damasio's somatic marker and the Iowa Gambling Task; frontal asymmetry (Davidson); neurochemistry; measurement (GSR, EMG, fMRI); modern network view (Lindquist) and LeDoux's survival circuits versus feelings."
}
:::

## 4.2 Short notes and viva [core]
Short note frame: **definition, three or four key points, one example, one line of significance.** Try each, then reveal.

:::widget reveal
{
  "prompt": "Short note: Yerkes-Dodson law",
  "answer": "Inverted-U relation between arousal and performance (Yerkes and Dodson, 1908, mice). Optimal arousal is higher for simple tasks and lower for complex ones. Example: a practised sprinter benefits from high arousal; a student facing new problem types needs calm. Significance: basis of performance anxiety work; refined in sport by IZOF and catastrophe models."
}
:::

:::widget reveal
{
  "prompt": "Short note: Flow",
  "answer": "Csikszentmihalyi's state of complete absorption in an intrinsically rewarding activity. Occurs when high challenge meets high skill. Features: clear goals, immediate feedback, concentration, sense of control, loss of self-consciousness, time distortion, autotelic experience. Studied by experience sampling. Example: a musician improvising. Significance: central to positive psychology, education and sport."
}
:::

:::widget reveal
{
  "prompt": "Short note: Overjustification effect",
  "answer": "An expected external reward for an intrinsically enjoyable task reduces later intrinsic interest. Deci (1971) puzzles; Lepper, Greene and Nisbett (1973) nursery drawing with expected certificates. Explained by cognitive evaluation theory: the reward is seen as controlling. Meta-analysis (Deci, Koestner and Ryan, 1999): tangible expected rewards undermine, verbal praise does not. Significance: design of school and workplace incentives."
}
:::

:::widget reveal
{
  "prompt": "Short note: General Adaptation Syndrome",
  "answer": "Selye's non-specific bodily response to any demand. Triad in rats: adrenal enlargement, thymus and lymph shrinkage, gastric ulcers. Stages: alarm (shock, counter-shock), resistance (adaptation with lowered cross-resistance), exhaustion (diseases of adaptation). Eustress versus distress. Critique: ignores appraisal (Mason). Significance: founded stress research and the link to illness."
}
:::

:::widget reveal
{
  "prompt": "Short note: Rasa theory",
  "answer": "From Bharata's Natyashastra. Bhava is the emotional state; eight sthayi bhavas are lasting emotions; rasa is the aesthetic savouring of emotion produced by vibhava (causes), anubhava (expressions) and vyabhichari bhava (transient states). Eight rasas plus shanta (Abhinavagupta) make navarasa. Significance: an early, systematic Indian theory separating feeling, expression and context; used in modern research on emotion recognition in dance and music."
}
:::

:::widget reveal
{
  "prompt": "Short note: Type D personality",
  "answer": "Denollet (1996): negative affectivity plus social inhibition. Measured by the DS14. Linked with poorer prognosis after heart disease in early studies; later larger studies weakened the link once depression and disease severity were controlled. Compare Type A (hostility) and Type C (suppression, weak cancer link). Significance: shows that hiding distress and chronic negative emotion may carry health costs."
}
:::

:::widget reveal
{
  "prompt": "Short note: Gross's process model of emotion regulation",
  "answer": "Five families ordered by timing: situation selection, situation modification, attentional deployment, cognitive change, response modulation. First four antecedent-focused, last response-focused. Reappraisal is linked with better outcomes than suppression in Western samples (Gross and John, 2003, ERQ), with cultural moderation (Butler, Lee and Gross, 2007). Significance: framework for CBT, DBT and ACT targets."
}
:::

:::viva
What is the difference between a need and a drive? :: A need is a biological deficit; a drive is the psychological state of tension it produces.
Who said "we feel sorry because we cry"? :: William James.
What did Marañón's adrenaline injections show? :: Artificial arousal produced only "as if" emotion, a point Cannon used against James-Lange.
Name the three needs in SDT. :: Autonomy, competence and relatedness.
What is the leadership motive pattern? :: Moderate to high nPow, lower nAff, high activity inhibition.
Which hypothalamic area was called the satiety centre? :: Ventromedial hypothalamus.
Name the four phases of Masters and Johnson. :: Excitement, plateau, orgasm, resolution.
What is the core relational theme of anger? :: A demeaning offence against me and mine.
Who described tend and befriend? :: Shelley Taylor and colleagues, 2000.
What is allostasis? :: Stability through change: adjusting set points to meet anticipated demands.
Give the three Cs of hardiness. :: Commitment, control, challenge.
What are the phases of stress inoculation training? :: Conceptualisation, skills acquisition and rehearsal, application.
Which component of Type A predicts heart disease? :: Hostility.
What is the information-gap theory? :: Loewenstein: curiosity arises from noticing a gap in knowledge.
What did the 23-lab replication find for ego depletion? :: An effect close to zero.
:::

## 4.3 Module test [core]
:::mcq
Q: Which theory is most clearly circular in its explanations?
- Drive-reduction theory
- *Instinct theory
- Self-determination theory
- Arousal theory
> Naming a behaviour as an instinct and using the behaviour as proof is circular.

Q: According to Hull, behaviour is strengthened when it:
- Increases arousal
- Leads to self-actualisation
- *Reduces a drive
- Produces an opposite after-reaction
> Drive reduction is the reinforcer.

Q: Monkeys working to open latch puzzles for no external reward challenged:
- *Drive-reduction theory
- Arousal theory
- Opponent-process theory
- Incentive theory
> Behaviour without any drive to reduce.

Q: In Alderfer's theory, the "R" stands for:
- Reward
- *Relatedness
- Resistance
- Recognition
> Existence, Relatedness, Growth.

Q: A person high in fear of failure, per Atkinson, is most likely to choose a task that is:
- Of moderate difficulty
- Always the hardest
- Always the easiest
- *Either very easy or very hard
> Very easy tasks guarantee success; very hard ones excuse failure.

Q: Vroom's "instrumentality" refers to the belief that:
- *Performance will lead to a reward
- Effort will lead to performance
- The reward is valuable
- The task is enjoyable
> Expectancy is effort to performance; instrumentality is performance to reward.

Q: In the SDT continuum, "I exercise because health is important to me" is:
- External regulation
- *Identified regulation
- Introjected regulation
- Amotivation
> Valuing the outcome is identified regulation.

Q: The TAT is used in motivation research mainly to assess:
- Intelligence
- Self-efficacy
- Arousal level
- *Implicit motives such as nAch, nAff and nPow
> McClelland's scoring systems for implicit motives.

Q: Successful entrepreneurs, according to McClelland, typically score high on:
- Need for affiliation
- Personalised power
- *Need for achievement
- Fear of success
> nAch suits entrepreneurs and individual contributors.

Q: Experience seeking, disinhibition and boredom susceptibility are subscales of:
- The PANAS
- *Zuckerman's Sensation Seeking Scale
- The SRRS
- The MSCEIT
> The fourth subscale is thrill and adventure seeking.

Q: In the flow model, high challenge with low skill produces:
- Flow
- Boredom
- Relaxation
- *Anxiety
> Challenge exceeding skill produces anxiety.

Q: Damage to the lateral hypothalamus in rats produced:
- Overeating and obesity
- Excess drinking
- *Reduced eating
- Hypersexuality
> The LH was called the hunger (start-eating) centre.

Q: Which hormone rises before meals and increases hunger?
- *Ghrelin
- Leptin
- Insulin
- CCK
> Ghrelin is released by the stomach.

Q: Which sequence matches the James-Lange theory?
- *Event, bodily change, feeling
- Event, feeling, bodily change
- Event, thalamus, feeling and body together
- Event, arousal, cognitive label, feeling
> The feeling is the perception of the bodily change.

Q: A person who is aroused for no obvious reason looks to the situation to decide what she feels. This fits:
- Cannon-Bard theory
- Facial feedback
- Opponent process
- *The two-factor theory
> Arousal plus a situational label.

Q: Lazarus would say two students feel differently about the same exam because they:
- Have different thalamic activity
- Have different display rules
- *Appraise its meaning for their wellbeing differently
- Differ only in arousal level
> Appraisal determines emotion.

Q: Which is NOT one of Ekman's original six basic emotions?
- Disgust
- *Guilt
- Surprise
- Fear
> Guilt is a self-conscious emotion, not in the original six.

Q: The Facial Action Coding System codes expressions as:
- Rasas
- Valence and arousal
- *Combinations of numbered muscle movements (action units)
- Primary and secondary appraisals
> FACS was developed by Ekman and Friesen.

Q: In the Natyashastra, the outward expressions of an emotion, such as tears or trembling, are called:
- Vibhava
- *Anubhava
- Sthayi bhava
- Rasa
> Vibhava are causes; anubhava are expressions.

Q: Patient S.M., with bilateral amygdala damage, showed:
- Loss of all emotions
- Hypersexuality and hyperorality
- Inability to feel disgust
- *Absent fear to external threats but intact other emotions
> She lacked fear of external threats.

Q: The somatic marker hypothesis is associated with:
- *Damasio
- LeDoux
- Papez
- Plutchik
> Damasio, from vmPFC patients and the Iowa Gambling Task.

Q: Hiding one's anger behind a calm face, according to Gross, is:
- Cognitive change
- Situation selection
- *Response modulation (suppression)
- Attentional deployment
> Acting on the expression after the emotion has formed.

Q: Choosing between two attractive job offers is an example of:
- Avoidance-avoidance conflict
- Approach-avoidance conflict
- Double approach-avoidance conflict
- *Approach-approach conflict
> Two attractive goals.

Q: According to Lazarus and Folkman, "Do I have the resources to handle this?" is:
- Primary appraisal
- *Secondary appraisal
- Reappraisal
- Emotion-focused coping
> Secondary appraisal evaluates coping options.

Q: The Indian life events scale developed by Gurmeet Singh and colleagues is the:
- *PSLES
- SRRS
- LEDS
- DS14
> Presumptive Stressful Life Events Scale.

Q: Kobasa's hardiness research was done with:
- Medical students during exams
- Skydivers
- Rats in a maze
- *Business executives during a company break-up
> Illinois Bell executives.

Q: Allostatic load refers to:
- *The cumulative physiological cost of repeated or prolonged stress responses
- The set point for body weight
- The first stage of GAS
- A coping strategy
> McEwen's concept.

Q: Chronic stress, according to Segerstrom and Miller's meta-analysis, tends to:
- Boost all immune functions
- *Suppress many immune functions
- Have no effect on immunity
- Affect only the skin
> Chronic stressors produce broad suppression.

Q: Which is the correct phase order in stress inoculation training?
- Application, conceptualisation, skills acquisition
- Skills acquisition, application, conceptualisation
- *Conceptualisation, skills acquisition, application
- Conceptualisation, application, skills acquisition
> Understand, learn skills, then apply.

Q: Expressive writing as a stress intervention is associated with:
- Jacobson
- Meichenbaum
- Benson
- *Pennebaker
> Writing about stressful experiences over a few days.

Q: A recovering stroke patient lacks initiative but denies sadness and enjoys jokes. The best term is:
- *Apathy
- Anhedonia
- Alexithymia
- Learned helplessness
> A primary motivational deficit without low mood.
:::
`;
