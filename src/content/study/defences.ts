import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { part1 } from "./defences-1";
import { part2 } from "./defences-2";
import { part3 } from "./defences-3";

export const meta: ModuleMeta = {
  id: "defences",
  num: 3,
  title: "Mind, development and defence mechanisms",
  emoji: "🛡️",
  tagline: "Defences from everyday to psychotic, Freud to Erikson, Piaget and Vygotsky, learning theory, moral and adult development, grief, and how to work with defences",
  when: "Mind and development",
  outcomes: [
    "Explain in plain words what a defence is, and name and give an example of the everyday defences",
    "Classify defences by Vaillant's four levels, tell look-alike defences apart and link defence clusters to clinical patterns",
    "Describe and critique Freud, Erikson, Marcia, Piaget, Vygotsky, Kohlberg, Mahler and temperament research, with Indian perspectives",
    "Apply classical, operant and social learning theory and learned helplessness to real behaviour",
    "Distinguish normal grief from prolonged grief disorder and attachment patterns from attachment disorders",
    "Work with defences in therapy and teams, knowing when to support and when to explore",
  ],
  writeTask:
    "On paper, from memory: Vaillant's four levels with three defences each, a one-line definition and an Indian example; five look-alike pairs with the separating question; Erikson's eight stages with virtues; Marcia's four statuses; Piaget's four stages with two achievements and one limit each; Kohlberg's six stages; the four reinforcement types and four schedules; Worden's tasks and the dual process model; and the time rules for prolonged grief disorder. Then check and correct in red.",
  activities: [
    act.lesson("df-1", "Quiz: defence mechanisms", "Name the defence from the example."),
    act.coach("psychopathology", "Coach: psychology terms", "The terms you mix up."),
    act.coach("counselling", "Coach: counselling", "Using these ideas in sessions."),
  ],
  noteId: "defences",
};

export const text = part1 + part2 + part3;
