import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./frontiers-1";
import { part2 } from "./frontiers-2";
import { part3 } from "./frontiers-3";
import { part4 } from "./frontiers-4";

export const meta: ModuleMeta = {
  id: "frontiers",
  num: 32,
  title: "What's new in psychiatry",
  emoji: "🔭",
  tagline: "Psychedelics, new medicines, GLP-1, inflammation, genes, new diagnostic maps and AI, each with its honest status (as of November 2026)",
  when: "Open to all levels",
  outcomes: [
    "Explain how a new treatment moves from trial to approval, and read effect sizes, placebo response and blinding critically",
    "Give the honest, dated status of esketamine, MDMA, psilocybin, xanomeline-trospium, zuranolone and GLP-1 medicines",
    "Describe what is known about inflammation, genetics and pharmacogenomics, and which tests are actually useful",
    "Compare DSM categories with RDoC and HiTOP, and describe where diagnosis is heading",
    "Separate validated digital and AI tools from hype, and use psychokinesis research to judge extraordinary claims",
  ],
  writeTask:
    "On paper, from memory: the five status labels with one example each; the mechanism, status and two side effects of esketamine, xanomeline-trospium and zuranolone; the MDMA regulatory story in four dates; the six RDoC domains and five HiTOP spectra; and the six problems in the claims-vs-evidence toolkit with their fixes. Then check and correct in red.",
  activities: [
    act.lesson("ad-1", "Quiz: antidepressant classes and timing", "Old medicines, so you can see what is new."),
    act.lesson("ap-1", "Quiz: typical vs atypical", "Where a muscarinic antipsychotic fits."),
    act.coach("pharmacology", "Coach: pharmacology", "Mechanisms you mix up."),
    act.coach("neuroscience", "Coach: neuroscience", "Receptors, circuits and the immune system."),
  ],
};

export const text = part1 + part2 + part3 + part4;
