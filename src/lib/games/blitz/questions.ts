/**
 * The Blitz question bank: the Learn quick questions (true/false and short
 * four-option picks) plus one "which diagnosis needs this?" fact per
 * diagnosis on the games list. Pure; the server picks and shuffles with a
 * secret seed, and the browser only ever sees the prompt and the options.
 */

import { ALL_LESSONS, BLITZ_ITEMS } from "@/lib/learn/content";
import { DIAGNOSES, type Diagnosis } from "../diagnoses";
import { hash32, mulberry32, permutation } from "../rng";
import type { Exam, Level } from "../tags";
import { FACTS_1 } from "./facts-1";
import { FACTS_2 } from "./facts-2";
import { FACTS_3 } from "./facts-3";
import { FACTS_4 } from "./facts-4";
import { FACTS_5 } from "./facts-5";

export type BlitzQuestion = {
  id: string;
  kind: "tf" | "pick";
  prompt: string;
  options: string[];
  /** Index into options. */
  answer: number;
  /** One plain line shown when you get it wrong. */
  why: string;
  /** What the "Learn this" link opens in the Quick Reference. */
  learn: string;
  /** Tags (always set on the hand-written fast facts, "f:" ids). */
  topic?: string;
  level?: Level;
  objective?: string;
  exams?: Exam[];
  /** Study module id (/study/<id>). */
  module?: string;
};

/** What the browser gets: no answer, no explanation. */
export type BlitzPrompt = { n: number; kind: BlitzQuestion["kind"]; prompt: string; options: string[] };

const LESSON_OF = new Map<string, string>();
for (const l of ALL_LESSONS) for (const it of l.items) LESSON_OF.set(it.id, l.title);

function short(s: string, max: number) {
  return s.length <= max;
}

function fromLearn(): BlitzQuestion[] {
  const out: BlitzQuestion[] = [];
  for (const it of BLITZ_ITEMS) {
    if (it.kind === "tf") {
      out.push({ id: `l:${it.id}`, kind: "tf", prompt: it.statement, options: ["True", "False"], answer: it.answer ? 0 : 1, why: it.student, learn: LESSON_OF.get(it.id) ?? it.statement });
    } else if (it.kind === "mcq" && !it.vignette && it.options.length === 4 && short(it.prompt, 160) && it.options.every((o) => short(o, 80))) {
      out.push({ id: `l:${it.id}`, kind: "pick", prompt: it.prompt, options: [...it.options], answer: it.answer, why: it.student, learn: it.options[it.answer] });
    }
  }
  return out;
}

function capital(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

/** Three look-alikes: same chapter first, then the neighbours on the list. Deterministic. */
function distractors(dx: Diagnosis, all: Diagnosis[]): Diagnosis[] {
  const same = all.filter((x) => x.chapter === dx.chapter && x.id !== dx.id);
  const at = all.findIndex((x) => x.id === dx.id);
  const near = [...all.slice(at + 1), ...all.slice(0, at)].filter((x) => x.chapter !== dx.chapter);
  const r = mulberry32(hash32(dx.id));
  const pool = [...same].sort(() => r() - 0.5);
  return [...pool, ...near].slice(0, 3);
}

function fromDiagnoses(): BlitzQuestion[] {
  return DIAGNOSES.map((dx) => {
    const opts = [dx, ...distractors(dx, DIAGNOSES)];
    return {
      id: `d:${dx.id}`,
      kind: "pick" as const,
      prompt: `Which diagnosis needs this? ${capital(dx.needs)}`,
      options: opts.map((o) => o.name),
      answer: 0,
      why: `${dx.name} needs ${dx.needs}`,
      learn: dx.name,
    };
  });
}

/** The hand-written fast facts. */
export const BLITZ_FACTS: BlitzQuestion[] = [...FACTS_1, ...FACTS_2, ...FACTS_3, ...FACTS_4, ...FACTS_5];

export const BLITZ_QUESTIONS: BlitzQuestion[] = [...fromLearn(), ...fromDiagnoses(), ...BLITZ_FACTS];

/**
 * Question `n` of a run: a seeded deck order, then the options shuffled per
 * question (true/false keeps True first so the keys stay the same).
 */
export function questionAt(seed: number, n: number, bank: BlitzQuestion[] = BLITZ_QUESTIONS): BlitzQuestion {
  const order = permutation(seed, bank.length);
  const q = bank[order[n % bank.length]];
  if (q.kind === "tf") return q;
  const p = permutation((seed ^ Math.imul(n + 1, 0x9e3779b1)) >>> 0, q.options.length);
  return { ...q, options: p.map((k) => q.options[k]), answer: p.indexOf(q.answer) };
}

export function promptOf(q: BlitzQuestion, n: number): BlitzPrompt {
  return { n, kind: q.kind, prompt: q.prompt, options: q.options };
}
