import type { PrepExam, PrepQuestion } from "@/lib/prep/types";

/** Biological · part 7: easy foundation items (neuron parts, synapse, brain regions, lateralisation, twins, EEG) that open each topic. */

const C: PrepExam = "cuet-pg";
const S: PrepExam = "ma-semester";

const b = (q: Omit<PrepQuestion, "subject">): PrepQuestion => ({ subject: "biological", module: "brain", ...q });

export const QUESTIONS: PrepQuestion[] = [
  b({
    id: "bio-neuron-0306",
    topic: "neurons-action-potential",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "Which part of a typical neuron receives most of the incoming signals from other neurons?",
    options: ["Dendrites", "Axon terminals", "Myelin sheath", "Axon hillock"],
    answer: 0,
    explanation:
      "Dendrites are the branching extensions of the cell body. They are covered with receptors where other neurons' axon terminals form synapses, so they collect most incoming signals. Axon terminals are at the other end of the neuron; they release neurotransmitter onto the next cell, so they send signals rather than receive them. The myelin sheath is a fatty wrapping around the axon that speeds conduction; it receives nothing. The axon hillock is where incoming signals are summed and where the action potential usually starts, but the signals arrive mainly through the dendrites and cell body first.",
    ref: "Carlson, ch. 2",
  }),
  b({
    id: "bio-neuron-0307",
    topic: "neurons-action-potential",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "The main job of the myelin sheath around many axons is to:",
    options: [
      "Speed up the conduction of action potentials along the axon",
      "Produce neurotransmitters for release at the synapse",
      "Receive signals from neighbouring neurons",
      "Supply the neuron with blood and oxygen",
    ],
    answer: 0,
    explanation:
      "Myelin is a fatty insulating layer made by oligodendrocytes in the brain and spinal cord and by Schwann cells in peripheral nerves. It forces the impulse to jump from one gap in the sheath (node of Ranvier) to the next, called saltatory conduction, which makes conduction much faster and saves energy. Neurotransmitters are made in the neuron itself, in the cell body or axon terminals, not in myelin. Receiving signals is mainly the job of dendrites. Blood supply comes through capillaries, and nutrients are passed on partly by astrocytes, not by myelin. Diseases that strip myelin, such as multiple sclerosis, slow or block conduction.",
    ref: "Kalat, ch. 2",
  }),
  b({
    id: "bio-neuron-0308",
    topic: "neurotransmitters-receptors",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "The tiny gap between the axon terminal of one neuron and the membrane of the next cell, across which neurotransmitter travels, is called the:",
    options: ["Node of Ranvier", "Axon hillock", "Synaptic cleft", "Blood-brain barrier"],
    answer: 2,
    explanation:
      "At a chemical synapse the presynaptic terminal releases neurotransmitter into a gap about 20 to 40 nanometres wide, the synaptic cleft. The molecules cross it and bind receptors on the postsynaptic membrane. A node of Ranvier is a gap in the myelin along an axon, not between two cells. The axon hillock is the region where the axon leaves the cell body. The blood-brain barrier is the tight lining of brain capillaries that limits what enters the brain from the blood; it has nothing to do with communication between neurons.",
    ref: "Carlson, ch. 2",
  }),
  b({
    id: "bio-anat-0309",
    topic: "neuroanatomy",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "Which brain structure plays the central role in regulating hunger, thirst, body temperature and the release of hormones from the pituitary gland?",
    options: ["Hypothalamus", "Cerebellum", "Occipital lobe", "Corpus callosum"],
    answer: 0,
    explanation:
      "The hypothalamus is a small region below the thalamus that keeps the body's internal state stable (homeostasis). Its nuclei regulate feeding, drinking, temperature, sleep and sexual behaviour, and it controls the pituitary through releasing hormones and direct neural links. The cerebellum coordinates movement, balance and motor learning. The occipital lobe processes vision. The corpus callosum is a bundle of fibres that connects the two hemispheres and does not regulate drives or hormones.",
    ref: "Kalat, ch. 4",
  }),
  b({
    id: "bio-anat-0310",
    topic: "neuroanatomy",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "The primary visual cortex, which first receives visual information from the thalamus, is located in the:",
    options: ["Frontal lobe", "Temporal lobe", "Occipital lobe", "Parietal lobe"],
    answer: 2,
    explanation:
      "Visual signals travel from the retina to the lateral geniculate nucleus of the thalamus and then to the primary visual cortex (V1) at the back of the brain, in the occipital lobe. Damage there causes blindness in part of the visual field. The frontal lobe deals with planning, movement and executive control, and contains the primary motor cortex. The temporal lobe contains the primary auditory cortex and is involved in memory and object recognition. The parietal lobe contains the primary somatosensory cortex and handles spatial attention.",
    ref: "Kalat, ch. 4",
  }),
  b({
    id: "bio-lat-0311",
    topic: "lateralisation",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "In about 95 percent of right-handed people, language is processed mainly in the:",
    options: [
      "Left hemisphere",
      "Right hemisphere",
      "Both hemispheres equally",
      "Cerebellum rather than the cerebral cortex",
    ],
    answer: 0,
    explanation:
      "Studies of stroke patients and Wada tests show that the left hemisphere is dominant for language in roughly 95 percent of right-handers, which is why damage to Broca's or Wernicke's area on the left causes aphasia. The right hemisphere contributes to the emotional tone (prosody) of speech and to understanding jokes and metaphors, but it is not the main language hemisphere for most people. Equal representation in both hemispheres is found in only a small minority, more often among left-handers. The cerebellum helps with timing and fluency of articulation but does not carry out language processing itself.",
    ref: "Kolb & Whishaw, ch. 11",
  }),
  b({
    id: "bio-gen-0312",
    topic: "behaviour-genetics",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "On average, fraternal (dizygotic) twins share about what proportion of the genes that vary between people?",
    options: ["About 50 percent", "About 100 percent", "About 25 percent", "About 10 percent"],
    answer: 0,
    explanation:
      "Fraternal twins come from two separate eggs fertilised by two sperm, so genetically they are like ordinary brothers and sisters and share on average half of their segregating genes. Identical (monozygotic) twins come from one fertilised egg that splits, so they share nearly 100 percent. About 25 percent is the average for half-siblings or for a grandparent and grandchild. About 10 percent does not match any standard relationship in twin designs. Comparing how much more alike identical twins are than fraternal twins is the basis for estimating heritability.",
    ref: "Plomin et al., Behavioral Genetics, ch. 5",
  }),
  b({
    id: "bio-img-0313",
    topic: "neuroimaging",
    exams: [C, S],
    difficulty: 1,
    type: "mcq",
    stem: "Which technique records the brain's electrical activity through electrodes placed on the scalp?",
    options: [
      "Computed tomography (CT)",
      "Positron emission tomography (PET)",
      "Electroencephalography (EEG)",
      "Structural magnetic resonance imaging (MRI)",
    ],
    answer: 2,
    explanation:
      "EEG uses scalp electrodes to pick up the summed electrical activity of large groups of cortical neurons. It shows changes from one millisecond to the next, which makes it useful for sleep staging, epilepsy and event-related potentials, though it locates sources poorly. CT builds images of brain structure from X-rays. PET measures metabolism or receptor binding by detecting radioactive tracers. Structural MRI uses strong magnetic fields and radio waves to image anatomy. None of these three records electrical activity.",
    ref: "Carlson, ch. 5",
  }),
];
