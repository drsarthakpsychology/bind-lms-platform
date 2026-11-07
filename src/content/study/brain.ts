import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import * as p1 from "./brain-1";
import * as p2 from "./brain-2";
import * as p3 from "./brain-3";
import * as n4 from "./brain-4";
import * as n5 from "./brain-5";
import * as n6 from "./brain-6";
import * as n7 from "./brain-7";
import * as n8 from "./brain-8";
import * as n9 from "./brain-9";
import * as n10 from "./brain-10";
import * as q11 from "./brain-11";

export const meta: ModuleMeta = {
  id: "brain",
  num: 2,
  title: "Brain and behaviour",
  emoji: "🧬",
  tagline: "From the neuron and synapse to brain maps, hormones, sleep, genes, scans and the biology of each major disorder, explained from scratch up to PG and MD exam depth",
  when: "Neuroscience foundations",
  outcomes: [
    "Explain in plain words how the nervous system is built, how a neuron fires and how a synapse passes the message on",
    "Explain the ionic basis of resting and action potentials (Nernst and Goldman, refractory periods, conduction) and the vesicle cycle, with the toxins and diseases that break each step",
    "Describe each transmitter system (glutamate, GABA, glycine, acetylcholine, dopamine, noradrenaline, serotonin, histamine, neuropeptides, endocannabinoids, orexin): synthesis, sources, receptors, inactivation and clinical links",
    "Localise from the bedside using spinal tracts, cranial nerves, brainstem, cerebellum, basal ganglia circuits, thalamus, hypothalamic nuclei, the limbic system, Brodmann areas and arterial territories",
    "Describe the HPA, HPT and HPG axes, prolactin, growth hormone, melatonin, oxytocin and vasopressin, and interpret the dexamethasone suppression and TRH stimulation tests",
    "Explain sleep regulation, EEG rhythms, evoked potentials, neuroimaging methods and psychophysiology, with the findings in each major disorder",
    "Discuss development, plasticity, genetics and epigenetics, neuroinflammation and the gut-brain axis, and the biological theories of schizophrenia, mood, anxiety, OCD, PTSD, addiction and dementia, with the honest evidence as of Nov 2026",
  ],
  writeTask:
    "On paper, from memory: the action potential with the ion moving at each phase and the two refractory periods; a labelled synapse with the vesicle cycle and one toxin per step; a table of the transmitter systems (precursor, rate-limiting enzyme, source nucleus, receptors, breakdown product, medicines); the four dopamine pathways with the effect of D2 blockade; the three long spinal tracts with their crossing points and the twelve cranial nerves; the direct and indirect basal ganglia pathways; Papez's circuit and the hypothalamic nuclei; the Brodmann areas for movement, sensation, vision, hearing and language; the arterial stroke syndromes; the HPA, HPT and HPG axes with the DST and TRH test protocols; the sleep stages with their EEG and the two-process model; Gottesman's risk figures; and one integrated biological model each for schizophrenia, depression and addiction. Then check and correct in red.",
  activities: [
    act.coach("neuroscience", "Coach: neuroscience", "Transmitters, regions and pathways."),
    act.coach("pharmacology", "Coach: pharmacology", "How medicines act."),
    act.detective("Clinic detective", "Medicines and disorders from clues."),
  ],
  noteId: "neuroscience",
};

const H = (title: string) => "\n# " + title + "\n";

/**
 * The module in reading order. Parts I to IV are Starting and Beginner,
 * Parts V to VII Advanced, then the exam zone and the Q&A bank.
 */
export const text = [
  H("Part I · Starting: the brain in plain words"),
  p1.s1Intro,
  n4.startBuilt,
  p1.s1Check,
  H("Part II · Beginner: signals, transmitters and medicines"),
  n5.begSignals,
  p1.b2Overview,
  n5.begTransmitters,
  p1.b2Dopamine,
  p1.b2Meds,
  H("Part III · Beginner: the map of the brain"),
  n6.begAnatomyLow,
  n6.begAnatomyMid,
  p1.b3Lobes,
  n6.begVessels,
  p1.b3Memory,
  H("Part IV · Beginner: stress, sleep, hormones and genes"),
  p1.b4Stress,
  p1.b4Hormones,
  n7.begAxes,
  n7.begSleep,
  p1.b4Hemispheres,
  p1.b4Check,
  H("Part V · Advanced: signalling, circuits, plasticity and genes"),
  p2.a5Signalling,
  p2.a5Circuits,
  p2.a5Plasticity,
  n8.advDevelopment,
  n8.advPlasticity,
  n8.advGenetics,
  H("Part VI · Advanced: hormones, sleep, scans and the body"),
  n9.advEndocrine,
  n9.advSleep,
  p2.a6Imaging,
  n9.advImaging,
  p2.a6Body,
  n9.advImmune,
  H("Part VII · Advanced: biological theories of the major disorders"),
  n10.advTheories,
  p2.examZone,
  H("Part IX · Exam zone: Q&A bank"),
  p3.qaStarting,
  q11.qaStartingMore,
  p3.qaBeginner,
  q11.qaBeginnerMore,
  p3.qaAdvanced,
  q11.qaAdvancedMore,
].join("\n");
