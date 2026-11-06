import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./assessment-1";
import { part2 } from "./assessment-2";

export const meta: ModuleMeta = {
  id: "assessment",
  num: 4,
  title: "Psychological assessment and testing",
  emoji: "📏",
  tagline: "Reliability, validity and norms with the calculations; IQ, personality, projective, neuropsychological and rating scales including the Indian tests; test construction, item analysis and IRT; adaptation, interpretation and the report",
  when: "Psychological assessment",
  outcomes: [
    "Explain reliability, validity, norms and standard scores in plain words, and calculate SEM, Spearman-Brown, z and T scores, sensitivity, specificity and predictive values",
    "Describe the Wechsler scales, Binet-Kamat, MISIC, Bhatia, Raven and VSMS, and use IQ with adaptive functioning correctly",
    "Describe and evaluate the MMPI, 16PF, NEO, Rorschach and TAT, including validity scales and the evidence debate",
    "Choose and read the main rating scales (HAM-D, MADRS, BDI-II, PHQ-9, BPRS, PANSS, YMRS, Y-BOCS) and the Indian neuropsychological batteries (PGI-BBD, NIMHANS, AIIMS)",
    "Build a test step by step with item analysis and item response theory, and adapt it fairly for Indian languages and groups",
    "Interpret results with effort testing and base rates, write a clear psychological report, and test ethically under Indian law",
  ],
  writeTask:
    "On paper, from memory: five types of reliability and five of validity with one line and one example each; the formulas for z, T, IQ, SEM and Spearman-Brown with a worked example each; a 2 by 2 table with sensitivity, specificity, PPV and NPV; the WAIS-IV indices; the authors of Binet-Kamat, MISIC, PGI-BBD and the Indian TAT; the MMPI validity scales; PANSS and Y-BOCS structure and ranges; the ten steps of test construction with the difficulty and discrimination indices and the IRT a, b and c parameters; and the headings of an assessment report. Then check and correct in red.",
  activities: [
    act.coach("assessment", "Coach: assessment", "Tests and scales you confuse."),
    act.lesson("mse-2", "Quiz: describe it right", "Observation and description skills."),
    act.coach("ethics", "Coach: ethics", "Ethics of testing."),
  ],
  noteId: "assessment",
};

export const text = part1 + part2;
