import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import * as p1 from "./brain-1";
import * as p2 from "./brain-2";
import * as p3 from "./brain-3";
import * as n4 from "./brain-4";
import * as n5 from "./brain-5";
import * as n6 from "./brain-6";
import * as n7 from "./brain-7";
import * as q11 from "./brain-11";

export const meta: ModuleMeta = {
  id: "brain",
  num: 2,
  title: "Brain and behaviour",
  emoji: "🧬",
  tagline: "From the neuron and synapse to circuits, genes, brain scans and how medicines act, explained from scratch",
  when: "Neuroscience foundations",
  outcomes: [
    "Explain in plain words how a neuron fires and how a synapse passes the message on",
    "Know the main transmitters and receptors, where they are made and which medicines act on them, and predict side effects from a receptor profile",
    "Link brain regions, frontal syndromes, aphasias and memory systems to what you see at the bedside",
    "Describe the stress system, sleep and the body clock, the endocrine glands, and the biology of hunger, thirst and sex",
    "Explain split-brain findings and behaviour-genetics methods (family, twin, adoption, ACE model), and basic pharmacokinetics including enzyme induction and drug monitoring",
    "Discuss signalling, circuits, plasticity, genetics, imaging, brain stimulation, autoimmune encephalitis and pharmacogenomics with the honest evidence as of Nov 2026",
  ],
  writeTask:
    "On paper, from memory: a labelled synapse with the five steps of transmission; a table of seven transmitters (where made, key receptors, medicines); the four dopamine pathways with the effect of D2 blockade in each; the three frontal syndromes and the aphasia table; the HPA axis and sleep stages; definitions of agonist, partial agonist, antagonist, half-life and steady state with one inducer and one inhibitor; the endocrine glands with their hormones; the hunger and fullness signals; the two kinds of thirst; the split-brain findings; Falconer's formula with the ACE model; and the red flags for autoimmune encephalitis. Then check and correct in red.",
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
  H("Part VI · Advanced: hormones, sleep, scans and the body"),
  p2.a6Imaging,
  p2.a6Body,
  p2.examZone,
  H("Part IX · Exam zone: Q&A bank"),
  p3.qaStarting,
  q11.qaStartingMore,
  p3.qaBeginner,
  q11.qaBeginnerMore,
  p3.qaAdvanced,
].join("\n");
