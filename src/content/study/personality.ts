import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./personality-1";
import { part2, test } from "./personality-2";
import { qa } from "./personality-qa";

export const meta: ModuleMeta = {
  id: "personality",
  num: 14,
  title: "Personality disorders",
  emoji: "🎭",
  tagline: "What personality is, all ten disorders, the dimensional ICD-11 and AMPD models, DBT, mentalisation and the evidence",
  when: "Personality disorders",
  outcomes: [
    "Explain in plain words what personality is, when traits become a disorder, and why the labels need care",
    "State the general criteria and describe all ten personality disorders by cluster, with the full borderline and antisocial criteria",
    "Assess personality well: separate state from trait, use collateral history and structured tools, and rule out look-alikes",
    "Describe the dimensional models: ICD-11 severity and trait domains, and the DSM-5-TR alternative model",
    "Explain DBT, mentalisation-based treatment and the other structured therapies, and use medicines safely and sparingly",
    "Plan crisis care, team support and culturally sensitive assessment in Indian settings",
  ],
  writeTask:
    "On paper, from memory: the six general criteria; the ten disorders by cluster with one defining line each; the nine borderline criteria; the antisocial age rules and the PCL-R factors; the five ICD-11 trait domains and the severity levels; the five AMPD domains and the four LPFS areas; the four DBT modes, four skill modules and the target hierarchy; the three pre-mentalising modes; and a crisis plan for a patient you invent. Then check and correct in red.",
  activities: [
    act.lesson("df-2", "Quiz: personality disorders", "Clusters and key features."),
    act.lesson("df-1", "Quiz: defence mechanisms", "Splitting, projection and friends."),
    act.coach("counselling", "Coach: counselling", "Working with difficult moments."),
    act.coach("disorders", "Coach: disorders", "The diagnoses you mix up."),
  ],
  noteId: "personality",
};

export const text = part1 + part2 + qa + test;
