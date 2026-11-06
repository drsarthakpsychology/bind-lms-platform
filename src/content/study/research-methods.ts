import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./research-methods-1";
import { part2 } from "./research-methods-2";

export const meta: ModuleMeta = {
  id: "research-methods",
  num: 40,
  title: "Research methods",
  emoji: "🔬",
  tagline: "From a good question to a sound design: variables, sampling, validity, qualitative and mixed methods, ethics and writing",
  when: "Open to all levels",
  outcomes: [
    "Turn a vague idea into a researchable problem with operationally defined variables and testable hypotheses",
    "Choose and justify a sampling method, and explain sampling error, bias and what drives sample size",
    "Pick an experimental, quasi-experimental, single-case or non-experimental design for a question, and name its threats to validity",
    "Explain how grounded theory, IPA, thematic, discourse and narrative analysis differ, and judge qualitative rigour",
    "Apply Indian and international research ethics (ICMR 2017, Belmont, APA Standard 8, UGC plagiarism rules) to real dilemmas",
    "Structure an article or thesis in APA 7 style and critique a published claim, including extraordinary ones",
  ],
  writeTask:
    "On paper, from memory: the five kinds of variable with one example each; the eight Campbell and Stanley threats to internal validity; a table of four probability and four non-probability sampling methods; diagrams of the Solomon four-group, ABAB and multiple-baseline designs; Braun and Clarke's six phases; the three Belmont principles; and a design for this question: 'Does a peer-support group reduce exam anxiety in first-year students in Pune?' Name its two biggest threats and how you would control them. Then check and correct in red.",
  activities: [
    act.coach("assessment", "Coach: assessment", "Reliability, validity and measures you mix up."),
    act.coach("ethics", "Coach: ethics", "Consent, confidentiality and dilemmas."),
    act.lesson("cs-1", "Case files: clinic morning", "Spot the research question hiding in each case."),
  ],
};

export const text = part1 + part2;
