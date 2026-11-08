/* Module · Sensation, attention and perception, Part I (Starting level). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: how the world gets in

## 1.1 From energy to experience [core][starting]
Light, sound waves, molecules in the air and pressure on the skin are just **physical energy**. None of them is "red", "loud", "jasmine" or "soft" until a nervous system turns it into experience. Two steps do that work.

:::widget figure
{"id": "eye"}
:::

- **Sensation** is the first step: a sense organ picks up energy and turns it into nerve signals. This conversion is called **transduction**. Rods and cones in the eye turn light into signals; hair cells in the inner ear turn vibration into signals.
- **Perception** is the second step: the brain organises and interprets those signals, so that a pattern of light becomes "my friend waving across the platform at Dadar station".

Each sense has its own **receptors**, its own nerve route and its own patch of cortex. This is why a blow to the eye makes you "see stars": the visual system reports every signal as light, however it was triggered. Johannes Müller called this the **law of specific nerve energies** (1830s).

:::widget flow
{
 "title": "From a mango on the table to 'a ripe mango'",
 "layout": "chain",
 "nodes": [
  {
   "id": "e",
   "label": "Physical energy",
   "detail": "Light of particular wavelengths bounces off the mango and enters the eye."
  },
  {
   "id": "r",
   "label": "Receptors",
   "detail": "Cones in the retina absorb the light. Each kind of receptor is tuned to one kind of energy."
  },
  {
   "id": "t",
   "label": "Transduction",
   "detail": "The receptor turns light into a change in electrical charge, then into nerve impulses."
  },
  {
   "id": "n",
   "label": "Nerve pathway",
   "detail": "Impulses travel along the optic nerve. Every sense except smell relays through the thalamus."
  },
  {
   "id": "c",
   "label": "Sensory cortex",
   "detail": "The visual cortex in the occipital lobe analyses edges, colour, shape and movement."
  },
  {
   "id": "p",
   "label": "Perception",
   "detail": "Knowledge joins in: you recognise a ripe Alphonso mango, and perhaps feel like eating it. Everything up to the cortex is sensation; this last step is perception."
  }
 ],
 "edgeLabels": {
  "t>n": "nerve impulses",
  "n>c": "via the thalamus"
 },
 "caption": "Tap each step. Sensation covers the first five; perception is the meaning the brain adds."
}
:::

### Bottom-up and top-down
- **Bottom-up processing** starts with the raw input and builds upwards: edges, then shapes, then objects.
- **Top-down processing** starts with what you already know and expect, and uses it to read the input.

Most perception is both at once. You read a doctor's scrawled prescription partly from the ink (bottom-up) and partly because you know which medicine names are likely (top-down). The pharmacist who knows the doctor reads it faster for the same reason.

:::widget compare
{"title": "Bottom-up or top-down?", "a": {"label": "Bottom-up", "points": ["Starts with the raw input", "Edges, then shapes, then objects", "Driven by the stimulus", "Wins when the input is clear and new"], "summary": "Bottom-up: the data on your senses build the percept from the ground up."}, "b": {"label": "Top-down", "points": ["Starts with knowledge and expectation", "Fills gaps and settles ambiguity", "Driven by context and experience", "Wins when the input is poor or unclear"], "summary": "Top-down: what you already know shapes what you see. The pharmacist reads the scrawl because she knows which names to expect."}, "caption": "Real perception runs both ways at once. Slide to see which one does more of the work in each situation."}
:::

:::widget sort
{
  "prompt": "Sensation or perception? Sort each moment.",
  "buckets": ["Sensation (picking up the signal)", "Perception (making sense of it)"],
  "items": [
    { "text": "Hair cells in the cochlea bend as sound waves arrive", "bucket": 0 },
    { "text": "You recognise your mother's voice in a crowded wedding hall", "bucket": 1 },
    { "text": "Cones in the retina respond to light of a long wavelength", "bucket": 0 },
    { "text": "You read a blurred shop sign correctly because you know the street", "bucket": 1, "why": "Using knowledge to fill gaps is top-down perception." },
    { "text": "Taste receptor cells fire when salt touches the tongue", "bucket": 0 },
    { "text": "A shadow on the road is seen as a pothole, and you brake", "bucket": 1 }
  ]
}
:::

:::widget neuron
{
 "title": "From receptor potential to nerve impulse",
 "myelinated": true,
 "caption": "A receptor's graded response must push the sensory neuron past threshold. Below threshold, nothing travels; above it, a full-sized spike fires every time. A stronger stimulus does not make bigger spikes: it makes more of them, and recruits more neurons. That is how intensity is coded. Switch myelin off to see why unmyelinated pain fibres carry slow, dull pain."
}
:::

### Sensory adaptation
Receptors respond less to a stimulus that does not change. Walk into a fish market in Kochi and the smell is overwhelming; ten minutes later you hardly notice it. You stop feeling your watch, your spectacles or your clothes. Adaptation frees the system to notice **change**, which usually matters more for survival than a steady background.

:::widget reveal
{
  "prompt": "If you could hold your eyes perfectly still, what would happen to an image that stayed fixed on the same spot of the retina?",
  "answer": "It would fade within seconds. Experiments with images stabilised on the retina show exactly this. Tiny, constant eye movements (microsaccades) keep refreshing the input so the world does not vanish."
}
:::

:::widget brainmap
{
 "title": "Where each sense arrives in the cortex",
 "focus": [
  "occipital",
  "temporal",
  "sensory",
  "thalamus"
 ],
 "notes": {
  "occipital": "Vision: the primary visual cortex at the back of the brain.",
  "temporal": "Hearing: the auditory cortex on the upper surface of the temporal lobe. Smell and taste areas sit nearby, deeper in.",
  "sensory": "Touch, temperature, pain and body position: the somatosensory strip just behind the central groove.",
  "thalamus": "The relay station: every sense except smell passes through it on the way to the cortex."
 },
 "caption": "Tap a highlighted region to see which sense it receives."
}
:::

:::trap Adaptation is not habituation
**Sensory adaptation** happens in the receptors and early pathways: the signal itself weakens. **Habituation** is learning: the brain decides a stimulus is unimportant and stops responding, even though the signal still arrives. A sudden change (the fan stops) breaks habituation at once.
:::

:::clinician
Transduction differs by modality: phototransduction in rods and cones is a G-protein cascade (rhodopsin, transducin, cGMP-gated channels) in which light *hyperpolarises* the receptor; mechanotransduction in cochlear hair cells uses tip-link-gated channels that open within microseconds. Olfactory signals reach the olfactory cortex and amygdala without a thalamic relay, which is one reason smells trigger vivid emotional memories. Clinically, a "positive" sensory symptom (flashing lights, tinnitus, phantom smells) can arise anywhere from receptor to cortex, and the law of specific nerve energies is why an occipital seizure produces seen lights rather than felt sensations.
:::

:::recall
1. What is transduction? || The conversion of physical energy into nerve signals by a sense receptor.
2. Contrast sensation and perception. || Sensation detects and encodes energy; perception organises and interprets the signals into meaningful experience.
3. Define bottom-up and top-down processing. || Bottom-up builds from the raw input; top-down uses knowledge and expectation to interpret it.
4. Why is sensory adaptation useful? || It reduces response to unchanging input so that change stands out.
:::

:::mcq
Q: A pharmacist correctly reads an almost illegible prescription because she knows the doctor's usual medicines. This mainly shows:
- Sensory adaptation
- Transduction
- *Top-down processing
- The law of specific nerve energies
> Prior knowledge guiding interpretation is top-down processing.
:::

## 1.2 Thresholds: how little can you notice? [core][starting]
Psychophysics is the study of how physical stimulus strength relates to what we experience. It began with Gustav Fechner, whose book on psychophysics appeared in 1860, and it is the oldest experimental part of psychology.

### The absolute threshold
The **absolute threshold** is the smallest amount of a stimulus that a person can detect. Because detection is never all-or-none, it is defined statistically: the intensity detected on **50 percent** of trials.

Classic textbook estimates for a healthy adult in ideal conditions:
| Sense | Approximate absolute threshold |
|---|---|
| Vision | A candle flame seen at a great distance on a dark, clear night |
| Hearing | The tick of a watch at about 6 metres in a silent room |
| Taste | One teaspoon of sugar in about 7.5 litres of water |
| Smell | One drop of perfume spread through a six-room flat |
| Touch | The wing of a bee falling on your cheek from 1 cm |

:::widget guess
{
  "prompt": "On a perfectly dark, clear night, from how far away could a person with good eyes just detect a single candle flame?",
  "min": 1,
  "max": 80,
  "unit": "km",
  "answer": [40, 55],
  "reveal": "About 48 km (30 miles). The eye, fully dark-adapted, can respond to a handful of photons. Real life, with haze, city lights and an eye that is not dark-adapted, is far less generous.",
  "clinician": "The figure of about 30 miles is a teaching illustration rather than a field measurement. Classic photon-counting experiments in the 1940s showed that a dark-adapted observer can detect a flash when roughly 5 to 14 photons are absorbed by rods, with a single rod able to respond to a single photon."
}
:::

### The difference threshold
The **difference threshold**, or **just noticeable difference (JND)**, is the smallest change in a stimulus that a person can detect on 50 percent of trials. Ernst Weber (1834) found that the JND is not a fixed amount. It is a **fixed proportion** of the starting stimulus. This is **Weber's law**.

In plain words: if you are holding a 100-gram packet, you might just notice 2 grams more. If you are holding a 1-kilogram bag of atta, you would need about 20 grams more. The fraction stays the same (about 2 percent for lifted weights); the amount grows.

:::widget guess
{
  "prompt": "You are holding a 5 kg bag of rice. Weber's fraction for lifted weight is about 2 percent. How much rice must be added before you can just tell it is heavier?",
  "min": 10,
  "max": 500,
  "step": 10,
  "unit": "grams",
  "answer": [90, 110],
  "reveal": "About 100 grams: 2 percent of 5,000 grams. The heavier the starting weight, the bigger the change you need."
}
:::

:::example Weber's law at the sabzi mandi
A vendor who adds one extra tomato to a 250-gram bag makes a difference the buyer can see and feel. The same tomato added to a 5-kilogram sack goes unnoticed. Shopkeepers and buyers use Weber's law without ever naming it.
:::

### Subliminal means below threshold
A stimulus is **subliminal** when it is below the absolute threshold for conscious report. Weak subliminal effects on simple judgments are real in the laboratory, but the famous 1957 claim that flashing "Eat popcorn" in a cinema raised sales was later admitted to be made up. There is no good evidence that hidden messages can make people buy things they did not already want.

:::widget reveal
{"prompt": "A friend says shops flash hidden messages on screens to make you buy drinks without knowing it. Is that how subliminal effects work? Decide, then open.", "answer": "Mostly no. The famous 1957 cinema claim ('Eat popcorn', 'Drink Coca-Cola') was later admitted by its own author to have been made up. In the laboratory, a brief hidden brand name can nudge choice slightly, but only for a short time, and only if the person already has the need: thirsty people may pick the primed drink, people who are not thirsty do not. Hidden messages cannot create a want that is not there."}
:::

:::recall
1. How is the absolute threshold defined? || The minimum intensity detected on 50 percent of trials.
2. What is a just noticeable difference? || The smallest change in a stimulus detected on 50 percent of trials.
3. State Weber's law in plain words. || The just noticeable difference is a constant fraction of the starting stimulus.
4. Who founded psychophysics, and when? || Gustav Fechner, in 1860.
:::

:::mcq
Q: If the Weber fraction for brightness is about 8 percent, which change is most likely to be noticed?
- From 500 to 510 units
- From 1,000 to 1,050 units
- From 2,000 to 2,100 units
- *From 100 to 110 units
> Only the change from 100 to 110 (10 percent) exceeds 8 percent; the others are 2 to 5 percent.

Q: The absolute threshold is set at 50 percent detection because:
- Below that point a stimulus can never be detected at all
- *Detection rises gradually with intensity, not at one point
- Receptors in every sense fire on only half of all trials
- Weber proved that detection is always exactly 50 percent
> Detection rises gradually; 50 percent is a convenient statistical point.
:::

## 1.3 Attention: the spotlight of the mind [core][starting]
At any moment far more reaches your senses than you can use. **Attention** is the set of processes that select some information for deeper processing and leave the rest. William James (1890) described it as "the taking possession by the mind, in clear and vivid form, of one out of what seem several simultaneously possible objects or trains of thought".

### Four kinds of attention
| Kind | What it does | Everyday example |
|---|---|---|
| **Selective** | Focuses on one source and ignores others | Following your friend in a noisy canteen |
| **Divided** | Shares attention between two tasks | Cooking dal while helping a child with homework |
| **Sustained** (vigilance) | Stays alert for rare events over a long time | A security guard watching CCTV screens all night |
| **Executive** (control) | Overrides habits and switches tasks | Not answering the phone during an exam viva |

:::widget sort
{"prompt": "Which kind of attention does each moment need most?", "buckets": ["Selective", "Divided", "Sustained", "Executive"], "items": [{"text": "Hearing only your mother's voice on a phone call at a busy railway station", "bucket": 0, "why": "Focusing on one source and shutting out the rest."}, {"text": "Driving a scooter while keeping track of directions on a map app", "bucket": 1, "why": "Two tasks at the same time share attention."}, {"text": "A lab technician scanning blood slides for rare malaria parasites for two hours", "bucket": 2, "why": "Staying alert for rare events over a long time is vigilance."}, {"text": "Stopping yourself from typing your old password after it was changed", "bucket": 3, "why": "Overriding a strong habit is executive control."}, {"text": "A lifeguard watching a calm pool all afternoon", "bucket": 2, "why": "Long watch, rare events: sustained attention."}, {"text": "Switching between answering a patient and writing notes", "bucket": 3, "why": "Switching between tasks on purpose is executive control."}]}
:::

### The cocktail party effect
In a crowded room you can follow one conversation and tune out the rest, yet if someone across the room says your name, you often hear it. Colin Cherry (1953) studied this in the laboratory, and it launched the scientific study of attention. You will meet the theories at the Beginner level.

### What we miss
Attention is not a camera. What falls outside it can go completely unseen.
- **Inattentional blindness**: failing to notice an unexpected object in plain view while attending to something else.
- **Change blindness**: failing to notice a large change between two views, for example when a scene is interrupted by a blink, a cut in a film or a passing bus.

:::widget guess
{
  "prompt": "In a famous study (Daniel Simons and Christopher Chabris's 1999 study), viewers counted basketball passes in a short video. Halfway through, a person in a gorilla suit walked through the game, faced the camera and thumped its chest. What percentage of viewers failed to notice the gorilla?",
  "min": 0,
  "max": 100,
  "unit": "%",
  "answer": [40, 60],
  "reveal": "About half. Attention to the counting task left nothing for the unexpected gorilla, even though it was on screen for several seconds. The harder the counting task, the more people missed it.",
  "clinician": "Across conditions, roughly 46 percent failed to notice; failure was higher when the task was harder and when the gorilla's colour differed from the attended team. The finding generalises to expert observers: in a 2013 study, 20 of 24 radiologists missed a gorilla image inserted into a lung CT while searching for nodules."
}
:::

:::widget decide
{
  "scene": "Arjun, 24, drives an app cab in Hyderabad. He says hands-free calls are safe because “my eyes are on the road and my hands are on the wheel.”",
  "ask": "What does attention research say?",
  "choices": [
    { "label": "He is right: the danger comes only from holding the phone", "verdict": "harm", "outcome": "He keeps taking long calls in traffic and misses a red light at a junction.", "why": "Studies with driving simulators found hands-free and handheld conversations impaired driving about equally. The problem is attention, not hands." },
    { "label": "A conversation takes attention away from the road, even hands-free; short, essential calls only, ideally when stopped", "verdict": "best", "outcome": "He starts letting calls go to voicemail while moving.", "why": "Phone conversation draws on limited central attention. Drivers on calls miss more signals and react more slowly, with or without hands-free (David Strayer's simulator studies)." },
    { "label": "Talking to a passenger is just as dangerous, so it makes no difference", "verdict": "ok", "outcome": "Partly true, but it misses a key point.", "why": "Passengers see the road and tend to stop talking when traffic gets difficult. A caller cannot, so phone talk is usually more disruptive." }
  ]
}
:::

:::student
Attention is a limited budget. Every time you spend some on one thing, less is left for everything else. That is why multitasking while studying feels productive but usually means slower, shallower learning.
:::

:::recall
1. Name the four kinds of attention. || Selective, divided, sustained (vigilance) and executive (control).
2. What is the cocktail party effect? || Following one conversation among many while still catching important unattended input, such as your own name.
3. Contrast inattentional blindness and change blindness. || Inattentional blindness: missing an unexpected object while attending elsewhere. Change blindness: missing a change between two views.
:::

:::mcq
Q: A night-shift nurse must watch an ICU monitor for rare danger signs for hours. Which kind of attention does this need most?
- *Sustained attention
- Selective attention
- Executive attention
- Divided attention
> Watching for rare events over long periods is vigilance, or sustained attention.
:::

## 1.4 Making sense of shapes, depth and size [core][starting]
The image on each retina is flat, upside down and changes every time you move. Yet you see a stable, three-dimensional world of solid objects. Perception does this by **organising** the input, using **cues to depth**, and keeping objects **constant**.

### Gestalt organisation
In Germany in the 1910s and 1920s, Max Wertheimer, Wolfgang Köhler and Kurt Koffka argued that "the whole is different from the sum of its parts". We see wholes first. Their principles (often called laws) describe how:
- **Figure and ground**: we split a scene into an object (figure) standing out from a background (ground). In Rubin's vase you see either a vase or two faces, never both at once.
- **Proximity**: things close together are grouped.
- **Similarity**: things alike in colour, shape or size are grouped.
- **Closure**: we fill gaps to see complete shapes.
- **Good continuation**: we see smooth, continuous lines rather than sudden turns.
- **Common fate**: things moving together are grouped.
- **Prägnanz** (good form): we see the simplest, most stable organisation possible. This is the master principle.

:::widget sort
{
  "prompt": "Which Gestalt principle is at work?",
  "buckets": ["Proximity", "Similarity", "Closure", "Common fate"],
  "items": [
    { "text": "A rangoli made of separate dots is seen as one flower", "bucket": 2, "why": "The mind fills the gaps between dots to make a complete shape." },
    { "text": "In a stadium, fans wearing blue shirts are seen as one block", "bucket": 1 },
    { "text": "A flock of birds turning together is seen as one group", "bucket": 3 },
    { "text": "Three pairs of lines spaced closely are seen as three columns", "bucket": 0 },
    { "text": "A logo made of broken arcs is read as a full circle", "bucket": 2 },
    { "text": "People standing close together at a bus stop look like a family", "bucket": 0 }
  ]
}
:::

:::widget illusion
{"kind": "figure-ground", "caption": "Is it a vase or two faces? Flip it. You can see either, but never both at the same moment: the brain picks one region as figure and treats the other as ground."}
:::

:::widget figure
{"id": "kanizsa-triangle"}
:::

### Seeing depth
We judge distance from **cues**. Some need only one eye (**monocular cues**): nearer objects block farther ones, parallel railway lines seem to meet in the distance, far mountains look hazy and blue. Others need both eyes (**binocular cues**): each eye sees a slightly different view, and the brain uses the difference.

:::widget flow
{"title": "The family of depth cues", "layout": "tree", "nodes": [{"id": "d", "label": "Depth cues", "detail": "The image on each retina is flat. The brain works out distance from clues in the image and from the eyes themselves."}, {"id": "m", "label": "Monocular: one eye is enough", "parent": "d", "detail": "These cues work even with one eye closed, and painters use them to make a flat canvas look deep."}, {"id": "b", "label": "Binocular: needs both eyes", "parent": "d", "detail": "These depend on the two eyes seeing from slightly different places. They work best for near objects."}, {"id": "i", "label": "Interposition", "parent": "m", "detail": "A nearer object blocks part of a farther one."}, {"id": "l", "label": "Linear perspective", "parent": "m", "detail": "Parallel railway lines seem to meet in the distance."}, {"id": "r", "label": "Relative size and texture", "parent": "m", "detail": "Of two similar objects, the smaller image seems farther. Texture packs closer together with distance, like pebbles on a beach."}, {"id": "a", "label": "Aerial perspective", "parent": "m", "detail": "Far hills look hazy and bluish."}, {"id": "p", "label": "Motion parallax", "parent": "m", "detail": "From a moving train, nearby poles rush past while far hills drift slowly."}, {"id": "disp", "label": "Retinal disparity", "parent": "b", "detail": "Each eye gets a slightly different view. The closer the object, the bigger the difference. This is stereopsis, the basis of 3D films."}, {"id": "c", "label": "Convergence", "parent": "b", "detail": "The eyes turn inwards to look at a near object. The brain reads the muscle effort as distance."}], "caption": "Many illusions of depth, like a hallway drawing that makes equal figures look different sizes, come from these cues used where they do not fit."}
:::

:::widget illusion
{"kind": "ponzo", "caption": "Two equal bars between converging lines. Linear perspective tells the brain the upper bar is farther away, so size constancy makes it look bigger."}
:::

:::widget figure
{"id": "ponzo"}
:::

### Constancy
**Perceptual constancy** keeps objects looking the same even as their image changes. Your friend walking away does not seem to shrink (size constancy). A door swinging open still looks rectangular (shape constancy). A white shirt looks white in sunlight and in shade (lightness constancy).

:::widget compare
{"title": "What reaches the eye, and what you see", "a": {"label": "Image on the retina", "points": ["Your friend walks away: the image shrinks to half size", "A door opens: the image turns into a narrowing trapezium", "Coal in sunlight reflects more light than paper in shade"], "summary": "The raw image changes all the time."}, "b": {"label": "What you perceive", "points": ["Your friend stays the same height", "The door stays a rectangle", "The coal still looks black and the paper white"], "summary": "The brain corrects for distance, angle and lighting, so objects keep their real size, shape and lightness. This is perceptual constancy."}}
:::

### Illusions
An **illusion** is a perception that does not match the physical stimulus. Illusions are not failures of a careless brain. They show the rules the brain normally uses, applied where they do not fit.

:::widget reveal
{
  "prompt": "Two lines are exactly the same length. One has short fins at each end that point back over the line, like arrowheads. The other has fins that point away from the line, like a forked tail. Which looks longer, and why might that be?",
  "answer": "The line with the fins pointing outwards looks longer. This is the Müller-Lyer illusion (1889). One explanation is that we read the fins as the corners of a room (far away) or of a building (near), and apply size constancy, so the 'far' line is scaled up. You will test this idea against cross-cultural evidence at the Advanced level."
}
:::

:::widget illusion
{"kind": "muller-lyer", "caption": "Judge first, then measure. Knowing the lines are equal does not make the illusion go away."}
:::

:::recall
1. State the Gestalt principle of Prägnanz. || We see the simplest, most stable organisation the input allows.
2. Give one monocular and one binocular depth cue. || Monocular: interposition, linear perspective, aerial haze. Binocular: retinal disparity, convergence.
3. What is size constancy? || Seeing an object as the same size despite changes in its retinal image with distance.
4. Why are illusions useful to psychologists? || They reveal the rules perception normally uses.
:::

:::mcq
Q: In Rubin's vase you see a vase, then two faces, but never both together. This illustrates:
- Closure of the gaps
- Common fate
- *Figure-ground organisation
- Shape constancy across views
> One region is figure and the other ground; they switch, but cannot both be figure at once.
:::

:::widget figure
{"id": "muller-lyer"}
:::

## 1.5 Level check · Starting [core][starting]
Score 80 percent or more to open the Beginner level. If you already know this, take it now to skip ahead.

:::mcq
Q: The conversion of light into nerve signals by rods and cones is called:
- *Transduction
- Perception
- Adaptation
- Accommodation
> Receptors transduce physical energy into neural signals.

Q: You stop noticing the smell of incense in a temple after a few minutes. This is:
- Inattentional blindness
- *Sensory adaptation
- Perceptual constancy
- Top-down processing
> Unchanging input produces a weaker response.

Q: The absolute threshold is the intensity detected on what proportion of trials?
- 25 percent
- 100 percent
- 75 percent
- *50 percent
> Thresholds are defined statistically at 50 percent.

Q: Weber's law says that the just noticeable difference:
- *Is a constant fraction of the starting stimulus
- Is the same amount for every starting stimulus
- Gets smaller as the stimulus gets stronger
- Applies only to vision
> The fraction is constant, so the absolute change needed grows with the stimulus.

Q: A shopper notices an extra 10 grams on a 500-gram packet. With the same Weber fraction, what change would she need on a 2-kilogram packet?
- 10 grams
- *40 grams
- 20 grams
- 100 grams
> 10 of 500 is 2 percent; 2 percent of 2,000 grams is 40 grams.

Q: Who first wrote about the "cocktail party" problem in the laboratory?
- William James
- Ernst Weber
- *Colin Cherry
- Max Wertheimer
> Cherry (1953) used shadowing to study selective listening.

Q: Missing a large change in a scene interrupted by a brief cut is called:
- Inattentional blindness
- Perceptual defence
- Habituation
- *Change blindness
> A change across an interruption that goes unseen is change blindness.

Q: A security guard watching CCTV for rare intruders mainly uses:
- Divided attention
- Selective attention
- Top-down attention
- *Sustained attention
> Vigilance over long periods.

Q: The Gestalt psychologists' central claim was that:
- Perception is built only from tiny sensations added together
- *The whole is perceived as different from the sum of its parts
- Attention is a filter
- Only learning explains perception
> Wholes are primary in perception.

Q: Fans in the same team colour are seen as one block. Which principle?
- Proximity
- Closure
- *Similarity
- Good continuation
> Grouping by shared colour is similarity.

Q: Seeing a circle in a logo made of broken arcs shows:
- *Closure
- Figure-ground
- Proximity
- Common fate
> The mind completes the gaps.

Q: Which depth cue needs both eyes?
- *Retinal disparity
- Linear perspective
- Interposition
- Aerial perspective
> Disparity compares the two eyes' slightly different views.

Q: A friend walking away from you does not seem to shrink. This is:
- Shape constancy
- *Size constancy
- Lightness constancy
- An illusion
> Size constancy scales the shrinking image by distance.

Q: The best way to describe an illusion is:
- A sign of damage somewhere in the visual pathways of the brain
- A perception that arises with no external stimulus present
- A mistake made mainly by children, who outgrow it with age
- *A misperception of a real stimulus that reveals normal rules
> Illusions are normal and informative.
:::
`;
