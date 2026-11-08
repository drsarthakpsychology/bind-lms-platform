/* Module · Sensation, attention and perception, Part III (Advanced) and the exam zone. Original text written for VIBHA School of Psychology. */
export const part3 = String.raw`
# Part III · Advanced: theories, culture and the clinic

## 3.1 Theories of perception: direct, constructed or predicted? [core][advanced]
Every textbook pairs two names: **James Gibson** and **Richard Gregory**. They disagree about how much the brain must add to the input.

### Gibson: direct (ecological) perception
Gibson (1950, 1966, 1979) studied pilots landing aircraft in the Second World War and concluded that the light reaching a moving observer is **already rich in information**. Perception is **direct**: it picks up that information without inference or stored knowledge.
- **The optic array**: the structured pattern of light arriving at the eye from every direction.
- **Optic flow**: as you move, the array streams outwards from the point you are heading towards (the **pole** or focus of expansion). Pilots and drivers steer by it.
- **Invariants**: properties that stay constant as you move, such as the **texture gradient** of the ground or the ratio of an object's height cut by the horizon. They specify size and distance directly.
- **Affordances**: we perceive what the environment offers for action. A chair affords sitting; a ledge affords falling; a handle affords pulling.
- **Resonance**: the perceptual system "tunes in" to information, as a radio does to a station.

### Gregory: constructivist (indirect) perception
Gregory (1966, 1970), building on Hermann von Helmholtz's idea of **unconscious inference** (1867), argued that the input is often **ambiguous and incomplete**, so the brain must **construct** a best guess.
- Perception is **hypothesis testing**: the brain proposes what is out there and checks it against the input.
- Knowledge, expectation and context drive perception top-down.
- Illusions are **misapplied hypotheses**: the Müller-Lyer fins are read as corners, triggering inappropriate size constancy.
- Ambiguous figures flip because the data support two hypotheses equally.

:::widget reveal
{
  "prompt": "A student looks at the inside of a hollow mask of Lord Ganesha, lit from below. She knows it is hollow. Predict what she sees, and say which theory, Gibson's or Gregory's, explains it better.",
  "answer": "She sees a normal face bulging towards her, and as the mask rotates it seems to turn the 'wrong' way. This is the hollow-face illusion, a classic support for Gregory: a strong hypothesis that faces are convex overrides the depth cues, until she comes very close and binocular disparity wins. If perception simply picked up the information in the light, as Gibson proposed, the hollow surface should be seen as hollow."
}
:::

:::widget figure
{"id": "ames-room", "quiz": true}
:::

### Comparing the two
| | Gibson | Gregory |
|---|---|---|
| Direction | Bottom-up | Top-down |
| The input is | Rich and sufficient | Impoverished and ambiguous |
| Role of knowledge | None needed | Central |
| Best evidence | Optic flow in pilots and drivers; affordances; real, moving observers | Illusions; ambiguous figures; perceptual set; the hollow face |
| Weakness | Cannot explain illusions or how affordances are learned; vague about mechanisms | Over-relies on brief, impoverished laboratory displays; if perception is guesswork, why is it usually so accurate? |

Many writers reconcile them with Milner and Goodale's distinction: the **dorsal stream** does fast, direct "vision for action" (Gibson-like), while the **ventral stream** does knowledge-based "vision for recognition" (Gregory-like). Notably, some studies have found that grasping is less affected by size illusions than verbal judgments of size.

:::widget timeline
{"prompt": "Put these big ideas about perception in the order they appeared.", "events": [{"label": "Helmholtz: perception is unconscious inference from sensations", "when": "1860s"}, {"label": "Wertheimer's phi phenomenon launches Gestalt psychology", "when": "1912"}, {"label": "Gibson: the light reaching the eye is rich enough for direct perception", "when": "1950 on"}, {"label": "Gregory: perception is hypothesis testing", "when": "1970"}, {"label": "Neisser's perceptual cycle joins the two", "when": "1976"}, {"label": "Marr: vision as computation in stages", "when": "1982"}, {"label": "The predictive brain: perception as controlled prediction", "when": "2000s"}], "why": "The debate swung between 'perception is built by inference' and 'perception is picked up directly', and modern predictive accounts are, in a way, Helmholtz's idea in mathematical form."}
:::

:::widget sort
{
  "prompt": "Gibson or Gregory? Sort each claim.",
  "buckets": ["Gibson (direct)", "Gregory (constructivist)"],
  "items": [
    { "text": "A doorway is seen as something you can walk through", "bucket": 0, "why": "Perceiving action possibilities is Gibson's idea of affordances." },
    { "text": "An ambiguous figure flips because the data fit two hypotheses", "bucket": 1 },
    { "text": "The texture gradient of the ground gives distance without inference", "bucket": 0 },
    { "text": "Perception goes beyond the evidence, using stored knowledge", "bucket": 1 },
    { "text": "Laboratory displays flashed for milliseconds misrepresent everyday seeing", "bucket": 0 },
    { "text": "Illusions are the result of misapplied size constancy", "bucket": 1 }
  ]
}
:::

### Neisser's perceptual cycle (1976)
Ulric Neisser combined both: **schemata** (expectations) direct exploration; exploration samples the world; the sample modifies the schemata, and the cycle continues. Perception is neither purely bottom-up nor purely top-down, but an ongoing loop.

:::widget flow
{
 "title": "Neisser's perceptual cycle",
 "layout": "cycle",
 "nodes": [
  {
   "id": "sch",
   "label": "Schema",
   "detail": "Your expectation about what is there (for example, 'a friend is waiting at the bus stand')."
  },
  {
   "id": "exp",
   "label": "Exploration",
   "detail": "The schema directs where you look and listen."
  },
  {
   "id": "obj",
   "label": "The world sampled",
   "detail": "You pick up real information from the scene."
  },
  {
   "id": "mod",
   "label": "Schema modified",
   "detail": "What you found confirms or changes the expectation, and the cycle continues."
  }
 ],
 "caption": "Top-down and bottom-up are not rivals here: they take turns in a loop."
}
:::

### Marr's computational approach (1982)
David Marr asked what the visual system computes, step by step:
1. **Primal sketch**: edges, bars, blobs and their arrangement (a 2D description).
2. **Two-and-a-half-D sketch**: depth and orientation of visible surfaces relative to the viewer.
3. **3D model representation**: an object-centred description that is the same from any viewpoint.
:::widget layers
{
 "title": "Marr's stages of visual representation",
 "shape": "stack",
 "layers": [
  {
   "label": "3D model representation",
   "detail": "Object-centred: the shape described in its own terms, the same from any viewpoint. Needed for recognition."
  },
  {
   "label": "Two-and-a-half-D sketch",
   "detail": "Viewer-centred: the depth and orientation of the visible surfaces, from your point of view."
  },
  {
   "label": "Primal sketch",
   "detail": "A 2D description of edges, bars, blobs and their grouping, computed from changes in light intensity."
  }
 ],
 "caption": "Read from the bottom up: each level is built from the one beneath it."
}
:::

He also separated three **levels of explanation** for any information-processing system: computational (what problem is solved and why), algorithmic (what steps), and implementational (what hardware). This framework is still used across cognitive science.

### The modern synthesis: the predictive brain
Current theories (**predictive processing**, the "Bayesian brain") treat the brain as constantly **predicting** its sensory input from a model of the world, and passing forward only the **prediction error**, the part that was not expected. Perception is the brain's best explanation of the input, weighing prior beliefs against how reliable the evidence is. This is Helmholtz and Gregory made mathematical, but it also takes Gibson's point that the moving observer constantly samples the world.

:::widget flow
{"title": "The predictive brain loop", "layout": "cycle", "nodes": [{"id": "m", "label": "Model of the world", "detail": "From past experience, the brain holds a best guess about what is out there."}, {"id": "p", "label": "Prediction sent down", "detail": "Higher areas predict what the senses should be receiving right now."}, {"id": "e", "label": "Compare with input", "detail": "Only the mismatch, the prediction error, is passed upwards. Each error is weighted by how reliable it seems (its precision)."}, {"id": "u", "label": "Update the model", "detail": "Large, reliable errors change the model. Small or noisy ones are ignored. Perception is the model that best explains the input."}], "edgeLabels": {"m>p": "predict", "p>e": "meets the senses", "e>u": "prediction error", "u>m": "learn"}, "caption": "In one account of psychosis, errors are given too much weight, so trivial events feel important and demand an explanation."}
:::

:::clinician
Predictive processing offers testable accounts of psychopathology. In psychosis, one account proposes aberrant precision-weighting: prediction errors are given too much weight, so trivial events feel significant (Shitij Kapur's idea of aberrant salience) and new beliefs (delusions) form to explain them; hallucinations may reflect overly strong priors in some people. Consistent with weaker top-down influence, people with schizophrenia are less susceptible to the hollow-face illusion and to some context-driven illusions (for example Ebbinghaus), yet their performance can be "better" than controls on such tasks. In autism, "weak priors" or inflexible precision accounts aim to explain sensory overload and reduced susceptibility to some illusions. These are frameworks under active test, not established mechanisms.
:::

:::recall
1. What are affordances? || Action possibilities the environment offers an organism, perceived directly (Gibson).
2. What is optic flow? || The streaming pattern of the optic array as an observer moves, expanding from the point of heading.
3. How does Gregory explain the Müller-Lyer illusion? || The fins are read as depth cues (corners), so size constancy is misapplied.
4. Name Marr's three stages of visual representation. || Primal sketch, two-and-a-half-D sketch, 3D model representation.
5. What is Neisser's perceptual cycle? || Schemata guide exploration, which samples the world, which updates the schemata.
:::

:::mcq
Q: Which finding most strongly supports Gibson over Gregory?
- *Pilots steering by optic flow when landing
- Perceptual set shaping ambiguous figures
- The hollow-face illusion
- The Müller-Lyer illusion
> Optic flow is information in the light itself, used directly for action.

Q: According to Marr, which representation is viewer-centred and describes the depth and orientation of visible surfaces?
- The primal sketch
- The 3D model representation
- *The two-and-a-half-D sketch
- The stored template
> The 2.5D sketch is viewer-centred; the 3D model is object-centred.
:::

## 3.2 Culture, motivation and perceptual defence [core][advanced]
If perception were purely bottom-up, it would be the same in every culture and every mood. Two lines of research ask whether it is.

### Culture and illusions
- **The carpentered-world hypothesis**: Marshall Segall, Donald Campbell and Melville Herskovits (1966) tested over 1,800 people in 14 non-Western and 3 Western samples. People living in rectangular, "carpentered" environments (cities with corners and straight walls) were more susceptible to the Müller-Lyer illusion than people in rural African communities with round huts and few right angles. Experience with corners seems to teach the depth reading that the illusion exploits.
- **The horizontal-vertical illusion** showed the reverse pattern: people from open, flat landscapes, who often see long receding horizontal stretches, were more susceptible.
- **Critiques**: differences in schooling, in the pigmentation of the eye (which affects contrast sensitivity) and in familiarity with pictures may explain part of the effect.

:::widget compare
{"title": "The carpentered-world hypothesis", "a": {"label": "Carpentered settings", "points": ["Rectangular rooms, straight walls, square corners", "Corners are seen everywhere as cues to depth", "Strongly fooled by the Müller-Lyer illusion"], "summary": "People raised among right angles learn to read angled lines as corners in depth, and the habit makes the Müller-Lyer lines look unequal."}, "b": {"label": "Rounded, open settings", "points": ["Round huts, curved shapes, few right angles", "Less practice reading angles as depth", "Less fooled by the Müller-Lyer illusion"], "summary": "With less experience of carpentered corners, the illusion is weaker. Schooling, picture experience and eye pigmentation may explain part of the difference."}, "caption": "The horizontal-vertical illusion showed the reverse: people from flat, open land were more susceptible."}
:::

:::widget figure
{"id": "muller-lyer", "quiz": true}
:::

### Culture and pictures
- **Hudson (1960)** showed South African participants drawings with an elephant, an antelope and a hunter, using only relative size and overlap as depth cues. Many unschooled participants said the hunter was aiming at the (tiny, distant) elephant: they saw the picture as **flat** (two-dimensional). Schooling and exposure to pictures increased "3D" readings.
- **Deregowski (1972)** found that some groups preferred "split" drawings showing all sides of an animal at once to perspective drawings.
- **Turnbull (1961)** described Kenge, a BaMbuti man from the dense Ituri forest, seeing distant buffalo across open plains for the first time and taking them for insects: in a forest where you never see far, size constancy over great distances had not developed.

### Analytic and holistic seeing
Takahiko Masuda and Richard Nisbett (2001) showed animated underwater scenes to Japanese and American students. Japanese students mentioned the **background and relationships** (the water, the plants, the small creatures) more; Americans mentioned the **large, focal fish** first. East Asian participants tend to perceive more **holistically**, Western participants more **analytically**.

Herman Witkin's **field dependence-independence** describes a similar style: field-dependent people are influenced by the surrounding frame (the **rod-and-frame test**) and find hidden shapes harder (the **embedded figures test**). John Berry's **eco-cultural** studies linked field independence to hunting ecologies and loose social structure. In India, R. C. Mishra, Durganand Sinha and Berry's work with Adivasi communities in Bihar (hunting-gathering Birhor and settled agricultural groups) found that disembedding and related skills tracked ecology, schooling and contact with town life, not "race" or innate ability.

:::widget sort
{
  "prompt": "Which finding goes with which researcher?",
  "buckets": ["Segall, Campbell and Herskovits", "Hudson", "Turnbull", "Masuda and Nisbett"],
  "items": [
    { "text": "Rural communities with round houses were less fooled by the Müller-Lyer lines", "bucket": 0 },
    { "text": "Unschooled participants saw a drawn hunter as aiming at a distant elephant", "bucket": 1 },
    { "text": "A forest dweller took distant buffalo for insects", "bucket": 2 },
    { "text": "Japanese students described the background of an aquarium scene more than Americans did", "bucket": 3 },
    { "text": "The 'carpentered world' hypothesis", "bucket": 0 },
    { "text": "Pictorial depth perception depends on exposure to pictures", "bucket": 1 }
  ]
}
:::

### Motivation, emotion and perception: the "New Look"
In the late 1940s, Jerome Bruner and colleagues argued that needs and values shape what we see.
- **Bruner and Goodman (1947)**: ten-year-olds adjusted a circle of light to match the size of coins. All overestimated, but **poor children overestimated more** than rich children, and coins more than plain cardboard discs of the same size.
- **Bruner and Postman (1949)**: incongruous playing cards (a red six of spades) took longer to recognise, and were often "seen" as normal.
- **Perceptual set**: a readiness to perceive in a particular way, set up by expectation, context, motivation or culture. **Bugelski and Alampay (1961)** showed people pictures of animals or of faces before an ambiguous "rat-man" figure; those primed with animals saw a rat. **Leeper (1935)** used the "old woman and young woman" figure the same way.
- **Gilchrist and Nesberg (1952)**: hungry participants judged pictures of food as brighter than fed participants did.

### Perceptual defence
**McGinnies (1949)** flashed taboo (rude or sexual) words and neutral words briefly, raising the exposure until participants could read them. Taboo words needed **longer exposures** to be recognised, and produced a **skin-conductance response before they were reported**. McGinnies called this **perceptual defence**: the mind blocks threatening material from awareness, a laboratory echo of Freud's repression.

:::widget decide
{
  "scene": "You are marking an MA answer that says: “McGinnies (1949) proved that the unconscious mind protects us from threatening words.”",
  "ask": "What is the best critical comment?",
  "choices": [
    { "label": "Agree; the skin-conductance data prove unconscious defence", "verdict": "ok", "outcome": "The answer describes the finding but loses the evaluation marks.", "why": "The effect was real in the data, but \"prove\" is too strong: simpler explanations were raised at once and must be discussed." },
    { "label": "Note two alternative explanations: taboo words were less familiar in print (Howes and Solomon, 1950), and participants may have seen them but hesitated to say them aloud to an experimenter (response suppression)", "verdict": "best", "outcome": "The answer gains marks for balanced evaluation.", "why": "Word frequency strongly predicts recognition thresholds, and embarrassment can delay report. Later studies controlling these found smaller effects, along with the opposite pattern in some people: perceptual vigilance (sensitisation) to threat." },
    { "label": "Dismiss the study as unscientific because it was done in the 1940s", "verdict": "ok", "outcome": "Age is not a critique.", "why": "Old studies can be well designed; criticise the method and the alternative explanations, not the date." }
  ]
}
:::

The modern descendants of the New Look are well supported, but more modest: **attentional bias** to threat in anxiety, **emotion-induced blindness** (an emotional image can make the next target briefly invisible), and evidence that fear can change basic contrast sensitivity. Big claims, such as "wanting something makes it look bigger", are contested; some effects reflect changes in judgment or response rather than in perception itself.

:::clinician
A much-debated 2016 critique by Chaz Firestone and Brian Scholl argued that almost no "top-down effects on perception" survive scrutiny once six pitfalls are excluded: an overly confirmatory design, effects on judgment rather than perception, demand characteristics, low-level stimulus differences, peripheral attention effects and memory rather than perception. The paper is a model for critical evaluation in long answers. Contrast this with robust cognitive penetration by attention and with predictive-processing accounts, which predict pervasive top-down influence, and you have a viva-ready debate.
:::

:::recall
1. State the carpentered-world hypothesis. || Growing up among rectangular buildings makes people read angles as depth cues, increasing Müller-Lyer susceptibility.
2. What did Hudson's pictures reveal? || Unschooled participants often read pictures as flat, ignoring pictorial depth cues.
3. What did Bruner and Goodman find? || Poor children overestimated the size of coins more than rich children.
4. Define perceptual set and give one study. || A readiness to perceive in a particular way; Bugelski and Alampay's rat-man figure.
5. Give two criticisms of McGinnies' perceptual defence study. || Taboo words were less familiar in print; participants may have hesitated to say them aloud.
:::

:::mcq
Q: People living in environments with few right angles were less susceptible to the Müller-Lyer illusion. This supports:
- Direct perception
- Perceptual defence
- The opponent-process theory
- *The carpentered-world hypothesis
> Experience with rectangular structures shapes the depth interpretation behind the illusion.

Q: Participants primed with animal pictures see an ambiguous figure as a rat; those primed with faces see a man. This demonstrates:
- Perceptual defence
- *Perceptual set
- Sensory adaptation
- Inattentional blindness
> Prior context sets expectation, biasing perception.
:::

## 3.3 Modern attention science: networks, blinks and limits [core][advanced]
### Three attention networks
Michael Posner and Steven Petersen (1990) proposed that attention is not one thing but three networks, each with its own anatomy and chemistry:
| Network | Job | Key regions | Main chemical |
|---|---|---|---|
| **Alerting** | Getting and staying ready to respond | Locus coeruleus, right frontal and parietal cortex | Noradrenaline |
| **Orienting** | Selecting a location or object | Superior parietal lobe, temporoparietal junction, frontal eye fields, superior colliculus | Acetylcholine |
| **Executive control** | Resolving conflict between responses | Anterior cingulate, lateral prefrontal cortex | Dopamine |

:::widget brainmap
{
 "title": "Posner's three attention networks",
 "focus": [
  "brainstem",
  "parietal",
  "prefrontal"
 ],
 "notes": {
  "brainstem": "Alerting: the locus coeruleus releases noradrenaline to get and keep you ready.",
  "parietal": "Orienting: superior parietal cortex and the temporoparietal junction move the spotlight, using acetylcholine.",
  "prefrontal": "Executive control: anterior cingulate and lateral prefrontal cortex resolve conflict, using dopamine."
 },
 "caption": "Tap each network. The right temporoparietal junction, part of orienting, is the region most linked to neglect."
}
:::

The **Attention Network Test**, developed in Posner's group in 2002, measures all three in one task by combining cues (for alerting and orienting) with a flanker task (for conflict: respond to the middle arrow in ← ← → ← ←).

Maurizio Corbetta and Gordon Shulman (2002) split orienting into a **dorsal attention network** (voluntary, goal-driven, both hemispheres) and a **ventral attention network** (stimulus-driven "circuit breaker", right-lateralised, centred on the temporoparietal junction). Damage to the right ventral network contributes to **hemispatial neglect**.

### Attention in time: the attentional blink
In **rapid serial visual presentation**, items flash at about ten per second in one place. If a person must report two targets, the second is often missed if it comes about **200 to 500 milliseconds** after the first (Raymond, Shapiro and Arnell, 1992). Processing the first target briefly ties up attention. Curiously, a second target that comes immediately after the first (within about 100 ms) is often caught: **lag-1 sparing**.

:::widget guess
{
  "prompt": "In the attentional blink, how long after the first target is the second target most likely to be missed?",
  "min": 0,
  "max": 1000,
  "step": 50,
  "unit": "ms",
  "answer": [200, 500],
  "reveal": "Between about 200 and 500 milliseconds. Before that, the second target can slip in with the first (lag-1 sparing); after about half a second, attention has recovered. Emotional words (and your own name) are less likely to be 'blinked'."
}
:::

### Is there a central bottleneck?
In the **psychological refractory period** (PRP) paradigm, two stimuli needing two different responses arrive close together. The response to the second is delayed, and the delay shrinks as the gap between stimuli grows. Harold Pashler argued for a **central bottleneck** at the stage of choosing a response: two response decisions cannot be made at exactly the same time. Practice can shrink the cost but rarely abolishes it.

### Divided attention: what practice can and cannot do
Spelke, Hirst and Neisser (1976) trained two students for weeks to read short stories while writing words dictated to them. At first reading slowed badly; with long practice, they read at normal speed and comprehension while writing to dictation, and later even categorised the dictated words. Task combination is a **skill** that can be learned, but the tasks were partly automatised, and the claim that "capacity" increased is debated.

:::widget decide
{
  "scene": "A school in Delhi plans to let students keep phones on their desks, silenced and face down, during classes, arguing that “if they don't touch them, there's no harm”.",
  "ask": "What does attention research suggest?",
  "choices": [
    { "label": "No effect: an untouched phone takes no attention", "verdict": "ok", "outcome": "The school goes ahead and teachers notice no clear change, but the question has not really been tested.", "why": "Some studies report that the mere presence of a phone lowers working-memory scores, but large replications found smaller or no effects. The honest answer is uncertainty, not 'no harm'." },
    { "label": "Notifications and checking are the proven harm; keeping phones out of reach removes the temptation to switch tasks", "verdict": "best", "outcome": "Phones go into bags during class; teachers report fewer interruptions.", "why": "Task switching carries well-established costs, and frequent media multitaskers tend to do worse on attention tasks. Reducing opportunities to switch is the evidence-based step, whatever the 'mere presence' debate concludes." },
    { "label": "Ban all technology from schools, because screens damage attention permanently", "verdict": "harm", "outcome": "Useful learning tools are removed on the basis of an overstated claim.", "why": "There is no good evidence of permanent attention damage from screens in general. Specific, distracting uses are the problem." }
  ]
}
:::

:::clinician
Task-switching paradigms show a residual switch cost even with full preparation, implicating reconfiguration of task set. In neuropsychology, executive attention is tested with the Stroop, Trail Making Part B (or the Colour Trails Test, which avoids reliance on the English alphabet and is used in Indian batteries), the Wisconsin Card Sorting Test and the flanker task. The "mere presence" smartphone effect reported in 2017 failed to replicate in larger preregistered studies, making it a useful teaching example of a viral finding that shrank under scrutiny.
:::

:::recall
1. Name Posner's three attention networks and their main chemicals. || Alerting (noradrenaline), orienting (acetylcholine), executive control (dopamine).
2. What is the attentional blink? || Missing a second target presented about 200 to 500 ms after a first.
3. What is the psychological refractory period? || Slowing of the response to a second stimulus presented soon after a first, implying a central bottleneck in response selection.
4. What did Spelke, Hirst and Neisser show? || With extensive practice, people could read with comprehension while writing to dictation.
5. Which network is right-lateralised and acts as a circuit breaker? || The ventral attention network (temporoparietal junction).
:::

:::mcq
Q: In the Attention Network Test, the flanker arrows mainly measure which network?
- Alerting
- *Executive control
- Orienting
- Ventral attention
> Conflict from incongruent flankers taps executive control.

Q: The finding that a second target is often missed 300 ms after a first, but caught at 100 ms, describes:
- Inhibition of return
- Change blindness
- The psychological refractory period
- *The attentional blink with lag-1 sparing
> The blink window is about 200 to 500 ms; lag-1 is spared.
:::

## 3.4 Perception and attention in the clinic [core][advanced]
Disorders of perception and attention are where this module meets the ward. Some arise from brain lesions; others are part of psychiatric illness.

### Neglect, agnosia and blindsight
- **Hemispatial neglect**: failure to attend to one side of space, usually the **left**, after damage to the **right** parietal lobe or temporoparietal junction. The person eats from the right half of the plate, shaves half the face, and on a **line bisection** test marks the centre far to the right. **Cancellation tests** (cross out every star) show left-sided omissions. Neglect is not blindness: visual fields may be intact. Patients often deny the problem (**anosognosia**).
- **Balint's syndrome**, from bilateral parieto-occipital damage: **simultanagnosia** (seeing only one object at a time), **optic ataxia** (misreaching) and **oculomotor apraxia** (difficulty directing gaze).
- **Visual agnosia**: failure to recognise objects despite adequate vision. Heinrich Lissauer (1890) separated **apperceptive agnosia** (cannot form a percept; cannot copy a drawing) from **associative agnosia** (can copy a drawing accurately but still cannot say what it is).
- **Blindsight** (Lawrence Weiskrantz, patient D. B.): after damage to primary visual cortex, people deny seeing anything in the blind field, yet point to or guess the location and movement of stimuli there well above chance.

:::widget decide
{
  "scene": "Mr Desai, 71, from Vadodara, is on a stroke ward. He eats only the right half of his thali, ignores visitors who stand on his left and insists he is “perfectly fine”. His visual fields to confrontation are full when tested one side at a time.",
  "ask": "What is the most likely problem, and the best first step for the team?",
  "choices": [
    { "label": "Left hemianopia: patch the right eye to force use of the left field", "verdict": "harm", "outcome": "His function does not improve and he is frustrated and unsafe walking.", "why": "Visual fields are full; the problem is attention, not sight. Patching is the wrong treatment for the wrong diagnosis." },
    { "label": "Left hemispatial neglect after a right parietal stroke; test with line bisection and cancellation, approach from the right at first, and use scanning training and cues to the left", "verdict": "best", "outcome": "Assessment confirms neglect; staff learn to cue him leftwards, and rehabilitation (visual scanning, prism adaptation trials) begins.", "why": "Ignoring the left with full fields, plus denial, is classic neglect. Formal tests document it, and cueing helps safety. Anosognosia predicts slower recovery." },
    { "label": "Mild confusion; reassure the family it will pass", "verdict": "ok", "outcome": "Some neglect does improve, but unrecognised neglect leads to falls and injuries.", "why": "Delirium is possible after stroke, but the lateralised pattern needs specific assessment and management." }
  ]
}
:::

:::widget brainmap
{
 "title": "Where perception breaks down",
 "focus": [
  "parietal",
  "temporal",
  "occipital"
 ],
 "notes": {
  "parietal": "Right parietal lobe: hemispatial neglect. Both parieto-occipital regions: Balint's syndrome.",
  "temporal": "Fusiform region on the underside: prosopagnosia and associative agnosia. Area MT near the junction with the occipital lobe: akinetopsia.",
  "occipital": "Primary visual cortex: a blind half-field, sometimes with blindsight."
 },
 "caption": "Tap a lobe, then sort the problems below."
}
:::

:::widget sort
{
  "prompt": "Match each problem to the usual site of damage.",
  "buckets": ["Right parietal lobe", "Fusiform region (ventral temporal)", "Primary visual cortex", "Area MT (V5)"],
  "items": [
    { "text": "Ignores the left side of space", "bucket": 0 },
    { "text": "Cannot recognise familiar faces", "bucket": 1 },
    { "text": "Denies seeing in one half-field but points to stimuli there above chance", "bucket": 2 },
    { "text": "Sees moving cars as a series of still snapshots", "bucket": 3 },
    { "text": "Line bisection mark shifted far to the right", "bucket": 0 }
  ]
}
:::

### Hallucinations and illusions in psychiatry
In the mental status examination, an **illusion** is a misperception of a real stimulus (a coat on a hook seen as a man in a dim room), common in delirium and fear. A **hallucination** is a perception without an external stimulus, experienced as real and located in outer space.
- **Signal detection** gives a useful lens: hallucination-prone people show a more liberal bias to "detect" voices in noise, not better or worse hearing (Bentall and Slade, 1985). In Indian clinics, culturally shaped experiences (hearing a deceased relative's voice in grief, or experiences framed as spirit or deity possession) must be understood in context before being labelled.
- **Charles Bonnet syndrome**: vivid, often silent visual hallucinations (patterns, small people, faces) in people with significant visual loss, such as untreated cataract, glaucoma or macular degeneration, with **insight preserved**. It is common in older adults and frequently goes unreported for fear of being called "mad". Ask about it, explain it, and treat the eyes.
- **Delirium** produces illusions and visual hallucinations, worse at night, with fluctuating attention: inattention is a core feature of delirium.

:::widget sort
{"prompt": "Illusion or hallucination?", "buckets": ["Illusion", "Hallucination"], "items": [{"text": "In a dim ward at night, a coat on a hook is seen as a man standing there", "bucket": 0, "why": "A real stimulus is misperceived."}, {"text": "A man hears two voices discussing him when nobody is present", "bucket": 1, "why": "A perception without any stimulus, here a third-person auditory hallucination."}, {"text": "A delirious patient sees the flowers on the curtain as crawling insects", "bucket": 0, "why": "The curtain pattern is real; it is misread. Illusions are common in delirium."}, {"text": "A woman of 80 with macular degeneration sees small people in bright clothes on her table, and knows they are not real", "bucket": 1, "why": "No stimulus is there. This is Charles Bonnet syndrome, a hallucination with preserved insight."}, {"text": "A healthy student hears her name called just as she is falling asleep", "bucket": 1, "why": "A hypnagogic hallucination: a true hallucination, but a normal one at sleep onset."}, {"text": "Seeing a face in the pattern of a tiled floor while looking straight at it", "bucket": 0, "why": "Pareidolia: an illusion that persists even when you attend to it."}]}
:::

### Attention in psychiatric disorders
| Condition | Attentional finding |
|---|---|
| **ADHD** | Poor sustained attention and inhibition; more variable reaction times; errors of omission and commission on continuous performance tests |
| **Schizophrenia** | Weak sensory gating (P50 suppression), reduced prepulse inhibition, poor sustained attention; reduced latent inhibition in acute states |
| **Anxiety disorders** | **Attentional bias** towards threat: faster detection of threat words in the dot-probe task (MacLeod, Mathews and Tata, 1986); slower colour naming of threat words in the **emotional Stroop** |
| **Depression** | Difficulty disengaging from negative and sad material rather than fast orienting to threat |
| **Delirium** | Inattention is the core feature, fluctuating through the day |

:::clinician
Attention bias modification (training attention away from threat in dot-probe variants) generated early excitement, but later meta-analyses found small effects that shrink once publication bias and low-quality trials are accounted for; it is not a stand-alone treatment. For neglect, prism adaptation and visual scanning training have the best, if modest, evidence. In delirium screening, attention tests (months of the year backwards, the "SAVEAHAART" letter task in the CAM-ICU) carry most of the diagnostic weight. For an Indian bedside, avoid tests that rely on English alphabet sequences in patients not schooled in English; number or culturally neutral versions, such as the Colour Trails Test, are fairer.
:::

:::recall
1. Where is the lesion in hemispatial neglect, and which side is ignored? || Usually the right parietal lobe or temporoparietal junction; the left side of space.
2. Distinguish apperceptive and associative agnosia. || Apperceptive: cannot form a percept or copy. Associative: can copy but cannot recognise or name.
3. What is blindsight? || Above-chance responses to stimuli in a field the person reports as blind, after primary visual cortex damage.
4. What is Charles Bonnet syndrome? || Vivid visual hallucinations with insight, in people with visual loss.
5. Name two tasks that show attentional bias in anxiety. || The dot-probe task and the emotional Stroop.
:::

:::mcq
Q: A patient can make an accurate copy of a drawing of a pressure cooker but cannot say what it is or what it is for. This is:
- Apperceptive agnosia
- Prosopagnosia
- *Associative agnosia
- Simultanagnosia
> Intact copying with failed recognition points to an associative deficit.

Q: An 80-year-old woman with dense cataracts sees small, brightly dressed figures on her bedroom wall. She knows they are not real and is not otherwise unwell. The most likely explanation is:
- *Charles Bonnet syndrome
- Delirium
- Late-onset schizophrenia
- Hemispatial neglect
> Visual loss plus vivid hallucinations with insight is Charles Bonnet syndrome.
:::

## 3.5 In the lab: classic perception and attention practicals [core][advanced]
Many MA and MSc courses in India, and the practical parts of entrance interviews, expect you to run and explain classic experiments. Each one teaches a method.

### Müller-Lyer illusion by the method of average error
The participant slides an adjustable line (with inward or outward fins) until it looks equal to a standard line. Over many trials (half starting too long, half too short; half with the variable on the left, half on the right), you calculate the **constant error** (the average difference from the true length: the size of the illusion) and the **variable error** (the spread of settings: precision). Balancing start position and side controls **movement** and **space errors**.

### Two-point threshold (aesthesiometer)
With eyes closed, the participant reports whether one or two points touch the skin. The **two-point threshold** is smallest on the fingertips and lips (a few millimetres) and largest on the back and thigh (several centimetres), mapping the density of touch receptors and the size of the body's representation in the somatosensory cortex. Use catch trials (a single point) to estimate guessing, a simple link to signal detection.

:::widget guess
{
  "prompt": "On the middle of the back, roughly how far apart must two points be before a person feels two touches rather than one?",
  "min": 1,
  "max": 80,
  "unit": "mm",
  "answer": [35, 60],
  "reveal": "About 40 to 50 mm (several centimetres), compared with about 2 to 3 mm on the fingertip. The difference reflects receptor density and how much cortex each body part has: the 'sensory homunculus' has huge lips and hands."
}
:::

### Span of attention (tachistoscope)
Dots or letters are flashed for a very brief, fixed time (traditionally about 100 ms, too short for eye movements). The **span of apprehension** is the largest number reported correctly on half the trials, usually about **6 to 8** for dots, with only about **4** "seen at a glance" without counting (**subitising**). Grouping (in Gestalt fashion) raises the span.

### Division of attention
The participant does a speed task (for example crossing out a target letter) alone, then while doing mental addition aloud. A **division index** (performance under dual task compared with single task) shows the cost of dividing attention, and with practice the cost drops, echoing Spelke, Hirst and Neisser.

:::widget worked
{
  "title": "Writing up a Müller-Lyer practical",
  "steps": [
    { "q": "The standard line is 10 cm. Across 20 trials with outward fins on the standard, the participant's average setting of the plain line is 11.4 cm, with a standard deviation of 0.3 cm. What are the constant and variable errors?", "a": "Constant error is 11.4 minus 10, which is plus 1.4 cm: the standard looked 14 percent longer. Variable error is 0.3 cm: settings were fairly consistent." },
    { "q": "What controls should the design include, and why?", "a": "Half the trials starting too long and half too short (to balance movement or direction errors), the standard on the left and right equally (space errors), and rest breaks (fatigue). Randomise or counterbalance their order." },
    { "q": "How might you link the result to theory in the discussion?", "a": "Explain Gregory's misapplied size-constancy account, the carpentered-world findings of Segall and colleagues, and a critique (the illusion persists with circles instead of fins, which have no depth meaning). Note the small sample and possible practice effects." }
  ],
  "yourTurn": [
    { "q": "In a repeat with 20 more trials, the constant error falls to plus 0.8 cm. Suggest two explanations.", "a": "Practice and learning about the illusion (known to reduce Müller-Lyer magnitude with repeated trials), or fatigue and changed strategy (for example ignoring the fins). Compare the first and second halves and ask the participant about strategy to tell them apart." }
  ]
}
:::

:::clinician
These practicals translate directly into clinical tools: the method of limits in audiometry, two-point discrimination in neurological sensory examination (a cortical sensory loss shows impaired two-point discrimination with intact primary touch), tachistoscopic paradigms in visual masking studies of schizophrenia (backward masking deficits are a well-replicated finding), and dual-task walking ("walking while talking") as a predictor of falls in older adults. When teaching or examining, ask students to name the dependent variable, the error controlled and one ecological limitation for each practical.
:::

:::recall
1. In the method of average error, what are the constant and variable errors? || Constant error: average deviation from the true value (the bias or illusion size). Variable error: spread of settings (precision).
2. Where is the two-point threshold smallest? || Fingertips and lips.
3. What is subitising? || Instantly perceiving the number of a small set (about four) without counting.
4. How is the cost of divided attention measured in a typical practical? || By comparing performance on a task alone with performance while doing a second task.
:::

:::mcq
Q: In a Müller-Lyer practical, balancing trials that start with the variable line too long and too short controls for:
- Space error
- The constant error itself
- *Movement (direction) error
- Subitising
> Starting direction effects are cancelled by balancing ascending and descending starts.
:::

# Part IV · Exam zone

## 4.1 Q&A bank · Starting [starting]
Think each question through, then open the answer and compare.

:::qa What is the difference between sensation and perception? Give an everyday example. [starting]
### Short answer
Sensation is detecting physical energy and turning it into nerve signals. Perception is organising and interpreting those signals so that they mean something.

### Step by step
1. **Energy arrives**: light, sound waves, molecules, pressure.
2. **Receptors transduce it**: rods and cones, hair cells, taste and smell receptors, skin receptors.
3. **Signals travel** to the thalamus (except smell) and the sensory cortex.
4. **Perception adds meaning**, using both the input (bottom-up) and what you already know and expect (top-down).

| | Sensation | Perception |
|---|---|---|
| Question it answers | "Is something there?" | "What is it, and what does it mean?" |
| Main machinery | Receptors and sensory nerves | Cortex, memory, attention |
| Shaped by expectation? | Very little | A great deal |

### Example
At a busy railway station, sound waves from hundreds of voices reach your ears: that is sensation. Picking out the announcement of your train, and knowing it means "platform 4, hurry", is perception.
:::

:::qa Why is the absolute threshold defined as the level detected on 50 percent of trials, rather than the level at which a person first detects something? [starting]
### Short answer
Because detection does not switch on at one exact point. As intensity rises, the chance of detection rises gradually, so a fixed percentage is the only fair way to define a threshold.

### Why detection is gradual
- The nervous system always has some random background activity (noise), so the same weak stimulus sometimes stands out and sometimes does not.
- Attention, fatigue and expectation vary from trial to trial.
- Plotting "percent detected" against intensity gives an S-shaped curve, not a step.

### Why 50 percent
- It sits at the steepest part of the curve, where small changes in intensity make the biggest difference, so it is measured most precisely.
- It allows fair comparison between people, senses and conditions.

:::note Link forward
At the Beginner level, signal detection theory goes further: it shows that the "threshold" also depends on how willing a person is to say "yes".
:::
:::

:::qa Explain Weber's law with a worked example. Why is it useful? [starting]
### Short answer
Weber's law says the smallest change you can notice (the just noticeable difference) is a constant fraction of the starting amount, not a constant amount.

### Worked example
- The Weber fraction for lifted weight is about 2 percent.
- Holding 500 grams, you need about 10 grams more to notice a change (2 percent of 500).
- Holding 5 kilograms, you need about 100 grams more (2 percent of 5,000).

### Why it matters
- It was one of the first **laws** in psychology, linking a physical quantity to experience with a simple rule.
- It explains everyday design: dimmer switches, volume controls and price changes are noticed in proportional, not absolute, steps.
- It lets us compare senses: a smaller fraction means a sharper sense (pitch is far sharper than brightness).
:::

:::qa What is inattentional blindness, and what does it teach us about attention? [starting]
### Short answer
It is failing to notice an unexpected object in plain view because attention is busy with something else. It shows that we see clearly only what we attend to.

### Key evidence
- In the "invisible gorilla" study, about half of viewers counting basketball passes missed a person in a gorilla suit walking through the scene.
- Expert radiologists searching CT scans for lung nodules missed a gorilla image inserted into the scan.

### Lessons
1. Attention is **selective** and **limited**.
2. Looking is not seeing: eyes can point at something that the mind never registers.
3. Harder tasks leave less attention for the unexpected.
4. Practical uses: road safety (drivers on phone calls), eyewitness accounts, clinical checklists that force a deliberate look for the unexpected.
:::

:::qa Name and explain four Gestalt principles of perceptual organisation, with Indian examples. [starting]
### Short answer
Gestalt principles describe how the brain groups parts into wholes. Four common ones are proximity, similarity, closure and common fate, all guided by the master principle of Prägnanz (simplest organisation).

| Principle | What it says | Indian example |
|---|---|---|
| **Proximity** | Close items are grouped | Dots in a kolam spaced in rows are read as lines |
| **Similarity** | Similar items are grouped | A stadium section in the same team colour looks like one block |
| **Closure** | Gaps are filled to see complete shapes | A rangoli of separate dots is seen as one flower |
| **Common fate** | Items moving together are grouped | A flock of birds over the Chilika lake turning as one |

### Why it matters
These rules explain why logos, signs and teaching slides are read quickly when they follow them, and confusingly when they do not.
:::

:::qa What is transduction? Explain it for two senses. [starting]
### Short answer
Transduction is the conversion of physical energy into electrical signals in the nervous system. Every sense has receptors specialised for one kind of energy.

| Sense | Energy | Receptor | What happens |
|---|---|---|---|
| Vision | Light | Rods and cones | Light changes a pigment molecule, which changes the cell's electrical charge |
| Hearing | Pressure waves | Hair cells in the cochlea | Bending of tiny hairs opens channels and creates a signal |
| Touch | Pressure | Mechanoreceptors in the skin | Stretching the membrane opens channels |
| Taste and smell | Chemicals | Taste and olfactory receptors | Molecules bind to receptor proteins |

### Why it matters
Whatever the energy, the brain receives only nerve impulses. Which sense you experience depends on which pathway is active, not on the stimulus (the law of specific nerve energies).
:::

:::qa What is sensory adaptation, and why is it useful? Give two examples. [starting]
### Short answer
Sensory adaptation is a fall in response when a stimulus stays the same. It frees the senses to detect change, which usually matters more.

### Examples
- The strong smell of a fish market fades after a few minutes.
- You stop feeling your watch or spectacles.
- Cold water in a swimming pool feels warmer after a minute.

### Why it is useful
1. Change often signals danger or opportunity; a steady background rarely does.
2. It saves processing for new information.
3. It lets each sense work across a huge range of intensities.

### Adaptation versus habituation
Adaptation happens in the receptors and early pathways; habituation is learning in the brain to ignore an unimportant stimulus.
:::

:::qa What is the difference between bottom-up and top-down processing? Give an everyday example where both work together. [starting]
### Short answer
Bottom-up processing builds perception from the raw input upwards. Top-down processing uses knowledge, expectation and context to interpret that input.

| | Bottom-up | Top-down |
|---|---|---|
| Starts from | Features in the stimulus | What you know and expect |
| Direction | Data-driven | Concept-driven |
| Example | Detecting the edges and colours of a sign | Reading a smudged sign because you know the shop |

### Both together
Reading handwritten notes: the ink shapes give bottom-up information; your knowledge of words and of the topic fills gaps. Neither alone would be enough.
:::

:::qa What is the cocktail party effect, and what does it show about attention? [starting]
### Short answer
It is the ability to follow one conversation in a noisy room while still noticing important sounds, such as your own name, from conversations you were ignoring.

### What it shows
1. Attention is **selective**: we can focus on one stream among many.
2. Ignored information is **not completely blocked**: some of it is processed enough to catch important words.
3. Physical cues (voice, location) help separate one speaker from others.

### Where it leads
These observations started the scientific study of attention and the debate about whether selection happens early (before meaning) or late (after meaning), which you meet at the Beginner level.
:::

:::qa Name and explain four kinds of attention, with examples from daily life. [starting]
| Kind | What it does | Example |
|---|---|---|
| **Selective** | Focuses on one source, ignoring others | Listening to the teacher while the class next door is noisy |
| **Divided** | Shares attention between tasks | Stirring the dal while talking on the phone |
| **Sustained** | Stays alert for rare events over time | A night guard watching CCTV |
| **Executive** | Overrides habits, switches and plans | Not checking your phone during a viva |

### Key points
- All four draw on a **limited** capacity.
- Performance on divided tasks drops when both tasks use the same kind of resource.
- Sustained attention falls within the first half hour of a dull watch.
:::

:::qa What are depth cues? Explain three monocular cues and one binocular cue. [starting]
### Short answer
Depth cues are pieces of information the brain uses to judge distance and three-dimensional shape from a flat retinal image.

### Monocular cues (one eye is enough)
- **Interposition**: a nearer object hides part of a farther one.
- **Linear perspective**: parallel lines, like railway tracks, seem to meet in the distance.
- **Aerial perspective**: distant hills look hazy and bluish.

### Binocular cue
- **Retinal disparity**: each eye sees a slightly different view; the brain combines them into a vivid sense of depth (stereopsis). 3D films work by giving each eye a different image.

### Why it matters
Artists use monocular cues to create depth on a flat canvas; people who lose sight in one eye can still judge depth fairly well using them.
:::

:::qa What are perceptual constancies? Describe size, shape and lightness constancy. [starting]
### Short answer
Perceptual constancy is seeing an object as stable in size, shape, brightness or colour even though its image on the retina keeps changing.

| Constancy | Stays the same | Despite | Example |
|---|---|---|---|
| Size | Perceived size | A shrinking image with distance | A bus driving away does not seem to shrink |
| Shape | Perceived shape | A changing image as it turns | An opening door still looks rectangular |
| Lightness | Perceived whiteness | Changes in light | A white kurta looks white in sun and shade |

### Why it matters
Without constancy, the world would seem to change size, shape and colour every time we moved. Constancy depends on judging distance, angle and lighting, which is why some illusions fool it.
:::

:::qa What is the difference between an illusion and a hallucination? [starting]
### Short answer
An illusion is a misperception of something that is really there. A hallucination is a perception with no external stimulus at all.

| | Illusion | Hallucination |
|---|---|---|
| Stimulus present? | Yes | No |
| Who has it? | Everyone, under the right conditions | Uncommon; occurs in illness, sleep deprivation, drugs, grief and some healthy people |
| Example | Equal lines looking unequal (Müller-Lyer); a coat on a hook seen as a person in the dark | Hearing a voice when nobody is speaking |
| Meaning | Shows the brain's normal rules misapplied | May need clinical assessment |

### Clinical note
In delirium and severe fear, illusions become common. Context matters: some experiences, such as hearing a dead relative's voice during grief, are culturally understood and not always signs of illness.
:::

:::qa Why do we have a blind spot, and why don't we notice it? [starting]
### Short answer
The blind spot is where the optic nerve leaves the eye. There are no rods or cones there, so light falling on it is not detected.

### Why we don't notice it
1. The two blind spots fall on different parts of the scene, so each eye covers the other's gap.
2. Even with one eye, the brain **fills in** the missing area using surrounding colour and pattern.
3. The eyes move constantly, so no part of the scene stays in the gap.

### What it teaches
Perception is not a direct copy of the retinal image. The brain constructs a complete, seamless picture from incomplete input.
:::

## 4.2 Q&A bank · Beginner [beginner]
Answers here assume the Beginner sections. Write your own outline first.

:::qa How does signal detection theory improve on classical threshold theory? Use the four outcomes and d′ in your answer. [beginner]
### Short answer
Classical theory assumes one fixed threshold. Signal detection theory shows that every detection decision mixes two separate things: **sensitivity** (how well signal can be told from noise) and **response bias** (how willing the person is to say "yes"). It measures each separately.

### The four outcomes
| | Says "yes" | Says "no" |
|---|---|---|
| Signal present | Hit | Miss |
| Signal absent | False alarm | Correct rejection |

### The two measures
- **d′ (sensitivity)**: the distance between the noise and signal-plus-noise distributions; z(hit rate) minus z(false-alarm rate).
- **Criterion (bias)**: where the observer sets the cut-off for saying "yes". Liberal means more hits and more false alarms; conservative means fewer of both.

### Why it is better
1. Explains why thresholds shift with rewards, costs and expectations.
2. Separates what training or better equipment can change (d′) from what instructions and payoffs change (criterion).
3. Provides the ROC curve and the area under it, now standard for judging diagnostic tests.

### Example
Two radiologists may be equally sensitive, but the one told "never miss a cancer" reports more positives. Only SDT can show that her eyes did not change; her criterion did.
:::

:::qa Compare the trichromatic and opponent-process theories of colour vision. How are they reconciled? [beginner]
### Short answer
Trichromatic theory explains colour at the level of the cones; opponent-process theory explains it at the level of later neurons. Both are correct at different stages, which is the dual-process view.

| | Trichromatic (Young, Helmholtz) | Opponent-process (Hering) |
|---|---|---|
| Claim | Three cone types, peaking near 420, 530 and 560 nm | Three opposing channels: red-green, blue-yellow, black-white |
| Explains | Colour matching with three primaries; most colour deficiency | Negative afterimages; why no "reddish green" exists; some patterns of deficiency |
| Cannot explain | Afterimages; the four "unique" hues | Why there are three cone types |

### The reconciliation
- At the **retina**, three cone types code wavelength (trichromatic).
- In **ganglion cells and the thalamus**, cone signals are combined into opponent pairs.
- Hurvich and Jameson called this the **dual-process** theory.

### Clinical and design note
Red-green deficiency is common in men, so teaching materials and charts should never rely on colour alone.
:::

:::qa Trace the debate between early and late selection theories of attention. Which experiments moved the debate forward? [beginner]
### Short answer
Broadbent placed the filter early, before meaning. Evidence that some unattended meaning gets through led Treisman to an attenuation model, and Deutsch and Deutsch to late selection. Modern views say selection is flexible and depends on load.

### The sequence
1. **Cherry (1953)**: shadowing one ear; almost nothing of the other ear's content is remembered, but physical changes are noticed.
2. **Broadbent (1958)**: a filter on physical features; split-span data fit.
3. **Challenges**: Moray (own name noticed by about a third), Gray and Wedderburn ("Dear Aunt Jane"), Treisman (following a story across ears), Corteen and Wood (skin responses to shock-linked words).
4. **Treisman (1964)**: unattended input is weakened; a dictionary of thresholds lets important words through.
5. **Deutsch and Deutsch (1963); Norman (1968)**: everything is analysed for meaning; selection is by importance near response.
6. **Johnston and Heinz; Lavie**: selection can be early or late. High perceptual load forces early selection; low load allows late selection.

### Evaluation
Brain recordings show attention changing sensory responses within about a tenth of a second (early effects) and some meaning extracted from ignored words (late effects). The question "early or late?" is now "when, and under what load?".
:::

:::qa A student says "the visual cliff proves depth perception is innate". Evaluate this claim. [beginner]
### Short answer
The visual cliff shows depth is perceived early, not that it is innate in humans, because the crawling infants tested already had months of visual experience.

### What the study found
- Of 36 infants aged 6 to 14 months, nearly all who moved crawled to their mothers over the shallow side; only 3 crossed the deep side.
- Newborn animals that walk at birth (chicks, kids, lambs) avoided the deep side at once.

### Why it does not prove innateness
1. Human infants cannot be tested until they crawl, by which time they have learned a great deal.
2. Later studies found that pre-crawling infants placed over the deep side showed **heart-rate slowing** (interest, so they perceive a difference), while **fear** (heart-rate rise) appeared only after crawling experience.

### Balanced conclusion
Perceiving depth develops very early, possibly with an inborn basis; fearing heights depends on experience of moving around by oneself.
:::

:::qa Explain the gate control theory of pain. What everyday and clinical observations does it explain? [beginner]
### Short answer
Melzack and Wall proposed a "gate" in the spinal cord that controls how much pain signal reaches the brain. Small pain fibres open it; large touch fibres and messages from the brain can close it.

### The mechanism
- **Location**: the dorsal horn of the spinal cord.
- **Opening**: activity in thin A-delta and C fibres.
- **Closing**: activity in thick A-beta touch fibres (rubbing a knock).
- **Descending control**: attention, mood, expectation and meaning, sent down from the brain.

### What it explains
| Observation | Explanation |
|---|---|
| Rubbing a bumped elbow helps | Touch fibres close the gate |
| Distraction, hypnosis and calm reduce pain | Descending signals close the gate |
| Anxiety and catastrophising worsen pain | Descending signals open the gate |
| TENS machines relieve pain | Electrical stimulation of large fibres |
| Severe wounds in battle sometimes hurt little at first | Meaning and arousal close the gate |

### Limitation
Phantom limb pain shows pain can arise with no input at all, which led to Melzack's later idea of a brain-wide pain network (the neuromatrix).
:::

:::qa Compare the three classical psychophysical methods. Which would you use to measure a hearing threshold quickly, and which for a research study? [beginner]
| Method | Procedure | Strength | Weakness |
|---|---|---|---|
| Limits | Stimulus raised or lowered in steps until the response changes | Quick | Habituation and expectation errors; needs ascending and descending series |
| Constant stimuli | Fixed intensities presented many times at random | Most accurate; no order errors | Slow and tiring |
| Adjustment | Participant adjusts the stimulus | Fast and engaging | Least precise |

### Choice
- **Quick clinical threshold**: a modified method of limits, as in audiometry, often as an adaptive staircase.
- **Research**: constant stimuli, to plot a full psychometric function and read its 50 percent point.
:::

:::qa Calculation: the Weber fraction for loudness is 0.05. A tone is at 60 units. What is the JND? What would it be at 240 units? [beginner]
### Working
1. JND equals k times I.
2. At 60 units: 0.05 × 60 = **3 units**.
3. At 240 units: 0.05 × 240 = **12 units**.

### Interpretation
Four times the starting intensity needs four times the change. The proportion (5 percent) stays the same, which is Weber's law.

:::trap Watch the base
Always multiply the fraction by the **starting** (standard) intensity, not by the changed value.
:::
:::

:::qa Calculation: using Stevens' power law, how much does perceived brightness change if light intensity is multiplied by 8, given an exponent of about 0.33? [beginner]
### Working
1. Sensation is proportional to intensity raised to n.
2. Ratio of sensations = 8 raised to 0.33.
3. 8 raised to one-third = **2**.

### Interpretation
Eight times the light looks only about twice as bright. Brightness is strongly compressive, which protects vision across the huge range from starlight to sunlight. By contrast, with an exponent of about 3.5, doubling an electric shock makes it feel roughly eleven times stronger.
:::

:::qa Calculation: in a detection task, an observer has a hit rate of 0.69 and a false-alarm rate of 0.31. The z-scores are about +0.5 and minus 0.5. Find d′ and describe the bias. [beginner]
### Working
1. d′ = z(hit rate) minus z(false-alarm rate).
2. d′ = 0.5 minus (minus 0.5) = **1.0**.

### Bias
Misses (0.31) equal false alarms (0.31), so the criterion is **neutral**, halfway between the two distributions.

### Interpretation
A d′ of 1 is modest sensitivity: the signal and noise distributions overlap a lot. Compare with a d′ of 2, where they are well separated.
:::

:::qa Distinguish the place, frequency and volley theories of pitch. Which range does each explain? [beginner]
| Theory | Claim | Best for |
|---|---|---|
| Place (Helmholtz; von Békésy) | Each frequency vibrates the basilar membrane most at a particular place; high near the base, low near the apex | High frequencies |
| Frequency (Rutherford) | Nerve fibres fire at the same rate as the sound wave | Low frequencies, up to about 1,000 Hz |
| Volley (Wever and Bray) | Groups of fibres fire in turn, together following faster rhythms | About 1,000 to 4,000 or 5,000 Hz |

### Modern view
All three operate: timing codes low tones, place codes high tones, and both combine in the middle. Cochlear implants use the place principle by stimulating different points along the cochlea.
:::

:::qa Describe Hubel and Wiesel's discoveries and explain their importance for theories of pattern recognition. [beginner]
### Findings
- **Simple cells** respond to a bar of a particular orientation in a particular position.
- **Complex cells** respond to that orientation anywhere in a region, often when moving.
- **Hypercomplex (end-stopped) cells** respond to bars of a particular length or to corners.
- Cells are arranged in orientation columns and ocular dominance columns.
- Early visual deprivation (one eye closed in kittens) permanently changes these columns, showing a sensitive period.

### Importance
1. Physiological support for **feature analysis** theories such as Pandemonium.
2. A model of **hierarchical** processing from simple to complex features.
3. Clinical relevance: amblyopia ("lazy eye") must be treated early, during the sensitive period.
:::

:::qa Explain Kahneman's capacity model of attention and how it differs from filter models. [beginner]
### Short answer
Kahneman described attention as a limited pool of mental effort that can be shared between tasks, rather than a filter on a single channel.

### Components
- **Available capacity**, which rises and falls with arousal.
- **Allocation policy**, shaped by enduring dispositions (sudden movement, your name), momentary intentions and an evaluation of demands.
- **Possible activities**, each drawing on the pool.

### How it differs
| | Filter models | Capacity model |
|---|---|---|
| Question | Where is information selected? | How is effort shared? |
| Explains | Dichotic listening results | Dual-task performance; effects of arousal and practice |
| Weakness | Rigid; one channel | One pool cannot explain why some task pairs interfere little (multiple resources) |
:::

:::qa What is feature integration theory? Describe the evidence from visual search and illusory conjunctions. [beginner]
### Short answer
Treisman proposed that simple features are registered in parallel without attention, and that focused attention is needed to bind features into objects.

### Evidence
1. **Feature search**: a red target among green items pops out; search time stays flat as distractors increase.
2. **Conjunction search**: a red T among red Xs and green Ts needs serial checking; search time rises steeply with distractors.
3. **Illusory conjunctions**: with attention overloaded, people report wrong combinations, such as a blue X when a blue O and red X were shown.
4. **Balint's syndrome**: patients with parietal damage show many binding errors.

### Later revisions
Wolfe's guided search showed that feature information can guide attention during conjunction search, softening the strict two-stage split.
:::

:::qa Describe the major monocular and binocular depth cues and say which work at long and short distances. [beginner]
| Cue | Type | Range |
|---|---|---|
| Interposition | Pictorial | Any distance |
| Relative and familiar size | Pictorial | Any distance |
| Linear perspective, texture gradient | Pictorial | Medium to long |
| Aerial perspective | Pictorial | Long (kilometres) |
| Motion parallax | Movement | Short to medium |
| Accommodation | Oculomotor | Very short (about 2 metres) |
| Convergence | Oculomotor, binocular | Short (a few metres) |
| Retinal disparity | Binocular | Short to medium; strongest within about 30 metres |

### Key idea
No single cue is enough. The brain combines cues, weighting each by its reliability at that distance.
:::

:::qa Explain the phi phenomenon and the autokinetic effect. Why are they important in the history of psychology? [beginner]
### Phi phenomenon
Lights flashing on and off in sequence are seen as one light moving. Wertheimer's study of it in 1912 founded Gestalt psychology, because the movement is a property of the whole pattern, not of any single light. Film, LED signboards and festival chaser lights rely on it.

### Autokinetic effect
A still point of light in a completely dark room seems to drift, because there is no frame of reference and the eyes make small movements.

### Historical importance
| Phenomenon | Used by | Showed |
|---|---|---|
| Phi | Wertheimer | Perception of wholes; Gestalt psychology |
| Autokinetic | Sherif | How group norms form when reality is ambiguous: estimates of movement converged in groups |
:::

## 4.3 Q&A bank · Advanced [advanced]
These are the long, analytical questions asked in NET Paper 2, clinical entrance interviews and MA examinations.

:::qa Critically compare Gibson's direct theory and Gregory's constructivist theory of perception, and show how modern accounts reconcile them. [advanced]
### Short answer
Gibson argued that the light reaching a moving observer contains all the information needed, picked up directly. Gregory argued that input is ambiguous, so the brain builds hypotheses from knowledge. Each explains different evidence, and modern two-stream and predictive accounts give each a role.

### Gibson
- Optic array, optic flow, invariants (texture gradients), affordances, resonance.
- Best evidence: pilots and drivers steering by optic flow; real, moving observers in rich environments.
- Weakness: cannot explain illusions or how knowledge changes what we see.

### Gregory
- Unconscious inference (Helmholtz); perception as hypothesis testing; illusions as misapplied hypotheses.
- Best evidence: hollow-face illusion, ambiguous figures, perceptual set, Müller-Lyer.
- Weakness: relies on brief, impoverished displays; if perception is guesswork, why is it usually so accurate?

### Reconciliations
| Account | How it combines them |
|---|---|
| Neisser's perceptual cycle | Schemata guide exploration; exploration samples the world; samples update schemata |
| Milner and Goodale's two streams | Dorsal "vision for action" is fast and direct; ventral "vision for recognition" uses knowledge |
| Predictive processing | The brain predicts input and processes the prediction error, weighting priors against the reliability of the evidence |

### Conclusion
The theories answer different questions: Gibson asks what information is available to an active observer; Gregory asks how the brain interprets incomplete input. Both are needed.
:::

:::qa Does culture shape perception? Evaluate the evidence. [advanced]
### Short answer
Yes, for some aspects of perception, especially the interpretation of pictures, susceptibility to certain illusions, and perceptual style. Basic sensory processes are largely universal.

### Evidence for cultural influence
1. **Carpentered-world hypothesis**: Segall, Campbell and Herskovits found people in urban, rectangular environments more susceptible to the Müller-Lyer illusion than people in rural communities with round houses.
2. **Pictorial depth**: Hudson found many unschooled South African participants read drawings as flat; schooling and exposure to pictures increased 3D readings.
3. **Size constancy over distance**: Turnbull's account of a forest dweller taking distant buffalo for insects.
4. **Holistic versus analytic attention**: Japanese students described backgrounds and relationships more than Americans did.
5. **Ecology and cognitive style**: Berry's eco-cultural studies and Mishra, Sinha and Berry's work with Adivasi communities in Bihar linked disembedding skills to ecology, schooling and contact with towns.

### Cautions
- Differences in schooling, test familiarity and even eye pigmentation can explain part of the findings.
- Some cultural differences reflect judgment and description rather than perception itself.
- Colour perception and basic depth cues are broadly universal.

### Conclusion
Culture shapes how people use and interpret perceptual information, and what they attend to, through experience and learning. It is a strong argument for a constructive, learned element in perception.
:::

:::qa How can signal detection theory be applied to hallucinations and to clinical diagnosis? [advanced]
### Short answer
SDT treats a hallucination as a "false alarm": reporting a signal when none is present. Research shows that hallucination-prone people differ mainly in **criterion** (a more liberal bias), not in sensitivity. The same logic underlies how diagnostic tests are judged.

### Hallucinations
- In a classic study, students prone to hallucinations listened to noise that sometimes contained a voice. They said "yes, a voice" more often, but their d′ was no different: a **liberal response bias**.
- This fits models in which expectations (priors) are too strong, or monitoring of the source of inner speech is weak.
- Clinical implication: therapy can work on beliefs and expectations about voices (CBT for psychosis), not only on "faulty hearing".

### Diagnosis and screening
| SDT idea | Clinical equivalent |
|---|---|
| Hit rate | Sensitivity of a test |
| Correct-rejection rate | Specificity |
| Criterion | Cut-off score |
| ROC curve and its area | How well a test separates cases from non-cases across all cut-offs |

### Example
A suicide-risk scale with a low cut-off catches more people at risk (more hits) but flags many who are not (false alarms). Where to set the cut-off depends on the cost of each error and on what follows a positive screen.
:::

:::qa Describe hemispatial neglect: its features, cause, assessment and theories. [advanced]
### Short answer
Neglect is a failure to attend to one side of space, usually the left after right parietal damage, with intact basic vision. It is a disorder of attention, not of sight.

### Features
- Eats from one half of the plate, shaves or dresses one side, ignores people on the left.
- Line bisection marked to the right; cancellation tests with left omissions; drawings missing the left side.
- Often denial of the problem (anosognosia).
- Can affect imagined space too: patients asked to describe a familiar square from memory omit the left side of the image.

### Cause
Right inferior parietal lobe and temporoparietal junction, part of the right-lateralised ventral attention network. Left-sided damage rarely causes lasting neglect because the right hemisphere attends to both sides.

### Assessment
Line bisection, star and letter cancellation, copying and drawing tasks, observation of daily activities.

### Theories
1. **Attentional bias**: the intact hemisphere pulls attention to the right.
2. **Disengagement deficit**: difficulty moving attention away from the right to the left (shown in cueing tasks).
3. **Representational**: the internal map of space is damaged, explaining neglect of imagined scenes.

### Management
Cueing to the left, visual scanning training, prism adaptation, safety planning for walking and road crossing.
:::

:::qa "Perception is a constructive process." Discuss with reference to illusions, perceptual set and the New Look. [advanced]
### Short answer
Much evidence shows that perception goes beyond the input, using knowledge, expectation and motivation, but critics warn that some "top-down" effects are effects on judgment rather than on seeing.

### Evidence for construction
- **Illusions**: Müller-Lyer, Ponzo and the moon illusion follow from depth and constancy rules applied where they do not fit.
- **Ambiguous figures and the hollow face**: one stimulus, different perceptions driven by expectation.
- **Perceptual set**: primed with animals, people see a rat in the rat-man figure.
- **New Look**: poor children overestimating coin sizes; incongruous playing cards misperceived; hungry people judging food pictures brighter.
- **Perceptual defence**: higher recognition thresholds and early skin responses for taboo words.

### Critique
1. Taboo words are rarer in print and may be withheld from report, explaining much of perceptual defence.
2. Many New Look effects may be changes in **judgment**, memory or response bias, not perception.
3. A 2016 critique listed pitfalls (demand effects, low-level stimulus differences, attention effects) that explain most claimed top-down effects.

### Conclusion
Perception is constructive in its use of context, expectation and attention, as predictive accounts suggest, but claims that wishes and moods directly change what we see need careful, well-controlled evidence.
:::

:::qa Compare Weber's, Fechner's and Stevens' laws. Why did Stevens' law replace Fechner's for many purposes? [advanced]
| Law | Statement | Method | Shape |
|---|---|---|---|
| Weber | JND is a constant fraction of intensity | Difference thresholds | Linear growth of the JND |
| Fechner | Sensation grows with the logarithm of intensity | Derived by adding up JNDs | Always compressive |
| Stevens | Sensation grows as intensity raised to a power n | Magnitude estimation | Compressive (n below 1), linear (n = 1) or expansive (n above 1) |

### Why Stevens replaced Fechner
1. Fechner assumed every JND is an equal step of sensation; direct scaling showed it is not.
2. Fechner's law cannot explain expansive senses such as electric shock.
3. Magnitude estimation gave consistent power functions across many dimensions, and cross-modal matching confirmed them.

### Critiques of Stevens
Exponents shift with the range of stimuli, the first number given and the response scale, so they are context-dependent descriptions rather than fixed constants.
:::

:::qa What is an ROC curve? How is it used to compare diagnostic tests? [advanced]
### Short answer
A receiver operating characteristic curve plots the hit rate against the false-alarm rate as the criterion moves from strict to lenient. Its shape shows sensitivity independent of bias.

### Reading it
- The diagonal is chance (d′ of zero).
- Curves bowing towards the top-left show better discrimination.
- The **area under the curve** runs from 0.5 (chance) to 1.0 (perfect).

### Use in clinical work
| Use | Example |
|---|---|
| Choosing a cut-off | A depression screening questionnaire: lower cut-offs catch more cases but flag more non-cases |
| Comparing tests | Two dementia screens compared by area under the curve |
| Showing the trade-off | Sensitivity and specificity move in opposite directions along the curve |

### Point
A test is not "good" at one cut-off; its value is the whole curve, and the best cut-off depends on the costs of misses and false alarms.
:::

:::qa Explain Lavie's load theory. How does it resolve the early versus late selection debate? [advanced]
### Short answer
Load theory says the stage of selection depends on perceptual load. When the main task is perceptually demanding, no capacity is left for distractors, so they are filtered early. When the task is easy, spare capacity spills over to distractors, which are processed late.

### Two kinds of load
| Load | Effect on distractors | Reason |
|---|---|---|
| High perceptual load | Less interference | No capacity left to perceive them |
| High cognitive (working memory) load | More interference | Control processes that keep priorities are weakened |

### Evidence
Flanker interference falls as the number of items in the search display rises; brain imaging shows reduced visual responses to distractors under high load.

### Applications
Tasks that are perceptually rich can protect against distraction, while stress and memory load make people more distractible. This helps explain distraction in anxiety and ADHD.
:::

:::qa Explain Milner and Goodale's two visual streams. What evidence supports them? [advanced]
### Short answer
The ventral stream (to the temporal lobe) supports vision for perception and recognition; the dorsal stream (to the parietal lobe) supports vision for action, guiding reaching and grasping in real time.

### Evidence
1. **Patient D. F.**, with ventral damage from carbon monoxide poisoning, could not report the orientation of a slot but could post a card through it accurately.
2. **Optic ataxia**, with dorsal damage, shows the reverse: recognition is fine but reaching is inaccurate.
3. In some studies, grasp size is less affected by size illusions than verbal judgments of size.

### Importance
It refines the earlier "what versus where" model, offers a way to reconcile Gibson (dorsal, direct, action-based) and Gregory (ventral, knowledge-based), and explains dissociations seen after stroke.
:::

:::qa Explain the attentional blink and the psychological refractory period. What do they tell us about the limits of attention? [advanced]
| | Attentional blink | Psychological refractory period |
|---|---|---|
| Task | Report two targets in a rapid stream | Respond to two stimuli in quick succession |
| Finding | Second target missed 200 to 500 ms after the first; spared just after (lag-1 sparing) | Second response delayed; delay shrinks as the gap grows |
| Explanation | Processing the first target ties up consolidation into working memory | A central bottleneck in choosing a response |
| What it shows | A limit in time on conscious report | A limit on making two decisions at once |

### Wider lesson
Attention has limits at several stages: perception (load), consolidation (blink) and response selection (bottleneck). Practice reduces but rarely removes them.
:::

:::qa Discuss the clinical significance of attentional bias in anxiety, and evaluate attention bias modification. [advanced]
### Attentional bias
Anxious people detect and dwell on threat faster: in the **dot-probe** task, they respond faster to probes replacing threat words; in the **emotional Stroop**, they are slower to name the ink of threat words. Bias helps maintain anxiety by repeatedly confirming that danger is everywhere.

### Attention bias modification
Computer training that places probes mostly behind neutral stimuli, to train attention away from threat.

### Evaluation
| For | Against |
|---|---|
| Early trials showed reduced anxiety | Later meta-analyses found small effects, shrinking with better-quality trials |
| Cheap and scalable | Many people show no measurable bias to begin with |
| Plausible mechanism | Effects on real-world symptoms are inconsistent |

### Conclusion
Attentional bias is a real maintaining factor, but training it alone is not an adequate treatment; CBT with exposure remains first-line.
:::

:::qa How would you explain Charles Bonnet syndrome to an older patient and family, and how does it differ from psychosis? [advanced]
### What to say
"When the eyes send less information to the brain, the visual parts of the brain can produce pictures of their own. It is like the brain filling in a blank screen. It is common in people with poor eyesight and is not a sign of madness or of dementia."

### Differences from psychosis
| Feature | Charles Bonnet syndrome | Psychosis |
|---|---|---|
| Insight | Knows the images are not real | Often believes they are real |
| Modality | Visual, often detailed (patterns, small people, faces) | Mostly auditory |
| Associated | Visual loss (cataract, glaucoma, macular degeneration) | Delusions, disorganisation, mood change |
| Distress | Often fear of being thought mad | Varies |

### Management
Reassurance and explanation, treat the eye problem (cataract surgery), improve lighting, blink or move the eyes when images appear, and rule out delirium and dementia.
:::

:::qa Design an experiment to test whether expertise affects inattentional blindness. Include variables, design and controls. [advanced]
### Hypothesis
Experts searching within their domain will notice unexpected domain-irrelevant objects less often than novices, because their focused search is more efficient.

### Design
- **Participants**: radiologists and medical students (quasi-experimental grouping by expertise).
- **Task**: search chest CT slices for nodules; on a critical trial a small gorilla image appears.
- **Independent variable**: expertise (expert versus novice).
- **Dependent variables**: proportion noticing the unexpected image; nodule detection accuracy; eye-tracking fixations on the image.

### Controls
1. Same images and timing for both groups.
2. Ask "Did you see anything unusual?" only after the critical trial, so expectation is not raised.
3. Eye tracking to separate "did not look" from "looked but did not see".
4. Counterbalance image order.

### Ethics and limits
Informed consent with debriefing; expertise is not randomly assigned, so age and fatigue are possible confounds.
:::

:::qa Evaluate the New Look approach to perception. Which findings have survived? [advanced]
### The claim
Needs, values and emotions shape perception itself.

### Classic studies
- Poor children overestimated coin sizes more than rich children.
- Hungry people judged food pictures brighter.
- Incongruous playing cards (a red spade) were misperceived.
- Taboo words had higher recognition thresholds (perceptual defence).

### Problems
1. Word frequency and reluctance to say taboo words aloud explain perceptual defence.
2. Many effects are on **judgment or memory**, not perception.
3. Small samples and weak controls; some results did not replicate.

### What survived
| Survived | In modern form |
|---|---|
| Expectation shapes perception | Perceptual set, priming, predictive processing |
| Emotion grabs attention | Attentional bias to threat; emotion-induced blindness |
| Motivation affects what we notice | Effects mainly via attention rather than altered sensation |

### Conclusion
The broad idea, that perception is not neutral, is supported, but the mechanisms are mostly attentional and decisional.
:::

## 4.4 Long answers and short notes [core]
:::example Q1. Explain signal detection theory. How does it improve on classical threshold theory? Give applications. (15 marks)
1. Define the classical threshold and its assumption of a fixed cut-off; note the 50 percent rule.
2. The problem: detection depends on expectations and payoffs as well as the senses.
3. SDT basics: noise and signal-plus-noise distributions; the four outcomes (draw the 2 by 2 table); d′ (sensitivity) and the criterion (c or beta); liberal and conservative observers.
4. A worked number: hit rate 0.84 and false-alarm rate 0.16 give d′ of about 2.
5. The ROC curve and area under the curve.
6. Applications: radiology and screening, airport security, eyewitness line-ups, recognition memory, hallucination-proneness (Bentall and Slade), vigilance.
7. Evaluation: assumes normal, equal-variance distributions; needs many trials; strength is separating sensory from decision factors.
:::

:::example Q2. Compare early and late selection theories of attention, with experimental evidence. (15 marks)
1. Define selective attention; Cherry's dichotic listening and shadowing.
2. Broadbent's filter model (diagram: sensory buffer, filter on physical features, limited-capacity channel) and the split-span result.
3. Challenges: Moray's own name, Gray and Wedderburn, Treisman's ear switching, Corteen and Wood.
4. Treisman's attenuation model and the dictionary of thresholds.
5. Deutsch and Deutsch, and Norman: late selection by importance and pertinence.
6. Resolution: Johnston and Heinz's flexible model; Lavie's load theory; ERP evidence for early attentional modulation.
7. Conclusion with an applied example (driving, classroom).
:::

:::example Q3. Critically compare the perceptual theories of Gibson and Gregory. (15 marks)
1. The central question: how much does the brain add to the input?
2. Gibson: optic array, optic flow, invariants, texture gradients, affordances; evidence from pilots and moving observers.
3. Gregory: Helmholtz's unconscious inference; perception as hypothesis; illusions, ambiguous figures, the hollow face.
4. Comparison table: direction, view of the stimulus, role of knowledge, evidence, weaknesses.
5. Reconciliations: Neisser's perceptual cycle; Milner and Goodale's two streams; predictive processing.
6. Culture and perception as evidence for learning (Segall and colleagues, Hudson, Turnbull).
:::

### Short notes (5 marks each)
Weber's law · Stevens' power law · Methods of psychophysics · Opponent-process theory · Place and frequency theories of hearing · Gate control theory of pain · Feature integration theory · Kahneman's capacity model · Depth cues · Visual cliff · Perceptual constancy · Perceptual defence · Carpentered-world hypothesis · Hemispatial neglect · Pandemonium.

:::word Short note: Weber's law
Weber (1834) found that the just noticeable difference is a constant proportion of the starting stimulus: ΔI divided by I equals k. The Weber fraction k differs by sense (about 0.02 for lifted weight, 0.08 for brightness, 0.003 for pitch); a smaller fraction means a finer sense. Example: 2 grams is noticed on 100 grams, but 20 grams is needed on 1 kilogram. The law holds well in the middle range and fails near threshold and at extreme intensities. Fechner built on it to propose that sensation grows with the logarithm of intensity.
:::

:::word Short note: feature integration theory
Treisman and Gelade (1980) proposed two stages. In a pre-attentive stage, simple features (colour, orientation, size, movement) are registered in parallel across the visual field, so a target defined by one feature pops out regardless of the number of distractors. In a focused-attention stage, attention binds features at one location into an object, so conjunction search is slow and serial. Evidence: flat versus steep search slopes; illusory conjunctions when attention is overloaded; binding problems in Balint's syndrome. Later work (Wolfe's guided search) showed feature information can guide attention, softening the strict two-stage split.
:::

:::word Short note: gate control theory of pain
Melzack and Wall (1965) proposed a gate in the substantia gelatinosa of the dorsal horn. Small-diameter fibres (A-delta, C) carry pain and open the gate; large-diameter touch fibres (A-beta) close it; descending signals from the brain (attention, mood, expectation, meaning) can open or close it. It explains why rubbing helps, why distraction and hypnosis reduce pain, why anxiety worsens it, and why TENS works. Later, Melzack's neuromatrix theory explained phantom limb pain as generated by the brain's body map.
:::

## 4.5 Viva rapid-fire [core]
:::viva
Who founded psychophysics? :: Gustav Fechner, in 1860.
Define the absolute threshold. :: The intensity detected on 50 percent of trials.
Weber fraction for lifted weight? :: About 0.02.
Which law uses magnitude estimation? :: Stevens' power law.
Stevens' exponent for electric shock? :: About 3.5.
What does d′ measure? :: Sensitivity, separate from response bias.
What does an ROC curve plot? :: Hit rate against false-alarm rate across criteria.
Which cells give night vision? :: Rods.
Where are cones densest? :: The fovea.
Who discovered feature detectors? :: Hubel and Wiesel.
Name the two visual streams. :: Ventral (what) to temporal; dorsal (where or how) to parietal.
Which colour theory explains afterimages? :: Hering's opponent-process theory.
Peak wavelengths of the three cones? :: About 420, 530 and 560 nm.
Who won the Nobel for the travelling wave in the cochlea? :: Georg von Békésy.
Who proposed the volley principle? :: Wever and Bray.
What is the fifth basic taste? :: Umami.
Gate control theory, by whom? :: Melzack and Wall, 1965.
Who studied the cocktail party problem? :: Colin Cherry, 1953.
Early-selection theorist? :: Donald Broadbent, 1958.
Attenuation theorist? :: Anne Treisman.
Late-selection theorists? :: Deutsch and Deutsch; Norman.
Kahneman's model of attention? :: A capacity (effort) model with an allocation policy.
What pops out in visual search? :: A target defined by a single feature.
What binds features in Treisman's theory? :: Focused attention.
What is inhibition of return? :: Slower responses to a recently cued location after a reflexive cue.
Who made the clock test of vigilance? :: Norman Mackworth, 1948.
Attentional blink window? :: About 200 to 500 ms.
Three attention networks? :: Alerting, orienting and executive control (Posner and Petersen).
Founding phenomenon of Gestalt psychology? :: The phi phenomenon (Wertheimer, 1912).
Master Gestalt principle? :: Prägnanz.
Who built the visual cliff? :: Eleanor Gibson and Richard Walk, 1960.
Selfridge's model? :: Pandemonium.
Biederman's components? :: Geons.
Name two binocular cues. :: Retinal disparity and convergence.
Emmert's law? :: Afterimage size grows with perceived distance.
Who proposed affordances? :: James Gibson.
Who called perception hypothesis testing? :: Richard Gregory.
Marr's three stages? :: Primal sketch, 2.5D sketch, 3D model.
Carpentered-world hypothesis, by whom? :: Segall, Campbell and Herskovits.
Who coined perceptual defence? :: Elliott McGinnies, 1949.
Coin-size study? :: Bruner and Goodman, 1947.
Rat-man figure study? :: Bugelski and Alampay, 1961.
Lesion in left neglect? :: Right parietal lobe or temporoparietal junction.
Hallucinations with insight in visual loss? :: Charles Bonnet syndrome.
Core attentional feature of delirium? :: Inattention, fluctuating.
:::

## 4.6 Module test [core]
Answer every question before checking. Your best score is saved.

:::mcq
Q: The process by which a sense receptor converts physical energy into neural signals is:
- Perception
- *Transduction
- Accommodation
- Adaptation
> Transduction happens at the receptor.

Q: If the Weber fraction for weight is 0.02, the JND for a 3-kilogram load is about:
- 6 grams
- 20 grams
- 600 grams
- *60 grams
> 0.02 times 3,000 grams is 60 grams.

Q: Which method of psychophysics is most vulnerable to errors of habituation and expectation?
- *Method of limits
- Method of constant stimuli
- Magnitude estimation
- Method of paired comparison
> Ordered series invite persistence and anticipation errors.

Q: Fechner's law is best summarised as:
- *Sensation grows with the logarithm of intensity
- Sensation equals intensity raised to a power
- Sensation is proportional to stimulus intensity
- The JND is constant in absolute units
> Fechner's law is logarithmic.

Q: Statement I: Stevens' power law has an exponent below 1 for brightness. Statement II: This means brightness grows more slowly than light intensity. Which is correct?
- Only Statement I is correct
- Only Statement II is correct
- Both are incorrect
- *Both are correct, and II explains I
> An exponent of about 0.33 is compressive.

Q: A radiologist's hit rate rises from 0.70 to 0.90 and her false-alarm rate from 0.10 to 0.30 after she is told missed cancers lead to lawsuits. The most likely change is in her:
- d′
- *Criterion
- Absolute threshold
- Weber fraction
> Both hits and false alarms rose together: a liberal criterion shift.

Q: A d′ of zero indicates:
- Perfect discrimination of signal from noise
- A strongly conservative response bias
- *Inability to discriminate signal from noise
- A strongly liberal response bias
> Hit rate equals false-alarm rate.

Q: Match the theory to its claim: (a) trichromatic, (b) opponent process, (c) dual process. (i) Three cone types; (ii) paired antagonistic channels; (iii) cones are trichromatic, later stages opponent.
- a-ii, b-i, c-iii
- a-i, b-iii, c-ii
- a-iii, b-ii, c-i
- *a-i, b-ii, c-iii
> Young-Helmholtz, Hering, then Hurvich and Jameson.

Q: Which cells in visual cortex respond to a bar of a specific orientation anywhere within a region, often when moving?
- Simple cells
- Ganglion cells
- *Complex cells
- Bipolar cells
> Complex cells generalise over position.

Q: A 4 kHz notch on the audiogram of a factory worker most likely reflects:
- *Noise-induced damage to cochlear hair cells
- A middle-ear infection with fluid
- Presbycusis, the hearing loss of normal ageing
- A stroke in the auditory cortex
> Chronic noise damages hair cells tuned near 4 kHz.

Q: Which is NOT a monocular depth cue?
- Texture gradient
- *Retinal disparity
- Interposition
- Motion parallax
> Disparity needs two eyes.

Q: Moray's finding that about a third of participants heard their own name in the unattended ear was most damaging to:
- Treisman's attenuation model
- Lavie's load theory
- Deutsch and Deutsch's late selection
- *Broadbent's filter model
> A strict early filter predicts no meaning from the unattended channel.

Q: Assertion (A): In Treisman's model, the word "fire" can break through an unattended channel. Reason (R): Important words have permanently lowered thresholds in the mental dictionary.
- A is true, R is false
- *Both true, and R explains A
- Both true, but R does not explain A
- A is false, R is true
> Low thresholds let attenuated important words be recognised.

Q: Which theory predicts that distractors are processed more when the main task is easy?
- *Lavie's load theory
- Feature integration theory
- Broadbent's filter
- Multiple resource theory
> Low perceptual load leaves spare capacity.

Q: Kahneman's model differs from filter models mainly because it treats attention as:
- A switch between the two ears
- A set of cortical feature detectors
- *A limited pool of effort shared among tasks
- A short-term memory store
> Capacity models describe allocation of effort.

Q: Searching for a green T among green Xs and brown Ts takes longer as distractors are added. This is because:
- The target pops out after a short delay
- *Attention must bind features item by item
- Inhibition of return slows each look
- Sensory adaptation to the colour green
> A conjunction target requires serial binding.

Q: The phi phenomenon is:
- *Apparent movement produced by lights flashing in sequence
- Apparent movement of a still light in a dark room
- The aftereffect of staring at a waterfall
- Movement of the moon behind clouds
> Phi was Wertheimer's founding demonstration.

Q: Arrange in historical order: (1) Treisman's attenuation model, (2) Cherry's cocktail party study, (3) Lavie's load theory, (4) Broadbent's filter model.
- 1, 2, 4, 3
- 4, 2, 1, 3
- 2, 1, 4, 3
- *2, 4, 1, 3
> 1953, 1958, 1964, 1995.

Q: Which theorist proposed that perception picks up invariants in the optic array without inference?
- Gregory
- Helmholtz
- *Gibson
- Marr
> Direct perception is Gibson's view.

Q: The hollow-face illusion is commonly cited as evidence for:
- Gibson's direct perception
- *Top-down hypothesis-driven perception
- Opponent processing of colour
- The gate control of sensory input
> Knowledge of faces overrides depth cues.

Q: Poor children overestimating coin sizes more than rich children is a finding from:
- McGinnies
- Segall and colleagues
- Bugelski and Alampay
- *Bruner and Goodman
> The 1947 New Look coin study.

Q: A strong critique of McGinnies' perceptual defence study is that:
- The neutral words were much longer than the taboo words
- Skin conductance cannot be measured during word recognition
- *Taboo words are less frequent in print and may be withheld from report
- The participants were young children who could not read well
> Word frequency and response suppression explain much of the effect.

Q: Field-dependent individuals are most likely to:
- *Be influenced by the tilted frame in the rod-and-frame test
- Find shapes hidden in embedded figures unusually quickly
- Show no Müller-Lyer illusion at all, in any setting
- Usually have an inherited red-green colour deficiency
> Field dependence means reliance on the surrounding visual field.

Q: In the attention network model, the alerting network relies mainly on:
- *Noradrenaline
- Acetylcholine
- Serotonin
- Dopamine
> Alerting is linked to the locus coeruleus and noradrenaline.

Q: A stroke patient shaves only the right side of his face and marks the centre of a line far to the right. The likely lesion is:
- Left occipital lobe
- Cerebellum
- Left temporal lobe
- *Right parietal lobe
> Left neglect follows right parietal damage.

Q: A patient denies seeing anything in his left visual field after an occipital stroke, yet guesses the direction of moving dots there well above chance. This is:
- Neglect
- *Blindsight
- Associative agnosia
- Charles Bonnet syndrome
> Above-chance performance without reported awareness after V1 damage.

Q: Hallucination-prone participants in a signal detection task typically show:
- A higher d′ for faint voices in noise
- A more conservative criterion than controls
- *A liberal bias with similar sensitivity
- Lower absolute thresholds for all sounds
> Bentall and Slade (1985) found a bias, not a sensitivity, difference.

Q: The two-point threshold is smallest on the:
- Back
- Thigh
- *Fingertips
- Upper arm
> Dense receptors and a large cortical map.

Q: In a Müller-Lyer practical, the average difference between the participant's settings and the true length is the:
- Variable error
- *Constant error
- Space error
- Standard error
> Constant error measures the size of the illusion.

Q: Which statement about inattentional blindness is correct?
- *It increases when the primary task is more demanding
- It occurs only in people with brain damage
- It is the same as change blindness
- Experts in a field are immune to it
> Harder tasks leave less attention for unexpected events; even radiologists show it.
:::
`;
