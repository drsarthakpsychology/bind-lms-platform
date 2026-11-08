/* Module · Motivation, emotion and stress, Parts III and IV (Advanced level and exam zone). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part III · Advanced: brain, regulation, body and practice

## 3.1 The emotional brain [core][advanced]

:::widget figure
{"id": "limbic-system"}
:::

:::widget figure
{"id": "amygdala-fear"}
:::

:::widget figure
{"id": "prefrontal", "focus": ["vmpfc", "acc", "mofc"]}
:::

### From Papez to the limbic system
In 1937 the neuroanatomist **James Papez** proposed a loop of structures for emotion, the **Papez circuit**: hippocampus → fornix → mammillary bodies → mammillothalamic tract → anterior thalamic nuclei → cingulate cortex → parahippocampal (entorhinal) cortex → back to the hippocampus. The idea was that the cingulate cortex turns hypothalamic activity into conscious feeling.

**Paul MacLean** (1952) widened the loop into the **limbic system**, adding the amygdala, septum and parts of the prefrontal cortex, and later proposed the **triune brain** (a "reptilian" core, a "paleomammalian" limbic layer and a "neomammalian" neocortex). Exams still ask about both, but you should know their status: the Papez circuit is now seen mainly as a **memory** circuit (damage to the mammillary bodies and anterior thalamus causes amnesia, as in Korsakoff syndrome), and the triune brain is **not accepted** by comparative neuroscience: brains did not evolve by adding layers on top of each other.


:::widget flow
{
  "title": "The Papez circuit",
  "layout": "cycle",
  "nodes": [
    { "id": "hip", "label": "Hippocampus", "detail": "Starting point of the loop in Papez's 1937 proposal." },
    { "id": "fx", "label": "Fornix", "detail": "The arching fibre bundle carrying output from the hippocampus." },
    { "id": "mb", "label": "Mammillary bodies", "detail": "Small nuclei of the hypothalamus; damaged in Korsakoff syndrome." },
    { "id": "at", "label": "Anterior thalamus", "detail": "Reached through the mammillothalamic tract." },
    { "id": "cg", "label": "Cingulate cortex", "detail": "Papez thought this was where hypothalamic activity became conscious feeling." },
    { "id": "ph", "label": "Parahippocampal cortex", "detail": "Returns the loop to the hippocampus through the entorhinal cortex." }
  ],
  "caption": "Today it is seen mainly as a memory circuit; emotion depends more on the amygdala, insula and prefrontal cortex."
}
:::

### Classic lesion findings
- **Sham rage** (Bard in 1928): cats with the cortex removed but the hypothalamus intact showed sudden, undirected rage attacks at slight touches. The **hypothalamus** organises the bodily side of emotion; the cortex normally restrains and directs it.
- **Klüver-Bucy syndrome** (1937 to 1939): monkeys with both temporal lobes removed (including the amygdalae) became **tame and fearless**, put objects in their mouths (**hyperorality**), failed to recognise the meaning of objects (**psychic blindness**, a visual agnosia), touched everything (**hypermetamorphosis**) and showed **hypersexuality**. In humans it can follow herpes encephalitis or trauma.

:::widget brainmap
{"title": "Two classic lesion findings", "focus": ["hypothalamus", "amygdala", "temporal"], "notes": {"hypothalamus": "Sham rage: with the cortex removed but the hypothalamus intact, cats showed sudden, undirected rage. The hypothalamus organises the bodily side of emotion.", "amygdala": "Removing both amygdalae with the temporal lobes made monkeys tame and fearless: the core of Klüver-Bucy syndrome.", "temporal": "Temporal lobe damage also caused psychic blindness, hyperorality and hypersexuality in Klüver-Bucy monkeys."}, "caption": "The cortex normally holds the hypothalamus in check; the amygdala tags things as dangerous or important."}
:::

:::mnemonic Klüver-Bucy: "Hyper, Hyper, Hyper, Placid, Blind"
**Hyper**orality, **hyper**sexuality, **hyper**metamorphosis, **placid**ity (loss of fear), psychic **blind**ness.
:::

### The amygdala and fear
The **amygdala**, an almond-shaped group of nuclei in the medial temporal lobe, detects **threat and salience**. **Joseph LeDoux**, studying fear conditioning in rats, described two routes:
- The **low road**: sensory thalamus → amygdala directly. It is **fast and crude**, triggering a startle before you know what you saw.
- The **high road**: sensory thalamus → sensory cortex → amygdala. It is **slower but detailed**, allowing you to decide "it's only a stick" and calm the response.

The **lateral nucleus** receives sensory input and stores fear associations; the **central nucleus** sends output to the hypothalamus and brainstem, producing freezing, raised heart rate and stress hormones.

:::example Patient S.M.
S.M., a woman in the United States with **Urbach-Wiethe disease**, a rare genetic condition that calcified both her amygdalae, could not recognise fear in faces and did not feel fear when shown snakes and spiders, in a haunted house, or in real-life dangers such as being held at knifepoint (2011). She still felt other emotions. Interestingly, she did feel panic when breathing air with a high carbon dioxide level, a threat detected inside the body rather than outside.
:::


:::widget flow
{
  "title": "LeDoux's two roads to fear",
  "layout": "tree",
  "nodes": [
    { "id": "st", "label": "Sensory thalamus", "detail": "A curved shape on the forest path reaches the thalamus." },
    { "id": "low", "label": "Low road: straight to the amygdala", "parent": "st", "detail": "Fast and crude. You jump before you know what you saw." },
    { "id": "cx", "label": "High road: sensory cortex", "parent": "st", "detail": "Slower and detailed. The cortex identifies the shape." },
    { "id": "am", "label": "Amygdala (via cortex)", "parent": "cx", "detail": "Detailed information arrives: “It's only a stick,” and the response is calmed." },
    { "id": "out", "label": "Central nucleus output", "parent": "low", "detail": "Freezing, startle, raised heart rate and stress hormones, through the hypothalamus and brainstem." }
  ],
  "caption": "The two routes explain why fear can be both instant and correctable."
}
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


:::widget brainmap
{
  "title": "The emotional brain at a glance",
  "focus": ["amygdala", "hippocampus", "hypothalamus", "thalamus", "prefrontal"],
  "notes": {
    "amygdala": "Detects threat and salience; stores fear associations (lateral nucleus) and triggers responses (central nucleus).",
    "hippocampus": "Adds context: the same dog is frightening in a dark lane, not in a friend's living room.",
    "hypothalamus": "Organises the body's side of emotion: sympathetic arousal, stress hormones, sham rage when the cortex is removed.",
    "thalamus": "Relay station; the start of LeDoux's low and high roads.",
    "prefrontal": "The ventromedial prefrontal cortex links emotion to decisions and calms the amygdala; damaged in Phineas Gage."
  },
  "caption": "Emotions come from these regions working as networks, not from one centre."
}
:::

### Hormones, chemicals and the two sides of the brain
- **Adrenaline and noradrenaline** (sympathetic arousal), **cortisol** (longer stress response), **oxytocin** (bonding, trust, maternal care), **endorphins** (pain relief), **serotonin** (mood and impulse control) and **dopamine** (wanting and reward) all shape emotion.
- **Richard Davidson** found that greater **left prefrontal** activity goes with **approach** emotions (joy, interest, and also anger, which is an approach emotion) and greater **right prefrontal** activity with **withdrawal** emotions (fear, disgust, sadness).

### Measuring emotion in the body
Researchers use **skin conductance (galvanic skin response)**, heart rate and heart-rate variability, blood pressure, **facial EMG** (corrugator muscle for frowning, zygomaticus for smiling), startle eye-blink, hormone levels and brain imaging. The **polygraph** combines several of these; why it fails as a "lie detector" is discussed in the applied module.

:::clinician
Current affective neuroscience treats emotions as products of distributed networks rather than single "centres". Meta-analyses of neuroimaging (2012) found little evidence that discrete emotions map onto dedicated regions; the amygdala responds to salience, novelty and uncertainty in general, not only fear. LeDoux himself now distinguishes **defensive survival circuits** (amygdala-dependent threat detection and response) from the **conscious feeling of fear**, which he argues depends on cortical working-memory and self-related networks; calling the amygdala the "fear centre" conflates the two. Interoceptive accounts (Craig's posterior-to-anterior insula model; Barrett and Simmons's predictive interoception) give James's idea a modern form. **Polyvagal theory** (Porges) is popular in trauma training but its central evolutionary and anatomical claims are disputed by autonomic physiologists (2007); teach it as a contested model. Clinically, amygdala hyper-reactivity and reduced prefrontal regulation are reported in anxiety disorders, PTSD and depression, and normalisation after CBT or SSRIs has been shown in several imaging studies, though effects are group-level and not diagnostic.
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


:::widget flow
{
  "title": "Gross's process model of emotion regulation",
  "layout": "chain",
  "nodes": [
    { "id": "sel", "label": "Situation selection", "detail": "Choose whether to enter the situation: go to the family dinner, or not." },
    { "id": "mod", "label": "Situation modification", "detail": "Change the situation once in it: sit next to the supportive cousin." },
    { "id": "att", "label": "Attentional deployment", "detail": "Shift attention: focus on the children's games, stop replaying the insult." },
    { "id": "cog", "label": "Cognitive change", "detail": "Reappraise: “His comments are about his worries, not my worth.”" },
    { "id": "resp", "label": "Response modulation", "detail": "Act on the emotion already under way: hide irritation, slow breathing." }
  ],
  "edgeLabels": { "cog>resp": "emotion now formed" },
  "caption": "The first four act before the emotion fully forms (antecedent-focused); the last acts after (response-focused). Earlier strategies usually cost less."
}
:::

### Reappraisal versus suppression
**Gross and John** (2003) built the **Emotion Regulation Questionnaire (ERQ)** to measure two strategies:
- **Cognitive reappraisal**: changing how you think about a situation to change its emotional impact. Linked to more positive emotion, better relationships and wellbeing.
- **Expressive suppression**: hiding the outward expression of an emotion. It reduces the visible expression but **not** the inner feeling; it **raises** sympathetic arousal, impairs memory for the event (2000) and can make conversation partners feel less close.

:::widget compare
{"title": "Reappraisal or suppression?", "a": {"label": "Cognitive reappraisal", "points": ["Acts early, before the emotion is in full flow", "Changes the meaning: 'the examiner is strict with everyone'", "Less negative feeling, less arousal", "Memory and conversation unaffected"], "summary": "Reappraisal changes the emotion itself, and goes with better wellbeing and relationships."}, "b": {"label": "Expressive suppression", "points": ["Acts late, once the emotion is under way", "Hides the face and voice", "Inner feeling unchanged, sympathetic arousal rises", "Worse memory for the event, stiffer conversation"], "summary": "Suppression changes what others see, not what you feel, and costs effort. Habitual use goes with poorer wellbeing."}}
:::

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

:::widget thoughtrecord
{"situation": "My cousin's wedding photos are full of my old school friends, and I was not invited to the sangeet.", "thought": "Nobody wants me around. I will always be left out.", "emotion": "hurt", "traps": [{"label": "Overgeneralisation", "right": true, "why": "One missed invitation has become 'nobody' and 'always'."}, {"label": "Mind reading", "right": true, "why": "You are assuming what everyone feels about you without asking."}, {"label": "Catastrophising", "why": "Close, but the thought is about others' feelings and a pattern, not a coming disaster."}, {"label": "Should statements", "why": "No 'should' or 'must' rule is being applied here."}], "forEvidence": ["I was not invited to this one event."], "againstEvidence": ["The sangeet was only for the bride's side and close family.", "Two of those friends messaged me last week.", "I was invited to the reception."], "balanced": "Missing one event hurts, but it does not show that nobody wants me. I can ask my cousin, and meet my friends at the reception."}
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

It is measured with the **MSCEIT**, a performance test with right and wrong answers. The journalist **Daniel Goleman** (1995) popularised a **mixed model** (self-awareness, self-regulation, motivation, empathy and social skill), and **Reuven Bar-On** developed the self-report **EQ-i**.

:::clinician
Mixed models and self-report EI scales overlap heavily with the Big Five (especially neuroticism and extraversion) and with self-efficacy, and their incremental validity beyond personality and cognitive ability is limited. Ability EI (MSCEIT) is more distinct but correlates moderately with verbal intelligence, and the "managing" branch carries most of its predictive power for job performance in emotionally demanding work. Claims such as "EQ matters twice as much as IQ" are not supported. Gross's **extended process model** (2015) adds valuation stages (identification, selection, implementation, monitoring), and **regulatory flexibility** (Bonanno and Burton in 2013) argues that adaptation depends on fitting strategy to context rather than on any single strategy. Clinically, reappraisal is the active ingredient of cognitive restructuring; acceptance-based strategies (in ACT and DBT) target the relationship to emotion rather than its content, and rumination and experiential avoidance are trans-diagnostic targets across depression, anxiety and eating disorders.
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

:::widget figure
{"id": "autonomic", "quiz": true}
:::

:::widget figure
{"id": "hpa-axis", "quiz": true}
:::

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


:::widget flow
{
  "title": "The HPA axis and its brake",
  "layout": "cycle",
  "nodes": [
    { "id": "hy", "label": "Hypothalamus releases CRH", "detail": "Triggered by the amygdala's threat signal." },
    { "id": "pit", "label": "Pituitary releases ACTH", "detail": "ACTH travels in the blood to the adrenal glands." },
    { "id": "adr", "label": "Adrenal cortex releases cortisol", "detail": "Cortisol raises glucose, damps inflammation and keeps energy available." },
    { "id": "fb", "label": "Negative feedback", "detail": "Cortisol acts on the hypothalamus, pituitary and hippocampus to switch the system off." }
  ],
  "caption": "Chronic stress weakens the brake: cortisol rhythms flatten and the system stays on, building allostatic load."
}
:::

### Allostasis and allostatic load
**Homeostasis** means keeping a set point. **Allostasis** (Sterling and Eyer in 1988) means **stability through change**: the body adjusts its set points to meet expected demands (blood pressure is higher when you stand up or face a challenge). **Bruce McEwen** called the cost of repeated or prolonged adaptation **allostatic load**. He described four patterns:
1. **Repeated hits**: frequent stressors.
2. **Lack of adaptation**: no getting used to a repeated stressor (still panicking at the hundredth presentation).
3. **Prolonged response**: failure to switch off after the stressor ends.
4. **Inadequate response**: too little response from one system, leading others to overreact (for example low cortisol allowing inflammation to rise).

:::widget compare
{"title": "Acute stress or chronic stress?", "a": {"label": "Acute: a short burst", "points": ["Heart rate and glucose rise, then settle", "Cortisol peaks and the brake switches it off", "Immune defences briefly boosted", "Memory for the event sharpened"], "summary": "A brief stress response is adaptive. It mobilises the body and then shuts down."}, "b": {"label": "Chronic: always on", "points": ["Blood pressure stays high", "Cortisol stays high or becomes blunted", "Immunity suppressed, inflammation rises", "Hippocampus shrinks, mood and memory suffer"], "summary": "Repeated or prolonged activation is allostatic load: the wear and tear of adapting, which raises the risk of heart disease, diabetes and depression."}}
:::

### Tend and befriend
**Shelley Taylor and colleagues** (2000) pointed out that fight or flight was studied mostly in male animals. Especially in females, a common response to threat is **tend and befriend**: protecting offspring and seeking social support, linked to **oxytocin** and endogenous opioids. Both patterns are found in both sexes.

### Stress and illness
- **Cardiovascular**: acute anger and stress can trigger heart attacks; chronic stress raises blood pressure. Hostility and job strain predict coronary disease.
- **Immune**: brief, acute stress tends to **boost** some quick immune defences; **chronic** stress **suppresses** many immune functions (Segerstrom and Miller's 2004 meta-analysis of about 300 studies). Medical students show lower natural killer cell activity during exams (Kiecolt-Glaser and colleagues), and wounds heal more slowly in stressed caregivers.
- **Gut and skin**: stress worsens irritable bowel syndrome and psoriasis. **Peptic ulcers**, once thought "stress ulcers", are mainly caused by the bacterium **Helicobacter pylori** (Barry Marshall and Robin Warren won the 2005 Nobel Prize for this discovery), with stress as a contributor.
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
  "clinician": "Rosenman and colleagues (1975) reported a relative risk around 2 over roughly eight and a half years of follow-up, independent of standard risk factors. MRFIT and later cohorts did not replicate global Type A effects; hostility, anger and depression have more consistent prospective associations with coronary events."
}
:::

:::widget figure
{"id": "stress-vulnerability"}
:::

### Burnout
**Burnout** (Christina Maslach) is a response to chronic work stress with three parts: **exhaustion**, **cynicism or depersonalisation** (a cold, detached attitude to clients or work) and **reduced professional efficacy**. It is common among doctors, nurses, teachers and IT workers. **ICD-11** lists burnout as an **occupational phenomenon** (code QD85) in the chapter on factors influencing health status, **not** as a medical condition, and only for the work context.

:::clinician
Chronic stress is associated with HPA dysregulation, but the direction differs across conditions: melancholic depression often shows hypercortisolaemia and dexamethasone non-suppression, whereas PTSD and some chronic fatigue and burnout samples show low or flattened cortisol with enhanced feedback sensitivity (Yehuda's work on PTSD). Glucocorticoid excess has been linked to reduced hippocampal volume in animal models (Sapolsky) and in Cushing's syndrome, with partial reversibility. Allostatic load is operationalised as composite indices of neuroendocrine, cardiovascular, metabolic and immune markers (Seeman and colleagues, MacArthur Studies of Successful Aging), which predict mortality and decline. The Segerstrom and Miller meta-analysis (2004) distinguished acute time-limited stressors (up-regulation of natural immunity), brief naturalistic stressors such as exams (shift from cellular to humoral responses), and chronic stressors (global suppression). Tend-and-befriend remains a hypothesis supported mainly by animal oxytocin work and self-report patterns; human oxytocin findings, especially intranasal studies, have replicated poorly.
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
  "clinician": "Standard MBSR: eight weekly 2.5-hour sessions, a day-long retreat in the sixth or seventh week, and around 45 minutes of daily home practice (body scan, sitting meditation, mindful yoga). MBCT keeps the eight-week structure and is recommended by NICE for people with recurrent depression who are currently well. Meta-analyses show moderate effects on stress, anxiety and depression compared with waitlist (2015), with smaller effects against active controls (2018)."
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


:::widget flow
{
  "title": "Stress inoculation training in three phases",
  "layout": "chain",
  "nodes": [
    { "id": "c", "label": "Conceptualisation", "detail": "Understand your stress reactions and see stress as a set of problems that can be broken down." },
    { "id": "s", "label": "Skills acquisition and rehearsal", "detail": "Learn relaxation, problem solving and coping self-statements such as “One step at a time.”" },
    { "id": "a", "label": "Application and follow-through", "detail": "Practise in imagery, role play and real life with graded doses of stress; plan for slips." }
  ],
  "caption": "Like a vaccine: small, manageable doses build resistance to the full challenge."
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
Evidence summary for exam answers. **PMR and applied relaxation** (Öst) have good evidence in generalised anxiety disorder, comparable to CBT in some trials. **Biofeedback** has the best evidence for tension-type headache and migraine (EMG and thermal), reasonable evidence for HRV biofeedback in anxiety, and contested evidence for EEG neurofeedback in ADHD once blinded raters are used (2016). **SIT** has support in anxiety, anger, performance and occupational stress, and is a component of prolonged and trauma-focused CBT protocols. **Mindfulness**: Goldberg and colleagues' meta-analysis (2018) found mindfulness-based interventions superior to no treatment and comparable to other evidence-based treatments for several conditions; adverse effects (anxiety, dissociation) occur in a minority and should be monitored. **Yoga**: Cramer and colleagues' meta-analyses show short-term benefits for depression and anxiety with high risk of bias in many trials. **Organisational interventions** (job redesign, participatory approaches) reduce burnout more durably than individual programmes alone (2017, in physicians). Assessment of stress commonly uses the **Perceived Stress Scale** (Cohen, Kamarck and Mermelstein in 1983; 10-item version widely used in India), the PSLES for life events and the Brief COPE for coping.
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


:::widget sort
{
  "prompt": "Apathy, anhedonia or depressed mood?",
  "buckets": ["Apathy", "Anticipatory anhedonia", "Depressed mood"],
  "items": [
    { "text": "“I don't start anything unless someone reminds me, but I'm not sad.”", "bucket": 0 },
    { "text": "“I never expect a film to be fun, so I don't go. When dragged along, I enjoy it.”", "bucket": 1 },
    { "text": "“I feel heavy and low from morning to night.”", "bucket": 2 },
    { "text": "A man after a frontal stroke who sits all day but laughs at comedies", "bucket": 0 },
    { "text": "A student who won't plan a trip because she is sure it will feel empty", "bucket": 1 },
    { "text": "“Everything feels hopeless and grey.”", "bucket": 2 }
  ]
}
:::

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
Indian research on emotion and wellbeing includes work on **anasakti** (non-attachment, from the Gita, measured by Pande and Naidu in 1992), which predicted lower stress-related strain in some samples, and on **lajja** and **shame-based** self-regulation (Menon and Shweder). Cultural concepts of distress listed in DSM-5-TR include **dhat syndrome** and **kufungisisa** (Zimbabwe: "thinking too much"), and the Cultural Formulation Interview is designed to elicit such idioms. Apathy has its own scales (Marin's Apathy Evaluation Scale) and is a separate target from depression in Parkinson's disease, stroke and dementia; dopaminergic agents have some evidence for apathy, SSRIs may worsen it. Effort-based decision tasks (EEfRT, Treadway) quantify motivational anhedonia and are used in RDoC's positive valence systems domain. For entrance interviews, practise one integrated answer: how the Yerkes-Dodson law, appraisal theory and SDT each inform how you would help an anxious, demotivated student.
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
  "answer": "Inverted-U relation between arousal and performance (1908, mice). Optimal arousal is higher for simple tasks and lower for complex ones. Example: a practised sprinter benefits from high arousal; a student facing new problem types needs calm. Significance: basis of performance anxiety work; refined in sport by IZOF and catastrophe models."
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
  "answer": "An expected external reward for an intrinsically enjoyable task reduces later intrinsic interest. Deci (1971) puzzles; Lepper, Greene and Nisbett (1973) nursery drawing with expected certificates. Explained by cognitive evaluation theory: the reward is seen as controlling. Meta-analysis (1999): tangible expected rewards undermine, verbal praise does not. Significance: design of school and workplace incentives."
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
  "answer": "Five families ordered by timing: situation selection, situation modification, attentional deployment, cognitive change, response modulation. First four antecedent-focused, last response-focused. Reappraisal is linked with better outcomes than suppression in Western samples (measured with the ERQ), though culture moderates the cost of suppression. Significance: framework for CBT, DBT and ACT targets."
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
Who described tend and befriend? :: Shelley Taylor's research group, in 2000.
What is allostasis? :: Stability through change: adjusting set points to meet anticipated demands.
Give the three Cs of hardiness. :: Commitment, control, challenge.
What are the phases of stress inoculation training? :: Conceptualisation, skills acquisition and rehearsal, application.
Which component of Type A predicts heart disease? :: Hostility.
What is the information-gap theory? :: Loewenstein: curiosity arises from noticing a gap in knowledge.
What did the 23-lab replication find for ego depletion? :: An effect close to zero.
:::

## 4.3 Q&A bank · Starting [starting]
Try each question in your head or on paper first, then open the answer.

:::qa How does drive-reduction theory differ from incentive theory, and why do most psychologists use both? [starting]
### Short answer
Drive theory explains behaviour as a **push from inside** (reducing an unpleasant biological tension); incentive theory explains it as a **pull from outside** (the attraction of an expected reward). Real behaviour usually involves both, so neither alone is enough.

### Side by side
| Feature | Drive reduction (Hull) | Incentive theory |
|---|---|---|
| Source of motivation | Internal need and drive | External goal or reward |
| What the person seeks | Less tension, a return to balance | A valued outcome |
| Best examples | Thirst, hunger, warmth | Money, praise, grades, tasty food |
| Main weakness | Cannot explain seeking excitement or eating when full | Ignores biological states that change how attractive a reward is |

### How they combine
- Food is more attractive (a stronger incentive) when you are hungry (a stronger drive).
- Hull himself added an incentive term to his theory after experiments showed rats ran faster as soon as the reward was made bigger.

### Example
A student skips dinner to revise (the scholarship is a strong incentive), but by midnight hunger (drive) wins and she makes Maggi. Both forces were at work all evening.
:::

:::qa Explain the Yerkes-Dodson law with an example from exam preparation. [starting]
### Short answer
Performance rises with arousal up to a point and then falls (an **inverted U**), and the best level of arousal is **lower for complex tasks** than for simple ones.

### Key points
1. **Low arousal**: drowsy, careless, slow. Mistakes from lack of attention.
2. **Moderate arousal**: alert and focused. Best performance.
3. **High arousal**: anxiety floods working memory; attention narrows; you freeze or rush.
4. **Task difficulty shifts the peak**: simple, practised tasks tolerate more arousal; new, complex tasks need a calmer state.

### Exam example
- Writing a definition you have revised twenty times is a simple task: some nervousness helps.
- Solving an unfamiliar statistics problem is a complex task: the same nervousness can make you blank.
- Practical lesson: practise hard question types until they become "simple", and use slow breathing before complex sections.

:::trap
The law is a description of a pattern, not a precise formula, and it says nothing about *why* arousal helps or hurts. Later models (cognitive versus somatic anxiety, catastrophe theory) explain more.
:::
:::

:::qa What are the strengths and weaknesses of Maslow's hierarchy? [starting]
### Short answer
Maslow gave psychology a hopeful, whole-person model of motivation that is easy to apply, but research does not support a strict order of needs, and the model reflects individualist values.

### Strengths
- Puts **growth and meaning** into motivation, not only deficits.
- Useful **practical checklist**: basic needs (food, safety) must be considered before expecting learning or growth.
- Influenced education, nursing, social work and management.

### Weaknesses
| Criticism | What it means |
|---|---|
| Weak evidence for strict order | People often pursue higher needs while lower ones are unmet (artists in poverty, freedom fighters in prison) |
| Vague concepts | Self-actualisation is hard to define and measure |
| Biased sample | Built from a few admired, mostly Western men |
| Cultural bias | Puts individual self-actualisation at the top; many Indian families value duty, belonging and harmony above it |

### A stronger exam answer adds
- Alderfer's **ERG** model (three needs that can operate together, and frustration-regression).
- Large cross-national survey findings: needs are broadly universal, but their order is flexible.
:::

:::qa Compare the James-Lange and Cannon-Bard theories of emotion. [starting]
### Short answer
James-Lange says the **bodily change comes first** and the feeling is our perception of it; Cannon-Bard says the brain triggers **feeling and bodily change at the same time**, so the body is not the cause of the feeling.

### Comparison
| Point | James-Lange | Cannon-Bard |
|---|---|---|
| Sequence | Event, body, feeling | Event, thalamus, feeling and body together |
| Role of the body | Cause of the feeling | Parallel effect |
| Prediction | Each emotion has its own bodily pattern | Different emotions share similar arousal |
| Supporting evidence | Bodily feedback can intensify feeling; interoception research | Emotion persists when bodily feedback is cut; arousal is similar across emotions |

### Cannon's five criticisms, in brief
1. Emotion survives when the viscera are cut off from the brain.
2. Different emotions share similar bodily changes.
3. The viscera are not very sensitive.
4. Visceral changes are too slow.
5. Artificial arousal (an adrenaline injection) gives only "as if" emotion.

### Today's view
Both were partly right: bodily signals do shape feelings, and the brain can produce feelings without waiting for the body.
:::

:::qa What is the difference between Selye's view of stress and the life-events view? [starting]
### Short answer
Selye treated stress as the body's **response** to any demand; the life-events view treats stress as the **stimulus**, the amount of change a person must adjust to.

### Selye (response-based)
- Non-specific bodily response: the General Adaptation Syndrome (alarm, resistance, exhaustion).
- Evidence: the same triad of damage in rats exposed to very different agents.

### Life events (stimulus-based)
- The Social Readjustment Rating Scale gives each event a number of life change units; a high total predicts illness.
- India's Presumptive Stressful Life Events Scale lists events that fit Indian life.

### What both miss
| Missing piece | Why it matters |
|---|---|
| Appraisal | A divorce can be relief or catastrophe |
| Coping resources | The same event hits harder with no support |
| Chronic daily strain | Hassles predict symptoms better than big events |

These gaps led to the transactional model you meet at the Beginner level.
:::

:::qa How do psychologists infer and measure motivation if it cannot be seen? [starting]
### Short answer
Motivation is a **hypothetical construct**: we infer it from patterns of behaviour and report, the way fever is inferred from a thermometer reading.

### What we look at
| Indicator | What it tells us | Example |
|---|---|---|
| Choice | Direction: which goal wins | A student picks the library over a film |
| Latency | Activation: how fast behaviour starts | How soon she opens her books after dinner |
| Effort and intensity | How hard she tries | Number of practice problems solved |
| Persistence | How long she keeps going after setbacks | Continuing after a poor mock test |
| Self-report | Reasons and feelings | Questionnaires on goals and interest |
| Physiology | Arousal and reward response | Heart rate, pupil size, brain activity |

### Why several measures are needed
- People do not always know their motives (implicit motives).
- Behaviour can have many causes, so converging measures are more convincing.

### Example
A teacher in Indore notices a boy who arrives early, chooses extra problems and keeps trying after mistakes: high activation, clear direction, strong persistence.
:::

:::qa Why did instinct theory fail, and what parts of it survived? [starting]
### Short answer
Instinct theory failed because its lists of instincts grew endlessly and its explanations were **circular**. The idea of **inborn, species-typical behaviour** survived in ethology and evolutionary psychology.

### The failures
- **Circularity**: "He fights because of a fighting instinct; we know he has one because he fights."
- **Endless lists**: thousands of instincts were proposed, one per behaviour.
- **Ignoring learning and culture**: human behaviour varies too much across societies to be fixed by instinct.

### What survived
| Survivor | Idea |
|---|---|
| Ethology | Fixed action patterns triggered by specific releasers, such as a gull chick pecking a red spot |
| Imprinting | Lorenz's goslings following the first moving object |
| Evolutionary psychology | Evolved predispositions (fear of snakes, mate preferences) that interact with learning |
| Preparedness | Some associations, such as snake fears, are learned faster than others |

### Exam tip
Contrast a description ("an instinct to fight") with an explanation that predicts when fighting will and will not happen.
:::

:::qa Distinguish primary and secondary drives with examples from Indian life. [starting]
### Short answer
**Primary drives** arise from unlearned biological needs; **secondary (acquired) drives** are learned because they become linked with reducing primary drives.

### Comparison
| Feature | Primary drive | Secondary drive |
|---|---|---|
| Origin | Biological need | Learning by association |
| Universality | Found in all humans and many animals | Varies across people and cultures |
| Examples | Hunger, thirst, pain avoidance, warmth, sex | Money, approval, status, a government job's security |

### Indian examples of secondary drives
- **Money**: it buys food, shelter and safety, so it becomes motivating in itself.
- **Family approval**: linked since childhood with care and comfort.
- **A "secure" job**: associated with relief from worry about basic needs, which helps explain the pull of government posts.

### Limit
Drive theory struggles to explain motives that reduce no tension at all, such as curiosity or play.
:::

:::qa Explain opponent-process theory using an example of addiction and an example of exam relief. [starting]
### Short answer
Every strong emotional state is followed by an **opposite after-state**. With repetition, the first state weakens and the after-state strengthens, which changes why people repeat the behaviour.

### How it works
1. **A-state**: the first emotional reaction to a stimulus.
2. **B-state**: the opposite reaction that follows and outlasts it.
3. **Repetition**: A shrinks, B grows and starts earlier.

### Two examples
| Phase | Alcohol use | Board exams |
|---|---|---|
| First experience | Strong pleasure (A), mild low mood after (B) | Intense fear (A), a short burst of relief after (B) |
| After many repetitions | Little pleasure (small A), strong craving and withdrawal (large B) | Less fear before each paper, a long, pleasant sense of release afterwards |
| What now drives behaviour | Escaping withdrawal | Seeking the relief, or getting used to the challenge |

### Significance
The model explains the shift from drinking for pleasure to drinking to avoid feeling bad, and why thrill-seeking activities become enjoyable.
:::

:::qa What are D-needs and B-needs, and what did Maslow say self-actualising people are like? [starting]
### Short answer
**D-needs** (deficiency needs) are the lower four levels: their lack creates tension that drives behaviour. **B-needs** (being or growth needs) drive self-actualisation, the fulfilment of one's potential.

### The two kinds of need
| Feature | D-needs | B-needs |
|---|---|---|
| Levels | Physiological, safety, belonging, esteem | Self-actualisation (truth, beauty, justice, meaning) |
| Motive | Filling a gap | Growth for its own sake |
| When met | Tension falls | Desire grows, not ends |

### Features of self-actualising people (Maslow's list, selected)
- Accurate perception of reality and acceptance of self and others.
- Spontaneity and simplicity.
- Focus on problems outside themselves.
- Need for privacy and independence.
- Fresh appreciation of ordinary things.
- **Peak experiences**: moments of intense joy, wonder and unity.
- Deep relationships with a few people; democratic character; a philosophical sense of humour.

### Critique
His sample was small and chosen by his own values; the concept is hard to measure.
:::

:::qa Compare Maslow's hierarchy with Alderfer's ERG theory. [starting]
### Short answer
ERG theory condenses Maslow's five levels into three (**Existence, Relatedness, Growth**), allows several needs to act at once, and adds **frustration-regression**.

### Comparison
| Feature | Maslow | Alderfer (ERG) |
|---|---|---|
| Number of levels | Five | Three |
| Order | General tendency to move upward | Less rigid; needs can operate together |
| Movement | Satisfaction leads up | Satisfaction leads up; frustration can lead back down |
| Key extra idea | Peak experiences, B-needs | Frustration-regression |
| Research support | Weak for strict order | Somewhat better fit to workplace data |

### Mapping the levels
- Existence = physiological + safety.
- Relatedness = belonging + the social part of esteem.
- Growth = self-esteem + self-actualisation.

### Example
A bank clerk in Patna denied a promotion (growth blocked) starts focusing on overtime pay and union demands (existence needs). ERG predicts this; Maslow does not.
:::

:::qa How do emotion, mood, affect and temperament differ? [starting]
### Short answer
They differ in **duration, intensity, focus and stability**: emotions are brief and about something; moods last longer and lack a clear object; affect is the umbrella term; temperament is a stable, inborn tendency to react.

### Comparison
| Term | Duration | Has an object? | Example |
|---|---|---|---|
| Emotion | Seconds to minutes | Yes | Anger at an insult |
| Mood | Hours to days | Often not | Irritable all day for no clear reason |
| Affect | Any | Either | In the MSE, the emotion you observe |
| Temperament | Lifelong, stable | No | A child who is easily upset from infancy |

### Clinical relevance
- In the mental status examination, **mood** is what the person reports and **affect** is what the clinician observes.
- A mismatch (reporting sadness while smiling) is clinically important.

### Example
A student feels a jolt of fear when her name is called (emotion), stays anxious through the exam days (mood), and has always been a cautious child (temperament).
:::

:::qa How were Cannon's criticisms of the James-Lange theory answered by later research? [starting]
### Short answer
Some of Cannon's points still stand, but later work showed that the **body does shape feeling**, so James was partly right.

### Point by point
| Cannon's criticism | Later evidence |
|---|---|
| Emotion survives without visceral feedback | True for emotional behaviour, but some studies of spinal injury suggested reduced intensity (later findings were mixed) |
| Different emotions share similar arousal | Some patterns differ: anger and fear differ in heart rate and skin temperature, though not consistently |
| Viscera are insensitive | Interoception research shows people vary in sensing their heartbeat, and better sensing goes with stronger feelings |
| Visceral changes are too slow | Facial and muscle feedback is fast |
| Artificial arousal gives only "as if" emotion | Context matters: arousal can intensify emotion when a label is available |

### Today's picture
Feelings arise from the brain's reading of bodily signals together with context and appraisal. Damasio's somatic marker idea and interoception research revived James in a modern form.
:::

:::qa What is the difference between eustress and distress, and what does the fight-or-flight response do? [starting]
### Short answer
**Eustress** is stress that motivates and feels manageable; **distress** is stress that overwhelms or harms. **Fight or flight** is the fast sympathetic response that prepares the body for action in either case.

### Eustress versus distress
| Feature | Eustress | Distress |
|---|---|---|
| Appraisal | Challenge | Threat or loss |
| Feeling | Energised, focused | Overwhelmed, anxious |
| Duration | Usually short | Often prolonged |
| Examples | A wedding, a new job, a debate final | Unemployment, illness, chronic conflict |

### The fight-or-flight response
- Sympathetic nerves and the adrenal medulla release adrenaline and noradrenaline.
- Heart rate, blood pressure and breathing rise; glucose is released.
- Digestion slows; pupils widen; blood moves to muscles.

### Key point
The same body response can feel like eustress or distress depending on how the situation is appraised, which is why reappraising nerves as excitement can help before a performance.
:::

:::qa Compare the life-events approach and the daily hassles approach to measuring stress. [starting]
### Short answer
The life-events approach counts **major changes**; the hassles approach counts **small, frequent irritations**. Hassles usually predict everyday symptoms better, while major events matter for serious illness and depression.

### Comparison
| Feature | Life events | Daily hassles |
|---|---|---|
| Measure | Social Readjustment Rating Scale; Indian PSLES | Hassles and Uplifts Scales |
| Content | Bereavement, marriage, job loss | Traffic, queues, noisy neighbours, nagging |
| Time frame | Past year or two | Past month |
| Best predicts | Major illness risk | Day-to-day mood and minor symptoms |
| Main criticism | Treats good and bad change alike; ignores appraisal | Overlaps with symptoms themselves |

### Indian adaptation
The Presumptive Stressful Life Events Scale includes events that matter in Indian life, such as a family member's marriage or changes in a joint family.

### Example
A Mumbai commuter with no major events this year but two hours of crowded trains daily may report more symptoms than a colleague who married recently.
:::

## 4.4 Q&A bank · Beginner [beginner]

:::qa Explain self-determination theory and its implications for teaching. [beginner]
### Short answer
Self-determination theory says people have three basic psychological needs (**autonomy, competence and relatedness**) and that the *quality* of motivation, from controlled to autonomous, matters more than its amount.

### The theory in four steps
1. **Three needs**: feeling that you choose (autonomy), that you can do it (competence), and that you belong (relatedness).
2. **A continuum** from amotivation through external, introjected, identified and integrated regulation to intrinsic motivation.
3. **Rewards can undermine**: expected, tangible rewards for an enjoyable task reduce later interest (the overjustification effect); informative praise does not.
4. **Internalisation**: people can come to own values that began outside them, when the three needs are supported.

### Implications for an Indian classroom
| Need | What undermines it | What supports it |
|---|---|---|
| Autonomy | Threats, constant surveillance, "because I said so" | Explaining why a task matters, offering some choice of topic or method |
| Competence | Tasks far too hard or too easy, comparison with toppers | Clear goals, graded challenge, specific feedback |
| Relatedness | Public shaming, cold teacher relationships | Warmth, knowing students by name, group work |

### A cultural point
Autonomy in this theory means **volition**, not independence. A student who chooses to follow a respected teacher's advice, because she agrees with it, is acting autonomously.
:::

:::qa How did McClelland measure and change achievement motivation, and what is the Indian critique? [beginner]
### Short answer
McClelland measured the need for achievement by scoring the stories people told to TAT pictures, linked it to entrepreneurship and economic growth, and showed in Kakinada that it could be trained. Indian researchers argued that achievement in collectivist settings is often **socially oriented**.

### Measurement
- People write stories about ambiguous pictures; trained coders count achievement imagery (concern with standards of excellence, unique accomplishment, long-term goals).
- These implicit motives predict long-term spontaneous behaviour better than self-reports do.

### Features of high nAch
- Prefers moderate risk, wants concrete feedback, takes personal responsibility.

### Changing it: Kakinada
- Small businessmen in Kakinada, Andhra Pradesh, received achievement training in the 1960s.
- They later started more businesses and created more jobs than a comparison group.

### The Indian critique
| McClelland's model | Socially oriented achievement (Agarwal and Misra) |
|---|---|
| Standards set by the self | Standards set by family and community |
| Success as personal accomplishment | Success as fulfilling expectations and duty |
| Individual reward | Shared pride and family honour |

Both forms coexist; a good counsellor finds out which one is driving a student.
:::

:::qa Critically evaluate the Schachter-Singer two-factor theory. [beginner]
### Short answer
The theory proposed that emotion is **arousal plus a cognitive label** drawn from the situation. It inspired research on misattribution and the role of thinking in emotion, but its original evidence was weaker than often claimed.

### The experiment
- Participants received adrenaline (told it was a vitamin). Some were told the true side effects; others were misinformed or told nothing.
- They waited with a stooge acting euphoric or angry.
- Uninformed, aroused participants tended to catch the stooge's mood; informed participants did so less.

### Support
- Misattribution studies: men on a frightening suspension bridge read fear arousal as attraction.
- False heart-rate feedback alone can shift ratings of attractiveness.

### Problems
1. Effects were small and uneven in the original study.
2. Replications found unexplained arousal is usually labelled **negatively**, not neutrally.
3. Emotions often arise without any search for a label.
4. It does not explain why some emotions have distinct bodily or facial patterns.

### Legacy
It started the cognitive turn in emotion research and is an ancestor of today's constructionist view, in which the brain categorises bodily changes using learned emotion concepts.
:::

:::qa Explain the transactional model of stress with an Indian example. [beginner]
### Short answer
Lazarus and Folkman defined stress as a **relationship** in which a person appraises demands as taxing or exceeding their resources; appraisal and coping, not the event alone, decide the outcome.

### The steps
1. **Primary appraisal**: irrelevant, benign-positive, or stressful (harm or loss, threat, challenge).
2. **Secondary appraisal**: what can I do, and with what resources?
3. **Coping**: problem-focused or emotion-focused, approach or avoidance, meaning-focused, religious.
4. **Reappraisal**: the picture is updated as things change.

### Example: a farmer in Marathwada facing a failed monsoon
| Step | What happens |
|---|---|
| Primary appraisal | Threat: loss of income, debt |
| Secondary appraisal | Resources: a crop insurance claim, a cousin in Pune, a farmers' group, faith |
| Coping | Problem-focused: files the claim, plans a short-duration crop. Emotion- and meaning-focused: prayer, talking with the group |
| Reappraisal | Still serious, but now manageable, with a plan |

### Why it matters
It explains individual differences and points to interventions at both appraisal (reframing, information) and resources (support, services).
:::

:::qa Compare Type A, Type C and Type D personalities and the evidence for each. [beginner]
### Short answer
All three link personality to illness, but only the **hostility** part of Type A and, more weakly, Type D have reasonable support; Type C's link with cancer is weak.

### Comparison
| Type | Core features | Proposed illness link | Evidence |
|---|---|---|---|
| **A** | Competitive striving, time urgency, hostility | Coronary heart disease | Early large study found about double risk; later studies mixed; **hostility** is the consistent predictor |
| **B** | Relaxed, patient | Lower risk | Comparison group |
| **C** | Cooperative, unassertive, suppresses negative emotion | Cancer | Weak and inconsistent |
| **D** | Negative affectivity plus social inhibition | Poorer outcomes after heart disease | Early support; weaker once depression and disease severity are controlled |

### Mechanisms worth naming
- Cardiovascular reactivity to stress.
- Health behaviours (smoking, poor sleep, missed medicines).
- Less social support.

### Exam tip
End with the protective factors (hardiness, sense of coherence, optimism) to show the balance of risk and resilience.
:::

:::qa When do rewards undermine intrinsic motivation, and when do they help? [beginner]
### Short answer
Rewards undermine interest when they are **expected, tangible and contingent on simply doing an already enjoyable task**, because they feel controlling. They help when they **inform people about their competence** or make a dull task worth doing.

### Evidence
- Students paid to solve interesting puzzles later chose them less in free time.
- Nursery children who expected a certificate for drawing drew less afterwards.
- A large meta-analysis found tangible expected rewards undermine free-choice interest, while verbal praise tends to enhance it.

### When rewards are safe or useful
| Situation | Effect |
|---|---|
| Task is already boring | Rewards raise effort without much loss |
| Reward is unexpected | Little or no undermining |
| Reward carries competence information ("best essay") | Can increase interest |
| Reward is given in an autonomy-supportive way | Smaller costs |

### Classroom example
Paying children per book read may raise reading for a month but lower their love of reading; praising specific progress and offering choice of books protects it.
:::

:::qa Trace the development of learned helplessness from the animal studies to the reformulated model. [beginner]
### Short answer
Dogs exposed to inescapable shock later failed to escape avoidable shock. In humans, the reformulated model said what matters is how people **explain** uncontrollable bad events: internal, stable and global explanations predict helplessness and depression.

### Stages of the theory
| Stage | Key idea |
|---|---|
| Original animal studies | Uncontrollability, not shock itself, produced passivity |
| Human extension | Unsolvable problems led to poorer later problem solving |
| Reformulated model | Attributions along three dimensions decide helplessness |
| Hopelessness theory | Expecting bad outcomes and no way to change them is the key |

### The three dimensions
- **Internal or external**: "It's me" versus "the paper was unfair."
- **Stable or unstable**: "always" versus "this time."
- **Global or specific**: "everything" versus "just statistics."

### Application
Attributional retraining teaches students to explain failures with controllable, unstable causes (strategy, effort), which raises persistence.
:::

:::qa Explain goal-setting theory, its mechanisms and its limits. [beginner]
### Short answer
Specific, difficult goals produce higher performance than vague "do your best" goals, because they focus attention, mobilise effort, increase persistence and prompt strategy search, provided there is commitment, feedback and enough skill.

### Mechanisms
1. **Direction**: attention goes to goal-relevant activity.
2. **Energy**: harder goals produce more effort.
3. **Persistence**: people work longer.
4. **Strategy**: people search for better methods.

### Moderators
| Moderator | Effect |
|---|---|
| Commitment | Goals work only if accepted |
| Feedback | Needed to track progress |
| Task complexity | Complex tasks benefit from learning goals rather than outcome targets |
| Ability | Goals beyond ability lead to failure and frustration |

### Limits
- Narrow targets can crowd out other important work.
- Pressure to hit targets can encourage cheating and shortcuts.

### Example
"Solve 20 past NET questions on research methods each evening and check errors" beats "study more".
:::

:::qa Describe Bandura's four sources of self-efficacy with examples from an Indian classroom. [beginner]
### Short answer
Self-efficacy is the belief that you can carry out a specific task. It grows from **mastery experiences, vicarious experience, verbal persuasion and physiological or emotional states**, with mastery the strongest.

### Sources
| Source | What it is | Classroom example |
|---|---|---|
| Mastery experiences | Succeeding at the task yourself | Starting with easier English passages before harder ones |
| Vicarious experience | Seeing similar others succeed | A senior from the same village clears the entrance exam |
| Verbal persuasion | Credible encouragement | A teacher says, "Your last two answers show you can do this" |
| Physiological states | Reading your body's signals | Learning that a racing heart before speaking is normal, not failure |

### Why it matters
Self-efficacy predicts effort, persistence and recovery from setbacks across education, health and work.

### Caution
Efficacy is task-specific: a student may feel capable in maths and helpless in English.
:::

:::qa What is flow, when does it occur, and how can it be used in education and work? [beginner]
### Short answer
Flow is complete absorption in an intrinsically rewarding activity. It happens when **challenge and skill are both high and matched**, with clear goals and immediate feedback.

### Features
- Clear goals and immediate feedback.
- Deep concentration and merging of action and awareness.
- Sense of control; loss of self-consciousness.
- Altered sense of time.
- The activity is its own reward (autotelic).

### The challenge-skill map
| | Low skill | High skill |
|---|---|---|
| High challenge | Anxiety | Flow |
| Low challenge | Apathy | Boredom or relaxation |

### Applications
- **Education**: graded tasks that stretch students slightly; quick feedback; projects with clear goals.
- **Work**: matching assignments to skill, removing interruptions, giving autonomy.
- **Therapy**: rebuilding absorbing activities in depression.

### Example
A tabla student practising a new composition just above her level, with her teacher's instant correction, is more likely to experience flow than one drilling an easy piece.
:::

:::qa What does the ego-depletion story teach us about psychological science? [beginner]
### Short answer
Ego depletion claimed that self-control draws on a limited resource that runs down with use. Hundreds of studies seemed to support it, but large pre-registered replications found an effect **close to zero**, which shows how publication bias and flexible methods can build a false consensus.

### The original claim
- People who resisted tempting food later gave up sooner on puzzles.
- Glucose was proposed as the fuel.

### What went wrong
| Problem | Effect |
|---|---|
| Small samples | Noisy, inflated results |
| Publication bias | Null results were not published |
| Flexible analysis | Many ways to find a "significant" result |
| Weak manipulations | Unclear whether self-control was really used |

### What replaced it
Fatigue after effort may reflect a shift in motivation and attention rather than a depleted fuel tank.

### Lesson for students
Ask whether a finding has been replicated in large, pre-registered studies before teaching it as fact.
:::

:::qa Explain the difference between wanting and liking, and why it matters clinically. [beginner]
### Short answer
**Wanting** (incentive salience, the pull towards a reward) depends mainly on dopamine; **liking** (the pleasure itself) depends on small opioid and endocannabinoid hotspots. They can come apart.

### Evidence
- Rats with dopamine blocked still show pleasure reactions to sugar but will not work to get it.
- Stimulating dopamine increases wanting without increasing liking.

### Clinical relevance
| Condition | Wanting | Liking | Result |
|---|---|---|---|
| Addiction | Sensitised, very high | Reduced | Craving for what no longer feels good |
| Depression | Reduced (anticipatory anhedonia) | Often partly intact | Not starting enjoyable activities |
| Schizophrenia (negative symptoms) | Reduced | Often intact in the moment | Low motivation despite enjoying activities |

### Treatment implications
Behavioural activation works partly by restarting activity before wanting returns, letting liking rebuild motivation.
:::

:::qa Is emotion universal? Compare Ekman's view with the constructionist view. [beginner]
### Short answer
Ekman argued that a small set of **basic emotions** with universal facial expressions evolved in all humans. Constructionists argue that emotions are **built** by the brain from core affect and learned concepts, so categories vary across cultures. Current evidence supports a middle position.

### Comparison
| Point | Basic emotion view | Constructionist view |
|---|---|---|
| Core claim | Six or seven innate emotion programs | Core affect (valence and arousal) plus cultural concepts |
| Evidence | Recognition across cultures, including remote groups | Lower agreement with free labelling; different sorting in remote groups |
| Faces | Universal signals | Context-dependent and learned |
| Culture's role | Display rules modify expression | Culture shapes what emotions are |

### Middle position
- Broad states (pleasant versus unpleasant, calm versus aroused) are recognised widely.
- Specific categories and their meanings vary, as lajja in Odisha shows.

### Exam tip
Mention display rules, rasa theory and lajja for Indian depth.
:::

:::qa Present rasa theory as a psychological theory of emotion and compare it with modern models. [beginner]
### Short answer
Rasa theory, from the Natyashastra, explains how emotions are **produced, expressed and shared**: lasting emotions (sthayi bhava) arise from causes (vibhava), show through expressions (anubhava) and are coloured by passing states (vyabhichari bhava), producing an aesthetic emotion (rasa) in the audience.

### Components and modern parallels
| Rasa concept | Meaning | Modern parallel |
|---|---|---|
| Vibhava | Causes and situations | Eliciting stimulus and appraisal |
| Anubhava | Bodily and facial expressions | Expressive component |
| Vyabhichari bhava | Transient states | Moment-to-moment feelings layered on an emotion |
| Sthayi bhava | Lasting emotion | Emotion or mood with stable core |
| Rasa | Savoured aesthetic emotion | Empathy and emotional contagion in audiences |

### The nine rasas
Shringara, hasya, karuna, raudra, vira, bhayanaka, bibhatsa, adbhuta and shanta.

### Strengths and limits
- Strength: separates feeling, expression and context; explains shared emotion.
- Limit: designed for drama, not tested as a clinical model, though used in research on emotion recognition in dance.
:::

:::qa Compare hardiness and sense of coherence as protective factors against stress. [beginner]
### Short answer
Both are personality orientations that buffer stress. **Hardiness** (commitment, control, challenge) came from studies of executives under pressure; **sense of coherence** (comprehensibility, manageability, meaningfulness) came from Antonovsky's study of what keeps people healthy.

### Comparison
| Feature | Hardiness | Sense of coherence |
|---|---|---|
| Founder | Kobasa | Antonovsky |
| Components | Commitment, control, challenge | Comprehensibility, manageability, meaningfulness |
| Origin | Executives during a company break-up | Salutogenesis: the origins of health |
| Main mechanism | Appraising change as challenge; active coping | Seeing life as understandable, manageable, worthwhile |
| Measure | Hardiness scales | SOC-13 and SOC-29 |

### Evidence
Both predict better health and less distress under stress; overlap with low neuroticism is a criticism.

### Indian example
A nurse in a Chennai government hospital who sees her hard posting as meaningful service (meaningfulness), knows her routines (comprehensibility) and has supportive colleagues (manageability) copes better than a colleague who feels the work is chaotic and pointless.
:::

## 4.5 Q&A bank · Advanced [advanced]

:::qa Describe the neural circuitry of fear and how it relates to anxiety disorders. [advanced]
### Short answer
Fear depends on a network centred on the **amygdala**, fed by fast thalamic and slower cortical inputs, given context by the **hippocampus**, regulated by the **ventromedial prefrontal cortex** and expressed through the **hypothalamus and brainstem**. In many anxiety disorders, the threat system is over-reactive and its regulation is weaker.

### The circuit
| Part | Role |
|---|---|
| Sensory thalamus | Starts both the low road (direct to amygdala) and the high road (via cortex) |
| Lateral amygdala | Stores the link between a cue and danger |
| Central amygdala | Sends output for freezing, startle, heart rate and stress hormones |
| Hippocampus | Adds context: where and when the cue is dangerous |
| Ventromedial PFC | Supports extinction: learning that the cue is now safe |
| Insula | Senses bodily arousal; heightened in panic |

### Links to disorders
- **Phobias and PTSD**: strong conditioned fear and weak extinction or context use.
- **Panic**: heightened sensitivity to internal bodily signals.
- **Generalised anxiety**: threat processing spreads to uncertain, future events.

### Two cautions
1. The amygdala responds to salience and uncertainty, not only fear.
2. LeDoux separates defensive survival circuits from the conscious feeling of fear, which needs cortical networks.

### Treatment link
Exposure therapy works by building new safety learning (extinction) that the prefrontal cortex uses to hold back the old fear memory.
:::

:::qa Why is reappraisal usually more adaptive than suppression, and when is it not? [advanced]
### Short answer
Reappraisal changes the emotion **before** it fully forms, at little cost; suppression hides the expression **after** the emotion forms, so the feeling stays and costs rise. But context and culture change the balance, and flexibility matters more than any single strategy.

### Why reappraisal tends to win
| Outcome | Reappraisal | Suppression |
|---|---|---|
| Inner feeling | Reduced | Unchanged |
| Physiological arousal | Lower | Raised |
| Memory for the event | Intact | Worse |
| Social closeness | Maintained | Partners feel less connected |
| Long-term wellbeing | Better in most samples | Worse in most Western samples |

### When the picture changes
- **Culture**: where restraint is valued (many Asian and Indian family settings), suppression carries smaller social costs.
- **Controllable stressors**: reappraising an injustice can reduce motivation to fix it; problem-solving may be better.
- **Intense emotion**: reappraisal is hard at very high arousal; distraction or breathing may work first.

### The modern frame
**Regulatory flexibility**: healthy people read the situation, choose a fitting strategy, monitor it and switch if needed. Clinically, rumination and experiential avoidance cut across many disorders.
:::

:::qa Explain allostatic load and its importance for understanding stress-related illness. [advanced]
### Short answer
Allostasis is the body's active adjustment of its set points to meet expected demands; **allostatic load** is the wear and tear from repeated or prolonged adjustment, which raises risk of heart disease, metabolic disease, infection, cognitive decline and depression.

### From homeostasis to allostasis
- Homeostasis: hold a fixed set point.
- Allostasis: change the set point when needed (blood pressure rises when you stand or face a challenge).

### Four patterns of load
1. **Repeated hits**: frequent stressors.
2. **Lack of adaptation**: no habituation to a repeated stressor.
3. **Prolonged response**: failure to switch off.
4. **Inadequate response**: one system under-responds, so others over-respond.

### How it is measured
Composite indices combine markers such as blood pressure, waist-to-hip ratio, cholesterol, glycated haemoglobin, cortisol, adrenaline and inflammatory markers. Higher scores predict later illness and mortality.

### Why it matters in India
Chronic financial strain, caregiving, long commutes, heat and poor sleep add up. The concept explains why social conditions get "under the skin" and why stress management must include structural change, not only personal coping.
:::

:::qa Evaluate the evidence for mindfulness, biofeedback and yoga as stress-management methods. [advanced]
### Short answer
All three have real but modest benefits; mindfulness has the strongest evidence base, biofeedback works best for specific conditions, and yoga's trials are promising but often at high risk of bias.

### Evidence summary
| Method | Best evidence | Limits |
|---|---|---|
| Mindfulness (MBSR, MBCT) | Moderate effects on stress, anxiety and depression against inactive controls; MBCT reduces relapse in recurrent depression | Smaller effects against active controls; a minority report adverse effects |
| Biofeedback | Tension headache and migraine (muscle and thermal); heart-rate variability training for anxiety | Neurofeedback for ADHD weakens when ratings are blinded |
| Yoga and pranayama | Short-term reductions in anxiety and depressive symptoms; Indian trials of rhythmic breathing in depression | Small samples, hard to blind, expectation effects |
| Relaxation (PMR, applied relaxation) | Good evidence in generalised anxiety | Needs regular practice |

### How to judge a trial
- What was the control group: waitlist or an active treatment?
- Were outcome raters blind?
- Was the sample clinical or healthy volunteers?
- Who ran the trial, and do they have an allegiance?

### Conclusion
Recommend these as parts of a plan matched to the person and the problem, combined with changes to the stressor where possible.
:::

:::qa A Class 12 student in Kota has stopped studying, says nothing matters and feels flat. How would theories from this module guide your assessment and help? [advanced]
### Short answer
First assess **safety and possible depression** carefully; then use motivation, emotion and stress theories to understand what is maintaining the shutdown and to build a plan with the student and family.

### Assessment, step by step
1. **Safety first**: ask directly and kindly about hopelessness and thoughts of self-harm; follow your service's risk protocol and involve senior staff if needed.
2. **Mood or motivation?** Separate depressed mood, anticipatory anhedonia and apathy.
3. **Stress appraisal**: what is the demand, and how does the student appraise it (threat, loss)? What resources are left?
4. **Attributions**: "I'm just not smart enough" (internal, stable, global) predicts helplessness.
5. **Motive type**: individual or socially oriented achievement; whose standard is being failed?
6. **Arousal**: is anxiety so high that study feels impossible?

### Helping
| Target | Approach |
|---|---|
| Attributions | Shift to controllable causes: method, sleep, planning |
| Self-efficacy | Small mastery experiences with achievable daily goals |
| Autonomy | Involve the student in choosing the plan; talk with parents about pressure |
| Arousal | Breathing, sleep routine, breaks |
| Meaning | Explore values and options beyond one exam |

### Key point
Theory guides questions and plans, but a student who says nothing matters needs a proper clinical assessment, not only study tips.
:::

:::qa What do Klüver-Bucy syndrome and patient S.M. tell us about the amygdala? [advanced]
### Short answer
Both show that the amygdala is needed to **detect threat and give stimuli emotional meaning**: without it, fear of external dangers disappears while many other abilities remain.

### Comparison
| Feature | Klüver-Bucy (monkeys, bilateral temporal lobectomy) | Patient S.M. (bilateral amygdala calcification) |
|---|---|---|
| Fear | Lost: approached snakes | Lost to external threats |
| Recognition | Psychic blindness: objects seen but meaning lost | Could not recognise fear in faces |
| Other signs | Hyperorality, hypersexuality, hypermetamorphosis | Other emotions present; social approach to strangers |
| Interesting exception | None reported | Panic when breathing high carbon dioxide (internal threat) |

### Interpretation
- The amygdala links sensory input to **value and danger**.
- Internal threats can be processed by other circuits (brainstem and insula).
- Damage is usually wider than the amygdala in the monkey studies, so the syndrome reflects temporal lobe loss more broadly.

### Clinical link
Klüver-Bucy features can follow herpes encephalitis, head injury or frontotemporal dementia.
:::

:::qa Critically evaluate Damasio's somatic marker hypothesis. [advanced]
### Short answer
The hypothesis proposes that **bodily emotional signals**, learned from past outcomes, mark options as good or bad and guide decisions, especially under uncertainty. It revived interest in emotion as part of rational choice, but its key evidence has alternative explanations.

### Evidence for
- Patients with ventromedial prefrontal damage (like Damasio's patient "Elliot") keep normal intelligence but make poor life decisions.
- In the Iowa Gambling Task, healthy people show anticipatory skin-conductance responses before risky choices; vmPFC patients do not.

### Criticisms
| Criticism | Point |
|---|---|
| Conscious knowledge | Some studies found people knew the deck values early, so bodily signals may not be needed |
| Task complexity | Poor performance may reflect reversal learning or working memory problems |
| Body necessity | People with spinal injuries can still decide well |
| Specificity | The markers are hard to measure directly |

### Contribution
It undermined the idea that emotion is the enemy of reason and links to modern work on interoception and decision neuroscience.
:::

:::qa Compare ability and mixed models of emotional intelligence and evaluate the evidence. [advanced]
### Short answer
**Ability models** treat EI as a set of mental abilities measured by performance tests; **mixed models** combine abilities with traits and competencies measured by self-report. Ability EI is more distinct; mixed models overlap heavily with personality.

### Comparison
| Feature | Ability model (Mayer and Salovey) | Mixed models (Goleman; Bar-On) |
|---|---|---|
| Content | Perceiving, using, understanding, managing emotions | Self-awareness, self-regulation, motivation, empathy, social skill, optimism |
| Measure | Performance test with scored answers | Self-report questionnaires |
| Overlap | Moderate with verbal intelligence | High with the Big Five and self-esteem |
| Predictive value | Some incremental value for emotionally demanding jobs | Little beyond personality |

### Critique
- Popular claims that EI matters more than IQ are not supported.
- Scoring "correct" emotional answers can reflect cultural norms, a concern for Indian use.

### Applications
Training in emotion recognition and regulation helps in nursing, teaching and counselling, whatever the label.
:::

:::qa Explain Lewin's and Miller's analysis of conflict and apply it to a clinical case. [advanced]
### Short answer
Lewin described approach-approach, avoidance-avoidance and approach-avoidance conflicts. Miller showed that the **avoidance gradient is steeper**, so people approach mixed goals from afar and retreat as they get close.

### The types
| Conflict | Typical behaviour |
|---|---|
| Approach-approach | Quick resolution after brief hesitation |
| Avoidance-avoidance | Vacillation, delay, trying to escape the field |
| Approach-avoidance | Approach, then retreat near the goal |
| Double approach-avoidance | Repeated switching between options |

### Clinical case
Rohan, 30, in Pune, plans for months to start therapy for alcohol use. He books appointments and cancels on the morning of each.
- Approach: wanting health and his family's trust.
- Avoidance: fear of shame and of losing drinking as a coping tool.
- Near the goal, avoidance rises faster than approach.

### Interventions
- **Lower avoidance**: a friendly first phone call, normalising ambivalence.
- **Raise approach near the goal**: a family member accompanies him.
- **Motivational interviewing** explores both sides without pushing.
:::

:::qa How does burnout differ from depression, and why does the difference matter? [advanced]
### Short answer
Burnout is a **work-specific** syndrome of exhaustion, cynicism and reduced efficacy; depression is a **pervasive** mood disorder affecting all areas of life. They overlap, but treatment and responsibility differ.

### Comparison
| Feature | Burnout | Depression |
|---|---|---|
| Scope | Work-related | All of life |
| Core features | Exhaustion, cynicism, reduced efficacy | Low mood or anhedonia plus other symptoms |
| Classification | ICD-11: occupational phenomenon, not a disorder | ICD-11 and DSM-5-TR disorder |
| Pleasure outside work | Often preserved | Often lost |
| Suicidal thinking | Less typical | Common risk to assess |
| Main remedy | Change work conditions plus recovery | Clinical treatment (therapy, medicine) |

### Why it matters
- Calling depression "just burnout" can delay treatment.
- Calling burnout "depression" can medicalise a workplace problem that needs organisational change.

### Example
A software engineer in Hyderabad who enjoys days off and family but dreads work may have burnout; one who has lost interest in everything needs assessment for depression.
:::

:::qa Evaluate the tend-and-befriend theory. [advanced]
### Short answer
The theory proposes that, especially in females, a common response to threat is to **protect offspring and seek social support**, linked to oxytocin and endogenous opioids. It corrected a male-biased view of stress but has mixed evidence in humans.

### The argument
- Fight or flight was studied mostly in male animals.
- For females carrying or caring for young, fleeing or fighting may be costly.
- Affiliation and care offer protection.

### Evidence
| For | Against or uncertain |
|---|---|
| Women report more social support seeking under stress | Many men also seek support |
| Oxytocin linked to bonding and stress reduction in animals | Human oxytocin studies, especially nasal spray studies, replicate poorly |
| Social support buffers stress hormones | Gender differences are small and culturally shaped |

### Indian relevance
In joint and extended families, both men and women often respond to stress by gathering family support, which suggests culture shapes the pattern as much as sex.

### Conclusion
A valuable correction and a useful idea, but not a fixed sex difference.
:::

:::qa Design a stress inoculation programme for police trainees in India. [advanced]
### Short answer
Use Meichenbaum's three phases, tailored to the stressors of Indian policing: crowd control, public hostility, long shifts, trauma exposure and hierarchy.

### Phase 1: Conceptualisation
- Teach the stress response and the appraisal model.
- Trainees list personal triggers (being abused by a crowd, seeing a child victim).

### Phase 2: Skills acquisition and rehearsal
| Skill | Example |
|---|---|
| Arousal control | Slow breathing before entering a tense scene |
| Coping self-statements | "Stay calm, gather facts, follow protocol" |
| Problem-solving | Steps for de-escalating a crowd |
| Communication | Calm, firm phrases; listening |
| Peer support | Buddy check after critical incidents |

### Phase 3: Application and follow-through
- Graded simulations, from role-play to realistic crowd exercises.
- Debrief each simulation; plan for setbacks.
- Booster sessions after postings.

### Evaluation
Measure physiological reactions in simulations, use-of-force complaints, sick leave and wellbeing before and after.
:::

:::qa How should a clinician in India approach a patient who presents emotional distress through bodily symptoms? [advanced]
### Short answer
Treat bodily symptoms as **real and meaningful**: rule out medical causes, explore the person's own idioms and explanations, and gently link body, emotion and life stress without dismissing either.

### Steps
1. **Medical assessment** appropriate to the symptoms.
2. **Explore idioms**: "ghabrahat", "dil baith raha hai", "kamzori", "tension".
3. **Elicit explanations**: what does the person think is causing it?
4. **Screen** for depression, anxiety and alexithymia.
5. **Bridge**: "When the family fights, does the burning get worse?"

### Concepts that help
| Concept | Use |
|---|---|
| Alexithymia | Difficulty naming feelings; teach emotion words gradually |
| Somatic idioms | Culturally accepted language for distress |
| Biopsychosocial formulation | Holds body, mind and context together |
| Cultural formulation interview | Structured way to ask about meaning and help-seeking |

### Pitfalls
- Saying "it's all in your mind" destroys trust.
- Ordering endless tests without discussing stress reinforces fear.

### Example
A 45-year-old woman in Varanasi with headaches and weakness improves when her clinician connects symptoms to her son's illness and offers both relaxation training and family support.
:::

:::qa Discuss the role of culture in emotion with Indian examples. (15 marks) [advanced]
### Short answer
Culture shapes **which situations trigger emotions, how they are appraised, expressed, labelled and regulated**, and which emotions are valued. A biologically prepared core is elaborated very differently across cultures.

### Answer plan
1. **Introduction**: emotion components; the universality debate.
2. **Recognition and expression**: basic emotions, display rules, cultural accents in expression.
3. **Meaning**: lajja in Odisha (valued restraint, misread as anger by outsiders).
4. **Valued emotions**: high-arousal joy in some Western settings versus calm contentment (santosha) in many Asian and Indian traditions.
5. **Regulation**: suppression less costly where restraint is valued; respect for elders.
6. **Theories from India**: rasa theory, the Gita's equanimity.
7. **Clinical**: somatic idioms of distress, cultural concepts of distress.
8. **Conclusion**: minimal universality with deep cultural shaping.

### Comparison table for the answer
| Aspect | More individualist settings | Many Indian settings |
|---|---|---|
| Ideal emotion | Excitement, enthusiasm | Calm, contentment, harmony |
| Anger towards elders | More acceptable to express | Usually restrained |
| Shame | Often negative | Can be valued (lajja) |
| Distress language | Psychological terms | Often bodily or relational |
:::

:::qa How does motivational interviewing apply motivation theory to behaviour change? [advanced]
### Short answer
Motivational interviewing (MI) is a collaborative conversation style that strengthens a person's **own motivation** for change by exploring ambivalence. It applies self-determination theory, approach-avoidance conflict and the stages-of-change idea.

### Links to theory
| Theory | How MI uses it |
|---|---|
| Self-determination theory | Supports autonomy; change reasons come from the client |
| Approach-avoidance conflict | Explores both sides of ambivalence without pushing |
| Stages of change | Fits the approach to readiness |
| Self-efficacy | Builds confidence through past successes |
| Cognitive dissonance | Highlights gaps between values and behaviour |

### Core skills (OARS)
- **Open questions**: "What worries you about your drinking?"
- **Affirmations**: "You've kept your job despite a lot of stress."
- **Reflections**: "Part of you wants to stop, and part of you fears losing your way to relax."
- **Summaries**: draw together change talk.

### Evidence
MI has good evidence for alcohol and substance use and health behaviours, especially as a brief intervention.

### Example
A man in Ludhiana with diabetes who resists diet change starts walking after an MI conversation linked health to being present at his daughter's wedding.
:::

## 4.6 Module test [core]
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
