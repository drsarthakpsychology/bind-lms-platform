import type { LongQA } from "@/lib/prep/long-types";

const S = "perception-attention" as const;

export const PERCEPTION_ATTENTION_L02: LongQA[] = [
  {
    id: "pa-l02-011",
    subject: S,
    topic: "perceptual-organisation",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Explain the Gestalt principles of perceptual organisation with examples. Evaluate the Gestalt approach in the light of later research.",
    plan: ["Gestalt school and its central claim", "Figure and ground", "Grouping laws with examples", "Law of Pragnanz", "Evidence and criticisms", "Applications and conclusion"],
    answer: `## The Gestalt approach
Gestalt psychology began in Germany in 1912 with Max Wertheimer's study of apparent motion, together with Wolfgang Kohler and Kurt Koffka. "Gestalt" means form or whole. Against structuralism, which tried to break experience into elementary sensations, the Gestalt psychologists argued that "the whole is different from the sum of its parts": we perceive organised patterns, not collections of separate sensations. A melody remains the same when played in a different key, although every note changes.

## Figure and ground
The most basic form of organisation is separating a figure (the object attended to) from the ground (the background). Edgar Rubin's vase and faces figure is reversible: we see either a white vase or two black faces in profile, but not both at once. The figure appears in front, has a shape and contour, and is more memorable; the ground seems to extend behind it. Factors favouring figure include smaller area, symmetry, convexity and being lower in the field. Camouflage in nature works by breaking up the figure into the ground.

## Grouping laws
- Proximity: elements close together are grouped. Dots spaced in pairs are seen as pairs; we read words because letters within words are closer than letters between words.
- Similarity: elements similar in colour, shape or size are grouped. In a grid of circles and squares we see rows or columns of the same shape.
- Good continuation: we perceive smooth, continuous lines rather than abrupt changes. Two crossing lines are seen as two lines, not as four lines meeting at a point.
- Closure: we fill in gaps to perceive complete figures, as with a circle drawn with small breaks, or the WWF panda logo.
- Common fate: elements moving together are grouped, like a flock of birds or a crowd walking in one direction.
- Symmetry: symmetrical regions tend to be seen as figures.
- Connectedness and common region (added later by Stephen Palmer): elements joined by lines or enclosed within the same boundary are grouped.

## The law of Pragnanz
Koffka summarised the laws as the law of Pragnanz (good form or simplicity): the perceptual field is organised into the simplest, most regular and most stable structure the conditions allow. Five overlapping circles of the Olympic logo are seen as circles rather than complex shapes.

## Explanation
Kohler proposed that brain fields of electrical activity are isomorphic with (have the same form as) perceptual experience. This physiological theory was refuted when Karl Lashley placed metal strips in monkeys' visual cortex to short-circuit such fields and their visual discrimination was unaffected.

## Evidence and criticisms
Strengths:
- The principles are robust demonstrations replicated across many cultures.
- Gestalt ideas shaped later research on perceptual organisation, problem solving (insight), social psychology (Kurt Lewin's field theory) and Gestalt therapy (indirectly).
- Modern research supports global precedence: David Navon showed that people identify a large letter made of small letters faster than the small letters themselves.
- Neural evidence: neurons in V1 and V2 respond to illusory contours (Kanizsa triangle) and to grouping by good continuation.
Criticisms:
- The laws are descriptive, not explanatory: they say how we group but not why, and their brain field explanation was wrong.
- They are vague and can conflict; it is hard to predict which law will win when proximity and similarity compete.
- Most demonstrations use simple two-dimensional drawings rather than real three-dimensional scenes.
- Grouping is not always early and automatic; it can depend on attention and experience. Irvin Rock and Stephen Palmer showed that grouping by similarity can occur after depth and lightness constancy are computed, not before.
- Ecological explanations: Gibson and later researchers argued the laws reflect regularities in the natural environment (things close together usually belong together), and Bayesian models treat them as the brain's learned prior expectations about the world.

## Applications
- Design: web pages, road signs, advertisements and textbooks use proximity, similarity and alignment to group related information.
- Camouflage and military design.
- Data visualisation: grouping guides how readers see trends.
- Clinical: some studies report weaker global processing and grouping in schizophrenia and a local processing bias in autism.

## Conclusion
The Gestalt psychologists showed that perception is organised and that we see wholes, not collections of parts. Their laws remain accurate descriptions, though explanations have moved from brain fields to neural grouping mechanisms and to the statistical structure of the environment.`,
    keyPoints: ["Founders and the whole versus sum of parts idea", "Figure and ground with Rubin's vase", "At least five grouping laws with examples", "Law of Pragnanz", "Isomorphism and Lashley's refutation", "Supporting evidence such as Navon or illusory contours", "Criticisms: descriptive, vague, 2D", "Applications"],
    module: "sensation-perception/2-8",
    visuals: [
      { kind: "illusion", caption: "Figure and ground", data: { kind: "figure-ground", caption: "Flip between vase and faces. Can you see both at the same moment?" } },
      { kind: "sort", caption: "Grouping laws", data: { prompt: "Which Gestalt law explains each?", buckets: ["Proximity", "Similarity", "Closure", "Common fate"], items: [{ text: "Letters spaced closely are read as one word", bucket: 0 }, { text: "A circle with small gaps still looks like a circle", bucket: 2 }, { text: "A flock of birds turning together looks like one shape", bucket: 3 }, { text: "Red and blue dots in a grid look like red and blue columns", bucket: 1 }] } },
    ],
    ref: "Wertheimer 1923; Koffka 1935; Kohler 1929; Palmer 1992 common region; Navon 1977; Lashley, Chow and Semmes 1951; Atkinson and Hilgard ch 5",
  },
  {
    id: "pa-l02-012",
    subject: S,
    topic: "perceptual-constancy",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "What is perceptual constancy? Explain size, shape, lightness and colour constancy, and the theories that account for them.",
    plan: ["Define constancy and why it matters", "Size constancy and size-distance invariance", "Shape constancy", "Lightness and colour constancy", "Theories and breakdowns of constancy", "Conclusion"],
    answer: `## Meaning
Perceptual constancy is the tendency to perceive objects as having stable properties (size, shape, lightness, colour) even though the image they project on the retina changes with distance, angle and lighting. Without constancy, a friend walking away would appear to shrink and a white shirt would look grey in the evening. Constancy shows that perception goes beyond the retinal image.

## Size constancy
An object's retinal image halves in size when its distance doubles, yet we perceive its size as unchanged. A person 10 metres away is not seen as half the height of the same person at 5 metres.
- Size-distance invariance: perceived size depends on the retinal image size combined with perceived distance. If the retinal image is the same but an object seems farther away, it is seen as larger. Emmert's law shows this with afterimages: an afterimage projected onto a distant wall looks larger than one projected onto a nearby page.
- Holway and Boring found that when depth cues were removed (viewing through a peephole in a dark corridor), size constancy broke down and judgements followed retinal size.
- Colin Turnbull reported that a BaMbuti man from a dense forest, seeing buffalo far across open plains for the first time, thought they were insects, because his environment had given little experience of long distances.
- The Ames room and the moon illusion reflect errors in size-distance computation.

## Shape constancy
A door opening towards us projects a trapezoid on the retina, yet we see it as rectangular. A plate seen at an angle projects an ellipse but looks round. Shape constancy uses information about the slant of the surface.

## Lightness and colour constancy
- Lightness constancy: a white paper looks white in dim light and black coal looks black in sunlight, although in sunlight the coal may reflect more light than the paper does indoors. We perceive the proportion of light reflected (reflectance) by comparing a surface with its surroundings. Hans Wallach showed that perceived lightness depends on the ratio of light from an object to light from its surround.
- Colour constancy: a red apple looks red under yellowish incandescent light, bluish daylight or fluorescent tube light. Edwin Land's retinex theory proposes that the brain compares wavelengths reflected from different surfaces to discount the colour of the illumination. The 2015 viral photograph of "the dress", seen as blue and black by some and white and gold by others, showed that people make different assumptions about the lighting.

## Theories
- Constructivist (Helmholtz, Gregory): constancy results from unconscious inference, taking account of distance, slant and illumination.
- Ecological (Gibson): the information for constancy is directly available in invariant relationships in the optic array, such as the ratio of an object's height to the texture elements it covers, or the horizon ratio.
- Physiological: neurons in V4 respond to surface colour rather than wavelength, supporting cortical colour constancy.

## Breakdown of constancy
Constancy fails when contextual cues are removed, as in the reduction screen (viewing a surface through a small hole), at great heights (cars look like toys from a tall building, because we lack experience judging distance vertically) and in some illusions.

## Conclusion
Perceptual constancies allow a stable world to be perceived from changing retinal images. They depend on combining the image with information about distance, orientation and illumination, whether through inference or by picking up invariant information.`,
    keyPoints: ["Definition and importance", "Size constancy with size-distance invariance", "Emmert's law or Holway and Boring", "Turnbull's BaMbuti example", "Shape constancy example", "Lightness and colour constancy with ratio and retinex", "Constructivist and ecological explanations", "Breakdowns of constancy"],
    module: "sensation-perception/2-8",
    visuals: [
      { kind: "amesroom", data: { title: "When size constancy fails", caption: "Through the peephole the room looks normal, so the people seem to change size. Step aside to see why." } },
    ],
    ref: "Atkinson and Hilgard ch 5; Holway and Boring 1941; Turnbull 1961; Wallach 1948; Land 1977; Brainard and Hurlbert 2015 on the dress",
  },
  {
    id: "pa-l02-013",
    subject: S,
    topic: "depth-perception",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net", "mcp-entrance"],
    question: "How do we perceive depth? Describe the monocular, binocular and oculomotor cues to depth, and discuss evidence on whether depth perception is innate or learned.",
    plan: ["The problem: a two-dimensional retina, a three-dimensional world", "Oculomotor cues", "Monocular pictorial and motion cues", "Binocular disparity and stereopsis", "Innate or learned: visual cliff and other evidence", "Illusions, clinical links and conclusion"],
    answer: `## The problem
The retinal image is two-dimensional, yet we see a three-dimensional world. The brain reconstructs depth from many cues, combining them to judge distance and shape. Cues are classified as oculomotor, monocular (usable with one eye) and binocular (requiring both eyes).

## Oculomotor cues
- Accommodation: the ciliary muscles change the shape of the lens to focus on near objects; the muscle tension signals distance. Useful only within about 2 metres.
- Convergence: the eyes turn inward to look at near objects; the degree of turning signals distance. Useful within a few metres.

## Monocular cues
Pictorial cues, used by artists to create depth on a flat surface:
- Interposition (occlusion): an object that blocks another is nearer.
- Relative size: of two similar objects, the one with a smaller image seems farther away.
- Familiar size: knowing the real size of an object, such as a person or a car, helps judge its distance.
- Linear perspective: parallel lines such as railway tracks appear to converge in the distance.
- Texture gradient: textures become finer and denser with distance, as with a field of grass or a paved road. James Gibson emphasised this cue.
- Height in the visual field: objects closer to the horizon seem farther away.
- Atmospheric (aerial) perspective: distant objects appear hazier and bluer, as distant hills do.
- Shading and shadows: light usually comes from above, so shading reveals shape and depth, and cast shadows show position.
Motion cues:
- Motion parallax: when we move, near objects seem to move quickly in the opposite direction, far objects move slowly in the same direction. From a train window, nearby poles rush past while distant hills drift.
- Optic flow: as we move forward, the visual scene expands outward from the point we are heading towards.
- Accretion and deletion: surfaces are covered or uncovered as we move.

## Binocular cues
- Binocular disparity: because the eyes are about 6 centimetres apart, each receives a slightly different image. The brain fuses the images, and the amount of disparity indicates relative depth. This is stereopsis. Charles Wheatstone's stereoscope in 1838 showed that two flat pictures with slight disparity produce vivid depth.
- Bela Julesz's random dot stereograms, which contain no monocular cues at all, produce depth only through disparity, showing that stereopsis does not require recognising objects first.
- Disparity-tuned neurons in V1 and beyond respond to particular depths.
- 3D films and virtual reality headsets present different images to each eye to create disparity.
- Stereopsis is most effective within about 30 metres; at greater distances monocular cues dominate.

## Innate or learned?
- The visual cliff: Eleanor Gibson and Richard Walk built a glass table with a checkerboard pattern directly under one half (the shallow side) and far below the other half (the deep side). Of 36 infants aged 6 to 14 months, 27 crawled onto the shallow side, but only 3 crawled onto the deep side even when their mothers called them. Newborn animals such as chicks, lambs and goats, which walk soon after birth, also avoided the deep side, suggesting an innate component.
- Joseph Campos found that 2-month-old infants placed on the deep side showed a slowed heart rate (interest) rather than fear, while fear of heights appeared after infants began crawling, suggesting that crawling experience is important.
- Infants respond to looming objects with defensive blinking by about one month, and binocular disparity sensitivity develops at about four months.
- Richard Held and Alan Hein's kitten carousel: kittens that moved themselves developed normal visually guided behaviour, while kittens carried passively did not, showing that active experience is needed.
- Studies of people who gained sight in adulthood, such as patients after cataract removal (including children treated in Project Prakash in India, led by Pawan Sinha), show that some depth and object perception develops within months, while other abilities remain limited.
- Cross-cultural research by William Hudson showed that some groups with little experience of pictures had difficulty interpreting pictorial depth cues in drawings.
The conclusion is that basic depth sensitivity is innate, but it is refined and calibrated by experience.

## Clinical links
- Strabismus (squint) or amblyopia in early childhood can permanently impair stereopsis unless treated early, showing a sensitive period.
- People with one eye rely on monocular cues and perform most everyday tasks well.

## Conclusion
Depth perception results from integrating many cues: oculomotor, pictorial, motion and binocular disparity. Each is effective at different distances and the brain combines them. Evidence from the visual cliff and other studies indicates an innate foundation shaped by active experience.`,
    keyPoints: ["The two-dimensional retina problem", "Accommodation and convergence", "At least five pictorial cues with examples", "Motion parallax", "Binocular disparity and stereopsis with Julesz", "Visual cliff findings with numbers", "Campos and Held and Hein evidence", "Conclusion on innate and learned"],
    module: "sensation-perception/2-8",
    visuals: [
      { kind: "sort", caption: "Binocular cues", data: { prompt: "Monocular or binocular cue?", buckets: ["Monocular", "Binocular"], items: [{ text: "Railway lines meeting in the distance", bucket: 0 }, { text: "Slightly different images in the two eyes", bucket: 1 }, { text: "Poles rushing past a train window", bucket: 0 }, { text: "A tree hiding part of a house", bucket: 0 }] } },
      { kind: "experiment", caption: "Innate or learned?", data: { title: "Gibson and Walk's visual cliff", question: "Of 36 crawling infants, how many crawled onto each side when their mother called?", unit: " infants", max: 36, conditions: [{ label: "Shallow side", value: 27 }, { label: "Deep side", value: 3 }], why: "Most crawling infants perceive depth and avoid the drop." } },
      { kind: "amesroom", caption: "Monocular cues", data: { caption: "Through one eye the faked perspective wins; step aside and motion parallax reveals the true shape." } },
    ],
    ref: "Gibson and Walk 1960 Scientific American; Campos, Langer and Krowitz 1970; Held and Hein 1963; Julesz 1971; Hudson 1960; Sinha 2013 Project Prakash; Atkinson and Hilgard ch 5",
  },
  {
    id: "pa-l02-014",
    subject: S,
    topic: "motion-perception",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net"],
    question: "How do we perceive motion? Discuss real and apparent motion, the motion aftereffect, biological motion and the neural basis of motion perception.",
    plan: ["Why motion perception matters", "Real motion: image movement and eye movements", "Apparent motion and the phi phenomenon", "Motion aftereffect and induced motion", "Biological motion", "Neural basis and akinetopsia"],
    answer: `## Importance
Motion perception helps us detect predators, prey and traffic, guide our own movement, separate objects from backgrounds and recognise actions. Movement in the periphery of the visual field captures attention automatically.

## Real motion
We perceive motion when an object's image moves across the retina. But the image also moves when we move our eyes, yet the world does not seem to move. Hermann von Helmholtz proposed the corollary discharge (efference copy) theory: when the brain sends a command to move the eyes, it also sends a copy to the visual system, which cancels the image motion. If you gently press the side of your eye, the world seems to jump, because the eye moved without a command. When we track a moving object with our eyes (smooth pursuit), the image stays still on the retina, but motion is perceived because of the eye movement signal.

## Apparent motion
- The phi phenomenon: Max Wertheimer found in 1912 that two lights flashed one after the other at the right interval (about 50 to 60 milliseconds apart) are seen as a single light moving from one place to the other. This was the founding experiment of Gestalt psychology, because the motion is a whole not present in either part.
- Films, television and neon signs rely on apparent motion: a series of still frames shown at 24 or more frames per second appears as smooth movement.
- Induced motion: when a frame moves, a stationary object within it may appear to move, as when the moon seems to race behind moving clouds.
- Autokinetic effect: a stationary point of light in a dark room appears to move, used by Muzafer Sherif to study the formation of group norms.

## Motion aftereffect
After watching motion in one direction for some time, a stationary scene appears to move in the opposite direction. Staring at a waterfall and then at the rocks beside it makes the rocks seem to drift upward (the waterfall illusion). This is explained by adaptation of direction-selective neurons: the neurons tuned to the watched direction fatigue, so the balance shifts towards neurons tuned to the opposite direction.

## Biological motion
Gunnar Johansson attached small lights to the joints of actors dressed in black and filmed them in darkness. When still, the dots looked like a random pattern; when the actor walked, viewers instantly saw a moving person. From such point-light displays people can recognise walking, dancing, the actor's sex, emotional state and even identity of friends. Newborns show a preference for biological motion, and people with autism sometimes show reduced sensitivity to it. Biological motion engages the superior temporal sulcus.

## Neural basis
- Direction-selective neurons appear in V1.
- Area V5, also called MT (middle temporal), in the dorsal stream, contains neurons that respond to motion in particular directions and speeds. William Newsome showed that monkeys' judgements of motion direction in noisy dot displays depend on MT activity; stimulating MT neurons biased their judgements.
- Akinetopsia: Josef Zihl described patient L.M., who after bilateral damage to the V5 region saw the world as a series of frozen snapshots. She could not pour tea because the liquid appeared frozen and the cup overflowed suddenly, and found crossing the road frightening because cars seemed to jump from place to place.

## Conclusion
Motion perception combines retinal image movement with eye movement signals and is supported by specialised neurons, especially in V5. Apparent motion, aftereffects and biological motion show that motion is actively constructed by the brain.`,
    keyPoints: ["Importance of motion perception", "Corollary discharge theory", "Phi phenomenon and Wertheimer", "Induced and autokinetic motion", "Motion aftereffect and adaptation explanation", "Johansson's point-light biological motion", "V5 or MT and akinetopsia patient L.M."],
    module: "sensation-perception/2-8",
    visuals: [
      { kind: "brainmap", caption: "Biological motion", data: { title: "Motion in the brain", focus: ["occipital", "parietal", "temporal"], notes: { occipital: "V1 direction-selective cells, and V5 or MT near the occipito-temporal junction.", parietal: "Dorsal stream uses motion to guide action.", temporal: "Superior temporal sulcus: biological motion." } } },
    ],
    ref: "Wertheimer 1912; Johansson 1973; Zihl, von Cramon and Mai 1983; Newsome and Pare 1988; Atkinson and Hilgard ch 5; Bear, Connors and Paradiso ch 10",
  },
  {
    id: "pa-l02-015",
    subject: S,
    topic: "illusions",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "What are visual illusions? Describe the Muller-Lyer and Ponzo illusions and evaluate the explanations offered for them.",
    plan: ["Define illusions and why psychologists study them", "Muller-Lyer and Ponzo illusions", "Misapplied size constancy (Gregory)", "Other explanations and cultural evidence", "Evaluation and conclusion"],
    answer: `## Meaning
A visual illusion is a perception that does not match the physical properties of the stimulus, and that persists even when we know it is false. Illusions differ from hallucinations, which occur without any stimulus. Psychologists study illusions because they reveal the assumptions and processes the visual system normally uses successfully.

## The Muller-Lyer illusion
Two lines of equal length, one ending in outward-pointing fins (like arrow tails) and one ending in inward-pointing fins (like arrowheads), look unequal: the line with outward fins appears longer, often by about 20 to 30 percent.

## The Ponzo illusion
Two equal horizontal lines are drawn between two converging lines, like railway tracks. The upper line, nearer to the point of convergence, looks longer.

## Misapplied size constancy theory
Richard Gregory proposed that the visual system treats these drawings as three-dimensional scenes and applies size constancy.
- In the Ponzo illusion, the converging lines act as linear perspective, so the upper line is interpreted as farther away. An object farther away with the same retinal size must be larger, so it looks longer.
- In the Muller-Lyer illusion, the outward-finned figure resembles the inside corner of a room, receding from the viewer, so the vertical line seems farther away and is scaled up. The inward-finned figure resembles the outside corner of a building, projecting towards the viewer, so it seems nearer and is scaled down.
- Support: Marshall Segall, Donald Campbell and Melville Herskovits found that people from "carpentered" environments, with many straight lines and right angles, were more susceptible to the Muller-Lyer illusion than people from rural African and other groups living in round huts with fewer right angles. This fits the idea that experience with rectangular buildings shapes the interpretation.

## Criticisms of Gregory's theory
- The Muller-Lyer illusion persists when the fins are replaced by circles or squares, which do not suggest corners or depth.
- Ruth Day and others showed that the illusion occurs even when the figure is clearly flat, and some people see no depth in it.
- The illusion occurs in tactile versions felt by blind people.
- The carpentered world effect may also reflect differences in education, retinal pigmentation or familiarity with pictures; later studies found mixed results.

## Other explanations
- Conflicting cues theory (Ruth Day): judgement of line length is influenced by the overall length of the whole figure, including the fins.
- Eye movement theory: the eyes travel farther along the outward-finned figure.
- Confusion of the line with its context (assimilation): we judge the size of an area rather than the line alone.
- Statistical theory (Catherine Howe and Dale Purves): illusions reflect the probability distribution of real-world sources of similar images; the brain sees what such images usually signify in natural scenes.

## Evaluation
No single theory explains all illusions. Misapplied constancy accounts well for the Ponzo illusion and depth-related illusions, but less well for the Muller-Lyer illusion. Illusions nonetheless demonstrate that perception is an active interpretation that uses context and assumptions about the world, which usually help but sometimes mislead.

## Conclusion
The Muller-Lyer and Ponzo illusions show that the same retinal input can be perceived differently depending on context. Explanations based on size constancy, conflicting cues and natural image statistics each capture part of the story.`,
    keyPoints: ["Definition and distinction from hallucination", "Description of both illusions", "Gregory's misapplied constancy explanation", "Carpentered world evidence", "Criticisms including fins replaced by circles", "Alternative explanations", "Balanced conclusion"],
    module: "sensation-perception/2-8",
    visuals: [
      { kind: "illusion", caption: "The Muller-Lyer illusion", data: { kind: "muller-lyer", caption: "Judge which line is longer, then measure them." } },
      { kind: "illusion", caption: "The Ponzo illusion", data: { kind: "ponzo", caption: "The converging lines act like railway tracks. Which bar looks longer?" } },
    ],
    ref: "Gregory 1963 and 1998 Eye and Brain; Segall, Campbell and Herskovits 1966; Day 1989; Howe and Purves 2005; Atkinson and Hilgard ch 5",
  },
  {
    id: "pa-l02-016",
    subject: S,
    topic: "theories-of-perception",
    marks: 20,
    difficulty: 4,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Compare and contrast Gregory's constructivist theory of perception with Gibson's direct (ecological) theory. Can the two be reconciled?",
    plan: ["The central question: how much is in the stimulus?", "Gregory's top-down constructivist theory with evidence", "Criticisms of Gregory", "Gibson's direct theory: optic array, invariants, affordances, with evidence", "Criticisms of Gibson", "Reconciliation: Neisser's cycle, dual streams, predictive processing; conclusion"],
    answer: `## The central question
Theories of perception disagree about how much information is available in the stimulus. If the retinal image is poor and ambiguous, the brain must add knowledge to construct a percept (indirect, top-down theories). If the light reaching the eye is rich in structured information, perception can be direct, needing no inference (bottom-up, ecological theories). Richard Gregory and James Gibson are the classic representatives of these positions.

## Gregory's constructivist theory
Building on Hermann von Helmholtz's idea of unconscious inference, Gregory argued in the 1960s and 1970s that perception is a process of hypothesis testing. The sensory input is incomplete and ambiguous, so the brain uses stored knowledge, expectations and context to form the most likely hypothesis about what is out there. Perception is "a dynamic searching for the best interpretation of the available data". About 90 percent of the information reaching the eye is said to be lost by the time it reaches the brain, so knowledge must fill the gap.
Evidence:
- Visual illusions: the Ponzo and Muller-Lyer illusions are explained as misapplied size constancy, treating flat drawings as 3D.
- Ambiguous figures: the Necker cube and Rubin's vase flip between two hypotheses because the data fit both equally.
- The hollow face illusion: a hollow mask viewed from the inside looks like a normal convex face, because our strong expectation that faces are convex overrides depth cues. Interestingly, some studies report that people with schizophrenia are less susceptible to it.
- Perceptual set: expectations, motivation and culture influence what we perceive. In Jerome Bruner and Leigh Minturn's study, an ambiguous figure was seen as the letter B when surrounded by letters and as the number 13 when surrounded by numbers.
- Context effects in reading: the same shape is read as H in "THE" and A in "CAT".
- Gregory's own case S.B., blind from infancy and given sight at 52 by corneal grafts, could recognise objects he had known by touch but struggled with others and with depth, suggesting perception depends on learning.

## Criticisms of Gregory
- Illusions use artificial, static, brief two-dimensional displays; in the real world, perception is usually accurate. If perception were mainly hypothesis testing, errors would be far more common.
- It does not explain how people perceive accurately when expectations are wrong, or how perception starts in infancy before knowledge is acquired.
- It does not specify exactly how hypotheses are generated and tested.
- It neglects the richness of information available when the observer moves.

## Gibson's direct (ecological) theory
James Gibson, who studied pilots during the Second World War, argued that the light reaching the eye of a moving observer is richly structured, and perception is the direct pick-up of this information. No inference or stored knowledge is needed; perception evolved to guide action in the environment.
- The optic array: the structured pattern of light reaching the eye from all surfaces.
- Optic flow patterns: when we move, the array changes systematically. Flow expands from the point we are heading towards (the pole), giving information about direction and speed. Pilots landing aircraft use this.
- Texture gradients specify distance and slant directly.
- Invariants: higher-order properties that do not change as the observer moves, such as the horizon ratio (the proportion of an object above and below the horizon is the same for objects of the same size at any distance), which specifies size directly and explains size constancy.
- Affordances: objects are perceived in terms of the actions they allow: a chair affords sitting, a handle affords grasping, a ledge affords falling. Affordances are perceived directly, without first recognising and categorising the object.
- Resonance: the perceptual system "resonates" to information as a radio tunes to a frequency.
Evidence:
- David Lee's studies showed that gannets diving into the sea fold their wings at a time determined by tau, the rate of expansion of the image, without calculating distance and speed; long jumpers adjust their strides on the same information.
- Lee and Eric Aronson's "swinging room": when the walls of a room moved towards or away from toddlers, they swayed or fell, showing that optic flow directly controls balance.
- Ecological validity: Gibson's theory explains accurate perception during real-world action, which constructivism neglects.

## Criticisms of Gibson
- It cannot easily explain illusions, ambiguous figures or perceptual errors, which Gibsonians dismiss as artificial laboratory artefacts.
- It underplays the role of knowledge, meaning and culture: recognising that an object is a phone or a weapon requires stored knowledge. Fodor and Pylyshyn argued that "direct pick-up" is not an explanation of mechanism.
- The concept of affordance is vague and difficult to test; it is unclear how affordances that depend on culture (a post box affords posting a letter) are picked up directly.
- It says little about the brain mechanisms involved.

## Comparison
| Feature | Gregory (constructivist) | Gibson (direct) |
| Direction of processing | Top-down | Bottom-up |
| Stimulus information | Impoverished, ambiguous | Rich, structured |
| Role of knowledge | Essential, hypotheses | Not needed |
| Observer | Often static, laboratory | Moving through the environment |
| Key concepts | Unconscious inference, perceptual set | Optic array, invariants, affordances |
| Evidence | Illusions, ambiguous figures, set | Optic flow, tau, swinging room |
| Explains errors | Well | Poorly |
| Explains accurate real-world action | Less well | Well |

## Reconciliation
- Ulric Neisser's perceptual cycle model, proposed in 1976, combines both: schemas (knowledge) direct exploration of the environment, exploration samples the information available (as Gibson described), and the information modifies the schemas. Perception is a continuous cycle of top-down and bottom-up processing.
- The two theories may suit different conditions: Gibson's for good viewing conditions and action, Gregory's for brief, ambiguous or degraded stimuli.
- The dual stream view of David Milner and Melvyn Goodale offers a neural reconciliation: the dorsal "how" stream guides action rapidly using visual information, much as Gibson proposed, and is relatively immune to some illusions (people grasp the Ebbinghaus circles with correctly sized grip although they misperceive them); the ventral "what" stream supports recognition and is influenced by knowledge and context, as Gregory proposed.
- Predictive processing theories, in which the brain continuously predicts sensory input and updates with prediction errors, are a modern constructivist view that nonetheless gives the input a strong role.

## Conclusion
Gregory explains why perception can be fooled and how knowledge shapes it; Gibson explains how moving organisms perceive accurately in rich environments. Each is incomplete alone. Neisser's cycle, the two visual streams and predictive processing suggest that perception combines direct pick-up of information with knowledge-driven interpretation.`,
    keyPoints: ["Central question of stimulus richness", "Gregory's hypothesis testing with unconscious inference", "Evidence: illusions, hollow face, perceptual set, S.B.", "Criticisms of Gregory", "Gibson's optic array, optic flow, invariants and affordances", "Evidence: tau and swinging room", "Criticisms of Gibson", "Reconciliation through Neisser, dual streams or predictive processing"],
    pitfalls: ["Describing both without comparing", "Ignoring reconciliation in a compare and contrast question"],
    module: "sensation-perception/3-1",
    visuals: [
      { kind: "compare", caption: "Comparison", data: { title: "Two theories of perception", a: { label: "Gregory: constructivist", points: ["Input is poor and ambiguous", "Brain tests hypotheses using knowledge", "Explains illusions and set"], summary: "Top-down." }, b: { label: "Gibson: direct", points: ["Moving observer gets rich information", "Invariants and affordances picked up directly", "Explains accurate action"], summary: "Bottom-up." } } },
      { kind: "flow", caption: "Reconciliation", data: { title: "Neisser's perceptual cycle", layout: "cycle", nodes: [{ id: "s", label: "Schema", detail: "Knowledge and expectations." }, { id: "e", label: "Exploration", detail: "Where to look and listen." }, { id: "o", label: "Object or available information", detail: "What the environment offers." }] } },
      { kind: "illusion", caption: "Criticisms of Gregory", data: { kind: "ebbinghaus", caption: "The two centre circles look different in size, yet people grasp them with the right grip: the action stream is not fooled." } },
    ],
    ref: "Gregory 1970 The Intelligent Eye and 1997; Gibson 1979 The Ecological Approach to Visual Perception; Neisser 1976; Lee and Reddish 1981 gannets; Lee and Aronson 1974; Aglioti, DeSouza and Goodale 1995; Bruner and Minturn 1955",
  },
  {
    id: "pa-l02-017",
    subject: S,
    topic: "theories-of-perception",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Distinguish between bottom-up and top-down processing in perception, with examples and evidence.",
    plan: ["Define both", "Bottom-up: feature detection, Pandemonium", "Top-down: context, word superiority, expectation", "Interaction: interactive activation model", "Conclusion"],
    answer: `## Definitions
- Bottom-up (data-driven) processing begins with the sensory input and builds perception from basic features to more complex wholes. It depends on the stimulus.
- Top-down (conceptually driven) processing uses knowledge, expectations, context and goals to interpret the input. It depends on the perceiver.
Almost all perception involves both.

## Bottom-up processing
- Feature detectors: David Hubel and Torsten Wiesel found neurons in the visual cortex that respond to edges, lines of particular orientation and movement. Perception could be built up from these features.
- Oliver Selfridge's Pandemonium model of letter recognition: image demons register the input, feature demons detect lines and curves, cognitive demons "shout" according to how many of their features are present, and a decision demon chooses the loudest. Letters sharing many features (such as E and F) are more often confused, as the model predicts.
- Visual search: a target defined by a single feature, such as a red item among green ones, pops out regardless of how many distractors there are.
- Bottom-up processing dominates with novel stimuli, where no expectations can help.

## Top-down processing
- Context: an ambiguous character is read as B in "A B C" and as 13 in "12 13 14". The same scribble is read as H in "THE" and A in "CAT".
- Word superiority effect: Gerald Reicher and Daniel Wheeler found that a letter is identified more accurately when briefly presented within a word ("WORK", is it K or D?) than alone or in a non-word. Knowledge of words aids letter recognition.
- Phonemic restoration: when a sound in a sentence is replaced by a cough, listeners report hearing the missing sound, influenced by later context (Richard Warren).
- Object recognition in context: Stephen Palmer showed that a loaf of bread was identified more accurately after viewing a kitchen scene than after an unrelated scene.
- Perceptual set: expectations, motivation and emotion bias perception. A hungry person perceives food-related words faster.
- Top-down processing dominates when input is degraded, brief or ambiguous.

## Interaction
James McClelland and David Rumelhart's interactive activation model of word recognition has feature, letter and word levels, with activation flowing both upward and downward. Letters activate words, and active words feed back to strengthen their letters, explaining the word superiority effect. Modern predictive processing theories see the brain as constantly predicting input (top-down) and correcting predictions with incoming data (bottom-up).

## Clinical link
Hallucinations may involve overly strong top-down expectations relative to sensory evidence, a view supported by studies showing that people prone to hallucinations are more likely to "hear" expected words in noise.

## Conclusion
Bottom-up processing provides the data; top-down processing interprets them. Perception is the product of their continuous interaction, which explains both its speed and its occasional errors.`,
    keyPoints: ["Definitions of both", "Feature detectors and Pandemonium", "Pop-out as bottom-up", "Context effects such as B or 13", "Word superiority effect", "Phonemic restoration or Palmer's kitchen study", "Interactive activation model", "Clinical link"],
    module: "sensation-perception/3-1",
    visuals: [
      { kind: "flow", caption: "Definitions", data: { title: "Two directions of processing", layout: "tree", nodes: [{ id: "p", label: "Perception" }, { id: "b", label: "Bottom-up", parent: "p", detail: "Features, edges, colour, from the senses upward." }, { id: "t", label: "Top-down", parent: "p", detail: "Knowledge, context, expectation, from the mind downward." }] } },
    ],
    ref: "Selfridge 1959; Reicher 1969; Warren 1970; Palmer 1975; McClelland and Rumelhart 1981; Atkinson and Hilgard ch 5",
  },
  {
    id: "pa-l02-018",
    subject: S,
    topic: "perception-motivation-culture",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on perceptual set.",
    plan: ["Define perceptual set", "Factors creating set", "Classic studies", "Implications"],
    answer: `## Meaning
Perceptual set is a readiness to perceive a stimulus in a particular way, based on expectations, context, motivation and past experience. It acts as a filter and a guide, so that we notice some features and interpret ambiguous input in line with what we expect.

## Factors
- Expectation and context: Bruner and Minturn's ambiguous figure was read as B among letters and as 13 among numbers.
- Recent experience: B. R. Bugelski and Delia Alampay showed people pictures of animals or of people before the ambiguous "rat-man" figure; those who had seen animals saw a rat, those who had seen faces saw a man.
- Motivation and needs: Bruner and Goodman found that poor children overestimated the size of coins more than rich children did. Hungry participants perceived ambiguous pictures as food-related more often.
- Emotion: anxious people are quicker to perceive threat in ambiguous faces.
- Culture: cultural experience affects interpretation of pictures and depth cues.
- Instructions and labels.

## Implications
- Eyewitnesses perceive events in line with expectations and stereotypes; in Gordon Allport and Leo Postman's rumour studies, a razor held by a white man was often remembered as held by a Black man.
- Proofreading errors occur because we see what we expect to see.
- Clinicians may "see" symptoms that fit an expected diagnosis.
- Advertising and design deliberately create sets.`,
    keyPoints: ["Definition", "Expectation and context with Bruner and Minturn", "Bugelski and Alampay rat-man", "Motivation with Bruner and Goodman", "Practical implications"],
    module: "sensation-perception/3-2",
    visuals: [
      { kind: "reveal", caption: "Factors", data: { prompt: "Read quickly: 'A BIRD IN THE THE HAND'. Did you notice anything?", answer: "Most people miss the repeated 'THE' because they expect the familiar phrase. Expectation shapes what is perceived." } },
    ],
    ref: "Bruner and Minturn 1955; Bugelski and Alampay 1961; Bruner and Goodman 1947; Allport and Postman 1947",
  },
  {
    id: "pa-l02-019",
    subject: S,
    topic: "perception-motivation-culture",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the influence of culture on perception, with reference to cross-cultural research on illusions, pictorial depth perception and holistic versus analytic perception. Include Indian research.",
    plan: ["Why culture might shape perception", "Illusion susceptibility and the carpentered world", "Pictorial depth: Hudson's studies", "Holistic versus analytic perception", "Ecocultural approach and Indian research", "Evaluation and conclusion"],
    answer: `## Why culture might shape perception
Perception is partly learned: the brain uses experience to interpret ambiguous input. If people grow up in different physical environments, with different art, languages and social practices, they may learn different perceptual habits. Cross-cultural psychology tests this by comparing groups, though separating culture from education, ecology and test familiarity is difficult.

## Illusions and the carpentered world
Marshall Segall, Donald Campbell and Melville Herskovits, in a study of nearly 2,000 people in 15 societies in Africa, the Philippines and the United States, found that:
- urban Europeans and Americans living in rectangular, "carpentered" environments were more susceptible to the Muller-Lyer illusion, consistent with learning to read acute and obtuse angles as corners;
- people living in open landscapes, such as plains, were more susceptible to the horizontal-vertical illusion (a vertical line looks longer than an equal horizontal line), consistent with experience of long receding vistas, while forest dwellers were less susceptible.
Later critiques suggested that differences in retinal pigmentation, education, attention to test instructions and familiarity with pictures may explain part of the effect.

## Pictorial depth perception
William Hudson tested South African children and adults using drawings in which an elephant, an antelope and a hunter were shown with depth cues (relative size, overlap, perspective). Asked whether the hunter was aiming at the elephant or the antelope, many people with little schooling or exposure to pictures gave "two-dimensional" responses: since the elephant appeared smaller and higher, they saw it as near the hunter's spear. Jan Deregowski found that some people unfamiliar with pictures had difficulty seeing depth in drawings and building models from them. Pictorial conventions are therefore partly learned, though even unschooled people recognise simple pictures of familiar objects.

## Holistic versus analytic perception
Richard Nisbett, Takahiko Masuda and Shinobu Kitayama have shown that East Asian participants tend to attend to context and relationships (holistic), while Western participants focus on central objects (analytic).
- When describing underwater scenes, Japanese participants mentioned the background and relationships more, Americans the large fish.
- Eye-tracking showed Chinese participants fixated more on backgrounds.
- In the framed line test, Japanese participants were better at reproducing a line in proportion to its frame, Americans at reproducing its absolute length.
These differences are linked to collectivist versus individualist social orientations and can be primed temporarily.

## Ecocultural approach and Indian research
John Berry's ecocultural framework proposes that ecology (for example hunting versus agriculture) and socialisation shape cognitive styles. Hunting societies, needing to find animals in a varied landscape, showed more field independence (separating an item from its context) than agricultural societies, which stress conformity.
In India, Ramesh Chandra Mishra and colleagues have studied tribal and non-tribal groups such as the Birhor (hunter-gatherers) and Asur and others in Bihar and Jharkhand, as well as children in traditional and modern schooling. They found that ecology, schooling and acculturation influence perceptual differentiation, spatial cognition (including the use of geocentric directions such as north and south rather than left and right) and categorisation. Indian studies of children in Sanskrit pathshalas and modern schools found differences in spatial reference frames linked to education and language. Durganand Sinha argued that Indian psychology must study perception and cognition in its ecological and cultural context rather than assume Western norms.

## Perception of pictures and colour
Languages divide colour space differently, and colour discrimination is slightly better across a language's colour boundaries (as with Russian blues), linking language, culture and perception.

## Evaluation
- Culture influences higher-level interpretation more than basic sensory processes; acuity, colour sensitivity and basic grouping are largely universal.
- Many effects are small and depend on schooling, test materials and familiarity with laboratory tasks.
- Within-culture differences are often larger than between-culture differences.
- Research has relied on Western tests, which may disadvantage some groups; culture-fair materials are needed.
- Modern globalisation and schooling reduce differences.

## Conclusion
Culture shapes how people interpret visual cues, attend to scenes and read pictures, through ecology, art, language, schooling and social orientation. Basic perception is shared by all humans, but the habits that guide interpretation are partly learned within a culture, as both international and Indian research shows.`,
    keyPoints: ["Rationale for cultural influence", "Segall, Campbell and Herskovits findings including horizontal-vertical illusion", "Hudson's pictorial depth study", "Nisbett and Masuda holistic versus analytic evidence", "Berry's ecocultural framework", "Indian research such as R. C. Mishra", "Critique: education, test familiarity", "Conclusion distinguishing basic and higher-level perception"],
    module: "sensation-perception/3-2",
    visuals: [
      { kind: "compare", caption: "Holistic versus analytic perception", data: { title: "Two ways of looking at a scene", a: { label: "Analytic", points: ["Focus on the central object", "Judges absolute size well", "More common in individualist cultures"], summary: "The fish." }, b: { label: "Holistic", points: ["Attends to background and relations", "Judges size relative to context", "More common in collectivist cultures"], summary: "The fish in its pond." } } },
      { kind: "illusion", caption: "Illusions and the carpentered world", data: { kind: "muller-lyer", caption: "People raised among rectangular buildings tend to see a larger illusion." } },
    ],
    ref: "Segall, Campbell and Herskovits 1966; Hudson 1960; Deregowski 1980; Masuda and Nisbett 2001; Kitayama et al 2003 framed line test; Berry 1976; Mishra, Dasen and Niraula 2003; Sinha 1986",
  },
  {
    id: "pa-l02-020",
    subject: S,
    topic: "awareness",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on subliminal perception.",
    plan: ["Define subliminal perception", "Early claims and controversy", "Experimental evidence", "Limits and applications"],
    answer: `## Meaning
Subliminal perception is the processing of a stimulus presented below the threshold of conscious awareness, so that it influences thought or behaviour although the person does not report seeing or hearing it. Stimuli are typically flashed for a few milliseconds and followed by a mask.

## Early claims
In 1957 James Vicary claimed that flashing "Eat popcorn" and "Drink Coca-Cola" during a film increased sales at a cinema. The claim caused public alarm, but Vicary later admitted that he had fabricated the data. Claims that subliminal messages in self-help audiotapes improve memory or self-esteem have also failed controlled tests: Anthony Greenwald found that improvement depended on what the label said, not on the hidden content.

## Experimental evidence
- Masked priming: a word flashed briefly and masked can speed recognition of a related word, showing semantic processing without awareness.
- Mere exposure: Robert Zajonc and colleagues found that people preferred shapes they had been shown subliminally, without recognising them.
- Emotional faces presented subliminally can activate the amygdala and produce skin conductance responses.
- Blindsight and other neurological cases show processing of stimuli the person denies seeing.
- Johan Karremans found that subliminally priming a drink brand increased its choice only among people who were already thirsty.

## Limits and applications
Effects are real but small, short-lived and depend on existing motivation; subliminal messages cannot make people act against their wishes. The research is important for understanding unconscious processing, and the ethics of hidden advertising, which is banned in many countries.`,
    keyPoints: ["Definition with masking", "Vicary hoax", "Greenwald's self-help tape study", "Masked priming and mere exposure evidence", "Karremans' motivation finding", "Limits"],
    module: "sensation-perception/3-3",
    visuals: [
      { kind: "compare", caption: "Limits and applications", data: { title: "Subliminal effects: myth and evidence", a: { label: "Myth", points: ["Hidden ads make people buy", "Self-help tapes change personality"], summary: "Not supported." }, b: { label: "Evidence", points: ["Masked words prime related words", "Effects small and short-lived", "Work only if already motivated"], summary: "Real but limited." } } },
    ],
    ref: "Pratkanis 1992 on Vicary; Greenwald et al 1991; Kunst-Wilson and Zajonc 1980; Karremans, Stroebe and Claus 2006; Whalen et al 1998",
  },
];
