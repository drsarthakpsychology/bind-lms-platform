import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./suicide-1";
import { part2 } from "./suicide-2";
import { part3 } from "./suicide-3";

export const meta: ModuleMeta = {
  id: "suicide",
  num: 16,
  title: "Suicide, self-harm and risk",
  emoji: "🛟",
  tagline: "From myths and warning signs to assessment, formulation and safety planning, to why prediction fails, what treatments work and India's law and policy",
  when: "Suicide and risk",
  outcomes: [
    "Ask about suicide directly and compassionately",
    "Assess ideation, intent, plan, preparation, history, and risk and protective factors",
    "Explain why risk assessment informs care rather than predicts suicide",
    "Make a collaborative safety plan, including means safety",
    "Know the Indian legal position (MHCA section 115, the Bharatiya Nyaya Sanhita) and safe messaging",
    "Explain the base-rate problem, the mechanisms of suicidal behaviour and the evidence for suicide-specific treatments and national policy",
  ],
  writeTask:
    "On paper, from memory: the five things to establish about suicidal thinking, ten risk factors and five protective factors, the six steps of a safety plan, three myths with corrections, and the Mental Healthcare Act position on attempted suicide. Then check and correct in red.",
  activities: [
    act.lesson("rk-1", "Quiz: suicide risk", "Assessment and myths."),
    act.lesson("rk-2", "Quiz: Mental Healthcare Act 2017", "The legal protections."),
    act.coach("counselling", "Coach: counselling", "Crisis conversations."),
    act.scenarios("depression", "Patient case: “Kya fayda jeene ka?”", "Asking directly when a patient hints at hopelessness."),
  ],
  noteId: "suicide",
};

export const text = part1 + part2 + part3;
