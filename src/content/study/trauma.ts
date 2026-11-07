import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./trauma-1";
import { part2 } from "./trauma-2";
import { part3 } from "./trauma-3";

export const meta: ModuleMeta = {
  id: "trauma",
  num: 19,
  title: "Trauma and stressor-related disorders",
  emoji: "🌊",
  tagline: "From the freeze response to PTSD criteria, first aid and trauma-focused therapy, to neurobiology, ICD-11 and the MDMA debate",
  when: "Trauma and stressor-related disorders",
  outcomes: [
    "Define a traumatic event and apply the PTSD criteria with its four symptom clusters",
    "Distinguish acute stress disorder, PTSD, adjustment disorder and prolonged grief by timing",
    "Describe complex PTSD and the childhood attachment disorders",
    "Explain fear conditioning and why avoidance keeps PTSD going",
    "Give psychological first aid and plan trauma-focused treatment",
    "Explain the neurobiology and memory models of PTSD, compare DSM-5-TR and ICD-11 (including complex PTSD and prolonged grief), and weigh new treatments honestly",
  ],
  writeTask:
    "On paper, from memory: criterion A for trauma, the four PTSD clusters with how many symptoms each needs, the timing rules for acute stress disorder, PTSD, adjustment disorder and prolonged grief, the three extra features of complex PTSD, and the steps of psychological first aid. Then check and correct in red.",
  activities: [
    act.lesson("anx-2", "Quiz: OCD and PTSD", "Criteria and treatment."),
    act.scenarios("ptsd", "Patient case: after the accident", "What to ask, and what not to push."),
    act.coach("therapy", "Coach: therapies", "Trauma-focused therapies."),
  ],
  noteId: "ptsd",
};

export const text = part1 + part2 + part3;
