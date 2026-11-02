/**
 * Learn content model. Every question carries two explanations:
 * - `student`: plain words, one or two short lines.
 * - `clinician`: the clinical/medical framing a doctor would use.
 * The player shows one or the other from the Student / Clinician switch.
 */

type Base = { id: string; student: string; clinician: string };

export type McqItem = Base & { kind: "mcq"; prompt: string; vignette?: string; options: string[]; answer: number };
export type TfItem = Base & { kind: "tf"; statement: string; answer: boolean };
export type MatchItem = Base & { kind: "match"; prompt: string; pairs: [string, string][] };
export type OrderItem = Base & { kind: "order"; prompt: string; steps: string[] };
export type SortItem = Base & { kind: "sort"; prompt: string; buckets: [string, string]; items: [string, 0 | 1][] };

export type Item = McqItem | TfItem | MatchItem | OrderItem | SortItem;

export type Lesson = { id: string; title: string; goal: string; items: Item[] };
export type Unit = {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  tone: "blue" | "lime" | "ink";
  lessons: Lesson[];
};

/* Tiny builders keep the content files readable. */
export const mcq = (id: string, prompt: string, options: string[], answer: number, student: string, clinician: string, vignette?: string): McqItem => ({
  kind: "mcq",
  id,
  prompt,
  options,
  answer,
  student,
  clinician,
  ...(vignette ? { vignette } : {}),
});
export const tf = (id: string, statement: string, answer: boolean, student: string, clinician: string): TfItem => ({
  kind: "tf",
  id,
  statement,
  answer,
  student,
  clinician,
});
export const match = (id: string, prompt: string, pairs: [string, string][], student: string, clinician: string): MatchItem => ({
  kind: "match",
  id,
  prompt,
  pairs,
  student,
  clinician,
});
export const order = (id: string, prompt: string, steps: string[], student: string, clinician: string): OrderItem => ({
  kind: "order",
  id,
  prompt,
  steps,
  student,
  clinician,
});
export const sort = (id: string, prompt: string, buckets: [string, string], items: [string, 0 | 1][], student: string, clinician: string): SortItem => ({
  kind: "sort",
  id,
  prompt,
  buckets,
  items,
  student,
  clinician,
});
