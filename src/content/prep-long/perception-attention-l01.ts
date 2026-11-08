import type { LongQA } from "@/lib/prep/long-types";

const S = "perception-attention" as const;

export const PERCEPTION_ATTENTION_L01: LongQA[] = [
  {
    id: "pa-l01-001",
    subject: S,
    topic: "psychophysics",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "What is psychophysics? Explain absolute and difference thresholds, Weber's law and Fechner's law, with worked examples.",
    plan: ["Define psychophysics and its founders", "Absolute threshold with examples", "Difference threshold and Weber's law with numbers", "Fechner's law and its meaning", "Limits and later developments"],
    answer: `## Meaning
Psychophysics is the study of the quantitative relationship between physical stimuli and the sensations they produce. Gustav Fechner founded it in 1860 with "Elements of Psychophysics", building on the work of Ernst Weber. It was one of the first areas of scientific, experimental psychology.

## Absolute threshold
The absolute threshold is the minimum intensity of a stimulus that a person can detect. Because detection varies from trial to trial, it is defined statistically as the intensity detected on 50 percent of trials. Classic approximate values, under ideal conditions:
- Vision: a candle flame seen from about 48 kilometres (30 miles) on a clear, dark night.
- Hearing: the tick of a watch at about 6 metres in a quiet room.
- Taste: one teaspoon of sugar in about 9 litres of water.
- Smell: one drop of perfume spread through a three-room flat.
- Touch: the wing of a bee falling on the cheek from about 1 centimetre.
Thresholds vary with attention, motivation, fatigue and expectation, which is why signal detection theory later replaced the idea of a fixed threshold.

## Difference threshold and Weber's law
The difference threshold, or just noticeable difference (JND), is the smallest change in a stimulus that can be detected on 50 percent of trials. Weber found that the JND is not a fixed amount but a constant proportion of the original stimulus:
JND / I = k, where I is the stimulus intensity and k is the Weber fraction.
Worked example: for lifted weights, k is about 0.02 (2 percent).
- With a 100 gram weight, the JND = 0.02 x 100 = 2 grams; a 102 gram weight feels heavier.
- With a 500 gram weight, the JND = 0.02 x 500 = 10 grams; 502 grams would feel the same.
Weber fractions differ across senses: roughly 0.08 for brightness, 0.05 for loudness, 0.02 for weight, and about 0.003 for the pitch of a tone, so we are very sensitive to pitch changes. The smaller the fraction, the more sensitive the sense. Weber's law holds well in the middle range of intensities but breaks down at very low and very high levels.

## Fechner's law
Fechner assumed that each JND is an equal step in sensation and derived that sensation grows with the logarithm of stimulus intensity:
S = k log I.
To double sensation you must much more than double the stimulus. For example, if adding one candle to a room of 10 candles produces a noticeable change, you would need to add 10 candles to a room of 100 to produce the same change. This explains why a whisper is noticeable in a quiet room but not at a wedding with loud music.

## Limits and later developments
- Stanley Stevens's magnitude estimation showed that many sensations follow a power function rather than a logarithmic one (Stevens' power law).
- Signal detection theory showed that thresholds depend on decision criteria as well as sensitivity.
- Psychophysical methods are now used in hearing tests (audiometry), vision tests, product design and in studying perception in clinical groups.

## Conclusion
Psychophysics established that the relation between stimulus and sensation is lawful: detection needs a minimum intensity, noticeable differences are proportional to the starting intensity (Weber), and sensation grows more slowly than stimulus intensity (Fechner).`,
    keyPoints: ["Definition and founders", "Absolute threshold as 50 percent detection", "Examples of absolute thresholds", "JND and Weber's law formula", "Correct worked JNDs of 2 g and 10 g", "Fechner's logarithmic law", "Limits and later developments"],
    module: "sensation-perception/2-1",
    visuals: [
      { kind: "worked", caption: "Difference threshold and Weber's law", data: { title: "Weber's law with weights", steps: [{ q: "Weber fraction for weight?", a: "About 0.02" }, { q: "JND for 100 g?", a: "0.02 x 100 = 2 g" }, { q: "JND for 500 g?", a: "0.02 x 500 = 10 g" }], yourTurn: [{ q: "Pitch has a Weber fraction of about 0.003. What is the JND for a 1,000 Hz tone?", a: "About 3 Hz." }] } },
    ],
    ref: "Atkinson and Hilgard ch 4; Galanter 1962 for threshold examples; Fechner 1860; Weber fractions from Teghtsoonian 1971",
  },
  {
    id: "pa-l01-002",
    subject: S,
    topic: "psychophysics",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on Stevens' power law.",
    plan: ["State the law", "Method of magnitude estimation", "Exponents and meaning", "Comparison with Fechner"],
    answer: `## The law
Stanley Smith Stevens proposed in the 1950s that perceived magnitude (S) is a power function of physical intensity (I): S = k I to the power n, where k is a constant and n is an exponent that differs for each kind of sensation.

## Method
Stevens used magnitude estimation: participants were given a standard stimulus and told it was worth, say, 10. They then gave numbers to other stimuli in proportion to how strong they seemed: a light that seemed twice as bright was called 20. When the results were plotted on log-log axes, they formed straight lines whose slope was the exponent.

## Exponents
- Exponent less than 1 (compressive): brightness about 0.33, loudness about 0.67. Doubling the light energy makes it seem only about a quarter brighter (2 to the power 0.33 is about 1.26).
- Exponent about 1 (linear): perceived line length.
- Exponent greater than 1 (expansive): electric shock about 3.5. Doubling the current makes the shock feel more than 11 times stronger, a protective feature for harmful stimuli.

## Comparison with Fechner
Fechner's logarithmic law assumed equal JNDs are equal steps in sensation and predicts that sensation always grows more slowly than intensity. Stevens' law fits a wider range of senses, including expansive ones, and uses direct scaling rather than counting JNDs. Critics note that magnitude estimates depend on how people use numbers.`,
    keyPoints: ["Formula", "Magnitude estimation method", "Compressive, linear and expansive exponents with examples", "Electric shock example", "Comparison with Fechner"],
    module: "sensation-perception/2-1",
    visuals: [
      { kind: "sort", caption: "Exponents", data: { prompt: "Does the sensation grow slower, equal or faster than the stimulus?", buckets: ["Slower (exponent below 1)", "About equal", "Faster (exponent above 1)"], items: [{ text: "Brightness", bucket: 0 }, { text: "Length of a line", bucket: 1 }, { text: "Electric shock", bucket: 2 }, { text: "Loudness", bucket: 0 }] } },
    ],
    ref: "Stevens 1957 and 1961; Atkinson and Hilgard ch 4. 2^0.33 = 1.257; 2^3.5 = 11.3.",
  },
  {
    id: "pa-l01-003",
    subject: S,
    topic: "psychophysics",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe the classical psychophysical methods: the method of limits, the method of constant stimuli and the method of adjustment. Discuss the errors associated with each and how they are controlled.",
    plan: ["Purpose of psychophysical methods", "Method of limits with procedure and errors", "Method of constant stimuli with procedure and psychometric function", "Method of adjustment", "Comparison table and modern adaptive methods", "Conclusion"],
    answer: `## Purpose
Fechner developed three methods to measure thresholds: the absolute threshold (the weakest detectable stimulus) and the difference threshold (the smallest detectable change). Each presents stimuli in a different way and has different errors. They are still taught in experimental psychology practicals and form the basis of clinical tests of vision and hearing.

## Method of limits
The experimenter presents stimuli in ascending or descending series in small steps.
- Ascending series: start well below threshold and increase intensity step by step until the participant first says "yes, I detect it".
- Descending series: start well above threshold and decrease until the participant first says "no".
- The transition point in each series is recorded; the threshold is the average of transition points across several ascending and descending series.
- For difference thresholds, a comparison stimulus is varied around a standard, and the participant says "greater", "equal" or "less". The interval of uncertainty gives the JND.
Errors:
- Error of habituation (perseveration): continuing to give the same response out of habit, so the threshold is reached too late in each series (too high in ascending, too low in descending).
- Error of expectation (anticipation): anticipating a change and responding too early.
- Control: alternate ascending and descending series so the two errors cancel out, and vary the starting point of each series so the participant cannot count steps.
- Advantages: quick and easy. Disadvantage: the participant knows the order of stimuli, which invites these errors.

## Method of constant stimuli
A fixed set of stimuli (usually five to nine intensities around the expected threshold) is chosen in advance, and each is presented many times (often 50 to 100) in random order.
- For the absolute threshold, the proportion of "yes" responses is calculated for each intensity, producing an S-shaped curve called the psychometric function. The threshold is the intensity detected 50 percent of the time.
- For the difference threshold, the participant compares each stimulus with a standard. The point of subjective equality (PSE) is where the comparison is judged "greater" 50 percent of the time. The JND is half the distance between the 25 and 75 percent points.
Errors and controls:
- Random order removes habituation and expectation errors.
- Time error (the second of two stimuli tends to be judged differently, often heavier) and space error (position on left or right) are controlled by counterbalancing the order and position of the standard.
- Fatigue and practice are controlled by rest breaks and practice trials.
- Advantages: most accurate and reliable; gives the whole psychometric function. Disadvantages: time-consuming and needs prior knowledge of the threshold region.

## Method of adjustment (average error)
The participant controls the stimulus directly, adjusting it until it is just detectable, or until it matches a standard. For example, in the Muller-Lyer illusion, the participant adjusts the length of one line until it looks equal to the other; the average error shows the size of the illusion.
- The threshold or PSE is the mean of many settings, and the standard deviation of the settings estimates the difference threshold.
Errors and controls:
- Movement error (the direction of adjustment affects the end point): start half the trials above and half below the standard.
- Space and time errors: counterbalance positions.
- Advantages: quick, engaging, natural for matching tasks. Disadvantages: participants may vary in carefulness; less suitable for very weak stimuli; the control device itself may give cues.

## Comparison
| Feature | Limits | Constant stimuli | Adjustment |
| Who controls the stimulus | Experimenter, in order | Experimenter, random | Participant |
| Main errors | Habituation, expectation | Time and space errors | Movement, space errors |
| Speed | Fast | Slow | Fast |
| Precision | Moderate | Highest | Moderate |
| Typical use | Hearing tests, quick estimates | Precise research | Illusion size, matching |

## Modern adaptive methods
Staircase procedures adjust the next stimulus based on the previous response: after a "yes", intensity is lowered; after a "no", it is raised. The level oscillates around threshold, combining the efficiency of the method of limits with reduced bias. Computerised adaptive procedures such as QUEST are used in vision research and audiometry. Forced-choice procedures (asking which of two intervals contained the signal) reduce the influence of response bias, a concern raised by signal detection theory.

## Conclusion
The three classical methods measure thresholds in different ways, each with characteristic errors that careful design can control. The method of constant stimuli is most accurate, the method of limits quickest, and adjustment suits matching tasks; adaptive and forced-choice methods are modern refinements.`,
    keyPoints: ["Purpose of the methods", "Method of limits with ascending and descending series", "Errors of habituation and expectation and their control", "Constant stimuli procedure and psychometric function", "PSE and JND from constant stimuli", "Method of adjustment with Muller-Lyer example", "Comparison table", "Staircase and forced-choice methods"],
    module: "sensation-perception/2-1",
    visuals: [
      { kind: "compare", data: { title: "Two errors in the method of limits", a: { label: "Habituation", points: ["Keeps giving the same answer", "Threshold too high in ascending series", "Too low in descending series"], summary: "Responding too late." }, b: { label: "Expectation", points: ["Expects a change soon", "Threshold too low in ascending series", "Too high in descending series"], summary: "Responding too early." } } },
      { kind: "illusion", caption: "Method of adjustment (average error)", data: { kind: "muller-lyer", caption: "Method of adjustment: set the lines to look equal, then measure the error." } },
    ],
    ref: "Woodworth and Schlosberg Experimental Psychology; Gescheider Psychophysics: The Fundamentals ch 3; Atkinson and Hilgard ch 4",
  },
  {
    id: "pa-l01-004",
    subject: S,
    topic: "signal-detection",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance", "md-psychiatry"],
    question: "Explain signal detection theory. Describe its outcomes, the measures of sensitivity and response bias, the ROC curve and its applications. A radiologist detects 84 percent of tumours present and gives false alarms on 16 percent of normal scans; calculate d prime and the criterion and interpret them.",
    plan: ["Why classical thresholds were inadequate", "The four outcomes and the decision matrix", "Noise and signal plus noise distributions", "Sensitivity d prime and criterion c with worked numbers", "Factors affecting each, and the ROC curve", "Applications and conclusion"],
    answer: `## Why signal detection theory?
Classical psychophysics assumed a fixed threshold: stimuli above it are detected, those below are not. But detection also depends on the observer's decisions. A sentry expecting an enemy attack reports more movements than a relaxed one, though their eyesight is the same. Signal detection theory (SDT), developed in the 1950s by Wilson Tanner, John Swets and David Green from radar engineering, separates two factors: sensitivity (how well the observer can tell signal from noise) and response bias (how willing the observer is to say "yes").

## The four outcomes
On each trial a signal is present or absent, and the observer responds "yes" or "no".
| Response | Signal present | Signal absent |
| Yes | Hit | False alarm |
| No | Miss | Correct rejection |
Hit rate = hits / signal trials; false alarm rate = false alarms / noise trials. Misses and correct rejections are their complements.

## The underlying model
- There is always background noise, internal (random neural activity) and external. On noise-only trials, the sensory evidence varies randomly, forming a normal distribution.
- On signal trials, the signal adds to the noise, shifting the distribution upwards (signal plus noise distribution).
- The two distributions overlap, so some noise trials produce more evidence than some signal trials.
- The observer sets a criterion (beta, or c): if evidence exceeds it, respond "yes".

## Sensitivity: d prime
d prime is the distance between the means of the noise and signal plus noise distributions, in standard deviation units: d prime = z(hit rate) minus z(false alarm rate). It depends on stimulus strength and the observer's sensory ability, not on their willingness to say yes. A d prime of 0 means no discrimination; values of 1 to 2 are moderate to good; above 3 is excellent.

## Response bias: criterion
The criterion c = minus [z(hit rate) + z(false alarm rate)] / 2. A value of 0 is neutral; a positive c is conservative (saying "no" more often, fewer false alarms but more misses); a negative c is liberal (saying "yes" more often, more hits but more false alarms). Beta is an alternative index: the ratio of the heights of the two distributions at the criterion.

## Worked example: the radiologist
- Hit rate = 0.84, so z = 0.99.
- False alarm rate = 0.16, so z = minus 0.99.
- d prime = 0.99 minus (minus 0.99) = 1.99, about 2.0. The radiologist discriminates tumours from normal tissue well, but not perfectly.
- c = minus (0.99 + minus 0.99) / 2 = 0. The criterion is neutral.
Suppose after a lawsuit for a missed tumour the radiologist becomes more cautious: hit rate rises to 0.90 but false alarms rise to 0.30.
- z(0.90) = 1.28, z(0.30) = minus 0.52.
- d prime = 1.28 + 0.52 = 1.81, almost unchanged: sensitivity has not improved.
- c = minus (1.28 minus 0.52) / 2 = minus 0.38, a more liberal criterion.
The increase in hits came at the cost of more false alarms (more unnecessary biopsies), not from better perception.

## Factors affecting sensitivity and bias
- Sensitivity: signal intensity, noise level, sensory acuity, training and expertise, fatigue, drugs.
- Criterion: payoffs (the costs of misses and false alarms), expectations about how often signals occur (base rate), instructions, motivation and personality. If missing a cancer is very costly, a liberal criterion is rational.

## The ROC curve
The receiver operating characteristic (ROC) curve plots hit rate against false alarm rate as the criterion changes while sensitivity stays the same. Each curve corresponds to one d prime.
- The diagonal line represents chance (d prime = 0).
- Curves bowed towards the top left corner represent higher sensitivity.
- Moving along a curve represents changes in criterion.
- The area under the curve (AUC) is a criterion-free measure of accuracy, from 0.5 (chance) to 1.0 (perfect). It is widely used to evaluate diagnostic tests and screening tools.

## Applications
- Medical diagnosis and screening: evaluating radiologists, screening questionnaires such as the PHQ-9 at different cut-off scores, and choosing cut-offs that balance sensitivity and specificity.
- Eyewitness lineups: separating ability to recognise the culprit from willingness to choose someone.
- Memory research: recognition memory, where older adults may show a more liberal or conservative bias as well as lower sensitivity.
- Vigilance tasks such as baggage screening and air traffic control: the vigilance decrement often reflects a criterion shift as well as falling sensitivity.
- Clinical psychology: hallucinations have been studied as a liberal criterion for perceiving voices in noise; in anxiety, threat detection shows a liberal bias.
- Lie detection and forensic decisions.

## Assumptions and limits
SDT assumes normal distributions of equal variance; unequal variance models exist. It needs many trials to estimate rates reliably, and rates of 0 or 1 must be corrected.

## Conclusion
Signal detection theory replaced the idea of a fixed threshold with a model in which detection depends on both sensitivity (d prime) and decision criterion (c). In the example, the radiologist's caution changed the criterion but not sensitivity, a distinction that only SDT can reveal and that is vital for evaluating any diagnostic decision.`,
    keyPoints: ["Problem with fixed thresholds", "Four outcomes table", "Noise and signal plus noise distributions", "d prime formula and meaning", "Criterion c formula and liberal or conservative", "Correct worked d prime about 2.0 and c = 0", "Second scenario showing criterion shift", "ROC curve and AUC with applications"],
    pitfalls: ["Treating more hits as better sensitivity", "Forgetting the minus sign in c"],
    module: "sensation-perception/2-2",
    visuals: [
      { kind: "curve", caption: "Response bias: criterion", data: { kind: "sdt", title: "Sensitivity and criterion", caption: "Keep d prime fixed and move the criterion: hits and false alarms rise together." } },
      { kind: "worked", caption: "Worked example: the radiologist", data: { title: "d prime and c for the radiologist", steps: [{ q: "z of hit rate 0.84 and false alarm rate 0.16?", a: "0.99 and minus 0.99" }, { q: "d prime?", a: "0.99 minus (minus 0.99) = 1.99" }, { q: "c?", a: "Minus (0.99 + minus 0.99) / 2 = 0, neutral" }], yourTurn: [{ q: "Hits 0.90, false alarms 0.30. d prime and c?", a: "1.28 + 0.52 = 1.81; c = minus 0.38, more liberal." }] } },
    ],
    ref: "Green and Swets 1966; Macmillan and Creelman Detection Theory; Atkinson and Hilgard ch 4. scipy norm.ppf: .84 0.994, .16 -0.994, .90 1.282, .30 -0.524.",
  },
  {
    id: "pa-l01-005",
    subject: S,
    topic: "signal-detection",
    marks: 5,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "md-psychiatry"],
    question: "Write a short note on the ROC curve and its use in evaluating a screening test.",
    plan: ["Define the ROC curve", "How it is plotted", "Reading the curve and AUC", "Choosing a cut-off"],
    answer: `## Meaning
The receiver operating characteristic (ROC) curve, from signal detection theory, shows the trade-off between the hit rate and the false alarm rate of a detector as its decision criterion changes, while its sensitivity stays the same. For a screening test, the hit rate is sensitivity and the false alarm rate is 1 minus specificity.

## How it is plotted
The test is given to people with and without the condition (known from a gold-standard diagnosis). For each possible cut-off score, sensitivity and 1 minus specificity are calculated and plotted as a point. Joining the points gives the curve. For the PHQ-9 depression questionnaire, a cut-off of 5 gives high sensitivity but many false positives; a cut-off of 15 gives high specificity but misses many cases.

## Reading the curve
- The diagonal from bottom left to top right represents chance performance.
- The closer the curve bows towards the top left corner, the better the test discriminates.
- The area under the curve (AUC) summarises accuracy: 0.5 is chance, 0.7 to 0.8 acceptable, 0.8 to 0.9 good, above 0.9 excellent. The AUC equals the probability that a randomly chosen person with the condition scores higher than one without.

## Choosing a cut-off
The best cut-off depends on the purpose. For screening, where missing cases is costly, a lower cut-off with high sensitivity is chosen, followed by a clinical interview. For confirming a diagnosis, high specificity matters. Youden's index (sensitivity + specificity minus 1) identifies the point that maximises both. Validation studies of screening tools in Indian languages report ROC analyses to recommend local cut-offs.`,
    keyPoints: ["Definition linked to SDT", "Sensitivity and 1 minus specificity axes", "Plotting from cut-offs", "AUC interpretation", "Choosing cut-offs and Youden's index"],
    module: "sensation-perception/2-2",
    visuals: [
      { kind: "curve", caption: "Reading the curve", data: { kind: "sdt", caption: "Each criterion is one point on the ROC curve; a larger d prime bows the curve towards the top left." } },
    ],
    ref: "Swets 1988 Science; Kroenke et al 2001 PHQ-9 validation; Youden 1950",
  },
  {
    id: "pa-l01-006",
    subject: S,
    topic: "sensation",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Describe the structure and functioning of the visual system, from the eye to the visual cortex. Include the roles of rods and cones, receptive fields and the two cortical pathways.",
    plan: ["Light and the structure of the eye", "Retina: rods and cones, duplex theory, adaptation", "Ganglion cells, receptive fields and lateral inhibition", "Pathway to the cortex", "Hubel and Wiesel and the visual cortex", "What and where pathways, clinical links and conclusion"],
    answer: `## Light and the eye
Vision begins with light, electromagnetic energy with wavelengths between about 400 nanometres (violet) and 700 nanometres (red). Light enters through the cornea, which does most of the focusing, passes through the pupil (whose size is controlled by the iris) and is focused by the lens onto the retina at the back of the eye. Accommodation is the lens changing shape to focus near or far objects. The image on the retina is inverted.

## The retina: rods and cones
The retina contains about 120 million rods and about 6 million cones.
| Feature | Rods | Cones |
| Number | About 120 million | About 6 million |
| Location | Periphery | Concentrated in the fovea |
| Light sensitivity | Very high, work in dim light | Need bright light |
| Colour | No, black and white | Yes, three types |
| Acuity | Low, many rods converge on one ganglion cell | High, especially in the fovea |
| Pigment | Rhodopsin | Three opsins |
The duplex theory holds that rods serve scotopic (night) vision and cones photopic (day) vision. Dark adaptation, the increase in sensitivity after entering darkness, has two phases: cones adapt in about 7 to 10 minutes, rods continue for about 30 minutes. The blind spot, where the optic nerve leaves the eye, has no receptors, but we do not notice it because the brain fills in the gap.

## Processing in the retina
Photoreceptors pass signals to bipolar cells and then ganglion cells, whose axons form the optic nerve. Horizontal and amacrine cells connect neighbouring cells sideways.
- Receptive field: the area of the retina in which light changes a neuron's firing. Stephen Kuffler found that ganglion cells have centre-surround receptive fields: an on-centre cell fires more when light falls on its centre and less when light falls on the surround.
- Lateral inhibition: activated cells inhibit their neighbours, enhancing contrast at edges. This explains Mach bands, illusory light and dark stripes at the border between shades, and the Hermann grid illusion.
- Convergence: many rods feed one ganglion cell (high sensitivity, low acuity); in the fovea, one cone may feed one ganglion cell (high acuity).

## The pathway to the cortex
- The optic nerves from both eyes meet at the optic chiasm, where fibres from the nasal half of each retina cross. As a result, the left visual field of both eyes is processed by the right hemisphere and vice versa.
- Most fibres go to the lateral geniculate nucleus (LGN) of the thalamus, which has six layers: magnocellular layers (motion, coarse form) and parvocellular layers (colour, fine detail).
- A smaller pathway goes to the superior colliculus, which controls eye movements and may underlie blindsight.
- From the LGN, the optic radiations reach the primary visual cortex (V1, striate cortex) in the occipital lobe.

## Hubel and Wiesel
David Hubel and Torsten Wiesel, recording from single neurons in the cat and monkey visual cortex, found cells that respond to specific features. They won the Nobel Prize in 1981.
- Simple cells respond to bars or edges of a particular orientation at a particular location.
- Complex cells respond to oriented bars anywhere within a larger field, often when moving in a particular direction.
- End-stopped (hypercomplex) cells respond to bars of a particular length or corners.
- The cortex is organised into orientation columns and ocular dominance columns.
These feature detectors suggested that perception builds up from simple features to complex forms.

## Two cortical pathways
Leslie Ungerleider and Mortimer Mishkin proposed that visual information leaves V1 along two streams:
- The ventral stream to the temporal lobe, the "what" pathway, for object recognition, colour and faces. Damage causes visual agnosia or prosopagnosia.
- The dorsal stream to the parietal lobe, the "where" pathway, for spatial location and motion. David Milner and Melvyn Goodale described it as a "how" pathway for guiding action: patient D.F., with ventral damage, could not report a slot's orientation but could post a card through it accurately.
Specialised areas include V4 for colour and V5 (MT) for motion; damage to V5 causes akinetopsia (motion blindness).

## Clinical links
Glaucoma damages ganglion cells and peripheral vision; macular degeneration destroys central cone vision; lesions along the pathway cause characteristic field defects, such as bitemporal hemianopia from pituitary tumours pressing on the chiasm.

## Conclusion
The visual system transforms light into neural signals, enhances contrast in the retina, routes information through the thalamus to the cortex, extracts features in V1 and divides processing into what and where or how streams. Perception is therefore an active, hierarchical construction from the very first stage.`,
    keyPoints: ["Structure of the eye and focusing", "Rods versus cones table", "Dark adaptation and blind spot", "Receptive fields and lateral inhibition", "Optic chiasm and LGN", "Hubel and Wiesel's simple and complex cells", "Ventral and dorsal streams with patient evidence", "Clinical links"],
    module: "sensation-perception/2-3",
    visuals: [
      { kind: "flow", caption: "The pathway to the cortex", data: { title: "The visual pathway", layout: "chain", nodes: [{ id: "r", label: "Retina", detail: "Rods and cones turn light into signals." }, { id: "o", label: "Optic nerve and chiasm", detail: "Nasal fibres cross." }, { id: "l", label: "Lateral geniculate nucleus", detail: "Thalamic relay with six layers." }, { id: "v", label: "Primary visual cortex (V1)", detail: "Edge and orientation detectors." }, { id: "s", label: "What and where streams", detail: "Temporal for objects, parietal for space and action." }] } },
      { kind: "brainmap", caption: "Two cortical pathways", data: { title: "Where vision is processed", focus: ["occipital", "temporal", "parietal", "thalamus"], notes: { occipital: "V1: features such as edges.", temporal: "Ventral stream: what is it?", parietal: "Dorsal stream: where is it and how do I reach it?", thalamus: "Lateral geniculate nucleus relay." } } },
    ],
    ref: "Atkinson and Hilgard ch 4; Bear, Connors and Paradiso ch 9 and 10; Hubel and Wiesel 1962; Ungerleider and Mishkin 1982; Goodale and Milner 1992",
  },
  {
    id: "pa-l01-007",
    subject: S,
    topic: "colour-vision",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Compare the trichromatic and opponent process theories of colour vision. How does the dual process theory reconcile them? Describe colour vision deficiencies.",
    plan: ["Physical and psychological dimensions of colour", "Young Helmholtz trichromatic theory and evidence", "Hering's opponent process theory and evidence", "Dual process synthesis with neural evidence", "Colour vision deficiencies", "Conclusion"],
    answer: `## Colour
Colour has three psychological dimensions: hue (related to wavelength), brightness (related to intensity) and saturation (purity, related to how narrow the band of wavelengths is). The colours we see are not properties of light itself but the brain's interpretation of it.

## Trichromatic theory
Thomas Young in 1802 and Hermann von Helmholtz later proposed that the eye has three types of receptors, each most sensitive to a different range of wavelengths. All colours are produced by combinations of their activity.
Evidence:
- Colour matching: any colour can be matched by mixing three primary lights in suitable proportions.
- Physiology: in the 1960s, microspectrophotometry confirmed three cone types, sensitive to short (about 420 nm, blue), medium (about 530 nm, green) and long (about 560 nm, red-yellow) wavelengths.
- Common forms of colour blindness involve loss of one cone type.
Problems: the theory cannot explain why we never see a reddish green or a bluish yellow, why yellow looks like a pure colour rather than a mixture, or negative afterimages.

## Opponent process theory
Ewald Hering in 1878 proposed three opponent channels: red versus green, blue versus yellow, and black versus white. Each channel can signal one member of the pair but not both at once.
Evidence:
- Negative afterimages: staring at a red patch and then a white wall produces a green afterimage, because the red side of the channel fatigues and the green side rebounds.
- Colour combinations: reddish green and yellowish blue are never seen.
- Hue cancellation experiments by Leo Hurvich and Dorothea Jameson.
- Physiology: Russell De Valois found opponent cells in the lateral geniculate nucleus of monkeys, excited by one wavelength range and inhibited by another.
Problems: on its own it does not explain the three cone types or colour matching.

## Dual process theory
The two theories describe different stages:
- Stage one, in the retina: three types of cones respond according to the trichromatic theory.
- Stage two, in ganglion cells, the LGN and cortex: cone signals are combined into opponent channels. The red-green channel compares long and medium cone outputs; the blue-yellow channel compares short cone output with the sum of long and medium (which signals yellow); the black-white channel sums all cones.
This explains colour mixing and colour blindness (stage one) as well as afterimages and unique hues (stage two). Colour constancy, the stability of colours under different lighting, involves further processing in the cortex, including V4, and is explained by Edwin Land's retinex theory.

## Colour vision deficiencies
- Anomalous trichromacy: all three cones present but one has an altered sensitivity; the most common is deuteranomaly (weak green).
- Dichromacy: one cone type missing. Protanopia (no long-wavelength cones) and deuteranopia (no medium-wavelength cones) produce red-green confusion. Tritanopia (no short-wavelength cones) is rare.
- Monochromacy: rod monochromats have no functional cones and see only shades of grey, with poor acuity and light sensitivity.
- Red-green deficiency is X-linked recessive, so it affects about 8 percent of men and less than 1 percent of women of European descent; rates in Indian studies of school boys are commonly reported around 3 to 8 percent.
- Testing uses the Ishihara pseudo-isochromatic plates, developed in Japan, which are widely used in India for medical and occupational screening (for example for driving licences, railways and the armed forces).
- Acquired deficits occur with eye disease, optic nerve damage and some drugs. Cerebral achromatopsia follows damage to the ventral occipitotemporal cortex (around V4).

## Conclusion
The trichromatic and opponent process theories, once rivals, are both correct at different levels of the visual system. Their integration in the dual process theory is a classic example of how psychological observations and physiological findings together explain perception.`,
    keyPoints: ["Hue, brightness and saturation", "Trichromatic theory with cone evidence", "Limits of trichromatic theory", "Opponent process with afterimages and De Valois cells", "Dual process: cones then opponent channels", "Types of colour deficiency", "X-linked inheritance and Ishihara test"],
    module: "sensation-perception/2-4",
    visuals: [
      { kind: "flow", data: { title: "Two stages of colour vision", layout: "chain", nodes: [{ id: "c", label: "Three cones", detail: "Short, medium and long wavelengths: trichromatic stage." }, { id: "o", label: "Opponent channels", detail: "Red versus green, blue versus yellow, black versus white." }, { id: "v", label: "Cortex (V4)", detail: "Colour constancy and naming." }] } },
      { kind: "reveal", caption: "Opponent process theory", data: { prompt: "Stare at a bright red square for 30 seconds, then look at a white wall. What colour do you see, and which theory explains it?", answer: "A green afterimage. The red side of the red-green opponent channel tires and the green side rebounds, as the opponent process theory predicts." } },
    ],
    ref: "Atkinson and Hilgard ch 4; Bear, Connors and Paradiso ch 9; Hurvich and Jameson 1957; De Valois et al 1966; Land 1977",
  },
  {
    id: "pa-l01-008",
    subject: S,
    topic: "audition",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Describe the structure of the ear and explain the main theories of pitch perception.",
    plan: ["Sound and its dimensions", "Outer, middle and inner ear", "Transduction by hair cells", "Place theory and Bekesy", "Frequency and volley theories", "Integration, sound localisation and hearing loss"],
    answer: `## Sound
Sound consists of pressure waves in air. Its physical properties map onto psychological ones:
| Physical | Psychological |
| Frequency (cycles per second, hertz) | Pitch |
| Amplitude (decibels) | Loudness |
| Complexity of the waveform | Timbre |
Humans hear frequencies from about 20 to 20,000 Hz, most sensitively around 1,000 to 4,000 Hz, the range of speech. Loudness is measured in decibels: a whisper is about 30 dB, conversation about 60 dB, and sounds above about 85 dB can damage hearing with prolonged exposure.

## Structure of the ear
- Outer ear: the pinna collects sound and helps locate it; the auditory canal carries it to the eardrum (tympanic membrane).
- Middle ear: three tiny bones, the ossicles (malleus, incus and stapes), transmit and amplify vibrations from the eardrum to the oval window of the cochlea. The amplification overcomes the loss of energy when sound passes from air to the fluid of the inner ear. The Eustachian tube equalises pressure.
- Inner ear: the cochlea, a fluid-filled, snail-shaped tube, contains the basilar membrane, on which sits the organ of Corti with hair cells. The semicircular canals and vestibular sacs, also in the inner ear, serve balance.

## Transduction
Vibrations of the oval window create waves in the cochlear fluid that move the basilar membrane. The hair cells' stereocilia bend against the tectorial membrane, opening ion channels and producing electrical signals that travel via the auditory nerve to the brainstem (cochlear nucleus, superior olive), the inferior colliculus, the medial geniculate nucleus of the thalamus and the primary auditory cortex in the temporal lobe, which is tonotopically organised.

## Place theory
Hermann von Helmholtz proposed that different frequencies stimulate different places along the basilar membrane. Georg von Bekesy, who won the Nobel Prize in 1961, observed a travelling wave along the basilar membrane of cadavers, peaking at different places for different frequencies: high frequencies near the base (by the oval window), low frequencies near the apex. Pitch is coded by which hair cells are most stimulated. Noise-induced hearing loss typically affects high frequencies, consistent with damage near the base. Limitation: for low frequencies below about 500 Hz, the whole membrane vibrates broadly, so place cannot code pitch precisely.

## Frequency theory
Ernest Rutherford proposed that the basilar membrane vibrates as a whole and that neurons fire at the same frequency as the sound: a 100 Hz tone produces 100 impulses per second. This explains low pitches. Limitation: neurons cannot fire faster than about 1,000 times per second, so frequency theory alone cannot explain high pitches.

## Volley principle
Ernest Wever and Charles Bray proposed that groups of neurons fire in alternation (volleys), so that together they can follow frequencies up to about 4,000 to 5,000 Hz, although each fires more slowly.

## Integration
The current view combines the theories: frequency coding (with volleys) for low frequencies, place coding for high frequencies, and both in the middle range.

## Sound localisation
The brain uses interaural time differences (sound reaches the nearer ear first) and interaural intensity differences (the head shadows the far ear, especially for high frequencies), as well as the shape of the pinna for elevation.

## Hearing loss
Conductive hearing loss results from problems in the outer or middle ear (wax, infection, otosclerosis) and can often be treated or helped by hearing aids. Sensorineural loss results from damage to hair cells or the auditory nerve (noise, ageing, ototoxic drugs) and may need cochlear implants, which stimulate the auditory nerve electrically at different places along the cochlea, an application of place theory.

## Conclusion
The ear converts air pressure waves into neural signals through a chain of mechanical and electrical events. Pitch is coded by both the place of maximum vibration on the basilar membrane and the timing of neural firing.`,
    keyPoints: ["Physical and psychological dimensions of sound", "Outer, middle and inner ear structures", "Hair cell transduction and pathway", "Place theory with Bekesy's travelling wave", "Frequency theory and its limit", "Volley principle", "Integrated view", "Localisation or hearing loss"],
    module: "sensation-perception/2-3",
    visuals: [
      { kind: "compare", caption: "Place theory", data: { title: "Two codes for pitch", a: { label: "Place theory", points: ["Where the basilar membrane vibrates most", "High pitches near the base", "Best for high frequencies"], summary: "Which hair cells fire." }, b: { label: "Frequency and volley theory", points: ["Neurons fire in time with the sound", "Volleys extend the range to about 4,000 Hz", "Best for low frequencies"], summary: "How fast they fire." } } },
    ],
    ref: "Atkinson and Hilgard ch 4; Bear, Connors and Paradiso ch 11; Bekesy 1960; Wever and Bray 1937",
  },
  {
    id: "pa-l01-009",
    subject: S,
    topic: "pain",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the gate control theory of pain. How do psychological factors influence the experience of pain? Evaluate the theory and describe its applications.",
    plan: ["Pain as a perception, not just a sensation", "Earlier specificity and pattern theories", "Gate control theory: fibres, substantia gelatinosa, descending control", "Evidence and psychological factors", "Neuromatrix theory and evaluation", "Applications including Indian context, conclusion"],
    answer: `## Pain as perception
Pain is defined by the International Association for the Study of Pain as an unpleasant sensory and emotional experience associated with, or resembling that associated with, actual or potential tissue damage. It is not a simple readout of tissue damage: soldiers with severe wounds may feel little pain, while people with chronic back pain may have no visible damage.

## Earlier theories
- Specificity theory (Rene Descartes, Max von Frey): specific pain receptors send signals along a dedicated pathway to a pain centre in the brain; pain is proportional to injury.
- Pattern theory: pain results from the pattern and intensity of stimulation of non-specific receptors.
Neither could explain why the same injury causes different pain in different situations, phantom limb pain, or pain relief from rubbing or distraction.

## Gate control theory
Ronald Melzack and Patrick Wall proposed the gate control theory in 1965. Its main ideas:
- Pain signals from the body enter the dorsal horn of the spinal cord, where a "gate", thought to involve the substantia gelatinosa, regulates whether they are transmitted to the brain via transmission (T) cells.
- Small-diameter fibres carry pain: fast myelinated A-delta fibres (sharp, localised pain) and slow unmyelinated C fibres (dull, burning, aching pain). Their activity tends to open the gate.
- Large-diameter A-beta fibres, which carry touch and pressure, tend to close the gate. This explains why rubbing a bumped elbow reduces the pain.
- Descending control: messages from the brain, reflecting attention, emotion, expectations and past experience, travel down the spinal cord and can open or close the gate. This is the central innovation: psychological factors influence pain at the level of the spinal cord.
- Factors that open the gate: anxiety, worry, depression, focusing on the pain, boredom, catastrophising, inactivity.
- Factors that close the gate: relaxation, distraction, positive emotions, confidence and control, social support, massage, mild activity, medication.

## Evidence
- Descending pain control pathways from the periaqueductal grey through the brainstem to the dorsal horn were later discovered; David Reynolds found that stimulating the periaqueductal grey in rats produced analgesia strong enough for surgery.
- Endogenous opioids (endorphins and enkephalins), discovered in the 1970s, act in this system.
- Transcutaneous electrical nerve stimulation (TENS) stimulates large fibres and reduces pain.
- Henry Beecher observed that soldiers wounded at Anzio in the Second World War requested morphine far less often than civilians with comparable surgical wounds, because for soldiers the wound meant escape from battle.
- Placebo analgesia is partly reversed by naloxone, an opioid blocker, showing that expectation activates real pain-modulating systems.

## Psychological factors in pain
- Attention and distraction: virtual reality during burn dressing changes reduces reported pain, as Hunter Hoffman showed.
- Meaning and context: pain in childbirth or religious ritual may be experienced differently from pain signalling illness.
- Emotion: anxiety and depression increase pain; chronic pain and depression often coexist.
- Cognition: catastrophising (magnifying, ruminating and feeling helpless about pain) predicts higher pain and disability. Self-efficacy predicts better coping.
- Learning: operant factors, as described by Wilbert Fordyce, where pain behaviours are reinforced by attention or avoidance of duties; fear-avoidance, in which fear of pain leads to avoidance of movement, deconditioning and more pain.
- Culture: cultural norms affect pain expression and help-seeking. Studies in India have described the role of stoicism, religious meaning and family support in pain coping.
- Social support and empathy.

## Evaluation
Strengths:
- First theory to integrate physiological and psychological factors.
- Explains variability of pain, rubbing, distraction and placebo effects.
- Transformed pain research and treatment.
Limitations:
- The precise anatomy of the gate in the substantia gelatinosa has not been fully confirmed; the mechanism is more complex than originally drawn.
- It does not fully explain chronic pain without injury or phantom limb pain, where the source is not peripheral.
Melzack therefore proposed the neuromatrix theory in 1999: pain is produced by a widely distributed brain network (the body-self neuromatrix), shaped by genes and experience, that generates a "neurosignature" of pain even without sensory input. This explains phantom limb pain and central sensitisation.

## Applications
- Physical methods: TENS, massage, acupuncture (possibly through large fibre stimulation and endorphins), heat and cold.
- Psychological methods: CBT for chronic pain (challenging catastrophising, pacing, graded activity), acceptance and commitment therapy, relaxation, biofeedback, hypnosis, mindfulness-based stress reduction.
- Multidisciplinary pain clinics combine medical, physical and psychological care, consistent with the biopsychosocial model.
- Patient education: explaining pain neuroscience reduces fear.
- The ICD-11 category of chronic primary pain recognises chronic pain as a condition in its own right.

## Conclusion
The gate control theory showed that pain is not a direct measure of injury but is modulated in the spinal cord by competing inputs and by descending signals from the brain reflecting thoughts and feelings. Although its anatomy has been revised and extended by the neuromatrix theory, it laid the foundation for the biopsychosocial treatment of pain.`,
    keyPoints: ["IASP definition", "Limits of specificity theory", "Gate in the dorsal horn with small and large fibres", "Descending control from the brain", "Factors that open and close the gate", "Evidence: PAG, endorphins, TENS, Beecher, placebo", "Neuromatrix theory and evaluation", "Psychological treatments"],
    pitfalls: ["Saying pain is all in the mind", "Omitting descending control"],
    module: "sensation-perception/2-3",
    visuals: [
      { kind: "flow", caption: "Gate control theory", data: { title: "The pain gate", layout: "tree", nodes: [{ id: "g", label: "Gate in the spinal cord" }, { id: "o", label: "Opens the gate", parent: "g", detail: "Small pain fibres, anxiety, focusing on pain, catastrophising, inactivity." }, { id: "c", label: "Closes the gate", parent: "g", detail: "Rubbing (large fibres), distraction, relaxation, confidence, endorphins." }, { id: "b", label: "Brain", parent: "g", detail: "Sends descending messages that open or close the gate." }] } },
      { kind: "nervoussystem", caption: "Earlier theories", data: { title: "Signals from the body to the brain", start: "signal", caption: "Where could thoughts and feelings change it on the way?" } },
    ],
    ref: "Melzack and Wall 1965 Science; Melzack 1999 neuromatrix; Beecher 1946 and 1956; Reynolds 1969; Fordyce 1976; Vlaeyen and Linton 2000 fear-avoidance; IASP 2020 definition; Hoffman et al 2000",
  },
  {
    id: "pa-l01-010",
    subject: S,
    topic: "sensation",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on sensory adaptation.",
    plan: ["Define sensory adaptation", "Examples across senses", "Mechanisms", "Function"],
    answer: `## Meaning
Sensory adaptation is the decrease in sensitivity of a sensory system to a stimulus that is constant or unchanging. After a while we stop noticing it, though it is still present. It is a change at the level of the receptors or early neurons, different from habituation, which is a learned decrease in response that involves the brain.

## Examples
- Smell: the smell of incense in a temple or of one's own home becomes unnoticeable within minutes.
- Touch: we stop feeling a watch on the wrist or clothes on the skin.
- Temperature: cool water in a swimming pool feels warm after a few minutes. In Weber's classic demonstration, if one hand is placed in cold water and the other in hot water, then both are placed in lukewarm water, it feels warm to the first hand and cool to the second.
- Vision: light adaptation (going out into bright sunlight) and dark adaptation (entering a cinema hall). Stabilised retinal images, which move with the eye, fade within seconds, showing that vision needs constant small eye movements.
- Taste: the first bite of a sweet dish tastes sweeter than later bites.

## Mechanisms
Receptors fire less with continued stimulation, through depletion of photopigments in vision or reduced firing rates in touch receptors. Higher neural centres also adapt, producing aftereffects such as the motion aftereffect (waterfall illusion).

## Function
Adaptation frees the nervous system to detect changes, which usually carry the most important information, rather than wasting resources on constant, unimportant stimuli.`,
    keyPoints: ["Definition", "Distinction from habituation", "At least three examples across senses", "Mechanism", "Adaptive function"],
    module: "sensation-perception/2-3",
    visuals: [
      { kind: "reveal", caption: "Examples", data: { prompt: "Why does a stabilised image on the retina fade within seconds?", answer: "Because receptors adapt to unchanging input. Normally tiny, constant eye movements keep the image shifting, so the receptors never fully adapt." } },
    ],
    ref: "Atkinson and Hilgard ch 4; Pritchard 1961 stabilised images",
  },
];
