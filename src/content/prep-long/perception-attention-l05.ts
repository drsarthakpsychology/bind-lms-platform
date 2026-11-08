import type { LongQA } from "@/lib/prep/long-types";

const S = "perception-attention" as const;

export const PERCEPTION_ATTENTION_L05: LongQA[] = [
  {
    id: "pa-l05-041",
    subject: S,
    topic: "sensation",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Describe the chemical senses: smell (olfaction) and taste (gustation). How do they interact to produce flavour, and what is their clinical significance?",
    plan: ["Chemical senses and their function", "Olfaction: receptors, pathway, coding", "Gustation: taste qualities, receptors, pathway", "Flavour as multisensory", "Individual differences, culture and clinical significance"],
    answer: `## The chemical senses
Smell and taste detect chemicals. They warn us about spoiled food, smoke and gas leaks, guide food choice, and influence emotion, memory and social behaviour. They are evolutionarily ancient senses.

## Olfaction
- Odour molecules dissolve in the mucus of the olfactory epithelium high in the nasal cavity, where about 10 million olfactory receptor neurons are found.
- Humans have about 350 to 400 types of functional olfactory receptor, a discovery by Linda Buck and Richard Axel that earned the Nobel Prize in 2004. Each neuron expresses one receptor type, and each odour activates a particular combination of receptors (combinatorial coding), allowing us to discriminate a very large number of odours.
- Receptor neurons send axons through the cribriform plate to the olfactory bulb, where neurons with the same receptor converge on glomeruli.
- From the bulb, signals go directly to the piriform (primary olfactory) cortex, the amygdala and the entorhinal cortex, without first relaying in the thalamus, unlike other senses. A second route goes through the thalamus to the orbitofrontal cortex, where smell is consciously identified and combined with taste.
- The direct links to the amygdala and hippocampus explain why smells evoke strong emotions and vivid autobiographical memories (the Proust phenomenon).
- Olfactory receptor neurons are replaced every few weeks, among the few neurons regenerated throughout life.
- Retronasal smell, odours reaching the nose from the mouth while eating, provides most of what we call taste.

## Gustation
- Five basic taste qualities are widely recognised: sweet, sour, salty, bitter and umami (savoury, as in glutamate). Fat and other qualities have been proposed.
- Taste receptor cells lie in taste buds on papillae of the tongue, palate and throat. Each taste bud has about 50 to 100 receptor cells, renewed every week or two.
- The idea of a "tongue map", with sweet at the tip and bitter at the back, is a myth: all qualities can be detected across the tongue.
- Sweet, bitter and umami use G-protein coupled receptors; salty and sour use ion channels.
- Signals travel through cranial nerves VII, IX and X to the nucleus of the solitary tract in the brainstem, then the thalamus, and the gustatory cortex in the insula and frontal operculum, and on to the orbitofrontal cortex.
- Functions: sweet signals energy, salty signals minerals, umami signals protein, bitter warns of poisons, sour of spoilage.

## Flavour
Flavour combines taste, retronasal smell, texture, temperature and the burning sensation of chilli (capsaicin activates pain receptors, not taste receptors). Holding the nose makes an apple and a potato hard to tell apart. Vision and sound also contribute: coloured drinks change perceived flavour, and the sound of crunching affects freshness ratings. Charles Spence calls this the multisensory nature of flavour.

## Individual and cultural differences
- Supertasters, about a quarter of people, have more taste buds and find bitter compounds such as PROP very intense, studied by Linda Bartoshuk.
- Food preferences are strongly learned and cultural; Indian cuisine's use of spices and bitter vegetables (karela) reflects learned acceptance. Repeated exposure increases liking.
- Conditioned taste aversion, studied by John Garcia, shows rapid learning after illness from food.

## Clinical significance
- Anosmia (loss of smell) can follow head injury, viral infections (notably COVID-19, in which sudden smell loss was a common early symptom), and nasal disease.
- Loss of smell is an early sign of Parkinson's and Alzheimer's diseases, often years before motor or memory symptoms.
- Olfactory hallucinations occur in temporal lobe epilepsy (aura) and sometimes in psychosis or depression.
- Taste changes occur with chemotherapy, zinc deficiency and drugs such as lithium or metronidazole.
- Loss of smell and taste reduces quality of life, appetite and safety (failure to detect gas or smoke).

## Conclusion
Smell and taste detect chemicals through specialised receptors and pathways. Smell's direct links to emotional and memory structures give it special emotional power, and flavour emerges from the integration of taste, smell and other senses.`,
    keyPoints: ["Function of chemical senses", "Olfactory receptors and combinatorial coding", "Direct pathway bypassing thalamus and links to amygdala", "Five taste qualities and receptors", "Tongue map myth", "Flavour as multisensory", "Supertasters and cultural learning", "Clinical significance including Parkinson's and COVID-19"],
    module: "sensation-perception/2-3",
    visuals: [
      { kind: "brainmap", caption: "Olfaction", data: { title: "Where smell and taste go", focus: ["amygdala", "hippocampus", "thalamus", "prefrontal"], notes: { amygdala: "Direct olfactory input: emotional power of smells.", hippocampus: "Smell-evoked memories.", thalamus: "Taste relay; smell partly bypasses it.", prefrontal: "Orbitofrontal cortex combines taste and smell into flavour." } } },
    ],
    ref: "Buck and Axel 1991; Bear, Connors and Paradiso ch 8; Bartoshuk 1993; Spence 2015 Flavour; Doty 2012 olfaction in neurodegeneration",
  },
  {
    id: "pa-l05-042",
    subject: S,
    topic: "sensation",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on the somatosensory system.",
    plan: ["Components of the somatic senses", "Receptors and pathways", "Somatosensory cortex and homunculus", "Plasticity and phantom limbs"],
    answer: `## Components
The somatosensory system includes touch (pressure, vibration, texture), temperature, pain (nociception), proprioception (the position of limbs) and kinaesthesis (movement), and interoception (internal bodily states).

## Receptors and pathways
- Mechanoreceptors in the skin include Meissner's corpuscles (light touch, in fingertips), Merkel discs (pressure and texture), Pacinian corpuscles (vibration) and Ruffini endings (skin stretch).
- Thermoreceptors detect warmth and cold; free nerve endings detect pain.
- Muscle spindles and Golgi tendon organs signal proprioception.
- Touch and proprioception travel up the spinal cord in the dorsal columns, crossing in the medulla; pain and temperature cross in the spinal cord and travel in the spinothalamic tract. Both reach the thalamus and then the primary somatosensory cortex.

## Somatosensory cortex and the homunculus
The primary somatosensory cortex lies in the postcentral gyrus of the parietal lobe. Wilder Penfield, stimulating the cortex of patients during epilepsy surgery, mapped a somatotopic map, the sensory homunculus, in which each body region is represented in order. The lips, face and fingers have very large areas because they are densely innervated and highly sensitive, while the back and legs have small areas. Two-point discrimination thresholds are smallest on the fingertips and lips.

## Plasticity and phantom limbs
The map changes with experience: violinists have enlarged representation of the left fingers. After amputation, neighbouring areas take over the unused cortex; V. S. Ramachandran found that touching the face of an amputee could produce sensations in the missing hand. Phantom limb pain is common, and mirror box therapy, which creates the visual illusion of moving the missing limb, can reduce it.`,
    keyPoints: ["Components including proprioception", "Main receptor types", "Two ascending pathways", "Penfield's homunculus", "Plasticity and phantom limbs with Ramachandran"],
    module: "sensation-perception/2-3",
    visuals: [
      { kind: "brainmap", caption: "Somatosensory cortex and the homunculus", data: { title: "The body map in the brain", focus: ["sensory", "motor", "parietal"], notes: { sensory: "Postcentral gyrus: the sensory homunculus, with big lips and hands.", motor: "The motor strip just in front controls movement.", parietal: "Integrates touch with vision and space." } } },
    ],
    ref: "Penfield and Rasmussen 1950; Ramachandran and Hirstein 1998; Elbert et al 1995; Bear, Connors and Paradiso ch 12",
  },
  {
    id: "pa-l05-043",
    subject: S,
    topic: "perception-motivation-culture",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the influence of motivation, needs, values and emotion on perception, with reference to the New Look movement, perceptual defence and modern research.",
    plan: ["The New Look movement", "Need and value studies: Bruner and Goodman", "Perceptual defence and its critics", "Modern research: wishful seeing, emotion, threat", "Methodological debate and Firestone and Scholl", "Clinical implications and conclusion"],
    answer: `## The New Look movement
In the late 1940s, Jerome Bruner, Leo Postman and colleagues launched the "New Look" in perception, arguing that perception is not a neutral recording of the world but is shaped by the perceiver's needs, values, expectations and emotions. Perception was seen as active and functional, serving the person's goals. This contrasted with the "old look", which studied perception as purely sensory and structural.

## Needs and values
- Bruner and Cecile Goodman in 1947 asked 10-year-old children to adjust a circle of light to match the size of coins. All children overestimated coin sizes compared with neutral cardboard discs, and the overestimation increased with the value of the coin. Children from poor families overestimated more than children from rich families. Bruner and Goodman concluded that value and need accentuate perceived size.
- Later replications produced mixed results; when children held the coins, the effect was smaller, and some studies found the reverse.
- Postman, Bruner and McGinnies found that words related to participants' strong values (measured with the Allport Vernon study of values) were recognised at shorter exposure times than words related to their weaker values.
- Studies with hungry participants found that ambiguous pictures were more often seen as food-related as hunger increased, up to a point, as David McClelland and John Atkinson showed.

## Perceptual defence
- Elliott McGinnies in 1949 presented words very briefly, increasing exposure until they were recognised. Emotionally threatening or taboo words required longer exposure times to be recognised than neutral words, and produced higher galvanic skin responses before recognition. He proposed perceptual defence: the mind protects itself from threatening stimuli by raising their recognition threshold, implying unconscious evaluation of meaning.
- Criticisms: participants may have recognised the taboo words but hesitated to say them aloud to the experimenter (response suppression); taboo words were less frequent in written language, and word frequency strongly affects recognition time; demand characteristics. When frequency was controlled and responses were made privately, the effect weakened.
- Perceptual vigilance, faster detection of threatening stimuli, was also found, raising the question of why threat is sometimes slowed and sometimes speeded.

## Modern research
- Threat detection: angry faces are detected faster in crowds (the anger superiority effect, though its robustness is debated), and fear-relevant stimuli such as snakes and spiders are found faster, as Arne Ohman showed.
- Emotion and early vision: Elizabeth Phelps found that a fearful face cue enhanced contrast sensitivity.
- Motivated and "wishful" seeing: Emily Balcetis and David Dunning found that thirsty participants perceived a bottle of water as closer than less thirsty participants, and that participants more often reported seeing a letter or number on an ambiguous figure when it would assign them to a desirable task.
- Embodied perception: Dennis Proffitt reported that hills look steeper to people who are tired, carrying heavy backpacks or less fit, and distances look farther when effort is needed.
- Anxiety and depression bias attention and interpretation of ambiguous stimuli towards threat and negative meanings.

## The methodological debate
Chaz Firestone and Brian Scholl argued in 2016 that most claimed top-down effects on perception reflect changes in judgement, memory, attention or response, or demand characteristics, rather than changes in what is actually seen. For example, the backpack effect on hill steepness disappeared when participants were given a plausible reason for wearing the backpack. Defenders argue that predictive processing models make some top-down influence inevitable. The debate centres on where perception ends and cognition begins.

## Clinical implications
- In anxiety disorders, threat-related stimuli capture attention and ambiguous situations are interpreted as dangerous, maintaining anxiety.
- In depression, negative interpretations and memory biases colour perception of social cues.
- In eating disorders, body image disturbance may involve perceptual and attitudinal components.
- In addiction, drug cues capture attention and are perceived as more salient.
- CBT, cognitive bias modification and mindfulness target these biases.

## Conclusion
The New Look movement showed that perception is influenced by motivation, value and emotion, though many classic findings were confounded by response bias and word frequency. Modern research confirms that emotion and motivation affect attention, interpretation and judgement, while the extent to which they change perception itself remains debated.`,
    keyPoints: ["New Look and its claim", "Bruner and Goodman coin study with poor children", "Values and word recognition", "McGinnies's perceptual defence", "Criticisms: response suppression and word frequency", "Modern findings: threat detection, Balcetis and Dunning, Proffitt", "Firestone and Scholl critique", "Clinical implications"],
    module: "sensation-perception/3-2",
    visuals: [
      { kind: "compare", data: { title: "Perceptual defence: two explanations", a: { label: "Defence", points: ["Threatening words recognised later", "Skin responses rise before recognition", "Mind protects itself unconsciously"], summary: "A real perceptual filter." }, b: { label: "Response bias", points: ["People hesitate to say taboo words aloud", "Taboo words are rarer in print", "Effect shrinks with controls"], summary: "Reporting, not seeing, changes." } } },
    ],
    ref: "Bruner and Goodman 1947; Postman, Bruner and McGinnies 1948; McGinnies 1949; Ohman, Flykt and Esteves 2001; Phelps, Ling and Carrasco 2006; Balcetis and Dunning 2006 and 2010; Proffitt 2006; Firestone and Scholl 2016 BBS",
  },
  {
    id: "pa-l05-044",
    subject: S,
    topic: "psychophysics",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "A participant can just tell the difference between a 200 gram weight and a 204 gram weight. (a) What is the Weber fraction? (b) What would the JND be for a 1,000 gram weight? (c) If a light's Weber fraction is 0.08 and a room is lit at 50 units, how much must the intensity rise to be noticed? Discuss the assumptions and limits of Weber's law.",
    plan: ["State Weber's law", "Calculate the Weber fraction", "Apply it to new weights and light", "Discuss the range where the law holds", "Applications and limits"],
    answer: `## Weber's law
Weber's law states that the just noticeable difference (JND) is a constant proportion of the original stimulus intensity: JND / I = k, so JND = k x I. The constant k is the Weber fraction.

## Calculations
(a) The JND for 200 grams is 204 minus 200 = 4 grams. Weber fraction k = 4 / 200 = 0.02, or 2 percent.
(b) For 1,000 grams, JND = 0.02 x 1,000 = 20 grams. A weight of 1,020 grams would just feel heavier; 1,010 grams would not.
(c) For light with k = 0.08 at 50 units, JND = 0.08 x 50 = 4 units. The intensity must rise to about 54 units to be noticed. In a much brighter room lit at 500 units, the increase needed would be 40 units.

## Interpreting k
| Sense or dimension | Typical Weber fraction (approximate) | Meaning |
| Pitch of a tone | 0.003 | Very sensitive |
| Weight | 0.02 | Sensitive |
| Loudness | 0.05 to 0.10 | Moderate |
| Brightness | 0.08 | Moderate |
| Taste of salt | 0.08 to 0.20 | Less sensitive |
A smaller fraction means that a smaller relative change can be detected. Values vary across studies and conditions.

## Assumptions
- The JND is measured at the 50 percent detection point, typically with the method of constant stimuli.
- k is constant across the range of intensities for a given dimension.
- The participant's criterion and attention remain stable.

## Limits
- Weber's law holds well in the middle range of intensities but fails at very low intensities, near the absolute threshold, where the fraction increases because of internal neural noise. A modified form, JND = k (I + a), where a is a small constant for background noise, fits better.
- It may also fail at very high intensities.
- k differs between individuals and with training: experts such as tea tasters, perfumers and musicians have smaller fractions in their domain.
- Signal detection theory shows that measured JNDs depend partly on response criteria, not only on sensitivity.

## Applications
- Marketing: a price increase or a reduction in pack size of less than the JND may go unnoticed, which companies exploit in "shrinkflation"; conversely, a discount must exceed the JND to be noticed.
- Design: the brightness steps in a display or the volume steps on a phone are set in proportional, not equal, increments.
- Clinical: changes in a patient's symptoms below the JND of a rating scale may not be noticed by clinicians.
- Fechner built on Weber's law to derive his logarithmic law of sensation.

## Conclusion
In this example the Weber fraction for weight is 0.02, so the JND grows to 20 grams at 1,000 grams; for light at 50 units the JND is 4 units. Weber's law is a useful approximation of how sensitivity scales with intensity, valid mainly in the middle range.`,
    keyPoints: ["Weber's law formula", "k = 0.02 calculated", "JND of 20 g for 1,000 g", "JND of 4 units for light", "Table interpreting fractions", "Limits at low intensities and modified form", "Applications"],
    module: "sensation-perception/2-1",
    visuals: [
      { kind: "worked", data: { title: "Weber's law in three steps", steps: [{ q: "Weber fraction from 200 g and 204 g?", a: "4 / 200 = 0.02" }, { q: "JND at 1,000 g?", a: "0.02 x 1,000 = 20 g" }, { q: "JND for light at 50 units with k = 0.08?", a: "0.08 x 50 = 4 units" }], yourTurn: [{ q: "A shop raises a price from 400 to 410 rupees. If the Weber fraction for price is 0.05, will most customers notice?", a: "JND = 0.05 x 400 = 20 rupees, so a 10 rupee rise may go unnoticed." }] } },
    ],
    ref: "Atkinson and Hilgard ch 4; Gescheider ch 1; Weber fractions approximate from Teghtsoonian 1971",
  },
  {
    id: "pa-l05-045",
    subject: S,
    topic: "signal-detection",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net", "md-psychiatry"],
    question: "Two airport security screeners are tested on 200 bags, 100 containing a dangerous item. Screener A has a hit rate of 0.60 and a false alarm rate of 0.05. Screener B has a hit rate of 0.95 and a false alarm rate of 0.50. Using signal detection theory, compare their sensitivity and bias, and advise the airport.",
    plan: ["Set out the SDT framework", "Calculate d prime and c for each screener", "Interpret sensitivity and bias", "Consider costs and the prevalence effect", "Give practical advice"],
    answer: `## Framework
Signal detection theory separates sensitivity (d prime, the ability to tell dangerous from harmless bags) from response bias (criterion c, the tendency to say "dangerous"). Hit rate and false alarm rate alone can mislead: a screener can catch more threats simply by calling more bags dangerous.

## Calculations
Screener A: hit rate 0.60, false alarm rate 0.05.
- z(0.60) = 0.25; z(0.05) = minus 1.64.
- d prime = 0.25 minus (minus 1.64) = 1.90.
- c = minus (0.25 + minus 1.64) / 2 = 0.70, a conservative criterion.
Screener B: hit rate 0.95, false alarm rate 0.50.
- z(0.95) = 1.64; z(0.50) = 0.
- d prime = 1.64 minus 0 = 1.64.
- c = minus (1.64 + 0) / 2 = minus 0.82, a liberal criterion.

## Interpretation
| Measure | Screener A | Screener B |
| Hits (out of 100 threats) | 60 | 95 |
| Misses | 40 | 5 |
| False alarms (out of 100 safe bags) | 5 | 50 |
| d prime | 1.90 | 1.64 |
| Criterion c | 0.70 (conservative) | minus 0.82 (liberal) |
- Screener A is slightly more sensitive: better at telling threats from harmless items.
- Screener B catches many more threats, but only because of a very liberal criterion: half of all harmless bags are flagged, slowing the queue and costing staff time.
- A misses 40 percent of threats, which is unacceptable for security even though few passengers are inconvenienced.

## Costs and prevalence
- In security, a miss (a weapon getting through) is far more costly than a false alarm (a bag checked by hand). A liberal criterion is therefore appropriate, but excessive false alarms cause fatigue, delays and eventually a loss of trust in alarms.
- In real airports, threats are extremely rare. Jeremy Wolfe and colleagues showed the prevalence effect: when targets are rare, screeners shift to a more conservative criterion and miss more, even when sensitivity is unchanged. Screener A's conservative bias might worsen in real conditions.
- Vigilance decrement: over long shifts, criteria shift and sensitivity may fall.

## Advice
- Improve sensitivity through training with feedback, better imaging technology, and computer-aided detection that highlights suspicious regions. Training is the only way to improve both hits and false alarms together.
- Set the criterion deliberately: encourage A to adopt a more liberal criterion, for example by emphasising the cost of misses and occasionally inserting fictional threat images (threat image projection) with feedback, which keeps perceived prevalence higher.
- Help B to reduce false alarms without losing many hits, through training on common harmless items that cause alarms.
- Rotate tasks and give breaks to maintain vigilance.
- Evaluate screeners with d prime and c, or with the area under the ROC curve, rather than with hit rates alone.

## Conclusion
Screener A is somewhat more sensitive but too conservative; Screener B catches more threats only because of a highly liberal criterion. The airport should improve sensitivity through training and technology, and manage criteria through clear cost information and threat image projection.`,
    keyPoints: ["Explains why hit rate alone misleads", "Correct d prime 1.90 and 1.64", "Correct c 0.70 and minus 0.82", "Interpretation of sensitivity versus bias", "Costs of misses and false alarms", "Prevalence effect", "Practical recommendations including training and threat image projection"],
    module: "sensation-perception/2-2",
    visuals: [
      { kind: "worked", caption: "Calculations", data: { title: "Comparing two screeners", steps: [{ q: "Screener A d prime and c?", a: "0.25 + 1.64 = 1.90; c = 0.70" }, { q: "Screener B d prime and c?", a: "1.64 minus 0 = 1.64; c = minus 0.82" }, { q: "Who is more sensitive?", a: "A, slightly. B only says 'dangerous' far more often." }] } },
      { kind: "curve", caption: "Advice", data: { kind: "sdt", caption: "Set d prime near 1.8, then slide the criterion from A's position to B's." } },
    ],
    ref: "Green and Swets 1966; Wolfe, Horowitz and Kenner 2005 Nature; scipy norm.ppf: .60 0.253, .05 -1.645, .95 1.645.",
  },
  {
    id: "pa-l05-046",
    subject: S,
    topic: "perceptual-development",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Is perception innate or learned? Discuss the nature-nurture debate in perception with evidence from infant studies, deprivation and readjustment studies, and cross-cultural research.",
    plan: ["The nativist and empiricist positions", "Infant studies: preferential looking, habituation, visual cliff, faces", "Animal deprivation and readjustment studies", "Human cases of restored sight", "Cross-cultural evidence", "Interactionist conclusion"],
    answer: `## The debate
Nativists, such as the Gestalt psychologists and Immanuel Kant before them, held that we are born with the basic capacities to perceive form, depth and objects. Empiricists, such as John Locke and Hermann von Helmholtz, held that perception is learned through experience, with the newborn's world being, in William James's phrase, "one great blooming, buzzing confusion". Modern research shows both positions are partly right.

## Infant studies
Infants cannot report what they see, so researchers use indirect methods.
- Preferential looking: Robert Fantz found in the 1960s that newborns looked longer at patterned stimuli than plain ones, and at face-like patterns more than scrambled ones, suggesting an early preference for complex and social stimuli. Mark Johnson and John Morton found newborns tracked a face-like pattern further than scrambled versions.
- Habituation and dishabituation: infants look less at a repeated stimulus and more at a new one, showing they can tell them apart. This revealed colour categories, shape constancy and size constancy in newborns. Alan Slater found that newborns recognised the same object at different distances, showing some size constancy at birth.
- Visual acuity: newborn acuity is poor, about 20/400 to 20/600, reaching near adult levels by about 6 to 12 months as the fovea and cortex mature.
- Depth: Eleanor Gibson and Richard Walk's visual cliff found that most crawling infants avoided the deep side; Joseph Campos found that younger infants showed interest rather than fear, and that fear developed with crawling experience. Sensitivity to binocular disparity appears around 4 months; to pictorial cues around 6 to 7 months.
- Perceptual narrowing: infants discriminate speech sounds of all languages and faces of other species, but lose non-native distinctions by about 10 to 12 months, showing that experience tunes initial broad abilities.
- Intermodal perception: newborns imitate facial expressions (a disputed finding by Andrew Meltzoff) and infants link sounds and sights by a few months.

## Animal deprivation studies
- Austin Riesen reared chimpanzees in darkness; they later showed retinal damage and poor visual behaviour, suggesting light is needed for the visual system to develop.
- David Hubel and Torsten Wiesel sewed one eye of kittens shut during the first months; the eye later remained functionally blind, because cortical neurons came to respond only to the open eye. This critical period effect, not found in adult cats, earned them a Nobel Prize.
- Colin Blakemore and Grahame Cooper reared kittens in cylinders with only vertical or only horizontal stripes; the kittens later responded poorly to lines of the other orientation, and their cortical cells were mainly tuned to the experienced orientation.
- Richard Held and Alan Hein's kitten carousel: kittens that moved themselves developed normal visually guided behaviour, while those passively carried did not, showing the need for active experience.

## Readjustment studies
George Stratton wore lenses that turned the visual world upside down and left to right. After several days he adapted and could move around normally, and the world eventually seemed nearly normal; on removing the lenses, he briefly experienced the world as inverted. Ivo Kohler had participants wear inverting goggles for weeks with similar results. Perception can be recalibrated by experience, though adaptation involves mainly perceptual-motor coordination.

## Restored sight in humans
- Richard Gregory's patient S.B., blind since infancy, had corneal grafts at 52. He could recognise objects he had known by touch and read clock faces he had felt, but struggled with depth, faces and unfamiliar objects, and became depressed.
- Project Prakash in India, led by Pawan Sinha, has treated hundreds of children and young adults with congenital cataracts. Some visual abilities developed surprisingly quickly after surgery even in late childhood, such as linking touch and sight within days to months and improving face detection, while acuity often remained limited. This suggests the brain retains plasticity beyond early critical periods.
- Children treated late for strabismus or amblyopia often have lasting deficits in stereopsis, supporting sensitive periods.

## Cross-cultural research
Differences in susceptibility to illusions (the carpentered world hypothesis), in reading pictorial depth (William Hudson) and in holistic versus analytic attention show that experience in different environments shapes how perceptual information is interpreted, although basic sensory abilities are universal.

## Conclusion
Infants are born with substantial perceptual abilities, such as preferences for faces and patterns and some constancy, which supports nativism. But deprivation, readjustment, restored sight and cultural studies show that experience is needed to develop, tune and maintain these abilities, often within sensitive periods. Perception is best seen as the result of interaction between innate predispositions and experience.`,
    keyPoints: ["Nativist and empiricist positions", "Fantz preferential looking", "Habituation method and newborn constancy", "Visual cliff with Campos qualification", "Perceptual narrowing", "Hubel and Wiesel, Blakemore and Cooper, Held and Hein", "Stratton's inverting lenses and restored sight cases including Project Prakash", "Interactionist conclusion"],
    module: "sensation-perception/3-2",
    visuals: [
      { kind: "compare", caption: "Infant studies", data: { title: "Two sides of the perception debate", a: { label: "Evidence for nature", points: ["Newborns prefer faces and patterns", "Some size constancy at birth", "Most crawling infants avoid the visual cliff"], summary: "Born ready to see." }, b: { label: "Evidence for nurture", points: ["Kittens reared with vertical stripes lose horizontal detectors", "Passive kittens fail to guide movement", "Perceptual narrowing by 12 months"], summary: "Shaped by experience." } } },
      { kind: "timeline", caption: "Restored sight in humans", data: { prompt: "Order these milestones of infant vision.", events: [{ label: "Prefers face-like patterns", when: "Birth" }, { label: "Sensitive to binocular disparity", when: "About 4 months" }, { label: "Uses pictorial depth cues", when: "About 6 to 7 months" }, { label: "Avoids the deep side of the visual cliff", when: "After crawling, 7 to 9 months" }, { label: "Acuity near adult level", when: "About 6 to 12 months" }] } },
    ],
    ref: "Fantz 1961 and 1963; Johnson and Morton 1991; Slater et al 1990; Gibson and Walk 1960; Campos et al 1970; Hubel and Wiesel 1970; Blakemore and Cooper 1970 Nature; Held and Hein 1963; Stratton 1897; Gregory and Wallace 1963; Sinha 2013; Atkinson and Hilgard ch 5",
  },
  {
    id: "pa-l05-047",
    subject: S,
    topic: "illusions",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on the moon illusion.",
    plan: ["Describe the illusion", "Explanations: apparent distance, angle of regard, relative size", "Evidence and status"],
    answer: `## The illusion
The moon appears much larger when it is near the horizon than when it is high in the sky, often by about 50 percent, although its retinal image is the same size (about half a degree) in both positions. Photographs show no difference. The effect has puzzled observers since ancient times; Ptolemy discussed it.

## Explanations
- Apparent distance theory: the sky is perceived as a flattened dome, so the horizon seems farther away than the zenith. Because the moon's retinal size is constant, a moon that seems farther away is perceived as larger (size-distance invariance, as in Emmert's law). The terrain between the viewer and the horizon, full of depth cues such as trees and buildings, increases the sense of distance. Lloyd Kaufman and Irvin Rock found that the illusion was reduced when the terrain was hidden, as when viewing the horizon moon through a hole in a sheet of cardboard.
- Size contrast: the horizon moon is compared with familiar objects such as buildings and trees, making it seem large; the moon high in the sky is surrounded only by vast empty space, making it seem small, similar to the Ebbinghaus illusion.
- Angle of regard: looking upward may make objects appear smaller, though evidence for this is weak.

## Paradox
Many people judge the larger-looking horizon moon to be nearer, not farther, which seems to contradict the apparent distance theory. One explanation is that the brain first perceives the moon as large (because of the distance cues) and then judges it to be close because it looks large.

## Status
No single explanation is accepted by all researchers; the illusion probably reflects several factors, chiefly perceived distance and size contrast with the surroundings.`,
    keyPoints: ["Description with constant retinal size", "Apparent distance theory with Kaufman and Rock", "Size contrast explanation", "Angle of regard", "Size-distance paradox", "Multiple factors"],
    module: "sensation-perception/2-8",
    visuals: [
      { kind: "illusion", caption: "Explanations", data: { kind: "ebbinghaus", caption: "The same circle looks larger among small circles, much as the moon looks larger beside trees and buildings." } },
    ],
    ref: "Kaufman and Rock 1962 Science; Ross and Plug 2002 The Mystery of the Moon Illusion",
  },
  {
    id: "pa-l05-048",
    subject: S,
    topic: "spatial-attention",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Distinguish between endogenous (goal-directed) and exogenous (stimulus-driven) control of attention. Discuss attentional capture and contingent capture, and their neural basis.",
    plan: ["Define both types", "Behavioural differences", "Attentional capture by salience and onsets", "Contingent capture", "Corbetta and Shulman's two networks", "Applications"],
    answer: `## Two kinds of control
- Endogenous (top-down, goal-directed) attention is guided by our intentions, knowledge and expectations, as when we search a crowd for a friend wearing a red sari.
- Exogenous (bottom-up, stimulus-driven) attention is captured automatically by salient stimuli, such as a sudden flash, a loud bang or one's own name, regardless of our goals.

## Behavioural differences
| Feature | Endogenous | Exogenous |
| Trigger | Central symbolic cue (an arrow, an instruction) | Peripheral sudden event |
| Speed | Slower, about 300 milliseconds to develop | Fast, within about 100 milliseconds |
| Duration | Sustained as long as needed | Transient, followed by inhibition of return |
| Effect of cue validity | Depends on cue being informative | Occurs even if the cue is uninformative |
| Effect of load | Reduced by competing tasks | Relatively resistant |
| Voluntary control | Yes | Hard to suppress |

## Attentional capture
- Abrupt onsets: Steven Yantis and John Jonides found that a new object appearing suddenly captured attention even when it was no more likely to be the target, suggesting that onsets are special.
- Singletons: a uniquely coloured item among others may capture attention. Jan Theeuwes found that an irrelevant colour singleton slowed search for a shape singleton, arguing for strong stimulus-driven capture.
- Emotional stimuli, faces and moving objects are strong captors.

## Contingent capture
Charles Folk, Roger Remington and James Johnston proposed that capture depends on the observer's attentional set. A cue captures attention only if it shares the feature the person is looking for. When participants searched for a red target, red cues captured attention but sudden onsets did not; when they searched for onsets, the reverse occurred. Capture is therefore contingent on top-down settings, a compromise between purely stimulus-driven and purely goal-driven views. The debate between Theeuwes and Folk continues; current views accept both influences, plus selection history (past rewards and experience) as a third factor, as Edward Awh and colleagues argued.

## Neural basis
Maurizio Corbetta and Gordon Shulman proposed two partly separate frontoparietal networks:
- The dorsal attention network (intraparietal sulcus, superior parietal lobule, frontal eye fields), bilateral, for endogenous selection based on goals.
- The ventral attention network (temporo-parietal junction and ventral frontal cortex), mainly in the right hemisphere, which acts as a "circuit breaker" to reorient attention to unexpected, behaviourally relevant stimuli.
Damage to the ventral network contributes to neglect. The superior colliculus and pulvinar support reflexive orienting.

## Applications
- Interface and alarm design: important warnings should use onsets and motion; irrelevant flashing advertisements on websites capture attention and impair tasks.
- Driving: roadside digital billboards capture drivers' attention.
- Clinical: in ADHD, exogenous capture by distractors is less well controlled; in anxiety, threat stimuli capture attention more strongly.

## Conclusion
Attention is controlled both by goals and by salient events. Contingent capture shows that what captures attention depends partly on what we are looking for, and the dorsal and ventral networks provide the neural basis for this interplay.`,
    keyPoints: ["Definitions with examples", "Comparison table", "Abrupt onset and singleton capture", "Theeuwes's stimulus-driven view", "Folk's contingent capture", "Selection history as a third factor", "Dorsal and ventral networks", "Applications"],
    module: "sensation-perception/2-5",
    visuals: [
      { kind: "compare", caption: "Neural basis", data: { title: "Goal-driven versus stimulus-driven attention", a: { label: "Endogenous", points: ["Follows your goal", "Slow, about 300 ms", "Dorsal frontoparietal network"], summary: "You choose where to look." }, b: { label: "Exogenous", points: ["Grabbed by a flash or bang", "Fast, about 100 ms", "Ventral right-sided network"], summary: "The world chooses for you." } } },
    ],
    ref: "Yantis and Jonides 1984; Theeuwes 1992; Folk, Remington and Johnston 1992; Corbetta and Shulman 2002 Nature Reviews Neuroscience; Awh, Belopolsky and Theeuwes 2012",
  },
  {
    id: "pa-l05-049",
    subject: S,
    topic: "awareness",
    marks: 20,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Discuss consciousness as a topic of psychological study. Describe the main theories of consciousness, the search for its neural correlates, and the study of altered states, including perspectives from Indian thought.",
    plan: ["Define consciousness and its aspects; the hard problem", "Methods for studying consciousness", "Theories: global workspace, integrated information, higher-order, recurrent processing", "Neural correlates and evidence", "Altered states: sleep, hypnosis, meditation, drugs", "Indian perspectives and conclusion"],
    answer: `## Meaning
Consciousness is awareness of oneself and the world: the subjective experience of seeing red, feeling pain or thinking about tomorrow. William James described it as a continuous "stream". Two aspects are often distinguished:
- State or level of consciousness: being awake versus asleep, anaesthetised or in a coma.
- Contents of consciousness: what one is aware of at a given moment.
Ned Block distinguished phenomenal consciousness (what it is like to have an experience) from access consciousness (information available for reasoning, report and action).

## The hard problem
David Chalmers distinguished the "easy problems" of explaining functions such as attention, discrimination and report from the "hard problem": why and how physical processes in the brain give rise to subjective experience at all. Philosophical positions range from dualism (mind and brain are different substances, as for Descartes) to materialism (consciousness is a brain process) and panpsychism.

## Methods
After behaviourism dismissed consciousness, cognitive neuroscience revived its study using:
- Contrastive analysis: comparing conditions in which the same stimulus is consciously perceived or not. Examples include masking, binocular rivalry (each eye sees a different image and awareness alternates between them), inattentional blindness, the attentional blink and blindsight.
- Subjective reports and confidence ratings, with signal detection measures to separate sensitivity from criterion.
- Studies of patients with disorders of consciousness (coma, vegetative state, minimally conscious state).

## Theories
- Global workspace theory: Bernard Baars proposed that the brain contains many specialised unconscious processors and a limited-capacity global workspace, like a theatre stage lit by attention. Information becomes conscious when it is broadcast widely to many processors. Stanislas Dehaene's global neuronal workspace links this to long-range networks of prefrontal and parietal neurons. Conscious perception is marked by "ignition": a sudden, sustained, widespread activation and a late P300 wave about 300 milliseconds after the stimulus.
- Integrated information theory: Giulio Tononi proposed that consciousness corresponds to integrated information (phi), the extent to which a system's whole carries more information than its parts. A system is conscious to the degree that it is both differentiated and integrated. It predicts that the posterior cortex, with its rich interconnections, is central, and that the cerebellum, though full of neurons, contributes little because its circuits are not integrated in this way. It has inspired measures such as the perturbational complexity index, which uses TMS and EEG to assess consciousness in unresponsive patients.
- Higher-order theories: David Rosenthal and others argue that a mental state is conscious when there is a higher-order representation of it (a thought about the state), linking consciousness to prefrontal monitoring and metacognition.
- Recurrent processing theory: Victor Lamme proposed that feedforward sweeps of processing are unconscious, while recurrent (feedback) processing between higher and lower visual areas produces phenomenal consciousness, even without report.
- Predictive processing views treat conscious contents as the brain's best predictions about the causes of its sensory input.
Adversarial collaborations have recently tested global workspace and integrated information predictions against each other, with neither fully confirmed.

## Neural correlates of consciousness
Francis Crick and Christof Koch championed the search for the minimal neural mechanisms sufficient for a conscious experience (neural correlates of consciousness, NCC).
- Arousal depends on the brainstem reticular activating system, thalamus and their projections; damage causes coma.
- Contents depend on cortical regions: in binocular rivalry, activity in higher visual areas such as the fusiform face area tracks what is consciously seen.
- Debate continues about whether the "front" (prefrontal cortex) or the "back" (posterior hot zone) of the cortex is critical.
- Patients in a vegetative state: Adrian Owen found that some, when asked to imagine playing tennis or walking through their house, showed fMRI activation like healthy people, revealing covert awareness.
- Split-brain patients, studied by Roger Sperry and Michael Gazzaniga, showed that each hemisphere could have separate awareness, and that the left hemisphere "interpreter" constructs explanations for actions initiated by the right.
- Benjamin Libet found that brain activity preparing a movement (the readiness potential) began several hundred milliseconds before people reported deciding to move, raising questions about conscious will, though interpretations are debated.

## Altered states of consciousness
- Sleep and dreaming: sleep stages identified by EEG, with vivid dreaming in REM sleep; theories of dreaming include Freud's wish fulfilment, activation-synthesis (Allan Hobson and Robert McCarley) and memory consolidation views.
- Hypnosis: a state of focused attention and heightened suggestibility. Dissociation theories propose that hypnosis divides consciousness, while social-cognitive theories emphasise expectations and role enactment. It is used for pain and anxiety.
- Meditation: concentrative and mindfulness practices change attention and self-awareness, reduce activity in the default mode network during practice and, in long-term practitioners, show altered brain structure and function. Mindfulness-based therapies are effective for preventing depressive relapse.
- Psychoactive drugs: depressants, stimulants, opioids and hallucinogens alter consciousness through neurotransmitter systems; psychedelics such as psilocybin acting on serotonin 2A receptors are under study as treatments.
- Other states: anaesthesia, delirium, coma, near-death experiences and flow states.

## Indian perspectives
Indian thought has long analysed consciousness (chit or chaitanya).
- The Mandukya Upanishad describes four states: waking (jagrat), dreaming (svapna), deep dreamless sleep (sushupti) and turiya, a fourth state of pure consciousness that underlies and transcends the other three.
- Samkhya distinguishes purusha (pure consciousness, the witness) from prakriti (matter, including the mind and intellect), so the mind is not consciousness itself but an instrument illuminated by it.
- Patanjali's Yoga Sutras define yoga as the stilling of the modifications of the mind (chitta vritti nirodha) and describe meditative states (dhyana, samadhi).
- Buddhist Abhidharma analysed moment-to-moment consciousness and the absence of a permanent self.
- Indian psychologists such as Anand Paranjpe, Ramakrishna Rao and Girishwar Misra have argued that these frameworks offer first-person methods and concepts that complement Western third-person science, and research on yoga and meditation in India and elsewhere builds on them.

## Evaluation
Consciousness research has moved from philosophy to experimental science, with powerful paradigms and competing theories. Yet the hard problem remains, theories disagree on whether report is needed, and measures of consciousness in non-communicating patients, infants and animals are still uncertain.

## Conclusion
Consciousness can be studied scientifically through contrasts between conscious and unconscious processing, neural correlates and altered states. Global workspace, integrated information, higher-order and recurrent theories offer different accounts, and Indian traditions add rich descriptions of states of consciousness and contemplative methods. Explaining why brain activity is experienced at all remains one of the deepest open questions in science.`,
    keyPoints: ["Definition with level and contents, phenomenal and access", "Hard problem", "Contrastive methods such as binocular rivalry and masking", "Global workspace theory with ignition", "Integrated information theory", "Higher-order and recurrent processing theories", "Neural correlates with Owen's vegetative state study and split brain", "Altered states and Indian perspectives such as the four states and Samkhya"],
    pitfalls: ["Listing theories without explaining them", "Treating Indian views only as religion rather than models of mind"],
    module: "sensation-perception/3-3",
    visuals: [
      { kind: "compare", data: { title: "Two leading theories", a: { label: "Global workspace", points: ["Many unconscious processors", "Conscious when broadcast widely", "Prefrontal and parietal ignition"], summary: "Consciousness as broadcast." }, b: { label: "Integrated information", points: ["Consciousness equals integrated information", "Measured as phi", "Posterior cortex central"], summary: "Consciousness as integration." } } },
      { kind: "layers", caption: "Indian perspectives", data: { title: "Mandukya Upanishad: four states", shape: "stack", layers: [{ label: "Turiya", detail: "The fourth: pure consciousness underlying all states." }, { label: "Sushupti", detail: "Deep dreamless sleep." }, { label: "Svapna", detail: "Dreaming, the inner world." }, { label: "Jagrat", detail: "Waking, the outer world." }] } },
      { kind: "hypnogram", caption: "Altered states of consciousness", data: { caption: "Drag through a night of sleep: when does dreaming consciousness appear?" } },
    ],
    ref: "Chalmers 1995; Block 1995; Baars 1988; Dehaene and Changeux 2011; Tononi 2004 and 2016; Lamme 2006; Crick and Koch 2003; Owen et al 2006 Science; Libet et al 1983; Gazzaniga 2005; Mandukya Upanishad; Rao, Paranjpe and Dalal 2008 Handbook of Indian Psychology; Cogitate Consortium 2023",
  },
  {
    id: "pa-l05-050",
    subject: S,
    topic: "sensation",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on synaesthesia.",
    plan: ["Define synaesthesia and types", "Evidence that it is genuine", "Explanations", "Significance"],
    answer: `## Meaning
Synaesthesia is a condition in which stimulation of one sense or cognitive pathway automatically and consistently produces an additional experience in another. The most common form is grapheme-colour synaesthesia, in which letters or numbers are seen as having specific colours (for example, 5 is always red). Others include sound-colour (hearing music evokes colours), word-taste and the experience of days or months in spatial positions. It affects perhaps 2 to 4 percent of people and often runs in families.

## Evidence that it is genuine
- Consistency: synaesthetes report the same associations when retested months or years later without warning, far more consistently than non-synaesthetes trying to memorise associations.
- Perceptual pop-out: V. S. Ramachandran and Edward Hubbard showed a field of 5s with a hidden triangle of 2s. Grapheme-colour synaesthetes found the triangle faster, because the 2s appeared in a different colour.
- Stroop-like interference: naming the ink colour of a digit is slowed when it conflicts with the synaesthetic colour.
- Brain imaging shows activation in colour areas such as V4 when synaesthetes view black letters.

## Explanations
- Cross-activation: adjacent brain areas, such as the grapheme area and V4 in the fusiform gyrus, are more strongly connected, possibly because of reduced pruning of connections in development.
- Disinhibited feedback from higher multisensory areas.
- Learning influences the specific pairings; some people's colours match childhood fridge magnets.

## Significance
Synaesthesia shows that perception can be shaped by unusual brain connectivity, informs theories of cross-modal integration and consciousness, and is linked to creativity and better memory in some people. Ramachandran suggested it may help explain metaphor.`,
    keyPoints: ["Definition and common types", "Prevalence and heritability", "Consistency evidence", "Pop-out test", "Cross-activation explanation", "Significance"],
    module: "sensation-perception/2-3",
    visuals: [
      { kind: "reveal", caption: "Evidence that it is genuine", data: { prompt: "In a field of black 5s, a triangle of black 2s is hidden. Why might a synaesthete spot it faster?", answer: "For a grapheme-colour synaesthete the 2s may look a different colour from the 5s, so the triangle pops out, as in colour search." } },
    ],
    ref: "Ramachandran and Hubbard 2001; Simner et al 2006 prevalence; Witthoft and Winawer 2013 fridge magnets",
  },
];
