import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./sensation-perception-1";
import { part2 } from "./sensation-perception-2";
import { part3 } from "./sensation-perception-3";

export const meta: ModuleMeta = {
  id: "sensation-perception",
  num: 43,
  title: "Sensation, attention and perception",
  emoji: "👁️",
  tagline: "From thresholds and signal detection to attention models, Gestalt, depth, colour, culture and the clinic",
  when: "Cognitive psychology · open to all levels",
  outcomes: [
    "Explain thresholds, Weber's, Fechner's and Stevens' laws, and calculate a Weber fraction",
    "Apply signal detection theory: the four outcomes, d prime, the criterion and the ROC curve",
    "Describe how vision, colour, hearing, the chemical senses and pain are coded, with the competing theories",
    "Compare Broadbent, Treisman, Deutsch and Deutsch, Kahneman, Lavie and feature integration theory with their key experiments",
    "Explain Gestalt organisation, pattern recognition, depth cues, constancies, movement and illusions",
    "Critically compare Gibson and Gregory, and weigh evidence on culture, motivation and perceptual defence",
    "Recognise neglect, agnosia, blindsight, Charles Bonnet syndrome and attentional findings in psychiatric disorders",
  ],
  writeTask:
    "On paper, from memory: the three classical psychophysical methods with one weakness each; Weber's, Fechner's and Stevens' laws with two exponents; the signal detection 2 by 2 table and how to calculate d prime; trichromatic versus opponent-process theory; place, frequency and volley theories; a labelled diagram of Broadbent's and Treisman's models; ten depth cues sorted monocular and binocular; and a Gibson versus Gregory comparison table. Then check and correct in red.",
  activities: [
    act.coach("psychopathology", "Coach: psychology terms", "The perception and attention terms you mix up."),
    act.coach("neuroscience", "Coach: neuroscience", "Visual streams, lobes and pathways."),
    act.lesson("signs-2", "Quiz: perception and belief", "Illusions and hallucinations in the clinic."),
  ],
};

export const text = part1 + part2 + part3;
