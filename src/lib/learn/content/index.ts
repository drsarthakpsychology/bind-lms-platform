import type { Item, Lesson, Unit } from "../types";
import { MSE, SIGNS } from "./foundations";
import { ANXIETY, MOOD, PSYCHOSIS } from "./disorders";
import { ANTIDEPRESSANTS, ANTIPSYCHOTICS, STABILISERS } from "./pharm";
import { DEFENCES, LIFESPAN, RISK_LAW } from "./more";
import { CASES } from "./cases";

/** The learning path, in teaching order. */
export const UNITS: Unit[] = [SIGNS, MSE, MOOD, ANXIETY, PSYCHOSIS, ANTIDEPRESSANTS, ANTIPSYCHOTICS, STABILISERS, DEFENCES, LIFESPAN, RISK_LAW, CASES];

export const ALL_LESSONS: (Lesson & { unitId: string })[] = UNITS.flatMap((u) => u.lessons.map((l) => ({ ...l, unitId: u.id })));
export const ALL_ITEMS: Item[] = ALL_LESSONS.flatMap((l) => l.items);

export function findLesson(id: string) {
  const lesson = ALL_LESSONS.find((l) => l.id === id);
  if (!lesson) return null;
  const unit = UNITS.find((u) => u.id === lesson.unitId)!;
  return { lesson, unit };
}

export function findItem(id: string): Item | undefined {
  return ALL_ITEMS.find((i) => i.id === id);
}

/** Items that work as a 1-tap true/false or 4-option quick question (for the 60-second blitz). */
export const BLITZ_ITEMS = ALL_ITEMS.filter((i) => i.kind === "tf" || i.kind === "mcq");
