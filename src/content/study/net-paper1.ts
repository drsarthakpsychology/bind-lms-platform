import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./net-paper1-1";
import { part2 } from "./net-paper1-2";
import { part3 } from "./net-paper1-3";

export const meta: ModuleMeta = {
  id: "net-paper1",
  num: 51,
  title: "UGC NET Paper 1",
  emoji: "🧭",
  tagline: "All ten units: teaching and research aptitude, comprehension, communication, maths and logic (with Indian logic), data, ICT, environment and higher education",
  when: "Open to all levels",
  outcomes: [
    "Explain levels, methods and evaluation in teaching, with Bloom's revised taxonomy and Indian online initiatives",
    "Answer research-aptitude, comprehension and communication items quickly, using models and elimination",
    "Solve the standard Paper 1 numericals: percentages, ratios, averages, interest, work, speed, series, codes and relations",
    "Test syllogisms with Venn diagrams and the square of opposition, and explain the pramanas, the five-membered inference and the five hetvabhasas",
    "Read tables and charts to compute changes, shares and averages accurately under time pressure",
    "State current, dated facts on ICT, environment agreements and Indian laws, NEP 2020 and higher-education bodies, and know which ones to recheck",
  ],
  writeTask:
    "On paper, from memory: Bloom's revised six levels with a verb for each; the three levels of teaching with their proponents; Shannon and Weaver's model with noise; the A, E, I and O propositions with which terms each distributes; the six pramanas with the schools that accept 1, 2, 3, 4, 5 and 6; the five steps of the Nyaya inference using the hill and smoke; the five hetvabhasas with one example each; ten environment agreements with year and purpose; and NEP 2020's ten most-asked points. Then solve: a sum doubles in 8 years at simple interest; what is the rate? Check and correct in red.",
  activities: [
    act.coach("ethics", "Coach: ethics", "Research ethics and integrity items."),
    act.terms("Term match", "Pramanas, models, bodies and acronyms against their meanings."),
    act.lesson("cs-1", "Case files: clinic morning", "Read a case like a comprehension passage."),
  ],
};

export const text = part1 + part2 + part3;
