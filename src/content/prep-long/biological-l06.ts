import type { LongQA } from "@/lib/prep/long-types";
import type { PrepVisual } from "@/lib/prep/types";
import type { FigureData } from "@/lib/study/types";
import { anchored, chain, compare, layers, tree, vis } from "./visual";

const S = "biological" as const;
const fig = (id: string, caption: string): PrepVisual => ({ kind: "figure", data: { id } satisfies FigureData, caption });

export const BIOLOGICAL_L06: LongQA[] = anchored([
  {
    id: "bio-l06-001",
    subject: S,
    topic: "psychopharmacology",
    marks: 15,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "md-psychiatry", "ma-semester"],
    question: "Describe the brain reward system and its role in addiction. Discuss the main neurobiological theories of addiction.",
    plan: ["Discovery of the reward system", "Anatomy and dopamine", "How drugs act on it", "Theories of addiction", "Changes in the addicted brain", "Treatment implications"],
    answer: `## Discovery
In 1954 James Olds and Peter Milner found that rats with electrodes in certain brain areas, especially along the medial forebrain bundle, would press a lever thousands of times an hour to receive brief electrical stimulation, ignoring food and water. This intracranial self stimulation revealed a brain system for reward.

## Anatomy
- The mesolimbic dopamine pathway runs from the ventral tegmental area in the midbrain to the nucleus accumbens in the ventral striatum. It is the core of the reward system.
- The mesocortical pathway from the ventral tegmental area to the prefrontal cortex supports motivation and decision making.
- Other parts include the amygdala, which links cues with emotions; the hippocampus, which stores context; the orbitofrontal cortex, which values outcomes; and the dorsal striatum, involved in habits.
- Natural rewards, such as food, sex and social contact, release dopamine in the nucleus accumbens.
- Wolfram Schultz showed that dopamine neurons fire most to unexpected rewards and, after learning, to cues that predict reward, encoding a reward prediction error.

## How drugs act
Gaetano Di Chiara and Assunta Imperato showed in 1988 that most addictive drugs increase dopamine in the nucleus accumbens, more strongly and reliably than natural rewards:
| Drug | Main action |
| Cocaine | Blocks the dopamine transporter |
| Amphetamine | Releases dopamine by reversing the transporter |
| Opioids | Inhibit GABA neurons that normally restrain dopamine cells |
| Nicotine | Stimulates nicotinic receptors on dopamine neurons |
| Alcohol | Acts on GABA A, NMDA and opioid systems, indirectly raising dopamine |
| Cannabis | Acts on CB1 receptors, reducing GABA inhibition of dopamine cells |

## Theories
1. Positive reinforcement and hedonic theory: drugs are used because they produce pleasure. This explains early use but not why addicted people continue when the drug no longer gives much pleasure.
2. Negative reinforcement and the opponent process: Richard Solomon proposed that each pleasant state triggers an opposite process that grows with repetition. George Koob's allostasis model says repeated use shifts the brain's set point, recruiting stress systems such as corticotropin releasing factor, so that people take drugs to escape withdrawal and negative mood, the dark side of addiction.
3. Incentive sensitisation: Terry Robinson and Kent Berridge argued that repeated drug use sensitises the dopamine system that makes drug cues attractive, wanting, while liking, pleasure, does not increase and may fall. This explains intense craving triggered by cues, such as seeing a friend who used, even years after stopping.
4. Habit theory: Barry Everitt and Trevor Robbins showed that with repeated use, control shifts from the ventral striatum, goal directed, to the dorsal striatum, habit based, so drug taking becomes automatic and compulsive.
5. Impaired executive control: Nora Volkow's imaging work shows reduced D2 receptors in the striatum and reduced activity in the prefrontal cortex and anterior cingulate in addicted people, weakening control over impulses and judgement of consequences.

## The addicted brain
Addiction is thus seen as a chronic relapsing condition involving three stages, as Koob and Volkow described:
1. Binge and intoxication: reward and incentive salience, basal ganglia.
2. Withdrawal and negative affect: stress systems, extended amygdala.
3. Preoccupation and anticipation: craving and poor control, prefrontal cortex.

## Treatment implications
- Medicines target these systems: naltrexone blocks opioid receptors and reduces alcohol reward; buprenorphine and methadone stabilise opioid systems; varenicline is a partial agonist at nicotinic receptors.
- Cue exposure, mindfulness and relapse prevention address cue triggered craving.
- Cognitive training and contingency management aim to strengthen control and alternative rewards.
- Social factors, such as poverty, trauma and availability, remain crucial; the brain disease model should not obscure them.

## Evaluation
The neurobiological theories are well supported in animals and imaging studies and have guided treatments. Critics note that many people recover without treatment, that addiction is shaped by environment, and that a purely brain based model may increase stigma or neglect choice and context.

## Conclusion
Addiction involves hijacking of the dopamine reward system, sensitised wanting, stress driven negative reinforcement, habits and weakened prefrontal control, within a social context.`,
    keyPoints: ["Olds and Milner 1954 self stimulation", "Mesolimbic pathway VTA to nucleus accumbens", "Reward prediction error", "Di Chiara 1988 and drug mechanisms table", "Opponent process and allostasis", "Incentive sensitisation: wanting versus liking", "Habit shift to dorsal striatum and prefrontal impairment", "Three stage cycle and treatments"],
    pitfalls: ["Saying dopamine is simply the pleasure chemical", "Ignoring social factors"],
    module: "brain/7-4",
    visuals: [
      fig("dopamine-pathways", "Anatomy: the dopamine pathways, with the mesolimbic reward route"),
      vis("sort", { prompt: "Which theory explains each feature of addiction?", buckets: ["Incentive sensitisation", "Allostasis", "Habit theory"], items: [{ text: "Intense craving when seeing an old drinking friend", bucket: 0 }, { text: "Drinking to escape low mood and withdrawal", bucket: 1 }, { text: "Reaching for a cigarette automatically after tea", bucket: 2 }] }, "Theories"),
    ],
    ref: "Olds and Milner 1954; Schultz, Dayan and Montague 1997; Di Chiara and Imperato 1988; Solomon and Corbit 1974; Koob and Le Moal 2001; Robinson and Berridge 1993; Everitt and Robbins 2005; Volkow et al 2016; Koob and Volkow 2010; brain module 7.4",
  },
  {
    id: "bio-l06-002",
    subject: S,
    topic: "neuroanatomy",
    marks: 15,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"],
    question: "Describe the visual pathway from the retina to the cortex. Explain the visual field defects produced by lesions at different points and the two cortical streams of visual processing.",
    plan: ["The retina", "Pathway to the cortex", "Field defects by lesion site", "Primary and higher visual areas", "Dorsal and ventral streams", "Disorders of higher vision"],
    answer: `## The retina
Light passes through the cornea and lens to the retina at the back of the eye. Photoreceptors convert light into neural signals:
- Rods, about 120 million, sensitive to dim light, responsible for night and peripheral vision, no colour.
- Cones, about 6 million, concentrated in the fovea, responsible for colour and fine detail, using three types sensitive to short, medium and long wavelengths.
Signals pass through bipolar cells to ganglion cells, whose axons form the optic nerve. Where the nerve leaves the eye there are no receptors, the blind spot.

## Pathway to the cortex
1. Optic nerve: carries all fibres from one eye.
2. Optic chiasm: fibres from the nasal half of each retina, which see the temporal visual field, cross to the other side. Temporal fibres stay on the same side.
3. Optic tract: now carries information about the opposite visual field from both eyes.
4. Lateral geniculate nucleus of the thalamus: a six layered relay, with magnocellular layers for motion and parvocellular layers for colour and detail.
5. Optic radiations: fibres pass to the occipital cortex. Fibres for the upper visual field loop through the temporal lobe in Meyer's loop; those for the lower field pass through the parietal lobe.
6. Primary visual cortex, V1, or striate cortex, around the calcarine sulcus of the occipital lobe.
Some fibres go to the superior colliculus for eye movements and to the pretectal area for the pupillary light reflex.

## Field defects
| Lesion site | Defect | Common cause |
| Optic nerve | Blindness in that eye | Optic neuritis, glaucoma |
| Optic chiasm, centre | Bitemporal hemianopia: loss of both outer fields | Pituitary tumour |
| Optic tract | Contralateral homonymous hemianopia | Stroke, tumour |
| Meyer's loop, temporal lobe | Contralateral upper quadrantanopia, pie in the sky | Temporal lobe tumour or surgery |
| Parietal radiations | Contralateral lower quadrantanopia | Parietal stroke |
| Occipital cortex | Contralateral homonymous hemianopia, often with sparing of central vision | Posterior cerebral artery stroke |
Macular sparing in occipital strokes occurs because the area for central vision may receive blood from both the posterior and middle cerebral arteries.

## Higher visual areas
- V1 contains neurons tuned to edges of particular orientation, as David Hubel and Torsten Wiesel found, earning a Nobel Prize in 1981. Simple, complex and hypercomplex cells build up features.
- V4 is important for colour, and V5, also called MT, for motion.

## Two streams
Leslie Ungerleider and Mortimer Mishkin proposed in 1982:
- The ventral stream, from V1 to the inferior temporal cortex, the what pathway, for recognising objects, faces and colours.
- The dorsal stream, from V1 to the posterior parietal cortex, the where pathway, for location and motion.
David Milner and Melvyn Goodale reframed the dorsal stream as vision for action. Their patient DF, with damage to the ventral stream from carbon monoxide poisoning, could not report the orientation of a slot but could post a card through it accurately.

## Disorders of higher vision
- Visual agnosia: inability to recognise objects despite intact vision, after ventral stream damage.
- Prosopagnosia: inability to recognise faces, linked to the fusiform face area.
- Achromatopsia: loss of colour vision after V4 damage.
- Akinetopsia: loss of motion perception after V5 damage.
- Balint's syndrome: difficulty seeing more than one object, reaching and moving the eyes, after bilateral parietal damage.
- Blindsight: people with V1 damage can point to or discriminate stimuli in their blind field without awareness, as Lawrence Weiskrantz showed, through pathways via the superior colliculus.
- Charles Bonnet syndrome: vivid visual hallucinations in people with visual loss who know they are not real, important to distinguish from psychosis in older adults.

## Conclusion
The visual system is a precisely organised pathway whose lesions produce predictable field defects, and whose cortical streams separate recognition from spatial guidance, explaining many neuropsychological syndromes.`,
    keyPoints: ["Rods and cones with numbers and functions", "Pathway: nerve, chiasm, tract, LGN, radiations, V1", "Nasal fibres cross at the chiasm", "Field defect table by lesion site", "Macular sparing", "Hubel and Wiesel feature detectors; V4 and V5", "Ventral what and dorsal where or action streams; patient DF", "Agnosias, blindsight and Charles Bonnet syndrome"],
    pitfalls: ["Saying all optic fibres cross", "Mixing up Meyer's loop and parietal defects"],
    module: "brain/3-4",
    visuals: [
      fig("visual-pathway", "Pathway to the cortex and the field defects of each lesion"),
      compare("Two streams", ["Ventral stream", ["V1 to inferior temporal cortex", "What: objects, faces, colour", "Damage: agnosia, prosopagnosia"], "Vision for perception"], ["Dorsal stream", ["V1 to posterior parietal cortex", "Where and how: location, motion, action", "Damage: Balint's syndrome, misreaching"], "Vision for action"]),
    ],
    ref: "Hubel and Wiesel 1962, Nobel 1981; Ungerleider and Mishkin 1982; Milner and Goodale 1995, patient DF; Weiskrantz 1986 blindsight; Zeki V4/V5; brain module 3.4",
  },
  {
    id: "bio-l06-003",
    subject: S,
    topic: "neuroanatomy",
    marks: 15,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"],
    question: "Describe the memory systems of the brain. Discuss the evidence from the case of H M and other amnesic syndromes, and explain the role of the hippocampus and other structures.",
    plan: ["Memory is not one system", "The case of H M", "Taxonomy of memory systems and their brain bases", "The hippocampus and consolidation", "Other amnesic syndromes", "Clinical relevance"],
    answer: `## Many memory systems
Memory once seemed a single faculty. Studies of patients with brain damage showed that different kinds of memory depend on different brain systems.

## The case of H M
Henry Molaison, known for decades as H M, had severe epilepsy. In 1953, at age 27, the surgeon William Scoville removed most of his medial temporal lobes on both sides, including much of the hippocampus, amygdala and nearby cortex. His seizures improved, but he developed profound anterograde amnesia: he could not form new long term declarative memories. He met Brenda Milner, who studied him for decades, many times, yet never recognised her.
Key findings:
- His intelligence, language and personality were preserved.
- Short term memory was intact: he could repeat digits and hold a conversation.
- He had some retrograde amnesia for the years before surgery but remembered his childhood.
- He learned new motor skills, such as mirror drawing, improving over days, while saying he had never done the task before.
- He showed priming and simple conditioning.
These showed that the medial temporal lobe is crucial for forming new declarative memories, but not for short term memory, skills or old remote memories.

## Taxonomy of memory systems
Larry Squire proposed a widely used classification:
| Memory system | Type | Main brain structures |
| Declarative or explicit | Episodic: personal events | Hippocampus, medial temporal lobe, prefrontal cortex |
| Declarative or explicit | Semantic: facts and meanings | Medial and lateral temporal cortex |
| Non declarative | Procedural skills and habits | Basal ganglia, especially striatum, and cerebellum |
| Non declarative | Priming | Neocortex |
| Non declarative | Classical conditioning | Amygdala for emotional responses, cerebellum for motor responses |
| Working memory | Holding and manipulating information | Dorsolateral prefrontal and parietal cortex |
Evidence for separate systems: patients with Parkinson's or Huntington's disease have impaired skill learning but better declarative memory, the reverse of H M.

## The hippocampus and consolidation
- The hippocampus binds together elements of an experience stored in different cortical areas, such as sights, sounds and emotions.
- Consolidation: over time, memories become less dependent on the hippocampus and more on the neocortex, according to the standard consolidation theory, which explains why H M kept childhood memories. Multiple trace theory argues that vivid episodic memories always need the hippocampus.
- Sleep, especially slow wave sleep, supports consolidation through replay of hippocampal activity.
- Long term potentiation in the hippocampus is the leading cellular model of memory formation.
- The hippocampus also supports spatial memory: John O'Keefe discovered place cells, and May Britt and Edvard Moser grid cells, sharing a Nobel Prize in 2014. Eleanor Maguire found that London taxi drivers who learned the city's streets had larger posterior hippocampi.

## Other amnesic syndromes
- Korsakoff syndrome: severe anterograde amnesia with confabulation, due to thiamine deficiency usually in alcohol dependence, damaging the mammillary bodies and medial thalamus. It often follows Wernicke's encephalopathy, which presents with confusion, eye movement problems and unsteady gait and must be treated urgently with thiamine.
- Alzheimer's disease: begins in the entorhinal cortex and hippocampus, so early loss of recent memory is typical.
- Herpes simplex encephalitis: damages the medial temporal lobes; the musician Clive Wearing was left with a memory span of seconds.
- Transient global amnesia: sudden temporary amnesia, usually resolving within 24 hours.
- Electroconvulsive therapy can cause temporary anterograde and some retrograde memory loss.
- Dissociative amnesia: loss of autobiographical memory without brain damage, often after trauma, which differs from organic amnesia by affecting personal identity more than new learning.

## Clinical relevance
- Assessing memory includes tests of immediate recall, delayed recall and recognition, such as the Wechsler Memory Scale and Indian batteries.
- Patients with amnesia can still learn skills and routines, which is used in rehabilitation with errorless learning and memory aids.

## Conclusion
Memory consists of several systems. The medial temporal lobe and hippocampus are essential for forming new declarative memories, while skills, priming and conditioning depend on other structures.`,
    keyPoints: ["Memory as multiple systems", "H M's surgery in 1953 and his deficits", "Preserved short term memory, skills and priming", "Squire's taxonomy with brain structures", "Double dissociation with basal ganglia disorders", "Consolidation, sleep, LTP and spatial cells", "Korsakoff, Alzheimer's, encephalitis, transient global amnesia", "Clinical assessment and rehabilitation"],
    pitfalls: ["Saying H M lost all memory", "Confusing anterograde and retrograde amnesia"],
    module: "brain/3-7",
    visuals: [
      tree("Taxonomy of memory systems", [["Long term memory", "Squire's systems", -1], ["Declarative", "Medial temporal lobe", 0], ["Episodic", "Events, hippocampus", 1], ["Semantic", "Facts, temporal cortex", 1], ["Non declarative", "Outside the hippocampus", 0], ["Procedural", "Striatum and cerebellum", 4], ["Priming and conditioning", "Neocortex, amygdala, cerebellum", 4]]),
      fig("hippocampus", "The hippocampus and consolidation: the circuit cut across"),
    ],
    ref: "Scoville and Milner 1957; Corkin 2013; Squire 1992, 2004; O'Keefe and Dostrovsky 1971; Moser grid cells, Nobel 2014; Maguire et al 2000; Victor, Adams and Collins Korsakoff; Wearing case; brain module 3.7",
  },
  {
    id: "bio-l06-004",
    subject: S,
    topic: "neuroanatomy",
    marks: 10,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Describe the lobes of the cerebral cortex and their main functions. Give examples of the effects of damage to each.",
    plan: ["The cortex", "Frontal lobe", "Parietal lobe", "Temporal lobe", "Occipital lobe and integration"],
    answer: `## The cortex
The cerebral cortex is the folded outer layer of grey matter, about 2 to 4 millimetres thick, with ridges called gyri and grooves called sulci. Two major sulci divide each hemisphere: the central sulcus separates frontal and parietal lobes, and the lateral, or Sylvian, fissure separates the temporal lobe below. Most of the cortex is neocortex with six layers.

## Frontal lobe
Functions:
- Primary motor cortex in the precentral gyrus controls voluntary movement of the opposite side.
- Premotor and supplementary motor areas plan movements.
- Broca's area, in the left inferior frontal gyrus, supports speech production.
- The prefrontal cortex supports executive functions: planning, working memory, inhibition, judgement, personality and social behaviour.
Damage: weakness on the opposite side; Broca's aphasia, slow, effortful speech with good comprehension; dysexecutive syndrome; disinhibition or apathy, as in Phineas Gage, the railway foreman whose personality changed after an iron rod passed through his frontal lobe in 1848.

## Parietal lobe
Functions:
- Primary somatosensory cortex in the postcentral gyrus receives touch, pain, temperature and position from the opposite side.
- Posterior parietal cortex integrates sensory information for spatial attention and guiding action.
- The left inferior parietal lobule supports reading, writing and calculation.
Damage: loss of sensation; right parietal damage causes neglect of the left side of space, such as eating from only the right of the plate; left angular gyrus damage causes Gerstmann syndrome, with finger agnosia, left right confusion, inability to write and inability to calculate; apraxia.

## Temporal lobe
Functions:
- Primary auditory cortex in the superior temporal gyrus.
- Wernicke's area in the left posterior superior temporal gyrus supports language comprehension.
- Medial temporal structures, the hippocampus and amygdala, support memory and emotion.
- Inferior temporal cortex supports object and face recognition.
Damage: Wernicke's aphasia, fluent but meaningless speech with poor comprehension; memory loss; prosopagnosia; temporal lobe epilepsy with deja vu, odd smells and fear; Kluver Bucy syndrome after bilateral damage, with placidity, hyperorality and hypersexuality.

## Occipital lobe
Functions: primary visual cortex and visual association areas.
Damage: loss of vision in the opposite visual field; visual agnosia; cortical blindness after bilateral damage, sometimes with denial of blindness, Anton syndrome.

## Integration
The lobes work together in networks, and the limbic system and insula, sometimes called extra lobes, add emotion and bodily awareness. The corpus callosum connects the hemispheres.

## Conclusion
Each lobe has distinctive functions, and knowing them helps link symptoms to brain damage.`,
    keyPoints: ["Gyri, sulci, central and lateral fissures", "Frontal: motor, Broca, prefrontal executive; Gage", "Parietal: somatosensory, spatial, neglect, Gerstmann", "Temporal: auditory, Wernicke, memory, faces, Kluver Bucy", "Occipital: vision and cortical blindness", "Networks and the corpus callosum"],
    pitfalls: ["Placing Broca's area in the temporal lobe"],
    module: "brain/3-4",
    visuals: [fig("brain-lateral", "The cortex: lobes, gyri and sulci from the side")],
    ref: "Standard neuroanatomy; Harlow 1868 Gage; Gerstmann 1940; Kluver and Bucy 1939; brain module 3.4 and 3.5",
  },
  {
    id: "bio-l06-005",
    subject: S,
    topic: "neuroanatomy",
    marks: 10,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "md-psychiatry", "ma-semester"],
    question: "Describe the organisation of the motor system, including the motor cortex, the corticospinal tract, the basal ganglia and the cerebellum. Distinguish upper and lower motor neuron lesions.",
    plan: ["Levels of motor control", "Motor cortex and homunculus", "Corticospinal tract", "Basal ganglia and cerebellum", "Upper versus lower motor neuron lesions and relevance"],
    answer: `## Levels of motor control
Movement is controlled at several levels: the spinal cord for reflexes, the brainstem for posture and eye movements, the motor cortex for voluntary movement, and the basal ganglia and cerebellum, which modulate movement through loops with the cortex.

## Motor cortex
- The primary motor cortex, Brodmann area 4, lies in the precentral gyrus. Wilder Penfield, stimulating the cortex during surgery, mapped the body onto it, the motor homunculus. Areas for the hands, lips and tongue are disproportionately large because they need fine control.
- The premotor cortex prepares movements guided by external cues, and contains mirror neurons that fire both when performing and observing actions.
- The supplementary motor area plans internally generated sequences.

## Corticospinal tract
- Axons from the motor cortex descend through the internal capsule, cerebral peduncles and pons to the medullary pyramids.
- About 85 to 90 per cent cross to the opposite side at the pyramidal decussation and descend as the lateral corticospinal tract, which is why the left hemisphere controls the right body.
- They synapse on lower motor neurons in the anterior horn of the spinal cord, whose axons go to muscles.
- The corticobulbar tract controls cranial nerve motor nuclei for face and swallowing.

## Basal ganglia and cerebellum
- The basal ganglia, the caudate, putamen, globus pallidus, subthalamic nucleus and substantia nigra, select and initiate movements and suppress unwanted ones through direct and indirect pathways. Disorders: Parkinson's disease with slowness, rigidity and tremor at rest; Huntington's disease with chorea; antipsychotic induced parkinsonism, dystonia, akathisia and tardive dyskinesia.
- The cerebellum coordinates timing, balance and correction of errors. Damage causes ataxia, intention tremor, past pointing, nystagmus and slurred speech, often from alcohol.

## Upper and lower motor neuron lesions
| Feature | Upper motor neuron | Lower motor neuron |
| Site | Cortex, internal capsule, corticospinal tract | Anterior horn, nerve root, peripheral nerve |
| Tone | Increased, spastic | Decreased, flaccid |
| Reflexes | Brisk | Reduced or absent |
| Plantar response | Extensor, positive Babinski sign | Flexor |
| Wasting | Little, from disuse | Marked |
| Fasciculations | Absent | Present |
| Example | Stroke | Poliomyelitis, nerve injury |

## Relevance
Psychologists and psychiatrists must recognise extrapyramidal side effects of medicines, distinguish functional neurological symptoms, such as weakness that does not follow anatomical patterns, from organic weakness, and understand catatonia, which involves motor signs without structural damage.

## Conclusion
Voluntary movement depends on the motor cortex and corticospinal tract, refined by basal ganglia and cerebellar loops. The pattern of signs locates the lesion.`,
    keyPoints: ["Levels of motor control", "Primary motor cortex area 4 and Penfield's homunculus", "Premotor cortex and mirror neurons; SMA", "Corticospinal tract crossing at the pyramids", "Basal ganglia disorders and antipsychotic side effects", "Cerebellar signs", "UMN versus LMN table", "Clinical relevance"],
    pitfalls: ["Saying UMN lesions cause flaccidity"],
    module: "brain/3-2",
    visuals: [fig("homunculus", "Motor cortex: the motor and sensory homunculus")],
    ref: "Penfield and Rasmussen 1950; Rizzolatti mirror neurons 1996; standard neurology UMN/LMN; brain module 3.1 and 3.2",
  },
  {
    id: "bio-l06-006",
    subject: S,
    topic: "endocrine-hunger",
    marks: 15,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"],
    question: "Discuss the biological and psychological regulation of hunger and eating. What does this tell us about obesity and eating disorders?",
    plan: ["Hunger as a regulated drive", "Short term signals", "Long term signals and leptin", "Brain centres: from dual centre to arcuate circuits", "Psychological and social factors", "Obesity and eating disorders"],
    answer: `## Hunger as a regulated drive
Eating keeps energy balanced over time. Early theories proposed a set point, a target body weight defended by the brain. Modern views describe a settling point, the weight at which many biological and environmental influences come into balance, which explains why weight changes when environments change.

## Short term signals
- Stomach: Walter Cannon and Arthur Washburn in 1912 had Washburn swallow a balloon and found that stomach contractions coincided with reports of hunger. However, people whose stomachs are removed still feel hunger, so contractions are not essential.
- Glucose: the glucostatic theory proposed that falling blood glucose triggers hunger. Insulin, released after meals, helps glucose enter cells.
- Gut hormones: ghrelin, released by the empty stomach, rises before meals and increases hunger; cholecystokinin, peptide YY and GLP 1, released by the intestine after food, increase satiety. GLP 1 based medicines, such as semaglutide, reduce appetite and are now used for obesity.
- Sensory specific satiety: we tire of one food but can eat another, explaining room for dessert.

## Long term signals and leptin
- Fat cells release leptin in proportion to fat stores. Jeffrey Friedman's team identified the leptin gene in 1994 in obese ob ob mice, which lack leptin and overeat; giving them leptin reduced eating.
- Most obese humans have high leptin but are resistant to its effects, so leptin treatment helps only the rare people born without it.
- Insulin also signals long term energy stores to the brain.

## Brain centres
- The dual centre model: lesions of the ventromedial hypothalamus caused rats to overeat and become obese, while lesions of the lateral hypothalamus caused them to stop eating. These were called satiety and hunger centres. Later work showed the effects were more complex, involving changes in metabolism and fibre pathways passing through.
- Modern model: the arcuate nucleus of the hypothalamus contains two opposing groups of neurons:
| Neurons | Signals | Effect |
| NPY and AgRP | Activated by ghrelin, inhibited by leptin | Increase hunger, reduce energy use |
| POMC and CART | Activated by leptin and insulin | Reduce hunger, increase energy use |
These project to the paraventricular nucleus and the lateral hypothalamus, where orexin and melanin concentrating hormone neurons promote eating. The brainstem nucleus of the solitary tract receives signals from the gut through the vagus nerve.
- Reward systems: dopamine in the nucleus accumbens and opioids make tasty food rewarding, which can override satiety, hedonic hunger.

## Psychological and social factors
- Learned cues: time of day, smells and advertising trigger eating.
- Portion size and variety: larger portions and buffets increase intake.
- Stanley Schachter's externality theory suggested obese people respond more to external food cues, though later evidence was mixed.
- Restraint theory: Peter Herman and Janet Polivy found that chronic dieters, when their restraint is broken, for example after a milkshake preload, eat more than non dieters, the what the hell effect.
- Emotions and stress: some people eat more and others less under stress.
- Culture: food offered to guests, festival sweets and family meals shape eating in India; urbanisation, packaged foods and less physical activity have increased obesity and diabetes, and India has a high prevalence of type 2 diabetes.

## Obesity
Obesity results from genes, explaining about 40 to 70 per cent of variation in body mass index, interacting with an obesogenic environment. Treatment includes diet, activity, behaviour change, medicines and bariatric surgery.

## Eating disorders
- Anorexia nervosa involves self starvation despite hunger signals, with fear of weight gain; biological factors include altered serotonin and reward responses, and starvation itself worsens rigid thinking, as the Minnesota semi starvation study of 1944 to 1945 showed in healthy volunteers.
- Bulimia nervosa and binge eating disorder involve cycles of restraint, bingeing and, in bulimia, compensatory behaviour, linking to restraint theory and emotional regulation.

## Conclusion
Eating is controlled by short term gut and glucose signals, long term fat signals such as leptin, hypothalamic and brainstem circuits, reward systems and powerful psychological and social influences.`,
    keyPoints: ["Set point and settling point", "Stomach, glucose and gut hormone signals including ghrelin and GLP 1", "Leptin discovery 1994 and leptin resistance", "Dual centre model and its revision", "Arcuate NPY AgRP versus POMC CART", "Reward and hedonic hunger", "Externality, restraint theory, culture", "Obesity and eating disorders"],
    pitfalls: ["Presenting the dual centre model as current", "Ignoring psychological factors"],
    module: "brain/4-2",
    visuals: [
      fig("hypothalamus", "Brain centres: the nuclei of the hypothalamus"),
      compare("Brain centres", ["Hunger signals", ["Ghrelin from the empty stomach", "NPY and AgRP neurons", "Orexin in the lateral hypothalamus"], "Start eating"], ["Satiety signals", ["Leptin from fat, insulin", "POMC and CART neurons", "CCK, PYY and GLP 1 from the gut"], "Stop eating"]),
    ],
    ref: "Cannon and Washburn 1912; Mayer 1953 glucostatic; Zhang et al 1994 leptin; Kojima 1999 ghrelin; Hetherington and Ranson 1940; Anand and Brobeck 1951; Schachter 1971; Herman and Polivy 1975; Keys 1950 Minnesota starvation; brain module 4.2",
  },
  {
    id: "bio-l06-007",
    subject: S,
    topic: "endocrine-sex",
    marks: 10,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "How do hormones influence sexual differentiation and behaviour? Discuss organising and activating effects with evidence from animal studies and human conditions.",
    plan: ["Sexual differentiation", "Organising and activating effects", "Human conditions", "Hormones and adult behaviour", "Cautions"],
    answer: `## Sexual differentiation
- Genetic sex is set at conception: XX or XY.
- The SRY gene on the Y chromosome causes the undifferentiated gonads to become testes around the seventh week of pregnancy. Without SRY, ovaries develop.
- Testes produce testosterone, which develops male internal ducts and, after conversion to dihydrotestosterone by the enzyme 5 alpha reductase, male external genitals. They also produce anti Mullerian hormone, which removes female ducts.
- Without these hormones, the body develops along female lines.

## Organising and activating effects
- Organising effects: hormones during sensitive periods before or around birth permanently shape the brain and body.
- Activating effects: hormones later in life, especially from puberty, temporarily activate behaviours in the already organised system.
Charles Phoenix and colleagues in 1959 gave testosterone to pregnant guinea pigs. Their female offspring, as adults, showed less female and more male typical mating behaviour even when given female hormones, showing a permanent organising effect. In rats, a sexually dimorphic nucleus of the preoptic area is larger in males and depends on early hormones.

## Human conditions
- Congenital adrenal hyperplasia: an enzyme deficiency makes the adrenal glands produce excess androgens before birth. Girls with CAH, though usually raised as girls, show more male typical toy preferences and play, as Sheri Berenbaum and Melissa Hines found in 1992, and somewhat more interest in male typical activities later.
- Complete androgen insensitivity syndrome: XY people whose cells cannot respond to androgens develop a female body and usually a female identity, showing the importance of androgen action rather than chromosomes alone.
- 5 alpha reductase deficiency: XY children in some communities, such as in the Dominican Republic, appeared female at birth and were raised as girls, but at puberty developed male features under testosterone, and many adopted male identities, suggesting an influence of prenatal testosterone on identity, though culture also played a role.
- The case of David Reimer, a boy raised as a girl after a circumcision accident, who later rejected the female identity, challenged the view that gender identity is entirely learned.

## Adult behaviour
- Testosterone is linked moderately to sexual desire in both sexes, and modestly to dominance and aggression, with effects depending on context.
- Oestrogen and progesterone vary over the menstrual cycle; some studies report small changes in mood and preferences.
- Oxytocin is involved in bonding, childbirth and breastfeeding.

## Cautions
Effects are averages with great overlap between individuals. Gender roles and identity are shaped by both biology and culture. Hormone effects should not be used to justify stereotypes.

## Conclusion
Hormones organise sex differences early and activate behaviour later, as animal studies and human conditions show, interacting with social learning.`,
    keyPoints: ["SRY gene and testes", "Testosterone, DHT and anti Mullerian hormone", "Organising versus activating effects", "Phoenix 1959 guinea pig study", "CAH, androgen insensitivity, 5 alpha reductase deficiency", "David Reimer case", "Adult hormone effects and cautions"],
    pitfalls: ["Saying chromosomes alone decide sex development"],
    module: "brain/4-2",
    visuals: [chain("Sexual differentiation", [["XY with SRY", "Conception"], ["Testes form", "About week 7"], ["Testosterone and AMH", "Male ducts, female ducts removed"], ["DHT", "Male external genitals"], ["Organised brain", "Activated at puberty"]])],
    ref: "Phoenix, Goy, Gerall and Young 1959; Gorski 1978 SDN-POA; Berenbaum and Hines 1992; Imperato-McGinley 1974; Diamond and Sigmundson 1997 Reimer; brain module 4.2",
  },
  {
    id: "bio-l06-008",
    subject: S,
    topic: "neuroanatomy",
    marks: 10,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Describe the structure of the spinal cord, its ascending and descending tracts, and the reflex arc.",
    plan: ["Overview", "Grey and white matter", "Ascending and descending tracts", "The reflex arc", "Clinical examples"],
    answer: `## Overview
The spinal cord runs from the medulla to about the first or second lumbar vertebra, protected by the vertebral column and meninges. It gives rise to 31 pairs of spinal nerves: 8 cervical, 12 thoracic, 5 lumbar, 5 sacral and 1 coccygeal. Each spinal nerve has a dorsal root carrying sensory information in and a ventral root carrying motor information out, the Bell Magendie law.

## Grey and white matter
- In cross section, grey matter forms a butterfly or H shape in the centre.
1. Dorsal horns receive sensory input.
2. Ventral horns contain lower motor neurons to skeletal muscles.
3. Lateral horns, in thoracic and upper lumbar segments, contain sympathetic preganglionic neurons.
- White matter surrounds it, containing ascending and descending tracts of myelinated axons.

## Tracts
Ascending, sensory:
- Dorsal columns, the medial lemniscus pathway: fine touch, vibration and position sense. They ascend on the same side and cross in the medulla.
- Spinothalamic tract: pain and temperature. Fibres cross within one or two segments of entering, then ascend on the opposite side to the thalamus.
- Spinocerebellar tracts: unconscious position sense to the cerebellum.
Descending, motor:
- Lateral corticospinal tract: voluntary movement, already crossed in the medulla.
- Other tracts from the brainstem control posture and muscle tone.

## The reflex arc
A reflex is a rapid, automatic response to a stimulus. The knee jerk is a monosynaptic stretch reflex:
1. Tapping the patellar tendon stretches the quadriceps.
2. Muscle spindles detect the stretch.
3. Sensory neurons carry the signal through the dorsal root.
4. They synapse directly on motor neurons in the ventral horn at the L3 to L4 level.
5. Motor neurons cause the quadriceps to contract, and the leg kicks.
At the same time, interneurons inhibit the opposing hamstring muscles, reciprocal inhibition. The withdrawal reflex from pain involves interneurons and is polysynaptic. Brain pathways can modify reflexes, which is why lesions above change them.

## Clinical examples
- Brown Sequard syndrome: damage to one half of the cord causes weakness and loss of position sense on the same side, but loss of pain and temperature on the opposite side, because these tracts cross at different levels.
- Complete transection causes loss of sensation and movement below the level, with bladder and bowel problems.
- Absent reflexes suggest lower motor neuron or sensory damage; brisk reflexes suggest upper motor neuron damage.

## Conclusion
The spinal cord relays sensation and movement between body and brain and mediates reflexes. The different crossing points of its tracts explain characteristic clinical patterns.`,
    keyPoints: ["31 pairs of spinal nerves", "Bell Magendie law", "Dorsal, ventral and lateral horns", "Dorsal columns cross in the medulla; spinothalamic crosses in the cord", "Corticospinal tract", "Knee jerk monosynaptic reflex at L3 to L4 and reciprocal inhibition", "Brown Sequard syndrome"],
    pitfalls: ["Saying all sensory tracts cross at the same level"],
    module: "brain/3-1",
    visuals: [fig("spinal-cord", "Grey and white matter: the spinal cord cut across"), fig("reflex-arc", "The reflex arc: the knee jerk")],
    ref: "Standard neuroanatomy; Bell 1811, Magendie 1822; Brown-Sequard 1850; brain module 3.1",
  },
  {
    id: "bio-l06-009",
    subject: S,
    topic: "neurons",
    marks: 10,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Describe the structure of a neuron and classify neurons by structure and function. Add a note on the neuron doctrine.",
    plan: ["The neuron doctrine", "Parts of a neuron", "Structural classification", "Functional classification", "Numbers and significance"],
    answer: `## The neuron doctrine
In the late nineteenth century, Camillo Golgi developed a silver staining method that showed individual nerve cells in full. Golgi believed the nervous system was a continuous network. Santiago Ramon y Cajal, using Golgi's stain, argued that it is made of separate cells, neurons, that communicate at specialised junctions. This neuron doctrine was later confirmed by the electron microscope, which showed the synaptic gap. Golgi and Cajal shared the Nobel Prize in 1906. Charles Sherrington named the junction the synapse.

## Parts of a neuron
1. Cell body, or soma: contains the nucleus and machinery for making proteins, including Nissl bodies.
2. Dendrites: branching processes that receive signals from other neurons, often covered with dendritic spines where synapses form.
3. Axon hillock: where the axon begins and where action potentials are usually triggered.
4. Axon: a single long process that carries action potentials away from the soma, sometimes over a metre long.
5. Myelin sheath: fatty insulation made by oligodendrocytes in the brain and Schwann cells in peripheral nerves, with gaps called nodes of Ranvier that allow rapid saltatory conduction.
6. Axon terminals: end in boutons containing vesicles of neurotransmitter that release onto the next cell.

## Structural classification
| Type | Structure | Example |
| Multipolar | Many dendrites, one axon | Motor neurons, pyramidal cells of the cortex |
| Bipolar | One dendrite and one axon | Retinal bipolar cells, olfactory neurons |
| Pseudounipolar | A single process that splits into two | Sensory neurons in dorsal root ganglia |
| Anaxonic | No clear axon | Some interneurons in the retina |

## Functional classification
- Sensory, or afferent, neurons carry information from receptors to the central nervous system.
- Motor, or efferent, neurons carry commands to muscles and glands.
- Interneurons connect neurons within the central nervous system and are the most numerous.
Neurons are also classified by transmitter, such as dopaminergic or GABAergic, and as excitatory or inhibitory.

## Numbers and significance
The human brain has about 86 billion neurons, as Suzana Herculano Houzel estimated in 2009, and roughly as many glial cells. Each neuron may form thousands of synapses. Most neurons do not divide after birth, though new neurons form in the hippocampus in some species, and its extent in adult humans is debated.

## Conclusion
The neuron, with dendrites receiving, the axon conducting and terminals transmitting, is the basic unit of the nervous system, as the neuron doctrine established.`,
    keyPoints: ["Golgi stain and Cajal's neuron doctrine, Nobel 1906", "Sherrington named the synapse", "Soma, dendrites, axon hillock, axon, myelin, terminals", "Oligodendrocytes and Schwann cells; nodes of Ranvier", "Multipolar, bipolar, pseudounipolar", "Sensory, motor, interneurons", "About 86 billion neurons"],
    pitfalls: ["Saying Golgi proposed the neuron doctrine"],
    module: "brain/1-2",
    visuals: [fig("neuron", "Parts of a neuron"), fig("neuron-types", "Structural classification: neuron shapes")],
    ref: "Cajal 1888 onwards; Golgi 1873; Nobel 1906; Sherrington 1897; Herculano-Houzel 2009; brain module 1.2 and 2.1",
  },
  {
    id: "bio-l06-010",
    subject: S,
    topic: "neurotransmitters",
    marks: 10,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "md-psychiatry", "ma-semester"],
    question: "Write a note on neuropeptides and endocannabinoids as chemical messengers, with reference to endogenous opioids and their clinical relevance.",
    plan: ["How neuropeptides differ", "Endogenous opioids", "Other neuropeptides", "Endocannabinoids", "Clinical relevance"],
    answer: `## How neuropeptides differ
Neuropeptides are short chains of amino acids used as messengers. Compared with classical small molecule transmitters such as glutamate or dopamine:
- They are made in the cell body from larger precursor proteins and transported down the axon, rather than made in the terminal.
- They are stored in large dense core vesicles and released mainly during high frequency firing.
- They are not taken back up but broken down by enzymes.
- They act mainly on G protein coupled receptors, producing slower, longer lasting effects, often modulating other transmitters.
- They are often released together with a classical transmitter.

## Endogenous opioids
Researchers knew that morphine binds specific receptors, discovered by Candace Pert and Solomon Snyder in 1973, and asked why the brain would have receptors for a plant drug. In 1975 John Hughes and Hans Kosterlitz identified enkephalins, the brain's own opioids. Three families:
| Peptide family | Main receptor | Roles |
| Endorphins, especially beta endorphin | Mu | Pain relief, reward, stress |
| Enkephalins | Delta | Pain modulation, emotion |
| Dynorphins | Kappa | Pain, dysphoria, stress |
They are released during stress, exercise and pain, and contribute to placebo analgesia, which can be blocked by naloxone, as Jon Levine and colleagues showed in 1978.

## Other neuropeptides
- Substance P: pain transmission and nausea.
- Neuropeptide Y: hunger and stress resilience.
- Corticotropin releasing hormone: drives the stress response.
- Oxytocin and vasopressin: social bonding and water balance.
- Orexin: wakefulness; its loss causes narcolepsy.

## Endocannabinoids
- Cannabis contains delta 9 tetrahydrocannabinol, THC, which acts on CB1 receptors, abundant in the hippocampus, basal ganglia, cerebellum and cortex, and CB2 receptors, mainly in immune cells.
- The brain's own cannabinoids are anandamide, identified by Raphael Mechoulam's group in 1992, and 2 arachidonoylglycerol.
- They are lipids made on demand from membranes, not stored in vesicles.
- They act as retrograde messengers: released by the postsynaptic neuron, they travel back to presynaptic CB1 receptors and reduce transmitter release.
- They regulate appetite, pain, memory, mood and stress.

## Clinical relevance
- Opioid drugs relieve pain but cause dependence and respiratory depression; naloxone reverses overdose; buprenorphine and methadone treat dependence; naltrexone reduces alcohol craving.
- Cannabis use, especially high THC strains in adolescence, is linked to increased risk of psychosis. Cannabidiol, another compound, is being studied as a possible antipsychotic.
- Rimonabant, a CB1 blocker for obesity, was withdrawn because it caused depression and suicidal thoughts, showing the role of endocannabinoids in mood.
- Orexin receptor antagonists, such as suvorexant, treat insomnia.

## Conclusion
Neuropeptides and endocannabinoids are slower, modulatory messengers. The discovery of endogenous opioids and cannabinoids explained how plant drugs act and opened new treatments.`,
    keyPoints: ["Differences of neuropeptides from classical transmitters", "Opioid receptors 1973 and enkephalins 1975", "Three opioid families and receptors", "Placebo analgesia blocked by naloxone", "Other peptides including orexin", "Anandamide 1992 and 2 AG; CB1 and CB2", "Retrograde signalling", "Clinical relevance: opioids, cannabis and psychosis, rimonabant"],
    pitfalls: ["Saying endocannabinoids are stored in vesicles"],
    module: "brain/2-5",
    visuals: [compare("How neuropeptides differ", ["Classical transmitters", ["Made in the terminal", "Small clear vesicles", "Reuptake or breakdown", "Fast effects"], "Fast signalling"], ["Neuropeptides", ["Made in the cell body", "Large dense core vesicles", "Enzymatic breakdown only", "Slow modulatory effects"], "Slow modulation"])],
    ref: "Pert and Snyder 1973; Hughes et al 1975; Levine, Gordon and Fields 1978; Devane et al 1992 anandamide; Di Forti et al 2019 cannabis psychosis; rimonabant withdrawal 2008; brain module 2.5",
  },
]);
