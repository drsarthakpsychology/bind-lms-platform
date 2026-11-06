import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./social-1";
import { exam, part2 } from "./social-2";
import { qa } from "./social-qa";

export const meta: ModuleMeta = {
  id: "social",
  num: 42,
  title: "Social psychology",
  emoji: "👥",
  tagline: "How other people shape what we think, feel and do: from attribution and attitudes to obedience, prejudice, helping and harm",
  when: "Open to all levels",
  outcomes: [
    "Explain the scope, history and methods of social psychology, including the replication crisis and what survived it",
    "Use attribution theories (Heider, Jones and Davis, Kelley, Weiner) and name the main attribution errors, with cultural evidence from India",
    "Describe how attitudes form, how they are measured (Thurstone, Likert, Guttman, semantic differential, implicit measures) and how they change (dissonance, ELM, inoculation)",
    "Predict and explain the results of the classic studies of conformity, compliance and obedience, with their critiques",
    "Explain group processes (facilitation, loafing, polarisation, groupthink, deindividuation) and the main theories of leadership, including the nurturant-task leader",
    "Compare theories of prejudice and intergroup conflict, and the evidence on what reduces it, including Indian field experiments",
    "Apply theories of helping and aggression, and the applied areas of environment, crowding, personal space, law and peace",
  ],
  writeTask:
    "On paper, from memory: Kelley's three kinds of information and the two patterns that give an internal or external attribution; Weiner's three dimensions with an exam-failure example; four attitude scales with one line on how each is built; the results of Asch, Milgram and Festinger and Carlsmith with one critique each; the eight symptoms of groupthink; Allport's four conditions for contact; Latané and Darley's five steps to helping; and Hall's four distance zones. Then check and correct in red.",
  activities: [
    act.coach("ethics", "Coach: ethics", "Deception, debriefing and consent in the classic studies."),
    act.coach("counselling", "Coach: counselling", "Using influence and persuasion ethically with clients."),
    act.lesson("cs-1", "Case files: clinic morning", "Spot attribution errors in how people explain a patient."),
  ],
};

export const text = part1 + part2 + qa + exam;
