import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./motivation-emotion-1";
import { part2 } from "./motivation-emotion-2";

export const meta: ModuleMeta = {
  id: "motivation-emotion",
  num: 46,
  title: "Motivation, emotion and stress",
  emoji: "🔥",
  tagline: "Why we act, what we feel and how we cope: the classic theories, the brain, the evidence and Indian thought",
  when: "Open to all levels",
  outcomes: [
    "Compare instinct, drive, arousal, incentive, need and cognitive theories of motivation, with their evidence and critiques",
    "Explain achievement, affiliation and power motives, curiosity, sensation seeking, flow and self-regulation, including what failed to replicate",
    "Contrast the James-Lange, Cannon-Bard, two-factor, appraisal and facial feedback theories, and the debate on universality and rasa theory",
    "Describe the brain systems of emotion, from the Papez circuit to the amygdala, insula and prefrontal cortex",
    "Apply Selye, Lazarus and Folkman, coping styles, Types A to D, hardiness and allostatic load to real cases",
    "Choose and justify stress-management methods, from relaxation and biofeedback to stress inoculation and mindfulness",
  ],
  writeTask:
    "On paper, from memory: the six motivation theory families with one name each; Maslow's five levels and the ERG changes; the SDT continuum with an example for each rung; the five emotion theories as event-to-feeling sequences; the Papez circuit; Gross's five regulation families; the GAS stages and the Lazarus appraisal steps; Types A to D in one line each; and the three phases of stress inoculation. Then check and correct in red.",
  activities: [
    act.coach("neuroscience", "Coach: neuroscience", "Amygdala, hypothalamus and stress hormones."),
    act.coach("therapy", "Coach: therapies", "Relaxation, mindfulness and CBT techniques."),
    act.lesson("anx-1", "Quiz: anxiety disorders", "Where stress and fear become a disorder."),
    act.scenarios("substance", "Patient case: “I can stop anytime”", "Motivation and ambivalence in practice."),
  ],
};

export const text = part1 + part2;
