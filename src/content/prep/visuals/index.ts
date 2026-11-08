import type { PrepQuestion, PrepVisual } from "@/lib/prep/types";
import { ASSIGNED } from "./assigned";
import { BIO } from "./bio";
import { CLINICAL } from "./clinical";
import { FIGS } from "./figures";
import type { Concept } from "./kit";
import { MIND } from "./mind";
import { MISC } from "./misc";
import { PEOPLE } from "./people";
import { PHARM } from "./pharm";
import { QUANT } from "./quant";

/** Every shared Exam Prep diagram. Add new ones in the subject files. */
export const CONCEPTS: Concept[] = [...BIO, ...PHARM, ...MIND, ...PEOPLE, ...CLINICAL, ...QUANT, ...MISC, ...FIGS];

const BY_ID: ReadonlyMap<string, PrepVisual> = new Map(CONCEPTS.map((c) => [c.id, c.v]));

/** The diagram attached to one question id, if any. */
export function visualFor(id: string): PrepVisual | undefined {
  const c = ASSIGNED[id];
  return c ? BY_ID.get(c) : undefined;
}

/** Attach each question's diagram (a visual written on the question itself wins). */
export function withVisuals(qs: PrepQuestion[]): PrepQuestion[] {
  return qs.map((q) => {
    if (q.visual) return q;
    const v = visualFor(q.id);
    return v ? { ...q, visual: v } : q;
  });
}
