import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./brain-1";
import { part2 } from "./brain-2";

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

export const text = part1 + part2;
