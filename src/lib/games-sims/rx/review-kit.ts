/**
 * Prescription checks: a real-looking prescription for a described patient.
 * The student spots the one problem (an interaction, a dose wrong for age or
 * kidneys, pregnancy, missing monitoring, a combination brand hiding a second
 * medicine). The three wrong options are each checked to be false here.
 */
import { PHARM_EXAMS, type ItemTags, type Level } from "../item-tags";
import type { Topic } from "./drugs";

export type Review = {
  id: string;
  /** Patient, age, place. */
  who: string;
  /** What the prescriber knows about them. */
  story: string;
  /** The prescription, line by line, as written. */
  rx: string[];
  answer: string;
  wrong: [string, string, string];
  why: string;
  /** Why each wrong option is wrong, by content. */
  not: string;
  /** Medicine ids (or names) for "Learn this". */
  drugs: string[];
  topic: Topic;
  tags: ItemTags;
};

export function R(id: string, who: string, story: string, rx: string[], answer: string, wrong: [string, string, string], why: string, not: string, drugs: string[], topic: Topic, level: Level, focus: string, objective: string): Review {
  return { id, who, story, rx, answer, wrong, why, not, drugs, topic, tags: { topic: `Prescription check: ${focus}`, level, objective, exams: PHARM_EXAMS, learn: topic } };
}
