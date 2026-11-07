/* Module · Learning and memory, Part IV (Advanced) and the exam zone. Original text written for VIBHA School of Psychology. */
export const part4 = String.raw`
# Part IV · Advanced: mechanisms, reconstruction and the clinic

## 4.1 What is really learned: contingency, blocking and preparedness [core][advanced]
Pavlov thought conditioning needed only **contiguity**: CS and UCS close together in time. Three discoveries in the late 1960s showed that animals learn about **prediction**, and that biology sets limits on what can be linked.

### Contingency (Rescorla, 1968)
Robert Rescorla gave rats tone-shock pairings. For one group, shock came **only** after the tone. For another, there were exactly as many tone-shock pairings, but shocks **also** came at random when no tone was on. The second group showed almost no fear of the tone, despite identical pairings. What matters is whether the CS **adds information**: the probability of the UCS with the CS compared with its probability without it.

### Blocking (Kamin, 1969)
Leon Kamin first conditioned rats to fear a noise (noise followed by shock). Then he presented noise **plus** a light together, followed by the same shock. When the light was later tested alone, it produced little fear, compared with rats that had the compound trials without the earlier noise training. The noise already predicted the shock perfectly, so the light added nothing: learning to it was **blocked**. Learning happens when an outcome is **surprising**.

:::widget flow
{"title": "Kamin's blocking experiment", "layout": "chain", "nodes": [{"id": "a", "label": "Phase 1: noise, then shock", "detail": "Rats learn that the noise predicts shock. The noise now carries the full prediction."}, {"id": "b", "label": "Phase 2: noise plus light, then the same shock", "detail": "The light is added, but the shock is already fully predicted by the noise. Nothing about the shock is surprising."}, {"id": "c", "label": "Test: light alone", "detail": "The light produces very little fear, compared with rats that only ever had the noise-plus-light training."}, {"id": "d", "label": "Conclusion", "detail": "Pairing alone is not enough. A cue is learned about only when it adds new predictive information, that is, when there is a prediction error to reduce."}], "edgeLabels": {"a>b": "add a second cue", "b>c": "remove the noise", "c>d": "what it means"}, "caption": "Blocking was a key reason the Rescorla-Wagner model was built around surprise."}
:::

Related effects:
- **Overshadowing**: of two CSs presented together, the more salient one gets most of the learning.
- **Latent inhibition** (Lubow and Moore, 1959): a stimulus presented many times on its own before conditioning is later harder to condition. Familiar, "irrelevant" stimuli are learned about slowly.

### The Rescorla-Wagner model (1972)
Robert Rescorla and Allan Wagner turned "surprise drives learning" into an equation. On each trial, the change in associative strength of a CS is:

**ΔV = αβ(λ − ΣV)**

- **ΔV**: how much the CS's associative strength changes on this trial.
- **α** and **β**: learning-rate parameters for the salience of the CS and of the UCS.
- **λ** (lambda): the maximum strength the UCS can support (zero on a trial with no UCS).
- **ΣV**: the **total** strength of **all** CSs present on the trial: what the animal already expects.
- **(λ − ΣV)** is the **prediction error**: the difference between what happened and what was expected.

:::widget flow
{
 "title": "Learning driven by surprise",
 "layout": "cycle",
 "nodes": [
  {
   "id": "ex",
   "label": "Expectation",
   "detail": "The total associative strength of the cues present (sum of V): what the animal predicts."
  },
  {
   "id": "ou",
   "label": "Outcome",
   "detail": "What actually happens (lambda): food, shock, or nothing."
  },
  {
   "id": "er",
   "label": "Prediction error",
   "detail": "Outcome minus expectation. Positive: better or bigger than expected. Negative: worse than expected. Zero: nothing to learn."
  },
  {
   "id": "up",
   "label": "Update",
   "detail": "Each cue's strength changes in proportion to the error and to its salience. Then the next trial begins."
  }
 ],
 "caption": "The same loop describes dopamine neurons, as you will see in 4.2."
}
:::

:::widget worked
{
  "title": "Running the Rescorla-Wagner model",
  "steps": [
    { "q": "A tone is paired with food. Let αβ equal 0.3 and λ equal 1. The tone starts at V = 0. What is V after trial 1?", "a": "ΔV = 0.3 × (1 − 0) = 0.3, so V = 0.3." },
    { "q": "What is V after trial 2 and trial 3?", "a": "Trial 2: ΔV = 0.3 × (1 − 0.3) = 0.21, so V = 0.51. Trial 3: ΔV = 0.3 × (1 − 0.51) ≈ 0.15, so V ≈ 0.66. Each trial adds less: the model produces the negatively accelerated learning curve." },
    { "q": "Now explain blocking. The noise has been trained to V = 1. A light is added and the compound is paired with the same shock (λ = 1). What does the light learn?", "a": "ΣV = 1 (noise) + 0 (light) = 1. Prediction error = 1 − 1 = 0, so ΔV for the light is zero. Nothing is learned about it: blocking." },
    { "q": "How does the model explain extinction?", "a": "On CS-alone trials λ = 0, so the error (0 − V) is negative and V falls towards zero." }
  ],
  "yourTurn": [
    { "q": "A light has V = 0.8. It is now paired with a stronger shock that supports λ = 1.5. Predict the direction of learning, then calculate ΔV with αβ = 0.2.", "a": "The outcome is bigger than expected, so V rises: ΔV = 0.2 × (1.5 − 0.8) = 0.14, giving V = 0.94. A surprisingly large outcome produces new learning even for a well-trained CS." }
  ]
}
:::

**What it explains**: acquisition curves, extinction, blocking, overshadowing, contingency effects and conditioned inhibition. **What it fails to explain**: latent inhibition (a stimulus with V = 0 and no UCS should learn nothing, so pre-exposure should not matter), spontaneous recovery and renewal (it treats extinction as unlearning), and some effects of compound stimuli. Attention-based models from Nicholas Mackintosh and from John Pearce and Geoffrey Hall let the salience of a CS change with experience to fill these gaps.

### Biological preparedness and taste aversion
John Garcia and Robert Koelling (1966) let rats drink "bright, noisy, tasty" water: water flavoured with saccharin, delivered with a click and a flash of light when the rat licked. Some rats were then made ill by X-rays or a drug; others received foot shock.

:::widget reveal
{
  "prompt": "Predict: which rats came to avoid the taste, and which came to avoid the light and noise?",
  "answer": "Rats made ill avoided the sweet taste but not the light and noise. Rats shocked avoided the light and noise but not the taste. Associations are selective: illness is readily linked to taste, pain to sights and sounds. Taste aversion also forms in a single trial and with delays of hours between taste and illness, breaking two 'laws' of conditioning. This is biological preparedness."
}
:::

Martin Seligman (1970) proposed a **continuum of preparedness**: some associations are **prepared** (learned fast, resistant to extinction, often irrational), some **unprepared**, some **contraprepared** (hard to learn at all). Arne Öhman showed that fear conditioned to pictures of snakes and spiders resists extinction better than fear conditioned to flowers or mushrooms, and can be conditioned to masked pictures the person does not consciously see. This helps explain why phobias cluster around ancient dangers (snakes, heights, the dark, blood) rather than modern ones (electric sockets, cars).

:::widget decide
{
  "scene": "Mrs Kaur, 52, from Ludhiana, is having chemotherapy for breast cancer. After her second cycle she has developed a strong aversion to the paneer dish she had eaten the evening before treatment, and now to the hospital's smell. The oncology nurse asks the psychology trainee for advice before the next cycle.",
  "ask": "What is the best learning-informed suggestion?",
  "choices": [
    { "label": "Before each cycle, give her an unusual, non-essential 'scapegoat' food (a distinctly flavoured sweet) so that the aversion forms to it rather than to her usual foods; avoid favourite foods before treatment", "verdict": "best", "outcome": "Over later cycles, aversion forms to the novel sweet, while her regular diet is protected.", "why": "Taste aversions attach most strongly to novel tastes before illness (Bernstein's 'scapegoat' technique). Protecting nutrition matters during chemotherapy." },
    { "label": "Tell her the aversion is irrational and she should eat the paneer anyway", "verdict": "harm", "outcome": "She feels misunderstood and loses more weight.", "why": "Conditioned taste aversion is automatic and not under rational control; insight does not remove it." },
    { "label": "Nothing can be done; it is a side effect of the drugs", "verdict": "ok", "outcome": "Anti-nausea medicines help the nausea, but the learned aversions continue to spread.", "why": "Antiemetics matter, and anticipatory nausea can also be helped by relaxation and desensitisation. But the learning itself can be steered." }
  ]
}
:::

:::clinician
Bernstein (1978) showed that children receiving chemotherapy who ate a novel ice cream ("Mapletoff") before treatment developed an aversion to it, and later work used scapegoat tastes to protect the diet. Anticipatory nausea and vomiting (occurring before the infusion, triggered by hospital cues) is classically conditioned and responds to progressive relaxation, systematic desensitisation and olanzapine-containing antiemetic regimens. The prediction-error principle of Rescorla-Wagner reappears in temporal-difference reinforcement learning and in the dopamine signal discussed in 4.2, which is why it remains the most-cited model in computational psychiatry.
:::

:::recall
1. What did Rescorla's (1968) contingency study show? || Learning depends on whether the CS predicts the UCS, not on the number of pairings.
2. Describe Kamin's blocking procedure and result. || Train noise to shock; then train noise plus light; the light alone elicits little fear because the noise already predicted the shock.
3. Write the Rescorla-Wagner equation and name the prediction-error term. || ΔV = αβ(λ − ΣV); the error is λ − ΣV.
4. Name two findings Rescorla-Wagner cannot explain. || Latent inhibition; spontaneous recovery and renewal.
5. What did Garcia and Koelling show? || Illness is associated with taste and shock with sights and sounds: associations are biologically selective.
:::

:::mcq
Q: In the Rescorla-Wagner model, why does a well-trained CS stop gaining strength?
- The UCS becomes weaker over trials
- Its salience falls to zero
- *The prediction error approaches zero
- Extinction trials are introduced
> When ΣV approaches λ, there is nothing left to learn.

Q: Pre-exposing a tone many times on its own slows later conditioning to it. This is:
- Blocking
- *Latent inhibition
- Sensory preconditioning
- Overshadowing
> Familiar, inconsequential stimuli are conditioned slowly.
:::

## 4.2 Learning theorists and the biology of learning [core][advanced]
### Four classic theorists
| Theorist | Big idea | Key terms | Lasting influence |
|---|---|---|---|
| **Clark Hull** (1943, 1952) | Hypothetico-deductive, mathematical theory: behaviour is driven by **drive reduction** | **Habit strength** (sHr) grows with reinforced practice; reaction potential (sEr) = habit strength × drive (D) × incentive (K) | Precise, testable theory; motivation linked to learning; later shown too narrow (animals learn without drive reduction, and seek stimulation) |
| **Edwin Guthrie** (1935) | **Contiguity**: a combination of stimuli accompanying a movement will, on recurrence, tend to be followed by that movement | **One-trial learning**; "we learn what we do"; practice works by attaching a response to more stimuli | Three ways to **break a habit**: the **threshold** method (introduce the stimulus too weakly to trigger the response, then increase it), the **fatigue** method (repeat until exhausted) and the **incompatible response** method (present the cue while making an incompatible response) |
| **William Estes** (1950) | **Stimulus sampling theory**: on each trial only a sample of stimulus elements is active, and they become connected to the response | Mathematical learning theory; probability of response equals proportion of conditioned elements | Explained gradual learning curves, spontaneous recovery (elements drift back) and founded mathematical psychology |
| **Edward Tolman** (1932) | **Purposive behaviourism**: learning is of expectancies and **cognitive maps** | Latent learning, place learning, intervening variables | Bridged behaviourism and cognitive psychology |

Add **Thorndike** (connectionism, trial and error), **Skinner** (radical behaviourism, operant analysis, no inner causes needed), **Pavlov** and **Watson** (behaviourism's manifesto, 1913), and you have the "learning theorists" questions in NET papers.

:::widget sort
{
  "prompt": "Who said it?",
  "buckets": ["Hull", "Guthrie", "Tolman", "Estes"],
  "items": [
    { "text": "Reaction potential equals habit strength multiplied by drive", "bucket": 0 },
    { "text": "To stop a horse from bucking, put a light blanket on it, then heavier loads, until it accepts a saddle", "bucket": 1, "why": "The threshold method: present the cue below the level that triggers the habit." },
    { "text": "Rats learn the layout of the maze, not a chain of turns", "bucket": 2 },
    { "text": "Only a random sample of stimulus elements is active on any trial", "bucket": 3 },
    { "text": "Learning is complete in a single pairing of stimulus and movement", "bucket": 1 },
    { "text": "Reinforcement works by reducing a biological drive", "bucket": 0 }
  ]
}
:::

### Learning in single cells: Hebb and Kandel
- **Donald Hebb** (1949): "neurons that fire together wire together". When one cell repeatedly helps fire another, the connection between them strengthens. Groups of such cells form **cell assemblies** that represent ideas.
- **Eric Kandel** (Nobel Prize 2000) studied the sea slug **Aplysia**, whose gill-withdrawal reflex habituates and sensitises. **Habituation** involved less neurotransmitter released from sensory neurons; **sensitisation** involved serotonin from facilitating interneurons enhancing release. **Long-term** sensitisation required **new protein synthesis** (via the CREB pathway) and growth of new synapses. Short-term memory changes existing synapses; long-term memory builds new ones.

:::widget neuron
{
 "title": "Firing together: the raw material of Hebbian learning",
 "myelinated": true,
 "caption": "A neuron fires only when its inputs push it past threshold. Hebb's rule says that when one cell repeatedly helps another cross that threshold, the connection between them strengthens. Long-term potentiation, next, is the mechanism."
}
:::

### Long-term potentiation
Tim Bliss and Terje Lømo (1973) stimulated a pathway into the rabbit hippocampus with a brief high-frequency burst and found that the synapses then responded more strongly for hours to days: **long-term potentiation (LTP)**. The key is the **NMDA glutamate receptor**, which opens only when two things happen together: glutamate binds **and** the receiving cell is already depolarised (removing a magnesium block). It is a molecular **coincidence detector**, exactly the Hebbian rule. Richard Morris showed that rats given a drug blocking NMDA receptors (AP5) could not learn the hidden platform's location in a **water maze**.

:::widget flow
{
 "title": "How long-term potentiation strengthens a synapse",
 "layout": "chain",
 "nodes": [
  {
   "id": "g",
   "label": "Glutamate released",
   "detail": "A burst of activity in the sending neuron releases glutamate."
  },
  {
   "id": "am",
   "label": "AMPA receptors open",
   "detail": "Sodium enters and the receiving cell depolarises."
  },
  {
   "id": "mg",
   "label": "Magnesium block lifts",
   "detail": "Only when the cell is already depolarised does magnesium leave the NMDA channel."
  },
  {
   "id": "nm",
   "label": "NMDA receptors open",
   "detail": "With glutamate bound and the block removed, calcium flows in. Two conditions at once: a coincidence detector."
  },
  {
   "id": "ca",
   "label": "Calcium signals",
   "detail": "Enzymes are activated and more AMPA receptors are inserted into the membrane."
  },
  {
   "id": "st",
   "label": "Stronger synapse",
   "detail": "The same input now produces a bigger response. Late LTP needs new protein synthesis and can last for weeks."
  }
 ],
 "caption": "Hebb's rule in molecules: cells that fire together wire together."
}
:::

### Different circuits for different learning
| Learning | Key structure |
|---|---|
| Eyeblink conditioning (delay) | **Cerebellum** (interpositus nucleus; Richard Thompson) |
| Conditioned fear | **Amygdala** (Joseph LeDoux) |
| Habits and stimulus-response learning | **Basal ganglia** (striatum) |
| Spatial and episodic memory; trace conditioning | **Hippocampus** |
| Reward learning and prediction error | **Dopamine** neurons of the ventral tegmental area and substantia nigra |

:::widget brainmap
{
 "title": "Different circuits for different learning",
 "focus": [
  "cerebellum",
  "amygdala",
  "basal-ganglia",
  "hippocampus",
  "brainstem"
 ],
 "notes": {
  "cerebellum": "Delay eyeblink conditioning and the timing of learned movements.",
  "amygdala": "Conditioned fear.",
  "basal-ganglia": "Habits and stimulus-response learning.",
  "hippocampus": "Spatial learning, episodic memory and trace conditioning.",
  "brainstem": "The midbrain dopamine neurons (ventral tegmental area and substantia nigra) that signal reward prediction error."
 },
 "caption": "Tap each region."
}
:::

### Dopamine and prediction error
Wolfram Schultz recorded dopamine neurons in monkeys (Schultz, Dayan and Montague, 1997). Before learning, they fired when juice arrived **unexpectedly**. After a light reliably predicted juice, they fired to the **light** and **not** to the juice. If the predicted juice was then **withheld**, their firing **dipped** below baseline at the moment it should have come. Dopamine signals **reward prediction error**, the λ − ΣV of the Rescorla-Wagner model, written in neurons.

:::widget compare
{"title": "Dopamine neurons before and after learning", "a": {"label": "Before learning", "points": ["Light appears: no change in firing", "Juice arrives unexpectedly: a burst of firing", "The juice is better than expected"], "summary": "Dopamine bursts at the reward, because the reward was a surprise."}, "b": {"label": "After learning", "points": ["Light appears: a burst of firing", "Juice arrives as predicted: no change", "Juice withheld: firing dips below baseline at the expected time"], "summary": "The burst moves to the earliest reliable predictor. Dopamine signals reward prediction error, not reward itself."}, "caption": "This is the same surprise term as in the Rescorla-Wagner model, found in single cells."}
:::

:::widget guess
{
  "prompt": "After training, a light reliably predicts juice. On a test trial, the light appears but the juice is withheld. What happens to dopamine neuron firing at the moment the juice was expected, as a percentage of normal baseline?",
  "min": 0,
  "max": 200,
  "step": 10,
  "unit": "% of baseline",
  "answer": [0, 60],
  "reveal": "It drops below baseline: a negative prediction error ('worse than expected'). Unexpected reward means a burst; fully predicted reward means no change; omitted reward means a dip. Drugs of abuse cause dopamine surges that the brain cannot 'predict away', one reason they hijack learning."
}
:::

:::clinician
Prediction-error accounts now organise several clinical ideas. Addictive drugs increase dopamine directly, producing a non-diminishing error signal that drives cue learning. Aberrant salience in psychosis is modelled as dysregulated, context-inappropriate dopamine prediction errors. Anhedonia in depression has been linked to blunted reward prediction error signals in the ventral striatum, though findings are mixed. In Parkinson's disease, dopamine depletion impairs learning from positive feedback, while dopaminergic medication can impair learning from negative feedback, offering one explanation for medication-related impulse-control disorders.
:::

:::recall
1. State Hull's formula in words. || Reaction potential equals habit strength times drive (times incentive).
2. Name Guthrie's three methods of breaking a habit. || Threshold, fatigue, incompatible response.
3. What did Kandel show about long-term memory in Aplysia? || It requires new protein synthesis (CREB) and growth of new synapses.
4. Why is the NMDA receptor called a coincidence detector? || It opens only when glutamate binds and the cell is already depolarised.
5. What do dopamine neurons signal, according to Schultz? || Reward prediction error.
:::

:::mcq
Q: Gradually introducing a feared stimulus at intensities too weak to provoke fear is Guthrie's:
- *Threshold method
- Incompatible response method
- Fatigue method
- Extinction method
> Starting below the response threshold and raising slowly.

Q: Dopamine neurons fire to a cue but not to a fully predicted reward. This matches which concept?
- Drive reduction
- Contiguity
- Stimulus sampling
- *Prediction error
> Predicted rewards produce no error; the cue carries the surprise.
:::

## 4.3 Memory as reconstruction: schemas, eyewitnesses and false memory [core][advanced]
### Bartlett: remembering is rebuilding
Frederic Bartlett, in work published in 1932, asked Cambridge students to read a Native American folk tale, **"The War of the Ghosts"**, and retell it repeatedly over months (**repeated reproduction**) or pass it from person to person (**serial reproduction**). The stories became:
- **Shorter**, with odd details dropped.
- **Rationalised**: puzzling supernatural parts explained or omitted.
- **Familiarised**: canoes became boats; seal hunting became fishing.
- **Reorganised** around a central idea, with a moral sometimes added.

:::widget compare
{"title": "What retelling does to a story", "a": {"label": "The original tale", "points": ["Unfamiliar names and places", "Canoes and seal hunting", "Puzzling ghosts and an unexplained death", "No clear moral"], "summary": "A story built on a culture the listeners did not know."}, "b": {"label": "After many retellings", "points": ["Shorter, with odd details dropped", "Canoes become boats, seal hunting becomes fishing", "Supernatural parts explained or left out", "Reorganised around one idea, sometimes with a moral"], "summary": "The story has been rebuilt to fit the listeners' own schemas. Memory stores a gist and fills in the rest."}}
:::

He concluded that memory is **reconstructive**: we store a gist and rebuild details using **schemas**, organised knowledge structures shaped by culture. Later research added **scripts** (schemas for events: what happens at a restaurant, or at a Hindu wedding) and showed that schemas both help (organising) and distort (filling gaps with the typical).

### Eyewitness testimony
Elizabeth Loftus and John Palmer (1974) showed students films of car accidents and asked, "About how fast were the cars going when they **___** each other?", using the verb smashed, collided, bumped, hit or contacted.

:::widget guess
{
  "prompt": "With the verb 'contacted', the average speed estimate was about 32 mph. What was the average estimate when the verb was 'smashed'?",
  "min": 20,
  "max": 60,
  "unit": "mph",
  "answer": [38, 44],
  "reveal": "About 41 mph. A week later, in a second experiment, 32 percent of the 'smashed' group said they had seen broken glass, compared with 14 percent of the 'hit' group and 12 percent of controls. There was no broken glass. The question did not just bias the answer; it seemed to change the memory."
}
:::

The **misinformation effect**: information given after an event becomes part of the memory of it. Factors that affect eyewitness accuracy:
- **Weapon focus**: a visible weapon draws attention from the face (Loftus, Loftus and Messo, 1987).
- **Stress**: very high stress generally impairs face identification, though some central details can be well remembered.
- **Own-race (cross-race) bias**: people identify faces of their own group more accurately (a robust finding across many studies).
- **Confidence**: confidence at the **initial**, fair identification is fairly informative; confidence that grows later, after feedback ("Good, you picked our suspect"), is not.
- **Line-up procedures**: double-blind administration, fair fillers, a warning that the culprit may not be present, and recording confidence immediately all reduce errors.

Real life is sometimes kinder: Yuille and Cutshall (1986) found that witnesses to a real shooting in Canada gave accurate accounts months later and resisted misleading questions. But in the United States, mistaken eyewitness identification played a part in about 70 percent of convictions later overturned by DNA evidence.

:::example Eyewitness memory in Indian courts
Indian police use **test identification parades**, conducted under a magistrate's supervision. Indian courts treat such identification as corroborative rather than substantive evidence, and give it less weight if the witness had seen the accused (in the media, a photograph or the police station) before the parade, a legal recognition of the misinformation effect. Delays of months between the event and the parade, common in practice, also weaken accuracy.
:::

### The cognitive interview
Ronald Fisher and Edward Geiselman (1992) built an interview from memory research:
1. **Report everything**, even details that seem trivial.
2. **Reinstate the context**: mentally return to the scene, the weather, your feelings.
3. **Recall in different orders**, for example backwards from the end.
4. **Change perspective**: describe it as another witness would have seen it.
The **enhanced cognitive interview** adds rapport, witness-led pacing and open questions. Meta-analyses show substantially more correct details, with a small rise in errors.

### False memories
- **Lost in the mall** (Loftus and Pickrell, 1995): adults were given three true childhood stories from relatives and one false one (being lost in a shopping mall). About a quarter came to remember the false event, at least partly.
- **Doctored photographs** (Wade and colleagues, 2002): about half of participants "remembered" a childhood hot-air balloon ride after seeing a faked photograph.
- **The DRM paradigm** (Deese, 1959; Roediger and McDermott, 1995): after hearing bed, rest, awake, tired, dream, snooze, blanket, doze, people very often recall or confidently recognise the unheard word **"sleep"**.

:::widget reveal
{
  "prompt": "Why do DRM false memories matter for clinical work, and what do they tell us about the confidence of a memory?",
  "answer": "They show that a vivid, confident memory can be of something that never happened, simply because it fits the theme of what did. Confidence and vividness are therefore poor guides to accuracy, especially after suggestion, repetition or imagination. Therapists who use leading questions, guided imagery or hypnosis to 'recover' memories risk creating false ones."
}
:::

### Flashbulb memories
Roger Brown and James Kulik (1977) coined **flashbulb memory** for vivid, detailed memories of where people were when they heard shocking news (the assassination of President Kennedy). Later studies tested people soon after an event and again years later. After the Challenger space shuttle disaster (Neisser and Harsch, 1992) and the attacks of 11 September 2001 (Talarico and Rubin, 2003), memories **changed as much as ordinary memories**, but people's **confidence stayed high**. Flashbulb memories feel special, but they are not more accurate.

:::recall
1. Name three changes Bartlett found in reproductions of "The War of the Ghosts". || Shortening, rationalisation, familiarisation (also reorganisation around a theme).
2. What did Loftus and Palmer's second experiment show? || The word "smashed" led more people to falsely remember broken glass a week later.
3. List the four original techniques of the cognitive interview. || Report everything, reinstate context, change order, change perspective.
4. What is the DRM paradigm? || A list of words related to an unpresented lure produces false recall and recognition of the lure.
5. What did follow-up studies show about flashbulb memories? || They change over time like ordinary memories, while confidence stays high.
:::

:::mcq
Q: Witnesses asked how fast cars "smashed" into each other later falsely reported broken glass. This is best explained by:
- Weapon focus
- Encoding specificity
- *The misinformation effect
- The own-race bias
> Post-event information was integrated into the memory.

Q: A witness confidently identifies a suspect, but only after police said "Good, that's our man" at a previous viewing. The confidence is:
- *Weak evidence, because the feedback inflated it
- Strong evidence that the identification is accurate
- Irrelevant in every case, so it should be ignored
- A sign of a flashbulb memory, which is reliable
> Initial confidence in a fair procedure is informative; inflated later confidence is not.
:::

## 4.4 The biology of memory and the amnesias [core][advanced]
### H. M.: the case that changed memory science
In 1953, William Scoville removed most of the medial temporal lobes on both sides (including much of the hippocampus and amygdala) of Henry Molaison, 27, to stop severe epilepsy. Seizures improved, but H. M. was left with:
- Dense **anterograde amnesia**: he could not form new **declarative** memories. He read the same magazine as if new; he met Brenda Milner, who tested him for decades, as a stranger each time.
- **Temporally graded retrograde amnesia**: memories from the years just before surgery were lost; much older memories were largely preserved.
- **Intact short-term memory** (normal digit span), intelligence and personality.
- **Intact procedural learning**: in **mirror drawing** (Milner, 1962), he improved over days while having no memory of having practised. Priming was also preserved.
H. M. showed that the hippocampus and nearby cortex are needed to **form** lasting declarative memories, but not to store old ones or to learn skills.

:::widget timeline
{"prompt": "Order the key moments in the case of H. M., Henry Molaison.", "events": [{"label": "Severe epilepsy begins and medicines fail to control it", "when": "Childhood"}, {"label": "Both medial temporal lobes are removed to stop the seizures", "when": "1953"}, {"label": "Scoville and Milner report his dense anterograde amnesia", "when": "1957"}, {"label": "Milner shows he improves at mirror drawing without remembering practising", "when": "1962"}, {"label": "He dies, and his brain is sliced and studied in fine detail", "when": "2008"}], "why": "Surgery first, then the discovery of amnesia, then the finding that skill learning was spared. That last finding split memory into declarative and procedural systems."}
:::

:::widget brainmap
{
 "title": "Where damage causes amnesia",
 "focus": [
  "hippocampus",
  "thalamus",
  "hypothalamus",
  "prefrontal"
 ],
 "notes": {
  "hippocampus": "Medial temporal lobe: H. M. after surgery, Clive Wearing after encephalitis, early Alzheimer's disease.",
  "thalamus": "Medial thalamus: damaged in Korsakoff syndrome and some strokes.",
  "hypothalamus": "The mammillary bodies on its underside: shrunken in Korsakoff syndrome.",
  "prefrontal": "Frontal damage adds confabulation, poor source memory and disorganised retrieval."
 },
 "caption": "Tap each region to link it to the amnesias in the table below."
}
:::

### Consolidation and reconsolidation
- **Systems consolidation**: over months to years, memories become less dependent on the hippocampus and more on the neocortex (the standard model), which explains temporally graded retrograde amnesia. **Multiple trace theory** (Nadel and Moscovitch) argues that vivid episodic detail always needs the hippocampus.
- **Sleep**: slow-wave sleep supports the replay and transfer of declarative memories; REM sleep has been linked to procedural and emotional memory.
- **Reconsolidation** (Nader, Schafe and LeDoux, 2000): when a consolidated memory is **reactivated**, it becomes briefly unstable and must be stored again, so it can be weakened or updated in that window. Trials have tested propranolol with reactivation for PTSD, with mixed results.

:::widget flow
{"title": "The reconsolidation loop", "layout": "cycle", "nodes": [{"id": "a", "label": "Consolidated, stable memory", "detail": "After learning, protein synthesis and, over longer periods, hippocampus to cortex transfer make the memory resistant to disruption. Before that, a head injury, a seizure, ECT or alcohol can wipe it."}, {"id": "b", "label": "Reactivated by a reminder", "detail": "Recalling the memory, or meeting a strong cue, brings it back into an active state."}, {"id": "c", "label": "Unstable for a short window", "detail": "In this window the memory can be updated, strengthened or weakened, for example by new safety learning, or by propranolol in research trials."}, {"id": "d", "label": "Stored again, perhaps changed", "detail": "The memory is re-saved, including whatever happened during the window. It is now the updated version that will be recalled next time."}], "edgeLabels": {"a>b": "retrieval", "b>c": "becomes labile", "c>d": "reconsolidation", "d>a": "stable again"}, "caption": "Each time we recall a memory, we may store a slightly changed version of it. This is one reason memory is reconstructive."}
:::

### The amnesias
| Condition | Cause | Pattern |
|---|---|---|
| **Medial temporal lobe amnesia** | Surgery (H. M.), herpes simplex encephalitis (Clive Wearing, a British musician, 1985), anoxia | Severe anterograde, variable retrograde; skills spared. Clive Wearing could still play the piano and conduct |
| **Korsakoff syndrome** | **Thiamine (vitamin B1) deficiency**, usually with chronic alcohol use; damage to mammillary bodies and medial thalamus | Anterograde and temporally graded retrograde amnesia, **confabulation** (fluent, false memories, without intent to deceive), apathy; often follows **Wernicke's encephalopathy** (confusion, ataxia, eye-movement problems) |
| **Transient global amnesia** | Unclear (venous congestion has been proposed); often after exertion, cold water or emotion, in people over 50 | Sudden anterograde amnesia lasting hours; repetitive questioning; full recovery; a gap for the episode |
| **Post-traumatic amnesia** | Head injury | Confusion and inability to form new memories after the injury; its **duration** predicts outcome |
| **Alzheimer's disease** | Neurodegeneration beginning in the entorhinal cortex and hippocampus | Rapid forgetting of new information first; semantic and other losses later; procedural memory spared until late |
| **Dissociative amnesia** | Psychological, usually after severe stress or trauma | Inability to recall important autobiographical information, often of the traumatic event; may include **dissociative fugue** (travel with loss of identity); new learning usually intact |

:::widget sort
{
  "prompt": "Anterograde or retrograde? Sort each memory problem.",
  "buckets": ["Anterograde (new learning after the event)", "Retrograde (memories from before the event)"],
  "items": [
    { "text": "After a head injury, a cricketer cannot remember the overs bowled before he was hit", "bucket": 1 },
    { "text": "H. M. reads the same magazine every day as if it were new", "bucket": 0 },
    { "text": "After a course of ECT, a woman has gaps for the weeks around her admission", "bucket": 1 },
    { "text": "A patient with transient global amnesia asks the same question every few minutes", "bucket": 0 },
    { "text": "A man after encephalitis cannot recall his wedding or the births of his children", "bucket": 1 },
    { "text": "A student who took a sleeping tablet cannot remember the conversation she had an hour later", "bucket": 0 }
  ]
}
:::

:::widget build
{
  "vignette": "Mr Fernandes, 48, from Goa, with a long history of heavy drinking, is admitted after a fall. He is alert. He cannot remember the doctor he met ten minutes ago, but chats fluently about 'meeting friends at the market this morning', though he has been in hospital for three days. His digit span is normal. He recalls his school days and the names of his siblings well. He walks steadily, and his eye movements are now normal after thiamine was given in the emergency room.",
  "rule": "Tick the features of Korsakoff syndrome present in the story. A typical picture needs at least four of these, including anterograde amnesia.",
  "symptoms": [
    { "label": "Anterograde amnesia (cannot retain new information)", "present": true, "core": true },
    { "label": "Confabulation", "present": true, "why": "His 'market this morning' story is a fluent false memory, offered without intent to deceive." },
    { "label": "Relatively preserved remote memories", "present": true, "why": "Retrograde loss is temporally graded; school days and family are preserved." },
    { "label": "Normal immediate (short-term) memory", "present": true, "why": "Digit span is typically normal in Korsakoff syndrome." },
    { "label": "History of heavy alcohol use or other cause of thiamine deficiency", "present": true },
    { "label": "Severe loss of general intelligence", "present": false, "why": "Intellect is relatively preserved; that helps separate Korsakoff from a global dementia." },
    { "label": "Current ataxia and eye-movement paralysis", "present": false, "why": "These are features of the acute Wernicke stage, here treated with thiamine." }
  ],
  "need": 4,
  "needCore": true,
  "verdict": "This is a Korsakoff picture: dense anterograde amnesia with confabulation, normal immediate memory and preserved remote memories, after thiamine deficiency linked to alcohol. Give thiamine early and generously to anyone at risk, because Wernicke's encephalopathy is a medical emergency and Korsakoff syndrome often does not fully recover."
}
:::

:::recall
1. What was H. M.'s memory profile? || Dense anterograde amnesia, temporally graded retrograde amnesia, normal short-term memory, intact procedural learning and priming.
2. What is reconsolidation? || A reactivated memory becomes briefly unstable and must be re-stored, so it can be modified.
3. What causes Korsakoff syndrome, and what is its hallmark? || Thiamine deficiency, usually with alcohol use; anterograde amnesia with confabulation.
4. What is transient global amnesia? || A sudden episode of anterograde amnesia lasting hours, with full recovery.
5. What memory is lost first in Alzheimer's disease? || Recent episodic memory (rapid forgetting of new information).
:::

:::mcq
Q: Clive Wearing, after herpes encephalitis, could not remember events from minutes before, yet could still play the piano expertly. This shows the sparing of:
- Episodic memory
- *Procedural memory
- Semantic memory for recent events
- Short-term memory only
> Skills are procedural and do not depend on the damaged medial temporal lobes.

Q: The temporal gradient of retrograde amnesia (older memories spared) is best explained by:
- Proactive interference from older memories
- *Systems consolidation over time
- Levels of processing at the time of encoding
- Encoding specificity and missing retrieval cues
> Over time, memories come to rely on neocortex.
:::

## 4.5 Learning and memory in the clinic [core][advanced]
### Learning models of psychological problems
| Problem | Learning account | Treatment that follows |
|---|---|---|
| **Specific phobia, panic** | Fear conditioning, preparedness, two-factor avoidance; interoceptive conditioning in panic (bodily sensations become CSs) | Exposure, with inhibitory learning principles |
| **OCD** | Rituals and avoidance negatively reinforced by anxiety relief | Exposure and response prevention |
| **PTSD** | Conditioned fear to trauma cues, generalisation, avoidance; poorly contextualised trauma memories | Trauma-focused CBT, prolonged exposure, EMDR |
| **Depression** | Learned helplessness and hopelessness; loss of response-contingent reinforcement (Lewinsohn) | Behavioural activation; cognitive therapy |
| **Addiction** | Drug as reinforcer (positive and negative); cue-induced craving; conditioned tolerance | Contingency management, cue exposure, relapse prevention |
| **Habit disorders and tics** | Behaviour maintained by automatic reinforcement or tension relief | Habit reversal training |

### Conditioned drug tolerance
Shepard Siegel proposed that drug cues (the room, the syringe, the ritual) come to trigger a **compensatory response** that opposes the drug's effect. Tolerance is partly tied to **context**. Siegel and colleagues (1982) gave rats increasing doses of heroin in one room, then a large dose either in the same room or in a new one.

:::widget guess
{
  "prompt": "Siegel's rats were given a high dose of heroin after tolerance had been built in one setting. In the same setting, about 32 percent died. What percentage died when the dose was given in a different, unfamiliar setting?",
  "min": 0,
  "max": 100,
  "step": 2,
  "unit": "%",
  "answer": [58, 70],
  "reveal": "About 64 percent, double the rate. Without the usual cues, the compensatory response did not kick in. Reports from people who survived overdoses suggest the same: many overdoses happen in unfamiliar places or with an unusual routine. This is why harm-reduction advice includes taking extra care in new settings or after a break in use."
}
:::

:::widget receptor
{
 "receptor": "mu-opioid",
 "title": "Medicines that change the reward signal in addiction",
 "caption": "Try each ligand. A full agonist (heroin, morphine) gives the full signal, the strongest reinforcer. A partial agonist (buprenorphine) gives a capped signal that reduces craving and withdrawal with less euphoria. An antagonist (naltrexone) blocks the receptor, so using the drug brings no reward and the learned link between using and reward can extinguish."
}
:::

### Exposure as inhibitory learning
Michelle Craske and colleagues reframed exposure therapy using extinction research: exposure does not erase fear; it builds a **new, competing "safe" memory** that must win retrieval. To strengthen it:
- **Expectancy violation**: design exposures to test a specific feared prediction ("If I stay in the lift for 10 minutes, I will faint") and let it be disconfirmed.
- **Remove safety behaviours** (carrying a water bottle, holding a rail), which stop the person from learning that they are safe.
- **Vary contexts and stimuli** to reduce renewal.
- **Occasional reinforced extinction** and **retrieval cues** (a small reminder from therapy) for relapse prevention.

:::widget compare
{"title": "Two ways of thinking about exposure", "a": {"label": "Habituation view", "points": ["Aim: make fear fall within each session", "Stay until anxiety drops by half", "Safety behaviours tolerated if they help", "One setting, one feared object"], "summary": "Older view: exposure works by wearing the fear down."}, "b": {"label": "Inhibitory learning view", "points": ["Aim: break a specific feared prediction", "Length set by what needs to be tested", "Safety behaviours removed", "Many settings, many versions of the feared object"], "summary": "Current view: exposure builds a new safety memory that must compete with the fear memory, so make it strong and general."}, "caption": "Fear falling during a session predicts long-term outcome less well than people once thought."}
:::

### Memory in psychiatric disorders
- **Depression**: **mood-congruent** recall; **overgeneral autobiographical memory** (Mark Williams), in which people asked for a specific memory to a cue ("happy") give general summaries ("I used to be happy at college") rather than specific events. It predicts a poorer course and is targeted by **memory specificity training**. Concentration and memory complaints in older depressed adults can mimic dementia ("depressive pseudodementia"); improvement with treatment helps tell them apart, but such patients carry a higher later risk of dementia.
- **PTSD**: involuntary, vivid, sensory **intrusive memories** with a sense of "now-ness", alongside a fragmented, poorly organised narrative of the trauma. Brewin's **dual representation theory** separates sensory-bound and contextual memory systems. Trauma-focused therapies work partly by putting the memory in its context (time, place, meaning).
- **Dissociative amnesia**: real and recognised in DSM-5-TR and ICD-11, usually for a circumscribed period around trauma.
- **The "memory wars"**: in the 1990s, many adults "recovered" memories of childhood abuse during therapy, sometimes after hypnosis, guided imagery or suggestive questioning. Research on false memory showed such techniques can create false memories, while abuse is common and often remembered continuously. Professional guidance (for example, from the British Psychological Society and the American Psychological Association) says both that genuine abuse memories can be forgotten and later remembered, and that therapists must **not** use suggestive techniques to search for "hidden" memories.

:::widget decide
{
  "scene": "A counsellor in Hyderabad tells you that her client, Neha, 30, has depression and “unexplained” anxiety. The counsellor believes Neha must have been abused as a child, and plans to use guided imagery and hypnosis to “help her recover the memories”. Neha has no memory of abuse.",
  "ask": "What do you advise?",
  "choices": [
    { "label": "Go ahead; recovered memories are a sign of healing", "verdict": "harm", "outcome": "Neha develops vivid images of abuse by an uncle, breaks contact with her family, and her depression worsens. Years later she is unsure whether any of it happened.", "why": "Hypnosis and guided imagery inflate confidence and can create detailed false memories. A therapist's belief plus suggestive techniques is the classic recipe for false memory." },
    { "label": "Treat the depression and anxiety she actually has, assess risk, ask open, non-leading questions about her history, and respond carefully if she discloses anything, without searching for memories she does not report", "verdict": "best", "outcome": "Neha improves with evidence-based treatment. If she ever discloses abuse, it can be taken seriously without having been planted.", "why": "This follows professional guidance: take disclosures seriously and support survivors, but avoid techniques that create memories. Treat the presenting problems, which do not need a hidden cause to be real." },
    { "label": "Tell Neha that abuse is unlikely and she should stop thinking about her past", "verdict": "ok", "outcome": "Neha feels her history is being dismissed and is less likely to share anything important later.", "why": "Neither assuming abuse nor ruling it out is right. Stay open, curious and non-leading." }
  ]
}
:::

:::widget flow
{
 "title": "How memory keeps depression going",
 "layout": "cycle",
 "nodes": [
  {
   "id": "lm",
   "label": "Low mood",
   "detail": "Sadness, tiredness, hopelessness."
  },
  {
   "id": "mc",
   "label": "Mood-congruent recall",
   "detail": "Sad memories come to mind more easily; happy ones feel distant."
  },
  {
   "id": "og",
   "label": "Overgeneral memories",
   "detail": "Memories are general summaries ('I always fail') rather than specific events, which makes problem solving harder."
  },
  {
   "id": "ru",
   "label": "Rumination",
   "detail": "Abstract 'why me?' thinking keeps rehearsing the negative material."
  },
  {
   "id": "dm",
   "label": "Deeper low mood",
   "detail": "The cycle tightens."
  }
 ],
 "caption": "Behavioural activation, memory specificity training and work on rumination each break the loop at a different point."
}
:::

### Memory effects of treatments
- **ECT**: temporary confusion after each session; **anterograde** difficulties that usually recover within weeks of the course ending; some **retrograde** loss for events around the treatment period, which can be lasting. Right unilateral, brief or ultrabrief pulse ECT reduces these effects.
- **Benzodiazepines and alcohol**: anterograde amnesia ("blackouts"); benzodiazepines impair new learning, which may interfere with exposure therapy.
- **Anticholinergic medicines** (including some older antidepressants and medicines for urinary problems): impair memory, especially in older adults, and add to dementia risk with long use.

### Assessing memory
- **Bedside**: orientation, registration and delayed recall of three or five words (MMSE, MoCA, ACE-III), and remote memory questions.
- **Batteries**: the **Wechsler Memory Scale** (WMS-IV); the Indian **PGI Memory Scale** (Pershad and Wig), with ten subtests covering remote and recent memory, mental balance, attention, immediate and delayed recall, verbal retention for similar and dissimilar pairs, visual retention and recognition; the **Rey Auditory Verbal Learning Test** and **Rey Complex Figure Test**, both included in Indian neuropsychological batteries such as the NIMHANS battery.
- **Interpretation**: compare **learning** (does the score rise over trials?), **retention** (is it kept after a delay?) and **retrieval** (does recognition help more than recall?). A big gap between poor free recall and good recognition suggests a **retrieval** problem (common in subcortical conditions and depression); poor recall **and** recognition suggests a **storage** problem (typical of hippocampal damage and Alzheimer's disease).

:::clinician
Education, language and literacy strongly affect memory test scores in India: word lists and story recall must use culturally familiar items and appropriate norms, and illiterate older adults can be misclassified as impaired on tests normed on educated samples. Tools adapted and normed for Indian populations (for example, Hindi and regional-language versions of the ACE-III and the battery developed for the Longitudinal Ageing Study in India) are preferable where available. In functional (non-organic) memory complaints, performance-validity measures and the pattern of inconsistency across tests matter more than any single score.
:::

:::recall
1. Explain conditioned drug tolerance. || Drug-related cues trigger a compensatory response that opposes the drug effect, so tolerance is partly context-specific.
2. Name three principles of exposure as inhibitory learning. || Expectancy violation, removing safety behaviours, varying contexts (also retrieval cues and occasional reinforced extinction).
3. What is overgeneral autobiographical memory? || Recalling general summaries instead of specific events, typical of depression.
4. What memory effects does ECT cause? || Temporary confusion, anterograde difficulties that recover in weeks, some lasting retrograde loss around the treatment period.
5. What does poor recall with good recognition suggest? || A retrieval problem rather than a storage problem.
:::

:::mcq
Q: A depressed man is asked to recall a specific memory to the cue "happy" and replies, "I was happy when I was in school." This illustrates:
- *Overgeneral autobiographical memory
- Retroactive interference from recent events
- Mood-congruent recall of happy events
- Confabulation to fill a gap in memory
> He gives a general summary, not a specific event.

Q: A patient scores poorly on free recall of a word list, but recognises almost all the words when shown them. This pattern suggests:
- A storage problem typical of hippocampal damage
- Normal ageing only
- Malingering in every case
- *A retrieval problem rather than a failure to store
> Recognition supplies the cues that recall lacks, pointing to retrieval difficulty.
:::

# Part V · Exam zone

## 5.1 Q&A bank · Starting [starting]
Think each question through, then open the answer and compare.

:::qa What is the difference between classical and operant conditioning? [starting]
### Short answer
In classical conditioning, a learner links two **stimuli**, so a signal comes to trigger a response. In operant conditioning, a learner links a **behaviour** with its **consequence**, so the behaviour becomes more or less likely.

| | Classical | Operant |
|---|---|---|
| What is linked | Stimulus and stimulus (bell and food) | Behaviour and consequence (lever press and food) |
| Learner's role | Passive: the events happen whatever it does | Active: what happens depends on what it does |
| Responses involved | Mostly reflexive and emotional (salivation, fear, nausea) | Mostly voluntary (pressing, studying, asking) |
| Key names | Pavlov, Watson | Thorndike, Skinner |
| Everyday example | Feeling anxious at the smell of a hospital | Studying harder after praise for good marks |

### They often work together
A child bitten by a dog learns to fear dogs (classical) and then avoids them because avoiding brings relief (operant). This combination is Mowrer's two-factor theory.
:::

:::qa Explain positive reinforcement, negative reinforcement, positive punishment and negative punishment with one example each. [starting]
### Short answer
Reinforcement always **increases** a behaviour; punishment always **decreases** it. "Positive" means something is **added**; "negative" means something is **removed**.

| | Something added | Something removed |
|---|---|---|
| Behaviour increases | **Positive reinforcement**: a child gets a sticker for reading, and reads more | **Negative reinforcement**: you take an antacid, the burning stops, and you take it sooner next time |
| Behaviour decreases | **Positive punishment**: a driver is fined for speeding and slows down | **Negative punishment**: a teenager loses phone time for lying and lies less |

### The common mistake
Negative reinforcement is not punishment. If the behaviour goes **up**, it is reinforcement, whatever was added or taken away.
:::

:::qa Why is extinction not the same as forgetting? [starting]
### Short answer
Extinction is **new learning** that the signal no longer predicts the outcome. The original learning is still there, suppressed, and can return.

### Evidence
1. **Spontaneous recovery**: after a rest, the extinguished response comes back.
2. Faster relearning when the pairing is restored.
3. At the Beginner level you will meet renewal and reinstatement, which show the same thing.

### Why it matters
A fear that seems "cured" by exposure can come back in a new place or after a scare. Relapse prevention plans for this rather than treating it as failure.
:::

:::qa Describe the three stages of memory processing and how failure at each looks in daily life. [starting]
### Short answer
Memory involves **encoding** (getting information in), **storage** (keeping it) and **retrieval** (getting it out). Forgetting can happen at any stage.

| Stage | What it means | Everyday failure |
|---|---|---|
| Encoding | Turning information into a usable form | You never really heard the name of the person introduced at a wedding, because you were looking at the food |
| Storage | Keeping it over time | Details of last year's lecture have faded or been overwritten by newer material |
| Retrieval | Bringing it back when needed | A name is "on the tip of your tongue"; it comes back later when a cue appears |

### Study tip
Better encoding (meaning, examples, self-testing) and better retrieval cues (practising in exam-like conditions) prevent most exam-day forgetting.
:::

:::qa Why does self-testing work better than rereading? [starting]
### Short answer
Retrieving information strengthens the memory and shows you what you really know. Rereading only makes material feel familiar.

### What happens
- **Retrieval strengthens traces**: each successful recall makes the next one easier (the testing effect).
- **Rereading builds fluency**, a feeling of ease that is mistaken for learning.
- **Testing reveals gaps**, so you know what to study next.

### The evidence
Students who reread a passage did slightly better five minutes later, but students who tested themselves recalled about half as much again a week later, even though they felt less confident.

### How to use it
Close the book and write what you remember, answer questions a day later, use flashcards, and spread these sessions over days.
:::

:::qa Define learning. Why are maturation, fatigue and drug effects excluded? [starting]
### Short answer
Learning is a relatively permanent change in behaviour, or in the capacity for behaviour, that results from experience.

### Why the exclusions
| Change | Why it is not learning |
|---|---|
| Maturation (a baby starts walking) | Driven by the body's growth, appearing on schedule with little practice |
| Fatigue (slower reactions late in a match) | Temporary; disappears with rest |
| Drugs or illness (talkative after alcohol) | Temporary state change, not from experience with the task |
| Injury | Change caused by damage, not by experience |

### Learning versus performance
Learning can be present without being shown, as when rats explored a maze without food and only revealed what they had learned once food appeared.
:::

:::qa Describe Pavlov's experiment and name the five key terms. [starting]
### The experiment
Pavlov measured dogs' saliva. A metronome or bell sounded just before food was placed in the dog's mouth. After several pairings, the sound alone produced salivation.

| Term | In Pavlov's study |
|---|---|
| Unconditioned stimulus (UCS) | Food |
| Unconditioned response (UCR) | Salivation to food |
| Neutral stimulus (NS) | Bell before training |
| Conditioned stimulus (CS) | Bell after training |
| Conditioned response (CR) | Salivation to the bell |

### Why it mattered
It gave psychology an objective, measurable way to study learning and became the basis of behaviourism.
:::

:::qa What is stimulus generalisation, and how does discrimination develop? Give a clinical example. [starting]
### Short answer
Generalisation is responding to stimuli similar to the conditioned stimulus. Discrimination is learning to respond only to the CS, because similar stimuli are never followed by the UCS.

### Example
After being bitten by a large black dog, a child fears all dogs (generalisation). With repeated safe experiences with small, friendly dogs, she learns that only some dogs are dangerous (discrimination).

### Clinical link
In anxiety disorders, fear often generalises too widely: after an accident on one road, a person fears all driving. Exposure therapy uses graded, varied situations to build discrimination between real and imagined danger.
:::

:::qa Describe Thorndike's puzzle-box experiment and state the law of effect. [starting]
### The experiment
Hungry cats were placed in boxes that opened when they pulled a loop or pressed a lever. Food waited outside. At first, cats tried many actions at random. Over trials, the useless actions dropped out and escape time fell gradually.

### The law of effect
Responses followed by satisfying consequences become more likely; responses followed by discomfort become less likely.

### Significance
- Showed **trial-and-error** learning, not sudden insight.
- Laid the foundation for Skinner's operant conditioning.
- Introduced the idea that consequences shape behaviour.
:::

:::qa What is shaping? Describe how you would shape a child with autism to say "water". [starting]
### Short answer
Shaping is reinforcing successive approximations to a target behaviour until the full behaviour appears.

### Steps
1. Reinforce any vocal sound when the child wants water (eye contact plus a sound gets a sip).
2. Then reinforce only sounds starting with "w" or "p" (for "pani").
3. Then only "wa" or "pa".
4. Then the whole word.
5. Gradually fade prompts and reinforce the word in different settings.

### Principles
- Reinforce immediately.
- Move to the next step only when the current one is reliable.
- If the child struggles, go back a step.
:::

:::qa What are the main features of sensory, short-term and long-term memory? [starting]
| Store | Duration | Capacity | Coding |
|---|---|---|---|
| Sensory | Under a second (visual) to a few seconds (auditory) | Large | Raw sensory form |
| Short-term | About 15 to 30 seconds without rehearsal | About seven items, or about four chunks | Mainly acoustic |
| Long-term | Minutes to a lifetime | Effectively unlimited | Mainly meaning |

### How information moves
Attention moves information from sensory memory into short-term memory; rehearsal and meaningful processing move it into long-term memory; retrieval brings it back.
:::

:::qa What is chunking? How does it help memory? [starting]
### Short answer
Chunking is grouping separate items into larger meaningful units, so that short-term memory holds more.

### Examples
- 9825014376 is hard; 98250 14376 is easier.
- IGNOUNCERTCBSE is hard; IGNOU, NCERT, CBSE is easy.
- A chess master sees whole patterns, not single pieces.

### Why it works
Short-term memory holds a limited number of **units**, not of individual items. Meaningful units use long-term knowledge to pack more into each slot.

### Study use
Group facts into meaningful clusters, use acronyms and tables, and link new ideas to familiar ones.
:::

:::qa Describe Ebbinghaus's forgetting curve. What practical lessons does it teach? [starting]
### The curve
Ebbinghaus learned nonsense syllables and measured savings when relearning. He lost over 40 percent within 20 minutes, over half within an hour, and about two-thirds within a day; after that, forgetting slowed and about a fifth remained after a month.

### Lessons
1. Forgetting is fastest soon after learning, so the first review should come early.
2. Each review flattens the curve; space later reviews further apart.
3. Meaningful material is forgotten more slowly than nonsense.
4. Overlearning (practice beyond the first perfect recall) slows forgetting.

### A study plan
Review the same day, then after a day, a few days and a week, testing yourself each time.
:::

:::qa What is the difference between recall, recognition and relearning? Which is most sensitive? [starting]
| Measure | Task | Example | Difficulty |
|---|---|---|---|
| Recall | Produce the information with few cues | Write the four schedules of reinforcement | Hardest |
| Recognition | Identify it among options | Choose "variable ratio" in an MCQ | Easier |
| Relearning (savings) | Learn it again and measure time saved | Relearning a poem you once knew | Most sensitive |

### Why relearning is most sensitive
Even when nothing can be recalled or recognised, material is often relearnt faster, showing that some trace remained. Ebbinghaus used this savings method.
:::

## 5.2 Q&A bank · Beginner [beginner]
Answers here assume the Beginner sections. Write your own outline first.

:::qa Explain the four basic schedules of reinforcement with their response patterns and examples. Why is the variable-ratio schedule so powerful? [beginner]
### Short answer
Ratio schedules reward after a number of responses; interval schedules reward the first response after a time. Each can be fixed or variable, giving four schedules with distinct patterns.

| Schedule | Rule | Pattern | Example |
|---|---|---|---|
| Fixed ratio | Every nth response | High rate, pause after each reward | Piece-rate stitching paid per 50 shirts |
| Variable ratio | After an unpredictable number | Highest, steady, no pauses | Lottery, betting apps, refreshing a feed |
| Fixed interval | First response after a fixed time | Scallop: slow, then faster near the time | Studying just before fixed exams |
| Variable interval | First response after an unpredictable time | Moderate, steady | Checking for a reply message |

### Why variable ratio is powerful
1. Faster responding brings rewards sooner, so rates are high.
2. The next reward might always be one response away, so there is no reason to pause.
3. Long runs without reward are normal, so extinction is hard to detect: the strongest partial reinforcement extinction effect.
4. This is why gambling and some app designs are so persistent.
:::

:::qa Explain Mowrer's two-factor theory and its importance for understanding phobias and OCD. [beginner]
### Short answer
Fear is first learned by **classical conditioning**; then avoiding the feared cue is maintained by **negative reinforcement** (relief). Because avoidance prevents exposure, the fear never extinguishes.

### The two factors
1. **Classical**: a cue (a dog, a lift, contamination) is paired with fear or harm.
2. **Operant**: avoidance or rituals remove the anxiety, so they are reinforced.

### Applied to disorders
| Disorder | Feared cue | Avoidance or ritual |
|---|---|---|
| Specific phobia | Dogs, heights, injections | Avoiding the situation |
| Panic disorder | Body sensations, crowded places | Avoiding exertion, carrying safety items |
| OCD | Contamination, intrusive thoughts | Washing, checking, seeking reassurance |

### Treatment that follows
Exposure (and in OCD, exposure with response prevention) blocks the avoidance so the person can learn the feared outcome does not occur.

### Critique
Many people with phobias recall no conditioning event; preparedness and observational and informational learning (seeing or being told about danger) also create fears.
:::

:::qa Evaluate Bandura's Bobo doll studies. What did they show, and what are their limitations? [beginner]
### Short answer
They showed that children learn new aggressive acts simply by watching a model, and that seeing consequences affects whether they perform, rather than whether they learn.

### Findings
1. Children who watched an adult attack a Bobo doll copied specific, novel acts; those who saw a calm model rarely did.
2. Filmed and cartoon models also produced imitation.
3. When the model was punished, children copied less, but when offered rewards, all groups copied equally: the **learning-performance distinction**.

### Strengths
- Controlled experiments with clear behavioural measures.
- Challenged the idea that all learning needs direct reinforcement.
- Led to social cognitive theory and self-efficacy.

### Limitations
- Hitting a doll designed to be hit may not be real aggression.
- Short-term effects only; artificial setting; possible demand characteristics.
- Ethical concerns about teaching young children aggression.

### Applications
Media influence, parenting, modelling in therapy (participant modelling), and Indian entertainment-education serials that model healthy behaviour.
:::

:::qa Compare the multi-store model and the working memory model of memory. [beginner]
### Short answer
The multi-store model describes a sequence of three stores. The working memory model replaces the single short-term store with several interacting parts that hold and manipulate information while we think.

| | Multi-store (Atkinson and Shiffrin) | Working memory (Baddeley and Hitch) |
|---|---|---|
| Short-term memory | One store, about seven items | Several parts: central executive, phonological loop, visuospatial sketchpad, episodic buffer |
| Main function | A waiting room on the way to long-term memory | A mental workspace for reasoning, reading and calculating |
| Key evidence | Serial position curve; H. M. and K. F.; coding differences | Dual-task studies; word length effect; articulatory suppression |
| Weakness | Too simple; overstates the role of rehearsal | The central executive is vaguely defined |

### Why working memory is preferred today
- K. F. had poor verbal short-term memory but normal visual memory, which one store cannot explain.
- Two tasks interfere only if they use the same component (two verbal tasks interfere; a verbal and a spatial task interfere less).
:::

:::qa What are proactive and retroactive interference? Describe the evidence and practical implications. [beginner]
### Short answer
Proactive interference is old learning disrupting new learning; retroactive interference is new learning disrupting old learning. Both are greatest when the materials are similar.

### Evidence
- **Underwood**: the more lists people had learned before, the more they forgot a new list.
- **Keppel and Underwood**: in short-term memory tasks, little forgetting on the first trial, more on later trials, pointing to proactive interference rather than decay.
- **Jenkins and Dallenbach**: recall was better after sleep than after the same time awake, so what happens in the interval matters.

### Practical implications
| Situation | Advice |
|---|---|
| Revising similar topics (two theories of attention) | Study them apart in time, but test them together to learn the differences |
| Learning look-alike drug names | Use distinctive cues and contrast tables |
| After learning, before an exam | Sleep, and avoid cramming similar new material |
:::

:::qa Explain the four temporal arrangements of classical conditioning and their relative effectiveness. [beginner]
| Arrangement | Timing | Effectiveness | Note |
|---|---|---|---|
| Delay | CS starts first and overlaps the UCS | Best | The CS clearly predicts the UCS |
| Trace | CS ends, a gap, then the UCS | Good with short gaps | Needs the hippocampus to bridge the gap |
| Simultaneous | CS and UCS start together | Weak | The CS predicts nothing new |
| Backward | UCS before CS | Weakest | The CS may even signal safety |

### Key point
The best interval depends on the response: about half a second for eyeblink, seconds for fear, and hours for taste aversion.
:::

:::qa What do spontaneous recovery, renewal and reinstatement tell us about extinction? Why does this matter in therapy? [beginner]
| Phenomenon | What happens | What it shows |
|---|---|---|
| Spontaneous recovery | CR returns after time passes | Extinction learning weakens with time |
| Renewal | CR returns in a different context | Extinction is tied to the place it was learned |
| Reinstatement | CR returns after an unsignalled UCS | Original learning remains |
| Rapid reacquisition | Relearning is faster | Original learning remains |

### Therapy implications
1. Do exposure in several settings and with varied stimuli.
2. Prepare clients for occasional returns of fear.
3. Use reminders of therapy (retrieval cues) in high-risk settings.
4. Avoid treating a lapse as complete failure.
:::

:::qa What is the partial reinforcement extinction effect, and how can it be explained? [beginner]
### Short answer
Behaviour learned under intermittent reinforcement takes much longer to extinguish than behaviour learned under continuous reinforcement.

### Explanations
1. **Discrimination hypothesis**: after continuous reward, the change to no reward is obvious; after partial reward, runs without reward are normal, so the change is hard to detect.
2. **Frustration theory (Amsel)**: under partial reward, the animal learns to keep responding even when frustrated by non-reward.
3. **Sequential theory (Capaldi)**: the memory of non-reward becomes a cue for responding, because reward often followed it.

### Applications
- Gambling persistence.
- Parents who "sometimes give in" to tantrums make tantrums harder to stop.
- To make a new healthy habit durable, move from continuous to intermittent praise.
:::

:::qa Contrast Tolman's and Skinner's views of learning, using latent learning as evidence. [beginner]
| | Tolman | Skinner |
|---|---|---|
| What is learned | Expectancies and cognitive maps | Responses strengthened by consequences |
| Role of reinforcement | Affects performance, not learning | Necessary for learning |
| Inner processes | Intervening variables are needed | Unnecessary to explain behaviour |
| Key evidence | Latent learning, place learning, shortcuts | Schedules, shaping, operant control |

### Latent learning
Rats that explored a maze for ten days without food made far fewer errors as soon as food was introduced, matching rats always fed. They had learned the maze without reinforcement.

### Evaluation
Latent learning challenges strict reinforcement theory and anticipates cognitive psychology, although Skinner's methods remain powerful for changing behaviour.
:::

:::qa Explain learned helplessness and its reformulation in terms of attributions. [beginner]
### Original theory
Dogs given inescapable shock later failed to escape when escape was possible, showing passivity, poor learning and distress. Seligman proposed that learning outcomes are independent of behaviour produces helplessness, a model of depression.

### Reformulation
In humans, helplessness leads to depression when bad events are explained as:
| Dimension | Depressive style | Healthier style |
|---|---|---|
| Internal versus external | "It's me" | "The exam was unusually hard" |
| Stable versus unstable | "It will always be like this" | "This time" |
| Global versus specific | "It ruins everything" | "Only this subject" |

### Later developments
Hopelessness theory; and a neural reappraisal showing that passivity is the default response to prolonged stress, while what is learned in controllable situations is control, via the prefrontal cortex.
:::

:::qa Describe a token economy. What are its strengths, problems and ethical safeguards? [beginner]
### How it works
1. Define target behaviours clearly (self-care, completing tasks).
2. Give tokens immediately for each target behaviour.
3. Exchange tokens for back-up reinforcers (snacks, outings, privileges).
4. Gradually thin the schedule and shift to natural reinforcers like praise.

### Strengths
Clear, consistent, measurable; effective on wards, in special schools and in classrooms.

### Problems
- Behaviour may not generalise outside the programme.
- People may work only for tokens.
- Requires consistent staff.

### Safeguards
No basic rights (food, sleep, dignity, family contact) may be made contingent on tokens; consent where possible; regular review; plans to fade the system.
:::

:::qa Evaluate Atkinson and Shiffrin's multi-store model. [beginner]
### Strengths
- Clear distinctions in duration, capacity and coding between stores.
- Supported by the serial position curve, Glanzer and Cunitz's distractor effect, and the H. M. and K. F. dissociation.
- Generated a great deal of research.

### Weaknesses
| Problem | Evidence |
|---|---|
| Short-term memory is not one store | K. F.'s verbal deficit with intact visual memory; working memory research |
| Long-term memory is not one store | Episodic, semantic and procedural memory dissociate |
| Rehearsal is not the only route | We remember much that we never rehearsed; deep processing matters more |
| Information need not pass through short-term memory in sequence | K. F. learned new long-term information despite poor short-term memory |

### Conclusion
A useful first map, replaced in detail by working memory, levels of processing and multiple memory systems.
:::

:::qa Calculation and reasoning: a list of 20 words is read once. Sketch the serial position curve and explain the effect of a 30-second distractor and of slower presentation. [beginner]
### The curve
A U shape: high recall for the first few words (primacy), low in the middle, high for the last few (recency).

### Manipulations
| Change | Effect | Reason |
|---|---|---|
| 30-second distractor before recall | Recency disappears, primacy stays | Last items are lost from short-term memory |
| Slower presentation | Primacy increases, recency unchanged | More time to rehearse early items into long-term memory |
| Amnesic patient | Normal recency, poor primacy | Short-term memory intact, long-term transfer impaired |

### Conclusion
The two ends of the curve reflect different stores, one of the strongest arguments for separate short-term and long-term memory.
:::

:::qa What is encoding specificity? Explain context- and state-dependent memory with examples. [beginner]
### Short answer
A retrieval cue works best when it matches information present at encoding.

### Context-dependent memory
Divers learned words on land or under water. Recall was about 40 percent better when the learning and testing places matched. Recognition was not affected, because the item itself is a strong cue.

### State-dependent memory
Material learned after alcohol is recalled better after alcohol than sober. Mood works similarly: sad moods bring back sad memories.

### Practical uses
| Situation | Application |
|---|---|
| Exam revision | Practise under exam-like conditions, or vary settings so no one context is needed |
| Police interviews | Reinstating the context in the cognitive interview |
| Depression | Mood-congruent recall keeps low mood going; therapy targets it |
:::

:::qa Compare episodic, semantic and procedural memory, with brain bases. [beginner]
| | Episodic | Semantic | Procedural |
|---|---|---|---|
| Content | Personal events in time and place | Facts and knowledge | Skills and habits |
| Awareness | Conscious recollection ("I remember") | Conscious knowing ("I know") | No conscious recollection |
| Example | Your first day at college | Lithium is a mood stabiliser | Riding a scooter |
| Brain | Hippocampus, medial temporal lobe, prefrontal cortex | Lateral and anterior temporal cortex | Basal ganglia, cerebellum, motor cortex |
| Affected early in | Alzheimer's disease | Semantic dementia | Parkinson's disease, Huntington's disease |
:::

## 5.3 Q&A bank · Advanced [advanced]
These are the long, analytical questions asked in NET Paper 2, clinical entrances and MA examinations.

:::qa Explain the Rescorla-Wagner model. What does it explain, and where does it fail? [advanced]
### Short answer
The model says learning on each trial is proportional to the **prediction error**, the difference between what happens and what was expected: change in V equals alpha times beta times (lambda minus the sum of V).

### The terms
- **V**: associative strength of a cue.
- **Alpha, beta**: salience of the cue and of the outcome.
- **Lambda**: the most strength the outcome can support (zero when no outcome).
- **Sum of V**: the total expectation from all cues present.

### What it explains
| Finding | Explanation |
|---|---|
| Negatively accelerated learning curve | Errors shrink as V approaches lambda |
| Extinction | Lambda is zero, so the error is negative |
| Blocking | A pretrained cue already predicts the outcome, so the error for the new cue is zero |
| Overshadowing | Salient cues take more of the shared error |
| Contingency effects | Unsignalled outcomes condition the context, reducing the cue's error |

### Where it fails
1. **Latent inhibition**: pre-exposure should do nothing (V stays zero), yet it slows learning.
2. **Spontaneous recovery and renewal**: extinction is treated as unlearning, but the original learning survives.
3. Some compound-cue effects.
Attention-based models (Mackintosh; Pearce and Hall) let salience change with experience to address these.

### Why it still matters
Its prediction error is the same signal carried by midbrain dopamine neurons, and it underlies reinforcement-learning models in computational psychiatry.
:::

:::qa "Memory is reconstructive." Discuss with reference to schemas, eyewitness testimony and false memories. [advanced]
### Short answer
Memory stores a gist and rebuilds details at retrieval, using schemas and post-event information. This makes memory efficient but open to systematic distortion.

### Schemas
Bartlett's participants retelling "The War of the Ghosts" shortened, rationalised and familiarised it to fit their own cultural schemas.

### Eyewitness testimony
- Loftus and Palmer: the verb "smashed" raised speed estimates and led to false reports of broken glass a week later (the misinformation effect).
- Weapon focus, high stress, own-race bias and suggestive line-ups reduce accuracy.
- The cognitive interview (report everything, reinstate context, change order, change perspective) increases correct recall.
- In Indian practice, courts give less weight to identification parades if the witness saw the accused beforehand.

### False memories
- Lost-in-the-mall: about a quarter came to remember a false childhood event.
- Doctored photographs: about half "remembered" a balloon ride.
- DRM lists: confident recall of an unheard lure word.

### Evaluation
Real-life witnesses can be accurate and resist misleading questions; the key risk is suggestion, delay and repeated questioning. Confidence is a poor guide to accuracy except at a first, fair identification.

### Clinical implication
Therapists must avoid suggestive techniques (hypnosis, guided imagery) for "recovering" memories.
:::

:::qa Describe H. M.'s case and its contribution to our understanding of memory. [advanced]
### Short answer
After removal of both medial temporal lobes in 1953, H. M. could not form new declarative memories, yet kept his short-term memory, older memories, intelligence and skill learning. His case showed that memory is not one thing and that the hippocampal region is essential for forming new lasting memories.

### His profile
| Function | Status |
|---|---|
| New episodic and semantic memories | Severely impaired (anterograde amnesia) |
| Memories from years before surgery | Partly lost (temporally graded retrograde amnesia) |
| Older memories | Largely preserved |
| Short-term memory (digit span) | Normal |
| Skill learning (mirror drawing) | Improved over days without memory of practice |
| Priming | Preserved |

### Contributions
1. Memory can be separated from intelligence and perception.
2. Short-term and long-term memory are separable systems (with K. F., a double dissociation).
3. Declarative and procedural memory depend on different brain systems.
4. Old memories become less dependent on the hippocampus over time (systems consolidation).
:::

:::qa How does learning theory explain addiction, and what treatments follow from it? [advanced]
### Short answer
Drugs are powerful reinforcers; drug cues become conditioned triggers for craving and for tolerance; and dopamine prediction-error signals that drugs cannot "predict away" strengthen cue learning. Treatments target each mechanism.

### Mechanisms
1. **Positive reinforcement**: the high.
2. **Negative reinforcement**: relief from withdrawal and from distress.
3. **Classical conditioning**: places, people and paraphernalia trigger craving.
4. **Conditioned tolerance**: cues trigger compensatory responses; in Siegel's rats, a high dose in an unfamiliar setting was about twice as likely to be fatal.
5. **Matching and choice**: drug use rises when other rewards are scarce or delayed; steep delay discounting.
6. **Dopamine**: drug-induced surges act as persistent positive prediction errors.

### Treatments
| Mechanism | Treatment |
|---|---|
| Reinforcement | Contingency management: vouchers for verified abstinence |
| Lack of alternative rewards | Community reinforcement approach; work and family involvement |
| Cue-triggered craving | Cue exposure, coping skills, avoiding high-risk situations early |
| Context-specific tolerance | Harm-reduction advice about new settings and after breaks |
| Relapse | Marlatt's relapse prevention, building self-efficacy |
:::

:::qa How can memory be assessed in a clinical setting? How would you interpret a pattern of poor recall but good recognition? [advanced]
### Short answer
Memory is assessed with bedside screens, structured scales and neuropsychological tests that separate learning, retention and retrieval. Poor recall with good recognition suggests information is stored but hard to retrieve.

### Tools
- **Bedside**: orientation; registration and delayed recall of words (MMSE, MoCA, ACE-III); remote memory questions.
- **Scales**: Wechsler Memory Scale; PGI Memory Scale (ten subtests, widely used in India).
- **Tests**: Rey Auditory Verbal Learning Test (learning curve over trials, delayed recall, recognition); Rey Complex Figure (visual memory); both in Indian batteries.

### Interpreting patterns
| Pattern | Likely problem | Typical conditions |
|---|---|---|
| Flat learning curve across trials | Encoding or attention | Depression, ADHD, frontal problems |
| Good learning, rapid loss on delay | Storage (consolidation) | Hippocampal damage, Alzheimer's disease |
| Poor recall, good recognition | Retrieval | Subcortical conditions (Parkinson's, vascular), depression |
| Inconsistent, implausible scores | Effort or validity issue | Needs performance-validity testing |

### Indian considerations
Use familiar words, the person's language and appropriate education-adjusted norms; low literacy can be mistaken for impairment.
:::

:::qa Calculation: using the Rescorla-Wagner model with αβ = 0.25 and λ = 1, find V after three trials. Then explain what happens if a second cue is added once V reaches 1. [advanced]
### Working
| Trial | Error (λ minus V) | Change in V | New V |
|---|---|---|---|
| 1 | 1.00 | 0.25 | 0.25 |
| 2 | 0.75 | 0.19 | 0.44 |
| 3 | 0.56 | 0.14 | 0.58 |

Each trial adds less, giving the negatively accelerated learning curve.

### Adding a second cue at V = 1
The total expectation is already 1, so the error is zero. The new cue gains no strength: **blocking**.

### Exam tip
Always use the **sum** of V for all cues present on that trial when calculating the error.
:::

:::qa Explain Kamin's blocking experiment. Why was it so important for theories of conditioning? [advanced]
### Procedure
| Phase | Blocking group | Control group |
|---|---|---|
| 1 | Noise followed by shock | Nothing (or unrelated training) |
| 2 | Noise plus light followed by shock | Noise plus light followed by shock |
| Test | Light alone | Light alone |

### Result
The blocking group showed little fear of the light; the control group showed strong fear.

### Importance
1. Contiguity alone is not enough: the light was paired with shock equally often in both groups.
2. Learning occurs only when the outcome is **surprising**.
3. Led directly to the Rescorla-Wagner model and to the idea of prediction error, later found in dopamine neurons.
:::

:::qa What is biological preparedness? Discuss its relevance to phobias. [advanced]
### Short answer
Preparedness is the idea that evolution makes some associations easy to learn and others hard.

### Evidence
- Taste aversion forms after one pairing, with long delays, and links illness to taste, not to light or sound.
- Fear conditioned to snakes and spiders resists extinction more than fear conditioned to flowers.
- Monkeys learn fear of snakes, but not of flowers, by watching another monkey's fear.

### Relevance to phobias
| Observation | Explanation |
|---|---|
| Phobias cluster around ancient dangers (snakes, heights, dark, blood) | Prepared fears |
| Few phobias of guns or electric sockets, despite their danger | Unprepared |
| Phobias are irrational and persistent | Prepared learning is resistant to extinction and to reasoning |

### Critique
Some "prepared" effects may reflect cultural learning and familiarity; the evolutionary story is hard to test directly.
:::

:::qa Compare Hull, Guthrie and Tolman as learning theorists. [advanced]
| | Hull | Guthrie | Tolman |
|---|---|---|---|
| Core idea | Drive reduction; habit strength | Contiguity; one-trial learning | Expectancies; cognitive maps |
| Role of reinforcement | Essential (reduces drive) | Not needed; it only changes the situation | Affects performance, not learning |
| Method | Formal, mathematical, hypothetico-deductive | Informal, practical | Experimental with intervening variables |
| Famous contribution | Reaction potential equals habit strength times drive (times incentive) | Three ways to break habits: threshold, fatigue, incompatible response | Latent learning, place learning |
| Weakness | Learning happens without drive reduction | Vague, hard to test | Less precise predictions |

### Legacy
Hull influenced motivation research and mathematical models; Guthrie's habit-breaking methods anticipate exposure and habit reversal; Tolman paved the way for cognitive psychology.
:::

:::qa Explain Kandel's work on Aplysia. What did it reveal about short-term and long-term memory? [advanced]
### The model
The sea slug's gill-withdrawal reflex involves few, large neurons that can be studied individually.

### Findings
| Learning | Mechanism |
|---|---|
| Habituation | Less neurotransmitter released by sensory neurons |
| Short-term sensitisation | Serotonin from facilitating interneurons increases transmitter release |
| Long-term sensitisation | Gene activation via CREB, new protein synthesis and growth of new synapses |

### Significance
1. Learning changes the strength of specific synapses.
2. Short-term memory modifies existing proteins; long-term memory needs new proteins and structural change.
3. The same molecular steps were later found in mammals, including in the hippocampus.
:::

:::qa Describe the major factors that affect the accuracy of eyewitness testimony, and how procedures can reduce error. [advanced]
### Factors
| Type | Factor | Effect |
|---|---|---|
| Estimator (event) | Weapon focus | Attention drawn away from the face |
| | High stress | Poorer face identification |
| | Own-race bias | Poorer identification of other-group faces |
| | Delay | More forgetting and more opportunity for contamination |
| System (procedure) | Leading questions | Misinformation incorporated into memory |
| | Biased line-ups | Suspect stands out |
| | Feedback after identification | Confidence inflated |

### Better procedures
1. Double-blind line-ups with fair fillers.
2. A warning that the culprit may not be present.
3. Record confidence immediately.
4. Use the cognitive interview; avoid repeated, suggestive questioning.
5. In Indian practice, hold identification parades promptly and prevent prior exposure to the accused.
:::

:::qa What is reconsolidation, and how might it be used clinically? [advanced]
### Short answer
When a stored memory is reactivated, it becomes briefly unstable and must be stored again. During this window it can be weakened, strengthened or updated.

### Evidence
In rats, a drug blocking protein synthesis given just after a fear memory was reactivated erased the conditioned fear, while the same drug without reactivation had no effect.

### Clinical uses tested
| Approach | Idea | Status |
|---|---|---|
| Propranolol after trauma memory recall | Weaken the emotional component | Mixed trial results |
| Extinction within the reconsolidation window | Update the original memory rather than create a competing one | Promising in some studies, inconsistent replication |
| Imagery rescripting in therapy | Recall and modify the meaning of a memory | Supported for some conditions |

### Caution
Reactivated memories can also be distorted, which links reconsolidation to false memory risks.
:::

:::qa A 58-year-old man with heavy drinking presents with confusion, unsteady gait and abnormal eye movements. What is happening, and what must be done? [advanced]
### Diagnosis
The triad of confusion, ataxia and eye-movement abnormalities suggests **Wernicke's encephalopathy**, caused by thiamine (vitamin B1) deficiency. The full triad is present in only a minority, so suspicion should be high in anyone at risk.

### Immediate action
1. Give **thiamine** urgently, by injection, in high doses, before any glucose.
2. Treat alcohol withdrawal and correct other deficiencies (magnesium).
3. Monitor for delirium and medical complications.

### If untreated
It can progress to **Korsakoff syndrome**: dense anterograde amnesia, temporally graded retrograde amnesia, confabulation and apathy, with damage to the mammillary bodies and medial thalamus. Recovery is often incomplete.

### Psychologist's role
Memory assessment, rehabilitation with errorless learning and external aids, and support for the family.
:::

:::qa How has learning research changed the practice of exposure therapy? [advanced]
### From habituation to inhibitory learning
Older models assumed fear must fall during each session (habituation). Extinction research showed that exposure creates a new "safe" memory that competes with the old fear memory.

### Principles now used
| Principle | In practice |
|---|---|
| Expectancy violation | State the feared prediction, design the exposure to test it, and review what happened |
| Remove safety behaviours | Stop holding the rail, carrying water or checking the exit |
| Vary contexts and stimuli | Different places, people and times, to reduce renewal |
| Deepened extinction | Combine feared cues once each is less frightening |
| Retrieval cues | Small reminders of therapy for difficult situations |
| Tolerate fear | Success is measured by learning, not by how low anxiety falls in the session |

### Outcome
These changes aim to reduce relapse, which older approaches did not address well.
:::

## 5.4 Long answers and short notes [core]
:::example Q1. Describe classical conditioning and its major phenomena. Discuss contemporary views with reference to Rescorla-Wagner and biological preparedness. (15 marks)
1. Definition; Pavlov's method; the five terms (draw the before, during and after diagram).
2. Phenomena: acquisition, temporal arrangements, extinction, spontaneous recovery, renewal, generalisation, discrimination, higher-order conditioning, sensory preconditioning.
3. Little Albert and Mary Cover Jones.
4. From contiguity to contingency: Rescorla 1968; Kamin's blocking; the Rescorla-Wagner equation with a worked trial; strengths and failures (latent inhibition).
5. Preparedness: Garcia and Koelling; Seligman's continuum; Öhman.
6. Applications: phobias, exposure as inhibitory learning, taste aversion in chemotherapy, conditioned drug tolerance.
:::

:::example Q2. Explain schedules of reinforcement with examples, and discuss their applications. (10 marks)
1. Continuous versus partial reinforcement; the partial reinforcement extinction effect.
2. Table of FR, VR, FI and VI with rule, response pattern, cumulative record shape (draw the pause, the steep line, the scallop and the steady slope) and examples (Indian and global).
3. Concurrent schedules and the matching law.
4. Applications: token economies, gambling and app design, workplace incentives, differential reinforcement in ABA.
:::

:::example Q3. Critically evaluate the multi-store model of memory, and compare it with the working memory model and levels of processing. (15 marks)
1. Atkinson-Shiffrin: the three stores with duration, capacity and coding; evidence (Sperling, Miller, Peterson and Peterson, Conrad, Baddeley 1966, the serial position curve, Glanzer and Cunitz, H. M. and K. F.).
2. Critiques: unitary stores, the role of rehearsal, K. F.
3. Working memory: the four components with evidence for each (word length, articulatory suppression, dual tasks, the episodic buffer).
4. Levels of processing: Craik and Tulving; criticisms (circularity, transfer-appropriate processing).
5. Synthesis and applications (education, clinical assessment).
:::

:::example Q4. "Memory is reconstructive." Discuss with reference to research on schemas, eyewitness testimony and false memory. (15 marks)
Bartlett; schema and script theory; Loftus and Palmer; the misinformation effect; factors in eyewitness accuracy; the cognitive interview; lost in the mall, doctored photographs and DRM; flashbulb memories; the recovered-memory debate; Indian legal practice on identification parades; conclusion.
:::

### Short notes (5 marks each)
Spontaneous recovery · Blocking · Rescorla-Wagner model · Taste aversion · Two-factor theory · Learned helplessness · Partial reinforcement extinction effect · Latent learning · Insight learning · Bobo doll studies · Self-efficacy · Systematic desensitisation · Token economy · Long-term potentiation · Sperling's partial report · Serial position effect · Working memory · Encoding specificity · Proactive and retroactive interference · Ebbinghaus's forgetting curve · Korsakoff syndrome · H. M. · Cognitive interview · Flashbulb memory.

:::word Short note: learned helplessness
Seligman and Maier (1967) used a triadic design: dogs given escapable shock, yoked dogs given identical but inescapable shock, and unshocked controls. In a later shuttle-box escape task, about two-thirds of yoked dogs failed to escape, showing motivational, cognitive and emotional deficits; the other groups learned quickly. Seligman proposed helplessness as a model of depression. The reformulated theory (Abramson, Seligman and Teasdale, 1978) added attributions: internal, stable and global explanations for bad events predict depression; hopelessness theory followed. Critique: animal-to-human generalisation, and a 2016 reappraisal showing that passivity is the default and what is learned is control (via the ventromedial prefrontal cortex).
:::

:::word Short note: long-term potentiation
LTP is a long-lasting increase in synaptic strength after brief high-frequency stimulation, first shown by Bliss and Lømo (1973) in the rabbit hippocampus. It depends on NMDA glutamate receptors, which open only when glutamate binds and the postsynaptic cell is depolarised, so they detect coincident activity (Hebb's rule). Calcium entry triggers insertion of more AMPA receptors; late LTP needs protein synthesis. Blocking NMDA receptors prevents spatial learning in the Morris water maze. LTP is the leading cellular model of learning and memory.
:::

:::word Short note: encoding specificity
Tulving and Thomson (1973) proposed that a retrieval cue is effective to the extent that it matches information encoded with the item. Evidence: cued recall far exceeds free recall (Tulving and Pearlstone); context-dependent memory in divers (Godden and Baddeley, about 40 percent better in matching settings); state-dependent memory with alcohol; mood-congruent recall. Applications: the cognitive interview's context reinstatement; revising in exam-like conditions or varying study settings.
:::

## 5.5 Viva rapid-fire [core]
:::viva
Define learning. :: A relatively permanent change in behaviour or its potential due to experience.
Who discovered classical conditioning? :: Ivan Pavlov.
Best temporal arrangement for conditioning? :: Delay (forward) conditioning.
What does spontaneous recovery show? :: Extinction suppresses rather than erases learning.
Who did the Little Albert study? :: Watson and Rayner, 1920.
Who counterconditioned Peter's fear of rabbits? :: Mary Cover Jones, 1924.
Who showed contingency matters more than contiguity? :: Robert Rescorla, 1968.
Who discovered blocking? :: Leon Kamin, 1969.
What is the prediction error in Rescorla-Wagner? :: Lambda minus the sum of V.
What does Rescorla-Wagner fail to explain? :: Latent inhibition, spontaneous recovery and renewal.
Bright, noisy, tasty water study? :: Garcia and Koelling, 1966.
Who proposed preparedness? :: Martin Seligman.
Law of effect, by whom? :: Edward Thorndike.
Who built the operant chamber? :: B. F. Skinner.
Negative reinforcement does what to behaviour? :: Increases it, by removing something aversive.
Two-factor theory, by whom? :: O. H. Mowrer.
Schedule with the highest steady rate? :: Variable ratio.
Schedule producing a scallop? :: Fixed interval.
Who proposed the matching law? :: Richard Herrnstein.
Instinctive drift, by whom? :: Keller and Marian Breland.
Latent learning study? :: Tolman and Honzik, 1930.
Insight learning in chimps? :: Wolfgang Köhler.
Learning sets? :: Harry Harlow.
Four processes of observational learning? :: Attention, retention, reproduction, motivation.
Strongest source of self-efficacy? :: Mastery experiences.
Reciprocal inhibition, by whom? :: Joseph Wolpe.
First token economy on a ward? :: Ayllon and Azrin, 1968.
Guthrie's three habit-breaking methods? :: Threshold, fatigue, incompatible response.
Hull's key motivational concept? :: Drive reduction.
Stimulus sampling theory? :: William Estes.
Who discovered LTP? :: Bliss and Lømo, 1973.
Coincidence-detecting receptor? :: NMDA receptor.
Dopamine signals what? :: Reward prediction error.
Who first studied memory experimentally? :: Hermann Ebbinghaus, 1885.
Partial report technique? :: George Sperling, 1960.
Magical number? :: Seven, plus or minus two (Miller, 1956).
Modern estimate of STM capacity? :: About four chunks (Cowan).
What abolishes the recency effect? :: A filled delay before recall.
Four components of working memory? :: Central executive, phonological loop, visuospatial sketchpad, episodic buffer.
Levels of processing, by whom? :: Craik and Lockhart, 1972.
Episodic versus semantic distinction? :: Endel Tulving, 1972.
Divers context study? :: Godden and Baddeley, 1975.
Old learning disrupting new? :: Proactive interference.
War of the Ghosts? :: Frederic Bartlett, 1932.
Smashed versus contacted? :: Loftus and Palmer, 1974.
Lost in the mall? :: Loftus and Pickrell, 1995.
Cause of Korsakoff syndrome? :: Thiamine deficiency.
Hallmark of Korsakoff syndrome? :: Anterograde amnesia with confabulation.
Who operated on H. M.? :: William Scoville, 1953.
Ribot's law? :: Recent memories are more vulnerable than older ones.
Indian memory scale with ten subtests? :: PGI Memory Scale.
:::

## 5.6 Module test [core]
Answer every question before checking. Your best score is saved.

:::mcq
Q: In Pavlov's terms, a once-neutral stimulus that now elicits a learned response is the:
- Unconditioned stimulus
- Unconditioned response
- *Conditioned stimulus
- Conditioned response
> The CS has acquired its power through pairing.

Q: Which arrangement typically produces the weakest conditioning?
- Delay
- Trace with a short gap
- *Backward
- Delay with a long CS
> The UCS first leaves the CS without predictive value.

Q: A child afraid of a dentist's drill also becomes afraid of a kitchen mixer's whirr. This is:
- Discrimination
- *Generalisation
- Higher-order conditioning
- Latent inhibition
> The fear spreads to a similar stimulus.

Q: Statement I: Extinction erases the original CS-UCS association. Statement II: Renewal shows that extinction is context-dependent.
- Both statements are correct
- Neither statement is correct
- Only Statement I is correct
- *Only Statement II is correct
> Renewal, reinstatement and spontaneous recovery show the original learning survives.

Q: Rats receiving tone-shock pairings plus extra unsignalled shocks show little fear of the tone. This finding is from:
- *Robert Rescorla
- Garcia and Koelling
- Ivan Pavlov
- Leon Kamin
> Rescorla's 1968 contingency study.

Q: In Kamin's experiment, prior training to a noise reduced learning about a light added later. This is:
- Overshadowing
- Sensory preconditioning
- Latent inhibition
- *Blocking
> The pretrained noise already predicted the shock.

Q: In ΔV = αβ(λ − ΣV), on an extinction trial λ equals:
- One
- *Zero
- The current ΣV
- The value of α
> No UCS means the maximum supportable strength is zero.

Q: Rats made ill after drinking flavoured water avoided the taste but not the accompanying light and click. This demonstrates:
- Contiguity theory
- Stimulus generalisation
- *Biological preparedness
- Learned helplessness
> Illness is selectively linked to taste.

Q: A student studies more to avoid a scolding from her parents. The scolding being avoided acts as:
- *Negative reinforcement
- Positive punishment
- Negative punishment
- Positive reinforcement
> Removing or avoiding an aversive stimulus increases the behaviour.

Q: Match the schedule with its pattern: (a) FR, (b) VR, (c) FI, (d) VI. (i) Scallop; (ii) Post-reinforcement pause; (iii) Highest steady rate; (iv) Moderate steady rate.
- *a-ii, b-iii, c-i, d-iv
- a-ii, b-iii, c-iv, d-i
- a-iii, b-ii, c-i, d-iv
- a-i, b-iii, c-ii, d-iv
> FR pause, VR highest, FI scallop, VI steady.

Q: Which form of reinforcement would produce behaviour most resistant to extinction?
- Continuous
- Fixed interval
- Fixed ratio
- *Variable ratio
> The partial reinforcement extinction effect is strongest on VR.

Q: Assertion (A): Avoidance behaviour in phobias is very persistent. Reason (R): Avoidance is negatively reinforced by fear reduction and prevents disconfirmation of the feared outcome.
- A is true, R is false
- *Both are true, and R explains A
- A is false, R is true
- Both are true, but R does not explain A
> This is Mowrer's two-factor account.

Q: In the original learned helplessness experiments, the critical comparison was between dogs given escapable shock and dogs given:
- No shock at all during training
- Food rewards for pressing the panel
- *Identical, inescapable (yoked) shock
- Shock only later, in the shuttle box
> Yoking held shock constant while removing control.

Q: Pigeons fed every 15 seconds regardless of behaviour developed rituals. Skinner called this:
- Instinctive drift
- Shaping
- *Superstitious behaviour
- Learned helplessness
> Accidental reinforcement of whatever preceded food.

Q: Which researcher is linked to cognitive maps?
- Hull
- Guthrie
- Estes
- *Tolman
> Tolman's purposive behaviourism.

Q: Which is NOT a mark of insight learning according to Köhler?
- *A slow fall in errors over many trials
- Transfer of the solution to new problems
- A sudden solution after a pause
- Retention of the solution on later trials
> Gradual improvement is trial and error.

Q: Arrange in chronological order: (1) Rescorla-Wagner model, (2) Thorndike's puzzle box, (3) Bandura's Bobo doll study, (4) Pavlov's Nobel Prize.
- 4, 2, 3, 1
- *2, 4, 3, 1
- 2, 4, 1, 3
- 4, 2, 1, 3
> 1898, 1904, 1961, 1972.

Q: According to Bandura, self-efficacy is most strongly built by:
- *Personal mastery experiences
- Watching others succeed
- Verbal persuasion
- Reducing physiological arousal
> Mastery experiences are the most powerful source.

Q: Long-term potentiation depends critically on:
- GABA-A receptors
- *NMDA glutamate receptors
- Dopamine D2 receptors
- Nicotinic receptors
> NMDA receptors act as coincidence detectors.

Q: Sperling's partial report technique demonstrated that iconic memory:
- Lasts about 18 seconds without rehearsal
- Holds only about four items at a time
- *Holds most of a display but fades fast
- Codes information mainly acoustically
> Large capacity, fast decay.

Q: In the Petersons' study, rapid forgetting over 18 seconds was later attributed largely to:
- Trace decay
- Motivated forgetting
- Retroactive interference from counting
- *Proactive interference from earlier trials
> Keppel and Underwood found little forgetting on the first trial.

Q: The word length effect is evidence for the:
- Central executive
- Episodic buffer
- *Phonological loop
- Visuospatial sketchpad
> Span depends on how long words take to say.

Q: Which of these is an implicit memory?
- Recalling your school's name
- Knowing the capital of Kerala
- Remembering your last birthday party
- *Faster completion of a word stem seen earlier
> Priming is implicit.

Q: Learning in a happy mood and recalling better in a happy mood illustrates:
- Context-dependent memory for places
- *Mood-dependent memory
- Levels of processing at encoding
- Retroactive interference from mood
> Internal state at encoding acts as a retrieval cue.

Q: Bartlett's participants changed "canoes" to "boats" in their retellings. This is:
- *Familiarisation
- Shortening
- Rationalisation
- Confabulation
> Unfamiliar details were replaced with culturally familiar ones.

Q: Which technique is part of the cognitive interview?
- Asking leading questions to test the witness
- *Recalling events in a different order
- Showing a photograph of the suspect first
- Hypnotising the witness
> Changing order is one of the four original techniques.

Q: A man with long-standing alcohol use cannot learn new information and fills gaps with fluent, false stories. The likely diagnosis and cause are:
- Alzheimer's disease; amyloid
- Transient global amnesia; unknown
- *Korsakoff syndrome; thiamine deficiency
- Dissociative amnesia; trauma
> Anterograde amnesia with confabulation after thiamine deficiency.

Q: H. M. improved at mirror drawing over several days without remembering having practised. This shows:
- That his episodic memory was still intact
- That only his recency effect was preserved
- That the hippocampus is where skills are stored
- *That declarative and procedural memory dissociate
> Skill learning was spared despite amnesia.

Q: Heroin-tolerant rats were more likely to die from a large dose given in a new environment. This supports:
- *Conditioned compensatory responses
- Blocking of the drug cue by the room
- Latent learning of the new environment
- Learned helplessness after injections
> Siegel's conditioned tolerance model.

Q: Which is the best evidence-based approach for a therapist concerned that a client may have "repressed" abuse memories?
- Use hypnosis to bring the memories back
- Use guided imagery of what might have happened
- Tell the client that abuse is almost certain
- *Treat current problems; ask open questions
> Suggestive techniques risk creating false memories.
:::
`;
