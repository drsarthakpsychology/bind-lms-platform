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

:::widget decide
{
  "scene": "A student is shown the inside of a hollow mask of Lord Ganesha, lit from below. Even though she knows it is hollow, she sees it as a normal face bulging towards her, and as the mask rotates, it seems to turn the 'wrong' way.",
  "ask": "Which theory explains this best?",
  "choices": [
    { "label": "Gregory: a strong hypothesis that faces are convex overrides the depth cues", "verdict": "best", "outcome": "She realises her knowledge of faces is shaping what she sees, even against the evidence.", "why": "The hollow-face illusion is a classic support for constructivism. Expectation (faces bulge outwards) wins over binocular cues, unless she gets very close." },
    { "label": "Gibson: the optic array directly specifies a convex face", "verdict": "harm", "outcome": "The explanation cannot account for why the true depth is not seen.", "why": "If perception simply picked up the information in the light, the hollow surface would be seen as hollow. Direct perception struggles with this illusion." },
    { "label": "Neither: it is a fault in the retina", "verdict": "ok", "outcome": "Retinal input is normal; the effect is in interpretation.", "why": "The retina registers the correct pattern; the illusion arises in how the brain interprets it." }
  ]
}
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

### Marr's computational approach (1982)
David Marr asked what the visual system computes, step by step:
1. **Primal sketch**: edges, bars, blobs and their arrangement (a 2D description).
2. **Two-and-a-half-D sketch**: depth and orientation of visible surfaces relative to the viewer.
3. **3D model representation**: an object-centred description that is the same from any viewpoint.
He also separated three **levels of explanation** for any information-processing system: computational (what problem is solved and why), algorithmic (what steps), and implementational (what hardware). This framework is still used across cognitive science.

### The modern synthesis: the predictive brain
Current theories (**predictive processing**, the "Bayesian brain") treat the brain as constantly **predicting** its sensory input from a model of the world, and passing forward only the **prediction error**, the part that was not expected. Perception is the brain's best explanation of the input, weighing prior beliefs against how reliable the evidence is. This is Helmholtz and Gregory made mathematical, but it also takes Gibson's point that the moving observer constantly samples the world.

:::clinician
Predictive processing offers testable accounts of psychopathology. In psychosis, one account proposes aberrant precision-weighting: prediction errors are given too much weight, so trivial events feel significant (aberrant salience, Kapur 2003) and new beliefs (delusions) form to explain them; hallucinations may reflect overly strong priors in some people. Consistent with weaker top-down influence, people with schizophrenia are less susceptible to the hollow-face illusion and to some context-driven illusions (for example Ebbinghaus), yet their performance can be "better" than controls on such tasks. In autism, "weak priors" or inflexible precision accounts aim to explain sensory overload and reduced susceptibility to some illusions. These are frameworks under active test, not established mechanisms.
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
    { "label": "Agree; the skin-conductance data prove unconscious defence", "verdict": "harm", "outcome": "The answer misses the most-asked critique in exams.", "why": "The findings have simpler explanations that were raised at once and must be discussed." },
    { "label": "Note two alternative explanations: taboo words were less familiar in print (Howes and Solomon, 1950), and participants may have seen them but hesitated to say them aloud to an experimenter (response suppression)", "verdict": "best", "outcome": "The answer gains marks for balanced evaluation.", "why": "Word frequency strongly predicts recognition thresholds, and embarrassment can delay report. Later studies controlling these found smaller effects, along with the opposite pattern in some people: perceptual vigilance (sensitisation) to threat." },
    { "label": "Dismiss the study as unscientific because it was done in the 1940s", "verdict": "ok", "outcome": "Age is not a critique.", "why": "Old studies can be well designed; criticise the method and the alternative explanations, not the date." }
  ]
}
:::

The modern descendants of the New Look are well supported, but more modest: **attentional bias** to threat in anxiety, **emotion-induced blindness** (an emotional image can make the next target briefly invisible), and evidence that fear can change basic contrast sensitivity. Big claims, such as "wanting something makes it look bigger", are contested; some effects reflect changes in judgment or response rather than in perception itself.

:::clinician
Firestone and Scholl (2016, Behavioral and Brain Sciences) argued that almost no "top-down effects on perception" survive scrutiny once six pitfalls are excluded: an overly confirmatory design, effects on judgment rather than perception, demand characteristics, low-level stimulus differences, peripheral attention effects and memory rather than perception. The paper is a model for critical evaluation in long answers. Contrast this with robust cognitive penetration by attention and with predictive-processing accounts, which predict pervasive top-down influence, and you have a viva-ready debate.
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

The **Attention Network Test** (Fan and colleagues, 2002) measures all three in one task by combining cues (for alerting and orienting) with a flanker task (for conflict: respond to the middle arrow in ← ← → ← ←).

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
Task-switching paradigms (Rogers and Monsell, 1995; Jersild, 1927) show a residual switch cost even with full preparation, implicating reconfiguration of task set. In neuropsychology, executive attention is tested with the Stroop, Trail Making Part B (or the Colour Trails Test, which avoids reliance on the English alphabet and is used in Indian batteries), the Wisconsin Card Sorting Test and the flanker task. The "mere presence" smartphone effect (Ward and colleagues, 2017) failed to replicate in larger preregistered studies, making it a useful teaching example of a viral finding that shrank under scrutiny.
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

### Attention in psychiatric disorders
| Condition | Attentional finding |
|---|---|
| **ADHD** | Poor sustained attention and inhibition; more variable reaction times; errors of omission and commission on continuous performance tests |
| **Schizophrenia** | Weak sensory gating (P50 suppression), reduced prepulse inhibition, poor sustained attention; reduced latent inhibition in acute states |
| **Anxiety disorders** | **Attentional bias** towards threat: faster detection of threat words in the dot-probe task (MacLeod, Mathews and Tata, 1986); slower colour naming of threat words in the **emotional Stroop** |
| **Depression** | Difficulty disengaging from negative and sad material rather than fast orienting to threat |
| **Delirium** | Inattention is the core feature, fluctuating through the day |

:::clinician
Attention bias modification (training attention away from threat in dot-probe variants) generated early excitement, but later meta-analyses (Cristea and colleagues, 2015) found small effects that shrink once publication bias and low-quality trials are accounted for; it is not a stand-alone treatment. For neglect, prism adaptation and visual scanning training have the best, if modest, evidence. In delirium screening, attention tests (months of the year backwards, the "SAVEAHAART" letter task in the CAM-ICU) carry most of the diagnostic weight. For an Indian bedside, avoid tests that rely on English alphabet sequences in patients not schooled in English; number or culturally neutral versions, such as the Colour Trails Test, are fairer.
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

## 4.1 Long answers and short notes [core]
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

## 4.2 Viva rapid-fire [core]
:::viva
Who founded psychophysics? :: Gustav Fechner, Elements of Psychophysics, 1860.
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

## 4.3 Module test [core]
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
