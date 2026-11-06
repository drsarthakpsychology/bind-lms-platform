import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./applied-1";
import { part2 } from "./applied-2";

export const meta: ModuleMeta = {
  id: "applied",
  num: 50,
  title: "Applied and emerging areas",
  emoji: "🧭",
  tagline: "Psychology at work in health, organisations, communities, courts, sport, the environment, the digital world and AI, with Indian examples and dated facts",
  when: "Open to all levels",
  outcomes: [
    "Apply health behaviour models, psychoneuroimmunology and adherence research to real health problems in India",
    "Explain wellbeing, character strengths, resilience and post-traumatic growth, and critique positive psychology fairly",
    "Use theories of work motivation, leadership, culture, HRD and OD, including Indian work culture",
    "Describe community, cultural and peace psychology, and the psychology of gender, poverty, disability, migration and stigma",
    "Explain the core ideas and Indian legal context of environmental, forensic, sports and cyberpsychology",
    "Judge the uses, evidence and risks of AI in psychology, as at November 2026, and map the common university electives",
  ],
  writeTask:
    "On paper, from memory: the HBM, TPB and TTM with one Indian example each; PERMA and the six VIA virtues; the five PTG domains; Herzberg's two factor sets and the five core job characteristics; Schein's three levels and Lewin's three steps; Caplan's three levels of prevention and Berry's four strategies; Galtung's three forms of violence; three eyewitness safeguards and the Selvi judgment; the catastrophe model in one sketch; five parental mediation strategies; and six principles for using AI. Then check and correct in red.",
  activities: [
    act.coach("counselling", "Coach: counselling", "Applied skills for tricky moments."),
    act.coach("law", "Coach: law", "Indian law that applied psychologists meet."),
    act.coach("ethics", "Coach: ethics", "Dual roles, consent and confidentiality."),
    act.scenarios("substance", "Patient case: “I can stop anytime”", "Health behaviour change in practice."),
  ],
};

export const text = part1 + part2;
