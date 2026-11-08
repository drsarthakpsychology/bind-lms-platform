/**
 * FORMULATION LIBRARY: hand-written 5 Ps cases (the 500 plan).
 *
 * Authored compactly by bucket, then expanded by `buildFormulation` into the
 * Formulation Forge shape. The cards are mixed in a fixed, seeded order so
 * the bucket grouping never gives the answer away, and the order is stable
 * across builds (ids never change).
 */

import type { FormulationFactor } from "@/lib/practice/formulation";
import type { Exam, Level } from "@/lib/sim/library/types";

export interface FormulationTags {
  topic: string;
  difficulty: Level;
  objective: string;
  exams: Exam[];
  /** Study module id for "Learn this" */
  module: string;
  /** the working diagnosis the model formulation reaches */
  diagnosis: string;
}

export interface LibFormulation {
  id: string;
  title: string;
  hint: string;
  lv: Level;
  topic: string;
  mod: string;
  ex: Exam[];
  obj: string;
  dx: string;
  pres: string[];
  pred: string[];
  prec: string[];
  perp: string[];
  prot: string[];
  dist: string[];
  model: string;
}

export const PROMPT = "Sort the factors into the 5P grid. Leave distractors out.";

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Seeded Fisher-Yates: same id, same order, every build. */
function seededShuffle<T>(xs: T[], seed: string): T[] {
  const out = [...xs];
  let s = hash(seed) || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildFormulation(a: LibFormulation) {
  const raw: Array<Omit<FormulationFactor, "id">> = [
    ...a.pres.map((text) => ({ text, bucket: "presenting" as const })),
    ...a.pred.map((text) => ({ text, bucket: "predisposing" as const })),
    ...a.prec.map((text) => ({ text, bucket: "precipitating" as const })),
    ...a.perp.map((text) => ({ text, bucket: "perpetuating" as const })),
    ...a.prot.map((text) => ({ text, bucket: "protective" as const })),
    ...a.dist.map((text) => ({ text, bucket: "distractor" as const })),
  ];
  const factors: FormulationFactor[] = seededShuffle(raw, a.id).map((f, i) => ({ id: `${a.id}-${i + 1}`, ...f }));
  const tags: FormulationTags = {
    topic: a.topic,
    difficulty: a.lv,
    objective: a.obj,
    exams: a.ex,
    module: a.mod,
    diagnosis: a.dx,
  };
  return { id: a.id, title: a.title, prompt: PROMPT, hint: a.hint, factors, modelNarrative: a.model, tags };
}
