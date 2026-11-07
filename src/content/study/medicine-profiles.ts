import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./medicine-profiles-1";
import { part2 } from "./medicine-profiles-2";
import { part3 } from "./medicine-profiles-3";
import { part4 } from "./medicine-profiles-4";

export const meta: ModuleMeta = {
  id: "medicine-profiles",
  num: 23,
  title: "Medicines one by one",
  emoji: "💊",
  tagline: "One-stop profiles of every common psychiatric medicine: how it works at the receptor, how the body handles it, what to watch, and what is new",
  when: "Psychopharmacology",
  outcomes: [
    "Explain in plain words how psychiatric medicines act on receptors, transporters, enzymes and ion channels, and how the body handles them",
    "Predict side effects from receptor profiles (H1, M1, alpha-1, D2, 5-HT2C) and explain them to patients",
    "Give a receptor-level and clinical profile of each common antidepressant, antipsychotic, mood stabiliser and anxiolytic, with Indian brands",
    "Use occupancy, half-life, enzyme and genetic principles to choose doses and predict interactions",
    "Recognise and manage serotonin toxicity, NMS, anticholinergic toxicity, lithium toxicity, QT risk and severe skin reactions",
    "Weigh medicines in pregnancy, older age and organ disease, and explain new agents honestly as of Nov 2026",
  ],
  writeTask:
    "On paper, from memory: the four drug target types; the side-effect map by receptor; the four dopamine pathways with the effect of D2 blockade; one distinctive point for each SSRI; the clozapine safety checklist; the lithium triggers and toxicity signs; the CYP table (1A2, 2D6, 3A4, 2C19) with one inhibitor and one inducer each; a serotonin toxicity versus NMS versus anticholinergic table; and the mechanisms of esketamine and xanomeline-trospium. Then check and correct in red.",
  activities: [
    act.detective("Clinic detective", "Guess the medicine from its clues."),
    act.lesson("ms-1", "Quiz: lithium", "Levels, toxicity and monitoring."),
    act.coach("pharmacology", "Coach: medicines", "Chai repeats the ones you mix up."),
  ],
};

export const text = part1 + part2 + part3 + part4;
